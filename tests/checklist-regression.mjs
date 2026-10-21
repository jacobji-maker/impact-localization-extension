/** Isolated MV3 Checklist document checks; never Impact/Shopify live acceptance. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, cpSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const sourceDir = path.join(root, 'impact-cn-mod');
const assetsOnly = process.argv.includes('--assets-contract-only');
const reportArgument = process.argv.find(value => value.startsWith('--report-dir='))?.slice('--report-dir='.length);
const assetOrigin = 'https://ui.assets.impact.com';
const clone = value => JSON.parse(JSON.stringify(value));

function workerVM(source) {
  let listener;
  const sandbox = { URL, importScripts() {}, chrome: { runtime: {
    id: 'fixture-runtime', onMessage: { addListener(callback) { listener = callback; } }
  } } };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: 'background.js', timeout: 1000 });
  assert.equal(typeof listener, 'function', 'Worker VM listener missing');
  return {
    sandbox,
    paths: () => Array.from(vm.runInContext('checklistAssetPaths', sandbox)),
    query(sender) {
      let response;
      assert.equal(listener({ type: 'impact-cn:checklist-frame-context' }, sender, value => { response = value; }), false);
      assert.equal(typeof response.allowed, 'boolean', 'Worker context must return a boolean decision');
      assert.deepEqual(Object.keys(response), response.allowed ? ['allowed', 'topPath'] : ['allowed']);
      if (response.allowed) {
        const top = new URL(sender.tab.url);
        assert.equal(response.topPath, top.pathname === '/secure/advertiser/checklist/checklist-instance.ihtml'
          ? '/secure/advertiser/checklist/checklist-instance.ihtml' : '/secure/advertiser/engage/checklist/instance/');
      }
      return response.allowed;
    }
  };
}

function readOriginalAssets() {
  const manifestSource = readFileSync(path.join(sourceDir, 'manifest.json'), 'utf8');
  const configSource = readFileSync(path.join(sourceDir, 'site-config.js'), 'utf8');
  const workerSource = readFileSync(path.join(sourceDir, 'background.js'), 'utf8');
  const configSandbox = {};
  vm.createContext(configSandbox);
  vm.runInContext(configSource, configSandbox, { filename: 'site-config.js', timeout: 1000 });
  const worker = workerVM(workerSource);
  return {
    contract: { manifest: JSON.parse(manifestSource), config: clone(configSandbox.IMPACT_CN_CONFIG), workerPaths: worker.paths() },
    worker, workerSource,
    sourceSHA256: Object.fromEntries([['manifest.json', manifestSource], ['site-config.js', configSource], ['background.js', workerSource]]
      .map(([name, source]) => [name, createHash('sha256').update(source).digest('hex')]))
  };
}

function assetGroup(manifest) {
  const groups = manifest.content_scripts.filter(item => item.matches.some(value => value.includes('ui.assets.impact.com')));
  assert.equal(groups.length, 1, 'manifest assets group must be unique');
  return groups[0];
}

function assertAssetsContract({ manifest, config, workerPaths }) {
  const checklist = config.localization.checklist, paths = checklist.assetPaths;
  assert(Array.isArray(paths) && paths.length === 4, 'config assets count must be four');
  assert.equal(new Set(paths).size, 4, 'config assets duplicate');
  assert(paths.every(value => typeof value === 'string' && value.startsWith('/onboarding-ui/checklist-assets/production/')
    && value.endsWith('.html') && !/[?#*\\\s]/u.test(value)), 'config assets must be exact paths');
  const matches = assetGroup(manifest).matches;
  assert.equal(matches.length, 4, 'manifest assets count must be four');
  assert.equal(new Set(matches).size, 4, 'manifest assets duplicate');
  assert.deepEqual([...matches].sort(), paths.map(value => assetOrigin + value + '*').sort(), 'manifest/config assets differ');
  assert.equal(workerPaths.length, 4, 'worker assets count must be four');
  assert.equal(new Set(workerPaths).size, 4, 'worker assets members must be unique');
  assert.deepEqual([...workerPaths].sort(), [...paths].sort(), 'worker/config assets differ');
  for (const value of paths) {
    const roots = checklist.documentRoots?.[value];
    assert(Array.isArray(roots) && roots.length > 0 && roots.every(root => typeof root === 'string' && root.trim()), 'asset document roots missing or empty: ' + value);
  }
  assert.deepEqual(manifest.permissions, ['storage']); assert.equal(manifest.host_permissions, undefined);
  assert(manifest.content_scripts.some(item => item.match_origin_as_fallback === true && item.matches.includes('https://demo.impact.com/*')));
}

function assertMemoryMutations(original) {
  const initial = JSON.stringify(original.contract), first = original.contract.config.localization.checklist.assetPaths[0];
  const cases = [
    ['manifest missing path', data => assetGroup(data.manifest).matches.pop(), /manifest assets count/u],
    ['manifest changed path', data => { assetGroup(data.manifest).matches[0] = assetOrigin + first.replace('.html', '-other.html') + '*'; }, /manifest\/config assets differ/u],
    ['manifest duplicate path', data => { const values = assetGroup(data.manifest).matches; values[1] = values[0]; }, /manifest assets duplicate/u],
    ['config missing path', data => data.config.localization.checklist.assetPaths.pop(), /config assets count/u],
    ['config changed path', data => { data.config.localization.checklist.assetPaths[0] = first.replace('.html', '-other.html'); }, /manifest\/config assets differ/u],
    ['config duplicate path', data => { const values = data.config.localization.checklist.assetPaths; values[1] = values[0]; }, /config assets duplicate/u],
    ...[['worker missing path', null, /worker assets count/u], ['worker changed path', first.replace('.html', '-other.html'), /worker\/config assets differ/u]].map(([name, replacement, message]) => [
      name, data => {
        const worker = workerVM(original.workerSource);
        vm.runInContext('checklistAssetPaths.delete(' + JSON.stringify(first) + ')', worker.sandbox);
        if (replacement) vm.runInContext('checklistAssetPaths.add(' + JSON.stringify(replacement) + ')', worker.sandbox);
        data.workerPaths = worker.paths();
      }, message
    ]),
    ['missing component roots', data => { delete data.config.localization.checklist.documentRoots[first]; }, /asset document roots/u],
    ['empty component roots', data => { data.config.localization.checklist.documentRoots[first] = []; }, /asset document roots/u]
  ];
  for (const [name, mutate, message] of cases) {
    const changed = clone(original.contract);
    mutate(changed); // Setup/VM errors escape; only the specified contract assertion counts.
    assert.throws(() => assertAssetsContract(changed), { code: 'ERR_ASSERTION', message }, name);
  }
  assert.equal(JSON.stringify(original.contract), initial, 'Original asset snapshot was mutated');
  assertAssetsContract(original.contract);
  return cases.map(([name]) => name);
}

function assertWorkerContexts(original) {
  const { assetPaths, topPath, topPathExact } = original.contract.config.localization.checklist;
  const good = { id: 'fixture-runtime', frameId: 1, documentId: 'fixture-document',
    url: assetOrigin + assetPaths[0] + '?fixture=1', tab: { id: 1, url: 'https://demo.impact.com' + topPath + 'fixture' } };
  let allowed = 0, rejected = 0;
  for (const pathname of assetPaths) {
    for (const hostname of ['demo.impact.com', 'app.impact.com']) for (const search of ['', '?fixture=1']) for (const entry of [topPath + 'fixture', topPathExact]) {
      assert.equal(original.worker.query({ ...good, url: assetOrigin + pathname + search, tab: { id: 1, url: 'https://' + hostname + entry } }), true);
      allowed++;
    }
    for (const suffix of ['-other', '/extra']) {
      assert.equal(original.worker.query({ ...good, url: assetOrigin + pathname + suffix + '?fixture=1' }), false);
      rejected++;
    }
  }
  const updates = [
    { id: 'other-runtime' }, { frameId: 0 }, { documentId: undefined }, { documentId: '' }, { tab: { url: good.tab.url } },
    { url: 'http://ui.assets.impact.com' + assetPaths[0] }, { url: 'https://demo.impact.com/secure/advertiser/checklist/website-tracking-checklist-flow.ihtml' },
    { url: 'https://other.example' + assetPaths[0] }, { url: 'invalid-url' },
    { tab: { id: 1, url: 'https://demo.impact.com/secure/advertiser/engage/aview.ihtml' } },
    { tab: { id: 1, url: 'https://other.example' + topPath + 'fixture' } },
    { tab: { id: 1, url: 'http://demo.impact.com' + topPath + 'fixture' } }
  ];
  for (const update of updates) { assert.equal(original.worker.query({ ...good, ...update }), false); rejected++; }
  return { allowedCases: allowed, rejectedCases: rejected, onlyDecisionAndFixedPublicRouteReplies: true };
}

async function runAssetChecks(check, original, mutations = false) {
  await check('Manifest adds only four asset candidates and origin fallback without new API permissions', () => {
    assertAssetsContract(original.contract);
    const rejectedMutations = mutations ? assertMemoryMutations(original) : [];
    return { paths: original.contract.config.localization.checklist.assetPaths, componentRootsCovered: 4, rejectedMutations };
  });
  await check('The shipped worker validates source sender and tab metadata and returns only decision and fixed public route', () => assertWorkerContexts(original));
}

async function runAssetsOnly() {
  const results = [];
  let original;
  async function check(name, action) {
    try { const evidence = await action(); results.push({ name, status: 'PASS', evidence }); console.log('CHECKLIST DATA/VM PASS ' + name); }
    catch (error) { results.push({ name, status: 'FAIL', evidence: error.stack || error.message }); console.log('CHECKLIST DATA/VM FAIL ' + name + ': ' + error.message); }
  }
  try { original = readOriginalAssets(); await runAssetChecks(check, original, true); }
  catch (error) { results.push({ name: 'Original assets source/VM setup', status: 'FAIL', evidence: error.stack || error.message }); }
  const status = results.length === 2 && results.every(item => item.status === 'PASS') ? 'PASS' : 'FAIL';
  const folder = reportArgument ? path.resolve(root, reportArgument) : path.join(root, 'artifacts/checklist-tests');
  mkdirSync(folder, { recursive: true });
  const report = { mode: 'ASSETS_DATA_VM_ONLY', version: original?.contract.manifest.version || null,
    realSiteAcceptance: false, realNetworkQueries: false, browserLoaded: false, dictionaryLoaded: false,
    sourceSHA256: original?.sourceSHA256 || null, status, results };
  const reportPath = path.join(folder, 'assets-contract-' + new Date().toISOString().replace(/[:.]/gu, '-') + '.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
  console.log('Checklist assets report: ' + reportPath);
  console.log('CHECKLIST DATA/VM ' + status + ': ' + results.filter(item => item.status === 'PASS').length + '/' + results.length);
  assert.equal(status, 'PASS', 'Checklist assets data/VM checks failed');
}

if (assetsOnly) {
  await runAssetsOnly();
} else {
const originalAssets = readOriginalAssets();
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core'))); }
const workspace = mkdtempSync(path.join(os.tmpdir(), 'impact-checklist-mechanism-'));
const extension = path.join(workspace, 'extension');
cpSync(path.join(root, 'impact-cn-mod'), extension, { recursive: true });
const manifest = clone(originalAssets.contract.manifest);
const config = clone(originalAssets.contract.config);
const topPath = config.localization.checklist.topPath;
const assetPath = '/onboarding-ui/checklist-assets/production/operator-json/linkout.html';
const nativePath = '/secure/advertiser/checklist/website-tracking-checklist-flow.ihtml';
const source = 'Synthetic Checklist Label', target = '合成清单文案';
// Test-only body roots exercise document gating without claiming real DOM coverage.
config.localization.checklist.documentRoots[assetPath] = ['#app'];
config.localization.checklist.documentRoots[nativePath] = ['#fixture-native-root'];
config.localization.checklist.reviewRoots = ['#fixture-review-root'];
const common = { topPath, checklistFrame: true, selector: '.fixture-static' };
const entries = [
  { id: 'checklist-fixture-top', source, target, scope: { hosts: ['demo.impact.com'], path: topPath, topOnly: true, selector: '#checklist-outer-container .fixture-top' } },
  { id: 'checklist-fixture-asset', source, target, helpTopicId: 'checklist-fixture-topic', scope: { ...common, hosts: ['ui.assets.impact.com'], pathExact: assetPath } },
  { id: 'checklist-fixture-native', source, target, scope: { ...common, hosts: ['demo.impact.com'], pathExact: nativePath } },
  { id: 'checklist-fixture-review', source, target, helpTopicId: 'checklist-fixture-topic', scope: { ...common, hosts: ['demo.impact.com'], documentUrlExact: 'about:srcdoc' } },
  { id: 'checklist-fixture-review-count', source: '{minutes} mins', target: '{minutes} 分钟', match: 'numeric-template', scope: { ...common, hosts: ['demo.impact.com'], documentUrlExact: 'about:srcdoc', selector: '.fixture-count' } },
  { id: 'checklist-fixture-unscoped', source: 'Unscoped fixture label', target: '不应翻译' }
];
const topic = { id: 'checklist-fixture-topic', entryIds: ['checklist-fixture-asset', 'checklist-fixture-review'], question: 'Synthetic fixture question', helpUrl: 'https://help.impact.com/' };
writeFileSync(path.join(extension, 'dict.js'), `globalThis.IMPACT_CN_DICTIONARY=${JSON.stringify({ version: manifest.version, entries, helpTopics: [topic] })};\n`);
// This bridge is appended only to the temporary test adapter, never product code.
writeFileSync(path.join(extension, 'site-config.js'), `globalThis.IMPACT_CN_CONFIG=${JSON.stringify(config)};
window.addEventListener('message', async event => {
  if(event.source!==window || !event.data?.__checklistUnitProbe) return;
  const {token, action, enabled}=event.data.__checklistUnitProbe;
  if(action==='context') { const result=await chrome.runtime.sendMessage({type:'impact-cn:checklist-frame-context'});window.postMessage({__checklistUnitResult:{token,result}},'*');return; }
  if(!globalThis.ImpactCN) { window.postMessage({__checklistUnitResult:{token,result:{injected:false}}},'*'); return; }
  await globalThis.ImpactCN.ready;
  let result;
  if(action==='state') result=globalThis.ImpactCN.getState();
  else if(action==='settings') { await chrome.storage.local.set({impactCNEnabled:enabled}); result={ok:true}; }
  else if(action==='ask') result=await globalThis.ImpactCN.askTopic('checklist-fixture-topic');
  window.postMessage({__checklistUnitResult:{token,result}},'*');
});\n`);

const fixtureBody = id => `<!doctype html><body data-impact-cn-demo><main id="${id}"><button type="button" class="fixture-static">${source}</button><span class="fixture-count">12 mins</span><input id="fixture-input" value="${source}"><div class="partner-name"><span class="fixture-static">${source}</span></div><span>Unscoped fixture label</span></main><script>
const element=document.querySelector('button.fixture-static');
window.__checklistFixture={element,text:element.firstChild,attributes:JSON.stringify([...element.attributes].map(attribute=>[attribute.name,attribute.value])),clicks:0};
element.addEventListener('click',()=>window.__checklistFixture.clicks++);
</script></body>`;
const fixtureTop = `<!doctype html><body><div id="checklist-outer-container"><div class="checklist-container iui-component"><h2 class="fixture-top">${source}</h2><div class="right-section-outermost-container"><div class="checklist-right-section"><div id="screen-outer-div"></div></div></div></div></div></body>`;
const results = [];
let context, page, probeSequence = 0;
async function check(name, action) {
  try { await action(); results.push({ name, status: 'PASS' }); console.log('CHECKLIST UNIT PASS ' + name); }
  catch (error) { results.push({ name, status: 'FAIL', evidence: error.message }); console.log('CHECKLIST UNIT FAIL ' + name + ': ' + error.message); }
}
async function probe(frame, action = 'state', enabled = true) {
  return frame.locator('body').evaluate((_body, request) => new Promise((resolve, reject) => {
    const timer=setTimeout(()=>{window.removeEventListener('message', listener);reject(new Error('Fixture isolated-world probe timed out'));},5000);
    const listener=event=>{if(event.source!==window||event.data?.__checklistUnitResult?.token!==request.token)return;clearTimeout(timer);window.removeEventListener('message',listener);resolve(event.data.__checklistUnitResult.result);};
    window.addEventListener('message',listener);window.postMessage({__checklistUnitProbe:request},'*');
  }), { token: ++probeSequence, action, enabled });
}
async function openTop(pathname = topPath + 'fixture-one') {
  await page.goto('https://demo.impact.com' + pathname);
  await page.locator('#impact-cn-assistant').waitFor();
  await probe(page, 'settings', true);
}
async function mountFrame({ url, srcdoc, validSlot = true, sandbox } = {}) {
  await page.locator('#screen-outer-div').evaluate((slot, options) => {
    slot.replaceChildren();
    const frame=document.createElement('iframe');frame.id=options.validSlot?'iframe':'unrecognized-frame';frame.name='screenIframe';frame.className='checklist-iframe';
    if(options.sandbox!==undefined)frame.setAttribute('sandbox',options.sandbox);
    if(options.srcdoc!==undefined)frame.srcdoc=options.srcdoc;else frame.src=options.url;
    slot.append(frame);
  }, { url, srcdoc, validSlot, sandbox });
  const frame = page.locator('#screen-outer-div > iframe').contentFrame();
  await frame.locator('button.fixture-static').waitFor();
  return frame;
}
async function waitText(frame, value) { await frame.locator('button.fixture-static').filter({ hasText: value }).waitFor(); }
async function assertPreserved(frame) {
  assert(await frame.locator('button.fixture-static').evaluate(element => element===window.__checklistFixture.element && element.firstChild===window.__checklistFixture.text && JSON.stringify([...element.attributes].map(attribute=>[attribute.name,attribute.value]))===window.__checklistFixture.attributes));
  assert.equal(await frame.locator('#fixture-input').inputValue(), source);
  assert.equal(await frame.locator('.partner-name').innerText(), source);
  await frame.locator('button.fixture-static').click();
  assert.equal(await frame.locator('body').evaluate(()=>window.__checklistFixture.clicks),1);
}

try {
  await runAssetChecks(check, originalAssets);
  context=await chromium.launchPersistentContext(path.join(workspace,'profile'),{executablePath:chromium.executablePath(),channel:'chromium',headless:true,args:[`--disable-extensions-except=${extension}`,`--load-extension=${extension}`]});
  await context.route('https://demo.impact.com/**',route=>route.fulfill({contentType:'text/html',body:new URL(route.request().url()).pathname===nativePath?fixtureBody('fixture-native-root'):fixtureTop}));
  await context.route('https://ui.assets.impact.com/**',route=>route.fulfill({contentType:'text/html',body:fixtureBody('app')}));
  page=context.pages()[0]||await context.newPage();page.setDefaultTimeout(7000);

  await check('Dynamic Checklist shell translates and the query-bearing asset frame preserves native Text and controls',async()=>{
    await openTop();await page.locator('.fixture-top').filter({hasText:target}).waitFor();
    const frame=await mountFrame({url:'https://ui.assets.impact.com'+assetPath+'?checklistInstanceId=fixture&checkBoxId=fixture&_imenvt_=fixture'});
    await waitText(frame,target);await assertPreserved(frame);
    assert.equal((await probe(frame,'context')).allowed,true);assert.equal((await probe(page,'context')).allowed,false);
    assert.equal(await frame.locator('#impact-cn-assistant').count(),0);assert.equal(await page.locator('#impact-cn-assistant').count(),1);
    assert.equal(await frame.locator('[data-impact-cn-help]').count(),0);assert.equal((await probe(frame,'ask')).reason,'translation-only');
    assert.equal(await frame.locator('main > span').last().innerText(),'Unscoped fixture label');
    await probe(page,'settings',false);await waitText(frame,source);await probe(page,'settings',true);await waitText(frame,target);
  });
  await check('Asset permission follows the actual tab route and restores when the parent leaves Checklist',async()=>{
    const frame=page.frames().find(item=>item.url().startsWith('https://ui.assets.impact.com'));
    await page.evaluate(()=>history.pushState({},'', '/secure/advertiser/engage/aview.ihtml'));
    await waitText(frame,source);
    await page.evaluate(topPath=>history.pushState({},'',topPath+'fixture-two'),topPath);
    await waitText(frame,target);
  });
  await check('Asset suffix candidates and top-level asset pages cannot use the fixture marker to bypass the entry gate',async()=>{
    await openTop();const frame=await mountFrame({url:'https://ui.assets.impact.com'+assetPath+'-other?fixture=1'});
    await waitText(frame,source);assert.equal((await probe(frame)).injected,false);
    assert.equal((await probe(frame,'context')).allowed,false);
    const assetTab=await context.newPage();await assetTab.goto('https://ui.assets.impact.com'+assetPath+'?fixture=top');
    assert.equal((await probe(assetTab)).injected,false);await assetTab.close();
  });
  await check('The same allowed asset document stays English outside the Checklist tab route',async()=>{
    await openTop('/secure/advertiser/engage/aview.ihtml');
    const frame=await mountFrame({url:'https://ui.assets.impact.com'+assetPath+'?fixture=wrong-top'});
    await waitText(frame,source);assert.equal((await probe(frame)).translatedCount,0);assert.equal((await probe(frame,'context')).allowed,false);
  });
  await check('A same-origin native Checklist document requires the original frame slot and dynamic parent path',async()=>{
    await openTop(topPath+'fixture-three');let frame=await mountFrame({url:'https://demo.impact.com'+nativePath+'?fixture=1'});
    await waitText(frame,target);await assertPreserved(frame);
    frame=await mountFrame({url:'https://demo.impact.com'+nativePath+'?fixture=2',validSlot:false});
    await waitText(frame,source);assert.equal((await probe(frame)).translatedCount,0);
  });
  await check('Review srcdoc uses its verified parent, preserves counts and never creates AI controls',async()=>{
    await openTop();const frame=await mountFrame({srcdoc:fixtureBody('fixture-review-root'),sandbox:'allow-forms allow-scripts allow-same-origin allow-top-navigation allow-modals allow-presentation allow-downloads allow-popups allow-popups-to-escape-sandbox'});
    await waitText(frame,target);assert.equal(await frame.locator('.fixture-count').innerText(),'12 分钟');await assertPreserved(frame);
    assert.equal(await frame.locator('#impact-cn-assistant,[data-impact-cn-help]').count(),0);assert.equal((await probe(frame,'ask')).reason,'translation-only');
    await probe(page,'settings',false);await waitText(frame,source);assert.equal(await frame.locator('.fixture-count').innerText(),'12 mins');
    await probe(page,'settings',true);await waitText(frame,target);
    await page.evaluate(()=>history.pushState({},'', '/secure/advertiser/engage/aview.ihtml'));await waitText(frame,source);
    await page.evaluate(topPath=>history.pushState({},'',topPath+'fixture-four'),topPath);await waitText(frame,target);
  });
  await check('Arbitrary srcdoc, wrong parents and sandboxed Review stay outside localization',async()=>{
    await openTop();let frame=await mountFrame({srcdoc:fixtureBody('fixture-review-root'),validSlot:false});
    await waitText(frame,source);assert.equal((await probe(frame)).injected,false);
    await openTop('/secure/advertiser/engage/aview.ihtml');frame=await mountFrame({srcdoc:fixtureBody('fixture-review-root')});
    await waitText(frame,source);assert.equal((await probe(frame)).injected,false);
    await openTop();frame=await mountFrame({srcdoc:fixtureBody('fixture-review-root'),sandbox:'allow-scripts'});
    await waitText(frame,source);assert.equal((await probe(frame)).injected,false);
  });
} finally {
  await context?.close();
  const folder=path.join(root,'artifacts/checklist-tests');mkdirSync(folder,{recursive:true});
  const report={mode:'SYNTHETIC_CHECKLIST_MV3_DOCUMENTS',version:manifest.version,realSiteAcceptance:false,realNetworkQueries:false,status:results.some(item=>item.status==='FAIL')?'FAIL':'PASS',results};
  const reportPath=path.join(folder,'mechanism-'+new Date().toISOString().replace(/[:.]/gu,'-')+'.json');
  writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');console.log('Checklist report: '+reportPath);
  rmSync(workspace,{recursive:true,force:true});
}
assert(results.length===9&&results.every(item=>item.status==='PASS'),'Checklist mechanism checks failed');
}

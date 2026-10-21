/** Public creator-search Light DOM projection in an isolated MV3 profile; all network is intercepted. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, cpSync, rmSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const arg = name => process.argv.find(value => value.startsWith(name + '='))?.slice(name.length + 1);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const sourceDir = path.resolve(root, arg('--source-dir') || 'impact-cn-mod');
const reportDir = path.resolve(root, arg('--report-dir') || 'artifacts/093-demogc-creator-20261020');
const capturePath = path.resolve(root, arg('--capture') || 'artifacts/093-demogc-creator-20261020/live-public-capture-complete.json');
const baseline = process.argv.includes('--baseline-observation');
const requireSourceUnchanged = process.argv.includes('--require-source-unchanged');
const testSHA256 = sha(readFileSync(fileURLToPath(import.meta.url)));
const captureBytes = readFileSync(capturePath), capture = JSON.parse(captureBytes);
const expected = new Map([
  ['Creator Search /', '创作者搜索 /'], ['Followers', '粉丝数'],
  ['Handle', '账号用户名'], ['Keyword', '关键词'], ['Engagement Rate', '互动率'],
  ['Creator’s Country', '创作者所在国家/地区'], ['Additional Filters', '更多筛选'],
  ['Get Results', '获取结果'], ['Clear All', '清除全部筛选'], ['Average Likes', '平均点赞数'],
  ['Start searching for', '开始寻找'], ['creators', '创作者'],
  ['in the marketplace and beyond', '，范围涵盖平台内外'],
  ['Select a filter and click', '选择筛选条件，然后点击'], ['to get started.', '即可开始。']
]);
const E = (tag, attrs = {}, children = []) => ({ tag, attrs, children });
const T = (text, fixedKey) => ({ text, ...(fixedKey ? { fixedKey } : {}) });
const walk = (node, action) => { action(node); for (const child of [...node.children || [], ...node.shadow || []]) walk(child, action); };
const scriptJSON = value => JSON.stringify(value).replaceAll('<', '\\u003c');
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

// The coordinator supplies only current public roles and ancestry. The shipped
// dictionary is never read to generate fixture selectors or expected wording.
const pages = capture.pages;
assert(Array.isArray(pages) && pages.length === 1, 'One current creator-search public projection is required');
for (const page of pages) {
  assert(page.id && page.pathExact?.startsWith('/') && page.tree && page.fixedText?.length, 'Incomplete captured component ' + page.id);
  assert(page.provenance, 'Projection provenance is required: ' + page.id);
  const nodes = [];
  walk(page.tree, node => { if (node.fixedKey) nodes.push(node); });
  assert.equal(nodes.length, page.fixedText.length, 'Captured labels and projected Texts differ: ' + page.id);
  for (const label of page.fixedText) {
    assert(expected.has(label.source.trim()), 'Missing independent target: ' + label.source);
    const matching = nodes.filter(node => node.fixedKey === label.key);
    assert.equal(matching.length, 1, 'A captured key must identify one Text: ' + label.key);
    assert.equal(matching[0].text, label.rawText ?? label.source, 'Raw captured Text mismatch: ' + label.key);
  }
}
const positionCount = pages.reduce((sum, page) => sum + page.fixedText.length, 0);
const uniquePositionCount = new Set(pages.flatMap(page => page.fixedText.map(label => label.key))).size;
assert.equal(positionCount, 16, 'This complete batch has sixteen observed Text positions');
const uniqueSourceCount = new Set(pages.flatMap(page => page.fixedText.map(label => label.source))).size;
assert.equal(uniqueSourceCount, 15, 'Fifteen unique English sources are expected');
const creatorPage = pages[0];
assert.equal(creatorPage.kind, 'creator-search');
assert.equal(creatorPage.pathExact, '/secure/advertiser/discover/fr/discover/creator-rt-searches.ihtml');
const expectation = (label, translated = true) => {
  const raw = label.rawText ?? label.source;
  return translated ? raw.replace(label.source.trim(), expected.get(label.source.trim())) : raw;
};
function boundariesFor() {
  return [
    { id: 'wrong-creator-root', mutate: { attribute: 'id', from: 'pd-creator-rt-search-ui', to: 'synthetic-other-creator-root' } },
    { id: 'wrong-app-owner', mutate: { attribute: 'id', from: 'app', to: 'synthetic-other-app' } },
    { id: 'wrong-exact-path', pathExact: '/secure/advertiser/discover/fr/discover/synthetic-creator-search.ihtml' },
    { id: 'wrong-breadcrumb-owner', translated: true, mutate: { classFrom: 'creator-table-header', classTo: 'synthetic-other-header' }, overrides: { 'creator-fixed-01': 'Creator Search /' } },
    { id: 'wrong-filter-component', translated: true, mutate: { classFrom: 'filter-section', classTo: 'synthetic-other-filters' }, overrides: Object.fromEntries(creatorPage.fixedText.filter(label => Number(label.key.slice(-2)) >= 2 && Number(label.key.slice(-2)) <= 9).map(label => [label.key, label.rawText])) },
    { id: 'wrong-fixed-text-parent', translated: true, mutate: { fixedKey: 'creator-fixed-02', parentTag: 'em' }, overrides: { 'creator-fixed-02': 'Followers' } }
  ];
}
const sourceFiles = readdirSync(sourceDir, { recursive: true }).filter(file => path.basename(file) !== '.DS_Store' && statSync(path.join(sourceDir, file)).isFile());
const sourceHashes = Object.fromEntries(sourceFiles.map(file => [file, sha(readFileSync(path.join(sourceDir, file)))]));
const version = JSON.parse(readFileSync(path.join(sourceDir, 'manifest.json'))).version;
const inputBytes = Buffer.from(JSON.stringify({ schemaVersion: 1, pages, positionCount, uniqueSourceCount, network: 'All HTTP(S) requests intercepted; no real iframe or platform content is fetched.', scope: 'Public minimum projections plus fabricated preservation values. No real account/Program names, selected values or AI conversation.' }, null, 2) + '\n');
const expectationBytes = Buffer.from(JSON.stringify({ items: pages.flatMap(page => page.fixedText.map(label => ({ page: page.id, key: label.key, source: label.rawText ?? label.source, target: expectation(label) }))) }, null, 2) + '\n');

function html(page, variant = {}) {
  const tree = structuredClone(page.tree);
  if (variant.mutate) {
    const { attribute, from, to, classFrom, classTo, fixedKey, parentTag } = variant.mutate;
    walk(tree, node => {
      if (attribute && node.attrs?.[attribute] === from) node.attrs[attribute] = to;
      if (classFrom && node.attrs?.class?.split(/\s+/u).includes(classFrom)) node.attrs.class = node.attrs.class.split(/\s+/u).map(value => value === classFrom ? classTo : value).join(' ');
      if (parentTag && node.children?.some(child => child.fixedKey === fixedKey)) node.tag = parentTag;
    });
  }
  const capturedBodyClasses = Array.isArray(page.bodyClasses) ? page.bodyClasses.join(' ') : page.bodyClasses || 'vnext-dark';
  const bodyClasses = variant.bodyClasses || capturedBodyClasses;
  if (variant.historicalShadow) walk(tree, node => {
    if (node.attrs?.id === 'pd-creator-rt-search-ui') { node.shadow = node.children; node.children = []; }
  });
  return `<!doctype html><html><head><meta charset="utf-8"></head><body class="${escape(bodyClasses)}"><script>
  const spec=${scriptJSON(tree)},labels=${scriptJSON(page.fixedText)},kind=${scriptJSON(page.kind)},variant=${scriptJSON(variant)};
  window.__attachShadowPrototype=Element.prototype.attachShadow;
  function construct(s){
    if('comment'in s)return document.createComment(s.comment);
    if('text'in s){const n=document.createTextNode(s.text);if(!s.fixedKey)return n;const f=document.createDocumentFragment();f.append(document.createComment('fixed:'+s.fixedKey),n);return f;}
    const e=document.createElement(s.tag);for(const[k,v]of Object.entries(s.attrs||{}))e.setAttribute(k,v);
    for(const c of s.children||[])e.append(construct(c));
    if(s.shadow){const r=e.attachShadow({mode:'open'});for(const c of s.shadow)r.append(construct(c));}return e;
  }
  // A body projection is an envelope, so the floating host remains a real
  // direct child of the document body rather than an artificial wrapper.
  const makeComponents=()=>spec.tag==='body'?(spec.children||[]).map(construct):[construct(spec)];
  window.__components=makeComponents();document.body.append(...window.__components);
  // Entirely fabricated preservation probes, placed within the qualified root.
  // No real handle, keyword draft, selected country, creator card or result row is read.
  const probes=document.createElement('section');probes.id='synthetic-preservation-probes';
  const handle=document.createElement('input');handle.name='synthetic-handle';handle.value='SYNTHETIC_HANDLE_DRAFT';
  const keyword=document.createElement('textarea');keyword.name='synthetic-keyword';keyword.value='SYNTHETIC_KEYWORD_DRAFT';
  const country=document.createElement('select');country.name='synthetic-country';
  const option=document.createElement('option');option.value='SYNTHETIC_COUNTRY_CODE';option.textContent='SYNTHETIC COUNTRY CHOICE';option.selected=true;country.append(option);
  const check=document.createElement('input');check.type='checkbox';check.checked=true;check.disabled=true;check.value='Followers';
  const action=document.createElement('button');action.type='button';action.textContent='SYNTHETIC NATIVE INSPECT';action.className='synthetic-native-inspect';
  probes.append(handle,keyword,country,check,action);
  for(const text of ['SYNTHETIC CREATOR NAME','USD 1,234.56','2026-10-20','67','Followers','Handle','Keyword','Engagement Rate','Creator’s Country','Additional Filters']){const n=document.createElement('span');n.className='synthetic-private-card-content';n.textContent=text;probes.append(n);}
  document.body.append(probes);
  const ai=document.createElement('div');ai.id='ask-impact-shadow-host';const aiRoot=ai.attachShadow({mode:'open'});const reply=document.createElement('p');reply.textContent='SYNTHETIC AI REPLY / Followers / Handle / Engagement Rate';aiRoot.append(reply);document.body.append(ai);
  const roots=window.__roots=()=>{const out=[];function visit(r){out.push(r);if(r.shadowRoot)visit(r.shadowRoot);for(const e of r.querySelectorAll('*'))if(e.shadowRoot)visit(e.shadowRoot);}for(const r of window.__components)visit(r);return out;};
  const mountProbes=()=>{
    const owner=roots().map(r=>r.matches?.('#pd-creator-rt-search-ui')?r:r.querySelector('#pd-creator-rt-search-ui')).find(Boolean);
    // Wrong-root boundary probes remain within the already qualified outer root.
    const fallback=roots().map(r=>r.matches?.('#app')?r:r.querySelector('#app')).find(Boolean)||window.__components[0];
    (owner?.shadowRoot||owner||fallback).append(probes);
  };mountProbes();
  window.__isOwnedHelp=(e,nodes=window.__proof?.nodes)=>{
    if(e.nodeType!==1||!e.matches('button.impact-cn-inline-help[data-impact-cn-ignore][data-impact-cn-help][data-entry-id][data-topic-id][data-impact-cn-help-topic]')||e.type!=='button'||!e.dataset.entryId||e.dataset.topicId!==e.dataset.impactCnHelpTopic)return false;
    return Object.values(nodes||{}).some(n=>{const label=n.parentElement,interactive=label.closest('a,button,summary');return interactive?e.parentNode===interactive.parentNode&&interactive.nextSibling===e:e.parentNode===label;});
  };
  window.__collect=()=>{
    const nodes={},texts=[],elements=[];for(const r of roots()){if(r.nodeType===Node.ELEMENT_NODE)elements.push(r);elements.push(...r.querySelectorAll('*'));const w=document.createTreeWalker(r,NodeFilter.SHOW_COMMENT);while(w.nextNode())if(w.currentNode.nodeValue.startsWith('fixed:'))nodes[w.currentNode.nodeValue.slice(6)]=w.currentNode.nextSibling;}
    for(const r of [...roots(),reply]){const w=document.createTreeWalker(r,NodeFilter.SHOW_TEXT);while(w.nextNode())if(!Object.values(nodes).includes(w.currentNode))texts.push({node:w.currentNode,value:w.currentNode.nodeValue});}
    elements.push(ai,reply);
    const isOwned=e=>window.__isOwnedHelp(e,nodes);
    window.__proof={nodes,elements:elements.filter(e=>!isOwned(e)).map(element=>({element,parent:element.parentNode,children:[...element.childNodes].filter(n=>!isOwned(n)),attrs:JSON.stringify([...element.attributes].map(a=>[a.name,a.value]))})),texts,controls:elements.filter(e=>e.matches('input,select,textarea')).map(element=>({element,value:element.value,checked:element.checked,disabled:element.disabled,selected:element.tagName==='SELECT'?element.selectedIndex:null})),clicks:0,inputEvents:0};
    for(const n of Object.values(nodes)){const e=n.parentElement;e.addEventListener('click',event=>{event.preventDefault();window.__proof.clicks++;});}
    for(const e of window.__proof.controls.map(x=>x.element))e.addEventListener('input',()=>window.__proof.inputEvents++);action.onclick=event=>{event.preventDefault();window.__proof.clicks++;};
  };window.__collect();
  window.__remount=()=>{for(const old of window.__components)old.remove();window.__components=makeComponents();document.body.append(...window.__components);mountProbes();window.__collect();};
  window.__rewrite=()=>{for(const l of labels)window.__proof.nodes[l.key].nodeValue=l.rawText??l.source;};
  </script></body></html>`;
}

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core'))); }
const temporary = mkdtempSync(path.join(os.tmpdir(), 'impact-demogc-creator-')), extension = path.join(temporary, 'extension');
cpSync(sourceDir, extension, { recursive: true });
for (const [file, hash] of Object.entries(sourceHashes)) assert.equal(sha(readFileSync(path.join(extension, file))), hash);
let context, page, worker, activePage = creatorPage, activeVariant = {};
const results = [], observations = [], network = { interceptedRequests: 0 };
const check = async (name, action) => {
  try { results.push({ name, status: 'PASS', evidence: await action() }); console.log('CREATOR PASS ' + name); }
  catch (error) { results.push({ name, status: 'FAIL', evidence: error.message }); console.log('CREATOR FAIL ' + name + ': ' + error.message); }
};
async function open(item = creatorPage, variant = {}, host = 'demo.impact.com', pathname = item.pathExact) {
  activePage = item; activeVariant = variant;
  const query = new URLSearchParams(item.query || {});
  await page.goto('https://' + host + pathname + (query.size ? '?' + query : ''));
  await page.waitForFunction(() => !!window.__proof);
}
async function settings(enabled, aiEnabled) {
  await worker.evaluate(value => chrome.storage.local.set({ impactCNEnabled: value.enabled, impactCNAIEnabled: value.aiEnabled }), { enabled, aiEnabled });
  await page.waitForFunction(value => { const e = document.querySelector('#impact-cn-assistant'); return !e || e.dataset.enabled === String(value.enabled) && e.dataset.aiEnabled === String(value.aiEnabled); }, { enabled, aiEnabled });
}
async function readText(frame = page) { return frame.evaluate(() => Object.fromEntries(Object.entries(window.__proof.nodes).map(([key, node]) => [key, node.nodeValue]))); }
async function waitText(item, translated = true, frame = page, overrides = {}) {
  const wanted = { ...Object.fromEntries(item.fixedText.map(label => [label.key, expectation(label, translated)])), ...overrides };
  try { await frame.waitForFunction(value => Object.entries(value).every(([key, text]) => window.__proof.nodes[key]?.nodeValue === text), wanted, { timeout: 3500 }); }
  catch (error) { throw new Error(error.message + ' ' + JSON.stringify({ wanted, actual: await readText(frame) })); }
}
async function proof(frame = page) {
  const bad = await frame.evaluate(() => {
    const p = window.__proof, children = e => [...e.childNodes].filter(n => !window.__isOwnedHelp(n));
    return {
      elements: p.elements.filter(x => !x.element.isConnected || x.element.parentNode !== x.parent || x.children.length !== children(x.element).length || x.children.some((n, i) => n !== children(x.element)[i]) || x.attrs !== JSON.stringify([...x.element.attributes].map(a => [a.name, a.value]))).map(x => x.element.tagName),
      texts: p.texts.filter(x => !x.node.isConnected || x.node.nodeValue !== x.value).length,
      controls: p.controls.filter(x => !x.element.isConnected || x.element.value !== x.value || x.element.checked !== x.checked || x.element.disabled !== x.disabled || x.selected !== (x.element.tagName === 'SELECT' ? x.element.selectedIndex : null)).length,
      inputEvents: p.inputEvents, prototype: Element.prototype.attachShadow === window.__attachShadowPrototype ? 0 : 1
    };
  });
  assert(Object.values(bad).every(value => Array.isArray(value) ? !value.length : value === 0), 'Native preservation mismatch: ' + JSON.stringify(bad));
}

try {
  context = await chromium.launchPersistentContext(path.join(temporary, 'profile'), { executablePath: chromium.executablePath(), channel: 'chromium', headless: true, args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`] });
  await context.route(/https?:\/\//u, route => {
    network.interceptedRequests++;
    if (new URL(route.request().url()).pathname === '/synthetic-demogc-parent') return route.fulfill({ contentType: 'text/html', body: '<!doctype html><iframe src="https://demo.impact.com' + escape(activePage.pathExact) + '"></iframe>' });
    return route.fulfill({ contentType: 'text/html', body: html(activePage, activeVariant) });
  });
  page = await context.newPage(); worker = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');
  await check('All sixteen observed Light DOM positions translate in the isolated complete MV3 snapshot', async () => {
    await open(creatorPage); await settings(true, true);
    let error; try { await waitText(creatorPage); await proof(); } catch (e) { error = e.message; }
    const actual = await readText();
    observations.push({ page: creatorPage.id, provenance: creatorPage.provenance, capturedActualVersion: capture.loadedVersion, synthetic: true, status: error ? 'FAIL' : 'PASS', ...(error ? { error } : {}), positions: creatorPage.fixedText.map(label => ({ key: label.key, source: label.rawText, expected: expectation(label), actual: actual[label.key], status: actual[label.key] === expectation(label) ? 'PASS' : 'FAIL' })) });
    assert(!error, error); return { occurrences: 16, uniqueEnglishSources: 15, realSiteAcceptance: false };
  });
  if (!baseline) {
    await check('Independent switches and existing concept buttons preserve Text identity attributes drafts values and disabled native controls', async () => {
      await open();
      for (const [enabled, aiEnabled] of [[true, true], [false, true], [true, false], [false, false], [true, true]]) {
        await settings(enabled, aiEnabled); await waitText(creatorPage, enabled); await proof();
        const wanted=aiEnabled?2:0;
        await page.waitForFunction(wanted=>window.__roots().flatMap(r=>[...r.querySelectorAll('button.impact-cn-inline-help')]).filter(e=>window.__isOwnedHelp(e)).length===wanted,wanted);
        if(aiEnabled)assert.deepEqual(await page.evaluate(()=>window.__roots().flatMap(r=>[...r.querySelectorAll('button.impact-cn-inline-help')]).filter(e=>window.__isOwnedHelp(e)).map(e=>e.dataset.topicId).sort()),['creator-engagement-rate','creator-search']);
      }
      await page.locator('.synthetic-native-inspect').click();
      assert.equal(await page.evaluate(() => window.__proof.clicks), 1); await proof();
      return { switchStates: [[true,true],[false,true],[true,false],[false,false],[true,true]], retainedConceptTopics: ['creator-search','creator-engagement-rate'], fabricatedNativeHandlerChecks: 1, GetResultsClearAllApplyClicks: 0, actualPrivateValuesRead: false };
    });
    await check('Framework Text rewrite and Light DOM component remount translate automatically without switch operations', async () => {
      await open(); await waitText(creatorPage);
      await page.evaluate(() => window.__rewrite()); await waitText(creatorPage); await proof();
      await page.evaluate(() => window.__remount()); await waitText(creatorPage); await proof();
      return { frameworkTextRewrite: 1, publicComponentRemount: 1, switchOperations: 0, actualPopoverDOMGuessed: false };
    });
    await check('Exact path host top document and Light DOM owner boundaries retain the historical Shadow branch', async () => {
      const seen = [];
      await open(creatorPage, {}, 'app.impact.com'); await waitText(creatorPage); await proof(); seen.push({variant:'production-host-synthetic',status:'PASS'});
      for (const variant of boundariesFor()) {
        await open(creatorPage, variant, 'demo.impact.com', variant.pathExact || creatorPage.pathExact);
        await waitText(creatorPage, variant.translated===true, page, variant.overrides||{}); await proof();seen.push({variant:variant.id,status:'PASS'});
      }
      await open(creatorPage, {}, 'other.example'); await waitText(creatorPage,false); await proof();seen.push({variant:'wrong-host',status:'PASS'});
      activePage=creatorPage;activeVariant={};await page.goto('https://demo.impact.com/synthetic-demogc-parent');
      const frame=page.frames().find(candidate=>candidate!==page.mainFrame())||await page.waitForEvent('frameattached');await frame.waitForFunction(()=>!!window.__proof);await waitText(creatorPage,false,frame);await proof(frame);seen.push({variant:'child-document',status:'PASS'});
      await open(creatorPage,{historicalShadow:true});await waitText(creatorPage);await proof();
      const ownerEntries=await page.evaluate(()=>window.__roots().flatMap(r=>[...r.querySelectorAll('button.impact-cn-inline-help')]).filter(e=>window.__isOwnedHelp(e)).map(e=>e.dataset.entryId).sort());
      assert.deepEqual(ownerEntries,['discover-creator-search-breadcrumb-creator-search','discover-creator-search-filter-engagement-rate']);
      seen.push({variant:'historical-shadow-projection',status:'PASS',source:'Current observed public leaves transplanted into retained historical Shadow context; not current native Shadow evidence.',conceptEntries:ownerEntries});
      return { variants:seen, productionBrowserVisit:false, realPageAcceptance:false };
    });
  } else results.push({ name:'Candidate linked checks',status:'NOT_RUN',evidence:'Old-package baseline records actual Light DOM results; candidate checks intentionally not inferred.' });
  await check('Complete loaded source snapshot and public input remain frozen with all network intercepted', async () => {
    for (const [file, hash] of Object.entries(sourceHashes)) { assert.equal(sha(readFileSync(path.join(extension, file))), hash); if (requireSourceUnchanged) assert.equal(sha(readFileSync(path.join(sourceDir, file))), hash); }
    assert.equal(sha(readFileSync(capturePath)), sha(captureBytes)); assert.equal(sha(readFileSync(fileURLToPath(import.meta.url))), testSHA256);
    return { files: sourceFiles.length, requireSourceUnchanged, allNetworkIntercepted: true, realSiteAcceptance: false, sourceDirectory: path.relative(root, sourceDir) };
  });
} catch (error) { results.push({ name: 'Isolated MV3 harness setup', status: 'FAIL', evidence: error.message }); }
finally {
  await context?.close();
  mkdirSync(reportDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/gu, '-');
  const inputPath = path.join(reportDir, 'test-input-' + stamp + '.json'), targetsPath = path.join(reportDir, 'test-expectations-' + stamp + '.json');
  writeFileSync(inputPath, inputBytes, { flag: 'wx' }); writeFileSync(targetsPath, expectationBytes, { flag: 'wx' });
  const status = results.some(result => result.status === 'FAIL') || (!baseline && results.length !== 5) ? 'FAIL' : 'PASS';
  const report = { mode: 'SYNTHETIC_DEMOGC_CREATOR_LIGHT_MV3', version, status, baselineObservation: baseline, sourceDirectory: path.relative(root, sourceDir), sourceSHA256: sourceHashes, testSHA256, capture: { path: path.relative(root, capturePath), sha256: sha(captureBytes) }, input: { path: path.relative(root, inputPath), sha256: sha(inputBytes) }, expectations: { path: path.relative(root, targetsPath), sha256: sha(expectationBytes) }, positionCount, uniqueSourceCount, observations, results, network, realSiteAcceptance: false, nativeSaveClicks: 0, actualPrivateValuesSaved: false };
  const reportPath = path.join(reportDir, 'test-' + stamp + '.json'); writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' }); console.log('Creator report: ' + reportPath);
  rmSync(temporary, { recursive: true, force: true }); process.exitCode = status === 'PASS' ? 0 : 1;
}

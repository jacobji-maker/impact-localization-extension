/** Public Demo GC component projections in an isolated MV3 profile; all network is intercepted. */
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
const reportDir = path.resolve(root, arg('--report-dir') || 'artifacts/091-demogc-20261020');
const capturePath = path.resolve(root, arg('--capture') || 'artifacts/091-demogc-20261020/live-public-capture.json');
const baseline = process.argv.includes('--baseline-observation');
const requireSourceUnchanged = process.argv.includes('--require-source-unchanged');
const testSHA256 = sha(readFileSync(fileURLToPath(import.meta.url)));
const captureBytes = readFileSync(capturePath), capture = JSON.parse(captureBytes);
const expected = new Map([
  ['AI Search Visibility', 'AI 搜索可见度'], ['Brand Index', '品牌指数'],
  ['AI Source Opportunities', 'AI 来源合作机会'], ['Benchmark', '基准对比'],
  ['Finance Benchmark', '金融行业基准对比'], ['Industry Insights', '行业洞察'],
  ['Overview', '总览'], ['Partner Analysis', '合作伙伴分析'], ['Recommendations', '伙伴推荐'],
  ['Settings', '设置'], ['Categories & Country', '类别与国家/地区'],
  ['Specify up to 40 product categories and countries you want AI Search data on.', '指定最多 40 组商品类别与国家/地区，以获取相应的 AI 搜索数据。'],
  ['Learn more', '了解更多'], ['Add Another', '再添加一组'],
  ['Request Custom Categories', '申请自定义类别'], ['Save', '保存'],
  ['Review 1 new applications', '查看 1 份新合作申请'], ['Validate Your Events', '验证转化事件']
]);
const E = (tag, attrs = {}, children = []) => ({ tag, attrs, children });
const T = (text, fixedKey) => ({ text, ...(fixedKey ? { fixedKey } : {}) });
const walk = (node, action) => { action(node); for (const child of [...node.children || [], ...node.shadow || []]) walk(child, action); };
const scriptJSON = value => JSON.stringify(value).replaceAll('<', '\\u003c');
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

// The coordinator supplies only current public roles and ancestry. The shipped
// dictionary is never read to generate fixture selectors or expected wording.
const pages = capture.pages;
assert(Array.isArray(pages) && pages.length === 4, 'Four current public component projections are required');
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
assert.equal(uniquePositionCount, 18, 'This batch contains exactly 18 unique new fixed Text positions');
const navPage = pages.find(page => page.kind === 'navigation');
const dashboardPage = pages.find(page => page.kind === 'dashboard');
const settingsPage = pages.find(page => page.kind === 'settings');
assert(navPage && dashboardPage && settingsPage, 'Navigation, dashboard and settings projections are required');
const expectation = (label, translated = true) => {
  const raw = label.rawText ?? label.source;
  return translated ? raw.replace(label.source.trim(), expected.get(label.source.trim())) : raw;
};
function boundariesFor(item) {
  if (item.kind === 'navigation') return [
    { id: 'wrong-navigation-host', mutate: { attribute: 'id', from: 'adv-navigation', to: 'synthetic-other-navigation' } },
    { id: 'wrong-advertiser-path', pathExact: '/secure/partner/synthetic-demogc-overview.ihtml' },
    { id: 'wrong-submenu-test-marker', translated: true, mutate: { attribute: 'data-testid', from: 'sidenav-expanded-submenu-ai_search_visibility', to: 'synthetic-other-submenu' }, overrides: { 'nav-ai-search': 'AI Search Visibility' } },
    { id: 'wrong-submenu-track-marker', translated: true, mutate: { attribute: 'data-track-id', from: 'sidenav-product-submenu-ai_search_visibility', to: 'synthetic-other-submenu' }, overrides: { 'nav-ai-search': 'AI Search Visibility' } },
    { id: 'selected-state-is-not-identity', translated: true, mutate: { classFrom: 'cursor', classTo: 'cursor selected' } }
  ];
  if (item.kind === 'settings') return [
    { id: 'wrong-settings-component', mutate: { classFrom: 'category-management-view', classTo: 'synthetic-other-settings' } },
    { id: 'wrong-settings-path', pathExact: '/secure/advertiser/synthetic-demogc-settings.ihtml' }
  ];
  return [
    { id: 'wrong-todo-parent', translated: true, mutate: { classFrom: 'todo-title', classTo: 'synthetic-other-todo-title' }, overrides: { 'dashboard-review-count': 'Review 1 new applications' } },
    { id: 'wrong-floating-leaf', translated: true, mutate: { classFrom: 'float-subtext', classTo: 'synthetic-other-floating-label' }, overrides: { 'dashboard-validation-float': 'Validate Your Events' } },
    { id: 'wrong-dashboard-path', pathExact: '/secure/advertiser/synthetic-demogc-dashboard.ihtml' },
    { id: 'wrong-floating-body-theme', bodyClasses: 'vnext-light', translated: true, overrides: { 'dashboard-validation-float': 'Validate Your Events' } }
  ];
}
const sourceFiles = readdirSync(sourceDir, { recursive: true }).filter(file => path.basename(file) !== '.DS_Store' && statSync(path.join(sourceDir, file)).isFile());
const sourceHashes = Object.fromEntries(sourceFiles.map(file => [file, sha(readFileSync(path.join(sourceDir, file)))]));
const version = JSON.parse(readFileSync(path.join(sourceDir, 'manifest.json'))).version;
const inputBytes = Buffer.from(JSON.stringify({ schemaVersion: 1, pages, positionCount, uniquePositionCount, network: 'All HTTP(S) requests intercepted; no real iframe or platform content is fetched.', scope: 'Public minimum projections plus fabricated preservation values. No real account/Program names, selected values or AI conversation.' }, null, 2) + '\n');
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
  // All eight rows and values below are fabricated. They verify that translating
  // the settings explanation never rewrites existing selections or form state.
  const probes=document.createElement('section');probes.id='synthetic-preservation-probes';
  for(let i=0;i<8;i++){
    const row=document.createElement('div');row.className='synthetic-selection-row';
    const category=document.createElement('input');category.value='SYNTHETIC CATEGORY '+i;category.name='synthetic-category-'+i;
    const country=document.createElement('select');country.name='synthetic-country-'+i;
    const option=document.createElement('option');option.value='SYNTHETIC_COUNTRY_'+i;option.textContent='SYNTHETIC COUNTRY '+i;option.selected=true;country.append(option);
    row.append(category,country);probes.append(row);
  }
  for(const text of ['SYNTHETIC PRIVATE NAME','USD 1,234.56','2026-10-20','67','Review 1 new applications','AI Search Visibility','Brand Index','Validate Your Events']){const n=document.createElement('span');n.textContent=text;probes.append(n);}
  const disabled=document.createElement('input');disabled.type='checkbox';disabled.checked=true;disabled.disabled=true;disabled.value='Save';probes.append(disabled);document.body.append(probes);
  const ai=document.createElement('div');ai.id='ask-impact-shadow-host';const aiRoot=ai.attachShadow({mode:'open'});const reply=document.createElement('p');reply.textContent='SYNTHETIC AI REPLY / AI Search Visibility / Save';aiRoot.append(reply);document.body.append(ai);
  const roots=window.__roots=()=>{const out=[];function visit(r){out.push(r);if(r.shadowRoot)visit(r.shadowRoot);for(const e of r.querySelectorAll('*'))if(e.shadowRoot)visit(e.shadowRoot);}for(const r of window.__components)visit(r);return out;};
  const mountProbes=()=>{
    const selector=kind==='settings'?'[data-testid="category-selection-repeater"]':kind==='navigation'?'.side-nav':'#vueInstance';
    const owner=roots().map(r=>r.matches?.(selector)?r:r.querySelector(selector)).find(Boolean);
    if(!owner)throw new Error('Observed synthetic preservation owner is missing: '+selector);
    owner.append(probes);
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
    for(const e of window.__proof.controls.map(x=>x.element))e.addEventListener('input',()=>window.__proof.inputEvents++);
  };window.__collect();
  window.__remount=()=>{for(const old of window.__components)old.remove();window.__components=makeComponents();document.body.append(...window.__components);mountProbes();window.__collect();};
  window.__rewrite=()=>{for(const l of labels)window.__proof.nodes[l.key].nodeValue=l.rawText??l.source;};
  </script></body></html>`;
}

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core'))); }
const temporary = mkdtempSync(path.join(os.tmpdir(), 'impact-demogc-')), extension = path.join(temporary, 'extension');
cpSync(sourceDir, extension, { recursive: true });
for (const [file, hash] of Object.entries(sourceHashes)) assert.equal(sha(readFileSync(path.join(extension, file))), hash);
let context, page, worker, activePage = dashboardPage, activeVariant = {};
const results = [], observations = [], network = { interceptedRequests: 0 };
const check = async (name, action) => {
  try { results.push({ name, status: 'PASS', evidence: await action() }); console.log('DEMO GC PASS ' + name); }
  catch (error) { results.push({ name, status: 'FAIL', evidence: error.message }); console.log('DEMO GC FAIL ' + name + ': ' + error.message); }
};
async function open(item = dashboardPage, variant = {}, host = 'demo.impact.com', pathname = item.pathExact) {
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
  await check('All 18 unique current public positions translate in the isolated complete MV3 snapshot', async () => {
    for (const item of pages) {
      await open(item); await settings(true, true);
      let error; try { await waitText(item); await proof(); } catch (e) { error = e.message; }
      const actual = await readText();
      observations.push({ page: item.id, kind: item.kind, provenance: item.provenance, synthetic: true, status: error ? 'FAIL' : 'PASS', ...(error ? { error } : {}), positions: item.fixedText.map(label => ({ key: label.key, source: label.rawText ?? label.source, expected: expectation(label), actual: actual[label.key], status: actual[label.key] === expectation(label) ? 'PASS' : 'FAIL' })) });
    }
    assert(observations.every(item => item.status === 'PASS'), 'Current fixed Text failed in ' + observations.filter(item => item.status === 'FAIL').map(item => item.page).join(', '));
    return { pages: pages.length, occurrences: positionCount, uniquePositions: uniquePositionCount, realSiteAcceptance: false };
  });
  if (!baseline) {
    await check('Independent switches restore Text while eight synthetic selection rows and native structure remain unchanged', async () => {
      for (const item of pages) {
        await open(item);
        for (const [enabled, aiEnabled] of [[true, true], [false, true], [true, false], [true, true]]) {
          await settings(enabled, aiEnabled); await waitText(item, enabled); await proof();
          if(!aiEnabled)await page.waitForFunction(()=>window.__roots().every(r=>[...r.querySelectorAll('button.impact-cn-inline-help')].every(e=>!window.__isOwnedHelp(e))));
        }
      }
      // Click only a fabricated navigation label; Save and Request controls are never clicked.
      await open(navPage); await waitText(navPage); await page.evaluate(key => window.__proof.nodes[key].parentElement.click(), navPage.fixedText[0].key);
      assert.equal(await page.evaluate(() => window.__proof.clicks), 1); await proof();
      return { switchStates: [[true, true], [false, true], [true, false], [true, true]], protectedSelectionRows: 8, protectedInputsPerPage: 17, nativeSaveClicks: 0, businessActions: 0 };
    });
    await check('Framework Text rewrite and component replacement translate automatically without switch operations', async () => {
      for (const item of pages) {
        await open(item); await waitText(item);
        await page.evaluate(() => window.__rewrite()); await waitText(item); await proof();
        await page.evaluate(() => window.__remount()); await waitText(item); await proof();
      }
      return { textRewritePerComponent: 1, wholeProjectionReplacementPerComponent: 1, navigationShadowHostReplacement: 1, switchOperations: 0, scope: 'Synthetic component lifecycle only; no native application save or real-host reconstruction claim.' };
    });
    await check('Each public component preserves exact host document and component boundaries', async () => {
      const seen = [];
      for (const item of pages) {
        await open(item, {}, 'app.impact.com'); await waitText(item); await proof(); seen.push({ page: item.id, variant: 'production-host-synthetic', status: 'PASS' });
        for (const variant of boundariesFor(item)) {
          await open(item, variant, variant.host || 'demo.impact.com', variant.pathExact || item.pathExact);
          await waitText(item, variant.translated === true, page, variant.overrides || {}); await proof(); seen.push({ page: item.id, variant: variant.id, status: 'PASS' });
        }
        await open(item, {}, 'other.example'); await waitText(item, false); await proof(); seen.push({ page: item.id, variant: 'wrong-host', status: 'PASS' });
        activePage = item; activeVariant = {};
        await page.goto('https://demo.impact.com/synthetic-demogc-parent');
        const frame = page.frames().find(candidate => candidate !== page.mainFrame()) || await page.waitForEvent('frameattached');
        await frame.waitForFunction(() => !!window.__proof); await waitText(item, false, frame); await proof(frame);
        seen.push({ page: item.id, variant: 'child-document', status: 'PASS' });
      }
      return { variants: seen, productionBrowserVisit: false, realIframeContentsFetched: false };
    });
    await check('Dashboard numeric template translates decimal counts and leaves names dates amounts and malformed counts intact', async () => {
      await open(dashboardPage); await waitText(dashboardPage);
      const label = dashboardPage.fixedText.find(item => item.source.trim() === 'Review 1 new applications'); assert(label);
      const seen = [];
      for (const count of ['0', '1', '12', '1,234', '123,456']) {
        await page.evaluate(({ key, count }) => { window.__proof.nodes[key].nodeValue = 'Review ' + count + ' new applications'; }, { key: label.key, count });
        await page.waitForFunction(({ key, count }) => window.__proof.nodes[key].nodeValue === '查看 ' + count + ' 份新合作申请', { key: label.key, count }); await proof(); seen.push({ count, status: 'PASS' });
      }
      for (const count of ['SYNTHETIC NAME', '2026-10-20', '$12', '12.50', '1,23', '12,34,567', '-1']) {
        const text = 'Review ' + count + ' new applications';
        await page.evaluate(({ key, text }) => { window.__proof.nodes[key].nodeValue = text; }, { key: label.key, text });
        await page.waitForTimeout(100); assert.equal((await readText())[label.key], text); await proof(); seen.push({ rejected: count, status: 'PASS' });
      }
      await settings(false, true); assert.equal((await readText())[label.key], 'Review -1 new applications'); await proof();
      return { cases: seen, sourceCountsRetainedByteForByte: true };
    });
  } else results.push({ name: 'Candidate linked checks', status: 'NOT_RUN', evidence: 'Old-package baseline records actual English results. Candidate checks intentionally not inferred.' });
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
  const status = results.some(result => result.status === 'FAIL') || (!baseline && results.length !== 6) ? 'FAIL' : 'PASS';
  const report = { mode: 'SYNTHETIC_DEMOGC_COMPONENTS_MV3', version, status, baselineObservation: baseline, sourceDirectory: path.relative(root, sourceDir), sourceSHA256: sourceHashes, testSHA256, capture: { path: path.relative(root, capturePath), sha256: sha(captureBytes) }, input: { path: path.relative(root, inputPath), sha256: sha(inputBytes) }, expectations: { path: path.relative(root, targetsPath), sha256: sha(expectationBytes) }, positionCount, uniquePositionCount, observations, results, network, realSiteAcceptance: false, nativeSaveClicks: 0, actualPrivateValuesSaved: false };
  const reportPath = path.join(reportDir, 'test-' + stamp + '.json'); writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' }); console.log('Demo GC report: ' + reportPath);
  rmSync(temporary, { recursive: true, force: true }); process.exitCode = status === 'PASS' ? 0 : 1;
}

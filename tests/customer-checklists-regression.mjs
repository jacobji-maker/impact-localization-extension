/** Public customer Checklist projections in an isolated MV3 profile; all network is intercepted. */
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
const reportDir = path.resolve(root, arg('--report-dir') || 'artifacts/094-customer-checklists-20261020');
const capturePath = path.resolve(root, arg('--capture') || 'artifacts/094-customer-checklists-20261020/live-public-capture.json');
const baseline = process.argv.includes('--baseline-observation');
const requireSourceUnchanged = process.argv.includes('--require-source-unchanged');
const testSHA256 = sha(readFileSync(fileURLToPath(import.meta.url)));
const captureBytes = readFileSync(capturePath), capture = JSON.parse(captureBytes);
const expected = new Map([['Checklists','配置清单'],['Return to dashboard','返回仪表盘'],['[INTERNAL] Account Review Complete','[内部] 完成账户审核']]);
const E = (tag, attrs = {}, children = []) => ({ tag, attrs, children });
const T = (text, fixedKey) => ({ text, ...(fixedKey ? { fixedKey } : {}) });
const walk = (node, action) => { action(node); for (const child of [...node.children || [], ...node.shadow || []]) walk(child, action); };
const scriptJSON = value => JSON.stringify(value).replaceAll('<', '\\u003c');
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

// The coordinator supplies only current public roles and ancestry. The shipped
// dictionary is never read to generate fixture selectors or expected wording.
const pages = capture.pages.map(item=>({...item,pathExact:item.pathFamily?(item.pathFamily.endsWith('/')?item.pathFamily+'synthetic-checklist-instance':item.pathFamily):undefined}));
assert(Array.isArray(pages) && pages.length === 3, 'Three current public customer Checklist projections are required');
for (const page of pages) {
  assert(page.id && (page.pathExact?.startsWith('/') || page.documentUrlExact==='about:srcdoc') && page.tree && page.fixedText?.length, 'Incomplete captured component ' + page.id);
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
assert.equal(positionCount, 5, 'Five observed fixed Text positions are required');
const uniqueSourceCount = new Set(pages.flatMap(page => page.fixedText.map(label => label.source))).size;
assert.equal(uniqueSourceCount, 3, 'Three unique English sources are expected');
const testsPage=pages.find(item=>item.id==='customer-tests'),checklistPage=pages.find(item=>item.id==='customer-checklist'),reviewPage=pages.find(item=>item.id==='customer-review');
assert(testsPage&&checklistPage&&reviewPage);
const scopeProbePath='/secure/advertiser/synthetic-shared-checklist-key.ihtml';
const expectation = (label, translated = true) => {
  const raw = label.rawText ?? label.source;
  return translated ? raw.replace(label.source.trim(), expected.get(label.source.trim())) : raw;
};
function navigationBoundaries(){return [
  {id:'wrong-product-test',mutate:{attribute:'data-testid',from:'sidenav-product-prd_819328330',to:'synthetic-other-product'}},
  {id:'wrong-product-track',mutate:{attribute:'data-track-id',from:'sidenav-product-prd_819328330',to:'synthetic-other-product'}},
  {id:'wrong-tooltip-product',translated:true,mutate:{attribute:'data-testid',from:'product-switcher-tooltip-container-prd_819328330',to:'synthetic-other-tooltip'},overrides:{'customer-tests-fixed-1':'Checklists'}},
  {id:'wrong-checklist-role',mutate:{classFrom:'checklistItem',classTo:'synthetic-other-item'}},
  {id:'wrong-tooltip-marker-prefix',translated:true,mutate:{attribute:'data-testid',from:'sidenav-tooltip-submenu-synthetic-checklist-slot',to:'synthetic-other-submenu'},overrides:{'customer-tests-fixed-1':'Checklists'}},
  {id:'wrong-track-marker-prefix',mutate:{attribute:'data-track-id',from:'sidenav-product-submenu-synthetic-checklist-slot',to:'synthetic-other-submenu'}},
  {id:'wrong-expanded-marker-prefix',translated:true,mutate:{attribute:'data-testid',from:'sidenav-expanded-submenu-synthetic-checklist-slot',to:'synthetic-other-submenu'},overrides:{'customer-tests-fixed-2':'Checklists'}},
  {id:'wrong-navigation-host',mutate:{attribute:'id',from:'adv-navigation',to:'synthetic-other-navigation'}},
  {id:'wrong-direct-parent-tag',mutate:{parentTag:'span',fixedKeys:['customer-tests-fixed-1','customer-tests-fixed-2']}},
  {id:'light-dom-navigation',lightNavigation:true},
  {id:'cross-side-nav-witness',crossSideNav:true},
  {id:'different-valid-key',validKey:'synthetic-other-checklist-slot',translated:true}
];}
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
      if (parentTag && node.children?.some(child => child.fixedKey === fixedKey || variant.mutate.fixedKeys?.includes(child.fixedKey))) node.tag = parentTag;
    });
  }
  const capturedBodyClasses = Array.isArray(page.bodyClasses) ? page.bodyClasses.join(' ') : page.bodyClasses || page.tree.attrs?.class || 'vnext-dark';
  const bodyClasses = variant.bodyClasses || capturedBodyClasses;
  if(variant.validKey)walk(tree,node=>{for(const key of ['data-testid','data-track-id'])if(node.attrs?.[key])node.attrs[key]=node.attrs[key].replaceAll('synthetic-checklist-slot',variant.validKey);});
  if(variant.lightNavigation)walk(tree,node=>{if(node.tag==='impact-style-isolator'&&node.shadow){node.children=node.shadow;delete node.shadow;}});
  if(variant.crossSideNav)walk(tree,node=>{if(node.attrs?.class==='side-nav'&&node.children?.some(child=>child.attrs?.id==='expanded-bar')){const witness=node.children.find(child=>child.attrs?.id==='left-bar');const product=witness?.children?.[0]?.children?.[0];if(product){const copy=structuredClone(witness);copy.children[0].children[0].children=[];product.attrs['data-testid']='synthetic-other-product';product.attrs['data-track-id']='synthetic-other-product';const sibling={tag:'div',attrs:{class:'side-nav'},children:[copy]};const nav=tree;let owner;walk(nav,n=>{if(n.children?.includes(node))owner=n;});if(owner)owner.children.push(sibling);}}});
  const reviewHTML=page.kind==='review-srcdoc'?'':html(reviewPage,variant.reviewVariant||{});
  return `<!doctype html><html><head><meta charset="utf-8"></head><body class="${escape(bodyClasses)}"><script>
  const spec=${scriptJSON(tree)},labels=${scriptJSON(page.fixedText)},kind=${scriptJSON(page.kind)},variant=${scriptJSON(variant)},reviewHTML=${scriptJSON(reviewHTML)};
  window.__attachShadowPrototype=Element.prototype.attachShadow;
  function construct(s){
    if('comment'in s)return document.createComment(s.comment);
    if('text'in s){const n=document.createTextNode(s.text);if(!s.fixedKey)return n;const f=document.createDocumentFragment();f.append(document.createComment('fixed:'+s.fixedKey),n);return f;}
    const e=document.createElement(s.tag);for(const[k,v]of Object.entries(s.attrs||{}))e.setAttribute(k,v);
    for(const c of s.children||[])e.append(construct(c));if(s.tag==='iframe'){if(variant.frameName)e.name=variant.frameName;if(variant.frameId)e.id=variant.frameId;if(variant.frameSandbox!==undefined)e.setAttribute('sandbox',variant.frameSandbox);if(variant.noSrcdoc){e.removeAttribute('srcdoc');e.src='https://app.impact.com/synthetic-review-document';}else e.srcdoc=reviewHTML;}
    if(s.shadow){const r=e.attachShadow({mode:'open'});for(const c of s.shadow)r.append(construct(c));}return e;
  }
  // A body projection is an envelope, so the floating host remains a real
  // direct child of the document body rather than an artificial wrapper.
  const makeComponents=()=>spec.tag==='body'?(spec.children||[]).map(construct):[construct(spec)];
  window.__components=makeComponents();document.body.append(...window.__components);
  // Entirely fabricated preservation probes, placed within the qualified root.
  // No real handle, keyword draft, selected country, creator card or result row is read.
  const probes=document.createElement('section');probes.id='synthetic-preservation-probes';
  const handle=document.createElement('input');handle.name='synthetic-handle';handle.value='SYNTHETIC NATIVE INPUT';
  const keyword=document.createElement('textarea');keyword.name='synthetic-keyword';keyword.value='SYNTHETIC NATIVE DRAFT';
  const country=document.createElement('select');country.name='synthetic-country';
  const option=document.createElement('option');option.value='SYNTHETIC_COUNTRY_CODE';option.textContent='SYNTHETIC COUNTRY CHOICE';option.selected=true;country.append(option);
  const check=document.createElement('input');check.type='checkbox';check.checked=true;check.disabled=true;check.value='Followers';
  const action=document.createElement('button');action.type='button';action.textContent='SYNTHETIC NATIVE INSPECT';action.className='synthetic-native-inspect';
  probes.append(handle,keyword,country,check,action);
  for(const text of ['SYNTHETIC PRIVATE CHECKLIST NAME','USD 1,234.56','2026-10-20','67','Checklists','Return to dashboard','[INTERNAL] Account Review Complete']){const n=document.createElement('span');n.className='synthetic-private-card-content';n.textContent=text;probes.append(n);}
  document.body.append(probes);
  const ai=document.createElement('div');ai.id='ask-impact-shadow-host';const aiRoot=ai.attachShadow({mode:'open'});const reply=document.createElement('p');reply.textContent='SYNTHETIC AI REPLY / Checklists / Return to dashboard';aiRoot.append(reply);document.body.append(ai);
  const roots=window.__roots=()=>{const out=[];function visit(r){out.push(r);if(r.shadowRoot)visit(r.shadowRoot);for(const e of r.querySelectorAll('*'))if(e.shadowRoot)visit(e.shadowRoot);}for(const r of window.__components)visit(r);return out;};
  const mountProbes=()=>{
    const selector=kind==='review-srcdoc'?'#app':'#uitk-container';
    const owner=roots().map(r=>r.matches?.(selector)?r:r.querySelector(selector)).find(Boolean)||window.__components[0];owner.append(probes);
  };mountProbes();
  window.__isOwnedHelp=(e,nodes=window.__proof?.nodes)=>{
    if(e.nodeType!==1||!e.matches('button.impact-cn-inline-help[data-impact-cn-ignore][data-impact-cn-help][data-entry-id][data-topic-id][data-impact-cn-help-topic]')||e.type!=='button'||!e.dataset.entryId||e.dataset.topicId!==e.dataset.impactCnHelpTopic)return false;
    return Object.values(nodes||{}).some(n=>{const label=n.parentElement,interactive=label.closest('a,button,summary');return interactive?e.parentNode===interactive.parentNode&&interactive.nextSibling===e:e.parentNode===label;});
  };
  window.__collect=()=>{
    const nodes={},texts=[],elements=[];for(const r of roots()){if(r.nodeType===Node.ELEMENT_NODE)elements.push(r);elements.push(...r.querySelectorAll('*'));const w=document.createTreeWalker(r,NodeFilter.SHOW_COMMENT);while(w.nextNode())if(w.currentNode.nodeValue.startsWith('fixed:')){const key=w.currentNode.nodeValue.slice(6);if(nodes[key])throw new Error('Duplicate fixture fixedKey: '+key);nodes[key]=w.currentNode.nextSibling;}}
    for(const r of [...roots(),reply]){const w=document.createTreeWalker(r,NodeFilter.SHOW_TEXT);while(w.nextNode())if(!Object.values(nodes).includes(w.currentNode))texts.push({node:w.currentNode,value:w.currentNode.nodeValue});}
    elements.push(ai,reply);
    const isOwned=e=>window.__isOwnedHelp(e,nodes);
    window.__proof={nodes,fixedClicks:0,elements:elements.filter(e=>!isOwned(e)).map(element=>({element,parent:element.parentNode,children:[...element.childNodes].filter(n=>!isOwned(n)),attrs:JSON.stringify([...element.attributes].map(a=>[a.name,a.value]))})),texts,controls:elements.filter(e=>e.matches('input,select,textarea')).map(element=>({element,value:element.value,checked:element.checked,disabled:element.disabled,selected:element.tagName==='SELECT'?element.selectedIndex:null})),clicks:0,inputEvents:0};
    for(const n of Object.values(nodes)){const e=n.parentElement;e.addEventListener('click',event=>{event.preventDefault();window.__proof.fixedClicks++;});}
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
const temporary = mkdtempSync(path.join(os.tmpdir(), 'impact-customer-checklists-')), extension = path.join(temporary, 'extension');
cpSync(sourceDir, extension, { recursive: true });
for (const [file, hash] of Object.entries(sourceHashes)) assert.equal(sha(readFileSync(path.join(extension, file))), hash);
let context, page, worker, activePage = testsPage, activeVariant = {},target;
const results = [], observations = [], network = { interceptedRequests: 0 };
const check = async (name, action) => {
  try { results.push({ name, status: 'PASS', evidence: await action() }); console.log('CUSTOMER CHECKLIST PASS ' + name); }
  catch (error) { results.push({ name, status: 'FAIL', evidence: error.message }); console.log('CUSTOMER CHECKLIST FAIL ' + name + ': ' + error.message); }
};
async function reviewDocument(){const frame=page.frames().find(f=>f!==page.mainFrame());assert(frame,'A real native-slot frame is required');await frame.waitForFunction(()=>!!window.__proof);return frame;}
async function open(item=testsPage,variant={},host=item.host||'app.impact.com',pathname=item.pathExact){
 activePage=item.kind==='review-srcdoc'?checklistPage:item;activeVariant=variant;
 const url='https://'+host+(pathname||activePage.pathExact);await page.goto(url);await page.waitForFunction(()=>!!window.__proof);
 target=item.kind==='review-srcdoc'?await reviewDocument():page;return target;
}
async function settings(enabled, aiEnabled) {
  await worker.evaluate(value => chrome.storage.local.set({ impactCNEnabled: value.enabled, impactCNAIEnabled: value.aiEnabled }), { enabled, aiEnabled });
  await page.waitForFunction(value => { const e = document.querySelector('#impact-cn-assistant'); return !e || e.dataset.enabled === String(value.enabled) && e.dataset.aiEnabled === String(value.aiEnabled); }, { enabled, aiEnabled });
}
async function readText(frame = target) { return frame.evaluate(() => Object.fromEntries(Object.entries(window.__proof.nodes).map(([key, node]) => [key, node.nodeValue]))); }
async function waitText(item, translated = true, frame = target, overrides = {}) {
  const wanted = { ...Object.fromEntries(item.fixedText.map(label => [label.key, expectation(label, translated)])), ...overrides };
  try { await frame.waitForFunction(value => Object.entries(value).every(([key, text]) => window.__proof.nodes[key]?.nodeValue === text), wanted, { timeout: 3500 }); }
  catch (error) { throw new Error(error.message + ' ' + JSON.stringify({ wanted, actual: await readText(frame) })); }
}
async function proof(frame = target) {
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
    if (new URL(route.request().url()).pathname === '/synthetic-review-document')return route.fulfill({contentType:'text/html',body:html(reviewPage)});
    if (new URL(route.request().url()).pathname === '/synthetic-demogc-parent') return route.fulfill({ contentType: 'text/html', body: '<!doctype html><iframe src="https://demo.impact.com' + escape(activePage.pathExact) + '"></iframe>' });
    return route.fulfill({ contentType: 'text/html', body: html(activePage, activeVariant) });
  });
  page = await context.newPage(); worker = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');
  await check('Five observed customer Checklist positions retain two existing translations and close three English gaps',async()=>{
   for(const item of pages){await open(item);await settings(true,true);let error;try{await waitText(item);await proof();}catch(e){error=e.message;}const actual=await readText();observations.push({page:item.id,provenance:item.provenance,synthetic:true,status:error?'FAIL':'PASS',...(error?{error}:{}),positions:item.fixedText.map(label=>({key:label.key,representation:label.representation||'review-button',source:label.rawText,expected:expectation(label),actual:actual[label.key],status:actual[label.key]===expectation(label)?'PASS':'FAIL'}))});}
   assert(observations.every(x=>x.status==='PASS'),'Missing fixed Text in '+observations.filter(x=>x.status==='FAIL').map(x=>x.page).join(', '));return{positions:5,expectedOldBaselineChinesePositions:2,expectedOldBaselineGaps:3,reviewCompletionClicks:0};
  });
  if(!baseline){
   await check('Independent switches restore Text and preserve native attributes values disabled state and passive action handlers',async()=>{
    for(const item of pages){await open(item);for(const[enabled,aiEnabled]of[[true,true],[false,true],[true,false],[true,true]]){await settings(enabled,aiEnabled);await waitText(item,enabled);await proof();assert.equal(await target.evaluate(()=>window.__proof.fixedClicks),0);}await target.locator('.synthetic-native-inspect').click();assert.equal(await target.evaluate(()=>window.__proof.clicks),1);await proof();if(item.kind==='review-srcdoc')assert.equal(await target.locator('#impact-cn-assistant,button.impact-cn-inline-help').count(),0);}
    return{independentSwitchStates:[[true,true],[false,true],[true,false],[true,true]],syntheticNativeHandlerChecks:3,ReviewReturnSaveNextOrBusinessClicks:0,privateValuesRead:false};
   });
   await check('Public Text rewrite and menu Shadow or Review component remount translate without toggling controls',async()=>{
    for(const item of pages){await open(item);await waitText(item);await target.evaluate(()=>window.__rewrite());await waitText(item);await proof();await target.evaluate(()=>window.__remount());await waitText(item);await proof();}
    return{components:3,textRewrites:3,componentRemounts:3,topShadowHostsRebuilt:2,switchOperations:0,actualSrcdocSourceCopied:false};
   });
   await check('Stable Checklist roles reject wrong product host prefixes roots and top context without storing customer keys',async()=>{
    const seen=[];
    for(const variant of navigationBoundaries()){await open(testsPage,variant,'app.impact.com',scopeProbePath);await waitText(testsPage,variant.translated===true,target,variant.overrides||{});await proof();seen.push({variant:variant.id,status:'PASS'});}
    await open(testsPage,{},'demo.impact.com',scopeProbePath);await waitText(testsPage);await proof();seen.push({variant:'demo-public-shape',status:'PASS'});
    await open(testsPage,{},'other.example',scopeProbePath);await waitText(testsPage,false);await proof();seen.push({variant:'wrong-host',status:'PASS'});
    await open(testsPage,{},'app.impact.com','/secure/partner/synthetic-checklist-key.ihtml');await waitText(testsPage,false);await proof();seen.push({variant:'wrong-advertiser-path',status:'PASS'});
    activePage=testsPage;activeVariant={};await page.goto('https://app.impact.com/synthetic-demogc-parent');target=await reviewDocument();await waitText(testsPage,false);await proof();seen.push({variant:'child-document-navigation',status:'PASS'});
    return{variants:seen,boundaryPathIsFabricated:true,reason:'The representative real routes retain broad legacy expanded-label scopes. A fabricated ordinary advertiser path isolates the new structural fallback boundary without changing those old rules.',customerOpaqueKeyPersisted:false};
   });
   await check('Review srcdoc requires unchanged real parent family slot name sandbox and document authorization',async()=>{
    const seen=[];
    for(const variant of[{id:'wrong-frame-id',frameId:'synthetic-other-frame'},{id:'wrong-frame-name',frameName:'syntheticOtherFrame'},{id:'opaque-sandbox',frameSandbox:'allow-scripts'},{id:'missing-srcdoc',noSrcdoc:true},{id:'wrong-review-root',reviewVariant:{mutate:{attribute:'id',from:'app',to:'synthetic-other-review-root'}}}]){await open(reviewPage,variant);await waitText(reviewPage,false);await proof();seen.push({variant:variant.id,status:'PASS'});}
    await open(reviewPage,{},'app.impact.com','/secure/advertiser/synthetic-other-parent.ihtml');await waitText(reviewPage,false);await proof();seen.push({variant:'wrong-parent-path',status:'PASS'});
    await open(reviewPage,{},'other.example');await waitText(reviewPage,false);await proof();seen.push({variant:'wrong-parent-host',status:'PASS'});
    await open(reviewPage,{},'demo.impact.com');await waitText(reviewPage);await proof();assert.equal(await target.locator('#impact-cn-assistant,button.impact-cn-inline-help').count(),0);seen.push({variant:'authorized-demo-srcdoc',status:'PASS'});
    return{variants:seen,configOrManifestOverridden:false,actualSrcdocSourceCopied:false,completionButtonClicks:0};
   });
  }else results.push({name:'Candidate linked checks',status:'NOT_RUN',evidence:'Old 0.9.3 is expected to keep the two expanded labels Chinese while three new positions remain English; all outcomes are recorded.'});
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
  const report = { mode: 'SYNTHETIC_CUSTOMER_CHECKLISTS_MV3', version, status, baselineObservation: baseline, sourceDirectory: path.relative(root, sourceDir), sourceSHA256: sourceHashes, testSHA256, capture: { path: path.relative(root, capturePath), sha256: sha(captureBytes) }, input: { path: path.relative(root, inputPath), sha256: sha(inputBytes) }, expectations: { path: path.relative(root, targetsPath), sha256: sha(expectationBytes) }, positionCount, uniqueSourceCount, observations, results, network, realSiteAcceptance: false, nativeSaveClicks: 0, actualPrivateValuesSaved: false };
  const reportPath = path.join(reportDir, 'test-' + stamp + '.json'); writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' }); console.log('Customer Checklists report: ' + reportPath);
  rmSync(temporary, { recursive: true, force: true }); process.exitCode = status === 'PASS' ? 0 : 1;
}

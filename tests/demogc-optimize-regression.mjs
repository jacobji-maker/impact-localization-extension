/** Public Optimize report and menu projections in an isolated MV3 profile; all network is intercepted. */
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
const reportDir = path.resolve(root, arg('--report-dir') || 'artifacts/095-demogc-completion-20261020');
const capturePath = path.resolve(root, arg('--capture') || 'artifacts/095-demogc-completion-20261020/live-public-capture.json');
const baseline = process.argv.includes('--baseline-observation');
const requireSourceUnchanged = process.argv.includes('--require-source-unchanged');
const testSHA256 = sha(readFileSync(fileURLToPath(import.meta.url)));
const captureBytes = readFileSync(capturePath), capture = JSON.parse(captureBytes);
const addonPath=path.join(root,'artifacts/095-demogc-completion-20261020/live-disclaimer-capture.json'),addonBytes=readFileSync(addonPath),addon=JSON.parse(addonBytes);
const addonOnly=process.argv.includes('--addon-only');
// Wording supplied independently by the coordinator from public business research.
const expected=new Map([
 ['Incrementality','增量贡献'],['Forecast','表现预测'],['Incrementality Dashboard','增量贡献仪表盘'],['Apply','应用'],['Grading Scale','评级标准'],['View All','查看全部'],['Incremental %','增量贡献率'],['Rating','评级'],['High Incrementality Partners','高增量贡献伙伴'],['Partner','合作伙伴'],['Group','伙伴组'],['Participate','参与量'],['CPA','单次转化成本'],['Adjusted CPA','调整后单次转化成本'],['Group Benchmarks','伙伴组基准'],['Partners','合作伙伴'],['Low Incrementality Partners','低增量贡献伙伴'],['Measure:','统计指标：'],['Group:','伙伴组：'],['Customer Status:','客户状态：'],['Minimum Participations:','最低参与量：'],['Event Type:','事件类型：'],['by Partner','按合作伙伴'],['Anomaly Detection','异常检测'],['Forecast by Partner','按合作伙伴预测'],['Prediction Range:','预测期：'],['Partner:','合作伙伴：'],['Confidence level:','置信级别：'],['Exclude Expired Partners:','排除合同已到期的伙伴：'],['Show:','显示字段：'],['No graphable data','没有可绘图的数据'],['No rows found','未找到数据行'],['Anomaly Detection Summary','异常检测汇总'],['Currency:','币种：'],['Anomalous Threshold% >=:','偏离阈值（%）≥：'],['Clicks and impressions received in the last three hours may not be included here. There is a 2+ hour delay for some metrics.','此处可能尚未包含最近三小时收到的点击和展示数据。部分指标的数据延迟超过两小时。']
]);
const E = (tag, attrs = {}, children = []) => ({ tag, attrs, children });
const T = (text, fixedKey) => ({ text, ...(fixedKey ? { fixedKey } : {}) });
const walk = (node, action) => { action(node); for (const child of [...node.children || [], ...node.shadow || []]) walk(child, action); };
const scriptJSON = value => JSON.stringify(value).replaceAll('<', '\\u003c');
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

// The coordinator supplies only current public roles and ancestry. The shipped
// dictionary is never read to generate fixture selectors or expected wording.
const pages=addonOnly?addon.pages:[...capture.pages,...addon.pages];
assert(Array.isArray(pages)&&pages.length===(addonOnly?2:6),'Only the four reviewed base projections plus two implemented disclaimer projections are accepted');
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
assert.equal(positionCount,addonOnly?2:57,'Reviewed fixed Text count differs');
const uniqueSourceCount = new Set(pages.flatMap(page => page.fixedText.map(label => label.source))).size;
assert.equal(uniqueSourceCount,addonOnly?1:36,'Reviewed unique source count differs');
const hiddenTextCount=pages.flatMap(page=>page.fixedText).filter(label=>label.visible===false).length;assert.equal(hiddenTextCount,addonOnly?0:3);
const reportPage=pages[0],navPage=pages.find(page=>page.kind==='optimize-navigation');if(!addonOnly)assert(navPage);
const expectation = (label, translated = true) => {
  const raw = label.rawText ?? label.source;
  return translated ? raw.replace(label.source.trim(), expected.get(label.source.trim())) : raw;
};
function boundariesFor(item){
 if(item.kind==='optimize-report-disclaimer')return[
  {id:'wrong-disclaimer-role',mutate:{classFrom:'reportingDisclaimer',classTo:'synthetic-other-paragraph'}},
  {id:'wrong-disclaimer-owner',mutate:{attribute:'id',from:'main-content',to:'synthetic-other-main'}},
  {id:'wrong-disclaimer-path',pathExact:'/secure/advertiser/optimize/synthetic-other-disclaimer/report/viewReport.report'}
 ];
 if(item.kind==='optimize-navigation')return[
  {id:'wrong-navigation-host',mutate:{attribute:'id',from:'adv-navigation',to:'synthetic-other-navigation'}},
  {id:'wrong-forecast-test-marker-invalidates-its-child-group',mutate:{attribute:'data-testid',from:'sidenav-expanded-submenu-menu_opt_forecast',to:'synthetic-other-submenu'}},
  {id:'light-navigation-root',lightNavigation:true}
 ];
 const filterOverrides=Object.fromEntries(item.fixedText.filter(label=>label.source.endsWith(':')).map(label=>[label.key,label.rawText]));
 return[
  {id:'wrong-report-owner',translated:true,mutate:{attribute:'id',from:'reportingContainer',to:'synthetic-other-report'},overrides:Object.fromEntries(item.fixedText.filter(label=>!['Incrementality','Forecast'].includes(label.source)).map(label=>[label.key,label.rawText]))},
  {id:'wrong-filter-owner',translated:true,mutate:{attribute:'id',from:'reportFormDiv',to:'synthetic-other-form'},overrides:{...filterOverrides,...Object.fromEntries(item.fixedText.filter(label=>label.source==='Apply').map(label=>[label.key,label.rawText]))}},
  {id:'wrong-exact-report-path',pathExact:'/secure/advertiser/optimize/synthetic-other-report/report/viewReport.report',translated:true,overrides:Object.fromEntries(item.fixedText.filter(label=>!['Incrementality','Forecast'].includes(label.source)).map(label=>[label.key,label.rawText]))}
 ];
}
const sourceFiles = readdirSync(sourceDir, { recursive: true }).filter(file => path.basename(file) !== '.DS_Store' && statSync(path.join(sourceDir, file)).isFile());
const sourceHashes = Object.fromEntries(sourceFiles.map(file => [file, sha(readFileSync(path.join(sourceDir, file)))]));
const version = JSON.parse(readFileSync(path.join(sourceDir, 'manifest.json'))).version;
const inputBytes = Buffer.from(JSON.stringify({ schemaVersion: 1, pages, positionCount, uniqueSourceCount, hiddenTextCount, network: 'All HTTP(S) requests intercepted; no real iframe or platform content is fetched.', scope: 'Public minimum projections plus fabricated preservation values. No real account/Program names, selected values or AI conversation.' }, null, 2) + '\n');
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
  const capturedBodyClasses=Array.isArray(page.bodyClasses)?page.bodyClasses.join(' '):page.bodyClasses||page.tree.attrs?.class||'vnext-dark';
  const bodyClasses = variant.bodyClasses || capturedBodyClasses;
  if(variant.lightNavigation)walk(tree,node=>{if(node.tag==='impact-style-isolator'&&node.shadow){node.children=node.shadow;delete node.shadow;}});
  return `<!doctype html><html><head><meta charset="utf-8"><style>h1.readOnly{display:none}</style></head><body class="${escape(bodyClasses)}"><script>
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
  // No report selection, private native value or business result row is read.
  const probes=document.createElement('section');probes.id='synthetic-preservation-probes';
  const handle=document.createElement('input');handle.name='synthetic-handle';handle.value='SYNTHETIC_HANDLE_DRAFT';
  const keyword=document.createElement('textarea');keyword.name='synthetic-keyword';keyword.value='SYNTHETIC_KEYWORD_DRAFT';
  const country=document.createElement('select');country.name='synthetic-country';
  const option=document.createElement('option');option.value='SYNTHETIC_COUNTRY_CODE';option.textContent='SYNTHETIC COUNTRY CHOICE';option.selected=true;country.append(option);
  const check=document.createElement('input');check.type='checkbox';check.checked=true;check.disabled=true;check.value='Followers';
  const action=document.createElement('button');action.type='button';action.textContent='SYNTHETIC NATIVE INSPECT';action.className='synthetic-native-inspect';
  probes.append(handle,keyword,country,check,action);
  for(const text of ['SYNTHETIC PARTNER NAME','USD 1,234.56','2026-10-20','67','Forecast','CPA','Group','Partner','Participate','Incremental %','Measure:','Anomalous Threshold% >=:']){const n=document.createElement('span');n.className='synthetic-private-card-content';n.textContent=text;probes.append(n);}
  document.body.append(probes);
  const ai=document.createElement('div');ai.id='ask-impact-shadow-host';const aiRoot=ai.attachShadow({mode:'open'});const reply=document.createElement('p');reply.textContent='SYNTHETIC AI REPLY / Forecast / CPA / Group';aiRoot.append(reply);document.body.append(ai);
  const roots=window.__roots=()=>{const out=[];function visit(r){out.push(r);if(r.shadowRoot)visit(r.shadowRoot);for(const e of r.querySelectorAll('*'))if(e.shadowRoot)visit(e.shadowRoot);}for(const r of window.__components)visit(r);return out;};
  const mountProbes=()=>{
    const selector=kind==='optimize-navigation'?'.side-nav':'#reportingContainer';
    const owner=roots().map(r=>r.matches?.(selector)?r:r.querySelector(selector)).find(Boolean)||window.__components[0];owner.append(probes);
    // Same-English selected values are fabricated, including label-shaped values.
    // They remain separate STRONG nodes, never part of the fixed label Text.
    const strongValues=['Group:','Partner:','CPA','Show:','Measure:','Anomalous Threshold% >=:'];
    let i=0;for(const r of roots())for(const strong of r.querySelectorAll('strong'))if(strong.firstChild?.nodeType===Node.TEXT_NODE)strong.firstChild.nodeValue=strongValues[i++%strongValues.length];
    for(const r of roots())for(const holder of r.querySelectorAll('.partitionHolder--aiUsq')){
      for(const[partition,cell]of[['body-partition','td'],['body-partition','th headerCell--G6LXC'],['header-partition','td']]){
        const part=document.createElement('div');part.className=partition+' tablePartition--_ssZM synthetic-business-row';
        const inner=document.createElement('div');inner.className='partitionInner--GfmnB';const row=document.createElement('div');row.className='tr';const wrap=document.createElement('div');
        for(const text of ['Partner','Group','Participate','Incremental %','CPA','Adjusted CPA','Rating','No rows found','USD 1,234.56','2026-10-20','67']){const box=document.createElement('div');box.className=cell;const span=document.createElement('span');span.textContent=text;box.append(span);wrap.append(box);}
        row.append(wrap);inner.append(row);part.append(inner);holder.append(part);
      }
    }
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
const temporary = mkdtempSync(path.join(os.tmpdir(), 'impact-demogc-optimize-')), extension = path.join(temporary, 'extension');
cpSync(sourceDir, extension, { recursive: true });
for (const [file, hash] of Object.entries(sourceHashes)) assert.equal(sha(readFileSync(path.join(extension, file))), hash);
let context, page, worker, activePage = reportPage, activeVariant = {};
const results = [], observations = [], network = { interceptedRequests: 0 };
const check = async (name, action) => {
  try { results.push({ name, status: 'PASS', evidence: await action() }); console.log('OPTIMIZE PASS ' + name); }
  catch (error) { results.push({ name, status: 'FAIL', evidence: error.message }); console.log('OPTIMIZE FAIL ' + name + ': ' + error.message); }
};
async function open(item = reportPage, variant = {}, host = 'demo.impact.com', pathname = item.pathExact) {
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
  await check('All reviewed Optimize fixed Text positions translate with hidden titles counted separately',async()=>{
   for(const item of pages){await open(item);await settings(true,true);let error;try{await waitText(item);await proof();}catch(e){error=e.message;}const actual=await readText();observations.push({page:item.id,kind:item.kind,loadedVersionAtCapture:item.loadedVersion,provenance:item.provenance,synthetic:true,status:error?'FAIL':'PASS',...(error?{error}:{}),positions:item.fixedText.map(label=>({key:label.key,source:label.rawText,expected:expectation(label),actual:actual[label.key],capturedVisible:label.visible,status:actual[label.key]===expectation(label)?'PASS':'FAIL'}))});}
   assert(observations.every(x=>x.status==='PASS'),'Missing fixed Text in '+observations.filter(x=>x.status==='FAIL').map(x=>x.page).join(', '));return{positions:positionCount,uniqueEnglishSources:uniqueSourceCount,capturedVisiblePositions:positionCount-hiddenTextCount,hiddenTextOnlyPositions:hiddenTextCount,hiddenTitlesClaimedVisible:false,fieldMenus:'OBSERVED_UNADAPTED_NOT_IMPLEMENTED_OR_TESTED'};
  });
  if(!baseline){
   await check('Independent switches retain native Text structure inputs STRONG values same-word business rows and passive actions',async()=>{
    const protectedCounts=[];for(const item of pages){await open(item);for(const[enabled,aiEnabled]of[[true,true],[false,true],[true,false],[true,true]]){await settings(enabled,aiEnabled);await waitText(item,enabled);await proof();if(!aiEnabled)await page.waitForFunction(()=>window.__roots().every(r=>!r.querySelector('button.impact-cn-inline-help')));}
     await page.locator('.synthetic-native-inspect').click();assert.equal(await page.evaluate(()=>window.__proof.clicks),1);await proof();protectedCounts.push({page:item.id,...await page.evaluate(()=>({selectedStrong:window.__roots().reduce((n,r)=>n+r.querySelectorAll('strong').length,0),fabricatedBusinessRows:window.__roots().reduce((n,r)=>n+r.querySelectorAll('.synthetic-business-row').length,0)}))});}
    return{protectedCounts,independentSwitchStates:[[true,true],[false,true],[true,false],[true,true]],ApplyViewAllFilterOrBusinessClicks:0,actualBusinessValuesRead:false};
   });
   await check('Framework Text rewriting and native component or navigation Shadow remount need no switch operation',async()=>{
    for(const item of pages){await open(item);await waitText(item);await page.evaluate(()=>window.__rewrite());await waitText(item);await proof();await page.evaluate(()=>window.__remount());await waitText(item);await proof();}
    return{components:pages.length,rewrites:pages.length,remounts:pages.length,translationSwitchOperations:0,wholeNavigationHostRebuilt:true};
   });
   await check('Exact report path host top context and Light or Shadow role boundaries protect data values',async()=>{
    const seen=[];for(const item of pages){await open(item,{},'app.impact.com');await waitText(item);await proof();seen.push({page:item.id,variant:'production-host-synthetic',status:'PASS'});
     for(const variant of boundariesFor(item)){await open(item,variant,'demo.impact.com',variant.pathExact||item.pathExact);await waitText(item,variant.translated===true,page,variant.overrides||{});await proof();seen.push({page:item.id,variant:variant.id,status:'PASS'});}
     await open(item,{},'other.example');await waitText(item,false);await proof();seen.push({page:item.id,variant:'wrong-host',status:'PASS'});
     activePage=item;activeVariant={};await page.goto('https://demo.impact.com/synthetic-demogc-parent');const frame=page.frames().find(f=>f!==page.mainFrame())||await page.waitForEvent('frameattached');await frame.waitForFunction(()=>!!window.__proof);await waitText(item,false,frame);await proof(frame);seen.push({page:item.id,variant:'child-document',status:'PASS'});
    }
    return{variants:seen,productionBrowserVisit:false,reportQueriesExecuted:false};
   });
  }else results.push({name:'Candidate linked checks',status:'NOT_RUN',evidence:'Current complete old-package baseline records each observed fixed position; existing translations are not forced to English.'});
  await check('Complete loaded source snapshot and public input remain frozen with all network intercepted', async () => {
    for (const [file, hash] of Object.entries(sourceHashes)) { assert.equal(sha(readFileSync(path.join(extension, file))), hash); if (requireSourceUnchanged) assert.equal(sha(readFileSync(path.join(sourceDir, file))), hash); }
    assert.equal(sha(readFileSync(capturePath)),sha(captureBytes));assert.equal(sha(readFileSync(addonPath)),sha(addonBytes)); assert.equal(sha(readFileSync(fileURLToPath(import.meta.url))), testSHA256);
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
  const report = { mode: 'SYNTHETIC_DEMOGC_OPTIMIZE_REPORTS_MV3', version, status, baselineObservation: baseline, sourceDirectory: path.relative(root, sourceDir), sourceSHA256: sourceHashes, testSHA256, capture: { path: path.relative(root, capturePath), sha256: sha(captureBytes) },implementedAddon:{path:path.relative(root,addonPath),sha256:sha(addonBytes)},addonOnly,fullFieldMenuAddendumRead:false,unimplementedFieldMenus:'OBSERVED_UNADAPTED_NOT_COUNTED',input: { path: path.relative(root, inputPath), sha256: sha(inputBytes) }, expectations: { path: path.relative(root, targetsPath), sha256: sha(expectationBytes) }, positionCount, uniqueSourceCount, hiddenTextCount, observations, results, network, realSiteAcceptance: false, nativeSaveClicks: 0, actualPrivateValuesSaved: false };
  const reportPath = path.join(reportDir, 'test-' + stamp + '.json'); writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' }); console.log('Optimize report: ' + reportPath);
  rmSync(temporary, { recursive: true, force: true }); process.exitCode = status === 'PASS' ? 0 : 1;
}

/** Current shipped MV3 dictionary on synthetic native-style finance DOM only. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, cpSync, rmSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core'))); }

const sourceFolder = path.join(root, 'impact-cn-mod');
const shippedFiles = ['manifest.json', 'dict.js', 'site-config.js', 'content.js', 'content.css', 'background.js', 'popup.html', 'popup.js', 'popup.css'];
const shippedBytes = new Map(shippedFiles.map(file => [file, readFileSync(path.join(sourceFolder, file))]));
const assetSHA256 = Object.fromEntries([...shippedBytes].map(([file, bytes]) => [file, createHash('sha256').update(bytes).digest('hex')]));
const sandbox = {}; vm.createContext(sandbox); vm.runInContext(shippedBytes.get('dict.js').toString('utf8'), sandbox);
const dictionary = sandbox.IMPACT_CN_DICTIONARY;
const payouts = dictionary.entries.find(entry => entry.id === 'finance-upcoming-partner-payments-finalized-payouts-observed');
const overdue = dictionary.entries.find(entry => entry.id === 'finance-transfers-overdue-funding-status-observed');
const paymentDescription = dictionary.entries.find(entry => entry.id === 'finance-payment-methods-new-credit-card-description-observed');
const paymentReportsNavigation = dictionary.entries.find(entry => entry.id === 'finance-payment-methods-new-engage-reports-navigation-observed');
const monthlyClearAll = dictionary.entries.find(entry => entry.id === 'finance-monthly-close-clear-all-3c6c781');
const monthlyPath = '/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report';
const monthlyHandle = 'adv_gaap_summary_action';
const observedMonthlyPopupIds = ['fnDEnDPX', 'AVlWhJk6'];
const monthlySelector = 'div[class*="baseFilterPopup--"] > ul[class*="content--"][class*="multipleSelectionFilter--"] > li[class*="selectionLink--"]:nth-of-type(1) > a';
const paymentDescriptionSource='Draw from your credit card account. A handling charge will be charged per $100 (or part thereof) deposited.';
const paymentDescriptionTarget='从您的信用卡账户扣款。每充值 $100（或不足该金额的部分）均收取手续费。';
const paymentDescriptionPath='/secure/advertiser/finance/fr/payment-method/new/ui.ihtml';
const manifest = JSON.parse(shippedBytes.get('manifest.json').toString('utf8'));
const args = process.argv.slice(2);
assert(args.length === 0 || args.length === 2 && args[0] === '--report-dir' && args[1], 'Usage: node tests/finance-new-entries-regression.mjs [--report-dir DIRECTORY]');
const reportFolder = args.length ? path.resolve(root, args[1]) : path.join(root, 'artifacts/finance-phase1-20261010T083045525902Z');
const temporaryFolder = mkdtempSync(path.join(os.tmpdir(), 'impact-finance-new-entries-'));
const extensionFolder = path.join(temporaryFolder, 'extension');
cpSync(sourceFolder, extensionFolder, { recursive: true });
const reportFile = path.join(reportFolder, 'new-entries-report.json');
const results = [];
const documents = new Map();
let context;

async function check(name, action) {
  try { const evidence = await action(); results.push({ name, status: 'PASS', evidence }); console.log(`FINANCE NEW ENTRIES PASS ${name}`); }
  catch (error) { results.push({ name, status: 'FAIL', evidence: error.message }); console.log(`FINANCE NEW ENTRIES FAIL ${name}: ${error.message}`); }
}

function urlFor(host, pathname, query = {}) {
  const url = new URL(`https://${host}${pathname}`);
  for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value);
  return url.href;
}

function proofScript() {
  return `<script>
  const target=document.querySelector('#entry-under-test');
  const cell=document.querySelector('#business-cell');
  window.__newEntryProof={element:target,node:target.firstChild,parent:target.parentNode,children:[...target.childNodes],attributes:[...target.attributes].map(attribute=>[attribute.name,attribute.value]),nativeClicks:0,cell,cellNode:cell?.firstChild,cellSource:cell?.textContent};
  target.addEventListener('click',()=>window.__newEntryProof.nativeClicks++);
  </script>`;
}

function payoutDocument({ container = true, headingTag = 'h3' } = {}) {
  const label = `<${headingTag} id="entry-under-test">Finalized Payouts</${headingTag}>`;
  return `<!doctype html><html><body>${container ? `<div class="reportContainer--NoSIx">${label}</div>` : label}${proofScript()}</body></html>`;
}

function transferDocument(focused = [6]) {
  const labels = ['Partner', 'Program', 'Type', 'User Initiated', 'Activity Period', 'Funding Status ·', 'Invoice Status'];
  const filters = labels.map((label, index) => `<span class="filter"><div class="iui-component iui-multiselect-input"><div class="btn-container"><button type="button" class="${focused.includes(index + 1) ? 'focused ' : ''}responsive"><span>${label}</span></button></div></div></span>`).join('');
  return `<!doctype html><html><body><section id="native-filters">${filters}</section>
  <div class="_4-49-7_AJT64 _4-49-7_z1H5z"><ul class="iui-component iui-list">
  <li><div class="_4-49-7_VbPJn _4-49-7_MBWff"><div class="text-ellipsis _4-49-7_Baf2T">Fixture other status</div></div></li>
  <li><div class="_4-49-7_VbPJn _4-49-7_MBWff"><div id="entry-under-test" class="text-ellipsis _4-49-7_Baf2T">Overdue</div></div></li>
  </ul></div><table><tbody><tr><td id="business-cell">Overdue</td></tr></tbody></table>${proofScript()}</body></html>`;
}

function iframeDocument(frameURL) {
  return `<!doctype html><html><body><iframe id="native-finance-frame" src="${frameURL}" style="width:1100px;height:500px;border:0"></iframe></body></html>`;
}

function monthlyPopupDocument({ popupId = observedMonthlyPopupIds[0], variant = 'observed' } = {}) {
  const anchor = '<a id="entry-under-test" href="#fixture-native-clear" data-testid="native-clear-control">Clear all</a>';
  const target = `<li class="${variant === 'wrong-selection-link' ? 'fixturePrivateOption' : 'selectionLink--TSCXf'}">${variant === 'nested-anchor' ? `<span>${anchor}</span>` : anchor}</li>`;
  const privateOption = `<li id="private-option" class="${variant === 'non-first-li' ? 'fixturePrivateOption' : 'selectionLink--TSCXf'}"><a id="business-cell" href="#fixture-native-private">Clear all</a><span id="private-adjacent">Fixture private owner $2,450.67</span><input id="private-input" value="Fixture payment name"></li>`;
  const options = variant === 'non-first-li' ? privateOption + target : target + privateOption;
  const list = `<ul class="${variant === 'wrong-content' ? 'fixtureContent' : 'content--E27Oz'} ${variant === 'single-selection' ? 'singleSelectionFilter--FDzUm' : 'multipleSelectionFilter--OthnC'}">${options}</ul>`;
  return `<!doctype html><html><body><div id="${popupId}" data-testid="fixture-monthly-popup"><div class="${variant === 'wrong-popup' ? 'fixturePrivatePopup' : 'baseFilterPopup--ie_2Y'}">${variant === 'nested-list' ? `<section>${list}</section>` : list}</div></div>${proofScript()}<script>
  const popup=document.querySelector('[data-testid="fixture-monthly-popup"]');
  const targetNode=window.__newEntryProof.node;
  const elements=[popup,...popup.querySelectorAll('*')];
  const nodes=[];const walker=document.createTreeWalker(popup,NodeFilter.SHOW_TEXT);while(walker.nextNode())nodes.push({node:walker.currentNode,source:walker.currentNode.nodeValue});
  window.__monthlyPopupProof={popup,elements:elements.map(element=>({element,parent:element.parentNode,children:[...element.childNodes],attributes:[...element.attributes].map(attribute=>[attribute.name,attribute.value]),inputValue:element.tagName==='INPUT'?element.value:null})),nodes,targetNode,privateClicks:0};
  target.addEventListener('click',event=>event.preventDefault());
  cell.addEventListener('click',event=>{event.preventDefault();window.__monthlyPopupProof.privateClicks++});
  </script></body></html>`;
}

async function assertMonthlyPopupIdentity(frame) {
  await assertIdentity(frame);
  assert(await frame.evaluate(() => {
    const proof=window.__monthlyPopupProof;
    return proof.popup.isConnected && proof.elements.every(saved=>saved.element.isConnected
      && saved.element.parentNode===saved.parent && saved.element.childNodes.length===saved.children.length
      && saved.children.every((node,index)=>saved.element.childNodes[index]===node)
      && JSON.stringify([...saved.element.attributes].map(attribute=>[attribute.name,attribute.value]))===JSON.stringify(saved.attributes)
      && (saved.inputValue===null || saved.element.value===saved.inputValue))
      && proof.nodes.every(saved=>saved.node.isConnected && (saved.node===proof.targetNode || saved.node.nodeValue===saved.source));
  }), 'Monthly popup structure, attributes, Text identity or adjacent private Text/input values changed');
}

function paymentDescriptionDocument({source=paymentDescriptionSource,wrongSelector=false,shadow=false}={}){
  const contents='<div id="entry-under-test"><p id="'+(wrongSelector?'wrong-selector-description':'selector-description')+'" class="native-description" data-testid="fixed-description">'+source+'</p><span id="private-adjacent">Fixture owner $2,450.67</span><input id="private-input" value="Fixture payment name"></div>';
  return '<!doctype html><html><body><div id="fixture-shadow-host"></div>'+(!shadow?contents:'')+'<script>const container='+ (shadow?'document.querySelector("#fixture-shadow-host").attachShadow({mode:"open"})':'document')+';'+(shadow?'container.innerHTML='+JSON.stringify(contents)+';':'')+'const target=container.querySelector("p"),adjacent=container.querySelector("#private-adjacent"),input=container.querySelector("#private-input");window.__paymentDescriptionProof={element:target,node:target.firstChild,parent:target.parentNode,root:target.getRootNode(),children:[...target.childNodes],attributes:[...target.attributes].map(attribute=>[attribute.name,attribute.value]),adjacent,adjacentNode:adjacent.firstChild,adjacentSource:adjacent.textContent,input,inputValue:input.value,inputAttributes:[...input.attributes].map(attribute=>[attribute.name,attribute.value]),clicks:0};target.addEventListener("click",()=>window.__paymentDescriptionProof.clicks++);</script></body></html>';
}

async function assertPaymentDescriptionIdentity(frame){
  assert(await frame.evaluate(()=>{const p=window.__paymentDescriptionProof;return p.element.isConnected&&p.element.firstChild===p.node&&p.element.parentNode===p.parent&&p.element.getRootNode()===p.root&&p.element.childNodes.length===p.children.length&&p.children.every((node,index)=>p.element.childNodes[index]===node)&&JSON.stringify([...p.element.attributes].map(attribute=>[attribute.name,attribute.value]))===JSON.stringify(p.attributes)&&p.adjacent.isConnected&&p.adjacent.firstChild===p.adjacentNode&&p.adjacent.textContent===p.adjacentSource&&p.input.isConnected&&p.input.value===p.inputValue&&JSON.stringify([...p.input.attributes].map(attribute=>[attribute.name,attribute.value]))===JSON.stringify(p.inputAttributes);}), 'Payment description or adjacent private nodes, values, attributes changed');
}

function paymentReportsNavigationDocument({ shadow = true, wrongShadowHost = false, wrongSelector = false } = {}) {
  const contents = `<div id="entry-under-test" data-testid="${wrongSelector ? 'finance-summary-reports' : 'sidenav-expanded-submenu-reports_menu'}">Reports</div>`;
  return `<!doctype html><html><body><section id="${wrongShadowHost ? 'fixture-navigation' : 'adv-navigation'}"><impact-style-isolator id="native-navigation-isolator"></impact-style-isolator></section>
  <div id="light-reports" data-testid="sidenav-expanded-submenu-reports_menu">Reports</div>${shadow ? '' : contents}<script>
  const root=${shadow ? 'document.querySelector("#native-navigation-isolator").attachShadow({mode:"open"})' : 'document'};
  ${shadow ? `root.innerHTML=${JSON.stringify(contents)};` : ''}
  const element=root.querySelector('#entry-under-test'),light=document.querySelector('#light-reports');
  window.__reportNavigationProof={element,node:element.firstChild,parent:element.parentNode,root,children:[...element.childNodes],attributes:[...element.attributes].map(attribute=>[attribute.name,attribute.value]),nativeClicks:0,light,lightNode:light.firstChild,lightSource:light.textContent};
  element.addEventListener('click',()=>window.__reportNavigationProof.nativeClicks++);
  </script></body></html>`;
}

async function assertReportsNavigationIdentity(frame) {
  assert(await frame.evaluate(() => {
    const proof=window.__reportNavigationProof;
    return proof.element.isConnected && proof.root.querySelector('#entry-under-test')===proof.element
      && proof.element.firstChild===proof.node && proof.element.parentNode===proof.parent
      && proof.element.getRootNode()===proof.root && proof.element.childNodes.length===proof.children.length
      && proof.children.every((node,index)=>proof.element.childNodes[index]===node)
      && JSON.stringify([...proof.element.attributes].map(attribute=>[attribute.name,attribute.value]))===JSON.stringify(proof.attributes)
      && proof.light.isConnected && proof.light.firstChild===proof.lightNode && proof.light.textContent===proof.lightSource;
  }), 'Reports navigation Text, element, structure, attributes or same-label light DOM node changed');
}

async function assertIdentity(frame) {
  assert(await frame.evaluate(() => {
    const proof = window.__newEntryProof;
    return proof.element.isConnected && proof.element === document.querySelector('#entry-under-test')
      && proof.element.firstChild === proof.node && proof.element.parentNode === proof.parent
      && proof.children.every(node => [...proof.element.childNodes].includes(node))
      && JSON.stringify([...proof.element.attributes].map(attribute => [attribute.name, attribute.value])) === JSON.stringify(proof.attributes)
      && (!proof.cell || proof.cell.isConnected && proof.cell.firstChild === proof.cellNode && proof.cell.textContent === proof.cellSource);
  }), 'Original Text, element, children, attributes or same-name business cell changed');
}

try {
  await check(`Current ${dictionary.entries.length}-entry MV3 assets load without fixture dictionary or adapter replacements`, () => {
    assert(Array.isArray(dictionary.entries) && dictionary.entries.length > 0);
    assert.equal(new Set(dictionary.entries.map(entry => entry.id)).size, dictionary.entries.length);
    assert(payouts && overdue);
    assert.equal(payouts.source, 'Finalized Payouts'); assert.equal(overdue.source, 'Overdue');
    assert.equal(payouts.stage, 'native-finance'); assert.equal(overdue.stage, 'native-finance');
    assert.equal(manifest.manifest_version, 3); assert.deepEqual(manifest.permissions, ['storage']);
    for (const [file, bytes] of shippedBytes) assert(readFileSync(path.join(extensionFolder, file)).equals(bytes), `${file} copy differs from shipped source`);
    return 'Entire extension directory copied unchanged; current real dictionary, adapter, engine and worker retained byte-for-byte';
  });

  context = await chromium.launchPersistentContext(path.join(temporaryFolder, 'profile'), {
    executablePath: chromium.executablePath(), channel: 'chromium', headless: true,
    viewport: { width: 1400, height: 1000 },
    args: [`--disable-extensions-except=${extensionFolder}`, `--load-extension=${extensionFolder}`]
  });
  for (const host of ['demo.impact.com', 'app.impact.com']) await context.route(`https://${host}/**`, route => {
    const body = documents.get(route.request().url());
    return body ? route.fulfill({ contentType: 'text/html', headers: { 'cache-control': 'no-store' }, body }) : route.abort();
  });
  const page = context.pages()[0] || await context.newPage(); page.setDefaultTimeout(7000);
  const initialURL = urlFor('demo.impact.com', payouts.scope.pathExact, payouts.scope.query);
  documents.set(initialURL, payoutDocument());
  await page.goto(initialURL); await page.locator('#impact-cn-assistant').waitFor();
  const worker = context.serviceWorkers().find(item => item.url().startsWith('chrome-extension://')) || await context.waitForEvent('serviceworker', { timeout: 10000 });
  const extensionId = new URL(worker.url()).hostname;
  const popup = await context.newPage(); await popup.goto(`chrome-extension://${extensionId}/popup.html`);
  const setTranslation = async enabled => {
    await popup.evaluate(enabled => chrome.storage.local.set({ impactCNEnabled: enabled, impactCNAIEnabled: false }), enabled);
    await page.waitForFunction(enabled => document.querySelector('#impact-cn-assistant')?.dataset.enabled === String(enabled) && document.querySelector('#impact-cn-assistant')?.dataset.aiEnabled === 'false', enabled);
  };
  await setTranslation(true);

  const open = async (url, body, frameURL, frameBody) => {
    documents.set(url, body);
    if (frameURL) documents.set(frameURL, frameBody);
    await page.goto(url); await page.locator('#impact-cn-assistant').waitFor();
    assert.equal(await page.evaluate(() => Boolean(globalThis.ImpactCN)), false, 'Page must use the isolated MV3 engine');
    if (!frameURL) { await page.locator('#entry-under-test').waitFor(); return page.mainFrame(); }
    const financeFrame = page.locator('#native-finance-frame').contentFrame();
    await financeFrame.locator('#entry-under-test').waitFor();
    const frames = page.frames().filter(frame => frame.url() === frameURL); assert.equal(frames.length, 1);
    assert.equal(await frames[0].evaluate(() => Boolean(globalThis.ImpactCN)), false, 'Child must use its independently injected isolated MV3 engine');
    assert.equal(await financeFrame.locator('#impact-cn-assistant').count(), 0);
    return frames[0];
  };
  const verifyCycle = async (frame, entry) => {
    for (const enabled of [true, false, true]) {
      await setTranslation(enabled);
      await frame.waitForFunction(expected => document.querySelector('#entry-under-test').firstChild.nodeValue === expected, enabled ? entry.target : entry.source);
      await assertIdentity(frame);
    }
    await frame.locator('#entry-under-test').click();
    assert.equal(await frame.evaluate(() => window.__newEntryProof.nativeClicks), 1, 'Original native listener must remain attached');
  };
  const verifyEnglish = async (frame, source) => {
    await setTranslation(true); await page.waitForTimeout(150);
    assert.equal(await frame.locator('#entry-under-test').textContent(), source);
    await assertIdentity(frame);
  };

  await check('Finalized Payouts correct r1 handle and report H3 preserve native identity through ON/OFF/ON on both domains', async () => {
    for (const host of ['demo.impact.com', 'app.impact.com']) {
      const url = urlFor(host, payouts.scope.pathExact, payouts.scope.query);
      const frame = await open(url, payoutDocument()); await verifyCycle(frame, payouts);
    }
    return 'Observed reportContainer H3 translates and restores exact original Text, element, attributes and native click listener on demo/app';
  });

  await check('Finalized Payouts wrong handle, r2, duplicate handle, missing report container and non-H3 stay English', async () => {
    const correctURL = urlFor('demo.impact.com', payouts.scope.pathExact, payouts.scope.query);
    const variants = [
      [urlFor('demo.impact.com', payouts.scope.pathExact, { handle: 'adv_cash_flow_recon' }), payoutDocument()],
      [urlFor('demo.impact.com', '/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report', { handle: 'adv_cash_flow_recon' }), payoutDocument()],
      [`${correctURL}&handle=adv_upcoming_payouts`, payoutDocument()],
      [correctURL, payoutDocument({ container: false })],
      [correctURL, payoutDocument({ headingTag: 'p' })]
    ];
    for (const [url, body] of variants) {
      const frame = await open(url, body); await verifyEnglish(frame, payouts.source);
    }
    return 'Five route/query/component negatives retain the original English node under actual shipped rules';
  });

  await check('Finalized Payouts correct child report under a different top report stays English', async () => {
    const frameURL = urlFor('demo.impact.com', payouts.scope.pathExact, payouts.scope.query);
    const topURL = urlFor('demo.impact.com', '/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report', { handle: 'adv_cash_flow_recon' });
    const frame = await open(topURL, iframeDocument(frameURL), frameURL, payoutDocument());
    await verifyEnglish(frame, payouts.source);
    return 'Correct source document cannot translate beneath an unapproved report top path/handle';
  });

  const openTransfer = async (host, focused, topQuery = overdue.scope.topQuery) => {
    const frameURL = urlFor(host, overdue.scope.pathExact, overdue.scope.query);
    const topURL = urlFor(host, overdue.scope.topPaths[0], topQuery);
    return open(topURL, iframeDocument(frameURL), frameURL, transferDocument(focused));
  };
  await check('Overdue sixth Funding Status exclusively focused translates the observed UL while preserving same-name business cells', async () => {
    for (const host of ['demo.impact.com', 'app.impact.com']) {
      const frame = await openTransfer(host, [6]); await verifyCycle(frame, overdue);
      assert.equal(await frame.locator('#business-cell').textContent(), 'Overdue');
    }
    return 'Actual nth-of-type(6) focused native filter and observed li:nth-of-type(2) structure translate only the enum; ON/OFF/ON preserves source nodes on demo/app';
  });

  await check('Overdue without Funding Status focus or with Partner/User focus stays English', async () => {
    for (const focused of [[], [1], [4], [1, 6], [4, 6]]) {
      const frame = await openTransfer('demo.impact.com', focused); await verifyEnglish(frame, overdue.source);
      assert.equal(await frame.locator('#business-cell').textContent(), overdue.source);
    }
    return 'No focus, Partner-only, User-only and simultaneous Partner/User plus Funding Status cannot trigger enum translation';
  });

  await check('The same Overdue Text restores English when a reused menu changes from Funding Status to Partner or User focus', async () => {
    for (const destination of [1, 4]) {
      const frame = await openTransfer('demo.impact.com', [6]);
      await frame.waitForFunction(target => document.querySelector('#entry-under-test').firstChild.nodeValue === target, overdue.target);
      // Let startup translation mutations finish before reusing an established
      // menu; otherwise its already queued Text scan can mask a scope leak.
      await page.waitForTimeout(200);
      await frame.evaluate(destination => {
        // Simulate only native focus-class changes; retain the popup and its
        // exact Text node to exercise real framework menu reuse.
        const buttons = [...document.querySelectorAll('#native-filters span.filter > div.iui-component.iui-multiselect-input > div.btn-container > button')];
        buttons.forEach((button, index) => button.classList.toggle('focused', index + 1 === destination));
      }, destination);
      await frame.waitForFunction(source => document.querySelector('#entry-under-test').firstChild.nodeValue === source, overdue.source, { timeout: 3500 });
      await assertIdentity(frame);
      assert.equal(await frame.locator('#business-cell').textContent(), overdue.source);
    }
    return 'Class-only Funding Status to Partner/User transitions restore the reused native Text without changing its identity or business names';
  });

  await check('Overdue correct focused source under wrong or duplicate top query stays English', async () => {
    const frame = await openTransfer('demo.impact.com', [6], { u: '/secure/finance/app/another-document.ihtml' });
    await verifyEnglish(frame, overdue.source);
    const frameURL = urlFor('demo.impact.com', overdue.scope.pathExact);
    const topURL = `${urlFor('demo.impact.com', overdue.scope.topPaths[0], overdue.scope.topQuery)}&u=${encodeURIComponent(overdue.scope.topQuery.u)}`;
    const duplicate = await open(topURL, iframeDocument(frameURL), frameURL, transferDocument([6]));
    await verifyEnglish(duplicate, overdue.source);
    return 'Verified enum component cannot escape its single exact top-shell routing query';
  });

  await check('Observed credit-card fixed description preserves $100, native Text/events and adjacent private values on both shipped MV3 domains',async()=>{
    assert(paymentDescription,'Current shipped dictionary lacks the observed credit-card description');assert.equal(paymentDescription.source,paymentDescriptionSource);assert.equal(paymentDescription.target,paymentDescriptionTarget);assert.equal(paymentDescription.match,'exact');assert.equal(paymentDescription.scope.pathExact,paymentDescriptionPath);assert.equal(paymentDescription.scope.topOnly,true);assert.equal(paymentDescription.scope.lightDOMOnly,true);assert.deepEqual([...paymentDescription.scope.topPaths],[paymentDescriptionPath]);assert.deepEqual([...paymentDescription.scope.hosts].sort(),['app.impact.com','demo.impact.com']);
    for(const host of ['demo.impact.com','app.impact.com']){const frame=await open(urlFor(host,paymentDescriptionPath),paymentDescriptionDocument());for(const enabled of [true,false,true]){await setTranslation(enabled);await frame.waitForFunction(expected=>window.__paymentDescriptionProof.node.nodeValue===expected,enabled?paymentDescriptionTarget:paymentDescriptionSource);assert(await frame.evaluate(()=>window.__paymentDescriptionProof.node.nodeValue.includes('$100')));await assertPaymentDescriptionIdentity(frame);}await frame.locator('#selector-description').click();assert.equal(await frame.evaluate(()=>window.__paymentDescriptionProof.clicks),1);}
    return 'Actual unchanged MV3 sources translate only the observed entire description; ON/OFF/ON preserves $100 bytes, Text/element/attributes/listener, adjacent private text and editor value';
  });

  await check('Credit-card description wrong document/top, same-path child, selector, Shadow and changed $200 source remain untouched',async()=>{
    assert(paymentDescription,'Current shipped dictionary lacks the observed credit-card description');const correct=urlFor('demo.impact.com',paymentDescriptionPath),wrong=urlFor('demo.impact.com','/secure/advertiser/finance/fr/payment-methods/ui.ihtml');
    for(const[url,body,frameURL,frameBody,expected]of[[wrong,paymentDescriptionDocument(),null,null,paymentDescriptionSource],[wrong,iframeDocument(correct),correct,paymentDescriptionDocument(),paymentDescriptionSource],[correct+'?fixture=top',iframeDocument(correct),correct,paymentDescriptionDocument(),paymentDescriptionSource],[correct,paymentDescriptionDocument({wrongSelector:true}),null,null,paymentDescriptionSource],[correct,paymentDescriptionDocument({shadow:true}),null,null,paymentDescriptionSource],[correct,paymentDescriptionDocument({source:paymentDescriptionSource.replace('$100','$200')}),null,null,paymentDescriptionSource.replace('$100','$200')]]){const frame=await open(url,body,frameURL,frameBody);await setTranslation(true);await page.waitForTimeout(200);assert.equal(await frame.evaluate(()=>window.__paymentDescriptionProof.node.nodeValue),expected);await assertPaymentDescriptionIdentity(frame);}
    return 'Six actual shipped route/top/same-path-child/component/Shadow/currency-source negatives preserve exact source nodes and private adjacent data';
  });

  await check('Observed new-payment Reports DIV translates only in the exact native navigation Shadow while preserving light DOM and native identity', async () => {
    assert(paymentReportsNavigation, 'Current shipped dictionary lacks the observed new-payment Reports navigation');
    assert.equal(paymentReportsNavigation.source, 'Reports'); assert.equal(paymentReportsNavigation.target, '数据报表');
    assert.equal(paymentReportsNavigation.match, 'exact'); assert.equal(paymentReportsNavigation.scope.pathExact, paymentDescriptionPath);
    assert.equal(paymentReportsNavigation.scope.topOnly, true);
    assert.equal(paymentReportsNavigation.scope.shadowHost, '#adv-navigation > impact-style-isolator');
    assert.equal(paymentReportsNavigation.scope.selector, 'div[data-testid="sidenav-expanded-submenu-reports_menu"]');
    assert.deepEqual([...paymentReportsNavigation.scope.topPaths], [paymentDescriptionPath]);
    assert.deepEqual([...paymentReportsNavigation.scope.hosts].sort(), ['app.impact.com', 'demo.impact.com']);
    assert.equal(Boolean(paymentReportsNavigation.helpTopicId), false);
    assert.equal(dictionary.helpTopics.some(topic => topic.entryIds?.includes(paymentReportsNavigation.id)), false);
    for (const host of ['demo.impact.com', 'app.impact.com']) {
      const frame = await open(urlFor(host, paymentDescriptionPath), paymentReportsNavigationDocument());
      for (const enabled of [true, false, true]) {
        await setTranslation(enabled);
        await frame.waitForFunction(expected => window.__reportNavigationProof.node.nodeValue === expected, enabled ? paymentReportsNavigation.target : paymentReportsNavigation.source);
        await assertReportsNavigationIdentity(frame);
        assert.equal(await frame.locator('#light-reports').textContent(), 'Reports');
      }
      await frame.locator('#entry-under-test').click();
      assert.equal(await frame.evaluate(() => window.__reportNavigationProof.nativeClicks), 1);
    }
    return 'Actual shipped demo/app MV3 translates and restores only the observed DIV under the exact native Shadow host; same-label light DOM, Text, structure, attributes and native click listener remain intact';
  });

  await check('New-payment Reports light DOM, wrong Shadow host, different finance component and wrong document/top/child remain English', async () => {
    assert(paymentReportsNavigation, 'Current shipped dictionary lacks the observed new-payment Reports navigation');
    const correct = urlFor('demo.impact.com', paymentDescriptionPath);
    const wrong = urlFor('demo.impact.com', '/secure/advertiser/finance/fr/payment-methods/ui.ihtml');
    const variants = [
      [correct, paymentReportsNavigationDocument({ shadow: false })],
      [correct, paymentReportsNavigationDocument({ wrongShadowHost: true })],
      [correct, paymentReportsNavigationDocument({ wrongSelector: true })],
      [wrong, paymentReportsNavigationDocument()],
      [wrong, iframeDocument(correct), correct, paymentReportsNavigationDocument()],
      [`${correct}?fixture=reports-top`, iframeDocument(correct), correct, paymentReportsNavigationDocument()]
    ];
    for (const [url, body, frameURL, frameBody] of variants) {
      const frame = await open(url, body, frameURL, frameBody);
      await setTranslation(true); await page.waitForTimeout(200);
      assert.equal(await frame.evaluate(() => window.__reportNavigationProof.node.nodeValue), 'Reports');
      await assertReportsNavigationIdentity(frame);
    }
    return 'Six route/top/child/Shadow/component negatives preserve Reports; fixtures use plain DIVs without generic a/span/subitem-label selectors to avoid false negatives against existing legitimate navigation rules';
  });

  await check('Monthly Clear all uses the observed four-level first-tool scope without either generated popup ID', () => {
    assert(monthlyClearAll, 'Current shipped dictionary lacks Monthly Clear all');
    assert.equal(monthlyClearAll.source, 'Clear all'); assert.equal(monthlyClearAll.target, '清除全部');
    assert.equal(monthlyClearAll.match, 'exact'); assert.equal(monthlyClearAll.scope.selector, monthlySelector);
    assert.equal(monthlyClearAll.scope.path, monthlyPath); assert.equal(monthlyClearAll.scope.pathExact, monthlyPath);
    assert.deepEqual([...monthlyClearAll.scope.topPaths], [monthlyPath]);
    assert.deepEqual([...monthlyClearAll.scope.hosts].sort(), ['app.impact.com', 'demo.impact.com']);
    assert.deepEqual(Object.entries(monthlyClearAll.scope.query), [['handle', monthlyHandle]]);
    assert.deepEqual(Object.entries(monthlyClearAll.scope.topQuery), [['handle', monthlyHandle]]);
    assert.equal(Boolean(monthlyClearAll.scope.shadowHost), false);
    for (const popupId of observedMonthlyPopupIds) assert.equal(monthlyClearAll.scope.selector.includes(popupId), false);
    return { entryId: monthlyClearAll.id, popupIds: observedMonthlyPopupIds, selector: monthlySelector, documentPath: monthlyPath, singleHandle: monthlyHandle, shadowHost: null };
  });

  await check('Both observed Monthly popup IDs preserve ON/OFF/ON Text, native events and private neighbors on demo/app', async () => {
    const cases = [];
    for (const host of ['demo.impact.com', 'app.impact.com']) for (const popupId of observedMonthlyPopupIds) {
      const frame = await open(urlFor(host, monthlyPath, { handle: monthlyHandle }), monthlyPopupDocument({ popupId }));
      assert.equal(await frame.locator(monthlySelector).count(), 1, 'Observed four-level scope must match only the first tool');
      for (const enabled of [true, false, true]) {
        await setTranslation(enabled);
        await frame.waitForFunction(expected => window.__newEntryProof.node.nodeValue === expected, enabled ? monthlyClearAll.target : monthlyClearAll.source);
        await assertMonthlyPopupIdentity(frame);
        assert.equal(await frame.locator('#business-cell').textContent(), 'Clear all');
      }
      await frame.locator('#entry-under-test').click();
      await frame.locator('#business-cell').click();
      assert.deepEqual(await frame.evaluate(() => [window.__newEntryProof.nativeClicks, window.__monthlyPopupProof.privateClicks]), [1, 1]);
      await assertMonthlyPopupIdentity(frame);
      cases.push({ host, popupId, cycle: ['ON', 'OFF', 'ON'], nativeClicks: 1, privateClicks: 1, exactTextIdentityPreserved: true, structureAttributesAndPrivateValuesPreserved: true });
    }
    return { cases };
  });

  await check('Monthly Clear all rejects wrong document/top, missing/wrong/duplicate document handle and wrong/duplicate top handle', async () => {
    const correct = urlFor('demo.impact.com', monthlyPath, { handle: monthlyHandle });
    const wrongDocument = urlFor('demo.impact.com', '/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report', { handle: monthlyHandle });
    const wrongHandle = urlFor('demo.impact.com', monthlyPath, { handle: 'adv_cash_flow_recon' });
    const duplicateHandle = `${correct}&handle=${monthlyHandle}`;
    const variants = [
      { name: 'wrong-document', url: wrongDocument },
      { name: 'missing-document-handle', url: urlFor('demo.impact.com', monthlyPath) },
      { name: 'wrong-document-handle', url: wrongHandle },
      { name: 'duplicate-document-handle', url: duplicateHandle },
      { name: 'correct-child-under-wrong-top-document', url: wrongDocument, frameURL: correct },
      { name: 'correct-child-under-wrong-top-handle', url: wrongHandle, frameURL: correct },
      { name: 'correct-child-under-missing-top-handle', url: urlFor('demo.impact.com', monthlyPath), frameURL: correct },
      { name: 'correct-child-under-duplicate-top-handle', url: duplicateHandle, frameURL: correct },
      { name: 'duplicate-child-handle-under-correct-top', url: correct, frameURL: duplicateHandle }
    ];
    for (const variant of variants) {
      const fixture = monthlyPopupDocument({ popupId: observedMonthlyPopupIds[1] });
      const frame = await open(variant.url, variant.frameURL ? iframeDocument(variant.frameURL) : fixture, variant.frameURL, variant.frameURL ? fixture : undefined);
      await verifyEnglish(frame, monthlyClearAll.source); await assertMonthlyPopupIdentity(frame);
    }
    return { cases: variants.map(({ name }) => name), originalEnglishTextAndPrivateValuesPreserved: true };
  });

  await check('Monthly Clear all rejects different popup/list classes, broken direct hierarchy and any non-first or non-tool LI', async () => {
    const variants = ['wrong-popup', 'wrong-content', 'single-selection', 'wrong-selection-link', 'nested-anchor', 'nested-list', 'non-first-li'];
    for (const variant of variants) {
      const frame = await open(urlFor('demo.impact.com', monthlyPath, { handle: monthlyHandle }), monthlyPopupDocument({ popupId: observedMonthlyPopupIds[1], variant }));
      assert.equal(await frame.locator(monthlySelector).count(), 0, `${variant} unexpectedly matches the first-tool component scope`);
      await verifyEnglish(frame, monthlyClearAll.source); await assertMonthlyPopupIdentity(frame);
      await frame.locator('#entry-under-test').click();
      assert.equal(await frame.evaluate(() => window.__newEntryProof.nativeClicks), 1, 'Untranslated negative retains native listener');
      await assertMonthlyPopupIdentity(frame);
    }
    return { cases: variants, originalEnglishTextNativeEventsAndPrivateValuesPreserved: true };
  });

  await check('All shipped test-loaded assets remain identical to current source after the suite', () => {
    for (const [file, bytes] of shippedBytes) {
      assert(readFileSync(path.join(extensionFolder, file)).equals(bytes), `${file} temporary copy changed`);
      assert(readFileSync(path.join(sourceFolder, file)).equals(bytes), `${file} source changed while checks were running`);
    }
    return 'No dictionary, adapter, manifest, engine, worker, CSS or popup mutation during synthetic validation';
  });
} catch (error) {
  results.push({ name: 'Synthetic MV3 setup', status: 'FAIL', evidence: error.message });
} finally {
  if (context) await context.close();
  rmSync(temporaryFolder, { recursive: true, force: true });
  const status = results.length > 0 && results.every(result => result.status === 'PASS') ? 'PASS' : 'FAIL';
  mkdirSync(reportFolder, { recursive: true });
  writeFileSync(reportFile, JSON.stringify({
    status, mode: 'SYNTHETIC_CURRENT_SHIPPED_FINANCE_NEW_ENTRIES', date: new Date().toISOString(),
    version: dictionary.version, dictionaryEntries: dictionary.entries.length,
    entryIds: [payouts?.id, overdue?.id,paymentDescription?.id,paymentReportsNavigation?.id,monthlyClearAll?.id], unchangedShippedDictionary: true,
    unchangedShippedAdapter: true, unchangedShippedEngine: true, actualUnpackedMV3: true,
    realSiteAcceptance: false, realNetworkQueries: false, userBrowserOperated: false,
    credentialsSaved: false, fullConversationSaved: false, assetSHA256, results
  }, null, 2));
  process.exitCode = status === 'PASS' ? 0 : 1;
}

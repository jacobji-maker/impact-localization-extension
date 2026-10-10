/** Real MV3 engine on isolated routed iframe/Shadow fixtures; never live-site acceptance. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync, cpSync, existsSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core'))); }
const sandbox = {}; vm.createContext(sandbox); vm.runInContext(readFileSync(path.join(root, 'impact-cn-mod/dict.js'), 'utf8'), sandbox);
const shipped = sandbox.IMPACT_CN_DICTIONARY;
const manifest = JSON.parse(readFileSync(path.join(root, 'impact-cn-mod/manifest.json'), 'utf8'));
const folder = path.join(root, 'artifacts/finance-tests'); mkdirSync(folder, { recursive: true });
const workspace = mkdtempSync(path.join(os.tmpdir(), 'impact-finance-mechanism-'));
const extensionPath = path.join(workspace, 'extension'); cpSync(path.join(root, 'impact-cn-mod'), extensionPath, { recursive: true });
const topPath = '/secure/advertiser/finance/fr/finance-overview.ihtml';
const framePath = '/secure/finance/app/brand-overview-view.ihtml';
const topQuery = { u: framePath }, frameQuery = { view: 'fixture' };
const baseScope = { hosts: ['app.impact.com', 'demo.impact.com'], pathExact: framePath, query: frameQuery, topPaths: [topPath], topQuery, selector: '.unit-label' };
const unitEntries = [
  { id: 'finance-unit-funding', source: 'Required funding', target: '需补充资金', match: 'exact', scope: { ...baseScope, shadowHost: 'finance-unit-shadow' } },
  { id: 'finance-unit-due', source: 'Due through', target: '到期日截至', match: 'prefix', scope: { ...baseScope, shadowHost: 'finance-unit-shadow' } },
  { id: 'finance-unit-interactive', source: 'Legal Entities', target: '法律主体', match: 'exact', scope: { ...baseScope, selector: 'a.unit-label,button.unit-label,label.unit-label', shadowHost: 'finance-unit-shadow' } },
  { id: 'finance-unit-billing-suffix', source: 'billing group - Partner Payments', target: '账单分组 - 伙伴付款', match: 'suffix', scope: { ...baseScope, selector: '.unit-suffix', shadowHost: 'finance-unit-shadow' } }
];
unitEntries.unshift({id:'old-shared-unit-reports',source:'Reports',target:'数据报表',match:'exact',scope:{hosts:['app.impact.com','demo.impact.com'],path:'/secure/',selector:'.unit-reports',shadowHost:'finance-unit-shadow'}});
unitEntries.push({id:'finance-unit-reports',source:'Reports',target:'财务报告',match:'exact',scope:{...baseScope,selector:'.unit-reports',shadowHost:'finance-unit-shadow'}});
for(const [id,selector,target]of[['count','.unit-pagination','显示第 {start} - {end} 行，共 {total} 行'],['invalid-repeat','.unit-invalid-repeat','显示第 {start} - {start} 行，共 {total} 行'],['invalid-missing','.unit-invalid-missing','显示第 {start} 行，共 {total} 行']])unitEntries.push({id:`finance-unit-${id}`,source:'Displaying: {start} - {end} of {total}',target,match:'numeric-template',scope:{...baseScope,selector,shadowHost:'finance-unit-shadow'}});
const topic = { id: 'finance-unit-required-funding', title: '需补充资金', entryIds: ['finance-unit-funding','finance-unit-due','finance-unit-interactive'], question: '解释联盟营销财务中的需补充资金，并说明与充值到账的区别。', helpUrl: 'https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained' };
const otherTopic={...topic,id:'finance-unit-other-shell',entryIds:['finance-unit-other-shell-entry']};
const splitTopic={...topic,id:'finance-unit-split-scope',entryIds:['finance-unit-split-source','finance-unit-split-top']};
const topOnlyTopic={...topic,id:'finance-unit-top-only',entryIds:['finance-unit-top-only-entry']};
unitEntries.push({id:'finance-unit-top-only-entry',source:'Top-only fixture concept',target:'顶层概念',match:'exact',helpTopicId:topOnlyTopic.id,scope:{...baseScope,topOnly:true}});
const otherTop='/secure/advertiser/finance/fr/another-shell.ihtml';
for(const [id,topicId,scope]of[['finance-unit-other-shell-entry',otherTopic.id,{...baseScope,topPaths:[otherTop]}],['finance-unit-split-source',splitTopic.id,{...baseScope,topPaths:[otherTop]}],['finance-unit-split-top',splitTopic.id,{...baseScope,pathExact:'/secure/finance/app/another-document.ihtml'}]])unitEntries.push({id,source:'Unrendered fixture concept',target:'未渲染概念',match:'exact',helpTopicId:topicId,scope:{...scope,selector:'.unrendered-fixture'}});
for(const entry of unitEntries)if(topic.entryIds.includes(entry.id))entry.helpTopicId=topic.id;
const malformedCounts=['Displaying: 10,20 - 30 of 100','Displaying: 1,,000 - 2 of 3','Displaying: 1, - 2 of 3','Displaying: 1 - 2 of ,100','Displaying: 1234,567 - 8 of 9'];
// Only the test dictionary and adapter differ. Shipped engine/worker/manifest are copied byte-for-byte.
writeFileSync(path.join(extensionPath, 'dict.js'), `globalThis.IMPACT_CN_DICTIONARY=${JSON.stringify({ version: shipped.version, entries: unitEntries, helpTopics: [topic,otherTopic,splitTopic,topOnlyTopic] })};\n`);
writeFileSync(path.join(extensionPath, 'site-config.js'), `globalThis.IMPACT_CN_CONFIG=${JSON.stringify({ assistant: true, assistantAvoidSelectors: ['.finance-bubble'], localization: { rootSelectors: ['#unit-finance-root'], ignoreSelectors: ['#ask-impact-shadow-host'] }, ai: { rootSelectors: ['#ask-impact-shadow-host'], openerIndicatesClosed: false, inputSelectors: ['textarea[placeholder="ask impact..."]'], sendSelectors: ['button[aria-label="Send"]'], openerSelectors: ['button[aria-label="Open Ask Impact"]'] } })};
// Isolated fixture adapter exposes only test messages, never a product API.
window.addEventListener('message',async event=>{if(event.source!==window||event.origin!==location.origin||!event.data?.__financeUnitProbe)return;const {token,topicId}=event.data.__financeUnitProbe;const result=await chrome.runtime.sendMessage({type:'impact-cn:frame-ask-topic',topicId,ignoredFixtureField:'discard-me'});window.postMessage({__financeUnitResult:{token,result}},location.origin);});\n`);
const results = [];
const only = process.argv.find(argument => argument.startsWith('--only='))?.slice(7);
let previousReport;
if(process.argv.includes('--merge-previous')){assert(only,'Merging requires an explicit targeted --only check');previousReport=JSON.parse(readFileSync(path.join(folder,'unit-report.json'),'utf8'));assert.equal(previousReport.version,shipped.version);assert.equal(previousReport.mode,'SYNTHETIC_FINANCE_IFRAME_MECHANISM_ONLY');assert.equal(previousReport.status,'PASS');}
async function check(name, action) { if (only && !new RegExp(only, 'i').test(name)) return; try { const evidence = await action(); results.push({ name, status: 'PASS', evidence }); console.log(`FINANCE UNIT PASS ${name}`); } catch (error) { results.push({ name, status: 'FAIL', evidence: error.message }); console.log(`FINANCE UNIT FAIL ${name}: ${error.message}`); } }

const fixtureTop = `<!doctype html><body><main id="unit-finance-root"></main><div id="ask-impact-shadow-host" style="position:fixed;left:24px;bottom:24px;z-index:20"></div><script>
const root=document.querySelector('#ask-impact-shadow-host').attachShadow({mode:'open'});
const input=document.createElement('textarea');input.placeholder='ask impact...';root.append(input);
const send=document.createElement('button');send.setAttribute('aria-label','Send');send.textContent='Send';root.append(send);
window.__financeUnitTop={sends:0,inputEvents:0,prompts:[],originalAttachShadow:Element.prototype.attachShadow};
input.addEventListener('input',()=>window.__financeUnitTop.inputEvents++);
send.addEventListener('click',()=>{window.__financeUnitTop.sends++;window.__financeUnitTop.prompts.push(input.value);input.value='';});
</script></body>`;
const fixtureFrame = `<!doctype html><body><main id="unit-finance-root"><finance-unit-shadow></finance-unit-shadow><other-unit-shadow></other-unit-shadow><span class="unit-label" id="outside-shadow">Required funding</span></main><script>
window.__financeUnit={records:[],negative:[],originalAttachShadow:Element.prototype.attachShadow,nativeLinkClicks:0,nativeButtonClicks:0};
function mountUnit(){const host=document.querySelector('finance-unit-shadow'),shadow=host.attachShadow({mode:'open'});const make=(tag,text,cls='unit-label')=>{const element=document.createElement(tag);element.className=cls;const node=document.createTextNode(text);element.append(node);window.__financeUnit.records.push({element,node,text});shadow.append(element);return element;};
make('span','Required funding');make('span','Due through Nov 24, 2026)');const money=make('span','$123,456.78','amount');money.id='unit-amount';
const suffix=make('span','  Acme [R&D] $ Example\\t billing group - Partner Payments  ','unit-suffix');suffix.id='unit-billing-suffix';
make('span','Reports','unit-reports');
make('span','Displaying: 1,020 - 1,040 of 5,678','unit-pagination').id='unit-pagination';
make('span','Displaying: 1,020 - 1,040 of 5,678','unit-invalid-repeat');make('span','Displaying: 1,020 - 1,040 of 5,678','unit-invalid-missing');
make('span','Displaying: Acme - 15 of $16','unit-pagination');make('span','Prefix Displaying: 10 - 20 of 100','unit-pagination');
for(const source of ${JSON.stringify(malformedCounts)})make('span',source,'unit-pagination');
const link=make('a','Legal Entities');link.href='/secure/unit-existing-link';link.addEventListener('click',event=>{event.preventDefault();window.__financeUnit.nativeLinkClicks++;});
const button=make('button','Legal Entities');button.type='button';button.addEventListener('click',()=>window.__financeUnit.nativeButtonClicks++);
const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.id='unit-checkbox';shadow.append(checkbox);const label=make('label','Legal Entities');label.htmlFor=checkbox.id;
const wrong=document.querySelector('other-unit-shadow').attachShadow({mode:'open'});const negative=document.createElement('span');negative.className='unit-label';negative.textContent='Required funding';wrong.append(negative);window.__financeUnit.negative.push({element:negative,node:negative.firstChild,text:'Required funding'});
const outside=document.querySelector('#outside-shadow');window.__financeUnit.negative.push({element:outside,node:outside.firstChild,text:outside.textContent});
}
setTimeout(mountUnit,120);
</script></body>`;
let context;
try {
  await check('Shipped finance entries are observed, scoped and paired only with official finance topics', async () => {
    assert(manifest.content_scripts.some(script => script.all_frames === true), 'MV3 must inject the engine into finance iframe documents');
    assert(manifest.background?.service_worker, 'Child Ask Impact requests need the shipped extension worker');
    const entries = shipped.entries.filter(entry => entry.stage === 'native-finance' || entry.observedSource === 'docs/finance-dom-scan.json');
    assert(entries.length, 'Native finance dictionary is not ready'); assert(existsSync(path.join(root, 'docs/finance-dom-scan.json')), 'Real finance DOM capture is required');
    for (const entry of entries) {
      assert(entry.source && entry.target && entry.reason && entry.id, 'A finance entry lacks source/target/reason/id'); assert.equal(entry.verification, 'observed-dom'); assert.equal(entry.observedSource, 'docs/finance-dom-scan.json');
      assert(entry.scope?.hosts?.includes('demo.impact.com') && entry.scope?.selector && (entry.scope?.pathExact || entry.scope?.paths?.length || entry.scope?.path), `${entry.id} lacks a verified host/path/component scope`);
      if (entry.scope?.pathExact?.startsWith('/secure/finance/')) assert(entry.scope.topPaths?.length, `${entry.id} iframe scope lacks its enclosing advertiser page`);
      if (entry.helpTopicId) { const candidate = shipped.helpTopics.find(item => item.id === entry.helpTopicId); assert(candidate, `${entry.id} references a missing topic`); const url = new URL(candidate.helpUrl); assert.equal(url.hostname, 'help.impact.com'); assert.equal(url.protocol, 'https:'); assert(candidate.question); }
    }
    return `${entries.length} observed finance entries validated against strict host/path/component scope; shipped MV3 all_frames and worker present`;
  });
  if(only!=='Shipped finance entries'){
  context = await chromium.launchPersistentContext(path.join(workspace, 'profile'), { executablePath: chromium.executablePath(), channel: 'chromium', headless: true, viewport: { width: 1400, height: 1000 }, args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`] });
  for (const hostname of ['demo.impact.com','app.impact.com']) await context.route(`https://${hostname}/**`, route => route.fulfill({ contentType: 'text/html', body: new URL(route.request().url()).pathname.startsWith('/secure/finance/') ? fixtureFrame : fixtureTop }));
  const page = context.pages()[0] || await context.newPage(); page.setDefaultTimeout(9000);
  const topURL = `https://demo.impact.com${topPath}?u=${encodeURIComponent(framePath)}`;
  await page.goto(topURL); await page.locator('#impact-cn-assistant').waitFor();
  // macOS resolves /var/folders through /private; the worker provides Chrome's
  // actual temporary-extension identity without guessing path canonicalization.
  const worker = context.serviceWorkers().find(item => item.url().startsWith('chrome-extension://')) || await context.waitForEvent('serviceworker', { timeout: 10000 });
  const extensionId = new URL(worker.url()).hostname;
  await worker.evaluate(() => chrome.runtime.onMessage.addListener((message, sender) => {
    if (message?.type === 'impact-cn:frame-ask-topic') globalThis.__financeUnitSender = { url: sender.url, tabURL: sender.tab?.url, tabId: sender.tab?.id, frameId: sender.frameId };
    return false;
  }));
  await worker.evaluate(()=>{const send=chrome.tabs.sendMessage.bind(chrome.tabs);globalThis.__financeUnitForwarded=[];chrome.tabs.sendMessage=(tabId,message,options)=>{globalThis.__financeUnitForwarded.push({keys:Object.keys(message).sort(),topicId:message.topicId,frameId:options?.frameId});return send(tabId,message,options);};});
  const popup = await context.newPage(); await popup.goto(`chrome-extension://${extensionId}/popup.html`); await popup.waitForFunction(() => Boolean(chrome.runtime.id));
  const values = (enabled, aiEnabled) => popup.evaluate(values => chrome.storage.local.set({ impactCNEnabled: values.enabled, impactCNAIEnabled: values.aiEnabled }), { enabled, aiEnabled });
  const mount = async (url, id) => { await page.evaluate(({ url, id }) => { const frame=document.createElement('iframe');frame.id=id;frame.src=url;frame.style.cssText='width:1200px;height:360px';document.querySelector('#unit-finance-root').append(frame); }, { url, id }); const frame = await page.locator(`#${id}`).contentFrame(); await frame.locator('finance-unit-shadow .unit-label').first().waitFor(); return frame; };
  const goodURL = `https://demo.impact.com${framePath}?view=fixture`;
  const good = await mount(goodURL, 'finance-late-frame');
  const waitHelpers = async (frame, expected) => { const deadline=Date.now()+9000;while(Date.now()<deadline){if(await frame.locator('button[data-impact-cn-help]').count()===expected)return;await page.waitForTimeout(100);}assert.equal(await frame.locator('button[data-impact-cn-help]').count(),expected); };
  const assertGood = async (enabled, aiEnabled) => { await good.locator('finance-unit-shadow .unit-label').first().waitFor(); await good.locator('finance-unit-shadow .unit-label').first().evaluate((element, enabled) => { const expected=enabled?'需补充资金':'Required funding';if(element.firstChild.nodeValue!==expected)throw new Error('Frame label is not in the expected translation state'); }, enabled); await waitHelpers(good,aiEnabled ? 5 : 0); };
  await check('Late finance iframe and late open Shadow root use isolated MV3; top owns the single assistant', async () => {
    await good.locator('finance-unit-shadow .unit-label').first().filter({ hasText: '需补充资金' }).waitFor();
    assert.equal(await page.locator('#impact-cn-assistant').count(),1); assert.equal(await good.locator('#impact-cn-assistant').count(),0);
    assert.equal(await page.evaluate(()=>Boolean(globalThis.ImpactCN)),false);assert.equal(await good.locator('body').evaluate(()=>Boolean(globalThis.ImpactCN)),false);
    assert(await good.locator('body').evaluate(()=>Element.prototype.attachShadow===window.__financeUnit.originalAttachShadow));
    return 'Actual unpacked engine injects independently into a late-mounted finance document and later Shadow DOM without prototype mutation or duplicate launchers';
  });
  await check('Text identity, monetary values, prefix date suffixes and native element structure survive translation', async () => {
    assert(await good.locator('body').evaluate(()=>window.__financeUnit.records.every(record=>record.element.firstChild===record.node&&record.element.isConnected)));
    assert.equal(await good.locator('finance-unit-shadow #unit-amount').textContent(),'$123,456.78');
    assert.equal(await good.locator('finance-unit-shadow .unit-label').nth(1).textContent(),'到期日截至 Nov 24, 2026)');
    assert.equal(await good.locator('finance-unit-shadow a.unit-label').getAttribute('href'),'/secure/unit-existing-link');
    assert.equal(await good.locator('finance-unit-shadow a.unit-label button[data-impact-cn-help],finance-unit-shadow button.unit-label button[data-impact-cn-help]').count(),0);
    await good.locator('finance-unit-shadow a.unit-label').click(); await good.locator('finance-unit-shadow button.unit-label').click();
    assert.equal(await good.locator('body').evaluate(()=>window.__financeUnit.nativeLinkClicks),1);assert.equal(await good.locator('body').evaluate(()=>window.__financeUnit.nativeButtonClicks),1);
    return 'Original Text objects, date suffix including closing parenthesis, amount, href and native click listeners remain intact; interactive helper buttons are siblings';
  });
  await check('Scoped suffix translation preserves a private dynamic prefix byte-for-byte and restores the same Text node', async () => {
    const original='  Acme [R&D] $ Example\t billing group - Partner Payments  ',expected='  Acme [R&D] $ Example\t 账单分组 - 伙伴付款  ';
    await good.locator('finance-unit-shadow #unit-billing-suffix').filter({hasText:'账单分组 - 伙伴付款'}).waitFor();assert.equal(await good.locator('finance-unit-shadow #unit-billing-suffix').textContent(),expected);
    await values(false,true);await good.locator('finance-unit-shadow #unit-billing-suffix').filter({hasText:'billing group - Partner Payments'}).waitFor();assert.equal(await good.locator('finance-unit-shadow #unit-billing-suffix').textContent(),original);
    await values(true,true);await good.locator('finance-unit-shadow #unit-billing-suffix').filter({hasText:'账单分组 - 伙伴付款'}).waitFor();assert.equal(await good.locator('finance-unit-shadow #unit-billing-suffix').textContent(),expected);assert(await good.locator('body').evaluate(()=>{const record=window.__financeUnit.records.find(item=>item.element.id==='unit-billing-suffix');return record.element.firstChild===record.node;}));
    return 'A fixture customer prefix containing leading whitespace, a tab, brackets, ampersand and currency character is preserved exactly; only the verified platform ending changes';
  });
  await check('Specific finance scope takes priority over an earlier broad shared entry for the same source', async () => {
    await good.locator('finance-unit-shadow .unit-reports').filter({hasText:'财务报告'}).waitFor();assert.equal(await good.locator('finance-unit-shadow .unit-reports').textContent(),'财务报告');
    return 'The earlier broad Reports mapping does not override a verified finance path/query/top scope';
  });
  await check('Numeric-only pagination slots retain original count bytes, reject malformed templates and retranslate framework updates', async () => {
    const label=good.locator('finance-unit-shadow #unit-pagination');await label.filter({hasText:'显示第'}).waitFor();assert.equal(await label.textContent(),'显示第 1,020 - 1,040 行，共 5,678 行');
    for(const selector of ['.unit-invalid-repeat','.unit-invalid-missing'])assert.equal(await good.locator(`finance-unit-shadow ${selector}`).textContent(),'Displaying: 1,020 - 1,040 of 5,678');
    const rejected=good.locator('finance-unit-shadow .unit-pagination').filter({hasNotText:'显示第'});assert.equal(await rejected.count(),2+malformedCounts.length);assert.deepEqual(await rejected.allTextContents(),['Displaying: Acme - 15 of $16','Prefix Displaying: 10 - 20 of 100',...malformedCounts]);
    await label.evaluate(element=>{element.firstChild.nodeValue='Displaying: 2,000 - 2,050 of 9,876';});await label.filter({hasText:'显示第 2,000'}).waitFor();assert.equal(await label.textContent(),'显示第 2,000 - 2,050 行，共 9,876 行');
    await values(false,true);await label.filter({hasText:'Displaying:'}).waitFor();assert.equal(await label.textContent(),'Displaying: 2,000 - 2,050 of 9,876');assert(await good.locator('body').evaluate(()=>{const record=window.__financeUnit.records.find(item=>item.element.id==='unit-pagination');return record.element.firstChild===record.node;}));
    await values(true,true);await label.filter({hasText:'显示第 2,000'}).waitFor();
    return 'Comma-separated counts survive exactly; duplicate/missing slots and name/currency/non-anchored text are refused; a framework Text update is calibrated and OFF restores the new source';
  });
  await check('Wrong Shadow host, document path, duplicated query and cross-origin top remain English without question helpers', async () => {
    assert(await good.locator('body').evaluate(()=>window.__financeUnit.negative.every(record=>record.node.nodeValue===record.text&&record.element.firstChild===record.node)));
    const wrongPath=await mount('https://demo.impact.com/secure/finance/app/brand-overview-view.ihtml-extra?view=fixture','wrong-finance-path');
    const wrongQuery=await mount(`https://demo.impact.com${framePath}?view=other`,'wrong-finance-query');
    const duplicateQuery=await mount(`https://demo.impact.com${framePath}?view=fixture&view=fixture`,'duplicate-finance-query');
    const crossOrigin=await mount(`https://app.impact.com${framePath}?view=fixture`,'cross-origin-finance-frame');
    for(const frame of [wrongPath,wrongQuery,duplicateQuery,crossOrigin]){await frame.locator('finance-unit-shadow .unit-label').first().waitFor();assert.equal(await frame.locator('finance-unit-shadow .unit-label').first().textContent(),'Required funding');assert.equal(await frame.locator('button[data-impact-cn-help]').count(),0);}
    return 'Exact iframe route, single exact query, readable same-origin top and verified Shadow host are enforced';
  });
  await check('Translation and AI switches synchronize independently into every finance frame', async () => {
    for(const [enabled,aiEnabled]of[[false,true],[true,false],[false,false],[true,true]]){await values(enabled,aiEnabled);await page.waitForFunction(({enabled,aiEnabled})=>document.querySelector('#impact-cn-assistant')?.dataset.enabled===String(enabled)&&document.querySelector('#impact-cn-assistant')?.dataset.aiEnabled===String(aiEnabled),{enabled,aiEnabled});await good.locator('finance-unit-shadow .unit-label').first().filter({hasText:enabled?'需补充资金':'Required funding'}).waitFor();await assertGood(enabled,aiEnabled);}
    return 'English with questions, Chinese without questions, both OFF, and both ON propagate through the shipped storage events';
  });
  await check('Child-frame concept helper submits once into top native Ask Impact and preserves label controls', async () => {
    await values(true,true);await waitHelpers(good,5);await page.bringToFront(); const helper=good.locator('finance-unit-shadow label.unit-label button[data-impact-cn-help]');await helper.click();
    await page.waitForFunction(()=>window.__financeUnitTop.sends===1);
    const proof=await page.evaluate(()=>({sends:window.__financeUnitTop.sends,inputEvents:window.__financeUnitTop.inputEvents,officialLink:window.__financeUnitTop.prompts[0].includes('https://help.impact.com/'),financeTerm:window.__financeUnitTop.prompts[0].includes('需补充资金'),editorEmpty:document.querySelector('#ask-impact-shadow-host').shadowRoot.querySelector('textarea').value===''}));
    assert.equal(proof.sends,1);assert(proof.inputEvents>0&&proof.officialLink&&proof.financeTerm&&proof.editorEmpty);assert.equal(await good.locator('finance-unit-shadow #unit-checkbox').isChecked(),false);
    const sender = await worker.evaluate(() => globalThis.__financeUnitSender);
    assert.equal(sender.url, goodURL); assert.equal(sender.tabURL, topURL); assert(sender.frameId > 0);
    await good.locator('finance-unit-shadow label.unit-label').click();assert.equal(await good.locator('finance-unit-shadow #unit-checkbox').isChecked(),true);
    return 'Iframe-to-worker-to-top request reaches existing native editor exactly once; no mock assistant reply; helper click does not change the original checkbox';
  });
  await check('Frame bridge rejects unknown topics, route/query mismatches, split scopes and wrong top topics',async()=>{
    const before=await page.evaluate(()=>window.__financeUnitTop.sends),forwardedBefore=await worker.evaluate(()=>globalThis.__financeUnitForwarded.length);let probeToken=0;
    const probe=async(frame,topicId)=>frame.locator('body').evaluate((_element,{token,topicId})=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>{window.removeEventListener('message',listener);reject(new Error('Fixture bridge response timed out'));},5000);const listener=event=>{if(event.source!==window||event.data?.__financeUnitResult?.token!==token)return;clearTimeout(timer);window.removeEventListener('message',listener);resolve(event.data.__financeUnitResult.result);};window.addEventListener('message',listener);window.postMessage({__financeUnitProbe:{token,topicId}},location.origin);}),{token:++probeToken,topicId});
    for(const topicId of ['finance-unit-unknown',otherTopic.id,splitTopic.id,topOnlyTopic.id]){const response=await probe(good,topicId);assert.equal(response.ok,false);assert.equal(response.reason,'topic-out-of-scope');}
    for(const[url,id]of[[`https://demo.impact.com${framePath}-other?view=fixture`,'probe-wrong-path'],[`https://demo.impact.com${framePath}?view=other`,'probe-wrong-query'],[`https://demo.impact.com${framePath}?view=fixture&view=fixture`,'probe-duplicate-query'],[`https://app.impact.com${framePath}?view=fixture`,'probe-cross-origin']]){const frame=await mount(url,id),response=await probe(frame,topic.id);assert.equal(response.ok,false);assert.equal(response.reason,'topic-out-of-scope');}
    const sender=await worker.evaluate(()=>globalThis.__financeUnitSender);
    const direct=await popup.evaluate(({tabId,topicId})=>chrome.tabs.sendMessage(tabId,{type:'impact-cn:top-ask-topic',topicId},{frameId:0}),{tabId:sender.tabId,topicId:otherTopic.id});assert.equal(direct.ok,false);assert.equal(direct.reason,'topic-out-of-scope');
    assert.equal(await page.evaluate(()=>window.__financeUnitTop.sends),before);assert.equal(await worker.evaluate(()=>globalThis.__financeUnitForwarded.length),forwardedBefore);
    const valid=await probe(good,topic.id);assert.equal(valid.ok,true);assert.equal(await page.evaluate(()=>window.__financeUnitTop.sends),before+1);const forwarded=await worker.evaluate(()=>globalThis.__financeUnitForwarded.at(-1));assert.deepEqual(forwarded.keys,['topicId','type']);assert.equal(forwarded.frameId,0);assert.equal(forwarded.topicId,topic.id);
    return 'Trusted storage-only sender.tab.url observed; unknown/mismatched source and top scopes make zero native sends; authorized relay strips extra fixture fields and sends only topicId once';
  });
  await check('Default assistant moves clear of native finance dropdown while manual drag position remains authoritative', async () => {
    await page.evaluate(()=>{document.querySelector('#ask-impact-shadow-host').style.display='none';const bubble=document.createElement('div');bubble.className='finance-bubble';bubble.style.cssText='position:fixed;right:0;bottom:24px;width:570px;height:650px;background:white';bubble.textContent='Finance menu fixture';document.body.append(bubble);});
    await page.waitForFunction(()=>document.querySelector('#impact-cn-assistant')?.dataset.nativeOverlay==='true');
    const automatic=await page.locator('#impact-cn-assistant').boundingBox();const bubble=await page.locator('.finance-bubble').boundingBox();assert(Math.abs(automatic.x-24)<2);assert(automatic.x+automatic.width<bubble.x);
    await page.locator('.impact-cn-drag-handle').press('Shift+ArrowRight');const manual=await page.locator('#impact-cn-assistant').boundingBox();assert(manual.x>automatic.x+20);
    await page.locator('.finance-bubble').evaluate(element=>element.remove());await page.waitForFunction(()=>document.querySelector('#impact-cn-assistant')?.dataset.nativeOverlay==='false');
    const retained=await page.locator('#impact-cn-assistant').boundingBox();assert(Math.abs(retained.x-manual.x)<2&&Math.abs(retained.y-manual.y)<2);
    await page.locator('.impact-cn-launcher').click();await page.locator('.impact-cn-reset-position').click();const reset=await page.locator('#impact-cn-assistant').boundingBox();assert(Math.abs(1400-reset.x-reset.width-24)<2);
    return 'Visible native finance panel relocates the default assistant left; explicit user position survives overlay close; reset restores the default right placement';
  });
  await check('Wrong top page and top query reject otherwise matching finance frame labels', async () => {
    await page.goto('https://demo.impact.com/secure/advertiser/finance/fr/other.ihtml?u='+encodeURIComponent(framePath));await page.locator('#impact-cn-assistant').waitFor();const wrongTop=await mount(goodURL,'wrong-top-frame');assert.equal(await wrongTop.locator('finance-unit-shadow .unit-label').first().textContent(),'Required funding');assert.equal(await wrongTop.locator('button[data-impact-cn-help]').count(),0);await wrongTop.locator('finance-unit-shadow .unit-reports').filter({hasText:'数据报表'}).waitFor();assert.equal(await wrongTop.locator('finance-unit-shadow .unit-reports').textContent(),'数据报表');
    await page.goto(`https://demo.impact.com${topPath}?u=wrong`);await page.locator('#impact-cn-assistant').waitFor();const wrongTopQuery=await mount(goodURL,'wrong-top-query-frame');assert.equal(await wrongTopQuery.locator('finance-unit-shadow .unit-label').first().textContent(),'Required funding');assert.equal(await wrongTopQuery.locator('button[data-impact-cn-help]').count(),0);
    return 'A finance-looking child cannot translate or offer AI topics under an unverified advertiser shell or different routing query';
  });
  await check('Fresh frame document reload reapplies saved controls and translation without extra native sends', async () => {
    await page.goto(topURL);await page.locator('#impact-cn-assistant').waitFor();await values(true,false);const frame=await mount(goodURL,'reloaded-finance-frame');await frame.locator('finance-unit-shadow .unit-label').first().filter({hasText:'需补充资金'}).waitFor();assert.equal(await frame.locator('button[data-impact-cn-help]').count(),0);await page.reload();await page.locator('#impact-cn-assistant').waitFor();const fresh=await mount(goodURL,'fresh-finance-frame');await fresh.locator('finance-unit-shadow .unit-label').first().filter({hasText:'需补充资金'}).waitFor();assert.equal(await fresh.locator('button[data-impact-cn-help]').count(),0);assert.equal(await page.evaluate(()=>window.__financeUnitTop.sends),0);
    return 'Saved translation ON and AI OFF survive shell reload and new iframe creation; no automatic AI request is generated by navigation';
  });
  }
} finally { if(context)await context.close();rmSync(workspace,{recursive:true,force:true}); }
const currentResults=[...results];
if(previousReport){const names=new Set(results.map(item=>item.name));results.unshift(...previousReport.results.filter(item=>!names.has(item.name)));}
const status=results.length&&results.every(item=>item.status==='PASS')?'PASS':'FAIL';
const report={status,mode:'SYNTHETIC_FINANCE_IFRAME_MECHANISM_ONLY',version:shipped.version,realSiteAcceptance:false,fixtureDictionary:true,unchangedShippedEngine:true,credentialsSaved:false,results,...(previousReport?{targetedRechecks:[...(previousReport.targetedRechecks||[]),{filter:only,checks:currentResults.map(item=>item.name),status:currentResults.every(item=>item.status==='PASS')?'PASS':'FAIL',priorPassedChecksRetained:true,date:new Date().toISOString()}]}:{})};
writeFileSync(path.join(folder,'unit-report.json'),JSON.stringify(report,null,2));
writeFileSync(path.join(root,'finance-test-report.md'),`# 财务 iframe 机制回归\n\n版本：${shipped.version}。结果：**${status} ${results.filter(item=>item.status==='PASS').length}/${results.length}**。\n\n将原插件引擎、worker、manifest复制到临时目录，以隔离字典和DOM检验frame路由、原Text保留、数据后缀、动态Shadow、独立开关与顶层AI桥接；这是机制测试，不能代替finance-live-test-report.md中的真实页面验收。没有充值、转账、保存、删除或模拟AI答复。${previousReport?`\n\n本轮仅重跑筛选项「${only}」；先前已通过的检查保留，合并记录列于JSON targetedRechecks，未声称本轮重跑全部检查。`:''}\n\n${results.map(item=>`- **${item.status}** ${item.name}：${item.evidence}`).join('\n')}\n`);
process.exitCode=status==='PASS'?0:1;

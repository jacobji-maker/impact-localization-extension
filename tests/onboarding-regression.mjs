/** Focused onboarding UI checks on a routed synthetic host, never live acceptance. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, cpSync, rmSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core'))); }
const workspace = mkdtempSync(path.join(os.tmpdir(), 'impact-onboarding-unit-'));
const extension = path.join(workspace, 'extension');
const extensionSource = process.env.IMPACT_ONBOARDING_SOURCE ? path.resolve(root, process.env.IMPACT_ONBOARDING_SOURCE) : path.join(root, 'impact-cn-mod');
const reportFolder = process.env.IMPACT_ONBOARDING_REPORT_DIR ? path.resolve(root, process.env.IMPACT_ONBOARDING_REPORT_DIR) : path.join(root, 'artifacts/onboarding-tests');
cpSync(extensionSource, extension, { recursive: true });
// Bind the shipped input before the existing discarded fixture adaptations.
const sourceInputSHA256 = {};
function recordSourceInput(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) recordSourceInput(file);
    else sourceInputSHA256[path.relative(extension, file)] = createHash('sha256').update(readFileSync(file)).digest('hex');
  }
}
recordSourceInput(extension);
const manifest = JSON.parse(readFileSync(path.join(extension, 'manifest.json'), 'utf8'));
const guidanceSandbox = {}; vm.createContext(guidanceSandbox);
vm.runInContext(readFileSync(path.join(extension, 'guidance.js'), 'utf8'), guidanceSandbox);
const guidance = JSON.parse(JSON.stringify(guidanceSandbox.IMPACT_CN_GUIDANCE));
function guidanceFixtureCases() {
  const base={guides:[{id:'gc03-guide',title:'Synthetic guide',purpose:'Synthetic purpose',applicability:'Synthetic applicability',prerequisites:[],steps:[
    {id:'gc03-step',title:'Synthetic step',action:'Synthetic action',entry:'Synthetic entry',ready:'Synthetic ready'}
  ]}]};
  const clone=()=>structuredClone(base),cases={};
  const add=(name,change)=>{const data=clone();change(data);cases[name]={valid:false,data};};
  cases['valid-minimal']={valid:true,data:clone()};
  const information=clone();information.guides[0].steps[0].mode='information';
  cases['valid-information']={valid:true,data:information};
  const empty=clone();empty.checklistGroups=[];Object.assign(empty.guides[0].steps[0],{details:[],issues:[],links:[]});
  cases['valid-empty-optionals']={valid:true,data:empty};
  const complete=clone();complete.checklistGroups=[{title:'Synthetic group',items:[{title:'Synthetic item',purpose:'Synthetic item purpose'}]}];
  Object.assign(complete.guides[0].steps[0],{details:['Synthetic detail'],issues:[{id:'synthetic-issue',label:'Synthetic issue',help:'Synthetic recovery',owner:'Synthetic owner'}],
    links:[{label:'Official help',url:'https://help.impact.com/en/support/home'},{label:'Empty URL',url:''},{label:'Script URL',url:'javascript:void(0)'},{label:'Other host',url:'https://example.invalid/help'},{label:'HTTP URL',url:'http://help.impact.com/help'}]});
  cases['valid-complete']={valid:true,data:complete};
  cases['invalid-root-null']={valid:false,data:null};
  const rootArray=[];rootArray.guides=clone().guides;cases['invalid-root-array']={valid:false,data:rootArray};
  add('invalid-guides-type',data=>{data.guides={};});
  add('invalid-guides-empty',data=>{data.guides=[];});
  add('invalid-guide-object',data=>{data.guides[0]=null;});
  add('invalid-guide-missing-field',data=>{delete data.guides[0].purpose;});
  add('invalid-guide-field-type',data=>{data.guides[0].title=[];});
  add('invalid-prerequisite-element',data=>{data.guides[0].prerequisites=[' '];});
  add('invalid-steps-empty',data=>{data.guides[0].steps=[];});
  add('invalid-step-object',data=>{data.guides[0].steps[0]=null;});
  add('invalid-step-missing-field',data=>{delete data.guides[0].steps[0].ready;});
  add('invalid-step-mode-value',data=>{data.guides[0].steps[0].mode='automatic';});
  add('invalid-step-mode-type',data=>{data.guides[0].steps[0].mode=42;});
  add('invalid-guide-id-duplicate',data=>{const other=structuredClone(data.guides[0]);other.steps[0].id='gc03-other-step';data.guides.push(other);});
  add('invalid-step-id-within-guide',data=>{data.guides[0].steps.push(structuredClone(data.guides[0].steps[0]));});
  add('invalid-step-id-across-guides',data=>{const other=structuredClone(data.guides[0]);other.id='gc03-other-guide';data.guides.push(other);});
  add('invalid-details-type',data=>{data.guides[0].steps[0].details={};});
  add('invalid-details-element',data=>{data.guides[0].steps[0].details=[' '];});
  add('invalid-issue-element',data=>{data.guides[0].steps[0].issues=[{id:'bad',label:'Synthetic issue',help:'Synthetic recovery'}];});
  add('invalid-link-element',data=>{data.guides[0].steps[0].links=[{label:'Synthetic link',url:42}];});
  add('invalid-group-items',data=>{data.checklistGroups=[{title:'Synthetic group',items:null}];});
  add('invalid-directory-item',data=>{data.checklistGroups=[{title:'Synthetic group',items:[{title:'Synthetic item',purpose:false}]}];});
  add('invalid-optional-null',data=>{data.guides[0].steps[0].details=null;});
  add('invalid-guides-hole',data=>{data.guides.length=2;});
  add('invalid-steps-hole',data=>{data.guides[0].steps.length=2;});
  add('invalid-optional-hole',data=>{data.guides[0].steps[0].details=new Array(1);});
  add('invalid-directory-hole',data=>{data.checklistGroups=[{title:'Synthetic group',items:new Array(1)}];});
  return cases;
}
const guidanceCases=guidanceFixtureCases();
const ui = {
  section: '#impact-cn-assistant section.impact-cn-guide',
  open: '[data-impact-cn-guide-open]', back: '[data-impact-cn-guide-back]',
  card: 'select[data-impact-cn-guide-card]', step: 'select[data-impact-cn-guide-substep]',
  issue: 'select[data-impact-cn-guide-issue]', help: '[data-impact-cn-guide-issue-help]',
  owner: '[data-impact-cn-guide-issue-owner]', read: 'button[data-impact-cn-guide-read]',
  operated: 'button[data-impact-cn-guide-operated]', reset: 'button[data-impact-cn-guide-reset]',
  progress: '[data-impact-cn-guide-progress]', results: '[data-impact-cn-guide-results]',
  locate: 'button[data-impact-cn-guide-locate]', pointer: '#impact-cn-guide-pointer',
  locateStatus: '[data-impact-cn-guide-locate-status]', explanation: 'details[data-impact-cn-guide-explanation]',
  previous: 'button[data-impact-cn-guide-prev]', next: 'button[data-impact-cn-guide-next]',
  title: '[data-impact-cn-guide-step-title]', position: '[data-impact-cn-guide-step-position]',
  journeyStart: '[data-impact-cn-journey-start]', journeyContinue: '[data-impact-cn-journey-continue]',
  journeyStatus: '[data-impact-cn-journey-status]', context: '.impact-cn-guide-context'
};
const source = 'Synthetic onboarding label', target = '合成上线固定文案';
const sandbox = {}; vm.createContext(sandbox);
vm.runInContext(readFileSync(path.join(extension, 'site-config.js'), 'utf8'), sandbox);
const config = JSON.parse(JSON.stringify(sandbox.IMPACT_CN_CONFIG));
const topPath = config.localization.checklist.topPath;
// This prelude exists only in the discarded extension and a closed synthetic URL.
writeFileSync(path.join(extension,'onboarding-guidance-fixtures.js'),`(() => {
  if(window!==window.top||location.origin!=='https://demo.impact.com'||location.pathname!==${JSON.stringify(topPath+'onboarding-fixture')})return;
  const cases=(${guidanceFixtureCases.toString()})();
  const name=new URLSearchParams(location.search).get('guidance-fixture');
  if(!Object.hasOwn(cases,name))return;
  globalThis.IMPACT_CN_GUIDANCE=cases[name].data;
  const created=[],registrations=[];
  const createElement=document.createElement;
  document.createElement=function(...args){const node=createElement.apply(this,args);created.push(node);return node;};
  const add=EventTarget.prototype.addEventListener,remove=EventTarget.prototype.removeEventListener;
  const capture=options=>typeof options==='boolean'?options:!!options?.capture;
  EventTarget.prototype.addEventListener=function(type,callback,options){
    if(!registrations.some(item=>item.active&&item.target===this&&item.type===type&&item.callback===callback&&item.capture===capture(options)))registrations.push({target:this,type,callback,capture:capture(options),active:true});
    return add.call(this,type,callback,options);
  };
  EventTarget.prototype.removeEventListener=function(type,callback,options){
    for(const item of registrations)if(item.target===this&&item.type===type&&item.callback===callback&&item.capture===capture(options))item.active=false;
    return remove.call(this,type,callback,options);
  };
  const guideNode=node=>typeof node?.className==='string'&&node.className.split(/\\s+/u).some(name=>/^impact-cn-guide(?:-|$)/u.test(name));
  const guideListener=item=>guideNode(item.target)||item.callback?.name==='updateArrow';
  globalThis.__onboardingGuidanceFixture={inspect:()=>({name,guideCreated:created.filter(guideNode).length,
    guideListenersAdded:registrations.filter(guideListener).length,guideListenersActive:registrations.filter(item=>item.active&&guideListener(item)).length})};
})();\n`);
for(const script of manifest.content_scripts)if(script.js?.includes('guidance.js'))script.js.splice(script.js.indexOf('content.js'),0,'onboarding-guidance-fixtures.js');
// Deterministic time and late replies exist only in this discarded MV3 copy.
writeFileSync(path.join(extension,'onboarding-journey-fixtures.js'),`(() => {
  if(window!==window.top||location.origin!=='https://demo.impact.com')return;
  const fixture=new URLSearchParams(location.search).get('journey-fixture');
  if(!fixture)return;
  let offset=0,release,pending=false,bindReleased=false,puts=0,clears=0;
  const clearEpochs=new Set();
  const takeQueue=[];
  const now=Date.now;Date.now=()=>now()+offset;
  const send=chrome.runtime.sendMessage.bind(chrome.runtime);
  chrome.runtime.sendMessage=function(message,...args){
    if(message?.type==='impact-cn:journey-checkpoint'&&message.op==='put')puts++;
    if(message?.type==='impact-cn:journey-checkpoint'&&message.op==='clear'){clears++;clearEpochs.add(message.contextEpoch);}
    if(fixture==='late-bind'&&message?.type==='impact-cn:journey-checkpoint'&&message.op==='take'&&!bindReleased){
      pending=true;return new Promise((resolve,reject)=>takeQueue.push({message,args,resolve,reject}));
    }
    if(fixture==='late'&&message?.type==='impact-cn:journey-checkpoint'&&message.op==='take'&&!pending){
      pending=true;return new Promise(resolve=>{release=()=>{
        const contract=globalThis.IMPACT_CN_JOURNEY;
        const started=contract.transition(null,{type:'start',sceneId:'website',journeyId:crypto.randomUUID(),contextEpoch:message.contextEpoch,now:Date.now()});
        const continued=contract.transition(started.state,{type:'continue',sceneId:'website',contextEpoch:message.contextEpoch,now:Date.now()});
        resolve({ok:true,checkpoint:continued.state});release=null;
      };});
    }
    return send(message,...args);
  };
  globalThis.__onboardingJourneyFixture={control(command){
    if(command==='expire')offset+=globalThis.IMPACT_CN_JOURNEY.transitionTtlMs+1;
    if(command==='release'){
      release?.();bindReleased=true;
      for(const entry of takeQueue.splice(0))send(entry.message,...entry.args).then(entry.resolve,entry.reject);
    }
    return {fixture,pending,waiting:!!release||takeQueue.length>0,queuedTakes:takeQueue.length,puts,clears,clearEpochs:clearEpochs.size,offset};
  }};
})();\n`);
for(const script of manifest.content_scripts)if(script.js?.includes('journey.js'))script.js.splice(script.js.indexOf('content.js'),0,'onboarding-journey-fixtures.js');
writeFileSync(path.join(extension,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const nativePath = '/secure/advertiser/checklist/website-tracking-checklist-flow.ihtml';
const shopifyPath = '/secure/advertiser/checklist/shopify/connect-shopify-interactive.html';
const toolPath = '/secure/advertiser/tracking-settings/actiontracker/launch-test-action-flow.ihtml';
const secondToolPath = '/secure/advertiser/engage/actions/tests/test-actions-flow.ihtml';
const testsPath = '/secure/advertiser/actions/tests/test-actions-flow.ihtml';
const testingRoutes = [
  {pathname:toolPath,scene:'tool',step:'6a'},
  {pathname:secondToolPath,scene:'tool',step:'6a'},
  {pathname:testsPath,scene:'tests',step:'6c'}
];
config.localization.checklist.documentRoots[nativePath] = ['#fixture-native-root'];
config.localization.checklist.documentRoots[shopifyPath] = ['#fixture-native-root'];
// These adapters exist only in a discarded test copy; the product is unchanged.
writeFileSync(path.join(extension, 'dict.js'), `globalThis.IMPACT_CN_DICTIONARY=${JSON.stringify({
  version: manifest.version,
  entries: [
    { id: 'onboarding-unit-top', source, target, scope: { hosts: ['demo.impact.com'], path: topPath, topOnly: true, selector: '#checklist-outer-container .fixture-static' } },
    { id: 'onboarding-unit-native', source, target, scope: { hosts: ['demo.impact.com'], pathExact: nativePath, topPath, checklistFrame: true, selector: '#fixture-native-root .fixture-static' } },
    ...['5a','5b','5c','6a'].map(id=>({id:'onboarding-unit-nav-'+id,source:config.guidance.targets[id].navigation[0],target:config.guidance.targets[id].navigation[1],scope:{hosts:['demo.impact.com'],path:topPath,topOnly:true,selector:'.fixture-native-nav .text'}})),
    ...[['Account Setup','账户配置'],['Technical Integration','技术对接']].map(([source,target],index)=>({id:'onboarding-unit-group-'+index,source,target,scope:{hosts:['demo.impact.com'],path:topPath,topOnly:true,selector:'.fixture-native-nav h4.accordion-header > span.text'}}))
  ], helpTopics: [{id:'onboarding-ai-topic',label:'合成页面场景',question:'解释合成测试中的页面场景',helpUrl:'https://help.impact.com/'}]
})};\n`);
writeFileSync(path.join(extension, 'site-config.js'), `globalThis.IMPACT_CN_CONFIG=${JSON.stringify(config)};
window.addEventListener('message', async event => {
  if(event.source!==window || !event.data?.__onboardingUnitProbe) return;
  const {token,action,enabled,aiEnabled}=event.data.__onboardingUnitProbe;
  let result;
  if(action==='guidanceFixture') {
    let readyError=null;
    try {await globalThis.ImpactCN?.ready;}catch(error){readyError=error.message;}
    result={...globalThis.__onboardingGuidanceFixture?.inspect(),readyError,state:globalThis.ImpactCN?.getState(),
      assistant:document.querySelectorAll('#impact-cn-assistant').length,guideMounted:document.querySelectorAll('.impact-cn-guide,[data-impact-cn-guide-open],#impact-cn-guide-pointer').length};
  }else if(action==='journeyFixture') result=globalThis.__onboardingJourneyFixture?.control(enabled);
  else if(action==='storage') result=await chrome.storage.local.get(null);
  else if(!globalThis.ImpactCN) result={injected:false};
  else {
    await globalThis.ImpactCN.ready;
    if(action==='settings') {
      await globalThis.ImpactCN.setEnabled(enabled);
      result=await globalThis.ImpactCN.setAIEnabled(aiEnabled);
    } else if(action==='startPendingAI') {
      globalThis.__onboardingPendingAIResult=null;
      globalThis.__onboardingPendingAIPromise=globalThis.ImpactCN.askTopic('onboarding-ai-topic').then(value=>{
        globalThis.__onboardingPendingAIResult={ok:value.ok,reason:value.reason,filled:!!value.filled};return globalThis.__onboardingPendingAIResult;
      });
      result={started:true};
    } else if(action==='pendingAIResult') result=await Promise.race([globalThis.__onboardingPendingAIPromise,new Promise(resolve=>setTimeout(()=>resolve({pending:true}),3000))]);
    else if(action==='resetPosition') result=globalThis.ImpactCN.resetPosition();
    else if(action==='destroy') {globalThis.ImpactCN.destroy();result={ok:true};}
    else result=globalThis.ImpactCN.getState();
  }
  window.postMessage({__onboardingUnitResult:{token,result}},'*');
});\n`);

const nativeContent = `<form id="fixture-business-form"><button type="button" id="fixture-native-save">Save native fixture</button><input id="fixture-business-input" value="Native fixture draft"><input type="checkbox" id="fixture-checklist-mark"><span class="fixture-static">${source}</span></form>`;
const fixtureScript = `<script>
const native=document.querySelector('#fixture-business-form');
const ai=document.querySelector('#ask-impact-shadow-host')?.attachShadow({mode:'open'});
let aiInput;
if(ai){aiInput=document.createElement('textarea');aiInput.placeholder='ask impact...';aiInput.value='Synthetic unsent AI draft';const send=document.createElement('button');send.setAttribute('aria-label','Send');send.textContent='Send';ai.append(aiInput,send);send.addEventListener('click',()=>window.__onboardingFixture.sends++);aiInput.addEventListener('input',()=>window.__onboardingFixture.aiInputs++);}
window.__onboardingFixture={nodes:[...native.querySelectorAll('*')],text:native.querySelector('.fixture-static').firstChild,attributes:[...native.querySelectorAll('*')].map(node=>[...node.attributes].map(attribute=>[attribute.name,attribute.value])),businessClicks:0,businessInputs:0,businessChanges:0,submits:0,sends:0,aiInputs:0,entryClicks:0,groupClicks:0};
for(const entry of document.querySelectorAll('.fixture-native-nav .check-item .text,.outer-container > button#button.get-started-btn'))entry.addEventListener('click',()=>window.__onboardingFixture.entryClicks++);
for(const heading of document.querySelectorAll('.fixture-native-nav h4.accordion-header'))heading.addEventListener('click',()=>{
  window.__onboardingFixture.groupClicks++;
  const panels=[...heading.parentElement.children].filter(node=>node.classList.contains('panel'));
  const expanded=panels.every(panel=>panel.classList.contains('expanded'));
  for(const panel of panels)panel.classList.toggle('expanded',!expanded);
});
native.addEventListener('click',()=>window.__onboardingFixture.businessClicks++);
native.addEventListener('input',()=>window.__onboardingFixture.businessInputs++);
native.addEventListener('change',()=>window.__onboardingFixture.businessChanges++);
native.addEventListener('submit',event=>{event.preventDefault();window.__onboardingFixture.submits++;});
localStorage.setItem('onboarding-native-fixture','Synthetic local draft');sessionStorage.setItem('onboarding-native-fixture','Synthetic session draft');
if(new URLSearchParams(location.search).has('synthetic-native-nav')) {
  (${programNavigation.toString()})(${JSON.stringify(topPath)});
  const shadow=document.querySelector('#adv-navigation impact-style-isolator').shadowRoot;
  shadow.querySelector('button.account-btn').textContent='Synthetic loading label';
  shadow.querySelector('a').href=${JSON.stringify(topPath)}+'synthetic-loading-route';
}
</script>`;
const fixtureNavigation = `<nav id="checklist-left-nav" class="fixture-native-nav"><div class="checklist-menu-group"><div class="checklist-accordion">${[
  {id:'account',title:'Account Setup',steps:['5a']},
  {id:'technical',title:'Technical Integration',steps:['5b','5c','6a']}
].map(group=>`<div class="accordion-item" id="fixture-group-${group.id}"><h4 class="accordion-header" id="fixture-heading-${group.id}"><span class="text">${group.title}</span><span class="duration">Synthetic estimate</span></h4>${group.steps.map(id=>`<div class="panel expanded"><div class="check-item clickable"><div class="svg-name-container"><button type="button" class="text" id="fixture-entry-${id}">${config.guidance.targets[id].navigation[0]}</button></div></div></div>`).join('')}</div>`).join('')}</div></div></nav>`;
const fixtureTop = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;min-height:1800px}main{max-width:100%}input{max-width:100%}.fixture-native-nav{position:absolute;left:720px;top:90px;width:260px}.fixture-native-nav button{display:block;width:250px;min-height:34px;margin:0 0 14px}.fixture-native-nav h4{margin:0;min-height:32px;cursor:pointer}.fixture-native-nav h4 .duration{display:none}.fixture-native-nav .panel:not(.expanded){display:none}#screen-outer-div iframe{display:block;width:600px;height:250px;margin:28px 0 0 430px;border:2px solid #ddd}@media(max-width:600px){.fixture-native-nav{display:none}#screen-outer-div iframe{width:290px;margin-left:0}}</style></head><body><div id="checklist-outer-container"><div class="checklist-container iui-component">${fixtureNavigation}<main>${nativeContent}</main><div class="right-section-outermost-container"><div class="checklist-right-section"><div id="screen-outer-div"></div></div></div></div></div><div id="ask-impact-shadow-host"></div>${fixtureScript}</body></html>`;
const frameStyle = `<style>body{margin:0;min-height:900px}field-label-typography,.outer-container > button#button{display:block;margin:60px 20px 20px;width:240px;min-height:30px}</style>`;
const fixtureFrame = `<!doctype html>${frameStyle}<body><main id="fixture-native-root"><div id="vueInstance"><field-label-typography class="form-section-header">Default landing page</field-label-typography></div>${nativeContent}</main>${fixtureScript}</body>`;
// Fixed public structure independently observed on the validation asset document.
// No test order, link, event name, business identifier or native result is embedded.
const fixtureValidationFrame = `<!doctype html>${frameStyle}<style>.default-action-button{display:block;width:240px;height:40px;margin:20px}.page{padding-top:1px}</style><body><main id="fixture-native-root"><div id="app"><div class="main-container"><div class="page"><div><div id="fixture-validation-open" class="default-font-size default-border-radius default-action-button flex1">Open Testing Tool</div><div id="fixture-validation-tests" class="default-font-size default-border-radius default-action-button flex1 secondary">View Test Actions</div></div></div></div></div>${nativeContent}</main>${fixtureScript}<script>window.__onboardingValidationClicks={open:0,tests:0};document.querySelector('#fixture-validation-open').addEventListener('click',()=>window.__onboardingValidationClicks.open++);document.querySelector('#fixture-validation-tests').addEventListener('click',()=>window.__onboardingValidationClicks.tests++);</script></body>`;
const fixtureShopifyFrame = `<!doctype html>${frameStyle}<body><main id="fixture-native-root" class="outer-container"><button type="button" id="button" class="get-started-btn">Connect your Shopify store</button>${nativeContent}</main>${fixtureScript}</body>`;
const fixtureToolTop = fixtureTop.replace('</main>',`<section id="templateContainer" style="margin-left:430px"><div style="height:1000px"></div><field-label-typography>Run Test</field-label-typography><button id="fixture-tool-start" type="button" data-testid="uicl-webflow-button" style="display:block;width:240px;height:40px;margin:20px">Start test in a new window</button><button id="fixture-tool-tests" type="button" data-testid="uicl-webflow-button" style="display:block;width:240px;height:40px;margin:20px">View my test action</button></section></main>`).replace('</body>',`<script>window.__onboardingToolClicks={start:0,tests:0};document.querySelector('#fixture-tool-start').addEventListener('click',()=>window.__onboardingToolClicks.start++);document.querySelector('#fixture-tool-tests').addEventListener('click',()=>window.__onboardingToolClicks.tests++);</script></body>`);
// List chain is the 0.8.19 public DOM projection. Tool fixed labels reuse the
// historical native test-integration capture, never private field values.
const testActionsListMarkers='<div id="uitk-container" class="vueAdvNav"><div id="main-content"><div id="templateContainer"><div id="vueInstance"><div class="app-page"><div class="iui-page-section"><div class="iui-data-view" data-testid="uicl-dataview"><div class="data-header"><div class="top-info"><h1>Test Actions</h1></div></div><div class="data-container"><div class="iui-dynamic-table"><div class="iui-data-table" data-testid="uicl-data-table"></div></div></div></div></div></div></div></div></div></div>';
const testActionsToolMarkers='<div id="templateContainer"><h1 data-testid="uicl-page-header-title">Test your integration</h1><field-label-typography>Run Test</field-label-typography></div>';
function sharedTestActionsMarkers(view) {
  if(view==='list')return testActionsListMarkers;
  if(view==='tool')return testActionsToolMarkers;
  if(view==='list-zh')return testActionsListMarkers.replace('Test Actions','测试转化');
  if(view==='tool-zh')return testActionsToolMarkers.replace('Test your integration','测试集成').replace('Run Test','运行测试');
  if(view==='both')return testActionsListMarkers+testActionsToolMarkers;
  if(view==='wrong-tool')return testActionsToolMarkers.replace('Run Test','Synthetic unrelated heading');
  if(view==='wrong-list')return testActionsListMarkers.replace('Test Actions','Synthetic unrelated heading');
  if(view==='duplicate-list')return testActionsListMarkers+testActionsListMarkers;
  return '';
}
const results = [];
const selectedChecks = process.env.IMPACT_ONBOARDING_CHECKS ? new Set(process.env.IMPACT_ONBOARDING_CHECKS.split('|')) : null;
const routedRequests = [];
let screenshotPath;
let pointerScreenshotPath;
let context, page, probeSequence = 0;
async function check(name, action) {
  if (selectedChecks && !selectedChecks.has(name)) return;
  try { const evidence = await action(); results.push({name,status:'PASS',evidence});console.log('ONBOARDING UNIT PASS '+name); }
  catch(error) {
    const conditions=await page?.evaluate(({ui,frameSelector})=>{
      const geometry=node=>node?.getBoundingClientRect().toJSON();
      return {
        pathname:location.pathname,viewport:{width:innerWidth,height:innerHeight},scroll:{x:scrollX,y:scrollY},
        stepId:document.querySelector(ui.section)?.dataset.impactCnGuideStepId,
        requested:document.querySelector(ui.locate)?.getAttribute('aria-pressed'),locateStatus:document.querySelector(ui.locateStatus)?.textContent,
        pointer:document.querySelector(ui.pointer)?{kind:document.querySelector(ui.pointer).dataset.targetKind,rect:geometry(document.querySelector(ui.pointer))}:null,
        panel:geometry(document.querySelector('#impact-cn-assistant-panel')),
        frames:[...document.querySelectorAll(frameSelector)].map(frame=>{
          const rect=frame.getBoundingClientRect(),url=new URL(frame.src);
          return {host:url.host,pathname:url.pathname,rect:rect.toJSON(),samples:[0.1,0.5,0.9].map(x=>{
            const hit=document.elementFromPoint(rect.left+rect.width*x,rect.top+rect.height/2);
            return {x:rect.left+rect.width*x,y:rect.top+rect.height/2,uncovered:hit===frame,hit:hit?{tag:hit.tagName,id:hit.id,className:typeof hit.className==='string'?hit.className:''}:null};
          })};
        })
      };
    },{ui,frameSelector:config.localization.checklist.frameSelector}).catch(diagnosticError=>({diagnosticError:diagnosticError.message}));
    mkdirSync(reportFolder,{recursive:true});
    const failureDetailsPath=path.join(reportFolder,'failure-'+(results.length+1)+'-'+new Date().toISOString().replace(/[:.]/gu,'-')+'.json');
    writeFileSync(failureDetailsPath,JSON.stringify({name,errorStack:error.stack,conditions},null,2)+'\n');
    results.push({name,status:'FAIL',evidence:error.message,failureDetailsPath});console.log('ONBOARDING UNIT FAIL '+name+': '+error.message);
  }
}
async function probe(frame, action='state', settings={}) {
  return frame.locator('body').evaluate((_body, request)=>new Promise((resolve,reject)=>{
    const listener=event=>{if(event.source!==window||event.data?.__onboardingUnitResult?.token!==request.token)return;clearTimeout(timer);window.removeEventListener('message',listener);resolve(event.data.__onboardingUnitResult.result);};
    const timer=setTimeout(()=>{window.removeEventListener('message',listener);reject(new Error('Onboarding isolated-world probe timed out'));},5000);
    window.addEventListener('message',listener);window.postMessage({__onboardingUnitProbe:request},'*');
  }),{token:++probeSequence,action,...settings});
}
async function openTop(journeyFixture='') {
  await page.goto('https://demo.impact.com'+topPath+'onboarding-fixture'+(journeyFixture?'?journey-fixture='+journeyFixture:''));
  await page.locator('#impact-cn-assistant').waitFor();
  await probe(page,'settings',{enabled:true,aiEnabled:true});
  await page.locator('.fixture-static').filter({hasText:target}).waitFor();
}
async function openGuide() {
  if (await page.locator('#impact-cn-assistant-panel').isHidden()) await page.locator('.impact-cn-launcher').click();
  if (await page.locator(ui.section).isHidden()) await page.locator(ui.open).click();
  await page.locator(ui.section).waitFor({state:'visible'});
}
async function choose(guideId, stepId) {
  await page.locator(ui.card).evaluate(node=>{const details=node.closest('details');if(details)details.open=true;});
  await page.locator(ui.card).selectOption(guideId);
  await page.locator(ui.step).selectOption(stepId);
  assert.equal(await page.locator(ui.card).inputValue(),guideId);
  assert.equal(await page.locator(ui.step).inputValue(),stepId);
}
async function assertDeclarations(value) {
  for (const selector of [ui.read,ui.operated]) await page.waitForFunction(({selector,value})=>document.querySelector(selector)?.getAttribute('aria-pressed')===String(value),{selector,value});
}
async function nativeResultHints() {
  return page.locator(ui.results+' dt, '+ui.results+' dd:not([data-impact-cn-guide-progress])').evaluateAll(nodes=>nodes.map(node=>node.textContent));
}
async function mountNativeFrame(pathname=nativePath,hostname='demo.impact.com') {
  await page.locator('#screen-outer-div').evaluate((slot,{url,validationRegion})=>{
    const frame=document.createElement('iframe');frame.id='iframe';frame.name='screenIframe';frame.className='checklist-iframe';frame.src=url;
    // The older fixture deliberately overlays navigation and child-control
    // areas. A whole-frame region needs disjoint space to be uncovered.
    if(validationRegion)frame.style.marginTop='400px';
    slot.replaceChildren(frame);
  },{url:'https://'+hostname+pathname+'?synthetic-frame=1',validationRegion:hostname==='ui.assets.impact.com'&&pathname===config.guidance.targets['6a'].frameRegion.path});
  const frame=page.locator('#screen-outer-div > iframe').contentFrame();
  await frame.locator('#fixture-business-form').waitFor();
  return frame;
}
async function mountValidationHelp({zeroHeightWrapper=false}={}) {
  await page.locator('#checklist-outer-container').evaluate((shell,{zeroHeightWrapper})=>{
    let drawer=shell.querySelector('.onc-instructions-drawer');
    if(!drawer){drawer=document.createElement('div');drawer.className='onc-instructions-drawer';shell.append(drawer);}
    Object.assign(drawer.style,{position:'fixed',inset:'0',zIndex:'100'});
    // The live wrapper has no own height; its fixed descendants remain visible.
    if(zeroHeightWrapper)Object.assign(drawer.style,{position:'relative',inset:'auto',height:'0px'});
    const cover=document.createElement('div');cover.className='side-modal-close-overlay';
    Object.assign(cover.style,{position:'fixed',inset:'0',background:'rgba(0,0,0,.3)',zIndex:'100'});
    const body=document.createElement('div');body.className='iui-side-modal';
    Object.assign(body.style,{position:'fixed',left:'420px',top:'350px',width:'500px',height:'300px',background:'#fff',zIndex:'101'});
    const close=document.createElement('button');close.type='button';close.className='side-modal-header-close-btn';close.dataset.testid='uicl-side-modal-close-button';close.textContent='Close';
    Object.assign(close.style,{position:'absolute',left:'10px',top:'10px',width:'60px',height:'36px'});
    if(zeroHeightWrapper)Object.assign(close.style,{position:'fixed',left:'430px',top:'360px',width:'38px',height:'38px'});
    window.__onboardingHelpClicks=0;
    close.addEventListener('click',()=>{window.__onboardingHelpClicks++;drawer.replaceChildren(document.createComment(''));drawer.removeAttribute('style');});
    body.append(close);drawer.replaceChildren(cover,body);
  },{zeroHeightWrapper});
}
async function rememberTarget(frame,selector) {
  return frame.locator(selector).evaluate(node=>{
    const wrapper=node.closest('.check-item.clickable')||node;
    window.__onboardingTarget={node,text:node.firstChild,wrapper};
    return {attributes:[...node.attributes].map(attribute=>[attribute.name,attribute.value]),wrapperAttributes:[...wrapper.attributes].map(attribute=>[attribute.name,attribute.value]),text:node.textContent};
  });
}
async function assertTargetPreserved(frame,selector,before) {
  const after=await frame.locator(selector).evaluate(node=>{
    const wrapper=node.closest('.check-item.clickable')||node;
    return {identity:node===window.__onboardingTarget.node,textIdentity:node.firstChild===window.__onboardingTarget.text,wrapperIdentity:wrapper===window.__onboardingTarget.wrapper,attributes:[...node.attributes].map(attribute=>[attribute.name,attribute.value]),wrapperAttributes:[...wrapper.attributes].map(attribute=>[attribute.name,attribute.value]),text:node.textContent};
  });
  assert(after.identity&&after.textIdentity&&after.wrapperIdentity);assert.deepEqual(after.attributes,before.attributes);assert.deepEqual(after.wrapperAttributes,before.wrapperAttributes);assert.equal(after.text,before.text);
}
async function assertPointerAt(frame,selector,kind='navigation') {
  const local=await frame.locator(selector).boundingBox();assert(local,'Target must be visible');
  if (config.guidance.targets['5b'].frame.textOnly && selector==='field-label-typography.form-section-header') {
    const rangeBox=await frame.locator(selector).evaluate(node=>{
      const range=node.ownerDocument.createRange();range.selectNodeContents(node);
      const text=range.getBoundingClientRect(),element=node.getBoundingClientRect();
      return {dx:text.left-element.left,dy:text.top-element.top,width:text.width,height:text.height};
    });
    local.x+=rangeBox.dx;local.y+=rangeBox.dy;local.width=rangeBox.width;local.height=rangeBox.height;
  }
  const point=await page.locator(ui.pointer).evaluate(node=>({x:Number(node.dataset.targetX),y:Number(node.dataset.targetY),kind:node.dataset.targetKind,events:getComputedStyle(node).pointerEvents,hidden:node.getAttribute('aria-hidden')}));
  assert.equal(point.kind,kind);assert.equal(point.events,'none');assert.equal(point.hidden,'true');
  const horizontal=Math.abs(point.y-local.y-local.height/2)<=1&&Math.min(Math.abs(point.x-local.x+4),Math.abs(point.x-local.x-local.width-4))<=1;
  const vertical=Math.abs(point.x-local.x-local.width/2)<=1&&Math.min(Math.abs(point.y-local.y+4),Math.abs(point.y-local.y-local.height-4))<=1;
  assert(horizontal||vertical,'Arrow tip must touch the center of one target boundary');
  const hit=await frame.locator(selector).evaluate(node=>{
    const rect=node.getBoundingClientRect(),hit=node.ownerDocument.elementFromPoint(rect.left+rect.width/2,rect.top+rect.height/2);
    return hit===node||node.contains(hit);
  });assert(hit,'Arrow must not intercept the original control');
  return point;
}
async function waitPointerAt(frame,selector,kind='control') {
  const box=await frame.locator(selector).boundingBox();assert(box,'Expected fixed target must be visible');
  await page.waitForFunction(({pointer,box,kind})=>{
    const node=document.querySelector(pointer);if(!node||node.dataset.targetKind!==kind)return false;
    const x=Number(node.dataset.targetX),y=Number(node.dataset.targetY);
    return Math.abs(y-box.y-box.height/2)<=1&&Math.min(Math.abs(x-box.x+4),Math.abs(x-box.x-box.width-4))<=1
      ||Math.abs(x-box.x-box.width/2)<=1&&Math.min(Math.abs(y-box.y+4),Math.abs(y-box.y-box.height-4))<=1;
  },{pointer:ui.pointer,box,kind});
  return assertPointerAt(frame,selector,kind);
}
async function showNavigationArrow() {
  await openGuide();await choose('shopify','5a');await page.locator(ui.locate).click();
  await page.locator(ui.pointer).waitFor();return assertPointerAt(page,'.check-item:has(#fixture-entry-5a)');
}
async function noPointer(requested=false) {
  await page.locator(ui.pointer).waitFor({state:'detached'});
  assert.equal(await page.locator(ui.locate).getAttribute('aria-pressed'),String(requested));
}
async function pauseFrameTarget(frame) {
  await frame.locator('field-label-typography.form-section-header').evaluate(node=>{
    window.__onboardingPendingTarget=node;node.remove();
  });
}
async function resumeFrameTarget(frame) {
  await frame.locator('#vueInstance').evaluate(node=>node.append(window.__onboardingPendingTarget));
}
async function dragAssistantTo(left,top) {
  const handle=await page.locator('.impact-cn-drag-handle').boundingBox();
  const assistant=await page.locator('#impact-cn-assistant').boundingBox();
  const x=handle.x+handle.width/2,y=handle.y+handle.height/2;
  await page.mouse.move(x,y);await page.mouse.down();
  await page.mouse.move(x+left-assistant.x,y+top-assistant.y,{steps:5});await page.mouse.up();
}
async function panelWithinViewport() {
  await page.waitForFunction(()=>{
    const panel=document.querySelector('#impact-cn-assistant-panel'),rect=panel.getBoundingClientRect();
    return rect.left>=-1&&rect.right<=innerWidth+1&&rect.top>=-1&&rect.bottom<=innerHeight+1&&panel.scrollWidth<=panel.clientWidth+1;
  });
}
async function nativeSnapshot(frame=page) {
  return frame.locator('body').evaluate(()=>{
    const fixture=window.__onboardingFixture, form=document.querySelector('#fixture-business-form');
    return {
      identity:fixture.nodes.every((node,index)=>node===[...form.querySelectorAll('*')][index]),
      textIdentity:form.querySelector('.fixture-static').firstChild===fixture.text,
      attributes:[...form.querySelectorAll('*')].map(node=>[...node.attributes].map(attribute=>[attribute.name,attribute.value])),
      input:document.querySelector('#fixture-business-input').value,checked:document.querySelector('#fixture-checklist-mark').checked,
      businessClicks:fixture.businessClicks,businessInputs:fixture.businessInputs,businessChanges:fixture.businessChanges,submits:fixture.submits,sends:fixture.sends,aiInputs:fixture.aiInputs,
      aiDraft:document.querySelector('#ask-impact-shadow-host')?.shadowRoot?.querySelector('textarea')?.value,
      local:[...Object.entries(localStorage)],session:[...Object.entries(sessionStorage)]
    };
  });
}
async function journeyScene(scene,state) {
  await page.waitForFunction(({selector,scene,state})=>{
    const section=document.querySelector(selector);
    return section?.dataset.impactCnJourneyScene===scene&&(!state||section.dataset.impactCnJourneyState===state);
  },{selector:ui.section,scene,state});
}
function programNavigation(topPath) {
    const navigation=document.createElement('div');navigation.id='adv-navigation';
    const host=document.createElement('impact-style-isolator');navigation.append(host);
    const shadow=host.attachShadow({mode:'open'});
    const header=document.createElement('button');header.className='account-btn adv-account-btn';header.textContent='Synthetic Program A';
    const link=document.createElement('a');link.href=topPath+'synthetic-program-a';link.textContent='Synthetic checklist';
    const programs=document.createElement('div');programs.className='programs-container';
    for(const [name,selected] of [['a',true],['b',false]]) {
      const button=document.createElement('button');button.id='fixture-program-'+name;button.className='iui-mobile-menu-link'+(selected?' selected':'');
      const span=document.createElement('span');span.className='campaignName';span.dataset.testid='synthetic-program-'+name;span.textContent='Synthetic Program '+name.toUpperCase();
      button.append(span);programs.append(button);
    }
    shadow.append(header,link,programs);document.body.append(navigation);
}
async function installProgramNavigation() {
  await page.evaluate(programNavigation,topPath);
  // Bind the newly observed header before starting the task under test.
  await page.locator(ui.journeyStart).click();
}
async function journeyUiSnapshot() {
  return page.evaluate(ui=>({
    scene:document.querySelector(ui.section).dataset.impactCnJourneyScene,
    state:document.querySelector(ui.section).dataset.impactCnJourneyState,
    step:document.querySelector(ui.step).value,
    read:document.querySelector(ui.read).getAttribute('aria-pressed'),
    operated:document.querySelector(ui.operated).getAttribute('aria-pressed'),
    requested:document.querySelector(ui.locate).getAttribute('aria-pressed'),
    pointers:document.querySelectorAll(ui.pointer).length,
    note:document.querySelector(ui.journeyStatus).textContent
  }),ui);
}

try {
  context=await chromium.launchPersistentContext(path.join(workspace,'profile'),{executablePath:chromium.executablePath(),channel:'chromium',headless:true,viewport:{width:1280,height:900},args:[`--disable-extensions-except=${extension}`,`--load-extension=${extension}`]});
  // No fixture navigation, link or background request is allowed onto real accounts.
  await context.route('**/*',route=>{
    const url=new URL(route.request().url());
    routedRequests.push({hostname:url.hostname,pathname:url.pathname});
    if(url.protocol==='https:'&&url.hostname==='demo.impact.com') {
      let body=url.pathname===nativePath?fixtureFrame:url.pathname===shopifyPath?fixtureShopifyFrame:url.searchParams.has('synthetic-tool-controls')?fixtureToolTop:fixtureTop;
      const initialScene=url.searchParams.get('synthetic-initial-scene');
      if(url.pathname.startsWith(topPath)&&['website','validation'].includes(initialScene)) {
        const source=initialScene==='website'?'https://demo.impact.com'+nativePath:'https://ui.assets.impact.com'+config.guidance.targets['6a'].frameRegion.path;
        body=body.replace('<div id="screen-outer-div"></div>','<div id="screen-outer-div"><iframe id="iframe" name="screenIframe" class="checklist-iframe" src="'+source+'?synthetic-frame=initial"></iframe></div>');
      }
      if(url.pathname===secondToolPath) {
        if(url.searchParams.has('synthetic-tool-controls'))body=body.replace('<section id="templateContainer"','<h1 hidden data-fixture-outside-tool>Unrelated native heading</h1><section id="templateContainer"').replace('<div style="height:1000px"></div>','<h1 data-testid="uicl-page-header-title">Test your integration</h1><div style="height:1000px"></div>');
        else body=body.replace('</body>','<div id="fixture-test-route-markers">'+sharedTestActionsMarkers(url.searchParams.get('synthetic-alias-view')||'tool')+'</div></body>');
      }
      return route.fulfill({contentType:'text/html; charset=utf-8',body});
    }
    if(url.protocol==='https:'&&url.hostname==='ui.assets.impact.com')return route.fulfill({contentType:'text/html; charset=utf-8',body:url.pathname===config.guidance.targets['6a'].frameRegion.path?fixtureValidationFrame:fixtureFrame});
    return route.abort();
  });
  page=context.pages()[0]||await context.newPage();page.setDefaultTimeout(7000);
  await openTop();
  await check('Shared Test Actions URI distinguishes observed list and tool while ambiguous structures stay unknown',async()=>{
    const failures=[],evidence=[];
    for(const [pathname,view,scene,step] of [[testsPath,'list','tests','6c'],[toolPath,'tool','tool','6a'],[secondToolPath,'list','tests','6c'],[secondToolPath,'tool','tool','6a'],[secondToolPath,'list-zh','tests','6c'],[secondToolPath,'tool-zh','tool','6a'],[secondToolPath,'missing','unknown','5a'],[secondToolPath,'both','unknown','5a'],[secondToolPath,'duplicate-list','unknown','5a'],[secondToolPath,'wrong-tool','unknown','5a'],[secondToolPath,'wrong-list','unknown','5a']]) {
      await page.goto('https://demo.impact.com'+pathname+'?synthetic-alias-view='+view);await page.locator('#impact-cn-assistant').waitFor();await probe(page,'settings',{enabled:true,aiEnabled:true});
      const before=await nativeSnapshot(),stored=await probe(page,'storage');await openGuide();
      const snapshot=await journeyUiSnapshot();
      if(snapshot.scene!==scene||snapshot.step!==step)failures.push({pathname,view,expected:{scene,step},observed:snapshot});
      assert.equal(snapshot.state,'idle');assert.equal(snapshot.read,'false');assert.equal(snapshot.operated,'false');assert.equal(snapshot.requested,'false');assert.equal(snapshot.pointers,0);
      if(scene!=='tool')assert.equal(await page.locator(ui.locateStatus).textContent(),'');
      if(scene==='unknown')assert.equal(await page.locator(ui.journeyStart).isDisabled(),true);
      assert.deepEqual(await nativeSnapshot(),before);assert.deepEqual(await probe(page,'storage'),stored);evidence.push({pathname,view,scene:snapshot.scene,step:snapshot.step});
    }
    assert.deepEqual(failures,[],'Public route/structure mismatch: '+JSON.stringify(failures));return {scenes:evidence,automaticTaskStarted:false,nativeActions:0};
  });
  await check('Shared Test Actions URI scene changes clear idle declarations without reviving tasks or locations',async()=>{
    await page.goto('https://demo.impact.com'+secondToolPath+'?synthetic-alias-view=list');await page.locator('#impact-cn-assistant').waitFor();await probe(page,'settings',{enabled:true,aiEnabled:true});await openGuide();await journeyScene('tests','idle');
    assert.equal(await page.locator(ui.step).inputValue(),'6c');await page.locator(ui.read).click();await page.locator(ui.operated).click();await assertDeclarations(true);
    const before=await nativeSnapshot(),stored=await probe(page,'storage');
    for(const [view,scene,step] of [['tool','tool','6a'],['list','tests','6c'],['both','unknown',null],['missing','unknown',null],['list','tests','6c']]) {
      await page.locator('#fixture-test-route-markers').evaluate((slot,html)=>{slot.innerHTML=html;},sharedTestActionsMarkers(view));
      await page.evaluate(()=>window.dispatchEvent(new Event('resize')));await journeyScene(scene,'idle');
      if(step)assert.equal(await page.locator(ui.step).inputValue(),step);await assertDeclarations(false);await noPointer();
      assert.deepEqual(await nativeSnapshot(),before);assert.deepEqual(await probe(page,'storage'),stored);
    }
    return 'Same document and URL list → tool → list and ambiguous/absent structure transitions select only observed read-only cards, clear declarations and never start or revive a task, location or AI operation';
  });
  await check('Shared Test Actions URI late native list keeps only an unverified passive arrival',async()=>{
    await page.goto('https://demo.impact.com'+toolPath+'?synthetic-check-source=tool');await page.locator('#impact-cn-assistant').waitFor();await probe(page,'settings',{enabled:true,aiEnabled:true});await openGuide();await journeyScene('tool','idle');
    await page.locator(ui.journeyStart).click();await choose('sales-refunds','6c');await page.locator(ui.journeyContinue).click();
    const worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');
    await worker.evaluate(async()=>{for(let attempt=0;attempt<60;attempt++){if(Object.values(await chrome.storage.session.get(null)).some(item=>item?.state?.pendingTransition?.to==='tests'))return;await new Promise(resolve=>setTimeout(resolve,20));}throw new Error('Synthetic pending tests destination not saved');});
    await page.goto('https://demo.impact.com'+secondToolPath+'?synthetic-alias-view=missing');await page.locator('#impact-cn-assistant').waitFor();await openGuide();await journeyScene('unknown','idle');
    const before=await nativeSnapshot(),stored=await probe(page,'storage');
    await page.locator('#fixture-test-route-markers').evaluate((slot,html)=>{slot.innerHTML=html;},testActionsListMarkers);await page.evaluate(()=>window.dispatchEvent(new Event('resize')));
    await journeyScene('tests','idle');await page.waitForFunction(selector=>document.querySelector(selector)?.textContent.includes('上次任务从'),ui.journeyStatus);
    assert.equal(await page.locator(ui.step).inputValue(),'6c');assert.match(await page.locator(ui.journeyStatus).innerText(),/无法核对.*项目来路.*连续指引已暂停/u);
    await assertDeclarations(false);await noPointer();assert.equal(await page.locator(ui.journeyContinue).isHidden(),true);
    assert.deepEqual(await nativeSnapshot(),before);assert.deepEqual(await probe(page,'storage'),stored);
    assert(await worker.evaluate(async()=>!Object.keys(await chrome.storage.session.get(null)).some(key=>key.startsWith('impactCNJourneyTab:'))));
    return 'Unknown shared-route shell cannot bind a checkpoint; after its observed list arrives, the one-time source is shown read-only and unverified, with no old task/declarations/location/AI resumed';
  });
  await check('Idle guidance initial website validation tool and tests select current read only instructions',async()=>{
    const cases=[
      {scene:'website',step:'5b',pathname:topPath+'onboarding-fixture',query:'synthetic-initial-scene=website'},
      {scene:'validation',step:'6a',pathname:topPath+'onboarding-fixture',query:'synthetic-initial-scene=validation'},
      ...testingRoutes.map(({pathname,scene,step})=>({pathname,scene,step,query:'synthetic-initial-scene='+scene}))
    ],failures=[],evidence=[];
    for(const {scene,step,pathname,query} of cases) {
      await page.goto('https://demo.impact.com'+pathname+'?'+query);
      await page.locator('#impact-cn-assistant').waitFor();await probe(page,'settings',{enabled:true,aiEnabled:true});
      if(['website','validation'].includes(scene))await page.locator('#screen-outer-div > iframe').contentFrame().locator('#fixture-business-form').waitFor();
      const before=await nativeSnapshot(),stored=await probe(page,'storage'),requests=routedRequests.length;
      await openGuide();await journeyScene(scene,'idle');
      const observed=await journeyUiSnapshot();
      if(observed.step!==step)failures.push({scene,expected:step,observed:observed.step,note:observed.note});
      assert.equal(observed.read,'false');assert.equal(observed.operated,'false');assert.equal(observed.requested,'false');assert.equal(observed.pointers,0);
      assert.match(observed.note,/尚未开始连续任务.*已到达/u);assert.doesNotMatch(observed.note,/上次任务/u);
      assert.deepEqual(await nativeSnapshot(),before);assert.deepEqual(await probe(page,'storage'),stored);assert.equal(routedRequests.length,requests);
      evidence.push({scene,step:observed.step,state:observed.state,read:false,operated:false,location:false,nativeStateUnchanged:true});
    }
    assert.deepEqual(failures,[],'Idle current-scene mismatch: '+JSON.stringify(failures));
    return {initialScenes:evidence,automaticTaskStarted:false,scope:'Synthetic initial native iframe or exact tool/list route; current read-only card only, with original native state and local settings unchanged.'};
  });
  await check('Idle guidance follows changed scene while same scene manual choices survive polling',async()=>{
    await openTop();await mountNativeFrame();await openGuide();await journeyScene('website','idle');
    assert.equal(await page.locator(ui.step).inputValue(),'5b');
    await choose('sales-refunds','6c');await page.locator(ui.read).click();await page.locator(ui.operated).click();await assertDeclarations(true);
    const before=await nativeSnapshot(),stored=await probe(page,'storage');
    await page.waitForTimeout(1250);assert.equal(await page.locator(ui.step).inputValue(),'6c');await assertDeclarations(true);await noPointer();
    await mountNativeFrame(config.guidance.targets['6a'].frameRegion.path,'ui.assets.impact.com');await journeyScene('validation','idle');
    assert.equal(await page.locator(ui.step).inputValue(),'6a');await assertDeclarations(false);await noPointer();
    await choose('shopify','5a');await page.waitForTimeout(1250);assert.equal(await page.locator(ui.step).inputValue(),'5a');
    await mountNativeFrame();await journeyScene('website','idle');assert.equal(await page.locator(ui.step).inputValue(),'5b');await assertDeclarations(false);await noPointer();
    assert.deepEqual(await nativeSnapshot(),before);assert.deepEqual(await probe(page,'storage'),stored);
    return 'Idle website → validation → website selects current read-only cards and clears old declarations; manual 6c/5a choices survive unchanged-scene polling, with no task, pointer, native actions, AI events or setting changes';
  });
  await check('Journey scenes keep website origin across the merged validation and tool step',async()=>{
    await openTop();const website=await mountNativeFrame();await openGuide();await journeyScene('website');
    const before=await nativeSnapshot(),childBefore=await nativeSnapshot(website),stored=await probe(page,'storage');
    await page.locator(ui.journeyStart).click();await journeyScene('website','active');
    assert.equal(await page.locator(ui.step).inputValue(),'5b');
    assert.match(await page.locator(ui.journeyStatus).innerText(),/从“网站设置”开始.*当前“网站设置”/u);
    await page.locator(ui.journeyContinue).click();
    assert.equal(await page.locator(ui.step).inputValue(),'6a');
    assert.match(await page.locator(ui.journeyStatus).innerText(),/预期“验证转化事件”/u);
    await page.locator(ui.pointer).waitFor();await assertPointerAt(page,'.check-item:has(#fixture-entry-6a)');
    await page.locator(ui.read).click();await page.locator(ui.operated).click();await assertDeclarations(true);
    const validation=await mountNativeFrame(config.guidance.targets['6a'].frameRegion.path,'ui.assets.impact.com');
    await journeyScene('validation','active');assert.equal(await page.locator(ui.step).inputValue(),'6a');await assertDeclarations(false);
    assert.match(await page.locator(ui.journeyStatus).innerText(),/从“网站设置”开始.*当前“验证转化事件”.*只确认页面已打开/u);
    await page.locator(ui.pointer).waitFor();const arrivedStep=await assertPointerAt(validation,'#fixture-validation-open','control');
    await choose('sales-refunds','6a');await page.locator(ui.locate).click();await page.locator(ui.pointer).waitFor();
    const step6a=await assertPointerAt(validation,'#fixture-validation-open','control');
    assert.deepEqual({x:arrivedStep.x,y:arrivedStep.y},{x:step6a.x,y:step6a.y});
    assert.equal(await validation.locator('#impact-cn-assistant,.impact-cn-guide,'+ui.pointer).count(),0);
    await page.locator(ui.journeyContinue).click();
    assert.match(await page.locator(ui.journeyStatus).innerText(),/从“网站设置”开始.*当前“验证转化事件”.*预期“测试工具”/u);
    const arrival=await page.evaluate(({ui,pathname})=>{
      const oldRead=document.querySelector(ui.read);history.pushState({},'',pathname+'?synthetic-journey=arrived');oldRead.click();
      return {step:document.querySelector(ui.step).value,read:document.querySelector(ui.read).getAttribute('aria-pressed'),operated:document.querySelector(ui.operated).getAttribute('aria-pressed')};
    },{ui,pathname:config.guidance.targets['6a'].openedPaths[0]});
    assert.deepEqual(arrival,{step:'6a',read:'false',operated:'false'});await journeyScene('tool','active');await noPointer();
    assert.match(await page.locator(ui.journeyStatus).innerText(),/从“网站设置”开始.*当前“测试工具”.*只确认页面已打开/u);
    assert.deepEqual(await nativeSnapshot(),before);assert.deepEqual(await probe(page,'storage'),stored);
    assert(childBefore.identity&&childBefore.textIdentity);
    for(const exit of ['follow','close','reset','cancel','program']) {
      await openTop();await mountNativeFrame();await openGuide();await journeyScene('website');
      if(exit==='program')await installProgramNavigation();
      await page.locator(ui.journeyStart).click();await page.locator(ui.journeyContinue).click();await page.locator(ui.pointer).waitFor();
      await page.locator('#screen-outer-div > iframe').evaluate(frame=>frame.src='about:blank');
      await page.waitForFunction(selector=>document.querySelector(selector)?.textContent.includes('正文正在切换'),ui.journeyStatus);
      await noPointer(true);await page.waitForTimeout(80);await noPointer(true);
      if(exit==='close')await page.locator(ui.back).click();
      if(exit==='reset')await page.locator(ui.reset).click();
      if(exit==='cancel')await page.locator(ui.locate).click();
      if(exit==='program')await page.locator('#adv-navigation impact-style-isolator #fixture-program-b').click();
      await page.locator('#screen-outer-div > iframe').evaluate((frame,url)=>{frame.style.marginTop='400px';frame.src=url;},'https://ui.assets.impact.com'+config.guidance.targets['6a'].frameRegion.path+'?synthetic-wait=arrived');
      await page.locator('#screen-outer-div > iframe').contentFrame().locator('#fixture-business-form').waitFor();
      await journeyScene('validation',exit==='close'?'closed':exit==='reset'?'idle':exit==='program'?'paused':'active');
      await assertDeclarations(false);
      if(exit==='follow') {
        assert.equal(await page.locator(ui.step).inputValue(),'6a');
        await page.locator(ui.pointer).waitFor();await assertPointerAt(page.locator('#screen-outer-div > iframe').contentFrame(),'#fixture-validation-open','control');
      }else {
        await noPointer();
        if(exit==='close'){await openGuide();await journeyScene('validation','paused');}
        await page.waitForTimeout(80);await noPointer();
      }
    }
    return 'Same top document follows website iframe → precise validation open control → exact tool route using the merged step. A Continue request survives about:blank loading without painting a pointer, while close/reset/cancel/Program change prevent revival; arrival never declares business success';
  });
  await check('Checking orders records bounded test list intent from validation and tool without restoring old activity',async()=>{
    for(const sourceScene of ['validation','tool']) {
      if(sourceScene==='validation') {
        await openTop();await mountNativeFrame(config.guidance.targets['6a'].frameRegion.path,'ui.assets.impact.com');
      } else {
        await page.goto('https://demo.impact.com'+toolPath+'?synthetic-check-source=tool');
        await page.locator('#impact-cn-assistant').waitFor();await probe(page,'settings',{enabled:true,aiEnabled:true});
      }
      await openGuide();await journeyScene(sourceScene,'idle');
      await page.locator(ui.journeyStart).click();await journeyScene(sourceScene,'active');
      await choose('sales-refunds','6c');
      const before=await nativeSnapshot(),stored=await probe(page,'storage');
      await page.locator(ui.journeyContinue).click();
      const worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');
      const pending=await worker.evaluate(async()=>{
        for(let attempt=0;attempt<50;attempt++) {
          const entries=await chrome.storage.session.get(null);
          const item=Object.entries(entries).find(([key,value])=>key.startsWith('impactCNJourneyTab:')&&value?.state?.pendingTransition?.to==='tests');
          if(item)return item[1].state;
          await new Promise(resolve=>setTimeout(resolve,20));
        }
        return null;
      });
      assert(pending,'Explicit order checking must save its test list destination');
      assert.equal(pending.pendingTransition.from,sourceScene);
      assert.equal(pending.originScene,sourceScene);assert.equal(pending.sceneId,sourceScene);
      assert.equal(pending.businessResult,'unknown');
      assert.deepEqual(await nativeSnapshot(),before);assert.deepEqual(await probe(page,'storage'),stored);
      // This is isolated synthetic navigation, not a click of a business control.
      await page.goto('https://demo.impact.com'+testsPath+'?synthetic-check-arrived=1');
      await page.locator('#impact-cn-assistant').waitFor();await openGuide();await journeyScene('tests','idle');
      assert.equal(await page.locator(ui.step).inputValue(),'6c');
      await page.waitForFunction(selector=>document.querySelector(selector)?.textContent.includes('上次任务从'),ui.journeyStatus);
      await assertDeclarations(false);await noPointer();
      assert.equal(await page.locator(ui.journeyContinue).isHidden(),true);
      assert(await worker.evaluate(async()=>!Object.keys(await chrome.storage.session.get(null)).some(key=>key.startsWith('impactCNJourneyTab:'))));
    }
    return 'Explicit checking uses the tests destination from either validation or tool, preserves only a one-time passive source after document change, selects 6c and clears activity, declarations and pointers without native business actions';
  });
  await check('Journey passive arrival survives native navigation hydration without restoring Program continuity',async()=>{
    const failures=[],evidence=[];
    for(const phase of ['late-take','consumed-note']) {
      await openTop();await mountNativeFrame();await openGuide();await journeyScene('website');
      await page.locator(ui.journeyStart).click();await page.locator(ui.journeyContinue).click();
      await mountNativeFrame(config.guidance.targets['6a'].frameRegion.path,'ui.assets.impact.com');
      await journeyScene('validation','active');await page.locator(ui.journeyContinue).click();
      const worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');
      assert(await worker.evaluate(async()=>{
        for(let attempt=0;attempt<50;attempt++) {
          const entries=await chrome.storage.session.get(null);
          if(Object.entries(entries).some(([key,value])=>key.startsWith('impactCNJourneyTab:')&&value?.state?.pendingTransition?.to==='tool'))return true;
          await new Promise(resolve=>setTimeout(resolve,20));
        }
        return false;
      }),'Pending website-origin transition must exist before cross-document navigation');
      await page.goto('https://demo.impact.com'+config.guidance.targets['6a'].openedPaths[0]+'?journey-fixture='+(phase==='late-take'?'late-bind':'clock')+'&synthetic-native-nav=1');
      await page.locator('#impact-cn-assistant').waitFor();await openGuide();await journeyScene('tool','idle');
      if(phase==='late-take')assert.equal((await probe(page,'journeyFixture')).waiting,true);
      else await page.waitForFunction(selector=>document.querySelector(selector)?.textContent.includes('上次任务从“网站设置”前往“测试工具”'),ui.journeyStatus);
      const before=await nativeSnapshot(),stored=await probe(page,'storage');
      await page.evaluate(topPath=>{
        const shadow=document.querySelector('#adv-navigation impact-style-isolator').shadowRoot;
        shadow.querySelector('button.account-btn').textContent='Synthetic Program A';
        shadow.querySelector('a').href=topPath+'synthetic-program-a';
        window.dispatchEvent(new Event('resize'));
      },topPath);
      if(phase==='late-take')await probe(page,'journeyFixture',{enabled:'release'});
      try {
        await page.waitForFunction(selector=>document.querySelector(selector)?.textContent.includes('上次任务从“网站设置”前往“测试工具”'),ui.journeyStatus,{timeout:2000});
        const snapshot=await journeyUiSnapshot();
        assert.equal(snapshot.state,'idle');assert.equal(snapshot.scene,'tool');assert.equal(snapshot.step,'6a');
        assert.equal(snapshot.read,'false');assert.equal(snapshot.operated,'false');assert.equal(snapshot.requested,'false');assert.equal(snapshot.pointers,0);
        assert.match(snapshot.note,/无法核对这次跳转的项目来路.*连续指引已暂停/u);
        assert.doesNotMatch(await page.locator(ui.context).innerText(),/项目或页面上下文已变化/u);
        assert(await worker.evaluate(async()=>!Object.keys(await chrome.storage.session.get(null)).some(key=>key.startsWith('impactCNJourneyTab:'))));
      } catch(error) {failures.push({phase,error:error.message,snapshot:await journeyUiSnapshot()});}
      if(phase==='late-take')await page.locator('#adv-navigation impact-style-isolator #fixture-program-b').click();
      else await page.evaluate(()=>{
        document.querySelector('#adv-navigation impact-style-isolator').shadowRoot.querySelector('#fixture-program-a .campaignName').dataset.testid='synthetic-program-changed';
        window.dispatchEvent(new Event('resize'));
      });
      assert.doesNotMatch(await page.locator(ui.journeyStatus).innerText(),/上次任务从/u,'An explicit Program choice or observed selected-ID change must still discard the passive arrival note');
      await journeyScene('tool','idle');await assertDeclarations(false);await noPointer();
      // Consume the invalidated old action, then protect a new local task or
      // the existing one-step declarations against later header changes.
      await page.locator(ui.read).click();await assertDeclarations(false);
      if(phase==='late-take')await page.locator(ui.journeyStart).click();
      await page.locator(ui.read).click();assert.equal(await page.locator(ui.read).getAttribute('aria-pressed'),'true');
      await page.evaluate(()=>{
        document.querySelector('#adv-navigation impact-style-isolator').shadowRoot.querySelector('button.account-btn').textContent='Synthetic later context change';
        window.dispatchEvent(new Event('resize'));
      });
      await journeyScene('tool',phase==='late-take'?'paused':'idle');await assertDeclarations(false);await noPointer();
      assert.match(await page.locator(ui.context).innerText(),/项目或页面上下文已变化/u);
      assert.deepEqual(await nativeSnapshot(),before);assert.deepEqual(await probe(page,'storage'),stored);
      evidence.push({phase,hydrationKeepsPassiveNote:!failures.some(item=>item.phase===phase),programBoundary:phase==='late-take'?'explicit-selection':'selected-id-change',localActivityStillInvalidates:phase==='late-take'?'active-task':'one-step-declaration'});
    }
    assert.deepEqual(failures,[],'Native navigation hydration lost passive journey arrival: '+JSON.stringify(failures));
    return {hydration:evidence,continuity:false,scope:'Synthetic cross-document MV3 with initial native header/anchor placeholders; selected Program ID stays identical during hydration. Arrival is passive and consumed once, never an active task or business result.'};
  });
  await check('Journey boundaries stop eight stale actions for duplicate unknown expired and same URL Program contexts',async()=>{
    const actions=['read','operated','previous','next','locate','card','step','issue'],failures=[];
    for(const boundary of ['arrival','duplicate','unknown','expired','program','loading','frame-query'])for(const action of actions) {
      await openTop('clock');
      if(boundary==='frame-query')await mountNativeFrame(config.guidance.targets['6a'].frameRegion.path,'ui.assets.impact.com');else await mountNativeFrame();
      await openGuide();await journeyScene(boundary==='frame-query'?'validation':'website');
      if(boundary==='program')await installProgramNavigation();
      await page.locator(ui.journeyStart).click();await journeyScene(boundary==='frame-query'?'validation':'website','active');
      await page.locator(ui.journeyContinue).click();await choose('sales-refunds','6c');
      await page.locator(ui.read).click();await page.locator(ui.operated).click();await assertDeclarations(true);
      if(boundary==='expired')await probe(page,'journeyFixture',{enabled:'expire'});
      const before=await nativeSnapshot(),stored=await probe(page,'storage');
      const observed=await page.evaluate(({ui,boundary,action,validation})=>{
        const node=document.querySelector(ui[action]),oldStep=document.querySelector(ui.step).value;
        if(action==='card')node.value='shopify';
        if(action==='step')node.value='6a';
        if(action==='issue')node.selectedIndex=Math.min(1,node.options.length-1);
        const frame=document.querySelector('#screen-outer-div > iframe');
        if(boundary==='arrival')frame.src=validation;
        if(boundary==='duplicate')frame.parentElement.append(frame.cloneNode());
        if(boundary==='unknown')frame.src='https://ui.assets.impact.com/onboarding-ui/checklist-assets/production/operator-json/instructions.html';
        if(boundary==='loading')frame.src='about:blank';
        if(boundary==='frame-query')frame.src+='&synthetic-context=changed';
        if(boundary==='program')document.querySelector('#adv-navigation impact-style-isolator').shadowRoot.querySelector('#fixture-program-b').click();
        if(['card','step','issue'].includes(action))node.dispatchEvent(new Event('change',{bubbles:true}));else node.click();
        return {oldStep,step:document.querySelector(ui.section).dataset.impactCnGuideStepId,
          read:document.querySelector(ui.read).getAttribute('aria-pressed'),operated:document.querySelector(ui.operated).getAttribute('aria-pressed'),
          requested:document.querySelector(ui.locate).getAttribute('aria-pressed'),pointers:document.querySelectorAll(ui.pointer).length,
          state:document.querySelector(ui.section).dataset.impactCnJourneyState};
      },{ui,boundary,action,validation:'https://ui.assets.impact.com'+config.guidance.targets['6a'].frameRegion.path});
      const expected={oldStep:'6c',step:boundary==='arrival'?'6a':'6c',read:String(boundary==='loading'),operated:String(boundary==='loading'),requested:'false',pointers:0,state:['arrival','loading'].includes(boundary)?'active':'paused'};
      try{assert.deepEqual(observed,expected);}catch{failures.push({boundary,action,observed,expected});}
      if(boundary==='program'&&action==='read') {
        assert.match(await page.locator(ui.context).innerText(),/连续指引已暂停/u);
        await page.locator(ui.journeyStart).click();await journeyScene('website','active');
        assert.doesNotMatch(await page.locator(ui.context).innerText(),/已暂停|已清空|重新开始/u,'Starting a current task must replace the stale paused/reset context');
        assert.match(await page.locator(ui.context).innerText(),/当前页面.*项目.*操作.*结果.*核对/u);
        assert.doesNotMatch(await page.locator(ui.context).innerText(),/项目已核验|已验证项目/u);
        await assertDeclarations(false);await noPointer();
        await page.locator(ui.journeyContinue).click();
        const worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');
        const state=await worker.evaluate(async()=>{
          for(let attempt=0;attempt<50;attempt++) {
            const entries=await chrome.storage.session.get(null);
            const item=Object.entries(entries).find(([key,value])=>key.startsWith('impactCNJourneyTab:')&&value?.state?.status==='active'&&value.state.pendingTransition?.to==='validation');
            if(item)return item[1].state;
            await new Promise(resolve=>setTimeout(resolve,20));
          }
          return null;
        });
        assert(state,'Restarted task must write its current bounded transition');
        assert.equal(state.businessResult,'unknown');
        assert.equal(state.sceneId,'website');assert.equal(state.originScene,'website');
      }
      if(boundary==='frame-query') {
        await page.waitForTimeout(80);const settled=await probe(page,'journeyFixture');
        for(let observe=0;observe<2;observe++){await page.evaluate(()=>window.dispatchEvent(new Event('resize')));await page.waitForTimeout(40);}
        const repeated=await probe(page,'journeyFixture');
        assert.equal(repeated.clears,settled.clears,'One frame query change must not repeatedly clear checkpoints');
        assert.equal(repeated.clearEpochs,settled.clearEpochs,'One frame query change must not repeatedly replace context epochs');
      }
      assert.deepEqual(await nativeSnapshot(),before);assert.deepEqual(await probe(page,'storage'),stored);
    }
    assert.deepEqual(failures,[],'Stale journey action failures: '+JSON.stringify(failures));
    return 'Fifty-six synchronous cases cover eight old controls after arrival, duplicate/unknown frames, expiry, same-URL Program selection, about:blank loading and validation-frame query change before load. Starting after invalidation replaces stale context text, clears declarations/positioning and keeps businessResult unknown. Repeated observation leaves clear counts and context epochs stable; no native/AI/local-storage changes';
  });
  await check('Journey close reset pagehide and late checkpoints never revive old pointers or operations',async()=>{
    await openTop();await mountNativeFrame();await openGuide();await journeyScene('website');
    await page.locator(ui.journeyStart).click();await page.locator(ui.journeyContinue).click();await page.locator(ui.pointer).waitFor();
    await page.locator(ui.back).click();await noPointer();await openGuide();await journeyScene('website','paused');
    assert.equal(await page.locator(ui.step).inputValue(),'6a');await noPointer();
    await page.waitForTimeout(1100);await noPointer();
    await openTop();await mountNativeFrame(config.guidance.targets['6a'].frameRegion.path,'ui.assets.impact.com');
    await openGuide();await journeyScene('validation');
    await page.locator(ui.journeyStart).click();await page.locator(ui.journeyContinue).click();
    const worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');
    const checkpointSaved=await worker.evaluate(async()=>{
      for(let attempt=0;attempt<50;attempt++) {
        const entries=await chrome.storage.session.get(null);
        if(Object.entries(entries).some(([key,value])=>key.startsWith('impactCNJourneyTab:')&&value?.state?.pendingTransition?.to==='tool'))return true;
        await new Promise(resolve=>setTimeout(resolve,20));
      }
      return false;
    });
    assert(checkpointSaved,'The real test worker must save a bounded pending checkpoint before navigation');
    await page.goto('https://demo.impact.com'+config.guidance.targets['6a'].openedPaths[0]+'?synthetic-cross-document=1');
    await page.locator('#impact-cn-assistant').waitFor();await openGuide();await journeyScene('tool','idle');
    await page.waitForFunction(selector=>document.querySelector(selector)?.textContent.includes('无法核对这次跳转的项目来路'),ui.journeyStatus);
    await assertDeclarations(false);await noPointer();
    const checkpointConsumed=await worker.evaluate(async()=>!Object.keys(await chrome.storage.session.get(null)).some(key=>key.startsWith('impactCNJourneyTab:')));
    assert(checkpointConsumed,'Cross-document checkpoint is consumed once, never restored as an active task');
    await openTop('late-bind');await mountNativeFrame(config.guidance.targets['6a'].frameRegion.path,'ui.assets.impact.com');
    await openGuide();await journeyScene('validation');
    await page.locator(ui.journeyStart).click();await page.locator(ui.journeyContinue).click();
    const beforeBind=await probe(page,'journeyFixture');
    assert(beforeBind.queuedTakes>=2,'Initial take and start take are both delayed');assert.equal(beforeBind.puts,0);
    await probe(page,'journeyFixture',{enabled:'release'});
    const pendingAfterBind=await worker.evaluate(async()=>{
      for(let attempt=0;attempt<50;attempt++) {
        const entries=await chrome.storage.session.get(null);
        if(Object.entries(entries).some(([key,value])=>key.startsWith('impactCNJourneyTab:')&&value?.state?.pendingTransition?.to==='tool'))return true;
        await new Promise(resolve=>setTimeout(resolve,20));
      }
      return false;
    });
    assert(pendingAfterBind,'Successful late binding must put the already active pending task');
    assert((await probe(page,'journeyFixture')).puts>=1);await journeyScene('validation','active');await assertDeclarations(false);
    const cleanups=[];
    for(const cleanup of ['query','manual','pagehide','close']) {
      await openTop('late');await mountNativeFrame();await openGuide();await journeyScene('website');
      assert.equal((await probe(page,'journeyFixture')).waiting,true);
      await choose('sales-refunds','6c');await page.locator(ui.read).click();await page.locator(ui.operated).click();await assertDeclarations(true);
      const before=await nativeSnapshot(),stored=await probe(page,'storage');
      if(cleanup==='query')await page.evaluate(ui=>{history.replaceState({},'',location.pathname+'?journey-fixture=late&synthetic-query=changed');document.querySelector(ui.next).click();},ui);
      if(cleanup==='manual')await page.locator(ui.reset).click();
      if(cleanup==='pagehide')await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
      if(cleanup==='close')await page.locator(ui.back).click();
      const beforeLate=await journeyUiSnapshot();
      await probe(page,'journeyFixture',{enabled:'release'});await page.waitForTimeout(80);
      const afterLate=await journeyUiSnapshot();
      assert.deepEqual(afterLate,beforeLate,'Late checkpoint mutated '+cleanup+' context');
      assert.notEqual(afterLate.state,'active');assert.equal(afterLate.requested,'false');assert.equal(afterLate.pointers,0);
      assert.doesNotMatch(afterLate.note,/上次任务从/u);
      if(cleanup!=='close')await assertDeclarations(false);
      assert.deepEqual(await nativeSnapshot(),before);assert.deepEqual(await probe(page,'storage'),stored);
      cleanups.push({cleanup,state:afterLate.state,lateReplyIgnored:true});
    }
    const aiCancellations=[];
    for(const phase of ['before-fill','before-send']) {
      await openTop();await mountNativeFrame();await openGuide();await journeyScene('website');await installProgramNavigation();
      await page.evaluate(phase=>{
        const root=document.querySelector('#ask-impact-shadow-host').shadowRoot,fixture=window.__onboardingFixture;
        root.replaceChildren();fixture.aiOpens=0;
        fixture.releaseAI=()=>{
          const input=document.createElement('textarea');input.placeholder='ask impact...';
          input.addEventListener('input',()=>fixture.aiInputs++);
          const send=document.createElement('button');send.setAttribute('aria-label','Send');send.textContent='Send';send.disabled=phase==='before-send';
          send.addEventListener('click',()=>fixture.sends++);root.append(input,send);
        };
        if(phase==='before-fill') {
          const opener=document.createElement('button');opener.dataset.impactAiOpen='';opener.textContent='Open synthetic Ask Impact';
          opener.addEventListener('click',()=>{fixture.aiOpens++;opener.remove();});root.append(opener);
        }else fixture.releaseAI();
      },phase);
      await probe(page,'startPendingAI');
      await page.waitForFunction(phase=>phase==='before-fill'?window.__onboardingFixture.aiOpens===1:window.__onboardingFixture.aiInputs>0,phase);
      const beforeSwitch=await page.evaluate(()=>({route:location.href,inputs:window.__onboardingFixture.aiInputs,draft:document.querySelector('#ask-impact-shadow-host').shadowRoot.querySelector('textarea')?.value||''}));
      await page.evaluate(phase=>{
        document.querySelector('#adv-navigation impact-style-isolator').shadowRoot.querySelector('#fixture-program-b').click();
        if(phase==='before-fill')window.__onboardingFixture.releaseAI();
        else document.querySelector('#ask-impact-shadow-host').shadowRoot.querySelector('[aria-label="Send"]').disabled=false;
      },phase);
      const cancelled=await probe(page,'pendingAIResult');
      assert.deepEqual(cancelled,{ok:false,reason:'page-changed',filled:phase==='before-send'});
      await page.waitForTimeout(80);
      const afterSwitch=await page.evaluate(()=>({route:location.href,inputs:window.__onboardingFixture.aiInputs,sends:window.__onboardingFixture.sends,draft:document.querySelector('#ask-impact-shadow-host').shadowRoot.querySelector('textarea').value}));
      assert.equal(afterSwitch.route,beforeSwitch.route,'Program switch fixture intentionally keeps the same top URL');
      assert.equal(afterSwitch.inputs,beforeSwitch.inputs,'No pending question may fill after Program selection');
      assert.equal(afterSwitch.sends,0,'No pending question may send after Program selection');
      assert.equal(afterSwitch.draft,beforeSwitch.draft,'Empty or already-filled draft bytes remain unchanged after cancellation');
      aiCancellations.push({phase,reason:cancelled.reason,filledBeforeSwitch:cancelled.filled,inputsAfterSwitch:0,sends:0,draftPreserved:true});
    }
    return {closeReopen:'Review only; no arrow resumes after timers',crossDocument:'Real MV3 worker checkpoint consumed once as a passive unverified note; no active task, declarations or pointer',lateBinding:'Start and continue before delayed take complete; successful binding puts the existing pending task',lateCheckpointBoundaries:cleanups,sameUrlProgramAiCancellation:aiCancellations,scope:'Synthetic host, synthetic native AI controls and isolated-world late replies/time; no real account, AI reply or business actions'};
  });
  await check('The shipped data contains eight merged steps with two information only endings',async()=>{
    // Guidance content has its own version; it is not the extension release version.
    assert.match(guidance.version,/^\d+\.\d+\.\d+$/u);
    assert.match(guidance.contentDate,/^\d{4}-\d{2}-\d{2}$/u);
    assert.deepEqual(guidance.guides.map(guide=>guide.id),['shopify','sales-refunds']);
    const expectedSteps=[['5a','5b','5c','5d'],['6a','6c','6e','6f']];
    const ids=[];
    for(const [index,guide] of guidance.guides.entries()) {
      for(const field of ['title','purpose','applicability']) assert.equal(typeof guide[field],'string');
      assert(guide.prerequisites.length>0);
      assert.deepEqual(guide.steps.map(step=>step.id),expectedSteps[index]);
      for(const step of guide.steps) {
        for(const field of ['title','entry','action','ready']) assert(step[field]?.trim(),step.id+' lacks '+field);
        assert(step.details?.length&&step.details.every(text=>typeof text==='string'&&text.trim()));
        assert(step.issues.length>0&&step.links.length>0);
        ids.push(step.id);
        for(const issue of step.issues) {ids.push(issue.id);for(const field of ['label','help','owner'])assert(issue[field]?.trim());}
        for(const link of step.links) {
          const url=new URL(link.url);assert.equal(url.protocol,'https:');
          assert(['help.impact.com','integrations.impact.com','help.shopify.com','apps.shopify.com'].includes(url.hostname));
          assert.equal(url.search,'');assert(link.label?.trim());
        }
      }
    }
    const steps=Object.fromEntries(guidance.guides.flatMap(guide=>guide.steps.map(step=>[step.id,step])));
    assert.match(steps['6a'].title,/测试订单.*追踪/u);
    assert.match(steps['6a'].action,/新窗口.*店铺.*测试订单/u);
    assert.match(steps['6a'].entry,/验证转化事件.*打开测试工具.*测试.*下单/u);
    assert.match(steps['6c'].title,/核对测试订单/u);
    assert.match(steps['6c'].action,/查看测试转化.*核对.*确认/u);
    for(const id of ['6e','6f'])assert.equal(steps[id].mode,'information');
    assert.match(steps['6e'].action,/不提供.*定位/u);
    assert.match(steps['6f'].action,/客户不能.*自行完成/u);
    assert.equal(Object.hasOwn(config.guidance.targets,'5e'),false);
    assert.equal(Object.hasOwn(config.guidance.targets,'6e'),false);
    assert.equal(Object.hasOwn(config.guidance.targets,'6f'),false);
    assert.equal(new Set(ids).size,ids.length);
    assert.deepEqual(manifest.permissions,['storage']);assert.equal(manifest.host_permissions,undefined);
    const topScripts=manifest.content_scripts.find(group=>group.matches.includes('https://demo.impact.com/*')).js;
    assert(topScripts.indexOf('guidance.js')>=0&&topScripts.indexOf('guidance.js')<topScripts.indexOf('content.js'));
    return 'Eight ordered steps remove nonexistent save and split operations; order tracking and checking stay separate from two information-only endings; guidance content version is independent, with owned failures and official links';
  });
  await check('Previous and next browse the eight merged steps without declaring native completion',async()=>{
    await openTop();await openGuide();
    assert(await page.locator(ui.card).isHidden(),'Jump selection must start folded');
    await page.locator(ui.reset).click();
    const sequence=guidance.guides.flatMap(guide=>guide.steps.map(step=>({guideId:guide.id,step})));
    assert.deepEqual(sequence.map(item=>item.step.id),['5a','5b','5c','5d','6a','6c','6e','6f']);
    const assertStep=async index=>{
      const {guideId,step}=sequence[index];
      assert.equal(await page.locator(ui.card).inputValue(),guideId);
      assert.equal(await page.locator(ui.step).inputValue(),step.id);
      assert.match(await page.locator(ui.position).innerText(),new RegExp('(?:^|\\D)'+(index+1)+'\\s*/\\s*'+sequence.length+'(?:\\D|$)','u'));
      assert((await page.locator(ui.title).innerText()).includes(step.title.replace(/^\d+\.\s*/u,'')));
      assert.equal(await page.locator(ui.previous).isDisabled(),index===0);
      assert.equal(await page.locator(ui.next).isDisabled(),index===sequence.length-1);
    };
    const before=await nativeSnapshot(),stored=await probe(page,'storage'),nativeResults=await nativeResultHints(),requests=routedRequests.length;
    await assertStep(0);await assertDeclarations(false);
    await page.locator(ui.previous).evaluate(button=>button.click());await assertStep(0);
    await page.locator(ui.read).click();await page.locator(ui.operated).click();await assertDeclarations(true);
    for(let index=1;index<sequence.length;index++) {
      await page.locator(ui.next).click();await assertStep(index);await assertDeclarations(false);
    }
    await page.locator(ui.next).evaluate(button=>button.click());await assertStep(sequence.length-1);
    for(let index=sequence.length-2;index>=0;index--) {
      await page.locator(ui.previous).click();await assertStep(index);await assertDeclarations(index===0);
    }
    assert.deepEqual(await nativeResultHints(),nativeResults);
    assert.deepEqual(await nativeSnapshot(),before);assert.deepEqual(await probe(page,'storage'),stored);
    assert.equal(routedRequests.length,requests,'Browsing the guide must not create network requests');
    assert.equal(await page.evaluate(()=>window.__onboardingFixture.entryClicks+window.__onboardingFixture.groupClicks),0);
    await page.locator(ui.reset).click();await assertDeclarations(false);
    return 'All eight items browse both directions in the approved merged order; endpoints disable, declarations remain separate, and no native/business/AI/storage changes occur';
  });
  await check('Only the top assistant exposes guide selection and matching merged failure branches',async()=>{
    await openTop();
    assert.equal(await page.locator('#impact-cn-assistant').count(),1);
    assert.equal(await page.locator(ui.open).count(),1);
    assert.equal(await page.locator(ui.section).count(),1);
    assert(await page.locator(ui.section).isHidden());
    await openGuide();
    assert.deepEqual(await page.locator(ui.card+' option').evaluateAll(options=>options.map(option=>option.value)),['shopify','sales-refunds']);
    for(const guide of guidance.guides) {
      await choose(guide.id,guide.steps[0].id);
      assert.deepEqual(await page.locator(ui.step+' option').evaluateAll(options=>options.map(option=>option.value)),guide.steps.map(step=>step.id));
      for(const step of guide.steps) {
        await choose(guide.id,step.id);
        assert((await page.locator(ui.section).innerText()).includes(step.action));
        assert((await page.locator(ui.section).innerText()).includes(step.ready));
        const renderedLinks=await page.locator(ui.section+' a').evaluateAll(links=>links.map(link=>({url:link.href,target:link.target,rel:link.rel})));
        assert.deepEqual(renderedLinks.map(link=>link.url),step.links.map(link=>new URL(link.url).href));
        assert(renderedLinks.every(link=>link.target==='_blank'&&link.rel.split(/\s+/u).includes('noopener')));
        for(const issue of step.issues) {
          await page.locator(ui.issue).selectOption(issue.id);
          assert((await page.locator(ui.help).innerText()).includes(issue.help));
          assert((await page.locator(ui.owner).innerText()).includes(issue.owner));
        }
      }
    }
    await page.locator(ui.back).click();assert(await page.locator(ui.section).isHidden());await openGuide();
    return 'The real content script renders each customer-selected substep and its responsible-person branch';
  });
  await check('Refund and review information never offer positioning or operation declarations',async()=>{
    for(const id of ['6e','6f']) {
      await openTop();await openGuide();await choose('shopify','5a');
      await page.locator(ui.locate).click();await page.locator(ui.pointer).waitFor();
      const before=await nativeSnapshot(),stored=await probe(page,'storage'),requests=routedRequests.length;
      await choose('sales-refunds',id);await noPointer();
      assert(await page.locator(ui.locate).isHidden()||await page.locator(ui.locate).isDisabled(),'Information does not offer a location action');
      assert(await page.locator(ui.operated).isHidden()||await page.locator(ui.operated).isDisabled(),'Information does not offer an operation declaration');
      await assertDeclarations(false);
      // A stale reference must be harmless even if its hidden element is clicked.
      await page.evaluate(ui=>{document.querySelector(ui.locate)?.click();document.querySelector(ui.operated)?.click();},ui);
      await noPointer();await assertDeclarations(false);
      await page.locator(ui.read).click();
      assert.equal(await page.locator(ui.read).getAttribute('aria-pressed'),'true');
      assert.equal(await page.locator(ui.operated).getAttribute('aria-pressed'),'false');
      await page.waitForTimeout(1250);await noPointer();
      await page.locator(ui.back).click();await openGuide();
      assert.equal(await page.locator(ui.step).inputValue(),id);await noPointer();
      assert(await page.locator(ui.locate).isHidden()||await page.locator(ui.locate).isDisabled());
      assert(await page.locator(ui.operated).isHidden()||await page.locator(ui.operated).isDisabled());
      assert.deepEqual(await nativeSnapshot(),before);assert.deepEqual(await probe(page,'storage'),stored);
      assert.equal(routedRequests.length,requests,'Reading information cannot create native network requests');
    }
    return 'Both information endings cancel an active arrow, hide or disable location and operation controls, ignore stale actions and timers, retain reading only, and preserve native state, AI draft and storage';
  });
  await check('All four translation and AI settings still allow independent guide use',async()=>{
    for(const [enabled,aiEnabled] of [[false,false],[false,true],[true,false],[true,true]]) {
      const state=await probe(page,'settings',{enabled,aiEnabled});
      assert.equal(state.enabled,enabled);assert.equal(state.aiEnabled,aiEnabled);
      await page.locator('.fixture-static').filter({hasText:enabled?target:source}).waitFor();
      await openGuide();await choose('shopify','5b');
      assert(await page.locator(ui.section).isVisible());
      const after=await probe(page);assert.equal(after.enabled,enabled);assert.equal(after.aiEnabled,aiEnabled);
      assert.equal((await nativeSnapshot()).sends,0);
    }
    return 'Guide navigation changes neither control and sends no native AI request';
  });
  await check('Reading and operation declarations affect only guide progress without native or storage side effects',async()=>{
    await choose('shopify','5a');await page.locator(ui.reset).click();await assertDeclarations(false);
    const before=await nativeSnapshot(),stored=await probe(page,'storage'),nativeResults=await nativeResultHints(),requests=routedRequests.length;
    await page.locator(ui.read).click();assert.equal(await page.locator(ui.read).getAttribute('aria-pressed'),'true');
    await page.locator(ui.operated).click();await assertDeclarations(true);
    assert.match(await page.locator(ui.progress).textContent(),/声明|指引/u);
    assert.deepEqual(await nativeResultHints(),nativeResults);
    await choose('shopify','5b');await assertDeclarations(false);
    await choose('shopify','5a');await assertDeclarations(true);
    await page.locator(ui.reset).click();await assertDeclarations(false);
    assert.deepEqual(await nativeSnapshot(),before);
    assert.deepEqual(await probe(page,'storage'),stored);
    assert.equal(routedRequests.length,requests,'Guide declarations must not create network requests');
    assert.equal(before.identity,true);assert.equal(before.textIdentity,true);
    assert.equal(before.businessClicks+before.businessInputs+before.businessChanges+before.submits+before.sends+before.aiInputs,0);
    return 'Original checkbox, controls, node identities, attributes, drafts, business/AI event counts and both stores are unchanged';
  });
  await check('Route changes, pagehide and reload clear declarations; controls and original Text keep their separate behavior',async()=>{
    await choose('sales-refunds','6c');await page.locator(ui.read).click();await page.locator(ui.operated).click();await assertDeclarations(true);
    await page.evaluate(()=>history.pushState({},'',location.pathname+'?synthetic-context=next'));
    await assertDeclarations(false);
    await page.locator(ui.read).click();await page.locator(ui.operated).click();await assertDeclarations(true);
    await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));await assertDeclarations(false);
    await page.locator(ui.read).click();await page.locator(ui.operated).click();await assertDeclarations(true);
    await probe(page,'settings',{enabled:false,aiEnabled:true});
    await page.locator('.fixture-static').filter({hasText:source}).waitFor();
    await page.reload();await page.locator('#impact-cn-assistant').waitFor();
    assert.equal((await probe(page)).enabled,false);assert.equal((await probe(page)).aiEnabled,true);
    await openGuide();await choose('sales-refunds','6c');await assertDeclarations(false);
    assert.equal(await page.locator('.fixture-static').innerText(),source);
    await probe(page,'settings',{enabled:true,aiEnabled:false});await page.locator('.fixture-static').filter({hasText:target}).waitFor();
    assert((await nativeSnapshot()).textIdentity);
    return 'Declarations never cross context/reload while the two existing settings persist and native Text restores';
  });
  await check('Stale guide step actions stop at a synchronous route context reset',async()=>{
    const cases=[
      ['read','pushState',false],['operated','replaceState',true],['next','pushState',true],['locate','replaceState',false],
      ['previous','replaceState',true],['card','pushState',false],['step','replaceState',false],['issue','pushState',true]
    ], failures=[];
    for(const [action,method,changePath] of cases) {
      await openTop();await openGuide();await choose('sales-refunds','6c');
      await page.locator(ui.read).click();await page.locator(ui.operated).click();await assertDeclarations(true);
      const before=await nativeSnapshot(),stored=await probe(page,'storage'),nativeResults=await nativeResultHints(),requests=routedRequests.length;
      const observed=await page.evaluate(({ui,action,method,changePath,topPath})=>{
        const originalDocument=document,fixture=window.__onboardingFixture,node=document.querySelector(ui[action]);
        const oldStep=document.querySelector(ui.section).dataset.impactCnGuideStepId;
        if(action==='card')node.value='shopify';
        if(action==='step')node.value='6a';
        if(action==='issue')node.selectedIndex=Math.min(1,node.options.length-1);
        // Keep route mutation and the old event in one task, ahead of observers/timers.
        history[method]({},'',(changePath?topPath+'gc01-'+action:location.pathname)+'?gc01='+action);
        if(['card','step','issue'].includes(action))node.dispatchEvent(new Event('change',{bubbles:true}));else node.click();
        return {
          sameDocument:document===originalDocument&&fixture===window.__onboardingFixture,oldStep,
          step:document.querySelector(ui.section).dataset.impactCnGuideStepId,
          read:document.querySelector(ui.read).getAttribute('aria-pressed'),operated:document.querySelector(ui.operated).getAttribute('aria-pressed'),
          requested:document.querySelector(ui.locate).getAttribute('aria-pressed'),pointers:document.querySelectorAll(ui.pointer).length
        };
      },{ui,action,method,changePath,topPath});
      const expected={sameDocument:true,oldStep:'6c',step:'5a',read:'false',operated:'false',requested:'false',pointers:0};
      try {assert.deepEqual(observed,expected);}catch {failures.push({action,method,changePath,observed});}
      assert.deepEqual(await nativeResultHints(),nativeResults);
      assert.deepEqual(await nativeSnapshot(),before);assert.deepEqual(await probe(page,'storage'),stored);
      assert.equal(routedRequests.length,requests,'A stale guide event must not create requests');
    }
    assert.deepEqual(failures,[],'Stale action failures: '+JSON.stringify(failures));
    return 'Eight old step events stop after synchronous pathname/search resets; read/operation remain clear, next stays on 5a and locate stays inactive, with no native/AI/storage/network side effects';
  });
  await check('Same-context guide actions and explicit open close reset retain their behavior',async()=>{
    await openTop();await openGuide();await choose('shopify','5a');
    const before=await nativeSnapshot(),stored=await probe(page,'storage'),nativeResults=await nativeResultHints(),requests=routedRequests.length;
    await page.locator(ui.read).click();await page.locator(ui.operated).click();await assertDeclarations(true);
    await page.locator(ui.next).click();assert.equal(await page.locator(ui.step).inputValue(),'5b');await assertDeclarations(false);
    await page.locator(ui.previous).click();assert.equal(await page.locator(ui.step).inputValue(),'5a');await assertDeclarations(true);
    await choose('sales-refunds','6c');
    const issue=guidance.guides.find(guide=>guide.id==='sales-refunds').steps.find(step=>step.id==='6c').issues[1];
    await page.locator(ui.issue).selectOption(issue.id);assert.equal(await page.locator(ui.help).textContent(),issue.help);
    await choose('shopify','5a');await page.locator(ui.locate).click();await page.locator(ui.pointer).waitFor();
    await assertPointerAt(page,'.check-item:has(#fixture-entry-5a)');await page.locator(ui.locate).click();await noPointer();
    for(const action of ['open','back','reset']) {
      await choose('sales-refunds','6c');await page.locator(ui.read).click();await page.locator(ui.operated).click();
      if(action==='open')await page.locator(ui.back).click();
      const observed=await page.evaluate(({ui,action})=>{
        const node=document.querySelector(ui[action]);
        history.replaceState({},'',location.pathname+'?gc01-explicit='+action);
        node.click();
        return {hidden:document.querySelector(ui.section).hidden,expanded:document.querySelector(ui.open).getAttribute('aria-expanded')};
      },{ui,action});
      assert.deepEqual(observed,{hidden:action==='back',expanded:String(action!=='back')});
      await openGuide();assert.equal(await page.locator(ui.step).inputValue(),'5a');await assertDeclarations(false);await noPointer();
    }
    await choose('sales-refunds','6c');await page.locator(ui.read).click();await page.locator(ui.operated).click();
    await page.locator(ui.reset).click();assert.equal(await page.locator(ui.step).inputValue(),'5a');await assertDeclarations(false);
    assert.deepEqual(await nativeResultHints(),nativeResults);
    assert.deepEqual(await nativeSnapshot(),before);assert.deepEqual(await probe(page,'storage'),stored);
    assert.equal(routedRequests.length,requests,'Guide controls must not create requests');
    return 'Current-context declarations, previous/next, card/substep, issue and locate still work; open/back/explicit reset also remain usable during a context change without native/AI/storage/network side effects';
  });
  await check('A supported native Checklist child frame translates without another assistant or guide',async()=>{
    await page.locator('#screen-outer-div').evaluate((slot,url)=>{
      const frame=document.createElement('iframe');frame.id='iframe';frame.name='screenIframe';frame.className='checklist-iframe';frame.src=url;slot.replaceChildren(frame);
    },'https://demo.impact.com'+nativePath+'?synthetic-frame=1');
    const frame=page.locator('#screen-outer-div > iframe').contentFrame();
    await frame.locator('.fixture-static').filter({hasText:target}).waitFor();
    assert.equal(await frame.locator('#impact-cn-assistant,.impact-cn-guide,[data-impact-cn-guide-open]').count(),0);
    assert.equal(await page.locator('#impact-cn-assistant').count(),1);
    await probe(page,'settings',{enabled:false,aiEnabled:false});await frame.locator('.fixture-static').filter({hasText:source}).waitFor();
    const snapshot=await nativeSnapshot(frame);assert(snapshot.identity&&snapshot.textIdentity);assert.equal(snapshot.checked,false);
    return 'Existing all-frame translation remains independent; child document owns no guide UI';
  });
  await check('Short instructions and folded explanations point to original navigation without intercepting native actions',async()=>{
    await page.setViewportSize({width:1280,height:900});await openTop();await openGuide();await choose('shopify','5a');
    assert.equal(await page.locator(ui.explanation).evaluate(node=>node.open),false);
    assert(await page.locator(ui.explanation+' .impact-cn-guide-fulltext').isHidden());
    await page.locator(ui.explanation+' > summary').click();
    const explanation=await page.locator(ui.explanation).innerText();
    assert(guidance.guides[0].steps[0].details.every(text=>explanation.includes(text)));
    await page.locator(ui.explanation+' > summary').click();
    for(const enabled of [false,true]) {
      await probe(page,'settings',{enabled,aiEnabled:false});await openGuide();await choose('shopify','5a');
      const targetBefore=await rememberTarget(page,'#fixture-entry-5a'),before=await nativeSnapshot(),stored=await probe(page,'storage'),requests=routedRequests.length;
      await page.locator(ui.locate).click();await page.locator(ui.pointer).waitFor();
      await assertPointerAt(page,'.check-item:has(#fixture-entry-5a)');
      assert(await page.locator(ui.pointer).evaluate(node=>[...node.querySelectorAll('*')].every(child=>getComputedStyle(child).pointerEvents==='none')));
      await assertTargetPreserved(page,'#fixture-entry-5a',targetBefore);
      assert.deepEqual(await nativeSnapshot(),before);assert.deepEqual(await probe(page,'storage'),stored);assert.equal(routedRequests.length,requests);
      assert.equal(await page.evaluate(()=>window.__onboardingFixture.entryClicks),0);
      await page.locator(ui.locate).click();await noPointer();
    }
    await showNavigationArrow();
    await page.locator('#fixture-entry-5a').click();assert.equal(await page.evaluate(()=>window.__onboardingFixture.entryClicks),1);
    const folder=reportFolder;mkdirSync(folder,{recursive:true});
    pointerScreenshotPath=path.join(folder,'guide-arrow-'+manifest.version+'-'+new Date().toISOString().replace(/[:.]/gu,'-')+'.png');
    await page.screenshot({path:pointerScreenshotPath,style:'#fixture-business-form,#ask-impact-shadow-host{filter:opacity(0) !important}'});
    await page.locator(ui.locate).click();await noPointer();
    return 'Short action stays visible; full explanation starts folded; English/Chinese navigation retains Text, rows, attributes and original click behavior';
  });
  await check('A collapsed native group is pointed out before its hidden child, while real clipping still asks to scroll',async()=>{
    for(const enabled of [false,true]) {
      await openTop();await probe(page,'settings',{enabled,aiEnabled:false});await openGuide();await choose('shopify','5b');
      await page.locator('#fixture-group-technical').evaluate(group=>{for(const panel of group.querySelectorAll(':scope > .panel'))panel.classList.remove('expanded');});
      const heading='#fixture-heading-technical',beforeTarget=await rememberTarget(page,heading);
      const before=await nativeSnapshot(),stored=await probe(page,'storage');
      await page.locator(ui.locate).click();await page.locator(ui.pointer).waitFor();
      await assertPointerAt(page,heading,'group');
      assert.match(await page.locator(ui.locateStatus).innerText(),/先展开/u);
      assert.equal(await page.evaluate(()=>window.__onboardingFixture.groupClicks),0,'The assistant must not expand native groups');
      assert.deepEqual(await nativeSnapshot(),before);assert.deepEqual(await probe(page,'storage'),stored);
      await assertTargetPreserved(page,heading,beforeTarget);
      await page.locator(heading).click();
      await page.waitForFunction(selector=>document.querySelector(selector)?.dataset.targetKind==='navigation',ui.pointer);
      await assertPointerAt(page,'.check-item:has(#fixture-entry-5b)');
      assert.equal(await page.evaluate(()=>window.__onboardingFixture.groupClicks),1,'Only the explicit native heading click expands the fixture');
      assert.deepEqual(await nativeSnapshot(),before);assert.deepEqual(await probe(page,'storage'),stored);
      await page.evaluate(()=>window.scrollTo(0,260));await noPointer(true);
      assert.match(await page.locator(ui.locateStatus).innerText(),/滚/u);
      assert.doesNotMatch(await page.locator(ui.locateStatus).innerText(),/先展开/u);
      await page.evaluate(()=>window.scrollTo(0,0));await page.locator(ui.pointer).waitFor();
      await assertPointerAt(page,'.check-item:has(#fixture-entry-5b)');
      await page.locator(ui.locate).click();await noPointer();
    }
    return 'The exact same native accordion targets its heading in English and Chinese without clicking it; a user expansion advances the active pointer to the child and viewport clipping remains distinct';
  });
  await check('Canceling, going back or forward and resetting prevent a collapsed-group request from redrawing',async()=>{
    for(const exit of ['cancel','previous','next','reset']) {
      await openTop();await openGuide();await choose('shopify','5b');
      await page.locator('#fixture-group-technical').evaluate(group=>{for(const panel of group.querySelectorAll(':scope > .panel'))panel.classList.remove('expanded');});
      const before=await nativeSnapshot(),stored=await probe(page,'storage');
      await page.locator(ui.issue).selectOption('5b-domain');
      await page.locator(ui.explanation+' > summary').click();
      await page.locator(ui.locate).click();await page.locator(ui.pointer).waitFor();
      await assertPointerAt(page,'#fixture-heading-technical','group');
      const control={cancel:ui.locate,previous:ui.previous,next:ui.next,reset:ui.reset}[exit];
      await page.locator(control).click();await noPointer();
      if(exit!=='cancel') {
        assert.equal(await page.locator(ui.step).inputValue(),exit==='next'?'5c':'5a');
        assert.equal(await page.locator(ui.issue).inputValue(),'');
        assert.equal(await page.locator(ui.explanation).evaluate(node=>node.open),false);
        await assertDeclarations(false);
      }
      if(exit==='reset') assert.match(await page.locator(ui.position).innerText(),/1\s*\/\s*8/u);
      await page.locator('#fixture-heading-technical').click();await page.waitForTimeout(1250);
      assert.equal(await page.locator(ui.pointer).count(),0,'Canceled '+exit+' request must not redraw when the group is later expanded');
      assert.equal(await page.locator(ui.locate).getAttribute('aria-pressed'),'false');
      assert.deepEqual(await nativeSnapshot(),before);assert.deepEqual(await probe(page,'storage'),stored);
    }
    return 'Group expansion cannot resume canceled, previous/next or reset requests; step changes clear the old failure/detail view and reset returns to item 1 without native/business/storage effects';
  });
  await check('Missing, ambiguous, clipped and unknown targets show no misleading pointer and context exits clear it',async()=>{
    await openTop();await openGuide();await choose('shopify','5c');
    // A supported target whose fixed entry is not yet mounted remains a wait.
    await page.locator('#fixture-entry-5c').evaluate(node=>node.remove());
    await page.locator(ui.locate).click();await noPointer(true);
    assert.match(await page.locator(ui.locateStatus).innerText(),/等待|加载|稍后|没有|看不到/u);
    await page.locator(ui.locate).click();await noPointer();
    await choose('shopify','5a');
    await page.locator('#fixture-entry-5a').evaluate(node=>node.style.display='none');await page.locator(ui.locate).click();await noPointer(true);
    await page.locator(ui.locate).click();await noPointer();
    await page.locator('#fixture-entry-5a').evaluate(node=>{node.style.removeProperty('display');const clone=node.cloneNode(true);clone.id='fixture-ambiguous';node.parentElement.append(clone);});
    await page.locator(ui.locate).click();await noPointer();await page.locator('#fixture-ambiguous').evaluate(node=>node.remove());
    await page.locator('.fixture-native-nav').evaluate(node=>{node.style.height='70px';node.style.overflow='auto';});
    await showNavigationArrow();
    await page.locator('.fixture-native-nav').evaluate(node=>node.scrollTop=48);await noPointer(true);
    await page.locator(ui.locate).click();await noPointer();
    await page.locator('.fixture-native-nav').evaluate(node=>{node.scrollTop=0;node.style.height='';node.style.overflow='';});
    await showNavigationArrow();await page.locator(ui.step).selectOption('5b');await noPointer();
    await showNavigationArrow();await page.locator(ui.card).selectOption('sales-refunds');await noPointer();
    await showNavigationArrow();await page.locator(ui.back).click();await noPointer();
    await showNavigationArrow();await page.locator('.impact-cn-launcher').click();await noPointer();
    await showNavigationArrow();await page.locator(ui.card).focus();await page.keyboard.press('Escape');await noPointer();
    await showNavigationArrow();await page.evaluate(()=>history.pushState({},'',location.pathname+'?synthetic-arrow-context=next'));await noPointer();
    await showNavigationArrow();await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));await noPointer();
    await openGuide();await choose('shopify','5a');await page.evaluate(()=>history.pushState({},'','/secure/advertiser/engage/aview.ihtml'));
    await page.locator(ui.locate).click();await noPointer();assert.match(await page.locator(ui.locateStatus).innerText(),/没有|看不到/u);
    await page.evaluate(path=>history.pushState({},'',path+'onboarding-fixture'),topPath);await showNavigationArrow();
    await probe(page,'destroy');assert.equal(await page.locator(ui.pointer).count(),0);
    return 'Absent/clipped fixed targets wait without a pointer; duplicate/unsupported targets cancel; step/card/back/close/Escape/route/pagehide/destroy remove the pointer';
  });
  await check('Pointer geometry follows scrolling and resize and same-origin controls keep child documents free of new assistants',async()=>{
    await openTop();await openGuide();const initial=await showNavigationArrow();
    await page.evaluate(()=>window.scrollTo(0,30));
    await page.waitForFunction(({selector,y})=>Math.abs(Number(document.querySelector(selector)?.dataset.targetY)-y)>20,{selector:ui.pointer,y:initial.y});
    await assertPointerAt(page,'.check-item:has(#fixture-entry-5a)');
    await page.setViewportSize({width:1000,height:900});
    await page.waitForFunction(selector=>document.querySelector(selector+' svg')?.getAttribute('viewBox')==='0 0 1000 900',ui.pointer);
    await assertPointerAt(page,'.check-item:has(#fixture-entry-5a)');
    await page.setViewportSize({width:1280,height:900});await page.evaluate(()=>window.scrollTo(0,0));
    await page.locator(ui.locate).click();await noPointer();
    const website=await mountNativeFrame();await choose('shopify','5b');await page.locator(ui.locate).click();await page.locator(ui.pointer).waitFor();
    const control='field-label-typography.form-section-header';const websiteBefore=await rememberTarget(website,control);
    const before=await assertPointerAt(website,control,'control');
    await website.locator('body').evaluate(()=>window.scrollTo(0,20));
    await page.waitForFunction(({selector,y})=>Math.abs(Number(document.querySelector(selector)?.dataset.targetY)-y)>10,{selector:ui.pointer,y:before.y});
    await assertPointerAt(website,control,'control');await assertTargetPreserved(website,control,websiteBefore);
    assert.equal(await website.locator('#impact-cn-assistant,.impact-cn-guide,'+ui.pointer).count(),0);
    await page.locator(ui.locate).click();await noPointer();
    const shopify=await mountNativeFrame(shopifyPath);await choose('shopify','5d');
    const button='.outer-container > button#button.get-started-btn',shopifyBefore=await rememberTarget(shopify,button);
    await page.locator(ui.locate).click();await page.locator(ui.pointer).waitFor();await assertPointerAt(shopify,button,'control');
    await assertTargetPreserved(shopify,button,shopifyBefore);assert.equal(await shopify.locator('body').evaluate(()=>window.__onboardingFixture.entryClicks),0);
    await shopify.locator(button).click();assert.equal(await shopify.locator('body').evaluate(()=>window.__onboardingFixture.entryClicks),1);
    assert.equal(await shopify.locator('#impact-cn-assistant,.impact-cn-guide,'+ui.pointer).count(),0);
    await page.locator(ui.locate).click();await noPointer();
    const cross=await mountNativeFrame(config.localization.checklist.assetPaths[1],'ui.assets.impact.com');
    await choose('sales-refunds','6a');await page.locator(ui.locate).click();await page.locator(ui.pointer).waitFor();
    await assertPointerAt(cross,'#fixture-validation-open','control');
    assert.equal(await cross.locator('#impact-cn-assistant,.impact-cn-guide,'+ui.pointer).count(),0);
    await page.locator(ui.locate).click();await noPointer();
    await page.locator('#screen-outer-div').evaluate(node=>node.replaceChildren());
    return 'Parent and child scroll coordinates update; resize recomputes SVG; verified same-origin controls and the authorized cross-origin validation open control preserve native events without child assistants';
  });
  await check('Validation help closes manually before exact open and checking controls are located',async()=>{
    const closeSelector=".onc-instructions-drawer button.side-modal-header-close-btn[data-testid='uicl-side-modal-close-button'][type='button']";
    for(const [id,selector] of [['6a','#fixture-validation-open'],['6c','#fixture-validation-tests']]) {
      await openTop();await openGuide();
      const validation=await mountNativeFrame(config.guidance.targets['6a'].frameRegion.path,'ui.assets.impact.com');
      await journeyScene('validation','idle');await choose('sales-refunds',id);
      const targetBefore=await rememberTarget(validation,selector),before=await nativeSnapshot(),childBefore=await nativeSnapshot(validation),stored=await probe(page,'storage');
      await mountValidationHelp();await page.locator(ui.locate).click();await page.locator(ui.pointer).waitFor();
      await assertPointerAt(page,closeSelector,'control');
      assert.match(await page.locator(ui.locateStatus).innerText(),/关闭.*帮助/u);
      assert.equal(await page.evaluate(()=>window.__onboardingHelpClicks),0,'Positioning must never close the native help itself');
      await page.locator(closeSelector).click();
      await waitPointerAt(validation,selector);
      assert.equal(await page.locator('.onc-instructions-drawer').evaluate(drawer=>drawer.children.length),0);
      assert.equal(await page.evaluate(()=>window.__onboardingHelpClicks),1);
      await assertTargetPreserved(validation,selector,targetBefore);
      assert.deepEqual(await validation.locator('body').evaluate(()=>window.__onboardingValidationClicks),{open:0,tests:0});
      assert.deepEqual(await nativeSnapshot(),before);assert.deepEqual(await nativeSnapshot(validation),childBefore);assert.deepEqual(await probe(page,'storage'),stored);
      assert.equal(await validation.locator('#impact-cn-assistant,.impact-cn-guide,'+ui.pointer).count(),0);
      await mountValidationHelp();await waitPointerAt(page,closeSelector);
      await page.locator(ui.locate).click();await noPointer();
      await page.locator(closeSelector).click();await page.waitForTimeout(1250);await noPointer();
    }
    return 'For merged order tracking and order checking, a single request points to the observed parent help close control, waits for an explicit manual close, then uses the real worker/frame bridge for the matching child div; cancel prevents later revival and neither child action is clicked';
  });
  await check('A zero-height validation help wrapper still prioritizes its visible fixed close control',async()=>{
    const closeSelector=".onc-instructions-drawer button.side-modal-header-close-btn[data-testid='uicl-side-modal-close-button'][type='button']";
    for(const [id,selector] of [['6a','#fixture-validation-open'],['6c','#fixture-validation-tests']]) {
      await openTop();await openGuide();
      const validation=await mountNativeFrame(config.guidance.targets['6a'].frameRegion.path,'ui.assets.impact.com');
      await journeyScene('validation','idle');await choose('sales-refunds',id);
      const targetBefore=await rememberTarget(validation,selector),before=await nativeSnapshot(),childBefore=await nativeSnapshot(validation),stored=await probe(page,'storage');
      await mountValidationHelp({zeroHeightWrapper:true});
      const geometry=await page.locator('.onc-instructions-drawer').evaluate(drawer=>{
        const close=drawer.querySelector('button'),wrapper=drawer.getBoundingClientRect(),rect=close.getBoundingClientRect();
        return {children:drawer.children.length,wrapperHeight:wrapper.height,closeWidth:rect.width,closeHeight:rect.height,closePosition:getComputedStyle(close).position};
      });
      assert.deepEqual(geometry,{children:2,wrapperHeight:0,closeWidth:38,closeHeight:38,closePosition:'fixed'});
      await page.locator(ui.locate).click();await waitPointerAt(page,closeSelector);
      assert.match(await page.locator(ui.locateStatus).innerText(),/关闭.*帮助/u);
      assert.equal(await page.evaluate(()=>window.__onboardingHelpClicks),0);
      // Visibility alone does not authorize a covered or ambiguous close control.
      await page.locator(closeSelector).evaluate(close=>{
        const cover=document.createElement('div');cover.id='fixture-close-cover';
        Object.assign(cover.style,{position:'fixed',left:'430px',top:'360px',width:'38px',height:'38px',zIndex:'102'});
        close.closest('.onc-instructions-drawer').append(cover);
      });
      await noPointer(true);await page.locator('#fixture-close-cover').evaluate(node=>node.remove());await waitPointerAt(page,closeSelector);
      await page.locator(closeSelector).evaluate(close=>{const duplicate=close.cloneNode(true);duplicate.id='fixture-duplicate-close';close.parentElement.append(duplicate);});
      await noPointer(true);await page.locator('#fixture-duplicate-close').evaluate(node=>node.remove());await waitPointerAt(page,closeSelector);
      await page.locator(closeSelector).evaluate(close=>close.style.visibility='hidden');await noPointer(true);
      await page.locator(closeSelector).evaluate(close=>close.style.visibility='visible');await waitPointerAt(page,closeSelector);
      await page.locator(closeSelector).click();await waitPointerAt(validation,selector);
      assert.equal(await page.locator('.onc-instructions-drawer').evaluate(drawer=>drawer.children.length),0);
      assert.equal(await page.evaluate(()=>window.__onboardingHelpClicks),1);
      await assertTargetPreserved(validation,selector,targetBefore);
      assert.deepEqual(await validation.locator('body').evaluate(()=>window.__onboardingValidationClicks),{open:0,tests:0});
      assert.deepEqual(await nativeSnapshot(),before);assert.deepEqual(await nativeSnapshot(validation),childBefore);assert.deepEqual(await probe(page,'storage'),stored);
      await page.locator(ui.locate).click();await noPointer();
    }
    return 'The observed empty-height wrapper and fixed 38x38 close control reproduce the live layout for tracking and checking. Positioning prioritizes that unique visible close, still rejects covered, duplicate and hidden controls, then follows manual close to the exact child target without native business actions or state changes';
  });
  await check('Validation exact controls reject duplicate frames and wrong asset paths',async()=>{
    await openTop();await openGuide();await choose('sales-refunds','6a');
    await page.locator(ui.locate).click();await page.locator(ui.pointer).waitFor();
    await assertPointerAt(page,'.check-item:has(#fixture-entry-6a)');
    const stored=await probe(page,'storage'),before=await nativeSnapshot();
    const validation=await mountNativeFrame(config.guidance.targets['6a'].frameRegion.path,'ui.assets.impact.com');
    await page.locator(ui.pointer).waitFor();await assertPointerAt(validation,'#fixture-validation-open','control');
    assert.match(await page.locator(ui.locateStatus).innerText(),/打开测试工具/u);
    assert.equal(await validation.locator('#impact-cn-assistant,.impact-cn-guide,'+ui.pointer).count(),0);
    assert.deepEqual(await nativeSnapshot(),before);assert.deepEqual(await probe(page,'storage'),stored);
    await page.locator(ui.locate).click();await noPointer();
    await page.locator('#screen-outer-div > iframe').evaluate(frame=>frame.parentElement.append(frame.cloneNode()));
    await page.locator(ui.locate).click();await noPointer();
    assert.match(await page.locator(ui.locateStatus).innerText(),/没有|看不到/u);
    await page.locator('#screen-outer-div').evaluate(node=>node.replaceChildren());
    await mountNativeFrame('/onboarding-ui/checklist-assets/production/operator-json/instructions.html','ui.assets.impact.com');
    await page.locator(ui.locate).click();await page.locator(ui.pointer).waitFor();
    await assertPointerAt(page,'.check-item:has(#fixture-entry-6a)');
    return 'One request follows the known validation iframe to the precise open control through the authorized bridge; native state/storage stay unchanged, duplicate frames are rejected and a different asset path cannot imply arrival';
  });
  await check('Tool scrolling locates the original start and checking controls without clicking either',async()=>{
    for(const pathname of [toolPath,secondToolPath]) {
      await page.goto('https://demo.impact.com'+pathname+'?synthetic-tool-controls=1');
      await page.locator('#impact-cn-assistant').waitFor();await probe(page,'settings',{enabled:true,aiEnabled:true});await openGuide();
      const before=await nativeSnapshot(),stored=await probe(page,'storage');
      const startBefore=await rememberTarget(page,'#fixture-tool-start');
      await page.locator(ui.locate).click();await noPointer(true);
      assert.match(await page.locator(ui.locateStatus).innerText(),/滚|看不到|当前/u);
      assert.equal(await page.evaluate(()=>scrollY),0,'The assistant asks for scrolling instead of moving the native page');
      await page.locator('#fixture-tool-start').evaluate(node=>node.scrollIntoView({block:'center'}));
      await waitPointerAt(page,'#fixture-tool-start');
      assert.match(await page.locator(ui.locateStatus).innerText(),/测试链接.*下单/u);
      await assertTargetPreserved(page,'#fixture-tool-start',startBefore);
      await choose('sales-refunds','6c');const checkingBefore=await rememberTarget(page,'#fixture-tool-tests');
      await page.locator(ui.locate).click();await waitPointerAt(page,'#fixture-tool-tests');
      assert.match(await page.locator(ui.locateStatus).innerText(),/核对.*测试订单/u);
      await assertTargetPreserved(page,'#fixture-tool-tests',checkingBefore);
      assert.deepEqual(await page.evaluate(()=>window.__onboardingToolClicks),{start:0,tests:0});
      await assertDeclarations(false);
      await page.locator(ui.locate).click();await noPointer();
      await page.locator('#fixture-tool-tests').evaluate(node=>node.disabled=true);await page.locator(ui.locate).click();await noPointer(true);
      await page.locator(ui.locate).click();await noPointer();
      await page.locator('#fixture-tool-tests').evaluate(node=>node.disabled=false);
      await page.waitForTimeout(1250);await noPointer();
      assert.deepEqual(await nativeSnapshot(),before);assert.deepEqual(await probe(page,'storage'),stored);
      assert.deepEqual(await page.evaluate(()=>window.__onboardingToolClicks),{start:0,tests:0});
    }
    return 'Both observed tool routes wait for explicit native scrolling, locate the observed start/check buttons with original nodes, attributes and events intact, reject a disabled control and never click an order link or declare success';
  });
  await check('Tool and test list routes select their merged operation without implying completion',async()=>{
    for(const {pathname,scene,step} of testingRoutes) {
      await page.goto('https://demo.impact.com'+pathname+'?synthetic-tool=1');
      await page.locator('#impact-cn-assistant').waitFor();await probe(page,'settings',{enabled:true,aiEnabled:true});
      const stored=await probe(page,'storage'),before=await nativeSnapshot();
      await openGuide();assert.equal(await page.locator(ui.step).inputValue(),step);
      await journeyScene(scene,'idle');
      assert.match(await page.locator(ui.section).innerText(),step==='6a'?/新窗口.*测试订单/u:/核对测试订单/u);
      await assertDeclarations(false);
      await page.locator(ui.locate).click();
      assert.equal(await page.locator(ui.pointer).count(),0,'A generic synthetic form cannot authorize a precise real testing control');
      await assertDeclarations(false);
      assert.deepEqual(await nativeSnapshot(),before);assert.deepEqual(await probe(page,'storage'),stored);
    }
    const transitions=[
      [null,toolPath,'pushState','read'],[null,testsPath,'replaceState','next'],
      [toolPath,testsPath,'pushState','operated'],[testsPath,toolPath,'replaceState','locate'],
      [secondToolPath,testsPath,'pushState','previous'],[testsPath,secondToolPath,'replaceState','read']
    ],failures=[];
    for(const [from,pathname,method,action] of transitions) {
      if(from) {
        await page.goto('https://demo.impact.com'+from+'?synthetic-tool=from');
        await page.locator('#impact-cn-assistant').waitFor();await probe(page,'settings',{enabled:true,aiEnabled:true});
      }else await openTop();
      await openGuide();await choose('sales-refunds','6c');
      await page.locator(ui.read).click();await page.locator(ui.operated).click();await assertDeclarations(true);
      const before=await nativeSnapshot(),stored=await probe(page,'storage'),requests=routedRequests.length;
      const observed=await page.evaluate(({ui,pathname,method,action,sharedPath,toolMarkers})=>{
        const oldDocument=document,fixture=window.__onboardingFixture,node=document.querySelector(ui[action]);
        if(pathname===sharedPath) {
          let slot=document.querySelector('#fixture-test-route-markers');
          if(!slot){slot=document.createElement('div');slot.id='fixture-test-route-markers';document.body.append(slot);}
          slot.innerHTML=toolMarkers;
        }
        history[method]({},'',pathname+'?synthetic-tool=entered');node.click();
        return {sameDocument:document===oldDocument&&fixture===window.__onboardingFixture,
          step:document.querySelector(ui.step).value,read:document.querySelector(ui.read).getAttribute('aria-pressed'),
          operated:document.querySelector(ui.operated).getAttribute('aria-pressed'),
          requested:document.querySelector(ui.locate).getAttribute('aria-pressed'),pointers:document.querySelectorAll(ui.pointer).length};
      },{ui,pathname,method,action,sharedPath:secondToolPath,toolMarkers:testActionsToolMarkers});
      const route=testingRoutes.find(route=>route.pathname===pathname);
      const expected={sameDocument:true,step:route.step,read:'false',operated:'false',requested:'false',pointers:0};
      try {assert.deepEqual(observed,expected);}catch {failures.push({from,pathname,method,action,observed});}
      if(observed.step===route.step) {
        await journeyScene(route.scene,'idle');
        assert.match(await page.locator(ui.section).innerText(),route.step==='6a'?/新窗口.*测试订单/u:/核对测试订单/u);
      }
      assert.deepEqual(await nativeSnapshot(),before);assert.deepEqual(await probe(page,'storage'),stored);
      assert.equal(routedRequests.length,requests,'Entering a tool route must not create requests');
    }
    assert.deepEqual(failures,[],'Tool route entry failures: '+JSON.stringify(failures));
    await openTop();await openGuide();assert.equal(await page.locator(ui.step).inputValue(),'5a');
    return 'The exact tool route selects 6a and the test list route selects 6c on initial and same-document entry; stale events stop and declarations clear without precise controls being fabricated in a generic form, native clicks or business success';
  });
  await check('Known tool route resets keep explicit and uncertain contexts at the first step',async()=>{
    const openedPaths=testingRoutes.map(route=>route.pathname);
    const cases=[
      ['query',openedPaths[0],false],['unknown',topPath+'gc02-unknown',false],['suffix',openedPaths[0]+'/extra',false],
      ['reset',openedPaths[0],false],['pagehide',openedPaths[1],false],
      ['reset',openedPaths[1],true],['pagehide',openedPaths[0],true],
      ['reset',testsPath,true],['pagehide',testsPath,false]
    ];
    for(const [action,pathname,pendingEntry] of cases) {
      if(pendingEntry)await openTop();else {
        await page.goto('https://demo.impact.com'+(action==='pagehide'?openedPaths[1]:openedPaths[0])+'?gc02-reset=before');
        await page.locator('#impact-cn-assistant').waitFor();await probe(page,'settings',{enabled:true,aiEnabled:true});
      }
      await openGuide();await choose('sales-refunds','6c');
      await page.locator(ui.read).click();await page.locator(ui.operated).click();await assertDeclarations(true);
      const before=await nativeSnapshot(),stored=await probe(page,'storage'),requests=routedRequests.length;
      const observed=await page.evaluate(({ui,action,pathname,pendingEntry})=>{
        if(pendingEntry||!['reset','pagehide'].includes(action))history.replaceState({},'',pathname+'?gc02-reset='+action);
        if(action==='pagehide')window.dispatchEvent(new Event('pagehide'));
        else document.querySelector(ui[action==='reset'?'reset':'next']).click();
        return {step:document.querySelector(ui.step).value,read:document.querySelector(ui.read).getAttribute('aria-pressed'),
          operated:document.querySelector(ui.operated).getAttribute('aria-pressed'),
          requested:document.querySelector(ui.locate).getAttribute('aria-pressed'),pointers:document.querySelectorAll(ui.pointer).length};
      },{ui,action,pathname,pendingEntry});
      assert.deepEqual(observed,{step:'5a',read:'false',operated:'false',requested:'false',pointers:0},JSON.stringify({action,pendingEntry}));
      // A later route flush must not reinterpret an explicit reset as tool entry.
      await page.evaluate(()=>window.dispatchEvent(new PopStateEvent('popstate')));
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      await page.waitForTimeout(80);
      const afterFlush=await page.evaluate(ui=>({step:document.querySelector(ui.step).value,
        read:document.querySelector(ui.read).getAttribute('aria-pressed'),operated:document.querySelector(ui.operated).getAttribute('aria-pressed'),
        requested:document.querySelector(ui.locate).getAttribute('aria-pressed'),pointers:document.querySelectorAll(ui.pointer).length}),ui);
      assert.deepEqual(afterFlush,observed,JSON.stringify({action,pendingEntry,afterFlush:true}));
      await assertDeclarations(false);await noPointer();
      assert.deepEqual(await nativeSnapshot(),before);assert.deepEqual(await probe(page,'storage'),stored);
      assert.equal(routedRequests.length,requests,'Reset boundaries must not create requests');
    }
    return 'Query-only/unknown/suffix routes, manual reset and pagehide return to 5a; same-task pending tool entry cannot override explicit reset during a later route flush, and no project or completion is inferred';
  });
  await check('Malformed guide data is rejected before guide resources without blocking the assistant',async()=>{
    await openTop();await probe(page,'settings',{enabled:true,aiEnabled:false});
    const stored=await probe(page,'storage'),failures=[];
    for(const [name,fixture] of Object.entries(guidanceCases).filter(([,fixture])=>!fixture.valid)) {
      await page.goto('https://demo.impact.com'+topPath+'onboarding-fixture?guidance-fixture='+name);
      const diagnostic=await probe(page,'guidanceFixture');
      try {
        assert.deepEqual({name:diagnostic.name,readyError:diagnostic.readyError,assistant:diagnostic.assistant,
          guideCreated:diagnostic.guideCreated,guideMounted:diagnostic.guideMounted,
          guideListenersAdded:diagnostic.guideListenersAdded,guideListenersActive:diagnostic.guideListenersActive},
          {name,readyError:null,assistant:1,guideCreated:0,guideMounted:0,guideListenersAdded:0,guideListenersActive:0});
        assert.equal(diagnostic.state.enabled,true);assert.equal(diagnostic.state.aiEnabled,false);
        assert.deepEqual(await probe(page,'storage'),stored);
        await page.locator('.fixture-static').filter({hasText:target}).waitFor();
        const before=await nativeSnapshot(),requests=routedRequests.length;
        let state=await probe(page,'settings',{enabled:false,aiEnabled:true});
        assert.equal(state.enabled,false);assert.equal(state.aiEnabled,true);await page.locator('.fixture-static').filter({hasText:source}).waitFor();
        state=await probe(page,'settings',{enabled:true,aiEnabled:false});
        assert.equal(state.enabled,true);assert.equal(state.aiEnabled,false);await page.locator('.fixture-static').filter({hasText:target}).waitFor();
        assert.deepEqual(await nativeSnapshot(),before);assert.deepEqual(await probe(page,'storage'),stored);
        await probe(page,'destroy');await page.locator('.fixture-static').filter({hasText:source}).waitFor();
        const after=await probe(page,'guidanceFixture');
        assert.equal(after.assistant,0);assert.equal(after.guideMounted,0);assert.equal(after.guideListenersActive,0);
        assert.equal((await nativeSnapshot()).textIdentity,true);assert.equal(routedRequests.length,requests);
      }catch(error) {failures.push({name,error:error.message,diagnostic});}
    }
    assert.deepEqual(failures,[],'Malformed guide fixture failures: '+JSON.stringify(failures));
    await openTop();
    return 'Malformed shape, empty steps, duplicate guide/global step IDs and sparse arrays create no guide nodes/listeners; the full content still mounts, keeps settings independent, restores original Text and destroys cleanly';
  });
  await check('Minimal valid guide data keeps optional collections and URL filtering compatible',async()=>{
    for(const [name,fixture] of Object.entries(guidanceCases).filter(([,fixture])=>fixture.valid)) {
      await page.goto('https://demo.impact.com'+topPath+'onboarding-fixture?guidance-fixture='+name);
      const diagnostic=await probe(page,'guidanceFixture');
      assert.equal(diagnostic.name,name);assert.equal(diagnostic.readyError,null);assert.equal(diagnostic.assistant,1);assert(diagnostic.guideCreated>0);assert(diagnostic.guideListenersActive>0);
      await probe(page,'settings',{enabled:true,aiEnabled:false});await page.locator('.fixture-static').filter({hasText:target}).waitFor();
      const before=await nativeSnapshot(),stored=await probe(page,'storage'),requests=routedRequests.length;
      await openGuide();assert.equal(await page.locator(ui.step).inputValue(),'gc03-step');
      await page.locator(ui.read).click();
      if(name==='valid-information') {
        assert(await page.locator(ui.operated).isHidden()||await page.locator(ui.operated).isDisabled());
        assert(await page.locator(ui.locate).isHidden()||await page.locator(ui.locate).isDisabled());
        await page.locator(ui.operated).evaluate(node=>node.click());
        assert.equal(await page.locator(ui.read).getAttribute('aria-pressed'),'true');
        assert.equal(await page.locator(ui.operated).getAttribute('aria-pressed'),'false');
      } else {await page.locator(ui.operated).click();await assertDeclarations(true);}
      await page.locator(ui.back).click();assert(await page.locator(ui.section).isHidden());
      await openGuide();await page.locator(ui.reset).click();await assertDeclarations(false);
      if(name==='valid-complete') {
        await page.locator(ui.issue).selectOption('synthetic-issue');assert.equal(await page.locator(ui.help).textContent(),'Synthetic recovery');
        assert.deepEqual(await page.locator(ui.section+' a').evaluateAll(nodes=>nodes.map(node=>({href:node.href,target:node.target,rel:node.rel}))),
          [{href:'https://help.impact.com/en/support/home',target:'_blank',rel:'noopener noreferrer'}]);
        assert.equal(await page.locator(ui.section+' .impact-cn-guide-directory li').textContent(),'Synthetic item：Synthetic item purpose');
      }else assert.equal(await page.locator(ui.section+' a').count(),0);
      const state=await probe(page);assert.equal(state.enabled,true);assert.equal(state.aiEnabled,false);
      assert.deepEqual(await nativeSnapshot(),before);assert.deepEqual(await probe(page,'storage'),stored);
      await probe(page,'destroy');await page.locator('.fixture-static').filter({hasText:source}).waitFor();
      const after=await probe(page,'guidanceFixture');assert.equal(after.assistant,0);assert.equal(after.guideMounted,0);assert.equal(after.guideListenersActive,0);
      assert.equal((await nativeSnapshot()).textIdentity,true);assert.equal(routedRequests.length,requests);
    }
    await openTop();
    return 'Minimal, absent/empty optional collections and populated data mount and open/close/reset; empty/unsafe URL strings retain the existing filter, and destroy removes guide listeners while restoring original Text';
  });
  await check('Delayed supported frame targets appear after one request and loading waits cancel permanently',async()=>{
    await page.setViewportSize({width:1280,height:900});await openTop();await openGuide();await choose('shopify','5b');
    const frame=await mountNativeFrame();await pauseFrameTarget(frame);
    const before=await nativeSnapshot(frame),stored=await probe(page,'storage');
    await page.locator(ui.locate).click();await noPointer(true);
    assert.match(await page.locator(ui.locateStatus).innerText(),/等待|加载|稍后/u);
    await resumeFrameTarget(frame);await page.locator(ui.pointer).waitFor();
    await assertPointerAt(frame,'field-label-typography.form-section-header','control');
    assert.deepEqual(await nativeSnapshot(frame),before);assert.deepEqual(await probe(page,'storage'),stored);
    for(const cancel of ['toggle','close','step','destroy']) {
      await openTop();await openGuide();await choose('shopify','5b');
      const pending=await mountNativeFrame();await pauseFrameTarget(pending);
      await page.locator(ui.locate).click();await noPointer(true);
      if(cancel==='toggle') await page.locator(ui.locate).click();
      else if(cancel==='close') await page.locator('.impact-cn-close').click();
      else if(cancel==='step') await page.locator(ui.step).selectOption('5c');
      else await probe(page,'destroy');
      await resumeFrameTarget(pending);await page.waitForTimeout(1250);
      assert.equal(await page.locator(ui.pointer).count(),0,'Canceled '+cancel+' wait must not redraw after delayed content arrives');
      if(cancel!=='destroy') assert.equal(await page.locator(ui.locate).getAttribute('aria-pressed'),'false');
      else assert.equal(await page.locator('#impact-cn-assistant').count(),0);
    }
    await openTop();await openGuide();
    return 'One request waits for the known same-origin Text; cancel, close, step change and destroy prevent delayed redraw without native/storage effects';
  });
  await check('Native overlays, child covers, assistant covers and iframe clipping pause and resume only an active request',async()=>{
    for(const obstruction of ['top','child','assistant','clip']) {
      await page.setViewportSize({width:1280,height:900});await openTop();await openGuide();await choose('shopify','5b');
      const frame=await mountNativeFrame();await page.locator(ui.locate).click();await page.locator(ui.pointer).waitFor();
      const selector='field-label-typography.form-section-header';
      const before=await nativeSnapshot(frame),stored=await probe(page,'storage');
      const cover=async()=>{
        if(obstruction==='top') {
          const box=await frame.locator(selector).boundingBox();
          await page.evaluate(rect=>{
            const overlay=document.createElement('div');overlay.id='fixture-obstruction';overlay.className='side-modal-close-overlay';
            Object.assign(overlay.style,{position:'fixed',left:rect.x+'px',top:rect.y+'px',width:rect.width+'px',height:rect.height+'px',background:'#fff',zIndex:'100'});
            document.body.append(overlay);
          },box);
        } else if(obstruction==='child') {
          await frame.locator(selector).evaluate(node=>{
            const rect=node.getBoundingClientRect(),overlay=document.createElement('div');overlay.id='fixture-obstruction';
            Object.assign(overlay.style,{position:'fixed',left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px',background:'#fff',zIndex:'100'});
            document.body.append(overlay);
          });
        } else if(obstruction==='assistant') await dragAssistantTo(560,500);
        else await frame.locator('body').evaluate(()=>window.scrollTo(0,140));
      };
      const uncover=async()=>{
        if(obstruction==='top') await page.locator('#fixture-obstruction').evaluate(node=>node.remove());
        else if(obstruction==='child') await frame.locator('#fixture-obstruction').evaluate(node=>node.remove());
        else if(obstruction==='assistant') await dragAssistantTo(1050,700);
        else await frame.locator('body').evaluate(()=>window.scrollTo(0,0));
      };
      await cover();await noPointer(true);
      assert.match(await page.locator(ui.locateStatus).innerText(),/遮|移|滚|看不到|当前/u);
      await uncover();await page.locator(ui.pointer).waitFor();await assertPointerAt(frame,selector,'control');
      await cover();await noPointer(true);
      if(obstruction==='top') await page.locator(ui.locate).click();
      else if(obstruction==='child') await page.locator('.impact-cn-close').click();
      else if(obstruction==='assistant') await page.locator(ui.step).selectOption('5c');
      else await probe(page,'destroy');
      await uncover();await page.waitForTimeout(1250);
      assert.equal(await page.locator(ui.pointer).count(),0,'Canceled '+obstruction+' wait must not redraw after visibility returns');
      if(obstruction!=='clip') assert.equal(await page.locator(ui.locate).getAttribute('aria-pressed'),'false');
      assert.deepEqual(await nativeSnapshot(frame),before);assert.deepEqual(await probe(page,'storage'),stored);
    }
    await openTop();await openGuide();
    return 'Parent/child hit testing and assistant bounds reject covered Text; scroll-back/removal restores active requests, while each cancellation keeps the overlay absent';
  });
  await check('Narrow-window arrow labels avoid the target and assistant or keep only the target outline',async()=>{
    for(const width of [640,320]) {
      await page.setViewportSize({width,height:736});await openTop();await openGuide();await choose('shopify','5a');
      await page.locator('.fixture-native-nav').evaluate(nav=>{
        Object.assign(nav.style,{display:'block',position:'fixed',left:'10px',top:(innerHeight-52)+'px',width:'250px'});
        for(const heading of nav.querySelectorAll('h4.accordion-header'))heading.style.display='none';
        for(const row of nav.querySelectorAll('.check-item')) if(!row.querySelector('#fixture-entry-5a')) row.style.display='none';
      });
      await page.locator(ui.locate).click();await page.locator(ui.pointer).waitFor();
      await assertPointerAt(page,'.check-item:has(#fixture-entry-5a)');
      const layout=await page.locator(ui.pointer).evaluate(pointer=>{
        const rect=node=>{const box=node.getBoundingClientRect();return {left:box.left,top:box.top,right:box.right,bottom:box.bottom,width:box.width,height:box.height};};
        const bubble=pointer.querySelector('.impact-cn-guide-pointer-bubble');
        const style=getComputedStyle(bubble),hidden=bubble.hidden||style.display==='none'||style.visibility==='hidden';
        return {hidden,bubble:rect(bubble),target:rect(document.querySelector('#fixture-entry-5a').closest('.check-item')),panel:rect(document.querySelector('#impact-cn-assistant-panel')),launcher:rect(document.querySelector('.impact-cn-launcher-row')),viewport:{width:innerWidth,height:innerHeight}};
      });
      if(!layout.hidden) {
        const intersects=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
        assert(!intersects(layout.bubble,layout.target),'Bubble must not cover the target at '+width+'px');
        assert(!intersects(layout.bubble,layout.panel)&&!intersects(layout.bubble,layout.launcher),'Bubble must avoid the assistant at '+width+'px');
        assert(layout.bubble.left>=0&&layout.bubble.top>=0&&layout.bubble.right<=layout.viewport.width&&layout.bubble.bottom<=layout.viewport.height,'Bubble must remain inside the viewport');
      }
      assert.equal(await page.locator(ui.pointer+' .impact-cn-guide-pointer-ring').count(),1);
      await page.locator(ui.locate).click();await noPointer();
    }
    return '640px and 320px windows keep a visible target outlined; bubble geometry stays clear of native target and assistant or is safely hidden';
  });
  await check('A narrow viewport contains the guide and Escape closes the reused panel',async()=>{
    await page.setViewportSize({width:320,height:736});await openTop();await openGuide();await choose('sales-refunds','6e');
    await page.locator(ui.issue).selectOption('6e-wait');
    await panelWithinViewport();
    // Closing synthetic native AI restores the default right-hand placement.
    await page.locator('#ask-impact-shadow-host').evaluate(node=>node.remove());
    await page.waitForFunction(()=>document.querySelector('#impact-cn-assistant')?.dataset.aiActive==='false');
    await probe(page,'resetPosition');await panelWithinViewport();
    for(const left of [8,250]) {await dragAssistantTo(left,500);await panelWithinViewport();}
    await probe(page,'resetPosition');await panelWithinViewport();
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    const screenshotFolder=reportFolder;mkdirSync(screenshotFolder,{recursive:true});
    screenshotPath=path.join(screenshotFolder,'guide-panel-'+manifest.version+'-'+new Date().toISOString().replace(/[:.]/gu,'-')+'.png');
    // Clip to the assistant panel so no native business fixture appears in evidence.
    await page.locator('#impact-cn-assistant-panel').screenshot({path:screenshotPath,style:'#checklist-outer-container,#ask-impact-shadow-host{filter:opacity(0) !important}'});
    await page.locator(ui.card).focus();await page.keyboard.press('Escape');assert(await page.locator('#impact-cn-assistant-panel').isHidden());
    assert.equal(await page.evaluate(()=>document.activeElement?.classList.contains('impact-cn-launcher')),true);
    await openGuide();await probe(page,'settings',{enabled:true,aiEnabled:false});
    await page.locator('.fixture-static').filter({hasText:target}).waitFor();
    await probe(page,'destroy');
    assert.equal(await page.locator('#impact-cn-assistant,.impact-cn-guide,[data-impact-cn-guide-open]').count(),0);
    assert.equal(await page.locator('.fixture-static').innerText(),source);assert((await nativeSnapshot()).textIdentity);
    return '320px guide stays within the viewport with native AI active/closed, default right placement and dragging to either edge; Escape/destroy clean up and native Text restores';
  });
} catch(error) {
  results.push({name:'Synthetic MV3 onboarding harness',status:'FAIL',evidence:error.message});
  console.log('ONBOARDING UNIT FAIL harness: '+error.message);
} finally {
  await context?.close();
  const folder=reportFolder;mkdirSync(folder,{recursive:true});
  const report={mode:'REAL_MV3_SYNTHETIC_ONBOARDING_HOST',version:manifest.version,sourceDirectory:path.relative(root,extensionSource),sourceInputSHA256,sourceInputStage:'Temporary copied input before explicit synthetic dictionary/config/probe fixture adaptations; content/background/journey runtime bytes remain shipped.',selectedChecks:selectedChecks?[...selectedChecks]:null,realSiteAcceptance:false,realStoreValidation:false,realNetworkQueries:false,screenshotPath:screenshotPath||null,pointerScreenshotPath:pointerScreenshotPath||null,status:results.length&&results.every(item=>item.status==='PASS')?'PASS':'FAIL',results};
  const reportPath=path.join(folder,'onboarding-'+new Date().toISOString().replace(/[:.]/gu,'-')+'.json');
  writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');console.log('Onboarding report: '+reportPath);
  rmSync(workspace,{recursive:true,force:true});
}
assert(results.length===(selectedChecks?.size||37)&&results.every(item=>item.status==='PASS'),'Onboarding checks failed');

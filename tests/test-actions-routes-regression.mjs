/** Narrow public Test Actions route projections, using the existing isolated MV3 approach. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, cpSync, rmSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const arg=name=>process.argv.find(value=>value.startsWith(name+'='))?.slice(name.length+1);
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const sourceDir=path.resolve(root,arg('--source-dir')||'impact-cn-mod');
const reportDir=path.resolve(root,arg('--report-dir')||'artifacts/0820-test-actions-routes-20261020');
const baseline=process.argv.includes('--baseline-observation');
const automaticOnly=process.argv.includes('--automatic-only');
const controlsOnly=process.argv.includes('--controls-only');
const requireSourceUnchanged=process.argv.includes('--require-source-unchanged');
const testSHA256=sha(readFileSync(fileURLToPath(import.meta.url)));
const capturePaths=['artifacts/0820-test-actions-routes-20261020/live-public-capture.json','artifacts/0818-checklist-tooltip-20261019/public-capture.json','artifacts/0818-checklist-tooltip-20261019/public-expanded-sidebar-supplement.json','artifacts/083-floating-live-20261015/floating-dom-evidence.json'];
const captureBindings=capturePaths.map(file=>({path:file,sha256:sha(readFileSync(path.join(root,file)))}));
const live=JSON.parse(readFileSync(path.join(root,capturePaths[0])));
assert(live.testListMenuFollowup?.engageListTooltip&&live.list?.headers?.length===9,'Fresh public list/menu facts required');
assert.equal(live.list.pathExact,'/secure/advertiser/actions/tests/test-actions-flow.ihtml');
const canonical=live.list.pathExact,engage=live.testListMenuFollowup.engageListPath;
const family='/secure/advertiser/engage/checklist/instance/synthetic-public-fixture';
const legacy='/secure/advertiser/tracking-settings/actiontracker/launch-test-action-flow.ihtml';
// Pure Text expectations from the dictionary author's public-role Map after root wording decisions.
// Neither selectors nor dictionary entries are used to construct the observed-role projection.
const targets={'Test Actions':'测试转化','Default View':'默认视图','Start New Test':'启动新测试','Test Status':'测试状态','Event Type':'事件类型','Clear Filters':'清除筛选','Status':'状态','Action Date':'转化日期','Order Id':'订单 ID','Shared Id':'共享 ID','Promo Code':'优惠码','Locking Date':'锁定日期','Revenue':'成交金额','Payout':'佣金','Pending Validation':'待验证',rows:'行',Engage:'合作管理',Checklists:'配置清单','Validate Your Events':'验证转化事件'};
const E=(tag,attrs={},children=[])=>({tag,attrs,children}),T=(text,key)=>({text,...(key?{key}:{})});
const div=(className,children=[],attrs={})=>E('div',{class:className,...attrs},children);
const fixed=(text,key,tag='span',attrs={})=>E(tag,attrs,[T(text,key)]);
function listTree(){
  const filters=['Test Status','Event Type'].map((text,index)=>E('span',{class:'filter','data-testid':['uicl-filter--1621662004','uicl-filter--1587983185'][index]},[div('iui-multiselect-input',[div('btn-container',[E('button',{'data-testid':'uicl-multi-select-input-button',type:'button'},[fixed(text,'filter-'+index)])])])]));
  const headers=live.list.headers.map((text,index)=>div('table-cell table-header',[fixed(text,'column-'+index,'span',{class:'column-label text-ellipsis','data-testid':'uicl-data-table-column-label-'+index})]));
  const privateCells=[div('table-cell content-cell',[div('',[fixed('Pending Validation','pending')])],{'data-testid':'uicl-data-table-cell-synthetic-0'}),...['Test Actions','Event Type','Pending Validation','SYNTHETIC ORDER NAME','1234.56','USD 1234.56'].map((text,index)=>div('table-cell content-cell',[E('span',{class:'column-label'},[T(text)])],{'data-testid':'uicl-data-table-cell-synthetic-'+(index+1)}))];
  return div('app-page',[E('section',{class:'iui-page-section'},[div('iui-data-view',[
    div('data-header',[
      div('top-info',[fixed('Test Actions','title','h1'),div('page-actions',[E('span',{},[fixed('Start New Test','start','button',{'data-testid':'uicl-button',type:'button'})])])]),
      div('iui-manage-table-state-widget',[fixed('Default View','view','span',{class:'default-label'})]),
      div('iui-filter-section',[...filters,fixed('Clear Filters','clear','button',{class:'clearButton','data-testid':'uicl-button',type:'button'})]),
      div('bulk-actions-and-sort',[E('span',{class:'num-records-container'},[{comment:'synthetic non-text marker, actual marker kind is comment'},E('span',{class:'num-records'},[T('67')]),T(' rows','rows')])])
    ]),
    div('data-container',[div('iui-dynamic-table',[div('iui-data-table',[
      div('table-head',[div('table-row',headers)]),div('table-body',[div('table-row',privateCells,{'data-testid':'uicl-data-table-row-synthetic'})])
    ],{'data-testid':'uicl-data-table'})])]),
    E('input',{placeholder:'Order ID',value:'Test Actions','aria-label':'SYNTHETIC PRIVATE INPUT'}),
    E('input',{type:'checkbox',checked:'',disabled:'',value:'Pending Validation'}),
    E('select',{},[E('option',{value:'SYNTHETIC_MACHINE_VALUE',selected:''},[T('SYNTHETIC CUSTOM CHOICE')])]),
    E('span',{class:'synthetic-private-checklist-name'},[T('Checklists')])
  ],{'data-testid':'uicl-dataview'})])],{'data-synthetic-component':'true'});
}
function navTree(expanded){
  const tooltip=div('adv-nav-product-tooltip-modal right-down',[div('tooltip-inner',[
    fixed('Engage','tooltip-title','div',{class:'tooltip-title'}),
    div('tooltip-items-ct childMenuTooltip',[div('subitem-container checklistItem',[fixed('Checklists','tooltip-checklists','div',{class:'subitem-label cursor','data-testid':'sidenav-tooltip-submenu-ni_775164772','data-track-id':'sidenav-product-submenu-ni_775164772'})])])
  ])],{'data-testid':'product-switcher-tooltip-container-prd_819328330'});
  const product=div('product-item cursor selected',[tooltip],{'data-testid':'sidenav-product-prd_819328330','data-track-id':'sidenav-product-prd_819328330'});
  const side=[div('',[div('product-icons-container',[product])],{id:'left-bar'})];
  if(expanded)side.push(div('collapsed',[div('navigation-subitems-container',[div('subitem-container checklistItem',[fixed('Checklists','expanded-checklists','div',{class:'subitem-label cursor','data-testid':'sidenav-expanded-submenu-ni_775164772','data-track-id':'sidenav-product-submenu-ni_775164772'})])])],{id:'expanded-bar'}));
  side.push(E('span',{class:'synthetic-private-checklist-name'},[T('Checklists')]),E('input',{value:'Engage'}));
  return div('left-navigation',[div('side-nav',side)],{'data-synthetic-component':'true'});
}
const floatTree=()=>div('float-widget',[div('sub-container',[div('float-middle-texts',[fixed('Validate Your Events','floating-label','div',{class:'float-subtext'})])])],{'data-synthetic-component':'true'});
const scenes=[
  {id:'canonical-list',kind:'list',path:canonical,tree:listTree(),provenance:'Current 0.8.19 canonical list public Text/role capture. Unknown intermediate ancestors are projected, not asserted as a full clone.'},
  {id:'engage-list-fields',kind:'list',path:engage,tree:listTree(),assertedKeys:['filter-0','filter-1','pending','rows'],ownedHelp:{'engage-test-actions-c728cc30a':{topic:'test-actions',parent:'title'},'engage-test-actions-75e82b76b':{topic:'event-type',parent:'column-3'},'engage-test-actions-5112fac12':{topic:'promo-codes',parent:'column-5'},'engage-test-actions-4ab140a00':{topic:'action-lock-date',parent:'column-6'}},provenance:'Current engage stable-list followup confirms the same list root. Four newly added roles use the observed list projection on this alias; thirteen existing fixed roles supply context but are not added to position totals. Four pre-existing AI helpers retain their exact owned-node identity contract.'},
  {id:'canonical-navigation',kind:'nav',path:canonical,tree:navTree(true),provenance:'Expanded leaf is current canonical observation. Two tooltip Texts are user-screenshot failure plus historical/current same-component structure transplantation; canonical tooltip DOM was not visible in current capture.'},
  {id:'engage-list-navigation',kind:'nav',path:engage,tree:navTree(true),provenance:'Current user-assisted native hover confirms same family tooltip chains; expanded counterpart already Chinese. Unchanged upper #left-bar chain is historical 0.8.17 structure.'},
  {id:'family-navigation',kind:'nav',path:family,tree:navTree(false),provenance:'Current checklist-family hover capture. Public synthetic suffix stands in for an excluded private instance path; historical upper #left-bar structure only.'},
  {id:'canonical-floating-linkage',kind:'float',path:canonical,tree:floatTree(),provenance:'Historical 0.8.2 native four-DIV floating component transplanted into canonical path; current canonical page has no observed floating DOM. Synthetic linkage only.'},
  {id:'legacy-tool-floating-preservation',kind:'float',path:legacy,tree:floatTree(),provenance:'Historical 0.8.2 actual native floating structure/path, one retained necessary linkage check, not new live acceptance.'}
].filter(scene=>!arg('--scene')||arg('--scene').split(',').includes(scene.id));
const walk=(node,fn)=>{fn(node);for(const child of node.children||[])walk(child,fn);};
for(const scene of scenes){scene.allLabels=[];walk(scene.tree,node=>{if(node.key){assert(targets[node.text.trim()]);scene.allLabels.push({key:node.key,source:node.text,expected:targets[node.text.trim()]});}});scene.labels=scene.allLabels.filter(x=>!scene.assertedKeys||scene.assertedKeys.includes(x.key));}
const positionCount=scenes.reduce((sum,scene)=>sum+scene.labels.length,0);
const scriptJSON=value=>JSON.stringify(value).replaceAll('<','\\u003c');
const htmlEscape=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
function html(scene,shape='valid'){
  const tree=structuredClone(scene.tree);
  walk(tree,node=>{const a=node.attrs||{};
    if(shape==='wrong-component'&&a['data-synthetic-component'])a.class='synthetic-unrelated-component';
    if(shape==='wrong-table'&&a['data-testid']==='uicl-data-table')a['data-testid']='synthetic-unrelated-table';
    if(shape==='wrong-status-owner'&&a['data-testid']==='uicl-data-table-cell-synthetic-0')a['data-testid']='uicl-data-table-cell-synthetic-7';
    if(shape==='wrong-product'&&a['data-testid']==='sidenav-product-prd_819328330')a['data-testid']='sidenav-product-synthetic-other';
    if(shape==='wrong-tooltip'&&a['data-testid']==='product-switcher-tooltip-container-prd_819328330')a['data-testid']='synthetic-unrelated-tooltip';
    if(shape==='wrong-submenu'&&a['data-testid']==='sidenav-tooltip-submenu-ni_775164772')a['data-testid']='synthetic-unrelated-submenu';
    if(shape==='selected-up'&&a.class==='product-item cursor selected')a.class='product-item cursor';
    if(shape==='selected-up'&&a.class==='adv-nav-product-tooltip-modal right-down')a.class='adv-nav-product-tooltip-modal left-up';
    if(shape==='wrong-floating-leaf'&&a.class==='float-subtext')a.class='synthetic-unrelated-floating-text';
  });
  return `<!doctype html><html><head><meta charset="utf-8"></head><body class="vnext-dark"><script>
  const scene=${scriptJSON({...scene,tree})},shape=${scriptJSON(shape)};
  const construct=spec=>{if('comment'in spec)return document.createComment(spec.comment);if('text'in spec){if(!spec.key)return document.createTextNode(spec.text);const frag=document.createDocumentFragment();frag.append(document.createComment('fixed:'+spec.key),document.createTextNode(spec.text));return frag;}const e=document.createElement(spec.tag);for(const[k,v]of Object.entries(spec.attrs||{}))e.setAttribute(k,v);for(const c of spec.children||[])e.append(construct(c));return e;};
  window.__outer=[];let scope=document.body;
  if(scene.kind!=='float'){
    const uitk=document.createElement('div');uitk.id=shape==='wrong-root'?'synthetic-wrong-uitk':'uitk-container';uitk.className='vueAdvNav';document.body.append(uitk);window.__outer.push(uitk);scope=uitk;
    if(scene.kind==='list'){const main=document.createElement('div');main.id='main-content';const vue=document.createElement('div');vue.id=shape==='wrong-root'?'synthetic-wrong-vue':'vueInstance';uitk.append(main);main.append(vue);scope=vue;window.__outer.push(main,vue);}
    else{const left=document.createElement('div');left.id='left-content';const nav=document.createElement('div');nav.id=shape==='wrong-host'?'synthetic-other-navigation':'adv-navigation';const host=document.createElement('impact-style-isolator');uitk.append(left);left.append(nav);nav.append(host);window.__outer.push(left,nav,host);scope=shape==='light-dom'?host:host.attachShadow({mode:'open'});}
  }else{const host=document.createElement(shape==='wrong-host'?'div':'impact-style-isolator');let parent=document.body;if(shape==='wrong-body-owner'){parent=document.createElement('div');document.body.append(parent);window.__outer.push(parent);}parent.append(host);window.__outer.push(host);scope=shape==='light-dom'?host:host.attachShadow({mode:'open'});}
  if(scene.kind==='list'&&shape==='shadow'){const host=document.createElement('div');scope.append(host);window.__outer.push(host);scope=host.attachShadow({mode:'open'});}
  window.__component=construct(scene.tree);scope.append(window.__component);window.__scope=scope;
  window.__isOwnedHelp=(node,nodes=window.__proof?.nodes)=>{if(node.nodeType!==Node.ELEMENT_NODE||!node.matches('button.impact-cn-inline-help[data-impact-cn-ignore][data-impact-cn-help]')||node.type!=='button')return false;const def=scene.ownedHelp?.[node.dataset.entryId];return !!def&&node.dataset.topicId===def.topic&&node.dataset.impactCnHelpTopic===def.topic&&node.parentNode===nodes?.[def.parent]?.parentElement;};
  window.__collect=()=>{const nodes={},walker=document.createTreeWalker(window.__component,NodeFilter.SHOW_COMMENT);while(walker.nextNode()){const c=walker.currentNode;if(c.nodeValue.startsWith('fixed:'))nodes[c.nodeValue.slice(6)]=c.nextSibling;}
    const elements=[...window.__outer,window.__component,...window.__component.querySelectorAll('*')].filter(e=>!window.__isOwnedHelp(e,nodes)),texts=[],w=document.createTreeWalker(window.__component,NodeFilter.SHOW_TEXT);while(w.nextNode())if(!Object.values(nodes).includes(w.currentNode))texts.push({node:w.currentNode,value:w.currentNode.nodeValue});
    window.__proof={nodes,sources:Object.fromEntries(scene.allLabels.map(x=>[x.key,x.source])),assertedKeys:scene.labels.map(x=>x.key),elements:elements.map(element=>({element,parent:element.parentNode,children:[...element.childNodes].filter(n=>!window.__isOwnedHelp(n,nodes)),attrs:JSON.stringify([...element.attributes].map(a=>[a.name,a.value]))})),texts,controls:elements.filter(e=>e.matches('input,select,textarea')).map(element=>({element,value:element.value,checked:element.checked,disabled:element.disabled})),clicks:0,inputEvents:0};
    for(const element of elements.filter(e=>e.matches('button,a,input,select,textarea'))){element.addEventListener('click',e=>{e.preventDefault();window.__proof.clicks++;});element.addEventListener('input',()=>window.__proof.inputEvents++);}
  };window.__collect();
  window.__remount=async hidden=>{const next=window.__component.cloneNode(true),nodes={};const w=document.createTreeWalker(next,NodeFilter.SHOW_COMMENT);while(w.nextNode()){const c=w.currentNode;if(c.nodeValue.startsWith('fixed:')){const key=c.nodeValue.slice(6);nodes[key]=c.nextSibling;c.nextSibling.nodeValue=scene.allLabels.find(x=>x.key===key).source;}}for(const button of next.querySelectorAll('button'))if(window.__isOwnedHelp(button,nodes))button.remove();window.__component.remove();await new Promise(r=>setTimeout(r,80));if(hidden)next.hidden=true;window.__scope.append(next);window.__component=next;window.__collect();};
  </script></body></html>`;
}
for(const scene of scenes)html(scene);
const sourceFiles=readdirSync(sourceDir,{recursive:true}).filter(f=>path.basename(f)!=='.DS_Store'&&statSync(path.join(sourceDir,f)).isFile());
const sourceHashes=Object.fromEntries(sourceFiles.map(f=>[f,sha(readFileSync(path.join(sourceDir,f)))]));
const version=JSON.parse(readFileSync(path.join(sourceDir,'manifest.json'))).version;
const temporary=mkdtempSync(path.join(os.tmpdir(),'impact-test-action-routes-')),extension=path.join(temporary,'extension');
cpSync(sourceDir,extension,{recursive:true});for(const[f,h]of Object.entries(sourceHashes))assert.equal(sha(readFileSync(path.join(extension,f))),h);
const require=createRequire(import.meta.url);let chromium;try{({chromium}=require('playwright-core'));}catch{({chromium}=require(path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core')));}
let context,page,worker,activeScene;const results=[],observations=[];
const check=async(name,action)=>{if(controlsOnly&&!name.startsWith('Translation off/on')&&!name.startsWith('Executed complete')){results.push({name,status:'NOT_RUN',evidence:'Explicit controls-only diagnostic selection.'});return;}try{const evidence=await action();results.push({name,status:'PASS',evidence});console.log('TEST ACTIONS PASS '+name);}catch(error){results.push({name,status:'FAIL',evidence:error.message});console.log('TEST ACTIONS FAIL '+name+' '+error.message);}};
async function open(scene,shape='valid',{host='demo.impact.com',pathname=scene.path}={}){activeScene=scene;await page.goto('https://'+host+pathname+'?synthetic-shape='+shape);await page.waitForFunction(()=>!!window.__proof);}
async function settings(enabled,aiEnabled){await worker.evaluate(v=>chrome.storage.local.set({impactCNEnabled:v.enabled,impactCNAIEnabled:v.aiEnabled}),{enabled,aiEnabled});await page.waitForFunction(v=>{const e=document.querySelector('#impact-cn-assistant');return !e||e.dataset.enabled===String(v.enabled)&&e.dataset.aiEnabled===String(v.aiEnabled);},{enabled,aiEnabled});}
async function waitText(scene,translated=true,frame=page,overrides={}){const expect=Object.fromEntries(scene.labels.map(x=>[x.key,translated?x.expected:x.source.trim()]));Object.assign(expect,overrides);try{await frame.waitForFunction(expected=>Object.entries(expected).every(([key,text])=>window.__proof.nodes[key]?.nodeValue.trim()===text),expect,{timeout:3500});}catch(error){const mismatches=await frame.evaluate(expected=>Object.entries(expected).map(([key,expected])=>({key,expected,actual:window.__proof.nodes[key]?.nodeValue})).filter(x=>x.expected!==x.actual?.trim()),expect);throw new Error(error.message+' '+JSON.stringify(mismatches));}}
async function proof(restored=false,frame=page){const errors=await frame.evaluate(restored=>{const p=window.__proof,children=element=>[...element.childNodes].filter(n=>!window.__isOwnedHelp(n));return{elements:p.elements.filter(x=>!x.element.isConnected||x.element.parentNode!==x.parent||x.children.length!==children(x.element).length||x.children.some((n,i)=>n!==children(x.element)[i])||x.attrs!==JSON.stringify([...x.element.attributes].map(a=>[a.name,a.value]))).map(x=>({tag:x.element.tagName,connected:x.element.isConnected,parentSame:x.element.parentNode===x.parent,attrsBefore:x.attrs,attrsAfter:JSON.stringify([...x.element.attributes].map(a=>[a.name,a.value])),addedChildren:children(x.element).filter(n=>!x.children.includes(n)).map(n=>({nodeType:n.nodeType,tag:n.tagName,class:n.className,entryId:n.dataset?.entryId,topicId:n.dataset?.topicId})),removedChildren:x.children.filter(n=>!children(x.element).includes(n)).length})),texts:p.texts.filter(x=>!x.node.isConnected||x.node.nodeValue!==x.value).length,controls:p.controls.filter(x=>x.element.value!==x.value||x.element.checked!==x.checked||x.element.disabled!==x.disabled).length,fixed:Object.entries(p.nodes).filter(([key,node])=>!node.isConnected||restored&&p.assertedKeys.includes(key)&&node.nodeValue!==p.sources[key]).length,inputEvents:p.inputEvents};},restored);assert(Object.values(errors).every(x=>Array.isArray(x)?!x.length:x===0),'Native identity/children/attributes/Text/value/event mismatch '+JSON.stringify(errors));}
async function helpProof(scene,enabled,aiEnabled){const expected=aiEnabled?Object.keys(scene.ownedHelp||{}).length:0;try{await page.waitForFunction(expected=>[...window.__component.querySelectorAll('button.impact-cn-inline-help')].filter(n=>window.__isOwnedHelp(n)).length===expected,expected,{timeout:5000});}catch(error){const actual=await page.evaluate(()=>({assistant:[...document.querySelectorAll('#impact-cn-assistant')].map(n=>({enabled:n.dataset.enabled,aiEnabled:n.dataset.aiEnabled})),help:[...window.__component.querySelectorAll('button.impact-cn-inline-help')].map(n=>({entry:n.dataset.entryId,topic:n.dataset.topicId,owned:window.__isOwnedHelp(n),attrs:[...n.attributes].map(a=>[a.name,a.value])}))}));throw new Error('Owned help mismatch '+JSON.stringify({scene:scene.id,enabled,aiEnabled,expected,actual}));}}
try{
  context=await chromium.launchPersistentContext(path.join(temporary,'profile'),{executablePath:chromium.executablePath(),channel:'chromium',headless:true,args:[`--disable-extensions-except=${extension}`,`--load-extension=${extension}`]});
  await context.route(/https?:\/\//u,route=>{const u=new URL(route.request().url());if(u.pathname==='/synthetic/test-action-routes-frame-parent')return route.fulfill({contentType:'text/html',body:'<!doctype html><iframe src="'+htmlEscape('https://demo.impact.com'+activeScene.path)+'"></iframe>'});return route.fulfill({contentType:'text/html',body:html(activeScene,u.searchParams.get('synthetic-shape')||'valid')});});
  page=await context.newPage();worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');await settings(true,true);
  await check('Public canonical list, route-specific navigation and floating linkage translate automatically',async()=>{
    for(const scene of scenes){let error;try{await open(scene);await waitText(scene);await helpProof(scene,true,true);await proof();}catch(e){error=e.message;}const actual=await page.evaluate(()=>Object.fromEntries(Object.entries(window.__proof.nodes).map(([k,n])=>[k,n.nodeValue.trim()])));observations.push({id:scene.id,provenance:scene.provenance,status:error?'FAIL':'PASS',...(error?{error}:{}),positions:scene.labels.map(x=>({...x,actual:actual[x.key],status:actual[x.key]===x.expected?'PASS':'FAIL'}))});}assert(observations.every(x=>x.status==='PASS'),'Public Text mismatches in '+observations.filter(x=>x.status==='FAIL').map(x=>x.id).join(', '));return{scenes:scenes.length,positions:positionCount,synthetic:true};
  });
  if(!baseline&&!automaticOnly){
    const getScene=id=>scenes.find(x=>x.id===id),representatives=(controlsOnly?['engage-list-fields']:['canonical-list','engage-list-fields','engage-list-navigation','canonical-floating-linkage']).map(getScene);
    await check('Translation off/on and independent AI preserve native nodes, controls, counts, names and synthetic rows',async()=>{for(const scene of representatives){await open(scene);await settings(true,true);await waitText(scene);await helpProof(scene,true,true);await proof();await settings(false,true);await waitText(scene,false);await helpProof(scene,false,true);await proof(true);await settings(true,false);await waitText(scene);await helpProof(scene,true,false);await proof();await settings(true,true);await waitText(scene);await helpProof(scene,true,true);await proof();if(scene.kind==='list'){await page.evaluate(()=>[...window.__component.querySelectorAll('button')].find(n=>!window.__isOwnedHelp(n)).click());assert.equal(await page.evaluate(()=>window.__proof.clicks),1);await proof();}}return{representatives:representatives.map(x=>x.id),syntheticNativeClickHandlers:representatives.filter(x=>x.kind==='list').length,preExistingOwnedHelpCount:4,ownedHelpTracksAIIndependentlyOfTranslation:true,nativeChildrenRetainedAsExactOrderedSubsequence:true,noSaveOrBusinessAction:true};});
    await check('Native-style cancel/remount, hidden mount, reveal and refresh require no translation switch',async()=>{await settings(true,true);for(const scene of representatives){await open(scene);await waitText(scene);for(const hidden of [false,true]){await page.evaluate(hidden=>window.__remount(hidden),hidden);await waitText(scene);await proof();if(hidden){await page.evaluate(()=>{window.__component.hidden=false;window.__collect();});await waitText(scene);await proof();}}await page.reload();await page.waitForFunction(()=>!!window.__proof);await waitText(scene);await proof();}return{representatives:representatives.map(x=>x.id),remountsEach:2,reloadsEach:1,translationSwitchOperations:0,syntheticCancellationOnly:true};});
    await check('Wrong routes, owners and components retain original Text without widening qualification',async()=>{
      const evidence=[];for(const scene of representatives){for(const variant of [{shape:'valid',host:'other.example'},{shape:'valid',pathname:'/synthetic/non-target-route'},{shape:scene.kind==='list'?'shadow':'light-dom'},{shape:scene.kind==='list'?'wrong-root':'wrong-host'}]){await open(scene,variant.shape,variant);await waitText(scene,false);await proof(true);evidence.push({scene:scene.id,...variant,status:'PASS'});}activeScene=scene;await page.goto('https://demo.impact.com/synthetic/test-action-routes-frame-parent');const frame=page.frames().find(x=>x!==page.mainFrame())||await page.waitForEvent('frameattached');await frame.waitForFunction(()=>!!window.__proof);const newOnly=scene.kind==='nav'?{...scene,labels:scene.labels.filter(x=>x.key!=='expanded-checklists')}:scene;await waitText(newOnly,false,frame);await proof(false,frame);evidence.push({scene:scene.id,shape:'child-frame',onlyNewTopOnlyPositionsAsserted:true,status:'PASS'});}
      const list=scenes[0];await open(list,'wrong-status-owner');await waitText(list,true,page,{pending:'Pending Validation'});await proof();evidence.push({scene:list.id,shape:'wrong-status-owner',status:'PASS'});
      const nav=getScene('engage-list-navigation');for(const shape of ['wrong-product','wrong-tooltip']){await open(nav,shape);await waitText(nav,true,page,{'tooltip-title':'Engage','tooltip-checklists':'Checklists'});await proof();evidence.push({scene:nav.id,shape,status:'PASS'});}await open(nav,'wrong-submenu');await waitText(nav,true,page,{'tooltip-checklists':'Checklists'});await proof();evidence.push({scene:nav.id,shape:'wrong-submenu',status:'PASS'});await open(nav,'selected-up');await waitText(nav);await proof();evidence.push({scene:nav.id,shape:'selected-up',status:'PASS',syntheticStatePermutation:true});
      const floating=getScene('canonical-floating-linkage');for(const shape of ['wrong-body-owner','wrong-floating-leaf']){await open(floating,shape);await waitText(floating,false);await proof(true);evidence.push({scene:floating.id,shape,status:'PASS'});}return evidence;
    });
  }else results.push({name:'Candidate linked behavior checks',status:'NOT_RUN',evidence:baseline?'Complete old package baseline records actual Text results; linked candidate behavior is not inferred from old failures.':'Explicit automatic-only diagnostic; no linked behavior conclusion.'});
  await check('Executed complete extension, source and public evidence retain their frozen bytes',async()=>{for(const[f,h]of Object.entries(sourceHashes)){assert.equal(sha(readFileSync(path.join(extension,f))),h);if(requireSourceUnchanged)assert.equal(sha(readFileSync(path.join(sourceDir,f))),h);}for(const x of captureBindings)assert.equal(sha(readFileSync(path.join(root,x.path))),x.sha256);assert.equal(sha(readFileSync(fileURLToPath(import.meta.url))),testSHA256);return{sourceFiles:sourceFiles.length,requireSourceUnchanged,loadedSnapshotUnchanged:true,capturesUnchanged:true};});
}finally{
  await context?.close();mkdirSync(reportDir,{recursive:true});const report={mode:'SYNTHETIC_PUBLIC_TEST_ACTIONS_ROUTES_MV3',baselineObservation:baseline,automaticOnly,controlsOnly,version,sourceDirectory:path.relative(root,sourceDir),sourceSHA256:sourceHashes,testSHA256,captureBindings,expectations:targets,expectationBoundary:'Pure public Text functional Map from the dictionary author after root wording decisions; no independent all-item semantic approval claimed.',realSiteAcceptance:false,realNetworkQueries:false,fixedTextPositions:positionCount,scenes:scenes.map(({tree,...x})=>x),observations,status:results.length===5&&results.every(x=>x.status==='PASS')?'PASS':'FAIL',results};const f=path.join(reportDir,'test-'+new Date().toISOString().replace(/[:.]/gu,'-')+'.json');writeFileSync(f,JSON.stringify(report,null,2)+'\n',{flag:'wx'});console.log('Test Actions report: '+f);rmSync(temporary,{recursive:true,force:true});
}
assert(results.length===5&&results.every(x=>x.status==='PASS'),'Directed Test Actions checks failed');

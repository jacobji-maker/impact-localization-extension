/** Shared navigation only; existing isolated MV3 technique, no user browser or real network. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, cpSync, rmSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const arg=name=>process.argv.find(x=>x.startsWith(name+'='))?.slice(name.length+1);
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const sourceDir=path.resolve(root,arg('--source-dir')||'impact-cn-mod');
const reportDir=path.resolve(root,arg('--report-dir')||'artifacts/0821-shared-navigation-20261020');
const baseline=process.argv.includes('--baseline-observation'),requireSourceUnchanged=process.argv.includes('--require-source-unchanged');
const testSHA256=sha(readFileSync(fileURLToPath(import.meta.url)));
const capturePath='artifacts/0821-shared-navigation-20261020/live-public-capture.json';
const captureBytes=readFileSync(path.join(root,capturePath)),capture=JSON.parse(captureBytes);
assert(capture.currentTooltipAncestorChain?.includes('#left-bar')&&capture.currentExpandedAncestorChain?.includes('#expanded-bar'));
assert(['Discover','Optimize','Protect'].every(source=>JSON.stringify(capture.additionalProductTitles).includes(source)),'Fresh additional product-title evidence required');
const targets={'tooltip-engage':'合作管理','tooltip-checklists':'配置清单','expanded-checklists':'配置清单','tooltip-discover':'招募伙伴','tooltip-optimize':'多维分析','tooltip-protect':'风险防护'};
const sources={'tooltip-engage':'Engage','tooltip-checklists':'Checklists','expanded-checklists':'Checklists','tooltip-discover':'Discover','tooltip-optimize':'Optimize','tooltip-protect':'Protect'};
const E=(tag,attrs={},children=[])=>({tag,attrs,children}),D=(cls,children=[],attrs={})=>E('div',{class:cls,...attrs},children);
const T=(text,key)=>({text,...(key?{key}:{})}),fixed=(key,cls,attrs={})=>D(cls,[T(sources[key],key)],attrs);
const productAttrs={'data-testid':'sidenav-product-prd_819328330','data-track-id':'sidenav-product-prd_819328330'};
const tooltip=D('adv-nav-product-tooltip-modal right-down',[D('tooltip-inner',[
  fixed('tooltip-engage','tooltip-title'),
  D('tooltip-items-ct childMenuTooltip',[D('subitem-container checklistItem',[fixed('tooltip-checklists','subitem-label cursor',{'data-testid':'sidenav-tooltip-submenu-ni_775164772','data-track-id':'sidenav-product-submenu-ni_775164772'})])])
])],{'data-testid':'product-switcher-tooltip-container-prd_819328330'});
const additionalProducts=[['273093887','tooltip-discover'],['455368242','tooltip-optimize'],['1355336158','tooltip-protect']].map(([id,key])=>D('product-item cursor',[D('adv-nav-product-tooltip-modal right-down',[D('tooltip-inner',[fixed(key,'tooltip-title')])],{'data-testid':'product-switcher-tooltip-container-prd_'+id})],{'data-testid':'sidenav-product-prd_'+id,'data-track-id':'sidenav-product-prd_'+id}));
const tree=D('left-navigation',[D('side-nav',[
  D('',[D('product-icons-container',[D('product-item cursor',[tooltip],productAttrs),...additionalProducts])],{id:'left-bar'}),
  D('collapsed',[D('navigation-subitems-container',[D('subitem-container checklistItem',[fixed('expanded-checklists','subitem-label cursor',{'data-testid':'sidenav-expanded-submenu-ni_775164772','data-track-id':'sidenav-product-submenu-ni_775164772'})])])],{id:'expanded-bar'})
])]);
const preserved=D('synthetic-private-probes',[
  E('a',{href:'/synthetic/read-only-custom-name',class:'custom-checklist-name'},[T('Checklists')]),
  E('span',{class:'synthetic-custom-name'},[T('Engage')]),E('span',{class:'synthetic-count'},[T('67')]),
  ...['Discover','Optimize','Protect'].map(text=>E('span',{class:'synthetic-custom-name'},[T(text)])),
  E('span',{class:'synthetic-amount'},[T('USD 1234.56')]),E('input',{value:'Checklists',placeholder:'Engage'}),
  E('input',{type:'checkbox',value:'67',checked:'',disabled:''})
]);
const aiReply=E('p',{'data-synthetic-ai-reply':'true'},[T('Engage / Checklists / 67')]);
const scenes=[
  {id:'notification-demo',host:'demo.impact.com',path:capture.pathExact,evidence:'Current real 0.8.20 six-label English capture; behavior execution below is synthetic.'},
  {id:'notification-app',host:'app.impact.com',path:capture.pathExact,evidence:'Production host authorization exercised synthetically; no production browser visit.'},
  {id:'unlisted-advertiser',host:'demo.impact.com',path:'/secure/advertiser/synthetic-shared-navigation/overview.ihtml',evidence:'Deliberately unlisted ordinary advertiser path, not a claim that this page exists in the application.'},
  {id:'existing-tests',host:'demo.impact.com',path:'/secure/advertiser/actions/tests/test-actions-flow.ihtml',evidence:'Existing route preservation, same public component projection only.'},
  {id:'existing-checklist',host:'demo.impact.com',path:'/secure/advertiser/checklist/checklist-instance.ihtml',evidence:'Existing exact Checklist route preservation, no old full suite.'}
];
const positionCount=scenes.length*Object.keys(sources).length;
const inlineInput={schemaVersion:1,tree,preserved,aiReply,scenes,sources,targets,capture:{path:capturePath,sha256:sha(captureBytes)},boundary:'Public minimum observed component projection, not a complete live-DOM clone. Preservation probes and AI reply are synthetic values.'};
const inputBytes=Buffer.from(JSON.stringify(inlineInput,null,2)+'\n'),expectationBytes=Buffer.from(JSON.stringify({sources,targets},null,2)+'\n');
const scriptJSON=x=>JSON.stringify(x).replaceAll('<','\\u003c'),escape=x=>String(x).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const walk=(node,fn)=>{fn(node);for(const c of node.children||[])walk(c,fn);};
function documentHTML(shape='valid'){
  const spec=structuredClone(tree);
  walk(spec,node=>{const a=node.attrs||{};
    if(['wrong-product-test','cross-side-nav-witness'].includes(shape)&&a['data-testid']==='sidenav-product-prd_819328330')a['data-testid']='synthetic-other-product';
    if(shape==='wrong-product-track'&&a['data-track-id']==='sidenav-product-prd_819328330')a['data-track-id']='synthetic-other-product';
    if(shape==='wrong-tooltip'&&a['data-testid']==='product-switcher-tooltip-container-prd_819328330')a['data-testid']='synthetic-other-tooltip';
    if(shape==='wrong-tooltip-leaf'&&node.children?.[0]?.key==='tooltip-engage')node.tag='span';
    if(shape==='wrong-checklist-test'&&a['data-testid']==='sidenav-tooltip-submenu-ni_775164772')a['data-testid']='synthetic-other-submenu';
    if(shape==='wrong-checklist-track'&&a['data-testid']==='sidenav-tooltip-submenu-ni_775164772'&&a['data-track-id']==='sidenav-product-submenu-ni_775164772')a['data-track-id']='synthetic-other-submenu';
    if(shape==='wrong-expanded-test'&&a['data-testid']==='sidenav-expanded-submenu-ni_775164772')a['data-testid']='synthetic-other-expanded';
    if(shape==='wrong-expanded-track'&&a['data-testid']==='sidenav-expanded-submenu-ni_775164772'&&a['data-track-id']==='sidenav-product-submenu-ni_775164772')a['data-track-id']='synthetic-other-expanded';
    if(shape==='incidental-state'&&a.class==='product-item cursor')a.class='product-item cursor selected';
    if(shape==='incidental-state'&&a.class==='adv-nav-product-tooltip-modal right-down')a.class='adv-nav-product-tooltip-modal left-up';
    if(shape==='incidental-state'&&a.id==='expanded-bar')a.class='expanded';
  });
  if(shape==='cross-side-nav-witness')spec.children.push(D('side-nav',[D('',[D('product-icons-container',[D('product-item cursor',[],productAttrs)])],{id:'left-bar'})]));
  return `<!doctype html><html><head><meta charset="utf-8"></head><body class="vnext-dark"><script>
  const spec=${scriptJSON(spec)},preserved=${scriptJSON(preserved)},aiReply=${scriptJSON(aiReply)},shape=${scriptJSON(shape)},sources=${scriptJSON(sources)};
  window.__attachShadowPrototype=Element.prototype.attachShadow;
  const construct=s=>{if('text'in s){if(!s.key)return document.createTextNode(s.text);const f=document.createDocumentFragment();f.append(document.createComment('fixed:'+s.key),document.createTextNode(s.text));return f;}const e=document.createElement(s.tag);for(const[k,v]of Object.entries(s.attrs||{}))e.setAttribute(k,v);for(const c of s.children||[])e.append(construct(c));return e;};
  const uitk=document.createElement('div');uitk.id='uitk-container';uitk.className='appMinWidth vueAdvNav';const left=document.createElement('div');left.id='left-content';left.className=shape==='incidental-state'?'':'minimized';const nav=document.createElement('div');nav.id=shape==='wrong-host'?'synthetic-other-navigation':'adv-navigation';document.body.append(uitk);uitk.append(left);left.append(nav);
  const probes=construct(preserved);uitk.append(probes);const ask=document.createElement('div');ask.id='ask-impact-shadow-host';document.body.append(ask);const reply=construct(aiReply);ask.attachShadow({mode:'open'}).append(reply);
  const makeHost=()=>document.createElement(shape==='wrong-host-tag'?'div':'impact-style-isolator');
  window.__host=makeHost();nav.append(window.__host);window.__component=null;
  const mount=()=>{const scope=shape==='light-dom'?window.__host:window.__host.attachShadow({mode:'open'});window.__component=construct(spec);scope.append(window.__component);};
  if(shape!=='late-shadow')mount();
  window.__collect=()=>{const nodes={},roots=[probes,reply,...(window.__component?[window.__component]:[])];for(const r of roots){const w=document.createTreeWalker(r,NodeFilter.SHOW_COMMENT);while(w.nextNode())if(w.currentNode.nodeValue.startsWith('fixed:'))nodes[w.currentNode.nodeValue.slice(6)]=w.currentNode.nextSibling;}
    const elements=[uitk,left,nav,window.__host,ask,...roots.flatMap(r=>[r,...r.querySelectorAll('*')])],texts=[];for(const r of roots){const w=document.createTreeWalker(r,NodeFilter.SHOW_TEXT);while(w.nextNode())if(!Object.values(nodes).includes(w.currentNode))texts.push({node:w.currentNode,value:w.currentNode.nodeValue});}
    window.__proof={nodes,elements:elements.map(element=>({element,parent:element.parentNode,children:[...element.childNodes],attrs:JSON.stringify([...element.attributes].map(a=>[a.name,a.value]))})),texts,controls:elements.filter(e=>e.matches('input,select,textarea')).map(element=>({element,value:element.value,checked:element.checked,disabled:element.disabled})),clicks:0,inputEvents:0};
    for(const e of [...Object.values(nodes).map(n=>n.parentElement),probes.querySelector('a')]){e.addEventListener('click',event=>{event.preventDefault();window.__proof.clicks++;});e.addEventListener('input',()=>window.__proof.inputEvents++);}
  };window.__collect();
  window.__replaceMenu=hidden=>{const old=window.__component.querySelector('.adv-nav-product-tooltip-modal'),fresh=construct(spec).querySelector('.adv-nav-product-tooltip-modal'),host=window.__host,expanded=window.__proof.nodes['expanded-checklists'];fresh.hidden=hidden;old.replaceWith(fresh);window.__collect();return host===window.__host&&expanded===window.__proof.nodes['expanded-checklists'];};
  window.__replaceHost=()=>{const old=window.__host,fresh=makeHost();old.replaceWith(fresh);window.__host=fresh;mount();window.__collect();return old!==fresh&&nav.contains(fresh);};
  window.__attachLate=()=>{mount();window.__collect();};
  </script></body></html>`;
}
documentHTML();
const files=readdirSync(sourceDir,{recursive:true}).filter(f=>path.basename(f)!=='.DS_Store'&&statSync(path.join(sourceDir,f)).isFile());
const sourceHashes=Object.fromEntries(files.map(f=>[f,sha(readFileSync(path.join(sourceDir,f)))]));
const version=JSON.parse(readFileSync(path.join(sourceDir,'manifest.json'))).version;
const temporary=mkdtempSync(path.join(os.tmpdir(),'impact-shared-nav-')),extension=path.join(temporary,'extension');cpSync(sourceDir,extension,{recursive:true});for(const[f,h]of Object.entries(sourceHashes))assert.equal(sha(readFileSync(path.join(extension,f))),h);
const require=createRequire(import.meta.url);let chromium;try{({chromium}=require('playwright-core'));}catch{({chromium}=require(path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core')));}
let context,page,worker,active=scenes[0];const results=[],observations=[];
async function check(name,action){try{results.push({name,status:'PASS',evidence:await action()});console.log('SHARED NAV PASS '+name);}catch(error){results.push({name,status:'FAIL',evidence:error.message});console.log('SHARED NAV FAIL '+name+' '+error.message);}}
async function open(scene=scenes[0],shape='valid',options={}){active=scene;await page.goto('https://'+(options.host||scene.host)+(options.path||scene.path)+'?synthetic-shape='+shape);await page.waitForFunction(()=>!!window.__proof);}
async function settings(enabled,aiEnabled){await worker.evaluate(v=>chrome.storage.local.set({impactCNEnabled:v.enabled,impactCNAIEnabled:v.aiEnabled}),{enabled,aiEnabled});await page.waitForFunction(v=>{const e=document.querySelector('#impact-cn-assistant');return !e||e.dataset.enabled===String(v.enabled)&&e.dataset.aiEnabled===String(v.aiEnabled);},{enabled,aiEnabled});}
async function waitText(translated=true,frame=page,overrides={}){const expected={...(translated?targets:sources),...overrides};try{await frame.waitForFunction(expected=>Object.entries(expected).every(([k,v])=>window.__proof.nodes[k]?.nodeValue===v),expected,{timeout:5000});}catch(error){const actual=await frame.evaluate(()=>Object.fromEntries(Object.entries(window.__proof.nodes).map(([k,n])=>[k,n.nodeValue])));throw new Error(error.message+' '+JSON.stringify({expected,actual}));}}
async function proof(restored=false,frame=page){const bad=await frame.evaluate(({restored,sources})=>{const p=window.__proof;return{elements:p.elements.filter(x=>!x.element.isConnected||x.element.parentNode!==x.parent||x.children.length!==x.element.childNodes.length||x.children.some((n,i)=>n!==x.element.childNodes[i])||x.attrs!==JSON.stringify([...x.element.attributes].map(a=>[a.name,a.value]))).map(x=>x.element.tagName),texts:p.texts.filter(x=>!x.node.isConnected||x.node.nodeValue!==x.value).length,controls:p.controls.filter(x=>x.element.value!==x.value||x.element.checked!==x.checked||x.element.disabled!==x.disabled).length,fixed:Object.entries(p.nodes).filter(([k,n])=>!n.isConnected||restored&&n.nodeValue!==sources[k]).length,inputEvents:p.inputEvents,prototype:Element.prototype.attachShadow===window.__attachShadowPrototype?0:1};},{restored,sources});assert(Object.values(bad).every(v=>Array.isArray(v)?!v.length:v===0),'Native preservation mismatch '+JSON.stringify(bad));}
try{
  context=await chromium.launchPersistentContext(path.join(temporary,'profile'),{executablePath:chromium.executablePath(),channel:'chromium',headless:true,args:[`--disable-extensions-except=${extension}`,`--load-extension=${extension}`]});
  await context.route(/https?:\/\//u,route=>{const u=new URL(route.request().url());if(u.pathname==='/synthetic/shared-nav-frame-parent')return route.fulfill({contentType:'text/html',body:'<!doctype html><iframe src="'+escape('https://'+active.host+active.path)+'"></iframe>'});return route.fulfill({contentType:'text/html',body:documentHTML(u.searchParams.get('synthetic-shape')||'valid')});});
  page=await context.newPage();worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');await settings(true,true);
  await check('Shared navigation translates on notification, unlisted advertiser and existing representative routes',async()=>{for(const scene of scenes){let error;try{await open(scene);await waitText();await proof();}catch(e){error=e.message;}const actual=await page.evaluate(()=>Object.fromEntries(Object.entries(window.__proof.nodes).map(([k,n])=>[k,n.nodeValue])));observations.push({scene:scene.id,status:error?'FAIL':'PASS',...(error?{error}:{}),positions:Object.keys(sources).map(key=>({key,source:sources[key],expected:targets[key],actual:actual[key],status:actual[key]===targets[key]?'PASS':'FAIL'}))});}assert(observations.every(x=>x.status==='PASS'),'Fixed Text failed in '+observations.filter(x=>x.status==='FAIL').map(x=>x.scene).join(', '));return{scenes:5,positions:positionCount,synthetic:true};});
  if(!baseline){
    await check('Translation restore and reopen preserve independent AI, native nodes, events, links, names, counts, inputs and synthetic AI reply',async()=>{await open();await settings(true,true);await waitText();await proof();await settings(false,true);await waitText(false);await proof(true);await settings(true,false);await waitText();await proof();await settings(true,true);await waitText();await proof();const before=page.url();await page.evaluate(()=>{window.__proof.nodes['tooltip-engage'].parentElement.click();document.querySelector('.synthetic-private-probes a').click();});assert.equal(page.url(),before);assert.equal(await page.evaluate(()=>window.__proof.clicks),2);await proof();return{independentSwitchStates:[[true,true],[false,true],[true,false],[true,true]],syntheticNativeClickHandlers:2,newAIHelpers:0,privateProbes:'Fabricated only; no original account or reply content.'};});
    await check('Menu remount, whole navigation host replacement and late open Shadow attachment need no translation switch',async()=>{await settings(true,true);await open();await waitText();for(const hidden of [false,true]){assert(await page.evaluate(hidden=>window.__replaceMenu(hidden),hidden));await waitText();await proof();if(hidden){await page.evaluate(()=>{window.__component.querySelector('.adv-nav-product-tooltip-modal').hidden=false;window.__collect();});await waitText();await proof();}}assert(await page.evaluate(()=>window.__replaceHost()));await waitText();await proof();await open(scenes[0],'late-shadow');await page.waitForTimeout(1200);await page.evaluate(()=>window.__attachLate());await waitText();await proof();await page.reload();await page.waitForFunction(()=>!!window.__proof);await page.waitForTimeout(1200);await page.evaluate(()=>window.__attachLate());await waitText();await proof();return{menuRemounts:2,hiddenMenuReveal:1,wholeHostReplacement:1,lateShadowAttachment:2,lateAttachAfterExistingScanMilliseconds:1200,ordinaryReload:1,translationSwitchOperations:0,attachShadowPrototypeUnchanged:true,scope:'Synthetic native-component lifecycle; not real full-page application acceptance.'};});
    await check('Only the intended top-level advertiser navigation component and fixed identities qualify',async()=>{const seen=[];await settings(true,true);for(const variant of [{shape:'valid',host:'other.example'},{shape:'valid',path:'/secure/partner/synthetic-overview.ihtml'},{shape:'wrong-host'},{shape:'wrong-host-tag'},{shape:'light-dom'}]){await open(scenes[0],variant.shape,variant);await waitText(false);await proof(true);seen.push({...variant,status:'PASS'});}active=scenes[0];await page.goto('https://demo.impact.com/synthetic/shared-nav-frame-parent');const frame=page.frames().find(x=>x!==page.mainFrame())||await page.waitForEvent('frameattached');await frame.waitForFunction(()=>!!window.__proof);await waitText(false,frame);await proof(true,frame);seen.push({shape:'child-frame',status:'PASS'});
      for(const shape of ['wrong-product-test','wrong-product-track','cross-side-nav-witness']){await open(scenes[0],shape);await waitText(true,page,{'tooltip-engage':'Engage','tooltip-checklists':'Checklists','expanded-checklists':'Checklists'});await proof();seen.push({shape,status:'PASS'});}
      const variants=[['wrong-tooltip',{'tooltip-engage':'Engage','tooltip-checklists':'Checklists'}],['wrong-tooltip-leaf',{'tooltip-engage':'Engage'}],['wrong-checklist-test',{'tooltip-checklists':'Checklists'}],['wrong-checklist-track',{'tooltip-checklists':'Checklists'}],['wrong-expanded-test',{'expanded-checklists':'Checklists'}],['wrong-expanded-track',{'expanded-checklists':'Checklists'}]];
      for(const[shape,overrides]of variants){await open(scenes[0],shape);await waitText(true,page,overrides);await proof();seen.push({shape,status:'PASS'});}await open(scenes[0],'incidental-state');await waitText();await proof();seen.push({shape:'incidental-state',status:'PASS',selectedDirectionAndCollapseAreNotIdentities:true});return seen;});
  }else results.push({name:'Candidate linked checks',status:'NOT_RUN',evidence:'Complete old-package baseline records actual fixed Text results, not inferred candidate behavior.'});
  await check('Executed full MV3 snapshot, script, capture and final source retain frozen bytes',async()=>{for(const[f,h]of Object.entries(sourceHashes)){assert.equal(sha(readFileSync(path.join(extension,f))),h);if(requireSourceUnchanged)assert.equal(sha(readFileSync(path.join(sourceDir,f))),h);}assert.equal(sha(readFileSync(path.join(root,capturePath))),sha(captureBytes));assert.equal(sha(readFileSync(fileURLToPath(import.meta.url))),testSHA256);return{sourceFiles:files.length,requireSourceUnchanged,loadedCompleteSnapshotUnchanged:true,inputSHA256:sha(inputBytes),expectationsSHA256:sha(expectationBytes)};});
}finally{
  await context?.close();mkdirSync(reportDir,{recursive:true});const stamp=new Date().toISOString().replace(/[:.]/gu,'-'),inputPath=path.join(reportDir,'test-input-'+stamp+'.json'),expectationsPath=path.join(reportDir,'test-expectations-'+stamp+'.json');writeFileSync(inputPath,inputBytes,{flag:'wx'});writeFileSync(expectationsPath,expectationBytes,{flag:'wx'});
  const report={mode:'SYNTHETIC_SHARED_NAVIGATION_MV3',version,baselineObservation:baseline,sourceDirectory:path.relative(root,sourceDir),sourceSHA256:sourceHashes,testSHA256,capture:{path:capturePath,sha256:sha(captureBytes)},input:{path:path.relative(root,inputPath),sha256:sha(inputBytes),actualSource:'Inline builder object serialized before browser execution; exact same bytes retained after execution.'},expectations:{path:path.relative(root,expectationsPath),sha256:sha(expectationBytes)},positionCount,realSiteAcceptance:false,realNetworkQueries:false,observations,results,status:results.length===5&&results.every(x=>x.status==='PASS')?'PASS':'FAIL'};const reportPath=path.join(reportDir,'test-'+stamp+'.json');writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n',{flag:'wx'});console.log('Shared navigation report: '+reportPath);rmSync(temporary,{recursive:true,force:true});
}
assert(results.length===5&&results.every(x=>x.status==='PASS'),'Shared navigation directed checks failed');

/** Independent, structure-only diagnostics for the two captured entity menus.
 * No capture JSON or full-acceptance report is written by this module. */
import {readFileSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';

const requireProof=(value,message)=>{if(!value){const error=new Error(message);error.safeFinanceAssertion=true;throw error;}};
export function inspectEntityMenuPointer({selector,bodyPath}){
  if(location.origin!=='https://demo.impact.com'||location.pathname!==bodyPath||!['/secure/finance/app/billing-groups-view.ihtml','/secure/finance/app/list-digital-wallets-flow.ihtml'].includes(bodyPath))return{authorized:false};
  const safeClass=name=>/^[A-Za-z_-][A-Za-z0-9_-]{0,85}$/u.test(name)&&!/\d{4,}|[a-f\d]{12,}/iu.test(name);
  const describe=element=>{if(!element)return null;const style=getComputedStyle(element),rect=element.getBoundingClientRect();return{tag:element.tagName,classes:[...element.classList].filter(safeClass),pointerEvents:style.pointerEvents,opacity:style.opacity,display:style.display,visibility:style.visibility,position:style.position,zIndex:style.zIndex,rect:Object.fromEntries(['x','y','width','height'].map(key=>[key,Math.round(rect[key]*100)/100])),tabIndex:element.tabIndex,disabled:element.matches(':disabled,[aria-disabled="true"]'),focused:document.activeElement===element};};
  const controls=[...document.querySelectorAll(selector)].filter(element=>element.getClientRects().length&&getComputedStyle(element).visibility==='visible');
  return{authorized:true,documentPath:location.pathname,selector,visibleControlCount:controls.length,controls:controls.map(element=>{const rect=element.getBoundingClientRect(),x=rect.x+rect.width/2,y=rect.y+rect.height/2,hit=document.elementFromPoint(x,y);const ancestors=[];for(let parent=element.parentElement;parent&&ancestors.length<6;parent=parent.parentElement)ancestors.push(describe(parent));return{structure:describe(element),withinMenuComponent:Boolean(element.closest('.row-overlay .iui-btn-menu')),centerInsideViewport:x>=0&&x<innerWidth&&y>=0&&y<innerHeight,centerReceivesPointer:Boolean(hit&&(hit===element||element.contains(hit))),hit:describe(hit),hitWithinSameRowOverlay:Boolean(hit&&element.closest('.row-overlay')?.contains(hit)),ancestors};}),privateValuesReturned:false,textReturned:false,attributesReturned:false,domModified:false};
}

export function inspectEntityActionsPopup({selector,bodyPath,markBaseline=false,labelAliases=[]}){
  if(location.origin!=='https://demo.impact.com'||location.pathname!==bodyPath||!['/secure/finance/app/billing-groups-view.ihtml','/secure/finance/app/list-digital-wallets-flow.ihtml'].includes(bodyPath))return{authorized:false};
  const visible=element=>{for(let current=element;current;current=current.parentElement){const style=getComputedStyle(current);if(current.hidden||current.getAttribute('aria-hidden')==='true'||style.display==='none'||style.visibility!=='visible'||Number(style.opacity)===0)return false;}return Boolean(element.getClientRects().length);};
  const popupSelector='body > div.iui-dropdown.in-btn-menu.row-action-dropdown',all=[...document.querySelectorAll(popupSelector)],popups=all.filter(visible),button=document.querySelector(selector);
  if(markBaseline){window.__entityActionsPopupBaseline={popups:new WeakSet(popups),popupCount:popups.length,button,buttonOpen:button?.classList.contains('menu-open')};return{authorized:true,baselineMarked:true,visiblePopupCount:popups.length,openerCount:document.querySelectorAll(selector).length,openerClosed:Boolean(button&&!button.classList.contains('menu-open'))};}
  const sources=['Edit','Partner Fees Document Settings','impact.com Fees Document Settings','Funding Account Document Settings'];const canonical=new Map(sources.map(source=>[source,source]));for(const alias of labelAliases)if(sources.includes(alias.source)&&typeof alias.target==='string')canonical.set(alias.target,alias.source);
  const classes=element=>[...element.classList].filter(name=>/^[A-Za-z_-][A-Za-z0-9_-]{0,85}$/u.test(name)&&!/\d{4,}|[a-f\d]{12,}/iu.test(name));
  const baseline=window.__entityActionsPopupBaseline;
  return{authorized:true,documentPath:location.pathname,popupSelector,baselinePopupCount:baseline?.popupCount??null,baselineOpenerClosed:baseline?.buttonOpen===false,openerCount:document.querySelectorAll(selector).length,openerReadOnly:Boolean(button?.matches('button[type="button"]')&&!button.form&&!button.matches(':disabled,[aria-disabled="true"]')),openerMatchesComponent:Boolean(button?.closest('.row-overlay .iui-btn-menu')),visiblePopupCount:popups.length,newVisiblePopupCount:popups.filter(element=>baseline&&!baseline.popups.has(element)).length,openerRetained:baseline?.button===button,openerMenuOpen:Boolean(button?.classList.contains('menu-open')),openMenuButtonCount:[...document.querySelectorAll('.row-overlay .iui-btn-menu button.menu-open')].filter(visible).length,tableMenuOpen:Boolean(button?.closest('.iui-dynamic-table.row-menu-open')),popups:popups.map(popup=>{const lists=[...popup.querySelectorAll('ul.iui-list[role="listbox"]')].filter(visible),items=lists.flatMap(list=>[...list.children].filter(item=>item.matches('li[role="option"]')&&visible(item)));return{tag:popup.tagName,classes:classes(popup),directBodyChild:popup.parentElement===document.body,editableNodeCount:popup.querySelectorAll('input,textarea,select,[contenteditable]').length,formCount:popup.querySelectorAll('form').length,unclassifiedPopupTextNodeCount:(()=>{const walker=document.createTreeWalker(popup,NodeFilter.SHOW_TEXT);let node,count=0;while((node=walker.nextNode()))if(node.nodeValue.trim()&&!canonical.has(node.nodeValue.trim().replace(/\s+/gu,' ')))count++;return count;})(),listCount:lists.length,observedListHierarchy:lists.length===1&&lists[0].parentElement?.tagName==='DIV'&&lists[0].parentElement.parentElement?.tagName==='DIV'&&lists[0].parentElement.parentElement.parentElement===popup,allListChildrenOptions:lists.length===1&&[...lists[0].children].every(item=>item.matches('li[role="option"]')&&visible(item)),allOptionNodeCount:popup.querySelectorAll('li[role="option"]').length,optionCount:items.length,options:items.map((item,index)=>{const fixedNodes=[],walker=document.createTreeWalker(item,NodeFilter.SHOW_TEXT);let node,unclassifiedTextNodeCount=0;while((node=walker.nextNode())){const text=node.nodeValue.trim().replace(/\s+/gu,' ');if(!text)continue;if(canonical.has(text))fixedNodes.push({fixedLabel:canonical.get(text),parentTag:node.parentElement.tagName,parentClasses:classes(node.parentElement),ownerTagPath:(()=>{const tags=[];for(let current=node.parentElement;current&&current!==item;current=current.parentElement)tags.unshift(current.tagName);return tags;})(),directItemChild:node.parentElement===item,directOptionDivSpan:item.children.length===1&&item.firstElementChild.tagName==='DIV'&&node.parentElement.tagName==='SPAN'&&node.parentElement.parentElement===item.firstElementChild,leafTextOwner:node.parentElement.childElementCount===0,nodeIndex:[...node.parentElement.childNodes].indexOf(node)});else unclassifiedTextNodeCount++;}return{index,tag:item.tagName,role:item.getAttribute('role'),childTags:[...item.children].map(child=>child.tagName),fixedNodes,unclassifiedTextNodeCount,disabled:item.matches('[aria-disabled="true"],.disabled')};})};}),privateValuesReturned:false,unknownTextReturned:false,attributesReturned:false};
}

export function completedEntityActionsPopup(evidence,pageId){
  const labels=pageId==='billing-groups'?['Edit','Partner Fees Document Settings','impact.com Fees Document Settings']:pageId==='funding-accounts'?['Edit','Funding Account Document Settings']:[];
  const paths={'billing-groups':'/secure/finance/app/billing-groups-view.ihtml','funding-accounts':'/secure/finance/app/list-digital-wallets-flow.ihtml'};
  return labels.length>0&&evidence.authorized===true&&evidence.documentPath===paths[pageId]&&evidence.baselinePopupCount===0&&evidence.baselineOpenerClosed===true&&evidence.openerCount===1&&evidence.openerReadOnly===true&&evidence.openerMatchesComponent===true&&evidence.visiblePopupCount===1&&evidence.newVisiblePopupCount===1&&evidence.openerRetained===true&&evidence.openerMenuOpen===true&&evidence.openMenuButtonCount===1&&evidence.tableMenuOpen===true&&evidence.popups?.length===1&&evidence.popups[0].directBodyChild===true&&evidence.popups[0].editableNodeCount===0&&evidence.popups[0].formCount===0&&evidence.popups[0].unclassifiedPopupTextNodeCount===0&&evidence.popups[0].listCount===1&&evidence.popups[0].observedListHierarchy===true&&evidence.popups[0].allListChildrenOptions===true&&evidence.popups[0].allOptionNodeCount===labels.length&&evidence.popups[0].optionCount===labels.length&&evidence.popups[0].options.length===labels.length&&evidence.popups[0].options.every((option,index)=>option.tag==='LI'&&option.role==='option'&&option.disabled===false&&option.unclassifiedTextNodeCount===0&&option.fixedNodes.length===1&&option.fixedNodes[0].parentTag==='SPAN'&&JSON.stringify(option.fixedNodes[0].ownerTagPath)===JSON.stringify(pageId==='billing-groups'?['DIV','SPAN','REGULAR-TEXT','SPAN']:['DIV','SPAN','SPAN'])&&option.fixedNodes[0].leafTextOwner===true&&option.fixedNodes[0].fixedLabel===labels[index]);
}

export function entityActionsLabelAliases(dictionary,bodyPath,topURL){
  const top=new URL(topURL);
  return dictionary.entries.filter(entry=>entry.stage==='native-finance'&&entry.scope?.pathExact===bodyPath&&entry.scope.topPaths?.includes(top.pathname)&&Object.entries(entry.scope.topQuery||{}).every(([key,value])=>top.searchParams.getAll(key).length===1&&top.searchParams.get(key)===value)&&['Edit','Partner Fees Document Settings','impact.com Fees Document Settings','Funding Account Document Settings'].includes(entry.source)).map(entry=>({source:entry.source,target:entry.target}));
}

export async function collectEntityActionsCandidates({page,frame,dictionary,pageId,framePath=[]}){
  const bodyPath=new URL(frame.url()).pathname,top=new URL(page.url());
  const entries=dictionary.entries.filter(entry=>entry.id.startsWith(`finance-${pageId}-actions-`)&&entry.scope?.pathExact===bodyPath&&entry.scope.topPaths?.includes(top.pathname)&&Object.entries(entry.scope.topQuery||{}).every(([key,value])=>top.searchParams.getAll(key).length===1&&top.searchParams.get(key)===value));
  requireProof(entries.length===(pageId==='billing-groups'?3:pageId==='funding-accounts'?2:0)&&entries.length>0,'Observed menu fixed rules are absent from the current dictionary');
  const candidates=[];
  for(const entry of entries){
    const nodes=await frame.evaluate(({selector,source})=>{const result=[];for(const element of document.querySelectorAll(selector))for(const node of element.childNodes)if(node.nodeType===Node.TEXT_NODE&&node.nodeValue.trim().replace(/\s+/gu,' ')===source&&element.getRootNode()===document&&element.getClientRects().length&&getComputedStyle(element).visibility==='visible')result.push({tag:element.tagName});return result;},{selector:entry.scope.selector,source:entry.source});
    requireProof(nodes.length===1,'Observed fixed menu Text is absent, ambiguous or outside its precise selector');
    candidates.push({source:entry.source,text:entry.source,normalizedText:entry.source,selector:entry.scope.selector,tag:nodes[0].tag,frameURL:new URL(frame.url()).origin+bodyPath,frameQuery:{},framePath,shadowPath:[],topPath:top.pathname,topPaths:[top.pathname],topQuery:{u:top.searchParams.get('u')},route:pageId,kind:'control-label',observedStates:['deep-existing-entity-actions-menu'],menuEvidence:'unique new native Actions portal with fixed option sequence and one trusted opener click',ruleId:entry.id,privateValuesSaved:false});
  }
  return candidates;
}

export async function entityDocumentFramePath(frame){
  const routes={'/secure/finance/app/billing-groups-view.ihtml':'/secure/advertiser/finance/fr/billing-groups.ihtml','/secure/finance/app/list-digital-wallets-flow.ihtml':'/secure/advertiser/finance/fr/funding-accounts.ihtml'},body=new URL(frame.url()),parent=frame.parentFrame(),top=parent&&new URL(parent.url());
  requireProof(body.origin==='https://demo.impact.com'&&routes[body.pathname]&&top?.origin===body.origin&&top.pathname===routes[body.pathname]&&!parent.parentFrame()&&top.searchParams.getAll('u').length===1&&top.searchParams.get('u')===body.pathname,'Entity iframe is outside its observed direct static top/body chain');
  const parts=[];let current=frame;
  while(current.parentFrame()){
    const parent=current.parentFrame(),handle=await current.frameElement();
    const selector=await handle.evaluate(element=>{const pieces=[];for(let node=element;node?.nodeType===Node.ELEMENT_NODE;node=node.parentElement){const siblings=node.parentElement?[...node.parentElement.children].filter(item=>item.tagName===node.tagName):[node];pieces.unshift(node.tagName.toLowerCase()+':nth-of-type('+(siblings.indexOf(node)+1)+')');}return pieces.join(' > ');});
    const locator=parent.locator(selector);requireProof(await locator.count()===1,'Actual entity iframe structural path is ambiguous');const matched=await locator.elementHandle();requireProof(await matched.contentFrame()===current,'Actual structural iframe path points to another document');
    parts.unshift({selector,parentPath:new URL(parent.url()).origin+new URL(parent.url()).pathname,framePath:new URL(current.url()).origin+new URL(current.url()).pathname});current=parent;
  }
  return parts;
}

/** Private comparison values stay exclusively in the current document's memory. */
export function checkEntityMenuIdentity({entries,key,baseline=false}){
  const rows=[];
  for(const entry of entries)for(const element of document.querySelectorAll(entry.scope.selector))for(const node of element.childNodes)if(node.nodeType===Node.TEXT_NODE&&node.nodeValue.trim()===entry.source&&element.getRootNode()===document)rows.push({entry,node,element,original:node.nodeValue});
  if(baseline){
    const popup=document.querySelector('body > div.iui-dropdown.in-btn-menu.row-action-dropdown');
    const nativeNodes=popup?[popup,...popup.querySelectorAll('*')]:[];
    const attributes=element=>[...element.attributes].map(attribute=>[attribute.name,attribute.value]);
    const data=[];for(const cell of document.querySelectorAll('.table-body .table-cell,tbody td,[role="cell"]')){const walker=document.createTreeWalker(cell,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode()))if(node.nodeValue.trim())data.push({node,element:node.parentElement,original:node.nodeValue});}
    const inputs=[...document.querySelectorAll('input,textarea,select')].map(element=>({element,value:element.value,checked:element.checked})),links=[...document.querySelectorAll('a[href]')].map(element=>({element,href:element.getAttribute('href')}));
    window.__entityMenuIdentity ||= {};window.__entityMenuIdentity[key]={rows,data,inputs,links,nativeNodes:nativeNodes.map(element=>({element,children:[...element.childNodes],attributes:attributes(element)}))};
  }
  const proof=window.__entityMenuIdentity?.[key];if(!proof)return{baselinePresent:false};
  const changedAttributes=proof.nativeNodes.filter(item=>JSON.stringify([...item.element.attributes].map(attribute=>[attribute.name,attribute.value]))!==JSON.stringify(item.attributes)).length;
  const attributeChanges=proof.nativeNodes.flatMap(item=>{const before=new Map(item.attributes),after=new Map([...item.element.attributes].map(attribute=>[attribute.name,attribute.value]));return [...new Set([...before.keys(),...after.keys()])].filter(name=>before.get(name)!==after.get(name)).map(name=>{let changedStyleProperties;if(name==='style'){const detached=document.createElement('div');detached.setAttribute('style',before.get(name)||'');changedStyleProperties=[...new Set([...detached.style,...item.element.style])].filter(property=>detached.style.getPropertyValue(property)!==item.element.style.getPropertyValue(property));}return{tag:item.element.tagName,popupRoot:item.element.parentElement===document.body,name,changedStyleProperties,valuesReturned:false};});});
  return{baselinePresent:true,menuTextNodes:proof.rows.length,entryIds:proof.rows.map(item=>item.entry.id),textNodesRetained:proof.rows.every(item=>item.node.isConnected&&item.node.parentElement===item.element),nativeElementsRetained:proof.nativeNodes.every(item=>item.element.isConnected),nativeChildrenRetained:proof.nativeNodes.every(item=>item.children.length===item.element.childNodes.length&&item.children.every((child,index)=>item.element.childNodes[index]===child)),changedNativeAttributes:changedAttributes,attributeChanges,targetMatchedNodes:proof.rows.filter(item=>item.node.nodeValue.trim()===item.entry.target).length,originalTextRestored:proof.rows.every(item=>item.node.nodeValue===item.original),privateDataNodeCount:proof.data.length,privateDataUnchanged:proof.data.every(item=>item.node.isConnected&&item.node.parentElement===item.element&&item.node.nodeValue===item.original),inputCount:proof.inputs.length,inputsUnchanged:proof.inputs.every(item=>item.element.isConnected&&item.element.value===item.value&&item.element.checked===item.checked),linkCount:proof.links.length,linksUnchanged:proof.links.every(item=>item.element.isConnected&&item.element.getAttribute('href')===item.href),privateValuesReturned:false,inputValuesReturned:false};
}

/** Shared capture/replay contract. Hover and click are native, bounded and single-use. */
export async function performEntityActionsMenu({page,frame,nameEvidence,selector,dictionary}){
  const routes={'/secure/advertiser/finance/fr/billing-groups.ihtml':{id:'billing-groups',body:'/secure/finance/app/billing-groups-view.ihtml'},'/secure/advertiser/finance/fr/funding-accounts.ihtml':{id:'funding-accounts',body:'/secure/finance/app/list-digital-wallets-flow.ihtml'}};
  const top=new URL(page.url()),route=routes[top.pathname],documentURL=new URL(frame.url());
  requireProof(top.origin==='https://demo.impact.com'&&route&&top.searchParams.getAll('u').length===1&&top.searchParams.get('u')===route.body&&documentURL.origin===top.origin&&documentURL.pathname===route.body,'Native entity menu left its exact route/document/query');
  const frames=page.frames().filter(item=>{const url=new URL(item.url());return url.origin===top.origin&&url.pathname===route.body;});requireProof(frames.length===1&&frames[0]===frame,'Native entity menu document is absent or ambiguous');
  requireProof(nameEvidence?.headerEvidence?.fixedHeaderName==='Name'&&nameEvidence.nameTextReturned===false&&Number.isInteger(nameEvidence.cellIndex),'Native menu needs the captured Name-column evidence');
  const name=frame.locator(nameEvidence.selector).filter({visible:true});requireProof(await name.count()===1,'Native menu needs one exact Name affordance before hover');
  const nameLabels=['Name',...dictionary.entries.filter(entry=>entry.stage==='native-finance'&&entry.source==='Name'&&entry.scope?.pathExact===route.body&&entry.scope.topPaths?.includes(top.pathname)).map(entry=>entry.target)];
  const verifiedName=await name.evaluate((element,{index,labels})=>{const cell=element.closest('.table-cell,td,[role="cell"]'),row=cell?.parentElement,table=row?.closest('.iui-data-table,.iui-data-view,table,[role="table"]');if(!cell||!row?.matches('.table-row,tr,[role="row"]')||!table||element.matches('input,textarea,select,[contenteditable],:disabled,[aria-disabled="true"]'))return false;const visible=node=>Boolean(node.getClientRects().length)&&getComputedStyle(node).visibility==='visible',primary=[...table.querySelectorAll('[data-testid^="uicl-data-table-column-label-"]')].filter(visible),headers=primary.length?primary:[...table.querySelectorAll('th,[role="columnheader"],.table-header .header-cell,.table-header .table-cell')].filter(visible),cells=[...row.children].filter(node=>node.matches('.table-cell,td,[role="cell"]'));return cells.indexOf(cell)===index&&labels.includes(headers[index]?.textContent.trim())&&headers.filter(node=>labels.includes(node.textContent.trim())).length===1&&(!element.hasAttribute('href')||new URL(element.getAttribute('href'),location.href).origin===location.origin)&&(element.matches('a,button,[role="link"],[role="button"]')||getComputedStyle(element).cursor==='pointer');},{index:nameEvidence.cellIndex,labels:nameLabels});
  requireProof(verifiedName,'Native menu Name-column proof no longer matches the actual document');
  const evidence={pageId:route.id,nameColumnVerified:true,nameColumnIndex:nameEvidence.cellIndex,nameHoverPerformed:false,buttonHoverPerformed:false,normalClickAttempts:0,forcedClick:false,scriptClick:false,financialOperations:0,submittedForms:0,privateValuesReturned:false};
  await name.hover({timeout:3000});evidence.nameHoverPerformed=true;
  const button=frame.locator(selector).filter({visible:true});await button.waitFor({state:'visible',timeout:10000});requireProof(await button.count()===1,'Native menu opener is absent or ambiguous after Name hover');
  requireProof(await button.evaluate(element=>element.matches('button[type="button"]')&&Boolean(element.closest('.row-overlay .iui-btn-menu'))&&!element.form&&!element.matches(':disabled,[aria-disabled="true"]')),'Native menu opener lost its exact read-only component');
  evidence.sameNativeTable=await frame.evaluate(({nameSelector,buttonSelector})=>{const name=document.querySelector(nameSelector),button=document.querySelector(buttonSelector),table=name?.closest('.iui-dynamic-table');return Boolean(table&&button?.closest('.iui-dynamic-table')===table);},{nameSelector:nameEvidence.selector,buttonSelector:selector});
  requireProof(evidence.sameNativeTable,'Native menu Name and opener do not belong to the same actual dynamic table');
  evidence.beforeHover=await frame.evaluate(inspectEntityMenuPointer,{selector,bodyPath:route.body});
  await frame.evaluate(selector=>{const button=document.querySelector(selector),proof={trustedClicks:0,untrustedClicks:0,trustedPointerOvers:0};const listener=event=>{if(button===event.target||button.contains(event.target)){if(event.type==='click')proof[event.isTrusted?'trustedClicks':'untrustedClicks']++;if(event.type==='pointerover'&&event.isTrusted)proof.trustedPointerOvers++;}};for(const type of ['click','pointerover'])document.addEventListener(type,listener,true);window.__entityActionsEvents={proof,cleanup:()=>{for(const type of ['click','pointerover'])document.removeEventListener(type,listener,true);}};},selector);
  const labelAliases=entityActionsLabelAliases(dictionary,route.body,page.url());
  try{
    await button.hover({timeout:3000});evidence.buttonHoverPerformed=true;evidence.afterHover=await frame.evaluate(inspectEntityMenuPointer,{selector,bodyPath:route.body});
    requireProof(evidence.afterHover.visibleControlCount===1&&evidence.afterHover.controls[0].centerReceivesPointer,'Native menu pointer is not ready after normal hover');
    evidence.baseline=await frame.evaluate(inspectEntityActionsPopup,{selector,bodyPath:route.body,markBaseline:true,labelAliases});requireProof(evidence.baseline.visiblePopupCount===0&&evidence.baseline.openerCount===1&&evidence.baseline.openerClosed===true,'Native menu must start closed with no existing target popup');
    evidence.normalClickAttempts=1;
    try{await button.click({timeout:10000});}catch(cause){const message=String(cause.message||'');evidence.clickFailure={timeout:cause.name==='TimeoutError',pointerInterception:/intercepts pointer events/u.test(message),notVisible:/not visible/u.test(message),unstable:/not stable/u.test(message)};throw Object.assign(new Error('Native entity menu normal click did not complete; no forced click or retry'),{safeFinanceAssertion:true});}
    const deadline=Date.now()+10000;while(Date.now()<deadline){evidence.popup=await frame.evaluate(inspectEntityActionsPopup,{selector,bodyPath:route.body,labelAliases});if(completedEntityActionsPopup(evidence.popup,route.id))break;await page.waitForTimeout(100);}
    requireProof(completedEntityActionsPopup(evidence.popup,route.id),'Normal click did not expose one new complete Actions popup bound to its opener');
  }catch(error){error.financeEvidence=evidence;throw error;}
  finally{evidence.events=await frame.evaluate(()=>{const events=window.__entityActionsEvents;events.cleanup();delete window.__entityActionsEvents;return events.proof;});}
  requireProof(evidence.events.trustedClicks===1&&evidence.events.untrustedClicks===0,'Native Actions menu did not receive exactly one trusted click');return evidence;
}

export async function runFinanceMenuChecks(options){
  const {page,context,root,runtime,translation,routePage,onProgress=()=>{}}=options,control=options.options||options;
  const folder=path.resolve(root,control.menuOutputDirectory||'');
  requireProof(path.dirname(folder)===path.join(root,'artifacts')&&/^finance-menus-[A-Za-z0-9+_-]+$/u.test(path.basename(folder)),'Menu diagnostic requires an independent existing stage directory');
  requireProof(/^[a-z0-9-]+$/u.test(control.menuReportName||''),'Menu diagnostic requires a unique safe filename');
  const bytes=readFileSync(path.join(root,'impact-cn-mod/dict.js')),sandbox={};vm.createContext(sandbox);vm.runInContext(bytes.toString(),sandbox);const dictionary=sandbox.IMPACT_CN_DICTIONARY;
  const report={mode:'REAL_NETWORK_ENTITY_MENU_DIAGNOSTIC',date:new Date().toISOString(),version:dictionary.version,dictionarySha256:createHash('sha256').update(bytes).digest('hex'),operation:control.menuOperation||'runtime',financialOperations:0,submittedForms:0,savedSettings:0,privateValuesReturned:false,screenshotsSaved:0,fullConversationSaved:false,completePageCoverage:false,completeAcceptance:false};
  if(control.menuInitialSettings){requireProof(typeof control.menuInitialSettings.translationEnabled==='boolean'&&typeof control.menuInitialSettings.aiEnabled==='boolean','Initial menu toggle settings must be explicit booleans');page.__impactMenuInitialSettings={...control.menuInitialSettings};report.initialSettingsSource='coordinator verified initial runtime report';}
  try{
    if(['runtime','observe'].includes(report.operation)){
    const state=await runtime();requireProof(state.contentScriptStates===1&&state.versions[0]===dictionary.version,'Actual host extension version differs from current dictionary');
    const extensionPath=path.join(root,'impact-cn-mod'),extensionId=createHash('sha256').update(extensionPath).digest('hex').slice(0,32).split('').map(digit=>String.fromCharCode(97+parseInt(digit,16))).join('');
    const popups=context.pages().filter(item=>item.url()===`chrome-extension://${extensionId}/popup.html`);requireProof(popups.length===1,'Current source extension popup is absent or ambiguous');
    report.runtime=await popups[0].evaluate(async()=>{const state=await chrome.tabs.sendMessage(window.__financeHostTab,{type:'impact-cn:get-state'});return{manifestVersion:chrome.runtime.getManifest().version,contentVersion:state.version,translationEnabled:state.enabled,aiEnabled:state.aiEnabled,errorPresent:Boolean(state.error),extensionIdMatches:chrome.runtime.id===location.hostname};});
    page.__impactMenuInitialSettings ||= {translationEnabled:report.runtime.translationEnabled,aiEnabled:report.runtime.aiEnabled};
    const management=await context.newPage();try{await management.goto('chrome://extensions/');await management.locator('extensions-item').waitFor({state:'attached',timeout:10000});report.loadedExtension=await management.locator('extensions-item').evaluateAll((items,{extensionPath,extensionId})=>({cardCount:items.length,expectedCardCount:items.filter(item=>item.id===extensionId).length,cards:items.map(item=>({expectedId:item.id===extensionId,version:item.data?.version||null,sourcePathMatches:item.data?.path===extensionPath,enabled:item.data?.state==='ENABLED',unpacked:item.data?.location==='UNPACKED',pathFieldPresent:typeof item.data?.path==='string'}))}),{extensionPath,extensionId});}finally{await management.close();await page.bringToFront();}
    requireProof(report.runtime.manifestVersion===dictionary.version&&report.loadedExtension.expectedCardCount===1&&report.loadedExtension.cards.every(item=>item.expectedId&&item.sourcePathMatches&&item.enabled&&item.unpacked),'Loaded extension identity/path/version is not verified');
    report.runtime.topPath=new URL(page.url()).pathname;
    page.__impactMenuRuntime={runtime:report.runtime,loadedExtension:report.loadedExtension};
    }else{
      requireProof(page.__impactMenuRuntime,'No independently verified extension session');report.sessionRuntime=page.__impactMenuRuntime;report.currentToggles=await page.locator('#impact-cn-assistant').evaluate(element=>({translationEnabled:element.dataset.enabled==='true',aiEnabled:element.dataset.aiEnabled==='true'}));
    }
    if(report.operation==='observe'){
      const capture=JSON.parse(readFileSync(path.join(root,'docs/finance-dom-scan.json'),'utf8'));
      requireProof(['billing-groups','funding-accounts'].includes(control.menuPageId),'Only the two observed entity menu pages are allowed');
      const definition=capture.pages.find(item=>item.id===control.menuPageId),actions=definition.safeActions.filter(item=>item.capturedState==='deep-existing-entity-actions-menu');requireProof(actions.length===1,'Observed entity menu sequence is absent or ambiguous');const action=actions[0];
      await routePage(definition);await translation(control.menuStartEnabled===true);await options.aiEnabled(control.menuAIEnabled===true);
      report.nativeComparisonToggles=await page.locator('#impact-cn-assistant').evaluate(element=>({translationEnabled:element.dataset.enabled==='true',aiEnabled:element.dataset.aiEnabled==='true'}));
      const bodyPath=new URL(action.frameURL||action.steps[0].frameURL).pathname;
      const deadline=Date.now()+15000;let frames=[];while(Date.now()<deadline){frames=page.frames().filter(frame=>{const url=new URL(frame.url());return url.origin==='https://demo.impact.com'&&url.pathname===bodyPath;});if(frames.length===1&&await frames[0].locator(action.steps[0].selector).filter({visible:true}).count()===1)break;await page.waitForTimeout(150);}requireProof(frames.length===1,'Exact entity document is absent or ambiguous');const frame=frames[0];
      const replay=await import(`${pathToFileURL(path.join(root,'scripts/finance-live-checks.mjs')).href}?revision=${Date.now()}`),deep=await import(`${pathToFileURL(path.join(root,'scripts/finance-deep-capture.mjs')).href}?revision=${Date.now()}`);
      await frame.evaluate(deep.inspectFinanceControls,{kind:'mark-popup-baseline'});
      await frame.evaluate(selector=>{const name=document.querySelector(selector);const proof={trustedClicks:0,untrustedClicks:0};const listener=event=>{if(name===event.target||name.contains(event.target))proof[event.isTrusted?'trustedClicks':'untrustedClicks']++;};document.addEventListener('click',listener,true);window.__entityNameEvents={proof,cleanup:()=>document.removeEventListener('click',listener,true)};},action.steps[0].selector);
      try{await replay.replayReadOnlyFinanceStep({page,action,step:action.steps[0],index:0,reportQuery:false,entitySequence:true,dictionary});}finally{report.nameEvents=await frame.evaluate(()=>{const proof=window.__entityNameEvents;proof.cleanup();delete window.__entityNameEvents;return proof.proof;});}
      const locator=frame.locator(action.steps[1].selector).filter({visible:true});await locator.waitFor({state:'visible',timeout:10000});
      report.pageId=definition.id;report.newMenu=await frame.evaluate(deep.inspectFinanceControls,{kind:'new-row-overlay-menu'});
      report.pointer=await frame.evaluate(inspectEntityMenuPointer,{selector:action.steps[1].selector,bodyPath});
      page.__impactMenuDiagnostic={definition,action,frame,bodyPath,dictionary,originalTranslation:report.runtime.translationEnabled,originalAI:report.runtime.aiEnabled};
    }
    if(report.operation==='native-flow'){
      const steps=[];
      for(const operation of ['observe','replay-menu']){
        const result=await runFinanceMenuChecks({...options,options:{...control,menuOperation:operation,menuReportName:control.menuReportName+'-'+operation}});steps.push(result);requireProof(result.status==='OBSERVED','Native menu flow stopped at '+operation+'; no retry');
      }
      const clicked=steps.at(-1);requireProof(completedEntityActionsPopup(clicked.menuReplay.popup,control.menuPageId),'A unique newly visible entity Actions popup with the observed fixed options was not proved');
      requireProof(clicked.menuReplay.events.trustedClicks===1&&clicked.menuReplay.events.untrustedClicks===0,'Native menu did not receive exactly one trusted button click');
      report.pageId=control.menuPageId;report.nativeSteps=steps.map(item=>({operation:item.operation,status:item.status,nameEvents:item.nameEvents,menuReplay:item.menuReplay}));report.popup=clicked.menuReplay.popup;report.nativeMenuComplete=true;
    }
    if(report.operation==='acceptance'){
      const off=await runFinanceMenuChecks({...options,options:{...control,menuOperation:'native-flow',menuReportName:control.menuReportName+'-native-off',menuStartEnabled:false,menuAIEnabled:false}});
      requireProof(off.nativeMenuComplete===true,'OFF native menu did not complete');
      const current=page.__impactMenuDiagnostic,{frame,bodyPath,action}=current,entries=JSON.parse(JSON.stringify(dictionary.entries.filter(entry=>entry.id.startsWith(`finance-${control.menuPageId}-actions-`))));
      const candidateFramePath=await entityDocumentFramePath(frame);
      report.candidates=await collectEntityActionsCandidates({page,frame,dictionary,pageId:control.menuPageId,framePath:candidateFramePath});
      const key='entity-menu-'+Date.now();report.identityStates=[];
      const initial=await frame.evaluate(checkEntityMenuIdentity,{entries,key,baseline:true});requireProof(initial.menuTextNodes===entries.length,'Every observed menu Text must be represented by a current exact rule');report.identityStates.push({state:'OFF',...initial});
      try{
        await options.aiEnabled(true);await translation(true);await page.waitForTimeout(300);report.identityStates.push({state:'ON',...await frame.evaluate(checkEntityMenuIdentity,{entries,key})});
        requireProof(report.identityStates[1].targetMatchedNodes===entries.length,'One or more observed fixed menu Text nodes did not translate');
        await translation(false);await page.waitForTimeout(200);report.identityStates.push({state:'OFF_RESTORED',...await frame.evaluate(checkEntityMenuIdentity,{entries,key})});
        requireProof(report.identityStates[2].originalTextRestored,'Observed menu original Text was not restored');
      }finally{const settings=page.__impactMenuInitialSettings;await translation(settings.translationEnabled);await options.aiEnabled(settings.aiEnabled);}
      const on=await runFinanceMenuChecks({...options,options:{...control,menuOperation:'native-flow',menuReportName:control.menuReportName+'-native-on',menuStartEnabled:true,menuAIEnabled:true}});
      requireProof(on.nativeMenuComplete===true,'ON native menu did not complete');
      report.nativeOffComplete=true;report.nativeOnComplete=true;
      requireProof(report.identityStates.every(state=>state.textNodesRetained&&state.nativeElementsRetained&&state.nativeChildrenRetained&&state.changedNativeAttributes===0&&state.privateDataUnchanged&&state.inputsUnchanged&&state.linksUnchanged),'Menu translation changed native identity, attributes or protected data');
      report.pageId=control.menuPageId;report.nativeOffComplete=true;report.nativeOnComplete=true;report.phaseMenuComplete=true;report.pageErrors=options.getPageErrors?.()??null;
      requireProof(report.pageErrors===0,'Current test window reported page errors');
      const settings=page.__impactMenuInitialSettings;await translation(settings.translationEnabled);await options.aiEnabled(settings.aiEnabled);
      report.restoredToggles=await page.locator('#impact-cn-assistant').evaluate(element=>({translationEnabled:element.dataset.enabled==='true',aiEnabled:element.dataset.aiEnabled==='true'}));
    }
    if(report.operation==='replay-menu'){
      const current=page.__impactMenuDiagnostic;requireProof(current&&current.definition.id===control.menuPageId,'No current observed entity menu for this page');
      const replay=await import(`${pathToFileURL(path.join(root,'scripts/finance-live-checks.mjs')).href}?revision=${Date.now()}`);
      report.pageId=control.menuPageId;report.menuReplay=await replay.replayReadOnlyFinanceStep({page,action:current.action,step:current.action.steps[1],index:1,reportQuery:false,entitySequence:true,dictionary});
    }
    if(report.operation==='attribute-writer'){
      const current=page.__impactMenuDiagnostic;requireProof(current&&current.definition.id===control.menuPageId,'No current observed entity menu for attribute writer diagnosis');
      const {frame}=current,framePath=await entityDocumentFramePath(frame);requireProof(framePath.length===1,'Only the observed direct iframe may be inspected');
      await translation(false);await options.aiEnabled(false);await page.waitForTimeout(300);
      const cdp=await context.newCDPSession(page),scripts=new Map(),pauses=[];let breakpointNode;
      cdp.on('Debugger.scriptParsed',event=>scripts.set(event.scriptId,event.url));
      const classify=url=>{try{const value=new URL(url);return value.protocol==='chrome-extension:'?'extension':value.hostname==='demo.impact.com'||value.hostname.endsWith('.impact.com')?'native-impact':value.protocol==='https:'?'other-network':'local-or-evaluation';}catch{return 'local-or-evaluation';}};
      cdp.on('Debugger.paused',event=>{const frames=event.callFrames.slice(0,12).map(item=>({source:classify(item.url||scripts.get(item.location.scriptId)||''),line:item.location.lineNumber+1,column:item.location.columnNumber+1}));pauses.push({reason:event.reason,frames});void cdp.send('Debugger.resume').catch(()=>{});});
      try{
        await cdp.send('DOM.enable');await cdp.send('Debugger.enable');
        const {root:documentNode}=await cdp.send('DOM.getDocument',{depth:1}),iframe=await cdp.send('DOM.querySelector',{nodeId:documentNode.nodeId,selector:framePath[0].selector});requireProof(iframe.nodeId>0,'Verified iframe not found by CDP');
        const described=await cdp.send('DOM.describeNode',{nodeId:iframe.nodeId,depth:1,pierce:true}),child=described.node.contentDocument;requireProof(Boolean(child?.nodeId),'Actual iframe DOM document is unavailable');
        const target=await cdp.send('DOM.querySelector',{nodeId:child.nodeId,selector:'body > div.iui-dropdown.in-btn-menu.row-action-dropdown'});requireProof(target.nodeId>0,'Current menu portal missing before writer diagnosis');breakpointNode=target.nodeId;
        await cdp.send('DOMDebugger.setDOMBreakpoint',{nodeId:breakpointNode,type:'attribute-modified'});
        await translation(true);await page.waitForTimeout(350);
        report.pageId=control.menuPageId;report.attributeWriter={mode:'READ_ONLY_CDP_ATTRIBUTE_BREAKPOINT',pauseCount:pauses.length,pauses,directExtensionWrites:pauses.filter(item=>item.frames[0]?.source==='extension').length,directNativeImpactWrites:pauses.filter(item=>item.frames[0]?.source==='native-impact').length,sourceURLsReturned:false,pageTextReturned:false};
      }finally{if(breakpointNode)await cdp.send('DOMDebugger.removeDOMBreakpoint',{nodeId:breakpointNode,type:'attribute-modified'}).catch(()=>{});await cdp.send('Debugger.disable').catch(()=>{});await cdp.detach();const settings=page.__impactMenuInitialSettings;await translation(settings.translationEnabled);await options.aiEnabled(settings.aiEnabled);}
    }
    if(['compare','hover','hover-name','click','inspect','popup'].includes(report.operation)){
      const current=page.__impactMenuDiagnostic;requireProof(current&&current.definition.id===control.menuPageId,'No current observed entity menu for this page');
      const {action,frame,bodyPath}=current,url=new URL(page.url());requireProof(url.pathname===action.sourceTopPath&&Object.entries(action.sourceTopQuery).every(([key,value])=>url.searchParams.getAll(key).length===1&&url.searchParams.get(key)===value),'Entity inspection left its exact top route/query');
      const selector=action.steps[1].selector,button=frame.locator(selector).filter({visible:true});
      report.pageId=current.definition.id;const inspect=()=>frame.evaluate(inspectEntityMenuPointer,{selector,bodyPath}),labelAliases=entityActionsLabelAliases(dictionary,bodyPath,page.url());report.before=await inspect();
      if(!['inspect','hover-name','popup'].includes(report.operation)){requireProof(await button.count()===1,'Current entity menu button is absent or ambiguous');requireProof(await button.evaluate(element=>element.matches('button[type="button"]')&&Boolean(element.closest('.row-overlay .iui-btn-menu'))&&!element.form&&!element.disabled),'Entity menu no longer has its observed read-only component');}
      if(report.operation==='compare'){
        const original=await page.locator('#impact-cn-assistant').getAttribute('data-enabled');try{await translation(true);report.on=await inspect();await translation(false);report.offRestored=await inspect();}finally{await translation(original!=='false');}
      }else if(report.operation==='popup')report.popup=await frame.evaluate(inspectEntityActionsPopup,{selector,bodyPath,labelAliases});
      else if(report.operation!=='inspect'){
        const deep=await import(`${pathToFileURL(path.join(root,'scripts/finance-deep-capture.mjs')).href}?revision=${Date.now()}`);
        await frame.evaluate(deep.inspectFinanceControls,{kind:'mark-popup-baseline'});
        if(report.operation==='click')report.popupBaseline=await frame.evaluate(inspectEntityActionsPopup,{selector,bodyPath,markBaseline:true});
        await frame.evaluate(({selector})=>{const button=document.querySelector(selector),events=[];const listener=event=>{if(events.length<60&&['pointerover','pointerout','click','keydown'].includes(event.type))events.push({type:event.type,trusted:event.isTrusted,withinButton:button===event.target||button.contains(event.target),withinOverlay:Boolean(event.target.closest?.('.row-overlay')),key:event.type==='keydown'&&['Enter',' ','Escape','Tab'].includes(event.key)?event.key:null});};for(const type of ['pointerover','pointerout','click','keydown'])document.addEventListener(type,listener,true);window.__entityMenuEvents={events,cleanup:()=>{for(const type of ['pointerover','pointerout','click','keydown'])document.removeEventListener(type,listener,true);}};},{selector});
        try{
          if(report.operation==='hover-name'){const name=frame.locator(action.steps[0].selector).filter({visible:true});requireProof(await name.count()===1,'Captured Name affordance is absent or ambiguous before hover');await name.hover({timeout:3000});}
          else if(report.operation==='hover')await button.hover({timeout:3000});
          else{requireProof(report.before.controls.length===1&&report.before.controls[0].centerReceivesPointer,'No fresh normal pointer readiness proof for a click');const replay=await import(`${pathToFileURL(path.join(root,'scripts/finance-live-checks.mjs')).href}?revision=${Date.now()}`);report.menuReplay=await replay.replayReadOnlyFinanceStep({page,action,step:action.steps[1],index:1,reportQuery:false,entitySequence:true,dictionary});}
        }finally{report.events=await frame.evaluate(()=>{const proof=window.__entityMenuEvents;proof.cleanup();delete window.__entityMenuEvents;return proof.events;});report.after=await inspect();report.newPopup=await frame.evaluate(deep.inspectFinanceControls,{kind:'popup-structure'});report.newEdit=await frame.evaluate(deep.inspectFinanceControls,{kind:'new-static-edit'});report.popup=await frame.evaluate(inspectEntityActionsPopup,{selector,bodyPath,labelAliases});}
      }
    }
    report.status='OBSERVED';
  }catch(error){if(error.name==='SyntaxError'){report.safeSyntaxDiagnostic={message:String(error.message).replace(/https?:[^\s]+/gu,'<url>').replace(/\b\d{4,}\b/gu,'<number>').slice(0,180),localLocations:String(error.stack||'').split('\n').filter(line=>/finance-(?:menu|live|deep)-checks|finance-deep-capture/u.test(line)).map(line=>line.match(/finance-[A-Za-z-]+\.mjs:\d+:\d+/u)?.[0]).filter(Boolean)};}report.status='FAIL';report.failure={errorType:error.name,reason:error.safeFinanceAssertion?error.message:'Menu diagnostic failed; private browser detail omitted',...(error.financeEvidence?{structure:error.financeEvidence}:{})};}
  finally{if(report.operation==='acceptance'&&page.__impactMenuInitialSettings){const settings=page.__impactMenuInitialSettings;await translation(settings.translationEnabled);await options.aiEnabled(settings.aiEnabled);report.restoredToggles=await page.locator('#impact-cn-assistant').evaluate(element=>({translationEnabled:element.dataset.enabled==='true',aiEnabled:element.dataset.aiEnabled==='true'}));}report.pageErrors=options.getPageErrors?.()??null;}
  writeFileSync(path.join(folder,control.menuReportName+'.json'),JSON.stringify(report,null,2)+'\n',{flag:'wx'});
  onProgress('ENTITY_MENU_DIAGNOSTIC '+JSON.stringify({file:path.join(folder,control.menuReportName+'.json'),operation:report.operation,pageId:report.pageId,status:report.status,runtime:report.runtime,currentToggles:report.currentToggles,beforeControlCount:report.before?.visibleControlCount,afterControlCount:report.after?.visibleControlCount,events:report.events,newEditCount:report.newEdit?.candidates.length,failure:report.failure}));return report;
}

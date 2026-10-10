/** Current real finance layout metrics only; never reads business data into reports. */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';

export function inspectACHLayout({entries,key,baseline=false}){
  const normalize=value=>value.trim().replace(/\s+/gu,' ');
  const visible=element=>element?.isConnected&&element.getClientRects().length&&getComputedStyle(element).visibility==='visible';
  const rect=box=>Object.fromEntries(['x','y','left','top','right','bottom','width','height'].map(name=>[name,Math.round(box[name]*100)/100]));
  const outside=(a,b)=>a.left<b.left-1||a.right>b.right+1||a.top<b.top-1||a.bottom>b.bottom+1;
  const structuralClass=value=>/^[A-Za-z_-][A-Za-z0-9_-]{0,80}$/u.test(value)&&!/\d{4,}|[a-f\d]{12,}/iu.test(value);
  const describe=element=>{const style=getComputedStyle(element);return{tag:element.tagName,classNames:[...element.classList].filter(structuralClass),rect:rect(element.getBoundingClientRect()),clientWidth:element.clientWidth,scrollWidth:element.scrollWidth,clientHeight:element.clientHeight,scrollHeight:element.scrollHeight,font:style.font,fontSize:style.fontSize,lineHeight:style.lineHeight,whiteSpace:style.whiteSpace,overflowX:style.overflowX,overflowY:style.overflowY,display:style.display,position:style.position,paddingLeft:style.paddingLeft,paddingRight:style.paddingRight,gap:style.gap,cursor:style.cursor};};
  const url=new URL(location.href), found=[];
  for(const entry of entries){
    const scope=entry.scope||{};
    if(!scope.hosts?.includes(url.hostname)||scope.pathExact!==url.pathname||scope.topOnly&&window!==window.top||scope.lightDOMOnly&&window!==window.top)continue;
    for(const element of document.querySelectorAll(scope.selector))for(const node of element.childNodes){
      if(node.nodeType!==Node.TEXT_NODE||!visible(element)||![entry.source,entry.target].some(text=>normalize(text)===normalize(node.nodeValue)))continue;
      const range=document.createRange();range.selectNodeContents(node);const bounds=range.getBoundingClientRect();
      const ancestors=[];for(let current=element;current&&ancestors.length<6;current=current.parentElement){const data=describe(current);data.textOutside=outside(bounds,current.getBoundingClientRect());data.helpButtons=[...current.querySelectorAll('button[data-impact-cn-help][data-topic-id="finance-ach"]')].filter(visible).map(button=>({rect:rect(button.getBoundingClientRect()),outside:outside(button.getBoundingClientRect(),current.getBoundingClientRect()),marginLeft:getComputedStyle(button).marginLeft}));ancestors.push(data);}
      found.push({entryId:entry.id,selector:scope.selector,fixedLabel:normalize(node.nodeValue),textRect:rect(bounds),textLineRects:[...range.getClientRects()].map(rect),ancestors,node,element});
    }
  }
  window.__financeACHLayout ||= {};
  if(baseline){const inputs=[...document.querySelectorAll('input,textarea,select')].filter(element=>!element.closest('#impact-cn-assistant,#ask-impact-shadow-host'));window.__financeACHLayout[key]={records:found.map(item=>({node:item.node,element:item.element,text:item.node.nodeValue,attributes:[...item.element.attributes].map(attr=>[attr.name,attr.value]),children:[...item.element.childNodes].filter(child=>!(child instanceof Element&&child.hasAttribute('data-impact-cn-help')))})),inputs:inputs.map(element=>({element,value:element.value,checked:element.checked})),links:[...document.querySelectorAll('a[href]')].map(element=>({element,href:element.getAttribute('href')}))};}
  const previous=window.__financeACHLayout[key];
  const identity=previous?{textNodesRetained:previous.records.every(item=>item.node.isConnected&&item.node.parentElement===item.element),originalChildrenRetained:previous.records.every(item=>item.children.every(child=>[...item.element.childNodes].includes(child))),elementAttributesUnchanged:previous.records.every(item=>JSON.stringify([...item.element.attributes].map(attr=>[attr.name,attr.value]))===JSON.stringify(item.attributes)),inputsUnchanged:previous.inputs.every(item=>item.element.isConnected&&item.element.value===item.value&&item.element.checked===item.checked),linksUnchanged:previous.links.every(item=>item.element.isConnected&&item.element.getAttribute('href')===item.href),originalTextRestored:previous.records.every(item=>item.node.nodeValue===item.text),inputCount:previous.inputs.length,linkCount:previous.links.length}:null;
  return{origin:url.origin,path:url.pathname,topDocument:window===window.top,viewport:{width:innerWidth,height:innerHeight,devicePixelRatio,visualScale:visualViewport?.scale??null},matches:found.length,records:found.map(({node,element,...data})=>data),identity,privateValuesReturned:false,inputValuesReturned:false,conversationTextReturned:false};
}

export async function runFinanceLayoutChecks({page,root,translation,options={},onProgress=()=>{}}){
  const sandbox={};vm.createContext(sandbox);const bytes=readFileSync(path.join(root,'impact-cn-mod/dict.js'));vm.runInContext(bytes.toString(),sandbox);
  const dictionary=sandbox.IMPACT_CN_DICTIONARY;
  const ids=['finance-make-deposit-ach-376811a','finance-payment-methods-ach-be3c8bf','finance-payment-methods-new-ach-observed'];
  const entries=JSON.parse(JSON.stringify(dictionary.entries.filter(entry=>ids.includes(entry.id))));
  const original=await page.locator('#impact-cn-assistant').getAttribute('data-enabled');
  const frames=page.frames().filter(frame=>{try{return new URL(frame.url()).origin==='https://demo.impact.com'&&entries.some(entry=>entry.scope.pathExact===new URL(frame.url()).pathname);}catch{return false;}});
  if(frames.length!==1)throw new Error('ACH inspection requires exactly one observed finance document');
  const key='ach-layout-'+Date.now();const states=[];
  try{
    await translation(false);await page.waitForTimeout(200);states.push({state:'OFF',...await frames[0].evaluate(inspectACHLayout,{entries,key,baseline:true})});
    if(states[0].matches!==1)throw new Error('ACH label is absent or ambiguous in its observed scope');
    await translation(true);await page.waitForTimeout(200);states.push({state:'ON',...await frames[0].evaluate(inspectACHLayout,{entries,key})});
    await translation(false);await page.waitForTimeout(200);states.push({state:'OFF_RESTORED',...await frames[0].evaluate(inspectACHLayout,{entries,key})});
  }finally{await translation(original!=='false');}
  const report={mode:'REAL_NETWORK_ACH_LAYOUT',version:dictionary.version,date:new Date().toISOString(),dictionarySha256:createHash('sha256').update(bytes).digest('hex'),states,financialOperations:0,submittedForms:0,clickedNativeControls:0,screenshotsSaved:0,privateValuesReturned:false,fullConversationSaved:false};
  const folder=path.join(root,'artifacts/finance-acceptance-20261010');mkdirSync(folder,{recursive:true});
  const filename=options.layoutReportName||'ach-layout-'+Date.now();if(!/^[a-z0-9-]+$/u.test(filename))throw new Error('Layout report name is not a safe local filename');
  writeFileSync(path.join(folder,filename+'.json'),JSON.stringify(report,null,2)+'\n');
  onProgress('ACH_LAYOUT '+JSON.stringify({version:report.version,states:states.map(state=>({state:state.state,matches:state.matches,labels:state.records.map(record=>record.fixedLabel),ancestors:state.records.flatMap(record=>record.ancestors.map(item=>({classes:item.classNames,width:item.rect.width,clientWidth:item.clientWidth,scrollWidth:item.scrollWidth,textOutside:item.textOutside,helpOutside:item.helpButtons.some(button=>button.outside)}))),identity:state.identity})),privateValuesReturned:false}));
  return report;
}

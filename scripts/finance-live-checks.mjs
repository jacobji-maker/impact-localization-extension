/** Real-network finance acceptance. This module never launches a browser or logs in. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { pathToFileURL } from 'node:url';

const normalize = value => value.trim().replace(/\s+/gu, ' ');
const escape = value => String(value).replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
function condition(value, message) { if (!value) { const error = new Error(message); error.safeFinanceAssertion = true; throw error; } }
function safeURL(value) { const url = new URL(value); return url.origin + url.pathname; }
function publicHelpURL(value) { try { const url = new URL(value); return url.protocol === 'https:' && url.hostname === 'help.impact.com' ? url.origin + url.pathname : null; } catch { return null; } }

/** Browser-side function: private values and conversation never leave the page. */
export function establishBaseline({ key, entries, topURL, candidates = [], pageId }) {
  const normalized = value => value.trim().replace(/\s+/gu, ' ');
  const regexEscape=value=>value.replace(/[.*+?^${}()|[\]\\]/gu,'\\$&');
  const templateMatch=(entry,source)=>{if(!['prefix','suffix'].includes(entry.match))return null;const fixed=entry.source.trim().split(/\s+/u).map(regexEscape).join('\\s+');const boundary=entry.match==='prefix'?(/[\p{L}\p{N}]$/u.test(entry.source.trim())?'(?=$|[\\s,，:：])':''):(/^[\p{L}\p{N}]/u.test(entry.source.trim())?'(?<=^|[\\s,，:：])':'');return source.match(new RegExp(entry.match==='prefix'?`^(\\s*)${fixed}${boundary}([\\s\\S]*)$`:`^([\\s\\S]*?)${boundary}${fixed}(\\s*)$`,'u'));};
  const numericMatch=(entry,source)=>{if(entry.match!=='numeric-template')return null;const slots=[...entry.source.matchAll(/\{([a-z][a-z0-9]*)\}/gu)].map(item=>item[1]),targetSlots=[...entry.target.matchAll(/\{([a-z][a-z0-9]*)\}/gu)].map(item=>item[1]);if(!slots.length||new Set(slots).size!==slots.length||slots.length!==targetSlots.length||slots.some(slot=>targetSlots.filter(item=>item===slot).length!==1))return null;const pattern=entry.source.trim().split(/(\{[a-z][a-z0-9]*\})/gu).map(piece=>/^\{[a-z][a-z0-9]*\}$/u.test(piece)?`(?<${piece.slice(1,-1)}>(?:\\d{1,3}(?:,\\d{3})+|\\d+))`:regexEscape(piece).replace(/\s+/gu,'\\s+')).join('');return source.match(new RegExp(`^(\\s*)${pattern}(\\s*)$`,'u'));};
  const query = (container, selector, found = new Set()) => { for (const element of container.querySelectorAll(selector)) found.add(element); for (const element of container.querySelectorAll('*')) if (element.shadowRoot) query(element.shadowRoot, selector, found); return [...found]; };
  const parent = element => element.parentElement || (element.getRootNode() instanceof ShadowRoot ? element.getRootNode().host : null);
  const closest = (element, selector) => { for (let node = element; node; node = parent(node)) if (node.closest(selector)) return true; return false; };
  const visible = element => { if (!element?.isConnected || !element.getClientRects().length) return false; for (let node = element; node; node = parent(node)) { const style = getComputedStyle(node); if (node.hidden || node.inert || node.getAttribute('aria-hidden') === 'true' || style.display === 'none' || style.visibility !== 'visible' || Number(style.opacity) === 0) return false; } return true; };
  const docURL = new URL(location.href), parentURL = new URL(topURL);
  const matches = (entry, element) => {
    const scope = typeof entry.scope === 'string' ? { selector: entry.scope } : entry.scope || {};
    if (scope.hosts && !scope.hosts.includes(docURL.hostname)) return false;
    if (scope.path && !docURL.pathname.startsWith(scope.path)) return false;
    if (scope.paths && !scope.paths.some(prefix => docURL.pathname.startsWith(prefix))) return false;
    if (scope.pathExact && docURL.pathname !== scope.pathExact) return false;
    if (scope.query && !Object.entries(scope.query).every(([name, value]) => docURL.searchParams.getAll(name).length === 1 && docURL.searchParams.get(name) === String(value))) return false;
    if (scope.topPaths && !scope.topPaths.includes(parentURL.pathname)) return false;
    if (scope.topQuery && !Object.entries(scope.topQuery).every(([name, value]) => parentURL.searchParams.getAll(name).length === 1 && parentURL.searchParams.get(name) === String(value))) return false;
    if (scope.topOnly === true && window !== window.top) return false;
    if (scope.lightDOMOnly === true && element.getRootNode() !== document) return false;
    if (scope.shadowHost) { let root = element.getRootNode(), found = false; while (root instanceof ShadowRoot) { if (root.host.matches(scope.shadowHost)) { found = true; break; } root = root.host.getRootNode(); } if (!found) return false; }
    return !scope.selector || closest(element, scope.selector);
  };
  const skip = 'script,style,noscript,input,textarea,code,pre,[contenteditable]:not([contenteditable="false"]),[data-impact-cn-ignore],[data-impact-user-content],[data-impact-ai-messages],#impact-cn-assistant,#ask-impact-shadow-host,.account-btn,.profileBtn,.partner-name,.avatar-container';
  const records = [], values = [], links = [], seen = new Set(), candidateNodes = [], privateData=[];
  const roots = [document];
  const discover = root => { for (const element of root.querySelectorAll('*')) if (element.shadowRoot) { roots.push(element.shadowRoot); discover(element.shadowRoot); } };
  discover(document);
  for (const root of roots) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let node;
    while ((node = walker.nextNode())) {
      const element = node.parentElement; if (!visible(element) || !node.nodeValue.trim()) continue;
      if(closest(element,skip)){if(element.closest('tbody td,div.td,[role="cell"]')&&!closest(element,'script,style,noscript,input,textarea,[contenteditable],#ask-impact-shadow-host,#impact-cn-assistant,thead,[role="columnheader"],.table-header,.thead'))privateData.push({node,element,original:node.nodeValue});continue;}
      const source = node.nodeValue;
      const entry = entries.find(candidate => matches(candidate, element) && (candidate.match==='numeric-template'?Boolean(numericMatch(candidate,source)):['prefix','suffix'].includes(candidate.match) ? Boolean(templateMatch(candidate,source)) : [candidate.source, ...(candidate.aliases || [])].some(value => normalized(value) === normalized(source))));
      if (entry) {
        const whitespace = source.match(/^(\s*)([\s\S]*?)(\s*)$/u);
        const template=templateMatch(entry,source),suffix=entry.match==='prefix'?template[2]:'',dynamicPrefix=entry.match==='suffix'?template[1]:'';
        const numeric=numericMatch(entry,source),numericSlots=numeric?.groups?{...numeric.groups}:{};
        const expected = numeric?whitespace[1]+entry.target.replace(/\{([a-z][a-z0-9]*)\}/gu,(_token,slot)=>numericSlots[slot])+whitespace[3]:template?template[1]+entry.target+template[2]:whitespace[1]+entry.target+whitespace[3];
        records.push({ entryId: entry.id, entry, node, element, original: source, expected, suffix, dynamicPrefix,numericSlots, href: element.getAttribute('href'), childNodes: [...element.childNodes] }); seen.add(node);
      } else if (/\d/u.test(source) && (closest(element, 'td,[class*="amount"],[class*="Amount"],[class*="balance"],[class*="Balance"],[class*="currency"],[class*="Currency"],[data-testid*="amount"],[data-testid*="balance"]') || /(?:[$€£¥]|\b(?:USD|EUR|GBP|CNY)\b)/u.test(source))) values.push({ node, element, original: source });
      for (const [index, candidate] of candidates.entries()) {
        let candidateURL; try { candidateURL = new URL(candidate.frameURL); } catch { continue; }
        if (candidateURL.pathname !== docURL.pathname || candidate.topPath && candidate.topPath !== parentURL.pathname) continue;
        if (candidate.frameQuery && !Object.entries(candidate.frameQuery).every(([name, value]) => docURL.searchParams.get(name) === String(value))) continue;
        const candidateSource=candidate.source||candidate.text||'',capturedTemplate=entry&&['prefix','suffix','numeric-template'].includes(entry.match)&&normalized(candidateSource)===normalized(entry.source);
        if (!candidate.selector || !closest(element, candidate.selector) || !(normalized(candidateSource)===normalized(source)||capturedTemplate)) continue;
        if (candidate.shadowPath?.length) { let shadow=element.getRootNode(),found=false;while(shadow instanceof ShadowRoot){if(shadow.host.matches(candidate.shadowPath.at(-1))){found=true;break;}shadow=shadow.host.getRootNode();}if(!found)continue; }
        candidateNodes.push({ node, candidateId: `${pageId}-candidate-${index}`, covered: Boolean(entry) });
      }
      const cell=element.closest('tbody td,div.td,[role="cell"]');
      // Fixed status/fee enums are the only translatable business-row cells.
      // Entity/customer names are checked even when they resemble known labels.
      const fixedCell=entry&&(/(?:status|fee|enumeration|enum)/iu.test([entry.kind,entry.financeKind,entry.observedKind,entry.id].filter(Boolean).join(' '))||/(?:status|fee)/iu.test(entry.scope?.selector||''));
      if(cell&&!fixedCell&&!closest(element,'thead,[role="columnheader"],.table-header,.thead'))privateData.push({node,element,original:source});
    }
  }
  for (const element of query(document, 'a[href]')) if (visible(element) && !closest(element, skip)) links.push({ element, href: element.getAttribute('href') });
  globalThis.__financeLiveBaselines ||= {};
  globalThis.__financeLiveBaselines[key] = { records, values, links, candidateNodes,privateData };
  return { textNodes: records.length,bodyTextNodes:records.filter(record=>!closest(record.element,'#adv-navigation,nav,aside,#header,.global-header,#impact-cn-assistant,#ask-impact-shadow-host')).length, entryIds: [...new Set(records.map(record => record.entryId))], valueNodes: values.length, privateDataNodes:privateData.length,links: links.length, prefixNodes: records.filter(record => record.entry.match === 'prefix').length,suffixNodes:records.filter(record=>record.entry.match==='suffix').length,numericTemplateNodes:records.filter(record=>record.entry.match==='numeric-template').length, visibleCapturedCandidateNodes: candidateNodes.length, uncoveredCandidateIds: [...new Set(candidateNodes.filter(record=>!record.covered).map(record=>record.candidateId))] };
}

function verifyBaseline({ key, translated }) {
  const baseline = globalThis.__financeLiveBaselines?.[key]; if (!baseline) return { missingBaseline: true };
  const bad = { detached: 0, replaced: 0, untranslated: 0, numericChanged: 0,numericSlotsChanged:0,privateDataChanged:0,linksChanged: 0, prefixSuffixChanged: 0,suffixPrefixChanged:0, nestedInteractiveHelp: 0, overwrittenLabels: 0 };
  for (const record of baseline.records) {
    if (!record.node.isConnected) bad.detached++;
    if (record.node.parentElement !== record.element || ![...record.element.childNodes].includes(record.node)) bad.replaced++;
    if (record.node.nodeValue !== (translated ? record.expected : record.original)) bad.untranslated++;
    if (record.entry.match === 'prefix' && !record.node.nodeValue.includes(record.suffix)) bad.prefixSuffixChanged++;
    if (record.entry.match === 'suffix' && !record.node.nodeValue.startsWith(record.dynamicPrefix)) bad.suffixPrefixChanged++;
    if(record.entry.match==='numeric-template'&&!Object.values(record.numericSlots).every(value=>record.node.nodeValue.includes(value)))bad.numericSlotsChanged++;
    if (record.element.getAttribute('href') !== record.href) bad.linksChanged++;
    // Existing element/text siblings must survive; inserted helper is additive only.
    if (!record.childNodes.every(node => [...record.element.childNodes].includes(node))) bad.overwrittenLabels++;
  }
  for (const record of baseline.values) if (record.node.parentElement !== record.element || record.node.nodeValue !== record.original) bad.numericChanged++;
  for(const record of baseline.privateData)if(record.node.parentElement!==record.element||record.node.nodeValue!==record.original)bad.privateDataChanged++;
  for (const record of baseline.links) if (record.element.getAttribute('href') !== record.href) bad.linksChanged++;
  const walk = root => { for (const button of root.querySelectorAll('button[data-impact-cn-help]')) if (button.parentElement?.closest('button,a,summary')) bad.nestedInteractiveHelp++; for (const element of root.querySelectorAll('*')) if (element.shadowRoot) walk(element.shadowRoot); };
  walk(document);
  const longEnglishResidues = baseline.records.filter(record=>record.entry.target!==record.entry.source && /[A-Za-z]/u.test(record.node.nodeValue) && (record.node.nodeValue.match(/\b[A-Za-z][A-Za-z'-]+\b/gu)||[]).length>=8 && record.node.nodeValue===record.original).length;
  return { ...bad, longEnglishResidues, textNodes: baseline.records.length, valueNodes: baseline.values.length,privateDataNodes:baseline.privateData.length,links: baseline.links.length, entryIds: [...new Set(baseline.records.map(record => record.entryId))] };
}

/** Independently find visible finance prose, including labels absent from capture.
 * Only structural selectors/counts leave the real page; no prose or values do. */
function scanFinanceEnglishProse() {
  const financePaths=['/secure/advertiser/finance/','/secure/advertiser/Adv_Finance_Report/','/secure/finance/app/'];
  if(!financePaths.some(prefix=>location.pathname.startsWith(prefix)))return{applicable:false,scannedTextNodes:0,staticEnglishNodes:0,dynamicMixedEnglishNodes:0,selectors:[]};
  const parent=element=>element.parentElement||(element.getRootNode() instanceof ShadowRoot?element.getRootNode().host:null);
  const closest=(element,selector)=>{for(let current=element;current;current=parent(current))if(current.closest(selector))return true;return false;};
  const visible=element=>{if(!element?.isConnected||!element.getClientRects().length)return false;for(let current=element;current;current=parent(current)){const style=getComputedStyle(current);if(current.hidden||current.inert||current.getAttribute('aria-hidden')==='true'||style.display==='none'||style.visibility!=='visible'||Number(style.opacity)===0)return false;}return true;};
  const excluded='script,style,noscript,input,textarea,select,option,[role="option"],[contenteditable],code,pre,[data-impact-user-content],[data-impact-ai-messages],[data-impact-cn-ignore],#impact-cn-assistant,#ask-impact-shadow-host,#adv-navigation,nav,aside,.global-header,#header,.header-root,.account-btn,.profileBtn,.account-name,.partner-name,.avatar-container,.user-menu,#notifications,#notifications-dropdown,[id*="notification"],[class*="notification"],[class*="Notification"],tbody td,div.td,[role="cell"],.table-body .table-cell,.table-body .table-row,#primary-contact-multiselect,#selector-label,.billing-group-name-sub,.field-value,.fieldValue,.display-value,.value,.funding-amount,.amount,[class*="Amount"],[class*="amount-value"],.address-value,.bank-account-value,.contact-value,a[href^="mailto:"],a[href^="tel:"]';
  const selectorFor=element=>{const pieces=[];let current=element;while(current instanceof Element){const container=current.parentElement||current.getRootNode(),siblings=container.children?[...container.children].filter(item=>item.tagName===current.tagName):[current];pieces.unshift(current.tagName.toLowerCase()+':nth-of-type('+(siblings.indexOf(current)+1)+')');if(current.parentElement){current=current.parentElement;continue;}const root=current.getRootNode();return root instanceof ShadowRoot?selectorFor(root.host)+' '+pieces.join(' > '):pieces.join(' > ');}return pieces.join(' > ');};
  const roots=[document],discover=root=>{for(const element of root.querySelectorAll('*'))if(element.shadowRoot&&!closest(element,excluded)){roots.push(element.shadowRoot);discover(element.shadowRoot);}};discover(document);
  let scannedTextNodes=0,staticEnglishNodes=0,dynamicMixedEnglishNodes=0;const selectors=[];
  for(const root of roots){const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode())){const element=node.parentElement,text=node.nodeValue.trim();if(!text||!visible(element)||closest(element,excluded))continue;scannedTextNodes++;
    if((text.match(/\b[A-Za-z][A-Za-z'-]+\b/gu)||[]).length<8)continue;
    // Names, identifiers, raw links and editor values are never considered prose.
    if(/[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}/u.test(text)||/https?:\/\//u.test(text)||/\b\d[\d-]{7,}\b/u.test(text)||[...(window.__financePrivateStrings||[])].some(value=>value&&text.includes(value)))continue;
    const mixed=/\d|[$€£¥]|\b(?:USD|EUR|GBP|CNY|JPY|KRW)\b/u.test(text),kind=mixed?'dynamic-mixed-label-pending-template':'static-english-prose';
    if(mixed)dynamicMixedEnglishNodes++;else staticEnglishNodes++;
    selectors.push({selector:selectorFor(element),kind});
  }}
  return{applicable:true,scannedTextNodes,staticEnglishNodes,dynamicMixedEnglishNodes,selectors};
}

export function approvedReadOnlyReportQuery(action, target) {
  let url; try { url=new URL(target); } catch { return false; }
  const handle=url.searchParams.getAll('handle'),paths={adv_upcoming_payouts:'/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report',adv_cash_flow_recon:'/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report'};
  const option=action.controlEvidence?.nativeOption;
  const customOption=option?.optionKind==='custom-single-selection';
  const result=action.controlEvidence?.resultState;
  const structure=action.controlEvidence?.reportResult;
  return action.safeReadOnly===true&&action.type==='read-report-query'&&action.action==='native-control-sequence'
    && url.protocol==='https:'&&url.hostname==='demo.impact.com'
    && handle.length===1&&url.pathname===paths[handle[0]]
    && action.sourceTopPath===url.pathname&&action.sourceTopQuery?.handle===handle[0]
    && action.controlEvidence?.reportApply?.withinReportForm===true&&[true,'Apply'].includes(action.controlEvidence.reportApply.fixedLabel)
    && result?.authorizedReport===true&&result.reportHandle===handle[0]&&result.queryCompleted===true&&result.resultChanged===true&&result.loaderVisibleCount===0&&result.resultTableCount===1&&(result.fixedHeaderNodeCount>0||result.fixedEmptyStateCount>0)&&result.businessRowsRead===false&&result.headerTextReturned===false&&result.privateValuesReturned===false
    && structure?.structuresVerifiedInCurrentReport===true&&structure.tableSelector==='.reportingTable--bRdjL'&&structure.headerSelector==='.headerRowSolo--FHRlr'&&structure.loaderSelector==='.loader--XmNTN'
    && Array.isArray(action.steps)&&action.steps.length===3&&action.steps.every(step=>typeof step.selector==='string'&&step.selector)
    && action.steps.every(step=>{try{const frameURL=new URL(step.frameURL);return frameURL.origin===url.origin&&frameURL.pathname===url.pathname;}catch{return false;}})
    && action.steps[0].label==='Funding Account:'&&option?.selector===action.steps[1].selector
    && option.optionTextReturned===false&&option.optionValueReturned===false
    && (!customOption||(option.tag==='A'&&option.parentTag==='LI'&&option.popupSelector==='ul.content--YGKCO.singleSelectionFilter--FDzUm'&&option.newlyVisibleAfterVerifiedFilter===true&&option.frameURL===action.steps[1].frameURL))
    && action.steps[2].readOnlyReportQuery===true&&action.steps[2].label==='Apply';
}

const entityRoutes={
  '/secure/advertiser/finance/fr/legal-entities-view.ihtml':'/secure/finance/app/legal-entities-view.ihtml',
  '/secure/advertiser/finance/fr/billing-groups.ihtml':'/secure/finance/app/billing-groups-view.ihtml',
  '/secure/advertiser/finance/fr/funding-accounts.ihtml':'/secure/finance/app/list-digital-wallets-flow.ihtml'
};

/** Only the observed Name -> optional row menu -> Edit flow can use steps. */
export function approvedEntityEditSequence(action,target){
  let url;try{url=new URL(target);}catch{return false;}
  const bodyPath=entityRoutes[url.pathname],name=action.controlEvidence?.nameCell,edit=action.controlEvidence?.editControl,menu=action.controlEvidence?.menuControl;
  if(url.origin!=='https://demo.impact.com'||!bodyPath||url.searchParams.getAll('u').length!==1||url.searchParams.get('u')!==bodyPath)return false;
  const menuOnly=action.type==='open-dropdown';
  if(action.safeReadOnly!==true||!['open-form','open-dropdown'].includes(action.type)||action.action!=='native-control-sequence'||action.formSubmitted!==false||action.businessNameSaved!==false||action.businessIdSaved!==false||action.sourceTopPath!==url.pathname||action.sourceTopQuery?.u!==bodyPath)return false;
  const steps=action.steps;
  if(!Array.isArray(steps)||!(menuOnly?[2]:[2,3]).includes(steps.length)||steps.some(step=>typeof step.selector!=='string'||!step.selector))return false;
  const evidence=menuOnly?[name,menu]:steps.length===3?[name,menu,edit]:[name,edit];
  if(evidence.some((item,index)=>!item||item.selector!==steps[index].selector||item.frameURL!==steps[index].frameURL||item.disabled===true))return false;
  if(steps.some(step=>{try{const frameURL=new URL(step.frameURL);return frameURL.origin!==url.origin||frameURL.pathname!==bodyPath;}catch{return true;}}))return false;
  if(name.nameTextReturned!==false||!Number.isInteger(name.cellIndex)||name.cellIndex<0||name.headerEvidence?.fixedHeaderName!=='Name'||name.headerEvidence.verifiedNameColumn!==name.cellIndex||name.headerEvidence.headerLabels?.filter(label=>label==='Name').length!==1||name.headerEvidence.headerLabels[name.cellIndex]!=='Name')return false;
  if(menuOnly||steps.length===3)if(menu.withinRowOverlay!==true||menu.newlyVisibleAfterVerifiedName!==true||!['BUTTON','A'].includes(menu.tag))return false;
  if(menuOnly)return steps[1].label==='Actions';
  const form=action.controlEvidence?.editForm;
  return (edit.fixedLabel||edit.actualStaticLabel)==='Edit'&&steps.at(-1).label==='Edit'&&steps.at(-1).formSubmit===false&&form?.newlyVisibleAfterVerifiedEdit===true&&form.visibleEditorCount>0&&form.editorValuesReturned===false&&typeof form.selector==='string'&&form.frameURL===steps.at(-1).frameURL;
}

/** A route capture, disclosure or pending query cannot certify a deep state. */
export function unverifiedFinanceDeepStates(capture){
  const pages=Array.isArray(capture?.pages)?capture.pages:Object.values(capture?.pages||{});
  const required=[['upcoming-partner-payments','deep-selected-funding-account-report'],['cash-flow-history','deep-selected-funding-account-report'],['legal-entities','deep-existing-entity-edit-form'],['billing-groups','deep-existing-entity-edit-form'],['funding-accounts','deep-existing-entity-edit-form']];
  const capturedDocument=(page,action,state)=>{
    let documentPath;try{documentPath=new URL(action.steps?.at(-1)?.frameURL).pathname;}catch{return false;}
    return (page.captures||[]).some(item=>item.state===state&&item.candidateCount>0&&item.topPath===action.sourceTopPath&&Object.entries(action.sourceTopQuery||{}).every(([key,value])=>item.topQuery?.[key]===value)
      &&(state!=='deep-selected-funding-account-report'||item.resultState?.queryCompleted===true&&item.resultState.resultChanged===true&&item.resultState.loaderVisibleCount===0&&item.resultState.reportHandle===action.sourceTopQuery.handle)
      &&(item.frames||[]).some(frame=>{try{const url=new URL(frame.frameURL);return frame.captureFailed!==true&&frame.candidateCount>0&&url.origin==='https://demo.impact.com'&&url.pathname===documentPath&&(state!=='deep-selected-funding-account-report'||frame.frameQuery?.handle===action.sourceTopQuery.handle);}catch{return false;}}));
  };
  return required.filter(([pageId,state])=>{
    const matches=pages.filter(page=>page.id===pageId);if(matches.length!==1)return true;const page=matches[0];
    let target;try{target=new URL(page.url||page.href,'https://demo.impact.com').href;}catch{return true;}
    return !(page.safeActions||[]).some(action=>{
      if(action.capturedState!==state||!capturedDocument(page,action,state)||action.formSubmitted!==false||action.financialOperations!==0||action.savedSettings!==0)return false;
      if(state==='deep-selected-funding-account-report')return action.queryRequested===true&&action.queryCompleted===true&&action.queryCount===1&&approvedReadOnlyReportQuery(action,target);
      return action.type==='open-form'&&approvedEntityEditSequence(action,target);
    });
  }).map(([pageId,state])=>({pageId,state}));
}

export async function waitForReadOnlyReportResult({page,frame,inspectControls,timeoutMs=20000}){
  const deadline=Date.now()+timeoutMs;
  while(Date.now()<deadline){
    let timer,state;
    try{state=await Promise.race([frame.evaluate(inspectControls,{kind:'report-query-state'}),new Promise(resolve=>{timer=setTimeout(()=>resolve({inspectionTimedOut:true}),Math.min(5000,Math.max(1,deadline-Date.now())));})]);}finally{clearTimeout(timer);}
    condition(!state.inspectionTimedOut,'Read-only report DOM inspection timed out; no query retry performed');
    if(state.authorizedReport!==true)condition(false,'Read-only report left its captured authorized route');
    if(state.queryCompleted===true)return state;
    await page.waitForTimeout(Math.min(150,Math.max(1,deadline-Date.now())));
  }
  condition(false,'Read-only report Apply did not render a completed result within the bounded wait; no query retry performed');
}

/** Completion is evidence, never a prediction based on requested options. */
export function finalizeFinanceCoverage(report){
  report.completePageCoverage=false;report.completeAcceptance=false;
  if(report.status!=='PASS'||report.pageErrors!==0)return report;
  const expected=report.expectedPageIds||[],selected=report.selectedPages||[];
  const allPages=expected.length===15&&new Set(expected).size===15&&selected.length===15&&new Set(selected).size===15&&expected.every(id=>selected.includes(id)&&report.results.filter(item=>item.pageId===id).length===1&&report.results.find(item=>item.pageId===id)?.status==='PASS');
  report.completePageCoverage=allPages;
  const passed=(report.aiCases||[]).filter(item=>item.status==='PASS'&&item.nativeReplyChanged===true&&item.automaticSends===1&&item.chinese===true&&item.conceptMatched===true&&item.correspondingOfficialLink===true);
  report.completeAcceptance=allPages&&Array.isArray(report.unverifiedDeepStates)&&report.unverifiedDeepStates.length===0&&new Set(passed.map(item=>item.topicId)).size>=2&&(report.selectedAICases||[]).every(id=>passed.some(item=>item.topicId===id));
  return report;
}

/** Read native AI structure without reading draft values or message text. */
export function inspectNativeAIStructure(config={}){
  const parent=element=>element.parentElement||(element.getRootNode() instanceof ShadowRoot?element.getRootNode().host:null);
  const visible=element=>{if(!element?.isConnected||!element.getClientRects().length||getComputedStyle(element).visibility!=='visible')return false;for(let current=element;current;current=parent(current)){const style=getComputedStyle(current);if(current.hidden||current.inert||current.getAttribute('aria-hidden')==='true'||style.display==='none'||Number(style.opacity)===0)return false;}return true;};
  const elements=root=>{const found=[];for(const element of root.querySelectorAll('*')){found.push(element);if(element.shadowRoot)found.push(...elements(element.shadowRoot));}return found;};
  const all=elements(document),hosts=all.filter(element=>element.id==='ask-impact-shadow-host'),shadowElements=hosts.flatMap(host=>host.shadowRoot?elements(host.shadowRoot):[]);
  const selectCount=(selectors,scope)=>{const matches=new Set();for(const selector of selectors||[])for(const element of scope)if(element.matches(selector)&&visible(element))matches.add(element);return matches.size;};
  // Native structure names are useful; account IDs, UUIDs and long numeric
  // suffixes in attributes are not needed to inspect the adapter.
  const fixedName=value=>typeof value==='string'&&/^[A-Za-z_][A-Za-z0-9_-]{0,95}$/u.test(value)&&!/\d{4,}|(?:^|[-_])[a-f\d]{12,}(?:$|[-_])/iu.test(value);
  const roles=new Set(['alert','article','button','complementary','dialog','document','feed','group','link','list','listitem','log','main','none','presentation','region','status','textbox']);
  const describe=element=>{const classNames=[...element.classList].filter(fixedName),role=element.getAttribute('role'),testId=element.getAttribute('data-testid');return{tag:element.tagName,classNames,role:roles.has(role)?role:null,dataTestId:fixedName(testId)?testId:null,visible:visible(element)};};
  const officialLink=element=>elements(element).some(child=>{if(child.tagName!=='A'||!child.hasAttribute('href'))return false;try{const url=new URL(child.getAttribute('href'),location.href);return url.protocol==='https:'&&url.hostname==='help.impact.com';}catch{return false;}});
  const historicalCandidates=shadowElements.filter(element=>element.matches('.OtDgU'));
  const inspectable=shadowElements.filter(element=>historicalCandidates.includes(element)||[...element.classList].some(name=>fixedName(name)&&/(?:chat|message|reply|assistant)/iu.test(name)));
  const structures=inspectable.slice(0,30).map(element=>{const parents=[];for(let current=parent(element);current&&parents.length<3;current=parent(current))parents.push(describe(current));return{...describe(element),historicalReplyCandidate:historicalCandidates.includes(element),parentStructures:parents,childElementCount:element.children.length,childStructures:[...element.children].slice(0,8).map(describe),containsOfficialHelpLink:officialLink(element)};});
  // Inspect only the observed native conversation subtree. No message text,
  // arbitrary attribute values, input values or account identifiers leave it.
  let remaining=60;
  const tree=(element,depth=0)=>{if(remaining--<=0)return null;return{...describe(element),childElementCount:element.children.length,assistantMarker:['assistant','ai'].includes(element.getAttribute('data-role'))||element.getAttribute('data-message-author-role')==='assistant',userMarker:element.getAttribute('data-message-author-role')==='user',children:depth<6?[...element.children].slice(0,8).map(child=>tree(child,depth+1)).filter(Boolean):[]};};
  const conversationStructures=shadowElements.filter(element=>element.classList.contains('ask-impact-chat-area-scroll')).map(element=>tree(element)).filter(Boolean);
  return{mode:'NATIVE_AI_DOM_INSPECTION_ONLY',acceptanceRun:false,askImpactHostCount:hosts.length,openShadowHostCount:hosts.filter(host=>Boolean(host.shadowRoot)).length,shadowElementCount:shadowElements.length,visibleOpenerCount:selectCount(config.openerSelectors,all),visibleInputCount:selectCount(config.inputSelectors,shadowElements),visibleSendCount:selectCount(config.sendSelectors,shadowElements),historicalReplySelector:'.OtDgU',historicalReplyCandidateCount:historicalCandidates.length,historicalReplyVisibleCandidateCount:historicalCandidates.filter(visible).length,historicalReplyAssistantOnlyVerified:false,structures,structuresTruncated:inspectable.length>30,conversationStructures,conversationStructuresTruncated:remaining<=0,privateValuesReturned:false,conversationTextReturned:false,linksReturned:false,clickedControls:0};
}

function observedControlLabels({dictionary,label,frameURL,topURL,withProofs=false}) {
  const documentURL=new URL(frameURL),parentURL=new URL(topURL),labels=new Set([normalize(label)]),proofs=[{label:normalize(label),selector:null,shadowHost:null}];
  const queryMatches=(expected,url)=>Object.entries(expected||{}).every(([key,value])=>url.searchParams.getAll(key).length===1&&url.searchParams.get(key)===String(value));
  for(const entry of dictionary.entries){
    if(entry.stage!=='native-finance'||![entry.source,...(entry.aliases||[])].some(source=>normalize(source)===normalize(label)))continue;
    const scope=typeof entry.scope==='string'?{selector:entry.scope}:entry.scope||{};
    if(scope.hosts&&!scope.hosts.includes(documentURL.hostname)||scope.pathExact&&scope.pathExact!==documentURL.pathname||scope.path&&!documentURL.pathname.startsWith(scope.path)||scope.paths&&!scope.paths.some(prefix=>documentURL.pathname.startsWith(prefix))||scope.topPaths&&!scope.topPaths.includes(parentURL.pathname)||!queryMatches(scope.query,documentURL)||!queryMatches(scope.topQuery,parentURL))continue;
    labels.add(normalize(entry.target));
    const countOnlySuffix=entry.match==='prefix'&&entry.dynamicSuffix==='<original-count>'&&normalize(entry.source).endsWith('·');
    proofs.push({label:normalize(entry.target),selector:scope.selector||null,shadowHost:scope.shadowHost||null,countOnlySuffix});
    if(countOnlySuffix)proofs.push({label:normalize(entry.source),selector:scope.selector||null,shadowHost:scope.shadowHost||null,countOnlySuffix:true});
  }
  return withProofs?proofs:[...labels];
}

function approvedEntityDisclosure(action,target){
  let url;try{url=new URL(target);}catch{return false;}const evidence=action.controlEvidence,body=entityRoutes[url.pathname];
  return url.origin==='https://demo.impact.com'&&body&&url.searchParams.getAll('u').length===1&&url.searchParams.get('u')===body&&action.sourceTopPath===url.pathname&&action.sourceTopQuery?.u===body&&action.safeReadOnly===true&&action.formSubmitted===false&&action.businessNameSaved===false&&action.businessIdSaved===false&&action.action==='native-control-click'&&['deep-existing-entity-detail','deep-existing-entity-disclosure'].includes(action.capturedState)&&['open-form','open-dropdown'].includes(action.type)&&evidence?.nameTextReturned===false&&evidence.selector===(action.clickSelector||action.selector)&&evidence.frameURL===action.frameURL&&new URL(action.frameURL).pathname===body&&Number.isInteger(evidence.cellIndex)&&evidence.headerEvidence?.verifiedNameColumn===evidence.cellIndex&&evidence.headerEvidence.fixedHeaderName==='Name'&&evidence.headerEvidence.headerLabels?.filter(label=>label==='Name').length===1;
}

export async function replayReadOnlyFinanceStep({page,action,step,index,reportQuery,entitySequence=false,dictionary}) {
  const sourceURL=new URL(page.url());
  condition(sourceURL.origin==='https://demo.impact.com'&&(!action.sourceTopPath||sourceURL.pathname===action.sourceTopPath)&&Object.entries(action.sourceTopQuery||{}).every(([key,value])=>sourceURL.searchParams.getAll(key).length===1&&sourceURL.searchParams.get(key)===String(value)),'Captured read-only opener left its source top path or static query');
  const currentFrames=await relevantFrames(page);let expectedPath;
  if(step.frameURL)expectedPath=new URL(step.frameURL).pathname;else if(typeof step.framePath==='string')expectedPath=new URL(step.framePath,'https://demo.impact.com').pathname;else if(Array.isArray(step.framePath)&&step.framePath.length)expectedPath=new URL(step.framePath.at(-1).framePath).pathname;
  const expectedOrigin=step.frameURL?new URL(step.frameURL).origin:null,expectedQuery=step.frameQuery||(step.frameURL===action.frameURL?action.frameQuery:null)||{};
  const matchingFrames=expectedPath?currentFrames.filter(item=>{const url=new URL(item.url());return url.pathname===expectedPath&&(!expectedOrigin||url.origin===expectedOrigin)&&Object.entries(expectedQuery).every(([key,value])=>url.searchParams.getAll(key).length===1&&url.searchParams.get(key)===String(value));}):[page.mainFrame()];condition(matchingFrames.length===1,'Captured read-only opener frame is absent or ambiguous');const frame=matchingFrames[0];
  condition(!reportQuery||approvedReadOnlyReportQuery(action,page.url())&&approvedReadOnlyReportQuery(action,frame.url()),'Report replay lacks the exact captured read-only route and handle');
  condition(!entitySequence||approvedEntityEditSequence(action,page.url()),'Entity replay lacks the captured Name-to-Edit evidence');
  const menuStep=entitySequence&&(action.type==='open-dropdown'?index===1:action.steps.length===3&&index===1);
  if(menuStep){
    const menu=await import(`${new URL('./finance-menu-checks.mjs',import.meta.url).href}?revision=${Date.now()}`);
    return menu.performEntityActionsMenu({page,frame,nameEvidence:action.controlEvidence.nameCell,selector:step.clickSelector||step.selector,dictionary});
  }
  const clickSelector=step.clickSelector||step.selector;condition(clickSelector,'Captured read-only step has no selector');
  const selector=step.shadowPath?.length?step.shadowPath.join(' ')+' '+clickSelector:clickSelector;
  let control=frame.locator(selector).filter({visible:true});
  // A body heading can precede its asynchronously mounted filter controls.
  // Wait only for the exact captured locator; ambiguity and fixed-Text checks
  // remain mandatory and no alternate selector or first match is chosen.
  const initialObservedCount=await control.count(),controlWaitStarted=Date.now();
  if(initialObservedCount===0){try{await control.waitFor({state:'visible',timeout:10000});}catch{}}
  const legacyName=!entitySequence&&approvedEntityDisclosure(action,page.url()),nameStep=entitySequence&&index===0||legacyName,observedCount=await control.count();let fixedNodeCount=null;
  const structures=await control.evaluateAll(nodes=>nodes.slice(0,12).map(element=>{const type=element.getAttribute('type');return{tag:element.tagName,type:type===null||['button','submit','reset','checkbox','radio','text'].includes(type)?type:'other',form:Boolean(element.form||element.closest('form')),disabled:Boolean(element.disabled||element.matches('[aria-disabled="true"]'))};}));
  const diagnostic={framePath:new URL(frame.url()).pathname,selector,initialObservedCandidateCount:initialObservedCount,controlWaitPerformed:initialObservedCount===0,controlWaitMs:initialObservedCount===0?Date.now()-controlWaitStarted:0,observedCandidateCount:observedCount,fixedNodeCount:null,structures};
  const verifiedMenuStep=entitySequence&&(action.type==='open-dropdown'?index===1:action.steps.length===3&&index===1);
  if(!nameStep&&!verifiedMenuStep&&(step.textMatch||step.label)){
    const proofs=observedControlLabels({dictionary,label:step.textMatch||step.label,frameURL:frame.url(),topURL:page.url(),withProofs:true});
    const matches=await control.evaluateAll((nodes,proofs)=>nodes.map((element,index)=>{let count=0;const parent=node=>node.parentElement||(node.getRootNode() instanceof ShadowRoot?node.getRootNode().host:null),closest=(node,selector)=>{for(let current=node;current;current=parent(current))if(current.matches(selector))return true;return false;};const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);let text;while((text=walker.nextNode())){const owner=text.parentElement;if(!owner||owner.closest('input,textarea,select,option,[contenteditable]'))continue;const normalized=text.nodeValue.trim().replace(/\s+/gu,' ');if(proofs.some(proof=>(normalized===proof.label||proof.countOnlySuffix&&normalized.startsWith(proof.label)&&/^\s*(?:0|[1-9]\d*)$/u.test(normalized.slice(proof.label.length)))&&(!proof.selector||closest(owner,proof.selector))&&(!proof.shadowHost||(()=>{let root=owner.getRootNode();while(root instanceof ShadowRoot){if(root.host.matches(proof.shadowHost))return true;root=root.host.getRootNode();}return false;})())))count++;}return{index,count};}),proofs);
    fixedNodeCount=matches.reduce((sum,item)=>sum+item.count,0);diagnostic.fixedNodeCount=fixedNodeCount;const eligible=matches.filter(item=>item.count===1);
    if(eligible.length!==1){const error=new Error('Captured finance opener has no unique observed fixed Text node in its exact selector and scope');error.safeFinanceAssertion=true;error.financeEvidence=diagnostic;throw error;}
    control=control.nth(eligible[0].index);
  }
  if(await control.count()!==1){const error=new Error('Captured finance opener is absent or ambiguous after verified fixed-node or Name-column matching');error.safeFinanceAssertion=true;error.financeEvidence=diagnostic;throw error;}
  const allowedApply=reportQuery&&index===2&&step.readOnlyReportQuery===true&&step.label==='Apply'&&approvedReadOnlyReportQuery(action,page.url())&&approvedReadOnlyReportQuery(action,frame.url());
  const applyLabels=['Apply',...dictionary.entries.filter(entry=>entry.source==='Apply'&&entry.stage==='native-finance').map(entry=>entry.target)];
  const entityKind=legacyName?'name':entitySequence?(index===0?'name':action.type==='open-form'&&index===action.steps.length-1?'edit':'menu'):null;
  const entityEvidence=legacyName?action.controlEvidence:entityKind==='name'?action.controlEvidence.nameCell:entityKind==='edit'?action.controlEvidence.editControl:entityKind==='menu'?action.controlEvidence.menuControl:null;
  const fixedLabels=entityKind==='name'?observedControlLabels({dictionary,label:'Name',frameURL:frame.url(),topURL:page.url()}):entityKind==='edit'?observedControlLabels({dictionary,label:'Edit',frameURL:frame.url(),topURL:page.url()}):[];
  const safe=await control.evaluate((element,{allowedApply,applyLabels,reportOption,optionEvidence,entityKind,entityEvidence,fixedLabels})=>{
    if(element.matches('textarea,[contenteditable],input:not([type="checkbox"]):not([type="radio"])'))return false;
    const label=entityKind==='name'?'':element.textContent.trim();
    if(allowedApply)return element.tagName==='BUTTON'&&Boolean(element.closest('#reportFormDiv'))&&applyLabels.includes(label);
    if(element.tagName==='BUTTON'&&(element.getAttribute('type')==='submit'||element.type==='submit'&&element.form))return false;
    const nativeButton=element.closest('button');if(nativeButton&&(nativeButton.disabled||nativeButton.getAttribute('aria-disabled')==='true'||nativeButton.type==='submit'&&nativeButton.form))return false;
    if(/^(?:save|submit|delete|remove|confirm|send payment|pay now|保存|提交|删除|确认付款)(?:\s|$)/iu.test(label))return false;
    if(reportOption&&optionEvidence.optionKind==='custom-single-selection'){
      const popup=element.closest(optionEvidence.popupSelector),utility=/^(?:All|None|Select All|Deselect All|Clear|Cancel|Apply)$/iu;
      if(!popup||element.tagName!=='A'||element.parentElement?.tagName!=='LI'||element.hasAttribute('href')||element.hasAttribute('role')||element.hasAttribute('type')||element.matches('[aria-disabled="true"]')||element.parentElement.matches('[aria-disabled="true"]')||utility.test(label))return false;
      const visible=option=>Boolean(option.getClientRects().length)&&getComputedStyle(option).display!=='none'&&getComputedStyle(option).visibility==='visible'&&!option.matches('[aria-disabled="true"]')&&!option.parentElement.matches('[aria-disabled="true"]');
      const options=[...popup.querySelectorAll('li > a')].filter(option=>visible(option)&&!utility.test(option.textContent.trim()));
      return options.length===1&&options[0]===element;
    }
    if(reportOption)return element.matches('input[type="checkbox"],input[type="radio"],[role="option"],li,option,select');
    if(entityKind){
      if(element.tagName!==entityEvidence.tag||element.matches(':disabled,[aria-disabled="true"]'))return false;
      if(entityKind==='edit')return fixedLabels.includes(label)&&Boolean(element.closest('.row-overlay,[role="menu"],.dropdown-menu'))&&!element.form;
      if(entityKind==='menu')return Boolean(element.closest('.row-overlay'))&&['BUTTON','A'].includes(element.tagName)&&!element.form&&(!element.hasAttribute('href')||element.getAttribute('href')==='#');
      const cell=element.closest('.table-cell,td,[role="cell"]'),row=cell?.parentElement,table=row?.closest('.iui-data-table,.iui-data-view,table,[role="table"]');
      if(!cell||!row?.matches('.table-row,tr,[role="row"]')||!table)return false;
      const visible=header=>Boolean(header.getClientRects().length)&&getComputedStyle(header).visibility==='visible';
      const primary=[...table.querySelectorAll('[data-testid^="uicl-data-table-column-label-"]')].filter(visible),headers=primary.length?primary:[...table.querySelectorAll('th,[role="columnheader"],.table-header .header-cell,.table-header .table-cell')].filter(visible);
      const cells=[...row.children].filter(item=>item.matches('.table-cell,td,[role="cell"]'));
      const linkSafe=!element.hasAttribute('href')||new URL(element.getAttribute('href'),location.href).origin===location.origin;
      return linkSafe&&cells.indexOf(cell)===entityEvidence.cellIndex&&fixedLabels.includes(headers[entityEvidence.cellIndex]?.textContent.trim())&&headers.filter(header=>fixedLabels.includes(header.textContent.trim())).length===1&&(element.matches('a,button,[role="link"],[role="button"]')||getComputedStyle(element).cursor==='pointer');
    }
    return !element.matches('select,option');
  },{allowedApply,applyLabels,reportOption:reportQuery&&index===1,optionEvidence:action.controlEvidence?.nativeOption,entityKind,entityEvidence,fixedLabels});if(!safe){const error=new Error('Dynamic finance control lacks verified read-only structure or is an editor, submit or write action');error.safeFinanceAssertion=true;error.financeEvidence=diagnostic;throw error;}
  let reportInspector;
  if(allowedApply){
    const module=await import(`${new URL('./finance-deep-capture.mjs',import.meta.url).href}?revision=${Date.now()}`);reportInspector=module.inspectFinanceControls;condition(typeof reportInspector==='function','Pure finance result inspector is unavailable');
    const baseline=await frame.evaluate(reportInspector,{kind:'mark-report-query-baseline'});condition(baseline.baselineMarked===true,'Read-only report result baseline could not be established');
  }
  const clickCapturedControl=async()=>{
    try{await control.click({timeout:10000});}
    catch(cause){
      const message=String(cause.message||'');
      const clickState=await control.evaluate(element=>{const rect=element.getBoundingClientRect(),style=getComputedStyle(element),x=rect.x+rect.width/2,y=rect.y+rect.height/2,hit=document.elementFromPoint(x,y);return{connected:element.isConnected,visible:rect.width>0&&rect.height>0,opacity:style.opacity,pointerEvents:style.pointerEvents,centerInsideViewport:x>=0&&x<innerWidth&&y>=0&&y<innerHeight,centerReceivesPointer:Boolean(hit&&(hit===element||element.contains(hit))),rowOverlay:Boolean(element.closest('.row-overlay'))};}).catch(()=>({inspectionUnavailable:true}));
      const error=new Error('Captured native finance control could not receive a normal click within the bounded wait; no forced click or retry');error.safeFinanceAssertion=true;error.financeEvidence={...diagnostic,clickState,clickFailure:{timeout:cause.name==='TimeoutError',pointerInterception:/intercepts pointer events/u.test(message),outsideViewport:/outside of the viewport/u.test(message),unstable:/not stable/u.test(message),notVisible:/not visible/u.test(message)},privateValuesReturned:false};throw error;
    }
  };
  if(reportQuery&&index===1){
    const info=await control.evaluate(element=>({tag:element.tagName,optionIndex:element.tagName==='OPTION'?element.index:null,selectCount:element.tagName==='SELECT'?element.options.length:null,selectedIndex:element.tagName==='SELECT'?element.selectedIndex:null,checkbox:element.matches('input[type="checkbox"]'),radio:element.matches('input[type="radio"]'),checked:Boolean(element.checked)}));
    if(info.tag==='OPTION'){const select=control.locator('..');condition(await select.evaluate(element=>element.tagName==='SELECT'),'Captured report option has no native select');await select.selectOption({index:info.optionIndex});}
    else if(info.tag==='SELECT'){condition(Number.isInteger(step.optionIndex)&&step.optionIndex>=0&&step.optionIndex<info.selectCount,'Report select requires a captured option index, never a private value');await control.selectOption({index:step.optionIndex});}
    else if(!(info.checkbox||info.radio)||!info.checked)await clickCapturedControl();
  }else{
    const alreadyOpen=step.type==='open-checkbox'&&await control.evaluate(element=>Boolean(element.matches('input[type="checkbox"]')?element.checked:element.control?.checked));
    if(!alreadyOpen)await clickCapturedControl();
  }
  if(entityKind==='edit'){
    const evidence=action.controlEvidence.editForm,form=frame.locator(evidence.selector).filter({visible:true});await form.waitFor({state:'visible',timeout:10000});condition(await form.count()===1,'Entity Edit did not render one captured form');
    const editable=await form.evaluate(element=>{const visible=node=>Boolean(node.getClientRects().length)&&getComputedStyle(node).visibility==='visible';return element.matches('form,dialog,[role="dialog"]')&&[...element.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]),textarea,select,[contenteditable="true"]')].some(visible);});condition(editable,'Entity Edit form has no native editable fields');
  }
  if(step.visibleSelector)await frame.locator(step.visibleSelector).filter({visible:true}).first().waitFor({timeout:10000});
  if(allowedApply)await waitForReadOnlyReportResult({page,frame,inspectControls:reportInspector});
  await page.waitForTimeout(allowedApply?700:350);
}

async function relevantFrames(page) { return page.frames().filter(frame => { try { return ['app.impact.com', 'demo.impact.com'].includes(new URL(frame.url()).hostname); } catch { return false; } }); }
function pageDefinitions(capture) { const values = Array.isArray(capture.pages) ? capture.pages : Object.values(capture.pages || {}); return values.map((definition, index) => ({ ...definition, id: definition.id || definition.pageId || `finance-page-${index + 1}`, url: definition.url || definition.href || definition.targetURL || definition.navigation?.href })).filter(definition => definition.url); }

export async function waitForCapturedDocuments(page, definition, initialOnly=true,{timeoutMs=25000,readyTimeoutMs=15000,onDiagnostic}={}) {
  const navigationPath=new URL(definition.url||definition.href,'https://demo.impact.com').pathname;
  const candidates=(definition.candidates||[]).filter(item=>!initialOnly||(!item.observedStates?.length||item.observedStates.includes('initial')||item.observedStates.includes('extra-baseline'))&&(!item.topPath||item.topPath===navigationPath)),groups=new Map();
  for(const candidate of candidates){let url;try{url=new URL(candidate.frameURL);}catch{continue;}const query=candidate.frameQuery||{},key=JSON.stringify([url.origin,url.pathname,Object.entries(query).sort()]);if(!groups.has(key))groups.set(key,{origin:url.origin,path:url.pathname,query,candidates:[]});groups.get(key).candidates.push(candidate);}
  const matches=(frame,group)=>{const url=new URL(frame.url());return url.origin===group.origin&&url.pathname===group.path&&Object.entries(group.query).every(([key,value])=>url.searchParams.getAll(key).length===1&&url.searchParams.get(key)===String(value));};
  const deadline=Date.now()+timeoutMs;let frames=[];
  while(Date.now()<deadline){frames=await relevantFrames(page);if([...groups.values()].every(group=>frames.filter(frame=>matches(frame,group)).length===1))break;await page.waitForTimeout(Math.min(100,Math.max(1,deadline-Date.now())));}
  const selected=[];
  for(const group of groups.values()){
    const found=frames.filter(frame=>matches(frame,group));onDiagnostic?.({phase:'doc-ready',documentPath:group.path,matchingDocumentCount:found.length});condition(found.length===1,'A captured finance document is missing or ambiguous under its static query; partial shell-only coverage rejected');
    const frame=found[0],body=group.candidates.filter(item=>!/(?:#adv-navigation|sidenav-|#header\b|global-header|#impact-cn-assistant|#ask-impact-shadow-host|(?:^|[ >])(?:nav|aside)(?:[ .#[:>]|$))/iu.test([...(item.shadowPath||[]),item.selector].join(' ')));
    if(!body.length){condition(frame===page.mainFrame(),'A captured child finance document contains only shared navigation; body coverage rejected');condition(await frame.evaluate(()=>document.readyState!=='loading'),'Finance top shell has not loaded');selected.push(frame);continue;}
    const ordered=[...body].sort((a,b)=>Number(/^(?:H[1-4])$/u.test(b.tag)||/reportTitle/iu.test(b.selector))-Number(/^(?:H[1-4])$/u.test(a.tag)||/reportTitle/iu.test(a.selector))),until=Date.now()+readyTimeoutMs;let ready=null;
    while(Date.now()<until&&!ready){for(const candidate of ordered){if(!candidate.selector)continue;const selector=[...(candidate.shadowPath||[]),candidate.selector].join(' '),count=await frame.locator(selector).filter({visible:true}).evaluateAll(nodes=>nodes.filter(element=>{const parent=node=>node.parentElement||(node.getRootNode() instanceof ShadowRoot?node.getRootNode().host:null);for(let node=element;node;node=parent(node)){const style=getComputedStyle(node);if(node.matches('#adv-navigation,nav,aside,#header,.global-header,#impact-cn-assistant,#ask-impact-shadow-host')||node.hidden||node.inert||node.getAttribute('aria-hidden')==='true'||style.display==='none'||Number(style.opacity)===0)return false;}return getComputedStyle(element).visibility==='visible';}).length);if(count){ready={selector,visibleCandidateCount:count};break;}}if(!ready)await page.waitForTimeout(Math.min(100,Math.max(1,until-Date.now())));}
    onDiagnostic?.({phase:'doc-ready',documentPath:group.path,matchingDocumentCount:1,selector:ready?.selector||ordered[0]?.selector||'',visibleCandidateCount:ready?.visibleCandidateCount||0});condition(ready,'Captured finance body has no visible initial heading or fixed label');selected.push(frame);
  }
  frames=selected;
  return frames;
}

export function requireFinanceBodyBaselines(frames,baselines,page){
  for(const frame of frames)if(frame!==page.mainFrame()||/\/Adv_Finance_Report\/|\/(?:make-deposit|payment-methods|automatic-payments)\/ui\.ihtml$|\/payment-method\/new\/ui\.ihtml$/u.test(new URL(frame.url()).pathname))condition(baselines.some(item=>item.frame===frame&&(item.baseline||item.dynamic)?.bodyTextNodes>0),'A required finance body document has no observed body Text-node baseline');
}

export function financeDynamicCandidates(definition,action,state,currentURL,targetURL){
  const resultURL=new URL(currentURL),target=new URL(targetURL),resultPath=action.resultingTopPath||target.pathname,resultQuery=action.resultingTopQuery||action.sourceTopQuery||{};
  condition(resultURL.origin===target.origin&&resultURL.pathname===resultPath&&Object.entries(resultQuery).every(([key,value])=>resultURL.searchParams.getAll(key).length===1&&resultURL.searchParams.get(key)===String(value)),'Dynamic finance action left its captured resulting route or static query');
  const candidates=(definition.candidates||[]).filter(item=>item.observedStates?.includes(state)&&(item.topPath?item.topPath===resultPath:resultPath===target.pathname)&&Object.entries(item.topQuery||{}).every(([key,value])=>resultURL.searchParams.getAll(key).length===1&&resultURL.searchParams.get(key)===String(value)));
  condition(candidates.length>0,'Dynamic action has no corresponding captured platform labels on its resulting route');return candidates;
}

/** Finance visuals only: original DOM, values and locale are never rewritten for masking. */
async function screenshotFinancePage({page,root,translation,setAIEnabled,onProgress,capture,control,dictionary}){
  const pageId=control.pageId||control.id,definition=pageDefinitions(capture).find(item=>item.id===pageId);
  condition(definition,'Screenshot pageId must reference an observed finance page');
  const target=new URL(definition.url,'https://demo.impact.com');condition(target.protocol==='https:'&&target.hostname==='demo.impact.com'&&target.pathname.startsWith('/secure/'),'Screenshot target must stay on the authorized real demo origin');
  onProgress?.(`finance-${pageId}-opening-real-screenshot-page`);
  await page.goto(target.href,{waitUntil:'domcontentloaded',timeout:45000});await page.locator('#impact-cn-assistant').waitFor({timeout:20000});const frames=await waitForCapturedDocuments(page,definition);
  await translation(true);if(control.enableAI!==false&&typeof setAIEnabled==='function')await setAIEnabled(true);await page.waitForTimeout(400);
  condition(await page.evaluate(()=>!globalThis.ImpactCN),'Screenshots require the real isolated extension, not page-injected fixtures');
  if(control.hoverEntryId){const entry=dictionary.entries.find(item=>item.id===control.hoverEntryId&&item.stage==='native-finance');condition(entry,'Screenshot help hover must reference an observed finance entry');const frame=frames.find(item=>new URL(item.url()).pathname===entry.scope.pathExact);condition(frame,'Observed concept hover frame did not load');const selector=entry.scope.shadowHost?entry.scope.shadowHost+' '+entry.scope.selector:entry.scope.selector;await frame.locator(selector).filter({visible:true}).first().hover();await page.waitForTimeout(350);}
  const masks=[];
  const fixedMasks='input:not([type="checkbox"]):not([type="radio"]),textarea,[contenteditable],.account-btn,.profileBtn,.account-name,.partner-name,.avatar-container,.funding-amount,.amount,[class*="Amount"],[class*="amount-value"],tbody td,div.td,[role="cell"],a[href^="mailto:"],a[href^="tel:"],#ask-impact-shadow-host,#primary-contact-multiselect,#selector-label,.billing-group-name-sub,.field-value,.fieldValue,.display-value,.value';
  const suffixSelectors=dictionary.entries.filter(item=>item.stage==='native-finance'&&item.match==='suffix').map(item=>({path:item.scope.pathExact,selector:item.scope.selector,shadowHost:item.scope.shadowHost}));
  for(const frame of frames){
    masks.push(frame.locator(fixedMasks));
    for(const item of suffixSelectors.filter(item=>item.path===new URL(frame.url()).pathname))masks.push(frame.locator(item.shadowHost?item.shadowHost+' '+item.selector:item.selector));
    const selectors=await frame.evaluate(()=>{
      const found=new Set();
      const selectorFor=element=>{const pieces=[];let current=element;while(current instanceof Element){const parent=current.parentElement||current.getRootNode();const siblings=parent.children?[...parent.children].filter(item=>item.tagName===current.tagName):[current];pieces.unshift(current.tagName.toLowerCase()+':nth-of-type('+(siblings.indexOf(current)+1)+')');if(current.parentElement){current=current.parentElement;continue;}const root=current.getRootNode();return root instanceof ShadowRoot?selectorFor(root.host)+' '+pieces.join(' > '):pieces.join(' > ');}return pieces.join(' > ');};
      const visit=root=>{const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode())){const element=node.parentElement;if(!element||!element.getClientRects().length||element.closest('script,style,noscript,#impact-cn-assistant')||!node.nodeValue.trim())continue;const text=node.nodeValue;if(/[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}/u.test(text)||/(?:[$€£¥]\s*[-+]?\s*\d|\b(?:USD|EUR|GBP|CNY|JPY|KRW)\s*[-+]?\s*[\d,]|[-+]?[\d,.]+\s*(?:USD|EUR|GBP|CNY|JPY|KRW)\b)/u.test(text)||/\b\d[\d-]{7,}\b/u.test(text))found.add(selectorFor(element));}for(const element of root.querySelectorAll('*'))if(element.shadowRoot)visit(element.shadowRoot);};visit(document);return[...found];
    });
    for(const selector of selectors)masks.push(frame.locator(selector));
  }
  const folder=path.join(root,'artifacts/finance-tests');mkdirSync(folder,{recursive:true});const destination=path.join(folder,`finance-${pageId}-localized.png`);
  await page.bringToFront();await page.screenshot({path:destination,fullPage:false,mask:masks,maskColor:'#dbe1e7'});onProgress?.(`FINANCE_SCREENSHOT_SAVED ${destination}`);return[destination];
}

async function verifyAI({ page, definition, dictionary, onProgress }) {
  const topic = dictionary.helpTopics.find(item => item.id === definition.topicId);
  condition(topic, 'AI case references an absent finance topic');
  condition(definition.replySelector, 'AI acceptance requires a verified native assistant-only reply selector');
  condition(definition.conceptRegex, 'AI acceptance requires a concept regex specific to the selected finance term');
  const input = page.locator('#ask-impact-shadow-host textarea[placeholder="ask impact..."]');
  const replies = page.locator(definition.replySelector);
  const opener = page.locator('button[aria-label="Open Ask Impact"]:visible');
  if (await opener.count()) { condition(await opener.count() === 1, 'Native Ask Impact opener is not unique'); await opener.click(); }
  await input.waitFor({ state: 'visible', timeout: 15000 });
  condition(await input.inputValue() === '', 'Native AI has an existing draft; automatic acceptance preserves it');
  let previous = '', stableSince = 0, baselineReplies = [];
  const baselineDeadline = Date.now() + 12000;
  while (Date.now() < baselineDeadline) {
    const current = await replies.allTextContents(), text = current.join('\n');
    condition(!current.some(value => /^\s*(Thinking|正在思考)[.\s…]*$/iu.test(value)), 'Previous AI response is still generating');
    if (text === previous) { if (!stableSince) stableSince = Date.now(); if (Date.now() - stableSince > 1800) { baselineReplies = current; break; } } else { previous = text; stableSince = 0; }
    await page.waitForTimeout(250);
  }
  condition(stableSince && Date.now() - stableSince > 1800, 'Native conversation baseline did not stabilize');
  const close = page.locator('#ask-impact-shadow-host button[title="Close"]:visible');
  condition(await close.count() === 1, 'Native Ask Impact close control is not unique'); await close.click();
  await page.locator('button[aria-label="Open Ask Impact"]:visible').waitFor({ timeout: 10000 });
  const candidates = [];
  for (const frame of await relevantFrames(page)) {
    const button = frame.locator(`button[data-impact-cn-help][data-topic-id="${definition.topicId}"]:visible`);
    const count = await button.count(); if (count) candidates.push({ frame, button: definition.helpSelector ? frame.locator(definition.helpSelector) : button.first(), count });
  }
  condition(candidates.length === 1, 'Finance concept question is absent or exists in multiple frames');
  const selected = candidates[0];
  condition(await selected.button.getAttribute('data-topic-id') === definition.topicId, 'Selected inline question does not match the finance topic');
  await page.evaluate(() => {
    globalThis.__financeAIProofCleanup?.();
    const proof = globalThis.__financeAIProof = { automaticSends: 0, trustedSends: 0, inputEvents: 0, successObserved: false, interference: false };
    const click = event => { const path = event.composedPath(); if (path.some(node => node instanceof Element && node.id === 'ask-impact-shadow-host') && path.some(node => node instanceof Element && node.matches('button[aria-label="Send"]'))) event.isTrusted ? proof.trustedSends++ : proof.automaticSends++; };
    const input = event => { if (event.composedPath().some(node => node instanceof Element && node.id === 'ask-impact-shadow-host')) { proof.inputEvents++; if (event.isTrusted) proof.interference = true; } };
    const status = document.querySelector('#impact-cn-assistant .impact-cn-status');
    const observer = new MutationObserver(() => { if (status?.dataset.type === 'success') proof.successObserved = true; });
    if (status) observer.observe(status, { attributes: true, childList: true, subtree: true });
    document.addEventListener('click', click, true); document.addEventListener('input', input, true);
    globalThis.__financeAIProofCleanup = () => { observer.disconnect(); document.removeEventListener('click', click, true); document.removeEventListener('input', input, true); };
  });
  try {
    onProgress?.(`ai-${definition.topicId}-clicking-native-question`);
    await selected.button.click();
    await page.waitForFunction(() => globalThis.__financeAIProof?.automaticSends > 0 || globalThis.__financeAIProof?.interference, null, { timeout: 20000 });
    let last = '', since = 0, evidence, lastDiagnostic;
    const deadline = Date.now() + 100000;
    while (Date.now() < deadline) {
      const proof = await page.evaluate(() => ({ ...globalThis.__financeAIProof }));
      condition(!proof.interference && proof.trustedSends === 0, 'User interference prevents automatic AI acceptance');
      const count = await replies.count(), reply = replies.last();
      const text = count > baselineReplies.length && await reply.isVisible() ? await reply.innerText() : '';
      const links = text ? (await reply.locator('a[href^="https://help.impact.com/"]').evaluateAll(nodes => nodes.map(node => node.href))).map(publicHelpURL).filter(Boolean) : [];
      const concept = new RegExp(definition.conceptRegex, 'iu').test(text);
      const expectedURL = publicHelpURL(definition.expectedHelpUrl || topic.helpUrl || topic.officialUrl || '');
      const correspondingLink = expectedURL ? links.includes(expectedURL) : false;
      lastDiagnostic={topicId:definition.topicId,automaticSends:proof.automaticSends,trustedSends:proof.trustedSends,nativeInputEvents:proof.inputEvents,successObserved:proof.successObserved,baselineReplyCount:baselineReplies.length,currentReplyCount:count,chinese:/[\u4e00-\u9fff]/u.test(text),conceptMatched:concept,correspondingOfficialLink:correspondingLink,links:[...new Set(links)],replyLength:text.length,fullConversationSaved:false};
      const complete = count > baselineReplies.length && !baselineReplies.includes(text) && /[\u4e00-\u9fff]/u.test(text) && concept && correspondingLink && !/请用简体中文按以下固定模板回答|请只解释以上选中的概念/u.test(text);
      if (complete && text === last) { if (!since) since = Date.now(); if (Date.now() - since >= 1600) { evidence = { topicId: definition.topicId, automaticSends: proof.automaticSends, trustedSends: proof.trustedSends, nativeInputEvents: proof.inputEvents, successObserved: proof.successObserved, baselineReplyCount: baselineReplies.length, newReplyCount: count, nativeReplyChanged: true, chinese: true, conceptMatched: true, correspondingOfficialLink: true, links: [...new Set(links)], stableForMs: 1600, replyLength: text.length, fullConversationSaved: false, clickedFromChildFrame: selected.frame !== page.mainFrame() }; break; } } else since = 0;
      last = text; await page.waitForTimeout(350);
    }
    if(!evidence){const error=new Error('New native AI reply did not complete in Chinese with the corresponding official HelpDoc link');error.safeFinanceAssertion=true;error.financeEvidence=lastDiagnostic;throw error;}
    condition(evidence.automaticSends === 1 && evidence.successObserved, 'Finance question did not trigger exactly one successful automatic native send');
    condition((await input.inputValue()).trim() === '', 'AI preset remains in the draft after automatic send');
    return evidence;
  } finally { await page.evaluate(() => globalThis.__financeAIProofCleanup?.()).catch(() => {}); }
}

/** Root controls the authenticated MV3 browser and passes its existing toggle functions. */
export async function runModule(options) {
  const { context, page, root, translation, ai, onProgress, capture: suppliedCapture, pages: suppliedPages }=options;
  const control=options.options||options,onlyPageIds=control.onlyPageIds||options.onlyPageIds,safeActions=control.safeActions||options.safeActions||{},aiCases=control.aiCases||options.aiCases||(typeof ai==='object'?ai.cases:[])||[];
  const setAIEnabled=typeof ai==='function'?ai:options.aiEnabled||ai?.setEnabled;
  condition(context && page && root && typeof translation === 'function', 'Finance live module needs the existing authenticated browser and translation toggle');
  if(control.inspectEntityMenus===true){
    const module=await import(`${pathToFileURL(path.join(root,'scripts/finance-menu-checks.mjs')).href}?revision=${Date.now()}`);
    return module.runFinanceMenuChecks(options);
  }
  if(control.inspectOpener===true){
    const module=await import(`${pathToFileURL(path.join(root,'scripts/finance-opener-inspection.mjs')).href}?revision=${Date.now()}`);
    const sandbox={};vm.createContext(sandbox);vm.runInContext(readFileSync(path.join(root,'impact-cn-mod/dict.js'),'utf8'),sandbox);
    const knownLabels=sandbox.IMPACT_CN_DICTIONARY.entries.filter(entry=>entry.stage==='native-finance').flatMap(entry=>[entry.source,entry.target]);
    condition(typeof control.openerSelector==='string'&&typeof control.openerFramePath==='string','Opener diagnostic needs the exact observed selector and document path');
    const frames=(await relevantFrames(page)).filter(frame=>new URL(frame.url()).origin==='https://demo.impact.com'&&new URL(frame.url()).pathname===control.openerFramePath);
    condition(frames.length===1,'Opener diagnostic document is absent or ambiguous');
    const evidence=await frames[0].evaluate(module.inspectFinanceOpenerControl,{selector:control.openerSelector,knownLabels});
    condition(evidence.authorized===true,'Opener diagnostic left its finance scope');
    const name=control.openerReportName;condition(typeof name==='string'&&/^[a-z0-9-]+$/u.test(name),'Opener diagnostic name must be safe');
    const folder=path.join(root,'artifacts/finance-acceptance-20261010');mkdirSync(folder,{recursive:true});writeFileSync(path.join(folder,name+'.json'),JSON.stringify(evidence,null,2)+'\n');
    onProgress?.('OPENER_STRUCTURE '+JSON.stringify(evidence));return evidence;
  }
  if(control.inspectFinanceLayout===true){
    const module=await import(`${pathToFileURL(path.join(root,'scripts/finance-layout-checks.mjs')).href}?revision=${Date.now()}`);
    condition(typeof module.runFinanceLayoutChecks==='function','Finance layout inspector is unavailable');
    return module.runFinanceLayoutChecks(options);
  }
  if(control.inspectReportStructure===true){
    const module=await import(`${pathToFileURL(path.join(root,'scripts/finance-report-inspection.mjs')).href}?revision=${Date.now()}`);
    const original=await page.locator('#impact-cn-assistant').getAttribute('data-enabled');
    let documents;
    try{
      await translation(false);await page.waitForTimeout(200);
      documents=[];for(const frame of await relevantFrames(page)){const result=await frame.evaluate(module.inspectFinanceReportStructure);if(result.authorizedReport)documents.push(result);}
    }finally{await translation(original!=='false');}
    condition(documents.filter(item=>item.visibleFormCount===1).length===1,'Report inspection requires one current native report form');
    const name=control.reportStructureName||`report-structure-${Date.now()}`;condition(/^[a-z0-9-]+$/u.test(name),'Invalid local report inspection filename');
    const folder=path.join(root,'artifacts/finance-acceptance-20261010');mkdirSync(folder,{recursive:true});
    const report={mode:'REAL_NETWORK_REPORT_STRUCTURE_ONLY',version:JSON.parse(readFileSync(path.join(root,'impact-cn-mod/manifest.json'),'utf8')).version,date:new Date().toISOString(),queryCompletionAssessed:false,financialOperations:0,privateValuesReturned:false,documents};
    writeFileSync(path.join(folder,name+'.json'),JSON.stringify(report,null,2)+'\n');
    onProgress?.(`REPORT_DOM_STRUCTURE ${JSON.stringify(documents.map(item=>({handle:item.reportHandle,formCount:item.formCount,fixedLabels:item.labels.map(label=>({label:label.fixedDirectText,parent:label.parent,nativeControl:label.nativeControl})),tables:item.tables.map(table=>({index:table.index,classNames:table.classNames,children:table.children,th:table.th,columnHeaders:table.columnHeaders,thead:table.thead,headerClassGroups:table.headerClassGroups,loaders:table.visibleLoaderNodeCount,empty:table.visibleEmptyCandidateNodeCount,contains:table.containsTableIndexes,containedBy:table.containedByTableIndexes})),queryCompletionAssessed:false})))}`);
    return report;
  }
  if(control.inspectNativeAI===true||options.inspectNativeAI===true||control.openNativeAI===true||options.openNativeAI===true){
    const configSandbox={};vm.createContext(configSandbox);vm.runInContext(readFileSync(path.join(root,'impact-cn-mod/site-config.js'),'utf8'),configSandbox);
    const config=JSON.parse(JSON.stringify(configSandbox.IMPACT_CN_CONFIG?.ai||{}));let clickedControls=0;
    if(control.openNativeAI===true||options.openNativeAI===true){
      const before=await page.evaluate(inspectNativeAIStructure,config);
      if(before.visibleInputCount===0){
        condition(before.askImpactHostCount===1&&before.visibleOpenerCount===1&&(config.openerSelectors||[]).length>0,'Native AI opener is absent or ambiguous; no retry performed');
        const opener=page.locator(config.openerSelectors.join(',')).filter({visible:true});condition(await opener.count()===1,'Configured native AI opener is ambiguous');
        condition(await opener.evaluate(element=>element.tagName==='BUTTON'&&!element.disabled&&element.getAttribute('aria-disabled')!=='true'&&(!element.form||element.type!=='submit')),'Native AI opener is disabled or a submit control');
        await opener.click();clickedControls=1;
        const deadline=Date.now()+Math.min(10000,config.openTimeoutMs||10000);let ready;
        while(Date.now()<deadline){ready=await page.evaluate(inspectNativeAIStructure,config);if(ready.visibleInputCount===1)break;await page.waitForTimeout(100);}
        condition(ready?.visibleInputCount===1,'Native AI did not expose one editor after the single opener click; no retry performed');
      }
    }
    const structure={...await page.evaluate(inspectNativeAIStructure,config),clickedControls};
    onProgress?.(`NATIVE_AI_DOM_STRUCTURE ${JSON.stringify(structure)}`);return structure;
  }
  if(control.prepareExtension===true){
    const management=context.pages().find(item=>item.url().startsWith('chrome://extensions')&&!item.isClosed())||await context.newPage();
    if(!management.url().startsWith('chrome://extensions'))await management.goto('chrome://extensions/');
    const devMode=management.locator('extensions-toolbar #devMode');await devMode.waitFor({state:'visible',timeout:10000});
    if(!await devMode.evaluate(element=>Boolean(element.checked)))await devMode.click();
    const deadline=Date.now()+5000;let enabled=false;while(Date.now()<deadline){enabled=await devMode.evaluate(element=>Boolean(element.checked));if(enabled)break;await management.waitForTimeout(100);}
    condition(enabled,'Temporary test profile developer mode did not enable');
    if(management!==page)await management.close();await page.bringToFront();return{status:'READY',developerMode:true,temporaryProfileOnly:true,acceptanceRun:false};
  }
  // Coordinator dispatches read-only supplemental capture through this same
  // authenticated session. It does not run or overwrite acceptance reports.
  if(control.captureExtra===true||options.captureExtra===true){const module=await import(`${pathToFileURL(path.join(root,'scripts/finance-extra-capture.mjs')).href}?revision=${Date.now()}`);condition(typeof module.runExtraCapture==='function','Supplemental capture module is unavailable');return module.runExtraCapture(options);}
  if(control.captureDeep===true||options.captureDeep===true){const module=await import(`${pathToFileURL(path.join(root,'scripts/finance-deep-capture.mjs')).href}?revision=${Date.now()}`);condition(typeof module.runDeepCapture==='function','Deep capture module is unavailable');return module.runDeepCapture(options);}
  const capture = suppliedCapture || JSON.parse(readFileSync(path.join(root, 'docs/finance-dom-scan.json'), 'utf8'));
  const sandbox = {}; vm.createContext(sandbox); vm.runInContext(readFileSync(path.join(root, 'impact-cn-mod/dict.js'), 'utf8'), sandbox);
  const dictionary = sandbox.IMPACT_CN_DICTIONARY;
  if(control.screenshotOnly===true)return screenshotFinancePage({page,root,translation,setAIEnabled,onProgress,capture,control,dictionary});
  const entries = JSON.parse(JSON.stringify(dictionary.entries.filter(entry => entry.stage === 'native-finance' || entry.observedSource === 'docs/finance-dom-scan.json')));
  condition(entries.length > 0, 'No observed finance-body dictionary entries are installed');
  const pages = (suppliedPages || pageDefinitions(capture)).filter(item => !onlyPageIds || onlyPageIds.includes(item.id));
  condition(pages.length > 0, 'No captured finance pages selected');
  const folder = path.join(root, 'artifacts/finance-tests'); mkdirSync(folder, { recursive: true });
  const report = { status: 'RUNNING', mode: 'REAL_NETWORK_FINANCE', version: dictionary.version, date: new Date().toISOString(), selectedPages: pages.map(item => item.id), expectedPages: pageDefinitions(capture).length, expectedPageIds: pageDefinitions(capture).map(item=>item.id), unverifiedDeepStates:unverifiedFinanceDeepStates(capture), completePageCoverage: false, completeAcceptance:false,selectedAICases:aiCases.map(item=>item.topicId),aiSelected:aiCases.length>0,routesOrFixtures: false, noMoneyOperations: true, noSettingsWrites: true, credentialsSaved: false, fullConversationSaved: false, results: [], aiCases: [], longEnglishBodyScans: [], pageErrors: 0 };
  const errorListener = () => report.pageErrors++; page.on('pageerror', errorListener);
  report.diagnostics=[];let currentPhase=null;
  const setPhase=(pageId,state,phase)=>{currentPhase={pageId,state,phase};report.currentPhase=currentPhase;save();onProgress?.(`finance-${pageId}-${state}-${phase}`);};
  const documentsFor=async(definition,state,initialOnly=true)=>{setPhase(definition.id,state,'doc-ready');return waitForCapturedDocuments(page,definition,initialOnly,{onDiagnostic:detail=>report.diagnostics.push({pageId:definition.id,state,...detail})});};
  const save = () => { writeFileSync(path.join(folder, 'live-report.json'), JSON.stringify(report, null, 2)); writeFileSync(path.join(root, 'finance-live-test-report.md'), `# 财务模块实网验收\n\n版本：${report.version}。结果：**${report.status}**。时间：${report.date}。\n\n范围：${report.selectedPages.length}/${report.expectedPages} 个真实页面；${report.completePageCoverage ? '全量页面检查' : '部分检查，不能代表整个财务模块验收'}；本轮${report.aiSelected?`选择了${report.selectedAICases.length}个原生AI用例`:'未运行AI回复验收，不能据此声称新概念AI验收通过'}。未使用请求路由或模拟 AI；没有充值、转账、保存、删除或凭据导出。\n\n${report.results.map(item => `- **${item.status}** ${item.pageId || item.name}：${item.evidence}`).join('\n')}\n\n完整财务验收：${report.completeAcceptance?'已通过':'未完成'}。必需深层状态缺口：${report.unverifiedDeepStates.length?report.unverifiedDeepStates.map(item=>item.pageId+':'+item.state).join('、'):'无'}。\n\n独立扫描了 ${report.longEnglishBodyScans.length} 个真实财务正文状态；静态英文长句残留 ${report.longEnglishBodyScans.reduce((sum,item)=>sum+item.staticEnglishNodes,0)} 处；含数字或币种的英文长句 ${report.longEnglishBodyScans.reduce((sum,item)=>sum+item.dynamicMixedEnglishNodes,0)} 处。单独证据仅包含计数与 DOM 结构选择器。\n\n原金额、日期、业务名称和 DOM 引用仅保留在浏览器内存；报告只记录计数、词条 ID 与官方文档链接，不保存对话正文。\n`); };
  const record = (pageId, status, evidence, details) => { const item = { pageId, status, evidence, ...details }; report.results.push(item); onProgress?.(`${status} ${pageId}: ${evidence}`); save(); };
  const scanBody = async(pageId,state,frames)=>{
    const documents=[];for(const frame of frames){const found=await frame.evaluate(scanFinanceEnglishProse);if(found.applicable)documents.push({framePath:new URL(frame.url()).pathname,...found});}
    const evidence={pageId,state,documents,staticEnglishNodes:documents.reduce((sum,item)=>sum+item.staticEnglishNodes,0),dynamicMixedEnglishNodes:documents.reduce((sum,item)=>sum+item.dynamicMixedEnglishNodes,0)};
    report.longEnglishBodyScans.push(evidence);save();
    condition(evidence.staticEnglishNodes===0&&evidence.dynamicMixedEnglishNodes===0,`Independent visible finance-prose scan found ${evidence.staticEnglishNodes} untranslated static long sentences; ${evidence.dynamicMixedEnglishNodes} long sentences containing numeric/currency text remain untranslated. Structural selectors only saved in separate evidence`);
  };
  save();
  try {
    for (const definition of pages) {
      try {
        const target = new URL(definition.url, 'https://demo.impact.com'); condition(target.protocol === 'https:' && target.hostname === 'demo.impact.com' && target.pathname.startsWith('/secure/'), 'Finance page target must remain on the authorized demo HTTPS origin');
        onProgress?.(`finance-${definition.id}-opening-real-page`);
        setPhase(definition.id,'initial','goto');
        await page.goto(target.href, { waitUntil: 'domcontentloaded', timeout: 45000 });
        setPhase(definition.id,'initial','helper');
        await page.locator('#impact-cn-assistant').waitFor({ state: 'attached', timeout: 20000 });
        if (definition.readySelector) await page.locator(definition.readySelector).first().waitFor({ state: 'visible', timeout: 20000 });
        await page.waitForTimeout(900);
        condition(await page.evaluate(() => !globalThis.ImpactCN), 'Finance acceptance must use isolated MV3 content scripts');
        const frames = await documentsFor(definition,'initial'), baselines = [];
        setPhase(definition.id,'initial','translation-verify');
        await translation(false); await page.waitForTimeout(200);
        for (const [index, frame] of frames.entries()) {
          const key = `${definition.id}-${index}`;
          const baseline = await frame.evaluate(establishBaseline, { key, entries, topURL: page.url(), candidates: definition.candidates || [], pageId: definition.id });
          if (baseline.textNodes) baselines.push({ frame, key, baseline });
        }
        requireFinanceBodyBaselines(frames,baselines,page);
        condition(baselines.length > 0, 'No observed static finance labels matched this captured page');
        await translation(true);
        const totals = { textNodes: 0, prefixNodes: 0,suffixNodes:0,numericTemplateNodes:0, valueNodes: 0,privateDataNodes:0,links: 0, translatedFrames: baselines.length, entryIds: [], dynamicStates: 0, visibleCapturedCandidateNodes: 0, longEnglishResidues: 0 };
        for (const baseline of baselines) {
          await baseline.frame.waitForFunction(({ key }) => globalThis.__financeLiveBaselines[key].records.every(record => record.node.nodeValue === record.expected), { key: baseline.key }, { timeout: 14000 });
          const verified = await baseline.frame.evaluate(verifyBaseline, { key: baseline.key, translated: true });
          condition(baseline.baseline.uncoveredCandidateIds.length===0, `Visible captured static labels lack finance dictionary entries: ${baseline.baseline.uncoveredCandidateIds.join(', ')}`);
          condition(['detached', 'replaced', 'untranslated', 'numericChanged','numericSlotsChanged','privateDataChanged', 'linksChanged', 'prefixSuffixChanged','suffixPrefixChanged', 'nestedInteractiveHelp', 'overwrittenLabels'].every(key => verified[key] === 0), `Finance invariants failed: detached=${verified.detached}; replaced=${verified.replaced}; untranslated=${verified.untranslated}; values=${verified.numericChanged}; numericSlots=${verified.numericSlotsChanged}; privateData=${verified.privateDataChanged}; links=${verified.linksChanged}; suffixes=${verified.prefixSuffixChanged}; prefixes=${verified.suffixPrefixChanged}; nestedHelp=${verified.nestedInteractiveHelp}; labelChildren=${verified.overwrittenLabels}`);
          condition(verified.longEnglishResidues===0, 'Observed long English finance sentences remain untranslated');
          totals.textNodes += verified.textNodes; totals.valueNodes += verified.valueNodes;totals.privateDataNodes+=verified.privateDataNodes;totals.links += verified.links; totals.prefixNodes += baseline.baseline.prefixNodes;totals.suffixNodes+=baseline.baseline.suffixNodes;totals.numericTemplateNodes+=baseline.baseline.numericTemplateNodes;totals.entryIds.push(...verified.entryIds); totals.visibleCapturedCandidateNodes+=baseline.baseline.visibleCapturedCandidateNodes; totals.longEnglishResidues+=verified.longEnglishResidues;
        }
        await scanBody(definition.id,'initial',frames);
        await translation(false);
        for (const baseline of baselines) { const restored = await baseline.frame.evaluate(verifyBaseline, { key: baseline.key, translated: false }); condition(restored.untranslated === 0 && restored.replaced === 0 && restored.numericChanged === 0&&restored.privateDataChanged===0, 'Translation OFF did not restore original finance Text nodes and values'); }
        await translation(true);
        // Each dynamic state starts from its captured route. Opening a form is
        // safe; submitting it is forbidden. Fresh frames replace stale refs.
        const capturedActions=safeActions[definition.id]||definition.safeActions||[],uniqueActions=[...new Map(capturedActions.map(action=>[[action.capturedState||action.state||action.stateName,action.clickSelector||action.selector||JSON.stringify((action.steps||[]).map(step=>[step.selector,step.frameURL])),action.frameURL,action.sourceTopPath,action.resultingTopPath].join('|'),action])).values()];
        for (const action of uniqueActions) {
          const state=action.capturedState||action.state||action.stateName;
          const legacyCaptured=action.action==='native-control-click'&&action.submitPerformed===false&&definition.captures?.some(item=>item.state===state);
          const reportQuery=approvedReadOnlyReportQuery(action,target.href),entitySequence=approvedEntityEditSequence(action,target.href);
          condition(action.action!=='native-control-sequence'||reportQuery||entitySequence,'Native control sequence lacks verified report or entity evidence');
          condition((action.safeReadOnly===true&&['open-dropdown','open-filter-menu','open-calendar','open-tab','open-form','open-view','open-checkbox','toggle-local-checkbox'].includes(action.type))||legacyCaptured||reportQuery,'Dynamic finance action lacks explicit read-only approval');
          condition(reportQuery||entitySequence||action.selector,'Dynamic finance opener has no captured selector');
          onProgress?.(`finance-${definition.id}-state-${state||totals.dynamicStates}`);
          setPhase(definition.id,state,'goto');await page.goto(target.href,{waitUntil:'domcontentloaded',timeout:45000});setPhase(definition.id,state,'helper');await page.locator('#impact-cn-assistant').waitFor();await documentsFor(definition,state);setPhase(definition.id,state,'translation-verify');await translation(true);
          const sequence=reportQuery||entitySequence?action.steps:[...(action.replay||action.prerequisites||[]),action];
          for(const [index,step]of sequence.entries())await replayReadOnlyFinanceStep({page,action,step,index,reportQuery,entitySequence,dictionary});
          const dynamicCandidates=financeDynamicCandidates(definition,action,state,page.url(),target.href);
          const dynamicFrames=await documentsFor({...definition,candidates:dynamicCandidates},state,false);
          const stateSpecific=dynamicCandidates.filter(item=>!item.observedStates?.includes('initial')&&!/(?:#adv-navigation|sidenav-|#header\b|global-header|(?:^|[ >])(?:nav|aside)(?:[ .#[:>]|$))/iu.test([...(item.shadowPath||[]),item.selector].join(' ')));
          for(const candidate of stateSpecific){const frame=dynamicFrames.find(item=>new URL(item.url()).pathname===new URL(candidate.frameURL).pathname);condition(frame,'Dynamic state-specific finance document is absent');const selector=candidate.shadowPath?.length?candidate.shadowPath.join(' ')+' '+candidate.selector:candidate.selector;await frame.locator(selector).filter({visible:true}).first().waitFor({timeout:10000});}
          setPhase(definition.id,state,'translation-verify');await translation(false);await page.waitForTimeout(150);const dynamicBaselines=[];
          for(const [index,frame]of dynamicFrames.entries()){const key=`${definition.id}-dynamic-${totals.dynamicStates}-${index}`;const dynamic=await frame.evaluate(establishBaseline,{key,entries,topURL:page.url(),candidates:dynamicCandidates,pageId:definition.id});if(dynamic.textNodes||dynamic.visibleCapturedCandidateNodes)dynamicBaselines.push({frame,key,dynamic});}
          requireFinanceBodyBaselines(dynamicFrames,dynamicBaselines,page);
          condition(dynamicBaselines.length>0,'Read-only dynamic state contains no observed finance labels');await translation(true);
          for(const baseline of dynamicBaselines){await baseline.frame.waitForFunction(key=>globalThis.__financeLiveBaselines[key].records.every(record=>record.node.nodeValue===record.expected),baseline.key,{timeout:14000});const verified=await baseline.frame.evaluate(verifyBaseline,{key:baseline.key,translated:true});condition(baseline.dynamic.uncoveredCandidateIds.length===0,`Dynamic captured labels lack finance entries: ${baseline.dynamic.uncoveredCandidateIds.join(', ')}`);condition(['untranslated','replaced','numericChanged','numericSlotsChanged','privateDataChanged','linksChanged','prefixSuffixChanged','suffixPrefixChanged','nestedInteractiveHelp'].every(key=>verified[key]===0),'Dynamic finance state did not preserve and translate its captured Text nodes, data and native controls');totals.entryIds.push(...verified.entryIds);}
          await scanBody(definition.id,state,dynamicFrames);
          totals.dynamicStates++;
        }
        totals.entryIds = [...new Set(totals.entryIds)];
        record(definition.id, 'PASS', `${totals.textNodes} observed Text nodes; ${totals.valueNodes} monetary/date data nodes; ${totals.links} links retained; ${totals.translatedFrames} documents; ${totals.dynamicStates} read-only dynamic states`, totals);
      } catch (error) { record(definition.id, 'FAIL', error.safeFinanceAssertion ? error.message : `Browser check failed (${error.name || 'Error'}); private browser detail suppressed`,{phase:currentPhase?.phase,state:currentPhase?.state,errorType:error.name||'Error',...(error.financeEvidence?{diagnostics:error.financeEvidence}:{})}); }
    }
    for (const definition of aiCases) {
      try {
        const pageDefinition = pages.find(item => item.id === definition.pageId); condition(pageDefinition, 'AI case finance page is outside the selected capture scope');
        await page.goto(new URL(pageDefinition.url, 'https://demo.impact.com').href, { waitUntil: 'domcontentloaded', timeout: 45000 }); await page.locator('#impact-cn-assistant').waitFor();await waitForCapturedDocuments(page,pageDefinition); await translation(true); await page.waitForTimeout(600);
        if (typeof setAIEnabled === 'function') await setAIEnabled(true);
        const evidence = await verifyAI({ page, definition, dictionary, onProgress }); report.aiCases.push({ status: 'PASS', ...evidence }); record(`AI:${definition.topicId}`, 'PASS', 'One automatic native send; new stable Chinese reply explains selected finance concept and cites its corresponding official HelpDoc');
      } catch (error) { report.aiCases.push({ topicId: definition.topicId, status: 'FAIL', evidence: error.safeFinanceAssertion ? error.message : `Native AI check failed (${error.name || 'Error'}); private detail suppressed`,...(error.financeEvidence?{diagnostics:error.financeEvidence}:{}) }); record(`AI:${definition.topicId}`, 'FAIL', report.aiCases.at(-1).evidence); }
    }
    condition(report.pageErrors === 0, 'Finance real pages emitted JavaScript errors');
    report.status = report.results.length >= pages.length && report.results.every(item => item.status === 'PASS') ? 'PASS' : 'FAIL';finalizeFinanceCoverage(report);
  } catch (error) { report.status = 'FAIL'; record('runtime', 'FAIL', error.safeFinanceAssertion ? error.message : `Finance runtime failed (${error.name || 'Error'})`); }
  finally { finalizeFinanceCoverage(report);page.off('pageerror', errorListener); await translation(true).catch(() => {}); save(); }
  return report;
}

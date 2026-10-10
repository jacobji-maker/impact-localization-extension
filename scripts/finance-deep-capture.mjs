/** Read-only finance filters, report queries and existing entity detail UI. */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import vm from 'node:vm';
const safeURL = value => { try { const url = new URL(value); return url.origin + url.pathname.replace(/\/\d{4,}(?=\/|$)/gu, '/<private-id>'); } catch { return '[unavailable]'; } };
const staticQuery = value => { const url = new URL(value); return Object.fromEntries([...url.searchParams].filter(([key, item]) => key === 'handle' && /^adv_[a-z_]+$/u.test(item) || key === 'u' && /^\/secure\/finance\/app\/[a-z0-9-]+\.ihtml$/iu.test(item))); };
const inspectControls = ({ kind, label, nameColumn = 0, rememberPrivate = false }) => {
  const roots = []; const findRoots = root => { roots.push(root); for (const element of root.querySelectorAll('*')) if (element.shadowRoot && !/ask[-_]?impact|impact-cn/iu.test(element.id)) findRoots(element.shadowRoot); }; findRoots(document);
  const visible = element => { const bounds = element.getBoundingClientRect(); if (!bounds.width || !bounds.height) return false; for (let current = element; current;) { const style = getComputedStyle(current); if (current.hidden || current.getAttribute('aria-hidden') === 'true' || style.visibility === 'hidden' || style.display === 'none' || Number(style.opacity) === 0) return false; current = current.parentElement || (current.getRootNode() instanceof ShadowRoot ? current.getRootNode().host : null); } return true; };
  const selector = element => { const parts = []; let current = element; while (current?.nodeType === 1 && parts.length < 7) { if (current.id && !/\d/u.test(current.id)) { parts.unshift(`#${CSS.escape(current.id)}`); break; } const tag = current.tagName.toLowerCase(); const stable = [...current.classList].filter(value => /^[a-zA-Z][a-zA-Z_-]*$/u.test(value) && !/^css-|^sc-/u.test(value)).slice(0, 2); let piece = tag + stable.map(value => `.${CSS.escape(value)}`).join(''); const siblings = current.parentElement ? [...current.parentElement.children].filter(item => item.tagName === current.tagName) : []; if (siblings.length > 1) piece += `:nth-of-type(${siblings.indexOf(current) + 1})`; parts.unshift(piece); current = current.parentElement; } return parts.join(' > '); };
  const matches = new Map(); const headerInspections = []; const structures = [];
  const fixedLabels = new Set(['All', 'None', 'Select All', 'Deselect All', 'Clear', 'Cancel', 'Apply', 'Edit', 'View', 'Close', 'Delete', 'Remove', 'Save', 'Name', 'More', 'Actions']);
  const reportPaths = { adv_upcoming_payouts: '/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report', adv_cash_flow_recon: '/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report' };
  const reportHandle = new URL(location.href).searchParams.get('handle');
  const authorizedReport = location.origin === 'https://demo.impact.com' && reportPaths[reportHandle] === location.pathname;
  const describe = element => { const text = element.textContent.trim().replace(/\s+/gu, ' '); const aria = element.getAttribute('aria-label'); return { selector: selector(element), tag: element.tagName, role: element.getAttribute('role'), type: element.getAttribute('type'), classes: [...element.classList].filter(value => /^[a-zA-Z][a-zA-Z_\d-]{0,90}$/u.test(value)), ariaChecked: element.getAttribute('aria-checked'), ariaExpanded: element.getAttribute('aria-expanded'), ariaHasPopup: element.getAttribute('aria-haspopup'), disabled: element.matches(':disabled,[aria-disabled="true"]'), visible: visible(element), pointerCursor: getComputedStyle(element).cursor === 'pointer', fixedLabel: fixedLabels.has(text) ? text : undefined, fixedAriaLabel: fixedLabels.has(aria) ? aria : undefined, nativeCheckboxCount: element.querySelectorAll('input[type="checkbox"]').length, nameTextReturned: false, valueReturned: false }; };
  if (kind === 'label-control') for (const root of roots) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let node;
    while ((node = walker.nextNode())) {
      const text = node.nodeValue.trim().replace(/\s+/gu, ' '); if (!(text === label || label === 'Funding Status ·' && text.startsWith('Funding Status'))) continue;
      let element = node.parentElement?.closest('button,[role="button"],span[class*="baseFilterButton"]'); if (!element || !visible(element) || element.closest('#impact-cn-assistant,#ask-impact-shadow-host')) continue;
      matches.set(selector(element), { selector: selector(element), tag: element.tagName, role: element.getAttribute('role'), type: element.getAttribute('type'), disabled: element.matches(':disabled,[aria-disabled="true"]'), actualStaticLabel: label, dynamicLabelTailReturned: false, count: 1 });
    }
  }
  if (kind === 'entity-name') for (const root of roots) {
    const bodies = [...root.querySelectorAll('.table-body,tbody,[role="rowgroup"]')].filter(visible);
    for (const body of bodies) {
      const rows = [...body.querySelectorAll('.table-row,tr,[role="row"]')].filter(visible); if (!rows.length) continue;
      const table = body.closest('.iui-data-table,.iui-data-view,table,[role="table"]') || body.parentElement;
      const primaryHeaders = [...table.querySelectorAll('[data-testid^="uicl-data-table-column-label-"]')].filter(visible);
      const headers = primaryHeaders.length ? primaryHeaders : [...table.querySelectorAll('th,[role="columnheader"],.table-header .header-cell,.table-header .table-cell')].filter(visible);
      const labels = headers.map(element => element.textContent.trim().replace(/\s+/gu, ' ')); const nameIndexes = labels.flatMap((value, index) => value === 'Name' ? [index] : []);
      headerInspections.push({ headerLabels: labels, headerTags: headers.map(element => element.tagName), headerSelectors: headers.map(selector), bodyTag: body.tagName, bodyClasses: [...body.classList], visibleRowCount: rows.length, nameColumnCount: nameIndexes.length, nameCellTextReturned: false });
      if (nameIndexes.length !== 1) continue; const verifiedNameColumn = nameIndexes[0];
      for (const row of rows) {
      const cells = [...row.querySelectorAll(':scope > .table-cell,:scope > td,:scope > [role="cell"]')]; const cell = cells[verifiedNameColumn]; if (!cell) continue;
      if (rememberPrivate) { window.__financePrivateStrings ||= new Set(); for (const node of [cell, ...cell.querySelectorAll('*')]) { const value = node.textContent.trim(); if (value.length >= 3 && value.length < 180) window.__financePrivateStrings.add(value); } }
      const candidates = [...cell.querySelectorAll('a,button,[role="link"],[role="button"],p,span,div')].filter(element => visible(element) && !element.matches('input,[contenteditable]') && (element.matches('a[href],button,[role="link"],[role="button"]') || getComputedStyle(element).cursor === 'pointer'));
      const links = candidates.filter(element => element.matches('a[href],[role="link"]')); const preferred = links.length ? links : candidates.filter(element => !candidates.some(parent => parent !== element && parent.contains(element)));
      for (const element of preferred) { let sameOrigin = true; try { if (element.getAttribute('href')) sameOrigin = new URL(element.getAttribute('href'), location.href).origin === location.origin; } catch { sameOrigin = false; } if (!sameOrigin) continue; matches.set(selector(element), { selector: selector(element), tag: element.tagName, role: element.getAttribute('role'), type: element.getAttribute('type'), disabled: element.matches(':disabled,[aria-disabled="true"]'), hasHref: Boolean(element.getAttribute('href')), hrefSameOrigin: sameOrigin, hrefReturned: false, nameTextReturned: false, cellIndex: verifiedNameColumn, headerEvidence: { headerLabels: labels, verifiedNameColumn, fixedHeaderName: 'Name' }, semanticEvidence: 'all visible business rows inspected; verified Name column and native link/button/pointer affordance; uniqueness required before click', count: 1 }); }
      }
    }
  }
  if (kind === 'mark-popup-baseline') {
    window.__financePopupBaseline = new WeakSet(); for (const root of roots) for (const element of root.querySelectorAll('*')) if (visible(element)) window.__financePopupBaseline.add(element);
    const enumLabels = new Set(['Type', 'Funding Status ·', 'Invoice Status']);
    const controlMatches = new Set();
    if (enumLabels.has(label) && location.pathname === '/secure/finance/app/manage-partner-funds-transfer-flow.ihtml') for (const root of roots) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let node;
      while ((node = walker.nextNode())) { const text = node.nodeValue.trim().replace(/\s+/gu, ' '); if (!(text === label || label === 'Funding Status ·' && /^Funding Status(?:\s*·(?:\s*\d+)?)?$/u.test(text))) continue; const element = node.parentElement?.closest('button,[role="button"],span[class*="baseFilterButton"]'); if (element && visible(element) && !element.matches(':disabled,[aria-disabled="true"]')) controlMatches.add(element); }
    }
    window.__financeEnumPopupContext = controlMatches.size === 1 ? { label, path: location.pathname, control: [...controlMatches][0], markedAt: Date.now() } : null;
    const fundingControls = new Set();
    if (label === 'Funding Account:' && authorizedReport) for (const root of roots) { const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let node; while ((node = walker.nextNode())) if (node.nodeValue.trim() === label) { const element = node.parentElement?.closest('button,[role="button"],span[class*="baseFilterButton"]'); if (element && visible(element) && !element.matches(':disabled,[aria-disabled="true"]')) fundingControls.add(element); } }
    window.__financeFundingPopupContext = fundingControls.size === 1 ? { path: location.pathname, handle: reportHandle, control: [...fundingControls][0], markedAt: Date.now() } : null;
    return { baselineMarked: true, enumFilterLabel: window.__financeEnumPopupContext?.label, verifiedFixedFilterControlCount: controlMatches.size, verifiedFundingFilterControlCount: fundingControls.size, valuesRead: false };
  }
  if (kind === 'popup-structure' || kind === 'new-static-edit') for (const root of roots) {
    const added = [...root.querySelectorAll('*')].filter(element => visible(element) && !window.__financePopupBaseline?.has(element) && !element.closest('#impact-cn-assistant,#ask-impact-shadow-host,[id^="ask-impact-"]'));
    for (const element of added) if (element.matches('button,a,input,label,li,[role],form,dialog') || /select|option|drop|menu|popup|popover|dialog|modal|check/iu.test(element.className || '')) structures.push({ ...describe(element), parent: element.parentElement ? describe(element.parentElement) : undefined });
    if (kind === 'new-static-edit') for (const element of added.filter(element => element.matches('button,a,[role="button"],[role="menuitem"]'))) if (element.textContent.trim() === 'Edit' && !element.matches(':disabled,[aria-disabled="true"]') && !(element.closest('form') && (element.tagName === 'BUTTON' && !element.type || element.type === 'submit'))) matches.set(selector(element), { ...describe(element), fixedLabel: 'Edit', actualStaticLabel: 'Edit', semanticEvidence: 'newly visible native Edit control after opening verified Name cell or row-overlay menu; no form submit control', count: 1 });
  }
  if (kind === 'row-affordances') for (const root of roots) for (const row of [...root.querySelectorAll('.table-body .table-row,tbody tr,[role="rowgroup"] [role="row"]')].filter(visible)) for (const element of row.querySelectorAll('button,a,[role="button"],[role="menuitem"],[aria-haspopup]')) if (visible(element)) structures.push({ ...describe(element), parent: element.parentElement ? describe(element.parentElement) : undefined });
  if (kind === 'new-row-overlay-menu') for (const root of roots) for (const element of root.querySelectorAll('.row-overlay .iui-btn-menu button')) {
    if (!visible(element) || window.__financePopupBaseline?.has(element) || element.matches(':disabled,[aria-disabled="true"]') || element.closest('form')) continue;
    matches.set(selector(element), { ...describe(element), withinRowOverlay: true, newlyVisibleAfterVerifiedName: true, fixedLabel: 'Actions', semanticEvidence: 'new native row-overlay iui-btn-menu button after verified Name disclosure', count: 1 });
  }
  if (kind === 'new-option') for (const root of roots) {
    const context = window.__financeFundingPopupContext;
    if (!authorizedReport || !window.__financePopupBaseline || context?.path !== location.pathname || context.handle !== reportHandle || !context.control?.isConnected || Date.now() - context.markedAt > 60000) continue;
    const popupSelector = 'ul.content--YGKCO.singleSelectionFilter--FDzUm';
    for (const popup of root.querySelectorAll(popupSelector)) if (visible(popup)) for (const element of popup.querySelectorAll('li > a')) {
      if (!visible(element) || window.__financePopupBaseline.has(element) || element.matches(':disabled,[aria-disabled="true"]') || element.parentElement.matches('[aria-disabled="true"]')) continue;
      const text = element.textContent.trim().replace(/\s+/gu, ' ');
      if (!text || /^(?:All|None|Select All|Deselect All|Clear|Cancel|Apply)$/iu.test(text)) continue;
      window.__financePrivateStrings ||= new Set(); window.__financePrivateStrings.add(text);
      matches.set(selector(element), { ...describe(element), tag: 'A', optionKind: 'custom-single-selection', popupSelector, parentTag: 'LI', optionTextReturned: false, optionValueReturned: false, newlyVisibleAfterVerifiedFilter: true, semanticEvidence: 'all newly visible custom single-selection li > a options inspected on one of two authorized report handles; unique candidate required', count: 1 });
    }
  }
  if (kind === 'readonly-report-apply') {
    if (!authorizedReport) return { kind, candidates: [], structures: [], authorizedReport: false, privateValuesReturned: false };
    for (const root of roots) for (const element of root.querySelectorAll('#reportFormDiv button[class*="searchButton"]')) if (visible(element) && element.textContent.trim() === 'Apply' && !element.matches(':disabled,[aria-disabled="true"]')) matches.set(selector(element), { ...describe(element), withinReportForm: true, fixedLabel: 'Apply', reportHandle, reportPath: location.pathname, readOnlyReportQuery: true, semanticEvidence: 'observed report searchButton under reportFormDiv, exact Apply and authorized path/handle', count: 1 });
  }
  if (kind === 'mark-report-query-baseline' || kind === 'report-query-state') {
    if (!authorizedReport) return { kind, authorizedReport: false, queryCompleted: false, privateValuesReturned: false };
    const tables = roots.flatMap(root => [...root.querySelectorAll('.reportContainer--NoSIx .reportingTable--bRdjL')]).filter(visible);
    const headers = tables.flatMap(table => [...table.querySelectorAll('.headerRowSolo--FHRlr th,.headerRowSolo--FHRlr [role="columnheader"],.headerRowSolo--FHRlr > div')]).filter(element => visible(element) && element.textContent.trim());
    const loaderNodes = tables.flatMap(table => [...table.querySelectorAll('.loader--XmNTN')]); const loaders = loaderNodes.filter(visible);
    const emptyStates = tables.flatMap(table => [...table.querySelectorAll('[role="status"],[role="alert"],.empty-state')]).filter(element => visible(element) && !element.closest('td,[role="cell"],.table-cell,.table-row') && /^(?:No data|No Data|No results|No results found|No records|No records found)$/u.test(element.textContent.trim()));
    if (kind === 'mark-report-query-baseline') { window.__financeReportQueryContext = { path: location.pathname, handle: reportHandle, tables: new WeakSet(tables), headers: new WeakSet(headers), emptyStates: new WeakSet(emptyStates), sawLoading: false, loaderObserved: loaderNodes.length > 0 }; return { baselineMarked: true, reportHandle, existingHeaderCount: headers.length, valuesRead: false }; }
    const context = window.__financeReportQueryContext;
    const validContext = context?.path === location.pathname && context.handle === reportHandle;
    if (validContext && loaders.length) context.sawLoading = true;
    if (validContext && loaderNodes.length) context.loaderObserved = true;
    const resultChanged = Boolean(validContext && (context.sawLoading || tables.some(table => !context.tables.has(table)) || headers.some(header => !context.headers.has(header)) || emptyStates.some(element => !context.emptyStates.has(element))));
    const reportResult = tables.length === 1 && tables[0].querySelector('.headerRowSolo--FHRlr') && context?.loaderObserved ? { tableSelector: '.reportingTable--bRdjL', headerSelector: '.headerRowSolo--FHRlr', loaderSelector: '.loader--XmNTN', structuresVerifiedInCurrentReport: true } : undefined;
    const tableStructure=element=>({selector:selector(element),tag:element.tagName,role:element.getAttribute('role'),classes:[...element.classList].filter(value=>/^[a-zA-Z][a-zA-Z_\d-]{0,90}$/u.test(value)),visible:visible(element),nameTextReturned:false,valueReturned:false});
    return { kind, authorizedReport: true, reportHandle, queryCompleted: Boolean(validContext && resultChanged && reportResult && !loaders.length && (headers.length || emptyStates.length)), loaderVisibleCount: loaders.length, resultTableCount: tables.length, fixedHeaderNodeCount: headers.length, fixedEmptyStateCount: emptyStates.length, resultChanged, sawLoading: Boolean(context?.sawLoading), reportResult, structures: tables.map(tableStructure), headerTextReturned: false, businessRowsRead: false, privateValuesReturned: false };
  }
  if (kind === 'new-edit-form') for (const root of roots) {
    if (!['/secure/finance/app/legal-entities-view.ihtml', '/secure/finance/app/billing-groups-view.ihtml', '/secure/finance/app/list-digital-wallets-flow.ihtml'].includes(location.pathname)) continue;
    for (const element of root.querySelectorAll('form,[role="dialog"],dialog')) {
      if (!visible(element) || window.__financePopupBaseline?.has(element)) continue;
      const editors = [...element.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]),textarea,select,[contenteditable="true"]')].filter(visible);
      if (!editors.length) continue;
      matches.set(selector(element), { ...describe(element), visibleEditorCount: editors.length, newlyVisibleAfterVerifiedEdit: true, editorValuesReturned: false, semanticEvidence: 'new visible form/dialog with native edit fields after verified non-submit Edit; fields unchanged', count: 1 });
    }
  }
  return { kind, label: label || undefined, candidates: [...matches.values()], headerInspections, structures: structures.slice(0, 65), privateValuesReturned: false };
};
// Pure DOM functions can be passed to frame.evaluate; importing this module never opens a browser or writes a capture file.
export { inspectControls as inspectFinanceControls };
export const financeReadOnlyContracts = Object.freeze({
  reportHandles: Object.freeze({ 'upcoming-partner-payments': 'adv_upcoming_payouts', 'cash-flow-history': 'adv_cash_flow_recon' }),
  customAccountPopupSelector: 'ul.content--YGKCO.singleSelectionFilter--FDzUm',
  fixedEnumFilters: Object.freeze(['Type', 'Funding Status ·', 'Invoice Status']),
  privateFilters: Object.freeze(['Partner', 'Program', 'User Initiated', 'Funding Account:']),
  inspectionKinds: Object.freeze(['label-control', 'mark-popup-baseline', 'popup-structure', 'new-option', 'readonly-report-apply', 'mark-report-query-baseline', 'report-query-state', 'entity-name', 'new-row-overlay-menu', 'new-static-edit', 'new-edit-form'])
});
async function frameLocation(frame) {
  const parts = []; let current = frame;
  while (current.parentFrame()) { const parent = current.parentFrame(); const handle = await current.frameElement(); const selector = await handle.evaluate(element => element.id && !/\d/u.test(element.id) ? `iframe#${CSS.escape(element.id)}` : element.getAttribute('name') && !/\d/u.test(element.getAttribute('name')) ? `iframe[name=${JSON.stringify(element.getAttribute('name'))}]` : 'iframe'); parts.unshift({ selector, parentPath: safeURL(parent.url()), framePath: safeURL(current.url()) }); current = parent; }
  return parts;
}
export async function runDeepCapture({ context, page, root, routes, translation, ai, aiEnabled, onProgress = () => {}, onlyPageIds, options = {} }) {
  const {performEntityActionsMenu,collectEntityActionsCandidates,entityDocumentFramePath} = await import(`${pathToFileURL(path.join(root, 'scripts/finance-menu-checks.mjs')).href}?revision=${Date.now()}`);
  const checkpoint = name => console.log(`FINANCE_DEEP_PRELUDE ${name}`);
  let file, captureFunction, originalTranslation, originalAI, setAI, sanitizeFinanceCaptureDocument;
  try {
    checkpoint('entry'); const dependencies = await import(`${pathToFileURL(path.join(root, 'scripts/finance-extra-capture.mjs')).href}?revision=${Date.now()}`); checkpoint('fresh-extra-dependency-imported');
    sanitizeFinanceCaptureDocument = dependencies.sanitizeFinanceCaptureDocument;
    file = path.join(root, 'docs/finance-dom-scan.json'); checkpoint('root-capture-file-resolved'); captureFunction = dependencies.browserCapture(root); checkpoint('browser-collector-compiled');
    originalTranslation = await page.locator('#impact-cn-assistant').getAttribute('data-enabled').then(value => value !== 'false').catch(() => true); originalAI = await page.locator('#impact-cn-assistant').getAttribute('data-ai-enabled').then(value => value !== 'false').catch(() => true); checkpoint('original-toggle-booleans-read'); setAI = ai || aiEnabled;
    if (!setAI) throw new Error('Explicit AI-helper switch function is required for safe deep discovery');
    await setAI(false); checkpoint('ai-helper-disabled'); await page.waitForFunction(() => document.querySelector('#impact-cn-assistant')?.dataset.aiEnabled === 'false'); checkpoint('ai-disabled-dom-confirmed');
    JSON.parse(readFileSync(file, 'utf8')); checkpoint('sanitized-capture-document-parsed');
  } catch (error) {
    if (error.name === 'SyntaxError') { const message = String(error.message).replace(/[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}/gu, '<email>').replace(/\b\d{4,}\b/gu, '<number>').slice(0, 350); const locations = String(error.stack || '').split('\n').filter(line => /finance-(?:deep|extra|session).*\.(?:mjs|js):\d+:\d+/u.test(line)).map(line => line.match(/(?:file:\/\/)?[^\s()]*finance-(?:deep|extra|session)[^\s()]*\.(?:mjs|js):\d+:\d+/u)?.[0]).filter(Boolean); console.log(`FINANCE_DEEP_SAFE_SYNTAX ${JSON.stringify({ message, locations, privatePageTextRead: false })}`); }
    if (setAI && originalAI !== undefined) await setAI(originalAI).catch(() => {});
    throw error;
  }
  let document = JSON.parse(readFileSync(file, 'utf8')); const save = () => { document = sanitizeFinanceCaptureDocument(document); document.updatedAt = new Date().toISOString(); writeFileSync(file, JSON.stringify(document, null, 2)); };
  const note = (route, result, extra = {}) => { const record = document.pages.find(record => record.id === route.id); record.deepCaptureNotes ||= []; record.deepCaptureNotes.push({ result, ...extra }); save(); console.log(`FINANCE_DEEP_NOTE ${route.id}: ${result}`); };
  const goto = async route => {
    await page.goto(new URL(route.href, 'https://demo.impact.com').href, { waitUntil: 'domcontentloaded', timeout: 60000 }); await page.locator('#impact-cn-assistant').waitFor({ state: 'attached', timeout: 30000 }); await translation(false); await setAI(false);
    const record = document.pages.find(item => item.id === route.id); const frames = record?.captures?.[0]?.frames || []; const bodyFrame = frames.find(item => item.framePath?.length) || frames.find(item => !item.framePath?.length); const heading = record?.candidates.find(item => item.frameURL === bodyFrame?.frameURL && (/^H[1-4]$/u.test(item.tag) || /reportTitle/iu.test(item.selector)));
    if (bodyFrame) {
      let actualFrame; const deadline = Date.now() + 30000;
      while (Date.now() < deadline) { actualFrame = page.frames().find(frame => safeURL(frame.url()) === bodyFrame.frameURL); if (actualFrame) break; await page.waitForTimeout(100); }
      if (!actualFrame) throw new Error('Previously observed finance body frame did not render');
      await actualFrame.waitForLoadState('domcontentloaded', { timeout: 15000 });
      if (heading) { const target = actualFrame.locator([...(heading.shadowPath || []), heading.selector].join(' ')); await target.waitFor({ state: 'visible', timeout: 25000 }); await target.filter({ hasText: heading.source }).waitFor({ state: 'visible', timeout: 25000 }); }
      console.log(`FINANCE_DEEP_BODY_READY ${route.id} frame=${bodyFrame.frameURL} headingVerified=${Boolean(heading)}`);
    }
    await page.waitForLoadState('networkidle', { timeout: 7000 }).catch(() => {}); await page.waitForTimeout(350);
    const native = page.locator('#ask-impact-shadow-host'); for (const label of ['Close Ask Impact', 'Close', 'Minimize']) { const close = native.getByRole('button', { name: label, exact: true }).filter({ visible: true }); if (await close.count() === 1) { await close.click().catch(() => {}); break; } }
  };
  const capture = async (route, state, actions = [], privateDropdown = false, enumFilterLabel) => {
    const topPath = new URL(page.url()).pathname; const result = { state, capturedAt: new Date().toISOString(), topPath, topQuery: staticQuery(page.url()), frames: [], candidates: [], affordances: [] }; const record = document.pages.find(record => record.id === route.id); const baselineSources = new Set(record.candidates.map(candidate => candidate.source)); const staticDropdownUI = new Set(['Search', 'Select All', 'Deselect All', 'Clear', 'Clear All', 'Apply', 'Cancel', 'Done', 'Close', 'All', 'None', 'No results', 'No results found', 'No Data', 'All Partners', 'All Programs', 'All Users']);
    for (const frame of page.frames()) { if (!frame.url().startsWith('https://demo.impact.com/')) continue;
      try { const location = await frameLocation(frame); const found = await frame.evaluate(captureFunction, { route, framePath: location, frameURL: safeURL(frame.url()), knownRoutes: routes, enumFilterLabel });
        for (const candidate of found.texts) if (!privateDropdown || baselineSources.has(candidate.text) || staticDropdownUI.has(candidate.text) || /^Search\b/iu.test(candidate.text)) result.candidates.push({ ...candidate, source: candidate.text, frameQuery: staticQuery(frame.url()), topPath, topPaths: [topPath], topQuery: result.topQuery, observedStates: [state] });
        result.affordances.push(...found.affordances.filter(item => !privateDropdown || baselineSources.has(item.label) || staticDropdownUI.has(item.label))); result.frames.push({ frameURL: safeURL(frame.url()), framePath: location, candidateCount: found.texts.length, topPath, frameQuery: staticQuery(frame.url()) });
      } catch (error) { result.frames.push({ frameURL: safeURL(frame.url()), captureFailed: true, errorType: error.name }); }
    }
    const menuAction=actions.find(action=>action.controlEvidence?.menuPopup);
    if(menuAction){
      const sandbox={};vm.createContext(sandbox);vm.runInContext(readFileSync(path.join(root,'impact-cn-mod/dict.js'),'utf8'),sandbox);
      const menuFrame=matchingFrame(menuAction.controlEvidence.menuControl);if(!menuFrame)throw new Error('Verified entity menu frame became ambiguous before capture');
      result.candidates.push(...await collectEntityActionsCandidates({page,frame:menuFrame,dictionary:sandbox.IMPACT_CN_DICTIONARY,pageId:route.id,framePath:await entityDocumentFramePath(menuFrame)}));
    }
    const key = item => JSON.stringify([item.source, item.selector, item.frameURL, item.topPath, item.shadowPath]); const existing = new Map(record.candidates.map(item => [key(item), item])); const beforeCount = record.candidates.length;
    for (const candidate of result.candidates) if (existing.has(key(candidate))) { const original = existing.get(key(candidate)); original.observedStates = [...new Set([...(original.observedStates || []), state])]; } else record.candidates.push(candidate);
    const reportResultState = actions.find(action => action.type === 'read-report-query')?.controlEvidence?.resultState;
    record.texts = record.candidates; record.captures.push({ state, capturedAt: result.capturedAt, topPath, topQuery: result.topQuery, frames: result.frames, candidateCount: result.candidates.length, affordances: result.affordances, ...(reportResultState ? { resultState: reportResultState } : {}) }); record.safeActions ||= []; for (const action of actions) record.safeActions.push({ ...action, capturedState: state, safeReadOnly: true, formSubmitted: false, financialOperations: 0, savedSettings: 0, resultingTopPath: topPath, resultingTopQuery: result.topQuery }); save(); const newCandidateCount = document.pages.find(item => item.id === route.id).candidates.length - beforeCount; console.log(`FINANCE_DEEP_CAPTURE ${route.id} state=${state} candidates=${result.candidates.length} newCandidates=${newCandidateCount}`); return { candidateCount: result.candidates.length, newCandidateCount };
  };
  const inspect = async (route, kind, label, nameColumn = 0) => {
    const evidence = []; const headerInspections = []; const structures = []; for (const frame of page.frames()) { if (!frame.url().startsWith('https://demo.impact.com/secure/')) continue; const found = await frame.evaluate(inspectControls, { kind, label, nameColumn, rememberPrivate: kind === 'entity-name' }); headerInspections.push(...(found.headerInspections || []).map(item => ({ ...item, frameURL: safeURL(frame.url()) }))); structures.push(...(found.structures || []).map(item => ({ ...item, frameURL: safeURL(frame.url()), frameQuery: staticQuery(frame.url()) }))); for (const candidate of found.candidates || []) evidence.push({ ...candidate, frameURL: safeURL(frame.url()), frameQuery: staticQuery(frame.url()) }); }
    const record = document.pages.find(record => record.id === route.id); record.readOnlyControlInspections ||= []; record.readOnlyControlInspections.push({ kind, label, capturedAt: new Date().toISOString(), controls: evidence, headerInspections, structures, privateValuesReturned: false }); save(); console.log(`FINANCE_DEEP_CONTROL_INSPECT ${route.id} kind=${kind} matches=${evidence.length} structures=${structures.length} selectors=${JSON.stringify(evidence.map(item => ({ selector: item.selector, frameURL: item.frameURL, tag: item.tag, role: item.role, disabled: item.disabled })))}`); evidence.structures = structures; return evidence;
  };
  const matchingFrame = evidence => { const matches = page.frames().filter(frame => safeURL(frame.url()) === evidence.frameURL && JSON.stringify(staticQuery(frame.url())) === JSON.stringify(evidence.frameQuery || {})); return matches.length === 1 ? matches[0] : null; };
  const click = async evidence => {
    const frame = matchingFrame(evidence); if (!frame || evidence.disabled) return false;
    const locator = frame.locator(evidence.selector).filter({ visible: true }); if (await locator.count() !== 1) return false;
    const safe = await locator.evaluate((element, expected) => {
      if (element.matches(':disabled,[aria-disabled="true"]') || element.matches('input:not([type="checkbox"]):not([type="radio"]),textarea,[contenteditable]')) return false;
      if (element.closest('form') && element.tagName === 'BUTTON' && element.type === 'submit' && !expected.readOnlyReportQuery) return false;
      if (expected.readOnlyReportQuery) { const reportPaths = { adv_upcoming_payouts: '/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report', adv_cash_flow_recon: '/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report' }; const current = new URL(location.href); return current.origin === 'https://demo.impact.com' && current.searchParams.get('handle') === expected.reportHandle && reportPaths[expected.reportHandle] === current.pathname && element.matches('#reportFormDiv button[class*="searchButton"]') && element.textContent.trim() === 'Apply'; }
      if (expected.optionKind) return expected.optionKind === 'custom-single-selection' && element.tagName === 'A' && element.parentElement?.tagName === 'LI' && Boolean(element.closest(expected.popupSelector)) && window.__financePopupBaseline && !window.__financePopupBaseline.has(element);
      if (expected.fixedLabel === 'Edit') return element.textContent.trim() === 'Edit';
      if (expected.withinRowOverlay) return Boolean(element.closest('.row-overlay .iui-btn-menu')) && !element.closest('form');
      return true;
    }, evidence);
    if (!safe) return false; await locator.click(); await page.waitForTimeout(350); return true;
  };
  const markPopup = async label => { for (const frame of page.frames()) if (frame.url().startsWith('https://demo.impact.com/secure/')) await frame.evaluate(inspectControls, { kind: 'mark-popup-baseline', label }); };
  const waitReportResult = async frame => {
    const timeoutMs = Math.max(1000, Math.min(Number(options.reportResultTimeoutMs) || 15000, 30000)); const deadline = Date.now() + timeoutMs; let state;
    while (Date.now() < deadline) {
      let timer;
      try {
        state = await Promise.race([frame.evaluate(inspectControls, { kind: 'report-query-state' }), new Promise(resolve => { timer = setTimeout(() => resolve({ queryCompleted: false, inspectionTimedOut: true, privateValuesReturned: false }), Math.min(5000, Math.max(1, deadline - Date.now()))); })]);
      } catch (error) { return { queryRequested: true, queryCompleted: false, errorType: error.name, privateValuesReturned: false }; }
      finally { clearTimeout(timer); }
      if (state.queryCompleted || state.inspectionTimedOut || !state.authorizedReport) return { ...state, queryRequested: true, waitedMs: timeoutMs - Math.max(0, deadline - Date.now()) };
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    return { ...state, queryRequested: true, queryCompleted: false, resultWaitTimedOut: true, waitedMs: timeoutMs };
  };
  const eligible = id => !onlyPageIds?.length || onlyPageIds.includes(id);
  const transferLabels = (options.transferLabels ?? ['Partner', 'Program', 'Type', 'User Initiated', 'Funding Status ·', 'Invoice Status']).filter(label => ['Partner', 'Program', 'Type', 'User Initiated', 'Funding Status ·', 'Invoice Status'].includes(label));
  const reportIds = (options.reportIds ?? ['upcoming-partner-payments', 'cash-flow-history']).filter(id => eligible(id) && ['upcoming-partner-payments', 'cash-flow-history'].includes(id));
  const entityIds = (options.entityIds ?? ['legal-entities', 'billing-groups', 'funding-accounts']).filter(id => eligible(id) && ['legal-entities', 'billing-groups', 'funding-accounts'].includes(id));
  const safeGoto = async route => { try { await goto(route); return true; } catch (error) { note(route, 'Previously observed finance body/heading did not become ready; no control action performed', { errorType: error.name }); return false; } };
  try {
    const transfer = routes.find(route => route.id === 'transfers');
    for (const label of eligible('transfers') ? transferLabels : []) {
      onProgress(`deep-transfer-${label.replace(/[^a-z]/giu, '').toLowerCase()}`); if (!await safeGoto(transfer)) continue; const controls = await inspect(transfer, 'label-control', label);
      await markPopup(label);
      if (controls.length !== 1 || !await click(controls[0])) { note(transfer, 'Filter control was not uniquely safely clickable', { label }); continue; }
      // The generic collector excludes data options; for partner/program/users only original labels and fixed UI controls survive.
      await capture(transfer, `deep-opened:${label}`, [{ label, type: 'open-filter-menu', action: 'native-control-click', selector: controls[0].selector, clickSelector: controls[0].selector, frameURL: controls[0].frameURL, frameQuery: controls[0].frameQuery, sourceTopPath: new URL(transfer.href, 'https://demo.impact.com').pathname, sourceTopQuery: staticQuery(new URL(transfer.href, 'https://demo.impact.com').href), fromBaselineClick: true, controlEvidence: controls[0] }], /^(?:Partner|Program|User Initiated)$/u.test(label), financeReadOnlyContracts.fixedEnumFilters.includes(label) ? label : undefined);
    }
    for (const id of reportIds) {
      const route = routes.find(route => route.id === id); onProgress(`deep-query-${id}`); if (!await safeGoto(route)) continue; const controls = await inspect(route, 'label-control', 'Funding Account:');
      if (controls.length !== 1) { note(route, 'Funding-account filter was not unique'); continue; }
      const frame = matchingFrame(controls[0]); const expectedHandle = financeReadOnlyContracts.reportHandles[id];
      if (!frame || staticQuery(frame.url()).handle !== expectedHandle) { note(route, 'Funding-account control was outside its authorized report handle; no account selection or query'); continue; }
      await markPopup('Funding Account:');
      if (!await click(controls[0])) { note(route, 'Funding-account filter could not safely open'); continue; }
      await inspect(route, 'popup-structure', 'Funding-account filter structural inspection');
      if (options.inspectionOnly) { note(route, 'Funding-account popup inspected without selecting an account or querying report', { inspectionOnly: true }); continue; }
      const accountOptions = await inspect(route, 'new-option', 'Select an existing funding account');
      if (accountOptions.length !== 1 || !await click(accountOptions[0])) { note(route, 'No unique native funding-account option could be selected; all structural candidates retained without names/values', { nativeAccountOptionCount: accountOptions.length, ambiguousSelectionStopped: accountOptions.length > 1 }); continue; }
      // Existing report Apply is an explicitly authorized read-only query, never a settings or payment submit.
      const applyControls = await inspect(route, 'readonly-report-apply', 'Apply');
      if (applyControls.length === 1) await frame.evaluate(inspectControls, { kind: 'mark-report-query-baseline' });
      if (applyControls.length !== 1 || applyControls[0].reportHandle !== expectedHandle || !await click(applyControls[0])) { note(route, 'No unique Apply under the verified read-only report form/path/handle; no query or settings saved'); continue; }
      onProgress(`waiting-readonly-report-${id}`); const resultState = await waitReportResult(frame);
      if (!resultState.queryCompleted) { note(route, 'Read-only report Apply was requested once, but a completed result was not observed; no successful replay action recorded and no query retry', { queryRequested: true, queryCompleted: false, queryCount: 1, resultState }); continue; }
      await capture(route, 'deep-selected-funding-account-report', [{ label: 'Query report using existing funding account', type: 'read-report-query', action: 'native-control-sequence', sourceTopPath: new URL(route.href, 'https://demo.impact.com').pathname, sourceTopQuery: staticQuery(new URL(route.href, 'https://demo.impact.com').href), steps: [{ selector: controls[0].selector, frameURL: controls[0].frameURL, label: 'Funding Account:' }, { selector: accountOptions[0].selector, frameURL: accountOptions[0].frameURL, optionNameSaved: false, optionValueSaved: false }, { selector: applyControls[0].selector, frameURL: applyControls[0].frameURL, label: 'Apply', readOnlyReportQuery: true }], controlEvidence: { reportApply: applyControls[0], nativeOption: accountOptions[0], reportResult: resultState.reportResult, resultState }, queryCount: 1, queryRequested: true, queryCompleted: true }]);
    }
    for (const id of entityIds) {
      const route = routes.find(route => route.id === id); onProgress(`deep-entity-${id}`); if (!await safeGoto(route)) continue; await inspect(route, 'row-affordances', 'Existing entity row native control structure'); const evidence = await inspect(route, 'entity-name'); await markPopup();
      if (evidence.length !== 1 || !await click(evidence[0])) { note(route, 'Existing Name cell had no unique safe native detail affordance; names/IDs were not persisted'); continue; }
      await page.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => {}); await page.waitForTimeout(500);
      const opened = await inspect(route, 'popup-structure', 'Existing entity disclosure structure'); let edits = await inspect(route, 'new-static-edit', 'Edit');
      const menus = await inspect(route, 'new-row-overlay-menu', 'Actions'); let menuControl;
      const initialAction = { label: 'Open existing entity disclosure', type: 'open-dropdown', action: 'native-control-click', selector: evidence[0].selector, clickSelector: evidence[0].selector, frameURL: evidence[0].frameURL, frameQuery: evidence[0].frameQuery, sourceTopPath: new URL(route.href, 'https://demo.impact.com').pathname, sourceTopQuery: staticQuery(new URL(route.href, 'https://demo.impact.com').href), fromBaselineClick: true, controlEvidence: evidence[0], businessNameSaved: false, businessIdSaved: false };
      const captured = await capture(route, 'deep-existing-entity-disclosure', opened.structures.length || edits.length ? [initialAction] : []);
      if (!captured.newCandidateCount) note(route, 'Name-cell click did not expose new static entity-detail labels; detail-form coverage remains unverified', { popupStructuralNodes: opened.structures.length, staticEditControls: edits.length });
      if (options.inspectionOnly) { note(route, 'Entity disclosure inspected without opening an edit form', { inspectionOnly: true }); continue; }
      const steps = [{ selector: evidence[0].selector, frameURL: evidence[0].frameURL, label: 'Name', verifiedNameColumn: evidence[0].cellIndex, businessNameSaved: false }];
      if (!edits.length) {
        if (menus.length !== 1) { note(route, 'No unique newly visible native row-overlay menu; Edit form not opened', { rowOverlayMenuCount: menus.length }); continue; }
        await markPopup();let menuProof;
        try{const sandbox={};vm.createContext(sandbox);vm.runInContext(readFileSync(path.join(root,'impact-cn-mod/dict.js'),'utf8'),sandbox);menuProof=await performEntityActionsMenu({page,frame:matchingFrame(menus[0]),nameEvidence:evidence[0],selector:menus[0].selector,dictionary:sandbox.IMPACT_CN_DICTIONARY});}
        catch(error){note(route,'Observed native Actions menu did not meet normal hover/click and unique new popup contract; no retry or edit',{errorType:error.name,privateValuesReturned:false,...(error.financeEvidence?{structure:error.financeEvidence}:{})});continue;}
        menuControl = menus[0]; steps.push({ selector: menuControl.selector, frameURL: menuControl.frameURL, label: 'Actions', withinRowOverlay: true });
        edits = await inspect(route, 'new-static-edit', 'Edit');
        await capture(route, 'deep-existing-entity-actions-menu', [{ label: 'Open existing entity Actions menu', type: 'open-dropdown', action: 'native-control-sequence', steps: [...steps], fromBaselineClick: true, sourceTopPath: initialAction.sourceTopPath, sourceTopQuery: initialAction.sourceTopQuery, controlEvidence: { nameCell: evidence[0], menuControl,menuPopup:menuProof.popup,nativeMenuFlow:{nameHoverPerformed:true,buttonHoverPerformed:true,normalClickAttempts:1,events:menuProof.events} }, businessNameSaved: false, businessIdSaved: false }]);
      }
      if (edits.length !== 1) { note(route, 'No newly visible unique native Edit affordance; detail/edit form was not opened'); continue; }
      await markPopup(); if (!await click(edits[0])) { note(route, 'Observed native Edit affordance was not safely clickable'); continue; }
      try {
        await page.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => {}); await page.waitForTimeout(500);
        const form = await inspect(route, 'new-edit-form', 'Existing entity edit-form structure');
        if (form.length !== 1) { note(route, 'Edit did not expose one verified new form/dialog with native edit fields on the observed entity document; form coverage remains unverified', { newEditFormCount: form.length }); continue; }
        steps.push({ selector: edits[0].selector, frameURL: edits[0].frameURL, label: 'Edit', formSubmit: false });
        const editCapture = await capture(route, 'deep-existing-entity-edit-form', [{ label: 'Open existing entity Edit form', type: 'open-form', action: 'native-control-sequence', steps, fromBaselineClick: true, sourceTopPath: initialAction.sourceTopPath, sourceTopQuery: initialAction.sourceTopQuery, controlEvidence: { nameCell: evidence[0], ...(menuControl ? { menuControl } : {}), editControl: edits[0], editForm: form[0], newFormStructuralNodes: form.length, verifiedNewEditorCount: form[0].visibleEditorCount }, businessNameSaved: false, businessIdSaved: false }]);
        note(route, 'Verified new entity Edit form observed without changing or saving fields', { newStaticCandidates: editCapture.newCandidateCount, visibleEditorCount: form[0].visibleEditorCount, submittedForms: 0, settingsSaved: 0 });
      } finally {
        // Navigation to the original observed route closes the unsaved form; never infer a Cancel/Save control.
        await goto(route).catch(error => note(route, 'Unsaved form could not be closed by original-route navigation; no save or submit was attempted', { errorType: error.name }));
      }
    }
    document.deepCaptureCompletedAt = new Date().toISOString(); document.deepCaptureSafety = { accountOptionValuesSaved: false, entityNamesSaved: false, entityIdentifiersSaved: false, financialOperations: 0, settingsSaved: 0, uploads: 0, newAISends: 0, originalAIToggleRestored: true, originalTranslationToggleRestored: true }; save(); console.log(`FINANCE_DEEP_COMPLETE candidates=${document.uniqueCandidates}; same authenticated browser retained`);
  } finally { await translation(originalTranslation).catch(() => {}); await setAI(originalAI).catch(() => {}); }
}

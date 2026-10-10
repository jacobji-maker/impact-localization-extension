/** Additional native finance UI discovery. Never submits or uploads a form. */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const statuses = new Set(['Active', 'Inactive', 'Pending', 'Approved', 'Declined', 'Failed', 'Paid', 'Unpaid', 'Overdue', 'Past Due', 'Cancelled', 'Canceled', 'Processing', 'Completed', 'Draft', 'Enabled', 'Disabled', 'Not Set', 'Default', 'Not Active', 'No Data', 'No data', 'N/A']);
const safeEnums = new Set(['Action', 'Actions', 'Click', 'Clicks', 'Impressions', 'Other', 'Action Payouts', 'Click Payouts', 'Partner Fees', 'Action Fees', 'Click Fees', 'Credit Card', 'ACH', 'Wire', 'Bank Transfer', 'PayPal', 'Reported', 'Locked', 'All', 'None']);
const fixedFilterEnums = {
  Type: new Set(['All', 'None', 'Action', 'Actions', 'Click', 'Clicks', 'Impressions', 'Other', 'Action Payouts', 'Click Payouts', 'Partner Fees', 'Action Fees', 'Click Fees']),
  'Funding Status ·': new Set(['All', 'None', 'Pending', 'Approved', 'Declined', 'Failed', 'Paid', 'Unpaid', 'Overdue', 'Past Due', 'Cancelled', 'Canceled', 'Processing', 'Completed']),
  'Invoice Status': new Set(['All', 'None', 'Reported', 'Locked', 'Pending', 'Approved', 'Declined', 'Paid', 'Unpaid', 'Overdue', 'Past Due', 'Cancelled', 'Canceled', 'Processing', 'Completed', 'Draft'])
};
const privateFilterLabels = /^(?:Partner:?|Program:?|User Initiated|Funding Account:?|Month|Primary Contact)$/iu;
const safePrivateDropdownLabels = new Set(['All', 'None', 'Search', 'Select All', 'Deselect All', 'Clear', 'Clear All', 'Apply', 'Done', 'Cancel', 'Close', 'No results', 'No results found', 'No data', 'All Partners', 'All Programs', 'All Users', 'Select', 'Select an option', 'Search partners', 'Search programs', 'Search users', 'Search funding accounts', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']);
const safeURL = value => { try { const url = new URL(value); return url.origin + url.pathname; } catch { return '[unavailable]'; } };
const staticQuery = value => { const url = new URL(value); return Object.fromEntries([...url.searchParams].filter(([key, item]) => key === 'handle' && /^adv_[a-z_]+$/u.test(item) || key === 'u' && /^\/secure\/finance\/app\/[a-z0-9-]+\.ihtml$/iu.test(item))); };
const dataArea = selector => /(?:\.td\b|\.table-cell\b|\.table-row\b|\.table-body\b|\btd(?::|\s|$)|\[role="cell"\])/u.test(selector || '');
const aiSurface = item => /ask[-_]?impact|chat|messenger/iu.test([item.selector, item.clickSelector, ...(item.shadowPath || [])].join(' '));
const privateSelected = candidate => (/primary-contact-multiselect|payment-method-section.*selector-label/u.test(candidate.selector || '') || candidate.route === 'make-deposit' && candidate.selector === '#selector-label') && !safeEnums.has(candidate.source || candidate.text);
const actionType = label => label === 'Show balance forecast' ? 'open-checkbox' : label === 'Payment Request Form' ? 'open-dropdown' : /^(?:Create|Add|Edit|View|Bulk Upload|Set up|Set Up)/u.test(label) ? 'open-form' : 'open-filter-menu';
function sanitize(document) {
  const privateTokens = new Set();
  for (const page of document.pages) for (const candidate of page.candidates || page.texts || []) if (privateSelected(candidate) && (candidate.source || candidate.text).length > 3) privateTokens.add(candidate.source || candidate.text);
  const containsPrivate = value => [...privateTokens].some(token => String(value || '').includes(token));
  let removedCandidates = 0, removedAffordances = 0, normalizedCounts = 0, normalizedTopContexts = 0;
  for (const page of document.pages) {
    const clean = [];
    for (const candidate of page.candidates || page.texts || []) {
      let source = candidate.source || candidate.text;
      const verifiedFilterEnum = fixedFilterEnums[candidate.fixedEnumFilter]?.has(source) && candidate.enumEvidence === 'new visible native option after verified fixed-label filter click';
      if (candidate.fixedEnumFilter && !verifiedFilterEnum) { removedCandidates++; continue; }
      if (/wire-details-label.*p\.instruction:nth-of-type\(2\)/u.test(candidate.selector || '') || aiSurface(candidate) || privateSelected(candidate) || containsPrivate(source) || dataArea(candidate.selector) && !statuses.has(source) && !safeEnums.has(source) && candidate.match !== 'suffix' && !verifiedFilterEnum) { removedCandidates++; continue; }
      if (/^Displaying:/u.test(source) && /paginationInfo/iu.test(candidate.selector)) { source = 'Displaying: {start} - {end} of {total}'; Object.assign(candidate, { source, text: source, normalizedText: source, match: 'numeric-template', dynamicSlots: ['start', 'end', 'total'], originalSlotValuesSaved: false, dynamicSuffixSaved: false }); delete candidate.dynamicSuffix; normalizedCounts++; }
      const count = source.match(/^([A-Za-z][A-Za-z ]* ·)\s*\d+\s*$/u)?.[1];
      if (count) { Object.assign(candidate, { source: count, text: count, normalizedText: count, match: 'prefix', dynamicSuffix: '<original-count>', dynamicSuffixSaved: false }); normalizedCounts++; }
      clean.push(candidate);
    }
    const unique = new Map();
    for (const candidate of clean) {
      const contextURL = candidate.framePath?.length ? candidate.framePath[0].parentPath : candidate.frameURL;
      if (contextURL && /^https:\/\/demo\.impact\.com\//u.test(contextURL)) {
        const actualURL = new URL(contextURL), actualTopPath = actualURL.pathname;
        const missingTopQuery = candidate.topQuery == null || typeof candidate.topQuery === 'object' && !Array.isArray(candidate.topQuery) && Object.keys(candidate.topQuery).length === 0;
        const validStaticQuery = ['handle', 'u'].every(key => {
          const values = actualURL.searchParams.getAll(key);
          return values.length === 0 || values.length === 1 && (key === 'handle' ? /^adv_[a-z_]+$/u : /^\/secure\/finance\/app\/[a-z0-9-]+\.ihtml$/iu).test(values[0]);
        });
        const observedQuery = validStaticQuery ? staticQuery(actualURL.href) : {};
        if (!candidate.framePath?.length && candidate.topPath === actualTopPath && missingTopQuery && Object.keys(observedQuery).length) {
          candidate.topQuery = observedQuery; normalizedTopContexts++;
        }
        // Parent paths have no query evidence; existing context, including conflicts, stays unchanged.
        candidate.topPath = actualTopPath; candidate.topPaths = [actualTopPath];
      }
      const key = JSON.stringify([candidate.source, candidate.selector, candidate.frameURL, candidate.topPath, candidate.frameQuery || {}, candidate.topQuery || {}, candidate.shadowPath || []]);
      if (unique.has(key)) { const first = unique.get(key); first.observedStates = [...new Set([...(first.observedStates || []), ...(candidate.observedStates || [])])]; } else unique.set(key, candidate);
    }
    page.candidates = [...unique.values()]; page.texts = page.candidates;
    for (const capture of page.captures || []) { const before = capture.affordances?.length || 0; capture.affordances = (capture.affordances || []).filter(item => !aiSurface(item) && !containsPrivate(item.label)).map(item => ({ ...item, label: item.label.replace(/^([A-Za-z][A-Za-z ]* ·)\s*\d+\s*$/u, '$1 <original-count>') })); removedAffordances += before - capture.affordances.length; }
    page.safeActions = (page.safeActions || []).filter(item => !aiSurface(item) && !containsPrivate(item.label) && !/^(?:Save|Pay|Submit|Delete|Remove|Upload)$/iu.test(item.label)).map(item => {
      const state = (page.captures || []).find(capture => capture.state === item.capturedState);
      const sourceURL = new URL(page.href, 'https://demo.impact.com'); const targetFrame = state?.frames?.find(frame => frame.framePath?.length === 0);
      return { ...item, safeReadOnly: true, type: item.type || actionType(item.label), clickSelector: item.clickSelector || item.selector, fromBaselineClick: item.fromBaselineClick ?? true, sourceTopPath: item.sourceTopPath || sourceURL.pathname, sourceTopQuery: item.sourceTopQuery || staticQuery(sourceURL.href), resultingTopPath: item.resultingTopPath || (targetFrame?.frameURL ? new URL(targetFrame.frameURL).pathname : state?.topPath), resultingTopQuery: item.resultingTopQuery || state?.topQuery || {}, capturedNewPath: Boolean((item.resultingTopPath || state?.topPath || (targetFrame?.frameURL && new URL(targetFrame.frameURL).pathname)) && (item.resultingTopPath || state?.topPath || new URL(targetFrame.frameURL).pathname) !== sourceURL.pathname), controlEvidence: item.controlEvidence || { source: 'observed-native-disclosure', originalCapture: true, noSubmit: true } };
    });
    page.links = (page.links || []).filter(item => !aiSurface(item) && !containsPrivate(item.label));
    for (const candidate of page.candidates) if (/notification/iu.test(candidate.selector || '')) candidate.kind = 'notification-label';
    page.initialCaptureLimitation = page.id === 'subscription' ? 'Only the actual subscription-unavailable state was rendered; subscription details cannot be claimed verified.' : page.initialCaptureLimitation;
    if (!page.initialCaptureLimitation) delete page.initialCaptureLimitation;
  }
  document.privateValuesSaved = false; document.tableBusinessRowsSaved = false;
  document.sanitization = { performedAt: new Date().toISOString(), removedCandidates, removedAffordances, normalizedCountPrefixes: normalizedCounts, normalizedTopContexts, removedValuesRecorded: false, rule: 'Custom method/contact names and business div-table values removed; fixed statuses/fee enums and allowlisted native Type/Funding Status/Invoice Status options retained only with verified filter evidence. User Initiated never grants an enum exception. Pagination records only its numeric slot template; other counts retain fixed prefixes. Missing same-document top query is restored only from its observed URL; existing and child-frame query contexts are preserved.' };
  return { privateTokens, containsPrivate };
}
export function sanitizeFinanceCaptureDocument(document) {
  const cleaned = structuredClone(document); sanitize(cleaned); cleaned.uniqueCandidates = cleaned.pages.reduce((sum, page) => sum + page.candidates.length, 0); return cleaned;
}
export function sanitizeFinanceCaptureFile(root) {
  const file = path.join(root, 'docs/finance-dom-scan.json'); const document = JSON.parse(readFileSync(file, 'utf8')); sanitize(document); document.uniqueCandidates = document.pages.reduce((sum, page) => sum + page.candidates.length, 0); document.updatedAt = new Date().toISOString(); writeFileSync(file, JSON.stringify(document, null, 2)); return { pageCount: document.pages.length, candidateCount: document.uniqueCandidates, sanitization: document.sanitization };
}
export function browserCapture(root) {
  // Reuse only this project's pure DOM collector, not the executable session lifecycle.
  const source = readFileSync(path.join(root, 'scripts/finance-session.mjs'), 'utf8'); const begin = source.indexOf('const captureFunction = '); const end = source.indexOf('\nasync function collect(', begin);
  if (begin < 0 || end < 0) throw new Error('Project collector definition unavailable');
  const expression = source.slice(begin + 'const captureFunction = '.length, end).trim().replace(/;$/u, '');
  const baseline = JSON.parse(readFileSync(path.join(root, 'docs/finance-dom-scan.json'), 'utf8'));
  const observedFixedHeadings = (baseline.pages || []).flatMap(page => (page.candidates || []).filter(candidate => /^H[1-6]$/u.test(candidate.tag || '') && typeof (candidate.source || candidate.text) === 'string' && typeof candidate.frameURL === 'string').map(candidate => ({ route: page.id, frameURL: candidate.frameURL, source: (candidate.source || candidate.text).trim().replace(/\s+/gu, ' ') })));
  // Embed only fixed baseline records in the function source: Playwright serializes
  // the function, so a Node closure would not survive frame.evaluate().
  return Function(`return function captureObservedFinance(args) { return (${expression})({ ...args, observedFixedHeadings: ${JSON.stringify(observedFixedHeadings)} }); };`)();
}
async function frameLocation(frame) {
  const parts = []; let current = frame;
  while (current.parentFrame()) { const parent = current.parentFrame(); const element = await current.frameElement(); const selector = await element.evaluate(node => { if (node.id && !/\d{4}|[a-f0-9]{12}/iu.test(node.id)) return `iframe#${CSS.escape(node.id)}`; const name = node.getAttribute('name'); if (name && !/\d{4}|[a-f0-9]{12}/iu.test(name)) return `iframe[name=${JSON.stringify(name)}]`; const pieces = []; let element = node; while (element?.parentElement && pieces.length < 5) { const tag = element.tagName.toLowerCase(); const index = [...element.parentElement.children].filter(sibling => sibling.tagName === element.tagName).indexOf(element) + 1; pieces.unshift(`${tag}:nth-of-type(${index})`); if (element.parentElement.id) { pieces.unshift(`#${CSS.escape(element.parentElement.id)}`); break; } element = element.parentElement; } return pieces.join(' > '); }); parts.unshift({ selector, parentPath: safeURL(parent.url()), framePath: safeURL(current.url()) }); current = parent; }
  return parts;
}
const plans = {
  overview: ['Show balance forecast', 'Payment Request Form'],
  'make-deposit': ['View', 'ACH', 'Wire', 'Credit Card'],
  transfers: ['Partner', 'Program', 'Type', 'User Initiated', 'Funding Status ·', 'Invoice Status', 'Create Transfer', 'Bulk Upload Transfers'],
  'monthly-close': ['Show:'],
  'upcoming-partner-payments': ['Prediction Range:', 'Funding Account:', 'Partner:'],
  'cash-flow-history': ['Funding Account:'],
  'partner-payments-invoices': ['Month'], 'impact-com-invoices': ['Month'],
  general: ['Revenue Recognition Method', 'Edit'],
  'legal-entities': ['Create Legal Entity', 'Add Legal Entity', 'Create', 'Add', 'Edit'],
  'billing-groups': ['Create Billing Group', 'Add Billing Group', 'Create', 'Add', 'Edit'],
  'funding-accounts': ['Add Funding Account', 'Create Funding Account', 'Create', 'Add', 'Edit'],
  'payment-methods': ['Add Payment Method'],
  'automatic-payments': ['Set up automatic payments', 'Set Up Automatic Payments', 'Create Automatic Payment', 'Add Automatic Payment', 'Edit']
};
/** The observed card form loads after its route and navigation shell. No field values are read. */
export function inspectAddPaymentMethodReadiness() {
  const expectedPath = '/secure/advertiser/finance/fr/payment-method/new/ui.ihtml';
  const expectedPathMatched = location.origin === 'https://demo.impact.com' && location.pathname === expectedPath;
  const cardFields = { cardholderName: 'Cardholder Name', number: 'Card Number', expirationDate: 'Expiration Date (MM/YY)', cvv: 'CVV (3 digits)' };
  const evidence = { expectedPathMatched, headingCount: 0, fixedHeadingCount: 0, nativeFieldCount: 0, hostedFieldFrameCount: 0, creditCardHeadingCount: 0, cardFrameCounts: Object.fromEntries(Object.keys(cardFields).map(key => [key, 0])), cardLabelCounts: Object.fromEntries(Object.keys(cardFields).map(key => [key, 0])), creditCardStructureReady: false, fieldValuesRead: false, frameDocumentsRead: false, ready: false };
  if (!expectedPathMatched) return evidence;
  const visible = element => {
    if (!element?.isConnected || !element.getClientRects().length || getComputedStyle(element).visibility !== 'visible') return false;
    for (let current = element; current; current = current.parentElement) {
      const style = getComputedStyle(current);
      if (current.hidden || current.inert || current.getAttribute('aria-hidden') === 'true' || style.display === 'none' || Number(style.opacity) === 0) return false;
    }
    return true;
  };
  const headings = [...document.querySelectorAll('h1.title')].filter(visible);
  evidence.headingCount = headings.length;
  evidence.fixedHeadingCount = headings.filter(element => element.textContent.trim().replace(/\s+/gu, ' ') === 'Add Payment Method').length;
  const inBody = element => !element.closest('#adv-navigation,nav,aside,#header,.global-header,#impact-cn-assistant,#ask-impact-shadow-host');
  evidence.nativeFieldCount = [...document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="checkbox"]):not([type="radio"]),select,textarea')].filter(element => inBody(element) && visible(element)).length;
  evidence.hostedFieldFrameCount = [...document.querySelectorAll('iframe[id^="braintree-hosted-field-"]')].filter(element => inBody(element) && visible(element)).length;
  const normalize = text => text.trim().replace(/\s+/gu, ' ');
  evidence.creditCardHeadingCount = [...document.querySelectorAll('h2.title')].filter(element => inBody(element) && visible(element) && normalize(element.textContent) === 'Credit Card Details').length;
  if (evidence.creditCardHeadingCount) {
    const labels = [...document.querySelectorAll('label')].filter(element => inBody(element) && visible(element));
    for (const [key, fixedLabel] of Object.entries(cardFields)) {
      evidence.cardFrameCounts[key] = [...document.querySelectorAll(`iframe[id="braintree-hosted-field-${key}"]`)].filter(element => inBody(element) && visible(element)).length;
      evidence.cardLabelCounts[key] = labels.filter(element => normalize(element.textContent) === fixedLabel).length;
    }
    evidence.creditCardStructureReady = evidence.creditCardHeadingCount === 1 && Object.keys(cardFields).every(key => evidence.cardFrameCounts[key] === 1 && evidence.cardLabelCounts[key] === 1);
  }
  evidence.ready = document.readyState !== 'loading' && evidence.headingCount === 1 && evidence.fixedHeadingCount === 1 && evidence.nativeFieldCount + evidence.hostedFieldFrameCount > 0 && (!evidence.creditCardHeadingCount || evidence.creditCardStructureReady);
  return evidence;
}

export async function waitForAddPaymentMethodReadiness(page, { timeoutMs = 30000 } = {}) {
  const deadline = Date.now() + timeoutMs;
  let evidence;
  while (Date.now() < deadline) {
    try {
      evidence = await page.evaluate(inspectAddPaymentMethodReadiness);
      if (evidence.ready) return evidence;
    } catch (error) {
      if (!/Execution context was destroyed|Cannot find context with specified id|Frame was detached/iu.test(error.message || '')) throw error;
    }
    await page.waitForTimeout(Math.min(100, Math.max(1, deadline - Date.now())));
  }
  const error = new Error('Add Payment Method did not render its exact route, unique fixed heading and native field structure including observed credit-card hydration within the bounded wait');
  error.safeFinanceAssertion = true;
  error.financeEvidence = evidence || { expectedPathMatched: false, fieldValuesRead: false, ready: false };
  throw error;
}
export function validateCurrentPaymentMethodFormRequest(onlyPageIds, currentURL) {
  if (!Array.isArray(onlyPageIds) || onlyPageIds.length !== 1 || onlyPageIds[0] !== 'payment-methods') throw new Error('Current payment form capture requires onlyPageIds exactly [payment-methods]');
  let current;
  try { current = new URL(currentURL); } catch { throw new Error('Current payment form capture requires the exact authorized demo document'); }
  if (current.origin !== 'https://demo.impact.com' || current.pathname !== '/secure/advertiser/finance/fr/payment-method/new/ui.ihtml') throw new Error('Current payment form capture requires the exact authorized demo document');
  return true;
}
/** Structure-only diagnostics do not grant any capture exception. */
export function inspectCurrentPaymentMethodDescriptionStructure() {
  const source = 'Draw from your credit card account. A handling charge will be charged per $100 (or part thereof) deposited.';
  const topDocument = window === window.top;
  const expectedPathMatched = location.origin === 'https://demo.impact.com' && location.pathname === '/secure/advertiser/finance/fr/payment-method/new/ui.ihtml';
  const evidence = { mode: 'CURRENT_PAYMENT_METHOD_DESCRIPTION_STRUCTURE_ONLY', topDocument, expectedPathMatched, descriptionElementCount: 0, descriptionStructures: [], fixedSourceTextMatchCount: 0, fixedSourceStructures: [], fixedSourceNormalizedTextMatchCount: 0, fixedSourceNormalizedStructures: [], textReturned: false, fieldValuesRead: false, frameDocumentsRead: false };
  if (!topDocument || !expectedPathMatched) return evidence;
  const visible = element => {
    if (!element?.isConnected || !element.getClientRects().length || getComputedStyle(element).visibility !== 'visible') return false;
    for (let current = element; current; current = current.parentElement) {
      const style = getComputedStyle(current);
      if (current.hidden || current.inert || current.getAttribute('aria-hidden') === 'true' || style.display === 'none' || Number(style.opacity) === 0) return false;
    }
    return true;
  };
  const structuralSelector = element => {
    if (element.id === 'selector-description') return '#selector-description';
    const parts = [];
    for (let current = element; current; current = current.parentElement) {
      const siblings = current.parentElement ? [...current.parentElement.children].filter(sibling => sibling.tagName === current.tagName) : [current];
      parts.unshift(current.tagName.toLowerCase() + ':nth-of-type(' + (siblings.indexOf(current) + 1) + ')');
    }
    return parts.join(' > ');
  };
  const normalize = text => text.trim().replace(/\s+/gu, ' ');
  const describe = element => {
    const direct = [...element.childNodes].filter(node => node.nodeType === Node.TEXT_NODE);
    return { tag: element.tagName, selector: structuralSelector(element), childElementCount: element.childElementCount, directTextNodeCount: direct.length, elementTextEqualsFixedSource: element.textContent.trim() === source, elementTextNormalizedEqualsFixedSource: normalize(element.textContent) === source, directTextMatchesFixedSourceCount: direct.filter(node => node.nodeValue.trim() === source).length, directTextNormalizedMatchCount: direct.filter(node => normalize(node.nodeValue) === source).length, topDocument, lightDOM: element.getRootNode() === document, visible: visible(element) };
  };
  const descriptions = [...document.querySelectorAll('#selector-description')];
  evidence.descriptionElementCount = descriptions.length;
  evidence.descriptionStructures = descriptions.slice(0, 20).map(describe);
  const excluded = '#adv-navigation,nav,aside,#header,.global-header,#impact-cn-assistant,#ask-impact-shadow-host,[id^="ask-impact-"],[id*="impact-cn"],[class*="impact-cn"],input,textarea,select,option,[contenteditable],iframe,script,style,noscript,svg,canvas,td,tbody,[role="cell"],.table-cell,.table-row,.table-body,.td,.account-name,.account-btn,.profileBtn,.funding-amount,.amount,.balance,.field-value,.fieldValue,.display-value,.value,[class*="accountName"],[class*="userName"],[class*="address"],[class*="Address"],[class*="legal-name"],[class*="business-name"]';
  const walker = document.createTreeWalker(document, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const element = node.parentElement;
    if (!element || element.getRootNode() !== document || element.closest(excluded) || !visible(element)) continue;
    const rawMatches = node.nodeValue.trim() === source, normalizedMatches = normalize(node.nodeValue) === source;
    if (!rawMatches && !normalizedMatches) continue;
    const structure = describe(element);
    if (rawMatches) { evidence.fixedSourceTextMatchCount++; if (evidence.fixedSourceStructures.length < 20) evidence.fixedSourceStructures.push(structure); }
    if (normalizedMatches) { evidence.fixedSourceNormalizedTextMatchCount++; if (evidence.fixedSourceNormalizedStructures.length < 20) evidence.fixedSourceNormalizedStructures.push(structure); }
  }
  return evidence;
}
export async function runExtraCapture({ context, page, root, routes, translation, ai, aiEnabled, onProgress = () => {}, onlyPageIds, options = {} }) {
  const currentFormOnly = options.currentPaymentMethodFormOnly === true;
  if (currentFormOnly) {
    validateCurrentPaymentMethodFormRequest(onlyPageIds, page.url());
    if (routes.filter(route => route.id === 'payment-methods').length !== 1) throw new Error('Current payment form capture requires one observed payment-methods route');
  }
  const originalTranslation = await page.locator('#impact-cn-assistant').getAttribute('data-enabled').then(value => value !== 'false').catch(() => true); const originalAI = await page.locator('#impact-cn-assistant').getAttribute('data-ai-enabled').then(value => value !== 'false').catch(() => true); const setAI = ai || aiEnabled; if (!setAI) throw new Error('Explicit AI helper switch is required for native finance discovery');
  try {
  await setAI(false); await page.waitForFunction(() => document.querySelector('#impact-cn-assistant')?.dataset.aiEnabled === 'false');
  const file = path.join(root, 'docs/finance-dom-scan.json'); const document = JSON.parse(readFileSync(file, 'utf8')); const captureFunction = browserCapture(root); const { containsPrivate } = sanitize(document);
  const { inspectFinanceControls } = await import(`${pathToFileURL(path.join(root, 'scripts/finance-deep-capture.mjs')).href}?revision=${Date.now()}`);
  const save = () => { document.updatedAt = new Date().toISOString(); document.uniqueCandidates = document.pages.reduce((sum, page) => sum + page.candidates.length, 0); writeFileSync(file, JSON.stringify(document, null, 2)); };
  save(); console.log(`FINANCE_EXTRA_SANITIZED candidateCount=${document.uniqueCandidates}; no removed values returned`);
  const selected = routes.filter(route => !onlyPageIds?.length || onlyPageIds.includes(route.id));
  const goto = async route => { await page.goto(new URL(route.href, 'https://demo.impact.com').href, { waitUntil: 'domcontentloaded', timeout: 60000 }); await page.locator('#impact-cn-assistant').waitFor({ state: 'attached', timeout: 30000 }); await translation(false); await page.waitForLoadState('networkidle', { timeout: 7000 }).catch(() => {}); await page.waitForTimeout(500); };
  const capture = async (route, state, action, privateDropdown = false) => {
    const record = document.pages.find(item => item.id === route.id); const beforeSources = new Set(record.candidates.map(item => item.source)); const result = { state, capturedAt: new Date().toISOString(), topPath: new URL(page.url()).pathname, topQuery: staticQuery(page.url()), frames: [], candidates: [], affordances: [] };
    for (const frame of page.frames()) {
      let url; try { url = new URL(frame.url()); } catch { continue; } if (url.origin !== 'https://demo.impact.com') continue;
      try { const location = await frameLocation(frame); const found = await frame.evaluate(captureFunction, { route, framePath: location, frameURL: safeURL(frame.url()), knownRoutes: routes, enumFilterLabel: action && Object.hasOwn(fixedFilterEnums, action.label) ? action.label : undefined });
        for (const candidate of found.texts) {
          Object.assign(candidate, { source: candidate.text, topPath: result.topPath, topPaths: [result.topPath], topQuery: result.topQuery, frameQuery: staticQuery(frame.url()), observedStates: [state] });
          if (containsPrivate(candidate.source)) continue;
          if (privateDropdown && !beforeSources.has(candidate.source) && !safePrivateDropdownLabels.has(candidate.source) && !/^Search\b/iu.test(candidate.source)) continue;
          result.candidates.push(candidate);
        }
        result.affordances.push(...found.affordances.filter(item => !containsPrivate(item.label) && (!privateDropdown || beforeSources.has(item.label) || safePrivateDropdownLabels.has(item.label))));
        result.frames.push({ frameURL: safeURL(frame.url()), framePath: location, frameQuery: staticQuery(frame.url()), topPath: result.topPath, openShadowRoots: found.openShadowRoots, candidateCount: found.texts.length });
        record.links = [...new Map([...record.links, ...found.links.filter(item => !containsPrivate(item.label))].map(item => [JSON.stringify(item), item])).values()];
      } catch (error) { result.frames.push({ frameURL: safeURL(frame.url()), captureFailed: true, errorType: error.name }); }
    }
    const key = item => JSON.stringify([item.source, item.selector, item.frameURL, item.topPath, item.shadowPath]); const existing = new Map(record.candidates.map(item => [key(item), item]));
    for (const item of result.candidates) if (existing.has(key(item))) { const old = existing.get(key(item)); old.observedStates ||= []; if (!old.observedStates.includes(state)) old.observedStates.push(state); old.topPaths = [...new Set([...(old.topPaths || [old.topPath]), result.topPath])]; } else { record.candidates.push(item); existing.set(key(item), item); }
    record.captures.push({ state, capturedAt: result.capturedAt, topPath: result.topPath, topQuery: result.topQuery, frames: result.frames, candidateCount: result.candidates.length, affordances: result.affordances }); record.texts = record.candidates;
    if (action) { record.safeActions ||= []; record.safeActions.push({ ...action, capturedState: state, resultingTopPath: result.topPath, resultingTopQuery: result.topQuery, formSubmitted: false, uploadedFiles: 0, financialOperations: 0, privateDropdownOptionsSaved: false }); }
    sanitize(document); save(); console.log(`FINANCE_EXTRA_CAPTURE ${route.id} state=${state} candidates=${result.candidates.length} total=${record.candidates.length} topPath=${result.topPath}`); return result;
  };
  const find = async (route, label) => {
    const record = document.pages.find(item => item.id === route.id); const observations = record.candidates.filter(item => (item.source === label || label === 'Funding Status ·' && item.source.startsWith(label)) && !item.shadowPath?.some(value => /adv-navigation/u.test(value)));
    if (label === 'Revenue Recognition Method') observations.unshift({ frameURL: 'https://demo.impact.com/secure/finance/app/customer-settings-general-view.ihtml', selector: '#monthly-closing-report button', source: 'Revenue Recognition Method', shadowPath: [] });
    for (const observation of observations) {
      const frame = page.frames().find(frame => safeURL(frame.url()) === observation.frameURL); if (!frame) continue; const selector = [...(observation.shadowPath || []), observation.selector].join(' '); let locator = frame.locator(selector).filter({ visible: true });
      if (await locator.count() > 1) locator = locator.filter({ hasText: label === 'Funding Status ·' ? /Funding Status/ : new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')}$`, 'u') });
      if (await locator.count() === 1) return { frame, locator, selector, frameURL: observation.frameURL, label, origin: 'captured-text-selector' };
    }
    for (const frame of page.frames()) {
      if (!frame.url().startsWith('https://demo.impact.com/secure/')) continue;
      const controls = frame.getByRole('button', { name: label, exact: true }).filter({ visible: true }); if (await controls.count() === 1) { const selector = await controls.evaluate(element => element.id ? `#${CSS.escape(element.id)}` : element.getAttribute('data-testid') ? `button[data-testid=${JSON.stringify(element.getAttribute('data-testid'))}]` : 'button'); return { frame, locator: controls, selector, frameURL: safeURL(frame.url()), label, origin: 'native-accessible-button' }; }
    }
    return null;
  };
  if (currentFormOnly) {
    const route = selected[0], record = document.pages.find(item => item.id === route.id);
    if (!record) throw new Error('Current payment form has no existing finance capture record');
    onProgress('extra-capture-payment-methods-current-form-only');
    await translation(false);
    const readiness = await waitForAddPaymentMethodReadiness(page);
    validateCurrentPaymentMethodFormRequest(onlyPageIds, page.url());
    const descriptionStructure = await page.evaluate(inspectCurrentPaymentMethodDescriptionStructure);
    const result = await capture(route, 'opened:Add Payment Method');
    const safety = { navigations: 0, controlClicks: 0, financialOperations: 0, submittedForms: 0, savedSettings: 0, deletedRecords: 0, uploads: 0, screenshotsSaved: 0, privateDropdownBusinessOptionsSaved: false };
    Object.assign(record.captures.at(-1), { currentFormOnly: true, readiness, controlEvidence: { descriptionStructure }, captureSafety: safety });
    document.extraCaptureCompletedAt = new Date().toISOString(); document.extraCaptureSafety = safety; save();
    console.log(`FINANCE_EXTRA_CURRENT_FORM_COMPLETE candidates=${result.candidates.length}; navigations=0; controlClicks=0; submittedForms=0`);
    console.log(`FINANCE_EXTRA_CURRENT_FORM_STRUCTURE ${JSON.stringify(descriptionStructure)}`);
    return { mode: 'CURRENT_PAYMENT_METHOD_FORM_CAPTURE', pageId: route.id, candidateCount: result.candidates.length, topPath: result.topPath, readiness, descriptionStructure, ...safety, privateValuesSaved: false };
  }
  for (const route of selected) {
    const record = document.pages.find(item => item.id === route.id); if (!record) continue; record.extraStateNotes ||= [];
    onProgress(`extra-capture-${route.id}`);
    try { await goto(route); await capture(route, 'extra-baseline'); } catch (error) { record.extraStateNotes.push({ result: 'baseline blocked', errorType: error.name }); save(); continue; }
    for (const label of plans[route.id] || []) {
      try {
        await goto(route); const control = await find(route, label);
        if (!control) { record.extraStateNotes.push({ label, result: 'No unique safe native control rendered in this account/state' }); save(); continue; }
        const info = await control.locator.evaluate(element => ({ tag: element.tagName, type: element.getAttribute('type'), form: Boolean(element.closest('form')), dialog: Boolean(element.closest('[role="dialog"],dialog')), disabled: element.matches(':disabled,[aria-disabled="true"]'), editable: element.matches('input:not([type="checkbox"]),textarea,[contenteditable]') }));
        if (info.disabled || info.editable || info.form && info.type === 'submit' || info.dialog && /^(?:Create|Add|Save|Pay|Submit|Delete)$/iu.test(label)) { record.extraStateNotes.push({ label, result: 'Disabled/editor/submit control skipped; no operation attempted' }); save(); continue; }
        for (const frame of page.frames()) if (frame.url().startsWith('https://demo.impact.com/secure/')) await frame.evaluate(inspectFinanceControls, { kind: 'mark-popup-baseline', label });
        await control.locator.click(); await page.waitForLoadState('networkidle', { timeout: 4000 }).catch(() => {}); await page.waitForTimeout(600);
        if (route.id === 'payment-methods' && label === 'Add Payment Method') await waitForAddPaymentMethodReadiness(page);
        await capture(route, `opened:${label}`, { label, clickSelector: control.selector, selector: control.selector, frameURL: control.frameURL, frameQuery: staticQuery(control.frame.url()), sourceTopPath: new URL(route.href, 'https://demo.impact.com').pathname, sourceTopQuery: staticQuery(new URL(route.href, 'https://demo.impact.com').href), origin: control.origin, action: label === 'Show balance forecast' ? 'native-ui-checkbox' : 'native-control-click', type: actionType(label), safeReadOnly: true, fromBaselineClick: true, textMatch: label, controlEvidence: info }, privateFilterLabels.test(label));
      } catch (error) { record.extraStateNotes.push({ label, result: 'Safe UI state unavailable; no form submit/upload attempted', errorType: error.name }); save(); }
    }
  }
  sanitize(document); document.extraCaptureCompletedAt = new Date().toISOString(); document.extraCaptureSafety = { financialOperations: 0, submittedForms: 0, savedSettings: 0, deletedRecords: 0, uploads: 0, screenshotsSaved: 0, privateDropdownBusinessOptionsSaved: false }; save();
  console.log(`FINANCE_EXTRA_COMPLETE routes=${selected.length}; candidates=${document.uniqueCandidates}; original dedicated browser retained`);
  } finally { await translation(originalTranslation).catch(() => {}); await setAI(originalAI).catch(() => {}); }
}

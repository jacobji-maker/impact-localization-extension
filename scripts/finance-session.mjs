/** Real, read-only Impact finance discovery. Credentials arrive once over hidden STDIN. */
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core'))); }
const header = JSON.parse(readFileSync(path.join(root, 'docs/header-menus-dom-scan.json'), 'utf8'));
const routes = header.finance.entries.filter(entry => entry.href).map(entry => ({ id: entry.source.toLowerCase().replace(/[^a-z0-9]+/gu, '-').replace(/^-|-$/gu, ''), label: entry.source, href: entry.href, group: entry.group || 'main' }));
if (routes.length !== 15) throw new Error('Expected the fifteen observed finance navigation destinations');
const extensionPath = path.join(root, 'impact-cn-mod');
const profile = mkdtempSync(path.join(os.tmpdir(), 'impact-finance-browser-'));
const artifacts = path.join(root, 'artifacts', 'finance-live'); mkdirSync(artifacts, { recursive: true });
const scanFile = path.join(root, 'docs', 'finance-dom-scan.json');
const loginTarget = 'https://demo.impact.com/secure/advertiser/engage/aview.ihtml?t=u';
const scan = { mode: 'REAL_DOM_CAPTURE', source: 'Authorized real demo.impact.com finance pages', capturedAt: new Date().toISOString(), hosts: ['demo.impact.com', 'app.impact.com'], scopes: ['/secure/advertiser/finance/', '/secure/advertiser/Adv_Finance_Report/', '/secure/finance/'], financialOperations: 0, persistedCredentials: false, persistedCookieOrStorageState: false, privateValuesSaved: false, tableBusinessRowsSaved: false, routes, pages: [], notes: ['Only original Text nodes and static UI affordances are collected.', 'Account names, personal names, emails, addresses, account/payment identifiers, currencies/amounts and dates are omitted.', 'Table data cells are omitted except a fixed allowlist of generic status labels.', 'Frame and open Shadow DOM location are captured separately; frame URLs omit query strings.', 'Opening a native filter, tab, disclosure or creation form never submits, saves, deletes, deposits or transfers.'] };
let context, page, popup, phase = 'starting', secrets = [], authenticated = false, pageErrors = 0;
const progress = name => { phase = name; console.log(`FINANCE_PHASE ${name}`); };
const condition = (value, message) => { if (!value) { const error = new Error(message); error.safeMessage = message; throw error; } };
const safeURL = value => { try { const url = new URL(value); return url.origin + url.pathname; } catch { return '[unavailable]'; } };
const secure = () => { try { const url = new URL(page.url()); return url.hostname === 'demo.impact.com' && url.pathname.startsWith('/secure/advertiser/'); } catch { return false; } };
const redact = value => { let result = String(value || ''); for (const secret of secrets) if (secret) result = result.split(secret).join('[REDACTED]'); return result.replace(/[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}/gu, '<email>'); };
function save() { scan.updatedAt = new Date().toISOString(); writeFileSync(scanFile, JSON.stringify(scan, null, 2)); }
function hiddenJSON(prompt) {
  console.log(prompt); if (process.stdin.isTTY) process.stdin.setRawMode(true); process.stdin.resume();
  return new Promise((resolve, reject) => {
    let input = '';
    const cleanup = () => { process.stdin.off('data', receive); if (process.stdin.isTTY) process.stdin.setRawMode(false); process.stdin.pause(); };
    const receive = chunk => { input += chunk.toString('utf8'); if (input.includes('\u0003') || input.length > 32768) { cleanup(); reject(new Error('Hidden input cancelled or too large')); return; } if (!/[\r\n]/u.test(input)) return; cleanup(); try { resolve(JSON.parse(input.split(/[\r\n]/u)[0])); } catch { reject(new Error('Expected hidden JSON line; input omitted')); } input = ''; };
    process.stdin.on('data', receive);
  });
}
async function runtime() {
  const extensionId = createHash('sha256').update(extensionPath).digest('hex').slice(0, 32).split('').map(digit => String.fromCharCode(97 + parseInt(digit, 16))).join('');
  if (!popup || popup.isClosed()) { popup = await context.newPage(); await popup.goto(`chrome-extension://${extensionId}/popup.html`); await popup.waitForFunction(() => Boolean(chrome.runtime.id)); }
  const state = await popup.evaluate(async () => {
    const states = [];
    for (const tab of await chrome.tabs.query({ currentWindow: true })) { try { const state = await chrome.tabs.sendMessage(tab.id, { type: 'impact-cn:get-state' }); if (state?.version) states.push({ id: tab.id, version: state.version }); } catch {} }
    if (states.length === 1) window.__financeHostTab = states[0].id;
    return { contentScriptStates: states.length, versions: states.map(state => state.version) };
  });
  condition(state.contentScriptStates === 1, 'Expected one real finance host tab for extension messaging'); await page.bringToFront(); return state;
}
async function translation(enabled) {
  await runtime(); await popup.evaluate(value => chrome.tabs.sendMessage(window.__financeHostTab, { type: 'impact-cn:set-enabled', enabled: value }), enabled);
  await page.waitForFunction(value => document.querySelector('#impact-cn-assistant')?.dataset.enabled === String(value), enabled);
}
async function aiEnabled(enabled) {
  await runtime(); await popup.evaluate(value => chrome.tabs.sendMessage(window.__financeHostTab, { type: 'impact-cn:set-ai-enabled', enabled: value }), enabled);
}
async function ready() {
  await page.locator('css:light=#adv-navigation impact-style-isolator').waitFor({ state: 'attached', timeout: 45000 });
  await page.locator('#impact-cn-assistant').waitFor({ state: 'attached', timeout: 30000 });
}
async function routePage(route) {
  condition(routes.some(item => item.id === route.id && item.href === route.href), 'Only observed finance route navigation is permitted');
  progress(`opening-${route.id}`); await page.goto(new URL(route.href, 'https://demo.impact.com').href, { waitUntil: 'domcontentloaded', timeout: 60000 });
  condition(secure(), 'Finance route redirected outside the authorized advertiser page'); await ready();
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(900);
}
async function framePath(frame) {
  const result = []; let current = frame;
  while (current.parentFrame()) {
    const parent = current.parentFrame(); const handle = await current.frameElement();
    const selector = await handle.evaluate(element => {
      const css = value => CSS.escape(value); if (element.id && !/\d{4}|[a-f0-9]{12}/iu.test(element.id)) return `iframe#${css(element.id)}`;
      const name = element.getAttribute('name'); if (name && !/\d{4}|[a-f0-9]{12}/iu.test(name)) return `iframe[name=${JSON.stringify(name)}]`;
      const all = [...element.ownerDocument.querySelectorAll('iframe,frame')]; return `${element.tagName.toLowerCase()}:nth-of-type(${[...element.parentElement.children].filter(item => item.tagName === element.tagName).indexOf(element) + 1})`;
    });
    result.unshift({ selector, parentPath: safeURL(parent.url()), framePath: safeURL(current.url()) }); current = parent;
  }
  return result;
}
function observedFixedHeadingRecords() {
  // Re-read the protected, sanitized baseline rather than trusting session memory.
  const document = JSON.parse(readFileSync(scanFile, 'utf8'));
  return (document.pages || []).flatMap(page => (page.candidates || []).filter(candidate => /^H[1-6]$/u.test(candidate.tag || '') && typeof (candidate.source || candidate.text) === 'string' && typeof candidate.frameURL === 'string').map(candidate => ({ route: page.id, frameURL: candidate.frameURL, source: (candidate.source || candidate.text).trim().replace(/\s+/gu, ' ') })));
}
const captureFunction = ({ route, framePath, frameURL, knownRoutes, enumFilterLabel, observedFixedHeadings = [] }) => {
  const fixedHeadingSources = new Set(observedFixedHeadings.filter(record => record.route === route.id && record.frameURL === location.origin + location.pathname).map(record => record.source));
  const unknownHeadingText = (element, text) => {
    for (let current = element; current;) {
      if (/^H[1-6]$/u.test(current.tagName)) return !fixedHeadingSources.has(text);
      current = current.parentElement || (current.getRootNode() instanceof ShadowRoot ? current.getRootNode().host : null);
    }
    return false;
  };
  const observedCreditCardDescription = 'Draw from your credit card account. A handling charge will be charged per $100 (or part thereof) deposited.';
  const privateZones = '[id*="impact-cn"],[class*="impact-cn"],.account-name,.funding-amount,.amount,.balance,[class*="account-name"],[class*="accountName"],[class*="profile"],[class*="avatar"],[class*="currency"],.user-name,[class*="userName"],[class*="address"],[class*="Address"],.field-value,.fieldValue,.display-value,[class*="legal-name"],[class*="business-name"],.wire-details-label > p.instruction:nth-of-type(2),#ask-impact-shadow-host,[id^="ask-impact-"],dd,input,textarea,script,style,noscript,svg,canvas';
  const navLabels = new Set(['Finance', 'Overview', 'Reports', 'Make Deposit', 'Transfers', 'Documents', 'Subscription', 'Settings', 'Monthly Close', 'Upcoming Partner Payments', 'Cash Flow History', 'Partner Payments Invoices', 'impact.com Invoices', 'General', 'Legal Entities', 'Billing Groups', 'Funding Accounts', 'Payment Methods', 'Automatic Payments', 'overview', 'reports', 'make deposit', 'transfers', 'documents', 'subscription', 'settings']);
  const statusLabels = new Set(['Reported', 'Locked', 'Active', 'Inactive', 'Pending', 'Approved', 'Declined', 'Failed', 'Paid', 'Unpaid', 'Overdue', 'Past Due', 'Cancelled', 'Canceled', 'Processing', 'Completed', 'Draft', 'Enabled', 'Disabled', 'Not Set', 'Default', 'Not Active', 'No Data', 'No data', 'N/A']);
  const safeOptions = new Set(['All', 'All Statuses', 'Active', 'Inactive', 'Pending', 'Approved', 'Declined', 'Paid', 'Unpaid', 'Bank Transfer', 'Credit Card', 'PayPal', 'ACH', 'Wire Transfer', 'Monthly', 'Weekly', 'Daily', 'Ascending', 'Descending']);
  const fixedFilterEnums = {
    Type: new Set(['All', 'None', 'Action', 'Actions', 'Click', 'Clicks', 'Impressions', 'Other', 'Action Payouts', 'Click Payouts', 'Partner Fees', 'Action Fees', 'Click Fees']),
    'Funding Status ·': new Set(['All', 'None', 'Pending', 'Approved', 'Declined', 'Failed', 'Paid', 'Unpaid', 'Overdue', 'Past Due', 'Cancelled', 'Canceled', 'Processing', 'Completed']),
    'Invoice Status': new Set(['All', 'None', 'Reported', 'Locked', 'Pending', 'Approved', 'Declined', 'Paid', 'Unpaid', 'Overdue', 'Past Due', 'Cancelled', 'Canceled', 'Processing', 'Completed', 'Draft'])
  };
  const popupUI = new Set(['All', 'None', 'Search', 'Select All', 'Deselect All', 'Clear', 'Clear All', 'Apply', 'Done', 'Cancel', 'Close', 'No results', 'No results found', 'No data', 'No Data', 'All Partners', 'All Programs', 'All Users']);
  const enumContext = window.__financeEnumPopupContext;
  const verifiedEnumContext = Boolean(fixedFilterEnums[enumFilterLabel] && route.id === 'transfers' && location.origin === 'https://demo.impact.com' && location.pathname === '/secure/finance/app/manage-partner-funds-transfer-flow.ihtml' && enumContext?.label === enumFilterLabel && enumContext.path === location.pathname && enumContext.control?.isConnected && Date.now() - enumContext.markedAt < 60000 && window.__financePopupBaseline);
  const privateValues = new Set(window.__financePrivateStrings || []);
  const privateQuery = '.account-name,.account-btn,.profileBtn,[class*="accountName"],[class*="userName"],input:not([type="checkbox"]):not([type="radio"]),textarea';
  const allRoots = []; const walkRoots = (container, chain = []) => { allRoots.push({ container, chain }); for (const element of container.querySelectorAll('*')) if (element.shadowRoot) walkRoots(element.shadowRoot, [...chain, cssSelector(element)]); };
  const cssSelector = element => {
    if (element.id && !/\d{4}|[a-f0-9]{12}/iu.test(element.id)) return `#${CSS.escape(element.id)}`;
    for (const attr of ['data-testid', 'data-test', 'name']) { const value = element.getAttribute(attr); if (value && !/\d{4}|[a-f0-9]{12}/iu.test(value)) return `${element.tagName.toLowerCase()}[${attr}=${JSON.stringify(value)}]`; }
    const pieces = []; let current = element; let count = 0;
    while (current?.nodeType === 1 && count++ < 5) {
      const tag = current.tagName.toLowerCase(); const stable = [...current.classList].filter(value => /^[a-zA-Z_-][a-zA-Z0-9_-]*$/u.test(value) && !/\d{4}|[a-f0-9]{12}|^ng-|^css-|^sc-/iu.test(value)).slice(0, 2);
      let part = tag + stable.map(value => `.${CSS.escape(value)}`).join('');
      const siblings = current.parentElement ? [...current.parentElement.children].filter(item => item.tagName === current.tagName) : [];
      if (siblings.length > 1) part += `:nth-of-type(${siblings.indexOf(current) + 1})`;
      pieces.unshift(part); if (current.id && !/\d{4}|[a-f0-9]{12}/iu.test(current.id)) { pieces[0] = `#${CSS.escape(current.id)}`; break; }
      current = current.parentElement;
    }
    return pieces.join(' > ');
  };
  walkRoots(document);
  for (const { container } of allRoots) for (const element of container.querySelectorAll(privateQuery)) { const value = 'value' in element ? element.value : element.textContent.trim(); if (value && value.length >= 3) privateValues.add(value); }
  const visible = element => { const bounds = element.getBoundingClientRect(); if (!bounds.width || !bounds.height) return false; for (let current = element; current;) { const style = getComputedStyle(current); if (current.hidden || current.getAttribute('aria-hidden') === 'true' || style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false; current = current.parentElement || (current.getRootNode() instanceof ShadowRoot ? current.getRootNode().host : null); } return true; };
  const privateAncestor = element => { for (let current = element; current;) { if (current.matches(privateZones)) return true; current = current.parentElement || (current.getRootNode() instanceof ShadowRoot ? current.getRootNode().host : null); } return false; };
  const unsafe = (text, fixedCreditCardDescription = false) => {
    if (!/[a-zA-Z]/u.test(text) || text.length > 1600 || /[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}/u.test(text)) return true;
    if (/\b(?:USD|EUR|GBP|JPY|KRW|AUD|CAD|CNY|CHF)\s*[\d,.]|[$€£¥₩]\s*[\d,.]|\b\d[\d,.]*\s*(?:USD|EUR|GBP|JPY|KRW|AUD|CAD|CNY|CHF)\b/iu.test(text) && !(fixedCreditCardDescription && text === observedCreditCardDescription)) return true;
    if (/\b\d{4,}\b|\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}\b/iu.test(text)) return true;
    if (/\b(?:IBAN|SWIFT|routing|account number)\b\s*[:#]?\s*[A-Z0-9-]{5,}/iu.test(text)) return true;
    for (const value of privateValues) if (text.includes(value) && text !== value && value.length > 3) return true;
    return privateValues.has(text);
  };
  const texts = [], affordances = [], links = [], skipped = { privateOrDynamic: 0, businessCells: 0, hidden: 0 };
  for (const { container, chain } of allRoots) {
    if (chain.some(part => /impact-cn|chat|ask[-_]?impact|messenger/iu.test(part))) continue;
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT); let node;
    while ((node = walker.nextNode())) {
      const element = node.parentElement; if (!element) continue; const rawText = node.nodeValue.trim(); const suffix = rawText.match(/(- Partner Payments(?: - Past Due)?)\s*$/u)?.[1]; const prefix = rawText.match(/^Displaying:/u)?.[0] || rawText.match(/^[A-Za-z][A-Za-z ]* ·(?=\s*\d+\s*$)/u)?.[0] || rawText.match(/^(?:Payments due since|Payments due through|Past due since|Pending payments due through|\(?funds required through|(?:Funding Account|Funds Account)\s*-)/u)?.[0]; const text = (suffix || prefix || rawText).replace(/\s+/gu, ' '); if (!text) continue;
      const inFinanceNavigation = chain.some(part => /adv-navigation/iu.test(part)) || Boolean(element.closest('#adv-navigation'));
      if (inFinanceNavigation && !navLabels.has(text)) { skipped.privateOrDynamic++; continue; }
      if (!visible(element)) { skipped.hidden++; continue; }
      // This observed fixed charge unit is UI copy, never an amount template.
      const fixedCreditCardDescription = route.id === 'payment-methods' && location.origin === 'https://demo.impact.com' && location.pathname === '/secure/advertiser/finance/fr/payment-method/new/ui.ihtml' && window === window.top && Array.isArray(framePath) && framePath.length === 0 && container === document && chain.length === 0 && element.getRootNode() === document && element.id === 'selector-description' && [...document.querySelectorAll('#selector-description')].filter(candidate => candidate.childElementCount === 0 && candidate.textContent.trim() === observedCreditCardDescription && [...candidate.childNodes].some(child => child.nodeType === Node.TEXT_NODE && child.nodeValue.trim() === observedCreditCardDescription)).length === 1 && element.childElementCount === 0 && rawText === observedCreditCardDescription && element.textContent.trim() === observedCreditCardDescription;
      if (privateAncestor(element) || unknownHeadingText(element, text) || unsafe(text, fixedCreditCardDescription)) { skipped.privateOrDynamic++; continue; }
      const cell = element.closest('td,[role="cell"],.data-row,.td,.table-cell,.table-row,.table-body');
      const option = element.closest('option,[role="option"],ul[class*="singleSelectionFilter"] li > a,ul[class*="multiSelectionFilter"] li > a');
      const fixedEnumFilter = Boolean(verifiedEnumContext && option && !window.__financePopupBaseline.has(option) && visible(option) && fixedFilterEnums[enumFilterLabel].has(text));
      if (element.closest('#primary-contact-multiselect,.payment-method-section #selector-label,.billing-group-name-sub,.value') && !statusLabels.has(text) && !safeOptions.has(text)) { skipped.privateOrDynamic++; continue; }
      if (cell && !suffix && !statusLabels.has(text) && !fixedEnumFilter) { skipped.businessCells++; continue; }
      if (option && !popupUI.has(text) && !fixedEnumFilter) { skipped.privateOrDynamic++; continue; }
      const parent = element.parentElement; const preceding = parent ? [...parent.children].filter(child => /^(LABEL|TH|DT)$/u.test(child.tagName)).map(child => child.textContent.trim()).filter(item => !unsafe(item)).slice(0, 2) : [];
      const exactWhitespace = suffix || prefix || node.nodeValue.trim();
      texts.push({ text: exactWhitespace, normalizedText: text, tag: element.tagName, selector: cssSelector(element), framePath, frameURL, shadowPath: chain, route: route.id, ...(fixedEnumFilter ? { fixedEnumFilter: enumFilterLabel, enumEvidence: 'new visible native option after verified fixed-label filter click' } : {}), ...(suffix ? { match: 'suffix', dynamicPrefix: '<original-billing-group-name>', dynamicPrefixSaved: false } : {}), ...(prefix ? { match: 'prefix', dynamicSuffix: /^Displaying:/u.test(prefix) ? '<original-pagination-counts>' : / ·$/u.test(prefix) ? '<original-count>' : /Account/u.test(prefix) ? '<original-currency-code>' : '<original-date>', dynamicSuffixSaved: false } : {}), kind: inFinanceNavigation ? 'finance-navigation-label' : cell ? 'generic-status' : element.closest('th,[role="columnheader"]') ? 'column-heading' : /^(H[1-6]|LABEL|DT)$/u.test(element.tagName) ? 'label-or-heading' : element.closest('button,a,[role="tab"],[role="button"]') ? 'control-label' : 'text-node', ...(preceding.length ? { labelContext: preceding } : {}) });
    }
    for (const element of container.querySelectorAll('button,[role="tab"],summary,[role="button"],select')) {
      if (!visible(element) || privateAncestor(element)) continue;
      const label = (element.innerText || element.textContent || '').trim().replace(/\s+/gu, ' ');
      if (!label || label.length > 160 || unknownHeadingText(element, label) || unsafe(label)) continue;
      if (element.closest('option,[role="option"],ul[class*="singleSelectionFilter"],ul[class*="multiSelectionFilter"]') && !popupUI.has(label)) continue;
      affordances.push({ label, tag: element.tagName, role: element.getAttribute('role'), selector: cssSelector(element), type: element.getAttribute('type'), framePath, frameURL, shadowPath: chain });
    }
    for (const element of container.querySelectorAll('a[href]')) {
      if (!visible(element) || privateAncestor(element)) continue;
      const label = (element.innerText || element.textContent || '').trim().replace(/\s+/gu, ' '); if (!label || label.length > 160 || unknownHeadingText(element, label) || unsafe(label)) continue;
      if (element.closest('ul[class*="singleSelectionFilter"],ul[class*="multiSelectionFilter"]') && !popupUI.has(label)) continue;
      const raw = element.getAttribute('href'); let value;
      try { value = new URL(raw, location.href); } catch { continue; }
      const approved = knownRoutes.find(item => new URL(item.href, 'https://demo.impact.com').href === value.href);
      if (approved) links.push({ label, href: approved.href, selector: cssSelector(element), framePath, frameURL, shadowPath: chain, kind: 'observed-finance-route' });
      else if (value.protocol === 'https:' && value.hostname === 'help.impact.com' && !value.search && !value.hash) links.push({ label, href: value.href, selector: cssSelector(element), framePath, frameURL, shadowPath: chain, kind: 'official-help' });
    }
  }
  return { texts, affordances, links, skipped, openShadowRoots: allRoots.length - 1, title: fixedHeadingSources.has(document.title.trim().replace(/\s+/gu, ' ')) && !unsafe(document.title) ? document.title : '[dynamic title omitted]' };
};
async function collect(route, state = 'initial') {
  const observedFixedHeadings = observedFixedHeadingRecords();
  const pageRecord = scan.pages.find(item => item.id === route.id) || { ...route, status: 'SCANNING', url: new URL(route.href, 'https://demo.impact.com').href, captures: [], candidates: [], links: [], frames: [], blockedFrames: [] };
  if (!scan.pages.includes(pageRecord)) scan.pages.push(pageRecord);
  const result = { state, capturedAt: new Date().toISOString(), frames: [], candidates: [], affordances: [], links: [] };
  const origin = new URL(page.url()).origin;
  for (const frame of page.frames()) {
    let url; try { url = new URL(frame.url()); } catch { continue; }
    if (frame !== page.mainFrame() && url.origin !== origin) { if (!pageRecord.blockedFrames.includes(safeURL(frame.url()))) pageRecord.blockedFrames.push(safeURL(frame.url())); continue; }
    if (!/^https?:$/u.test(url.protocol)) continue;
    try {
      const location = await framePath(frame); const captured = await frame.evaluate(captureFunction, { route, framePath: location, frameURL: url.origin + url.pathname, knownRoutes: routes, observedFixedHeadings });
      const safeQuery = Object.fromEntries([...url.searchParams].filter(([key, value]) => key === 'handle' && /^adv_[a-z_]+$/u.test(value)));
      for (const candidate of captured.texts) Object.assign(candidate, { source: candidate.text, frameQuery: safeQuery, topPath: new URL(route.href, origin).pathname });
      result.frames.push({ frameURL: url.origin + url.pathname, framePath: location, title: captured.title, openShadowRoots: captured.openShadowRoots, candidateCount: captured.texts.length, skipped: captured.skipped });
      result.candidates.push(...captured.texts); result.affordances.push(...captured.affordances); result.links.push(...captured.links);
    } catch (error) { result.frames.push({ frameURL: url.origin + url.pathname, captureFailed: true, errorType: error.name }); }
  }
  const key = item => JSON.stringify([item.text, item.selector, item.frameURL, item.shadowPath]);
  const seen = new Set(pageRecord.candidates.map(key)); for (const candidate of result.candidates) if (!seen.has(key(candidate))) { seen.add(key(candidate)); pageRecord.candidates.push({ ...candidate, observedStates: [state] }); } else { const old = pageRecord.candidates.find(item => key(item) === key(candidate)); if (!old.observedStates.includes(state)) old.observedStates.push(state); }
  pageRecord.captures.push({ state, capturedAt: result.capturedAt, frames: result.frames, candidateCount: result.candidates.length, affordances: result.affordances });
  pageRecord.frames = result.frames; pageRecord.links = [...new Map([...pageRecord.links, ...result.links].map(item => [JSON.stringify(item), item])).values()];
  pageRecord.texts = pageRecord.candidates; pageRecord.topPath = new URL(route.href, origin).pathname; pageRecord.topQuery = Object.fromEntries(new URL(route.href, origin).searchParams); pageRecord.safeActions ||= [];
  pageRecord.status = result.candidates.length ? 'CAPTURED' : 'EMPTY_OR_BLOCKED'; save(); console.log(`FINANCE_CAPTURE ${route.id} state=${state} candidates=${result.candidates.length} unique=${pageRecord.candidates.length} frames=${result.frames.length}`); return result;
}
async function currentRoute() {
  const url = new URL(page.url()); return routes.find(route => new URL(route.href, url.origin).pathname === url.pathname && (new URL(route.href, url.origin).searchParams.get('handle') || '') === (url.searchParams.get('handle') || ''));
}
async function safeDisclosures(route, result, options) {
  const allowed = /^(?:Filters?|Show Filters|Hide Filters|Advanced Filters?|More Filters|Show details|View details|View Details|Add Legal Entity|New Legal Entity|Create Legal Entity|Add Billing Group|New Billing Group|Create Billing Group|Add Payment Method|New Payment Method|Add Funding Account|New Funding Account|Add Automatic Payment|Create Automatic Payment)$/iu;
  const tabs = result.affordances.filter(item => item.role === 'tab' && !/delete|save|pay|deposit|transfer|export|download|submit/iu.test(item.label));
  const disclosures = result.affordances.filter(item => allowed.test(item.label));
  const choices = [...tabs.slice(0, options.maxTabs ?? 5), ...disclosures.slice(0, options.maxDisclosures ?? 3)];
  for (const item of choices) {
    try {
      // Reset to the observed safe route between forms; no cancel button is assumed.
      await routePage(route); await translation(false);
      const frame = page.frames().find(frame => safeURL(frame.url()) === item.frameURL); if (!frame) continue;
      const query = item.shadowPath.length ? [...item.shadowPath, item.selector].join(' ') : item.selector;
      const control = frame.locator(query).filter({ visible: true }); if (await control.count() !== 1) continue;
      const current = (await control.innerText()).trim().replace(/\s+/gu, ' '); if (current !== item.label) continue;
      await control.click(); await page.waitForTimeout(600); const captured = await collect(route, `opened:${item.label}`); const record = scan.pages.find(page => page.id === route.id); record.safeActions.push({ ...item, action: 'native-control-click', capturedState: `opened:${item.label}`, candidateCount: captured.candidates.length, submitPerformed: false }); save();
    } catch (error) { const record = scan.pages.find(item => item.id === route.id); record.interactionNotes ||= []; record.interactionNotes.push({ label: item.label, errorType: error.name, result: 'safe disclosure unavailable; no submit attempted' }); save(); }
  }
}
async function scanAll(options = {}) {
  condition(secure(), 'Complete real login before finance discovery'); authenticated = true;
  scan.status = 'SCANNING'; scan.startedAt = new Date().toISOString(); save();
  const selected = options.ids?.length ? routes.filter(route => options.ids.includes(route.id)) : routes;
  condition(selected.length > 0, 'No observed routes match scan selection');
  for (const route of selected) {
    try { await routePage(route); await translation(false); const result = await collect(route); if (options.disclosures !== false) await safeDisclosures(route, result, options); }
    catch (error) { const record = scan.pages.find(item => item.id === route.id) || { ...route, captures: [], candidates: [], links: [], frames: [], blockedFrames: [] }; if (!scan.pages.includes(record)) scan.pages.push(record); record.status = 'BLOCKED'; record.error = { phase, errorType: error.name, safeMessage: error.safeMessage || 'Real page capture blocked; private error details omitted' }; save(); console.log(`FINANCE_CAPTURE_BLOCKED ${route.id}: ${record.error.safeMessage}`); }
  }
  scan.status = scan.pages.length === routes.length && scan.pages.every(page => page.status === 'CAPTURED') ? 'CAPTURED_ALL_ROUTES' : 'PARTIAL'; scan.finishedAt = new Date().toISOString(); scan.uniqueCandidates = scan.pages.reduce((sum, page) => sum + page.candidates.length, 0); save();
  await translation(true).catch(() => {}); if (popup && !popup.isClosed()) { await popup.close(); popup = null; }
  console.log(`FINANCE_SCAN_COMPLETE ${scan.status}; routes=${scan.pages.length}/15; candidates=${scan.uniqueCandidates}; browser retained`);
}
async function screenshot(name = 'current') {
  // Every business row, editor and account/detail-value region is masked before a cropped body screenshot.
  const masks = []; const privateSelector = 'input:not([type="checkbox"]):not([type="radio"]),textarea,[contenteditable],td,[role="cell"],dd,.account-btn,.profileBtn,.account-name,.funding-amount,.amount,.balance,[class*="accountName"],[class*="userName"],[class*="avatar"],[class*="account-value"],[class*="field-value"],[class*="currency"],#adv-finance-btn,h1,h2,h3,[class*="address"],[class*="Address"],[class*="legal-name"],[class*="business-name"]';
  for (const frame of page.frames()) { try { if (new URL(frame.url()).origin === new URL(page.url()).origin) { masks.push(frame.locator(privateSelector)); masks.push(frame.getByText(/[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}/u)); masks.push(frame.getByText(/[$€£¥₩]\s*[\d,.]|\b(?:USD|EUR|GBP|JPY|KRW|AUD|CAD|CNY|CHF)\s*[\d,.]/u)); for (const secret of secrets) if (secret) masks.push(frame.getByText(secret, { exact: false })); } } catch {} }
  const viewport = page.viewportSize(); await page.screenshot({ path: path.join(artifacts, `${name.replace(/[^a-z0-9_-]/giu, '-')}.png`), clip: { x: 240, y: 88, width: viewport.width - 260, height: Math.min(viewport.height - 108, 780) }, mask: masks, maskColor: '#dbe1e7' }); console.log(`FINANCE_MASKED_SCREENSHOT ${name}`);
}
async function reloadExtension() {
  const id = createHash('sha256').update(extensionPath).digest('hex').slice(0, 32).split('').map(digit => String.fromCharCode(97 + parseInt(digit, 16))).join('');
  if (popup && !popup.isClosed()) { await popup.close(); popup = null; }
  const management = await context.newPage(); await management.goto('chrome://extensions/');
  const item = management.locator(`extensions-item#${id}`); await item.waitFor({ state: 'attached' });
  const reload = item.locator('#dev-reload-button'); await reload.waitFor({ state: 'visible' }); await reload.click(); await management.waitForTimeout(400); await management.close();
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 }); await ready(); await page.bringToFront(); console.log(`FINANCE_EXTENSION_RELOADED ${JSON.parse(readFileSync(path.join(extensionPath, 'manifest.json'), 'utf8')).version}`);
}
async function inspectAuth() {
  const info = await page.evaluate(() => ({ fields: [...document.querySelectorAll('input')].filter(element => element.getBoundingClientRect().width).map(element => ({ type: element.type, name: element.name, id: element.id })), submitButtons: [...document.querySelectorAll('button')].filter(element => element.getBoundingClientRect().width && /^(Continue|Sign in|Log in|Login)$/iu.test(element.textContent.trim())).map(element => element.textContent.trim()) }));
  console.log(`FINANCE_AUTH_DIAGNOSTIC ${JSON.stringify({ phase, url: safeURL(page.url()), authenticatedURL: secure(), ...info, valuesRead: false })}`);
}
async function loop() {
  while (true) {
    const options = await hiddenJSON('WAITING_FINANCE_CONTROL_JSON: scan / goto {id} / inspect / reloadExtension / runModule / inspect-auth / finish. Browser stays open.');
    if (options.action === 'finish') { console.log('EXPLICIT_FINANCE_FINISH'); return; }
    try {
      if (options.action === 'inspect-auth') { await inspectAuth(); continue; }
      condition(secure(), 'Real advertiser login is required');
      if (options.action === 'scan') await scanAll(options);
      else if (options.action === 'goto') { const route = routes.find(route => route.id === options.id); condition(route, 'Only captured finance route IDs are allowed'); await routePage(route); await collect(route, 'manual-inspection'); }
      else if (options.action === 'inspect') { const route = await currentRoute(); if (route) await collect(route, 'inspection'); if (options.screenshot === true) await screenshot(options.name || 'current'); else console.log('FINANCE_INSPECT_CAPTURED_NO_SCREENSHOT'); }
      else if (options.action === 'reloadExtension') await reloadExtension();
      else if (options.action === 'runModule') { const modulePath = path.join(root, 'scripts/finance-live-checks.mjs'); const module = await import(`${pathToFileURL(modulePath).href}?revision=${Date.now()}`); const run = module.runModule || module.runFinanceChecks; condition(typeof run === 'function', 'Finance test module must export runModule'); await run({ context, page, root, routes, artifacts, translation, ai: aiEnabled, aiEnabled, runtime, ready, routePage, screenshot, secureURL: secure, safeURL, progress, onProgress: progress, onlyPageIds: options.ids || options.onlyPageIds, options, getPageErrors: () => pageErrors }); }
      else if (options.action === 'translation') { condition(typeof options.enabled === 'boolean', 'translation.enabled must be boolean'); await translation(options.enabled); }
      else throw Object.assign(new Error('Unknown finance control action'), { safeMessage: 'Unknown finance control action' });
    } catch (error) { console.log(`FINANCE_CONTROL_FAIL action=${String(options.action).replace(/[^a-z]/giu, '')} phase=${phase} errorType=${error.name} message=${redact(error.safeMessage || 'Operation failed; private error details omitted')}`); console.log('FINANCE_BROWSER_RETAINED; no automatic credential retry'); }
  }
}
try {
  context = await chromium.launchPersistentContext(profile, { executablePath: chromium.executablePath(), channel: 'chromium', headless: false, viewport: { width: 1440, height: 1000 }, args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`] });
  page = context.pages()[0] || await context.newPage(); page.setDefaultTimeout(10000); page.on('pageerror', () => { if (authenticated) pageErrors++; });
  progress('opening-dashboard-login'); await page.goto(loginTarget, { waitUntil: 'domcontentloaded', timeout: 45000 });
  if (!secure() && !process.argv.includes('--manual-login')) {
    const credentials = await hiddenJSON('WAITING_AUTH_JSON: one username/password JSON line, terminal echo disabled, one login attempt; never saved.');
    condition(typeof credentials.username === 'string' && typeof credentials.password === 'string', 'Hidden username/password JSON is required'); secrets = [credentials.username, credentials.password];
    progress('waiting-username'); const username = page.locator('input[name="j_username"]'); await username.waitFor({ state: 'visible', timeout: 60000 }); await username.fill(credentials.username); await page.getByRole('button', { name: 'Continue', exact: true }).click();
    progress('waiting-password'); const password = page.locator('input[type="password"]'); await password.waitFor({ state: 'visible', timeout: 30000 }); await password.fill(credentials.password); await page.getByRole('button', { name: /^(Sign in|Log in|Login|Continue)$/iu }).click(); credentials.username = ''; credentials.password = ''; progress('single-login-submitted');
  }
  if (!process.argv.includes('--manual-login')) { await page.waitForURL(url => url.hostname === 'demo.impact.com' && url.pathname.startsWith('/secure/advertiser/'), { waitUntil: 'domcontentloaded', timeout: 90000 }); authenticated = true; await ready(); console.log('FINANCE_AUTHENTICATED_READY; await scan'); }
  else console.log('FINANCE_MANUAL_LOGIN_READY; no credentials read; inspect-auth available');
  await loop();
} catch (error) { console.log(`FINANCE_STARTUP_BLOCKED phase=${phase} errorType=${error.name} message=${redact(error.safeMessage || 'Real browser startup/login blocked; private error details omitted')}`); if (context && page && !page.isClosed()) { await inspectAuth().catch(() => {}); console.log('FINANCE_BROWSER_RETAINED_AFTER_STARTUP_FAILURE'); await loop(); } }
finally { if (process.stdin.isTTY) process.stdin.setRawMode(false); if (context) await context.close(); rmSync(profile, { recursive: true, force: true }); secrets = []; }

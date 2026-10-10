/** Real Impact Help/Finance menu acceptance. No routes, copied page, payment or AI send. */
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core'))); }
const capture = JSON.parse(readFileSync(path.join(root, 'docs/header-menus-dom-scan.json'), 'utf8'));
const sandbox = {}; vm.createContext(sandbox); vm.runInContext(readFileSync(path.join(root, 'impact-cn-mod/dict.js'), 'utf8'), sandbox);
const dictionary = sandbox.IMPACT_CN_DICTIONARY;
const entries = dictionary.entries.filter(entry => entry.observedSource === 'docs/header-menus-dom-scan.json');
const target = process.argv.find(arg => arg.startsWith('--target='))?.slice(9) || capture.sourcePage;
if (new URL(target).hostname !== 'demo.impact.com' || new URL(target).protocol !== 'https:' || !new URL(target).pathname.startsWith(capture.path)) throw new Error('Only the authorized real demo advertiser site is accepted');
const loginTarget = 'https://demo.impact.com/secure/advertiser/engage/aview.ihtml?t=u';
const manualLogin = process.argv.includes('--manual-login');
const extensionPath = path.join(root, 'impact-cn-mod');
const artifacts = path.join(root, 'artifacts', 'header-live'); mkdirSync(artifacts, { recursive: true });
const profile = mkdtempSync(path.join(os.tmpdir(), 'impact-header-browser-'));
const version = JSON.parse(readFileSync(path.join(extensionPath, 'manifest.json'), 'utf8')).version;
const report = { status: 'BLOCKED', mode: 'REAL_NETWORK_HEADER_MENUS_ONLY', version, target, routesOrFixtures: false, financeBodyVisited: false, moneyOperations: 0, aiSends: 0, credentialsSaved: false, authStateExported: false, results: [], attempts: [] };
let context, page, popup, phase = 'browser-start', secrets = [], pageErrors = 0;
const progress = value => { phase = value; console.log(`HEADER_PHASE ${value}`); };
const condition = (value, message) => { if (!value) { const error = new Error(message); error.safeMessage = message; throw error; } };
const redact = value => { let text = String(value ?? ''); for (const secret of secrets) if (secret) text = text.split(secret).join('[REDACTED]'); return text.replace(/[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}/gu, '<email>'); };
function redactObject(value) { if (typeof value === 'string') return redact(value); if (Array.isArray(value)) return value.map(redactObject); if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, redactObject(item)])); return value; }
const secureURL = () => { const url = new URL(page.url()); return url.hostname === 'demo.impact.com' && url.pathname.startsWith(capture.path); };
const safeURL = value => { const url = new URL(value); return url.origin + url.pathname; };
function record(name, status, evidence) { const result = { name, status, evidence: redact(evidence) }; report.results.push(result); console.log(`HEADER ${status} ${name}: ${result.evidence}`); }
function save() {
  report.timestamp = new Date().toISOString(); report.timezone = 'Asia/Seoul';
  writeFileSync(path.join(artifacts, 'report.json'), JSON.stringify(report, null, 2));
  writeFileSync(path.join(root, 'header-live-test-report.md'), `# 右上 Help / Finance 菜单实网验收\n\n版本：${version}。结果：**${report.status}**。\n\n模式：真实 demo.impact.com 网络与已加载的 MV3；未使用路由或复制页面，未进入财务正文、充值、转账或 AI 发送。没有保存凭据、cookies 或 storageState。\n\n${report.results.map(r => `- **${r.status}** ${r.name}：${r.evidence}`).join('\n')}\n\n本报告仅适用于右上菜单试点，不能视为财务模块正文验收。\n`);
}
function hiddenJSON(prompt) {
  console.log(prompt); if (process.stdin.isTTY) process.stdin.setRawMode(true); process.stdin.resume();
  return new Promise((resolve, reject) => {
    let input = '';
    const cleanup = () => { process.stdin.off('data', receive); if (process.stdin.isTTY) process.stdin.setRawMode(false); process.stdin.pause(); };
    const receive = chunk => {
      input += chunk.toString('utf8');
      if (input.includes('\u0003') || input.length > 32768) { cleanup(); reject(new Error('Hidden input cancelled or too large')); return; }
      if (!/[\r\n]/u.test(input)) return;
      cleanup(); try { resolve(JSON.parse(input.split(/[\r\n]/u)[0])); } catch { reject(new Error('Expected one hidden JSON line; content omitted')); } input = '';
    };
    process.stdin.on('data', receive);
  });
}
async function authenticationDiagnostic() {
  if (!page || page.isClosed()) return { phase, browserClosed: true };
  const current = new URL(page.url());
  const diagnostic = await page.evaluate(() => {
    const visible = element => { const rect = element.getBoundingClientRect(); return rect.width > 0 && rect.height > 0 && getComputedStyle(element).visibility === 'visible'; };
    return { title: document.title, fields: [...document.querySelectorAll('input')].filter(visible).map(element => ({ type: element.getAttribute('type'), name: element.getAttribute('name'), id: element.id })), buttons: [...document.querySelectorAll('button,input[type="submit"]')].filter(visible).map(element => ({ tag: element.tagName, type: element.getAttribute('type'), text: element.tagName === 'INPUT' ? '[submit input]' : element.textContent.trim().slice(0, 100) })), alerts: [...document.querySelectorAll('[role="alert"],.error-message,.errorMessage,.invalid-feedback,.form-error')].filter(visible).map(element => element.textContent.trim().slice(0, 300)).filter(Boolean).slice(0, 5) };
  }).catch(() => ({ contextUnavailable: true }));
  const safe = redactObject({ phase, origin: current.origin, path: current.pathname, authenticatedURL: secureURL(), valuesRead: false, htmlSaved: false, ...diagnostic });
  report.authDiagnostic = safe; writeFileSync(path.join(artifacts, 'auth-diagnostic.json'), JSON.stringify(safe, null, 2));
  // Screenshots contain no browser chrome or address query, and every editor,
  // email and exact credential-bearing text is masked. No DOM attributes added.
  const masks = [page.locator('input,textarea,[contenteditable]'), page.getByText(/[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}/u)];
  for (const secret of secrets) if (secret) masks.push(page.getByText(secret, { exact: false }));
  if (secureURL()) await screenshot('auth-diagnostic-toolbar.png');
  else await page.screenshot({ path: path.join(artifacts, 'auth-diagnostic.png'), fullPage: false, mask: masks, maskColor: '#dbe1e7' }).catch(() => { safe.screenshotUnavailable = true; });
  console.log(`HEADER_AUTH_DIAGNOSTIC ${JSON.stringify(safe)}`); return safe;
}
async function ready() {
  await page.locator(`css:light=${capture.shadowHost}`).waitFor({ state: 'attached', timeout: 45000 });
  await page.locator('#impact-cn-assistant .impact-cn-panel-version').waitFor({ state: 'attached', timeout: 30000 });
  await page.locator(`${capture.shadowHost} ${capture.help.openerSelector}`).waitFor({ state: 'visible', timeout: 30000 });
  condition(await page.locator('#impact-cn-assistant .impact-cn-panel-version').textContent().then(text => text.includes(version)), 'Loaded extension version differs from manifest');
}
async function runtime() {
  if (popup && !popup.isClosed()) return;
  const extensionId = createHash('sha256').update(extensionPath).digest('hex').slice(0, 32).split('').map(digit => String.fromCharCode(97 + parseInt(digit, 16))).join('');
  popup = await context.newPage(); await popup.goto(`chrome-extension://${extensionId}/popup.html`); await popup.waitForFunction(() => Boolean(chrome.runtime.id));
  // The shipped extension has only storage permission. Probe content-script
  // state by non-sensitive tab ID; never depend on protected tab URL access.
  const diagnostic = await popup.evaluate(async expectedVersion => {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const states = [];
    for (const tab of tabs) {
      try { const state = await chrome.tabs.sendMessage(tab.id, { type: 'impact-cn:get-state' }); if (state && typeof state.version === 'string') states.push({ id: tab.id, version: state.version }); }
      catch { /* About:blank and the popup have no Impact content script. */ }
    }
    const matches = states.filter(state => state.version === expectedVersion);
    if (matches.length === 1) window.__headerHostTab = matches[0].id;
    return { tabs: tabs.length, contentScriptStates: states.length, expectedVersionStates: matches.length };
  }, version);
  condition(diagnostic.expectedVersionStates === 1, `Extension runtime host probe is not unique: tabs=${diagnostic.tabs}, contentScriptStates=${diagnostic.contentScriptStates}, expectedVersionStates=${diagnostic.expectedVersionStates}`);
  await page.bringToFront();
}
async function translation(enabled) {
  await runtime(); await popup.evaluate(value => chrome.tabs.sendMessage(window.__headerHostTab, { type: 'impact-cn:set-enabled', enabled: value }), enabled);
  await page.waitForFunction(value => document.querySelector('#impact-cn-assistant')?.dataset.enabled === String(value), enabled);
}
function locator(selector) { return page.locator(`${capture.shadowHost} ${selector}`); }
async function ensureMenu(name) {
  const menu = capture[name];
  if (await locator(menu.rootSelector).filter({ visible: true }).count()) return;
  await locator(menu.openerSelector).click();
  await locator(menu.rootSelector).filter({ visible: true }).first().waitFor({ state: 'visible', timeout: 10000 });
}
async function ensureGroup(group, translated) {
  const first = capture.finance.entries.find(entry => entry.source === group.labels[0]);
  const firstTarget = entries.find(entry => entry.source === first.source)?.target;
  const children = locator(first.selector).filter({ hasText: new RegExp(`^(?:${escape(first.source)}|${escape(firstTarget || '')})$`) }).filter({ visible: true });
  if (await children.count()) return;
  const targetLabel = entries.find(entry => entry.source === group.source)?.target;
  const button = locator(group.openerSelector).filter({ hasText: new RegExp(`^${escape(translated ? targetLabel : group.source)}$`) }).filter({ visible: true });
  condition(await button.count() === 1, `Finance ${group.source} expander is not unique`); await button.click(); await children.waitFor({ state: 'visible' });
}
function escape(value) { return String(value).replace(/[.*+?^${}()|[\]\\]/gu, '\\$&'); }
async function baseline(id, definitions) {
  const result = await page.evaluate(({ id, definitions, entries, allDefinitions, hostSelector }) => {
    const query = (container, selector, found = new Set()) => { for (const element of container.querySelectorAll(selector)) found.add(element); for (const element of container.querySelectorAll('*')) if (element.shadowRoot) query(element.shadowRoot, selector, found); return [...found]; };
    const roots = query(document, hostSelector).filter(host => host.shadowRoot).map(host => host.shadowRoot);
    const visible = element => { const rect = element.getBoundingClientRect(); if (rect.width <= 0 || rect.height <= 0 || getComputedStyle(element).visibility !== 'visible') return false; for (let node = element; node;) { const style = getComputedStyle(node); if (node.hidden || node.getAttribute('aria-hidden') === 'true' || style.display === 'none' || Number(style.opacity) === 0) return false; node = node.parentElement || (node.getRootNode() instanceof ShadowRoot ? node.getRootNode().host : null); } return true; };
    const records = [], missing = [], optionalAbsent = [];
    for (const definition of definitions) {
      const matches = [...new Set(roots.flatMap(root => query(root, definition.selector)))].filter(visible).flatMap(element => [...element.childNodes].filter(node => node.nodeType === Node.TEXT_NODE && (definition.match === 'prefix' ? node.nodeValue.trim().startsWith(definition.source) : node.nodeValue.trim() === definition.source)).map(node => ({ element, node })));
      if (!matches.length && definition.kind === 'date-prefix') { optionalAbsent.push(definition.source); continue; }
      if (matches.length !== 1) { missing.push({ source: definition.source, matchCount: matches.length }); continue; }
      const entry = entries.find(entry => entry.source === definition.source && entry.scope?.selector === definition.selector);
      if (!entry) { missing.push({ source: definition.source, matchCount: 1, dictionaryEntryMissing: true }); continue; }
      const { element, node } = matches[0]; const original = node.nodeValue; const trimmed = original.trim(); const begin = original.indexOf(trimmed);
      const expected = original.slice(0, begin) + entry.target + (definition.match === 'prefix' ? trimmed.slice(definition.source.length) : '') + original.slice(begin + trimmed.length);
      records.push({ element, node, original, expected, href: element.getAttribute('href'), definition, entryId: entry.id });
    }
    const containers = [...new Set(roots.flatMap(root => query(root, '.help-menu-item,.finance-bubble')))].filter(visible);
    const valueNodes = [], links = [], checked = new Set(), labelNodes = new Set(), dateRecords = [];
    // A child-menu baseline still sees the card above it. Exclude ALL captured
    // labels from amount checks; changing a fixed due-date prefix is expected.
    for (const definition of allDefinitions) {
      const entry = entries.find(entry => entry.source === definition.source && entry.scope?.selector === definition.selector);
      if (!entry) continue;
      for (const element of [...new Set(roots.flatMap(root => query(root, definition.selector)))].filter(visible)) {
        for (const node of [...element.childNodes].filter(node => node.nodeType === Node.TEXT_NODE)) {
          const text = node.nodeValue.trim();
          const isLabel = definition.match === 'prefix' ? text.startsWith(definition.source) || text.startsWith(entry.target) : [definition.source, entry.target].includes(text);
          if (!isLabel) continue; labelNodes.add(node);
          if (definition.match === 'prefix') {
            const prefix = text.startsWith(definition.source) ? definition.source : entry.target;
            dateRecords.push({ element, node, suffix: text.slice(prefix.length), sourcePrefix: definition.source, targetPrefix: entry.target, entryId: entry.id });
          }
        }
      }
    }
    for (const container of containers) {
      for (const amount of container.querySelectorAll('.funding-amount,.amount')) {
        if (!visible(amount)) continue;
        const walker = document.createTreeWalker(amount, NodeFilter.SHOW_TEXT); let node;
        while ((node = walker.nextNode())) if (visible(node.parentElement) && /\d/u.test(node.nodeValue) && !labelNodes.has(node) && !checked.has(node)) { checked.add(node); valueNodes.push({ node, original: node.nodeValue, parent: node.parentElement }); }
      }
      for (const element of container.querySelectorAll('a[href]')) if (visible(element)) links.push({ element, href: element.getAttribute('href') });
    }
    window.__headerLiveBaselines ||= {}; window.__headerLiveBaselines[id] = { records, valueNodes, links, dateRecords };
    return { labels: records.map(record => record.definition.source), missing, optionalAbsent, numericTextNodes: valueNodes.length, dateSuffixNodes: dateRecords.length, links: links.length };
  }, { id, definitions, entries, allDefinitions: [...capture.help.entries, ...capture.finance.entries], hostSelector: capture.shadowHost });
  condition(result.missing.length === 0, `English baseline missing labels: ${result.missing.map(item => `${item.source}(${item.matchCount})`).join(', ')}`);
  return result;
}
async function verify(id) {
  await page.waitForFunction(id => window.__headerLiveBaselines[id].records.every(record => record.node.nodeValue === record.expected), id, { timeout: 12000 });
  const result = await page.evaluate(id => {
    const baseline = window.__headerLiveBaselines[id];
    const changedDates = baseline.dateRecords.filter(record => { const text = record.node.nodeValue.trim(); const prefix = text.startsWith(record.sourcePrefix) ? record.sourcePrefix : text.startsWith(record.targetPrefix) ? record.targetPrefix : null; return !record.node.isConnected || record.node.parentElement !== record.element || !prefix || text.slice(prefix.length) !== record.suffix; });
    return { translated: baseline.records.map(record => ({ source: record.definition.source, target: record.definition.match === 'prefix' ? `${baseline.dateRecords.find(date => date.node === record.node).targetPrefix} <original-date>)` : record.expected.trim(), prefix: record.definition.match === 'prefix' })), detachedNodes: baseline.records.filter(record => !record.node.isConnected).length, replacedNodes: baseline.records.filter(record => record.node.parentElement !== record.element || ![...record.element.childNodes].includes(record.node)).length, changedLinks: baseline.links.filter(record => record.element.getAttribute('href') !== record.href).length, changedNumericNodes: baseline.valueNodes.filter(record => record.node.parentElement !== record.parent || record.node.nodeValue !== record.original).length, changedDateSuffixes: changedDates.length, numericTextNodes: baseline.valueNodes.length, dateSuffixNodes: baseline.dateRecords.length, links: baseline.links.length };
  }, id);
  condition(result.detachedNodes + result.replacedNodes + result.changedLinks + result.changedNumericNodes + result.changedDateSuffixes === 0, `${id} invariant failure: detached=${result.detachedNodes}, replaced=${result.replacedNodes}, links=${result.changedLinks}, amounts=${result.changedNumericNodes}, dateSuffixes=${result.changedDateSuffixes}`);
  return result;
}
async function inspectProof() {
  const proof = await page.evaluate(() => Object.entries(window.__headerLiveBaselines || {}).map(([state, baseline]) => {
    const changedDates = (baseline.dateRecords || []).filter(record => { const text = record.node.nodeValue.trim(); const prefix = text.startsWith(record.sourcePrefix) ? record.sourcePrefix : text.startsWith(record.targetPrefix) ? record.targetPrefix : null; return !record.node.isConnected || record.node.parentElement !== record.element || !prefix || text.slice(prefix.length) !== record.suffix; });
    return { state, labelCount: baseline.records.length, detachedLabels: baseline.records.filter(record => !record.node.isConnected).length, replacedLabels: baseline.records.filter(record => record.node.parentElement !== record.element).length, untranslatedLabelIds: baseline.records.filter(record => record.node.nodeValue !== record.expected).map(record => record.entryId), changedLinkCount: baseline.links.filter(record => record.element.getAttribute('href') !== record.href).length, amountNodeCount: baseline.valueNodes.length, changedAmountCount: baseline.valueNodes.filter(record => record.node.parentElement !== record.parent || record.node.nodeValue !== record.original).length, dateSuffixNodeCount: (baseline.dateRecords || []).length, changedDateSuffixIds: changedDates.map(record => record.entryId) };
  }));
  const result = { privateValuesReadForComparisonOnly: true, privateValuesReturned: false, proof };
  writeFileSync(path.join(artifacts, 'proof-diagnostic.json'), JSON.stringify(result, null, 2)); console.log(`HEADER_PROOF_DIAGNOSTIC ${JSON.stringify(result)}`); return result;
}
async function restored(id) {
  await page.waitForFunction(id => window.__headerLiveBaselines[id].records.every(record => record.node.nodeValue === record.original && record.node.parentElement === record.element), id);
}
async function screenshot(name, menu) {
  const masks = [page.locator('input:not([type="checkbox"]):not([type="radio"]),textarea,[contenteditable],.account-btn,.profileBtn'), locator('.finance-bubble .account-name,.finance-bubble .funding-amount,.finance-bubble .amount,#adv-finance-btn')];
  // Evidence covers the native panel only. The surrounding partner table can
  // contain contact emails; it is unrelated to this menu pilot and is excluded.
  const finance = locator('.finance-bubble').filter({ visible: true });
  const help = locator('.iui-list:has(.help-menu-item)').filter({ visible: true });
  const panel = menu === 'help' ? help : menu === 'finance' ? finance : await finance.count() ? finance : await help.count() ? help : null;
  if (panel) {
    condition(await panel.count() === 1, 'Native menu screenshot panel is not unique');
    await panel.screenshot({ path: path.join(artifacts, name), mask: masks, maskColor: '#dbe1e7' });
  } else {
    // Read-only inspection with no menu open captures just the top toolbar.
    const size = page.viewportSize();
    await page.screenshot({ path: path.join(artifacts, name), clip: { x: 0, y: 0, width: size.width, height: Math.min(90, size.height) }, mask: masks, maskColor: '#dbe1e7' });
  }
}
async function testState(id, definitions, setup) {
  await translation(false); await setup(false); const before = await baseline(id, definitions); await translation(true); const after = await verify(id);
  await translation(false); await restored(id); await translation(true); await verify(id);
  return { state: id, ...before, ...after, restorationPassed: true };
}
async function run(options) {
  condition(secureURL(), 'Complete real demo login before running header checks'); report.authenticated = true; report.results = []; report.status = 'RUNNING'; report.menus = []; pageErrors = 0;
  if (safeURL(page.url()) !== safeURL(target)) { progress('opening-captured-partner-page'); await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 45000 }); }
  report.currentPage = safeURL(page.url()); save(); await ready();
  condition(entries.length === 32, 'Header dictionary does not contain all 32 captured entries');
  condition(await page.evaluate(() => !globalThis.ImpactCN), 'Extension API unexpectedly exposed in page main world');
  record('真实站点与 MV3 隔离世界', 'PASS', `demo.impact.com ${version}; no routes or fixtures; header menu scope only`);
  progress('help-menu'); const help = await testState('help', capture.help.entries, () => ensureMenu('help')); report.menus.push(help); await screenshot('help-localized.png', 'help'); record('右上问号菜单', 'PASS', `${help.translated.length}/6 fixed labels; original Text and link attributes retained; off/on restoration verified`);
  progress('finance-card'); const parents = capture.finance.entries.filter(entry => entry.kind !== 'child'); const finance = await testState('finance-card', parents, () => ensureMenu('finance')); report.menus.push(finance); await screenshot('finance-card-localized.png', 'finance'); record('财务下拉框卡片与入口', 'PASS', `${finance.translated.length}/${parents.length} currently rendered labels; ${finance.numericTextNodes} numeric Text nodes untouched; optional absent date labels: ${finance.optionalAbsent.join(', ') || 'none'}`);
  for (const group of capture.finance.groups) { progress(`finance-${group.source}`); const state = await testState(`finance-${group.source}`, capture.finance.entries.filter(entry => entry.kind === 'child' && entry.group === group.source), translated => ensureGroup(group, translated)); report.menus.push(state); record(`财务 ${group.source} 子菜单`, 'PASS', `${state.translated.length}/${group.labels.length} labels; native expand button used; ${state.links} link attributes untouched; no business link activated`); }
  await screenshot('finance-submenus-localized.png', 'finance');
  if (options.verifyReload !== false) {
    progress('reload'); await page.reload({ waitUntil: 'domcontentloaded', timeout: 45000 }); await ready();
    condition(await page.locator('#impact-cn-assistant').getAttribute('data-enabled') === 'true', 'Translation setting did not survive reload');
    await ensureMenu('help'); await translation(false); const reloadHelp = await baseline('reload-help', capture.help.entries); await translation(true); await verify('reload-help');
    await ensureMenu('finance'); await translation(false); const reloadFinance = await baseline('reload-finance', parents); await translation(true); await verify('reload-finance');
    for (const group of capture.finance.groups) await ensureGroup(group, true);
    await screenshot('finance-after-reload.png', 'finance'); record('刷新与原生菜单交互', 'PASS', `${reloadHelp.labels.length} Help and ${reloadFinance.labels.length} Finance card/entry labels remain translated after reload; three native submenu expanders still work`);
  }
  record('JS 错误与操作范围', pageErrors ? 'FAIL' : 'PASS', `${pageErrors} page errors; 0 money operations; 0 AI sends; no finance body navigation`);
  report.totalDistinctLabels = new Set(report.menus.flatMap(menu => menu.labels)).size; report.headerCapturedLabels = 32; report.datePrefixesAbsent = [...new Set(report.menus.flatMap(menu => menu.optionalAbsent))];
  report.status = report.results.every(result => result.status === 'PASS') ? 'PASS' : 'FAIL'; report.attempts.push({ timestamp: new Date().toISOString(), status: report.status, labels: report.totalDistinctLabels }); save();
  if (popup && !popup.isClosed()) await popup.close(); popup = null;
  console.log(`HEADER_RUN_COMPLETE ${report.status}; labels=${report.totalDistinctLabels}/32; dedicated browser retained until finish.`);
}
async function controlLoop() {
  while (true) {
    const options = await hiddenJSON('WAITING_HEADER_CONTROL_JSON: run verifies real Help/Finance menus; inspect saves a masked screenshot; inspect-auth reads safe login diagnostics; inspect-proof reads counts/static IDs only; finish explicitly closes this test browser.');
    if (options.action === 'finish') { console.log('EXPLICIT_FINISH: closing dedicated header test browser and deleting temporary profile'); return; }
    try {
      if (options.action === 'inspect') { condition(secureURL(), 'Inspection requires real demo advertiser login'); await screenshot('current-header.png'); console.log('HEADER_INSPECT_SAVED'); continue; }
      if (options.action === 'inspect-auth') { await authenticationDiagnostic(); save(); continue; }
      if (options.action === 'inspect-proof') { condition(secureURL(), 'Proof inspection requires the authenticated test page'); await inspectProof(); continue; }
      condition(['run', 'retry'].includes(options.action), 'Unknown header control action'); await run(options);
    } catch (error) { record('实网菜单执行', 'FAIL', `${error.safeMessage || 'Browser operation failed; private error detail omitted'}; phase=${phase}; errorType=${error.name || 'Error'}`); report.status = 'FAIL'; save(); console.log('HEADER_BROWSER_RETAINED_AFTER_FAILURE; no automatic credential retry, close or reload'); }
  }
}
try {
  context = await chromium.launchPersistentContext(profile, { executablePath: chromium.executablePath(), channel: 'chromium', headless: false, viewport: { width: 1440, height: 1000 }, args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`] });
  page = context.pages()[0] || await context.newPage(); page.setDefaultTimeout(10000); page.on('pageerror', () => { if (report.authenticated) pageErrors++; });
  progress('opening-dashboard-login'); await page.goto(loginTarget, { waitUntil: 'domcontentloaded', timeout: 45000 });
  if (!secureURL() && manualLogin) {
    progress('waiting-for-human-login-no-credential-read'); console.log('MANUAL_LOGIN_READY: login in the dedicated browser; inspect-auth is available now; no credential read or automatic retry');
    await authenticationDiagnostic(); save(); await controlLoop();
  } else {
  if (!secureURL()) {
    const credentials = await hiddenJSON('WAITING_AUTH_JSON: one username/password JSON line, terminal echo disabled, one login attempt, no credentials saved.');
    condition(typeof credentials.username === 'string' && typeof credentials.password === 'string', 'Hidden credential JSON requires username/password'); secrets = [credentials.username, credentials.password];
    if (!secureURL()) {
      progress('waiting-username'); const username = page.locator('input[name="j_username"]'); await username.waitFor({ state: 'visible', timeout: 60000 }); await username.fill(credentials.username); await page.getByRole('button', { name: 'Continue', exact: true }).click();
      progress('waiting-password'); const password = page.locator('input[type="password"]'); await password.waitFor({ state: 'visible', timeout: 30000 }); await password.fill(credentials.password); await page.getByRole('button', { name: /^(Sign in|Log in|Login|Continue)$/iu }).click(); progress('single-login-submitted');
    }
    credentials.username = ''; credentials.password = '';
  }
  await page.waitForURL(url => url.hostname === 'demo.impact.com' && url.pathname.startsWith(capture.path), { waitUntil: 'domcontentloaded', timeout: 90000 }); report.authenticated = true;
  progress('opening-captured-partner-page'); await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 45000 });
  progress('authenticated-header-ready'); await ready(); report.currentPage = safeURL(page.url()); record('真实登录', 'PASS', 'Authenticated real demo advertiser page; no credential export'); save();
  console.log('HEADER_AUTHENTICATED_READY: browser remains open; waiting for run'); await controlLoop();
  }
} catch (error) {
  await authenticationDiagnostic().catch(() => { report.authDiagnostic = { phase, unavailable: true, valuesRead: false }; });
  record('实网启动或登录', 'BLOCKED', `${error.safeMessage || 'Real startup/login blocked; private error detail omitted'}; phase=${phase}; errorType=${error.name || 'Error'}`); report.status = 'BLOCKED'; save();
  if (context && page && !page.isClosed()) { console.log('HEADER_BROWSER_RETAINED; no automatic login retry'); await controlLoop(); }
} finally { if (process.stdin.isTTY) process.stdin.setRawMode(false); if (context) await context.close(); rmSync(profile, { recursive: true, force: true }); secrets = []; }
process.exitCode = report.status === 'PASS' ? 0 : 2;

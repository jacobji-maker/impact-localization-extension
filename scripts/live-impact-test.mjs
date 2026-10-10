/** Real network acceptance: no routes, fixtures, saved auth state, or credential logs. */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync, existsSync, renameSync } from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core'))); }
const target = process.argv.find(argument => argument.startsWith('--target='))?.slice(9) || 'https://demo.impact.com/secure/advertiser/engage/aview.ihtml?t=u';
if (new URL(target).hostname !== 'demo.impact.com' || new URL(target).protocol !== 'https:') throw new Error('Live target must be the authorized demo.impact.com HTTPS page');
const manualLogin = process.argv.includes('--manual-login');
const extensionPath = path.join(root, 'impact-cn-mod');
const artifacts = path.join(root, 'artifacts', 'live');
mkdirSync(artifacts, { recursive: true });
const profile = mkdtempSync(path.join(os.tmpdir(), 'impact-live-browser-'));
const report = { status: 'BLOCKED', mode: 'REAL_NETWORK', target, extensionVersion: JSON.parse(readFileSync(path.join(extensionPath, 'manifest.json'), 'utf8')).version, routesOrFixtures: false, requestsToDemo: 0, results: [], history: [], authenticated: false };
try { const previous = JSON.parse(readFileSync(path.join(artifacts, 'real-test-report.json'), 'utf8')); report.history = [...(previous.history || []), { date: previous.date, status: previous.status, results: previous.results || [], authDiagnostic: previous.authDiagnostic }]; } catch { /* First real run. */ }
let context;
let page;
let secrets = [];
let errors = 0;
let authPhase = 'browser-start';
let operationPhase = 'browser-start';
function operationProgress(phase) { operationPhase = phase; console.log(`LIVE_PHASE ${phase}`); }
function authProgress(phase) { authPhase = phase; console.log(`AUTH_PHASE ${phase}`); }
function redactObject(value, key) {
  if (typeof value === 'string') {
    const sanitized = redact(value);
    return ['text', 'source', 'target', 'original', 'translated'].includes(key) ? sanitized.replace(/^(\s*(?:Welcome\s+Back\s*,|欢迎回来[，,])\s*)(.+)$/iu, '$1<display-name>') : sanitized;
  }
  if (Array.isArray(value)) return value.map(item => redactObject(item, key));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([childKey, item]) => [childKey, redactObject(item, childKey)]));
  return value;
}
async function authenticationDiagnostic() {
  if (!page || page.isClosed()) return { phase: authPhase, browserClosed: true };
  const context = await page.evaluate(() => {
    const visible = element => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden';
    return {
      title: document.title,
      fields: [...document.querySelectorAll('input')].filter(visible).map(element => ({ type: element.getAttribute('type'), id: element.id, name: element.getAttribute('name') })),
      buttons: [...document.querySelectorAll('button,input[type=submit]')].filter(visible).map(element => ({ tag: element.tagName, type: element.getAttribute('type'), text: element.tagName === 'INPUT' ? '[submit input]' : element.textContent.trim().slice(0, 100) })),
      errors: [...document.querySelectorAll('[role=alert],.error-message,.errorMessage,.invalid-feedback,.form-error,[data-testid*=error]')].filter(visible).map(element => element.textContent.trim().slice(0, 300)).filter(Boolean).slice(0, 5)
    };
  }).catch(() => ({ pageContextUnavailable: true }));
  return redactObject({ phase: authPhase, url: safeURL(page.url()), ...context });
}
function redact(value) {
  let text = String(value ?? '');
  for (const secret of secrets) if (secret) text = text.split(secret).join('[REDACTED]');
  text = text.replace(/[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}/gu, '<email>');
  return text;
}
function safeURL(value) { try { const u = new URL(value); return u.origin + u.pathname; } catch { return ''; } }
function record(name, status, evidence) { const result = { name, status, evidence: redact(evidence) }; report.results.push(result); console.log(`${status} ${name}: ${redact(evidence)}`); return result; }
const CHECK_NAMES = { site: '真实站点与扩展隔离世界', sidebar: '四个真实产品侧栏与子菜单汉化', dom: 'Dashboard 文本翻译保留原 DOM 与数值', residuals: '正式汉化范围内的长英文句残留', date: '真实 Dashboard 原生动态控件', ai: '真实 Ask Impact 控件与 AI 回答中的官方文档' };
function selectedChecks(options) {
  const explicit = options.onlyChecks ?? options.onlyCheck ?? options.checks;
  let selected = explicit === undefined ? Object.keys(CHECK_NAMES).filter(id => id !== 'sidebar' || options.verifySidebar) : Array.isArray(explicit) ? explicit : [explicit];
  selected = selected.map(name => Object.hasOwn(CHECK_NAMES, name) ? name : Object.keys(CHECK_NAMES).find(id => CHECK_NAMES[id] === name));
  requireCondition(selected.every(Boolean), 'Unknown live check filter; use site, sidebar, dom, residuals, date or ai', true);
  if (options.skipAI) selected = selected.filter(id => id !== 'ai');
  selected = [...new Set(selected)];
  requireCondition(selected.length > 0, 'No live checks were selected', true);
  return selected;
}
function prepareCurrentAIEvidence(options, selected) {
  if (!selected.includes('ai')) {
    let existingEvidence; try { existingEvidence = JSON.parse(readFileSync(path.join(artifacts, 'real-ai-links.json'), 'utf8')); } catch { /* No previous evidence. */ }
    report.aiEvidence = existingEvidence ? { ...existingEvidence, isCurrent: existingEvidence.extensionVersion === report.extensionVersion && existingEvidence.status === 'PASS', checkRanThisRun: false } : { isCurrent: false, status: 'NOT_SELECTED', extensionVersion: report.extensionVersion, checkRanThisRun: false, fullConversationSaved: false };
    return;
  }
  const names = ['real-ai-links.json', 'real-ai-diagnostics.json', 'real-native-ai.png', 'real-native-ai-helpdoc.png'];
  const existing = names.filter(name => existsSync(path.join(artifacts, name)));
  const stamp = new Date().toISOString().replace(/[:.]/gu, '-');
  const folder = path.join(artifacts, 'historical', `before-run-${report.attempt}-${stamp}`);
  const archived = [];
  if (existing.length) {
    mkdirSync(folder, { recursive: true });
    for (const name of existing) { renameSync(path.join(artifacts, name), path.join(folder, name)); archived.push(path.relative(root, path.join(folder, name))); }
    writeFileSync(path.join(folder, 'ARCHIVE_INFO.json'), JSON.stringify({ isCurrent: false, archivedAt: new Date().toISOString(), reason: 'Evidence from a previous or unattributed run; it must not be used for the current check', files: archived }, null, 2));
  }
  report.aiEvidence = { isCurrent: true, status: 'PENDING', extensionVersion: report.extensionVersion, selectedTopicId: options.topicId || 'actions', attempt: report.attempt, checkRanThisRun: true, priorEvidenceArchived: archived, fullConversationSaved: false };
  writeFileSync(path.join(artifacts, 'real-ai-links.json'), JSON.stringify(report.aiEvidence, null, 2));
}
function saveReport() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map(p => [p.type, p.value]));
  report.date = `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
  writeFileSync(path.join(artifacts, 'real-test-report.json'), JSON.stringify(report, null, 2));
  const scope = report.runScope ? `\n本轮范围：${report.runScope.selectedChecks.join('、')}。${report.runScope.completeAcceptance ? '包含完整检查范围。' : '这是部分复核，不能代表完整范围验收通过。'}\n` : '';
  writeFileSync(path.join(root, 'live-test-report.md'), `# demo.impact.com 实网验收\n\n结果：**${report.status}**\n\n时间：${report.date}（Asia/Seoul）\n\n模式：真实网络访问，未使用请求路由、本地页面或模拟 AI 回复。\n${scope}\n${report.results.map(r => `- **${r.status}** ${r.name}：${r.evidence}`).join('\n')}\n\n本报告与旧版本地 fixture 的 test-report.md 相互独立。未完成的项不能视为 PASS。未保存凭据、cookie 导出或 storageState。\n`);
}
function hiddenJSON(prompt) {
  console.log(prompt);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  process.stdin.resume();
  return new Promise((resolve, reject) => {
    let data = '';
    const accept = chunk => {
      data += chunk.toString('utf8');
      if (data.includes('\u0003')) { cleanup(); reject(new Error('Input cancelled')); return; }
      if (data.length > 32768) { cleanup(); reject(new Error('Input too large')); return; }
      if (!/[\r\n]/.test(data)) return;
      cleanup();
      try { resolve(JSON.parse(data.split(/[\r\n]/)[0])); } catch { reject(new Error('Expected one JSON line; input content was not logged')); }
      data = '';
    };
    const cleanup = () => { process.stdin.off('data', accept); if (process.stdin.isTTY) process.stdin.setRawMode(false); process.stdin.pause(); };
    process.stdin.on('data', accept);
  });
}
async function screenshot(name, options = {}) {
  // Never screenshot authentication. Mask every input/editor and credential-bearing text.
  if (!report.authenticated) return;
  const masked = await page.evaluate(secretValues => {
    const nodes = [];
    function visit(container) {
      for (const element of container.querySelectorAll('*')) {
        if (!element.children.length && (secretValues.some(s => s && element.textContent.includes(s)) || /[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}/u.test(element.textContent))) { element.setAttribute('data-impact-audit-private', ''); nodes.push(element); }
        if (element.shadowRoot) visit(element.shadowRoot);
      }
    }
    visit(document); return nodes.length;
  }, secrets);
  const masks = [page.locator('input:not([type="checkbox"]):not([type="radio"]),textarea,[contenteditable],[data-impact-audit-private]')];
  if (options.maskNativeAI) masks.push(page.locator('#ask-impact-shadow-host'));
  await page.screenshot({ path: path.join(artifacts, name), fullPage: false, mask: masks });
  if (masked) await page.locator('[data-impact-audit-private]').evaluateAll(nodes => nodes.forEach(n => n.removeAttribute('data-impact-audit-private')));
}
async function scan() {
  const dom = await page.evaluate(() => {
    const text = []; const roots = []; const inputs = []; const buttons = [];
    function composedClosest(element, selector) {
      let current = element;
      while (current) {
        if (current.closest(selector)) return true;
        const root = current.getRootNode(); current = root instanceof ShadowRoot ? root.host : null;
      }
      return false;
    }
    function visit(container, label) {
      roots.push(label);
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        const element = node.parentElement;
        if (!element || composedClosest(element, 'script,style,noscript,input,textarea,[contenteditable],#impact-cn-assistant,[data-impact-cn-ignore],#ask-impact-shadow-host,#ask-impact-app,.partner-name,.avatar-container,.account-btn,.profileBtn,[data-impact-user-content]')) continue;
        const value = node.nodeValue.trim();
        if (value && element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden') text.push({ text: value, tag: element.tagName, id: element.id, root: label });
      }
      for (const element of container.querySelectorAll('*')) {
        if (element.shadowRoot) visit(element.shadowRoot, `${label} > ${element.tagName.toLowerCase()}${element.id ? '#' + element.id : ''}::shadow`);
        if (!element.getClientRects().length) continue;
        if (element.matches('input,textarea,[contenteditable]')) inputs.push({ tag: element.tagName, type: element.getAttribute('type'), id: element.id, name: element.getAttribute('name'), placeholder: element.getAttribute('placeholder'), ariaLabel: element.getAttribute('aria-label'), root: label });
        if (element.matches('button,[role=button]') && !composedClosest(element, '#ask-impact-shadow-host,#ask-impact-app,.partner-name,.avatar-container,.account-btn,.profileBtn,[data-impact-user-content]')) buttons.push({ tag: element.tagName, id: element.id, text: element.textContent.trim().slice(0, 150), ariaLabel: element.getAttribute('aria-label'), root: label });
      }
    }
    visit(document, 'document');
    return { url: location.origin + location.pathname, title: document.title, roots, text, inputs, buttons };
  });
  const safe = redactObject(dom);
  writeFileSync(path.join(artifacts, 'real-dom-scan.json'), JSON.stringify(safe, null, 2));
  console.log(`LIVE_DOM_SCAN ${safe.text.length} visible text nodes; ${safe.roots.length} open roots; file artifacts/live/real-dom-scan.json`);
  return safe;
}
function installSafeAITimeline() {
  window.__impactLiveAITimelineCleanup?.();
  const status = document.querySelector('#impact-cn-assistant .impact-cn-status');
  const start = performance.now();
  const timeline = { maxEvents: 200, droppedEvents: 0, privateInputsRead: false, conversationTextRead: false, events: [] };
  const roots = new Map();
  const collect = (container, selector, elements = []) => {
    if (!container) return elements;
    elements.push(...container.querySelectorAll(selector));
    for (const element of container.querySelectorAll('*')) if (element.shadowRoot) collect(element.shadowRoot, selector, elements);
    return elements;
  };
  const visible = element => {
    const rect = element.getBoundingClientRect(); const style = getComputedStyle(element);
    if (rect.width <= 0 || rect.height <= 0 || rect.right <= 0 || rect.bottom <= 0 || rect.left >= innerWidth || rect.top >= innerHeight || style.visibility !== 'visible') return false;
    for (let current = element; current;) {
      const computed = getComputedStyle(current);
      if (current.hidden || current.hasAttribute('inert') || current.getAttribute('aria-hidden') === 'true' || computed.display === 'none' || Number(computed.opacity) === 0) return false;
      if (current.parentElement) current = current.parentElement;
      else { const root = current.getRootNode(); current = root instanceof ShadowRoot ? root.host : null; }
    }
    return true;
  };
  const summarize = elements => ({ count: elements.length, visibleCount: elements.filter(visible).length, disabledCount: elements.filter(element => element.disabled || element.getAttribute('aria-disabled') === 'true').length, readOnlyCount: elements.filter(element => element.readOnly).length });
  const snapshot = () => {
    const nativeRoot = document.querySelector('#ask-impact-shadow-host')?.shadowRoot;
    const rawStatus = status?.textContent.trim() || '';
    return { documentHasFocus: document.hasFocus(), documentVisible: document.visibilityState === 'visible', statusType: status?.dataset.type || '', statusText: /^(?:AI辅助|AI 输入框|未找到该功能|暂未找到可用的 Ask Impact|选中的 AI 控件|页面 AI|该问题缺少|帮助链接需要|问题已填入|已触发页面 AI|无法发送问题|精细翻译|页面开关|未加载汉化词典)/u.test(rawStatus) ? rawStatus : rawStatus ? '[Non-static extension status omitted]' : '', editor: summarize(collect(nativeRoot, 'textarea[placeholder="ask impact..."]')), send: summarize(collect(nativeRoot, 'button[aria-label="Send"]')), opener: summarize(collect(document, 'button[aria-label="Open Ask Impact"]')), close: summarize(collect(nativeRoot, 'button[title="Close"]')) };
  };
  const append = (type, category = 'other', phase = 'observer', isTrusted = null, mutationTypes) => {
    const state = snapshot();
    const isObserver = phase === 'observer';
    if (isObserver && timeline.events.length && JSON.stringify(timeline.events.at(-1).state) === JSON.stringify(state)) return;
    if (timeline.events.length >= timeline.maxEvents) { timeline.droppedEvents++; return; }
    timeline.events.push({ timeMs: Math.round(performance.now() - start), type, category, phase, isTrusted, ...(mutationTypes ? { mutationTypes } : {}), state });
  };
  const category = event => {
    const path = event.composedPath().filter(node => node instanceof Element);
    if (path.some(node => node.matches('[data-impact-cn-help]'))) return 'help';
    if (path.some(node => node.matches('button[aria-label="Open Ask Impact"]'))) return 'native-opener';
    if (path.some(node => node.matches('textarea[placeholder="ask impact..."]'))) return 'editor';
    if (path.some(node => node.matches('button[aria-label="Send"]'))) return 'send';
    if (path.some(node => node.matches('button[title="Close"]'))) return 'close';
    return 'other';
  };
  const captureEvent = event => append(event.type, category(event), 'capture', event.isTrusted);
  const bubbleEvent = event => append(event.type, category(event), 'bubble', event.isTrusted);
  const eventTypes = ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'click', 'focusin', 'focusout', 'input', 'change'];
  for (const type of eventTypes) { document.addEventListener(type, captureEvent, true); document.addEventListener(type, bubbleEvent, false); }
  const discover = () => {
    const visit = root => {
      if (!root) return;
      if (!roots.has(root)) {
        const observer = new MutationObserver(records => { append('native-mutation', 'other', 'observer', null, [...new Set(records.map(record => record.type === 'attributes' ? `attribute:${record.attributeName}` : record.type))]); discover(); });
        observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class', 'hidden', 'inert', 'aria-hidden', 'disabled', 'readonly'] }); roots.set(root, observer);
      }
      for (const element of root.querySelectorAll('*')) if (element.shadowRoot) visit(element.shadowRoot);
    };
    const nativeHost = document.querySelector('#ask-impact-shadow-host');
    visit(nativeHost); visit(nativeHost?.shadowRoot);
  };
  const discoveryObserver = new MutationObserver(discover);
  discoveryObserver.observe(document.body, { childList: true, subtree: true });
  const discoveryInterval = setInterval(discover, 150);
  discover(); append('observation-installed');
  const statusObserver = new MutationObserver(() => append('plugin-status-mutation'));
  if (status) statusObserver.observe(status, { attributes: true, childList: true, subtree: true, characterData: true });
  const windowBlur = event => append('window-blur', 'other', 'window', event.isTrusted);
  const windowFocus = event => append('window-focus', 'other', 'window', event.isTrusted);
  window.addEventListener('blur', windowBlur); window.addEventListener('focus', windowFocus);
  window.__impactLiveAITimeline = timeline;
  let stopped = false;
  window.__impactLiveAITimelineCleanup = () => {
    if (stopped) return; stopped = true; append('observation-stopped');
    statusObserver.disconnect(); discoveryObserver.disconnect(); clearInterval(discoveryInterval);
    for (const rootObserver of roots.values()) rootObserver.disconnect();
    for (const type of eventTypes) { document.removeEventListener(type, captureEvent, true); document.removeEventListener(type, bubbleEvent, false); }
    window.removeEventListener('blur', windowBlur); window.removeEventListener('focus', windowFocus);
  };
}
// Serializable, read-only geometry: never accesses editor values or messages.
function safeControlGeometry() {
    const meta = element => {
      if (!element) return null;
      const rect = element.getBoundingClientRect(); const style = getComputedStyle(element);
      const ancestors = []; const rejectionFactors = [];
      if (rect.width <= 0 || rect.height <= 0) rejectionFactors.push('zero-size');
      const inViewport = rect.right > 0 && rect.bottom > 0 && rect.left < innerWidth && rect.top < innerHeight;
      if (!inViewport) rejectionFactors.push('outside-viewport');
      for (let current = element; current;) {
        const computed = getComputedStyle(current); const reasons = [];
        if (current.hidden) reasons.push('hidden');
        if (current.hasAttribute('inert')) reasons.push('inert');
        if (current.getAttribute('aria-hidden') === 'true') reasons.push('aria-hidden');
        if (computed.display === 'none') reasons.push('display-none');
        if (current === element && (computed.visibility === 'hidden' || computed.visibility === 'collapse')) reasons.push(`visibility-${computed.visibility}`);
        if (Number(computed.opacity) === 0) reasons.push('opacity-zero');
        ancestors.push({ tag: current.tagName, className: typeof current.className === 'string' ? current.className : '', style: { display: computed.display, visibility: computed.visibility, opacity: computed.opacity, transform: computed.transform }, rejectionFactors: reasons });
        for (const reason of reasons) rejectionFactors.push(`${current.tagName.toLowerCase()}:${reason}`);
        if (current.parentElement) current = current.parentElement;
        else { const root = current.getRootNode(); current = root instanceof ShadowRoot ? root.host : null; }
      }
      return { tag: element.tagName, className: typeof element.className === 'string' ? element.className : '', rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }, visibleByCSS: rect.width > 0 && rect.height > 0 && !rejectionFactors.some(reason => reason !== 'outside-viewport'), inViewport, eligibleByGeometry: rejectionFactors.length === 0, rejectionFactors, ancestors, style: { display: style.display, visibility: style.visibility, opacity: style.opacity, transform: style.transform }, disabled: Boolean(element.disabled), readOnly: Boolean(element.readOnly), ariaDisabled: element.getAttribute('aria-disabled') };
    };
    const publicLabel = element => {
      const texts = []; const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT); let node;
      while ((node = walker.nextNode())) { if (!node.parentElement?.closest('[data-impact-cn-ignore],script,style,svg,i')) { const text = node.nodeValue.trim().replace(/\s+/gu, ' '); if (text) texts.push(text); } }
      return texts.join(' ');
    };
    const collect = (container, selector, rootPath = 'document', items = []) => {
      if (!container) return items;
      for (const element of container.querySelectorAll(selector)) items.push({ element, rootPath });
      for (const element of container.querySelectorAll('*')) if (element.shadowRoot) collect(element.shadowRoot, selector, `${rootPath} > ${element.tagName.toLowerCase()}${element.id === 'ask-impact-shadow-host' ? '#ask-impact-shadow-host' : ''}::shadow`, items);
      return items;
    };
    const candidateMetadata = items => items.map(({ element, rootPath }) => ({ ...meta(element), rootPath, ariaLabel: element.getAttribute('aria-label'), title: element.getAttribute('title') }));
    const nav = document.querySelector('#adv-navigation impact-style-isolator'); const navRoot = nav?.shadowRoot;
    const assistant = document.querySelector('#impact-cn-assistant'); const nativeHost = document.querySelector('#ask-impact-shadow-host'); const nativeRoot = nativeHost?.shadowRoot;
    const editorCandidates = candidateMetadata(collect(nativeRoot, 'textarea[placeholder="ask impact..."]', 'ask-impact::shadow'));
    const sendCandidates = candidateMetadata(collect(nativeRoot, 'button[aria-label="Send"]', 'ask-impact::shadow'));
    const closeCandidates = candidateMetadata(collect(nativeRoot, 'button[title="Close"]', 'ask-impact::shadow'));
    const openerCandidates = candidateMetadata(collect(document, 'button[aria-label="Open Ask Impact"]'));
    const buttons = candidateMetadata(collect(nativeRoot, 'button', 'ask-impact::shadow'));
    const first = candidates => candidates.find(candidate => candidate.eligibleByGeometry) || candidates[0] || null;
    const status = document.querySelector('#impact-cn-assistant .impact-cn-status'); const rawStatus = status?.textContent.trim() || '';
    const statusText = /^(?:AI辅助|AI 输入框|未找到该功能|暂未找到可用的 Ask Impact|选中的 AI 控件|页面 AI|该问题缺少|帮助链接需要|问题已填入|已触发页面 AI|无法发送问题|精细翻译|页面开关|未加载汉化词典)/u.test(rawStatus) ? rawStatus : rawStatus ? '[Non-static extension status omitted]' : '';
    const proof = window.__impactLiveAIProof;
    return {
      url: location.origin + location.pathname,
      viewport: { innerWidth, innerHeight },
      nav: { host: meta(nav), shadowRootOpen: Boolean(navRoot), products: [...(navRoot?.querySelectorAll('.product-item') || [])].map(element => ({ ...meta(element), label: element.querySelector('.product-name') ? publicLabel(element.querySelector('.product-name')) : '[expander]', selected: element.classList.contains('selected'), expanded: element.classList.contains('expanded') })), labels: [...(navRoot?.querySelectorAll('.subitem-label,.child-menu-content a,.child-menu-content span,.subchild-label a') || [])].map(element => ({ ...meta(element), label: publicLabel(element), kind: element.closest('.subchild-label') ? 'nested' : element.closest('.child-menu-content') ? 'child' : 'main' })), questions: [...(navRoot?.querySelectorAll('[data-impact-cn-help]') || [])].map(element => ({ ...meta(element), entryId: element.dataset.entryId, topicId: element.dataset.topicId })) },
      assistant: { ...meta(assistant), enabled: assistant?.dataset.enabled, aiEnabled: assistant?.dataset.aiEnabled, aiActive: assistant?.dataset.aiActive, panel: meta(document.querySelector('#impact-cn-assistant-panel')), statusType: status?.dataset.type, statusText, version: document.querySelector('#impact-cn-assistant .impact-cn-panel-version')?.textContent.trim() },
      nativeAI: { shadowRootOpen: Boolean(nativeRoot), opener: first(openerCandidates), editor: first(editorCandidates), close: first(closeCandidates), send: first(sendCandidates), editorCandidates, sendCandidates, openerCandidates, closeCandidates, buttons },
      proof: proof ? { ownClick: Boolean(proof.ownClick), inlineClicks: Number(proof.inlineClicks || 0), autoSends: Number(proof.autoSends || 0), successObserved: Boolean(proof.successObserved), interference: Boolean(proof.interference) } : null,
      eventTimeline: window.__impactLiveAITimeline || null,
      privateInputsRead: false, conversationTextRead: false
    };
}
async function inspectControls() {
  requireCondition(report.authenticated, 'Inspection requires the authenticated page; no login inputs will be inspected', true);
  operationProgress('readonly-control-inspection');
  const state = await page.evaluate(safeControlGeometry);
  const safe = redactObject(state);
  writeFileSync(path.join(artifacts, 'real-control-inspection.json'), JSON.stringify(safe, null, 2));
  await screenshot('real-inspect-controls.png', { maskNativeAI: true });
  const sidebar = page.locator('#adv-navigation');
  if (await sidebar.count() === 1 && await sidebar.isVisible()) await sidebar.screenshot({ path: path.join(artifacts, 'real-inspect-sidebar.png') });
  const compact = items => items.map(item => ({ tag: item.tag, rootPath: item.rootPath, ariaLabel: item.ariaLabel, title: item.title, rect: item.rect, disabled: item.disabled, readOnly: item.readOnly, eligibleByGeometry: item.eligibleByGeometry, rejectionFactors: item.rejectionFactors }));
  console.log(`LIVE_CONTROL_INSPECTION ${JSON.stringify({ viewport: safe.viewport, nav: { shadowRootOpen: safe.nav.shadowRootOpen, products: safe.nav.products.map(item => ({ label: item.label, selected: item.selected, expanded: item.expanded })), visibleLabels: safe.nav.labels.filter(item => item.eligibleByGeometry).length, questionCount: safe.nav.questions.length }, assistant: { enabled: safe.assistant.enabled, aiEnabled: safe.assistant.aiEnabled, aiActive: safe.assistant.aiActive, statusType: safe.assistant.statusType, statusText: safe.assistant.statusText }, nativeAI: { editorCandidates: compact(safe.nativeAI.editorCandidates), sendCandidates: compact(safe.nativeAI.sendCandidates), openerCandidates: compact(safe.nativeAI.openerCandidates), closeCandidates: compact(safe.nativeAI.closeCandidates), buttons: compact(safe.nativeAI.buttons) }, proof: safe.proof })}`);
  return safe;
}
async function saveAIFailure(error) {
  const controls = await page.evaluate(safeControlGeometry).catch(() => null);
  const diagnosis = redactObject({ isCurrent: true, status: error.blocked ? 'BLOCKED' : 'FAIL', extensionVersion: report.extensionVersion, selectedTopicId: report.aiEvidence?.selectedTopicId, attempt: report.attempt, failure: safeFailure(error), viewport: controls?.viewport, statusType: controls?.assistant.statusType, statusText: controls?.assistant.statusText, proof: controls?.proof, nativeAI: controls?.nativeAI, eventTimeline: controls?.eventTimeline, privateInputsRead: false, conversationTextRead: false });
  writeFileSync(path.join(artifacts, 'real-ai-diagnostics.json'), JSON.stringify(diagnosis, null, 2));
  return diagnosis;
}
async function test(name, action, kind) {
  operationProgress(name);
  try { const evidence = await action(); return record(name, 'PASS', evidence); }
  catch (error) {
    const diagnosis = kind === 'ai' ? await saveAIFailure(error) : null;
    return record(name, error.blocked ? 'BLOCKED' : 'FAIL', `${error.safeMessage || 'Browser check failed; sensitive browser error was suppressed'}; phase=${error.originalOperationPhase || operationPhase}; errorType=${error.name || 'Error'}${diagnosis ? `; statusType=${diagnosis.statusType || 'none'}; statusText=${diagnosis.statusText || 'none'}; safe proof in real-ai-diagnostics.json` : ''}`);
  }
}
function requireCondition(value, message, blocked = false) { if (!value) { const e = new Error(message); e.safeMessage = message; e.blocked = blocked; throw e; } }
function safeFailure(error) { return { phase: error.originalOperationPhase || operationPhase, errorType: error.name || 'Error', message: error.safeMessage || 'Browser operation failed; sensitive detail suppressed', blocked: Boolean(error.blocked) }; }
async function panel(open) {
  const hidden = await page.locator('#impact-cn-assistant-panel').isHidden();
  if (hidden === open) await page.locator('#impact-cn-assistant .impact-cn-launcher').click();
}
async function closeNativeAI() {
  operationProgress('closing-native-ai-with-native-opener-evidence');
  const opener = page.locator('button[aria-label="Open Ask Impact"]:visible');
  const close = page.locator('#ask-impact-shadow-host button[title="Close"]:visible');
  if (!await opener.count()) {
    requireCondition(await close.count() === 1, 'Native AI is neither confirmed closed nor has a unique visible close control', true);
    await close.click();
  }
  await opener.waitFor({ state: 'visible', timeout: 15000 });
  requireCondition(await opener.count() === 1, 'Native AI close did not expose one visible native opener', true);
  operationProgress('waiting-for-closing-native-editor-to-disappear-or-become-invisible');
  await page.waitForFunction(() => {
    const editors = [];
    const visit = root => {
      if (!root) return;
      editors.push(...root.querySelectorAll('textarea[placeholder="ask impact..."]'));
      for (const element of root.querySelectorAll('*')) if (element.shadowRoot) visit(element.shadowRoot);
    };
    visit(document.querySelector('#ask-impact-shadow-host')?.shadowRoot);
    const visible = element => {
      const rect = element.getBoundingClientRect(); const style = getComputedStyle(element);
      if (rect.width <= 0 || rect.height <= 0 || rect.right <= 0 || rect.bottom <= 0 || rect.left >= innerWidth || rect.top >= innerHeight || style.visibility !== 'visible') return false;
      for (let current = element; current;) {
        const computed = getComputedStyle(current);
        if (current.hidden || current.hasAttribute('inert') || current.getAttribute('aria-hidden') === 'true' || computed.display === 'none' || Number(computed.opacity) === 0) return false;
        if (current.parentElement) current = current.parentElement;
        else { const root = current.getRootNode(); current = root instanceof ShadowRoot ? root.host : null; }
      }
      return true;
    };
    return editors.every(element => !visible(element));
  }, null, { timeout: 15000 });
  requireCondition(await opener.count() === 1 && await opener.isVisible(), 'Native opener stopped being visible before the closing editor settled', true);
  return { nativeOpenerVisible: true, nativeEditorInvisibleOrAbsent: true, assistantAIActive: await page.locator('#impact-cn-assistant').getAttribute('data-ai-active') };
}
async function waitForNativeAIEditor() {
  const input = page.locator('#ask-impact-shadow-host textarea[placeholder="ask impact..."]');
  await input.waitFor({ state: 'visible', timeout: 15000 });
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    const available = await input.evaluate(element => {
      const rect = element.getBoundingClientRect(); const style = getComputedStyle(element);
      if (rect.width <= 0 || rect.height <= 0 || rect.right <= 0 || rect.bottom <= 0 || rect.left >= innerWidth || rect.top >= innerHeight || style.visibility !== 'visible') return false;
      for (let current = element; current;) {
        const computed = getComputedStyle(current);
        if (current.hidden || current.hasAttribute('inert') || current.getAttribute('aria-hidden') === 'true' || computed.display === 'none' || Number(computed.opacity) === 0) return false;
        if (current.parentElement) current = current.parentElement;
        else { const root = current.getRootNode(); current = root instanceof ShadowRoot ? root.host : null; }
      }
      return true;
    });
    if (available) return;
    await page.waitForTimeout(150);
  }
  requireCondition(false, 'Native AI editor did not become visibly available in the viewport within 15 seconds');
}
async function waitForSnapshot() {
  operationProgress('waiting-for-six-visible-snapshot-metrics');
  const metrics = page.locator('snapshot-chart-shadow [class*="secondaryFieldLabel"]');
  const deadline = Date.now() + 45000;
  let previous = ''; let stable = 0;
  while (Date.now() < deadline) {
    const visible = [];
    for (const metric of await metrics.all()) if (await metric.isVisible()) visible.push((await metric.innerText()).trim());
    const current = visible.join('|');
    if (visible.length >= 6 && current === previous) stable++; else stable = 0;
    if (stable >= 2) return visible.length;
    previous = current; await page.waitForTimeout(300);
  }
  requireCondition(false, 'Six real snapshot metric labels did not become visible and stable within 45 seconds');
}
async function verifyCapturedSidebar(options) {
  const capture = JSON.parse(readFileSync(path.join(root, 'docs/sidebar-dom-scan.json'), 'utf8'));
  requireCondition(capture.mode === 'REAL_NETWORK_READ_ONLY' && capture.host === 'demo.impact.com' && capture.products.length === 4, 'The verified four-product sidebar capture is unavailable', true);
  const sandbox = {}; vm.createContext(sandbox); vm.runInContext(readFileSync(path.join(extensionPath, 'dict.js'), 'utf8'), sandbox);
  const dictionary = sandbox.IMPACT_CN_DICTIONARY;
  const selector = capture.selectors;
  const nav = page.locator('css:light=#adv-navigation impact-style-isolator');
  const inventory = { mode: 'REAL_NETWORK', captureFile: 'docs/sidebar-dom-scan.json', products: [], diagnostics: [], steps: [], routesOrFixtures: false };
  const step = phase => { operationProgress(phase); inventory.steps.push({ phase, url: safeURL(page.url()) }); };
  const normalize = text => text.trim().replace(/\s+/gu, ' ');
  const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function labelTag(source, context) {
    const explicit = context?.labelTags?.[source] || context?.labelKinds?.[source];
    if (explicit) return String(explicit).toLowerCase();
    // These two tag contexts were verified in the authenticated source capture.
    if (source === 'Performance' && context?.source === 'Campaign Manager') return 'a';
    if (source === 'Performance' && context?.source === 'Reports') return 'span';
    return undefined;
  }
  function expected(source, kind, context) {
    const pathname = new URL(page.url()).pathname;
    const candidates = dictionary.entries.filter(entry => [entry.source, ...(entry.aliases || [])].some(text => normalize(text) === normalize(source)) && entry.scope?.shadowHost === '#adv-navigation impact-style-isolator' && (!entry.scope.hosts || entry.scope.hosts.includes('demo.impact.com')) && (!entry.scope.path || pathname.startsWith(entry.scope.path)) && (!entry.scope.paths || entry.scope.paths.some(path => pathname.startsWith(path))));
    const tag = labelTag(source, context);
    const priority = entry => {
      const scope = entry.scope.selector || '';
      const childTags = [...scope.matchAll(/\.(?:child-menu-content|subchild-label)\s+(a|span)\b/gu)].map(match => match[1]);
      const tagScore = tag && childTags.length ? childTags.includes(tag) ? 10 : -100 : 0;
      if (kind === 'product') return scope.includes('.product-name') ? 3 : 0;
      if (kind === 'nested') return tagScore + (scope.includes('.subchild-label') ? 3 : scope.includes('.child-menu-content') ? 2 : 0);
      if (kind === 'child') return tagScore + (scope.includes('.child-menu-content') ? 3 : scope.includes('.subchild-label') ? 2 : 0);
      return scope.includes('.subitem-label') ? 3 : /child-menu-content|subchild-label/.test(scope) ? -1 : 1;
    };
    candidates.sort((a, b) => priority(b) - priority(a));
    requireCondition(candidates.length > 0, `Verified sidebar source has no scoped mapping: ${source}`);
    const best = candidates.filter(entry => priority(entry) === priority(candidates[0]));
    requireCondition(new Set(best.map(entry => entry.target)).size === 1, `Ambiguous sidebar source needs selector/tag context: ${source}`);
    return candidates[0];
  }
  async function waitForNavRoot(productSource) {
    step(`sidebar-${productSource.toLowerCase()}-waiting-open-nav-root`);
    await nav.waitFor({ state: 'attached', timeout: 15000 });
    await page.waitForFunction(() => Boolean(document.querySelector('#adv-navigation impact-style-isolator')?.shadowRoot?.querySelector('.product-item')), null, { timeout: 15000 });
  }
  async function waitForSelectedProduct(productSource, targetLabel) {
    step(`sidebar-${productSource.toLowerCase()}-waiting-attached-version`);
    // Version lives in the collapsible settings panel; attachment is the proof,
    // never visibility of that otherwise intentionally hidden panel content.
    await page.locator('#impact-cn-assistant .impact-cn-panel-version').waitFor({ state: 'attached', timeout: 30000 });
    step(`sidebar-${productSource.toLowerCase()}-waiting-selected-translated-product`);
    await page.waitForFunction(({ version, targetLabel }) => {
      const root = document.querySelector('#adv-navigation impact-style-isolator')?.shadowRoot;
      const selected = root?.querySelector('.product-item.selected .product-name');
      const panelVersion = document.querySelector('#impact-cn-assistant .impact-cn-panel-version');
      if (!root || !selected || !panelVersion?.textContent.includes(`v${version}`) || !selected.getClientRects().length) return false;
      const parts = []; const walker = document.createTreeWalker(selected, NodeFilter.SHOW_TEXT); let node;
      while ((node = walker.nextNode())) if (!node.parentElement?.closest('[data-impact-cn-ignore]')) parts.push(node.nodeValue);
      return parts.join('').trim().replace(/\s+/gu, ' ') === targetLabel && root.querySelectorAll('.subitem-label').length > 0;
    }, { version: report.extensionVersion, targetLabel }, { timeout: 30000 });
    let previous = ''; let stable = 0; const deadline = Date.now() + 10000;
    step(`sidebar-${productSource.toLowerCase()}-waiting-main-labels-stable`);
    while (Date.now() < deadline) {
      const current = (await visibleLabels(selector.mainLabel)).join('|');
      if (current && current === previous) stable++; else stable = 0;
      if (stable >= 2) return;
      previous = current; await page.waitForTimeout(200);
    }
    requireCondition(false, `Selected product main labels did not stabilize: ${productSource}`);
  }
  async function expandProducts(productSource) {
    step(`sidebar-${productSource.toLowerCase()}-product-expander`);
    const expander = nav.locator(selector.expander);
    await expander.waitFor({ state: 'visible', timeout: 15000 });
    requireCondition(await expander.count() === 1, 'Verified product expander is absent or ambiguous', true);
    if (!(await expander.getAttribute('class') || '').split(/\s/u).includes('expanded')) await expander.click();
    await page.waitForFunction(() => document.querySelector('#adv-navigation impact-style-isolator')?.shadowRoot?.querySelector('.product-item.expander')?.classList.contains('expanded'), null, { timeout: 15000 });
  }
  async function visibleLabels(labelSelector) {
    return nav.locator(labelSelector).evaluateAll(elements => {
      const labels = new Set();
      for (const element of elements) {
        if (!element.getClientRects().length || getComputedStyle(element).visibility !== 'visible') continue;
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT); let node;
        while ((node = walker.nextNode())) {
          const parent = node.parentElement;
          if (!parent || parent.closest('script,style,svg,i,[aria-hidden="true"],[data-impact-cn-ignore]') || !parent.getClientRects().length || getComputedStyle(parent).visibility !== 'visible') continue;
          const text = node.nodeValue.trim().replace(/\s+/gu, ' '); if (text) labels.add(text);
        }
      }
      return [...labels];
    });
  }
  async function verifyLabels(sources, labelSelector, kind, context) {
    const entries = sources.map(source => expected(source, kind, context));
    const targets = entries.map(entry => normalize(entry.target));
    let observed = []; const deadline = Date.now() + 12000;
    do { observed = await visibleLabels(labelSelector); if (targets.every(target => observed.includes(target))) break; await page.waitForTimeout(150); } while (Date.now() < deadline);
    const missing = targets.filter(target => !observed.includes(target));
    const allowedEnglish = [...targets.filter(target => !/[\u4e00-\u9fff]/u.test(target)), ...(options.sidebarEnglishAllowlist || [])];
    const unknownEnglish = observed.filter(text => /^[A-Za-z\d\s&.,:;!?()'"/+\-]+$/u.test(text) && /[A-Za-z]{2}/u.test(text) && !allowedEnglish.includes(text));
    const result = { phase: operationPhase, kind, contextSource: context?.source, sources, expected: targets, observed, missing, unknownEnglish, questionConcepts: [] };
    inventory.diagnostics.push(result);
    if (await page.locator('#impact-cn-assistant').getAttribute('data-ai-enabled') === 'true') {
      for (const entry of entries.filter(entry => entry.helpTopicId)) {
        const controls = nav.locator(`[data-impact-cn-help][data-entry-id="${entry.id}"][data-topic-id="${entry.helpTopicId}"]:visible`);
        const count = await controls.count(); result.questionConcepts.push({ id: entry.id, topicId: entry.helpTopicId, visibleCount: count });
        requireCondition(count > 0, `No visible inline question for verified sidebar concept: ${entry.id}`);
      }
    }
    requireCondition(!missing.length, `Captured sidebar labels did not become their scoped Chinese targets; missing=${missing.join(' | ')}`);
    requireCondition(!unknownEnglish.length, `Untranslated/uncaptured English sidebar labels remain: ${unknownEnglish.join(' | ')}`);
    return result;
  }
  let originalFailure;
  try {
    for (const product of capture.products) {
      const evidence = { source: product.source, status: 'RUNNING', url: safeURL(page.url()), menus: [] };
      inventory.products.push(evidence);
      await waitForNavRoot(product.source);
      await expandProducts(product.source);
      step(`sidebar-${product.source.toLowerCase()}-finding-product-control`);
      const productEntry = expected(product.source, 'product');
      const productControl = nav.locator(selector.productOpener).filter({ has: page.locator(selector.productLabel).filter({ hasText: new RegExp(`^\\s*${escape(productEntry.target)}\\s*$`, 'u') }) });
      await productControl.waitFor({ state: 'visible', timeout: 15000 });
      requireCondition(await productControl.count() === 1 && await productControl.isVisible(), `Verified visible product item is absent or ambiguous: ${product.source}`, true);
      evidence.alreadySelected = (await productControl.getAttribute('class') || '').split(/\s/u).includes('selected');
      if (!evidence.alreadySelected) { step(`sidebar-${product.source.toLowerCase()}-clicking-product-control`); await productControl.click(); }
      step(`sidebar-${product.source.toLowerCase()}-waiting-product-route`);
      await page.waitForURL(url => url.hostname === 'demo.impact.com' && url.pathname.startsWith(`/secure/advertiser/${product.source.toLowerCase()}/`), { waitUntil: 'domcontentloaded', timeout: 30000 });
      await waitForNavRoot(product.source);
      await expandProducts(product.source);
      await waitForSelectedProduct(product.source, productEntry.target);
      evidence.url = safeURL(page.url());
      step(`sidebar-${product.source.toLowerCase()}-verifying-main-labels`);
      evidence.main = await verifyLabels(product.mainLabels, selector.mainLabel, 'main', product);
      let previousMain;
      for (const menu of product.menus) {
        const menuPhase = `sidebar-${product.source.toLowerCase()}-${menu.source.toLowerCase().replace(/\s/gu, '-')}${menu.nested ? '-nested' : ''}`;
        step(`${menuPhase}-finding-main-opener`);
        const mainEntry = expected(menu.source, 'main');
        const opener = nav.locator(selector.mainLabel).filter({ hasText: new RegExp(escape(mainEntry.target), 'u') });
        requireCondition(await opener.count() === 1 && await opener.isVisible(), `Verified main menu opener is absent or ambiguous: ${menu.source}`, true);
        const baseMenu = product.menus.find(item => item.source === menu.source && !item.nested);
        const currentChildren = await visibleLabels(selector.childLabel);
        const baseTargets = (baseMenu?.labels || []).map(source => expected(source, 'child', baseMenu).target);
        const alreadyOpen = previousMain === menu.source || baseTargets.length > 0 && baseTargets.every(target => currentChildren.includes(normalize(target)));
        if (!alreadyOpen) { step(`${menuPhase}-clicking-main-opener`); await opener.click(); }
        previousMain = menu.source;
        let labelSelector = selector.childLabel; let kind = 'child';
        if (menu.nested) {
          step(`${menuPhase}-waiting-nested-opener`);
          const nestedEntry = expected(menu.nested, 'child', baseMenu);
          const nestedOpener = nav.locator('.child-menu-content span').filter({ hasText: new RegExp(`^\\s*${escape(nestedEntry.target)}\\s*$`, 'u') });
          await nestedOpener.waitFor({ state: 'visible', timeout: 15000 });
          requireCondition(await nestedOpener.count() === 1 && await nestedOpener.isVisible(), `Verified nested menu opener is absent or ambiguous: ${menu.nested}`, true);
          const existingNested = await visibleLabels(selector.nestedLabel);
          const nestedTargets = menu.labels.map(source => expected(source, 'nested', menu).target);
          if (!nestedTargets.every(target => existingNested.includes(normalize(target)))) { step(`${menuPhase}-clicking-nested-opener`); await nestedOpener.click(); }
          labelSelector = selector.nestedLabel; kind = 'nested';
        }
        step(`${menuPhase}-verifying-visible-labels-and-questions`);
        evidence.menus.push({ source: menu.source, nested: menu.nested, ...(await verifyLabels(menu.labels, labelSelector, kind, menu)) });
      }
      evidence.status = 'PASS';
      await screenshot(`real-sidebar-${product.source.toLowerCase()}.png`);
    }
    requireCondition(inventory.products.length === 4, 'Not all four captured products were verified');
    report.sidebarVerified = true;
    return `4 products; ${inventory.products.reduce((sum, product) => sum + product.menus.length, 0)} captured menu groups; scoped Chinese targets and visible mapped term questions verified without clicking business links`;
  } catch (error) {
    error.originalOperationPhase ||= operationPhase;
    originalFailure = error;
    inventory.failure = safeFailure(error);
    const activeProduct = inventory.products.at(-1); if (activeProduct?.status === 'RUNNING') activeProduct.status = error.blocked ? 'BLOCKED' : 'FAIL';
    throw error;
  } finally {
    try {
      step('returning-to-authorized-dashboard-after-sidebar');
      await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 45000 });
      step('waiting-attached-version-after-sidebar-recovery');
      await page.locator('#impact-cn-assistant .impact-cn-panel-version').waitFor({ state: 'attached', timeout: 30000 });
      await waitForSnapshot();
      inventory.dashboardRestored = true;
    } catch (recoveryError) {
      recoveryError.originalOperationPhase ||= operationPhase;
      inventory.recoveryFailure = safeFailure(recoveryError);
      inventory.dashboardRestored = false;
      if (!originalFailure) throw recoveryError;
    } finally {
      writeFileSync(path.join(artifacts, 'real-sidebar-verification.json'), JSON.stringify(redactObject(inventory), null, 2));
    }
  }
}
async function runChecks(options) {
  const selected = report.runScope.selectedChecks;
  const run = async (id, action) => {
    if (!selected.includes(id)) return;
    const result = await test(CHECK_NAMES[id], action, id);
    if (id === 'ai') {
      await page.evaluate(() => window.__impactLiveAITimelineCleanup?.()).catch(() => {});
      report.aiEvidence = { ...report.aiEvidence, status: result.status };
      if (result.status !== 'PASS') writeFileSync(path.join(artifacts, 'real-ai-links.json'), JSON.stringify(report.aiEvidence, null, 2));
    }
  };
  operationProgress('checking-loaded-extension-version-without-reloading');
  await page.locator('#impact-cn-assistant').waitFor({ timeout: 30000 });
  const diskVersion = JSON.parse(readFileSync(path.join(extensionPath, 'manifest.json'), 'utf8')).version;
  const loadedText = await page.locator('#impact-cn-assistant .impact-cn-panel-version').textContent();
  const loadedVersion = loadedText?.match(/v(\d+\.\d+\.\d+)/)?.[1];
  requireCondition(loadedVersion === diskVersion, 'Loaded extension version differs from disk version; browser/session preserved, reload through extension management explicitly', true);
  report.extensionVersion = loadedVersion;
  report.reloadedAuthenticatedPage = false;
  if (selected.some(id => ['dom', 'residuals', 'date'].includes(id))) await waitForSnapshot();
  await run('site', async () => {
    requireCondition(new URL(page.url()).hostname === 'demo.impact.com' && report.requestsToDemo > 0, 'The real demo site was not reached');
    requireCondition(await page.locator('#impact-cn-assistant').count() === 1, 'Extension assistant was not injected');
    requireCondition(!await page.evaluate(() => Boolean(window.ImpactCN)), 'Unexpected main-world localization API');
    return `Real demo requests: ${report.requestsToDemo}; loaded unpacked MV3 ${report.extensionVersion}; no routes or fixtures`;
  });
  if (selected.includes('sidebar')) report.sidebarVerified = false;
  await run('sidebar', () => verifyCapturedSidebar(options));
  await run('dom', async () => {
    await panel(true);
    await page.locator('#impact-cn-assistant .impact-cn-switch').uncheck();
    await page.waitForFunction(() => document.querySelector('#impact-cn-assistant')?.dataset.enabled === 'false');
    const baselineMetricLabels = (await page.locator('snapshot-chart-shadow [class*="secondaryFieldLabel"]').allTextContents()).map(text => text.trim());
    report.baselineNativeMetricLabels = baselineMetricLabels;
    if (options.expectedNativeLanguage === 'en') {
      const expected = ['Clicks', 'Actions', 'Action Cost', 'Revenue', 'Total Cost', 'Conversion Rate'];
      requireCondition(expected.every(label => baselineMetricLabels.includes(label)), 'Fresh native-language baseline did not contain all six expected English metric labels');
      report.nativeEnglishBaselineVerified = true;
    }
    await page.evaluate(() => {
      const nodes = [];
      function visit(container) {
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          const parent = node.parentElement;
          if (!parent || parent.closest('script,style,noscript,input,textarea,[contenteditable],[data-impact-cn-ignore],#impact-cn-assistant,#ask-impact-app,#ask-impact-shadow-host') || !parent.getClientRects().length || !node.nodeValue.trim()) continue;
          const siblings = [...parent.childNodes].filter(sibling => sibling.nodeType !== Node.ELEMENT_NODE || !sibling.matches('[data-impact-cn-ignore],[data-impact-cn-help-topic]'));
          nodes.push({ node, parent, siblings, source: node.nodeValue, numeric: /^[\d\s.,:$€£¥%()\-+\/]+$/.test(node.nodeValue.trim()) });
        }
        for (const element of container.querySelectorAll('*')) if (element.shadowRoot && !element.closest('#impact-cn-assistant,#ask-impact-app,#ask-impact-shadow-host')) visit(element.shadowRoot);
      }
      visit(document); window.__impactLiveTextAudit = nodes;
    });
    await page.locator('#impact-cn-assistant .impact-cn-switch').check();
    await page.waitForFunction(() => document.querySelector('#impact-cn-assistant')?.dataset.enabled === 'true');
    await page.waitForTimeout(800);
    const evidence = await page.evaluate(() => {
      const nodes = window.__impactLiveTextAudit || [];
      const changed = nodes.filter(x => x.node.isConnected && x.node.nodeValue !== x.source);
      return { total: nodes.length, changed: changed.length, replaced: nodes.filter(x => !x.node.isConnected || x.node.parentNode !== x.parent).length, reordered: nodes.filter(x => { const current = [...x.parent.childNodes].filter(node => x.siblings.includes(node)); return !x.siblings.every((node, index) => current[index] === node); }).length, numericChanged: nodes.filter(x => x.numeric && x.node.isConnected && x.node.nodeValue !== x.source).length, mappings: changed.map(x => ({ source: x.source.trim(), target: x.node.nodeValue.trim() })) };
    });
    requireCondition(evidence.total > 0 && evidence.changed > 0, 'No actual Dashboard text was translated');
    requireCondition(evidence.replaced === 0, 'Existing text nodes were replaced');
    requireCondition(evidence.reordered === 0, 'Original native siblings were reordered');
    requireCondition(evidence.numericChanged === 0, 'Existing numeric text was changed');
    writeFileSync(path.join(artifacts, 'real-translated-mappings.json'), JSON.stringify(redactObject(evidence), null, 2));
    await panel(false);
    return `${evidence.changed}/${evidence.total} visible nodes changed; 0 replaced; 0 numeric changes`;
  });
  await run('residuals', async () => {
    const sandbox = {}; vm.createContext(sandbox); vm.runInContext(readFileSync(path.join(extensionPath, 'site-config.js'), 'utf8'), sandbox);
    const localization = JSON.parse(JSON.stringify(sandbox.IMPACT_CN_CONFIG?.localization || {}));
    const residuals = await page.evaluate(localization => {
      const results = []; const scopes = localization.rootSelectors || [];
      const excluded = [...(localization.ignoreSelectors || []), '#ask-impact-shadow-host', '#ask-impact-app', '#impact-cn-assistant', '.iui-calendar-range', 'input,textarea,code,pre,script,style,[contenteditable],[data-impact-user-content],[data-impact-cn-ignore]'];
      function closest(element, selector) { let current = element; while (current) { if (current.closest(selector)) return true; const root = current.getRootNode(); current = root instanceof ShadowRoot ? root.host : null; } return false; }
      function visit(container) {
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT); let node;
        while ((node = walker.nextNode())) {
          const element = node.parentElement;
          if (!element || !element.getClientRects().length || excluded.some(selector => closest(element, selector)) || !scopes.some(selector => closest(element, selector))) continue;
          const text = node.nodeValue.trim();
          if (text.length >= 40 && /^[A-Za-z0-9\s.,:;!?()\-'"/&%]+$/.test(text) && (text.match(/[A-Za-z]+/g) || []).length >= 6) results.push({ text, tag: element.tagName, id: element.id });
        }
        for (const element of container.querySelectorAll('*')) if (element.shadowRoot && !excluded.some(selector => closest(element, selector))) visit(element.shadowRoot);
      }
      visit(document); return results;
    }, localization);
    writeFileSync(path.join(artifacts, 'real-untranslated-long-sentences.json'), JSON.stringify(redactObject(residuals), null, 2));
    requireCondition(residuals.length === 0, `${residuals.length} untranslated long English sentences remain in formal localization scope; see inventory`);
    return '0 long English residual sentences inside verified localization scope; names/accounts/native AI/date portal excluded';
  });
  await run('date', async () => {
    requireCondition(options.menuSelector, 'A verified read-only Dashboard menu selector has not been supplied', true);
    const control = page.locator(options.menuSelector);
    requireCondition(await control.count() === 1, 'Verified menu selector is not unique');
    await control.click();
    const calendar = page.locator('.iui-calendar-range:visible');
    await calendar.waitFor({ state: 'visible', timeout: 15000 });
    requireCondition(await calendar.count() === 1, 'Native date popup is not unique');
    let labels = []; let untranslated = [];
    const deadline = Date.now() + 10000;
    do {
      labels = await calendar.evaluate(root => {
        const result = [];
        for (const area of root.querySelectorAll('.presets,.footer')) {
          const walker = document.createTreeWalker(area, NodeFilter.SHOW_TEXT); let node;
          while ((node = walker.nextNode())) if (node.parentElement?.getClientRects().length && node.nodeValue.trim()) result.push(node.nodeValue.trim());
        }
        return result;
      });
      untranslated = labels.filter(text => /^[A-Za-z(][A-Za-z\d\s()\-]+$/.test(text) && /[A-Za-z]{3}/.test(text));
      if (labels.some(text => /[\u4e00-\u9fff]/.test(text)) && !untranslated.length) break;
      await page.waitForTimeout(100);
    } while (Date.now() < deadline);
    writeFileSync(path.join(artifacts, 'real-date-popup-labels.json'), JSON.stringify({ labels, untranslated }, null, 2));
    requireCondition(labels.some(text => /[\u4e00-\u9fff]/.test(text)), 'Native date presets did not become Chinese');
    requireCondition(!untranslated.length, 'Native date presets/footer contain untranslated English: ' + untranslated.join(' | '));
    await screenshot('real-dashboard-menu.png');
    requireCondition(errors === 0, 'Native menu emitted a browser JavaScript error');
    await page.keyboard.press('Escape');
    return `Clicked verified native menu ${options.menuSelector}; date presets/footer Chinese; 0 English residual labels; no pageerror events`;
  });
  await run('ai', async () => {
    await page.evaluate(() => { window.__impactLiveAIProofCleanup?.(); window.__impactLiveAITimelineCleanup?.(); delete window.__impactLiveAIProof; delete window.__impactLiveAITimeline; });
    const input = page.locator('#ask-impact-shadow-host textarea[placeholder="ask impact..."]');
    const send = page.locator('#ask-impact-shadow-host [aria-label="Send"]');
    requireCondition(options.verifiedReplySelector, 'A verified native assistant reply selector is required; user-prompt links are insufficient', true);
    requireCondition(await page.locator('#impact-cn-assistant').getAttribute('data-ai-enabled') !== 'false', 'AI questions are disabled; the live test did not change the user setting', true);
    // Open first so lazy-mounted historical replies are included in the baseline.
    // Capturing a hidden/empty host before opening could mistake an old reply for new.
    operationProgress('ai-opening-native-editor-before-conversation-baseline');
    const nativeOpener = page.locator('button[aria-label="Open Ask Impact"]:visible');
    if (await nativeOpener.count()) {
      const opener = nativeOpener;
      requireCondition(await opener.count() === 1, 'Verified native AI opener is absent or ambiguous', true);
      await opener.click();
    }
    await waitForNativeAIEditor();
    requireCondition(await input.count() === 1 && await send.count() === 1, 'Native AI controls are not unique', true);
    requireCondition((await input.inputValue()).trim() === '', 'Native AI has an existing draft; automatic test did not overwrite it', true);
    requireCondition(!await input.isDisabled() && await input.getAttribute('readonly') === null, 'Native AI editor is unavailable; browser preserved', true);
    const replies = page.locator(options.verifiedReplySelector);
    operationProgress('ai-reading-stable-existing-reply-baseline');
    let baselineReplies = []; let before = ''; let baselineSince = 0;
    const baselineDeadline = Date.now() + 10000;
    while (Date.now() < baselineDeadline) {
      const current = await replies.allTextContents(); const joined = current.join('\n');
      requireCondition(!current.some(text => /^\s*(?:Thinking[.\s…]*|正在思考[.\s…]*)$/iu.test(text)), 'A previous native AI answer is still generating; browser preserved', true);
      if (joined === before) { if (!baselineSince) baselineSince = Date.now(); if (Date.now() - baselineSince >= 2000) { baselineReplies = current; break; } }
      else { before = joined; baselineSince = 0; }
      await page.waitForTimeout(250);
    }
    requireCondition(baselineSince && Date.now() - baselineSince >= 2000, 'Native conversation baseline did not become stable before the question', true);
    await page.evaluate(installSafeAITimeline);
    await closeNativeAI();
    if (options.helpOpenerSelector) {
      operationProgress('ai-opening-verified-inline-help-submenu');
      const opener = page.locator(options.helpOpenerSelector);
      requireCondition(await opener.count() === 1 && await opener.isVisible(), 'Verified inline-help submenu opener is absent, hidden or ambiguous', true);
      const existingHelp = options.helpSelector ? page.locator(options.helpSelector) : null;
      if (!existingHelp || !await existingHelp.count() || !await existingHelp.isVisible()) await opener.click();
    }
    const inlineSelector = options.helpSelector || `snapshot-chart-shadow button[data-impact-cn-help][data-topic-id="${options.topicId || 'actions'}"]:visible`;
    const topicButton = page.locator(inlineSelector);
    operationProgress('ai-waiting-for-visible-verified-inline-question');
    await topicButton.waitFor({ state: 'visible', timeout: 15000 });
    requireCondition(await topicButton.count() === 1, 'Verified inline term help control is absent', true);
    requireCondition(await topicButton.getAttribute('data-impact-cn-help') !== null && await topicButton.getAttribute('data-topic-id') === (options.topicId || 'actions'), 'The selected control is not the requested inline term question mark');
    requireCondition(!await topicButton.evaluate(node => Boolean(node.closest('#impact-cn-assistant'))), 'Inline acceptance cannot use the settings panel');
    await topicButton.evaluate(button => {
      window.__impactLiveAIProofCleanup?.();
      const status = document.querySelector('#impact-cn-assistant .impact-cn-status');
      const proof = { ownClick: false, inlineClicks: 0, autoSends: 0, successObserved: false, interference: false };
      const click = event => {
        const path = event.composedPath(); const help = path.find(node => node instanceof Element && node.matches('[data-impact-cn-help]'));
        if (help) { proof.inlineClicks++; if (help === button && proof.inlineClicks === 1) proof.ownClick = true; else proof.interference = true; }
        const nativeAI = path.some(node => node instanceof Element && node.id === 'ask-impact-shadow-host');
        if (proof.ownClick && event.isTrusted && (nativeAI || path.some(node => node instanceof Element && node.matches('[aria-label="Open Ask Impact"]')))) proof.interference = true;
        if (proof.ownClick && nativeAI && path.some(node => node instanceof Element && node.matches('[aria-label="Send"]')) && !event.isTrusted) proof.autoSends++;
      };
      const input = event => { if (proof.ownClick && event.isTrusted && event.composedPath().some(node => node instanceof Element && node.id === 'ask-impact-shadow-host')) proof.interference = true; };
      const change = event => { if (proof.ownClick && event.isTrusted && event.target instanceof Element && event.target.matches('#impact-cn-assistant input[type="checkbox"]')) proof.interference = true; };
      const observer = new MutationObserver(records => { if (proof.ownClick && status?.dataset.type === 'success' && records.some(record => record.type !== 'attributes' || record.attributeName === 'data-type')) proof.successObserved = true; });
      if (status) observer.observe(status, { attributes: true, childList: true, subtree: true, characterData: true });
      document.addEventListener('click', click, true); document.addEventListener('input', input, true); document.addEventListener('change', change, true);
      window.__impactLiveAIProof = proof;
      window.__impactLiveAIProofCleanup = () => { observer.disconnect(); document.removeEventListener('click', click, true); document.removeEventListener('input', input, true); document.removeEventListener('change', change, true); };
    });
    try {
    operationProgress('ai-clicking-inline-question');
    await topicButton.click();
    operationProgress('ai-waiting-for-native-editor-after-inline-click');
    await waitForNativeAIEditor();
    operationProgress('ai-waiting-for-extension-send-success-transition');
    await page.waitForFunction(() => window.__impactLiveAIProof?.interference || (window.__impactLiveAIProof?.successObserved && document.querySelector('#impact-cn-assistant .impact-cn-status')?.dataset.type === 'success'), null, { timeout: 15000 });
    let proof = await page.evaluate(() => window.__impactLiveAIProof);
    requireCondition(!proof.interference, 'User activity interfered with the AI test; browser preserved and no new-reply PASS claimed', true);
    requireCondition(proof.ownClick && proof.inlineClicks === 1 && proof.autoSends === 1 && proof.successObserved, 'The inline click did not produce one verified extension send-success transition');
    requireCondition(await input.count() === 1 && await send.count() === 1, 'Native AI input/send selectors are not unique');
    operationProgress('ai-waiting-for-new-stable-native-reply-and-official-link');
    const deadline = Date.now() + 90000;
    let answerText = ''; let lastText = ''; let stableSince = 0; let ready = false;
    while (Date.now() < deadline) {
      proof = await page.evaluate(() => window.__impactLiveAIProof);
      requireCondition(!proof.interference, 'User activity interfered with the AI test; browser preserved and no new-reply PASS claimed', true);
      const after = (await replies.allTextContents()).join('\n');
      const reply = replies.last();
      const visible = await replies.count() > 0 && await reply.isVisible();
      answerText = visible ? await reply.innerText() : '';
      const linkCount = visible ? await reply.locator('a[href^="https://help.impact.com/"]').count() : 0;
      const looksLikePreset = /请只解释以上选中的概念|请用简体中文按以下固定模板回答/u.test(answerText);
      const completeCandidate = visible && !looksLikePreset && after !== before && !baselineReplies.includes(answerText) && await replies.count() > baselineReplies.length && /[\u4e00-\u9fff]/.test(answerText) && !/^\s*Thinking[.\s…]*$/i.test(answerText) && linkCount > 0;
      if (completeCandidate && answerText === lastText) { if (!stableSince) stableSince = Date.now(); if (Date.now() - stableSince >= 1600) { ready = true; break; } }
      else stableSince = 0;
      lastText = answerText; await page.waitForTimeout(300);
    }
    requireCondition(ready, 'A new stable native assistant reply with Chinese and an official HelpDoc link was not completed within 90 seconds');
    requireCondition((await input.inputValue()).trim() === '', 'The native input still contains the preset draft; send may not have occurred');
    const reply = replies.last();
    const termChecks = { dashboard: /Dashboard|仪表盘/i.test(answerText), clicks: /Clicks|点击/i.test(answerText), actions: /Actions|转化/i.test(answerText), revenue: /Revenue|销售|收入/i.test(answerText), totalCost: /Total\s+Cost|总成本|推广总成本/i.test(answerText) };
    if (options.topicId === 'dashboard') requireCondition(Object.values(termChecks).every(Boolean), 'The actual Dashboard assistant reply did not explain Dashboard and all required metric concepts');
    else { const concept = options.expectedConcept || options.topicId || 'actions'; if (concept in termChecks) requireCondition(termChecks[concept], 'The actual assistant reply did not explain the selected concept'); }
    let expectedConceptRegexMatched;
    if (options.expectedConceptRegex) {
      let expression; try { expression = new RegExp(options.expectedConceptRegex, 'iu'); } catch { requireCondition(false, 'Expected concept regex is invalid', true); }
      expectedConceptRegexMatched = expression.test(answerText);
      requireCondition(expectedConceptRegexMatched, 'The actual new assistant reply does not match the verified selected concept');
    }
    const links = await reply.locator('a[href^="https://help.impact.com/"]').evaluateAll(nodes => nodes.map(node => ({ href: node.href, text: node.textContent })));
    proof = await page.evaluate(() => window.__impactLiveAIProof);
    requireCondition(!proof.interference, 'User activity interfered with the AI test; no new-reply PASS claimed', true);
    const eventTimeline = await page.evaluate(() => window.__impactLiveAITimeline);
    writeFileSync(path.join(artifacts, 'real-ai-links.json'), JSON.stringify(redactObject({ ...report.aiEvidence, status: 'PASS', links, selectedTopicId: options.topicId || 'actions', expectedConceptRegexMatched, nativeReplyChanged: true, baselineReadWithNativeAIOpen: true, baselineReplyCount: baselineReplies.length, newReplyCount: await replies.count(), extensionSendSuccessObserved: proof.successObserved, inlineClickCount: proof.inlineClicks, automaticSendCount: proof.autoSends, userInterference: false, chinese: true, stableReply: true, stableForMs: 1600, termChecks, eventTimeline, replyLength: answerText.length, fullConversationSaved: false }), null, 2));
    await reply.scrollIntoViewIfNeeded(); await screenshot('real-native-ai.png');
    await reply.locator('a[href^="https://help.impact.com/"]').last().scrollIntoViewIfNeeded(); await screenshot('real-native-ai-helpdoc.png');
    return 'Preset sent through native Shadow DOM input; new stable assistant reply contains Chinese, expected concept terms, and official HelpDoc link';
    } finally { await page.evaluate(() => window.__impactLiveAIProofCleanup?.()).catch(() => {}); }
  });
  report.cleanup = selected.includes('ai') ? await closeNativeAI() : { nativeAICloseSkipped: true };
  operationProgress('closing-settings-panel-before-dashboard-screenshot');
  await panel(false);
  // The native opener is the controlled UI proof. A stale plugin position flag
  // is captured separately instead of masking all completed check evidence.
  report.cleanup.assistantAIActive = await page.locator('#impact-cn-assistant').getAttribute('data-ai-active');
  await screenshot('real-dashboard-localized.png');
  await scan();
  const selectedResults = report.results.filter(result => selected.some(id => result.name === CHECK_NAMES[id]));
  report.status = report.results.some(x => x.status === 'FAIL') ? 'FAIL' : report.results.some(x => x.status === 'BLOCKED') ? 'BLOCKED' : selectedResults.length === selected.length && selectedResults.every(result => result.status === 'PASS') ? 'PASS' : 'BLOCKED';
  saveReport();
}
async function controlLoop() {
  while (true) {
    const options = await hiddenJSON('WAITING_RUN_JSON: run/retry runs live checks (onlyChecks or skipAI supported); scan/inspect are read-only; debug-ui opens native AI/settings then inspects without sending; finish explicitly closes browser.');
    if (options.action === 'finish') { console.log('EXPLICIT_FINISH: closing dedicated browser and deleting temporary profile.'); return; }
    try {
      if (!report.authenticated && new URL(page.url()).hostname === 'demo.impact.com' && new URL(page.url()).pathname.includes('/secure/')) {
        report.authenticated = true; record('真实登录与实网访问', 'PASS', 'Human completed real demo login; no credential/state export');
      }
      if (options.action === 'scan') { await scan(); await screenshot('real-dashboard-authenticated.png'); continue; }
      if (options.action === 'inspect') { await inspectControls(); continue; }
      if (options.action === 'debug-ui') {
        requireCondition(report.authenticated, 'Debug UI requires the authenticated page', true);
        const opener = page.locator('button[aria-label="Open Ask Impact"]:visible');
        if (await opener.count()) { requireCondition(await opener.count() === 1, 'Native AI opener is ambiguous', true); await opener.click(); }
        await panel(true); await page.waitForTimeout(300); await inspectControls(); continue;
      }
      requireCondition(['run', 'retry'].includes(options.action), 'Unknown control action; use run, retry, scan, inspect, debug-ui or finish', true);
      requireCondition(report.authenticated, 'No authenticated Dashboard yet; manually finish login before run', true);
      const authentication = report.results.find(result => result.name === '真实登录与实网访问');
      if (report.results.some(result => result !== authentication)) report.history.push({ date: report.date, status: report.status, results: report.results, runScope: report.runScope, aiEvidence: report.aiEvidence });
      report.results = authentication ? [authentication] : [];
      const selected = selectedChecks(options);
      report.runScope = { selectedChecks: selected, completeAcceptance: Object.keys(CHECK_NAMES).every(id => selected.includes(id)) };
      report.attempt = (report.attempt || 0) + 1; report.status = 'RUNNING'; errors = 0;
      prepareCurrentAIEvidence(options, selected); saveReport();
      await runChecks(options);
      console.log(`RUN_COMPLETE ${report.status}; authenticated browser retained. Send retry or finish explicitly.`);
    } catch (error) {
      record('实页检查执行', error.blocked ? 'BLOCKED' : 'FAIL', `${error.safeMessage || 'Browser operation failed; sensitive detail suppressed'}; phase=${error.originalOperationPhase || operationPhase}; errorType=${error.name || 'Error'}`);
      report.status = error.blocked ? 'BLOCKED' : 'FAIL'; saveReport();
      console.log('BROWSER_RETAINED: no automatic reload, close, cookie export, or credential retry.');
    }
  }
}

try {
  context = await chromium.launchPersistentContext(profile, { executablePath: chromium.executablePath(), channel: 'chromium', headless: false, viewport: { width: 1440, height: 1000 }, args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`] });
  page = context.pages()[0] || await context.newPage();
  page.on('pageerror', () => { if (report.authenticated) errors++; });
  page.on('response', response => { if (new URL(response.url()).hostname === 'demo.impact.com') report.requestsToDemo++; });
  authProgress('opening-login-page');
  const response = await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(3000);
  console.log(`LIVE_BROWSER_READY ${safeURL(page.url())}; initial HTTP ${response.status()}; headed dedicated browser`);
  let credentials;
  const isAuthenticatedURL = () => new URL(page.url()).hostname === 'demo.impact.com' && new URL(page.url()).pathname.includes('/secure/');
  let humanAuthenticated = isAuthenticatedURL();
  if (humanAuthenticated) {
    authProgress('existing-human-dashboard-skipping-credential-request');
    console.log('HUMAN_AUTHENTICATED: real secure Dashboard is already open; no credential request or login field access.');
  } else if (manualLogin) {
    authProgress('waiting-for-human-login-no-credential-read');
    console.log('MANUAL_LOGIN_READY: complete login in the dedicated visible browser. No credential is requested, read, filled, or exported. Waiting up to 10 minutes for the real Dashboard URL.');
  } else {
    authProgress('waiting-for-hidden-credential-input');
    credentials = await hiddenJSON('WAITING_AUTH_JSON: enter one JSON line with username and password; terminal echo is disabled. No credential will be printed or saved.');
    requireCondition(typeof credentials.username === 'string' && typeof credentials.password === 'string', 'Credential JSON must provide username and password');
    secrets = [credentials.username, credentials.password];
    if (isAuthenticatedURL()) {
      humanAuthenticated = true;
      authProgress('human-dashboard-reached-during-credential-wait-skipping-login-fields');
    } else {
    const user = page.locator('input[name="j_username"]');
    authProgress('waiting-for-username-field');
    await user.waitFor({ state: 'visible', timeout: 60000 });
    await user.fill(credentials.username);
    authProgress('username-filled-waiting-for-continue');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    authProgress('continue-clicked-waiting-for-password-field');
    const password = page.locator('input[type="password"]');
    await password.waitFor({ state: 'visible', timeout: 30000 });
    authProgress('password-field-visible');
    await password.fill(credentials.password);
    authProgress('password-filled-looking-for-sign-in-button');
    const submit = page.getByRole('button', { name: /^(Sign in|Log in|Login|Continue)$/i });
    console.log(`AUTH_BUTTON visible-match-count=${await submit.count()}; allowed labels: Sign in / Log in / Login / Continue`);
    await submit.click();
    authProgress('sign-in-clicked-waiting-for-dashboard');
    }
  }
  await page.waitForURL(url => url.hostname === 'demo.impact.com' && url.pathname.includes('/secure/'), { waitUntil: 'domcontentloaded', timeout: manualLogin ? 600000 : 90000 });
  authProgress('dashboard-url-reached');
  report.authenticated = true;
  if (credentials) { credentials.username = ''; credentials.password = ''; }
  report.authenticationMode = humanAuthenticated || manualLogin ? 'HUMAN_AUTH' : 'AUTHORIZED_SINGLE_CREDENTIAL_SUBMISSION';
  record('真实登录与实网访问', 'PASS', `${report.authenticationMode}; authenticated demo.impact.com; current path ${safeURL(page.url())}; no credential/state export`);
  try { await waitForSnapshot(); } catch (error) { record('登录后的数据准备', 'BLOCKED', `${error.safeMessage || 'Dashboard metrics are not ready'}; phase=${operationPhase}; errorType=${error.name || 'Error'}`); }
  await scan();
  await screenshot('real-dashboard-authenticated.png');
  saveReport();
  console.log('AUTHENTICATED_SCAN_READY: actual DOM scan and masked screenshot saved; browser remains open.');
  await controlLoop();
} catch (error) {
  if (!report.authenticated) {
    report.authDiagnostic = await authenticationDiagnostic();
    console.log(`AUTH_DIAGNOSTIC ${JSON.stringify(report.authDiagnostic)}`);
    writeFileSync(path.join(artifacts, 'auth-diagnostic.json'), JSON.stringify(report.authDiagnostic, null, 2));
  }
  record('实网执行', 'BLOCKED', `${error.safeMessage || 'Live browser operation failed; credential-bearing error detail suppressed'}; phase=${report.authenticated ? operationPhase : authPhase}; errorType=${error.name || 'Error'}`);
  report.status = 'BLOCKED'; saveReport();
  if (context && page && !page.isClosed() && error.message !== 'Input cancelled') {
    console.log('BROWSER_RETAINED_AFTER_FAILURE: finish login manually or inspect the page, then send run/retry/finish. No credential retry occurs automatically.');
    await controlLoop();
  }
} finally {
  if (process.stdin.isTTY) process.stdin.setRawMode(false);
  if (context) await context.close();
  rmSync(profile, { recursive: true, force: true });
  secrets = [];
}
console.log(`REAL_REPORT ${report.status}: live-test-report.md and artifacts/live/real-test-report.json`);
process.exitCode = report.status === 'PASS' ? 0 : 2;

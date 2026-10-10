import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { existsSync, readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright-core'); }
catch {
  const bundle = path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core');
  try { playwright = require(bundle); }
  catch { throw new Error('Install test dependency: npm install. Then install Chromium: npx playwright-core install chromium.'); }
}

const baseURL = process.env.IMPACT_DEMO_URL || 'http://127.0.0.1:8765/demo/';
const artifacts = path.join(root, 'artifacts');
mkdirSync(artifacts, { recursive: true });
const browserPath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || playwright.chromium.executablePath();
if (!existsSync(browserPath)) throw new Error(`Chromium missing: ${browserPath}. Run: npx playwright-core install chromium`);
const results = [];
const pageErrors = [];
async function check(name, action) {
  try { const evidence = await action(); results.push({ name, status: 'PASS', evidence: evidence || '' }); console.log(`PASS ${name}`); }
  catch (error) { results.push({ name, status: 'FAIL', evidence: error.stack || String(error) }); console.log(`FAIL ${name}: ${error.message}`); }
}
async function waitTranslated(page, id, target) {
  await page.waitForFunction(({ id, target }) => document.getElementById(id)?.textContent.trim() === target, { id, target });
}

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(readFileSync(path.join(root, 'impact-cn-mod/dict.js'), 'utf8'), sandbox);
const dictionary = sandbox.IMPACT_CN_DICTIONARY;
assert(dictionary?.entries?.length, 'Dictionary is structured and populated');
const general = dictionary.entries.filter(entry => !entry.scope);
assert(general.length >= 2, 'Need at least two general entries for DOM regression tests');
const sample = general.find(entry => entry.source === 'Dashboard') || general[0];
const second = general.find(entry => entry.source !== sample.source) || general[1];
const topic = dictionary.helpTopics[0];
await check('字典结构、ID 与官方文档链接', async () => {
  const ids = new Set();
  for (const entry of dictionary.entries) {
    assert(entry.id && typeof entry.source === 'string' && typeof entry.target === 'string' && entry.reason, `Incomplete entry: ${entry.id}`);
    assert(!ids.has(entry.id), `Duplicate ID: ${entry.id}`); ids.add(entry.id);
    if (entry.helpUrl) assertOfficialURL(entry.helpUrl);
  }
  for (const item of dictionary.helpTopics) { assert(item.question && item.label && item.explanation); assertOfficialURL(item.helpUrl); }
  return `${dictionary.entries.length} entries; ${dictionary.helpTopics.length} help topics`;
});
function assertOfficialURL(value) {
  const url = new URL(value);
  assert(url.protocol === 'https:' && ['help.impact.com', 'impact.com'].includes(url.hostname), `Nonofficial HelpDoc: ${value}`);
}

const scriptProfile = mkdtempSync(path.join(os.tmpdir(), 'impact-cn-script-'));
const context = await playwright.chromium.launchPersistentContext(scriptProfile, {
  executablePath: browserPath, channel: 'chromium', headless: true, viewport: { width: 1440, height: 1000 }
});
const page = context.pages()[0] || await context.newPage();
page.on('pageerror', error => pageErrors.push(error.message));
await page.goto(baseURL, { waitUntil: 'networkidle' });
await page.waitForFunction(() => Boolean(window.ImpactCN));
await page.evaluate(async () => { await window.ImpactCN.ready; });

await check('可翻译区域无残留英文长句', async () => {
  const residual = await page.evaluate(() => {
    const matches = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const element = node.parentElement;
      if (!element || element.closest('script,style,code,pre,input,textarea,[contenteditable], [data-impact-cn-ignore],[data-impact-user-content],[data-impact-ai-messages],#impact-cn-assistant') || !element.getClientRects().length) continue;
      const text = node.nodeValue.trim();
      if (text.length >= 40 && /^[A-Za-z0-9\s.,:;!?()\-'"/&%]+$/.test(text) && (text.match(/[A-Za-z]+/g) || []).length >= 6) matches.push(text);
    }
    return matches;
  });
  assert.deepEqual(residual, [], `Untranslated long English text: ${residual.join(' | ')}`);
  return '0 residual long English sentences in unprotected visible UI';
});
await check('可翻译区域无残留英文 UI 短词', async () => {
  const residual = await page.evaluate(() => {
    const matches = new Set();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const element = node.parentElement;
      if (!element || element.closest('script,style,code,pre,input,textarea,[contenteditable],[data-impact-cn-ignore],[data-impact-user-content],[data-impact-ai-messages],#impact-cn-assistant') || !element.getClientRects().length) continue;
      const text = node.nodeValue.trim();
      if (/^[A-Za-z][A-Za-z\s\-'.,:/]*$/.test(text) && /[A-Za-z]{3}/.test(text)) matches.add(text);
    }
    return [...matches];
  });
  assert.deepEqual(residual, [], `Untranslated UI terms: ${residual.join(' | ')}`);
  return '0 residual English terms in visible UI; business names and branded text excluded';
});

await check('纯文本翻译保留 DOM 身份与事件监听器', async () => {
  await page.evaluate(({ source }) => {
    const button = document.createElement('button'); button.id = 'test-preserve-button';
    button.style.cssText = 'position:fixed;top:10px;left:50%;z-index:2147483600';
    const child = document.createElement('strong'); child.textContent = source; button.append(child);
    window.__impactTest = { button, child, text: child.firstChild, clicks: 0 };
    button.addEventListener('click', () => { window.__impactTest.clicks++; }); document.body.append(button);
  }, { source: sample.source });
  await waitTranslated(page, 'test-preserve-button', sample.target);
  await page.locator('#test-preserve-button').click();
  assert(await page.evaluate(() => {
    const t = window.__impactTest; return t.button === document.getElementById('test-preserve-button') && t.child === t.button.firstElementChild && t.text === t.child.firstChild && t.clicks === 1;
  }));
  return 'Button, child element and Text node retained; original click listener ran';
});
await check('MutationObserver 处理新增节点与 React 风格文本更新', async () => {
  await page.evaluate(({ source }) => { const node = document.createElement('span'); node.id = 'test-dynamic'; node.textContent = source; document.body.append(node); }, { source: sample.source });
  await waitTranslated(page, 'test-dynamic', sample.target);
  await page.evaluate(({ source }) => { document.getElementById('test-dynamic').firstChild.data = source; }, { source: second.source });
  await waitTranslated(page, 'test-dynamic', second.target);
  return `${sample.source} → ${sample.target}; updated ${second.source} → ${second.target}`;
});
await check('用户输入、代码、contenteditable 与 AI 回复不被改写', async () => {
  await page.evaluate(({ source }) => {
    const host = document.createElement('div'); host.id = 'test-exclusions';
    const input = document.createElement('input'); input.value = source; input.placeholder = source; input.title = source; host.append(input);
    const area = document.createElement('textarea'); area.value = source; host.append(area);
    for (const tag of ['code', 'pre']) { const item = document.createElement(tag); item.textContent = source; host.append(item); }
    const editable = document.createElement('div'); editable.contentEditable = 'true'; editable.textContent = source; host.append(editable);
    const reply = document.createElement('section'); reply.setAttribute('data-impact-ai-messages', ''); reply.textContent = source; host.append(reply);
    const user = document.createElement('div'); user.setAttribute('data-impact-user-content', ''); user.textContent = source; host.append(user);
    document.body.append(host);
  }, { source: sample.source });
  await page.waitForTimeout(150);
  const values = await page.locator('#test-exclusions').evaluate(host => Array.from(host.children).map(node => [node.value ?? node.textContent, node.placeholder, node.title]));
  for (const value of values) assert.equal(value[0], sample.source);
  assert.equal(values[0][1], sample.source); assert.equal(values[0][2], sample.source);
  return 'All protected text and attributes retained';
});
await check('停用恢复原文，重新启用，恢复更新后的源文本', async () => {
  await page.evaluate(() => window.ImpactCN.setEnabled(false));
  await waitTranslated(page, 'test-preserve-button', sample.source);
  await waitTranslated(page, 'test-dynamic', second.source);
  await page.evaluate(() => window.ImpactCN.setEnabled(true));
  await waitTranslated(page, 'test-preserve-button', sample.target);
  await waitTranslated(page, 'test-dynamic', second.target);
  return 'Restored latest original text and translated again';
});
await check('下拉框与弹窗中的动态翻译', async () => {
  await page.locator('#filter-button').click();
  const menu = page.locator('#filter-menu');
  if (await menu.count()) { await menu.waitFor({ state: 'visible' }); await page.waitForFunction(() => /[\u4e00-\u9fff]/.test(document.querySelector('#filter-menu')?.innerText || '')); assert.match(await menu.innerText(), /[\u4e00-\u9fff]/); }
  await page.locator('#add-partner').click();
  const dialog = page.locator('#partner-dialog'); await dialog.waitFor({ state: 'visible' });
  assert.match(await dialog.innerText(), /[\u4e00-\u9fff]/);
  await dialog.evaluate(dialog => dialog.close());
  return 'Dynamic dropdown and modal translated';
});

await page.evaluate(() => ['test-preserve-button', 'test-dynamic', 'test-exclusions'].forEach(id => document.getElementById(id)?.remove()));
await page.locator('#ai-open').click();
await page.locator('#impact-cn-assistant .impact-cn-launcher').click();
await page.locator('[data-impact-ai-input]').waitFor({ state: 'visible' });
await page.evaluate(() => {
  window.__impactSendEvidence = { clicks: 0, inputs: [], events: 0 };
  document.addEventListener('click', event => {
    if (event.target.closest('[data-impact-ai-send]') && !event.target.closest('[data-impact-ai-send]').disabled) {
      window.__impactSendEvidence.clicks++; window.__impactSendEvidence.inputs.push(document.querySelector('[data-impact-ai-input]').value);
    }
  }, true);
  document.querySelector('[data-impact-ai-input]').addEventListener('input', () => { window.__impactSendEvidence.events++; });
  document.addEventListener('input', () => { if (window.__impactDisableSend) document.querySelector('[data-impact-ai-send]').disabled = true; });
});
function topicButton() { return page.locator('#impact-cn-assistant').getByRole('button', { name: topic.label, exact: true }); }
async function clickTopic() {
  if (await page.locator('#impact-cn-assistant-panel').isHidden()) await page.locator('#impact-cn-assistant .impact-cn-launcher').click();
  await topicButton().click();
}
await check('点击预设问题填入现有 AI 框，触发输入事件与发送，回答带 HelpDoc', async () => {
  await clickTopic();
  await page.waitForFunction(() => window.__impactSendEvidence.clicks === 1);
  const evidence = await page.evaluate(() => window.__impactSendEvidence);
  assert(evidence.events >= 1, 'Native input event must be sent');
  assert(evidence.inputs[0].includes(topic.question));
  assert(evidence.inputs[0].includes(topic.helpUrl), 'Prompt includes official HelpDoc');
  const answer = page.locator('[data-impact-ai-messages]');
  await answer.locator(`a[href="${topic.helpUrl}"]`).first().waitFor();
  assert.match(await answer.innerText(), /[\u4e00-\u9fff]/);
  return `One send; native input event; Chinese reply; official link ${topic.helpUrl}`;
});
await check('已有草稿受到保护', async () => {
  const draft = 'This is an unsent customer draft.';
  await page.locator('[data-impact-ai-input]').fill(draft);
  const before = await page.evaluate(() => window.__impactSendEvidence.clicks);
  await clickTopic(); await page.waitForTimeout(200);
  assert.equal(await page.locator('[data-impact-ai-input]').inputValue(), draft);
  assert.equal(await page.evaluate(() => window.__impactSendEvidence.clicks), before);
  await page.locator('[data-impact-ai-input]').fill('');
  return 'Draft unchanged; no send triggered';
});
await check('发送按钮禁用时不触发发送', async () => {
  const before = await page.evaluate(() => { const n = window.__impactSendEvidence.clicks; window.__impactDisableSend = true; document.querySelector('[data-impact-ai-send]').disabled = true; return n; });
  await clickTopic();
  await page.waitForFunction(() => !window.ImpactCN.getState().busy);
  assert.equal(await page.evaluate(() => window.__impactSendEvidence.clicks), before);
  await page.evaluate(() => { window.__impactDisableSend = false; document.querySelector('[data-impact-ai-send]').disabled = false; });
  await page.locator('[data-impact-ai-input]').fill('');
  return 'Disabled host send was respected';
});
await check('快速重复点击不产生重复发送', async () => {
  const before = await page.evaluate(() => window.__impactSendEvidence.clicks);
  await topicButton().evaluate(button => { button.click(); button.click(); });
  await page.waitForTimeout(250);
  const after = await page.evaluate(() => window.__impactSendEvidence.clicks);
  assert(after - before <= 1, `Repeated clicks sent ${after - before} times`);
  return `Repeated click sent ${after - before} time(s)`;
});
await check('脚本模式没有浏览器 JS 异常', async () => { assert.deepEqual(pageErrors, []); return 'No pageerror events'; });
await page.locator('#ai-close').click();
await page.waitForFunction(() => document.querySelector('#impact-cn-assistant')?.dataset.aiActive === 'false');
if (await page.locator('#impact-cn-assistant-panel').isVisible()) await page.locator('#impact-cn-assistant .impact-cn-close').click();
await page.screenshot({ path: path.join(artifacts, 'demo-desktop.png'), fullPage: true });
await page.setViewportSize({ width: 390, height: 844 });
await check('移动视口页面无整体横向溢出', async () => {
  const size = await page.evaluate(() => ({ viewport: innerWidth, width: document.documentElement.scrollWidth }));
  assert(size.width <= size.viewport + 1, `Page width ${size.width}px exceeds ${size.viewport}px viewport`);
  return `${size.viewport}px viewport; page width ${size.width}px`;
});
await page.screenshot({ path: path.join(artifacts, 'demo-mobile.png'), fullPage: true });
await page.setViewportSize({ width: 1440, height: 1000 });

await check('Demo 搜索与新增合作伙伴可操作，伙伴名称不被词典改写', async () => {
  const total = await page.locator('#partner-rows tr').count(); assert(total >= 1);
  await page.locator('#partner-search').fill('a-query-with-no-matching-partner');
  await page.waitForFunction(() => document.querySelectorAll('#partner-rows tr').length <= 1);
  await page.locator('#partner-search').fill('');
  await page.waitForFunction(total => document.querySelectorAll('#partner-rows tr').length === total, total);
  await page.locator('#add-partner').click();
  await page.locator('#invite-name').fill(sample.source);
  await page.locator('#invite-email').fill('demo-only@example.com');
  await page.locator('#invite-form button[type="submit"]').click();
  await page.locator('#partner-dialog').waitFor({ state: 'hidden' });
  await page.waitForFunction(total => document.querySelectorAll('#partner-rows tr').length === total + 1, total);
  await page.waitForTimeout(100);
  assert(await page.locator('#partner-rows').innerText().then(text => text.includes(sample.source)), 'Business name identical to dictionary source must remain unchanged');
  return `Search responded; ${total} → ${total + 1} local rows; ${sample.source} business name retained`;
});

await check('词典中的 HTML 作为文本展示，危险帮助链接禁止发送', async () => {
  const attack = JSON.parse(JSON.stringify(dictionary));
  const payload = '<img src=x onerror="window.__impactXss=true">';
  attack.entries.find(item => item.id === sample.id).target = payload;
  attack.helpTopics[0].helpUrl = 'javascript:window.__impactXss=true';
  const securityPage = await context.newPage();
  try {
    await securityPage.route('**/impact-cn-mod/dict.js', route => route.fulfill({ contentType: 'text/javascript', body: `globalThis.IMPACT_CN_DICTIONARY = ${JSON.stringify(attack)};` }));
    await securityPage.goto(baseURL, { waitUntil: 'networkidle' });
    await securityPage.waitForFunction(() => Boolean(window.ImpactCN));
    await securityPage.evaluate(async () => { await window.ImpactCN.ready; });
    await securityPage.evaluate(({ source }) => { const node = document.createElement('div'); node.id = 'test-xss'; node.textContent = source; document.body.append(node); }, { source: sample.source });
    await waitTranslated(securityPage, 'test-xss', payload);
    assert.equal(await securityPage.locator('#test-xss img').count(), 0);
    assert.equal(await securityPage.evaluate(() => Boolean(window.__impactXss)), false);
    const result = await securityPage.evaluate(id => window.ImpactCN.askTopic(id), topic.id);
    assert.equal(result.ok, false); assert.equal(result.reason, 'configuration-or-page-error');
    assert.equal(await securityPage.locator('[data-impact-ai-input]').inputValue(), '');
    return 'HTML target stayed a Text node; javascript: HelpDoc rejected before filling';
  } finally { await securityPage.close(); }
});

await context.close();
rmSync(scriptProfile, { recursive: true, force: true });

const extensionProfile = mkdtempSync(path.join(os.tmpdir(), 'impact-cn-extension-'));
const extensionPath = path.join(root, 'impact-cn-mod');
let extensionContext;
await check('Manifest V3 真实扩展加载与隔离世界注入', async () => {
  extensionContext = await playwright.chromium.launchPersistentContext(extensionProfile, {
    executablePath: browserPath, channel: 'chromium', headless: true, viewport: { width: 1440, height: 1000 },
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
  });
  await extensionContext.route('https://app.impact.com/**', async route => {
    const url = new URL(route.request().url());
    let resource = path.join(root, decodeURIComponent(url.pathname));
    if (url.pathname.endsWith('/')) resource = path.join(resource, 'index.html');
    if (!resource.startsWith(root + path.sep) || !existsSync(resource)) return route.fulfill({ status: 404, body: 'Demo resource not found' });
    const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };
    await route.fulfill({ body: readFileSync(resource), contentType: types[path.extname(resource)] || 'application/octet-stream' });
  });
  const extPage = extensionContext.pages()[0] || await extensionContext.newPage();
  await extPage.goto('https://app.impact.com/demo/?extension=1', { waitUntil: 'networkidle' });
  await extPage.locator('#impact-cn-assistant').waitFor();
  assert.equal(await extPage.evaluate(() => Boolean(window.ImpactCN)), false, 'Demo must not inject script-mode localization when extension=1');
  await extPage.evaluate(({ source }) => { const node = document.createElement('span'); node.id = 'test-extension-dynamic'; node.textContent = source; document.body.append(node); }, { source: sample.source });
  await waitTranslated(extPage, 'test-extension-dynamic', sample.target);
  await extPage.locator('#impact-cn-assistant .impact-cn-launcher').click();
  await extPage.locator('#impact-cn-assistant .impact-cn-switch').uncheck();
  await waitTranslated(extPage, 'test-extension-dynamic', sample.source);
  await extPage.locator('#impact-cn-assistant .impact-cn-switch').check();
  await waitTranslated(extPage, 'test-extension-dynamic', sample.target);
  const extensionId = createHash('sha256').update(extensionPath).digest('hex').slice(0, 32).split('').map(digit => String.fromCharCode(97 + parseInt(digit, 16))).join('');
  const popupPage = await extensionContext.newPage();
  await popupPage.goto(`chrome-extension://${extensionId}/popup.html`);
  await popupPage.waitForFunction(() => Boolean(chrome.runtime.id));
  // A popup opened as a test tab becomes the active tab itself. Point the popup
  // at its only inactive host tab, equivalent to an action popup's host tab.
  const state = await popupPage.evaluate(async () => {
    [activeTab] = await chrome.tabs.query({ active: false, currentWindow: true });
    const state = await chrome.tabs.sendMessage(activeTab.id, { type: 'impact-cn:get-state' });
    showState(state); return state;
  });
  assert.equal(state.enabled, true);
  await popupPage.locator('#enabled').uncheck();
  await waitTranslated(extPage, 'test-extension-dynamic', sample.source);
  await extPage.reload({ waitUntil: 'networkidle' });
  await extPage.waitForFunction(() => document.querySelector('#impact-cn-assistant')?.dataset.enabled === 'false');
  await extPage.evaluate(({ source }) => { const node = document.createElement('span'); node.id = 'test-extension-dynamic'; node.textContent = source; document.body.append(node); }, { source: sample.source });
  await popupPage.locator('#enabled').check();
  await waitTranslated(extPage, 'test-extension-dynamic', sample.target);
  await popupPage.close();
  await extPage.locator('#impact-cn-assistant .impact-cn-launcher').click();
  await extPage.locator('#ai-open').click();
  await extPage.locator('#impact-cn-assistant').getByRole('button', { name: topic.label, exact: true }).click();
  await extPage.locator(`[data-impact-ai-messages] a[href="${topic.helpUrl}"]`).first().waitFor();
  await extPage.locator('#test-extension-dynamic').evaluate(node => node.remove());
  await extPage.screenshot({ path: path.join(artifacts, 'extension-loaded.png'), fullPage: false });
  return 'Chromium loaded unpacked MV3; no window.ImpactCN in main world; real popup runtime messages toggled localization and persisted across reload; sent question through host AI';
});
if (extensionContext) await extensionContext.close();
rmSync(extensionProfile, { recursive: true, force: true });

const fail = results.filter(result => result.status === 'FAIL');
const dateParts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map(part => [part.type, part.value]));
const reportDate = `${dateParts.year}-${dateParts.month}-${dateParts.day} ${dateParts.hour}:${dateParts.minute}:${dateParts.second}`;
const report = { status: fail.length ? 'FAIL' : 'PASS', date: reportDate, browser: browserPath, baseURL, results, limitations: ['Production app.impact.com login, real React page selectors and real AI responses have not been verified. The app.impact.com extension test serves the local fixture via Playwright routing.'] };
writeFileSync(path.join(artifacts, 'test-results.json'), JSON.stringify(report, null, 2));
writeFileSync(path.join(root, 'test-report.md'), `# 自动化测试报告\n\n结果：**${report.status}**\n\n时间：${report.date}（Asia/Seoul）\n\n浏览器：Playwright Chromium，真实加载 Manifest V3 解压扩展。\n\n${results.map(result => `- **${result.status}** ${result.name}：${result.evidence.replace(/\n/g, ' ')}`).join('\n')}\n\n## 验证范围\n\n本地 Demo 的 DOM 翻译、动态加载、文本恢复和模拟前端 AI 链路已测试。扩展测试使用 Playwright 将 app.impact.com 测试 URL 路由到本地页面，未连接客户账号。真实 Impact 页面、React 状态及在线 AI 回答尚未验证，不能将 Demo PASS 视为实站验收通过。\n\n详细机器报告位于 artifacts/test-results.json，截图位于 artifacts/demo-desktop.png、artifacts/demo-mobile.png、artifacts/extension-loaded.png。\n`);
console.log(`\n${report.status}: ${results.length - fail.length}/${results.length} checks. Report: ${path.join(root, 'test-report.md')}`);
process.exitCode = fail.length ? 1 : 0;

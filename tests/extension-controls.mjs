/** Real MV3 runtime/popup on a routed synthetic host; never real-site acceptance. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core'))); }
const extensionPath = path.join(root, 'impact-cn-mod');
const version = JSON.parse(readFileSync(path.join(extensionPath, 'manifest.json'), 'utf8')).version;
const sandbox = {}; vm.createContext(sandbox); vm.runInContext(readFileSync(path.join(extensionPath, 'dict.js'), 'utf8'), sandbox);
const actions = sandbox.IMPACT_CN_DICTIONARY.entries.find(entry => entry.id === 'actions');
const profile = mkdtempSync(path.join(os.tmpdir(), 'impact-controls-unit-'));
const results = [];
const onlyFilter = process.argv.find(argument => argument.startsWith('--only='))?.slice(7);
let context;
async function check(name, action) {
  if (onlyFilter && !new RegExp(onlyFilter, 'i').test(name)) return;
  try { const evidence = await action(); results.push({ name, status: 'PASS', evidence }); console.log(`EXTENSION UNIT PASS ${name}`); }
  catch (error) { results.push({ name, status: 'FAIL', evidence: error.message }); console.log(`EXTENSION UNIT FAIL ${name}: ${error.message}`); }
}
try {
  context = await chromium.launchPersistentContext(profile, { executablePath: chromium.executablePath(), channel: 'chromium', headless: true, viewport: { width: 1280, height: 900 }, args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`] });
  await context.route('https://demo.impact.com/**', route => route.fulfill({ contentType: 'text/html', body: `<!doctype html><body><main id="vueInstance"><snapshot-chart-shadow></snapshot-chart-shadow><span id="numeric">$123,456.78</span></main><div id="ask-impact-shadow-host"></div><script>
    const metric = document.querySelector('snapshot-chart-shadow').attachShadow({mode:'open'});
    const label = document.createElement('span'); label.className='secondaryFieldLabel__unit'; label.textContent='Actions'; metric.append(label);
    const ai = document.querySelector('#ask-impact-shadow-host').attachShadow({mode:'open'});
    const input = document.createElement('textarea'); input.placeholder='ask impact...'; ai.append(input);
    const send = document.createElement('button'); send.setAttribute('aria-label','Send'); send.textContent='Send'; ai.append(send);
    window.__controlsUnit={textNode:label.firstChild,element:label,sends:0,inputEvents:0};
    input.addEventListener('input',()=>window.__controlsUnit.inputEvents++);
    send.addEventListener('click',()=>{window.__controlsUnit.sends++;input.value='';});
    </script></body>` }));
  const host = context.pages()[0] || await context.newPage(); host.setDefaultTimeout(8000);
  await host.goto('https://demo.impact.com/secure/advertiser/engage/aview.ihtml?synthetic-runtime-unit=1');
  await host.locator('#impact-cn-assistant').waitFor();
  const extensionId = createHash('sha256').update(extensionPath).digest('hex').slice(0, 32).split('').map(digit => String.fromCharCode(97 + parseInt(digit, 16))).join('');
  const popup = await context.newPage(); popup.setDefaultTimeout(8000);
  await popup.goto(`chrome-extension://${extensionId}/popup.html`);
  await popup.waitForFunction(() => Boolean(chrome.runtime.id));
  await popup.bringToFront();
  // A popup hosted in a test tab is active itself. Bind its normal handlers to
  // the synthetic host, as Chrome's actual action popup binds the active host.
  await popup.evaluate(async () => {
    [activeTab] = await chrome.tabs.query({ active: false, currentWindow: true });
    window.__controlsHostId = activeTab.id;
    await readPageState();
  });
  async function state() { return popup.evaluate(() => chrome.tabs.sendMessage(window.__controlsHostId, { type: 'impact-cn:get-state' })); }
  async function setState(enabled, aiEnabled) {
    return popup.evaluate(async values => {
      await chrome.tabs.sendMessage(window.__controlsHostId, { type: 'impact-cn:set-enabled', enabled: values.enabled });
      return chrome.tabs.sendMessage(window.__controlsHostId, { type: 'impact-cn:set-ai-enabled', aiEnabled: values.aiEnabled });
    }, { enabled, aiEnabled });
  }
  async function assertBehavior(enabled, aiEnabled) {
    await host.waitForFunction(({ enabled, aiEnabled, target }) => {
      const assistant = document.querySelector('#impact-cn-assistant'); const test = window.__controlsUnit;
      return assistant?.dataset.enabled === String(enabled) && assistant.dataset.aiEnabled === String(aiEnabled) && test.textNode.nodeValue === (enabled ? target : 'Actions');
    }, { enabled, aiEnabled, target: actions.target });
    assert.equal(await host.locator('snapshot-chart-shadow [data-impact-cn-help][data-topic-id="actions"]').count(), aiEnabled ? 1 : 0);
    assert(await host.evaluate(() => window.__controlsUnit.element.firstChild === window.__controlsUnit.textNode && document.querySelector('#numeric').firstChild.nodeValue === '$123,456.78'));
  }
  await check('Loaded MV3 isolated content script defaults both independent controls to on', async () => {
    assert.equal(await host.evaluate(() => Boolean(window.ImpactCN)), false);
    const current = await state(); assert.equal(current.enabled, true); assert.equal(current.aiEnabled, true); assert.equal(current.version, version);
    await assertBehavior(true, true);
    assert(await popup.locator('#enabled').isChecked()); assert(await popup.locator('#ai-enabled').isChecked());
    return `Real unpacked MV3 ${version}; routed synthetic DOM; original Text and numeric values preserved`;
  });
  await check('Popup AI toggle and page AI toggle synchronize through real storage/runtime events', async () => {
    await popup.locator('#ai-enabled').uncheck(); await assertBehavior(true, false);
    await host.locator('#impact-cn-assistant .impact-cn-launcher').click();
    await host.locator('#impact-cn-assistant .impact-cn-ai-switch').check(); await assertBehavior(true, true);
    await popup.waitForFunction(() => document.querySelector('#ai-enabled').checked);
    await host.locator('#impact-cn-assistant .impact-cn-ai-switch').uncheck(); await assertBehavior(true, false);
    await popup.waitForFunction(() => !document.querySelector('#ai-enabled').checked);
    const saved = await popup.evaluate(() => chrome.storage.local.get(['impactCNEnabled', 'impactCNAIEnabled']));
    assert.equal(saved.impactCNAIEnabled, false); assert.equal((await state()).enabled, true);
    return 'Popup -> page and page -> popup; AI setting persisted independently of translation';
  });
  await check('Runtime messages enforce all four translation/AI combinations independently', async () => {
    for (const [enabled, aiEnabled] of [[false, true], [true, false], [false, false], [true, true]]) {
      await setState(enabled, aiEnabled); await assertBehavior(enabled, aiEnabled);
      const current = await state(); assert.equal(current.enabled, enabled); assert.equal(current.aiEnabled, aiEnabled);
      await popup.waitForFunction(values => document.querySelector('#enabled').checked === values.enabled && document.querySelector('#ai-enabled').checked === values.aiEnabled, { enabled, aiEnabled });
    }
    return 'English+question, Chinese without question, English without question, Chinese+question all verified';
  });
  await check('Direct storage changes synchronize both UIs and both settings survive page reload', async () => {
    await popup.evaluate(() => chrome.storage.local.set({ impactCNEnabled: false, impactCNAIEnabled: true })); await assertBehavior(false, true);
    await popup.waitForFunction(() => !document.querySelector('#enabled').checked && document.querySelector('#ai-enabled').checked);
    await host.reload(); await host.locator('#impact-cn-assistant').waitFor(); await assertBehavior(false, true);
    await host.locator('#impact-cn-assistant .impact-cn-launcher').click();
    await host.locator('#impact-cn-assistant .impact-cn-switch').check();
    await host.locator('#impact-cn-assistant .impact-cn-ai-switch').uncheck(); await assertBehavior(true, false);
    await popup.waitForFunction(() => document.querySelector('#enabled').checked && !document.querySelector('#ai-enabled').checked);
    const saved = await popup.evaluate(() => chrome.storage.local.get(['impactCNEnabled', 'impactCNAIEnabled']));
    assert.deepEqual(saved, { impactCNEnabled: true, impactCNAIEnabled: false });
    return 'chrome.storage.onChanged updates live page and open popup; reload retains independent settings';
  });
  await check('Translation-off English term question uses the native shadow editor once', async () => {
    await setState(false, true); await assertBehavior(false, true);
    if (!await host.locator('#impact-cn-assistant-panel').isHidden()) await host.locator('#impact-cn-assistant .impact-cn-close').click();
    await host.locator('snapshot-chart-shadow [data-impact-cn-help][data-topic-id="actions"]').click();
    await host.waitForFunction(() => window.__controlsUnit.sends === 1);
    assert(await host.evaluate(() => window.__controlsUnit.inputEvents > 0 && window.__controlsUnit.textNode.nodeValue === 'Actions'));
    assert.equal(await host.locator('#ask-impact-shadow-host textarea').inputValue(), '');
    return 'One native input/send event path; original English term preserved; no synthetic assistant reply used';
  });
  await check('Dragging is memory-only, survives setting changes, and reload restores the default location', async () => {
    const assistant = host.locator('#impact-cn-assistant');
    const handle = host.locator('[data-impact-cn-drag-handle],.impact-cn-drag-handle');
    const start = await assistant.boundingBox(); const grip = await handle.boundingBox();
    const direction = start.x > 640 ? -1 : 1;
    await host.mouse.move(grip.x + grip.width / 2, grip.y + grip.height / 2); await host.mouse.down();
    await host.mouse.move(grip.x + grip.width / 2 + direction * 250, grip.y + grip.height / 2 - 180, { steps: 10 }); await host.mouse.up();
    const dragged = await assistant.boundingBox(); assert(Math.abs(dragged.x - start.x) > 100);
    await setState(true, false); await assertBehavior(true, false);
    const afterSettings = await assistant.boundingBox(); assert(Math.abs(afterSettings.x - dragged.x) <= 1 && Math.abs(afterSettings.y - dragged.y) <= 1);
    await host.reload(); await host.locator('#impact-cn-assistant').waitFor(); await assertBehavior(true, false);
    const restored = await assistant.boundingBox(); assert(Math.abs(900 - restored.y - restored.height - 140) <= 2);
    const saved = await popup.evaluate(() => chrome.storage.local.get(null));
    assert(Object.keys(saved).every(key => !/(?:position|coordinate|drag|offset)/i.test(key)));
    return 'Dedicated pointer drag moved assistant; settings did not reposition it; refresh resets 140px bottom without persisting coordinates';
  });
} catch (error) {
  results.push({ name: 'Real extension runtime harness setup', status: 'FAIL', evidence: error.message });
  console.log(`EXTENSION UNIT FAIL runtime harness setup: ${error.message}`);
} finally {
  if (context) await context.close(); rmSync(profile, { recursive: true, force: true });
}
if (onlyFilter) {
  const prior = JSON.parse(readFileSync(path.join(root, 'artifacts/extension-controls-report.json'), 'utf8'));
  assert.equal(prior.version, version, 'A partial recheck requires an existing report for the same version');
  const fresh = [...results]; results.splice(0, results.length, ...prior.results.map(result => fresh.find(item => item.name === result.name) || result));
  for (const result of fresh) if (!results.some(item => item.name === result.name)) results.push(result);
}
const status = results.some(result => result.status === 'FAIL') ? 'FAIL' : results.length === 6 ? 'PASS' : 'FAIL';
mkdirSync(path.join(root, 'artifacts'), { recursive: true });
writeFileSync(path.join(root, 'artifacts/extension-controls-report.json'), JSON.stringify({ mode: 'REAL_EXTENSION_SYNTHETIC_HOST', realSiteAcceptance: false, version, lastPartialRecheck: onlyFilter || null, status, results }, null, 2));
writeFileSync(path.join(root, 'extension-test-report.md'), `# 扩展控制回归\n\n版本：${version}\n\n结果：**${status} ${results.filter(result => result.status === 'PASS').length}/${results.length}**\n\n真实加载 Manifest V3、使用 Chrome popup/runtime/storage API；host DOM 经测试路由合成。本报告不构成 demo.impact.com 实网或真实 AI 回复验收。\n\n${results.map(result => `- **${result.status}** ${result.name}: ${result.evidence}`).join('\n')}\n`);
console.log(`REAL EXTENSION / SYNTHETIC HOST ${status}: ${results.filter(result => result.status === 'PASS').length}/${results.length}`);
process.exitCode = status === 'PASS' ? 0 : 1;

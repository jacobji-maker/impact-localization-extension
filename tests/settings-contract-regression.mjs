/** Pure settings and popup failure/order checks. No browser or network access. */
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const extension = path.join(root, 'impact-cn-mod');
const source = readFileSync(path.join(extension, 'settings-contract.js'), 'utf8');
const popupSource = readFileSync(path.join(extension, 'popup.js'), 'utf8');
const manifest = JSON.parse(readFileSync(path.join(extension, 'manifest.json'), 'utf8'));
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(source, sandbox);
const contract = sandbox.IMPACT_CN_SETTINGS;
const plain = value => JSON.parse(JSON.stringify(value));
const results = [];
async function check(name, action) {
  try { await action(); results.push({ name, status: 'PASS' }); console.log('SETTINGS PASS ' + name); }
  catch (error) { results.push({ name, status: 'FAIL', evidence: error.message }); console.log('SETTINGS FAIL ' + name + ': ' + error.message); }
}
const flush = () => new Promise(resolve => setImmediate(resolve));
async function popup({ stored = {}, readFails = false, writeFails = false, messageFails = false } = {}) {
  const calls = [], storageListeners = [];
  const control = () => ({ checked: false, disabled: false, textContent: '', listeners: {}, addEventListener(name, handler) { this.listeners[name] = handler; } });
  const toggle = control(), aiToggle = control(), status = control(), footer = control();
  const context = vm.createContext({
    document: { getElementById: id => ({ enabled: toggle, 'ai-enabled': aiToggle, status })[id], querySelector: () => footer },
    chrome: {
      runtime: { getManifest: () => ({ version: manifest.version }) },
      storage: {
        local: {
          async get(keys) { calls.push(['get', Array.from(keys)]); if (readFails) throw Error('synthetic read failure'); return { ...stored }; },
          async set(values) { calls.push(['set', plain(values)]); if (writeFails) throw Error('synthetic write failure'); Object.assign(stored, values); }
        },
        onChanged: { addListener: handler => storageListeners.push(handler) }
      },
      tabs: {
        async query() { return [{ id: 7 }]; },
        async sendMessage(_tab, message) { calls.push(['message', plain(message)]); if (messageFails) throw Error('synthetic message failure'); return { translatedCount: 3 }; }
      }
    }
  });
  vm.runInContext(source, context);
  vm.runInContext(popupSource, context);
  await flush();
  return { toggle, aiToggle, status, calls, storageListeners, context };
}

await check('Absent, deleted and legacy stored values keep the explicit-false-only defaults', () => {
  assert.deepEqual(plain(contract.decodeStored({})), { enabled: true, aiEnabled: true });
  for (const enabled of [false, true]) for (const aiEnabled of [false, true]) {
    assert.deepEqual(plain(contract.decodeStored({ impactCNEnabled: enabled, impactCNAIEnabled: aiEnabled })), { enabled, aiEnabled });
  }
  for (const value of [undefined, null, 0, '', 'false']) assert.equal(contract.decodeStored({ impactCNEnabled: value }).enabled, true);
  assert.deepEqual(plain(contract.decodeChanges({ impactCNEnabled: {} }, 'local', { enabled: false, aiEnabled: true })), { enabled: true });
});
await check('Storage decoding ignores other areas and duplicate events without mutating inputs', () => {
  const changes = { impactCNEnabled: { newValue: false }, impactCNAIEnabled: { newValue: true } };
  const current = { enabled: false, aiEnabled: true }, before = JSON.stringify({ changes, current });
  assert.deepEqual(plain(contract.decodeChanges(changes, 'local', current)), {});
  assert.deepEqual(plain(contract.decodeChanges(changes, 'sync', { enabled: true, aiEnabled: false })), {});
  assert.deepEqual(plain(contract.decodeChanges(changes, 'local', { enabled: true, aiEnabled: false })), current);
  assert.equal(JSON.stringify({ changes, current }), before);
  for (const value of [contract, contract.keys, contract.defaults, contract.messages]) assert(Object.isFrozen(value));
});
await check('Every runtime consumer loads the shared contract before its own script', () => {
  for (const entry of manifest.content_scripts) {
    assert(entry.js.indexOf('settings-contract.js') >= 0);
    assert(entry.js.indexOf('settings-contract.js') < entry.js.indexOf('content.js'));
  }
  const html = readFileSync(path.join(extension, 'popup.html'), 'utf8');
  assert(html.indexOf('src="settings-contract.js"') < html.indexOf('src="popup.js"'));
});
await check('Popup preserves save-before-notify ordering for both independent controls', async () => {
  const env = await popup();
  assert(env.toggle.checked && env.aiToggle.checked);
  for (const [control, key, type] of [[env.toggle, 'impactCNEnabled', 'impact-cn:set-enabled'], [env.aiToggle, 'impactCNAIEnabled', 'impact-cn:set-ai-enabled']]) {
    env.calls.length = 0;
    control.checked = false;
    control.listeners.change();
    await flush();
    assert.deepEqual(env.calls, [['set', { [key]: false }], ['message', { type, enabled: false }]]);
    assert.equal(control.disabled, false);
  }
});
await check('Popup storage notifications decode removals without writing or sending setting commands', async () => {
  const env = await popup({ stored: { impactCNEnabled: false, impactCNAIEnabled: false } });
  env.calls.length = 0;
  env.storageListeners[0]({ impactCNEnabled: {}, impactCNAIEnabled: { newValue: true } }, 'local');
  await flush();
  assert(env.toggle.checked && env.aiToggle.checked);
  assert.deepEqual(env.calls.map(call => call[0]), ['message']);
  assert.equal(env.calls[0][1].type, 'impact-cn:get-state');
  env.calls.length = 0;
  env.storageListeners[0]({ impactCNEnabled: { newValue: false } }, 'sync');
  await flush();
  assert(env.toggle.checked);
  assert.deepEqual(env.calls, []);
});
await check('Storage and page-message failures retain the existing popup failure behavior', async () => {
  const failedSave = await popup({ writeFails: true });
  failedSave.calls.length = 0;
  failedSave.toggle.checked = false;
  failedSave.toggle.listeners.change();
  await flush();
  assert.deepEqual(failedSave.calls.map(call => call[0]), ['set']);
  assert.match(failedSave.status.textContent, /保存/);
  assert.equal(failedSave.toggle.disabled, false);
  const failedRead = await popup({ readFails: true });
  assert.match(failedRead.status.textContent, /读取/);
  assert(!failedRead.toggle.disabled && !failedRead.aiToggle.disabled);
  const missingPage = await popup({ messageFails: true });
  missingPage.calls.length = 0;
  missingPage.aiToggle.checked = false;
  missingPage.aiToggle.listeners.change();
  await flush();
  assert.deepEqual(missingPage.calls.map(call => call[0]), ['set', 'message']);
  assert(!missingPage.aiToggle.disabled);
});

const status = results.every(result => result.status === 'PASS') ? 'PASS' : 'FAIL';
const report = { mode: 'SETTINGS_VM_ONLY', realSiteAcceptance: false, version: manifest.version, status, results };
const reportDir = process.argv.find(argument => argument.startsWith('--report-dir='))?.slice('--report-dir='.length);
if (reportDir) {
  mkdirSync(reportDir, { recursive: true });
  writeFileSync(path.join(reportDir, 'settings-contract-report.json'), JSON.stringify(report, null, 2) + '\n');
}
console.log('SETTINGS ' + status + ': ' + results.filter(result => result.status === 'PASS').length + '/' + results.length);
process.exitCode = status === 'PASS' ? 0 : 1;

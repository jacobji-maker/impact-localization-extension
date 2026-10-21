/** Initialization/destroy races on intercepted synthetic documents only. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const extension = path.join(root, 'impact-cn-mod');
const argument = key => process.argv.find(value => value.startsWith(key + '='))?.slice(key.length + 1);
const contentPath = path.resolve(argument('--content-source') || path.join(extension, 'content.js'));
const contentSource = readFileSync(contentPath, 'utf8');
const configSource = readFileSync(path.join(extension, 'site-config.js'), 'utf8');
const settingsSource = readFileSync(path.join(extension, 'settings-contract.js'), 'utf8');
const manifest = JSON.parse(readFileSync(path.join(extension, 'manifest.json'), 'utf8'));
const sourceSha256 = createHash('sha256').update(contentSource).digest('hex');
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core'))); }

const topPath = '/secure/advertiser/engage/checklist/instance/synthetic-lifecycle';
const assetPath = '/onboarding-ui/checklist-assets/production/migrated/event-type-validation.html';
const fixture = rootID => `<!doctype html><body><main id="${rootID}"><p id="fixture-copy" data-fixture-copy>Lifecycle sample</p><div id="fixture-shadow-host"></div><input id="fixture-input" value="fixed synthetic value"><button id="fixture-native-button" type="button">Native control</button></main></body>`;
const results = [];
let browser;

async function check(name, action) {
  try {
    const evidence = await action();
    results.push({ name, status: 'PASS', evidence });
    console.log('LIFECYCLE PASS ' + name);
  } catch (error) {
    results.push({ name, status: 'FAIL', evidence: error.message, ...(error.details ? { details: error.details } : {}) });
    console.log('LIFECYCLE FAIL ' + name + ': ' + error.message);
  }
}

// All instrumentation belongs to this fresh synthetic page. The saved native
// timer lets the harness settle microtasks without entering product counts.
function installHarness() {
  const nativeSetTimeout = window.setTimeout.bind(window);
  const nativeClearTimeout = window.clearTimeout.bind(window);
  const nativeSetInterval = window.setInterval.bind(window);
  const nativeClearInterval = window.clearInterval.bind(window);
  const nativeAdd = EventTarget.prototype.addEventListener;
  const nativeRemove = EventTarget.prototype.removeEventListener;
  const NativeObserver = window.MutationObserver;
  const events = [], observers = new Set(), timeouts = new Set(), intervals = new Set();
  const runtimeListeners = new Set(), storageListeners = new Set();
  const states = [], messages = [], storageCalls = [];
  const registrations = { events: 0, observers: 0, timeouts: 0, intervals: 0, runtime: 0, storage: 0 };
  const deferred = () => {
    let resolve, reject;
    const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
    return { promise, resolve, reject };
  };
  const storage = deferred(), context = deferred();
  const shadow = document.querySelector('#fixture-shadow-host').attachShadow({ mode: 'open' });
  const shadowLabel = document.createElement('span');
  shadowLabel.dataset.fixtureCopy = '';
  shadowLabel.textContent = 'Lifecycle sample';
  shadow.append(shadowLabel);
  const copies = [document.querySelector('#fixture-copy'), shadowLabel].map(element => ({ element, node: element.firstChild, text: element.firstChild.nodeValue }));
  const originalInput = document.querySelector('#fixture-input');
  const nativeButton = document.querySelector('#fixture-native-button');
  let nativeClicks = 0;
  nativeButton.addEventListener('click', () => nativeClicks++);
  document.addEventListener('impact-cn:state', event => states.push({ ...event.detail }));
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    const capture = typeof options === 'boolean' ? options : Boolean(options?.capture);
    if (!events.some(record => record.target === this && record.type === type && record.listener === listener && record.capture === capture)) {
      events.push({ target: this, type, listener, capture });
      registrations.events++;
    }
    return nativeAdd.call(this, type, listener, options);
  };
  EventTarget.prototype.removeEventListener = function(type, listener, options) {
    const capture = typeof options === 'boolean' ? options : Boolean(options?.capture);
    const index = events.findIndex(record => record.target === this && record.type === type && record.listener === listener && record.capture === capture);
    if (index >= 0) events.splice(index, 1);
    return nativeRemove.call(this, type, listener, options);
  };
  window.MutationObserver = class extends NativeObserver {
    observe(...args) { observers.add(this); registrations.observers++; return super.observe(...args); }
    disconnect() { observers.delete(this); return super.disconnect(); }
  };
  window.setTimeout = (callback, delay, ...args) => {
    registrations.timeouts++;
    const id = nativeSetTimeout((...values) => { timeouts.delete(id); callback(...values); }, delay, ...args);
    timeouts.add(id);
    return id;
  };
  window.clearTimeout = id => { timeouts.delete(id); return nativeClearTimeout(id); };
  window.setInterval = (callback, delay, ...args) => {
    registrations.intervals++;
    const id = nativeSetInterval(callback, delay, ...args);
    intervals.add(id);
    return id;
  };
  window.clearInterval = id => { intervals.delete(id); return nativeClearInterval(id); };
  Object.assign(window.chrome, {
    runtime: {
      id: 'synthetic-lifecycle-extension',
      sendMessage(message) { messages.push({ ...message }); return context.promise; },
      onMessage: {
        addListener(listener) { registrations.runtime++; runtimeListeners.add(listener); },
        removeListener(listener) { runtimeListeners.delete(listener); }
      }
    },
    storage: {
      local: {
        get(keys) { storageCalls.push([...keys]); return storage.promise; },
        async set() { throw Error('Unexpected storage write in initialization lifecycle test'); }
      },
      onChanged: {
        addListener(listener) { registrations.storage++; storageListeners.add(listener); },
        removeListener(listener) { storageListeners.delete(listener); }
      }
    }
  });
  window.__lifecycle = {
    pause: milliseconds => new Promise(resolve => nativeSetTimeout(resolve, milliseconds)),
    settleStorage: (outcome, values = {}) => outcome === 'reject' ? storage.reject(Error('synthetic storage read failure')) : storage.resolve(values),
    settleContext: outcome => outcome === 'reject' ? context.reject(Error('synthetic context failure')) : context.resolve({ allowed: outcome === 'allow' }),
    snapshot: () => ({
      active: { events: events.length, observers: observers.size, timeouts: timeouts.size, intervals: intervals.size, runtime: runtimeListeners.size, storage: storageListeners.size },
      registrations: { ...registrations }, storageCalls: storageCalls.length, messages: messages.map(message => message.type), states: states.map(state => ({ ...state })),
      state: window.ImpactCN?.getState(), assistant: Boolean(document.querySelector('#impact-cn-assistant')),
      texts: copies.map(({ element }) => element.textContent),
      nativeIdentity: copies.every(({ element, node }) => element.isConnected && element.firstChild === node && element.childNodes.length === 1) && originalInput.value === 'fixed synthetic value',
      restored: copies.every(({ node, text }) => node.nodeValue === text),
      nativeClicks
    }),
    clickNative: () => nativeButton.click()
  };
}

async function openFixture(asset = false) {
  const context = await browser.newContext();
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.origin === 'https://demo.impact.com' && url.pathname === topPath) {
      const body = asset ? `<!doctype html><body><iframe id="synthetic-asset" src="https://ui.assets.impact.com${assetPath}"></iframe></body>` : fixture('vueInstance');
      return route.fulfill({ contentType: 'text/html', body });
    }
    if (asset && url.origin === 'https://ui.assets.impact.com' && url.pathname === assetPath) return route.fulfill({ contentType: 'text/html', body: fixture('app') });
    return route.abort('blockedbyclient');
  });
  const page = await context.newPage();
  await page.goto('https://demo.impact.com' + topPath);
  if (asset) await page.locator('#synthetic-asset').contentFrame().locator('#fixture-copy').waitFor();
  const frame = asset ? page.frames().find(item => item.url() === 'https://ui.assets.impact.com' + assetPath) : page.mainFrame();
  assert(frame, 'Synthetic target frame missing');
  await frame.evaluate(installHarness);
  await frame.evaluate(code => { (0, eval)(code); }, configSource);
  await frame.evaluate(code => { (0, eval)(code); }, settingsSource);
  await frame.evaluate(({ version, asset, topPath, assetPath }) => {
    window.IMPACT_CN_DICTIONARY = {
      version, helpTopics: [], entries: [{ id: 'synthetic-lifecycle-copy', source: 'Lifecycle sample', target: '生命周期样例',
        scope: { hosts: [asset ? 'ui.assets.impact.com' : 'demo.impact.com'], pathExact: asset ? assetPath : topPath, selector: '[data-fixture-copy]', ...(asset ? { checklistFrame: true } : {}) } }]
    };
  }, { version: manifest.version, asset, topPath, assetPath });
  await frame.evaluate(code => { (0, eval)(code); }, contentSource);
  return { context, page, frame };
}

const snapshot = frame => frame.evaluate(() => window.__lifecycle.snapshot());
async function settle(frame) {
  await frame.evaluate(async () => { await window.ImpactCN.ready; await window.__lifecycle.pause(90); });
}
function assertDormant(before, after, expectedStorageCalls) {
  const failures = [];
  if (after.state.enabled !== false || after.state.aiEnabled !== false || after.state.translatedCount !== 0) failures.push('destroyed state was overwritten');
  if (after.assistant) failures.push('assistant was registered after destroy');
  if (Object.values(after.active).some(Boolean)) failures.push('resources remain active after destroy');
  if (JSON.stringify(after.registrations) !== JSON.stringify(before.registrations)) failures.push('new resources were registered after destroy');
  if (after.storageCalls !== expectedStorageCalls) failures.push('storage was called after an earlier initialization wait was destroyed');
  if (!after.restored || !after.nativeIdentity) failures.push('original native Text or identity changed');
  if (after.states.some(state => state.enabled || state.aiEnabled)) failures.push('a live state was emitted after destroy');
  if (failures.length) {
    const error = Error(failures.join('; '));
    error.details = { before, after };
    throw error;
  }
}

try {
  browser = await chromium.launch({ headless: true, executablePath: chromium.executablePath(), channel: 'chromium' });
  for (const outcome of ['resolve', 'reject']) {
    await check(`Top document destroyed while storage waits, then ${outcome}`, async () => {
      const env = await openFixture();
      try {
        assert.equal((await snapshot(env.frame)).storageCalls, 1);
        await env.frame.evaluate(() => window.ImpactCN.destroy());
        const before = await snapshot(env.frame);
        await env.frame.evaluate(outcome => window.__lifecycle.settleStorage(outcome), outcome);
        await settle(env.frame);
        const after = await snapshot(env.frame);
        assertDormant(before, after, 1);
        return after;
      } finally { await env.context.close(); }
    });
  }
  for (const outcome of ['allow', 'deny', 'reject']) {
    await check(`Asset frame destroyed while context waits, then ${outcome}`, async () => {
      const env = await openFixture(true);
      try {
        const pending = await snapshot(env.frame);
        assert.equal(pending.storageCalls, 0);
        assert.deepEqual(pending.messages, ['impact-cn:checklist-frame-context']);
        await env.frame.evaluate(() => window.ImpactCN.destroy());
        const before = await snapshot(env.frame);
        await env.frame.evaluate(outcome => window.__lifecycle.settleContext(outcome), outcome);
        // Settle a potentially incorrectly-started storage read so a baseline
        // regression is recorded instead of leaving ready pending forever.
        await env.frame.evaluate(() => window.__lifecycle.settleStorage('resolve'));
        await settle(env.frame);
        const after = await snapshot(env.frame);
        assertDormant(before, after, 0);
        return after;
      } finally { await env.context.close(); }
    });
  }
  for (const outcome of ['resolve', 'reject']) {
    await check(`Asset frame context allowed, destroyed while storage waits, then ${outcome}`, async () => {
      const env = await openFixture(true);
      try {
        await env.frame.evaluate(async () => { window.__lifecycle.settleContext('allow'); await window.__lifecycle.pause(0); });
        assert.equal((await snapshot(env.frame)).storageCalls, 1);
        await env.frame.evaluate(() => window.ImpactCN.destroy());
        const before = await snapshot(env.frame);
        await env.frame.evaluate(outcome => window.__lifecycle.settleStorage(outcome), outcome);
        await settle(env.frame);
        const after = await snapshot(env.frame);
        assertDormant(before, after, 1);
        return after;
      } finally { await env.context.close(); }
    });
  }
  for (const outcome of ['resolve', 'reject']) {
    await check(`Normal top initialization (${outcome}) preserves defaults and destroy restores native Text`, async () => {
      const env = await openFixture();
      try {
        await env.frame.evaluate(outcome => window.__lifecycle.settleStorage(outcome), outcome);
        await settle(env.frame);
        const initialized = await snapshot(env.frame);
        assert.equal(initialized.state.enabled, true);
        assert.equal(initialized.state.aiEnabled, true);
        assert.equal(initialized.state.translatedCount, 2);
        assert.equal(initialized.assistant, true);
        assert(initialized.active.observers >= 2);
        assert.equal(initialized.active.intervals, 1);
        assert.equal(initialized.active.runtime, 1);
        assert.equal(initialized.active.storage, 1);
        assert(initialized.nativeIdentity);
        assert.deepEqual(initialized.texts, ['生命周期样例', '生命周期样例']);
        if (outcome === 'reject') assert.match(initialized.state.error, /无法读取浏览器设置/);
        else assert.equal(initialized.state.error, '');
        await env.frame.evaluate(() => { window.ImpactCN.destroy(); window.ImpactCN.destroy(); window.ImpactCN.refresh(); window.__lifecycle.clickNative(); });
        const afterDestroy = await snapshot(env.frame);
        await env.frame.evaluate(() => window.__lifecycle.pause(90));
        const final = await snapshot(env.frame);
        assert.equal(final.state.enabled, false);
        assert.equal(final.state.aiEnabled, false);
        assert.equal(final.state.translatedCount, 0);
        assert.equal(final.assistant, false);
        assert(Object.values(final.active).every(count => count === 0), JSON.stringify(final.active));
        assert.deepEqual(final.registrations, afterDestroy.registrations);
        assert(final.restored && final.nativeIdentity);
        assert.equal(final.nativeClicks, 1);
        assert.equal(final.states.filter(state => state.destroyed).length, 1);
        return { initialized, afterDestroy: final };
      } finally { await env.context.close(); }
    });
  }
} catch (error) {
  results.push({ name: 'Synthetic browser harness', status: 'FAIL', evidence: error.stack || error.message });
  console.log('LIFECYCLE HARNESS FAIL ' + error.message);
} finally {
  await browser?.close();
}
const status = results.length === 9 && results.every(result => result.status === 'PASS') ? 'PASS' : 'FAIL';
const report = { mode: 'SYNTHETIC_INTERCEPTED_BROWSER_ONLY', realSiteAcceptance: false, network: 'Every request fulfilled from fixed HTML or aborted', fixtureVersion: manifest.version, contentVersion: argument('--content-version') || manifest.version,
  contentSource: path.relative(root, contentPath), contentSha256: sourceSha256, status, results };
const reportDir = argument('--report-dir');
if (reportDir) {
  mkdirSync(reportDir, { recursive: true });
  writeFileSync(path.join(reportDir, 'initialization-lifecycle-report.json'), JSON.stringify(report, null, 2) + '\n');
}
console.log('LIFECYCLE ' + status + ': ' + results.filter(result => result.status === 'PASS').length + '/' + results.length);
process.exitCode = status === 'PASS' ? 0 : 1;

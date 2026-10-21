/** Isolated read-only guide bridge VM checks. No browser, business data or storage. */
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const sourceDir = path.join(root, 'impact-cn-mod');
const onlyFilter = process.argv.find(argument => argument.startsWith('--only='))?.slice('--only='.length);
const sources = Object.fromEntries(['journey.js', 'background.js', 'dict.js'].map(name => [name, readFileSync(path.join(sourceDir, name), 'utf8')]));
const contentSource = readFileSync(path.join(sourceDir, 'content.js'), 'utf8');
const clone = value => value === undefined ? undefined : JSON.parse(JSON.stringify(value));
const epoch = '11111111-1111-4111-8111-111111111111';
const nextEpoch = '22222222-2222-4222-8222-222222222222';
const requestId = '33333333-3333-4333-8333-333333333333';
const nextRequestId = '44444444-4444-4444-8444-444444444444';
const checklistPath = '/secure/advertiser/checklist/checklist-instance.ihtml';
const framePath = '/onboarding-ui/checklist-assets/production/migrated/event-type-validation.html';
const origin = 'https://demo.impact.com';
const topUrl = origin + checklistPath;
const results = [];
const flush = async () => { for (let n = 0; n < 10; n += 1) await Promise.resolve(); };
function deferred() { let resolve; const promise = new Promise(done => { resolve = done; }); return { promise, resolve }; }
async function check(name, action) {
  if (onlyFilter && !new RegExp(onlyFilter, 'i').test(name)) return;
  try { await action(); results.push({ name, status: 'PASS' }); console.log('GUIDE PROTOCOL PASS ' + name); }
  catch (error) { results.push({ name, status: 'FAIL', evidence: error.stack }); console.log('GUIDE PROTOCOL FAIL ' + name + ': ' + error.message); }
}
function fixture() {
  let listener, clock = 1800000000000, sequence = 0;
  const timers = new Map(), calls = [], hooks = {}, current = new Map([[7, epoch]]);
  const frame = { frameId: 2, documentId: 'synthetic-frame-document' };
  const fixedDate = class extends Date { static now() { return clock; } };
  const context = vm.createContext({ URL, URLSearchParams, Date: fixedDate,
    setTimeout(fn, delay) { const id = ++sequence; timers.set(id, { fn, due: clock + delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
    chrome: {
      runtime: { id: 'guide-fixture-runtime', onMessage: { addListener(fn) { assert.equal(listener, undefined); listener = fn; } } },
      storage: new Proxy({}, { get() { throw Error('Guide bridge must never access storage'); } }),
      tabs: { onRemoved: { addListener() {} }, async sendMessage(tabId, message, options) {
        calls.push({ tabId, message: clone(message), ...(options === undefined ? {} : { options: clone(options) }) });
        if (message.type === 'impact-cn:journey-current-context') {
          assert.deepEqual(clone(options), { frameId: 0 });
          await hooks.current?.(tabId, message);
          return { active: current.get(tabId) === message.contextEpoch, contextEpoch: current.get(tabId) };
        }
        if (message.type === 'impact-cn:guide-probe-frame') { await hooks.broadcast?.(tabId, message); return undefined; }
        if (message.type === 'impact-cn:guide-confirm-frame') {
          await hooks.confirm?.(tabId, message, options);
          return { active: options?.frameId === frame.frameId && options?.documentId === frame.documentId && hooks.frameActive !== false };
        }
        throw Error('Unexpected bridge transport type');
      } }
    },
    importScripts(...names) { for (const name of names) vm.runInContext(sources[name], context, { filename: name }); }
  });
  vm.runInContext(sources['background.js'], context, { filename: 'background.js' });
  const sender = (overrides = {}) => ({ id: 'guide-fixture-runtime', frameId: 0, documentId: 'synthetic-top-document',
    url: topUrl, tab: { id: 7, url: topUrl }, ...overrides });
  const child = (overrides = {}) => sender({ frameId: frame.frameId, documentId: frame.documentId,
    url: 'https://ui.assets.impact.com' + framePath, ...overrides });
  const send = (message, source = sender()) => {
    let responseCount = 0, settled = false, asynchronous;
    const promise = new Promise((resolve, reject) => {
      try {
        asynchronous = listener(message, source, result => { responseCount += 1; settled = true; resolve(clone(result)); });
        if (!asynchronous && !settled) { settled = true; resolve(undefined); }
      } catch (error) { reject(error); }
    });
    return { promise, get responseCount() { return responseCount; }, get settled() { return settled; }, get asynchronous() { return asynchronous; } };
  };
  const probe = (extra = {}, source = sender()) => send({ type: 'impact-cn:guide-probe', requestId, contextEpoch: epoch, role: 'validation-open', ...extra }, source);
  const report = (extra = {}, source = child()) => send({ type: 'impact-cn:guide-frame-report', requestId, role: 'validation-open',
    target: 'validation-open', state: 'ready', rect: { left: 10, top: 20, width: 100, height: 30 }, viewport: { width: 800, height: 600 }, ...extra }, source);
  const cancel = (extra = {}, source = sender()) => send({ type: 'impact-cn:guide-cancel', requestId, contextEpoch: epoch, ...extra }, source);
  const advance = async duration => {
    clock += duration;
    for (;;) {
      const next = [...timers.entries()].filter(([, timer]) => timer.due <= clock).sort((a, b) => a[1].due - b[1].due)[0];
      if (!next) break;
      timers.delete(next[0]); next[1].fn(); await flush();
    }
    await flush();
  };
  return { context, sender, child, probe, report, cancel, send, advance, calls, hooks, current, frame,
    pending: () => vm.runInContext('guidePending.size', context), timerCount: () => timers.size };
}

function childCleanupFixture() {
  let clock = 1800000000000, timerSequence = 0;
  const timers = new Map(), timerHistory = new Map(), replies = [], hooks = { authorized: true, geometry: true };
  let element = { syntheticNativeNode: true };
  const begin = contentSource.indexOf('  function clearGuideFrameProbe('), end = contentSource.indexOf('\n  for (const entry of dictionary.entries', begin);
  const definitionsBegin = contentSource.indexOf('  const guideUuid ='), definitionsEnd = contentSource.indexOf('\n\n  function checklistTopMatches(', definitionsBegin);
  const destroyBegin = contentSource.indexOf('  function destroy()'), destroyEnd = contentSource.indexOf('\n  function topicAllowedOnTop(', destroyBegin);
  const navigationBegin = contentSource.indexOf('    const navigationChanged ='), navigationEnd = contentSource.indexOf('\n    if (window.navigation', navigationBegin);
  const hideBegin = contentSource.indexOf('    listen(window, "pagehide",'), hideEnd = contentSource.indexOf('    listen(window, "resize",', hideBegin);
  for (const [start, finish] of [[begin, end], [definitionsBegin, definitionsEnd], [destroyBegin, destroyEnd], [navigationBegin, navigationEnd], [hideBegin, hideEnd]]) assert(start >= 0 && finish > start, 'Actual child cleanup function boundaries required');
  const fixedDate = class extends Date { static now() { return clock; } };
  const context = vm.createContext({ Date: fixedDate, hooks,
    setTimeout(fn, delay) { const id = ++timerSequence; const timer = { fn, due: clock + delay }; timers.set(id, timer); timerHistory.set(id, timer); return id; },
    clearTimeout(id) { timers.delete(id); }, clearInterval() {},
    runtime: { id: 'guide-fixture-runtime', async sendMessage(message) { replies.push(clone(message)); return { ok: true }; } },
    location: { pathname: framePath, search: '' }, config: { guidance: { validationControls: { roles: { 'validation-open': {} } } } },
    async guideAssetAuthorized() { await hooks.authorization?.(); return hooks.authorized; },
    guideAssetGeometry() { return hooks.geometry ? { target: 'validation-open', state: 'ready', rect: { left: 10, top: 20, width: 100, height: 30 }, viewport: { width: 800, height: 600 }, element } : null; },
    CustomEvent: class { constructor(type, values) { this.type = type; this.detail = values?.detail; } }
  });
  vm.runInContext(`
    let guideFrameProbe, guideFrameProbeTimer, destroyed = false, enabled = true, aiEnabled = true, navigationGeneration = 0;
    const isChecklistAsset = true, inExtension = false;
    const observedRoots = new Map(), aiPlacementRoots = new Map(), translatedNodes = new Map(), helpButtons = new Map(), helpStyles = new Map(), listeners = [];
    let flushTimer, aiPlacementTimer, routeTimer, assistant;
    const dictionary = { version: 'synthetic' }, document = { body: {}, dispatchEvent() {} }, window = {};
    let guidanceController = { hideArrow() {}, reset() {} };
    const handlers = {};
    function restoreContractTimingLayout() {} function release() {} function removeHelpButton() {} function onMessage() {} function onStorageChanged() {}
    function schedule() {} function syncRoute() {} function listen(surface, event, fn) { handlers[event] = fn; }
    ${contentSource.slice(definitionsBegin, definitionsEnd)}
    ${contentSource.slice(begin, end)}
    ${contentSource.slice(destroyBegin, destroyEnd)}
    ${contentSource.slice(navigationBegin, navigationEnd)}
    ${contentSource.slice(hideBegin, hideEnd)}
    globalThis.cleanup = { record: () => guideFrameProbe, timer: () => guideFrameProbeTimer, destroy,
      navigate: navigationChanged, pagehide: () => handlers.pagehide(), message: guideAssetMessage };
  `, context);
  const send = (type, id = requestId) => new Promise(resolve => context.cleanup.message({ type, requestId: id, role: 'validation-open' }, { id: 'guide-fixture-runtime' }, resolve));
  const advance = async duration => {
    clock += duration;
    for (const [id, timer] of [...timers]) if (timer.due <= clock) { timers.delete(id); timer.fn(); }
    await flush();
  };
  return { hooks, replies, send, advance, record: context.cleanup.record, timer: context.cleanup.timer, timerCount: () => timers.size,
    destroy: context.cleanup.destroy, navigate: context.cleanup.navigate, pagehide: context.cleanup.pagehide,
    fireOld(id) { timerHistory.get(id).fn(); }, changeElement() { element = { syntheticOtherNativeNode: true }; } };
}

await check('Actual child confirm, rejected authorization and missing geometry release the cached native element and timer', async () => {
  for (const confirmed of [true, false]) {
    const env = childCleanupFixture(); assert.deepEqual(clone(await env.send('impact-cn:guide-probe-frame')), { active: true });
    const record = env.record(); assert(record.element && record.signature); assert.equal(env.timerCount(), 1);
    if (!confirmed) env.changeElement();
    assert.deepEqual(clone(await env.send('impact-cn:guide-confirm-frame')), { active: confirmed });
    assert.equal(env.record(), undefined); assert.equal(env.timerCount(), 0);
    assert(!Object.hasOwn(record, 'element') && !Object.hasOwn(record, 'signature'));
  }
  for (const kind of ['authorization', 'geometry']) {
    const env = childCleanupFixture(); env.hooks[kind === 'authorization' ? 'authorized' : 'geometry'] = false;
    assert.deepEqual(clone(await env.send('impact-cn:guide-probe-frame')), { active: false });
    assert.equal(env.record(), undefined); assert.equal(env.timerCount(), 0); assert.equal(env.replies.length, 0);
  }
});
await check('Actual child expiry and replacement drop strong references while old timers or confirms cannot clear a new request', async () => {
  const env = childCleanupFixture(); await env.send('impact-cn:guide-probe-frame');
  const first = env.record(), oldTimer = env.timer(); assert(first.element);
  await env.send('impact-cn:guide-probe-frame', nextRequestId);
  const second = env.record(); assert(second.element); assert.notEqual(second, first);
  assert(!Object.hasOwn(first, 'element') && !Object.hasOwn(first, 'signature'));
  env.fireOld(oldTimer); assert.equal(env.record(), second); assert.equal(env.timerCount(), 1);
  assert.deepEqual(clone(await env.send('impact-cn:guide-confirm-frame')), { active: false }); assert.equal(env.record(), second);
  await env.advance(1500); assert.equal(env.record(), undefined); assert.equal(env.timerCount(), 0);
  assert(!Object.hasOwn(second, 'element') && !Object.hasOwn(second, 'signature'));
});
await check('Actual destroy, pagehide and navigation release child node ownership and late authorization never restores it', async () => {
  for (const action of ['destroy', 'pagehide', 'navigate']) {
    const env = childCleanupFixture(); await env.send('impact-cn:guide-probe-frame'); const record = env.record(); assert(record.element);
    env[action](); assert.equal(env.record(), undefined); assert.equal(env.timerCount(), 0); assert(!Object.hasOwn(record, 'element'));
    const waiting = childCleanupFixture(), gate = deferred(); waiting.hooks.authorization = () => gate.promise;
    const probe = waiting.send('impact-cn:guide-probe-frame'); await flush(); waiting[action](); gate.resolve();
    assert.deepEqual(clone(await probe), { active: false }); assert.equal(waiting.record(), undefined); assert.equal(waiting.timerCount(), 0);
  }
});

await check('Both public roles return only confirmed fixed target geometry and exact document options', async () => {
  for (const role of ['validation-open', 'validation-tests']) for (const target of [role, 'help-close']) {
    const env = fixture(), top = env.probe({ role }); await flush();
    const report = env.report({ role, target });
    assert.deepEqual(await report.promise, { ok: true });
    assert.deepEqual(await top.promise, { ok: true, role, target, state: 'ready', rect: { left: 10, top: 20, width: 100, height: 30 }, viewport: { width: 800, height: 600 } });
    assert.equal(top.responseCount, 1); assert.equal(env.pending(), 0); assert.equal(env.timerCount(), 0);
    assert.deepEqual(env.calls.map(call => call.message.type), ['impact-cn:journey-current-context', 'impact-cn:guide-probe-frame', 'impact-cn:guide-confirm-frame', 'impact-cn:journey-current-context']);
    assert.deepEqual(env.calls[1], { tabId: 7, message: { type: 'impact-cn:guide-probe-frame', requestId, role } });
    assert.deepEqual(env.calls[2].options, { frameId: 2, documentId: 'synthetic-frame-document' });
  }
});
await check('Top runtime, top frame, tab, source document and exact Checklist page independently authorize requests', async () => {
  const env = fixture();
  for (const overrides of [{ id: 'other-runtime' }, { frameId: 1 }, { documentId: '' }, { documentId: undefined },
    { tab: { id: -1, url: topUrl } }, { tab: { id: 1.5, url: topUrl } }, { tab: { url: topUrl } },
    { url: 'http://demo.impact.com' + checklistPath }, { url: 'https://example.invalid' + checklistPath },
    { url: origin + checklistPath + '/extra', tab: { id: 7, url: origin + checklistPath + '/extra' } },
    { tab: { id: 7, url: 'https://app.impact.com' + checklistPath } },
    { url: origin + '/secure/advertiser/tracking-settings/actiontracker/launch-test-action-flow.ihtml', tab: { id: 7, url: origin + '/secure/advertiser/tracking-settings/actiontracker/launch-test-action-flow.ihtml' } }]) {
    assert.deepEqual(await env.probe({}, env.sender(overrides)).promise, { ok: false, reason: 'invalid-sender' });
  }
  assert.equal(env.calls.length, 0); assert.equal(env.pending(), 0);
});
await check('UUID, role and exact payload keys reject business or malformed fields before transport', async () => {
  const env = fixture();
  for (const extra of [{ requestId: 'guess' }, { contextEpoch: 'guess' }, { role: 'other' }, { role: null },
    { url: 'https://example.invalid/' }, { text: 'synthetic' }, { value: 1 }]) {
    assert.deepEqual(await env.probe(extra).promise, { ok: false, reason: 'invalid-message' });
  }
  assert.equal(env.calls.length, 0); assert.equal(env.pending(), 0);
});
await check('Only the exact independently authorized assets validation frame can report', async () => {
  const env = fixture(), top = env.probe(); await flush();
  for (const overrides of [{ id: 'other-runtime' }, { frameId: 0 }, { documentId: '' }, { documentId: undefined },
    { tab: { id: -1, url: topUrl } }, { tab: { id: 1.5, url: topUrl } },
    { url: 'http://ui.assets.impact.com' + framePath }, { url: 'https://other.invalid' + framePath },
    { url: 'https://ui.assets.impact.com' + framePath + '/extra' },
    { url: 'https://ui.assets.impact.com/onboarding-ui/checklist-assets/production/payout-terms/default.html' },
    { tab: { id: 7, url: 'https://example.invalid' + checklistPath } }]) {
    assert.deepEqual(await env.report({}, env.child(overrides)).promise, { ok: false, reason: 'invalid-frame' });
  }
  assert.equal(env.calls.length, 2); assert.equal(top.settled, false);
  assert.deepEqual(await env.report().promise, { ok: true }); assert.equal((await top.promise).ok, true);
});
await check('Other tabs, old IDs, role mismatch, changed top URLs and premature reports cannot consume a pending request', async () => {
  const env = fixture(), gate = deferred(); env.hooks.current = () => gate.promise;
  const top = env.probe();
  assert.equal((await env.report().promise).reason, 'stale-request');
  gate.resolve(); await flush(); delete env.hooks.current;
  for (const [extra, sender] of [[{ requestId: nextRequestId }, env.child()],
    [{ role: 'validation-tests', target: 'validation-tests' }, env.child()],
    [{}, env.child({ tab: { id: 8, url: topUrl } })],
    [{}, env.child({ tab: { id: 7, url: topUrl + '?synthetic=changed' } })]]) {
    assert.equal((await env.report(extra, sender).promise).reason, 'stale-request');
  }
  assert.equal(top.settled, false); assert.deepEqual(await env.report().promise, { ok: true }); assert.equal((await top.promise).ok, true);
});
await check('Report roles, states, exact keys and finite bounded geometry reject malformed or private payloads', async () => {
  const env = fixture(), top = env.probe(); await flush();
  const invalid = [{ requestId: 'guess' }, { role: 'other' }, { target: 'validation-tests' }, { target: 'other' }, { state: 'other' },
    { text: 'synthetic' }, { rect: null }, { viewport: null }, { viewport: { width: 0, height: 600 } },
    { viewport: { width: Infinity, height: 600 } }, { viewport: { width: 16385, height: 600 } },
    { viewport: { width: 800, height: 600, value: 'synthetic' } }, { rect: { left: -1, top: 0, width: 10, height: 10 } },
    { rect: { left: NaN, top: 0, width: 10, height: 10 } }, { rect: { left: 0, top: 0, width: Infinity, height: 10 } },
    { rect: { left: 0, top: 0, width: 0, height: 10 } }, { rect: { left: 799, top: 0, width: 2, height: 10 } },
    { rect: { left: 0, top: 599, width: 10, height: 2 } }, { rect: { left: 0, top: 0, width: 10, height: 10, label: 'synthetic' } }];
  for (const extra of invalid) assert.deepEqual(await env.report(extra).promise, { ok: false, reason: 'invalid-report' });
  assert.equal(env.calls.length, 2); assert.equal(top.settled, false);
  assert.deepEqual(await env.report().promise, { ok: true }); assert.equal((await top.promise).ok, true);
  for (const state of ['covered', 'clipped', 'loading']) {
    const other = fixture(), pending = other.probe(); await flush();
    assert.deepEqual(await other.report({ state, rect: null }).promise, { ok: true }); assert.equal((await pending.promise).state, state);
  }
});
await check('Frame confirmation is document-bound and false, missing or failed confirmation never releases geometry', async () => {
  for (const kind of ['new-document', 'inactive', 'rejected']) {
    const env = fixture(), top = env.probe(); await flush();
    if (kind === 'new-document') env.frame.documentId = 'synthetic-new-frame-document';
    if (kind === 'inactive') env.hooks.frameActive = false;
    if (kind === 'rejected') env.hooks.confirm = () => { throw Error('Synthetic removed frame'); };
    const source = env.child({ documentId: 'synthetic-frame-document' });
    assert.deepEqual(await env.report({}, source).promise, { ok: false, reason: 'stale-frame' });
    assert.deepEqual(await top.promise, { ok: false, reason: 'stale-frame' }); assert.equal(env.pending(), 0);
  }
});
await check('A top context that changes before broadcast or during frame confirmation never receives a target', async () => {
  const initial = fixture(); initial.current.set(7, nextEpoch);
  assert.deepEqual(await initial.probe().promise, { ok: false, reason: 'stale-document' });
  assert.equal(initial.calls.length, 1); assert.equal(initial.pending(), 0);
  const env = fixture(), top = env.probe(); await flush();
  env.hooks.confirm = () => { env.current.set(7, nextEpoch); };
  assert.deepEqual(await env.report().promise, { ok: false, reason: 'stale-document' });
  assert.deepEqual(await top.promise, { ok: false, reason: 'stale-document' }); assert.equal(env.pending(), 0);
});
await check('TTL clears authentication, waiting and confirming stages; late completions cannot revive or reply twice', async () => {
  for (const stage of ['authentication', 'waiting', 'confirmation']) {
    const env = fixture(), gate = deferred(); let report;
    if (stage === 'authentication') env.hooks.current = () => gate.promise;
    const top = env.probe(); await flush();
    if (stage === 'confirmation') { env.hooks.confirm = () => gate.promise; report = env.report(); await flush(); }
    await env.advance(1500);
    assert.deepEqual(await top.promise, { ok: false, reason: 'timeout' }); assert.equal(env.pending(), 0);
    gate.resolve(); await flush();
    if (report) assert.deepEqual(await report.promise, { ok: false, reason: 'stale-request' });
    assert.equal((await env.report().promise).reason, 'stale-request'); assert.equal(top.responseCount, 1);
  }
});
await check('A later probe replaces exactly one pending request and old reports or confirmation completions stay stale', async () => {
  for (const stage of ['authentication', 'waiting', 'confirmation']) {
    const env = fixture(), gate = deferred(); let oldReport;
    if (stage === 'authentication') env.hooks.current = () => gate.promise;
    const first = env.probe(); await flush();
    if (stage === 'confirmation') { env.hooks.confirm = () => gate.promise; oldReport = env.report(); await flush(); }
    delete env.hooks.current; delete env.hooks.confirm;
    const second = env.probe({ requestId: nextRequestId, role: 'validation-tests' }); await flush();
    assert.deepEqual(await first.promise, { ok: false, reason: 'superseded' }); assert.equal(env.pending(), 1);
    gate.resolve(); await flush();
    if (oldReport) assert.equal((await oldReport.promise).reason, 'stale-request');
    assert.equal((await env.report().promise).reason, 'stale-request');
    assert.deepEqual(await env.report({ requestId: nextRequestId, role: 'validation-tests', target: 'validation-tests' }).promise, { ok: true });
    assert.equal((await second.promise).ok, true); assert.equal(first.responseCount, 1); assert.equal(env.pending(), 0);
  }
});
await check('A repeated pending UUID cannot replace its owner or make an old report belong to a new request', async () => {
  const env = fixture(), first = env.probe(); await flush();
  assert.deepEqual(await env.probe().promise, { ok: false, reason: 'duplicate-request' });
  assert.deepEqual(await env.probe({ role: 'validation-tests' }).promise, { ok: false, reason: 'duplicate-request' });
  assert.equal(env.pending(), 1); assert.equal(first.settled, false);
  assert.deepEqual(await env.report().promise, { ok: true }); assert.equal((await first.promise).ok, true);
});
await check('Cancellation validates owner UUID, epoch, document and current top, and never clears a different pending owner', async () => {
  const env = fixture(), top = env.probe(); await flush();
  for (const extra of [{ requestId: nextRequestId }, { contextEpoch: nextEpoch }]) assert.equal((await env.cancel(extra).promise).reason, 'stale-request');
  assert.equal((await env.cancel({}, env.sender({ documentId: 'synthetic-other-top-document' })).promise).reason, 'stale-request');
  assert.equal((await env.cancel({ value: 'synthetic' }).promise).reason, 'invalid-message');
  assert.equal((await env.cancel({}, env.sender({ frameId: 1 })).promise).reason, 'invalid-sender');
  assert.equal(top.settled, false); assert.deepEqual(await env.cancel().promise, { ok: true });
  assert.deepEqual(await top.promise, { ok: false, reason: 'cancelled' }); assert.equal(env.pending(), 0);
  assert.equal((await env.report().promise).reason, 'stale-request');
  const changed = fixture(), pending = changed.probe(); await flush(); changed.current.set(7, nextEpoch);
  assert.equal((await changed.cancel().promise).reason, 'stale-document'); await changed.advance(1500);
  assert.equal((await pending.promise).reason, 'timeout');
});
await check('Broadcast failure is bounded and duplicate reports cannot race two confirmations', async () => {
  const absent = fixture(); absent.hooks.broadcast = () => { throw Error('Synthetic unavailable frame'); };
  assert.deepEqual(await absent.probe().promise, { ok: false, reason: 'frame-unavailable' }); assert.equal(absent.pending(), 0);
  const env = fixture(), gate = deferred(), top = env.probe(); await flush(); env.hooks.confirm = () => gate.promise;
  const first = env.report(); await flush();
  assert.equal((await env.report().promise).reason, 'stale-request'); gate.resolve();
  assert.deepEqual(await first.promise, { ok: true }); assert.equal((await top.promise).ok, true);
  assert.equal(env.calls.filter(call => call.message.type === 'impact-cn:guide-confirm-frame').length, 1);
});
await check('Existing frame, AI and journey bytes are unchanged except explicit dispatch and exact test route scene guards', () => {
  const baseline = readFileSync(path.join(root, 'dist/impact-cn-mod-0.8.8/background.js'), 'utf8');
  assert.equal(createHash('sha256').update(baseline).digest('hex'), 'f8fecca99aed2634460098bf09ffa7eace4b9ec0092ab9dc7bbd438ea4819cfe');
  const marker = '\n// Read-only geometry bridge. Translation eligibility, AI authorization and journey\n';
  assert.equal(sources['background.js'].split(marker).length, 2);
  let protectedSource = sources['background.js'].split(marker)[0];
  for (const type of ['probe', 'cancel', 'frame-report']) {
    const name = type === 'probe' ? 'Probe' : type === 'cancel' ? 'Cancel' : 'FrameReport';
    const line = `  if (message?.type === "impact-cn:guide-${type}") return handleGuide${name}(message, sender, respond);\n`;
    assert.equal(protectedSource.split(line).length, 2); protectedSource = protectedSource.replace(line, '');
  }
  const sharedPath = '    if (source.pathname === "/secure/advertiser/engage/actions/tests/test-actions-flow.ihtml") return "test-actions";\n';
  const sharedScene = '  return page === "test-actions" ? ["tests", "tool"].includes(sceneId)\n    : page === "tool"';
  const pureToolPaths = 'const journeyToolPaths = new Set([\n  "/secure/advertiser/tracking-settings/actiontracker/launch-test-action-flow.ihtml"\n]);';
  assert.equal(protectedSource.split(sharedPath).length, 2); assert.equal(protectedSource.split(sharedScene).length, 2); assert.equal(protectedSource.split(pureToolPaths).length, 2);
  protectedSource = protectedSource.replace(sharedPath, '').replace(sharedScene, '  return page === "tool"')
    .replace(pureToolPaths, 'const journeyToolPaths = new Set([\n  "/secure/advertiser/tracking-settings/actiontracker/launch-test-action-flow.ihtml",\n  "/secure/advertiser/engage/actions/tests/test-actions-flow.ihtml"\n]);');
  const newPath = '    return source.pathname === "/secure/advertiser/actions/tests/test-actions-flow.ihtml" ? "tests"\n      : journeyToolPaths.has(source.pathname) ? "tool" : null;';
  const newScene = '  return page === "tool" ? sceneId === "tool" : page === "tests" ? sceneId === "tests"\n    : page === "checklist" && ["website", "validation", "unknown"].includes(sceneId);';
  assert.equal(protectedSource.split(newPath).length, 2); assert.equal(protectedSource.split(newScene).length, 2);
  protectedSource = protectedSource.replace(newPath, '    return journeyToolPaths.has(source.pathname) ? "tool" : null;')
    .replace(newScene, '  return page === "tool" ? sceneId === "tool" : page === "checklist" && ["website", "validation", "unknown"].includes(sceneId);');
  assert.equal(protectedSource, baseline);
  const block = sources['background.js'].split(marker)[1];
  assert(!block.includes('chrome.storage') && !block.includes('frameRequests') && !block.includes('journeyOwners'));
});

const status = results.every(result => result.status === 'PASS') ? 'PASS' : 'FAIL';
const report = { mode: 'GUIDE_TARGET_PROTOCOL_VM_ONLY', realSiteAcceptance: false,
  version: JSON.parse(readFileSync(path.join(sourceDir, 'manifest.json'), 'utf8')).version,
  sourceSHA256: Object.fromEntries([['background.js', sources['background.js']], ['journey.js', sources['journey.js']], ['content.js', contentSource]].map(([name, source]) => [name, createHash('sha256').update(source).digest('hex')])),
  status, results };
const reportDir = process.argv.find(argument => argument.startsWith('--report-dir='))?.slice('--report-dir='.length);
if (reportDir) { mkdirSync(reportDir, { recursive: true }); writeFileSync(path.join(reportDir, 'guide-target-protocol.json'), JSON.stringify(report, null, 2) + '\n'); }
console.log('GUIDE PROTOCOL ' + status + ': ' + results.filter(result => result.status === 'PASS').length + '/' + results.length);
process.exitCode = status === 'PASS' ? 0 : 1;

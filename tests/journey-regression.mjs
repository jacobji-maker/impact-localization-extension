/** Pure journey and isolated worker VM checks. No live site, browser or business data. */
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const sourceArgument = process.argv.find(argument => argument.startsWith('--source-dir='))?.slice('--source-dir='.length);
const sourceDir = sourceArgument ? path.resolve(root, sourceArgument) : path.join(root, 'impact-cn-mod');
const onlyFilter = process.argv.find(argument => argument.startsWith('--only='))?.slice('--only='.length);
const sources = Object.fromEntries(['journey.js', 'background.js', 'dict.js'].map(name => [name, readFileSync(path.join(sourceDir, name), 'utf8')]));
const contentSource = readFileSync(path.join(sourceDir, 'content.js'), 'utf8');
const clone = value => JSON.parse(JSON.stringify(value));
const sandbox = vm.createContext({});
vm.runInContext(sources['journey.js'], sandbox);
const journey = sandbox.IMPACT_CN_JOURNEY;
const epoch = '11111111-1111-4111-8111-111111111111';
const secondEpoch = '22222222-2222-4222-8222-222222222222';
const journeyId = '33333333-3333-4333-8333-333333333333';
const freshJourneyId = '44444444-4444-4444-8444-444444444444';
const now = 1800000000000;
const checklistPath = '/secure/advertiser/checklist/checklist-instance.ihtml';
const toolPath = '/secure/advertiser/tracking-settings/actiontracker/launch-test-action-flow.ihtml';
const secondToolPath = '/secure/advertiser/engage/actions/tests/test-actions-flow.ihtml';
const testsPath = '/secure/advertiser/actions/tests/test-actions-flow.ihtml';
const destinationPages = [
  { pathname: toolPath, sceneId: 'tool', fromScene: 'validation' },
  { pathname: secondToolPath, sceneId: 'tool', fromScene: 'validation' },
  { pathname: secondToolPath, sceneId: 'tests', fromScene: 'validation' },
  { pathname: secondToolPath, sceneId: 'tests', fromScene: 'tool' },
  { pathname: testsPath, sceneId: 'tests', fromScene: 'validation' },
  { pathname: testsPath, sceneId: 'tests', fromScene: 'tool' }
];
const event = (type, sceneId, extra = {}) => ({ type, sceneId, contextEpoch: epoch, now, ...extra });
const start = (sceneId = 'website', extra = {}) => journey.transition(null, event('start', sceneId, { journeyId, ...extra })).state;
const pendingState = (sceneId = 'validation', extra = {}) => journey.transition(start(sceneId, extra), event('continue', sceneId, extra)).state;
const results = [];
async function check(name, action) {
  if (onlyFilter && !new RegExp(onlyFilter, 'i').test(name)) return;
  try { await action(); results.push({ name, status: 'PASS' }); console.log('JOURNEY PASS ' + name); }
  catch (error) { results.push({ name, status: 'FAIL', evidence: error.stack }); console.log('JOURNEY FAIL ' + name + ': ' + error.message); }
}

function worker({ session = {}, clock = now, unavailable = false } = {}) {
  let listener, tabRemoved;
  const calls = [], current = new Map(), hooks = {};
  const fixedDate = class extends Date { static now() { return clock; } };
  const context = vm.createContext({ URL, URLSearchParams, setTimeout, clearTimeout, Date: fixedDate,
    chrome: {
      runtime: { id: 'journey-fixture-runtime', onMessage: { addListener(fn) { assert.equal(listener, undefined, 'Keep existing single worker listener'); listener = fn; } } },
      storage: { session: unavailable ? undefined : {
        async get(key) { calls.push(['get', key]); const result = { [key]: session[key] === undefined ? undefined : clone(session[key]) }; await hooks.get?.(); return result; },
        async set(values) { calls.push(['set', clone(values)]); Object.assign(session, clone(values)); await hooks.set?.(); },
        async remove(key) { calls.push(['remove', key]); delete session[key]; await hooks.remove?.(); }
      } },
      tabs: { onRemoved: { addListener(fn) { tabRemoved = fn; } }, async sendMessage(tabId, message, options) {
        calls.push(['probe', tabId, clone(message), clone(options)]);
        assert.equal(message.type, journey.messages.currentContext); assert.deepEqual(clone(options), { frameId: 0 });
        const active = current.get(tabId);
        return { active: active?.contextEpoch === message.contextEpoch, contextEpoch: active?.contextEpoch };
      } }
    },
    importScripts(...names) { for (const name of names) vm.runInContext(sources[name], context, { filename: name }); }
  });
  vm.runInContext(sources['background.js'], context, { filename: 'background.js' });
  const sender = (overrides = {}) => ({ id: 'journey-fixture-runtime', frameId: 0, documentId: 'synthetic-document-a',
    url: 'https://demo.impact.com' + checklistPath, tab: { id: 7, url: 'https://demo.impact.com' + checklistPath }, ...overrides });
  const at = (pathname, overrides = {}) => sender({ url: 'https://demo.impact.com' + pathname,
    tab: { id: 7, url: 'https://demo.impact.com' + pathname }, ...overrides });
  const send = (message, source = sender()) => new Promise((resolve, reject) => {
    try { const asynchronous = listener(message, source, result => resolve(clone(result))); if (!asynchronous && message.type !== journey.messages.checkpoint) resolve(undefined); }
    catch (error) { reject(error); }
  });
  const take = (sceneId = 'validation', contextEpoch = epoch, source = sender()) => send({ type: journey.messages.checkpoint, op: 'take', contextEpoch, sceneId }, source);
  const put = (state, seq = 1, source = sender()) => send({ type: journey.messages.checkpoint, op: 'put', contextEpoch: state.contextEpoch, seq, state: clone(state) }, source);
  const clear = (seq, contextEpoch = epoch, source = sender()) => send({ type: journey.messages.checkpoint, op: 'clear', contextEpoch, seq }, source);
  current.set(7, { contextEpoch: epoch });
  return { context, session, calls, current, hooks, sender, at, send, take, put, clear, setClock(value) { clock = value; },
    async closeTab(tabId) { current.delete(tabId); tabRemoved(tabId); await new Promise(resolve => setImmediate(resolve)); } };
}

function contentCheckpoint(env, state = { ...clone(pendingState()), originScene: 'website' },
  { sceneId = state?.sceneId || 'tool', pathname = checklistPath, initialEpoch = epoch, documentId = 'synthetic-document-a' } = {}) {
  const begin = contentSource.indexOf('    async function checkpoint('), end = contentSource.indexOf('    function applyJourney(', begin);
  assert(begin >= 0 && end > begin, 'Current content checkpoint function boundary is required');
  const applyEnd = contentSource.indexOf('    function invalidateJourney(', end);
  assert(applyEnd > end, 'Current content task application boundary is required');
  const suppressBegin = contentSource.indexOf('    function suppressPassiveOpen() {');
  const suppressEnd = contentSource.indexOf('    guidanceController = {', suppressBegin);
  assert(suppressBegin >= 0 && suppressEnd > suppressBegin, 'Actual controller passive-close function is required');
  const suppressSource = contentSource.slice(suppressBegin, suppressEnd);
  const openBegin = contentSource.indexOf('    listen(open, "click", () => {');
  const openEnd = contentSource.indexOf('    listen(back, "click"', openBegin);
  const startBegin = contentSource.indexOf('    listen(journeyStart, "click", () => {');
  const startEnd = contentSource.indexOf('    listen(journeyContinue, "click"', startBegin);
  const toggleBegin = contentSource.indexOf('    const togglePanel = (open) => {');
  const toggleEnd = contentSource.indexOf('    listen(launcher, "click"', toggleBegin);
  assert(openBegin >= 0 && openEnd > openBegin && startBegin >= 0 && startEnd > startBegin
    && toggleBegin >= 0 && toggleEnd > toggleBegin, 'Real guide open, start and assistant toggle listeners are required');
  let contentClock = now;
  const fixedDate = class extends Date { static now() { return contentClock; } };
  const calls = [], transport = {};
  const context = vm.createContext({ journeyContract: journey, initialState: clone(state), Date: fixedDate,
    crypto: { randomUUID: () => freshJourneyId },
    runtime: { async sendMessage(message) {
      calls.push({ op: message.op, ...(message.seq === undefined ? {} : { seq: message.seq }) });
      const injected = await transport.beforeSend?.(clone(message));
      if (injected !== undefined) return injected;
      return env.send(clone(message), env.at(pathname, { documentId }));
    } }
  });
  vm.runInContext(`
    const inExtension = true;
    let destroyed = false, checkpointGeneration = 0, contextEpoch = ${JSON.stringify(initialEpoch)}, checkpointBound = true,
      checkpointSeq = 3, checkpointNote = '', journey = initialState, journeyReason = '', arrowRequested = false;
    let passiveOpenGeneration = 0, passiveOpenAllowed = true;
    let observation = { sceneId: ${JSON.stringify(sceneId)} };
    const location = { pathname: ${JSON.stringify(pathname)}, search: '' };
    let route = location.pathname;
    const sceneNames = { website: '网站设置', validation: '验证转化事件', tool: '测试工具', tests: '测试转化', unknown: '未识别页面' };
    const sequence = ['5a', '5b', '5c', '5d', '6a', '6c', '6e', '6f'].map(id => ({ step: { id } }));
    const declarations = new Map(), settings = { hidden: false }, view = { hidden: true }, panel = { hidden: true };
    let step = { id: journeyContract.steps[${JSON.stringify(sceneId)}] };
    const context = { textContent: '' }, journeyStart = {}, handlers = new Map();
    const back = { focus() {} };
    const open = { attributes: {}, setAttribute(name, value) { this.attributes[name] = value; } };
    const launcher = { attributes: {}, setAttribute(name, value) { this.attributes[name] = value; } };
    const assistant = { querySelector(selector) { return selector === '.impact-cn-launcher' ? launcher : null; } };
    let selectedStepId = null, positionCalls = 0;
    function renderJourney() {}
    function hideArrow() { arrowRequested = false; }
    function selectStep(index) { selectedStepId = sequence[index]?.step.id || null; step = sequence[index]?.step || step; }
    function positionPanel() { positionCalls += 1; }
    function checkContext() { return true; }
    function listen(element, type, handler) { handlers.set(element, handler); }
    ${suppressSource}
    const guidanceController = { suppressPassiveOpen, hideArrow };
    ${contentSource.slice(toggleBegin, toggleEnd)}
    ${contentSource.slice(begin, end)}
    ${contentSource.slice(end, applyEnd)}
    ${contentSource.slice(openBegin, openEnd)}
    ${contentSource.slice(startBegin, startEnd)}
    globalThis.fixture = {
      run: op => checkpoint(op),
      continueCurrent: () => applyJourney('continue'),
      collapse: () => togglePanel(false),
      show: () => togglePanel(true),
      openGuide: () => handlers.get(open)(),
      startCurrent: () => handlers.get(journeyStart)(),
      arrive(sceneId) { observation = { sceneId }; applyJourney('observed'); },
      inspect: () => ({ checkpointBound, checkpointSeq, checkpointNote, journey }),
      inspectIntent: () => ({ passiveOpenGeneration, passiveOpenAllowed }),
      inspectUI: () => ({ settingsHidden: settings.hidden, viewHidden: view.hidden, panelHidden: panel.hidden,
        openExpanded: open.attributes['aria-expanded'], launcherExpanded: launcher.attributes['aria-expanded'],
        selectedStepId, positionCalls, declarations: declarations.size, arrowRequested }),
      change(kind) {
        if (kind === 'generation') checkpointGeneration += 1;
        if (kind === 'epoch') contextEpoch = ${JSON.stringify(secondEpoch)};
        if (kind === 'route') { location.search = '?synthetic-context=changed'; route = location.pathname + location.search; }
        if (kind === 'state') journey = { ...journey, status: 'closed' };
        if (kind === 'foreign-state') journey = { ...journey, contextEpoch: ${JSON.stringify(secondEpoch)} };
        if (kind === 'invalid-state') journey = { ...journey, businessResult: 'success' };
        if (kind === 'scene') observation = { sceneId: 'website' };
        if (kind === 'sequence') checkpointSeq += 1;
        if (kind === 'destroyed') destroyed = true;
      }
    };
  `, context);
  return { ...context.fixture, calls, transport, setClock(value) { contentClock = value; } };
}

await check('Shared Test Actions URI permits only list and tool scenes while pure routes stay separate', async () => {
  const failures=[];
  for(const [pathname,sceneId,allowed] of [[testsPath,'tests',true],[testsPath,'tool',false],[toolPath,'tool',true],[toolPath,'tests',false],[secondToolPath,'tests',true],[secondToolPath,'tool',true],[secondToolPath,'unknown',false],[secondToolPath,'website',false]]) {
    const env=worker(),source=env.at(pathname),result=await env.take(sceneId,epoch,source);
    if(result.ok!==allowed)failures.push({pathname,sceneId,allowed,observed:result});
    if(result.ok&&allowed)assert.equal((await env.put(start(sceneId),1,source)).ok,true);
  }
  assert.deepEqual(failures,[],'Exact route/scene mismatch: '+JSON.stringify(failures));
});
await check('Shared Test Actions URI keeps sender document and current epoch rejection', async () => {
  for(const scene of ['tests','tool']) {
    for(const overrides of [{id:'other-runtime'},{frameId:1},{documentId:''},{documentId:undefined},{url:'https://demo.impact.com'+secondToolPath+'/extra',tab:{id:7,url:'https://demo.impact.com'+secondToolPath+'/extra'}},{url:'https://unrelated.invalid'+secondToolPath,tab:{id:7,url:'https://unrelated.invalid'+secondToolPath}},{tab:{id:7,url:'https://demo.impact.com'+toolPath}}]) {
      const env=worker();assert.equal((await env.take(scene,epoch,env.at(secondToolPath,overrides))).reason,'invalid-sender');assert.equal(env.calls.some(call=>call[0]==='get'),false);
    }
  }
  const env=worker(),source=env.at(secondToolPath);
  assert.equal((await env.take('tool',secondEpoch,source)).reason,'stale-document');
  assert.equal(env.calls.some(call=>call[0]==='get'),false);
});
await check('Pure transitions are deterministic, immutable and accept only minimal unknown-result state', () => {
  const original = start(), snapshot = JSON.stringify(original), input = event('continue', 'website');
  assert(journey.validState(original));
  assert.deepEqual(clone(journey.transition(original, input)), clone(journey.transition(original, input)));
  assert.equal(JSON.stringify(original), snapshot);
  assert.equal(journey.schemaVersion, 2);
  for (const extra of [{ programId: 'synthetic' }, { url: 'https://example.invalid/' }, { declarations: {} }, { businessResult: 'success' }, { schemaVersion: 1 }, { journeyId: 'not-random' }]) assert.equal(journey.validState({ ...original, ...extra }), false);
  assert.equal(journey.validState({ ...original, pendingTransition: { from: 'website', to: 'tool', expiresAt: now + 1 } }), false);
  assert.equal(journey.validState({ ...original, pendingTransition: { from: 'website', to: 'validation', expiresAt: now + 1, value: 'synthetic' } }), false);
  for (const malformed of [null, [], {}, { type: 'start' }, event('start', 'unknown', { journeyId })]) assert.equal(journey.transition(null, malformed).state, null);
  assert(Object.isFrozen(journey) && Object.isFrozen(journey.scenes) && Object.isFrozen(journey.steps));
});
await check('Website arrival and bounded validation to tool keep task origin without claiming business completion', () => {
  let state = start();
  let result = journey.transition(state, event('observed', 'validation', { follow: true }));
  assert.equal(result.state.stepId, '6a'); assert.equal(result.state.originScene, 'website');
  assert.equal(result.effects.arrived, true); assert.equal(result.effects.locate, true);
  state = journey.transition(result.state, event('continue', 'validation')).state;
  assert.deepEqual(clone(state.pendingTransition), { from: 'validation', to: 'tool', expiresAt: now + journey.transitionTtlMs });
  result = journey.transition(state, event('observed', 'tool', { now: now + 1, follow: true }));
  assert.equal(result.state.stepId, '6a'); assert.equal(result.state.status, 'active'); assert.equal(result.state.pendingTransition, null);
  assert.equal(result.state.businessResult, 'unknown'); assert.equal(result.effects.reason, 'arrived');
  assert.equal(Object.hasOwn(result.state, 'declared'), false);
  for (const scene of ['website', 'validation', 'tool', 'tests']) assert.equal(start(scene).originScene, scene, 'Cold opens cannot invent an origin');
});
await check('Optional destinations accept only observed legal edges and never inherit schema one checkpoints', () => {
  assert.equal(journey.transition({ ...clone(start('validation')), schemaVersion: 1 }, event('continue', 'validation')).state, null);
  const edges = [['website', 'validation'], ['validation', 'tool'], ['validation', 'tests'], ['tool', 'tests']];
  for (const [from, to] of edges) {
    const initial = start(from);
    const intent = journey.transition(initial, event('continue', from, { toScene: to }));
    assert.equal(intent.effects.expectedSceneId, to);
    assert.deepEqual(clone(intent.state.pendingTransition), { from, to, expiresAt: now + journey.transitionTtlMs });
    assert(journey.validState(intent.state));
    const arrived = journey.transition(intent.state, event('observed', to, { now: now + 1, follow: true }));
    assert.equal(arrived.state.status, 'active'); assert.equal(arrived.state.stepId, to === 'tests' ? '6c' : '6a');
    assert.equal(arrived.state.businessResult, 'unknown'); assert.equal(arrived.effects.locate, true);
    if (from !== 'website') {
      const unexpected = journey.transition(initial, event('observed', to, { follow: true }));
      assert.equal(unexpected.state.status, 'paused'); assert.equal(unexpected.effects.locate, false);
      const expired = journey.transition(intent.state, event('observed', to, { now: now + journey.transitionTtlMs, follow: true }));
      assert.equal(expired.state.status, 'paused'); assert.equal(expired.effects.reason, 'transition-expired');
    }
    const otherDocument = journey.transition(intent.state, event('observed', to, { sameDocument: false, follow: true }));
    assert.equal(otherDocument.state.status, 'paused'); assert.equal(otherDocument.state.pendingTransition, null);
    assert.equal(otherDocument.effects.locate, false); assert.equal(otherDocument.effects.reason, 'context-unverified');
  }
  for (const [from, to] of [['website', 'tool'], ['website', 'tests'], ['validation', 'website'], ['tool', 'validation'], ['tests', 'tool'], ['tests', 'tests'], ['validation', 'unknown'], ['validation', undefined]]) {
    const initial = start(from), snapshot = JSON.stringify(initial);
    const rejected = journey.transition(initial, event('continue', from, { toScene: to }));
    assert.equal(rejected.effects.reason, 'no-navigation'); assert.equal(rejected.state.pendingTransition, null);
    assert.equal(JSON.stringify(initial), snapshot);
    assert.equal(journey.validState({ ...initial, pendingTransition: { from, to, expiresAt: now + 1 } }), false);
  }
  assert.equal(journey.transition(start('tool'), event('continue', 'tool')).state.pendingTransition.to, 'tests');
  assert.equal(journey.transition(start('tests'), event('continue', 'tests')).effects.reason, 'no-navigation');
  assert.equal(start('tests').stepId, '6c');
});
await check('Unknown, unexpected, expired and changed-document observations pause and remove old navigation intent', () => {
  for (const [state, input, reason] of [
    [start(), event('observed', 'tool'), 'unexpected-scene'],
    [pendingState(), event('observed', 'tool', { now: now + journey.transitionTtlMs }), 'transition-expired'],
    [pendingState(), event('observed', 'unknown'), 'unknown-scene'],
    [pendingState(), event('observed', 'tool', { sameDocument: false }), 'context-unverified'],
    [pendingState(), event('observed', 'tool', { contextEpoch: secondEpoch }), 'context-unverified']
  ]) {
    const result = journey.transition(state, input);
    assert.equal(result.state.status, 'paused', reason); assert.equal(result.state.pendingTransition, null, reason);
    assert.equal(result.state.businessResult, 'unknown'); assert.equal(result.effects.locate, false); assert.equal(result.effects.reason, reason);
  }
  const paused = journey.transition(start(), event('context-changed', 'website', { contextEpoch: secondEpoch })).state;
  assert.equal(journey.transition(paused, event('continue', 'website', { contextEpoch: secondEpoch })).effects.reason, 'task-paused');
});
await check('Close, hidden arrival, reopen and reset never resurrect a location request or old operation', () => {
  let state = journey.transition(pendingState(), event('close', 'validation')).state;
  let result = journey.transition(state, event('observed', 'tool', { follow: true }));
  assert.equal(result.state.status, 'closed'); assert.equal(result.state.sceneId, 'tool'); assert.equal(result.effects.locate, false);
  result = journey.transition(result.state, event('reopen', 'tool', { follow: true }));
  assert.equal(result.state.status, 'paused'); assert.equal(result.state.stepId, '6a'); assert.equal(result.effects.locate, false);
  result = journey.transition(result.state, event('reset', 'tool'));
  assert.equal(result.state, null); assert.equal(result.effects.clear, true); assert.equal(result.effects.cancelLocate, true);
  assert.equal(journey.transition(start(), event('observed', 'website', { follow: true })).effects.cancelLocate, false);
});
await check('Worker authorizes top sender, document and exact public page independently of existing frame messages', async () => {
  const env = worker();
  for (const overrides of [{ id: 'other' }, { frameId: 1 }, { documentId: '' }, { documentId: undefined }, { tab: { url: env.sender().url } },
    { url: 'http://demo.impact.com' + checklistPath }, { url: 'https://example.invalid' + checklistPath }, { url: 'https://demo.impact.com' + toolPath + '/extra' },
    { url: env.sender().url, tab: { id: 7, url: 'https://app.impact.com' + checklistPath } }]) {
    assert.equal((await env.take('validation', epoch, env.sender(overrides))).reason, 'invalid-sender');
  }
  assert.equal(env.calls.length, 0);
  assert.equal((await env.take()).ok, true);
  assert.equal((await env.take('tool', epoch, env.at(toolPath))).ok, true);
  assert.equal((await env.take('tool', epoch, env.at(secondToolPath))).ok, true);
  assert.equal((await env.take('tests', epoch, env.at(testsPath))).ok, true);
  assert.equal((await env.take('tool', epoch, env.at(testsPath))).reason, 'invalid-message');
  assert.equal((await env.take('tests', epoch, env.at(toolPath))).reason, 'invalid-message');
  assert.equal((await env.take('tests', epoch, env.at(secondToolPath))).ok, true);
  assert.equal((await env.take('website', epoch, env.at('/secure/advertiser/engage/checklist/instance/synthetic'))).ok, true);
});
await check('A current empty take binds writes while sequence, storage shape and payload privacy remain strict', async () => {
  const env = worker(), state = pendingState();
  assert.equal((await env.put(state)).reason, 'document-unbound');
  assert.deepEqual(await env.take(), { ok: true, checkpoint: null, continuity: false, reason: 'empty' });
  assert.equal((await env.put(state)).saved, true);
  assert.deepEqual(env.session[journey.storagePrefix + 7], { state: clone(state) });
  assert.equal((await env.put(state)).reason, 'stale-sequence');
  assert.equal((await env.put({ ...state, privateValue: 'synthetic' }, 2)).reason, 'invalid-state');
  assert.equal((await env.send({ type: journey.messages.checkpoint, op: 'take', contextEpoch: epoch, sceneId: 'validation', rawUrl: 'synthetic' })).reason, 'invalid-message');
  assert.equal((await env.clear(2)).cleared, true); assert.equal(Object.keys(env.session).length, 0);
  assert.equal((await env.put(state, 1)).reason, 'stale-sequence');
  assert.equal((await env.put(start('validation'), 3)).reason, 'no-pending-transition');
  assert.deepEqual(Object.keys(env.context.chrome.storage), ['session']);
});
await check('Cross-document take returns only paused one-time source context for tool and test-list destinations', async () => {
  for (const { pathname, sceneId, fromScene } of destinationPages) {
    const sourcePath = fromScene === 'tool' ? toolPath : checklistPath;
    const env = worker(), source = env.at(sourcePath), state = pendingState(fromScene, { toScene: sceneId });
    await env.take(fromScene, epoch, source); await env.put(state, 1, source);
    env.current.set(7, { contextEpoch: secondEpoch });
    const target = env.at(pathname, { documentId: 'synthetic-document-b' });
    const result = await env.take(sceneId, secondEpoch, target);
    assert.equal(result.ok, true); assert.equal(result.continuity, false); assert.equal(result.reason, 'context-unverified');
    assert.equal(result.checkpoint.status, 'paused'); assert.equal(result.checkpoint.sceneId, fromScene);
    assert.equal(result.checkpoint.businessResult, 'unknown'); assert.equal(result.checkpoint.contextEpoch, epoch);
    assert.equal((await env.take(sceneId, secondEpoch, target)).checkpoint, null);
    assert.equal((await env.put(state, 2, source)).reason, 'stale-document');
  }
});
await check('A passive take ignores a reply for an obsolete shared route scene', async () => {
  const env=worker();
  const content=contentCheckpoint(env,null,{pathname:secondToolPath,sceneId:'tool',initialEpoch:epoch});
  const beforeBound=content.inspect().checkpointBound;
  let release,entered;
  const gate=new Promise(resolve=>{release=resolve;});
  const waiting=new Promise(resolve=>{entered=resolve;});
  content.transport.beforeSend=async()=>{entered();await gate;return {ok:true,checkpoint:clone(pendingState()),continuity:false};};
  const pending=content.run('take');await waiting;content.arrive('tests');release();await pending;
  assert.equal(content.inspect().checkpointBound,beforeBound);assert.equal(content.inspect().checkpointNote,'');
  assert.equal(content.inspect().journey,null);assert.equal(content.inspectUI().positionCalls,0);
});
await check('A passive arrival opens only the current explanation without reviving task, declarations or location', async () => {
  for (const { pathname, sceneId, fromScene } of destinationPages) {
    const env = worker(), source = env.at(fromScene === 'tool' ? toolPath : checklistPath);
    const state = { ...clone(pendingState(fromScene, { toScene: sceneId })), originScene: 'website' };
    await env.take(fromScene, epoch, source); await env.put(state, 1, source);
    env.current.set(7, { contextEpoch: secondEpoch });
    const content = contentCheckpoint(env, null, { pathname, sceneId, initialEpoch: secondEpoch, documentId: 'synthetic-passive-target' });
    await content.run('take');
    const current = content.inspect(), ui = content.inspectUI();
    assert.equal(current.checkpointBound, true); assert.equal(current.journey, null);
    assert.match(current.checkpointNote, /上次任务/u);
    assert.deepEqual(clone(ui), { settingsHidden: true, viewHidden: false, panelHidden: false,
      openExpanded: 'true', launcherExpanded: 'true', selectedStepId: sceneId === 'tests' ? '6c' : '6a',
      positionCalls: 1, declarations: 0, arrowRequested: false });
    assert.deepEqual(content.calls, [{ op: 'take' }], 'Read-only arrival must not write an active task');
    assert.equal(Object.keys(env.session).length, 0, 'Old pending checkpoint is consumed once');
    await content.run('take');
    assert.equal(content.inspectUI().positionCalls, 1, 'An empty take must not reopen old context again');
  }
  const env = worker({ session: { [journey.storagePrefix + 7]: { state: { ...clone(pendingState()), schemaVersion: 1 } } } });
  const content = contentCheckpoint(env, null, { pathname: toolPath, sceneId: 'tool', documentId: 'synthetic-old-schema-target' });
  await content.run('take');
  assert.equal(content.inspect().journey, null); assert.equal(content.inspect().checkpointNote, '');
  assert.equal(content.inspectUI().panelHidden, true); assert.equal(content.inspectUI().positionCalls, 0);
});
await check('A delayed passive take respects manual collapse while explicit open and fresh start retain their own intent', async () => {
  async function delayedArrival(sceneId, pathname) {
    const env = worker();
    await env.take();
    await env.put({ ...clone(pendingState('validation', { toScene: sceneId })), originScene: 'website' });
    env.current.set(7, { contextEpoch: secondEpoch });
    const content = contentCheckpoint(env, null, { pathname, sceneId, initialEpoch: secondEpoch, documentId: 'synthetic-delayed-target' });
    let release, entered;
    const gate = new Promise(resolve => { release = resolve; });
    const readStarted = new Promise(resolve => { entered = resolve; });
    env.hooks.get = async () => { entered(); await gate; };
    const pending = content.run('take');
    await readStarted;
    return { env, content, release, pending };
  }
  for (const [sceneId, pathname] of [['tool', toolPath], ['tests', testsPath]]) {
    const closed = await delayedArrival(sceneId, pathname);
    closed.content.collapse();
    assert.equal(closed.content.inspectIntent().passiveOpenAllowed, false);
    closed.release(); await closed.pending;
    assert.match(closed.content.inspect().checkpointNote, /上次任务/u, 'Closing only suppresses expansion, not the passive source note');
    assert.equal(closed.content.inspect().journey, null);
    assert.equal(closed.content.inspectUI().panelHidden, true);
    assert.equal(closed.content.inspectUI().viewHidden, true);
    assert.equal(closed.content.inspectUI().declarations, 0); assert.equal(closed.content.inspectUI().arrowRequested, false);
    assert.deepEqual(closed.content.calls, [{ op: 'take' }]);
    closed.content.show(); closed.content.openGuide();
    assert.equal(closed.content.inspectUI().panelHidden, false); assert.equal(closed.content.inspectUI().viewHidden, false);
    assert.equal(closed.content.inspectIntent().passiveOpenAllowed, true);
    assert.equal(closed.content.inspect().journey, null, 'Explicit viewing still cannot resume an old task');
    assert.match(closed.content.inspect().checkpointNote, /上次任务/u);
    closed.content.startCurrent();
    assert.equal(closed.content.inspect().checkpointNote, '');
    assert.equal(closed.content.inspect().journey.originScene, sceneId);
    assert.equal(closed.content.inspect().journey.sceneId, sceneId);
    assert.equal(closed.content.inspect().journey.journeyId, freshJourneyId);
    assert.equal(closed.content.inspect().journey.status, 'active');
    assert.equal(closed.content.inspect().journey.businessResult, 'unknown');
    assert.equal(closed.content.inspectUI().declarations, 0); assert.equal(closed.content.inspectUI().arrowRequested, false);

    const opened = await delayedArrival(sceneId, pathname);
    opened.content.collapse(); opened.content.show(); opened.content.openGuide();
    opened.release(); await opened.pending;
    assert.equal(opened.content.inspectUI().panelHidden, false); assert.equal(opened.content.inspectUI().viewHidden, false);
    assert.match(opened.content.inspect().checkpointNote, /上次任务/u);
    assert.equal(opened.content.inspect().journey, null, 'An explicit open during the take only shows the current explanation');

    const started = await delayedArrival(sceneId, pathname);
    started.content.show(); started.content.openGuide(); started.content.startCurrent();
    started.release(); await started.pending;
    assert.equal(started.content.inspect().checkpointNote, '', 'An obsolete take cannot append source context after explicit fresh start');
    assert.equal(started.content.inspect().journey.originScene, sceneId);
    assert.equal(started.content.inspect().journey.journeyId, freshJourneyId);
    assert.equal(started.content.inspect().journey.status, 'active');
    assert.equal(started.content.inspectUI().declarations, 0); assert.equal(started.content.inspectUI().arrowRequested, false);
  }
});
await check('Expiry, target mismatch, corrupt version and extra checkpoint fields are discarded', async () => {
  const cases = [
    { record: { state: clone(pendingState()) }, scene: 'website', reason: 'transition-unverified' },
    { record: { state: clone(pendingState()) }, advance: journey.transitionTtlMs, scene: 'tool', reason: 'transition-unverified' },
    { record: { state: { ...clone(pendingState()), schemaVersion: 1 } }, scene: 'tool', reason: 'invalid-checkpoint' },
    { record: { state: { ...clone(pendingState()), schemaVersion: 9 } }, scene: 'tool', reason: 'invalid-checkpoint' },
    { record: { state: clone(pendingState()), url: 'synthetic' }, scene: 'tool', reason: 'invalid-checkpoint' },
    { record: { state: { ...clone(pendingState()), pendingTransition: null } }, scene: 'tool', reason: 'transition-unverified' }
  ];
  for (const item of cases) {
    const session = { [journey.storagePrefix + 7]: item.record }, env = worker({ session, clock: now + (item.advance || 0) });
    const result = await env.take(item.scene, epoch, item.scene === 'tool' ? env.at(toolPath) : env.sender());
    assert.equal(result.reason, item.reason); assert.equal(result.checkpoint, null); assert.equal(Object.keys(session).length, 0);
  }
});
await check('Worker restart never promotes a session checkpoint to active, and other tabs cannot consume it', async () => {
  const first = worker(); await first.take(); await first.put(pendingState());
  const restarted = worker({ session: first.session });
  restarted.current.set(8, { contextEpoch: secondEpoch });
  const other = restarted.at(toolPath, { documentId: 'synthetic-other-tab', tab: { id: 8, url: 'https://demo.impact.com' + toolPath } });
  assert.equal((await restarted.take('tool', secondEpoch, other)).checkpoint, null);
  assert(Object.hasOwn(first.session, journey.storagePrefix + 7));
  const result = await restarted.take('tool', epoch, restarted.at(toolPath, { documentId: 'synthetic-restarted-document' }));
  assert.equal(result.checkpoint.status, 'paused'); assert.equal(result.continuity, false);
});
await check('Duplicate concurrent takes consume once and same-document take cannot reset the sequence fence', async () => {
  const env = worker(); await env.take(); await env.put(pendingState(), 5);
  const target = env.at(toolPath);
  const values = await Promise.all([env.take('tool', epoch, target), env.take('tool', epoch, target)]);
  assert.equal(values.filter(value => value.checkpoint).length, 1);
  assert.equal((await env.put(pendingState(), 4)).reason, 'stale-sequence');
});
await check('Late read, remove and write completions recheck current document before returning or retaining data', async () => {
  for (const waitPoint of ['get', 'remove', 'set']) {
    const env = worker(); await env.take();
    if (waitPoint !== 'set') await env.put(pendingState());
    env.hooks[waitPoint] = async () => { env.current.set(7, { contextEpoch: secondEpoch }); };
    const result = waitPoint === 'set' ? await env.put(pendingState(), 2) : await env.take('tool', epoch, env.at(toolPath));
    assert.equal(result.reason, 'stale-document', waitPoint); assert.equal(Object.hasOwn(result, 'checkpoint'), false);
    if (waitPoint !== 'get') assert.equal(Object.keys(env.session).length, 0, waitPoint);
  }
  const env = worker(); await env.take(); await env.put(pendingState());
  env.hooks.remove = async () => { env.current.set(7, { contextEpoch: secondEpoch }); };
  assert.equal((await env.clear(2)).reason, 'stale-document');
});
await check('Missing session storage and storage rejection fail safely without active checkpoint fallback', async () => {
  const absent = worker({ unavailable: true });
  assert.deepEqual(await absent.take(), { ok: false, reason: 'session-unavailable' });
  assert.equal(absent.calls.length, 0);
  const failed = worker(); failed.hooks.get = async () => { throw Error('Synthetic session failure'); };
  assert.deepEqual(await failed.take(), { ok: false, reason: 'session-unavailable' });
});
await check('Expired or incoherent writes cannot replace a checkpoint and closing a tab clears its bounded record', async () => {
  const env = worker(); await env.take(); await env.put(pendingState());
  env.setClock(now + journey.transitionTtlMs);
  assert.equal((await env.put(pendingState(), 2)).reason, 'transition-unverified');
  assert.equal(Object.keys(env.session).length, 0);
  env.setClock(now);
  const incoherent = { ...clone(pendingState()), sceneId: 'website', stepId: '5b' };
  assert.equal((await env.put(incoherent, 3)).reason, 'transition-unverified');
  assert.equal(Object.keys(env.session).length, 0);
  await env.put(pendingState(), 4); assert.equal(Object.keys(env.session).length, 1);
  await env.closeTab(7); assert.equal(Object.keys(env.session).length, 0);
  assert.equal((await env.put(pendingState(), 5)).reason, 'stale-document');
});
await check('A still-bound content document rebinds after worker restart and saves its current pending source once', async () => {
  const original = worker(); await original.take(); await original.put(start('validation'), 3);
  const restarted = worker({ session: original.session }), content = contentCheckpoint(restarted);
  assert.equal(content.inspect().checkpointBound, true);
  await content.run('put');
  assert.deepEqual(content.calls.map(call => call.op), ['put', 'take', 'put'], 'A lost worker owner must trigger one current-document rebind and retry');
  assert.equal(content.calls[2].seq > content.calls[0].seq, true);
  assert.equal(restarted.session[journey.storagePrefix + 7]?.state.originScene, 'website');
  restarted.current.set(7, { contextEpoch: secondEpoch });
  const arrival = await restarted.take('tool', secondEpoch, restarted.at(toolPath, { documentId: 'synthetic-rebound-target' }));
  assert.equal(arrival.checkpoint?.originScene, 'website'); assert.equal(arrival.checkpoint?.pendingTransition.to, 'tool');
  assert.equal(arrival.checkpoint?.status, 'paused'); assert.equal(arrival.continuity, false);
});
await check('Rebinding rejects obsolete task snapshots while only a still-current context can retain binding', async () => {
  for (const kind of ['generation', 'epoch', 'route', 'state', 'foreign-state', 'invalid-state', 'scene', 'sequence', 'destroyed']) {
    const env = worker(), content = contentCheckpoint(env);
    env.hooks.get = async () => { content.change(kind); };
    await content.run('put');
    assert.deepEqual(content.calls.map(call => call.op), ['put', 'take'], kind);
    assert.equal(Object.keys(env.session).length, 0, kind);
    assert.equal(content.inspect().checkpointBound, ['state', 'foreign-state', 'invalid-state', 'scene', 'sequence'].includes(kind), kind);
    assert.equal(content.inspect().checkpointNote, '', kind);
  }
});
await check('Concurrent unbound puts recover only the latest sequence and retry rejection cannot loop', async () => {
  const env = worker(), content = contentCheckpoint(env);
  await Promise.all([content.run('put'), content.run('put')]);
  assert.deepEqual(content.calls, [{ op: 'put', seq: 4 }, { op: 'put', seq: 5 }, { op: 'take' }, { op: 'put', seq: 6 }]);
  assert.equal(env.session[journey.storagePrefix + 7]?.state.originScene, 'website');
  const denied = worker(), deniedContent = contentCheckpoint(denied);
  let puts = 0;
  deniedContent.transport.beforeSend = message => {
    if (message.op === 'put' && ++puts === 2) return { ok: false, reason: 'document-unbound' };
  };
  await deniedContent.run('put');
  assert.deepEqual(deniedContent.calls.map(call => call.op), ['put', 'take', 'put']);
  assert.equal(deniedContent.inspect().checkpointBound, false);
  assert.equal(Object.keys(denied.session).length, 0);
});
await check('Rebind failure and non-owner errors never become a broader retry or an active restored checkpoint', async () => {
  const failed = worker(), content = contentCheckpoint(failed);
  failed.hooks.get = async () => { throw Error('Synthetic rebind session failure'); };
  await content.run('put');
  assert.deepEqual(content.calls.map(call => call.op), ['put', 'take']);
  assert.equal(content.inspect().checkpointBound, false);
  for (const reason of ['stale-document', 'stale-sequence', 'session-unavailable', 'invalid-state']) {
    const env = worker(), denied = contentCheckpoint(env);
    denied.transport.beforeSend = () => ({ ok: false, reason });
    await denied.run('put');
    assert.deepEqual(denied.calls.map(call => call.op), ['put'], reason);
    assert.equal(Object.keys(env.session).length, 0, reason);
    assert.equal(denied.inspect().checkpointNote, '', reason);
  }
});
await check('A same-context continue during delayed rebind saves the latest pending intent instead of losing binding', async () => {
  const env = worker(), content = contentCheckpoint(env);
  const originalExpiry = content.inspect().journey.pendingTransition.expiresAt;
  env.hooks.get = async () => {
    assert.equal(content.inspect().checkpointBound, false);
    content.setClock(now + 5000); env.setClock(now + 5000);
    content.continueCurrent();
  };
  await content.run('put');
  assert.equal(content.inspect().checkpointBound, true);
  const saved = env.session[journey.storagePrefix + 7]?.state;
  assert.equal(saved?.pendingTransition.expiresAt, originalExpiry + 5000, 'Retry must use the new continue intent rather than the original request state');
  assert.equal(saved?.originScene, 'website'); assert.equal(saved?.pendingTransition.to, 'tool');
  assert.deepEqual(content.calls.map(call => call.op), ['put', 'take', 'put']);
});
await check('A legal same-document scene advance during rebind saves only the latest observed scene and destination', async () => {
  const env = worker(), content = contentCheckpoint(env, pendingState('website'));
  env.hooks.get = async () => {
    content.setClock(now + 1000); env.setClock(now + 1000);
    content.arrive('validation'); content.continueCurrent();
  };
  await content.run('put');
  assert.equal(content.inspect().checkpointBound, true);
  const saved = env.session[journey.storagePrefix + 7]?.state;
  assert.equal(saved?.sceneId, 'validation'); assert.equal(saved?.originScene, 'website');
  assert.equal(saved?.pendingTransition.from, 'validation'); assert.equal(saved?.pendingTransition.to, 'tool');
  assert.deepEqual(content.calls.map(call => call.op), ['put', 'take', 'put']);
});

const status = results.every(result => result.status === 'PASS') ? 'PASS' : 'FAIL';
const report = { mode: 'JOURNEY_PURE_AND_WORKER_VM_ONLY', realSiteAcceptance: false,
  version: JSON.parse(readFileSync(path.join(sourceDir, 'manifest.json'), 'utf8')).version, selectedFilter: onlyFilter || null,
  sourceSHA256: Object.fromEntries([['content.js', contentSource], ['background.js', sources['background.js']], ['journey.js', sources['journey.js']]]
    .map(([name, source]) => [name, createHash('sha256').update(source).digest('hex')])), status, results };
const reportDir = process.argv.find(argument => argument.startsWith('--report-dir='))?.slice('--report-dir='.length);
if (reportDir) { mkdirSync(reportDir, { recursive: true }); writeFileSync(path.join(reportDir, 'journey-report.json'), JSON.stringify(report, null, 2) + '\n'); }
console.log('JOURNEY ' + status + ': ' + results.filter(result => result.status === 'PASS').length + '/' + results.length);
process.exitCode = status === 'PASS' ? 0 : 1;

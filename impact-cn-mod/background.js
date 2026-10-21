/* Forward an observed iframe's concept question to the existing top-level AI. */
"use strict";

importScripts("dict.js");
importScripts("journey.js");
const frameRequests = new Map();
let frameRequestSequence = 0;
const checklistAssetPaths = new Set([
  "/onboarding-ui/checklist-assets/production/payout-terms/default.html",
  "/onboarding-ui/checklist-assets/production/migrated/event-type-validation.html",
  "/onboarding-ui/checklist-assets/production/operator-json/linkout.html",
  "/onboarding-ui/checklist-assets/production/operator-json/instructions.html"
]);

function checklistFrameAllowed(sender) {
  if (sender.id !== chrome.runtime.id || !(sender.frameId > 0) || sender.tab?.id === undefined
    || typeof sender.documentId !== "string" || !sender.documentId) return false;
  try {
    const source = new URL(sender.url);
    const top = new URL(sender.tab.url);
    return source.protocol === "https:" && source.hostname === "ui.assets.impact.com"
      && checklistAssetPaths.has(source.pathname)
      && top.protocol === "https:" && ["demo.impact.com", "app.impact.com"].includes(top.hostname)
      && (top.pathname.startsWith("/secure/advertiser/engage/checklist/instance/")
        || top.pathname === "/secure/advertiser/checklist/checklist-instance.ihtml");
  } catch { return false; }
}

function queryMatches(expected, search) {
  const query = new URLSearchParams(search);
  return Object.entries(expected || {}).every(([key, value]) => query.getAll(key).length === 1 && query.get(key) === String(value));
}

function topicMatchesPages(id, source, top) {
  const dictionary = globalThis.IMPACT_CN_DICTIONARY;
  const topic = dictionary?.helpTopics?.find((item) => item.id === id);
  if (!topic || top.protocol !== "https:" || top.origin !== source.origin) return false;
  return (dictionary.entries || []).some((entry) => {
    const scope = entry.scope;
    // One associated entry must authorize both the source document and its
    // enclosing shell; never combine unrelated entries of the same topic.
    if (!topic.entryIds?.includes(entry.id) || (entry.helpTopicId && entry.helpTopicId !== id)
      || !scope || typeof scope !== "object" || !scope.hosts?.includes(source.hostname)
      || scope.topOnly === true
      || !scope.pathExact || scope.pathExact !== source.pathname
      || !scope.topPaths?.includes(top.pathname)) return false;
    return queryMatches(scope.query, source.search) && queryMatches(scope.topQuery, top.search);
  });
}

chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (message?.type === "impact-cn:guide-probe") return handleGuideProbe(message, sender, respond);
  if (message?.type === "impact-cn:guide-cancel") return handleGuideCancel(message, sender, respond);
  if (message?.type === "impact-cn:guide-frame-report") return handleGuideFrameReport(message, sender, respond);
  if (message?.type === "impact-cn:journey-checkpoint") return handleJourneyCheckpoint(message, sender, respond);
  if (message?.type === "impact-cn:checklist-frame-context") {
    // The frame asks only whether its existing Checklist can be translated.
    // Relay only a fixed public route identifier, never the actual tab URL,
    // instance token, query, form value or business data.
    const allowed = checklistFrameAllowed(sender);
    respond({ allowed, ...(allowed ? { topPath: new URL(sender.tab.url).pathname === "/secure/advertiser/checklist/checklist-instance.ihtml"
      ? "/secure/advertiser/checklist/checklist-instance.ihtml" : "/secure/advertiser/engage/checklist/instance/" } : {}) });
    return false;
  }
  if (message?.type === "impact-cn:confirm-source-request") {
    const request = frameRequests.get(message.sourceRequestId);
    if (!request || sender.id !== chrome.runtime.id || sender.frameId !== 0 || sender.tab?.id !== request.tabId) {
      respond({ active: false });
      return false;
    }
    chrome.tabs.sendMessage(request.tabId, { type: "impact-cn:confirm-frame-request", topicId: request.topicId },
      { frameId: request.frameId, documentId: request.documentId })
      .then((result) => respond({ active: result?.active === true }), () => respond({ active: false }));
    return true;
  }
  if (message?.type !== "impact-cn:frame-ask-topic") return false;
  let url;
  try { url = new URL(sender.url); } catch { respond({ ok: false, reason: "invalid-frame" }); return false; }
  const allowed = sender.id === chrome.runtime.id && sender.tab?.id !== undefined && sender.frameId > 0
    && ["app.impact.com", "demo.impact.com"].includes(url.hostname) && url.protocol === "https:"
    && (["/secure/finance/app/", "/secure/advertiser/finance/", "/secure/advertiser/Adv_Finance_Report/"].some((path) => url.pathname.startsWith(path))
      || [
        "/secure/datalab/datalab.html",
        "/secure/compliance/data/social-listening-flow.ihtml",
        "/secure/compliance/view/paid-search-monitor-controller.ihtml",
        "/secure/compliance/view/search-monitor-violations-controller.ihtml",
        "/secure/compliance/view/policy-controller.ihtml"
      ].includes(url.pathname))
    && typeof message.topicId === "string" && /^[a-z0-9-]{1,100}$/u.test(message.topicId);
  if (!allowed) { respond({ ok: false, reason: "invalid-frame" }); return false; }
  let top;
  try { top = new URL(sender.tab.url); } catch { respond({ ok: false, reason: "invalid-frame" }); return false; }
  if (!topicMatchesPages(message.topicId, url, top)) { respond({ ok: false, reason: "topic-out-of-scope" }); return false; }
  // A frameId is reused after navigation; documentId keeps confirmations bound
  // to the original document. Never relay the source URL or any business data.
  if (typeof sender.documentId !== "string" || !sender.documentId) {
    respond({ ok: false, reason: "source-document-unavailable" });
    return false;
  }
  const sourceRequestId = `frame-${++frameRequestSequence}`;
  frameRequests.set(sourceRequestId, { tabId: sender.tab.id, frameId: sender.frameId, documentId: sender.documentId, topicId: message.topicId });
  chrome.tabs.sendMessage(sender.tab.id, { type: "impact-cn:top-ask-topic", topicId: message.topicId, sourceRequestId }, { frameId: 0 })
    .then(respond, () => respond({ ok: false, reason: "top-ai-unavailable" }))
    .finally(() => frameRequests.delete(sourceRequestId));
  return true;
});

// This contract is deliberately separate from frame translation and AI authorization.
// Session records contain only public scenes and random task/context tokens. They
// never authorize an old document or establish Program continuity after navigation.
const journeyOwners = new Map();
const journeyQueues = new Map();
const journeyContract = globalThis.IMPACT_CN_JOURNEY;
const journeyToolPaths = new Set([
  "/secure/advertiser/tracking-settings/actiontracker/launch-test-action-flow.ihtml"
]);
function journeyPage(sender) {
  if (sender.id !== chrome.runtime.id || sender.frameId !== 0 || !Number.isInteger(sender.tab?.id) || sender.tab.id < 0
      || typeof sender.documentId !== "string" || !sender.documentId) return null;
  try {
    const source = new URL(sender.url), top = new URL(sender.tab.url);
    if (source.protocol !== "https:" || !["demo.impact.com", "app.impact.com"].includes(source.hostname)
        || source.href !== top.href) return null;
    if (source.pathname.startsWith("/secure/advertiser/engage/checklist/instance/")
        || source.pathname === "/secure/advertiser/checklist/checklist-instance.ihtml") return "checklist";
    if (source.pathname === "/secure/advertiser/engage/actions/tests/test-actions-flow.ihtml") return "test-actions";
    return source.pathname === "/secure/advertiser/actions/tests/test-actions-flow.ihtml" ? "tests"
      : journeyToolPaths.has(source.pathname) ? "tool" : null;
  } catch { return null; }
}
function journeySceneOnPage(sceneId, page) {
  return page === "test-actions" ? ["tests", "tool"].includes(sceneId)
    : page === "tool" ? sceneId === "tool" : page === "tests" ? sceneId === "tests"
    : page === "checklist" && ["website", "validation", "unknown"].includes(sceneId);
}
async function journeyCurrent(sender, contextEpoch) {
  let timer;
  try {
    const result = await Promise.race([
      chrome.tabs.sendMessage(sender.tab.id, { type: journeyContract.messages.currentContext, contextEpoch }, { frameId: 0 }),
      new Promise(resolve => { timer = setTimeout(() => resolve(null), 1500); })
    ]);
    return result?.active === true && result.contextEpoch === contextEpoch;
  } catch { return false; }
  finally { clearTimeout(timer); }
}
function liveJourneyPending(state, now) {
  const pending = state.pendingTransition;
  return Boolean(pending && pending.from === state.sceneId && pending.expiresAt > now
    && pending.expiresAt <= now + journeyContract.transitionTtlMs);
}
async function journeyCheckpoint(message, sender, page) {
  const opKeys = message.op === "put" ? ["type", "op", "contextEpoch", "seq", "state"]
    : message.op === "clear" ? ["type", "op", "contextEpoch", "seq"] : ["type", "op", "contextEpoch", "sceneId"];
  if (!["put", "take", "clear"].includes(message.op) || !journeyContract.exactKeys(message, opKeys)
      || !journeyContract.validId(message.contextEpoch)
      || (message.op === "take" && (!journeyContract.validScene(message.sceneId) || !journeySceneOnPage(message.sceneId, page)))
      || (message.op !== "take" && (!Number.isSafeInteger(message.seq) || message.seq <= 0))) return { ok: false, reason: "invalid-message" };
  const session = chrome.storage?.session;
  if (!session?.get || !session?.set || !session?.remove) return { ok: false, reason: "session-unavailable" };
  if (!await journeyCurrent(sender, message.contextEpoch)) return { ok: false, reason: "stale-document" };
  const tabId = sender.tab.id, key = journeyContract.storagePrefix + tabId;
  const stillCurrent = () => journeyCurrent(sender, message.contextEpoch);
  const stale = () => {
    const currentOwner = journeyOwners.get(tabId);
    if (currentOwner?.documentId === sender.documentId && currentOwner.contextEpoch === message.contextEpoch) journeyOwners.delete(tabId);
    return { ok: false, reason: "stale-document" };
  };
  let owner = journeyOwners.get(tabId);
  const sameOwner = owner?.documentId === sender.documentId && owner.contextEpoch === message.contextEpoch;
  if (message.op === "take") {
    if (!sameOwner) { owner = { documentId: sender.documentId, contextEpoch: message.contextEpoch, seq: 0 }; journeyOwners.set(tabId, owner); }
    const stored = await session.get(key), record = stored?.[key];
    if (!await stillCurrent()) return stale();
    // Consume before returning, including invalid/expired entries. A retry cannot
    // resurrect an active task, even after the worker loses its in-memory owner.
    await session.remove(key);
    if (!await stillCurrent()) return stale();
    if (!journeyContract.exactKeys(record, ["state"]) || !journeyContract.validState(record.state)) {
      return { ok: true, checkpoint: null, continuity: false, reason: record === undefined ? "empty" : "invalid-checkpoint" };
    }
    const state = record.state, pending = state.pendingTransition, now = Date.now();
    if (!liveJourneyPending(state, now) || pending.to !== message.sceneId) {
      return { ok: true, checkpoint: null, continuity: false, reason: "transition-unverified" };
    }
    return { ok: true, checkpoint: { ...state, pendingTransition: { ...pending }, status: "paused", businessResult: "unknown" },
      continuity: false, reason: "context-unverified" };
  }
  if (message.op === "put" && !sameOwner) return { ok: false, reason: "document-unbound" };
  if (sameOwner && message.seq <= owner.seq) return { ok: false, reason: "stale-sequence" };
  if (message.op === "clear") {
    journeyOwners.set(tabId, { documentId: sender.documentId, contextEpoch: message.contextEpoch, seq: message.seq });
    await session.remove(key);
    if (!await stillCurrent()) return stale();
    return { ok: true, cleared: true };
  }
  if (!journeyContract.validState(message.state) || message.state.contextEpoch !== message.contextEpoch
      || !journeySceneOnPage(message.state.sceneId, page)) return { ok: false, reason: "invalid-state" };
  owner.seq = message.seq;
  if (!message.state.pendingTransition) {
    await session.remove(key);
    if (!await stillCurrent()) return stale();
    return { ok: true, saved: false, reason: "no-pending-transition" };
  }
  if (!liveJourneyPending(message.state, Date.now())) {
    await session.remove(key);
    return { ok: false, reason: "transition-unverified" };
  }
  const state = { ...message.state, pendingTransition: { ...message.state.pendingTransition } };
  await session.set({ [key]: { state } });
  if (!await stillCurrent()) {
    // Per-tab serialization prevents this cleanup from deleting a newer write.
    await session.remove(key);
    return stale();
  }
  return { ok: true, saved: true };
}
function handleJourneyCheckpoint(message, sender, respond) {
  const page = journeyPage(sender);
  if (!page) { respond({ ok: false, reason: "invalid-sender" }); return false; }
  const tabId = sender.tab.id;
  // Serialize reads/removals/writes per tab so duplicate takes and late puts have
  // deterministic ownership and one-time consumption without storing metadata.
  const queued = (journeyQueues.get(tabId) || Promise.resolve()).then(() => journeyCheckpoint(message, sender, page));
  const settled = queued.then(respond, () => respond({ ok: false, reason: "session-unavailable" }));
  journeyQueues.set(tabId, settled);
  settled.finally(() => { if (journeyQueues.get(tabId) === settled) journeyQueues.delete(tabId); });
  return true;
}
chrome.tabs?.onRemoved?.addListener(tabId => {
  journeyOwners.delete(tabId);
  const queued = journeyQueues.get(tabId) || Promise.resolve();
  void queued.then(() => chrome.storage?.session?.remove?.(journeyContract.storagePrefix + tabId)).catch(() => {});
});

// Read-only geometry bridge. Translation eligibility, AI authorization and journey
// persistence remain independent. Only fixed target roles and bounded viewport
// geometry cross this boundary; no page text, values or URLs are relayed or stored.
const guidePending = new Map();
const guideRoles = new Set(["validation-open", "validation-tests"]);
const guideStates = new Set(["ready", "covered", "clipped", "loading"]);
const guideFramePath = "/onboarding-ui/checklist-assets/production/migrated/event-type-validation.html";
const guideTtlMs = 1500;
const guideGeometryLimit = 16384;
function guideCurrentRequest(request) {
  return guidePending.get(request.tabId) === request && !request.done && Date.now() < request.expiresAt;
}
function guideFinish(request, result) {
  if (request.done) return;
  request.done = true;
  clearTimeout(request.timer);
  if (guidePending.get(request.tabId) === request) guidePending.delete(request.tabId);
  request.respond(result);
}
function guideTopMessage(message, sender, keys) {
  return journeyPage(sender) === "checklist" && journeyContract.exactKeys(message, keys)
    && journeyContract.validId(message.requestId) && journeyContract.validId(message.contextEpoch);
}
function handleGuideProbe(message, sender, respond) {
  if (journeyPage(sender) !== "checklist") { respond({ ok: false, reason: "invalid-sender" }); return false; }
  if (!guideTopMessage(message, sender, ["type", "requestId", "contextEpoch", "role"]) || !guideRoles.has(message.role)) {
    respond({ ok: false, reason: "invalid-message" }); return false;
  }
  const previous = guidePending.get(sender.tab.id);
  if (previous?.requestId === message.requestId) { respond({ ok: false, reason: "duplicate-request" }); return false; }
  if (previous) guideFinish(previous, { ok: false, reason: "superseded" });
  const request = { tabId: sender.tab.id, requestId: message.requestId, contextEpoch: message.contextEpoch,
    role: message.role, sender, respond, expiresAt: Date.now() + guideTtlMs, done: false, probing: false, confirming: false };
  guidePending.set(request.tabId, request);
  request.timer = setTimeout(() => guideFinish(request, { ok: false, reason: "timeout" }), guideTtlMs);
  void (async () => {
    if (!await journeyCurrent(sender, request.contextEpoch)) {
      if (guideCurrentRequest(request)) guideFinish(request, { ok: false, reason: "stale-document" });
      return;
    }
    if (!guideCurrentRequest(request)) return;
    request.probing = true;
    try {
      await chrome.tabs.sendMessage(request.tabId, { type: "impact-cn:guide-probe-frame", requestId: request.requestId, role: request.role });
    } catch {
      if (guideCurrentRequest(request) && !request.confirming) guideFinish(request, { ok: false, reason: "frame-unavailable" });
    }
  })();
  return true;
}
function handleGuideCancel(message, sender, respond) {
  if (journeyPage(sender) !== "checklist") { respond({ ok: false, reason: "invalid-sender" }); return false; }
  if (!guideTopMessage(message, sender, ["type", "requestId", "contextEpoch"])) {
    respond({ ok: false, reason: "invalid-message" }); return false;
  }
  const request = guidePending.get(sender.tab.id);
  if (!request || request.requestId !== message.requestId || request.contextEpoch !== message.contextEpoch
      || request.sender.documentId !== sender.documentId) { respond({ ok: false, reason: "stale-request" }); return false; }
  void (async () => {
    if (!await journeyCurrent(sender, message.contextEpoch)) { respond({ ok: false, reason: "stale-document" }); return; }
    if (!guideCurrentRequest(request)) { respond({ ok: false, reason: "stale-request" }); return; }
    guideFinish(request, { ok: false, reason: "cancelled" });
    respond({ ok: true });
  })();
  return true;
}
function guideFrameSender(sender) {
  if (!checklistFrameAllowed(sender) || !Number.isInteger(sender.tab.id) || sender.tab.id < 0) return false;
  try { return new URL(sender.url).pathname === guideFramePath; } catch { return false; }
}
function guideGeometry(message) {
  const viewport = message.viewport, rect = message.rect;
  const dimension = value => Number.isFinite(value) && value > 0 && value <= guideGeometryLimit;
  if (!journeyContract.exactKeys(viewport, ["width", "height"]) || !dimension(viewport.width) || !dimension(viewport.height)) return false;
  if (rect === null) return message.state !== "ready";
  return journeyContract.exactKeys(rect, ["left", "top", "width", "height"])
    && Number.isFinite(rect.left) && rect.left >= 0 && Number.isFinite(rect.top) && rect.top >= 0
    && dimension(rect.width) && dimension(rect.height)
    && rect.left + rect.width <= viewport.width && rect.top + rect.height <= viewport.height;
}
function handleGuideFrameReport(message, sender, respond) {
  if (!guideFrameSender(sender)) { respond({ ok: false, reason: "invalid-frame" }); return false; }
  if (!journeyContract.exactKeys(message, ["type", "requestId", "role", "target", "state", "rect", "viewport"])
      || !journeyContract.validId(message.requestId) || !guideRoles.has(message.role)
      || ![message.role, "help-close"].includes(message.target) || !guideStates.has(message.state) || !guideGeometry(message)) {
    respond({ ok: false, reason: "invalid-report" }); return false;
  }
  const request = guidePending.get(sender.tab.id);
  if (!request || !guideCurrentRequest(request) || !request.probing || request.confirming
      || request.requestId !== message.requestId || request.role !== message.role || sender.tab.url !== request.sender.url) {
    respond({ ok: false, reason: "stale-request" }); return false;
  }
  request.confirming = true;
  void (async () => {
    let active = false;
    try {
      const result = await chrome.tabs.sendMessage(sender.tab.id,
        { type: "impact-cn:guide-confirm-frame", requestId: request.requestId, role: request.role },
        { frameId: sender.frameId, documentId: sender.documentId });
      active = result?.active === true;
    } catch { /* A navigated or removed frame cannot confirm the report. */ }
    if (!guideCurrentRequest(request)) { respond({ ok: false, reason: "stale-request" }); return; }
    if (!active) {
      guideFinish(request, { ok: false, reason: "stale-frame" });
      respond({ ok: false, reason: "stale-frame" }); return;
    }
    if (!await journeyCurrent(request.sender, request.contextEpoch)) {
      if (guideCurrentRequest(request)) guideFinish(request, { ok: false, reason: "stale-document" });
      respond({ ok: false, reason: "stale-document" }); return;
    }
    if (!guideCurrentRequest(request)) { respond({ ok: false, reason: "stale-request" }); return; }
    guideFinish(request, { ok: true, role: request.role, target: message.target, state: message.state,
      rect: message.rect === null ? null : { ...message.rect }, viewport: { ...message.viewport } });
    respond({ ok: true });
  })();
  return true;
}

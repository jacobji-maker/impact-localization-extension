/* Pure, bounded guidance state. No DOM, storage, identifiers or business results. */
(() => {
  "use strict";
  const schemaVersion = 2;
  const transitionTtlMs = 120000;
  const scenes = Object.freeze({ website: "website", validation: "validation", tool: "tool", tests: "tests", unknown: "unknown" });
  const steps = Object.freeze({ website: "5b", validation: "6a", tool: "6a", tests: "6c" });
  const nextScenes = Object.freeze({ website: "validation", validation: "tool", tool: "tests" });
  const edges = Object.freeze({ website: Object.freeze(["validation"]), validation: Object.freeze(["tool", "tests"]), tool: Object.freeze(["tests"]) });
  const messages = Object.freeze({ checkpoint: "impact-cn:journey-checkpoint", currentContext: "impact-cn:journey-current-context" });
  const storagePrefix = "impactCNJourneyTab:";
  const stateKeys = ["schemaVersion", "journeyId", "contextEpoch", "originScene", "sceneId", "stepId", "pendingTransition", "status", "businessResult"];
  const record = value => Boolean(value && typeof value === "object" && !Array.isArray(value));
  const exactKeys = (value, keys) => record(value) && Reflect.ownKeys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key));
  const validId = value => typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u.test(value);
  const knownScene = value => Object.hasOwn(steps, value);
  const validScene = value => knownScene(value) || value === scenes.unknown;
  const validNow = value => Number.isSafeInteger(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER - transitionTtlMs;
  const validEdge = (from, to) => Object.hasOwn(edges, from) && edges[from].includes(to);
  function validPending(value) {
    return value === null || (exactKeys(value, ["from", "to", "expiresAt"])
      && validEdge(value.from, value.to) && validNow(value.expiresAt));
  }
  function validState(value) {
    return exactKeys(value, stateKeys) && value.schemaVersion === schemaVersion
      && validId(value.journeyId) && validId(value.contextEpoch) && knownScene(value.originScene)
      && validScene(value.sceneId) && Object.values(steps).includes(value.stepId)
      && (!knownScene(value.sceneId) || steps[value.sceneId] === value.stepId)
      && validPending(value.pendingTransition) && ["active", "paused", "closed"].includes(value.status)
      && value.businessResult === "unknown";
  }
  function copyState(state) {
    return { ...state, pendingTransition: state.pendingTransition && { ...state.pendingTransition } };
  }
  function output(state, reason, changes = {}) {
    return { state, effects: { cancelLocate: true, locate: false, save: false, clear: false, arrived: false, reason, ...changes } };
  }
  function transition(previous, event) {
    const state = validState(previous) ? copyState(previous) : null;
    if (!record(event) || typeof event.type !== "string") return output(state, "invalid-event");
    if (event.type === "reset") return output(null, "reset", { clear: true });
    if (event.type === "start") {
      if (!knownScene(event.sceneId) || !validId(event.journeyId) || !validId(event.contextEpoch) || !validNow(event.now)) return output(state, "invalid-start");
      return output({ schemaVersion, journeyId: event.journeyId, contextEpoch: event.contextEpoch,
        originScene: event.sceneId, sceneId: event.sceneId, stepId: steps[event.sceneId], pendingTransition: null,
        status: "active", businessResult: "unknown" }, "started", { save: true, arrived: true });
    }
    if (!state) return output(null, "no-task");
    if (!validId(event.contextEpoch) || !validNow(event.now)) return output(state, "invalid-event");
    if (event.type === "context-changed" || event.contextEpoch !== state.contextEpoch || event.sameDocument === false) {
      state.contextEpoch = event.contextEpoch;
      state.sceneId = validScene(event.sceneId) ? event.sceneId : scenes.unknown;
      if (knownScene(state.sceneId)) state.stepId = steps[state.sceneId];
      state.pendingTransition = null;
      state.status = state.status === "closed" ? "closed" : "paused";
      return output(state, "context-unverified", { clear: true });
    }
    if (event.type === "close") {
      state.status = "closed";
      return output(state, "closed", { save: true });
    }
    if (event.type === "reopen") {
      state.status = "paused";
      return output(state, "reopened-review-only", { save: true });
    }
    if (event.type === "continue") {
      if (state.status !== "active") return output(state, "task-paused");
      const toScene = Object.hasOwn(event, "toScene") ? event.toScene : nextScenes[state.sceneId];
      if (event.sceneId !== state.sceneId || !validEdge(state.sceneId, toScene)) return output(state, "no-navigation");
      state.pendingTransition = { from: state.sceneId, to: toScene, expiresAt: event.now + transitionTtlMs };
      return output(state, "awaiting-destination", { save: true, expectedSceneId: state.pendingTransition.to });
    }
    if (event.type !== "observed" || !validScene(event.sceneId)) return output(state, "invalid-event");
    const from = state.sceneId;
    const pending = state.pendingTransition;
    const expired = Boolean(pending && event.now >= pending.expiresAt);
    const same = event.sceneId === from;
    const arrived = !same && knownScene(event.sceneId);
    const allowed = same || (from === scenes.website && event.sceneId === scenes.validation)
      || (pending && pending.from === from && pending.to === event.sceneId && !expired);
    state.sceneId = event.sceneId;
    if (knownScene(state.sceneId)) state.stepId = steps[state.sceneId];
    if (!knownScene(state.sceneId) || !allowed || expired) {
      state.status = state.status === "closed" ? "closed" : "paused";
      state.pendingTransition = null;
      return output(state, expired ? "transition-expired" : !knownScene(state.sceneId) ? "unknown-scene" : "unexpected-scene", { save: true, arrived });
    }
    if (arrived) state.pendingTransition = null;
    return output(state, same ? "scene-unchanged" : "arrived", { cancelLocate: !same, save: !same,
      arrived, locate: arrived && state.status === "active" && event.follow === true });
  }
  globalThis.IMPACT_CN_JOURNEY = Object.freeze({ schemaVersion, transitionTtlMs, scenes, steps, messages, storagePrefix,
    validState, validId, validScene, exactKeys, transition });
})();

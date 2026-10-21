/* Shared settings values and decoding only; callers own persistence and effects. */
(() => {
  "use strict";
  const keys = Object.freeze({ enabled: "impactCNEnabled", aiEnabled: "impactCNAIEnabled" });
  const defaults = Object.freeze({ enabled: true, aiEnabled: true });
  const messages = Object.freeze({
    getState: "impact-cn:get-state",
    setEnabled: "impact-cn:set-enabled",
    setAIEnabled: "impact-cn:set-ai-enabled"
  });

  function decodeStored(record) {
    return Object.fromEntries(Object.entries(keys).map(([setting, key]) => [setting, record[key] !== false]));
  }

  function decodeChanges(changes, area, current) {
    const patch = {};
    if (area !== "local") return patch;
    for (const [setting, key] of Object.entries(keys)) {
      if (changes[key] && (changes[key].newValue !== false) !== current[setting]) patch[setting] = changes[key].newValue !== false;
    }
    return patch;
  }

  globalThis.IMPACT_CN_SETTINGS = Object.freeze({ keys, defaults, messages, decodeStored, decodeChanges });
})();

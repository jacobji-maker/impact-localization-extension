/* Impact CN: exact text-node localization; no DOM reconstruction. */
(() => {
  "use strict";

  const config = globalThis.IMPACT_CN_CONFIG || {};
  const checklistConfig = config.localization?.checklist || {};
  // The legacy fixture marker is never authorization for an injected document.
  const isDemo = !globalThis.chrome?.runtime?.id && document.body?.hasAttribute("data-impact-cn-demo");
  const isImpactSite = ["app.impact.com", "demo.impact.com"].includes(location.hostname);
  const isTopFrame = window === window.top;
  const isChecklistAsset = !isTopFrame && location.protocol === "https:"
    && location.hostname === "ui.assets.impact.com" && checklistConfig.assetPaths?.includes(location.pathname);
  const isChecklistReview = !isTopFrame && location.href === "about:srcdoc" && Boolean(checklistParentContext(true));
  const translationOnly = isChecklistAsset || isChecklistReview;
  if (!isImpactSite && !isDemo && !translationOnly) return;
  if (globalThis.ImpactCN?.ready) return;

  const dictionary = globalThis.IMPACT_CN_DICTIONARY || { version: "unknown", entries: [], helpTopics: [] };
  const runtime = globalThis.chrome?.runtime;
  const inExtension = Boolean(runtime?.id);
  const settingsContract = globalThis.IMPACT_CN_SETTINGS;
  const storageKey = settingsContract.keys.enabled;
  const aiStorageKey = settingsContract.keys.aiEnabled;
  const originalValues = new WeakMap();
  const translatedNodes = new Map();
  const pendingRoots = new Set();
  const index = new Map();
  const entriesById = new Map(dictionary.entries.map((entry) => [entry.id, entry]));
  const prefixEntries = [];
  const suffixEntries = [];
  const numericTemplates = [];
  const observedRoots = new Map();
  const aiPlacementRoots = new Map();
  const helpTopicsByEntry = new Map();
  const helpButtons = new Map();
  const helpStyles = new Map();
  const contractTimingRows = new Map();
  const contractTimingPaths = new Set([
    "/secure/advertiser/engage/contracts/library/view-manage-ios-flow.ihtml",
    "/secure/advertiser/engage/contracts/activity/adv-manage-pending-public-ios-v2-flow.ihtml"
  ]);
  const inlineHelpCSS = `button.impact-cn-inline-help[data-impact-cn-ignore]{all:initial;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;width:16px;height:16px;margin-left:6px;border:1px solid #b9cbc4;border-radius:50%;background:#f4faf7;color:#456b5b;font:600 11px/1 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",sans-serif;vertical-align:middle;cursor:pointer;flex-shrink:0}button.impact-cn-inline-help[data-impact-cn-ignore]::before{content:"?"}button.impact-cn-inline-help[data-impact-cn-ignore]:hover{background:#deeee5;color:#153d2e;border-color:#7fae97}button.impact-cn-inline-help[data-impact-cn-ignore]:focus-visible{outline:2px solid #438969;outline-offset:2px}button.impact-cn-inline-help[data-impact-cn-ignore]:disabled{opacity:.55;cursor:wait}`;
  const listeners = [];
  const normalize = (text) => text.trim().replace(/\s+/gu, " ");
  // An option without an explicit value derives its submitted value from text.
  const skipSelector = "script,style,noscript,textarea,input,code,pre,option:not([value]),[contenteditable]:not([contenteditable='false']),[data-impact-cn-ignore],[data-impact-user-content],[data-impact-ai-messages],#impact-cn-assistant";
  let enabled = settingsContract.defaults.enabled;
  let aiEnabled = settingsContract.defaults.aiEnabled;
  // Closing AI invalidates an unsent request permanently, even if reopened
  // before its next polling tick. Reopening only allows new requests.
  let aiGeneration = 0;
  let navigationGeneration = 0;
  let activeFrameRequest;
  let destroyed = false;
  let flushTimer;
  let route = location.pathname + location.search;
  let busy = false;
  let assistant;
  let assistantStatus;
  let assistantToggle;
  let assistantAIToggle;
  let assistantVersion;
  let guidanceController;
  let dragState;
  let userPositioned = false;
  let assistantPosition = null;
  let routeTimer;
  let aiPlacementTimer;
  let lastAIPlacementKey;
  let lastError = "";
  let checklistAssetAllowed = false;
  let checklistAssetTopPath;
  let checklistContextPending = false;
  let checklistParentAllowed = false;
  let guideFrameProbe;
  let guideFrameProbeTimer;
  const guideUuid = value => typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u.test(value);
  const guideExactKeys = (value, keys) => Boolean(value && typeof value === "object" && !Array.isArray(value)
    && Reflect.ownKeys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key)));

  function checklistTopMatches(targetDocument, targetLocation) {
    return targetLocation.protocol === "https:"
      && ["app.impact.com", "demo.impact.com"].includes(targetLocation.hostname)
      && Boolean((checklistConfig.topPath && targetLocation.pathname.startsWith(checklistConfig.topPath))
        || (checklistConfig.topPathExact && targetLocation.pathname === checklistConfig.topPathExact))
      && Boolean(checklistConfig.topRootSelector && targetDocument.querySelector(checklistConfig.topRootSelector));
  }

  function checklistParentContext(review = false) {
    try {
      if (!review && !isTopFrame && window.parent !== window.top) return checklistNestedParentContext();
      if (isTopFrame || window.parent !== window.top || !checklistTopMatches(window.parent.document, window.parent.location)) return null;
      const frame = window.frameElement;
      if (!frame || frame.ownerDocument !== window.parent.document || frame.contentWindow !== window
          || !checklistConfig.frameSelector || !frame.matches(checklistConfig.frameSelector)) return null;
      if (review) {
        if (location.href !== "about:srcdoc" || !frame.hasAttribute("srcdoc")) return null;
        // The observed Review sandbox preserves origin and scripts. An opaque
        // sandbox cannot establish the native parent/document relationship.
        if (frame.hasAttribute("sandbox") && (!frame.sandbox.contains("allow-same-origin") || !frame.sandbox.contains("allow-scripts"))) return null;
      } else {
        const sharedRoots = Object.hasOwn(checklistConfig.sharedDocumentRoots || {}, location.pathname)
          ? checklistConfig.sharedDocumentRoots[location.pathname] : null;
        const sharedDocument = Array.isArray(sharedRoots) && sharedRoots.length > 0
          && sharedRoots.some((selector) => document.querySelector(selector));
        if (location.protocol !== "https:" || location.origin !== window.parent.location.origin
            || (!Object.hasOwn(checklistConfig.documentRoots || {}, location.pathname) && !sharedDocument)) return null;
        const frameURL = new URL(frame.src);
        if (frameURL.origin !== location.origin || frameURL.pathname !== location.pathname) return null;
      }
      return { hostname: window.parent.location.hostname, origin: window.parent.location.origin };
    } catch { return null; }
  }

  function checklistNestedParentContext() {
    try {
      const relation = checklistConfig.nestedDocumentParents?.[location.pathname];
      const roots = checklistConfig.sharedDocumentRoots?.[location.pathname];
      if (!relation || !Array.isArray(roots) || !roots.length || !roots.some((selector) => document.querySelector(selector))) return null;
      const parent = window.parent;
      const top = window.top;
      if (isTopFrame || parent === top || parent.parent !== top
          || location.protocol !== "https:" || parent.location.protocol !== "https:"
          || parent.location.origin !== location.origin || top.location.origin !== location.origin
          || parent.location.pathname !== relation.parentPath
          || !checklistTopMatches(top.document, top.location)) return null;
      const outerFrame = parent.frameElement;
      if (!outerFrame || outerFrame.ownerDocument !== top.document || outerFrame.contentWindow !== parent
          || !checklistConfig.frameSelector || !outerFrame.matches(checklistConfig.frameSelector)) return null;
      const outerURL = new URL(outerFrame.src);
      if (outerURL.origin !== parent.location.origin || outerURL.pathname !== parent.location.pathname) return null;
      const frame = window.frameElement;
      if (!frame || frame.ownerDocument !== parent.document || frame.contentWindow !== window
          || !relation.frameSelector || !frame.matches(relation.frameSelector)) return null;
      const frameURL = new URL(frame.src);
      if (frameURL.origin !== location.origin || frameURL.pathname !== location.pathname) return null;
      return { hostname: top.location.hostname, origin: top.location.origin };
    } catch { return null; }
  }

  function checklistFrameContext() {
    if (isChecklistAsset) return checklistAssetAllowed ? { asset: true, hostname: location.hostname, topPath: checklistAssetTopPath } : null;
    if (isChecklistReview) return checklistParentContext(true);
    return checklistParentContext();
  }

  async function verifyChecklistAssetContext(refreshOnChange = true) {
    if (!isChecklistAsset || destroyed || checklistContextPending) return;
    checklistContextPending = true;
    let allowed = false;
    let topPath;
    try {
      if (inExtension && runtime?.sendMessage) {
        const result = await runtime.sendMessage({ type: "impact-cn:checklist-frame-context" });
        allowed = result?.allowed === true;
        if (allowed) {
          // Old workers only authorize the legacy prefix. An unknown route
          // identifier must never gain the newly observed exact-page scope.
          topPath = result.topPath === undefined ? checklistConfig.topPath : result.topPath;
          allowed = typeof topPath === "string" && Boolean(topPath)
            && [checklistConfig.topPath, checklistConfig.topPathExact].includes(topPath);
        }
      }
    } catch { /* An unverified asset document remains untranslated. */ }
    finally { checklistContextPending = false; }
    if (destroyed) return;
    if (!allowed) topPath = undefined;
    if (checklistAssetAllowed !== allowed || checklistAssetTopPath !== topPath) {
      checklistAssetAllowed = allowed;
      checklistAssetTopPath = topPath;
      if (refreshOnChange) schedule(document.body);
    }
  }

  function guideAssetGeometry(role) {
    const control = config.guidance?.validationControls?.roles?.[role];
    const viewport = { width: innerWidth, height: innerHeight };
    const output = (state, rect = null, element = null) => ({ target: role, state, rect, viewport, element });
    if (!control || !Number.isFinite(viewport.width) || !Number.isFinite(viewport.height)
        || viewport.width <= 0 || viewport.height <= 0 || viewport.width > 16384 || viewport.height > 16384) return null;
    const candidates = [...document.querySelectorAll(control.selector)].filter(el => control.texts.includes(normalize(el.textContent)));
    if (candidates.length !== 1) return output("loading");
    const element = candidates[0], box = element.getBoundingClientRect();
    if (box.width <= 0 || box.height <= 0 || element.closest("[inert],[aria-hidden='true']")) return output("loading");
    for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
      const style = getComputedStyle(ancestor);
      if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return output("loading");
      if (ancestor === element) continue;
      const clipsX = /^(auto|scroll|hidden|clip)$/u.test(style.overflowX), clipsY = /^(auto|scroll|hidden|clip)$/u.test(style.overflowY);
      const bounds = ancestor.getBoundingClientRect();
      const scaleX = ancestor.offsetWidth ? bounds.width / ancestor.offsetWidth : 1;
      const scaleY = ancestor.offsetHeight ? bounds.height / ancestor.offsetHeight : 1;
      const left = bounds.left + ancestor.clientLeft * scaleX, top = bounds.top + ancestor.clientTop * scaleY;
      if ((clipsX && (box.left < left - 1 || box.right > left + ancestor.clientWidth * scaleX + 1))
          || (clipsY && (box.top < top - 1 || box.bottom > top + ancestor.clientHeight * scaleY + 1))) return output("clipped", null, element);
    }
    if (box.left < 0 || box.top < 0 || box.right > viewport.width || box.bottom > viewport.height) return output("clipped", null, element);
    const rect = { left: box.left, top: box.top, width: box.width, height: box.height };
    const uncovered = [[0.1, 0.5], [0.5, 0.5], [0.9, 0.5]].every(([x, y]) => {
      const hit = document.elementFromPoint(rect.left + rect.width * x, rect.top + rect.height * y);
      return hit && (hit === element || element.contains(hit));
    });
    return output(uncovered && element.getAttribute("aria-disabled") !== "true" ? "ready" : "covered", rect, element);
  }
  async function guideAssetAuthorized() {
    if (!isChecklistAsset || destroyed || location.pathname !== config.guidance?.validationControls?.path || checklistContextPending) return false;
    await verifyChecklistAssetContext(false);
    return !destroyed && !checklistContextPending && checklistAssetAllowed;
  }
  function clearGuideFrameProbe(record = guideFrameProbe) {
    if (record) { delete record.element; delete record.signature; }
    if (guideFrameProbe !== record) return;
    clearTimeout(guideFrameProbeTimer);
    guideFrameProbeTimer = undefined;
    guideFrameProbe = undefined;
  }
  function guideAssetMessage(message, sender, sendResponse) {
    const probe = message?.type === "impact-cn:guide-probe-frame";
    if (!probe && message?.type !== "impact-cn:guide-confirm-frame") return null;
    if (sender?.id !== runtime?.id || !isChecklistAsset || destroyed
        || !guideExactKeys(message, ["type", "requestId", "role"]) || !guideUuid(message.requestId)
        || !Object.hasOwn(config.guidance?.validationControls?.roles || {}, message.role)) {
      sendResponse({ active: false }); return false;
    }
    const requestedRoute = location.pathname + location.search;
    const record = probe ? { requestId: message.requestId, role: message.role, route: requestedRoute, expiresAt: Date.now() + 1500 } : guideFrameProbe;
    if (!probe && (!record || record.requestId !== message.requestId || record.role !== message.role)) {
      sendResponse({ active: false }); return false;
    }
    if (probe) {
      clearGuideFrameProbe();
      guideFrameProbe = record;
      guideFrameProbeTimer = setTimeout(() => clearGuideFrameProbe(record), 1500);
    }
    void (async () => {
      const authorized = await guideAssetAuthorized();
      const active = () => authorized && !destroyed && guideFrameProbe === record && record?.requestId === message.requestId
        && record?.role === message.role && record.route === location.pathname + location.search && record.expiresAt > Date.now();
      if (!active()) { clearGuideFrameProbe(record); sendResponse({ active: false }); return; }
      const geometry = guideAssetGeometry(message.role);
      if (!geometry) { clearGuideFrameProbe(record); sendResponse({ active: false }); return; }
      const signature = JSON.stringify([geometry.target, geometry.state, geometry.rect, geometry.viewport]);
      if (!probe) {
        const confirmed = record.element === geometry.element && record.signature === signature;
        clearGuideFrameProbe(record);
        sendResponse({ active: confirmed }); return;
      }
      record.element = geometry.element;
      record.signature = signature;
      sendResponse({ active: true });
      if (!active()) { clearGuideFrameProbe(record); return; }
      // The report carries plain geometry only. Do not retain a native element
      // in an async activation while the worker waits for confirmation.
      try {
        void runtime.sendMessage({ type: "impact-cn:guide-frame-report", requestId: message.requestId, role: message.role,
          target: geometry.target, state: geometry.state, rect: geometry.rect, viewport: geometry.viewport }).catch(clearGuideFrameProbe.bind(null, record));
      } catch { clearGuideFrameProbe(record); }
    })();
    return true;
  }

  for (const entry of dictionary.entries || []) {
    if (typeof entry.source !== "string" || typeof entry.target !== "string" || !entry.target.trim()) continue;
    if (entry.match === "numeric-template") {
      const scope = entry.scope;
      if (!scope || typeof scope !== "object" || !scope.selector || !(scope.pathExact || scope.path || scope.paths?.length || scope.documentUrlExact) || !scope.hosts?.length) continue;
      const slots = [...entry.source.matchAll(/\{([a-z][a-z0-9]*)\}/gu)].map((match) => match[1]);
      const targetSlots = [...entry.target.matchAll(/\{([a-z][a-z0-9]*)\}/gu)].map((match) => match[1]);
      // Only decimal counts or correctly grouped thousands are accepted, each
      // slot exactly once on both sides; keep the matched count bytes unchanged.
      // No dictionary-provided regex or customer name/address interpolation.
      if (!slots.length || new Set(slots).size !== slots.length || slots.length !== targetSlots.length || slots.some((slot) => targetSlots.filter((candidate) => candidate === slot).length !== 1)) continue;
      const pieces = entry.source.trim().split(/(\{[a-z][a-z0-9]*\})/gu);
      const pattern = pieces.map((piece) => /^\{[a-z][a-z0-9]*\}$/u.test(piece)
        ? `(?<${piece.slice(1, -1)}>(?:\\d{1,3}(?:,\\d{3})+|\\d+))`
        : piece.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&").replace(/\s+/gu, "\\s+")).join("");
      numericTemplates.push({ entry, pattern: new RegExp(`^(\\s*)${pattern}(\\s*)$`, "u") });
      continue;
    }
    if (entry.match === "prefix" || entry.match === "suffix") {
      // Prefix templates require a verified component, page and host. The dynamic
      // suffix (for example the customer's name) remains byte-for-byte unchanged.
      const scope = entry.scope;
      if (!scope || typeof scope !== "object" || !scope.selector || !(scope.path || scope.pathExact || scope.paths?.length || scope.documentUrlExact) || !scope.hosts?.length) continue;
      const prefix = entry.source.trim().split(/\s+/u).map((part) => part.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")).join("\\s+");
      if (!prefix) continue;
      if (entry.match === "suffix") {
        const boundary = /^[\p{L}\p{N}]/u.test(entry.source.trim()) ? "(?<=^|[\\s,，:：])" : "";
        suffixEntries.push({ entry, pattern: new RegExp(`^([\\s\\S]*?)${boundary}${prefix}(\\s*)$`, "u") });
      } else {
        const boundary = /[\p{L}\p{N}]$/u.test(entry.source.trim()) ? "(?=$|[\\s,，:：])" : "";
        prefixEntries.push({ entry, pattern: new RegExp(`^(\\s*)${prefix}${boundary}([\\s\\S]*)$`, "u") });
      }
      continue;
    }
    for (const source of [entry.source, ...(entry.aliases || [])]) {
      if (typeof source !== "string" || !source.trim()) continue;
      const key = normalize(source);
      if (!index.has(key)) index.set(key, []);
      index.get(key).push(entry);
    }
  }
  const scopeSpecificity = (entry) => {
    if (!entry.scope) return 0;
    if (typeof entry.scope === "string") return 1;
    const scope = entry.scope;
    return Number(Boolean(scope.pathExact || scope.documentUrlExact)) * 100 + Number(Boolean(scope.topPaths || scope.topPath)) * 40
      + (Object.keys(scope.query || {}).length + Object.keys(scope.topQuery || {}).length) * 20
      + Number(Boolean(scope.shadowHost)) * 5 + Number(Boolean(scope.selector))
      + (scope.path?.length || Math.max(0, ...(scope.paths || []).map((path) => path.length))) / 100;
  };
  // A verified finance/report route takes precedence over older shared-nav
  // wording when both match the same native label.
  for (const entries of index.values()) entries.sort((a, b) => scopeSpecificity(b) - scopeSpecificity(a));
  for (const topic of dictionary.helpTopics || []) {
    for (const id of topic.entryIds || []) if (!helpTopicsByEntry.has(id)) helpTopicsByEntry.set(id, topic);
  }

  function listen(target, type, callback, options) {
    target.addEventListener(type, callback, options);
    listeners.push(() => target.removeEventListener(type, callback, options));
  }

  function elementFor(node) {
    if (node.nodeType === Node.ELEMENT_NODE) return node;
    return node.parentElement || (node.getRootNode() instanceof ShadowRoot ? node.getRootNode().host : null);
  }

  function composedParent(node) {
    if (node instanceof ShadowRoot) return node.host;
    return node.parentElement || (node.getRootNode() instanceof ShadowRoot ? node.getRootNode().host : null);
  }

  function composedClosest(element, selector) {
    let current = element;
    while (current) {
      const match = current.closest(selector);
      if (match) return match;
      const root = current.getRootNode();
      current = root instanceof ShadowRoot ? root.host : null;
    }
    return null;
  }

  function deepQueryAll(root, selector) {
    const found = new Set(root.querySelectorAll(selector));
    const hosts = [];
    if (root.nodeType === Node.ELEMENT_NODE && root.shadowRoot) hosts.push(root);
    for (const element of root.querySelectorAll("*")) if (element.shadowRoot) hosts.push(element);
    for (const host of hosts) for (const element of deepQueryAll(host.shadowRoot, selector)) found.add(element);
    return [...found];
  }

  function skipped(node) {
    const element = elementFor(node);
    if (!element || composedClosest(element, skipSelector)) return true;
    for (const selector of config.localization?.ignoreSelectors || []) {
      try { if (composedClosest(element, selector)) return true; } catch { /* Invalid adapter selector. */ }
    }
    return false;
  }

  function inLocalizationScope(element) {
    if (translationOnly) {
      if (!checklistFrameContext()) return false;
      const roots = isChecklistReview ? checklistConfig.reviewRoots || []
        : checklistConfig.documentRoots?.[location.pathname] || [];
      return roots.some((selector) => {
        try { return Boolean(composedClosest(element, selector)); } catch { return false; }
      });
    }
    if (isImpactSite && !isTopFrame && Object.hasOwn(checklistConfig.documentRoots || {}, location.pathname)) {
      if (!checklistFrameContext()) return false;
      return checklistConfig.documentRoots[location.pathname].some((selector) => {
        try { return Boolean(composedClosest(element, selector)); } catch { return false; }
      });
    }
    if (!isImpactSite) return true;
    if (isTopFrame && checklistTopMatches(document, location)) {
      try { if (composedClosest(element, checklistConfig.topRootSelector)) return true; } catch { /* Keep the existing site roots. */ }
    }
    if ((config.localization?.financePaths || []).some((path) => location.pathname.startsWith(path))) return true;
    const floatingLabel = config.localization?.testIntegrationFloatingLabel;
    if (isTopFrame && location.protocol === "https:" && Array.isArray(floatingLabel?.paths)
        && floatingLabel.paths.includes(location.pathname)) {
      try {
        const root = element.getRootNode();
        // Qualify only the observed label; dictionary scopes still apply independently.
        if (root instanceof ShadowRoot && root.host.matches(floatingLabel.shadowHost)
            && element.matches(floatingLabel.selector)) return true;
      } catch { /* An invalid adapter must not widen localization eligibility. */ }
    }
    const emailTooltip = config.localization?.systemEmailHelpTooltip;
    if (isTopFrame && location.protocol === "https:" && location.pathname === emailTooltip?.path
        && Array.isArray(emailTooltip.entryIds)) {
      try {
        // These observed native help leaves live outside the page root. Do not
        // admit arbitrary tooltip text through the existing generic entries.
        if (element.getRootNode() === document && element.matches(emailTooltip.selector)) {
          const text = normalize(element.textContent || "");
          if (emailTooltip.entryIds.some((id) => {
            const entry = entriesById.get(id);
            return entry && typeof entry.source === "string" && typeof entry.target === "string"
              && scopeMatches(entry, element)
              && (text === normalize(entry.source) || text === normalize(entry.target));
          })) return true;
        }
      } catch { /* A missing or invalid native help context stays outside the page root. */ }
    }
    const dataFeedTooltip = config.localization?.dataFeedHelpTooltip;
    if (isTopFrame && location.protocol === "https:" && location.pathname === dataFeedTooltip?.path
        && Array.isArray(dataFeedTooltip.entryIds)) {
      try {
        // The four observed FTP help portals are BODY siblings of the page.
        // Admission requires a configured literal and its current form scope.
        if (element.getRootNode() === document && element.matches(dataFeedTooltip.selector)) {
          const text = normalize(element.textContent || "");
          if (dataFeedTooltip.entryIds.some((id) => {
            const entry = entriesById.get(id);
            return entry && typeof entry.source === "string" && typeof entry.target === "string"
              && scopeMatches(entry, element)
              && (text === normalize(entry.source) || text === normalize(entry.target));
          })) return true;
        }
      } catch { /* Invalid or absent data-feed form context must remain outside the page root. */ }
    }
    const roots = config.localization?.rootSelectors || [];
    if (!roots.length) return true;
    return roots.some((selector) => {
      try { return Boolean(composedClosest(element, selector)); } catch { return false; }
    });
  }

  function scopeMatches(entry, element) {
    if (!entry.scope) return !translationOnly;
    const scope = typeof entry.scope === "string" ? { selector: entry.scope } : entry.scope;
    const checklistContext = scope.checklistFrame || translationOnly ? checklistFrameContext() : null;
    if (translationOnly && (scope.checklistFrame !== true
        || (isChecklistReview && scope.documentUrlExact !== "about:srcdoc"))) return false;
    if (scope.checklistFrame === true && !checklistContext) return false;
    if (scope.hosts && !scope.hosts.includes(isChecklistReview ? checklistContext?.hostname : location.hostname)) return false;
    if (scope.documentUrlExact && location.href !== scope.documentUrlExact) return false;
    if (scope.pathExactAlternative && !scope.path) return false;
    if (scope.topPathExactAlternative && !scope.topPath) return false;
    if (scope.path && !location.pathname.startsWith(scope.path)
        && location.pathname !== scope.pathExactAlternative) return false;
    if (scope.paths && !scope.paths.some((path) => location.pathname.startsWith(path))) return false;
    if (scope.pathExact && location.pathname !== scope.pathExact) return false;
    const queryMatches = (expected, search) => {
      const query = new URLSearchParams(search);
      return Object.entries(expected || {}).every(([key, value]) => query.getAll(key).length === 1 && query.get(key) === String(value));
    };
    if (scope.query && !queryMatches(scope.query, location.search)) return false;
    try {
      if (scope.topPath || scope.topPaths || scope.topQuery) {
        if (isChecklistAsset) {
          // The worker validates the real tab URL; never read a cross-origin top.
          if (!checklistContext || scope.topPath !== checklistConfig.topPath || scope.topPaths || scope.topQuery) return false;
          if (checklistContext.topPath !== checklistConfig.topPath
              && (!checklistConfig.topPathExact || checklistContext.topPath !== checklistConfig.topPathExact
                || scope.topPathExactAlternative !== checklistConfig.topPathExact)) return false;
        } else {
          const sourceOrigin = isChecklistReview ? checklistContext?.origin : location.origin;
          if (window.top.location.origin !== sourceOrigin) return false;
          if (scope.topPath && !window.top.location.pathname.startsWith(scope.topPath)
              && window.top.location.pathname !== scope.topPathExactAlternative) return false;
          if (scope.topPaths && !scope.topPaths.includes(window.top.location.pathname)) return false;
          if (scope.topQuery && !queryMatches(scope.topQuery, window.top.location.search)) return false;
        }
      }
      if (scope.topOnly === true && window !== window.top) return false;
      if (scope.lightDOMOnly === true && element.getRootNode() !== document) return false;
      if (scope.contextText && !scope.contextText.every((context) => {
        const root = context.closest ? element.closest(context.closest) : element.getRootNode();
        if (!root || !Array.isArray(context.texts) || !context.texts.length) return false;
        const matches = root.querySelectorAll(context.selector);
        return matches.length === 1 && context.texts.some((text) => normalize(text) === normalize(matches[0].textContent || ""));
      })) return false;
      if (scope.shadowHost) {
        let root = element.getRootNode();
        let matched = false;
        while (root instanceof ShadowRoot) {
          if (root.host.matches(scope.shadowHost)) { matched = true; break; }
          root = root.host.getRootNode();
        }
        if (!matched) return false;
      }
      if (scope.textParentSelector !== undefined
          && (typeof scope.textParentSelector !== "string" || !element.matches(scope.textParentSelector))) return false;
      return !scope.selector || Boolean(composedClosest(element, scope.selector));
    } catch {
      return false;
    }
  }

  function removeHelpButton(anchor) {
    const record = helpButtons.get(anchor);
    if (!record) return;
    for (const remove of record.cleanup) remove();
    record.button.remove();
    helpButtons.delete(anchor);
  }

  function removeHelpForNode(node) {
    for (const [anchor, record] of helpButtons) if (record.node === node) removeHelpButton(anchor);
  }

  function ensureHelpStyle(root) {
    if (helpStyles.get(root)?.isConnected) return;
    const style = document.createElement("style");
    style.setAttribute("data-impact-cn-ignore", "");
    style.setAttribute("data-impact-cn-help-style", "");
    style.textContent = inlineHelpCSS;
    (root instanceof ShadowRoot ? root : document.head || document.body).append(style);
    helpStyles.set(root, style);
  }

  function syncHelpButton(node, entry, translated, original) {
    const topic = helpTopicsByEntry.get(entry.id) || dictionary.helpTopics?.find((candidate) => candidate.id === entry.helpTopicId);
    if (translationOnly || !topic || !aiEnabled) { removeHelpForNode(node); return; }
    const label = elementFor(node);
    const nativeInteractive = composedClosest(label, "button,a,summary");
    const anchor = nativeInteractive || label;
    if (!anchor?.parentNode || skipped(anchor)) return;
    const previous = helpButtons.get(anchor);
    const previousPositionValid = previous && (nativeInteractive ? previous.button.parentNode === anchor.parentNode && anchor.nextSibling === previous.button : previous.button.parentNode === anchor);
    if (previous && previousPositionValid && previous.button.isConnected && previous.node === node && previous.entry.id === entry.id && previous.topicId === topic.id) { previous.translated = translated; previous.original = original; return; }
    if (previous) removeHelpButton(anchor);
    ensureHelpStyle(anchor.getRootNode());
    const button = document.createElement("button");
    button.type = "button";
    button.className = "impact-cn-inline-help";
    button.setAttribute("data-impact-cn-ignore", "");
    button.setAttribute("data-impact-cn-help", "");
    button.dataset.topicId = topic.id;
    button.dataset.impactCnHelpTopic = topic.id;
    button.dataset.entryId = entry.id;
    button.disabled = busy;
    button.setAttribute("aria-label", `解释${entry.target}`);
    button.title = `解释${entry.target} · 发送到 Ask Impact`;
    const cleanup = [];
    const on = (type, handler) => {
      button.addEventListener(type, handler);
      cleanup.push(() => button.removeEventListener(type, handler));
    };
    on("click", (event) => { event.preventDefault(); event.stopPropagation(); void askTopic(topic.id); });
    for (const type of ["pointerdown", "pointerup", "mousedown", "mouseup"]) on(type, (event) => event.stopPropagation());
    on("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault(); event.stopPropagation();
        if (!event.repeat) void askTopic(topic.id);
      }
    });
    on("keyup", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.stopPropagation(); }
    });
    // Do not nest a button in a native button/link, and do not add '?' to the
    // application's label textContent. The visible glyph comes from scoped CSS.
    if (nativeInteractive) anchor.parentNode.insertBefore(button, anchor.nextSibling);
    else anchor.append(button);
    helpButtons.set(anchor, { button, node, entry, topicId: topic.id, translated, original, cleanup, outside: Boolean(nativeInteractive) });
  }

  function pruneHelpButtons() {
    for (const [anchor, record] of helpButtons) {
      const positionValid = record.outside ? record.button.parentNode === anchor.parentNode && anchor.nextSibling === record.button : record.button.parentNode === anchor;
      if (!aiEnabled || destroyed || !positionValid || !anchor.isConnected || !record.node.isConnected || !record.button.isConnected || skipped(record.node) || !inLocalizationScope(elementFor(record.node)) || !scopeMatches(record.entry, elementFor(record.node)) || (record.node.nodeValue !== record.translated && record.node.nodeValue !== record.original)) removeHelpButton(anchor);
    }
    for (const [root, style] of helpStyles) {
      if (!aiEnabled || destroyed || !style.isConnected || (root instanceof ShadowRoot && !root.host.isConnected)) { style.remove(); helpStyles.delete(root); }
    }
  }

  function release(node, restore = false) {
    const record = originalValues.get(node);
    if (restore && record && node.nodeValue === record.translated) node.nodeValue = record.original;
    originalValues.delete(node);
    translatedNodes.delete(node);
  }

  function translateNode(node) {
    if (node.nodeType !== Node.TEXT_NODE || !node.isConnected) return;
    let record = originalValues.get(node);
    const element = elementFor(node);
    if (skipped(node) || !inLocalizationScope(element)) {
      if (record) release(node, true);
      removeHelpForNode(node);
      return;
    }
    if (record && node.nodeValue !== record.translated) {
      // A framework replaced this text: the current value becomes the new source.
      release(node);
      record = undefined;
    }
    const source = record ? record.original : node.nodeValue;
    if (!source || !source.trim()) return;
    let entry = index.get(normalize(source))?.find((candidate) => scopeMatches(candidate, element));
    let prefixMatch;
    let suffixMatch;
    let numericMatch;
    if (!entry) {
      const template = prefixEntries.find((candidate) => scopeMatches(candidate.entry, element) && candidate.pattern.test(source));
      if (template) { entry = template.entry; prefixMatch = source.match(template.pattern); }
    }
    if (!entry) {
      const template = suffixEntries.find((candidate) => scopeMatches(candidate.entry, element) && candidate.pattern.test(source));
      if (template) { entry = template.entry; suffixMatch = source.match(template.pattern); }
    }
    if (!entry) {
      const template = numericTemplates.find((candidate) => scopeMatches(candidate.entry, element) && candidate.pattern.test(source));
      if (template) { entry = template.entry; numericMatch = source.match(template.pattern); }
    }
    if (!entry) {
      if (record) release(node, true);
      removeHelpForNode(node);
      return;
    }
    const whitespace = source.match(/^(\s*)([\s\S]*?)(\s*)$/u);
    const target = numericMatch ? `${whitespace[1]}${entry.target.replace(/\{([a-z][a-z0-9]*)\}/gu, (_token, slot) => numericMatch.groups[slot])}${whitespace[3]}`
      : prefixMatch ? `${prefixMatch[1]}${entry.target}${prefixMatch[2]}` : suffixMatch ? `${suffixMatch[1]}${entry.target}${suffixMatch[2]}` : `${whitespace[1]}${entry.target}${whitespace[3]}`;
    if (enabled && source !== target) {
      if (!record || record.translated !== target) originalValues.set(node, { original: source, translated: target, id: entry.id });
      translatedNodes.set(node, entry.id);
      if (node.nodeValue !== target) node.nodeValue = target;
    } else if (record) {
      release(node, true);
    }
    syncHelpButton(node, entry, node.nodeValue, source);
  }

  function translateTree(root) {
    if (destroyed || !root?.isConnected) return;
    if (root.nodeType === Node.TEXT_NODE) {
      translateNode(root);
      return;
    }
    if (![Node.ELEMENT_NODE, Node.DOCUMENT_FRAGMENT_NODE].includes(root.nodeType) || skipped(root)) return;
    if (root.shadowRoot) translateTree(root.shadowRoot);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (node.nodeType === Node.ELEMENT_NODE) return skipped(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.TEXT_NODE) translateNode(node);
      else if (node.shadowRoot) translateTree(node.shadowRoot);
    }
  }

  function pruneNodes() {
    for (const node of translatedNodes.keys()) {
      const entry = entriesById.get(translatedNodes.get(node));
      // Restore before forgetting: a framework can later reattach the same node.
      // The strong map contains only connected nodes and cannot retain old pages.
      if (!node.isConnected) release(node, true);
      else if (skipped(node) || !inLocalizationScope(elementFor(node))) release(node, true);
      else if (node.nodeValue !== originalValues.get(node)?.translated) release(node);
      // Native menus can reuse Text while a sibling changes the entry's scope.
      else if (!entry || !scopeMatches(entry, elementFor(node))) release(node, true);
    }
    pruneHelpButtons();
  }

  function getState() {
    pruneNodes();
    return { enabled, aiEnabled, translatedCount: translatedNodes.size, version: dictionary.version, busy, error: lastError, observedShadowRoots: [...observedRoots.keys()].filter((root) => root instanceof ShadowRoot).length, inlineHelpCount: helpButtons.size, position: { userPositioned, x: assistantPosition?.x ?? null, y: assistantPosition?.y ?? null } };
  }

  function emitState() {
    const state = getState();
    if (assistantToggle) {
      assistantToggle.checked = enabled;
      assistantAIToggle.checked = aiEnabled;
      assistantVersion.textContent = `v${state.version} · 已校准 ${state.translatedCount} 处`;
      assistant.dataset.enabled = String(enabled);
      assistant.dataset.aiEnabled = String(aiEnabled);
      syncAssistantPlacement();
    }
    document.dispatchEvent(new CustomEvent("impact-cn:state", { detail: state }));
  }

  function moveContractTimingNode(row, node, nextSibling) {
    // Keep focused native controls active when their existing label moves.
    if (typeof row.moveBefore === "function") row.moveBefore(node, nextSibling);
    else row.insertBefore(node, nextSibling);
  }

  function restoreContractTimingRow(record) {
    // Restore the Text first, then the label whose original nextSibling is it.
    // Never reinsert a node removed or replaced by the native application.
    for (const { node, nextSibling } of [...record.moves].reverse()) {
      if (node.parentNode !== record.row) continue;
      if (nextSibling && nextSibling.parentNode !== record.row) continue;
      if (node.nextSibling !== nextSibling) moveContractTimingNode(record.row, node, nextSibling);
    }
  }

  function restoreContractTimingLayout() {
    for (const record of contractTimingRows.values()) {
      if (record.row.isConnected) restoreContractTimingRow(record);
    }
    contractTimingRows.clear();
  }

  function syncContractTimingLayout() {
    if (!enabled || destroyed || !isTopFrame || location.protocol !== "https:"
        || !["demo.impact.com", "app.impact.com"].includes(location.hostname)
        || !contractTimingPaths.has(location.pathname)) {
      restoreContractTimingLayout();
      return;
    }
    for (const [row, record] of contractTimingRows) {
      if (!row.isConnected || record.moves.some(({ node }) => node.parentNode !== row)) {
        if (row.isConnected) restoreContractTimingRow(record);
        contractTimingRows.delete(row);
      }
    }
    const originalText = (node) => normalize(originalValues.get(node)?.original ?? node.nodeValue);
    for (const row of document.querySelectorAll(
      '#templateContainer .uitkMultiInputField .uitkSeparateEntry,.modal[role="dialog"] .uitkSeparateEntry'
    )) {
      if (contractTimingRows.has(row)) continue;
      const nodes = [...row.childNodes];
      const texts = nodes.filter((node) => node.nodeType === Node.TEXT_NODE);
      const locked = texts.find((node) => originalText(node) === "Actions are locked");
      const paid = texts.find((node) => originalText(node) === "Actions are paid");
      if (!locked && !paid) continue;
      const basisText = texts.find((node) => originalText(node) === (locked ? "they are" : "they"));
      const tailText = texts.find((node) => originalText(node) === (locked ? "tracked" : "lock"));
      const inputs = nodes.filter((node) => node.nodeType === Node.ELEMENT_NODE
        && node.matches('input[type="text"]'));
      const selects = row.querySelectorAll("select");
      const label = nodes.find((node) => node.nodeType === Node.ELEMENT_NODE
        && node.matches('label.uitk-select:has(select option[value="AFTER_END_OF_MONTH"])'));
      if (!basisText || !tailText || inputs.length !== 2 || selects.length !== 1 || !label) continue;
      const months = texts.find((node) => originalText(node) === "months and");
      const days = texts.find((node) => originalText(node) === "days");
      if (!months || !days || !(nodes.indexOf(locked || paid) < nodes.indexOf(inputs[0])
        && nodes.indexOf(inputs[0]) < nodes.indexOf(months)
        && nodes.indexOf(months) < nodes.indexOf(inputs[1])
        && nodes.indexOf(inputs[1]) < nodes.indexOf(days)
        && nodes.indexOf(days) < nodes.indexOf(label)
        && nodes.indexOf(label) < nodes.indexOf(basisText)
        && nodes.indexOf(basisText) < nodes.indexOf(tailText))) continue;
      // User-requested sentence ordering moves only these two original nodes.
      const record = {
        row,
        moves: [label, basisText].map((node) => ({ node, nextSibling: node.nextSibling }))
      };
      contractTimingRows.set(row, record);
      moveContractTimingNode(row, label, inputs[0]);
      moveContractTimingNode(row, basisText, inputs[0]);
    }
  }

  function syncRoute() {
    const nextRoute = location.pathname + location.search;
    if (route === nextRoute) return false;
    const resetReason = route.split("?")[0] === location.pathname ? "query" : "path-entry";
    route = nextRoute;
    guidanceController?.reset("页面或项目已变化，请重新核对。", resetReason);
    pendingRoots.clear();
    pendingRoots.add(document.body);
    return true;
  }

  function flush() {
    flushTimer = undefined;
    if (destroyed) return;
    syncRoute();
    pruneNodes();
    const roots = [...pendingRoots];
    pendingRoots.clear();
    // Collapse nested roots to avoid scanning an inserted subtree repeatedly.
    const elementRoots = new Set(roots.filter((root) => root.nodeType === Node.ELEMENT_NODE));
    for (const root of roots) {
      let ancestor = composedParent(root);
      let covered = false;
      while (ancestor) {
        if (elementRoots.has(ancestor)) { covered = true; break; }
        ancestor = composedParent(ancestor);
      }
      if (!covered) translateTree(root);
    }
    const dataFeedTooltip = config.localization?.dataFeedHelpTooltip;
    if (isImpactSite && isTopFrame && location.protocol === "https:"
        && location.pathname === dataFeedTooltip?.path && Array.isArray(dataFeedTooltip.entryIds)) {
      try {
        // A remounted form can requalify an existing BODY portal without
        // changing the portal itself. Recheck only the four scoped literals.
        for (const portal of document.querySelectorAll(dataFeedTooltip.selector)) {
          if (inLocalizationScope(portal)) translateTree(portal);
        }
      } catch { /* Invalid adapter selectors must not expand the rescan. */ }
    }
    syncContractTimingLayout();
    emitState();
  }

  function schedule(root) {
    if (root) pendingRoots.add(root);
    if (!flushTimer) flushTimer = setTimeout(flush, 32);
  }

  function observeRoot(root) {
    if (observedRoots.has(root)) return false;
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes") {
          schedule(mutation.target);
          // Native IUI menus can be pre-mounted outside their focused button.
          // Recheck their existing Text when that button changes menu scope.
          if (mutation.attributeName === "class" && mutation.target.matches("button.iui-multi-select-input-button")) {
            for (const portal of root.querySelectorAll(".iui-dropdown.in-multiselect-input, #app ~ .iui-dropdown")) schedule(portal);
          }
          if (mutation.attributeName === "class" && mutation.target.matches('#templateContainer .iui-tab-item button,#main-content button[data-testid="uicl-button-menu"]')) {
            for (const portal of root.querySelectorAll(".iui-dropdown.in-btn-menu")) schedule(portal);
          }
          continue;
        }
        if (skipped(mutation.target)) continue;
        const fieldButton = elementFor(mutation.target)?.closest(".uicc-grouped-input");
        if (fieldButton) schedule(fieldButton.closest(".uicc-partner-input-row"));
        if (mutation.type === "characterData") schedule(mutation.target);
        else {
          for (const node of mutation.addedNodes) schedule(node);
          if (mutation.removedNodes.length) schedule();
        }
      }
    });
    observer.observe(root, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ["contenteditable", "data-impact-cn-ignore", "data-impact-user-content", "id", "class", "href"] });
    observedRoots.set(root, observer);
    return true;
  }

  function discoverShadowRoots() {
    for (const [root, observer] of observedRoots) {
      if (!root.isConnected || (root instanceof ShadowRoot && skipped(root))) {
        observer.disconnect();
        observedRoots.delete(root);
      }
    }
    observeRoot(document.body);
    const visit = (root) => {
      const elements = [...root.querySelectorAll("*")];
      if (root.nodeType === Node.ELEMENT_NODE && root.shadowRoot) elements.unshift(root);
      for (const element of elements) {
        const shadow = element.shadowRoot;
        if (!shadow) continue;
        if (!skipped(shadow) && observeRoot(shadow)) schedule(shadow);
        visit(shadow);
      }
    };
    visit(document.body);
    discoverAIPlacementRoots();
    pruneNodes();
  }

  function refresh() {
    if (destroyed) return getState();
    discoverShadowRoots();
    translateTree(document.body);
    syncContractTimingLayout();
    emitState();
    return getState();
  }

  function setStatus(message, type = "info") {
    lastError = type === "error" ? message : "";
    if (assistantStatus) {
      assistantStatus.textContent = message;
      assistantStatus.dataset.type = type;
    }
    if (type === "error" || type === "warning") {
      guidanceController?.close();
      const panel = assistant?.querySelector("#impact-cn-assistant-panel");
      if (panel) panel.hidden = false;
      assistant?.querySelector(".impact-cn-launcher")?.setAttribute("aria-expanded", "true");
    }
    document.dispatchEvent(new CustomEvent("impact-cn:assistant", { detail: { message, type } }));
    emitState();
  }

  function applySettings(values) {
    if (destroyed) return getState();
    if ("enabled" in values) enabled = Boolean(values.enabled);
    if ("aiEnabled" in values) {
      const nextAIEnabled = Boolean(values.aiEnabled);
      if (aiEnabled && !nextAIEnabled) aiGeneration += 1;
      aiEnabled = nextAIEnabled;
    }
    if (!enabled) for (const node of [...translatedNodes.keys()]) release(node, true);
    return refresh();
  }

  async function persistSetting(key, value) {
    if (inExtension && chrome.storage?.local) {
      try { await chrome.storage.local.set({ [key]: value }); }
      catch { setStatus("页面开关已更新，但浏览器未能保存设置。", "error"); }
    }
  }

  async function setEnabled(value) {
    if (destroyed) return getState();
    applySettings({ enabled: Boolean(value) });
    setStatus(enabled ? "精细翻译已开启。" : "精细翻译已暂停，页面原文已恢复。", "info");
    await persistSetting(storageKey, enabled);
    return getState();
  }

  async function setAIEnabled(value) {
    if (destroyed) return getState();
    applySettings({ aiEnabled: Boolean(value) });
    setStatus(aiEnabled ? "AI辅助问题回答已开启，可点击术语旁的问号。" : "AI辅助问题回答已关闭。", "info");
    await persistSetting(aiStorageKey, aiEnabled);
    return getState();
  }

  function onStorageChanged(changes, area) {
    if (area !== "local" || destroyed) return;
    const settings = settingsContract.decodeChanges(changes, area, { enabled, aiEnabled });
    if (Object.keys(settings).length) {
      applySettings(settings);
      setStatus(`精细翻译：${enabled ? "开启" : "暂停"}；AI辅助问题回答：${aiEnabled ? "开启" : "关闭"}。`);
    }
  }

  function create(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function validGuidance(data) {
    const record = value => value !== null && typeof value === "object" && !Array.isArray(value);
    const text = value => typeof value === "string" && value.trim().length > 0;
    const fields = (value, keys) => record(value) && keys.every(key => text(value[key]));
    const list = (value, accepts) => Array.isArray(value) && [...value].every(accepts);
    const optionalList = (value, accepts) => value === undefined || list(value, accepts);
    if (!record(data) || !Array.isArray(data.guides) || !data.guides.length) return false;
    const guideIds = new Set();
    const stepIds = new Set();
    for (const guide of data.guides) {
      if (!fields(guide, ["id", "title", "purpose", "applicability"]) ||
          guideIds.has(guide.id) || !list(guide.prerequisites, text) ||
          !Array.isArray(guide.steps) || !guide.steps.length) return false;
      guideIds.add(guide.id);
      for (const step of guide.steps) {
        if (!fields(step, ["id", "title", "action", "entry", "ready"]) || stepIds.has(step.id) ||
            (Object.hasOwn(step, "mode") && step.mode !== "information") ||
            !optionalList(step.details, text) ||
            !optionalList(step.issues, item => fields(item, ["id", "label", "help", "owner"])) ||
            !optionalList(step.links, item => fields(item, ["label"]) && typeof item.url === "string")) return false;
        stepIds.add(step.id);
      }
    }
    return optionalList(data.checklistGroups, group => fields(group, ["title"]) &&
      list(group.items, item => fields(item, ["title", "purpose"])));
  }

  function buildGuidance(panel, settings) {
    const data = globalThis.IMPACT_CN_GUIDANCE;
    if (!isTopFrame || !validGuidance(data)) return false;
    const guides = data.guides;
    // Guide choices and declarations belong only to this assistant instance.
    // They never read business fields, change native controls or reach storage/AI.
    const declarations = new Map();
    const journeyContract = globalThis.IMPACT_CN_JOURNEY;
    let contextEpoch = journeyContract ? crypto.randomUUID() : "";
    let journey = null;
    let checkpointBound = false;
    let checkpointSeq = 0;
    let checkpointGeneration = 0;
    let passiveOpenGeneration = 0;
    let passiveOpenAllowed = true;
    let checkpointNote = "";
    let journeyReason = "";
    let observation;
    let contextSignal;
    let selectedProgramSignal;
    let sceneFrame;
    let sceneDocument;
    let sceneFrameSource;
    let sceneLoadingUntil = 0;
    let sceneWaitingFollow = false;
    let frameLoadEpoch = 0;
    let observedLoadEpoch = 0;
    let contextActionInvalidated = false;
    let observing = false;
    const sequence = guides.flatMap(item => item.steps.map(itemStep => ({ guide: item, step: itemStep })));
    if (!sequence.length) return false;
    function sharedTestActionsScene(pathname) {
      const page = config.guidance?.sharedTestActionsPage;
      if (pathname !== page?.path) return null;
      try {
        const matches = (shape) => {
          const roots = document.querySelectorAll(shape.root);
          if (roots.length > 1) return -1;
          if (!roots.length) return 0;
          const fixed = (part) => [...roots[0].querySelectorAll(part.selector)]
            .filter(element => !part.texts || part.texts.includes(normalize(element.textContent))).length === 1;
          return Number(fixed(shape.title) && fixed(shape.marker));
        };
        const list = matches(page.list), tool = matches(page.tool);
        return list < 0 || tool < 0 || list === tool ? "unknown" : list ? "tests" : "tool";
      } catch { return "unknown"; }
    }
    function suggestedStepIndex(pathname) {
      const scene = sharedTestActionsScene(pathname) ?? (config.guidance?.testsPaths?.includes(pathname) ? "tests"
        : config.guidance?.targets?.["6a"]?.openedPaths?.includes(pathname) ? "tool" : null);
      const id = scene && journeyContract?.steps[scene];
      return Math.max(0, sequence.findIndex(item => item.step.id === id));
    }
    let stepIndex = suggestedStepIndex(location.pathname);
    let guide = sequence[stepIndex].guide;
    let step = sequence[stepIndex].step;
    const open = create("button", "impact-cn-guide-open", "上线指引");
    open.type = "button";
    open.dataset.impactCnGuideOpen = "";
    open.setAttribute("aria-controls", "impact-cn-guide");
    open.setAttribute("aria-expanded", "false");
    settings.append(open);
    const view = create("section", "impact-cn-guide");
    view.id = "impact-cn-guide";
    view.hidden = true;
    view.setAttribute("aria-label", "上线指引步骤卡片");
    const back = create("button", "impact-cn-guide-back", "← 返回助手设置");
    back.type = "button";
    back.dataset.impactCnGuideBack = "";
    const heading = create("h2", "impact-cn-guide-heading", "上线指引");
    const context = create("p", "impact-cn-guide-context", "先确认你正在配置的项目。");
    context.setAttribute("aria-live", "polite");
    const journeyStatus = create("p", "impact-cn-guide-note");
    journeyStatus.dataset.impactCnJourneyStatus = "";
    journeyStatus.setAttribute("aria-live", "polite");
    const journeyStart = create("button", "impact-cn-guide-step-button", "从当前页面开始连续指引");
    journeyStart.type = "button";
    journeyStart.dataset.impactCnJourneyStart = "";
    const journeyContinue = create("button", "impact-cn-guide-step-button", "查看下一目的地并定位");
    journeyContinue.type = "button";
    journeyContinue.dataset.impactCnJourneyContinue = "";
    const cardLabel = create("label", "impact-cn-guide-field", "我要做的任务");
    const cardSelect = create("select", "impact-cn-guide-select");
    cardSelect.dataset.impactCnGuideCard = "";
    for (const item of guides) {
      const option = create("option", "", item.title);
      option.value = item.id;
      cardSelect.append(option);
    }
    cardLabel.append(cardSelect);
    const purpose = create("p", "impact-cn-guide-purpose");
    const preparation = create("details", "impact-cn-guide-details");
    preparation.append(create("summary", "", "适用条件与开始前准备"));
    const applicable = create("p", "impact-cn-guide-applicability");
    const prerequisites = create("ul", "impact-cn-guide-prerequisites");
    preparation.append(applicable, prerequisites);
    const stepLabel = create("label", "impact-cn-guide-field", "当前步骤");
    const stepSelect = create("select", "impact-cn-guide-select");
    stepSelect.dataset.impactCnGuideSubstep = "";
    stepLabel.append(stepSelect);
    const stepPosition = create("p", "impact-cn-guide-step-position");
    stepPosition.dataset.impactCnGuideStepPosition = "";
    stepPosition.setAttribute("aria-live", "polite");
    const stepTitle = create("h3", "impact-cn-guide-step-title");
    stepTitle.dataset.impactCnGuideStepTitle = "";
    const stepNavigation = create("div", "impact-cn-guide-step-navigation");
    const previousStep = create("button", "impact-cn-guide-step-button", "上一项指引");
    previousStep.type = "button";
    previousStep.dataset.impactCnGuidePrev = "";
    const nextStep = create("button", "impact-cn-guide-step-button", "下一项指引");
    nextStep.type = "button";
    nextStep.dataset.impactCnGuideNext = "";
    stepNavigation.append(previousStep, nextStep);
    const navigationNote = create("p", "impact-cn-guide-note", "翻页只查看说明，不代表已操作或完成；接入确认后再执行订单验证。");
    const jump = create("details", "impact-cn-guide-details");
    jump.dataset.impactCnGuideJump = "";
    jump.append(create("summary", "", "选择其他步骤"), cardLabel, stepLabel);
    const directory = create("details", "impact-cn-guide-details impact-cn-guide-directory");
    directory.dataset.impactCnGuideDirectory = "";
    directory.append(create("summary", "", "清单功能目录"));
    for (const group of data.checklistGroups || []) {
      const items = create("ul", "");
      for (const item of group.items) items.append(create("li", "", `${item.title}：${item.purpose}`));
      directory.append(create("h3", "", group.title), items);
    }
    const action = create("p", "impact-cn-guide-action");
    const actionTitle = create("p", "impact-cn-guide-caption", "现在做什么");
    const facts = create("dl", "impact-cn-guide-facts");
    const entry = create("dd", "impact-cn-guide-entry");
    const ready = create("dd", "impact-cn-guide-ready");
    facts.append(create("dt", "", "在哪里"), entry, create("dt", "", "看到什么才算做好"), ready);
    const locate = create("button", "impact-cn-guide-locate", "显示操作位置 →");
    locate.type = "button";
    locate.dataset.impactCnGuideLocate = "";
    locate.setAttribute("aria-pressed", "false");
    const locateStatus = create("p", "impact-cn-guide-note");
    locateStatus.dataset.impactCnGuideLocateStatus = "";
    locateStatus.setAttribute("role", "status");
    const issueLabel = create("label", "impact-cn-guide-field", "我遇到的问题");
    const issueSelect = create("select", "impact-cn-guide-select");
    issueSelect.dataset.impactCnGuideIssue = "";
    issueLabel.append(issueSelect);
    const recovery = create("div", "impact-cn-guide-recovery");
    recovery.hidden = true;
    recovery.setAttribute("role", "status");
    const issueHelp = create("p", "");
    issueHelp.dataset.impactCnGuideIssueHelp = "";
    const issueOwner = create("p", "impact-cn-guide-owner");
    issueOwner.dataset.impactCnGuideIssueOwner = "";
    recovery.append(issueHelp, issueOwner);
    const links = create("div", "impact-cn-guide-links");
    const explanation = create("details", "impact-cn-guide-details");
    explanation.dataset.impactCnGuideExplanation = "";
    explanation.append(create("summary", "", "需要更多说明？"));
    const fullText = create("div", "impact-cn-guide-fulltext");
    explanation.append(fullText, links);
    const results = create("details", "impact-cn-guide-details");
    results.dataset.impactCnGuideResults = "";
    results.append(create("summary", "", "各类结果分别核对"));
    const resultList = create("dl", "impact-cn-guide-facts");
    const progress = create("dd", "impact-cn-guide-progress");
    progress.dataset.impactCnGuideProgress = "";
    progress.setAttribute("aria-live", "polite");
    resultList.append(create("dt", "", "指引进度"), progress);
    for (const [label, text] of [
      ["原生 Checklist", "请核对原生勾选或跳过；不代表配置已完成。"],
      ["实际配置", "待核对原生保存结果，并重新打开确认。"],
      ["真实测试", "销售与退款分别核对，已有 Validated 不能代替本次订单。"],
      ["OSM 审核", "待核对本项目实际受理与审核答复。"],
      ["上线通知", "待核对实际通知及目标项目。"]
    ]) resultList.append(create("dt", "", label), create("dd", "", text));
    results.append(resultList);
    const declarationsRow = create("div", "impact-cn-guide-declarations");
    const read = create("button", "impact-cn-guide-declare", "我已阅读");
    read.type = "button";
    read.dataset.impactCnGuideRead = "";
    const operated = create("button", "impact-cn-guide-declare", "我已按指引操作");
    operated.type = "button";
    operated.dataset.impactCnGuideOperated = "";
    declarationsRow.append(read, operated);
    const note = create("p", "impact-cn-guide-note", "标记只记录阅读和操作；实际结果仍需核对。");
    const reset = create("button", "impact-cn-guide-reset", "已切换项目，重置指引记录");
    reset.type = "button";
    reset.dataset.impactCnGuideReset = "";
    const summary = create("p", "impact-cn-guide-progress");
    summary.dataset.impactCnGuideProgressSummary = "";
    summary.setAttribute("aria-live", "polite");
    preparation.querySelector("summary").after(purpose);
    view.append(back, heading, context, journeyStatus, journeyStart, journeyContinue, stepPosition, stepTitle, stepNavigation, navigationNote, actionTitle, action, locate, locateStatus, facts, issueLabel, recovery, preparation, explanation, jump, directory, declarationsRow, summary, results, note, reset);
    panel.append(view);

    let pointer;
    let pointerKey;
    let scrollDocument;
    let pointerParts;
    let arrowRequested = false;
    let waitUntil = 0;
    let guideProbeGeneration = 0;
    let guideProbeRequest;
    let guideProbeCache;
    let guideProbeTimer;
    let guideProbeRetryAt = 0;
    // Only fixed routes/known frame slots enter a scene. Cross-origin contents
    // remain unread. Context strings below live only in this document's memory.
    function observeScene() {
      if (location.protocol !== "https:" || !isImpactSite) return { sceneId: "unknown", frame: null, child: null };
      const shared = sharedTestActionsScene(location.pathname);
      if (shared) return { sceneId: shared, frame: null, child: null };
      if (config.guidance.testsPaths?.includes(location.pathname)) return { sceneId: "tests", frame: null, child: null };
      if (config.guidance.targets["6a"].openedPaths.includes(location.pathname)) return { sceneId: "tool", frame: null, child: null };
      if (!checklistTopMatches(document, location)) return { sceneId: "unknown", frame: null, child: null };
      const frames = document.querySelectorAll(checklistConfig.frameSelector);
      if (frames.length !== 1) return { sceneId: "unknown", frame: null, child: null };
      const frame = frames[0];
      try {
        const url = new URL(frame.getAttribute("src"), location.href);
        const validation = config.guidance.targets["6a"].frameRegion;
        if (url.protocol === "https:" && url.host === validation.host && url.pathname === validation.path) return { sceneId: "validation", frame, child: null };
        if (url.origin === location.origin && url.pathname === config.guidance.targets["5b"].frame.path) {
          const child = frame.contentDocument;
          if (child?.location.pathname === url.pathname && child.querySelectorAll("#vueInstance").length === 1) return { sceneId: "website", frame, child };
        }
      } catch { /* Loading and unrecognized frames cannot establish arrival. */ }
      return { sceneId: "unknown", frame, child: null };
    }
    function readContextSignal() {
      const host = document.querySelector("#adv-navigation impact-style-isolator");
      const root = host?.shadowRoot;
      const buttons = root?.querySelectorAll("button.account-btn.adv-account-btn");
      const links = root?.querySelectorAll('a[href*="/secure/advertiser/engage/checklist/instance/"]');
      const selected = root?.querySelectorAll('.programs-container .iui-mobile-menu-link.selected .campaignName[data-testid]');
      if (selected?.length === 1) {
        const value = selected[0].getAttribute("data-testid");
        if (selectedProgramSignal && selectedProgramSignal !== value) return { key: "", changed: true };
        selectedProgramSignal = value;
      }
      // Header text/instance link detect changes; they never prove continuity
      // across documents and are never sent to the worker or persisted.
      return { key: buttons?.length === 1 && links?.length === 1 ? normalize(buttons[0].textContent) + "\n" + links[0].getAttribute("href") : "", changed: false };
    }
    const sceneNames = { website: "网站设置", validation: "验证转化事件", tool: "测试工具", tests: "测试转化列表", unknown: "未识别页面" };
    function continueDestination() {
      const current = observation?.sceneId;
      if (step.mode === "information") return null;
      if (step.id === "6c" && ["validation", "tool"].includes(current)) return "tests";
      return current === "website" ? "validation" : current === "validation" ? "tool" : null;
    }
    function renderJourney() {
      const current = observation?.sceneId || "unknown";
      journeyStart.hidden = !journeyContract;
      journeyStatus.hidden = !journeyContract;
      journeyContinue.hidden = !journey || journey.status !== "active" || !continueDestination();
      journeyStart.disabled = current === "unknown" || step.mode === "information";
      const arrived = current === "unknown" ? "请先打开网站设置、验证转化事件或测试工具。" : `已到达“${sceneNames[current]}”${current === "validation" ? "正文外框" : ""}。只确认页面已打开，操作与业务结果仍需核对。`;
      if (checkpointNote) journeyStatus.textContent = `${checkpointNote} ${arrived}`;
      else if (journey) {
        const reasons = { "transition-expired": "等待目标页面已超时，请从当前页面重新开始。", "unknown-scene": "当前页面未适配，请核对页面后重新开始。", "unexpected-scene": "到达页面与任务目的地不符，请重新开始。", "reopened-review-only": "已恢复说明；定位需重新开启，旧操作不会自动恢复。" };
        journeyStatus.textContent = `${journey.status === "active" ? "连续指引" : "连续指引已暂停"}：从“${sceneNames[journey.originScene]}”开始 → 当前“${sceneNames[current]}”${journey.pendingTransition ? ` → 预期“${sceneNames[journey.pendingTransition.to]}”` : ""}。${reasons[journeyReason] || ""}${arrived}`;
      }
      else journeyStatus.textContent = `尚未开始连续任务。${arrived}`;
      view.dataset.impactCnJourneyScene = current;
      view.dataset.impactCnJourneyState = journey?.status || "idle";
    }
    async function checkpoint(op, retried = false) {
      if (!inExtension || !journeyContract || !runtime.sendMessage) return;
      const generation = checkpointGeneration;
      const passiveGeneration = passiveOpenGeneration;
      const epoch = contextEpoch;
      const requestRoute = route;
      const sceneId = observation.sceneId;
      const sentState = journey;
      const seq = op === "take" ? null : ++checkpointSeq;
      const current = () => !destroyed && generation === checkpointGeneration && epoch === contextEpoch
        && requestRoute === route && route === location.pathname + location.search;
      try {
        const reply = await runtime.sendMessage({ type: "impact-cn:journey-checkpoint", op, contextEpoch: epoch,
          ...(op === "take" ? { sceneId } : { seq }), ...(op === "put" ? { state: sentState } : {}) });
        if (!current() || (op === "take" && sceneId !== observation.sceneId)) return;
        if (op === "put" && reply?.ok === false && reply.reason === "document-unbound") {
          // Worker suspension loses its owner map while this document's bound
          // flag survives. Only the latest request may rebind this context;
          // an arrival checkpoint never becomes permission to resume old work.
          const unchanged = () => current() && journey === sentState && checkpointSeq === seq && observation.sceneId === sceneId;
          if (!unchanged()) return;
          checkpointBound = false;
          if (retried) return;
          const rebound = await runtime.sendMessage({ type: "impact-cn:journey-checkpoint", op: "take", contextEpoch: epoch, sceneId });
          if (!current()) return;
          checkpointBound = rebound?.ok === true;
          // A legal observation/continue may replace the local task while take
          // waits. Keep the verified binding, then save only the latest active
          // scene-consistent state; never retry the captured obsolete snapshot.
          if (checkpointBound && checkpointSeq === seq && journey?.status === "active"
              && journeyContract.validState(journey) && journey.contextEpoch === epoch
              && journeyContract.steps[observation.sceneId] && journey.sceneId === observation.sceneId) await checkpoint("put", true);
          return;
        }
        if (op === "take") {
          checkpointBound = reply?.ok === true;
          if (reply?.checkpoint && !journey && journeyContract.validState(reply.checkpoint)) {
            checkpointNote = `上次任务从“${sceneNames[reply.checkpoint.originScene]}”前往“${sceneNames[reply.checkpoint.pendingTransition?.to] || "未识别页面"}”。无法核对这次跳转的项目来路，连续指引已暂停；请从当前页面重新开始，旧操作不会计入。`;
            renderJourney();
            const index = sequence.findIndex(item => item.step.id === journeyContract.steps[sceneId]);
            if (index >= 0) selectStep(index);
            // A passive arrival may show its explanation, never revive an
            // old task, declaration or location request across documents.
            if (passiveOpenAllowed && passiveGeneration === passiveOpenGeneration) {
              settings.hidden = true;
              view.hidden = false;
              panel.hidden = false;
              open.setAttribute("aria-expanded", "true");
              assistant?.querySelector(".impact-cn-launcher")?.setAttribute("aria-expanded", "true");
              positionPanel();
            }
          }
          if (checkpointBound && journey) void checkpoint("put");
        } else if (op === "clear" && reply?.ok) checkpointBound = true;
      } catch { /* Session storage is optional; local guidance remains usable. */ }
    }
    function applyJourney(type, extra = {}) {
      if (!journeyContract) return;
      const result = journeyContract.transition(journey, { type, sceneId: observation.sceneId, contextEpoch, now: Date.now(), ...extra });
      journey = result.state;
      journeyReason = result.effects?.reason || "";
      if (result.effects?.cancelLocate) hideArrow();
      renderJourney();
      if (checkpointBound) void checkpoint(journey ? "put" : "clear");
    }
    function invalidateJourney(message) {
      contextActionInvalidated = true;
      sceneWaitingFollow = false;
      navigationGeneration += 1;
      checkpointGeneration += 1;
      checkpointBound = false;
      contextEpoch = crypto.randomUUID();
      selectedProgramSignal = undefined;
      if (journey) applyJourney("context-changed");
      declarations.clear();
      updateDeclarations();
      hideArrow();
      checkpointNote = message;
      context.textContent = message;
      renderJourney();
      void checkpoint("clear");
    }
    function syncScene() {
      if (!journeyContract || observing || destroyed) return false;
      observing = true;
      let changed = false;
      try {
        const next = observeScene();
        const signal = readContextSignal();
        const frameSource = next.frame?.getAttribute("src");
        const changedFrameQuery = observation?.sceneId === next.sceneId && next.sceneId !== "unknown"
          && sceneFrameSource && frameSource && sceneFrameSource !== frameSource;
        // Native navigation hydrates after a new document's initial checkpoint
        // take. Its header/link alone cannot invalidate a passive arrival note;
        // local tasks, declarations, locating and pending AI still fail closed.
        const hasLocalActivity = journey || declarations.size || arrowRequested || sceneWaitingFollow || busy;
        if (signal.changed || changedFrameQuery || (hasLocalActivity && contextSignal && signal.key !== contextSignal)) {
          if (changedFrameQuery) sceneFrameSource = frameSource;
          invalidateJourney("项目或页面上下文已变化，连续指引已暂停。请核对后从当前页面重新开始。");
          changed = true;
        }
        contextSignal = signal.key;
        const loadingFrame = next.frame && (!next.frame.getAttribute("src") || next.frame.getAttribute("src") === "about:blank");
        if (next.sceneId === "unknown" && loadingFrame && journey?.status === "active") {
          if (!sceneLoadingUntil) sceneLoadingUntil = Date.now() + 15000;
          if (Date.now() < sceneLoadingUntil) {
            sceneWaitingFollow ||= arrowRequested;
            hideArrow();
            if (sceneWaitingFollow) { locate.textContent = "取消定位"; locate.setAttribute("aria-pressed", "true"); }
            journeyStatus.textContent = "正文正在切换，定位已暂停；等待识别实际到达页面。";
            return true;
          }
        } else sceneLoadingUntil = 0;
        if (!observation || next.sceneId !== observation.sceneId || next.frame !== sceneFrame || next.child !== sceneDocument || frameLoadEpoch !== observedLoadEpoch) {
          const sharedArrival = observation?.sceneId === "unknown" && next.sceneId !== "unknown"
            && location.pathname === config.guidance?.sharedTestActionsPage?.path;
          const wasFollowing = arrowRequested || sceneWaitingFollow;
          sceneWaitingFollow = false;
          changed = Boolean(observation) || changed;
          observation = { sceneId: next.sceneId };
          sceneFrame = next.frame;
          sceneDocument = next.child;
          sceneFrameSource = frameSource;
          observedLoadEpoch = frameLoadEpoch;
          hideArrow();
          // Scene changes invalidate old declarations/DOM actions, even with
          // an unchanged top-level URL. Arrival never means business success.
          declarations.clear();
          if (journey) {
            applyJourney("observed");
            if (journey.status === "active") {
              const index = sequence.findIndex(item => item.step.id === journey.stepId);
              if (index >= 0) selectStep(index);
              if (wasFollowing && step.mode !== "information" && !view.hidden && !panel.hidden) { arrowRequested = true; locate.setAttribute("aria-pressed", "true"); }
            }
          } else if (!wasFollowing) {
            // A new observed page selects its read-only explanation, without
            // starting a task. Stable-scene polling preserves manual choices.
            const index = sequence.findIndex(item => item.step.id === journeyContract.steps[next.sceneId]);
            if (index >= 0) selectStep(index);
          } else if (step.mode !== "information" && !contextActionInvalidated && !view.hidden && !panel.hidden) {
            // Existing one-step guidance still follows its own guarded target;
            // observing a frame does not silently cancel that explicit request.
            arrowRequested = true;
            locate.setAttribute("aria-pressed", "true");
          }
          renderJourney();
          updateDeclarations();
          // An unrecognized shared-route shell cannot bind a checkpoint. Once
          // its native page is known, take only the usual unverified note.
          if (sharedArrival && !journey && !checkpointBound) void checkpoint("take");
        }
        if (journey?.status === "active" && journey.pendingTransition && Date.now() >= journey.pendingTransition.expiresAt) {
          applyJourney("observed");
          declarations.clear();
          updateDeclarations();
          changed = true;
        }
        renderSceneInstructions();
        if (next.sceneId === "tool" && !arrowRequested && step.mode !== "information") {
          locateStatus.textContent = config.guidance.targets[step.id]?.openedHint || "";
        }
      } finally { observing = false; }
      return changed;
    }
    function removePointer() {
      pointer?.remove();
      pointer = pointerParts = pointerKey = undefined;
    }
    function hideArrow() {
      arrowRequested = false;
      waitUntil = 0;
      cancelGuideProbe();
      removePointer();
      if (scrollDocument) scrollDocument.removeEventListener("scroll", updateArrow, true);
      scrollDocument = undefined;
      locate.setAttribute("aria-pressed", "false");
      locate.textContent = "显示操作位置 →";
      locateStatus.textContent = "";
    }
    function cancelGuideProbe() {
      guideProbeGeneration += 1;
      clearTimeout(guideProbeTimer);
      guideProbeTimer = undefined;
      guideProbeCache = undefined;
      guideProbeRetryAt = 0;
      const pending = guideProbeRequest;
      guideProbeRequest = undefined;
      if (pending && inExtension && runtime?.sendMessage) {
        void runtime.sendMessage({ type: "impact-cn:guide-cancel", requestId: pending.requestId, contextEpoch: pending.epoch }).catch(() => {});
      }
    }
    function guideProbeCurrent(request) {
      return !destroyed && arrowRequested && step.mode !== "information" && !view.hidden && !panel.hidden
        && request.generation === guideProbeGeneration && request.epoch === contextEpoch && request.route === route
        && route === location.pathname + location.search && request.stepId === step.id
        && request.sceneId === observation?.sceneId && request.frame === sceneFrame;
    }
    function validGuideGeometry(reply, role) {
      if (!guideExactKeys(reply, ["ok", "role", "target", "state", "rect", "viewport"]) || reply.ok !== true || reply.role !== role
          || ![role, "help-close"].includes(reply.target) || !["ready", "covered", "clipped", "loading"].includes(reply.state)
          || !guideExactKeys(reply.viewport, ["width", "height"])) return false;
      const dimension = value => Number.isFinite(value) && value > 0 && value <= 16384;
      if (!dimension(reply.viewport.width) || !dimension(reply.viewport.height)) return false;
      if (reply.rect === null) return reply.state !== "ready";
      const rect = reply.rect;
      return guideExactKeys(rect, ["left", "top", "width", "height"]) && Number.isFinite(rect.left) && rect.left >= 0
        && Number.isFinite(rect.top) && rect.top >= 0 && dimension(rect.width) && dimension(rect.height)
        && rect.left + rect.width <= reply.viewport.width && rect.top + rect.height <= reply.viewport.height;
    }
    function requestGuideGeometry(frame, role) {
      if (guideProbeRequest || Date.now() < guideProbeRetryAt || !inExtension || !runtime?.sendMessage) return;
      const request = { requestId: crypto.randomUUID(), epoch: contextEpoch, route, stepId: step.id,
        sceneId: observation?.sceneId, frame, role, generation: guideProbeGeneration };
      guideProbeRequest = request;
      void runtime.sendMessage({ type: "impact-cn:guide-probe", requestId: request.requestId, contextEpoch: request.epoch, role })
        .then(reply => {
          if (guideProbeRequest !== request || !guideProbeCurrent(request)) return;
          guideProbeRequest = undefined;
          const valid = validGuideGeometry(reply, role);
          if (valid) guideProbeCache = { request, reply, expiresAt: Date.now() + 650 };
          guideProbeRetryAt = valid ? 0 : Date.now() + 350;
          clearTimeout(guideProbeTimer);
          guideProbeTimer = setTimeout(() => {
            if (!guideProbeCurrent(request)) return;
            guideProbeCache = undefined;
            updateArrow();
          }, valid ? 650 : 350);
          updateArrow();
        }, () => {
          if (guideProbeRequest !== request || !guideProbeCurrent(request)) return;
          guideProbeRequest = undefined;
          guideProbeRetryAt = Date.now() + 350;
          clearTimeout(guideProbeTimer);
          guideProbeTimer = setTimeout(() => { if (guideProbeCurrent(request)) updateArrow(); }, 350);
        });
    }
    function mappedGuideGeometry(frame, target) {
      const cache = guideProbeCache;
      if (!cache || cache.expiresAt <= Date.now() || cache.request.role !== target.frameRegion.role || !guideProbeCurrent(cache.request)) {
        requestGuideGeometry(frame, target.frameRegion.role);
        return { state: "loading", hint: "正在核对验证页中的操作位置。" };
      }
      const { reply } = cache;
      if (!reply.rect || reply.state !== "ready") return { state: reply.state, hint: target.frameRegion.hint };
      const bounds = frame.getBoundingClientRect(), local = reply.rect;
      if (hiddenByLayout(frame) || !frame.offsetWidth || !frame.offsetHeight
          || Math.abs(reply.viewport.width - frame.clientWidth) > 1 || Math.abs(reply.viewport.height - frame.clientHeight) > 1
          || local.left + local.width > frame.clientWidth || local.top + local.height > frame.clientHeight) return { state: "clipped" };
      const scaleX = bounds.width / frame.offsetWidth, scaleY = bounds.height / frame.offsetHeight;
      const rect = { left: bounds.left + (frame.clientLeft + local.left) * scaleX, top: bounds.top + (frame.clientTop + local.top) * scaleY,
        width: local.width * scaleX, height: local.height * scaleY };
      if (rect.left < 0 || rect.top < 0 || rect.left + rect.width > innerWidth || rect.top + rect.height > innerHeight) return { state: "clipped" };
      for (let ancestor = frame.parentElement; ancestor; ancestor = ancestor.parentElement) {
        const style = getComputedStyle(ancestor), box = ancestor.getBoundingClientRect();
        const clipsX = /^(auto|scroll|hidden|clip)$/u.test(style.overflowX), clipsY = /^(auto|scroll|hidden|clip)$/u.test(style.overflowY);
        const sx = ancestor.offsetWidth ? box.width / ancestor.offsetWidth : 1, sy = ancestor.offsetHeight ? box.height / ancestor.offsetHeight : 1;
        const left = box.left + ancestor.clientLeft * sx, top = box.top + ancestor.clientTop * sy;
        if ((clipsX && (rect.left < left - 1 || rect.left + rect.width > left + ancestor.clientWidth * sx + 1))
            || (clipsY && (rect.top < top - 1 || rect.top + rect.height > top + ancestor.clientHeight * sy + 1))) return { state: "clipped" };
      }
      return { rect, state: uncovered(frame, rect) ? "ready" : "covered", hint: target.frameRegion.hint, document, kind: "control" };
    }
    function visibleRect(element, textOnly = false) {
      const getStyle = el => el.ownerDocument.defaultView.getComputedStyle(el);
      const style = getStyle(element);
      let rect = element.getBoundingClientRect();
      if (textOnly) {
        const range = element.ownerDocument.createRange();
        range.selectNodeContents(element);
        rect = range.getBoundingClientRect();
      }
      if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0 || rect.width <= 0 || rect.height <= 0 || element.closest("[inert],[aria-hidden='true']")) return null;
      const viewport = element.ownerDocument.defaultView;
      // Off-screen targets cannot be hit-tested for obstruction. Treat their
      // viewport clipping first, in the document that owns the target.
      if (rect.left < 0 || rect.top < 0 || rect.right > viewport.innerWidth || rect.bottom > viewport.innerHeight) return null;
      // An in-viewport rectangle can still sit outside a native scroll region.
      // Reject clipped targets rather than scrolling or changing that region.
      for (let parent = element.parentElement; parent; parent = parent.parentElement) {
        const parentStyle = getStyle(parent);
        if (Number(parentStyle.opacity) === 0) return null;
        const clipsX = /^(auto|scroll|hidden|clip)$/u.test(parentStyle.overflowX);
        const clipsY = /^(auto|scroll|hidden|clip)$/u.test(parentStyle.overflowY);
        if (!clipsX && !clipsY) continue;
        const box = parent.getBoundingClientRect();
        const sx = parent.offsetWidth ? box.width / parent.offsetWidth : 1;
        const sy = parent.offsetHeight ? box.height / parent.offsetHeight : 1;
        const left = box.left + parent.clientLeft * sx, top = box.top + parent.clientTop * sy;
        if ((clipsX && (rect.left < left - 1 || rect.right > left + parent.clientWidth * sx + 1))
          || (clipsY && (rect.top < top - 1 || rect.bottom > top + parent.clientHeight * sy + 1))) return null;
      }
      return rect;
    }
    function uncovered(element, rect) {
      // Hit-test both documents; a modal over a frame must not leave a pointer
      // aimed at its inaccessible contents. Read geometry only, never click.
      const points = [[0.5, 0.5], [0.1, 0.5], [0.9, 0.5]];
      return points.every(([x, y]) => {
        const hit = element.ownerDocument.elementFromPoint(rect.left + rect.width * x, rect.top + rect.height * y);
        return hit && (hit === element || element.contains(hit));
      });
    }
    function hiddenByLayout(element) {
      const box = element.getBoundingClientRect();
      if (box.width <= 0 || box.height <= 0 || element.closest("[inert],[aria-hidden='true']")) return true;
      for (let current = element; current; current = current.parentElement) {
        const style = current.ownerDocument.defaultView.getComputedStyle(current);
        if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return true;
      }
      return false;
    }
    function collapsedGroupTarget(shell, target, clickArea) {
      if (!target.group || !config.guidance.groupSelector) return null;
      const headers = [...shell.querySelectorAll(config.guidance.groupSelector)].filter(header => {
        const labels = header.querySelectorAll(":scope > span.text");
        return labels.length === 1 && target.group.texts.includes(normalize(labels[0].textContent));
      });
      if (headers.length !== 1) return null;
      const header = headers[0];
      const item = header.parentElement;
      const targetPanel = clickArea.closest("div.panel");
      // Only the observed sibling-panel structure can identify a closed group.
      // Read it without toggling the accordion or changing native attributes.
      if (!item?.matches(".accordion-item") || header.querySelectorAll(":scope > span.duration").length !== 1
        || !targetPanel || targetPanel.parentElement !== item || targetPanel.classList.contains("expanded")
        || !(header.compareDocumentPosition(targetPanel) & Node.DOCUMENT_POSITION_FOLLOWING)) return null;
      const hint = `先展开左侧“${target.group.texts[1]}”，再选择“${target.navigation[1]}”。`;
      const rect = visibleRect(header);
      return rect ? { rect, state: uncovered(header, rect) ? "group-closed" : "covered", hint, document, kind: "group" }
        : { state: "clipped", hint, document, kind: "group" };
    }
    function resolveTarget() {
      if (step.mode === "information") return null;
      const target = config.guidance?.targets?.[step.id];
      if (!target) return null;
      if (observation?.sceneId === "tests") return { state: "instructions", hint: "请在测试转化列表找到本次测试订单，打开详情核对项目、事件与订单数据；不要沿用旧验证状态。" };
      if (observation?.sceneId === "tool" && target.openedPaths?.includes(location.pathname)) {
        const controls = target.toolControl && [...document.querySelectorAll(target.toolControl.selector)]
          .filter(el => target.toolControl.texts.includes(normalize(el.textContent)));
        if (controls?.length > 1) return null;
        const label = !controls?.length && target.toolLabel && [...document.querySelectorAll(target.toolLabel.selector)]
          .filter(el => target.toolLabel.texts.includes(normalize(el.textContent)));
        if (label?.length > 1) return null;
        const element = controls?.[0] || label?.[0];
        if (!element) return { state: "instructions", hint: target.openedHint };
        const rect = visibleRect(element);
        return { rect, state: !rect ? "clipped" : element.disabled || element.getAttribute("aria-disabled") === "true" ? "unavailable"
          : uncovered(element, rect) ? "ready" : "covered", hint: controls?.length ? target.toolControl.hint : target.toolLabel.hint,
          document, kind: controls?.length ? "control" : "region" };
      }
      if (!checklistTopMatches(document, location)) return null;
      const shell = document.querySelector(checklistConfig.topRootSelector);
      const frames = document.querySelectorAll(checklistConfig.frameSelector);
      if (frames.length > 1) return null;
      const frame = frames[0];
      if (target.frameRegion && frame) {
        try {
          const url = new URL(frame.getAttribute("src"), location.href);
          if (url.protocol === "https:" && url.host === target.frameRegion.host && url.pathname === target.frameRegion.path) {
            const matchingFrames = [...document.querySelectorAll("iframe")].filter(candidate => {
              try { const source = new URL(candidate.getAttribute("src"), location.href); return source.protocol === "https:" && source.host === url.host && source.pathname === url.pathname; }
              catch { return false; }
            });
            if (matchingFrames.length !== 1 || matchingFrames[0] !== frame) return null;
            const help = config.guidance.validationHelp;
            // The native wrapper can be height zero around a fixed help panel.
            // Only its observed, strictly matched visible close may establish it.
            const drawers = help?.container ? [...document.querySelectorAll(help.container)].filter(el => el.children.length
              && (!hiddenByLayout(el) || (help.closeSelector && [...el.querySelectorAll(help.closeSelector)].some(close => !hiddenByLayout(close))))) : [];
            if (drawers.length > 1) return null;
            if (drawers.length) {
              if (guideProbeRequest || guideProbeCache) cancelGuideProbe();
              const closes = help.closeSelector ? [...drawers[0].querySelectorAll(help.closeSelector)].filter(el => !hiddenByLayout(el)) : [];
              if (closes.length !== 1) return { state: "covered", hint: "请先关闭验证转化事件的帮助侧栏，再继续定位。" };
              const rect = visibleRect(closes[0]);
              return { rect, state: !rect ? "clipped" : uncovered(closes[0], rect) ? "ready" : "covered", hint: "先点这里关闭帮助侧栏，再继续打开测试入口", document, kind: "control" };
            }
            return mappedGuideGeometry(frame, target);
          }
        } catch { /* An unrecognized frame keeps the known navigation fallback. */ }
      }
      if (target.frame && frame) {
        try {
          const url = new URL(frame.getAttribute("src"), location.href);
          if (url.protocol === "https:" && url.origin === location.origin && url.pathname === target.frame.path) {
            const child = frame.contentDocument;
            if (child && child.location.pathname === target.frame.path) {
              const candidates = [...child.querySelectorAll(target.frame.selector)].filter(el => target.frame.texts.includes(normalize(el.textContent)));
              if (candidates.length > 1) return null;
              if (!candidates.length) return { state: "loading" };
              const local = visibleRect(candidates[0], target.frame.textOnly);
              const bounds = visibleRect(frame);
              if (!bounds || !local || local.left < 0 || local.top < 0 || local.right > frame.clientWidth || local.bottom > frame.clientHeight) return { state: "clipped" };
              const scaleX = bounds.width / frame.offsetWidth, scaleY = bounds.height / frame.offsetHeight;
              const rect = { left: bounds.left + (frame.clientLeft + local.left) * scaleX, top: bounds.top + (frame.clientTop + local.top) * scaleY, width: local.width * scaleX, height: local.height * scaleY };
              const covered = !uncovered(candidates[0], local) || !uncovered(frame, rect);
              return { rect, state: covered ? "covered" : "ready", hint: target.frame.hint, document: child, kind: "control" };
            }
            return { state: "loading" };
          }
        } catch { /* Cross-origin and loading documents use only the known parent navigation. */ }
      }
      const candidates = [...shell.querySelectorAll(config.guidance.navigationSelector)].filter(el => target.navigation.includes(normalize(el.textContent)));
      if (candidates.length > 1) return null;
      if (!candidates.length) return { state: "loading" };
      const clickArea = candidates[0].closest(".check-item.clickable");
      const rect = clickArea && visibleRect(clickArea);
      if (!clickArea) return null;
      if (!rect) {
        const group = collapsedGroupTarget(shell, target, clickArea);
        if (group) return group;
        return { state: hiddenByLayout(clickArea) ? "unavailable" : "clipped" };
      }
      return { rect, state: uncovered(clickArea, rect) ? "ready" : "covered", hint: target.hint, document, kind: "navigation" };
    }
    function createPointer() {
      pointer = create("div", "impact-cn-guide-pointer");
      pointer.id = "impact-cn-guide-pointer";
      pointer.setAttribute("data-impact-cn-ignore", "");
      pointer.setAttribute("aria-hidden", "true");
      const ring = create("div", "impact-cn-guide-pointer-ring");
      const bubble = create("div", "impact-cn-guide-pointer-bubble");
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const line = document.createElementNS(svg.namespaceURI, "line");
      const head = document.createElementNS(svg.namespaceURI, "path");
      svg.append(line, head);
      pointer.append(svg, ring, bubble);
      document.body.append(pointer);
      pointerParts = { ring, bubble, svg, line, head };
    }
    function updateArrow() {
      syncScene();
      if (step.mode === "information") { sceneWaitingFollow = false; hideArrow(); return; }
      if (sceneLoadingUntil && Date.now() < sceneLoadingUntil) return;
      if (!arrowRequested) return;
      if (view.hidden || panel.hidden || destroyed || route !== location.pathname + location.search) { hideArrow(); return; }
      const target = resolveTarget();
      const rect = target?.rect;
      if (!target) {
        hideArrow();
        locateStatus.textContent = "此页没有可指的位置。请按上方路径操作。";
        return;
      }
      if (target.state === "instructions") {
        hideArrow();
        locateStatus.textContent = target.hint;
        return;
      }
      if (target.document && scrollDocument !== target.document) {
        scrollDocument?.removeEventListener("scroll", updateArrow, true);
        scrollDocument = target.document;
        if (scrollDocument !== document) scrollDocument.addEventListener("scroll", updateArrow, { capture: true, passive: true });
      }
      if (target.state !== "loading") waitUntil = 0;
      if (target.state === "loading" && !waitUntil) waitUntil = Date.now() + 15000;
      if (target.state === "loading" && Date.now() >= waitUntil) {
        hideArrow();
        locateStatus.textContent = "暂未找到位置。请按路径打开页面，再重试。";
        return;
      }
      if (!["ready", "group-closed"].includes(target.state) || !rect || rect.left < 0 || rect.top < 0 || rect.left + rect.width > innerWidth || rect.top + rect.height > innerHeight) {
        removePointer();
        locate.textContent = "取消定位";
        const stateHint = target.state === "loading" ? "页面加载中，稍候会显示位置。" : target.state === "covered" ? "位置被遮住了。请移开助手或关闭遮挡层。" : target.state === "unavailable" ? "当前入口不可见。请按上方路径打开页面。" : "位置不在可见区域。请滚动页面查看。";
        locateStatus.textContent = target.hint ? `${target.hint} ${stateHint}` : stateHint;
        return;
      }
      waitUntil = 0;
      if (!pointer) createPointer();
      locate.textContent = "隐藏箭头";
      const avoidSelectors = [...(config.ai?.rootSelectors || []), ...(config.assistantAvoidSelectors || [])].join(",");
      const obstacles = [panel.getBoundingClientRect(), assistant.getBoundingClientRect()];
      if (avoidSelectors) obstacles.push(...deepQueryAll(document, avoidSelectors).filter(controlVisible).map(el => el.getBoundingClientRect()));
      const key = [rect.left, rect.top, rect.width, rect.height, innerWidth, innerHeight, target.kind, target.hint, ...obstacles.flatMap(box => [box.left, box.top, box.width, box.height])].join(":");
      if (key === pointerKey) return;
      pointerKey = key;
      const { ring, bubble, svg, line, head } = pointerParts;
      for (const [name, value] of Object.entries({ left: rect.left - 3, top: rect.top - 3, width: rect.width + 6, height: rect.height + 6 })) ring.style[name] = `${value}px`;
      bubble.textContent = target.hint;
      const width = Math.min(220, innerWidth - 16);
      bubble.hidden = false;
      bubble.style.width = `${width}px`;
      const height = bubble.getBoundingClientRect().height;
      const right = rect.left + rect.width, bottom = rect.top + rect.height;
      const clampX = x => Math.max(8, Math.min(innerWidth - width - 8, x));
      const clampY = y => Math.max(8, Math.min(innerHeight - height - 8, y));
      const candidates = [
        { left: right + 28, top: clampY(rect.top - 38), side: "right" },
        { left: rect.left - width - 28, top: clampY(rect.top - 38), side: "left" },
        { left: clampX(rect.left + rect.width / 2 - width / 2), top: rect.top - height - 24, side: "above" },
        { left: clampX(rect.left + rect.width / 2 - width / 2), top: bottom + 24, side: "below" }
      ];
      const overlaps = (a, b) => a.left < b.left + b.width + 8 && a.left + a.width + 8 > b.left && a.top < b.top + b.height + 8 && a.top + a.height + 8 > b.top;
      const position = candidates.find(pos => pos.left >= 8 && pos.top >= 8 && pos.left + width <= innerWidth - 8 && pos.top + height <= innerHeight - 8 && ![rect, ...obstacles].some(box => overlaps({ ...pos, width, height }, box)));
      bubble.hidden = !position;
      svg.style.display = position ? "" : "none";
      svg.setAttribute("viewBox", `0 0 ${innerWidth} ${innerHeight}`);
      if (!position) {
        pointer.dataset.targetX = String(rect.left - 4); pointer.dataset.targetY = String(rect.top + rect.height / 2); pointer.dataset.targetKind = target.kind;
        locateStatus.textContent = target.hint;
        return;
      }
      bubble.style.left = `${position.left}px`;
      bubble.style.top = `${position.top}px`;
      const label = bubble.getBoundingClientRect();
      const vertical = position.side === "above" || position.side === "below";
      const x = vertical ? rect.left + rect.width / 2 : position.side === "right" ? right + 4 : rect.left - 4;
      const y = vertical ? position.side === "above" ? rect.top - 4 : bottom + 4 : rect.top + rect.height / 2;
      const startX = vertical ? label.left + label.width / 2 : position.side === "right" ? label.left : label.right;
      const startY = vertical ? position.side === "above" ? label.bottom : label.top : label.top + label.height / 2;
      line.setAttribute("x1", String(startX)); line.setAttribute("y1", String(startY));
      line.setAttribute("x2", String(x)); line.setAttribute("y2", String(y));
      const length = Math.hypot(x - startX, y - startY) || 1;
      const ux = (x - startX) / length, uy = (y - startY) / length;
      head.setAttribute("d", `M ${x} ${y} L ${x - ux * 12 - uy * 6} ${y - uy * 12 + ux * 6} L ${x - ux * 12 + uy * 6} ${y - uy * 12 - ux * 6} Z`);
      pointer.dataset.targetX = String(x); pointer.dataset.targetY = String(y); pointer.dataset.targetKind = target.kind;
      locateStatus.textContent = target.hint;
    }
    listen(locate, "click", () => {
      if (step.mode === "information") return;
      if (sceneWaitingFollow) { sceneWaitingFollow = false; hideArrow(); return; }
      if (!checkContext()) return;
      if (arrowRequested) { hideArrow(); return; }
      arrowRequested = true;
      waitUntil = 0;
      locate.setAttribute("aria-pressed", "true");
      updateArrow();
    });
    listen(window, "scroll", updateArrow, { capture: true, passive: true });
    listen(window, "resize", updateArrow);
    listen(document, "load", event => {
      if (event.target?.matches?.(checklistConfig.frameSelector)) frameLoadEpoch += 1;
      updateArrow();
    }, true);

    function updateDeclarations() {
      const current = declarations.get(step.id) || {};
      if (step.mode === "information") delete current.operated;
      read.setAttribute("aria-pressed", String(Boolean(current.read)));
      operated.setAttribute("aria-pressed", String(Boolean(current.operated)));
      const text = step.mode === "information" ? `阅读：${current.read ? "已阅读" : "未阅读"}。本项仅作说明，实际安排与结果请联系负责人核对。`
        : `阅读：${current.read ? "已阅读" : "未阅读"}；操作：${current.operated ? "已声明操作" : "未声明"}。结果仍需核对。`;
      progress.textContent = text;
      summary.textContent = text;
    }

    function showIssue() {
      const issue = (step.issues || []).find((item) => item.id === issueSelect.value);
      recovery.hidden = !issue;
      issueHelp.textContent = issue?.help || "";
      issueOwner.textContent = issue ? `找谁：${issue.owner}` : "";
      positionPanel();
    }

    function renderStep() {
      sceneWaitingFollow = false;
      if (step.mode === "information") sceneLoadingUntil = 0;
      hideArrow();
      const target = config.guidance?.targets?.[step.id];
      locateStatus.textContent = observation?.sceneId === "tool" && target?.openedPaths?.includes(location.pathname) ? target.openedHint : "";
      explanation.open = false;
      stepPosition.textContent = `第 ${stepIndex + 1} / ${sequence.length} 项 · ${guide.title}`;
      stepTitle.textContent = step.title.replace(/^\d+\.\s*/u, "");
      view.dataset.impactCnGuideStepId = step.id;
      previousStep.disabled = stepIndex === 0;
      nextStep.disabled = stepIndex === sequence.length - 1;
      fullText.replaceChildren(...(step.details || []).map(text => create("p", "", text)));
      stepSelect.value = step.id;
      action.textContent = step.action;
      entry.textContent = step.entry;
      ready.textContent = step.ready;
      locate.hidden = operated.hidden = step.mode === "information";
      locate.disabled = operated.disabled = step.mode === "information";
      locateStatus.hidden = step.mode === "information";
      renderSceneInstructions();
      const none = create("option", "", "暂时没有，查看操作要求");
      none.value = "";
      issueSelect.replaceChildren(none, ...(step.issues || []).map((item) => {
        const option = create("option", "", item.label);
        option.value = item.id;
        return option;
      }));
      links.replaceChildren();
      for (const item of step.links || []) {
        let url;
        try { url = new URL(item.url); } catch { continue; }
        if (url.protocol !== "https:" || !["help.impact.com", "integrations.impact.com", "help.shopify.com", "apps.shopify.com"].includes(url.hostname)) continue;
        const link = create("a", "", item.label);
        link.href = url.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        links.append(link);
      }
      updateDeclarations();
      renderJourney();
      showIssue();
    }
    function renderSceneInstructions() {
      if (step.mode === "information") return;
      const scene = observation?.sceneId;
      if (step.id === "6a" && scene === "validation") {
        action.textContent = "先关闭遮挡正文的帮助侧栏，再点击“打开测试工具”；进入工具后继续生成本次测试链接，由你在链接打开的店铺完成测试订单。";
        entry.textContent = "验证转化事件 → 关闭帮助侧栏 → 打开测试工具 → 运行测试 → 在测试链接下单";
      } else if (step.id === "6a" && scene === "tool") {
        action.textContent = config.guidance.targets["6a"].openedHint;
        entry.textContent = "测试工具 → 向下滚动至运行测试 → 在新窗口中开始测试 → 在打开的店铺下单";
      } else if (step.id === "6c" && scene === "validation") {
        action.textContent = "先关闭遮挡正文的帮助侧栏，再点击“查看测试转化”；找到本次测试订单并核对详情与本次原生验证结果。";
        entry.textContent = "验证转化事件 → 查看测试转化 → 本次测试订单 → 查看详情";
      } else if (step.id === "6c" && scene === "tool") {
        action.textContent = config.guidance.targets["6c"].openedHint;
        entry.textContent = "测试工具 → 查看我的测试转化 → 本次测试订单 → 查看详情";
      } else if (step.id === "6c" && scene === "tests") {
        action.textContent = "在测试转化列表找到本次测试订单，打开详情核对项目、事件、订单数据与本次原生验证结果；数据不符先联系技术负责人。";
        entry.textContent = "测试转化列表 → 本次测试订单 → 查看详情；由有权人员核对本次测试结果";
      } else { action.textContent = step.action; entry.textContent = step.entry; }
    }

    function renderGuide() {
      cardSelect.value = guide.id;
      purpose.textContent = guide.purpose;
      applicable.textContent = guide.applicability;
      prerequisites.replaceChildren(...guide.prerequisites.map((text) => create("li", "", text)));
      stepSelect.replaceChildren(...guide.steps.map((item) => {
        const option = create("option", "", item.title);
        option.value = item.id;
        return option;
      }));
      renderStep();
    }

    function selectStep(index) {
      if (!Number.isInteger(index) || index < 0 || index >= sequence.length) return;
      const next = sequence[index];
      if (next.guide !== guide) preparation.open = false;
      stepIndex = index;
      guide = next.guide;
      step = next.step;
      if (step.mode === "information") {
        sceneWaitingFollow = false;
        sceneLoadingUntil = 0;
        if (journey?.status === "active") applyJourney("context-changed");
      }
      renderGuide();
    }

    function checkContext() {
      if (syncRoute()) { schedule(document.body); return false; }
      const changed = syncScene();
      if (contextActionInvalidated) { contextActionInvalidated = false; return false; }
      return !changed;
    }
    function close() {
      suppressPassiveOpen();
      sceneWaitingFollow = false;
      checkpointGeneration += 1;
      if (journey) applyJourney("close");
      hideArrow();
      view.hidden = true;
      settings.hidden = false;
      open.setAttribute("aria-expanded", "false");
      positionPanel();
    }
    function suppressPassiveOpen() {
      passiveOpenAllowed = false;
      passiveOpenGeneration += 1;
    }
    guidanceController = {
      close,
      hideArrow,
      updateArrow,
      observe: syncScene,
      suppressPassiveOpen,
      contextEpoch: () => contextEpoch,
      sceneId: () => observation?.sceneId || "unknown",
      reset(message = "记录已清空，请确认当前项目。", reason = "manual") {
        sceneWaitingFollow = false;
        hideArrow();
        declarations.clear();
        context.textContent = message;
        if (journeyContract) {
          checkpointGeneration += 1;
          if (reason === "path-entry" && journey?.status === "active") syncScene();
          else if (reason === "pagehide") {
            // Keep only a pending, expiring, passive note. The next document
            // must independently bind and can never revive this local state.
            journey = null;
            checkpointBound = false;
            sceneFrame = sceneDocument = null;
            checkpointNote = "页面已离开；旧定位与声明已清空。";
          } else {
            if (checkpointBound) void checkpoint("clear");
            journey = null;
            checkpointNote = message;
          }
          renderJourney();
        }
        selectStep(reason === "path-entry" ? suggestedStepIndex(location.pathname) : 0);
      }
    };
    listen(open, "click", () => {
      checkContext();
      passiveOpenAllowed = true;
      passiveOpenGeneration += 1;
      if (journey?.status === "closed") applyJourney("reopen");
      settings.hidden = true;
      view.hidden = false;
      open.setAttribute("aria-expanded", "true");
      positionPanel();
      back.focus();
    });
    listen(back, "click", () => { close(); open.focus(); });
    listen(previousStep, "click", () => { if (!checkContext()) return; selectStep(stepIndex - 1); });
    listen(nextStep, "click", () => { if (!checkContext()) return; selectStep(stepIndex + 1); });
    listen(cardSelect, "change", () => {
      if (!checkContext()) return;
      selectStep(Math.max(0, sequence.findIndex(item => item.guide.id === cardSelect.value)));
    });
    listen(stepSelect, "change", () => {
      if (!checkContext()) return;
      selectStep(Math.max(0, sequence.findIndex(item => item.guide === guide && item.step.id === stepSelect.value)));
    });
    listen(issueSelect, "change", () => { if (!checkContext()) return; showIssue(); });
    for (const [button, key] of [[read, "read"], [operated, "operated"]]) listen(button, "click", () => {
      if (!checkContext()) return;
      if (key === "operated" && step.mode === "information") return;
      const current = declarations.get(step.id) || {};
      current[key] = !current[key];
      declarations.set(step.id, current);
      updateDeclarations();
      positionPanel();
    });
    listen(reset, "click", () => { checkContext(); guidanceController.reset(); });
    listen(journeyStart, "click", () => {
      if (!checkContext() || observation.sceneId === "unknown" || step.mode === "information") return;
      passiveOpenAllowed = true;
      passiveOpenGeneration += 1;
      const requestedStep = step.id;
      checkpointGeneration += 1;
      checkpointNote = "";
      declarations.clear();
      applyJourney("start", { journeyId: crypto.randomUUID() });
      context.textContent = "已从当前页面开始连续指引；项目、操作与业务结果仍需你核对。";
      const selectedStep = requestedStep === "6c" && ["validation", "tool"].includes(observation.sceneId) ? "6c" : journey?.stepId;
      const index = sequence.findIndex(item => item.step.id === selectedStep);
      if (index >= 0) selectStep(index);
      if (!checkpointBound) void checkpoint("take");
      renderJourney();
    });
    listen(journeyContinue, "click", () => {
      if (!checkContext() || journey?.status !== "active" || !continueDestination()) return;
      applyJourney("continue", { toScene: continueDestination() });
      if (!journey?.pendingTransition) return;
      const index = sequence.findIndex(item => item.step.id === journeyContract.steps[journey.pendingTransition.to]);
      if (index >= 0) selectStep(index);
      arrowRequested = true;
      locate.setAttribute("aria-pressed", "true");
      updateArrow();
    });
    listen(document, "click", event => {
      if (!journeyContract) return;
      // A chosen menu item is the only observed Program-ID-bearing surface.
      // Capture before the native switch; no business identifier is persisted.
      if (event.composedPath().some(node => node?.matches?.('.programs-container .iui-mobile-menu-link:not(.selected),.accounts-container .iui-mobile-menu-link:not(.selected)'))) {
        invalidateJourney("已选择其他项目或账户，连续指引已暂停。请核对当前页面后重新开始。");
      }
    }, true);
    for (const details of [preparation, explanation, jump, directory, results]) listen(details, "toggle", positionPanel);
    syncScene();
    renderGuide();
    // Message listeners are registered by initialize before this microtask.
    if (journeyContract) void Promise.resolve().then(() => { if (!destroyed) return checkpoint("take"); });
    return true;
  }

  function buildAssistant() {
    if (!isTopFrame || config.assistant === false) return;
    assistant = create("aside", "impact-cn-assistant");
    assistant.id = "impact-cn-assistant";
    assistant.setAttribute("data-impact-cn-ignore", "");
    assistant.setAttribute("aria-label", "impact.com助手");
    const launcher = create("button", "impact-cn-launcher");
    launcher.type = "button";
    launcher.setAttribute("aria-expanded", "false");
    launcher.setAttribute("aria-controls", "impact-cn-assistant-panel");
    const icon = create("span", "impact-cn-launcher-icon", "译");
    icon.setAttribute("aria-hidden", "true");
    launcher.append(icon, create("span", "", "impact.com助手"), create("span", "impact-cn-launcher-dot"));
    const panel = create("section", "impact-cn-panel");
    panel.id = "impact-cn-assistant-panel";
    panel.hidden = true;
    const header = create("div", "impact-cn-panel-header");
    const title = create("div", "");
    title.append(create("strong", "impact-cn-panel-title", "impact.com助手"));
    assistantVersion = create("span", "impact-cn-panel-version");
    title.append(assistantVersion);
    const close = create("button", "impact-cn-close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "收起impact.com助手设置");
    header.append(title, close);
    const switchLabel = create("label", "impact-cn-switch-row");
    assistantToggle = create("input", "impact-cn-switch");
    assistantToggle.type = "checkbox";
    assistantToggle.dataset.impactCnSetting = "translation";
    assistantToggle.checked = enabled;
    switchLabel.append(create("span", "", "精细翻译"), assistantToggle);
    const aiSwitchLabel = create("label", "impact-cn-switch-row");
    assistantAIToggle = create("input", "impact-cn-ai-switch");
    assistantAIToggle.type = "checkbox";
    assistantAIToggle.dataset.impactCnSetting = "ai";
    assistantAIToggle.checked = aiEnabled;
    aiSwitchLabel.append(create("span", "", "AI辅助问题回答"), assistantAIToggle);
    const intro = create("p", "impact-cn-panel-intro", "两个开关独立生效。开启 AI 辅助后，点击术语旁的问号即可向原生 Ask Impact 提问。");
    assistantStatus = create("p", "impact-cn-status", "精细翻译与 AI 辅助已开启。");
    assistantStatus.setAttribute("role", "status");
    assistantStatus.setAttribute("aria-live", "polite");
    const note = create("p", "impact-cn-panel-note", "仅发送所选概念的解释模板；回复与官方文档引用由 Ask Impact 生成。");
    if (isDemo) note.textContent = "本页 AI 回答是演示数据；正式接入后由 Impact 页面 AI 生成。";
    const reset = create("button", "impact-cn-reset-position", "恢复默认位置");
    reset.type = "button";
    const settings = create("div", "impact-cn-assistant-settings");
    settings.append(switchLabel, aiSwitchLabel, intro, assistantStatus, note);
    panel.append(header, settings);
    buildGuidance(panel, settings);
    settings.append(reset);
    const launcherRow = create("div", "impact-cn-launcher-row");
    const dragHandle = create("button", "impact-cn-drag-handle", "⠿");
    dragHandle.type = "button";
    dragHandle.setAttribute("aria-label", "拖动impact.com助手");
    dragHandle.title = "拖动impact.com助手，也可用方向键移动";
    launcherRow.append(dragHandle, launcher);
    assistant.append(panel, launcherRow);
    document.body.append(assistant);
    const togglePanel = (open) => {
      if (!open) { guidanceController?.suppressPassiveOpen(); guidanceController?.hideArrow(); }
      panel.hidden = !open;
      launcher.setAttribute("aria-expanded", String(open));
      positionPanel();
    };
    listen(launcher, "click", () => togglePanel(panel.hidden));
    listen(close, "click", () => togglePanel(false));
    listen(assistantToggle, "change", () => { void setEnabled(assistantToggle.checked); });
    listen(assistantAIToggle, "change", () => { void setAIEnabled(assistantAIToggle.checked); });
    listen(reset, "click", resetPosition);
    setupDragging(dragHandle);
    listen(assistant, "keydown", (event) => {
      if (event.key === "Escape") { togglePanel(false); launcher.focus(); }
    });
  }

  function aiRoots() {
    if (translationOnly) return [];
    const selectors = config.ai?.rootSelectors || [];
    if (!isImpactSite || !selectors.length) return [document];
    const roots = new Set();
    for (const selector of selectors) {
      try { for (const root of deepQueryAll(document, selector)) roots.add(root); } catch { /* Invalid adapter selector. */ }
    }
    return [...roots];
  }

  function queryVisible(selectors) {
    const roots = aiRoots();
    for (const selector of selectors) {
      let matches;
      try {
        const found = new Set();
        for (const root of roots) for (const element of deepQueryAll(root, selector)) found.add(element);
        matches = [...found].filter(controlVisible);
      } catch { /* Invalid site configuration must not break page localization. */ }
      if (matches?.length > 1) throw new Error("AI 控件选择器匹配多个可见元素。请限定到对应 AI 容器后重试。");
      if (matches?.length === 1) return matches[0];
    }
    return null;
  }

  function controlVisible(element) {
    if (!element.isConnected || composedClosest(element, "#impact-cn-assistant") || !element.getClientRects().length) return false;
    const visibility = getComputedStyle(element).visibility;
    if (visibility === "hidden" || visibility === "collapse") return false;
    // A closed drawer may keep its editor mounted and move it offscreen. Also
    // inspect composed ancestors: the editor's own style can still be visible.
    for (let ancestor = element; ancestor; ancestor = composedParent(ancestor)) {
      if (ancestor.hidden || ancestor.inert || ancestor.getAttribute("aria-hidden") === "true") return false;
      const style = getComputedStyle(ancestor);
      // Visibility is inherited but can be overridden by a visible descendant
      // (for example a portal). Opacity/display suppress the whole subtree.
      if (style.display === "none" || Number(style.opacity) === 0) return false;
    }
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.right > 0 && rect.bottom > 0 && rect.left < innerWidth && rect.top < innerHeight;
  }

  function readAIPlacement() {
    try {
      const opener = queryVisible(["[data-impact-ai-open]", ...(config.ai?.openerSelectors || [])]);
      const active = !(config.ai?.openerIndicatesClosed && opener) && Boolean(queryVisible(["[data-impact-ai-input]", ...(config.ai?.inputSelectors || [])]));
      const overlay = (config.assistantAvoidSelectors || []).some((selector) => deepQueryAll(document, selector).some(controlVisible));
      return { active, overlay, bottom: opener ? Math.max(140, innerHeight - opener.getBoundingClientRect().top + 24) : 140 };
    } catch { return { active: false, overlay: false, bottom: 140 }; }
  }

  function scheduleAIPlacement() {
    if (destroyed || aiPlacementTimer) return;
    aiPlacementTimer = setTimeout(() => {
      aiPlacementTimer = undefined;
      if (destroyed || !assistant) return;
      const placement = readAIPlacement();
      if (`${placement.active}:${placement.bottom}:${placement.overlay}` !== lastAIPlacementKey) syncAssistantPlacement(placement);
    }, 32);
  }

  function discoverAIPlacementRoots() {
    if (translationOnly) return;
    const roots = new Set();
    const visit = (root) => {
      roots.add(root);
      if (root.shadowRoot) visit(root.shadowRoot);
      for (const element of root.querySelectorAll("*")) if (element.shadowRoot) visit(element.shadowRoot);
    };
    for (const root of aiRoots()) visit(root instanceof Document ? root.body : root);
    for (const [root, record] of aiPlacementRoots) {
      if (!roots.has(root) || !root.isConnected) {
        record.observer.disconnect();
        root.removeEventListener("transitionend", scheduleAIPlacement, true);
        root.removeEventListener("animationend", scheduleAIPlacement, true);
        aiPlacementRoots.delete(root);
      }
    }
    for (const root of roots) {
      if (aiPlacementRoots.has(root)) continue;
      // This observer deliberately never schedules translation. Native answers
      // remain untouched, and hover classes only cause a small visibility read.
      const observer = new MutationObserver(scheduleAIPlacement);
      observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "style", "hidden", "aria-hidden", "inert"] });
      root.addEventListener("transitionend", scheduleAIPlacement, true);
      root.addEventListener("animationend", scheduleAIPlacement, true);
      aiPlacementRoots.set(root, { observer });
      scheduleAIPlacement();
    }
  }

  function findAI() {
    const ai = config.ai || {};
    const input = queryVisible(["[data-impact-ai-input]", ...(ai.inputSelectors || [])]);
    const send = queryVisible(["[data-impact-ai-send]", ...(ai.sendSelectors || [])]);
    return { input, send };
  }

  function findReadyAI() {
    // Ask Impact reveals its opener before the old editor's closing animation
    // has finished. Geometry alone cannot identify that old instance as ready.
    if (config.ai?.openerIndicatesClosed && queryVisible(["[data-impact-ai-open]", ...(config.ai?.openerSelectors || [])])) return { input: null, send: null };
    return findAI();
  }

  function syncAssistantPlacement(placement = readAIPlacement()) {
    if (!assistant) return;
    lastAIPlacementKey = `${placement.active}:${placement.bottom}:${placement.overlay}`;
    assistant.dataset.aiActive = String(placement.active);
    assistant.dataset.nativeOverlay = String(Boolean(placement.overlay));
    if (!userPositioned) assistant.style.bottom = `${placement.bottom}px`;
    if (userPositioned) clampAssistantPosition();
    positionPanel();
  }

  function positionPanel() {
    const panel = assistant?.querySelector("#impact-cn-assistant-panel");
    if (!panel || panel.hidden) return;
    const rect = assistant.getBoundingClientRect();
    const width = Math.min(300, innerWidth - 16);
    assistant.dataset.panelAlign = rect.right - width >= 8 ? "right" : "left";
    // The launcher can be narrower than its card. Aligning only to a launcher
    // edge can push the card outside a narrow viewport, so clamp the card itself.
    panel.style.left = `${Math.max(8, Math.min(innerWidth - width - 8, rect.right - width)) - rect.left}px`;
    panel.style.right = "auto";
    const above = Math.max(0, rect.top - 20);
    const below = Math.max(0, innerHeight - rect.bottom - 20);
    const side = above >= Math.min(panel.scrollHeight, 350) || above >= below ? "above" : "below";
    assistant.dataset.panelSide = side;
    panel.style.maxHeight = `${Math.max(40, side === "above" ? above : below)}px`;
    guidanceController?.updateArrow();
  }

  function setAssistantPosition(x, y) {
    if (!assistant) return;
    const rect = assistant.getBoundingClientRect();
    const margin = 8;
    const maxX = Math.max(margin, innerWidth - rect.width - margin);
    const maxY = Math.max(margin, innerHeight - rect.height - margin);
    assistantPosition = { x: Math.max(margin, Math.min(maxX, x)), y: Math.max(margin, Math.min(maxY, y)) };
    userPositioned = true;
    assistant.dataset.userPositioned = "true";
    assistant.style.left = `${assistantPosition.x}px`;
    assistant.style.top = `${assistantPosition.y}px`;
    assistant.style.right = "auto";
    assistant.style.bottom = "auto";
    positionPanel();
  }

  function clampAssistantPosition() {
    if (assistantPosition) setAssistantPosition(assistantPosition.x, assistantPosition.y);
  }

  function resetPosition() {
    userPositioned = false;
    assistantPosition = null;
    dragState = null;
    if (assistant) {
      assistant.dataset.userPositioned = "false";
      for (const property of ["left", "top", "right", "bottom"]) assistant.style.removeProperty(property);
      syncAssistantPlacement();
    }
    return getState();
  }

  function setupDragging(handle) {
    listen(handle, "pointerdown", (event) => {
      if (event.button !== 0 || !event.isPrimary) return;
      const rect = assistant.getBoundingClientRect();
      dragState = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x: rect.left, y: rect.top, moved: false };
      handle.setPointerCapture(event.pointerId);
      handle.focus({ preventScroll: true });
      event.preventDefault(); event.stopPropagation();
    });
    listen(handle, "pointermove", (event) => {
      if (!dragState || dragState.pointerId !== event.pointerId) return;
      const dx = event.clientX - dragState.startX;
      const dy = event.clientY - dragState.startY;
      if (!dragState.moved && Math.hypot(dx, dy) < 6) return;
      dragState.moved = true;
      assistant.dataset.dragging = "true";
      event.preventDefault(); event.stopPropagation();
      setAssistantPosition(dragState.x + dx, dragState.y + dy);
    });
    const finish = (event) => {
      if (!dragState || dragState.pointerId !== event.pointerId) return;
      const pointerId = dragState.pointerId;
      dragState = null;
      assistant.dataset.dragging = "false";
      if (handle.hasPointerCapture(pointerId)) handle.releasePointerCapture(pointerId);
      event.preventDefault(); event.stopPropagation();
    };
    listen(handle, "pointerup", finish);
    listen(handle, "pointercancel", finish);
    listen(handle, "lostpointercapture", () => { dragState = null; if (assistant) assistant.dataset.dragging = "false"; });
    listen(handle, "click", (event) => { event.preventDefault(); event.stopPropagation(); });
    listen(handle, "keydown", (event) => {
      const offsets = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      if (!offsets[event.key]) return;
      event.preventDefault(); event.stopPropagation();
      const rect = assistant.getBoundingClientRect();
      const step = event.shiftKey ? 40 : 10;
      setAssistantPosition(rect.left + offsets[event.key][0] * step, rect.top + offsets[event.key][1] * step);
    });
  }

  function collapseAssistant() {
    const panel = assistant?.querySelector("#impact-cn-assistant-panel");
    if (panel) panel.hidden = true;
    assistant?.querySelector(".impact-cn-launcher")?.setAttribute("aria-expanded", "false");
  }

  function draftText(input) {
    if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) return input.value;
    return input.isContentEditable ? input.textContent : null;
  }

  function writeInput(input, value) {
    if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
      const prototype = input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;
      if (!setter) throw new Error("无法获取 AI 输入框原生赋值接口。");
      setter.call(input, value);
    } else if (input.isContentEditable) {
      // The draft must be empty. Add a text node without recreating the editor DOM.
      const walker = document.createTreeWalker(input, NodeFilter.SHOW_TEXT);
      let whitespace;
      while ((whitespace = walker.nextNode())) {
        if (!whitespace.nodeValue.trim()) whitespace.nodeValue = "";
      }
      const textNode = document.createTextNode(value);
      input.append(textNode);
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(input);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    } else throw new Error("选中的 AI 控件不是支持的文本输入框。");
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    input.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }

  function waitFor(check, timeout = 2000, isActive = () => !destroyed && aiEnabled) {
    const start = Date.now();
    return new Promise((resolve, reject) => {
      const poll = () => {
        if (!isActive()) return resolve(null);
        try {
          const value = check();
          if (value || Date.now() - start >= timeout) resolve(value || null);
          else setTimeout(poll, 50);
        } catch (error) { reject(error); }
      };
      poll();
    });
  }

  async function askTopic(id, sourceRequestId = null) {
    if (translationOnly) return { ok: false, reason: "translation-only" };
    if (busy || destroyed) return { ok: false, reason: busy ? "busy" : "destroyed" };
    if (!aiEnabled) { setStatus("AI辅助问题回答已关闭，请先开启后再提问。", "warning"); return { ok: false, reason: "ai-disabled" }; }
    const topic = dictionary.helpTopics?.find((item) => item.id === id);
    if (!topic) { setStatus("未找到该功能的问题配置。", "error"); return { ok: false, reason: "unknown-topic" }; }
    const requestGeneration = aiGeneration;
    const requestNavigation = navigationGeneration;
    const requestRoute = location.pathname + location.search + location.hash;
    let pageChanged = false;
    const requestActive = () => {
      // Native navigation events record even an away-and-back within one tick.
      // The URL comparison remains a fallback for unsupported event surfaces.
      if (navigationGeneration !== requestNavigation
          || location.pathname + location.search + location.hash !== requestRoute) pageChanged = true;
      return !destroyed && aiEnabled && aiGeneration === requestGeneration && !pageChanged;
    };
    if (!isTopFrame) {
      if (!inExtension || !runtime?.sendMessage) return { ok: false, reason: "top-ai-bridge-unavailable" };
      const frameRequest = { topicId: id, isActive: requestActive };
      activeFrameRequest = frameRequest;
      busy = true;
      for (const record of helpButtons.values()) record.button.disabled = true;
      try {
        return await runtime.sendMessage({ type: "impact-cn:frame-ask-topic", topicId: id });
      } catch {
        return { ok: false, reason: "top-ai-bridge-unavailable" };
      } finally {
        if (activeFrameRequest === frameRequest) activeFrameRequest = undefined;
        busy = false;
        for (const record of helpButtons.values()) record.button.disabled = false;
        emitState();
      }
    }
    let sourceInactive = false;
    const confirmSource = async () => {
      if (!requestActive()) return false;
      if (!sourceRequestId) return true;
      try {
        const result = await runtime.sendMessage({ type: "impact-cn:confirm-source-request", sourceRequestId });
        if (result?.active !== true) sourceInactive = true;
      } catch { sourceInactive = true; }
      return requestActive() && !sourceInactive;
    };
    let draftFilled = false;
    const cancelled = () => {
      if (!pageChanged && !sourceInactive) {
        try { findReadyAI().input?.focus(); } catch { /* Preserve an ambiguous draft without focusing it. */ }
      }
      if (!destroyed) {
        const message = sourceInactive
          ? (draftFilled ? "来源页面已切换或无法确认，本次自动发送已取消；已填入的草稿保留在原生 AI 中。" : "来源页面已切换或无法确认，本次提问已取消。")
          : pageChanged
          ? (draftFilled ? "页面已切换，本次自动发送已取消；已填入的草稿保留在原生 AI 中，请检查后手动发送。" : "页面已切换，本次提问已取消；返回原页面也不会自动发送。")
          : aiEnabled
          ? (draftFilled ? "AI辅助已重新开启，但上一次自动发送已取消；草稿保留在原生 AI 中，请检查后手动发送。" : "AI辅助已重新开启，上一次已取消的问题不会自动发送。")
          : (draftFilled ? "AI辅助已关闭，本次自动发送已停止；已填入的草稿保留在原生 AI 中。" : "AI辅助已关闭，本次提问已取消。 ");
        setStatus(message, "warning");
      }
      return { ok: false, reason: sourceInactive ? "source-frame-inactive" : pageChanged ? "page-changed" : "ai-disabled", ...(draftFilled ? { filled: true } : {}) };
    };
    busy = true;
    assistant?.setAttribute("aria-busy", "true");
    for (const record of helpButtons.values()) record.button.disabled = true;
    try {
      // Finish the originating outside interaction before opening native AI.
      // A site's capture listener may have queued a drawer dismissal before our
      // inline button stopped propagation; nested opener.click() would race it.
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (!requestActive()) return cancelled();
      let controls = findAI();
      const openerSelectors = ["[data-impact-ai-open]", ...(config.ai?.openerSelectors || [])];
      let opener = queryVisible(openerSelectors);
      const openingDeadline = Date.now() + (config.ai?.openTimeoutMs ?? 10000);
      const openingTimeLeft = () => Math.max(0, openingDeadline - Date.now());
      if (config.ai?.openerIndicatesClosed && opener && controls.input) {
        setStatus("正在等待原生 AI 完成关闭，再打开新的输入框。", "info");
        const settled = await waitFor(() => {
          const current = findAI();
          const currentOpener = queryVisible(openerSelectors);
          // If the user already reopened it, respect that state without another
          // opener click. Otherwise wait until the closing editor is gone.
          return !current.input || !currentOpener ? { controls: current, opener: currentOpener } : null;
        }, openingTimeLeft(), requestActive);
        if (!requestActive()) return cancelled();
        if (!settled) throw new Error("原生 AI 尚未完成关闭，请等窗口关闭后再选择问题；已有草稿未改动。");
        controls = settled.controls;
        opener = settled.opener;
      }
      if (!controls.input || (config.ai?.openerIndicatesClosed && opener)) {
        opener = queryVisible(openerSelectors);
        if (opener && !opener.disabled && opener.getAttribute("aria-disabled") !== "true") opener.click();
        controls = await waitFor(() => { const found = findReadyAI(); return found.input ? found : null; }, openingTimeLeft(), requestActive) || {};
      }
      if (!requestActive()) return cancelled();
      if (!await confirmSource()) return cancelled();
      // The source confirmation can yield while the native editor re-renders.
      const input = findReadyAI().input;
      if (!input) throw new Error("暂未找到可用的 Ask Impact 输入框。请确认原生 AI 已打开，或检查站点适配配置。");
      const existing = draftText(input);
      if (existing === null) throw new Error("选中的 AI 控件不是支持的文本输入框。");
      if (existing.trim()) {
        input.focus();
        setStatus("AI 输入框已有草稿，请先发送或清空后再选择预设问题。", "warning");
        return { ok: false, reason: "draft-exists" };
      }
      if (input.disabled || input.readOnly || input.getAttribute("aria-disabled") === "true") throw new Error("页面 AI 输入框当前不可用，请稍后重试。");
      let officialUrl;
      try { officialUrl = new URL(topic.helpUrl); } catch { throw new Error("该问题缺少有效的官方帮助文档链接。"); }
      if (officialUrl.protocol !== "https:" || !/(^|\.)impact\.com$/i.test(officialUrl.hostname)) throw new Error("帮助链接需要指向 Impact 官方 HTTPS 网站。");
      const prompt = `${topic.question}\n\n请只解释以上选中的概念，不展开整页。仅解释固定定义和明确标为假设的示例；不要查询、引用或推断当前账户的合同数量、金额、日期、状态等业务数据。请用简体中文按以下固定模板回答：\n1. 一句话解释。\n2. 一个联盟营销场景中的具体例子。\n3. 指标口径或常见误解；如果不是指标，请解释容易混淆的概念。\n4. 当前页面中如何使用或解读；无法确认实际配置时明确说明，不编造数据或操作结果。\n5. 官方帮助链接：请明确引用 ${officialUrl.href}。`;
      input.focus();
      if (!requestActive()) return cancelled();
      if (findReadyAI().input !== input || draftText(input)?.trim()) throw new Error("页面 AI 输入框或草稿在填入前发生变化，已停止自动发送；已有草稿未改动。");
      writeInput(input, prompt);
      draftFilled = true;
      setStatus("问题已填入，正在等待页面 AI 的发送按钮。", "info");
      const send = await waitFor(() => {
        const button = findReadyAI().send;
        return button && !button.disabled && button.getAttribute("aria-disabled") !== "true" ? button : null;
      }, config.ai?.sendTimeoutMs ?? 5000, requestActive);
      if (!requestActive()) return cancelled();
      if (!send) {
        try { findReadyAI().input?.focus(); } catch { /* Ambiguous controls must never be focused. */ }
        setStatus("问题已填入，发送按钮尚未就绪。请在页面 AI 中手动发送；草稿已保留。", "warning");
        return { ok: false, reason: "send-unavailable", filled: true };
      }
      if (!await confirmSource()) return cancelled();
      // Recheck both controls after the asynchronous source confirmation.
      const current = findReadyAI();
      if (!current.input || draftText(current.input) !== prompt) throw new Error("页面 AI 草稿在发送前发生变化，已停止自动发送。请检查输入框。 ");
      if (current.input.disabled || current.input.readOnly || current.input.getAttribute("aria-disabled") === "true"
          || !current.send || current.send.disabled || current.send.getAttribute("aria-disabled") === "true") {
        setStatus("页面 AI 发送按钮已变化，本次自动发送已停止；草稿已保留。", "warning");
        return { ok: false, reason: "send-unavailable", filled: true };
      }
      if (!requestActive()) return cancelled();
      current.send.click();
      setStatus("已触发页面 AI 发送。请在回答区域核对解释和官方帮助链接。", "success");
      collapseAssistant();
      return { ok: true, topicId: id, prompt, helpUrl: officialUrl.href };
    } catch (error) {
      try { findReadyAI().input?.focus(); } catch { /* Ambiguous controls must never be focused. */ }
      setStatus(error.message || "无法发送问题，请检查页面 AI 配置。", "error");
      return { ok: false, reason: "configuration-or-page-error", message: error.message };
    } finally {
      busy = false;
      assistant?.removeAttribute("aria-busy");
      for (const record of helpButtons.values()) record.button.disabled = false;
      emitState();
    }
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    enabled = false;
    aiEnabled = false;
    clearGuideFrameProbe();
    guidanceController?.hideArrow();
    for (const observer of observedRoots.values()) observer.disconnect();
    observedRoots.clear();
    restoreContractTimingLayout();
    for (const [root, record] of aiPlacementRoots) {
      record.observer.disconnect();
      root.removeEventListener("transitionend", scheduleAIPlacement, true);
      root.removeEventListener("animationend", scheduleAIPlacement, true);
    }
    aiPlacementRoots.clear();
    clearTimeout(flushTimer);
    clearTimeout(aiPlacementTimer);
    clearInterval(routeTimer);
    for (const node of [...translatedNodes.keys()]) release(node, true);
    for (const anchor of [...helpButtons.keys()]) removeHelpButton(anchor);
    for (const style of helpStyles.values()) style.remove();
    helpStyles.clear();
    for (const remove of listeners) remove();
    guidanceController = undefined;
    assistant?.remove();
    if (inExtension && runtime.onMessage) runtime.onMessage.removeListener(onMessage);
    if (inExtension && chrome.storage?.onChanged) chrome.storage.onChanged.removeListener(onStorageChanged);
    document.dispatchEvent(new CustomEvent("impact-cn:state", { detail: { enabled: false, aiEnabled: false, translatedCount: 0, version: dictionary.version, destroyed: true } }));
  }

  function topicAllowedOnTop(id) {
    const topic = dictionary.helpTopics?.find((item) => item.id === id);
    if (!topic || location.protocol !== "https:") return false;
    const query = new URLSearchParams(location.search);
    return (dictionary.entries || []).some((entry) => {
      const scope = entry.scope;
      if (!topic.entryIds?.includes(entry.id) || (entry.helpTopicId && entry.helpTopicId !== id)
        || !scope || typeof scope !== "object" || !scope.pathExact || !scope.hosts?.includes(location.hostname)
        || !scope.topPaths?.includes(location.pathname)) return false;
      return Object.entries(scope.topQuery || {}).every(([key, value]) => query.getAll(key).length === 1 && query.get(key) === String(value));
    });
  }

  function onMessage(message, _sender, sendResponse) {
    const guideHandled = guideAssetMessage(message, _sender, sendResponse);
    if (guideHandled !== null) return guideHandled;
    if (message?.type === "impact-cn:journey-current-context" && _sender?.id === runtime?.id && isTopFrame) {
      guidanceController?.observe();
      const epoch = guidanceController?.contextEpoch();
      sendResponse({ active: !destroyed && epoch === message.contextEpoch, contextEpoch: epoch, sceneId: guidanceController?.sceneId() || "unknown" });
      return false;
    }
    if (message?.type === "impact-cn:confirm-frame-request" && _sender?.id === runtime?.id) {
      sendResponse({ active: Boolean(!isTopFrame && activeFrameRequest && activeFrameRequest.topicId === message.topicId && activeFrameRequest.isActive()) });
      return false;
    }
    // Only the top document owns popup controls and native Ask Impact. Child
    // documents follow storage changes and request AI via the extension worker.
    if (!isTopFrame) return false;
    if (message?.type === "impact-cn:top-ask-topic" && _sender?.id === runtime?.id) {
      // Recheck this document after worker dispatch: the tab may have navigated.
      // Direct inline helpers retain their existing full element-scope checks.
      if (!topicAllowedOnTop(message.topicId)) {
        sendResponse({ ok: false, reason: "topic-out-of-scope" });
        return false;
      }
      if (typeof message.sourceRequestId !== "string" || !/^frame-\d{1,12}$/u.test(message.sourceRequestId)) {
        sendResponse({ ok: false, reason: "invalid-source-request" });
        return false;
      }
      void askTopic(message.topicId, message.sourceRequestId).then((result) => sendResponse({ ok: result.ok, reason: result.reason, topicId: result.topicId, message: result.message }));
      return true;
    }
    if (message?.type === settingsContract.messages.getState) { sendResponse(getState()); return false; }
    if (message?.type === settingsContract.messages.setEnabled) {
      void setEnabled(message.enabled).then(sendResponse);
      return true;
    }
    if (message?.type === settingsContract.messages.setAIEnabled) {
      void setAIEnabled(message.aiEnabled ?? message.enabled).then(sendResponse);
      return true;
    }
    return false;
  }

  async function initialize() {
    if (isChecklistAsset) {
      await verifyChecklistAssetContext(false);
      if (destroyed) return;
    }
    else if (!isTopFrame && (isChecklistReview
        || Object.hasOwn(checklistConfig.documentRoots || {}, location.pathname)
        || Object.hasOwn(checklistConfig.sharedDocumentRoots || {}, location.pathname))) checklistParentAllowed = Boolean(checklistFrameContext());
    if (inExtension && chrome.storage?.local) {
      try {
        const values = await chrome.storage.local.get(Object.values(settingsContract.keys));
        if (destroyed) return;
        const stored = settingsContract.decodeStored(values);
        enabled = stored.enabled;
        aiEnabled = stored.aiEnabled;
      } catch {
        if (destroyed) return;
        lastError = "无法读取浏览器设置，已使用默认开启状态。";
      }
    }
    if (destroyed) return;
    buildAssistant();
    discoverShadowRoots();
    const navigationChanged = () => { clearGuideFrameProbe(); guidanceController?.hideArrow(); navigationGeneration += 1; schedule(document.body); };
    if (window.navigation?.addEventListener) listen(window.navigation, "navigate", (event) => {
      // A same-URL history state update can belong to opening a native drawer.
      // Only route changes or document navigation invalidate its question.
      if (event.destination?.url !== location.href || event.destination?.sameDocument !== true) navigationChanged();
    });
    listen(window, "popstate", navigationChanged);
    listen(window, "hashchange", navigationChanged);
    listen(window, "pagehide", () => {
      clearGuideFrameProbe();
      // Consume a pending route before clearing so a later flush cannot reselect a tool step.
      syncRoute();
      guidanceController?.reset("记录已清空，请确认当前项目。", "pagehide");
      navigationChanged();
    });
    listen(window, "resize", () => { if (userPositioned) clampAssistantPosition(); else syncAssistantPlacement(); });
    routeTimer = setInterval(() => {
      if (isChecklistAsset) void verifyChecklistAssetContext();
      else if (!isTopFrame && (isChecklistReview
          || Object.hasOwn(checklistConfig.documentRoots || {}, location.pathname)
          || Object.hasOwn(checklistConfig.sharedDocumentRoots || {}, location.pathname))) {
        const allowed = Boolean(checklistFrameContext());
        if (allowed !== checklistParentAllowed) { checklistParentAllowed = allowed; schedule(document.body); }
      }
      if (route !== location.pathname + location.search) schedule(document.body);
      guidanceController?.observe();
      discoverShadowRoots();
      if (!translationOnly) syncAssistantPlacement();
    }, 1000);
    if (inExtension && runtime.onMessage) runtime.onMessage.addListener(onMessage);
    if (inExtension && chrome.storage?.onChanged) chrome.storage.onChanged.addListener(onStorageChanged);
    refresh();
    if (!enabled || !aiEnabled) setStatus(`精细翻译：${enabled ? "开启" : "暂停"}；AI辅助问题回答：${aiEnabled ? "开启" : "关闭"}。`, "info");
    if (!index.size && !prefixEntries.length && !suffixEntries.length && !numericTemplates.length) setStatus("未加载汉化词典，请检查 dict.js 是否先于 content.js 加载。", "error");
    else if (lastError) setStatus(lastError, "error");
    return getState();
  }

  const api = { ready: null, setEnabled, setAIEnabled, getState, refresh, destroy, askTopic, resetPosition };
  globalThis.ImpactCN = api;
  api.ready = initialize();
})();

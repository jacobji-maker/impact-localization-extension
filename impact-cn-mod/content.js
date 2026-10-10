/* Impact CN: exact text-node localization; no DOM reconstruction. */
(() => {
  "use strict";

  const isDemo = document.body?.hasAttribute("data-impact-cn-demo");
  const isImpactSite = ["app.impact.com", "demo.impact.com"].includes(location.hostname);
  if (!isImpactSite && !isDemo) return;
  if (globalThis.ImpactCN?.ready) return;

  const dictionary = globalThis.IMPACT_CN_DICTIONARY || { version: "unknown", entries: [], helpTopics: [] };
  const config = globalThis.IMPACT_CN_CONFIG || {};
  const runtime = globalThis.chrome?.runtime;
  const inExtension = Boolean(runtime?.id);
  const isTopFrame = window === window.top;
  const storageKey = "impactCNEnabled";
  const aiStorageKey = "impactCNAIEnabled";
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
  const inlineHelpCSS = `button.impact-cn-inline-help[data-impact-cn-ignore]{all:initial;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;width:16px;height:16px;margin-left:6px;border:1px solid #b9cbc4;border-radius:50%;background:#f4faf7;color:#456b5b;font:600 11px/1 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",sans-serif;vertical-align:middle;cursor:pointer;flex-shrink:0}button.impact-cn-inline-help[data-impact-cn-ignore]::before{content:"?"}button.impact-cn-inline-help[data-impact-cn-ignore]:hover{background:#deeee5;color:#153d2e;border-color:#7fae97}button.impact-cn-inline-help[data-impact-cn-ignore]:focus-visible{outline:2px solid #438969;outline-offset:2px}button.impact-cn-inline-help[data-impact-cn-ignore]:disabled{opacity:.55;cursor:wait}`;
  const listeners = [];
  const normalize = (text) => text.trim().replace(/\s+/gu, " ");
  // An option without an explicit value derives its submitted value from text.
  const skipSelector = "script,style,noscript,textarea,input,code,pre,option:not([value]),[contenteditable]:not([contenteditable='false']),[data-impact-cn-ignore],[data-impact-user-content],[data-impact-ai-messages],#impact-cn-assistant";
  let enabled = true;
  let aiEnabled = true;
  // Closing AI invalidates an unsent request permanently, even if reopened
  // before its next polling tick. Reopening only allows new requests.
  let aiGeneration = 0;
  let destroyed = false;
  let flushTimer;
  let route = location.pathname + location.search;
  let busy = false;
  let assistant;
  let assistantStatus;
  let assistantToggle;
  let assistantAIToggle;
  let assistantVersion;
  let dragState;
  let userPositioned = false;
  let assistantPosition = null;
  let routeTimer;
  let aiPlacementTimer;
  let lastAIPlacementKey;
  let lastError = "";

  for (const entry of dictionary.entries || []) {
    if (typeof entry.source !== "string" || typeof entry.target !== "string" || !entry.target.trim()) continue;
    if (entry.match === "numeric-template") {
      const scope = entry.scope;
      if (!scope || typeof scope !== "object" || !scope.selector || !(scope.pathExact || scope.path || scope.paths?.length) || !scope.hosts?.length) continue;
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
      if (!scope || typeof scope !== "object" || !scope.selector || !(scope.path || scope.pathExact || scope.paths?.length) || !scope.hosts?.length) continue;
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
    return Number(Boolean(scope.pathExact)) * 100 + Number(Boolean(scope.topPaths)) * 40
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
    if (!isImpactSite) return true;
    if ((config.localization?.financePaths || []).some((path) => location.pathname.startsWith(path))) return true;
    const roots = config.localization?.rootSelectors || [];
    if (!roots.length) return true;
    return roots.some((selector) => {
      try { return Boolean(composedClosest(element, selector)); } catch { return false; }
    });
  }

  function scopeMatches(entry, element) {
    if (!entry.scope) return true;
    const scope = typeof entry.scope === "string" ? { selector: entry.scope } : entry.scope;
    if (scope.hosts && !scope.hosts.includes(location.hostname)) return false;
    if (scope.path && !location.pathname.startsWith(scope.path)) return false;
    if (scope.paths && !scope.paths.some((path) => location.pathname.startsWith(path))) return false;
    if (scope.pathExact && location.pathname !== scope.pathExact) return false;
    const queryMatches = (expected, search) => {
      const query = new URLSearchParams(search);
      return Object.entries(expected || {}).every(([key, value]) => query.getAll(key).length === 1 && query.get(key) === String(value));
    };
    if (scope.query && !queryMatches(scope.query, location.search)) return false;
    try {
      if (scope.topPaths || scope.topQuery) {
        if (window.top.location.origin !== location.origin) return false;
        if (scope.topPaths && !scope.topPaths.includes(window.top.location.pathname)) return false;
        if (scope.topQuery && !queryMatches(scope.topQuery, window.top.location.search)) return false;
      }
      if (scope.topOnly === true && window !== window.top) return false;
      if (scope.lightDOMOnly === true && element.getRootNode() !== document) return false;
      if (scope.shadowHost) {
        let root = element.getRootNode();
        let matched = false;
        while (root instanceof ShadowRoot) {
          if (root.host.matches(scope.shadowHost)) { matched = true; break; }
          root = root.host.getRootNode();
        }
        if (!matched) return false;
      }
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
    if (!topic || !aiEnabled) { removeHelpForNode(node); return; }
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

  function flush() {
    flushTimer = undefined;
    if (destroyed) return;
    if (route !== location.pathname + location.search) {
      route = location.pathname + location.search;
      pendingRoots.clear();
      pendingRoots.add(document.body);
    }
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
        if (mutation.type === "attributes") { schedule(mutation.target); continue; }
        if (skipped(mutation.target)) continue;
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
    const settings = {};
    if (changes[storageKey] && (changes[storageKey].newValue !== false) !== enabled) settings.enabled = changes[storageKey].newValue !== false;
    if (changes[aiStorageKey] && (changes[aiStorageKey].newValue !== false) !== aiEnabled) settings.aiEnabled = changes[aiStorageKey].newValue !== false;
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

  function buildAssistant() {
    if (!isTopFrame || config.assistant === false) return;
    assistant = create("aside", "impact-cn-assistant");
    assistant.id = "impact-cn-assistant";
    assistant.setAttribute("data-impact-cn-ignore", "");
    assistant.setAttribute("aria-label", "汉化助手");
    const launcher = create("button", "impact-cn-launcher");
    launcher.type = "button";
    launcher.setAttribute("aria-expanded", "false");
    launcher.setAttribute("aria-controls", "impact-cn-assistant-panel");
    const icon = create("span", "impact-cn-launcher-icon", "译");
    icon.setAttribute("aria-hidden", "true");
    launcher.append(icon, create("span", "", "汉化助手"), create("span", "impact-cn-launcher-dot"));
    const panel = create("section", "impact-cn-panel");
    panel.id = "impact-cn-assistant-panel";
    panel.hidden = true;
    const header = create("div", "impact-cn-panel-header");
    const title = create("div", "");
    title.append(create("strong", "impact-cn-panel-title", "汉化助手"));
    assistantVersion = create("span", "impact-cn-panel-version");
    title.append(assistantVersion);
    const close = create("button", "impact-cn-close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "收起汉化助手设置");
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
    panel.append(header, switchLabel, aiSwitchLabel, intro, assistantStatus, note, reset);
    const launcherRow = create("div", "impact-cn-launcher-row");
    const dragHandle = create("button", "impact-cn-drag-handle", "⠿");
    dragHandle.type = "button";
    dragHandle.setAttribute("aria-label", "拖动汉化助手");
    dragHandle.title = "拖动汉化助手，也可用方向键移动";
    launcherRow.append(dragHandle, launcher);
    assistant.append(panel, launcherRow);
    document.body.append(assistant);
    const togglePanel = (open) => {
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
    assistant.dataset.panelAlign = rect.right - Math.min(300, innerWidth - 16) >= 8 ? "right" : "left";
    const above = Math.max(0, rect.top - 20);
    const below = Math.max(0, innerHeight - rect.bottom - 20);
    const side = above >= Math.min(panel.scrollHeight, 350) || above >= below ? "above" : "below";
    assistant.dataset.panelSide = side;
    panel.style.maxHeight = `${Math.max(40, side === "above" ? above : below)}px`;
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

  async function askTopic(id) {
    if (busy || destroyed) return { ok: false, reason: busy ? "busy" : "destroyed" };
    if (!aiEnabled) { setStatus("AI辅助问题回答已关闭，请先开启后再提问。", "warning"); return { ok: false, reason: "ai-disabled" }; }
    const topic = dictionary.helpTopics?.find((item) => item.id === id);
    if (!topic) { setStatus("未找到该功能的问题配置。", "error"); return { ok: false, reason: "unknown-topic" }; }
    if (!isTopFrame) {
      if (!inExtension || !runtime?.sendMessage) return { ok: false, reason: "top-ai-bridge-unavailable" };
      busy = true;
      for (const record of helpButtons.values()) record.button.disabled = true;
      try {
        return await runtime.sendMessage({ type: "impact-cn:frame-ask-topic", topicId: id });
      } catch {
        return { ok: false, reason: "top-ai-bridge-unavailable" };
      } finally {
        busy = false;
        for (const record of helpButtons.values()) record.button.disabled = false;
        emitState();
      }
    }
    const requestGeneration = aiGeneration;
    const requestActive = () => !destroyed && aiEnabled && aiGeneration === requestGeneration;
    let draftFilled = false;
    const cancelled = () => {
      try { findReadyAI().input?.focus(); } catch { /* Preserve an ambiguous draft without focusing it. */ }
      if (!destroyed) {
        const message = aiEnabled
          ? (draftFilled ? "AI辅助已重新开启，但上一次自动发送已取消；草稿保留在原生 AI 中，请检查后手动发送。" : "AI辅助已重新开启，上一次已取消的问题不会自动发送。")
          : (draftFilled ? "AI辅助已关闭，本次自动发送已停止；已填入的草稿保留在原生 AI 中。" : "AI辅助已关闭，本次提问已取消。 ");
        setStatus(message, "warning");
      }
      return { ok: false, reason: "ai-disabled", ...(draftFilled ? { filled: true } : {}) };
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
      const input = controls.input;
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
      const prompt = `${topic.question}\n\n请只解释以上选中的概念，不展开整页。请用简体中文按以下固定模板回答：\n1. 一句话解释。\n2. 一个联盟营销场景中的具体例子。\n3. 指标口径或常见误解；如果不是指标，请解释容易混淆的概念。\n4. 当前页面中如何使用或解读；无法确认实际配置时明确说明，不编造数据或操作结果。\n5. 官方帮助链接：请明确引用 ${officialUrl.href}。`;
      input.focus();
      if (!requestActive()) return cancelled();
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
      // A page re-render may replace the input. Do not submit an unrelated draft.
      const current = findReadyAI().input;
      if (!current || draftText(current) !== prompt) throw new Error("页面 AI 草稿在发送前发生变化，已停止自动发送。请检查输入框。 ");
      if (!requestActive()) return cancelled();
      send.click();
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
    for (const observer of observedRoots.values()) observer.disconnect();
    observedRoots.clear();
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
      void askTopic(message.topicId).then((result) => sendResponse({ ok: result.ok, reason: result.reason, topicId: result.topicId, message: result.message }));
      return true;
    }
    if (message?.type === "impact-cn:get-state") { sendResponse(getState()); return false; }
    if (message?.type === "impact-cn:set-enabled") {
      void setEnabled(message.enabled).then(sendResponse);
      return true;
    }
    if (message?.type === "impact-cn:set-ai-enabled") {
      void setAIEnabled(message.aiEnabled ?? message.enabled).then(sendResponse);
      return true;
    }
    return false;
  }

  async function initialize() {
    if (inExtension && chrome.storage?.local) {
      try {
        const stored = await chrome.storage.local.get([storageKey, aiStorageKey]);
        enabled = stored[storageKey] !== false;
        aiEnabled = stored[aiStorageKey] !== false;
      } catch { lastError = "无法读取浏览器设置，已使用默认开启状态。"; }
    }
    buildAssistant();
    discoverShadowRoots();
    listen(window, "popstate", () => schedule(document.body));
    listen(window, "hashchange", () => schedule(document.body));
    listen(window, "resize", () => { if (userPositioned) clampAssistantPosition(); else syncAssistantPlacement(); });
    routeTimer = setInterval(() => {
      if (route !== location.pathname + location.search) schedule(document.body);
      discoverShadowRoots();
      syncAssistantPlacement();
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

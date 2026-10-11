/* Forward an observed iframe's concept question to the existing top-level AI. */
"use strict";

importScripts("dict.js");

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
  if (message?.type !== "impact-cn:frame-ask-topic") return false;
  let url;
  try { url = new URL(sender.url); } catch { respond({ ok: false, reason: "invalid-frame" }); return false; }
  const allowed = sender.id === chrome.runtime.id && sender.tab?.id !== undefined && sender.frameId > 0
    && ["app.impact.com", "demo.impact.com"].includes(url.hostname) && url.protocol === "https:"
    && (["/secure/finance/app/", "/secure/advertiser/finance/", "/secure/advertiser/Adv_Finance_Report/"].some((path) => url.pathname.startsWith(path))
      || [
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
  chrome.tabs.sendMessage(sender.tab.id, { type: "impact-cn:top-ask-topic", topicId: message.topicId }, { frameId: 0 })
    .then(respond, () => respond({ ok: false, reason: "top-ai-unavailable" }));
  return true;
});

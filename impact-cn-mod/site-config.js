/*
 * Real-site adapter, loaded in the extension's isolated world.
 * Edit this local file, reload the unpacked extension, then refresh Impact.
 * A variable set by the Impact page cannot configure this isolated content script.
 * 汉化助手 v0.5.0 is based on the actual demo.impact.com advertiser interface. The Dashboard
 * roots and native Ask Impact controls were inspected in open Shadow DOM.
 * The extension traverses open roots, observes each relevant root separately and
 * discovers new open roots without patching the site's attachShadow method.
 * Local legacy fixtures use explicit data-impact-ai-* markers automatically.
 *
 * Add selectors after inspecting the real AI container, input and send control.
 * Each selector must match exactly one visible element. Restrict selectors to
 * that AI container; do not use generic "textarea", "input" or "button" selectors.
 * inputSelectors: textarea, text input or contenteditable AI draft editor.
 * sendSelectors: the AI submit button; disabled/aria-disabled states are respected.
 * openerSelectors: optional button that opens the page's existing AI drawer.
 * openerIndicatesClosed: verified Ask Impact exposes its opener while closing,
 * before the fading editor unmounts. Treat that editor as an old instance.
 * These arrays are ordered fallbacks. This is static local configuration only.
 */
globalThis.IMPACT_CN_CONFIG = {
  assistant: true,
  assistantAvoidSelectors: [".finance-bubble"],
  localization: {
    rootSelectors: ["#vueInstance", "#uitk-container", "#adv-navigation impact-style-isolator", "snapshot-chart-shadow", ".iui-calendar-range"],
    financePaths: ["/secure/advertiser/finance/", "/secure/advertiser/Adv_Finance_Report/", "/secure/finance/app/"],
    ignoreSelectors: [".partner-name", ".avatar-container", ".account-btn", ".profileBtn", "#ask-impact-shadow-host"]
  },
  ai: {
    rootSelectors: ["#ask-impact-shadow-host"],
    openerIndicatesClosed: true,
    openTimeoutMs: 10000,
    sendTimeoutMs: 5000,
    inputSelectors: ['textarea[placeholder="ask impact..."]'],
    sendSelectors: ['button[aria-label="Send"]'],
    openerSelectors: ['button[aria-label="Open Ask Impact"]']
  }
};

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
  guidance: {
    navigationSelector: ".check-item.clickable > .svg-name-container > .text",
    groupSelector: "#checklist-left-nav > .checklist-menu-group > .checklist-accordion > .accordion-item > h4.accordion-header",
    validationHelp: { container: "#checklist-outer-container .onc-instructions-drawer", closeSelector: "button.side-modal-header-close-btn[data-testid='uicl-side-modal-close-button'][type='button']" },
    validationControls: {
      path: "/onboarding-ui/checklist-assets/production/migrated/event-type-validation.html",
      roles: {
        "validation-open": { selector: "#app > div.main-container > div.page > div > div.default-font-size.default-border-radius.default-action-button.flex1:not(.secondary)", texts: ["Open Testing Tool", "打开测试工具"] },
        "validation-tests": { selector: "#app > div.main-container > div.page > div > div.default-font-size.default-border-radius.default-action-button.flex1.secondary", texts: ["View Test Actions", "查看测试转化"] }
      }
    },
    testsPaths: ["/secure/advertiser/actions/tests/test-actions-flow.ihtml"],
    sharedTestActionsPage: {
      path: "/secure/advertiser/engage/actions/tests/test-actions-flow.ihtml",
      list: {
        root: '#uitk-container.vueAdvNav #main-content #vueInstance .app-page .iui-page-section .iui-data-view[data-testid="uicl-dataview"]',
        title: { selector: ".data-header .top-info > h1", texts: ["Test Actions", "测试转化"] },
        marker: { selector: '.data-container .iui-dynamic-table .iui-data-table[data-testid="uicl-data-table"]' }
      },
      tool: {
        root: "#templateContainer",
        title: { selector: '[data-testid="uicl-page-header-title"],field-label-typography,sub-header', texts: ["Test your integration", "Test Your Integration", "测试集成"] },
        marker: { selector: "field-label-typography,sub-header,label:not(.toggler):not(.uitk-text-label)", texts: ["Run Test", "运行测试"] }
      }
    },
    targets: {
      "5a": { navigation: ["Set Default Percentage Payout", "设置默认佣金比例"], group: { texts: ["Account Setup", "账户配置"] }, hint: "点这里，打开佣金设置" },
      "5b": { navigation: ["Website Tracking", "网站追踪设置"], group: { texts: ["Technical Integration", "技术对接"] }, hint: "点这里，打开网站设置", frame: { path: "/secure/advertiser/checklist/website-tracking-checklist-flow.ihtml", selector: "#vueInstance field-label-typography.form-section-header", texts: ["Default landing page", "默认落地页"], textOnly: true, hint: "在这里检查店铺网址" } },
      "5c": { navigation: ["Connect Your Shopify Account", "连接您的 Shopify 账户"], group: { texts: ["Technical Integration", "技术对接"] }, hint: "点这里，查看店铺连接步骤" },
      "5d": { navigation: ["Connect Your Shopify Account", "连接您的 Shopify 账户"], group: { texts: ["Technical Integration", "技术对接"] }, hint: "先点这里，打开连接页面", frame: { path: "/secure/advertiser/checklist/shopify/connect-shopify-interactive.html", selector: ".outer-container > button#button.get-started-btn", texts: ["Connect your Shopify store", "连接 Shopify 店铺"], hint: "点这里，前往 Shopify" } },
      "6a": {
        navigation: ["Validate Your Events", "验证转化事件"],
        group: { texts: ["Technical Integration", "技术对接"] },
        hint: "点这里，进入验证转化事件",
        frameRegion: { host: "ui.assets.impact.com", path: "/onboarding-ui/checklist-assets/production/migrated/event-type-validation.html", role: "validation-open", hint: "点这里，打开测试工具" },
        openedPaths: ["/secure/advertiser/tracking-settings/actiontracker/launch-test-action-flow.ihtml", "/secure/advertiser/engage/actions/tests/test-actions-flow.ihtml"],
        toolControl: { selector: "#templateContainer button[data-testid='uicl-webflow-button'],#templateContainer button[data-testid='uicl-button']", texts: ["Start test in a new window", "在新窗口中开始测试"], hint: "点击这里打开测试链接，再由你在打开的店铺按批准方案下单。店铺内后续操作由你完成。" },
        toolLabel: { selector: "#templateContainer field-label-typography,#templateContainer sub-header,#templateContainer label:not(.toggler):not(.uitk-text-label)", texts: ["Run Test", "运行测试"], hint: "在运行测试区按原生工具核对本次链接；准备好后，在测试链接打开的店铺下单。" },
        openedHint: "请核对项目、事件、店铺与零佣金测试条款；Public Terms不能直接当零佣金测试条款。向下滚动到运行测试，点击“在新窗口中开始测试”，再由你在测试链接打开的店铺完成测试订单；助手不在店铺中继续定位。"
      },
      "6c": {
        navigation: ["Validate Your Events", "验证转化事件"], group: { texts: ["Technical Integration", "技术对接"] }, hint: "点这里，返回验证转化事件，再查看测试转化",
        frameRegion: { host: "ui.assets.impact.com", path: "/onboarding-ui/checklist-assets/production/migrated/event-type-validation.html", role: "validation-tests", hint: "点这里，查看本次测试转化" },
        openedPaths: ["/secure/advertiser/tracking-settings/actiontracker/launch-test-action-flow.ihtml", "/secure/advertiser/engage/actions/tests/test-actions-flow.ihtml"],
        toolControl: { selector: "#templateContainer button[data-testid='uicl-webflow-button'],#templateContainer button[data-testid='uicl-button']", texts: ["View my test action", "查看我的测试转化"], hint: "点这里，进入测试转化列表核对本次测试订单" },
        toolLabel: { selector: "#templateContainer field-label-typography,#templateContainer sub-header,#templateContainer label:not(.toggler):not(.uitk-text-label)", texts: ["Run Test", "运行测试"], hint: "在运行测试区查找“查看我的测试转化”；若尚未出现，先按原生工具核对本次测试链接的生成情况。" },
        openedHint: "点击“查看我的测试转化”，找到本次测试订单并核对详情；记录出现与本次验证成功分别判断。"
      }
    }
  },
  localization: {
    checklist: {
      topPath: "/secure/advertiser/engage/checklist/instance/",
      topPathExact: "/secure/advertiser/checklist/checklist-instance.ihtml",
      topRootSelector: "#checklist-outer-container > .checklist-container.iui-component",
      frameSelector: "#checklist-outer-container .right-section-outermost-container > .checklist-right-section > #screen-outer-div > iframe#iframe.checklist-iframe[name='screenIframe']",
      assetPaths: [
        "/onboarding-ui/checklist-assets/production/payout-terms/default.html",
        "/onboarding-ui/checklist-assets/production/migrated/event-type-validation.html",
        "/onboarding-ui/checklist-assets/production/operator-json/linkout.html",
        "/onboarding-ui/checklist-assets/production/operator-json/instructions.html"
      ],
      documentRoots: {
        "/secure/advertiser/engage/ads/manage-all-ads-flow.ihtml": ["#main-content .page-actions"],
        "/secure/advertiser/fr/tracking-gateway-settings.ihtml": ["#trkcfg-app"],
        "/secure/advertiser/accountSettings/view-account-product-users-flow.ihtml": ["#vueInstance"],
        "/secure/advertiser/checklist/view-edit-campaign-marketplace-flow.ihtml": ["#vueInstance"],
        "/secure/advertiser/checklist/website-tracking-checklist-flow.ihtml": ["#vueInstance"],
        "/secure/advertiser/checklist/shopify/connect-shopify-interactive.html": [".outer-container"],
        "/secure/advertiser/accountSettings/brandedsettings/advertiser-brandedsignup-settings-console-branding-flow.ihtml": ["#uitk-container"],
        "/secure/advertiser/accountSettings/brandedsettings/advertiser-brandedsignup-settings-email-branding-flow.ihtml": ["#uitk-container"],
        "/secure/advertiser/campaign/partner-signup-form-settings-flow.ihtml": ["#uitk-container"],
        "/secure/advertiser/campaign/campaign-systememails-settings-flow.ihtml": ["#uitk-container"],
        "/onboarding-ui/checklist-assets/production/payout-terms/default.html": ["#app", "ul.iui-component.iui-list[role='listbox']"],
        "/onboarding-ui/checklist-assets/production/migrated/event-type-validation.html": ["#app"],
        "/onboarding-ui/checklist-assets/production/operator-json/linkout.html": ["#app", "body > div > link-out > .on-vertical-flex"],
        "/onboarding-ui/checklist-assets/production/operator-json/instructions.html": ["#app"]
      },
      // These exact documents are also used by normal Finance shells. Keep
      // them separate from exclusive Checklist documents so the old Finance
      // qualification remains unchanged; native Checklist ancestry is checked
      // only for dictionary entries that require checklistFrame.
      sharedDocumentRoots: {
        "/secure/finance/app/customer-settings-general-view.ihtml": ["div.customer-settings-general"],
        "/secure/finance/app/customer-settings-fees-impact-view.ihtml": ["div.customer-settings-fees-impact"],
        "/secure/finance/app/customer-settings-fees-view.ihtml": ["div.customer-settings-fees"],
        "/secure/finance/app/brand-overview-view.ihtml": ["#vueInstance > .app-page > div.brand-overview"]
      },
      // The Finance Dashboard step has one observed same-origin shell between
      // the native Checklist frame and the shared funding document.
      nestedDocumentParents: {
        "/secure/finance/app/brand-overview-view.ihtml": {
          parentPath: "/secure/advertiser/finance/fr/finance-overview.ihtml",
          frameSelector: "#vueInstance > .app-page > iframe"
        }
      },
      reviewRoots: ["#app"]
    },
    systemEmailHelpTooltip: {
      path: "/secure/advertiser/campaign/campaign-systememails-settings-flow.ihtml",
      selector: "body > div.x-tip.x-layer.x-tip-default.uitkAnchoredTooltip > div.x-tip-body.x-tip-body-default",
      entryIds: [
        "settings-deep-system-emails-and-ui-tooltip-popup-footer-html",
        "settings-deep-system-emails-and-ui-tooltip-popup-reply-to-address",
        "settings-deep-system-emails-and-ui-tooltip-popup-from-name"
      ]
    },
    dataFeedHelpTooltip: {
      path: "/secure/advertiser/accountSettings/techintegration/view-edit-adv-daily-feeds-flow.ihtml",
      selector: "body > div.x-tip.x-layer.x-tip-default.uitkAnchoredTooltip > div.x-tip-body.x-tip-body-default",
      entryIds: [
        "settings-0819-data-feeds-popup-directory",
        "settings-0819-data-feeds-popup-port",
        "settings-0819-data-feeds-popup-username",
        "settings-0819-data-feeds-popup-password"
      ]
    },
    testIntegrationFloatingLabel: {
      paths: ["/secure/advertiser/engage/actions/tests/test-actions-flow.ihtml", "/secure/advertiser/tracking-settings/actiontracker/launch-test-action-flow.ihtml", "/secure/advertiser/actions/tests/test-actions-flow.ihtml", "/secure/advertiser/engage/aview.ihtml"],
      shadowHost: "body.vnext-dark > impact-style-isolator",
      selector: "div.float-widget > div.sub-container > div.float-middle-texts > div.float-subtext"
    },
    rootSelectors: ["#vueInstance", "#uitk-container", "#custom-report-builder", "#impact-reporting", ".modal[role=\"dialog\"]", ".modal-container", ".popup--E5fa0", ".baseFilterPopup--ie_2Y", ".reportPopWindow", ".DropdownMenuContent[role=\"dialog\"]", "[role=\"dialog\"]:has([class^=\"_sectionTitle_8fqgt_\"])", ".iui-side-modal", "[data-testid=\"uicl-manage-label-widget\"]", "[data-testid=\"uicl-side-modal\"]", ".uicc-grouped-dropdown", "#sb_widget #NEW_CHAT .chat-board-footer", "#sb_widget #NEW_CHAT > .top .buttons", ".custom_filter_slideout", "[data-testid=\"table-view-select-list\"]", ".iui-dropdown.in-multiselect-input", ".iui-dropdown.in-btn-menu", ".x-menu", "#impact-ap-shadow", "#impact-offers-shadow-host", "#adv-navigation impact-style-isolator", "snapshot-chart-shadow", ".iui-calendar-range", ".iui-dropdown.iui-custom__dropdown"],
    financePaths: ["/secure/advertiser/finance/", "/secure/advertiser/Adv_Finance_Report/", "/secure/finance/app/"],
    ignoreSelectors: [".partner-name", ".avatar-container", ".account-btn", ".profileBtn", ".fr-element", ".fr-view", "#ask-impact-shadow-host"]
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

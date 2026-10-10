/* Impact 中文校准词典 v0.5.3
 * 正式适配真实 Dashboard、共享侧栏/顶栏和财务正文；路径/查询、外壳、DOM 选择器及 Shadow 宿主限定。
 * exact 匹配完整文本节点；prefix/suffix 只翻固定片段，保留姓名、日期与金额；numeric-template 仅保留十进制计数槽。
 * entry.helpTopicId 与 helpTopics[].entryIds 双向关联；各 document 独立定位，子 frame 问号交给顶层原生 AI。
 * helpTopics.question 只问一个概念，统一回答模板由 content.js 追加；调用原生 Ask Impact。
 * stage/verification 只表示采集范围，不能替代扩展实网验收。
 */
globalThis.IMPACT_CN_DICTIONARY = Object.freeze({
  "version": "0.5.3",
  "locale": "zh-CN",
  "updatedAt": "2026-10-11",
  "context": "真实品牌侧Dashboard、共享侧边栏、Help/Finance顶栏与实际采集财务正文；精确frame路径/查询/外壳及业务选择器限定，保留账户数据，原生Ask Impact解释单一概念。",
  "entries": [
    {
      "id": "overview",
      "source": "Overview",
      "target": "总览",
      "reason": "导航入口，用总览表示汇总视图。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "partners",
      "source": "Partners",
      "target": "合作伙伴",
      "reason": "品牌合作关系管理入口，不译成股东或合伙人。 已观察原生中文导航的完整旧译作为限定范围别名校准。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span,.subitem-label"
      },
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands",
      "match": "exact",
      "aliases": [
        "伙伴"
      ],
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json"
    },
    {
      "id": "contracts",
      "source": "Contracts",
      "target": "合作合同",
      "reason": "双方接受合作条款后形成的合作合同。 已观察原生中文导航的完整旧译作为限定范围别名校准。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/learn-about-template-terms-and-contracts",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span,.subitem-label"
      },
      "match": "exact",
      "helpTopicId": "contracts",
      "aliases": [
        "合同"
      ],
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json"
    },
    {
      "id": "reports",
      "source": "Reports",
      "target": "数据报告",
      "reason": "查看合作推广数据的报告入口。 已观察原生中文导航的完整旧译作为限定范围别名校准。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span,.subitem-label"
      },
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report",
      "match": "exact",
      "aliases": [
        "报表"
      ],
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json"
    },
    {
      "id": "finance",
      "source": "Finance",
      "target": "财务",
      "reason": "资金、佣金与结算管理入口。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "partner",
      "source": "Partner",
      "target": "合作伙伴",
      "reason": "表格中的合作伙伴主体；不处理具体名称。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "status",
      "source": "Status",
      "target": "状态",
      "reason": "通用状态字段。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "clicks",
      "source": "Clicks",
      "target": "点击次数",
      "reason": "合作伙伴链接带来访问的点击数量；数值保持原样。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": "[class*=\"secondaryFieldLabel\"]",
        "shadowHost": "snapshot-chart-shadow"
      },
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report",
      "match": "exact"
    },
    {
      "id": "actions",
      "source": "Actions",
      "target": "转化量",
      "reason": "联盟营销指标卡的获归因转化数量；官方伙伴报表排除已撤销转化。明细记录与操作按钮列另按上下文区分。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": "[class*=\"secondaryFieldLabel\"]",
        "shadowHost": "snapshot-chart-shadow"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "match": "exact",
      "helpTopicId": "actions"
    },
    {
      "id": "action",
      "source": "Action",
      "target": "转化记录",
      "reason": "指被记录的转化事件，不译成动作。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance",
      "scope": "[data-impact-cn-demo]",
      "stage": "legacy-demo",
      "verification": "legacy-only"
    },
    {
      "id": "revenue",
      "source": "Revenue",
      "target": "成交金额",
      "reason": "官方销售转化报表中的成交销售金额，非伙伴佣金或品牌利润；其它事件类型需按对应口径核对。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": "[class*=\"secondaryFieldLabel\"]",
        "shadowHost": "snapshot-chart-shadow"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report",
      "match": "exact",
      "helpTopicId": "revenue"
    },
    {
      "id": "payout",
      "source": "Payout",
      "target": "佣金金额",
      "reason": "此试点为转化绩效佣金，金额不表示已经到账。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance",
      "scope": "[data-impact-cn-demo]",
      "stage": "legacy-demo",
      "verification": "legacy-only"
    },
    {
      "id": "action-locking",
      "source": "Action Locking",
      "target": "转化锁定期",
      "reason": "合同规定的转化核查期，锁定与付款是不同步骤。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/partner/what-would-you-like-to-learn-about/platform-features/working-with-brands/contracts/contracts-explained-for-partners",
      "aliases": [
        "动作锁定",
        "行动锁定"
      ],
      "scope": "[data-impact-cn-demo]",
      "stage": "legacy-demo",
      "verification": "legacy-only"
    },
    {
      "id": "pending-actions",
      "source": "Pending Actions",
      "target": "待锁定转化记录",
      "reason": "指已追踪但尚未到锁定日期的转化。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/partner/what-would-you-like-to-learn-about/platform-features/action-management/where-can-i-see-my-pending-actions-as-a-partner",
      "aliases": [
        "待处理动作",
        "待处理行动"
      ],
      "scope": "[data-impact-cn-demo]",
      "stage": "legacy-demo",
      "verification": "legacy-only"
    },
    {
      "id": "pending",
      "source": "Pending",
      "target": "待锁定",
      "reason": "此试点转化状态仍可被修改或撤销；合作关系 Pending 应另定上下文。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/partner/what-would-you-like-to-learn-about/platform-features/action-management/where-can-i-see-my-pending-actions-as-a-partner",
      "scope": "[data-impact-cn-demo]",
      "stage": "legacy-demo",
      "verification": "legacy-only"
    },
    {
      "id": "approved",
      "source": "Approved",
      "target": "已批准",
      "reason": "批准不保证已到锁定日期；避免误写为已付款或已锁定。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance",
      "scope": "[data-impact-cn-demo]",
      "stage": "legacy-demo",
      "verification": "legacy-only"
    },
    {
      "id": "reversed",
      "source": "Reversed",
      "target": "已撤销转化",
      "reason": "已撤销的转化记录，区别待锁定状态或一般退款金额。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subchild-label a"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json"
    },
    {
      "id": "locked",
      "source": "Locked",
      "target": "已锁定",
      "reason": "转化已经通过锁定日期；仍需按付款计划结算。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance",
      "scope": "[data-impact-cn-demo]",
      "stage": "legacy-demo",
      "verification": "legacy-only"
    },
    {
      "id": "active",
      "source": "Active",
      "target": "合作中",
      "reason": "此试点指有效合作关系，而非用户活跃度。",
      "reviewStatus": "demo",
      "scope": "[data-impact-cn-demo]",
      "stage": "legacy-demo",
      "verification": "legacy-only"
    },
    {
      "id": "add-partners",
      "source": "Add partners",
      "target": "添加合作伙伴",
      "reason": "添加合作关系的明确动作。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "all-partners",
      "source": "All partners",
      "target": "全部合作伙伴",
      "reason": "列表范围标签。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "search-partners",
      "source": "Search partners",
      "target": "搜索合作伙伴",
      "reason": "搜索控件外部标签；插件不改写输入值和 placeholder。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "view-contract",
      "source": "View contract",
      "target": "查看合作合同",
      "reason": "查看双方适用的合作条款。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/partner/what-would-you-like-to-learn-about/platform-features/working-with-brands/contracts/contracts-explained-for-partners",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "send-invitation",
      "source": "Send invitation",
      "target": "发送合作邀请",
      "reason": "明确发送的是合作邀请。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "invite-partners",
      "source": "Invite partners",
      "target": "邀请合作伙伴",
      "reason": "合作邀请弹窗标题。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "partner-email",
      "source": "Partner email",
      "target": "合作伙伴邮箱",
      "reason": "邀请对象的邮箱字段标签。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "cancel",
      "source": "Cancel",
      "target": "取消",
      "reason": "取消当前界面操作。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "send-invite",
      "source": "Send invite",
      "target": "发送邀请",
      "reason": "提交邀请表单。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "close",
      "source": "Close",
      "target": "关闭",
      "reason": "关闭弹窗按钮；不执行点击或删除原生通知。",
      "reviewStatus": "reviewed",
      "stage": "pending-native",
      "verification": "unverified-selector",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": ".pendo-guide-container"
      },
      "match": "exact"
    },
    {
      "id": "filters",
      "source": "Filters",
      "target": "筛选条件",
      "reason": "比过滤器更贴近业务操作。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "all-statuses",
      "source": "All statuses",
      "target": "全部状态",
      "reason": "不限制状态的筛选选项。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "export",
      "source": "Export",
      "target": "导出",
      "reason": "下载表格数据。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "performance-overview",
      "source": "Performance overview",
      "target": "绩效概览",
      "reason": "展示点击、转化及销售贡献。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "partner-performance",
      "source": "Partner performance",
      "target": "合作伙伴绩效",
      "reason": "合作伙伴营销表现概览。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "conversion-rate",
      "source": "Conversion rate",
      "target": "转化率",
      "reason": "官方品牌报表口径为转化次数除以点击次数；0值和分母为0时的显示保持原样。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": "[class*=\"secondaryFieldLabel\"]",
        "shadowHost": "snapshot-chart-shadow"
      },
      "aliases": [
        "Conversion Rate"
      ],
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report",
      "match": "exact",
      "helpTopicId": "conversion-rate"
    },
    {
      "id": "total-revenue",
      "source": "Total revenue",
      "target": "总销售额",
      "reason": "此试点销售额汇总；不是合作伙伴佣金收入。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "total-payout",
      "source": "Total payout",
      "target": "佣金总额",
      "reason": "绩效佣金汇总，不声称款项已付。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "last-30-days",
      "source": "Last 30 days",
      "target": "最近 30 天",
      "reason": "原生滚动日期范围预设。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": ".iui-calendar-range .presets, .iui-calendar-range .footer"
      },
      "aliases": [
        "Last 30 Days"
      ],
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets"
    },
    {
      "id": "this-month",
      "source": "This month",
      "target": "本月",
      "reason": "原生自然月日期范围预设。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": ".iui-calendar-range .presets, .iui-calendar-range .footer"
      },
      "aliases": [
        "This Month"
      ],
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets"
    },
    {
      "id": "today",
      "source": "Today",
      "target": "今天",
      "reason": "原生日期范围预设，日期值由原站计算。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": ".iui-calendar-range .presets, .iui-calendar-range .footer"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets"
    },
    {
      "id": "no-partners-found",
      "source": "No partners found",
      "target": "未找到合作伙伴",
      "reason": "搜索无匹配结果。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "partner-name",
      "source": "Partner name",
      "target": "合作伙伴名称",
      "reason": "字段标签，不改写名称值。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "partner-type",
      "source": "Partner type",
      "target": "合作伙伴类型",
      "reason": "合作伙伴分类字段。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "contract-details",
      "source": "Contract details",
      "target": "合作合同详情",
      "reason": "展示合同中的业务条件。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/partner/what-would-you-like-to-learn-about/platform-features/working-with-brands/contracts/contracts-explained-for-partners",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "default-payout",
      "source": "Default Payout",
      "target": "默认佣金",
      "reason": "合同中不适用额外规则时的默认佣金。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/partner/what-would-you-like-to-learn-about/platform-features/working-with-brands/contracts/contracts-explained-for-partners",
      "aliases": [
        "默认支付"
      ],
      "scope": "[data-impact-cn-demo]",
      "stage": "legacy-demo",
      "verification": "legacy-only"
    },
    {
      "id": "payout-groups",
      "source": "Payout Groups",
      "target": "佣金规则分组",
      "reason": "按特定转化条件应用不同佣金规则。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/partner/what-would-you-like-to-learn-about/platform-features/working-with-brands/contracts/contracts-explained-for-partners",
      "aliases": [
        "支付组"
      ],
      "scope": "[data-impact-cn-demo]",
      "stage": "legacy-demo",
      "verification": "legacy-only"
    },
    {
      "id": "payout-scheduling",
      "source": "Payout Scheduling",
      "target": "佣金付款计划",
      "reason": "约定锁定后何时支付佣金。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/partner/what-would-you-like-to-learn-about/platform-features/working-with-brands/contracts/contracts-explained-for-partners",
      "aliases": [
        "支付计划"
      ],
      "scope": "[data-impact-cn-demo]",
      "stage": "legacy-demo",
      "verification": "legacy-only"
    },
    {
      "id": "referral-window",
      "source": "Referral Window",
      "target": "归因有效期",
      "reason": "引荐流量后仍能取得转化归因的时间范围。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/partner/what-would-you-like-to-learn-about/platform-features/working-with-brands/contracts/contracts-explained-for-partners",
      "aliases": [
        "推荐窗口",
        "推荐期"
      ],
      "scope": "[data-impact-cn-demo]",
      "stage": "legacy-demo",
      "verification": "legacy-only"
    },
    {
      "id": "credit-policy",
      "source": "Credit Policy",
      "target": "归因规则",
      "reason": "决定转化贡献归属于哪个合作伙伴，不是信用政策。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/template-terms/create-template-terms",
      "aliases": [
        "信用政策"
      ],
      "scope": "[data-impact-cn-demo]",
      "stage": "legacy-demo",
      "verification": "legacy-only"
    },
    {
      "id": "locking-date",
      "source": "Locking Date",
      "target": "锁定日期",
      "reason": "从此日期起确定转化佣金义务。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "scheduled-clearing-date",
      "source": "Scheduled Clearing Date",
      "target": "计划结算日期",
      "reason": "预定从品牌资金账户划付佣金的日期，资金不足可逾期。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "invoicing",
      "source": "Invoicing",
      "target": "开票安排",
      "reason": "锁定转化纳入发票的安排。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/partner/what-would-you-like-to-learn-about/platform-features/working-with-brands/contracts/contracts-explained-for-partners",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "reversal-policy",
      "source": "Reversal Policy",
      "target": "撤销规则",
      "reason": "合同中关于撤销转化及佣金追回的规则。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/template-terms/create-template-terms",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "last-click",
      "source": "Last Click",
      "target": "最后点击归因",
      "reason": "按最后一次点击分配转化贡献的归因方式。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/template-terms/create-template-terms",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "action-id",
      "source": "Action ID",
      "target": "转化记录 ID",
      "reason": "转化详情唯一标识；不改写 ID 值。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/partner/what-would-you-like-to-learn-about/platform-features/action-management/where-can-i-see-my-pending-actions-as-a-partner",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "action-date",
      "source": "Action Date",
      "target": "转化发生日期",
      "reason": "转化发生并被追踪的日期。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/partner/what-would-you-like-to-learn-about/platform-features/action-management/where-can-i-see-my-pending-actions-as-a-partner",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "action-earnings",
      "source": "Action Earnings",
      "target": "转化佣金收入",
      "reason": "合作伙伴通过该转化产生的佣金收入。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/partner/what-would-you-like-to-learn-about/platform-features/action-management/where-can-i-see-my-pending-actions-as-a-partner",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "pending-payouts",
      "source": "Pending Payouts",
      "target": "待核佣金",
      "reason": "锁定前核查转化和佣金，不表示已经锁定、立即付款或已到账。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/payouts/filter-and-download-pending-payouts-list",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpTopicId": "pending-payouts"
    },
    {
      "id": "overdue",
      "source": "Overdue",
      "target": "付款逾期",
      "reason": "预定结算日品牌资金不足导致的付款状态。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/partner/what-would-you-like-to-learn-about/platform-features/finance/payments-withdrawals-and-balance/partner-payments-explained-from-action-to-payout",
      "scope": "[data-impact-cn-demo]",
      "stage": "legacy-demo",
      "verification": "legacy-only"
    },
    {
      "id": "outside-of-terms",
      "source": "Outside of Terms",
      "target": "超出条款转化",
      "reason": "超出合同条件的转化按官方规则自动撤销，可人工核查是否批准覆盖。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/actions/review-actions-that-are-outside-of-terms",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subchild-label a"
      },
      "aliases": [
        "Outside Terms"
      ],
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpTopicId": "outside-terms"
    },
    {
      "id": "settings",
      "source": "Settings",
      "target": "设置",
      "reason": "原生设置菜单标签，不改写账户资料。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "selector": "#adv-nav,.leftSlideMenu,.notification_settings,#profile-dropdown",
        "shadowHost": "#adv-navigation impact-style-isolator"
      },
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands",
      "match": "exact"
    },
    {
      "id": "help-center",
      "source": "Help Center",
      "target": "帮助中心",
      "reason": "平台帮助资料入口。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "manage-partners",
      "source": "Manage partners",
      "target": "管理合作伙伴",
      "reason": "合作伙伴管理入口。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "discover",
      "source": "Discover",
      "target": "招募伙伴",
      "reason": "Discover产品入口，用于发现、查看和招募潜在合作伙伴。原英文保留在概念帮助。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".product-name"
      },
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/performance-program/recruiting-partners/discover/discover-overview",
      "match": "exact",
      "helpTopicId": "discover",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json"
    },
    {
      "id": "transactions",
      "source": "Transactions",
      "target": "交易记录",
      "reason": "查看交易与佣金相关记录的导航入口。 已观察原生中文导航的完整旧译作为限定范围别名校准。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subitem-label"
      },
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance",
      "match": "exact",
      "aliases": [
        "交易"
      ],
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json"
    },
    {
      "id": "welcome-back",
      "source": "Welcome back",
      "target": "欢迎回来",
      "reason": "概览欢迎语。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "monthly-overview",
      "source": "Monthly overview",
      "target": "月度概览",
      "reason": "月度汇总视图。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "total-partners",
      "source": "Total partners",
      "target": "合作伙伴总数",
      "reason": "合作伙伴数量指标。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "active-partners",
      "source": "Active partners",
      "target": "合作中伙伴",
      "reason": "有效合作关系的伙伴数量。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "new-partners",
      "source": "New partners",
      "target": "新增合作伙伴",
      "reason": "当前日期范围内新增合作关系。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "pending-invitations",
      "source": "Pending invitations",
      "target": "待接受邀请",
      "reason": "邀请尚未被接受；与转化待锁定状态区分。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "invited",
      "source": "Invited",
      "target": "已邀请",
      "reason": "邀请已发送，尚未确认建立合作关系。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "paused",
      "source": "Paused",
      "target": "已暂停",
      "reason": "合作关系暂停。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "expired",
      "source": "Expired",
      "target": "已到期",
      "reason": "合作合同有效期已结束。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "affiliate",
      "source": "Affiliate",
      "target": "联盟推广伙伴",
      "reason": "联盟营销中的合作伙伴分类。",
      "reviewStatus": "demo",
      "aliases": [
        "Affiliate partner"
      ],
      "scope": "[data-impact-cn-demo]",
      "stage": "legacy-demo",
      "verification": "legacy-only"
    },
    {
      "id": "content",
      "source": "Content",
      "target": "推广素材",
      "reason": "真实导航是广告内容与素材入口，不是旧示例中的伙伴类型。 已观察原生中文导航的完整旧译作为限定范围别名校准。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subitem-label"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/ads/create-ads/create-a-text-link-asset",
      "match": "exact",
      "aliases": [
        "内容"
      ],
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json"
    },
    {
      "id": "creator",
      "source": "Creator",
      "target": "创作者",
      "reason": "内容创作者合作伙伴分类。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "coupon",
      "source": "Coupon",
      "target": "优惠券推广伙伴",
      "reason": "此试点合作伙伴类型，不对应单张优惠券。",
      "reviewStatus": "demo",
      "scope": "[data-impact-cn-demo]",
      "stage": "legacy-demo",
      "verification": "legacy-only"
    },
    {
      "id": "loyalty",
      "source": "Loyalty",
      "target": "返利与会员伙伴",
      "reason": "此试点忠诚度营销合作伙伴分类。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "paid-search",
      "source": "Paid search",
      "target": "付费搜索伙伴",
      "reason": "此试点合作伙伴类型。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "view-details",
      "source": "View details",
      "target": "查看详情",
      "reason": "打开详情面板。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "edit",
      "source": "Edit",
      "target": "编辑",
      "reason": "配置当前项目表现组件的指标和图表，不执行编辑动作。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": "#vueInstance .partnerSnapshotContainer btn.tertiary"
      },
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets",
      "match": "exact"
    },
    {
      "id": "save-changes",
      "source": "Save changes",
      "target": "保存修改",
      "reason": "保存当前修改。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "apply-filters",
      "source": "Apply filters",
      "target": "应用筛选",
      "reason": "执行所选筛选条件。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "clear-filters",
      "source": "Clear filters",
      "target": "清除筛选",
      "reason": "重置筛选条件。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "date-range",
      "source": "Date range",
      "target": "日期范围",
      "reason": "报告日期选择标签。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "custom-range",
      "source": "Custom range",
      "target": "自定义日期范围",
      "reason": "手动选择报告起止日期。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "email",
      "source": "Email",
      "target": "邮箱",
      "reason": "字段标签，不改写邮箱地址。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "program",
      "source": "Program",
      "target": "合作项目",
      "reason": "此试点合作伙伴营销项目，不译成程序。",
      "reviewStatus": "demo",
      "scope": "[data-impact-cn-demo]",
      "stage": "legacy-demo",
      "verification": "legacy-only"
    },
    {
      "id": "program-name",
      "source": "Program name",
      "target": "合作项目名称",
      "reason": "合作项目的名称字段。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "commission-rate",
      "source": "Commission rate",
      "target": "佣金比例",
      "reason": "demo 采用按销售额百分比计佣；固定额需另用佣金金额。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "commission",
      "source": "Commission",
      "target": "佣金",
      "reason": "绩效报酬字段。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "sales",
      "source": "Sales",
      "target": "销售额",
      "reason": "此试点 Sales 为销售金额；Sales 数量口径须另校准。",
      "reviewStatus": "demo",
      "scope": "[data-impact-cn-demo]",
      "stage": "legacy-demo",
      "verification": "legacy-only"
    },
    {
      "id": "leads",
      "source": "Leads",
      "target": "销售线索",
      "reason": "营销转化中的线索类型。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "order-id",
      "source": "Order ID",
      "target": "订单 ID",
      "reason": "字段标签，不处理订单标识值。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "order-amount",
      "source": "Order amount",
      "target": "订单金额",
      "reason": "订单销售金额字段。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "approved-actions",
      "source": "Approved Actions",
      "target": "已批准转化记录",
      "reason": "保留 Approved 语义，是否已锁定需同时看锁定日期。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "locked-actions",
      "source": "Locked Actions",
      "target": "已锁定转化记录",
      "reason": "已经到达锁定日期的转化。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "reversed-actions",
      "source": "Reversed Actions",
      "target": "已撤销转化记录",
      "reason": "已撤销且不产生相应佣金的转化。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/partner/what-would-you-like-to-learn-about/platform-features/action-management/reversed-actions-explained-for-partners",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "lock-date",
      "source": "Lock Date",
      "target": "锁定日期",
      "reason": "Pending Actions 报告中的转化锁定日期。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/partner/what-would-you-like-to-learn-about/platform-features/action-management/where-can-i-see-my-pending-actions-as-a-partner",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "payment-scheduling",
      "source": "Payment Scheduling",
      "target": "佣金付款计划",
      "reason": "此试点合同中的佣金付款安排。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/partner/what-would-you-like-to-learn-about/platform-features/finance/payments-withdrawals-and-balance/partner-payments-explained-from-action-to-payout",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "view-manage-contract",
      "source": "View And Manage Contract",
      "target": "查看并管理合作合同",
      "reason": "官方入口名称对应查看及管理合同。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/partner/what-would-you-like-to-learn-about/platform-features/working-with-brands/contracts/contracts-explained-for-partners",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "invitation-sent",
      "source": "Invitation sent",
      "target": "邀请已发送",
      "reason": "仅用于 demo 的发送成功反馈。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "please-enter-email",
      "source": "Please enter a valid email address",
      "target": "请输入有效的邮箱地址",
      "reason": "仅用于 demo 的本地表单校验。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "load-more",
      "source": "Load more",
      "target": "加载更多",
      "reason": "动态加载下一批列表内容。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "loading",
      "source": "Loading",
      "target": "加载中",
      "reason": "动态数据加载状态。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "no-data",
      "source": "No data available",
      "target": "暂无数据",
      "reason": "无报告数据时的反馈。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "performance-caption",
      "source": "Track your partner performance and manage your relationships.",
      "target": "查看合作伙伴绩效，管理合作关系。",
      "reason": "demo 页面介绍，不声称已采集真实平台文案。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "contract-caption",
      "source": "Review payout terms before sending an invitation.",
      "target": "发送邀请前，请核对佣金与合作条款。",
      "reason": "demo 邀请弹窗提示。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "locking-caption",
      "source": "Actions can be modified or reversed before the locking date.",
      "target": "锁定日期前，转化记录仍可修改或撤销。",
      "reason": "当前官方转化生命周期规则的简短说明。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "legacy-action-calibration",
      "source": "动作",
      "target": "转化记录",
      "reason": "仅校准已标记的绩效/转化区域旧汉化；其他语境保持原文。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance",
      "aliases": [
        "行动"
      ],
      "scope": "[data-impact-cn-demo] [data-impact-context=\"performance\"], [data-impact-cn-demo] [data-impact-context=\"actions\"]",
      "stage": "legacy-demo",
      "verification": "legacy-only"
    },
    {
      "id": "legacy-payout-calibration",
      "source": "支付",
      "target": "佣金金额",
      "reason": "仅校准已标记的绩效/转化区域旧汉化，不能全站改写一般支付操作。",
      "reviewStatus": "reviewed",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance",
      "scope": "[data-impact-cn-demo] [data-impact-context=\"performance\"], [data-impact-cn-demo] [data-impact-context=\"actions\"]",
      "stage": "legacy-demo",
      "verification": "legacy-only"
    },
    {
      "id": "pending-approval",
      "source": "Pending approval",
      "target": "待审核",
      "reason": "demo 合作关系尚待批准，与转化记录的 Pending（待锁定）分开校准。",
      "reviewStatus": "demo",
      "scope": "[data-impact-cn-demo]",
      "stage": "legacy-demo",
      "verification": "legacy-only"
    },
    {
      "id": "available-balance",
      "source": "Available Balance",
      "target": "可用余额",
      "reason": "款项进入平台可用余额后，提现仍需满足账户付款要求与自动提现条件。",
      "reviewStatus": "reviewed",
      "scope": "[data-impact-cn-demo]",
      "helpUrl": "https://help.impact.com/partner/what-would-you-like-to-learn-about/platform-features/finance/payments-withdrawals-and-balance/partner-payments-explained-from-action-to-payout",
      "stage": "legacy-demo",
      "verification": "legacy-only"
    },
    {
      "id": "engage",
      "source": "Engage",
      "target": "合作管理",
      "reason": "Engage产品入口；真实菜单含伙伴、内容、合同、交易与报告等合作管理功能。短中文避免窄导航溢出，原英文保留在概念帮助。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".product-name"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/reach-out-to-partners/partner-management/manage-my-partners",
      "match": "exact",
      "helpTopicId": "engage",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json"
    },
    {
      "id": "optimize",
      "source": "Optimize",
      "target": "多维分析",
      "reason": "按用户指定中文命名Optimize产品入口；官方用途为跨渠道、客户旅程及伙伴价值等多维报告分析，不表示自动执行优化，也不假设已订阅附加服务。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".product-name"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-startup-guide",
      "match": "exact",
      "helpTopicId": "optimize",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json"
    },
    {
      "id": "protect",
      "source": "Protect",
      "target": "风险防护",
      "reason": "Protect产品入口涉及违规监测与转化风险防护，不局限于欺诈；可用功能以套餐为准。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".product-name"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program",
      "match": "exact",
      "helpTopicId": "protect",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json"
    },
    {
      "id": "dashboard",
      "source": "Dashboard",
      "target": "仪表盘",
      "reason": "品牌侧账户与推广表现的总览入口。 已观察原生中文导航的完整旧译作为限定范围别名校准。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subitem-label"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets",
      "match": "exact",
      "aliases": [
        "面板"
      ],
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json"
    },
    {
      "id": "campaign-manager",
      "source": "Campaign Manager",
      "target": "营销活动管理",
      "reason": "集中管理营销活动与创作者合作，不译成活动经理。 已观察原生中文导航的完整旧译作为限定范围别名校准。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subitem-label"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/creator-program/recruit-creators/manage-creator-campaign-applicants",
      "match": "exact",
      "helpTopicId": "campaign-manager",
      "aliases": [
        "项目经理"
      ],
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json"
    },
    {
      "id": "amplification",
      "source": "Amplification",
      "target": "付费推广",
      "reason": "内容推广入口；具体投放平台与授权需在对应页面核验。 已观察原生中文导航的完整旧译作为限定范围别名校准。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subitem-label"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/creator-program/creator-campaigns-for-brands/content-rights-for-creator-campaigns-explained",
      "match": "exact",
      "helpTopicId": "amplification",
      "aliases": [
        "放大"
      ],
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json"
    },
    {
      "id": "refer-earn",
      "source": "Refer & Earn",
      "target": "推荐奖励",
      "reason": "原生推荐奖励入口：官方界面导览指推荐人脉使用impact.com获奖励，具体资格以功能页面规则为准。 已观察原生中文导航的完整旧译作为限定范围别名校准。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subitem-label"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands",
      "match": "exact",
      "aliases": [
        "推荐并赚取"
      ],
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json"
    },
    {
      "id": "program-health",
      "source": "Program Health",
      "target": "推广效果概览",
      "reason": "按日期范围展示合作推广效果与趋势；中文明确模块用途，不是健康检查或固定评分。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": "#vueInstance h3.dashboard-container-title"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets",
      "match": "exact",
      "helpTopicId": "program-health"
    },
    {
      "id": "recommended-partners",
      "source": "Partners you'll love",
      "target": "推荐合作伙伴",
      "reason": "仪表盘推荐可招募的潜在伙伴，不是已经合作的伙伴。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": "#vueInstance h3.dashboard-container-title"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets",
      "match": "exact",
      "helpTopicId": "recommended-partners"
    },
    {
      "id": "to-do-list",
      "source": "To Do List",
      "target": "待办事项",
      "reason": "仪表盘待办列表标题，实页存在但可能未展示。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": "#vueInstance h3.dashboard-container-title"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets",
      "match": "exact"
    },
    {
      "id": "show-compare",
      "source": "Show Compare",
      "target": "显示对比",
      "reason": "选择另一日期范围进行表现对比。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": "#vueInstance .partnerSnapshotContainer .filterSection a"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets",
      "match": "exact"
    },
    {
      "id": "action-cost",
      "source": "Action Cost",
      "target": "转化佣金",
      "reason": "因带来转化而产生的伙伴报酬金额，不是佣金比例或平均每次转化成本（CPA）；不能据此推断已到账。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": "[class*=\"secondaryFieldLabel\"]",
        "shadowHost": "snapshot-chart-shadow"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report",
      "match": "exact",
      "helpTopicId": "action-cost"
    },
    {
      "id": "total-cost",
      "source": "Total Cost",
      "target": "推广总成本",
      "reason": "官方报表口径为Action Cost+Click Cost+Other Cost；短标签适配真实指标窄卡，仍含转化报酬、点击报酬及奖金/补偿/展示位费等，不等于全部经营成本或平台账单。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": "[class*=\"secondaryFieldLabel\"]",
        "shadowHost": "snapshot-chart-shadow"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report",
      "match": "exact",
      "helpTopicId": "total-cost"
    },
    {
      "id": "extra-large",
      "source": "Extra Large",
      "target": "超大型",
      "reason": "潜在伙伴的规模等级；不是服装尺码或已保证的收益。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": "#vueInstance .partner-size .size-label"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/reach-out-to-partners/partner-management/partner-size-rating-criteria",
      "match": "exact",
      "helpTopicId": "partner-size"
    },
    {
      "id": "apparel-category",
      "source": "Apparel, Shoes & Accessories",
      "target": "服装、鞋履与配饰",
      "reason": "推荐伙伴内容领域分类。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": "#vueInstance .partner-category .text-ellipsis"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets",
      "match": "exact"
    },
    {
      "id": "go-discover",
      "source": "Go to Discover",
      "target": "前往伙伴招募",
      "reason": "跳转到原生Discover，不改写链接地址。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": "#vueInstance .discover-link a"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/performance-program/recruiting-partners/discover/discover-overview",
      "match": "exact"
    },
    {
      "id": "notifications",
      "source": "Notifications",
      "target": "通知",
      "reason": "原生通知面板标题。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "selector": "#adv-nav,.leftSlideMenu,.notification_settings,#profile-dropdown",
        "shadowHost": "#adv-navigation impact-style-isolator"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands",
      "match": "exact"
    },
    {
      "id": "notification-settings",
      "source": "Notification Settings",
      "target": "通知设置",
      "reason": "原生通知设置入口。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "selector": "#adv-nav,.leftSlideMenu,.notification_settings,#profile-dropdown",
        "shadowHost": "#adv-navigation impact-style-isolator"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands",
      "match": "exact"
    },
    {
      "id": "hide",
      "source": "Hide",
      "target": "收起",
      "reason": "收起原生面板或通知控件。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "selector": "#adv-nav,.leftSlideMenu,.notification_settings,#profile-dropdown",
        "shadowHost": "#adv-navigation impact-style-isolator"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands",
      "match": "exact"
    },
    {
      "id": "search",
      "source": "Search",
      "target": "搜索",
      "reason": "原生全局搜索入口；不翻译搜索值或输入属性。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "selector": "#adv-nav,.leftSlideMenu,.notification_settings,#profile-dropdown",
        "shadowHost": "#adv-navigation impact-style-isolator"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands",
      "match": "exact"
    },
    {
      "id": "help",
      "source": "Help",
      "target": "帮助",
      "reason": "原生帮助入口。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "selector": "#adv-nav,.leftSlideMenu,.notification_settings,#profile-dropdown",
        "shadowHost": "#adv-navigation impact-style-isolator"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands",
      "match": "exact"
    },
    {
      "id": "legacy-content-partner",
      "source": "Content partner",
      "target": "内容发布伙伴",
      "reason": "历史0.1.0示例的伙伴类型，不作为真实Dashboard内容导航适配。",
      "reviewStatus": "demo",
      "stage": "legacy-demo",
      "verification": "legacy-only",
      "scope": "[data-impact-cn-demo]"
    },
    {
      "id": "welcome-back-prefix",
      "source": "Welcome Back, ",
      "target": "欢迎回来，",
      "match": "prefix",
      "reason": "仅在真实欢迎语位置替换固定前缀；后缀姓名运行时原样保留且不写入字典。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": "#vueInstance .welcome-back"
      },
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets"
    },
    {
      "id": "deposit-holiday-reminder",
      "source": "Reminder: Deposit Processing Holiday",
      "target": "提醒：假期暂停处理账户充值",
      "reason": "仅校准充值处理提醒标题；未复核本次Pendo容器。",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": ".pendo-guide-container"
      },
      "reviewStatus": "reviewed",
      "stage": "pending-native",
      "verification": "unverified-selector",
      "match": "exact"
    },
    {
      "id": "important-notice",
      "source": "IMPORTANT NOTICE",
      "target": "重要通知",
      "reason": "通知标题，不替换后续日期或资金信息。",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": ".pendo-guide-container"
      },
      "reviewStatus": "reviewed",
      "stage": "pending-native",
      "verification": "unverified-selector",
      "match": "exact"
    },
    {
      "id": "deposit-holiday-prefix",
      "source": "Please note that no deposits will be processed on",
      "target": "请注意：以下日期暂停处理账户充值：",
      "reason": "按完整文本节点匹配；后续日期节点保留原样。",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": ".pendo-guide-container"
      },
      "reviewStatus": "reviewed",
      "stage": "pending-native",
      "verification": "unverified-selector",
      "match": "exact"
    },
    {
      "id": "deposit-holiday-suffix",
      "source": "due to public/company/bank holidays. Normal operations will resume on all other weekdays.",
      "target": "上述安排因公共假日、公司休假或银行假日而设；其他工作日正常处理。",
      "reason": "仅翻译完整说明节点，不推测停办日期。",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": ".pendo-guide-container"
      },
      "reviewStatus": "reviewed",
      "stage": "pending-native",
      "verification": "unverified-selector",
      "match": "exact"
    },
    {
      "id": "yesterday",
      "source": "Yesterday",
      "target": "昨天",
      "reason": "原生日期范围预设，不自行计算日期。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": ".iui-calendar-range .presets, .iui-calendar-range .footer"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets"
    },
    {
      "id": "this-week",
      "source": "This Week",
      "target": "本周",
      "reason": "原生日期范围预设，周起始规则由原站显示与设置决定。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": ".iui-calendar-range .presets, .iui-calendar-range .footer"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets"
    },
    {
      "id": "last-week",
      "source": "Last Week",
      "target": "上周",
      "reason": "原生日期范围预设，不改变原站周范围。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": ".iui-calendar-range .presets, .iui-calendar-range .footer"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets"
    },
    {
      "id": "last-seven-days",
      "source": "Last 7 Days",
      "target": "最近 7 天",
      "reason": "原生滚动日期范围预设。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": ".iui-calendar-range .presets, .iui-calendar-range .footer"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets"
    },
    {
      "id": "last-fourteen-days",
      "source": "Last 14 Days",
      "target": "最近 14 天",
      "reason": "原生滚动日期范围预设。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": ".iui-calendar-range .presets, .iui-calendar-range .footer"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets"
    },
    {
      "id": "last-month",
      "source": "Last Month",
      "target": "上月",
      "reason": "原生自然月日期范围预设。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": ".iui-calendar-range .presets, .iui-calendar-range .footer"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets"
    },
    {
      "id": "this-year",
      "source": "This Year",
      "target": "今年",
      "reason": "原生年度日期范围预设。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": ".iui-calendar-range .presets, .iui-calendar-range .footer"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets"
    },
    {
      "id": "clear-dates",
      "source": "Clear Dates",
      "target": "清除日期",
      "reason": "原生日期清除按钮标签，汉化本身不触发清除。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": ".iui-calendar-range .presets, .iui-calendar-range .footer"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets"
    },
    {
      "id": "monday-today",
      "source": "(Mon - Today)",
      "target": "（周一至今天）",
      "reason": "只译预设的星期范围说明，不改日历日期。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": ".iui-calendar-range .presets, .iui-calendar-range .footer"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets"
    },
    {
      "id": "sunday-today",
      "source": "(Sun - Today)",
      "target": "（周日至今天）",
      "reason": "只译预设的星期范围说明，不改日历日期。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": ".iui-calendar-range .presets, .iui-calendar-range .footer"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets"
    },
    {
      "id": "monday-friday",
      "source": "(Mon - Fri)",
      "target": "（周一至周五）",
      "reason": "只译预设的星期范围说明，不改日历日期。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": ".iui-calendar-range .presets, .iui-calendar-range .footer"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets"
    },
    {
      "id": "sunday-saturday",
      "source": "(Sun - Sat)",
      "target": "（周日至周六）",
      "reason": "只译预设的星期范围说明，不改日历日期。",
      "reviewStatus": "reviewed",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/engage/aview.ihtml",
        "selector": ".iui-calendar-range .presets, .iui-calendar-range .footer"
      },
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets"
    },
    {
      "id": "nav-automation",
      "source": "Automation",
      "target": "伙伴自动化",
      "reason": "伙伴运营自动化分类，包含工作流、简报与动态细分；显示入口不等于已启用自动审批。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/review-partner-applications/automate-partner-application-processing/create-workflows-to-automatically-process-partner-applications"
    },
    {
      "id": "nav-surveys",
      "source": "Surveys",
      "target": "伙伴问卷",
      "reason": "向已合作伙伴或申请加入者收集资料，不是面向消费者的市场调查。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/reach-out-to-partners/surveys/create-a-partner-survey"
    },
    {
      "id": "nav-groups",
      "source": "Groups",
      "target": "伙伴分组",
      "reason": "品牌侧管理用的分组，可用于条款、素材与定向沟通。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/reach-out-to-partners/partner-groups/create-and-manage-partner-groups"
    },
    {
      "id": "nav-contacts",
      "source": "Contacts",
      "target": "伙伴联系人",
      "reason": "合作联系信息入口，不翻译联系人姓名或邮箱。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands"
    },
    {
      "id": "nav-applications",
      "source": "Applications",
      "target": "合作申请",
      "reason": "含潜在伙伴加入申请及既有伙伴提出或还价的新条款，不是软件应用。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/review-partner-applications/review-partner-and-creator-applications",
      "helpTopicId": "applications"
    },
    {
      "id": "nav-proposals-sent",
      "source": "Proposals Sent",
      "target": "已发合同提案",
      "reason": "已发送的合同条款提案；发送不表示已经接受或生效。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/contracts/review-contract-proposals-youve-sent",
      "helpTopicId": "proposals-sent"
    },
    {
      "id": "nav-workflows",
      "source": "Workflows",
      "target": "自动化工作流",
      "reason": "依据条件处理伙伴申请或发送邮件的规则，不等于已启用。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subchild-label a"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/review-partner-applications/automate-partner-application-processing/create-workflows-to-automatically-process-partner-applications",
      "helpTopicId": "workflows"
    },
    {
      "id": "nav-newsletters",
      "source": "Newsletters",
      "target": "伙伴邮件简报",
      "reason": "面向伙伴的定向邮件通讯，不是平台新闻。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subchild-label a"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/reach-out-to-partners/email-workflows/create-and-manage-email-workflows"
    },
    {
      "id": "nav-segments",
      "source": "Segments",
      "target": "动态伙伴细分",
      "reason": "按条件动态筛选的名单；细分本身不执行发信或审核。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subchild-label a"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/reach-out-to-partners/segments/create-a-partner-segment",
      "helpTopicId": "segments"
    },
    {
      "id": "nav-messaging-templates",
      "source": "Messaging Templates",
      "target": "沟通消息模板",
      "reason": "重复使用的伙伴沟通文案，不是合同条款模板。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subchild-label a"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands"
    },
    {
      "id": "nav-performance-reports",
      "source": "Performance",
      "target": "绩效报告",
      "reason": "Reports下查看推广绩效的可展开分类，区别活动管理中的同名标签。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content span:not(:has(a))"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report"
    },
    {
      "id": "nav-recommended-by-meta",
      "source": "Recommended by Meta",
      "target": "Meta推荐内容",
      "reason": "Meta推荐的合作广告内容来源，不保证投放效果或已取得授权。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/creator-program/working-with-creators/amplify-your-creator-ads/boost-ads-with-meta-amplification-for-brands"
    },
    {
      "id": "nav-amplified-content",
      "source": "Amplified Content",
      "target": "付费推广内容",
      "reason": "已投入预算的内容与Meta广告效果管理入口。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/creator-program/working-with-creators/amplify-your-creator-ads/manage-your-amplified-ads"
    },
    {
      "id": "nav-data-lab",
      "source": "Data Lab",
      "target": "自定义报表",
      "reason": "按需要组合数据与可视化建立报告，不是上传数据的实验室。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/data-lab-custom-reports/data-lab-introduction",
      "helpTopicId": "data-lab"
    },
    {
      "id": "nav-saved",
      "source": "Saved",
      "target": "已保存报表",
      "reason": "已保存报告入口，不修改原站配置或名称。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands"
    },
    {
      "id": "nav-scheduled",
      "source": "Scheduled",
      "target": "定时报表",
      "reason": "按时间计划生成或发送的报告，不是待生效合同。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands"
    },
    {
      "id": "nav-more-reports",
      "source": "More Reports",
      "target": "全部报表",
      "reason": "报告目录入口，具体可见报告以权限为准。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands"
    },
    {
      "id": "nav-by-partner",
      "source": "by Partner",
      "target": "按合作伙伴",
      "reason": "按伙伴维度查看绩效，不修改伙伴名称。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subchild-label a"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report"
    },
    {
      "id": "nav-by-day",
      "source": "by Day",
      "target": "按日期",
      "reason": "按日查看绩效，不修改日期值。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subchild-label a"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report"
    },
    {
      "id": "nav-by-ad",
      "source": "by Ad",
      "target": "按广告素材",
      "reason": "按素材维度查看绩效，不是投放平台设置。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subchild-label a"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report"
    },
    {
      "id": "nav-advanced-action-listing",
      "source": "Advanced Action Listing",
      "target": "转化明细报表",
      "reason": "逐笔查看详细转化记录，不是操作按钮清单。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subchild-label a"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report"
    },
    {
      "id": "nav-actions",
      "source": "Actions",
      "target": "转化记录",
      "reason": "Transactions及待核佣金的记录入口，与Dashboard转化量汇总区分。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span,.subchild-label a"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance",
      "helpTopicId": "action-records"
    },
    {
      "id": "nav-inquiries",
      "source": "Inquiries",
      "target": "转化补单申请",
      "reason": "伙伴提交未正确跟踪订单的核查申请，不是一般客服咨询。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/action-inquiries/action-inquiries-explained",
      "helpTopicId": "action-inquiries"
    },
    {
      "id": "nav-test-actions",
      "source": "Test Actions",
      "target": "测试转化",
      "reason": "验证跟踪集成的测试转化，不当作真实业绩。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance"
    },
    {
      "id": "nav-at-risk",
      "source": "At Risk",
      "target": "风险转化待核",
      "reason": "需要核查的高风险转化；风险标记不等于已认定欺诈或已经付款。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subchild-label a"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/event-risk/review-at-risk-actions",
      "helpTopicId": "at-risk"
    },
    {
      "id": "nav-ads",
      "source": "Ads",
      "target": "广告素材",
      "reason": "供伙伴推广使用的广告及跟踪链接素材。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands"
    },
    {
      "id": "nav-data-posts",
      "source": "Data Posts",
      "target": "数据提交转化",
      "reason": "服务端提交有价值数据，由品牌核验后记录转化；常见于线索收集。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/event-types/data-post-conversions-explained",
      "helpTopicId": "data-posts"
    },
    {
      "id": "nav-widgets",
      "source": "Widgets",
      "target": "推广组件",
      "reason": "供伙伴展示或接入的可嵌入组件，不是Dashboard指标卡。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands"
    },
    {
      "id": "nav-resources",
      "source": "Resources",
      "target": "推广资源",
      "reason": "供伙伴使用的说明或推广资源，不改自定义资源名称。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands"
    },
    {
      "id": "nav-deals",
      "source": "Deals",
      "target": "优惠活动",
      "reason": "伙伴可宣传的促销优惠，不是交易记录或佣金。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands"
    },
    {
      "id": "nav-promo-codes",
      "source": "Promo Codes",
      "target": "优惠码",
      "reason": "优惠码管理入口，优惠本身与跟踪归因配置需分别核对。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands"
    },
    {
      "id": "nav-products",
      "source": "Products",
      "target": "商品管理",
      "reason": "商品目录与优惠的分类，不是四个产品切换入口。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands"
    },
    {
      "id": "nav-requests",
      "source": "Requests",
      "target": "伙伴请求",
      "reason": "推广内容区的伙伴请求，具体类型以页面为准。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands"
    },
    {
      "id": "nav-product-catalogs",
      "source": "Product Catalogs",
      "target": "商品目录",
      "reason": "向伙伴提供商品数据的目录，不是浏览器收藏目录。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subchild-label a"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands"
    },
    {
      "id": "nav-product-promotions",
      "source": "Product Promotions",
      "target": "商品优惠信息",
      "reason": "向伙伴商品feed、API及市场分享特惠，不等于调整合同佣金。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subchild-label a"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/product-promotions/upload-product-promotion-files",
      "helpTopicId": "product-promotions"
    },
    {
      "id": "nav-template-terms",
      "source": "Template Terms",
      "target": "合作条款模板",
      "reason": "预设合作事件、佣金与锁定等条件，伙伴接受后形成具体合同，不是页面模板。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/learn-about-template-terms-and-contracts",
      "helpTopicId": "template-terms"
    },
    {
      "id": "nav-custom-terms",
      "source": "Custom Terms",
      "target": "自定义条款",
      "reason": "附加到模板的品牌补充条款，不是另一种模板类型或自动调佣规则。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/contracts/add-custom-terms-to-your-contracts",
      "helpTopicId": "custom-terms"
    },
    {
      "id": "nav-changes",
      "source": "Changes",
      "target": "合同变更",
      "reason": "合同菜单中的条款变更，不是未保存编辑或转化修正。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/template-terms/modify-template-terms",
      "helpTopicId": "contract-changes"
    },
    {
      "id": "nav-find-partners",
      "source": "Find Partners",
      "target": "寻找合作伙伴",
      "reason": "伙伴市场与创作者搜索入口，不表示已经签约。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subitem-label"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/performance-program/recruiting-partners/discover/discover-overview"
    },
    {
      "id": "nav-prospects",
      "source": "Prospects",
      "target": "潜在合作伙伴",
      "reason": "纳入招募跟进的潜在伙伴，与已接受合同的伙伴区分。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subitem-label"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/performance-program/recruiting-partners/discover/discover-overview"
    },
    {
      "id": "nav-extended-search",
      "source": "Extended Search",
      "target": "全网拓展搜索",
      "reason": "自动从平台内外按关键词寻找伙伴，不是普通站内筛选。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subitem-label"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/performance-program/recruiting-partners/extended-search/extended-search-overview",
      "helpTopicId": "extended-search"
    },
    {
      "id": "nav-social-listening",
      "source": "Social Listening",
      "target": "社交内容监听",
      "reason": "跟踪关键词、话题与提及，发现社交讨论及创作者内容，不是录音监听。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subitem-label"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/find-partners-and-creators/social-listening/create-a-social-listener",
      "helpTopicId": "social-listening"
    },
    {
      "id": "nav-partner-marketplace",
      "source": "Partner Marketplace",
      "target": "合作伙伴市场",
      "reason": "搜索可招募伙伴的市场，不是已合作伙伴列表。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/performance-program/recruiting-partners/discover/discover-overview"
    },
    {
      "id": "nav-creator-search",
      "source": "Creator Search",
      "target": "创作者搜索",
      "reason": "寻找潜在创作者，不假设结果都已加入平台或合作项目。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/performance-program/recruiting-partners/discover/discover-overview"
    },
    {
      "id": "nav-my-searches",
      "source": "My Searches",
      "target": "我的搜索任务",
      "reason": "已创建拓展搜索任务，不是浏览器历史。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/performance-program/recruiting-partners/extended-search/extended-search-overview"
    },
    {
      "id": "nav-all-results",
      "source": "All Results",
      "target": "全部搜索结果",
      "reason": "拓展搜索结果不表示已通过合作审批。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/performance-program/recruiting-partners/extended-search/extended-search-overview"
    },
    {
      "id": "nav-participation-value",
      "source": "Participation Value",
      "target": "参与贡献价值",
      "reason": "观察伙伴在转化触点中的参与价值，不等于已获佣金。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subitem-label"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/contribution-report"
    },
    {
      "id": "nav-payout",
      "source": "Payout",
      "target": "佣金归因",
      "reason": "Optimize中的归因与佣金分配分析分类，不是实际付款入口。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subitem-label"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-startup-guide"
    },
    {
      "id": "nav-audience",
      "source": "Audience",
      "target": "客户分析",
      "reason": "客户价值与转化行为报告分类，不是只查看社交粉丝量。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subitem-label"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/new-customer-value-report"
    },
    {
      "id": "nav-funnels",
      "source": "Funnels",
      "target": "转化漏斗",
      "reason": "转化路径及多步骤事件漏斗的报告分类。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subitem-label"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/events-funnel-report"
    },
    {
      "id": "nav-contribution",
      "source": "Contribution",
      "target": "伙伴贡献分析",
      "reason": "区分引入、影响、促成成交与独立触点；参与不等于赢得归因。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/contribution-report",
      "helpTopicId": "contribution"
    },
    {
      "id": "nav-leapfrogging",
      "source": "Leapfrogging",
      "target": "归因抢占",
      "reason": "最后点击下后出现伙伴可能越过前序贡献伙伴赢得归因；报告不等于已认定作弊。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/leapfrogging-reports/leapfrogging-summary-report",
      "helpTopicId": "leapfrogging"
    },
    {
      "id": "nav-crediting-concerns",
      "source": "Crediting Concerns",
      "target": "归因合理性",
      "reason": "比较同一路径两方参与与获归因以核查报酬分配，不是正式申诉受理页。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/crediting-concerns-report",
      "helpTopicId": "crediting-concerns"
    },
    {
      "id": "nav-customer-value",
      "source": "Customer Value",
      "target": "客户价值",
      "reason": "官方当前报告侧重新客群在评估期内的购买与复购价值，不能只等同单笔成交额。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/new-customer-value-report",
      "helpTopicId": "customer-value"
    },
    {
      "id": "nav-behavior",
      "source": "Behavior",
      "target": "转化行为",
      "reason": "按伙伴、素材或优惠维度分析客户转化行为，不是伙伴操作日志。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/behavior-report",
      "helpTopicId": "behavior"
    },
    {
      "id": "nav-top-paths",
      "source": "Top Paths",
      "target": "常见转化路径",
      "reason": "最常见的触点顺序，不保证最优，需注意报表路径范围限制。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/top-paths-explained",
      "helpTopicId": "top-paths"
    },
    {
      "id": "nav-events-funnel",
      "source": "Events Funnel",
      "target": "事件转化漏斗",
      "reason": "按伙伴查看多步骤转化事件的逐步完成与流失。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/events-funnel-report",
      "helpTopicId": "events-funnel"
    },
    {
      "id": "nav-monitoring",
      "source": "Monitoring",
      "target": "合规监测",
      "reason": "付费搜索及优惠码的推广合规监测分类。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subitem-label"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program"
    },
    {
      "id": "nav-violations",
      "source": "Violations",
      "target": "违规记录",
      "reason": "需处理的监测违规记录，是否确认以具体记录及处理状态为准。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subitem-label"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program"
    },
    {
      "id": "nav-event-risk",
      "source": "Event Risk",
      "target": "事件风险",
      "reason": "评估点击和转化中的非人类可疑活动，不是财务余额风险。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subitem-label"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/event-risk/event-risk-explained",
      "helpTopicId": "event-risk"
    },
    {
      "id": "nav-paid-search",
      "source": "Paid Search",
      "target": "付费搜索监测",
      "reason": "监测伙伴搜索广告及商标竞价合规，不是创建搜索广告投放。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/paid-search-monitoring/introduction-to-paid-search-monitoring"
    },
    {
      "id": "nav-promo-code",
      "source": "Promo Code",
      "target": "优惠码监测",
      "reason": "Protect下的合规监测，区别Content中管理优惠码。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program"
    },
    {
      "id": "nav-policies",
      "source": "Policies",
      "target": "监测规则",
      "reason": "合规监测使用的规则，不是平台政策公告。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program"
    },
    {
      "id": "nav-risk-review",
      "source": "Risk Review",
      "target": "风险复核",
      "reason": "核查风险转化有效性，插件不会代为批准或拒绝。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/event-risk/review-at-risk-actions"
    },
    {
      "id": "nav-scoring-filtering-settings",
      "source": "Scoring & Filtering Settings",
      "target": "风险评分与过滤设置",
      "reason": "评分与点击过滤的相关设置；评分不等于确认欺诈，不代改设置。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/event-risk/filter-high-risk-traffic",
      "helpTopicId": "scoring-filtering"
    },
    {
      "id": "nav-alerts",
      "source": "Alerts",
      "target": "风险提醒",
      "reason": "事件风险提醒，不是浏览器弹窗警告。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a,.child-menu-content span"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/event-risk/event-risk-explained"
    },
    {
      "id": "nav-risk-by-partner",
      "source": "Risk By Partner",
      "target": "按伙伴分析风险",
      "reason": "按伙伴查看风险信号，不等于宣布伙伴作弊。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subchild-label a"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/event-risk/event-risk-explained"
    },
    {
      "id": "nav-action-risk",
      "source": "Action Risk",
      "target": "转化风险",
      "reason": "转化级风险信号，不是按钮操作风险。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subchild-label a"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/event-risk/event-risk-explained"
    },
    {
      "id": "nav-domain-risk-details",
      "source": "Domain Risk Details",
      "target": "域名风险明细",
      "reason": "域名层面的风险细节，不修改域名或URL。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subchild-label a"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/event-risk/event-risk-explained"
    },
    {
      "id": "nav-same-ip-actions",
      "source": "Same IP Actions",
      "target": "同IP转化记录",
      "reason": "共享IP的转化线索，不能仅凭同IP认定欺诈。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subchild-label a"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/event-risk/event-risk-explained"
    },
    {
      "id": "nav-conversion-spoofing-rules",
      "source": "Conversion Spoofing Rules",
      "target": "伪造转化校验规则",
      "reason": "订单ID与转化页URL模式校验规则；修改需按官方要求联系支持。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".subchild-label a"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/event-risk/view-validation-patterns-for-conversion-events",
      "helpTopicId": "conversion-spoofing"
    },
    {
      "id": "nav-performance-campaigns",
      "source": "Performance",
      "target": "效果营销活动",
      "reason": "Campaign Manager下的A标签对应效果营销活动管理，区别Reports下可展开Span的绩效报告分类。",
      "reviewStatus": "reviewed",
      "stage": "native-dashboard",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".child-menu-content a"
      },
      "match": "exact",
      "navLabel": true,
      "observedSource": "docs/sidebar-dom-scan.json",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/performance-program/beta-performance-campaigns/manage-a-performance-campaign/add-or-remove-performance-campaign-tasks-as-a-brand"
    },
    {
      "id": "header-help-pxa",
      "source": "PXA",
      "target": "合作伙伴培训学院（PXA）",
      "reason": "PXA提供合作伙伴营销相关培训与认证课程，保留学院缩写。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".help-menu-item#PXA > span:first-child"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "help",
      "helpUrl": "https://help.impact.com/other/reference-documentation/get-help-and-support"
    },
    {
      "id": "header-help-walkthroughs",
      "source": "Walkthroughs",
      "target": "交互式操作指南",
      "reason": "在平台内启动逐步操作引导，区别仅浏览帮助文章。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".help-menu-item#guideCenter > span:first-child"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "help",
      "helpUrl": "https://help.impact.com/other/reference-documentation/get-help-and-support"
    },
    {
      "id": "header-help-docs",
      "source": "Help Docs",
      "target": "帮助文档",
      "reason": "打开官方帮助中心查询文章。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".help-menu-item#HELP_DOCS > span:first-child"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "help",
      "helpUrl": "https://help.impact.com/other/reference-documentation/get-help-and-support"
    },
    {
      "id": "header-help-chat",
      "source": "Chat",
      "target": "在线咨询",
      "reason": "按账户配置打开ask impact或客服对话；不误标为必然直接接通人工。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".help-menu-item#IN_APP_LIVE_CHAT > span:first-child"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "help",
      "helpUrl": "https://help.impact.com/other/reference-documentation/get-help-and-support"
    },
    {
      "id": "header-help-tickets",
      "source": "Tickets",
      "target": "客服工单",
      "reason": "提交与管理支持请求，不是门票或任务票据。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".help-menu-item#TICKETS > span:first-child"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "help",
      "helpUrl": "https://help.impact.com/other/reference-documentation/get-help-and-support"
    },
    {
      "id": "header-help-whats-new",
      "source": "What's New",
      "target": "产品更新",
      "reason": "产品新功能和更新入口；只翻译已采集菜单标签。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".help-menu-item#WHATS_NEW > span:first-child"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "help",
      "helpUrl": "https://help.impact.com/other/reference-documentation/get-help-and-support"
    },
    {
      "id": "header-finance-title",
      "source": "Finance",
      "target": "财务",
      "reason": "财务下拉栏框标题。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".finance-bubble .sub-header"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "finance",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "header-finance-deposit-button",
      "source": "Make Deposit",
      "target": "充值",
      "reason": "向品牌资金账户补充资金的入口，不是冻结押金或提现。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".finance-bubble .top button"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "finance",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "header-finance-required-funding",
      "source": "Required funding",
      "target": "需补充资金",
      "reason": "覆盖待付款项及逾期费用所需的账户资金，保留原金额和计算结果。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".finance-bubble .funding-header"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "finance",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "header-finance-past-due",
      "source": "Past due",
      "target": "逾期未付款",
      "reason": "已经超过到期日但尚未付款的费用。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".finance-bubble .bottom .row > div:first-child"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "finance",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "header-finance-pending-deposits",
      "source": "Pending deposits",
      "target": "待到账充值",
      "reason": "已发起但尚未到账的账户充值，区别当前可用资金。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".finance-bubble .bottom .row > div:first-child"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "finance",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "header-finance-pending-payments",
      "source": "Pending payments",
      "target": "待付款项",
      "reason": "已经计划但尚未到期的付款，区别逾期欠款或待到账充值。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".finance-bubble .bottom .row > div:first-child"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "finance",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "header-finance-due-since",
      "source": "(Due since",
      "target": "(到期日自",
      "reason": "仅替换到期范围的固定起始前缀；原日期、空白和右括号原样保留。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".finance-bubble .bottom .row > div:first-child > span.due-date"
      },
      "match": "prefix",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "finance",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained",
      "preserveDynamicSuffix": true
    },
    {
      "id": "header-finance-due-through",
      "source": "(Due through",
      "target": "(到期日截至",
      "reason": "仅替换到期范围的固定截止前缀；原日期、空白和右括号原样保留。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".finance-bubble .bottom .row > div:first-child > span.due-date"
      },
      "match": "prefix",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "finance",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained",
      "preserveDynamicSuffix": true
    },
    {
      "id": "header-finance-overview",
      "source": "overview",
      "target": "财务总览",
      "reason": "资金账户汇总入口，区别推广绩效总览。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".finance-bubble a.fin-menu-item.fin-menu-parent"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "finance",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "header-finance-reports",
      "source": "reports",
      "target": "财务报告",
      "reason": "展开财务报表分类，不替换其他页面的Reports。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".finance-bubble button.fin-menu-item.fin-menu-parent"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "finance",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "header-finance-deposit-menu",
      "source": "make deposit",
      "target": "充值",
      "reason": "财务菜单中的账户充值入口，保留真实小写source及链接。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".finance-bubble a.fin-menu-item.fin-menu-parent"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "finance",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "header-finance-transfers",
      "source": "transfers",
      "target": "伙伴资金转账",
      "reason": "向伙伴支付奖金等合同佣金条款外款项的PFT管理入口，区别账户充值。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".finance-bubble a.fin-menu-item.fin-menu-parent"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "finance",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "header-finance-documents",
      "source": "documents",
      "target": "账单文档",
      "reason": "展开伙伴付款账单与平台账单文档分类。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".finance-bubble button.fin-menu-item.fin-menu-parent"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "finance",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/partner-payments-invoices-explained-for-brands"
    },
    {
      "id": "header-finance-subscription",
      "source": "subscription",
      "target": "订阅与用量",
      "reason": "平台套餐、订阅费用和支付处理用量详情入口。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".finance-bubble a.fin-menu-item.fin-menu-parent"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "finance",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/your-subscription/view-your-impactcom-subscription-and-usage-details"
    },
    {
      "id": "header-finance-settings",
      "source": "settings",
      "target": "财务设置",
      "reason": "展开资金、账单和充值设置，区别全局账户设置。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".finance-bubble button.fin-menu-item.fin-menu-parent"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "finance",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/finance-settings-overview-for-brands"
    },
    {
      "id": "header-finance-monthly-close",
      "source": "Monthly Close",
      "target": "月结报表",
      "reason": "按转化发生月份汇总推广费用与平台费用的月结报表入口；不是关闭当月账户。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".finance-bubble a.fin-menu-item.fin-menu-child"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "finance",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report"
    },
    {
      "id": "header-finance-upcoming-partner-payments",
      "source": "Upcoming Partner Payments",
      "target": "即将到期的伙伴付款",
      "reason": "伙伴未来到期款项报告，可含已锁定及预计付款，不代表已经支付。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".finance-bubble a.fin-menu-item.fin-menu-child"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "finance",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report"
    },
    {
      "id": "header-finance-cash-flow-history",
      "source": "Cash Flow History",
      "target": "资金流水",
      "reason": "资金账户历史流入流出及余额变化报告，不是成交金额或利润报告。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".finance-bubble a.fin-menu-item.fin-menu-child"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "finance",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/cash-flow-history-report"
    },
    {
      "id": "header-finance-partner-invoices",
      "source": "Partner Payments Invoices",
      "target": "伙伴付款账单",
      "reason": "应付伙伴款项的账单和汇总文件入口；不把平台Invoice直接等同本地税务发票。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".finance-bubble a.fin-menu-item.fin-menu-child"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "finance",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/partner-payments-invoices-explained-for-brands"
    },
    {
      "id": "header-finance-impact-invoices",
      "source": "impact.com Invoices",
      "target": "impact.com 服务费账单",
      "reason": "平台订阅、用量及其他服务费用账单，区别伙伴佣金账单；不把平台Invoice直接等同本地税务发票。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".finance-bubble a.fin-menu-item.fin-menu-child"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "finance",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices"
    },
    {
      "id": "header-finance-general",
      "source": "General",
      "target": "常规设置",
      "reason": "财务通用设置及主要财务联系人，不扩大到其他页面的General。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".finance-bubble a.fin-menu-item.fin-menu-child"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "finance",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/finance-settings-overview-for-brands"
    },
    {
      "id": "header-finance-legal-entities",
      "source": "Legal Entities",
      "target": "法律主体",
      "reason": "承接合同、付款与税务信息的主体设置，区别推广计划或伙伴群组。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".finance-bubble a.fin-menu-item.fin-menu-child"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "finance",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities"
    },
    {
      "id": "header-finance-billing-groups",
      "source": "Billing Groups",
      "target": "账单分组",
      "reason": "将不同推广计划的伙伴费用分别归集开账单的设置，区别伙伴分组。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".finance-bubble a.fin-menu-item.fin-menu-child"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "finance",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-manage-billing-groups-and-funding-accounts-as-a-brand"
    },
    {
      "id": "header-finance-funding-accounts",
      "source": "Funding Accounts",
      "target": "资金账户",
      "reason": "用于充值并结算平台费用和伙伴款项的账户，区别收款银行卡。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".finance-bubble a.fin-menu-item.fin-menu-child"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "finance",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "header-finance-payment-methods",
      "source": "Payment Methods",
      "target": "充值付款方式",
      "reason": "品牌向资金账户充值使用的付款方式设置，区别伙伴收款方式。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".finance-bubble a.fin-menu-item.fin-menu-child"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "finance",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/finance-settings-overview-for-brands"
    },
    {
      "id": "header-finance-automatic-payments",
      "source": "Automatic Payments",
      "target": "自动充值",
      "reason": "按余额和未来应付费用自动为品牌资金账户充值，不是自动调整佣金或伙伴提现。",
      "reviewStatus": "reviewed",
      "stage": "native-header",
      "verification": "observed-dom",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/",
        "shadowHost": "#adv-navigation impact-style-isolator",
        "selector": ".finance-bubble a.fin-menu-item.fin-menu-child"
      },
      "match": "exact",
      "observedSource": "docs/header-menus-dom-scan.json",
      "headerSection": "finance",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/set-up-automatic-payments-as-a-brand"
    },
    {
      "id": "finance-overview-overview-51d7b17",
      "source": "Overview",
      "target": "财务总览",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show balance forecast",
        "opened:Payment Request Form"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/finance-overview.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/finance-overview.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-overview-reports-3513ccb",
      "source": "Reports",
      "target": "财务报告",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show balance forecast",
        "opened:Payment Request Form"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/finance-overview.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/finance-overview.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-overview-make-deposit-bc32cd9",
      "source": "Make Deposit",
      "target": "充值",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show balance forecast",
        "opened:Payment Request Form"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/finance-overview.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/finance-overview.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-overview-transfers-b3cc48a",
      "source": "Transfers",
      "target": "伙伴资金转账",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show balance forecast",
        "opened:Payment Request Form"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/finance-overview.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/finance-overview.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained",
      "helpTopicId": "finance-pft"
    },
    {
      "id": "finance-overview-documents-d7a2ce1",
      "source": "Documents",
      "target": "账单文档",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show balance forecast",
        "opened:Payment Request Form"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/finance-overview.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/finance-overview.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-overview-subscription-0718f64",
      "source": "Subscription",
      "target": "订阅与用量",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show balance forecast",
        "opened:Payment Request Form"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/finance-overview.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/finance-overview.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-overview-settings-3839ca0",
      "source": "Settings",
      "target": "财务设置",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show balance forecast",
        "opened:Payment Request Form"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/finance-overview.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/finance-overview.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-overview-settings-062f451",
      "source": "Settings",
      "target": "通知设置",
      "reason": "真实顶部通知面板的设置入口；用通知容器和精确页面作用域隔离，与财务设置菜单区分。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text._4-64-3_SuBBQ",
      "observedKind": "notification-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show balance forecast",
        "opened:Payment Request Form"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/finance-overview.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/finance-overview.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact"
    },
    {
      "id": "finance-overview-overview-5c98c62",
      "source": "Overview",
      "target": "财务总览",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "#overview-header > h1",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show balance forecast",
        "opened:Payment Request Form"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/brand-overview-view.ihtml",
        "pathExact": "/secure/finance/app/brand-overview-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "#overview-header > h1"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-overview-payment-request-form-fa4d87a",
      "source": "Payment Request Form",
      "target": "预计充值需求单（PRF）",
      "reason": "预充值需求预测文档，保留PRF概念并区别Invoice。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "button[data-testid=\"uicl-button-menu\"]",
      "observedKind": "control-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show balance forecast",
        "opened:Payment Request Form"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/brand-overview-view.ihtml",
        "pathExact": "/secure/finance/app/brand-overview-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "button[data-testid=\"uicl-button-menu\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained",
      "helpTopicId": "finance-prf"
    },
    {
      "id": "finance-overview-make-deposit-3f49295",
      "source": "Make Deposit",
      "target": "充值",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "#overview-header-deposit-btn",
      "observedKind": "control-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show balance forecast",
        "opened:Payment Request Form"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/brand-overview-view.ihtml",
        "pathExact": "/secure/finance/app/brand-overview-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "#overview-header-deposit-btn"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-overview-funding-account-57e1771",
      "source": "Funding Account -",
      "target": "资金账户 -",
      "reason": "仅替换已观察资金账户标题前缀，原币种后缀保留。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "#funding-account > div.header-section:nth-of-type(1) > div:nth-of-type(1) > h5.panel-subtitle",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show balance forecast",
        "opened:Payment Request Form"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/brand-overview-view.ihtml",
        "pathExact": "/secure/finance/app/brand-overview-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "#funding-account > div.header-section:nth-of-type(1) > div:nth-of-type(1) > h5.panel-subtitle"
      },
      "match": "prefix",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained",
      "dynamicSuffix": "<original-currency-code>",
      "helpTopicId": "finance-funding-account"
    },
    {
      "id": "finance-overview-show-balance-forecast-ca9bced",
      "source": "Show balance forecast",
      "target": "显示余额预测",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "#balance-forecast-selection > div._4-49-7_uG1JJ > label._4-49-7_drYDe._4-49-7_ryDSx",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show balance forecast",
        "opened:Payment Request Form"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/brand-overview-view.ihtml",
        "pathExact": "/secure/finance/app/brand-overview-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "#balance-forecast-selection label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained",
      "helpTopicId": "finance-balance-forecast"
    },
    {
      "id": "finance-overview-past-due-a035255",
      "source": "Past Due",
      "target": "逾期未付款",
      "reason": "到期后尚未结算的款项，区别未到期付款。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "#fa-overview-overdue > div.equation-part:nth-of-type(1) > p.funding-account-text:nth-of-type(1)",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show balance forecast",
        "opened:Payment Request Form"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/brand-overview-view.ihtml",
        "pathExact": "/secure/finance/app/brand-overview-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "#fa-overview-overdue > div.equation-part:nth-of-type(1) > p.funding-account-text:nth-of-type(1)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-overview-payments-due-since-fbc65e9",
      "source": "Payments due since",
      "target": "付款到期日自",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "#fa-overview-overdue > div.equation-part:nth-of-type(1) > p.date-info:nth-of-type(3)",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show balance forecast",
        "opened:Payment Request Form"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/brand-overview-view.ihtml",
        "pathExact": "/secure/finance/app/brand-overview-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "#fa-overview-overdue > div.equation-part:nth-of-type(1) > p.date-info:nth-of-type(3)"
      },
      "match": "prefix",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained",
      "dynamicSuffix": "<original-date>"
    },
    {
      "id": "finance-overview-pending-payments-d19ca43",
      "source": "Pending Payments",
      "target": "待付款项",
      "reason": "已安排但尚未到期的款项，区别待到账充值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "#fa-overview-overdue > div.equation-part:nth-of-type(3) > p.funding-account-text:nth-of-type(1)",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show balance forecast",
        "opened:Payment Request Form"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/brand-overview-view.ihtml",
        "pathExact": "/secure/finance/app/brand-overview-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "#fa-overview-overdue > div.equation-part:nth-of-type(3) > p.funding-account-text:nth-of-type(1)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-overview-required-funding-3228d65",
      "source": "Required Funding",
      "target": "需补充资金",
      "reason": "为覆盖账户待付及逾期费用需要补充的资金，不更改系统资金需求计算。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "#fa-overview-overdue > div.equation-part:nth-of-type(5) > p.funding-account-text:nth-of-type(1)",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show balance forecast",
        "opened:Payment Request Form"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/brand-overview-view.ihtml",
        "pathExact": "/secure/finance/app/brand-overview-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "#fa-overview-overdue > div.equation-part:nth-of-type(5) > p.funding-account-text:nth-of-type(1)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained",
      "helpTopicId": "finance-required-funding"
    },
    {
      "id": "finance-overview-transaction-summary-b4f6f73",
      "source": "Transaction Summary",
      "target": "资金收支摘要",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "#funding-account > div.transaction-summary:nth-of-type(3) > h5",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Payment Request Form"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/brand-overview-view.ihtml",
        "pathExact": "/secure/finance/app/brand-overview-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "#funding-account > div.transaction-summary:nth-of-type(3) > h5"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-overview-description-0978379",
      "source": "Description",
      "target": "说明",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "#funding-account-summary > div.summary-row:nth-of-type(1) > div.left:nth-of-type(1) > p.title",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show balance forecast",
        "opened:Payment Request Form"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/brand-overview-view.ihtml",
        "pathExact": "/secure/finance/app/brand-overview-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "#funding-account-summary > div.summary-row:nth-of-type(1) > div.left:nth-of-type(1) > p.title"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-overview-amount-f525c46",
      "source": "Amount",
      "target": "金额",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "#funding-account-summary > div.summary-row:nth-of-type(1) > div.right:nth-of-type(2) > p.title",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show balance forecast",
        "opened:Payment Request Form"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/brand-overview-view.ihtml",
        "pathExact": "/secure/finance/app/brand-overview-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "#funding-account-summary > div.summary-row:nth-of-type(1) > div.right:nth-of-type(2) > p.title"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-overview-current-balance-82979d4",
      "source": "Current Balance",
      "target": "当前余额",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "#funding-account-summary > div.summary-row:nth-of-type(2) > div.left:nth-of-type(1) > p > span",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show balance forecast",
        "opened:Payment Request Form"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/brand-overview-view.ihtml",
        "pathExact": "/secure/finance/app/brand-overview-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "#funding-account-summary > div.summary-row:nth-of-type(2) > div.left:nth-of-type(1) > p > span"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-overview-deposit-993f68e",
      "source": "Deposit",
      "target": "充值",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "#funding-account-summary > div.summary-row:nth-of-type(3) > div.left:nth-of-type(1) > p > span:nth-of-type(1)",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show balance forecast",
        "opened:Payment Request Form"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/brand-overview-view.ihtml",
        "pathExact": "/secure/finance/app/brand-overview-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "#funding-account-summary > div.summary-row:nth-of-type(3) > div.left:nth-of-type(1) > p > span:nth-of-type(1)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-overview-pending-e821989",
      "source": "Pending",
      "target": "待到账",
      "reason": "同一资金收支行已观察Deposit与Pending拆分标签，表示充值待到账；区别佣金待锁定或一般待处理状态。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "#funding-account-summary > div.summary-row:nth-of-type(3) > div.left:nth-of-type(1) > p > span:nth-of-type(3)",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show balance forecast",
        "opened:Payment Request Form"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/brand-overview-view.ihtml",
        "pathExact": "/secure/finance/app/brand-overview-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "#funding-account-summary > div.summary-row:nth-of-type(3) > div.left:nth-of-type(1) > p > span:nth-of-type(3)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained",
      "helpTopicId": "finance-pending-deposit"
    },
    {
      "id": "finance-overview-past-due-b9fc98c",
      "source": "Past Due",
      "target": "逾期未付款",
      "reason": "到期后尚未结算的款项，区别未到期付款。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "#funding-account-summary > div.summary-row:nth-of-type(4) > div.left:nth-of-type(1) > p > span:nth-of-type(2)",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show balance forecast",
        "opened:Payment Request Form"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/brand-overview-view.ihtml",
        "pathExact": "/secure/finance/app/brand-overview-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "#funding-account-summary > div.summary-row:nth-of-type(4) > div.left:nth-of-type(1) > p > span:nth-of-type(2)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-overview-required-funding-6c7d2c1",
      "source": "Required Funding",
      "target": "需补充资金",
      "reason": "为覆盖账户待付及逾期费用需要补充的资金，不更改系统资金需求计算。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "#funding-account-summary > div.summary-row:nth-of-type(5) > div.left:nth-of-type(1) > div.description > span.funding-description",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show balance forecast",
        "opened:Payment Request Form"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/brand-overview-view.ihtml",
        "pathExact": "/secure/finance/app/brand-overview-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "#funding-account-summary > div.summary-row:nth-of-type(5) > div.left:nth-of-type(1) > div.description > span.funding-description"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained",
      "helpTopicId": "finance-required-funding"
    },
    {
      "id": "finance-overview-partner-payments-e71e415",
      "source": "- Partner Payments",
      "target": "- 伙伴付款",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "#funding-account-summary > div.summary-row:nth-of-type(4) > div.left:nth-of-type(1) > p > a",
      "observedKind": "control-label",
      "observedStates": [
        "extra-baseline",
        "opened:Show balance forecast",
        "opened:Payment Request Form"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/brand-overview-view.ihtml",
        "pathExact": "/secure/finance/app/brand-overview-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "#funding-account-summary > div.summary-row:nth-of-type(4) > div.left:nth-of-type(1) > p > a"
      },
      "match": "suffix",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained",
      "dynamicPrefix": "<original-billing-group-name>",
      "helpTopicId": "finance-invoice"
    },
    {
      "id": "finance-overview-funds-required-through-2b0d6f1",
      "source": "(funds required through",
      "target": "(所需资金截至",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "div.summary-row:nth-of-type(5) > div.left:nth-of-type(1) > div.description > span.funding-description > span",
      "observedKind": "text-node",
      "observedStates": [
        "extra-baseline",
        "opened:Show balance forecast",
        "opened:Payment Request Form"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/brand-overview-view.ihtml",
        "pathExact": "/secure/finance/app/brand-overview-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "div.summary-row:nth-of-type(5) > div.left:nth-of-type(1) > div.description > span.funding-description > span"
      },
      "match": "prefix",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained",
      "dynamicSuffix": "<original-date>"
    },
    {
      "id": "finance-overview-transaction-summary-ec2e936",
      "source": "Transaction Summary",
      "target": "资金收支摘要",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "overview",
      "observedSelector": "#funding-account > div.transaction-summary:nth-of-type(4) > h5",
      "observedKind": "label-or-heading",
      "observedStates": [
        "opened:Show balance forecast"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/brand-overview-view.ihtml",
        "pathExact": "/secure/finance/app/brand-overview-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-overview.ihtml"
        ],
        "selector": "#funding-account > div.transaction-summary:nth-of-type(4) > h5"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-make-deposit-make-deposit-94015ca",
      "source": "Make Deposit",
      "target": "充值",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div.screen > div.make-deposit-form > div.make-deposit-form > div.make-deposit-header:nth-of-type(1) > h1.make-deposit-title",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:ACH",
        "opened:Wire",
        "opened:Credit Card"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "div.screen > div.make-deposit-form > div.make-deposit-form > div.make-deposit-header:nth-of-type(1) > h1.make-deposit-title"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-fund-your-account-through-ach-transfer-cre-4fba39f",
      "source": "Fund your account through ACH transfer, Credit Card, or Wire Transfer.",
      "target": "可通过 ACH 银行扣款、信用卡或银行电汇向资金账户充值。",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div.screen > div.make-deposit-form > div.make-deposit-form > div.make-deposit-header:nth-of-type(1) > p.make-deposit-subtitle",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:ACH",
        "opened:Wire",
        "opened:Credit Card"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "div.screen > div.make-deposit-form > div.make-deposit-form > div.make-deposit-header:nth-of-type(1) > p.make-deposit-subtitle"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-payment-type-482c062",
      "source": "Payment Type",
      "target": "充值方式",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div.payment-method-selection-section:nth-of-type(1) > div.payment-method-container:nth-of-type(1) > div.iui-component.iui-field-label-pair:nth-of-type(1) > div._4-68-1_EdXeI:nth-of-type(1) > label._4-68-1_w7BC-",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:ACH",
        "opened:Credit Card"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "div.payment-method-selection-section:nth-of-type(1) > div.payment-method-container:nth-of-type(1) > div.iui-component.iui-field-label-pair:nth-of-type(1) > div:nth-of-type(1) > label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-credit-card-6328d40",
      "source": "Credit Card",
      "target": "信用卡",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "#selector-label",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:ACH",
        "opened:Wire",
        "opened:Credit Card"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "#selector-label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-ach-376811a",
      "source": "ACH",
      "target": "ACH扣款",
      "reason": "实网测得充值页原生ACH选项容器宽约128px，原长译与问号超出容器；采用ACH扣款作为短展示，现有finance-ach问号保留ACH及银行扣款的完整概念解释。只翻译固定标签Text，保留原生节点、事件、属性与表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "#selector-label",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:ACH",
        "opened:Wire",
        "opened:Credit Card"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "#selector-label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account",
      "helpTopicId": "finance-ach"
    },
    {
      "id": "finance-make-deposit-wire-5988420",
      "source": "Wire",
      "target": "银行电汇",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "#selector-label",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:ACH",
        "opened:Wire",
        "opened:Credit Card"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "#selector-label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account",
      "helpTopicId": "finance-wire-transfer"
    },
    {
      "id": "finance-make-deposit-payment-method-6411e3c",
      "source": "Payment Method",
      "target": "付款方式",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div.ach-and-card-section:nth-of-type(2) > div.payment-method-section > div.iui-component.iui-field-label-pair > div._4-68-1_EdXeI:nth-of-type(1) > label._4-68-1_w7BC-",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:ACH",
        "opened:Credit Card"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "div.ach-and-card-section:nth-of-type(2) > div.payment-method-section > div.iui-component.iui-field-label-pair > div:nth-of-type(1) > label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-view-63120c8",
      "source": "View",
      "target": "查看",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "button[data-testid=\"uicl-button\"]",
      "observedKind": "control-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:ACH"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "button[data-testid=\"uicl-button\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-required-funding-26f0b57",
      "source": "Required Funding",
      "target": "需补充资金",
      "reason": "为覆盖账户待付及逾期费用需要补充的资金，不更改系统资金需求计算。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div > div.make-deposit-form-columns > div.deposit-details:nth-of-type(2) > div.required-funding-details:nth-of-type(1) > div.required-funding-label:nth-of-type(1)",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:ACH",
        "opened:Credit Card"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "div > div.make-deposit-form-columns > div.deposit-details:nth-of-type(2) > div.required-funding-details:nth-of-type(1) > div.required-funding-label:nth-of-type(1)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account",
      "helpTopicId": "finance-required-funding"
    },
    {
      "id": "finance-make-deposit-enter-amount-52b644d",
      "source": "Enter Amount",
      "target": "输入充值金额",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "#amount-input > div._4-68-1_EdXeI:nth-of-type(1) > label._4-68-1_w7BC-",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:ACH",
        "opened:Credit Card"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "#amount-input > div:nth-of-type(1) > label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-processing-fee-fe3ae81",
      "source": "Processing fee",
      "target": "充值手续费",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div > div.make-deposit-form-columns > div.deposit-details:nth-of-type(2) > div.information-pair:nth-of-type(4) > div.top-label",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:ACH",
        "opened:Credit Card"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "div > div.make-deposit-form-columns > div.deposit-details:nth-of-type(2) > div.information-pair:nth-of-type(4) > div.top-label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account",
      "helpTopicId": "finance-deposit-fee"
    },
    {
      "id": "finance-make-deposit-funds-will-appear-within-05fdd61",
      "source": "Funds will appear within",
      "target": "预计到账时间",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div > div.make-deposit-form-columns > div.deposit-details:nth-of-type(2) > div.information-pair:nth-of-type(5) > div.top-label",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:ACH",
        "opened:Credit Card"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "div > div.make-deposit-form-columns > div.deposit-details:nth-of-type(2) > div.information-pair:nth-of-type(5) > div.top-label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-3-5-business-days-38d9b6c",
      "source": "3-5 business days",
      "target": "3-5 个工作日",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div > div.make-deposit-form-columns > div.deposit-details:nth-of-type(2) > div.information-pair:nth-of-type(5) > p.expected-deposit-time",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:ACH"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "div > div.make-deposit-form-columns > div.deposit-details:nth-of-type(2) > div.information-pair:nth-of-type(5) > p.expected-deposit-time"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-pay-a04e65f",
      "source": "Pay",
      "target": "付款",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "button[data-testid=\"pay-button\"]",
      "observedKind": "control-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:ACH",
        "opened:Credit Card"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "button[data-testid=\"pay-button\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-overview-8af5291",
      "source": "Overview",
      "target": "财务总览",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:ACH",
        "opened:Wire",
        "opened:Credit Card"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-reports-0c4096b",
      "source": "Reports",
      "target": "财务报告",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:ACH",
        "opened:Wire",
        "opened:Credit Card"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-make-deposit-8e0c1ca",
      "source": "Make Deposit",
      "target": "充值",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:ACH",
        "opened:Wire",
        "opened:Credit Card"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-transfers-9cda8d1",
      "source": "Transfers",
      "target": "伙伴资金转账",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:ACH",
        "opened:Wire",
        "opened:Credit Card"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account",
      "helpTopicId": "finance-pft"
    },
    {
      "id": "finance-make-deposit-documents-c4b2ada",
      "source": "Documents",
      "target": "账单文档",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:ACH",
        "opened:Wire",
        "opened:Credit Card"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-subscription-ec1dcfb",
      "source": "Subscription",
      "target": "订阅与用量",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:ACH",
        "opened:Wire",
        "opened:Credit Card"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-settings-7324b53",
      "source": "Settings",
      "target": "财务设置",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:ACH",
        "opened:Wire",
        "opened:Credit Card"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-settings-4f3dcc5",
      "source": "Settings",
      "target": "通知设置",
      "reason": "真实顶部通知面板的设置入口；用通知容器和精确页面作用域隔离，与财务设置菜单区分。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text._4-64-3_SuBBQ",
      "observedKind": "notification-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:ACH",
        "opened:Wire",
        "opened:Credit Card"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact"
    },
    {
      "id": "finance-make-deposit-payment-methods-b3e91df",
      "source": "Payment Methods",
      "target": "充值付款方式",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "h1[data-testid=\"payment-method-listing-header\"]",
      "observedKind": "label-or-heading",
      "observedStates": [
        "opened:View"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "h1[data-testid=\"payment-method-listing-header\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-add-payment-method-158de5c",
      "source": "Add Payment Method",
      "target": "添加付款方式",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "#btn-create",
      "observedKind": "control-label",
      "observedStates": [
        "opened:View"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "#btn-create"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-rows-2ba5f96",
      "source": "rows",
      "target": "行",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div.iui-component.iui-data-view:nth-of-type(2) > div > div.data-header:nth-of-type(1) > div.bulk-actions-and-sort > span.disabled.num-records-container",
      "observedKind": "text-node",
      "observedStates": [
        "opened:View"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "div.iui-component.iui-data-view:nth-of-type(2) > div > div.data-header:nth-of-type(1) > div.bulk-actions-and-sort > span.disabled.num-records-container"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-overview-5b7dda7",
      "source": "Overview",
      "target": "财务总览",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "opened:View"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-reports-6c23e63",
      "source": "Reports",
      "target": "财务报告",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "opened:View"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-make-deposit-f17d4f8",
      "source": "Make Deposit",
      "target": "充值",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "opened:View"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-transfers-414625c",
      "source": "Transfers",
      "target": "伙伴资金转账",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "opened:View"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account",
      "helpTopicId": "finance-pft"
    },
    {
      "id": "finance-make-deposit-documents-745d94b",
      "source": "Documents",
      "target": "账单文档",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "opened:View"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-subscription-20e0944",
      "source": "Subscription",
      "target": "订阅与用量",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "opened:View"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-settings-818b84f",
      "source": "Settings",
      "target": "财务设置",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "opened:View"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-settings-5b3e162",
      "source": "Settings",
      "target": "通知设置",
      "reason": "真实顶部通知面板的设置入口；用通知容器和精确页面作用域隔离，与财务设置菜单区分。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text._4-64-3_SuBBQ",
      "observedKind": "notification-label",
      "observedStates": [
        "opened:View"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact"
    },
    {
      "id": "finance-make-deposit-payment-type-2a5dac7",
      "source": "Payment Type",
      "target": "充值方式",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div.payment-method-selection-section:nth-of-type(1) > div.payment-method-container > div.iui-component.iui-field-label-pair:nth-of-type(1) > div._4-68-1_EdXeI:nth-of-type(1) > label._4-68-1_w7BC-",
      "observedKind": "label-or-heading",
      "observedStates": [
        "opened:Wire"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "div.payment-method-selection-section:nth-of-type(1) > div.payment-method-container > div.iui-component.iui-field-label-pair:nth-of-type(1) > div:nth-of-type(1) > label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-wire-transfer-details-bc27509",
      "source": "Wire Transfer Details",
      "target": "银行电汇信息",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div.make-deposit-form-columns > div.deposit-details:nth-of-type(2) > div.wire-component > div:nth-of-type(1) > p.heading:nth-of-type(1)",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Wire"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "div.make-deposit-form-columns > div.deposit-details:nth-of-type(2) > div.wire-component > div:nth-of-type(1) > p.heading:nth-of-type(1)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account",
      "helpTopicId": "finance-wire-transfer"
    },
    {
      "id": "finance-make-deposit-initiate-a-wire-transfer-to-impact-com-usi-55c81b4",
      "source": "Initiate a wire transfer to impact.com using the details below.",
      "target": "请使用以下收款信息，从您的银行向 impact.com 发起电汇。",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div.make-deposit-form-columns > div.deposit-details:nth-of-type(2) > div.wire-component > div:nth-of-type(1) > p.sub-heading:nth-of-type(2)",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Wire"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "div.make-deposit-form-columns > div.deposit-details:nth-of-type(2) > div.wire-component > div:nth-of-type(1) > p.sub-heading:nth-of-type(2)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-reference-your-account-id-039c372",
      "source": "Reference your account ID.",
      "target": "请在汇款附言中注明您的账户编号。",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div.make-deposit-form-columns > div.deposit-details:nth-of-type(2) > div.wire-component > div:nth-of-type(1) > p.sub-heading:nth-of-type(2)",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Wire"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "div.make-deposit-form-columns > div.deposit-details:nth-of-type(2) > div.wire-component > div:nth-of-type(1) > p.sub-heading:nth-of-type(2)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-account-name-06392e5",
      "source": "Account name",
      "target": "收款账户户名",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div.deposit-details:nth-of-type(2) > div.wire-component > div.wire-transfer-details:nth-of-type(2) > div.wire-details-label:nth-of-type(1) > p.label:nth-of-type(1)",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Wire"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "div.deposit-details:nth-of-type(2) > div.wire-component > div.wire-transfer-details:nth-of-type(2) > div.wire-details-label:nth-of-type(1) > p.label:nth-of-type(1)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-bank-name-0172e3e",
      "source": "Bank Name",
      "target": "银行名称",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div.deposit-details:nth-of-type(2) > div.wire-component > div.wire-transfer-details:nth-of-type(2) > div.wire-details-label:nth-of-type(2) > p.label:nth-of-type(1)",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Wire"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "div.deposit-details:nth-of-type(2) > div.wire-component > div.wire-transfer-details:nth-of-type(2) > div.wire-details-label:nth-of-type(2) > p.label:nth-of-type(1)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-bank-country-c683ab1",
      "source": "Bank Country",
      "target": "开户银行所在国家/地区",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div.deposit-details:nth-of-type(2) > div.wire-component > div.wire-transfer-details:nth-of-type(2) > div.wire-details-label:nth-of-type(3) > p.label:nth-of-type(1)",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Wire"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "div.deposit-details:nth-of-type(2) > div.wire-component > div.wire-transfer-details:nth-of-type(2) > div.wire-details-label:nth-of-type(3) > p.label:nth-of-type(1)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-account-number-30a5430",
      "source": "Account Number",
      "target": "银行账号",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div.deposit-details:nth-of-type(2) > div.wire-component > div.wire-transfer-details:nth-of-type(2) > div.wire-details-label:nth-of-type(4) > p.label:nth-of-type(1)",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Wire"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "div.deposit-details:nth-of-type(2) > div.wire-component > div.wire-transfer-details:nth-of-type(2) > div.wire-details-label:nth-of-type(4) > p.label:nth-of-type(1)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-swift-bic-code-15b7ab5",
      "source": "SWIFT/BIC Code",
      "target": "SWIFT/BIC 银行识别码",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div.deposit-details:nth-of-type(2) > div.wire-component > div.wire-transfer-details:nth-of-type(2) > div.wire-details-label:nth-of-type(7) > p.label:nth-of-type(1)",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Wire"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "div.deposit-details:nth-of-type(2) > div.wire-component > div.wire-transfer-details:nth-of-type(2) > div.wire-details-label:nth-of-type(7) > p.label:nth-of-type(1)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-reference-241888d",
      "source": "Reference",
      "target": "参考编号",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "div.deposit-details:nth-of-type(2) > div.wire-component > div.wire-transfer-details:nth-of-type(2) > div.wire-details-label:nth-of-type(8) > p.label:nth-of-type(1)",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Wire"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "div.deposit-details:nth-of-type(2) > div.wire-component > div.wire-transfer-details:nth-of-type(2) > div.wire-details-label:nth-of-type(8) > p.label:nth-of-type(1)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-download-payment-instructions-761f847",
      "source": "Download Payment Instructions",
      "target": "下载汇款指引",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "button[data-testid=\"button-download\"]",
      "observedKind": "control-label",
      "observedStates": [
        "opened:Wire"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "button[data-testid=\"button-download\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-make-deposit-add-credit-card-09e3eb8",
      "source": "Add Credit Card",
      "target": "添加信用卡",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "make-deposit",
      "observedSelector": "button[data-testid=\"add-payment-method-button\"]",
      "observedKind": "control-label",
      "observedStates": [
        "opened:Credit Card"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/make-deposit/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/make-deposit/ui.ihtml"
        ],
        "selector": "button[data-testid=\"add-payment-method-button\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-transfers-overview-a9e5279",
      "source": "Overview",
      "target": "财务总览",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Create Transfer",
        "deep-opened:User Initiated",
        "deep-opened:Invoice Status",
        "deep-opened:Partner",
        "deep-opened:Program",
        "deep-opened:Type",
        "deep-opened:Funding Status ·"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-reports-6060e95",
      "source": "Reports",
      "target": "财务报告",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Create Transfer",
        "deep-opened:User Initiated",
        "deep-opened:Invoice Status",
        "deep-opened:Partner",
        "deep-opened:Program",
        "deep-opened:Type",
        "deep-opened:Funding Status ·"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-make-deposit-4c1e725",
      "source": "Make Deposit",
      "target": "充值",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Create Transfer",
        "deep-opened:User Initiated",
        "deep-opened:Invoice Status",
        "deep-opened:Partner",
        "deep-opened:Program",
        "deep-opened:Type",
        "deep-opened:Funding Status ·"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-transfers-51dc5f8",
      "source": "Transfers",
      "target": "伙伴资金转账",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Create Transfer",
        "deep-opened:User Initiated",
        "deep-opened:Invoice Status",
        "deep-opened:Partner",
        "deep-opened:Program",
        "deep-opened:Type",
        "deep-opened:Funding Status ·"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner",
      "helpTopicId": "finance-pft"
    },
    {
      "id": "finance-transfers-documents-74b5474",
      "source": "Documents",
      "target": "账单文档",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Create Transfer",
        "deep-opened:User Initiated",
        "deep-opened:Invoice Status",
        "deep-opened:Partner",
        "deep-opened:Program",
        "deep-opened:Type",
        "deep-opened:Funding Status ·"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-subscription-c52589c",
      "source": "Subscription",
      "target": "订阅与用量",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Create Transfer",
        "deep-opened:User Initiated",
        "deep-opened:Invoice Status",
        "deep-opened:Partner",
        "deep-opened:Program",
        "deep-opened:Type",
        "deep-opened:Funding Status ·"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-settings-55cdd2a",
      "source": "Settings",
      "target": "财务设置",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Create Transfer",
        "deep-opened:User Initiated",
        "deep-opened:Invoice Status",
        "deep-opened:Partner",
        "deep-opened:Program",
        "deep-opened:Type",
        "deep-opened:Funding Status ·"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-settings-03e09e4",
      "source": "Settings",
      "target": "通知设置",
      "reason": "真实顶部通知面板的设置入口；用通知容器和精确页面作用域隔离，与财务设置菜单区分。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text._4-64-3_SuBBQ",
      "observedKind": "notification-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Create Transfer",
        "deep-opened:User Initiated",
        "deep-opened:Invoice Status",
        "deep-opened:Partner",
        "deep-opened:Program",
        "deep-opened:Type",
        "deep-opened:Funding Status ·"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact"
    },
    {
      "id": "finance-transfers-transfers-49e11f1",
      "source": "Transfers",
      "target": "伙伴资金转账",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "div.iui-component.iui-data-view > div > div.data-header:nth-of-type(1) > div.top-info:nth-of-type(1) > h1",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "deep-opened:User Initiated",
        "deep-opened:Invoice Status",
        "deep-opened:Partner",
        "deep-opened:Program",
        "deep-opened:Type",
        "deep-opened:Funding Status ·"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "div.iui-component.iui-data-view > div > div.data-header:nth-of-type(1) > div.top-info:nth-of-type(1) > h1"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner",
      "helpTopicId": "finance-pft"
    },
    {
      "id": "finance-transfers-bulk-upload-transfers-f842091",
      "source": "Bulk Upload Transfers",
      "target": "批量导入伙伴转账",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "button[data-testid=\"uicl-button\"]",
      "observedKind": "control-label",
      "observedStates": [
        "initial",
        "deep-opened:User Initiated",
        "deep-opened:Invoice Status",
        "deep-opened:Partner",
        "deep-opened:Program",
        "deep-opened:Type",
        "deep-opened:Funding Status ·"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "button[data-testid=\"uicl-button\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-create-transfer-06b5b5a",
      "source": "Create Transfer",
      "target": "创建伙伴转账",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "button[data-testid=\"uicl-button\"]",
      "observedKind": "control-label",
      "observedStates": [
        "initial",
        "deep-opened:User Initiated",
        "deep-opened:Invoice Status",
        "deep-opened:Partner",
        "deep-opened:Program",
        "deep-opened:Type",
        "deep-opened:Funding Status ·"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "button[data-testid=\"uicl-button\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner",
      "helpTopicId": "finance-pft"
    },
    {
      "id": "finance-transfers-partner-bf7529e",
      "source": "Partner",
      "target": "合作伙伴",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "span.filter:nth-of-type(2) > div.iui-component.iui-multiselect-input > div.btn-container > button.responsive.outline > span",
      "observedKind": "control-label",
      "observedStates": [
        "initial",
        "deep-opened:User Initiated",
        "deep-opened:Invoice Status",
        "deep-opened:Program",
        "deep-opened:Type",
        "deep-opened:Funding Status ·"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "span.filter:nth-of-type(2) > div.iui-component.iui-multiselect-input > div.btn-container > button.responsive.outline > span"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-program-1083db3",
      "source": "Program",
      "target": "推广计划",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "span.filter:nth-of-type(3) > div.iui-component.iui-multiselect-input > div.btn-container > button.responsive.outline > span",
      "observedKind": "control-label",
      "observedStates": [
        "initial",
        "deep-opened:User Initiated",
        "deep-opened:Invoice Status",
        "deep-opened:Partner",
        "deep-opened:Type",
        "deep-opened:Funding Status ·"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "span.filter:nth-of-type(3) > div.iui-component.iui-multiselect-input > div.btn-container > button.responsive.outline > span"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-type-9f36f79",
      "source": "Type",
      "target": "转账类型",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "span.filter:nth-of-type(4) > div.iui-component.iui-multiselect-input > div.btn-container > button.responsive.outline > span",
      "observedKind": "control-label",
      "observedStates": [
        "initial",
        "deep-opened:User Initiated",
        "deep-opened:Invoice Status",
        "deep-opened:Partner",
        "deep-opened:Program",
        "deep-opened:Funding Status ·"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "span.filter:nth-of-type(4) > div.iui-component.iui-multiselect-input > div.btn-container > button.responsive.outline > span"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-user-initiated-3250b6d",
      "source": "User Initiated",
      "target": "发起人",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "span.filter:nth-of-type(5) > div.iui-component.iui-multiselect-input > div.btn-container > button.responsive.outline > span",
      "observedKind": "control-label",
      "observedStates": [
        "initial",
        "deep-opened:Invoice Status",
        "deep-opened:Partner",
        "deep-opened:Program",
        "deep-opened:Type",
        "deep-opened:Funding Status ·"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "span.filter:nth-of-type(5) > div.iui-component.iui-multiselect-input > div.btn-container > button.responsive.outline > span"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-funding-status-3385a8d",
      "source": "Funding Status ·",
      "target": "转账状态 ·",
      "reason": "伙伴资金转账的结算进度（未到期、逾期、已转账或已冲回），不等于伙伴银行卡提现到账。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "span.filter:nth-of-type(6) > div.iui-component.iui-multiselect-input > div.btn-container > button.responsive.outline > span",
      "observedKind": "control-label",
      "observedStates": [
        "initial",
        "deep-opened:User Initiated",
        "deep-opened:Invoice Status",
        "deep-opened:Partner",
        "deep-opened:Program",
        "deep-opened:Type"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "span.filter:nth-of-type(6) > div.iui-component.iui-multiselect-input > div.btn-container > button.responsive.outline > span"
      },
      "match": "prefix",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner",
      "dynamicSuffix": "<original-count>",
      "helpTopicId": "finance-transfer-status"
    },
    {
      "id": "finance-transfers-invoice-status-6c51997",
      "source": "Invoice Status",
      "target": "开账单状态",
      "reason": "是否已向付款方开账单的状态，区别伙伴转账的结算状态。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "span.filter:nth-of-type(7) > div.iui-component.iui-multiselect-input > div.btn-container > button.responsive.outline > span",
      "observedKind": "control-label",
      "observedStates": [
        "initial",
        "deep-opened:User Initiated",
        "deep-opened:Partner",
        "deep-opened:Program",
        "deep-opened:Type",
        "deep-opened:Funding Status ·"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "span.filter:nth-of-type(7) > div.iui-component.iui-multiselect-input > div.btn-container > button.responsive.outline > span"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-clear-filters-4a8d417",
      "source": "Clear Filters",
      "target": "清除筛选条件",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "button[data-testid=\"uicl-button\"]",
      "observedKind": "control-label",
      "observedStates": [
        "initial",
        "deep-opened:User Initiated",
        "deep-opened:Invoice Status",
        "deep-opened:Partner",
        "deep-opened:Program",
        "deep-opened:Type",
        "deep-opened:Funding Status ·"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "button[data-testid=\"uicl-button\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-rows-b943cb1",
      "source": "rows",
      "target": "行",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "div.iui-component.iui-data-view > div > div.data-header:nth-of-type(1) > div.bulk-actions-and-sort:nth-of-type(3) > span.num-records-container",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "deep-opened:User Initiated",
        "deep-opened:Invoice Status",
        "deep-opened:Partner",
        "deep-opened:Program",
        "deep-opened:Type",
        "deep-opened:Funding Status ·"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "div.iui-component.iui-data-view > div > div.data-header:nth-of-type(1) > div.bulk-actions-and-sort:nth-of-type(3) > span.num-records-container"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-transfer-to-1d1ab8c",
      "source": "Transfer To",
      "target": "收款伙伴",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-0\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-0\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-program-24d4dcf",
      "source": "Program",
      "target": "推广计划",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-1\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-1\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-type-c9908c1",
      "source": "Type",
      "target": "转账类型",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-2\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-2\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-user-initiated-b81b3d6",
      "source": "User Initiated",
      "target": "发起人",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-3\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-3\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-date-created-10cb951",
      "source": "Date Created",
      "target": "创建日期",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-4\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-4\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-transfer-date-502a6de",
      "source": "Transfer Date",
      "target": "转账日期",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-5\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-5\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-amount-adeed3d",
      "source": "Amount",
      "target": "金额",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-6\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-6\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-funding-status-7b359b3",
      "source": "Funding Status",
      "target": "转账状态",
      "reason": "伙伴资金转账的结算进度（未到期、逾期、已转账或已冲回），不等于伙伴银行卡提现到账。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-7\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-7\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner",
      "helpTopicId": "finance-transfer-status"
    },
    {
      "id": "finance-transfers-sorry-there-s-no-data-to-show-de58e1f",
      "source": "Sorry! There's no data to show",
      "target": "当前没有可显示的数据",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "div.iui-component.iui-data-view > div > div.data-container:nth-of-type(3) > div.no-results-container:nth-of-type(2) > div",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "deep-opened:User Initiated",
        "deep-opened:Invoice Status",
        "deep-opened:Partner",
        "deep-opened:Program",
        "deep-opened:Type",
        "deep-opened:Funding Status ·"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "div.iui-component.iui-data-view > div > div.data-container:nth-of-type(3) > div.no-results-container:nth-of-type(2) > div"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-create-transfer-9f43877",
      "source": "Create Transfer",
      "target": "创建伙伴转账",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "header-text[data-testid=\"uicl-page-header-title\"]",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Create Transfer"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "pathExact": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "header-text[data-testid=\"uicl-page-header-title\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner",
      "helpTopicId": "finance-pft"
    },
    {
      "id": "finance-transfers-transfer-to-28f1b2d",
      "source": "Transfer To",
      "target": "收款伙伴",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "div.iui-component.iui-form-page:nth-of-type(3) > div.inputs-container:nth-of-type(1) > div.input-container:nth-of-type(1) > div:nth-of-type(1) > p.heading-label:nth-of-type(1)",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Create Transfer"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "pathExact": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "div.iui-component.iui-form-page:nth-of-type(3) > div.inputs-container:nth-of-type(1) > div.input-container:nth-of-type(1) > div:nth-of-type(1) > p.heading-label:nth-of-type(1)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-select-which-partner-should-receive-this-t-b12f3df",
      "source": "Select which partner should receive this transfer",
      "target": "选择接收这笔转账的合作伙伴",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "div.iui-component.iui-form-page:nth-of-type(3) > div.inputs-container:nth-of-type(1) > div.input-container:nth-of-type(1) > div:nth-of-type(1) > p.subheading-label:nth-of-type(2)",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Create Transfer"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "pathExact": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "div.iui-component.iui-form-page:nth-of-type(3) > div.inputs-container:nth-of-type(1) > div.input-container:nth-of-type(1) > div:nth-of-type(1) > p.subheading-label:nth-of-type(2)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-select-d38ec8c",
      "source": "Select",
      "target": "请选择",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "div:nth-of-type(2) > div.iui-component.iui-multiselect-input > div.btn-container > button.responsive.outline > span._4-71-1_4Xigi.please-select:nth-of-type(1)",
      "observedKind": "control-label",
      "observedStates": [
        "opened:Create Transfer"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "pathExact": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "div:nth-of-type(2) > div.iui-component.iui-multiselect-input > div.btn-container > button.responsive.outline > span.please-select:nth-of-type(1)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-program-093aa65",
      "source": "Program",
      "target": "推广计划",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "#app > div.iui-component.iui-form-page:nth-of-type(3) > div.inputs-container:nth-of-type(1) > div.input-container:nth-of-type(2) > p.heading-label",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Create Transfer"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "pathExact": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "#app > div.iui-component.iui-form-page:nth-of-type(3) > div.inputs-container:nth-of-type(1) > div.input-container:nth-of-type(2) > p.heading-label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-select-f36ad88",
      "source": "Select",
      "target": "请选择",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "div > div.iui-component.iui-multiselect-input > div.btn-container > button.responsive.outline > span._4-71-1_4Xigi.please-select:nth-of-type(1)",
      "observedKind": "control-label",
      "observedStates": [
        "opened:Create Transfer"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "pathExact": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "div > div.iui-component.iui-multiselect-input > div.btn-container > button.responsive.outline > span.please-select:nth-of-type(1)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-event-type-2572adc",
      "source": "Event Type",
      "target": "事件类型",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "#app > div.iui-component.iui-form-page:nth-of-type(3) > div.inputs-container:nth-of-type(1) > div.input-container:nth-of-type(3) > p.heading-label",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Create Transfer"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "pathExact": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "#app > div.iui-component.iui-form-page:nth-of-type(3) > div.inputs-container:nth-of-type(1) > div.input-container:nth-of-type(3) > p.heading-label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-associate-transfer-with-an-event-type-811ef01",
      "source": "Associate transfer with an event type",
      "target": "将转账关联到一个事件类型",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "#event-type-selection > div._4-71-1_uG1JJ > label._4-71-1_oto45._4-71-1_ryDSx",
      "observedKind": "label-or-heading",
      "observedStates": [
        "opened:Create Transfer"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "pathExact": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "#event-type-selection > div > label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-select-event-type-9c211c3",
      "source": "Select Event Type",
      "target": "选择事件类型",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "div:nth-of-type(2) > div.iui-component.iui-multiselect-input > div.btn-container > button.responsive.outline > span._4-71-1_4Xigi.please-select:nth-of-type(1)",
      "observedKind": "control-label",
      "observedStates": [
        "opened:Create Transfer"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "pathExact": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "div:nth-of-type(2) > div.iui-component.iui-multiselect-input > div.btn-container > button.responsive.outline > span.please-select:nth-of-type(1)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-transaction-details-1a7dabd",
      "source": "Transaction Details",
      "target": "转账明细",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "div.iui-component.iui-form-page:nth-of-type(3) > div.inputs-container:nth-of-type(1) > div.input-container:nth-of-type(4) > div:nth-of-type(1) > p.heading-label:nth-of-type(1)",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Create Transfer"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "pathExact": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "div.iui-component.iui-form-page:nth-of-type(3) > div.inputs-container:nth-of-type(1) > div.input-container:nth-of-type(4) > div:nth-of-type(1) > p.heading-label:nth-of-type(1)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-select-the-transaction-type-and-amount-you-009f5c0",
      "source": "Select the transaction type and amount you want to transfer",
      "target": "选择转账类型，并输入转账金额",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "div.iui-component.iui-form-page:nth-of-type(3) > div.inputs-container:nth-of-type(1) > div.input-container:nth-of-type(4) > div:nth-of-type(1) > p.subheading-label:nth-of-type(2)",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Create Transfer"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "pathExact": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "div.iui-component.iui-form-page:nth-of-type(3) > div.inputs-container:nth-of-type(1) > div.input-container:nth-of-type(4) > div:nth-of-type(1) > p.subheading-label:nth-of-type(2)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-type-ec7ef41",
      "source": "Type",
      "target": "转账类型",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "#transaction-type > div._4-71-1_EdXeI:nth-of-type(1) > label._4-71-1_w7BC-",
      "observedKind": "label-or-heading",
      "observedStates": [
        "opened:Create Transfer"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "pathExact": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "#transaction-type > div:nth-of-type(1) > label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-amount-ce20cef",
      "source": "Amount",
      "target": "金额",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "#transaction-amount > div > div.iui-component.iui-field-label-pair > div._4-71-1_EdXeI:nth-of-type(1) > label._4-71-1_w7BC-",
      "observedKind": "label-or-heading",
      "observedStates": [
        "opened:Create Transfer"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "pathExact": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "#transaction-amount > div > div.iui-component.iui-field-label-pair > div:nth-of-type(1) > label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-you-pay-e567897",
      "source": "You Pay",
      "target": "您需支付",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "#you-pay-label > div._4-71-1_EdXeI:nth-of-type(1) > label._4-71-1_w7BC-",
      "observedKind": "label-or-heading",
      "observedStates": [
        "opened:Create Transfer"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "pathExact": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "#you-pay-label > div:nth-of-type(1) > label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-partner-receives-3063971",
      "source": "Partner Receives",
      "target": "伙伴应收金额",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "#partner-receives-label > div._4-71-1_EdXeI:nth-of-type(1) > label._4-71-1_w7BC-",
      "observedKind": "label-or-heading",
      "observedStates": [
        "opened:Create Transfer"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "pathExact": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "#partner-receives-label > div:nth-of-type(1) > label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-invoice-details-e60bcc6",
      "source": "Invoice Details",
      "target": "账单安排",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "div.iui-component.iui-form-page:nth-of-type(3) > div.inputs-container:nth-of-type(1) > div.input-container:nth-of-type(5) > div:nth-of-type(1) > p.heading-label:nth-of-type(1)",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Create Transfer"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "pathExact": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "div.iui-component.iui-form-page:nth-of-type(3) > div.inputs-container:nth-of-type(1) > div.input-container:nth-of-type(5) > div:nth-of-type(1) > p.heading-label:nth-of-type(1)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-here-you-can-schedule-when-the-transfer-sh-2f8b2a4",
      "source": "Here you can schedule when the transfer should occur",
      "target": "在此设置这笔转账的账单和结算安排",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "div.iui-component.iui-form-page:nth-of-type(3) > div.inputs-container:nth-of-type(1) > div.input-container:nth-of-type(5) > div:nth-of-type(1) > p.subheading-label:nth-of-type(2)",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Create Transfer"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "pathExact": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "div.iui-component.iui-form-page:nth-of-type(3) > div.inputs-container:nth-of-type(1) > div.input-container:nth-of-type(5) > div:nth-of-type(1) > p.subheading-label:nth-of-type(2)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-invoice-month-9870f26",
      "source": "Invoice month",
      "target": "账单月份",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "#specify-invoice-month > div._4-71-1_EdXeI:nth-of-type(1) > label._4-71-1_w7BC-",
      "observedKind": "label-or-heading",
      "observedStates": [
        "opened:Create Transfer"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "pathExact": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "#specify-invoice-month > div:nth-of-type(1) > label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner",
      "helpTopicId": "finance-transfer-invoice-month"
    },
    {
      "id": "finance-transfers-specify-invoice-month-aa92952",
      "source": "Specify invoice month",
      "target": "指定账单月份",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "#specify-inv-month > div._4-71-1_uG1JJ > label._4-71-1_oto45._4-71-1_ryDSx",
      "observedKind": "label-or-heading",
      "observedStates": [
        "opened:Create Transfer"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "pathExact": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "#specify-inv-month > div > label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner",
      "helpTopicId": "finance-transfer-invoice-month"
    },
    {
      "id": "finance-transfers-send-this-transfer-immediately-7aaa200",
      "source": "Send this transfer immediately",
      "target": "立即转账",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "#immediate-transfer > div._4-71-1_uG1JJ > label._4-71-1_oto45._4-71-1_ryDSx",
      "observedKind": "label-or-heading",
      "observedStates": [
        "opened:Create Transfer"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "pathExact": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "#immediate-transfer > div > label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-activity-period-60625f5",
      "source": "Activity Period",
      "target": "费用分摊期间",
      "reason": "官方PFT文档说明费用按起止日期范围均摊至绩效报表；区别账单月份、结算日和银行到账时间。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "#activity-period > div._4-71-1_EdXeI:nth-of-type(1) > label._4-71-1_w7BC-",
      "observedKind": "label-or-heading",
      "observedStates": [
        "opened:Create Transfer"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "pathExact": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "#activity-period > div:nth-of-type(1) > label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner",
      "helpTopicId": "finance-transfer-activity-period"
    },
    {
      "id": "finance-transfers-to-28b5223",
      "source": "to",
      "target": "至",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "#activity-period > div._4-71-1_uG1JJ:nth-of-type(2) > div.activity-date-container > p",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Create Transfer"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "pathExact": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "#activity-period > div:nth-of-type(2) > div.activity-date-container > p"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-transfer-date-aab3fb8",
      "source": "Transfer Date",
      "target": "转账日期",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "#transfer-date > div._4-71-1_EdXeI:nth-of-type(1) > label._4-71-1_w7BC-",
      "observedKind": "label-or-heading",
      "observedStates": [
        "opened:Create Transfer"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "pathExact": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "#transfer-date > div:nth-of-type(1) > label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-reporting-details-f9e05ad",
      "source": "Reporting Details",
      "target": "报表附加字段",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "div.inputs-container:nth-of-type(1) > div.input-container:nth-of-type(6) > div > div.action-container > p.heading-label",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Create Transfer"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "pathExact": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "div.inputs-container:nth-of-type(1) > div.input-container:nth-of-type(6) > div > div.action-container > p.heading-label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-add-details-you-would-like-to-see-in-repor-92b862e",
      "source": "Add details you would like to see in reporting",
      "target": "添加希望在报表中显示的信息",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "div.iui-component.iui-form-page:nth-of-type(3) > div.inputs-container:nth-of-type(1) > div.input-container:nth-of-type(6) > div > p.subheading-label",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Create Transfer"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "pathExact": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "div.iui-component.iui-form-page:nth-of-type(3) > div.inputs-container:nth-of-type(1) > div.input-container:nth-of-type(6) > div > p.subheading-label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-comments-4f3032f",
      "source": "Comments",
      "target": "备注",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "div.iui-component.iui-form-page:nth-of-type(3) > div.inputs-container:nth-of-type(1) > div.input-container:nth-of-type(7) > div.action-container > p.heading-label",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Create Transfer"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "pathExact": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "div.iui-component.iui-form-page:nth-of-type(3) > div.inputs-container:nth-of-type(1) > div.input-container:nth-of-type(7) > div.action-container > p.heading-label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-next-2c9b0d5",
      "source": "Next",
      "target": "下一步",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "button[data-testid=\"uicl-button\"]",
      "observedKind": "control-label",
      "observedStates": [
        "opened:Create Transfer"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "pathExact": "/secure/finance/app/advertiser-create-transfer-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "button[data-testid=\"uicl-button\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-user-initiated-4d2880a",
      "source": "User Initiated",
      "target": "发起人",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "span.filter:nth-of-type(5) > div.iui-component.iui-multiselect-input > div.btn-container > button.focused.responsive > span",
      "observedKind": "control-label",
      "observedStates": [
        "deep-opened:User Initiated"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "span.filter:nth-of-type(5) > div.iui-component.iui-multiselect-input > div.btn-container > button.focused.responsive > span"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-clear-893105f",
      "source": "Clear",
      "target": "清除",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "button[data-testid=\"uicl-multi-select-input-clear-button\"]",
      "observedKind": "control-label",
      "observedStates": [
        "deep-opened:User Initiated",
        "deep-opened:Invoice Status",
        "deep-opened:Partner",
        "deep-opened:Program",
        "deep-opened:Type",
        "deep-opened:Funding Status ·"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "button[data-testid=\"uicl-multi-select-input-clear-button\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-invoice-status-b12bd3b",
      "source": "Invoice Status",
      "target": "开账单状态",
      "reason": "是否已向付款方开账单的状态，区别伙伴转账的结算状态。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "span.filter:nth-of-type(7) > div.iui-component.iui-multiselect-input > div.btn-container > button.focused.responsive > span",
      "observedKind": "control-label",
      "observedStates": [
        "deep-opened:Invoice Status"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "span.filter:nth-of-type(7) > div.iui-component.iui-multiselect-input > div.btn-container > button.focused.responsive > span"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-all-1b5b216",
      "source": "All",
      "target": "全部",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "div._4-49-7_AJT64._4-49-7_z1H5z:nth-of-type(1) > ul.iui-component.iui-list > li:nth-of-type(1) > div._4-49-7_VbPJn._4-49-7_MBWff > div.text-ellipsis._4-49-7_Baf2T",
      "observedKind": "text-node",
      "observedStates": [
        "deep-opened:Invoice Status",
        "deep-opened:Partner"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "div:nth-of-type(1) > ul.iui-component.iui-list > li:nth-of-type(1) > div > div.text-ellipsis"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-partner-b93c0d0",
      "source": "Partner",
      "target": "合作伙伴",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "span.filter:nth-of-type(2) > div.iui-component.iui-multiselect-input > div.btn-container > button.focused.responsive > span",
      "observedKind": "control-label",
      "observedStates": [
        "deep-opened:Partner"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "span.filter:nth-of-type(2) > div.iui-component.iui-multiselect-input > div.btn-container > button.focused.responsive > span"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-program-545768c",
      "source": "Program",
      "target": "推广计划",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "span.filter:nth-of-type(3) > div.iui-component.iui-multiselect-input > div.btn-container > button.focused.responsive > span",
      "observedKind": "control-label",
      "observedStates": [
        "deep-opened:Program"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "span.filter:nth-of-type(3) > div.iui-component.iui-multiselect-input > div.btn-container > button.focused.responsive > span"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-type-77818c4",
      "source": "Type",
      "target": "转账类型",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "span.filter:nth-of-type(4) > div.iui-component.iui-multiselect-input > div.btn-container > button.focused.responsive > span",
      "observedKind": "control-label",
      "observedStates": [
        "deep-opened:Type"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "span.filter:nth-of-type(4) > div.iui-component.iui-multiselect-input > div.btn-container > button.focused.responsive > span"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner"
    },
    {
      "id": "finance-transfers-funding-status-b2bce46",
      "source": "Funding Status ·",
      "target": "转账状态 ·",
      "reason": "伙伴资金转账的结算进度（未到期、逾期、已转账或已冲回），不等于伙伴银行卡提现到账。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "span.filter:nth-of-type(6) > div.iui-component.iui-multiselect-input > div.btn-container > button.focused.responsive > span",
      "observedKind": "control-label",
      "observedStates": [
        "deep-opened:Funding Status ·"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "selector": "span.filter:nth-of-type(6) > div.iui-component.iui-multiselect-input > div.btn-container > button.focused.responsive > span"
      },
      "match": "prefix",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner",
      "dynamicSuffix": "<original-count>",
      "helpTopicId": "finance-transfer-status"
    },
    {
      "id": "finance-transfers-overdue-funding-status-observed",
      "source": "Overdue",
      "target": "已逾期",
      "reason": "官方伙伴转账详情将Overdue列为Funding Status固定枚举，表示该转账已逾期，区别未到期、已转账及已冲回，不推断伙伴银行卡到账。本轮真实打开Funding Status筛选后观察到此选项；仅在已观察第6筛选按钮处于focused且其它筛选未同时focused的实际ul/li/text-ellipsis组件生效，避免同名伙伴、用户或业务值被替换。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "transfers",
      "observedSelector": "div._4-49-7_AJT64._4-49-7_z1H5z:nth-of-type(1) > ul.iui-component.iui-list > li:nth-of-type(2) > div._4-49-7_VbPJn._4-49-7_MBWff > div.text-ellipsis._4-49-7_Baf2T",
      "observedKind": "text-node",
      "observedStates": [
        "deep-opened:Funding Status ·"
      ],
      "fixedEnumFilter": "Funding Status ·",
      "enumEvidence": "new visible native option after verified fixed-label filter click",
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "pathExact": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-funds-transfer.ihtml"
        ],
        "topQuery": {
          "u": "/secure/finance/app/manage-partner-funds-transfer-flow.ihtml"
        },
        "selector": "body:has(span.filter:nth-of-type(6) > div.iui-component.iui-multiselect-input > div.btn-container > button.focused.responsive):not(:has(span.filter:not(:nth-of-type(6)) > div.iui-component.iui-multiselect-input > div.btn-container > button.focused.responsive)) div._4-49-7_AJT64._4-49-7_z1H5z:nth-of-type(1) > ul.iui-component.iui-list > li:nth-of-type(2) > div._4-49-7_VbPJn._4-49-7_MBWff > div.text-ellipsis._4-49-7_Baf2T"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/view-transfer-details"
    },
    {
      "id": "finance-subscription-overview-684574f",
      "source": "Overview",
      "target": "财务总览",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "subscription",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/finance-subscription.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/finance-subscription.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-subscription.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/your-subscription/view-your-impactcom-subscription-and-usage-details"
    },
    {
      "id": "finance-subscription-reports-85e37e1",
      "source": "Reports",
      "target": "财务报告",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "subscription",
      "observedSelector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/finance-subscription.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/finance-subscription.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-subscription.ihtml"
        ],
        "selector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/your-subscription/view-your-impactcom-subscription-and-usage-details"
    },
    {
      "id": "finance-subscription-make-deposit-2476e85",
      "source": "Make Deposit",
      "target": "充值",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "subscription",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/finance-subscription.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/finance-subscription.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-subscription.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/your-subscription/view-your-impactcom-subscription-and-usage-details"
    },
    {
      "id": "finance-subscription-transfers-d0e68c4",
      "source": "Transfers",
      "target": "伙伴资金转账",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "subscription",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/finance-subscription.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/finance-subscription.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-subscription.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/your-subscription/view-your-impactcom-subscription-and-usage-details",
      "helpTopicId": "finance-pft"
    },
    {
      "id": "finance-subscription-documents-9954455",
      "source": "Documents",
      "target": "账单文档",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "subscription",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/finance-subscription.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/finance-subscription.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-subscription.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/your-subscription/view-your-impactcom-subscription-and-usage-details"
    },
    {
      "id": "finance-subscription-subscription-d5ee09e",
      "source": "Subscription",
      "target": "订阅与用量",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "subscription",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/finance-subscription.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/finance-subscription.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-subscription.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/your-subscription/view-your-impactcom-subscription-and-usage-details"
    },
    {
      "id": "finance-subscription-settings-c0d97dd",
      "source": "Settings",
      "target": "财务设置",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "subscription",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/finance-subscription.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/finance-subscription.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-subscription.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/your-subscription/view-your-impactcom-subscription-and-usage-details"
    },
    {
      "id": "finance-subscription-settings-7f63f73",
      "source": "Settings",
      "target": "通知设置",
      "reason": "真实顶部通知面板的设置入口；用通知容器和精确页面作用域隔离，与财务设置菜单区分。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "subscription",
      "observedSelector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text._4-64-3_SuBBQ",
      "observedKind": "notification-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/finance-subscription.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/finance-subscription.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-subscription.ihtml"
        ],
        "selector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact"
    },
    {
      "id": "finance-subscription-subscription-information-not-available-d12d3d4",
      "source": "Subscription information not available",
      "target": "订阅信息暂不可用",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "subscription",
      "observedSelector": "#vueInstance > div.app-page > div.container > div.header:nth-of-type(1)",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/view-subscription-flow.ihtml",
        "pathExact": "/secure/finance/app/view-subscription-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-subscription.ihtml"
        ],
        "selector": "#vueInstance > div.app-page > div.container > div.header:nth-of-type(1)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/your-subscription/view-your-impactcom-subscription-and-usage-details"
    },
    {
      "id": "finance-subscription-we-are-currently-not-able-to-display-the-t-2acb3f3",
      "source": "We are currently not able to display the terms of your subscription.",
      "target": "目前无法显示您的订阅条款。",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "subscription",
      "observedSelector": "#vueInstance > div.app-page > div.container > div.description:nth-of-type(2) > p",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/view-subscription-flow.ihtml",
        "pathExact": "/secure/finance/app/view-subscription-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-subscription.ihtml"
        ],
        "selector": "#vueInstance > div.app-page > div.container > div.description:nth-of-type(2) > p"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/your-subscription/view-your-impactcom-subscription-and-usage-details"
    },
    {
      "id": "finance-subscription-please-try-again-later-thank-you-for-your--09773e9",
      "source": "Please try again later. Thank you for your patience.",
      "target": "请稍后再试，感谢您的耐心等待。",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "subscription",
      "observedSelector": "#vueInstance > div.app-page > div.container > div.description:nth-of-type(2) > p",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/view-subscription-flow.ihtml",
        "pathExact": "/secure/finance/app/view-subscription-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-subscription.ihtml"
        ],
        "selector": "#vueInstance > div.app-page > div.container > div.description:nth-of-type(2) > p"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/your-subscription/view-your-impactcom-subscription-and-usage-details"
    },
    {
      "id": "finance-monthly-close-monthly-close-by-event-date-b609620",
      "source": "Monthly Close by Event Date",
      "target": "按转化发生月份月结",
      "reason": "按转化发生月份归集费用的月结报告，区别资金流水和锁定月份。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "div > div > div.titleContainer--q4uoJ:nth-of-type(2) > div.reportTitle--klMti:nth-of-type(1) > span",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "div > div > div[class*=\"titleContainer--\"]:nth-of-type(2) > div[class*=\"reportTitle--\"]:nth-of-type(1) > span",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report",
      "helpTopicId": "finance-monthly-close"
    },
    {
      "id": "finance-monthly-close-show-de89c70",
      "source": "Show:",
      "target": "显示项：",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "#reportFormDiv > div.filters--bVxcQ > div.selectFilter--TiX39 > span.baseFilterButton--xXPx9.false > span",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "#reportFormDiv > div[class*=\"filters--\"] > div[class*=\"selectFilter--\"] > span[class*=\"baseFilterButton--\"] > span",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report"
    },
    {
      "id": "finance-monthly-close-none-5be4c37",
      "source": "None",
      "target": "未选择",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "div.filters--bVxcQ > div.selectFilter--TiX39 > span.baseFilterButton--xXPx9.false > span > strong",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "div[class*=\"filters--\"] > div[class*=\"selectFilter--\"] > span[class*=\"baseFilterButton--\"] > span > strong",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report"
    },
    {
      "id": "finance-monthly-close-apply-93c436f",
      "source": "Apply",
      "target": "应用",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "#reportFormDiv > div.filters--bVxcQ > button.searchButton--X043d",
      "observedKind": "control-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "#reportFormDiv > div[class*=\"filters--\"] > button[class*=\"searchButton--\"]",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report"
    },
    {
      "id": "finance-monthly-close-partner-fees-4d00f2a",
      "source": "Partner Fees",
      "target": "伙伴费用",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "div > div.reportContainer--NoSIx.false > div:nth-of-type(1) > div:nth-of-type(1) > h3",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "div > div[class*=\"reportContainer--\"] > div:nth-of-type(1) > div:nth-of-type(1) > h3",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report"
    },
    {
      "id": "finance-monthly-close-month-34aa774",
      "source": "month",
      "target": "月份",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "div.partitionInner--GfmnB > div.tr > div > div.th.headerCell--G6LXC > span:nth-of-type(2)",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "div[class*=\"partitionInner--\"] > div.tr > div > div.th[class*=\"headerCell--\"] > span:nth-of-type(2)",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report"
    },
    {
      "id": "finance-monthly-close-currency-691e23b",
      "source": "currency",
      "target": "币种",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "div.partitionInner--GfmnB > div.tr > div > div.th.headerCell--G6LXC:nth-of-type(1) > span:nth-of-type(2)",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "div[class*=\"partitionInner--\"] > div.tr > div > div.th[class*=\"headerCell--\"]:nth-of-type(1) > span:nth-of-type(2)",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report"
    },
    {
      "id": "finance-monthly-close-actions-paid-69c6d4d",
      "source": "% Actions Paid",
      "target": "转化已付比例",
      "reason": "官方月结说明为转化对应付款已完成的比例，可按小数显示；区别转化佣金总额、已付金额与资金账户余额。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "div.partitionInner--GfmnB > div.tr > div > div.th.headerCell--G6LXC:nth-of-type(2) > span:nth-of-type(2)",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "div[class*=\"partitionInner--\"] > div.tr > div > div.th[class*=\"headerCell--\"]:nth-of-type(2) > span:nth-of-type(2)",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report",
      "helpTopicId": "finance-actions-paid"
    },
    {
      "id": "finance-monthly-close-other-costs-paid-fcacae1",
      "source": "% Other Costs Paid",
      "target": "其他费用已付比例",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "div.partitionInner--GfmnB > div.tr > div > div.th.headerCell--G6LXC:nth-of-type(3) > span:nth-of-type(2)",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "div[class*=\"partitionInner--\"] > div.tr > div > div.th[class*=\"headerCell--\"]:nth-of-type(3) > span:nth-of-type(2)",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report"
    },
    {
      "id": "finance-monthly-close-action-cost-b6986e3",
      "source": "action cost",
      "target": "转化佣金",
      "reason": "转化对应的伙伴佣金，数值与付款状态保持。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "div.partitionInner--GfmnB > div.tr > div > div.th.headerCell--G6LXC:nth-of-type(4) > span:nth-of-type(2)",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "div[class*=\"partitionInner--\"] > div.tr > div > div.th[class*=\"headerCell--\"]:nth-of-type(4) > span:nth-of-type(2)",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report"
    },
    {
      "id": "finance-monthly-close-action-revenue-c325d64",
      "source": "Action Revenue",
      "target": "转化成交金额",
      "reason": "伙伴带来转化的成交金额，区别佣金收入。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "div.partitionInner--GfmnB > div.tr > div > div.th.headerCell--G6LXC:nth-of-type(5) > span:nth-of-type(2)",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "div[class*=\"partitionInner--\"] > div.tr > div > div.th[class*=\"headerCell--\"]:nth-of-type(5) > span:nth-of-type(2)",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report"
    },
    {
      "id": "finance-monthly-close-click-cost-c6ca2ea",
      "source": "Click Cost",
      "target": "点击佣金",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "div.partitionInner--GfmnB > div.tr > div > div.th.headerCell--G6LXC:nth-of-type(6) > span:nth-of-type(2)",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "div[class*=\"partitionInner--\"] > div.tr > div > div.th[class*=\"headerCell--\"]:nth-of-type(6) > span:nth-of-type(2)",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report"
    },
    {
      "id": "finance-monthly-close-other-cost-ed9806a",
      "source": "other cost",
      "target": "其他推广费用",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "div.partitionInner--GfmnB > div.tr > div > div.th.headerCell--G6LXC:nth-of-type(7) > span:nth-of-type(2)",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "div[class*=\"partitionInner--\"] > div.tr > div > div.th[class*=\"headerCell--\"]:nth-of-type(7) > span:nth-of-type(2)",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report"
    },
    {
      "id": "finance-monthly-close-net-amount-1509396",
      "source": "net amount",
      "target": "未税金额",
      "reason": "未计税金额，区别含税合计。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "div.partitionInner--GfmnB > div.tr > div > div.th.headerCell--G6LXC:nth-of-type(8) > span:nth-of-type(2)",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "div[class*=\"partitionInner--\"] > div.tr > div > div.th[class*=\"headerCell--\"]:nth-of-type(8) > span:nth-of-type(2)",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report"
    },
    {
      "id": "finance-monthly-close-tax-de6781e",
      "source": "tax",
      "target": "税额",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "div.partitionInner--GfmnB > div.tr > div > div.th.headerCell--G6LXC:nth-of-type(9) > span:nth-of-type(2)",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "div[class*=\"partitionInner--\"] > div.tr > div > div.th[class*=\"headerCell--\"]:nth-of-type(9) > span:nth-of-type(2)",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report"
    },
    {
      "id": "finance-monthly-close-total-bdef802",
      "source": "total",
      "target": "含税合计",
      "reason": "该财务表格计税后的合计金额，原数值保持。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "div.partitionInner--GfmnB > div.tr > div > div.th.headerCell--G6LXC:nth-of-type(10) > span:nth-of-type(2)",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "div[class*=\"partitionInner--\"] > div.tr > div > div.th[class*=\"headerCell--\"]:nth-of-type(10) > span:nth-of-type(2)",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report"
    },
    {
      "id": "finance-monthly-close-displaying-start-end-of-total-dfebf6d",
      "source": "Displaying: {start} - {end} of {total}",
      "target": "显示第 {start} - {end} 行，共 {total} 行",
      "reason": "实采分页文本的十进制计数模板；每个动态数字slot原值保留，只翻译固定显示说明，不硬编码页码。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "div > div > div.reportContainer--NoSIx.false > div.paginationInfo--CAmE2:nth-of-type(3) > span",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "div > div > div[class*=\"reportContainer--\"] > div[class*=\"paginationInfo--\"]:nth-of-type(3) > span",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        }
      },
      "match": "numeric-template",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report",
      "dynamicSlots": [
        "start",
        "end",
        "total"
      ]
    },
    {
      "id": "finance-monthly-close-clicks-and-impressions-received-in-the-las-8b2e960",
      "source": "Clicks and impressions received in the last three hours may not be included here. There is a 2+ hour delay for some metrics.",
      "target": "最近三小时内收到的点击和展示可能尚未计入；部分指标会延迟两个多小时更新。",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "#templateContainer > p.reportingDisclaimer:nth-of-type(2)",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "#templateContainer > p.reportingDisclaimer:nth-of-type(2)",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report"
    },
    {
      "id": "finance-monthly-close-overview-00e8ffe",
      "source": "Overview",
      "target": "财务总览",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report"
    },
    {
      "id": "finance-monthly-close-reports-854bedc",
      "source": "Reports",
      "target": "财务报告",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor:nth-of-type(1)",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor:nth-of-type(1)",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report"
    },
    {
      "id": "finance-monthly-close-monthly-close-53af4b7",
      "source": "Monthly Close",
      "target": "月结报表",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(1) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(1) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report",
      "helpTopicId": "finance-monthly-close"
    },
    {
      "id": "finance-monthly-close-upcoming-partner-payments-78d0af9",
      "source": "Upcoming Partner Payments",
      "target": "即将到期的伙伴付款",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(2) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(2) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report"
    },
    {
      "id": "finance-monthly-close-cash-flow-history-a75eec0",
      "source": "Cash Flow History",
      "target": "资金流水",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(3) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(3) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report"
    },
    {
      "id": "finance-monthly-close-make-deposit-74613bf",
      "source": "Make Deposit",
      "target": "充值",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report"
    },
    {
      "id": "finance-monthly-close-transfers-769df91",
      "source": "Transfers",
      "target": "伙伴资金转账",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report",
      "helpTopicId": "finance-pft"
    },
    {
      "id": "finance-monthly-close-documents-61df58e",
      "source": "Documents",
      "target": "账单文档",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report"
    },
    {
      "id": "finance-monthly-close-subscription-0463a91",
      "source": "Subscription",
      "target": "订阅与用量",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report"
    },
    {
      "id": "finance-monthly-close-settings-440741d",
      "source": "Settings",
      "target": "财务设置",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report"
    },
    {
      "id": "finance-monthly-close-settings-986afbc",
      "source": "Settings",
      "target": "通知设置",
      "reason": "真实顶部通知面板的设置入口；用通知容器和精确页面作用域隔离，与财务设置菜单区分。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text._4-64-3_SuBBQ",
      "observedKind": "notification-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact"
    },
    {
      "id": "finance-monthly-close-clear-all-3c6c781",
      "source": "Clear all",
      "target": "清除全部",
      "reason": "两次实际Monthly Show弹层分别生成#fnDEnDPX与#AVlWhJk6，Clear all所在四层组件及第一工具li相同；scope移除随机ID前缀，保留实际baseFilterPopup、多选列表、第一selectionLink及原生a层级，以及原domain、精确document/top和handle校验。只翻译固定Text，保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "#AVlWhJk6 > div.baseFilterPopup--ie_2Y > ul.content--E27Oz.multipleSelectionFilter--OthnC > li.selectionLink--TSCXf:nth-of-type(1) > a",
      "observedKind": "control-label",
      "observedStates": [
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "div[class*=\"baseFilterPopup--\"] > ul[class*=\"content--\"][class*=\"multipleSelectionFilter--\"] > li[class*=\"selectionLink--\"]:nth-of-type(1) > a",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report"
    },
    {
      "id": "finance-monthly-close-sortable-month-f43c81e",
      "source": "Sortable Month",
      "target": "月份排序字段",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "monthly-close",
      "observedSelector": "div.baseFilterPopup--ie_2Y > ul.content--E27Oz.multipleSelectionFilter--OthnC > li:nth-of-type(2) > a > span.emphasizer--LSpXo:nth-of-type(2)",
      "observedKind": "control-label",
      "observedStates": [
        "opened:Show:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r3/report/viewReport.report"
        ],
        "selector": "div[class*=\"baseFilterPopup--\"] > ul[class*=\"content--\"][class*=\"multipleSelectionFilter--\"] > li:nth-of-type(2) > a > span[class*=\"emphasizer--\"]:nth-of-type(2)",
        "query": {
          "handle": "adv_gaap_summary_action"
        },
        "topQuery": {
          "handle": "adv_gaap_summary_action"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report"
    },
    {
      "id": "finance-upcoming-partner-payments-upcoming-partner-payments-7c47fc0",
      "source": "Upcoming Partner Payments",
      "target": "即将到期的伙伴付款",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "upcoming-partner-payments",
      "observedSelector": "div > div > div.titleContainer--q4uoJ:nth-of-type(2) > div.reportTitle--klMti:nth-of-type(1) > span",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Prediction Range:",
        "opened:Funding Account:",
        "opened:Partner:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report"
        ],
        "selector": "div > div > div[class*=\"titleContainer--\"]:nth-of-type(2) > div[class*=\"reportTitle--\"]:nth-of-type(1) > span",
        "query": {
          "handle": "adv_upcoming_payouts"
        },
        "topQuery": {
          "handle": "adv_upcoming_payouts"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report"
    },
    {
      "id": "finance-upcoming-partner-payments-prediction-range-a6edb9a",
      "source": "Prediction Range:",
      "target": "预测范围：",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "upcoming-partner-payments",
      "observedSelector": "#reportFormDiv > div.filters--bVxcQ > div.selectFilter--TiX39:nth-of-type(1) > span.baseFilterButton--xXPx9.btnBlue--uKPdT > span",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Prediction Range:",
        "opened:Funding Account:",
        "opened:Partner:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report"
        ],
        "selector": "#reportFormDiv > div[class*=\"filters--\"] > div[class*=\"selectFilter--\"]:nth-of-type(1) > span[class*=\"baseFilterButton--\"][class*=\"btnBlue--\"] > span",
        "query": {
          "handle": "adv_upcoming_payouts"
        },
        "topQuery": {
          "handle": "adv_upcoming_payouts"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report"
    },
    {
      "id": "finance-upcoming-partner-payments-45-days-750f5fa",
      "source": "45 days",
      "target": "45 天",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "upcoming-partner-payments",
      "observedSelector": "div.filters--bVxcQ > div.selectFilter--TiX39:nth-of-type(1) > span.baseFilterButton--xXPx9.btnBlue--uKPdT > span > strong",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Prediction Range:",
        "opened:Funding Account:",
        "opened:Partner:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report"
        ],
        "selector": "div[class*=\"filters--\"] > div[class*=\"selectFilter--\"]:nth-of-type(1) > span[class*=\"baseFilterButton--\"][class*=\"btnBlue--\"] > span > strong",
        "query": {
          "handle": "adv_upcoming_payouts"
        },
        "topQuery": {
          "handle": "adv_upcoming_payouts"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report"
    },
    {
      "id": "finance-upcoming-partner-payments-funding-account-3bdd045",
      "source": "Funding Account:",
      "target": "资金账户：",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "upcoming-partner-payments",
      "observedSelector": "#reportFormDiv > div.filters--bVxcQ > div.selectFilter--TiX39:nth-of-type(2) > span.baseFilterButton--xXPx9.btnBlue--uKPdT > span",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Prediction Range:",
        "opened:Funding Account:",
        "opened:Partner:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report"
        ],
        "selector": "#reportFormDiv > div[class*=\"filters--\"] > div[class*=\"selectFilter--\"]:nth-of-type(2) > span[class*=\"baseFilterButton--\"][class*=\"btnBlue--\"] > span",
        "query": {
          "handle": "adv_upcoming_payouts"
        },
        "topQuery": {
          "handle": "adv_upcoming_payouts"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report",
      "helpTopicId": "finance-funding-account"
    },
    {
      "id": "finance-upcoming-partner-payments-none-e77268a",
      "source": "None",
      "target": "未选择",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "upcoming-partner-payments",
      "observedSelector": "div.filters--bVxcQ > div.selectFilter--TiX39:nth-of-type(2) > span.baseFilterButton--xXPx9.btnBlue--uKPdT > span > strong",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Prediction Range:",
        "opened:Funding Account:",
        "opened:Partner:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report"
        ],
        "selector": "div[class*=\"filters--\"] > div[class*=\"selectFilter--\"]:nth-of-type(2) > span[class*=\"baseFilterButton--\"][class*=\"btnBlue--\"] > span > strong",
        "query": {
          "handle": "adv_upcoming_payouts"
        },
        "topQuery": {
          "handle": "adv_upcoming_payouts"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report"
    },
    {
      "id": "finance-upcoming-partner-payments-partner-d4df743",
      "source": "Partner:",
      "target": "合作伙伴：",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "upcoming-partner-payments",
      "observedSelector": "#reportFormDiv > div.filters--bVxcQ > div.selectFilter--TiX39:nth-of-type(3) > span.baseFilterButton--xXPx9.false > span",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Prediction Range:",
        "opened:Funding Account:",
        "opened:Partner:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report"
        ],
        "selector": "#reportFormDiv > div[class*=\"filters--\"] > div[class*=\"selectFilter--\"]:nth-of-type(3) > span[class*=\"baseFilterButton--\"] > span",
        "query": {
          "handle": "adv_upcoming_payouts"
        },
        "topQuery": {
          "handle": "adv_upcoming_payouts"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report"
    },
    {
      "id": "finance-upcoming-partner-payments-all-04efac4",
      "source": "All",
      "target": "全部",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "upcoming-partner-payments",
      "observedSelector": "div.filters--bVxcQ > div.selectFilter--TiX39:nth-of-type(3) > span.baseFilterButton--xXPx9.false > span > strong",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Prediction Range:",
        "opened:Funding Account:",
        "opened:Partner:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report"
        ],
        "selector": "div[class*=\"filters--\"] > div[class*=\"selectFilter--\"]:nth-of-type(3) > span[class*=\"baseFilterButton--\"] > span > strong",
        "query": {
          "handle": "adv_upcoming_payouts"
        },
        "topQuery": {
          "handle": "adv_upcoming_payouts"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report"
    },
    {
      "id": "finance-upcoming-partner-payments-apply-b31c1fd",
      "source": "Apply",
      "target": "应用",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "upcoming-partner-payments",
      "observedSelector": "#reportFormDiv > div.filters--bVxcQ > button.searchButton--X043d",
      "observedKind": "control-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Prediction Range:",
        "opened:Funding Account:",
        "opened:Partner:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report"
        ],
        "selector": "#reportFormDiv > div[class*=\"filters--\"] > button[class*=\"searchButton--\"]",
        "query": {
          "handle": "adv_upcoming_payouts"
        },
        "topQuery": {
          "handle": "adv_upcoming_payouts"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report"
    },
    {
      "id": "finance-upcoming-partner-payments-clicks-and-impressions-received-in-the-las-f328c8d",
      "source": "Clicks and impressions received in the last three hours may not be included here. There is a 2+ hour delay for some metrics.",
      "target": "最近三小时内收到的点击和展示可能尚未计入；部分指标会延迟两个多小时更新。",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "upcoming-partner-payments",
      "observedSelector": "#templateContainer > p.reportingDisclaimer:nth-of-type(2)",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Prediction Range:",
        "opened:Funding Account:",
        "opened:Partner:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report"
        ],
        "selector": "#templateContainer > p.reportingDisclaimer:nth-of-type(2)",
        "query": {
          "handle": "adv_upcoming_payouts"
        },
        "topQuery": {
          "handle": "adv_upcoming_payouts"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report"
    },
    {
      "id": "finance-upcoming-partner-payments-overview-76a45f8",
      "source": "Overview",
      "target": "财务总览",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "upcoming-partner-payments",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Prediction Range:",
        "opened:Funding Account:",
        "opened:Partner:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
        "query": {
          "handle": "adv_upcoming_payouts"
        },
        "topQuery": {
          "handle": "adv_upcoming_payouts"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report"
    },
    {
      "id": "finance-upcoming-partner-payments-reports-1e011fe",
      "source": "Reports",
      "target": "财务报告",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "upcoming-partner-payments",
      "observedSelector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor:nth-of-type(1)",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Prediction Range:",
        "opened:Funding Account:",
        "opened:Partner:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report"
        ],
        "selector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor:nth-of-type(1)",
        "query": {
          "handle": "adv_upcoming_payouts"
        },
        "topQuery": {
          "handle": "adv_upcoming_payouts"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report"
    },
    {
      "id": "finance-upcoming-partner-payments-monthly-close-f98921f",
      "source": "Monthly Close",
      "target": "月结报表",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "upcoming-partner-payments",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(1) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Prediction Range:",
        "opened:Funding Account:",
        "opened:Partner:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(1) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "query": {
          "handle": "adv_upcoming_payouts"
        },
        "topQuery": {
          "handle": "adv_upcoming_payouts"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report",
      "helpTopicId": "finance-monthly-close"
    },
    {
      "id": "finance-upcoming-partner-payments-upcoming-partner-payments-fd01f3e",
      "source": "Upcoming Partner Payments",
      "target": "即将到期的伙伴付款",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "upcoming-partner-payments",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(2) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Prediction Range:",
        "opened:Funding Account:",
        "opened:Partner:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(2) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "query": {
          "handle": "adv_upcoming_payouts"
        },
        "topQuery": {
          "handle": "adv_upcoming_payouts"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report"
    },
    {
      "id": "finance-upcoming-partner-payments-cash-flow-history-9ed0129",
      "source": "Cash Flow History",
      "target": "资金流水",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "upcoming-partner-payments",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(3) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Prediction Range:",
        "opened:Funding Account:",
        "opened:Partner:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(3) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "query": {
          "handle": "adv_upcoming_payouts"
        },
        "topQuery": {
          "handle": "adv_upcoming_payouts"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report"
    },
    {
      "id": "finance-upcoming-partner-payments-make-deposit-7281d06",
      "source": "Make Deposit",
      "target": "充值",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "upcoming-partner-payments",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Prediction Range:",
        "opened:Funding Account:",
        "opened:Partner:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
        "query": {
          "handle": "adv_upcoming_payouts"
        },
        "topQuery": {
          "handle": "adv_upcoming_payouts"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report"
    },
    {
      "id": "finance-upcoming-partner-payments-transfers-b0f01ce",
      "source": "Transfers",
      "target": "伙伴资金转账",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "upcoming-partner-payments",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Prediction Range:",
        "opened:Funding Account:",
        "opened:Partner:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
        "query": {
          "handle": "adv_upcoming_payouts"
        },
        "topQuery": {
          "handle": "adv_upcoming_payouts"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report",
      "helpTopicId": "finance-pft"
    },
    {
      "id": "finance-upcoming-partner-payments-documents-fd08b02",
      "source": "Documents",
      "target": "账单文档",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "upcoming-partner-payments",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Prediction Range:",
        "opened:Funding Account:",
        "opened:Partner:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
        "query": {
          "handle": "adv_upcoming_payouts"
        },
        "topQuery": {
          "handle": "adv_upcoming_payouts"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report"
    },
    {
      "id": "finance-upcoming-partner-payments-subscription-89104a6",
      "source": "Subscription",
      "target": "订阅与用量",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "upcoming-partner-payments",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Prediction Range:",
        "opened:Funding Account:",
        "opened:Partner:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
        "query": {
          "handle": "adv_upcoming_payouts"
        },
        "topQuery": {
          "handle": "adv_upcoming_payouts"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report"
    },
    {
      "id": "finance-upcoming-partner-payments-settings-d92b686",
      "source": "Settings",
      "target": "财务设置",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "upcoming-partner-payments",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Prediction Range:",
        "opened:Funding Account:",
        "opened:Partner:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
        "query": {
          "handle": "adv_upcoming_payouts"
        },
        "topQuery": {
          "handle": "adv_upcoming_payouts"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report"
    },
    {
      "id": "finance-upcoming-partner-payments-settings-217ed62",
      "source": "Settings",
      "target": "通知设置",
      "reason": "真实顶部通知面板的设置入口；用通知容器和精确页面作用域隔离，与财务设置菜单区分。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "upcoming-partner-payments",
      "observedSelector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text._4-64-3_SuBBQ",
      "observedKind": "notification-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Prediction Range:",
        "opened:Funding Account:",
        "opened:Partner:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report"
        ],
        "selector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text",
        "query": {
          "handle": "adv_upcoming_payouts"
        },
        "topQuery": {
          "handle": "adv_upcoming_payouts"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact"
    },
    {
      "id": "finance-upcoming-partner-payments-30-days-b862894",
      "source": "30 days",
      "target": "30 天",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "upcoming-partner-payments",
      "observedSelector": "div.listStyle--ERuU2 > div > li:nth-of-type(1) > a > span.emphasizer--LSpXo",
      "observedKind": "control-label",
      "observedStates": [
        "opened:Prediction Range:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report"
        ],
        "selector": "div[class*=\"listStyle--\"] > div > li:nth-of-type(1) > a > span[class*=\"emphasizer--\"]",
        "query": {
          "handle": "adv_upcoming_payouts"
        },
        "topQuery": {
          "handle": "adv_upcoming_payouts"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report"
    },
    {
      "id": "finance-upcoming-partner-payments-45-days-0ec9792",
      "source": "45 days",
      "target": "45 天",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "upcoming-partner-payments",
      "observedSelector": "div.listStyle--ERuU2 > div > li.selected--gJpek:nth-of-type(2) > a > span.emphasizer--LSpXo",
      "observedKind": "control-label",
      "observedStates": [
        "opened:Prediction Range:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report"
        ],
        "selector": "div[class*=\"listStyle--\"] > div > li[class*=\"selected--\"]:nth-of-type(2) > a > span[class*=\"emphasizer--\"]",
        "query": {
          "handle": "adv_upcoming_payouts"
        },
        "topQuery": {
          "handle": "adv_upcoming_payouts"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report"
    },
    {
      "id": "finance-upcoming-partner-payments-60-days-21e81ed",
      "source": "60 days",
      "target": "60 天",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "upcoming-partner-payments",
      "observedSelector": "div.listStyle--ERuU2 > div > li:nth-of-type(3) > a > span.emphasizer--LSpXo",
      "observedKind": "control-label",
      "observedStates": [
        "opened:Prediction Range:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report"
        ],
        "selector": "div[class*=\"listStyle--\"] > div > li:nth-of-type(3) > a > span[class*=\"emphasizer--\"]",
        "query": {
          "handle": "adv_upcoming_payouts"
        },
        "topQuery": {
          "handle": "adv_upcoming_payouts"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report"
    },
    {
      "id": "finance-upcoming-partner-payments-90-days-35fc5f6",
      "source": "90 days",
      "target": "90 天",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "upcoming-partner-payments",
      "observedSelector": "div.listStyle--ERuU2 > div > li:nth-of-type(4) > a > span.emphasizer--LSpXo",
      "observedKind": "control-label",
      "observedStates": [
        "opened:Prediction Range:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report"
        ],
        "selector": "div[class*=\"listStyle--\"] > div > li:nth-of-type(4) > a > span[class*=\"emphasizer--\"]",
        "query": {
          "handle": "adv_upcoming_payouts"
        },
        "topQuery": {
          "handle": "adv_upcoming_payouts"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report"
    },
    {
      "id": "finance-upcoming-partner-payments-all-a822baf",
      "source": "All",
      "target": "全部",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "upcoming-partner-payments",
      "observedSelector": "div.listStyle--ERuU2 > div > li:nth-of-type(1) > a > span.emphasizer--LSpXo",
      "observedKind": "control-label",
      "observedStates": [
        "opened:Funding Account:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report"
        ],
        "selector": "div[class*=\"listStyle--\"] > div > li:nth-of-type(1) > a > span[class*=\"emphasizer--\"]",
        "query": {
          "handle": "adv_upcoming_payouts"
        },
        "topQuery": {
          "handle": "adv_upcoming_payouts"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report"
    },
    {
      "id": "finance-upcoming-partner-payments-all-e8eb9f9",
      "source": "All",
      "target": "全部",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "upcoming-partner-payments",
      "observedSelector": "div.inner--iGsBU:nth-of-type(2) > ul.content--YGKCO.singleSelectionFilter--FDzUm > li.selected--gJpek:nth-of-type(1) > a > span.emphasizer--LSpXo",
      "observedKind": "control-label",
      "observedStates": [
        "opened:Partner:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report"
        ],
        "selector": "div[class*=\"inner--\"]:nth-of-type(2) > ul[class*=\"content--\"][class*=\"singleSelectionFilter--\"] > li[class*=\"selected--\"]:nth-of-type(1) > a > span[class*=\"emphasizer--\"]",
        "query": {
          "handle": "adv_upcoming_payouts"
        },
        "topQuery": {
          "handle": "adv_upcoming_payouts"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report"
    },
    {
      "id": "finance-upcoming-partner-payments-finalized-payouts-observed",
      "source": "Finalized Payouts",
      "target": "已确定应付款项",
      "reason": "官方即将到期的伙伴付款报表将此分区定义为已锁定转化对应的未来应付款；转化生命周期说明锁定后佣金金额确定，随后按计划结算，因此不表示已经付款或伙伴已经到账。本轮仅在只读查询请求后的真实加载状态观察到固定H3标题，报表结果未完成加载，不作为查询完成或实网验收证明。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "upcoming-partner-payments",
      "observedSelector": ".reportContainer--NoSIx h3",
      "observedKind": "text-node",
      "observedStates": [
        "readonly-query-requested-result-loading"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r1/report/viewReport.report"
        ],
        "selector": ".reportContainer--NoSIx h3",
        "query": {
          "handle": "adv_upcoming_payouts"
        },
        "topQuery": {
          "handle": "adv_upcoming_payouts"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report"
    },
    {
      "id": "finance-cash-flow-history-cash-flow-history-3daa00f",
      "source": "Cash Flow History",
      "target": "资金流水",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "cash-flow-history",
      "observedSelector": "div > div > div.titleContainer--q4uoJ:nth-of-type(2) > div.reportTitle--klMti:nth-of-type(1) > span",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Funding Account:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report"
        ],
        "selector": "div > div > div[class*=\"titleContainer--\"]:nth-of-type(2) > div[class*=\"reportTitle--\"]:nth-of-type(1) > span",
        "query": {
          "handle": "adv_cash_flow_recon"
        },
        "topQuery": {
          "handle": "adv_cash_flow_recon"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/cash-flow-history-report"
    },
    {
      "id": "finance-cash-flow-history-funding-account-69d5086",
      "source": "Funding Account:",
      "target": "资金账户：",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "cash-flow-history",
      "observedSelector": "#reportFormDiv > div.filters--bVxcQ > div.selectFilter--TiX39:nth-of-type(2) > span.baseFilterButton--xXPx9.btnBlue--uKPdT > span",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Funding Account:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report"
        ],
        "selector": "#reportFormDiv > div[class*=\"filters--\"] > div[class*=\"selectFilter--\"]:nth-of-type(2) > span[class*=\"baseFilterButton--\"][class*=\"btnBlue--\"] > span",
        "query": {
          "handle": "adv_cash_flow_recon"
        },
        "topQuery": {
          "handle": "adv_cash_flow_recon"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/cash-flow-history-report",
      "helpTopicId": "finance-funding-account"
    },
    {
      "id": "finance-cash-flow-history-none-43d8cf2",
      "source": "None",
      "target": "未选择",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "cash-flow-history",
      "observedSelector": "div.filters--bVxcQ > div.selectFilter--TiX39:nth-of-type(2) > span.baseFilterButton--xXPx9.btnBlue--uKPdT > span > strong",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Funding Account:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report"
        ],
        "selector": "div[class*=\"filters--\"] > div[class*=\"selectFilter--\"]:nth-of-type(2) > span[class*=\"baseFilterButton--\"][class*=\"btnBlue--\"] > span > strong",
        "query": {
          "handle": "adv_cash_flow_recon"
        },
        "topQuery": {
          "handle": "adv_cash_flow_recon"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/cash-flow-history-report"
    },
    {
      "id": "finance-cash-flow-history-apply-b30fe8b",
      "source": "Apply",
      "target": "应用",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "cash-flow-history",
      "observedSelector": "#reportFormDiv > div.filters--bVxcQ > button.searchButton--X043d",
      "observedKind": "control-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Funding Account:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report"
        ],
        "selector": "#reportFormDiv > div[class*=\"filters--\"] > button[class*=\"searchButton--\"]",
        "query": {
          "handle": "adv_cash_flow_recon"
        },
        "topQuery": {
          "handle": "adv_cash_flow_recon"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/cash-flow-history-report"
    },
    {
      "id": "finance-cash-flow-history-clicks-and-impressions-received-in-the-las-20d345f",
      "source": "Clicks and impressions received in the last three hours may not be included here. There is a 2+ hour delay for some metrics.",
      "target": "最近三小时内收到的点击和展示可能尚未计入；部分指标会延迟两个多小时更新。",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "cash-flow-history",
      "observedSelector": "#templateContainer > p.reportingDisclaimer:nth-of-type(2)",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Funding Account:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report"
        ],
        "selector": "#templateContainer > p.reportingDisclaimer:nth-of-type(2)",
        "query": {
          "handle": "adv_cash_flow_recon"
        },
        "topQuery": {
          "handle": "adv_cash_flow_recon"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/cash-flow-history-report"
    },
    {
      "id": "finance-cash-flow-history-overview-d796d58",
      "source": "Overview",
      "target": "财务总览",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "cash-flow-history",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Funding Account:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
        "query": {
          "handle": "adv_cash_flow_recon"
        },
        "topQuery": {
          "handle": "adv_cash_flow_recon"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/cash-flow-history-report"
    },
    {
      "id": "finance-cash-flow-history-reports-0ab388e",
      "source": "Reports",
      "target": "财务报告",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "cash-flow-history",
      "observedSelector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor:nth-of-type(1)",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Funding Account:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report"
        ],
        "selector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor:nth-of-type(1)",
        "query": {
          "handle": "adv_cash_flow_recon"
        },
        "topQuery": {
          "handle": "adv_cash_flow_recon"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/cash-flow-history-report"
    },
    {
      "id": "finance-cash-flow-history-monthly-close-412ab2e",
      "source": "Monthly Close",
      "target": "月结报表",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "cash-flow-history",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(1) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Funding Account:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(1) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "query": {
          "handle": "adv_cash_flow_recon"
        },
        "topQuery": {
          "handle": "adv_cash_flow_recon"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/cash-flow-history-report",
      "helpTopicId": "finance-monthly-close"
    },
    {
      "id": "finance-cash-flow-history-upcoming-partner-payments-8df5f07",
      "source": "Upcoming Partner Payments",
      "target": "即将到期的伙伴付款",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "cash-flow-history",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(2) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Funding Account:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(2) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "query": {
          "handle": "adv_cash_flow_recon"
        },
        "topQuery": {
          "handle": "adv_cash_flow_recon"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/cash-flow-history-report"
    },
    {
      "id": "finance-cash-flow-history-cash-flow-history-b46d1c0",
      "source": "Cash Flow History",
      "target": "资金流水",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "cash-flow-history",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(3) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Funding Account:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(3) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "query": {
          "handle": "adv_cash_flow_recon"
        },
        "topQuery": {
          "handle": "adv_cash_flow_recon"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/cash-flow-history-report"
    },
    {
      "id": "finance-cash-flow-history-make-deposit-3489c4e",
      "source": "Make Deposit",
      "target": "充值",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "cash-flow-history",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Funding Account:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
        "query": {
          "handle": "adv_cash_flow_recon"
        },
        "topQuery": {
          "handle": "adv_cash_flow_recon"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/cash-flow-history-report"
    },
    {
      "id": "finance-cash-flow-history-transfers-6484f6d",
      "source": "Transfers",
      "target": "伙伴资金转账",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "cash-flow-history",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Funding Account:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
        "query": {
          "handle": "adv_cash_flow_recon"
        },
        "topQuery": {
          "handle": "adv_cash_flow_recon"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/cash-flow-history-report",
      "helpTopicId": "finance-pft"
    },
    {
      "id": "finance-cash-flow-history-documents-c87372e",
      "source": "Documents",
      "target": "账单文档",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "cash-flow-history",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Funding Account:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
        "query": {
          "handle": "adv_cash_flow_recon"
        },
        "topQuery": {
          "handle": "adv_cash_flow_recon"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/cash-flow-history-report"
    },
    {
      "id": "finance-cash-flow-history-subscription-61b55b8",
      "source": "Subscription",
      "target": "订阅与用量",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "cash-flow-history",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Funding Account:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
        "query": {
          "handle": "adv_cash_flow_recon"
        },
        "topQuery": {
          "handle": "adv_cash_flow_recon"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/cash-flow-history-report"
    },
    {
      "id": "finance-cash-flow-history-settings-848116f",
      "source": "Settings",
      "target": "财务设置",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "cash-flow-history",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Funding Account:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
        "query": {
          "handle": "adv_cash_flow_recon"
        },
        "topQuery": {
          "handle": "adv_cash_flow_recon"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/cash-flow-history-report"
    },
    {
      "id": "finance-cash-flow-history-settings-7504a9a",
      "source": "Settings",
      "target": "通知设置",
      "reason": "真实顶部通知面板的设置入口；用通知容器和精确页面作用域隔离，与财务设置菜单区分。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "cash-flow-history",
      "observedSelector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text._4-64-3_SuBBQ",
      "observedKind": "notification-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Funding Account:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report"
        ],
        "selector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text",
        "query": {
          "handle": "adv_cash_flow_recon"
        },
        "topQuery": {
          "handle": "adv_cash_flow_recon"
        },
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact"
    },
    {
      "id": "finance-cash-flow-history-all-b1918aa",
      "source": "All",
      "target": "全部",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "cash-flow-history",
      "observedSelector": "div.listStyle--ERuU2 > div > li:nth-of-type(1) > a > span.emphasizer--LSpXo",
      "observedKind": "control-label",
      "observedStates": [
        "opened:Funding Account:"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "pathExact": "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report",
        "topPaths": [
          "/secure/advertiser/Adv_Finance_Report/r2/report/viewReport.report"
        ],
        "selector": "div[class*=\"listStyle--\"] > div > li:nth-of-type(1) > a > span[class*=\"emphasizer--\"]",
        "query": {
          "handle": "adv_cash_flow_recon"
        },
        "topQuery": {
          "handle": "adv_cash_flow_recon"
        }
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/cash-flow-history-report"
    },
    {
      "id": "finance-partner-payments-invoices-overview-b5a7da8",
      "source": "Overview",
      "target": "财务总览",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "partner-payments-invoices",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/partner-invoices.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/partner-invoices.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-invoices.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/partner-payments-invoices-explained-for-brands"
    },
    {
      "id": "finance-partner-payments-invoices-reports-4fad5ab",
      "source": "Reports",
      "target": "财务报告",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "partner-payments-invoices",
      "observedSelector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/partner-invoices.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/partner-invoices.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-invoices.ihtml"
        ],
        "selector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/partner-payments-invoices-explained-for-brands"
    },
    {
      "id": "finance-partner-payments-invoices-make-deposit-28a9414",
      "source": "Make Deposit",
      "target": "充值",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "partner-payments-invoices",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/partner-invoices.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/partner-invoices.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-invoices.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/partner-payments-invoices-explained-for-brands"
    },
    {
      "id": "finance-partner-payments-invoices-transfers-0633775",
      "source": "Transfers",
      "target": "伙伴资金转账",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "partner-payments-invoices",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/partner-invoices.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/partner-invoices.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-invoices.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/partner-payments-invoices-explained-for-brands",
      "helpTopicId": "finance-pft"
    },
    {
      "id": "finance-partner-payments-invoices-documents-b1b4855",
      "source": "Documents",
      "target": "账单文档",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "partner-payments-invoices",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/partner-invoices.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/partner-invoices.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-invoices.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/partner-payments-invoices-explained-for-brands"
    },
    {
      "id": "finance-partner-payments-invoices-partner-payments-invoices-3957ce5",
      "source": "Partner Payments Invoices",
      "target": "伙伴付款账单",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "partner-payments-invoices",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(1) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/partner-invoices.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/partner-invoices.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-invoices.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(1) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/partner-payments-invoices-explained-for-brands",
      "helpTopicId": "finance-invoice"
    },
    {
      "id": "finance-partner-payments-invoices-impact-com-invoices-2ce6ec9",
      "source": "impact.com Invoices",
      "target": "impact.com 服务费账单",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "partner-payments-invoices",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(2) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/partner-invoices.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/partner-invoices.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-invoices.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(2) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/partner-payments-invoices-explained-for-brands",
      "helpTopicId": "finance-platform-invoice"
    },
    {
      "id": "finance-partner-payments-invoices-subscription-0148bdc",
      "source": "Subscription",
      "target": "订阅与用量",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "partner-payments-invoices",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/partner-invoices.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/partner-invoices.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-invoices.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/partner-payments-invoices-explained-for-brands"
    },
    {
      "id": "finance-partner-payments-invoices-settings-8a69ed5",
      "source": "Settings",
      "target": "财务设置",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "partner-payments-invoices",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/partner-invoices.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/partner-invoices.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-invoices.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/partner-payments-invoices-explained-for-brands"
    },
    {
      "id": "finance-partner-payments-invoices-settings-74dc201",
      "source": "Settings",
      "target": "通知设置",
      "reason": "真实顶部通知面板的设置入口；用通知容器和精确页面作用域隔离，与财务设置菜单区分。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "partner-payments-invoices",
      "observedSelector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text._4-64-3_SuBBQ",
      "observedKind": "notification-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/partner-invoices.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/partner-invoices.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-invoices.ihtml"
        ],
        "selector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact"
    },
    {
      "id": "finance-partner-payments-invoices-partner-payments-invoice-summary-70bed61",
      "source": "Partner Payments Invoice Summary",
      "target": "伙伴付款账单汇总",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "partner-payments-invoices",
      "observedSelector": "div.iui-component.iui-data-view > div > div.data-header:nth-of-type(1) > div.top-info:nth-of-type(1) > h1",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-adv-invoices-flow.ihtml",
        "pathExact": "/secure/finance/app/list-adv-invoices-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-invoices.ihtml"
        ],
        "selector": "div.iui-component.iui-data-view > div > div.data-header:nth-of-type(1) > div.top-info:nth-of-type(1) > h1"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/partner-payments-invoices-explained-for-brands",
      "helpTopicId": "finance-invoice"
    },
    {
      "id": "finance-partner-payments-invoices-month-b90f5a1",
      "source": "Month",
      "target": "月份",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "partner-payments-invoices",
      "observedSelector": "span.filter > div.iui-component.iui-multiselect-input > div.btn-container > button.responsive.outline > span",
      "observedKind": "control-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-adv-invoices-flow.ihtml",
        "pathExact": "/secure/finance/app/list-adv-invoices-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-invoices.ihtml"
        ],
        "selector": "span.filter > div.iui-component.iui-multiselect-input > div.btn-container > button.responsive.outline > span"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/partner-payments-invoices-explained-for-brands"
    },
    {
      "id": "finance-partner-payments-invoices-row-7e511f6",
      "source": "row",
      "target": "行",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "partner-payments-invoices",
      "observedSelector": "div.iui-component.iui-data-view > div > div.data-header:nth-of-type(1) > div.bulk-actions-and-sort:nth-of-type(3) > span.num-records-container",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-adv-invoices-flow.ihtml",
        "pathExact": "/secure/finance/app/list-adv-invoices-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-invoices.ihtml"
        ],
        "selector": "div.iui-component.iui-data-view > div > div.data-header:nth-of-type(1) > div.bulk-actions-and-sort:nth-of-type(3) > span.num-records-container"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/partner-payments-invoices-explained-for-brands"
    },
    {
      "id": "finance-partner-payments-invoices-month-50a5b33",
      "source": "Month",
      "target": "月份",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "partner-payments-invoices",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-0\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-adv-invoices-flow.ihtml",
        "pathExact": "/secure/finance/app/list-adv-invoices-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-invoices.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-0\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/partner-payments-invoices-explained-for-brands"
    },
    {
      "id": "finance-partner-payments-invoices-invoices-d2c0214",
      "source": "Invoices",
      "target": "账单数量",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "partner-payments-invoices",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-1\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-adv-invoices-flow.ihtml",
        "pathExact": "/secure/finance/app/list-adv-invoices-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-invoices.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-1\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/partner-payments-invoices-explained-for-brands"
    },
    {
      "id": "finance-partner-payments-invoices-generated-on-a512fe0",
      "source": "Generated on",
      "target": "生成日期",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "partner-payments-invoices",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-2\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-adv-invoices-flow.ihtml",
        "pathExact": "/secure/finance/app/list-adv-invoices-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-invoices.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-2\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/partner-payments-invoices-explained-for-brands"
    },
    {
      "id": "finance-partner-payments-invoices-total-due-0b83304",
      "source": "Total Due",
      "target": "应付合计",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "partner-payments-invoices",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-3\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-adv-invoices-flow.ihtml",
        "pathExact": "/secure/finance/app/list-adv-invoices-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-invoices.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-3\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/partner-payments-invoices-explained-for-brands"
    },
    {
      "id": "finance-partner-payments-invoices-status-9a873ad",
      "source": "Status",
      "target": "付款状态",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "partner-payments-invoices",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-4\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-adv-invoices-flow.ihtml",
        "pathExact": "/secure/finance/app/list-adv-invoices-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-invoices.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-4\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/partner-payments-invoices-explained-for-brands"
    },
    {
      "id": "finance-partner-payments-invoices-past-due-7cab379",
      "source": "Past Due",
      "target": "逾期未付款",
      "reason": "到期后尚未结算的款项，区别未到期付款。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "partner-payments-invoices",
      "observedSelector": "div.iui-component.iui-data-table > div.table-body._4-49-7_Mzr--:nth-of-type(2) > div.table-row._4-49-7_SkOCn > div.table-cell.content-cell:nth-of-type(5) > label.red._4-49-7_PFkYG",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-adv-invoices-flow.ihtml",
        "pathExact": "/secure/finance/app/list-adv-invoices-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-invoices.ihtml"
        ],
        "selector": "div.iui-component.iui-data-table > div.table-body:nth-of-type(2) > div.table-row > div.table-cell.content-cell:nth-of-type(5) > label.red"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/partner-payments-invoices-explained-for-brands"
    },
    {
      "id": "finance-partner-payments-invoices-month-43059e8",
      "source": "Month",
      "target": "月份",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "partner-payments-invoices",
      "observedSelector": "span.filter > div.iui-component.iui-multiselect-input > div.btn-container > button.focused.responsive > span",
      "observedKind": "control-label",
      "observedStates": [
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-adv-invoices-flow.ihtml",
        "pathExact": "/secure/finance/app/list-adv-invoices-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-invoices.ihtml"
        ],
        "selector": "span.filter > div.iui-component.iui-multiselect-input > div.btn-container > button.focused.responsive > span"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/partner-payments-invoices-explained-for-brands"
    },
    {
      "id": "finance-partner-payments-invoices-clear-138c83d",
      "source": "Clear",
      "target": "清除",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "partner-payments-invoices",
      "observedSelector": "button[data-testid=\"uicl-multi-select-input-clear-button\"]",
      "observedKind": "control-label",
      "observedStates": [
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-adv-invoices-flow.ihtml",
        "pathExact": "/secure/finance/app/list-adv-invoices-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/partner-invoices.ihtml"
        ],
        "selector": "button[data-testid=\"uicl-multi-select-input-clear-button\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/partner-payments-invoices-explained-for-brands"
    },
    {
      "id": "finance-impact-com-invoices-overview-ef802b1",
      "source": "Overview",
      "target": "财务总览",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "impact-com-invoices",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices"
    },
    {
      "id": "finance-impact-com-invoices-reports-52f2d61",
      "source": "Reports",
      "target": "财务报告",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "impact-com-invoices",
      "observedSelector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml"
        ],
        "selector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices"
    },
    {
      "id": "finance-impact-com-invoices-make-deposit-7c91bb7",
      "source": "Make Deposit",
      "target": "充值",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "impact-com-invoices",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices"
    },
    {
      "id": "finance-impact-com-invoices-transfers-6374db7",
      "source": "Transfers",
      "target": "伙伴资金转账",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "impact-com-invoices",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices",
      "helpTopicId": "finance-pft"
    },
    {
      "id": "finance-impact-com-invoices-documents-1b5fe54",
      "source": "Documents",
      "target": "账单文档",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "impact-com-invoices",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices"
    },
    {
      "id": "finance-impact-com-invoices-partner-payments-invoices-34544fd",
      "source": "Partner Payments Invoices",
      "target": "伙伴付款账单",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "impact-com-invoices",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(1) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(1) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices",
      "helpTopicId": "finance-invoice"
    },
    {
      "id": "finance-impact-com-invoices-impact-com-invoices-b3f42fb",
      "source": "impact.com Invoices",
      "target": "impact.com 服务费账单",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "impact-com-invoices",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(2) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(2) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices",
      "helpTopicId": "finance-platform-invoice"
    },
    {
      "id": "finance-impact-com-invoices-subscription-d6e9cc5",
      "source": "Subscription",
      "target": "订阅与用量",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "impact-com-invoices",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices"
    },
    {
      "id": "finance-impact-com-invoices-settings-8829753",
      "source": "Settings",
      "target": "财务设置",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "impact-com-invoices",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices"
    },
    {
      "id": "finance-impact-com-invoices-settings-0c1667a",
      "source": "Settings",
      "target": "通知设置",
      "reason": "真实顶部通知面板的设置入口；用通知容器和精确页面作用域隔离，与财务设置菜单区分。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "impact-com-invoices",
      "observedSelector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text._4-64-3_SuBBQ",
      "observedKind": "notification-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml"
        ],
        "selector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact"
    },
    {
      "id": "finance-impact-com-invoices-impact-com-invoices-5712aeb",
      "source": "impact.com Invoices",
      "target": "impact.com 服务费账单",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "impact-com-invoices",
      "observedSelector": "div.iui-component.iui-data-view > div > div.data-header:nth-of-type(1) > div.top-info:nth-of-type(1) > h1",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "pathExact": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml"
        ],
        "selector": "div.iui-component.iui-data-view > div > div.data-header:nth-of-type(1) > div.top-info:nth-of-type(1) > h1"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices",
      "helpTopicId": "finance-platform-invoice"
    },
    {
      "id": "finance-impact-com-invoices-month-c393a70",
      "source": "Month",
      "target": "月份",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "impact-com-invoices",
      "observedSelector": "span.filter > div.iui-component.iui-multiselect-input > div.btn-container > button.responsive.outline > span",
      "observedKind": "control-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "pathExact": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml"
        ],
        "selector": "span.filter > div.iui-component.iui-multiselect-input > div.btn-container > button.responsive.outline > span"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices"
    },
    {
      "id": "finance-impact-com-invoices-rows-ae655a1",
      "source": "rows",
      "target": "行",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "impact-com-invoices",
      "observedSelector": "div.iui-component.iui-data-view > div > div.data-header:nth-of-type(1) > div.bulk-actions-and-sort:nth-of-type(3) > span.num-records-container",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "pathExact": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml"
        ],
        "selector": "div.iui-component.iui-data-view > div > div.data-header:nth-of-type(1) > div.bulk-actions-and-sort:nth-of-type(3) > span.num-records-container"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices"
    },
    {
      "id": "finance-impact-com-invoices-generated-on-c813835",
      "source": "Generated on",
      "target": "生成日期",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "impact-com-invoices",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-0\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "pathExact": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-0\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices"
    },
    {
      "id": "finance-impact-com-invoices-document-c1ac0b0",
      "source": "Document",
      "target": "文档编号",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "impact-com-invoices",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-1\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "pathExact": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-1\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices"
    },
    {
      "id": "finance-impact-com-invoices-type-fd8bc69",
      "source": "Type",
      "target": "文档类型",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "impact-com-invoices",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-2\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "pathExact": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-2\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices"
    },
    {
      "id": "finance-impact-com-invoices-subscription-fee-2fe4d5b",
      "source": "Subscription Fee",
      "target": "订阅费",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "impact-com-invoices",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-3\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "pathExact": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-3\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices"
    },
    {
      "id": "finance-impact-com-invoices-incremental-growth-fee-14cd2d9",
      "source": "Incremental Growth Fee",
      "target": "超额用量费",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "impact-com-invoices",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-4\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "pathExact": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-4\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices",
      "helpTopicId": "finance-incremental-fee"
    },
    {
      "id": "finance-impact-com-invoices-other-fees-7ff9d5a",
      "source": "Other Fees",
      "target": "其他服务费",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "impact-com-invoices",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-5\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "pathExact": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-5\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices"
    },
    {
      "id": "finance-impact-com-invoices-total-5f40232",
      "source": "Total",
      "target": "含税合计",
      "reason": "该财务表格计税后的合计金额，原数值保持。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "impact-com-invoices",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-6\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "pathExact": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-6\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices"
    },
    {
      "id": "finance-impact-com-invoices-status-cfa735c",
      "source": "Status",
      "target": "付款状态",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "impact-com-invoices",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-7\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "pathExact": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-7\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices"
    },
    {
      "id": "finance-impact-com-invoices-sorry-there-s-no-data-to-show-7c92cbb",
      "source": "Sorry! There's no data to show",
      "target": "当前没有可显示的数据",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "impact-com-invoices",
      "observedSelector": "div.iui-component.iui-data-view > div > div.data-container:nth-of-type(3) > div.no-results-container:nth-of-type(2) > div",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "pathExact": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml"
        ],
        "selector": "div.iui-component.iui-data-view > div > div.data-container:nth-of-type(3) > div.no-results-container:nth-of-type(2) > div"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices"
    },
    {
      "id": "finance-impact-com-invoices-month-9e34f05",
      "source": "Month",
      "target": "月份",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "impact-com-invoices",
      "observedSelector": "span.filter > div.iui-component.iui-multiselect-input > div.btn-container > button.focused.responsive > span",
      "observedKind": "control-label",
      "observedStates": [
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "pathExact": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml"
        ],
        "selector": "span.filter > div.iui-component.iui-multiselect-input > div.btn-container > button.focused.responsive > span"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices"
    },
    {
      "id": "finance-impact-com-invoices-all-afa4bfa",
      "source": "All",
      "target": "全部",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "impact-com-invoices",
      "observedSelector": "div._4-49-7_AJT64._4-49-7_z1H5z:nth-of-type(2) > ul.iui-component.iui-list > li:nth-of-type(1) > div._4-49-7_VbPJn._4-49-7_MBWff > div.text-ellipsis._4-49-7_Baf2T",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "pathExact": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml"
        ],
        "selector": "div:nth-of-type(2) > ul.iui-component.iui-list > li:nth-of-type(1) > div > div.text-ellipsis"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices"
    },
    {
      "id": "finance-impact-com-invoices-clear-90f864e",
      "source": "Clear",
      "target": "清除",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "impact-com-invoices",
      "observedSelector": "button[data-testid=\"uicl-multi-select-input-clear-button\"]",
      "observedKind": "control-label",
      "observedStates": [
        "opened:Month"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "pathExact": "/secure/finance/app/list-adv-impact-invoices-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/finance-impact-invoices.ihtml"
        ],
        "selector": "button[data-testid=\"uicl-multi-select-input-clear-button\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices"
    },
    {
      "id": "finance-general-overview-56463bd",
      "source": "Overview",
      "target": "财务总览",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand"
    },
    {
      "id": "finance-general-reports-e2a647e",
      "source": "Reports",
      "target": "财务报告",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand"
    },
    {
      "id": "finance-general-make-deposit-009719c",
      "source": "Make Deposit",
      "target": "充值",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand"
    },
    {
      "id": "finance-general-transfers-9e674a6",
      "source": "Transfers",
      "target": "伙伴资金转账",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand",
      "helpTopicId": "finance-pft"
    },
    {
      "id": "finance-general-documents-7d138b2",
      "source": "Documents",
      "target": "账单文档",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand"
    },
    {
      "id": "finance-general-subscription-1979ef8",
      "source": "Subscription",
      "target": "订阅与用量",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand"
    },
    {
      "id": "finance-general-settings-496c7c9",
      "source": "Settings",
      "target": "财务设置",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand"
    },
    {
      "id": "finance-general-general-1433738",
      "source": "General",
      "target": "常规设置",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(1) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(1) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand"
    },
    {
      "id": "finance-general-legal-entities-d55b846",
      "source": "Legal Entities",
      "target": "法律主体",
      "reason": "承接合同、账单及税务信息的法律主体，区别推广计划。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(2) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(2) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand",
      "helpTopicId": "finance-legal-entity"
    },
    {
      "id": "finance-general-billing-groups-679f22d",
      "source": "Billing Groups",
      "target": "账单分组",
      "reason": "按推广计划归集费用并开账单的分组，区别伙伴分组。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(3) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(3) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand",
      "helpTopicId": "finance-billing-group"
    },
    {
      "id": "finance-general-funding-accounts-8cc034a",
      "source": "Funding Accounts",
      "target": "资金账户",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(4) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(4) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand",
      "helpTopicId": "finance-funding-account"
    },
    {
      "id": "finance-general-payment-methods-706ddcb",
      "source": "Payment Methods",
      "target": "充值付款方式",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(5) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(5) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand"
    },
    {
      "id": "finance-general-automatic-payments-96fab69",
      "source": "Automatic Payments",
      "target": "自动充值",
      "reason": "向品牌资金账户自动充值，区别伙伴提现或改变佣金。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(6) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(6) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand",
      "helpTopicId": "finance-autofund"
    },
    {
      "id": "finance-general-settings-51ff4d3",
      "source": "Settings",
      "target": "通知设置",
      "reason": "真实顶部通知面板的设置入口；用通知容器和精确页面作用域隔离，与财务设置菜单区分。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text._4-64-3_SuBBQ",
      "observedKind": "notification-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact"
    },
    {
      "id": "finance-general-general-4788f9d",
      "source": "General",
      "target": "常规设置",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "#app > div.customer-settings-general > div.screen-content:nth-of-type(1) > h1",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/customer-settings-general-view.ihtml",
        "pathExact": "/secure/finance/app/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "#app > div.customer-settings-general > div.screen-content:nth-of-type(1) > h1"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand"
    },
    {
      "id": "finance-general-finance-contacts-78aeb29",
      "source": "Finance Contacts",
      "target": "财务联系人",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "div.customer-settings-general > div.screen-content:nth-of-type(1) > div.section:nth-of-type(1) > div.section-headings:nth-of-type(1) > h3.section-label",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/customer-settings-general-view.ihtml",
        "pathExact": "/secure/finance/app/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "div.customer-settings-general > div.screen-content:nth-of-type(1) > div.section:nth-of-type(1) > div.section-headings:nth-of-type(1) > h3.section-label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand"
    },
    {
      "id": "finance-general-select-a-contact-for-finance-updates-and-e-7af6399",
      "source": "Select a contact for finance updates and email document delivery",
      "target": "选择接收财务更新及账单邮件的联系人",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "div.customer-settings-general > div.screen-content:nth-of-type(1) > div.section:nth-of-type(1) > div.section-headings:nth-of-type(1) > p.section-info",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/customer-settings-general-view.ihtml",
        "pathExact": "/secure/finance/app/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "div.customer-settings-general > div.screen-content:nth-of-type(1) > div.section:nth-of-type(1) > div.section-headings:nth-of-type(1) > p.section-info"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand"
    },
    {
      "id": "finance-general-primary-contact-5dfad5a",
      "source": "Primary Contact",
      "target": "主要联系人",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "#primary-contact-existing > div._4-71-1_EdXeI:nth-of-type(1) > label._4-71-1_w7BC-",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/customer-settings-general-view.ihtml",
        "pathExact": "/secure/finance/app/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "#primary-contact-existing > div:nth-of-type(1) > label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand"
    },
    {
      "id": "finance-general-existing-account-user-c2d9811",
      "source": "Existing Account User",
      "target": "已有账户用户",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "#primary-contact-existing > div._4-71-1_uG1JJ:nth-of-type(2) > label._4-71-1_oto45._4-71-1_ryDSx",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/customer-settings-general-view.ihtml",
        "pathExact": "/secure/finance/app/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "#primary-contact-existing > div:nth-of-type(2) > label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand"
    },
    {
      "id": "finance-general-other-contact-2b72ecb",
      "source": "Other Contact",
      "target": "其他联系人",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "#primary-contact-other > div._4-71-1_uG1JJ > label._4-71-1_oto45._4-71-1_ryDSx",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/customer-settings-general-view.ihtml",
        "pathExact": "/secure/finance/app/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "#primary-contact-other > div > label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand"
    },
    {
      "id": "finance-general-additional-contacts-0db6c05",
      "source": "Additional Contacts",
      "target": "其他财务联系人",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "#additional-contacts > div._4-71-1_EdXeI:nth-of-type(1) > label._4-71-1_w7BC-:nth-of-type(1)",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/customer-settings-general-view.ihtml",
        "pathExact": "/secure/finance/app/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "#additional-contacts > div:nth-of-type(1) > label:nth-of-type(1)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand"
    },
    {
      "id": "finance-general-specify-additional-contacts-email-address--1cd7415",
      "source": "Specify additional contacts' email address(es) for finance updates and email document delivery",
      "target": "填写其他联系人的邮箱，用于接收财务更新和账单邮件",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "#additional-contacts > div._4-71-1_EdXeI:nth-of-type(1) > label._4-71-1_ryDSx._4-71-1_GHORB:nth-of-type(2)",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/customer-settings-general-view.ihtml",
        "pathExact": "/secure/finance/app/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "#additional-contacts > div:nth-of-type(1) > label:nth-of-type(2)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand"
    },
    {
      "id": "finance-general-monthly-closing-report-1596486",
      "source": "Monthly Closing Report",
      "target": "月结报表",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "div.customer-settings-general > div.screen-content:nth-of-type(1) > div.section:nth-of-type(2) > div.section-headings:nth-of-type(1) > h3.section-label",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/customer-settings-general-view.ihtml",
        "pathExact": "/secure/finance/app/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "div.customer-settings-general > div.screen-content:nth-of-type(1) > div.section:nth-of-type(2) > div.section-headings:nth-of-type(1) > h3.section-label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand"
    },
    {
      "id": "finance-general-specify-either-action-reporting-date-or-ac-c24fe11",
      "source": "Specify either action reporting date or action locking date month as the revenue recognition methodology",
      "target": "选择按转化发生月份或转化锁定月份归集月结费用",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "div.customer-settings-general > div.screen-content:nth-of-type(1) > div.section:nth-of-type(2) > div.section-headings:nth-of-type(1) > p.section-info",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/customer-settings-general-view.ihtml",
        "pathExact": "/secure/finance/app/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "div.customer-settings-general > div.screen-content:nth-of-type(1) > div.section:nth-of-type(2) > div.section-headings:nth-of-type(1) > p.section-info"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand"
    },
    {
      "id": "finance-general-revenue-recognition-method-dfc5828",
      "source": "Revenue Recognition Method",
      "target": "月结日期口径",
      "reason": "财务常规设置选择成本按发生或锁定日期归集的月结口径，不替用户作会计合规判断。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "div.screen-content:nth-of-type(1) > div.section:nth-of-type(2) > div.iui-component.iui-field-label-pair:nth-of-type(2) > div._4-71-1_EdXeI:nth-of-type(1) > label._4-71-1_w7BC-",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/customer-settings-general-view.ihtml",
        "pathExact": "/secure/finance/app/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "div.screen-content:nth-of-type(1) > div.section:nth-of-type(2) > div.iui-component.iui-field-label-pair:nth-of-type(2) > div:nth-of-type(1) > label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand",
      "helpTopicId": "finance-revenue-recognition"
    },
    {
      "id": "finance-general-use-the-month-when-actions-are-b2cc4db",
      "source": "Use the month when actions are",
      "target": "月结月份按转化",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "div.screen-content:nth-of-type(1) > div.section:nth-of-type(2) > div.iui-component.iui-field-label-pair:nth-of-type(2) > div._4-71-1_uG1JJ:nth-of-type(2) > label._4-71-1_oto45._4-71-1_ryDSx:nth-of-type(1)",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/customer-settings-general-view.ihtml",
        "pathExact": "/secure/finance/app/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "div.screen-content:nth-of-type(1) > div.section:nth-of-type(2) > div.iui-component.iui-field-label-pair:nth-of-type(2) > div:nth-of-type(2) > label:nth-of-type(1)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand"
    },
    {
      "id": "finance-general-reported-f24c069",
      "source": "Reported",
      "target": "发生日期",
      "reason": "该月结设置按转化发生日期或费用锁定日期归集月份，与真实付款日期分开；配合原生拆分句保持自然中文。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "#monthly-closing-report > div.btn-container > button.responsive.outline > span.value:nth-of-type(1) > span",
      "observedKind": "control-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/customer-settings-general-view.ihtml",
        "pathExact": "/secure/finance/app/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "#monthly-closing-report > div.btn-container > button.responsive.outline > span.value:nth-of-type(1) > span"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand"
    },
    {
      "id": "finance-general-as-the-month-for-revenue-recognition-aa06efd",
      "source": "as the month for revenue recognition",
      "target": "所在月份确定",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "div.screen-content:nth-of-type(1) > div.section:nth-of-type(2) > div.iui-component.iui-field-label-pair:nth-of-type(2) > div._4-71-1_uG1JJ:nth-of-type(2) > label._4-71-1_oto45._4-71-1_ryDSx:nth-of-type(2)",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/customer-settings-general-view.ihtml",
        "pathExact": "/secure/finance/app/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "div.screen-content:nth-of-type(1) > div.section:nth-of-type(2) > div.iui-component.iui-field-label-pair:nth-of-type(2) > div:nth-of-type(2) > label:nth-of-type(2)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand"
    },
    {
      "id": "finance-general-funder-type-8600f50",
      "source": "Funder Type",
      "target": "资金结算类型",
      "reason": "官方Funder Type同时约束充值文档、合同锁定及付款条款、即时伙伴转账，不能仅理解成充值付款方式或资金提供商。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "div.customer-settings-general > div.screen-content:nth-of-type(1) > div.section:nth-of-type(3) > div.section-headings:nth-of-type(1) > h3.section-label",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/customer-settings-general-view.ihtml",
        "pathExact": "/secure/finance/app/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "div.customer-settings-general > div.screen-content:nth-of-type(1) > div.section:nth-of-type(3) > div.section-headings:nth-of-type(1) > h3.section-label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand",
      "helpTopicId": "finance-funder-type"
    },
    {
      "id": "finance-general-not-indicated-no-restrictions-931bba3",
      "source": "Not indicated (no restrictions)",
      "target": "未指定（无策略限制）",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "div.screen-content:nth-of-type(1) > div.section:nth-of-type(3) > div.iui-component.iui-field-label-pair:nth-of-type(2) > div._4-71-1_EdXeI:nth-of-type(1) > label._4-71-1_ryDSx._4-71-1_GHORB",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/customer-settings-general-view.ihtml",
        "pathExact": "/secure/finance/app/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "div.screen-content:nth-of-type(1) > div.section:nth-of-type(3) > div.iui-component.iui-field-label-pair:nth-of-type(2) > div:nth-of-type(1) > label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand"
    },
    {
      "id": "finance-general-invoicing-method-3e6507f",
      "source": "Invoicing Method",
      "target": "开账单方式",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "div.customer-settings-general > div.screen-content:nth-of-type(1) > div.section:nth-of-type(4) > div.section-headings:nth-of-type(1) > h3.section-label",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/customer-settings-general-view.ihtml",
        "pathExact": "/secure/finance/app/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "div.customer-settings-general > div.screen-content:nth-of-type(1) > div.section:nth-of-type(4) > div.section-headings:nth-of-type(1) > h3.section-label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand",
      "helpTopicId": "finance-invoicing-method"
    },
    {
      "id": "finance-general-direct-invoicing-to-partner-accounts-with--6b4b948",
      "source": "Direct invoicing to Partner accounts, with the exception of region-based invoicing via impact.com entities",
      "target": "与伙伴直接开具账单；按地区经 impact.com 法律主体开具账单的情况除外",
      "reason": "按品牌官方开账单方式解释直接与伙伴或经impact.com法律主体开账单；兼用标签不据此反转真实账单付款方和收款方。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "div.screen-content:nth-of-type(1) > div.section:nth-of-type(4) > div.iui-component.iui-field-label-pair:nth-of-type(2) > div._4-71-1_EdXeI:nth-of-type(1) > label._4-71-1_ryDSx._4-71-1_GHORB",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/customer-settings-general-view.ihtml",
        "pathExact": "/secure/finance/app/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "div.screen-content:nth-of-type(1) > div.section:nth-of-type(4) > div.iui-component.iui-field-label-pair:nth-of-type(2) > div:nth-of-type(1) > label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand"
    },
    {
      "id": "finance-general-save-f76250f",
      "source": "Save",
      "target": "保存",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "button[data-testid=\"uicl-button\"]",
      "observedKind": "control-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/customer-settings-general-view.ihtml",
        "pathExact": "/secure/finance/app/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "button[data-testid=\"uicl-button\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand"
    },
    {
      "id": "finance-general-reported-99da9c4",
      "source": "Reported",
      "target": "发生日期",
      "reason": "该月结设置按转化发生日期或费用锁定日期归集月份，与真实付款日期分开；配合原生拆分句保持自然中文。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "general",
      "observedSelector": "#monthly-closing-report > div.btn-container > button.focused.responsive > span.value:nth-of-type(1) > span",
      "observedKind": "control-label",
      "observedStates": [
        "opened:Revenue Recognition Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/customer-settings-general-view.ihtml",
        "pathExact": "/secure/finance/app/customer-settings-general-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/customer-settings-general-view.ihtml"
        ],
        "selector": "#monthly-closing-report > div.btn-container > button.focused.responsive > span.value:nth-of-type(1) > span"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand"
    },
    {
      "id": "finance-legal-entities-overview-6e2cd72",
      "source": "Overview",
      "target": "财务总览",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "legal-entities",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/legal-entities-view.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities"
    },
    {
      "id": "finance-legal-entities-reports-09b2e92",
      "source": "Reports",
      "target": "财务报告",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "legal-entities",
      "observedSelector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/legal-entities-view.ihtml"
        ],
        "selector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities"
    },
    {
      "id": "finance-legal-entities-make-deposit-7fb2128",
      "source": "Make Deposit",
      "target": "充值",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "legal-entities",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/legal-entities-view.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities"
    },
    {
      "id": "finance-legal-entities-transfers-0cf2da8",
      "source": "Transfers",
      "target": "伙伴资金转账",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "legal-entities",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/legal-entities-view.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities",
      "helpTopicId": "finance-pft"
    },
    {
      "id": "finance-legal-entities-documents-4020758",
      "source": "Documents",
      "target": "账单文档",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "legal-entities",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/legal-entities-view.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities"
    },
    {
      "id": "finance-legal-entities-subscription-933f589",
      "source": "Subscription",
      "target": "订阅与用量",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "legal-entities",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/legal-entities-view.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities"
    },
    {
      "id": "finance-legal-entities-settings-929135e",
      "source": "Settings",
      "target": "财务设置",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "legal-entities",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/legal-entities-view.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities"
    },
    {
      "id": "finance-legal-entities-general-f2d00d2",
      "source": "General",
      "target": "常规设置",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "legal-entities",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(1) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/legal-entities-view.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(1) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities"
    },
    {
      "id": "finance-legal-entities-legal-entities-9652cb7",
      "source": "Legal Entities",
      "target": "法律主体",
      "reason": "承接合同、账单及税务信息的法律主体，区别推广计划。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "legal-entities",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(2) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/legal-entities-view.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(2) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities",
      "helpTopicId": "finance-legal-entity"
    },
    {
      "id": "finance-legal-entities-billing-groups-72dc848",
      "source": "Billing Groups",
      "target": "账单分组",
      "reason": "按推广计划归集费用并开账单的分组，区别伙伴分组。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "legal-entities",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(3) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/legal-entities-view.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(3) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities",
      "helpTopicId": "finance-billing-group"
    },
    {
      "id": "finance-legal-entities-funding-accounts-504555f",
      "source": "Funding Accounts",
      "target": "资金账户",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "legal-entities",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(4) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/legal-entities-view.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(4) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities",
      "helpTopicId": "finance-funding-account"
    },
    {
      "id": "finance-legal-entities-payment-methods-96c5851",
      "source": "Payment Methods",
      "target": "充值付款方式",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "legal-entities",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(5) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/legal-entities-view.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(5) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities"
    },
    {
      "id": "finance-legal-entities-automatic-payments-48b98fd",
      "source": "Automatic Payments",
      "target": "自动充值",
      "reason": "向品牌资金账户自动充值，区别伙伴提现或改变佣金。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "legal-entities",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(6) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/legal-entities-view.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(6) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities",
      "helpTopicId": "finance-autofund"
    },
    {
      "id": "finance-legal-entities-settings-503ef12",
      "source": "Settings",
      "target": "通知设置",
      "reason": "真实顶部通知面板的设置入口；用通知容器和精确页面作用域隔离，与财务设置菜单区分。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "legal-entities",
      "observedSelector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text._4-64-3_SuBBQ",
      "observedKind": "notification-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/legal-entities-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/legal-entities-view.ihtml"
        ],
        "selector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact"
    },
    {
      "id": "finance-legal-entities-legal-entities-2db2616",
      "source": "Legal Entities",
      "target": "法律主体",
      "reason": "承接合同、账单及税务信息的法律主体，区别推广计划。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "legal-entities",
      "observedSelector": "#legal-entities > div > div.screen-content > div.upper-content:nth-of-type(1) > h1",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/legal-entities-view.ihtml",
        "pathExact": "/secure/finance/app/legal-entities-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/legal-entities-view.ihtml"
        ],
        "selector": "#legal-entities > div > div.screen-content > div.upper-content:nth-of-type(1) > h1"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities",
      "helpTopicId": "finance-legal-entity"
    },
    {
      "id": "finance-legal-entities-row-6c08c28",
      "source": "row",
      "target": "行",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "legal-entities",
      "observedSelector": "#legal-entities-data-view > div > div.data-header:nth-of-type(1) > div.bulk-actions-and-sort:nth-of-type(2) > span.num-records-container",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/legal-entities-view.ihtml",
        "pathExact": "/secure/finance/app/legal-entities-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/legal-entities-view.ihtml"
        ],
        "selector": "#legal-entities-data-view > div > div.data-header:nth-of-type(1) > div.bulk-actions-and-sort:nth-of-type(2) > span.num-records-container"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities"
    },
    {
      "id": "finance-legal-entities-name-ac432db",
      "source": "Name",
      "target": "名称",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "legal-entities",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-0\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/legal-entities-view.ihtml",
        "pathExact": "/secure/finance/app/legal-entities-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/legal-entities-view.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-0\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities"
    },
    {
      "id": "finance-legal-entities-billing-groups-be0648d",
      "source": "Billing Groups",
      "target": "账单分组",
      "reason": "按推广计划归集费用并开账单的分组，区别伙伴分组。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "legal-entities",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-1\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/legal-entities-view.ihtml",
        "pathExact": "/secure/finance/app/legal-entities-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/legal-entities-view.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-1\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities",
      "helpTopicId": "finance-billing-group"
    },
    {
      "id": "finance-legal-entities-funding-accounts-5fad94f",
      "source": "Funding Accounts",
      "target": "资金账户",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "legal-entities",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-2\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/legal-entities-view.ihtml",
        "pathExact": "/secure/finance/app/legal-entities-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/legal-entities-view.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-2\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities",
      "helpTopicId": "finance-funding-account"
    },
    {
      "id": "finance-legal-entities-indirect-tax-country-region-1889886",
      "source": "Indirect Tax Country / Region",
      "target": "间接税登记国家/地区",
      "reason": "官方法律主体说明指间接税登记国家或地区；不能简单等同账单地址所在国家，也不改变税务身份或税率。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "legal-entities",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-3\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/legal-entities-view.ihtml",
        "pathExact": "/secure/finance/app/legal-entities-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/legal-entities-view.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-3\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities",
      "helpTopicId": "finance-indirect-tax-region"
    },
    {
      "id": "finance-legal-entities-edit-ff80f07",
      "source": "Edit",
      "target": "编辑",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "legal-entities",
      "observedSelector": "button[data-testid=\"uicl-button\"]",
      "observedKind": "control-label",
      "observedStates": [
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/legal-entities-view.ihtml",
        "pathExact": "/secure/finance/app/legal-entities-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/legal-entities-view.ihtml"
        ],
        "selector": "button[data-testid=\"uicl-button\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities"
    },
    {
      "id": "finance-billing-groups-overview-f990c9d",
      "source": "Overview",
      "target": "财务总览",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "billing-groups",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/billing-groups.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-manage-billing-groups-and-funding-accounts-as-a-brand"
    },
    {
      "id": "finance-billing-groups-reports-c8c47e1",
      "source": "Reports",
      "target": "财务报告",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "billing-groups",
      "observedSelector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/billing-groups.ihtml"
        ],
        "selector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-manage-billing-groups-and-funding-accounts-as-a-brand"
    },
    {
      "id": "finance-billing-groups-make-deposit-df52c1d",
      "source": "Make Deposit",
      "target": "充值",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "billing-groups",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/billing-groups.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-manage-billing-groups-and-funding-accounts-as-a-brand"
    },
    {
      "id": "finance-billing-groups-transfers-c759b7c",
      "source": "Transfers",
      "target": "伙伴资金转账",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "billing-groups",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/billing-groups.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-manage-billing-groups-and-funding-accounts-as-a-brand",
      "helpTopicId": "finance-pft"
    },
    {
      "id": "finance-billing-groups-documents-da953a5",
      "source": "Documents",
      "target": "账单文档",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "billing-groups",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/billing-groups.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-manage-billing-groups-and-funding-accounts-as-a-brand"
    },
    {
      "id": "finance-billing-groups-subscription-6985aab",
      "source": "Subscription",
      "target": "订阅与用量",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "billing-groups",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/billing-groups.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-manage-billing-groups-and-funding-accounts-as-a-brand"
    },
    {
      "id": "finance-billing-groups-settings-8645c63",
      "source": "Settings",
      "target": "财务设置",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "billing-groups",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/billing-groups.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-manage-billing-groups-and-funding-accounts-as-a-brand"
    },
    {
      "id": "finance-billing-groups-general-7b1cbb3",
      "source": "General",
      "target": "常规设置",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "billing-groups",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(1) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/billing-groups.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(1) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-manage-billing-groups-and-funding-accounts-as-a-brand"
    },
    {
      "id": "finance-billing-groups-legal-entities-69f173c",
      "source": "Legal Entities",
      "target": "法律主体",
      "reason": "承接合同、账单及税务信息的法律主体，区别推广计划。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "billing-groups",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(2) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/billing-groups.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(2) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-manage-billing-groups-and-funding-accounts-as-a-brand",
      "helpTopicId": "finance-legal-entity"
    },
    {
      "id": "finance-billing-groups-billing-groups-c0b3e84",
      "source": "Billing Groups",
      "target": "账单分组",
      "reason": "按推广计划归集费用并开账单的分组，区别伙伴分组。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "billing-groups",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(3) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/billing-groups.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(3) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-manage-billing-groups-and-funding-accounts-as-a-brand",
      "helpTopicId": "finance-billing-group"
    },
    {
      "id": "finance-billing-groups-funding-accounts-b83ba8e",
      "source": "Funding Accounts",
      "target": "资金账户",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "billing-groups",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(4) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/billing-groups.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(4) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-manage-billing-groups-and-funding-accounts-as-a-brand",
      "helpTopicId": "finance-funding-account"
    },
    {
      "id": "finance-billing-groups-payment-methods-1eb4955",
      "source": "Payment Methods",
      "target": "充值付款方式",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "billing-groups",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(5) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/billing-groups.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(5) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-manage-billing-groups-and-funding-accounts-as-a-brand"
    },
    {
      "id": "finance-billing-groups-automatic-payments-edba0c2",
      "source": "Automatic Payments",
      "target": "自动充值",
      "reason": "向品牌资金账户自动充值，区别伙伴提现或改变佣金。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "billing-groups",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(6) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/billing-groups.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(6) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-manage-billing-groups-and-funding-accounts-as-a-brand",
      "helpTopicId": "finance-autofund"
    },
    {
      "id": "finance-billing-groups-settings-5ccacc7",
      "source": "Settings",
      "target": "通知设置",
      "reason": "真实顶部通知面板的设置入口；用通知容器和精确页面作用域隔离，与财务设置菜单区分。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "billing-groups",
      "observedSelector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text._4-64-3_SuBBQ",
      "observedKind": "notification-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/billing-groups.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/billing-groups.ihtml"
        ],
        "selector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact"
    },
    {
      "id": "finance-billing-groups-billing-groups-d54bfcc",
      "source": "Billing Groups",
      "target": "账单分组",
      "reason": "按推广计划归集费用并开账单的分组，区别伙伴分组。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "billing-groups",
      "observedSelector": "#billing-groups > div > div.upper-content:nth-of-type(1) > h1",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/billing-groups-view.ihtml",
        "pathExact": "/secure/finance/app/billing-groups-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/billing-groups.ihtml"
        ],
        "selector": "#billing-groups > div > div.upper-content:nth-of-type(1) > h1"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-manage-billing-groups-and-funding-accounts-as-a-brand",
      "helpTopicId": "finance-billing-group"
    },
    {
      "id": "finance-billing-groups-row-1781425",
      "source": "row",
      "target": "行",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "billing-groups",
      "observedSelector": "#billing-groups-dataview > div > div.data-header:nth-of-type(1) > div.bulk-actions-and-sort:nth-of-type(2) > span.num-records-container",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/billing-groups-view.ihtml",
        "pathExact": "/secure/finance/app/billing-groups-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/billing-groups.ihtml"
        ],
        "selector": "#billing-groups-dataview > div > div.data-header:nth-of-type(1) > div.bulk-actions-and-sort:nth-of-type(2) > span.num-records-container"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-manage-billing-groups-and-funding-accounts-as-a-brand"
    },
    {
      "id": "finance-billing-groups-name-80f413e",
      "source": "Name",
      "target": "名称",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "billing-groups",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-0\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/billing-groups-view.ihtml",
        "pathExact": "/secure/finance/app/billing-groups-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/billing-groups.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-0\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-manage-billing-groups-and-funding-accounts-as-a-brand"
    },
    {
      "id": "finance-billing-groups-fees-03ab5e2",
      "source": "Fees",
      "target": "费用",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "billing-groups",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-1\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/billing-groups-view.ihtml",
        "pathExact": "/secure/finance/app/billing-groups-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/billing-groups.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-1\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-manage-billing-groups-and-funding-accounts-as-a-brand"
    },
    {
      "id": "finance-billing-groups-programs-2b6dc29",
      "source": "Programs",
      "target": "推广计划",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "billing-groups",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-2\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/billing-groups-view.ihtml",
        "pathExact": "/secure/finance/app/billing-groups-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/billing-groups.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-2\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-manage-billing-groups-and-funding-accounts-as-a-brand"
    },
    {
      "id": "finance-billing-groups-funding-accounts-120b628",
      "source": "Funding Accounts",
      "target": "资金账户",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "billing-groups",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-3\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/billing-groups-view.ihtml",
        "pathExact": "/secure/finance/app/billing-groups-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/billing-groups.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-3\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-manage-billing-groups-and-funding-accounts-as-a-brand",
      "helpTopicId": "finance-funding-account"
    },
    {
      "id": "finance-funding-accounts-overview-a04cb6e",
      "source": "Overview",
      "target": "财务总览",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "funding-accounts",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/funding-accounts.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-funding-accounts-reports-9f79600",
      "source": "Reports",
      "target": "财务报告",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "funding-accounts",
      "observedSelector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/funding-accounts.ihtml"
        ],
        "selector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-funding-accounts-make-deposit-adff5f9",
      "source": "Make Deposit",
      "target": "充值",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "funding-accounts",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/funding-accounts.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-funding-accounts-transfers-f91d2f9",
      "source": "Transfers",
      "target": "伙伴资金转账",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "funding-accounts",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/funding-accounts.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained",
      "helpTopicId": "finance-pft"
    },
    {
      "id": "finance-funding-accounts-documents-3cce5ba",
      "source": "Documents",
      "target": "账单文档",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "funding-accounts",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/funding-accounts.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-funding-accounts-subscription-67669e4",
      "source": "Subscription",
      "target": "订阅与用量",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "funding-accounts",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/funding-accounts.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-funding-accounts-settings-15cde73",
      "source": "Settings",
      "target": "财务设置",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "funding-accounts",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/funding-accounts.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-funding-accounts-general-c5aa113",
      "source": "General",
      "target": "常规设置",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "funding-accounts",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(1) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/funding-accounts.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(1) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-funding-accounts-legal-entities-120049b",
      "source": "Legal Entities",
      "target": "法律主体",
      "reason": "承接合同、账单及税务信息的法律主体，区别推广计划。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "funding-accounts",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(2) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/funding-accounts.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(2) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained",
      "helpTopicId": "finance-legal-entity"
    },
    {
      "id": "finance-funding-accounts-billing-groups-fbec042",
      "source": "Billing Groups",
      "target": "账单分组",
      "reason": "按推广计划归集费用并开账单的分组，区别伙伴分组。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "funding-accounts",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(3) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/funding-accounts.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(3) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained",
      "helpTopicId": "finance-billing-group"
    },
    {
      "id": "finance-funding-accounts-funding-accounts-180f03c",
      "source": "Funding Accounts",
      "target": "资金账户",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "funding-accounts",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(4) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/funding-accounts.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(4) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained",
      "helpTopicId": "finance-funding-account"
    },
    {
      "id": "finance-funding-accounts-payment-methods-e2647f0",
      "source": "Payment Methods",
      "target": "充值付款方式",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "funding-accounts",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(5) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/funding-accounts.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(5) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-funding-accounts-automatic-payments-798768d",
      "source": "Automatic Payments",
      "target": "自动充值",
      "reason": "向品牌资金账户自动充值，区别伙伴提现或改变佣金。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "funding-accounts",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(6) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/funding-accounts.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(6) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained",
      "helpTopicId": "finance-autofund"
    },
    {
      "id": "finance-funding-accounts-settings-6359757",
      "source": "Settings",
      "target": "通知设置",
      "reason": "真实顶部通知面板的设置入口；用通知容器和精确页面作用域隔离，与财务设置菜单区分。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "funding-accounts",
      "observedSelector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text._4-64-3_SuBBQ",
      "observedKind": "notification-label",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/funding-accounts.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/funding-accounts.ihtml"
        ],
        "selector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact"
    },
    {
      "id": "finance-funding-accounts-funding-accounts-a560acb",
      "source": "Funding Accounts",
      "target": "资金账户",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "funding-accounts",
      "observedSelector": "div.iui-component.iui-data-view > div > div.data-header:nth-of-type(1) > div.top-info:nth-of-type(1) > h1",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-digital-wallets-flow.ihtml",
        "pathExact": "/secure/finance/app/list-digital-wallets-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/funding-accounts.ihtml"
        ],
        "selector": "div.iui-component.iui-data-view > div > div.data-header:nth-of-type(1) > div.top-info:nth-of-type(1) > h1"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained",
      "helpTopicId": "finance-funding-account"
    },
    {
      "id": "finance-funding-accounts-row-39d1bdb",
      "source": "row",
      "target": "行",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "funding-accounts",
      "observedSelector": "div.iui-component.iui-data-view > div > div.data-header:nth-of-type(1) > div.bulk-actions-and-sort:nth-of-type(2) > span.num-records-container",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline",
        "deep-existing-entity-detail",
        "deep-existing-entity-disclosure"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-digital-wallets-flow.ihtml",
        "pathExact": "/secure/finance/app/list-digital-wallets-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/funding-accounts.ihtml"
        ],
        "selector": "div.iui-component.iui-data-view > div > div.data-header:nth-of-type(1) > div.bulk-actions-and-sort:nth-of-type(2) > span.num-records-container"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-funding-accounts-id-63c22ad",
      "source": "ID",
      "target": "账户编号",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "funding-accounts",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-0\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-digital-wallets-flow.ihtml",
        "pathExact": "/secure/finance/app/list-digital-wallets-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/funding-accounts.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-0\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-funding-accounts-name-e3376cf",
      "source": "Name",
      "target": "名称",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "funding-accounts",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-1\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-digital-wallets-flow.ihtml",
        "pathExact": "/secure/finance/app/list-digital-wallets-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/funding-accounts.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-1\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-funding-accounts-currency-40c5732",
      "source": "Currency",
      "target": "币种",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "funding-accounts",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-2\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-digital-wallets-flow.ihtml",
        "pathExact": "/secure/finance/app/list-digital-wallets-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/funding-accounts.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-2\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-funding-accounts-billing-groups-e8a0f2b",
      "source": "Billing Groups",
      "target": "账单分组",
      "reason": "按推广计划归集费用并开账单的分组，区别伙伴分组。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "funding-accounts",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-3\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-digital-wallets-flow.ihtml",
        "pathExact": "/secure/finance/app/list-digital-wallets-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/funding-accounts.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-3\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained",
      "helpTopicId": "finance-billing-group"
    },
    {
      "id": "finance-funding-accounts-legal-entity-dbea4e4",
      "source": "Legal Entity",
      "target": "法律主体",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "funding-accounts",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-4\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-digital-wallets-flow.ihtml",
        "pathExact": "/secure/finance/app/list-digital-wallets-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/funding-accounts.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-4\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained",
      "helpTopicId": "finance-legal-entity"
    },
    {
      "id": "finance-funding-accounts-balance-4100ae0",
      "source": "Balance",
      "target": "余额",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "funding-accounts",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-5\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-digital-wallets-flow.ihtml",
        "pathExact": "/secure/finance/app/list-digital-wallets-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/funding-accounts.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-5\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained"
    },
    {
      "id": "finance-payment-methods-payment-methods-b3e91df",
      "source": "Payment Methods",
      "target": "充值付款方式",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "h1[data-testid=\"payment-method-listing-header\"]",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "h1[data-testid=\"payment-method-listing-header\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-add-payment-method-158de5c",
      "source": "Add Payment Method",
      "target": "添加付款方式",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "#btn-create",
      "observedKind": "control-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "#btn-create"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-row-d415d45",
      "source": "row",
      "target": "行",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div.iui-component.iui-data-view:nth-of-type(2) > div > div.data-header:nth-of-type(1) > div.bulk-actions-and-sort > span.num-records-container",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "div.iui-component.iui-data-view:nth-of-type(2) > div > div.data-header:nth-of-type(1) > div.bulk-actions-and-sort > span.num-records-container"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-name-2ad7349",
      "source": "Name",
      "target": "名称",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-0\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-0\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-type-3b6f130",
      "source": "Type",
      "target": "付款方式类型",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-1\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-1\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-account-card-b448ef4",
      "source": "Account/Card #",
      "target": "银行账号/卡号",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-2\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-2\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-funding-account-b474cc2",
      "source": "Funding account",
      "target": "资金账户",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "span[data-testid=\"uicl-data-table-column-label-3\"]",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "span[data-testid=\"uicl-data-table-column-label-3\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-ach-be3c8bf",
      "source": "ACH",
      "target": "ACH 银行扣款",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div.table-body._4-68-1_M0sSm:nth-of-type(2) > div.table-row._4-68-1_LWT27 > div.table-cell.content-cell:nth-of-type(2) > div > span",
      "observedKind": "text-node",
      "observedStates": [
        "initial"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "div.table-body:nth-of-type(2) > div.table-row > div.table-cell.content-cell:nth-of-type(2) > div > span"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods",
      "helpTopicId": "finance-ach"
    },
    {
      "id": "finance-payment-methods-overview-5b7dda7",
      "source": "Overview",
      "target": "财务总览",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-reports-6c23e63",
      "source": "Reports",
      "target": "财务报告",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-make-deposit-f17d4f8",
      "source": "Make Deposit",
      "target": "充值",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-transfers-414625c",
      "source": "Transfers",
      "target": "伙伴资金转账",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods",
      "helpTopicId": "finance-pft"
    },
    {
      "id": "finance-payment-methods-documents-745d94b",
      "source": "Documents",
      "target": "账单文档",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-subscription-20e0944",
      "source": "Subscription",
      "target": "订阅与用量",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-settings-818b84f",
      "source": "Settings",
      "target": "财务设置",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-general-0af5eb9",
      "source": "General",
      "target": "常规设置",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(1) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(1) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-legal-entities-e28c701",
      "source": "Legal Entities",
      "target": "法律主体",
      "reason": "承接合同、账单及税务信息的法律主体，区别推广计划。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(2) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(2) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods",
      "helpTopicId": "finance-legal-entity"
    },
    {
      "id": "finance-payment-methods-billing-groups-2ba2c54",
      "source": "Billing Groups",
      "target": "账单分组",
      "reason": "按推广计划归集费用并开账单的分组，区别伙伴分组。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(3) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(3) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods",
      "helpTopicId": "finance-billing-group"
    },
    {
      "id": "finance-payment-methods-funding-accounts-96796ea",
      "source": "Funding Accounts",
      "target": "资金账户",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(4) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(4) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods",
      "helpTopicId": "finance-funding-account"
    },
    {
      "id": "finance-payment-methods-payment-methods-1ba2e80",
      "source": "Payment Methods",
      "target": "充值付款方式",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(5) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(5) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-automatic-payments-68b148a",
      "source": "Automatic Payments",
      "target": "自动充值",
      "reason": "向品牌资金账户自动充值，区别伙伴提现或改变佣金。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(6) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(6) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods",
      "helpTopicId": "finance-autofund"
    },
    {
      "id": "finance-payment-methods-settings-5b3e162",
      "source": "Settings",
      "target": "通知设置",
      "reason": "真实顶部通知面板的设置入口；用通知容器和精确页面作用域隔离，与财务设置菜单区分。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text._4-64-3_SuBBQ",
      "observedKind": "notification-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-methods/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-methods/ui.ihtml"
        ],
        "selector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact"
    },
    {
      "id": "finance-payment-methods-overview-17873de",
      "source": "Overview",
      "target": "财务总览",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-reports-54a337f",
      "source": "Reports",
      "target": "财务报告",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-make-deposit-6a421b6",
      "source": "Make Deposit",
      "target": "充值",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-transfers-3338ee4",
      "source": "Transfers",
      "target": "伙伴资金转账",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods",
      "helpTopicId": "finance-pft"
    },
    {
      "id": "finance-payment-methods-documents-158d273",
      "source": "Documents",
      "target": "账单文档",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-subscription-18cd53d",
      "source": "Subscription",
      "target": "订阅与用量",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-settings-698edff",
      "source": "Settings",
      "target": "财务设置",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-general-5287942",
      "source": "General",
      "target": "常规设置",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(1) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(1) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-legal-entities-57f3692",
      "source": "Legal Entities",
      "target": "法律主体",
      "reason": "承接合同、账单及税务信息的法律主体，区别推广计划。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(2) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(2) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods",
      "helpTopicId": "finance-legal-entity"
    },
    {
      "id": "finance-payment-methods-billing-groups-bd3f5ba",
      "source": "Billing Groups",
      "target": "账单分组",
      "reason": "按推广计划归集费用并开账单的分组，区别伙伴分组。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(3) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(3) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods",
      "helpTopicId": "finance-billing-group"
    },
    {
      "id": "finance-payment-methods-funding-accounts-7aa1f73",
      "source": "Funding Accounts",
      "target": "资金账户",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(4) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(4) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods",
      "helpTopicId": "finance-funding-account"
    },
    {
      "id": "finance-payment-methods-payment-methods-66b95b3",
      "source": "Payment Methods",
      "target": "充值付款方式",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(5) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(5) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-automatic-payments-0eccf21",
      "source": "Automatic Payments",
      "target": "自动充值",
      "reason": "向品牌资金账户自动充值，区别伙伴提现或改变佣金。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(6) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(6) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods",
      "helpTopicId": "finance-autofund"
    },
    {
      "id": "finance-payment-methods-settings-c92c1d0",
      "source": "Settings",
      "target": "通知设置",
      "reason": "真实顶部通知面板的设置入口；用通知容器和精确页面作用域隔离，与财务设置菜单区分。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text._4-64-3_SuBBQ",
      "observedKind": "notification-label",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact"
    },
    {
      "id": "finance-payment-methods-new-add-payment-method-observed",
      "source": "Add Payment Method",
      "target": "添加付款方式",
      "reason": "官方付款方式管理文档确认此页面用于添加品牌充值付款方式；只翻译新建页面固定标题。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "h1[data-testid=\"header-title\"]",
      "observedKind": "label-or-heading",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "topOnly": true,
        "lightDOMOnly": true,
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "h1[data-testid=\"header-title\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-new-name-observed",
      "source": "Name",
      "target": "名称",
      "reason": "官方付款方式管理文档将Name定义为用户为此付款方式指定的名称；此规则只翻译名称区标题，不读取或修改用户名称及输入值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "#name-section > div.header > h2.title",
      "observedKind": "label-or-heading",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "topOnly": true,
        "lightDOMOnly": true,
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "#name-section > div.header > h2.title"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-new-payment-type-observed",
      "source": "Payment Type",
      "target": "充值方式",
      "reason": "品牌通过信用卡或ACH向资金账户充值，复用现有充值页Payment Type术语；只翻译付款方式类型区标题。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "#payment-type-section > div.header > h2.title",
      "observedKind": "label-or-heading",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "topOnly": true,
        "lightDOMOnly": true,
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "#payment-type-section > div.header > h2.title"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-payment-methods-new-credit-card-observed",
      "source": "Credit Card",
      "target": "信用卡",
      "reason": "官方付款方式管理文档列出的品牌充值付款方式；只翻译实际类型组件固定标签，不修改卡资料。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "#selector-label",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "topOnly": true,
        "lightDOMOnly": true,
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "#selector-label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-new-ach-observed",
      "source": "ACH",
      "target": "ACH 银行扣款",
      "reason": "官方充值文档所述品牌银行电子扣款方式；复用现有ACH概念主题，只翻译实际类型组件固定枚举。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "#selector-label",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "topOnly": true,
        "lightDOMOnly": true,
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "#selector-label"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods",
      "helpTopicId": "finance-ach"
    },
    {
      "id": "finance-payment-methods-new-ach-description-observed",
      "source": "ACH draw from your bank account. No processing fees are applicable if this option is selected.",
      "target": "ACH 从您的银行账户扣款。选择此方式不收取处理手续费。",
      "reason": "官方充值文档说明ACH属于银行电子扣款方式且平台处理费用免费；整句精确匹配实际固定方式说明，不匹配银行资料或业务值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "#selector-description",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "topOnly": true,
        "lightDOMOnly": true,
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "#selector-description"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account"
    },
    {
      "id": "finance-payment-methods-new-credit-card-details-observed",
      "source": "Credit Card Details",
      "target": "信用卡信息",
      "reason": "官方付款方式管理文档将此区域说明为信用卡资料；只翻译实际固定区域标题，不额外翻译未采集字段，不改输入属性或值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "#details-section > div.header > h2.title",
      "observedKind": "label-or-heading",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "topOnly": true,
        "lightDOMOnly": true,
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "#details-section > div.header > h2.title"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-new-credit-card-fees-observed",
      "source": "Funds are available immediately, with fees of at least 3.5 units per 100 units processed.",
      "target": "资金即时可用，手续费至少为 3.5 货币单位（按每处理 100 货币单位计算）。",
      "reason": "官方充值文档说明信用卡充值资金即时入账，并按每100货币单位收取3.5货币单位的处理费，税费可能另计；此规则只整句精确匹配已观察的固定提示，原样保留3.5和100数字字节，不建立金融数值槽或推定实际扣款额。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "#details-section > div.header > h3.sub-title",
      "observedKind": "label-or-heading",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "topOnly": true,
        "lightDOMOnly": true,
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "#details-section > div.header > h3.sub-title"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account",
      "helpTopicId": "finance-deposit-fee"
    },
    {
      "id": "finance-payment-methods-new-save-observed",
      "source": "Save",
      "target": "保存",
      "reason": "官方付款方式管理文档的保存入口用于保存付款方式资料；只翻译实际保存按钮Text，不点击、不提交、不保存设置。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "button[data-testid=\"save-button\"]",
      "observedKind": "control-label",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "topOnly": true,
        "lightDOMOnly": true,
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "button[data-testid=\"save-button\"]"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-new-cardholder-name-observed",
      "source": "Cardholder Name",
      "target": "持卡人姓名",
      "reason": "实际原生信用卡表单的持卡人姓名标签，按官方付款方式管理文档的信用卡资料语境翻译；只处理固定label的Text，不读取或修改姓名字段。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div.braintree-card.braintree-form:nth-of-type(6) > div.braintree-sheet__content.braintree-sheet__content--form:nth-of-type(2) > div.braintree-form__field-group:nth-of-type(1) > label > div.braintree-form__label:nth-of-type(1)",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "topOnly": true,
        "lightDOMOnly": true,
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "div.braintree-card.braintree-form:nth-of-type(6) > div.braintree-sheet__content.braintree-sheet__content--form:nth-of-type(2) > div.braintree-form__field-group:nth-of-type(1) > label > div.braintree-form__label:nth-of-type(1)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-new-card-number-observed",
      "source": "Card Number",
      "target": "卡号",
      "reason": "官方付款方式管理文档将Card Number解释为信用卡号码；只翻译实际原生固定label，不读取或修改卡号、输入值及外域支付iframe。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div.braintree-card.braintree-form:nth-of-type(6) > div.braintree-sheet__content.braintree-sheet__content--form:nth-of-type(2) > div.braintree-form__field-group:nth-of-type(2) > label > div.braintree-form__label:nth-of-type(1)",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "topOnly": true,
        "lightDOMOnly": true,
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "div.braintree-card.braintree-form:nth-of-type(6) > div.braintree-sheet__content.braintree-sheet__content--form:nth-of-type(2) > div.braintree-form__field-group:nth-of-type(2) > label > div.braintree-form__label:nth-of-type(1)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-new-expiration-date-observed",
      "source": "Expiration Date",
      "target": "有效期",
      "reason": "官方付款方式管理文档所述信用卡有效期；只翻译实际原生固定label，保留用户日期输入值及相邻格式提示。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div.braintree-sheet__content.braintree-sheet__content--form:nth-of-type(2) > div.braintree-form__flexible-fields:nth-of-type(3) > div.braintree-form__field-group:nth-of-type(1) > label > div.braintree-form__label:nth-of-type(1)",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "topOnly": true,
        "lightDOMOnly": true,
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "div.braintree-sheet__content.braintree-sheet__content--form:nth-of-type(2) > div.braintree-form__flexible-fields:nth-of-type(3) > div.braintree-form__field-group:nth-of-type(1) > label > div.braintree-form__label:nth-of-type(1)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-new-expiration-format-observed",
      "source": "(MM/YY)",
      "target": "(MM/YY)",
      "reason": "实际原生信用卡有效期格式提示，保留完整MM/YY notation及括号原字节；不将此格式标记当作业务日期或改写输入格式。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div.braintree-form__flexible-fields:nth-of-type(3) > div.braintree-form__field-group:nth-of-type(1) > label > div.braintree-form__label:nth-of-type(1) > span.braintree-form__descriptor",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "topOnly": true,
        "lightDOMOnly": true,
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "div.braintree-form__flexible-fields:nth-of-type(3) > div.braintree-form__field-group:nth-of-type(1) > label > div.braintree-form__label:nth-of-type(1) > span.braintree-form__descriptor"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-new-cvv-observed",
      "source": "CVV",
      "target": "安全码（CVV）",
      "reason": "官方付款方式管理文档将CVV解释为信用卡安全码；保留CVV缩写，只翻译实际原生固定label，不读取或修改安全码字段。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div.braintree-sheet__content.braintree-sheet__content--form:nth-of-type(2) > div.braintree-form__flexible-fields:nth-of-type(3) > div.braintree-form__field-group:nth-of-type(2) > label > div.braintree-form__label:nth-of-type(1)",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "topOnly": true,
        "lightDOMOnly": true,
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "div.braintree-sheet__content.braintree-sheet__content--form:nth-of-type(2) > div.braintree-form__flexible-fields:nth-of-type(3) > div.braintree-form__field-group:nth-of-type(2) > label > div.braintree-form__label:nth-of-type(1)"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-new-cvv-format-observed",
      "source": "(3 digits)",
      "target": "(3 位数字)",
      "reason": "实际原生安全码固定格式提示，精确匹配完整Text并保留数字3原字节；不建立数值模板，不读取或修改安全码输入或外域支付iframe。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div.braintree-form__flexible-fields:nth-of-type(3) > div.braintree-form__field-group:nth-of-type(2) > label > div.braintree-form__label:nth-of-type(1) > span.braintree-form__descriptor",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "topOnly": true,
        "lightDOMOnly": true,
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "div.braintree-form__flexible-fields:nth-of-type(3) > div.braintree-form__field-group:nth-of-type(2) > label > div.braintree-form__label:nth-of-type(1) > span.braintree-form__descriptor"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods"
    },
    {
      "id": "finance-payment-methods-new-credit-card-description-observed",
      "source": "Draw from your credit card account. A handling charge will be charged per $100 (or part thereof) deposited.",
      "target": "从您的信用卡账户扣款。每充值 $100（或不足该金额的部分）均收取手续费。",
      "reason": "已实网确认此固定公开说明是顶层新建付款方式页面普通DOM中#selector-description的单一直接Text，整句原文唯一；官方充值文档说明信用卡按每100货币单位及不足部分计收处理费。只整句精确匹配，保留$100原字节，不建立金融数值模板，不匹配其它金额、账户资料或输入值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "#selector-description",
      "observedKind": "text-node",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "topOnly": true,
        "lightDOMOnly": true,
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "#selector-description"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account",
      "helpTopicId": "finance-deposit-fee"
    },
    {
      "id": "finance-payment-methods-new-engage-reports-navigation-observed",
      "source": "Reports",
      "target": "数据报表",
      "reason": "已实网确认新建付款方式页顶层导航Shadow中的Engage reports_menu固定DIV未被现有规则实际选择器覆盖；此入口查看推广数据报表，与Finance财务报告菜单区分。只在当前实际页面、宿主及data-testid组件精确匹配原Text，不扩大通用导航范围。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "payment-methods",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-reports_menu\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "opened:Add Payment Method"
      ],
      "scope": {
        "topOnly": true,
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/payment-method/new/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-reports_menu\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report"
    },
    {
      "id": "finance-automatic-payments-automatic-payments-7ffa71e",
      "source": "Automatic Payments",
      "target": "自动充值",
      "reason": "向品牌资金账户自动充值，区别伙伴提现或改变佣金。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "automatic-payments",
      "observedSelector": "section.automatic-payments-section > main.automatic-payment-top-content > div.automatic-payment-main-content > header.automatic-payment-header-container > h2.automatic-payment-header",
      "observedKind": "label-or-heading",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml"
        ],
        "selector": "section.automatic-payments-section > main.automatic-payment-top-content > div.automatic-payment-main-content > header.automatic-payment-header-container > h2.automatic-payment-header"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/set-up-automatic-payments-as-a-brand",
      "helpTopicId": "finance-autofund"
    },
    {
      "id": "finance-automatic-payments-you-have-a-pending-deposit-you-ll-be-able--79119dc",
      "source": "You have a pending deposit. You'll be able to set up automatic payments or edit your current settings once the deposit is processed.",
      "target": "您有一笔充值正在处理。处理完成后，即可设置自动充值或修改现有设置。",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "automatic-payments",
      "observedSelector": "section.automatic-payments-section > main.automatic-payment-top-content > div.automatic-payment-main-content > header.automatic-payment-header-container > p.automatic-payment-description",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml"
        ],
        "selector": "section.automatic-payments-section > main.automatic-payment-top-content > div.automatic-payment-main-content > header.automatic-payment-header-container > p.automatic-payment-description"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/set-up-automatic-payments-as-a-brand"
    },
    {
      "id": "finance-automatic-payments-to-learn-more-visit-our-help-doc-on-b124c33",
      "source": "To learn more, visit our help doc on",
      "target": "更多说明，请查看帮助文档：",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "automatic-payments",
      "observedSelector": "div.centered-wrapper:nth-of-type(2) > div.centered-card-layout > div.card > section.automatic-payments-section > footer.automatic-payment-footer-text",
      "observedKind": "text-node",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml"
        ],
        "selector": "div.centered-wrapper:nth-of-type(2) > div.centered-card-layout > div.card > section.automatic-payments-section > footer.automatic-payment-footer-text"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/set-up-automatic-payments-as-a-brand"
    },
    {
      "id": "finance-automatic-payments-automatic-payments-1ac71ee",
      "source": "Automatic Payments",
      "target": "自动充值",
      "reason": "向品牌资金账户自动充值，区别伙伴提现或改变佣金。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "automatic-payments",
      "observedSelector": "div.centered-card-layout > div.card > section.automatic-payments-section > footer.automatic-payment-footer-text > a.automatic-payment-footer-link",
      "observedKind": "control-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml"
        ],
        "selector": "div.centered-card-layout > div.card > section.automatic-payments-section > footer.automatic-payment-footer-text > a.automatic-payment-footer-link"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/set-up-automatic-payments-as-a-brand",
      "helpTopicId": "finance-autofund"
    },
    {
      "id": "finance-automatic-payments-overview-38434a6",
      "source": "Overview",
      "target": "财务总览",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "automatic-payments",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_overview\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/set-up-automatic-payments-as-a-brand"
    },
    {
      "id": "finance-automatic-payments-reports-d3671c8",
      "source": "Reports",
      "target": "财务报告",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "automatic-payments",
      "observedSelector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml"
        ],
        "selector": "#expanded-bar > div.navigation-subitems-container > div.subitem-container:nth-of-type(2) > div.subitem-label.cursor",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/set-up-automatic-payments-as-a-brand"
    },
    {
      "id": "finance-automatic-payments-make-deposit-df8098f",
      "source": "Make Deposit",
      "target": "充值",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "automatic-payments",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_make_deposit\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/set-up-automatic-payments-as-a-brand"
    },
    {
      "id": "finance-automatic-payments-transfers-1505838",
      "source": "Transfers",
      "target": "伙伴资金转账",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "automatic-payments",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_partner_funds_transfer\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/set-up-automatic-payments-as-a-brand",
      "helpTopicId": "finance-pft"
    },
    {
      "id": "finance-automatic-payments-documents-9d5ef28",
      "source": "Documents",
      "target": "账单文档",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "automatic-payments",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_documents\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/set-up-automatic-payments-as-a-brand"
    },
    {
      "id": "finance-automatic-payments-subscription-2232093",
      "source": "Subscription",
      "target": "订阅与用量",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "automatic-payments",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-adv_finance_subscription\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/set-up-automatic-payments-as-a-brand"
    },
    {
      "id": "finance-automatic-payments-settings-1d87913",
      "source": "Settings",
      "target": "财务设置",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "automatic-payments",
      "observedSelector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml"
        ],
        "selector": "div[data-testid=\"sidenav-expanded-submenu-finance_settings\"]",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/set-up-automatic-payments-as-a-brand"
    },
    {
      "id": "finance-automatic-payments-general-7df2e8b",
      "source": "General",
      "target": "常规设置",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "automatic-payments",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(1) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(1) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/set-up-automatic-payments-as-a-brand"
    },
    {
      "id": "finance-automatic-payments-legal-entities-df54f3f",
      "source": "Legal Entities",
      "target": "法律主体",
      "reason": "承接合同、账单及税务信息的法律主体，区别推广计划。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "automatic-payments",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(2) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(2) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/set-up-automatic-payments-as-a-brand",
      "helpTopicId": "finance-legal-entity"
    },
    {
      "id": "finance-automatic-payments-billing-groups-7db1193",
      "source": "Billing Groups",
      "target": "账单分组",
      "reason": "按推广计划归集费用并开账单的分组，区别伙伴分组。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "automatic-payments",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(3) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(3) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/set-up-automatic-payments-as-a-brand",
      "helpTopicId": "finance-billing-group"
    },
    {
      "id": "finance-automatic-payments-funding-accounts-9c151f3",
      "source": "Funding Accounts",
      "target": "资金账户",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "automatic-payments",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(4) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(4) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/set-up-automatic-payments-as-a-brand",
      "helpTopicId": "finance-funding-account"
    },
    {
      "id": "finance-automatic-payments-payment-methods-348d17b",
      "source": "Payment Methods",
      "target": "充值付款方式",
      "reason": "真实财务页面固定界面文本，按品牌资金与联盟营销语境翻译；保留原生节点、数值、链接及表单值。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "automatic-payments",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(5) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(5) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/set-up-automatic-payments-as-a-brand"
    },
    {
      "id": "finance-automatic-payments-automatic-payments-ea16787",
      "source": "Automatic Payments",
      "target": "自动充值",
      "reason": "向品牌资金账户自动充值，区别伙伴提现或改变佣金。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "automatic-payments",
      "observedSelector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(6) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
      "observedKind": "finance-navigation-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml"
        ],
        "selector": "div.subitem-children-container:nth-of-type(2) > div.subitem-child:nth-of-type(6) > div.child-label.cursor > div.child-menu-content:nth-of-type(1) > a",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/set-up-automatic-payments-as-a-brand",
      "helpTopicId": "finance-autofund"
    },
    {
      "id": "finance-automatic-payments-settings-145ac2b",
      "source": "Settings",
      "target": "通知设置",
      "reason": "真实顶部通知面板的设置入口；用通知容器和精确页面作用域隔离，与财务设置菜单区分。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "automatic-payments",
      "observedSelector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text._4-64-3_SuBBQ",
      "observedKind": "notification-label",
      "observedStates": [
        "initial",
        "extra-baseline"
      ],
      "scope": {
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "pathExact": "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/automatic-payments/ui.ihtml"
        ],
        "selector": "div.leftSlideMenuSection > div.leftSlideContent:nth-of-type(2) > div.notification_heading:nth-of-type(1) > a.iui-component.iui-link > link-text",
        "shadowHost": "#adv-navigation > impact-style-isolator"
      },
      "match": "exact"
    },
    {
      "id": "finance-billing-groups-actions-edit-observed",
      "source": "Edit",
      "target": "编辑",
      "reason": "官方品牌财务管理文档中的账单分组编辑入口；只翻译已观察原生 Actions 弹层第一选项的固定 Text。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "billing-groups",
      "observedSelector": "body > div.iui-dropdown.in-btn-menu.row-action-dropdown > div > div > ul.iui-list[role=\"listbox\"] > li:nth-of-type(1)[role=\"option\"] > div > span > regular-text > span",
      "observedKind": "text-node",
      "observedStates": [
        "deep-existing-entity-actions-menu"
      ],
      "scope": {
        "lightDOMOnly": true,
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/billing-groups-view.ihtml",
        "pathExact": "/secure/finance/app/billing-groups-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/billing-groups.ihtml"
        ],
        "topQuery": {
          "u": "/secure/finance/app/billing-groups-view.ihtml"
        },
        "selector": "body > div.iui-dropdown.in-btn-menu.row-action-dropdown > div > div > ul.iui-list[role=\"listbox\"] > li:nth-of-type(1)[role=\"option\"] > div > span > regular-text > span"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-manage-billing-groups-and-funding-accounts-as-a-brand"
    },
    {
      "id": "finance-billing-groups-actions-partner-fees-document-settings-observed",
      "source": "Partner Fees Document Settings",
      "target": "伙伴费用文档设置",
      "reason": "官方文档指账单分组的伙伴付款发票及月度对账单文档设置；只翻译已观察原生 Actions 弹层第二选项的固定 Text。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "billing-groups",
      "observedSelector": "body > div.iui-dropdown.in-btn-menu.row-action-dropdown > div > div > ul.iui-list[role=\"listbox\"] > li:nth-of-type(2)[role=\"option\"] > div > span > regular-text > span",
      "observedKind": "text-node",
      "observedStates": [
        "deep-existing-entity-actions-menu"
      ],
      "scope": {
        "lightDOMOnly": true,
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/billing-groups-view.ihtml",
        "pathExact": "/secure/finance/app/billing-groups-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/billing-groups.ihtml"
        ],
        "topQuery": {
          "u": "/secure/finance/app/billing-groups-view.ihtml"
        },
        "selector": "body > div.iui-dropdown.in-btn-menu.row-action-dropdown > div > div > ul.iui-list[role=\"listbox\"] > li:nth-of-type(2)[role=\"option\"] > div > span > regular-text > span"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-partner-fees-document-settings"
    },
    {
      "id": "finance-billing-groups-actions-impact-com-fees-document-settings-observed",
      "source": "impact.com Fees Document Settings",
      "target": "impact.com费用文档设置",
      "reason": "官方文档指指定账单分组的 impact.com 平台费用发票文档设置；只翻译已观察原生 Actions 弹层第三选项的固定 Text。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "billing-groups",
      "observedSelector": "body > div.iui-dropdown.in-btn-menu.row-action-dropdown > div > div > ul.iui-list[role=\"listbox\"] > li:nth-of-type(3)[role=\"option\"] > div > span > regular-text > span",
      "observedKind": "text-node",
      "observedStates": [
        "deep-existing-entity-actions-menu"
      ],
      "scope": {
        "lightDOMOnly": true,
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/billing-groups-view.ihtml",
        "pathExact": "/secure/finance/app/billing-groups-view.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/billing-groups.ihtml"
        ],
        "topQuery": {
          "u": "/secure/finance/app/billing-groups-view.ihtml"
        },
        "selector": "body > div.iui-dropdown.in-btn-menu.row-action-dropdown > div > div > ul.iui-list[role=\"listbox\"] > li:nth-of-type(3)[role=\"option\"] > div > span > regular-text > span"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-impactcom-fees-document-settings"
    },
    {
      "id": "finance-funding-accounts-actions-edit-observed",
      "source": "Edit",
      "target": "编辑",
      "reason": "官方品牌财务管理文档中的资金账户编辑入口；只翻译已观察原生 Actions 弹层第一选项的固定 Text。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "funding-accounts",
      "observedSelector": "body > div.iui-dropdown.in-btn-menu.row-action-dropdown > div > div > ul.iui-list[role=\"listbox\"] > li:nth-of-type(1)[role=\"option\"] > div > span > span",
      "observedKind": "text-node",
      "observedStates": [
        "deep-existing-entity-actions-menu"
      ],
      "scope": {
        "lightDOMOnly": true,
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-digital-wallets-flow.ihtml",
        "pathExact": "/secure/finance/app/list-digital-wallets-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/funding-accounts.ihtml"
        ],
        "topQuery": {
          "u": "/secure/finance/app/list-digital-wallets-flow.ihtml"
        },
        "selector": "body > div.iui-dropdown.in-btn-menu.row-action-dropdown > div > div > ul.iui-list[role=\"listbox\"] > li:nth-of-type(1)[role=\"option\"] > div > span > span"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-manage-billing-groups-and-funding-accounts-as-a-brand"
    },
    {
      "id": "finance-funding-accounts-actions-funding-account-document-settings-observed",
      "source": "Funding Account Document Settings",
      "target": "资金账户文档设置",
      "reason": "官方文档指资金账户的付款申请表文档设置；只翻译已观察原生 Actions 弹层第二选项的固定 Text。",
      "reviewStatus": "reviewed",
      "stage": "native-finance",
      "verification": "observed-dom",
      "observedSource": "docs/finance-dom-scan.json",
      "financePageId": "funding-accounts",
      "observedSelector": "body > div.iui-dropdown.in-btn-menu.row-action-dropdown > div > div > ul.iui-list[role=\"listbox\"] > li:nth-of-type(2)[role=\"option\"] > div > span > span",
      "observedKind": "text-node",
      "observedStates": [
        "deep-existing-entity-actions-menu"
      ],
      "scope": {
        "lightDOMOnly": true,
        "hosts": [
          "demo.impact.com",
          "app.impact.com"
        ],
        "path": "/secure/finance/app/list-digital-wallets-flow.ihtml",
        "pathExact": "/secure/finance/app/list-digital-wallets-flow.ihtml",
        "topPaths": [
          "/secure/advertiser/finance/fr/funding-accounts.ihtml"
        ],
        "topQuery": {
          "u": "/secure/finance/app/list-digital-wallets-flow.ihtml"
        },
        "selector": "body > div.iui-dropdown.in-btn-menu.row-action-dropdown > div > div > ul.iui-list[role=\"listbox\"] > li:nth-of-type(2)[role=\"option\"] > div > span > span"
      },
      "match": "exact",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-funding-account-document-settings-as-a-brand"
    }
  ],
  "helpTopics": [
    {
      "id": "program-health",
      "label": "Program Health：推广效果概览",
      "source": "Program Health",
      "entryIds": [
        "program-health"
      ],
      "question": "请解释当前Dashboard的 Program Health（推广效果概览）这个趋势模块用于什么，以及如何用日期范围和 Show Compare 查看推广表现变化。围绕这个模块说明，不逐个讲解全部指标，也不要推测当前账号收益。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets",
      "explanation": "按所选日期查看推广趋势，并可比较时段或配置图表；它不是固定健康评分。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "actions",
      "label": "Actions：转化量",
      "source": "Actions",
      "entryIds": [
        "actions"
      ],
      "question": "请解释当前指标卡 Actions（转化量）在联盟营销中的含义：什么算一次获归因转化，官方报表如何处理已撤销转化，以及它与具体转化明细或操作按钮的区别。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report",
      "explanation": "表示被追踪并归因的转化数量，官方伙伴报表排除已撤销转化；购买、线索等具体事件以项目设置为准。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report",
      "additionalHelpUrls": [
        "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance"
      ],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "action-cost",
      "label": "Action Cost：转化佣金",
      "source": "Action Cost",
      "entryIds": [
        "action-cost"
      ],
      "question": "请解释 Action Cost（转化佣金）在联盟营销报表中计量什么金额，以及为何它不是佣金比例或每次转化成本CPA，也不能直接证明已付款到账。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report",
      "explanation": "表示带来转化的伙伴报酬金额，与佣金比例、平均CPA以及资金到账状态分别核对。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report",
      "additionalHelpUrls": [
        "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance"
      ],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "revenue",
      "label": "Revenue：成交金额",
      "source": "Revenue",
      "entryIds": [
        "revenue"
      ],
      "question": "请解释 Revenue（成交金额）在当前联盟营销销售转化报表中的含义，以及它与合作伙伴佣金、品牌利润的区别；其它事件类型应如何核对金额口径？ 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report",
      "explanation": "官方销售转化报表中是伙伴带来的销售金额；佣金是推广报酬，利润还涉及其它成本。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "total-cost",
      "label": "Total Cost：推广总成本",
      "source": "Total Cost",
      "entryIds": [
        "total-cost"
      ],
      "question": "请解释 Total Cost（推广总成本）的官方组成，说明 Action Cost、Click Cost 和 Other Cost 的关系，以及为什么它不等于品牌全部经营成本或平台全部账单，也不能据此判断付款是否到账。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report",
      "explanation": "官方伙伴报表以转化报酬、点击报酬及其它推广成本汇总；付款进度还需看转化锁定与计划结算。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report",
      "additionalHelpUrls": [
        "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance"
      ],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "conversion-rate",
      "label": "Conversion Rate：转化率",
      "source": "Conversion Rate",
      "entryIds": [
        "conversion-rate"
      ],
      "question": "请解释 Conversion Rate（转化率）的官方公式、分子分母和日期/事件类型口径，以及点击次数为0时为什么不能据该比率臆测推广表现。不要编造原站对零分母的处理方式。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report",
      "explanation": "官方品牌报表口径为转化量除以点击次数；需在相同筛选口径下解读，零分母显示由原站处理。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "partner-size",
      "label": "Extra Large：伙伴规模等级",
      "source": "Extra Large",
      "entryIds": [
        "extra-large"
      ],
      "question": "请解释推荐伙伴卡片上的 Extra Large（超大型）规模等级如何参考impact.com活动及外部数据，为什么它不是服装尺码，也不代表合作效果或佣金收益保证。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/reach-out-to-partners/partner-management/partner-size-rating-criteria",
      "explanation": "是伙伴规模分级，参考站内活动与外部业务、流量、受众等数据，不能代替匹配度判断。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/reach-out-to-partners/partner-management/partner-size-rating-criteria",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "recommended-partners",
      "label": "Partners you'll love：推荐合作伙伴",
      "source": "Partners you'll love",
      "entryIds": [
        "recommended-partners"
      ],
      "question": "请解释 Partners you'll love（推荐合作伙伴）组件推荐的是哪类伙伴，以及品牌在决定是否招募前应如何核对匹配度；推荐是否代表已经合作或保证转化收益？ 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets",
      "explanation": "是可招募潜在伙伴的推荐列表；还需查看资料、匹配度及合作条件。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets",
      "additionalHelpUrls": [
        "https://help.impact.com/brand/what-would-you-like-to-learn-about/performance-program/recruiting-partners/discover/discover-overview"
      ],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "engage",
      "label": "Engage：合作管理",
      "source": "Engage",
      "entryIds": [
        "engage"
      ],
      "question": "请解释 Engage（合作管理）作为impact.com产品入口的用途，以及它在联盟营销的伙伴管理与日常合作流程中怎么使用。只依据当前可见菜单说明，不假设账户拥有未启用功能。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/reach-out-to-partners/partner-management/manage-my-partners",
      "explanation": "是日常合作管理入口；具体菜单与可用功能取决于账户和项目。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/reach-out-to-partners/partner-management/manage-my-partners",
      "additionalHelpUrls": [
        "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands"
      ],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "discover",
      "label": "Discover：招募伙伴",
      "source": "Discover",
      "entryIds": [
        "discover"
      ],
      "question": "请解释 Discover（招募伙伴）这个产品入口如何帮助品牌寻找并查看潜在联盟伙伴，以及它与已经签约的伙伴管理有什么区别。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/performance-program/recruiting-partners/discover/discover-overview",
      "explanation": "用于寻找与查看潜在伙伴，招募成功后的合作管理另在对应入口进行。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/performance-program/recruiting-partners/discover/discover-overview",
      "additionalHelpUrls": [
        "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands"
      ],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "optimize",
      "label": "Optimize：多维分析",
      "source": "Optimize",
      "entryIds": [
        "optimize"
      ],
      "question": "请解释 Optimize（多维分析）这个产品入口的跨渠道分析用途，尤其如何理解客户旅程中的伙伴贡献；不要把它描述为自动优化开关，也不要假设我的订阅状态。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-startup-guide",
      "explanation": "提供跨渠道客户旅程及伙伴价值分析报告；功能访问取决于套餐或附加服务。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-startup-guide",
      "additionalHelpUrls": [
        "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands"
      ],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "protect",
      "label": "Protect：风险防护",
      "source": "Protect",
      "entryIds": [
        "protect"
      ],
      "question": "请解释 Protect（风险防护）这个产品入口在联盟营销中的违规监测与转化风险防护用途，以及品牌应如何理解其中的风险信号。不要保证自动阻止所有欺诈，也不要假设所有模块已启用。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program",
      "explanation": "用于推广合规监测与风险防护；监测发现还需结合规则核查，功能依套餐而定。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program",
      "additionalHelpUrls": [
        "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands"
      ],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "campaign-manager",
      "label": "Campaign Manager：营销活动管理",
      "source": "Campaign Manager",
      "entryIds": [
        "campaign-manager"
      ],
      "question": "请解释 Campaign Manager（营销活动管理）这个入口的用途，以及它与管理单个合作伙伴的区别。请依据官方创作者活动管理文档举例，并指出实际可用流程取决于项目类型。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/creator-program/recruit-creators/manage-creator-campaign-applicants",
      "explanation": "集中管理营销活动；官方创作者活动流程包括查看活动及处理申请，实际流程依项目类型。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/creator-program/recruit-creators/manage-creator-campaign-applicants",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "amplification",
      "label": "Amplification：付费推广",
      "source": "Amplification",
      "entryIds": [
        "amplification"
      ],
      "question": "请解释 Amplification（付费推广）在创作者合作中的含义，以及为什么将创作者内容用于付费推广时需要核对授权范围和期限；不要推测当前账户可用投放平台。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/creator-program/creator-campaigns-for-brands/content-rights-for-creator-campaigns-explained",
      "explanation": "将合作内容用于付费推广，需要先核对内容使用授权与实际平台支持。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/creator-program/creator-campaigns-for-brands/content-rights-for-creator-campaigns-explained",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "contracts",
      "label": "Contracts：合作合同",
      "source": "Contracts",
      "entryIds": [
        "contracts"
      ],
      "question": "请解释 Contracts（合作合同）在联盟营销合作中的作用，以及它与尚未被双方接受的Template Terms模板条款的区别；不要替我接受或修改任何条款。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/learn-about-template-terms-and-contracts",
      "explanation": "伙伴接受模板条款后形成双方合作合同，实际佣金和合作条件以合同为准。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/learn-about-template-terms-and-contracts",
      "additionalHelpUrls": [
        "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/contracts/view-partner-contract-history"
      ],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "template-terms",
      "label": "Template Terms：合作条款模板",
      "source": "Template Terms",
      "entryIds": [
        "nav-template-terms"
      ],
      "question": "请解释 Template Terms（合作条款模板）这个概念：模板定义哪些合作事件、佣金与锁定规则，什么时候形成单个伙伴合同；不要创建、接受或修改条款。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/learn-about-template-terms-and-contracts",
      "explanation": "模板预设合作条件，与伙伴接受后的具体合同区分。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/learn-about-template-terms-and-contracts",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "custom-terms",
      "label": "Custom Terms：自定义条款",
      "source": "Custom Terms",
      "entryIds": [
        "nav-custom-terms"
      ],
      "question": "请解释 Custom Terms（自定义条款）这个概念：附加条款的用途，与模板内佣金设置及模板类型的区别；如何核对在用条款修改的影响，不要编辑或签署条款。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/contracts/add-custom-terms-to-your-contracts",
      "explanation": "品牌补充条款附加到合作模板，修改在用条款可能影响关联伙伴。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/contracts/add-custom-terms-to-your-contracts",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "contract-changes",
      "label": "Changes：合同变更",
      "source": "Changes",
      "entryIds": [
        "nav-changes"
      ],
      "question": "请解释 Changes（合同变更）这个概念：合同条款修改、生效日期与通知期的关系，如何核对受影响伙伴；不要推测变更已经生效或提交变更。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/template-terms/modify-template-terms",
      "explanation": "合同变更需核对受影响伙伴、通知期与生效日期。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/template-terms/modify-template-terms",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "workflows",
      "label": "Workflows：自动化工作流",
      "source": "Workflows",
      "entryIds": [
        "nav-workflows"
      ],
      "question": "请解释 Workflows（自动化工作流）这个概念：条件、顺序与启用状态如何影响伙伴申请处理，邮件与申请工作流有什么区别；不要启用或运行流程。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/review-partner-applications/automate-partner-application-processing/create-workflows-to-automatically-process-partner-applications",
      "explanation": "依据条件处理申请或沟通的自动流程。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/review-partner-applications/automate-partner-application-processing/create-workflows-to-automatically-process-partner-applications",
      "additionalHelpUrls": [
        "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/reach-out-to-partners/email-workflows/create-and-manage-email-workflows"
      ],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "segments",
      "label": "Segments：动态伙伴细分",
      "source": "Segments",
      "entryIds": [
        "nav-segments"
      ],
      "question": "请解释 Segments（动态伙伴细分）这个概念：动态名单与手工伙伴分组的区别，为什么名单本身不执行沟通或审核；不要创建名单。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/reach-out-to-partners/segments/create-a-partner-segment",
      "explanation": "动态条件名单本身不发信或批准申请。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/reach-out-to-partners/segments/create-a-partner-segment",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "applications",
      "label": "Applications：合作申请",
      "source": "Applications",
      "entryIds": [
        "nav-applications"
      ],
      "question": "请解释 Applications（合作申请）这个概念：加入申请、既有伙伴新条款提案与反提案的区别；如何查看条款与审批结果，不要接受或拒绝申请。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/review-partner-applications/review-partner-and-creator-applications",
      "explanation": "加入申请与合同反提案需核查条件。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/review-partner-applications/review-partner-and-creator-applications",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "proposals-sent",
      "label": "Proposals Sent：已发合同提案",
      "source": "Proposals Sent",
      "entryIds": [
        "nav-proposals-sent"
      ],
      "question": "请解释 Proposals Sent（已发合同提案）这个概念：已发条款提案与已生效合同的区别，以及等待回应和撤回的含义；不要发送或撤回提案。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/contracts/review-contract-proposals-youve-sent",
      "explanation": "已发合同提案不等于已生效合同。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/contracts/review-contract-proposals-youve-sent",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "data-lab",
      "label": "Data Lab：自定义报表",
      "source": "Data Lab",
      "entryIds": [
        "nav-data-lab"
      ],
      "question": "请解释 Data Lab（自定义报表）这个概念：维度、指标与可视化怎样组成报表，为什么它不能凭空产生业务数据；不要创建或发送报表。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/data-lab-custom-reports/data-lab-introduction",
      "explanation": "组合维度、指标与图表的自定义报告工具。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/data-lab-custom-reports/data-lab-introduction",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "action-records",
      "label": "Actions：转化记录",
      "source": "Actions",
      "entryIds": [
        "nav-actions"
      ],
      "question": "请解释 Actions（转化记录）这个概念：Transactions中一条转化记录的含义，如何理解核查、锁定、撤销与计划佣金结算；不要修改、批准或撤销转化。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance",
      "explanation": "Transactions中的逐笔转化，与Dashboard转化量汇总区分。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "pending-payouts",
      "label": "Pending Payouts：待核佣金",
      "source": "Pending Payouts",
      "entryIds": [
        "pending-payouts"
      ],
      "question": "请解释 Pending Payouts（待核佣金）这个概念：为什么要在锁定前核查转化与佣金，与已锁定或已付款有什么区别；不要审核或付款。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/payouts/filter-and-download-pending-payouts-list",
      "explanation": "锁定前核查转化及佣金的列表，不是到账确认。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/payouts/filter-and-download-pending-payouts-list",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "action-inquiries",
      "label": "Inquiries：转化补单申请",
      "source": "Inquiries",
      "entryIds": [
        "nav-inquiries"
      ],
      "question": "请解释 Inquiries（转化补单申请）这个概念：伙伴补单核查中的订单证据、接受后新增转化与锁定付款的关系；不要接受、拒绝或新建转化。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/action-inquiries/action-inquiries-explained",
      "explanation": "未正确跟踪订单的核查申请，接受后可能生成转化。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/action-inquiries/action-inquiries-explained",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "outside-terms",
      "label": "Outside Terms：超出条款转化",
      "source": "Outside Terms",
      "entryIds": [
        "outside-of-terms"
      ],
      "question": "请解释 Outside Terms（超出条款转化）这个概念：超出合同条件的转化为什么会自动撤销，人工核查与批准覆盖意味着什么；不要代为批准或改佣金。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/actions/review-actions-that-are-outside-of-terms",
      "explanation": "超出条款的转化自动撤销，人工批准可覆盖，需先核实。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/actions/review-actions-that-are-outside-of-terms",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "data-posts",
      "label": "Data Posts：数据提交转化",
      "source": "Data Posts",
      "entryIds": [
        "nav-data-posts"
      ],
      "question": "请解释 Data Posts（数据提交转化）这个概念：伙伴提交线索等数据、服务端核验与记转化的关系，和普通网页发帖有什么区别；不要配置接口。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/event-types/data-post-conversions-explained",
      "explanation": "服务端提交有价值数据，品牌验证后记录转化。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/event-types/data-post-conversions-explained",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "product-promotions",
      "label": "Product Promotions：商品优惠信息",
      "source": "Product Promotions",
      "entryIds": [
        "nav-product-promotions"
      ],
      "question": "请解释 Product Promotions（商品优惠信息）这个概念：商品特惠信息怎样关联商品目录及伙伴feed，与提高合同佣金有什么区别；不要上传文件或更改优惠。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/product-promotions/upload-product-promotion-files",
      "explanation": "向伙伴商品feed、API与市场分享商品特惠。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/product-promotions/upload-product-promotion-files",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "extended-search",
      "label": "Extended Search：全网拓展搜索",
      "source": "Extended Search",
      "entryIds": [
        "nav-extended-search"
      ],
      "question": "请解释 Extended Search（全网拓展搜索）这个概念：平台内外自动关键词搜索的用途，以及搜索任务、结果和潜在伙伴的关系；不要创建搜索或邀请伙伴。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/performance-program/recruiting-partners/extended-search/extended-search-overview",
      "explanation": "关键词持续寻找平台内外的潜在伙伴。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/performance-program/recruiting-partners/extended-search/extended-search-overview",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "social-listening",
      "label": "Social Listening：社交内容监听",
      "source": "Social Listening",
      "entryIds": [
        "nav-social-listening"
      ],
      "question": "请解释 Social Listening（社交内容监听）这个概念：关键词、话题标签和提及怎样帮助发现创作者与内容，与录音监听有什么区别；不要创建任务。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/find-partners-and-creators/social-listening/create-a-social-listener",
      "explanation": "跟踪关键词、话题和提及以发现社交内容与创作者。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/find-partners-and-creators/social-listening/create-a-social-listener",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "contribution",
      "label": "Contribution：伙伴贡献分析",
      "source": "Contribution",
      "entryIds": [
        "nav-contribution"
      ],
      "question": "请解释 Contribution（伙伴贡献分析）这个概念：引入者、影响者、促成成交者和独立触点的作用，与最终获归因佣金有什么区别；不要调整归因。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/contribution-report",
      "explanation": "区分引入、影响、促成与独立触点的伙伴贡献。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/contribution-report",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "leapfrogging",
      "label": "Leapfrogging：归因抢占",
      "source": "Leapfrogging",
      "entryIds": [
        "nav-leapfrogging"
      ],
      "question": "请解释 Leapfrogging（归因抢占）这个概念：最后点击下后出现伙伴如何取得归因，怎样理解赢得/失去转化及时间窗；不要仅凭报表认定作弊或调整佣金。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/leapfrogging-reports/leapfrogging-summary-report",
      "explanation": "最后点击伙伴可能越过前序贡献伙伴抢得归因，需结合路径核查。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/leapfrogging-reports/leapfrogging-summary-report",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "crediting-concerns",
      "label": "Crediting Concerns：归因合理性",
      "source": "Crediting Concerns",
      "entryIds": [
        "nav-crediting-concerns"
      ],
      "question": "请解释 Crediting Concerns（归因合理性）这个概念：怎样比较伙伴A/B的参与及获归因，为什么这不是正式申诉或已确认归因错误；不要改归因或佣金。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/crediting-concerns-report",
      "explanation": "比较同一路径参与与归因分配，核查报酬合理性。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/crediting-concerns-report",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "customer-value",
      "label": "Customer Value：客户价值",
      "source": "Customer Value",
      "entryIds": [
        "nav-customer-value"
      ],
      "question": "请解释 Customer Value（客户价值）这个概念：新客获得期与后续评估期怎样用于观察购买和复购价值，与单笔成交金额有什么区别；不要推测当前客户价值。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/new-customer-value-report",
      "explanation": "按新客群评估后续购买、复购及价值。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/new-customer-value-report",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "behavior",
      "label": "Behavior：转化行为",
      "source": "Behavior",
      "entryIds": [
        "nav-behavior"
      ],
      "question": "请解释 Behavior（转化行为）这个概念：客户转化速度及不同触点表现怎样用于分析行为，与伙伴操作日志有什么区别；不要推测当前报表表现。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/behavior-report",
      "explanation": "按触点维度分析客户转化行为。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/behavior-report",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "top-paths",
      "label": "Top Paths：常见转化路径",
      "source": "Top Paths",
      "entryIds": [
        "nav-top-paths"
      ],
      "question": "请解释 Top Paths（常见转化路径）这个概念：为什么这是常见路径而不是最优路线，怎样结合贡献报表和路径范围限制来解读。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/top-paths-explained",
      "explanation": "常见触点顺序用于调查趋势，不保证最优。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/top-paths-explained",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "events-funnel",
      "label": "Events Funnel：事件转化漏斗",
      "source": "Events Funnel",
      "entryIds": [
        "nav-events-funnel"
      ],
      "question": "请解释 Events Funnel（事件转化漏斗）这个概念：逐步完成与流失怎样形成事件漏斗，为什么步骤转化率不能混用Dashboard总转化率。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/events-funnel-report",
      "explanation": "按伙伴查看多步骤事件完成与流失。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/events-funnel-report",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "event-risk",
      "label": "Event Risk：事件风险",
      "source": "Event Risk",
      "entryIds": [
        "nav-event-risk"
      ],
      "question": "请解释 Event Risk（事件风险）这个概念：非人类点击和转化怎样影响绩效及预算，风险信号与已确认作弊有什么区别；不要处置伙伴或改设置。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/event-risk/event-risk-explained",
      "explanation": "评估点击和转化中的非人类可疑活动。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/event-risk/event-risk-explained",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "at-risk",
      "label": "At Risk：风险转化待核",
      "source": "At Risk",
      "entryIds": [
        "nav-at-risk"
      ],
      "question": "请解释 At Risk（风险转化待核）这个概念：为什么需要核对真实订单等证据，风险标记、自动拒绝和可支付状态是什么关系；不要批准、拒绝或认定伙伴作弊。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/event-risk/review-at-risk-actions",
      "explanation": "风险转化需结合真实订单核验，必要时明确批准。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/event-risk/review-at-risk-actions",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "scoring-filtering",
      "label": "Scoring & Filtering Settings：风险评分与过滤设置",
      "source": "Scoring & Filtering Settings",
      "entryIds": [
        "nav-scoring-filtering-settings"
      ],
      "question": "请解释 Scoring & Filtering Settings（风险评分与过滤设置）这个概念：事件评分、非人类点击过滤与严格度的关系，改设置前应核对什么；不要修改设置。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/event-risk/filter-high-risk-traffic",
      "explanation": "评分与点击过滤严格度按实际规则核对。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/event-risk/filter-high-risk-traffic",
      "additionalHelpUrls": [
        "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/event-risk/event-risk-explained"
      ],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "conversion-spoofing",
      "label": "Conversion Spoofing Rules：伪造转化校验规则",
      "source": "Conversion Spoofing Rules",
      "entryIds": [
        "nav-conversion-spoofing-rules"
      ],
      "question": "请解释 Conversion Spoofing Rules（伪造转化校验规则）这个概念：订单ID和转化页URL校验怎样识别伪造信号，不匹配记录为何还需核查；不要修改规则或自动审核。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/event-risk/view-validation-patterns-for-conversion-events",
      "explanation": "订单ID与转化页URL模式校验用于发现伪造信号。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/event-risk/view-validation-patterns-for-conversion-events",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept"
    },
    {
      "id": "finance-pft",
      "label": "Partner Funds Transfer：伙伴资金转账",
      "source": "Partner Funds Transfer",
      "entryIds": [
        "finance-overview-transfers-b3cc48a",
        "finance-make-deposit-transfers-9cda8d1",
        "finance-make-deposit-transfers-414625c",
        "finance-transfers-transfers-51dc5f8",
        "finance-transfers-transfers-49e11f1",
        "finance-transfers-create-transfer-06b5b5a",
        "finance-transfers-create-transfer-9f43877",
        "finance-subscription-transfers-d0e68c4",
        "finance-monthly-close-transfers-769df91",
        "finance-upcoming-partner-payments-transfers-b0f01ce",
        "finance-cash-flow-history-transfers-6484f6d",
        "finance-partner-payments-invoices-transfers-0633775",
        "finance-impact-com-invoices-transfers-6374db7",
        "finance-general-transfers-9e674a6",
        "finance-legal-entities-transfers-0cf2da8",
        "finance-billing-groups-transfers-c759b7c",
        "finance-funding-accounts-transfers-f91d2f9",
        "finance-payment-methods-transfers-414625c",
        "finance-payment-methods-transfers-3338ee4",
        "finance-automatic-payments-transfers-1505838"
      ],
      "question": "请解释 Partner Funds Transfer（伙伴资金转账，PFT）这个概念：与合同约定的转化佣金有什么区别，奖金等转账的处理月份和结算月份为何可能不同；只说明，不创建或提交转账。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner",
      "explanation": "合同佣金条款之外的伙伴付款。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept",
      "stage": "native-finance"
    },
    {
      "id": "finance-prf",
      "label": "Payment Request Form：预计充值需求单（PRF）",
      "source": "Payment Request Form",
      "entryIds": [
        "finance-overview-payment-request-form-fa4d87a"
      ],
      "question": "请解释 Payment Request Form（预计充值需求单，PRF）这个概念：为什么它是预充值请求而不是已确定账单，应如何与之后锁定费用核对；只说明，不下载、提交或充值。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/understand-the-soi-and-prf-documents",
      "explanation": "预充值预测文档，与已确定账单区分。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/understand-the-soi-and-prf-documents",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept",
      "stage": "native-finance"
    },
    {
      "id": "finance-funding-account",
      "label": "Funding Account：资金账户",
      "source": "Funding Account",
      "entryIds": [
        "finance-overview-funding-account-57e1771",
        "finance-upcoming-partner-payments-funding-account-3bdd045",
        "finance-cash-flow-history-funding-account-69d5086",
        "finance-general-funding-accounts-8cc034a",
        "finance-legal-entities-funding-accounts-504555f",
        "finance-legal-entities-funding-accounts-5fad94f",
        "finance-billing-groups-funding-accounts-b83ba8e",
        "finance-billing-groups-funding-accounts-120b628",
        "finance-funding-accounts-funding-accounts-180f03c",
        "finance-funding-accounts-funding-accounts-a560acb",
        "finance-payment-methods-funding-accounts-96796ea",
        "finance-payment-methods-funding-accounts-7aa1f73",
        "finance-automatic-payments-funding-accounts-9c151f3"
      ],
      "question": "请解释 Funding Account（资金账户）这个概念：它与品牌充值付款方式、伙伴收款账户有何区别，哪些费用会从中结算；只解释，不充值或更改账户。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained",
      "explanation": "品牌预存用于结算平台与伙伴费用的资金账户。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept",
      "stage": "native-finance"
    },
    {
      "id": "finance-balance-forecast",
      "label": "Balance Forecast：余额预测",
      "source": "Balance Forecast",
      "entryIds": [
        "finance-overview-show-balance-forecast-ca9bced"
      ],
      "question": "请解释 Balance Forecast（余额预测）这个概念：未来资金预测与当前余额有何不同，为什么预测会变化，以及怎样用来理解资金缺口；不要把预测当作确定到账或替我充值。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained",
      "explanation": "根据当前余额和未来费用查看资金变化的预测。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept",
      "stage": "native-finance"
    },
    {
      "id": "finance-required-funding",
      "label": "Required Funding：需补充资金",
      "source": "Required Funding",
      "entryIds": [
        "finance-overview-required-funding-3228d65",
        "finance-overview-required-funding-6c7d2c1",
        "finance-make-deposit-required-funding-26f0b57"
      ],
      "question": "请解释 Required Funding（需补充资金）这个概念：它与当前余额、逾期未付款、待付款项及待到账充值的关系，应怎样读取这个资金缺口；不要替我计算或发起充值。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained",
      "explanation": "需结合余额与待付费用解读的充值需求。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept",
      "stage": "native-finance"
    },
    {
      "id": "finance-pending-deposit",
      "label": "Pending Deposit：待到账充值",
      "source": "Pending Deposit",
      "entryIds": [
        "finance-overview-pending-e821989"
      ],
      "question": "请解释 Pending Deposit（待到账充值）这个概念：为什么已发起的银行充值不等于当前可用余额，处理时间以什么为准；只解释，不发起或取消充值。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account",
      "explanation": "充值已发起但仍在处理，区别可用余额。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept",
      "stage": "native-finance"
    },
    {
      "id": "finance-invoice",
      "label": "Invoice：账单",
      "source": "Invoice",
      "entryIds": [
        "finance-overview-partner-payments-e71e415",
        "finance-partner-payments-invoices-partner-payments-invoices-3957ce5",
        "finance-partner-payments-invoices-partner-payments-invoice-summary-70bed61",
        "finance-impact-com-invoices-partner-payments-invoices-34544fd"
      ],
      "question": "请解释 Partner Payments Invoice（伙伴付款账单）这个概念：单张账单、账单汇总单和到期日分别怎样理解，为何平台Invoice不能仅凭名字等同本地税务发票；只说明，不付款或下载文件。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/partner-payments-invoices-explained-for-brands",
      "explanation": "应付伙伴款项的账单文件，区别汇总与税务判断。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/partner-payments-invoices-explained-for-brands",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept",
      "stage": "native-finance"
    },
    {
      "id": "finance-ach",
      "label": "ACH：美国银行电子扣款",
      "source": "ACH",
      "entryIds": [
        "finance-make-deposit-ach-376811a",
        "finance-payment-methods-ach-be3c8bf",
        "finance-payment-methods-new-ach-observed"
      ],
      "question": "请解释 ACH（美国银行电子扣款）这个概念：品牌通过它充值与银行电汇、信用卡有何不同，为什么到账需以页面和银行处理状态为准；只解释，不填写银行资料或发起扣款。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account",
      "explanation": "用于品牌充值的一种银行电子扣款方式。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept",
      "stage": "native-finance"
    },
    {
      "id": "finance-wire-transfer",
      "label": "Wire Transfer：银行电汇充值",
      "source": "Wire Transfer",
      "entryIds": [
        "finance-make-deposit-wire-5988420",
        "finance-make-deposit-wire-transfer-details-bc27509"
      ],
      "question": "请解释 Wire Transfer（银行电汇充值）这个概念：为何要在银行端操作并准确使用页面收款信息及账户编号附言，与平台内信用卡或ACH充值有何不同；只说明，不填写银行数据或发起汇款，到账时间以当前页面和银行处理为准。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account",
      "explanation": "通过银行端向平台资金账户汇款的充值方式。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept",
      "stage": "native-finance"
    },
    {
      "id": "finance-deposit-fee",
      "label": "Processing Fee：充值手续费",
      "source": "Processing Fee",
      "entryIds": [
        "finance-make-deposit-processing-fee-fe3ae81",
        "finance-payment-methods-new-credit-card-fees-observed",
        "finance-payment-methods-new-credit-card-description-observed"
      ],
      "question": "请解释充值页 Processing Fee（充值手续费）这个概念：与充值金额、可能的税费和最终扣款金额怎样区分，为什么不同付款方式的费用和到账时间可能不同；以当前页面及合同为准，不推定我的税率或代充值。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account",
      "explanation": "充值方式对应的处理费用，区别充值本金和税额。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept",
      "stage": "native-finance"
    },
    {
      "id": "finance-transfer-status",
      "label": "Funding Status：转账状态",
      "source": "Funding Status",
      "entryIds": [
        "finance-transfers-funding-status-3385a8d",
        "finance-transfers-funding-status-7b359b3",
        "finance-transfers-funding-status-b2bce46"
      ],
      "question": "请解释伙伴转账页面 Funding Status（转账状态）这个概念：未到期、逾期、已转账及已冲回分别意味着什么，为什么已转账不能直接证明伙伴的银行卡已到账；只解释，不转账、撤销或修改记录。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/view-transfer-details",
      "explanation": "伙伴转账的结算进度，与银行提现到账区分。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/view-transfer-details",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept",
      "stage": "native-finance"
    },
    {
      "id": "finance-transfer-invoice-month",
      "label": "Invoice Month：转账账单月份",
      "source": "Invoice Month",
      "entryIds": [
        "finance-transfers-invoice-month-9870f26",
        "finance-transfers-specify-invoice-month-aa92952"
      ],
      "question": "请解释伙伴转账的 Invoice Month（账单月份）这个概念：所选月份怎样影响账单生成周期，它与转账日期或立即转账有何区别；具体安排以合同和账户充值策略为准，只说明，不修改选项或提交转账。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner",
      "explanation": "决定伙伴转账计入哪个账单周期的月份。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept",
      "stage": "native-finance"
    },
    {
      "id": "finance-transfer-activity-period",
      "label": "Activity Period：费用分摊期间",
      "source": "Activity Period",
      "entryIds": [
        "finance-transfers-activity-period-60625f5"
      ],
      "question": "请解释伙伴转账的 Activity Period（费用分摊期间）这个概念：为什么费用按所选日期范围均摊到绩效报表，它与账单月份、结算日期和银行到账日期有什么区别；只解释，不填日期或提交转账。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner",
      "explanation": "将伙伴转账费用均摊到所选日期范围的绩效报表口径。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept",
      "stage": "native-finance"
    },
    {
      "id": "finance-monthly-close",
      "label": "Monthly Close：月结报表",
      "source": "Monthly Close",
      "entryIds": [
        "finance-monthly-close-monthly-close-by-event-date-b609620",
        "finance-monthly-close-monthly-close-53af4b7",
        "finance-upcoming-partner-payments-monthly-close-f98921f",
        "finance-cash-flow-history-monthly-close-412ab2e"
      ],
      "question": "请解释 Monthly Close（月结报表）这个概念：按转化发生月份和费用锁定月份归集有什么区别，为什么它与现金流不是同一口径；只解释，不改变报表设置。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report",
      "explanation": "按所选日期口径归集费用的月度报表。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept",
      "stage": "native-finance"
    },
    {
      "id": "finance-actions-paid",
      "label": "% Actions Paid：转化已付比例",
      "source": "% Actions Paid",
      "entryIds": [
        "finance-monthly-close-actions-paid-69c6d4d"
      ],
      "question": "请解释月结报表的 % Actions Paid（转化已付比例）这个概念：它怎样表示转化对应付款的完成情况，报表中的 .40 应怎样读取，为什么这个比例不能当作已付金额、资金账户余额或伙伴银行卡到账证明；只解释，不修改数据或办理付款。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report",
      "explanation": "月结报表中转化对应付款已完成的比例，区别金额和余额。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept",
      "stage": "native-finance"
    },
    {
      "id": "finance-platform-invoice",
      "label": "impact.com Invoice：平台服务费账单",
      "source": "impact.com Invoice",
      "entryIds": [
        "finance-partner-payments-invoices-impact-com-invoices-2ce6ec9",
        "finance-impact-com-invoices-impact-com-invoices-b3f42fb",
        "finance-impact-com-invoices-impact-com-invoices-5712aeb"
      ],
      "question": "请解释 impact.com Invoice（平台服务费账单）这个概念：订阅费、超额用量费与其他服务费用怎样区分，与伙伴佣金账单有什么区别；只解释，不代付款或调整套餐。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices",
      "explanation": "平台订阅及其他服务费用的账单。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept",
      "stage": "native-finance"
    },
    {
      "id": "finance-incremental-fee",
      "label": "Incremental Usage Fee：超额用量费",
      "source": "Incremental Usage Fee",
      "entryIds": [
        "finance-impact-com-invoices-incremental-growth-fee-14cd2d9"
      ],
      "question": "请解释 Incremental Usage Fee（超额用量费）这个概念：它与套餐内额度和超额用量有何关系，预估与最终用量为何可能不同；只解释，以当前合同为准，不推定账户费率。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/your-subscription/view-your-impactcom-subscription-and-usage-details",
      "explanation": "超过合同额度后的用量费用。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/your-subscription/view-your-impactcom-subscription-and-usage-details",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept",
      "stage": "native-finance"
    },
    {
      "id": "finance-legal-entity",
      "label": "Legal Entity：法律主体",
      "source": "Legal Entity",
      "entryIds": [
        "finance-general-legal-entities-d55b846",
        "finance-legal-entities-legal-entities-9652cb7",
        "finance-legal-entities-legal-entities-2db2616",
        "finance-billing-groups-legal-entities-69f173c",
        "finance-funding-accounts-legal-entities-120049b",
        "finance-funding-accounts-legal-entity-dbea4e4",
        "finance-payment-methods-legal-entities-e28c701",
        "finance-payment-methods-legal-entities-57f3692",
        "finance-automatic-payments-legal-entities-df54f3f"
      ],
      "question": "请解释 Legal Entity（法律主体）这个概念：为什么账单地址、税务资料及资金账户币种与此主体相关，它与推广计划及伙伴群组有什么不同；只说明，不更改法律或税务资料。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities",
      "explanation": "承接合同、账单和税务资料的主体。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept",
      "stage": "native-finance"
    },
    {
      "id": "finance-billing-group",
      "label": "Billing Group：账单分组",
      "source": "Billing Group",
      "entryIds": [
        "finance-general-billing-groups-679f22d",
        "finance-legal-entities-billing-groups-72dc848",
        "finance-legal-entities-billing-groups-be0648d",
        "finance-billing-groups-billing-groups-c0b3e84",
        "finance-billing-groups-billing-groups-d54bfcc",
        "finance-funding-accounts-billing-groups-fbec042",
        "finance-funding-accounts-billing-groups-e8a0f2b",
        "finance-payment-methods-billing-groups-2ba2c54",
        "finance-payment-methods-billing-groups-bd3f5ba",
        "finance-automatic-payments-billing-groups-7db1193"
      ],
      "question": "请解释 Billing Group（账单分组）这个概念：如何按推广计划归集伙伴和平台费用，它与资金账户及伙伴分组有何不同；只说明，不调整归组或文档设置。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-billing-groups-overview",
      "explanation": "按推广计划归集费用并出具账单的分组。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-billing-groups-overview",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept",
      "stage": "native-finance"
    },
    {
      "id": "finance-autofund",
      "label": "Autofund：自动充值",
      "source": "Autofund",
      "entryIds": [
        "finance-general-automatic-payments-96fab69",
        "finance-legal-entities-automatic-payments-48b98fd",
        "finance-billing-groups-automatic-payments-edba0c2",
        "finance-funding-accounts-automatic-payments-798768d",
        "finance-payment-methods-automatic-payments-68b148a",
        "finance-payment-methods-automatic-payments-0eccf21",
        "finance-automatic-payments-automatic-payments-7ffa71e",
        "finance-automatic-payments-automatic-payments-1ac71ee",
        "finance-automatic-payments-automatic-payments-ea16787"
      ],
      "question": "请解释 Autofund（自动充值）这个概念：为什么这是向品牌资金账户补充资金而不是伙伴提现，它与余额检查频率、未来预测费用和付款方式怎样关联；只说明，不开启或保存。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/set-up-automatic-payments-as-a-brand",
      "explanation": "按规则自动为品牌资金账户补充余额。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/set-up-automatic-payments-as-a-brand",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept",
      "stage": "native-finance"
    },
    {
      "id": "finance-revenue-recognition",
      "label": "Revenue Recognition Method：月结日期口径",
      "source": "Revenue Recognition Method",
      "entryIds": [
        "finance-general-revenue-recognition-method-dfc5828"
      ],
      "question": "请解释财务设置中的 Revenue Recognition Method（月结日期口径）：Reported和Locked如何决定费用归属月份，与实际付款日期有什么区别；只解释，不修改设置，也不替我判断会计准则合规。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand",
      "explanation": "选择月结按发生或锁定日期归集费用。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept",
      "stage": "native-finance"
    },
    {
      "id": "finance-funder-type",
      "label": "Funder Type：资金结算类型",
      "source": "Funder Type",
      "entryIds": [
        "finance-general-funder-type-8600f50"
      ],
      "question": "请解释 Funder Type（资金结算类型）这个概念：为什么账户类型会影响充值文档、合同锁定与付款条款、是否可立即向伙伴转账，SOI、预充值和默认类型怎样区分；只解释，以当前账户为准，不更改设置或提交付款。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/funder-types-for-brands-explained",
      "explanation": "规定账户充值文档、合同结算条款和即时转账限制的类型。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/funder-types-for-brands-explained",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept",
      "stage": "native-finance"
    },
    {
      "id": "finance-invoicing-method",
      "label": "Invoicing Method：开账单方式",
      "source": "Invoicing Method",
      "entryIds": [
        "finance-general-invoicing-method-3e6507f"
      ],
      "question": "请解释 Invoicing Method（开账单方式）这个概念：伙伴直接开账单与经 impact.com 法律主体开账单有什么区别，为何直接开账单的账户也可能看到 impact.com 主体；只解释，不改变合同或税务信息。 请引用对应官方帮助文档：https://help.impact.com/other/reference-documentation/discover-your-invoicing-method",
      "explanation": "确定伙伴费用由哪个主体开账单的安排。",
      "helpUrl": "https://help.impact.com/other/reference-documentation/discover-your-invoicing-method",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept",
      "stage": "native-finance"
    },
    {
      "id": "finance-indirect-tax-region",
      "label": "Indirect Tax Country / Region：间接税登记地区",
      "source": "Indirect Tax Country / Region",
      "entryIds": [
        "finance-legal-entities-indirect-tax-country-region-1889886"
      ],
      "question": "请解释法律主体页面的 Indirect Tax Country / Region（间接税登记国家/地区）这个字段：为什么它指间接税登记地区，与账单地址所在国家/地区有什么区别，为什么不能据此推定我的税率或税务资格；只解释，不修改主体信息。 请引用对应官方帮助文档：https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities",
      "explanation": "法律主体登记间接税的国家或地区，区别账单地址。",
      "helpUrl": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities",
      "additionalHelpUrls": [],
      "responseTemplateId": "affiliate-concept-v1",
      "questionScope": "single-concept",
      "stage": "native-finance"
    }
  ],
  "documentation": {
    "askImpact": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/ask-impact/ask-impact-tips-and-tricks",
    "dashboard": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets",
    "metrics": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report",
    "contracts": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/learn-about-template-terms-and-contracts",
    "gettingStarted": "https://help.impact.com/brand/what-would-you-like-to-learn-about/getting-started",
    "uiTour": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands",
    "optimize": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-startup-guide",
    "protect": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program",
    "actionLifecycle": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance",
    "tour": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands",
    "contract": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/learn-about-template-terms-and-contracts",
    "custom": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/contracts/add-custom-terms-to-your-contracts",
    "changes": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/template-terms/modify-template-terms",
    "application": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/review-partner-applications/review-partner-and-creator-applications",
    "proposal": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/contracts/review-contract-proposals-youve-sent",
    "workflow": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/review-partner-applications/automate-partner-application-processing/create-workflows-to-automatically-process-partner-applications",
    "emailWorkflow": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/reach-out-to-partners/email-workflows/create-and-manage-email-workflows",
    "segment": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/reach-out-to-partners/segments/create-a-partner-segment",
    "survey": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/reach-out-to-partners/surveys/create-a-partner-survey",
    "group": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/reach-out-to-partners/partner-groups/create-and-manage-partner-groups",
    "dataLab": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/data-lab-custom-reports/data-lab-introduction",
    "pending": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/payouts/filter-and-download-pending-payouts-list",
    "life": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance",
    "inquiry": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/action-inquiries/action-inquiries-explained",
    "outside": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/actions/review-actions-that-are-outside-of-terms",
    "dataPost": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/event-types/data-post-conversions-explained",
    "promotion": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/product-promotions/upload-product-promotion-files",
    "extended": "https://help.impact.com/brand/what-would-you-like-to-learn-about/performance-program/recruiting-partners/extended-search/extended-search-overview",
    "social": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/find-partners-and-creators/social-listening/create-a-social-listener",
    "discover": "https://help.impact.com/brand/what-would-you-like-to-learn-about/performance-program/recruiting-partners/discover/discover-overview",
    "contribution": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/contribution-report",
    "leapfrog": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/leapfrogging-reports/leapfrogging-summary-report",
    "concerns": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/crediting-concerns-report",
    "customer": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/new-customer-value-report",
    "behavior": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/behavior-report",
    "paths": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/top-paths-explained",
    "funnel": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/events-funnel-report",
    "eventRisk": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/event-risk/event-risk-explained",
    "atRisk": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/event-risk/review-at-risk-actions",
    "filtering": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/event-risk/filter-high-risk-traffic",
    "spoofing": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/event-risk/view-validation-patterns-for-conversion-events",
    "paidSearch": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/paid-search-monitoring/introduction-to-paid-search-monitoring",
    "meta": "https://help.impact.com/brand/what-would-you-like-to-learn-about/creator-program/working-with-creators/amplify-your-creator-ads/boost-ads-with-meta-amplification-for-brands",
    "amplified": "https://help.impact.com/brand/what-would-you-like-to-learn-about/creator-program/working-with-creators/amplify-your-creator-ads/manage-your-amplified-ads",
    "performanceCampaign": "https://help.impact.com/brand/what-would-you-like-to-learn-about/performance-program/beta-performance-campaigns/manage-a-performance-campaign/add-or-remove-performance-campaign-tasks-as-a-brand",
    "performanceReport": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report",
    "sidebarCapture": "docs/sidebar-dom-scan.json",
    "headerCapture": "docs/header-menus-dom-scan.json",
    "support": "https://help.impact.com/other/reference-documentation/get-help-and-support",
    "financeOverview": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained",
    "financeDeposit": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account",
    "financeSettings": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/finance-settings-overview-for-brands",
    "financeAutofund": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/set-up-automatic-payments-as-a-brand",
    "financeLegal": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities",
    "financeBilling": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-manage-billing-groups-and-funding-accounts-as-a-brand",
    "financeMonthly": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report",
    "financeUpcoming": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report",
    "financeCash": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/cash-flow-history-report",
    "financePartnerInvoice": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/partner-payments-invoices-explained-for-brands",
    "financeImpactInvoice": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices",
    "financeTransfer": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner",
    "financeSubscription": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/your-subscription/view-your-impactcom-subscription-and-usage-details",
    "financeExplained": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-explained-for-brands",
    "financeSoiPrf": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/understand-the-soi-and-prf-documents",
    "financePaymentMethods": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-your-payment-methods",
    "financeGeneral": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand",
    "financeFundingDocument": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/manage-funding-account-document-settings-as-a-brand",
    "financePartnerDocument": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-partner-fees-document-settings",
    "financePlatformDocument": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-impactcom-fees-document-settings",
    "financePpv": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/your-subscription/how-are-volume-usage-rates-calculated",
    "financeUsage": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/your-subscription/view-your-usage-volume-by-status-and-transaction-type",
    "financeIndirectTax": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/indirect-tax-explained-for-brands",
    "financeBillingOverview": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-billing-groups-overview",
    "financeCapture": "docs/finance-dom-scan.json",
    "financeInvoicing": "https://help.impact.com/other/reference-documentation/discover-your-invoicing-method",
    "financeTransferDetails": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/view-transfer-details",
    "financeFunderType": "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/funder-types-for-brands-explained"
  },
  "supportedSites": {
    "hosts": [
      "demo.impact.com",
      "app.impact.com"
    ],
    "dashboardPath": "/secure/advertiser/engage/aview.ihtml",
    "verifiedHost": "demo.impact.com",
    "productionStatus": "shared-structure-needs-account-regression"
  },
  "helpResponseTemplate": {
    "id": "affiliate-concept-v1",
    "sections": [
      "一句话解释",
      "联盟营销中的具体例子（注明教学假设，不作为当前账户数据）",
      "指标口径、包含/不包含及常见误解",
      "当前界面的使用方法",
      "对应官方HelpDoc链接"
    ],
    "appendInContentScript": true,
    "preserveEnglishSource": true
  },
  "sidebarCoverage": {
    "capture": "docs/sidebar-dom-scan.json",
    "uniqueEnglishLabels": 87,
    "products": [
      "Engage",
      "Discover",
      "Optimize",
      "Protect"
    ],
    "root": "#adv-navigation impact-style-isolator",
    "routePrefix": "/secure/advertiser/",
    "verification": "observed-dom-not-live-pass",
    "homonyms": [
      {
        "source": "Actions",
        "entries": [
          "actions",
          "nav-actions"
        ]
      },
      {
        "source": "Payout",
        "entries": [
          "payout",
          "nav-payout"
        ]
      },
      {
        "source": "Performance",
        "entries": [
          "nav-performance-reports",
          "nav-performance-campaigns"
        ]
      }
    ]
  },
  "headerCoverage": {
    "capture": "docs/header-menus-dom-scan.json",
    "helpEntries": 6,
    "financeEntries": 26,
    "financeDatePrefixes": 2,
    "financeGroups": [
      "reports",
      "documents",
      "settings"
    ],
    "root": "#adv-navigation impact-style-isolator",
    "routePrefix": "/secure/advertiser/",
    "scope": "header-help-and-finance-dropdowns-only",
    "verification": "observed-dom-not-live-pass",
    "financePageBodies": "not-included",
    "newHelpTopics": 0
  },
  "financeCoverage": {
    "capture": "docs/finance-dom-scan.json",
    "routeCount": 15,
    "capturedPages": 15,
    "financeEntries": 442,
    "newHelpTopics": 24,
    "verification": "observed-dom-not-live-pass",
    "pages": [
      {
        "id": "overview",
        "status": "CAPTURED",
        "entries": 28
      },
      {
        "id": "make-deposit",
        "status": "CAPTURED",
        "entries": 45
      },
      {
        "id": "transfers",
        "status": "CAPTURED",
        "entries": 64
      },
      {
        "id": "subscription",
        "status": "CAPTURED",
        "entries": 11
      },
      {
        "id": "monthly-close",
        "status": "CAPTURED",
        "entries": 31
      },
      {
        "id": "upcoming-partner-payments",
        "status": "CAPTURED",
        "entries": 27
      },
      {
        "id": "cash-flow-history",
        "status": "CAPTURED",
        "entries": 17
      },
      {
        "id": "partner-payments-invoices",
        "status": "CAPTURED",
        "entries": 21
      },
      {
        "id": "impact-com-invoices",
        "status": "CAPTURED",
        "entries": 25
      },
      {
        "id": "general",
        "status": "CAPTURED",
        "entries": 34
      },
      {
        "id": "legal-entities",
        "status": "CAPTURED",
        "entries": 21
      },
      {
        "id": "billing-groups",
        "status": "CAPTURED",
        "entries": 23
      },
      {
        "id": "funding-accounts",
        "status": "CAPTURED",
        "entries": 24
      },
      {
        "id": "payment-methods",
        "status": "CAPTURED",
        "entries": 53
      },
      {
        "id": "automatic-payments",
        "status": "CAPTURED",
        "entries": 18
      }
    ],
    "captureCandidateCount": 442,
    "unmappedCount": 0,
    "subscriptionTerms": "native-unavailable-message-only",
    "operationsExecuted": 0
  }
}
);

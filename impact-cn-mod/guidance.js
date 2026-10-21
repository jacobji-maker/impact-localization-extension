/* Static guidance only. No business data, native actions, AI requests or progress storage. */
(function () {
  "use strict";

  const integration = {
    label: "Impact · Shopify 接入说明",
    url: "https://integrations.impact.com/integration-guides/for-brands/plugin-integrations/e-commerce/integrate-with-shopify"
  };
  const testing = {
    label: "Impact · 创建测试转化",
    url: "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/actions/create-test-actions"
  };
  const endToEnd = {
    label: "Impact · 端到端测试",
    url: "https://integrations.impact.com/integration-guides/end-to-end-tests"
  };
  const lifecycle = {
    label: "Impact · 转化生命周期与财务",
    url: "https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance"
  };

  globalThis.IMPACT_CN_GUIDANCE = {
    version: "0.8.9",
    contentDate: "2026-10-16",
    checklistGroups: [
      {
        title: "欢迎",
        items: [
          { title: "欢迎使用 Impact.com", purpose: "查看当前项目的上线说明与清单安排。" }
        ]
      },
      {
        title: "账户配置",
        items: [
          { title: "邀请其他用户", purpose: "邀请协作人员，并核对访问范围与权限。" },
          { title: "完善项目信息", purpose: "填写项目基本资料与介绍。" },
          { title: "设置默认佣金比例", purpose: "设置品牌批准的默认比例与计算口径。" },
          { title: "上传推广素材", purpose: "上传供伙伴使用的推广素材。" },
          { title: "设置落地页参数", purpose: "设置落地页网址使用的参数。" }
        ]
      },
      {
        title: "技术对接",
        items: [
          { title: "网站追踪设置", purpose: "填写默认落地页和需要追踪的网站。" },
          { title: "连接您的 Shopify 账户", purpose: "查看 Shopify 接入说明与连接入口。" },
          { title: "验证转化事件", purpose: "打开测试工具，查看事件验证状态。" },
          { title: "连接产品目录", purpose: "查看商品目录连接要求与入口。" }
        ]
      },
      {
        title: "品牌样式设置",
        items: [
          { title: "伙伴后台品牌样式", purpose: "设置伙伴后台外观与可见功能。" },
          { title: "邮件品牌样式", purpose: "设置自动邮件的配色、页脚等品牌样式。" },
          { title: "伙伴注册页面", purpose: "设置伙伴注册页、协议和问卷等。" },
          { title: "伙伴欢迎邮件", purpose: "设置伙伴加入后的欢迎邮件。" }
        ]
      },
      {
        title: "上线审核",
        items: [
          { title: "Impact 账户审核", purpose: "查看账户审核要求，另行核对实际答复与上线通知。" }
        ]
      }
    ],
    guides: [
      {
        id: "shopify",
        title: "连接 Shopify",
        purpose: "让店铺把订单和后续变更传给正确的 Impact 项目。",
        applicability: "经技术确认采用 Shopify 接入的项目必需；外部托管店面、其他接入方式和订阅续费使用专用方案。已有连接先核对。本指引未在真实店铺验证。",
        prerequisites: [
          "品牌负责人：批准默认佣金比例及商品／订单计算口径。",
          "店铺管理员：确认目标店铺、对外网站与 myshopify.com 身份；具备安装和集成设置权限，收费授权另核对权限。",
          "Impact 管理员／技术负责人：确认当前账号、Program、销售事件、Shopify 托管店面、各商品／变体 SKU 及 Customer Privacy 同意设置。",
          "选择一个适合本项目的原生接入入口；安装、配置保存由有权人员按批准范围操作，连接资料只填原生页面。"
        ],
        steps: [
          {
            id: "5a",
            title: "1. 设置佣金",
            entry: "上线清单 → 账户配置 → 设置默认佣金比例",
            action: "保存已确认的佣金比例。重新进入佣金设置页，核对比例和计算口径。",
            ready: "重新打开可见已保存比例，且计算口径与品牌方案一致。",
            details: [
              "原生入口（中英对照）：当前项目 → Checklist（上线清单）→ Account Setup（账户配置）→ Set Default Percentage Payout（设置默认佣金比例）",
              "详细操作：对照品牌批准的比例与计算口径填写；检查后按原生页面保存或 Next，再重新打开核对。Next 可能保存真实配置。",
              "完整继续条件：比例和商品／订单口径正确，重新打开可确认已经保存。",
              "遇到“佣金方案尚未批准”：先确定正式比例和计算口径，再保存；不使用截图示例比例。 负责人：品牌负责人",
              "遇到“安装提示 Invalid Request”：先核对佣金是否保存。此前客户技术清单有此提醒，当前公开官网未复证；仍报错时按本次错误排查，不能断定都由佣金引起。 负责人：技术负责人／OSM（上线负责人）"
            ],
            issues: [
              { id: "5a-policy", label: "佣金方案没确定", help: "先请品牌负责人确认比例和计算口径，再保存。", owner: "品牌负责人" },
              { id: "5a-request", label: "安装报错", help: "先检查佣金是否保存；仍报错时交技术人员排查。", owner: "技术负责人／OSM（上线负责人）" }
            ],
            links: [integration]
          },
          {
            id: "5b",
            title: "2. 核对店铺网站",
            entry: "上线清单 → 技术对接 → 网站追踪设置",
            action: "核对落地网站，再请店铺管理员确认店铺身份。检查无误后保存网站设置。",
            ready: "网站、店铺和当前项目一致，设置已保存。",
            details: [
              "原生入口（中英对照）：Checklist（上线清单）→ Technical Integration（技术对接）→ Website Tracking（网站追踪设置）；Shopify → Settings（设置）→ Domains（域名）",
              "详细操作：检查 Default Landing Page（默认落地页）和 Tracking Websites（需要追踪的网站）；请店铺管理员核对 myshopify.com 店铺身份。客户访问域名与店铺身份分别检查，确认后再按页面保存。",
              "完整继续条件：落地网站和店铺身份属于同一目标店铺，当前 Program 正确，网站设置保存结果可核对。",
              "遇到“网站与店铺身份不匹配”：核对实际店铺和域名，改过店铺标识时由管理员确认，不凭品牌名称猜测。 负责人：店铺管理员",
              "遇到“使用外部托管店面”：先确认专用接入方案；不要直接套用普通 Shopify 流程。 负责人：技术负责人／OSM"
            ],
            issues: [
              { id: "5b-domain", label: "网站与店铺不一致", help: "请店铺管理员核对实际网站和店铺身份，再继续。", owner: "店铺管理员" },
              { id: "5b-storefront", label: "店面由其他平台托管", help: "先请技术负责人确认适用方案，再连接。", owner: "技术负责人／OSM" }
            ],
            links: [
              { label: "Shopify · 店铺身份与域名", url: "https://help.shopify.com/en/manual/intro-to-shopify/initial-setup/setup-business-settings" },
              integration
            ]
          },
          {
            id: "5c",
            title: "3. 检查是否已连接",
            entry: "未安装：上线清单 → 技术对接 → 连接您的 Shopify 账户；已有：Shopify应用",
            action: "先查看店铺应用。已有则核对连接；没有则从上线清单进入安装页。",
            ready: "已有连接适用本项目，或安装页属于正确店铺。",
            details: [
              "原生入口（中英对照）：Checklist → Technical Integration（技术对接）→ Connect Your Shopify Account（连接您的 Shopify 账户）→ Connect your Shopify store（连接 Shopify 店铺）；已有应用从 Shopify → Apps（应用）打开",
              "详细操作：应用已存在时先打开集成设置，核对账号、项目和销售事件。尚未连接时选择本项目 Checklist 或官方应用入口之一，进入正确店铺的安装流程。",
              "完整继续条件：现有连接适用于本项目；或已确认安装页面属于目标店铺。现有连接正确时可继续验证测试订单追踪，无需重复安装。",
              "遇到“已有连接属于其他项目”：重连、多项目和旧集成规则仍待真实页面确认；先请负责人检查，保留现有连接，不自行卸载或覆盖。 负责人：技术负责人／Impact 管理员／OSM"
            ],
            issues: [
              { id: "5c-existing", label: "已有连接属于其他项目", help: "先找技术负责人核对，保留现有连接。不要自行卸载或覆盖。", owner: "技术负责人／Impact 管理员／OSM" }
            ],
            links: [
              integration,
              { label: "Shopify · 官方 impact.com 应用", url: "https://apps.shopify.com/impact-1" }
            ]
          },
          {
            id: "5d",
            title: "4. 安装应用",
            entry: "上线清单 → 技术对接 → 连接您的 Shopify 账户 → 店铺安装页",
            action: "请有权限的人核对店铺、访问请求和费用，再安装。已有正确连接时跳过重复安装。",
            ready: "已进入设置页，或已有配置核对通过；应用在列表不等于连接完成。",
            details: [
              "原生入口（中英对照）：选定原生入口 → Install app（安装应用）；Shopify → Apps（应用）→ impact.com → Set up your integration（设置集成）",
              "详细操作：有权人员核对 Shopify 当前店铺、应用身份、访问请求与费用提示，批准安装；按应用当前流程继续设置。已连接且设置正确时无需重复安装。",
              "完整继续条件：安装后已进入适用设置步骤，或现有集成设置可核对；应用列表出现名称仅证明应用存在。",
              "遇到“没有安装或收费授权权限”：管理员核对 Manage and install apps and channels 及应用所需权限；收费或试用后收费另核对 Approve app charges。 负责人：店铺管理员",
              "遇到“应用身份或请求不明确”：对照开发者为 impact.com 的官方应用和本项目方案，再由有权人员决定安装。 负责人：店铺管理员／技术负责人"
            ],
            issues: [
              { id: "5d-permission", label: "没有安装或收费权限", help: "请店铺管理员核对安装权限和本次收费授权。", owner: "店铺管理员" },
              { id: "5d-app", label: "不确定是否官方应用", help: "对照官方应用和本项目方案，再决定安装。", owner: "店铺管理员／技术负责人" }
            ],
            links: [
              { label: "Shopify · 店铺权限", url: "https://help.shopify.com/en/manual/your-account/users/roles/permissions/store-permissions" },
              { label: "Shopify · 安装与设置应用", url: "https://help.shopify.com/en/manual/apps/install-setup-apps" },
              { label: "Shopify · 官方 impact.com 应用", url: "https://apps.shopify.com/impact-1" }
            ]
          }
        ]
      },
      {
        id: "sales-refunds",
        title: "验证销售与退款",
        purpose: "用测试订单分别确认销售追踪和退款同步。",
        applicability: "适用于接入已确认的 Shopify 项目；测试次数、优惠及部分／全额退款范围由技术实施方案决定。本指引未验证真实订单，示例不能替代全部适用测试。",
        prerequisites: [
          "技术负责人：确认店铺连接、Online Sale 销售事件、零佣金测试条款、测试覆盖及足够的锁单窗口。",
          "测试执行人和指定付款人：至少两个不同 SKU、库存、批准数量／折扣、支付方式，以及履约和通知范围。",
          "店铺所有者或有相应 Orders 权限的退款人：确认退款对象、方式、金额、补货及通知范围。",
          "零佣金不等于免支付；模拟支付是否允许且能被本集成接收先由技术负责人确认。订单资料与测试链接留在原生系统／指定受控渠道。"
        ],
        steps: [
          {
            id: "6a",
            title: "1. 验证测试订单追踪",
            entry: "验证转化事件 → 关闭遮挡的帮助侧栏 → 打开测试工具 → 在新窗口中开始测试 → 在测试链接下单",
            action: "打开测试工具，核对项目、事件、店铺与零佣金条款；再点“在新窗口中开始测试”，由你在打开的店铺按批准方案完成测试订单。",
            ready: "本次测试订单已按批准方案完成，接着核对Impact记录；打开页面、生成链接或下单本身均不能证明追踪成功。",
            details: [
              "原生入口（中英对照）：Checklist（上线清单）→ Technical Integration（技术对接）→ Validate Your Events（验证转化事件）。若帮助侧栏挡住正文，先点击侧栏左上角的关闭按钮，再点击 Open Testing Tool（打开测试工具）。",
              "测试工具：核对当前 Program、销售事件、素材与落地页；选择经确认的零佣金测试条款并检查默认佣金为 0%。Public Terms 不能直接当零佣金测试条款，Zero Payout (Testing Only) 仅是样例名称，不修改正式合同来凑条件。原生工具生成本次链接后，向下滚动到 Run Test（运行测试），点击 Start test in a new window（在新窗口中开始测试）。",
              "在测试链接下单：由你在新打开的目标店铺、同一浏览器会话中，按批准的商品、SKU、数量、折扣和支付方案完成测试订单。零佣金不等于免支付；待付款订单不算支付成功。测试链接之后的店铺操作由你完成，本助手不在店铺中继续定位；完成后返回 Impact 核对本次记录。",
              "完整继续条件：批准的支付方案已完成，原生系统可核对本次订单；链接生成、页面到达、指引声明和追踪验证结果分别判断。多个 SKU、数量、折扣及退款覆盖按技术方案安排，示例不能替代适用测试。",
              "遇到“没有测试条款、入口未解锁或支付范围未确定”：请技术负责人／OSM 与品牌负责人确认适用方案后再下单。模拟支付是否能被本集成接收需另核对，不自行开启店铺测试模式。遇到落地或追踪标识异常，请技术人员检查跳转、同意信号与来源延续，不只凭地址栏或订单页标识判断成败。"
            ],
            issues: [
              { id: "6a-terms", label: "没有测试条款或打不开工具", help: "请技术人员准备适用方案。不要把公开条款当零佣金测试条款。", owner: "技术负责人／OSM" },
              { id: "6a-scope", label: "支付或退款范围没确定", help: "先请负责人确认本次方式与范围，再下单。", owner: "品牌负责人／指定付款人／技术负责人" },
              { id: "6a-tracking", label: "链接或追踪标识有异常", help: "请技术人员核对跳转和追踪。不要只凭地址栏或订单页标识判断成败。", owner: "技术负责人" }
            ],
            links: [
              testing,
              endToEnd,
              integration,
              { label: "Shopify · 测试订单与支付方式", url: "https://help.shopify.com/en/manual/checkout-settings/test-orders/processing-test-order" }
            ]
          },
          {
            id: "6c",
            title: "2. 核对测试订单",
            entry: "验证转化事件 → 查看测试转化 → 本次测试记录 → 查看详情",
            action: "点击“查看测试转化”，找到本次测试订单并核对详情；数据无误后，由有权人员按原生流程确认／批准本次测试。出现记录不等于追踪验证成功。",
            ready: "本次订单与正确项目／事件的记录一致，数据已核对；有权人员确认的本次原生验证结果另有依据，不沿用旧状态。",
            details: [
              "原生入口（中英对照）：返回当前项目 Checklist（上线清单）→ Technical Integration（技术对接）→ Validate Your Events（验证转化事件），关闭遮挡的帮助侧栏，点击 View Test Actions（查看测试转化）；也可在测试工具点击 View my test action（查看我的测试转化）。进入列表后，找到本次测试订单并打开 View Details／See Details（查看详情）。",
              "详细操作：在原生系统用本次订单定位记录；核对订单身份、项目／事件、时间／时区、SKU／数量、折扣、金额口径、币种、测试条款、归因与预期记录数量。SKU Amount 是整行金额；ItemSubtotal 不含税和运费。自动折扣无代码时不强求优惠码，多码、分摊及换算按方案核对。",
              "确认本次测试：字段符合后，由有权人员按原生测试流程确认／批准，并核对本次验证结果。数据不符先由负责人修正，再按适用流程重测；不要用批准、重复下单或手动补记录掩盖问题。",
              "完整继续条件：本次订单与正确项目／事件对应，数据和金额口径符合方案，本次原生验证结果已确认；任何不符仍为“测试订单待核对”。记录出现、旧 Online Sale／Validated、管理员勾选和助手声明均不算本次订单验证成功。多事件方案不能机械要求全项目仅一条；测试批准不代表正常佣金提前锁单或付款。",
              "遇到“暂时找不到本次销售”：先核对事件、订单与筛选。通用帮助称最多可能需 30 分钟；Shopify 专项建议至少等 30 分钟，高峰可能需 2–4 小时，均非成功保证。按本次发生时间和实际等待观察，超出技术人员确认的窗口再升级，不反复下单。 负责人：技术负责人",
              "遇到“字段、归因、金额或记录数量不符”：请技术人员查集成、映射、同意信号、去重及错误报告；不要用重复下单、Approve 或手动补转化掩盖问题。核对资料留在原生记录／指定受控渠道。 负责人：技术负责人"
            ],
            issues: [
              { id: "6c-wait", label: "找不到本次测试订单", help: "先检查事件、订单和筛选，再按窗口等待。等待不是成功保证，不要反复下单。", owner: "技术负责人" },
              { id: "6c-data", label: "数据不符或验证状态不明", help: "请技术人员核对本次数据和事件。不要先批准、手动补记录或引用旧通过状态。", owner: "技术负责人／测试执行人" }
            ],
            links: [testing, integration, endToEnd, lifecycle]
          },
          {
            id: "6e",
            title: "3. 退款测试说明",
            mode: "information",
            entry: "由店铺退款负责人和技术负责人另行安排，本页只提供说明",
            action: "退款测试由有权限的店铺人员按批准方案执行，技术人员核对Impact同步。本页不提供退款操作定位，请联系对接负责人安排。",
            ready: "退款已提交且对应记录已更新；仅取消订单不算退款完成。",
            details: [
              "本项仅作说明：退款在店铺后台由有权限的退款负责人执行，不在当前 Impact 页面操作；助手不提供退款定位或代操作。请对接负责人先确认退款范围，再安排店铺人员与技术人员配合核对。",
              "核对要求：先检查目标 action 的 Locking Date（锁单日期）。退款负责人核对商品／数量、可退金额、退款方式、运费、补货和通知；技术人员另查同一 Impact 记录的数量、金额和修改／撤销。部分与全额退款需覆盖时先安排订单，Impact 修改不会反向同步 Shopify。",
              "完整继续条件：退款提交有原生结果，且对应 Impact 更新经核对。商品退款核对 SKU 数量和金额；订单级金额退款核对分摊，不强求数量减少。取消、退款提交、资金到账和 Impact 更新分别判断。",
              "遇到“退款尚未在 Impact 更新”：销售等待说明不能直接当退款时限；旧材料“每 4 小时更新”未获当前公开资料复证。技术人员确认本次观察窗口，按实际退款时间记录等待，超时查同步，不重复退款。 负责人：技术负责人",
              "遇到“已锁单、金额不符或账务异常”：退款不可撤销，提交前由负责人核对；仅取消不代表已退款。已锁单时不能承诺普通退款自动撤销已锁定佣金；同步和锁单问题交技术人员，退款方式及到账交退款／财务人员。 负责人：技术负责人／退款负责人／财务负责人"
            ],
            issues: [
              { id: "6e-wait", label: "退款还没同步", help: "请技术人员确认退款观察窗口，超时再查同步。不要重复退款。", owner: "技术负责人" },
              { id: "6e-locked", label: "已锁单或退款金额不符", help: "同步和锁单问题找技术人员，到账问题找退款或财务负责人。不要承诺锁单佣金会自动撤销。", owner: "技术负责人／退款负责人／财务负责人" }
            ],
            links: [
              { label: "Impact · Shopify 退款与修改", url: "https://integrations.impact.com/integration-guides/for-brands/plugin-integrations/e-commerce/integrate-with-shopify#modifications-and-reversals" },
              { label: "Shopify · 退款", url: "https://help.shopify.com/en/manual/fulfillment/managing-orders/refunding-orders" },
              { label: "Shopify · 取消订单", url: "https://help.shopify.com/en/manual/fulfillment/managing-orders/canceling-orders" },
              lifecycle
            ]
          },
          {
            id: "6f",
            title: "4. 技术确认与上线审核说明",
            mode: "information",
            entry: "由技术负责人确认测试，再由对接负责人／OSM安排审核",
            action: "请技术负责人分别确认测试订单、退款与未测项。上线审核需由对接负责人／OSM安排，客户不能在此页自行完成；请联系负责人确认审核进度和上线通知。",
            ready: "销售、退款和适用测试均已确认；审核与上线通知另行核对。",
            details: [
              "本项仅作说明：客户不能在此页自行完成技术审核或上线审核，助手不提供审核按钮定位。请将测试完成情况和遗留问题交对接负责人／OSM，由其按项目流程安排后续审核。",
              "核对要求：技术负责人分别确认本次测试订单、退款、适用覆盖和遗留问题；当前已观察的清单没有独立 Impact Tech Review 项。财务前置由财务负责人另行核对，不把测试通过视为审核通过。",
              "完整继续条件：商店接入与适用测试经负责人确认。指引声明、Checklist、实际配置、订单／退款证据、OSM 审核和上线通知分别有依据，不能按完成百分比宣布上线。",
              "遇到“只有销售通过或测试覆盖不全”：保留“销售已核对；退款待核对”等实际待办；无订单、退款未授权或部分覆盖未完成时继续等待对应负责人，不能记技术完成。 负责人：技术负责人／品牌负责人",
              "遇到“财务未解锁或审核方式不清楚”：请 OSM 确认前置与项目审核流程；实际财务结果由财务负责人核对，审核通过和收到上线通知继续单列。 负责人：OSM／财务负责人"
            ],
            issues: [
              { id: "6f-incomplete", label: "只有销售通过或仍有未测项", help: "保留退款和其他未测项，等对应负责人确认。不要标记技术完成。", owner: "技术负责人／品牌负责人" },
              { id: "6f-next", label: "财务待确认或审核进度不清", help: "请对接负责人确认前置和审核进度；财务结果交财务负责人核对。", owner: "OSM／财务负责人" }
            ],
            links: [endToEnd, lifecycle]
          }
        ]
      }
    ]
  };
})();

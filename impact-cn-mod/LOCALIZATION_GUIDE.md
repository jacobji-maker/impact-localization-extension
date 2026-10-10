# Impact 汉化助手说明书

版本：`0.5.3` · 更新日期：2026-10-11 · 语言：简体中文

## 0.5.3 原生 Actions 菜单定向诊断

账单分组新增“编辑”“伙伴费用文档设置”“impact.com费用文档设置”，资金账户新增“编辑”“资金账户文档设置”。依据两页真实新菜单固定Text，精确限定document/top/唯一u与portal中各选项实际祖先链，不改节点、属性或组件，不新增主题。两页分别核对正常hover及单次点击；英文/中文菜单可达，5条翻译及原文恢复通过。严格属性gate仍因原生根style.left变化未通过；定向菜单结果不能代替编辑表单或完整财务验收。

最近完整15入口报告属于0.5.2，13PASS/2FAIL；本版没有重跑15入口、报表或原生问答。ACH及Monthly修补保留历史已验证范围。

## 0.5.2 ACH布局与财务复检

充值选项中的ACH缩短为“ACH扣款”，实页文字和问号均在原选项框内；其他付款方式说明保留完整ACH含义。关闭翻译恢复原Text，节点、属性、输入和链接保持。月结“清除全部”只移除原生生成弹层ID的依赖，保留实际多选组件、第一工具项和精确报表语境。词条和主题仍694/66，财务437/24。

本轮重新验收真实财务页面，并保留修补前失败报告。两份只读报表各查询一次，完整结果完成证据仍不足；Cash实际四分区结构与原单表判定不符，不能只以标题、表格存在或加载消失通过。三类编辑表单及两个新财务原生回复仍待正式验证。具体当前实网结果以项目finance-live-test-report.md和本轮阶段报告为准；下方0.5.0/0.5.1结果均为历史范围。

## 0.5.1 财务页面汉化（本地测试包，尚未全量验收）

2026-10-10 按用户要求交付0.5.1本地测试包，收录当前694条词典和付款方式修补。0.5.0旧ZIP保留为675/418历史快照。0.5.1只更新版本标识和说明，翻译规则、主题及运行机制与付款方式阶段最终0.5.0源码相同；该阶段付款方式单入口1/1实网结果单独保留，完整财务15页及原生AI仍待验收。完整状态和后续任务见项目根目录PROJECT_STATE.md、NEXT_TASK.md。

本轮定向加固数字计数格式和跨frame主题的源文档/顶层页面校验；财务采集保留自定义账户选项的唯一定位、固定枚举白名单，以及只触发一次的只读查询和有界结果等待。持续加载或页面失联时明确记录查询未完成，不重试Apply或保存设置。

原生菜单复用同一Text而筛选范围变化时，当前插件会复核词条scope，恢复仍由插件控制的原文；框架已经写入的新值保持原样。最初两词条/稳定菜单范围9项验证已保留；最终694字典的新增规则范围13/13合成通过，包含费用和Reports。财务13/13、Shadow26/26、MV3控制6/6、顶栏6/6、脱敏4/4及采集/回放17/17、表单就绪和固定费用采集17/17，均为付款方式阶段最终0.5.0工作区的合成机制结果；0.5.1打包检查另记录，不将这些报告改标为新版本全量验收。真实页面及原生回复仍只以各实网报告实际范围为准。 0.5.1已重新运行实际MV3的合成宿主控制6/6、隐私机制4/4，以及版本/语法/词条主题等价检查；未重新运行财务全15页或发送原生问题。

本轮新增真实Upcoming Partner Payments加载状态中的H3标题Finalized Payouts，译为“已确定应付款项”。该标题已观察，但报表结果仍加载，表头/业务行与查询完成未得到证明；不扩展未观察字段，也不新增问号。[报表官方说明](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report)将其解释为已锁定转化的未来应付款，[转化生命周期](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance)说明锁定后金额确定、随后计划结算。

同时只收录真实Funding Status筛选中已观察的Overdue选项，译为“已逾期”。规则限定实际转账frame、顶层u参数、具体ul/li/text-ellipsis组件及Funding Status筛选的唯一focused状态，避免替换同名伙伴或用户。[官方转账详情](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/view-transfer-details)将Overdue列为转账结算进度的固定枚举。本轮两条新增均只标observed-dom，已纳入0.5.1测试包；只读报表查询完成及三类编辑表单采集仍受限。

本轮在用户确认财务栏框译法后扩展真实财务页面。词典来源为本次账户实际显示的固定文本节点；官方文档用于校准含义，不用于假定账户开放了某个字段或流程。充值金额、币种、银行账户、税号、账单编号、伙伴与联系人资料、原日期和表单值均保留。自动化只浏览页面及未提交的菜单、筛选/说明和表单，不保存设置、不充值、不向伙伴转账。

原生财务页面存在外壳与iframe；新增规则按实际document的精确路径与必要查询参数、顶层外壳路径和业务容器选择器限定，防止相同英文在非财务页面被替换。跨frame小问号将请求交给顶层原生Ask Impact，沿用现有的单概念回答模板；静态说明不是原生AI回复。当前词条、范围负例与子frame机制已有合成结果；原生财务AI仍待独立验收，旧版本通过结果不代替本轮结果。

### 财务翻译口径

下表是官方文档的概念校准口径，包含尚未在当前账户显示的候选概念。只有本次真实DOM已观察的文本才收录为词条或问号；实际收录范围以下方清单和dict.js为准。

| 概念 | 中文口径 | 官方依据 |
| --- | --- | --- |
| Required Funding / Pending Deposit | 需补充资金 / 待到账充值；预充值、当前余额和应付款项分别处理。 | [资金账户总览](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained) |
| Finalized / Estimated Payouts | 已确定 / 预估应付款项；锁定佣金与预计佣金区分，都不代表伙伴已经收到款。 | [即将到期的伙伴付款](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report) |
| Monthly Close / Revenue Recognition Method | 月结报表 / 月结日期口径；费用按转化发生或锁定月份归集，与资金流水不同。 | [月结报表](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report)、[常规财务设置](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand) |
| Partner Funds Transfer (PFT) | 伙伴资金转账：合同佣金条款外的伙伴付款，如奖金；区别品牌充值。 | [伙伴资金转账](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner) |
| Funder Type | 资金结算类型：规定充值文档、合同锁定与付款条款、即时转账限制，区别充值方式。 | [账户资金结算类型](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/funder-types-for-brands-explained) |
| Activity Period | 费用分摊期间：将伙伴转账费用均摊到所选日期范围的绩效报表，区别账单月份和结算日。 | [伙伴转账字段](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner) |
| Invoice / SOI / PRF | 账单 / 账单汇总单 / 预计充值需求单，保留英文缩写；SOI、PRF均不能直接等同单张Invoice。 | [SOI与PRF](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/understand-the-soi-and-prf-documents) |
| Credit Memo | 贷项通知单：调整账单应付金额的文档，区别资金账户信用额度。 | [impact.com 服务费账单](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices) |
| Payment Processing Volume (PPV) | 支付处理金额：平台计费用量，区别成交金额、交易数量和本月已到伙伴银行的金额。 | [用量计费口径](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/your-subscription/how-are-volume-usage-rates-calculated)、[用量状态和交易类型](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/your-subscription/view-your-usage-volume-by-status-and-transaction-type) |
| Automatic Payments / Autofund | 自动充值：按余额和未来费用向品牌资金账户补资金。 | [品牌自动充值](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/set-up-automatic-payments-as-a-brand) |
| Legal Entity / Billing Group / Funding Account | 法律主体 / 账单分组 / 资金账户：合同和税务主体、费用归集、资金结算分别处理。 | [财务设置总览](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/finance-settings-overview-for-brands)、[账单分组](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-billing-groups-overview) |
| Indirect Tax | 间接税：VAT、GST等按实际账户和适用地区显示，插件不判断税务资格或税率。 | [间接税说明](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/indirect-tax-explained-for-brands) |

官方订阅说明摘要曾将PPV展开为purchase price variance，同页正文和专门计费文档明确为Payment Processing Volume；本项目采用后者。具体到账时间、可用付款方式和自动充值条件以当前账户的英文原文、银行提示及最新官方文章为准，插件不改变费用计算结果。

### 财务词条与辅助问号清单

当前词典699条、66主题，其中财务442条、24主题；采集442候选，付款方式规则53条。本轮在原675/418快照上新增两条固定概念/枚举、16条真实新增付款方式正文及1条该页Engage Reports导航。相同菜单按外壳独立定位，规则数不等于不同英文单词数。财务条目为native-finance / observed-dom，单独采集不表示实网验收已经通过。

本轮付款方式单入口在694源码上实网1/1通过：列表和新增表单两状态长英文残留0，原Text/链接/开关恢复检查通过，0pageErrors；22是初始列表Text样本数，17个本轮new/ui规则在动态entryIds中命中。没有填入卡资料或点击Save/Pay。真实金额/私人业务行样本数0，不能据此声称真实业务值有代表性验收。最终全15入口与财务AI仍待完成；早期677源码的9/15与后续定向结果分别保留。

16条正文规则显式限定topOnly/lightDOMOnly；开放Shadow只匹配已观察的导航宿主。信用卡固定费用说明保留$100原字节，按完整原文唯一采集，允许原生信用卡/ACH描述共用ID，但相同完整原文重复匹配仍拒绝。没有货币槽或金融数值模板。官方[充值说明](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account)校准按每100及不足部分计费的语义。

| 真实页面入口 | 当前规则数 | 范围说明 |
| --- | --- | --- |
| 财务总览 | 28 | 仅当前已采集固定文本；未提交业务操作 |
| 充值 | 45 | 仅当前已采集固定文本；未提交业务操作 |
| 伙伴资金转账 | 64 | 包含真实Funding Status筛选中的固定Overdue选项；未提交业务操作 |
| 订阅与用量 | 11 | 真实显示不可用提示；未显示的订阅条款及用量明细待账号开放后采集 |
| 月结报表 | 31 | 仅当前已采集固定文本；未提交业务操作 |
| 即将到期的伙伴付款 | 27 | 包含本轮结果仍加载时观察到的固定H3标题；查询完成及详细表头待验 |
| 资金流水 | 17 | 仅当前已采集固定文本；未提交业务操作 |
| 伙伴付款账单 | 21 | 仅当前已采集固定文本；未提交业务操作 |
| impact.com服务费账单 | 25 | 仅当前已采集固定文本；未提交业务操作 |
| 常规设置 | 34 | 仅当前已采集固定文本；未提交业务操作 |
| 法律主体 | 21 | 仅当前已采集固定文本；未提交业务操作 |
| 账单分组 | 23 | 包含3条真实Actions菜单标签；未提交业务操作 |
| 资金账户 | 24 | 包含2条真实Actions菜单标签；未提交业务操作 |
| 充值付款方式 | 53 | 列表、真实new/ui正文及实际导航；未填写或提交付款方式 |
| 自动充值 | 18 | 真实显示待到账充值提示；不可进入的自动充值设置待当前充值处理后采集 |

以下是本轮实际收录source与中文校准清单。同原文在多个精确scope中使用相同译文时合并展示；完整ID、实际选择器、frame路径/查询、观察状态和原因可在dict.js的stage=native-finance条目核对。客户名称、联系人和币种不收入本表。

| 实际source | 中文 | 应用页面 |
| --- | --- | --- |
| Partner Fees Document Settings | 伙伴费用文档设置 | 账单分组Actions菜单 |
| impact.com Fees Document Settings | impact.com费用文档设置 | 账单分组Actions菜单 |
| Funding Account Document Settings | 资金账户文档设置 | 资金账户Actions菜单 |
| Overview | 财务总览 | 财务总览, 充值, 伙伴资金转账, 订阅与用量, 月结报表, 即将到期的伙伴付款, 资金流水, 伙伴付款账单, impact.com服务费账单, 常规设置, 法律主体, 账单分组, 资金账户, 充值付款方式, 自动充值 |
| Reports | 财务报告 | 财务总览, 充值, 伙伴资金转账, 订阅与用量, 月结报表, 即将到期的伙伴付款, 资金流水, 伙伴付款账单, impact.com服务费账单, 常规设置, 法律主体, 账单分组, 资金账户, 充值付款方式, 自动充值 |
| Make Deposit | 充值 | 财务总览, 充值, 伙伴资金转账, 订阅与用量, 月结报表, 即将到期的伙伴付款, 资金流水, 伙伴付款账单, impact.com服务费账单, 常规设置, 法律主体, 账单分组, 资金账户, 充值付款方式, 自动充值 |
| Transfers | 伙伴资金转账 | 财务总览, 充值, 伙伴资金转账, 订阅与用量, 月结报表, 即将到期的伙伴付款, 资金流水, 伙伴付款账单, impact.com服务费账单, 常规设置, 法律主体, 账单分组, 资金账户, 充值付款方式, 自动充值 |
| Documents | 账单文档 | 财务总览, 充值, 伙伴资金转账, 订阅与用量, 月结报表, 即将到期的伙伴付款, 资金流水, 伙伴付款账单, impact.com服务费账单, 常规设置, 法律主体, 账单分组, 资金账户, 充值付款方式, 自动充值 |
| Subscription | 订阅与用量 | 财务总览, 充值, 伙伴资金转账, 订阅与用量, 月结报表, 即将到期的伙伴付款, 资金流水, 伙伴付款账单, impact.com服务费账单, 常规设置, 法律主体, 账单分组, 资金账户, 充值付款方式, 自动充值 |
| Settings | 财务设置 | 财务总览, 充值, 伙伴资金转账, 订阅与用量, 月结报表, 即将到期的伙伴付款, 资金流水, 伙伴付款账单, impact.com服务费账单, 常规设置, 法律主体, 账单分组, 资金账户, 充值付款方式, 自动充值 |
| Settings | 通知设置 | 财务总览, 充值, 伙伴资金转账, 订阅与用量, 月结报表, 即将到期的伙伴付款, 资金流水, 伙伴付款账单, impact.com服务费账单, 常规设置, 法律主体, 账单分组, 资金账户, 充值付款方式, 自动充值 |
| Payment Request Form | 预计充值需求单（PRF） | 财务总览 |
| Funding Account - | 资金账户 - | 财务总览 |
| Show balance forecast | 显示余额预测 | 财务总览 |
| Past Due | 逾期未付款 | 财务总览, 伙伴付款账单 |
| Payments due since | 付款到期日自 | 财务总览 |
| Pending Payments | 待付款项 | 财务总览 |
| Required Funding | 需补充资金 | 财务总览, 充值 |
| Transaction Summary | 资金收支摘要 | 财务总览 |
| Description | 说明 | 财务总览 |
| Amount | 金额 | 财务总览, 伙伴资金转账 |
| Current Balance | 当前余额 | 财务总览 |
| Deposit | 充值 | 财务总览 |
| Pending | 待到账 | 财务总览 |
| - Partner Payments | - 伙伴付款 | 财务总览 |
| (funds required through | (所需资金截至 | 财务总览 |
| Fund your account through ACH transfer, Credit Card, or Wire Transfer. | 可通过 ACH 银行扣款、信用卡或银行电汇向资金账户充值。 | 充值 |
| Payment Type | 充值方式 | 充值, 充值付款方式 |
| Credit Card | 信用卡 | 充值, 充值付款方式 |
| ACH | ACH扣款（充值选项）；ACH 银行扣款（付款方式说明） | 充值, 充值付款方式 |
| Wire | 银行电汇 | 充值 |
| Payment Method | 付款方式 | 充值 |
| View | 查看 | 充值 |
| Enter Amount | 输入充值金额 | 充值 |
| Processing fee | 充值手续费 | 充值 |
| Funds will appear within | 预计到账时间 | 充值 |
| 3-5 business days | 3-5 个工作日 | 充值 |
| Pay | 付款 | 充值 |
| Payment Methods | 充值付款方式 | 充值, 常规设置, 法律主体, 账单分组, 资金账户, 充值付款方式, 自动充值 |
| Add Payment Method | 添加付款方式 | 充值, 充值付款方式 |
| rows | 行 | 充值, 伙伴资金转账, impact.com服务费账单 |
| Wire Transfer Details | 银行电汇信息 | 充值 |
| Initiate a wire transfer to impact.com using the details below. | 请使用以下收款信息，从您的银行向 impact.com 发起电汇。 | 充值 |
| Reference your account ID. | 请在汇款附言中注明您的账户编号。 | 充值 |
| Account name | 收款账户户名 | 充值 |
| Bank Name | 银行名称 | 充值 |
| Bank Country | 开户银行所在国家/地区 | 充值 |
| Account Number | 银行账号 | 充值 |
| SWIFT/BIC Code | SWIFT/BIC 银行识别码 | 充值 |
| Reference | 参考编号 | 充值 |
| Download Payment Instructions | 下载汇款指引 | 充值 |
| Add Credit Card | 添加信用卡 | 充值 |
| Bulk Upload Transfers | 批量导入伙伴转账 | 伙伴资金转账 |
| Create Transfer | 创建伙伴转账 | 伙伴资金转账 |
| Partner | 合作伙伴 | 伙伴资金转账 |
| Program | 推广计划 | 伙伴资金转账 |
| Type | 转账类型 | 伙伴资金转账 |
| User Initiated | 发起人 | 伙伴资金转账 |
| Funding Status · | 转账状态 · | 伙伴资金转账 |
| Invoice Status | 开账单状态 | 伙伴资金转账 |
| Clear Filters | 清除筛选条件 | 伙伴资金转账 |
| Transfer To | 收款伙伴 | 伙伴资金转账 |
| Date Created | 创建日期 | 伙伴资金转账 |
| Transfer Date | 转账日期 | 伙伴资金转账 |
| Funding Status | 转账状态 | 伙伴资金转账 |
| Sorry! There's no data to show | 当前没有可显示的数据 | 伙伴资金转账, impact.com服务费账单 |
| Select which partner should receive this transfer | 选择接收这笔转账的合作伙伴 | 伙伴资金转账 |
| Select | 请选择 | 伙伴资金转账 |
| Event Type | 事件类型 | 伙伴资金转账 |
| Associate transfer with an event type | 将转账关联到一个事件类型 | 伙伴资金转账 |
| Select Event Type | 选择事件类型 | 伙伴资金转账 |
| Transaction Details | 转账明细 | 伙伴资金转账 |
| Select the transaction type and amount you want to transfer | 选择转账类型，并输入转账金额 | 伙伴资金转账 |
| You Pay | 您需支付 | 伙伴资金转账 |
| Partner Receives | 伙伴应收金额 | 伙伴资金转账 |
| Invoice Details | 账单安排 | 伙伴资金转账 |
| Here you can schedule when the transfer should occur | 在此设置这笔转账的账单和结算安排 | 伙伴资金转账 |
| Invoice month | 账单月份 | 伙伴资金转账 |
| Specify invoice month | 指定账单月份 | 伙伴资金转账 |
| Send this transfer immediately | 立即转账 | 伙伴资金转账 |
| Activity Period | 费用分摊期间 | 伙伴资金转账 |
| to | 至 | 伙伴资金转账 |
| Reporting Details | 报表附加字段 | 伙伴资金转账 |
| Add details you would like to see in reporting | 添加希望在报表中显示的信息 | 伙伴资金转账 |
| Comments | 备注 | 伙伴资金转账 |
| Next | 下一步 | 伙伴资金转账 |
| Clear | 清除 | 伙伴资金转账, 伙伴付款账单, impact.com服务费账单 |
| All | 全部 | 伙伴资金转账, 即将到期的伙伴付款, 资金流水, impact.com服务费账单 |
| Overdue | 已逾期 | 伙伴资金转账 |
| Subscription information not available | 订阅信息暂不可用 | 订阅与用量 |
| We are currently not able to display the terms of your subscription. | 目前无法显示您的订阅条款。 | 订阅与用量 |
| Please try again later. Thank you for your patience. | 请稍后再试，感谢您的耐心等待。 | 订阅与用量 |
| Monthly Close by Event Date | 按转化发生月份月结 | 月结报表 |
| Show: | 显示项： | 月结报表 |
| None | 未选择 | 月结报表, 即将到期的伙伴付款, 资金流水 |
| Apply | 应用 | 月结报表, 即将到期的伙伴付款, 资金流水 |
| Partner Fees | 伙伴费用 | 月结报表 |
| month | 月份 | 月结报表 |
| currency | 币种 | 月结报表 |
| % Actions Paid | 转化已付比例 | 月结报表 |
| % Other Costs Paid | 其他费用已付比例 | 月结报表 |
| action cost | 转化佣金 | 月结报表 |
| Action Revenue | 转化成交金额 | 月结报表 |
| Click Cost | 点击佣金 | 月结报表 |
| other cost | 其他推广费用 | 月结报表 |
| net amount | 未税金额 | 月结报表 |
| tax | 税额 | 月结报表 |
| total | 含税合计 | 月结报表 |
| Displaying: {start} - {end} of {total} | 显示第 {start} - {end} 行，共 {total} 行 | 月结报表 |
| Clicks and impressions received in the last three hours may not be included here. There is a 2+ hour delay for some metrics. | 最近三小时内收到的点击和展示可能尚未计入；部分指标会延迟两个多小时更新。 | 月结报表, 即将到期的伙伴付款, 资金流水 |
| Monthly Close | 月结报表 | 月结报表, 即将到期的伙伴付款, 资金流水 |
| Upcoming Partner Payments | 即将到期的伙伴付款 | 月结报表, 即将到期的伙伴付款, 资金流水 |
| Cash Flow History | 资金流水 | 月结报表, 即将到期的伙伴付款, 资金流水 |
| Clear all | 清除全部 | 月结报表 |
| Sortable Month | 月份排序字段 | 月结报表 |
| Prediction Range: | 预测范围： | 即将到期的伙伴付款 |
| 45 days | 45 天 | 即将到期的伙伴付款 |
| Funding Account: | 资金账户： | 即将到期的伙伴付款, 资金流水 |
| Partner: | 合作伙伴： | 即将到期的伙伴付款 |
| 30 days | 30 天 | 即将到期的伙伴付款 |
| 60 days | 60 天 | 即将到期的伙伴付款 |
| 90 days | 90 天 | 即将到期的伙伴付款 |
| Finalized Payouts | 已确定应付款项 | 即将到期的伙伴付款 |
| Partner Payments Invoices | 伙伴付款账单 | 伙伴付款账单, impact.com服务费账单 |
| impact.com Invoices | impact.com 服务费账单 | 伙伴付款账单, impact.com服务费账单 |
| Partner Payments Invoice Summary | 伙伴付款账单汇总 | 伙伴付款账单 |
| Month | 月份 | 伙伴付款账单, impact.com服务费账单 |
| row | 行 | 伙伴付款账单, 法律主体, 账单分组, 资金账户, 充值付款方式 |
| Invoices | 账单数量 | 伙伴付款账单 |
| Generated on | 生成日期 | 伙伴付款账单, impact.com服务费账单 |
| Total Due | 应付合计 | 伙伴付款账单 |
| Status | 付款状态 | 伙伴付款账单, impact.com服务费账单 |
| Document | 文档编号 | impact.com服务费账单 |
| Type | 文档类型 | impact.com服务费账单 |
| Subscription Fee | 订阅费 | impact.com服务费账单 |
| Incremental Growth Fee | 超额用量费 | impact.com服务费账单 |
| Other Fees | 其他服务费 | impact.com服务费账单 |
| Total | 含税合计 | impact.com服务费账单 |
| General | 常规设置 | 常规设置, 法律主体, 账单分组, 资金账户, 充值付款方式, 自动充值 |
| Legal Entities | 法律主体 | 常规设置, 法律主体, 账单分组, 资金账户, 充值付款方式, 自动充值 |
| Billing Groups | 账单分组 | 常规设置, 法律主体, 账单分组, 资金账户, 充值付款方式, 自动充值 |
| Funding Accounts | 资金账户 | 常规设置, 法律主体, 账单分组, 资金账户, 充值付款方式, 自动充值 |
| Automatic Payments | 自动充值 | 常规设置, 法律主体, 账单分组, 资金账户, 充值付款方式, 自动充值 |
| Finance Contacts | 财务联系人 | 常规设置 |
| Select a contact for finance updates and email document delivery | 选择接收财务更新及账单邮件的联系人 | 常规设置 |
| Primary Contact | 主要联系人 | 常规设置 |
| Existing Account User | 已有账户用户 | 常规设置 |
| Other Contact | 其他联系人 | 常规设置 |
| Additional Contacts | 其他财务联系人 | 常规设置 |
| Specify additional contacts' email address(es) for finance updates and email document delivery | 填写其他联系人的邮箱，用于接收财务更新和账单邮件 | 常规设置 |
| Monthly Closing Report | 月结报表 | 常规设置 |
| Specify either action reporting date or action locking date month as the revenue recognition methodology | 选择按转化发生月份或转化锁定月份归集月结费用 | 常规设置 |
| Revenue Recognition Method | 月结日期口径 | 常规设置 |
| Use the month when actions are | 月结月份按转化 | 常规设置 |
| Reported | 发生日期 | 常规设置 |
| as the month for revenue recognition | 所在月份确定 | 常规设置 |
| Funder Type | 资金结算类型 | 常规设置 |
| Not indicated (no restrictions) | 未指定（无策略限制） | 常规设置 |
| Invoicing Method | 开账单方式 | 常规设置 |
| Direct invoicing to Partner accounts, with the exception of region-based invoicing via impact.com entities | 与伙伴直接开具账单；按地区经 impact.com 法律主体开具账单的情况除外 | 常规设置 |
| Save | 保存 | 常规设置, 充值付款方式 |
| Name | 名称 | 法律主体, 账单分组, 资金账户, 充值付款方式 |
| Indirect Tax Country / Region | 间接税登记国家/地区 | 法律主体 |
| Edit | 编辑 | 法律主体, 账单分组, 资金账户 |
| Fees | 费用 | 账单分组 |
| Programs | 推广计划 | 账单分组 |
| ID | 账户编号 | 资金账户 |
| Currency | 币种 | 资金账户 |
| Legal Entity | 法律主体 | 资金账户 |
| Balance | 余额 | 资金账户 |
| Type | 付款方式类型 | 充值付款方式 |
| Account/Card # | 银行账号/卡号 | 充值付款方式 |
| Funding account | 资金账户 | 充值付款方式 |
| ACH draw from your bank account. No processing fees are applicable if this option is selected. | ACH 从您的银行账户扣款。选择此方式不收取处理手续费。 | 充值付款方式 |
| Credit Card Details | 信用卡信息 | 充值付款方式 |
| Funds are available immediately, with fees of at least 3.5 units per 100 units processed. | 资金即时可用，手续费至少为 3.5 货币单位（按每处理 100 货币单位计算）。 | 充值付款方式 |
| Cardholder Name | 持卡人姓名 | 充值付款方式 |
| Card Number | 卡号 | 充值付款方式 |
| Expiration Date | 有效期 | 充值付款方式 |
| (MM/YY) | (MM/YY) | 充值付款方式 |
| CVV | 安全码（CVV） | 充值付款方式 |
| (3 digits) | (3 位数字) | 充值付款方式 |
| Draw from your credit card account. A handling charge will be charged per $100 (or part thereof) deposited. | 从您的信用卡账户扣款。每充值 $100（或不足该金额的部分）均收取手续费。 | 充值付款方式 |
| Reports | 数据报表 | 充值付款方式 |
| You have a pending deposit. You'll be able to set up automatic payments or edit your current settings once the deposit is processed. | 您有一笔充值正在处理。处理完成后，即可设置自动充值或修改现有设置。 | 自动充值 |
| To learn more, visit our help doc on | 更多说明，请查看帮助文档： | 自动充值 |

仅在复杂概念旁加入辅助问号；下列主题均有真实收录entry双向关联，沿用原生Ask Impact发送与官方HelpDoc回答模板。一个主题在多个scope出现时仍是同一概念。实际原生回答须另测，不能把question/explanation当作已得到的AI回答。

| 概念主题 | 官方文档 |
| --- | --- |
| Partner Funds Transfer：伙伴资金转账 | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner) |
| Payment Request Form：预计充值需求单（PRF） | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/understand-the-soi-and-prf-documents) |
| Funding Account：资金账户 | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained) |
| Balance Forecast：余额预测 | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained) |
| Required Funding：需补充资金 | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained) |
| Pending Deposit：待到账充值 | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account) |
| Invoice：账单 | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/partner-payments-invoices-explained-for-brands) |
| ACH：美国银行电子扣款 | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account) |
| Wire Transfer：银行电汇充值 | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account) |
| Processing Fee：充值手续费 | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/deposit-funds-into-your-account) |
| Funding Status：转账状态 | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/view-transfer-details) |
| Invoice Month：转账账单月份 | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner) |
| Activity Period：费用分摊期间 | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/partner-funds-transfer/transfer-funds-to-a-partner) |
| Monthly Close：月结报表 | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report) |
| % Actions Paid：转化已付比例 | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report) |
| impact.com Invoice：平台服务费账单 | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-documents/impactcom-invoices) |
| Incremental Usage Fee：超额用量费 | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/your-subscription/view-your-impactcom-subscription-and-usage-details) |
| Legal Entity：法律主体 | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities) |
| Billing Group：账单分组 | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/beta-billing-groups-overview) |
| Autofund：自动充值 | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/set-up-automatic-payments-as-a-brand) |
| Revenue Recognition Method：月结日期口径 | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/manage-general-finance-settings-as-a-brand) |
| Funder Type：资金结算类型 | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/funder-types-for-brands-explained) |
| Invoicing Method：开账单方式 | [HelpDoc](https://help.impact.com/other/reference-documentation/discover-your-invoicing-method) |
| Indirect Tax Country / Region：间接税登记地区 | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/create-and-manage-your-legal-entities) |

新增scope采用pathExact与topPaths；财务报告加实际handle查询限定，Shadow节点加真实宿主，正文加具体业务选择器。observedSelector保存采集定位用于审计，运行选择器按实际组件保留必要结构（包括当前Overdue版本类）；组件变体须重新观察和验证，不靠全页英文单词替换。日期、币种和选择数量只在已观察的固定片段范围内翻译，其动态部分保留。

<!-- FINANCE_COVERAGE_END -->

## 历史版本范围与验收记录

### 0.4.1范围与验收状态

本版面向真实 `demo.impact.com` 品牌侧Dashboard、已实际采集的Engage、Discover、Optimize、Protect四产品共享侧边栏，以及右上角帮助菜单与财务下拉栏框。Dashboard路径为 `/secure/advertiser/engage/aview.ihtml`，侧边栏限定 `/secure/advertiser/` 路径与真实导航开放Shadow DOM；`app.impact.com`采用共享结构适配，仍需在对应账号独立回归。不复制原站另建页面，不使用模拟AI替代原生Ask Impact，不生成账户收益或业务数据。

当前字典257条：156条已采集真实页面标签与DOM位置，5条Pendo弹窗词条待选择器回归，96条历史词条仅限定`[data-impact-cn-demo]`。四产品侧边栏采集得到87个不同英文标签，全部映射入字典；Performance按实际A/Span节点分别处理后，侧边栏适配共88个条目。原15个单概念主题增加27个，当前共42个。`native-dashboard`、`native-header / observed-dom`仅表示采集定位；词义校准和DOM采集都不能替代加载扩展后的实网PASS。

0.4.0将Optimize按用户指定改为“多维分析”，补齐四产品实际侧边栏的主菜单、展开子菜单与嵌套菜单。新增条目依据实际原文与DOM位置收录；文档用于校准词义，不用于猜测当前账户可见功能。必要的条款、核查、归因、风控与数据提交概念提供局部问号，普通导航不全部加问号。落盘词典的JSON/脚本外壳、ID唯一性、87标签覆盖、严格范围与42主题双向关联检查已通过；0.4.0浏览器验收结果作为历史记录保留如下，不代替0.4.1新增顶栏词条的验收。

### 0.4.1新增范围与验收状态

依据当前真实伙伴页面的[顶栏DOM采集](../docs/header-menus-dom-scan.json)，新增帮助菜单6条、财务下拉栏框26条（其中到期日期固定前缀2条），保留原42个概念主题。范围包括财务栏框摘要、主菜单及“财务报告 / 账单文档 / 财务设置”三组展开子菜单；点击后的财务页面正文、表格和业务流程尚未加入。本轮先供用户验证栏框译法，再扩展整个财务模块及必要的小问号。

2026-10-10 13:12:18（Asia/Seoul），在新建浏览器中实际加载MV3 0.4.1并访问真实`demo.impact.com`，本轮32/32顶栏词条实网验收通过：帮助菜单6/6；财务卡片与入口15/15（6个卡片标签、7个主入口、2个到期日期前缀）；财务报告3/3；账单文档2/2；财务设置6/6。关闭汉化后恢复英文、重新开启后恢复中文，原Text节点身份和链接属性保留；4个财务数值Text节点及到期日期后缀不变。刷新后帮助与财务栏框继续汉化，三组原生子菜单仍正常展开，pageerror事件0。证据见[header-live-test-report.md](../header-live-test-report.md)及[report.json](../artifacts/header-live/report.json)。

本版重新运行机制回归26/26、顶栏机制回归6/6、实际加载MV3的popup/runtime/storage控制回归6/6，全部通过；对应报告为[unit-test-report.md](../unit-test-report.md)、[header-menu-test-report.md](../header-menu-test-report.md)与[extension-test-report.md](../extension-test-report.md)。这些机制检查使用合成宿主，实网验收使用真实站点，分别记录。本轮未进入财务页面正文，未执行充值、转账或财务修改，未发送AI问题，也未新增财务概念主题；原42个主题不变。旧版0.4.0侧栏和原生AI验收保留为历史记录，不计作本轮新问答验收。

### 帮助与财务栏框的校准清单

各条目均限定`demo.impact.com / app.impact.com`、`/secure/advertiser/`、`#adv-navigation impact-style-isolator`及采集到的具体菜单选择器。PXA、Help Docs、Chat和工单含义按[官方帮助与支持](https://help.impact.com/other/reference-documentation/get-help-and-support)核对；Chat译“在线咨询”，因为启用ask impact的账户会先打开AI，不能一律称为人工客服。

财务按品牌资金账户口径处理。[资金账户总览](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/your-funding-account-overview-explained)区分逾期、待付款及待到账充值；[财务设置](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-settings/finance-settings-overview-for-brands)区分法律主体、账单分组与资金账户；[自动充值](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/add-funds-to-your-funding-account/set-up-automatic-payments-as-a-brand)是向品牌资金账户补充余额，不能与伙伴提现或佣金自动发放混淆。

| ID | 实际英文source | 0.4.1中文 | 校准原因 |
| --- | --- | --- | --- |
| `header-help-pxa` | PXA | 合作伙伴培训学院（PXA） | PXA提供合作伙伴营销相关培训与认证课程，保留学院缩写。 |
| `header-help-walkthroughs` | Walkthroughs | 交互式操作指南 | 在平台内启动逐步操作引导，区别仅浏览帮助文章。 |
| `header-help-docs` | Help Docs | 帮助文档 | 打开官方帮助中心查询文章。 |
| `header-help-chat` | Chat | 在线咨询 | 按账户配置打开ask impact或客服对话；不误标为必然直接接通人工。 |
| `header-help-tickets` | Tickets | 客服工单 | 提交与管理支持请求，不是门票或任务票据。 |
| `header-help-whats-new` | What's New | 产品更新 | 产品新功能和更新入口；只翻译已采集菜单标签。 |
| `header-finance-title` | Finance | 财务 | 财务下拉栏框标题。 |
| `header-finance-deposit-button` | Make Deposit | 充值 | 向品牌资金账户补充资金的入口，不是冻结押金或提现。 |
| `header-finance-required-funding` | Required funding | 需补充资金 | 覆盖待付款项及逾期费用所需的账户资金，保留原金额和计算结果。 |
| `header-finance-past-due` | Past due | 逾期未付款 | 已经超过到期日但尚未付款的费用。 |
| `header-finance-pending-deposits` | Pending deposits | 待到账充值 | 已发起但尚未到账的账户充值，区别当前可用资金。 |
| `header-finance-pending-payments` | Pending payments | 待付款项 | 已经计划但尚未到期的付款，区别逾期欠款或待到账充值。 |
| `header-finance-due-since` | (Due since | (到期日自 | 仅替换到期范围的固定起始前缀；原日期、空白和右括号原样保留。 |
| `header-finance-due-through` | (Due through | (到期日截至 | 仅替换到期范围的固定截止前缀；原日期、空白和右括号原样保留。 |
| `header-finance-overview` | overview | 财务总览 | 资金账户汇总入口，区别推广绩效总览。 |
| `header-finance-reports` | reports | 财务报告 | 展开财务报表分类，不替换其他页面的Reports。 |
| `header-finance-deposit-menu` | make deposit | 充值 | 财务菜单中的账户充值入口，保留真实小写source及链接。 |
| `header-finance-transfers` | transfers | 伙伴资金转账 | 向伙伴支付奖金等合同佣金条款外款项的PFT管理入口，区别账户充值。 |
| `header-finance-documents` | documents | 账单文档 | 展开伙伴付款账单与平台账单文档分类。 |
| `header-finance-subscription` | subscription | 订阅与用量 | 平台套餐、订阅费用和支付处理用量详情入口。 |
| `header-finance-settings` | settings | 财务设置 | 展开资金、账单和充值设置，区别全局账户设置。 |
| `header-finance-monthly-close` | Monthly Close | 月结报表 | 按转化发生月份汇总推广费用与平台费用的月结报表入口；不是关闭当月账户。 |
| `header-finance-upcoming-partner-payments` | Upcoming Partner Payments | 即将到期的伙伴付款 | 伙伴未来到期款项报告，可含已锁定及预计付款，不代表已经支付。 |
| `header-finance-cash-flow-history` | Cash Flow History | 资金流水 | 资金账户历史流入流出及余额变化报告，不是成交金额或利润报告。 |
| `header-finance-partner-invoices` | Partner Payments Invoices | 伙伴付款账单 | 应付伙伴款项的账单和汇总文件入口；不把平台Invoice直接等同本地税务发票。 |
| `header-finance-impact-invoices` | impact.com Invoices | impact.com 服务费账单 | 平台订阅、用量及其他服务费用账单，区别伙伴佣金账单；不把平台Invoice直接等同本地税务发票。 |
| `header-finance-general` | General | 常规设置 | 财务通用设置及主要财务联系人，不扩大到其他页面的General。 |
| `header-finance-legal-entities` | Legal Entities | 法律主体 | 承接合同、付款与税务信息的主体设置，区别推广计划或伙伴群组。 |
| `header-finance-billing-groups` | Billing Groups | 账单分组 | 将不同推广计划的伙伴费用分别归集开账单的设置，区别伙伴分组。 |
| `header-finance-funding-accounts` | Funding Accounts | 资金账户 | 用于充值并结算平台费用和伙伴款项的账户，区别收款银行卡。 |
| `header-finance-payment-methods` | Payment Methods | 充值付款方式 | 品牌向资金账户充值使用的付款方式设置，区别伙伴收款方式。 |
| `header-finance-automatic-payments` | Automatic Payments | 自动充值 | 按余额和未来应付费用自动为品牌资金账户充值，不是自动调整佣金或伙伴提现。 |

`(Due since`与`(Due through`按严格scope使用`prefix`规则，只替换固定英文前缀；原空格、日期字符串和`)`后缀原样保留，不计算/推测到期日、不更改日期格式。两个充值入口的source分别为`Make Deposit`与`make deposit`，真实大小写原样记录；财务菜单的CSS大小写渲染不作为新增英文别名的依据。

“月结报表”是[Monthly Close财务报表](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/view-the-monthly-close-report)，按所指报表的转化月份汇总费用；“即将到期的伙伴付款”是[Upcoming Partner Payments](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/upcoming-partner-payments-report)，包含未来款项及预计项；“资金流水”是[Cash Flow History](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/finance/finance-reporting/cash-flow-history-report)，不等同利润。

Invoice采用“账单”表达付款文件入口，不能仅凭平台标签就理解为所在地税务发票；官方文件可能含税务信息，其具体用途仍以实际文件和适用要求为准。

财务栏框仅展示标签翻译：充值、转账及设置链接/事件保持原样，不执行充值、转账或财务修改。账户名称、货币、金额和实际日期不收入字典或采集报告。本轮不在帮助/财务菜单新增概念问号，不将静态术语说明包装成AI回答。

### 历史0.4.0验收记录

2026-10-10 12:33:45（Asia/Seoul），在新建测试浏览器中实际加载MV3 0.4.0并登录真实`demo.impact.com`，完成site、sidebar、dom、residuals、date、ai六项检查，全部PASS，另有登录与实网访问PASS。未使用本地页面、请求替换或模拟AI回复。四产品、20组展开菜单的实际汉化通过，字典覆盖87个不同英文标签、88个作用域条目；侧栏目标中文缺失0、英文标签残留0，32项概念问号显示检查通过。Dashboard采样中37/61个可见Text节点改变文本，节点替换数0、数值变化数0；正式限定范围内长英文句残留0，动态日期标签英文残留0，未出现pageerror事件。范围外的英文与业务数据不据此视为遗漏。

本次原生问答仅验收`template-terms`（合作条款模板）一个主题：真实鼠标点击词条问号1次，插件自动发送1次，无用户介入；得到本次新增的929字符中文原生回复及1个[官方条款模板与合作合同链接](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/learn-about-template-terms-and-contracts)。未保存聊天全文；42个主题不能据此声称42/42原生回答通过。实网报告见[live-test-report.md](../live-test-report.md)，当前问答证据见[real-ai-links.json](../artifacts/live/real-ai-links.json)。

独立机制回归累计26/26、实际加载MV3的popup/runtime/storage控制回归6/6通过，报告合并了已通过项目及最新变更影响项目的重检；脱敏检查4/4通过。机制和MV3控制测试使用合成宿主，分别验证两开关四种组合、草稿保护、拖动不误触、设置持久化及刷新位置重置，不能代替上述实网检查。另补充原生AI关闭动画回归：旧输入框退出后才打开新的输入框，旧实例不填入问题；关闭AI辅助会取消尚未发送的请求，快速重新开启也不恢复旧请求。报告见[unit-test-report.md](../unit-test-report.md)与[extension-test-report.md](../extension-test-report.md)。

本地Chrome安装步骤见[INSTALL.md](INSTALL.md)。

### 历史0.3.1验收记录

0.3.1的独立合成DOM回归20/20通过，脱敏检查4/4通过；使用新建测试浏览器配置的已登录真实站点验收6/6通过。真实验收包括扩展加载、文本节点与数值保留、限定范围英文残留检查、原生动态日期控件，以及Actions一个概念的问题发送与原生回复。该次新回复874字符，含中文解释与1个官方伙伴绩效报告链接；未保存回复全文。15个帮助主题不能据此声称全部原生问答通过。测试报告文件由最新版本覆盖；历史结果保留在[CHANGELOG.md](CHANGELOG.md)，不得当作本版新增功能已经通过。

0.3.1将Total Cost缩为“推广总成本”、Program Health改为“推广效果概览”，并补充9个已观察到的原生中文导航旧译完整别名。词条总数与15个概念主题不变；原生页面0值、金额、日期和用户数据保持原样。英文原站的本次实网采样中37/61个可见Text节点发生文本变化，节点替换数0、数值变化数0。9个原生中文aliases的范围校准由单元测试验证，本次英文实网没有逐一验证原站中文模式下的别名。

测试前关闭旧上下文、删除临时测试浏览器配置并重建，以恢复英文原站基线，避免沿用旧语言缓存。本次记录`nativeEnglishBaselineVerified=true`，已核实Clicks、Actions、Action Cost、Revenue、Total Cost、Conversion Rate六个原始英文指标；此记录只说明本次测试起点与结果，不代表所有客户端缓存都已处理。

更早版本曾发送1条同时覆盖Dashboard和六项指标的原生问题，观察到1条中文回复与官方链接；各版本原生问答分别记录，不能合并推成多个主题全部通过。0.3.0历史结果见版本记录。

实页采集依据见 [dashboard-dom-scan.json](../docs/dashboard-dom-scan.json)与[sidebar-dom-scan.json](../docs/sidebar-dom-scan.json)。侧边栏采集仅覆盖本次账户实际显示的87种标签；套餐、权限或平台更新出现的新菜单需独立采集。不在字典、日志或报告中记录Cookie、token、密码、账户识别信息、真实姓名或聊天正文。

## 联盟营销术语与官方口径

本版以[品牌入门文档](https://help.impact.com/brand/what-would-you-like-to-learn-about/getting-started)为索引，并以具体指标与功能文档核对含义。入门目录本身不提供全部指标定义，不能只凭目录标题推断口径。以下是本项目中文译法，不宣称为官方统一中文名称。

| 英文source | 0.4.0中文 | 口径与边界 | 官方依据 |
| --- | --- | --- | --- |
| Program Health | 推广效果概览 | 趋势模块，可选择日期、显示时段对比、配置图表；不是固定健康评分。 | [Dashboard组件](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets) |
| Clicks | 点击次数 | 伙伴链接带来的点击数量；简单标签不默认添加问号。 | [伙伴绩效报告](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report) |
| Actions | 转化量 | 获归因的转化数量；官方伙伴报表排除已撤销转化。明细的一条Action是转化记录，按钮操作列另按上下文解释。 | [伙伴绩效报告](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report) |
| Action Cost | 转化佣金 | 因伙伴带来转化产生的报酬金额；不是佣金比例、CPA或到账确认。 | [伙伴绩效报告](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report)、[转化生命周期](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance) |
| Revenue | 成交金额 | 销售转化的成交销售金额，与佣金收入和利润区分；其他事件类型需按实际报表口径核对。 | [伙伴绩效报告](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report) |
| Total Cost | 推广总成本 | Action Cost + Click Cost + Other Cost。其他推广成本可包括奖金、补偿、展示位费等；不是品牌全部经营成本或平台全部账单。 | [伙伴绩效报告](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report) |
| Conversion Rate | 转化率 | 官方品牌报表为Actions÷Clicks，在相同日期与事件口径下解读；零分母的显示处理交给原站。 | [伙伴绩效报告](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report) |
| Partners you'll love | 推荐合作伙伴 | 可招募的潜在伙伴，不表示已经签约或保证合作效果。 | [Dashboard组件](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets) |
| Extra Large | 超大型 | 伙伴规模等级，参考站内活动与外部业务/流量/受众数据；不是服装尺码或收益保证。 | [伙伴规模分级](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/reach-out-to-partners/partner-management/partner-size-rating-criteria) |

采用“推广总成本”保留Cost的成本含义，避免把计账成本标签直接理解为已经付出资金。官方伙伴报告虽然以paid out描述该报表列，Dashboard上的成本金额仍不能证明具体资金已到账；实际付款需要同时核对[转化锁定、计划结算与资金状态](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance)。

转化生命周期中，待锁定记录在核查期内可修改或撤销；到锁定日期成为已锁定转化，官方将这一财务阶段列为Approved/Locked，随后按计划结算。不要把伙伴申请获批准的语境套在转化状态上，也不要笼统断言所有Approved与Locked一定是独立步骤。历史0.1.0批准类词条仅保留历史范围，不作为本版正式状态适配。

## 导航中文与英文对照

产品图标下的文字很窄，因此UI采用短中文；原英文产品名保留在对应问号的题目、提示与官方链接中。

| 产品 | 短中文 | 用途及边界 | 官方依据 |
| --- | --- | --- | --- |
| Engage | 合作管理 | 日常合作管理入口；实际子菜单依项目与账户而定。 | [伙伴管理](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/reach-out-to-partners/partner-management/manage-my-partners) |
| Discover | 招募伙伴 | 寻找、查看和招募潜在伙伴，与已有签约伙伴管理区分。 | [Discover概览](https://help.impact.com/brand/what-would-you-like-to-learn-about/performance-program/recruiting-partners/discover/discover-overview) |
| Optimize | 多维分析 | 用户指定中文名称；提供跨渠道、客户旅程及伙伴贡献等多维报告，不是自动优化开关，不预设已经订阅。 | [Optimize入门](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-startup-guide) |
| Protect | 风险防护 | 包含推广合规监测和事件风险防护，不能缩窄为仅欺诈检测或承诺自动拦截。 | [Protect与监测](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program) |

[官方品牌界面导览](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/impactcom-ui-tour-for-brands)说明这些是产品切换入口，显示的产品随套餐变化。汉化不更改路由，不购买或启用套餐，不执行风险处置。


原生中文导航校准仅按完整文本匹配，限定`hosts=['demo.impact.com','app.impact.com']`、`path='/secure/advertiser/'`与`shadowHost='#adv-navigation impact-style-isolator'`。主菜单使用`.subitem-label`；Partners、Contracts、Reports在本版补充已实际观察到的`.child-menu-content a,.child-menu-content span`范围。英文source保留，不影响其它页面相同中文、账户名称或用户输入。

下列9个别名已通过0.3.1合成DOM单元验证；历史0.3.1的6/6实网验收基于英文原站，未以原生中文页面重跑这9项。本版新增子菜单范围须依据0.4.0报告另行判断。

| 英文source | 已观察原生中文alias | 校准中文 |
| --- | --- | --- |
| Dashboard | 面板 | 仪表盘 |
| Partners | 伙伴 | 合作伙伴 |
| Campaign Manager | 项目经理 | 营销活动管理 |
| Amplification | 放大 | 付费推广 |
| Reports | 报表 | 数据报告 |
| Transactions | 交易 | 交易记录 |
| Content | 内容 | 推广素材 |
| Contracts | 合同 | 合作合同 |
| Refer & Earn | 推荐并赚取 | 推荐奖励 |

## 侧边栏范围与同英文不同含义

四产品共享导航范围仅使用域名、`/secure/advertiser/`路径和`#adv-navigation impact-style-isolator`开放Shadow DOM宿主；主标签为`.product-name/.subitem-label`，展开子项限定`.child-menu-content a/.child-menu-content span`，嵌套项限定`.subchild-label a`。不使用泛匹配a或整页单词替换；Dashboard指标继续使用原专属路径与snapshot宿主。

| 同英文 | 上下文 | 中文与边界 |
| --- | --- | --- |
| Actions | Dashboard指标 | 转化量：获归因转化的数量汇总。 |
| Actions | Transactions和Pending Payouts子菜单 | 转化记录：逐笔事件记录，独立action-records生命周期问题。 |
| Payout | Optimize主菜单 | 佣金归因：归因与佣金分配分析分类，不是付款按钮。 |
| Payout | 隔离历史示例 | 保留历史佣金金额译法，不用于正式导航。 |
| Performance | Campaign Manager下A直文本 | 效果营销活动：活动管理入口。 |
| Performance | Reports下可展开Span | 绩效报告：报表分类；scope排除含A的Span，避免与活动A祖先重叠。 |

上述source可重复但entry ID必须唯一，执行时按实际scope选择候选，不能只按英文全局建立唯一译文。Promo Codes为Content中的优惠码管理，Promo Code为Protect中的优惠码监测；同IP转化及风险信号均不能直接当作已确认欺诈。Leapfrogging为最后点击归因下的归因抢占线索，Crediting Concerns为归因分配合理性分析，均不自动修改佣金或判定作弊。

0.4.0扩展侧边栏标签，0.4.1追加右上Help与Finance下拉栏框；点击菜单之后的新页面正文、表单、表格或业务流程仍未逐页采集与验收。

## 局部问号与字典接口

`entries`继续保留`id/source/target/reason/reviewStatus/stage/verification/scope`。复杂概念增加`helpTopicId`；`helpTopics`增加`entryIds`并与之双向关联。正式条目仍按域名、路径、真实DOM选择器和Shadow DOM宿主限定，不能因添加帮助而扩大翻译范围。

每个问号只解释旁边那个复杂概念。删除旧`dashboard/metrics`整页预设问题，不让Program Health问题一次讲解六个指标。`Clicks`这类简单标签不默认挂问号；转化率公式、佣金/成交金额/总成本、伙伴规模以及产品入口分别提供帮助。

局部按钮应保留原生指标卡、导航与控件的点击行为；自身带可识别的英文与中文可访问名称。点击问号定位页面已有Ask Impact，填入单概念问题后发送；已有草稿或定位结果不唯一时保留用户内容并说明原因。汉化开关与动态重绘之后，问号不得重复、遗漏、改变数据或引发原卡片的其它动作。

`helpTopics.question`只围绕一个概念；`questionScope='single-concept'`作为校验标记，不是CSS范围。`source`保留原英文，`helpUrl`为对应已打开核实的官方文档，`additionalHelpUrls`补充同一概念的边界依据。`responseTemplateId='affiliate-concept-v1'`指向统一回答模板，由`content.js`追加：

1. 一句话解释。
2. 联盟营销中的具体例子，明确为教学假设，不能作为当前账户数据。
3. 指标口径、包含/不包含及常见误解。
4. 这个词在当前界面如何使用。
5. 对应官方HelpDoc链接，并保留英文source对照。

`helpTopics.explanation`只是人工整理的静态说明，不能包装成AI回复或用来替代原生回答验收。真实Ask Impact的回复正文不参与汉化；每次验收需要检查本次新增回复及其解释与官方链接。

### 汉化与帮助的独立开关、面板拖动

0.4.0汉化开关只控制词条替换/还原，帮助开关独立控制概念问号显示。关闭汉化而保留帮助时，问号仍在对应英文概念旁；关闭帮助而保留汉化时，中文显示继续生效。开关切换不发送问题，不覆盖原生Ask Impact草稿。关闭帮助会取消正在等待输入框或发送按钮的请求；重新开启不自动重发。

悬浮控制面板名称为“汉化助手”，允许使用专用把手拖动，位置仅对当前页面有效；刷新后重置至默认位置，也可点击“恢复默认位置”。拖动结束不误触开关或发送问题。两开关组合、拖动与刷新重置已通过本版机制和MV3控制回归；真实站点的侧栏与单概念问答另见实网报告，不将合成宿主控制测试当作真实站点全部交互的验证。

原生Ask Impact关闭时，入口可能先出现，而旧输入框仍处于关闭动画中。插件按已核实的原生入口状态等待旧框退出，再打开并定位新的输入框；不把即将移除的旧框当作可发送实例。等待过程同样受AI开关取消控制，不覆盖草稿，不重复点击入口或自动重发失败的问题。

| topic ID | 英文概念 | entryIds | 官方依据 |
| --- | --- | --- | --- |
| `program-health` | Program Health | `program-health` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets) |
| `actions` | Actions | `actions` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report) |
| `action-cost` | Action Cost | `action-cost` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report) |
| `revenue` | Revenue | `revenue` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report) |
| `total-cost` | Total Cost | `total-cost` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report) |
| `conversion-rate` | Conversion Rate | `conversion-rate` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/performance-reports-for-brands/performance-by-partner-report) |
| `partner-size` | Extra Large | `extra-large` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/reach-out-to-partners/partner-management/partner-size-rating-criteria) |
| `recommended-partners` | Partners you'll love | `recommended-partners` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/dashboard/brand-dashboard-widgets) |
| `engage` | Engage | `engage` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/reach-out-to-partners/partner-management/manage-my-partners) |
| `discover` | Discover | `discover` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/performance-program/recruiting-partners/discover/discover-overview) |
| `optimize` | Optimize | `optimize` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-startup-guide) |
| `protect` | Protect | `protect` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program) |
| `campaign-manager` | Campaign Manager | `campaign-manager` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/creator-program/recruit-creators/manage-creator-campaign-applicants) |
| `amplification` | Amplification | `amplification` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/creator-program/creator-campaigns-for-brands/content-rights-for-creator-campaigns-explained) |
| `contracts` | Contracts | `contracts` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/learn-about-template-terms-and-contracts) |
| `template-terms` | Template Terms | `nav-template-terms` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/learn-about-template-terms-and-contracts) |
| `custom-terms` | Custom Terms | `nav-custom-terms` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/contracts/add-custom-terms-to-your-contracts) |
| `contract-changes` | Changes | `nav-changes` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/template-terms/modify-template-terms) |
| `workflows` | Workflows | `nav-workflows` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/review-partner-applications/automate-partner-application-processing/create-workflows-to-automatically-process-partner-applications) |
| `segments` | Segments | `nav-segments` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/reach-out-to-partners/segments/create-a-partner-segment) |
| `applications` | Applications | `nav-applications` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/review-partner-applications/review-partner-and-creator-applications) |
| `proposals-sent` | Proposals Sent | `nav-proposals-sent` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/contracts/review-contract-proposals-youve-sent) |
| `data-lab` | Data Lab | `nav-data-lab` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/data-lab-custom-reports/data-lab-introduction) |
| `action-records` | Actions | `nav-actions` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance) |
| `pending-payouts` | Pending Payouts | `pending-payouts` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/payouts/filter-and-download-pending-payouts-list) |
| `action-inquiries` | Inquiries | `nav-inquiries` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/action-inquiries/action-inquiries-explained) |
| `outside-terms` | Outside Terms | `outside-of-terms` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/actions/review-actions-that-are-outside-of-terms) |
| `data-posts` | Data Posts | `nav-data-posts` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/event-types/data-post-conversions-explained) |
| `product-promotions` | Product Promotions | `nav-product-promotions` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/product-promotions/upload-product-promotion-files) |
| `extended-search` | Extended Search | `nav-extended-search` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/performance-program/recruiting-partners/extended-search/extended-search-overview) |
| `social-listening` | Social Listening | `nav-social-listening` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/find-partners-and-creators/social-listening/create-a-social-listener) |
| `contribution` | Contribution | `nav-contribution` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/contribution-report) |
| `leapfrogging` | Leapfrogging | `nav-leapfrogging` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/leapfrogging-reports/leapfrogging-summary-report) |
| `crediting-concerns` | Crediting Concerns | `nav-crediting-concerns` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/crediting-concerns-report) |
| `customer-value` | Customer Value | `nav-customer-value` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/new-customer-value-report) |
| `behavior` | Behavior | `nav-behavior` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/behavior-report) |
| `top-paths` | Top Paths | `nav-top-paths` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/top-paths-explained) |
| `events-funnel` | Events Funnel | `nav-events-funnel` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/cross-channel-performance-insights/optimize-reports/events-funnel-report) |
| `event-risk` | Event Risk | `nav-event-risk` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/event-risk/event-risk-explained) |
| `at-risk` | At Risk | `nav-at-risk` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/event-risk/review-at-risk-actions) |
| `scoring-filtering` | Scoring & Filtering Settings | `nav-scoring-filtering-settings` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/event-risk/filter-high-risk-traffic) |
| `conversion-spoofing` | Conversion Spoofing Rules | `nav-conversion-spoofing-rules` | [HelpDoc](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/protect-and-monitor-your-performance-program/event-risk/view-validation-patterns-for-conversion-events) |

## 真实DOM与数据保留规则

| 范围 | 宿主或容器 | 内部选择器 |
| --- | --- | --- |
| 产品与主导航 | 开放Shadow DOM：`#adv-navigation impact-style-isolator` | `.product-name,.subitem-label` |
| 展开侧边栏子项 | 同上 | `.child-menu-content a,.child-menu-content span` |
| 嵌套侧边栏子项 | 同上 | `.subchild-label a` |
| 通知与设置 | 同上 | `#adv-nav,.leftSlideMenu,.notification_settings,#profile-dropdown` |
| 欢迎语 | 主文档 | `#vueInstance .welcome-back` |
| 功能区标题 | 主文档 | `#vueInstance h3.dashboard-container-title` |
| 显示对比 | 主文档 | `#vueInstance .partnerSnapshotContainer .filterSection a` |
| 编辑组件 | 主文档 | `#vueInstance .partnerSnapshotContainer btn.tertiary` |
| 日期范围预设/清除 | 主文档：`.iui-calendar-range` | `.iui-calendar-range .presets, .iui-calendar-range .footer` |
| 六项指标 | 开放Shadow DOM：`snapshot-chart-shadow` | `[class*="secondaryFieldLabel"]` |
| 伙伴规模 | 主文档 | `#vueInstance .partner-size .size-label` |
| 内容分类 | 主文档 | `#vueInstance .partner-category .text-ellipsis` |
| Discover链接 | 主文档 | `#vueInstance .discover-link a` |
| 原生Ask Impact | 开放Shadow DOM：`#ask-impact-shadow-host` | 输入`textarea[placeholder='ask impact...']`；发送`button[aria-label='Send']` |
| Pendo充值假期通知 | 主文档：`.pendo-guide-container` | 尚待弹窗重新出现时回归 |

`scope`使用`hosts/path/selector`及精确路径/查询、顶层范围，可选`shadowHost`；新付款方式正文另显式设置`topOnly/lightDOMOnly`。内部selector在当前根中匹配，shadowHost沿开放Shadow DOM宿主链判断；主文档closest不能直接跨Shadow DOM。需监听主文档及已发现的开放Shadow Root，处理后续动态组件。

- `match=exact`只匹配完整文本节点，aliases同样完整匹配并沿用原scope；不得逐个英文单词替换任意长句。
- `match=prefix`仅替换已观察且严格定位的固定前缀，覆盖欢迎语、到期说明和资金标签等；欢迎语姓名、实际日期和币种后缀运行时保留原字节，不写入文件或日志。
- 只写文本节点nodeValue，不重建父节点、不替换innerHTML、不改原生事件、React/Vue状态或Shadow DOM宿主组件。
- 数值、金额、日期、ID、伙伴名称、头像及用户输入保留，尤其跳过`.partner-name/.avatar-container/.account-btn/.profileBtn`与编辑区、Ask Impact消息正文。
- 日期弹窗只译15个已采集预设/星期说明/清除按钮；月份、年份、日历日期和实际选中值不改，不自行计算本周或滚动范围。
- 不翻译placeholder/title/aria-label、URL或控件值。无显式value的原生option跳过，避免改变提交值；有value时仅能翻译显示文本。
- Pendo提醒只处理完整已知标签，停办日期保留；关闭后DOM消失的选择器不列为正式通过。

## 0.4.0 实页采集词条与待回归词条

| ID | 原文或模板 | 中文 | 修改原因 | 采集状态 |
| --- | --- | --- | --- | --- |
| partners | Partners | 合作伙伴 | 品牌合作关系管理入口，不译成股东或合伙人。 已观察原生中文导航的完整旧译作为限定范围别名校准。 | 已采集并定位DOM |
| contracts | Contracts | 合作合同 | 双方接受合作条款后形成的合作合同。 已观察原生中文导航的完整旧译作为限定范围别名校准。 | 已采集并定位DOM |
| reports | Reports | 数据报告 | 查看合作推广数据的报告入口。 已观察原生中文导航的完整旧译作为限定范围别名校准。 | 已采集并定位DOM |
| clicks | Clicks | 点击次数 | 合作伙伴链接带来访问的点击数量；数值保持原样。 | 已采集并定位DOM |
| actions | Actions | 转化量 | 联盟营销指标卡的获归因转化数量；官方伙伴报表排除已撤销转化。明细记录与操作按钮列另按上下文区分。 | 已采集并定位DOM |
| revenue | Revenue | 成交金额 | 官方销售转化报表中的成交销售金额，非伙伴佣金或品牌利润；其它事件类型需按对应口径核对。 | 已采集并定位DOM |
| reversed | Reversed | 已撤销转化 | 已撤销的转化记录，区别待锁定状态或一般退款金额。 | 已采集并定位DOM |
| close | Close | 关闭 | 关闭弹窗按钮；不执行点击或删除原生通知。 | 选择器待回归 |
| conversion-rate | Conversion rate | 转化率 | 官方品牌报表口径为转化次数除以点击次数；0值和分母为0时的显示保持原样。 | 已采集并定位DOM |
| last-30-days | Last 30 days | 最近 30 天 | 原生滚动日期范围预设。 | 已采集并定位DOM |
| this-month | This month | 本月 | 原生自然月日期范围预设。 | 已采集并定位DOM |
| today | Today | 今天 | 原生日期范围预设，日期值由原站计算。 | 已采集并定位DOM |
| pending-payouts | Pending Payouts | 待核佣金 | 锁定前核查转化和佣金，不表示已经锁定、立即付款或已到账。 | 已采集并定位DOM |
| outside-of-terms | Outside of Terms | 超出条款转化 | 超出合同条件的转化按官方规则自动撤销，可人工核查是否批准覆盖。 | 已采集并定位DOM |
| settings | Settings | 设置 | 原生设置菜单标签，不改写账户资料。 | 已采集并定位DOM |
| discover | Discover | 招募伙伴 | Discover产品入口，用于发现、查看和招募潜在合作伙伴。原英文保留在概念帮助。 | 已采集并定位DOM |
| transactions | Transactions | 交易记录 | 查看交易与佣金相关记录的导航入口。 已观察原生中文导航的完整旧译作为限定范围别名校准。 | 已采集并定位DOM |
| content | Content | 推广素材 | 真实导航是广告内容与素材入口，不是旧示例中的伙伴类型。 已观察原生中文导航的完整旧译作为限定范围别名校准。 | 已采集并定位DOM |
| edit | Edit | 编辑 | 配置当前项目表现组件的指标和图表，不执行编辑动作。 | 已采集并定位DOM |
| engage | Engage | 合作管理 | Engage产品入口；真实菜单含伙伴、内容、合同、交易与报告等合作管理功能。短中文避免窄导航溢出，原英文保留在概念帮助。 | 已采集并定位DOM |
| optimize | Optimize | 多维分析 | 按用户指定中文命名Optimize产品入口；官方用途为跨渠道、客户旅程及伙伴价值等多维报告分析，不表示自动执行优化，也不假设已订阅附加服务。 | 已采集并定位DOM |
| protect | Protect | 风险防护 | Protect产品入口涉及违规监测与转化风险防护，不局限于欺诈；可用功能以套餐为准。 | 已采集并定位DOM |
| dashboard | Dashboard | 仪表盘 | 品牌侧账户与推广表现的总览入口。 已观察原生中文导航的完整旧译作为限定范围别名校准。 | 已采集并定位DOM |
| campaign-manager | Campaign Manager | 营销活动管理 | 集中管理营销活动与创作者合作，不译成活动经理。 已观察原生中文导航的完整旧译作为限定范围别名校准。 | 已采集并定位DOM |
| amplification | Amplification | 付费推广 | 内容推广入口；具体投放平台与授权需在对应页面核验。 已观察原生中文导航的完整旧译作为限定范围别名校准。 | 已采集并定位DOM |
| refer-earn | Refer & Earn | 推荐奖励 | 原生推荐奖励入口：官方界面导览指推荐人脉使用impact.com获奖励，具体资格以功能页面规则为准。 已观察原生中文导航的完整旧译作为限定范围别名校准。 | 已采集并定位DOM |
| program-health | Program Health | 推广效果概览 | 按日期范围展示合作推广效果与趋势；中文明确模块用途，不是健康检查或固定评分。 | 已采集并定位DOM |
| recommended-partners | Partners you'll love | 推荐合作伙伴 | 仪表盘推荐可招募的潜在伙伴，不是已经合作的伙伴。 | 已采集并定位DOM |
| to-do-list | To Do List | 待办事项 | 仪表盘待办列表标题，实页存在但可能未展示。 | 已采集并定位DOM |
| show-compare | Show Compare | 显示对比 | 选择另一日期范围进行表现对比。 | 已采集并定位DOM |
| action-cost | Action Cost | 转化佣金 | 因带来转化而产生的伙伴报酬金额，不是佣金比例或平均每次转化成本（CPA）；不能据此推断已到账。 | 已采集并定位DOM |
| total-cost | Total Cost | 推广总成本 | 官方报表口径为Action Cost+Click Cost+Other Cost；短标签适配真实指标窄卡，仍含转化报酬、点击报酬及奖金/补偿/展示位费等，不等于全部经营成本或平台账单。 | 已采集并定位DOM |
| extra-large | Extra Large | 超大型 | 潜在伙伴的规模等级；不是服装尺码或已保证的收益。 | 已采集并定位DOM |
| apparel-category | Apparel, Shoes & Accessories | 服装、鞋履与配饰 | 推荐伙伴内容领域分类。 | 已采集并定位DOM |
| go-discover | Go to Discover | 前往伙伴招募 | 跳转到原生Discover，不改写链接地址。 | 已采集并定位DOM |
| notifications | Notifications | 通知 | 原生通知面板标题。 | 已采集并定位DOM |
| notification-settings | Notification Settings | 通知设置 | 原生通知设置入口。 | 已采集并定位DOM |
| hide | Hide | 收起 | 收起原生面板或通知控件。 | 已采集并定位DOM |
| search | Search | 搜索 | 原生全局搜索入口；不翻译搜索值或输入属性。 | 已采集并定位DOM |
| help | Help | 帮助 | 原生帮助入口。 | 已采集并定位DOM |
| welcome-back-prefix | Welcome Back,  | 欢迎回来， | 仅在真实欢迎语位置替换固定前缀；后缀姓名运行时原样保留且不写入字典。 | 已采集并定位DOM |
| deposit-holiday-reminder | Reminder: Deposit Processing Holiday | 提醒：假期暂停处理账户充值 | 仅校准充值处理提醒标题；未复核本次Pendo容器。 | 选择器待回归 |
| important-notice | IMPORTANT NOTICE | 重要通知 | 通知标题，不替换后续日期或资金信息。 | 选择器待回归 |
| deposit-holiday-prefix | Please note that no deposits will be processed on | 请注意：以下日期暂停处理账户充值： | 按完整文本节点匹配；后续日期节点保留原样。 | 选择器待回归 |
| deposit-holiday-suffix | due to public/company/bank holidays. Normal operations will resume on all other weekdays. | 上述安排因公共假日、公司休假或银行假日而设；其他工作日正常处理。 | 仅翻译完整说明节点，不推测停办日期。 | 选择器待回归 |
| yesterday | Yesterday | 昨天 | 原生日期范围预设，不自行计算日期。 | 已采集并定位DOM |
| this-week | This Week | 本周 | 原生日期范围预设，周起始规则由原站显示与设置决定。 | 已采集并定位DOM |
| last-week | Last Week | 上周 | 原生日期范围预设，不改变原站周范围。 | 已采集并定位DOM |
| last-seven-days | Last 7 Days | 最近 7 天 | 原生滚动日期范围预设。 | 已采集并定位DOM |
| last-fourteen-days | Last 14 Days | 最近 14 天 | 原生滚动日期范围预设。 | 已采集并定位DOM |
| last-month | Last Month | 上月 | 原生自然月日期范围预设。 | 已采集并定位DOM |
| this-year | This Year | 今年 | 原生年度日期范围预设。 | 已采集并定位DOM |
| clear-dates | Clear Dates | 清除日期 | 原生日期清除按钮标签，汉化本身不触发清除。 | 已采集并定位DOM |
| monday-today | (Mon - Today) | （周一至今天） | 只译预设的星期范围说明，不改日历日期。 | 已采集并定位DOM |
| sunday-today | (Sun - Today) | （周日至今天） | 只译预设的星期范围说明，不改日历日期。 | 已采集并定位DOM |
| monday-friday | (Mon - Fri) | （周一至周五） | 只译预设的星期范围说明，不改日历日期。 | 已采集并定位DOM |
| sunday-saturday | (Sun - Sat) | （周日至周六） | 只译预设的星期范围说明，不改日历日期。 | 已采集并定位DOM |
| nav-automation | Automation | 伙伴自动化 | 伙伴运营自动化分类，包含工作流、简报与动态细分；显示入口不等于已启用自动审批。 | 已采集并定位DOM |
| nav-surveys | Surveys | 伙伴问卷 | 向已合作伙伴或申请加入者收集资料，不是面向消费者的市场调查。 | 已采集并定位DOM |
| nav-groups | Groups | 伙伴分组 | 品牌侧管理用的分组，可用于条款、素材与定向沟通。 | 已采集并定位DOM |
| nav-contacts | Contacts | 伙伴联系人 | 合作联系信息入口，不翻译联系人姓名或邮箱。 | 已采集并定位DOM |
| nav-applications | Applications | 合作申请 | 含潜在伙伴加入申请及既有伙伴提出或还价的新条款，不是软件应用。 | 已采集并定位DOM |
| nav-proposals-sent | Proposals Sent | 已发合同提案 | 已发送的合同条款提案；发送不表示已经接受或生效。 | 已采集并定位DOM |
| nav-workflows | Workflows | 自动化工作流 | 依据条件处理伙伴申请或发送邮件的规则，不等于已启用。 | 已采集并定位DOM |
| nav-newsletters | Newsletters | 伙伴邮件简报 | 面向伙伴的定向邮件通讯，不是平台新闻。 | 已采集并定位DOM |
| nav-segments | Segments | 动态伙伴细分 | 按条件动态筛选的名单；细分本身不执行发信或审核。 | 已采集并定位DOM |
| nav-messaging-templates | Messaging Templates | 沟通消息模板 | 重复使用的伙伴沟通文案，不是合同条款模板。 | 已采集并定位DOM |
| nav-performance-reports | Performance | 绩效报告 | Reports下查看推广绩效的可展开分类，区别活动管理中的同名标签。 | 已采集并定位DOM |
| nav-recommended-by-meta | Recommended by Meta | Meta推荐内容 | Meta推荐的合作广告内容来源，不保证投放效果或已取得授权。 | 已采集并定位DOM |
| nav-amplified-content | Amplified Content | 付费推广内容 | 已投入预算的内容与Meta广告效果管理入口。 | 已采集并定位DOM |
| nav-data-lab | Data Lab | 自定义报表 | 按需要组合数据与可视化建立报告，不是上传数据的实验室。 | 已采集并定位DOM |
| nav-saved | Saved | 已保存报表 | 已保存报告入口，不修改原站配置或名称。 | 已采集并定位DOM |
| nav-scheduled | Scheduled | 定时报表 | 按时间计划生成或发送的报告，不是待生效合同。 | 已采集并定位DOM |
| nav-more-reports | More Reports | 全部报表 | 报告目录入口，具体可见报告以权限为准。 | 已采集并定位DOM |
| nav-by-partner | by Partner | 按合作伙伴 | 按伙伴维度查看绩效，不修改伙伴名称。 | 已采集并定位DOM |
| nav-by-day | by Day | 按日期 | 按日查看绩效，不修改日期值。 | 已采集并定位DOM |
| nav-by-ad | by Ad | 按广告素材 | 按素材维度查看绩效，不是投放平台设置。 | 已采集并定位DOM |
| nav-advanced-action-listing | Advanced Action Listing | 转化明细报表 | 逐笔查看详细转化记录，不是操作按钮清单。 | 已采集并定位DOM |
| nav-actions | Actions | 转化记录 | Transactions及待核佣金的记录入口，与Dashboard转化量汇总区分。 | 已采集并定位DOM |
| nav-inquiries | Inquiries | 转化补单申请 | 伙伴提交未正确跟踪订单的核查申请，不是一般客服咨询。 | 已采集并定位DOM |
| nav-test-actions | Test Actions | 测试转化 | 验证跟踪集成的测试转化，不当作真实业绩。 | 已采集并定位DOM |
| nav-at-risk | At Risk | 风险转化待核 | 需要核查的高风险转化；风险标记不等于已认定欺诈或已经付款。 | 已采集并定位DOM |
| nav-ads | Ads | 广告素材 | 供伙伴推广使用的广告及跟踪链接素材。 | 已采集并定位DOM |
| nav-data-posts | Data Posts | 数据提交转化 | 服务端提交有价值数据，由品牌核验后记录转化；常见于线索收集。 | 已采集并定位DOM |
| nav-widgets | Widgets | 推广组件 | 供伙伴展示或接入的可嵌入组件，不是Dashboard指标卡。 | 已采集并定位DOM |
| nav-resources | Resources | 推广资源 | 供伙伴使用的说明或推广资源，不改自定义资源名称。 | 已采集并定位DOM |
| nav-deals | Deals | 优惠活动 | 伙伴可宣传的促销优惠，不是交易记录或佣金。 | 已采集并定位DOM |
| nav-promo-codes | Promo Codes | 优惠码 | 优惠码管理入口，优惠本身与跟踪归因配置需分别核对。 | 已采集并定位DOM |
| nav-products | Products | 商品管理 | 商品目录与优惠的分类，不是四个产品切换入口。 | 已采集并定位DOM |
| nav-requests | Requests | 伙伴请求 | 推广内容区的伙伴请求，具体类型以页面为准。 | 已采集并定位DOM |
| nav-product-catalogs | Product Catalogs | 商品目录 | 向伙伴提供商品数据的目录，不是浏览器收藏目录。 | 已采集并定位DOM |
| nav-product-promotions | Product Promotions | 商品优惠信息 | 向伙伴商品feed、API及市场分享特惠，不等于调整合同佣金。 | 已采集并定位DOM |
| nav-template-terms | Template Terms | 合作条款模板 | 预设合作事件、佣金与锁定等条件，伙伴接受后形成具体合同，不是页面模板。 | 已采集并定位DOM |
| nav-custom-terms | Custom Terms | 自定义条款 | 附加到模板的品牌补充条款，不是另一种模板类型或自动调佣规则。 | 已采集并定位DOM |
| nav-changes | Changes | 合同变更 | 合同菜单中的条款变更，不是未保存编辑或转化修正。 | 已采集并定位DOM |
| nav-find-partners | Find Partners | 寻找合作伙伴 | 伙伴市场与创作者搜索入口，不表示已经签约。 | 已采集并定位DOM |
| nav-prospects | Prospects | 潜在合作伙伴 | 纳入招募跟进的潜在伙伴，与已接受合同的伙伴区分。 | 已采集并定位DOM |
| nav-extended-search | Extended Search | 全网拓展搜索 | 自动从平台内外按关键词寻找伙伴，不是普通站内筛选。 | 已采集并定位DOM |
| nav-social-listening | Social Listening | 社交内容监听 | 跟踪关键词、话题与提及，发现社交讨论及创作者内容，不是录音监听。 | 已采集并定位DOM |
| nav-partner-marketplace | Partner Marketplace | 合作伙伴市场 | 搜索可招募伙伴的市场，不是已合作伙伴列表。 | 已采集并定位DOM |
| nav-creator-search | Creator Search | 创作者搜索 | 寻找潜在创作者，不假设结果都已加入平台或合作项目。 | 已采集并定位DOM |
| nav-my-searches | My Searches | 我的搜索任务 | 已创建拓展搜索任务，不是浏览器历史。 | 已采集并定位DOM |
| nav-all-results | All Results | 全部搜索结果 | 拓展搜索结果不表示已通过合作审批。 | 已采集并定位DOM |
| nav-participation-value | Participation Value | 参与贡献价值 | 观察伙伴在转化触点中的参与价值，不等于已获佣金。 | 已采集并定位DOM |
| nav-payout | Payout | 佣金归因 | Optimize中的归因与佣金分配分析分类，不是实际付款入口。 | 已采集并定位DOM |
| nav-audience | Audience | 客户分析 | 客户价值与转化行为报告分类，不是只查看社交粉丝量。 | 已采集并定位DOM |
| nav-funnels | Funnels | 转化漏斗 | 转化路径及多步骤事件漏斗的报告分类。 | 已采集并定位DOM |
| nav-contribution | Contribution | 伙伴贡献分析 | 区分引入、影响、促成成交与独立触点；参与不等于赢得归因。 | 已采集并定位DOM |
| nav-leapfrogging | Leapfrogging | 归因抢占 | 最后点击下后出现伙伴可能越过前序贡献伙伴赢得归因；报告不等于已认定作弊。 | 已采集并定位DOM |
| nav-crediting-concerns | Crediting Concerns | 归因合理性 | 比较同一路径两方参与与获归因以核查报酬分配，不是正式申诉受理页。 | 已采集并定位DOM |
| nav-customer-value | Customer Value | 客户价值 | 官方当前报告侧重新客群在评估期内的购买与复购价值，不能只等同单笔成交额。 | 已采集并定位DOM |
| nav-behavior | Behavior | 转化行为 | 按伙伴、素材或优惠维度分析客户转化行为，不是伙伴操作日志。 | 已采集并定位DOM |
| nav-top-paths | Top Paths | 常见转化路径 | 最常见的触点顺序，不保证最优，需注意报表路径范围限制。 | 已采集并定位DOM |
| nav-events-funnel | Events Funnel | 事件转化漏斗 | 按伙伴查看多步骤转化事件的逐步完成与流失。 | 已采集并定位DOM |
| nav-monitoring | Monitoring | 合规监测 | 付费搜索及优惠码的推广合规监测分类。 | 已采集并定位DOM |
| nav-violations | Violations | 违规记录 | 需处理的监测违规记录，是否确认以具体记录及处理状态为准。 | 已采集并定位DOM |
| nav-event-risk | Event Risk | 事件风险 | 评估点击和转化中的非人类可疑活动，不是财务余额风险。 | 已采集并定位DOM |
| nav-paid-search | Paid Search | 付费搜索监测 | 监测伙伴搜索广告及商标竞价合规，不是创建搜索广告投放。 | 已采集并定位DOM |
| nav-promo-code | Promo Code | 优惠码监测 | Protect下的合规监测，区别Content中管理优惠码。 | 已采集并定位DOM |
| nav-policies | Policies | 监测规则 | 合规监测使用的规则，不是平台政策公告。 | 已采集并定位DOM |
| nav-risk-review | Risk Review | 风险复核 | 核查风险转化有效性，插件不会代为批准或拒绝。 | 已采集并定位DOM |
| nav-scoring-filtering-settings | Scoring & Filtering Settings | 风险评分与过滤设置 | 评分与点击过滤的相关设置；评分不等于确认欺诈，不代改设置。 | 已采集并定位DOM |
| nav-alerts | Alerts | 风险提醒 | 事件风险提醒，不是浏览器弹窗警告。 | 已采集并定位DOM |
| nav-risk-by-partner | Risk By Partner | 按伙伴分析风险 | 按伙伴查看风险信号，不等于宣布伙伴作弊。 | 已采集并定位DOM |
| nav-action-risk | Action Risk | 转化风险 | 转化级风险信号，不是按钮操作风险。 | 已采集并定位DOM |
| nav-domain-risk-details | Domain Risk Details | 域名风险明细 | 域名层面的风险细节，不修改域名或URL。 | 已采集并定位DOM |
| nav-same-ip-actions | Same IP Actions | 同IP转化记录 | 共享IP的转化线索，不能仅凭同IP认定欺诈。 | 已采集并定位DOM |
| nav-conversion-spoofing-rules | Conversion Spoofing Rules | 伪造转化校验规则 | 订单ID与转化页URL模式校验规则；修改需按官方要求联系支持。 | 已采集并定位DOM |
| nav-performance-campaigns | Performance | 效果营销活动 | Campaign Manager下的A标签对应效果营销活动管理，区别Reports下可展开Span的绩效报告分类。 | 已采集并定位DOM |

## 待验证与未翻译范围

| 项目 | 当前状态 | 所需证据 |
| --- | --- | --- |
| 0.4.1帮助/财务下拉栏框 | 32/32真实站点与MV3验收通过 | Help 6/6，财务卡片与入口15/15，报告3/3、文档2/2、设置6/6；原Text、数值、日期后缀和链接属性保留，英文恢复、刷新与原生展开通过。 |
| 0.4.1机制与MV3控制 | 机制26/26、顶栏机制6/6、MV3控制6/6重新运行通过 | 合成宿主验证动态菜单、严格范围、原生事件和双开关；与本轮真实顶栏验收分开。 |
| 0.5.1财务正文与问号 | 已收录437条/24主题；完整验收未完成 | 付款方式单入口1/1；完整15入口、5深状态及2财务原生回复待验。 |
| 0.4.0新词条与侧边栏覆盖 | 覆盖契约检查、机制与真实侧栏验收通过 | 4产品、20组展开菜单；87实际英文标签对应88个严格scope条目。 |
| 0.4.0独立开关与拖动 | 机制26/26及MV3控制6/6报告通过 | 合成宿主验证四种组合、问号、草稿保护、拖动不误触、刷新位置重置；不替代实网检查。 |
| 0.4.0已登录实网与原生问答 | 新浏览器完整范围六项PASS，另登录PASS | site/sidebar/dom/residuals/date/ai；37/61个Text变化、0替换、0数值变化，限定长句/日期英文残留0。 |
| 0.3.1独立合成DOM测试/脱敏检查 | 20/20、4/4通过 | 机制与脱敏检查；不能替代实网证据。 |
| 0.3.1已登录英文实网扩展回归 | 新配置6/6通过 | 仅限报告所列真实Dashboard、日期及Actions原生问答；37/61个Text变化，0节点替换、0数值修改。 |
| 0.3.1精炼标签 | 英文原站实网通过 | 已核实英文指标基线并加载本版词典；中文标签保留原DOM与数据。 |
| 9个原生中文别名 | 合成DOM单元通过；原生中文实网待回归 | 完整别名只在已核实导航scope校准，不将英文实网结果扩大为中文模式验证。 |
| 42个局部概念主题 | 关联契约与已显示侧栏问号通过；回答未全部验证 | 原15个加27个必要侧栏概念保持不变；历史0.4.0仅Template Terms自动回答实网通过，0.4.1本轮未发送AI问题，不宣称42/42。 |
| 局部问题→原生Ask Impact | 0.4.0仅Template Terms一个概念自动问答实网通过 | 问号点击1次、自动发送1次、无用户介入；新增929字符中文回复与1个官方条款模板/合作合同链接。 |
| app.impact.com | 未进行已登录生产域验收 | 共享结构适配不等于生产账户加载扩展后已经通过。 |
| 财务范围外的其它业务正文 | 待独立采集验收 | 侧栏覆盖不表示其所有业务表格和流程均已覆盖。 |
| Pendo充值假期提醒 | 选择器待回归 | 重新出现时核对原文节点与日期保留。 |
| 其它页面、iframe、封闭Shadow DOM | 未验证 | 独立采集上下文；不能把开放Shadow DOM验证扩大到封闭根。 |
| 未收录长句、名称、金额/日期/ID、原生属性与用户消息 | 保留 | 后续词条逐项校准，用户与业务数据保持原值。 |

历史示例、整页帮助及其它版本报告不能自动作为本版未覆盖项目通过的证据。新增词条和主题要同步修改原因、官方依据及关联ID；测试失败由主协调者交回同一Developer继续修复，登录/权限/原生AI不可用标记BLOCKED。

版本记录见 [CHANGELOG.md](CHANGELOG.md)。

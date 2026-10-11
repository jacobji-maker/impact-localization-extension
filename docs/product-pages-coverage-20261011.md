# 产品正文当前覆盖

2026-10-11，当前0.5.5，1230词条/111主题（含历史demo）。第二批新增210条/20主题，涉及23个实际document范围；没有把词条数或列表/空态覆盖当作全站完成。

| 产品 | 第二批范围 | 当前可见限制 |
| --- | --- | --- |
| 多维分析 | Leapfrogging、Behavior、Top Paths筛选；Crediting Concerns、Customer Value、Events Funnel固定错误提示；Contribution沿用第一批 | 7入口均查看，后三页默认Problem Running Report；没有结果覆盖 |
| Protect | Paid Search空态、Policies、Violations、Risk Review、Click Filtering Shadow说明、Custom Notifications | Promo Code Monitoring订阅未激活，只翻不可用提示；未创建政策/提醒或改过滤设置 |
| Engage报表 | Data Lab图表类型、Saved、Scheduled、More Reports目录 | 仅入口/目录固定界面，没有逐报表查询 |
| Engage交易 | Actions筛选、Action Inquiries和Test Actions列表 | 未上传处理结果、启动测试或修改转化 |
| Discover | Extended Search的My Searches/All Results两页Shadow空态 | 未创建搜索，结果内容未见 |
| 财务 | Finalized Payouts固定标题补实际h3范围及单概念主题 | 用户明确demo不会有查询/待付款结果，付款账户不属于用户；财务暂放下 |

## 必要检查与交付

- 重新识别Chrome和demo登录会话。0.5.4原安装来自dist解压目录，保留并停用；0.5.5已从工程impact-cn-mod/加载并刷新。两个开关ON，只有顶层一个助手。
- 实页短检查确认Extended Search Shadow、Data Lab和More Reports frame、Paid Search frame的中文；关闭翻译恢复英文，AI问号保留。关闭AI时frame问号移除，中文保留；再次刷新两个状态仍ON。重载扩展后旧页面未能保存开关的临时状态已通过刷新消除，没有改开关机制。
- 发现监控iframe.src会重定向：Paid Search、Violations、Policies、Promo四页词条改按实际/secure/compliance/view/对应controller精确路径；顶层路径和原data u保留。Social实际document仍为data路径。数据实验室和报表目录补各自实际正文根。
- 顶层Extended Search与Paid Search frame问号均触发原生Ask Impact发送，未保存完整对话，没有逐主题回复或官方链接验收。
- 变更dict/background/site-config语法、版本、唯一ID、1230/111关联、新scope与计数必要静态检查通过。当前最终字典worker隔离VM 8项定点检查通过：3 Protect及1 Social正向、发送方/域名/顶层u/无关主题拒绝。非实网负例验收。
- ZIP：dist/impact-cn-mod-0.5.5.zip，170119 bytes，12个文件，SHA256 `a3491ff1376e1f7d45c94796af59f4b78cb13b64d9405687ac8a72e151aa0468`；根manifest/资源/CRC/源码字节一致与凭据、会话模式检查通过。
- 未跑全量回归，未擅自Git提交。历史0.5.2财务13 PASS / 2 FAIL与0.5.3原生菜单style.left严格属性FAIL保持原报告。

## 继续范围与账户限制

Marketplace All Partners和Creator更多筛选、Ads九枚举精准范围、Relationship Stage/State计数、内部弹窗/未提交表单及非财务报告结果尚待实际采集；app.impact.com未实网检查。未进入范围不称不可访问。Products未显示导航；Refer & Earn此时为空白嵌入；社交推广需连接账户；Promo监控订阅未激活。Legal/Billing/Funding本次没有编辑或Actions入口；财务后续不查询、不选择付款账户、不追查结果，保留已采集固定文案。Subscription和Automatic Payments历史不可用/禁用记录不作为本轮前置任务。

以下保留0.5.4当时的采集、锁屏中断与交付记录，后续已完成的步骤以上方0.5.5结果为准。

# 0.5.4 第一批覆盖（历史）

2026-10-11，源码0.5.4。新增321条词条、25个主题，当前1020条/91主题；包含历史demo，规则数不表示全站完成。29个实际document路径中，24个Engage、4个Discover、1个多维分析报告。

| 产品 | 本轮页面 | 收录范围 |
| --- | --- | --- |
| Engage 伙伴管理 | My Partners、Surveys、Groups、Contacts、Applications、Proposals Sent | 已观察固定标题、控件、筛选器和表头；Groups另含未提交创建表单 |
| Engage 自动化 | Workflows、Newsletters、Segments、Messaging Templates | 固定标题、创建按钮、筛选器与表头 |
| Engage 活动与付费推广 | Campaign Manager、Recommended by Meta、Amplified Content | 活动固定状态；推广两页当前只显示连接社交账户提示，没有执行连接 |
| Engage 素材 | Ads、Data Posts、Widgets、Resources、Deals、Promo Codes、Requests | 固定标题、类型、控件及表头；不翻素材/优惠码/资源业务行 |
| Engage 合同 | Template Terms、Custom Terms、Contracts、Changes | 固定标题、筛选器与表头 |
| Discover | Marketplace、Creator Search、Prospects、Social Listening | 已观察首页/搜索空态/筛选器/表头；Social Listening仅设置提示，实际同域frame独立处理 |
| 多维分析 | Contribution | Apply与6个固定筛选前缀；结果和原生提示尚未核对 |

复杂概念复用或新增独立主题，包括合同阶段、合作关系阶段、推广渠道、业务模式、伙伴规模、动态细分、促销码匹配和归因规则、跨受众变现、互动率与社交受众规模。官方Brand HelpDoc用于语义校准，预设问题要求对应官方链接；没有逐主题实网AI验收。

## 本批检查

- 开始时真实Demo会话已登录，助手显示0.5.3，两个开关均开启。为采集原文将精细翻译暂时关闭，AI开关仍开启。
- 已观察实际固定Text、document路径、必要route/handle/u、正文组件及开放Shadow宿主；固定文案片段进入字典，没有保存业务行、输入值或完整AI对话。
- 新源码语法、版本、唯一ID、词条/主题双向关联及scope核对通过；最终0.5.4源码/1020条字典的Social frame转发9项VM定点合成检查（demo/app正向，发送方/来源/顶层参数/主题等拒绝）通过。非实网转发结果。
- 交付前用既有Python打包器生成ZIP，再核对根manifest、资源、CRC、源码字节一致和敏感内容。
- 包：dist/impact-cn-mod-0.5.4.zip，153412 bytes，12个扩展文件；SHA256 `2f1bee3d121b9a9f871b7a929bc82fcc6019cd2820c73406e39513e026661643`。
- 新版实页翻译/恢复、两个开关与必要问号检查尚未完成：Contribution只读Apply弹出alert后Mac锁屏，工具无法读取提示或继续操作；已请求用户手动解锁。
- 开始时扩展管理页内容未能读取，实际加载路径未确认；0.5.4尚未重新加载到浏览器。

## 0.5.4当时的继续范围（历史）

1. 解锁后先关闭Contribution原生提示，确认加载路径为本工程impact-cn-mod/，重新加载0.5.4并刷新；恢复精细翻译开启，保持AI开关独立。
2. 简查本批页面翻译/恢复及一个顶层、一个Social frame问号通路，不做逐主题验收或全量回归。
3. Engage剩余Reports、Transactions、Products、Refer & Earn及内部表单/弹窗；Discover Marketplace的All Partners筛选、Extended Search两页完整固定提示/内容及创作者其它可见条件。
4. Ads Status/Last Updated固定选项需先补准确筛选组件范围；计数标签State及Relationship Stage需核对单Text拆分后补漏。
5. 继续多维分析剩余报告和Protect实际导航，再补Legal/Billing/Funding未提交表单及Upcoming/Cash只读报告状态。

本轮未完成上述剩余导航，因此不能把未进入的页面称为不可访问。当前已知受账户限制的范围仍为历史Subscription不可用、Automatic Payments禁用；社交推广需连接账户才能显示更多正文。app.impact.com未实网检查。

历史0.5.3菜单严格属性FAIL和0.5.2完整财务13 PASS / 2 FAIL保持原报告，不改写。本轮没有全量测试，没有提交Git，没有执行业务保存/充值/转账/上传/删除。

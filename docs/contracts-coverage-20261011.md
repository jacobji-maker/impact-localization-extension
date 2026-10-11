# 0.5.6 合同覆盖清单

更新：2026-10-11。本轮按用户要求集中查看demo账户的Demo GC Retail合同界面，采用功能与汉化优先、直接受影响范围短检查的节奏。当前1720词条 / 131主题，比0.5.5新增490条 / 20主题；其中259条是规则字段的固定选项标签。总数含历史demo，不代表全部合同流程、全站或逐主题问答完成。

## 本轮实际覆盖

| 页面或控件 | 已补固定文案 |
| --- | --- |
| 合作条款模板列表 | Active / Pending校准为“生效伙伴 / 待确认伙伴”；Upcoming Schedules校准为“即将开始的佣金安排”，独立配置限定期间佣金安排问号 |
| 未提交Create Template Term主表单 | 事件类型、默认佣金、佣金分组/调整/绩效奖金/限制、次数与金额限额、转化锁定、佣金付款计划、归因规则/有效期/优先级组及固定说明 |
| 高级设置 | 变更通知期、撤销转化规则、转化次数上限、佣金总额上限、保底收益、广告位费用、伙伴跟踪像素、数据中心来源点击及固定提示 |
| New Payout Group弹窗 | 固定字段与运算符、259个已观察规则字段选项标签；短词精确限定到本表单/弹窗控件 |
| 合同列表筛选 | Template / Partner固定筛选标题、State筛选选项及经过校验的计数模板 |
| 自定义条款创建空表单 | Text / PDF输入方式、类型枚举、固定标签与计数、编辑器固定工具栏；未编辑正文或上传文件 |

只修改既有Text节点；现有业务行、名称、状态值、金额、日期、业务ID、原生输入值和AI回复保持原样。规则字段名称翻译仅用于已观察固定选项标签，不翻业务记录或输入值。Reversal / returns在本表单中指撤销转化及其佣金处理，不能译作商品退货。保底收益按月核算最低每次点击收益，不把核算周期误写成到账日期。

## 实页短检查进度

- 启动时重新核对发现，原启用0.5.5实际来自 `dist/impact-cn-mod-0.5.5/`，此前交接写成源码加载不准确。已停用并保留该安装，现启用实际源码 `impact-cn-mod/` 的0.5.6，最终源码已reload，两个开关ON。
- 主创建表单和佣金规则弹窗已确认中文；关闭翻译恢复原文，原生值相同。翻译OFF时AI仍ON，开关独立。未做全量回归或逐主题检查。
- Action Locking单概念问号已通过原生Ask Impact发送，问题要求官方帮助链接；未保存完整对话或回复内容，不宣称所有主题回复验收通过。
- 合同列表新增表头和State筛选计数已现场确认中文。末次定点修补已完成：State选项菜单预先挂载，打开时只改变原生IUI按钮class，现沿用schedule重扫既有下拉portal，并以已观察 `display:block` 限定当前打开菜单；Custom创建流程的execution为动态标识，39条词条已移除误用的 `execution=clear`，继续以精确document和form组件限制范围。
- 最终源码重载后，State7个固定枚举已现场中文，关闭菜单后原筛选选择与计数（2）保持；Custom动态空表单名称/类型/输入/内容标签、7个类型枚举、Text/PDF、字符数0/字词数0以及选择文件/拖放提示已中文确认。未编辑文本、未上传，已导航离开空表单。这是本轮直接受影响范围短检查，未新增全量回归或逐主题验收。
- 未点击Save、Save and Send或最终创建；佣金规则弹窗与未保存创建表单已取消。未修改已有数据，没有保存或创建记录；自定义条款未编辑内容、未上传。
- 0.5.6基础语法、版本一致性、1720词条/131主题计数及词条主题双向关联检查已通过；未跑全量测试。

## 未进入范围与下一步

合同详情、发送步骤及已有合同变更流程尚未进入；本轮遵守不做最终保存/创建/发送的边界，不能称不可访问或全部完成。app.impact.com生产域未检查。下一轮先根据用户实际体验反馈修补，再补安全可浏览范围。

财务继续暂放下：本轮未查询财务、未选择付款账户或追查结果。Marketplace/Creator更多筛选、Ads枚举范围、Relationship Stage/State计数、其他内部弹窗和非财务报告结果仍是既有待补范围。0.5.5页面覆盖与检查记录保留于 [上一批清单](product-pages-coverage-20261011.md)，旧报告不改写。

## 交付包

已使用既有 `python3 scripts/package-extension.py` 生成 `dist/impact-cn-mod-0.5.6.zip`：12文件、194285 bytes，SHA256 `fd2e928dc8c31df5f48bc37069d3248549e52d5828b6ba6a72061e8c8346d809`。

根manifest/MV3、资源齐全（含popup引用）、CRC和源码逐文件字节一致检查全部通过。包仅含扩展12个静态运行/说明文件，不包含artifacts、docs、tests或demo；凭据特征扫描通过，新增固定词条已人工只读脱敏复核。5个JS语法、版本及1720词条/131主题双向关联检查通过。旧包和artifacts保留，本轮未提交。

## 官方概念参考

- [创建合作条款模板](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/template-terms/create-template-terms)：佣金、锁定/付款安排和高级设置。
- [归因优先级组](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/credit-groups-explained)：Preferred / Standard / Non-Preferred的归因优先级。
- [限定期间佣金安排](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/set-limited-time-payouts-with-scheduled-terms)：Scheduled Terms只调整佣金设置，其他条款沿用基础模板。
- [自定义条款](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/contracts/add-custom-terms-to-your-contracts)：Text / PDF输入及自定义附加条款概念。

历史财务结论保持原记录：最近完整15入口仍为0.5.2的13 PASS / 2 FAIL；0.5.3菜单严格属性检查仍FAIL，本轮未复检，不作为合同开发前置条件。

# 0.5.8 伙伴管理覆盖清单

更新：2026-10-11。本轮按用户新要求集中补Partner管理；源码0.5.8，2319词条 / 140主题，比0.5.7新增182条 / 5主题；必要静态检查通过，新版实页短查因锁屏未执行，ZIP必要核对已通过。总数仍含历史demo，不代表全部伙伴管理、合同或全站完成。前批0.5.7为2137词条/135主题；旧覆盖清单和检查结论保持原记录。

## 已安全查看范围

| 范围 | 本轮实际观察 |
| --- | --- |
| My Partners列表与总菜单 | 固定标题/控件、全局3项管理菜单 |
| 筛选 | Contract Stage的16项与Relationship的3项固定枚举；关系标签和计数原生分开，未改数；Custom Fields侧栏固定标题、结果、重置和自由答案搜索说明 |
| 伙伴行管理 | 10个管理入口；合同7项和Tracking6项子菜单 |
| 单伙伴合同 | 查看条款、终止合同未提交表单，已取消 |
| 自定义追踪值 | 3个伙伴追踪值的固定字段；原值保持 |
| 邀请 | 活动与问卷邀请弹窗，仅观察后关闭 |
| 伙伴追踪集成 | Integration列表及Add Postback未提交表单，已取消 |
| Client Cost | 未保存表单固定标签，已关闭 |
| Account Manager | `/secure/advertiser/mediapartners/adv-mediapartner-contact-flow.ihtml` 固定负责人、选择负责人、共享邮箱/电话说明和Save；未改字段 |
| Manage Account Links | `/secure/advertiser/mediapartners/mp-manage-links-flow.ihtml` 七个固定表头、Create Link未提交关联表单（Select Partner / Reason For Linking / Select / Link），已关闭 |
| Message | 实际 `#sb_widget #NEW_CHAT` 的Send与四菜单项：View in Inbox / Mark as unread / Move to spam / Unmark as priority；只翻控件，不读写消息，已关闭 |
| Groups | 创建表单固定控件；原0.5.6部分已译，本轮补Partner group name固定header，未提交 |
| Contacts | 空表单头像/格式与5MB、外部托管图片、姓名/电话/邮箱/联系信息/关联账户/标签/职务/Select/Save；未填值或上传，已关闭 |
| Discover返回同一伙伴列表 | 21个已观察既有列表词条扩展至 `/secure/advertiser/discover/radius/fr/partner_ui.ihtml`；空态未观察，不扩展 |
| Compliance Settings | 菜单固定文案；实际frame `/cmplnc_mediapartner-settings.ihtml` 显示Page Not Found，没有设置表单覆盖 |

上表仅包含主Agent确认实际进入的范围。上表代表真实页面采集，不代表0.5.8中文命中/恢复或问号通路已通过。

新增5个单概念主题为自定义追踪值、客户费用、Postback（事件回传）、直接流量追踪、伙伴合规设置；主题配置不表示逐项原生问答已验收。

Add Postback已观察固定字段包括Action Tracker、Event Trigger（When credited / When involved / Always）、HTTP Method（Get / Post）、Body Format（Query String / JSON / XML）、Minimum Delay、Maximum Requests per Second和Success / Error Response；实际接收URL、请求体、追踪值及选择状态保持原样。

## 操作与数据边界

所有表单未修改或选择业务值，未保存、发送、Create、Delete、Link、上传或发出测试请求；没有新增或修改伙伴数据。Suspend不点击，Tracking中的Pending Payouts属于暂放下的财务范围，只翻固定菜单，不点击或查询。

Custom Fields的自定义字段名称和答案是业务内容，全部保留；只处理固定标题、结果、重置和自由答案搜索说明。Relationship固定标签与计数原生分开，未改变数字。名称、联系人、金额、日期、业务ID、组名、输入值、URL、请求体、历史沟通和AI回复均保持原样，不记录私人业务内容或会话。

详情Groups和Assigned To只展开不选择：官方说明选择即分配但未列Save，可能即时更新是操作边界的推断。Postback Save会保存推送配置，Launch Test / Start test会向接收URL发请求，均未执行。追踪链接最终Create、合作记录Add、联系人Save、邀请Send同样未执行。

## 检查与交付进度

- 源码0.5.8：2319词条 / 140主题，新增182条 / 5主题。
- 静态通过：dict/site-config语法、四处版本一致、唯一词条/主题ID与主题回链、新增182条限定scope；scope_review窄审无问题。必要包敏感模式检查通过，不沿用旧结果。
- Mac仍锁屏；当前运行页面0.5.6、两个开关ON，实际加载目录本轮未能重核。
- 0.5.8伙伴管理中文、原文恢复及必要问号实页短查：未执行，不记PASS。
- ZIP已生成：12文件、222471 bytes，根manifest/MV3/version、资源引用、CRC、全部源码字节一致、仅运行/说明文件及必要敏感模式检查通过。
- 未运行全量测试、逐主题AI验收或财务查询。

## 未检查与接续

用户解锁后先重新核对实际登录、唯一启用扩展目录、运行版本和两个开关，重载工程impact-cn-mod的0.5.8并刷新，只检查本轮直接受影响伙伴管理范围。最终保存、邀请、发送、创建、暂停、合同终止和测试请求的业务结果不在本轮范围。

0.5.7合同菜单新版实页未验证记录保留于 [上批菜单清单](contracts-menu-coverage-20261011.md)；0.5.6合同记录见 [历史合同清单](contracts-coverage-20261011.md)，0.5.5页面记录见 [历史页面清单](product-pages-coverage-20261011.md)。不将已查看等同汉化已通过；不称所有管理入口、合同或全站完成。app.impact.com生产域未检查。

其他Marketplace/Creator更多筛选、Ads精准枚举、内部弹窗及非财务报表结果仍待补。财务继续暂放下，不查询、不选择付款账户。最近完整财务报告仍为0.5.2的13 PASS / 2 FAIL；0.5.3严格菜单属性FAIL保留，不作为功能开发前置条件。

## 官方概念参考

- [伙伴管理菜单及合规设置](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/reach-out-to-partners/partner-management/manage-my-partners)。
- [合作阶段、合同阶段及详情字段](https://help.impact.com/brand/what-would-you-like-to-learn-about/performance-program/recruiting-partners/prospective-partners/view-prospective-partners)。
- [伙伴分组](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/reach-out-to-partners/partner-groups/create-and-manage-partner-groups)。
- [自定义追踪值](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/tracking/set-up-tracking/assign-custom-tracking-values-to-partners)。
- [Postback配置](https://help.impact.com/partner/what-would-you-like-to-learn-about/platform-features/action-management/event-notifications-and-postbacks/set-up-action-lifecycle-postbacks)。
- [直接流量追踪](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/tracking/set-up-tracking/set-up-direct-traffic-tracking)。

## 交付包

已使用既有 `python3 scripts/package-extension.py` 生成 `dist/impact-cn-mod-0.5.8.zip`：12文件、222471 bytes，SHA256 `5a6c2d58122a2f4d742b0349e4061db9f24bf32e9b201ff43bcc6b6bb4d35485`。

根manifest/MV3/version、资源引用、CRC、全部源码字节一致、仅运行/说明文件及必要敏感模式检查通过；必要检查摘要位于 `artifacts/partner-management-20261011/package-check-0.5.8.json`。源码及包内说明已冻结；当前实页仍0.5.6 ON/ON，加载目录未核，0.5.8中文、OFF恢复和5新主题未实页验证。

ZIP解压后在Chrome开发者模式加载含manifest的目录，或重载工程 `impact-cn-mod/` 的0.5.8再刷新。HEAD复核仍70fe322；未提交，未commit/reset/stash或清理旧dist/artifacts与报告。

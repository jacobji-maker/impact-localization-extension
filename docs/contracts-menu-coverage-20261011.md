# 0.5.7 合同模板菜单覆盖清单

更新：2026-10-11。本轮根据用户体验反馈补合作条款模板列表右侧三点菜单及对应界面，继续只浏览、展开和查看未提交表单。源码0.5.7，2137词条 / 135主题，比0.5.6新增417条 / 4主题，其中259条为Schedule开放Shadow同源规则字段的范围扩展。总数含历史demo，不代表全部合同或全站完成。基础静态检查已通过；8入口/2分支均在0.5.6下安全采集，锁屏阻断0.5.7实页短查。按早交付偏好先交源码/包，0.5.7ZIP必要核对已通过，不以0.5.6历史结果替代本轮检查。

## 本轮实际查看范围

| 菜单或分支 | 实际查看范围 |
| --- | --- |
| View Terms | 条款查看界面 |
| View Scheduled Terms | 限定期间佣金安排查看界面及创建Schedule未保存表单；遍历实际开放Shadow DOM |
| Modify Terms | 修改条款未提交界面 |
| Add Partners | 添加伙伴未提交界面 |
| Expire all Partners | 当前模板下全部伙伴的合同到期/终止未提交界面 |
| Switch Terms for all Partners | 两个子分支：Switch to existing contract和Switch to new contract，以及各自未提交界面 |
| Modify Settings for all Partners | 当前模板下全部伙伴合同设置的未提交界面 |
| Get Branded Links | 品牌专属链接查看界面；实际链接值保持原样 |

两处用户用词调整已入源码：Payout Groups主标签“分组设置佣金”，相关开关“按自定义分组设置佣金”、新分组“新建佣金分组”；after end of the month为“（从下个月月初开始）”。付款周期选择器原生实际只有两项，旧四项限定漏译，已按 `DIRECTLY_AFTER` / `AFTER_END_OF_MONTH` 修正。

Schedule创建表单中的固定文案、开放Shadow DOM及259个规则字段复用既有映射补覆盖。固定英文、短词和可校验计数按实际document、查询、控件及Shadow宿主限定，不做全局短词替换。新增4个单概念主题为条款确认方式、到期后适用条款、终止伙伴合同、品牌专属注册链接；主题配置不代表逐项问答验收。

上述入口与切换两个分支是在0.5.6下安全采集；0.5.7新菜单/用词/Scheduled中文、恢复及新问号尚未实页验证，不能记PASS。这里只记录实际浏览范围，不把采集或静态通过等同新版实页通过。

## 操作与数据边界

未保存、发送、Submit、Expire或上传，没有新增记录或修改已有业务数据。未执行合同终止、切换、撤回提案/切换、撤销转化或伙伴招募。模板名称、伙伴信息、状态值、金额、日期、输入值和品牌链接保持原样，不落盘私人业务内容、会话或完整AI对话。

View Terms、View Scheduled Terms和Get Branded Links只查看；其他入口只到未提交操作界面。Save as a draft同样会新增记录，未执行。最终确认或提交后的业务效果不在本轮检查范围。

## 当前检查进度

- 两处用户用词调整已入源码；词条2137 / 主题135，比0.5.6新增417 / 4。
- 静态已通过：dict/content/site-config语法、4处版本一致，2137词条/135主题唯一ID及词条主题双向关联；新增417条窄审无实质selector/关联问题。
- 新版菜单/用词/Scheduled中文、恢复及新问号通路：锁屏阻断，尚未实页验证，不记PASS。
- 刷新后浏览器仍v0.5.6、两个开关ON；Chrome扩展详情/重新加载需解锁，当前实际加载路径未能本轮重核，不继承历史源码路径结论。
- 拟打包12文件的聚焦脱敏扫描无凭据、会话或实际业务ID路由命中；未跑全量测试。
- 0.5.7打包：已生成12文件/211518 bytes的ZIP，根manifest/MV3、资源与popup引用、CRC、源码逐文件字节一致及聚焦脱敏检查通过；这些包检查不等同新版实页通过。

## 未检查范围与接续

用户解锁后优先在Chrome扩展页核对/重载工程 `impact-cn-mod/` 的0.5.7并刷新Impact页面，只短查新增菜单/用词/Scheduled中文、恢复及必要新问号，不自动扩大验收。

没有执行任何最终提交，故不验收保存/发送/终止/切换后的结果；尚未完成全部合同流程或全站。app.impact.com生产域未检查。财务继续暂放下，不查询或选择付款账户；其他Marketplace/Creator更多筛选、Ads枚举范围、Relationship Stage/State计数及非财务报表结果待补。

0.5.6合同创建表单和规则字段覆盖及当批检查/ZIP摘要保留于 [上一批合同清单](contracts-coverage-20261011.md)，0.5.5页面记录保留于 [旧页面清单](product-pages-coverage-20261011.md)，均不改写历史结果。最近完整财务15入口仍为0.5.2的13 PASS / 2 FAIL；0.5.3菜单严格属性FAIL保留，不作为本轮开发前置条件。

## 交付包

已使用既有 `python3 scripts/package-extension.py` 生成 `dist/impact-cn-mod-0.5.7.zip`：12文件、211518 bytes，SHA256 `e877ad83ba49ad1f258cc7e6c3eff3876c20ce2b56c6d574400f4a076eed500c`。

根manifest/MV3、资源及popup引用、CRC、全部文件与源码字节一致、聚焦脱敏检查通过。源码与包内说明已冻结，本轮未提交。新版菜单/用词/Scheduled中文、恢复及新问号仍因锁屏未完成实页验证；刷新仍v0.5.6、两开关ON，实际加载目录本轮未重核。旧dist/artifacts保留，未经用户要求不提交、回滚、stash或清理。

## 官方概念参考

- [修改条款与全部伙伴合同设置](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/template-terms/modify-template-terms)。
- [限定期间佣金安排](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/set-limited-time-payouts-with-scheduled-terms)。
- [添加伙伴与品牌专属注册链接](https://help.impact.com/brand/what-would-you-like-to-learn-about/performance-program/recruiting-partners/invite-partners-to-join-a-brands-program)。
- [切换合同及到期衔接条款](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/contracts/replace-a-partners-contract)。
- [终止伙伴合同](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/contracts/expire-partner-contracts)。

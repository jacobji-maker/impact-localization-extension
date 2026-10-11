# 0.6.5 覆盖与必要检查

2026-10-11。6691 词条 / 146 个概念主题，本轮新增 884 条限定规则和 1 个主题。数量包含历史 demo，不表示全站验收；旧报告和交付物保留。

| 新增范围 | 条数 | 实际限定 |
| --- | ---: | --- |
| 效果营销活动 | 40 | 已观察的向导标题、选填/空选择、目标 9 项、类别 20 项、编辑器固定提示与校验报错；词数/字符数仅校验后的计数槽。 |
| 商品加佣活动 | 297 | 参与资格、预算截止和佣金适用期间、分组配置、259 个固定规则字段、6 个运算符、2 种佣金计算方式、优先级。字段和当前开放菜单关联；事件类型、伙伴名称、金额和输入值不处理。 |
| Data Lab 自定义报表 | 302 | 288 个实际标准字段及字段选择菜单、条件编辑器/5 个比较运算符、起始说明/添加字段提示/分享按钮。每个 frame 限定自身 document 和顶层 reportBuilder 路径；补实际独立条件弹层根节点。 |
| 合作申请 | 245 | 实际国家菜单 238 项及全选/清除、两个状态页签、申请日期/结束日期/自定义字段标签。国家菜单限定第 10 个固定筛选字段及原生 focused 按钮，不处理业务行和自定义字段名称。 |

“佣金条款优先级”新增单概念问号，要求原生 Ask Impact 提供官方链接；“分组设置佣金”复用现有主题。本轮没有发送 AI 问题。

语义依据：[创建商品加佣活动](https://help.impact.com/brand/what-would-you-like-to-learn-about/beta-product-boost/product-boost-campaign-management/create-a-product-boost-campaign)、[佣金规则](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/contracts-and-template-terms/template-terms/payout-adjustments/how-payout-rules-work)、[Data Lab 字段参考](https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/multi-program-reports/data-lab-custom-reports/create-custom-reports-in-data-lab)。实页优先级为 1–10；官方当前示例采用分级，未把实页数字范围写成官方规则。Data Lab CPC v1 是平均点击成本，v2 是应付点击佣金合计；Posted Datetime 是交易登记时间。少数风险/分发字段仅按固定标签保守翻译，不添加未确认的业务口径。

## 本轮实页与检查边界

- 已登录 Retail 页助手实际显示 v0.6.4；没有重复加载扩展或登录。使用独立观察页，用户原页保留。
- 效果营销活动填入临时预览文字及类别/招募人数后，原生下一步要求有效封面图片；没有上传，向导随后取消。因此参与资格之后的步骤仍未进入。
- 商品加佣活动通过原生下一步进入参与资格和佣金设置，展开未保存的分组规则/运算符/金额与百分比菜单，随后取消。没有创建活动、添加最终分组、选择资助账户或保存设置。
- Data Lab 仅新建未保存的可视化配置、展开字段和条件菜单；账户自定义指标、项目名称、日期、条件值和报表名称保留原样。没有保存、分享或发送报表，没有查询财务或进入 Pending Payouts。
- 必要检查包括 JS 语法、各版本元数据、唯一 ID、双向主题关联、新增 scope/数字槽、Git 差异和敏感模式。打包检查根 manifest、MV3/资源、CRC、ZIP/解压目录与源码字节一致。

交付：`dist/impact-cn-mod-0.6.5.zip` 与同名解压目录。打包后冻结扩展目录，旧包保留。0.6.5 实页翻译/关闭恢复/新问号发送待用户加载；未执行全量回归，`app.impact.com` 未检查。商品加佣预览及最终提交、效果营销活动封面图片后的步骤、其他未观察国家/语言控件仍待后续实际导航。

本节点按用户已有授权同步 0.6.2–0.6.5 已核对源码和说明到 GitHub main；实际提交/推送结果见 PROJECT_STATE.md，不纳入 artifacts/dist 或私人材料。

# 项目状态

更新：2026-10-11。当前版本 **0.6.5**，**6691 条词条 / 146 个概念主题**（含历史 demo；数量不代表全站验收）。本轮新增 884 条限定规则，补效果营销活动目标/类别、商品加佣资格与佣金规则、Data Lab 标准字段与条件编辑器、合作申请 238 项国家菜单和固定标签。

## 功能

- 本地翻译固定界面 Text，可关闭并恢复原文；保留原生页面、业务名称、数据、输入值和 AI 回复。
- 两个独立持久化开关、可拖动助手、概念问号、开放 Shadow DOM 与各 document 翻译；问号调用平台已有 Ask Impact 并要求官方帮助链接。
- Engage 已补伙伴管理、申请/提案、工作流、邮件、分组/联系人/调查、Retail Media、活动、九类素材与资源、Deals/Promo、商品目录/推广/Storefront、报表目录/Data Lab/计划及交易固定界面和已观察的未提交操作界面。
- 合同用词为“分组设置佣金”和“（从下个月月初开始）”，三点菜单与对应未提交界面沿用前批覆盖。

本轮范围和遗漏见 [0.6.5 覆盖与必要检查](docs/engage-coverage-065-20261011.md)；[0.6.4 历史短查](docs/engage-coverage-064-20261011.md)、[0.6.3 记录](docs/engage-coverage-063-20261011.md)、[0.6.2 记录](docs/engage-coverage-062-20261011.md) 和 [0.6.1 Engage 记录](docs/engage-coverage-20261011.md) 保留为历史。源码直接加载 `impact-cn-mod/`，主要逻辑位于 dict.js、content.js/content.css、site-config.js 和 background.js。

## 当前检查状态

本轮确认 Demo GC - Retail 已登录，助手实际运行 0.6.4；使用独立观察页，没有重复加载或登录。未创建、保存、发送、发布、删除、上传或修改业务记录，没有发送 AI 问题。商品加佣进入参与资格和佣金设置后取消；分组弹窗仅展开，未添加最终分组。Data Lab 仅未保存配置。

0.6.4 的追踪、Creator、Marketplace 和零售直接短查见历史记录，不继承为 0.6.5 通过。0.6.5 新增“佣金条款优先级”主题，复用“分组设置佣金”；规则字段和运算符分别限定 rule-dropdown/boolean-dropdown 的焦点菜单，业务值输入保留。Data Lab 条件弹层实际位于主容器外，已补独立翻译根节点。

本版执行必要 JS 语法、版本、唯一 ID、词条/主题关联、新增 scope 和敏感模式检查；打包核对根 manifest、资源、CRC、源码/解压目录字节一致。0.6.5 新规则实页翻译、原文恢复和新问号发送待用户加载；AI 回复准确性、生产域和全量回归未检查。

## 继续工作

先交付 0.6.5 供用户体验，再按反馈修补。效果营销活动后续步骤被原生有效封面图片校验阻断，本轮没有上传；商品加佣预览/最终提交、其他未观察国家与语言控件仍待后续导航。Amplification 当前为连接社交账户入口；Refer & Earn 空白嵌入。Products 已观察目录、推广和 Storefront。

财务暂放下：不查询、不选择付款账户、不进入 Pending Payouts。保留已译固定标题，不追查 demo 财务结果。尊重草稿、禁用状态和取消请求；不点击业务最终提交。

2026-10-11，已按用户授权通过现有 GitHub 连接将 0.6.2–0.6.5 已核对源码与说明提交并同步至 `jacobji-maker/impact-localization-extension` 的 `main`，源码提交 [`8782b8c`](https://github.com/jacobji-maker/impact-localization-extension/commit/8782b8cec886390d30deb1ca37a0d0cfe834b7d9)。远端按预期旧 SHA 校验并向前更新，本地导入同一提交对象，文件树一致；CLI HTTPS 缺少认证，因此实际同步使用 GitHub 连接。此交付记录随后单独提交同步。只包含 15 个已核对项目文件，凭据、会话、私人业务材料及忽略的 artifacts/dist 未纳入；未强推、回滚、stash 或清理旧包和报告。

历史财务结论仍为 0.5.2 的 13 PASS / 2 FAIL；0.5.3 严格菜单属性 FAIL 保留，不阻塞开发。[旧覆盖记录](docs/product-pages-coverage-20261011.md) 和 [合同记录](docs/contracts-menu-coverage-20261011.md) 按需阅读，不默认加载全部历史报告。

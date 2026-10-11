# 0.6.2 覆盖与交付

日期：2026-10-11。5105 词条 / 145 概念主题，比 0.6.1 增加 426 条。实际观察来自已登录 Demo 账户；不包含凭据、业务行或 AI 对话。

| 范围 | 本版变化 |
| --- | --- |
| 工作流 | 复用旧路径 194 条到已观察的 `/secure/advertiser/engage/fr/ps-bar-ui.ihtml`；补申请表独立 Optional。旧路径保留。 |
| 四类零售报表 | 按各 handle 限定 Data Lab frame 内未选筛选标签、Program 计数固定片段和 Products Sold / Revenue / Action Cost 指标。选中名称保持原文。 |
| Marketplace | 补 All Partners / Creators 固定标题、常用筛选、规模/关系/内容分类枚举、排序、位置单位及更多筛选表单。 |
| Creator Search | 按实际开放 Shadow 宿主与 document 侧栏分别补最小/最大值、平均点赞数、创作者/受众特征、相似匹配、认证及赞助内容提示和布尔枚举。 |
| 素材 | 补实际 More 菜单九类枚举；菜单打开 class 改变时复用现有 schedule 重扫预挂载 portal。 |

只浏览、展开或本地切换筛选，没有创建、保存、发送、发布、删除、上传、财务查询或连接站外账号。伙伴 Tracking 子菜单本轮未正常展开，不强制点击隐藏控件。活动向导必填信息后的步骤、追踪链接高级项、更多报表内部枚举、Marketplace 国家/语言长枚举尚未补齐；生产 `app.impact.com` 未检查。

四个直接相关 JS 语法、版本一致、唯一 ID、双向主题关联通过。ZIP 共 12 文件，根 manifest、MV3 版本、运行及 popup 资源、CRC、全部源码字节一致和敏感模式检查通过。未执行全量回归；0.6.2 实页中文/原文恢复、独立开关及问号短查待新版加载。

交付：`dist/impact-cn-mod-0.6.2.zip` 与同名解压目录。Chrome 详情实际加载旧 `dist/impact-cn-mod-0.6.1/`；需停用旧版，再通过开发者模式加载新版含 manifest.json 的文件夹。旧包和历史报告保留，本版没有提交或推送 GitHub。

## 后续直接页面短查（2026-10-11）

用户加载后，Chrome 详情与独立工作流页确认 0.6.2。工作流“描述 可选”中文、关闭翻译恢复 Description Optional、空表单值及 AI 开关保持开启通过；重新开启翻译恢复中文。素材 More 内“在线跟踪链接”中文通过，入口按钮自身 More 漏译留给 0.6.3。Creator / 零售本轮新版短查未完成；不改变上文交付时的检查状态，不扩为全量通过。

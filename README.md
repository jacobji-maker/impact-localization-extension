# Impact 汉化助手

为 Impact 品牌端提供中文界面和术语帮助的 Chrome 插件，支持 `demo.impact.com` 和 `app.impact.com`。

## 功能

- 汉化导航、菜单、筛选、表头、说明和表单标签，按页面语境区分联盟营销术语。
- 伙伴与合同：伙伴管理、合作申请与提案、工作流、邮件、分组、联系人、问卷和合作条款。
- 活动与零售媒体：营销活动、商品加佣推广及相关管理界面。
- 推广素材与商品：九类广告素材、资源、优惠活动、优惠码、商品目录、商品推广与 Storefront。
- 报表与交易：Data Lab、标准报表目录、已保存与定时报表，以及转化记录、补单申请和测试转化的固定界面。
- 包含仪表盘，以及招募伙伴、多维分析、风险防护和财务页面的已适配文案。
- 复杂概念旁提供问号，调用页面已有的 Ask Impact，用中文提问并要求官方帮助链接。
- “精细翻译”和“AI辅助问题回答”可分别开关，设置自动保存；页面助手可以拖动。

汉化在本地执行，关闭翻译即可恢复原文。伙伴名称、金额、日期、输入内容和 AI 回复保持原样。可见功能随账号套餐与权限不同，尚未收录的文案继续显示原文。

当前页面适配根据 Demo 账户观察，`app.impact.com` 生产账户尚未检查。

## 安装与使用

1. 下载并解压安装包，或直接使用仓库中的 `impact-cn-mod/`。
2. 在 Chrome 打开 `chrome://extensions/`，开启“开发者模式”。
3. 点击“加载已解压的扩展程序”，选择直接包含 `manifest.json` 的文件夹。
4. 登录 Impact，建议原站语言选择 English，然后刷新页面。
5. 从 Chrome 工具栏或页面上的“汉化助手”调整两个开关。

更新时重新加载扩展，再刷新 Impact 页面。请只启用一个版本。详细步骤见 [安装说明](impact-cn-mod/INSTALL.md)。

## 主要文件

| 文件 | 用途 |
| --- | --- |
| `impact-cn-mod/dict.js` | 翻译词条、页面范围和概念问题 |
| `impact-cn-mod/content.js`、`content.css` | 翻译、原文恢复、问号和悬浮助手 |
| `impact-cn-mod/site-config.js` | 页面容器及原生 Ask Impact 适配 |
| `impact-cn-mod/background.js`、`popup.*` | 跨 frame 问号转发和开关设置 |
| `scripts/package-extension.py` | 生成可解压加载的 ZIP 安装包 |

扩展无需构建。开发与打包见 [开发说明](docs/DEVELOPMENT.md)，常用术语见 [本地化说明](impact-cn-mod/LOCALIZATION_GUIDE.md)，更新记录见 [CHANGELOG](impact-cn-mod/CHANGELOG.md)。

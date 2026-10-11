# Impact 汉化助手

为 Impact 品牌端提供中文界面和术语帮助的 Chrome 插件，支持 `demo.impact.com` / `app.impact.com`。

## 功能

- 翻译导航、菜单、筛选和表单，覆盖已适配的伙伴、合同、活动、素材、商品、报表等界面。
- 术语问号调用原生 Ask Impact，用中文解释概念并提供官方帮助链接。
- 翻译与 AI 辅助可独立开关，设置自动保存，助手可拖动。

汉化在本地执行，关闭后恢复原文；业务数据、输入内容和 AI 回复保持原样。适配基于 Demo 账户，生产账户尚未检查，未收录文案显示原文。

## 安装

1. 下载仓库，或解压安装包。
2. 打开 `chrome://extensions/`，开启开发者模式。
3. “加载已解压的扩展程序”，选择 `impact-cn-mod/` 或直接包含 `manifest.json` 的目录。
4. 登录 Impact，原站语言设为 English 并刷新；通过“汉化助手”调整开关。

更新后重新加载扩展并刷新页面，只启用一个版本。[使用说明](impact-cn-mod/INSTALL.md) · [开发与打包](docs/DEVELOPMENT.md) · [更新记录](impact-cn-mod/CHANGELOG.md)

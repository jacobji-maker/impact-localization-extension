# 开发说明

扩展源码在 `impact-cn-mod/`，使用原生 JavaScript 和 Chrome Manifest V3，无构建步骤。修改后在 Chrome 扩展页重新加载，再刷新 Impact。

## 文件用途

| 文件 | 用途 |
| --- | --- |
| `manifest.json` | 版本、网站匹配和扩展资源 |
| `dict.js` | 固定文案翻译、页面与组件范围、概念问题和官方帮助链接 |
| `site-config.js` | 页面容器、Shadow DOM 和 Ask Impact 控件适配 |
| `content.js`、`content.css` | Text 节点翻译与恢复、悬浮助手、问号及原生 AI 协作 |
| `background.js` | 将子 frame 的概念问题交给顶层页面 |
| `popup.html`、`popup.js`、`popup.css` | 两个独立开关与设置同步 |

## 添加翻译

在实际页面核对原文和所在组件，再在 `dict.js` 添加中文与范围。同一英文在不同页面可能有不同含义，短词应限定到对应控件。复杂概念可关联单独的问题主题，提供官方帮助链接。

只替换固定 Text 内容，保留原生页面结构、事件、业务数据和输入值。菜单、弹窗、开放 Shadow DOM 与各个 document 分别匹配；用户自定义名称、消息正文和 AI 回复不参与翻译。

修改后检查相关 JavaScript 语法，并在直接受影响的页面查看中文和关闭翻译后的原文。测试工具使用 Node.js 24；需要时可安装依赖并运行指定检查：

```bash
npm ci --ignore-scripts
npm run browser:install
npm run test:shadow
```

`tests/` 包含范围、恢复、开关和打包等检查；`npm test` 运行完整合成检查。网页诊断工具在 `scripts/`，历史页面记录在 `docs/`。

## 打包

同步 `manifest.json`、`dict.js`、`package.json` 与 `package-lock.json` 的版本后运行：

```bash
python3 scripts/package-extension.py
```

安装包生成在 `dist/impact-cn-mod-<版本>.zip`，解压后加载包含 `manifest.json` 的目录。打包器保留已有安装包，同版本内容变化时需要更新版本。

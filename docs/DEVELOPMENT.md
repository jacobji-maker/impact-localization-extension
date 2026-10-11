# 开发说明

源码在 `impact-cn-mod/`，Chrome MV3 插件，无需构建。

- `dict.js`：固定文案、页面范围和概念问题。
- `content.js` / `content.css`：翻译、原文恢复和页面助手。
- `site-config.js`：页面与原生 Ask Impact 适配。
- `background.js` / `popup.*`：frame 问题转发和两个独立开关。

只翻固定 Text，保留业务数据与输入值。修改后在 Chrome 扩展页重新加载，再刷新 Impact。

同步版本后打包：

```bash
python3 scripts/package-extension.py
```

输出为 `dist/impact-cn-mod-<版本>.zip`，解压后加载含 `manifest.json` 的目录。

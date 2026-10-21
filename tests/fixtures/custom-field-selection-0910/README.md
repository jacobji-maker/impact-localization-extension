# 0.9.10公开固定文案样例

只包含未提交空表单的固定Text、七种公开题型和实际组件结构；没有账户、业务行、输入值、会话地址或完整AI对话。原生值由测试运行时的虚构数据验证。原始本地报告和私人浏览器现场不随仓库发布。

先使用Node 24、Python 3，运行 `npm ci --ignore-scripts` 和 `npx playwright-core install chromium`，再在仓库根目录执行：

```sh
node tests/interface-settings-regression.mjs --observed-only --require-source-unchanged --stop-on-fixed-text-failure --capture=tests/fixtures/custom-field-selection-0910/live-public-capture.json --capture-sha256=ef7c49c8e2beb77f0d2733d86ae93209cf3fe98af53cef999eb2518f6e83a173 --targets=tests/fixtures/custom-field-selection-0910/targets.json --targets-sha256=6aa185eb0783711093a47995f5e506d2eed452c5500a7e391eae42c2f26290b9 --report-dir=artifacts/public-0910-check
```

测试独立临时MV3配置，只访问本地响应，不连接用户Chrome或真实平台。合成结果与正常页验收、业务完成分开。

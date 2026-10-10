# Impact 本地化插件

Chrome Manifest V3 扩展，作用于真实 `demo.impact.com` / `app.impact.com` 页面。按域名、路由、组件和开放 Shadow DOM 范围翻译现有 Text 节点；保留节点身份、原生事件、属性、业务值和 AI 回复。问号使用平台已有 Ask Impact，不引入 AI 后端。

当前测试版 **0.5.3**：699 条词条 / 66 个主题，财务 442 条 / 24 个主题。

**财务完整验收尚未完成。** 0.5.3 两个 Actions 菜单正常 OFF/ON 可达，5 条翻译和恢复通过；原生 `style.left` 变化使严格属性检查仍为 **0 PASS / 2 FAIL**。最近完整 15 入口报告属于 **0.5.2：13 PASS / 2 FAIL**。新编辑表单、两报表完整结果和两个新原生财务 AI 回复仍待补证。[证据索引](docs/evidence/README.md)

## 安装

1. 在 Chrome 打开 `chrome://extensions/`，启用开发者模式。
2. 选择“加载已解压的扩展程序”，加载仓库中的 `impact-cn-mod/`。
3. 只启用一个版本，在真实 Impact 页面手动登录并刷新。
4. 在扩展弹出页或悬浮助手中设置“精细翻译”和“AI辅助问题回答”。两个开关独立持久化；助手可拖动，位置仅当前页面保留。

ZIP 需要解压后加载含 `manifest.json` 的目录。完整步骤见 [安装说明](impact-cn-mod/INSTALL.md)。

## 开发与检查

需要 Node.js **24**（含 npm）、Python **3.9+**、Git。首次安装：

```bash
npm ci --ignore-scripts
npm run browser:install
npm test
```

`npm test` 在新的 `artifacts/engineering-checks-*` 工作区执行合成检查，检查版本、语法、词条关联、隐私保护、浏览器机制和打包一致性。历史采集、固定报告与旧 ZIP 保持原字节。合成 PASS 不代表实网验收。

```bash
npm run verify:static      # 静态、隐私、打包，不运行浏览器测试
npm run test:menu          # 菜单契约及范围
npm run test:menu:mv3      # 实际加载 MV3 的合成宿主
npm run test:capture       # 采集/回放契约
npm run test:form          # 未提交表单就绪及标题隐私保护
npm run package           # 使用既有 Python 打包器
```

打包生成 `dist/impact-cn-mod-<manifest版本>.zip`。相同版本、相同字节复用已有包；相同版本但字节不同拒绝覆盖，应更新运行版本并重新验证。`dist/` 和 `artifacts/` 留在本地，不进入 Git。

GitHub Actions 仅执行合成检查，不登录 Impact 或运行实网采集。目录分工、全部命令、报告边界和实网操作约束见 [开发说明](docs/DEVELOPMENT.md)。

## 工程结构

| 路径 | 用途 |
| --- | --- |
| `impact-cn-mod/` | 可直接加载的 MV3 扩展、字典、站点配置及安装/术语/版本说明 |
| `scripts/` | 隔离验证、打包、只读实网诊断与采集工具 |
| `tests/` | 合成 DOM、范围负例、实际 MV3、隐私及打包回归 |
| `docs/*-dom-scan.json` | 已净化的真实 DOM 固定文案与精确范围记录 |
| `docs/evidence/` | 已脱敏权威报告副本、版本/范围/SHA256 索引 |
| `demo/` | 历史 fixture，使用中性演示资料 |
| `artifacts/`、`dist/` | 本地证据、日志、临时工作区及交付包，Git 忽略 |

扩展只处理开放 Shadow DOM 和可访问 document；不翻译输入值、名称、金额、日期、银行/税务资料、业务 ID、AI 回复或表单属性。Optimize 固定译为“多维分析”；品牌充值语境的 Automatic Payments 译为“自动充值”。详见 [本地化说明](impact-cn-mod/LOCALIZATION_GUIDE.md)。

## 接续工作

开始前阅读 [协作规则](AGENTS.md)、[项目状态](PROJECT_STATE.md)、[下一任务](NEXT_TASK.md)、[交接说明](docs/NEXT_CHAT_HANDOFF.md)，核对实际 Git 状态、代码、报告版本和指纹。当前优先收口两个菜单严格属性条件；不自动进入表单、报表或问答阶段。

财务实网只浏览、展开或打开未提交表单；不改字段、充值、转账、保存、删除或上传。报表查询先证明是既有只读查询。原生 AI 回复容器未核实前不发送；不保存凭据、会话、私人业务行、截图或完整对话。任何已有本地证据和交付包都应保留。

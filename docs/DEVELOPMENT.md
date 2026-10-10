# 开发与维护

## 环境与依赖

扩展本身无构建步骤、无 npm 运行依赖。直接加载 `impact-cn-mod/` 即可。工程合成检查使用 Node.js 24、Python 3.9+、锁定的 `playwright-core@1.62.1`；`.node-version`、`package.json` 和 `package-lock.json` 是环境依据。

```bash
npm ci --ignore-scripts
npm run browser:install
npm test
```

Linux 若缺少 Chromium 系统依赖，可执行 `npx playwright-core install --with-deps chromium`。依赖更新需同步 lockfile，并重跑受影响检查。不要复用旧长驻模块或旧浏览器句柄推断当前版本。

## 扩展架构

| 文件 | 责任 |
| --- | --- |
| `impact-cn-mod/manifest.json` | MV3、域名、all_frames 内容脚本和资源声明 |
| `dict.js` | 已观察固定文本、语境/路径/组件/Shadow 范围及主题关联 |
| `site-config.js` | 原生 AI 入口/输入/发送结构及宿主配置 |
| `content.js` / `content.css` | Text 翻译与恢复、开放 Shadow 遍历、助手和原生 AI 协作 |
| `background.js` | 子 frame topicId 转发与发送方/页面/主题校验 |
| `popup.*` | 两个独立开关与 storage 同步 |

新增词条先用净化 DOM 证明实际固定片段及唯一范围，不用全局短词替换。禁止 innerHTML 重建、改原生属性/组件/attachShadow 原型或强制点击。运行资源变化需同步 manifest、字典与工程版本；当前工程整理没有修改任何扩展运行文件，仍为 0.5.3。

## 合成检查与输出

所有普通 npm 测试入口通过 `scripts/verify-project.mjs` 创建独立工作区和日志目录，拷贝当前源码/测试/净化采集，复用本地依赖，再串行执行。默认全部合成套件；未选套件明确 SKIPPED。检查结束验证原文件指纹保持。不要直接运行会覆盖固定历史报告的旧测试入口。

| 命令 | 范围 |
| --- | --- |
| `npm test` / `npm run verify` | 全部合成套件、语法、版本/词条关联、隔离打包与原件保护 |
| `npm run verify:static` | 无浏览器：静态、隐私、打包保护，其余 SKIPPED |
| `npm run test:shadow` | Shadow 遍历、动态变化、原文恢复 |
| `npm run test:extension` | 实际 MV3 弹出页、runtime/storage 开关同步 |
| `npm run test:header` | 顶栏范围与数据保护 |
| `npm run test:finance` | 财务 iframe、数字模板和 AI 转发 |
| `npm run test:form` | 合成未提交表单就绪与未知标题隐私拒绝 |
| `npm run test:new-entries` | 已有新词条的范围/身份/恢复负例 |
| `npm run test:capture` | 采集枚举、动作、frame/table 身份及只读边界 |
| `npm run test:menu` | 两菜单严格结构、唯一性、后置条件和文本范围 |
| `npm run test:menu:mv3` | demo/app 合成宿主实际 MV3 加载与菜单规则 |
| `npm run test:privacy` | 脱敏机制负例 |
| `npm run test:package` | 临时目录内新包/相同重包/冲突拒绝 |

可用 `node scripts/verify-project.mjs --only menu,capture` 组合范围。`--skip-browser` 只声明实际静态范围，不代表完整测试通过。每次输出 `artifacts/engineering-checks-<时间戳>-<随机后缀>/engineering-report.json`、`logs/` 和 `workspace/`；失败保留日志与工作区，退出码非零。

CI 使用 [checkout](https://github.com/actions/checkout)、[setup-node](https://github.com/actions/setup-node)、[setup-python](https://github.com/actions/setup-python)、[upload-artifact](https://github.com/actions/upload-artifact) 官方 Actions；仅执行上述合成检查。权限 `contents: read`，不保留 Git 凭据，无 Impact 账号或业务会话。CI 通过与否以远端实际运行记录为准。

`npm run test:legacy-fixture`、`npm run serve:legacy-demo` 仅是历史自建页面工具，不属于默认检查或实网验收。

## 打包与版本

```bash
python3 scripts/package-extension.py
```

打包保持确定性 ZIP 格式，manifest 位于根目录，全部 12 个插件文件进入包。已有同版本相同字节则复用且 mtime 保持；不同字节拒绝覆盖，须更新运行版本。新包排他创建。验证包括资源齐全、CRC、源码与 ZIP 字节一致及内容脱敏。

当前已验证 0.5.3 ZIP 为 132785 bytes，SHA256 `513d77a17235a5ddec56145e0653fed8d483783a1c8298f120d022b1e9987d41`。Git 仓库保存源码和验证依据；本地旧 ZIP 与解压目录不删除、不上传整目录。

## 实网诊断

实网工具独立于默认 npm 检查。先读 [交接说明](NEXT_CHAT_HANDOFF.md)，保护净化 JSON、固定报告和根报告，独立归档；新建 MV3 测试窗口后用户手动登录，再核实唯一插件路径、运行版本与两个开关。浏览器登录不能由其他窗口推断。

```bash
npm run test:finance:live
```

该入口启动会话，不代表验收完成。默认 `runModule` 仍会覆盖固定全量报告，fresh 入口也不自动刷新所有静态依赖。菜单独立分支要求已存在的 `artifacts/finance-menus-*` 目录及唯一文件名，以 wx 拒绝覆盖；旧 scan/goto/inspect 禁止用于当前接续。所有浏览器操作和共享采集 JSON 写入由主 Agent 串行处理。

财务只浏览、展开和打开未提交表单；报表先证明是既有只读查询；原生 AI 回复容器未核实前不发送。不要改字段、充值、转账、保存、删除、上传，不导出 cookies/storageState，不记录私有业务内容或完整对话。

## Git 与证据

私有仓库用于工程存档。提交前检查实际暂存文件，保留源码、净化固定文案、合成测试及精选脱敏证据；忽略依赖、artifacts/dist、认证文件、profile、截图和会话导出。不要使用 git clean/reset/stash 整理用户原件。

精选报告在 [证据索引](evidence/README.md)，副本与原件 SHA256 在 [index.json](evidence/index.json)。0.5.3 部分菜单严格 FAIL、0.5.2 完整 15 入口 13/15 及工程合成检查必须分开陈述。任何范围未实际执行都不标 PASS。

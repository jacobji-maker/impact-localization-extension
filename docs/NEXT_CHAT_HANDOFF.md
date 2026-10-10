# Impact 插件新对话交接与沟通

工程整理最终完整隔离检查 **16 组 PASS / 11 组合成套件实际运行 / 0 跳过**，含标题隐私保护与打包冲突拒绝；[本轮工程报告](evidence/engineering-20261011/engineering-report.json)。原件保护通过，本轮没有新增实网验收，既有财务严格 FAIL 与缺口保持。

更新：2026-10-11（Asia/Seoul）。接续基线0.5.3，699/66、财务442/24、净化采集442。两个Actions菜单正常原生OFF/ON操作及5条翻译/恢复已有定向实网证据；原生菜单根style.left变化使严格属性gate仍FAIL，phaseMenuComplete=false。完整财务验收未完成，最近完整15入口仍是0.5.2的13PASS/2FAIL。

事实以[PROJECT_STATE.md](../PROJECT_STATE.md)、实际代码和对应证据为准；任务顺序见[NEXT_TASK.md](../NEXT_TASK.md)。下一轮仍先收口两个菜单的严格属性条件，完成后汇报；不自动进入表单、报表或问答阶段。上一轮ACH/Monthly已经验证，本轮没有重复开发。

工程整理已补 Node.js 24、锁定依赖、隔离测试、保护式打包与私有仓库存档。继续前先看 [开发说明](DEVELOPMENT.md) 和 [精选证据](evidence/README.md)，实际提交与远端以 `git log` / `origin` 为准；工程合成检查不改变财务验收状态。

## 可复制的开场消息

```text
这是 Impact Chrome MV3 插件项目的新一轮交接，工作目录为当前仓库根目录。
请先读 AGENTS.md、PROJECT_STATE.md、NEXT_TASK.md 和 docs/NEXT_CHAT_HANDOFF.md，核对 Git 状态、实际代码、报告版本及证据指纹；按需读摘要和对应失败页，不加载全部历史材料。
基线0.5.3，699条/66主题、财务442条/24主题、净化采集442。Billing/Funding原生Actions菜单在OFF/ON均正常可达，5条翻译及原文恢复有证据；严格属性gate因原生菜单根style.left变化仍FAIL。只读断点分别证明Impact原生脚本直接写入各1次、扩展直接写入0次。先处理这一未完成条件，不忽略变化或改动组件/属性取得PASS。
最近完整15入口报告仍属于0.5.2：13PASS/2FAIL、0pageErrors，完整验收未完成；三类新编辑表单、两报表完整结果、两个新原生财务回复仍待补证。项目已授权建立首次 Git 存档；先核对 git status、git log 与 origin，不用空 Git diff 判断没有文件变化。
重新确认独立MV3窗口登录、唯一加载路径、版本及两个开关；内置浏览器登录不能作为证明。先保护净化JSON和两份固定报告，重建工具并fresh加载依赖，旧PTY/browser/Agent句柄不能假定复用。本轮菜单分支支持独立目录/唯一文件名且拒绝覆盖；默认runModule仍覆盖完整报告，不能混用。
主Agent负责架构、scripts、浏览器、共享JSON、集成、验收和交接；子Agent仅处理明确文件。保留Name列及同一dynamic-table身份、精确top/body/唯一u、控件/菜单唯一、关闭基线、单次原生hover/click和完整popup后置gate。不强制或脚本点击、不重试超时动作、不放宽判定。
财务仅浏览、展开和打开未提交表单，0改字段/充值/转账/保存/删除/上传。报表查询先证明既有只读；assistant-only回复容器未证实前0发送，不记录凭据、业务值或完整对话。
开始简报已确认事实、待现场确认事项及文件分工，然后继续已授权诊断和必要修补。不提交/回滚/stash/清理，不删除artifacts/dist。每阶段更新PROJECT_STATE/NEXT_TASK/交接基线，区分实网、合成及部分复检，给证据链接。两个菜单严格条件收口后先汇报。
```

## 文件事实与现场状态分开核对

| 项目 | 文件中已证明的范围 | 新对话仍需现场确认 |
| --- | --- | --- |
| 工作区 | 本轮授权首次 Git 存档，旧包/证据保留 | git status、git log、origin、实际文件及指纹 |
| 独立窗口 | 本轮新建Testing临时profile，用户手动登录 | 窗口是否有效、是否能控制和登录；不自动重试失败登录 |
| 插件 | 本轮唯一enabled/unpacked，源码impact-cn-mod，manifest/content0.5.3 | 实际路径、唯一扩展、当前宿主版本，不凭源码或开发者模式READY推断 |
| 两开关 | 初始及收尾true/true | 读取实际值，保存并恢复本轮初始状态 |
| 实网范围 | 本轮仅demo两菜单；没有查询、编辑或AI发送 | 精确top/body/唯一u、当前Name/overlay/portal及就绪重新建立 |
| 包 | 0.5.3 ZIP/源码/解压字节一致 | 本轮实网加载源码目录，未在新解压目录登录验收；新窗口按实际加载路径记录 |

当前dict SHA256 `546fe5096aca3ecf351519e76433c90700521e2aed4d2611eba7f35f8db90229`；净化JSON `1fdbd6a3cac74b782dab2e51a76a4aaa01273aab1911856326fd8d4183d15a12`；最近完整15报告 `275f5bb6591dbe2baf26bff09a7209cdd19c3843de93baae3168b48dafe28aca`。开工0.5.2原件和指纹保存在本轮before目录，437旧候选完整保持，新合并5个固定候选，不是全页重新采集。

## 工具重建与写入风险

启动前把`docs/finance-dom-scan.json`、`artifacts/finance-tests/live-report.json`及根`finance-live-test-report.md`保护到新的阶段目录。默认完整验收输出没有通用reportDir/outputDir，不要凭传参猜已保护。最近完整权威报告是`artifacts/finance-acceptance-20261010/after-replay-fixes-15/live-report.json`；部分结果不能覆盖它。

工程使用 Node.js 24、Python 3.9+ 及锁定的 Playwright Core。先按 [开发说明](DEVELOPMENT.md)安装依赖与 Chromium，再依据实际文件启动：

```bash
node scripts/finance-session.mjs --manual-login
```

此命令新建临时Testing profile并加载源码目录，不继承内置浏览器登录。需要登录时说明具体测试窗口，让用户手动完成，不索取凭据/验证码，同时继续独立文件审查。启动不采集；用户原窗口保持。

| 入口 | 实际行为 |
| --- | --- |
| inspect-auth | 登录结构，不读字段值；失败登录不自动重试 |
| prepareExtension | 仅临时profile开发者模式；不证明扩展实际运行 |
| reloadExtension | 重新加载当前源码扩展，再现场核对manifest/content版本 |
| runModule + inspectEntityMenus | 提前返回独立菜单模块；要求已存在的artifacts/finance-menus-*目录、唯一安全menuReportName，wx拒绝覆盖，不写共享JSON或完整报告 |
| 菜单runtime | 核验实际source path/唯一extension/版本/开关，不把两个页面部分诊断称全量 |
| 菜单observe/native-flow/replay-menu | 沿已采集精确路线执行Name及正常hover/单次Actions点击，包含只读原生操作，不是无操作的结构快照；observe默认OFF/OFF，独立使用者须恢复初始开关 |
| 菜单acceptance | OFF/ON各新原生流程、5条Text的OFF→ON→OFF身份检查；属性gate保持严格；finally恢复初始开关 |
| 菜单attribute-writer | 已证明的当前portal只读CDP属性断点，分类写入来源后自动resume/detach并恢复开关；不输出URL、正文或业务值；只用于归因，不替代完成gate |
| 既有inspectOpener/inspectReportStructure/inspectFinanceLayout | 提前返回但仍固定旧诊断目录；需唯一新文件名并独立归档 |
| inspectNativeAI | 只读结构；openNativeAI可开入口一次，均不发送 |
| 无参数runModule | 全量验收，覆盖artifacts/finance-tests/live-report.json和根报告 |
| scan/goto/inspect | 启动时空内存写回共享JSON，当前禁止调用 |
| captureExtra/captureDeep | 修改共享JSON，必须主Agent保护原件、审查范围并串行；本轮未直接运行这些全采集入口 |
| finish | 关闭本脚本context并删临时profile，明确结束会话时才用；不会替你归档证据 |

本轮菜单runtime示例（在已确认的新会话内发送JSON控制行，目录由主Agent先创建）：

```json
{"action":"runModule","inspectEntityMenus":true,"menuOperation":"runtime","menuOutputDirectory":"artifacts/finance-menus-YYYYMMDDTHHMMSS","menuReportName":"runtime-initial"}
```

目录名必须符合代码的ASCII安全字符要求，示例中的YYYYMMDDTHHMMSS使用时换成时间戳；同名报告拒绝覆盖。其他模式按实际代码的menuPageId与状态要求调用，不沿用旧DOM引用。

fresh runModule重读入口，但静态依赖仍可能缓存。本轮静态import旧菜单模块导致新export不可见，deep已改为runDeepCapture内fresh dynamic import，extra也fresh，JSON再读取。后续新增依赖仍要检查fresh传播，不能仅凭入口fresh声称内存已更新。

## 第一阶段完成条件及当前缺口

1. 两页正常原生操作到目标Actions，唯一frame/控件/menu、准确top/body/唯一u、Name列与同一dynamic-table身份。本轮已分别证明，Billing3项/Funding2项；Funding历史timeout不倒推为Billing历史pointer interception。
2. 当前固定Text命中、OFF原文恢复、Text/元素/子节点/属性/原生事件/数据身份保持。5条Text及节点/数据保持已证明；根style.left由平台随翻译调整，ON1变化/OFF0变化，严格属性检查仍未通过。不能删guard、修改原生组件或用合成PASS替代这一条件。
3. 必要语法、受影响机制及选定内容脱敏通过，实网/合成/历史明确分开。本轮56菜单机制（注入引擎）、10实际MV3合成、26回放合成、13语法/包/内容检查；实际执行范围以阶段JSON为准。
4. 独立归档、更新三份状态文档并收尾。当前phaseMenuComplete=false，不能因两个菜单可达写阶段已完成，也不能将其拼入旧13/15报告成为15/15。

继续只读核对定位机制及可满足严格属性条件的正常场景；当前没有为原生left变化改插件引擎或豁免属性。条件仍不满足时保留未完成与具体证据，先汇报；不开始编辑表单、报表或原生问答。

## 后续范围

菜单收口后另轮补Legal/Billing/Funding三类新编辑form/dialog；菜单出现不算表单。Upcoming/Cash完整只读查询须先证明只读动作，r2逐区header/body或固定空态、本次变化及稳定结束，r1独立契约；四表/H3/全局loader消失不足以PASS。核实assistant-only回复容器后再补两个新中文原生回复、各精确HelpDoc和各一次自动发送，保留草稿/禁用/取消，不记录全文。

正式当前版本15入口全PASS、0pageErrors才completePageCoverage；另五个P0深状态和两个合格新回复才completeAcceptance。Subscription不可用、Automatic Payments待到账禁用仅可见范围，不付款解锁；app生产域、其他正文及LangGraph另排。

## 文件归属与证据读取

主Agent独占浏览器、共享净化JSON、scripts契约、集成和三份交接文件。只读子Agent先审查明确模块；若授权改测试或dict，则逐文件分配并冻结后打包。本轮两子Agent限定dict与三份受影响测试，没有共享JSON或浏览器并发操作；下一轮不假定旧Agent句柄可复用。

| 证据 | 读取时机 |
| --- | --- |
| [本轮FINAL_REPORT.md](evidence/finance-menus-20261011T013504+0900/FINAL_REPORT.md) / [final-stage-report.json](evidence/finance-menus-20261011T013504+0900/final-stage-report.json) | 首先读阶段状态、范围、指纹 |
| [Billing最终定向报告](evidence/finance-menus-20261011T013504+0900/billing-053-final-review.json) / [Funding最终定向报告](evidence/finance-menus-20261011T013504+0900/funding-053-final-review.json) | 属性失败及5条身份数据；native-off/native-on分项只在需要时读取 |
| [Billing属性写入](evidence/finance-menus-20261011T013504+0900/billing-053-native-attribute-writer.json) / [Funding属性写入](evidence/finance-menus-20261011T013504+0900/funding-053-native-attribute-writer.json) | 核对原生直接写入来源；没有业务文本 |
| [capture-merge-report.json](evidence/finance-menus-20261011T013504+0900/capture-merge-report.json) | 437原件保持与5候选合并 |
| [runtime-final.json](evidence/finance-menus-20261011T013504+0900/runtime-final.json) | 本轮版本/实际加载/开关/0pageErrors；不是新轮现场证明 |
| [0.5.2完整15入口](evidence/finance-acceptance-20261010/after-replay-fixes-15/live-report.json) | 核对历史13/15，不合并定向结果 |
| [ACH历史布局](evidence/finance-acceptance-20261010/ach-final-package-layout.json) | 再报ACH问题时按需读取 |
| [Cash历史结构](evidence/finance-acceptance-20261010/cash-after-single-query-structure.json) | 进入后续报表阶段时读取 |

当前0.5.3测试ZIP（仅本地 `dist/impact-cn-mod-0.5.3.zip`；从源码打包）为132785 bytes、12文件，SHA256 `513d77a17235a5ddec56145e0653fed8d483783a1c8298f120d022b1e9987d41`。已解压`dist/impact-cn-mod-0.5.3/`，开发者模式加载含manifest的目录，停用旧版并刷新；本轮实网运行源码路径，新解压目录只证明字节相同。8个旧ZIP、失败与before原件均保留。

用户可按页面/版本/步骤/实际表现/期望表现反馈，不需粘贴全部历史材料。主Agent开始短报事实与分工，过程中及时报告关键发现，结束说明真实执行范围、未完成项、下一步及证据链接；不以旧聊天、句柄或历史PASS代替当前事实。

# 项目交接状态

工程整理最终完整隔离检查 **16 组 PASS / 11 组合成套件实际运行 / 0 跳过**，含标题隐私保护与打包冲突拒绝；[本轮工程报告](docs/evidence/engineering-20261011/engineering-report.json)。原件保护通过，本轮没有新增实网验收，既有财务严格 FAIL 与缺口保持。

更新：2026-10-11（Asia/Seoul）。当前源码及测试包0.5.3，699条/66主题，财务442条/24主题，净化采集442候选。本轮仅处理Billing Groups和Funding Accounts的原生Actions菜单。两页正常原生OFF/ON菜单到达、5条翻译及OFF恢复已验证；严格属性gate仍FAIL，本阶段未完成。最近完整15入口仍为0.5.2的13PASS/2FAIL；0.5.3未重跑全量，completePageCoverage=false、completeAcceptance=false。

## 工程存档整理（另行授权）

用户已授权整理工程并新建私有 GitHub 仓库 `jacobji-maker/impact-localization-extension`。仓库使用英文路径，中文项目说明保留；Git 提交与远端实际完成以 Git 记录为准。菜单阶段原有“不提交”约束仅作为当时历史，不阻止本轮已授权存档；以后仍按用户授权范围操作。

本轮锁定 Node.js 24 / Playwright Core 1.62.1 并加入 lockfile、隔离合成验证入口、只读权限 CI、开发说明和精选脱敏证据索引；测试不会覆盖原采集、固定报告或旧包。打包同版本相同字节复用，冲突拒绝覆盖。采集删除历史业务名硬编码，未知标题按已净化基线的 route/document 固定文案拒绝；截图使用通用标题遮罩。历史 demo 改为中性资料，移除个人机器路径。

没有改扩展 12 个文件、净化采集或历史实网报告，当前运行版与既有 ZIP 均仍 0.5.3。本轮为工程合成验证，实网 0 新页面 / 0 查询 / 0 AI 发送；不能改变下述严格菜单 FAIL 和完整验收缺口。工程检查结果见 [证据索引](docs/evidence/README.md)，环境/命令见 [开发说明](docs/DEVELOPMENT.md)。artifacts/dist 原件继续本地保留，仓库仅收录选定脱敏副本。

## 本轮事实与证据

主 Agent新建独立Google Chrome for Testing临时MV3窗口，用户手动登录；重新确认唯一已启用 unpacked 扩展、加载路径 `impact-cn-mod` 和两个开关；初始 manifest/content 为 0.5.2，重新加载后及收尾为 0.5.3。初始及收尾开关均为true/true，整个本轮会话0pageErrors。实网加载的是源码目录；新ZIP/解压字节一致已核验，未声称在新解压目录再做登录验收。见[初始现场](docs/evidence/finance-menus-20261011T013504+0900/runtime-current.json)、[收尾现场](docs/evidence/finance-menus-20261011T013504+0900/runtime-final.json)。内置浏览器的登录未作为独立窗口证明。

- Billing历史失败确认指针拦截；本轮翻译OFF及ON均在重新验证Name列后Name hover→当前Actions hover→单次正常click，得到唯一新三项portal。Funding历史仅超时；本轮独立证明同样的正常操作可达唯一新两项portal，不追溯声称历史失败与Billing同因。每次流程Name正常点击保留，菜单trustedClicks=1、untrustedClicks=0；不强制、不脚本点击、不重试超时动作。
- 回放/采集补实际hover就绪、Name与按钮同一动态表格身份、唯一frame/按钮、关闭基线及完整新portal后置gate。Billing固定Text实际祖先链为LI>DIV>SPAN>REGULAR-TEXT>SPAN，Funding为LI>DIV>SPAN>SPAN，均普通DOM；旧泛化Edit按钮检查未命中菜单li不代表新编辑表单已证明。
- 新增5条词条，严格限定双域、document/top、唯一u、直系portal层级、实际选项nth和lightDOMOnly。694旧词条及66主题完全相同，未新增问号；content/site-config/worker/popup等7个运行资源字节相同。ACH/Monthly复用既有功能，本轮未重验其全部状态。
- 实网OFF→ON→OFF：Billing3/3、Funding2/2目标命中及原文恢复；Text、原生元素/子节点、11/6个表内Text、各6输入身份/值保持。两页当前链接样本均0，不能宣称代表性实网链接验证。ON均出现1个菜单根style属性变化，精确到left，OFF恢复为0变化。CDP只读属性断点分别捕获Impact原生脚本直接写入各1次，扩展直接写入0次；不保存脚本URL、正文或业务值。严格属性gate没有豁免该原生变化，两个最终定向acceptance仍FAIL、phaseMenuComplete=false。
- fresh runModule只重读入口不足以更新静态依赖：本轮旧菜单模块缓存导致新export不可见。deep改为在runDeepCapture内fresh加载menu helper，旧错误独立保留。实际iframe路径用tag:nth-of-type构造并验证唯一及frame对象身份，只接受已观察直系静态top/body链；拒绝额外中间frame，避免写出业务路径。
- 主 Agent串行合并5条固定候选，原437候选逐对象保持，新增英文source仅3种文档设置标签。两条原Actions序列保留，加当前原生流程/popup证明及明确未完成标志，历史capture时间/失败不改写。共享JSON没有被旧scan/goto/inspect覆盖。

## 当前验证范围

| 结果 | 实际范围 |
| --- | --- |
| 实网部分：两菜单OFF/ON | 2/2正常菜单可达；5/5翻译及原文恢复；严格属性2FAIL、阶段未完成 |
| 实网只读写入来源 | 两页各1原生属性写入、0扩展直接写入；仅诊断，不替代属性gate |
| 合成菜单机制 | 56/56 PASS；完整popup/关闭基线/未知正文/唯一/只读拒绝例与注入当前引擎范围检查 |
| 合成实际MV3 | 10/10 PASS；0.5.3完整699字典、demo/app iframe、身份/事件/恢复及范围/Shadow负例 |
| 合成采集回放契约 | 26/26 PASS；原23项加不同table拒绝、直系frame正例与含私有ID中间frame拒绝 |
| 静态与基线 | 13JS/MJS语法PASS；694旧词条/66主题及7运行资源相同；版本一致 |
| 当前内容/包检查 | 指定本轮净化JSON、诊断/测试报告、源码/交付内容脱敏；12文件、根manifest、9资源含manifest、CRC与字节一致，见阶段报告 |

实网最终报告：[Billing](docs/evidence/finance-menus-20261011T013504+0900/billing-053-final-review.json)、[Funding](docs/evidence/finance-menus-20261011T013504+0900/funding-053-final-review.json)；正常OFF/ON流程分项在同目录的native-off/native-on文件；[Billing属性写入](docs/evidence/finance-menus-20261011T013504+0900/billing-053-native-attribute-writer.json)、[Funding属性写入](docs/evidence/finance-menus-20261011T013504+0900/funding-053-native-attribute-writer.json)。工具猜测链、旧iframe不唯一、旧按钮事件引用、缓存错误和严格属性失败全部保留，不合并为PASS。

## 历史完整验收与未验证范围

最近完整报告[after-replay-fixes-15/live-report.json](docs/evidence/finance-acceptance-20261010/after-replay-fixes-15/live-report.json)属于0.5.2：13PASS/2FAIL、0pageErrors、24已完成只读动态状态、43正文状态扫描、长英文0、359规则命中。初始金额/日期样本3、私人业务行样本0；本轮未重验15入口或把菜单部分结果拼接成15/15。固定`artifacts/finance-tests/live-report.json`及根`finance-live-test-report.md`保持原字节。

ACH“ACH扣款”历史最终包布局、Text/属性/3输入/4链接和OFF恢复PASS，clientWidth/scrollWidth125px；Monthly Clear all保留精确多选组件而去生成popupID。其0.5.2证据及63项历史合成机制见上一阶段报告（仅本地 `artifacts/finance-acceptance-20261010/FINAL_REPORT.md`），不得改标为0.5.3重新通过。

当前首项仍是两菜单严格属性条件收口，不能直接转入三个新编辑表单。Legal/Billing/Funding新增form/dialog、Upcoming/Cash完整只读结果和两个新中文原生AI回复仍缺。本轮0新编辑、0报表Apply、0AI发送。Cash历史四平级分区与旧单表gate不符；四表/H3/loader隐藏不能证明查询完成。Ask Impact assistant-only回复容器仍未核实，核实前不发送。Subscription不可用、Automatic Payments待到账禁用仅已见范围；app生产域实网未验，不付款解锁。

## 工作区、文件分工与工具

菜单阶段开工时 main 无 HEAD、项目均 untracked，空 diff 不能证明没有修改。本轮用户另行授权整理工程、建立首次 Git 提交和私有 GitHub 存档；实际完成以 Git 记录为准。没有回滚、stash、clean 或删除已有 artifacts/dist。主 Agent负责架构、scripts菜单/采集/回放、共享JSON、唯一浏览器、集成、验收和文档；子Agent仅拥有dict.js及明确三份受影响测试文件，各自完成后冻结。其他插件运行机制不重构。

本轮启动前保护净化采集、两份固定报告、12源码及三份交接文件到`artifacts/finance-menus-20261011T013504+0900/before/`，指纹见[baseline-fingerprints.json](docs/evidence/finance-menus-20261011T013504+0900/baseline-fingerprints.json)。长驻旧入口禁止scan/goto/inspect；默认runModule仍覆盖固定报告。新`inspectEntityMenus`分支先返回，要求独立`menuOutputDirectory`及唯一`menuReportName`，wx拒绝覆盖，不写共享JSON/全量报告。下轮不假定本轮PTY/Agent/browser句柄有效，需重新确认登录/实际路径/版本/开关，fresh加载依赖及重读当前净化JSON。

## 当前交付与指纹

当前ZIPimpact-cn-mod-0.5.3.zip（仅本地 `dist/impact-cn-mod-0.5.3.zip`；从源码打包），已解压manifest.json（仅本地 `dist/impact-cn-mod-0.5.3/manifest.json`；从源码打包），132785 bytes，12文件，SHA256 `513d77a17235a5ddec56145e0653fed8d483783a1c8298f120d022b1e9987d41`。`python3 scripts/package-extension.py`生成；Chrome开发者模式加载已解压文件夹，停用旧版并刷新Impact。8个旧ZIP指纹与开工一致，全部保留。0.5.2为131226 bytes、SHA256 `94c085b423598b4e2369c728dd4762f1fa319531f5b26689b34c222bbc56bde5`。

当前dict SHA256 `546fe5096aca3ecf351519e76433c90700521e2aed4d2611eba7f35f8db90229`；净化JSON `1fdbd6a3cac74b782dab2e51a76a4aaa01273aab1911856326fd8d4183d15a12`；完整15报告仍 `275f5bb6591dbe2baf26bff09a7209cdd19c3843de93baae3168b48dafe28aca`。本轮汇总见[FINAL_REPORT.md](docs/evidence/finance-menus-20261011T013504+0900/FINAL_REPORT.md)及[final-stage-report.json](docs/evidence/finance-menus-20261011T013504+0900/final-stage-report.json)。无财务写入、凭据/会话导出、私人行、截图或完整AI对话落盘；隐私检查只声明实际选定内容范围。

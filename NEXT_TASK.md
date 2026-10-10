# 下一阶段任务

工程整理最终完整隔离检查 **16 组 PASS / 11 组合成套件实际运行 / 0 跳过**，含标题隐私保护与打包冲突拒绝；[本轮工程报告](docs/evidence/engineering-20261011/engineering-report.json)。原件保护通过，本轮没有新增实网验收，既有财务严格 FAIL 与缺口保持。

更新：2026-10-11（Asia/Seoul）。基线0.5.3：699/66、财务442/24、净化采集442。两原生Actions菜单正常OFF/ON流程和5条翻译/恢复有定向实网证明，但根style.left由平台原生脚本随翻译重定位，严格属性gate仍FAIL，phaseMenuComplete=false。最近完整15入口仍是0.5.2的13PASS/2FAIL，完整验收未完成。本轮用户已授权首次 Git 提交和私有 GitHub 存档；以后未获新授权不提交，禁止回滚/stash/清理或删除 artifacts/dist。

工程已补锁定依赖、隔离合成检查、保护式打包与私有仓库存档流程；实际提交/远端以 Git 记录为准。新接续先按 [开发说明](docs/DEVELOPMENT.md)安装环境，再核对 Git 状态与精选证据；本轮工程检查不代表新的实网验收。

先读AGENTS/PROJECT_STATE及[交接说明](docs/NEXT_CHAT_HANDOFF.md)，核对实际代码、指纹与报告。主Agent独占浏览器/共享JSON，子Agent限定文件。保护净化采集和固定报告，新窗口登录/加载路径/版本/开关现场重查，不能沿用旧句柄或内存。

## 首项P0：两个菜单严格属性条件收口

先看本轮[汇总](docs/evidence/finance-menus-20261011T013504+0900/FINAL_REPORT.md)，按需读取Billing/Funding最终定向报告及native-attribute-writer。不要重复旧超时流程、反复click或直接改成PASS。

1. 两页Name列及同一dynamic-table→Name正常hover→当前Actions正常hover→单次click已经独立证明，严格新portal gate3/2选项保持。Billing历史指针拦截、Funding历史仅timeout，不倒推同因。
2. 实网OFF→ON→OFF的Text/节点/数据保持，5条命中及恢复通过；唯一未通过属性是portal根style.left。只读CDP证明两页原生Impact写入各1、扩展直接写入0。继续核对原生定位机制及能满足严格属性条件的正常场景，保持现有gate；不豁免变化、不通过修改组件/属性或强制点击取得PASS。若不能满足，明确保留阶段未完成，不开下一阶段。
3. 新原生步骤/规则已有56菜单机制、10实际MV3合成、26回放合成、13语法与脱敏/包验证。只对新变化和未解决条件做必要补验，历史PASS不代替当前版本；复用ACH/Monthly/引擎，不无故重构。
4. 第一阶段条件仍须两页正常菜单、当前固定Text命中/OFF恢复、节点/属性/原生事件/数据保持，必要机制/语法/脱敏及独立证据。收口后先更新文档并汇报，再由用户安排后续范围。

## 后续P0，当前轮不继续

- Legal/Billing/Funding三类新编辑form/dialog：Name/展开/Actions不等于编辑表单，仅打开未提交表单；唯一结构、有界等待、0改字段/保存/删除/上传。未知账户范围单列。
- Upcoming/Cash完整只读结果：先证明既有只读查询；Cash四分区须逐区唯一header/body或精确固定空态、本次基线后变化、全部loader/骨架结束且稳定，无额外/嵌套表。r1独立诊断，采集/验收同步；四表/H3/全局sawLoading不能代替完成；不反复Apply。
- Ask Impact核实assistant-only回复容器后，再补资金需求与收入确认两个概念的新中文回复、各精确官方链接和各自动发送一次；保留已有草稿/禁用/取消，0全文或截图落盘。容器未证实前0发送。

## 正式验收与工具边界

当前完整15报告保持0.5.2的13/15；0.5.3菜单是部分复检，严格阶段FAIL，不能拼成15/15。正式须当前版本15唯一入口全PASS、0pageErrors才completePageCoverage；另五个P0深状态和两个合格原生回复才completeAcceptance。金额/日期/私有数据仅按本轮实际样本记录。Subscription不可用、Automatic Payments待到账禁用仅可见范围，不付款解锁；app生产域、其他正文及LangGraph另排。

`inspectEntityMenus`分支要求`menuOutputDirectory=artifacts/finance-menus-<独立阶段>`及唯一`menuReportName`，wx拒绝覆盖。默认runModule仍覆盖固定live-report.json与根报告，不假设有reportDir。旧scan/goto/inspect用空内存写共享JSON，禁止调用。fresh入口不刷新静态依赖，动态依赖也需fresh；deep已修补，其他入口按实际代码核对。采集由主Agent审查后净化克隆/合并，保留原记录。

当前0.5.3 ZIP132785 bytes、SHA256 `513d77a17235a5ddec56145e0653fed8d483783a1c8298f120d022b1e9987d41`，12文件、根manifest、9资源含manifest、CRC/源码/解压字节及脱敏PASS；实网本轮加载源码目录，未声称新解压目录登录验收。8旧包及全部失败证据保留。源码有变化需新版本，所有写入冻结后用既有打包脚本，验证字节/资源/脱敏。

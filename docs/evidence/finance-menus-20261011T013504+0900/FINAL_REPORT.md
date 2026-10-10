# 0.5.3 原生 Actions 菜单阶段报告

日期：2026-10-11（Asia/Seoul）。本轮诊断、必要修补、定向验证及归档已收尾；两个菜单的严格阶段条件仍未完成，`phaseMenuComplete=false`、`completePageCoverage=false`、`completeAcceptance=false`。没有把部分结果合并为完整15页通过。

## 结论与归因

Billing/Funding分别证明：验证Name列及同一动态表格，保留既有Name正常点击，Name正常hover→当前唯一Actions正常hover→单次正常click。翻译OFF和ON都到达各自唯一新portal，固定选项分别3/2，Actions各trustedClicks=1、untrustedClicks=0。Billing历史指针拦截和Funding历史仅timeout保留，当前相同可行流程不倒推历史失败同因。

采集/回放补就绪hover及严格新popup后置证明，原控件/Name步骤未删除。字典仅加5固定Text，694旧词条/66主题及7运行资源保持，不改引擎、原生组件或原生属性。新规则限定双域、精确body/top、唯一u、direct-body portal/list/option实际祖先链及lightDOM。

实网OFF→ON→OFF的五条目标命中和原文恢复、Text/元素/子节点、表内11/6个Text、各6个输入保持。两页当前链接样本均0；链接/原生事件负例另有合成证明，不泛化成实网代表性验证。ON时菜单根style发生1变化，精确到left；OFF恢复0变化。只读CDP属性断点两页各捕获Impact原生脚本直接写入1次、扩展直接写入0次。定位变化归于平台写入，现有严格属性gate仍拒绝该变化，最终两个acceptance均FAIL。没有用原生归因豁免gate，也没有为保持left去修改组件/属性。

[Billing最终定向报告](billing-053-final-review.json) · [Funding最终定向报告](funding-053-final-review.json) · [Billing原生写入](billing-053-native-attribute-writer.json) · [Funding原生写入](funding-053-native-attribute-writer.json)

## 验证范围

| 检查 | 当前实际结果 |
| --- | --- |
| 实网部分菜单OFF/ON | 两页各自正常可达；5/5翻译和恢复；严格属性0PASS/2FAIL |
| 整个本轮会话 | 0pageErrors；唯一源码路径unpacked0.5.3，初始/收尾开关true/true |
| [合成菜单机制](final-menu-contract-tests/menu-regression-report.json) | 56/56PASS，注入当前引擎，严格结构/唯一/基线/只读及范围负例 |
| [实际MV3合成](mv3-scope-tests/finance-menu-mv3-report.json) | 10/10PASS，完整699字典、demo/app iframe、事件/身份/恢复和Shadow负例 |
| [合成采集回放](final-replay-contract-tests/capture-regression-report.json) | 26/26PASS，原23项加不同table/直系frame/异常中间frame |
| [静态](final-static-report.json) | 13JS/MJS语法、版本一致、694旧词条/66主题和7运行资源保持 |
| [指定内容脱敏](final-privacy-report.json) | 95文件内容模式/采集安全标志PASS；未重跑4隐私单测、未扫描全部历史或像素 |
| [新包](package-report.json) | 12文件，根manifest，9运行/弹出页资源含manifest，CRC/源码/ZIP/解压字节PASS |

同目录保留先前失败：临时overlay消失、猜测选项祖先链不符、旧iframe选择器不唯一、重复hover后的旧按钮事件引用、缓存export不可见和严格属性FAIL。实际结构/当前引用/fresh依赖修补后才记录对应分项，不改写历史失败。

## 采集、报告及交付保护

开工保护净化JSON、固定完整报告、12源码及三交接文件，[baseline-fingerprints.json](baseline-fingerprints.json)记录基线。主Agent串行合并，原437候选逐对象保持，加5条固定菜单候选→442，新增英文source只有3种文档设置标签；保留两条原Actions序列和历史capture，追加当前popup/hover/单次事件及明确未完成标志。[合并证据](capture-merge-report.json)

默认完整验收的`artifacts/finance-tests/live-report.json`与根`finance-live-test-report.md`均与开工字节相同，最新完整15报告仍属0.5.2，13PASS/2FAIL、0pageErrors。0.5.3只检查两菜单，未查两报表、打开新编辑表单或发送原生AI问题。

0.5.3测试ZIP：`dist/impact-cn-mod-0.5.3.zip`，132785 bytes，SHA256 `513d77a17235a5ddec56145e0653fed8d483783a1c8298f120d022b1e9987d41`；解压目录`dist/impact-cn-mod-0.5.3/`。既有打包脚本生成；Chrome开发者模式加载含manifest的目录。实网本轮加载`impact-cn-mod`源码目录，未声称新解压目录再登录验收；相同源码资源已真实MV3合成加载且ZIP字节相同。8个旧ZIP指纹保持，全部保留。

没有充值、转账、改字段、保存、删除、上传、报表Apply或AI发送；无凭据、会话导出、私人业务行、截图、完整对话落盘；没有关闭用户其他浏览器或提交/回滚/stash/清理。独立测试窗口保留，下一轮重新建立句柄及现场证明。

## 下一步

保持两个菜单严格属性gate，先只读核对原生定位机制及能满足严格属性条件的正常场景。当前条件未满足，不把菜单阶段记为完成，不直接进入三个新编辑表单、两报表或原生问答。当前状态、下一任务和新对话基线已更新。

完整机器汇总及指纹见[final-stage-report.json](final-stage-report.json)。

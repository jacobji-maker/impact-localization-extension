# 验收证据索引

这里只保存已脱敏、与当前结论直接相关的报告副本。原件仍在本地 `artifacts/`，没有移动、覆盖或删除。完整来源、版本、范围和 SHA256 见 [index.json](index.json)；除基线指纹报告的 stageDirectory 已移除个人绝对路径外，副本字节与原件一致；该报告的原始/发布 SHA256 都在索引中，全部文件指纹值保持。报告中的原始路径保持历史含义。

| 范围 | 版本及结果 | 证据 |
| --- | --- | --- |
| 两个 Actions 菜单定向实网 | 0.5.3；正常 OFF/ON 到达、5 条翻译和恢复通过，严格属性 0 PASS / 2 FAIL | [阶段说明](finance-menus-20261011T013504+0900/FINAL_REPORT.md)、[机器汇总](finance-menus-20261011T013504+0900/final-stage-report.json) |
| Billing Groups | 0.5.3；原生 style.left 变化使严格 gate FAIL | [最终检查](finance-menus-20261011T013504+0900/billing-053-final-review.json)、[只读归因](finance-menus-20261011T013504+0900/billing-053-native-attribute-writer.json) |
| Funding Accounts | 0.5.3；原生 style.left 变化使严格 gate FAIL | [最终检查](finance-menus-20261011T013504+0900/funding-053-final-review.json)、[只读归因](finance-menus-20261011T013504+0900/funding-053-native-attribute-writer.json) |
| 最近完整 15 入口 | 0.5.2；13 PASS / 2 FAIL，0 pageErrors | [历史完整报告](finance-acceptance-20261010/after-replay-fixes-15/live-report.json) |
| 菜单机制 / 实际 MV3 合成 / 采集回放 | 0.5.3；56 / 10 / 26 项历史 PASS，不代表实网完整验收 | [菜单](finance-menus-20261011T013504+0900/final-menu-contract-tests/menu-regression-report.json)、[MV3](finance-menus-20261011T013504+0900/mv3-scope-tests/finance-menu-mv3-report.json)、[回放](finance-menus-20261011T013504+0900/final-replay-contract-tests/capture-regression-report.json) |
| 包与源码 | 0.5.3；12 文件、9 资源、CRC 与字节一致 | [包报告](finance-menus-20261011T013504+0900/package-report.json) |

历史报告的 PASS 只适用于其记录的代码、版本和执行范围。本轮工程整理的合成检查独立输出到 `artifacts/engineering-checks-*`，完成后另存脱敏汇总。没有把定向结果拼成 15/15；三类新编辑表单、两报表完整结果和两个新原生 AI 回复仍待补证。

## 2026-10-11 工程整理验证

[完整工程报告](engineering-20261011/engineering-report.json)：16 个检查组 PASS，全部 11 组合成套件执行，0 跳过；包括新增标题隐私负例和 3 项打包防覆盖检查。历史两次新增夹具失败及修复后的定向证明仍保留在本地，本次完整复检最终 PASS。扩展 12 文件、净化采集、固定报告和旧包保持；没有新增实网验收。报告中的 workspace 相对路径在本目录保留，原件及 SHA256 见索引。

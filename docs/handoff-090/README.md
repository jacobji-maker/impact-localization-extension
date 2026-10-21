# 0.9交接阅读入口

这组文档供用户和下一轮开发对话接手使用。0.9是交接版本线，扩展采用三段版本号0.9.0；本轮整理版本和文档，功能数据沿用0.8.21。当前源码、实际加载版本、已验范围和未测项始终以项目根[PROJECT_STATE.md](../../PROJECT_STATE.md)为准。

## 新对话从哪里开始

先读[AGENTS.md](../../AGENTS.md)、[PROJECT_STATE.md](../../PROJECT_STATE.md)、[NEXT_TASK.md](../../NEXT_TASK.md)和[当前架构](ARCHITECTURE.md)。到此即可确定下一步，不必批量读历史报告或整个词典。实际操作前重新核Git、文件、Chrome正常页版本和现场原值。

| 文档 | 用途 | 何时读 |
| --- | --- | --- |
| [ARCHITECTURE.md](ARCHITECTURE.md) | 模块、加载顺序、Text恢复、Shadow、授权和任务隔离设计 | 第一次接手 |
| [OPERATOR_GUIDE.md](OPERATOR_GUIDE.md) | 用户加载、双开关、指引及常见显示问题 | 需要安装或解释界面时 |
| [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) | 定位、最窄修复、Gemini、定向验证与交付流程 | 开始实际修改前 |
| [ACCEPTANCE_PLAN.md](ACCEPTANCE_PLAN.md) | 剩余问题的操作路径、通过条件与后续开发顺序 | 执行NEXT指定阶段时 |

以上是方法和设计，不维护第二份当前状态或待办表。具体执行顺序只更新NEXT；完成结果只更新STATE，并链接本轮证据。

## 可以复制到下一轮的开场

```text
在当前impact平台本地化项目继续。先读AGENTS.md、PROJECT_STATE.md、NEXT_TASK.md和docs/handoff-090/ARCHITECTURE.md，再核Git和实际文件。以正常Chrome页读回的版本为准，执行NEXT中的下一步，不重复已通过的检查。发现实际问题直接最窄修复，区分实页、合成和未测；最后读回原Program、页面、原生值和两个开关。普通导航和只读展开可连续推进，Save／Next、启动测试、订单、支付、安装授权、审核和Git提交仍不执行。
```

若已经手动加载0.9.0，可在开场前加“0.9.0已手动加载”；不要让下一轮仅凭这句话省略正常Impact页的版本确认。旧标签可能仍运行旧脚本，优先保留其未保存状态，在新的只读页核验。

## 源码与交付位置

源码在[impact-cn-mod](../../impact-cn-mod/)，交付在[dist](../../dist/)。使用既有`python3 scripts/package-extension.py`；ZIP与同版解压目录一起交付，旧包保留。随包[HANDOFF.md](../../impact-cn-mod/HANDOFF.md)是简短用户说明，完整开发文档保存在本项目，开发历史不混入扩展包。

旧的[0.8架构概要](../ARCHITECTURE_08_BRIEF.md)是以0.7.10工作区为基础的历史评估，不是当前待修清单。设置契约、生命周期和后续指引边界应以新架构与实际源码为准。历史状态已保留在[整理前快照索引](../history/20261020-before-090/README.md)，仅遇具体疑问再点读。

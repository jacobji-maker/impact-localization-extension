# 历史 fixture 报告（v0.1.0）

**本文件只记录 v0.1.0 旧版本地模拟页面测试，不是当前版本的实站验收结果。**

当前单元回归见 unit-test-report.md；真实网络验收见 live-test-report.md。

# 自动化测试报告

结果：**PASS**

时间：2026-10-10 00:43:28（Asia/Seoul）

浏览器：Playwright Chromium，真实加载 Manifest V3 解压扩展。

- **PASS** 字典结构、ID 与官方文档链接：114 entries; 4 help topics
- **PASS** 可翻译区域无残留英文长句：0 residual long English sentences in unprotected visible UI
- **PASS** 可翻译区域无残留英文 UI 短词：0 residual English terms in visible UI; business names and branded text excluded
- **PASS** 纯文本翻译保留 DOM 身份与事件监听器：Button, child element and Text node retained; original click listener ran
- **PASS** MutationObserver 处理新增节点与 React 风格文本更新：Overview → 总览; updated Partners → 合作伙伴
- **PASS** 用户输入、代码、contenteditable 与 AI 回复不被改写：All protected text and attributes retained
- **PASS** 停用恢复原文，重新启用，恢复更新后的源文本：Restored latest original text and translated again
- **PASS** 下拉框与弹窗中的动态翻译：Dynamic dropdown and modal translated
- **PASS** 点击预设问题填入现有 AI 框，触发输入事件与发送，回答带 HelpDoc：One send; native input event; Chinese reply; official link https://help.impact.com/brand/what-would-you-like-to-learn-about/platform-features/actions-and-payouts/understand-the-action-life-cycle-and-finance
- **PASS** 已有草稿受到保护：Draft unchanged; no send triggered
- **PASS** 发送按钮禁用时不触发发送：Disabled host send was respected
- **PASS** 快速重复点击不产生重复发送：Repeated click sent 1 time(s)
- **PASS** 脚本模式没有浏览器 JS 异常：No pageerror events
- **PASS** 移动视口页面无整体横向溢出：390px viewport; page width 390px
- **PASS** Demo 搜索与新增合作伙伴可操作，伙伴名称不被词典改写：Search responded; 6 → 7 local rows; Overview business name retained
- **PASS** 词典中的 HTML 作为文本展示，危险帮助链接禁止发送：HTML target stayed a Text node; javascript: HelpDoc rejected before filling
- **PASS** Manifest V3 真实扩展加载与隔离世界注入：Chromium loaded unpacked MV3; no window.ImpactCN in main world; real popup runtime messages toggled localization and persisted across reload; sent question through host AI

## 验证范围

本地 Demo 的 DOM 翻译、动态加载、文本恢复和模拟前端 AI 链路已测试。扩展测试使用 Playwright 将 app.impact.com 测试 URL 路由到本地页面，未连接客户账号。真实 Impact 页面、React 状态及在线 AI 回答尚未验证，不能将 Demo PASS 视为实站验收通过。

详细机器报告位于 artifacts/test-results.json，截图位于 artifacts/demo-desktop.png、artifacts/demo-mobile.png、artifacts/extension-loaded.png。

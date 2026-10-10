# 合成 DOM 单元回归报告

版本：0.5.0

结果：**PASS 26/26**

模式：SYNTHETIC_UNIT_ONLY；真实词典共 694 条，其中已核实 Dashboard/导航适配 124 条。使用隔离的合成页面检验机制，不构成 demo.impact.com 实网验收，也未模拟 AI 答复作为实际 AI 证据。

- **PASS** Initial nested open Shadow DOM translation retains Text identities
- **PASS** Native original button handler and numeric values remain intact
- **PASS** Dynamic additions and text updates inside observed shadow roots
- **PASS** Late open ShadowRoot discovered without patching attachShadow
- **PASS** Composed ancestor exclusions protect user names and native AI replies
- **PASS** Disable restores shadow originals and re-enable translates them
- **PASS** Native-style Shadow DOM textarea receives input event and one send
- **PASS** Existing shadow editor draft is preserved
- **PASS** A pending AI send stays cancelled through a rapid off-on toggle and preserves the filled draft
- **PASS** Native AI visible children can send when they override an ancestor visibility hidden
- **PASS** Destroy restores text and stops future shadow translation
- **PASS** A rapid native Close then inline question waits for the stale editor and sends only through the new instance
- **PASS** An AI off-on toggle during native closing permanently cancels the question without opening or sending
- **PASS** Current dictionary schema, official links and native scope requirements
- **PASS** All 124 actual native-dictionary entries translate only inside verified components
- **PASS** Actual dictionary preserves welcome-name suffix, partner name and wrong-shadow metric
- **PASS** Actual dictionary translates a late body date portal and preserves submitted dates
- **PASS** Nine native Chinese mistranslation aliases calibrate only verified navigation scopes
- **PASS** Inline questions map only individual concepts and render visibly inside native Shadow DOM
- **PASS** Refresh is idempotent and questions beside native buttons never nest another button
- **PASS** Inline pointer and click events send one concept question without triggering the native card
- **PASS** Translation and AI are independent in all four combinations; AI off blocks sending
- **PASS** A changed or detached term loses its question and restores one question when the original term returns
- **PASS** Dedicated drag handle requires movement threshold and keeps its position through state and AI changes
- **PASS** Dragged assistant is clamped after resize and resetPosition restores the default 140px bottom
- **PASS** Native path scope restores all translations outside advertiser page

实网结果独立记录于 live-test-report.md。旧 test-report.md 为历史 v0.1 本地 fixture 记录。

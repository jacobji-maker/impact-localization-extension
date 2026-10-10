# 右上菜单机制回归

版本：0.5.0。结果：**PASS 6/6**。

使用真实采集结构构造的隔离 DOM，只验证机制与词典范围；没有真实网络验收、财务正文点击或模拟 AI 答复。实网结果独立记录于 header-live-test-report.md。

- **PASS** All 32 header entries match the captured source selector and advertiser scope：6 Help + 26 Finance fixed labels; two date-prefix entries; no finance-body widening
- **PASS** Dynamic Help and three Finance submenus translate all captured labels in open Shadow DOM：Native-style opener/expander events dynamically mount 32 labels; no static demo acceptance
- **PASS** Translation preserves original Text nodes, link destinations, native events, amounts and date suffixes：32 original Text identities and attributes; native parent/link events; 3 untouched amounts and 2 date suffixes
- **PASS** Same labels in body, wrong menu and wrong Shadow host remain English：98 negative nodes retain source text and identity
- **PASS** Translation off restores source labels and on reuses the same Text nodes：32 labels restore and translate without node replacement, date/amount mutation or AI sends
- **PASS** Recreated native dropdowns and page reload are discovered and localized again：Second fresh dropdown mount and independent document reload both translate the captured menu structure

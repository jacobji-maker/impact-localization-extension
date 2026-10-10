# demo.impact.com 实网验收

结果：**PASS**

时间：2026-10-10 12:33:45（Asia/Seoul）

模式：真实网络访问，未使用请求路由、本地页面或模拟 AI 回复。

本轮范围：site、sidebar、dom、residuals、date、ai。包含完整检查范围。

- **PASS** 真实登录与实网访问：AUTHORIZED_SINGLE_CREDENTIAL_SUBMISSION; authenticated demo.impact.com; current path https://demo.impact.com/secure/advertiser/engage/aview.ihtml; no credential/state export
- **PASS** 真实站点与扩展隔离世界：Real demo requests: 61; loaded unpacked MV3 0.4.0; no routes or fixtures
- **PASS** 四个真实产品侧栏与子菜单汉化：4 products; 20 captured menu groups; scoped Chinese targets and visible mapped term questions verified without clicking business links
- **PASS** Dashboard 文本翻译保留原 DOM 与数值：37/61 visible nodes changed; 0 replaced; 0 numeric changes
- **PASS** 正式汉化范围内的长英文句残留：0 long English residual sentences inside verified localization scope; names/accounts/native AI/date portal excluded
- **PASS** 真实 Dashboard 原生动态控件：Clicked verified native menu #vueInstance [data-testid="uicl-date-range-input"]; date presets/footer Chinese; 0 English residual labels; no pageerror events
- **PASS** 真实 Ask Impact 控件与 AI 回答中的官方文档：Preset sent through native Shadow DOM input; new stable assistant reply contains Chinese, expected concept terms, and official HelpDoc link

本报告与旧版本地 fixture 的 test-report.md 相互独立。未完成的项不能视为 PASS。未保存凭据、cookie 导出或 storageState。

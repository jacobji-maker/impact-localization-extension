# Engage 0.6.0 覆盖说明

0.6.0 观察及交付记录；0.6.1 更新见文末。

更新：2026-10-11。Demo GC - Retail 实际页面固定文案观察；源码 **4678 条 / 145 个主题**，比 0.5.8 增加 **2359 条 / 5 个主题**。数量包括历史 demo 和同一词条在不同页面的范围，不代表全站或逐主题验收。

| 模块 | 本轮补充 |
| --- | --- |
| Partners | 追踪菜单未提交界面、申请/提案筛选和菜单、查看/还价条款；工作流目录、邮件和申请处理表单、条件字段及固定枚举；Newsletter、受众分组、消息模板、调查、Groups/Contacts 表单与导入说明 |
| Retail Media | Vendors、Sellers、Seller Applications 列表、筛选、未提交表单；四类零售报表标题/空态和 Product Boost 概念 |
| Campaigns | Performance Campaign 初始设置、可见向导标题及校验提示；Product Boost 列表、初始设置和上传指南 |
| Ads | 九类素材列表及七种实际创建入口、编辑 Text Link、分享/嵌入、批量导入说明、状态/日期/标签/操作菜单；业务编辑器正文保持原文 |
| Content | Data Posts、Widgets、Resources 分类和格式、六种 Deals 表单与枚举、Promo 创建开放 Shadow 界面及上传说明 |
| Products | 商品目录列表、创建/编辑固定字段、文件格式/字段映射、上传方式和 FTP 固定按钮；商品推广列表/上传说明；Storefront 固定字段 |
| Requests | 列表固定标题/表头和状态/类型筛选；当前列表无业务行操作 |
| Reports | 绩效三类/合规三类固定报表标题、筛选标签和表头；保存视图/计划发送未提交界面；More Reports 标准目录、已保存/计划列表及分类控件 |
| Data Lab | 编辑工具栏、系统维度/指标、添加列、对比；16 个图表类型的未保存配置字段与设置；用户报表名、分类名、自定义字段保留 |
| Transactions | Actions 固定标题/表头及状态枚举；Inquiries 列表、自动回复/批准设置与上传说明；Test Integration 固定步骤、标签和说明 |
| Amplification / Refer & Earn | 复用连接社交账户固定界面；Add Account 打开站外 OAuth，未连接；Refer & Earn 仍为空白嵌入 |
| Contracts | 复用前批列表、创建条款、规则弹窗、三点菜单/对应未提交界面。指定译文保持“分组设置佣金”“（从下个月月初开始）” |

新增主题解释 Email Workflows、Product Boost、Retail Media、Product Catalogs 和 Catalog Field Mapping，复用已有伙伴、合同、归因等概念。问号仍使用原生 Ask Impact，没有新增后端。

动态枚举依实际字段、document 路径、查询参数、开放 Shadow 宿主和必要英中语境限定。申请工作流的条件、运算符、固定规模与动作选项分开；自定义 Groups/条款名称不翻。报告目录仅翻已观察标准分类及标准报告；计数只使用校验后的数字槽。

## 操作与未检查范围

仅打开、展开和操作未提交界面。没有创建、保存、发送、发布、删除、上传业务记录，也没有执行追踪测试、改变伙伴关系/合同或选择付款账户。Data Lab 图表切换未保存。

- 活动向导需填写必填信息后的后续步骤未进入；官方只说明 Next 导航，未明确是否自动保存，因此没有为继续向导填写测试数据。
- 追踪链接高级项、更多报表筛选及图表内部枚举、提交后的结果尚未检查。没有将未进入范围写作不可访问。
- Saved Reports 中的私有报表名称保持原文，没有执行可能涉及财务的已保存报表。零售报表当前为 No data available。
- Promo 的自动追踪订阅状态未改变；外部社交 OAuth 没有授权、输入凭据或连接。
- Pending Payouts 和财务查询不执行；`app.impact.com` 生产账户未检查。

## 交付检查

Mac 仍锁屏，当前 Chrome 实际运行 0.5.6，两个开关已恢复 ON/ON。0.6.0 的重载、中文/原文恢复及必要问号通路尚未实页检查；不能以本轮观察或历史 PASS 代替。

必要检查已通过：dict/content/site-config/background 语法、四处版本一致、4678/145 唯一 ID 与主题双向关联、scope 有效字段及 195 个新增组件 selector 的浏览器语法检查。未运行全量、多轮或逐主题验收。

交付包 `dist/impact-cn-mod-0.6.0.zip`：12 文件、308681 bytes；根 manifest/MV3/版本、资源与 popup 引用、CRC、全部源码字节一致及必要敏感模式检查通过。SHA256：`230d5860f34bb127f53e99f61abf5a883ec41868e2d76afcfab854c1b4306a8b`。包检查不代表新版实页已通过。

源码直接加载 `impact-cn-mod/`；ZIP 解压后从 Chrome 开发者模式“加载已解压的扩展程序”选择包含 manifest.json 的文件夹。旧交付包与历史报告保留。

## 0.6.1 短检查与交付

用户解锁后登录 Demo GC - Retail，并按指定工程目录手动加载；独立页面确认运行 0.6.1、两个开关 ON/ON。词条 4679 / 主题 145，新增排序标题，补处理动作筛选范围，并加入 Data Lab 精确 frame 路径；继续保留主题、顶层路径、handle 与发送方校验。

- 实页：申请工作流 13 个条件字段、5 个规模选项显示中文；翻译 OFF 恢复原文、原生表单值不变、AI 独立 ON，最终 ON/ON。
- 实页：工作流列表的“处理动作”和“排序”固定标题中文已确认。
- 实页：零售报表标题/空态中文；Product Boost frame 问号发送到原生 Ask Impact，原生问题包含既定官方帮助链接。只确认发送，未读取或保存回复。
- Worker 隔离模拟：四个实际 report 范围转发；错误 handle、顶层路径和跨 host 拒绝，共 7 PASS / 0 FAIL。该模拟不代替实网结果。
- 已见遗漏：工作流 Optional、零售报表部分筛选/指标标题仍为英文。其他素材/合同界面未复检，不作全量验收。

0.6.1 ZIP 为 12 文件、308882 bytes；根 manifest/MV3/版本、资源及 popup 引用、CRC、源码逐文件字节一致与必要敏感模式检查通过。SHA256：`9943dbcd412ad2fb54efdf8bc77b23c81883a8e94d95f8fb96998e2613f418df`。旧包保留。

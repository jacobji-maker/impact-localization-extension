# 本地化说明

汉化助手面向 Impact 品牌端，按联盟营销语境翻译固定界面文案，帮助阅读菜单、报表与合作设置。具体词条及页面范围在 `dict.js` 中维护，含义参考 Impact 官方品牌帮助文档。

## 常用术语

| 英文 | 中文与用途 |
| --- | --- |
| Engage | 合作管理 |
| Discover | 招募伙伴 |
| Optimize | 多维分析 |
| Protect | 风险防护 |
| Actions | 指标为“转化量”，交易列表为“转化记录”，操作菜单为“操作” |
| Action Cost | 转化佣金 |
| Revenue | 成交金额 |
| Total Cost | 推广总成本 |
| Payout | 合同语境为“佣金”，资金结算语境按实际页面区分付款状态 |
| Template Terms | 合作条款模板 |
| Custom Terms | 自定义条款 |
| Payout Groups | 分组设置佣金 |
| Action Locking | 转化锁定 |
| Referral Window | 归因有效期 |
| after end of the month | （从下个月月初开始） |
| Groups | 伙伴分组，用于品牌内部管理 |
| Client Cost | 客户费用 |
| Account Manager | 伙伴负责人 |
| Postback | 事件回传 |
| Inquiries | 转化补单申请 |
| Ads | 广告素材 |
| Automatic Payments | 品牌充值语境为“自动充值” |

## 翻译方式

插件只修改已收录的固定 Text 文案，按域名、页面路径、组件及开放 Shadow DOM 匹配。同一英文可以因语境使用不同译法；关闭“精细翻译”恢复原文。

伙伴与联系人名称、日期、金额、币种、业务 ID、输入值、自定义字段、消息正文和 AI 回复保持原样。页面原有操作与计算仍由 Impact 处理。

## 概念帮助

复杂概念旁的问号调用页面已有 Ask Impact，发送围绕单一概念的中文问题，并要求官方帮助链接。可以独立关闭“AI辅助问题回答”；回复由 Impact 生成，助手会保留原生输入框已有的草稿。

可见页面和功能随套餐与权限不同，未收录的文案继续显示原文。遇到漏译或用词不清晰，可以提供所在页面、英文原文和截图，便于补充对应范围。

当前页面适配根据 Demo 账户观察，`app.impact.com` 生产账户尚未检查。

安装方法见 [INSTALL](INSTALL.md)，版本变化见 [CHANGELOG](CHANGELOG.md)。

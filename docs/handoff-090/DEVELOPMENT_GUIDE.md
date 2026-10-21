# 下一轮开发操作指南

本指南说明开发方法，不维护版本、验收状态或待办副本。
当前事实只查 [PROJECT_STATE.md](../../PROJECT_STATE.md)，下一步只查 [NEXT_TASK.md](../../NEXT_TASK.md)。
产品边界和模块连接见同目录 [ARCHITECTURE.md](ARCHITECTURE.md)，协作规则见 [AGENTS.md](../../AGENTS.md)。
文内文件链接相对本目录；以下命令均在项目根目录执行。`node`须指向已配置的Node运行时；不在PATH时使用工具返回的运行时路径，不把私人绝对路径写入交付。

## 1 从短入口开始

1. 先读用户本轮要求、AGENTS、STATE当前段、NEXT及新架构；到STATE历史分段即停，按具体问题点读旧证据。
2. 核对Git与实际文件，保留既有修改；不提交、回滚、stash、清理或删除旧包和报告。
3. 主协调者指定共享文件归属和唯一浏览器操作者；并行工作可分词条、独立测试、官方语义复核。
4. 实页统一复用已连接Chrome。先确认正常Impact页实际运行版本和双开关，旧页可能仍运行旧脚本。
5. 读取当前URL／Program与必要原生控件原值，仅保留在RAM；记录可公开的路径和固定组件证据。

```sh
git status --short
python3 -c 'import json; print(json.load(open("impact-cn-mod/manifest.json"))["version"])'
rg -n '具体固定英文或词条ID' impact-cn-mod/dict.js
```

源文件版本、ZIP版本、用户称已加载和正常页实际运行版本是不同证据；确认版本本身不关闭功能问题。
开发范围按最新授权，不从旧报告恢复商店、订单、财务、Shopify或全站审计。

## 2 先证实是哪一种问题

- 真漏译：双开关状态已读回，目标固定Text仍英文，路径／组件／真实父层明确。
- 应保留：自定义名称、Program／事件名、ID、金额、日期、银行税务资料、输入值、用户创建的业务内容及AI回复。已确认的固定设置说明正文可按语境翻译。
- 隐藏副本与可见UI分别记录；预挂载说明已中文，不代表原生弹出portal也通过。
- 当前组件未挂载、iframe正文空或触发失败记未测，不猜选择器，也不用Save／Next／Start New Test代替入口。
- 菜单刚挂载时先等待观察队列和目标Text稳定；保留即时读数，不把短暂原文直接定为稳定漏译。等待不能以隐藏副本替代实际可见目标。
- 计数为0先核实际翻译开关、document代次和版本；用户并行操作造成开关变化不能直接认作运行故障。
- Program变化应使旧声明、定位与异步操作失效；同Program换页应更新当前位置和来路。
- Program信号只做最小只读核实；凭据不足保留“来路未核”，不自动恢复旧任务或读取私人值作补偿。

## 3 采最小公开结构

每次采集前fresh读取当前文件与实际document，不复用长驻旧对象覆盖已净化材料。
公开capture只留下列必要字段，不保存整页HTML、业务行、完整URL／查询值或会话导出：

- 域名、公开pathname、确有必要的固定query键值、顶层／frame角色及实际开放Shadow宿主。
- 固定source原Text，包括有意义的尾空格；source所在Text直父tag、class、稳定testid及公开href。
- 选择器需要的实际祖先／直接父子关系、组件owner、唯一固定标题及匹配数量。
- 控件／私人值只标“排除槽”，不用真实原值，也不因恰好同英文而翻译。
- 实际可见、隐藏、触发失败、只读展开与未测范围；保存当前源码／capture哈希和采集版本。

逐层用parentElement确认父链，并对候选selector做真实matches／query计数。
不要将连续调用的旧变量、相似页面或错误夹具当真实祖先；产品icon也不能伪作展开菜单叶的祖先。
无ARIA或其它可靠绑定时，说明“当前编辑区上下文”，不能声称已证明触发器与portal的唯一关联。
最小结构投影可以省略无关中间层，但必须保留scope依赖的实采关系；不要从候选selector反造夹具。

## 4 选择词条范围与修复层

先点读 [dict.js](../../impact-cn-mod/dict.js) 相邻条目及 [content.js](../../impact-cn-mod/content.js) 的scope消费函数。
需要运行资格时再读 [site-config.js](../../impact-cn-mod/site-config.js) 与相关manifest／worker段，不整批扫源码。

- 固定共享组件：宿主、产品双marker、稳定叶和语义已跨页证实，可用advertiser组件级fallback。
- 业务表单／菜单：保持exactPath、必要query、topOnly、lightDOM／Shadow及真实owner；同英文按角色区分。
- 表头与筛选字段、标题与字段、地址State与业务State不能共享未经证明的宽范围。
- 匿名portal须有充分组件结构、精确固定Text及已证上下文；菜单可用完整固定顺序签名，拒绝增项／换项。
- 不写消费函数未支持的scope字段；HTTPS注入边界与词条匹配边界分别核对，不混称证明。
- 数据问题优先修dict。已有根资格足够时，不新增全局rootSelectors或修改扫描器。
- 只有实际元素不在运行资格、发现／恢复机制或任务隔离确有故障时才改runtime，保留原拒绝条件。
- 原生BODY帮助等例外需专用配置与明确entryIds；由同一词条source／target校验，不维护第二份文字白名单。

修改前fresh核 [content.js](../../impact-cn-mod/content.js) 的scopeSpecificity及匹配顺序，不凭词条排列猜优先级。
旧精确条目可与同译共享fallback共存；优先保留旧完整对象、顺序和helpTopics，不为去重扩大业务范围。
若确须修改旧词条，账本逐项写source／target／scope前后及依据；元数据脱敏与功能变更分开计数。
只替换现有Text，不重建DOM、不改属性／值／事件／框架状态；已有合同时间行局部例外不外扩。

## 5 建立能解释失败的定向验证

1. 先冻结公开capture与纯source／target预期；独立夹具只用实采角色，不读候选selector造结构。
2. 在完整旧版扩展快照上保留有效FAIL；明确失败Text、实际源码哈希和未运行的联动项。
3. 做最窄修补，再跑受影响组件及必要关联检查；不默认重跑旧整套或新建测试框架。
4. 最终源码冻结后fresh快照运行，绑定源码文件、脚本、capture和预期哈希；不将旧PASS外推新scope。
5. 报告分别标实页、合成、历史、未测；保留首轮失败及夹具／预期错误，不覆盖成一份全绿报告。

已有入口按问题选用：[共享导航](../../tests/shared-navigation-regression.mjs)、[测试列表与路由](../../tests/test-actions-routes-regression.mjs)、[设置组件](../../tests/settings-deep-regression.mjs)。
它们使用现有playwright-core和隔离扩展快照，不接管用户Chrome；先读文件顶部参数，避免默认范围过大。
例如共享导航已有输入的旧版观察／候选检查；将下面占位目录替换为本轮真实目录后再执行：

```sh
node --check impact-cn-mod/dict.js
node tests/shared-navigation-regression.mjs --source-dir=dist/impact-cn-mod-旧版 --report-dir=artifacts/本轮/baseline --baseline-observation
node tests/shared-navigation-regression.mjs --source-dir=impact-cn-mod --report-dir=artifacts/本轮/final --require-source-unchanged
```

设置入口另支持`--capture=`、`--expectations=`、`--page=`和`--component-type=`；不要无筛选启动历史全套。
覆盖真正有影响的关译原Text恢复、重开、AI独立、重挂／普通刷新，以及原节点、属性、事件和控件值保持。
负例至少针对真实风险：错owner／路径／宿主／frame、私人同词、业务表体、错误状态列或菜单签名。
测试帮助按钮时只统计夹具所属的owned helper；全页其它旧问号不是该组件新增按钮。
AI开关控制问号／原生提问，翻译开关控制Text；测试预期须分开，不能据误报改产品或放宽原生保护。
HTML字符串可能被解析器重排table／form；需要时逐节点构造真实投影，不让解析副作用伪造产品故障。

## 6 业务语义与Gemini

先查对应官方Help正文及本地知识索引，核清功能对象、权限、收件人、状态和前置条件；字面相似不是同义。
仅本轮真正新疑点进入Gemini，每批最多10个固定literal及必要公开资料，不发送完整词典／历史。
公司Enterprise核业务语义与步骤；指定普通Gemini入口核公开通用文案，不把企业材料复制到个人端。
实际账号和模型必须网页读回；Enterprise选最新可用，普通入口不据“Pro”擅自换模型或账号。
在 [gemini-handoff](../../gemini-handoff/) 分记prepared、实际提交、实际回复、最终采纳及拒绝理由。
准备材料不算提交，模型认可不算官方定义或工程通过；不重做G01／G02与已闭环八术语。
资料不足就保守保留或明确待核，不扩写未证明的业务承诺；Optimize等既定术语遵守AGENTS。

## 7 实页验收与恢复

候选准备完整后交用户手动加载；不自动访问、绕过或操作chrome://extensions/。
在正常Impact页独立读回实际版本；需要刷新旧页时先确认可恢复性，不能为验版丢弃原生未保存状态。
按当前NEXT的最小场景验收，不据合成通过声称生产域、可见portal或完整业务流程通过。
普通导航／展开／已授权Program切换可连续做；可恢复配置只按本轮明确授权操作。
订单、支付退款、安装授权、审核及业务敏感Save／Next不从旧授权自动恢复。
测试前RAM原值与结束读回比较：Program／可用选中marker、页面、原生控件、双开关及面板／菜单状态。
原生Cancel有重复片段或flow差异时保留失败，fresh读回验证真正恢复；不要归咎扩展或存私人原值作证据。
用户并行活动使现场变化时，先辨认新基线再继续，不能静默覆盖用户最新开关或配置。
只关闭自己创建且不再需要的探查页，不关闭用户页；结束保存脱敏结论和恢复是否一致。

## 8 冻结与交付

源码变更才按必要范围升版；通常不为外部文档更新强升扩展版。用户明确要求版本整合时，可统一版本元数据和随包说明，并记录功能等价，不虚构新增修复。
主协调者统一manifest、dict头注／version与交付说明，冻结全部写入后再绑定最终检查。
包内文件会被全部打入ZIP；新增文档先脱敏，不能夹带私有capture、企业会话地址或无关历史。
实际打包脚本只生成ZIP，不自动创建同版解压目录；旧同版内容不同会拒绝覆盖，不删旧包绕过。

```sh
python3 scripts/package-extension.py
python3 - <<'PY'
from pathlib import Path
import json, zipfile
source = Path('impact-cn-mod')
version = json.loads((source / 'manifest.json').read_text())['version']
package = Path('dist') / f'impact-cn-mod-{version}.zip'
target = package.with_suffix('')
expected = {p.relative_to(source).as_posix(): p.read_bytes()
            for p in source.rglob('*') if p.is_file() and p.name != '.DS_Store'}
with zipfile.ZipFile(package) as archive:
    names = archive.namelist()
    assert archive.testzip() is None
    assert len(names) == len(set(names)) and set(names) == set(expected)
    assert 'manifest.json' in names
    assert all(not Path(n).is_absolute() and '..' not in Path(n).parts for n in names)
    assert all(archive.read(n) == expected[n] for n in names)
    if not target.exists():
        archive.extractall(target)
actual = {p.relative_to(target).as_posix(): p.read_bytes()
          for p in target.rglob('*') if p.is_file()}
assert actual == expected
print('CRC、根manifest及源码／ZIP／目录字节一致')
PY
```

另核manifest声明资源完整、版本一致、最终文件清单／SHA、旧包保持及隐私；必要时运行既有package定向检查。
冻结后仅reason／文档脱敏可做精确静态等价绑定，明确旧行为执行哈希；若功能字段再变，重跑受影响行为。
交接只更新STATE当前结论、NEXT下一步及本轮证据索引；AGENTS留规则，本指南与架构不复制动态任务表。
下一会话从短入口、实际文件和正常页版本重新核对，遇具体疑问才读相应失败／修复／回测记录。

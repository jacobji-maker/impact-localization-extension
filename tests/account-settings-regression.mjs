/** Captured account-settings directory, on isolated synthetic MV3 documents only. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, cpSync, rmSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const arg = name => process.argv.find(value => value.startsWith(name + '='))?.slice(name.length + 1);
const statusPlaceholderOnly = process.argv.includes('--status-placeholder-only');
const membersOnly = process.argv.includes('--members-only') || statusPlaceholderOnly;
const sourceDir = path.resolve(root, arg('--source-dir') || 'impact-cn-mod');
const reportDir = path.resolve(root, arg('--report-dir') || (membersOnly ? 'artifacts/0813-member-select-all-20261019/final' : 'artifacts/0812-settings-20261019/final'));
const capturePath = path.join(root, 'artifacts/0812-settings-20261019/directory-capture.json');
const capture = JSON.parse(readFileSync(capturePath, 'utf8'));
const memberCapturePath = path.join(root, 'artifacts/0813-member-select-all-20261019/member-capture-verified-ancestors.json');
const memberCapture = JSON.parse(readFileSync(memberCapturePath, 'utf8'));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const readDictionary = folder => { const sandbox = {}; vm.createContext(sandbox); vm.runInContext(readFileSync(path.join(folder, 'dict.js'), 'utf8'), sandbox); return sandbox.IMPACT_CN_DICTIONARY; };
const dictionary = readDictionary(sourceDir);
const baseline = readDictionary(path.join(root, 'dist/impact-cn-mod-0.8.11'));
const scopeBaseline = readDictionary(path.join(root, 'dist/impact-cn-mod-0.8.12'));
const manifest = JSON.parse(readFileSync(path.join(sourceDir, 'manifest.json'), 'utf8'));
const sourceFiles = readdirSync(sourceDir, { recursive: true }).filter(file => /\.(?:js|css|html|json)$/u.test(file));
const sourceHashes = Object.fromEntries(sourceFiles.map(file => [file, sha(readFileSync(path.join(sourceDir, file)))]));
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core'))); }

// Human-reviewed expectations are independent of the shipped dictionary and its selectors.
// The native-style fixture below is generated exclusively from the live capture.
const expected = new Map([
  ['Account Settings', '账户设置'], ['Program Settings', '项目设置'],
  ['General', '常规'], ['Branding', '品牌形象'], ['Technical', '技术配置'], ['Tools', '工具'],
  ['Add Account', '添加账户'], ['OAuth Callback', 'OAuth 回调'],
  ['Automate Partner Applications', '合作伙伴申请自动化'], ['Exception Lists', '例外列表'],
  ['Tracking', '追踪'], ['Scoring', '评分'], ['No settings available', '暂无可用设置'],
  ['Account Information', '账户信息'], ['Account Users', '账户用户'],
  ['User Access Groups', '用户访问权限组'], ['Account User Authentication', '账户用户身份验证'],
  ['Template Term Rules', '合作条款模板规则'], ['Manage Programs', '管理推广项目'],
  ['Manage Pre-Selected Partners', '管理预选合作伙伴'], ['Manage Blocked Partners', '管理已屏蔽的合作伙伴'],
  ['Advertiser Login Branding', '品牌方登录页外观'], ['Sign Up Page', '注册页面'],
  ['Partner Console Branding', '合作伙伴控制台外观'], ['System Emails', '系统邮件'],
  ['API', 'API'], ['Data Feeds', '定期数据文件'], ['Event Notifications', '事件通知'],
  ['Cross Program Tracking', '跨推广项目追踪'], ['File Submissions', '文件提交记录'],
  ['Partner Custom Values', '合作伙伴自定义值'], ['Connections', '平台连接'], ['Tracking Domains', '追踪域名'],
  ['Import Prospects', '导入潜在合作伙伴'], ['Import Partners', '导入合作伙伴'], ['impact ai', 'impact ai'],
  ['Customized Reporting Calendar', '自定义报表日历'], ['Marketplace Profile', '合作市场资料'],
  ['Ad Settings', '广告素材设置'], ['Inquiry Options', '补单申请设置'], ['Messaging', '消息设置'],
  ['Application processing by Impact AI', '由 Impact AI 处理申请'], ['Application Workflows', '申请工作流'],
  ['Blocking & Redirect', '屏蔽与重定向'], ['Connected Accounts', '已连接账户'], ['Custom Fields', '自定义字段'],
  ['Category', '商品分类'], ['SKU', 'SKU'], ['Promo Code', '促销码'],
  ['Partner Sign Up Page', '合作伙伴注册页面'], ['System Emails and UI Messages', '系统邮件与界面消息'],
  ['Gateway', '网关追踪设置'], ['Direct', '直接追踪设置'], ['Event Types', '转化事件类型'],
  ['Mobile Apps', '移动应用'], ['Event Scoring & Filtering', '事件评分与过滤'],
  ['Default View', '默认视图'], ['Active', '已启用'], ['Invited', '已邀请'],
  ['Manage', '管理'], ['Invite', '邀请用户'], ['User Access', '用户访问权限'], ['Clear Filters', '清除筛选'],
  ['Name', '姓名'], ['Type', '用户类型'], ['Status', '状态'], ['Two-Factor Authentication', '双重身份验证'],
  ['Access', '访问权限'], ['Last Sign In', '最近登录'], ['Joined', '加入日期'],
  ['Select All', '全选'], ['User access groups', '用户访问权限组'], ['Select', '选择'], ['Clear', '清除'],
  ['All', '全部'], ['Pending Approval', '待批准'], ['Rejected', '已拒绝'],
  ['Manage account details including name and timezone', '管理账户名称、时区等详情'],
  ['Manage your users and set access rights for this account', '管理此账户的用户并设置访问权限'],
  ['Manage user access groups for this account', '管理此账户的用户访问权限组'],
  ['Control the security requirements for users of this account', '设置此账户用户的安全要求'],
  ['Limit how contracts are setup in this account', '限制此账户中合同的设置方式'],
  ['Add or remove programs for this account', '添加或移除此账户的推广项目'],
  ['Manage which partners are automatically added to newly created programs', '管理新建推广项目时自动加入的合作伙伴'],
  ['Remove partners from your application blocklist', '将合作伙伴移出申请屏蔽名单'],
  ['Enable SSO and determine the look and feel of your user login page', '启用单点登录（SSO），并设置用户登录页的外观'],
  ['Determine the look and feel of your partner sign up', '设置合作伙伴注册页面的外观'],
  ["Control your partner's logged in experience", '设置合作伙伴登录后的界面体验'],
  ['Determine the look and feel of partner emails', '设置发送给合作伙伴的邮件外观'],
  ['Access API credentials and upgrade your API version', '查看 API 凭据并升级 API 版本'],
  ['Setup FTP details for a recurring action file', '设置定期转化事件文件的 FTP 详情'],
  ['Setup server to server postbacks based on specific events', '设置基于特定事件的服务器间回传通知'],
  ['Enable tracking between multiple programs', '启用多个推广项目之间的追踪'],
  ['Look up details for past FTP file submissions', '查看以往通过 FTP 提交文件的详情'],
  ['Set up and maintain your partner custom values', '设置并维护合作伙伴自定义值'],
  ['Connect to other platforms to get or post data', '连接其他平台以获取或发送数据'],
  ['Add or create a Custom Tracking Domain that can be used within your links and tags to give a more personalized aesthetic.', '添加或创建自定义追踪域名，用于链接和代码标签，呈现更符合品牌的外观。'],
  ['Upload csv file to create new prospects', '上传 CSV 文件以创建新的潜在合作伙伴记录'],
  ['Upload csv file to create new partner accounts', '上传 CSV 文件以创建新的合作伙伴账户'],
  ['AI-powered toolset designed to supercharge your partnership workflow.', '由 AI 驱动的工具集，帮助提高合作伙伴工作流的效率。'],
  ['Configure your fiscal calendar to be used in Data Lab reporting', '配置用于 Data Lab 报表的财务日历'],
  ['Specify details about this program for partners to view', '设置供合作伙伴查看的推广项目详情'],
  ['Control used ad types and default settings for newly created ads', '设置可用的广告素材类型和新建素材的默认设置'],
  ['Set up automated rules for approving or rejecting missing order inquiries', '设置自动批准或拒绝补单申请的规则'],
  ['Configure your messaging settings', '配置消息设置'],
  ['Leverage AI-powered automation to streamline partner application assessment for Direct and Marketplace applications', '使用 AI 自动化简化对直接申请和合作市场申请的合作伙伴评估'],
  ['Streamline Marketplace and Direct partner application assessment based on your Workflow actions and conditions', '根据工作流的操作和条件，简化对合作市场申请和直接申请的合作伙伴评估'],
  ['Control where partner traffic gets sent to when links are clicked', '设置点击链接后合作伙伴流量的去向'],
  ['View connected accounts', '查看已连接账户'],
  ['Create custom fields to store unique information about your partners', '创建自定义字段，保存合作伙伴的特定信息'],
  ['Set up groupings of product categories that you wish to pay similarly on', '将希望采用相同付款规则的商品分类归组'],
  ['Set up groupings of product SKUs that you wish to pay similarly on', '将希望采用相同付款规则的商品 SKU 归组'],
  ['Set up groupings of promo codes that you wish to adjust payments similarly when used', '将使用时希望采用相同付款调整规则的促销码归组'],
  ['Setup tracking domains, site definitions, and other details about how you wish to track', '设置追踪域名、网站定义及其他追踪详情'],
  ['Determine default behavior for tracking clicks, via our tracking links', '设置通过平台追踪链接记录点击的默认行为'],
  ['Determine default behavior for tracking clicks via our UTT', '设置通过 UTT 记录点击的默认行为'],
  ['Specify the various events you wish to track', '设置要追踪的各类转化事件'],
  ['Specify your mobile apps you wish to track and report on', '设置需要追踪并生成报表的移动应用'],
  ['Configure how clicks and actions should be scored to identify potential fraud and non-human activity.', '配置点击和转化事件的评分方式，以识别潜在作弊与非人类活动。']
]);
const labels = [...capture.titles.map((source, index) => ({ key: 'title-' + index, source })),
  ...capture.groups.map((source, index) => ({ key: 'group-' + index, source })),
  ...capture.items.flatMap((item, index) => [{ key: 'link-' + index, source: item.source, link: true }, { key: 'description-' + index, source: item.description }]),
  ...Array.from({ length: capture.emptyCount }, (_, index) => ({ key: 'empty-' + index, source: capture.emptyText }))];
for (const label of labels) assert(expected.has(label.source), 'Missing independent expected translation for ' + label.source);
const target = label => label.link && label.source === 'General' ? '常规追踪设置' : expected.get(label.source);
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function directoryHTML(shape = 'valid') {
  let groupIndex=0,itemIndex=0,emptyIndex=0;
  const sections=capture.sections.map((section,sectionIndex)=>{const title=`<div class="titleAndSelectHolder"><h3 class="columnTitle" data-fixed-key="title-${sectionIndex}">${escape(section.title)}</h3><button type="button" data-private="selector">Account Users</button></div>`;const columns=section.groups.map(group=>{const heading=`<h2 data-fixed-key="group-${groupIndex++}">${escape(group.title)}</h2>`;const items=Array.from({length:group.linkCount},()=>{const index=itemIndex++,item=capture.items[index];return `<div class="settings-item"><a class="title" data-testid="uicl-hyperlink" href="${escape(item.href)}"><link-text data-fixed-key="link-${index}">${escape(item.source)}</link-text></a><p class="description" data-fixed-key="description-${index}">${escape(item.description)}</p></div>`;}).join('');const empty=group.linkCount===0?`<div class="settings-item"><p data-fixed-key="empty-${emptyIndex++}">${escape(capture.emptyText)}</p></div>`:'';return `<div class="settings-column">${heading}${items}${empty}</div>`;}).join('');return `<section class="settings-section">${title}${columns}</section>`;}).join('');
  assert.equal(itemIndex,capture.items.length);assert.equal(groupIndex,capture.groups.length);assert.equal(emptyIndex,capture.emptyCount);
  const negatives='<section class="settings-section"><div class="settings-item"><a class="title" data-testid="uicl-hyperlink" href="/synthetic/unrelated"><link-text data-private="wrong-href">Account Users</link-text></a><p class="description" data-private="wrong-description">Manage your users and set access rights for this account</p></div><div class="settings-item"><span data-private="business-name">Account Information</span><p class="private-description" data-private="other-class">No settings available</p></div><input id="native-input" value="Account Settings"><input id="native-check" type="checkbox" checked><select id="native-select"><option selected value="Program Settings">Program Settings</option></select><span data-private="amount">$12,345.67</span><span data-private="business-id">SYNTHETIC-ID-8812</span></section>';
  const component = `<div class="app-page"><div class="mainContainer"><div class="sectionContainer">${sections}${negatives}</div></div></div>`;
  const rootId = shape === 'wrong-root' ? 'unrelated-settings-root' : 'vueInstance';
  const light = `<div id="${rootId}">${component}</div><div id="fixture-outside"><h3 class="columnTitle">Account Settings</h3><h2>General</h2><link-text>Account Users</link-text></div>`;
  const bootstrap = shape === 'shadow' ? `const host=document.querySelector('#vueInstance');host.attachShadow({mode:'open'}).innerHTML=${JSON.stringify(`<div id="vueInstance">${component}</div>`)};window.__fixtureRoot=host.shadowRoot.querySelector('#vueInstance');` : 'window.__fixtureRoot=document.querySelector("#' + rootId + '");';
  return `<!doctype html><html><body>${shape === 'shadow' ? '<div id="vueInstance"></div>' : light}<script>${bootstrap}
  window.__captureNative=()=>{const native=window.__fixtureRoot;const elements=[native,...native.querySelectorAll('*')];const nodes=[];const walker=document.createTreeWalker(native,NodeFilter.SHOW_TEXT);while(walker.nextNode())nodes.push({node:walker.currentNode,source:walker.currentNode.nodeValue,fixed:!!walker.currentNode.parentElement.closest('[data-fixed-key]')});window.__nativeProof={root:native,elements:elements.map(element=>({element,parent:element.parentNode,children:[...element.childNodes],attributes:JSON.stringify([...element.attributes].map(a=>[a.name,a.value]))})),nodes,controls:[...native.querySelectorAll('input,select')].map(element=>({element,value:element.value,checked:element.checked})),clicks:0,inputEvents:0};for(const link of native.querySelectorAll('a'))link.addEventListener('click',event=>{event.preventDefault();window.__nativeProof.clicks++});for(const input of native.querySelectorAll('input,select'))input.addEventListener('input',()=>window.__nativeProof.inputEvents++);};window.__captureNative();</script></body></html>`;
}

const memberLabels=[...memberCapture.main,...memberCapture.accessMenu.fixed,...memberCapture.statusMenu.fixed];
for(const label of memberLabels)assert(expected.has(label.source),'Missing independent member expectation: '+label.source);
function memberHTML(shape='valid'){
  const byKey=new Map(memberLabels.map(item=>[item.key,item]));
  const triggerSource=shape==='status-placeholder'?'Status':'Active';
  const field=(key,tag='span',attrs='')=>`<${tag} data-fixed-key="${key}" ${attrs}>${escape(key==='active-filter'?triggerSource:byKey.get(key).source)}</${tag}>`;
  const top=`<div class="top-info">${field('heading','h1')}</div>${field('default-view','span','class="default-label"')}${field('active-tab','div','class="horizontal-tab-item"')}${field('invited-tab','div','class="horizontal-tab-item"')}`;
  const statusField=`<span class="filter" data-testid="uicl-filter--1621662004"><div class="iui-multiselect-input" data-testid="uicl-multiselect-input"><div class="btn-container"><button type="button" is-disabled="false" data-testid="uicl-multi-select-input-button">${field('active-filter')}<!----></button></div></div></span>`;
  const privateFields=['unrelated-field','private-selected-group'].map((key,index)=>`<span class="filter" data-testid="synthetic-other-filter-${index}"><div class="iui-multiselect-input" data-testid="uicl-multiselect-input"><div class="btn-container"><button type="button" is-disabled="false" data-testid="uicl-multi-select-input-button"><span data-private="status-${key}">Status</span></button></div></div></span>`).join('');
  const oldIncorrectField='<span class="filter" data-testid="uicl-filter--1621662004"><span class="filter" data-testid="uicl-filter--1621662004"><div class="iui-multiselect-input" data-testid="uicl-multiselect-input"><div class="btn-container"><button type="button" is-disabled="false" data-testid="uicl-multi-select-input-button"><span data-private="old-double-filter-chain">Status</span></button></div></div></span></span>';
  const header=`<div class="data-header">${field('manage','button','type="button" data-testid="uicl-button-menu"')}${field('invite','button','type="button" data-testid="uicl-button-menu"')}<button type="button" data-testid="uicl-button">${field('access-filter')}</button>${field('clear-filters','button','type="button" class="clearButton" data-testid="uicl-button"')}<div class="iui-component iui-filter-section">${statusField}${privateFields}</div>${oldIncorrectField}<span data-private="counter">125</span><div class="bulk-actions-and-sort"><span class="select-all">${field('select-all','span','class="" data-testid="uicl-data-view-select-all"')}</span></div></div>`;
  const table=`<div class="table-header">${memberCapture.main.filter(item=>item.key.endsWith('-column')).map(item=>field(item.key,'span','class="column-label"')).join('')}<span class="select-all"><span data-testid="uicl-data-view-select-all" data-private="incorrect-table-header-select-all">Select All</span></span></div><div class="table-body"><div class="table-row"><span data-private="user-name">Active</span><span data-private="user-access">Select All</span><span class="column-label" data-private="business-column">Name</span><span data-private="user-email">synthetic@example.invalid</span><span data-private="business-id">SYNTHETIC-MEMBER-ID-0812</span></div></div>`;
  // The main selection control follows the independently observed seven ancestors;
  // the previous incorrect table-header location is retained as a protected negative.
  const main=`<div class="app-page">${top}<section class="iui-component iui-page-section"><div class="iui-component iui-data-view" data-testid="uicl-dataview"><div>${header}${table}</div></div></section><input id="native-input" value="Account Users"><input id="native-check" type="checkbox" checked><select id="native-select"><option value="Select All" selected>Select All</option></select></div>`;
  const access=`<div id="${shape==='wrong-menu'?'unrelatedAccessFilterDropdown':'userAccessFilterDropdown'}" data-native-menu="access" class="iui-dropdown in-btn-menu in-multiselect-input" data-testid="uicl-dropdown"><button type="button" data-testid="uicl-multi-select-input-button"><span class="value">${field('access-groups')}</span></button><button type="button" data-testid="uicl-multi-select-input-button" is-disabled="true">${field('access-select','span','class="please-select"')}</button>${field('access-select-all','button','type="button" data-testid="uicl-button"')}${field('access-clear','button','type="button" data-testid="uicl-button"')}<ul role="listbox">${['Select','Clear','Active','All','Pending Approval','Rejected','User access groups','Select All','Account Users'].map((text,index)=>`<li role="option"><span data-private="access-option-${index}">${text}</span></li>`).join('')}<li role="option"><button type="button" data-testid="uicl-button" data-private="adversarial-access-option-button">Clear</button></li></ul></div>`;
  const status=`<div ${shape==='status-with-id'?'id="unrelatedStatusDropdown" ':''}data-native-menu="status" class="iui-dropdown in-multiselect-input ${shape==='wrong-menu'?'in-multiple-select':'in-single-select'}" data-testid="uicl-dropdown"><ul role="listbox">${memberCapture.statusMenu.fixed.filter(item=>item.tag==='li').map(item=>field(item.key,'li','role="option"')).join('')}</ul><button type="button" data-fixed-key="status-clear" data-testid="uicl-multi-select-input-clear-button"><!----> Clear <!----></button><button type="button" data-testid="uicl-button" data-private="incorrect-generic-status-clear">Clear</button></div>`;
  const other='<div data-native-menu="unrelated" class="iui-dropdown in-multiselect-input in-btn-menu" data-testid="uicl-dropdown"><ul role="listbox"><li role="option" data-private="unrelated-status">Active</li></ul><button type="button" data-testid="uicl-button" data-private="unrelated-clear">Clear</button></div>';
  const rootId=shape==='wrong-root'?'unrelated-member-root':'vueInstance';
  const content=`<div id="${rootId}">${shape==='wrong-owner'?main.replace('class="top-info"','class="unrelated-info"'):main}</div>${access}${shape==='nested-status'?'<section>'+status+'</section>':status}${other}`;
  const bootstrap=shape==='shadow'?`const host=document.querySelector('#vueInstance');const shadow=host.attachShadow({mode:'open'});shadow.innerHTML=${JSON.stringify(content)};window.__fixtureRoot=shadow;`:'window.__fixtureRoot=document;';
  return `<!doctype html><html><body>${shape==='shadow'?'<div id="vueInstance"></div>':content}<script>${bootstrap}
  window.__memberSources=${JSON.stringify(Object.fromEntries(memberLabels.map(item=>[item.key,item.key==='active-filter'?triggerSource:item.source])))};
  window.__captureNative=()=>{const scope=window.__fixtureRoot;const native=scope.querySelector('#${rootId}');const roots=[native,...scope.querySelectorAll('[data-native-menu]')];const elements=roots.flatMap(root=>[root,...root.querySelectorAll('*')]);const nodes=[];for(const root of roots){const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(walker.nextNode()){const node=walker.currentNode,fixed=node.parentElement.closest('[data-fixed-key]');nodes.push({node,source:fixed?node.nodeValue.match(/^\\s*/u)[0]+window.__memberSources[fixed.dataset.fixedKey]+node.nodeValue.match(/\\s*$/u)[0]:node.nodeValue,fixed:!!fixed});}}window.__nativeProof={root:native,elements:elements.map(element=>({element,parent:element.parentNode,children:[...element.childNodes],attributes:JSON.stringify([...element.attributes].map(a=>[a.name,a.value]))})),nodes,controls:elements.filter(element=>element.matches('input,select')).map(element=>({element,value:element.value,checked:element.checked})),clicks:0,inputEvents:0};for(const button of scope.querySelectorAll('button'))button.addEventListener('click',event=>{event.preventDefault();window.__nativeProof.clicks++});for(const input of scope.querySelectorAll('input,select'))input.addEventListener('input',()=>window.__nativeProof.inputEvents++);};window.__captureNative();
  window.__remountMenus=()=>{for(const key of ['access','status']){const old=window.__fixtureRoot.querySelector('[data-native-menu="'+key+'"]');const replacement=old.cloneNode(true);for(const element of replacement.querySelectorAll('[data-fixed-key]')){const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);while(walker.nextNode()){const node=walker.currentNode;node.nodeValue=node.nodeValue.match(/^\\s*/u)[0]+window.__memberSources[element.dataset.fixedKey]+node.nodeValue.match(/\\s*$/u)[0];}}old.replaceWith(replacement);}window.__captureNative();};
  </script></body></html>`;
}

const results = [];
const expectedChecks=statusPlaceholderOnly?3:6;
const temporary = mkdtempSync(path.join(os.tmpdir(), 'impact-account-settings-'));
const extension = path.join(temporary, 'extension');
cpSync(sourceDir, extension, { recursive: true });
let context, page, worker;
async function check(name, action) {
  try { const evidence = await action(); results.push({ name, status: 'PASS', evidence }); console.log('ACCOUNT SETTINGS PASS ' + name); }
  catch (error) { results.push({ name, status: 'FAIL', evidence: error.message }); console.log('ACCOUNT SETTINGS FAIL ' + name + ': ' + error.message); }
}
async function settings(enabled, aiEnabled) {
  await worker.evaluate(value => chrome.storage.local.set({ impactCNEnabled: value.enabled, impactCNAIEnabled: value.aiEnabled }), { enabled, aiEnabled });
  if(await page.locator('#impact-cn-assistant').count())await page.waitForFunction(value=>{const assistant=document.querySelector('#impact-cn-assistant');return assistant?.dataset.enabled===String(value.enabled)&&assistant?.dataset.aiEnabled===String(value.aiEnabled);},{enabled,aiEnabled});
}
async function waitLabels(frame, translated) {
  const expectedTexts = Object.fromEntries(labels.map(label => [label.key, translated ? target(label) : label.source]));
  try { await frame.waitForFunction(expectedTexts => Object.entries(expectedTexts).every(([key, text]) => window.__fixtureRoot.querySelector('[data-fixed-key="' + key + '"]')?.textContent.replace(/\s+/gu, ' ').trim() === text), expectedTexts, { timeout: 5000 }); }
  catch(error) { const mismatches=await frame.evaluate(expectedTexts=>Object.entries(expectedTexts).map(([key,expected])=>({key,expected,actual:window.__fixtureRoot.querySelector('[data-fixed-key="'+key+'"]')?.textContent.replace(/\s+/gu,' ').trim()})).filter(item=>item.expected!==item.actual),expectedTexts);throw new Error(error.message+'; fixed Text mismatches '+JSON.stringify(mismatches.slice(0,8))+'; total '+mismatches.length); }
  const actual = await frame.evaluate(() => Object.fromEntries([...window.__fixtureRoot.querySelectorAll('[data-fixed-key]')].map(element => [element.dataset.fixedKey, element.textContent.replace(/\s+/gu, ' ').trim()])));
  assert.deepEqual(actual, expectedTexts);
}
async function assertNative(frame, restored = false) {
  assert(await frame.evaluate(restored => { const p=window.__nativeProof;return p.root.isConnected && p.elements.every(({element,parent,children,attributes})=>element.isConnected&&element.parentNode===parent&&element.childNodes.length===children.length&&children.every((node,index)=>element.childNodes[index]===node)&&JSON.stringify([...element.attributes].map(a=>[a.name,a.value]))===attributes)&&p.nodes.every(({node,source,fixed})=>node.isConnected&&(!restored&&fixed||node.nodeValue===source))&&p.controls.every(({element,value,checked})=>element.value===value&&element.checked===checked)&&p.inputEvents===0; }, restored), 'Native node identity, structure, attributes, events or protected values changed');
}
async function open(shape = 'valid', pathname = capture.path, host = 'demo.impact.com') {
  await page.goto('https://' + host + pathname + '?fixture-shape=' + shape);
  await page.waitForFunction(() => !!window.__nativeProof);
}
async function waitMember(frame,translated,{access=translated,status=translated,heading=translated}={}){
  const texts=Object.fromEntries(memberLabels.map(item=>{const on=item.key==='heading'?heading:memberCapture.accessMenu.fixed.some(label=>label.key===item.key)?access:memberCapture.statusMenu.fixed.some(label=>label.key===item.key)?status:translated;return[item.key,on?expected.get(item.source):item.source];}));
  try{await frame.waitForFunction(texts=>Object.entries(texts).every(([key,text])=>window.__fixtureRoot.querySelector('[data-fixed-key="'+key+'"]')?.textContent.replace(/\s+/gu,' ').trim()===text),texts,{timeout:5000});}
  catch(error){const mismatches=await frame.evaluate(texts=>Object.entries(texts).map(([key,expected])=>({key,expected,actual:window.__fixtureRoot.querySelector('[data-fixed-key="'+key+'"]')?.textContent.replace(/\s+/gu,' ').trim()})).filter(item=>item.expected!==item.actual),texts);throw new Error(error.message+'; member Text mismatches '+JSON.stringify(mismatches.slice(0,8))+'; total '+mismatches.length);}
}
async function waitStatusTrigger(source,translated){
  const targetText=translated?expected.get(source):source;
  try{await page.waitForFunction(text=>document.querySelector('[data-fixed-key="active-filter"]')?.textContent.replace(/\s+/gu,' ').trim()===text,targetText,{timeout:5000});}
  catch(error){throw new Error(error.message+'; fixed status-filter trigger expected '+JSON.stringify(targetText)+', actual '+JSON.stringify(await page.locator('[data-fixed-key="active-filter"]').textContent()));}
}
async function statusPlaceholderCycle(){
  await open('status-placeholder',memberCapture.path);
  assert(await page.evaluate(()=>{const element=document.querySelector('[data-fixed-key="active-filter"]'),ancestors=['button[data-testid="uicl-multi-select-input-button"]','div.btn-container','div.iui-multiselect-input[data-testid="uicl-multiselect-input"]','span.filter[data-testid="uicl-filter--1621662004"]','div.iui-component.iui-filter-section','div.data-header','div:not([class])','div.iui-data-view[data-testid="uicl-dataview"]'];let parent=element.parentElement;for(const selector of ancestors){if(!parent?.matches(selector))return false;parent=parent.parentElement;}window.__statusCycleProof={element,node:element.firstChild,parent:element.parentNode};return !element.hasAttribute('class');}),'Status placeholder fixture must preserve all eight independently verified ancestors and its Text parent');
  await waitStatusTrigger('Status',true);await assertNative(page);
  for(const source of ['Active','Status']){
    await page.evaluate(source=>{const proof=window.__statusCycleProof;proof.node.nodeValue=source;window.__memberSources['active-filter']=source;const record=window.__nativeProof.nodes.find(record=>record.node===proof.node);record.source=source;},source);
    await waitStatusTrigger(source,true);await assertNative(page);
    assert(await page.evaluate(()=>{const proof=window.__statusCycleProof;return proof.element.isConnected&&proof.element.firstChild===proof.node&&proof.element.parentNode===proof.parent;}),'Native status value changes must preserve the same field and Text node');
  }
  await settings(false,true);await waitStatusTrigger('Status',false);await assertNative(page,true);
  await settings(true,false);await waitStatusTrigger('Status',true);await assertNative(page);
  await page.reload();await waitStatusTrigger('Status',true);await assertNative(page);
  return{sequence:['Status','Active','Status'],oneNativeField:true,nativeTextIdentity:true,verifiedAncestorCount:8,sameTextPrivateFieldsPreserved:2,oldDoubleFilterChainPreserved:true,reloads:1,translationRestoresCurrentSource:true};
}
async function runMemberChecks(){
  await check('Standalone member header tabs controls and both observed filter menus translate automatically; private groups remain English',async()=>{
    for(const host of ['demo.impact.com','app.impact.com']){await open('valid',memberCapture.path,host);assert(await page.evaluate(()=>{const selection=document.querySelector('[data-fixed-key="select-all"]');const ancestors=['span.select-all','div.bulk-actions-and-sort','div.data-header','div:not([class])','div.iui-component.iui-data-view[data-testid="uicl-dataview"]','section.iui-component.iui-page-section','div.app-page'];let parent=selection.parentElement;for(const selector of ancestors){if(!parent?.matches(selector))return false;parent=parent.parentElement;}const clear=document.querySelector('[data-fixed-key="status-clear"]');return selection.getAttribute('class')===''&&clear.matches('button[data-testid="uicl-multi-select-input-clear-button"]')&&[...clear.childNodes].filter(node=>node.nodeType===Node.TEXT_NODE).length===1&&[...clear.childNodes].filter(node=>node.nodeType===Node.COMMENT_NODE).length===2;}),'Corrected fixture must preserve independently observed selection ancestors and status-Clear Text parent/comments');await waitMember(page,true);await assertNative(page);assert.equal(await page.locator('#userAccessFilterDropdown button[is-disabled]').getAttribute('is-disabled'),'true');}return{mainText:17,accessMenuText:4,statusMenuText:5,privateGroupNamesRetained:10,syntheticHosts:['demo.impact.com','app.impact.com'],correctedSelectionAncestors:7,statusClearNativeComments:2};
  });
  await check('Standalone member translation restores original Text and preserves native handlers attributes values and independent AI',async()=>{
    await settings(false,true);await waitMember(page,false);await assertNative(page,true);await settings(true,true);await waitMember(page,true);await assertNative(page);await page.locator('[data-fixed-key="manage"]').click();assert.equal(await page.evaluate(()=>window.__nativeProof.clicks),1);await settings(true,false);await waitMember(page,true);await assertNative(page);return{translationStates:['off','on'],AIStates:[true,false],nativeClicks:1,protectedControls:3};
  });
  await check('Both member filter menus translate after mounting and remounting, and ordinary refresh needs no switch operation',async()=>{
    await open('valid',memberCapture.path);await waitMember(page,true);for(let index=0;index<2;index++){await page.evaluate(()=>window.__remountMenus());await waitMember(page,true);await assertNative(page);}await page.reload();await waitMember(page,true);await assertNative(page);const placeholder=await statusPlaceholderCycle();return{remountsPerMenu:2,reloads:1,switchOperationsAfterNavigation:0,placeholder};
  });
  await check('Standalone member additions reject wrong routes roots Shadow frames and unrelated dropdowns without changing Checklist rules',async()=>{
    await settings(true,false);for(const[shape,pathname,host]of [['valid',memberCapture.path+'/extra','demo.impact.com'],['valid','/secure/advertiser/engage/aview.ihtml','demo.impact.com'],['wrong-root',memberCapture.path,'demo.impact.com'],['shadow',memberCapture.path,'demo.impact.com'],['valid',memberCapture.path,'other.example']]){await open(shape,pathname,host);await page.waitForTimeout(500);await waitMember(page,false);await assertNative(page,true);}await page.goto('https://demo.impact.com/synthetic/frame-parent');const frame=page.frames().find(value=>new URL(value.url()).pathname===memberCapture.path)||await page.waitForEvent('frameattached').then(async value=>{await value.waitForLoadState();return value});await frame.waitForFunction(()=>!!window.__nativeProof);await page.waitForTimeout(500);await waitMember(frame,false);await assertNative(frame,true);await open('wrong-menu',memberCapture.path);await waitMember(page,true,{access:false,status:false});await assertNative(page);for(const shape of ['status-with-id','nested-status']){await open(shape,memberCapture.path);await waitMember(page,true,{status:false});await assertNative(page);}await open('wrong-owner',memberCapture.path);await waitMember(page,true,{access:false,status:false,heading:false});await assertNative(page);await open('valid',memberCapture.path);await waitMember(page,true);await assertNative(page);return{negativeDocumentVariants:6,wrongMenuVariants:3,wrongOwnerVariants:1,checklistFrameRulesUnchanged:16};
  });
}

try {
  context = await chromium.launchPersistentContext(path.join(temporary, 'profile'), { executablePath: chromium.executablePath(), channel: 'chromium', headless: true, args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`] });
  await context.route(/https?:\/\//u, route => { const url=new URL(route.request().url());return route.fulfill({contentType:'text/html',body:url.pathname==='/synthetic/frame-parent'?'<!doctype html><body><div id="vueInstance"><iframe id="native-settings-frame" src="https://demo.impact.com'+(membersOnly?memberCapture.path:capture.path)+'?fixture-shape=valid"></iframe></div></body>':membersOnly?memberHTML(url.searchParams.get('fixture-shape')||'valid'):directoryHTML(url.searchParams.get('fixture-shape')||'valid')}); });
  page=context.pages()[0]||await context.newPage();page.setDefaultTimeout(6000);
  await open('valid',membersOnly?memberCapture.path:capture.path);
  await page.locator('#impact-cn-assistant').waitFor();
  worker=context.serviceWorkers().find(value=>value.url().startsWith('chrome-extension://'))||await context.waitForEvent('serviceworker',{timeout:7000});
  await settings(true,false);

  await check('Original dictionary content remains unchanged except two observed scope corrections and one fixed status-placeholder entry',async()=>{
    assert.equal(baseline.entries.length,7251);assert.equal(baseline.helpTopics.length,155);
    const currentById=new Map(dictionary.entries.map(item=>[item.id,item]));
    for(const original of baseline.entries)assert.equal(JSON.stringify(currentById.get(original.id)),JSON.stringify(original),'Original entry changed: '+original.id);
    assert.equal(JSON.stringify(dictionary.helpTopics),JSON.stringify(baseline.helpTopics));
    const additions=dictionary.entries.filter(item=>!baseline.entries.some(original=>original.id===item.id));
    const directoryAdditions=additions.filter(item=>item.id.startsWith('account-settings-directory-'));
    const memberAdditions=additions.filter(item=>item.id.startsWith('account-users-standalone-'));
    const previousSource=path.resolve(sourceDir)===path.join(root,'dist/impact-cn-mod-0.8.12');
    if(path.resolve(sourceDir)!==path.join(root,'dist/impact-cn-mod-0.8.11')){assert.equal(directoryAdditions.length,98);assert.equal(memberAdditions.length,previousSource?26:27);assert.equal(additions.length,previousSource?124:125);}
    for(const item of additions){assert.equal(item.match,'exact');assert.equal(JSON.stringify(item.scope.hosts),JSON.stringify(['demo.impact.com','app.impact.com']));assert.equal(item.scope.topOnly,true);assert.equal(item.scope.lightDOMOnly,true);assert.equal(item.scope.checklistFrame,undefined);}
    for(const item of directoryAdditions){assert.equal(item.scope.pathExact,capture.path);assert(item.scope.selector.startsWith(capture.rootSelector+' > '+capture.sectionSelector));assert(!['API','SKU','impact ai'].includes(item.source));}
    for(const item of memberAdditions){assert.equal(item.scope.pathExact,memberCapture.path);if(!memberCapture.main.some(original=>'account-users-standalone-'+original.key===item.id))assert.equal(JSON.stringify(item.scope.contextText),JSON.stringify([{selector:'#vueInstance .top-info h1',texts:['Account Users','账户用户']}]));}
    if(dictionary.entries.length>=7375){
      assert.equal(scopeBaseline.entries.length,7375);assert.equal(JSON.stringify(dictionary.helpTopics),JSON.stringify(scopeBaseline.helpTopics));
      for(const original of scopeBaseline.entries){const actual=currentById.get(original.id),expectedEntry=JSON.parse(JSON.stringify(original));if(original.id==='account-users-standalone-select-all')expectedEntry.scope.selector=actual.scope.selector;if(original.id==='account-users-standalone-status-clear'){expectedEntry.scope.selector=actual.scope.selector;expectedEntry.scope.textParentSelector=actual.scope.textParentSelector;}assert.equal(JSON.stringify(actual),JSON.stringify(expectedEntry),'Unexpected 0.8.12 entry change: '+original.id);}
      if(!previousSource){assert.equal(dictionary.entries.length,7376);assert.equal(currentById.get('account-users-standalone-select-all').scope.selector,memberCapture.main.find(item=>item.key==='select-all').selector);assert.equal(currentById.get('account-users-standalone-status-clear').scope.selector,memberCapture.statusMenu.rootSelector+':not([id]) button[data-testid="uicl-multi-select-input-clear-button"]');assert.equal(currentById.get('account-users-standalone-status-clear').scope.textParentSelector,'button[data-testid="uicl-multi-select-input-clear-button"]');const placeholder=currentById.get('account-users-standalone-status-placeholder');assert(placeholder);assert.equal(placeholder.source,'Status');assert.equal(placeholder.target,'状态');assert.equal(placeholder.scope.selector,memberCapture.statusPlaceholderSupplement.selector);assert.equal(placeholder.scope.textParentSelector,'span');}
    }
    return {baselineEntries:baseline.entries.length,baselineTopics:baseline.helpTopics.length,baselineEntriesSHA256:sha(JSON.stringify(baseline.entries)),baselineTopicsSHA256:sha(JSON.stringify(baseline.helpTopics)),scopeBaselineEntries:scopeBaseline.entries.length,allowedScopeCorrections:['account-users-standalone-select-all','account-users-standalone-status-clear'],addedStatusPlaceholderEntries:dictionary.entries.length-scopeBaseline.entries.length,directoryAdditions:additions.filter(item=>item.id.startsWith('account-settings-directory-')).length};
  });
  if(statusPlaceholderOnly)await check('Observed Status placeholder transitions to Active and back in one native field, restoring Text and protecting same-name private fields',statusPlaceholderCycle);
  else if(membersOnly)await runMemberChecks();
  else{
  await check('Captured 2 titles, 13 group occurrences, 44 links and descriptions, and 2 empty states translate automatically',async()=>{
    for(const host of ['demo.impact.com','app.impact.com']){await open('valid',capture.path,host);await waitLabels(page,true);await assertNative(page);}
    return {fixedNodes:labels.length,unchangedTechnicalLabels:['API','SKU','impact ai'],linkGeneralTarget:'常规追踪设置',groupGeneralTarget:'常规',syntheticHosts:['demo.impact.com','app.impact.com']};
  });
  await check('Turning translation off restores original Text; reopening preserves handlers, values and independent AI switch',async()=>{
    await settings(false,true);await waitLabels(page,false);await assertNative(page,true);
    assert.equal(await page.locator('#impact-cn-assistant').getAttribute('data-ai-enabled'),'true');
    await settings(true,true);await waitLabels(page,true);await assertNative(page);
    await page.locator('[data-fixed-key="link-1"]').click();assert.equal(await page.evaluate(()=>window.__nativeProof.clicks),1);
    await settings(true,false);await waitLabels(page,true);assert.equal(await page.locator('#impact-cn-assistant').getAttribute('data-ai-enabled'),'false');await assertNative(page);
    return {translationStates:['off','on'],AIStates:[true,false],nativeClickHandler:1,protectedControls:3};
  });
  await check('New directory subtree mounting, remounting and ordinary reload translate without another switch operation',async()=>{
    await settings(true,false);await open();await waitLabels(page,true);
    for(let index=0;index<2;index++){await page.evaluate(()=>{const old=window.__fixtureRoot;const replacement=old.cloneNode(true);for(const [index,element]of [...replacement.querySelectorAll('[data-fixed-key]')].entries())element.textContent=window.__nativeProof.nodes.filter(record=>record.fixed)[index].source;old.replaceWith(replacement);window.__fixtureRoot=replacement;window.__captureNative();});await waitLabels(page,true);await assertNative(page);}
    await page.reload();await waitLabels(page,true);await assertNative(page);
    return {remounts:2,reloads:1,switchOperationsAfterNavigation:0};
  });
  await check('Exact route, root, light DOM, top document and per-href component guards reject unrelated fixed-looking text',async()=>{
    await settings(true,false);
    for(const [shape,pathname,host]of [['valid',capture.path+'/extra','demo.impact.com'],['valid','/secure/advertiser/engage/aview.ihtml','demo.impact.com'],['wrong-root',capture.path,'demo.impact.com'],['shadow',capture.path,'demo.impact.com'],['valid',capture.path,'other.example']]){await open(shape,pathname,host);await page.waitForTimeout(500);await waitLabels(page,false);await assertNative(page,true);}
    await page.goto('https://demo.impact.com/synthetic/frame-parent');const frame=page.frames().find(value=>new URL(value.url()).pathname===capture.path)||await page.waitForEvent('frameattached').then(async value=>{await value.waitForLoadState();return value});await frame.waitForFunction(()=>!!window.__nativeProof);await page.waitForTimeout(600);await waitLabels(frame,false);await assertNative(frame,true);
    await open();await waitLabels(page,true);await assertNative(page);
    assert.deepEqual(await page.locator('#fixture-outside').allTextContents(),['Account SettingsGeneralAccount Users']);
    return {negativeVariants:6,perHrefAndBusinessNamesPreserved:true};
  });
  }
  await check('Loaded temporary MV3 and source files retain their captured bytes throughout tests',async()=>{
    for(const[file,hash]of Object.entries(sourceHashes)){assert.equal(sha(readFileSync(path.join(sourceDir,file))),hash,file+' source changed during test');assert.equal(sha(readFileSync(path.join(extension,file))),hash,file+' temporary extension changed during test');}
    return {files:sourceFiles.length};
  });
} finally {
  await context?.close();mkdirSync(reportDir,{recursive:true});
  const report={mode:statusPlaceholderOnly?'SYNTHETIC_CAPTURED_STATUS_PLACEHOLDER_ONLY':membersOnly?'SYNTHETIC_CAPTURED_STANDALONE_MEMBERS_MV3':'SYNTHETIC_CAPTURED_ACCOUNT_SETTINGS_DIRECTORY_MV3',version:manifest.version,sourceDirectory:path.relative(root,sourceDir),realSiteAcceptance:false,realNetworkQueries:false,captureSHA256:sha(readFileSync(membersOnly?memberCapturePath:capturePath)),sourceSHA256:sourceHashes,status:results.length===expectedChecks&&results.every(item=>item.status==='PASS')?'PASS':'FAIL',results};
  const reportPath=path.join(reportDir,'account-settings-'+new Date().toISOString().replace(/[:.]/gu,'-')+'.json');writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');console.log('Account settings report: '+reportPath);rmSync(temporary,{recursive:true,force:true});
}
assert(results.length===expectedChecks&&results.every(item=>item.status==='PASS'),'Targeted account settings check failed');

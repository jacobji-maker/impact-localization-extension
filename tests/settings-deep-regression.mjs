/** New settings detail components, isolated synthetic MV3 documents only. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, cpSync, rmSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const testSHA256 = createHash('sha256').update(readFileSync(fileURLToPath(import.meta.url))).digest('hex');
const arg = name => process.argv.find(value => value.startsWith(name + '='))?.slice(name.length + 1);
const sourceDir = path.resolve(root, arg('--source-dir') || 'impact-cn-mod');
const capturePath = path.resolve(root, arg('--capture') || 'artifacts/0814-settings-deep-20261019/public-capture.json');
const expectationsPath = arg('--expectations') ? path.resolve(root,arg('--expectations')) : null;
const expectationsBytes = expectationsPath ? readFileSync(expectationsPath) : null;
const reviewedExpectations = expectationsBytes ? JSON.parse(expectationsBytes) : null;
const reportDir = path.resolve(root, arg('--report-dir') || 'artifacts/0814-settings-deep-20261019');
const pageFilter = arg('--page')?.split(',');
const typeFilter = arg('--component-type');
const requireSourceUnchanged = process.argv.includes('--require-source-unchanged');
const baselineObservation = process.argv.includes('--baseline-observation');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const sourceFiles = readdirSync(sourceDir, { recursive: true }).filter(file => path.basename(file)!=='.DS_Store' && statSync(path.join(sourceDir,file)).isFile());
const sourceHashes = Object.fromEntries(sourceFiles.map(file => [file, sha(readFileSync(path.join(sourceDir, file)))]));
const captureBytes = readFileSync(capturePath);
const capture = JSON.parse(captureBytes);
const manifest = JSON.parse(readFileSync(path.join(sourceDir, 'manifest.json'), 'utf8'));
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core'))); }

// Reviewed expectations stay independent of the shipped dictionary and its selectors.
// Context-specific labels use page-id/key; shared fixed labels can use their source.
const expected = new Map([
  ['Account Information', '账户信息'],
  ['Save', '保存'], ['Viewing account settings for', '当前查看以下账户的设置：'],
  ['Basic Information', '基本信息'], ['Contacts', '联系人'],
  ['account-information/account-name', '账户名称'], ['account-information/contact-name', '姓名'],
  ['Website', '网站'], ['Industry', '行业'], ['Phone Number', '电话号码'],
  ['Primary', '主要'], ['Secondary', '备用'], ['Timezone', '时区'], ['Addresses', '地址'],
  ['Corporate Address', '公司地址'], ['Street Address 1', '街道地址1'],
  ['Street Address 2', '街道地址2'], ['City', '城市'], ['Country/Region', '国家/地区'],
  ['Zip / Postcode', '邮政编码'], ['State', '省/州'], ['Technical Contact', '技术联系人'],
  ['Email', '邮箱'], ['Work Phone', '办公电话'], ['Cell Phone', '手机号码'],
  ['Commercial Contact', '商务联系人'], ['Security Contact', '安全联系人'],
  ['Existing Account User', '现有账户用户'], ['New Contact', '新联系人'], ['Select', '选择'],
  ['account-information/select-placeholder', '请选择'],
  ['Custom Notifications', '自定义通知'], ['Create Custom Notifications', '创建自定义通知'],
  ['Name', '名称'], ['Account', '账户'], ['Run Period', '运行周期'], ['Status', '状态'],
  ['Subscribed', '已订阅'], ['Owner', '所有者'], ['Shared', '已共享'], ['Type', '类型'],
  ['User Access Group', '用户访问权限组'], ['Group Name', '组名称'],
  ['Users Assigned', '已分配用户'], ['Created By', '创建人'], ['Created Date', '创建日期'],
  ['Last Updated By', '最近更新人'], ['Last Updated Date', '最近更新日期'],
  ['Manage Custom Roles', '管理自定义角色'], ['Create User Access Group', '创建用户访问权限组'],
  ['Account User Authentication', '账户用户身份验证'], ['Authentication Type', '身份验证类型'],
  ['User Signup Method', '用户注册方式'], ['Recent Passwords', '最近使用过的密码'],
  ['Password Change Frequency', '密码更改频率'], ['User Login', '用户登录'],
  ['Partner Funds Transfer', '合作伙伴资金转账'],
  ['Define how users sign up to join your account.', '设置用户注册并加入此账户的方式。'],
  ['Single sign-on (SSO)', '单点登录（SSO）'],
  ['Prevent users from reusing recently used passwords', '禁止用户重复使用近期用过的密码'],
  ['Require users of this account to change their password on a periodic basis', '要求此账户用户定期更改密码'],
  ['Frequency', '频率'], ['Require users of this account to verify their identity upon login', '要求此账户用户在登录时验证身份'],
  ['Require users of this account to verify their identity when initiating a partner funds transfer', '要求此账户用户向合作伙伴转账时验证身份'],
  ['Transfer minimum', '转账身份核验门槛'], ['Manage Programs', '管理推广项目'],
  ['manage-programs/heading', '管理项目'], ['manage-programs/column-name', '项目名称'],
  ['Setup Completion Date', '配置完成日期'], ['Activation Date', '启用日期'],
  ['Hide in marketplace', '在合作市场中隐藏'], ['Create Program', '创建项目'],
  ['Pre-Selected Partners', '预选合作伙伴'], ['Partner Name', '合作伙伴名称'],
  ['Partner Size', '合作伙伴规模'], ['Business Model', '业务模式'], ['Properties', '媒体资源'],
  ['Partner Country', '合作伙伴所在国家/地区'], ['Program Types', '项目类型'],
  ['Added On', '添加日期'], ['Added By', '添加人'], ['Clear Filters', '清除筛选']
]);

// Projections use captured semantic roles/known ancestors, not dictionary selectors.
// They are synthetic component projections, not complete live-DOM clones.
// Tree elements: {tag, attrs, children}; Text: {text, fixedKey?}; comments: {comment}.
const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const scriptJSON = value => JSON.stringify(value).replaceAll('<', '\\u003c');
const pages = (capture.pages || []).filter(page => page.fixedText?.length && (!pageFilter || pageFilter.includes(page.id)) && (!typeFilter || page.componentKind === typeFilter));
assert(pages.length, 'No captured page matches the requested selection');
for (const page of pages) {
  assert(page.pathExact?.startsWith('/')||page.pathPrefix?.startsWith('/')&&page.fixtureDocumentPath?.startsWith(page.pathPrefix), 'An observed exact path or explicit public prefix with a synthetic representative path is required for ' + page.id);
  assert(page.fixedText?.length, 'No captured fixed Text in ' + page.id);
  for (const label of page.fixedText) {
    assert(label.scopeStatus !== 'unobserved', 'Unobserved fixed Text cannot enter a passing fixture: ' + page.id + '/' + label.key);
  }
}
const expectationItems=reviewedExpectations?.expectations||reviewedExpectations?.items||[];
if(reviewedExpectations)assert(expectationItems.length,'Public expectation file must contain nonempty expectations or items');
for (const item of expectationItems) {
  assert(typeof item.page==='string'&&typeof item.key==='string'&&typeof item.source==='string'&&typeof item.target==='string','Invalid independent public test expectation');
  const capturedPage=pages.find(page=>page.id===item.page),capturedLabel=capturedPage?.fixedText.find(label=>label.key===item.key);
  if(capturedLabel)assert.equal(capturedLabel.source,item.source,'Public test expectation does not match captured source: '+item.page+'/'+item.key);
  expected.set(item.page+'/'+item.key,item.target);
}
for(const page of pages)for(const label of page.fixedText)assert(expected.has(page.id+'/'+label.key)||expected.has(label.source),'Missing independent translation expectation: '+page.id+'/'+label.key+' ('+label.source+')');
const labelExpectation = (page, label, translated) => translated ? expected.get(page.id + '/' + label.key) ?? expected.get(label.source) : label.source;
const componentKind = page => page.id==='notification-frequency' ? 'notification-frequency' : page.observedComponents?.statusMenuProjection?'access-group-status-menu':page.observedComponents?.timingRowsProjection&&page.fixedText.some(label=>label.key==='timing-actions-locked')?'template-time-rules': page.componentKind || (page.id === 'account-information' ? 'account-contact-form' : page.fixedText.some(label => /field-label-typography/u.test(label.observedTextParent || label.textParentSelector || '')) ? 'semantic-form' : page.fixedText.some(label => /column-label/u.test(label.observedTextParent || label.textParentSelector || '')) ? 'list-columns' : 'public-fixed-roles');
const documentPath=page=>page.pathExact||page.fixtureDocumentPath;
const representatives = [...new Map(pages.map(page => [componentKind(page), page])).values()];
const element = (tag, attrs = {}, children = []) => ({ tag, attrs, children });
const fixedText = label => ({ text: label.rawText ?? label.source, fixedKey: label.key });

function capturedLeaf(label) {
  const actual = label.observedTextParent || label.textParent || label.textParentSelector;
  if (actual && typeof actual === 'object') return element(actual.tag, actual.attrs || actual.attributes || {}, [fixedText(label)]);
  assert(typeof actual === 'string', 'Captured Text parent is required for ' + label.key);
  // A class-only captured role has no asserted native tag. Its synthetic span
  // represents that role, and is explicitly not a full native-DOM reconstruction.
  const tag = actual.match(/^[a-z][a-z0-9-]*/iu)?.[0]?.toLowerCase() || (actual.startsWith('.') ? 'span' : undefined);
  assert(tag, 'Missing captured Text-parent tag for ' + label.key);
  const attrs = {};
  const classes = [...actual.matchAll(/\.([a-zA-Z_][\w-]*)/gu)].map(match => match[1]);
  if (classes.length) attrs.class = classes.join(' ');
  for (const match of actual.matchAll(/\[([\w:-]+)=["']?([^\]"']+)["']?\]/gu)) attrs[match[1]] = match[2];
  return element(tag, attrs, [fixedText(label)]);
}

function accountInformationProjection(page) {
  // This skeleton follows the public semantic roles and ancestor chains supplied
  // by the coordinator's independent live read. Unknown layers are not invented.
  const rootSection = element('section', { class: 'iui-page-section' });
  const actualAddressesRole=Boolean(page.observedComponents?.addressesProjection);
  const form = element('form', { class: (actualAddressesRole?'iui-component ':'')+'iui-web-form', 'data-testid': 'uicl-web-form' });
  const outer = element('section', { class: (actualAddressesRole?'iui-component ':'')+'iui-form-section', 'data-testid': 'uicl-form-section' });
  form.children.push(outer);
  rootSection.children.push(element('div', { class: 'iui-form-page', 'data-testid': 'uicl-form-page' }, [form]));
  for (const label of page.fixedText) {
    const leaf = capturedLeaf(label);
    const ancestors = JSON.stringify(label.observedAncestors || []);
    const inNewContact = /section-new-contact/u.test(ancestors) || label.requiredAncestor === '.section-new-contact' || label.componentKind === 'new-contact';
    if (leaf.tag === 'header-text') {
      rootSection.children.unshift(element('div', { class: 'iui-component iui-sticky-element iui-page-header vue-sticky-el', 'data-testid': 'uicl-page-header' }, [element('div', { class: 'iui-page-header-content' }, [element('div', { class: 'header-container' }, [leaf])])]));
    } else if(actualAddressesRole&&label.source==='Addresses'&&leaf.tag==='sub-header'){
      // L0814-01: fresh live Text parent and ancestry differ from the old fixture.
      outer.children.push(element('div',{class:'heading-wrapper'},[element('div',{class:'heading-container'},[leaf])]));
    } else if (leaf.tag === 'field-label-typography') {
      const field = element('section', { class: 'iui-form-section subFormSection', 'data-testid': 'uicl-subform-section' }, [element('div', { class: 'heading-wrapper' }, [element('div', { class: 'heading-container' }, [leaf])])]);
      if (inNewContact) {
        outer.children.push(element('span', { class: 'iui-radio-button-group', role: 'radiogroup', 'data-testid': 'uicl-radio-button-group' }, [element('div', { class: 'iui-conditional-actions', 'data-testid': 'uicl-conditional-actions' }, [element('section', { class: 'iui-form-section no-heading subFormSection display-column checkbox-dependent section-new-contact', 'data-testid': 'uicl-subform-section' }, [element('section', { class: 'iui-field-group' }, [field])])])]));
      } else outer.children.push(field);
    } else if (leaf.tag === 'label' && /right-label/u.test(leaf.attrs.class || '')) {
      outer.children.push(element('span', { class: 'iui-radio-button-group', 'data-testid': 'uicl-radio-button-group' }, [element('div', { class: 'iui-field-label-pair withRightLabel radio-button', 'data-testid': 'uicl-field-label-pair' }, [element('div', {}, [leaf])])]));
    } else if (leaf.tag === 'span' && /please-select/u.test(leaf.attrs.class || '')) {
      outer.children.push(element('button', { type: 'button', 'data-testid': 'uicl-multi-select-input-button' }, [leaf]));
    } else if (leaf.tag === 'button' && label.source === 'Save') {
      form.children.push(element('footer', { class: 'formFooter' }, [element('span', { class: 'iui-webflow-btn' }, [leaf])]));
    } else {
      // A captured leaf under the confirmed semantic root, without claiming any
      // unknown direct ancestry for that role.
      rootSection.children.push(leaf);
    }
  }
  outer.children.push(element('div', { class: 'synthetic-private-values' }, [
    element('input', { id: 'synthetic-native-input', value: 'Account Information', 'data-synthetic-control': 'input' }),
    element('input', { id: 'synthetic-native-check', type: 'checkbox', checked: '', 'data-synthetic-control': 'checkbox' }),
    element('select', { id: 'synthetic-native-select', 'data-synthetic-control': 'select' }, [element('option', { value: 'Name', selected: '' }, [{ text: 'SYNTHETIC PRIVATE VALUE' }])]),
    element('span', {}, [{ text: 'SYNTHETIC PRIVATE NAME' }]),
    element('span', {}, [{ text: 'Name' }]),element('span', {}, [{ text: 'State' }]),
    element('span', {}, [{ text: 'Transfer minimum' }]),element('span', {}, [{ text: 'No Return' }]),
    element('span', {}, [{ text: '$1,234.56' }]),
    ...(page.privateCollisionSources||[]).map(source=>element('span',{'data-synthetic-private-collision':'true'},[{text:source}]))
  ]));
  for(const item of page.roleCounterexamples||[]){const leaf=capturedLeaf({key:'counterexample',source:item.source,observedTextParent:item.observedTextParent});leaf.children=[{text:item.source}];leaf.attrs['data-synthetic-counterexample']=item.key||'unrelated-role';outer.children.push(leaf);}
  return element('div', { id: 'vueInstance' }, [element('div', { class: 'app-page' }, [rootSection])]);
}

function projection(page) {
  if (page.observedTree) return page.observedTree;
  if (page.pathExact === '/secure/advertiser/accountSettings/account-info-flow.ihtml') return accountInformationProjection(page);
  const rootID=page.rootSelector?.match(/^#([\w-]+)$/u)?.[1];
  assert(rootID || page.shadowHost, 'No known semantic root for ' + page.id);
  const tree = element('div', rootID ? { id:rootID } : { 'data-synthetic-fixture-root':'true' });
  const observed=page.observedComponents||{};
  const timingKeys=new Set();
  let dataHeader, headerRow, column = 0, form, legacyForm, legacyOwner, navigation;
  const portals=[];
  if(observed.frequencyPortalProjections){
    for(const menu of observed.frequencyPortalProjections){
      assert(menu.rootCarriesDropdownListTestid===false||menu.rootAndListAreDistinctNodes===true,'Separate portal root/list relation still needs independent live confirmation: '+menu.id);
      const list=element('ul',{'data-testid':'uicl-list'});
      for(const source of menu.sources){
        const label=page.fixedText.find(label=>label.sourceGroup==='portal-'+menu.id&&label.source===source);
        const text=label?fixedText(label):{text:source};
        list.children.push(element('li',{},[element('div',{'data-testid':'uicl-select-item'},[element('regular-text',{},[text])])]));
      }
      const listRoot=element('div',{'data-testid':'uicl-dropdown-list'},[list]);
      // Six-item menu has the observed extra div. The five-item menu has an
      // independently observed descendant list; unobserved wrappers are omitted.
      const menuChildren=menu.id==='event-frequency'?[element('div',{},[listRoot])]:[listRoot];
      portals.push(element('div',{class:'iui-dropdown in-multiselect-input'+(menu.id==='event-frequency'?' in-single-select':''),'data-testid':'uicl-dropdown','data-synthetic-portal':menu.id},menuChildren));
    }
  }
  if(observed.statusMenuProjection){
    const menu=observed.statusMenuProjection;
    assert.equal(menu.rootCarriesDropdownListTestid,false,'Status menu/list separation must be observed');
    const list=element('ul',{'data-testid':'uicl-list'});
    for(const source of menu.orderedSources){const label=page.fixedText.find(label=>label.sourceGroup==='native-status-menu'&&label.source===source);assert(label,'Missing public status menu source');list.children.push(element('li',{},[element('div',{'data-testid':'uicl-select-item'},[capturedLeaf(label)])]));}
    const clear=page.fixedText.find(label=>label.sourceGroup==='native-status-menu-clear');
    portals.push(element('div',{class:'iui-dropdown in-multiselect-input in-single-select','data-testid':'uicl-dropdown','data-synthetic-portal':'access-group-status'},[element('div',{'data-testid':'uicl-dropdown-list'},[list]),capturedLeaf(clear)]));
  }
  if(observed.footerProjection?.ancestry){form=element('form',{class:'iui-web-form'});tree.children.push(form);}
  if(observed.editFormProjection){
    legacyForm=element('form');
    if(observed.editFormProjection.ancestry){legacyOwner=element('div',{class:'uitkLabel uitkEditableLabel uitkEditableEdit'},[legacyForm]);tree.children.push(legacyOwner);}
    else tree.children.push(legacyForm);
  }
  if(observed.fixedNavigationProjection){navigation=element('div',{id:'advTechSettings'});tree.children.push(navigation);}
  if(observed.timingRowsProjection){
    const byKey=new Map(page.fixedText.map(label=>[label.key,label]));
    const appendKnown=(row,key)=>{
      const label=byKey.get(key);if(!label)return;
      timingKeys.add(key);const leaf=capturedLeaf(label);
      if(['timing-after-month-end','timing-lock'].includes(key))row.children.push(element('button',{'data-testid':'uicl-multi-select-input-button',type:'button'},[element('span',{class:'value'},[leaf])]));
      else if(['timing-months','days'].includes(key)&&observed.timeUnitOwnersProjection)row.children.push(element('div',{'data-testid':'uicl-field-label-pair',class:'iui-field-label-pair number-input child parent withRightLabel','data-synthetic-unit-owner':key},[element('div',{},[element('input',{value:key==='days'?'17':'2','data-synthetic-opaque-slot':key}),leaf])]));
      else row.children.push(leaf);
    };
    // Distinct source/scope contexts appear once. Redundant occurrence labels
    // are omitted from this minimal projection rather than claimed as a DOM clone.
    const locking=element('section',{class:'iui-field-group'});
    appendKnown(locking,'timing-actions-locked');
    appendKnown(locking,'timing-months');
    appendKnown(locking,'days');appendKnown(locking,'timing-after-month-end');
    locking.children.push(element('input',{type:'hidden',value:'SYNTHETIC-HIDDEN'}));
    const payment=element('section',{class:'iui-field-group'});
    appendKnown(payment,'timing-actions-paid');
    payment.children.push(element('input',{value:'3','data-synthetic-opaque-slot':'months'}),element('input',{value:'11','data-synthetic-opaque-slot':'days'}));
    appendKnown(payment,'timing-they');appendKnown(payment,'timing-lock');
    payment.children.push(element('input',{type:'hidden',value:'SYNTHETIC-HIDDEN'}));
    tree.children.push(locking,payment);
  }
  if(observed.reversalBranchesProjection){
    const byKey=new Map(page.fixedText.map(label=>[label.key,label]));
    const enforcedLeft=byKey.get('enforce-a-minimum-of'),enforcedRight=byKey.get('reversal-enforced-monthly-suffix');
    if(enforcedLeft&&enforcedRight){
      timingKeys.add(enforcedLeft.key);timingKeys.add(enforcedRight.key);
      tree.children.push(element('div',{'data-testid':'uicl-field-label-pair',class:'iui-field-label-pair withLeftLabel withRightLabel number-input'},[element('div',{},[capturedLeaf(enforcedLeft),element('input',{value:'37','data-synthetic-opaque-slot':'reversal-policy'}),capturedLeaf(enforcedRight)])]));
    }
  }
  if (page.observedComponents?.headingProjection?.ancestry) {
    dataHeader = element('div', { class: 'data-header' }, [element('div', { class: 'top-info' })]);
    tree.children.push(dataHeader);
  }
  if (page.observedComponents?.tableHeaderProjection) {
    headerRow=element('div', { class: 'table-row' });
    tree.children.push(element('div', { class: 'iui-component iui-data-table', 'data-testid': 'uicl-data-table' }, [element('div', { class: 'table-head' }, [headerRow])]));
  }
  for (const label of page.fixedText) {
    if(timingKeys.has(label.key))continue;
    const leaf=capturedLeaf(label);
    if(label.sourceGroup==='native-status-menu'||label.sourceGroup==='native-status-menu-clear')continue;
    if(label.sourceGroup==='native-status-trigger'&&observed.statusTriggerProjection){
      tree.children.push(element('div',{class:'iui-filter-section'},[element('span',{class:'filter','data-testid':'uicl-filter--892481550'},[element('div',{'data-testid':'uicl-multiselect-input'},[element('div',{class:'btn-container'},[element('button',{'data-testid':'uicl-multi-select-input-button'},[leaf])])])])]));
    }else if(page.componentKind==='shared-notification-drawer'){
      tree.children.push(element('div',{class:'notification_content'},[label.key==='type'?element('div',{class:'notification_header'},[leaf]):leaf]));
    }else if(page.id==='notification-frequency'){
      const group=label.sourceGroup;
      if(group?.startsWith('portal-'))assert(portals.length,'Portal labels require actual menu projection facts');
      else if(group==='tabs')tree.children.push(element('nav',{'data-testid':'uicl-tabs'},[element('a',{'data-testid':'uicl-tab'},[element('regular-text',{},[leaf])])]));
      else if(group==='notification-type-labels'||group==='slack-labels'){
        const pair=element('div',{'data-testid':'uicl-field-label-pair',class:group==='notification-type-labels'?'multi-select-input':'url-input'},[element('div',{},[leaf])]);
        tree.children.push(group==='slack-labels'?element('section',{class:'iui-field-group'},[pair]):pair);
      }else if(group==='selected-frequency-labels')tree.children.push(element('button',{'data-testid':'uicl-multi-select-input-button',type:'button'},[element('span',{class:'value'},[leaf])]));
      else if(group==='guide-link')tree.children.push(element('a',{'data-testid':'uicl-hyperlink'},[leaf]));
      else if(group==='footer-save')tree.children.push(element('footer',{class:'formFooter'},[element('span',{},[leaf])]));
      else tree.children.push(leaf);
    } else if(observed.tabsProjection && ['advertiser-notifications','custom-notifications'].includes(label.key))tree.children.push(element('nav',{'data-testid':'uicl-tabs'},[element('a',{'data-testid':'uicl-tab'},[element('regular-text',{},[leaf])])]));
    else if(label.sourceGroup==='current-round-hidden-tooltip'&&observed.hiddenTooltipProjection){
      assert(legacyOwner,'Actual editable owner is required for hidden tooltip projection');
      // The label/tooltip chain is observed. Its form ancestry is unproven and
      // intentionally omitted. Inline hiding is a synthetic rect0 simulation.
      leaf.attrs.style='display:none';leaf.attrs['data-synthetic-hidden-tooltip-text']='true';
      legacyOwner.children.push(element('div',{class:'uitkInputGroup'},[element('div',{class:'uitkMainLabel'},[element('label',{},[element('span',{class:'uitkDisplayTooltip uitkImageTooltip uitkLabelTooltip','data-synthetic-hidden-tooltip-trigger':'true'},[leaf])])])]));
    }
    else if(navigation && ['data-feeds','event-notification-postbacks','cross-program-tracking','ftp-file-submissions'].includes(label.key))navigation.children.push(element('a',{},[leaf]));
    else if(legacyForm && label.key.startsWith('expanded-'))legacyForm.children.push(leaf);
    else if(observed.legacySectionProjection && leaf.tag==='h4')tree.children.push(element('div',{class:'uitkLabelSection'},[leaf]));
    else if(observed.legacyMainLabelProjection && leaf.tag==='label')tree.children.push(element('div',{class:'uitkMainLabel'},[leaf]));
    else if(observed.editLinkProjection && leaf.tag==='span' && /irsr-only/u.test(leaf.attrs.class||''))tree.children.push(element('a',{class:'uitkEditLink'},[leaf]));
    else if(observed.trackingTooltipProjection && leaf.tag==='span' && /uitkTooltipInfo/u.test(leaf.attrs.class||''))tree.children.push(element('div',{class:'uitkMainLabel'},[element('label',{},[leaf])]));
    else if(observed.reversalSuffixProjection && label.key==='reversal-radio-monthly-suffix')tree.children.push(element('div',{'data-testid':'uicl-field-label-pair',class:'iui-field-label-pair child withRightLabel number-input'},[element('div',{},[leaf])]));
    else if(observed.reversalBranchesProjection && label.key==='reversal-advertiser-prefix')tree.children.push(element('div',{'data-testid':'uicl-field-label-pair',class:'iui-field-label-pair parent withRightLabel radio-button'},[element('div',{},[leaf])]));
    else if(observed.minimumEnforcementProjection && ['reversal-enforced-monthly-suffix','enforce-a-minimum-of'].includes(label.key))tree.children.push(element('div',{'data-testid':'uicl-field-label-pair',class:'iui-field-label-pair number-input withLeftLabel withRightLabel'},[element('div',{},[leaf])]));
    else if(observed.clearButtonProjection&&label.key==='clear-all'){
      leaf.attrs.class=[leaf.attrs.class,'clearButton'].filter(Boolean).join(' ');
      const owner=element('div',{class:'iui-filter-section'},[leaf]);
      if(dataHeader)dataHeader.children.push(owner);else tree.children.push(element('div',{class:'data-header'},[owner]));
    }
    else if(page.id==='api-access-tokens' && observed.headingProjection && leaf.tag==='p' && /api-ui-page-heading/u.test(leaf.attrs.class||''))tree.children.push(element('div',{class:'api-ui-header-top-row'},[leaf]));
    else if(form && leaf.tag==='button' && leaf.attrs['data-testid']==='uicl-webflow-button')form.children.push(element('footer',{class:'formFooter'},[element('span',{},[leaf])]));
    else if(observed.footerProjection?.ancestor==='footer' && leaf.tag==='button')tree.children.push(element('footer',{},[leaf]));
    else if (leaf.tag==='h1' && dataHeader) dataHeader.children[0].children.push(leaf);
    else if ((leaf.attrs.class || '').split(' ').includes('column-label') && headerRow) {
      leaf.attrs.class='column-label text-ellipsis';leaf.attrs['data-testid']='uicl-data-table-column-label-'+column;
      headerRow.children.push(element('div', { class: 'table-cell table-header', 'data-testid':'uicl-data-table-header-cell-'+column++ }, [leaf]));
    } else if (leaf.tag==='label' && (observed.labelProjection||observed.fieldLabelPairProjection)) {
      tree.children.push(element('div', { 'data-testid': 'uicl-field-label-pair',class:'iui-field-label-pair' }, [element('div', {}, [leaf])]));
    } else if (page.id==='custom-notifications' && label.key==='create-custom-notifications') {
      tree.children.push(element('div', { class:'page-actions' }, [element('span', {}, [element('div', { class:'iui-component iui-btn-menu' }, [element('div', {}, [leaf])])])]));
    } else if (label.requiredAncestor === '.data-header' && dataHeader) dataHeader.children.push(leaf);
    else tree.children.push(leaf);
  }
  for(const item of page.roleCounterexamples||[]){const leaf=capturedLeaf({key:'counterexample',source:item.source,observedTextParent:item.observedTextParent});leaf.children=[{text:item.source}];leaf.attrs['data-synthetic-counterexample']=item.key||'unrelated-role';if(leaf.tag==='button')leaf.attrs.type='button';tree.children.push(leaf);}
  tree.children.push(element('div',{'data-synthetic-private-slots':'true'},[
    element('input',{value:page.fixedText[0].source,'data-synthetic-control':'input'}),
    element('input',{type:'checkbox',checked:'','data-synthetic-control':'checkbox'}),
    element('select',{'data-synthetic-control':'select'},[element('option',{value:'Name',selected:''},[{text:'SYNTHETIC PRIVATE VALUE'}])]),
    element('span',{},[{text:'SYNTHETIC PRIVATE NAME'}]),element('span',{},[{text:'$1,234.56'}]),element('span',{},[{text:'SYNTHETIC-ID-001'}]),
    element('span',{},[{text:'Name'}]),element('span',{},[{text:'State'}]),element('span',{},[{text:'Transfer minimum'}]),element('span',{},[{text:'No Return'}]),element('regular-text',{},[{text:'None'}]),
    // Deliberately unrelated placement counterexample, not an asserted live body tree.
    element('div',{class:'table-body','data-synthetic-counterexample':'table-body'},[element('span',{class:'column-label'},[{text:'Name'}]),element('span',{class:'column-label'},[{text:'Status'}])]),
    ...(page.privateCollisionSources||[]).map(source=>element('span',{'data-synthetic-private-collision':'true'},[{text:source}]))
  ]));
  // Native portals live outside the confirmed Vue root. The extra wrapper is
  // a synthetic proof envelope, not an asserted native ancestor.
  return portals.length?element('div',{'data-synthetic-proof-envelope':'true'},[tree,...portals]):tree;
}

function renderTree(tree, keys) {
  if (Object.hasOwn(tree, 'comment')) return '<!--' + String(tree.comment).replaceAll('--', '') + '-->';
  if (Object.hasOwn(tree, 'text')) {
    if (tree.fixedKey) {
      assert(!keys.has(tree.fixedKey), 'Duplicate captured Text key ' + tree.fixedKey);
      keys.add(tree.fixedKey);
      // Adjacent comment markers identify the actual Text, without adding an element.
      return '<!--fixture-fixed:' + escape(tree.fixedKey) + '-->' + escape(tree.text);
    }
    return escape(tree.text);
  }
  assert(/^[a-z][a-z0-9-]*$/u.test(tree.tag), 'Invalid observed tag');
  const attrs = Object.entries(tree.attrs || {}).map(([name, value]) => {
    assert(/^[a-zA-Z_:][a-zA-Z0-9_:.-]*$/u.test(name) && !/^on/iu.test(name), 'Unsafe fixture attribute');
    return ' ' + name + '="' + escape(value) + '"';
  }).join('');
  if (voidTags.has(tree.tag)) return '<' + tree.tag + attrs + '>';
  return '<' + tree.tag + attrs + '>' + (tree.children || []).map(child => renderTree(child, keys)).join('') + '</' + tree.tag + '>';
}

function documentHTML(page, shape = 'valid') {
  const keys = new Set();
  const tree = JSON.parse(JSON.stringify(projection(page)));
  const bodyBranches=JSON.parse(JSON.stringify(page.observedBodyBranches||[]));
  const sourceOverrides={};
  const walk=(node,visit)=>{visit(node);for(const child of node.children||[])walk(child,visit);};
  if(['wrong-timing-context','payment-timing-context'].includes(shape)){
    const change=node=>{
      if(node.fixedKey==='timing-actions-locked'||shape==='wrong-timing-context'&&node.fixedKey==='timing-actions-paid'){
        node.text=shape==='payment-timing-context'?'Actions are paid':'SYNTHETIC UNRELATED TIMING';sourceOverrides[node.fixedKey]=node.text;
      }
      for(const child of node.children||[])change(child);
    };change(tree);
  }
  tree.attrs['data-synthetic-fixture-root']='true';
  if (shape === 'wrong-root') {
    const rootID=page.rootSelector?.match(/^#([\w-]+)$/u)?.[1];
    walk(tree,node=>{if(node.attrs?.id===rootID)node.attrs.id='synthetic-unrelated-root';});
  }
  if(['wrong-portal-item','extra-portal-item','wrong-portal-header'].includes(shape)){
    if(shape==='wrong-portal-header')walk(tree,node=>{if(node.fixedKey==='page-title-1'||page.observedComponents?.statusMenuProjection&&node.fixedKey==='heading'){node.text='SYNTHETIC UNRELATED MENU OWNER';sourceOverrides[node.fixedKey]=node.text;}});
    walk(tree,node=>{
      if(!node.attrs?.['data-synthetic-portal'])return;
      if(shape==='extra-portal-item')walk(node,part=>{if(part.tag==='ul')part.children.push(element('li',{},[element('div',{'data-testid':'uicl-select-item'},[element('regular-text',{},[{text:'SYNTHETIC PRIVATE None'}])])]));});
      if(shape==='wrong-portal-item'){
        let changed=false;walk(node,part=>{if(!changed&&part.fixedKey){part.text='SYNTHETIC PRIVATE None';sourceOverrides[part.fixedKey]=part.text;changed=true;}});
      }
    });
  }
  if(shape==='wrong-status-trigger')walk(tree,node=>{if(node.attrs?.['data-testid']==='uicl-filter--892481550')node.attrs['data-testid']='synthetic-unrelated-filter';});
  if(shape==='wrong-hidden-tooltip-owner')walk(tree,node=>{if(node.attrs?.['data-synthetic-hidden-tooltip-trigger'])node.attrs.class='uitkDisplayTooltip uitkImageTooltip synthetic-unrelated-tooltip-owner';});
  if(page.observedComponents?.contractsNavigationProjection&&shape.startsWith('contracts-')){
    // These mutations use the independently captured role tree. They do not
    // derive a fixture from the candidate's added selector variants.
    walk(tree,node=>{
      const attrs=node.attrs||{};
      if(shape==='contracts-wrong-root'&&['left-bar','expanded-bar'].includes(attrs.id))attrs.id='synthetic-unrelated-'+attrs.id;
      if(shape==='contracts-unselected-up'&&attrs['data-synthetic-nav-role']==='product')attrs.class='product-item cursor';
      if(shape==='contracts-unselected-up'&&attrs['data-synthetic-nav-role']==='tooltip-container')attrs.class='adv-nav-product-tooltip-modal left-up';
      if(shape==='contracts-wrong-product'&&attrs['data-synthetic-nav-role']==='product')attrs['data-testid']='sidenav-product-synthetic-unrelated';
      if(shape==='contracts-wrong-product-track'&&attrs['data-synthetic-nav-role']==='product')attrs['data-track-id']='sidenav-product-synthetic-unrelated';
      if(shape==='contracts-wrong-container'&&attrs['data-synthetic-nav-role']==='tooltip-container')attrs['data-testid']='product-switcher-tooltip-container-synthetic-unrelated';
      if(shape==='contracts-wrong-list-owner'&&attrs['data-synthetic-nav-role']==='tooltip-list')attrs.class='tooltip-items-ct synthetic-unrelated-menu';
      if(shape==='contracts-wrong-group-marker'&&attrs['data-synthetic-nav-role']==='tooltip-group')attrs['data-testid']='sidenav-tooltip-submenu-synthetic-unrelated';
      if(shape==='contracts-wrong-group-track'&&attrs['data-synthetic-nav-role']==='tooltip-group')attrs['data-track-id']='sidenav-product-submenu-synthetic-unrelated';
      if(shape==='contracts-wrong-child-marker'&&attrs['data-synthetic-nav-role']==='tooltip-child-owner')attrs['data-testid']='sidenav-tooltip-submenu-item-synthetic-unrelated';
      if(shape==='contracts-wrong-child-track'&&attrs['data-synthetic-nav-role']==='tooltip-child-owner')attrs['data-track-id']='sidenav-product-submenu-item-synthetic-unrelated';
      if(shape==='contracts-wrong-href'&&attrs['data-synthetic-nav-role']==='tooltip-child-link')attrs.href='/secure/advertiser/synthetic-unrelated-contracts';
    });
  }
  if(page.observedComponents?.checklistFloatingNavigationProjection&&shape.startsWith('checklist-nav-'))walk(tree,node=>{
    const attrs=node.attrs||{},role=attrs['data-synthetic-checklist-nav-role'];
    if(shape==='checklist-nav-wrong-roots'&&['left-bar','expanded-bar'].includes(attrs.id))attrs.id='synthetic-unrelated-'+attrs.id;
    if(shape==='checklist-nav-wrong-product'&&role==='product')attrs['data-testid']='sidenav-product-synthetic-unrelated';
    if(shape==='checklist-nav-wrong-product-track'&&role==='product')attrs['data-track-id']='sidenav-product-synthetic-unrelated';
    if(shape==='checklist-nav-wrong-tooltip'&&role==='tooltip')attrs['data-testid']='product-switcher-tooltip-container-synthetic-unrelated';
    if(shape==='checklist-nav-wrong-submenu'&&role==='tooltip-checklists')attrs['data-testid']='sidenav-tooltip-submenu-synthetic-unrelated';
    if(shape==='checklist-nav-wrong-checklist-owner'&&role==='tooltip-checklist-owner')attrs.class='subitem-container synthetic-unrelated-item';
    if(shape==='checklist-nav-unselected-up'&&role==='product')attrs.class='product-item cursor';
    if(shape==='checklist-nav-unselected-up'&&role==='tooltip')attrs.class='adv-nav-product-tooltip-modal left-up';
  });
  if(page.observedComponents?.welcomeEmailDetailProjection&&shape.startsWith('welcome-'))walk(tree,node=>{
    const context=node.attrs?.['data-synthetic-welcome-context'];
    if(shape==='welcome-wrong-main-context'&&context==='main-label'||shape==='welcome-wrong-section-context'&&context==='section-title')node.children=[{text:'SYNTHETIC UNRELATED WELCOME CONTEXT'}];
  });
  if(page.observedComponents?.dataFeedsDetailProjection){
    walk(tree,node=>{
      const attrs=node.attrs||{};
      if(shape==='wrong-root'&&attrs.id==='advTechSettings')attrs.id='synthetic-unrelated-tech-navigation';
      if(shape==='data-feed-wrong-form'&&attrs.name==='editAdvDataFeedsForm')attrs.name='syntheticUnrelatedForm';
      if(shape==='data-feed-wrong-portal-context'&&attrs['data-synthetic-data-feed-context']==='true')node.children=[{text:'SYNTHETIC UNRELATED DATA FEED'}];
      if(shape==='data-feed-missing-portal-context'&&attrs['data-synthetic-data-feed-context']==='true')node.tag='span';
      if(shape==='data-feed-duplicate-portal-context'&&attrs['data-synthetic-data-feed-form']==='true')node.children.push(element('div',{class:'uitkSubSect'},[element('div',{class:'uitkInputGroup checkbox'},[element('div',{class:'uitkMainLabel'},[element('label',{},[{text:'数据文件'}])])])]));
      if(shape==='data-feed-wrong-frequency-context'&&node.fixedKey===page.observedComponents.dataFeedsDetailProjection.frequencyLabelKey){node.text='SYNTHETIC UNRELATED FREQUENCY';sourceOverrides[node.fixedKey]=node.text;}
      if(shape==='data-feed-option-without-value'&&attrs['data-synthetic-frequency-option']==='0')delete attrs.value;
      if(shape==='data-feed-wrong-navigation-href'&&attrs['data-synthetic-data-feed-nav']==='0')attrs.href='/secure/advertiser/synthetic-unrelated-technical-page';
    });
    for(const branch of bodyBranches)walk(branch,node=>{
      const attrs=node.attrs||{};
      if(shape==='data-feed-portal-wrong-leaf'&&attrs['data-synthetic-native-tooltip-body']==='true')attrs.class='x-tip-body synthetic-unrelated-tooltip-body';
      if(shape==='data-feed-portal-wrong-owner'&&attrs['data-synthetic-native-body-portal']==='true')attrs.class='x-tip x-layer x-tip-default synthetic-unrelated-tooltip';
      if(shape==='data-feed-portal-unlisted-source'&&node.fixedKey===page.observedComponents.dataFeedsDetailProjection.portalKeys[0]){node.text='Frequency';sourceOverrides[node.fixedKey]=node.text;}
    });
  }
  if(page.observedComponents?.recruitTooltipProjection&&shape.startsWith('recruit-'))walk(tree,node=>{
    const attrs=node.attrs||{},role=attrs['data-synthetic-recruit-role'];
    if(shape==='recruit-wrong-left-bar'&&attrs.id==='left-bar')attrs.id='synthetic-unrelated-left-bar';
    if(shape==='recruit-wrong-product'&&role==='product')attrs['data-testid']='sidenav-product-synthetic-unrelated';
    if(shape==='recruit-wrong-track'&&role==='product')attrs['data-track-id']='sidenav-product-synthetic-unrelated';
    if(shape==='recruit-wrong-tooltip'&&role==='tooltip')attrs['data-testid']='product-switcher-tooltip-container-synthetic-unrelated';
    if(shape==='recruit-selected-up'&&role==='product')attrs.class='product-item cursor selected';
    if(shape==='recruit-selected-up'&&role==='tooltip')attrs.class='adv-nav-product-tooltip-modal left-up';
  });
  if(shape.startsWith('timing-unit-variant-')){
    const index=Number(shape.slice('timing-unit-variant-'.length)),owner=page.observedComponents?.timeUnitOwnersProjection?.days?.owners?.[index];
    assert(owner,'Missing independently observed day unit owner variant');
    const classes=[...owner.matchAll(/\.([a-zA-Z_][\w-]*)/gu)].map(match=>match[1]);
    walk(tree,node=>{if(node.attrs?.['data-synthetic-unit-owner']==='days')node.attrs.class='iui-field-label-pair '+classes.join(' ');});
  }
  if(page.observedComponents?.nativeTooltipPortalProjection){
    if(shape==='portal-context-missing')walk(tree,node=>{if(node.attrs?.['data-synthetic-edit-context']==='true')node.tag='h5';});
    if(shape==='portal-context-wrong-text')walk(tree,node=>{if(node.attrs?.['data-synthetic-edit-context']==='true')node.children=[{text:'SYNTHETIC UNRELATED EDIT CONTEXT'}];});
    if(['portal-context-multiple','portal-context-multiple-mixed'].includes(shape))walk(tree,node=>{if(node.attrs?.['data-synthetic-edit-owner']==='true')node.children.push(element('h4',{'data-synthetic-extra-edit-context':'true'},[{text:shape==='portal-context-multiple'?'邮件品牌样式':'SYNTHETIC UNRELATED EDIT CONTEXT'}]));});
    for(const branch of bodyBranches)walk(branch,node=>{
      if(shape==='portal-wrong-leaf-class'&&node.attrs?.['data-synthetic-native-tooltip-body']==='true')node.attrs.class='x-tip-body synthetic-unrelated-tooltip-body';
      if(shape==='portal-wrong-container-class'&&node.attrs?.['data-synthetic-native-body-portal']==='true')node.attrs.class='x-tip x-layer x-tip-default synthetic-unrelated-tooltip';
      if(shape==='portal-unlisted-source'&&node.fixedKey===page.observedComponents.nativeTooltipPortalProjection.portalKeys[0]){node.text='Reply-To Address';sourceOverrides[node.fixedKey]=node.text;}
    });
  }
  // Body-level native portals are distinct observed roots, not descendants of
  // the approved main component. Validate their keys without HTML reparsing.
  for(const part of [tree,...bodyBranches])renderTree(part, keys);
  assert.deepEqual([...keys].sort(), page.fixedText.map(label => label.key).sort(), 'Observed tree/capture Text keys differ for ' + page.id);
  const sources = Object.fromEntries(page.fixedText.map(label => [label.key, label.source]));
  const rawSources = Object.fromEntries(page.fixedText.map(label => [label.key, label.rawText ?? label.source]));
  Object.assign(rawSources,sourceOverrides);
  // Build the public projection directly without relying on HTML-parser repairs.
  const approvedOuter = /#uitk-container\)?=true/u.test(page.observedEligibility || '');
  const actualShadow = Boolean(page.shadowHost) && shape !== 'light-dom';
  const syntheticWrongShadow = !page.shadowHost && shape === 'shadow';
  const navigationShadow=actualShadow&&page.shadowHost==='#adv-navigation impact-style-isolator';
  const navigationOuter=page.observedNavigationOuterHost||page.observedComponents?.checklistFloatingNavigationProjection?.observedOuterHost;
  const hostID = actualShadow && shape !== 'wrong-shadow-host' ? page.shadowHost.match(/^#([\w-]+)$/u)?.[1] : 'synthetic-unrelated-shadow-host';
  assert(!actualShadow || navigationShadow || hostID, 'Unknown observed Shadow-host shape in '+page.id);
  const outerBootstrap = 'window.__fixtureOuterElements=[];'+(approvedOuter ? `const approved=document.createElement("div");approved.id="uitk-container";${navigationOuter?`${typeof navigationOuter.bodyClass==='string'?`document.body.className=${scriptJSON(navigationOuter.bodyClass)};`:''}${typeof navigationOuter.uitkClass==='string'?`approved.className=${scriptJSON(navigationOuter.uitkClass)};`:''}window.__fixtureOuterElements.push(approved);`:''}document.body.append(approved);window.__fixtureOuter=approved;` : 'window.__fixtureOuter=document.body;');
  const bootstrap = outerBootstrap + (navigationShadow?`const nav=document.createElement('div');nav.id=${scriptJSON(shape==='wrong-shadow-host'?'synthetic-unrelated-navigation':'adv-navigation')};const host=document.createElement('impact-style-isolator');${navigationOuter?`for(const[key,value]of Object.entries(${scriptJSON(navigationOuter.hostAttributes||{})}))host.setAttribute(key,value);const left=document.createElement('div');left.id='left-content';left.className=${scriptJSON(navigationOuter.leftContentClass||'')};window.__fixtureOuter.append(left);left.append(nav);window.__fixtureOuterElements.push(left,nav,host);`:'window.__fixtureOuter.append(nav);'}nav.append(host);window.__fixtureContainer=host.attachShadow({mode:'open'});`:actualShadow || syntheticWrongShadow ? `const host=document.createElement('div');host.id=${scriptJSON(hostID)};window.__fixtureOuter.append(host);window.__fixtureContainer=host.attachShadow({mode:'open'});` : 'window.__fixtureContainer=window.__fixtureOuter;');
  return `<!doctype html><html><head><meta charset="utf-8"></head><body><script>${bootstrap}
  const construct=spec=>{if(Object.hasOwn(spec,'comment'))return document.createComment(spec.comment);if(Object.hasOwn(spec,'text')){if(!spec.fixedKey)return document.createTextNode(spec.text);const fragment=document.createDocumentFragment();fragment.append(document.createComment('fixture-fixed:'+spec.fixedKey),document.createTextNode(spec.text));return fragment;}const node=document.createElement(spec.tag);for(const[key,value]of Object.entries(spec.attrs||{}))node.setAttribute(key,value);for(const child of spec.children||[])node.append(construct(child));return node;};
  window.__fixtureContainer.append(construct(${scriptJSON(tree)}));
  window.__bodyBranchRoots=${scriptJSON(bodyBranches)}.map(spec=>{const branch=construct(spec);let owner=document.body;if(${scriptJSON(shape)}==='portal-nested-owner'){owner=document.createElement('div');owner.dataset.syntheticWrongPortalOwner='true';document.body.append(owner);}if(${scriptJSON(shape)}==='portal-shadow'){const host=document.createElement('div');host.dataset.syntheticWrongPortalShadow='true';document.body.append(host);owner=host.attachShadow({mode:'open'});}owner.append(branch);return branch;});
  window.__fixtureProofRoots=()=>[window.__fixtureContainer.querySelector('[data-synthetic-fixture-root]'),...window.__bodyBranchRoots];
  window.__fixtureSources=${scriptJSON(sources)};
  window.__fixtureRawSources=${scriptJSON(rawSources)};
  window.__fixtureSourceOverrides=${scriptJSON(sourceOverrides)};
  window.__fixtureAllowedExtensionHelpEntries=${scriptJSON(page.allowExtensionOwnedInlineHelpEntries||[])};
  window.__isFixtureOwnedHelp=node=>node.nodeType===Node.ELEMENT_NODE&&node.matches('button.impact-cn-inline-help[data-impact-cn-ignore][data-impact-cn-help]')&&window.__fixtureAllowedExtensionHelpEntries.includes(node.dataset.entryId)&&node.type==='button'&&!!node.dataset.topicId&&node.dataset.topicId===node.dataset.impactCnHelpTopic;
  window.__collectProof=()=>{
    const roots=window.__fixtureProofRoots(),textNodes={};
    for(const scope of roots){const walker=document.createTreeWalker(scope,NodeFilter.SHOW_COMMENT);while(walker.nextNode()){const marker=walker.currentNode;if(marker.nodeValue.startsWith('fixture-fixed:')){const key=marker.nodeValue.slice(14);if(marker.nextSibling?.nodeType!==Node.TEXT_NODE)throw new Error('Missing direct captured Text '+key);textNodes[key]=marker.nextSibling;}}}
    const elements=[...new Set([...roots.flatMap(scope=>[scope,...scope.querySelectorAll('*')]),...window.__fixtureOuterElements])].filter(element=>!window.__isFixtureOwnedHelp(element));
    window.__nativeProof={textNodes,elements:elements.map(element=>({element,parent:element.parentNode,children:[...element.childNodes].filter(node=>!window.__isFixtureOwnedHelp(node)),attributes:JSON.stringify([...element.attributes].map(a=>[a.name,a.value]))})),controls:elements.filter(element=>element.matches('input,select,textarea')).map(element=>({element,value:element.value,checked:element.checked})),otherTexts:[],clicks:0,inputEvents:0};
    for(const scope of roots){const allText=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT);while(allText.nextNode()){if(!Object.values(textNodes).includes(allText.currentNode)&&allText.currentNode.parentElement?.tagName!=='SCRIPT')window.__nativeProof.otherTexts.push({node:allText.currentNode,value:allText.currentNode.nodeValue});}}
    const clickParents=${scriptJSON(page.syntheticNativeClickKeys||[])}.map(key=>textNodes[key]?.parentElement).filter(Boolean);
    for(const control of new Set([...elements.filter(element=>element.matches('button,a,input,select,textarea')),...clickParents])){control.addEventListener('click',event=>{event.preventDefault();window.__nativeProof.clicks++});control.addEventListener('input',()=>window.__nativeProof.inputEvents++);}
  };window.__collectProof();
  window.__remountCaptured=()=>{const replacements=window.__fixtureProofRoots().map(native=>{const replacement=native.cloneNode(true);const iterator=document.createTreeWalker(replacement,NodeFilter.SHOW_COMMENT);while(iterator.nextNode()){const marker=iterator.currentNode;if(marker.nodeValue.startsWith('fixture-fixed:')){const key=marker.nodeValue.slice(14),node=marker.nextSibling;node.nodeValue=window.__fixtureRawSources[key];}}native.replaceWith(replacement);return replacement;});window.__bodyBranchRoots=replacements.slice(1);window.__collectProof();};
  </script></body></html>`;
}

// Reject missing public role facts before launching an isolated browser.
for(const page of pages)documentHTML(page);
const temporary = mkdtempSync(path.join(os.tmpdir(), 'impact-settings-deep-'));
const extension = path.join(temporary, 'extension');
cpSync(sourceDir, extension, { recursive: true });
for (const [file, hash] of Object.entries(sourceHashes)) assert.equal(sha(readFileSync(path.join(extension,file))),hash,file+' changed while copying the isolated extension snapshot');
console.log('SETTINGS DEEP SNAPSHOT READY '+JSON.stringify({version:manifest.version,dictSHA256:sourceHashes['dict.js'],captureSHA256:sha(captureBytes)}));
let context, browserPage, worker;
let activePage;
const results = [];
const perPageObservations = [];
async function check(name, action) {
  try { results.push({ name, status: 'PASS', evidence: await action() }); console.log('SETTINGS DEEP PASS ' + name); }
  catch (error) { results.push({ name, status: 'FAIL', evidence: error.message }); console.log('SETTINGS DEEP FAIL ' + name + ': ' + error.message); }
}
async function settings(enabled, aiEnabled) {
  await worker.evaluate(value => chrome.storage.local.set({ impactCNEnabled: value.enabled, impactCNAIEnabled: value.aiEnabled }), { enabled, aiEnabled });
  await browserPage.waitForFunction(value => { const assistant=document.querySelector('#impact-cn-assistant');return !assistant || assistant.dataset.enabled===String(value.enabled)&&assistant.dataset.aiEnabled===String(value.aiEnabled); }, { enabled, aiEnabled });
}
async function open(page, shape = 'valid', { host = page.host || 'demo.impact.com', pathname = documentPath(page), protocol = 'https:' } = {}) {
  activePage = page;
  const url=new URL(protocol+'//'+host+pathname);
  for(const[key,value]of Object.entries(page.query||{}))url.searchParams.set(key,value);
  url.searchParams.set('synthetic-shape',shape);
  await browserPage.goto(url.href);
  await browserPage.waitForFunction(() => !!window.__nativeProof);
}
async function waitText(page, translated, frame = browserPage, overrides = {}) {
  const values = Object.fromEntries(page.fixedText.map(label => [label.key, labelExpectation(page, label, translated)]));
  Object.assign(values,overrides);
  try { await frame.waitForFunction(values => Object.entries(values).every(([key,value])=>window.__nativeProof.textNodes[key]?.nodeValue.replace(/\s+/gu,' ').trim()===value), values, { timeout: 5000 }); }
  catch (error) {
    const mismatches=await frame.evaluate(values=>Object.entries(values).map(([key,expected])=>({key,expected,actual:window.__nativeProof.textNodes[key]?.nodeValue.replace(/\s+/gu,' ').trim()})).filter(item=>item.actual!==item.expected),values);
    throw new Error(error.message+'; fixed Text mismatches '+JSON.stringify(mismatches.slice(0,8))+'; total '+mismatches.length);
  }
}
async function publicFixedTextResults(page) {
  if(!page.observePublicFixedTextResults)return undefined;
  const actual=await browserPage.evaluate(()=>Object.fromEntries(Object.entries(window.__nativeProof.textNodes).map(([key,node])=>[key,node.nodeValue.replace(/\s+/gu,' ').trim()])));
  return page.fixedText.map(label=>({key:label.key,source:label.source,expected:labelExpectation(page,label,true),actual:actual[label.key],status:actual[label.key]===labelExpectation(page,label,true)?'PASS':'FAIL'}));
}
async function nativeProof(restored = false, frame = browserPage) {
  const diagnostics=await frame.evaluate(restored=>{
    const proof=window.__nativeProof;
    const nativeChildren=element=>[...element.childNodes].filter(node=>!window.__isFixtureOwnedHelp(node));
    const childrenSame=(element,children)=>{const current=nativeChildren(element);return current.length===children.length&&children.every((node,index)=>node===current[index]);};
    return {
      elements:proof.elements.filter(({element,parent,children,attributes})=>!element.isConnected||element.parentNode!==parent||!childrenSame(element,children)||JSON.stringify([...element.attributes].map(a=>[a.name,a.value]))!==attributes).map(({element,parent,children,attributes})=>({tag:element.tagName,id:element.id,connected:element.isConnected,parentSame:element.parentNode===parent,childrenSame:childrenSame(element,children),attributesSame:JSON.stringify([...element.attributes].map(a=>[a.name,a.value]))===attributes,addedChildren:nativeChildren(element).filter(node=>!children.includes(node)).map(node=>({nodeType:node.nodeType,tag:node.tagName,class:node.className,extensionHelp:window.__isFixtureOwnedHelp(node),entryId:node.dataset?.entryId})),removedChildCount:children.filter(node=>!nativeChildren(element).includes(node)).length})),
      fixedTextKeys:Object.entries(proof.textNodes).filter(([key,node])=>!node.isConnected||restored&&node.nodeValue!==window.__fixtureRawSources[key]).map(([key])=>key),
      unrelatedTextParents:proof.otherTexts.filter(({node,value})=>!node.isConnected||node.nodeValue!==value).map(({node})=>node.parentElement?.tagName),
      controls:proof.controls.filter(({element,value,checked})=>element.value!==value||element.checked!==checked).map(({element,value,checked})=>({tag:element.tagName,id:element.id,valueSame:element.value===value,checkedSame:element.checked===checked})),
      inputEvents:proof.inputEvents
    };
  }, restored);
  assert(!diagnostics.elements.length&&!diagnostics.fixedTextKeys.length&&!diagnostics.unrelatedTextParents.length&&!diagnostics.controls.length&&diagnostics.inputEvents===0,'Captured native nodes, children, attributes, values or unrelated Text changed: '+JSON.stringify(diagnostics));
}
async function inlineHelpProof(page,aiEnabled){
  if(!page.allowExtensionOwnedInlineHelpEntries?.length)return;
  const expectedCount=aiEnabled?page.expectedInlineHelpCount:0;
  await browserPage.waitForFunction(expected=>[...window.__fixtureContainer.querySelectorAll('button.impact-cn-inline-help')].filter(window.__isFixtureOwnedHelp).length===expected,expectedCount);
}

try {
  context=await chromium.launchPersistentContext(path.join(temporary,'profile'),{executablePath:chromium.executablePath(),channel:'chromium',headless:true,args:[`--disable-extensions-except=${extension}`,`--load-extension=${extension}`]});
  await context.route(/https?:\/\//u,route=>{
    const url=new URL(route.request().url());
    if(url.pathname==='/synthetic/settings-deep-frame-parent'){
      const frameURL=new URL('https://'+(activePage.host||'demo.impact.com')+documentPath(activePage));
      for(const[key,value]of Object.entries(activePage.query||{}))frameURL.searchParams.set(key,value);
      frameURL.searchParams.set('synthetic-shape','valid');
      return route.fulfill({contentType:'text/html',body:'<!doctype html><body><iframe src="'+escape(frameURL.href)+'"></iframe></body>'});
    }
    return route.fulfill({contentType:'text/html',body:documentHTML(activePage,url.searchParams.get('synthetic-shape')||'valid')});
  });
  browserPage=context.pages()[0]||await context.newPage();browserPage.setDefaultTimeout(6000);
  await open(pages[0]);await browserPage.locator('#impact-cn-assistant').waitFor();
  worker=context.serviceWorkers().find(value=>value.url().startsWith('chrome-extension://'))||await context.waitForEvent('serviceworker',{timeout:7000});
  await settings(true,false);
  await check('Captured fixed Text translates automatically on each new settings detail document',async()=>{
    const failures=[];
    for(const page of pages){try{await open(page);await waitText(page,true);await nativeProof();perPageObservations.push({page:page.id,fixedText:page.fixedText.length,status:'PASS',publicFixedTextResults:await publicFixedTextResults(page)});}catch(error){failures.push({page:page.id,error:error.message});perPageObservations.push({page:page.id,fixedText:page.fixedText.length,status:'FAIL',error:error.message,publicFixedTextResults:await publicFixedTextResults(page)});}}
    assert.equal(failures.length,0,'Per-page captured Text failures: '+JSON.stringify(failures));
    return{pages:pages.map(page=>page.id),fixedText:pages.reduce((total,page)=>total+page.fixedText.length,0),hosts:[...new Set(pages.map(page=>page.host||'demo.impact.com'))],synthetic:true};
  });
  if(!baselineObservation){
  await check('Translation restores original Text and preserves independent AI, nodes, native attributes and synthetic control values',async()=>{
    let syntheticClickHandlers=0,syntheticCapturedLabelClickHandlers=0;
    for(const page of representatives){await open(page);await waitText(page,true);await settings(false,true);await waitText(page,false);await inlineHelpProof(page,true);await nativeProof(true);await settings(true,true);await waitText(page,true);await inlineHelpProof(page,true);await nativeProof();await settings(true,false);await waitText(page,true);await inlineHelpProof(page,false);await nativeProof();if(page.syntheticNativeClickKeys?.length){const count=await browserPage.evaluate(keys=>{for(const key of keys)window.__nativeProof.textNodes[key].parentElement.click();if(window.__nativeProof.clicks!==keys.length)throw new Error('Synthetic captured navigation click listeners changed');return keys.length;},page.syntheticNativeClickKeys);syntheticCapturedLabelClickHandlers+=count;}else{const clicked=await browserPage.evaluate(()=>{const button=window.__nativeProof.elements.find(({element})=>element.matches('button:not([disabled])'))?.element;if(!button)return false;button.click();return window.__nativeProof.clicks===1;});if(clicked)syntheticClickHandlers++;}await nativeProof();}
    return{representativePages:representatives.map(page=>page.id),translationStates:['off','on'],AIStates:[true,false],syntheticClickHandlers,syntheticCapturedLabelClickHandlers,extensionOwnedInlineHelp:representatives.filter(page=>page.allowExtensionOwnedInlineHelpEntries?.length).map(page=>({page:page.id,entryIds:page.allowExtensionOwnedInlineHelpEntries,onCount:page.expectedInlineHelpCount,offCount:0,nativeChildrenRetainedAsExactOrderedSubsequence:true})),syntheticOnly:true};
  });
  await check('Captured component remount and ordinary refresh need no repeated translation-switch operation',async()=>{
    await settings(true,false);
    for(const page of representatives){await open(page);await waitText(page,true);await browserPage.evaluate(()=>window.__remountCaptured());await waitText(page,true);await nativeProof();await browserPage.evaluate(()=>{window.__fixtureContainer.querySelector('[data-synthetic-fixture-root]').hidden=true;window.__remountCaptured();});await waitText(page,true);await nativeProof();await browserPage.evaluate(()=>{window.__fixtureContainer.querySelector('[data-synthetic-fixture-root]').hidden=false;window.__collectProof();});await waitText(page,true);await nativeProof();await browserPage.reload();await waitText(page,true);await nativeProof();}
    const nativeBodyReuse=[];
    for(const page of representatives.filter(page=>page.observedComponents?.nativeTooltipPortalProjection||page.observedComponents?.dataFeedsDetailProjection)){
      await open(page);await waitText(page,true);await nativeProof();
      const keys=(page.observedComponents.nativeTooltipPortalProjection||page.observedComponents.dataFeedsDetailProjection).portalKeys,firstKey=keys[0];
      for(const nextKey of [...keys.slice(1),firstKey]){const label=page.fixedText.find(label=>label.key===nextKey);await browserPage.evaluate(({key,source})=>{window.__nativeProof.textNodes[key].nodeValue=source;},{key:firstKey,source:label.source});await waitText(page,true,browserPage,{[firstKey]:labelExpectation(page,label,true)});await nativeProof();if(nextKey===keys[1]){await settings(false,false);await waitText(page,false,browserPage,{[firstKey]:label.source});await nativeProof();await settings(true,false);await waitText(page,true,browserPage,{[firstKey]:labelExpectation(page,label,true)});await nativeProof();}}
      nativeBodyReuse.push({page:page.id,sameNativeBodyAndTextNodeRetained:true,sequentialSourceCount:keys.length,offRestoresCurrentReusedSourceInsteadOfInitialSource:'PASS',explicitRestoreProbeSwitchOperations:2,syntheticReuseOnly:true});
    }
    const dataFeedContextRevocation=[];
    for(const page of representatives.filter(page=>page.observedComponents?.dataFeedsDetailProjection)){
      await open(page);await waitText(page,true);await nativeProof();const keys=page.observedComponents.dataFeedsDetailProjection.portalKeys;
      await browserPage.evaluate(()=>{const form=window.__fixtureContainer.querySelector('form[name="editAdvDataFeedsForm"]');window.__removedDataFeedForm={form,parent:form.parentNode,next:form.nextSibling};form.remove();});
      const raw=Object.fromEntries(keys.map(key=>[key,page.fixedText.find(label=>label.key===key).source]));
      await browserPage.waitForFunction(values=>Object.entries(values).every(([key,value])=>{const node=window.__nativeProof.textNodes[key];return node.isConnected&&node.nodeValue===value;}),raw);
      const first=keys[0],current=page.fixedText.find(label=>label.key===keys.at(-1));
      await browserPage.evaluate(({key,source})=>{window.__nativeProof.textNodes[key].nodeValue=source;},{key:first,source:current.source});await browserPage.waitForTimeout(350);
      assert(await browserPage.evaluate(({key,source})=>window.__nativeProof.textNodes[key].nodeValue===source,{key:first,source:current.source}),'DataFeed portal regained translation after current form disappeared');
      await browserPage.evaluate(()=>{const{form,parent,next}=window.__removedDataFeedForm;parent.insertBefore(form,next);});
      await waitText(page,true,browserPage,{[first]:labelExpectation(page,current,true)});await nativeProof();
      const original=page.fixedText.find(label=>label.key===first);await browserPage.evaluate(({key,source})=>{window.__nativeProof.textNodes[key].nodeValue=source;},{key:first,source:original.source});await waitText(page,true);await nativeProof();
      dataFeedContextRevocation.push({page:page.id,existingFourPortalTextNodesRestoredWhenFormRemoved:true,newWhitelistedSourceStaysEnglishWhileFormAbsent:true,sameFormAndControlsReinsertedWithoutSwitch:true,nativeProofRetainedAfterReinsert:true,syntheticLifecycleOnly:true});
    }
    return{representativePages:representatives.map(page=>page.id),remountsPerPage:2,syntheticHiddenRemountAndRevealPerPage:1,reloadsPerPage:1,nativeBodyReuse,dataFeedContextRevocation,automaticRemountAndReloadSwitchOperations:0,reuseRestoreProbeSwitchOperations:nativeBodyReuse.length*2,visibilityScope:'Synthetic hidden main-component ancestor variant only; BODY portal branches keep their observed separate ownership. No claim to clone native application collapse CSS or save any setting'};
  });
  await check('Captured details reject unrelated root, host, Shadow, frame and required-query boundaries',async()=>{
    await settings(true,false);
    for(const page of representatives){for(const shape of page.shadowHost?['wrong-shadow-host','light-dom']:['wrong-root','shadow']){await open(page,shape);await browserPage.waitForTimeout(350);await waitText(page,false);await nativeProof(true);}await open(page,'valid',{host:'other.example'});await browserPage.waitForTimeout(350);await waitText(page,false);await nativeProof(true);await open(page,'valid',{pathname:'/synthetic/unrelated-settings-detail'});await browserPage.waitForTimeout(350);await waitText(page,false);await nativeProof(true);activePage=page;await browserPage.goto('https://'+(page.host||'demo.impact.com')+'/synthetic/settings-deep-frame-parent');const frame=browserPage.frames().find(frame=>frame!==browserPage.mainFrame()&&frame.url().includes(documentPath(page)))||await browserPage.waitForEvent('frameattached');await frame.waitForFunction(()=>!!window.__nativeProof);await browserPage.waitForTimeout(350);const overrides=page.boundaryExpectedOverrides?.['child-frame']||{};await waitText(page,false,frame,overrides);await nativeProof(!Object.keys(overrides).length,frame);}
    const checklistFloatingNavigationBoundaries=[];
    for(const page of pages.filter(page=>page.observedComponents?.checklistFloatingNavigationProjection)){
      const labels=new Map(page.fixedText.map(label=>[label.key,label]));
      const tooltipKeys=['tooltip-checklists','tooltip-engage'];
      const variants=[['checklist-nav-wrong-roots',[...tooltipKeys,'expanded-checklists']],...['checklist-nav-wrong-product','checklist-nav-wrong-product-track','checklist-nav-wrong-tooltip'].map(shape=>[shape,tooltipKeys]),...['checklist-nav-wrong-submenu','checklist-nav-wrong-checklist-owner'].map(shape=>[shape,['tooltip-checklists']])];
      for(const[shape,originalKeys]of variants){await open(page,shape);await waitText(page,true,browserPage,Object.fromEntries(originalKeys.map(key=>[key,labels.get(key).source])));await nativeProof();checklistFloatingNavigationBoundaries.push({page:page.id,shape,originalKeys,status:'PASS'});}
      await open(page,'valid',{pathname:'/secure/advertiser/synthetic-unrelated-navigation.ihtml'});const keys=['tooltip-checklists','tooltip-engage','expanded-checklists'];await waitText(page,true,browserPage,Object.fromEntries(keys.map(key=>[key,labels.get(key).source])));await nativeProof();checklistFloatingNavigationBoundaries.push({page:page.id,shape:'different-advertiser-path',originalKeys:keys,existingProductNameStillTranslates:true,status:'PASS'});
      await open(page,'checklist-nav-unselected-up');await waitText(page,true);await nativeProof();checklistFloatingNavigationBoundaries.push({page:page.id,shape:'checklist-nav-unselected-up',allFourTranslate:true,syntheticStatePermutationOnly:true,status:'PASS'});
    }
    const welcomeEmailBoundaries=[];
    for(const page of pages.filter(page=>page.observedComponents?.welcomeEmailDetailProjection))for(const shape of ['welcome-wrong-main-context','welcome-wrong-section-context']){await open(page,shape);await waitText(page,false);await nativeProof(true);welcomeEmailBoundaries.push({page:page.id,shape,status:'PASS'});}
    const dataFeedBoundaries=[];
    for(const page of pages.filter(page=>page.observedComponents?.dataFeedsDetailProjection)){
      const facts=page.observedComponents.dataFeedsDetailProjection,labels=new Map(page.fixedText.map(label=>[label.key,label]));
      const variants=[['data-feed-wrong-form',[...facts.formKeys,...facts.portalKeys]],['data-feed-wrong-frequency-context',facts.optionKeys],['data-feed-option-without-value',[facts.optionKeys[0]]],['data-feed-wrong-navigation-href',[facts.navigationKeys[0]]],...['data-feed-wrong-portal-context','data-feed-missing-portal-context','data-feed-duplicate-portal-context','data-feed-portal-wrong-leaf','data-feed-portal-wrong-owner','portal-nested-owner','portal-shadow'].map(shape=>[shape,facts.portalKeys])];
      for(const[shape,originalKeys]of variants){await open(page,shape);const overrides=Object.fromEntries(originalKeys.map(key=>[key,labels.get(key).source]));Object.assign(overrides,await browserPage.evaluate(()=>window.__fixtureSourceOverrides));await waitText(page,true,browserPage,overrides);await nativeProof();dataFeedBoundaries.push({page:page.id,shape,originalKeys,status:'PASS'});}
      await open(page,'data-feed-portal-unlisted-source');await waitText(page,true,browserPage,{[facts.portalKeys[0]]:'Frequency'});await nativeProof();dataFeedBoundaries.push({page:page.id,shape:'data-feed-portal-unlisted-source',unlistedExistingDictionarySourceRetainsEnglish:true,status:'PASS'});
    }
    const recruitTooltipBoundaries=[];
    for(const page of pages.filter(page=>page.observedComponents?.recruitTooltipProjection)){
      for(const shape of ['recruit-wrong-left-bar','recruit-wrong-product','recruit-wrong-track','recruit-wrong-tooltip']){await open(page,shape);await waitText(page,false);await nativeProof(true);recruitTooltipBoundaries.push({page:page.id,shape,status:'PASS'});}
      await open(page,'recruit-selected-up');await waitText(page,true);await nativeProof();recruitTooltipBoundaries.push({page:page.id,shape:'recruit-selected-up',syntheticStatePermutationOnly:true,status:'PASS'});
    }
    const contractsNavigationBoundaries=[];
    for(const page of pages.filter(page=>page.observedComponents?.contractsNavigationProjection)){
      const tooltipKeys=['tooltip-contracts-group','tooltip-contracts-child'];
      const variants=[
        ['contracts-wrong-root',page.fixedText.map(label=>label.key)],
        ...['contracts-wrong-product','contracts-wrong-product-track','contracts-wrong-container','contracts-wrong-list-owner'].map(shape=>[shape,tooltipKeys]),
        ...['contracts-wrong-group-marker','contracts-wrong-group-track'].map(shape=>[shape,['tooltip-contracts-group']]),
        ...['contracts-wrong-child-marker','contracts-wrong-child-track','contracts-wrong-href'].map(shape=>[shape,['tooltip-contracts-child']])
      ];
      for(const[shape,unchangedKeys]of variants){await open(page,shape);const overrides=Object.fromEntries(unchangedKeys.map(key=>[key,page.fixedText.find(label=>label.key===key).source]));await waitText(page,true,browserPage,overrides);await nativeProof();contractsNavigationBoundaries.push({page:page.id,shape,unchangedKeys,status:'PASS'});}
      await open(page,'contracts-unselected-up');await waitText(page,true);await nativeProof();contractsNavigationBoundaries.push({page:page.id,shape:'contracts-unselected-up',allFourTranslate:'PASS',statePermutationIsSynthetic:true});
    }
    const nativeTooltipPortalBoundaries=[];
    for(const page of pages.filter(page=>page.observedComponents?.nativeTooltipPortalProjection)){
      const keys=page.observedComponents.nativeTooltipPortalProjection.portalKeys;
      for(const shape of ['portal-wrong-leaf-class','portal-wrong-container-class','portal-nested-owner','portal-shadow','portal-context-missing','portal-context-wrong-text','portal-context-multiple','portal-context-multiple-mixed']){
        await open(page,shape);await waitText(page,true,browserPage,Object.fromEntries(keys.map(key=>[key,page.fixedText.find(label=>label.key===key).source])));await nativeProof();nativeTooltipPortalBoundaries.push({page:page.id,shape,portalTextsRetainEnglish:true,hiddenAndReplyToStillTranslate:true,status:'PASS'});
      }
      await open(page,'portal-unlisted-source');await waitText(page,true,browserPage,{[keys[0]]:'Reply-To Address'});await nativeProof();nativeTooltipPortalBoundaries.push({page:page.id,shape:'portal-unlisted-source',unlistedPublicFieldTextRetainsEnglish:true,otherAllowedPortalTextsStillTranslate:true,status:'PASS'});
      await open(page,'valid',{protocol:'http:'});await browserPage.waitForTimeout(350);await waitText(page,false);await nativeProof(true);nativeTooltipPortalBoundaries.push({page:page.id,shape:'http-document',allSevenRetainEnglish:true,status:'PASS',boundary:'Deployment/injection and adapter HTTPS boundary; not isolated unit proof of either guard alone'});
    }
    const queryBoundaries=[];
    for(const page of pages.filter(page=>Object.keys(page.query||{}).length)){
      for(const mode of ['missing','wrong']){
        await open(page);const url=new URL(browserPage.url());
        for(const key of Object.keys(page.query))if(mode==='missing')url.searchParams.delete(key);else url.searchParams.set(key,'/synthetic-unrelated-settings');
        await browserPage.goto(url.href);await browserPage.waitForFunction(()=>!!window.__nativeProof);await browserPage.waitForTimeout(350);await waitText(page,false);await nativeProof(true);
        queryBoundaries.push({page:page.id,mode});
      }
    }
    const timingContexts=[];
    for(const page of pages.filter(page=>page.observedComponents?.timingRowsProjection&&page.fixedText.some(label=>label.key==='timing-actions-locked'))){
      await open(page,'payment-timing-context');await waitText(page,true,browserPage,{'timing-actions-locked':expected.get(page.id+'/timing-actions-paid')});await nativeProof();
      await open(page,'wrong-timing-context');await waitText(page,true,browserPage,{'timing-actions-locked':'SYNTHETIC UNRELATED TIMING','timing-actions-paid':'SYNTHETIC UNRELATED TIMING','timing-after-month-end':'after end of the month','timing-they':'they','timing-lock':'lock'});await nativeProof();
      const unitOwners=page.observedComponents?.timeUnitOwnersProjection?.days?.owners||[];
      for(let index=0;index<unitOwners.length;index++){await open(page,'timing-unit-variant-'+index);await waitText(page,true);await nativeProof();}
      timingContexts.push({page:page.id,knownPaidContext:'PASS',unrelatedTitleRejectsContextualFragments:'PASS',actualDayUnitOwnerVariants:unitOwners.length});
    }
    const portalBoundaries=[];
    for(const page of pages.filter(page=>page.observedComponents?.frequencyPortalProjections||page.observedComponents?.statusMenuProjection)){
      for(const shape of ['wrong-portal-item','extra-portal-item','wrong-portal-header']){
        await open(page,shape);
        const overrides=Object.fromEntries(page.fixedText.filter(label=>label.sourceGroup?.startsWith('portal-')||label.sourceGroup?.startsWith('native-status-menu')).map(label=>[label.key,label.source]));
        Object.assign(overrides,await browserPage.evaluate(()=>window.__fixtureSourceOverrides));
        await waitText(page,true,browserPage,overrides);await nativeProof();portalBoundaries.push({page:page.id,shape,status:'PASS'});
      }
      if(page.observedComponents?.statusTriggerProjection){await open(page,'wrong-status-trigger');await waitText(page,true,browserPage,{'status-filter-placeholder':'Status'});await nativeProof();portalBoundaries.push({page:page.id,shape:'wrong-status-trigger',status:'PASS'});}
    }
    const hiddenTooltipBoundaries=[];
    for(const page of pages.filter(page=>page.observedComponents?.hiddenTooltipProjection)){
      await open(page,'wrong-hidden-tooltip-owner');
      const labels=page.fixedText.filter(label=>label.sourceGroup==='current-round-hidden-tooltip');
      await waitText(page,true,browserPage,Object.fromEntries(labels.map(label=>[label.key,label.source])));await nativeProof();
      hiddenTooltipBoundaries.push({page:page.id,fixedHiddenTexts:labels.length,wrongTriggerOwnerRejected:'PASS',realVisibleTooltipAcceptance:false});
    }
    const clearAllOwnerBoundaries=[];
    for(const page of pages.filter(page=>page.roleCounterexamples?.some(item=>item.key==='wrong-clearall-owner'))){
      await open(page);await waitText(page,true);await nativeProof();
      assert(await browserPage.evaluate(()=>{const nodes=window.__fixtureContainer.querySelectorAll('[data-synthetic-counterexample="wrong-clearall-owner"]');return nodes.length===1&&nodes[0].textContent==='Clear all'&&!nodes[0].closest('.iui-filter-section');}),'Same-Shadow Clear all button outside native filter owner was translated');
      clearAllOwnerBoundaries.push({page:page.id,sameShadowSameButtonRoleOutsideFilterRetainsOriginalText:'PASS',actualFilterLabelStillTranslates:'PASS',syntheticCounterexampleOnly:true});
    }
    return{representativePages:representatives.map(page=>page.id),variantsPerPage:5,welcomeEmailBoundaries,dataFeedBoundaries,recruitTooltipBoundaries,checklistFloatingNavigationBoundaries,childFrameExpectedOverrides:representatives.filter(page=>page.boundaryExpectedOverrides?.['child-frame']).map(page=>({page:page.id,overrides:page.boundaryExpectedOverrides['child-frame']})),contractsNavigationBoundaries,nativeTooltipPortalBoundaries,queryBoundaries,timingContexts,portalBoundaries,hiddenTooltipBoundaries,clearAllOwnerBoundaries,source:'same independently captured role projection, with one boundary changed at a time'};
  });
  }else results.push({name:'Linked candidate behaviors and candidate-only contextual boundaries',status:'NOT_RUN',evidence:'Baseline observation mode records actual old-package Text results only; missing new translations cannot establish candidate linkage or scoped-menu behavior.'});
  await check('Isolated extension snapshot and capture retain their bytes; final mode also freezes source',async()=>{
    const sourceUnchangedSinceSnapshot=Object.entries(sourceHashes).every(([file,hash])=>sha(readFileSync(path.join(sourceDir,file)))===hash);
    for(const[file,hash]of Object.entries(sourceHashes)){if(requireSourceUnchanged)assert.equal(sha(readFileSync(path.join(sourceDir,file))),hash,file+' source changed during final frozen check');assert.equal(sha(readFileSync(path.join(extension,file))),hash,file+' extension snapshot changed during check');}
    assert.equal(sha(readFileSync(capturePath)),sha(captureBytes),'Capture changed during check');
    if(expectationsPath)assert.equal(sha(readFileSync(expectationsPath)),sha(expectationsBytes),'Independent public test expectations changed during check');
    return{sourceFiles:sourceFiles.length,captureSHA256:sha(captureBytes),sourceUnchangedSinceSnapshot,requireSourceUnchanged,loadedExtensionSnapshotUnchanged:true};
  });
} finally {
  await context?.close();
  mkdirSync(reportDir,{recursive:true});
  const report={mode:'SYNTHETIC_CAPTURED_SETTINGS_DEEP_MV3',baselineObservation,version:manifest.version,sourceDirectory:path.relative(root,sourceDir),capture:path.relative(root,capturePath),captureSHA256:sha(captureBytes),expectations:expectationsPath?path.relative(root,expectationsPath):'independent literals in test file',expectationsSHA256:expectationsBytes?sha(expectationsBytes):null,expectationsStatus:reviewedExpectations?.status||'test-file expectations',testSHA256,sourceSHA256:sourceHashes,realSiteAcceptance:false,realNetworkQueries:false,fixtureScope:'Minimal projections of independently observed public Text-parent roles and explicitly known ancestors; not a complete live-DOM clone. Candidate/dictionary selectors are not fixture inputs.',pages:pages.map(page=>page.id),fixedTextContexts:pages.reduce((total,page)=>total+page.fixedText.length,0),perPageObservations,status:results.length===5&&results.every(result=>result.status==='PASS')?'PASS':'FAIL',results};
  const reportPath=path.join(reportDir,'test-'+new Date().toISOString().replace(/[:.]/gu,'-')+'.json');
  writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n',{flag:'wx'});console.log('Settings deep report: '+reportPath);
  rmSync(temporary,{recursive:true,force:true});
}
assert(results.length===5&&results.every(result=>result.status==='PASS'),'Targeted settings detail checks failed');

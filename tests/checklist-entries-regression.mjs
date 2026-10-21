/** Targeted shipped-dictionary check on observed Checklist DOM shapes; synthetic only. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, cpSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const integrationOnly = process.argv.includes('--test-integration-only');
const legacySetupOnly = process.argv.includes('--legacy-setup-only');
const checklistAliasContextOnly = process.argv.includes('--checklist-alias-context-only');
const checklistAliasOnly = process.argv.includes('--checklist-alias-only') || checklistAliasContextOnly;
assert([integrationOnly, checklistAliasOnly, legacySetupOnly].filter(Boolean).length <= 1, 'Choose only one targeted mode');
const reportArgument = process.argv.find(argument => argument.startsWith('--report-dir='))?.slice('--report-dir='.length);
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core'))); }
const sourceDir = checklistAliasOnly && process.env.IMPACT_CHECKLIST_SOURCE
  ? path.resolve(root, process.env.IMPACT_CHECKLIST_SOURCE) : path.join(root, 'impact-cn-mod');
const protectedFiles = ['dict.js', 'content.js', 'site-config.js', 'manifest.json', 'background.js', ...(readFileSync(path.join(sourceDir, 'manifest.json'), 'utf8').includes('settings-contract.js') ? ['settings-contract.js'] : [])];
const sha = file => createHash('sha256').update(readFileSync(file)).digest('hex');
const originalHashes = Object.fromEntries(protectedFiles.map(file => [file, sha(path.join(sourceDir, file))]));
const workspace = mkdtempSync(path.join(os.tmpdir(), 'impact-checklist-entries-'));
const extension = path.join(workspace, 'extension');
cpSync(sourceDir, extension, { recursive: true });
for (const file of protectedFiles) assert.equal(sha(path.join(extension, file)), originalHashes[file]);
const manifest = JSON.parse(readFileSync(path.join(extension, 'manifest.json'), 'utf8'));
const sandbox = {}; vm.createContext(sandbox);
vm.runInContext(readFileSync(path.join(extension, 'dict.js'), 'utf8'), sandbox);
const dictionary = sandbox.IMPACT_CN_DICTIONARY;
const legacySetupEntries = dictionary.entries.filter(item => item.id.startsWith('legacy-setup-'));
assert.equal(dictionary.version, manifest.version);
const entry = id => { const found = dictionary.entries.find(item => item.id === id); assert(found, 'Required shipped entry missing: ' + id); return found; };
const guide = entry('checklist-071-welcome-video-guide');
const redirect = entry('checklist-071-welcome-video-redirect');
const memberEntries = dictionary.entries.filter(item => item.id.startsWith('checklist-071-account-users-'));
assert.equal(memberEntries.length, 16);
const topPath = '/secure/advertiser/engage/checklist/instance/';
const membersPath = '/secure/advertiser/accountSettings/view-account-product-users-flow.ihtml';
const gatewayPath = '/secure/advertiser/fr/tracking-gateway-settings.ihtml';
const adsPath = '/secure/advertiser/engage/ads/manage-all-ads-flow.ihtml';
const trackingHelp = 'https://help.impact.com/en/support/solutions/articles/155000000002-gateway-tracking-templates#partner-tracking-template-0-0';
// Reproduce Ads light DOM and Gateway's actually observed open Shadow root.
// Values and event handlers below are entirely synthetic; no actual account data.
const gatewayFields = [
  ['heading', 'header-text', '', 'Gateway Tracking Settings'],
  ['default-landing-page', 'field-label-typography', 'header-text form-section-header', 'Default Landing Page '],
  ['default-landing-page-description', 'description-text', 'form-section-description', 'The default landing page is the URL to where all your links will go unless otherwise specified. Changing this will update all ads that use the program landing page. Custom landing pages will not be affected.'],
  ['program-template', 'field-label-typography', 'header-text form-section-header', 'Program Tracking Template '],
  ['program-template-description', 'description-text', 'form-section-description', ' Automatically append query-string parameters to all landing pages for this program. '],
  ['partner-template', 'field-label-typography', 'header-text form-section-header', 'Partner Tracking Template '],
  ['partner-template-description', 'description-text', 'form-section-description', ' Automatically append query-string parameters to all landing pages for Partners. '],
  ['deep-linking', 'field-label-typography', 'header-text form-section-header', 'Deep Linking '],
  ['deep-linking-description', 'description-text', 'form-section-description', 'Allow Partners to deep link to specific pages on my site.'],
  ['third-party-gateway-url', 'field-label-typography', 'header-text form-section-header', 'Third Party Gateway URL '],
  ['third-party-gateway-description', 'description-text', 'form-section-description', ' Send all traffic through a third-party gateway URL. '],
  ['click-tracking', 'field-label-typography', 'header-text form-section-header', 'Click Tracking Settings '],
  ['use-a', 'label', '', 'Use a'],
  ['session-window-length', 'label', '', 'session window length'],
  ['use-a', 'label', '', 'Use a'],
  ['session-window-type', 'label', '', 'session window type'],
  ['add-another', 'button', 'iui-component iui-btn addButton tertiary', ' Add Another'],
  ['save', 'button', 'iui-component iui-btn primary', 'Save']
];
const gatewayEntries = [...new Set([...gatewayFields.map(([suffix]) => 'checklist-gateway-' + suffix), 'checklist-gateway-tracking-template-help', 'checklist-gateway-show-available-macros'])].map(entry);
const adsEntries = ['checklist-ads-control-bulk-upload', 'checklist-ads-control-create-ad'].map(entry);
const html = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const member = suffix => entry('checklist-071-account-users-' + suffix);
const field = (suffix, tag = 'span', cls = '') => `<${tag} id="fixture-${suffix}" class="${cls}">${html(member(suffix).source)}</${tag}>`;
const topDOM = welcome => `<!doctype html><body><div id="checklist-outer-container"><div class="checklist-container iui-component"><div id="checklist-left-nav"><h2>Checklists</h2></div><div class="right-section-outermost-container"><div class="checklist-right-section">${welcome ? `<div id="video-component"><h2>Welcome to Impact.com</h2><div class="description">${html(guide.source)}</div><div class="sub-text">${html(redirect.source)}</div></div>` : '<div id="screen-outer-div"></div>'}</div></div></div></div><script>
window.__entriesFixture=[...document.querySelectorAll('#video-component .description,#video-component .sub-text')].map(element=>({element,node:element.firstChild,attributes:JSON.stringify([...element.attributes].map(attribute=>[attribute.name,attribute.value]))}));
</script></body>`;
const memberDOM = `<!doctype html><body><div id="vueInstance"><div class="top-info">${field('heading','h1')}</div>${field('default-view','span','default-label')}${field('active-tab','div','horizontal-tab-item')}${field('invited-tab','div','horizontal-tab-item')}<div class="data-header">${['manage','invite','status-filter','access-filter','clear-filters'].map(suffix=>field(suffix)).join('')}</div><div class="table-header">${['name-column','type-column','status-column','two-factor-column','access-column','last-sign-in-column','joined-column'].map(suffix=>field(suffix,'span','column-label')).join('')}</div><div class="table-body"><div class="table-row"><span id="fixture-business-row">Name</span></div></div><input id="fixture-input" value="Account Users"></div><script>
window.__entriesFixture=[...document.querySelectorAll('[id^="fixture-"]:not(input)')].map(element=>({element,node:element.firstChild,attributes:JSON.stringify([...element.attributes].map(attribute=>[attribute.name,attribute.value]))}));
</script></body>`;
const nativeStateCode = `
const rootScope = window.__nativeEntriesRoot || document;
const roots = [...rootScope.querySelectorAll('#app,#trkcfg-app,#main-content')];
const elements = [...(rootScope.host ? [rootScope.host] : []),...new Set(roots.flatMap(root => [root,...root.querySelectorAll('*')]))];
window.__nativeEntriesState = {
  records: elements.map(element => ({element,children:[...element.childNodes],attributes:JSON.stringify([...element.attributes].map(a=>[a.name,a.value]))})),
  controls: elements.filter(element => element.matches('input,select')).map(element => ({element,value:element.value,checked:element.checked})),
  shadow: rootScope.host ? {root:rootScope,host:rootScope.host,children:[...rootScope.childNodes]} : null,
  clicks: 0, inputEvents: 0
};
for (const button of rootScope.querySelectorAll('button')) button.addEventListener('click', () => window.__nativeEntriesState.clicks++);
for (const input of rootScope.querySelectorAll('input')) input.addEventListener('input', () => window.__nativeEntriesState.inputEvents++);
`;
const nativeStateScript = `<script>${nativeStateCode}</script>`;
const gatewayContent = `<style>field-label-typography,description-text,header-text{display:block}</style><div id="app"><div id="trkcfg-app">${gatewayFields.map(([suffix, tag, cls, source]) => {
  const help = ['program-template-description', 'partner-template-description', 'third-party-gateway-description'].includes(suffix)
    ? ` <a data-entry-id="checklist-gateway-tracking-template-help" href="${html(trackingHelp)}">Read more on tracking templates.</a>` : '';
  return `<${tag} data-entry-id="checklist-gateway-${suffix}" class="${cls}"${tag === 'button' ? ' type="button"' : ''}>${html(source)}${help}</${tag}>`;
}).join('')}<button type="button" class="iui-component iui-btn text"><span data-entry-id="checklist-gateway-show-available-macros">Show available macros</span><svg aria-hidden="true"></svg></button><input id="fixture-native-input" name="template" value="synthetic-template-value"><input id="fixture-native-check" type="checkbox" checked><select id="fixture-native-select"><option value="fixed-option" selected>Synthetic option</option></select><div class="partner-name" id="fixture-protected-name">Program Tracking Template</div></div></div><header-text id="fixture-outside-root">Gateway Tracking Settings</header-text>`;
function gatewayDOM(shape = 'verified') {
  const content = JSON.stringify(gatewayContent);
  // Only the negative missing-host fixture is flat. The positive structure is:
  // DIV#trkcfg-app-with-shadow-dom (no class) > #shadow-root > DIV#app > DIV#trkcfg-app.
  const bootstrap = shape === 'missing'
    ? `document.body.insertAdjacentHTML('afterbegin',${content});window.__nativeEntriesRoot=document;`
    : `const fixtureHost=document.createElement('div');fixtureHost.id=${JSON.stringify(shape === 'wrong' ? 'fixture-unrelated-shadow-host' : 'trkcfg-app-with-shadow-dom')};document.body.prepend(fixtureHost);const fixtureRoot=fixtureHost.attachShadow({mode:'open'});fixtureRoot.innerHTML=${content};window.__nativeEntriesRoot=fixtureRoot;`;
  return `<!doctype html><body><script>${bootstrap}${nativeStateCode}</script></body>`;
}
const adsDOM = `<!doctype html><body><main id="main-content"><div class="page-actions"><button type="button" data-entry-id="checklist-ads-control-bulk-upload">Bulk Upload</button><button type="button" data-entry-id="checklist-ads-control-create-ad">Create Ad</button></div><button type="button" id="fixture-outside-control">Create Ad</button><input id="fixture-native-input" value="synthetic-ad-name"><span class="partner-name" id="fixture-protected-name">Create Ad</span></main>${nativeStateScript}</body>`;
// The normal top-level adapter requires an existing configured content root;
// the Checklist iframe deliberately uses its narrower document root instead.
const adsTopDOM = adsDOM.replace('<main id="main-content">','<div id="vueInstance"><main id="main-content">').replace('</main>','</main></div>');
// These two routes render the same fixed integration form in the supplied screenshots.
// The form selectors are reused from previously observed dictionary scopes; the
// three long instruction nodes and sidebar reuse remain synthetic until live DOM QA.
const integrationPaths = [
  '/secure/advertiser/engage/actions/tests/test-actions-flow.ihtml',
  '/secure/advertiser/tracking-settings/actiontracker/launch-test-action-flow.ihtml'
];
const integrationEntries = dictionary.entries.filter(item => item.id.startsWith('engage-complete-') && item.scope?.pathExact === integrationPaths[0]);
const integrationInstructions = dictionary.entries.filter(item => item.id.startsWith('test-integration-instruction-') && item.scope.pathExact === integrationPaths[0]);
const integrationFloatingEntries = dictionary.entries.filter(item => item.id.startsWith('test-integration-floating-validate-events-'));
// Fixed expectations keep the previous extension a meaningful untranslated baseline.
const floatingSource = 'Validate Your Events', floatingTarget = '验证转化事件';
assert.equal(integrationEntries.length, 17);
assert.equal(integrationInstructions.length, 3);
function integrationDOM(wrongRoot = false, floatingShape = 'verified') {
  const buttons = new Set(['Run Test','Start test in a new window','Copy','View my test action']);
  const content = integrationEntries.map(item => {
    const source = item.source === 'Test your integration' ? 'Test Your Integration' : item.source;
    const tag = item.scope.selector === 'p.instructions' ? 'p' : buttons.has(item.source) ? 'button' : 'field-label-typography';
    return `<${tag} data-entry-id="${item.id}"${tag === 'p' ? ' class="instructions"' : tag === 'button' ? ' type="button" data-testid="uicl-button"' : ''}>${html(source)}</${tag}>`;
  }).join('');
  const floatingTag = floatingShape === 'wrong-host' ? 'div' : 'impact-style-isolator';
  return `<!doctype html><body class="${floatingShape === 'wrong-theme' ? 'vnext-light' : 'vnext-dark'}"><div id="adv-navigation"><impact-style-isolator></impact-style-isolator></div><${floatingTag} id="fixture-floating-host"></${floatingTag}><main id="vueInstance"><section id="${wrongRoot ? 'unrelated-form' : 'templateContainer'}">${content}${integrationInstructions.map(item => `<p data-entry-id="${item.id}">${html(item.source)}</p>`).join('')}<input id="fixture-native-input" value="Template Term"><select id="fixture-native-select"><option value="Program" selected>Program</option></select><span class="partner-name" id="fixture-protected-name">Program</span></section><p id="fixture-outside-instruction">${html(integrationInstructions[0].source)}</p></main><script>
  const host = document.querySelector('#adv-navigation > impact-style-isolator');
  const shadow = host.attachShadow({mode:'open'});
  shadow.innerHTML='<div id="expanded-bar"><div class="subitem-container checklistItem"><span class="subitem-label cursor" id="fixture-checklists">Checklists</span></div></div>';
  const floatingHost = document.querySelector('#fixture-floating-host');
  if(${JSON.stringify(floatingShape)} === 'wrong-parent') {
    const unrelated = document.createElement('div');document.body.insertBefore(unrelated,floatingHost);unrelated.append(floatingHost);
  }
  const floatingRoot = ${JSON.stringify(floatingShape)} === 'missing-shadow' ? floatingHost : floatingHost.attachShadow({mode:'open'});
  floatingRoot.innerHTML='<div class="${floatingShape === 'wrong-root' ? 'unrelated-widget' : 'float-widget'}"><div class="sub-container"><div class="float-middle-texts"><span id="fixture-floating-program">Synthetic Program</span><div class="float-subtext" id="fixture-floating-validate">${floatingSource}</div></div></div></div><div class="float-subtext" id="fixture-floating-outside">${floatingSource}</div>';
  const floating = floatingRoot.querySelector('#fixture-floating-validate');
  const roots = [document.querySelector('#vueInstance'),shadow,floatingHost,...(floatingRoot === floatingHost ? [] : [floatingRoot])];
  window.__integrationState = {records: roots.flatMap(root => [root,...root.querySelectorAll('*')]).map(element => ({element, children:[...element.childNodes], attributes:element.attributes ? JSON.stringify([...element.attributes].map(a => [a.name,a.value])) : null})), input:document.querySelector('input'), select:document.querySelector('select'), floating, floatingText:floating.firstChild, floatingHost, floatingParent:floatingHost.parentNode, bodyClass:document.body.className, clicks:0};
  document.querySelector('[data-entry-id="engage-complete-d0f9aaa79eec"]').addEventListener('click', () => window.__integrationState.clicks++);
  </script></body>`;
}
async function assertIntegrationState() {
  assert(await page.locator('body').evaluate(() => {
    const state = window.__integrationState;
    return state.records.every(({element,children,attributes}) => element.isConnected && element.childNodes.length === children.length && children.every((node,index) => element.childNodes[index] === node) && (attributes === null || JSON.stringify([...element.attributes].map(a => [a.name,a.value])) === attributes))
      && state.input.value === 'Template Term' && state.select.value === 'Program' && state.select.options[0].textContent === 'Program'
      && state.floating.firstChild === state.floatingText && state.floatingHost.parentNode === state.floatingParent && document.body.className === state.bodyClass;
  }), 'Integration native nodes, attributes or values changed');
  assert.equal(await page.locator('#fixture-protected-name').innerText(),'Program');
  assert.equal(await page.locator('#fixture-outside-instruction').innerText(),integrationInstructions[0].source);
  assert.equal(await page.locator('#fixture-floating-program').innerText(),'Synthetic Program');
  assert.equal(await page.locator('#fixture-floating-outside').innerText(),floatingSource);
}
async function integrationFloatingText(translated) {
  const label = page.locator('#fixture-floating-validate'), expected = translated ? floatingTarget : floatingSource;
  try { await waitText(label,expected); }
  catch(error) { throw new Error(`Floating fixed Text expected ${JSON.stringify(expected)}, actual ${JSON.stringify(await label.innerText())}: ${error.message}`); }
}
async function integrationFixedText(translated) {
  for (const item of [...integrationEntries,...integrationInstructions]) {
    const expected = translated ? item.target : item.source === 'Test your integration' ? 'Test Your Integration' : item.source;
    await waitText(page.locator(`[data-entry-id="${item.id}"]`),expected);
  }
}
const legacySetupPath = '/secure/advertiser/engage/aview.ihtml';
const legacySetupFields = [
  ['welcome','Welcome to Impact','welcome'],
  ['get-started',"Let's Get Started",'intro-title'],
  ['intro','A program can be set up in 6 easy steps. Upon completion of the setup, your program will be active in the marketplace, you will be able to recruit media partners, media partners will join your program, they will place your ads and begin to drive traffic, which we will track!','intro'],
  ['completeness','Program Setup Completeness','progress'],
  ['complete-marketplace-profile','Complete Marketplace Profile','heading',1],
  ['learn-more','Learn More','tooltip',1],
  ['start','Start','button',1],
  ['marketplace-profile','Marketplace Profile','link',1],
  ['invite-technical-contact','Invite Technical Contact','heading',2],
  ['revisit','Revisit','button',2],
  ['invite-tracking-contact','Invite a technical person who will be doing your tracking integration','link',2],
  ['optional','(optional)','optional',3],
  ['event-type','Set Up Event Type (Conversion Pixel, Call Center)','heading',3],
  ['create-validate-event','Create and validate at least one online or offline Event Type','link',3],
  ['tracker-unvalidated','action tracker is not validated','warning',3],
  ['item-categories','Create Item category list to support SKU level payouts','link',3],
  ['public-template','Create Public Template Term','heading',4],
  ['public-template-detail','Create your public Template Term','link',4],
  ['custom-terms','Create Custom Terms','link',4],
  ['fund-account','Fund Account','heading',5],
  ['initiate-transfer','Initiate Transfer (unused funds are returned)','link',5],
  ['upload-ads','Upload Ads','heading',6],
  ['upload-creative','Upload at least one creative','link',6],
  ['accept-terms','Accept Terms','heading',7],
  ['review-approval','Review and Approval','review-heading'],
  ['submit-review','Submit For Review','review-button'],
  ['complete-before-live','You must complete the above steps before going live.','review-requirement'],
  ['support-requests','Support Requests','support-heading'],
  ['support-intro','Please browse our','support-intro'],
  ['help-center','help center','support-link'],
  ['support-detail','for general answers to your questions. If you need further assistance, you may contact us by email.','support-detail']
];
function legacySetupDOM(wrongRoot = false) {
  const field = (suffix, source, tag, classes = '') => `<${tag} data-entry-id="legacy-setup-${suffix}"${classes ? ` class="${classes}"` : ''}>${html(suffix === 'tracker-unvalidated' ? ' \n action tracker   is not validated \t ' : source)}</${tag}>`;
  const steps = Array.from({ length: 7 }, (_, index) => `<div id="stepBox${index + 1}" class="uitkClear solidOverlined">${legacySetupFields.filter(item => item[3] === index + 1).map(([suffix, source, role]) => {
    if (role === 'heading') return field(suffix, source, 'h1', 'uitkBiggestText floatLeftImg');
    if (role === 'button') return `<button type="button" data-fixture-native-action="${suffix}">${field(suffix, source, 'span', 'x-btn-inner')}</button>`;
    if (role === 'tooltip') return `<div class="outsideTopBoxPadding"><span class="uitkDisplayTooltip textGrey outsideTopBoxPadding" data-entry-id="legacy-setup-learn-more"> Learn More<span class="uitkTooltipInfo" id="synthetic-tooltip-only"><span data-legacy-preserved="tooltip-text">Learn More</span><span class="uitkDisplayTooltip textGrey outsideTopBoxPadding" data-legacy-preserved="tooltip-same-class">Learn More</span><span data-legacy-preserved="tooltip-unknown">Synthetic unreviewed help text</span></span></span></div>`;
    if (role === 'optional' || role === 'warning') return '';
    if (suffix === 'create-validate-event') return `<li class="uitkClear lineEvener" data-legacy-punctuation>${field(suffix, source, 'a')}(${field('tracker-unvalidated','action tracker is not validated','b')})</li>`;
    if (suffix === 'item-categories') return `<li class="uitkClear lineEvener">${field(suffix, source, 'a')} ${field('optional','(optional)','span','textLightGrey')}</li>`;
    return `<li class="uitkClear lineEvener">${field(suffix, source, 'a')}</li>`;
  }).join('')}${index===2?['Marketplace Profile','Start','Revisit','Performance'].map(name=>'<li class="uitkClear lineEvener"><a data-legacy-preserved="same-name-tracker">'+html(name)+'</a></li>').join(''):''}${index===6?'<li class="uitkClear lineEvener" data-legacy-preserved="wrong-review">You must complete the above steps before going live.</li>':''}</div>`).join('');
  const sourceFor = suffix => legacySetupFields.find(item => item[0] === suffix)[1];
  return `<!doctype html><body><div id="uitk-container"><div id="main-content"><div id="${wrongRoot ? 'unrelated-template' : 'templateContainer'}">
    ${field('welcome',sourceFor('welcome'),'h1','uitkHugeHeading')}
    <div class="boxType1 outsideBottomMaxMargin uitkOutsideEvenMaxPadding" data-entry-id="legacy-setup-intro">${field('get-started',sourceFor('get-started'),'h2','hugeSubHeading')}${html(sourceFor('intro'))}</div>
    <div class="noBorderGreyBg roundStrokeBox" data-entry-id="legacy-setup-completeness">${html(sourceFor('completeness'))}<span data-legacy-preserved="amount">$123.45</span><span data-legacy-preserved="percent">73%</span></div>
    <div id="setupWizard" class="uitkOutsideEvenMaxPadding">${steps}
    <div class="uitkClear outsideEvenMoreBoxPadding solidOverlined">${field('review-approval',sourceFor('review-approval'),'h1','uitkBiggestText floatLeftImg')}<li class="uitkClear lineEvener"><div class="extButton disabledButton"><button type="button" disabled data-fixture-native-action="submit-review">${field('submit-review',sourceFor('submit-review'),'span','x-btn-inner')}</button></div> ${html(sourceFor('complete-before-live'))} </li></div>
    <div class="grey_borderBnBox outsideBottomMaxMargin">${field('support-requests',sourceFor('support-requests'),'b','textLightSilverBevel')}<div id="irSupportTicketBox" class="uitkOutsideEvenPadding"><p data-entry-id="legacy-setup-support-intro">${html(sourceFor('support-intro'))} <a data-entry-id="legacy-setup-help-center" title="Help Center" href="javascript:void(0)">${html(sourceFor('help-center'))}</a> ${html(sourceFor('support-detail'))}</p></div></div>
    <div class="native-status" data-legacy-preserved="status">In setup</div><span class="partner-name" data-legacy-preserved="name">Marketplace Profile</span><span data-legacy-preserved="name">Create Public Template Term</span><input id="fixture-legacy-input" value="synthetic-native-value"><input type="checkbox" id="fixture-legacy-check" checked><select id="fixture-legacy-select"><option value="synthetic-option" selected>Marketplace Profile</option></select></div>
    ${legacySetupFields.map(([suffix,source]) => `<div data-legacy-negative="${suffix}">${html(source)}</div>`).join('')}
    </div></div></div><script>${nativeStateCode}
    window.__legacySetupRecords=[...document.querySelectorAll('[data-entry-id]')].map(element=>({element,texts:[...element.childNodes].filter(node=>node.nodeType===Node.TEXT_NODE)}));
    window.__legacySetupTargets=window.__legacySetupRecords.map(record=>({id:record.element.dataset.entryId,node:record.texts.find(node=>node.nodeValue.trim())}));
    window.__legacySetupTargets.push({id:'legacy-setup-complete-before-live',node:[...document.querySelector('[data-fixture-native-action="submit-review"]').closest('li').childNodes].find(node=>node.nodeType===Node.TEXT_NODE&&node.nodeValue.includes('You must complete'))});
    window.__legacySetupTargets.push({id:'legacy-setup-support-detail',node:document.querySelector('#irSupportTicketBox > p').lastChild});
    window.__legacySetupPunctuation=[...document.querySelectorAll('[data-legacy-punctuation]')].flatMap(element=>[...element.childNodes].filter(node=>node.nodeType===Node.TEXT_NODE).map(node=>({node,value:node.nodeValue})));
    window.__legacySetupPreserved=[...document.querySelectorAll('[data-legacy-preserved],[data-legacy-negative]')].map(element=>({element,node:element.firstChild,value:element.textContent}));
    window.__legacyHelpClicks=0;document.querySelector('#irSupportTicketBox > p > a').addEventListener('click',event=>{event.preventDefault();window.__legacyHelpClicks++;});
    </script></body>`;
}
async function assertLegacySetupState() {
  await assertNativeState(page);
  assert.deepEqual(await page.locator('[data-legacy-preserved="same-name-tracker"]').allTextContents(),['Marketplace Profile','Start','Revisit','Performance'],'Same-name business tracker links in step 3 must remain unchanged');
  assert(await page.evaluate(() => window.__legacySetupRecords.every(record => record.texts.every(node => [...record.element.childNodes].includes(node)))
    && window.__legacySetupPunctuation.every(record => record.node.nodeValue === record.value)
    && window.__legacySetupPreserved.every(record => record.element.firstChild === record.node && record.element.textContent === record.value)));
}
async function waitLegacySetupEntries(translated) {
  const expectations = legacySetupEntries.map(item=>({id:item.id,text:translated?item.target:item.source}));
  await page.waitForFunction(expectations=>expectations.every(expected=>{
    const record=window.__legacySetupTargets.find(item=>item.id===expected.id);
    return record?.node?.isConnected&&record.node.nodeValue.trim().replace(/\s+/gu,' ')===expected.text;
  }),expectations);
}
async function openLegacySetup({ hostname = 'demo.impact.com', pathname = legacySetupPath, query = 't=u', wrongRoot = false } = {}) {
  await settings(true);
  await page.goto(`https://${hostname}${pathname}?legacy-setup-fixture=1${query ? '&' + query : ''}${wrongRoot ? '&wrong-legacy-root=1' : ''}`);
}
async function runLegacySetupChecks() {
  await check('Legacy setup requires exact advertiser path unique setup query top document and observed components', async () => {
    assert.equal(legacySetupEntries.length,31); assert.equal(legacySetupFields.length,31);
    for (const [suffix,source,role,stepNumber] of legacySetupFields) {
      const item = entry('legacy-setup-'+suffix); assert.equal(item.source,source); assert.equal(item.match,'exact');
      assert.equal(item.scope.pathExact,legacySetupPath); assert.deepEqual(JSON.parse(JSON.stringify(item.scope.query)),{t:'u'});
      assert.equal(item.scope.topOnly,true); assert.equal(item.scope.lightDOMOnly,true);
      assert.deepEqual([...item.scope.hosts].sort(),['app.impact.com','demo.impact.com']);
      assert(item.scope.selector.startsWith('#uitk-container > #main-content > #templateContainer')); assert(!item.helpTopicId && !item.aliases);
      if (role === 'button') {
        assert(item.scope.selector.endsWith('button > span.x-btn-inner'));
        assert(!item.scope.selector.includes('h1.') && !item.scope.selector.includes('li.'));
      } else if (['heading','link'].includes(role) && suffix !== 'learn-more') {
        assert(item.scope.selector.includes('> #stepBox'+stepNumber+'.uitkClear.solidOverlined '));
        assert(item.scope.selector.endsWith(role==='heading'?'h1.uitkBiggestText.floatLeftImg':'li.uitkClear.lineEvener > a'));
        assert(!item.scope.selector.includes(','),'Fixed step roles must not share a heading/link/button union: '+suffix);
      } else if (role === 'tooltip') {
        assert.equal(item.scope.textParentSelector,item.scope.selector);
        assert(item.scope.selector.includes('span.uitkDisplayTooltip.textGrey.outsideTopBoxPadding'));
        assert(item.scope.selector.includes(':not(.uitkTooltipInfo *)'));
      }
    }
  });
  await check('Legacy setup fixed Text translates and restores while native values status names amounts percentages and events remain unchanged', async () => {
    await openLegacySetup(); await waitLegacySetupEntries(true); await assertLegacySetupState();
    await page.locator('[data-fixture-native-action="start"]').click();
    assert.equal(await page.evaluate(()=>window.__nativeEntriesState.clicks),1);
    await page.locator('#irSupportTicketBox > p > a').click(); assert.equal(await page.evaluate(()=>window.__legacyHelpClicks),1);
    await settings(false); await waitLegacySetupEntries(false); await assertLegacySetupState();
    await settings(true); await waitLegacySetupEntries(true); await assertLegacySetupState();
    await openLegacySetup({hostname:'app.impact.com'}); await waitLegacySetupEntries(true); await assertLegacySetupState();
  });
  await check('Legacy setup rejects wrong missing duplicate queries hosts route suffixes and unrelated structures', async () => {
    for (const options of [{query:''},{query:'t=other'},{query:'t=u&t=u'},{hostname:'other.example'},{pathname:legacySetupPath+'/extra'},{pathname:'/secure/advertiser/engage/dashboard.ihtml'},{wrongRoot:true}]) {
      await openLegacySetup(options); await page.waitForTimeout(120);
      await waitLegacySetupEntries(false); await assertLegacySetupState();
    }
  });
}
const results = [];
let context, page, worker;
async function check(name, action) {
  try { await action(); results.push({ name, status: 'PASS' }); console.log('CHECKLIST ENTRY PASS ' + name); }
  catch (error) { results.push({ name, status: 'FAIL', evidence: error.message }); console.log('CHECKLIST ENTRY FAIL ' + name + ': ' + error.message); }
}
async function settings(enabled) { await worker.evaluate(enabled=>chrome.storage.local.set({impactCNEnabled:enabled,impactCNAIEnabled:false}),enabled); }
async function waitText(locator, expected) { await locator.filter({hasText:expected}).waitFor(); assert.equal(await locator.innerText(), expected); }
async function assertIdentity(frame) { assert(await frame.locator('body').evaluate(()=>window.__entriesFixture.every(record=>record.element.isConnected&&record.element.firstChild===record.node&&JSON.stringify([...record.element.attributes].map(attribute=>[attribute.name,attribute.value]))===record.attributes))); }
async function waitEntries(frame, entries, translated) {
  for (const item of entries) {
    const expected = translated ? item.target : item.source;
    const locator = frame.locator(`[data-entry-id="${item.id}"]`);
    await locator.filter({hasText:expected}).first().waitFor();
    const texts = await locator.evaluateAll(elements => elements.map(element => [...element.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.nodeValue).join('').replace(/\s+/gu,' ').trim()));
    assert(texts.length > 0, 'Observed fixed element missing: ' + item.id);
    assert(texts.every(text => text === expected), 'Unexpected direct Text for ' + item.id + ': ' + JSON.stringify(texts));
  }
}
async function assertNativeState(frame) {
  assert(await frame.locator('body').evaluate(() => {
    const state = window.__nativeEntriesState;
    return state.records.every(({element,children,attributes}) => element.isConnected
      && element.childNodes.length === children.length && children.every((node,index) => element.childNodes[index] === node)
      && JSON.stringify([...element.attributes].map(a=>[a.name,a.value])) === attributes)
      && state.controls.every(({element,value,checked}) => element.value === value && element.checked === checked)
      && (!state.shadow || (state.shadow.host.shadowRoot === state.shadow.root && state.shadow.root.childNodes.length === state.shadow.children.length && state.shadow.children.every((node,index) => state.shadow.root.childNodes[index] === node)))
      && state.inputEvents === 0;
  }), 'Native nodes, order, attributes, values or input events changed');
}
async function openNative(documentPath, { parentPath = topPath + 'synthetic-scoped-entries', validFrame = true, validShell = true, gatewayShape = 'verified' } = {}) {
  await settings(true);
  await page.goto('https://demo.impact.com' + parentPath + '?native-fixture=1' + (validShell ? '' : '&wrong-shell=1'));
  await page.locator('#screen-outer-div').evaluate((slot,{url,validFrame}) => {
    const frame = document.createElement('iframe'); frame.id = 'iframe'; frame.className = 'checklist-iframe';
    frame.name = validFrame ? 'screenIframe' : 'unrelatedIframe'; frame.src = url; slot.append(frame);
  }, { url:'https://demo.impact.com' + documentPath + '?synthetic-document=1&gateway-shape=' + gatewayShape, validFrame });
  const frame = page.locator('iframe#iframe').contentFrame();
  await frame.locator('[data-entry-id]').first().waitFor();
  // Negative cases must outlive initialization and one parent-context poll.
  if (!validFrame || !validShell || !parentPath.startsWith(topPath) || gatewayShape !== 'verified') await page.waitForTimeout(1100);
  return frame;
}

// Only --checklist-alias-only executes these fixtures. Every request is fulfilled
// locally or aborted; no live Program, account value or configuration is used.
const checklistAliasPath = '/secure/advertiser/checklist/checklist-instance.ihtml';
const websitePath = '/secure/advertiser/checklist/website-tracking-checklist-flow.ihtml';
const aliasShellEntries = ['welcome','welcome-to-impact','account-setup','technical-integration','customize-branding','review']
  .map(suffix => entry('checklist-071-shell-' + suffix));
const websiteHeading = entry('checklist-071-website-default-landing-page');
const aliasWelcomeEntries = [...aliasShellEntries, guide, redirect];
function aliasDOM({ delayed = false, shell = true } = {}) {
  const shellContent = `<div id="checklist-outer-container"><div class="${shell ? 'checklist-container iui-component' : 'unrelated-container'}"><div id="checklist-left-nav">${aliasShellEntries.map(item => `<h4 data-entry-id="${item.id}">${html(item.source)}</h4>`).join('')}</div><div class="right-section-outermost-container"><div class="checklist-right-section"><div id="video-component"><p data-entry-id="${guide.id}">${html(guide.source)}</p><p data-entry-id="${redirect.id}">${html(redirect.source)}</p></div><div id="screen-outer-div"></div></div></div><span class="partner-name" id="alias-name">Welcome</span><input id="alias-input" value="Welcome"><button type="button" id="alias-button">Synthetic native action</button></div></div>`;
  return `<!doctype html><body><style>body{margin:0}#checklist-left-nav{width:260px}#screen-outer-div{position:absolute;left:330px;top:100px}#screen-outer-div iframe{width:800px;height:500px;border:0}</style><script>
  window.__aliasClicks=0;window.__aliasInputEvents=0;
  window.__mountAlias=()=>{document.body.insertAdjacentHTML('beforeend',${JSON.stringify(shellContent)});
  window.__aliasRecords=[...document.querySelectorAll('#checklist-outer-container [data-entry-id],#alias-name,#alias-input,#alias-button')].map(element=>({element,children:[...element.childNodes],attributes:JSON.stringify([...element.attributes].map(a=>[a.name,a.value]))}));
  document.querySelector('#alias-button').addEventListener('click',()=>window.__aliasClicks++);
  document.querySelector('#alias-input').addEventListener('input',()=>window.__aliasInputEvents++);};
  ${delayed ? '' : 'window.__mountAlias();'}
  </script></body>`;
}
const aliasWebsiteDOM = `<!doctype html><body><style>body{margin:0}#vueInstance{padding:80px 60px}field-label-typography{display:block;width:260px;height:28px}</style><div id="vueInstance"><field-label-typography class="form-section-header" data-entry-id="${websiteHeading.id}">${html(websiteHeading.source)}</field-label-typography><input id="alias-child-input" value="https://synthetic.invalid/"><span class="partner-name" id="alias-child-name">Default landing page</span></div><script>window.__aliasHeading=document.querySelector('field-label-typography');window.__aliasHeadingText=window.__aliasHeading.firstChild;</script></body>`;
async function aliasText(translated) { await waitEntries(page, aliasWelcomeEntries, translated); }
async function assertAliasState() {
  assert(await page.evaluate(() => window.__aliasRecords.every(({element,children,attributes}) => element.isConnected
    && element.childNodes.length === children.length && children.every((node,index)=>element.childNodes[index]===node)
    && JSON.stringify([...element.attributes].map(a=>[a.name,a.value]))===attributes)
    && document.querySelector('#alias-name').textContent==='Welcome'
    && document.querySelector('#alias-input').value==='Welcome' && window.__aliasInputEvents===0));
}
async function aliasOpen(parentPath = checklistAliasPath, options = {}) {
  const base = options.base || 'https://demo.impact.com';
  await settings(true);
  await page.goto(base + parentPath + '?checklist-alias-fixture=1' + (options.delayed ? '&delayed=1' : '') + (options.shell === false ? '&wrong-shell=1' : ''));
  if (options.delayed) {await page.locator('#impact-cn-assistant').waitFor();await page.evaluate(()=>window.__mountAlias());}
}
async function aliasFrame(options = {}) {
  await page.locator('#screen-outer-div').evaluate((slot,{websitePath,validSlot}) => {
    const frame=document.createElement('iframe');frame.id='iframe';frame.className='checklist-iframe';frame.name=validSlot?'screenIframe':'unrelatedIframe';frame.src=websitePath+'?checklist-alias-fixture=1';slot.append(frame);
  },{websitePath,validSlot:options.validSlot!==false});
  const frame=page.locator('#screen-outer-div iframe').contentFrame();
  await frame.locator('field-label-typography').waitFor();return frame;
}
function aliasWorkerVM() {
  let listener;
  const sandbox={URL,URLSearchParams,importScripts(){},chrome:{runtime:{id:'alias-fixture-runtime',onMessage:{addListener(fn){listener=fn;}}}}};
  vm.createContext(sandbox);vm.runInContext(readFileSync(path.join(extension,'background.js'),'utf8'),sandbox,{timeout:1000});
  return {query(sender,message={type:'impact-cn:checklist-frame-context'}) {let response;listener(message,sender,value=>{response=value;});return JSON.parse(JSON.stringify(response));}};
}
function aliasScopeVM() {
  const source=readFileSync(path.join(extension,'content.js'),'utf8');
  const begin=source.indexOf('  function scopeMatches(entry, element) {'), end=source.indexOf('\n  function removeHelpButton(',begin);
  assert(begin>=0&&end>begin,'Scope function boundary missing');
  const configSandbox={};vm.createContext(configSandbox);vm.runInContext(readFileSync(path.join(extension,'site-config.js'),'utf8'),configSandbox);
  let context;
  const sandbox={URLSearchParams,translationOnly:true,isChecklistAsset:true,isChecklistReview:false,location:{hostname:'ui.assets.impact.com',pathname:'',href:'',search:'',origin:'https://ui.assets.impact.com'},
    checklistConfig:configSandbox.IMPACT_CN_CONFIG.localization.checklist,checklistFrameContext:()=>context,composedClosest:()=>true,normalize:text=>String(text).replace(/\s+/gu,' ').trim(),window:{},document:{}};
  Object.defineProperty(sandbox.window,'top',{get(){throw Error('Cross-origin top must not be read');}});
  vm.createContext(sandbox);vm.runInContext(source.slice(begin,end),sandbox);
  return {matches(item,route){context={asset:true,hostname:'ui.assets.impact.com',topPath:route};sandbox.location.pathname=item.scope.pathExact;sandbox.location.href=sandbox.location.origin+item.scope.pathExact;return sandbox.scopeMatches(item,{closest:()=>({querySelectorAll:()=>[{textContent:item.source}]})});}};
}
async function assertAliasContextProtocol() {
  const source=readFileSync(path.join(extension,'content.js'),'utf8');
  const begin=source.indexOf('  async function verifyChecklistAssetContext('),end=source.indexOf('\n  for (const entry of dictionary.entries',begin);
  assert(begin>=0&&end>begin,'Context protocol function boundary missing');
  let response,schedules=0;
  const sandbox={isChecklistAsset:true,destroyed:false,checklistContextPending:false,inExtension:true,
    runtime:{sendMessage:async()=>response},checklistConfig:{topPath,topPathExact:checklistAliasPath},
    checklistAssetAllowed:false,checklistAssetTopPath:undefined,document:{body:{}},schedule(){schedules++;}};
  vm.createContext(sandbox);vm.runInContext(source.slice(begin,end),sandbox);
  for(const [reply,allowed,route,count] of [
    [{allowed:true},true,topPath,1],
    [{allowed:true,topPath:checklistAliasPath},true,checklistAliasPath,2],
    [{allowed:true,topPath:checklistAliasPath},true,checklistAliasPath,2],
    [{allowed:true,topPath:'/unknown-checklist-route'},false,undefined,3],
    [{allowed:true,topPath:null},false,undefined,3],
    [{allowed:true,topPath},true,topPath,4],
    [{allowed:false,topPath:checklistAliasPath},false,undefined,5]
  ]) {
    response=reply;await sandbox.verifyChecklistAssetContext();assert.equal(sandbox.checklistAssetAllowed,allowed);
    assert.equal(sandbox.checklistAssetTopPath,route);assert.equal(schedules,count);assert.equal(sandbox.checklistContextPending,false);
  }
  const scopes=aliasScopeVM();
  for(const pathname of [
    '/onboarding-ui/checklist-assets/production/payout-terms/default.html',
    '/onboarding-ui/checklist-assets/production/migrated/event-type-validation.html',
    '/onboarding-ui/checklist-assets/production/operator-json/linkout.html',
    '/onboarding-ui/checklist-assets/production/operator-json/instructions.html'
  ]) {
    const item=dictionary.entries.find(item=>item.scope?.pathExact===pathname&&item.scope?.topPath===topPath&&item.match==='exact');
    assert.equal(scopes.matches(item,'/unknown-checklist-route'),false);assert.equal(scopes.matches(item,null),false);
  }
}
async function runChecklistAliasChecks() {
  if(!checklistAliasContextOnly) {
  await check('Exact Checklist alias translates shipped shell/welcome on cold open delayed DOM and same-document route change and restores original Text',async()=>{
    for(const options of [{},{delayed:true}]) {
      await aliasOpen(checklistAliasPath,options);await aliasText(true);await assertAliasState();
      await page.locator('#alias-button').click();assert.equal(await page.evaluate(()=>window.__aliasClicks),1);
      await settings(false);await aliasText(false);await assertAliasState();await settings(true);await aliasText(true);
    }
    await aliasOpen(topPath+'synthetic-alias');await aliasText(true);
    await page.evaluate(route=>history.pushState({},'',route+'?synthetic-program-change=1'),checklistAliasPath);await aliasText(true);await assertAliasState();
    await page.evaluate(()=>{document.querySelector('#checklist-outer-container').remove();window.__mountAlias();});await aliasText(true);await assertAliasState();
    await page.evaluate(route=>history.pushState({},'',route+'/extra'),checklistAliasPath);await aliasText(false);await assertAliasState();
    await page.evaluate(route=>history.pushState({},'',route),checklistAliasPath);await aliasText(true);await assertAliasState();
    await settings(false);await aliasText(false);await assertAliasState();
    await settings(true);await aliasText(true);
  });
  await check('Alias same-origin title and 5b locator retain coverage pause recovery close cleanup and independent parent/slot rejection',async()=>{
    for(const pathname of [checklistAliasPath,topPath+'synthetic-alias']) {
      await aliasOpen(pathname);const frame=await aliasFrame();await waitText(frame.locator('field-label-typography'),websiteHeading.target);
      await page.locator('.impact-cn-launcher').click();
      await page.locator('[data-impact-cn-guide-open]').click();
      // A real guide select chooses only a guide step; no native setting is touched.
      const stepSelect=page.locator('[data-impact-cn-guide-substep]');
      await stepSelect.evaluate(element=>{const details=element.closest('details');if(details)details.open=true;});
      if(await stepSelect.locator('option[value="5b"]').count()===0) {
        const cardSelect=page.locator('[data-impact-cn-guide-card]');
        for(const value of await cardSelect.locator('option').evaluateAll(options=>options.map(option=>option.value))) {await cardSelect.selectOption(value);if(await stepSelect.locator('option[value="5b"]').count())break;}
      }
      await stepSelect.selectOption('5b');await page.locator('[data-impact-cn-guide-locate]').click();
      await page.locator('#impact-cn-guide-pointer[data-target-kind="control"]').waitFor();
      const headingRect=await frame.locator('field-label-typography').boundingBox();assert(headingRect);
      await page.evaluate(rect=>{const cover=document.createElement('div');cover.id='alias-cover';Object.assign(cover.style,{position:'fixed',left:rect.x+'px',top:rect.y+'px',width:rect.width+'px',height:rect.height+'px',zIndex:'2147483647',background:'#fff'});document.body.append(cover);window.dispatchEvent(new Event('resize'));},headingRect);
      await waitText(page.locator('[data-impact-cn-guide-locate]'),'取消定位');assert.equal(await page.locator('#impact-cn-guide-pointer').count(),0);
      await page.evaluate(()=>{document.querySelector('#alias-cover').remove();window.dispatchEvent(new Event('resize'));});
      await waitText(page.locator('[data-impact-cn-guide-locate]'),'隐藏箭头');await page.locator('#impact-cn-guide-pointer').waitFor();
      await page.locator('[data-impact-cn-guide-back]').click();assert.equal(await page.locator('#impact-cn-guide-pointer').count(),0);
      await page.waitForTimeout(1100);assert.equal(await page.locator('#impact-cn-guide-pointer').count(),0);
      await settings(false);await waitText(frame.locator('field-label-typography'),websiteHeading.source);
      assert(await frame.locator('body').evaluate(()=>window.__aliasHeading.firstChild===window.__aliasHeadingText&&document.querySelector('#alias-child-input').value==='https://synthetic.invalid/'&&document.querySelector('#alias-child-name').textContent==='Default landing page'));
    }
    for(const {pathname,options} of [
      {pathname:checklistAliasPath+'/extra'},{pathname:checklistAliasPath+'-other'},
      {pathname:checklistAliasPath,options:{base:'http://demo.impact.com'}},
      {pathname:checklistAliasPath,options:{base:'https://other.example'}},
      {pathname:checklistAliasPath,options:{shell:false}},
      {pathname:checklistAliasPath,options:{validSlot:false}}
    ]) {
      await aliasOpen(pathname,options);const frame=await aliasFrame(options);await page.waitForTimeout(1100);
      await waitText(frame.locator('field-label-typography'),websiteHeading.source);
      if(options?.validSlot!==false)await aliasText(false);
    }
  });
  await check('Four assets require independent worker sender/document/route authorization and declared entry alias without cross-origin top reads',async()=>{
    const worker=aliasWorkerVM(),scopes=aliasScopeVM();
    const configSandbox={};vm.createContext(configSandbox);vm.runInContext(readFileSync(path.join(extension,'site-config.js'),'utf8'),configSandbox);
    const assets=Array.from(configSandbox.IMPACT_CN_CONFIG.localization.checklist.assetPaths);
    let allowed=0,rejected=0;
    for(const pathname of assets) {
      const sender={id:'alias-fixture-runtime',frameId:1,documentId:'alias-document',url:'https://ui.assets.impact.com'+pathname+'?synthetic=1',tab:{id:1,url:'https://demo.impact.com'+checklistAliasPath+'?synthetic-program=1'}};
      for(const hostname of ['demo.impact.com','app.impact.com'])for(const route of [topPath+'synthetic-instance',checklistAliasPath]) {
        const result=worker.query({...sender,tab:{id:1,url:'https://'+hostname+route+'?synthetic=1'}});
        assert.equal(result.allowed,true);assert.equal(result.topPath,route===checklistAliasPath?checklistAliasPath:topPath);assert.deepEqual(Object.keys(result).sort(),['allowed','topPath']);allowed++;
      }
      for(const update of [
        {id:'other-runtime'},{frameId:0},{documentId:undefined},{documentId:''},{tab:{url:sender.tab.url}},
        {tab:{id:1,url:'https://demo.impact.com'+checklistAliasPath+'/extra'}},
        {tab:{id:1,url:'https://demo.impact.com'+checklistAliasPath+'-other'}},
        {tab:{id:1,url:'http://demo.impact.com'+checklistAliasPath}},
        {tab:{id:1,url:'https://other.example'+checklistAliasPath}},
        {url:'https://ui.assets.impact.com'+pathname+'/extra'},{url:'http://ui.assets.impact.com'+pathname}
      ]){assert.equal(worker.query({...sender,...update}).allowed,false);rejected++;}
      const item=dictionary.entries.find(item=>item.scope?.pathExact===pathname&&item.scope?.topPath===topPath&&item.match==='exact');assert(item,'Asset fixture entry missing: '+pathname);
      assert.equal(scopes.matches(item,topPath),true,'Old route entry declaration');
      assert.equal(scopes.matches(item,checklistAliasPath),true,'New route entry declaration');
      const missing=JSON.parse(JSON.stringify(item));delete missing.scope.topPathExactAlternative;
      assert.equal(scopes.matches(missing,checklistAliasPath),false,'Allowed worker must not bypass missing alias declaration');
      assert.equal(scopes.matches(missing,topPath),true,'Old route remains compatible');
      const wrong=JSON.parse(JSON.stringify(item));wrong.scope.topPathExactAlternative=checklistAliasPath+'/extra';
      assert.equal(scopes.matches(wrong,checklistAliasPath),false,'Wrong declared alternative must reject');
    }
    const invalidTopic=worker.query({id:'alias-fixture-runtime',frameId:1,documentId:'alias-document',url:'https://demo.impact.com/secure/advertiser/finance/synthetic.ihtml',tab:{id:1,url:'https://demo.impact.com'+checklistAliasPath}},{type:'impact-cn:frame-ask-topic',topicId:'unknown-synthetic-topic'});
    assert.equal(invalidTopic.ok,false);assert.equal(invalidTopic.reason,'topic-out-of-scope');
    await assertAliasContextProtocol();
    console.log('ALIAS CONTEXT CASES '+JSON.stringify({allowed,rejected,assetEntries:assets.length,declaredAliasMutationsRejected:8}));
  });
  }
  if(checklistAliasContextOnly)await check('Assets context protocol keeps legacy fallback rejects unknown/null identifiers clears denial and refreshes on allowed route changes',assertAliasContextProtocol);
}

try {
  context=await chromium.launchPersistentContext(path.join(workspace,'profile'),{executablePath:chromium.executablePath(),channel:'chromium',headless:true,args:[`--disable-extensions-except=${extension}`,`--load-extension=${extension}`]});
  // Unknown destinations are blocked; only the following local HTML route wins.
  await context.route('**/*', route => route.abort('blockedbyclient'));
  await context.route('https://demo.impact.com/**',route=>{
    const url=new URL(route.request().url());
    let body;
    if (url.searchParams.has('test-integration-fixture')) body = integrationDOM(url.searchParams.has('wrong-root'),url.searchParams.get('floating-shape') || 'verified');
    else if (url.pathname === membersPath) body = memberDOM;
    else if (url.pathname === gatewayPath) body = gatewayDOM(url.searchParams.get('gateway-shape') || 'verified');
    else if (url.pathname === adsPath) body = url.searchParams.has('synthetic-top-ads') ? adsTopDOM : adsDOM;
    else {
      body = topDOM(!url.searchParams.has('members-fixture') && !url.searchParams.has('native-fixture'));
      if (url.searchParams.has('wrong-shell')) body = body.replace('checklist-container iui-component','unrelated-container');
    }
    return route.fulfill({contentType:'text/html',body});
  });
  if(checklistAliasOnly)await context.route(/https?:\/\/(?:demo\.impact\.com|other\.example)\//u,route=>{
    const url=new URL(route.request().url());
    return route.fulfill({contentType:'text/html',body:url.pathname===websitePath?aliasWebsiteDOM:aliasDOM({delayed:url.searchParams.has('delayed'),shell:!url.searchParams.has('wrong-shell')})});
  });
  if(legacySetupOnly)await context.route(/https:\/\/(?:demo\.impact\.com|app\.impact\.com|other\.example)\//u,route=>{
    const url=new URL(route.request().url());
    return route.fulfill({contentType:'text/html',body:legacySetupDOM(url.searchParams.has('wrong-legacy-root'))});
  });
  page=context.pages()[0]||await context.newPage();page.setDefaultTimeout(7000);
  await page.goto(legacySetupOnly ? 'https://demo.impact.com'+legacySetupPath+'?t=u&legacy-setup-fixture=1' : checklistAliasOnly ? 'https://demo.impact.com'+checklistAliasPath+'?checklist-alias-fixture=1' : integrationOnly ? 'https://demo.impact.com'+integrationPaths[1]+'?test-integration-fixture=1' : 'https://demo.impact.com'+topPath+'synthetic-welcome-entries');
  await page.locator('#impact-cn-assistant').waitFor();
  worker=context.serviceWorkers().find(item=>item.url().startsWith('chrome-extension://'))||await context.waitForEvent('serviceworker',{timeout:7000});
  await settings(true);
  if (!integrationOnly && !checklistAliasOnly && !legacySetupOnly) {
  await check('Shipped welcome rules translate the observed description and sub-text Text nodes',async()=>{
    await waitText(page.locator('#video-component .description'),guide.target);
    await waitText(page.locator('#video-component .sub-text'),redirect.target);
    await assertIdentity(page);
    assert((await page.locator('.impact-cn-panel-version').textContent()).startsWith('v'+manifest.version+' ·'));
    assert.equal(await page.locator('#impact-cn-assistant').getAttribute('data-enabled'),'true');
  });
  await check('Turning translation off restores both original welcome sentences and turning it on matches again',async()=>{
    await settings(false);await waitText(page.locator('#video-component .description'),guide.source);await waitText(page.locator('#video-component .sub-text'),redirect.source);await assertIdentity(page);
    await settings(true);await waitText(page.locator('#video-component .description'),guide.target);await waitText(page.locator('#video-component .sub-text'),redirect.target);
  });
  await check('Shipped member title filters tabs and column labels match inside the original native Checklist frame',async()=>{
    await page.goto('https://demo.impact.com'+topPath+'synthetic-members-entries?members-fixture=1');
    await page.locator('#impact-cn-assistant').waitFor();
    await page.locator('#screen-outer-div').evaluate((slot,url)=>{const frame=document.createElement('iframe');frame.id='iframe';frame.className='checklist-iframe';frame.name='screenIframe';frame.src=url;slot.append(frame);},'https://demo.impact.com'+membersPath+'?fixture=members');
    const frame=page.locator('iframe#iframe').contentFrame();await frame.locator('.top-info h1').waitFor();
    for(const item of memberEntries){const suffix=item.id.replace('checklist-071-account-users-','');await waitText(frame.locator('#fixture-'+suffix),item.target);}
    await assertIdentity(frame);assert.equal(await frame.locator('#fixture-input').inputValue(),'Account Users');assert.equal(await frame.locator('#fixture-business-row').innerText(),'Name');
    assert.equal(await frame.locator('#impact-cn-assistant').count(),0);
    await settings(false);for(const item of memberEntries){const suffix=item.id.replace('checklist-071-account-users-','');await waitText(frame.locator('#fixture-'+suffix),item.source);}await assertIdentity(frame);
  });
  await check('Observed Gateway fixed Text translates in its verified open Shadow host within Checklist and restores native form state', async () => {
    const frame = await openNative(gatewayPath);
    assert(await frame.locator('#trkcfg-app').evaluate(element => {
      const root = element.getRootNode();
      return root instanceof ShadowRoot && root.mode === 'open' && root.host.tagName === 'DIV'
        && root.host.id === 'trkcfg-app-with-shadow-dom' && root.host.className === '' && element.parentElement.id === 'app';
    }), 'Gateway fixture must preserve the actually observed Shadow boundary');
    await waitEntries(frame,gatewayEntries,true); await assertNativeState(frame);
    assert.equal(await frame.locator('#fixture-outside-root').innerText(),'Gateway Tracking Settings');
    assert.equal(await frame.locator('#fixture-protected-name').innerText(),'Program Tracking Template');
    assert.equal(await frame.locator('#impact-cn-assistant,[data-impact-cn-help]').count(),0);
    await frame.locator('button.addButton').click();
    assert.equal(await frame.locator('body').evaluate(() => window.__nativeEntriesState.clicks),1);
    await settings(false); await waitEntries(frame,gatewayEntries,false); await assertNativeState(frame);
    await settings(true); await waitEntries(frame,gatewayEntries,true); await assertNativeState(frame);
  });
  await check('Observed Ads toolbar buttons translate in Checklist and preserve nodes values and original button handlers', async () => {
    const frame = await openNative(adsPath);
    await waitEntries(frame,adsEntries,true); await assertNativeState(frame);
    assert.equal(await frame.locator('#fixture-outside-control').innerText(),'Create Ad');
    assert.equal(await frame.locator('#fixture-protected-name').innerText(),'Create Ad');
    await frame.locator('[data-entry-id="checklist-ads-control-create-ad"]').click();
    assert.equal(await frame.locator('body').evaluate(() => window.__nativeEntriesState.clicks),1);
    await settings(false); await waitEntries(frame,adsEntries,false); await assertNativeState(frame);
    await settings(true); await waitEntries(frame,adsEntries,true); await assertNativeState(frame);
  });
  await check('Gateway and Ads Checklist entries reject wrong parent routes missing shells and unrelated iframe names', async () => {
    for (const [documentPath,entries] of [[gatewayPath,gatewayEntries],[adsPath,adsEntries]]) {
      for (const options of [{parentPath:'/secure/advertiser/engage/aview.ihtml'},{validShell:false},{validFrame:false}]) {
        const frame = await openNative(documentPath,options);
        await waitEntries(frame,entries,false); await assertNativeState(frame);
      }
    }
    await page.goto('https://demo.impact.com' + gatewayPath + '?synthetic-top-gateway=1');
    await page.waitForTimeout(1100);
    await waitEntries(page,gatewayEntries,false); await assertNativeState(page);
  });
  await check('Gateway entries reject an unrelated Shadow host and a missing Shadow layer despite valid Checklist parents', async () => {
    for (const gatewayShape of ['wrong','missing']) {
      const frame = await openNative(gatewayPath,{gatewayShape});
      await waitEntries(frame,gatewayEntries,false); await assertNativeState(frame);
    }
  });
  await check('Existing top-level Ads rules retain their original scope and translation after Checklist additions', async () => {
    await settings(true); await page.goto('https://demo.impact.com' + adsPath + '?synthetic-top-ads=1');
    for (const suffix of ['bulk-upload','create-ad']) {
      const original = entry('engage-ads-control-' + suffix);
      assert.equal(original.scope.topOnly,true);
      await waitText(page.locator(`[data-entry-id="checklist-ads-control-${suffix}"]`),original.target);
    }
    await waitText(page.locator('#fixture-outside-control'),entry('engage-ads-control-create-ad').target);
    await assertNativeState(page);
    await settings(false); await waitEntries(page,adsEntries,false); await assertNativeState(page);
  });
  }
  if(checklistAliasOnly)await runChecklistAliasChecks();
  if(legacySetupOnly)await runLegacySetupChecks();
  if (integrationOnly) {
    await check('Both exact integration entry routes translate the same fixed form instructions and observed sidebar scope',async()=>{
      for (const [index,documentPath] of integrationPaths.entries()) {
        await settings(true);
        await page.goto(`https://demo.impact.com${documentPath}?test-integration-fixture=1`);
        assert(await page.locator('#fixture-floating-validate').evaluate(node => node.getRootNode() instanceof ShadowRoot && node.getRootNode().host.matches('body.vnext-dark > impact-style-isolator') && node.matches('div.float-widget > div.sub-container > div.float-middle-texts > div.float-subtext')), 'Floating positive fixture must preserve the observed open Shadow and component boundary');
        await integrationFixedText(true);
        await integrationFloatingText(true);
        await waitText(page.locator('#fixture-checklists'),'配置清单');
        await assertIntegrationState();
        await page.locator('[data-entry-id="engage-complete-d0f9aaa79eec"]').click();
        assert.equal(await page.locator('body').evaluate(() => window.__integrationState.clicks),1);
        await settings(false); await integrationFixedText(false); await integrationFloatingText(false); await waitText(page.locator('#fixture-checklists'),'Checklists'); await assertIntegrationState();
        await settings(true); await integrationFixedText(true); await integrationFloatingText(true); await assertIntegrationState();
      }
      assert.equal(integrationFloatingEntries.length,2);
      assert.deepEqual(Array.from(integrationFloatingEntries,item=>item.scope.pathExact).sort(),[...integrationPaths].sort());
    });
    await check('Integration additions reject route suffixes unrelated pages wrong form roots and unrelated sidebar hosts',async()=>{
      await settings(true);
      for (const documentPath of [integrationPaths[0]+'/extra',integrationPaths[1]+'/extra','/secure/advertiser/engage/aview.ihtml']) {
        await page.goto(`https://demo.impact.com${documentPath}?test-integration-fixture=1`);
        await page.waitForTimeout(700); await integrationFixedText(false); await integrationFloatingText(false); await waitText(page.locator('#fixture-checklists'),'Checklists'); await assertIntegrationState();
      }
      await page.goto(`https://demo.impact.com${integrationPaths[1]}?test-integration-fixture=1&wrong-root=1`);
      await page.waitForTimeout(700);
      for (const item of integrationInstructions) await waitText(page.locator(`[data-entry-id="${item.id}"]`),item.source);
      await page.goto(`https://demo.impact.com${integrationPaths[1]}?test-integration-fixture=1`);
      await integrationFixedText(true);
      await page.locator('#adv-navigation > impact-style-isolator').evaluate(host => host.parentElement.id = 'unrelated-navigation');
      await waitText(page.locator('#fixture-checklists'),'Checklists'); await assertIntegrationState();
      for(const shape of ['wrong-root','wrong-host','wrong-parent','missing-shadow','wrong-theme']) {
        await page.goto(`https://demo.impact.com${integrationPaths[1]}?test-integration-fixture=1&floating-shape=${shape}`);
        await integrationFixedText(true);await page.waitForTimeout(700);await integrationFloatingText(false);await assertIntegrationState();
      }
    });
  }
  await check('The shipped source and temporary extension remain byte-for-byte unchanged',async()=>{
    for(const file of protectedFiles){assert.equal(sha(path.join(sourceDir,file)),originalHashes[file]);assert.equal(sha(path.join(extension,file)),originalHashes[file]);}
  });
} finally {
  await context?.close();
  const folder=reportArgument?path.resolve(root,reportArgument):path.join(root,'artifacts/checklist-tests');mkdirSync(folder,{recursive:true});
  const report={mode:legacySetupOnly?'SYNTHETIC_LEGACY_SETUP_ENTRIES_TARGETED':checklistAliasContextOnly?'SYNTHETIC_CHECKLIST_ALIAS_CONTEXT_PROTOCOL_ONLY':checklistAliasOnly?'SYNTHETIC_CHECKLIST_EXACT_ALIAS_TARGETED':integrationOnly?'SYNTHETIC_TEST_INTEGRATION_ENTRIES_TARGETED':'SYNTHETIC_SHIPPED_CHECKLIST_ENTRIES_TARGETED',version:manifest.version,sourceDirectory:checklistAliasOnly?path.relative(root,sourceDir):undefined,realSiteAcceptance:false,realNetworkQueries:false,shippedDictionary:true,shippedConfiguration:true,sourceSHA256:originalHashes,status:results.some(item=>item.status==='FAIL')?'FAIL':'PASS',results};
  const reportPath=path.join(folder,'entries-'+new Date().toISOString().replace(/[:.]/gu,'-')+'.json');writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');console.log('Checklist entry report: '+reportPath);
  rmSync(workspace,{recursive:true,force:true});
}
assert(results.length===(legacySetupOnly?4:checklistAliasContextOnly?2:checklistAliasOnly?4:integrationOnly?3:9)&&results.every(item=>item.status==='PASS'),'Targeted Checklist entry check failed');

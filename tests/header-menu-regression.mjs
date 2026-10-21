/** Captured Help/Finance DOM scope mechanism tests, never real-site acceptance. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const accountProgramOnly = process.argv.includes('--account-program-only');
const profileMenuOnly = process.argv.includes('--profile-menu-only');
const onlyFilter = process.argv.find(argument => argument.startsWith('--only='))?.slice('--only='.length);
const dictionaryArgument = process.argv.find(argument => argument.startsWith('--dictionary-path='))?.slice('--dictionary-path='.length);
const dictionaryPath = dictionaryArgument ? path.resolve(root, dictionaryArgument) : path.join(root, 'impact-cn-mod/dict.js');
const reportDirectory = process.argv.find(argument => argument.startsWith('--report-dir='))?.slice('--report-dir='.length);
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core'))); }
const capture = JSON.parse(readFileSync(path.join(root, 'docs/header-menus-dom-scan.json'), 'utf8'));
const sandbox = {}; vm.createContext(sandbox); vm.runInContext(readFileSync(dictionaryPath, 'utf8'), sandbox);
const dictionary = sandbox.IMPACT_CN_DICTIONARY;
const definitions = [...capture.help.entries, ...capture.finance.entries];
const entries = dictionary.entries.filter(entry => entry.observedSource === 'docs/header-menus-dom-scan.json');
const accountProgramEntries = dictionary.entries.filter(entry => entry.id.startsWith('header-account-program-'));
const profileMenuEntries = dictionary.entries.filter(entry => entry.id.startsWith('header-profile-menu-'));
const browser = await chromium.launch({ executablePath: chromium.executablePath(), channel: 'chromium', headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
page.setDefaultTimeout(8000);
const results = [];
async function check(name, operation) { if (onlyFilter && !new RegExp(onlyFilter, 'i').test(name)) return; try { const evidence = await operation(); results.push({ name, status: 'PASS', evidence }); console.log(`HEADER UNIT PASS ${name}`); } catch (error) { results.push({ name, status: 'FAIL', evidence: error.message }); console.log(`HEADER UNIT FAIL ${name}: ${error.message}`); } }

async function prepare() {
  await page.evaluate(({ capture, entries }) => {
    const host = document.querySelector('#adv-navigation impact-style-isolator');
    const shadow = host.attachShadow({ mode: 'open' });
    // The wrapper represents the inspected shared navigation Shadow DOM.
    const unit = window.__headerUnit = { records: [], negatives: [], clicks: 0, parentClicks: 0, numeric: [], sourceDefinitions: [...capture.help.entries, ...capture.finance.entries] };
    const entryFor = definition => entries.find(entry => entry.source === definition.source && entry.scope?.selector === definition.selector);
    const record = (element, definition, value = definition.source) => {
      const textNode = document.createTextNode(value); element.append(textNode);
      const entry = entryFor(definition);
      unit.records.push({ element, textNode, source: value, expected: entry ? entry.target + (definition.match === 'prefix' ? value.slice(definition.source.length) : '') : '[missing-dictionary-entry]', href: element.getAttribute('href'), sourceLabel: definition.source });
      if (element.tagName === 'A') element.addEventListener('click', event => { event.preventDefault(); unit.clicks++; });
      return element;
    };
    const numeric = value => { const element = document.createElement('span'); element.textContent = value; unit.numeric.push({ element, node: element.firstChild, value }); return element; };
    const helpOpener = document.createElement('button'); helpOpener.dataset.testid = 'nav-help-btn'; helpOpener.textContent = '?'; shadow.append(helpOpener);
    helpOpener.addEventListener('click', () => {
      const existing = shadow.querySelector('.unit-help-container'); if (existing) { existing.remove(); return; }
      const container = document.createElement('div'); container.className = 'unit-help-container';
      for (const definition of capture.help.entries) { const item = document.createElement('div'); item.className = 'help-menu-item'; item.id = definition.itemId; item.append(record(document.createElement('span'), definition)); container.append(item); }
      shadow.append(container);
    });
    const financeOpener = document.createElement('button'); financeOpener.id = 'adv-finance-btn'; financeOpener.textContent = '$'; shadow.append(financeOpener);
    financeOpener.addEventListener('click', () => {
      const existing = shadow.querySelector('.finance-bubble'); if (existing) { existing.remove(); return; }
      const bubble = document.createElement('div'); bubble.className = 'finance-bubble';
      const top = document.createElement('div'); top.className = 'top'; bubble.append(top);
      const title = document.createElement('div'); title.className = 'sub-header'; top.append(record(title, capture.finance.entries.find(e => e.source === 'Finance')));
      top.append(record(document.createElement('button'), capture.finance.entries.find(e => e.source === 'Make Deposit')));
      const funding = document.createElement('div'); funding.className = 'funding-header'; bubble.append(record(funding, capture.finance.entries.find(e => e.source === 'Required funding')));
      const bottom = document.createElement('div'); bottom.className = 'bottom'; bubble.append(bottom);
      for (const source of ['Past due', 'Pending deposits', 'Pending payments']) {
        const row = document.createElement('div'); row.className = 'row'; const label = record(document.createElement('div'), capture.finance.entries.find(e => e.source === source)); row.append(label);
        if (source !== 'Pending deposits') { const dateDef = capture.finance.entries.find(e => e.source === (source === 'Past due' ? '(Due since' : '(Due through')); const date = document.createElement('span'); date.className = 'due-date'; label.append(record(date, dateDef, dateDef.source + (source === 'Past due' ? ' 2026-10-10)' : ' 2026-10-31)'))); }
        row.append(numeric('$123,456.78')); bottom.append(row);
      }
      for (const definition of capture.finance.entries.filter(e => e.kind === 'parent')) {
        const element = document.createElement(definition.tag); element.className = 'fin-menu-item fin-menu-parent'; if (definition.href) element.setAttribute('href', definition.href); record(element, definition); bubble.append(element);
        if (definition.tag === 'BUTTON') element.addEventListener('click', () => {
          unit.parentClicks++; const old = bubble.querySelector(`[data-unit-group="${definition.source}"]`); if (old) { old.remove(); return; }
          const group = document.createElement('div'); group.dataset.unitGroup = definition.source;
          for (const child of capture.finance.entries.filter(e => e.kind === 'child' && e.group === definition.source)) { const link = document.createElement('a'); link.className = 'fin-menu-item fin-menu-child'; link.setAttribute('href', child.href); group.append(record(link, child)); }
          element.after(group);
        });
      }
      shadow.append(bubble);
    });
    // Matching labels in a page body, wrong Shadow host, and wrong menu must stay English.
    const outsideRoot = document.querySelector('#unit-other-host').attachShadow({ mode: 'open' });
    for (const definition of unit.sourceDefinitions) {
      for (const parent of [document.querySelector('#vueInstance'), outsideRoot, shadow]) {
        const container = document.createElement('div'); const element = document.createElement(definition.tag); element.textContent = definition.source;
        container.append(element); parent.append(container); unit.negatives.push({ element, node: element.firstChild, value: definition.source });
      }
    }
    const wrongHelp = document.createElement('div'); wrongHelp.className = 'help-menu-item'; wrongHelp.id = 'HELP_DOCS'; const wrongHelpLabel = document.createElement('span'); wrongHelpLabel.textContent = 'Help Docs'; wrongHelp.append(wrongHelpLabel); outsideRoot.append(wrongHelp); unit.negatives.push({ element: wrongHelpLabel, node: wrongHelpLabel.firstChild, value: 'Help Docs' });
    const wrongFinance = document.createElement('div'); wrongFinance.className = 'finance-bubble'; const wrongTitle = document.createElement('div'); wrongTitle.className = 'sub-header'; wrongTitle.textContent = 'Finance'; wrongFinance.append(wrongTitle); outsideRoot.append(wrongFinance); unit.negatives.push({ element: wrongTitle, node: wrongTitle.firstChild, value: 'Finance' });
  }, { capture, entries });
  for (const script of ['dict.js', 'site-config.js', 'settings-contract.js']) await page.addScriptTag({ path: script === 'dict.js' ? dictionaryPath : path.join(root, 'impact-cn-mod', script) });
  await page.addStyleTag({ content: readFileSync(path.join(root, 'impact-cn-mod/content.css'), 'utf8') });
  await page.addScriptTag({ path: path.join(root, 'impact-cn-mod/content.js') });
  await page.evaluate(async () => { await window.ImpactCN.ready; });
}
async function openAll() {
  await page.locator('#adv-navigation impact-style-isolator [data-testid="nav-help-btn"]').click();
  await page.locator('#adv-navigation impact-style-isolator #adv-finance-btn').click();
  for (const group of capture.finance.groups) {
    const target = entries.find(entry => entry.source === group.source)?.target;
    await page.locator('#adv-navigation impact-style-isolator .finance-bubble button.fin-menu-parent').filter({ hasText: new RegExp(`^(?:${group.source}|${target})$`) }).click();
  }
  await page.waitForFunction(() => window.__headerUnit.records.filter(r => r.element.isConnected).every(r => r.textNode.nodeValue === r.expected));
}

async function prepareAccountProgram({ pathname = '/secure/advertiser/checklist/checklist-instance.ihtml', hostname = 'demo.impact.com' } = {}) {
  await page.goto('https://' + hostname + pathname + '?synthetic-account-program=1');
  await page.evaluate(({ entries }) => {
    const host = document.querySelector('#adv-navigation impact-style-isolator');
    host.setAttribute('sheets', '#application-platform-navigation-style');
    const shadow = host.attachShadow({ mode: 'open' });
    const fixture = window.__accountProgramUnit = { records: [], negatives: [], retained: [], clicks: 0, mounts: 0 };
    const make = (tag, className, parent) => { const element = document.createElement(tag); element.className = className; parent?.append(element); return element; };
    const keep = element => {
      const record = { element, nodes: [...element.childNodes], attributes: [...element.attributes].map(attribute => [attribute.name, attribute.value]), value: 'value' in element ? element.value : undefined };
      fixture.retained.push(record); return element;
    };
    const negative = (element, value) => { element.append(document.createTextNode(value)); fixture.negatives.push({ element, node: element.firstChild, value }); return element; };
    const label = (element, source, positive) => {
      element.dataset.fixtureStable = 'unchanged';
      element.append(document.createTextNode(source));
      if (positive) fixture.records.push({ element, node: element.firstChild, source, target: entries.find(entry => entry.source === source)?.target });
      else fixture.negatives.push({ element, node: element.firstChild, value: source });
      keep(element); return element;
    };
    const mount = (parent = shadow, positive = true, options = {}) => {
      const wrapper = make('div', options.wrongWrapper ? 'nav-account-btn' : 'nav-account-btn nav-account-desktop-btn', parent);
      const button = make('button', 'account-btn adv-account-btn', wrapper);
      button.type = 'button'; button.dataset.fixtureBusinessId = 'synthetic-account-only';
      negative(button, 'Programs'); keep(button);
      const menu = make('div', 'desktop-menu-container', wrapper);
      const left = make('div', 'account-menu-left', menu), right = make('div', 'program-menu-right', menu);
      const headerClass = options.wrongListSide ? 'other-header' : 'menu-header';
      label(make('div', headerClass, left), 'Accounts', positive);
      label(make('div', headerClass, right), 'Programs', positive);
      const list = make('div', 'list-container programs-container', options.wrongListSide ? left : right);
      const ul = make('ul', 'iui-component iui-list', list);
      const li = make('li', '', ul);
      const link = make('a', 'iui-mobile-menu-link', li); link.href = '#synthetic-program'; link.setAttribute('data-fixture-business-id', 'synthetic-program-only');
      link.addEventListener('click', event => { event.preventDefault(); fixture.clicks++; });
      const holder = make('div', 'navItem-holder', link), item = make('div', 'navItem', holder);
      const campaign = make('div', 'campaignName', item); campaign.setAttribute('data-testid', 'synthetic-program-only');
      for (const name of ['Programs', 'Performance', 'In setup']) negative(make('span', 'campaign-name-text', campaign), name);
      const count = make('span', 'pcount', campaign);
      negative(make('span', 'campaign-name-divider', count), ' · ');
      label(make('span', 'productName', count), 'Performance', positive && !options.wrongListSide);
      label(make('div', options.wrongState ? 'campaignState LIVE' : 'campaignState SETUP', item), 'In setup', positive && !options.wrongListSide && !options.wrongState);
      const input = make('input', 'fixture-native-input', item); input.value = 'synthetic-native-value'; input.setAttribute('data-fixture-business-id', 'synthetic-input-only');
      keep(link); keep(campaign); keep(input);
      if (positive) fixture.current = wrapper;
      fixture.mounts++; return wrapper;
    };
    fixture.mount = mount;
    mount();
    // Same labels and business names in the wrong public component stay unchanged.
    mount(document.querySelector('#vueInstance'), false);
    const wrongHost = document.querySelector('#unit-other-host').attachShadow({ mode: 'open' }); mount(wrongHost, false);
    const wrongSheet = document.createElement('impact-style-isolator'); wrongSheet.setAttribute('sheets', '#different-style'); document.querySelector('#adv-navigation').append(wrongSheet); mount(wrongSheet.attachShadow({ mode: 'open' }), false);
    mount(shadow, false, { wrongWrapper: true });
    const wrongContext = mount(shadow, false, { wrongListSide: true, wrongState: true });
    const wrongState = make('div', 'campaignState LIVE', fixture.current.querySelector('.navItem')); negative(wrongState, 'In setup');
    negative(make('span', 'productName', wrongContext), 'Performance');
    negative(make('div', 'menu-header', shadow), 'Accounts');
  }, { entries: accountProgramEntries });
  for (const script of ['dict.js', 'site-config.js', 'settings-contract.js', 'content.js']) await page.addScriptTag({ path: script === 'dict.js' ? dictionaryPath : path.join(root, 'impact-cn-mod', script) });
  await page.evaluate(async () => { await window.ImpactCN?.ready; });
}

async function assertAccountProgramTranslated() {
  await page.waitForFunction(() => window.__accountProgramUnit.records.filter(record => record.element.isConnected).every(record => record.node.nodeValue === record.target));
}

async function assertAccountProgramIntegrity() {
  assert(await page.evaluate(() => {
    const fixture = window.__accountProgramUnit;
    return fixture.records.every(record => record.element.firstChild === record.node)
      && fixture.negatives.every(record => record.element.firstChild === record.node && record.node.nodeValue === record.value)
      && fixture.retained.every(record => record.nodes.length === record.element.childNodes.length && record.nodes.every((node, index) => record.element.childNodes[index] === node)
        && JSON.stringify([...record.element.attributes].map(attribute => [attribute.name, attribute.value])) === JSON.stringify(record.attributes)
        && (record.value === undefined || record.element.value === record.value));
  }));
}

// Independently fixed public labels and structure observed on the 0.8.10 page.
// All names, form values and events below are synthetic, never captured data.
const profileDefinitions = [
  ['edit-profile', 'Edit Profile', '编辑个人资料', '/secure/advertiser/user-settings-flow.ihtml'],
  ['theme', 'Theme', '主题', '#'],
  ['sign-out', 'Sign Out', '退出登录', '/logOut.user'],
  ['light', 'Light', '浅色', '#'], ['dark', 'Dark', '深色', '#'], ['auto', 'Auto', '自动', '#'],
  ['terms', 'Terms of Use', '使用条款', '#', 'footer-terms'],
  ['policy', 'Privacy Policy', '隐私政策', '#', 'footer-policy'],
  ['terms-use', 'Messaging Terms of Use', '消息功能使用条款', 'https://impact.com/terms-of-use-messaging/', 'footer-terms-use'],
  ['status', 'System Status', '系统状态', 'https://status.impact.com/', 'footer-status'],
  ['campaign-agreement', 'Master Program Agreement', '项目主协议', 'https://impact.com/legal/impact.com_Master_Program_Agreement.pdf', 'footer-campaign-agreement']
];
function mountProfileFixture(definitions) {
  const fixture = window.__profileMenuUnit = { records: [], negatives: [], retained: [], clicks: 0 };
  const make = (tag, parent, attributes = {}) => { const element = document.createElement(tag); for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value); parent?.append(element); return element; };
  const keep = element => { fixture.retained.push({ element, children: [...element.childNodes], attributes: JSON.stringify([...element.attributes].map(a => [a.name, a.value])), value: 'value' in element ? element.value : undefined }); return element; };
  const label = (element, definition, positive) => {
    const source = definition[1] + (definition[0] === 'theme' ? ' ' : '');
    const node = document.createTextNode(source); element.append(node);
    (positive ? fixture.records : fixture.negatives).push({ element, node, source, target: definition[2] + (definition[0] === 'theme' ? ' ' : '') });
    element.addEventListener('click', event => { event.preventDefault(); fixture.clicks++; });
    return element;
  };
  fixture.mount = (root, positive = true, options = {}) => {
    const nav = make('div', root, { id: 'adv-nav' });
    const wrapper = make('div', nav, { class: options.wrongComponent ? 'other-profile-container' : 'profile-btn-container' });
    const dropdown = make('div', wrapper, { id: 'profile-dropdown' });
    const popover = make('div', dropdown, { class: 'nav-popover' });
    const list = make('ul', popover, { class: 'iui-component iui-list', role: 'listbox', 'data-testid': 'uicl-list' });
    const option = parent => make('li', parent, { role: 'option' });
    for (const id of ['edit-profile', 'theme', 'sign-out']) {
      const definition = definitions.find(item => item[0] === id), li = option(list);
      const parent = id === 'theme' ? make('div', li, { class: 'theme-switcher-item' }) : li;
      const anchor = label(make('a', parent, { href: definition[3] }), definition, positive && !options.wrongComponent);
      if (id === 'theme') {
        make('svg', anchor); keep(anchor);
        const hidden = make('div', parent, { style: 'display: none;' });
        const themePopover = make('div', hidden, { class: 'nav-popover' });
        const themes = make('ul', themePopover, { class: 'iui-component iui-list', role: 'listbox', 'data-testid': 'uicl-list' });
        for (const theme of definitions.filter(item => ['light', 'dark', 'auto'].includes(item[0]))) {
          const link = label(make('a', option(themes), { class: theme[0], href: theme[3] }), theme, positive && !options.wrongComponent);
          link.append(document.createComment('native theme marker')); keep(link);
        }
      } else keep(anchor);
    }
    const footerHost = make('impact-style-isolator', popover, { class: options.wrongFooter ? 'other-footer' : 'profile-btn-footer', sheets: '#application-platform-navigation-style' });
    const footerRoot = footerHost.attachShadow({ mode: 'open' });
    const footer = make('div', footerRoot, { class: 'termsFooter' });
    for (const definition of definitions.filter(item => item[4])) {
      const link = label(make('a', footer, { class: 'footerLink' + (definition[0] === 'campaign-agreement' ? ' mca-link' : ''), 'data-test-id': definition[4], href: definition[3] }), definition, positive && !options.wrongComponent && !options.wrongFooter);
      keep(link);
    }
    const names = make('div', nav, { class: 'campaignName' });
    for (const definition of definitions) label(make('span', names, { class: 'campaign-name-text' }), definition, false);
    const input = make('input', nav, { value: 'Theme' }); input.value = 'Theme'; keep(input);
    const aiHost = make('div', nav, { id: 'ask-impact-shadow-host' });
    const aiRoot = aiHost.attachShadow({ mode: 'open' });
    for (const definition of definitions) label(make('p', aiRoot), definition, false);
    const protectedName = make('div', popover, { class: 'partner-name' });
    for (const definition of definitions) label(make('span', protectedName), definition, false);
    return { nav, wrapper, dropdown, popover, footerHost, root };
  };
  const host = document.querySelector('#adv-navigation > impact-style-isolator');
  host.setAttribute('sheets', '#application-platform-navigation-style');
  fixture.current = fixture.mount(host.attachShadow({ mode: 'open' }));
  fixture.mount(document.querySelector('#unit-other-host'), false);
  const wrongHost = make('div', document.body); fixture.mount(wrongHost.attachShadow({ mode: 'open' }), false);
  const wrongSheet = make('impact-style-isolator', document.querySelector('#adv-navigation'), { sheets: '#different-style' }); fixture.mount(wrongSheet.attachShadow({ mode: 'open' }), false);
  fixture.mount(fixture.current.root, true, { wrongComponent: true });
  // Wrong footer hosts and links live inside the verified outer profile tree.
  for (const attributes of [{ class: 'other-footer', sheets: '#application-platform-navigation-style' }, { class: 'profile-btn-footer', sheets: '#different-style' }]) {
    const footer = make('div', make('impact-style-isolator', fixture.current.popover, attributes).attachShadow({ mode: 'open' }), { class: 'termsFooter' });
    for (const definition of definitions.filter(item => item[4])) keep(label(make('a', footer, { class: 'footerLink' + (definition[0] === 'campaign-agreement' ? ' mca-link' : ''), 'data-test-id': definition[4], href: definition[3] }), definition, false));
  }
  const nativeFooter = fixture.current.footerHost.shadowRoot.querySelector('.termsFooter');
  keep(label(make('a', nativeFooter, { class: 'footerLink', 'data-test-id': 'not-a-fixed-footer-link', href: '#' }), definitions[6], false));
  keep(label(make('a', nativeFooter, { class: 'footerLink', 'data-test-id': 'footer-status', href: 'https://example.invalid/' }), definitions[9], false));
}
async function loadProfileScripts(surface = page) {
  for (const script of ['dict.js', 'site-config.js', 'settings-contract.js', 'content.js']) await surface.addScriptTag({ path: script === 'dict.js' ? dictionaryPath : path.join(root, 'impact-cn-mod', script) });
  await surface.evaluate(async () => { await window.ImpactCN?.ready; });
}
async function prepareProfile({ hostname = 'demo.impact.com', pathname = '/secure/advertiser/engage/aview.ihtml' } = {}) {
  await page.goto('https://' + hostname + pathname + '?synthetic-profile-menu=1');
  await page.evaluate(mountProfileFixture, profileDefinitions);
  await loadProfileScripts();
}
async function assertProfileTranslated(surface = page) {
  await surface.waitForFunction(() => window.__profileMenuUnit.records.filter(item => item.node.isConnected).every(item => item.node.nodeValue === item.target));
}
async function assertProfileIntegrity(surface = page) {
  assert(await surface.evaluate(() => {
    const fixture = window.__profileMenuUnit;
    return fixture.records.every(item => item.element.firstChild === item.node)
      && fixture.negatives.every(item => item.element.firstChild === item.node && item.node.nodeValue === item.source)
      && fixture.retained.every(item => item.children.length === item.element.childNodes.length && item.children.every((node, index) => node === item.element.childNodes[index])
        && item.attributes === JSON.stringify([...item.element.attributes].map(a => [a.name, a.value])) && (item.value === undefined || item.value === item.element.value));
  }));
}
try {
  if (!accountProgramOnly && !profileMenuOnly) {
  await check('All 32 header entries match the captured source selector and advertiser scope', async () => {
    assert.equal(definitions.length, 32); assert.equal(entries.length, 32);
    for (const definition of definitions) {
      const matches = entries.filter(entry => entry.source === definition.source && entry.scope?.selector === definition.selector);
      assert.equal(matches.length, 1, definition.source); const entry = matches[0];
      assert.equal(entry.scope.shadowHost, capture.shadowHost); assert.equal(entry.scope.path, capture.path); assert.deepEqual([...entry.scope.hosts].sort(), [...capture.hosts].sort());
      assert.equal(entry.match, definition.match); assert.equal(entry.verification, 'observed-dom'); assert(entry.target && entry.reason); assert(!entry.helpTopicId, 'Menu pilot must not add finance concept questions yet');
    }
    return '6 Help + 26 Finance fixed labels; two date-prefix entries; no finance-body widening';
  });
  await page.route('https://demo.impact.com/**', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><body><div id="adv-navigation"><impact-style-isolator></impact-style-isolator></div><main id="vueInstance"></main><div id="unit-other-host"></div></body>' }));
  await page.goto('https://demo.impact.com/secure/advertiser/engage/discover/radius/fr/partner_ui.ihtml?synthetic-header-unit=1');
  await prepare();
  await check('Dynamic Help and three Finance submenus translate all captured labels in open Shadow DOM', async () => { await openAll(); assert.equal(await page.evaluate(() => window.__headerUnit.records.filter(r => r.element.isConnected).length), 32); return 'Native-style opener/expander events dynamically mount 32 labels; no static demo acceptance'; });
  await check('Translation preserves original Text nodes, link destinations, native events, amounts and date suffixes', async () => {
    assert(await page.evaluate(() => window.__headerUnit.records.every(r => r.element.firstChild === r.textNode && r.element.getAttribute('href') === r.href) && window.__headerUnit.numeric.every(r => r.element.firstChild === r.node && r.node.nodeValue === r.value)));
    const dates = await page.evaluate(() => window.__headerUnit.records.filter(r => r.sourceLabel.startsWith('(Due ')).map(r => ({ source: r.source, translated: r.textNode.nodeValue })));
    assert.equal(dates.length, 2); assert(dates[0].translated.endsWith(' 2026-10-10)')); assert(dates[1].translated.endsWith(' 2026-10-31)'));
    await page.locator('#adv-navigation impact-style-isolator .finance-bubble a.fin-menu-child').first().click(); assert.equal(await page.evaluate(() => window.__headerUnit.clicks), 1); assert.equal(await page.evaluate(() => window.__headerUnit.parentClicks), 3);
    return '32 original Text identities and attributes; native parent/link events; 3 untouched amounts and 2 date suffixes';
  });
  await check('Same labels in body, wrong menu and wrong Shadow host remain English', async () => { assert(await page.evaluate(() => window.__headerUnit.negatives.every(r => r.element.firstChild === r.node && r.node.nodeValue === r.value))); return '98 negative nodes retain source text and identity'; });
  await check('Translation off restores source labels and on reuses the same Text nodes', async () => {
    await page.evaluate(() => window.ImpactCN.setEnabled(false)); assert(await page.evaluate(() => window.__headerUnit.records.every(r => r.textNode.nodeValue === r.source && r.element.firstChild === r.textNode)));
    await page.evaluate(() => window.ImpactCN.setEnabled(true)); assert(await page.evaluate(() => window.__headerUnit.records.every(r => r.textNode.nodeValue === r.expected && r.element.firstChild === r.textNode)));
    return '32 labels restore and translate without node replacement, date/amount mutation or AI sends';
  });
  await check('Recreated native dropdowns and page reload are discovered and localized again', async () => {
    await page.locator('#adv-navigation impact-style-isolator [data-testid="nav-help-btn"]').click(); await page.locator('#adv-navigation impact-style-isolator #adv-finance-btn').click(); await openAll();
    assert.equal(await page.evaluate(() => window.__headerUnit.records.filter(r => r.element.isConnected).length), 32);
    await page.reload(); await prepare(); await openAll(); assert(await page.evaluate(() => window.__headerUnit.records.every(r => r.textNode.nodeValue === r.expected && r.element.firstChild === r.textNode)));
    return 'Second fresh dropdown mount and independent document reload both translate the captured menu structure';
  });
  }
  await page.route('https://**/*', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><body><div id="adv-navigation"><impact-style-isolator></impact-style-isolator></div><main id="vueInstance"></main><div id="unit-other-host"></div></body>' }));
  if (!profileMenuOnly) {
  await check('Account and Program labels require four exact top navigation contexts', async () => {
    assert.equal(accountProgramEntries.length, 4);
    for (const [source, target] of [['Accounts', '账户'], ['Programs', '项目'], ['Performance', '效果营销'], ['In setup', '配置中']]) {
      const matches = accountProgramEntries.filter(entry => entry.source === source); assert.equal(matches.length, 1);
      const entry = matches[0]; assert.equal(entry.target, target); assert.equal(entry.match, 'exact');
      assert.equal(entry.scope.path, '/secure/advertiser/'); assert.equal(entry.scope.topOnly, true);
      assert.deepEqual([...entry.scope.hosts].sort(), ['app.impact.com', 'demo.impact.com']);
      assert.equal(entry.scope.shadowHost, '#adv-navigation impact-style-isolator[sheets="#application-platform-navigation-style"]');
      assert(entry.scope.selector.startsWith('.nav-account-btn.nav-account-desktop-btn > .desktop-menu-container > '));
      assert(!entry.helpTopicId && !entry.aliases && !entry.scope.contextText);
    }
    return 'Four fixed exact Text entries; no name, ID, dynamic slot, AI topic or runtime authorization changes';
  });
  await check('Account and Program translation restores original Text and preserves business names values attributes and events', async () => {
    await prepareAccountProgram(); await assertAccountProgramTranslated(); await assertAccountProgramIntegrity();
    await page.evaluate(() => window.__accountProgramUnit.current.querySelector('.iui-mobile-menu-link').click());
    assert.equal(await page.evaluate(() => window.__accountProgramUnit.clicks), 1);
    await page.evaluate(() => window.ImpactCN.setEnabled(false));
    assert(await page.evaluate(() => window.__accountProgramUnit.records.every(record => record.node.nodeValue === record.source)));
    await assertAccountProgramIntegrity();
    await page.evaluate(() => window.ImpactCN.setEnabled(true)); await assertAccountProgramTranslated(); await assertAccountProgramIntegrity();
    return 'Four existing Text identities restore; native input values, attributes, Program names equal to Programs/Performance/In setup and one native selection event remain intact';
  });
  await check('Account and Program menu remounts and rewritten Text translate on Checklist and Dashboard', async () => {
    for (const pathname of ['/secure/advertiser/checklist/checklist-instance.ihtml', '/secure/advertiser/engage/checklist/instance/synthetic', '/secure/advertiser/engage/aview.ihtml']) {
      await prepareAccountProgram({ pathname }); await assertAccountProgramTranslated();
      await page.evaluate(() => { for (const record of window.__accountProgramUnit.records) record.node.nodeValue = record.source; });
      await assertAccountProgramTranslated(); await assertAccountProgramIntegrity();
      await page.evaluate(() => { const fixture = window.__accountProgramUnit; fixture.current.remove(); fixture.mount(); });
      await assertAccountProgramTranslated(); await assertAccountProgramIntegrity();
      assert.equal(await page.evaluate(() => window.__accountProgramUnit.records.filter(record => record.element.isConnected).length), 4);
    }
    await prepareAccountProgram({ hostname: 'app.impact.com', pathname: '/secure/advertiser/engage/aview.ihtml' });
    await assertAccountProgramTranslated(); await assertAccountProgramIntegrity();
    return 'Both Checklist entry routes and Dashboard support same-node source rewrites and rebuilt menu trees; app host uses the same exact contract';
  });
  await check('Account and Program labels reject wrong host path Shadow root and component context', async () => {
    await assertAccountProgramIntegrity();
    for (const options of [{ hostname: 'unrelated.invalid' }, { pathname: '/secure/member/aview.ihtml' }]) {
      await prepareAccountProgram(options);
      await page.waitForTimeout(100);
      assert(await page.evaluate(() => window.__accountProgramUnit.records.every(record => record.node.nodeValue === record.source)));
      await assertAccountProgramIntegrity();
    }
    return 'Wrong origin and non-advertiser path reject; light DOM, other Shadow host, incorrect sheets, wrong wrapper/list side/state and business-name leaves remain English';
  });
  }
  if (!accountProgramOnly) {
  await check('Profile menu premounted hidden theme and nested footer translate eleven original Text nodes', async () => {
    await prepareProfile();
    try { await assertProfileTranslated(); }
    catch (error) {
      const fixedFixtureText = await page.evaluate(() => window.__profileMenuUnit.records.map(item => ({ source: item.source, observed: item.node.nodeValue, expected: item.target })));
      throw new Error(error.message + '; public synthetic fixture Text: ' + JSON.stringify(fixedFixtureText));
    }
    await assertProfileIntegrity();
    assert.equal(await page.evaluate(() => window.__profileMenuUnit.records.filter(item => item.node.isConnected).length), 11);
    assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('#adv-navigation > impact-style-isolator').shadowRoot.querySelector('.theme-switcher-item > div')).display), 'none');
    return 'Eleven public fixed Text nodes translate immediately, including three already mounted hidden theme choices and five links in the second open ShadowRoot; no translation-toggle retry';
  });
  await check('Profile menu exact scopes require native top outer Shadow component and footer structure', async () => {
    assert.equal(profileMenuEntries.length, 11);
    for (const definition of profileDefinitions) {
      const matches = profileMenuEntries.filter(item => item.source === definition[1]); assert.equal(matches.length, 1);
      const entry = matches[0]; assert.equal(entry.target, definition[2]); assert.equal(entry.match, 'exact'); assert.equal(entry.scope.topOnly, true);
      assert.deepEqual([...entry.scope.hosts].sort(), ['app.impact.com', 'demo.impact.com']); assert.equal(entry.scope.path, '/secure/advertiser/');
      assert.equal(entry.scope.shadowHost, '#adv-navigation > impact-style-isolator[sheets="#application-platform-navigation-style"]');
      assert(entry.scope.selector.startsWith('#adv-nav .profile-btn-container > #profile-dropdown > div.nav-popover > '));
      if (definition[4]) { assert(entry.scope.selector.endsWith('impact-style-isolator.profile-btn-footer[sheets="#application-platform-navigation-style"]')); assert(entry.scope.textParentSelector.includes(definition[4])); }
      assert(!entry.helpTopicId && !entry.aliases);
    }
    return 'Eleven exact fixed labels require advertiser domain/path, top document, observed outer Shadow host and native menu structure; footer host and immediate link context are both checked';
  });
  await check('Profile menu source restoration keeps native nodes links values events and independent switches', async () => {
    await prepareProfile(); await assertProfileTranslated(); await assertProfileIntegrity();
    await page.evaluate(() => window.__profileMenuUnit.records[0].element.click());
    assert.equal(await page.evaluate(() => window.__profileMenuUnit.clicks), 1);
    for (const enabled of [false, true]) for (const aiEnabled of [false, true]) {
      await page.evaluate(async ({ enabled, aiEnabled }) => { await window.ImpactCN.setEnabled(enabled); await window.ImpactCN.setAIEnabled(aiEnabled); }, { enabled, aiEnabled });
      assert.deepEqual(await page.evaluate(() => { const { enabled, aiEnabled } = window.ImpactCN.getState(); return { enabled, aiEnabled }; }), { enabled, aiEnabled });
      assert(await page.evaluate(enabled => window.__profileMenuUnit.records.every(item => item.node.nodeValue === (enabled ? item.target : item.source)), enabled));
      await assertProfileIntegrity();
    }
    return 'All four translation/AI combinations keep eleven Text identities, hrefs, SVG/comment siblings, attributes and input values; synthetic original anchor handler fires once without navigation';
  });
  await check('Profile menu automatic rewrites remounted Shadow roots same nodes route changes and reload', async () => {
    await prepareProfile(); await assertProfileTranslated();
    await page.evaluate(() => { history.pushState({}, '', '/secure/advertiser/checklist/checklist-instance.ihtml?synthetic-profile-menu=2'); for (const item of window.__profileMenuUnit.records) item.node.nodeValue = item.source; });
    await assertProfileTranslated(); await assertProfileIntegrity();
    await page.evaluate(() => { const fixture = window.__profileMenuUnit; fixture.detached = fixture.current.nav; fixture.current.nav.remove(); });
    await page.waitForTimeout(1150);
    assert(await page.evaluate(() => window.__profileMenuUnit.records.every(item => item.node.nodeValue === item.source)));
    await page.evaluate(() => { const fixture = window.__profileMenuUnit; fixture.current.root.append(fixture.detached); });
    await assertProfileTranslated(); await assertProfileIntegrity();
    await page.evaluate(() => { const fixture = window.__profileMenuUnit; fixture.current.nav.remove(); fixture.current = fixture.mount(fixture.current.root); });
    await assertProfileTranslated(); await assertProfileIntegrity();
    await page.evaluate(() => { const fixture = window.__profileMenuUnit; const old = document.querySelector('#adv-navigation > impact-style-isolator'); const host = document.createElement('impact-style-isolator'); host.setAttribute('sheets', '#application-platform-navigation-style'); old.replaceWith(host); fixture.current = fixture.mount(host.attachShadow({ mode: 'open' })); });
    await assertProfileTranslated(); await assertProfileIntegrity();
    await page.reload(); await page.evaluate(mountProfileFixture, profileDefinitions); await loadProfileScripts(); await assertProfileTranslated(); await assertProfileIntegrity();
    return 'Same Text rewrites across legacy setup to Checklist, detached/reused nodes, newly mounted menus, replaced outer and nested open ShadowRoots and independent document reload all localize automatically';
  });
  await check('Profile menu wrong hosts components paths child frames names inputs and AI remain unchanged', async () => {
    await prepareProfile(); await assertProfileTranslated(); await assertProfileIntegrity();
    for (const options of [{ hostname: 'unrelated.invalid' }, { pathname: '/secure/member/aview.ihtml' }]) {
      await prepareProfile(options); await page.waitForTimeout(1100);
      assert(await page.evaluate(() => window.__profileMenuUnit.records.every(item => item.node.nodeValue === item.source)));
      await assertProfileIntegrity();
    }
    await prepareProfile({ hostname: 'app.impact.com' }); await assertProfileTranslated(); await assertProfileIntegrity();
    const frameURL = 'https://app.impact.com/secure/advertiser/engage/aview.ihtml?synthetic-profile-child=1';
    const frameReady = page.waitForEvent('framenavigated', { predicate: frame => frame.url() === frameURL });
    await page.evaluate(url => { const frame = document.createElement('iframe'); frame.src = url; document.body.append(frame); }, frameURL);
    const frame = await frameReady;
    await frame.evaluate(mountProfileFixture, profileDefinitions); await loadProfileScripts(frame); await page.waitForTimeout(1100);
    assert(await frame.evaluate(() => window.__profileMenuUnit.records.every(item => item.node.nodeValue === item.source))); await assertProfileIntegrity(frame);
    return 'Demo and app top contexts pass; wrong origin/path, child document, wrong outer host/sheets, wrong component, business-name leaves, inputs and native AI text retain original values';
  });
  }
} finally { await browser.close(); }
const status = results.every(result => result.status === 'PASS') ? 'PASS' : 'FAIL';
const reportFolder = reportDirectory ? path.resolve(root, reportDirectory) : path.join(root, 'artifacts');
mkdirSync(reportFolder, { recursive: true });
writeFileSync(path.join(reportFolder, 'header-menu-unit-report.json'), JSON.stringify({ status, mode: profileMenuOnly ? 'SYNTHETIC_PROFILE_MENU_ONLY' : accountProgramOnly ? 'SYNTHETIC_ACCOUNT_PROGRAM_MENU_ONLY' : 'SYNTHETIC_HEADER_MECHANISM_ONLY', version: dictionary.version, capturedDefinitions: definitions.length, dictionaryEntries: entries.length, accountProgramEntries: accountProgramEntries.length, profileMenuEntries: profileMenuEntries.length, results, credentialsSaved: false, realSiteAcceptance: false }, null, 2));
writeFileSync(reportDirectory ? path.join(reportFolder, 'header-menu-test-report.md') : path.join(root, 'header-menu-test-report.md'), `# 右上菜单机制回归\n\n版本：${dictionary.version}。结果：**${status} ${results.filter(r => r.status === 'PASS').length}/${results.length}**。\n\n使用真实采集结构构造的隔离 DOM，只验证机制与词典范围；没有真实网络验收、财务正文点击或模拟 AI 答复。实网结果独立记录于 header-live-test-report.md。\n\n${results.map(r => `- **${r.status}** ${r.name}${r.evidence ? `：${r.evidence}` : ''}`).join('\n')}\n`);
process.exitCode = status === 'PASS' ? 0 : 1;

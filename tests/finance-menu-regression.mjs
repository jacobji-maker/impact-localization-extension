/** Synthetic entity-menu contracts. No real site, shared capture, or fixed live report is used. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inspectEntityMenuPointer, inspectEntityActionsPopup, completedEntityActionsPopup } from '../scripts/finance-menu-checks.mjs';
import { finalizeFinanceCoverage, unverifiedFinanceDeepStates } from '../scripts/finance-live-checks.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const require = createRequire(import.meta.url);
const dictionaryBytes = readFileSync(path.join(root, 'impact-cn-mod/dict.js'));
const sandbox = {}; vm.createContext(sandbox); vm.runInContext(dictionaryBytes.toString('utf8'), sandbox);
const shipped = sandbox.IMPACT_CN_DICTIONARY;
const menuEntries = shipped.entries.filter(entry => /^finance-(?:billing-groups|funding-accounts)-actions-.*-observed$/u.test(entry.id));
const sourceFingerprints = Object.fromEntries(['dict.js', 'site-config.js', 'content.js'].map(name => [name, createHash('sha256').update(readFileSync(path.join(root, 'impact-cn-mod', name))).digest('hex')]));
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core'))); }
const argIndex = process.argv.findIndex(value => value === '--report-dir' || value.startsWith('--report-dir='));
const suppliedDirectory = argIndex < 0 ? null : process.argv[argIndex].startsWith('--report-dir=') ? process.argv[argIndex].slice(13) : process.argv[argIndex + 1];
assert(argIndex < 0 || suppliedDirectory, 'The report directory argument needs a value');
const directory = suppliedDirectory ? path.resolve(root, suppliedDirectory) : mkdtempSync(path.join(os.tmpdir(), 'impact-finance-menu-tests-'));
if (suppliedDirectory) {
  const protectedFolders = ['impact-cn-mod', 'dist', 'docs', 'artifacts/finance-tests', 'artifacts/finance-capture-tests', 'artifacts/finance-acceptance-20261010'].map(value => path.join(root, value));
  assert(directory !== root && !protectedFolders.some(value => directory === value || directory.startsWith(value + path.sep)), 'Menu tests require an independent report directory');
}
const definitions = [
  { id: 'billing-groups', bodyPath: '/secure/finance/app/billing-groups-view.ihtml', topPath: '/secure/advertiser/finance/fr/billing-groups.ihtml', labels: ['Edit', 'Partner Fees Document Settings', 'impact.com Fees Document Settings'] },
  { id: 'funding-accounts', bodyPath: '/secure/finance/app/list-digital-wallets-flow.ihtml', topPath: '/secure/advertiser/finance/fr/funding-accounts.ihtml', labels: ['Edit', 'Funding Account Document Settings'] }
];
const selector = '#menu';
const popupSelector = 'body > div.iui-dropdown.in-btn-menu.row-action-dropdown';
const privateSentinels = ['PRIVATE_ENTITY_SENTINEL', 'PRIVATE_ID_SENTINEL', 'PRIVATE_INPUT_SENTINEL', 'PRIVATE_POPUP_SENTINEL', 'PRIVATE_CSS_SENTINEL'];
const results = [];
async function check(name, run) {
  try { await run(); results.push({ name, status: 'PASS' }); console.log(`FINANCE MENU PASS ${name}`); }
  catch (error) { results.push({ name, status: 'FAIL', evidence: String(error.message).slice(0, 600) }); console.log(`FINANCE MENU FAIL ${name}: ${String(error.message).slice(0, 600)}`); }
}
const assertPrivateOmitted = evidence => {
  const serialized = JSON.stringify(evidence);
  for (const value of privateSentinels) assert(!serialized.includes(value), 'An inspector returned a synthetic private value');
  for (const value of ['password', 'cookie', 'authorization']) assert(!serialized.includes('PRIVATE_' + value.toUpperCase()), 'An inspector returned a synthetic credential sentinel');
};
function fixtureHTML(definition) {
  return `<!doctype html><style>
    body{margin:24px;font:16px sans-serif}.iui-dynamic-table{padding:12px;width:680px}.row-overlay{margin-top:12px}button{padding:12px}.row-action-dropdown{width:360px;background:white}li{padding:8px}
  </style><div class="iui-dynamic-table"><div class="iui-data-table"><div class="table-header"><span data-testid="uicl-data-table-column-label-name">Name</span></div><div class="table-body"><div class="table-row"><div class="table-cell"><div id="name" style="cursor:pointer">PRIVATE_ENTITY_SENTINEL</div></div><div class="table-cell">PRIVATE_ID_SENTINEL</div></div></div></div><div class="row-overlay" hidden><div class="iui-btn-menu"><div><button id="menu" type="button" data-private="PRIVATE_ID_SENTINEL"><svg width="16" height="16"></svg></button></div></div></div></div><form id="private-form"><input value="PRIVATE_INPUT_SENTINEL"><button type="submit">Save</button></form><a id="private-link" href="/private/PRIVATE_ID_SENTINEL">PRIVATE_ENTITY_SENTINEL</a><script>
    window.counts={names:0,menus:0,optionClicks:0,writes:0,trustedMenuClicks:0,untrustedMenuClicks:0};
    document.querySelector('#name').onclick=()=>{counts.names++;document.querySelector('.row-overlay').hidden=false;};
    document.querySelector('#menu').onclick=event=>{counts.menus++;counts[event.isTrusted?'trustedMenuClicks':'untrustedMenuClicks']++;document.querySelector('#menu').classList.add('menu-open');document.querySelector('.iui-dynamic-table').classList.add('row-menu-open');const popup=document.createElement('div');popup.className='iui-dropdown in-btn-menu row-action-dropdown';const list=document.createElement('ul');list.className='iui-list';list.setAttribute('role','listbox');for(const label of ${JSON.stringify(definition.labels)}){const item=document.createElement('li');item.setAttribute('role','option');const wrapper=document.createElement('div'),span=document.createElement('span'),outerSpan=document.createElement('span');span.textContent=label;if(${JSON.stringify(definition.id)}==='billing-groups'){const regularText=document.createElement('regular-text');regularText.append(span);outerSpan.append(regularText);}else{span.className='text-ellipsis';outerSpan.append(span);}wrapper.append(outerSpan);item.append(wrapper);item.onclick=()=>counts.optionClicks++;list.append(item);}const outer=document.createElement('div'),inner=document.createElement('div');inner.append(list);outer.append(inner);popup.append(outer);document.body.append(popup);};
    document.querySelector('form').onsubmit=event=>{event.preventDefault();counts.writes++;};
  </script>`;
}
let browser;
try {
  browser = await chromium.launch({ headless: true, executablePath: chromium.executablePath() });
  const context = await browser.newContext();
  const fixtureDocuments = new Map();
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    const definition = definitions.find(item => item.bodyPath === url.pathname) || definitions[1];
    return route.fulfill({ contentType: 'text/html', body: fixtureDocuments.get(url.href) || fixtureHTML(definition) });
  });
  const page = await context.newPage();
  page.setDefaultTimeout(2500);
  const inspect = definition => page.evaluate(inspectEntityActionsPopup, { selector, bodyPath: definition.bodyPath });
  const pointer = definition => page.evaluate(inspectEntityMenuPointer, { selector, bodyPath: definition.bodyPath });
  const mark = definition => page.evaluate(inspectEntityActionsPopup, { selector, bodyPath: definition.bodyPath, markBaseline: true });
  const prepare = async (definition, url = 'https://demo.impact.com' + definition.bodyPath) => {
    await page.goto(url);
    await page.locator('#name').click();
    await page.locator('#name').hover();
    await page.locator(selector).hover();
  };
  const open = async definition => { await prepare(definition); await mark(definition); await page.locator(selector).click(); return inspect(definition); };
  const preserve = () => page.evaluate(() => {
    const button = document.querySelector('#menu'), name = document.querySelector('#name'), input = document.querySelector('input'), link = document.querySelector('#private-link');
    window.__preservedMenu = { button, name, input, link, svg: button.firstChild, buttonChildren: [...button.childNodes], nameNode: name.firstChild, nameText: name.textContent, attributes: JSON.stringify([...button.attributes].map(item => [item.name, item.value])), handler: button.onclick, inputValue: input.value, href: link.getAttribute('href'), popups: [...document.querySelectorAll('body > .row-action-dropdown')].map(popup => ({ popup, nodes: [...popup.querySelectorAll('*')], texts: (() => { const values = [], walker = document.createTreeWalker(popup, NodeFilter.SHOW_TEXT); let node; while ((node = walker.nextNode())) values.push([node, node.nodeValue]); return values; })() })) };
  });
  const verifyPreserved = () => page.evaluate(() => {
    const p = window.__preservedMenu;
    return { button: p.button === document.querySelector('#menu') && p.button.isConnected, children: p.button.childNodes.length === p.buttonChildren.length && p.buttonChildren.every((node, index) => p.button.childNodes[index] === node) && p.button.firstChild === p.svg, attributes: JSON.stringify([...p.button.attributes].map(item => [item.name, item.value])) === p.attributes, nativeHandler: p.button.onclick === p.handler, name: p.name === document.querySelector('#name') && p.name.firstChild === p.nameNode && p.name.textContent === p.nameText, input: p.input === document.querySelector('input') && p.input.value === p.inputValue, link: p.link === document.querySelector('#private-link') && p.link.getAttribute('href') === p.href, popupNodes: p.popups.every(item => item.popup.isConnected && item.nodes.every(node => node.isConnected && item.popup.contains(node)) && item.texts.every(([node, text]) => node.nodeValue === text)), writes: window.counts.writes, optionClicks: window.counts.optionClicks };
  });

  await check('Both exact entity documents support a unique new portal after one trusted native menu click', async () => {
    for (const definition of definitions) {
      const evidence = await open(definition);
      assert.equal(completedEntityActionsPopup(evidence, definition.id), true);
      assert.equal(evidence.visiblePopupCount, 1); assert.equal(evidence.newVisiblePopupCount, 1);
      assert.deepEqual(await page.evaluate(() => window.counts), { names: 1, menus: 1, optionClicks: 0, writes: 0, trustedMenuClicks: 1, untrustedMenuClicks: 0 });
      const state = await pointer(definition); assert.equal(state.authorized, true); assert.equal(state.visibleControlCount, 1); assert.equal(state.controls[0].withinMenuComponent, true);
      assertPrivateOmitted(evidence); assertPrivateOmitted(state);
    }
  });
  await check('Inspectors reject the wrong host, protocol, body document and mismatched path argument', async () => {
    const definition = definitions[1];
    for (const url of ['https://app.impact.com' + definition.bodyPath, 'http://demo.impact.com' + definition.bodyPath, 'https://other.example' + definition.bodyPath, 'https://demo.impact.com/secure/finance/app/legal-entities-view.ihtml', 'https://demo.impact.com' + definition.bodyPath + '/extra']) {
      await prepare(definition, url); const e = await inspect(definition), p = await pointer(definition);
      assert.equal(e.authorized, false); assert.equal(p.authorized, false); assert.equal(completedEntityActionsPopup(e, definition.id), false); assertPrivateOmitted([e, p]);
    }
    await prepare(definition); const other = definitions[0]; assert.equal((await inspect(other)).authorized, false); assert.equal((await pointer(other)).authorized, false);
  });
  await check('Read-only popup and pointer inspections preserve Text, nodes, attributes, handlers, fields and links', async () => {
    for (const definition of definitions) {
      await open(definition); await preserve();
      const e = await inspect(definition), p = await pointer(definition); assertPrivateOmitted([e, p]);
      assert.deepEqual(await verifyPreserved(), { button: true, children: true, attributes: true, nativeHandler: true, name: true, input: true, link: true, popupNodes: true, writes: 0, optionClicks: 0 });
    }
  });
  await check('A missing baseline, pre-existing visible portal or opener already open at baseline cannot certify completion', async () => {
    for (const definition of definitions) {
      await open(definition); await page.evaluate(() => delete window.__entityActionsPopupBaseline); assert.equal(completedEntityActionsPopup(await inspect(definition), definition.id), false);
      await open(definition); await mark(definition); assert.equal(completedEntityActionsPopup(await inspect(definition), definition.id), false);
      await prepare(definition); await page.locator(selector).evaluate(button => button.classList.add('menu-open')); await mark(definition); await page.locator(selector).click(); assert.equal(completedEntityActionsPopup(await inspect(definition), definition.id), false);
    }
  });

  const variants = [
    'missing-portal', 'hidden-portal', 'duplicate-portal', 'nested-portal', 'wrong-portal-component',
    'missing-list', 'duplicate-list', 'nested-list', 'wrong-list-role', 'extra-list-child',
    'missing-option', 'extra-option', 'wrong-option-role', 'nested-option', 'wrong-option-order',
    'duplicate-fixed-node', 'unknown-option-text', 'unknown-popup-text', 'disabled-option', 'aria-disabled-option',
    'wrong-option-wrapper', 'direct-option-text', 'option-editor',
    'missing-menu-open', 'missing-table-menu-open', 'replaced-opener', 'duplicate-opener',
    'wrong-button-component', 'wrong-button-tag', 'disabled-button', 'aria-disabled-button', 'submit-button', 'form-owned-button', 'associated-form-button'
  ];
  for (const variant of variants) await check(`A malformed or unsafe entity menu is rejected: ${variant}`, async () => {
    const definition = definitions[1]; await open(definition);
    await page.evaluate(({ variant, selector, popupSelector }) => {
      const button = document.querySelector(selector), popup = document.querySelector(popupSelector), list = popup.querySelector('ul'), item = list.querySelector('li'), span = item.querySelector('span');
      if (variant === 'missing-portal') popup.remove();
      else if (variant === 'hidden-portal') popup.hidden = true;
      else if (variant === 'duplicate-portal') document.body.append(popup.cloneNode(true));
      else if (variant === 'nested-portal') { const wrapper = document.createElement('div'); document.body.append(wrapper); wrapper.append(popup); }
      else if (variant === 'wrong-portal-component') popup.classList.remove('in-btn-menu');
      else if (variant === 'missing-list') list.remove();
      else if (variant === 'duplicate-list') popup.append(list.cloneNode(true));
      else if (variant === 'nested-list') item.append(list.cloneNode(true));
      else if (variant === 'wrong-list-role') list.setAttribute('role', 'menu');
      else if (variant === 'extra-list-child') { const extra = document.createElement('div'); extra.textContent = 'PRIVATE_POPUP_SENTINEL'; list.append(extra); }
      else if (variant === 'missing-option') item.remove();
      else if (variant === 'extra-option') list.append(item.cloneNode(true));
      else if (variant === 'wrong-option-role') item.setAttribute('role', 'menuitem');
      else if (variant === 'nested-option') item.append(item.cloneNode(true));
      else if (variant === 'wrong-option-order') list.append(item);
      else if (variant === 'duplicate-fixed-node') item.firstElementChild.append(span.cloneNode(true));
      else if (variant === 'unknown-option-text') item.append(document.createTextNode('PRIVATE_POPUP_SENTINEL'));
      else if (variant === 'unknown-popup-text') popup.append(document.createTextNode('PRIVATE_POPUP_SENTINEL'));
      else if (variant === 'disabled-option') item.classList.add('disabled');
      else if (variant === 'aria-disabled-option') item.setAttribute('aria-disabled', 'true');
      else if (variant === 'wrong-option-wrapper') { const anchor = document.createElement('a'); anchor.append(span); item.replaceChildren(anchor); }
      else if (variant === 'direct-option-text') item.textContent = 'Edit';
      else if (variant === 'option-editor') { const input = document.createElement('input'); input.value = 'PRIVATE_INPUT_SENTINEL'; item.firstElementChild.append(input); }
      else if (variant === 'missing-menu-open') button.classList.remove('menu-open');
      else if (variant === 'missing-table-menu-open') button.closest('.iui-dynamic-table').classList.remove('row-menu-open');
      else if (variant === 'replaced-opener') button.replaceWith(button.cloneNode(true));
      else if (variant === 'duplicate-opener') button.parentElement.append(button.cloneNode(true));
      else if (variant === 'wrong-button-component') button.closest('.iui-btn-menu').classList.remove('iui-btn-menu');
      else if (variant === 'wrong-button-tag') { const anchor = document.createElement('a'); for (const a of [...button.attributes]) anchor.setAttribute(a.name, a.value); button.replaceWith(anchor); }
      else if (variant === 'disabled-button') button.disabled = true;
      else if (variant === 'aria-disabled-button') button.setAttribute('aria-disabled', 'true');
      else if (variant === 'submit-button') button.type = 'submit';
      else if (variant === 'form-owned-button') { const form = document.createElement('form'); button.parentElement.append(form); form.append(button); }
      else if (variant === 'associated-form-button') button.setAttribute('form', 'private-form');
    }, { variant, selector, popupSelector });
    const evidence = await inspect(definition); assertPrivateOmitted(evidence); assert.equal(completedEntityActionsPopup(evidence, definition.id), false, 'Broken menu structure or read-only evidence must reject completion');
    assert.equal(await page.evaluate(() => window.counts.writes), 0); assert.equal(await page.evaluate(() => window.counts.optionClicks), 0);
  });
  await check('An exact document cannot use the other entity menu contract or an unsupported page ID', async () => {
    for (const definition of definitions) {
      const evidence = await open(definition); assert.equal(completedEntityActionsPopup(evidence, 'legal-entities'), false); assert.equal(completedEntityActionsPopup(evidence, definitions.find(item => item.id !== definition.id).id), false);
      const malformed = structuredClone(evidence); malformed.documentPath = definitions.find(item => item.id !== definition.id).bodyPath; assert.equal(completedEntityActionsPopup(malformed, definition.id), false);
    }
  });
  await check('Completion rejects every removed required field and inconsistent option evidence', async () => {
    const definition = definitions[1], evidence = await open(definition);
    for (const field of ['authorized', 'documentPath', 'baselinePopupCount', 'baselineOpenerClosed', 'openerCount', 'openerReadOnly', 'openerMatchesComponent', 'visiblePopupCount', 'newVisiblePopupCount', 'openerRetained', 'openerMenuOpen', 'openMenuButtonCount', 'tableMenuOpen', 'popups']) {
      const altered = structuredClone(evidence); delete altered[field]; let completed = false;
      try { completed = completedEntityActionsPopup(altered, definition.id); } catch {}
      assert.equal(completed, false, 'Missing completion evidence must not pass');
    }
    for (const mutate of [value => value.popups[0].options.pop(), value => value.popups[0].options = [], value => value.popups[0].options.push(structuredClone(value.popups[0].options[0])), value => value.popups[0].directBodyChild = false, value => value.popups[0].optionCount += 1, value => value.popups[0].listCount = 0]) {
      const altered = structuredClone(evidence); mutate(altered); assert.equal(completedEntityActionsPopup(altered, definition.id), false, 'The option array must agree with the complete observed list');
    }
  });
  await check('Pointer diagnostics omit arbitrary CSS selector attribute values and private DOM attributes', async () => {
    const definition = definitions[1]; await prepare(definition);
    await page.evaluate(() => { const style = document.createElement('style'); style.textContent = '.row-overlay[data-client="PRIVATE_CSS_SENTINEL"] {opacity:1}'; document.head.append(style); document.querySelector('.row-overlay').setAttribute('data-client', 'PRIVATE_CSS_SENTINEL'); });
    const evidence = await pointer(definition); assertPrivateOmitted(evidence); assert.equal(evidence.textReturned, false); assert.equal(evidence.attributesReturned, false);
  });
  await check('The five shipped menu entries retain exact document, top shell, query, light DOM and option scopes', () => {
    assert.equal(menuEntries.length, 5);
    for (const definition of definitions) {
      const entries = menuEntries.filter(entry => entry.financePageId === definition.id); assert.equal(entries.length, definition.labels.length);
      entries.forEach((entry, index) => {
        assert.equal(entry.source, definition.labels[index]); assert.equal(entry.match, 'exact'); assert.equal(entry.scope.pathExact, definition.bodyPath);
        assert.deepEqual([...entry.scope.hosts], ['demo.impact.com', 'app.impact.com']); assert.deepEqual([...entry.scope.topPaths], [definition.topPath]); assert.equal(entry.scope.topQuery.u, definition.bodyPath); assert.equal(entry.scope.lightDOMOnly, true);
        assert(entry.scope.selector.startsWith(popupSelector + ' > div > div > ul.iui-list[role="listbox"] > li:nth-of-type(' + (index + 1) + ')[role="option"]'), 'An observed option must retain its exact portal and list position');
      });
    }
  });
  const injectedRuleFixture = async (definition, { host = 'demo.impact.com', variant = 'valid' } = {}) => {
    fixtureDocuments.clear();
    const bodyPath = variant === 'wrong-document' ? '/secure/finance/app/wrong-menu-view.ihtml' : definition.bodyPath;
    const topPath = variant === 'wrong-shell' ? '/secure/advertiser/finance/fr/wrong-menu-shell.ihtml' : definition.topPath;
    const bodyURL = 'https://' + host + bodyPath, topURL = new URL('https://' + host + topPath);
    if (variant !== 'missing-query') topURL.searchParams.set('u', variant === 'wrong-query' ? '/secure/finance/app/wrong-menu-view.ihtml' : definition.bodyPath);
    if (variant === 'duplicate-query') topURL.searchParams.append('u', definition.bodyPath);
    fixtureDocuments.set(bodyURL, fixtureHTML(definition));
    fixtureDocuments.set(topURL.href, '<!doctype html><iframe id="native-frame" style="width:1000px;height:650px;border:0" src="' + bodyURL + '"></iframe>');
    await page.goto(topURL.href);
    const frame = page.frame({ url: bodyURL }); assert(frame, 'The exact routed fixture document must exist');
    await frame.locator('#name').click(); await frame.locator(selector).click();
    const entries = menuEntries.filter(entry => entry.financePageId === definition.id);
    await frame.evaluate(({ variant, entries, popupSelector }) => {
      const popup = document.querySelector(popupSelector), list = popup.querySelector('ul');
      window.__menuRuleProof = { nativeEvents: window.counts.optionClicks, records: entries.map(entry => { const element = document.querySelector(entry.scope.selector); if (!element) throw new Error('An observed fixed owner must exist before test mutations'); return { element, node: element.firstChild, source: entry.source, target: entry.target }; }) };
      if (variant === 'wrong-popup') popup.classList.remove('in-btn-menu');
      if (variant === 'nested-popup') { const wrapper = document.createElement('div'); document.body.append(wrapper); wrapper.append(popup); }
      if (variant === 'wrong-list-role') list.setAttribute('role', 'menu');
      if (variant === 'wrong-owner') for (const record of window.__menuRuleProof.records) { const wrapper = document.createElement('b'); record.element.parentElement.replaceChild(wrapper, record.element); wrapper.append(record.element); }
      if (variant === 'wrong-option-index') list.append(list.firstElementChild);
      if (variant === 'shadow') { const host = document.createElement('synthetic-menu-shadow'); document.body.append(host); host.attachShadow({ mode: 'open' }).append(popup); }
      const protectedArea = document.createElement('div'); protectedArea.className = 'table-cell';
      for (const entry of entries) { const span = document.createElement('span'); span.textContent = entry.source; protectedArea.append(span); }
      const input = document.createElement('input'); input.value = 'PRIVATE_INPUT_SENTINEL'; protectedArea.append(input); document.body.append(protectedArea);
      const recordNodes = new Set(window.__menuRuleProof.records.map(record => record.node)), elements = [popup, ...popup.querySelectorAll('*')], texts = [], walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let node;
      while ((node = walker.nextNode())) if (!recordNodes.has(node) && !node.parentElement.closest('script,style')) texts.push({ node, source: node.nodeValue });
      Object.assign(window.__menuRuleProof, { texts, elements: elements.map(element => ({ element, parent: element.parentNode, children: [...element.childNodes], attributes: JSON.stringify([...element.attributes].map(attribute => [attribute.name, attribute.value])) })), nativeHandler: document.querySelector('#menu').onclick, input, inputValue: input.value, attachShadow: Element.prototype.attachShadow });
    }, { variant, entries, popupSelector });
    for (const name of ['dict.js', 'site-config.js', 'content.js']) await frame.addScriptTag({ path: path.join(root, 'impact-cn-mod', name) });
    await frame.evaluate(async () => { if (window.ImpactCN) { await window.ImpactCN.ready; await window.ImpactCN.setAIEnabled(false); } });
    return { frame, entries };
  };
  const assertRuleIdentity = async frame => {
    const safe = await frame.evaluate(() => { const p = window.__menuRuleProof; return { textNodes: p.records.every(record => record.element.firstChild === record.node && record.node.isConnected), elements: p.elements.every(saved => saved.element.isConnected && saved.element.parentNode === saved.parent && saved.element.childNodes.length === saved.children.length && saved.children.every((node, index) => saved.element.childNodes[index] === node) && JSON.stringify([...saved.element.attributes].map(attribute => [attribute.name, attribute.value])) === saved.attributes), privateText: p.texts.every(saved => saved.node.nodeValue === saved.source), input: p.input.value === p.inputValue, handler: document.querySelector('#menu').onclick === p.nativeHandler, attachShadow: Element.prototype.attachShadow === p.attachShadow, writes: window.counts.writes }; });
    assert.deepEqual(safe, { textNodes: true, elements: true, privateText: true, input: true, handler: true, attachShadow: true, writes: 0 });
  };
  await check('All five current menu entries translate in both hosts and restore originals with Text, nodes, native events and private data retained (injected engine)', async () => {
    for (const definition of definitions) for (const host of ['demo.impact.com', 'app.impact.com']) {
      const { frame, entries } = await injectedRuleFixture(definition, { host });
      await frame.waitForFunction(() => window.__menuRuleProof.records.every(record => record.node.nodeValue === record.target)); await assertRuleIdentity(frame);
      for (const entry of entries) await frame.locator(entry.scope.selector).click();
      assert.equal(await frame.evaluate(() => window.counts.optionClicks), entries.length, 'Each translated native option receives exactly one normal click');
      await frame.evaluate(() => window.ImpactCN.setEnabled(false));
      assert(await frame.evaluate(() => window.__menuRuleProof.records.every(record => record.node.nodeValue === record.source)), 'Translation OFF must restore every original fixed Text'); await assertRuleIdentity(frame);
      await frame.evaluate(() => window.ImpactCN.setEnabled(true));
      await frame.waitForFunction(() => window.__menuRuleProof.records.every(record => record.node.nodeValue === record.target)); await assertRuleIdentity(frame);
    }
  });
  for (const variant of ['wrong-document', 'wrong-shell', 'missing-query', 'wrong-query', 'duplicate-query', 'wrong-popup', 'nested-popup', 'wrong-list-role', 'wrong-owner', 'wrong-option-index', 'shadow', 'wrong-host']) await check(`Current shipped menu entries leave the exact scope negative unchanged: ${variant} (injected engine)`, async () => {
    for (const definition of definitions) {
      const { frame } = await injectedRuleFixture(definition, { variant, host: variant === 'wrong-host' ? 'other.example' : 'demo.impact.com' });
      await frame.waitForTimeout(150);
      assert(await frame.evaluate(() => window.__menuRuleProof.records.every(record => record.node.nodeValue === record.source)), 'A scope negative must leave every original Text unchanged'); await assertRuleIdentity(frame);
    }
  });
  await check('Menu completion and completed report captures do not certify the three new editor states or complete finance acceptance', async () => {
    const capture = { pages: [] };
    for (const definition of definitions) {
      const evidence = await open(definition); assert.equal(completedEntityActionsPopup(evidence, definition.id), true);
      capture.pages.push({ id: definition.id, url: 'https://demo.impact.com' + definition.topPath + '?u=' + encodeURIComponent(definition.bodyPath), captures: [{ state: 'deep-existing-entity-actions-menu', candidateCount: 1, topPath: definition.topPath, topQuery: { u: definition.bodyPath }, frames: [{ frameURL: 'https://demo.impact.com' + definition.bodyPath, candidateCount: 1 }] }], safeActions: [{ capturedState: 'deep-existing-entity-actions-menu', type: 'open-dropdown', safeReadOnly: true, nativeMenuComplete: true, menuEvidence: evidence }] });
    }
    for (const [id, handle, serial] of [['upcoming-partner-payments', 'adv_upcoming_payouts', 'r1'], ['cash-flow-history', 'adv_cash_flow_recon', 'r2']]) {
      const sourceTopPath = `/secure/advertiser/Adv_Finance_Report/${serial}/report/viewReport.report`, frameURL = 'https://demo.impact.com' + sourceTopPath, state = 'deep-selected-funding-account-report';
      const resultState = { authorizedReport: true, reportHandle: handle, queryCompleted: true, resultChanged: true, loaderVisibleCount: 0, resultTableCount: 1, fixedHeaderNodeCount: 1, fixedEmptyStateCount: 0, businessRowsRead: false, headerTextReturned: false, privateValuesReturned: false };
      const action = { safeReadOnly: true, type: 'read-report-query', action: 'native-control-sequence', capturedState: state, sourceTopPath, sourceTopQuery: { handle }, formSubmitted: false, financialOperations: 0, savedSettings: 0, queryRequested: true, queryCompleted: true, queryCount: 1, controlEvidence: { resultState, reportApply: { withinReportForm: true, fixedLabel: 'Apply' }, reportResult: { tableSelector: '.reportingTable--bRdjL', headerSelector: '.headerRowSolo--FHRlr', loaderSelector: '.loader--XmNTN', structuresVerifiedInCurrentReport: true }, nativeOption: { selector: '#account', frameURL, tag: 'A', parentTag: 'LI', optionKind: 'custom-single-selection', popupSelector: 'ul.content--YGKCO.singleSelectionFilter--FDzUm', newlyVisibleAfterVerifiedFilter: true, optionTextReturned: false, optionValueReturned: false } }, steps: [{ selector: '#filter', frameURL, label: 'Funding Account:' }, { selector: '#account', frameURL }, { selector: '#reportFormDiv button.searchButton', frameURL, label: 'Apply', readOnlyReportQuery: true }] };
      capture.pages.push({ id, url: frameURL + '?handle=' + handle, safeActions: [action], captures: [{ state, candidateCount: 1, topPath: sourceTopPath, topQuery: { handle }, resultState, frames: [{ frameURL, frameQuery: { handle }, candidateCount: 1 }] }] });
    }
    const missing = unverifiedFinanceDeepStates(capture); assert.deepEqual(missing.map(item => item.pageId), ['legal-entities', 'billing-groups', 'funding-accounts']); assert(missing.every(item => item.state === 'deep-existing-entity-edit-form'));
    const ids = [...capture.pages.map(item => item.id), 'legal-entities', ...Array.from({ length: 10 }, (_, index) => 'other-page-' + index)], ai = { status: 'PASS', nativeReplyChanged: true, automaticSends: 1, chinese: true, conceptMatched: true, correspondingOfficialLink: true };
    const report = finalizeFinanceCoverage({ status: 'PASS', pageErrors: 0, expectedPageIds: ids, selectedPages: ids, results: ids.map(pageId => ({ pageId, status: 'PASS' })), aiCases: [{ ...ai, topicId: 'topic-one' }, { ...ai, topicId: 'topic-two' }], selectedAICases: ['topic-one', 'topic-two'], unverifiedDeepStates: missing });
    assert.equal(report.completePageCoverage, true); assert.equal(report.completeAcceptance, false);
  });
} finally { if (browser) await browser.close(); }
mkdirSync(directory, { recursive: true });
const status = results.length && results.every(item => item.status === 'PASS') ? 'PASS' : 'FAIL';
const report = { mode: 'SYNTHETIC_ENTITY_MENU_CONTRACTS_ONLY', status, date: new Date().toISOString(), version: shipped.version, sourceFingerprints, currentMenuRuleIds: menuEntries.map(entry => entry.id), ruleEngineMode: 'CURRENT_CONTENT_CODE_INJECTED_IN_ROUTED_FIXTURES', actualMV3RuleTests: false, realSiteAcceptance: false, realNetworkQueries: false, submittedForms: 0, financialOperations: 0, privateValuesReturned: false, completePageCoverage: false, completeAcceptance: false, results };
writeFileSync(path.join(directory, 'menu-regression-report.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
console.log(`FINANCE MENU REPORT ${path.join(directory, 'menu-regression-report.json')}`);
process.exitCode = status === 'PASS' ? 0 : 1;

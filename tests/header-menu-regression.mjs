/** Captured Help/Finance DOM scope mechanism tests, never real-site acceptance. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core'))); }
const capture = JSON.parse(readFileSync(path.join(root, 'docs/header-menus-dom-scan.json'), 'utf8'));
const sandbox = {}; vm.createContext(sandbox); vm.runInContext(readFileSync(path.join(root, 'impact-cn-mod/dict.js'), 'utf8'), sandbox);
const dictionary = sandbox.IMPACT_CN_DICTIONARY;
const definitions = [...capture.help.entries, ...capture.finance.entries];
const entries = dictionary.entries.filter(entry => entry.observedSource === 'docs/header-menus-dom-scan.json');
const browser = await chromium.launch({ executablePath: chromium.executablePath(), channel: 'chromium', headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
page.setDefaultTimeout(8000);
const results = [];
async function check(name, operation) { try { const evidence = await operation(); results.push({ name, status: 'PASS', evidence }); console.log(`HEADER UNIT PASS ${name}`); } catch (error) { results.push({ name, status: 'FAIL', evidence: error.message }); console.log(`HEADER UNIT FAIL ${name}: ${error.message}`); } }

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
  for (const script of ['dict.js', 'site-config.js']) await page.addScriptTag({ path: path.join(root, 'impact-cn-mod', script) });
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
try {
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
} finally { await browser.close(); }
const status = results.every(result => result.status === 'PASS') ? 'PASS' : 'FAIL';
mkdirSync(path.join(root, 'artifacts'), { recursive: true });
writeFileSync(path.join(root, 'artifacts/header-menu-unit-report.json'), JSON.stringify({ status, mode: 'SYNTHETIC_HEADER_MECHANISM_ONLY', version: dictionary.version, capturedDefinitions: definitions.length, dictionaryEntries: entries.length, results, credentialsSaved: false, realSiteAcceptance: false }, null, 2));
writeFileSync(path.join(root, 'header-menu-test-report.md'), `# 右上菜单机制回归\n\n版本：${dictionary.version}。结果：**${status} ${results.filter(r => r.status === 'PASS').length}/${results.length}**。\n\n使用真实采集结构构造的隔离 DOM，只验证机制与词典范围；没有真实网络验收、财务正文点击或模拟 AI 答复。实网结果独立记录于 header-live-test-report.md。\n\n${results.map(r => `- **${r.status}** ${r.name}${r.evidence ? `：${r.evidence}` : ''}`).join('\n')}\n`);
process.exitCode = status === 'PASS' ? 0 : 1;

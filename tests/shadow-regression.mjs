/** Synthetic unit checks only. This report is never real-site acceptance. */
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
const browser = await chromium.launch({ executablePath: chromium.executablePath(), channel: 'chromium', headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
page.setDefaultTimeout(8000);
const results = [];
const onlyFilter = process.argv.find(argument => argument.startsWith('--only='))?.slice(7);
async function check(name, action) { if (onlyFilter && !new RegExp(onlyFilter, 'i').test(name)) return; try { await action(); results.push({ name, status: 'PASS' }); console.log(`UNIT PASS ${name}`); } catch (error) { results.push({ name, status: 'FAIL', evidence: error.message }); console.log(`UNIT FAIL ${name}: ${error.message}`); } }
const source = 'Dashboard';
const target = '工作台';
await page.setContent('<body data-impact-cn-demo><main id="vueInstance"><button id="native">Dashboard</button><span id="numeric">123,456.78</span><div id="open-host"></div><div id="protected-host" class="partner-name"></div><div id="late-host"></div></main><div id="ask-impact-shadow-host"></div></body>');
await page.evaluate(() => {
  const host = document.querySelector('#open-host');
  const shadow = host.attachShadow({ mode: 'open' });
  const title = document.createElement('h2'); title.id = 'shadow-title'; title.textContent = 'Dashboard'; shadow.append(title);
  const nested = document.createElement('div'); nested.id = 'nested-host'; shadow.append(nested);
  const nestedRoot = nested.attachShadow({ mode: 'open' });
  const p = document.createElement('p'); p.id = 'nested-title'; p.textContent = 'Dashboard'; nestedRoot.append(p);
  const protectedRoot = document.querySelector('#protected-host').attachShadow({ mode: 'open' });
  const secretName = document.createElement('p'); secretName.id = 'protected-name'; secretName.textContent = 'Dashboard'; protectedRoot.append(secretName);
  const aiRoot = document.querySelector('#ask-impact-shadow-host').attachShadow({ mode: 'open' });
  const textarea = document.createElement('textarea'); textarea.placeholder = 'ask impact...'; aiRoot.append(textarea);
  const send = document.createElement('button'); send.setAttribute('aria-label', 'Send'); send.textContent = 'Send'; aiRoot.append(send);
  const reply = document.createElement('p'); reply.id = 'ai-existing-reply'; reply.textContent = 'Dashboard'; aiRoot.append(reply);
  const ordinary = document.querySelector('#native');
  window.__shadowUnit = { shadowText: title.firstChild, nestedText: p.firstChild, ordinary, ordinaryText: ordinary.firstChild, clicks: 0, sends: 0, prompts: [], inputEvents: 0, attachShadow: Element.prototype.attachShadow };
  ordinary.addEventListener('click', () => { window.__shadowUnit.clicks++; });
  textarea.addEventListener('input', () => { window.__shadowUnit.inputEvents++; });
  send.addEventListener('click', () => { window.__shadowUnit.sends++; window.__shadowUnit.prompts.push(textarea.value); textarea.value = ''; });
  window.IMPACT_CN_DICTIONARY = { version: 'unit-only', entries: [{ id: 'unit-dashboard', source: 'Dashboard', target: '工作台', reason: 'Synthetic unit test' }], helpTopics: [{ id: 'unit-topic', label: '测试原生控件连接', question: '解释 Dashboard', explanation: 'Synthetic test', helpUrl: 'https://help.impact.com/' }] };
});
await page.addScriptTag({ path: path.join(root, 'impact-cn-mod/site-config.js') });
await page.evaluate(() => { window.IMPACT_CN_CONFIG.ai.openerIndicatesClosed = false; });
await page.addStyleTag({ content: readFileSync(path.join(root, 'impact-cn-mod/content.css'), 'utf8') });
await page.addScriptTag({ path: path.join(root, 'impact-cn-mod/content.js') });
await page.evaluate(async () => { await window.ImpactCN.ready; });
await check('Initial nested open Shadow DOM translation retains Text identities', async () => {
  await page.waitForFunction(target => document.querySelector('#open-host').shadowRoot.querySelector('#shadow-title').textContent === target && document.querySelector('#open-host').shadowRoot.querySelector('#nested-host').shadowRoot.querySelector('#nested-title').textContent === target, target);
  assert(await page.evaluate(() => { const t = window.__shadowUnit; return t.shadowText === document.querySelector('#open-host').shadowRoot.querySelector('#shadow-title').firstChild && t.nestedText === document.querySelector('#open-host').shadowRoot.querySelector('#nested-host').shadowRoot.querySelector('#nested-title').firstChild; }));
});
await check('Native original button handler and numeric values remain intact', async () => {
  await page.locator('#native').click();
  assert(await page.evaluate(() => window.__shadowUnit.clicks === 1 && window.__shadowUnit.ordinary === document.querySelector('#native') && window.__shadowUnit.ordinaryText === document.querySelector('#native').firstChild));
  assert.equal(await page.locator('#numeric').innerText(), '123,456.78');
});
await check('Dynamic additions and text updates inside observed shadow roots', async () => {
  await page.evaluate(() => { const p = document.createElement('p'); p.id = 'dynamic-shadow'; p.textContent = 'Dashboard'; document.querySelector('#open-host').shadowRoot.append(p); });
  await page.waitForFunction(target => document.querySelector('#open-host').shadowRoot.querySelector('#dynamic-shadow').textContent === target, target);
  await page.evaluate(() => { document.querySelector('#open-host').shadowRoot.querySelector('#dynamic-shadow').firstChild.data = 'Dashboard'; });
  await page.waitForFunction(target => document.querySelector('#open-host').shadowRoot.querySelector('#dynamic-shadow').textContent === target, target);
});
await check('Late open ShadowRoot discovered without patching attachShadow', async () => {
  await page.evaluate(() => { const shadow = document.querySelector('#late-host').attachShadow({ mode: 'open' }); const p = document.createElement('p'); p.id = 'late-title'; p.textContent = 'Dashboard'; shadow.append(p); });
  await page.waitForFunction(target => document.querySelector('#late-host').shadowRoot.querySelector('#late-title').textContent === target, target);
  assert(await page.evaluate(() => Element.prototype.attachShadow === window.__shadowUnit.attachShadow));
});
await check('Composed ancestor exclusions protect user names and native AI replies', async () => {
  assert.equal(await page.locator('#protected-host #protected-name').innerText(), source);
  assert.equal(await page.locator('#ask-impact-shadow-host #ai-existing-reply').innerText(), source);
});
await check('Disable restores shadow originals and re-enable translates them', async () => {
  await page.evaluate(() => window.ImpactCN.setEnabled(false));
  assert.equal(await page.locator('#open-host #shadow-title').innerText(), source);
  assert.equal(await page.locator('#open-host #nested-title').innerText(), source);
  await page.evaluate(() => window.ImpactCN.setEnabled(true));
  assert.equal(await page.locator('#open-host #shadow-title').innerText(), target);
});
await check('Native-style Shadow DOM textarea receives input event and one send', async () => {
  const result = await page.evaluate(() => window.ImpactCN.askTopic('unit-topic'));
  assert.equal(result.ok, true);
  const evidence = await page.evaluate(() => ({ sends: window.__shadowUnit.sends, prompts: window.__shadowUnit.prompts, events: window.__shadowUnit.inputEvents }));
  assert.equal(evidence.sends, 1); assert(evidence.events >= 1); assert(evidence.prompts[0].includes('https://help.impact.com/'));
});
await check('Existing shadow editor draft is preserved', async () => {
  await page.locator('#ask-impact-shadow-host textarea').fill('Customer draft');
  const result = await page.evaluate(() => window.ImpactCN.askTopic('unit-topic'));
  assert.equal(result.reason, 'draft-exists');
  assert.equal(await page.locator('#ask-impact-shadow-host textarea').inputValue(), 'Customer draft');
  assert.equal(await page.evaluate(() => window.__shadowUnit.sends), 1);
});
await check('A pending AI send stays cancelled through a rapid off-on toggle and preserves the filled draft', async () => {
  await page.locator('#ask-impact-shadow-host textarea').fill('');
  await page.evaluate(() => {
    document.querySelector('#ask-impact-shadow-host').shadowRoot.querySelector('[aria-label="Send"]').disabled = true;
    window.__shadowUnit.raceBeforeSends = window.__shadowUnit.sends;
    window.__shadowUnit.pendingRace = window.ImpactCN.askTopic('unit-topic');
  });
  await page.waitForFunction(() => document.querySelector('#ask-impact-shadow-host').shadowRoot.querySelector('textarea').value.includes('解释 Dashboard'));
  const draft = await page.locator('#ask-impact-shadow-host textarea').inputValue();
  const result = await page.evaluate(async () => {
    await window.ImpactCN.setAIEnabled(false); await window.ImpactCN.setAIEnabled(true);
    document.querySelector('#ask-impact-shadow-host').shadowRoot.querySelector('[aria-label="Send"]').disabled = false;
    return window.__shadowUnit.pendingRace;
  });
  assert.equal(result.ok, false);
  assert.equal(await page.evaluate(() => window.__shadowUnit.sends - window.__shadowUnit.raceBeforeSends), 0);
  assert.equal(await page.locator('#ask-impact-shadow-host textarea').inputValue(), draft);
  assert.equal(await page.evaluate(() => window.ImpactCN.getState().aiEnabled), true);
});
await check('Native AI visible children can send when they override an ancestor visibility hidden', async () => {
  await page.locator('#ask-impact-shadow-host textarea').fill('');
  const before = await page.evaluate(() => {
    const root = document.querySelector('#ask-impact-shadow-host').shadowRoot;
    const input = root.querySelector('textarea'); const send = root.querySelector('[aria-label="Send"]');
    const wrapper = document.createElement('div'); wrapper.id = 'unit-hidden-ancestor'; wrapper.style.visibility = 'hidden'; root.append(wrapper);
    wrapper.append(input, send); input.style.visibility = 'visible'; send.style.visibility = 'visible';
    return { sends: window.__shadowUnit.sends, events: window.__shadowUnit.inputEvents, parentVisibility: getComputedStyle(wrapper).visibility, inputVisibility: getComputedStyle(input).visibility, sendVisibility: getComputedStyle(send).visibility };
  });
  assert.equal(before.parentVisibility, 'hidden'); assert.equal(before.inputVisibility, 'visible'); assert.equal(before.sendVisibility, 'visible');
  const result = await page.evaluate(() => window.ImpactCN.askTopic('unit-topic'));
  assert.equal(result.ok, true);
  assert.equal(await page.evaluate(() => window.__shadowUnit.sends), before.sends + 1);
  assert(await page.evaluate(() => window.__shadowUnit.inputEvents) > before.events);
  assert.equal(await page.locator('#ask-impact-shadow-host textarea').inputValue(), '');
  await page.evaluate(() => {
    const root = document.querySelector('#ask-impact-shadow-host').shadowRoot; const wrapper = root.querySelector('#unit-hidden-ancestor');
    for (const element of [...wrapper.children]) { element.style.removeProperty('visibility'); root.append(element); }
    wrapper.remove();
  });
});
await check('Destroy restores text and stops future shadow translation', async () => {
  await page.evaluate(() => window.ImpactCN.destroy());
  assert.equal(await page.locator('#open-host #shadow-title').innerText(), source);
  await page.evaluate(() => { document.querySelector('#open-host').shadowRoot.querySelector('#shadow-title').firstChild.data = 'Dashboard'; });
  await page.waitForTimeout(100);
  assert.equal(await page.locator('#open-host #shadow-title').innerText(), source);
});
async function closingDrawerFixture() {
  const fixture = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  fixture.setDefaultTimeout(8000);
  await fixture.setContent('<body data-impact-cn-demo><main id="vueInstance"><h2>Actions</h2></main><div id="ask-impact-shadow-host" style="position:fixed;right:20px;top:20px;width:300px"></div></body>');
  await fixture.evaluate(() => {
    const host = document.querySelector('#ask-impact-shadow-host'); const root = host.attachShadow({ mode: 'open' });
    const oldEditor = document.createElement('textarea'); oldEditor.placeholder = 'ask impact...'; root.append(oldEditor);
    const oldSend = document.createElement('button'); oldSend.setAttribute('aria-label', 'Send'); oldSend.textContent = 'Send'; root.append(oldSend);
    const close = document.createElement('button'); close.title = 'Close'; close.textContent = 'Close'; root.append(close);
    const opener = document.createElement('button'); opener.setAttribute('aria-label', 'Open Ask Impact'); opener.textContent = 'Open Ask Impact'; opener.style.cssText = 'display:none;position:fixed;right:20px;bottom:20px'; document.body.append(opener);
    const unit = window.__closingUnit = { oldEditor, oldSend, oldInputs: 0, oldSends: 0, newInputs: 0, newSends: 0, opens: 0, earlyOpens: 0, oldRemoved: false, helperWhileClosing: false };
    oldEditor.addEventListener('input', () => unit.oldInputs++); oldSend.addEventListener('click', () => unit.oldSends++);
    close.addEventListener('click', () => {
      unit.closing = true; oldSend.disabled = true; opener.style.display = 'block';
      // Models the observed 300 ms native fade: opener appears before removal.
      setTimeout(() => { oldEditor.remove(); oldSend.remove(); close.remove(); unit.oldRemoved = true; unit.closing = false; }, 300);
    });
    opener.addEventListener('click', () => {
      unit.opens++; if (oldEditor.isConnected) unit.earlyOpens++;
      const newEditor = document.createElement('textarea'); newEditor.placeholder = 'ask impact...'; root.append(newEditor); unit.newEditor = newEditor;
      const newSend = document.createElement('button'); newSend.setAttribute('aria-label', 'Send'); newSend.textContent = 'Send'; root.append(newSend);
      newEditor.addEventListener('input', () => unit.newInputs++);
      newSend.addEventListener('click', () => { unit.newSends++; newEditor.value = ''; });
      opener.style.display = 'none';
    });
    document.addEventListener('click', event => { if (event.composedPath().some(element => element instanceof Element && element.matches('[data-impact-cn-help]'))) unit.helperWhileClosing = unit.closing && oldEditor.isConnected; }, true);
    window.IMPACT_CN_DICTIONARY = { version: 'closing-fixture-only', entries: [{ id: 'closing-actions', source: 'Actions', target: '转化量', reason: 'Native closing lifecycle regression', helpTopicId: 'closing-topic' }], helpTopics: [{ id: 'closing-topic', label: '转化量', entryIds: ['closing-actions'], question: '解释 Actions 指标', helpUrl: 'https://help.impact.com/' }] };
  });
  await fixture.addScriptTag({ path: path.join(root, 'impact-cn-mod/site-config.js') });
  await fixture.evaluate(() => { window.IMPACT_CN_CONFIG.ai.openerIndicatesClosed = true; });
  await fixture.addStyleTag({ content: readFileSync(path.join(root, 'impact-cn-mod/content.css'), 'utf8') });
  await fixture.addScriptTag({ path: path.join(root, 'impact-cn-mod/content.js') });
  await fixture.evaluate(async () => { await window.ImpactCN.ready; });
  return fixture;
}
await check('A rapid native Close then inline question waits for the stale editor and sends only through the new instance', async () => {
  const fixture = await closingDrawerFixture();
  try {
    await fixture.locator('#ask-impact-shadow-host button[title="Close"]').click();
    assert(await fixture.evaluate(() => window.__closingUnit.oldEditor.isConnected && window.__closingUnit.oldSend.disabled));
    await fixture.locator('[data-impact-cn-help][data-topic-id="closing-topic"]').click();
    await fixture.waitForFunction(() => window.__closingUnit.newSends === 1 && !window.ImpactCN.getState().busy);
    assert(await fixture.evaluate(() => { const u = window.__closingUnit; return u.helperWhileClosing && u.oldRemoved && u.oldInputs === 0 && u.oldEditor.value === '' && u.oldSends === 0 && u.opens === 1 && u.earlyOpens === 0 && u.newInputs > 0 && u.newSends === 1 && u.newEditor.value === ''; }));
  } finally { await fixture.close(); }
});
await check('An AI off-on toggle during native closing permanently cancels the question without opening or sending', async () => {
  const fixture = await closingDrawerFixture();
  try {
    await fixture.locator('#ask-impact-shadow-host button[title="Close"]').click();
    await fixture.locator('[data-impact-cn-help][data-topic-id="closing-topic"]').click();
    await fixture.waitForFunction(() => window.ImpactCN.getState().busy && window.__closingUnit.closing);
    await fixture.evaluate(async () => { await window.ImpactCN.setAIEnabled(false); await window.ImpactCN.setAIEnabled(true); });
    await fixture.waitForFunction(() => window.__closingUnit.oldRemoved && !window.ImpactCN.getState().busy);
    assert(await fixture.evaluate(() => { const u = window.__closingUnit; return u.helperWhileClosing && u.oldInputs === 0 && u.oldEditor.value === '' && u.oldSends === 0 && u.opens === 0 && u.newSends === 0 && window.ImpactCN.getState().aiEnabled; }));
  } finally { await fixture.close(); }
});
// A separate synthetic page tests actual dictionary scopes. The domain below is
// fulfilled locally for unit isolation; it is explicitly NOT a real-site visit.
const dictionarySandbox = {};
vm.createContext(dictionarySandbox);
vm.runInContext(readFileSync(path.join(root, 'impact-cn-mod/dict.js'), 'utf8'), dictionarySandbox);
const actualDictionary = dictionarySandbox.IMPACT_CN_DICTIONARY;
const nativeEntries = actualDictionary.entries.filter(entry => entry.stage === 'native-dashboard');
await check('Current dictionary schema, official links and native scope requirements', async () => {
  assert.equal(actualDictionary.version, JSON.parse(readFileSync(path.join(root, 'impact-cn-mod/manifest.json'), 'utf8')).version);
  assert.equal(nativeEntries.find(entry => entry.id === 'total-cost')?.target, '推广总成本');
  assert.equal(nativeEntries.find(entry => entry.id === 'program-health')?.target, '推广效果概览');
  assert(nativeEntries.length >= 49);
  const ids = new Set();
  for (const entry of actualDictionary.entries) { assert(!ids.has(entry.id)); ids.add(entry.id); }
  for (const entry of nativeEntries) {
    assert(entry.scope && entry.scope.selector && entry.scope.hosts.includes('demo.impact.com') && entry.scope.path);
    assert(entry.target && entry.reason && entry.verification === 'observed-dom');
    if (entry.helpUrl) { const url = new URL(entry.helpUrl); assert.equal(url.protocol, 'https:'); assert.equal(url.hostname, 'help.impact.com'); }
  }
  assert(actualDictionary.helpTopics.length >= 15);
  assert(!actualDictionary.helpTopics.some(topic => ['dashboard', 'metrics'].includes(topic.id)));
  const topicIds = new Set();
  for (const topic of actualDictionary.helpTopics) {
    assert(!topicIds.has(topic.id)); topicIds.add(topic.id);
    assert(topic.entryIds?.length > 0);
    assert.equal(new URL(topic.helpUrl).hostname, 'help.impact.com');
    for (const id of topic.entryIds) assert.equal(actualDictionary.entries.find(entry => entry.id === id)?.helpTopicId, topic.id);
  }
  for (const entry of nativeEntries.filter(item => item.helpTopicId)) assert(actualDictionary.helpTopics.some(topic => topic.id === entry.helpTopicId && topic.entryIds.includes(entry.id)));
  const capture = JSON.parse(readFileSync(path.join(root, 'docs/sidebar-dom-scan.json'), 'utf8'));
  const coverage = await page.evaluate(({ dictionary, capture }) => {
    const missing = []; const ambiguous = []; const sources = new Set();
    for (const product of capture.products) {
      const cases = [{ source: product.source, kind: 'product' }, ...product.mainLabels.map(source => ({ source, kind: 'main' }))];
      for (const menu of product.menus) for (const source of menu.labels) cases.push({ source, kind: menu.nested ? 'nested' : 'child', menu });
      for (const item of cases) {
        sources.add(item.source);
        const parent = document.createElement('div'); parent.id = 'adv-navigation';
        const host = document.createElement('impact-style-isolator'); parent.append(host);
        const root = host.attachShadow({ mode: 'open' }); const nav = document.createElement('div'); nav.id = 'adv-nav'; root.append(nav);
        let element;
        if (item.kind === 'product' || item.kind === 'main') { element = document.createElement('span'); element.className = item.kind === 'product' ? 'product-name' : 'subitem-label'; nav.append(element); }
        else {
          const wrapper = document.createElement('div'); wrapper.className = item.kind === 'nested' ? 'subchild-label' : 'child-menu-content'; nav.append(wrapper);
          const folder = product.menus.some(menu => menu.source === item.menu.source && menu.nested === item.source);
          const span = item.source === 'Performance' && item.menu.source === 'Reports' || folder;
          element = document.createElement(item.kind === 'nested' ? 'a' : span ? 'span' : 'a'); wrapper.append(element);
        }
        element.textContent = item.source;
        const path = `/secure/advertiser/${product.source.toLowerCase()}/`;
        const matches = dictionary.entries.filter(entry => [entry.source, ...(entry.aliases || [])].includes(item.source) && entry.scope?.shadowHost === '#adv-navigation impact-style-isolator' && (!entry.scope.path || path.startsWith(entry.scope.path)) && (!entry.scope.paths || entry.scope.paths.some(prefix => path.startsWith(prefix))) && element.closest(entry.scope.selector));
        if (!matches.length) missing.push({ product: product.source, source: item.source, kind: item.kind, tag: element.tagName });
        if (new Set(matches.map(entry => entry.target)).size > 1) ambiguous.push({ product: product.source, source: item.source, kind: item.kind, tag: element.tagName });
      }
    }
    return { uniqueSourceCount: sources.size, missing, ambiguous };
  }, { dictionary: JSON.parse(JSON.stringify(actualDictionary)), capture });
  assert.equal(coverage.uniqueSourceCount, 87);
  assert.deepEqual(coverage.missing, []);
  assert.deepEqual(coverage.ambiguous, []);
});
const scopedPage = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
scopedPage.setDefaultTimeout(8000);
await scopedPage.route('**/*', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><body><div id="adv-navigation"><impact-style-isolator></impact-style-isolator></div><main id="vueInstance"><span id="unit-native-numeric">$123,456.78</span><snapshot-chart-shadow></snapshot-chart-shadow></main><div class="iui-calendar-range"><div class="presets"></div><div class="footer"></div></div><div class="product-name" id="unit-outside-scope">Dashboard</div><div id="ask-impact-shadow-host"></div></body>' }));
await scopedPage.goto('https://demo.impact.com/secure/advertiser/engage/aview.ihtml?synthetic-dictionary-unit=1');
await scopedPage.evaluate(entries => {
  const navRoot = document.querySelector('impact-style-isolator').attachShadow({ mode: 'open' });
  const navControls = document.createElement('div'); navControls.id = 'adv-nav'; navRoot.append(navControls);
  const chartRoot = document.querySelector('snapshot-chart-shadow').attachShadow({ mode: 'open' });
  window.__actualDictionaryUnit = [];
  window.__inlineUnit = { nativeActions: 0, pointerActions: 0, sends: 0, prompts: [] };
  const aiRoot = document.querySelector('#ask-impact-shadow-host').attachShadow({ mode: 'open' });
  // The native drawer is viewport positioned. Seeding 124 sidebar labels must
  // not move its editor below the viewport and invalidate visibility checks.
  document.querySelector('#ask-impact-shadow-host').style.cssText = 'position:fixed;right:8px;top:8px;width:280px;display:block;background:white;z-index:1';
  const editor = document.createElement('textarea'); editor.placeholder = 'ask impact...'; aiRoot.append(editor);
  const send = document.createElement('button'); send.setAttribute('aria-label', 'Send'); send.textContent = 'Send'; aiRoot.append(send);
  send.addEventListener('click', () => { window.__inlineUnit.sends++; window.__inlineUnit.prompts.push(editor.value); editor.value = ''; });
  const vue = document.querySelector('#vueInstance');
  function chain(parent, specs) {
    let current = parent;
    for (const [tag, className] of specs) { const child = document.createElement(tag); child.className = className; current.append(child); current = child; }
    return current;
  }
  for (const entry of entries) {
    const selector = entry.scope.selector;
    let node;
    if (entry.scope.shadowHost === '#adv-navigation impact-style-isolator') {
      if (selector.includes('.child-menu-content')) {
        const tag = /\.child-menu-content\s+span/u.test(selector) && !/\.child-menu-content\s+a(?:\W|$)/u.test(selector) ? 'span' : 'a';
        node = chain(navControls, [['div', 'child-menu-content'], [tag, '']]);
      } else if (selector.includes('.subchild-label')) node = chain(navControls, [['div', 'subchild-label'], ['a', '']]);
      else if (selector.includes('.subitem-label') && !selector.includes('.product-name')) node = chain(navControls, [['div', 'navigation-subitems-container'], ['div', 'subitem-container'], ['div', 'subitem-label']]);
      else node = chain(selector.includes('.product-name') ? navRoot : navControls, [['span', 'product-name']]);
    }
    else if (entry.scope.shadowHost === 'snapshot-chart-shadow') node = chain(chartRoot, [['span', 'secondaryFieldLabel__unit']]);
    else if (selector.includes('.iui-calendar-range')) node = chain(document.querySelector('.iui-calendar-range .presets'), [['button', '']]);
    else if (selector.includes('h3.dashboard-container-title')) node = chain(vue, [['h3', 'dashboard-container-title']]);
    else if (selector.includes('btn.tertiary')) node = chain(vue, [['div', 'partnerSnapshotContainer'], ['btn', 'tertiary']]);
    else if (selector.includes('.filterSection a')) node = chain(vue, [['div', 'partnerSnapshotContainer'], ['div', 'filterSection'], ['a', '']]);
    else if (selector.includes('.partner-size .size-label')) node = chain(vue, [['div', 'partner-size'], ['span', 'size-label']]);
    else if (selector.includes('.partner-category .text-ellipsis')) node = chain(vue, [['div', 'partner-category'], ['span', 'text-ellipsis']]);
    else if (selector.includes('.discover-link a')) node = chain(vue, [['div', 'discover-link'], ['a', '']]);
    else if (selector.includes('.welcome-back')) node = chain(vue, [['h1', 'welcome-back']]);
    else throw new Error('Add a unit component for dictionary selector: ' + entry.id);
    const guestName = 'Synthetic Guest — 42';
    const source = entry.match === 'prefix' ? entry.source.trimEnd() + ' ' + guestName : entry.source;
    const expected = entry.match === 'prefix' ? entry.target + ' ' + guestName : entry.target;
    if (entry.id === 'actions') {
      const nativeCard = document.createElement('div'); nativeCard.setAttribute('role', 'button');
      node.parentNode.insertBefore(nativeCard, node); nativeCard.append(node);
      nativeCard.addEventListener('click', () => { window.__inlineUnit.nativeActions++; });
      nativeCard.addEventListener('pointerdown', () => { window.__inlineUnit.pointerActions++; });
    }
    if (entry.id === 'engage') {
      const nativeButton = document.createElement('button'); nativeButton.type = 'button';
      node.parentNode.insertBefore(nativeButton, node); nativeButton.append(node);
    }
    node.textContent = source;
    node.setAttribute('data-unit-entry-id', entry.id);
    window.__actualDictionaryUnit.push({ id: entry.id, element: node, textNode: node.firstChild, source, expected });
  }
  const privateName = chain(navRoot, [['div', 'partner-name'], ['span', 'product-name']]); privateName.id = 'unit-private-name'; privateName.textContent = 'Dashboard';
  const wrongHost = document.createElement('div'); wrongHost.id = 'unit-wrong-shadow-host'; vue.append(wrongHost);
  const wrongRoot = wrongHost.attachShadow({ mode: 'open' }); const wrong = document.createElement('span'); wrong.id = 'unit-wrong-metric'; wrong.className = 'secondaryFieldLabel__unit'; wrong.textContent = 'Actions'; wrongRoot.append(wrong);
}, JSON.parse(JSON.stringify(nativeEntries)));
await scopedPage.addScriptTag({ path: path.join(root, 'impact-cn-mod/dict.js') });
await scopedPage.addScriptTag({ path: path.join(root, 'impact-cn-mod/site-config.js') });
await scopedPage.evaluate(() => { window.IMPACT_CN_CONFIG.ai.openerIndicatesClosed = false; });
await scopedPage.addStyleTag({ content: readFileSync(path.join(root, 'impact-cn-mod/content.css'), 'utf8') });
await scopedPage.addScriptTag({ path: path.join(root, 'impact-cn-mod/content.js') });
await scopedPage.evaluate(async () => { await window.ImpactCN.ready; });
await check(`All ${nativeEntries.length} actual native-dictionary entries translate only inside verified components`, async () => {
  const wrong = await scopedPage.evaluate(() => window.__actualDictionaryUnit.filter(entry => entry.textNode.nodeValue !== entry.expected).map(entry => ({ id: entry.id, expected: entry.expected, actual: entry.textNode.nodeValue })));
  assert.deepEqual(wrong, []);
  assert(await scopedPage.evaluate(() => window.__actualDictionaryUnit.every(entry => entry.element.firstChild === entry.textNode)));
  assert.equal(await scopedPage.locator('#unit-native-numeric').innerText(), '$123,456.78');
});
await check('Actual dictionary preserves welcome-name suffix, partner name and wrong-shadow metric', async () => {
  const welcome = await scopedPage.evaluate(() => window.__actualDictionaryUnit.find(entry => entry.id === 'welcome-back-prefix').textNode.nodeValue);
  assert(welcome.endsWith('Synthetic Guest — 42')); assert(welcome.startsWith('欢迎回来，'));
  assert.equal(await scopedPage.locator('#unit-private-name').innerText(), 'Dashboard');
  assert.equal(await scopedPage.locator('#unit-outside-scope').innerText(), 'Dashboard');
  assert.equal(await scopedPage.locator('#unit-wrong-metric').innerText(), 'Actions');
  await verifyActionsNavigationScope();
});
await check('Actual dictionary translates a late body date portal and preserves submitted dates', async () => {
  await scopedPage.evaluate(() => {
    const calendar = document.createElement('div'); calendar.id = 'unit-late-calendar'; calendar.className = 'iui-calendar-range';
    const presets = document.createElement('div'); presets.className = 'presets';
    const button = document.createElement('button'); button.textContent = 'Yesterday'; presets.append(button);
    const input = document.createElement('input'); input.value = '2026-10-10'; presets.append(input);
    calendar.append(presets); document.body.append(calendar);
  });
  await scopedPage.waitForFunction(() => document.querySelector('#unit-late-calendar button').textContent === '昨天');
  assert.equal(await scopedPage.locator('#unit-late-calendar input').inputValue(), '2026-10-10');
});
await check('Nine native Chinese mistranslation aliases calibrate only verified navigation scopes', async () => {
  const sources = ['面板', '伙伴', '项目经理', '放大', '报表', '交易', '内容', '合同', '推荐并赚取'];
  const entries = sources.map(source => {
    const entry = nativeEntries.find(entry => entry.aliases?.includes(source));
    assert(entry, `Missing verified Chinese alias: ${source}`);
    assert.equal(entry.scope.shadowHost, '#adv-navigation impact-style-isolator');
    return { source, id: entry.id, target: entry.target };
  });
  await scopedPage.evaluate(entries => {
    window.__nativeAliasUnit = [];
    for (const { source, id, target } of entries) {
      const original = window.__actualDictionaryUnit.find(entry => entry.id === id).element;
      const local = original.cloneNode(false); local.removeAttribute('data-unit-entry-id'); local.textContent = source; original.parentNode.append(local);
      const textNode = local.firstChild;
      const privateContainer = document.createElement('div'); privateContainer.className = 'partner-name'; original.getRootNode().append(privateContainer);
      const privateLabel = original.cloneNode(false); privateLabel.removeAttribute('data-unit-entry-id'); privateLabel.textContent = source; privateContainer.append(privateLabel);
      const outside = original.cloneNode(false); outside.removeAttribute('data-unit-entry-id'); outside.textContent = source; document.body.append(outside);
      window.__nativeAliasUnit.push({ source, target, local, textNode, privateContainer, privateLabel, outside });
    }
  }, entries);
  await scopedPage.waitForFunction(() => window.__nativeAliasUnit.every(entry => entry.textNode.nodeValue === entry.target));
  assert(await scopedPage.evaluate(() => window.__nativeAliasUnit.every(entry => entry.local.firstChild === entry.textNode && entry.privateLabel.firstChild.nodeValue === entry.source && entry.outside.firstChild.nodeValue === entry.source)));
  await scopedPage.evaluate(() => window.ImpactCN.setEnabled(false));
  assert(await scopedPage.evaluate(() => window.__nativeAliasUnit.every(entry => entry.textNode.nodeValue === entry.source && entry.local.firstChild === entry.textNode)));
  await scopedPage.evaluate(() => window.ImpactCN.setEnabled(true));
  assert(await scopedPage.evaluate(() => window.__nativeAliasUnit.every(entry => entry.textNode.nodeValue === entry.target && entry.privateLabel.firstChild.nodeValue === entry.source && entry.outside.firstChild.nodeValue === entry.source)));
  await scopedPage.evaluate(() => { for (const entry of window.__nativeAliasUnit) { entry.local.remove(); entry.privateContainer.remove(); entry.outside.remove(); } window.ImpactCN.refresh(); });
});
async function verifyActionsNavigationScope() {
  const menuEntry = actualDictionary.entries.find(entry => entry.source === 'Actions' && entry.target === '转化记录' && entry.scope?.shadowHost === '#adv-navigation impact-style-isolator');
  assert(menuEntry, 'Missing verified navigation Actions entry');
  await scopedPage.evaluate(() => {
    const navRoot = document.querySelector('impact-style-isolator').shadowRoot;
    const container = document.createElement('div'); container.className = 'child-menu-content';
    const anchor = document.createElement('a'); anchor.textContent = 'Actions'; container.append(anchor); navRoot.querySelector('#adv-nav').append(container);
    const outside = container.cloneNode(true); document.querySelector('#vueInstance').append(outside);
    window.__actionsScopeUnit = { container, anchor, textNode: anchor.firstChild, outside };
  });
  await scopedPage.waitForFunction(() => window.__actionsScopeUnit.textNode.nodeValue === '转化记录');
  assert(await scopedPage.evaluate(() => window.__actionsScopeUnit.anchor.firstChild === window.__actionsScopeUnit.textNode && window.__actionsScopeUnit.outside.firstChild.firstChild.nodeValue === 'Actions' && window.__actualDictionaryUnit.find(entry => entry.id === 'actions').textNode.nodeValue === '转化量'));
  await scopedPage.evaluate(() => window.ImpactCN.setEnabled(false));
  assert(await scopedPage.evaluate(() => window.__actionsScopeUnit.textNode.nodeValue === 'Actions' && window.__actualDictionaryUnit.find(entry => entry.id === 'actions').textNode.nodeValue === 'Actions'));
  await scopedPage.evaluate(() => window.ImpactCN.setEnabled(true));
  assert(await scopedPage.evaluate(() => window.__actionsScopeUnit.textNode.nodeValue === '转化记录' && window.__actualDictionaryUnit.find(entry => entry.id === 'actions').textNode.nodeValue === '转化量'));
  await scopedPage.evaluate(() => { window.__actionsScopeUnit.container.remove(); window.__actionsScopeUnit.outside.remove(); window.ImpactCN.refresh(); });
}
await check('Inline questions map only individual concepts and render visibly inside native Shadow DOM', async () => {
  const evidence = await scopedPage.evaluate(() => {
    const entries = window.__actualDictionaryUnit;
    const mapped = entries.filter(entry => globalThis.IMPACT_CN_DICTIONARY.entries.find(item => item.id === entry.id).helpTopicId);
    return mapped.map(entry => {
      const topicId = globalThis.IMPACT_CN_DICTIONARY.entries.find(item => item.id === entry.id).helpTopicId;
      const root = entry.element.getRootNode(); const buttons = [...root.querySelectorAll('button[data-impact-cn-help]')].filter(button => button.dataset.entryId === entry.id);
      const button = buttons[0];
      return { id: entry.id, count: buttons.length, topicMatches: button?.dataset.topicId === topicId, visible: Boolean(button?.getClientRects().length), glyph: button ? getComputedStyle(button, '::before').content : '', textIdentity: entry.textNode === entry.element.firstChild, textUnchanged: entry.textNode.nodeValue === entry.expected };
    });
  });
  assert(evidence.length >= 15);
  for (const entry of evidence) { assert.equal(entry.count, 1, entry.id); assert(entry.topicMatches && entry.visible && entry.textIdentity && entry.textUnchanged, entry.id); assert.equal(entry.glyph, '"?"', entry.id); }
  assert.equal(await scopedPage.locator('snapshot-chart-shadow [data-impact-cn-help][data-topic-id="actions"]').count(), 1);
  assert.equal(await scopedPage.locator('snapshot-chart-shadow [data-impact-cn-help][data-entry-id="clicks"]').count(), 0);
  assert.equal(await scopedPage.locator('#impact-cn-assistant [data-topic-id]').count(), 0);
});
await check('Refresh is idempotent and questions beside native buttons never nest another button', async () => {
  const count = await scopedPage.locator('button[data-impact-cn-help]').count();
  await scopedPage.evaluate(() => { for (let i = 0; i < 5; i++) window.ImpactCN.refresh(); });
  await scopedPage.waitForTimeout(150);
  assert.equal(await scopedPage.locator('button[data-impact-cn-help]').count(), count);
  assert.equal(await scopedPage.locator('button button[data-impact-cn-help],a button[data-impact-cn-help]').count(), 0);
  assert(await scopedPage.evaluate(() => { const entry = window.__actualDictionaryUnit.find(entry => entry.id === 'engage'); const nativeButton = entry.element.closest('button'); return nativeButton.nextElementSibling?.matches('[data-impact-cn-help][data-topic-id="engage"]'); }));
});
await check('Inline pointer and click events send one concept question without triggering the native card', async () => {
  const button = scopedPage.locator('snapshot-chart-shadow [data-impact-cn-help][data-topic-id="actions"]');
  await button.dispatchEvent('pointerdown'); await button.click();
  await scopedPage.waitForFunction(() => window.__inlineUnit.sends === 1 && !window.ImpactCN.getState().busy);
  const evidence = await scopedPage.evaluate(() => window.__inlineUnit);
  assert.equal(evidence.nativeActions, 0); assert.equal(evidence.pointerActions, 0); assert.equal(evidence.sends, 1);
  assert(evidence.prompts[0].startsWith(actualDictionary.helpTopics.find(topic => topic.id === 'actions').question));
  assert(evidence.prompts[0].includes('一句话解释') && evidence.prompts[0].includes('具体例子') && evidence.prompts[0].includes('https://help.impact.com/'));
  assert(await scopedPage.evaluate(() => { const e = window.__actualDictionaryUnit.find(e => e.id === 'actions'); return e.textNode.nodeValue === e.expected && e.element.firstChild === e.textNode; }));
});
await check('Translation and AI are independent in all four combinations; AI off blocks sending', async () => {
  const count = await scopedPage.locator('button[data-impact-cn-help]').count();
  const beforeSends = await scopedPage.evaluate(() => window.__inlineUnit.sends);
  await scopedPage.evaluate(() => window.ImpactCN.setAIEnabled(false));
  assert(await scopedPage.evaluate(() => window.ImpactCN.getState().enabled && !window.ImpactCN.getState().aiEnabled && window.__actualDictionaryUnit.every(entry => entry.textNode.nodeValue === entry.expected)));
  assert.equal(await scopedPage.locator('button[data-impact-cn-help]').count(), 0);
  const blocked = await scopedPage.evaluate(() => window.ImpactCN.askTopic('actions'));
  assert.equal(blocked.ok, false);
  assert.equal(await scopedPage.evaluate(() => window.__inlineUnit.sends), beforeSends);
  await scopedPage.evaluate(() => window.ImpactCN.setEnabled(false));
  assert.equal(await scopedPage.locator('button[data-impact-cn-help]').count(), 0);
  assert(await scopedPage.evaluate(() => window.__actualDictionaryUnit.every(entry => entry.textNode.nodeValue === entry.source && entry.element.firstChild === entry.textNode)));
  await scopedPage.evaluate(() => window.ImpactCN.setAIEnabled(true));
  assert.equal(await scopedPage.locator('button[data-impact-cn-help]').count(), count);
  assert(await scopedPage.evaluate(() => !window.ImpactCN.getState().enabled && window.ImpactCN.getState().aiEnabled && window.__actualDictionaryUnit.every(entry => entry.textNode.nodeValue === entry.source)));
  await scopedPage.locator('snapshot-chart-shadow [data-impact-cn-help][data-topic-id="actions"]').click();
  await scopedPage.waitForFunction(before => window.__inlineUnit.sends === before + 1 && !window.ImpactCN.getState().busy, beforeSends);
  assert(await scopedPage.evaluate(() => window.__actualDictionaryUnit.find(entry => entry.id === 'actions').textNode.nodeValue === 'Actions'));
  await scopedPage.evaluate(() => window.ImpactCN.setEnabled(true));
  assert.equal(await scopedPage.locator('button[data-impact-cn-help]').count(), count);
  assert(await scopedPage.evaluate(() => window.ImpactCN.getState().enabled && window.ImpactCN.getState().aiEnabled && window.__actualDictionaryUnit.every(entry => entry.textNode.nodeValue === entry.expected && entry.element.firstChild === entry.textNode)));
});
await check('A changed or detached term loses its question and restores one question when the original term returns', async () => {
  await scopedPage.evaluate(() => { window.__actualDictionaryUnit.find(entry => entry.id === 'actions').textNode.nodeValue = 'Unrecognized status'; });
  await scopedPage.waitForFunction(() => !document.querySelector('snapshot-chart-shadow').shadowRoot.querySelector('[data-impact-cn-help][data-topic-id="actions"]'));
  assert.equal(await scopedPage.locator('snapshot-chart-shadow [data-unit-entry-id="actions"]').innerText(), 'Unrecognized status');
  await scopedPage.evaluate(() => { const entry = window.__actualDictionaryUnit.find(entry => entry.id === 'actions'); entry.textNode.nodeValue = entry.source; });
  await scopedPage.waitForFunction(() => document.querySelector('snapshot-chart-shadow').shadowRoot.querySelectorAll('[data-impact-cn-help][data-topic-id="actions"]').length === 1);
  await scopedPage.evaluate(() => { const entry = window.__actualDictionaryUnit.find(entry => entry.id === 'actions'); window.__inlineUnit.detached = { entry, parent: entry.element.parentNode }; entry.element.remove(); });
  await scopedPage.waitForFunction(() => window.ImpactCN.getState().inlineHelpCount === document.querySelectorAll('[data-impact-cn-help]').length + [...document.querySelectorAll('*')].filter(el => el.shadowRoot).reduce((sum, el) => sum + el.shadowRoot.querySelectorAll('[data-impact-cn-help]').length, 0));
  assert.equal(await scopedPage.locator('snapshot-chart-shadow [data-impact-cn-help][data-topic-id="actions"]').count(), 0);
  await scopedPage.evaluate(() => { const { entry, parent } = window.__inlineUnit.detached; parent.append(entry.element); entry.textNode.nodeValue = entry.source; });
  await scopedPage.waitForFunction(() => document.querySelector('snapshot-chart-shadow').shadowRoot.querySelectorAll('[data-impact-cn-help][data-topic-id="actions"]').length === 1);
  assert(await scopedPage.evaluate(() => { const e = window.__actualDictionaryUnit.find(e => e.id === 'actions'); return e.element.firstChild === e.textNode && e.textNode.nodeValue === e.expected; }));
});
await check('Dedicated drag handle requires movement threshold and keeps its position through state and AI changes', async () => {
  await scopedPage.evaluate(() => window.ImpactCN.resetPosition());
  const handle = scopedPage.locator('[data-impact-cn-drag-handle],.impact-cn-drag-handle');
  assert.equal(await handle.count(), 1);
  const assistant = scopedPage.locator('#impact-cn-assistant');
  const start = await assistant.boundingBox(); const grip = await handle.boundingBox();
  await scopedPage.mouse.move(grip.x + grip.width / 2, grip.y + grip.height / 2); await scopedPage.mouse.down();
  await scopedPage.mouse.move(grip.x + grip.width / 2 - 3, grip.y + grip.height / 2 - 2); await scopedPage.mouse.up();
  const shortMove = await assistant.boundingBox(); assert(Math.abs(shortMove.x - start.x) <= 1 && Math.abs(shortMove.y - start.y) <= 1);
  const panelWasHidden = await scopedPage.locator('#impact-cn-assistant-panel').isHidden();
  const freshGrip = await handle.boundingBox();
  const direction = start.x > 720 ? -1 : 1;
  await scopedPage.mouse.move(freshGrip.x + freshGrip.width / 2, freshGrip.y + freshGrip.height / 2); await scopedPage.mouse.down();
  await scopedPage.mouse.move(freshGrip.x + freshGrip.width / 2 + direction * 260, freshGrip.y + freshGrip.height / 2 - 160, { steps: 12 }); await scopedPage.mouse.up();
  const dragged = await assistant.boundingBox(); assert(Math.abs(dragged.x - start.x) >= 100 && Math.abs(dragged.y - start.y) >= 50);
  assert.equal(await scopedPage.locator('#impact-cn-assistant-panel').isHidden(), panelWasHidden);
  await scopedPage.evaluate(async () => { await window.ImpactCN.setEnabled(false); await window.ImpactCN.setAIEnabled(false); await window.ImpactCN.setEnabled(true); await window.ImpactCN.setAIEnabled(true); document.querySelector('#ask-impact-shadow-host').style.display = 'none'; window.ImpactCN.refresh(); });
  await scopedPage.waitForTimeout(1100);
  const afterState = await assistant.boundingBox(); assert(Math.abs(afterState.x - dragged.x) <= 1 && Math.abs(afterState.y - dragged.y) <= 1);
  await scopedPage.evaluate(() => { document.querySelector('#ask-impact-shadow-host').style.display = ''; window.ImpactCN.refresh(); });
  await scopedPage.waitForTimeout(1100);
  const afterAI = await assistant.boundingBox(); assert(Math.abs(afterAI.x - dragged.x) <= 1 && Math.abs(afterAI.y - dragged.y) <= 1);
});
await check('Dragged assistant is clamped after resize and resetPosition restores the default 140px bottom', async () => {
  await scopedPage.setViewportSize({ width: 320, height: 280 });
  await scopedPage.waitForTimeout(100);
  const small = await scopedPage.locator('#impact-cn-assistant').boundingBox();
  assert(small.x >= -1 && small.y >= -1 && small.x + small.width <= 321 && small.y + small.height <= 281);
  await scopedPage.setViewportSize({ width: 1440, height: 1000 });
  await scopedPage.evaluate(() => window.ImpactCN.resetPosition());
  const reset = await scopedPage.locator('#impact-cn-assistant').boundingBox();
  assert(Math.abs(1000 - reset.y - reset.height - 140) <= 2);
});
await check('Native path scope restores all translations outside advertiser page', async () => {
  await scopedPage.evaluate(() => { history.pushState({}, '', '/login.user'); window.ImpactCN.refresh(); });
  assert(await scopedPage.evaluate(() => window.__actualDictionaryUnit.every(entry => entry.textNode.nodeValue === entry.source)));
  assert.equal(await scopedPage.locator('button[data-impact-cn-help]').count(), 0);
});
await browser.close();
if (onlyFilter) {
  const prior = JSON.parse(readFileSync(path.join(root, 'artifacts/shadow-unit-report.json'), 'utf8'));
  assert.equal(prior.dictionaryVersion, actualDictionary.version, 'A partial recheck requires an existing report for the same version');
  const fresh = [...results];
  const previous = prior.results.map(result => /^All \d+ actual native-dictionary entries/u.test(result.name) ? { ...result, name: `All ${nativeEntries.length} actual native-dictionary entries translate only inside verified components` } : result);
  results.splice(0, results.length, ...previous.map(result => fresh.find(item => item.name === result.name) || result));
  for (const result of fresh) if (!results.some(item => item.name === result.name)) results.push(result);
}
const status = results.some(r => r.status === 'FAIL') ? 'FAIL' : 'PASS';
mkdirSync(path.join(root, 'artifacts'), { recursive: true });
writeFileSync(path.join(root, 'artifacts/shadow-unit-report.json'), JSON.stringify({ mode: 'SYNTHETIC_UNIT_ONLY', realSiteAcceptance: false, dictionaryVersion: actualDictionary.version, dictionaryEntries: actualDictionary.entries.length, nativeEntries: nativeEntries.length, lastPartialRecheck: onlyFilter || null, status, results }, null, 2));
writeFileSync(path.join(root, 'unit-test-report.md'), `# 合成 DOM 单元回归报告\n\n版本：${actualDictionary.version}\n\n结果：**${status} ${results.filter(r => r.status === 'PASS').length}/${results.length}**\n\n模式：SYNTHETIC_UNIT_ONLY；真实词典共 ${actualDictionary.entries.length} 条，其中已核实 Dashboard/导航适配 ${nativeEntries.length} 条。使用隔离的合成页面检验机制，不构成 demo.impact.com 实网验收，也未模拟 AI 答复作为实际 AI 证据。\n\n${results.map(r => `- **${r.status}** ${r.name}${r.evidence ? ': ' + r.evidence : ''}`).join('\n')}\n\n实网结果独立记录于 live-test-report.md。旧 test-report.md 为历史 v0.1 本地 fixture 记录。\n`);
console.log(`SYNTHETIC UNIT ${status}: ${results.filter(r => r.status === 'PASS').length}/${results.length}; this is not real-site acceptance`);
process.exitCode = status === 'PASS' ? 0 : 1;

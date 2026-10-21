/** Actual current MV3 on routed synthetic finance iframes; no real site acceptance. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync, mkdirSync, mkdtempSync, cpSync, rmSync, existsSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);
assert(args.length === 2 && args[0] === '--report-dir' && args[1], 'Usage: node tests/finance-menu-mv3-regression.mjs --report-dir DIRECTORY');
const reportFolder = path.resolve(root, args[1]);
const reportFile = path.join(reportFolder, 'finance-menu-mv3-report.json');
assert(!existsSync(reportFile), 'Refusing to overwrite an existing finance-menu-mv3-report.json; choose a new report directory');
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core'))); }

const sourceFolder = path.join(root, 'impact-cn-mod');
const shippedFiles = readdirSync(sourceFolder, { recursive: true, withFileTypes: true })
  .filter(entry => entry.isFile() && entry.name !== '.DS_Store')
  .map(entry => path.relative(sourceFolder, path.join(entry.parentPath, entry.name))).sort();
const shippedBytes = new Map(shippedFiles.map(file => [file, readFileSync(path.join(sourceFolder, file))]));
const assetSHA256 = Object.fromEntries([...shippedBytes].map(([file, bytes]) => [file, createHash('sha256').update(bytes).digest('hex')]));
const sandbox = {}; vm.createContext(sandbox); vm.runInContext(shippedBytes.get('dict.js').toString('utf8'), sandbox);
const dictionary = sandbox.IMPACT_CN_DICTIONARY;
const manifest = JSON.parse(shippedBytes.get('manifest.json').toString('utf8'));
const packageVersion = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')).version;
const definitions = [
  { id: 'billing-groups', bodyPath: '/secure/finance/app/billing-groups-view.ihtml', topPath: '/secure/advertiser/finance/fr/billing-groups.ihtml', slugs: ['edit', 'partner-fees-document-settings', 'impact-com-fees-document-settings'], sources: ['Edit', 'Partner Fees Document Settings', 'impact.com Fees Document Settings'], targets: ['编辑', '伙伴费用文档设置', 'impact.com费用文档设置'] },
  { id: 'funding-accounts', bodyPath: '/secure/finance/app/list-digital-wallets-flow.ihtml', topPath: '/secure/advertiser/finance/fr/funding-accounts.ihtml', slugs: ['edit', 'funding-account-document-settings'], sources: ['Edit', 'Funding Account Document Settings'], targets: ['编辑', '资金账户文档设置'] }
].map(definition => ({ ...definition, entries: definition.slugs.map(slug => dictionary.entries.find(entry => entry.id === `finance-${definition.id}-actions-${slug}-observed`)) }));
const temporaryFolder = mkdtempSync(path.join(os.tmpdir(), 'impact-finance-menu-mv3-'));
const extensionFolder = path.join(temporaryFolder, 'extension');
cpSync(sourceFolder, extensionFolder, { recursive: true });
const documents = new Map();
const results = [];
let context;
let loadedMV3 = false;

async function check(name, action) {
  try { results.push({ name, status: 'PASS', evidence: await action() }); console.log(`FINANCE MENU MV3 PASS ${name}`); }
  catch (error) { results.push({ name, status: 'FAIL', evidence: error.message }); console.log(`FINANCE MENU MV3 FAIL ${name}: ${error.message}`); }
}

function urlFor(host, pathname, query = {}) {
  const url = new URL(`https://${host}${pathname}`);
  for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value);
  return url.href;
}

function menuDocument(definition, { variant = 'observed', shadowHost = null } = {}) {
  const entries = definition.entries;
  const order = variant === 'wrong-nth' ? [...entries.slice(1), entries[0]] : entries;
  const options = order.map(entry => {
    const index = entries.indexOf(entry), text = `<span id="label-${index + 1}" data-testid="fixed-native-menu-label">${entry.source}</span>`;
    const owner = definition.id === 'billing-groups'
      ? `<span><${variant === 'wrong-owner-chain' ? 'fixture-label' : 'regular-text'}>${text}</${variant === 'wrong-owner-chain' ? 'fixture-label' : 'regular-text'}></span>`
      : `<span>${variant === 'wrong-owner-chain' ? `<strong>${text}</strong>` : text}</span>`;
    return `<li role="${variant === 'wrong-option-role' ? 'menuitem' : 'option'}" data-native-option="${index + 1}"><div>${owner}</div></li>`;
  }).join('');
  const list = `<ul class="iui-component ${variant === 'wrong-list-class' ? 'fixture-list' : 'iui-list'}" role="${variant === 'wrong-list-role' ? 'menu' : 'listbox'}">${options}</ul>`;
  const popup = `<div id="native-popup" data-native-root class="iui-component ${variant === 'wrong-popup-class' ? 'fixture-dropdown' : 'iui-dropdown'} ${variant === 'wrong-menu-component' ? 'fixture-menu' : 'in-btn-menu'} ${variant === 'wrong-row-component' ? 'fixture-row' : 'row-action-dropdown'}"><div><div>${variant === 'wrong-list-hierarchy' ? `<section>${list}</section>` : list}</div></div></div>`;
  const privateDOM = `<table id="business-table" data-native-root><tbody><tr>${entries.map((entry, index) => `<td data-business-cell="${index + 1}">${entry.source}</td>`).join('')}<td data-business-cell="money">$2,450.67</td><td data-business-cell="date">2026-10-11</td><td data-business-cell="id">fixture-business-101</td></tr></tbody></table><form id="business-form" data-native-root><input id="business-input" value="Edit" data-testid="fixture-native-input"><button type="submit">Fixture submit</button></form><a id="business-link" data-native-root href="#fixture-native-link" data-testid="fixture-native-link">Edit</a>`;
  const menu = variant === 'non-body-popup' ? `<section id="fixture-popup-wrapper" data-native-root>${popup}</section>` : popup;
  const proof = `<script>
  const nativeRoot=${shadowHost ? 'document.querySelector("#fixture-shadow-host").attachShadow({mode:"open"})' : 'document'};
  ${shadowHost ? `const shadowBody=document.createElement('body');shadowBody.innerHTML=${JSON.stringify(menu + privateDOM)};nativeRoot.append(shadowBody);` : ''}
  const nativeRoots=[...nativeRoot.querySelectorAll('[data-native-root]')];
  const nativeElements=[...new Set(nativeRoots.flatMap(element=>[element,...element.querySelectorAll('*')]))];
  const labels=${JSON.stringify(entries.map((entry, index) => ({ id: `label-${index + 1}`, entryId: entry.id, source: entry.source })))}.map(saved=>{const element=nativeRoot.querySelector('#'+saved.id);return{...saved,element,node:element.firstChild}});
  const texts=[];for(const native of nativeRoots){const walker=document.createTreeWalker(native,NodeFilter.SHOW_TEXT);while(walker.nextNode())texts.push({node:walker.currentNode,source:walker.currentNode.nodeValue});}
  window.__financeMenuProof={root:nativeRoot,labels,elements:nativeElements.map(element=>({element,parent:element.parentNode,root:element.getRootNode(),children:[...element.childNodes],attributes:[...element.attributes].map(attribute=>[attribute.name,attribute.value])})),texts,inputs:[...nativeRoot.querySelectorAll('input')].map(element=>({element,value:element.value})),links:[...nativeRoot.querySelectorAll('a')].map(element=>({element,href:element.href})),clicks:Object.fromEntries(labels.map(label=>[label.entryId,0])),trustedClicks:Object.fromEntries(labels.map(label=>[label.entryId,0])),linkClicks:0,trustedLinkClicks:0,submits:0};
  for(const label of labels)label.element.addEventListener('click',event=>{window.__financeMenuProof.clicks[label.entryId]++;if(event.isTrusted)window.__financeMenuProof.trustedClicks[label.entryId]++;});
  nativeRoot.querySelector('#business-form').addEventListener('submit',event=>{event.preventDefault();window.__financeMenuProof.submits++;});
  nativeRoot.querySelector('#business-link').addEventListener('click',event=>{event.preventDefault();window.__financeMenuProof.linkClicks++;if(event.isTrusted)window.__financeMenuProof.trustedLinkClicks++;});
  </script>`;
  return `<!doctype html><html><body>${shadowHost ? `<${shadowHost} id="fixture-shadow-host"></${shadowHost}>` : menu + privateDOM}${proof}</body></html>`;
}

async function assertIdentity(frame, expected) {
  const evidence = await frame.evaluate(expected => {
    const proof = window.__financeMenuProof;
    const elementsPreserved = proof.elements.every(saved => saved.element.isConnected && saved.element.parentNode === saved.parent && saved.element.getRootNode() === saved.root && saved.element.childNodes.length === saved.children.length && saved.children.every((node, index) => saved.element.childNodes[index] === node) && JSON.stringify([...saved.element.attributes].map(attribute => [attribute.name, attribute.value])) === JSON.stringify(saved.attributes));
    const labelNodesPreserved = proof.labels.every(saved => saved.element.isConnected && saved.element.firstChild === saved.node && saved.node.nodeValue === expected[saved.entryId]);
    const privateTextsPreserved = proof.texts.every(saved => proof.labels.some(label => label.node === saved.node) || saved.node.isConnected && saved.node.nodeValue === saved.source);
    return { elementsPreserved, labelNodesPreserved, privateTextsPreserved, inputValuesPreserved: proof.inputs.every(saved => saved.element.isConnected && saved.element.value === saved.value), linksPreserved: proof.links.every(saved => saved.element.isConnected && saved.element.href === saved.href), elementCount: proof.elements.length, textNodeCount: new Set(proof.texts.map(saved => saved.node)).size, inputCount: proof.inputs.length, linkCount: proof.links.length, inlineHelpCount: proof.root.querySelectorAll('[data-impact-cn-help]').length, submits: proof.submits };
  }, expected);
  assert(evidence.elementsPreserved && evidence.labelNodesPreserved && evidence.privateTextsPreserved && evidence.inputValuesPreserved && evidence.linksPreserved, 'Native elements, Text identities, hierarchy, attributes, business values, input or links changed');
  assert.equal(evidence.inlineHelpCount, 0, 'Fixed Actions labels must not create complex-concept question buttons');
  assert.equal(evidence.submits, 0, 'Synthetic native form must not be submitted');
  return evidence;
}

try {
  await check('Current full dictionary and MV3 assets are copied unchanged with matching release versions', () => {
    assert.match(packageVersion, /^\d+\.\d+\.\d+$/u);
    assert.equal(dictionary.version, packageVersion); assert.equal(manifest.version, packageVersion);
    assert(dictionary.entries.length > 0); assert(dictionary.helpTopics.length > 0);
    assert.equal(new Set(dictionary.entries.map(entry => entry.id)).size, dictionary.entries.length);
    assert.equal(new Set(dictionary.helpTopics.map(topic => topic.id)).size, dictionary.helpTopics.length);
    assert.equal(manifest.manifest_version, 3); assert.deepEqual(manifest.permissions, ['storage']);
    assert(manifest.content_scripts.every(script => script.all_frames === true));
    for (const definition of definitions) for (const [index, entry] of definition.entries.entries()) {
      assert(entry, 'Observed menu entry is missing'); assert.equal(entry.source, definition.sources[index]); assert.equal(entry.target, definition.targets[index]);
      assert.equal(entry.stage, 'native-finance'); assert.equal(entry.helpTopicId, undefined);
      assert(!dictionary.helpTopics.some(topic => topic.entryIds?.includes(entry.id)), 'Menu entry unexpectedly has an inline-help topic');
    }
    for (const [file, bytes] of shippedBytes) assert(readFileSync(path.join(extensionFolder, file)).equals(bytes), `${file} temporary copy differs`);
    return { actualUnpackedMV3: true, version: packageVersion, dictionaryEntries: dictionary.entries.length, topics: dictionary.helpTopics.length, menuEntries: definitions.reduce((count, definition) => count + definition.entries.length, 0) };
  });
  context = await chromium.launchPersistentContext(path.join(temporaryFolder, 'profile'), {
    executablePath: chromium.executablePath(), channel: 'chromium', headless: true,
    viewport: { width: 1400, height: 1000 },
    args: [`--disable-extensions-except=${extensionFolder}`, `--load-extension=${extensionFolder}`]
  });
  await context.addInitScript(() => {
    window.__financeMenuRuntimeState = null;
    document.addEventListener('impact-cn:state', event => {
      const state = event.detail;
      if (state && typeof state.version === 'string') window.__financeMenuRuntimeState = { version: state.version, enabled: state.enabled, aiEnabled: state.aiEnabled, inlineHelpCount: state.inlineHelpCount, destroyed: state.destroyed === true };
    });
  });
  await context.route(/^https?:\/\//u, route => {
    const body = documents.get(route.request().url());
    return body ? route.fulfill({ contentType: 'text/html', headers: { 'cache-control': 'no-store' }, body }) : route.abort();
  });
  const page = context.pages()[0] || await context.newPage(); page.setDefaultTimeout(7000);
  const bootstrapURL = urlFor('demo.impact.com', definitions[0].topPath, { u: definitions[0].bodyPath });
  documents.set(bootstrapURL, '<!doctype html><body><div id="fixture-bootstrap"></div></body>');
  await page.goto(bootstrapURL); await page.locator('#impact-cn-assistant').waitFor();
  const worker = context.serviceWorkers().find(item => item.url().startsWith('chrome-extension://')) || await context.waitForEvent('serviceworker', { timeout: 10000 });
  const extensionId = new URL(worker.url()).hostname;
  const popup = await context.newPage(); await popup.goto(`chrome-extension://${extensionId}/popup.html`);
  assert.equal(await popup.evaluate(() => chrome.runtime.getManifest().version), dictionary.version, 'Loaded extension manifest version differs from current source');
  await page.waitForFunction(version => window.__financeMenuRuntimeState?.version === version, dictionary.version);
  loadedMV3 = true;
  const setToggles = async (enabled, aiEnabled = true) => {
    await popup.evaluate(({ enabled, aiEnabled }) => chrome.storage.local.set({ impactCNEnabled: enabled, impactCNAIEnabled: aiEnabled }), { enabled, aiEnabled });
    if (['demo.impact.com', 'app.impact.com'].includes(new URL(page.url()).hostname)) await page.waitForFunction(({ enabled, aiEnabled }) => document.querySelector('#impact-cn-assistant')?.dataset.enabled === String(enabled) && document.querySelector('#impact-cn-assistant')?.dataset.aiEnabled === String(aiEnabled), { enabled, aiEnabled });
  };
  const openFixture = async (definition, variant = {}) => {
    const host = variant.host || 'demo.impact.com';
    const frameURL = urlFor(host, variant.bodyPath || definition.bodyPath);
    let topURL = urlFor(host, variant.topPath || definition.topPath, variant.query === undefined ? { u: definition.bodyPath } : variant.query);
    if (variant.duplicateU) topURL += `&u=${encodeURIComponent(variant.duplicateU)}`;
    documents.set(frameURL, menuDocument(definition, variant));
    documents.set(topURL, `<!doctype html><body><iframe id="native-finance-frame" src="${topURL === frameURL ? frameURL + '?fixture-body=1' : frameURL}" style="width:1150px;height:700px;border:0"></iframe></body>`);
    if (topURL === frameURL) documents.set(frameURL + '?fixture-body=1', menuDocument(definition, variant));
    await page.goto(topURL);
    if (['demo.impact.com', 'app.impact.com'].includes(host)) await page.locator('#impact-cn-assistant').waitFor();
    const expectedFrameURL = topURL === frameURL ? frameURL + '?fixture-body=1' : frameURL;
    const frameLocator = page.locator('#native-finance-frame').contentFrame();
    await frameLocator.locator('#label-1').waitFor();
    const frames = page.frames().filter(frame => frame.url() === expectedFrameURL); assert.equal(frames.length, 1);
    const frame = frames[0]; await frame.waitForFunction(() => Boolean(window.__financeMenuProof));
    assert.equal(await frame.evaluate(() => Boolean(globalThis.ImpactCN)), false, 'Child must use the actual isolated MV3 engine');
    assert.equal(await frameLocator.locator('#impact-cn-assistant').count(), 0, 'Child must not create the top-level assistant');
    if (['demo.impact.com', 'app.impact.com'].includes(host)) await frame.waitForFunction(version => window.__financeMenuRuntimeState?.version === version, dictionary.version);
    await page.waitForTimeout(250);
    if (!['demo.impact.com', 'app.impact.com'].includes(host)) assert.equal(await frame.evaluate(() => window.__financeMenuRuntimeState), null, 'Unsupported host unexpectedly received the Impact engine');
    return frame;
  };
  const expectedFor = (definition, translated) => Object.fromEntries(definition.entries.map(entry => [entry.id, translated ? entry.target : entry.source]));
  const waitLabels = async (frame, expected) => frame.waitForFunction(expected => window.__financeMenuProof.labels.every(saved => saved.node.nodeValue === expected[saved.entryId]), expected);
  const assertEvents = async (frame, definition) => {
    for (const [index] of definition.entries.entries()) await frame.locator(`#label-${index + 1}`).click();
    await frame.locator('#business-link').click();
    const counts = await frame.evaluate(() => { const proof = window.__financeMenuProof; return { clicks: proof.clicks, trustedClicks: proof.trustedClicks, linkClicks: proof.linkClicks, trustedLinkClicks: proof.trustedLinkClicks, submits: proof.submits }; });
    for (const entry of definition.entries) { assert.equal(counts.clicks[entry.id], 1); assert.equal(counts.trustedClicks[entry.id], 1); }
    assert.equal(counts.linkClicks, 1); assert.equal(counts.trustedLinkClicks, 1); assert.equal(counts.submits, 0);
    return counts;
  };
  for (const definition of definitions) {
    await check(`${definition.id}: actual menu labels preserve identity and events through OFF→ON→OFF on demo/app`, async () => {
      const evidence = [];
      for (const host of ['demo.impact.com', 'app.impact.com']) {
        await setToggles(false, true);
        const frame = await openFixture(definition, { host });
        await waitLabels(frame, expectedFor(definition, false)); await assertIdentity(frame, expectedFor(definition, false));
        await setToggles(true, true); await waitLabels(frame, expectedFor(definition, true));
        const identity = await assertIdentity(frame, expectedFor(definition, true));
        const events = await assertEvents(frame, definition); await assertIdentity(frame, expectedFor(definition, true));
        await setToggles(false, true); await waitLabels(frame, expectedFor(definition, false)); await assertIdentity(frame, expectedFor(definition, false));
        evidence.push({ host, labelCount: definition.entries.length, identity, events, cycle: ['OFF', 'ON', 'OFF'], aiEnabled: true });
      }
      return evidence;
    });
    await check(`${definition.id}: exact document/top/host and unique u scope rejects unrelated contexts`, async () => {
      const variants = [
        { name: 'wrong-body', bodyPath: '/secure/finance/app/fixture-unrelated-view.ihtml' },
        { name: 'body-suffix', bodyPath: definition.bodyPath + '-suffix' },
        { name: 'wrong-top', topPath: '/secure/advertiser/finance/fr/fixture-unrelated.ihtml' },
        { name: 'top-suffix', topPath: definition.topPath + '-suffix' },
        { name: 'missing-u', query: {} },
        { name: 'wrong-u', query: { u: '/secure/finance/app/fixture-other.ihtml' } },
        { name: 'duplicate-correct-u', duplicateU: definition.bodyPath },
        { name: 'duplicate-wrong-u', duplicateU: '/secure/finance/app/fixture-other.ihtml' },
        { name: 'unsupported-host', host: 'fixtures.example.invalid' }
      ];
      for (const variant of variants) {
        await setToggles(true, true); const frame = await openFixture(definition, variant);
        await assertIdentity(frame, expectedFor(definition, false)); await assertEvents(frame, definition); await assertIdentity(frame, expectedFor(definition, false));
      }
      return { cases: variants.map(variant => variant.name), allFixedTextAndPrivateIdentityPreserved: true, nativeEventsPreserved: true };
    });
    await check(`${definition.id}: portal hierarchy, component, roles, actual owner chain and nth reject lookalikes`, async () => {
      const variants = ['wrong-popup-class', 'wrong-menu-component', 'wrong-row-component', 'wrong-list-class', 'wrong-list-role', 'wrong-option-role', 'wrong-list-hierarchy', 'non-body-popup', 'wrong-owner-chain', 'wrong-nth'];
      for (const variant of variants) {
        await setToggles(true, true); const frame = await openFixture(definition, { variant });
        for (const entry of definition.entries) assert.equal(await frame.locator(entry.scope.selector).count(), variant === 'wrong-nth' ? 1 : 0, 'Negative fixture unexpectedly satisfies the component selector');
        await assertIdentity(frame, expectedFor(definition, false)); await assertEvents(frame, definition); await assertIdentity(frame, expectedFor(definition, false));
      }
      return { cases: variants, allFixedTextAndPrivateIdentityPreserved: true, nativeEventsPreserved: true };
    });
    await check(`${definition.id}: lightDOMOnly rejects matching menu chains in open Shadow roots`, async () => {
      for (const shadowHost of ['impact-style-isolator', 'fixture-shadow-host']) {
        await setToggles(true, true); const frame = await openFixture(definition, { shadowHost });
        const matchCounts = await frame.evaluate(selectors => selectors.map(selector => window.__financeMenuProof.root.querySelectorAll(selector).length), definition.entries.map(entry => entry.scope.selector));
        assert(matchCounts.every(count => count === 1), 'Shadow negative must retain otherwise matching component selectors');
        await assertIdentity(frame, expectedFor(definition, false)); await assertEvents(frame, definition); await assertIdentity(frame, expectedFor(definition, false));
      }
      return { shadowHosts: ['impact-style-isolator', 'fixture-shadow-host'], matchingComponentScopeRejectedByLightDOM: true, nativeEventsPreserved: true };
    });
  }
  await check('All shipped test-loaded assets remain identical to current source', () => {
    for (const [file, bytes] of shippedBytes) {
      assert(readFileSync(path.join(extensionFolder, file)).equals(bytes), `${file} temporary copy changed`);
      assert(readFileSync(path.join(sourceFolder, file)).equals(bytes), `${file} source changed while checks were running`);
    }
    return { dictionaryAndRuntimeUnchanged: true };
  });
} catch (error) {
  results.push({ name: 'Synthetic MV3 setup', status: 'FAIL', evidence: error.message });
} finally {
  if (context) await context.close();
  const unchangedAssets = Object.fromEntries([...shippedBytes].map(([file, bytes]) => [file, readFileSync(path.join(extensionFolder, file)).equals(bytes) && readFileSync(path.join(sourceFolder, file)).equals(bytes)]));
  rmSync(temporaryFolder, { recursive: true, force: true });
  const status = results.length > 0 && results.every(result => result.status === 'PASS') ? 'PASS' : 'FAIL';
  mkdirSync(reportFolder, { recursive: true });
  assert(!existsSync(reportFile), 'Refusing to overwrite a report created during this run');
  writeFileSync(reportFile, JSON.stringify({
    status, mode: 'SYNTHETIC_CURRENT_SHIPPED_FINANCE_MENUS_MV3', date: new Date().toISOString(),
    version: dictionary.version, dictionaryEntries: dictionary.entries.length, entryIds: definitions.flatMap(definition => definition.entries.map(entry => entry?.id)),
    actualUnpackedMV3: loadedMV3, unchangedShippedDictionary: unchangedAssets['dict.js'], unchangedShippedAdapter: unchangedAssets['site-config.js'], unchangedShippedEngine: unchangedAssets['content.js'], unchangedAssets,
    realSiteAcceptance: false, realNetworkQueries: false, userBrowserOperated: false, credentialsSaved: false, fullConversationSaved: false,
    financialOperations: 0, settingsSaved: 0, assetSHA256, passed: results.filter(result => result.status === 'PASS').length, total: results.length, results
  }, null, 2));
  process.exitCode = status === 'PASS' ? 0 : 1;
}

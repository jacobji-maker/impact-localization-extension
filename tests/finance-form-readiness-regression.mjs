/** Synthetic delayed-form fixtures exercise the actual read-only capture readiness helper. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inspectAddPaymentMethodReadiness, waitForAddPaymentMethodReadiness, validateCurrentPaymentMethodFormRequest, inspectCurrentPaymentMethodDescriptionStructure, runExtraCapture, browserCapture } from '../scripts/finance-extra-capture.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core'))); }
const moduleFile = path.join(root, 'scripts/finance-extra-capture.mjs');
const moduleBytes = readFileSync(moduleFile);
const collectorFile = path.join(root, 'scripts/finance-session.mjs');
const collectorBytes = readFileSync(collectorFile);
const reportFolder = path.join(root, 'artifacts/finance-phase1-20261010T083045525902Z');
const formPath = '/secure/advertiser/finance/fr/payment-method/new/ui.ihtml';
const formURL = 'https://demo.impact.com' + formPath;
const cardLabels = ['Cardholder Name', 'Card Number', 'Expiration Date\n (MM/YY)', 'CVV\n (3 digits)'];
const cardFrameIds = ['braintree-hosted-field-cardholderName', 'braintree-hosted-field-number', 'braintree-hosted-field-expirationDate', 'braintree-hosted-field-cvv'];
const cardShell = '<h1 class="title">Add Payment Method</h1><label>Name<input></label><section id="details-section"><div class="header"><h2 class="title">Credit Card Details</h2></div><div id="card-fields"></div></section>';
const fixedCreditCardDescription = 'Draw from your credit card account. A handling charge will be charged per $100 (or part thereof) deposited.';
const results = [];
let browser, page;

async function check(name, run) {
  try { await run(); results.push({ name, status: 'PASS' }); console.log(`FINANCE FORM READINESS PASS ${name}`); }
  catch (error) { results.push({ name, status: 'FAIL', evidence: error.message }); console.log(`FINANCE FORM READINESS FAIL ${name}: ${error.message}`); }
}

async function fixture(html, url = formURL, guardValueReads = true) {
  await page.goto(url);
  await page.setContent(`<!doctype html><body>${html}</body>`);
  await page.evaluate(guardValueReads => {
    window.__formReadinessProof = { clicks: 0, submits: 0, valueReads: 0, frameDocumentReads: 0, originals: [...document.querySelectorAll('*')].map(element => ({ element, parent: element.parentNode, children: [...element.childNodes], attributes: [...element.attributes].map(attribute => [attribute.name, attribute.value]) })) };
    document.addEventListener('click', () => window.__formReadinessProof.clicks++, true);
    document.addEventListener('submit', event => { window.__formReadinessProof.submits++; event.preventDefault(); }, true);
    if (guardValueReads) for (const prototype of [HTMLInputElement.prototype, HTMLTextAreaElement.prototype, HTMLSelectElement.prototype]) {
      const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
      Object.defineProperty(prototype, 'value', { ...descriptor, get() { window.__formReadinessProof.valueReads++; throw new Error('Readiness must not read field values'); } });
    }
    for (const property of ['contentDocument', 'contentWindow']) {
      const descriptor = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, property);
      Object.defineProperty(HTMLIFrameElement.prototype, property, { ...descriptor, get() { window.__formReadinessProof.frameDocumentReads++; throw new Error('Readiness must not read iframe documents'); } });
    }
  }, guardValueReads);
}

async function untouched() {
  const proof = await page.evaluate(() => ({ clicks: window.__formReadinessProof.clicks, submits: window.__formReadinessProof.submits, valueReads: window.__formReadinessProof.valueReads, frameDocumentReads: window.__formReadinessProof.frameDocumentReads, originalsRetained: window.__formReadinessProof.originals.every(record => record.element.parentNode === record.parent && record.children.length === record.element.childNodes.length && record.children.every((node, index) => record.element.childNodes[index] === node) && JSON.stringify([...record.element.attributes].map(attribute => [attribute.name, attribute.value])) === JSON.stringify(record.attributes)) }));
  assert.deepEqual(proof, { clicks: 0, submits: 0, valueReads: 0, frameDocumentReads: 0, originalsRetained: true });
}

try {
  browser = await chromium.launch({ headless: true, executablePath: chromium.executablePath() });
  const context = await browser.newContext();
  await context.route('https://*.impact.com/**', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><body></body>' }));
  page = await context.newPage();

  await check('Delayed form heading and native field must arrive after navigation shell', async () => {
    await fixture('<nav>Fixture navigation</nav><main id="form"></main>');
    const initial = await page.evaluate(inspectAddPaymentMethodReadiness);
    assert.equal(initial.expectedPathMatched, true); assert.equal(initial.ready, false);
    await page.evaluate(() => setTimeout(() => { const heading = document.createElement('h1'); heading.className = 'title'; heading.append(document.createTextNode('Add Payment Method')); const field = document.createElement('input'); field.type = 'text'; document.querySelector('main').append(heading, field); }, 250));
    const evidence = await waitForAddPaymentMethodReadiness(page, { timeoutMs: 2000 });
    assert.equal(evidence.ready, true); assert.equal(evidence.headingCount, 1); assert.equal(evidence.fixedHeadingCount, 1); assert.equal(evidence.nativeFieldCount, 1); assert.equal(evidence.fieldValuesRead, false);
    // The fixture alone appended the delayed form; readiness must leave its nodes and properties intact.
    const proof = await page.evaluate(() => ({ clicks: window.__formReadinessProof.clicks, submits: window.__formReadinessProof.submits, valueReads: window.__formReadinessProof.valueReads }));
    assert.deepEqual(proof, { clicks: 0, submits: 0, valueReads: 0 });
  });

  await check('A correct heading alone cannot finish before the delayed native field', async () => {
    await fixture('<main><h1 class="title">Add Payment Method</h1></main>');
    assert.equal((await page.evaluate(inspectAddPaymentMethodReadiness)).ready, false);
    await page.evaluate(() => setTimeout(() => { const field = document.createElement('input'); field.type = 'text'; document.querySelector('main').append(field); }, 250));
    const evidence = await waitForAddPaymentMethodReadiness(page, { timeoutMs: 2000 });
    assert.equal(evidence.nativeFieldCount, 1); assert.equal(evidence.ready, true);
    assert.equal(await page.evaluate(() => window.__formReadinessProof.valueReads), 0);
  });

  await check('Exact resulting document and authorized origin are required', async () => {
    for (const url of ['https://demo.impact.com/secure/advertiser/finance/fr/payment-methods/ui.ihtml', 'https://demo.impact.com' + formPath + '/extra', 'https://app.impact.com' + formPath]) {
      await fixture('<h1 class="title">Add Payment Method</h1><input>', url);
      const evidence = await page.evaluate(inspectAddPaymentMethodReadiness);
      assert.equal(evidence.expectedPathMatched, false); assert.equal(evidence.ready, false);
      await assert.rejects(() => waitForAddPaymentMethodReadiness(page, { timeoutMs: 180 }), /exact route/);
      await untouched();
    }
  });

  await check('Only one visible heading with the complete observed fixed text is accepted', async () => {
    for (const heading of ['<h1 class="title">Add Payment Method later</h1>', '<h1 class="title">Add Payment</h1>', '<h1>Add Payment Method</h1>', '<h1 class="title" hidden>Add Payment Method</h1>', '<div style="opacity:0"><h1 class="title">Add Payment Method</h1></div>', '<h1 class="title">Add Payment Method</h1><h1 class="title">Other</h1>']) {
      await fixture(heading + '<input>');
      await assert.rejects(() => waitForAddPaymentMethodReadiness(page, { timeoutMs: 180 }), /unique fixed heading/);
      await untouched();
    }
    await fixture('<h1 class="title">Add <span>Payment</span> Method</h1><h1 class="title" hidden>Other</h1><input>');
    assert.equal((await waitForAddPaymentMethodReadiness(page, { timeoutMs: 500 })).ready, true);
    await untouched();
  });

  await check('Navigation, AI, hidden fields and submit controls cannot supply finance form readiness', async () => {
    for (const structure of ['<nav><input></nav>', '<div id="ask-impact-shadow-host"><textarea></textarea></div>', '<div id="impact-cn-assistant"><input></div>', '<input type="hidden">', '<input hidden>', '<input type="submit">', '<input type="checkbox">', '<iframe id="other-field"></iframe>']) {
      await fixture('<h1 class="title">Add Payment Method</h1>' + structure);
      const evidence = await page.evaluate(inspectAddPaymentMethodReadiness);
      assert.equal(evidence.nativeFieldCount + evidence.hostedFieldFrameCount, 0);
      await assert.rejects(() => waitForAddPaymentMethodReadiness(page, { timeoutMs: 180 }), /native field structure/);
      await untouched();
    }
  });

  await check('Observed Braintree hosted iframe structure is accepted without inspecting its document', async () => {
    await fixture('<h1 class="title">Add Payment Method</h1><iframe id="braintree-hosted-field-number" src="about:blank"></iframe>');
    const evidence = await waitForAddPaymentMethodReadiness(page, { timeoutMs: 500 });
    assert.equal(evidence.nativeFieldCount, 0); assert.equal(evidence.hostedFieldFrameCount, 1); assert.equal(evidence.ready, true);
    await untouched();
    await fixture('<h1 class="title">Add Payment Method</h1><iframe id="braintree-hosted-field-number" hidden></iframe>');
    await assert.rejects(() => waitForAddPaymentMethodReadiness(page, { timeoutMs: 180 }), /native field structure/);
    await untouched();
  });

  await check('A visible credit-card section requires all four exact hosted frames and complete local labels', async () => {
    await fixture(cardShell + cardLabels.map(label => `<label>${label}</label>`).join('') + cardFrameIds.map(id => `<iframe id="${id}" src="about:blank"></iframe>`).join(''));
    const evidence = await waitForAddPaymentMethodReadiness(page, { timeoutMs: 500 });
    assert.equal(evidence.nativeFieldCount, 1); assert.equal(evidence.creditCardHeadingCount, 1); assert.equal(evidence.creditCardStructureReady, true);
    assert.deepEqual(evidence.cardFrameCounts, { cardholderName: 1, number: 1, expirationDate: 1, cvv: 1 });
    assert.deepEqual(evidence.cardLabelCounts, { cardholderName: 1, number: 1, expirationDate: 1, cvv: 1 });
    assert.equal(evidence.frameDocumentsRead, false);
    await untouched();
  });

  await check('Native Name cannot bypass missing, hidden, duplicate or incorrectly labelled credit-card hydration', async () => {
    const labels = cardLabels.map(label => `<label>${label}</label>`).join('');
    const frames = cardFrameIds.map(id => `<iframe id="${id}" src="about:blank"></iframe>`).join('');
    const variants = [
      ...cardFrameIds.map(missing => labels + cardFrameIds.filter(id => id !== missing).map(id => `<iframe id="${id}"></iframe>`).join('')),
      ...cardLabels.map(missing => frames + cardLabels.filter(label => label !== missing).map(label => `<label>${label}</label>`).join('')),
      labels + frames.replace('id="braintree-hosted-field-cvv"', 'id="braintree-hosted-field-cvv" hidden'),
      labels.replace('<label>Cardholder Name</label>', '<label hidden>Cardholder Name</label>') + frames,
      labels + frames + '<iframe id="braintree-hosted-field-number"></iframe>',
      labels + frames + '<label>Card Number</label>',
      labels.replace('Card Number</label>', 'Card Number fixture-business-text</label>') + frames,
      labels.replace('Expiration Date\n (MM/YY)', 'Expiration Date') + frames,
      labels + frames + '<h2 class="title">Credit Card Details</h2>'
    ];
    for (const structure of variants) {
      await fixture(cardShell + structure);
      const evidence = await page.evaluate(inspectAddPaymentMethodReadiness);
      assert.equal(evidence.nativeFieldCount, 1); assert.equal(evidence.creditCardStructureReady, false); assert.equal(evidence.ready, false);
      await assert.rejects(() => waitForAddPaymentMethodReadiness(page, { timeoutMs: 180 }), /credit-card hydration/);
      await untouched();
    }
  });

  await check('Credit-card hydration waits for delayed local labels and four iframe elements without entering frames', async () => {
    await fixture(cardShell);
    assert.equal((await page.evaluate(inspectAddPaymentMethodReadiness)).ready, false);
    await page.evaluate(({ labels, ids }) => setTimeout(() => {
      const fields = document.querySelector('#card-fields');
      for (const text of labels) { const label = document.createElement('label'); label.append(document.createTextNode(text)); fields.append(label); }
      for (const id of ids) { const frame = document.createElement('iframe'); frame.id = id; frame.src = 'about:blank'; fields.append(frame); }
    }, 250), { labels: cardLabels, ids: cardFrameIds });
    const evidence = await waitForAddPaymentMethodReadiness(page, { timeoutMs: 2000 });
    assert.equal(evidence.ready, true); assert.equal(evidence.creditCardStructureReady, true);
    assert.deepEqual(await page.evaluate(() => ({ clicks: window.__formReadinessProof.clicks, submits: window.__formReadinessProof.submits, valueReads: window.__formReadinessProof.valueReads, frameDocumentReads: window.__formReadinessProof.frameDocumentReads })), { clicks: 0, submits: 0, valueReads: 0, frameDocumentReads: 0 });
  });

  await check('Bounded timeout returns only readiness counts and never repeats a click or submits', async () => {
    await fixture('<h1 class="title">Add Payment Method</h1><button type="submit">Save card</button>');
    const started = Date.now();
    await assert.rejects(() => waitForAddPaymentMethodReadiness(page, { timeoutMs: 220 }), error => {
      assert.equal(error.safeFinanceAssertion, true); assert.equal(error.financeEvidence.ready, false);
      assert.equal(error.financeEvidence.fieldValuesRead, false);
      assert.equal(error.financeEvidence.frameDocumentsRead, false);
      assert.deepEqual(Object.keys(error.financeEvidence).sort(), ['cardFrameCounts', 'cardLabelCounts', 'creditCardHeadingCount', 'creditCardStructureReady', 'expectedPathMatched', 'fieldValuesRead', 'fixedHeadingCount', 'frameDocumentsRead', 'headingCount', 'hostedFieldFrameCount', 'nativeFieldCount', 'ready'].sort());
      return true;
    });
    assert(Date.now() - started < 1200);
    await untouched();
    assert.deepEqual(readFileSync(moduleFile), moduleBytes);
  });

  await check('Current-form-only capture rejects wrong or ambiguous requests before switches, navigation or file writes', async () => {
    assert.equal(validateCurrentPaymentMethodFormRequest(['payment-methods'], formURL), true);
    for (const ids of [undefined, [], ['overview'], ['payment-methods', 'overview'], ['payment-methods', 'payment-methods'], 'payment-methods']) assert.throws(() => validateCurrentPaymentMethodFormRequest(ids, formURL), /onlyPageIds exactly/);
    for (const url of ['invalid', 'https://app.impact.com' + formPath, 'http://demo.impact.com' + formPath, 'https://demo.impact.com/secure/advertiser/finance/fr/payment-methods/ui.ihtml', formURL + '/extra']) assert.throws(() => validateCurrentPaymentMethodFormRequest(['payment-methods'], url), /exact authorized/);
    let switches = 0, locatorCalls = 0;
    const guardedPage = { url: () => formURL, locator: () => { locatorCalls++; throw new Error('Invalid current-form capture must not inspect controls'); } };
    await assert.rejects(() => runExtraCapture({ page: guardedPage, root: 'never-accessed', routes: [{ id: 'payment-methods' }], onlyPageIds: ['payment-methods', 'overview'], options: { currentPaymentMethodFormOnly: true }, translation: async () => switches++, ai: async () => switches++ }), /onlyPageIds exactly/);
    await assert.rejects(() => runExtraCapture({ page: guardedPage, root: 'never-accessed', routes: [{ id: 'payment-methods' }, { id: 'payment-methods' }], onlyPageIds: ['payment-methods'], options: { currentPaymentMethodFormOnly: true }, translation: async () => switches++, ai: async () => switches++ }), /one observed/);
    assert.equal(switches, 0); assert.equal(locatorCalls, 0);
  });

  await check('Current-form-only reuses the actual collector, performs no navigation or click and restores both switches', async () => {
    const temporaryRoot = mkdtempSync(path.join(os.tmpdir(), 'impact-current-form-capture-'));
    const translationCalls = [], aiCalls = [];
    const originalGoto = page.goto;
    let navigations = 0;
    try {
      mkdirSync(path.join(temporaryRoot, 'scripts')); mkdirSync(path.join(temporaryRoot, 'docs'));
      for (const file of ['finance-session.mjs', 'finance-deep-capture.mjs']) copyFileSync(path.join(root, 'scripts', file), path.join(temporaryRoot, 'scripts', file));
      const route = { id: 'payment-methods', href: '/secure/advertiser/finance/fr/payment-methods/ui.ihtml' };
      const captureFile = path.join(temporaryRoot, 'docs/finance-dom-scan.json');
      writeFileSync(captureFile, JSON.stringify({ pages: [{ ...route, url: 'https://demo.impact.com' + route.href, candidates: [], texts: [], links: [], captures: [], safeActions: [] }] }));
      await fixture(cardShell + cardLabels.map(label => `<label>${label}</label>`).join('') + cardFrameIds.map(id => `<iframe id="${id}"></iframe>`).join('') + '<div id="impact-cn-assistant" data-enabled="false" data-ai-enabled="true"></div><p id="late-fixed">A late fixture instruction for the fixed card form.</p><input value="fixture-private-value"><p id="private-copy">fixture-private-value</p><p class="amount">USD 12.34 fixture amount</p>', formURL, false);
      page.goto = async () => { navigations++; throw new Error('Current-form-only must not navigate'); };
      const output = await runExtraCapture({ page, root: temporaryRoot, routes: [route], onlyPageIds: ['payment-methods'], options: { currentPaymentMethodFormOnly: true }, translation: async enabled => { translationCalls.push(enabled); await page.evaluate(value => { document.querySelector('#impact-cn-assistant').dataset.enabled = String(value); }, enabled); }, ai: async enabled => { aiCalls.push(enabled); await page.evaluate(value => { document.querySelector('#impact-cn-assistant').dataset.aiEnabled = String(value); }, enabled); } });
      assert.equal(output.mode, 'CURRENT_PAYMENT_METHOD_FORM_CAPTURE'); assert.equal(output.topPath, formPath); assert.equal(output.navigations, 0); assert.equal(output.controlClicks, 0); assert.equal(output.submittedForms, 0); assert.equal(output.readiness.creditCardStructureReady, true);
      assert.equal(output.descriptionStructure.mode, 'CURRENT_PAYMENT_METHOD_DESCRIPTION_STRUCTURE_ONLY'); assert.equal(output.descriptionStructure.descriptionElementCount, 0); assert.equal(output.descriptionStructure.textReturned, false);
      assert.deepEqual(translationCalls, [false, false]); assert.deepEqual(aiCalls, [false, true]); assert.equal(navigations, 0);
      const saved = JSON.parse(readFileSync(captureFile, 'utf8')), record = saved.pages[0];
      assert.equal(record.captures.length, 1); assert.equal(record.captures[0].state, 'opened:Add Payment Method'); assert.equal(record.captures[0].currentFormOnly, true); assert.equal(record.captures[0].captureSafety.controlClicks, 0); assert.equal(record.safeActions.length, 0);
      assert.deepEqual(record.captures[0].controlEvidence.descriptionStructure, output.descriptionStructure);
      assert(record.candidates.some(candidate => candidate.source === 'A late fixture instruction for the fixed card form.'));
      const encoded = JSON.stringify(saved); assert.equal(encoded.includes('fixture-private-value'), false); assert.equal(encoded.includes('USD 12.34'), false);
      assert.deepEqual(await page.evaluate(() => ({ clicks: window.__formReadinessProof.clicks, submits: window.__formReadinessProof.submits, frameDocumentReads: window.__formReadinessProof.frameDocumentReads, enabled: document.querySelector('#impact-cn-assistant').dataset.enabled, aiEnabled: document.querySelector('#impact-cn-assistant').dataset.aiEnabled })), { clicks: 0, submits: 0, frameDocumentReads: 0, enabled: 'false', aiEnabled: 'true' });
      assert.deepEqual(readFileSync(moduleFile), moduleBytes);
    } finally { page.goto = originalGoto; rmSync(temporaryRoot, { recursive: true, force: true }); }
  });

  await check('Actual collector preserves the observed fixed $100 credit-card description only in its exact local document element', async () => {
    const collector = browserCapture(root);
    await fixture(`<p id="selector-description">${fixedCreditCardDescription}</p><p id="private-amount">USD 12.34 fixture amount</p><p id="other-currency">Credit card deposit $200.</p>`);
    const captured = await page.evaluate(collector, { route: { id: 'payment-methods' }, frameURL: formURL, framePath: [], knownRoutes: [] });
    assert.deepEqual(captured.texts.map(candidate => candidate.text), [fixedCreditCardDescription]);
    assert.equal(captured.texts[0].selector, '#selector-description'); assert.deepEqual(captured.texts[0].shadowPath, []);
    assert.equal(captured.texts[0].text.includes('$100'), true); assert.equal(captured.texts[0].match, undefined);
    assert.equal(JSON.stringify(captured).includes('USD 12.34'), false); assert.equal(JSON.stringify(captured).includes('$200'), false);
    await untouched();
  });

  await check('Unknown heading Text and heading controls are omitted without business-name hardcoding', async () => {
    const collector = browserCapture(root);
    await fixture('<title>Fixture Unknown Business Title</title>' + [1, 2, 3, 4, 5, 6].map(level => `<h${level}>Fixture Unknown Business Heading ${level}<span>Fixture Nested Business Heading</span><button type="button">Fixture Heading Action</button><a href="https://help.impact.com/brand/actions">Fixture Heading Link</a>${level === 6 ? '<span id="fixture-heading-shadow-host"></span>' : ''}</h${level}>`).join(''));
    assert.equal(await page.title(), 'Fixture Unknown Business Title');
    await page.evaluate(() => {
      const shadow = document.querySelector('#fixture-heading-shadow-host').attachShadow({ mode: 'open' });
      const label = document.createElement('span'); label.append(document.createTextNode('Fixture Shadow Business Heading')); shadow.append(label);
      window.__formReadinessProof.originals.push(...[...shadow.querySelectorAll('*')].map(element => ({ element, parent: element.parentNode, children: [...element.childNodes], attributes: [...element.attributes].map(attribute => [attribute.name, attribute.value]) })));
    });
    const captured = await page.evaluate(collector, { route: { id: 'payment-methods' }, frameURL: formURL, framePath: [], knownRoutes: [] });
    assert.equal(captured.texts.length, 0); assert.equal(captured.affordances.length, 0); assert.equal(captured.links.length, 0); assert.equal(captured.title, '[dynamic title omitted]');
    for (const privateText of ['Fixture Unknown Business', 'Fixture Nested Business', 'Fixture Shadow Business', 'Fixture Heading Action', 'Fixture Heading Link']) assert.equal(JSON.stringify(captured).includes(privateText), false);
    await untouched();
  });

  await check('Observed fixed headings remain capturable only for their observed route and document', async () => {
    const collector = browserCapture(root);
    await fixture('<h1 class="title">Add Payment Method</h1><h2>Name</h2><h2><span>Credit Card Details</span></h2><div class="field-value"><h2>Name</h2></div><div class="table-cell">Fixture Private Business Cell</div>');
    const args = { route: { id: 'payment-methods' }, frameURL: formURL, framePath: [], knownRoutes: [] };
    const captured = await page.evaluate(collector, args);
    assert.deepEqual(captured.texts.map(candidate => candidate.text), ['Add Payment Method', 'Name', 'Credit Card Details']);
    assert.equal(JSON.stringify(captured).includes('Fixture Private Business Cell'), false);
    assert.equal((await page.evaluate(collector, { ...args, route: { id: 'overview' } })).texts.length, 0);
    await untouched();
    await fixture('<h1>Add Payment Method</h1>', 'https://demo.impact.com/secure/advertiser/finance/fr/payment-methods/ui.ihtml');
    assert.equal((await page.evaluate(collector, args)).texts.length, 0);
    await untouched();
  });

  await check('Observed Funding Account heading prefix preserves its fixed fragment and omits the dynamic suffix', async () => {
    const collector = browserCapture(root), overviewURL = 'https://demo.impact.com/secure/finance/app/brand-overview-view.ihtml';
    await fixture('<h5>Funding Account - Fixture Private Currency Code</h5><h6>Fixture Private Funding Account</h6>', overviewURL);
    const captured = await page.evaluate(collector, { route: { id: 'overview' }, frameURL: overviewURL, framePath: [], knownRoutes: [] });
    assert.equal(captured.texts.length, 1); assert.equal(captured.texts[0].text, 'Funding Account -'); assert.equal(captured.texts[0].match, 'prefix'); assert.equal(captured.texts[0].dynamicSuffixSaved, false);
    assert.equal(JSON.stringify(captured).includes('Fixture Private'), false);
    await untouched();
  });

  await check('Native duplicate description IDs select the one exact fixed source rather than the first ID', async () => {
    const collector = browserCapture(root), achDescription = 'ACH draw from your bank account. No processing fees are applicable if this option is selected.';
    for (const sources of [[achDescription, fixedCreditCardDescription], [fixedCreditCardDescription, achDescription]]) {
      await fixture(sources.map(source => `<p id="selector-description">${source}</p>`).join(''));
      const captured = await page.evaluate(collector, { route: { id: 'payment-methods' }, frameURL: formURL, framePath: [], knownRoutes: [] });
      assert.equal(captured.texts.filter(candidate => candidate.text === fixedCreditCardDescription).length, 1); assert.equal(captured.texts.filter(candidate => candidate.text === achDescription).length, 1);
      assert.equal(captured.texts.find(candidate => candidate.text === fixedCreditCardDescription).selector, '#selector-description');
      const diagnostic = await page.evaluate(inspectCurrentPaymentMethodDescriptionStructure);
      assert.equal(diagnostic.descriptionElementCount, 2); assert.equal(diagnostic.descriptionStructures.filter(item => item.elementTextEqualsFixedSource && item.directTextMatchesFixedSourceCount === 1).length, 1);
      await untouched();
    }
  });

  await check('Fixed charge exception rejects changed source, private amounts, other scope, ambiguity and Shadow DOM', async () => {
    const collector = browserCapture(root), args = { route: { id: 'payment-methods' }, frameURL: formURL, framePath: [], knownRoutes: [] };
    const variants = [
      { html: `<p id="selector-description">${fixedCreditCardDescription.replace('$100', '$200')}</p>` },
      { html: `<p id="selector-description">${fixedCreditCardDescription.replace('$100', '$100.01')}</p>` },
      { html: `<p id="selector-description">${fixedCreditCardDescription} Fixture private amount $45.</p>` },
      { html: `<p id="wrong-description">${fixedCreditCardDescription}</p>` },
      { html: `<p id="selector-description"><span>${fixedCreditCardDescription}</span></p>` },
      { html: `<p id="selector-description">${fixedCreditCardDescription}</p><p id="selector-description">${fixedCreditCardDescription}</p>` },
      { html: `<div class="amount"><p id="selector-description">${fixedCreditCardDescription}</p></div>` },
      { html: `<p id="selector-description">${fixedCreditCardDescription}</p>`, routeId: 'overview' },
      { html: `<p id="selector-description">${fixedCreditCardDescription}</p>`, url: 'https://demo.impact.com/secure/advertiser/finance/fr/payment-methods/ui.ihtml' },
      { html: `<p id="selector-description">${fixedCreditCardDescription}</p>`, url: 'https://app.impact.com' + formPath },
      { html: `<p id="selector-description">${fixedCreditCardDescription}</p>`, framePath: [{ parentPath: 'https://demo.impact.com/secure/advertiser/finance/fr/payment-methods/ui.ihtml', framePath: formURL }] }
    ];
    for (const variant of variants) {
      await fixture(variant.html, variant.url || formURL);
      const captured = await page.evaluate(collector, { ...args, route: { id: variant.routeId || 'payment-methods' }, frameURL: variant.url || formURL, framePath: variant.framePath || [] });
      assert.equal(captured.texts.length, 0); await untouched();
    }
    await fixture('<div id="native-fixture-shadow"></div>');
    await page.evaluate(source => { const root = document.querySelector('#native-fixture-shadow').attachShadow({ mode: 'open' }), description = document.createElement('p'); description.id = 'selector-description'; description.append(document.createTextNode(source)); root.append(description); }, fixedCreditCardDescription);
    assert.equal((await page.evaluate(collector, args)).texts.length, 0);
    await fixture(`<iframe id="native-child-fixture" src="${formURL}"></iframe>`);
    const child = page.frames().find(frame => frame !== page.mainFrame() && frame.url() === formURL);
    assert(child); await child.setContent(`<p id="selector-description">${fixedCreditCardDescription}</p>`);
    assert.equal((await child.evaluate(collector, args)).texts.length, 0);
    await fixture(`<p id="selector-description">${fixedCreditCardDescription}</p><input>`, formURL, false);
    await page.evaluate(source => { document.querySelector('input').value = source; }, fixedCreditCardDescription);
    assert.equal((await page.evaluate(collector, args)).texts.length, 0);
    assert.deepEqual(readFileSync(collectorFile), collectorBytes); assert.deepEqual(readFileSync(moduleFile), moduleBytes);
  });

  await check('Description diagnostics distinguish direct and split fixed Text without exposing any text or values', async () => {
    await fixture(`<p id="selector-description">${fixedCreditCardDescription}</p><input value="fixture-private-diagnostic-value">`);
    const direct = await page.evaluate(inspectCurrentPaymentMethodDescriptionStructure);
    assert.equal(direct.descriptionElementCount, 1); assert.equal(direct.fixedSourceTextMatchCount, 1); assert.equal(direct.fixedSourceNormalizedTextMatchCount, 1); assert.equal(direct.descriptionStructures[0].selector, '#selector-description'); assert.equal(direct.descriptionStructures[0].childElementCount, 0); assert.equal(direct.descriptionStructures[0].directTextNodeCount, 1); assert.equal(direct.descriptionStructures[0].directTextMatchesFixedSourceCount, 1); assert.equal(direct.descriptionStructures[0].directTextNormalizedMatchCount, 1); assert.equal(direct.descriptionStructures[0].elementTextEqualsFixedSource, true); assert.equal(direct.descriptionStructures[0].elementTextNormalizedEqualsFixedSource, true); assert.equal(direct.descriptionStructures[0].topDocument, true); assert.equal(direct.descriptionStructures[0].lightDOM, true); assert.equal(direct.descriptionStructures[0].visible, true);
    const encoded = JSON.stringify(direct); for (const value of [fixedCreditCardDescription, '$100', 'fixture-private-diagnostic-value']) assert.equal(encoded.includes(value), false);
    await untouched();
    const splitAt = fixedCreditCardDescription.indexOf('A handling');
    await fixture(`<p id="selector-description">${fixedCreditCardDescription.slice(0, splitAt)}<span>${fixedCreditCardDescription.slice(splitAt)}</span></p>`);
    const split = await page.evaluate(inspectCurrentPaymentMethodDescriptionStructure);
    assert.equal(split.descriptionStructures[0].elementTextEqualsFixedSource, true); assert.equal(split.descriptionStructures[0].elementTextNormalizedEqualsFixedSource, true); assert.equal(split.descriptionStructures[0].childElementCount, 1); assert.equal(split.descriptionStructures[0].directTextNodeCount, 1); assert.equal(split.descriptionStructures[0].directTextMatchesFixedSourceCount, 0); assert.equal(split.descriptionStructures[0].directTextNormalizedMatchCount, 0); assert.equal(split.fixedSourceTextMatchCount, 0); assert.equal(split.fixedSourceNormalizedTextMatchCount, 0);
    const captured = await page.evaluate(browserCapture(root), { route: { id: 'payment-methods' }, frameURL: formURL, framePath: [], knownRoutes: [] });
    assert.equal(captured.texts.some(candidate => candidate.text === fixedCreditCardDescription || candidate.text.includes('$100')), false);
    await untouched();
    const whitespaceVariant = fixedCreditCardDescription.replace('A handling', '\n  A  handling');
    await fixture(`<p id="selector-description">${whitespaceVariant}</p>`);
    const normalized = await page.evaluate(inspectCurrentPaymentMethodDescriptionStructure);
    assert.equal(normalized.descriptionStructures[0].elementTextEqualsFixedSource, false); assert.equal(normalized.descriptionStructures[0].elementTextNormalizedEqualsFixedSource, true); assert.equal(normalized.descriptionStructures[0].directTextMatchesFixedSourceCount, 0); assert.equal(normalized.descriptionStructures[0].directTextNormalizedMatchCount, 1); assert.equal(normalized.fixedSourceTextMatchCount, 0); assert.equal(normalized.fixedSourceNormalizedTextMatchCount, 1);
    assert.equal(JSON.stringify(normalized).includes(whitespaceVariant), false); assert.equal(JSON.stringify(normalized).includes(fixedCreditCardDescription), false);
    assert.equal((await page.evaluate(browserCapture(root), { route: { id: 'payment-methods' }, frameURL: formURL, framePath: [], knownRoutes: [] })).texts.length, 0);
    await untouched();
  });

  await check('Description diagnostics return only safe ordinary-DOM structure and skip private surfaces, Shadow and child documents', async () => {
    await fixture(`<p id="selector-description">Fixture private diagnostic text 123456789</p><p id="fixture-business-id-123456789">${fixedCreditCardDescription}</p><nav><p>${fixedCreditCardDescription}</p></nav><div id="ask-impact-shadow-host"><p>${fixedCreditCardDescription}</p></div><p hidden>${fixedCreditCardDescription}</p><div class="table-cell">${fixedCreditCardDescription}</div><input value="fixture-private-diagnostic-value"><div id="native-fixture-shadow"></div>`);
    await page.evaluate(source => { const shadow = document.querySelector('#native-fixture-shadow').attachShadow({ mode: 'open' }), description = document.createElement('p'); description.id = 'selector-description'; description.append(document.createTextNode(source)); shadow.append(description); }, fixedCreditCardDescription);
    const diagnostic = await page.evaluate(inspectCurrentPaymentMethodDescriptionStructure);
    assert.equal(diagnostic.descriptionElementCount, 1); assert.equal(diagnostic.descriptionStructures[0].elementTextEqualsFixedSource, false); assert.equal(diagnostic.fixedSourceTextMatchCount, 1);
    assert.match(diagnostic.fixedSourceStructures[0].selector, /^html:nth-of-type\(1\) > body:nth-of-type\(1\) > p:nth-of-type\(2\)$/u);
    const encoded = JSON.stringify(diagnostic); for (const value of [fixedCreditCardDescription, 'Fixture private diagnostic text', '123456789', 'fixture-business-id', 'fixture-private-diagnostic-value']) assert.equal(encoded.includes(value), false);
    await untouched();
    await fixture(`<p id="selector-description">${fixedCreditCardDescription}</p>`, 'https://demo.impact.com/secure/advertiser/finance/fr/payment-methods/ui.ihtml');
    assert.equal((await page.evaluate(inspectCurrentPaymentMethodDescriptionStructure)).descriptionElementCount, 0);
    await fixture(`<iframe src="${formURL}"></iframe>`);
    const child = page.frames().find(frame => frame !== page.mainFrame() && frame.url() === formURL);
    assert(child); await child.setContent(`<p id="selector-description">${fixedCreditCardDescription}</p>`);
    const childDiagnostic = await child.evaluate(inspectCurrentPaymentMethodDescriptionStructure);
    assert.equal(childDiagnostic.topDocument, false); assert.equal(childDiagnostic.descriptionElementCount, 0); assert.equal(childDiagnostic.fixedSourceTextMatchCount, 0);
    assert.deepEqual(readFileSync(collectorFile), collectorBytes); assert.deepEqual(readFileSync(moduleFile), moduleBytes);
  });
} finally {
  await browser?.close();
  mkdirSync(reportFolder, { recursive: true });
  const report = { mode: 'SYNTHETIC_CAPTURE_FORM_READINESS', realNetworkAcceptance: false, sourceModule: 'scripts/finance-extra-capture.mjs', sourceSHA256: createHash('sha256').update(moduleBytes).digest('hex'), collectorModule: 'scripts/finance-session.mjs', collectorSHA256: createHash('sha256').update(collectorBytes).digest('hex'), date: new Date().toISOString(), status: results.length === 20 && results.every(result => result.status === 'PASS') ? 'PASS' : 'FAIL', clicksPerformedByReadiness: 0, submissionsPerformed: 0, privateValuesSaved: false, frameDocumentsRead: false, results };
  writeFileSync(path.join(reportFolder, 'form-readiness-report.json'), JSON.stringify(report, null, 2));
  if (report.status !== 'PASS') process.exitCode = 1;
}

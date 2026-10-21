/** Observed interface/settings projections in an isolated MV3 profile; no user Chrome or real network. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, cpSync, rmSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const arg = name => process.argv.find(value => value.startsWith(name + '='))?.slice(name.length + 1);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const testPath = fileURLToPath(import.meta.url), testSHA256 = sha(readFileSync(testPath));
const sourceDir = path.resolve(root, arg('--source-dir') || 'impact-cn-mod');
const reportDir = path.resolve(root, arg('--report-dir') || 'artifacts/097-interface-settings-20261021');
const capturePath = path.resolve(root, arg('--capture') || 'artifacts/097-interface-settings-20261021/live-public-capture.json');
const targetsPath = path.resolve(root, arg('--targets') || 'artifacts/097-interface-settings-20261021/targets.json');
const baseline = process.argv.includes('--baseline-observation');
const observedOnly = process.argv.includes('--observed-only');
const stopOnFixedTextFailure = process.argv.includes('--stop-on-fixed-text-failure');
const phasedTaskUpload = process.argv.includes('--phased-task-upload');
const taskUploadPageId = 'task-field-upload-settings-097';
const taskUploadKeys = { header: taskUploadPageId + '-1', choose: taskUploadPageId + '-2', next: taskUploadPageId + '-3' };
const requireSourceUnchanged = process.argv.includes('--require-source-unchanged');
const captureBytes = readFileSync(capturePath), capture = JSON.parse(captureBytes);
const targetsBytes = readFileSync(targetsPath), targets = JSON.parse(targetsBytes);
for (const [name, bytes] of [['--capture-sha256', captureBytes], ['--targets-sha256', targetsBytes]]) {
  assert(/^[a-f0-9]{64}$/u.test(arg(name) || ''), 'Final public input hash required: ' + name);
  assert.equal(sha(bytes), arg(name), 'Final public input changed before startup: ' + name);
}
assert.equal(capture.captureFinal, true, 'Do not test a mutable capture as a final baseline or candidate');
let pages = capture.pages;
assert(Array.isArray(pages) && pages.length, 'No final observed page projections');
assert(Array.isArray(targets.items) && targets.items.length, 'Independent targets.items required');
const expected = new Map();
for (const item of targets.items) {
  assert(item.page && item.key && typeof item.source === 'string' && typeof item.target === 'string', 'Incomplete independent target');
  assert(!expected.has(item.key), 'Duplicate target key: ' + item.key);
  expected.set(item.key, item);
}
function shadowChildren(node) {
  if (node.shadow === undefined) return [];
  if (Array.isArray(node.shadow)) return node.shadow;
  assert(node.shadow && typeof node.shadow === 'object' && !Array.isArray(node.shadow), 'Invalid observed Shadow schema');
  assert(node.shadow.mode !== 'closed', 'Closed Shadow cannot be projected as an observed open root');
  if (node.shadow.tag || Object.hasOwn(node.shadow, 'text')) return [node.shadow];
  assert(Array.isArray(node.shadow.children), 'Observed Shadow-root object needs its actual children');
  return node.shadow.children;
}
const walk = (node, fn) => { fn(node); for (const child of [...node.children || [], ...shadowChildren(node)]) walk(child, fn); };
function validateObservedTree(node, location) {
  assert(node && typeof node === 'object' && !Array.isArray(node), 'Truncated/non-node observed tree: ' + location);
  assert(!JSON.stringify(node.attrs || {}).includes('[MaxDepth]'), 'Truncated observed attributes: ' + location);
  if (Object.hasOwn(node, 'text')) {
    assert.equal(typeof node.text, 'string', 'Observed Text must be a string: ' + location);
    assert(!node.text.includes('[MaxDepth]'), 'Truncated observed Text placeholder: ' + location);
    return;
  }
  assert(typeof node.tag === 'string' && node.tag.length, 'Observed element tag missing: ' + location);
  if (node.children !== undefined) assert(Array.isArray(node.children), 'Observed children must be nodes: ' + location);
  for (const [index, child] of (node.children || []).entries()) validateObservedTree(child, location + '/children/' + index);
  for (const [index, child] of shadowChildren(node).entries()) validateObservedTree(child, location + '/shadow/' + index);
}
const classHas = (node, token) => (node.attrs?.class || '').split(/\s+/u).includes(token);
const customSelectionState = item => item.id.startsWith('custom-selected-') && item.id.endsWith('-0910');
const scriptJSON = value => JSON.stringify(value).replaceAll('<', '\\u003c');
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const checklistParentPrefix = '/secure/advertiser/engage/checklist/instance/';
const checklistFrameSelector = "#checklist-outer-container .right-section-outermost-container > .checklist-right-section > #screen-outer-div > iframe#iframe.checklist-iframe[name='screenIframe']";
const financeIntermediatePath = '/secure/advertiser/finance/fr/finance-overview.ihtml';
const financeNestedSelector = '#vueInstance > .app-page > iframe';
const assetLinkoutPath = '/onboarding-ui/checklist-assets/production/operator-json/linkout.html';
const assetDocument = item => item.realHost === 'ui.assets.impact.com' || item.host === 'ui.assets.impact.com';
const facts = new Map(), roles = new Map(), pageIds = new Set();
function publicRole(parent, ancestors) {
  if (parent.tag === 'span' && ancestors.some(node => classHas(node, 'value')) && ancestors.some(node => node.tag === 'button' && classHas(node, 'iui-multi-select-input-button'))) return 'selected-public-schema-caption';
  if (parent.tag === 'link-text') return 'directory-link';
  if (parent.tag === 'h2' && ancestors.some(node => classHas(node, 'settings-column'))) return 'directory-group';
  if (parent.tag === 'p' && classHas(parent, 'description')) return 'directory-description';
  if (parent.tag === 'header-text') return 'page-header';
  if (parent.tag === 'sub-header') return 'form-section-header';
  if (parent.tag === 'field-label-typography') return 'form-field-label';
  if (parent.tag === 'description-text') return 'form-description';
  if (parent.tag === 'label' && classHas(parent, 'right-label')) return 'form-right-label';
  if (parent.tag === 'label' && classHas(parent, 'uitk-text-label')) return 'observed-static-label';
  if (classHas(parent, 'back-widget-title')) return 'back-widget-prefix';
  if (ancestors.some(node => node.tag === 'footer' && classHas(node, 'formFooter'))) return 'form-footer-action';
  if (parent.tag === 'button' && ancestors.some(node => classHas(node, 'iui-file-input'))) return 'file-picker-label';
  if (parent.tag === 'button') return 'observed-button-label';
  if (parent.tag === 'h1') return 'list-heading';
  if (parent.tag === 'span' && classHas(parent, 'text') && ancestors.some(node => classHas(node, 'check-item'))) return 'checklist-step-label';
  if (parent.tag === 'span' && classHas(parent, 'text') && ancestors.some(node => node.tag === 'h4' && classHas(node, 'accordion-header'))) return 'checklist-group-label';
  if (parent.tag === 'h3' && classHas(parent, 'header') && ancestors.some(node => classHas(node, 'checklist-right-section'))) return 'checklist-body-heading';
  if (parent.tag === 'div' && classHas(parent, 'description') && ancestors.some(node => classHas(node, 'checklist-right-section'))) return 'checklist-body-description';
  return 'other-observed-public-role';
}
for (const item of pages) {
  assert(item.id && item.pathExact?.startsWith('/') && item.tree && item.fixedText?.length, 'Incomplete observed page: ' + item.id);
  assert(!pageIds.has(item.id), 'Each same-path state needs its own page id: ' + item.id); pageIds.add(item.id);
  validateObservedTree(item.tree, item.id);
  if (item.observedPathPrefix !== undefined) {
    assert.equal(item.observedPathPrefix, checklistParentPrefix, 'Only the explicitly observed public Checklist prefix is projected in this batch');
    assert.equal(item.syntheticDocumentPath, true, 'Real instance addresses must not enter a prefix projection');
    assert(item.pathExact.startsWith(item.observedPathPrefix) && item.pathExact.slice(item.observedPathPrefix.length).startsWith('synthetic-'), 'Prefix projection needs an explicitly synthetic instance suffix');
  }
  if (item.capturedAsChildDocument) {
    assert.equal(item.topPathPrefix, checklistParentPrefix, 'Child document needs its observed public parent prefix');
    assert.equal(item.observedFrameSelector, checklistFrameSelector, 'Child document needs the independently observed complete public iframe relation');
  }
  if (item.observedIntermediatePathExact !== undefined || item.observedNestedFrameSelector !== undefined) {
    assert.equal(item.capturedAsChildDocument, true, 'Nested Finance projection needs an observed Checklist child chain');
    assert.equal(item.observedIntermediatePathExact, financeIntermediatePath, 'Only the independently observed exact intermediate Finance route is projected');
    assert.equal(item.observedNestedFrameSelector, financeNestedSelector, 'Nested Finance needs its observed direct iframe role');
  }
  if (assetDocument(item)) {
    assert.equal(item.pathExact, assetLinkoutPath, 'This batch only observed one exact public asset document');
    assert.equal(item.capturedAsChildDocument, true, 'Observed asset must remain a Checklist child document');
    assert.equal(item.observedParentHost, 'app.impact.com', 'Asset input must record its independently observed brand parent host');
  } else assert(['demo.impact.com', 'app.impact.com'].includes(item.realHost || item.host || 'demo.impact.com'), 'Unexpected observed real host');
  const found = [];
  function visit(node, ancestors = [], inShadow = false) {
    const next = node.tag ? [...ancestors, node] : ancestors;
    if (node.fixedKey) found.push({ node, ancestors: next, inShadow });
    for (const child of node.children || []) visit(child, next, inShadow);
    for (const child of shadowChildren(node)) visit(child, next, true);
  }
  visit(item.tree);
  assert.equal(found.length, item.fixedText.length, 'Capture/tree positions differ: ' + item.id);
  const keys = new Set();
  for (const label of item.fixedText) {
    assert(!facts.has(label.key) && !keys.has(label.key), 'Duplicate captured key: ' + label.key); keys.add(label.key);
    const matches = found.filter(value => value.node.fixedKey === label.key);
    assert.equal(matches.length, 1, 'Each fixed Text needs one observed node: ' + label.key);
    assert.equal(matches[0].node.text, label.rawText ?? label.source, 'Raw projection differs: ' + label.key);
    assert(['exact', 'prefix'].includes(label.match || 'exact'), 'Only independently reviewed exact/prefix positions are supported');
    if ((label.match || 'exact') === 'exact') assert.equal((label.rawText ?? label.source).trim(), label.source.trim());
    else assert((label.rawText ?? label.source).trim().startsWith(label.source.trim()), 'Invalid observed prefix: ' + label.key);
    const target = expected.get(label.key);
    assert(target && target.page === item.id && target.source === label.source, 'Independent target mismatch: ' + label.key);
    const info = matches[0];
    if (customSelectionState(item)) {
      assert.deepEqual(info.ancestors.filter(node => ['uitk-container', 'main-content', 'templateContainer'].includes(node.attrs?.id)).map(node => node.attrs.id), ['uitk-container', 'main-content', 'templateContainer'], 'Current selected-schema projection must retain the freshly observed static native shell IDs: ' + label.key);
    }
    facts.set(label.key, info); roles.set(label.key, publicRole(info.ancestors.at(-1), info.ancestors));
  }
}
assert.equal(expected.size, facts.size, 'Independent targets include missing/extra positions');
const inputLabels = pages.flatMap(item => item.fixedText);
const inputCounts = { positionCount: inputLabels.length, uniqueSourceCount: new Set(inputLabels.map(label => label.source)).size, hiddenTextCount: inputLabels.filter(label => label.visible === false).length };
for (const [key, actual] of Object.entries(inputCounts)) if (targets[key] !== undefined) assert.equal(targets[key], actual, key);
if (phasedTaskUpload) {
  assert(!arg('--boundary-page') && !arg('--reuse-boundaries-report') && !arg('--public-preview'), 'The narrow phased Task mode does not run or reuse unrelated page checks');
  pages = pages.filter(item => item.id === taskUploadPageId);
  assert.equal(pages.length, 1, 'The observed Task upload state is required');
  assert.deepEqual(pages[0].fixedText.map(label => [label.key, label.source]), [[taskUploadKeys.header, 'Custom Task Fields'], [taskUploadKeys.choose, 'Choose File'], [taskUploadKeys.next, 'Next']]);
}
const labels = pages.flatMap(item => item.fixedText);
const positionCount = labels.length, uniqueSourceCount = new Set(labels.map(label => label.source)).size;
const hiddenTextCount = labels.filter(label => label.visible === false).length;
const activeRoles = labels.map(label => roles.get(label.key));
const roleCounts = Object.fromEntries([...new Set(activeRoles)].map(role => [role, activeRoles.filter(value => value === role).length]));
const raw = label => label.rawText ?? label.source;
const legacyGeneralKey = 'compatibility-legacy-finance-general-h1';
const legacyGeneralTarget = '常规设置';
const translated = label => raw(label).replace(label.source.trim(), expected.get(label.key)?.target ?? (label.key === legacyGeneralKey ? legacyGeneralTarget : assert.fail('Independent target missing: ' + label.key)));
const wantedFor = (item, enabled = true) => Object.fromEntries(item.fixedText.map(label => [label.key, enabled ? translated(label) : raw(label)]));
const shadowRawOverrides = item => Object.fromEntries(item.fixedText.filter(label => facts.get(label.key).inShadow).map(label => [label.key, raw(label)]));
const nativeHostFor = item => item.realHost || item.host || 'demo.impact.com';
const nativeParentHostFor = item => item.observedParentHost || nativeHostFor(item);
const customTypeSources = ['Paragraph', 'Multi-select', 'Dropdown list', 'Single-select', 'Datepicker', 'Number', 'File'];
function customSelectionLabels(item) {
  if (!customSelectionState(item)) return null;
  assert(customTypeSources.includes(item.selectedSchemaType), 'Observed selected type must be one of the seven public schema options');
  const captions = item.fixedText.filter(label => label.source === item.selectedSchemaType);
  assert.equal(captions.length, 1, 'Each selected-state projection requires exactly one selected caption');
  const optionLabels = item.fixedText.filter(label => ['Options', 'Add Another'].includes(label.source));
  assert.deepEqual(optionLabels.map(label => label.source), ['Multi-select', 'Dropdown list', 'Single-select'].includes(item.selectedSchemaType) ? ['Options', 'Add Another'] : [], 'Option editor Text belongs only to the three observed choice types');
  return { caption: captions[0], optionLabels };
}
function portalLabelsFor(item) {
  const labels = item.fixedText.filter(label => {
    const ancestors = facts.get(label.key).ancestors;
    return ancestors.some((node, index) => index > 0 && ancestors[index - 1].tag === 'body' && classHas(node, 'iui-dropdown') && classHas(node, 'in-multiselect-input') && classHas(node, 'in-single-select'));
  });
  if (labels.length) assert.deepEqual(labels.map(label => label.source), customTypeSources, 'Only the actual complete public seven-type portal is projected');
  return labels;
}
function boundaryVariants(item) {
  const selection = customSelectionLabels(item);
  const role099 = selection ? 'custom-form' : item.id.endsWith('-099') ? (item.id.startsWith('custom-field-form') ? 'custom-form' : item.id === 'custom-fields-list-099' ? 'custom-list' : item.id.startsWith('inquiry-') ? 'inquiry' : 'native-ids') : null;
  const variants = [
    role099 && role099 !== 'native-ids' ? { id: 'unrelated-actual-settings-component-role', invalidSettingsRole: role099 } : { id: 'unrelated-native-owners', invalidOwners: true },
    { id: 'unrelated-direct-Text-parent-roles', demoteTextParents: true },
    { id: 'styling-hash-rekey-keeps-public-roles', rekeyStyling: true, enabled: true },
    ...(item.observedPathPrefix ? [
      { id: 'rekeyed-synthetic-instance-keeps-observed-prefix', pathname: item.observedPathPrefix + 'synthetic-other-public-instance.ihtml', enabled: true },
      { id: 'outside-observed-instance-prefix', pathname: '/secure/advertiser/engage/checklist/synthetic-outside-instance-prefix.ihtml' }
    ] : [{ id: 'wrong-exact-document-path', pathname: item.pathExact + '/synthetic-unrelated-child' }]),
    { id: 'other-authorized-brand-host-synthetic', ...(assetDocument(item) ? { parentHost: nativeParentHostFor(item) === 'app.impact.com' ? 'demo.impact.com' : 'app.impact.com' } : { host: nativeHostFor(item) === 'app.impact.com' ? 'demo.impact.com' : 'app.impact.com' }), enabled: true },
    { id: 'wrong-brand-path', pathname: '/synthetic/outside-advertiser-settings' },
    { id: 'wrong-host', host: 'other.example' },
    { id: 'non-HTTPS-document', protocol: 'http:' }
  ];
  if (item.kind?.startsWith('checklist-')) variants.push({ id: 'checklist-business-display-state-classes-are-not-eligibility', rekeyChecklistState: true, enabled: true });
  if (item.capturedAsChildDocument) {
    variants.push(
      { id: 'child-observed-parent-prefix-rekey', parentPath: checklistParentPrefix + 'synthetic-other-public-parent-instance.ihtml', enabled: true },
      { id: 'child-wrong-parent-path', parentPath: '/synthetic/outside-checklist-instance' },
      { id: 'child-unapproved-parent-host', parentHost: 'other.example' }
    );
    // Cross-origin assets retain their existing worker source/top-URL contract;
    // same-origin native Finance additionally binds the actual DOM iframe chain.
    if (!assetDocument(item)) variants.push(
      { id: 'child-wrong-public-parent-root', invalidParentRoot: true },
      { id: 'child-wrong-iframe-element-role', invalidFrameOwner: true },
      { id: 'child-frame-src-path-must-match-document', frameSrcMismatch: true },
      { id: 'child-extra-frame-nesting', extraFrameNesting: true }
    );
  }
  if (item.observedIntermediatePathExact) variants.push(
    { id: 'nested-finance-wrong-exact-intermediate-path', intermediatePath: '/synthetic/unrelated-finance-intermediate' },
    { id: 'nested-finance-wrong-intermediate-root', invalidIntermediateRoot: true },
    { id: 'nested-finance-wrong-direct-iframe-role', invalidNestedFrameOwner: true },
    { id: 'nested-finance-cross-origin-intermediate', intermediateHost: 'other.example' },
    { id: 'nested-finance-outer-frame-src-path-must-match', outerFrameSrcMismatch: true }
  );
  if (item.fixedText.some(label => facts.get(label.key).inShadow)) {
    variants.push({ id: 'wrong-actual-Shadow-owner', wrongShadowOwners: true, enabled: true, overrides: shadowRawOverrides(item) });
    variants.push({ id: 'actual-Shadow-content-in-Light-DOM', unwrapShadow: true, enabled: true, overrides: shadowRawOverrides(item) });
  } else variants.push({ id: 'Light-content-in-unrelated-Shadow', wrapUnrelatedShadow: true });
  if (item.id === 'task-upload-expanded-099') {
    const bodyLabels = item.fixedText.filter(label => facts.get(label.key).ancestors.some(node => node.tag === 'td'));
    variants.push({ id: 'file-format-cell-column-role-rotation', rotateTaskColumns: true, enabled: true, overrides: Object.fromEntries(bodyLabels.map(label => [label.key, raw(label)])) });
  }
  const portalLabels = item.id.endsWith('-099') ? portalLabelsFor(item) : [];
  if (portalLabels.length) {
    const checkedKeys = portalLabels.map(label => label.key);
    for (let index = 0; index < portalLabels.length; index++) {
      variants.push({ id: 'portal-mixed-language-remaining-English-position-' + (index + 1), seedPortalTargetsExcept: index, enabled: true, checkedKeys });
      variants.push({ id: 'portal-rejects-wrong-public-witness-position-' + (index + 1), invalidPortalWitness: index, checkedKeys: checkedKeys.filter(key => key !== portalLabels[index].key) });
    }
    for (const [id, portalGuard] of [
      ['missing-native-creation-form', 'missing-form'], ['duplicate-native-creation-form', 'duplicate-form'],
      ['wrong-public-create-title', 'wrong-title'], ['wrong-public-DisplayType-label', 'wrong-display-label'],
      ['duplicate-public-DisplayType-label', 'duplicate-display-label'], ['incomplete-native-three-fields', 'missing-field-role'],
      ['missing-seventh-type', 'missing-item'], ['eighth-type', 'extra-item'], ['second-same-type-popup', 'duplicate-menu']
    ]) variants.push({ id: 'portal-rejects-' + id, portalGuard, checkedKeys: portalGuard === 'missing-item' ? checkedKeys.slice(0, -1) : checkedKeys });
  }
  if (selection && ['custom-selected-paragraph-0910', 'custom-selected-multi-select-0910'].includes(item.id)) {
    for (const selectionGuard of ['missing-form', 'duplicate-form', 'wrong-title', 'duplicate-title', 'wrong-display-label', 'duplicate-display-label', 'wrong-name-label', 'wrong-description-label', 'missing-name-field', 'wrong-selected-field-role']) variants.push({ id: 'selected-schema-rejects-' + selectionGuard, selectionGuard });
    if (selection.optionLabels.length) {
      const checkedKeys = selection.optionLabels.map(label => label.key);
      variants.push({ id: 'option-editor-rejects-unknown-caption', selectionGuard: 'unknown-caption', checkedKeys });
      variants.push({ id: 'option-editor-rejects-duplicate-caption', selectionGuard: 'duplicate-caption', checkedKeys });
      for (const selectedCaption of ['Paragraph', 'Datepicker', 'Number', 'File']) variants.push({ id: 'option-editor-rejects-nonchoice-' + selectedCaption, selectionGuard: 'nonchoice-caption', selectedCaption, checkedKeys });
    }
  }
  return variants;
}
const sourceFiles = readdirSync(sourceDir, { recursive: true }).filter(file => path.basename(file) !== '.DS_Store' && statSync(path.join(sourceDir, file)).isFile());
assert.equal(sourceFiles.length, 20, 'Use the complete twenty-file extension snapshot');
const sourceSHA256 = Object.fromEntries(sourceFiles.map(file => [file, sha(readFileSync(path.join(sourceDir, file)))]));
const version = JSON.parse(readFileSync(path.join(sourceDir, 'manifest.json'))).version;
const selectedBoundaryPages = arg('--boundary-page') ? new Set(arg('--boundary-page').split(',')) : null;
let reusedBoundaryEvidence, reusedBoundaryObservations = [];
if (selectedBoundaryPages) {
  assert(!baseline && selectedBoundaryPages.size, 'Boundary selection is candidate-only');
  for (const id of selectedBoundaryPages) assert(pageIds.has(id), 'Unknown selected boundary page: ' + id);
  assert(arg('--reuse-boundaries-report'), 'A partial boundary rerun must link preserved earlier PASS evidence');
  const priorPath = path.resolve(root, arg('--reuse-boundaries-report')), priorBytes = readFileSync(priorPath), prior = JSON.parse(priorBytes);
  assert.equal(prior.mode, 'SYNTHETIC_OBSERVED_INTERFACE_SETTINGS_MV3');
  assert.equal(prior.capture.sha256, sha(captureBytes)); assert.equal(prior.independentTargets.sha256, sha(targetsBytes));
  assert.equal(prior.version, version, 'Version changed across selective boundary reuse');
  for (const [file, hash] of Object.entries(sourceSHA256)) if (file !== 'dict.js') assert.equal(prior.sourceSHA256[file], hash, 'Runtime/resource changed; rerun all boundaries: ' + file);
  for (const item of pages.filter(item => !selectedBoundaryPages.has(item.id))) {
    const earlier = prior.boundaryObservations.filter(value => value.page === item.id);
    assert(earlier.length && earlier.every(value => value.status === 'PASS'), 'Never skip a prior boundary failure: ' + item.id);
    const requiredIds = [...boundaryVariants(item).map(variant => variant.id), 'unapproved-child-document'];
    assert.deepEqual(earlier.map(value => value.variant).sort(), requiredIds.sort(), 'Boundary contract changed; rerun affected page: ' + item.id);
    reusedBoundaryObservations.push(...earlier.map(value => ({ ...value, evidence: 'REUSED_PREVIOUS_PASS_NOT_NEW_EXECUTION' })));
  }
  reusedBoundaryEvidence = { path: path.relative(root, priorPath), sha256: sha(priorBytes), testSHA256: prior.testSHA256, unchangedNonDictionaryFiles: 19, changedDictionarySHA256: { previous: prior.sourceSHA256['dict.js'], current: sourceSHA256['dict.js'] }, coordinatorApprovedScopeOnlyChange: 'Two Task upload context owner scopes; all affected and previously failed boundary pages rerun', reusedPages: pages.filter(item => !selectedBoundaryPages.has(item.id)).map(item => item.id), reusedCount: reusedBoundaryObservations.length };
}
// One pre-existing public leaf from docs/finance-dom-scan.json pages[id=general].candidates (General/H1).
// Its manually specified translation is separate from this batch's independently reviewed targets.
const legacyFinanceControl = {
  id: 'compatibility-legacy-finance-general', kind: 'historical-public-structure-current-synthetic-control', realHost: 'demo.impact.com',
  pathExact: '/secure/finance/app/customer-settings-general-view.ihtml', fixedText: [{ key: legacyGeneralKey, source: 'General' }],
  tree: { tag: 'div', attrs: { id: 'app' }, children: [{ tag: 'div', attrs: { class: 'customer-settings-general' }, children: [{ tag: 'div', attrs: { class: 'screen-content' }, children: [{ tag: 'h1', children: [{ text: 'General', fixedKey: legacyGeneralKey }] }] }] }] }
};

function html(item, variant = {}) {
  const canonical = node => Object.hasOwn(node, 'text') ? structuredClone(node) : { ...structuredClone(node), children: (node.children || []).map(canonical), ...(node.shadow !== undefined ? { shadow: shadowChildren(node).map(canonical) } : {}) };
  const tree = canonical(item.tree), targetParentKeys = new Set(item.fixedText.map(label => label.key));
  const portalLabels = item.id.endsWith('-099') ? portalLabelsFor(item) : [];
  const portalIndexes = new Map(portalLabels.map((label, index) => [label.key, index]));
  let styleIndex = 0;
  walk(tree, node => {
    if (variant.phasedTaskUpload && [taskUploadKeys.header, taskUploadKeys.choose].includes(node.fixedKey)) node.text = ' ';
    if (portalIndexes.has(node.fixedKey)) {
      const index = portalIndexes.get(node.fixedKey);
      if (variant.seedPortalTargetsExcept !== undefined && index !== variant.seedPortalTargetsExcept) node.text = translated(portalLabels[index]);
      if (variant.invalidPortalWitness === index) node.text = 'SYNTHETIC_UNRELATED_PUBLIC_TYPE';
    }
    if (!node.tag) return;
    if (variant.invalidOwners && ['uitk-container', 'vueInstance', 'main-content', 'templateContainer', 'checklist-outer-container'].includes(node.attrs?.id)) node.attrs.id = 'synthetic-unrelated-native-owner-' + node.attrs.id;
    if (variant.invalidOwners && item.capturedAsChildDocument && node.attrs?.class) node.attrs.class = node.attrs.class.split(/\s+/u).map(token => ['customer-settings-general', 'customer-settings-fees-impact', 'customer-settings-fees', 'brand-overview', 'on-vertical-flex'].includes(token) ? 'synthetic-unrelated-' + token : token).join(' ');
    if ((variant.invalidOwners || variant.wrongShadowOwners) && node.shadow) node.attrs = { ...node.attrs, id: 'synthetic-unrelated-shadow-owner', class: 'synthetic-unrelated-shadow-owner' };
    if (variant.rekeyStyling && node.attrs?.class) node.attrs.class = node.attrs.class.split(/\s+/u).map(token => /^_\d+-\d+-\d+_/u.test(token) ? 'synthetic-render-style-' + styleIndex++ : token).join(' ');
    if (variant.rekeyChecklistState && ['check-item', 'accordion-header', 'panel'].some(token => classHas(node, token))) node.attrs.class = node.attrs.class.split(/\s+/u).filter(token => !['complete', 'active', 'expanded'].includes(token)).concat('synthetic-display-state').join(' ');
    if (variant.demoteTextParents && node.children?.some(child => targetParentKeys.has(child.fixedKey))) { node.tag = 'aside'; node.attrs = { class: 'synthetic-unrelated-Text-parent-role' }; }
    if (variant.missingFileComponent && classHas(node, 'iui-file-input')) node.attrs.class = node.attrs.class.split(/\s+/u).filter(token => token !== 'iui-file-input').concat('synthetic-unrelated-file-component').join(' ');
    if (variant.demoteNextTextParent && node.children?.some(child => child.fixedKey === taskUploadKeys.next)) { node.tag = 'aside'; node.attrs = { class: 'synthetic-unrelated-next-Text-parent' }; }
    if (variant.missingTaskForm && node.tag === 'form' && classHas(node, 'iui-web-form')) node.tag = 'aside';
    if (variant.missingTaskFooter && node.tag === 'footer' && classHas(node, 'formFooter')) node.attrs.class = 'synthetic-unrelated-footer';
    if (variant.invalidSettingsRole && node.attrs?.class) {
      const roles = { 'custom-form': ['custom-fields-form'], 'custom-list': ['custom-fields-container'], inquiry: ['uitkLabelTable'] }[variant.invalidSettingsRole];
      node.attrs.class = node.attrs.class.split(/\s+/u).map(token => roles.includes(token) ? 'synthetic-unrelated-' + token : token).join(' ');
    }
    if (variant.unwrapShadow && node.shadow) { node.children = [...node.children || [], ...node.shadow]; delete node.shadow; }
  });
  const records = [];
  function record(node, parent) { records.push({ node, parent }); for (const child of node.children || []) record(child, node); }
  record(tree, null);
  if (variant.selectionGuard) {
    const selection = customSelectionLabels(item);
    assert(selection, 'Selected-schema guards require an independently captured selected state');
    const creation = records.find(({ node }) => classHas(node, 'custom-fields-form') && classHas(node, 'iframe-router-view'));
    const header = records.find(({ node }) => node.tag === 'header-text' && node.attrs?.['data-testid'] === 'uicl-page-header-title');
    const field = type => records.find(({ node }) => classHas(node, 'iui-field-label-pair') && node.attrs?.type === type);
    const labelFor = type => { let label; walk(field(type).node, node => { if (!label && node.tag === 'label') label = node; }); return records.find(({ node }) => node === label); };
    const changeText = (record, text) => { let changed = false; walk(record.node, node => { if (Object.hasOwn(node, 'text') && !changed) { node.text = text; changed = true; } }); assert(changed, 'Observed fixed public context Text missing'); };
    const remove = ({ node, parent }) => { parent.children = parent.children.filter(child => child !== node); };
    const blankClone = node => { const clone = structuredClone(node); walk(clone, child => { if (Object.hasOwn(child, 'text')) child.text = ''; delete child.fixedKey; }); return clone; };
    assert(creation && header && field('Multiselect') && field('text') && field('TextArea'), 'Actual Create form and three field roles required');
    if (variant.selectionGuard === 'missing-form') creation.parent.children.splice(creation.parent.children.indexOf(creation.node), 1, ...creation.node.children || []);
    if (variant.selectionGuard === 'duplicate-form') creation.parent.children.push(blankClone(creation.node));
    if (variant.selectionGuard === 'wrong-title') changeText(header, 'SYNTHETIC_UNRELATED_CREATE_TITLE');
    if (variant.selectionGuard === 'duplicate-title') header.parent.children.push(structuredClone(header.node));
    if (variant.selectionGuard === 'wrong-display-label') changeText(labelFor('Multiselect'), 'SYNTHETIC_UNRELATED_DISPLAY_LABEL');
    if (variant.selectionGuard === 'duplicate-display-label') { const label = labelFor('Multiselect'); label.parent.children.push(structuredClone(label.node)); }
    if (variant.selectionGuard === 'wrong-name-label') changeText(labelFor('text'), 'SYNTHETIC_UNRELATED_NAME_LABEL');
    if (variant.selectionGuard === 'wrong-description-label') changeText(labelFor('TextArea'), 'SYNTHETIC_UNRELATED_DESCRIPTION_LABEL');
    if (variant.selectionGuard === 'missing-name-field') remove(field('text'));
    if (variant.selectionGuard === 'wrong-selected-field-role') field('Multiselect').node.attrs.type = 'SYNTHETIC_UNRELATED_FIELD';
    const caption = records.find(({ node }) => node.fixedKey === selection.caption.key);
    if (variant.selectionGuard === 'unknown-caption') caption.node.text = 'SYNTHETIC_UNRELATED_PUBLIC_TYPE';
    if (variant.selectionGuard === 'nonchoice-caption') caption.node.text = variant.selectedCaption;
    if (variant.selectionGuard === 'duplicate-caption') { const clone = structuredClone(caption.parent); walk(clone, node => { if (Object.hasOwn(node, 'text')) node.text = translated(selection.caption); delete node.fixedKey; }); records.find(({ node }) => node === caption.parent).parent.children.push(clone); }
  }
  if (variant.rotateTaskColumns) {
    const table = records.find(({ node }) => node.tag === 'table' && classHas(node, 'list-table'))?.node;
    assert(table, 'Observed file-format table missing');
    for (const row of table.children.filter(node => node.tag === 'tr')) {
      const cells = row.children.filter(node => node.tag === 'td'); assert.equal(cells.length, 4, 'Actual four documentation columns required');
      const rotated = [cells[3], ...cells.slice(0, 3)]; let index = 0;
      row.children = row.children.map(node => node.tag === 'td' ? rotated[index++] : node);
    }
  }
  if (variant.portalGuard) {
    assert.equal(portalLabels.length, 7, 'Portal guard needs the actual seven-item body popup');
    const creation = records.find(({ node }) => classHas(node, 'custom-fields-form') && classHas(node, 'iframe-router-view'));
    const portal = records.find(({ node, parent }) => parent?.tag === 'body' && classHas(node, 'iui-dropdown') && classHas(node, 'in-multiselect-input') && classHas(node, 'in-single-select'));
    let menu;
    if (portal) walk(portal.node, node => { if (!menu && node.tag === 'ul' && classHas(node, 'iui-list')) menu = node; });
    assert(creation && portal && menu, 'Observed creation form and native portal owners are required');
    const remove = ({ node, parent }) => { parent.children = parent.children.filter(child => child !== node); };
    const blankClone = node => { const clone = structuredClone(node); walk(clone, child => { if (Object.hasOwn(child, 'text')) child.text = ''; delete child.fixedKey; }); return clone; };
    const sourceNode = source => records.find(({ node }) => node.fixedKey && item.fixedText.some(label => label.key === node.fixedKey && label.source === source));
    if (variant.portalGuard === 'missing-form') remove(creation);
    if (variant.portalGuard === 'duplicate-form') creation.parent.children.push(blankClone(creation.node));
    if (variant.portalGuard === 'wrong-title') sourceNode('Create Custom Field').node.text = 'SYNTHETIC_UNRELATED_PUBLIC_TITLE';
    if (variant.portalGuard === 'wrong-display-label') sourceNode('Display Type').node.text = 'SYNTHETIC_UNRELATED_PUBLIC_LABEL';
    if (variant.portalGuard === 'duplicate-display-label') {
      const label = sourceNode('Display Type'), parent = records.find(({ node }) => node === label.parent)?.parent;
      const clone = structuredClone(label.parent), target = expected.get(label.node.fixedKey).target;
      walk(clone, node => { if (Object.hasOwn(node, 'text')) node.text = target; delete node.fixedKey; });
      parent.children.push(clone);
    }
    if (variant.portalGuard === 'missing-field-role') remove(records.find(({ node }) => classHas(node, 'field-section')));
    if (variant.portalGuard === 'missing-item') menu.children = menu.children.filter((node, index, children) => node !== children.filter(child => child.tag === 'li').at(-1));
    if (variant.portalGuard === 'extra-item') { const clone = structuredClone(menu.children.find(node => node.tag === 'li')); walk(clone, node => { if (Object.hasOwn(node, 'text')) node.text = 'SYNTHETIC_EIGHTH_PUBLIC_TYPE'; delete node.fixedKey; }); menu.children.push(clone); }
    if (variant.portalGuard === 'duplicate-menu') {
      const clone = structuredClone(portal.node);
      walk(clone, node => { if (node.fixedKey) node.text = translated(portalLabels.find(label => label.key === node.fixedKey)); delete node.fixedKey; });
      portal.parent.children.push(clone);
    }
  }
  const bodyClass = item.tree.tag === 'body' ? item.tree.attrs?.class || '' : item.bodyClasses || 'vnext-dark';
  return `<!doctype html><html><head><meta charset="utf-8"></head><body class="${escape(bodyClass)}"><script>
  const spec=${scriptJSON(tree)}, variant=${scriptJSON(variant)}, fixed=${scriptJSON(item.fixedText)};
  if(variant.syntheticLocation)history.replaceState(null,'',variant.syntheticLocation);
  window.__nativeAttachShadowPrototype=Element.prototype.attachShadow;
  function construct(s){if('text'in s){const n=document.createTextNode(s.text);if(!s.fixedKey)return n;const f=document.createDocumentFragment();f.append(document.createComment('fixed:'+s.fixedKey),n);return f;}const e=document.createElement(s.tag);for(const[k,v]of Object.entries(s.attrs||{}))e.setAttribute(k,v);for(const child of s.children||[])e.append(construct(child));if(s.shadow){const r=e.attachShadow({mode:'open'});for(const child of s.shadow)r.append(construct(child));}return e;}
  const make=()=>spec.tag==='body'?(spec.children||[]).map(construct):[construct(spec)];
  window.__components=make();window.__componentOwner=document.body;
  if(variant.wrapUnrelatedShadow){const h=document.createElement('div');h.id='synthetic-unrelated-shadow';document.body.append(h);window.__componentOwner=h.attachShadow({mode:'open'});}
  window.__componentOwner.append(...window.__components);
  if(variant.delayedTaskFile){const element=document.querySelector('#vueInstance form .iui-file-input');if(!element)throw Error('Observed native file component missing');const placeholder=document.createComment('synthetic delayed observed native file component');const owner=element.parentNode;owner.replaceChild(placeholder,element);const walker=document.createTreeWalker(element,NodeFilter.SHOW_COMMENT);let choose;while(walker.nextNode())if(walker.currentNode.nodeValue==='fixed:'+${scriptJSON(taskUploadKeys.choose)})choose=walker.currentNode.nextSibling;if(!choose)throw Error('Observed file Text missing');window.__delayedTaskFile={element,owner,placeholder,choose};}
  window.__roots=()=>{const roots=[],seen=new Set();function visit(e){if(seen.has(e))return;seen.add(e);roots.push(e);if(e.shadowRoot)visit(e.shadowRoot);for(const c of e.querySelectorAll('*'))if(c.shadowRoot)visit(c.shadowRoot);}for(const e of window.__components)visit(e);return roots;};
  window.__isOwnedHelp=(e,nodes=window.__proof?.nodes)=>{if(e.nodeType!==1||!e.matches('button.impact-cn-inline-help[data-impact-cn-ignore][data-impact-cn-help][data-entry-id][data-topic-id][data-impact-cn-help-topic]')||e.type!=='button'||!e.dataset.entryId||e.dataset.topicId!==e.dataset.impactCnHelpTopic)return false;return Object.values(nodes||{}).some(n=>{const label=n.parentElement,interactive=label.closest('a,button,summary');return interactive?e.parentNode===interactive.parentNode&&interactive.nextSibling===e:e.parentNode===label;});};
  function mountProbes(){
    const roots=window.__roots(),shadow=roots.find(r=>r.nodeType===Node.DOCUMENT_FRAGMENT_NODE);
    const owner=shadow||roots.map(r=>r.matches?.('#templateContainer,#vueInstance')?r:r.querySelector('#templateContainer,#vueInstance')).find(Boolean)||window.__components[0];
    const probes=document.createElement('section');probes.id='synthetic-settings-preservation-probes';
    for(const[type,value]of[['text','Email Address'],['password','SYNTHETIC_PASSWORD'],['email','synthetic-private@example.invalid']]){const input=document.createElement('input');input.type=type;input.value=value;input.name='synthetic-'+type;probes.append(input);}
    const check=document.createElement('input');check.type='checkbox';check.checked=true;check.disabled=true;check.value='Private Profile';probes.append(check);
    const select=document.createElement('select');select.name='synthetic-locale';const selected=document.createElement('option');selected.value='SYNTHETIC_LOCALE';selected.textContent='Language Locale';selected.selected=true;const implicit=document.createElement('option');implicit.textContent='First Name';select.append(selected,implicit);probes.append(select);
    const textarea=document.createElement('textarea');textarea.value='SYNTHETIC USER DRAFT / Custom Terms';probes.append(textarea);
    for(const text of ['SYNTHETIC PRIVATE NAME','SYNTHETIC BUSINESS ID','USD 1,234.56','2026-10-21','User Settings','Email Address','Custom Terms','months and','Task Manager']){const s=document.createElement('span');s.textContent=text;probes.append(s);}
    for(const[tag,cls,text]of[['label','uitk-text-label','Email Address'],['label','uitk-text-label','Use current email (SYNTHETIC_OTHER@example.invalid)'],['field-label-typography','header-text form-section-header','Email Address'],['description-text','form-section-description','Use current email (SYNTHETIC_DESCRIPTION@example.invalid)'],['button','iui-component iui-btn','Save'],['button','iui-component iui-btn','Choose File']]){const e=document.createElement(tag);e.className=cls;if(tag==='button')e.type='button';e.textContent=text;probes.append(e);}
    const passive=document.createElement('button');passive.type='button';passive.id='synthetic-passive-native-action';passive.textContent='SYNTHETIC NATIVE INSPECT';probes.append(passive);owner.append(probes);
    if(${scriptJSON(observedOnly)}){
      const selectedSources=${scriptJSON(customSelectionState(item) ? [...customTypeSources, 'Options', 'Add Another'] : [])};
      for(const value of [...new Set(['String','Yes','No','Paragraph','Number','File',...selectedSources])]){const input=document.createElement('input');input.type='text';input.value=value;input.name='synthetic-business-source-value';probes.append(input);}
      const table=document.createElement('table');table.className='synthetic-business-decoration';const row=document.createElement('tr');for(const value of [...new Set(['String','Yes','No','Subtype Id','Subtype Name','Paragraph','Number','File','Viewing account settings for','Viewing program settings for',...selectedSources])]){const cell=document.createElement('td');cell.textContent=value;row.append(cell);}table.append(row);probes.append(table);
      const code=document.createElement('code');code.textContent='String Yes No Paragraph Multi-select Dropdown list Single-select Datepicker Number File';probes.append(code);
      for(const value of ['Select Excel/CSV','Preview & Accept','or drag & drop file','Show file format details','Hide file format details']){const span=document.createElement('span');span.textContent=value;probes.append(span);}
      if(${scriptJSON(customSelectionState(item))}){
        const nameField=document.querySelector('.custom-fields-form.iframe-router-view form .field-section > .iui-field-label-pair[type="text"]');
        if(nameField){
          const wrongFieldInput=nameField.querySelector('.input-fields.custom-fields-input-fields > .input');
          if(!wrongFieldInput)throw Error('Actual Name input owner missing from selected-schema projection');
          const widget=document.createElement('div');widget.className='iui-component iui-multiselect-input multiselect-form-input';widget.setAttribute('type','Multiselect');widget.dataset.testid='uicl-multiselect-input';
          const buttons=document.createElement('div');buttons.className='btn-container';widget.append(buttons);
          for(const text of selectedSources.filter(value=>!['Options','Add Another'].includes(value))){const button=document.createElement('button');button.type='button';button.className='iui-multi-select-input-button';button.dataset.testid='uicl-multi-select-input-button';const value=document.createElement('span');value.className='value';const caption=document.createElement('span');caption.textContent=text;value.append(caption);button.append(value);buttons.append(button);}
          wrongFieldInput.append(widget);
          const wrongRepeater=document.createElement('div');wrongRepeater.className='input-row-repeater';const pair=document.createElement('div');pair.className='iui-field-label-pair';const labelOwner=document.createElement('div'),label=document.createElement('label');label.textContent='Options';labelOwner.append(label);const contentOwner=document.createElement('div'),repeater=document.createElement('div');repeater.className='iui-input-row-repeater';const rows=document.createElement('div'),add=document.createElement('div');add.className='add-container';const button=document.createElement('button');button.type='button';button.dataset.testid='uicl-input-row-repeater-add-button';button.textContent='Add Another';add.append(button);rows.append(add);repeater.append(rows);contentOwner.append(repeater);pair.append(labelOwner,contentOwner);wrongRepeater.append(pair);wrongFieldInput.append(wrongRepeater);
        }
      }
    }
    const ai=document.createElement('div');ai.id='ask-impact-shadow-host';const ar=ai.attachShadow({mode:'open'});const reply=document.createElement('p');reply.textContent='SYNTHETIC AI REPLY / Use current email / User Settings';ar.append(reply);probes.append(ai);
  }mountProbes();
  window.__collect=()=>{const nodes={},elements=[];for(const r of window.__roots()){if(r.nodeType===Node.ELEMENT_NODE)elements.push(r);elements.push(...r.querySelectorAll('*'));const w=document.createTreeWalker(r,NodeFilter.SHOW_COMMENT);while(w.nextNode())if(w.currentNode.nodeValue.startsWith('fixed:'))nodes[w.currentNode.nodeValue.slice(6)]=w.currentNode.nextSibling;}
    const unique=[...new Set(elements)].filter(e=>!window.__isOwnedHelp(e,nodes)),texts=[];for(const r of window.__roots()){const w=document.createTreeWalker(r,NodeFilter.SHOW_TEXT);while(w.nextNode())if(!Object.values(nodes).includes(w.currentNode)&&w.currentNode.parentElement?.tagName!=='SCRIPT')texts.push({node:w.currentNode,value:w.currentNode.nodeValue});}
    window.__proof={nodes,elements:unique.map(element=>({element,parent:element.parentNode,children:[...element.childNodes].filter(n=>!window.__isOwnedHelp(n,nodes)),attrs:JSON.stringify([...element.attributes].map(a=>[a.name,a.value]))})),texts,controls:unique.filter(e=>e.matches('input,select,textarea')).map(element=>({element,value:element.value,checked:element.checked,disabled:element.disabled,selectedIndex:element.tagName==='SELECT'?element.selectedIndex:null})),inputEvents:0,clicks:0};
    for(const e of unique.filter(e=>e.matches('input,select,textarea,button,a'))){e.addEventListener('input',()=>window.__proof.inputEvents++);e.addEventListener('click',event=>{event.preventDefault();window.__proof.clicks++;});}
  };window.__collect();
  if(window.__delayedTaskFile)window.__proof.nodes[${scriptJSON(taskUploadKeys.choose)}]=window.__delayedTaskFile.choose;
  window.__phaseTaskText=key=>{if(![${scriptJSON(taskUploadKeys.header)},${scriptJSON(taskUploadKeys.choose)}].includes(key))throw Error('Only the two observed delayed public Text nodes may change');const label=fixed.find(label=>label.key===key);window.__proof.nodes[key].nodeValue=label.rawText??label.source;};
  window.__phaseTaskFile=()=>{const held=window.__delayedTaskFile,p=window.__proof,ownerProof=p.elements.find(x=>x.element===held.owner);if(!held||!ownerProof||held.placeholder.parentNode!==held.owner)throw Error('Observed delayed file owner changed');held.owner.replaceChild(held.element,held.placeholder);ownerProof.children=ownerProof.children.map(node=>node===held.placeholder?held.element:node);const elements=[held.element,...held.element.querySelectorAll('*')];for(const element of elements){p.elements.push({element,parent:element.parentNode,children:[...element.childNodes],attrs:JSON.stringify([...element.attributes].map(a=>[a.name,a.value]))});if(element.matches('input,select,textarea')){p.controls.push({element,value:element.value,checked:element.checked,disabled:element.disabled,selectedIndex:element.tagName==='SELECT'?element.selectedIndex:null});element.addEventListener('input',()=>p.inputEvents++);}if(element.matches('input,select,textarea,button,a'))element.addEventListener('click',event=>{event.preventDefault();p.clicks++;});}const w=document.createTreeWalker(held.element,NodeFilter.SHOW_TEXT);while(w.nextNode())if(!Object.values(p.nodes).includes(w.currentNode))p.texts.push({node:w.currentNode,value:w.currentNode.nodeValue});};
  window.__rewrite=()=>{for(const label of fixed)window.__proof.nodes[label.key].nodeValue=label.rawText??label.source;};
  window.__remount=()=>{for(const e of window.__components)e.remove();window.__components=make();window.__componentOwner.append(...window.__components);mountProbes();window.__collect();};
  </script></body></html>`;
}

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core'))); }
const temporary = mkdtempSync(path.join(os.tmpdir(), 'impact-interface-settings-')), extension = path.join(temporary, 'extension');
cpSync(sourceDir, extension, { recursive: true });
for (const [file, hash] of Object.entries(sourceSHA256)) assert.equal(sha(readFileSync(path.join(extension, file))), hash);
const network = { observedHTTPRequests: 0, interceptedRequests: 0, redirectsUsed: false }, observedRequests = new Set(), interceptedRequests = new Set(), observations = [], phaseObservations = [], compatibilityObservations = [], boundaryObservations = [], results = [];
let context, page, documentFrame, worker, optionalPreview, activePage = pages[0], activeVariant = {}, activeParentURL, activeIntermediateURL, activeIntermediateInitialURL, activeExtraURL, activeChildURL, activeChildInitialURL;
async function check(name, fn) { try { results.push({ name, status: 'PASS', evidence: await fn() }); console.log('SETTINGS OBSERVED PASS ' + name); } catch (error) { results.push({ name, status: 'FAIL', evidence: error.message }); console.log('SETTINGS OBSERVED FAIL ' + name + ': ' + error.message); } }
function parentHTML(variant, childURL) {
  if (variant.unapprovedParent || variant.legacyFinanceShell) return '<!doctype html><iframe src="' + escape(childURL) + '"></iframe>';
  const id = variant.invalidParentRoot ? 'synthetic-unrelated-checklist-root' : 'checklist-outer-container';
  const frameAttrs = variant.invalidFrameOwner ? 'id="synthetic-unrelated-frame" class="synthetic-unrelated-frame" name="syntheticOtherFrame"' : 'id="iframe" class="checklist-iframe" name="screenIframe"';
  return '<!doctype html><div id="' + id + '"><div class="checklist-container iui-component"><div class="right-section-outermost-container"><div class="checklist-right-section"><div id="screen-outer-div"><iframe ' + frameAttrs + ' src="' + escape(childURL) + '"></iframe></div></div></div></div></div>';
}
function intermediateHTML(variant, childURL) {
  const iframe = '<iframe src="' + escape(childURL) + '"></iframe>';
  return '<!doctype html>' + (variant.outerFrameSrcMismatch ? '<script>history.replaceState(null,"",' + scriptJSON(activeIntermediateURL) + ');</script>' : '') + '<div id="' + (variant.invalidIntermediateRoot ? 'synthetic-unrelated-intermediate-root' : 'vueInstance') + '"><div class="app-page">' + (variant.invalidNestedFrameOwner ? '<section>' + iframe + '</section>' : iframe) + '</div></div>';
}
async function open(item, variant = {}) {
  activePage = item; activeVariant = variant; activeParentURL = activeIntermediateURL = activeIntermediateInitialURL = activeExtraURL = undefined;
  const protocol = variant.protocol || 'https:', host = variant.host || nativeHostFor(item), child = new URL(protocol + '//' + host + (variant.pathname || item.pathExact));
  for (const [key, value] of Object.entries(item.query || {})) child.searchParams.set(key, value);
  activeChildURL = child.href;
  activeChildInitialURL = variant.frameSrcMismatch ? protocol + '//' + host + '/secure/finance/app/synthetic-frame-src-path-mismatch.ihtml' : activeChildURL;
  if (item.capturedAsChildDocument || variant.unapprovedParent || variant.legacyFinanceShell) {
    activeParentURL = protocol + '//' + (variant.parentHost || (assetDocument(item) ? nativeParentHostFor(item) : host)) + (variant.parentPath || (variant.unapprovedParent ? '/synthetic-settings-parent' : checklistParentPrefix + 'synthetic-public-parent-instance.ihtml'));
    if (variant.legacyFinanceShell) { const parent = new URL(protocol + '//' + host + '/secure/advertiser/finance/fr/customer-settings-general-view.ihtml'); parent.searchParams.set('u', item.pathExact); activeParentURL = parent.href; }
    if (item.observedIntermediatePathExact && !variant.unapprovedParent) activeIntermediateURL = protocol + '//' + (variant.intermediateHost || host) + (variant.intermediatePath || item.observedIntermediatePathExact);
    activeIntermediateInitialURL = variant.outerFrameSrcMismatch ? protocol + '//' + host + '/secure/advertiser/finance/fr/synthetic-outer-frame-src-path-mismatch.ihtml' : activeIntermediateURL;
    if (variant.extraFrameNesting) activeExtraURL = protocol + '//' + host + '/synthetic-extra-intermediate-frame';
    await page.goto(activeParentURL);
    documentFrame = page.frames().find(frame => frame !== page.mainFrame() && frame.url() === activeChildURL);
    if (!documentFrame) { await page.waitForEvent('framenavigated', { predicate: frame => frame !== page.mainFrame() && frame.url() === activeChildURL }); documentFrame = page.frames().find(frame => frame !== page.mainFrame() && frame.url() === activeChildURL); }
  } else { await page.goto(activeChildURL); documentFrame = page; }
  await documentFrame.waitForFunction(() => !!window.__proof);
}
async function settings(enabled, aiEnabled) { await worker.evaluate(v => chrome.storage.local.set({ impactCNEnabled: v.enabled, impactCNAIEnabled: v.aiEnabled }), { enabled, aiEnabled }); await page.waitForFunction(v => { const a = document.querySelector('#impact-cn-assistant'); return !a || a.dataset.enabled === String(v.enabled) && a.dataset.aiEnabled === String(v.aiEnabled); }, { enabled, aiEnabled }); }
async function readText(frame = documentFrame) { return frame.evaluate(() => Object.fromEntries(Object.entries(window.__proof.nodes).map(([key, node]) => [key, node.nodeValue]))); }
async function waitText(item, enabled = true, frame = documentFrame, overrides = {}, checkedKeys) { const all = { ...wantedFor(item, enabled), ...overrides }, wanted = checkedKeys ? Object.fromEntries(checkedKeys.map(key => { assert(Object.hasOwn(all, key), 'Unknown checked fixed key'); return [key, all[key]]; })) : all; assert(Object.keys(wanted).length, 'Each boundary needs actual fixed positions'); try { await frame.waitForFunction(values => Object.entries(values).every(([key, value]) => window.__proof.nodes[key]?.nodeValue === value), wanted, { timeout: 3500 }); } catch (error) { throw new Error(error.message + '; ' + JSON.stringify({ wanted, actual: await readText(frame) })); } }
async function proof(frame = documentFrame) {
  const bad = await frame.evaluate(() => { const p = window.__proof, children = e => [...e.childNodes].filter(n => !window.__isOwnedHelp(n)); return {
    elements: p.elements.filter(x => !x.element.isConnected || x.element.parentNode !== x.parent || x.children.length !== children(x.element).length || x.children.some((n, i) => n !== children(x.element)[i]) || x.attrs !== JSON.stringify([...x.element.attributes].map(a => [a.name, a.value]))).map(x => ({ tag: x.element.tagName, class: x.element.className })),
    texts: p.texts.filter(x => !x.node.isConnected || x.node.nodeValue !== x.value).map(x => ({ before: x.value, after: x.node.nodeValue, tag: x.node.parentElement?.tagName, class: x.node.parentElement?.className })),
    controls: p.controls.filter(x => !x.element.isConnected || x.element.value !== x.value || x.element.checked !== x.checked || x.element.disabled !== x.disabled || x.selectedIndex !== (x.element.tagName === 'SELECT' ? x.element.selectedIndex : null)).length,
    inputEvents: p.inputEvents, attachShadowPrototypeChanged: Element.prototype.attachShadow !== window.__nativeAttachShadowPrototype
  }; });
  assert(!bad.elements.length && !bad.texts.length && !bad.controls && !bad.inputEvents && !bad.attachShadowPrototypeChanged, 'Native preservation mismatch (fabricated probes only): ' + JSON.stringify(bad));
}
try {
  context = await chromium.launchPersistentContext(path.join(temporary, 'profile'), { executablePath: chromium.executablePath(), channel: 'chromium', headless: true, args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`] });
  context.on('request', request => { if (/^https?:/u.test(request.url())) { observedRequests.add(request); network.observedHTTPRequests++; } });
  await context.route(/https?:\/\//u, route => { network.interceptedRequests++; interceptedRequests.add(route.request()); const url = route.request().url(); if (url === activeParentURL) return route.fulfill({ contentType: 'text/html', body: parentHTML(activeVariant, activeIntermediateInitialURL || activeExtraURL || activeChildInitialURL) }); if (url === activeIntermediateInitialURL) return route.fulfill({ contentType: 'text/html', body: intermediateHTML(activeVariant, activeExtraURL || activeChildInitialURL) }); if (url === activeExtraURL) return route.fulfill({ contentType: 'text/html', body: '<!doctype html><iframe src="' + escape(activeChildInitialURL) + '"></iframe>' }); return route.fulfill({ contentType: 'text/html', body: html(activePage, { ...activeVariant, ...(activeVariant.frameSrcMismatch ? { syntheticLocation: activeChildURL } : {}) }) }); });
  page = await context.newPage(); worker = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');
  if (phasedTaskUpload) {
    const item = pages[0], nativePhaseEvidence = [];
    const phaseSnapshot = () => documentFrame.evaluate(() => ({ text: Object.fromEntries(Object.entries(window.__proof.nodes).map(([key, node]) => [key, node.nodeValue])), connected: Object.fromEntries(Object.entries(window.__proof.nodes).map(([key, node]) => [key, node.isConnected])), switches: { translation: document.querySelector('#impact-cn-assistant')?.dataset.enabled, ai: document.querySelector('#impact-cn-assistant')?.dataset.aiEnabled } }));
    await check('Task upload delayed sibling title and delayed native file independently translate without switch or refresh', async () => {
      for (const scenario of [{ id: 'Next-before-sibling-title', variant: { phasedTaskUpload: true } }, { id: 'Next-before-file-component', variant: { delayedTaskFile: true } }]) {
        await open(item, scenario.variant);
        await page.waitForFunction(() => document.querySelector('#impact-cn-assistant')?.dataset.enabled === 'true');
        await page.waitForTimeout(100);
        const stages = [{ stage: 'initial-native-component', ...await phaseSnapshot() }];
        await proof();
        if (scenario.variant.phasedTaskUpload) {
          assert.equal(stages[0].text[taskUploadKeys.header], ' '); assert.equal(stages[0].text[taskUploadKeys.choose], ' ');
          await documentFrame.evaluate(key => window.__phaseTaskText(key), taskUploadKeys.header);
          await documentFrame.waitForFunction(({ key, target }) => window.__proof.nodes[key].nodeValue === target, { key: taskUploadKeys.header, target: translated(item.fixedText[0]) });
          await proof(); stages.push({ stage: 'only-original-header-Text-arrived', ...await phaseSnapshot() });
          await documentFrame.evaluate(key => window.__phaseTaskText(key), taskUploadKeys.choose);
        } else {
          assert.equal(stages[0].connected[taskUploadKeys.choose], false);
          await documentFrame.evaluate(() => window.__phaseTaskFile());
        }
        let translationError; try { await waitText(item); } catch (error) { translationError = error.message; }
        stages.push({ stage: 'framework-phase-complete-without-user-action', ...await phaseSnapshot() });
        const actual = await readText();
        observations.push({ page: item.id, scenario: scenario.id, status: translationError ? 'FAIL' : 'PASS', ...(translationError ? { error: translationError } : {}), positions: item.fixedText.map(label => ({ key: label.key, source: label.source, expected: translated(label), actual: actual[label.key], status: actual[label.key] === translated(label) ? 'PASS' : 'FAIL' })) });
        phaseObservations.push({ page: item.id, scenario: scenario.id, stages, intentionalFrameworkChanges: scenario.variant.phasedTaskUpload ? 'Only the two original public header/file-button Text values; nodes and attributes retained' : 'Replace a comment with the original held native file component at its observed owner; only that intentional child-list delta updates the preservation snapshot', translationSwitchOperations: 0, explicitRefreshOperations: 0 });
        let nativeError; try { await proof(); await documentFrame.locator('#synthetic-passive-native-action').click(); assert.equal(await documentFrame.evaluate(() => window.__proof.clicks), 1); await proof(); } catch (error) { nativeError = error.message; }
        nativePhaseEvidence.push({ scenario: scenario.id, status: nativeError ? 'FAIL' : 'PASS', ...(nativeError ? { error: nativeError } : {}), actualNextOrChooseFileClicks: 0 });
      }
      assert(observations.every(value => value.status === 'PASS'), 'Automatic phased translation failed: ' + observations.filter(value => value.status === 'FAIL').map(value => value.scenario).join(', '));
      return { uniqueFixedPositions: 3, independentRenderScenarios: 2, fixedPositionAssertions: 6, translationSwitchOperations: 0, explicitRefreshOperations: 0 };
    });
    await check('Both Task phases preserve original Next Text native structure values and fabricated passive handler', async () => {
      assert.equal(nativePhaseEvidence.length, 2); assert(nativePhaseEvidence.every(value => value.status === 'PASS'), JSON.stringify(nativePhaseEvidence));
      return { scenarios: nativePhaseEvidence, fabricatedPrivateValuesOnly: true, nativeInputEvents: 0, actualSaveNextUploadSecurityOrOAuthActions: 0 };
    });
    if (!baseline) await check('Task upload retains exact path root form footer file and direct Next Text roles', async () => {
      const rawFor = keys => Object.fromEntries(item.fixedText.filter(label => keys.includes(label.key)).map(label => [label.key, raw(label)]));
      const variants = [
        { id: 'wrong-exact-Task-path', pathname: item.pathExact + '/synthetic-unrelated-child' },
        { id: 'wrong-native-page-root', invalidOwners: true },
        { id: 'file-role-absent-Choose-stays-raw-Next-remains-valid', missingFileComponent: true, enabled: true, overrides: rawFor([taskUploadKeys.choose]) },
        { id: 'missing-native-form-rejects-both-controls', missingTaskForm: true, enabled: true, overrides: rawFor([taskUploadKeys.choose, taskUploadKeys.next]) },
        { id: 'missing-native-footer-rejects-Next', missingTaskFooter: true, enabled: true, overrides: rawFor([taskUploadKeys.next]) },
        { id: 'wrong-direct-Next-Text-parent', demoteNextTextParent: true, enabled: true, overrides: rawFor([taskUploadKeys.next]) }
      ];
      for (const variant of variants) { let error; try { await open(item, variant); await page.waitForTimeout(1200); await waitText(item, variant.enabled === true, documentFrame, variant.overrides || {}); await proof(); } catch (caught) { error = caught.message; } boundaryObservations.push({ page: item.id, variant: variant.id, status: error ? 'FAIL' : 'PASS', ...(error ? { error } : {}) }); }
      assert(boundaryObservations.every(value => value.status === 'PASS'), JSON.stringify(boundaryObservations.filter(value => value.status === 'FAIL')));
      return { newlyExecutedVariants: variants.length, unrelatedPagesTested: 0, missingFileIsNotARejectionConditionForNext: true };
    });
    else results.push({ name: 'Candidate-only narrowed Task scope checks', status: 'NOT_RUN', evidence: 'Immutable 0.9.7 records both lifecycle failures; no candidate scope acceptance is inferred.' });
  } else {
  await check('All independently reviewed fixed Text positions translate with prefix tails and hidden labels separated', async () => {
    for (const item of pages) { await open(item); await settings(true, true); let translationError, nativeError; try { await waitText(item); } catch (e) { translationError = e.message; } try { await proof(); } catch (e) { nativeError = e.message; } const error = [translationError, nativeError].filter(Boolean).join('; '), actual = await readText(); observations.push({ page: item.id, kind: item.kind, status: error ? 'FAIL' : 'PASS', nativePreservation: nativeError ? 'FAIL' : 'PASS', ...(error ? { error } : {}), positions: item.fixedText.map(label => ({ key: label.key, source: label.source, rawSource: raw(label), expected: translated(label), actual: actual[label.key], match: label.match || 'exact', capturedVisible: label.visible, status: actual[label.key] === translated(label) ? 'PASS' : 'FAIL' })) }); }
    let compatibilityError;
    if (observedOnly) compatibilityObservations.push({ id: legacyFinanceControl.id, status: 'NOT_RUN_OUTSIDE_CURRENT_OBSERVED_SCOPE', reason: 'Unchanged Finance mechanism is outside this new-only dictionary batch; no old Finance acceptance claimed.' });
    else {
      try { await open(legacyFinanceControl, { legacyFinanceShell: true }); await settings(true, true); await page.waitForTimeout(1200); await waitText(legacyFinanceControl); await proof(); } catch (e) { compatibilityError = e.message; }
      compatibilityObservations.push({ id: legacyFinanceControl.id, status: compatibilityError ? 'FAIL' : 'PASS', ...(compatibilityError ? { error: compatibilityError } : {}), publicStructureSource: 'docs/finance-dom-scan.json pages[id=general].candidates General/H1', source: 'General', expected: legacyGeneralTarget, actual: (await readText())[legacyGeneralKey], shell: 'existing normal Finance outer; not the new Checklist shell', privateValues: 'fabricated probes only', realSiteAcceptance: false });
    }
    assert(observations.every(o => o.status === 'PASS') && !compatibilityError, 'Per-page fixed/native failures: ' + observations.filter(o => o.status === 'FAIL').map(o => o.page).join(', ') + (compatibilityError ? '; legacy Finance control' : '')); return { positionCount, uniqueSourceCount, hiddenTextCount, roleCounts, prefixPositions: labels.filter(l => l.match === 'prefix').length, legacyFinancePublicControl: compatibilityObservations[0].status, actualPrivateValuesSaved: false };
  });
  if (!baseline && !(stopOnFixedTextFailure && observations.some(value => value.status === 'FAIL'))) {
    await check('Independent switches preserve nodes attributes native inputs same-English business values and passive handlers', async () => {
      for (const item of pages) { await open(item); for (const [enabled, aiEnabled] of [[true, true], [false, true], [true, false], [true, true]]) { await settings(enabled, aiEnabled); await waitText(item, enabled); await proof(); if (!aiEnabled) await documentFrame.waitForFunction(() => window.__roots().every(r => !r.querySelector('button.impact-cn-inline-help'))); } await documentFrame.locator('#synthetic-passive-native-action').click(); assert.equal(await documentFrame.evaluate(() => window.__proof.clicks), 1); await proof(); }
      return { pages: pages.length, switchStates: [[true, true], [false, true], [true, false], [true, true]], nativeInputEvents: 0, actualSaveNextUploadSecurityOrOAuthActions: 0, fabricatedPrivateValuesOnly: true };
    });
    await check('Framework Text rewriting and Light or actual Shadow component remount need no switch operation', async () => {
      for (const item of pages) { await open(item); await waitText(item); await documentFrame.evaluate(() => window.__rewrite()); await waitText(item); await proof(); await documentFrame.evaluate(() => window.__remount()); await waitText(item); await proof(); if (item.capturedAsChildDocument) { await page.evaluate(() => history.replaceState(null, '', '/synthetic/outside-checklist-instance')); await waitText(item, false); await proof(); await page.evaluate(pathname => history.replaceState(null, '', pathname), checklistParentPrefix + 'synthetic-public-parent-instance.ihtml'); await waitText(item); await proof(); } } return { rewrites: pages.length, remounts: pages.length, syntheticParentContextLossAndRecovery: pages.filter(item => item.capturedAsChildDocument).length, translationSwitchOperations: 0 };
    });
    await check('Exact documents native owners direct Text roles and Shadow identity reject unrelated contexts', async () => {
      for (const item of pages.filter(item => !selectedBoundaryPages || selectedBoundaryPages.has(item.id))) {
        for (const variant of boundaryVariants(item)) { let error; try { await open(item, variant); await page.waitForTimeout(1200); await waitText(item, variant.enabled === true, documentFrame, variant.overrides || {}, variant.checkedKeys); await proof(); } catch (e) { error = e.message; } boundaryObservations.push({ page: item.id, variant: variant.id, checkedKeys: variant.checkedKeys || item.fixedText.map(label => label.key), status: error ? 'FAIL' : 'PASS', ...(error ? { error } : {}) }); }
        let error; try { await open(item, { unapprovedParent: true }); await page.waitForTimeout(1200); await waitText(item, false); await proof(); } catch (e) { error = e.message; } boundaryObservations.push({ page: item.id, variant: 'unapproved-child-document', status: error ? 'FAIL' : 'PASS', ...(error ? { error } : {}) });
      }
      assert(boundaryObservations.every(o => o.status === 'PASS'), 'Boundary failures: ' + boundaryObservations.filter(o => o.status === 'FAIL').map(o => o.page + '/' + o.variant).join(', ')); return { newlyExecutedVariants: boundaryObservations.length, reusedPriorPassVariants: reusedBoundaryObservations.length, privateFrameBodiesFetched: false, nativeOwnerVariantIsCombinedOwnershipScenarioNotIsolatedGuardProof: true, assetWorkerContractDoesNotIncludeSameOriginDOMParentGuards: true };
    });
  } else results.push({ name: 'Candidate-only switch lifecycle and boundary checks', status: 'NOT_RUN', evidence: baseline ? 'Immutable old-package baseline records actual fixed-position and native preservation results; it does not assert candidate behavior.' : 'Stopped after fixed-position or native preservation failure; diagnose the projection or source before running candidate boundaries.' });
  }
  if (!baseline && arg('--public-preview') && results.every(value => value.status === 'PASS')) {
    try { const item = observedOnly ? pages.find(value => value.id === 'task-upload-expanded-099') : pages.find(value => value.kind === 'checklist-catalog-finance'); assert(item, 'Requested observed public preview projection missing'); await open(item); await waitText(item); const preview = page.locator(observedOnly ? '.iui-file-format' : '#checklist-outer-container'); assert(await preview.evaluate(element => !element.querySelector('input,select,textarea,#synthetic-settings-preservation-probes') && !element.textContent.includes('SYNTHETIC')), 'Public preview must exclude fabricated controls/business probes'); const previewPath = path.resolve(root, arg('--public-preview')); mkdirSync(path.dirname(previewPath), { recursive: true }); await preview.screenshot({ path: previewPath }); optionalPreview = { status: 'SYNTHETIC_PUBLIC_TEXT_PREVIEW', content: observedOnly ? 'Observed Task file-format public documentation only' : 'Observed public Checklist text only', path: path.relative(root, previewPath), sha256: sha(readFileSync(previewPath)), realPage: false, businessRowsFabricated: false }; } catch (error) { optionalPreview = { status: 'SKIPPED_OPTIONAL_PREVIEW', reason: error.message }; }
  }
  await check('Complete source snapshot and final public inputs remain hash-locked with every HTTP Request fulfilled locally', async () => { for (const [file, hash] of Object.entries(sourceSHA256)) { assert.equal(sha(readFileSync(path.join(extension, file))), hash); if (requireSourceUnchanged) assert.equal(sha(readFileSync(path.join(sourceDir, file))), hash); } assert.equal(sha(readFileSync(capturePath)), sha(captureBytes)); assert.equal(sha(readFileSync(targetsPath)), sha(targetsBytes)); assert.equal(sha(readFileSync(testPath)), testSHA256); network.unroutedObservedHTTPRequests = [...observedRequests].filter(request => !interceptedRequests.has(request)).length; assert.equal(network.unroutedObservedHTTPRequests, 0, 'HTTP Request escaped local route fulfillment'); return { files: sourceFiles.length, requireSourceUnchanged, allObservedHTTPRequestsFulfilledLocally: true, redirectsUsed: false, realSiteAcceptance: false }; });
} catch (error) { results.push({ name: 'Isolated MV3 harness setup', status: 'FAIL', evidence: error.message }); }
finally {
  await context?.close(); mkdirSync(reportDir, { recursive: true }); const stamp = new Date().toISOString().replace(/[:.]/gu, '-');
  const inputPath = path.join(reportDir, 'test-input-' + stamp + '.json'), frozenTargetsPath = path.join(reportDir, 'test-targets-' + stamp + '.json'); writeFileSync(inputPath, captureBytes, { flag: 'wx' }); writeFileSync(frozenTargetsPath, targetsBytes, { flag: 'wx' });
  const status = results.some(r => r.status === 'FAIL') || (!baseline && results.length !== (phasedTaskUpload ? 4 : 5)) ? 'FAIL' : 'PASS';
  const report = { mode: phasedTaskUpload ? 'SYNTHETIC_PHASED_TASK_UPLOAD_MV3' : 'SYNTHETIC_OBSERVED_INTERFACE_SETTINGS_MV3', version, status, baselineObservation: baseline, observedOnly, stopOnFixedTextFailure, sourceDirectory: path.relative(root, sourceDir), sourceSHA256, testSHA256, capture: { path: path.relative(root, capturePath), sha256: sha(captureBytes), frozenCopy: path.relative(root, inputPath) }, independentTargets: { path: path.relative(root, targetsPath), sha256: sha(targetsBytes), frozenCopy: path.relative(root, frozenTargetsPath) }, validatedInputCounts: inputCounts, testedPageIds: pages.map(item => item.id), positionCount, uniqueSourceCount, hiddenTextCount, roleCounts, observations, phaseObservations, compatibilityObservations, boundaryObservations, reusedBoundaryObservations, reusedBoundaryEvidence, optionalPreview, results, network, realSiteAcceptance: false, actualPrivateValuesReadOrSaved: false, actualSaveNextUploadSecurityOrOAuthActions: 0, unreadableBodiesExcluded: capture.unreadable || [] };
  const reportPath = path.join(reportDir, 'test-' + stamp + '.json'); writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' }); console.log('Observed settings report: ' + reportPath); rmSync(temporary, { recursive: true, force: true }); process.exitCode = status === 'PASS' ? 0 : 1;
}

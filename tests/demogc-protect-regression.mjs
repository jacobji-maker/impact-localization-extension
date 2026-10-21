/** Public Protect projections in an isolated MV3 profile. Final capture and independent per-position targets must be hash-locked before a run. All HTTP(S) requests are intercepted. */
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
const sourceDir = path.resolve(root, arg('--source-dir') || 'impact-cn-mod');
const reportDir = path.resolve(root, arg('--report-dir') || 'artifacts/096-demogc-protect-20261020');
const capturePath = path.resolve(root, arg('--capture') || 'artifacts/096-demogc-protect-20261020/live-public-capture.json');
const baseline = process.argv.includes('--baseline-observation');
const requireSourceUnchanged = process.argv.includes('--require-source-unchanged');
const testSHA256 = sha(readFileSync(fileURLToPath(import.meta.url)));
const captureBytes = readFileSync(capturePath), capture = JSON.parse(captureBytes);
const targetsPath = path.resolve(root, arg('--targets') || 'artifacts/096-demogc-protect-20261020/targets.json');
const captureHash = arg('--capture-sha256'), targetsHash = arg('--targets-sha256');
// A technical input-freeze contract, not an additional user permission gate.
// No mutable draft capture is tested accidentally while collection continues.
assert(/^[a-f0-9]{64}$/u.test(captureHash || ''), 'Pass the final --capture-sha256 before running');
assert(/^[a-f0-9]{64}$/u.test(targetsHash || ''), 'Pass the independent final --targets-sha256 before running');
assert.equal(sha(captureBytes), captureHash, 'Final capture changed before test start');
const targetsBytes = readFileSync(targetsPath), targetSpec = JSON.parse(targetsBytes);
assert.equal(sha(targetsBytes), targetsHash, 'Independent target map changed before test start');
assert(Array.isArray(targetSpec.items), 'Target map schema: items [{page,key,source,target}]');
const expected = new Map();
for (const item of targetSpec.items) {
  assert(item.page && item.key && typeof item.source === 'string' && typeof item.target === 'string', 'Incomplete independent target item');
  assert(!expected.has(item.key), 'Duplicate independent target key: ' + item.key);
  expected.set(item.key, item);
}
const E = (tag, attrs = {}, children = []) => ({ tag, attrs, children });
const T = (text, fixedKey) => ({ text, ...(fixedKey ? { fixedKey } : {}) });
const walk = (node, action) => { action(node); for (const child of [...node.children || [], ...node.shadow || []]) walk(child, action); };
const scriptJSON = value => JSON.stringify(value).replaceAll('<', '\\u003c');
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

// Captures and independent targets define expected behavior. The shipped
// dictionary is never read to generate selectors, roles, or expected wording.
const pages = capture.pages;
assert(Array.isArray(pages) && pages.length, 'No final reviewed Protect projections supplied');
const roles = new Map();
const ancestorInfo = new Map();
function hasClass(node, token) { return (node.attrs?.class || '').split(/\s+/u).includes(token); }
function classPrefix(node, prefix) { return (node.attrs?.class || '').split(/\s+/u).some(value => value.startsWith(prefix)); }
function publicRole(item, label, ancestors) {
  if (item.kind === 'protect-navigation') return ancestors.some(node => hasClass(node, 'subitem-child')) ? 'navigation-child' : 'navigation-parent';
  const parent = ancestors.at(-1);
  if (hasClass(parent, 'x-column-header-text')) return label.source === 'Actions' && ancestors.some(node => hasClass(node, 'uitkDefaultRowActionCls')) ? 'ext-operation-header' : 'ext-header';
  if (hasClass(parent, 'x-btn-inner')) return 'ext-filter';
  if (ancestors.some(node => hasClass(node, 'x-btn-inner'))) return 'ext-action';
  if (ancestors.some(node => hasClass(node, 'header-partition')) && ancestors.some(node => hasClass(node, 'th') && classPrefix(node, 'headerCell--'))) return 'report-header';
  if (ancestors.some(node => classPrefix(node, 'baseFilterButton--'))) return 'report-filter';
  if (hasClass(parent, 'reportingDisclaimer')) return 'report-disclaimer';
  if (parent?.tag === 'h1') return 'report-title';
  if (ancestors.some(node => hasClass(node, 'uitkNoticeBox'))) return 'permission-notice';
  if (classPrefix(parent, 'searchButton--')) return 'report-apply';
  if (classPrefix(parent, 'noRowsMessage--') || classPrefix(parent, 'noDataMessage--')) return 'report-empty';
  if (hasClass(parent, 'x-grid-view')) return 'ext-empty';
  return 'other-reviewed-fixed';
}
for (const item of pages) {
  assert(item.id && item.pathExact?.startsWith('/') && item.tree && item.fixedText?.length && item.provenance, 'Incomplete public capture ' + item.id);
  const nodes = [];
  function visit(node, ancestors = []) {
    const next = node.tag ? [...ancestors, node] : ancestors;
    if (node.fixedKey) nodes.push({ node, ancestors: next });
    for (const child of [...node.children || [], ...node.shadow || []]) visit(child, next);
  }
  visit(item.tree);
  assert.equal(nodes.length, item.fixedText.length, 'Captured keys and public Texts differ: ' + item.id);
  for (const label of item.fixedText) {
    const matching = nodes.filter(value => value.node.fixedKey === label.key);
    assert.equal(matching.length, 1, 'Captured key must identify one Text: ' + label.key);
    assert.equal(matching[0].node.text, label.rawText ?? label.source, 'Raw public Text mismatch: ' + label.key);
    const target = expected.get(label.key);
    assert(target && target.page === item.id && target.source.trim() === label.source.trim(), 'Independent target does not match page/key/source: ' + label.key);
    assert(!roles.has(label.key), 'Captured key reused across pages: ' + label.key);
    roles.set(label.key, publicRole(item, label, matching[0].ancestors));
    ancestorInfo.set(label.key, matching[0].ancestors);
  }
}
assert.equal(expected.size, roles.size, 'Independent map contains missing or extra positions');
const positionCount = pages.reduce((sum, item) => sum + item.fixedText.length, 0);
const uniqueSourceCount = new Set(pages.flatMap(item => item.fixedText.map(label => label.source))).size;
const hiddenTextCount = pages.flatMap(item => item.fixedText).filter(label => label.visible === false).length;
if (targetSpec.positionCount !== undefined) assert.equal(positionCount, targetSpec.positionCount);
if (targetSpec.uniqueSourceCount !== undefined) assert.equal(uniqueSourceCount, targetSpec.uniqueSourceCount);
if (targetSpec.hiddenTextCount !== undefined) assert.equal(hiddenTextCount, targetSpec.hiddenTextCount);
const roleCounts = Object.fromEntries([...new Set(roles.values())].map(role => [role, [...roles.values()].filter(value => value === role).length]));
const hiddenRoleCounts = Object.fromEntries([...new Set(roles.values())].map(role => [role, pages.flatMap(item => item.fixedText).filter(label => label.visible === false && roles.get(label.key) === role).length]).filter(([, count]) => count));
const operationActions = pages.flatMap(item => item.fixedText).filter(label => roles.get(label.key) === 'ext-operation-header');
const metricActions = pages.flatMap(item => item.fixedText).filter(label => label.source === 'Actions' && roles.get(label.key) === 'report-header');
for (const a of operationActions) for (const b of metricActions) assert.notEqual(expected.get(a.key).target, expected.get(b.key).target, 'Actions operation and conversion metric must have independent meanings');
const reportPage = pages[0];
const expectation = (label, translated = true) => {
  const raw = label.rawText ?? label.source;
  return translated ? raw.replace(label.source.trim(), expected.get(label.key).target) : raw;
};
const rawOverrides = (item, predicate) => Object.fromEntries(item.fixedText.filter(predicate).map(label => [label.key, label.rawText ?? label.source]));
const roleOverrides = (item, names) => rawOverrides(item, label => names.includes(roles.get(label.key)));
function titleBoundariesFor(item) {
  const title = item.fixedText.find(label => roles.get(label.key) === 'report-title');
  assert(title, 'Reviewed Light report lacks its independently captured title: ' + item.id);
  const titleRaw = title.rawText ?? title.source;
  const currentRawExceptDisclaimer = rawOverrides(item, label => roles.get(label.key) !== 'report-disclaimer');
  const otherReports = pages.filter(page => page.id !== item.id && page.fixedText.some(label => roles.get(label.key) === 'report-title'));
  const other = otherReports.find(page => page.pathExact === item.pathExact) || otherReports[0];
  assert(other, 'Title boundary needs a different actual public report');
  const otherTitle = other.fixedText.find(label => roles.get(label.key) === 'report-title');
  const otherRaw = titleRaw.replace(title.source.trim(), otherTitle.source.trim());
  const otherOverrides = { ...currentRawExceptDisclaimer, [title.key]: otherRaw };
  // A genuinely shared source/role is eligible under the other captured report.
  // Unique current-report fields must not borrow their old title's ownership.
  // Different exact paths do not supply an alternate report witness.
  if (other.pathExact === item.pathExact) for (const label of item.fixedText) {
    const alternate = other.fixedText.find(candidate => roles.get(candidate.key) === roles.get(label.key) && candidate.source.trim() === label.source.trim());
    if (alternate) otherOverrides[label.key] = (label.rawText ?? label.source).replace(label.source.trim(), expected.get(alternate.key).target);
  }
  if (other.pathExact === item.pathExact) otherOverrides[title.key] = titleRaw.replace(title.source.trim(), expected.get(otherTitle.key).target);
  return [
    { id: 'wrong-report-title-witness', replaceFixedTexts: { [title.key]: 'SYNTHETIC UNREVIEWED REPORT TITLE' }, translated: true, overrides: { ...currentRawExceptDisclaimer, [title.key]: 'SYNTHETIC UNREVIEWED REPORT TITLE' } },
    { id: 'missing-report-title-witness', removeTitleKey: title.key, omitKeys: [title.key], translated: true, overrides: Object.fromEntries(Object.entries(currentRawExceptDisclaimer).filter(([key]) => key !== title.key)) },
    { id: 'other-captured-report-title-witness', replaceFixedTexts: { [title.key]: otherRaw }, translated: true, overrides: otherOverrides, alternateTitleEvidence: { page: other.id, sameExactPath: other.pathExact === item.pathExact } },
    { id: 'already-translated-report-title-witness', replaceFixedTexts: { [title.key]: expectation(title) }, translated: true }
  ];
}
function boundariesFor(item) {
  if (item.kind === 'protect-navigation') return [
    {id:'wrong-navigation-host', mutate:{attribute:'id',from:'adv-navigation',to:'synthetic-other-navigation'}},
    {id:'wrong-protect-product-test-marker', invalidateProduct:'data-testid'},
    {id:'wrong-protect-product-track-marker', invalidateProduct:'data-track-id'},
    {id:'wrong-public-parent-test-marker', invalidateMenuParents:'data-testid'},
    {id:'wrong-public-parent-track-marker', invalidateMenuParents:'data-track-id'},
    {id:'wrong-child-test-prefix', invalidateChildPrefix:'data-testid', translated:true, overrides:roleOverrides(item,['navigation-child'])},
    {id:'wrong-child-track-prefix', invalidateChildPrefix:'data-track-id', translated:true, overrides:roleOverrides(item,['navigation-child'])},
    {id:'rekeyed-opaque-submenu-suffixes-remain-eligible', rekeyNavSuffixes:true, translated:true},
    {id:'navigation-in-light-dom-is-not-native-shadow', lightNavigation:true},
    {id:'outside-advertiser-path', pathExact:'/synthetic-outside-advertiser'}
  ];
  if (item.kind === 'protect-report-error') return [
    {id:'wrong-notice-owner',mutate:{classFrom:'uitkNoticeBox',classTo:'synthetic-other-notice'}},
    {id:'wrong-main-owner',mutate:{attribute:'id',from:'main-content',to:'synthetic-other-main'}},
    {id:'wrong-permission-report-path',pathExact:'/secure/advertiser/protect/synthetic-other-error/report/viewReport.report'}
  ];
  if (item.kind === 'protect-reversals-list') return [
    {id:'wrong-reversals-template-owner',mutate:{attribute:'id',from:'templateContainer',to:'synthetic-other-template'}},
    {id:'wrong-ext-header-container-role',mutate:{classFrom:'x-column-header',classTo:'synthetic-other-column-header'},translated:true,overrides:roleOverrides(item,['ext-header','ext-operation-header'])},
    {id:'wrong-ext-header-inner-role',mutate:{classFrom:'x-column-header-inner',classTo:'synthetic-other-header-inner'},translated:true,overrides:roleOverrides(item,['ext-header','ext-operation-header'])},
    {id:'wrong-ext-action-column-role',mutate:{classFrom:'uitkDefaultRowActionCls',classTo:'synthetic-other-action-column'},translated:true,overrides:roleOverrides(item,['ext-operation-header'])},
    {id:'wrong-ext-filter-inner-role',mutate:{classFrom:'x-btn-inner',classTo:'synthetic-other-filter-inner'},translated:true,overrides:roleOverrides(item,['ext-filter','ext-action'])},
    {id:'wrong-exact-reversals-path',pathExact:'/secure/advertiser/protect/synthetic-other-reversals.ihtml'}
  ];
  // RiskReview's one observed empty-state Text belongs to the native Ext grid.
  // It is not a Light report projection or evidence about unreadable frames.
  if (item.kind === 'protect-risk-review-empty') return [
    {id:'wrong-risk-review-template-owner',mutate:{attribute:'id',from:'templateContainer',to:'synthetic-other-template'}},
    {id:'wrong-ext-empty-view-role',mutate:{classFrom:'x-grid-view',classTo:'synthetic-other-grid-view'}},
    {id:'wrong-exact-risk-review-path',pathExact:'/secure/advertiser/protect/synthetic-other-risk-review.ihtml'}
  ];
  if (item.kind === 'protect-risk-review-headers') return [
    {id:'wrong-risk-review-template-owner',mutate:{attribute:'id',from:'templateContainer',to:'synthetic-other-template'}},
    {id:'wrong-ext-table-owner',mutate:{classFrom:'ext_table',classTo:'synthetic-other-table'}},
    {id:'wrong-ext-header-container-role',mutate:{classFrom:'x-column-header',classTo:'synthetic-other-column-header'}},
    {id:'wrong-ext-header-inner-role',mutate:{classFrom:'x-column-header-inner',classTo:'synthetic-other-header-inner'}},
    {id:'wrong-ext-action-column-role',mutate:{classFrom:'uitkDefaultRowActionCls',classTo:'synthetic-other-action-column'},translated:true,overrides:roleOverrides(item,['ext-operation-header'])},
    {id:'wrong-exact-risk-review-path',pathExact:'/secure/advertiser/protect/synthetic-other-risk-review.ihtml'}
  ];
  assert(['protect-risk-by-partner-report','protect-event-risk-report'].includes(item.kind),'Unhandled Protect capture kind: '+item.kind);
  // The remaining reviewed Event Risk projections use current report roles.
  const fixedOutsideReport = label => roles.get(label.key) !== 'report-disclaimer';
  return [
    {id:'wrong-report-owner',mutate:{attribute:'id',from:'reportingContainer',to:'synthetic-other-report'},translated:true,overrides:rawOverrides(item,fixedOutsideReport)},
    {id:'wrong-filter-owner',mutate:{attribute:'id',from:'reportFormDiv',to:'synthetic-other-form'},translated:true,overrides:roleOverrides(item,['report-filter','report-apply'])},
    {id:'wrong-header-partition-role',mutate:{classFrom:'header-partition',classTo:'synthetic-other-partition'},translated:true,overrides:roleOverrides(item,['report-header'])},
    {id:'wrong-header-cell-role',mutate:{classPrefixFrom:'headerCell--',classPrefixTo:'totalCell--'},translated:true,overrides:roleOverrides(item,['report-header'])},
    {id:'wrong-public-disclaimer-role',mutate:{classFrom:'reportingDisclaimer',classTo:'synthetic-other-disclaimer'},translated:true,overrides:roleOverrides(item,['report-disclaimer'])},
    {id:'wrong-exact-event-risk-path',pathExact:'/secure/advertiser/protect/synthetic-other-event-risk/report/viewReport.report'},
    ...titleBoundariesFor(item)
  ];
}
const sourceFiles = readdirSync(sourceDir, { recursive: true }).filter(file => path.basename(file) !== '.DS_Store' && statSync(path.join(sourceDir, file)).isFile());
const sourceHashes = Object.fromEntries(sourceFiles.map(file => [file, sha(readFileSync(path.join(sourceDir, file)))]));
assert.equal(sourceFiles.length, 20, 'Use the complete twenty-file extension snapshot');
const version = JSON.parse(readFileSync(path.join(sourceDir, 'manifest.json'))).version;
const inputBytes = Buffer.from(JSON.stringify({ schemaVersion: 1, pages, positionCount, uniqueSourceCount, hiddenTextCount, network: 'All HTTP(S) requests intercepted; no real iframe or platform content is fetched.', scope: 'Public Protect minimum projections plus fabricated preservation values. No real account/Program names, selected values or AI conversation.', unreadableFrames: capture.unreadableFrames || [], unreadableFramesCountedAsEmpty: false }, null, 2) + '\n');
const expectationBytes = Buffer.from(JSON.stringify({ items: pages.flatMap(page => page.fixedText.map(label => ({ page: page.id, key: label.key, source: label.rawText ?? label.source, target: expectation(label) }))) }, null, 2) + '\n');

function html(page, variant = {}) {
  const tree = structuredClone(page.tree);
  if (variant.removeTitleKey) walk(tree, node => {
    for (const relation of ['children','shadow']) if (node[relation]) node[relation] = node[relation].filter(child => !(child.tag === 'h1' && child.children?.some(text => text.fixedKey === variant.removeTitleKey)));
  });
  if (variant.replaceFixedTexts) walk(tree, node => {
    if (Object.hasOwn(variant.replaceFixedTexts, node.fixedKey)) node.text = variant.replaceFixedTexts[node.fixedKey];
  });
  if (variant.mutate) {
    const { attribute, from, to, classFrom, classTo, fixedKey, parentTag } = variant.mutate;
    walk(tree, node => {
      if (attribute && node.attrs?.[attribute] === from) node.attrs[attribute] = to;
      if (classFrom && node.attrs?.class?.split(/\s+/u).includes(classFrom)) node.attrs.class = node.attrs.class.split(/\s+/u).map(value => value === classFrom ? classTo : value).join(' ');
      if (parentTag && node.children?.some(child => child.fixedKey === fixedKey)) node.tag = parentTag;
      if (variant.mutate.classPrefixFrom && node.attrs?.class) node.attrs.class = node.attrs.class.split(/\s+/u).map(value => value.startsWith(variant.mutate.classPrefixFrom) ? variant.mutate.classPrefixTo + value.slice(variant.mutate.classPrefixFrom.length) : value).join(' ');
    });
  }
  let syntheticSuffixIndex = 0;
  walk(tree, node => {
    for (const key of ['data-testid','data-track-id']) {
      const value = node.attrs?.[key]; if (typeof value !== 'string') continue;
      if (variant.invalidateProduct === key && value.startsWith('sidenav-product-prd_')) node.attrs[key] = 'synthetic-other-product';
      const isParent = value.startsWith(key === 'data-testid' ? 'sidenav-expanded-submenu-' : 'sidenav-product-submenu-') && !value.includes('submenu-item-');
      if (variant.invalidateMenuParents === key && isParent) node.attrs[key] = 'synthetic-other-public-parent';
      const childPrefix = key === 'data-testid' ? 'sidenav-expanded-submenu-item-' : 'sidenav-product-submenu-item-';
      if (variant.invalidateChildPrefix === key && value.startsWith(childPrefix)) node.attrs[key] = 'synthetic-wrong-child-prefix';
      if (variant.rekeyNavSuffixes && value.startsWith(childPrefix)) node.attrs[key] = childPrefix + 'synthetic-rekey-' + key + '-' + syntheticSuffixIndex++;
    }
  });
  const capturedBodyClasses=Array.isArray(page.bodyClasses)?page.bodyClasses.join(' '):page.bodyClasses||page.tree.attrs?.class||'vnext-dark';
  const bodyClasses = variant.bodyClasses || capturedBodyClasses;
  if(variant.lightNavigation)walk(tree,node=>{if(node.tag==='impact-style-isolator'&&node.shadow){node.children=node.shadow;delete node.shadow;}});
  return `<!doctype html><html><head><meta charset="utf-8"><style>h1.readOnly{display:none}</style></head><body class="${escape(bodyClasses)}"><script>
  const spec=${scriptJSON(tree)},labels=${scriptJSON(page.fixedText)},kind=${scriptJSON(page.kind)},variant=${scriptJSON(variant)};
  window.__attachShadowPrototype=Element.prototype.attachShadow;
  function construct(s){
    if('comment'in s)return document.createComment(s.comment);
    if('text'in s){const n=document.createTextNode(s.text);if(!s.fixedKey)return n;const f=document.createDocumentFragment();f.append(document.createComment('fixed:'+s.fixedKey),n);return f;}
    const e=document.createElement(s.tag);for(const[k,v]of Object.entries(s.attrs||{}))e.setAttribute(k,v);
    for(const c of s.children||[])e.append(construct(c));
    if(s.shadow){const r=e.attachShadow({mode:'open'});for(const c of s.shadow)r.append(construct(c));}return e;
  }
  // A body projection is an envelope, so the floating host remains a real
  // direct child of the document body rather than an artificial wrapper.
  const makeComponents=()=>spec.tag==='body'?(spec.children||[]).map(construct):[construct(spec)];
  window.__components=makeComponents();document.body.append(...window.__components);
  // Entirely fabricated preservation probes, placed within the qualified root.
  // No report selection, private native value or business result row is read.
  const probes=document.createElement('section');probes.id='synthetic-preservation-probes';
  const handle=document.createElement('input');handle.name='synthetic-handle';handle.value='SYNTHETIC_HANDLE_DRAFT';
  const keyword=document.createElement('textarea');keyword.name='synthetic-keyword';keyword.value='SYNTHETIC_KEYWORD_DRAFT';
  const country=document.createElement('select');country.name='synthetic-country';
  const option=document.createElement('option');option.value='SYNTHETIC_COUNTRY_CODE';option.textContent='SYNTHETIC COUNTRY CHOICE';option.selected=true;country.append(option);
  const check=document.createElement('input');check.type='checkbox';check.checked=true;check.disabled=true;check.value='Followers';
  const action=document.createElement('button');action.type='button';action.textContent='SYNTHETIC NATIVE INSPECT';action.className='synthetic-native-inspect';
  probes.append(handle,keyword,country,check,action);
  for(const text of ['SYNTHETIC PARTNER NAME','USD 1,234.56','2026-10-20','67','Actions','Partner','Group','Event Type','Action ID','Order ID','Reversal Reason','Raw Clicks','Total Action Risk','Group By:','Minimum Action Risk %:']){const n=document.createElement('span');n.className='synthetic-private-card-content';n.textContent=text;probes.append(n);}
  document.body.append(probes);
  const ai=document.createElement('div');ai.id='ask-impact-shadow-host';const aiRoot=ai.attachShadow({mode:'open'});const reply=document.createElement('p');reply.textContent='SYNTHETIC AI REPLY / Actions / Partner / Risk';aiRoot.append(reply);document.body.append(ai);
  const roots=window.__roots=()=>{const out=[];function visit(r){out.push(r);if(r.shadowRoot)visit(r.shadowRoot);for(const e of r.querySelectorAll('*'))if(e.shadowRoot)visit(e.shadowRoot);}for(const r of window.__components)visit(r);return out;};
  const mountProbes=()=>{
    const selector=kind==='protect-navigation'?'.side-nav':'#templateContainer';
    const owner=roots().map(r=>r.matches?.(selector)?r:r.querySelector(selector)).find(Boolean)||window.__components[0];owner.append(probes);
    // Same-English selected values are fabricated, including label-shaped values.
    // They remain separate STRONG nodes, never part of the fixed label Text.
    const strongValues=['Group By:','Partner:','Actions','Show:','Minimum Action Threshold:','Raw Clicks'];
    let i=0;for(const r of roots())for(const strong of r.querySelectorAll('strong'))if(strong.firstChild?.nodeType===Node.TEXT_NODE)strong.firstChild.nodeValue=strongValues[i++%strongValues.length];
    for(const r of roots())for(const holder of r.querySelectorAll('[class*="partitionHolder--"]')){
      for(const[partition,cell]of[['body-partition','td'],['body-partition','th headerCell--synthetic-probe'],['header-partition','td headerCell--synthetic-probe'],['header-partition','th totalCell--synthetic-probe']]){
        const part=document.createElement('div');part.className=partition+' tablePartition--_ssZM synthetic-business-row';
        const inner=document.createElement('div');inner.className='partitionInner--GfmnB';const row=document.createElement('div');row.className='tr';const wrap=document.createElement('div');
        for(const text of ['Partner','Actions','Raw Clicks','Raw Click Risk','Total Action Risk','Conversion Rate','No results available','USD 1,234.56','2026-10-20','67']){const box=document.createElement('div');box.className=cell;const span=document.createElement('span');span.textContent=text;box.append(span);wrap.append(box);}
        row.append(wrap);inner.append(row);part.append(inner);holder.append(part);
      }
    }
    // ExtJS uses real div.x-column-header / inner / span roles, not empty th.
    // All labels below are fabricated same-word business/control counterexamples.
    for (const r of roots()) for (const grid of r.querySelectorAll('.ext_table')) {
      const body=document.createElement('div');body.className='x-grid-row synthetic-business-row';
      for (const text of ['Actions','Partner','Action Date','Action ID','Order ID','Event Type','Revenue','Action Cost']) {
        const cell=document.createElement('div');cell.className='x-grid-cell';const inner=document.createElement('div');inner.className='x-column-header-inner';const span=document.createElement('span');span.className='x-column-header-text';span.textContent=text;inner.append(span);cell.append(inner);body.append(cell);
      }
      const table=document.createElement('table'),thead=document.createElement('thead'),tr=document.createElement('tr'),th=document.createElement('th'),span=document.createElement('span');span.className='x-column-header-text';span.textContent='Actions';th.append(span);tr.append(th);thead.append(tr);table.append(thead);body.append(table);grid.append(body);
      const nonAction=document.createElement('div');nonAction.className='x-column-header synthetic-non-action-header';const inner=document.createElement('div');inner.className='x-column-header-inner';const label=document.createElement('span');label.className='x-column-header-text';label.textContent='Actions';inner.append(label);nonAction.append(inner);grid.append(nonAction);
    }
  };mountProbes();
  window.__isOwnedHelp=(e,nodes=window.__proof?.nodes)=>{
    if(e.nodeType!==1||!e.matches('button.impact-cn-inline-help[data-impact-cn-ignore][data-impact-cn-help][data-entry-id][data-topic-id][data-impact-cn-help-topic]')||e.type!=='button'||!e.dataset.entryId||e.dataset.topicId!==e.dataset.impactCnHelpTopic)return false;
    return Object.values(nodes||{}).some(n=>{const label=n.parentElement,interactive=label.closest('a,button,summary');return interactive?e.parentNode===interactive.parentNode&&interactive.nextSibling===e:e.parentNode===label;});
  };
  window.__collect=()=>{
    const nodes={},texts=[],elements=[];for(const r of roots()){if(r.nodeType===Node.ELEMENT_NODE)elements.push(r);elements.push(...r.querySelectorAll('*'));const w=document.createTreeWalker(r,NodeFilter.SHOW_COMMENT);while(w.nextNode())if(w.currentNode.nodeValue.startsWith('fixed:'))nodes[w.currentNode.nodeValue.slice(6)]=w.currentNode.nextSibling;}
    for(const r of [...roots(),reply]){const w=document.createTreeWalker(r,NodeFilter.SHOW_TEXT);while(w.nextNode())if(!Object.values(nodes).includes(w.currentNode))texts.push({node:w.currentNode,value:w.currentNode.nodeValue});}
    elements.push(ai,reply);
    const isOwned=e=>window.__isOwnedHelp(e,nodes);
    window.__proof={nodes,elements:elements.filter(e=>!isOwned(e)).map(element=>({element,parent:element.parentNode,children:[...element.childNodes].filter(n=>!isOwned(n)),attrs:JSON.stringify([...element.attributes].map(a=>[a.name,a.value]))})),texts,controls:elements.filter(e=>e.matches('input,select,textarea')).map(element=>({element,value:element.value,checked:element.checked,disabled:element.disabled,selected:element.tagName==='SELECT'?element.selectedIndex:null})),clicks:0,inputEvents:0};
    for(const n of Object.values(nodes)){const e=n.parentElement;e.addEventListener('click',event=>{event.preventDefault();window.__proof.clicks++;});}
    for(const e of window.__proof.controls.map(x=>x.element))e.addEventListener('input',()=>window.__proof.inputEvents++);action.onclick=event=>{event.preventDefault();window.__proof.clicks++;};
  };window.__collect();
  window.__remount=()=>{for(const old of window.__components)old.remove();window.__components=makeComponents();document.body.append(...window.__components);mountProbes();window.__collect();};
  window.__rewrite=()=>{for(const l of labels)window.__proof.nodes[l.key].nodeValue=l.rawText??l.source;};
  </script></body></html>`;
}

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core'))); }
const temporary = mkdtempSync(path.join(os.tmpdir(), 'impact-demogc-protect-')), extension = path.join(temporary, 'extension');
cpSync(sourceDir, extension, { recursive: true });
for (const [file, hash] of Object.entries(sourceHashes)) assert.equal(sha(readFileSync(path.join(extension, file))), hash);
let context, page, worker, activePage = reportPage, activeVariant = {};
const results = [], observations = [], scopeObservations = [], network = { interceptedRequests: 0 };
const check = async (name, action) => {
  try { results.push({ name, status: 'PASS', evidence: await action() }); console.log('PROTECT PASS ' + name); }
  catch (error) { results.push({ name, status: 'FAIL', evidence: error.message }); console.log('PROTECT FAIL ' + name + ': ' + error.message); }
};
async function open(item = reportPage, variant = {}, host = 'demo.impact.com', pathname = item.pathExact) {
  activePage = item; activeVariant = variant;
  const query = new URLSearchParams(item.query || {});
  await page.goto('https://' + host + pathname + (query.size ? '?' + query : ''));
  await page.waitForFunction(() => !!window.__proof);
}
async function settings(enabled, aiEnabled) {
  await worker.evaluate(value => chrome.storage.local.set({ impactCNEnabled: value.enabled, impactCNAIEnabled: value.aiEnabled }), { enabled, aiEnabled });
  await page.waitForFunction(value => { const e = document.querySelector('#impact-cn-assistant'); return !e || e.dataset.enabled === String(value.enabled) && e.dataset.aiEnabled === String(value.aiEnabled); }, { enabled, aiEnabled });
}
async function readText(frame = page) { return frame.evaluate(() => Object.fromEntries(Object.entries(window.__proof.nodes).map(([key, node]) => [key, node.nodeValue]))); }
async function waitText(item, translated = true, frame = page, overrides = {}, omitKeys = []) {
  const wanted = { ...Object.fromEntries(item.fixedText.filter(label => !omitKeys.includes(label.key)).map(label => [label.key, expectation(label, translated)])), ...overrides };
  try { await frame.waitForFunction(value => Object.entries(value).every(([key, text]) => window.__proof.nodes[key]?.nodeValue === text), wanted, { timeout: 3500 }); }
  catch (error) { throw new Error(error.message + ' ' + JSON.stringify({ wanted, actual: await readText(frame) })); }
  if (omitKeys.length) {
    const actual = await readText(frame);
    assert.deepEqual(omitKeys.filter(key => Object.hasOwn(actual, key)), [], 'Missing-title projection still contains the removed fixed title');
  }
}
async function proof(frame = page) {
  const bad = await frame.evaluate(() => {
    const p = window.__proof, children = e => [...e.childNodes].filter(n => !window.__isOwnedHelp(n));
    return {
      elements: p.elements.filter(x => !x.element.isConnected || x.element.parentNode !== x.parent || x.children.length !== children(x.element).length || x.children.some((n, i) => n !== children(x.element)[i]) || x.attrs !== JSON.stringify([...x.element.attributes].map(a => [a.name, a.value]))).map(x => ({tag:x.element.tagName,connected:x.element.isConnected,parentSame:x.element.parentNode===x.parent,childrenSame:x.children.length===children(x.element).length&&x.children.every((n,i)=>n===children(x.element)[i]),attrsBefore:x.attrs,attrsAfter:JSON.stringify([...x.element.attributes].map(a=>[a.name,a.value]))})),
      texts: p.texts.filter(x => !x.node.isConnected || x.node.nodeValue !== x.value).map(x=>({before:x.value,after:x.node.nodeValue,connected:x.node.isConnected,parentTag:x.node.parentElement?.tagName,parentClass:x.node.parentElement?.className})),
      controls: p.controls.filter(x => !x.element.isConnected || x.element.value !== x.value || x.element.checked !== x.checked || x.element.disabled !== x.disabled || x.selected !== (x.element.tagName === 'SELECT' ? x.element.selectedIndex : null)).length,
      inputEvents: p.inputEvents, prototype: Element.prototype.attachShadow === window.__attachShadowPrototype ? 0 : 1
    };
  });
  assert(Object.values(bad).every(value => Array.isArray(value) ? !value.length : value === 0), 'Native preservation mismatch: ' + JSON.stringify(bad));
}

try {
  context = await chromium.launchPersistentContext(path.join(temporary, 'profile'), { executablePath: chromium.executablePath(), channel: 'chromium', headless: true, args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`] });
  await context.route(/https?:\/\//u, route => {
    network.interceptedRequests++;
    if (new URL(route.request().url()).pathname === '/synthetic-demogc-parent') return route.fulfill({ contentType: 'text/html', body: '<!doctype html><iframe src="https://demo.impact.com' + escape(activePage.pathExact) + '"></iframe>' });
    return route.fulfill({ contentType: 'text/html', body: html(activePage, activeVariant) });
  });
  page = await context.newPage(); worker = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');
  await check('All reviewed Protect fixed Text positions translate with role-specific independent targets and hidden labels separated',async()=>{
   for(const item of pages){await open(item);await settings(true,true);let error;try{await waitText(item);await proof();}catch(e){error=e.message;}const actual=await readText();observations.push({page:item.id,kind:item.kind,loadedVersionAtCapture:item.loadedVersion,provenance:item.provenance,synthetic:true,status:error?'FAIL':'PASS',...(error?{error}:{}),positions:item.fixedText.map(label=>({key:label.key,source:label.rawText,expected:expectation(label),actual:actual[label.key],capturedVisible:label.visible,status:actual[label.key]===expectation(label)?'PASS':'FAIL'}))});}
   assert(observations.every(x=>x.status==='PASS'),'Missing fixed Text in '+observations.filter(x=>x.status==='FAIL').map(x=>x.page).join(', '));return{positions:positionCount,uniqueEnglishSources:uniqueSourceCount,capturedVisiblePositions:positionCount-hiddenTextCount,hiddenTextOnlyPositions:hiddenTextCount,roleCounts,hiddenRoleCounts,hiddenTitlesClaimedVisible:false,unreadableFrameBodies:'NOT_READ_OR_COUNTED_AS_EMPTY', roleCollisionActions:'ExtJS operation column and EventRisk conversion metric have separate targets'};
  });
  if(!baseline){
   await check('Independent switches preserve native Text structure inputs STRONG values totals business rows and passive actions',async()=>{
    const protectedCounts=[];for(const item of pages){await open(item);for(const[enabled,aiEnabled]of[[true,true],[false,true],[true,false],[true,true]]){await settings(enabled,aiEnabled);await waitText(item,enabled);await proof();if(!aiEnabled)await page.waitForFunction(()=>window.__roots().every(r=>!r.querySelector('button.impact-cn-inline-help')));}
     await page.locator('.synthetic-native-inspect').click();assert.equal(await page.evaluate(()=>window.__proof.clicks),1);await proof();protectedCounts.push({page:item.id,...await page.evaluate(()=>({selectedStrong:window.__roots().reduce((n,r)=>n+r.querySelectorAll('strong').length,0),fabricatedBusinessRows:window.__roots().reduce((n,r)=>n+r.querySelectorAll('.synthetic-business-row').length,0)}))});}
    return{protectedCounts,independentSwitchStates:[[true,true],[false,true],[true,false],[true,true]],ApplyFilterSortOrBusinessClicks:0,actualBusinessValuesRead:false};
   });
   await check('Framework Text rewriting and native component or navigation Shadow remount need no switch operation',async()=>{
    for(const item of pages){await open(item);await waitText(item);await page.evaluate(()=>window.__rewrite());await waitText(item);await proof();await page.evaluate(()=>window.__remount());await waitText(item);await proof();}
    return{components:pages.length,rewrites:pages.length,remounts:pages.length,translationSwitchOperations:0,wholeNavigationHostRebuilt:true};
   });
   await check('Exact path product Shadow ExtJS header operation and Light HeaderCell roles protect data values',async()=>{
    const runBoundary=async(item,variant,action,extra={})=>{try{await action();scopeObservations.push({page:item.id,variant,status:'PASS',...extra});}catch(error){scopeObservations.push({page:item.id,variant,status:'FAIL',error:error.message,...extra});}};
    for(const item of pages){await runBoundary(item,'production-host-synthetic',async()=>{await open(item,{},'app.impact.com');await waitText(item);await proof();});
     for(const variant of boundariesFor(item))await runBoundary(item,variant.id,async()=>{await open(item,variant,'demo.impact.com',variant.pathExact||item.pathExact);await waitText(item,variant.translated===true,page,variant.overrides||{},variant.omitKeys||[]);await proof();},variant.alternateTitleEvidence?{alternateTitleEvidence:variant.alternateTitleEvidence}:{});
     await runBoundary(item,'wrong-host',async()=>{await open(item,{},'other.example');await waitText(item,false);await proof();});
     await runBoundary(item,'child-document',async()=>{activePage=item;activeVariant={};await page.goto('https://demo.impact.com/synthetic-demogc-parent');const frame=page.frames().find(f=>f!==page.mainFrame())||await page.waitForEvent('frameattached');await frame.waitForFunction(()=>!!window.__proof);await waitText(item,false,frame);await proof(frame);});
    }
    assert(scopeObservations.every(item=>item.status==='PASS'),'Scope failures: '+scopeObservations.filter(item=>item.status==='FAIL').map(item=>item.page+'/'+item.variant).join(', '));
    return{variants:scopeObservations,productionBrowserVisit:false,reportQueriesExecuted:false,opaqueSuffixesUsedForSourceIdentity:false};
   });
  }else results.push({name:'Candidate linked checks',status:'NOT_RUN',evidence:'Current complete old-package baseline records each observed fixed position; existing translations are not forced to English.'});
  await check('Complete loaded source snapshot and public input remain frozen with all network intercepted', async () => {
    for (const [file, hash] of Object.entries(sourceHashes)) { assert.equal(sha(readFileSync(path.join(extension, file))), hash); if (requireSourceUnchanged) assert.equal(sha(readFileSync(path.join(sourceDir, file))), hash); }
    assert.equal(sha(readFileSync(capturePath)),sha(captureBytes));assert.equal(sha(readFileSync(targetsPath)),sha(targetsBytes)); assert.equal(sha(readFileSync(fileURLToPath(import.meta.url))), testSHA256);
    return { files: sourceFiles.length, requireSourceUnchanged, allNetworkIntercepted: true, realSiteAcceptance: false, sourceDirectory: path.relative(root, sourceDir) };
  });
} catch (error) { results.push({ name: 'Isolated MV3 harness setup', status: 'FAIL', evidence: error.message }); }
finally {
  await context?.close();
  mkdirSync(reportDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/gu, '-');
  const inputPath = path.join(reportDir, 'test-input-' + stamp + '.json'), frozenTargetsPath = path.join(reportDir, 'test-expectations-' + stamp + '.json');
  writeFileSync(inputPath, inputBytes, { flag: 'wx' }); writeFileSync(frozenTargetsPath, expectationBytes, { flag: 'wx' });
  const status = results.some(result => result.status === 'FAIL') || (!baseline && results.length !== 5) ? 'FAIL' : 'PASS';
  const report = { mode: 'SYNTHETIC_DEMOGC_PROTECT_MV3', version, status, baselineObservation: baseline, sourceDirectory: path.relative(root, sourceDir), sourceSHA256: sourceHashes, testSHA256, capture: { path: path.relative(root, capturePath), sha256: sha(captureBytes) },independentTargets:{path:path.relative(root,targetsPath),sha256:sha(targetsBytes)},captureAndTargetsHashLocked:true,unreadableFramesExcludedFromAcceptance:capture.unreadableFrames||[],input: { path: path.relative(root, inputPath), sha256: sha(inputBytes) }, expectations: { path: path.relative(root, frozenTargetsPath), sha256: sha(expectationBytes) }, positionCount, uniqueSourceCount, hiddenTextCount, roleCounts, hiddenRoleCounts, observations, scopeObservations, results, network, realSiteAcceptance: false, nativeSaveClicks: 0, actualPrivateValuesSaved: false };
  const reportPath = path.join(reportDir, 'test-' + stamp + '.json'); writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' }); console.log('Protect report: ' + reportPath);
  rmSync(temporary, { recursive: true, force: true }); process.exitCode = status === 'PASS' ? 0 : 1;
}

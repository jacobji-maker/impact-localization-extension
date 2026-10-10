#!/usr/bin/env node
/** Isolated synthetic project checks; never authenticates or runs live capture. */
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, symlinkSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import vm from 'node:vm';

const root = path.resolve(process.cwd());
const definitions = [
  ['shadow', 'tests/shadow-regression.mjs', [], 'artifacts/shadow-unit-report.json'],
  ['controls', 'tests/extension-controls.mjs', [], 'artifacts/extension-controls-report.json'],
  ['header', 'tests/header-menu-regression.mjs', [], 'artifacts/header-menu-unit-report.json'],
  ['finance', 'tests/finance-regression.mjs', [], 'artifacts/finance-tests/unit-report.json'],
  ['form', 'tests/finance-form-readiness-regression.mjs', [], 'artifacts/finance-phase1-20261010T083045525902Z/form-readiness-report.json'],
  ['new-entries', 'tests/finance-new-entries-regression.mjs', ['--report-dir', 'artifacts/isolated/new-entries'], 'artifacts/isolated/new-entries/new-entries-report.json'],
  ['capture', 'tests/finance-capture-regression.mjs', ['--report-dir=artifacts/isolated/capture'], 'artifacts/isolated/capture/capture-regression-report.json'],
  ['menu', 'tests/finance-menu-regression.mjs', ['--report-dir', 'artifacts/isolated/menu'], 'artifacts/isolated/menu/menu-regression-report.json'],
  ['menu-mv3', 'tests/finance-menu-mv3-regression.mjs', ['--report-dir', 'artifacts/isolated/menu-mv3'], 'artifacts/isolated/menu-mv3/finance-menu-mv3-report.json'],
  ['privacy', 'tests/privacy-regression.py', [], 'artifacts/privacy-unit-report.json'],
  ['package-protection', 'tests/package-regression.py', ['--report-dir', 'artifacts/isolated/package-protection'], 'artifacts/isolated/package-protection/package-regression-report.json']
];
const args = process.argv.slice(2);
let only = null, skipBrowser = false;
for (let index = 0; index < args.length; index++) {
  const arg = args[index];
  if (arg === '--help' || arg === '-h') {
    console.log('Run from project root: node scripts/verify-project.mjs [--only SUITE[,SUITE]] [--skip-browser]\nSuites: ' + definitions.map(item => item[0]).join(', ') + '\nDefault: all synthetic suites. --skip-browser: static, privacy and isolated package/protection only.\nReports/workspace are retained under a new artifacts/engineering-checks-* directory.');
    process.exit(0);
  } else if (arg === '--skip-browser') skipBrowser = true;
  else if (arg === '--only' || arg.startsWith('--only=')) {
    assert(only === null, '--only may be supplied once');
    const value = arg === '--only' ? args[++index] : arg.slice(7);
    assert(value && !value.startsWith('--'), '--only requires a comma-separated suite list');
    only = value.split(',');
    assert(only.every(name => definitions.some(item => item[0] === name)), 'Unknown suite; use --help');
    assert(new Set(only).size === only.length, 'Duplicate suite selection');
  } else throw new Error('Unknown argument; use --help');
}
assert(existsSync(path.join(root, 'package.json')) && existsSync(path.join(root, 'impact-cn-mod/manifest.json')), 'Run from the project root');
const selected = skipBrowser ? ['privacy', 'package-protection'] : only || definitions.map(item => item[0]);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const excluded = new Set(['.DS_Store', '__pycache__', 'node_modules']);
function files(folder) {
  if (!existsSync(folder)) return [];
  return readdirSync(folder, { withFileTypes: true }).filter(item => !excluded.has(item.name)).flatMap(item => {
    const file = path.join(folder, item.name);
    return item.isDirectory() ? files(file) : item.isFile() ? [file] : [];
  }).sort();
}
const protectedFiles = [...['impact-cn-mod', 'scripts', 'tests', 'docs', 'demo', 'dist'].flatMap(folder => files(path.join(root, folder))),
  ...['package.json', 'package-lock.json', 'finance-live-test-report.md', 'live-test-report.md', 'header-live-test-report.md', 'finance-test-report.md', 'header-menu-test-report.md', 'extension-test-report.md', 'unit-test-report.md', 'test-report.md', 'artifacts/finance-tests/live-report.json'].map(file => path.join(root, file)).filter(existsSync)];
const fingerprints = () => Object.fromEntries(protectedFiles.map(file => [path.relative(root, file), existsSync(file) ? sha(readFileSync(file)) : null]));
const before = fingerprints();
mkdirSync(path.join(root, 'artifacts'), { recursive: true });
const stage = mkdtempSync(path.join(root, 'artifacts', 'engineering-checks-' + new Date().toISOString().replace(/[:.]/g, '-') + '-'));
const workspace = path.join(stage, 'workspace'), logs = path.join(stage, 'logs');
mkdirSync(workspace); mkdirSync(logs);
for (const folder of ['impact-cn-mod', 'scripts', 'tests', 'docs', 'demo']) if (existsSync(path.join(root, folder))) {
  cpSync(path.join(root, folder), path.join(workspace, folder), { recursive: true, filter: file => !excluded.has(path.basename(file)) });
}
for (const file of ['package.json', 'package-lock.json']) if (existsSync(path.join(root, file))) cpSync(path.join(root, file), path.join(workspace, file));
const localDependencies = existsSync(path.join(root, 'node_modules'));
if (localDependencies) symlinkSync(path.join(root, 'node_modules'), path.join(workspace, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
const results = [];
let dictionary, manifest;
function command(label, executable, arguments_, input) {
  const result = spawnSync(executable, arguments_, { cwd: workspace, encoding: 'utf8', input, maxBuffer: 32 * 1024 * 1024, timeout: 30 * 60 * 1000 });
  const output = (result.stdout || '') + (result.stderr || '') + (result.error ? '\n' + result.error.message : '');
  writeFileSync(path.join(logs, label + '.log'), output, { flag: 'wx' });
  assert(result.status === 0 && !result.error, label + ' failed; inspect logs/' + label + '.log');
  return result.stdout || '';
}
function check(name, action) {
  console.log('VERIFY RUN ' + name);
  try {
    const evidence = action();
    results.push({ name, status: 'PASS', ...evidence }); console.log('VERIFY PASS ' + name);
  } catch (error) {
    results.push({ name, status: 'FAIL', error: String(error.message).replaceAll(workspace, '<isolated-workspace>').replaceAll(root, '<project-root>') });
    console.log('VERIFY FAIL ' + name + ': ' + results.at(-1).error);
  }
}
check('javascript-syntax', () => {
  const checked = ['impact-cn-mod', 'scripts', 'tests', 'demo'].flatMap(folder => files(path.join(workspace, folder))).filter(file => /\.(?:js|mjs)$/u.test(file));
  for (const [index, file] of checked.entries()) command('syntax-js-' + index, process.execPath, ['--check', file]);
  return { filesChecked: checked.length };
});
check('python-syntax', () => {
  const checked = ['scripts', 'tests'].flatMap(folder => files(path.join(workspace, folder))).filter(file => file.endsWith('.py'));
  command('syntax-python', 'python3', ['-c', 'import json,sys,pathlib\nfor name in json.load(sys.stdin):\n p=pathlib.Path(name); compile(p.read_bytes(),str(p),"exec")'], JSON.stringify(checked));
  return { filesChecked: checked.length, bytecodeWritten: false };
});
check('manifest-dictionary-integrity', () => {
  manifest = JSON.parse(readFileSync(path.join(workspace, 'impact-cn-mod/manifest.json'), 'utf8'));
  const packageJSON = JSON.parse(readFileSync(path.join(workspace, 'package.json'), 'utf8'));
  const sandbox = {}; vm.createContext(sandbox); vm.runInContext(readFileSync(path.join(workspace, 'impact-cn-mod/dict.js'), 'utf8'), sandbox, { timeout: 5000 });
  dictionary = sandbox.IMPACT_CN_DICTIONARY;
  assert.equal(manifest.manifest_version, 3); assert.equal(packageJSON.version, manifest.version); assert.equal(dictionary.version, manifest.version);
  for (const collection of [dictionary.entries, dictionary.helpTopics]) {
    assert(Array.isArray(collection) && collection.length > 0);
    assert(collection.every(item => typeof item.id === 'string' && item.id.length > 0));
    assert.equal(new Set(collection.map(item => item.id)).size, collection.length, 'Duplicate dictionary/topic ID');
  }
  const entryIDs = new Set(dictionary.entries.map(item => item.id)), topics = new Map(dictionary.helpTopics.map(item => [item.id, item]));
  for (const entry of dictionary.entries) if (entry.helpTopicId) {
    assert(topics.has(entry.helpTopicId), 'Missing help topic: ' + entry.id);
    assert(topics.get(entry.helpTopicId).entryIds.includes(entry.id), 'Missing reverse topic association: ' + entry.id);
  }
  for (const topic of dictionary.helpTopics) for (const id of topic.entryIds) {
    assert(entryIDs.has(id), 'Missing associated dictionary entry: ' + topic.id);
    assert.equal(dictionary.entries.find(item => item.id === id).helpTopicId, topic.id, 'Mismatched topic association: ' + id);
  }
  return { version: manifest.version, dictionaryEntries: dictionary.entries.length, helpTopics: dictionary.helpTopics.length, dictionarySHA256: sha(readFileSync(path.join(workspace, 'impact-cn-mod/dict.js'))) };
});
for (const [name, file, arguments_, reportFile] of definitions) {
  if (!selected.includes(name)) { results.push({ name, status: 'SKIPPED', reason: skipBrowser ? 'Browser suites disabled by --skip-browser' : 'Not selected by --only' }); continue; }
  check(name, () => {
    command('suite-' + name, file.endsWith('.py') ? 'python3' : process.execPath, [file, ...arguments_]);
    const reportBytes = readFileSync(path.join(workspace, reportFile)), report = JSON.parse(reportBytes);
    assert.equal(report.status, 'PASS', 'Suite report did not pass');
    assert(report.realSiteAcceptance !== true && report.realNetworkQueries !== true, 'Unexpected live acceptance report');
    return { mode: report.mode || 'SYNTHETIC_ONLY', checksPassed: report.results?.filter(item => item.status === 'PASS').length || 0, report: 'workspace/' + reportFile, reportSHA256: sha(reportBytes) };
  });
}
check('isolated-package', () => {
  command('package-build', 'python3', ['scripts/package-extension.py']);
  const proof = command('package-verify', 'python3', ['-c', `import json,pathlib,zipfile,hashlib,re
root=pathlib.Path.cwd(); source=root/'impact-cn-mod'; manifest=json.loads((source/'manifest.json').read_text())
archive=root/'dist'/('impact-cn-mod-'+manifest['version']+'.zip')
expected={p.relative_to(source).as_posix():p.read_bytes() for p in source.rglob('*') if p.is_file() and p.name!='.DS_Store'}
required={'manifest.json'}
required.add(manifest['background']['service_worker']); required.add(manifest['action']['default_popup'])
for group in manifest['content_scripts']: required.update(group.get('js',[])); required.update(group.get('css',[]))
html=(source/manifest['action']['default_popup']).read_text()
for value in re.findall(r"""(?:src|href)=["']([^"']+)["']""",html):
 if not re.match(r'^(?:https?:|data:|#)',value): required.add(value)
assert len(expected)==12 and required.issubset(expected), 'Unexpected packaged files or missing resources'
with zipfile.ZipFile(archive) as bundle:
 assert bundle.testzip() is None, 'ZIP CRC failure'
 assert len(bundle.namelist())==len(expected) and set(bundle.namelist())==set(expected), 'ZIP resource mismatch'
 for name,data in expected.items(): assert bundle.read(name)==data, 'ZIP/source byte mismatch: '+name
print(json.dumps({'version':manifest['version'],'files':len(expected),'requiredResources':len(required),'crcVerified':True,'sourceBytesMatch':True,'bytes':archive.stat().st_size,'sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'archive':str(archive.relative_to(root))}))`]);
  return { ...JSON.parse(proof), generatedInIsolatedWorkspace: true };
});
check('original-files-preserved', () => { assert.deepEqual(fingerprints(), before, 'An original source, capture, report or delivery file changed during checks'); return { protectedFiles: protectedFiles.length }; });
const report = { mode: 'ISOLATED_SYNTHETIC_ENGINEERING_CHECKS', status: results.some(item => item.status === 'FAIL') ? 'FAIL' : 'PASS', date: new Date().toISOString(), nodeVersion: process.version, localDependenciesLinked: localDependencies, skipBrowser, requestedSuites: only, selectedSuites: selected, realSiteAcceptance: false, realNetworkQueries: false, completePageCoverage: false, completeAcceptance: false, originalSourceFingerprints: before, results };
writeFileSync(path.join(stage, 'engineering-report.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
console.log('VERIFY ' + report.status + '; ' + results.filter(item => item.status === 'PASS').length + ' groups passed, ' + results.filter(item => item.status === 'SKIPPED').length + ' suites skipped. Report: ' + path.relative(root, path.join(stage, 'engineering-report.json')));
process.exitCode = report.status === 'PASS' ? 0 : 1;

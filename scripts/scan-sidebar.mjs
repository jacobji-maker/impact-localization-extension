/** Read-only live sidebar inventory. No saved authentication or full HTML. */
import { createRequire } from 'node:module';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core'))); }
const project = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const profile = mkdtempSync(path.join(os.tmpdir(), 'impact-sidebar-scan-'));
let context;
let phase = 'browser-start';
function progress(value) { phase = value; console.log(`SCAN_PHASE ${value}`); }
function hiddenInput() {
  console.log('WAITING_AUTH_JSON: one credential JSON line; echo disabled; never saved.');
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  process.stdin.resume();
  return new Promise((resolve, reject) => {
    let data = '';
    const handler = chunk => {
      data += chunk.toString('utf8');
      if (data.includes('\u0003') || data.length > 32768) { cleanup(); reject(new Error('Input cancelled')); return; }
      if (!/[\r\n]/.test(data)) return;
      cleanup();
      try { resolve(JSON.parse(data.split(/[\r\n]/)[0])); } catch { reject(new Error('Invalid JSON; content suppressed')); }
      data = '';
    };
    const cleanup = () => { process.stdin.off('data', handler); if (process.stdin.isTTY) process.stdin.setRawMode(false); process.stdin.pause(); };
    process.stdin.on('data', handler);
  });
}
try {
  context = await chromium.launchPersistentContext(profile, { channel: 'chromium', executablePath: chromium.executablePath(), headless: false, viewport: { width: 1440, height: 1000 } });
  const page = context.pages()[0];
  progress('opening-login');
  await page.goto('https://demo.impact.com/secure/advertiser/engage/aview.ihtml?t=u', { waitUntil: 'domcontentloaded' });
  if (new URL(page.url()).hostname === 'demo.impact.com' && new URL(page.url()).pathname.includes('/secure/')) {
    console.log('AUTHENTICATED_PAGE_READY: using the current real page; no credential read.');
  } else if (process.argv.includes('--manual-login')) {
    console.log('MANUAL_LOGIN_READY: complete login in this separate inventory browser.');
  } else {
    const credentials = await hiddenInput();
    progress('username');
    await page.locator('input[name="j_username"]').fill(credentials.username);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    progress('password');
    await page.locator('input[type="password"]').fill(credentials.password);
    await page.getByRole('button', { name: /^(Sign in|Log in|Login|Continue)$/i }).click();
    credentials.username = ''; credentials.password = '';
  }
  progress('waiting-for-dashboard');
  await page.waitForURL(url => url.hostname === 'demo.impact.com' && url.pathname.includes('/secure/'), { timeout: 120000 });
  const host = '#adv-navigation impact-style-isolator';
  progress('waiting-for-sidebar');
  await page.locator(`${host} .product-name`).first().waitFor({ timeout: 30000 });
  const products = await page.locator(`${host} .product-name`).allTextContents();
  const snapshots = [];
  async function capture(product, menu) {
    const labels = await page.evaluate(() => {
      const root = document.querySelector('#adv-navigation impact-style-isolator')?.shadowRoot;
      const result = [];
      if (!root) return result;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        const el = node.parentElement;
        if (!el || el.closest('style,script,input,textarea,.account-btn,.profileBtn,.avatar-container')) continue;
        const text = node.nodeValue.trim();
        if (!text || text.length > 160 || !el.getClientRects().length || getComputedStyle(el).visibility === 'hidden' || !/[A-Za-z]/.test(text)) continue;
        const menuContainer = el.closest('.product-name,.subitem-label,.child-menu-content,.subchild-label');
        if (!menuContainer) continue;
        result.push({ text, tag: el.tagName, className: typeof el.className === 'string' ? el.className : '', parentClass: el.parentElement?.className || '' });
      }
      return result;
    });
    snapshots.push({ product, menu, labels });
  }
  for (const raw of products) {
    const product = raw.trim();
    progress(`product-${product}`);
    const selected = (await page.locator(`${host} .product-item.selected`).textContent()).trim();
    if (selected !== product) {
      await page.locator(`${host} .product-item`).filter({ hasText: new RegExp('^' + product + '$') }).click();
      await page.waitForURL(url => url.pathname.includes(`/secure/advertiser/${product.toLowerCase()}/`), { timeout: 30000 });
    }
    await page.waitForFunction(expected => document.querySelector('#adv-navigation impact-style-isolator')?.shadowRoot?.querySelector('.product-item.selected')?.textContent.trim() === expected, product);
    const expander = page.locator(`${host} .product-item.expander`);
    if (!(await expander.getAttribute('class')).split(/\s+/).includes('expanded')) await expander.click();
    await page.waitForTimeout(700);
    await capture(product, null);
    const menus = await page.locator(`${host} .subitem-label:visible`).allTextContents();
    for (const rawMenu of menus) {
      const menu = rawMenu.trim();
      progress(`menu-${product}-${menu}`);
      const label = page.locator(`${host} .subitem-label`).filter({ hasText: new RegExp('^' + menu.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$') });
      if (await label.count() !== 1) continue;
      await label.click({ timeout: 4000 });
      await page.locator(`${host} .product-item.selected`).waitFor({ timeout: 30000 });
      await page.waitForTimeout(200);
      await capture(product, menu);
      const nestedLabels = await page.locator(`${host} .child-menu-content span:visible`).allTextContents();
      for (const rawNested of nestedLabels) {
        const nested = rawNested.trim();
        if (!nested) continue;
        await page.locator(`${host} .child-menu-content span`).filter({ hasText: new RegExp('^' + nested.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$') }).click();
        await page.waitForTimeout(150);
        await capture(product, `${menu}/${nested}`);
      }
    }
    console.log(`SCANNED_PRODUCT ${product}: ${menus.length} menus`);
  }
  const structuredProducts = products.map(raw => {
    const source = raw.trim();
    const captured = snapshots.filter(snapshot => snapshot.product === source);
    const mainLabels = [...new Set(captured.flatMap(snapshot => snapshot.labels.filter(label => label.className.split(/\s+/).includes('subitem-label')).map(label => label.text)))];
    const menus = captured.filter(snapshot => snapshot.menu).map(snapshot => {
      const [menuSource, nested] = snapshot.menu.split('/');
      const labels = snapshot.labels.filter(label => label.parentClass.split(/\s+/).includes(nested ? 'subchild-label' : 'child-menu-content'));
      return { source: menuSource, ...(nested ? { nested } : {}), labels: [...new Set(labels.map(label => label.text))], labelTags: Object.fromEntries(labels.map(label => [label.text, label.tag.toLowerCase()])) };
    }).filter(menu => menu.labels.length);
    return { source, mainLabels, menus };
  });
  const inventory = {
    capturedAt: new Date().toISOString(), host: 'demo.impact.com', mode: 'REAL_NETWORK_READ_ONLY',
    captureMethod: 'Headed Playwright with real network, no extension, read-only DOM inspection and normal sidebar clicks.',
    sourceRoot: `${host}::shadow`, startURL: 'https://demo.impact.com/secure/advertiser/engage/aview.ihtml?t=u',
    selectors: { productOpener: '.product-item', expander: '.product-item.expander', productLabel: '.product-name', mainLabel: '.subitem-label', childLabel: '.child-menu-content a,.child-menu-content span', nestedLabel: '.subchild-label a' },
    products: structuredProducts, rawSnapshots: snapshots, privateDataSaved: false
  };
  mkdirSync(path.join(project, 'docs'), { recursive: true });
  writeFileSync(path.join(project, 'docs/sidebar-dom-scan.json'), JSON.stringify(inventory, null, 2));
  console.log(`SIDEBAR_SCAN_COMPLETE ${snapshots.length} snapshots; docs/sidebar-dom-scan.json`);
} catch (error) {
  console.log(`SIDEBAR_SCAN_FAILED phase=${phase}; type=${error.name || 'Error'}; no credential-bearing error exported`);
  process.exitCode = 2;
} finally {
  if (process.stdin.isTTY) process.stdin.setRawMode(false);
  if (context) await context.close();
  rmSync(profile, { recursive: true, force: true });
}

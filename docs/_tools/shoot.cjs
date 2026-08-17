const path = '/usr/lib/node_modules/openclaw/node_modules/playwright-core';
const { chromium } = require(path);
const fs = require('fs');

const BASE = 'https://sikons.herlambang.store';
const OUT = '/home/adhinath/JOKI/Sistem-Informasi-Titip-Jual/docs/screenshots';
fs.mkdirSync(OUT, { recursive: true });

const CREDS = {
  penyalur: { email: 'admin@sikons.com', password: 'password123' },
  sales: { email: 'rudi@sikons.com', password: 'password123' },
  mitra: { email: 'budi@sikons.com', password: 'password123' },
  pemasok: { email: 'wings@sikons.com', password: 'password123' },
};

async function shoot(page, name) {
  await page.waitForTimeout(1300);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log('SHOT', name, page.url());
}

async function login(page, cred) {
  await page.goto(`${BASE}/auth/login`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.fill('input[type="email"]', cred.email);
  await page.fill('input[type="password"]', cred.password);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2500);
  await page.waitForLoadState('networkidle');
}

// click first action button (Detail) in first row; returns the resulting URL
async function openFirstDetail(page) {
  let el = page.locator('tbody tr:first-child a[href]').first();
  if (await el.count() > 0) {
    await el.click();
  } else {
    el = page.locator('tbody tr:first-child button').first();
    if (await el.count() === 0) return null;
    await el.click();
  }
  await page.waitForTimeout(2000);
  return page.url();
}

(async () => {
  const browser = await chromium.launch({
    executablePath: '/home/adhinath/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-blink-features=AutomationControlled'],
  });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
  });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    try { localStorage.setItem('nuxt-color-mode', 'light'); } catch (e) {}
    document.cookie = 'nuxt-color-mode=light; path=/';
  });
  await page.emulateMedia({ colorScheme: 'light' });

  // Login page
  await page.goto(`${BASE}/auth/login`, { waitUntil: 'networkidle', timeout: 30000 });
  await shoot(page, '01-login');

  // ── ADMIN / PENYALUR ──
  await login(page, CREDS.penyalur);
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' }); await shoot(page, '02-dashboard');

  await page.goto(`${BASE}/master/pemasok`, { waitUntil: 'networkidle' }); await shoot(page, '03-master-pemasok');
  await page.goto(`${BASE}/master/produk`, { waitUntil: 'networkidle' }); await shoot(page, '04-master-produk');
  await page.goto(`${BASE}/master/mitra`, { waitUntil: 'networkidle' }); await shoot(page, '05-master-mitra');
  await page.goto(`${BASE}/master/gudang`, { waitUntil: 'networkidle' }); await shoot(page, '06-master-gudang');
  await page.goto(`${BASE}/master/pengguna`, { waitUntil: 'networkidle' }); await shoot(page, '07-master-pengguna');
  await page.goto(`${BASE}/stok-gudang`, { waitUntil: 'networkidle' }); await shoot(page, '08-stok-gudang');

  // Penerimaan list + detail + print
  await page.goto(`${BASE}/penerimaan-barang`, { waitUntil: 'networkidle' }); await shoot(page, '09-penerimaan-list');
  let url = await openFirstDetail(page); await shoot(page, '10-penerimaan-detail');
  if (url) { const m = url.match(/\/penerimaan-barang\/(\d+)/); if (m) { await page.goto(`${BASE}/penerimaan-barang/${m[1]}/print`, { waitUntil: 'networkidle' }); await shoot(page, '11-penerimaan-print'); } }

  // Penyaluran list + detail + print
  await page.goto(`${BASE}/penyaluran`, { waitUntil: 'networkidle' }); await shoot(page, '12-penyaluran-list');
  url = await openFirstDetail(page); await shoot(page, '13-penyaluran-detail');
  if (url) { const m = url.match(/\/penyaluran\/(\d+)/); if (m) { await page.goto(`${BASE}/penyaluran/${m[1]}/print`, { waitUntil: 'networkidle' }); await shoot(page, '14-penyaluran-print'); } }

  // Faktur list
  await page.goto(`${BASE}/faktur`, { waitUntil: 'networkidle' }); await shoot(page, '15-faktur-list');

  // Opname list + detail
  await page.goto(`${BASE}/opname-stok`, { waitUntil: 'networkidle' }); await shoot(page, '16-opname-list');
  await openFirstDetail(page); await shoot(page, '17-opname-detail');

  // Rekonsiliasi penyalur list + detail
  await page.goto(`${BASE}/rekonsiliasi-penyalur`, { waitUntil: 'networkidle' }); await shoot(page, '18-rekonsiliasi-penyalur-list');
  await openFirstDetail(page); await shoot(page, '19-rekonsiliasi-penyalur-detail');

  // Profile
  await page.goto(`${BASE}/auth/profile`, { waitUntil: 'networkidle' }); await shoot(page, '20-profile');

  // ── MITRA ──
  await ctx.clearCookies();
  await login(page, CREDS.mitra);
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' }); await shoot(page, '21-mitra-dashboard');
  await page.goto(`${BASE}/penyaluran`, { waitUntil: 'networkidle' }); await shoot(page, '22-mitra-penyaluran');
  await page.goto(`${BASE}/rekonsiliasi-mitra`, { waitUntil: 'networkidle' }); await shoot(page, '23-mitra-rekonsiliasi');

  // ── SALES ──
  await ctx.clearCookies();
  await login(page, CREDS.sales);
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' }); await shoot(page, '24-sales-dashboard');
  await page.goto(`${BASE}/opname-stok`, { waitUntil: 'networkidle' }); await shoot(page, '25-sales-opname');

  // ── PEMASOK ──
  await ctx.clearCookies();
  await login(page, CREDS.pemasok);
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' }); await shoot(page, '26-pemasok-dashboard');
  await page.goto(`${BASE}/master/produk`, { waitUntil: 'networkidle' }); await shoot(page, '27-pemasok-produk');

  await browser.close();
  console.log('DONE');
})();

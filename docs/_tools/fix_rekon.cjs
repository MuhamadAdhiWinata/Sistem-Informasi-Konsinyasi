const path = '/usr/lib/node_modules/openclaw/node_modules/playwright-core';
const { chromium } = require(path);
const BASE = 'https://sikons.herlambang.store';
const OUT = '/home/adhinath/JOKI/Sistem-Informasi-Titip-Jual/docs/screenshots';

(async () => {
  const browser = await chromium.launch({
    executablePath: '/home/adhinath/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-blink-features=AutomationControlled'],
  });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
  });
  const page = await ctx.newPage();
  await page.addInitScript(() => { try { localStorage.setItem('nuxt-color-mode', 'light'); } catch (e) {} document.cookie = 'nuxt-color-mode=light; path=/'; });
  await page.emulateMedia({ colorScheme: 'light' });

  await page.goto(`${BASE}/auth/login`, { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', 'admin@sikons.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2500);
  await page.waitForLoadState('networkidle');

  await page.goto(`${BASE}/rekonsiliasi-penyalur`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  // click first "Detail" button (UButton with trailing chevron)
  const btn = page.locator('button:has-text("Detail")').first();
  if (await btn.count() > 0) {
    await btn.click();
    await page.waitForTimeout(2000);
  }
  console.log('DETAIL URL:', page.url());
  await page.screenshot({ path: `${OUT}/19-rekonsiliasi-penyalur-detail.png` });
  console.log('SAVED 19');

  await browser.close();
})();

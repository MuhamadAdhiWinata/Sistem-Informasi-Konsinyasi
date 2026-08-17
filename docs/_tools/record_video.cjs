const path = '/usr/lib/node_modules/openclaw/node_modules/playwright-core';
const { chromium } = require(path);
const fs = require('fs');
const BASE = 'https://sikons.herlambang.store';
const OUT = '/home/adhinath/JOKI/Sistem-Informasi-Titip-Jual/docs/video';
fs.mkdirSync(OUT, { recursive: true });

const pause = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch({
    executablePath: '/home/adhinath/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-blink-features=AutomationControlled'],
  });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
    recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
  });
  const page = await ctx.newPage();
  await page.addInitScript(() => { try { localStorage.setItem('nuxt-color-mode', 'light'); } catch (e) {} document.cookie = 'nuxt-color-mode=light; path=/'; });
  await page.emulateMedia({ colorScheme: 'light' });

  const goto = async (p) => { await page.goto(`${BASE}${p}`, { waitUntil: 'networkidle' }); await pause(1800); };

  // Login
  await goto('/auth/login');
  await page.fill('input[type="email"]', 'admin@sikons.com');
  await page.fill('input[type="password"]', 'password123');
  await pause(800);
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
  await pause(2500);

  // Walkthrough
  await goto('/');
  await goto('/master/produk');
  await goto('/master/mitra');
  await goto('/master/pengguna');
  await goto('/stok-gudang');
  await goto('/penerimaan-barang');
  await goto('/penyaluran');
  await page.locator('tbody tr:first-child button').first().click().catch(() => {});
  await pause(2200);
  await goto('/faktur');
  await goto('/opname-stok');
  await goto('/rekonsiliasi-penyalur');
  await goto('/auth/profile');
  await pause(1500);

  await ctx.close();
  await browser.close();

  const files = fs.readdirSync(OUT).filter(f => f.endsWith('.webm'));
  console.log('VIDEO FILES:', files);
})();

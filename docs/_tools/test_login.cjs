const path = '/usr/lib/node_modules/openclaw/node_modules/playwright-core';
const { chromium } = require(path);

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
  await page.goto('https://sikons.herlambang.store/auth/login', { waitUntil: 'networkidle', timeout: 30000 });
  console.log('TITLE:', await page.title());
  console.log('URL:', page.url());
  // fill login
  await page.fill('input[type="email"]', 'admin@sikons.com').catch(e => console.log('email fill err', e.message));
  await page.fill('input[type="password"]', 'password123').catch(e => console.log('pw fill err', e.message));
  await page.click('button[type="submit"]').catch(e => console.log('click err', e.message));
  await page.waitForTimeout(4000);
  console.log('AFTER LOGIN URL:', page.url());
  console.log('BODY HEADING:', await page.locator('h1').first().textContent().catch(() => 'none'));
  await browser.close();
})();

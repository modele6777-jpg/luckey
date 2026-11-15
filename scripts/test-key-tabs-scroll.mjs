import { chromium, webkit } from '@playwright/test';
import assert from 'node:assert/strict';
const browser = process.env.LUCKEY_TEST_BROWSER === 'webkit'
  ? await webkit.launch({ executablePath: process.env.LUCKEY_WEBKIT_EXECUTABLE })
  : await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
try {
  const page = await browser.newPage({viewport: {width: 630, height: 700}});
  await page.route('https://**/*', route => route.abort());
  await page.goto((process.env.LUCKEY_TEST_BASE_URL || 'http://127.0.0.1:4174') + '/calm/index.html');
  await page.locator('.key-tabs-anchor').waitFor();
  for (const width of [390, 630, 1100]) {
    await page.setViewportSize({width, height:700});
    await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
    await page.waitForTimeout(100);
    const anchor = await page.locator('.key-tabs-anchor').evaluate(el => el.getBoundingClientRect().top + window.scrollY);
    for (const offset of [30, 60, 120, 280, 160, 65, 35]) {
      await page.evaluate(y => window.scrollTo({top:y,behavior:'instant'}), anchor + offset);
      await page.waitForFunction(() => getComputedStyle(document.querySelector('.view-tabs-container')).position === 'fixed', null, {timeout:2000});
      const geometry = await page.evaluate(() => {
        const tabs = document.querySelector('.view-tabs-container');
        const rect = tabs.getBoundingClientRect();
        const header = document.querySelector('.top-nav').getBoundingClientRect();
        return {top:rect.top, bottom:header.bottom, width:rect.width, position:getComputedStyle(tabs).position};
      });
      assert.equal(geometry.position, 'fixed', JSON.stringify({width,offset,anchor,geometry, state:await page.evaluate(()=>({y:scrollY,anchor:document.querySelector('.key-tabs-anchor').getBoundingClientRect().top,marker:document.querySelector('.key-tabs-marker').getBoundingClientRect().top,header:document.querySelector('.top-nav').offsetHeight}))}));
      assert(Math.abs(geometry.top - Math.ceil(geometry.bottom)) <= 1, JSON.stringify(geometry));
      assert(geometry.width <= width + 1);
    }
    await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
    await page.waitForTimeout(100);
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.view-tabs-container')).position === 'relative', null, {timeout:2000});
  }
  console.log('PASS: Key tabs stay fixed below the header through scroll, reverse scroll and resize');
} finally { await browser.close(); }

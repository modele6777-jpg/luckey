import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  headless: true,
  args: ['--no-sandbox'],
});
const base = process.env.LUCKEY_TEST_URL || 'http://127.0.0.1:4173';
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    const d = new Date();
    localStorage.setItem('lu_unlocked_date', `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
    sessionStorage.setItem('profileModalDismissed', '1');
  });

  await page.goto(`${base}/key`);
  const keyFrame = page.locator('iframe[title="Key"]');
  await keyFrame.waitFor({ state: 'visible', timeout: 30000 });
  await keyFrame.evaluate(element => {
    const url = new URL(element.src);
    url.searchParams.set('no_auto', '1');
    element.src = url.toString();
  });
  await page.waitForFunction(() => typeof document.querySelector('iframe[title="Key"]')?.contentWindow?.startPractice === 'function');

  const cardTitle = await keyFrame.evaluate(element =>
    [...element.contentDocument.querySelectorAll('.ex-card-title')]
      .find(title => title.textContent.includes('연습 87.'))?.textContent.trim()
  );
  assert(cardTitle?.includes('연습 87.'), 'Exercise card displays global number 87');

  await keyFrame.evaluate(element => element.contentWindow.startPractice(87));
  const frame = page.frameLocator('iframe[title="Key"]');
  await frame.locator('#modal-practice').waitFor({ state: 'visible' });
  assert.equal(
    await frame.locator('#studio-title').textContent(),
    '연습 87. 자신의 직감 신뢰하기',
    'Exercise detail displays the same global number and title as the card'
  );
  assert.deepEqual(errors, [], 'Key page has no uncaught browser errors');
  console.log('PASS: Key card and detail both display exercise 87 with the same title.');
} finally {
  await browser.close();
}

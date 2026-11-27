import { expect, test, type Locator, type Page } from '@playwright/test';

async function openLucyMaster(page: Page) {
  await page.addInitScript(() => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    localStorage.setItem('lu_unlocked_date', today);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
    sessionStorage.setItem('profileModalDismissed', '1');
    sessionStorage.setItem('lucy_master_mode', 'on');
  });
  await page.goto('/chat');
  const lockScreen = page.locator('[data-pin-screen]');
  if (await lockScreen.count()) {
    for (const digit of '1202') await page.keyboard.press(digit);
    await expect(lockScreen).toHaveCount(0);
  }
  await expect(page.locator('#duo-content-viewport [data-duo-divination-tarot="true"]')).toBeVisible();
  await expect(page.locator('#duo-lucy-viewport .lucy-chat-header')).toBeVisible();
}

async function expectHeaderButtonsToBeHitTargets(header: Locator) {
  const checks = await header.locator('button:visible').evaluateAll((buttons) => buttons.map((button) => {
    const rect = button.getBoundingClientRect();
    const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    return {
      label: button.getAttribute('aria-label') ?? button.textContent?.trim() ?? 'unnamed header button',
      isOwnHitTarget: hit === button || (hit instanceof Node && button.contains(hit)),
      interceptedBy: hit?.closest('button')?.getAttribute('aria-label') ?? hit?.tagName ?? 'none',
    };
  }));

  expect(checks.length, 'the visible header has actionable buttons').toBeGreaterThan(0);
  expect(checks.filter((check) => !check.isOwnHitTarget), 'header controls must win center-point hit-testing over the invisible divider control').toEqual([]);
}

async function expectGuideOpensFromHeader(page: Page, header: Locator, guideId: string) {
  await header.locator('[data-page-guide-button]').tap();
  const dialog = page.locator(`[data-page-guide="${guideId}"]`);
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: '확인' }).tap();
  await expect(dialog).toHaveCount(0);
}

test('expanded portrait header controls win touch hit-testing in both pane orders', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 900 });
  await openLucyMaster(page);
  const root = page.locator('html');
  await expect(root).toHaveClass(/duo-unfolded-portrait/);
  await expect(root).not.toHaveClass(/duo-panels-swapped/);

  const lowerLucyHeader = page.locator('#duo-lucy-viewport .lucy-chat-header');
  await expectHeaderButtonsToBeHitTargets(lowerLucyHeader);
  await expectGuideOpensFromHeader(page, lowerLucyHeader, 'master');

  // The divider's transparent 48px hit region must remain usable on its upper half.
  const dividerUpperHitStillWorks = await page.locator('[data-duo-divider-swap]').evaluate((button) => {
    const rect = button.getBoundingClientRect();
    const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + 16);
    return hit === button || (hit instanceof Node && button.contains(hit));
  });
  expect(dividerUpperHitStillWorks).toBe(true);

  // Use the real divider pointer-up handler to move Lucy above the content pane.
  await page.evaluate(() => {
    const button = document.querySelector<HTMLButtonElement>('[data-duo-divider-swap]');
    if (!button) throw new Error('Duo divider control is missing');
    const rect = button.getBoundingClientRect();
    const originalNow = Date.now;
    let timestamp = originalNow();
    const tap = () => button.dispatchEvent(new PointerEvent('pointerup', {
      bubbles: true,
      pointerType: 'touch',
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + 16,
    }));
    try {
      Date.now = () => timestamp;
      tap();
      timestamp += 100;
      tap();
    } finally {
      Date.now = originalNow;
    }
  });
  await expect(root).toHaveClass(/duo-panels-swapped/);

  const lowerCosmicHeader = page.locator('#duo-content-viewport [data-cosmic-room-header]');
  await expectHeaderButtonsToBeHitTargets(lowerCosmicHeader);
  await expectGuideOpensFromHeader(page, lowerCosmicHeader, 'cosmic-pro');
});

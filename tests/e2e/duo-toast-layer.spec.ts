import { expect, test, type Page } from '@playwright/test';

async function openLucyMaster(page: Page) {
  await page.addInitScript(() => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    localStorage.setItem('lu_unlocked_date', today);
    localStorage.setItem('lucy_chat_auto_tts', 'false');
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

test('expanded portrait auto-read notice escapes pane clipping and stacks above both panes', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 900 });
  await openLucyMaster(page);
  await expect(page.locator('html')).toHaveClass(/duo-unfolded-portrait/);

  const toggle = page.locator('#duo-lucy-viewport [data-auto-tts-toggle="true"]');
  await expect(toggle).toBeVisible();
  await toggle.tap();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');

  const layer = page.locator('body > [data-auto-tts-toast-layer="true"]');
  const toast = layer.locator('[data-auto-tts-toast="true"]');
  await expect(toast).toBeVisible({ timeout: 1500 });
  await expect(toast).toContainText('자동읽기 ON');

  const details = await layer.evaluate((element) => {
    const style = getComputedStyle(element);
    const paneZIndices = Array.from(document.querySelectorAll<HTMLElement>('#duo-content-viewport, #duo-lucy-viewport'))
      .map(pane => Number.parseInt(getComputedStyle(pane).zIndex, 10) || 0);
    return {
      parentTag: element.parentElement?.tagName,
      position: style.position,
      zIndex: Number.parseInt(style.zIndex, 10),
      pointerEvents: style.pointerEvents,
      topPaneZIndex: Math.max(...paneZIndices),
    };
  });

  expect(details.parentTag).toBe('BODY');
  expect(details.position).toBe('fixed');
  expect(details.zIndex).toBe(9999);
  expect(details.zIndex).toBeGreaterThan(details.topPaneZIndex);
  expect(details.pointerEvents).toBe('none');
});

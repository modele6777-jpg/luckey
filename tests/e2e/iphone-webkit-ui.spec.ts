import { expect, test } from '@playwright/test';

async function openLucy(page, path = '/chat') {
  await page.goto(path);
  const lockScreen = page.locator('[data-pin-screen]');
  if (await lockScreen.count()) {
    for (const digit of '1202') await page.keyboard.press(digit);
    await expect(lockScreen).toHaveCount(0);
  }
  await expect(page.locator('.lucy-chat-footer')).toBeVisible();
  await expect(page.locator('.lucy-chat-footer textarea')).toBeVisible();
}

test('update modal changelog copy stays visible in WebKit light and dark themes', async ({ page }) => {
  await openLucy(page, '/chat?mode=pro');
  await page.evaluate(() => sessionStorage.setItem('prism_refresh_update_notice', '1'));
  await page.reload();

  const modal = page.locator('.update-notice-modal');
  await expect(modal).toBeVisible();
  const summary = modal.locator('.update-notice-summary').first();
  const item = modal.locator('.update-notice-item > span:not(.text-amber-500)').first();
  await expect(summary).toBeVisible();
  await expect(item).toBeVisible();

  const readRenderedText = async (locator) => locator.evaluate((element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      text: element.textContent?.trim() ?? '',
      color: style.color,
      textFill: style.getPropertyValue('-webkit-text-fill-color'),
      opacity: Number(style.opacity),
      visibility: style.visibility,
      width: rect.width,
      height: rect.height,
    };
  });
  const lightSummary = await readRenderedText(summary);
  const lightItem = await readRenderedText(item);
  expect(lightSummary.text.length).toBeGreaterThan(0);
  expect(lightSummary).toMatchObject({ color: 'rgb(15, 23, 42)', textFill: 'rgb(15, 23, 42)', visibility: 'visible' });
  expect(lightSummary.opacity).toBeGreaterThan(0);
  expect(lightSummary.width).toBeGreaterThan(0);
  expect(lightSummary.height).toBeGreaterThan(0);
  expect(lightItem.text.length).toBeGreaterThan(0);
  expect(lightItem.textFill).toBe('rgb(51, 65, 85)');

  await page.locator('html').evaluate((element) => {
    element.classList.remove('light');
    element.classList.add('dark');
    element.style.colorScheme = 'dark';
  });
  await expect.poll(() => readRenderedText(summary)).toMatchObject({
    color: 'rgb(248, 250, 252)',
    textFill: 'rgb(248, 250, 252)',
  });
  await expect.poll(() => readRenderedText(item)).toMatchObject({
    textFill: 'rgb(203, 213, 225)',
  });
});

test('AI detection badge appears only for a focused non-casual query', async ({ page }) => {
  await openLucy(page);
  const composer = page.locator('.lucy-chat-footer textarea');
  const badge = page.locator('.lucy-auto-detect-badge');

  await composer.fill('홍국기문(기문둔갑)으로 지금 막힌 상황을 분석해줘.');
  await expect(badge).toContainText('AI 감지');
  await expect(badge).toBeVisible();

  await composer.fill('오늘 어땠어? 사소한 일상 이야기를 편하게 나누고 싶어.');
  await expect(badge).toHaveCount(0);
});

test('Big Bang left and right controls stay disabled in Lucy chat', async ({ page }) => {
  await openLucy(page);
  const bigBang = page.locator('div[data-bigbang="true"]');
  await expect(bigBang).toBeVisible();
  await expect(bigBang).toHaveAttribute('data-cycle-navigation-disabled', 'true');
  const box = await bigBang.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error('Big Bang hit area is missing');

  const chatUrl = page.url();
  const centerY = box.y + box.height / 2;
  for (const offsetX of [-36, 36]) {
    await page.touchscreen.tap(box.x + box.width / 2 + offsetX, centerY);
    await expect(page).toHaveURL(chatUrl);
    await expect(page.locator('.lucy-chat-footer')).toBeVisible();
  }
});

test('mobile composer and input remain inside the visible WebKit viewport after keyboard-sized resize', async ({ page }) => {
  await openLucy(page);
  const composer = page.locator('.lucy-chat-footer textarea');
  await composer.fill('모바일 입력창 클리핑 회귀 확인입니다.\n두 번째 줄에서도 입력이 잘리지 않는지 검사합니다.');
  await composer.focus();
  await page.setViewportSize({ width: 402, height: 400 });
  await expect.poll(() => page.evaluate(() => {
    const footer = document.querySelector('.lucy-chat-footer');
    return footer ? footer.getBoundingClientRect().bottom : Number.POSITIVE_INFINITY;
  })).toBeLessThanOrEqual(402);

  const geometry = await page.evaluate(() => {
    const footer = document.querySelector('.lucy-chat-footer');
    const input = document.querySelector('.lucy-chat-footer textarea');
    if (!footer || !input) throw new Error('Lucy composer DOM is missing');
    const footerRect = footer.getBoundingClientRect();
    const inputRect = input.getBoundingClientRect();
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    return {
      viewportHeight,
      viewportWidth: window.visualViewport?.width ?? window.innerWidth,
      footerTop: footerRect.top,
      footerBottom: footerRect.bottom,
      inputTop: inputRect.top,
      inputBottom: inputRect.bottom,
      inputRight: inputRect.right,
      inputClientWidth: input.clientWidth,
      inputScrollWidth: input.scrollWidth,
    };
  });

  expect(geometry.footerTop).toBeGreaterThanOrEqual(-1);
  expect(geometry.footerBottom).toBeLessThanOrEqual(geometry.viewportHeight + 2);
  expect(geometry.inputTop).toBeGreaterThanOrEqual(geometry.footerTop - 1);
  expect(geometry.inputBottom).toBeLessThanOrEqual(geometry.footerBottom + 1);
  expect(geometry.inputBottom).toBeLessThanOrEqual(geometry.viewportHeight + 2);
  expect(geometry.inputRight).toBeLessThanOrEqual(geometry.viewportWidth + 2);
  expect(geometry.inputScrollWidth).toBeLessThanOrEqual(geometry.inputClientWidth + 2);
});

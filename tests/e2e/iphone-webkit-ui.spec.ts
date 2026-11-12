import { expect, test } from '@playwright/test';

async function openLucy(page, path = '/chat') {
  await page.addInitScript(() => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    localStorage.setItem('lu_unlocked_date', today);
  });
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
  await expect(summary).toContainText('Lucy 최신 대화 복귀·Key 상단 탭 고정');
  await expect(item).toContainText('Lucy 채팅에서 과거 대화까지 스크롤하면 최근 대화로 돌아가기 버튼이 나타납니다.');

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

  const visibleGlyphOpacity = await summary.evaluate((element) => {
    let opacity = 1;
    let current: HTMLElement | null = element as HTMLElement;
    while (current) {
      opacity *= Number(getComputedStyle(current).opacity);
      current = current.parentElement;
    }
    return opacity;
  });
  expect(visibleGlyphOpacity).toBeGreaterThan(0.95);

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

test('Lucy Pro engine count opens the visible 307-entry catalog and meanings', async ({ page }) => {
  await openLucy(page, '/chat?mode=pro');
  const trigger = page.getByRole('button', { name: /Lucy Pro 엔진과 관점 목록/ });
  await expect(trigger).toBeVisible();
  await trigger.click();

  const dialog = page.getByRole('dialog', { name: 'Lucy Pro 엔진·관점 안내' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('등록 목록 307개');
  await expect(dialog).toContainText('15개 기초 도구');
  await expect(dialog).toContainText('292개 심층 관점');
  await expect(dialog).toContainText('각각 독립 계산기가 아닙니다');
  await dialog.getByText('관점 뜻과 답변별 상태 안내', { exact: true }).click();
  await expect(dialog).toContainText('상징 참고');
  await expect.poll(() => dialog.evaluate(element => getComputedStyle(element).opacity)).toBe('1');

  const search = dialog.getByRole('searchbox', { name: '엔진과 관점 검색' });
  await search.fill('사주명리');
  await expect(dialog).toContainText('사주명리');
  await expect(dialog).toContainText('개 표시');
  await search.fill('실시간 행성 트랜짓');
  await expect(dialog).toContainText('실시간 행성 트랜짓');
  await expect(dialog.getByRole('link', { name: /Cosmobiology/ })).toBeVisible();
  await search.fill('오행 바이오에너지');
  await expect(dialog).toContainText('이름을 바탕으로 한 앱 내 해석');
  await expect(dialog).toContainText('이름 기반 앱 내 해석 · 직접 출처 미확인');
});

test('Lucy Pro engine catalog fills the mobile viewport and its list scrolls without auto-opening the keyboard', async ({ page }) => {
  await openLucy(page, '/chat?mode=pro');
  await page.getByRole('button', { name: /Lucy Pro 엔진과 관점 목록/ }).click();

  const dialog = page.getByRole('dialog', { name: 'Lucy Pro 엔진·관점 안내' });
  const search = dialog.getByRole('searchbox', { name: '엔진과 관점 검색' });
  await expect(dialog).toBeVisible();
  const closeButton = dialog.getByRole('button', { name: '엔진 목록 닫기' });
  await expect(closeButton).toBeVisible();
  await expect(closeButton).toContainText('닫기');
  await expect(search).not.toBeFocused();

  const viewport = await page.evaluate(() => ({
    width: window.visualViewport?.width ?? window.innerWidth,
    height: window.visualViewport?.height ?? window.innerHeight,
  }));
  const dialogBounds = await dialog.boundingBox();
  expect(dialogBounds).not.toBeNull();
  if (!dialogBounds) throw new Error('Lucy engine catalog dialog is missing');
  expect(dialogBounds.width).toBeGreaterThan(viewport.width * 0.94);
  expect(dialogBounds.height).toBeGreaterThan(viewport.height * 0.94);

  const list = page.getByTestId('lucy-engine-catalog-list');
  const metrics = await list.evaluate(element => {
    const style = getComputedStyle(element);
    return {
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      overflowY: style.overflowY,
      touchAction: style.touchAction,
    };
  });
  expect(metrics.clientHeight).toBeGreaterThan(viewport.height * 0.45);
  expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight + 500);
  expect(metrics.overflowY).toBe('auto');
  expect(metrics.touchAction).toBe('pan-y');

  await list.evaluate(element => { element.scrollTop = 400; });
  await expect.poll(() => list.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
  await closeButton.click();
  await expect(dialog).toHaveCount(0);
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

test('Lucy can return to the latest conversation and tap blank header space to reach its top', async ({ page }) => {
  await openLucy(page);
  const messages = page.locator('.lucy-chat-main');
  await messages.evaluate(element => {
    const wrapper = element.firstElementChild;
    if (!wrapper) throw new Error('Lucy message wrapper is missing');
    for (let index = 0; index < 8; index += 1) {
      const spacer = document.createElement('div');
      spacer.dataset.scrollRegressionFixture = 'true';
      spacer.style.height = '260px';
      wrapper.appendChild(spacer);
    }
  });
  await page.waitForTimeout(350);

  const returnButton = page.getByRole('button', { name: '최근 대화로 돌아가기' });
  await messages.evaluate(element => { element.scrollTop = 0; element.dispatchEvent(new Event('scroll')); });
  await expect(returnButton).toBeVisible();
  await returnButton.click();
  await expect.poll(() => messages.evaluate(element => element.scrollHeight - element.scrollTop - element.clientHeight)).toBeLessThan(3);
  await expect(returnButton).toBeHidden();

  await page.getByRole('button', { name: '대화 검색' }).click();
  await messages.evaluate(element => { element.scrollTop = 400; element.dispatchEvent(new Event('scroll')); });
  await expect.poll(() => messages.evaluate(element => element.scrollTop)).toBeGreaterThan(80);
  const header = page.locator('[data-lucy-header-tap-scroll="true"]');
  await header.evaluate(element => { (element as HTMLElement).style.paddingBottom = '40px'; });
  const headerBox = await header.boundingBox();
  expect(headerBox).not.toBeNull();
  if (!headerBox) throw new Error('Lucy chat header is missing');
  const blankAreaY = headerBox.y + headerBox.height - 2;
  expect(blankAreaY).toBeGreaterThan(76);
  await page.mouse.click(headerBox.x + headerBox.width / 2, blankAreaY);
  await expect.poll(() => messages.evaluate(element => element.scrollTop)).toBeLessThan(3);
  await expect(returnButton).toBeVisible();
});

test('Key channel tabs stay fixed below the brand bar while the page scrolls', async ({ page }) => {
  await page.goto('/calm/index.html?no_auto=1');
  const tabs = page.locator('.view-tabs-container');
  const topNav = page.locator('.top-nav');
  await expect(tabs).toBeVisible();
  await expect(topNav).toBeVisible();
  await page.evaluate(() => {
    const tabs = document.querySelector('.view-tabs-container');
    if (!tabs) throw new Error('Key tab row is missing');
    const tabDocumentTop = tabs.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, tabDocumentTop + 400);
  });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

  const layout = await page.evaluate(() => {
    const nav = document.querySelector('.top-nav');
    const tabs = document.querySelector('.view-tabs-container');
    if (!nav || !tabs) throw new Error('Key navigation elements are missing');
    return {
      navTop: nav.getBoundingClientRect().top,
      navBottom: nav.getBoundingClientRect().bottom,
      tabsTop: tabs.getBoundingClientRect().top,
      tabsPosition: getComputedStyle(tabs).position,
    };
  });
  expect(layout.tabsPosition).toBe('sticky');
  expect(layout.navTop).toBeGreaterThanOrEqual(-1);
  expect(layout.tabsTop).toBeGreaterThanOrEqual(layout.navBottom - 2);
  expect(layout.tabsTop).toBeLessThanOrEqual(layout.navBottom + 3);
});

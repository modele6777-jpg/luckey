import { expect, test } from '@playwright/test';

async function openLucy(page, path = '/chat') {
  await page.addInitScript(() => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    localStorage.setItem('lu_unlocked_date', today);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
    sessionStorage.setItem('profileModalDismissed', '1');
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

async function openPrologue(page, path = '/todo') {
  await page.addInitScript(() => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    localStorage.setItem('lu_unlocked_date', today);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
    sessionStorage.setItem('profileModalDismissed', '1');
  });
  await page.goto(path);
  const lockScreen = page.locator('[data-pin-screen]');
  if (await lockScreen.count()) {
    for (const digit of '1202') await page.keyboard.press(digit);
    await expect(lockScreen).toHaveCount(0);
  }
  await expect(page.locator('#bigbang-omnibutton')).toBeVisible();
}

async function openKeyChannel(page) {
  await page.addInitScript(() => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    localStorage.setItem('lu_unlocked_date', today);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
    sessionStorage.setItem('profileModalDismissed', '1');
  });
  await page.goto('/key');
  const lockScreen = page.locator('[data-pin-screen]');
  if (await lockScreen.count()) {
    for (const digit of '1202') await page.keyboard.press(digit);
    await expect(lockScreen).toHaveCount(0);
  }
  await expect(page.locator('iframe[title="Key"]')).toBeVisible();
  await expect(page.locator('div[data-bigbang="true"]')).toBeVisible();
  const dismissInstall = page.getByRole('button', { name: '다음에 할게요' });
  if (await dismissInstall.isVisible().catch(() => false)) await dismissInstall.click();
  await expect.poll(() => page.locator('iframe[title="Key"]').evaluate((frame) =>
    (frame as HTMLIFrameElement).contentDocument?.readyState === 'complete'
  )).toBe(true);
  await expect(lockScreen).toHaveCount(0);
  await page.waitForTimeout(200);
}

async function expectHiddenDirectionTarget(bigBang: import('@playwright/test').Locator, direction: string, channel: string) {
  const glyphLayer = bigBang.locator('[data-bigbang-direction-targets]');
  await expect(glyphLayer).toBeHidden();
  await expect(glyphLayer.locator('svg')).toHaveCount(0);
  const target = bigBang.locator(`[data-bigbang-direction-target="${direction}"][data-bigbang-target-channel="${channel}"]`);
  await expect(target).toHaveCount(1);
  await expect(target).toBeHidden();
}

async function setContentScrollBoundary(page, edge: 'top' | 'bottom') {
  await page.evaluate((targetEdge) => {
    const selectors = '[data-app-scroll-root], .lucy-chat-main, .overflow-y-auto, .overflow-y-scroll';
    const move = (element: HTMLElement | null) => {
      if (!element) return;
      const previousScrollBehavior = element.style.scrollBehavior;
      element.style.scrollBehavior = 'auto';
      element.scrollTop = targetEdge === 'top' ? 0 : Math.max(0, element.scrollHeight - element.clientHeight);
      element.style.scrollBehavior = previousScrollBehavior;
    };
    document.querySelectorAll<HTMLElement>(selectors).forEach((element) => {
      if (!element.closest('#main-sidebar-navigation')) move(element);
    });
    move(document.scrollingElement as HTMLElement | null);
    document.querySelectorAll<HTMLIFrameElement>('iframe').forEach((frame) => {
      const frameDoc = frame.contentDocument;
      if (!frameDoc) return;
      frameDoc.querySelectorAll<HTMLElement>(selectors).forEach((element) => move(element));
      move(frameDoc.scrollingElement as HTMLElement | null);
    });
  }, edge);
}

async function expectContentScrollBoundary(page, edge: 'top' | 'bottom') {
  await expect.poll(() => page.evaluate((targetEdge) => {
    const roots = new Set<HTMLElement>();
    const addVisibleRoot = (node: Element | null) => {
      if (!node) return;
      const element = node as HTMLElement;
      const rect = element.getBoundingClientRect();
      const style = element.ownerDocument.defaultView?.getComputedStyle(element);
      if (rect.width <= 0 || rect.height <= 0 || style?.display === 'none' || style?.visibility === 'hidden') return;
      roots.add(element);
    };
    const selectors = '[data-app-scroll-root], .lucy-chat-main, .overflow-y-auto, .overflow-y-scroll';
    document.querySelectorAll<HTMLElement>(selectors).forEach((element) => {
      if (!element.closest('#main-sidebar-navigation')) addVisibleRoot(element);
    });
    const pageRoot = document.scrollingElement as HTMLElement | null;
    if (pageRoot?.scrollHeight && pageRoot.scrollHeight > pageRoot.clientHeight + 1) addVisibleRoot(pageRoot);
    document.querySelectorAll<HTMLIFrameElement>('iframe').forEach((frame) => {
      try {
        if (!frame.contentDocument) return;
        frame.contentDocument.querySelectorAll<HTMLElement>(selectors).forEach(addVisibleRoot);
        addVisibleRoot(frame.contentDocument.scrollingElement as HTMLElement | null);
      } catch (_) {}
    });
    const scrollableRoots = Array.from(roots).filter((element) => element.scrollHeight > element.clientHeight + 1);
    return scrollableRoots.length === 0 || scrollableRoots.every((element) => targetEdge === 'top'
      ? element.scrollTop <= 2
      : element.scrollHeight - element.clientHeight - element.scrollTop <= 2
    );
  }, edge)).toBe(true);
}

async function setLucyPrimaryScrollAtMiddle(page) {
  return page.evaluate(() => {
    const primary = document.querySelector<HTMLElement>('.lucy-chat-main');
    if (!primary) throw new Error('Lucy primary conversation scroller is missing');
    const filler = document.createElement('div');
    filler.dataset.bigbangMidScrollTestFill = 'true';
    filler.style.cssText = 'height:1200px;flex:none;pointer-events:none';
    primary.append(filler);
    const previousBehavior = primary.style.scrollBehavior;
    primary.style.scrollBehavior = 'auto';
    primary.scrollTop = 120;
    primary.style.scrollBehavior = previousBehavior;
    return { scrollTop: primary.scrollTop, clientHeight: primary.clientHeight, scrollHeight: primary.scrollHeight };
  });
}

async function setLucyPrimaryScrollAtBottomWithUnrelatedListAtTop(page) {
  return page.evaluate(() => {
    const primary = document.querySelector<HTMLElement>('.lucy-chat-main');
    if (!primary) throw new Error('Lucy primary conversation scroller is missing');
    const filler = document.createElement('div');
    filler.dataset.bigbangBoundaryTestFill = 'true';
    filler.style.cssText = 'height:1200px;flex:none;pointer-events:none';
    primary.append(filler);
    const previousBehavior = primary.style.scrollBehavior;
    primary.style.scrollBehavior = 'auto';
    primary.scrollTop = primary.scrollHeight - primary.clientHeight;
    primary.style.scrollBehavior = previousBehavior;

    const unrelated = document.createElement('div');
    unrelated.id = 'bigbang-unrelated-scroll-probe';
    unrelated.className = 'overflow-y-auto';
    unrelated.style.cssText = 'position:fixed;left:1px;top:1px;width:40px;height:40px;opacity:0;pointer-events:none;z-index:-1';
    unrelated.innerHTML = '<div style="height:400px"></div>';
    document.body.append(unrelated);
    unrelated.scrollTop = 0;
    return {
      primaryRemaining: primary.scrollHeight - primary.clientHeight - primary.scrollTop,
      unrelatedTop: unrelated.scrollTop,
      unrelatedMax: unrelated.scrollHeight - unrelated.clientHeight,
    };
  });
}

test('update modal changelog copy stays visible in WebKit light and dark themes', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('prism_refresh_update_notice', '1'));
  await openLucy(page, '/chat?mode=pro');

  const modal = page.locator('.update-notice-modal');
  await expect(modal).toBeVisible();
  const summary = modal.locator('.update-notice-summary').first();
  const item = modal.locator('.update-notice-item > span:not(.text-amber-500)').first();
  await expect(summary).toBeVisible();
  await expect(item).toBeVisible();
  const releaseResponse = await page.request.get('/version.json');
  expect(releaseResponse.ok()).toBeTruthy();
  const release = await releaseResponse.json() as { summary: string; items: string[] };
  await expect(summary).toContainText(release.summary);
  await expect(item).toContainText(release.items[0]);

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
  await page.locator('html').evaluate((element) => {
    element.classList.remove('dark');
    element.classList.add('light');
    element.setAttribute('data-theme', 'light');
    element.style.colorScheme = 'light';
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

test('legacy Pro URL normalizes to Lucy and keeps the shared catalog available', async ({ page }) => {
  await openLucy(page, '/chat?mode=pro');
  await expect(page).toHaveURL(/\/chat\?mode=ai$/);
  await expect(page.getByText('Lucy Pro', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Lucy 엔진과 관점 목록 331개/ })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('lucy_tier_mode'))).toBe('ai');
});

test('Lucy message mode badge opens only actual per-answer engine evidence', async ({ page }) => {
  await openLucy(page);
  await expect(page.locator('[data-message-mode-badge="true"]').getByText('AI 심층 자동 상담', { exact: true })).toHaveCount(0);

  const badge = page.locator('button[data-message-mode-badge="true"]').first();
  await expect(badge).toBeVisible();
  await badge.click();
  const evidence = page.getByRole('dialog', { name: '이번 답변에서 실제 사용한 엔진' });
  await expect(evidence).toBeVisible();
  await expect(evidence).toContainText('이번 답변에 실제 사용된 엔진');
  await expect(evidence).toContainText('이번 답변에 모델로 전달된 계산·상징 엔진 기록이 없습니다.');
});

test('Lucy engine count opens the visible 331-entry catalog and meanings', async ({ page }) => {
  await openLucy(page);
  const trigger = page.getByRole('button', { name: /Lucy 엔진과 관점 목록/ });
  await expect(trigger).toBeVisible();
  await trigger.click();

  const dialog = page.getByRole('dialog', { name: 'Lucy 엔진·관점 안내' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('등록 목록 331개');
  await expect(dialog).toContainText('15개 기초 도구');
  await expect(dialog).toContainText('316개 심층 관점');
  await expect(dialog).toContainText('각각 독립 계산기가 아닙니다');
  const nameStyle = await dialog.locator('.lucy-engine-catalog-entry-name').first().evaluate(element => {
    const dialogElement = element.closest('[role="dialog"]');
    const theme = dialogElement?.getAttribute('data-catalog-theme');
    const style = getComputedStyle(element);
    return { theme, color: style.color, textFill: style.webkitTextFillColor };
  });
  const expectedNameColor = nameStyle.theme === 'light' ? 'rgb(15, 23, 42)' : 'rgb(241, 245, 249)';
  expect(nameStyle.color).toBe(expectedNameColor);
  expect(nameStyle.textFill).toBe(expectedNameColor);
  await dialog.getByText('관점 뜻과 답변별 상태 안내', { exact: true }).click();
  await expect(dialog).toContainText('상징 참고');
  await expect.poll(() => dialog.evaluate(element => getComputedStyle(element).opacity)).toBe('1');

  const search = dialog.getByRole('searchbox', { name: '엔진과 관점 검색' });
  await search.fill('사주명리');
  await expect(dialog).toContainText('사주명리');
  await expect(dialog).toContainText('개 표시');
  await search.fill('실시간 행성 트랜짓');
  await expect(dialog).toContainText('실시간 행성 트랜짓');
  await expect(dialog.getByRole('link')).toHaveCount(0);
  await search.fill('오행 바이오에너지');
  await expect(dialog).toContainText('이름을 바탕으로 한 앱 내 해석');
  await expect(dialog.getByRole('link')).toHaveCount(0);
});

test('Lucy groups all 331 catalog entries under the seven channel themes', async ({ page }) => {
  await openLucy(page);
  await page.getByRole('button', { name: /Lucy 엔진과 관점 목록/ }).click();

  const dialog = page.getByRole('dialog', { name: 'Lucy 엔진·관점 안내' });
  await expect(dialog).toBeVisible();
  const entries = dialog.getByTestId('lucy-engine-catalog-entry');
  await expect(entries).toHaveCount(331);
  const meaningTexts = await entries.locator('.lucy-engine-catalog-entry-meaning').allTextContents();
  expect(meaningTexts).toHaveLength(331);
  for (const meaning of meaningTexts) {
    expect(meaning.trim()).not.toMatch(/^뜻\s*:/);
    expect(meaning.trim().length).toBeGreaterThan(0);
  }

  const themeIds = ['prologue', 'orange', 'trinity', 'aura', 'bluebird', 'muse', 'epilogue'] as const;
  let groupedCount = 0;
  for (const themeId of themeIds) {
    const group = dialog.getByTestId(`lucy-engine-theme-${themeId}`);
    await expect(group).toBeVisible();
    const count = await group.getByTestId('lucy-engine-catalog-entry').count();
    expect(count).toBeGreaterThan(0);
    groupedCount += count;
  }
  expect(groupedCount).toBe(331);
  await expect(dialog.getByRole('link')).toHaveCount(0);

  const themeNav = dialog.getByRole('navigation', { name: 'Lucy 7개 채널 테마' });
  const auraFilter = themeNav.getByRole('button', { name: /아우라/ });
  await auraFilter.click();
  await expect(auraFilter).toHaveAttribute('aria-pressed', 'true');
  await expect(dialog.getByTestId('lucy-engine-theme-aura')).toBeVisible();
  await expect(dialog.getByTestId('lucy-engine-theme-prologue')).toHaveCount(0);
  const auraCount = Number((await auraFilter.textContent())?.match(/\d+$/)?.[0]);
  expect(auraCount).toBeGreaterThan(0);
  await expect(dialog.getByTestId('lucy-engine-catalog-entry')).toHaveCount(auraCount);
});

test('Lucy engine catalog fills the mobile viewport and its list scrolls without auto-opening the keyboard', async ({ page }) => {
  await openLucy(page);
  await page.getByRole('button', { name: /Lucy 엔진과 관점 목록/ }).click();

  const dialog = page.getByRole('dialog', { name: 'Lucy 엔진·관점 안내' });
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
  await expectHiddenDirectionTarget(bigBang, 'north', 'epilogue');
  await expectHiddenDirectionTarget(bigBang, 'south', 'key');
  await expect(bigBang.locator('[data-bigbang-direction-target="west"]')).toHaveCount(0);
  await expect(bigBang.locator('[data-bigbang-direction-target="east"]')).toHaveCount(0);
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

test('Big Bang left and right controls stay disabled in the Key channel', async ({ page }) => {
  await openKeyChannel(page);
  const bigBang = page.locator('div[data-bigbang="true"]');
  await expect(bigBang).toHaveAttribute('data-cycle-navigation-disabled', 'true');
  await expectHiddenDirectionTarget(bigBang, 'north', 'lucy');
  await expectHiddenDirectionTarget(bigBang, 'south', 'prologue');
  await expect(bigBang.locator('[data-bigbang-direction-target="west"]')).toHaveCount(0);
  await expect(bigBang.locator('[data-bigbang-direction-target="east"]')).toHaveCount(0);
  const box = await bigBang.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error('Big Bang hit area is missing in Key');
  const keyUrl = page.url();
  const centerY = box.y + box.height / 2;
  for (const offsetX of [-36, 36]) {
    await page.touchscreen.tap(box.x + box.width / 2 + offsetX, centerY);
    await expect(page).toHaveURL(keyUrl);
  }
});

test('Big Bang center double tap jumps to the recommended app without firing a single-tap action', async ({ page }) => {
  await openLucy(page);
  const button = page.locator('#bigbang-omnibutton');
  await expect(button).toBeVisible();
  await page.waitForTimeout(150);
  const box = await button.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error('Big Bang button is missing for double-tap test');
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;

  await page.evaluate(() => {
    (window as any).__bigBangTestCommit = null;
    (window as any).__bigBangNormalTapCount = 0;
    window.addEventListener('prism:bigbang_commit', (event) => {
      (window as any).__bigBangTestCommit = (event as CustomEvent).detail;
    }, { once: true });
    window.addEventListener('prism:revert_lucy_normal', () => {
      (window as any).__bigBangNormalTapCount += 1;
    });
  });

  await page.evaluate(({ x, y }) => {
    const target = document.querySelector<HTMLElement>('#bigbang-omnibutton');
    if (!target) throw new Error('Big Bang button is missing from the page');
    const tap = () => {
      const common = {
        bubbles: true,
        cancelable: true,
        pointerId: 7,
        pointerType: 'touch',
        isPrimary: true,
        clientX: x,
        clientY: y,
        button: 0,
      };
      target.dispatchEvent(new PointerEvent('pointerdown', { ...common, buttons: 1 }));
      target.dispatchEvent(new PointerEvent('pointerup', { ...common, buttons: 0 }));
    };
    tap();
    tap();
  }, { x, y });
  await expect.poll(() => page.evaluate(() => Boolean((window as any).__bigBangTestCommit?.target?.destinationPath))).toBe(true);
  const commit = await page.evaluate(() => (window as any).__bigBangTestCommit);
  expect(commit.isDoubleTapSuction).toBe(false);
  const destination = commit.target.destinationPath as string;
  expect(destination).not.toBe('/chat');
  const expected = new URL(destination, page.url());
  await expect.poll(() => {
    const current = new URL(page.url());
    return `${current.pathname}${current.search}`;
  }).toBe(`${expected.pathname}${expected.search}`);
  await page.waitForTimeout(350);
  expect(await page.evaluate(() => (window as any).__bigBangNormalTapCount)).toBe(0);
});

test('Big Bang center long press navigates directly to Key', async ({ page }) => {
  await openLucy(page);
  const button = page.locator('#bigbang-omnibutton');
  await expect(button).toBeVisible();
  const box = await button.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error('Big Bang button is missing for hold test');
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;

  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.waitForTimeout(650);
  await page.mouse.up();
  await expect(page).toHaveURL(/\/key$/);
  await expect(page.locator('iframe[title="Key"]')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('lucy_tier_mode'))).not.toBe('pro');
});

test('Key loading fallback does not consume the first Big Bang south touch', async ({ page }) => {
  await page.addInitScript(() => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    localStorage.setItem('lu_unlocked_date', today);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
    sessionStorage.setItem('profileModalDismissed', '1');
  });
  await page.route('**/calm/index.html*', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 2500));
    await route.continue().catch(() => {});
  });
  await page.goto('/key', { waitUntil: 'domcontentloaded' });

  const loader = page.locator('[data-app-channel-loader="true"][aria-label^="Key 개운"]');
  await expect(loader).toBeVisible();
  await expect(loader).toBeHidden({ timeout: 2000 });

  const bigBang = page.locator('#bigbang-omnibutton');
  await expect(bigBang).toBeVisible();
  const box = await bigBang.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error('Big Bang hit area is missing while the Key iframe is delayed');
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2 + 36;
  await page.waitForFunction(({ x, y }) => Boolean(document.elementFromPoint(x, y)?.closest('[data-bigbang="true"]')), { x, y });
  await page.touchscreen.tap(x, y);
  await expect.poll(() => new URL(page.url()).pathname).toBe('/prologue');
});

test('Big Bang stays over Lucy while left and right change only the channel pane', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await openPrologue(page, '/heal?device=duo&tab=meditation');
  const channelPane = page.locator('#duo-content-viewport');
  const lucyPane = page.locator('#duo-lucy-viewport');
  await expect(channelPane).toBeVisible();
  await expect(lucyPane).toBeVisible();
  const lucyComposer = lucyPane.locator('.lucy-chat-footer textarea');
  await expect(lucyComposer).toBeVisible();
  const lucyComposerValueBefore = await lucyComposer.inputValue();
  const lucyUserMessageCountBefore = await lucyPane.locator('.lucy-chat-main > div > [class*="items-end"]').count();
  await expect.poll(() => page.locator('html').evaluate(element => element.classList.contains('in-lucy-chat'))).toBe(true);

  const bigBang = page.locator('div[data-bigbang="true"]').first();
  await expect(bigBang).toHaveAttribute('data-cycle-navigation-disabled', 'false');
  await expect(bigBang.locator('[data-bigbang-direction-target="east"]')).toHaveAttribute('data-bigbang-target-channel', 'heal');

  for (const [offsetX, targetTab] of [[36, 'oneMinute'], [-36, 'meditation']] as const) {
    const contentBox = await channelPane.boundingBox();
    const lucyBox = await lucyPane.boundingBox();
    const buttonBox = await bigBang.boundingBox();
    expect(contentBox).not.toBeNull();
    expect(lucyBox).not.toBeNull();
    expect(buttonBox).not.toBeNull();
    if (!contentBox || !lucyBox || !buttonBox) throw new Error('Expanded split pane geometry is unavailable');
    expect(buttonBox.x).toBeGreaterThanOrEqual(lucyBox.x);
    expect(buttonBox.x + buttonBox.width).toBeLessThanOrEqual(lucyBox.x + lucyBox.width);
    expect(buttonBox.y).toBeGreaterThanOrEqual(contentBox.y);
    expect(buttonBox.y + buttonBox.height).toBeLessThanOrEqual(contentBox.y + contentBox.height);

    const x = buttonBox.x + buttonBox.width / 2 + offsetX;
    const y = buttonBox.y + buttonBox.height / 2;
    await page.waitForFunction(({ x, y }) => Boolean(document.elementFromPoint(x, y)?.closest('[data-bigbang="true"]')), { x, y });
    await page.touchscreen.tap(x, y);
    await expect(page).toHaveURL(new RegExp(`/heal\\?tab=${targetTab}$`));
    await expect(channelPane).toBeVisible();
    await expect(lucyPane).toBeVisible();
    await expect(lucyComposer).toHaveValue(lucyComposerValueBefore);
    await expect(lucyPane.locator('.lucy-chat-main > div > [class*="items-end"]')).toHaveCount(lucyUserMessageCountBefore);
  }
});

test('Big Bang north and south controls switch apps from mid-scroll without scrolling content', async ({ page }) => {
  await openLucy(page);
  const tapFromMiddle = async (offsetY: number, expectedPath: string) => {
    const scrollState = await setLucyPrimaryScrollAtMiddle(page);
    expect(scrollState.clientHeight).toBeGreaterThan(0);
    expect(scrollState.scrollHeight).toBeGreaterThan(scrollState.clientHeight);
    expect(scrollState.scrollTop).toBe(120);
    const bigBang = page.locator('div[data-bigbang="true"]').first();
    const box = await bigBang.boundingBox();
    expect(box).not.toBeNull();
    if (!box) throw new Error('Big Bang hit area is missing in Lucy');
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2 + offsetY;
    await page.waitForFunction(({ x, y }) => Boolean(document.elementFromPoint(x, y)?.closest('[data-bigbang="true"]')), { x, y });
    await page.evaluate(() => {
      const root = document.querySelector<HTMLElement>('.lucy-chat-main');
      if (!root) throw new Error('Lucy primary conversation scroller is missing');
      root.style.scrollBehavior = 'auto';
      root.style.scrollSnapType = 'none';
      root.scrollTop = 120;
      const maxScroll = root.scrollHeight - root.clientHeight;
      if (root.scrollTop <= 2 || root.scrollTop >= maxScroll - 2) {
        throw new Error(`Lucy primary scroller is not in a middle position: ${root.scrollTop}/${maxScroll}`);
      }
      sessionStorage.setItem('bigbang.lucy.scrollTopAtPress', String(root.scrollTop));
      sessionStorage.setItem('bigbang.lucy.maxScrollAtPress', String(maxScroll));
      document.addEventListener('pointerup', () => {
        sessionStorage.setItem('bigbang.lucy.scrollTopAtPointerUp', String(root.scrollTop));
      }, { capture: true, once: true });
    });
    await page.touchscreen.tap(x, y);
    await expect.poll(() => new URL(page.url()).pathname).toBe(expectedPath);
    const topAtPress = Number(await page.evaluate(() => sessionStorage.getItem('bigbang.lucy.scrollTopAtPress')));
    const maxAtPress = Number(await page.evaluate(() => sessionStorage.getItem('bigbang.lucy.maxScrollAtPress')));
    expect(topAtPress).toBeGreaterThan(2);
    expect(topAtPress).toBeLessThan(maxAtPress - 2);
    expect(Number(await page.evaluate(() => sessionStorage.getItem('bigbang.lucy.scrollTopAtPointerUp')))).toBe(topAtPress);
  };

  await tapFromMiddle(36, '/key');
  await openLucy(page);
  await tapFromMiddle(-36, '/epilogue');
});

test('Big Bang south switches immediately even when an unrelated inner list remains at its top', async ({ page }) => {
  await openLucy(page);
  const scrollState = await setLucyPrimaryScrollAtBottomWithUnrelatedListAtTop(page);
  expect(scrollState.primaryRemaining).toBeLessThanOrEqual(2);
  expect(scrollState.unrelatedMax).toBeGreaterThan(0);
  expect(scrollState.unrelatedTop).toBe(0);

  const bigBang = page.locator('div[data-bigbang="true"]').first();
  await expectHiddenDirectionTarget(bigBang, 'south', 'key');
  const box = await bigBang.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error('Big Bang hit area is missing in Lucy');
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2 + 36);
  await expect(page).toHaveURL(/\/key$/);
  await expect(page.locator('[data-bigbang-center-channel="key"][data-bigbang-center-direction="south"]')).toBeVisible();
});

test('Big Bang down follows right-menu order in Key and Lucky channels from non-bottom positions', async ({ page }) => {
  await openLucy(page);
  const bigBang = page.locator('div[data-bigbang="true"]');
  await expect(bigBang).toBeVisible();
  await expectHiddenDirectionTarget(bigBang, 'south', 'key');
  let box = await bigBang.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error('Big Bang hit area is missing in Lucy');
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2 + 36);
  await expect(page).toHaveURL(/\/key$/);
  await expect(page.locator('[data-bigbang-center-channel="key"][data-bigbang-center-direction="south"]')).toBeVisible();

  await expect(page).toHaveURL(/\/key$/);
  const keyFrame = page.locator('iframe[title="Key"]');
  await expect(keyFrame).toBeVisible();
  await expect.poll(() => keyFrame.evaluate(frame => (frame as HTMLIFrameElement).contentDocument?.readyState === 'complete')).toBe(true);
  await expect(page.locator('[data-fullscreen-loader="true"]')).toHaveCount(0);
  const keyScroll = await page.evaluate(() => {
    const frame = document.querySelector<HTMLIFrameElement>('iframe[title="Key"]');
    const root = frame?.contentDocument?.scrollingElement as HTMLElement | null;
    if (!root) throw new Error('Key iframe scroll root is unavailable');
    root.scrollTop = 0;
    sessionStorage.setItem('bigbang.key.scrollTopAtPress', String(root.scrollTop));
    sessionStorage.setItem('bigbang.key.scrollEvents', '0');
    root.addEventListener('scroll', () => {
      const count = Number(sessionStorage.getItem('bigbang.key.scrollEvents') || '0');
      sessionStorage.setItem('bigbang.key.scrollEvents', String(count + 1));
    });
    return { top: root.scrollTop, max: root.scrollHeight - root.clientHeight };
  });
  expect(keyScroll.top).toBe(0);
  expect(keyScroll.max).toBeGreaterThan(0);
  await expectHiddenDirectionTarget(bigBang, 'north', 'lucy');
  await expectHiddenDirectionTarget(bigBang, 'south', 'prologue');
  box = await bigBang.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error('Big Bang hit area is missing in Key');
  const southX = box.x + box.width / 2;
  const southY = box.y + box.height / 2 + 36;
  await page.waitForFunction(({ x, y }) => Boolean(document.elementFromPoint(x, y)?.closest('[data-bigbang="true"]')), { x: southX, y: southY });
  await page.touchscreen.tap(southX, southY);
  await expect.poll(() => new URL(page.url()).pathname).toBe('/prologue');
  expect(Number(await page.evaluate(() => sessionStorage.getItem('bigbang.key.scrollTopAtPress')))).toBe(0);
  expect(Number(await page.evaluate(() => sessionStorage.getItem('bigbang.key.scrollEvents')))).toBe(0);
  expect([null, 'universe']).toContain(new URL(page.url()).searchParams.get('tab'));
  await expectHiddenDirectionTarget(bigBang, 'north', 'key');
  await expectHiddenDirectionTarget(bigBang, 'south', 'orange');

  const luckyRoot = page.locator('[data-app-scroll-root]').first();
  await expect.poll(() => luckyRoot.evaluate(element => (element as HTMLElement).scrollHeight - (element as HTMLElement).clientHeight)).toBeGreaterThan(0);
  await expect.poll(() => luckyRoot.evaluate(element => (element as HTMLElement).scrollTop)).toBe(0);
  await page.evaluate(() => {
    const root = document.querySelector<HTMLElement>('[data-app-scroll-root]');
    sessionStorage.setItem('bigbang.lucky.scrollTopAtPress', String(root?.scrollTop ?? -1));
    sessionStorage.setItem('bigbang.lucky.scrollEvents', '0');
    root?.addEventListener('scroll', () => {
      const count = Number(sessionStorage.getItem('bigbang.lucky.scrollEvents') || '0');
      sessionStorage.setItem('bigbang.lucky.scrollEvents', String(count + 1));
    });
  });
  box = await bigBang.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error('Big Bang hit area is missing in Lucky');
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2 + 36);
  await expect.poll(() => new URL(page.url()).pathname).toBe('/orange');
  expect(Number(await page.evaluate(() => sessionStorage.getItem('bigbang.lucky.scrollTopAtPress')))).toBe(0);
  expect(Number(await page.evaluate(() => sessionStorage.getItem('bigbang.lucky.scrollEvents')))).toBe(0);
});

test('Big Bang destination marker suppresses the first-visit oracle modal on Trinity', async ({ page }) => {
  await openPrologue(page, '/prologue');
  await page.evaluate(() => {
    sessionStorage.setItem('prism_bigbang_navigation_target', JSON.stringify({
      path: '/trinity',
      timestamp: Date.now(),
    }));
  });
  await page.goto('/trinity');
  await expect(page.locator('#bigbang-omnibutton')).toBeVisible();
  await page.waitForTimeout(3_000);
  await expect(page.locator('#today-tarot-narration-modal')).toHaveCount(0);
});

test('Big Bang south tap in a Lucky channel switches at the top without scrolling', async ({ page }) => {
  await openPrologue(page, '/prologue');
  const scrollRoot = page.locator('[data-app-scroll-root]').first();
  await expect.poll(() => scrollRoot.evaluate(element => (element as HTMLElement).scrollHeight - (element as HTMLElement).clientHeight)).toBeGreaterThan(0);
  await expect.poll(() => scrollRoot.evaluate(element => (element as HTMLElement).scrollTop)).toBe(0);
  await page.evaluate(() => {
    const root = document.querySelector<HTMLElement>('[data-app-scroll-root]');
    sessionStorage.setItem('bigbang.lucky.scrollTopAtPress', String(root?.scrollTop ?? -1));
    sessionStorage.setItem('bigbang.lucky.scrollEvents', '0');
    root?.addEventListener('scroll', () => {
      const count = Number(sessionStorage.getItem('bigbang.lucky.scrollEvents') || '0');
      sessionStorage.setItem('bigbang.lucky.scrollEvents', String(count + 1));
    });
  });
  const bigBang = page.locator('div[data-bigbang="true"]').first();
  const box = await bigBang.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error('Big Bang hit area is missing in Prologue');
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2 + 36;
  await page.waitForFunction(({ x, y }) => Boolean(document.elementFromPoint(x, y)?.closest('[data-bigbang="true"]')), { x, y });
  await page.touchscreen.tap(x, y);
  await expect.poll(() => new URL(page.url()).pathname).toBe('/orange');
  expect(Number(await page.evaluate(() => sessionStorage.getItem('bigbang.lucky.scrollTopAtPress')))).toBe(0);
  expect(Number(await page.evaluate(() => sessionStorage.getItem('bigbang.lucky.scrollEvents')))).toBe(0);
});

test('Big Bang left and right navigation stay inside Prologue and show its symbol', async ({ page }) => {
  await openPrologue(page);
  const bigBang = page.locator('div[data-bigbang="true"]').first();
  await expect(bigBang).toBeVisible();
  const initialUrl = page.url();
  for (const [direction, channel] of [['north', 'key'], ['south', 'orange'], ['west', 'prologue'], ['east', 'prologue']]) {
    await expectHiddenDirectionTarget(bigBang, direction, channel);
  }
  let box = await bigBang.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error('Big Bang hit area is missing in Prologue');
  await page.touchscreen.tap(box.x + box.width / 2 + 36, box.y + box.height / 2);
  await expect(page).toHaveURL(/\/prologue\?tab=universe$/);
  await expect(page.locator('[data-bigbang-center-channel="prologue"][data-bigbang-center-direction="east"]')).toBeVisible();

  const afterEastUrl = page.url();
  await expect(bigBang).toHaveAttribute('data-cycle-navigation-disabled', 'false');
  box = await bigBang.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error('Big Bang hit area is missing after east navigation');
  const westX = box.x + box.width / 2 - 36;
  const westY = box.y + box.height / 2;
  await page.waitForFunction(
    ({ x, y }) => Boolean(document.elementFromPoint(x, y)?.closest('[data-bigbang="true"]')),
    { x: westX, y: westY },
    { timeout: 5000 },
  );
  await page.touchscreen.tap(westX, westY);
  await expect(page.locator('[data-bigbang-center-channel="prologue"][data-bigbang-center-direction="west"]')).toBeVisible();
  await expect(page).toHaveURL(initialUrl);
  expect(page.url()).not.toBe(afterEastUrl);
  await expect(page.locator('[data-bigbang-center-channel="prologue"][data-bigbang-center-direction="west"]')).toBeVisible();
});

test('Big Bang drag does not navigate to a page or app', async ({ page }) => {
  await openPrologue(page);
  const button = page.locator('#bigbang-omnibutton');
  await expect(button).toBeVisible();
  const before = page.url();
  const box = await button.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error('Big Bang button is missing for drag test');

  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 34, y, { steps: 4 });
  await page.mouse.up();
  await page.waitForTimeout(700);
  await expect(page).toHaveURL(before);
});

test('Big Bang north at the Key channel top boundary returns to Lucy', async ({ page }) => {
  await openKeyChannel(page);
  const bigBang = page.locator('div[data-bigbang="true"]');
  await expectHiddenDirectionTarget(bigBang, 'north', 'lucy');
  await setContentScrollBoundary(page, 'top');
  await expectContentScrollBoundary(page, 'top');
  await page.waitForTimeout(200);
  const box = await bigBang.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error('Big Bang hit area is missing in Key');
  const northX = box.x + box.width / 2;
  const northY = box.y + box.height / 2 - 36;
  await page.waitForFunction(({ x, y }) => Boolean(document.elementFromPoint(x, y)?.closest('[data-bigbang="true"]')), { x: northX, y: northY });
  await page.touchscreen.tap(northX, northY);
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('[data-bigbang-center-channel="lucy"][data-bigbang-center-direction="north"]')).toBeVisible();
  await expect(page.locator('.lucy-chat-footer')).toBeVisible();
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

  const returnButton = page.getByRole('button', { name: '최근대화' });
  await messages.evaluate(element => { element.scrollTop = 0; element.dispatchEvent(new Event('scroll')); });
  await expect(returnButton).toBeVisible();
  await expect(returnButton).toHaveText('최근대화');
  const returnButtonBox = await returnButton.boundingBox();
  const viewport = page.viewportSize();
  const sidebarBox = await page.locator('#main-sidebar-navigation').boundingBox();
  expect(returnButtonBox).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(sidebarBox).not.toBeNull();
  if (!returnButtonBox || !viewport || !sidebarBox) throw new Error('Lucy recent conversation button geometry is unavailable');
  expect(returnButtonBox.width).toBeLessThan(110);
  expect(Math.abs(viewport.width - (returnButtonBox.x + returnButtonBox.width) - sidebarBox.width - 16)).toBeLessThanOrEqual(3);
  expect(returnButtonBox.y).toBeGreaterThan(viewport.height / 2);
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

  await messages.evaluate(element => { element.scrollTop = 400; element.dispatchEvent(new Event('scroll')); });
  await expect.poll(() => messages.evaluate(element => element.scrollTop)).toBeGreaterThan(80);
  await page.mouse.click(headerBox.x + headerBox.width / 2, Math.min(headerBox.y + 30, 60));
  await expect.poll(() => messages.evaluate(element => element.scrollTop)).toBeLessThan(3);

  await page.evaluate(() => {
    let visibility: 'hidden' | 'visible' = 'hidden';
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => visibility,
    });
    document.dispatchEvent(new Event('visibilitychange'));
    visibility = 'visible';
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect.poll(() => messages.evaluate(element => element.scrollHeight - element.scrollTop - element.clientHeight)).toBeLessThan(3);
  await expect(returnButton).toBeHidden();
});

test('Lucy keeps the Trinity theme and answer but hides calculation status chips', async ({ page }) => {
  await page.addInitScript(() => {
    const now = Date.now();
    const history = [
      {
        id: 'audit-ui-user', role: 'user', persona: 'lucy', channel: 'trinity', channels: ['trinity'], mode: 'trinity',
        content: '트리니티 타로 결과를 확인해줘.', timestamp: now - 60_000,
      },
      {
        id: 'audit-ui-answer', role: 'assistant', persona: 'lucy', channel: 'trinity', channels: ['trinity'], mode: 'trinity',
        content: '타로 결과 보존 확인: 실제 카드 해석 내용.', timestamp: now,
        calculationAudit: [{ toolId: 'tarot', name: '타로', status: 'calculated', sentToModel: true, note: 'fixture', method: 'fixture' }],
      },
    ];
    localStorage.setItem('chat_history_unified_v3', JSON.stringify(history));
  });
  await openLucy(page);

  await expect(page.getByText('타로 결과 보존 확인: 실제 카드 해석 내용.')).toBeVisible();
  await expect(page.locator('[data-message-mode-badge="true"]').filter({ hasText: '트리니티' }).first()).toBeVisible();
  await expect(page.locator('[data-calculation-audit="true"]')).toHaveCount(0);
  await expect(page.getByText('실행 기록', { exact: true })).toHaveCount(0);
  await expect(page.getByText('계산 완료 · 타로', { exact: true })).toHaveCount(0);

  const savedAudit = await page.evaluate(() => {
    const history = JSON.parse(localStorage.getItem('chat_history_unified_v3') || '[]');
    return history.find((message: { id?: string }) => message.id === 'audit-ui-answer')?.calculationAudit;
  });
  expect(savedAudit).toEqual([{ toolId: 'tarot', name: '타로', status: 'calculated', sentToModel: true, note: 'fixture', method: 'fixture' }]);
});

test('Lucy smoothly reaches the exact top of a long conversation and recent conversation returns to the bottom', async ({ page }) => {
  await page.addInitScript(() => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const base = Date.now() - 60 * 60 * 1000;
    const history = Array.from({ length: 36 }, (_, index) => ({
      id: `scroll-regression-${index + 1}`,
      role: index % 2 === 0 ? 'user' : 'assistant',
      persona: 'lucy',
      channel: 'lucy',
      content: Array.from({ length: 10 + (index % 5) }, (_, line) =>
        `긴 대화 회귀 검증 ${index + 1}번째 메시지의 ${line + 1}번째 내용입니다. 실제 Lucy 메시지 컴포넌트가 줄바꿈과 문단 간격을 렌더링하도록 충분한 문장을 포함합니다. 오늘 고민과 다음 선택을 차분히 돌아보며 현실적인 방법을 찾습니다.`
      ).join('\n'),
      timestamp: base + index * 60_000,
    }));
    localStorage.setItem('chat_history_unified_v3', JSON.stringify(history));
    localStorage.setItem('lucy_daily_first_entry_date_v1', today);
    localStorage.setItem('lucy_daily_first_visit_done_date_v1', today);
    localStorage.setItem('lucy_chat_auto_tts', 'false');
  });
  await openLucy(page);

  const messages = page.locator('.lucy-chat-main');
  await expect.poll(() => messages.evaluate(element => element.scrollHeight - element.clientHeight)).toBeGreaterThan(3000);
  expect(await messages.locator('[data-forward-bubble]').count()).toBeGreaterThanOrEqual(18);

  const returnButton = page.getByRole('button', { name: '최근대화' });
  await messages.evaluate(element => {
    element.style.scrollBehavior = 'auto';
    element.scrollTop = Math.floor((element.scrollHeight - element.clientHeight) * 0.82);
    element.dispatchEvent(new Event('scroll', { bubbles: true }));
  });
  await expect(returnButton).toBeVisible();
  const touchStartTop = await messages.evaluate(element => element.scrollTop);
  expect(touchStartTop).toBeGreaterThan(80);

  const header = page.locator('[data-lucy-header-tap-scroll="true"]');
  const topTap = await header.evaluate(element => {
    const rect = element.getBoundingClientRect();
    const blocked = 'button, a, input, select, textarea, [role="button"], [role="tab"], [role="menuitem"], [role="link"], label, .clickable, [data-no-scroll-top], [data-brand-logo], audio, video, iframe, .lucy-header-actions, .prism-subnav-btn, .duo-page-nav';
    const y = 30;
    const x = [rect.left + rect.width * 0.5, rect.left + rect.width * 0.42, rect.left + rect.width * 0.58]
      .find(candidate => !document.elementFromPoint(candidate, y)?.closest(blocked));
    if (x == null) throw new Error('Lucy blank upper-center tap area is missing');
    return { x, y };
  });
  await page.evaluate(() => {
    const messages = document.querySelector('.lucy-chat-main') as HTMLElement | null;
    if (!messages) throw new Error('Lucy message scroller is missing');
    const state = window as Window & { __lucyTopScrollTrace?: number[] };
    state.__lucyTopScrollTrace = [];
    const sampleUntil = performance.now() + 1000;
    const sample = () => {
      state.__lucyTopScrollTrace?.push(messages.scrollTop);
      if (performance.now() >= sampleUntil) window.clearInterval(sampleTimer);
    };
    const sampleTimer = window.setInterval(sample, 16);
    sample();
  });
  await page.touchscreen.tap(topTap.x, topTap.y);
  await expect.poll(() => page.evaluate((start) =>
    (window as Window & { __lucyTopScrollTrace?: number[] }).__lucyTopScrollTrace?.some(position => position > 2 && position < start - 2) ?? false,
    touchStartTop
  )).toBe(true);
  const touchMotionTrace = await page.evaluate(() => (window as Window & { __lucyTopScrollTrace?: number[] }).__lucyTopScrollTrace ?? []);
  expect(touchMotionTrace.some(position => position > 2 && position < touchStartTop - 2)).toBe(true);
  await page.evaluate(() => window.dispatchEvent(new Event('lucy-chat-content-resized')));
  await expect.poll(() => messages.evaluate(element => element.scrollTop)).toBe(0);
  await page.waitForTimeout(520);
  expect(await messages.evaluate(element => element.scrollTop)).toBe(0);
  await expect(returnButton).toBeVisible();

  await messages.evaluate(element => {
    element.scrollTop = Math.floor((element.scrollHeight - element.clientHeight) * 0.75);
    element.dispatchEvent(new Event('scroll', { bubbles: true }));
  });
  await expect.poll(() => messages.evaluate(element => element.scrollTop)).toBeGreaterThan(80);
  await header.evaluate(element => { (element as HTMLElement).style.paddingBottom = '40px'; });
  const headerBox = await header.boundingBox();
  expect(headerBox).not.toBeNull();
  if (!headerBox) throw new Error('Lucy chat header is missing');
  const blankAreaY = headerBox.y + headerBox.height - 2;
  expect(blankAreaY).toBeGreaterThan(76);
  const mouseStartTop = await messages.evaluate(element => element.scrollTop);
  expect(mouseStartTop).toBeGreaterThan(80);
  await page.mouse.click(headerBox.x + headerBox.width / 2, blankAreaY);
  await expect.poll(() => messages.evaluate(element => element.scrollTop)).toBeLessThan(mouseStartTop - 1);
  await expect.poll(() => messages.evaluate(element => element.scrollTop)).toBe(0);
  await page.waitForTimeout(520);
  expect(await messages.evaluate(element => element.scrollTop)).toBe(0);
  await expect(returnButton).toBeVisible();

  const returnButtonBox = await returnButton.boundingBox();
  const viewport = page.viewportSize();
  const sidebarBox = await page.locator('#main-sidebar-navigation').boundingBox();
  expect(returnButtonBox).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(sidebarBox).not.toBeNull();
  if (!returnButtonBox || !viewport || !sidebarBox) throw new Error('Lucy recent conversation button geometry is unavailable');
  expect(returnButtonBox.width).toBeLessThan(110);
  expect(Math.abs(viewport.width - (returnButtonBox.x + returnButtonBox.width) - sidebarBox.width - 16)).toBeLessThanOrEqual(3);
  expect(returnButtonBox.y).toBeGreaterThan(viewport.height / 2);
  await returnButton.click();
  await expect.poll(() => messages.evaluate(element => element.scrollHeight - element.scrollTop - element.clientHeight)).toBeLessThan(3);
  await expect(returnButton).toBeHidden();
});

test('pull-to-refresh indicator centers over the folded main canvas, excluding the sidebar', async ({ page }) => {
  await openLucy(page);
  const messages = page.locator('.lucy-chat-main');
  await messages.evaluate(element => {
    const x = element.getBoundingClientRect().left + element.getBoundingClientRect().width / 2;
    const createTouchEvent = (type: string, y: number) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'touches', {
        value: [{ identifier: 1, target: element, clientX: x, clientY: y }],
      });
      element.dispatchEvent(event);
    };
    createTouchEvent('touchstart', 10);
    createTouchEvent('touchmove', 220);
  });

  const indicator = page.locator('.pull-refresh-indicator');
  await expect(indicator).toBeVisible();
  await expect(indicator).toHaveAttribute('aria-label', '놓으면 새로고침');
  const indicatorBox = await indicator.boundingBox();
  const mainBox = await messages.boundingBox();
  const sidebarBox = await page.locator('#main-sidebar-navigation').boundingBox();
  const viewport = page.viewportSize();
  expect(indicatorBox).not.toBeNull();
  expect(mainBox).not.toBeNull();
  expect(sidebarBox).not.toBeNull();
  expect(viewport).not.toBeNull();
  if (!indicatorBox || !mainBox || !sidebarBox || !viewport) throw new Error('Refresh indicator geometry is unavailable');
  const indicatorCenter = indicatorBox.x + indicatorBox.width / 2;
  const mainCenter = mainBox.x + mainBox.width / 2;
  const expectedMainCenter = (viewport.width - sidebarBox.width) / 2;
  expect(Math.abs(mainCenter - expectedMainCenter)).toBeLessThanOrEqual(2);
  expect(Math.abs(indicatorCenter - mainCenter)).toBeLessThanOrEqual(1);
  await messages.evaluate(element => element.dispatchEvent(new Event('touchcancel', { bubbles: true, cancelable: true })));
  await expect(indicator).toBeHidden();
});

test('pull-to-refresh ignores cross-origin Firebase Auth iframes without WebKit errors', async ({ page }) => {
  const frameAccessErrors: string[] = [];
  page.on('pageerror', error => {
    if (error.message.includes('Blocked a frame with origin')) frameAccessErrors.push(error.message);
  });
  await openLucy(page);
  await page.evaluate(() => {
    const frame = document.createElement('iframe');
    frame.src = 'https://lucyuniverse-fc423.firebaseapp.com/__/auth/iframe';
    frame.title = 'cross-origin-auth-regression';
    frame.width = '1';
    frame.height = '1';
    document.body.appendChild(frame);
  });
  await page.waitForTimeout(1000);
  expect(frameAccessErrors).toEqual([]);
});

test('pull-to-refresh indicator centers on the full-width unfolded portrait canvas', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 900 });
  await openLucy(page);
  await expect(page.locator('html')).toHaveClass(/duo-unfolded-portrait/);
  await expect(page.locator('#duo-content-viewport')).toBeVisible();
  await setContentScrollBoundary(page, 'top');

  const messages = page.locator('#duo-lucy-viewport .lucy-chat-main');
  await expect(messages).toBeVisible();
  await messages.evaluate(element => {
    const x = element.getBoundingClientRect().left + element.getBoundingClientRect().width / 2;
    const createTouchEvent = (type: string, y: number) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'touches', { value: [{ identifier: 1, target: element, clientX: x, clientY: y }] });
      element.dispatchEvent(event);
    };
    createTouchEvent('touchstart', 10);
    createTouchEvent('touchmove', 220);
  });

  const indicator = page.locator('.pull-refresh-indicator');
  await expect(indicator).toBeVisible();
  const indicatorBox = await indicator.boundingBox();
  const sidebarBox = await page.locator('#main-sidebar-navigation').boundingBox();
  const viewport = page.viewportSize();
  expect(indicatorBox).not.toBeNull();
  expect(sidebarBox).not.toBeNull();
  expect(viewport).not.toBeNull();
  if (!indicatorBox || !sidebarBox || !viewport) throw new Error('Unfolded portrait refresh geometry is unavailable');
  expect(Math.abs(sidebarBox.width - viewport.width)).toBeLessThanOrEqual(2);
  expect(Math.abs(indicatorBox.x + indicatorBox.width / 2 - viewport.width / 2)).toBeLessThanOrEqual(1);
  await messages.evaluate(element => element.dispatchEvent(new Event('touchcancel', { bubbles: true, cancelable: true })));
  await expect(indicator).toBeHidden();
});

test('pull-to-refresh indicator centers at the top of the full unfolded landscape viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 700 });
  await openLucy(page);
  await expect(page.locator('html')).toHaveClass(/duo-unfolded-landscape/);
  await expect(page.locator('#duo-content-viewport')).toBeVisible();
  await setContentScrollBoundary(page, 'top');

  const messages = page.locator('#duo-lucy-viewport .lucy-chat-main');
  await expect(messages).toBeVisible();
  await messages.evaluate(element => {
    const x = element.getBoundingClientRect().left + element.getBoundingClientRect().width / 2;
    const createTouchEvent = (type: string, y: number) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'touches', { value: [{ identifier: 1, target: element, clientX: x, clientY: y }] });
      element.dispatchEvent(event);
    };
    createTouchEvent('touchstart', 10);
    createTouchEvent('touchmove', 220);
  });

  const indicator = page.locator('.pull-refresh-indicator');
  await expect(indicator).toBeVisible();
  const indicatorBox = await indicator.boundingBox();
  const sidebarBox = await page.locator('#main-sidebar-navigation').boundingBox();
  const viewport = page.viewportSize();
  expect(indicatorBox).not.toBeNull();
  expect(sidebarBox).not.toBeNull();
  expect(viewport).not.toBeNull();
  if (!indicatorBox || !sidebarBox || !viewport) throw new Error('Unfolded landscape refresh geometry is unavailable');
  expect(sidebarBox.width).toBeLessThan(viewport.width);
  expect(Math.abs(indicatorBox.x + indicatorBox.width / 2 - viewport.width / 2)).toBeLessThanOrEqual(1);
  await messages.evaluate(element => element.dispatchEvent(new Event('touchcancel', { bubbles: true, cancelable: true })));
  await expect(indicator).toBeHidden();
});

test('Key channel tabs stay fixed below the brand bar while the page scrolls', async ({ page }) => {
  await page.goto('/calm/index.html?no_auto=1');
  const tabs = page.locator('.view-tabs-container');
  const topNav = page.locator('.top-nav');
  await expect(tabs).toBeVisible();
  await expect(topNav).toBeVisible();
  const scrollTarget = await tabs.evaluate(element => element.getBoundingClientRect().top + window.scrollY + 400);
  await page.evaluate(target => {
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';
    window.scrollTo(0, target);
  }, scrollTarget);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual(scrollTarget - 1);

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

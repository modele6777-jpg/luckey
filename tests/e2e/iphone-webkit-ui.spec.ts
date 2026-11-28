import { expect, test } from '@playwright/test';

async function openLucyMaster(page, path = '/chat') {
  // 엔진함·추천질문 라이브러리는 점술모드(루시 마스터)에서만 보인다.
  await page.addInitScript(() => { sessionStorage.setItem('lucy_master_mode', 'on'); });
  await openLucy(page, path);
}

/** 일반 루시 채팅 도구함: 헤더 연필 버튼 → 엔진함(심층 관점)만 열린다. */
async function openChatEngineBox(page) {
  await page.locator('[data-master-table-sheet-button]').first().click();
  const sheet = page.locator('[data-master-table-sheet]');
  await expect(sheet).toBeVisible();
  const panel = page.getByRole('region', { name: 'Lucy 엔진함' });
  await expect(panel).toBeVisible();
  return { sheet, panel };
}

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

async function getLucyHeaderBackground(page: import('@playwright/test').Page, edge: 'top' | 'bottom') {
  const header = page.locator('[data-lucy-header-tap-scroll="true"]');
  await expect(header).toBeVisible();
  const findPoint = () => header.evaluate((element, edge) => {
    const rect = element.getBoundingClientRect();
    const blocked = 'button, a, input, [role="button"], [data-no-scroll-top], [data-brand-logo], .lucy-header-actions';
    for (const inset of [4, 8, 12, Math.floor(rect.height / 2)]) {
      const y = edge === 'top' ? rect.top + inset : rect.bottom - inset;
      for (const fraction of [0.5, 0.42, 0.58, 0.34, 0.26, 0.18]) {
        const x = rect.left + rect.width * fraction;
        const hit = document.elementFromPoint(x, y);
        if (hit && element.contains(hit) && !hit.closest(blocked)) return { x, y };
      }
    }
    return null;
  }, edge);
  const result: { point: Awaited<ReturnType<typeof findPoint>> } = { point: null };
  await expect.poll(async () => {
    result.point = await findPoint();
    return Boolean(result.point);
  }).toBe(true);
  if (!result.point) throw new Error(`Lucy header has no tappable background at its ${edge}`);
  return result.point;
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

async function seedScrollableLucyConversation(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    const now = Date.now();
    const content = Array.from({ length: 18 }, (_, index) =>
      `대화 스크롤 회귀 검증 ${index + 1}번째 문단입니다. 화면을 내린 뒤 빅뱅 이동을 실행할 수 있도록 긴 대화를 준비합니다.`
    ).join('\n');
    localStorage.setItem('chat_history_unified_v3', JSON.stringify([
      { id: 'bigbang-scroll-user', role: 'user', persona: 'lucy', content, timestamp: now - 1000 },
      { id: 'bigbang-scroll-answer', role: 'assistant', persona: 'lucy', content, timestamp: now },
    ]));
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
  // Engine box and prompt library are Lucy Master only.
  await expect(page.locator('[data-master-table-sheet-button]')).toHaveCount(0);
  await expect(page.getByRole('button', { name: '추천질문 라이브러리 열기' })).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('lucy_tier_mode'))).toBe('ai');
});

test('Lucy does not show an engine-evidence badge when no engines were recorded', async ({ page }) => {
  await page.addInitScript(() => {
    const now = Date.now();
    localStorage.setItem('chat_history_unified_v3', JSON.stringify([{
      id: 'synthetic-no-engine-evidence',
      role: 'assistant', persona: 'lucy', channel: 'trinity', channels: ['trinity'], mode: 'trinity',
      content: '엔진 사용 기록이 없는 합성 답변입니다.', timestamp: now,
    }]));
    localStorage.setItem('lucy_chat_auto_tts', 'false');
  });
  await openLucy(page);
  await expect(page.getByText('엔진 사용 기록이 없는 합성 답변입니다.')).toBeVisible();
  await expect(page.locator('[data-message-mode-badge="true"]')).toHaveCount(0);
  await expect(page.getByText('AI 심층 자동 상담', { exact: true })).toHaveCount(0);
});

test('Lucy chat shows no per-message mode or engine badges', async ({ page, baseURL }) => {
  const appOrigin = new URL(baseURL || 'http://127.0.0.1:4173').origin;
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin !== appOrigin || url.pathname.startsWith('/api/sync/')) {
      await route.abort();
      return;
    }
    await route.continue();
  });
  await page.addInitScript((timestamp) => {
    localStorage.setItem('chat_history_unified_v3', JSON.stringify([
      {
        id: 'synthetic-engine-badge-question',
        role: 'user',
        content: '사용자 질문에는 모드 배지를 표시하지 않습니다.',
        timestamp: timestamp - 60_000,
        mode: 'orange',
        channels: ['orange'],
      },
      {
        id: 'synthetic-engine-badge-check',
        role: 'assistant',
        content: '합성 엔진 배지 UI 확인 답변입니다.',
        timestamp,
        mode: 'orange',
        channels: ['orange'],
        calculationAudit: [
        { toolId: 'saju', name: '사주명리', status: 'calculated', sentToModel: true },
        { toolId: 'astrology', name: '서양 점성술', status: 'calculated', sentToModel: true },
        { toolId: 'sleepSubconscious', name: '수면 무의식 뇌파', status: 'symbolic', sentToModel: true },
        { toolId: 'ikigaiDestinyCompass', name: '이키가이 나침반', status: 'partial', sentToModel: true },
        { toolId: 'qimen', name: '홍국기문/기문둔갑', status: 'skipped', sentToModel: true },
        { toolId: 'tojeong', name: '토정비결', status: 'calculated', sentToModel: false },
        ],
      },
    ]));
  }, Date.now());
  await openLucy(page);

  await expect(page.getByText('사용자 질문에는 모드 배지를 표시하지 않습니다.', { exact: true })).toBeVisible();
  // 대화마다 붙던 모드·엔진 안내는 루시·루시+·루시 마스터 모두에서 제거됨
  await expect(page.locator('[data-message-mode-badge="true"]')).toHaveCount(0);
  await expect(page.locator('[data-message-theme-badge="true"]')).toHaveCount(0);
  await expect(page.getByRole('dialog', { name: '이번 답변에서 실제 사용한 엔진' })).toHaveCount(0);
});

test('Lucy engine box in the general chat tool sheet lists the deep perspectives', async ({ page }) => {
  // 엔진함은 일반 채팅 헤더의 연필 버튼 창에 있다(점술모드 도구함에는 도구 탭만 있다).
  await openLucy(page);
  const { panel: dialog } = await openChatEngineBox(page);
  await expect(dialog).toContainText('500개 심층 관점');
  await expect(dialog).toContainText('1~2개만 골라');
  // 담기·프리셋은 사용자 요청으로 제거됨: 엔진은 질문마다 자동으로 골라지고, 엔진함은 목록과 뜻만 보여 준다.
  await expect(dialog.locator('[data-engine-preset]')).toHaveCount(0);
  await expect(dialog.getByRole('button', { name: /담기$/ })).toHaveCount(0);
  await expect(dialog).toContainText('골라 답해요');
  const nameStyle = await dialog.locator('.lucy-engine-catalog-entry-name').first().evaluate(element => {
    const dialogElement = element.closest('[data-catalog-theme]');
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

test('Lucy groups every deep perspective under the seven channel themes', async ({ page }) => {
  await openLucy(page);
  const { panel: dialog } = await openChatEngineBox(page);
  const entries = dialog.getByTestId('lucy-engine-catalog-entry');
  await expect(entries).toHaveCount(500);
  const meaningTexts = await entries.locator('.lucy-engine-catalog-entry-meaning').allTextContents();
  expect(meaningTexts).toHaveLength(500);
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
  expect(groupedCount).toBe(515);
  await expect(dialog.getByRole('link')).toHaveCount(0);

  const themeNav = dialog.getByRole('navigation', { name: 'Lucy 7개 채널 테마' });
  const bluebirdFilter = themeNav.getByRole('button', { name: '블루버드 84', exact: true });
  await expect(bluebirdFilter).toBeVisible();
  const bluebirdGroup = dialog.getByTestId('lucy-engine-theme-bluebird');
  await expect(bluebirdGroup).toHaveAttribute('aria-label', '블루버드 테마');
  await expect(bluebirdGroup.locator('.lucy-engine-catalog-theme-name')).toHaveText('블루버드');
  await expect(bluebirdGroup.locator('.lucy-engine-catalog-theme-count')).toHaveText('84개');
  await expect(bluebirdGroup.locator('.lucy-engine-catalog-entry-theme').first()).toHaveText('테마: 블루버드');
  await bluebirdFilter.click();
  await expect(bluebirdFilter).toHaveAttribute('aria-pressed', 'true');
  await expect(dialog.getByTestId('lucy-engine-catalog-entry')).toHaveCount(84);

  const auraFilter = themeNav.getByRole('button', { name: /아우라/ });
  await auraFilter.click();
  await expect(auraFilter).toHaveAttribute('aria-pressed', 'true');
  await expect(dialog.getByTestId('lucy-engine-theme-aura')).toBeVisible();
  await expect(dialog.getByTestId('lucy-engine-theme-prologue')).toHaveCount(0);
  const auraCount = Number((await auraFilter.textContent())?.match(/\d+$/)?.[0]);
  expect(auraCount).toBeGreaterThan(0);
  await expect(dialog.getByTestId('lucy-engine-catalog-entry')).toHaveCount(auraCount);
});

test('Lucy chat engine box fills the tool window and its list scrolls without auto-opening the keyboard', async ({ page }) => {
  await openLucy(page);
  const { sheet, panel } = await openChatEngineBox(page);
  const search = panel.getByRole('searchbox', { name: '엔진과 관점 검색' });
  await expect(search).not.toBeFocused();

  const sheetBounds = await sheet.boundingBox();
  const panelBounds = await panel.boundingBox();
  expect(sheetBounds).not.toBeNull();
  expect(panelBounds).not.toBeNull();
  if (!sheetBounds || !panelBounds) throw new Error('Lucy tool window or engine tab is missing');
  expect(panelBounds.width).toBeGreaterThan(sheetBounds.width * 0.9);
  expect(panelBounds.height).toBeGreaterThan(sheetBounds.height * 0.6);

  const list = page.getByTestId('lucy-engine-catalog-list');
  await expect(list).toHaveAttribute('aria-busy', 'false');
  const metrics = await list.evaluate(element => {
    const style = getComputedStyle(element);
    return { clientHeight: element.clientHeight, scrollHeight: element.scrollHeight, overflowY: style.overflowY, touchAction: style.touchAction };
  });
  expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight + 500);
  expect(metrics.overflowY).toBe('auto');
  expect(metrics.touchAction).toBe('pan-y');

  await list.evaluate(async element => {
    // The catalog restores its saved scroll position after the last render batch.
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    element.scrollTo({ top: 400, behavior: 'instant' });
  });
  await expect.poll(() => list.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
  await sheet.getByRole('button', { name: '도구 창 닫기' }).click();
  await expect(sheet).toHaveCount(0);
});

test('typing in the composer shows no AI detection badge', async ({ page }) => {
  await openLucy(page);
  const composer = page.locator('.lucy-chat-footer textarea');
  await composer.fill('홍국기문(기문둔갑)으로 지금 막힌 상황을 분석해줘.');
  await page.waitForTimeout(500);
  await expect(page.locator('.lucy-auto-detect-badge')).toHaveCount(0);
  await expect(page.getByText('AI 감지')).toHaveCount(0);
});

test('Big Bang left and right taps step Lucy Master in Lucy chat', async ({ page }) => {
  await openLucy(page);
  const bigBang = page.locator('div[data-bigbang="true"]');
  await expect(bigBang).toBeVisible();
  await expectHiddenDirectionTarget(bigBang, 'north', 'epilogue');
  await expectHiddenDirectionTarget(bigBang, 'south', 'orb');
  const box = await bigBang.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error('Big Bang hit area is missing');

  const chatUrl = page.url();
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;
  const master = () => page.evaluate(() => sessionStorage.getItem('lucy_master_mode'));
  const tap = async (offsetX: number) => {
    await page.touchscreen.tap(centerX + offsetX, centerY);
    await page.waitForTimeout(450);
  };
  // 오른쪽 = 루시프로 켜기/끄기 토글 (단계 없음)
  await tap(36);
  await expect.poll(master).toBe('on');
  await tap(36);
  await expect.poll(master).toBeNull();
  // 오른쪽으로 켜고, 왼쪽으로 일반 루시로 돌아오기
  await tap(36);
  await expect.poll(master).toBe('on');
  await tap(-36);
  await expect.poll(master).toBeNull();
  // 화면(채널)은 바뀌지 않는다.
  await expect(page).toHaveURL(chatUrl);
  await expect(page.locator('.lucy-chat-footer')).toBeVisible();
});

test('Big Bang left and right taps move the visible Key list without leaving Key', async ({ page }) => {
  await openKeyChannel(page);
  const bigBang = page.locator('div[data-bigbang="true"]');
  await expectHiddenDirectionTarget(bigBang, 'north', 'orb');
  await expectHiddenDirectionTarget(bigBang, 'south', 'lucky');
  const box = await bigBang.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error('Big Bang hit area is missing in Key');
  const keyUrl = page.url();
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;
  const frame = page.frameLocator('iframe[src*="/calm/"]');
  const active = frame.locator('.exercises-filter-strip .filter-pill-btn.active');
  await expect(active).toHaveAttribute('data-chapter', 'all');
  // 오른쪽 = 다음 목록, 왼쪽 = 이전 목록 (처음에서 왼쪽이면 끝으로)
  await page.touchscreen.tap(centerX + 36, centerY);
  await expect(active).toHaveAttribute('data-chapter', 'book1');
  await page.touchscreen.tap(centerX + 36, centerY);
  await expect(active).toHaveAttribute('data-chapter', 'book2');
  await page.touchscreen.tap(centerX - 36, centerY);
  await expect(active).toHaveAttribute('data-chapter', 'book1');
  await page.touchscreen.tap(centerX - 36, centerY);
  await page.touchscreen.tap(centerX - 36, centerY);
  await expect(active).toHaveAttribute('data-chapter', '8');
  await expect(page).toHaveURL(keyUrl);
});

test('Big Bang center double tap opens the Key channel without firing a single-tap action', async ({ page }) => {
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
    // Keep the synthetic presses inside the gesture window on a busy runner.
    const now = performance.now;
    let gestureTime = now.call(performance);
    try {
      performance.now = () => gestureTime;
      tap();
      gestureTime += 50;
      tap();
    } finally {
      performance.now = now;
    }
  }, { x, y });
  await expect.poll(() => page.evaluate(() => Boolean((window as any).__bigBangTestCommit?.target?.destinationPath))).toBe(true);
  const commit = await page.evaluate(() => (window as any).__bigBangTestCommit);
  expect(commit.isDoubleTapSuction).toBe(false);
  const destination = commit.target.destinationPath as string;
  expect(destination).toBe('/key');
  const expected = new URL(destination, page.url());
  await expect.poll(() => {
    const current = new URL(page.url());
    return `${current.pathname}${current.search}`;
  }).toBe(`${expected.pathname}${expected.search}`);
  await expect(page.getByTestId('key-channel-transition')).toBeVisible();
  await page.waitForTimeout(350);
  expect(await page.evaluate(() => (window as any).__bigBangNormalTapCount)).toBe(0);
});

test('Big Bang center single tap follows the smart guide and shows its banner', async ({ page }) => {
  await openPrologue(page);
  const button = page.locator('#bigbang-omnibutton');
  await expect(button).toBeVisible();
  const box = await button.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error('Big Bang button is missing for single-tap test');
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;

  await page.evaluate(() => {
    (window as any).__bigBangSingleTapCommits = [];
    window.addEventListener('prism:bigbang_commit', (event) => {
      (window as any).__bigBangSingleTapCommits.push((event as CustomEvent).detail);
    });
  });
  await page.evaluate(({ x, y }) => {
    const target = document.querySelector<HTMLElement>('#bigbang-omnibutton');
    if (!target) throw new Error('Big Bang button is missing from the page');
    const common = { bubbles: true, cancelable: true, pointerId: 12, pointerType: 'touch', isPrimary: true, clientX: x, clientY: y, button: 0 };
    target.dispatchEvent(new PointerEvent('pointerdown', { ...common, buttons: 1 }));
    target.dispatchEvent(new PointerEvent('pointerup', { ...common, buttons: 0 }));
  }, { x, y });

  // 생년월일이 없는 새 브라우저에서는 프로필부터 안내한다. 어느 쪽이든 지금 화면(/prologue)은 아니다.
  const banner = page.getByTestId('bigbang-smart-guide');
  await expect(banner).toBeVisible();
  const guidePath = await banner.getAttribute('data-smart-guide-path');
  expect(guidePath).toBeTruthy();
  expect(guidePath).not.toBe('/prologue');
  await expect.poll(() => new URL(page.url()).pathname).toBe(guidePath);
  await expect(page.getByText('🧭 지금 추천:')).toBeVisible();
  // 홀드와 달리 한 번 탭은 예전의 고정 전환(추천 워프)을 일으키지 않는다.
  const commits = await page.evaluate(() => (window as any).__bigBangSingleTapCommits);
  expect(commits).toHaveLength(0);
  // 배너는 탭하면 닫힌다.
  await banner.click({ position: { x: 8, y: 8 } });
  await expect(banner).toHaveCount(0);
});

test('Big Bang hold always opens the orb page, from any screen', async ({ page }) => {
  const hold = async (target = page.locator('#bigbang-omnibutton')) => {
    await target.evaluate((element) => {
      const box = element.getBoundingClientRect();
      const pointer = {
        bubbles: true, cancelable: true, pointerId: 7, pointerType: 'touch', isPrimary: true, button: 0,
        clientX: box.x + box.width / 2, clientY: box.y + box.height / 2,
      };
      const now = performance.now;
      let gestureTime = now.call(performance);
      try {
        performance.now = () => gestureTime;
        element.dispatchEvent(new PointerEvent('pointerdown', { ...pointer, buttons: 1 }));
        gestureTime += 650;
        element.dispatchEvent(new PointerEvent('pointerup', { ...pointer, buttons: 0 }));
      } finally {
        performance.now = now;
      }
    });
  };

  // 루시 채팅에서 홀드 → 오브
  await openLucy(page);
  await expect(page.locator('#bigbang-omnibutton')).toBeVisible();
  await hold();
  await expect.poll(() => new URL(page.url()).pathname).toBe('/voice');
  // 홀드는 점술모드를 켜지 않는다.
  expect(await page.evaluate(() => sessionStorage.getItem('lucy_master_mode'))).toBeNull();

  // 다른 페이지(럭키)에서 홀드 → 오브
  await page.goto('/lucky');
  await expect(page.locator('#bigbang-omnibutton')).toBeVisible();
  await hold();
  await expect.poll(() => new URL(page.url()).pathname).toBe('/voice');
});

test('the question-mark header button opens the smart guide settings on every page', async ({ page }) => {
  for (const path of ['/lucky', '/key', '/voice', '/profile']) {
    await page.goto(path);
    const button = page.locator('[data-smart-guide-settings-button="true"]').first();
    await expect(button).toBeVisible();
    await button.click();
    const sheet = page.locator('[data-smart-guide-settings="true"]');
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole('switch', { name: '스마트 가이드' })).toBeVisible();
    await expect(sheet.getByRole('switch', { name: '가이드 도슨트' })).toBeVisible();
    // 켜고 끈 결과가 저장된다.
    const before = await page.evaluate(() => localStorage.getItem('luckey_smart_guide_settings_v1'));
    await sheet.getByRole('switch', { name: '스마트 가이드' }).click();
    const after = await page.evaluate(() => localStorage.getItem('luckey_smart_guide_settings_v1'));
    expect(after).not.toBe(before);
    await sheet.getByRole('button', { name: '설정 닫기' }).click();
    await expect(sheet).toHaveCount(0);
    // 다음 페이지 검사에 영향이 없도록 다시 켜 둔다.
    await page.evaluate(() => localStorage.setItem('luckey_smart_guide_settings_v1', JSON.stringify({ guide: true, douser: false })));
  }
});

test('with the smart guide off the tap still moves, without banner or douser', async ({ page }) => {
  await page.goto('/lucky');
  await page.evaluate(() => localStorage.setItem('luckey_smart_guide_settings_v1', JSON.stringify({ guide: false, douser: false })));
  await page.reload();
  const button = page.locator('#bigbang-omnibutton');
  await expect(button).toBeVisible();
  await button.evaluate((element) => {
    const box = element.getBoundingClientRect();
    const pointer = {
      bubbles: true, cancelable: true, pointerId: 21, pointerType: 'touch', isPrimary: true, button: 0,
      clientX: box.x + box.width / 2, clientY: box.y + box.height / 2,
    };
    const now = performance.now;
    let gestureTime = now.call(performance);
    try {
      performance.now = () => gestureTime;
      element.dispatchEvent(new PointerEvent('pointerdown', { ...pointer, buttons: 1 }));
      gestureTime += 40;
      element.dispatchEvent(new PointerEvent('pointerup', { ...pointer, buttons: 0 }));
    } finally {
      performance.now = now;
    }
  });
  // 이동은 그대로 (결정된 추천 경로로), 배너는 없음
  await expect.poll(() => new URL(page.url()).pathname).not.toBe('/lucky');
  await expect(page.getByTestId('bigbang-smart-guide')).toHaveCount(0);
});

test('Lucy Plus selection survives left pane navigation and returns with the cosmic room', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 900 });
  await openLucy(page, '/chat');

  const leftPane = page.locator('#duo-content-viewport');
  const lucyPane = page.locator('#duo-lucy-viewport');
  const lucyBubble = page.locator('#main-sidebar-navigation button[aria-label^="Lucy"]');
  await expect(page.locator('html')).toHaveClass(/duo-unfolded-portrait/);
  await expect(leftPane.locator('.cosmic-room')).toBeVisible();
  await expect(lucyBubble.locator('[data-lucy-mode-marker]')).toHaveCount(0); // 일반 루시 = 속이 빈 말풍선
  await expect.poll(() => page.locator('html').evaluate(element => element.classList.contains('lucy-plus-active'))).toBe(true);
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('lucy_master_mode'))).toBeNull();

  await page.evaluate(() => window.dispatchEvent(new CustomEvent('prism-navigate', { detail: { path: '/prologue' } })));
  await expect.poll(() => new URL(page.url()).pathname).toBe('/prologue');
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('lucy_bubble_marker'))).toBe('plus');
  await expect.poll(() => page.locator('html').evaluate(element => element.classList.contains('lucy-plus-active'))).toBe(false);
  await expect(lucyBubble.locator('[data-lucy-mode-marker]')).toHaveCount(0); // 일반 루시 = 속이 빈 말풍선
  await expect(leftPane.locator('.cosmic-room')).toHaveCount(0);
  await expect(lucyPane.locator('.lucy-chat-footer textarea')).toBeVisible();

  await lucyBubble.click();
  await expect.poll(() => new URL(page.url()).pathname).toBe('/');
  await expect(lucyBubble.locator('[data-lucy-mode-marker]')).toHaveCount(0); // 일반 루시 = 속이 빈 말풍선
  await expect.poll(() => page.locator('html').evaluate(element => element.classList.contains('lucy-plus-active'))).toBe(true);
  await expect(leftPane.locator('.cosmic-room')).toBeVisible();
});

test('expanded Cosmic Room starts in Lucy Plus and the bubble opens the unified Lucy Pro', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 900 });
  await openLucy(page, '/chat');

  const leftPane = page.locator('#duo-content-viewport');
  const lucyPane = page.locator('#duo-lucy-viewport');
  const lucyBubble = page.locator('#main-sidebar-navigation button[aria-label^="Lucy"]');
  await expect(page.locator('html')).toHaveClass(/duo-unfolded-portrait/);

  // The visible Cosmic Room makes Lucy Plus active automatically before any tap.
  await expect(lucyBubble.locator('[data-lucy-pro-bubble="true"]')).toHaveCount(0);
  await expect.poll(() => page.locator('html').evaluate(element => element.classList.contains('lucy-plus-active'))).toBe(true);

  // Tapping the already-active Lucy Plus opens Lucy Pro with every divination tab already available.
  await lucyBubble.click();
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('lucy_master_mode'))).toBe('on');
  await expect(lucyBubble.locator('[data-lucy-pro-bubble="true"]')).toBeVisible();
  await expect(leftPane.locator('[data-duo-divination-tarot="true"]')).toBeVisible();
  await expect(lucyPane.locator('[data-lucy-name-marker="master"]')).toBeVisible();
  for (const face of ['saju', 'tarot', 'astrology', 'ziwei', 'sukuyo', 'mahabote', 'vedic', 'liuren', 'qimen', 'kabbalah', 'iching', 'thai_astrology', 'tojeong', 'kyusei', 'taiyi']) {
    await expect(leftPane.locator(`[data-table-face="${face}"]`)).toBeVisible();
  }
  expect(await page.evaluate(() => sessionStorage.getItem('lucy_master_depth'))).toBeNull();

  // 펼친 화면에서 한 번 더 누르면 일반 루시로 돌아온다 (단계 없음).
  await lucyBubble.click();
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('lucy_master_mode'))).toBeNull();
});

test('folded Lucy shows an empty bubble and the dot bubble only in Lucy Pro', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openLucy(page, '/chat');

  const lucyBubble = page.locator('#main-sidebar-navigation button[aria-label^="Lucy"]');
  await expect(page.locator('#duo-content-viewport')).toHaveCount(0);
  await expect(lucyBubble.locator('[data-lucy-pro-bubble="true"]')).toHaveCount(0);

  await lucyBubble.click();
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('lucy_master_mode'))).toBe('on');
  await expect(lucyBubble.locator('[data-lucy-pro-bubble="true"]')).toBeVisible();
});

test('folded Lucy must be activated from another app before entering divination', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPrologue(page, '/prologue');

  const lucyBubble = page.locator('#main-sidebar-navigation button[aria-label^="Lucy"]');
  await expect(lucyBubble.locator('[data-lucy-mode-marker]')).toHaveCount(0); // 일반 루시 = 속이 빈 말풍선
  await lucyBubble.click();
  await expect.poll(() => new URL(page.url()).pathname).toBe('/');
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('lucy_master_mode'))).toBeNull();
  await expect(lucyBubble.locator('[data-lucy-mode-marker]')).toHaveCount(0); // 일반 루시 = 속이 빈 말풍선

  await lucyBubble.click();
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('lucy_master_mode'))).toBe('on');
  await expect(lucyBubble.locator('[data-lucy-pro-bubble="true"]')).toBeVisible();
});

test('unfolding from a folded app restores that app on the left, not Lucy Plus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPrologue(page, '/prologue');
  await page.setViewportSize({ width: 700, height: 900 });

  const leftPane = page.locator('#duo-content-viewport');
  const lucyBubble = page.locator('#main-sidebar-navigation button[aria-label^="Lucy"]');
  await expect(page.locator('html')).toHaveClass(/duo-unfolded-portrait/);
  await expect.poll(() => new URL(page.url()).pathname).toBe('/prologue');
  await expect(leftPane.locator('.channel-page')).toBeVisible();
  await expect(leftPane.locator('.cosmic-room')).toHaveCount(0);
  await expect(lucyBubble.locator('[data-lucy-mode-marker]')).toHaveCount(0); // 일반 루시 = 속이 빈 말풍선
  await expect.poll(() => page.locator('html').evaluate(element => element.classList.contains('lucy-plus-active'))).toBe(false);
});

test('Lucy Master preserves the other pane on re-entry; only a Lucy bubble tap opens its tools', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 900 });
  await openLucyMaster(page, '/chat');

  const leftPane = page.locator('#duo-content-viewport');
  const lucyPane = page.locator('#duo-lucy-viewport');
  await expect(page.locator('html')).toHaveClass(/duo-unfolded-portrait/);
  await expect(leftPane.locator('[data-duo-divination-tarot="true"]')).toBeVisible();
  await expect(lucyPane.locator('[data-lucy-name-marker="master"]')).toBeVisible();

  await page.evaluate(() => window.dispatchEvent(new CustomEvent('prism-navigate', { detail: { path: '/prologue' } })));
  await expect.poll(() => new URL(page.url()).pathname).toBe('/prologue');
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('lucy_master_mode'))).toBe('on');
  await expect(leftPane.locator('[data-duo-divination-tarot="true"]')).toHaveCount(0);
  await expect(lucyPane.locator('[data-lucy-name-marker="master"]')).toBeVisible();

  // Re-entering the app at its retained route must keep that pane, not auto-open tarot tools.
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect.poll(() => new URL(page.url()).pathname).toBe('/prologue');
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('lucy_master_mode'))).toBe('on');
  await expect(leftPane.locator('[data-duo-divination-tarot="true"]')).toHaveCount(0);

  await page.locator('#main-sidebar-navigation button[aria-label^="Lucy"]').tap();
  await expect.poll(() => new URL(page.url()).pathname).toBe('/');
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('lucy_master_mode'))).toBe('on');
  await expect(leftPane.locator('[data-duo-divination-tarot="true"]')).toBeVisible();
  await expect(lucyPane.locator('[data-lucy-name-marker="master"]')).toBeVisible();
});

test('Master keeps its tools visible when the split screen is unfolded again', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 900 });
  await openLucyMaster(page);
  const tools = page.locator('#duo-content-viewport [data-duo-divination-tarot="true"]');
  await expect(page.locator('html')).toHaveClass(/duo-unfolded-portrait/);
  await expect(tools).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('html')).not.toHaveClass(/duo-unfolded-mode/);
  await expect(tools).toBeHidden();
  await page.setViewportSize({ width: 700, height: 900 });
  await expect(page.locator('html')).toHaveClass(/duo-unfolded-portrait/);
  await expect(tools).toBeVisible();
});

test('Big Bang overlay remains visible for the newest overlapping transition', async ({ page }) => {
  await openLucy(page);
  const overlay = page.getByTestId('bigbang-transition-overlay');
  await page.evaluate(() => {
    const nativeSetTimeout = window.setTimeout.bind(window);
    (window as any).__bigBangOverlayClearCallbacks = [];
    window.setTimeout = ((handler: TimerHandler, timeout?: number, ...args: any[]) => {
      const timer = nativeSetTimeout(handler, timeout, ...args);
      if (timeout === 820 && typeof handler === 'function') (window as any).__bigBangOverlayClearCallbacks.push(handler);
      return timer;
    }) as typeof window.setTimeout;
  });
  const dispatchCommit = () => page.evaluate(() => {
    const target = {
      id: 'trinity', phase: 'wormhole', gauge: 1, aiTemperature: 0, title: 'Trinity', name: 'Trinity',
      actionType: 'navigate', destinationPath: '/trinity', previewLabel: 'Trinity', previewDescription: 'Trinity',
      themeColor: '#8B5CF6', accentGlow: 'rgba(168, 85, 247, 0.72)',
    };
    const metrics = { hardwarePressure: 0, touchArea: 0, durationMs: 0, virtualForce: 1, isAborted: false, phase: 'wormhole' };
    window.dispatchEvent(new CustomEvent('prism:bigbang_commit', {
      detail: { phase: 'wormhole', isDoubleTapSuction: false, target, context: null, metrics, timestamp: Date.now() },
    }));
  });

  await dispatchCommit();
  await expect(overlay).toBeVisible();
  await page.waitForTimeout(550);
  await dispatchCommit();
  await page.evaluate(() => {
    const callbacks = (window as any).__bigBangOverlayClearCallbacks as Array<() => void>;
    if (callbacks.length < 2) throw new Error(`Expected two overlay clear callbacks, got ${callbacks.length}`);
    callbacks[0]();
  });
  await expect(overlay).toBeVisible();
});

test('Key loading fallback does not consume the first Big Bang south touch', async ({ page }) => {
  await page.addInitScript(() => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    localStorage.setItem('lu_unlocked_date', today);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
    sessionStorage.setItem('profileModalDismissed', '1');
  });
  let releaseFrame!: () => void;
  const unblockFrame = new Promise<void>(resolve => { releaseFrame = resolve; });
  await page.route('**/calm/index.html*', async route => {
    await unblockFrame;
    await route.continue().catch(() => {}); // Navigating away may cancel the pending iframe.
  });
  try {
    await page.goto('/key', { waitUntil: 'domcontentloaded' });

    const loader = page.locator('[data-app-channel-loader="true"][aria-label^="Key 개운"]');
    await expect(loader).toBeVisible();
    await expect(loader).toBeHidden();

    const bigBang = page.locator('#bigbang-omnibutton');
    await expect(bigBang).toBeVisible();
    const box = await bigBang.boundingBox();
    expect(box).not.toBeNull();
    if (!box) throw new Error('Big Bang hit area is missing while the Key iframe is delayed');
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2 + 36;
    await page.waitForFunction(({ x, y }) => Boolean(document.elementFromPoint(x, y)?.closest('[data-bigbang="true"]')), { x, y });
    await page.touchscreen.tap(x, y);
    await expect.poll(() => new URL(page.url()).pathname).toBe('/lucky');
  } finally {
    releaseFrame();
  }
});

test('Big Bang stays over Lucy while left and right change only the channel pane', async ({ page }) => {
  test.setTimeout(150_000);
  await page.setViewportSize({ width: 960, height: 700 });
  await page.addInitScript(() => localStorage.setItem('prism_device_perf_override', 'duo'));
  await openPrologue(page, '/heal?tab=meditation');
  const channelPane = page.locator('#duo-content-viewport');
  const lucyPane = page.locator('#duo-lucy-viewport');
  await expect(channelPane).toBeVisible();
  await expect(lucyPane).toBeVisible();
  const lucyComposer = lucyPane.locator('.lucy-chat-footer textarea');
  await expect(lucyComposer).toBeVisible();
  const lucyComposerValueBefore = await lucyComposer.inputValue();
  const lucyUserMessageCountBefore = await lucyPane.locator('.lucy-chat-main > div > [class*="items-end"]').count();

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
  await seedScrollableLucyConversation(page);
  await openLucy(page);
  const tapFromMiddle = async (offsetY: number, expectedPath: string) => {
    await expect.poll(() => page.locator('.lucy-chat-main').evaluate(element => element.scrollHeight - element.clientHeight)).toBeGreaterThan(500);
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
      root.dispatchEvent(new WheelEvent('wheel', { deltaY: -120, bubbles: true }));
      root.scrollTo({ top: 120, behavior: 'instant' });
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

  await tapFromMiddle(-36, '/epilogue');
  await openLucy(page);
  await tapFromMiddle(36, '/voice');
});

test('Big Bang south switches immediately even when an unrelated inner list remains at its top', async ({ page }) => {
  await openLucy(page);
  const scrollState = await setLucyPrimaryScrollAtBottomWithUnrelatedListAtTop(page);
  expect(scrollState.primaryRemaining).toBeLessThanOrEqual(2);
  expect(scrollState.unrelatedMax).toBeGreaterThan(0);
  expect(scrollState.unrelatedTop).toBe(0);

  const bigBang = page.locator('div[data-bigbang="true"]').first();
  await expectHiddenDirectionTarget(bigBang, 'south', 'orb');
  const box = await bigBang.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error('Big Bang hit area is missing in Lucy');
  await Promise.all([
    expect(page.locator('[data-bigbang-center-channel="orb"][data-bigbang-center-direction="south"]')).toBeVisible(),
    page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2 + 36),
  ]);
  await expect(page).toHaveURL(/\/voice$/);
});

test('Big Bang down follows right-menu order in Key and Lucky channels from non-bottom positions', async ({ page }) => {
  await openKeyChannel(page);
  const bigBang = page.locator('div[data-bigbang="true"]');
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
  await expectHiddenDirectionTarget(bigBang, 'north', 'orb');
  await expectHiddenDirectionTarget(bigBang, 'south', 'lucky');
  let box = await bigBang.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error('Big Bang hit area is missing in Key');
  const southX = box.x + box.width / 2;
  const southY = box.y + box.height / 2 + 36;
  await page.waitForFunction(({ x, y }) => Boolean(document.elementFromPoint(x, y)?.closest('[data-bigbang="true"]')), { x: southX, y: southY });
  await page.touchscreen.tap(southX, southY);
  await expect.poll(() => new URL(page.url()).pathname).toBe('/lucky');
  expect(Number(await page.evaluate(() => sessionStorage.getItem('bigbang.key.scrollTopAtPress')))).toBe(0);
  expect(Number(await page.evaluate(() => sessionStorage.getItem('bigbang.key.scrollEvents')))).toBe(0);
  await expectHiddenDirectionTarget(bigBang, 'south', 'prologue');
  const luckyMenuBox = await bigBang.boundingBox();
  if (!luckyMenuBox) throw new Error('Big Bang hit area is missing in Lucky');
  await page.touchscreen.tap(luckyMenuBox.x + luckyMenuBox.width / 2, luckyMenuBox.y + luckyMenuBox.height / 2 + 36);
  await expect.poll(() => new URL(page.url()).pathname).toBe('/prologue');
  expect([null, 'universe']).toContain(new URL(page.url()).searchParams.get('tab'));
  await expectHiddenDirectionTarget(bigBang, 'north', 'lucky');
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
  for (const [direction, channel] of [['north', 'lucky'], ['south', 'orange'], ['west', 'prologue'], ['east', 'prologue']]) {
    await expectHiddenDirectionTarget(bigBang, direction, channel);
  }
  let box = await bigBang.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error('Big Bang hit area is missing in Prologue');
  await Promise.all([
    expect(page.locator('[data-bigbang-center-channel="prologue"][data-bigbang-center-direction="east"]')).toBeVisible(),
    page.touchscreen.tap(box.x + box.width / 2 + 36, box.y + box.height / 2),
  ]);
  await expect(page).toHaveURL(/\/prologue\?tab=universe$/);

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
  await Promise.all([
    expect(page.locator('[data-bigbang-center-channel="prologue"][data-bigbang-center-direction="west"]')).toBeVisible(),
    page.touchscreen.tap(westX, westY),
  ]);
  await expect(page).toHaveURL(initialUrl);
  expect(page.url()).not.toBe(afterEastUrl);
});

test('Big Bang drag released in range warps to a recommended Lucky app', async ({ page }) => {
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
  await expect.poll(() => page.url(), { timeout: 4000 }).not.toBe(before);
  const path = new URL(page.url()).pathname;
  expect(['/', '/chat', '/key', '/lucy']).not.toContain(path);
});

test('Big Bang drag released out of range is cancelled', async ({ page }) => {
  await openPrologue(page);
  const button = page.locator('#bigbang-omnibutton');
  await expect(button).toBeVisible();
  const before = page.url();
  const box = await button.boundingBox();
  if (!box) throw new Error('Big Bang button is missing for drag test');
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x, y - 260, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(900);
  await expect(page).toHaveURL(before);
});

test('Big Bang north at the Key channel top boundary opens Orb', async ({ page }) => {
  await openKeyChannel(page);
  const bigBang = page.locator('div[data-bigbang="true"]');
  await expectHiddenDirectionTarget(bigBang, 'north', 'orb');
  await setContentScrollBoundary(page, 'top');
  await expectContentScrollBoundary(page, 'top');
  await page.waitForTimeout(200);
  const box = await bigBang.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error('Big Bang hit area is missing in Key');
  const northX = box.x + box.width / 2;
  const northY = box.y + box.height / 2 - 36;
  await page.waitForFunction(({ x, y }) => Boolean(document.elementFromPoint(x, y)?.closest('[data-bigbang="true"]')), { x: northX, y: northY });
  await Promise.all([
    expect(page.locator('[data-bigbang-center-channel="orb"][data-bigbang-center-direction="north"]')).toBeVisible(),
    page.touchscreen.tap(northX, northY),
  ]);
  await expect(page).toHaveURL(/\/voice$/);
  await expect(page.locator('.lucy-orb-masters')).toBeVisible();
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
  await page.addInitScript(() => {
    const now = Date.now();
    const longContent = Array.from({ length: 18 }, (_, index) =>
      `대화 스크롤 회귀 검증 ${index + 1}번째 문단입니다. 실제 상담의 줄바꿈과 문단 간격이 충분히 생기도록 내용을 길게 준비합니다. 오래된 내용도 확인하고 최근 대화로 돌아갈 수 있어야 합니다.`
    ).join('\n');
    localStorage.setItem('chat_history_unified_v3', JSON.stringify([
      {
        id: 'header-scroll-user', role: 'user', persona: 'lucy', channel: 'lucy', channels: ['lucy'], mode: 'trinity',
        content: longContent, timestamp: now - 60_000,
      },
      {
        id: 'header-scroll-answer', role: 'assistant', persona: 'lucy', channel: 'lucy', channels: ['lucy'], mode: 'trinity',
        content: longContent, timestamp: now,
      },
    ]));
    localStorage.setItem('lucy_chat_auto_tts', 'false');
  });
  await openLucy(page);
  const messages = page.locator('.lucy-chat-main');
  await expect.poll(() => messages.evaluate(element => element.scrollHeight - element.clientHeight)).toBeGreaterThan(500);
  await expect.poll(async () => {
    const before = await messages.evaluate(element => element.scrollHeight);
    await page.waitForTimeout(120);
    return await messages.evaluate(element => element.scrollHeight) === before;
  }).toBe(true);

  const returnButton = page.getByRole('button', { name: '최근대화' });
  const simulateConversationScroll = (deltaY: number) => messages.evaluate((element, delta) => {
    element.dispatchEvent(new WheelEvent('wheel', { deltaY: delta, bubbles: true }));
    const maxScroll = Math.max(0, element.scrollHeight - element.clientHeight);
    element.scrollTop = Math.min(maxScroll, Math.max(0, element.scrollTop + delta));
    element.dispatchEvent(new Event('scroll'));
  }, deltaY);
  await messages.evaluate(element => { element.style.scrollBehavior = 'auto'; element.scrollTop = element.scrollHeight; element.dispatchEvent(new Event('scroll')); });
  await expect.poll(() => messages.evaluate(element => element.scrollHeight - element.scrollTop - element.clientHeight)).toBeLessThan(3);
  await simulateConversationScroll(-650);
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
  await returnButton.tap();
  await expect.poll(() => messages.evaluate(element => element.scrollHeight - element.scrollTop - element.clientHeight)).toBeLessThan(3);
  await expect(returnButton).toBeHidden();

  await simulateConversationScroll(-400);
  await expect.poll(() => messages.evaluate(element => element.scrollTop)).toBeGreaterThan(80);
  const bottomTap = await getLucyHeaderBackground(page, 'bottom');
  await page.mouse.click(bottomTap.x, bottomTap.y);
  await expect.poll(() => messages.evaluate(element => element.scrollTop)).toBeLessThan(3);
  await expect(returnButton).toBeVisible();

  await simulateConversationScroll(400);
  await expect.poll(() => messages.evaluate(element => element.scrollTop)).toBeGreaterThan(80);
  const topTap = await getLucyHeaderBackground(page, 'top');
  await page.mouse.click(topTap.x, topTap.y);
  await expect.poll(() => messages.evaluate(element => element.scrollTop)).toBeLessThan(3);

  await page.evaluate(async () => {
    let visibility: 'hidden' | 'visible' = 'hidden';
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => visibility,
    });
    try {
      document.dispatchEvent(new Event('visibilitychange'));
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      visibility = 'visible';
      document.dispatchEvent(new Event('visibilitychange'));
    } finally {
      Reflect.deleteProperty(document, 'visibilityState');
    }
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
  await expect(page.locator('[data-message-mode-badge="true"]')).toHaveCount(0);
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
  // v1.7.943 adds a Lucy entry screen and an initial alignment scroll; let its 200ms
  // auto-scroll guard finish before this test simulates a deliberate user scroll.
  await page.waitForTimeout(250);

  const returnButton = page.getByRole('button', { name: '최근대화' });
  await messages.evaluate(element => {
    const dispatchScrollTouch = (type: 'touchstart' | 'touchmove', clientY: number) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'touches', { value: [{ clientY }] });
      element.dispatchEvent(event);
    };
    dispatchScrollTouch('touchstart', 100);
    dispatchScrollTouch('touchmove', 120);
    element.style.scrollBehavior = 'auto';
    element.scrollTop = Math.floor((element.scrollHeight - element.clientHeight) * 0.82);
    element.dispatchEvent(new Event('scroll', { bubbles: true }));
  });
  await expect(returnButton).toBeVisible();
  const touchStartTop = await messages.evaluate(element => element.scrollTop);
  expect(touchStartTop).toBeGreaterThan(80);

  const topTap = await getLucyHeaderBackground(page, 'top');
  await page.evaluate(() => {
    const messages = document.querySelector('.lucy-chat-main') as HTMLElement | null;
    if (!messages) throw new Error('Lucy message scroller is missing');
    const state = window as Window & { __lucyTopScrollTrace?: number[] };
    state.__lucyTopScrollTrace = [];
    messages.addEventListener('scroll', () => {
      state.__lucyTopScrollTrace?.push(messages.scrollTop);
    }, { passive: true });
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

  const messages = page.locator('#duo-lucy-viewport .lucy-chat-main');
  await expect(messages).toBeVisible();
  await messages.evaluate(element => {
    // Set the gesture's starting boundary in the same task as touchstart.
    // Lucy can restore its last scroll position between browser calls.
    for (let scroller: Element | null = element; scroller; scroller = scroller.parentElement) {
      if (scroller.scrollTop > 0) scroller.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
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
  await expect.poll(() => tabs.evaluate(element => element.classList.contains('key-tabs-pinned'))).toBe(true);

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
  expect(layout.tabsPosition).toBe('fixed');
  expect(layout.navTop).toBeGreaterThanOrEqual(-1);
  expect(layout.tabsTop).toBeGreaterThanOrEqual(layout.navBottom - 2);
  expect(layout.tabsTop).toBeLessThanOrEqual(layout.navBottom + 3);
});

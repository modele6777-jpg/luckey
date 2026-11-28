import { expect, test, type Locator, type Page } from '@playwright/test';

type LucyMode = 'chat' | 'divination';

async function openLucyMode(page: Page, mode: LucyMode) {
  await page.setViewportSize({ width: 700, height: 900 });
  await page.addInitScript((currentMode: LucyMode) => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    localStorage.setItem('lu_unlocked_date', today);
    localStorage.setItem('lucy_chat_auto_tts', 'false');
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
    sessionStorage.setItem('profileModalDismissed', '1');
    sessionStorage.setItem('lucy_master_mode_state', JSON.stringify({ on: currentMode === 'divination', unfolded: true, explicit: true }));
    if (currentMode === 'divination') sessionStorage.setItem('lucy_master_mode', 'on');
    else sessionStorage.removeItem('lucy_master_mode');
  }, mode);

  await page.goto('/chat');
  const lockScreen = page.locator('[data-pin-screen]');
  if (await lockScreen.count()) {
    for (const digit of '1202') await page.keyboard.press(digit);
    await expect(lockScreen).toHaveCount(0);
  }

  const header = page.locator('#duo-lucy-viewport .lucy-chat-header');
  await expect(header).toBeVisible();
  await expect(header.locator('[data-page-guide-button]')).toHaveAttribute('data-page-guide-button', mode === 'divination' ? 'master' : 'lucy');
  if (mode === 'divination') {
    await expect(page.locator('#duo-content-viewport [data-duo-divination-tarot="true"]')).toBeVisible();
  }
}

async function readChrome(locator: Locator) {
  return locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      backgroundColor: style.backgroundColor,
      borderWidth: style.borderWidth,
      borderStyle: style.borderStyle,
      boxShadow: style.boxShadow,
      outlineStyle: style.outlineStyle,
    };
  });
}

async function expectBorder(locator: Locator, active: boolean) {
  // Header controls use transition-all; wait for their 300ms border-width transition to finish.
  await expect.poll(async () => (await readChrome(locator)).borderWidth).toBe(active ? '1px' : '0px');
  const chrome = await readChrome(locator);
  expect(chrome.borderWidth).toBe(active ? '1px' : '0px');
  expect(chrome.boxShadow).toBe('none');
  if (!active) expect(chrome.backgroundColor).toBe('rgba(0, 0, 0, 0)');
}

async function expectLucyHeaderControls(page: Page, mode: LucyMode) {
  const header = page.locator('#duo-lucy-viewport .lucy-chat-header');
  const toolButton = header.locator('[data-master-table-sheet-button]');
  const engineButton = header.locator('[data-master-engine-catalog-button]');
  const guide = header.locator('[data-page-guide-button]');
  const speaker = header.locator('[data-auto-tts-toggle="true"]');
  const smartGuide = header.locator('[data-smart-guide-settings-button="true"]');
  const search = header.getByRole('button', { name: '대화 검색' });

  await expect(toolButton).toBeVisible();
  await expect(toolButton).toHaveAttribute('aria-expanded', 'false');
  await expectBorder(toolButton, false);
  if (mode === 'divination') {
    await expect(engineButton).toBeVisible();
    await expect(engineButton).toHaveAttribute('aria-expanded', 'false');
    await expectBorder(engineButton, false);
  } else {
    await expect(engineButton).toHaveCount(0);
  }

  await expect(guide).toBeVisible();
  await expect(guide).toHaveAccessibleName(/가이드 열기/);
  await expect(guide).toHaveAttribute('aria-expanded', 'false');
  await expectBorder(guide, false);

  await expect(speaker).toBeVisible();
  await expect(speaker).toHaveAttribute('aria-pressed', 'false');
  await expect(speaker).toHaveAccessibleName('자동읽기 꺼짐 (눌러서 켜기)');
  await expectBorder(speaker, false);

  await expect(smartGuide).toBeVisible();
  await expect(smartGuide).toHaveAttribute('aria-pressed', 'true');
  await expect(smartGuide).toHaveAccessibleName('스마트 가이드 켜짐 · 설정 열기');
  await expectBorder(smartGuide, true);

  await expect(search).toBeVisible();
  await expect(search).toHaveAttribute('aria-expanded', 'false');
  await expect(search).toHaveAttribute('aria-controls', 'lucy-search-overlay');
  await expectBorder(search, false);

  // Tool drawer is inactive until opened, and bordered only for the duration of its open state.
  await toolButton.tap();
  await expect(page.locator('[data-master-table-sheet]')).toBeVisible();
  await expect(toolButton).toHaveAttribute('aria-expanded', 'true');
  await expectBorder(toolButton, true);
  if (mode === 'divination') {
    await expect(engineButton).toHaveAttribute('aria-expanded', 'false');
    await expectBorder(engineButton, false);
  }
  await page.getByRole('button', { name: '도구 창 닫기' }).tap();
  await expect(page.locator('[data-master-table-sheet]')).toHaveCount(0);
  await expect(toolButton).toHaveAttribute('aria-expanded', 'false');
  await expectBorder(toolButton, false);

  // Lucy Pro's extra pencil shares the engine sheet and tracks its open/close lifecycle.
  if (mode === 'divination') {
    await engineButton.tap();
    await expect(page.locator('[data-master-table-sheet]')).toBeVisible();
    await expect(engineButton).toHaveAttribute('aria-expanded', 'true');
    await expectBorder(engineButton, true);
    await expect(toolButton).toHaveAttribute('aria-expanded', 'true');
    await expectBorder(toolButton, true);
    await page.getByRole('button', { name: '도구 창 닫기' }).tap();
    await expect(engineButton).toHaveAttribute('aria-expanded', 'false');
    await expect(toolButton).toHaveAttribute('aria-expanded', 'false');
    await expectBorder(engineButton, false);
    await expectBorder(toolButton, false);
  }

  // Search shows an active border only while its disclosure panel is open.
  await search.tap();
  await expect(page.locator('#lucy-search-overlay')).toBeVisible();
  await expect(search).toHaveAttribute('aria-expanded', 'true');
  await expectBorder(search, true);
  await page.locator('#lucy-search-overlay').getByRole('button', { name: '닫기' }).tap();
  await expect(page.locator('#lucy-search-overlay')).toHaveCount(0);
  await expect(search).toHaveAttribute('aria-expanded', 'false');
  await expectBorder(search, false);

  // Guide button is active only while its guide dialog is open.
  await guide.tap();
  await expect(page.locator('[data-page-guide]')).toBeVisible();
  await expect(guide).toHaveAttribute('aria-expanded', 'true');
  await expectBorder(guide, true);
  await page.getByRole('button', { name: '가이드 닫기' }).tap();
  await expect(page.locator('[data-page-guide]')).toHaveCount(0);
  await expect(guide).toHaveAttribute('aria-expanded', 'false');
  await expectBorder(guide, false);

  // Smart Guide's pressed state is active even though its settings sheet is closed.
  await smartGuide.tap();
  const settings = page.locator('[data-smart-guide-settings="true"]');
  await expect(settings).toBeVisible();
  const guideSwitch = settings.getByRole('switch', { name: '스마트 가이드' });
  await guideSwitch.tap();
  await expect(guideSwitch).toHaveAttribute('aria-checked', 'false');
  await settings.getByRole('button', { name: '확인' }).tap();
  await expect(smartGuide).toHaveAttribute('aria-pressed', 'false');
  await expect(smartGuide).toHaveAccessibleName('스마트 가이드 꺼짐 · 설정 열기');
  await expectBorder(smartGuide, false);

  await smartGuide.tap();
  await expect(settings).toBeVisible();
  await settings.getByRole('switch', { name: '스마트 가이드' }).tap();
  await settings.getByRole('button', { name: '확인' }).tap();
  await expect(smartGuide).toHaveAttribute('aria-pressed', 'true');
  await expectBorder(smartGuide, true);

  // Speaker is borderless while off and gets an active border only while auto-read is on.
  await speaker.tap();
  await expect(speaker).toHaveAttribute('aria-pressed', 'true');
  await expect(speaker).toHaveAccessibleName('자동읽기 켜짐 (눌러서 끄기)');
  await speaker.evaluate(element => (element as HTMLButtonElement).blur());
  await expectBorder(speaker, true);
  await speaker.tap();
  await expect(speaker).toHaveAttribute('aria-pressed', 'false');
  await expect(speaker).toHaveAccessibleName('자동읽기 꺼짐 (눌러서 켜기)');
  await expectBorder(speaker, false);
}

test('Lucy Chat header borders only active controls and open panels', async ({ page }) => {
  await openLucyMode(page, 'chat');
  await expectLucyHeaderControls(page, 'chat');
});

test('Lucy Pro header borders only active controls and open panels', async ({ page }) => {
  await openLucyMode(page, 'divination');
  await expectLucyHeaderControls(page, 'divination');
});

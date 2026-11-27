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
      boxShadow: style.boxShadow,
      outlineStyle: style.outlineStyle,
    };
  });
}

async function expectLucyHeaderControls(page: Page) {
  const header = page.locator('#duo-lucy-viewport .lucy-chat-header');
  const guide = header.locator('[data-page-guide-button]');
  const speaker = header.locator('[data-auto-tts-toggle="true"]');
  const smartGuide = header.locator('[data-smart-guide-settings-button="true"]');
  const search = header.getByRole('button', { name: '대화 검색' });

  await expect(guide).toBeVisible();
  await expect(guide).toHaveAccessibleName(/가이드 열기/);
  await expect(speaker).toBeVisible();
  await expect(speaker).toHaveAttribute('aria-pressed', 'false');
  await expect(speaker).toHaveAccessibleName('자동읽기 꺼짐 (눌러서 켜기)');
  await expect(smartGuide).toBeVisible();
  await expect(smartGuide).toHaveAttribute('aria-pressed', 'true');
  await expect(smartGuide).toHaveAccessibleName('스마트 가이드 켜짐 · 설정 열기');

  const guideChrome = await readChrome(guide);
  expect(guideChrome.backgroundColor).toBe('rgba(0, 0, 0, 0)');
  expect(guideChrome.borderWidth).toBe('0px');
  expect(guideChrome.boxShadow).toBe('none');

  const smartGuideChrome = await readChrome(smartGuide);
  expect(smartGuideChrome.backgroundColor).toBe('rgba(0, 0, 0, 0)');
  expect(smartGuideChrome.borderWidth).toBe('0px');
  expect(smartGuideChrome.boxShadow).toBe('none');
  expect(smartGuideChrome.outlineStyle).toBe('none');
  const smartGuideClass = await smartGuide.getAttribute('class') || '';
  expect(smartGuideClass).toMatch(/border-0/);
  expect(smartGuideClass).toMatch(/bg-transparent/);
  expect(smartGuideClass).not.toMatch(/\bbg-(?:white|amber|slate)-/);

  const speakerChrome = await readChrome(speaker);
  expect(speakerChrome.backgroundColor).toBe('rgba(0, 0, 0, 0)');
  expect(speakerChrome.borderWidth).toBe('0px');
  expect(speakerChrome.boxShadow).toBe('none');

  const searchClass = await search.getAttribute('class') || '';
  expect(searchClass).toMatch(/\bbg-(?:white\/10|amber-50\/80)\b/);
  expect(searchClass).toMatch(/\bborder\b/);

  await smartGuide.tap();
  const settings = page.locator('[data-smart-guide-settings="true"]');
  await expect(settings).toBeVisible();
  const guideSwitch = settings.getByRole('switch', { name: '스마트 가이드' });
  await guideSwitch.tap();
  await expect(guideSwitch).toHaveAttribute('aria-checked', 'false');
  await expect(smartGuide).toHaveAttribute('aria-pressed', 'false');
  await expect(smartGuide).toHaveAccessibleName('스마트 가이드 꺼짐 · 설정 열기');
  const activeSmartGuideChrome = await readChrome(smartGuide);
  expect(activeSmartGuideChrome.backgroundColor).toBe('rgba(0, 0, 0, 0)');
  expect(activeSmartGuideChrome.borderWidth).toBe('0px');
  expect(activeSmartGuideChrome.outlineStyle).toBe('none');
  await settings.getByRole('button', { name: '확인' }).tap();
  await expect(settings).toHaveCount(0);

  await guide.tap();
  await expect(page.locator('[data-page-guide]')).toBeVisible();
  await page.getByRole('button', { name: '가이드 닫기' }).tap();
  await expect(page.locator('[data-page-guide]')).toHaveCount(0);

  await speaker.tap();
  await expect(speaker).toHaveAttribute('aria-pressed', 'true');
  await expect(speaker).toHaveAccessibleName('자동읽기 켜짐 (눌러서 끄기)');
  await speaker.evaluate(element => (element as HTMLButtonElement).blur());
  const activeSpeakerChrome = await readChrome(speaker);
  expect(activeSpeakerChrome.backgroundColor).toBe('rgba(0, 0, 0, 0)');
  expect(activeSpeakerChrome.borderWidth).toBe('0px');
  expect(activeSpeakerChrome.boxShadow).toBe('none');
  expect(activeSpeakerChrome.outlineStyle).toBe('none');
  await speaker.tap();
  await expect(speaker).toHaveAttribute('aria-pressed', 'false');
  await expect(speaker).toHaveAccessibleName('자동읽기 꺼짐 (눌러서 켜기)');
}

test('Lucy Chat header Smart Guide and speaker are unboxed while the book Guide and search stay unchanged', async ({ page }) => {
  await openLucyMode(page, 'chat');
  await expectLucyHeaderControls(page);
});

test('Lucy Pro header Smart Guide and speaker are unboxed while the book Guide and search stay unchanged', async ({ page }) => {
  await openLucyMode(page, 'divination');
  await expectLucyHeaderControls(page);
});

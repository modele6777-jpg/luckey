import { mkdir } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';

async function captureVisualCheck(page: Page, dialog: Locator, filename: string) {
  const directory = process.env.LUCKEY_TAROT_SCREENSHOT_DIR;
  if (!directory) return;
  await mkdir(directory, { recursive: true });
  await dialog.locator('.duo-dialog-body').evaluate((element) => { (element as HTMLElement).scrollTop = 0; });
  const viewport = page.viewportSize();
  await page.screenshot({
    path: `${directory}/${filename}.png`,
    clip: { x: 0, y: 0, width: Math.min(viewport?.width ?? 700, viewport?.width ?? 700), height: Math.min(viewport?.height ?? 450, viewport?.height ?? 450) },
  });
}

async function openTrinityTarot(page: Page, viewport = { width: 626, height: 890 }) {
  await page.setViewportSize(viewport);
  await page.addInitScript(() => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    localStorage.setItem('lu_unlocked_date', today);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
    sessionStorage.setItem('profileModalDismissed', '1');
    sessionStorage.setItem('prism_target_tab', 'tarot');
    // A synthetic fixture session only: it makes the real result-card click
    // deterministic and does not run or alter a user's Tarot calculation.
    localStorage.setItem('trinity_active_tarot_session', JSON.stringify({
      drawnCards: [{
        id: 'cups_10',
        name: 'Ten of Cups',
        nameKo: '컵 10',
        type: 'cups',
        keywords: Array.from({ length: 24 }, (_, index) => `테스트 키워드 ${index + 1}`),
        reversed: false,
        imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="9" height="15"%3E%3C/svg%3E',
      }],
      tarotResult: '브라우저 레이아웃 회귀 테스트용 가상 결과입니다.',
      tarotConcern: '브라우저 레이아웃 테스트',
      dateKey: today,
      timestamp: Date.now(),
    }));
  });

  await page.goto('/trinity?tab=tarot');
  const contentPane = page.locator('#duo-content-viewport, [data-workspace-pane="content"]').first();
  if (viewport.width >= 600) {
    await expect(page.locator('html')).toHaveClass(/duo-unfolded-portrait/);
    await expect(page.locator('#duo-content-viewport')).toBeVisible();
  } else {
    await expect(page.locator('html')).not.toHaveClass(/duo-unfolded-mode/);
    await expect(page.locator('#duo-content-viewport')).toHaveCount(0);
    await expect(page.locator('[data-workspace-pane="content"]')).toBeVisible();
  }
  await expect(contentPane.getByRole('heading', { name: '타로 리딩' })).toBeVisible();
  await expect(contentPane.getByText('컵 10', { exact: true }).last()).toBeVisible();
}

async function getGeometry(dialog: Locator) {
  return dialog.evaluate((element) => {
    const root = element as HTMLElement;
    const portal = root.parentElement as HTMLElement;
    const pane = document.getElementById('duo-content-viewport') ?? document.querySelector<HTMLElement>('[data-workspace-pane="content"]');
    const nav = document.querySelector<HTMLElement>('.sites-pinned-sidebar');
    const frame = document.querySelector<HTMLElement>('.prism-app-shell');
    const panel = root.querySelector<HTMLElement>('.duo-tarot-portrait-fill');
    const body = root.querySelector<HTMLElement>('.duo-dialog-body');
    const heading = root.querySelector<HTMLElement>('.duo-dialog-heading');
    const actions = root.querySelector<HTMLElement>('.duo-dialog-actions');
    if (!pane || !nav || !frame || !panel || !body || !heading || !actions) {
      throw new Error('Tarot popup fixture is missing its real pane, frame, navigation, panel, scroll body, heading, or footer');
    }
    const rect = (node: Element) => {
      const box = node.getBoundingClientRect();
      return { left: box.left, top: box.top, right: box.right, bottom: box.bottom, width: box.width, height: box.height };
    };
    const rootStyle = getComputedStyle(root);
    const portalStyle = getComputedStyle(portal);
    const rootRect = rect(root);
    const navRect = rect(nav);
    const overlapWidth = Math.max(0, Math.min(rootRect.right, navRect.right) - Math.max(rootRect.left, navRect.left));
    const overlapHeight = Math.max(0, Math.min(rootRect.bottom, navRect.bottom) - Math.max(rootRect.top, navRect.top));
    return {
      scope: portal.dataset.overlayScope,
      overlayPane: portal.dataset.overlayPane,
      portalIsFrame: portal.parentElement === frame,
      portalIsContentPane: portal.parentElement === pane,
      frame: rect(frame),
      pane: rect(pane),
      portal: rect(portal),
      root: rootRect,
      panel: rect(panel),
      heading: rect(heading),
      actions: rect(actions),
      padding: {
        top: Number.parseFloat(rootStyle.paddingTop) || 0,
        right: Number.parseFloat(rootStyle.paddingRight) || 0,
        bottom: Number.parseFloat(rootStyle.paddingBottom) || 0,
        left: Number.parseFloat(rootStyle.paddingLeft) || 0,
      },
      nav: navRect,
      navOverlapArea: overlapWidth * overlapHeight,
      overlayHeight: Number.parseFloat(portalStyle.getPropertyValue('--overlay-height')) || 0,
      overlayWidth: Number.parseFloat(portalStyle.getPropertyValue('--overlay-width')) || 0,
      bodyOverflowY: getComputedStyle(body).overflowY,
      bodyClientHeight: body.clientHeight,
      bodyScrollHeight: body.scrollHeight,
      bodyScrollTop: body.scrollTop,
    };
  });
}

type Rect = { left: number; top: number; right: number; bottom: number; width: number; height: number };

/**
 * The canvas a popup must fill: the app frame with the navigation rail cut from
 * whichever screen edge it sits on. Written out here so the expectation does not
 * simply reuse the production helper.
 */
function expectedCanvas(frame: Rect, nav: Rect): Rect {
  const tolerance = 2;
  const railOnRight = Math.abs(nav.right - frame.right) <= tolerance && nav.width < frame.width * 0.6;
  const railOnBottom = Math.abs(nav.bottom - frame.bottom) <= tolerance && nav.height < frame.height * 0.6;
  const railOnLeft = Math.abs(nav.left - frame.left) <= tolerance && nav.width < frame.width * 0.6;
  const railOnTop = Math.abs(nav.top - frame.top) <= tolerance && nav.height < frame.height * 0.6;
  if (railOnRight) return { ...frame, right: nav.left, width: nav.left - frame.left };
  if (railOnBottom) return { ...frame, bottom: nav.top, height: nav.top - frame.top };
  if (railOnLeft) return { ...frame, left: nav.right, width: frame.right - nav.right };
  if (railOnTop) return { ...frame, top: nav.bottom, height: frame.bottom - nav.bottom };
  return frame;
}

async function assertPopupFillsCanvas(dialog: Locator) {
  await expect(dialog).toBeVisible();
  await expect.poll(async () => (await getGeometry(dialog)).root.height).toBeGreaterThan(100);
  // Wait for the entrance transform to settle by observing actual rendered bounds,
  // not by assuming a fixed animation duration.
  await expect.poll(async () => {
    const geometry = await getGeometry(dialog);
    return Math.max(
      Math.abs(geometry.panel.top - (geometry.root.top + geometry.padding.top)),
      Math.abs(geometry.panel.bottom - (geometry.root.bottom - geometry.padding.bottom)),
    );
  }).toBeLessThanOrEqual(2);

  const before = await getGeometry(dialog);
  // Both Tarot inspection popups are plain canvas dialogs: hosted on the app
  // frame, filling the frame minus the rail, on every screen mode.
  expect(before.scope).toBe('canvas');
  expect(before.overlayPane).toBe('content');
  expect(before.portalIsFrame, 'the popup layer is hosted on the app frame, not on a pane').toBe(true);
  const canvas = expectedCanvas(before.frame, before.nav);
  for (const edge of ['left', 'top', 'right', 'bottom'] as const) {
    expect(Math.abs(before.root[edge] - canvas[edge]), `popup root ${edge} must reach the canvas edge beside the rail`).toBeLessThanOrEqual(2);
    expect(Math.abs(before.portal[edge] - canvas[edge]), `portal ${edge} must reach the canvas edge beside the rail`).toBeLessThanOrEqual(2);
  }
  expect(Math.abs(before.root.width - canvas.width), 'the popup uses the whole canvas width, never a narrower pane').toBeLessThanOrEqual(2);
  expect(Math.abs(before.overlayWidth - canvas.width), 'the overlay-width cap uses the measured canvas').toBeLessThanOrEqual(2);
  expect(Math.abs(before.overlayHeight - canvas.height), 'the overlay-height cap uses the measured canvas').toBeLessThanOrEqual(2);
  expect(before.navOverlapArea, 'the popup must never overlap the fixed navigation').toBe(0);
  expect(before.bodyOverflowY).toBe('auto');

  // The panel fills the canvas minus its safe-area gutters, on both axes.
  expect(Math.abs(before.panel.top - (before.root.top + before.padding.top))).toBeLessThanOrEqual(2);
  expect(Math.abs(before.panel.bottom - (before.root.bottom - before.padding.bottom))).toBeLessThanOrEqual(2);
  expect(Math.abs(before.panel.left - (before.root.left + before.padding.left)), 'the panel must start at the left safe gutter').toBeLessThanOrEqual(2);
  expect(Math.abs(before.panel.right - (before.root.right - before.padding.right)), 'the panel must reach the right safe gutter without leaving a blank strip').toBeLessThanOrEqual(2);
  expect(Math.abs(before.panel.width - (before.root.width - before.padding.left - before.padding.right)), 'the panel must use the full available canvas width').toBeLessThanOrEqual(2);

  const body = dialog.locator('.duo-dialog-body');
  await body.evaluate((element) => {
    const scroller = element as HTMLElement;
    scroller.scrollTop = scroller.scrollHeight;
  });
  await expect.poll(() => body.evaluate((element) => (element as HTMLElement).scrollTop)).toBeGreaterThan(0);
  const after = await getGeometry(dialog);
  for (const part of ['root', 'panel', 'heading', 'actions'] as const) {
    for (const edge of ['left', 'top', 'right', 'bottom', 'width', 'height'] as const) {
      expect(Math.abs(after[part][edge] - before[part][edge]), `${part} ${edge} must remain fixed while the body scrolls`).toBeLessThanOrEqual(1.5);
    }
  }
}

async function closeDialog(dialog: Locator) {
  await dialog.getByRole('button', { name: '닫기' }).last().click();
  await expect(dialog).toHaveCount(0);
}

async function swapPortraitPanes(page: Page) {
  await page.evaluate(() => {
    const button = document.querySelector<HTMLButtonElement>('[data-duo-divider-swap]');
    if (!button) throw new Error('Duo portrait pane-swap control is missing');
    const rect = button.getBoundingClientRect();
    const originalNow = Date.now;
    let timestamp = originalNow();
    const tap = () => button.dispatchEvent(new PointerEvent('pointerup', {
      bubbles: true,
      pointerType: 'touch',
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2,
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
  await expect(page.locator('html')).toHaveClass(/duo-panels-swapped/);
}

test('Tarot detail and deck-back popups fill the whole canvas in both pane orders', async ({ page }) => {
  await openTrinityTarot(page);
  expect(page.viewportSize()?.width, 'use the supported 626px inner portrait display instead of a desktop-like 700px canvas').toBe(626);
  const root = page.locator('html');
  await expect(root).not.toHaveClass(/duo-panels-swapped/);

  const deckBackLauncher = page.locator('#duo-content-viewport button[title*="타로 카드 뒷면 덱 커스텀"]');
  await deckBackLauncher.click();
  const deckDialog = page.getByRole('dialog', { name: '타로 덱 뒷면 커스텀 컬렉션' });
  await assertPopupFillsCanvas(deckDialog);
  await captureVisualCheck(page, deckDialog, 'tarot-deck-back-popup');
  await closeDialog(deckDialog);

  await page.locator('#duo-content-viewport').getByText('컵 10', { exact: true }).last().click();
  const detailDialog = page.getByRole('dialog', { name: '상세 보기' });
  await assertPopupFillsCanvas(detailDialog);
  await captureVisualCheck(page, detailDialog, 'tarot-card-detail-popup');
  await closeDialog(detailDialog);

  await swapPortraitPanes(page);
  const swappedContentPane = await page.locator('#duo-content-viewport').boundingBox();
  expect(swappedContentPane?.y, 'the actual Tarot content pane moves to the lower half when swapped').toBeGreaterThan(100);

  await deckBackLauncher.click();
  await assertPopupFillsCanvas(page.getByRole('dialog', { name: '타로 덱 뒷면 커스텀 컬렉션' }));
  await closeDialog(page.getByRole('dialog', { name: '타로 덱 뒷면 커스텀 컬렉션' }));

  await page.locator('#duo-content-viewport').getByText('컵 10', { exact: true }).last().click();
  const swappedDetailDialog = page.getByRole('dialog', { name: '상세 보기' });
  await assertPopupFillsCanvas(swappedDetailDialog);
  await closeDialog(swappedDetailDialog);
});

test('Tarot detail and deck-back popups fill the folded cover canvas when iOS leaves main narrow', async ({ page }) => {
  await openTrinityTarot(page, { width: 461, height: 678 });
  expect(page.viewportSize()?.width, 'match the reported iPhone cover viewport at 3x screenshot scale').toBe(461);
  const contentPane = page.locator('[data-workspace-pane="content"]');
  // The user report recorded main=309px while the shell stayed 461px and the
  // fixed rail started at 381px. Mirror that stale iOS/PWA layout pass instead
  // of testing only the healthy 381px main that Playwright initially renders.
  await page.locator('main.sites-pinned-main').evaluate((element) => {
    const main = element as HTMLElement;
    main.style.width = '309px';
    main.style.maxWidth = '309px';
  });
  await expect.poll(() => page.locator('main.sites-pinned-main').evaluate((element) => element.getBoundingClientRect().width)).toBe(309);
  await expect.poll(() => contentPane.evaluate((element) => element.getBoundingClientRect().width)).toBe(309);
  const deckBackLauncher = contentPane.locator('button[title*="타로 카드 뒷면 덱 커스텀"]');

  await deckBackLauncher.click();
  const deckDialog = page.getByRole('dialog', { name: '타로 덱 뒷면 커스텀 컬렉션' });
  await assertPopupFillsCanvas(deckDialog);
  const deck = await getGeometry(deckDialog);
  expect(deck.overlayPane).toBe('content');
  expect(deck.portalIsContentPane, 'a narrow pane no longer owns the popup layer').toBe(false);
  expect(Math.abs(deck.root.right - deck.nav.left), 'deck popup reaches the fixed rail without leaving a dark strip').toBeLessThanOrEqual(2);
  await captureVisualCheck(page, deckDialog, 'folded-tarot-deck-back-popup');
  await closeDialog(deckDialog);

  await contentPane.getByText('컵 10', { exact: true }).last().click();
  const detailDialog = page.getByRole('dialog', { name: '상세 보기' });
  await assertPopupFillsCanvas(detailDialog);
  const detail = await getGeometry(detailDialog);
  expect(detail.overlayPane).toBe('content');
  expect(Math.abs(detail.root.right - detail.nav.left), 'detail popup reaches the fixed rail without leaving a dark strip').toBeLessThanOrEqual(2);
  await captureVisualCheck(page, detailDialog, 'folded-tarot-card-detail-popup');
});

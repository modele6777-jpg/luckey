import { expect, test, type Locator, type Page } from '@playwright/test';

async function openTrinityTarot(page: Page) {
  await page.setViewportSize({ width: 700, height: 900 });
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
  await expect(page.locator('html')).toHaveClass(/duo-unfolded-portrait/);
  await expect(page.locator('#duo-content-viewport')).toBeVisible();
  await expect(page.locator('#duo-content-viewport').getByRole('heading', { name: '타로 리딩' })).toBeVisible();
  await expect(page.locator('#duo-content-viewport').getByText('컵 10', { exact: true }).last()).toBeVisible();
}

async function getGeometry(dialog: Locator) {
  return dialog.evaluate((element) => {
    const root = element as HTMLElement;
    const portal = root.parentElement as HTMLElement;
    const pane = document.querySelector<HTMLElement>('#duo-content-viewport');
    const nav = document.querySelector<HTMLElement>('.sites-pinned-sidebar');
    const panel = root.querySelector<HTMLElement>('.duo-tarot-portrait-fill');
    const body = root.querySelector<HTMLElement>('.duo-dialog-body');
    const heading = root.querySelector<HTMLElement>('.duo-dialog-heading');
    const actions = root.querySelector<HTMLElement>('.duo-dialog-actions');
    if (!pane || !nav || !panel || !body || !heading || !actions) {
      throw new Error('Tarot popup fixture is missing its real pane, navigation, panel, scroll body, heading, or footer');
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
      portalIsContentPane: portal.parentElement === pane,
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
      bodyOverflowY: getComputedStyle(body).overflowY,
      bodyClientHeight: body.clientHeight,
      bodyScrollHeight: body.scrollHeight,
      bodyScrollTop: body.scrollTop,
    };
  });
}

async function assertPopupFillsActivePane(dialog: Locator) {
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
  expect(before.scope).toBe('pane');
  expect(before.overlayPane).toBe('content');
  expect(before.portalIsContentPane).toBe(true);
  for (const edge of ['left', 'top', 'right', 'bottom', 'width', 'height'] as const) {
    expect(Math.abs(before.root[edge] - before.pane[edge]), `modal root ${edge} must match the actual active content-pane ${edge}`).toBeLessThanOrEqual(1.5);
    expect(Math.abs(before.portal[edge] - before.pane[edge]), `portal ${edge} must match the actual active content-pane ${edge}`).toBeLessThanOrEqual(1.5);
  }
  expect(Math.abs(before.overlayHeight - before.pane.height), 'the overlay-height cap must use the measured content pane, not the full canvas').toBeLessThanOrEqual(1.5);
  expect(before.navOverlapArea, 'the modal root must never overlap the fixed navigation').toBe(0);
  expect(before.bodyOverflowY).toBe('auto');

  // The modal fills the pane's usable height after safe-area/gutter padding.
  expect(Math.abs(before.panel.top - (before.root.top + before.padding.top))).toBeLessThanOrEqual(2);
  expect(Math.abs(before.panel.bottom - (before.root.bottom - before.padding.bottom))).toBeLessThanOrEqual(2);
  expect(before.panel.left).toBeGreaterThanOrEqual(before.root.left + before.padding.left - 2);
  expect(before.panel.right).toBeLessThanOrEqual(before.root.right - before.padding.right + 2);

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

test('Tarot detail and deck-back popups fill the actual portrait Duo content pane in both pane orders', async ({ page }) => {
  await openTrinityTarot(page);
  const root = page.locator('html');
  await expect(root).not.toHaveClass(/duo-panels-swapped/);

  const deckBackLauncher = page.locator('#duo-content-viewport button[title*="타로 카드 뒷면 덱 커스텀"]');
  await deckBackLauncher.click();
  const deckDialog = page.getByRole('dialog', { name: '타로 덱 뒷면 커스텀 컬렉션' });
  await assertPopupFillsActivePane(deckDialog);
  await closeDialog(deckDialog);

  await page.locator('#duo-content-viewport').getByText('컵 10', { exact: true }).last().click();
  const detailDialog = page.getByRole('dialog', { name: '상세 보기' });
  await assertPopupFillsActivePane(detailDialog);
  await closeDialog(detailDialog);

  await swapPortraitPanes(page);
  const swappedContentPane = await page.locator('#duo-content-viewport').boundingBox();
  expect(swappedContentPane?.y, 'the actual Tarot content pane moves to the lower half when swapped').toBeGreaterThan(100);

  await deckBackLauncher.click();
  await assertPopupFillsActivePane(page.getByRole('dialog', { name: '타로 덱 뒷면 커스텀 컬렉션' }));
  await closeDialog(page.getByRole('dialog', { name: '타로 덱 뒷면 커스텀 컬렉션' }));

  await page.locator('#duo-content-viewport').getByText('컵 10', { exact: true }).last().click();
  const swappedDetailDialog = page.getByRole('dialog', { name: '상세 보기' });
  await assertPopupFillsActivePane(swappedDetailDialog);
  await closeDialog(swappedDetailDialog);
});

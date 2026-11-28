/**
 * 접힌 화면(pane 없는 단독 화면) 팝업이 사이드바를 뺀 캔버스를 꽉 채우는지 검사.
 *
 * 사용자 제보 (2026-11-28, v1.8.651 이후 아이폰 실기기):
 *  - 타로 덱 뒷면(IMG_0565)·타로 카드 상세(IMG_0566) 팝업이 여전히 오른쪽에
 *    넓은 검은 여백을 두고 좁게 떴다.
 *
 * 실기기 실측: 화면 461, 레일 80 → 캔버스 381인데 `main.sites-pinned-main`이
 * 309px로 남아 있었고, 팝업 레이어는 그 `main` 상자를 그대로 따라 285px 패널이
 * 됐다. `pane === 'main'`(접힌 화면/단독 페이지)에서는 `usePaneOverlayHost`가
 * 캔버스 호스트를 아예 돌려주지 않아 v1.8.648~651의 캔버스 기준 호스팅이
 * 실행되지 않았기 때문이다.
 *
 * 기대: `pane === 'main'` + 좁은 `main` 조건에서도 팝업 레이어가 앱 프레임
 * (`.prism-app-shell`)에 붙어 `left 0 / right 80 / width auto`로 캔버스
 * 381×678을 채우고, 12px 거터를 뺀 다이얼로그 패널은 357×646이 된다.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import React, { act } from 'react';
import { Window } from 'happy-dom';

type Box = { left: number; top: number; right: number; bottom: number; width: number; height: number };
const box = (left: number, top: number, width: number, height: number): Box => ({
  left, top, right: left + width, bottom: top + height, width, height,
});

const GLOBAL_KEYS = [
  'window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'MutationObserver',
  'getComputedStyle', 'IS_REACT_ACT_ENVIRONMENT', 'ResizeObserver', 'requestAnimationFrame',
  'cancelAnimationFrame',
] as const;

// happy-dom ships its own DOM typings, so its nodes are handled as `any` here.
type AnyNode = any;

/** Folded iPhone cover: 461×678, an 80px rail on the right, and a `main` that is 72px short. */
function installFoldedScreen(mainWidth = 309) {
  const win = new Window({ url: 'https://folded-canvas.invalid/trinity' });
  const loose = win as unknown as AnyNode;
  loose.innerWidth = 461;
  loose.innerHeight = 678;
  win.document.body.innerHTML = [
    '<div class="prism-app-shell">',
    '  <main class="sites-pinned-main"></main>',
    '  <div class="sites-pinned-sidebar"></div>',
    '</div>',
  ].join('');
  const shell: AnyNode = win.document.querySelector('.prism-app-shell');
  const main: AnyNode = win.document.querySelector('main.sites-pinned-main');
  const nav: AnyNode = win.document.querySelector('.sites-pinned-sidebar');
  const stub = (element: AnyNode, rect: Box) => {
    Object.defineProperty(element, 'getBoundingClientRect', { value: () => rect, configurable: true });
    Object.defineProperty(element, 'getClientRects', { value: () => [rect], configurable: true });
  };
  stub(shell, box(0, 0, 461, 678));
  stub(main, box(0, 0, mainWidth, 678));
  stub(nav, box(381, 0, 80, 678));

  const saved = new Map(GLOBAL_KEYS.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const key of GLOBAL_KEYS) {
    const value = key === 'window' ? win
      : key === 'document' ? win.document
      : key === 'getComputedStyle' ? win.getComputedStyle.bind(win)
      : key === 'IS_REACT_ACT_ENVIRONMENT' ? true
      : loose[key];
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  }
  return {
    win, shell, main, nav,
    restore() {
      for (const [key, descriptor] of saved) {
        if (descriptor) Object.defineProperty(globalThis, key, descriptor);
        else delete (globalThis as unknown as Record<string, unknown>)[key];
      }
      win.close();
    },
  };
}

test('a dialog on the pane-less folded screen fills the canvas beside the rail', async () => {
  const screen = installFoldedScreen();
  let root: AnyNode = null;
  try {
    const [{ WorkspacePortal }, { OverlayPaneContext }, { createRoot }] = await Promise.all([
      import('../src/components/layout/DuoWorkspace.tsx'),
      import('../src/components/layout/OverlayPaneContext.ts'),
      import('react-dom/client'),
    ]);
    const host = screen.win.document.createElement('div');
    screen.win.document.body.appendChild(host);
    root = createRoot(host as AnyNode);
    // No `[data-workspace-pane]` ancestor: the folded cover screen and a standalone
    // page both report the popup's pane as `main` through this provider.
    await act(async () => {
      root.render(
        <OverlayPaneContext.Provider value="main">
          <WorkspacePortal>
            <div role="dialog" aria-modal="true" className="fixed inset-0">타로 덱 뒷면</div>
          </WorkspacePortal>
        </OverlayPaneContext.Provider>,
      );
    });
    const layer: AnyNode = screen.win.document.querySelector('[data-screen-overlay-layer]');
    assert.ok(layer, 'the dialog layer is mounted');
    assert.equal(layer.parentElement, screen.shell, 'the dialog is hosted on the app frame, not on the narrow main');
    assert.equal(layer.dataset.overlayPane, 'main');
    assert.equal(layer.dataset.railEdge, 'right', 'the rail edge is marked so the layer drops that screen inset');
    assert.equal(layer.style.left, '0px');
    assert.equal(layer.style.right, '80px', 'the rail stays outside the dialog');
    assert.equal(layer.style.top, '0px');
    assert.equal(layer.style.bottom, '0px');
    assert.equal(layer.style.width, 'auto', 'insets decide the box, never the narrow main width');
    assert.equal(layer.style.getPropertyValue('--overlay-width'), '381px', 'the canvas width, not main’s 309px');
    assert.equal(layer.style.getPropertyValue('--overlay-height'), '678px');
    // 381 − 12 − 12 = 357 wide, 678 − 12 − 12 = 646 tall for the dialog panel.
  } finally {
    if (root) await act(async () => { root.unmount(); });
    screen.restore();
  }
});

test('a pane-scoped folded dialog escapes a narrow content pane but stays beside the rail', async () => {
  const screen = installFoldedScreen(309);
  const content = screen.win.document.createElement('div');
  content.dataset.workspacePane = 'content';
  screen.main.appendChild(content);
  const contentRect = box(0, 0, 309, 678);
  Object.defineProperty(content, 'getBoundingClientRect', { value: () => contentRect, configurable: true });
  Object.defineProperty(content, 'getClientRects', { value: () => [contentRect], configurable: true });
  let root: AnyNode = null;
  try {
    const [{ WorkspacePortal }, { OverlayPaneContext }, { createRoot }] = await Promise.all([
      import('../src/components/layout/DuoWorkspace.tsx'),
      import('../src/components/layout/OverlayPaneContext.ts'),
      import('react-dom/client'),
    ]);
    const host = screen.win.document.createElement('div');
    screen.win.document.body.appendChild(host);
    root = createRoot(host as AnyNode);
    await act(async () => {
      root.render(
        <OverlayPaneContext.Provider value="content">
          <WorkspacePortal scope="pane">
            <div role="dialog" aria-modal="true" className="fixed inset-0">타로 상세</div>
          </WorkspacePortal>
        </OverlayPaneContext.Provider>,
      );
    });
    const layer: AnyNode = screen.win.document.querySelector('[data-screen-overlay-layer]');
    assert.ok(layer, 'the pane-scoped dialog layer is mounted');
    assert.equal(layer.parentElement, screen.shell, 'a folded pane-scoped dialog uses the frame instead of the narrow content pane');
    assert.equal(layer.dataset.overlayScope, 'pane', 'the pane scope remains intact for unfolded Duo styling');
    assert.equal(layer.dataset.overlayPane, 'content');
    assert.equal(layer.style.left, '0px');
    assert.equal(layer.style.right, '80px', 'the fixed rail stays outside the dialog');
    assert.equal(layer.style.width, 'auto');
    assert.equal(layer.style.getPropertyValue('--overlay-width'), '381px', 'the full 381px canvas sizes the dialog, not the 309px pane');
    assert.equal(layer.style.getPropertyValue('--overlay-height'), '678px');
  } finally {
    if (root) await act(async () => { root.unmount(); });
    screen.restore();
  }
});

test('the main overlay viewport measures the canvas, not a narrow main', async () => {
  const screen = installFoldedScreen();
  try {
    const { measureMainOverlayViewport, widerFrameRect } = await import('../src/lib/mainOverlayViewport.ts');
    assert.deepEqual(measureMainOverlayViewport('main'), { left: 0, top: 0, width: 381, height: 678 });

    const shell = box(0, 0, 461, 678);
    // A main that ends short of the frame on one side is replaced by the frame,
    // and the rail is then cut from the frame: 461 − 80 = 381.
    assert.equal(widerFrameRect(box(0, 0, 309, 678), shell), shell);
    assert.equal(widerFrameRect(box(72, 0, 309, 678), shell), shell);
    // A half-height portrait main (unfolded top pane) keeps its own box.
    const portrait = box(0, 0, 461, 339);
    assert.equal(widerFrameRect(portrait, shell), portrait);
    // No frame (standalone markup without the shell) keeps main as the canvas.
    const full = box(0, 0, 381, 678);
    assert.equal(widerFrameRect(full, undefined), full);
  } finally {
    screen.restore();
  }
});

test('a rail fixed to the screen edge is still cut from a frame iOS reported too narrow', async () => {
  const { canvasBoxFromRects } = await import('../src/components/layout/paneOverlayHost.ts');
  // The rail follows `right: 0` of the screen (381..461) while the frame reports
  // 389: the dialog keeps the 381px canvas instead of running under the rail.
  assert.deepEqual(
    canvasBoxFromRects(box(0, 0, 389, 678), box(381, 0, 80, 678)),
    { left: 0, top: 0, right: 8, bottom: 0, railEdge: 'right' },
  );
  // A frame that already ends at the rail keeps the plain cut.
  assert.deepEqual(
    canvasBoxFromRects(box(0, 0, 461, 678), box(381, 0, 80, 678)),
    { left: 0, top: 0, right: 80, bottom: 0, railEdge: 'right' },
  );
  // A rail floating inside the canvas still cuts nothing.
  assert.deepEqual(
    canvasBoxFromRects(box(0, 0, 461, 678), box(20, 20, 60, 280)),
    { left: 0, top: 0, right: 0, bottom: 0, railEdge: 'none' },
  );
});

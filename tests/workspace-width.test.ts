import assert from 'node:assert/strict';
import test from 'node:test';
import { createWorkspaceWidthStore, isWideWorkspaceWidth } from '../src/hooks/useWideWorkspace';

test('workspace threshold follows content width including zoom-sized viewports', () => {
  for (const width of [0, 360, 390, 768, 895, NaN, Infinity]) assert.equal(isWideWorkspaceWidth(width), false);
  for (const width of [896, 1024, 1440]) assert.equal(isWideWorkspaceWidth(width), true);
});

test('SSR and an unmounted workspace remain single column', () => {
  assert.equal(createWorkspaceWidthStore(null).getSnapshot(), false);
  assert.equal(createWorkspaceWidthStore(undefined).getSnapshot(), false);
  assert.doesNotThrow(createWorkspaceWidthStore(null).subscribe(() => {}));
});

test('a wide browser does not force a narrow content container into two columns', () => {
  const previousWindow = globalThis.window;
  const previousObserver = globalThis.ResizeObserver;
  let width = 935;
  let resize: (() => void) | undefined;
  let disconnected = false;
  let notifications = 0;
  const container = { get clientWidth() { return width; } } as HTMLElement;
  Object.assign(globalThis, {
    window: {
      matchMedia: () => ({ matches: true }),
      getComputedStyle: () => ({ paddingLeft: '20px', paddingRight: '20px' }),
    },
    ResizeObserver: class {
      constructor(callback: () => void) { resize = callback; }
      observe(element: HTMLElement) { assert.equal(element, container); }
      disconnect() { disconnected = true; }
    },
  });
  try {
    const store = createWorkspaceWidthStore(container);
    assert.equal(store.getSnapshot(), false);
    const unsubscribe = store.subscribe(() => { notifications++; });
    width = 936;
    resize?.();
    assert.equal(store.getSnapshot(), true);
    width = 720;
    resize?.();
    assert.equal(store.getSnapshot(), false);
    assert.equal(notifications, 2);
    unsubscribe();
    assert.equal(disconnected, true);
  } finally {
    Object.assign(globalThis, { window: previousWindow, ResizeObserver: previousObserver });
  }
});

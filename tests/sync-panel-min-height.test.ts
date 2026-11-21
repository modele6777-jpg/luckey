import assert from 'node:assert/strict';
import test from 'node:test';
import { syncPanelMinHeight } from '../src/utils/syncPanelMinHeight';

test('matches the reference panel height and follows responsive reflow', () => {
  let referenceHeight = 401.2;
  let resizeCallback: ResizeObserverCallback | null = null;
  let observedElement: Element | null = null;
  let disconnected = false;

  class MockResizeObserver {
    constructor(callback: ResizeObserverCallback) {
      resizeCallback = callback;
    }
    observe(element: Element) {
      observedElement = element;
    }
    unobserve(_element: Element) {}
    disconnect() {
      disconnected = true;
    }
  }

  const previousResizeObserver = globalThis.ResizeObserver;
  Object.defineProperty(globalThis, 'ResizeObserver', {
    configurable: true,
    writable: true,
    value: MockResizeObserver,
  });

  try {
    const target = { style: { minHeight: '' } } as unknown as HTMLElement;
    const reference = {
      getBoundingClientRect: () => ({ height: referenceHeight }) as DOMRect,
    } as unknown as HTMLElement;

    const cleanup = syncPanelMinHeight(target, reference);
    assert.equal(target.style.minHeight, '402px');
    assert.equal(observedElement, reference);

    referenceHeight = 512;
    resizeCallback?.([], {} as ResizeObserver);
    assert.equal(target.style.minHeight, '512px');

    cleanup();
    assert.equal(disconnected, true);
  } finally {
    if (previousResizeObserver) {
      Object.defineProperty(globalThis, 'ResizeObserver', {
        configurable: true,
        writable: true,
        value: previousResizeObserver,
      });
    } else {
      delete (globalThis as unknown as Record<string, unknown>).ResizeObserver;
    }
  }
});

test('does nothing when either panel is not mounted', () => {
  assert.doesNotThrow(() => syncPanelMinHeight(null, null)());
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { isTopScreenOverlay } from '../src/components/layout/ScreenPortal';

test('keyboard handling follows visible overlay priority rather than JSX order', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const getBoundingClientRect = () => ({ left: 0, top: 0, right: 100, bottom: 100, width: 100, height: 100, x: 0, y: 0, toJSON: () => ({}) });
  const earlierInJsx = { childElementCount: 1, style: { zIndex: '10003' }, getBoundingClientRect };
  const laterInJsx = { childElementCount: 1, style: { zIndex: '10002' }, getBoundingClientRect };
  const closedOverlay = { childElementCount: 0, style: { zIndex: '10004' }, getBoundingClientRect };
  const layers = [earlierInJsx, laterInJsx, closedOverlay];
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: { querySelectorAll: () => layers },
  });
  try {
    assert.equal(isTopScreenOverlay(earlierInJsx as unknown as HTMLElement), true);
    assert.equal(isTopScreenOverlay(laterInJsx as unknown as HTMLElement), false);
    earlierInJsx.childElementCount = 0;
    assert.equal(isTopScreenOverlay(laterInJsx as unknown as HTMLElement), true);
    laterInJsx.childElementCount = 0;
    assert.equal(isTopScreenOverlay(closedOverlay as unknown as HTMLElement), false);
  } finally {
    if (original) Object.defineProperty(globalThis, 'document', original);
    else Reflect.deleteProperty(globalThis, 'document');
  }
});

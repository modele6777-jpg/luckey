import assert from 'node:assert/strict';
import test from 'node:test';
import { Window } from 'happy-dom';
import { installIosViewportRecovery, isViewportCollapsed } from '../src/lib/iosViewportRecovery.ts';

const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';
const VIEWPORT = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';

function iphoneWindow(height: number) {
  const win = new Window({ url: 'https://fold.invalid', width: 951, height });
  Object.defineProperty(win.navigator, 'userAgent', { value: IPHONE, configurable: true });
  const meta = win.document.createElement('meta');
  meta.setAttribute('name', 'viewport');
  meta.setAttribute('content', VIEWPORT);
  win.document.head.appendChild(meta);
  const writes: string[] = [];
  const set = meta.setAttribute.bind(meta);
  meta.setAttribute = (name: string, value: string) => { if (name === 'content') writes.push(value); set(name, value); };
  Object.defineProperty(win, 'innerHeight', { value: height, configurable: true });
  return { win, meta, writes };
}

test('a zero-height iOS viewport is nudged to rebuild, then restored', async () => {
  const { win, meta, writes } = iphoneWindow(0);
  assert.equal(isViewportCollapsed(win as unknown as globalThis.Window), true);
  const stop = installIosViewportRecovery(win as unknown as globalThis.Window);
  await new Promise(resolve => setTimeout(resolve, 80));
  assert.ok(writes.some(value => /initial-scale=1\.0001|initial-scale=0\.9999/.test(value)), 'viewport meta re-applied with a changed scale');
  assert.equal(meta.getAttribute('content'), VIEWPORT, 'original viewport restored on the next frame');
  stop();
  await win.happyDOM.close();
});

test('a healthy viewport is never touched', async () => {
  const { win, writes } = iphoneWindow(669);
  assert.equal(isViewportCollapsed(win as unknown as globalThis.Window), false);
  const stop = installIosViewportRecovery(win as unknown as globalThis.Window);
  win.dispatchEvent(new win.Event('orientationchange'));
  await new Promise(resolve => setTimeout(resolve, 400));
  assert.equal(writes.length, 0);
  stop();
  await win.happyDOM.close();
});

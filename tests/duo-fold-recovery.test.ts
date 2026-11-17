import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { isDuoUnfoldedState, subscribeDuoLayout } from '../src/lib/perfMode.ts';

test('both panes recover when fold dimensions arrive after orientation, and subscriptions clean up', async () => {
  const oldWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const oldDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const frames = new Map<number, FrameRequestCallback>(); let nextFrame = 1;
  const win = Object.assign(new EventTarget(), {
    innerWidth: 390, innerHeight: 844,
    screen: { width: 390, height: 844, orientation: new EventTarget() },
    visualViewport: new EventTarget(),
    matchMedia: () => Object.assign(new EventTarget(), { matches: false }),
    requestAnimationFrame: (cb: FrameRequestCallback) => { const id = nextFrame++; frames.set(id, cb); return id; },
    cancelAnimationFrame: (id: number) => frames.delete(id),
  });
  const doc = Object.assign(new EventTarget(), { activeElement: null, documentElement: { classList: { contains: () => false } }, body: { classList: { contains: () => false } } });
  Object.assign(win, { document: doc });
  let stopA = () => {}; let stopB = () => {};
  try {
    Object.defineProperty(globalThis, 'window', { value: win, configurable: true });
    Object.defineProperty(globalThis, 'document', { value: doc, configurable: true });
    const a: boolean[] = [isDuoUnfoldedState().unfolded], b: boolean[] = [isDuoUnfoldedState().unfolded];
    const settle = async () => { await new Promise(resolve => setTimeout(resolve, 100)); const pending = [...frames.values()]; frames.clear(); pending.forEach(cb => cb(0)); };
    stopA = subscribeDuoLayout(() => a.push(isDuoUnfoldedState().unfolded));
    stopB = subscribeDuoLayout(() => b.push(isDuoUnfoldedState().unfolded));
    win.dispatchEvent(new Event('orientationchange'));
    assert.equal(a.at(-1), false);
    win.innerWidth = 900; win.innerHeight = 760; win.screen.width = 900; win.screen.height = 760;
    await settle();
    assert.equal(a.at(-1), true); assert.equal(b.at(-1), true);
    win.innerWidth = 390; win.innerHeight = 844; win.screen.width = 390; win.screen.height = 844;
    win.dispatchEvent(new Event('resize'));
    assert.equal(isDuoUnfoldedState().unfolded, true, 'all consumers retain one decision during the fold burst');
    await settle(); assert.equal(a.at(-1), false);
    win.innerWidth = 900; win.innerHeight = 760; win.screen.width = 900; win.screen.height = 760;
    win.dispatchEvent(new Event('pageshow')); await settle(); assert.equal(a.at(-1), true); assert.equal(b.at(-1), true);
    stopA(); stopB(); const counts = [a.length, b.length];
    assert.equal(frames.size, 0);
    win.dispatchEvent(new Event('resize'));
    await new Promise(resolve => setTimeout(resolve, 380));
    assert.deepEqual([a.length, b.length], counts);
  } finally {
    stopA(); stopB();
    if (oldWindow) Object.defineProperty(globalThis, 'window', oldWindow); else delete (globalThis as any).window;
    if (oldDocument) Object.defineProperty(globalThis, 'document', oldDocument); else delete (globalThis as any).document;
  }
});
test('Lucy layout subscription has no nested tier setters or DOM-id gate', () => {
  const source = readFileSync(new URL('../src/pages/LucyStandalonePage.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /setIsDuoUnfolded\(\(prev\)/);
  assert.doesNotMatch(source, /document\.getElementById\('duo-lucy-viewport'\) && document\.getElementById\('duo-content-viewport'\)/);
  assert.match(source, /return subscribeDuoLayout\(syncLayout\)/);
});

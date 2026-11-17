import assert from 'node:assert/strict';
import test from 'node:test';
import React, { act, useState } from 'react';
import { Window } from 'happy-dom';
import { hasOpenScreenOverlay } from '../src/components/layout/ScreenPortal.tsx';
import { measureMainOverlayViewport } from '../src/lib/mainOverlayViewport.ts';
import { DialogBackdrop } from '../src/components/layout/DialogBackdrop.tsx';
import { RetainedPane } from '../src/components/layout/RetainedPane.tsx';

test('zero-width popup ownership and touch-only interactions survive a fold', async () => {
  const win = new Window({ url: 'https://fold-test.invalid' });
  const names = ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle', 'IS_REACT_ACT_ENVIRONMENT'];
  const saved = new Map(names.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const key of names) {
    const value = key === 'window' ? win : key === 'document' ? win.document : key === 'getComputedStyle' ? win.getComputedStyle.bind(win) : key === 'IS_REACT_ACT_ENVIRONMENT' ? true : (win as any)[key];
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  }
  let root: any;
  try {
    // In Happy DOM bounds are zero: this reproduces the transition frame.
    const occupied = win.document.createElement('div'); occupied.dataset.screenOverlayLayer = '';
    occupied.appendChild(win.document.createElement('div')); win.document.body.appendChild(occupied);
    assert.equal(occupied.getBoundingClientRect().width, 0);
    assert.equal(hasOpenScreenOverlay(), true, 'zero bounds must not permit fold-driven navigation');
    occupied.replaceChildren(); assert.equal(hasOpenScreenOverlay(), false);
    const host = win.document.createElement('div'); win.document.body.appendChild(host);
    const { createRoot } = await import('react-dom/client'); root = createRoot(host as any);
    let dismissed = 0; let bump: (() => void) | undefined;
    function Child() { const [count, setCount] = useState(0); bump = () => setCount(n => n + 1); return <DialogBackdrop onDismiss={() => dismissed++}><button onClick={() => setCount(n => n + 1)}>{count}</button></DialogBackdrop>; }
    const render = (active: boolean) => <RetainedPane active={active}><Child /></RetainedPane>;
    await act(async () => root.render(render(true)));
    const button = host.querySelector('button')!;
    await act(async () => { button.dispatchEvent(new win.MouseEvent('click', { bubbles: true, detail: 1 })); });
    assert.equal(button.textContent, '0', 'opening compatibility click remains blocked');
    await act(async () => { button.dispatchEvent(new win.Event('touchstart', { bubbles: true })); button.dispatchEvent(new win.MouseEvent('click', { bubbles: true, detail: 1 })); });
    assert.equal(button.textContent, '1', 'fresh touch-only gesture works without a pointerdown');
    await act(async () => root.render(render(false)));
    await act(async () => root.render(render(true)));
    assert.equal(host.querySelector('button'), button); assert.equal(button.textContent, '1');
    const backdrop = button.parentElement!;
    await act(async () => { backdrop.dispatchEvent(new win.Event('touchstart', { bubbles: true })); win.dispatchEvent(new win.Event('resize')); backdrop.dispatchEvent(new win.MouseEvent('click', { bubbles: true, detail: 1 })); });
    assert.equal(dismissed, 0, 'pre-fold gesture must not dismiss a retained dialog');
    await act(async () => { backdrop.dispatchEvent(new win.Event('touchstart', { bubbles: true })); backdrop.dispatchEvent(new win.MouseEvent('click', { bubbles: true, detail: 1 })); });
    assert.equal(dismissed, 1);
  } finally {
    if (root) await act(async () => root.unmount());
    await win.happyDOM.close();
    for (const [key, descriptor] of saved) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete (globalThis as any)[key]; }
  }
});

test('hidden-pane overlay viewport marks itself hidden instead of covering the visible pane', async () => {
  const win = new Window({ url: 'https://fold-test.invalid' });
  const names = ['window', 'document', 'getComputedStyle'];
  const saved = new Map(names.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const key of names) {
    const value = key === 'window' ? win : key === 'document' ? win.document : win.getComputedStyle.bind(win);
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  }
  try {
    const contentPane = win.document.createElement('div');
    contentPane.id = 'duo-content-viewport';
    contentPane.style.display = 'none';
    win.document.body.appendChild(contentPane);
    const vp = measureMainOverlayViewport('content');
    assert.equal(vp.hidden, true);
    assert.equal(vp.width, 0);
    assert.equal(vp.height, 0);
  } finally {
    await win.happyDOM.close();
    for (const [key, descriptor] of saved) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete (globalThis as any)[key]; }
  }
});

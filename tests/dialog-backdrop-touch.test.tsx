import assert from 'node:assert/strict';
import test from 'node:test';
import React, { act, useState } from 'react';
import { Window } from 'happy-dom';
import { DialogBackdrop } from '../src/components/layout/DialogBackdrop.tsx';

/** iOS WebKit taps inside popups: pointerdown may be missing, or arrive as pointercancel before click. */
test('popup controls respond to iOS touch sequences, but not to the opening tap', async () => {
  const win = new Window({ url: 'https://dialog-touch.invalid' });
  const names = ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle', 'IS_REACT_ACT_ENVIRONMENT'];
  const saved = new Map(names.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const key of names) {
    const value = key === 'window' ? win : key === 'document' ? win.document : key === 'getComputedStyle' ? win.getComputedStyle.bind(win) : key === 'IS_REACT_ACT_ENVIRONMENT' ? true : (win as any)[key];
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  }
  let root: any;
  try {
    const host = win.document.createElement('div'); win.document.body.appendChild(host);
    const { createRoot } = await import('react-dom/client'); root = createRoot(host as any);
    let dismissed = 0;
    function Child() { const [count, setCount] = useState(0); return <DialogBackdrop onDismiss={() => dismissed++}><button onClick={() => setCount(n => n + 1)}>{count}</button></DialogBackdrop>; }
    await act(async () => root.render(<Child />));
    const button = host.querySelector('button')!;
    const fire = (type: string) => button.dispatchEvent(type === 'click' ? new win.MouseEvent('click', { bubbles: true, detail: 1 }) : new win.Event(type, { bubbles: true }));

    await act(async () => { fire('click'); });
    assert.equal(button.textContent, '0', 'the opening tap retargeted into the new popup stays blocked');

    await act(async () => { fire('touchstart'); fire('touchend'); fire('click'); });
    assert.equal(button.textContent, '1', 'touch-only tap without pointerdown activates the control');

    await act(async () => { fire('pointerdown'); fire('touchstart'); fire('pointercancel'); fire('touchend'); fire('click'); });
    assert.equal(button.textContent, '2', 'stationary tap delivered as pointercancel then click activates the control');

    const backdrop = button.parentElement!;
    await act(async () => { backdrop.dispatchEvent(new win.Event('touchstart', { bubbles: true })); win.dispatchEvent(new win.Event('resize')); backdrop.dispatchEvent(new win.MouseEvent('click', { bubbles: true, detail: 1 })); });
    assert.equal(dismissed, 0, 'a gesture that began before a fold must not dismiss the popup');
    await act(async () => { backdrop.dispatchEvent(new win.Event('touchstart', { bubbles: true })); backdrop.dispatchEvent(new win.MouseEvent('click', { bubbles: true, detail: 1 })); });
    assert.equal(dismissed, 1, 'a fresh backdrop tap dismisses');
  } finally {
    if (root) await act(async () => root.unmount());
    for (const [key, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete (globalThis as any)[key];
    }
    await win.happyDOM.close();
  }
});

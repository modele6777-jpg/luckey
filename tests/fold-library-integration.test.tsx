import { safeSessionStorage } from '../src/utils/safeStorage';
import assert from 'node:assert/strict';
import test from 'node:test';
import React, { act, useEffect, useRef, useState } from 'react';
import { Window } from 'happy-dom';
import { createRoot } from 'react-dom/client';
import { isDuoUnfoldedState, subscribeDuoLayout } from '../src/lib/perfMode';
import { getOpenScreenOverlayPane } from '../src/components/layout/ScreenPortal';
import { RetainedPane } from '../src/components/layout/RetainedPane';
import { OverlayPaneContext } from '../src/components/layout/OverlayPaneContext';
import { LucyEngineCatalogDialog } from '../src/components/chat/LucyEngineCatalogDialog';
import { PromptLibraryModal } from '../src/components/chat/PromptLibraryModal';

for (const kind of ['engine', 'prompt'] as const) test(`${kind} real dialog stays mounted, visible and closable through six fold/unfold cycles`, async () => {
  const win = new Window({ url: 'https://fold-check.invalid', width: 951, height: 537 });
  const names = ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'MutationObserver', 'ResizeObserver', 'getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame', 'IS_REACT_ACT_ENVIRONMENT'];
  const saved = new Map(names.map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  for (const name of names) {
    let value = name === 'window' ? win : name === 'document' ? win.document : name === 'IS_REACT_ACT_ENVIRONMENT' ? true : (win as any)[name];
    if (['getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame'].includes(name)) value = value.bind(win);
    Object.defineProperty(globalThis, name, { configurable: true, value });
  }
  safeSessionStorage.setItem(`prism:library-session:v1:integration-${kind}:query`, JSON.stringify('사주'));
  const host = win.document.createElement('div'); win.document.body.append(host);
  const root = createRoot(host as any);
  let renders = 0;
  function Harness() {
    const [unfolded, setUnfolded] = useState(() => isDuoUnfoldedState().unfolded);
    const [open, setOpen] = useState(true);
    const [owner, setOwner] = useState<'content' | 'lucy'>('content');
    const previous = useRef(unfolded);
    renders++;
    useEffect(() => subscribeDuoLayout(() => {
      const next = isDuoUnfoldedState().unfolded;
      if (previous.current && !next) setOwner(getOpenScreenOverlayPane() || 'content');
      previous.current = next; setUnfolded(next);
    }), []);
    return <main className="sites-pinned-main">
      <div data-workspace-pane="content" style={{ display: unfolded || owner === 'content' ? 'flex' : 'none' }}>content</div>
      <div data-workspace-pane="lucy" style={{ display: unfolded || owner === 'lucy' ? 'flex' : 'none' }}>
        <OverlayPaneContext.Provider value="lucy"><RetainedPane active={unfolded || owner === 'lucy'}>
          {kind === 'engine' ? <LucyEngineCatalogDialog sessionKey="integration-engine" isOpen={open} onClose={() => setOpen(false)} isLight />
          : <PromptLibraryModal sessionKey="integration-prompt" isOpen={open} onClose={() => setOpen(false)} onSelectPrompt={() => {}} />}
        </RetainedPane></OverlayPaneContext.Provider>
      </div>
    </main>;
  }
  const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  try {
    await act(async () => { root.render(<Harness />); await pause(30); });
    await act(async () => { await pause(500); });
    const dialog = win.document.querySelector('[role="dialog"]')!;
    assert.ok(dialog, 'actual library is open');
    const input = dialog.querySelector('input')!;
    assert.equal(input.value, '사주', 'saved search filter is restored');
    const scroller = dialog.querySelector('[data-app-scroll-root]')! as unknown as HTMLElement;
    scroller.scrollTop = 137;
    for (let cycle = 0; cycle < 6; cycle++) {
      for (const [width, height] of [[461, 678], [951, 537]]) {
        await act(async () => {
          win.happyDOM.setWindowSize({ width, height });
          win.dispatchEvent(new win.Event('resize'));
          await pause(130);
        });
        await act(async () => { await pause(30); });
        assert.equal(win.document.querySelector('[role="dialog"]'), dialog, 'same modal DOM survives');
        assert.equal(dialog.querySelector('input'), input, 'same search input survives');
        assert.equal(input.value, '사주', 'search filter survives folding');
        assert.notEqual((dialog.closest('[data-screen-overlay-layer]') as unknown as HTMLElement).style.display, 'none');
        assert.equal(scroller.scrollTop, 137, 'list reading position survives');
        assert.equal((win.document.querySelector('[data-workspace-pane="lucy"]') as unknown as HTMLElement).style.display, 'flex');
      }
    }
    assert.ok(renders < 40, `bounded layout renders: ${renders}`);
    const close = Array.from(dialog.querySelectorAll('button')).find(b => /닫기/.test(b.getAttribute('aria-label') || ''))!;
    await act(async () => {
      close.dispatchEvent(new win.Event('touchstart', { bubbles: true }));
      close.dispatchEvent(new win.MouseEvent('click', { bubbles: true, detail: 1 }));
      await pause(100);
    });
    await act(async () => { await pause(250); });
    assert.equal(win.document.querySelector('[role="dialog"]'), null, 'touch close still responds after folding');
  } finally {
    await act(async () => root.unmount()); await win.happyDOM.close();
    for (const [name, descriptor] of saved) { if (descriptor) Object.defineProperty(globalThis, name, descriptor); else Reflect.deleteProperty(globalThis, name); }
  }
});

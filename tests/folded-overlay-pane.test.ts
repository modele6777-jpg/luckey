import assert from 'node:assert/strict';
import test from 'node:test';
import { Window } from 'happy-dom';
import { getLastOverlayPane, rememberOverlayPane } from '../src/lib/overlayPane.ts';

/** Folded panes have no `#duo-*-viewport` id; popups must still follow the screen on show. */
test('folded popups belong to the visible pane, not a stale hidden one', () => {
  const win = new Window({ url: 'https://fold-test.invalid' });
  const names = ['window', 'document', 'Element', 'HTMLElement'];
  const saved = new Map(names.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const key of names) {
    const value = key === 'window' ? win : key === 'document' ? win.document : (win as any)[key];
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  }
  try {
    const doc = win.document;
    const pane = (name: 'content' | 'lucy') => {
      const element = doc.createElement('div');
      element.dataset.workspacePane = name;
      element.appendChild(doc.createElement('button'));
      doc.body.appendChild(element);
      return element;
    };
    const content = pane('content');
    const lucy = pane('lucy');
    const show = (element: any, visible: boolean) => {
      element.getClientRects = () => (visible ? [{}] : []);
      element.getBoundingClientRect = () => ({ left: 0, top: 0, right: visible ? 320 : 0, bottom: visible ? 700 : 0, width: visible ? 320 : 0, height: visible ? 700 : 0 });
    };

    // Folded on Lucy: a tap inside the folded Lucy pane is remembered without ids.
    show(content, false); show(lucy, true);
    rememberOverlayPane(lucy.firstElementChild as unknown as EventTarget);
    assert.equal(getLastOverlayPane(), 'lucy');

    // Folded on content: the remembered Lucy pane is hidden, so an event-opened
    // popup must use the content screen on show instead of mounting invisibly.
    show(content, true); show(lucy, false);
    assert.equal(getLastOverlayPane(), 'content');
    rememberOverlayPane(content.firstElementChild as unknown as EventTarget);
    assert.equal(getLastOverlayPane(), 'content');

    // Unfolded: both panes visible, the remembered source wins.
    show(lucy, true);
    rememberOverlayPane(lucy.firstElementChild as unknown as EventTarget);
    assert.equal(getLastOverlayPane(), 'lucy');
  } finally {
    for (const [key, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete (globalThis as any)[key];
    }
    win.close();
  }
});

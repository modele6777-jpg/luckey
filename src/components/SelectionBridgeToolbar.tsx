import { useEffect } from 'react';
import { savePendingSelection, clearPendingSelection, getLiveSelectedText } from '../lib/selectionBridge';

interface SelectionBridgeToolbarProps { currentPath?: string }

/** App-wide selection capture, including same-origin embedded pages and popups. */
export default function SelectionBridgeToolbar(_props: SelectionBridgeToolbarProps) {
  useEffect(() => {
    const documents = new Map<Document, () => void>();
    let timer: ReturnType<typeof setTimeout> | null = null;
    const busy = () => sessionStorage.getItem('bigbang_pressing') === 'true' ||
      Date.now() - Number(sessionStorage.getItem('bigbang_recent_tap') || '0') < 450;
    const capture = (doc: Document) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (busy()) return;
        const text = getLiveSelectedText(doc) || getLiveSelectedText(document);
        if (text) savePendingSelection(text, undefined, window.location.pathname);
        else clearPendingSelection();
      }, 60);
    };
    const bind = (doc: Document) => {
      if (documents.has(doc)) return;
      const selection = () => capture(doc);
      const pointer = (event: Event) => {
        const target = event.target as Element | null;
        if (target?.closest?.('#bigbang-omnibutton, [data-bigbang], [data-no-clear-selection]') || busy()) return;
        capture(doc);
      };
      const key = (event: KeyboardEvent) => {
        if (event.key === 'Escape') clearPendingSelection();
      };
      const bindFrame = (frame: HTMLIFrameElement) => {
        try { if (frame.contentDocument) bind(frame.contentDocument); } catch { /* External embed. */ }
      };
      const loaded = (event: Event) => {
        const target = event.target as Element | null;
        if (target?.tagName === 'IFRAME') bindFrame(target as HTMLIFrameElement);
      };
      const observer = new MutationObserver(records => {
        for (const record of records) for (const node of record.addedNodes) {
          if (node.nodeType !== 1) continue;
          const element = node as Element;
          if (element.tagName === 'IFRAME') bindFrame(element as HTMLIFrameElement);
          element.querySelectorAll('iframe').forEach(bindFrame);
        }
      });
      documents.set(doc, () => {
        observer.disconnect();
        for (const name of ['selectionchange', 'select', 'mouseup', 'touchend', 'keyup']) doc.removeEventListener(name, selection, true);
        doc.removeEventListener('pointerdown', pointer, true);
        doc.removeEventListener('keydown', key);
        doc.removeEventListener('load', loaded, true);
      });
      for (const name of ['selectionchange', 'select', 'mouseup', 'touchend', 'keyup']) doc.addEventListener(name, selection, { capture: true, passive: true });
      doc.addEventListener('pointerdown', pointer, { capture: true, passive: true });
      doc.addEventListener('keydown', key);
      doc.addEventListener('load', loaded, true);
      observer.observe(doc, { childList: true, subtree: true });
      doc.querySelectorAll('iframe').forEach(bindFrame);
    };
    bind(document);
    return () => {
      if (timer) clearTimeout(timer);
      documents.forEach(cleanup => cleanup());
    };
  }, []);
  return null;
}

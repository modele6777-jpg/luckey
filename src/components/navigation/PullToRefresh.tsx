import { useEffect, useRef, useState } from 'react';
import { RotateCw } from 'lucide-react';

const THRESHOLD = 92;

export function PullToRefresh({ onRefresh, refreshing }: { onRefresh: () => Promise<void>; refreshing: boolean }) {
  const [distance, setDistance] = useState(0);
  const refreshRef = useRef(onRefresh);
  const busyRef = useRef(refreshing);
  refreshRef.current = onRefresh;
  busyRef.current = refreshing;

  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const documents = new Set<Document>();
    const frames = new Set<HTMLIFrameElement>();
    const bind = (doc: Document) => {
      if (documents.has(doc)) return;
      documents.add(doc);
      let start: { x: number; y: number; distance: number } | null = null;
      const reset = () => { start = null; setDistance(0); };
      const begin = (event: TouchEvent) => {
        if (busyRef.current || event.touches.length !== 1) { reset(); return; }
        const target = event.target as Element | null;
        if (!target?.closest || target.closest('input, textarea, select, [contenteditable="true"], [role="dialog"], nav, aside, button, a')) return;
        for (let el: Element | null = target; el; el = el.parentElement) {
          if (el.scrollTop > 1) return;
        }
        if ((doc.scrollingElement?.scrollTop || 0) > 1) return;
        start = { x: event.touches[0].clientX, y: event.touches[0].clientY, distance: 0 };
      };
      const move = (event: TouchEvent) => {
        if (!start) return;
        if (event.touches.length !== 1) { reset(); return; }
        const dy = event.touches[0].clientY - start.y;
        const dx = Math.abs(event.touches[0].clientX - start.x);
        if (dy < 0 || dx > Math.max(18, dy)) { reset(); return; }
        if (dy < 12) return;
        if (!event.cancelable) { reset(); return; }
        event.preventDefault();
        start.distance = Math.min(124, dy * 0.55);
        setDistance(start.distance);
      };
      const end = () => {
        const ready = start && start.distance >= THRESHOLD;
        reset();
        if (ready && !busyRef.current) { busyRef.current = true; void refreshRef.current(); }
      };
      doc.addEventListener('touchstart', begin, { passive: true });
      doc.addEventListener('touchmove', move, { passive: false });
      doc.addEventListener('touchend', end);
      doc.addEventListener('touchcancel', reset);
      cleanups.push(() => {
        doc.removeEventListener('touchstart', begin);
        doc.removeEventListener('touchmove', move);
        doc.removeEventListener('touchend', end);
        doc.removeEventListener('touchcancel', reset);
      });
    };
    const scan = () => {
      document.querySelectorAll('iframe').forEach(frame => {
        const attach = () => { try { if (frame.contentDocument) bind(frame.contentDocument); } catch { /* External embeds keep native scrolling. */ } };
        if (!frames.has(frame)) {
          frames.add(frame);
          frame.addEventListener('load', attach);
          cleanups.push(() => frame.removeEventListener('load', attach));
        }
        attach();
      });
    };
    bind(document);
    scan();
    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => { observer.disconnect(); cleanups.forEach(cleanup => cleanup()); };
  }, []);

  if (!refreshing && distance === 0) return null;
  return <div className="pull-refresh-indicator" role="status" aria-live="polite"
    aria-label={refreshing ? '동기화 및 업데이트 중' : distance >= THRESHOLD ? '놓으면 새로고침' : '당겨서 새로고침'}
    style={{ transform: `translate(-50%, ${refreshing ? 18 : distance * 0.35}px)`, opacity: refreshing ? 1 : Math.min(1, distance / 40) }}>
    <RotateCw size={22} className={refreshing ? 'animate-spin' : undefined} style={refreshing ? undefined : { transform: `rotate(${distance * 4}deg)` }} />
  </div>;
}

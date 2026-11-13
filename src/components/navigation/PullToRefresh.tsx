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

    const getScrollTop = (doc: Document) => {
      try {
        return Math.max(
          doc.scrollingElement?.scrollTop || 0,
          doc.documentElement?.scrollTop || 0,
          doc.body?.scrollTop || 0,
          doc.defaultView?.scrollY || 0,
          doc.defaultView?.pageYOffset || 0
        );
      } catch {
        return 0;
      }
    };

    const bind = (doc: Document) => {
      if (documents.has(doc)) return;
      documents.add(doc);
      let start: { x: number; y: number; distance: number } | null = null;
      const reset = () => { start = null; setDistance(0); };

      const begin = (event: TouchEvent) => {
        if (busyRef.current || event.touches.length !== 1) { reset(); return; }
        const target = event.target as Element | null;
        if (!target?.closest) return;
        // Exclude inputs, modals, and sidebar navigation, but allow top navs and general canvas
        if (target.closest('input, textarea, select, [contenteditable="true"], [role="dialog"], #main-sidebar-navigation, aside, button, a')) return;
        for (let el: Element | null = target; el && el !== doc.body && el !== doc.documentElement; el = el.parentElement) {
          if (el.scrollTop > 1) return;
        }
        if (getScrollTop(doc) > 1) return;
        start = { x: event.touches[0].clientX, y: event.touches[0].clientY, distance: 0 };
      };

      const move = (event: TouchEvent) => {
        if (!start) return;
        if (event.touches.length !== 1) { reset(); return; }
        const dy = event.touches[0].clientY - start.y;
        const dx = Math.abs(event.touches[0].clientX - start.x);
        if (dy < 0 || dx > Math.max(18, dy)) { reset(); return; }
        if (dy < 12) return;
        if (event.cancelable) {
          event.preventDefault();
        }
        start.distance = Math.min(124, dy * 0.55);
        setDistance(start.distance);
      };

      const end = () => {
        const ready = start && start.distance >= THRESHOLD;
        reset();
        if (ready && !busyRef.current) {
          busyRef.current = true;
          void refreshRef.current();
        }
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

    // 🌟 Iframe PostMessage 브릿지 리스너 (Key 채널 등 iframe 내부에서 발생하는 상단 당김을 부모 새로고침과 100% 동기화)
    const handleBridgeMessage = (e: MessageEvent) => {
      if (!e.data) return;
      if (e.data.type === 'PRISM_PTR_MOVE') {
        const d = typeof e.data.distance === 'number' ? e.data.distance : 0;
        setDistance(d);
      } else if (e.data.type === 'PRISM_PTR_TRIGGER') {
        setDistance(0);
        if (!busyRef.current) {
          busyRef.current = true;
          void refreshRef.current();
        }
      } else if (e.data.type === 'PRISM_PTR_RESET') {
        setDistance(0);
      }
    };
    window.addEventListener('message', handleBridgeMessage);
    cleanups.push(() => window.removeEventListener('message', handleBridgeMessage));

    const isSameOriginFrame = (frame: HTMLIFrameElement) => {
      const src = frame.getAttribute('src')?.trim();
      if (!src || src.startsWith('about:blank') || src.startsWith('about:srcdoc')) return true;
      try {
        return new URL(src, window.location.href).origin === window.location.origin;
      } catch {
        return false;
      }
    };

    const scan = () => {
      document.querySelectorAll('iframe').forEach(frame => {
        const attach = () => {
          if (!isSameOriginFrame(frame)) return;
          try {
            const frameDocument = frame.contentDocument;
            if (frameDocument) bind(frameDocument);
          } catch { /* External embeds keep native scrolling. */ }
        };
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
    const scanTimer = setInterval(scan, 800);
    cleanups.push(() => clearInterval(scanTimer));

    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });
    cleanups.push(() => observer.disconnect());

    return () => {
      cleanups.forEach(cleanup => cleanup());
    };
  }, []);

  if (!refreshing && distance === 0) return null;
  return <div className="pull-refresh-indicator" role="status" aria-live="polite"
    aria-label={refreshing ? '동기화 및 업데이트 중' : distance >= THRESHOLD ? '놓으면 새로고침' : '당겨서 새로고침'}
    style={{ transform: `translate(-50%, ${refreshing ? 18 : distance * 0.35}px)`, opacity: refreshing ? 1 : Math.min(1, distance / 40) }}>
    <RotateCw size={22} className={refreshing ? 'animate-spin' : undefined} style={refreshing ? undefined : { transform: `rotate(${distance * 4}deg)` }} />
  </div>;
}

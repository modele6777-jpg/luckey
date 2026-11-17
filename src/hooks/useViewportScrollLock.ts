import { markFoldRuntime } from '@/lib/foldRuntimeTrace';
import { useEffect } from 'react';
import { syncVisualViewportBox } from '@/lib/visualViewportBox';

/** Coalesce WebKit resize/pan events; never write layout in their dispatch stack. */
export function useViewportScrollLock() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let frame = 0;
    let stopped = false;
    let timers: ReturnType<typeof setTimeout>[] = [];
    let correctedOffset = '';
    const inputActive = () => {
      const active = document.activeElement as HTMLElement | null;
      return active?.tagName === 'INPUT' || active?.tagName === 'TEXTAREA' || Boolean(active?.isContentEditable);
    };
    const flush = () => {
      frame = 0;
      if (stopped || document.hidden) return;
      markFoldRuntime('viewport-start');
      // A fold can leave an offset WebKit cannot immediately reset. Retrying
      // the same scrollTo from every scroll event feeds that event back forever.
      const y = inputActive() ? window.scrollY : 0;
      const signature = `${window.scrollX}|${window.scrollY}|${y}`;
      if (window.scrollX === 0 && (inputActive() || window.scrollY === 0)) correctedOffset = '';
      else if (signature !== correctedOffset) {
        correctedOffset = signature;
        window.scrollTo(0, y);
      }
      syncVisualViewportBox(window);
      markFoldRuntime('viewport-end');
    };
    const schedule = () => {
      if (!stopped && !frame && !document.hidden) frame = window.requestAnimationFrame(flush);
    };
    const settle = () => {
      timers.forEach(clearTimeout);
      timers = [50, 150, 350, 800, 1200].map(delay => setTimeout(schedule, delay));
      schedule();
    };
    const resume = () => { if (!document.hidden) { correctedOffset = ''; settle(); } };
    // Only geometry/lifecycle events arm bounded retries. Scroll events queue
    // one frame and cannot continually restart the retry sequence.
    const geometryEvents = ['resize', 'orientationchange', 'pageshow', 'focus'] as const;
    geometryEvents.forEach(name => window.addEventListener(name, settle, { passive: true }));
    window.addEventListener('scroll', schedule, { passive: true });
    document.addEventListener('focusin', settle, { passive: true });
    document.addEventListener('focusout', settle, { passive: true });
    document.addEventListener('visibilitychange', resume);
    const orientation = window.screen?.orientation;
    orientation?.addEventListener('change', settle);
    const visual = window.visualViewport;
    visual?.addEventListener('resize', schedule, { passive: true });
    visual?.addEventListener('scroll', schedule, { passive: true });
    settle();
    return () => {
      stopped = true;
      window.cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
      geometryEvents.forEach(name => window.removeEventListener(name, settle));
      window.removeEventListener('scroll', schedule);
      document.removeEventListener('focusin', settle);
      document.removeEventListener('focusout', settle);
      document.removeEventListener('visibilitychange', resume);
      orientation?.removeEventListener('change', settle);
      visual?.removeEventListener('resize', schedule);
      visual?.removeEventListener('scroll', schedule);
    };
  }, []);
}

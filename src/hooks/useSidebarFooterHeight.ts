import { useEffect } from 'react';

export const SIDEBAR_FOOTER_HEIGHT = '--sidebar-footer-height';

/** The sidebar owns this measurement, so leaving chat cannot clear alignment. */
export function useSidebarFooterHeight() {
  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;
    let observed: Element | null = null;
    const measure = () => {
      const footer = document.querySelector('.lucy-chat-footer');
      if (footer !== observed) {
        resizeObserver?.disconnect();
        observed = footer;
        resizeObserver = footer && typeof ResizeObserver !== 'undefined'
          ? new ResizeObserver(measure)
          : null;
        if (footer) resizeObserver?.observe(footer);
      }
      const height = footer?.getBoundingClientRect().height;
      if (height == null || !Number.isFinite(height) || height <= 0) return;
      const value = `${Math.round(height * 100) / 100}px`;
      const style = document.documentElement.style;
      if (style.getPropertyValue(SIDEBAR_FOOTER_HEIGHT) !== value) {
        style.setProperty(SIDEBAR_FOOTER_HEIGHT, value);
      }
    };
    measure();
    const observer = new MutationObserver(measure);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', measure);
    return () => {
      resizeObserver?.disconnect();
      observer.disconnect();
      window.removeEventListener('resize', measure);
      document.documentElement.style.removeProperty(SIDEBAR_FOOTER_HEIGHT);
    };
  }, []);
}

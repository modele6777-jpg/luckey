import { useEffect } from 'react';

export const SIDEBAR_FOOTER_HEIGHT = '--sidebar-footer-height';
export const UNIFIED_MENU_FOOTER_HEIGHT = '76px';

/** The sidebar owns this measurement, so leaving chat cannot clear alignment across all channels. */
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
      const style = document.documentElement.style;
      if (height != null && Number.isFinite(height) && height > 0) {
        const value = `${Math.round(height * 100) / 100}px`;
        if (style.getPropertyValue(SIDEBAR_FOOTER_HEIGHT) !== value) {
          style.setProperty(SIDEBAR_FOOTER_HEIGHT, value);
        }
      } else if (!style.getPropertyValue(SIDEBAR_FOOTER_HEIGHT)) {
        style.setProperty(SIDEBAR_FOOTER_HEIGHT, UNIFIED_MENU_FOOTER_HEIGHT);
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
      // 채널 이동 시에도 분할선 위치가 일관되게 유지되도록 프로퍼티를 제거하지 않고 통일 높이 보존
    };
  }, []);
}

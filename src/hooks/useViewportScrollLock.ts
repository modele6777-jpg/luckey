import { useEffect } from 'react';

/**
 * 📱 모바일 사파리/PWA 뷰포트 고정 엔진:
 * 가상 키보드 등장, 입력창 포커스/블러, 스와이프 제스처 시 브라우저 최상단 window가
 * 위로 스크롤되어 하단에 거대한 빈 여백이 남고 전체 화면이 위로 밀려 올라가는 현상을 원천 방지합니다.
 */
export function useViewportScrollLock() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const lockWindowScroll = () => {
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
      if (document.documentElement.scrollTop !== 0) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body.scrollTop !== 0) {
        document.body.scrollTop = 0;
      }
    };

    const updateAppViewportHeight = () => {
      const visual = window.visualViewport;
      const h = visual ? visual.height : window.innerHeight;
      document.documentElement.style.setProperty('--app-height', `${Math.round(h)}px`);
      lockWindowScroll();
    };

    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        lockWindowScroll();
        window.requestAnimationFrame(lockWindowScroll);
        window.setTimeout(lockWindowScroll, 60);
        window.setTimeout(lockWindowScroll, 200);
      }
    };

    // 초기 높이 및 스크롤 고정
    updateAppViewportHeight();
    lockWindowScroll();

    window.addEventListener('scroll', lockWindowScroll, { passive: true });
    window.addEventListener('resize', updateAppViewportHeight, { passive: true });
    window.addEventListener('orientationchange', updateAppViewportHeight, { passive: true });
    document.addEventListener('focusout', handleFocusOut, { passive: true });

    const visual = window.visualViewport;
    if (visual) {
      visual.addEventListener('resize', updateAppViewportHeight, { passive: true });
      visual.addEventListener('scroll', lockWindowScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', lockWindowScroll);
      window.removeEventListener('resize', updateAppViewportHeight);
      window.removeEventListener('orientationchange', updateAppViewportHeight);
      document.removeEventListener('focusout', handleFocusOut);
      if (visual) {
        visual.removeEventListener('resize', updateAppViewportHeight);
        visual.removeEventListener('scroll', lockWindowScroll);
      }
    };
  }, []);
}

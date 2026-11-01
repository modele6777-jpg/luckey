import { useEffect } from 'react';

/**
 * 📱 모바일 사파리/크롬/PWA 뷰포트 고정 및 하단 여백 방지 엔진:
 * 1. 앱을 나갔다 들어왔을 때(visibilitychange/pageshow/focus) 또는 기기 회전(orientationchange/resize) 시
 *    visualViewport의 지연/왜곡된 일시적 측정값으로 인해 앱 높이가 축소되어 하단에 거대한 빈 여백이 남는 현상을 원천 차단합니다.
 * 2. 가상 키보드가 실제로 활성화되어 입력 중일 때만 키보드 가시 높이에 맞추고,
 *    그 외의 모든 상태(일반 탐색, 회전, 백그라운드 복귀, 키보드 해제)에서는 100% 전체 높이로 즉시 복원합니다.
 * 3. 스와이프 제스처나 회전 후 최상단 window가 위로 스크롤되어 하단 여백이 노출되는 phantom scroll 현상을 원천 방지합니다.
 */
export function useViewportScrollLock() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const lockWindowScroll = () => {
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
      if (document.documentElement && document.documentElement.scrollTop !== 0) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body && document.body.scrollTop !== 0) {
        document.body.scrollTop = 0;
      }
    };

    const isInputActive = (): boolean => {
      if (typeof document === 'undefined') return false;
      const active = document.activeElement;
      if (!active) return false;
      const tag = active.tagName;
      return tag === 'INPUT' || tag === 'TEXTAREA' || (active as HTMLElement).isContentEditable;
    };

    const updateAppViewportHeight = () => {
      if (typeof window === 'undefined' || typeof document === 'undefined') return;

      lockWindowScroll();

      const visual = window.visualViewport;
      const innerH = window.innerHeight;
      const visualH = visual ? visual.height : innerH;

      // 가상 키보드가 실제로 올라와 있는지 정밀 판별:
      // 1. 활성 입력창(input/textarea/contenteditable)이 실제로 포커스되어 있어야 함
      // 2. visualViewport 높이가 layout viewport(innerHeight)보다 키보드 높이(최소 100px 이상)만큼 확연히 작아야 함
      const hasKeyboard = isInputActive() && visual != null && (innerH - visualH > 100);

      if (hasKeyboard) {
        // 키보드가 활성화된 상태: 키보드 위 가시 영역에 맞춤
        const keyboardSafeHeight = Math.round(visualH);
        document.documentElement.style.setProperty('--app-height', `${keyboardSafeHeight}px`);
      } else {
        // 키보드가 없는 일반 상태 (화면 회전, 앱 백그라운드 복귀, 키보드 해제 등):
        // 100% 가득 채워 하단 빈 여백을 원천 제거
        document.documentElement.style.setProperty('--app-height', '100%');
      }
    };

    let timers: ReturnType<typeof setTimeout>[] = [];
    const scheduleSync = (delays: number[] = [0, 50, 150, 300, 500, 800, 1200]) => {
      for (const delay of delays) {
        if (delay === 0) {
          window.requestAnimationFrame(() => {
            updateAppViewportHeight();
          });
        } else {
          const t = setTimeout(() => {
            updateAppViewportHeight();
          }, delay);
          timers.push(t);
        }
      }
    };

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        scheduleSync([50, 150, 300, 500]);
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        lockWindowScroll();
        scheduleSync([0, 50, 150, 300, 500]);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        lockWindowScroll();
        scheduleSync();
      }
    };

    const handlePageShow = () => {
      lockWindowScroll();
      scheduleSync();
    };

    const handleOrientationChange = () => {
      lockWindowScroll();
      scheduleSync([0, 50, 100, 200, 350, 500, 800, 1200]);
    };

    const handleResize = () => {
      updateAppViewportHeight();
      scheduleSync([50, 150, 300]);
    };

    // 초기 높이 및 스크롤 고정
    updateAppViewportHeight();
    lockWindowScroll();
    scheduleSync([50, 200]);

    window.addEventListener('scroll', lockWindowScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleOrientationChange, { passive: true });
    window.addEventListener('pageshow', handlePageShow, { passive: true });
    window.addEventListener('focus', handlePageShow, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('focusin', handleFocusIn, { passive: true });
    document.addEventListener('focusout', handleFocusOut, { passive: true });

    if (window.screen?.orientation) {
      window.screen.orientation.addEventListener('change', handleOrientationChange);
    }

    const visual = window.visualViewport;
    if (visual) {
      visual.addEventListener('resize', handleResize, { passive: true });
      visual.addEventListener('scroll', lockWindowScroll, { passive: true });
    }

    return () => {
      timers.forEach(clearTimeout);
      timers = [];
      window.removeEventListener('scroll', lockWindowScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('focus', handlePageShow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
      if (window.screen?.orientation) {
        window.screen.orientation.removeEventListener('change', handleOrientationChange);
      }
      if (visual) {
        visual.removeEventListener('resize', handleResize);
        visual.removeEventListener('scroll', lockWindowScroll);
      }
    };
  }, []);
}

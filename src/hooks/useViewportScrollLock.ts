import { useEffect } from 'react';

/**
 * 📱 모바일 사파리/크롬/PWA 뷰포트 고정 및 하단 여백 방지 엔진:
 * 1. 채팅 입력창(input/textarea) 터치 시 화면이 점점 위로 밀려 올라가며 하단에 검은 여백이 남는 WebKit auto-scroll 버그 완벽 차단.
 * 2. iPad/태블릿 PWA 홈 화면 앱에서 WebKit이 상단 상태바/하단 홈바 영역을 중복 감산하여
 *    innerHeight가 실제 하드웨어 화면보다 60~120px 짧게 보고되는 고질적 shortfall 버그를 감지하고 물리적 화면 높이(oriented screen height)로 100% 즉시 채움.
 * 3. 화면 회전(orientationchange/resize) 및 백그라운드 복귀(visibilitychange/pageshow/focus) 시
 *    지연 측정으로 인한 뷰포트 축소를 방지하고 물리적 화면 높이로 100% 즉시 채움.
 * 4. 가상 키보드가 활성화된 입력 상태에서 html/body를 축소하지 않고 #root 영역만 키보드 가시 영역에 맞춰 화면 밀림 방지.
 */
export function useViewportScrollLock() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const lockWindowScroll = () => {
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0);
      }
      if (document.scrollingElement && document.scrollingElement.scrollTop !== 0) {
        document.scrollingElement.scrollTop = 0;
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

    const getOrientedScreenSize = (): { width: number; height: number } => {
      const sw = window.screen?.width || window.innerWidth;
      const sh = window.screen?.height || window.innerHeight;
      const isLandscape = window.innerWidth > window.innerHeight;
      return {
        width: isLandscape ? Math.max(sw, sh) : Math.min(sw, sh),
        height: isLandscape ? Math.min(sw, sh) : Math.max(sw, sh),
      };
    };

    const isTabletOrIpad = (): boolean => {
      const ua = navigator.userAgent || '';
      const isIos = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const minDim = Math.min(window.innerWidth, window.innerHeight);
      return (isIos && minDim >= 600) || /iPad|Tablet/i.test(ua);
    };

    const isStandaloneMode = (): boolean => {
      const nav = window.navigator as any;
      return (
        nav.standalone === true ||
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        document.documentElement.classList.contains('pwa-standalone')
      );
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
        // 주의: html, body의 인라인 height를 축소하면 WebKit이 window scroll을 유발하므로 --app-height와 #root만 축소
        const keyboardSafeHeight = Math.round(visualH);
        document.documentElement.style.setProperty('--app-height', `${keyboardSafeHeight}px`);
        document.documentElement.style.setProperty('--vvh', `${keyboardSafeHeight}px`);
        document.documentElement.style.setProperty('--visual-vh', `${keyboardSafeHeight}px`);
        document.documentElement.style.height = '100%';
        document.documentElement.style.minHeight = '100%';
        if (document.body) {
          document.body.style.height = '100%';
          document.body.style.minHeight = '100%';
        }
        const root = document.getElementById('root');
        if (root) {
          root.style.height = `${keyboardSafeHeight}px`;
          root.style.minHeight = `${keyboardSafeHeight}px`;
        }
      } else {
        const oriented = getOrientedScreenSize();
        const isPwa = isStandaloneMode();
        const isTablet = isTabletOrIpad();
        const shortfall = oriented.height - innerH;

        // 🌟 핵심 해결: iPad / 태블릿 PWA 홈 화면 앱에서 WebKit이 상/하단 바를 중복 차감하여
        // innerHeight가 실제 하드웨어 화면보다 60~120px 짧게 보고되는 고질적 버그 대응
        // 키보드가 없을 때 실제 화면 높이(oriented.height)로 100% 가득 채워 하단 검은 여백을 원천 제거합니다.
        if ((isPwa || isTablet) && shortfall > 15 && shortfall < oriented.height * 0.35) {
          const fullScreenH = Math.round(oriented.height);
          document.documentElement.style.setProperty('--app-height', `${fullScreenH}px`);
          document.documentElement.style.setProperty('--vvh', `${fullScreenH}px`);
          document.documentElement.style.setProperty('--visual-vh', `${fullScreenH}px`);
          document.documentElement.style.height = `${fullScreenH}px`;
          document.documentElement.style.minHeight = `${fullScreenH}px`;
          if (document.body) {
            document.body.style.height = `${fullScreenH}px`;
            document.body.style.minHeight = `${fullScreenH}px`;
          }
          const root = document.getElementById('root');
          if (root) {
            root.style.height = `${fullScreenH}px`;
            root.style.minHeight = `${fullScreenH}px`;
          }
        } else {
          document.documentElement.style.setProperty('--app-height', '100%');
          document.documentElement.style.height = '';
          document.documentElement.style.minHeight = '';
          if (document.body) {
            document.body.style.height = '';
            document.body.style.minHeight = '';
          }
          const root = document.getElementById('root');
          if (root) {
            root.style.height = '';
            root.style.minHeight = '';
          }
        }
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
        lockWindowScroll();
        // 다단계 강제 락: iOS WebKit의 기본 auto-scroll-to-input 동작으로 인한 window scroll 방지
        requestAnimationFrame(lockWindowScroll);
        setTimeout(lockWindowScroll, 30);
        setTimeout(lockWindowScroll, 100);
        setTimeout(lockWindowScroll, 250);
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

import { useEffect } from 'react';
import { isKeyboardViewportOpen, readViewportSnapshot, resolveAppLayoutHeight, syncVisualViewportBox } from '@/lib/visualViewportBox';

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
      // 🌟 가상 키보드 및 기기 회전/펼침 시 수평 오프셋(scrollX) 탈출 완벽 차단:
      // 모바일 웹앱에서는 수평 스크롤이 발생할 이유가 없으므로, 입력 활성 상태 여부와 관계없이
      // scrollX / scrollLeft가 0이 아니면 즉시 0으로 강제 리셋하여 화면이 좌측 바깥으로 밀려나는 현상을 방지한다.
      if (window.scrollX !== 0) {
        window.scrollTo(0, window.scrollY);
      }
      if (document.scrollingElement && document.scrollingElement.scrollLeft !== 0) {
        document.scrollingElement.scrollLeft = 0;
      }
      if (document.documentElement && document.documentElement.scrollLeft !== 0) {
        document.documentElement.scrollLeft = 0;
      }
      if (document.body && document.body.scrollLeft !== 0) {
        document.body.scrollLeft = 0;
      }

      // 🌟 키보드 튕김(닫힘) 완벽 차단:
      // 활성 입력창(input/textarea/contenteditable)에 포커스가 있는 동안에는 어떤 경우에도
      // 수직 window.scrollTo(0, 0)나 document/body scrollTop을 호출하지 않는다.
      // iOS WebKit은 가상 키보드 전개 중 또는 입력 중에 프로그래밍 방식의 스크롤 조작이 들어오면
      // 사용자가 화면을 터치해 스크롤한 것으로 오인하여 키보드를 즉시 닫고 튕겨내기 때문.
      if (isInputActive()) return;

      if (window.scrollY !== 0) {
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

    const updateAppViewportHeight = () => {
      if (typeof window === 'undefined' || typeof document === 'undefined') return;

      lockWindowScroll();

      const visual = window.visualViewport;
      const visualH = visual ? visual.height : window.innerHeight;
      const visualTop = visual ? Math.max(0, Math.round(visual.offsetTop)) : 0;

      const snapshot = readViewportSnapshot(window);
      const hasKeyboard = isKeyboardViewportOpen(snapshot, isInputActive());

      if (hasKeyboard) {
        document.documentElement.classList.add('keyboard-open');
        if (document.body) document.body.classList.add('keyboard-open');

        // iOS는 키보드가 열릴 때 visualViewport를 위로 패닝(offsetTop)한다.
        // 여기서 html/body 높이까지 줄이면 그 패닝과 겹쳐 화면이 키보드보다 더 위로 올라간다.
        // 문서 높이는 그대로 두고, #root만 지금 보이는 사각형(offset + visual height)에 붙인다.
        const keyboardSafeHeight = Math.round(visualH);

        document.documentElement.style.removeProperty('height');
        document.documentElement.style.removeProperty('min-height');
        if (document.body) {
          document.body.style.removeProperty('height');
          document.body.style.removeProperty('min-height');
        }

        document.documentElement.style.setProperty('--vv-top', `${visualTop}px`);
        document.documentElement.style.setProperty('--vv-left', '0px');
        document.documentElement.style.setProperty('--app-height', `${keyboardSafeHeight}px`);
        document.documentElement.style.setProperty('--vvh', `${keyboardSafeHeight}px`);
        document.documentElement.style.setProperty('--visual-vh', `${keyboardSafeHeight}px`);

        const root = document.getElementById('root');
        if (root) {
          root.style.setProperty('position', 'fixed', 'important');
          root.style.setProperty('top', `${visualTop}px`, 'important');
          root.style.setProperty('left', '0px', 'important');
          root.style.setProperty('right', '0px', 'important');
          root.style.setProperty('width', '100%', 'important');
          root.style.setProperty('height', `${keyboardSafeHeight}px`, 'important');
          root.style.setProperty('min-height', '0px', 'important');
          root.style.setProperty('max-height', `${keyboardSafeHeight}px`, 'important');
        }
        const shell = root?.querySelector<HTMLElement>('.prism-app-shell') || null;
        if (shell) {
          shell.style.height = `${keyboardSafeHeight}px`;
          shell.style.minHeight = '0px';
          shell.style.maxHeight = `${keyboardSafeHeight}px`;
        }
      } else {
        document.documentElement.classList.remove('keyboard-open');
        if (document.body) document.body.classList.remove('keyboard-open');
        document.documentElement.style.setProperty('--vv-top', '0px');
        document.documentElement.style.setProperty('--vv-left', '0px');
        const layoutHeight = resolveAppLayoutHeight(snapshot);
        document.documentElement.style.setProperty('--app-height', layoutHeight);
        // Restore every viewport alias as well as the shell after keyboard dismissal.
        syncVisualViewportBox(window);
        document.documentElement.style.removeProperty('height');
        document.documentElement.style.removeProperty('min-height');
        document.body?.style.removeProperty('height');
        document.body?.style.removeProperty('min-height');

        const root = document.getElementById('root');
        for (const property of ['position', 'top', 'left', 'right', 'width', 'height', 'min-height', 'max-height']) {
          root?.style.removeProperty(property);
        }
        const shell = root?.querySelector<HTMLElement>('.prism-app-shell');
        for (const property of ['height', 'min-height', 'max-height']) {
          shell?.style.removeProperty(property);
        }
      }
    };

    let timers: ReturnType<typeof setTimeout>[] = [];
    const scheduleSync = (delays: number[] = [0, 50, 150, 300, 500, 800, 1200]) => {
      timers.forEach(clearTimeout);
      timers = [];
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
        scheduleSync([0, 50, 100, 200, 350, 500]);
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        setTimeout(() => {
          if (!isInputActive()) {
            lockWindowScroll();
            updateAppViewportHeight();
            scheduleSync([50, 150, 300, 800, 1200]);
          }
        }, 80);
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
      scheduleSync([50, 150, 300, 800, 1200]);
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
      visual.addEventListener('scroll', handleResize, { passive: true });
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
        visual.removeEventListener('scroll', handleResize);
      }
    };
  }, []);
}

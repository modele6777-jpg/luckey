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

    // 가상 키보드가 실제로 올라와 있는지 판별 (updateAppViewportHeight의 hasKeyboard 판정과 동일 기준)
    const hasKeyboardNow = (): boolean => {
      const visual = window.visualViewport;
      const innerH = window.innerHeight;
      const visualH = visual ? visual.height : innerH;
      return isInputActive() && visual != null && (innerH - visualH > 100);
    };

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

    const getOrientedScreenSize = (): { width: number; height: number } => {
      // 🌟 폴더블 기기(아이폰 듀오/갤럭시 폴드) 커버 화면 대응:
      // 접힌 상태(커버 화면, 폭 580px 미만 세로)에서는 window.screen이 펼쳐진 대화면 기준 물리 해상도(예: 2048px)를
      // 반환하므로, window.innerWidth/innerHeight를 우선하여 실제 활성 디스플레이 영역에 정확히 맞춘다.
      const isFoldedCover = window.innerWidth < 580 && window.innerHeight >= window.innerWidth;
      const sw = isFoldedCover ? window.innerWidth : (window.screen?.width || window.innerWidth);
      const sh = isFoldedCover ? window.innerHeight : (window.screen?.height || window.innerHeight);
      const isLandscape =
        window.screen?.orientation?.type?.startsWith('landscape') ||
        Math.abs(Number((window as any).orientation || 0)) === 90 ||
        window.innerWidth > window.innerHeight;
      return {
        width: isLandscape ? Math.max(sw, sh) : Math.min(sw, sh),
        height: isLandscape ? Math.min(sw, sh) : Math.max(sw, sh),
      };
    };

    const isIosOrTablet = (): boolean => {
      if (typeof navigator === 'undefined') return false;
      const ua = navigator.userAgent || '';
      const isIos = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      return isIos || /Tablet|Android/i.test(ua);
    };

    const isStandaloneMode = (): boolean => {
      if (typeof window === 'undefined') return false;
      const nav = window.navigator as any;
      return Boolean(
        nav?.standalone === true ||
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
      const visualTop = visual ? Math.max(0, Math.round(visual.offsetTop)) : 0;

      const oriented = getOrientedScreenSize();
      // 가상 키보드가 실제로 올라와 있는지 정밀 판별:
      // 1. 활성 입력창(input/textarea/contenteditable)이 포커스되어 있고 visualH가 화면 높이보다 100px 이상 작을 때 (PWA standalone 대응)
      // 2. 또는 visualViewport 높이가 innerHeight보다 100px 이상 작을 때 (Safari 브라우저 대응)
      const hasKeyboard =
        (isInputActive() && visual != null && visualH < oriented.height - 100) ||
        (visual != null && innerH - visualH > 100);

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
        const resetShell = () => {
          const shell = document.getElementById('root')?.querySelector<HTMLElement>('.prism-app-shell') || null;
          if (shell) {
            shell.style.height = '';
            shell.style.minHeight = '';
            shell.style.maxHeight = '';
          }
        };
        const rootEl = document.getElementById('root');
        if (rootEl) {
          rootEl.style.removeProperty('position');
          rootEl.style.removeProperty('top');
          rootEl.style.removeProperty('left');
          rootEl.style.removeProperty('right');
          rootEl.style.removeProperty('width');
          rootEl.style.removeProperty('height');
          rootEl.style.removeProperty('min-height');
          rootEl.style.removeProperty('max-height');
        }
        const isCandidate = isIosOrTablet() || isStandaloneMode();
        const shortfall = oriented.height - innerH;

        // 🌟 핵심 해결: iPad / 태블릿 PWA 홈 화면 앱에서 WebKit이 상/하단 바를 중복 차감하여
        // innerHeight가 실제 하드웨어 화면보다 60~120px 짧게 보고되는 고질적 버그 대응
        // 키보드가 없을 때 실제 화면 높이(oriented.height)로 100% 가득 채워 하단 검은 여백을 원천 제거합니다.
        if (isCandidate && shortfall > 10 && shortfall < oriented.height * 0.45) {
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
            root.style.position = 'fixed';
            root.style.top = '0px';
            root.style.left = '0px';
            root.style.right = '0px';
            root.style.height = `${fullScreenH}px`;
            root.style.minHeight = `${fullScreenH}px`;
          }
          resetShell();
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
            root.style.position = 'fixed';
            root.style.top = '0px';
            root.style.left = '0px';
            root.style.right = '0px';
            root.style.height = '100lvh';
            root.style.minHeight = '100lvh';
          }
          resetShell();
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
            scheduleSync([50, 150, 300]);
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

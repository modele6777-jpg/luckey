import { requestLucyAction } from '@/lib/duoLucyActionRouting';
import { isLucyChatPath } from '@/lib/duoPaneFocus';
import { ScreenPortal } from '@/components/layout/ScreenPortal';
import { useContentCanvasCompact } from '@/hooks/useContentCanvasCompact';
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "motion/react";
import { KeyCosmicLoader } from "@/components/KeyCosmicLoader";
import { isKeyChannelTransitionActive } from "@/components/omniwarp/KeyChannelTransition";
import { getPendingPrismToss, clearPrismToss } from "@/lib/prismToss";
import { playAudioHaptic } from "@/lib/audioHaptics";
import { useTheme } from "@/contexts/ThemeContext";
import { readSafeAreaInsets } from "@/lib/visualViewportBox";

const CALM_DARK_THEME_CSS = `
  html.dark {
    --bg-canvas: #0c0e16 !important;
    --bg-canvas-subtle: #131622 !important;
    --bg-card: #161a29 !important;
    --bg-card-glass: rgba(22, 26, 41, 0.88) !important;
    --border-linen: rgba(255, 255, 255, 0.12) !important;
    --border-focus: #e09f7d !important;
    --copper-primary: #e09f7d !important;
    --copper-hover: #f3b899 !important;
    --copper-light: rgba(224, 159, 125, 0.14) !important;
    --copper-subtle: rgba(224, 159, 125, 0.12) !important;
    --gold-accent: #f59e0b !important;
    --sage-accent: #6ee7b7 !important;
    --sage-light: rgba(16, 185, 129, 0.14) !important;
    --text-title: #ffffff !important;
    --text-body: #f8fafc !important;
    --text-muted: #cbd5e1 !important;
    --text-dim: #94a3b8 !important;
    --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.35) !important;
    --shadow-card: 0 10px 30px -5px rgba(0, 0, 0, 0.5) !important;
    --shadow-float: 0 20px 45px -10px rgba(0, 0, 0, 0.65) !important;
    color-scheme: dark;
  }
  html.dark body {
    background: var(--bg-canvas) !important;
    color: #ffffff !important;
  }
  html.dark .portal-header,
  html.dark .portal-card,
  html.dark .habit-card,
  html.dark .mission-card,
  html.dark .card {
    background: rgba(22, 26, 41, 0.92) !important;
    border-color: rgba(255, 255, 255, 0.14) !important;
    color: #ffffff !important;
  }
  html.dark h1,
  html.dark h2,
  html.dark h3,
  html.dark h4,
  html.dark .portal-title-group h2,
  html.dark .portal-card-head h3,
  html.dark .habit-card-title,
  html.dark .mission-card-title,
  html.dark .section-title {
    color: #ffffff !important;
  }
  html.dark p,
  html.dark span:not(.badge),
  html.dark li,
  html.dark label,
  html.dark .portal-title-group p,
  html.dark .portal-card-body p,
  html.dark .habit-card-desc,
  html.dark .mission-card-desc {
    color: #f1f5f9 !important;
  }
`;

export default function CalmApp() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [, navigate] = useLocation();
  // The Key entry screen already covers the switch; don't stack a second loader.
  const [isLoading, setIsLoading] = useState(() => !isKeyChannelTransitionActive());
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const { resolvedTheme } = useTheme();

  const syncIframeTheme = useCallback(() => {
    try {
      const doc = iframeRef.current?.contentDocument;
      if (!doc || !doc.documentElement) return;
      doc.documentElement.classList.remove('dark');
      doc.documentElement.classList.add('light');
      doc.documentElement.setAttribute('data-theme', 'light');
      doc.documentElement.style.colorScheme = 'light';
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (iframeLoaded) {
      syncIframeTheme();
    }
  }, [resolvedTheme, iframeLoaded, syncIframeTheme]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    let frame = 0;
    const syncTopInset = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const root = iframe.contentDocument?.documentElement;
        if (!root) return;
        root.style.setProperty('--key-safe-top', `${readSafeAreaInsets(document).top}px`);
      });
    };
    const observer = new ResizeObserver(syncTopInset);
    observer.observe(iframe);
    window.addEventListener('resize', syncTopInset);
    iframe.addEventListener('load', syncTopInset);
    syncTopInset();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', syncTopInset);
      iframe.removeEventListener('load', syncTopInset);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const dismissLoader = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // The entry screen may start in the same frame this page mounts.
    const frame = window.requestAnimationFrame(() => {
      if (isKeyChannelTransitionActive()) setIsLoading(false);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!isLoading) return;
    const fallbackTimer = window.setTimeout(() => setIsLoading(false), 1000);
    return () => window.clearTimeout(fallbackTimer);
  }, [isLoading]);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Key - 막힌 운을 여는 40가지 개운법 & 50가지 민감성 케어 90대 실천 성전";

    // Handle messages from iframe (navigation to Lucy, frame ready signal, or text selection)
    const handleMessage = (e: MessageEvent) => {
      if (!e.data) return;

      // 1. Frame is ready - dismiss loader immediately without artificial delay
      if (e.data.type === "CALM_FRAME_READY" || e.data.type === "CALM_READY") {
        setIframeLoaded(true);
        setIsLoading(false);
        return;
      }

      // 1.5. Handle Balloon Breathing Haptic vibration from iframe
      if (e.data.type === "BALLOON_BREATHING_HAPTIC") {
        const phase = e.data.phase; // 'inhale-peak' | 'exhale-peak'
        if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
          try {
            if (phase === "inhale-peak") {
              // Inhale peak: double expansion vibration pulse
              navigator.vibrate([35, 30, 45]);
            } else {
              // Exhale peak: calming grounding release vibration pulse
              navigator.vibrate([50, 40, 25]);
            }
          } catch (_) {}
        }
        try {
          playAudioHaptic(phase === "inhale-peak" ? "breathe_inhale" : "breathe_exhale");
        } catch (_) {}
        return;
      }

      // App-wide SelectionBridgeToolbar captures same-origin iframe selections.
      if (e.data.type === "PRISM_IFRAME_SELECTION") return;

      // 3. Forward pending prism toss payload or navigation to Lucy
      if (e.data.type === "NAVIGATE_LUCKEY") {
        const target = e.data.path || '/chat';
        if (isLucyChatPath(target)) {
          requestLucyAction({ prompt: e.data.text });
        } else {
          navigate(target);
        }
      }
    };
    window.addEventListener("message", handleMessage);

    return () => {
      document.title = prevTitle;
      window.removeEventListener("message", handleMessage);
    };
  }, [navigate]);

  // Once iframe onLoad fires, release loading immediately
  const handleIFrameLoad = useCallback(() => {
    setIframeLoaded(true);
    syncIframeTheme();
    // Smooth micro-transition: dismiss after short frame flush
    requestAnimationFrame(() => {
      setIsLoading(false);
    });
  }, [syncIframeTheme]);

  // 전달받은 토스 텍스트 또는 특정 실천 연습이 있으면 iframe 로드 후 즉시 실행 요청
  useEffect(() => {
    if (iframeLoaded) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const exParam = urlParams.get('ex') || sessionStorage.getItem('key_target_exercise');
        const pendingToss = getPendingPrismToss('key');
        const tossedText =
          sessionStorage.getItem('key_tossed_text') ||
          pendingToss?.contextMessage ||
          pendingToss?.autoPrompt;

        if (tossedText && !exParam) {
          sessionStorage.removeItem('key_tossed_text');
          clearPrismToss();
          const timer = setTimeout(() => {
            iframeRef.current?.contentWindow?.postMessage(
              {
                type: 'TOSS_TO_EXERCISES',
                text: tossedText,
              },
              '*'
            );
          }, 350);
          return () => clearTimeout(timer);
        }

        if (exParam) {
          sessionStorage.removeItem('key_target_exercise');
          const exIdx = parseInt(exParam, 10);
          if (exIdx) {
            const timer = setTimeout(() => {
              iframeRef.current?.contentWindow?.postMessage({ type: 'START_PRACTICE', exerciseIdx: exIdx }, '*');
            }, 300);
            return () => clearTimeout(timer);
          }
        }

        // Key 진입 시 자동으로 오늘의 랜덤 실천 처방 모달 띄우기
        if (!tossedText && !exParam) {
          const timer = setTimeout(() => {
            iframeRef.current?.contentWindow?.postMessage({ type: 'AUTO_RANDOM_PRESCRIPTION' }, '*');
          }, 450);
          return () => clearTimeout(timer);
        }
      } catch (_) {}
    }
  }, [iframeLoaded]);

  // 🌟 Key 화면에 이미 머물고 있는 상태에서 빅뱅 버튼 더블탭 등으로 토스된 경우 실시간 즉각 실행
  useEffect(() => {
    const handleLiveToss = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (detail?.target === 'key' && detail?.text) {
        iframeRef.current?.contentWindow?.postMessage(
          {
            type: 'TOSS_TO_EXERCISES',
            text: detail.text,
          },
          '*'
        );
      }
    };
    window.addEventListener('prism:selection_tossed', handleLiveToss);
    return () => {
      window.removeEventListener('prism:selection_tossed', handleLiveToss);
    };
  }, []);

  const isWideWorkspace = !useContentCanvasCompact(896);
  useEffect(() => {
    const frame = iframeRef.current;
    const updateLayout = () => {
      try {
        const html = frame?.contentDocument?.documentElement;
        const body = frame?.contentDocument?.body;
        html?.classList.add('duo-parent-managed');
        const isDuo = typeof document !== 'undefined' && Boolean(document.getElementById('duo-content-viewport'));
        // 📱 좌측 화면(50vw)에서는 태블릿용 2열 가로 분할(duo-parent-wide)을 절대 켜지 않고 접힌 상태의 1열 단일 스택 뷰를 강제!
        if (isDuo) {
          html?.classList.add('duo-folded-view', 'duo-left-viewport');
          body?.classList.add('duo-left-viewport');
          html?.classList.remove('duo-parent-wide');
        } else {
          html?.classList.toggle('duo-parent-wide', isWideWorkspace);
          html?.classList.remove('duo-folded-view', 'duo-left-viewport');
          body?.classList.remove('duo-left-viewport');
        }
      } catch { /* The iframe remains usable while its document is navigating. */ }
    };
    frame?.addEventListener('load', updateLayout);
    updateLayout();
    return () => frame?.removeEventListener('load', updateLayout);
  }, [isWideWorkspace]);
  const searchParams = typeof window !== 'undefined' ? window.location.search : '';
  const iframeSrc = `/calm/index.html${searchParams ? searchParams + '&v=43.0' : '?v=43.0'}`;

  return (
    <div
      className="relative w-full min-w-0 h-app-full z-40 overflow-hidden flex flex-col transition-colors duration-300 bg-[#fcf9f5]"
    >
      <AnimatePresence mode="wait">
        {isLoading && (
          <ScreenPortal><motion.div
            key="key-cosmic-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={dismissLoader}
            className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
          >
            <KeyCosmicLoader
              fullScreen
              message="Key 개운(開運) 파동 조율 중..."
              subMessage="90 DESTINY OPENING RITUALS & MINDFUL PRACTICES"
            />
          </motion.div></ScreenPortal>
        )}
      </AnimatePresence>
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        title="Key"
        className="block w-full min-h-0 border-0 m-0 p-0 flex-1"
        allow="autoplay; microphone"
        onLoad={handleIFrameLoad}
      />
    </div>
  );
}

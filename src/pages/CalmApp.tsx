import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "motion/react";
import { KeyCosmicLoader } from "@/components/KeyCosmicLoader";
import { savePendingSelection, clearPendingSelection } from "@/lib/selectionBridge";
import { getPendingPrismToss, clearPrismToss } from "@/lib/prismToss";
import { playAudioHaptic } from "@/lib/audioHaptics";
import { useTheme } from "@/contexts/ThemeContext";

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
  const [isLoading, setIsLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const { resolvedTheme } = useTheme();

  const syncIframeTheme = useCallback((theme: 'light' | 'dark') => {
    try {
      const doc = iframeRef.current?.contentDocument;
      if (!doc || !doc.documentElement) return;
      if (!doc.getElementById('prism-calm-theme-sync')) {
        const styleEl = doc.createElement('style');
        styleEl.id = 'prism-calm-theme-sync';
        styleEl.textContent = CALM_DARK_THEME_CSS;
        doc.head?.appendChild(styleEl);
      }
      if (theme === 'dark') {
        doc.documentElement.classList.add('dark');
        doc.documentElement.classList.remove('light');
      } else {
        doc.documentElement.classList.remove('dark');
        doc.documentElement.classList.add('light');
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (iframeLoaded) {
      syncIframeTheme(resolvedTheme);
    }
  }, [resolvedTheme, iframeLoaded, syncIframeTheme]);

  const dismissLoader = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Key - 40대 불안 치유 연습 & 마음약방";

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

      // 2. Iframe 내부 텍스트 선택(스크롤)을 상위 PRISM 빅뱅 토스 브릿지로 동기화
      if (e.data.type === "PRISM_IFRAME_SELECTION") {
        if (e.data.text && e.data.text.length >= 2) {
          savePendingSelection(e.data.text, undefined, '/key');
        } else {
          clearPendingSelection();
        }
        return;
      }

      // 3. Forward pending prism toss payload or navigation to Lucy
      if (e.data.type === "NAVIGATE_LUCKEY") {
        if (e.data.text) {
          try {
            sessionStorage.setItem('lucy_injected_auto_send', e.data.text);
            sessionStorage.setItem('lucy_injected_input_draft', e.data.text);
            window.dispatchEvent(new CustomEvent('lucy:dynamic_inject', { detail: { prompt: e.data.text } }));
          } catch (_) {}
        }
        navigate(e.data.path || "/chat");
      }
    };
    window.addEventListener("message", handleMessage);

    // Guaranteed fallback: maximum 1000ms display so the user is never stuck in infinite loading
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(fallbackTimer);
      document.title = prevTitle;
      window.removeEventListener("message", handleMessage);
    };
  }, [navigate]);

  // Once iframe onLoad fires, release loading immediately
  const handleIFrameLoad = useCallback(() => {
    setIframeLoaded(true);
    syncIframeTheme(resolvedTheme);
    // Smooth micro-transition: dismiss after short frame flush
    requestAnimationFrame(() => {
      setIsLoading(false);
    });
  }, [resolvedTheme, syncIframeTheme]);

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

  const searchParams = typeof window !== 'undefined' ? window.location.search : '';
  const iframeSrc = `/calm/index.html${searchParams ? searchParams + '&v=38.0' : '?v=38.0'}`;

  return (
    <div
      className={`fixed inset-0 w-full h-[100dvh] z-40 overflow-hidden flex flex-col transition-colors duration-300 ${
        resolvedTheme === 'dark' ? 'bg-[#0c0e16]' : 'bg-[#fcf9f5]'
      }`}
    >
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="key-cosmic-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={dismissLoader}
            className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
          >
            <KeyCosmicLoader
              fullScreen
              message="Key 마음약방 처방 조율 중..."
              subMessage="40 CALM PRACTICES & CLINICAL SOMATIC RAG"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        title="Key"
        className="w-full h-full border-0 m-0 p-0 flex-1"
        allow="autoplay; microphone"
        onLoad={handleIFrameLoad}
      />
    </div>
  );
}

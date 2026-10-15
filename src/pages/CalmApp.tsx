import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "motion/react";
import { KeyCosmicLoader } from "@/components/KeyCosmicLoader";
import { savePendingSelection, clearPendingSelection } from "@/lib/selectionBridge";
import { getPendingPrismToss, clearPrismToss } from "@/lib/prismToss";
import { playAudioHaptic } from "@/lib/audioHaptics";

export default function CalmApp() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);

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
    // Smooth micro-transition: dismiss after short frame flush
    requestAnimationFrame(() => {
      setIsLoading(false);
    });
  }, []);

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

  const searchParams = typeof window !== 'undefined' ? window.location.search : '';
  const iframeSrc = `/calm/index.html${searchParams ? searchParams + '&v=38.0' : '?v=38.0'}`;

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-[#fcf9f5] z-40 overflow-hidden flex flex-col">
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

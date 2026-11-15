import { useMainOverlayViewport } from '@/hooks/useMainOverlayViewport';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { subscribeTTS } from '@/utils/tts';

/** Legacy channel readers do not have an inline error area. */
export function TTSFailureNotice() {
  const viewportStyle = useMainOverlayViewport();
  const [message, setMessage] = useState('');
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => subscribeTTS(state => setSpeaking(state.isSpeaking)), []);
  useEffect(() => {
    const onError = (event: Event) => {
      const detail = (event as CustomEvent<{ message?: string }>).detail;
      if (typeof detail?.message === 'string') setMessage(detail.message);
    };
    const onRecovered = () => setMessage('');
    window.addEventListener('prism:tts-recovered', onRecovered);
    window.addEventListener('prism:tts-error', onError);
    return () => {
      window.removeEventListener('prism:tts-error', onError);
      window.removeEventListener('prism:tts-recovered', onRecovered);
    };
  }, []);
  if (!message && !speaking) return null;
  return createPortal(
    <div className="main-viewport-overlay" data-responsive-canvas="true" style={{ ...viewportStyle, zIndex: 10030 }}>
    {speaking && <span className="pointer-events-none fixed bottom-4 left-4 z-[10030] rounded-full bg-slate-950/80 px-2 py-1 text-[10px] text-white/80">AI 생성 음성</span>}
    {message && <div role="alert" className="fixed top-20 left-4 right-4 z-[10030] mx-auto flex max-w-md items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950 shadow-xl">
      <span className="flex-1">{message}</span>
      <button type="button" className="shrink-0 rounded-lg px-2 py-1 font-medium hover:bg-amber-100" onClick={() => setMessage('')}>닫기</button>
    </div>}
    </div>, document.body,
  );
}

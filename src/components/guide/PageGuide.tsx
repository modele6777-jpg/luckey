import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Square, Volume2, X } from 'lucide-react';
import { ScreenPortal } from '@/components/layout/ScreenPortal';
import { pageGuideSpeech, type PageGuide } from '@/lib/pageGuides';
import { playTTSInChunks, stopTTS, useTTSState } from '@/utils/tts';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';

/** 📘 Simple guide dialog with a listen (TTS) button. */
export function PageGuideDialog({ guide, onClose }: { guide: PageGuide; onClose: () => void }) {
  const tts = useTTSState();
  const speech = pageGuideSpeech(guide);
  const mine = Boolean((tts.isSpeaking || tts.isLoading) && (tts.activeFullText === speech || tts.activeText === speech || (tts.activeFullText || '').startsWith(guide.title)));
  const [requested, setRequested] = useState(false);
  const playing = mine || (requested && tts.isLoading);

  useEffect(() => {
    if (!tts.isSpeaking && !tts.isLoading) setRequested(false);
  }, [tts.isSpeaking, tts.isLoading]);

  const close = () => {
    if (mine || requested) stopTTS();
    onClose();
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const toggleListen = () => {
    triggerHaptic('whitehole');
    if (playing) {
      stopTTS();
      setRequested(false);
      return;
    }
    setRequested(true);
    void playTTSInChunks(speech, 'Kore', 110, undefined, undefined, { isUserToggleClick: true, skipCompletionChime: true });
  };

  return (
    <ScreenPortal>
      <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/45 px-4 pt-14 pb-10 backdrop-blur-[2px]" onClick={close}>
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`page-guide-title-${guide.id}`}
          data-page-guide={guide.id}
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2 }}
          onClick={event => event.stopPropagation()}
          className="w-full max-w-[400px] rounded-3xl border border-slate-200 bg-white p-5 text-slate-800 shadow-2xl"
          style={{ colorScheme: 'light' }}
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700"><BookOpen size={20} /></span>
            <div className="min-w-0 flex-1">
              <h2 id={`page-guide-title-${guide.id}`} className="text-base font-black text-slate-900">{guide.title}</h2>
              <p className="mt-0.5 text-[13px] leading-relaxed text-slate-600 break-keep">{guide.intro}</p>
            </div>
            <button type="button" onClick={close} aria-label="가이드 닫기" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"><X size={18} /></button>
          </div>

          <div className="mt-3.5 flex gap-2">
            <button
              type="button"
              data-page-guide-listen
              aria-pressed={playing}
              onClick={toggleListen}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold active:scale-95 ${playing ? 'bg-slate-800 text-white' : 'bg-amber-400 text-slate-950'}`}
            >
              {playing ? <><Square size={14} /> 그만 듣기</> : <><Volume2 size={16} /> 소리로 듣기</>}
            </button>
            <button type="button" onClick={close} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 active:scale-95">확인</button>
          </div>
          <ul className="mt-3.5 space-y-2">
            {guide.tips.map((tip, index) => (
              <li key={index} className="flex gap-3 rounded-2xl bg-slate-50 px-3.5 py-2.5">
                <span className="text-lg leading-none" aria-hidden="true">{tip.icon}</span>
                <span className="text-[13.5px] leading-relaxed text-slate-700 break-keep">{tip.text}</span>
              </li>
            ))}
          </ul>

        </motion.div>
      </div>
    </ScreenPortal>
  );
}

/** Round "가이드" button for page headers (top right). */
export function PageGuideButton({ guide, tone = 'dark', className = '' }: { guide: PageGuide; tone?: 'dark' | 'light'; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        data-page-guide-button={guide.id}
        aria-label={`${guide.title} 가이드 열기`}
        title="가이드"
        onClick={() => { triggerHaptic('whitehole'); setOpen(true); }}
        className={`inline-flex h-8 items-center gap-1 rounded-full border px-2.5 text-[11px] font-bold backdrop-blur-md active:scale-95 ${tone === 'light'
          ? 'border-slate-300/80 bg-white/80 text-slate-700'
          : 'border-white/20 bg-white/10 text-white/90'} ${className}`}
      >
        <BookOpen size={13} aria-hidden="true" />
        가이드
      </button>
      {open && <PageGuideDialog guide={guide} onClose={() => setOpen(false)} />}
    </>
  );
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import { Download, RotateCcw, X } from 'lucide-react';
import { ScreenPortal } from '@/components/layout/ScreenPortal';
import {
  generateMasterSessionCard,
  masterSessionConcern,
  type MasterSessionCardContent,
  type MasterSessionCardSource,
} from '@/lib/lucyMasterSessionCard';

const DEPTH_NAME = { 1: '기본', 2: '심화', 3: '심층' } as const;
const LINE_LABELS = ['지금', '방향', '해볼 일'];

function formatDate(at: number): string {
  try {
    return new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(at));
  } catch {
    return '';
  }
}

/**
 * 📜 상담 카드: 상담이 끝났을 때 한 장으로 남긴다.
 * 날짜 · 고민 · 핵심 3줄 · 루시가 남기는 한마디. 이미지로 저장(공유)할 수 있다.
 */
export function LucyMasterSessionCard({ source, onClose }: { source: MasterSessionCardSource; onClose: () => void }) {
  const [content, setContent] = useState<MasterSessionCardContent | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const [saving, setSaving] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const concern = masterSessionConcern(source.messages);

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    generateMasterSessionCard(source, controller.signal)
      .then(result => { if (!controller.signal.aborted) { setContent(result); setStatus('ready'); } })
      .catch(() => { if (!controller.signal.aborted) setStatus('error'); });
    return () => controller.abort();
  }, [source, attempt]);

  const save = useCallback(async () => {
    if (!cardRef.current || saving) return;
    setSaving(true);
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true, style: { transform: 'none' } });
      const fileName = `lucy-master-${new Date(source.endedAt).toISOString().slice(0, 10)}.png`;
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], fileName, { type: 'image/png' });
      const nav = navigator as Navigator & { canShare?: (data: { files: File[] }) => boolean };
      if (nav.share && nav.canShare?.({ files: [file] })) {
        await nav.share({ files: [file], title: 'Lucy Master 상담 카드' });
      } else {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = fileName;
        link.click();
      }
    } catch (error) {
      // User cancelled the share sheet, or the image could not be rendered.
      console.warn('[LucyMasterSessionCard] save failed', error);
    }
    setSaving(false);
  }, [saving, source.endedAt]);

  return (
    <ScreenPortal>
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 pt-4 pb-36 bg-black/55 backdrop-blur-sm" onClick={onClose}>
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="상담 카드"
          data-lucy-master-session-card
          initial={{ opacity: 0, y: 14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25 }}
          onClick={event => event.stopPropagation()}
          className="w-full max-w-[360px] flex flex-col items-center gap-3"
        >
          {/* The card itself (this element is what gets saved as an image) */}
          <div
            ref={cardRef}
            className="w-full rounded-3xl px-5 py-5 text-white"
            style={{
              background: 'radial-gradient(circle at 50% 0%, #3b1d6e 0%, #1e0f3a 55%, #120822 100%)',
              boxShadow: '0 20px 60px rgba(76,29,149,0.45), inset 0 0 0 1px rgba(253,230,138,0.25)',
            }}
          >
            <div className="text-center">
              <p className="text-[10px] font-bold tracking-[0.3em] text-amber-200/80">LUCY MASTER</p>
              <p className="mt-1 text-[11px] text-violet-200/75">{formatDate(source.endedAt)} · 깊이 {source.depth} {DEPTH_NAME[source.depth]}</p>
            </div>

            {concern && (
              <p className="mt-3.5 text-center text-[13px] leading-relaxed text-violet-100/90 break-keep">“{concern}”</p>
            )}

            <div className="my-4 h-px bg-gradient-to-r from-transparent via-amber-200/40 to-transparent" />

            {status === 'ready' && content ? (
              <>
                <ul className="space-y-2.5">
                  {content.lines.map((line, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="shrink-0 w-12 pt-[1px] text-[11px] font-bold text-amber-200/90">{LINE_LABELS[index]}</span>
                      <span className="text-[13.5px] leading-relaxed text-white/95 break-keep">{line}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 rounded-2xl border border-amber-200/25 bg-white/[0.04] px-4 py-3.5 text-center">
                  <p className="text-[10px] font-bold tracking-widest text-amber-200/80">루시가 남기는 한마디</p>
                  <p className="mt-2 font-serif italic text-[15px] leading-relaxed text-amber-50 break-keep">{content.word}</p>
                </div>
              </>
            ) : status === 'loading' ? (
              <div className="py-10 text-center" role="status">
                <motion.p className="text-2xl" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: Infinity }}>🕯️</motion.p>
                <p className="mt-2 text-xs text-violet-100/80">루시가 오늘 상담을 한 장에 담고 있어요…</p>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-xs text-violet-100/85">카드를 만들지 못했어요. 잠시 후 다시 시도해 주세요.</p>
              </div>
            )}

            <p className="mt-4 text-center text-[9px] tracking-wider text-white/35">Lucky · 재미와 참고를 위한 상담 기록</p>
          </div>

          {/* Actions (not part of the saved image) */}
          <div className="flex w-full gap-2">
            {status === 'error' ? (
              <button type="button" onClick={() => setAttempt(value => value + 1)} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950 active:scale-95">
                <RotateCcw size={15} /> 다시 만들기
              </button>
            ) : (
              <button type="button" disabled={status !== 'ready' || saving} onClick={save} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950 disabled:opacity-50 active:scale-95">
                <Download size={15} /> {saving ? '저장 중…' : '이미지로 저장'}
              </button>
            )}
            <button type="button" onClick={onClose} aria-label="상담 카드 닫기" className="inline-flex items-center justify-center gap-1 rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-bold text-white active:scale-95">
              <X size={15} /> 닫기
            </button>
          </div>
        </motion.div>
      </div>
    </ScreenPortal>
  );
}

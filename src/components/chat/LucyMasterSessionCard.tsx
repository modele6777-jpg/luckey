import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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
// 4:5 portrait — Instagram feed size (1080×1350 at 3×), also fine for KakaoTalk.
const CARD_W = 360;
const CARD_H = 450;
const SERIF = '"Noto Serif KR", "Playfair Display", Georgia, serif';

// Fixed star field so the saved image always looks the same.
const STARS = Array.from({ length: 60 }, (_, i) => ({
  left: (i * 47 + 13) % 100,
  top: (i * 61 + 5) % 100,
  size: i % 7 === 0 ? 2.2 : i % 3 === 0 ? 1.4 : 1,
  opacity: 0.25 + ((i * 37) % 60) / 100,
})).filter(star => star.left < 14 || star.left > 86 || star.top > 92 || star.top < 6 || (star.top > 52 && star.top < 66));

function formatDate(at: number): string {
  try {
    return new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(at));
  } catch {
    return '';
  }
}

function Sparkle({ size = 10, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className={className}>
      <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" fill="currentColor" />
    </svg>
  );
}

/**
 * 📜 상담 카드: 상담이 끝났을 때 한 장으로 남긴다. 인스타·카톡에 올리기 좋은 4:5 한 장.
 * 날짜 · 깊이 · 고민 · 핵심 3줄 · 루시가 남기는 한마디.
 */
export function LucyMasterSessionCard({ source, onClose }: { source: MasterSessionCardSource; onClose: () => void }) {
  const [content, setContent] = useState<MasterSessionCardContent | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const [saving, setSaving] = useState(false);
  const [scale, setScale] = useState(1);
  const frameRef = useRef<HTMLDivElement | null>(null);
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

  // Preview scales the fixed-size card to the available width; the saved image stays 1080×1350.
  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const update = () => setScale(Math.min(1.15, frame.clientWidth / CARD_W));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const save = useCallback(async () => {
    if (!cardRef.current || saving) return;
    setSaving(true);
    try {
      await document.fonts?.ready;
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 3, cacheBust: true, width: CARD_W, height: CARD_H, style: { transform: 'none' } });
      const fileName = `lucy-master-${new Date(source.endedAt).toISOString().slice(0, 10)}.png`;
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], fileName, { type: 'image/png' });
      const nav = navigator as Navigator & { canShare?: (data: { files: File[] }) => boolean };
      if (nav.share && nav.canShare?.({ files: [file] })) {
        await nav.share({ files: [file], title: '루시와의 상담 카드', text: '오늘 루시와 나눈 상담 🔮' });
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
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 pt-4 pb-36 bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="상담 카드"
          data-lucy-master-session-card
          initial={{ opacity: 0, y: 14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25 }}
          onClick={event => event.stopPropagation()}
          className="w-full max-w-[400px] flex flex-col items-center gap-3"
        >
          <div ref={frameRef} className="w-full flex justify-center" style={{ height: CARD_H * scale }}>
            <div style={{ width: CARD_W, height: CARD_H, transform: `scale(${scale})`, transformOrigin: 'top center', borderRadius: 28, overflow: 'hidden', boxShadow: '0 24px 60px rgba(76,29,149,0.5)' }}>
              {/* The card itself (saved as the image) */}
              <div
                ref={cardRef}
                data-session-card-image
                className="relative overflow-hidden text-white"
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  background: 'radial-gradient(120% 80% at 50% -10%, #5b2a9a 0%, #2a1252 38%, #150a2e 70%, #0b0618 100%)',
                }}
              >
                {/* Stars */}
                {STARS.map((star, i) => (
                  <span key={i} className="absolute rounded-full bg-white" style={{ left: `${star.left}%`, top: `${star.top}%`, width: star.size, height: star.size, opacity: star.opacity }} />
                ))}
                {/* Candle glow at the bottom and a soft halo at the top */}
                <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: 'radial-gradient(60% 100% at 50% 100%, rgba(251,191,36,0.22) 0%, rgba(251,191,36,0) 70%)' }} />
                <div className="absolute left-1/2 top-[-60px] h-48 w-48 -translate-x-1/2 rounded-full" style={{ background: 'radial-gradient(circle, rgba(216,180,254,0.28) 0%, rgba(216,180,254,0) 70%)' }} />
                {/* Crescent moon */}
                <svg viewBox="0 0 40 40" width="30" height="30" className="absolute right-6 top-6" aria-hidden="true">
                  <defs>
                    <linearGradient id="card-moon" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#fef3c7" />
                      <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                  </defs>
                  <path d="M26 4 A16 16 0 1 0 36 30 A13 13 0 1 1 26 4 Z" fill="url(#card-moon)" opacity="0.9" />
                </svg>
                {/* Gold double frame */}
                <div className="absolute inset-[10px] rounded-[22px]" style={{ border: '1px solid rgba(253,230,138,0.45)' }} />
                <div className="absolute inset-[14px] rounded-[19px]" style={{ border: '1px solid rgba(253,230,138,0.18)' }} />

                <div className="relative flex h-full flex-col px-8 pt-8 pb-6">
                  {/* Header */}
                  <div className="text-center">
                    <p className="text-[9px] font-bold tracking-[0.42em] text-amber-200/90">LUCY MASTER</p>
                    <div className="mt-1.5 flex items-center justify-center gap-2 text-[10px] text-violet-200/80">
                      <span>{formatDate(source.endedAt)}</span>
                      <span className="text-amber-200/50">·</span>
                      <span className="inline-flex items-center gap-[3px]">
                        {[1, 2, 3].map(level => (
                          <span key={level} className="inline-block h-[5px] w-[5px] rounded-full" style={{ background: level <= source.depth ? '#fcd34d' : 'rgba(255,255,255,0.22)' }} />
                        ))}
                        <span className="ml-1">{DEPTH_NAME[source.depth]}</span>
                      </span>
                    </div>
                  </div>

                  {/* Concern */}
                  {concern && (
                    <p className="mt-4 text-center text-[14px] leading-snug text-white break-keep" style={{ fontFamily: SERIF, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      “{concern}”
                    </p>
                  )}

                  <div className="my-3.5 flex items-center justify-center gap-2 text-amber-200/70">
                    <span className="h-px w-14 bg-gradient-to-r from-transparent to-amber-200/50" />
                    <Sparkle size={9} />
                    <span className="h-px w-14 bg-gradient-to-l from-transparent to-amber-200/50" />
                  </div>

                  {status === 'ready' && content ? (
                    <>
                      <ul className="space-y-2">
                        {content.lines.map((line, index) => (
                          <li key={index} className="flex items-baseline gap-2.5">
                            <span className="shrink-0 w-10 text-[10px] font-bold tracking-wide text-amber-200/90">{LINE_LABELS[index]}</span>
                            <span className="text-[12px] leading-[1.55] text-white/95 break-keep">{line}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Lucy's word */}
                      <div className="flex flex-1 flex-col items-center justify-center pt-3 text-center">
                        <svg viewBox="0 0 24 32" width="16" height="22" aria-hidden="true" className="mb-2">
                          <defs>
                            <radialGradient id="card-flame" cx="50%" cy="60%" r="60%">
                              <stop offset="0%" stopColor="#fff7d6" />
                              <stop offset="55%" stopColor="#fcd34d" />
                              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                            </radialGradient>
                          </defs>
                          <path d="M12 1 C16 9 20 13 20 20 A8 8 0 0 1 4 20 C4 14 9 10 12 1 Z" fill="url(#card-flame)" />
                        </svg>
                        <p className="text-[9px] font-bold tracking-[0.3em] text-amber-200/80">루시가 남기는 한마디</p>
                        <p className="mt-2 text-[15.5px] leading-[1.6] text-amber-50 break-keep" style={{ fontFamily: SERIF, textShadow: '0 0 18px rgba(251,191,36,0.35)' }}>
                          {content.word}
                        </p>
                      </div>
                    </>
                  ) : status === 'loading' ? (
                    <div className="flex flex-1 flex-col items-center justify-center" role="status">
                      <motion.p className="text-3xl" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: Infinity }}>🕯️</motion.p>
                      <p className="mt-2 text-xs text-violet-100/80">루시가 오늘 상담을 한 장에 담고 있어요…</p>
                    </div>
                  ) : (
                    <div className="flex flex-1 items-center justify-center">
                      <p className="text-xs text-violet-100/85">카드를 만들지 못했어요. 다시 시도해 주세요.</p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-center gap-1.5 text-[9px] tracking-[0.25em] text-white/45">
                    <Sparkle size={7} className="text-amber-200/60" />
                    <span>LUCKY · 루시의 상담 카드</span>
                    <Sparkle size={7} className="text-amber-200/60" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions (not part of the saved image) */}
          <div className="flex w-full max-w-[360px] gap-2">
            {status === 'error' ? (
              <button type="button" onClick={() => setAttempt(value => value + 1)} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950 active:scale-95">
                <RotateCcw size={15} /> 다시 만들기
              </button>
            ) : (
              <button type="button" disabled={status !== 'ready' || saving} onClick={save} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950 disabled:opacity-50 active:scale-95">
                <Download size={15} /> {saving ? '저장 중…' : '저장 · 공유하기'}
              </button>
            )}
            <button type="button" onClick={onClose} aria-label="상담 카드 닫기" className="inline-flex items-center justify-center gap-1 rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-bold text-white active:scale-95">
              <X size={15} /> 닫기
            </button>
          </div>
          <p className="text-[11px] text-white/60">인스타·카톡에 올리기 좋은 4:5 크기로 저장돼요</p>
        </motion.div>
      </div>
    </ScreenPortal>
  );
}

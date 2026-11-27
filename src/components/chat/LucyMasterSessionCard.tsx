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

// 루시프로는 단계 없는 통합 상담이라 카드에도 깊이 대신 이름을 적는다.
const SESSION_LABEL = '루시프로 통합 상담';
const LINE_LABELS = ['지금', '방향', '해볼 일'];
// 4:5 portrait — Instagram feed size (1080×1350 at 3×), also fine for KakaoTalk.
const CARD_W = 360;
const CARD_H = 450;
const SERIF = '"Noto Serif KR", "Playfair Display", Georgia, serif';
const SANS = '"Noto Sans KR", "SUIT Variable", system-ui, sans-serif';
const CORMORANT = '"Cormorant Garamond", "Playfair Display", Georgia, serif';
const CINZEL = 'Cinzel, "Playfair Display", Georgia, serif';

export type SessionCardTheme = 'arch' | 'pastel' | 'stellar';
const THEMES: { id: SessionCardTheme; label: string; swatch: string }[] = [
  { id: 'arch', label: '아치', swatch: 'linear-gradient(135deg,#fffaf1,#ecdcc4)' },
  { id: 'pastel', label: '파스텔', swatch: 'linear-gradient(135deg,#ffd9e8,#e6d4ff,#c9e4ff)' },
  { id: 'stellar', label: '별자리', swatch: 'radial-gradient(circle,#1b2b5e,#05081a)' },
];
const THEME_KEY = 'lucy_session_card_theme';

function readTheme(): SessionCardTheme {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === 'pastel' || saved === 'stellar' || saved === 'arch' ? saved : 'arch';
  } catch {
    return 'arch';
  }
}

function formatDate(at: number, dotted = false): string {
  try {
    const parts = new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(at));
    const get = (type: string) => parts.find(part => part.type === type)?.value || '';
    return dotted ? `${get('year')}.${get('month')}.${get('day')}` : `${get('year')}. ${get('month')}. ${get('day')}`;
  } catch {
    return '';
  }
}

interface FaceProps {
  endedAt: number;
  concern: string;
  status: 'loading' | 'ready' | 'error';
  content: MasterSessionCardContent | null;
}

function Placeholder({ status, color }: { status: FaceProps['status']; color: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center" role="status" style={{ color }}>
      {status === 'loading' ? (
        <>
          <motion.p className="text-3xl" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: Infinity }}>🕯️</motion.p>
          <p className="mt-2 text-xs">루시가 오늘 상담을 한 장에 담고 있어요…</p>
        </>
      ) : (
        <p className="text-xs">카드를 만들지 못했어요. 다시 시도해 주세요.</p>
      )}
    </div>
  );
}

const clamp2 = { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' };

/** A · 아이보리 아치: 크림 바탕, 금색 아치 테두리, 달 문양. */
function ArchFace({ endedAt, concern, status, content }: FaceProps) {
  return (
    <div className="relative h-full w-full" style={{ background: 'radial-gradient(120% 90% at 50% 0%, #fffaf1 0%, #f6ecdc 60%, #ecdcc4 100%)', color: '#3a2e26', fontFamily: SANS, wordBreak: 'keep-all' }}>
      <div className="absolute" style={{ inset: 18, border: '1px solid #b8925a', borderRadius: '150px 150px 10px 10px' }} />
      <div className="absolute" style={{ inset: 23, border: '1px solid rgba(184,146,90,0.35)', borderRadius: '145px 145px 7px 7px' }} />
      <div className="relative flex h-full flex-col items-center px-12 pt-12 pb-9 text-center">
        <svg viewBox="0 0 48 48" width="42" height="42" aria-hidden="true">
          <circle cx="24" cy="24" r="21" fill="none" stroke="#b8925a" strokeWidth="0.8" />
          <path d="M30 10a14 14 0 1 0 8 20 11 11 0 1 1-8-20z" fill="#c9a26a" />
          <circle cx="12" cy="14" r="1" fill="#b8925a" />
          <circle cx="38" cy="38" r="1.2" fill="#b8925a" />
        </svg>
        <p className="mt-2" style={{ fontFamily: CORMORANT, letterSpacing: '0.35em', fontSize: 11, color: '#9a7445' }}>LUCY MASTER</p>
        <p className="mt-0.5" style={{ fontSize: 9.5, color: '#9b8a78', letterSpacing: '0.05em' }}>{formatDate(endedAt)} · {SESSION_LABEL}</p>
        {concern && <p className="mt-3" style={{ fontFamily: SERIF, fontSize: 13.5, lineHeight: 1.5, ...clamp2 }}>“{concern}”</p>}
        <p className="my-2.5" style={{ color: '#b8925a', fontSize: 9, letterSpacing: '0.6em' }}>✦ ✦ ✦</p>
        {status === 'ready' && content ? (
          <>
            <ul className="w-full space-y-1.5 text-left">
              {content.lines.map((line, index) => (
                <li key={index} className="flex gap-2.5" style={{ fontSize: 11.2, lineHeight: 1.5 }}>
                  <span className="shrink-0" style={{ width: 14, fontFamily: CORMORANT, fontStyle: 'italic', color: '#9a7445', fontSize: 13 }}>{['i', 'ii', 'iii'][index]}</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-2">
              <p style={{ fontSize: 8.5, letterSpacing: '0.3em', color: '#a8916f' }}>루시가 남기는 한마디</p>
              <p className="mt-1.5" style={{ fontFamily: SERIF, fontSize: 14.5, lineHeight: 1.6, color: '#5b3d22' }}>{content.word}</p>
            </div>
          </>
        ) : <Placeholder status={status} color="#8a7458" />}
        <p className="mt-2.5" style={{ fontFamily: CORMORANT, fontSize: 10, letterSpacing: '0.3em', color: '#b09a7c' }}>— LUCKY —</p>
      </div>
    </div>
  );
}

/** B · 파스텔 그라데이션: 루시의 한마디를 크게. */
function PastelFace({ endedAt, concern, status, content }: FaceProps) {
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: 'linear-gradient(160deg, #ffd9e8 0%, #e6d4ff 45%, #c9e4ff 100%)', color: '#2d2440', fontFamily: SANS, wordBreak: 'keep-all' }}>
      <div className="absolute rounded-full" style={{ width: 240, height: 240, right: -70, top: -80, background: 'radial-gradient(circle, rgba(255,243,176,0.85) 0%, rgba(255,243,176,0) 70%)' }} />
      <div className="absolute rounded-full" style={{ width: 240, height: 240, left: -90, bottom: 40, background: 'radial-gradient(circle, rgba(255,179,209,0.7) 0%, rgba(255,179,209,0) 70%)' }} />
      <div className="relative flex h-full flex-col px-[30px] pt-[34px] pb-[26px]">
        <div className="flex justify-between" style={{ fontSize: 10, letterSpacing: '0.15em', color: '#6b5a8a' }}>
          <span>LUCY MASTER ☾</span>
          <span>{formatDate(endedAt, true)}</span>
        </div>
        {status === 'ready' && content ? (
          <>
            <p className="mt-9" style={{ fontFamily: SERIF, fontWeight: 600, fontSize: content.word.length > 34 ? 19 : 22, lineHeight: 1.55, letterSpacing: '-0.01em' }}>{content.word}</p>
            {concern && <p className="mt-3.5" style={{ fontSize: 10.5, color: '#6b5a8a', ...clamp2 }}>— “{concern}”에 대한 루시의 한마디</p>}
            <div className="mt-auto rounded-[18px] px-[15px] py-[12px]" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.75)' }}>
              {content.lines.map((line, index) => (
                <p key={index} className="flex" style={{ fontSize: 10.8, lineHeight: 1.5, margin: '3px 0', color: '#3d3354' }}>
                  <span className="shrink-0" style={{ width: 42, fontWeight: 500, color: '#8b6fc0', fontSize: 10 }}>{LINE_LABELS[index]}</span>
                  <span>{line}</span>
                </p>
              ))}
            </div>
          </>
        ) : <Placeholder status={status} color="#6b5a8a" />}
        <p className="mt-3 text-center" style={{ fontSize: 9, letterSpacing: '0.3em', color: '#7d6c9c' }}>
          LUCKY · 루시프로
        </p>
      </div>
    </div>
  );
}

/** C · 딥네이비 별자리: 별 나침반 문양, 오로라 빛 글씨. */
function StellarFace({ endedAt, concern, status, content }: FaceProps) {
  const aurora = 'linear-gradient(90deg, #ffe7a3, #ffd1f0, #b9e9ff)';
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: 'radial-gradient(90% 60% at 50% 38%, #1b2b5e 0%, #0b1230 55%, #05081a 100%)', color: '#e8ecff', fontFamily: SANS, wordBreak: 'keep-all' }}>
      <svg viewBox="0 0 190 190" width="190" height="190" aria-hidden="true" className="absolute" style={{ left: '50%', top: 160, transform: 'translate(-50%, -50%)', opacity: 0.85 }}>
        <defs>
          <linearGradient id="stellar-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#c7b7ff" />
            <stop offset=".5" stopColor="#ffe7a3" />
            <stop offset="1" stopColor="#9ee7ff" />
          </linearGradient>
        </defs>
        <circle cx="95" cy="95" r="88" fill="none" stroke="url(#stellar-ring)" strokeWidth="0.8" />
        <circle cx="95" cy="95" r="76" fill="none" stroke="url(#stellar-ring)" strokeWidth="0.4" strokeDasharray="2 4" />
        <path d="M95 7 L101 89 L183 95 L101 101 L95 183 L89 101 L7 95 L89 89 Z" fill="none" stroke="url(#stellar-ring)" strokeWidth="0.5" opacity="0.5" />
        <path d="M95 30 L99 91 L160 95 L99 99 L95 160 L91 99 L30 95 L91 91 Z" fill="none" stroke="url(#stellar-ring)" strokeWidth="0.4" opacity="0.35" transform="rotate(45 95 95)" />
      </svg>
      <div className="relative flex h-full flex-col items-center px-7 pt-[26px] pb-5 text-center">
        <p style={{ fontFamily: CINZEL, fontSize: 12, letterSpacing: '0.4em', color: '#e9dcff' }}>LUCY MASTER</p>
        <p className="mt-1" style={{ fontSize: 9, color: '#8f9bd0', letterSpacing: '0.1em' }}>{formatDate(endedAt, true)} · LUCY PRO</p>
        <div className="flex items-center justify-center" style={{ height: 170, marginTop: 8 }}>
          {concern && <p style={{ fontFamily: SERIF, fontSize: 12.5, lineHeight: 1.5, color: '#fff', maxWidth: 150, textShadow: '0 0 12px #05081a', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>“{concern}”</p>}
        </div>
        {status === 'ready' && content ? (
          <>
            <div className="mt-1.5 w-full text-left">
              {content.lines.map((line, index) => (
                <p key={index} style={{ fontSize: 10.8, lineHeight: 1.5, margin: '5px 0', color: '#d5dcff', paddingLeft: 12, borderLeft: '2px solid rgba(158,231,255,0.5)' }}>{line}</p>
              ))}
            </div>
            <div className="mt-auto">
              <p style={{ fontSize: 8.5, letterSpacing: '0.3em', color: '#8f9bd0' }}>루시가 남기는 한마디</p>
              <p className="mt-1.5" style={{ fontFamily: SERIF, fontSize: 14, lineHeight: 1.6, color: '#ffe7f3', backgroundImage: aurora, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{content.word}</p>
            </div>
          </>
        ) : <Placeholder status={status} color="#aab4e6" />}
        <p className="mt-2.5" style={{ fontFamily: CINZEL, fontSize: 9, letterSpacing: '0.4em', color: '#6e7aa8' }}>LUCKY</p>
      </div>
    </div>
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
  const [theme, setTheme] = useState<SessionCardTheme>(() => readTheme());
  const chooseTheme = (next: SessionCardTheme) => {
    setTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch { /* storage optional */ }
  };
  const frameRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const concern = masterSessionConcern(source.messages);
  const faceProps: FaceProps = { endedAt: source.endedAt, concern, status, content };

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
            <div style={{ width: CARD_W, height: CARD_H, transform: `scale(${scale})`, transformOrigin: 'top center', borderRadius: 22, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.45)' }}>
              {/* The card itself (saved as the image) */}
              <div ref={cardRef} data-session-card-image data-session-card-theme={theme} className="relative overflow-hidden" style={{ width: CARD_W, height: CARD_H }}>
                {theme === 'pastel' ? <PastelFace {...faceProps} /> : theme === 'stellar' ? <StellarFace {...faceProps} /> : <ArchFace {...faceProps} />}
              </div>
            </div>
          </div>

          {/* Style picker */}
          <div className="flex items-center gap-2" role="radiogroup" aria-label="카드 스타일">
            {THEMES.map(item => (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={theme === item.id}
                data-session-card-theme-option={item.id}
                onClick={() => chooseTheme(item.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${theme === item.id ? 'border-amber-300 bg-white/20 text-white' : 'border-white/20 bg-white/5 text-white/75'}`}
              >
                <span className="inline-block h-3.5 w-3.5 rounded-full border border-white/40" style={{ background: item.swatch }} />
                {item.label}
              </button>
            ))}
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

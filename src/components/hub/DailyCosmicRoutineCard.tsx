import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Sun, Palette, Quote, ChevronDown, Check, Music, X } from 'lucide-react';
import { pickDailySeededItem, getDateSeed, getTodayDateKey } from '@/lib/dailyCache';
import { TAROT_DECK, getTarotCardImageUrl, type TarotCard } from '@/data/tarotData';
import { getTarotCardDetails, getTarotLuckyAction } from '@/lib/dailyTarotOracle';
import { MUSE_ART_CATALOG } from '@/lib/museDailyArt';
import {
  buildAppleMusicClassicalSearchUrl,
  resolveAppleMusicClassicalEmbedUrl,
} from '@/components/muse/MuseSongAppleMusicPlayer';
import { COSMIC_MORNING_AFFIRMATIONS } from '@/data/cosmicMorningAffirmations';
import { TarotCardBackFace } from '@/components/trinity/TarotCardBackFace';
import { useTarotCardBack } from '@/hooks/useTarotCardBack';

type RoutineStepId = 'fortune' | 'art' | 'affirm';

const DONE_STORAGE_KEY = 'cosmic_morning_routine_done';

const YoutubeIcon = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path
      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
      fill="#FF0000"
    />
  </svg>
);

function readTodayDone(): RoutineStepId[] {
  try {
    const raw = localStorage.getItem(DONE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { date?: string; done?: RoutineStepId[] };
    if (parsed?.date !== getTodayDateKey() || !Array.isArray(parsed?.done)) return [];
    return parsed.done.filter((id): id is RoutineStepId => id === 'fortune' || id === 'art' || id === 'affirm');
  } catch {
    return [];
  }
}

function writeTodayDone(done: RoutineStepId[]) {
  try {
    localStorage.setItem(DONE_STORAGE_KEY, JSON.stringify({ date: getTodayDateKey(), done }));
  } catch {
    /* storage unavailable — 루틴은 세션 안에서만 유지 */
  }
}

interface RoutineStep {
  id: RoutineStepId;
  no: number;
  icon: React.ElementType;
  label: string;
  tagline: string;
  accent: string;
}

const STEPS: RoutineStep[] = [
  { id: 'fortune', no: 1, icon: Sparkles, label: '오늘의 운세 카드', tagline: '데일리 타로 1장 즉시 뽑기', accent: 'oklch(0.85 0.15 90)' },
  { id: 'art', no: 2, icon: Palette, label: '오늘의 예술 1분', tagline: '명화 감상 + Apple Music Classical', accent: 'oklch(0.72 0.16 250)' },
  { id: 'affirm', no: 3, icon: Quote, label: '오늘의 코스믹 확언', tagline: '하루를 지탱할 한 줄 격려', accent: 'oklch(0.75 0.15 160)' },
];

/**
 * ✨ 데일리 코스믹 모닝 루틴 허브 카드
 * 앱을 켜자마자 한 화면에서 3분 만에 하루를 여는 원클릭 데일리 진입점.
 * 모든 콘텐츠가 로컬 데이터(타로 덱 · 명화 카탈로그 · 확언 모음)를 날짜 시드로
 * 결정적으로 뽑기 때문에 오프라인에서도 네트워크 없이 즉시 동작합니다.
 */
export function DailyCosmicRoutineCard() {
  // ── 오늘의 카드 · 명화 · 확언 (날짜 기준 결정적 선택 → 하루 동안 동일, 오프라인 OK)
  const fortune = useMemo(() => {
    const base = pickDailySeededItem(TAROT_DECK, 'cosmic_morning_card');
    const reversed = getDateSeed('cosmic_morning_rev') % 5 < 2; // 약 40% 역방향
    const card: TarotCard = { ...base, reversed };
    const details = getTarotCardDetails(card);
    return {
      card,
      keywords: card.keywords.slice(0, 3).join(' · '),
      meaning: card.reversed ? details.reversedCore : details.uprightCore,
      action: getTarotLuckyAction(card, card.reversed),
      imageUrl: getTarotCardImageUrl(card),
    };
  }, []);

  const art = useMemo(() => {
    const entry = pickDailySeededItem(MUSE_ART_CATALOG, 'cosmic_morning_art');
    const song = entry.famousSong;
    const musicUrl =
      song?.appleMusicClassicalUrl?.trim() ||
      buildAppleMusicClassicalSearchUrl(song?.title || entry.title, song?.artistOriginal || song?.artist);
    const embedUrl = resolveAppleMusicClassicalEmbedUrl(musicUrl);
    const ytQuery = [entry.creator, entry.title].filter(Boolean).join(' ');
    const ytArtworkSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(ytQuery)}`;
    return { entry, song, musicUrl, embedUrl, ytArtworkSearchUrl };
  }, []);

  const affirmation = useMemo(
    () => pickDailySeededItem(COSMIC_MORNING_AFFIRMATIONS, 'cosmic_morning_affirmation'),
    [],
  );

  // ── 완료 상태 (오늘 하루 로컬 저장)
  const [done, setDone] = useState<RoutineStepId[]>(() => readTodayDone());
  useEffect(() => {
    writeTodayDone(done);
  }, [done]);

  const markDone = useCallback((id: RoutineStepId) => {
    setDone((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const [openStep, setOpenStep] = useState<RoutineStepId | null>(null);
  const allDone = done.length >= STEPS.length;

  const { cardBackId } = useTarotCardBack();
  const [isFortuneFlipped, setIsFortuneFlipped] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);

  const handleCardFlip = useCallback(() => {
    setIsFortuneFlipped((prev) => {
      const next = !prev;
      if (next) {
        markDone('fortune');
      }
      return next;
    });
  }, [markDone]);

  const toggleStep = (id: RoutineStepId) => {
    const next = openStep === id ? null : id;
    setOpenStep(next);
    if (next && id !== 'fortune') markDone(id);
  };

  // 이미지 로드 실패(오프라인 등) 시 그라디언트 폴백
  const [artImageFailed, setArtImageFailed] = useState(false);
  const [cardImageFailed, setCardImageFailed] = useState(false);
  const [imageRetryTick, setImageRetryTick] = useState(0);

  const stepPanel = (id: RoutineStepId) => {
    if (id === 'fortune') {
      return (
        <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-stretch">
          {/* 🌟 3D 뒤집기 카드 (처음에는 뒷면만 노출, 탭 시 3D 회전하며 앞면 공개) */}
          <div className="flex flex-col items-center shrink-0">
            <div
              style={{ perspective: 1000 }}
              className="relative w-28 h-44 sm:w-32 sm:h-52 cursor-pointer select-none"
              onClick={handleCardFlip}
              onMouseEnter={() => setIsCardHovered(true)}
              onMouseLeave={() => setIsCardHovered(false)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardFlip();
                }
              }}
              title={isFortuneFlipped ? '카드를 다시 덮으려면 터치하세요' : '터치하여 오늘의 운세 카드를 뒤집으세요'}
            >
              <motion.div
                animate={{ rotateY: isFortuneFlipped ? 180 : 0 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  transformStyle: 'preserve-3d',
                  WebkitTransformStyle: 'preserve-3d',
                }}
                className="w-full h-full relative rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.45)] hover:shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-shadow duration-300"
              >
                {/* ── CARD BACK (처음 노출되는 뒷면, rotateY: 0deg) ── */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(0deg)',
                  }}
                  className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-amber-400/30 bg-zinc-950"
                >
                  <TarotCardBackFace cardBackId={cardBackId} isHovered={isCardHovered} size="md" />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* ── CARD FRONT (뒤집혔을 때 노출되는 앞면, rotateY: 180deg) ── */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                  className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-amber-300/35 bg-gradient-to-b from-amber-500/15 to-indigo-950/40 shadow-[0_0_24px_rgba(245,158,11,0.2)]"
                >
                  {!cardImageFailed && fortune.imageUrl ? (
                    <img
                      key={imageRetryTick}
                      src={fortune.imageUrl}
                      alt={fortune.card.nameKo}
                      className={`w-full h-full object-cover ${fortune.card.reversed ? 'rotate-180' : ''}`}
                      onError={() => setCardImageFailed(true)}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Sparkles size={28} className="text-amber-300/80" />
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* 카드 탭 안내 힌트 */}
            <button
              type="button"
              onClick={handleCardFlip}
              className="mt-2 text-[11px] font-medium text-amber-300/80 hover:text-amber-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Sparkles size={11} className={isFortuneFlipped ? '' : 'animate-spin'} />
              {isFortuneFlipped ? '다시 덮기' : '탭하여 카드 뒤집기 👆'}
            </button>
          </div>

          {/* ── 운세 설명 영역 ── */}
          <div className="flex-1 min-w-0 flex flex-col justify-center text-left">
            {!isFortuneFlipped ? (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 py-1"
              >
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30 tracking-wider">
                    STEP 1 · CARD REVEAL
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white tracking-tight break-keep">
                  오늘 하루를 인도할 코스믹 카드가 도착했습니다 ✨
                </h4>
                <p className="text-[12px] leading-relaxed text-white/65 break-keep">
                  카드를 직접 터치해 뒤집어 보세요. 오늘 당신의 의식과 공명하는 데일리 타로의 핵심 키워드와 행운의 행동 지침이 공개됩니다.
                </p>
                <div>
                  <button
                    type="button"
                    onClick={handleCardFlip}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/25 to-yellow-500/20 border border-amber-400/40 text-amber-200 text-[12px] font-bold hover:bg-amber-500/35 active:scale-95 transition-all shadow-[0_0_16px_rgba(245,158,11,0.2)] cursor-pointer"
                  >
                    <Sparkles size={13} className="text-amber-300" />
                    카드 뒤집어서 확인하기 ↗
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-2.5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base sm:text-lg font-extrabold text-amber-200 tracking-wide">{fortune.card.nameKo}</span>
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">{fortune.card.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${fortune.card.reversed ? 'text-rose-300 border-rose-400/30 bg-rose-500/10' : 'text-emerald-300 border-emerald-400/30 bg-emerald-500/10'}`}>
                    {fortune.card.reversed ? '역방향' : '정방향'}
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-indigo-300/90">{fortune.keywords}</p>
                <p className="text-[13px] leading-relaxed text-white/85 font-medium break-keep">{fortune.meaning}</p>
                <div className="rounded-xl bg-amber-500/10 border border-amber-400/20 px-3 py-2">
                  <p className="text-[12px] leading-relaxed text-amber-200/95 font-medium break-keep">
                    <Sun size={11} className="inline mr-1 -mt-0.5 text-amber-400" />
                    {fortune.action}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      );
    }

    if (id === 'art') {
      return (
        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          <div className="relative w-full sm:w-44 h-40 sm:h-44 shrink-0 rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-br from-indigo-950/60 to-purple-950/40">
            {!artImageFailed && art.entry.imageUrl ? (
              <img
                key={imageRetryTick}
                src={art.entry.imageUrl}
                alt={art.entry.title}
                className="w-full h-full object-cover"
                onError={() => setArtImageFailed(true)}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Palette size={26} className="text-indigo-300/70" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 space-y-2.5 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-extrabold text-indigo-200 tracking-wide">{art.entry.title}</span>
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">{art.entry.titleOriginal}</span>
            </div>
            <p className="text-[11px] font-semibold text-indigo-300/90">{art.entry.creator} · {art.entry.era}</p>
            <p className="text-[13px] leading-relaxed text-white/85 font-medium break-keep line-clamp-3">{art.entry.description}</p>
            <p className="text-[11px] italic text-white/55 leading-relaxed break-keep">"{art.entry.quote}"</p>
            <div className="pt-2 space-y-2">
              {art.song ? (
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/70">
                  <Music size={12} className="text-indigo-400" />
                  <span>{art.song.titleOriginal || art.song.title} · {art.song.artist}</span>
                </div>
              ) : null}
              <div className="flex flex-wrap items-center gap-2">
                {/* 🔴 YouTube 해당 작품 검색 연동 버튼 */}
                <a
                  href={art.ytArtworkSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/20 border border-red-500/40 text-[11px] font-bold text-red-200 hover:bg-red-600/30 transition-all cursor-pointer shadow-[0_0_12px_rgba(239,68,68,0.2)] active:scale-95"
                  title={`${art.entry.creator} - ${art.entry.title} YouTube에서 검색`}
                >
                  <YoutubeIcon size={13} />
                  YouTube에서 작품 검색 ↗
                </a>

                {/* 🍎 Apple Music Classical 연동 버튼 */}
                {art.song ? (
                  <a
                    href={art.embedUrl || art.musicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-400/30 text-[11px] font-bold text-rose-200 hover:bg-rose-500/25 transition-all cursor-pointer active:scale-95"
                  >
                    <Music size={12} />
                    명곡 Apple Music ↗
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 border border-emerald-400/20 px-5 py-5 text-left space-y-2.5">
        <p className="text-base sm:text-lg font-extrabold leading-relaxed text-emerald-100 break-keep">
          "{affirmation.text}"
        </p>
        <p className="text-[12px] leading-relaxed text-emerald-200/75 font-medium break-keep">{affirmation.sub}</p>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="glass relative rounded-[28px] border border-white/15 shadow-2xl overflow-hidden group"
      data-cosmic-routine-card
    >
      {/* 배경 글로우 */}
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full blur-[80px] opacity-20 pointer-events-none bg-amber-400" />
      <div className="absolute -bottom-20 -right-10 w-56 h-56 rounded-full blur-[80px] opacity-15 pointer-events-none bg-indigo-500" />

      <div className="relative z-10 p-5 sm:p-6 md:p-7 space-y-4">
        {/* 헤더 */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-amber-300/90 uppercase tracking-[0.25em] font-mono">DAILY COSMIC ROUTINE</span>
              {allDone && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 uppercase tracking-wider">
                  오늘의 루틴 완료 ✨
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight break-keep">
              ✨ 오늘의 3분 모닝 루틴
            </h3>
            <p className="text-[11px] text-white/55 mt-0.5">
              아침에 일어나 딱 3분, 세 번의 원클릭으로 하루를 여는 데일리 여정
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {STEPS.map((s) => {
              const isDone = done.includes(s.id);
              return (
                <div
                  key={s.id}
                  title={s.label}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-300 ${
                    isDone
                      ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                      : 'bg-white/5 border-white/15 text-white/40'
                  }`}
                >
                  {isDone ? <Check size={12} /> : s.no}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3단계 스텝 버튼 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isOpen = openStep === s.id;
            const isDone = done.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleStep(s.id)}
                className={`relative text-left rounded-2xl px-4 py-3.5 border transition-all duration-300 cursor-pointer overflow-hidden active:scale-[0.98] ${
                  isOpen
                    ? 'border-white/35 bg-white/[0.09] shadow-[0_0_20px_rgba(255,255,255,0.08)]'
                    : 'border-white/12 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/25'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-white/15"
                    style={{ background: `${s.accent}18` }}
                  >
                    <Icon size={16} style={{ color: s.accent, filter: `drop-shadow(0 0 6px ${s.accent})` }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold font-mono uppercase tracking-widest text-white/40">STEP {s.no}</span>
                      {isDone && <Check size={11} className="text-emerald-400" />}
                    </div>
                    <div className="text-[13px] font-bold text-white truncate">{s.label}</div>
                    <div className="text-[10px] text-white/50 truncate">{s.tagline}</div>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-white/40 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* 펼쳐진 스텝 콘텐츠 */}
        <AnimatePresence mode="wait">
          {openStep && (
            <motion.div
              key={openStep}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="rounded-2xl bg-black/20 border border-white/10 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] font-mono">
                    {STEPS.find((s) => s.id === openStep)?.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpenStep(null)}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    title="접기"
                  >
                    <X size={12} />
                  </button>
                </div>
                {stepPanel(openStep)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 푸터: 진행 상태 */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <span className="text-[10px] text-white/40 font-mono tracking-wider">
            {getTodayDateKey()} · {done.length}/3 COMPLETE
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default DailyCosmicRoutineCard;

import { TarotCardBackFace } from '@/components/trinity/TarotCardBackFace';
import { useTarotCardBack } from '@/hooks/useTarotCardBack';
import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Sparkles, ZoomIn, X, RotateCcw } from 'lucide-react';
import { DetectedTarotCard } from '@/utils/tarotDetector';

interface LucyTarotCardViewProps {
  cards: DetectedTarotCard[];
  isLight?: boolean;
  verifiedDraw?: boolean;
  revealedCardIds?: string[];
  onRevealCard?: (cardId: string) => void;
}

export const LucyTarotCardView: React.FC<LucyTarotCardViewProps> = ({ cards, isLight = false, verifiedDraw = false, revealedCardIds = [], onRevealCard }) => {
  const { cardBackId } = useTarotCardBack();
  const reducedMotion = useReducedMotion();
  const [zoomedCard, setZoomedCard] = useState<DetectedTarotCard | null>(null);

  if (!cards || cards.length === 0) return null;

  return (
    <>
      <div className="w-full my-2.5">
        <div className="flex items-center gap-1.5 mb-2 px-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
          <Sparkles size={13} className="animate-spin text-amber-500" />
          <span>{verifiedDraw ? '앱에서 무작위 추첨한 카드' : '답변에 언급된 참고 카드 · 추첨 기록 없음'} ({cards.length}장)</span>
        </div>

        <div className={`flex gap-3 overflow-x-auto pb-2 pt-1 px-1 scrollbar-thin ${
          cards.length === 1 ? 'justify-start' : 'justify-start'
        }`}>
          {cards.map((card, idx) => {
            const isReversed = Boolean(card.reversed);
            const isOpen = !verifiedDraw || revealedCardIds.includes(card.id);
            return (
              <motion.button
                type="button"
                aria-label={isOpen ? `${card.nameKo} ${card.orientationKo} 크게 보기` : `${idx + 1}번째 타로 카드 열기`}
                key={`${card.id}-${idx}`}
                initial={{ opacity: 0, scale: 0.9, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.08 }}
                className={`relative flex flex-col items-center shrink-0 w-36 sm:w-40 rounded-xl p-2 transition-all cursor-pointer group shadow-sm hover:shadow-md border ${
                  isLight
                    ? 'bg-amber-50/70 border-amber-200/90 text-slate-800 hover:border-amber-400'
                    : 'bg-slate-900/80 border-amber-500/30 text-white hover:border-amber-400/60'
                }`}
                onClick={() => isOpen ? setZoomedCard(card) : onRevealCard?.(card.id)}
              >
                {isOpen ? (
                  <motion.div key="front" initial={reducedMotion ? false : { rotateY: -90 }} animate={{ rotateY: 0 }} transition={{ duration: 0.3 }} className="flex flex-col items-center w-full">
                {/* 정/역방향 뱃지 */}
                <div className="w-full flex items-center justify-between mb-1.5 px-0.5">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                    isReversed
                      ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-400/30'
                      : 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/30'
                  }`}>
                    {isReversed && <RotateCcw size={9} />}
                    {card.orientationKo}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-white/40 flex items-center gap-0.5 group-hover:text-amber-500 transition-colors">
                    <ZoomIn size={11} /> 확대
                  </span>
                </div>

                {/* 카드 이미지 컨테이너 (고화질 webp) */}
                <div className="relative w-28 sm:w-32 aspect-[3/5] rounded-lg overflow-hidden border border-amber-300/40 dark:border-amber-500/20 shadow-inner bg-slate-950 flex items-center justify-center">
                  <img
                    src={card.imageUrl}
                    alt={card.displayTitle}
                    loading="eager"
                    fetchPriority="high"
                    className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                      isReversed ? 'rotate-180' : ''
                    }`}
                    onError={(e) => {
                      // Fallback: GitHub raw repo
                      const target = e.currentTarget;
                      if (!target.src.includes('githubusercontent')) {
                        const suit = card.id.startsWith('major_') ? 'm' : card.id.charAt(0);
                        const num = card.id.split('_')[1].padStart(2, '0');
                        target.src = `https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/${suit}${num}.jpg`;
                      }
                    }}
                  />
                  {/* 신비로운 오라 효과 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* 카드 이름 */}
                <div className="mt-2 text-center w-full px-0.5">
                  <div className="text-xs font-bold truncate text-amber-900 dark:text-amber-200">
                    {card.nameKo}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-white/50 truncate font-mono">
                    {card.name}
                  </div>
                </div>

                {/* 키워드 태그 */}
                {card.keywords && card.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5 justify-center">
                    {card.keywords.slice(0, 2).map((kw, kIdx) => (
                      <span
                        key={kIdx}
                        className="text-[9px] px-1 py-0.2 rounded bg-amber-200/50 dark:bg-white/10 text-slate-700 dark:text-white/80"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center w-full gap-2 py-1">
                    <span className="text-xs font-semibold">{idx + 1}번째 카드</span>
                    <div className="relative w-28 sm:w-32 aspect-[3/5] rounded-lg overflow-hidden">
                      <TarotCardBackFace cardBackId={cardBackId} size="sm" className="w-full h-full" />
                    </div>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-300">눌러서 카드 열기</span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 카드 확대 모달 (Zoom Modal) */}
      <AnimatePresence>
        {zoomedCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-sm w-full bg-slate-900 border border-amber-500/40 rounded-2xl p-4 flex flex-col items-center text-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setZoomedCard(null)}
                className="absolute top-3 right-3 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="닫기"
              >
                <X size={18} />
              </button>

              <div className="text-sm font-bold text-amber-300 mb-1">
                {zoomedCard.nameKo} ({zoomedCard.name})
              </div>
              <div className="text-xs text-amber-400/80 mb-3 font-semibold flex items-center gap-1">
                {zoomedCard.reversed && <RotateCcw size={11} />}
                {zoomedCard.orientationKo}
              </div>

              <div className="w-48 aspect-[3/5] rounded-xl overflow-hidden border-2 border-amber-400 shadow-xl bg-black">
                <img
                  src={zoomedCard.imageUrl}
                  alt={zoomedCard.displayTitle}
                  className={`w-full h-full object-cover ${zoomedCard.reversed ? 'rotate-180' : ''}`}
                />
              </div>

              {zoomedCard.keywords && zoomedCard.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
                  {zoomedCard.keywords.map((kw, idx) => (
                    <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30">
                      #{kw}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

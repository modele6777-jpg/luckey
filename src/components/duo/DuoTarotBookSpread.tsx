import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BookOpen, RotateCcw, ArrowRight, Eye, ShieldCheck, Flame, Compass } from 'lucide-react';
import { DetectedTarotCard } from '@/utils/tarotDetector';
import { TarotCardBackFace } from '@/components/trinity/TarotCardBackFace';
import { useTarotCardBack } from '@/hooks/useTarotCardBack';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';

interface DuoTarotBookSpreadProps {
  cards: DetectedTarotCard[];
  verifiedDraw?: boolean;
  revealedCardIds?: string[];
  onRevealCard?: (cardId: string) => void;
  onScrollToReading?: (cardId: string) => void;
  onQuickDraw?: (promptText: string) => void;
  isLight?: boolean;
}

export const DuoTarotBookSpread: React.FC<DuoTarotBookSpreadProps> = ({
  cards,
  verifiedDraw = false,
  revealedCardIds = [],
  onRevealCard,
  onScrollToReading,
  onQuickDraw,
  isLight = false,
}) => {
  const { cardBackId } = useTarotCardBack();
  const [selectedCardIdx, setSelectedCardIdx] = useState<number>(0);

  const hasCards = cards && cards.length > 0;
  const activeCard = hasCards ? cards[selectedCardIdx] || cards[0] : null;

  // 카드별 오행 및 원소 심볼 매핑
  const getCardElement = (type: string, id: string) => {
    if (type === 'wands') return { name: '목(木) · 화(火)', color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/30' };
    if (type === 'cups') return { name: '수(水)', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30' };
    if (type === 'swords') return { name: '금(金)', color: 'text-slate-300', bg: 'bg-slate-500/10 border-slate-400/30' };
    if (type === 'pentacles') return { name: '토(土)', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    // 메이저 아르카나
    return { name: '천체 원형(天體)', color: 'text-purple-300', bg: 'bg-purple-500/10 border-purple-500/30' };
  };

  return (
    <div className={`h-full w-full flex flex-col overflow-y-auto no-scrollbar select-none p-3.5 sm:p-5 transition-colors duration-500 ${
      isLight 
        ? 'bg-gradient-to-br from-[#faf6ee] via-[#f5ede0] to-[#ece3d2] text-slate-800' 
        : 'bg-gradient-to-br from-slate-950 via-[#101424] to-[#0a0d18] text-white'
    }`}>
      {/* 헤더: 책갈피 및 타이틀 */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-400/30">
            <BookOpen size={16} />
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs sm:text-sm font-black tracking-tight text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">
                루시 타로 북스프레드
              </h2>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-500/15 text-amber-300 border border-amber-400/30">
                듀오 펼침 전용
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              책을 펼쳐 카드를 마주하듯 깊이 있는 상징과 해설을 실시간으로 탐색합니다.
            </p>
          </div>
        </div>

        {hasCards && (
          <span className="text-[10px] font-semibold text-amber-500/80 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
            총 {cards.length}장 스프레드
          </span>
        )}
      </div>

      {!hasCards ? (
        /* 카드가 없을 때: 빈 성전 안내 및 원터치 질문 칩 */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center my-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center mb-4 text-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.15)]">
            <Sparkles size={28} className="animate-pulse" />
          </div>
          <h3 className="text-sm font-bold text-amber-300 mb-1.5">
            펼쳐진 타로 성전이 준비되어 있어요
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mb-5 leading-relaxed">
            오른쪽 루시 채팅에서 타로를 질문하시면, 이곳에 고화질 3D 북스프레드가 즉시 펼쳐집니다.
          </p>

          <div className="flex flex-col gap-2 w-full max-w-xs">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('whitehole');
                onQuickDraw?.('오늘 나의 하루를 이끌어줄 3장의 타로 카드를 뽑아서 운세와 행동 조언을 해줘.');
              }}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-200 text-xs font-bold transition-all group cursor-pointer shadow-xs active:scale-98"
            >
              <span className="flex items-center gap-2">
                <span>🔮</span>
                <span>오늘의 3카드 운세 뽑기</span>
              </span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('whitehole');
                onQuickDraw?.('지금 내가 마주한 고민에 대한 과거-현재-미래 타로 스프레드를 봐줘.');
              }}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-white/10 text-slate-300 text-xs font-medium transition-all group cursor-pointer shadow-xs active:scale-98"
            >
              <span className="flex items-center gap-2">
                <span>⏳</span>
                <span>과거·현재·미래 심층 스프레드</span>
              </span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      ) : (
        /* 카드가 있을 때: 3D 책자 스프레드 뷰 */
        <div className="flex-1 flex flex-col gap-3 py-3 min-h-0">
          {/* 상단: 카드 덱 스트립 (좌우 스크롤 또는 분할) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0">
            {cards.map((card, idx) => {
              const isReversed = Boolean(card.reversed);
              const isOpen = !verifiedDraw || revealedCardIds.includes(card.id);
              const isSelected = idx === selectedCardIdx;

              return (
                <button
                  key={`${card.id}-${idx}`}
                  type="button"
                  onClick={() => {
                    triggerHaptic('whitehole');
                    setSelectedCardIdx(idx);
                    if (!isOpen) onRevealCard?.(card.id);
                  }}
                  className={`relative flex flex-col items-center rounded-xl p-2 transition-all cursor-pointer border text-left group ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/15 ring-2 ring-amber-400/30 shadow-[0_4px_16px_rgba(245,158,11,0.2)]'
                      : 'border-amber-500/20 bg-slate-900/60 hover:border-amber-400/50'
                  }`}
                >
                  <div className="w-full flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-amber-400/90">
                      #{idx + 1}
                    </span>
                    {isOpen && (
                      <span className={`text-[9px] font-bold px-1 rounded ${
                        isReversed ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {card.orientationKo}
                      </span>
                    )}
                  </div>

                  {/* 카드 비주얼 썸네일 */}
                  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center border border-white/10 shadow-inner">
                    {isOpen ? (
                      <img
                        src={card.imageUrl}
                        alt={card.nameKo}
                        loading="lazy"
                        className={`w-full h-full object-cover transition-transform duration-300 ${
                          isReversed ? 'rotate-180' : ''
                        }`}
                      />
                    ) : (
                      <TarotCardBackFace cardBackId={cardBackId} />
                    )}
                  </div>

                  <p className="mt-1.5 text-[11px] font-bold truncate w-full text-center text-slate-200">
                    {isOpen ? card.nameKo : '탭하여 오픈'}
                  </p>
                </button>
              );
            })}
          </div>

          {/* 하단: 선택된 카드의 심층 상징 및 1:1 해설 바로가기 카드 */}
          {activeCard && (
            <div className="flex-1 rounded-2xl bg-slate-900/80 border border-amber-500/25 p-3.5 sm:p-4 flex flex-col justify-between overflow-hidden shadow-lg relative">
              <div className="space-y-2.5 overflow-y-auto no-scrollbar pr-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-amber-300 flex items-center gap-1.5">
                      <span>{activeCard.nameKo}</span>
                      <span className="text-xs font-medium text-slate-400 font-serif">({activeCard.name})</span>
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {activeCard.orientationKo === '역방향' ? '내면의 성찰과 에너지의 전환기' : '순방향 발현과 본연의 우주적 흐름'}
                    </p>
                  </div>

                  {/* 오행 뱃지 */}
                  {(() => {
                    const el = getCardElement(activeCard.type, activeCard.id);
                    return (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${el.bg} ${el.color}`}>
                        {el.name}
                      </span>
                    );
                  })()}
                </div>

                {/* 핵심 키워드 */}
                <div className="flex flex-wrap gap-1.5">
                  {activeCard.keywords.map((kw, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                      #{kw}
                    </span>
                  ))}
                </div>

                {/* 독해 가이드 */}
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-100/90 leading-relaxed font-sans">
                  <span className="font-bold text-amber-300 block mb-0.5">💡 루시의 직관 포인트</span>
                  {activeCard.readingHint || `${activeCard.nameKo} 카드는 현재 당신의 삶에서 ${activeCard.keywords.slice(0, 2).join(', ')}의 흐름을 상징합니다.`}
                </div>
              </div>

              {/* 우측 채팅 1:1 위치 동기화 버튼 */}
              <div className="pt-3 border-t border-white/10 mt-2 flex items-center justify-between gap-2 shrink-0">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Eye size={12} className="text-amber-400" />
                  우측 해설창 연동
                </span>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('whitehole');
                    onScrollToReading?.(activeCard.id);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-bold flex items-center gap-1 hover:brightness-110 active:scale-98 transition-all cursor-pointer shadow-xs"
                >
                  <span>루시 심층 해설로 스크롤</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

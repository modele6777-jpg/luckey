import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Check,
  Search,
  RotateCcw,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  type TarotSpreadRecommendation,
  type TarotConcernTheme,
  getAllTarotSpreads,
} from '@/lib/trinity/utils';

interface TarotSpreadSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSpread: TarotSpreadRecommendation;
  isAutoRecommended: boolean;
  onSelectSpread: (spread: TarotSpreadRecommendation | null) => void;
}

type SpreadCategory = 'all' | 'spiritual' | 'fortune' | 'destiny' | 'decision' | 'life';

const CATEGORIES: { id: SpreadCategory; label: string }[] = [
  { id: 'all', label: '전체 배열법' },
  { id: 'spiritual', label: '👼 천사 & 🌿 힐링' },
  { id: 'fortune', label: '🍀 행운 & 개운' },
  { id: 'destiny', label: '🔮 사주 & 신년' },
  { id: 'decision', label: '⚖️ 선택 & 결정' },
  { id: 'life', label: '💼 연애 & 현실' },
];

export function TarotSpreadSelectionModal({
  isOpen,
  onClose,
  currentSpread,
  isAutoRecommended,
  onSelectSpread,
}: TarotSpreadSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SpreadCategory>('all');

  const allSpreads = useMemo(() => getAllTarotSpreads(), []);

  // Filter spreads by category and search query
  const filteredSpreads = useMemo(() => {
    return allSpreads.filter((spread) => {
      // Category filter
      if (activeCategory === 'spiritual') {
        if (spread.theme !== 'angel' && spread.theme !== 'healing') return false;
      } else if (activeCategory === 'fortune') {
        if (spread.theme !== 'super_money' && spread.theme !== 'lucky' && spread.theme !== 'daily') return false;
      } else if (activeCategory === 'destiny') {
        if (spread.theme !== 'saju' && spread.theme !== 'new_year') return false;
      } else if (activeCategory === 'decision') {
        if (spread.theme !== 'binary_choice' && spread.theme !== 'yes_no' && spread.id !== 'celtic_cross') return false;
      } else if (activeCategory === 'life') {
        if (spread.theme !== 'super_money' && spread.theme !== 'love' && spread.theme !== 'career' && spread.theme !== 'money' && spread.theme !== 'timing' && spread.theme !== 'obstacle') return false;
      }

      // Search filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        spread.name.toLowerCase().includes(q) ||
        spread.reason.toLowerCase().includes(q) ||
        spread.positions.some((p) => p.toLowerCase().includes(q))
      );
    });
  }, [allSpreads, activeCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-3 sm:p-5 font-sans">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="relative z-10 w-full max-w-2xl max-h-[90vh] bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border border-yellow-500/30 rounded-[32px] sm:rounded-[36px] shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(234,179,8,0.15)] flex flex-col overflow-hidden text-white"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400 shadow-md">
              <Layers size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  타로 배열법 선택 (Spread Selector)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 font-bold">
                  {allSpreads.length}개 배열법
                </span>
              </div>
              <p className="text-xs text-white/60 font-sans mt-0.5">
                원하는 배열법을 직접 클릭하여 고민에 딱 맞는 타로 덱 전개를 설정하세요.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all active:scale-95 border border-white/10"
            title="닫기"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search & Categories Bar */}
        <div className="p-4 sm:p-6 py-3 border-b border-white/10 space-y-3 shrink-0 bg-white/[0.01]">
          <div className="flex items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="배열법 이름, 포지션, 고민 주제 검색..."
                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-yellow-500/50 transition-all font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Reset to Auto Recommend Button */}
            {!isAutoRecommended && (
              <button
                type="button"
                onClick={() => {
                  onSelectSpread(null);
                  onClose();
                }}
                className="px-3.5 py-2 rounded-2xl bg-yellow-500/15 hover:bg-yellow-500/25 border border-yellow-500/30 text-yellow-300 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 active:scale-95 shadow-sm"
                title="AI 자동 추천 배열법으로 되돌리기"
              >
                <RotateCcw size={13} />
                <span className="hidden sm:inline">AI 자동 추천 복원</span>
                <span className="sm:hidden">자동 복원</span>
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto select-none pb-0.5 [scrollbar-width:none]">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-none px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all active:scale-95 ${
                    isActive
                      ? 'bg-yellow-500 text-black border-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.4)]'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Spread List Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 [scrollbar-width:thin] [scrollbar-color:rgba(234,179,8,0.2)_transparent]">
          {filteredSpreads.length === 0 ? (
            <div className="py-12 text-center text-white/40 text-xs space-y-2">
              <p>검색 조건에 맞는 타로 배열법이 없습니다.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="text-yellow-400 underline font-bold"
              >
                전체 배열법 보기
              </button>
            </div>
          ) : (
            filteredSpreads.map((spread) => {
              const isCurrent = currentSpread.id === spread.id;
              const isSuperMoneySpread = spread.theme === 'super_money';
              const isLuckySpread = spread.theme === 'lucky' || spread.theme === 'fortune_boost';
              const isAngelSpread = spread.theme === 'angel';
              const isHealingSpread = spread.theme === 'healing';

              return (
                <div
                  key={spread.id}
                  onClick={() => {
                    onSelectSpread(spread);
                    onClose();
                  }}
                  className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                    isCurrent
                      ? 'bg-yellow-500/15 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.25)]'
                      : isSuperMoneySpread
                      ? 'bg-gradient-to-r from-yellow-950/40 via-amber-950/30 to-yellow-950/40 border-yellow-400/50 hover:border-yellow-300 hover:bg-yellow-950/55 shadow-[0_0_20px_rgba(234,179,8,0.2)]'
                      : isLuckySpread
                      ? 'bg-gradient-to-r from-amber-950/30 to-emerald-950/30 border-amber-400/40 hover:border-amber-300 hover:bg-amber-950/45 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                      : isAngelSpread
                      ? 'bg-sky-950/20 border-sky-400/30 hover:border-sky-300 hover:bg-sky-950/35'
                      : isHealingSpread
                      ? 'bg-emerald-950/20 border-emerald-400/30 hover:border-emerald-300 hover:bg-emerald-950/35'
                      : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.06] hover:border-white/25'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-yellow-300 transition-colors flex items-center gap-1.5">
                        <span>{spread.name}</span>
                      </h4>
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-white/10 text-yellow-300 border border-white/15">
                        {spread.cardCount}장 카드
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-500 text-black shadow-sm">
                          현재 적용 중
                        </span>
                      )}
                      {isSuperMoneySpread && !isCurrent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-500/30 via-amber-500/30 to-yellow-500/30 text-yellow-300 border border-yellow-400/50 shadow-sm">
                          💎 볼수록 돈을 끌어당기는 슈퍼타로
                        </span>
                      )}
                      {isLuckySpread && !isCurrent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/30 to-emerald-500/30 text-amber-300 border border-amber-400/40 shadow-sm">
                          🍀 볼수록 대박 럭키 개운 증폭
                        </span>
                      )}
                      {isAngelSpread && !isCurrent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                          👼 수호천사 영적 계시
                        </span>
                      )}
                      {isHealingSpread && !isCurrent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          🌿 내면 아이 심층 치유
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-white/70 font-sans leading-relaxed">
                      {spread.reason}
                    </p>

                    {/* Positions Breadcrumbs */}
                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      {spread.positions.map((pos, pIdx) => (
                        <span
                          key={pIdx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/40 border border-white/10 text-white/60"
                        >
                          {pos}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center justify-end">
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                        isCurrent
                          ? 'bg-yellow-500 text-black shadow-[0_0_12px_rgba(234,179,8,0.4)]'
                          : 'bg-white/10 group-hover:bg-yellow-500 group-hover:text-black text-white/80'
                      }`}
                    >
                      {isCurrent ? (
                        <>
                          <Check size={14} strokeWidth={3} />
                          <span>선택됨</span>
                        </>
                      ) : (
                        <>
                          <span>적용하기</span>
                          <ChevronRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-white/50 shrink-0">
          <div className="flex items-center gap-1.5 font-sans">
            <Sparkles size={13} className="text-yellow-400" />
            <span>배열법을 선택하면 78장 타로 휠 전개 시 선택한 장수와 위치로 리딩됩니다.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
          >
            닫기
          </button>
        </div>
      </motion.div>
    </div>
  );
}

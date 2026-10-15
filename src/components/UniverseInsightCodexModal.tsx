import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Sparkles, Copy, Check, Volume2, BookOpen, Filter, ArrowRight, Star } from 'lucide-react';
import { UNIVERSE_INSIGHTS, INSIGHT_CATEGORIES, type InsightCategory, type UniverseInsightItem } from '@/data/universeInsights';
import { TTSButton } from '@/components/TTSButton';
import { useApp } from '@/contexts/AppContext';
import { useUniverseInsightFavorites } from '@/lib/universeInsightFavorites';

interface UniverseInsightCodexModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectInsight?: (insight: UniverseInsightItem) => void;
}

export function UniverseInsightCodexModal({
  isOpen,
  onClose,
  onSelectInsight
}: UniverseInsightCodexModalProps) {
  const { sharedState, updateSharedState } = useApp();

  const handleUpdateCloudFavorites = (ids: string[]) => {
    updateSharedState({
      favoriteInsightIds: ids,
    }, 'HUB_CODEX_FAVORITES');
  };

  const { isFavorite, toggleFavorite, favoriteCount, favoriteIds } = useUniverseInsightFavorites(
    sharedState?.favoriteInsightIds,
    handleUpdateCloudFavorites
  );

  const [selectedCategory, setSelectedCategory] = useState<InsightCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredInsights = useMemo(() => {
    return UNIVERSE_INSIGHTS.filter(item => {
      // Category / Favorites filter
      if (selectedCategory === 'favorites') {
        if (!favoriteIds.includes(item.id)) return false;
      } else if (selectedCategory !== 'all') {
        if (item.category !== selectedCategory) return false;
      }

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.quote.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q) ||
        item.resonance.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery, favoriteIds]);

  const handleCopy = (item: UniverseInsightItem) => {
    const textToCopy = `"${item.quote}"\n— ${item.author} (${item.source})\n\n[우주 통찰] ${item.resonance}\n#UniverseInsight #PRISM`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[32px] bg-gradient-to-b from-[#16162a] via-[#10101e] to-[#0a0a14] border border-white/15 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden z-10 text-white"
        >
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-purple-500/20 to-sky-500/20 border border-white/20 flex items-center justify-center shadow-lg">
                <BookOpen size={20} className="text-amber-300 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight font-sans text-white">
                    Universe Insight Codex
                  </h2>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                    지혜 보관소 ({filteredInsights.length})
                  </span>
                </div>
                <p className="text-xs text-white/50 font-sans mt-0.5">
                  동서양 철학, 영지주의, 초기 불교, 심층심리학, 기적수업의 정선된 명언 및 통찰
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all active:scale-95"
            >
              <X size={18} />
            </button>
          </div>

          {/* Controls: Search & Category Chips */}
          <div className="p-4 md:px-8 border-b border-white/10 bg-white/[0.01] space-y-4 shrink-0">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="명언, 철학자(니체, 융, 부처...), 출처, 키워드 검색..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
                >
                  지우기
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {/* Favorites Filter Chip */}
              <button
                onClick={() => setSelectedCategory('favorites')}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium font-sans flex items-center gap-1.5 transition-all ${
                  selectedCategory === 'favorites'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold shadow-md shadow-amber-500/25 border border-amber-300/40 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-amber-300/80 hover:text-amber-200 border border-amber-500/20'
                }`}
              >
                <Star size={13} className={selectedCategory === 'favorites' || favoriteCount > 0 ? "fill-amber-300 text-amber-300" : ""} />
                <span>즐겨찾기</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  selectedCategory === 'favorites' ? 'bg-black/30 text-white' : 'bg-amber-400/20 text-amber-300'
                }`}>
                  {favoriteCount}
                </span>
              </button>

              {INSIGHT_CATEGORIES.map(cat => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium font-sans flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-bold shadow-md shadow-amber-500/20 border border-white/30 scale-105'
                        : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quotes List */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4">
            {filteredInsights.length === 0 ? (
              selectedCategory === 'favorites' ? (
                <div className="py-16 text-center text-white/60 font-sans flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
                    <Star size={26} className="text-amber-400 animate-pulse" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
                    즐겨찾기한 명언이 없습니다
                  </h3>
                  <p className="text-xs sm:text-sm text-white/50 max-w-md mx-auto mb-6 leading-relaxed break-keep">
                    마음에 깊은 울림을 주는 명언 카드의 <Star size={12} className="inline fill-amber-300 text-amber-300 -translate-y-0.5" /> 별표 아이콘을 눌러 나만의 영감 보관함을 완성해 보세요.
                  </p>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-purple-500/20 hover:from-amber-500/30 hover:to-purple-500/30 border border-amber-400/40 text-amber-200 hover:text-white text-xs font-bold transition-all active:scale-95"
                  >
                    전체 지혜 둘러보기
                  </button>
                </div>
              ) : (
                <div className="py-16 text-center text-white/40 font-sans">
                  <p className="text-base mb-2">검색된 명언이 없습니다.</p>
                  <p className="text-xs">다른 검색어나 카테고리를 선택해 보세요.</p>
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredInsights.map(item => {
                  const isExpanded = expandedId === item.id;
                  const isCopied = copiedId === item.id;
                  const isItemFav = isFavorite(item.id);

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`group relative rounded-2xl border p-5 transition-all duration-300 flex flex-col justify-between ${
                        isItemFav
                          ? 'bg-gradient-to-br from-amber-500/[0.08] via-white/[0.03] to-white/[0.01] border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.08)]'
                          : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div>
                        {/* Top Meta */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/60 font-medium font-sans flex items-center gap-1">
                            <span>{item.categoryIcon}</span>
                            <span>{item.categoryName}</span>
                          </span>
                          
                          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                            {/* Favorite Toggle Button */}
                            <button
                              onClick={() => toggleFavorite(item.id)}
                              title={isItemFav ? "즐겨찾기에서 제거" : "즐겨찾기에 추가"}
                              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all active:scale-90 ${
                                isItemFav
                                  ? 'bg-amber-500/25 border-amber-400/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                                  : 'bg-white/5 hover:bg-white/15 border-white/10 text-white/50 hover:text-amber-300'
                              }`}
                            >
                              <Star 
                                size={13} 
                                className={isItemFav ? "fill-amber-300 text-amber-300 animate-pulse" : ""} 
                              />
                            </button>

                            <TTSButton
                              text={`"${item.quote}" — ${item.author}. ${item.resonance}`}
                              voice="Kore"
                              className="scale-80 text-white/70 hover:text-white"
                            />
                            <button
                              onClick={() => handleCopy(item)}
                              title="명언 복사하기"
                              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                            >
                              {isCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                            </button>
                          </div>
                        </div>

                        {/* Quote Text */}
                        <p className="text-sm md:text-base font-sans font-medium text-white/95 leading-relaxed break-keep mb-3">
                          "{item.quote}"
                        </p>

                        {/* Author & Source */}
                        <div className="flex items-center justify-between text-xs text-white/50 font-sans mb-3">
                          <span className="font-bold text-amber-300/90">— {item.author}</span>
                          <span className="text-[11px] text-white/40 italic">《{item.source}》</span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {item.tags.map((tag, idx) => (
                            <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-white/40 font-sans">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Resonance Commentary */}
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="w-full flex items-center justify-between text-[11px] font-bold text-white/50 hover:text-white/80 transition-colors font-sans py-1"
                        >
                          <span className="flex items-center gap-1.5">
                            <Sparkles size={12} className="text-amber-400" />
                            우주 통찰 & 성찰 가이드
                          </span>
                          <span className="text-[10px] text-white/40">
                            {isExpanded ? '접기' : '자세히 보기'}
                          </span>
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden mt-2"
                            >
                              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-100/90 leading-relaxed font-sans break-keep">
                                {item.resonance}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {onSelectInsight && (
                          <button
                            onClick={() => {
                              onSelectInsight(item);
                              onClose();
                            }}
                            className="mt-3 w-full py-2 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/30 text-xs font-bold text-white/80 hover:text-amber-200 transition-all flex items-center justify-center gap-1 font-sans"
                          >
                            <span>오늘의 Universe Insight로 선택 적용</span>
                            <ArrowRight size={12} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 md:px-8 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs text-white/40 font-sans shrink-0">
            <span>PRISM Universe Insight Engine • 총 {UNIVERSE_INSIGHTS.length}편의 영적 비전 수록</span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all"
            >
              닫기
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

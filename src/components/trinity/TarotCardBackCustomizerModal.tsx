import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, X, Palette, RefreshCw, Eye, Star } from 'lucide-react';
import {
  TAROT_CARD_BACKS,
  TarotCardBackTheme,
  getTarotCardBackTheme,
} from '@/data/tarotCardBacks';
import { useTarotCardBack } from '@/hooks/useTarotCardBack';
import { TarotCardBackFace } from './TarotCardBackFace';
import { playAudioHaptic } from '@/lib/audioHaptics';

export interface TarotCardBackCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TarotCardBackCustomizerModal: React.FC<TarotCardBackCustomizerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { cardBackId: activeId, setCardBackId } = useTarotCardBack();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [previewHoverId, setPreviewHoverId] = useState<string | null>(null);
  const [isTestCardFlipped, setIsTestCardFlipped] = useState(false);

  const categories = [
    { key: 'all', label: '전체 (20)' },
    { key: 'sacred', label: '신성기하학' },
    { key: 'cosmic', label: '심우주 성운' },
    { key: 'mystic', label: '오컬트·미스틱' },
    { key: 'nature', label: '자연·치유' },
    { key: 'modern', label: '미래·모던' },
    { key: 'classic', label: '정통 클래식' },
  ];

  const filteredDecks = TAROT_CARD_BACKS.filter((deck) => {
    if (selectedFilter === 'all') return true;
    return deck.category === selectedFilter;
  });

  const previewTheme = TAROT_CARD_BACKS.find((b) => b.id === (previewHoverId || activeId)) || TAROT_CARD_BACKS[0];

  const handleSelectDeck = (deck: TarotCardBackTheme) => {
    try {
      playAudioHaptic('card_snap');
    } catch (_) {}
    setCardBackId(deck.id);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[500] flex items-center justify-center p-3 sm:p-5 font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-950/95 border border-yellow-500/40 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(234,179,8,0.2)] flex flex-col overflow-hidden text-white z-10"
        >
          {/* Top Header */}
          <div className="relative flex items-center justify-between px-5 sm:px-7 py-4.5 border-b border-white/10 bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 border border-yellow-400/40 flex items-center justify-center text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                <Palette size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-yellow-200">
                    타로 덱 뒷면(Card Back) 커스텀 컬렉션
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-400/30">
                    Quin 스타일 20종
                  </span>
                </div>
                <p className="text-xs text-white/60">
                  선택하신 덱 뒷면은 78장 타로 휠, 결과 카드, 3D 플립 모달 전체에 실시간 동기화됩니다.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Main Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6 space-y-6">
            {/* Top Interactive 3D Showcase & Live Details */}
            <div className="rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-zinc-900/90 via-black to-zinc-900/80 p-4 sm:p-5 flex flex-col md:flex-row items-center gap-5 shadow-inner">
              {/* 3D Flip Card Interactive Preview */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div
                  style={{ perspective: 1000 }}
                  className="w-28 h-44 sm:w-32 sm:h-52 cursor-pointer select-none"
                  onClick={() => setIsTestCardFlipped((prev) => !prev)}
                  title="클릭하여 카드 앞/뒷면 뒤집기 테스트"
                >
                  <motion.div
                    animate={{ rotateY: isTestCardFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: 'spring', damping: 20 }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="relative w-full h-full rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
                  >
                    {/* BACK FACE (Custom Deck Back) */}
                    <div
                      style={{ backfaceVisibility: 'hidden' }}
                      className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden"
                    >
                      <TarotCardBackFace cardBackId={previewTheme.id} size="preview" isHovered />
                    </div>

                    {/* FRONT FACE (Major Arcana Sample) */}
                    <div
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                      className="absolute inset-0 w-full h-full rounded-2xl bg-zinc-950 border border-yellow-400/80 p-2.5 flex flex-col items-center justify-between text-center overflow-hidden shadow-2xl"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none" />
                      <img
                        src="https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m19.jpg"
                        alt="The Sun"
                        className="absolute inset-0 w-full h-full object-cover z-0 opacity-90"
                      />
                      <div className="relative z-20 flex justify-between w-full text-[8px] font-mono text-yellow-300">
                        <span>MAJOR XIX</span>
                        <span>THE SUN</span>
                      </div>
                      <div className="relative z-20 bg-black/80 px-2 py-0.5 rounded-md border border-yellow-400/30">
                        <span className="text-xs font-bold text-yellow-200">태양 (The Sun)</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTestCardFlipped((prev) => !prev)}
                  className="text-[10px] text-yellow-400/80 hover:text-yellow-300 flex items-center gap-1 font-sans cursor-pointer bg-white/5 px-2.5 py-1 rounded-full border border-yellow-500/20"
                >
                  <RefreshCw size={10} className={isTestCardFlipped ? 'rotate-180 transition-transform' : ''} />
                  <span>{isTestCardFlipped ? '뒷면 보기' : '앞면 플립 테스트'}</span>
                </button>
              </div>

              {/* Theme Details & Instant Apply */}
              <div className="flex-1 space-y-3 text-left w-full">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
                    {previewTheme.categoryLabelKo}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white/80">
                    {previewTheme.badge}
                  </span>
                  {previewTheme.id === activeId && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1">
                      <Check size={10} /> 현재 적용 중인 덱
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                    <span>{previewTheme.nameKo}</span>
                    <span className="text-xs font-normal text-white/50 font-mono">
                      ({previewTheme.nameEn})
                    </span>
                  </h4>
                  <p className="text-xs text-white/70 mt-1 leading-relaxed break-keep">
                    {previewTheme.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleSelectDeck(previewTheme)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                      previewTheme.id === activeId
                        ? 'bg-emerald-500 text-black shadow-emerald-500/30'
                        : 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black shadow-yellow-500/30 active:scale-95'
                    }`}
                  >
                    {previewTheme.id === activeId ? (
                      <>
                        <Check size={14} />
                        <span>현재 사용 중입니다</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        <span>이 덱 뒷면으로 적용하기</span>
                      </>
                    )}
                  </button>

                  <span className="text-[11px] text-white/40 hidden sm:inline">
                    카드를 마우스로 올리면 실시간 미리보기가 동작합니다.
                  </span>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedFilter(cat.key)}
                  className={`flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedFilter === cat.key
                      ? 'bg-yellow-500 text-black shadow-md shadow-yellow-500/30'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Decks Grid (20 Designs) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {filteredDecks.map((deck, idx) => {
                const isCurrentActive = deck.id === activeId;
                const isCurrentPreview = deck.id === previewTheme.id;

                return (
                  <motion.div
                    key={deck.id}
                    initial={{ opacity: 0, scale: 0.92, y: 14 }}
                    animate={{ opacity: 1, scale: isCurrentActive ? 1.02 : 1, y: 0 }}
                    transition={{ duration: 0.28, delay: (idx % 15) * 0.035 }}
                    whileHover={{ scale: isCurrentActive ? 1.03 : 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onMouseEnter={() => setPreviewHoverId(deck.id)}
                    onClick={() => handleSelectDeck(deck)}
                    className={`relative rounded-2xl border p-2 flex flex-col items-center gap-2 transition-colors cursor-pointer group ${
                      isCurrentActive
                        ? 'bg-yellow-500/15 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.35)]'
                        : isCurrentPreview
                        ? 'bg-white/10 border-white/40'
                        : 'bg-white/[0.03] border-white/10 hover:border-yellow-500/50 hover:bg-white/[0.07]'
                    }`}
                  >
                    {/* Active Checkmark Badge */}
                    {isCurrentActive && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-yellow-400 text-black flex items-center justify-center shadow-md z-30">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}

                    {/* Badge */}
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/75 border border-white/20 text-[8px] font-bold text-yellow-300 z-30">
                      {deck.badge}
                    </div>

                    {/* Card Back Thumbnail */}
                    <div className="w-20 h-30 sm:w-22 sm:h-34 relative rounded-xl overflow-hidden mt-1 shadow-md group-hover:scale-105 transition-transform duration-200">
                      <TarotCardBackFace cardBackId={deck.id} size="sm" isHovered={isCurrentActive || isCurrentPreview} />
                    </div>

                    {/* Labels */}
                    <div className="text-center w-full min-w-0 px-1">
                      <p className="text-xs font-bold text-white truncate leading-tight">
                        {deck.nameKo}
                      </p>
                      <p className="text-[9px] text-white/50 truncate font-mono mt-0.5">
                        {deck.nameEn}
                      </p>
                    </div>

                    {/* Quick Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectDeck(deck);
                      }}
                      className={`w-full py-1 rounded-lg text-[10px] font-bold transition-all ${
                        isCurrentActive
                          ? 'bg-yellow-400 text-black'
                          : 'bg-white/10 hover:bg-yellow-500/30 text-white/80 hover:text-yellow-200'
                      }`}
                    >
                      {isCurrentActive ? '선택됨' : '적용'}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 border-t border-white/10 bg-black/50 flex items-center justify-between text-xs text-white/50">
            <span>현재 설정: <strong className="text-yellow-300">{getTarotCardBackTheme(activeId).nameKo}</strong></span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all cursor-pointer"
            >
              닫기
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

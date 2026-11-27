import { WorkspacePortal } from '@/components/layout/DuoWorkspace';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, X, Palette, RefreshCw } from 'lucide-react';
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
    { key: 'all', label: `전체 (${TAROT_CARD_BACKS.length})` },
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
      <WorkspacePortal onClose={onClose}><div role="dialog" aria-modal="true" aria-label="타로 덱 뒷면 커스텀 컬렉션" className="fixed inset-0 z-[500] flex items-center justify-center p-2.5 sm:p-5 font-sans">
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
          className="relative w-full max-w-4xl max-h-[calc(100dvh-1rem)] bg-zinc-950/95 border border-yellow-500/40 rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(234,179,8,0.2)] flex flex-col overflow-hidden text-white z-10 duo-dialog-panel"
        >
          {/* Top Header — compact on narrow canvases, badge never squeezed */}
          <div className="relative flex items-start gap-2.5 sm:gap-3 px-3.5 py-3 sm:px-6 sm:py-4 border-b border-white/10 bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-transparent duo-dialog-heading">
            <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-xl sm:rounded-2xl bg-yellow-500/20 border border-yellow-400/40 flex items-center justify-center text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              <Palette size={16} className="sm:hidden" />
              <Palette size={20} className="hidden sm:block" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h3 className="text-[13px] leading-tight sm:text-lg font-bold text-yellow-200 min-w-0">
                  타로 덱 뒷면(Card Back) 커스텀 컬렉션
                </h3>
                <span className="shrink-0 whitespace-nowrap text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-400/30">
                  일러스트 컬렉션 {TAROT_CARD_BACKS.length}종
                </span>
              </div>
              <p className="hidden sm:block text-xs text-white/60 truncate">
                선택하신 덱 뒷면은 78장 타로 휠, 결과 카드, 3D 플립 모달 전체에 실시간 동기화됩니다.
              </p>
            </div>

            <button
              onClick={onClose}
              aria-label="닫기"
              className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          {/* Main Body */}
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-3 sm:p-5 duo-dialog-body">
            <div className="flex flex-col gap-3 sm:gap-4 lg:grid lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:items-start lg:gap-5">
              {/* Preview: a compact horizontal card on narrow canvases (so the deck
                  grid is already on screen), a stacked showcase from lg up. */}
              <div className="rounded-xl sm:rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-zinc-900/90 via-black to-zinc-900/80 p-2.5 sm:p-3 flex flex-row items-start gap-3 lg:flex-col lg:items-center lg:gap-4 shadow-inner lg:sticky lg:top-0">
                {/* 3D Flip Card Interactive Preview */}
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <div
                    style={{ perspective: 1000 }}
                    className="w-14 h-[5.25rem] sm:w-16 sm:h-24 lg:w-28 lg:h-44 xl:w-32 xl:h-52 cursor-pointer select-none"
                    onClick={() => setIsTestCardFlipped((prev) => !prev)}
                    title="클릭하여 카드 앞/뒷면 뒤집기 테스트"
                  >
                    <motion.div
                      animate={{ rotateY: isTestCardFlipped ? 180 : 0 }}
                      transition={{ duration: 0.6, type: 'spring', damping: 20 }}
                      style={{ transformStyle: 'preserve-3d' }}
                      className="relative w-full h-full rounded-lg lg:rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
                    >
                      {/* BACK FACE (Custom Deck Back) */}
                      <div
                        style={{ backfaceVisibility: 'hidden' }}
                        className="absolute inset-0 w-full h-full rounded-lg lg:rounded-2xl overflow-hidden"
                      >
                        <TarotCardBackFace cardBackId={previewTheme.id} size="preview" isHovered />
                      </div>

                      {/* FRONT FACE (Major Arcana Sample) */}
                      <div
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                        }}
                        className="absolute inset-0 w-full h-full rounded-lg lg:rounded-2xl bg-zinc-950 border border-yellow-400/80 p-1.5 lg:p-2.5 flex flex-col items-center justify-center text-center overflow-hidden shadow-2xl"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none" />
                        <img
                          src="https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m19.jpg"
                          alt="The Sun"
                          className="absolute inset-0 w-full h-full object-cover z-0 opacity-90"
                        />
                        <div className="relative z-20 bg-black/80 px-1.5 py-0.5 rounded-md border border-yellow-400/30">
                          <span className="text-[9px] lg:text-xs font-bold text-yellow-200">태양</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsTestCardFlipped((prev) => !prev)}
                    className="text-[9px] lg:text-[10px] text-yellow-400/80 hover:text-yellow-300 flex items-center gap-1 font-sans cursor-pointer bg-white/5 px-1.5 lg:px-2.5 py-0.5 lg:py-1 rounded-full border border-yellow-500/20"
                  >
                    <RefreshCw size={9} className={isTestCardFlipped ? 'rotate-180 transition-transform' : ''} />
                    <span className="whitespace-nowrap">{isTestCardFlipped ? '뒷면 보기' : '앞면 플립 테스트'}</span>
                  </button>
                </div>

                {/* Theme Details & Instant Apply */}
                <div className="flex-1 min-w-0 flex flex-col gap-1.5 lg:gap-3 lg:w-full lg:text-center lg:items-center text-left">
                  <div className="flex items-center gap-1.5 flex-wrap lg:justify-center">
                    <span className="px-2 py-0.5 rounded-full text-[9px] lg:text-[10px] font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 whitespace-nowrap">
                      {previewTheme.categoryLabelKo}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] lg:text-[10px] font-bold bg-white/10 text-white/80 whitespace-nowrap">
                      {previewTheme.badge}
                    </span>
                    {previewTheme.id === activeId && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] lg:text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1 whitespace-nowrap">
                        <Check size={9} /> 현재 적용 중
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-[13px] lg:text-xl font-extrabold text-white truncate leading-tight">
                      {previewTheme.nameKo}
                    </h4>
                    <p className="text-[10px] lg:text-xs font-normal text-white/50 font-mono truncate mt-0.5">
                      ({previewTheme.nameEn})
                    </p>
                    <p className="text-[11px] lg:text-xs text-white/65 mt-1 leading-snug break-keep line-clamp-2 lg:line-clamp-none">
                      {previewTheme.description}
                    </p>
                  </div>

                  <div className="pt-0.5 lg:pt-2 flex items-center gap-2 lg:justify-center">
                    <button
                      type="button"
                      onClick={() => handleSelectDeck(previewTheme)}
                      className={`px-3 lg:px-5 py-1.5 lg:py-2.5 rounded-lg lg:rounded-xl font-bold text-[11px] lg:text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg whitespace-nowrap ${
                        previewTheme.id === activeId
                          ? 'bg-emerald-500 text-black shadow-emerald-500/30'
                          : 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black shadow-yellow-500/30 active:scale-95'
                      }`}
                    >
                      {previewTheme.id === activeId ? (
                        <>
                          <Check size={13} />
                          <span>현재 사용 중</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={13} />
                          <span>이 덱으로 적용</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Filters + deck collection */}
              <div className="min-w-0 flex flex-col gap-2.5 sm:gap-3">
                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
                  {categories.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => setSelectedFilter(cat.key)}
                      className={`flex-none px-2.5 sm:px-3.5 py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        selectedFilter === cat.key
                          ? 'bg-yellow-500 text-black shadow-md shadow-yellow-500/30'
                          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Deck collection */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
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
                        className={`relative rounded-xl sm:rounded-2xl border p-1.5 sm:p-2 flex flex-col items-center gap-1.5 transition-colors cursor-pointer group ${
                          isCurrentActive
                            ? 'bg-yellow-500/15 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.35)]'
                            : isCurrentPreview
                            ? 'bg-white/10 border-white/40'
                            : 'bg-white/[0.03] border-white/10 hover:border-yellow-500/50 hover:bg-white/[0.07]'
                        }`}
                      >
                        {/* Active Checkmark Badge */}
                        {isCurrentActive && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-yellow-400 text-black flex items-center justify-center shadow-md z-30">
                            <Check size={10} strokeWidth={3} />
                          </div>
                        )}

                        {/* Badge (in flow, so it never covers the card art) */}
                        <div className="w-full flex justify-center">
                          <span className="px-1 py-0 rounded bg-black/60 border border-white/20 text-[7px] sm:text-[8px] font-bold text-yellow-300 max-w-full truncate">
                            {deck.badge}
                          </span>
                        </div>

                        {/* Card Back Thumbnail */}
                        <div className="w-14 h-[5.25rem] sm:w-[4.5rem] sm:h-[6.75rem] relative rounded-lg overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-200">
                          <TarotCardBackFace cardBackId={deck.id} size="sm" isHovered={isCurrentActive || isCurrentPreview} />
                        </div>

                        {/* Labels */}
                        <div className="text-center w-full min-w-0 px-0.5">
                          <p className="text-[11px] sm:text-xs font-bold text-white truncate leading-tight">
                            {deck.nameKo}
                          </p>
                          <p className="text-[8px] sm:text-[9px] text-white/50 truncate font-mono mt-0.5">
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
                          className={`w-full py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[9px] sm:text-[10px] font-bold transition-all whitespace-nowrap ${
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
            </div>
          </div>

          {/* Footer — one line at every width */}
          <div className="px-3.5 py-2.5 sm:px-6 sm:py-3.5 border-t border-white/10 bg-black/50 flex items-center justify-between gap-2 text-[11px] sm:text-xs text-white/50 duo-dialog-actions">
            <span className="min-w-0 truncate">
              현재 설정:{' '}
              <strong className="text-yellow-300">{getTarotCardBackTheme(activeId).nameKo}</strong>
            </span>
            <button
              onClick={onClose}
              className="shrink-0 px-4 py-1.5 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer whitespace-nowrap"
            >
              닫기
            </button>
          </div>
        </motion.div>
      </div></WorkspacePortal>
    </AnimatePresence>
  );
};

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Search,
  Check,
  X,
  RotateCcw,
  Layers,
  ArrowUpDown,
  BookOpen,
  Wand2,
  Trash2,
  HelpCircle,
} from 'lucide-react';
import {
  TAROT_DECK,
  TarotCard,
  getTarotCardImageUrl,
} from '@/data/tarotData';
import { SelectedTarotCardEntry } from './TarotSpread';
import { playAudioHaptic } from '@/lib/audioHaptics';

export interface PhysicalTarotInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSpreadName?: string;
  initialPositions?: string[];
  initialConcern?: string;
  onComplete: (cards: SelectedTarotCardEntry[], concern?: string) => void;
}

export interface SlotCardItem {
  card: TarotCard | null;
  reversed: boolean;
  positionLabel: string;
}

export const PhysicalTarotInputModal: React.FC<PhysicalTarotInputModalProps> = ({
  isOpen,
  onClose,
  initialSpreadName = '3카드 (과거·현재·미래)',
  initialPositions = ['1. 과거/원인', '2. 현재/상황', '3. 미래/결과'],
  initialConcern = '',
  onComplete,
}) => {
  // Spread setup state
  const [spreadCount, setSpreadCount] = useState<number>(() =>
    Math.max(1, Math.min(initialPositions.length || 3, 7))
  );

  const defaultPositions = useMemo(() => {
    if (spreadCount === 1) return ['단일 통찰 / 핵심 에너지'];
    if (spreadCount === 2) return ['선택 A (현재 길)', '선택 B (대안의 길)'];
    if (spreadCount === 3) return ['1. 과거/원인', '2. 현재/상황', '3. 미래/결과'];
    if (spreadCount === 4) return ['1. 마음/감정', '2. 현실/상황', '3. 무의식/장애물', '4. 궁극의 솔루션'];
    if (spreadCount === 5) return ['1. 현재 상황', '2. 내면의 욕망', '3. 외부 영향', '4. 필요한 행동', '5. 최종 결과'];
    return ['1. 현재 상태', '2. 도전 과제', '3. 과거 기반', '4. 최근 과거', '5. 잠재적 가능성', '6. 가까운 미래', '7. 자기 인식'];
  }, [spreadCount]);

  const [concern, setConcern] = useState(initialConcern);
  const [slots, setSlots] = useState<SlotCardItem[]>(() =>
    defaultPositions.map((pos) => ({
      card: null,
      reversed: false,
      positionLabel: pos,
    }))
  );

  // When spreadCount changes, resize slots
  const handleSpreadCountChange = (count: number) => {
    setSpreadCount(count);
    const posList =
      count === 1
        ? ['단일 통찰 / 핵심 에너지']
        : count === 2
        ? ['선택 A (현재 길)', '선택 B (대안의 길)']
        : count === 3
        ? ['1. 과거/원인', '2. 현재/상황', '3. 미래/결과']
        : count === 4
        ? ['1. 마음/감정', '2. 현실/상황', '3. 무의식/장애물', '4. 궁극의 솔루션']
        : count === 5
        ? ['1. 현재 상황', '2. 내면의 욕망', '3. 외부 영향', '4. 필요한 행동', '5. 최종 결과']
        : ['1. 현재 상태', '2. 도전 과제', '3. 과거 기반', '4. 최근 과거', '5. 잠재적 가능성', '6. 가까운 미래', '7. 자기 인식'];

    setSlots((prev) => {
      const next: SlotCardItem[] = [];
      for (let i = 0; i < count; i++) {
        next.push({
          card: prev[i]?.card || null,
          reversed: prev[i]?.reversed || false,
          positionLabel: posList[i] || `카드 ${i + 1}`,
        });
      }
      return next;
    });
  };

  // Active slot index for card picker modal
  const [activePickerSlotIndex, setActivePickerSlotIndex] = useState<number | null>(null);

  // Card Picker filters
  const [searchQuery, setSearchQuery] = useState('');
  const [suitFilter, setSuitFilter] = useState<'all' | 'major' | 'wands' | 'cups' | 'swords' | 'pentacles'>('all');
  const [pickerReversed, setPickerReversed] = useState(false);

  // Filtered 78 cards
  const filteredDeck = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return TAROT_DECK.filter((card) => {
      if (suitFilter !== 'all' && card.type !== suitFilter) return false;
      if (!q) return true;
      return (
        card.nameKo.toLowerCase().includes(q) ||
        card.name.toLowerCase().includes(q) ||
        card.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, suitFilter]);

  const handleSelectCardForSlot = (card: TarotCard) => {
    if (activePickerSlotIndex === null) return;
    try {
      playAudioHaptic('card_snap');
    } catch (_) {}

    setSlots((prev) => {
      const next = [...prev];
      next[activePickerSlotIndex] = {
        ...next[activePickerSlotIndex],
        card,
        reversed: pickerReversed,
      };
      return next;
    });

    // Auto-advance to next empty slot if available
    const nextEmptyIndex = slots.findIndex((s, idx) => idx !== activePickerSlotIndex && !s.card);
    if (nextEmptyIndex !== -1) {
      setActivePickerSlotIndex(nextEmptyIndex);
    } else {
      setActivePickerSlotIndex(null);
    }
  };

  const handleToggleSlotReversed = (index: number) => {
    setSlots((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        reversed: !next[index].reversed,
      };
      return next;
    });
  };

  const handleClearSlot = (index: number) => {
    setSlots((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        card: null,
        reversed: false,
      };
      return next;
    });
  };

  const handleResetAllSlots = () => {
    setSlots((prev) =>
      prev.map((s) => ({
        ...s,
        card: null,
        reversed: false,
      }))
    );
  };

  const handleAutoFillRemainingRandomly = () => {
    try {
      playAudioHaptic('card_draw');
    } catch (_) {}

    const usedIds = new Set(slots.filter((s) => s.card).map((s) => s.card!.id));
    const available = TAROT_DECK.filter((c) => !usedIds.has(c.id));
    let availIdx = 0;

    setSlots((prev) =>
      prev.map((s) => {
        if (s.card) return s;
        const randomCard = available[availIdx++];
        return {
          ...s,
          card: randomCard || null,
          reversed: Math.random() > 0.65,
        };
      })
    );
  };

  const allFilled = slots.every((s) => s.card !== null);

  const handleSubmit = () => {
    if (!allFilled) return;
    try {
      playAudioHaptic('success');
    } catch (_) {}

    const completedEntries: SelectedTarotCardEntry[] = slots.map((s) => ({
      ...s.card!,
      reversed: s.reversed,
    }));

    onComplete(completedEntries, concern.trim());
    onClose();
  };

  const quickQuestions = [
    '그 사람의 진심과 앞으로의 관계 흐름',
    '이직/커리어 전환에서 제가 취해야 할 최적의 선택',
    '현재 금전운의 막힘을 풀고 번영을 여는 열쇠',
    '지금 내 마음에 가장 절실한 치유의 메시지',
  ];

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

        {/* Modal Main Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[92vh] bg-zinc-950/95 border border-yellow-500/40 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(234,179,8,0.2)] flex flex-col overflow-hidden text-white z-10"
        >
          {/* Top Header */}
          <div className="relative flex items-center justify-between px-5 sm:px-7 py-4.5 border-b border-white/10 bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 border border-yellow-400/40 flex items-center justify-center text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                <BookOpen size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-yellow-200">
                    실물 타로 카드 직접 입력 (Physical Draw)
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-400/30">
                    Quin 스타일 셀프 픽
                  </span>
                </div>
                <p className="text-xs text-white/60">
                  직접 소장하신 실물 카드로 뽑은 결과나 원하는 카드를 지정하여 천상의 AI 심층 해석을 받으세요.
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

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6 space-y-6 text-left">
            {/* Step 1: Question Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-yellow-400/90 uppercase tracking-wider flex items-center gap-1.5">
                <Wand2 size={12} />
                <span>질문 또는 고민 입력</span>
              </label>
              <input
                type="text"
                value={concern}
                onChange={(e) => setConcern(e.target.value)}
                placeholder="예: 그 사람과의 재회 가능성과 앞으로의 조언을 듣고 싶어요"
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-yellow-500/30 text-white placeholder-white/40 text-xs sm:text-sm focus:outline-none focus:border-yellow-400 focus:bg-white/10 transition-all shadow-inner"
              />
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setConcern(q)}
                    className="flex-none px-3 py-1 rounded-xl bg-white/5 hover:bg-yellow-500/15 border border-white/10 hover:border-yellow-500/30 text-[11px] text-white/70 hover:text-yellow-200 transition-all cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Spread Cards Count Selector */}
            <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-yellow-400" />
                <span className="text-xs font-bold text-white">스프레드 카드 장수 선택:</span>
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                  {[1, 2, 3, 4, 5, 7].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleSpreadCountChange(num)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        spreadCount === num
                          ? 'bg-yellow-500 text-black shadow-md'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {num}장
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAutoFillRemainingRandomly}
                  className="px-3 py-1.5 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 text-yellow-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="비어있는 슬롯을 78장 덱에서 무작위로 채웁니다"
                >
                  <Sparkles size={12} />
                  <span>남은 슬롯 자동 채우기</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetAllSlots}
                  className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs transition-all cursor-pointer flex items-center gap-1"
                  title="선택한 카드 초기화"
                >
                  <Trash2 size={12} />
                  <span>초기화</span>
                </button>
              </div>
            </div>

            {/* Step 3: Card Slots Layout */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-white/70">
                <span className="font-bold text-yellow-300">슬롯별 실물 카드 배치</span>
                <span>
                  완료: <strong className="text-yellow-400">{slots.filter((s) => s.card).length}</strong> / {spreadCount}장
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {slots.map((slot, index) => {
                  const hasCard = slot.card !== null;

                  return (
                    <div
                      key={index}
                      className={`relative rounded-2xl border p-3.5 flex flex-col justify-between min-h-[175px] transition-all ${
                        hasCard
                          ? 'bg-zinc-900/90 border-yellow-400/50 shadow-[0_4px_20px_rgba(234,179,8,0.15)]'
                          : 'bg-white/[0.02] border-dashed border-white/20 hover:border-yellow-400/40 hover:bg-white/[0.04]'
                      }`}
                    >
                      {/* Slot Header */}
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="text-[11px] font-bold text-yellow-400/90 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 flex items-center justify-center text-[10px]">
                            {index + 1}
                          </span>
                          <span className="truncate max-w-[140px]">{slot.positionLabel}</span>
                        </span>

                        {hasCard && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleToggleSlotReversed(index)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-all cursor-pointer ${
                                slot.reversed
                                  ? 'bg-rose-950 border border-rose-500/80 text-rose-300'
                                  : 'bg-emerald-950 border border-emerald-500/80 text-emerald-300'
                              }`}
                              title="정방향 / 역방향 전환"
                            >
                              {slot.reversed ? '⬇️ 역방향' : '⬆️ 정방향'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleClearSlot(index)}
                              className="text-white/40 hover:text-rose-400 p-0.5 rounded transition-colors cursor-pointer"
                              title="슬롯 비우기"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Slot Content */}
                      {!hasCard ? (
                        <button
                          type="button"
                          onClick={() => {
                            setPickerReversed(false);
                            setActivePickerSlotIndex(index);
                          }}
                          className="flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-xl border border-white/10 hover:border-yellow-400/60 hover:bg-yellow-500/10 text-white/50 hover:text-yellow-200 transition-all cursor-pointer group"
                        >
                          <div className="w-9 h-9 rounded-full bg-white/5 group-hover:bg-yellow-500/20 flex items-center justify-center text-white/60 group-hover:text-yellow-300 transition-colors">
                            <Sparkles size={16} />
                          </div>
                          <span className="text-xs font-bold">카드 선택하기 (+)</span>
                        </button>
                      ) : (
                        <div
                          onClick={() => {
                            setPickerReversed(slot.reversed);
                            setActivePickerSlotIndex(index);
                          }}
                          className="flex-1 flex items-center gap-3.5 p-2 rounded-xl bg-black/60 border border-white/10 hover:border-yellow-400/40 cursor-pointer transition-all group"
                          title="클릭하여 다른 카드로 변경"
                        >
                          {/* Thumbnail */}
                          <div className="w-14 h-22 relative rounded-lg overflow-hidden shrink-0 border border-yellow-500/40 shadow-md">
                            <img
                              src={getTarotCardImageUrl(slot.card!)}
                              alt={slot.card!.name}
                              style={{ transform: slot.reversed ? 'rotate(180deg)' : undefined }}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            {slot.reversed && (
                              <div className="absolute top-1 right-1 px-1 py-0.2 rounded bg-rose-950/90 text-rose-300 text-[6px] font-mono font-bold">
                                REV
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="min-w-0 flex-1 space-y-1">
                            <p className="text-xs font-bold text-yellow-200 truncate">
                              {slot.card!.nameKo}
                            </p>
                            <p className="text-[10px] text-white/50 font-mono uppercase truncate">
                              {slot.card!.name}
                            </p>
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white/70">
                                {slot.card!.type}
                              </span>
                              <span className="text-[9px] text-yellow-400/80">
                                {slot.reversed ? '역방향(주의)' : '정방향(핵심)'}
                              </span>
                            </div>
                            <p className="text-[9px] text-white/40 truncate">
                              {slot.card!.keywords.slice(0, 3).join(', ')}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="px-6 py-4 border-t border-white/10 bg-black/60 flex items-center justify-between flex-wrap gap-3">
            <div className="text-xs text-white/60">
              {!allFilled ? (
                <span className="text-amber-400/90 flex items-center gap-1">
                  <HelpCircle size={14} />
                  모든 슬롯에 카드를 지정해주세요 ({slots.filter((s) => s.card).length}/{spreadCount})
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check size={14} />
                  준비 완료: {spreadCount}장의 카드가 정확히 배치되었습니다.
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!allFilled}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(234,179,8,0.4)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95"
              >
                <Sparkles size={14} />
                <span>AI 심층 리딩 시작하기</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Nested Card Picker Modal (78 Cards) */}
        {activePickerSlotIndex !== null && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-3 sm:p-5 font-sans">
            <div
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setActivePickerSlotIndex(null)}
            />

            <div className="relative w-full max-w-3xl max-h-[85vh] bg-zinc-950 border border-yellow-500/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white z-10">
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 bg-zinc-900/80 flex items-center justify-between">
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-yellow-300 flex items-center gap-2">
                    <span>
                      {activePickerSlotIndex + 1}번 슬롯 카드 선택: {slots[activePickerSlotIndex]?.positionLabel}
                    </span>
                  </h4>
                  <p className="text-xs text-white/50">
                    78장 라이더-웨이트 덱에서 카드를 찾아 탭하세요.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePickerSlotIndex(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Search & Orientation Toggle Bar */}
              <div className="p-4 border-b border-white/10 bg-zinc-900/40 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Search
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="카드 이름 또는 키워드 검색 (예: 바보, 마법사, 태양, 연인, wands...)"
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  {/* Orientation Toggle */}
                  <button
                    type="button"
                    onClick={() => setPickerReversed((prev) => !prev)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      pickerReversed
                        ? 'bg-rose-900/60 border border-rose-500 text-rose-200 shadow-md'
                        : 'bg-emerald-900/60 border border-emerald-500 text-emerald-200'
                    }`}
                  >
                    <ArrowUpDown size={13} />
                    <span>{pickerReversed ? '역방향 (Reversed)' : '정방향 (Upright)'}</span>
                  </button>
                </div>

                {/* Suit Filter Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 [scrollbar-width:none]">
                  {[
                    { key: 'all', label: '전체 (78)' },
                    { key: 'major', label: '메이저 (22)' },
                    { key: 'wands', label: '완드 (14)' },
                    { key: 'cups', label: '컵 (14)' },
                    { key: 'swords', label: '검 (14)' },
                    { key: 'pentacles', label: '펜타클 (14)' },
                  ].map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => setSuitFilter(cat.key as any)}
                      className={`flex-none px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        suitFilter === cat.key
                          ? 'bg-yellow-500 text-black'
                          : 'bg-white/5 text-white/60 hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cards Grid */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {filteredDeck.map((card, idx) => {
                  const alreadyUsedIndex = slots.findIndex((s) => s.card?.id === card.id);
                  const isCurrentSlot = alreadyUsedIndex === activePickerSlotIndex;

                  return (
                    <motion.button
                      key={card.id}
                      type="button"
                      initial={{ opacity: 0, scale: 0.92, y: 12 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.28, delay: Math.min((idx % 18) * 0.03, 0.45) }}
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleSelectCardForSlot(card)}
                      className={`relative rounded-xl border p-1.5 flex flex-col items-center gap-1.5 transition-colors cursor-pointer group text-left ${
                        isCurrentSlot
                          ? 'bg-yellow-500/20 border-yellow-400 shadow-lg'
                          : alreadyUsedIndex !== -1
                          ? 'bg-white/5 border-white/20 opacity-60 hover:opacity-100'
                          : 'bg-white/[0.03] border-white/10 hover:border-yellow-500/60 hover:bg-white/[0.08]'
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="w-full aspect-[2/3] relative rounded-lg overflow-hidden bg-black/60">
                        <img
                          src={getTarotCardImageUrl(card)}
                          alt={card.name}
                          style={{ transform: pickerReversed ? 'rotate(180deg)' : undefined }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {pickerReversed && (
                          <div className="absolute top-1 right-1 px-1 rounded bg-rose-950/90 text-rose-300 text-[6px] font-mono font-bold">
                            REV
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <div className="w-full px-0.5">
                        <p className="text-[11px] font-bold text-white truncate leading-tight">
                          {card.nameKo}
                        </p>
                        <p className="text-[8px] text-white/50 truncate font-mono">
                          {card.name}
                        </p>
                      </div>

                      {alreadyUsedIndex !== -1 && (
                        <span className="w-full text-center text-[8px] font-bold text-yellow-400 bg-yellow-500/10 rounded py-0.5">
                          {alreadyUsedIndex + 1}번 슬롯 지정됨
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};

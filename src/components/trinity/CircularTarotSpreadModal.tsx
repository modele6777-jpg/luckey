import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Compass,
  Sparkles,
  Check,
  RotateCcw,
  Layers,
  ZoomIn,
} from 'lucide-react';
import { type TarotCard } from '@/data/tarotData';
import { CircularTarotSpread } from './CircularTarotSpread';

export interface CircularTarotSpreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCard?: (card: TarotCard) => void;
}

export const CircularTarotSpreadModal: React.FC<CircularTarotSpreadModalProps> = ({
  isOpen,
  onClose,
  onSelectCard,
}) => {
  const [pickedCard, setPickedCard] = useState<TarotCard | null>(null);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 overflow-y-auto no-scrollbar">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto no-scrollbar rounded-3xl bg-zinc-950/95 border border-amber-400/30 shadow-2xl p-4 sm:p-7 flex flex-col items-center justify-start z-10"
        >
          {/* Header */}
          <div className="w-full flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-sm">
                <Compass size={18} className="text-amber-400 animate-spin" style={{ animationDuration: '30s' }} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white font-serif flex items-center gap-2">
                  <span>무결점 원형 타로 스프레드</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-sans">
                    Zero-Occlusion Iris
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-400 font-sans">
                  원형 궤도를 온전히 유지하며 이중 가림 없이 모든 카드가 선명하게 펼쳐지는 프리미엄 원형 타로 스프레드
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              title="닫기"
            >
              <X size={16} />
            </button>
          </div>

          {/* Core Circular Spread Component */}
          <div className="w-full flex flex-col items-center justify-center py-2">
            <CircularTarotSpread
              onSelectCard={(card) => {
                setPickedCard(card);
              }}
              selectedCardId={pickedCard?.id}
            />
          </div>

          {/* Bottom Action Footer if card picked */}
          {pickedCard && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full mt-4 p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-between gap-3 shrink-0"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles size={16} className="text-amber-400 animate-pulse" />
                <div>
                  <span className="text-[10px] font-mono text-amber-300 font-bold block">
                    선택된 타로 카드
                  </span>
                  <span className="text-sm font-bold text-white font-serif">
                    {pickedCard.nameKo} <span className="text-xs text-zinc-400 font-normal">({pickedCard.name})</span>
                  </span>
                </div>
              </div>

              {onSelectCard && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectCard(pickedCard);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-bold text-xs shadow-lg shadow-amber-400/20 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <Check size={14} />
                  <span>이 카드로 선택 완료</span>
                </button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CircularTarotSpreadModal;

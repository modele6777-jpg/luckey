import React, { useState, useEffect } from 'react';
import { DuoTarotBookSpread } from './DuoTarotBookSpread';
import { DuoCosmicAmbientRoom } from './DuoCosmicAmbientRoom';
import { BookOpen, Compass } from 'lucide-react';
import { DetectedTarotCard } from '@/utils/tarotDetector';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';

interface DuoDualPaneContainerProps {
  latestTarotCards?: DetectedTarotCard[];
  verifiedDraw?: boolean;
  revealedCardIds?: string[];
  onRevealCard?: (cardId: string) => void;
  onScrollToReading?: (cardId: string) => void;
  onQuickDraw?: (promptText: string) => void;
  isLight?: boolean;
}

export const DuoDualPaneContainer: React.FC<DuoDualPaneContainerProps> = ({
  latestTarotCards = [],
  verifiedDraw = false,
  revealedCardIds = [],
  onRevealCard,
  onScrollToReading,
  onQuickDraw,
  isLight = false,
}) => {
  const hasTarotCards = latestTarotCards && latestTarotCards.length > 0;
  const [activeTab, setActiveTab] = useState<'tarot' | 'cosmic'>(hasTarotCards ? 'tarot' : 'cosmic');

  // 새로운 타로 카드가 감지되면 자동으로 타로 북스프레드 탭 활성화
  useEffect(() => {
    if (hasTarotCards) {
      setActiveTab('tarot');
    }
  }, [hasTarotCards]);

  return (
    <div className="h-full w-full flex flex-col border-r border-white/10 overflow-hidden relative">
      {/* 듀오 좌측 상단 탭 전환 스위처 */}
      <div className="flex items-center px-3 py-2 bg-slate-950/90 border-b border-white/10 shrink-0 gap-1.5 z-20">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('whitehole');
            setActiveTab('tarot');
          }}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
            activeTab === 'tarot'
              ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-xs'
              : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <BookOpen size={14} className={activeTab === 'tarot' ? 'text-amber-400' : ''} />
          <span>타로 북스프레드</span>
          {hasTarotCards && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('whitehole');
            setActiveTab('cosmic');
          }}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
            activeTab === 'cosmic'
              ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-xs'
              : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <Compass size={14} className={activeTab === 'cosmic' ? 'text-amber-400' : ''} />
          <span>마스터 코스믹 룸</span>
        </button>
      </div>

      {/* 탭 내용 영역 */}
      <div className="flex-1 min-h-0 relative">
        {activeTab === 'tarot' ? (
          <DuoTarotBookSpread
            cards={latestTarotCards}
            verifiedDraw={verifiedDraw}
            revealedCardIds={revealedCardIds}
            onRevealCard={onRevealCard}
            onScrollToReading={onScrollToReading}
            onQuickDraw={onQuickDraw}
            isLight={isLight}
          />
        ) : (
          <DuoCosmicAmbientRoom isLight={isLight} />
        )}
      </div>
    </div>
  );
};

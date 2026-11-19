import React, { useEffect, useState } from 'react';
import { DuoTarotBookSpread } from './DuoTarotBookSpread';
import type { DetectedTarotCard } from '@/utils/tarotDetector';
import { LUCY_TAROT_DRAWN_EVENT, LUCY_MASTER_MODE_EVENT } from '@/lib/lucyMasterMode';
import { requestLucyAction } from '@/lib/duoLucyActionRouting';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';

/**
 * 🔮 펼친 화면 점술모드의 왼쪽 타로 테이블.
 * 루시 채팅에서 실제로 뽑힌 카드를 받아 바로 펼치고, 손님이 한 장씩 뒤집어 본다.
 * 카드가 없을 때의 빠른 뽑기 버튼은 오른쪽 루시에게 그대로 말을 건다.
 */
export function DuoDivinationTarotPane({ isLight = false }: { isLight?: boolean }) {
  const [cards, setCards] = useState<DetectedTarotCard[]>([]);
  const [revealed, setRevealed] = useState<string[]>([]);

  useEffect(() => {
    const handleDrawn = (e: Event) => {
      const next = (e as CustomEvent)?.detail?.cards as DetectedTarotCard[] | undefined;
      if (!Array.isArray(next) || next.length === 0) return;
      setCards(next);
      setRevealed([]);
      triggerHaptic('whitehole');
    };
    // 루시 마스터를 나갔다 들어오면 테이블도 비운다
    const handleMode = () => { setCards([]); setRevealed([]); };
    window.addEventListener(LUCY_TAROT_DRAWN_EVENT, handleDrawn);
    window.addEventListener(LUCY_MASTER_MODE_EVENT, handleMode);
    return () => {
      window.removeEventListener(LUCY_TAROT_DRAWN_EVENT, handleDrawn);
      window.removeEventListener(LUCY_MASTER_MODE_EVENT, handleMode);
    };
  }, []);

  return (
    <div className="w-full h-full overflow-hidden flex flex-col" data-duo-divination-tarot="true">
      <DuoTarotBookSpread
        cards={cards}
        verifiedDraw
        revealedCardIds={revealed}
        onRevealCard={(cardId) => setRevealed(prev => (prev.includes(cardId) ? prev : [...prev, cardId]))}
        onQuickDraw={(prompt) => requestLucyAction({ prompt })}
        isLight={isLight}
      />
    </div>
  );
}

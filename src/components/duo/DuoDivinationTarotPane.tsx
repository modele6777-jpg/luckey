import React, { useEffect, useState } from 'react';
import { DuoTarotBookSpread } from './DuoTarotBookSpread';
import { TarotSpread } from '@/components/trinity/TarotSpread';
import type { DetectedTarotCard } from '@/utils/tarotDetector';
import {
  LUCY_TAROT_DRAWN_EVENT,
  LUCY_MASTER_MODE_EVENT,
  LUCY_TAROT_PICK_REQUEST_EVENT,
  LUCY_TAROT_PICKED_EVENT,
  LUCY_TAROT_PICK_CANCEL_EVENT,
  tarotPickPositions,
  queueMasterTarotSpread,
  toDetectedTarotCards,
  type TarotPickRequest,
} from '@/lib/lucyMasterMode';
import { requestLucyAction } from '@/lib/duoLucyActionRouting';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';
import { LucyMasterTarotRoom } from '@/components/chat/LucyMasterTarotRoom';

/**
 * 🔮 펼친 화면 점술모드의 왼쪽 타로 테이블.
 * 루시가 카드를 뽑자고 하면 이곳에 78장 스프레드가 열리고, 손님이 직접 섞고(셔플) 골라서 루시에게 건넨다.
 * 고른 카드는 그대로 테이블에 펼쳐져 한 장씩 뒤집어 볼 수 있다.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function DuoDivinationTarotPane(_props: { isLight?: boolean }) {
  const [cards, setCards] = useState<DetectedTarotCard[]>([]);
  const [revealed, setRevealed] = useState<string[]>([]);
  const [pick, setPick] = useState<TarotPickRequest | null>(null);

  useEffect(() => {
    const handleDrawn = (e: Event) => {
      const next = (e as CustomEvent)?.detail?.cards as DetectedTarotCard[] | undefined;
      if (!Array.isArray(next) || next.length === 0) return;
      setCards(next);
      setRevealed([]);
      triggerHaptic('whitehole');
    };
    const handlePickRequest = (e: Event) => {
      const detail = (e as CustomEvent)?.detail as TarotPickRequest | undefined;
      if (detail?.count) setPick(detail);
    };
    // 루시 마스터를 나갔다 들어오면 테이블도 비운다
    const handleMode = () => { setCards([]); setRevealed([]); setPick(null); };
    window.addEventListener(LUCY_TAROT_DRAWN_EVENT, handleDrawn);
    window.addEventListener(LUCY_TAROT_PICK_REQUEST_EVENT, handlePickRequest);
    window.addEventListener(LUCY_MASTER_MODE_EVENT, handleMode);
    return () => {
      window.removeEventListener(LUCY_TAROT_DRAWN_EVENT, handleDrawn);
      window.removeEventListener(LUCY_TAROT_PICK_REQUEST_EVENT, handlePickRequest);
      window.removeEventListener(LUCY_MASTER_MODE_EVENT, handleMode);
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col" data-duo-divination-tarot="true" data-theme-dark-island="true" style={{ colorScheme: 'dark' }}>
      {/* Same purple velvet and candles as the Lucy Master chat, so both panes read as one room. */}
      <LucyMasterTarotRoom variant="table" />
      <div className="relative z-[1] flex-1 min-h-0 flex flex-col">
      <DuoTarotBookSpread
        masterRoom
        cards={cards}
        verifiedDraw
        revealedCardIds={revealed}
        onRevealCard={(cardId) => setRevealed(prev => (prev.includes(cardId) ? prev : [...prev, cardId]))}
        onQuickDraw={(prompt, spread) => { if (spread) queueMasterTarotSpread(spread); requestLucyAction({ prompt }); }}
        isLight={false}
      />
      </div>
      {pick && (
        <TarotSpread
          maxCards={pick.count}
          positions={pick.positions?.length ? pick.positions : tarotPickPositions(pick.count)}
          concern={pick.concern || ''}
          spreadName={pick.spreadName || '루시의 타로 테이블'}
          spreadReason={pick.spreadReason || '카드를 섞고, 마음이 가는 카드를 직접 골라줘'}
          ambience="master"
          allowReversed
          onCancel={() => {
            setPick(null);
            window.dispatchEvent(new CustomEvent(LUCY_TAROT_PICK_CANCEL_EVENT));
          }}
          onComplete={(picked) => {
            setPick(null);
            window.dispatchEvent(new CustomEvent(LUCY_TAROT_PICKED_EVENT, { detail: { cards: toDetectedTarotCards(picked) } }));
          }}
        />
      )}
    </div>
  );
}

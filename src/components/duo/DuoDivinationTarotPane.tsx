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
  LUCY_MASTER_DEPTH_EVENT as LUCY_MASTER_DEPTH_EVENT_NAME,
  useLucyMasterDepth,
  getLucyMasterDepth,
  type TarotPickRequest,
} from '@/lib/lucyMasterMode';
import { requestLucyAction } from '@/lib/duoLucyActionRouting';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';
import { LucyMasterTarotRoom } from '@/components/chat/LucyMasterTarotRoom';
import { MasterSajuBoard } from './MasterSajuBoard';
import { MasterReadingStage } from './MasterReadingStage';
import { MasterDailyCard } from './MasterDailyCard';
import { getLucyTableState, clearTableTools, LUCY_TABLE_EVENT, type LucyTableState } from '@/lib/lucyTableBus';
import { MasterToolBoard } from './MasterToolBoard';
import { useTTSState } from '@/utils/tts';

type TableFace = 'tarot' | 'saju' | 'tools';
const FACES: { id: TableFace | 'reading'; label: string }[] = [
  { id: 'tarot', label: '🃏 타로' },
  { id: 'saju', label: '☯ 사주 원국' },
  { id: 'tools', label: '🧭 13대 도구' },
  { id: 'reading', label: '🔊 낭독' },
];

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
  // 왼쪽 테이블의 면: 처음엔 사주 원국판. 루시가 지금 하는 일을 따라 자동으로 바뀌고, 탭으로 직접 바꿀 수도 있다.
  const [face, setFace] = useState<TableFace>('saju');
  const [table, setTable] = useState<LucyTableState>(() => getLucyTableState());
  // 1단계는 사주 원국만, 2단계부터 타로 화면이 테이블에 더해진다.
  // (1단계라도 손님이 직접 카드를 뽑았다면 그 카드는 볼 수 있게 둔다.)
  const depth = useLucyMasterDepth();
  const tarotAvailable = depth >= 2 || cards.length > 0 || Boolean(pick);
  const toolsAvailable = depth >= 3;
  const shownFace: TableFace = (face === 'tarot' && !tarotAvailable) || (face === 'tools' && !toolsAvailable) ? 'saju' : face;
  const tts = useTTSState();
  const reading = Boolean(tts.isSpeaking || tts.isLoading);
  const [readingDismissed, setReadingDismissed] = useState(false);
  useEffect(() => { if (!reading) setReadingDismissed(false); }, [reading]);
  const showReading = reading && !readingDismissed;

  useEffect(() => {
    const onTable = (e: Event) => {
      const next = (e as CustomEvent<LucyTableState>).detail;
      if (!next) return;
      setTable(prev => {
        // 새 답변이 오면: 카드가 있으면 타로, 사주만으로 답했으면 사주 원국판.
        // 새 답변이 오면: 카드가 있으면 타로, 3단계면 13대 도구, 아니면 사주 원국판.
        if (next.answerVersion !== prev.answerVersion) setFace(next.lastAnswerHasTarot ? 'tarot' : getLucyMasterDepth() >= 3 ? 'tools' : 'saju');
        return next;
      });
    };
    window.addEventListener(LUCY_TABLE_EVENT, onTable);
    return () => window.removeEventListener(LUCY_TABLE_EVENT, onTable);
  }, []);

  useEffect(() => {
    const handleDrawn = (e: Event) => {
      const next = (e as CustomEvent)?.detail?.cards as DetectedTarotCard[] | undefined;
      if (!Array.isArray(next) || next.length === 0) return;
      setCards(next);
      setRevealed([]);
      setFace('tarot');
      triggerHaptic('whitehole');
    };
    const handlePickRequest = (e: Event) => {
      const detail = (e as CustomEvent)?.detail as TarotPickRequest | undefined;
      if (detail?.count) { setPick(detail); setFace('tarot'); }
    };
    // 루시 마스터를 나갔다 들어오면 테이블도 비운다
    const handleMode = () => { setCards([]); setRevealed([]); setPick(null); setFace('saju'); clearTableTools(); };
    // 단계에 맞춰 테이블 면도 바꾼다: 1단계 사주 원국, 2단계부터 타로.
    const handleDepth = (e: Event) => {
      const depth = (e as CustomEvent<{ depth?: number; changed?: boolean }>)?.detail;
      if (!depth?.changed) return;
      setFace(depth.depth === 1 ? 'saju' : depth.depth === 2 ? 'tarot' : 'tools');
    };
    window.addEventListener(LUCY_MASTER_DEPTH_EVENT_NAME, handleDepth);
    window.addEventListener(LUCY_TAROT_DRAWN_EVENT, handleDrawn);
    window.addEventListener(LUCY_TAROT_PICK_REQUEST_EVENT, handlePickRequest);
    window.addEventListener(LUCY_MASTER_MODE_EVENT, handleMode);
    return () => {
      window.removeEventListener(LUCY_TAROT_DRAWN_EVENT, handleDrawn);
      window.removeEventListener(LUCY_TAROT_PICK_REQUEST_EVENT, handlePickRequest);
      window.removeEventListener(LUCY_MASTER_MODE_EVENT, handleMode);
      window.removeEventListener(LUCY_MASTER_DEPTH_EVENT_NAME, handleDepth);
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col" data-duo-divination-tarot="true" data-theme-dark-island="true" style={{ colorScheme: 'dark' }}>
      {/* Same purple velvet and candles as the Lucy Master chat, so both panes read as one room. */}
      <LucyMasterTarotRoom variant="table" />
      <div className="relative z-[1] flex-1 min-h-0 flex flex-col">
        {/* 테이블 면 바꾸기 탭 (낭독은 루시가 읽는 동안에만) */}
        <div className="shrink-0 flex items-center gap-1.5 px-3.5 pt-3 pb-1" role="tablist" aria-label="타로 테이블 보기">
          {FACES.filter(item => (item.id !== 'reading' || reading) && (item.id !== 'tarot' || tarotAvailable) && (item.id !== 'tools' || toolsAvailable)).map(item => {
            const active = item.id === 'reading' ? showReading : !showReading && shownFace === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                data-table-face={item.id}
                onClick={() => {
                  triggerHaptic('whitehole');
                  if (item.id === 'reading') { setReadingDismissed(false); return; }
                  setReadingDismissed(reading);
                  setFace(item.id);
                }}
                className={`rounded-full border px-3 py-1 text-[11px] font-bold transition-colors ${active ? 'border-amber-300/80 bg-amber-400/20 text-amber-100' : 'border-white/15 bg-white/[0.05] text-slate-200 hover:bg-white/10'}`}
              >{item.label}</button>
            );
          })}
        </div>
        {showReading ? (
          <MasterReadingStage />
        ) : shownFace === 'tools' ? (
          <MasterToolBoard tools={table.tools} concern={table.concern} lastAnswer={table.lastAnswer} />
        ) : shownFace === 'saju' ? (
          <MasterSajuBoard saju={table.saju} lastAnswer={table.lastAnswer} />
        ) : (
          <>
            {cards.length === 0 && <MasterDailyCard />}
            <div className="flex-1 min-h-0 flex flex-col">
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
          </>
        )}
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

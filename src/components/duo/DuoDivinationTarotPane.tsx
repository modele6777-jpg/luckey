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
import { MasterSajuBoard } from './MasterSajuBoard';
import { MasterReadingStage } from './MasterReadingStage';
import { MasterDailyCard } from './MasterDailyCard';
import { MasterToolTabPanel } from './MasterToolTabPanel';
import { DivinationToolTabBar, resolveToolTabViews } from './MasterToolTabs';
import { getLucyTableState, clearTableTools, LUCY_TABLE_EVENT, type LucyTableState } from '@/lib/lucyTableBus';
import type { DivinationToolId } from '@/lib/fifteenDivinationTools';
import { useTTSState } from '@/utils/tts';
import { CosmicRoomHeader } from './DuoCosmicAmbientRoom';

/**
 * 🔮 펼친 화면 점술모드의 왼쪽 점술 테이블.
 * 탭은 사주 원국 · 타로 · 나머지 13개 기초 도구 (엔진함·추천 도구·양피지 탭은 없앴다).
 * 루시가 카드를 뽑자고 하면 이곳에 78장 스프레드가 열리고, 손님이 직접 섞고 골라서 루시에게 건넨다.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function DuoDivinationTarotPane(_props: { isLight?: boolean }) {
  const [cards, setCards] = useState<DetectedTarotCard[]>([]);
  const [revealed, setRevealed] = useState<string[]>([]);
  const [pick, setPick] = useState<TarotPickRequest | null>(null);
  // 통합 상담: 들어오면 사주 원국에서 시작하고, 그 뒤에는 사용자가 탭으로 고른 화면을 유지한다.
  const [tab, setTab] = useState<DivinationToolId>('saju');
  const [table, setTable] = useState<LucyTableState>(() => getLucyTableState());
  const tabViews = resolveToolTabViews(table);
  const activeTab = tabViews.find(view => view.id === tab && !view.locked)?.id
    ?? (tabViews.find(view => !view.locked)?.id ?? 'saju') as DivinationToolId;
  const tts = useTTSState();
  const reading = Boolean(tts.isSpeaking || tts.isLoading);
  const [readingDismissed, setReadingDismissed] = useState(false);
  useEffect(() => { if (!reading) setReadingDismissed(false); }, [reading]);
  const showReading = reading && !readingDismissed;

  useEffect(() => {
    const onTable = (e: Event) => {
      const next = (e as CustomEvent<LucyTableState>).detail;
      if (next) setTable(next);
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
      setTab('tarot');
      triggerHaptic('whitehole');
    };
    const handlePickRequest = (e: Event) => {
      const detail = (e as CustomEvent)?.detail as TarotPickRequest | undefined;
      if (detail?.count) { setPick(detail); setTab('tarot'); }
    };
    // 루시프로를 나갔다 들어오면 테이블도 비운다
    const handleMode = () => { setCards([]); setRevealed([]); setPick(null); setTab('saju'); clearTableTools(); };
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
        {/* 🔮 Cosmic Pro 헤더: 오른쪽 루시 마스터 헤더와 높이·선이 한 줄로 이어진다 */}
        <CosmicRoomHeader isLight={false} title="Cosmic Pro" guideId="cosmic-pro" />
        {/* 도구 탭: 15개를 가로 스크롤로 (낭독은 루시가 읽는 동안에만) */}
        <DivinationToolTabBar
          table={table}
          activeTab={showReading ? 'reading' : activeTab}
          onSelect={id => { setReadingDismissed(reading); setTab(id); }}
          readingTab={reading ? { active: showReading, onSelect: () => setReadingDismissed(false) } : undefined}
        />
        {showReading ? (
          <MasterReadingStage />
        ) : tab === 'saju' ? (
          <MasterSajuBoard saju={table.saju} lastAnswer={table.lastAnswer} />
        ) : tab === 'tarot' ? (
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
        ) : (
          <MasterToolTabPanel toolId={tab} table={table} />
        )}
      </div>
      {pick && (
        <TarotSpread
          maxCards={pick.count}
          positions={pick.positions?.length ? pick.positions : tarotPickPositions(pick.count)}
          concern={pick.concern || ''}
          spreadName={pick.spreadName || '루시의 타로 테이블'}
          spreadReason={pick.spreadReason || '카드를 섞고, 마음 가는 카드를 직접 골라줘'}
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

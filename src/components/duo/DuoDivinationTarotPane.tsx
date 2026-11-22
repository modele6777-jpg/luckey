import React, { useEffect, useReducer, useState } from 'react';
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
  LUCY_TABLE_FACE_EVENT,
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
import { LucyEngineCatalogPanel } from '@/components/chat/LucyEngineCatalogDialog';
import { useTTSState } from '@/utils/tts';
import { CosmicRoomHeader } from './DuoCosmicAmbientRoom';
import { getLucyMasterDefaultTableFace, reduceLucyMasterTableFace, type LucyMasterTableFace } from '@/lib/lucyMasterTableFace';

type TableFace = LucyMasterTableFace;
/** 단계 순서대로 쌓인다: 1 사주 → 2 타로 → 3 추천 도구·12대 양피지. 낮은 단계 도구는 높은 단계에서도 언제든 탭해서 본다. */
const FACES: { id: TableFace; icon: string; label: string; stage: 1 | 2 | 3 }[] = [
  { id: 'saju', icon: '☯', label: '사주 원국', stage: 1 },
  { id: 'tarot', icon: '🃏', label: '타로', stage: 2 },
  { id: 'recommended', icon: '🧭', label: '추천 도구', stage: 3 },
  { id: 'scrolls', icon: '📜', label: '양피지', stage: 3 },
  // 엔진함: 모든 단계에서 볼 수 있는 엔진 이름·뜻 목록 (읽기 전용)
  { id: 'engines', icon: '📚', label: '엔진함', stage: 1 },
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
  // 단계가 바뀌면 기본 화면을 고르고, 같은 단계에서는 사용자가 탭으로 고른 화면을 유지한다.
  const [face, dispatchFace] = useReducer(reduceLucyMasterTableFace, getLucyMasterDepth(), getLucyMasterDefaultTableFace);
  const [table, setTable] = useState<LucyTableState>(() => getLucyTableState());
  // 1단계는 사주 원국만, 2단계부터 타로 화면이 테이블에 더해진다.
  // (1단계라도 손님이 직접 카드를 뽑았다면 그 카드는 볼 수 있게 둔다.)
  const depth = useLucyMasterDepth();
  const tarotAvailable = depth >= 2 || cards.length > 0 || Boolean(pick);
  const toolsAvailable = depth >= 3;
  // 양피지에서 "크게 보기"로 고른 도구. 새 도구 분석이 오면 포커스만 초기화한다.
  const [focusTool, setFocusTool] = useState<string | null>(null);
  useEffect(() => { setFocusTool(null); }, [table.tools]);
  const shownFace: TableFace = (face === 'tarot' && !tarotAvailable) || ((face === 'recommended' || face === 'scrolls') && !toolsAvailable) ? 'saju' : face;
  const tts = useTTSState();
  const reading = Boolean(tts.isSpeaking || tts.isLoading);
  const [readingDismissed, setReadingDismissed] = useState(false);
  useEffect(() => { if (!reading) setReadingDismissed(false); }, [reading]);
  const showReading = reading && !readingDismissed;

  useEffect(() => {
    const onTable = (e: Event) => {
      const next = (e as CustomEvent<LucyTableState>).detail;
      if (!next) return;
      setTable(next);
      dispatchFace({ type: 'answer-updated' });
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
      dispatchFace({ type: 'tarot-requested' });
      triggerHaptic('whitehole');
    };
    const handlePickRequest = (e: Event) => {
      const detail = (e as CustomEvent)?.detail as TarotPickRequest | undefined;
      if (detail?.count) { setPick(detail); dispatchFace({ type: 'tarot-requested' }); }
    };
    // 루시 마스터를 나갔다 들어오면 테이블도 비운다
    const handleMode = () => { setCards([]); setRevealed([]); setPick(null); dispatchFace({ type: 'mode-reset' }); clearTableTools(); };
    // 단계별 기본 화면: 1단계 사주, 2단계 타로, 3단계 추천 도구.
    const handleDepth = (e: Event) => {
      const depth = (e as CustomEvent<{ depth?: number; changed?: boolean }>)?.detail;
      if (!depth?.changed || typeof depth.depth !== 'number') return;
      dispatchFace({ type: 'stage-changed', depth: depth.depth, changed: true });
    };
    const handleFace = (e: Event) => {
      const next = (e as CustomEvent<{ face?: TableFace }>)?.detail?.face;
      if (next !== 'engines') return;
      setReadingDismissed(true);
      dispatchFace({ type: 'tab-selected', face: 'engines' });
    };
    window.addEventListener(LUCY_TABLE_FACE_EVENT, handleFace);
    window.addEventListener(LUCY_MASTER_DEPTH_EVENT_NAME, handleDepth);
    window.addEventListener(LUCY_TAROT_DRAWN_EVENT, handleDrawn);
    window.addEventListener(LUCY_TAROT_PICK_REQUEST_EVENT, handlePickRequest);
    window.addEventListener(LUCY_MASTER_MODE_EVENT, handleMode);
    return () => {
      window.removeEventListener(LUCY_TAROT_DRAWN_EVENT, handleDrawn);
      window.removeEventListener(LUCY_TAROT_PICK_REQUEST_EVENT, handlePickRequest);
      window.removeEventListener(LUCY_MASTER_MODE_EVENT, handleMode);
      window.removeEventListener(LUCY_TABLE_FACE_EVENT, handleFace);
      window.removeEventListener(LUCY_MASTER_DEPTH_EVENT_NAME, handleDepth);
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col" data-duo-divination-tarot="true" data-theme-dark-island="true" style={{ colorScheme: 'dark' }}>
      {/* Same purple velvet and candles as the Lucy Master chat, so both panes read as one room. */}
      <LucyMasterTarotRoom variant="table" />
      <div className="relative z-[1] flex-1 min-h-0 flex flex-col">
        {/* 🔮 Cosmic Pro 헤더: 오른쪽 루시 마스터 헤더와 높이·선이 한 줄로 이어진다 */}
        <CosmicRoomHeader isLight={false} title="Cosmic Pro" guideId="cosmic-pro" />
        {/* 테이블 면 바꾸기 탭 (낭독은 루시가 읽는 동안에만) */}
        <div className="shrink-0 flex items-stretch gap-1 px-3 pt-3 pb-1.5" role="tablist" aria-label="점술 테이블 보기">
          {FACES.filter(item => (item.id !== 'tarot' || tarotAvailable) && ((item.id !== 'recommended' && item.id !== 'scrolls') || toolsAvailable)).map(item => {
            const active = !showReading && shownFace === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                data-table-face={item.id}
                onClick={() => {
                  triggerHaptic('whitehole');
                  setReadingDismissed(reading);
                  dispatchFace({ type: 'tab-selected', face: item.id });
                }}
                className={`relative flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl border px-1 py-1.5 transition-colors ${active ? 'border-amber-300/80 bg-amber-400/20 text-amber-50' : 'border-white/12 bg-white/[0.05] text-slate-200 hover:bg-white/10'}`}
              >
                <span className="text-[15px] leading-none" aria-hidden="true">{item.icon}</span>
                <span className="mt-0.5 max-w-full truncate text-[10.5px] font-bold leading-tight">{item.label}</span>
                <span className={`text-[8px] leading-none ${active ? 'text-amber-200/90' : 'text-slate-400'}`}>{item.id === 'engines' ? '목록' : `${item.stage}단계`}</span>
              </button>
            );
          })}
          {reading && (
            <button
              type="button"
              role="tab"
              aria-selected={showReading}
              data-table-face="reading"
              aria-label="낭독 보기"
              onClick={() => { triggerHaptic('whitehole'); setReadingDismissed(false); }}
              className={`flex w-11 shrink-0 flex-col items-center justify-center rounded-xl border py-1.5 ${showReading ? 'border-amber-300/80 bg-amber-400/20 text-amber-50' : 'border-white/12 bg-white/[0.05] text-slate-200'}`}
            >
              <span className="text-[15px] leading-none" aria-hidden="true">🔊</span>
              <span className="mt-0.5 text-[9.5px] font-bold">낭독</span>
            </button>
          )}
        </div>
        {showReading ? (
          <MasterReadingStage />
        ) : shownFace === 'recommended' || shownFace === 'scrolls' ? (
          <MasterToolBoard
            view={shownFace}
            tools={table.tools}
            concern={table.concern}
            lastAnswer={table.lastAnswer}
            facts={table.facts}
            toolData={table.toolData}
            focusId={focusTool}
            onFocusTool={(id) => { setFocusTool(id); dispatchFace({ type: 'tab-selected', face: 'recommended' }); }}
            onShowScrolls={() => { triggerHaptic('whitehole'); dispatchFace({ type: 'tab-selected', face: 'scrolls' }); }}
          />
        ) : shownFace === 'engines' ? (
          <LucyEngineCatalogPanel />
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

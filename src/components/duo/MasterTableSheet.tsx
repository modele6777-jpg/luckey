import { useCallback, useEffect, useMemo, useState } from 'react';
import { X, Pencil } from 'lucide-react';
import { ScreenPortal } from '@/components/layout/ScreenPortal';
import {
  clearDivinationToolRequest,
  clearEngineFocus,
  getLastDivinationToolRequest,
  getLucyTableState,
  LUCY_DIVINATION_TOOL_EVENT,
  LUCY_ENGINE_BOX_CLOSE_EVENT,
  LUCY_ENGINE_BOX_OPEN_EVENT,
  LUCY_TABLE_EVENT,
  type LucyTableState,
} from '@/lib/lucyTableBus';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';
import { MasterSajuBoard } from './MasterSajuBoard';
import { MasterToolTabPanel } from './MasterToolTabPanel';
import { DivinationToolTabBar, resolveToolTabViews } from './MasterToolTabs';
import { LucyDeepPerspectivePanel } from '@/components/chat/LucyEngineCatalogDialog';
import { LucyOrbToolIcon } from '@/components/icons/LucyOrbToolIcon';
import type { DivinationToolId } from '@/lib/fifteenDivinationTools';
import { isLucySheetButtonExpanded, pickActiveDivinationTab } from '@/lib/lucyToolSheetRouting';
import { dispatchLucySheet, getLucySheetState, useLucySheetState } from '@/lib/lucySheetStore';

/**
 * 📱 도구함 창(점술모드 오브 버튼 · 일반 채팅 연필 버튼).
 * - 점술모드: 사주 원국 · 타로 · 나머지 13개 기초 도구 = 15개 탭 (엔진함·추천 도구·양피지는 없앴다)
 * - 일반 채팅: 엔진함(심층 관점 설명)만
 */
export function MasterTableSheetBody({ table, variant, onClose }: {
  table: LucyTableState;
  variant: 'divination' | 'chat';
  onClose?: () => void;
}) {
  if (variant === 'chat') {
    return (
      <div className="flex h-full min-h-0 flex-col" data-tool-sheet-variant="chat">
        <div className="flex shrink-0 items-center gap-2 px-4 pt-3.5">
          <p className="flex-1 text-[14px] font-black text-amber-100">📚 엔진함 <span className="ml-1 text-[11px] font-bold text-amber-200/70">· 심층 관점 설명</span></p>
          {onClose && (
            <button type="button" onClick={onClose} aria-label="도구 창 닫기" className="flex h-8 w-8 items-center justify-center rounded-full text-slate-300 hover:bg-white/10"><X size={18} /></button>
          )}
        </div>
        <div className="flex min-h-0 flex-1 flex-col">
          <LucyDeepPerspectivePanel activeKeys={table.activeEngines.deep.map(item => item.key)} />
        </div>
      </div>
    );
  }

  return <DivinationTableBody table={table} onClose={onClose} />;
}

/** 점술모드 도구함: 15개 도구 탭 (가로 스크롤) + 선택한 도구 화면. */
export function DivinationTableBody({ table, onClose, compact = false }: {
  table: LucyTableState;
  onClose?: () => void;
  /** 접힌 화면 창(좁은 폭)에서는 탭을 더 작게 */
  compact?: boolean;
}) {
  const [tab, setTab] = useState<DivinationToolId>(() => getLastDivinationToolRequest()?.toolId ?? 'saju');
  // 답변 끝 도구 버튼으로 연 경우: 그 도구 탭을 그대로 보여준다 (탭을 직접 고르면 해제).
  const [requestedTab, setRequestedTab] = useState<DivinationToolId | null>(() => getLastDivinationToolRequest()?.toolId ?? null);
  useEffect(() => {
    const onRequest = (event: Event) => {
      const toolId = (event as CustomEvent<{ toolId?: DivinationToolId }>).detail?.toolId;
      if (!toolId) return;
      setRequestedTab(toolId);
      setTab(toolId);
    };
    window.addEventListener(LUCY_DIVINATION_TOOL_EVENT, onRequest);
    return () => window.removeEventListener(LUCY_DIVINATION_TOOL_EVENT, onRequest);
  }, []);
  const views = useMemo(() => resolveToolTabViews(table), [table]);
  // 잠긴 도구도 설명을 보려고 고를 수 있다. 원국·카드는 이번 질문에 쓴 뒤에만 연다.
  const activeTab = useMemo<DivinationToolId>(
    () => pickActiveDivinationTab(views, tab, requestedTab),
    [requestedTab, tab, views],
  );
  const used = views.find(view => view.id === activeTab)?.active === true;

  return (
    <div className="flex h-full min-h-0 flex-col" data-tool-sheet-variant="divination">
      <div className="flex shrink-0 items-center gap-2 px-4 pt-3.5">
        <p className="flex-1 text-[14px] font-black text-amber-100">🔮 점술 도구 <span className="ml-1 text-[11px] font-bold text-amber-200/70">· 사주·타로·13대 도구</span></p>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="도구 창 닫기" className="flex h-8 w-8 items-center justify-center rounded-full text-slate-300 hover:bg-white/10"><X size={18} /></button>
        )}
      </div>
      <DivinationToolTabBar table={table} activeTab={activeTab} onSelect={(id) => { setRequestedTab(null); setTab(id); }} compact={compact} />
      <div className="flex min-h-0 flex-1 flex-col">
        {activeTab === 'saju' && used ? (
          <MasterSajuBoard saju={table.saju} lastAnswer={table.lastAnswer} />
        ) : activeTab === 'tarot' && (used || table.cards.length > 0) ? (
          <DrawnCards cards={table.cards} />
        ) : (
          <MasterToolTabPanel toolId={activeTab} table={table} />
        )}
      </div>
    </div>
  );
}

/** 점술모드 접힌 화면의 도구 창 (화면 밖 포털 + 어두운 창). */
export function MasterTableSheet({ onClose, variant = 'divination' }: { onClose: () => void; variant?: 'divination' | 'chat' }) {
  const [table, setTable] = useState<LucyTableState>(() => getLucyTableState());

  useEffect(() => {
    const onTable = (e: Event) => {
      const next = (e as CustomEvent<LucyTableState>).detail;
      if (next) setTable(next);
    };
    window.addEventListener(LUCY_TABLE_EVENT, onTable);
    return () => window.removeEventListener(LUCY_TABLE_EVENT, onTable);
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <ScreenPortal>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-3 backdrop-blur-[2px]" onClick={onClose}>
        <div
          role="dialog"
          aria-modal="true"
          aria-label={variant === 'chat' ? '엔진함' : '점술 도구 보기'}
          data-master-table-sheet
          data-master-table-sheet-variant={variant}
          // 창은 화면 밖(포털)에 떠서 아침·낮 밝은 테마가 카드 색을 밝게 바꿔 버린다. 늘 어두운 창으로 고정.
          data-theme-dark-island="true"
          onClick={e => e.stopPropagation()}
          className="relative flex h-[min(42rem,calc(var(--overlay-height,100dvh)-1.5rem))] w-full max-w-[420px] flex-col overflow-hidden rounded-3xl border border-amber-200/20 bg-gradient-to-b from-[#24163a] to-[#140c24] text-white shadow-2xl"
          style={{ colorScheme: 'dark' }}
        >
          <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
            <MasterTableSheetBody table={table} variant={variant} onClose={onClose} />
          </div>
        </div>
      </div>
    </ScreenPortal>
  );
}

function DrawnCards({ cards }: { cards: LucyTableState['cards'] }) {
  if (cards.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center" data-master-sheet-cards="empty">
        <p className="mb-3 text-3xl" aria-hidden="true">🃏</p>
        <p className="text-sm font-bold text-amber-200">아직 뽑은 카드가 없어요</p>
        <p className="mt-1.5 text-xs text-slate-300/90 break-keep">루시가 “카드로 볼까?” 하고 물으면 대화에서 직접 섞고 골라요. 뽑은 카드는 여기서 다시 볼 수 있어요.</p>
      </div>
    );
  }
  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-5 pt-2" data-master-sheet-cards="ready">
      <p className="mb-2 text-[12px] font-bold text-amber-200">이번 상담에서 뽑은 카드</p>
      <div className="grid grid-cols-3 gap-2">
        {cards.map((card, i) => (
          <figure key={`${card.id}-${i}`} className="text-center">
            {card.imageUrl ? (
              <img src={card.imageUrl} alt={card.nameKo} className={`w-full rounded-lg border border-amber-200/30 shadow-md ${card.reversed ? 'rotate-180' : ''}`} loading="lazy" />
            ) : (
              <div className="flex aspect-[2/3] items-center justify-center rounded-lg border border-amber-200/30 bg-white/5 text-2xl">🃏</div>
            )}
            <figcaption className="mt-1 text-[11px] font-bold text-white break-keep">{card.nameKo}</figcaption>
            <p className="text-[10px] text-slate-400">{card.orientationKo || (card.reversed ? '역방향' : '정방향')}</p>
          </figure>
        ))}
      </div>
    </div>
  );
}

/**
 * 🔮 도구함·엔진함 창 호스트.
 *
 * 헤더에 **항상** 살아 있어서, 도구함(오브) 버튼이 숨겨진 펼친 화면 루시프로에서도
 * 연필(엔진함) 버튼과 답변 끝 관점 버튼의 `openLucyEngineBox()` 요청을 받아 창을 연다.
 * (사용자 제보 2026-11-28: "펼친화면 루시프로 엔진함이 안나와")
 */
export function LucyToolSheetHost() {
  const sheet = useLucySheetState();

  // 답변 끝 버튼(관점·도구)에서 함을 열 때도 같은 창을 쓴다.
  useEffect(() => {
    const onEngineBox = () => dispatchLucySheet({ type: 'engine-box' });
    const onTool = () => {
      // 펼친 화면은 왼쪽 점술 테이블이 도구창이다. 그 탭으로만 옮기고 창을 겹쳐 띄우지 않는다.
      if (document.querySelector('[data-duo-divination-tarot="true"]')) return;
      dispatchLucySheet({ type: 'divination-tool' });
    };
    window.addEventListener(LUCY_ENGINE_BOX_OPEN_EVENT, onEngineBox);
    window.addEventListener(LUCY_DIVINATION_TOOL_EVENT, onTool);
    return () => {
      window.removeEventListener(LUCY_ENGINE_BOX_OPEN_EVENT, onEngineBox);
      window.removeEventListener(LUCY_DIVINATION_TOOL_EVENT, onTool);
    };
  }, []);

  // 페이지를 떠나며 창 호스트가 사라지면 열림 상태도 닫아 둔다 (다시 들어왔을 때 유령 창이 뜨지 않게).
  useEffect(() => () => {
    if (getLucySheetState().open) dispatchLucySheet({ type: 'close' });
  }, []);

  const closeSheet = useCallback(() => {
    dispatchLucySheet({ type: 'close' });
    window.dispatchEvent(new CustomEvent(LUCY_ENGINE_BOX_CLOSE_EVENT));
    clearEngineFocus();
    clearDivinationToolRequest();
  }, []);

  if (!sheet.open) return null;
  return <MasterTableSheet onClose={closeSheet} variant={sheet.variant} />;
}

/**
 * 헤더의 도구함 버튼.
 * - 점술모드: 오브(구슬) 아이콘 → 15개 점술 도구 창 (사용자: "루시점술 모드에 해당 도구 버튼을 상단 헤더에 오브모양으로 만들어줘", 2026-11-27)
 * - 일반 채팅: 연필 아이콘 → 엔진함(심층 관점 설명)
 * 창 자체는 `LucyToolSheetHost`가 들고 있다.
 */
export function MasterTableSheetButton({ tone = 'dark', isMasterMode = false }: { tone?: 'dark' | 'light'; isMasterMode?: boolean }) {
  const sheet = useLucySheetState();

  // 버튼을 직접 눌러 열 때는 지난 답변의 이동 요청을 따라가지 않는다.
  const openFromButton = () => {
    clearEngineFocus();
    clearDivinationToolRequest();
    window.dispatchEvent(new CustomEvent(LUCY_ENGINE_BOX_CLOSE_EVENT));
    dispatchLucySheet({ type: 'button', isMasterMode });
  };

  return (
    <button
      type="button"
      data-master-table-sheet-button
      data-tool-sheet-variant={isMasterMode ? 'divination' : 'chat'}
      data-tool-button-icon={isMasterMode ? 'orb' : 'pencil'}
      aria-label={isMasterMode ? '점술 도구 보기' : '엔진함 보기'}
      aria-expanded={isLucySheetButtonExpanded(sheet, isMasterMode)}
      title={isMasterMode ? '점술 도구' : '엔진함'}
      onClick={() => { triggerHaptic('whitehole'); openFromButton(); }}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border backdrop-blur-md active:scale-95 ${tone === 'light'
        ? 'border-slate-300/80 bg-white/80 text-slate-700'
        : 'border-amber-200/30 bg-amber-400/10 text-amber-100'}`}
    >
      {isMasterMode ? <LucyOrbToolIcon size={16} /> : <Pencil size={15} aria-hidden="true" />}
    </button>
  );
}

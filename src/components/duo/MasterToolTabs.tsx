import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';
import type { LucyTableState } from '@/lib/lucyTableBus';
import { DIVINATION_TOOL_TABS, type DivinationToolTabMeta } from '@/lib/divination/trayTabs';
import type { DivinationToolId } from '@/lib/fifteenDivinationTools';
import { toolTabBadge, toolTabState, type ToolTabState } from './MasterToolTabPanel';

export interface DivinationToolTabView extends DivinationToolTabMeta {
  state: ToolTabState;
  /** 루시가 이번 질문에 실제로 활용한 도구 */
  active: boolean;
  /** 이번 질문에 쓰지 않아 잠긴 도구 */
  locked: boolean;
}

/**
 * 15대 도구 탭의 열림/잠금.
 * - 기본값은 이번 질문에서 루시가 실제로 활용한 도구만 열린다(계산 완료·부분 계산·상징 참고).
 * - Cosmic Pro는 사주·타로 외 13개 도구를 설명/결과 화면으로 직접 열 수 있다.
 */
export function resolveToolTabViews(table: LucyTableState, unlockCosmicProTools = false): DivinationToolTabView[] {
  const hasSelection = table.activeEngines.total > 0 || table.tools.length > 0;
  const views = DIVINATION_TOOL_TABS.map(meta => {
    const state = toolTabState(table, meta.id);
    const active = state === 'calculated' || state === 'partial' || state === 'symbolic';
    const defaultOpen = !hasSelection && (meta.id === 'saju' || meta.id === 'tarot');
    const locked = unlockCosmicProTools
      ? false
      : hasSelection ? !active : !defaultOpen;
    return { ...meta, state, active: active || defaultOpen, locked };
  });
  // 활성 도구를 앞으로 모은다(그 안에서는 기존 도구 순서 유지).
  const rank = (view: DivinationToolTabView) => (view.active ? 0 : 1);
  return views
    .map((view, index) => ({ view, index }))
    .sort((a, b) => rank(a.view) - rank(b.view) || a.index - b.index)
    .map(entry => entry.view);
}

export const LOCKED_TOOL_TAB_NOTE = '이번 질문에서는 활용되지 않아 잠겨 있어요';

/** 잠긴 도구 탭의 안내 (탭을 누를 수 없고 왜 잠겼는지만 보여준다). */
export function lockedToolTabNote(view: DivinationToolTabView): string {
  return view.state === 'needs_info'
    ? '이번 질문에서는 계산되지 않아 잠겨 있어요'
    : LOCKED_TOOL_TAB_NOTE;
}

/** 점술모드 도구함의 가로 스크롤 도구 탭 바 (접힌 창·펼친 테이블 공용). */
export function DivinationToolTabBar({ table, activeTab, onSelect, compact = false, unlockCosmicProTools = false, readingTab }: {
  table: LucyTableState;
  activeTab: DivinationToolId | 'reading';
  onSelect: (id: DivinationToolId) => void;
  compact?: boolean;
  /** Cosmic Pro에서 사주·타로 외 13개 도구도 직접 열 수 있게 한다. */
  unlockCosmicProTools?: boolean;
  /** 낭독 중일 때만 붙는 낭독 탭 */
  readingTab?: { active: boolean; onSelect: () => void };
}) {
  const views = resolveToolTabViews(table, unlockCosmicProTools);
  return (
    <div
      className="flex shrink-0 items-stretch gap-1 overflow-x-auto px-3 pb-1.5 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label="점술 도구 보기"
      data-tool-tab-bar="true"
    >
      {views.map(view => {
        const selected = activeTab === view.id;
        const badge = toolTabBadge(view.state);
        return (
          <button
            key={view.id}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-disabled={view.locked}
            disabled={view.locked}
            title={view.locked ? lockedToolTabNote(view) : view.nameKo}
            data-table-face={view.id}
            data-tool-tab-active={view.active ? 'true' : 'false'}
            data-locked={view.locked ? 'true' : 'false'}
            onClick={() => {
              if (view.locked) return;
              triggerHaptic('whitehole');
              onSelect(view.id);
            }}
            className={`relative flex shrink-0 flex-col items-center justify-center rounded-xl border ${compact ? 'w-[3.1rem] px-0.5 py-1.5' : 'w-[3.35rem] px-1 py-1.5'} ${
              view.locked
                ? 'cursor-not-allowed border-white/8 bg-white/[0.02] text-slate-500 opacity-55'
                : selected
                  ? 'border-amber-300/80 bg-amber-400/20 text-amber-50'
                  : 'border-white/12 bg-white/[0.05] text-slate-200'
            }`}
          >
            <span className="text-[15px] leading-none" aria-hidden="true">{view.locked ? '🔒' : view.icon}</span>
            <span className="mt-0.5 max-w-full truncate text-[10px] font-bold leading-tight">{view.label}</span>
            {!view.locked && badge
              ? <span className={`mt-0.5 rounded-full px-1 text-[8px] font-black leading-tight ${badge.tone}`} data-tool-tab-chip>{badge.label}</span>
              : <span className="mt-0.5 text-[8px] leading-tight opacity-70">{view.locked ? '잠김' : '\u00A0'}</span>}
          </button>
        );
      })}
      {readingTab && (
        <button
          type="button"
          role="tab"
          aria-selected={readingTab.active}
          data-table-face="reading"
          aria-label="낭독 보기"
          onClick={() => { triggerHaptic('whitehole'); readingTab.onSelect(); }}
          className={`flex w-11 shrink-0 flex-col items-center justify-center rounded-xl border py-1.5 ${readingTab.active ? 'border-amber-300/80 bg-amber-400/20 text-amber-50' : 'border-white/12 bg-white/[0.05] text-slate-200'}`}
        >
          <span className="text-[15px] leading-none" aria-hidden="true">🔊</span>
          <span className="mt-0.5 text-[9.5px] font-bold">낭독</span>
        </button>
      )}
    </div>
  );
}

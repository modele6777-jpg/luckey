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
 * 사주·타로를 포함해, 이번 질문에 실제로 쓰기 전에는 모두 잠긴다.
 * 잠긴 탭을 누르면 계산 결과 대신 그 도구 설명만 보인다.
 */
export function resolveToolTabViews(table: LucyTableState, _unlockCosmicProTools = false): DivinationToolTabView[] {
  const views = DIVINATION_TOOL_TABS.map(meta => {
    const state = toolTabState(table, meta.id);
    const active = state === 'calculated' || state === 'partial' || state === 'symbolic';
    return { ...meta, state, active, locked: !active };
  });
  // 활성 도구를 앞으로 모은다(그 안에서는 기존 도구 순서 유지).
  const rank = (view: DivinationToolTabView) => (view.active ? 0 : 1);
  return views
    .map((view, index) => ({ view, index }))
    .sort((a, b) => rank(a.view) - rank(b.view) || a.index - b.index)
    .map(entry => entry.view);
}

export const LOCKED_TOOL_TAB_NOTE = '이번 질문에서는 활용되지 않아 잠겨 있어요';

/** 이번 고민에 대해 루시가 도구를 골랐는지. 고르기 전에는 도구창을 둘러볼 수 있다. */
export function toolWindowHasSelection(table: LucyTableState): boolean {
  return table.activeEngines.total > 0 || table.tools.length > 0;
}
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
  /** 더 이상 잠금을 풀지 않는다. 사주·타로도 쓰기 전에는 잠긴 채 설명만 연다. */
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
            title={view.locked ? `${lockedToolTabNote(view)} · 설명만 볼 수 있어요` : view.nameKo}
            data-table-face={view.id}
            data-tool-tab-active={view.active ? 'true' : 'false'}
            data-locked={view.locked ? 'true' : 'false'}
            onClick={() => {
              triggerHaptic('whitehole');
              onSelect(view.id);
            }}
            className={`relative flex shrink-0 flex-col items-center justify-center rounded-xl border ${compact ? 'w-[3.1rem] px-0.5 py-1.5' : 'w-[3.35rem] px-1 py-1.5'} ${
              selected
                ? 'border-amber-300/80 bg-amber-400/20 text-amber-50'
                : view.locked
                  ? 'border-white/8 bg-white/[0.02] text-slate-500 opacity-70'
                  : view.active
                    ? 'border-white/12 bg-white/[0.05] text-slate-200'
                    : 'border-white/8 bg-white/[0.02] text-slate-400 opacity-70'
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

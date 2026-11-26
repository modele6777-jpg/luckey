import type { LucyTableState } from '@/lib/lucyTableBus';
import { FIFTEEN_DIVINATION_TOOLS, type DivinationToolId } from '@/lib/fifteenDivinationTools';
import type { ToolFact } from '@/lib/lucyMasterToolFacts';
import { findTrayEngine, TRAY_STATUS_SHORT } from '@/lib/divination/trayTabs';
import { ACTIVE_ENGINE_TRAY_STATUS_LABELS } from '@/lib/lucyActiveEngineTray';
import { ToolDetailView } from './MasterToolViews';

const SERIF = { fontFamily: '"Nanum Myeongjo", "Noto Serif KR", "AppleMyungjo", serif' } as const;

const PARCHMENT_BG = {
  backgroundColor: '#ecd9b0',
  backgroundImage: [
    'radial-gradient(ellipse at 20% 15%, rgba(255,248,225,.65), transparent 55%)',
    'radial-gradient(ellipse at 85% 90%, rgba(150,105,50,.22), transparent 60%)',
    'linear-gradient(180deg, rgba(120,80,30,.10), transparent 18%, transparent 82%, rgba(120,80,30,.14))',
  ].join(','),
  boxShadow: 'inset 0 0 18px rgba(110,70,25,.35), 0 6px 18px rgba(0,0,0,.35)',
} as const;

export type ToolTabState = 'calculated' | 'partial' | 'symbolic' | 'needs_info' | 'unused';

/** 이 탭의 도구가 이번 상담에서 어떻게 쓰였는지 (탭 배지·본문 공통). */
export function toolTabState(table: LucyTableState, toolId: string): ToolTabState {
  const used = findTrayEngine(table.activeEngines, toolId);
  if (used && (used.status === 'calculated' || used.status === 'partial' || used.status === 'symbolic')) return used.status;
  const audit = table.tools.find(item => item.toolId === toolId);
  if (audit) {
    // 답변 프롬프트에 실제로 전달된 것만 '활용'으로 본다 (계산만 되고 전달되지 않은 것은 잠금).
    if (audit.sentToModel && (audit.status === 'calculated' || audit.status === 'partial' || audit.status === 'symbolic')) {
      return audit.status;
    }
    return 'needs_info';
  }
  return 'unused';
}

export function toolTabBadge(state: ToolTabState): { label: string; tone: string } | null {
  switch (state) {
    case 'calculated': return { label: TRAY_STATUS_SHORT.calculated, tone: 'bg-emerald-400/85 text-emerald-950' };
    case 'partial': return { label: TRAY_STATUS_SHORT.partial, tone: 'bg-amber-300/90 text-amber-950' };
    case 'symbolic': return { label: TRAY_STATUS_SHORT.symbolic, tone: 'bg-violet-300/90 text-violet-950' };
    default: return null;
  }
}

/**
 * 🔮 점술모드 도구함의 기초 도구 탭 본문.
 * 사주·타로처럼 그 도구가 무엇을 보는지(부가설명)와 이번 상담의 실제 계산 결과를 바로 보여준다.
 * 이번 질문에서 쓰지 않은 도구도 설명은 볼 수 있고, 계산 결과를 지어내지는 않는다.
 */
export function MasterToolTabPanel({ toolId, table }: { toolId: DivinationToolId; table: LucyTableState }) {
  const spec = FIFTEEN_DIVINATION_TOOLS[toolId];
  const state = toolTabState(table, toolId);
  const badge = toolTabBadge(state);
  const audit = table.tools.find(item => item.toolId === toolId);
  const data = toolId === 'saju' || toolId === 'tarot' ? undefined : table.toolData[toolId];
  const facts: ToolFact[] = table.facts[toolId] ?? [];
  const statusLabel = state === 'calculated' || state === 'partial' || state === 'symbolic'
    ? ACTIVE_ENGINE_TRAY_STATUS_LABELS[state]
    : state === 'needs_info' ? '이번엔 계산하지 못했어요' : '이번 질문엔 쓰지 않았어요';

  return (
    <div
      className="flex-1 min-h-0 overflow-y-auto px-3.5 pb-5 pt-2 text-white"
      data-tool-tab-panel={toolId}
      data-tool-tab-state={state}
    >
      <div className="flex items-center gap-2">
        <p className="min-w-0 flex-1 text-[15px] font-black text-amber-50">{spec.koName}</p>
        <p className="shrink-0 truncate text-[10px] text-amber-100/70">{spec.hanjaOrEng}</p>
        {badge && (
          <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-black ${badge.tone}`} data-tool-tab-badge>
            {badge.label}
          </span>
        )}
      </div>
      <p className="mt-1 text-[11px] font-semibold text-amber-200/90 break-keep">잘 보는 것 · {spec.bestFor}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-slate-300/85 break-keep line-clamp-4">{spec.coreEssence}</p>

      <div className="mt-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
        <p className="text-[10.5px] font-bold text-amber-100/80">{statusLabel}</p>
        {audit?.note && <p className="mt-1 text-[10.5px] leading-relaxed text-slate-400 break-keep">{audit.note}</p>}
        {state === 'unused' && (
          <p className="mt-1 text-[10.5px] leading-relaxed text-slate-400 break-keep">
            루시는 질문마다 이 고민에 필요한 도구만 골라 계산해요. 이 도구가 필요해 보이면 질문에 그 얘기를 꺼내주면 다시 골라요.
          </p>
        )}
      </div>

      {data != null ? (
        <div className="mt-2.5" data-tool-tab-detail="true">
          <ToolDetailView id={toolId} data={data} />
        </div>
      ) : facts.length > 0 ? (
        <div className="mt-2.5 rounded-xl px-3 py-2" style={{ ...PARCHMENT_BG, ...SERIF }} data-tool-tab-facts="true">
          <dl className="space-y-1">
            {facts.map(row => (
              <div key={row.label} className="flex gap-2 text-[11.5px] leading-snug">
                <dt className="shrink-0 w-[4.6rem] text-[#7a4f22]">{row.label}</dt>
                <dd className="min-w-0 break-keep text-[#3b2610]">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </div>
  );
}

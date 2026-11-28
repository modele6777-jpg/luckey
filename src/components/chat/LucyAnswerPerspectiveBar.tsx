import type { DivinationToolId } from '@/lib/lucyToolRegistry';
import {
  ANSWER_ENGINE_STATUS_LABELS,
  type LucyAnswerEngines,
} from '@/lib/lucyAnswerPerspectives';

/**
 * 💬 루시 답변 이름 옆의 도구·관점 배지.
 * - 일반 대화: 심층 관점 배지만 (누르면 엔진함이 그 관점 설명으로 열린다)
 * - 점술모드: 사용된 도구 배지 + 관점 배지 (도구는 점술 도구창의 그 탭으로 열린다)
 * 배지는 메시지에 저장된 메타데이터만 읽으므로, 지난 답변의 배지도 그대로 동작한다.
 */
export function LucyAnswerEngineBar({ engines, isLight, isMasterMode, show, onOpenPerspective, onOpenTool, className = 'mb-1.5', besideName = false }: {
  engines: LucyAnswerEngines;
  isLight: boolean;
  isMasterMode: boolean;
  show: boolean;
  onOpenPerspective: (engineKey: string) => void;
  onOpenTool: (toolId: DivinationToolId) => void;
  /** 말풍선 위에 붙는 기본 여백. 다른 자리에 얹을 때만 바꾼다. */
  className?: string;
  /** 답변 이름 옆에 작은 배지로 붙인다. */
  besideName?: boolean;
}) {
  if (!show) return null;
  const tools = isMasterMode ? engines.tools.filter(tool => tool.toolId) : [];
  const perspectives = engines.perspectives;
  if (tools.length === 0 && perspectives.length === 0) return null;

  return (
    <div className={`${besideName ? 'inline-flex min-w-0 flex-wrap items-center gap-1' : 'flex w-full min-w-0 flex-col gap-1'} ${className}`} data-lucy-answer-engines data-beside-name={besideName ? 'true' : undefined}>
      {tools.length > 0 && (
        <div className={`flex flex-wrap items-center gap-1 ${besideName ? '' : 'gap-1.5 pl-1'}`} data-lucy-answer-tools>
          {!besideName && <span className={`text-[10px] font-bold ${isLight ? 'text-slate-500' : 'text-white/60'}`}>🔮 이 답변 도구</span>}
          {tools.map(tool => (
            <button
              key={`tool-${tool.key}`}
              type="button"
              data-lucy-answer-tool={tool.key}
              title={`${tool.nameKo} · ${ANSWER_ENGINE_STATUS_LABELS[tool.status]} · 도구창에서 보기`}
              onClick={() => onOpenTool(tool.toolId!)}
              className={`flex max-w-full cursor-pointer items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-semibold shadow-xs transition-all hover:-translate-y-px active:translate-y-0 active:scale-95 ${
                isLight
                  ? 'border-sky-300 bg-sky-50 text-sky-900 hover:border-sky-400 hover:bg-sky-100'
                  : 'border-sky-300/35 bg-sky-400/10 text-sky-100 hover:border-sky-300/70 hover:bg-sky-400/20'
              }`}
            >
              <span aria-hidden="true">{tool.icon}</span>
              <span className="truncate">{tool.nameKo}</span>
              <span
                aria-hidden="true"
                data-lucy-answer-status={tool.status}
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  tool.status === 'calculated' ? 'bg-emerald-500' : tool.status === 'partial' ? 'bg-amber-500' : 'bg-violet-400'
                }`}
              />
            </button>
          ))}
        </div>
      )}
      {perspectives.length > 0 && (
        <div className={`flex flex-wrap items-center gap-1 ${besideName ? '' : 'gap-1.5 pl-1'}`} data-lucy-answer-perspectives>
          {!besideName && <span className={`text-[10px] font-bold ${isLight ? 'text-slate-500' : 'text-white/60'}`}>✨ 이 답변 관점</span>}
          {perspectives.map(perspective => (
            <button
              key={`perspective-${perspective.key}`}
              type="button"
              data-lucy-answer-perspective={perspective.key}
              title={`${perspective.nameKo} · ${ANSWER_ENGINE_STATUS_LABELS[perspective.status]} · 자세히 보기`}
              onClick={() => onOpenPerspective(perspective.key)}
              className={`flex max-w-full cursor-pointer items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-semibold shadow-xs transition-all hover:-translate-y-px active:translate-y-0 active:scale-95 ${
                isLight
                  ? 'border-amber-300 bg-amber-50 text-amber-900 hover:border-amber-400 hover:bg-amber-100'
                  : 'border-amber-300/40 bg-amber-400/10 text-amber-100 hover:border-amber-300/70 hover:bg-amber-400/20'
              }`}
            >
              <span aria-hidden="true">{perspective.icon}</span>
              <span className="truncate">{perspective.nameKo}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

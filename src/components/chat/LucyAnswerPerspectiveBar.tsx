import type { DivinationToolId } from '@/lib/lucyToolRegistry';
import {
  ANSWER_ENGINE_STATUS_LABELS,
  type LucyAnswerEngines,
} from '@/lib/lucyAnswerPerspectives';

/**
 * 💬 루시 답변 끝의 "이 답변 도구/관점" 버튼.
 * - 일반 대화: 심층 관점 버튼만 (누르면 엔진함이 그 관점 설명으로 열린다)
 * - 점술모드: 사용된 도구 버튼 + 관점 버튼 (도구는 점술 도구함의 그 탭으로 열린다)
 * 버튼은 메시지에 저장된 메타데이터만 읽으므로, 지난 답변의 버튼도 그대로 동작한다.
 */
export function LucyAnswerEngineBar({ engines, isLight, isMasterMode, show, onOpenPerspective, onOpenTool }: {
  engines: LucyAnswerEngines;
  isLight: boolean;
  isMasterMode: boolean;
  show: boolean;
  onOpenPerspective: (engineKey: string) => void;
  onOpenTool: (toolId: DivinationToolId) => void;
}) {
  if (!show) return null;
  const tools = isMasterMode ? engines.tools.filter(tool => tool.toolId) : [];
  const perspectives = engines.perspectives;
  if (tools.length === 0 && perspectives.length === 0) return null;

  return (
    <div className="mt-1 flex w-full min-w-0 flex-col gap-1" data-lucy-answer-engines>
      {tools.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pl-1" data-lucy-answer-tools>
          <span className={`text-[10px] font-bold ${isLight ? 'text-slate-500' : 'text-white/60'}`}>🔮 이 답변 도구</span>
          {tools.map(tool => (
            <button
              key={`tool-${tool.key}`}
              type="button"
              data-lucy-answer-tool={tool.key}
              title={`${tool.nameKo} · ${ANSWER_ENGINE_STATUS_LABELS[tool.status]} · 도구함에서 보기`}
              onClick={() => onOpenTool(tool.toolId!)}
              className={`flex max-w-full items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-semibold transition-transform active:scale-95 ${
                isLight
                  ? 'border-sky-300 bg-sky-50 text-sky-900 hover:bg-sky-100'
                  : 'border-sky-300/35 bg-sky-400/10 text-sky-100 hover:bg-sky-400/20'
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
        <div className="flex flex-wrap items-center gap-1.5 pl-1" data-lucy-answer-perspectives>
          <span className={`text-[10px] font-bold ${isLight ? 'text-slate-500' : 'text-white/60'}`}>✨ 이 답변 관점</span>
          {perspectives.map(perspective => (
            <button
              key={`perspective-${perspective.key}`}
              type="button"
              data-lucy-answer-perspective={perspective.key}
              title={`${perspective.nameKo} · ${ANSWER_ENGINE_STATUS_LABELS[perspective.status]} · 엔진함에서 뜻 보기`}
              onClick={() => onOpenPerspective(perspective.key)}
              className={`flex max-w-full items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-semibold transition-transform active:scale-95 ${
                isLight
                  ? 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
                  : 'border-amber-300/40 bg-amber-400/10 text-amber-100 hover:bg-amber-400/20'
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

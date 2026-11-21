import { useMemo, useState } from 'react';
import type { CalculationAuditItem } from '@/lib/divination/calculationAudit';
import { buildToolBoard, type ToolBoardItem } from '@/lib/lucyMasterToolBoard';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';

const STATUS_LABEL: Record<ToolBoardItem['status'], string> = {
  calculated: '계산',
  symbolic: '상징 참고',
  needs_info: '정보 필요',
  pending: '대기',
};

/** 🧭 점술모드 3단계: 고민에 맞춘 추천 도구 1개 + 나머지 12개 요약 격자. */
export function MasterToolBoard({ tools, concern, lastAnswer }: { tools: CalculationAuditItem[]; concern: string; lastAnswer: string }) {
  const board = useMemo(() => buildToolBoard({ audit: tools, concern, answer: lastAnswer }), [tools, concern, lastAnswer]);
  const [openId, setOpenId] = useState<string | null>(null);

  if (!board.hasResults) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6" data-master-tool-board="empty">
        <p className="text-3xl mb-3" aria-hidden="true">🧭</p>
        <p className="text-sm font-bold text-amber-200">13대 도구가 펼쳐질 자리예요</p>
        <p className="mt-1.5 text-xs text-slate-300/90 break-keep">3단계에서 고민을 보내면 루시가 13개 도구로 함께 보고, 이 고민에 가장 잘 맞는 도구부터 여기에 펼쳐줘요.</p>
      </div>
    );
  }

  const rec = board.recommended;
  const commonCount = [rec, ...board.others].filter(item => item.common).length;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-3.5 pb-4 pt-1 text-white" data-master-tool-board="ready">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[13px] font-black text-amber-200">🧭 13대 도구로 본 이 고민</p>
        {commonCount > 0 && <p className="text-[10px] text-amber-100/80">✦ 루시가 함께 짚은 도구 {commonCount}개</p>}
      </div>
      {concern && <p className="mt-0.5 text-[11px] text-slate-300/85 break-keep line-clamp-1">“{concern}”</p>}

      {/* 추천 도구 1개 (크게) */}
      <section
        className="mt-2.5 rounded-2xl border border-amber-300/60 bg-gradient-to-br from-amber-400/15 to-fuchsia-500/10 p-3.5"
        data-master-tool-recommended={rec.id}
      >
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-amber-400/90 px-2 py-0.5 text-[10px] font-black text-slate-950">루시 추천</span>
          <p className="text-[15px] font-black text-amber-50">{rec.name}</p>
          <p className="text-[10px] text-amber-100/70">{rec.hanja}</p>
          {rec.common && <span className="ml-auto text-amber-300" title="루시가 답변에서 짚은 도구" aria-label="공통 신호">✦</span>}
        </div>
        <p className="mt-1 text-[11px] text-amber-100/85 break-keep">이 고민엔 {board.recommendReason}.</p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-slate-100 break-keep">
          {rec.signal || (rec.status === 'needs_info' ? rec.note : `잘 보는 것: ${rec.bestFor}. 루시 답변이 오면 이 도구로 짚은 내용이 여기에 떠요.`)}
        </p>
        {rec.status === 'symbolic' && <p className="mt-1 text-[10px] text-slate-300/80">상징 참고 — 수치 계산 근거는 아니에요.</p>}
      </section>

      {/* 나머지 12개 */}
      <div className="mt-2.5 grid grid-cols-2 gap-1.5" data-master-tool-grid>
        {board.others.map(item => {
          const open = openId === item.id;
          const dim = item.status === 'needs_info';
          return (
            <button
              key={item.id}
              type="button"
              data-master-tool={item.id}
              data-master-tool-common={item.common ? 'true' : 'false'}
              aria-expanded={open}
              onClick={() => { triggerHaptic('whitehole'); setOpenId(open ? null : item.id); }}
              className={`text-left rounded-xl border px-2.5 py-2 transition-colors ${open ? 'col-span-2' : ''} ${
                item.common
                  ? 'border-amber-300/60 bg-amber-400/10'
                  : 'border-white/12 bg-white/[0.05]'
              } ${dim ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-1.5">
                {item.common && <span className="text-amber-300 text-[11px]" aria-label="공통 신호">✦</span>}
                <span className="text-[12px] font-bold text-white truncate">{item.name}</span>
                <span className={`ml-auto shrink-0 text-[9px] ${dim ? 'text-slate-300' : item.status === 'symbolic' ? 'text-violet-200/90' : 'text-emerald-200/80'}`}>{STATUS_LABEL[item.status]}</span>
              </div>
              <p className={`mt-0.5 text-[10.5px] leading-snug text-slate-300/90 break-keep ${open ? '' : 'line-clamp-2'}`}>
                {dim ? item.note : item.signal || item.bestFor}
              </p>
              {open && !dim && (
                <div className="mt-1.5 space-y-1 text-[10.5px] leading-snug text-slate-300/90 break-keep">
                  <p><span className="text-amber-200/90">잘 보는 것</span> · {item.bestFor}</p>
                  {item.signal && <p><span className="text-amber-200/90">루시가 짚은 내용</span> · {item.signal}</p>}
                  {item.status === 'symbolic' && <p>상징 참고 — 수치 계산 근거는 아니에요.</p>}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

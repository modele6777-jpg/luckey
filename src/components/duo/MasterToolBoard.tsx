import { useMemo, useState } from 'react';
import type { CalculationAuditItem } from '@/lib/divination/calculationAudit';
import type { ToolFact } from '@/lib/lucyMasterToolFacts';
import { buildToolBoard, type ToolBoardItem } from '@/lib/lucyMasterToolBoard';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';
import { FIFTEEN_DIVINATION_TOOLS, type DivinationToolId } from '@/lib/fifteenDivinationTools';

const FULL_BEST_FOR = (id: DivinationToolId) => FIFTEEN_DIVINATION_TOOLS[id].bestFor;

const SERIF = { fontFamily: '"Nanum Myeongjo", "Noto Serif KR", "AppleMyungjo", serif' } as const;

/** 양피지 바탕: 빛바랜 종이 결 + 가장자리 그을림 */
const PARCHMENT_BG = {
  backgroundColor: '#ecd9b0',
  backgroundImage: [
    'radial-gradient(ellipse at 20% 15%, rgba(255,248,225,.65), transparent 55%)',
    'radial-gradient(ellipse at 85% 90%, rgba(150,105,50,.22), transparent 60%)',
    'linear-gradient(180deg, rgba(120,80,30,.10), transparent 18%, transparent 82%, rgba(120,80,30,.14))',
  ].join(','),
  boxShadow: 'inset 0 0 18px rgba(110,70,25,.35), 0 6px 18px rgba(0,0,0,.35)',
} as const;

/** 두루마리 양 끝의 말린 축 */
function ScrollRod() {
  return (
    <div
      aria-hidden="true"
      className="relative z-[1] h-2.5 rounded-full"
      style={{ background: 'linear-gradient(180deg,#8a5a2b,#c89a5e 45%,#6b4220)', boxShadow: '0 1px 3px rgba(0,0,0,.45)' }}
    />
  );
}

function FactRows({ facts, tone }: { facts: ToolFact[]; tone: 'dark' | 'parchment' }) {
  return (
    <dl className="space-y-1">
      {facts.map(row => (
        <div key={row.label} className="flex gap-2 text-[11.5px] leading-snug">
          <dt className={`shrink-0 w-[4.6rem] ${tone === 'parchment' ? 'text-[#7a4f22]' : 'text-amber-200/90'}`}>{row.label}</dt>
          <dd className={`min-w-0 break-keep ${tone === 'parchment' ? 'text-[#3b2610]' : 'text-slate-100'}`}>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * 🧭 점술모드 3단계 왼쪽 테이블의 두 탭.
 * - recommended: 고민에 맞춘 추천 도구 1개를 크게
 * - scrolls: 나머지 12개를 양피지 두루마리 보조 자료로
 */
export function MasterToolBoard({ view, tools, concern, lastAnswer, facts, onShowScrolls }: {
  view: 'recommended' | 'scrolls';
  onShowScrolls?: () => void;
  tools: CalculationAuditItem[];
  concern: string;
  lastAnswer: string;
  facts: Record<string, ToolFact[]>;
}) {
  const board = useMemo(() => buildToolBoard({ audit: tools, concern, answer: lastAnswer, facts }), [tools, concern, lastAnswer, facts]);
  const [openId, setOpenId] = useState<string | null>(null);

  if (!board.hasResults) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6" data-master-tool-board="empty" data-master-tool-view={view}>
        <p className="text-3xl mb-3" aria-hidden="true">{view === 'scrolls' ? '📜' : '🧭'}</p>
        <p className="text-sm font-bold text-amber-200">{view === 'scrolls' ? '12대 도구 두루마리가 놓일 자리예요' : '추천 도구가 펼쳐질 자리예요'}</p>
        <p className="mt-1.5 text-xs text-slate-300/90 break-keep">3단계에서 고민을 보내면 루시가 13개 도구로 함께 보고, 이 고민에 가장 잘 맞는 도구부터 여기에 펼쳐줘요.</p>
      </div>
    );
  }

  const rec = board.recommended;
  const commonCount = [rec, ...board.others].filter(item => item.common).length;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-3.5 pb-5 pt-1 text-white" data-master-tool-board="ready" data-master-tool-view={view}>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[13px] font-black text-amber-200">{view === 'scrolls' ? '📜 12대 도구 보조 자료' : '🧭 이 고민의 추천 도구'}</p>
        {commonCount > 0 && <p className="text-[10px] text-amber-100/80">✦ 루시가 함께 짚은 도구 {commonCount}개</p>}
      </div>
      {concern && <p className="mt-0.5 text-[11px] text-slate-300/85 break-keep line-clamp-1">“{concern}”</p>}

      {view === 'recommended' ? (<>

      {/* 추천 도구 1개 */}
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
        {rec.facts.length > 0 && <div className="mt-2.5 rounded-xl bg-black/20 px-3 py-2"><FactRows facts={rec.facts} tone="dark" /></div>}
        <p className="mt-2 text-[12.5px] leading-relaxed text-slate-100 break-keep">
          {rec.signal || (rec.status === 'symbolic' ? rec.note : '루시 답변이 오면 이 도구로 짚은 내용이 여기에 떠요.')}
        </p>
        <p className="mt-2.5 text-[10.5px] text-amber-100/75 break-keep">잘 보는 것 · {FULL_BEST_FOR(rec.id)}</p>
      </section>
      {onShowScrolls && (
        <button
          type="button"
          onClick={onShowScrolls}
          className="mt-3 w-full rounded-xl border border-amber-200/30 bg-[#ecd9b0]/10 px-3 py-2.5 text-left text-[12px] text-amber-100"
          style={SERIF}
        >📜 나머지 12개 도구는 양피지에서 볼 수 있어요{commonCount - (rec.common ? 1 : 0) > 0 ? ` · ✦ ${commonCount - (rec.common ? 1 : 0)}개 봉인` : ''} →</button>
      )}
      </>) : (<>
      <p className="mt-2 mb-1.5 text-[11px] font-bold tracking-wide text-amber-100/80" style={SERIF}>두루마리를 눌러 펼쳐 보세요</p>
      <div className="space-y-2" data-master-tool-scrolls>
        {board.others.map(item => (
          <ParchmentScroll
            key={item.id}
            item={item}
            open={openId === item.id}
            onToggle={() => { triggerHaptic('whitehole'); setOpenId(openId === item.id ? null : item.id); }}
          />
        ))}
      </div>
      </>)}
    </div>
  );
}

function ParchmentScroll({ item, open, onToggle }: { item: ToolBoardItem; open: boolean; onToggle: () => void }) {
  const faded = item.status === 'needs_info';
  const symbolic = item.status === 'symbolic';
  return (
    <div
      className={`transition-[filter,opacity] ${faded ? 'opacity-55' : ''}`}
      style={faded ? { filter: 'sepia(.5) saturate(.6)' } : undefined}
      data-master-tool={item.id}
      data-master-tool-common={item.common ? 'true' : 'false'}
    >
      <ScrollRod />
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="relative -my-0.5 mx-1 block w-[calc(100%-0.5rem)] text-left px-3.5 py-2.5"
        style={{ ...PARCHMENT_BG, ...SERIF }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[13.5px] font-bold text-[#3b2610]">{item.name}</span>
          <span className="text-[10px] text-[#7a4f22]/80">{item.hanja}</span>
          <span className="ml-auto flex items-center gap-1.5">
            {symbolic && <span className="rounded-full border border-[#7a4f22]/40 px-1.5 text-[9px] text-[#7a4f22]">상징 참고</span>}
            {faded && <span className="rounded-full border border-[#7a4f22]/40 px-1.5 text-[9px] text-[#7a4f22]">정보 필요</span>}
            {item.common && (
              <span
                aria-label="루시가 함께 짚은 도구"
                title="루시가 함께 짚은 도구"
                className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] text-amber-100"
                style={{ background: 'radial-gradient(circle at 35% 30%,#c0392b,#7b1d14)', boxShadow: '0 1px 3px rgba(0,0,0,.5), inset 0 0 0 2px rgba(255,255,255,.12)' }}
              >✦</span>
            )}
          </span>
        </div>
        {!open && (
          <p className="mt-0.5 text-[11px] leading-snug text-[#5a3a18] break-keep line-clamp-1">
            {faded ? item.note : item.signal || (item.facts[0] ? `${item.facts[0].label} · ${item.facts[0].value}` : item.bestFor)}
          </p>
        )}
        {open && (
          <div className="mt-2 space-y-2 border-t border-dashed border-[#7a4f22]/35 pt-2">
            {faded ? (
              <p className="text-[11.5px] text-[#5a3a18] break-keep">{item.note}</p>
            ) : (
              <>
                {item.facts.length > 0 && <FactRows facts={item.facts} tone="parchment" />}
                {symbolic && <p className="text-[11px] text-[#5a3a18] break-keep">{item.note}</p>}
                {item.signal && <p className="text-[11.5px] italic leading-relaxed text-[#3b2610] break-keep">“{item.signal}”</p>}
                <p className="text-[10.5px] text-[#7a4f22] break-keep">잘 보는 것 · {item.bestFor}</p>
              </>
            )}
          </div>
        )}
      </button>
      <ScrollRod />
    </div>
  );
}

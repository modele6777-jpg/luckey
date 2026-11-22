import { motion } from 'motion/react';
import type { SajuAnalysisResult } from '@/lib/sajuAnalysis';
import { sajuFocusFromAnswer } from '@/lib/lucyTableBus';

const ELEMENT_STYLE: Record<string, { color: string; glow: string; label: string }> = {
  목: { color: '#4ade80', glow: 'rgba(74,222,128,0.45)', label: '목(木)' },
  화: { color: '#f87171', glow: 'rgba(248,113,113,0.45)', label: '화(火)' },
  토: { color: '#fbbf24', glow: 'rgba(251,191,36,0.45)', label: '토(土)' },
  금: { color: '#e2e8f0', glow: 'rgba(226,232,240,0.45)', label: '금(金)' },
  수: { color: '#60a5fa', glow: 'rgba(96,165,250,0.45)', label: '수(水)' },
};

type PillarKey = 'hour' | 'day' | 'month' | 'year';
const PILLAR_ORDER: { key: PillarKey; label: string }[] = [
  { key: 'hour', label: '시주' },
  { key: 'day', label: '일주' },
  { key: 'month', label: '월주' },
  { key: 'year', label: '년주' },
];

/**
 * Saju chart board for the unfolded Lucy Master table. Shows the counselled
 * person's four pillars, five-element balance and 10-year luck, and lights up
 * whatever Lucy's latest answer mentions. Computed values only; no new claims.
 */
export function MasterSajuBoard({ saju, lastAnswer }: { saju: SajuAnalysisResult | null; lastAnswer: string }) {
  if (!saju || !saju.hasBirthInfo || !saju.elements?.percentages || !saju.pillars) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6" data-master-saju-board="empty">
        <p className="text-3xl mb-3" aria-hidden="true">☯</p>
        <p className="text-sm font-bold text-amber-200">사주 원국판을 펼칠 정보가 없어요</p>
        <p className="mt-1.5 text-xs text-slate-300/90 break-keep">입력창 위 프로필에 생년월일(가능하면 태어난 시간)을 넣으면 여기에 원국이 펼쳐져요.</p>
      </div>
    );
  }
  const focus = sajuFocusFromAnswer(lastAnswer);
  const percentages = saju.elements.percentages;
  const timeline = saju.daewunDetail?.timeline || [];
  const age = saju.koreanAge;
  const currentLuck = timeline.find(step => age >= step.startAge && age <= step.endAge);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-3.5 pb-4 pt-1 text-white" data-master-saju-board="ready">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[13px] font-black text-amber-200">{saju.nickname || saju.name}의 사주 원국</p>
        <p className="text-[10px] text-slate-300/80">{saju.birthdate}{saju.birthtime ? ` ${saju.birthtime}` : ' · 시간 미입력'}</p>
      </div>

      {/* 4주 8자: 전통 순서(시·일·월·년, 오른쪽에서 왼쪽으로 읽기) */}
      <div className="mt-2.5 grid grid-cols-4 gap-1.5">
        {PILLAR_ORDER.map(({ key, label }) => {
          const pillar = saju.pillars[key];
          const lit = focus.pillars.has(key);
          const isDay = key === 'day';
          return (
            <motion.div
              key={key}
              data-saju-pillar={key}
              data-lit={lit ? 'true' : 'false'}
              animate={lit ? { boxShadow: ['0 0 0 rgba(251,191,36,0)', '0 0 22px rgba(251,191,36,0.55)', '0 0 10px rgba(251,191,36,0.35)'] } : { boxShadow: '0 0 0 rgba(0,0,0,0)' }}
              transition={{ duration: 1.2 }}
              className={`rounded-xl border px-1 py-2 text-center ${lit ? 'border-amber-300/80 bg-amber-400/10' : isDay ? 'border-violet-300/50 bg-violet-400/10' : 'border-white/12 bg-white/[0.04]'}`}
            >
              <p className="text-[10px] font-bold text-slate-300">{label}{isDay ? ' · 나' : ''}</p>
              {pillar ? (
                <>
                  <p className="mt-1 text-[10px] text-slate-400">{pillar.tenGodGan?.name}</p>
                  <p className="text-2xl font-black leading-tight" style={{ color: ELEMENT_STYLE[pillar.elGan]?.color }}>{pillar.gan}</p>
                  <p className="text-[10px] text-slate-300">{pillar.ganKr} · {pillar.elGan}</p>
                  <p className="mt-1 text-2xl font-black leading-tight" style={{ color: ELEMENT_STYLE[pillar.elZhi]?.color }}>{pillar.zhi}</p>
                  <p className="text-[10px] text-slate-300">{pillar.zhiKr} · {pillar.elZhi}</p>
                  <p className="text-[10px] text-slate-400">{pillar.tenGodZhi?.name}</p>
                </>
              ) : (
                <p className="mt-6 text-[10px] text-slate-400 break-keep">시간을 넣으면 계산돼요</p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* 오행 비율 */}
      <div className="mt-3 rounded-xl border border-white/12 bg-white/[0.04] p-2.5">
        <p className="text-[11px] font-bold text-amber-200">오행 비율 <span className="font-normal text-slate-300">· {saju.elements.strengthLabel || saju.elements.dominant?.name}</span></p>
        <div className="mt-2 space-y-1.5">
          {(['목', '화', '토', '금', '수'] as const).map(element => {
            const style = ELEMENT_STYLE[element];
            const value = Math.round(percentages[element] || 0);
            const lit = focus.elements.has(element);
            return (
              <div key={element} className="flex items-center gap-2" data-saju-element={element} data-lit={lit ? 'true' : 'false'}>
                <span className={`w-12 shrink-0 text-[11px] font-bold ${lit ? 'text-amber-200' : 'text-slate-200'}`}>{style.label}</span>
                <div className="h-2.5 flex-1 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: style.color, boxShadow: lit ? `0 0 12px ${style.glow}` : 'none' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(2, value)}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                  />
                </div>
                <span className="w-9 text-right text-[11px] tabular-nums text-slate-200">{value}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 대운 흐름 */}
      {timeline.length > 0 && (
        <div className={`mt-3 rounded-xl border p-2.5 ${focus.daeun ? 'border-amber-300/70 bg-amber-400/10' : 'border-white/12 bg-white/[0.04]'}`} data-saju-daeun data-lit={focus.daeun ? 'true' : 'false'}>
          <p className="text-[11px] font-bold text-amber-200">10년 대운 흐름 <span className="font-normal text-slate-300">· 지금 {age}세</span></p>
          <div className="mt-2 flex gap-1 overflow-x-auto pb-1">
            {timeline.map(step => {
              const now = step === currentLuck;
              return (
                <div key={step.order} className={`shrink-0 w-12 rounded-lg border px-1 py-1.5 text-center ${now ? 'border-amber-300 bg-amber-400/20' : 'border-white/10 bg-white/[0.03]'}`}>
                  <p className="text-[9px] text-slate-300">{step.startAge}세</p>
                  <p className="text-sm font-black">{step.gan}{step.zhi}</p>
                  <p className="text-[9px] text-slate-300">{step.ganKr}{step.zhiKr}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <p className="mt-2.5 text-[10px] leading-relaxed text-slate-400 break-keep">앱이 계산한 원국이에요. 루시가 답에서 말한 부분이 금빛으로 빛나요.</p>
    </div>
  );
}

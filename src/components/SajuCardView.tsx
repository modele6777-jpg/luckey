import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass, Shield, Flame, Activity, Info, Star, Award, Layers, Zap } from 'lucide-react';
import { calculateDetailedSaju, ELEMENT_DETAILS, type SajuAnalysisResult, type FiveElement } from '@/lib/sajuAnalysis';
import type { UserProfile } from '@/lib/sharedState';

interface SajuCardViewProps {
  profile?: UserProfile | null;
  sajuResult?: SajuAnalysisResult | null;
  compact?: boolean;
  className?: string;
}

export function SajuCardView({ profile, sajuResult, compact = false, className = '' }: SajuCardViewProps) {
  const saju = sajuResult || (profile ? calculateDetailedSaju(profile) : null);

  if (!saju || !saju.hasBirthInfo) {
    return (
      <div className={`p-6 rounded-3xl bg-white/[0.03] border border-white/10 text-center space-y-2.5 ${className}`}>
        <Compass size={28} className="mx-auto text-white/30 animate-pulse" />
        <p className="text-xs text-white/60 font-sans leading-relaxed">
          생년월일과 생시를 입력하시면 고유한 사주 4주 8자 원국, 십신, 신살 및 웹앱 연동 파라미터가 실시간으로 분석됩니다.
        </p>
      </div>
    );
  }

  const { pillars, dayMaster, elements, yongsin, annual2026, specialStructures, webAppParameters } = saju;

  const ELEMENT_COLORS: Record<FiveElement, { bg: string; text: string; border: string; badge: string; hex: string }> = {
    목: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', hex: '#10b981' },
    화: { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40', hex: '#f43f5e' },
    토: { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30', badge: 'bg-amber-500/20 text-amber-200 border-amber-500/40', hex: '#f59e0b' },
    금: { bg: 'bg-slate-300/15', text: 'text-slate-200', border: 'border-slate-400/30', badge: 'bg-slate-400/20 text-slate-200 border-slate-400/40', hex: '#cbd5e1' },
    수: { bg: 'bg-sky-500/15', text: 'text-sky-400', border: 'border-sky-500/30', badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40', hex: '#38bdf8' },
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-[28px] bg-gradient-to-br from-[#0c0d19]/95 via-[#080911]/98 to-[#130f26]/95 border border-amber-500/20 shadow-2xl backdrop-blur-2xl text-left space-y-6 ${className}`}
    >
      {/* Title Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="space-y-1">
            <h3 className="text-lg md:text-xl font-black text-amber-200 tracking-tight flex items-center gap-2">
              <span>{dayMaster.hanja}({dayMaster.korean}) 사주 원국 및 분석 명세서</span>
            </h3>
            <p className="text-xs text-white/50 font-sans tracking-wide">
              생년월일시: <strong className="text-white/80">{saju.birthdate} {saju.birthtime || '시간 미지정'}</strong> (양력) | 성별: <strong className="text-white/80">{saju.gender}</strong> | 일주: <strong className="text-amber-300">{pillars.day.gan}{pillars.day.zhi}({pillars.day.ganKr}{pillars.day.zhiKr})</strong>
            </p>
          </div>
          <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            {dayMaster.archetypeTitle.split('(')[0].trim()}
          </div>
        </div>
      </div>

      {/* 1. 사주 원국 (四柱原局) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
          <span className="w-1.5 h-4 bg-amber-400 rounded-full" />
          <h4>1. 사주 원국 (四柱原局)</h4>
        </div>

        <div className="grid grid-cols-4 gap-2 md:gap-3 text-center">
          {/* 시주 */}
          <div className={`p-3 rounded-2xl border transition-all ${pillars.hour ? 'bg-white/[0.03] border-white/10' : 'bg-white/[0.01] border-dashed border-white/5'}`}>
            <span className="text-[11px] text-white/40 block font-sans mb-1.5 font-medium">시주 (時柱)</span>
            {pillars.hour ? (
              <div className="space-y-2">
                {/* 천간 */}
                <div className="space-y-0.5">
                  <span className="text-xl md:text-2xl font-black text-white font-serif">{pillars.hour.gan}</span>
                  <p className="text-[10px] text-white/70 font-sans">
                    {pillars.hour.ganKr}화 ({pillars.hour.yinYangGan}{pillars.hour.elGan}/{pillars.hour.tenGodGan.name.split('(')[0]})
                  </p>
                </div>
                {/* 지지 */}
                <div className="space-y-0.5 pt-1.5 border-t border-white/5">
                  <span className="text-xl md:text-2xl font-black text-white font-serif">{pillars.hour.zhi}</span>
                  <p className="text-[10px] text-white/70 font-sans">
                    {pillars.hour.zhiKr}토 ({pillars.hour.yinYangZhi}{pillars.hour.elZhi}/{pillars.hour.tenGodZhi.name.split('(')[0]})
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-xs text-white/30 font-sans">시간 미지정</div>
            )}
          </div>

          {/* 일주 (본원) */}
          <div className="p-3 rounded-2xl bg-amber-500/10 border-2 border-amber-400/40 ring-2 ring-amber-500/20 shadow-lg shadow-amber-500/10">
            <span className="text-[11px] text-amber-300 font-bold block font-sans mb-1.5 flex items-center justify-center gap-1">
              <Star size={10} className="fill-amber-400 text-amber-400" />
              본원 일주 (日柱)
            </span>
            <div className="space-y-2">
              {/* 천간 */}
              <div className="space-y-0.5">
                <span className="text-xl md:text-2xl font-black text-amber-200 font-serif">{pillars.day.gan}</span>
                <p className="text-[10px] text-amber-300 font-bold font-sans">
                  {pillars.day.ganKr}토 ({pillars.day.yinYangGan}{pillars.day.elGan}/일간)
                </p>
              </div>
              {/* 지지 */}
              <div className="space-y-0.5 pt-1.5 border-t border-amber-500/20">
                <span className="text-xl md:text-2xl font-black text-amber-200 font-serif">{pillars.day.zhi}</span>
                <p className="text-[10px] text-amber-300/90 font-sans">
                  {pillars.day.zhiKr}토 ({pillars.day.yinYangZhi}{pillars.day.elZhi}/{pillars.day.tenGodZhi.name.split('(')[0]})
                </p>
              </div>
            </div>
          </div>

          {/* 월주 */}
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="text-[11px] text-white/40 block font-sans mb-1.5 font-medium">월주 (月柱)</span>
            <div className="space-y-2">
              {/* 천간 */}
              <div className="space-y-0.5">
                <span className="text-xl md:text-2xl font-black text-white font-serif">{pillars.month.gan}</span>
                <p className="text-[10px] text-white/70 font-sans">
                  {pillars.month.ganKr}목 ({pillars.month.yinYangGan}{pillars.month.elGan}/{pillars.month.tenGodGan.name.split('(')[0]})
                </p>
              </div>
              {/* 지지 */}
              <div className="space-y-0.5 pt-1.5 border-t border-white/5">
                <span className="text-xl md:text-2xl font-black text-white font-serif">{pillars.month.zhi}</span>
                <p className="text-[10px] text-white/70 font-sans">
                  {pillars.month.zhiKr}토 ({pillars.month.yinYangZhi}{pillars.month.elZhi}/{pillars.month.tenGodZhi.name.split('(')[0]})
                </p>
              </div>
            </div>
          </div>

          {/* 년주 */}
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="text-[11px] text-white/40 block font-sans mb-1.5 font-medium">년주 (年柱)</span>
            <div className="space-y-2">
              {/* 천간 */}
              <div className="space-y-0.5">
                <span className="text-xl md:text-2xl font-black text-white font-serif">{pillars.year.gan}</span>
                <p className="text-[10px] text-white/70 font-sans">
                  {pillars.year.ganKr}수 ({pillars.year.yinYangGan}{pillars.year.elGan}/{pillars.year.tenGodGan.name.split('(')[0]})
                </p>
              </div>
              {/* 지지 */}
              <div className="space-y-0.5 pt-1.5 border-t border-white/5">
                <span className="text-xl md:text-2xl font-black text-white font-serif">{pillars.year.zhi}</span>
                <p className="text-[10px] text-white/70 font-sans">
                  {pillars.year.zhiKr}금 ({pillars.year.yinYangZhi}{pillars.year.elZhi}/{pillars.year.tenGodZhi.name.split('(')[0]})
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 오행 구성 비율 */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
          <span className="w-1.5 h-4 bg-amber-400 rounded-full" />
          <h4>2. 오행 구성 비율</h4>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
          {/* Text Ratio Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm font-bold font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
              토(土) {elements.counts.토}
            </span>
            <span className="text-white/30">|</span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              목(木) {elements.counts.목}
            </span>
            <span className="text-white/30">|</span>
            <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30">
              화(火) {elements.counts.화}
            </span>
            <span className="text-white/30">|</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-400/20 text-slate-200 border border-slate-400/30">
              금(金) {elements.counts.금}
            </span>
            <span className="text-white/30">|</span>
            <span className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30">
              수(水) {elements.counts.수}
            </span>
          </div>

          {/* Elemental Bars */}
          <div className="grid grid-cols-5 gap-2 pt-1">
            {(['토', '목', '화', '금', '수'] as const).map((el) => {
              const count = elements.counts[el];
              const pct = elements.percentages[el];
              const detail = ELEMENT_DETAILS[el];
              const isDominant = elements.dominant.element === el;
              return (
                <div key={el} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className={`font-bold ${ELEMENT_COLORS[el].text}`}>{detail.hanja}</span>
                    <span className="text-white/50 text-[10px]">{count}개</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(10, pct)}%`, backgroundColor: ELEMENT_COLORS[el].hex }}
                    />
                  </div>
                  <span className="text-[9px] text-white/40 block text-center">
                    {isDominant ? '중심' : `${pct}%`}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-white/70 font-sans leading-relaxed pt-2 border-t border-white/5">
            {elements.summary}
          </p>
        </div>
      </div>

      {/* 3. 핵심 신살 및 특수 구조 */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
          <span className="w-1.5 h-4 bg-amber-400 rounded-full" />
          <h4>3. 핵심 신살 및 특수 구조</h4>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
          {specialStructures.length > 0 ? (
            specialStructures.map((star, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs leading-relaxed font-sans">
                <span className="text-amber-400 font-bold mt-0.5">•</span>
                <div>
                  <strong className="text-amber-200">{star.name}:</strong>{' '}
                  <span className="text-white/80">{star.description}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-start gap-2.5 text-xs text-white/80 font-sans">
              <span className="text-amber-400 font-bold">•</span>
              <span>순탄하고 평온한 오행 순환 구조로 위기 상황에서도 자연스러운 균형 회복력을 발휘합니다.</span>
            </div>
          )}
        </div>
      </div>

      {/* 4. 웹앱 연동용 파라미터 */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
          <span className="w-1.5 h-4 bg-amber-400 rounded-full" />
          <h4>4. 웹앱 연동용 파라미터</h4>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* 내면 추진력 */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-amber-300 font-bold">내면 추진력 지수 (토 기운)</span>
                <span className="font-mono font-black text-amber-200">{webAppParameters.driveScore} / 100</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${webAppParameters.driveScore}%` }}
                />
              </div>
            </div>

            {/* 재물 및 실속 친화력 */}
            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-sky-300 font-bold">재물 및 실속 친화력 (수 기운)</span>
                <span className="font-mono font-black text-sky-200">{webAppParameters.wealthAffinityScore} / 100</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-sky-400 rounded-full"
                  style={{ width: `${webAppParameters.wealthAffinityScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* 추천 테마 키워드 */}
          <div className="pt-2 border-t border-white/5 space-y-1.5">
            <span className="text-xs text-white/50 font-sans block">추천 테마 키워드:</span>
            <div className="flex flex-wrap gap-1.5">
              {webAppParameters.recommendedKeywords.map((kw, i) => (
                <span key={i} className="text-xs px-2.5 py-0.8 rounded-lg bg-white/10 text-amber-200 font-medium font-sans border border-white/10">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {!compact && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2">
          {/* Yongsin (보약 처방) */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1.5">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
              🌿 영혼의 보약 에너지 (용신)
            </span>
            <p className="text-white/90 font-medium font-sans">{yongsin.name}</p>
            <p className="text-[11px] text-white/60 font-sans leading-relaxed">{yongsin.actionTip}</p>
          </div>

          {/* 2026 Flow */}
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-1.5">
            <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">
              🔥 2026 병오년(丙午年) 세운 흐름
            </span>
            <p className="text-white/90 font-medium font-sans">{annual2026.theme.split('—')[0]}</p>
            <p className="text-[11px] text-white/60 font-sans leading-relaxed">{annual2026.keyOpportunity}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

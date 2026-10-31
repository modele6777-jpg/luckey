import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, ChevronUp, Compass, Flame, Shield, Star, Activity, Eye, Music, Bell, Key, Check, Download, Camera } from 'lucide-react';
import { calculateDetailedSaju, type SajuAnalysisResult, type FiveElement } from '@/lib/sajuAnalysis';
import { calculateNatalChart, type NatalChartResult } from '@/lib/astrologyAnalysis';
import { calculateZiwei } from '@/lib/divination/birthCharts';
import { playAudioHaptic } from '@/lib/audioHaptics';
import { useLocation } from 'wouter';
import { toPng } from 'html-to-image';
import type { UserProfile } from '@/lib/sharedState';

interface VisualFortuneChartWidgetProps {
  profile?: UserProfile | null;
  usedTools?: string[];
  isLight?: boolean;
  className?: string;
}

export function VisualFortuneChartWidget({
  profile,
  usedTools = [],
  isLight = false,
  className = '',
}: VisualFortuneChartWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  const handleExportImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!chartRef.current || isExporting) return;
    try {
      setIsExporting(true);
      playAudioHaptic('save_auto');
      const dataUrl = await toPng(chartRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#070a0e',
      });
      const link = document.createElement('a');
      link.download = `luckey-fortune-chart-${profile?.basic?.birthdate || 'my'}.png`;
      link.href = dataUrl;
      link.click();
      playAudioHaptic('save_success');
    } catch (_) {
      // 이미지 내보내기 오류 안전 무시
    } finally {
      setTimeout(() => setIsExporting(false), 800);
    }
  };

  const handlePlayBowl = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      playAudioHaptic('meditation_bell');
      setIsRinging(true);
      setTimeout(() => setIsRinging(false), 2600);
    } catch (_) {}
  };

  // 프로필 생년월일이 없으면 미표시
  if (!profile?.basic?.birthdate) return null;

  // 사주 또는 점성술, 자미두수 등의 계산 도구가 활성화된 답변인 경우에만 렌더링
  const hasFortuneTools =
    usedTools.some((t) =>
      ['사주명리', '서양 점성술', '자미두수', '숙요경(27숙)', '베딕 점성술', '마하보테(8요일)', '구성학', '홍국기문', '기문둔갑', '대육임'].some(
        (key) => t.includes(key)
      )
    ) || usedTools.length >= 14;

  if (!hasFortuneTools) return null;

  const saju: SajuAnalysisResult | null = calculateDetailedSaju(profile);
  const astro: NatalChartResult | null = calculateNatalChart(profile);

  let ziweiData: any = null;
  if (profile.basic.birthtime && profile.basic.gender) {
    try {
      ziweiData = calculateZiwei(profile);
    } catch (_) {}
  }

  const ELEMENT_COLORS: Record<FiveElement, { bg: string; text: string; border: string; label: string }> = {
    목: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40', label: '목(木)' },
    화: { bg: 'bg-rose-500/20', text: 'text-rose-300', border: 'border-rose-500/40', label: '화(火)' },
    토: { bg: 'bg-amber-500/20', text: 'text-amber-200', border: 'border-amber-500/40', label: '토(土)' },
    금: { bg: 'bg-slate-300/20', text: 'text-slate-100', border: 'border-slate-300/40', label: '금(金)' },
    수: { bg: 'bg-sky-500/20', text: 'text-sky-300', border: 'border-sky-500/40', label: '수(水)' },
  };

  return (
    <div className={`mt-2 mb-2 w-full max-w-full overflow-hidden ${className}`}>
      {/* 🔮 인터랙티브 토글 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer shadow-xs border ${
          isOpen
            ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-emerald-500/10'
            : isLight
            ? 'bg-amber-50/90 border-amber-300/80 text-amber-900 hover:bg-amber-100/90'
            : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200 hover:bg-emerald-900/50 hover:border-emerald-400/50'
        }`}
        title="AI 답변의 기반이 된 실제 수리·천문 계산 차트를 열어봅니다."
      >
        <Sparkles size={13} className="text-emerald-400 animate-pulse" />
        <span>실측 계산 차트 ({saju?.dayMaster?.hanja || '사주'} · {astro?.sun?.sign?.name || '별자리'})</span>
        {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {/* 📊 펼쳐지는 미니멀 비주얼 차트 패널 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chartRef}
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`mt-2.5 p-4 sm:p-5 rounded-2xl border text-left space-y-4 shadow-xl backdrop-blur-xl overflow-hidden ${
              isLight
                ? 'bg-amber-50/95 border-amber-300/60 text-slate-900'
                : 'bg-[#090d13]/95 border-emerald-500/30 text-slate-100 shadow-emerald-950/30'
            }`}
          >
            {/* Header: 계산 정보 & 이미지 저장 */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5 text-xs text-white/50">
              <span className="font-medium text-emerald-400 flex items-center gap-1">
                <Compass size={13} />
                <span>결정론적 자체 계산 엔진 실측 데이터 (Deterministic Core)</span>
              </span>
              <div className="flex items-center gap-2">
                <span>{profile.basic.birthdate} {profile.basic.birthtime || ''}</span>
                <button
                  onClick={handleExportImage}
                  disabled={isExporting}
                  className="px-2 py-0.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-all"
                  title="이 실측 계산 차트를 고화질 이미지(PNG)로 저장합니다."
                >
                  {isExporting ? <Check size={11} className="text-emerald-400 animate-spin" /> : <Camera size={11} />}
                  <span>{isExporting ? '저장 중...' : '카드 저장'}</span>
                </button>
              </div>
            </div>

            {/* 1. 사주 4주 8자 원국 칩 (Saju Four Pillars Matrix) */}
            {saju && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-3 bg-amber-400 rounded-full" />
                    <span>사주 4주 8자 원국 ([{saju.dayMaster.hanja}] {saju.dayMaster.korean} 일간)</span>
                  </span>
                  <span className="text-[11px] text-white/60 font-normal">격국: {saju.geokguk.name} · {saju.bodyStrength.level}</span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center">
                  {[
                    { label: '시주(時)', pillar: saju.pillars.hour },
                    { label: '일주(日)', pillar: saju.pillars.day, isDayMaster: true },
                    { label: '월주(月)', pillar: saju.pillars.month },
                    { label: '년주(年)', pillar: saju.pillars.year },
                  ].map((col, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-xl border flex flex-col items-center justify-center space-y-1 ${
                        col.isDayMaster
                          ? 'bg-amber-500/10 border-amber-400/50 shadow-xs'
                          : 'bg-white/[0.03] border-white/10'
                      }`}
                    >
                      <span className="text-[10px] text-white/50 font-medium">{col.label}</span>
                      {col.pillar ? (
                        <>
                          <div className={`px-2 py-0.5 rounded-lg border text-sm font-black font-serif ${ELEMENT_COLORS[col.pillar.elGan].bg} ${ELEMENT_COLORS[col.pillar.elGan].text} ${ELEMENT_COLORS[col.pillar.elGan].border}`}>
                            {col.pillar.gan}
                          </div>
                          <span className="text-[9px] text-white/60">{col.pillar.tenGodGan.name.split('(')[0]}</span>
                          <div className={`px-2 py-0.5 rounded-lg border text-sm font-black font-serif ${ELEMENT_COLORS[col.pillar.elZhi].bg} ${ELEMENT_COLORS[col.pillar.elZhi].text} ${ELEMENT_COLORS[col.pillar.elZhi].border}`}>
                            {col.pillar.zhi}
                          </div>
                          <span className="text-[9px] text-white/60">{col.pillar.tenGodZhi.name.split('(')[0]}</span>
                        </>
                      ) : (
                        <span className="text-[11px] text-white/30 py-3">생시 미지정</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* 오행 밸런스 미니 바 */}
                <div className="pt-1.5 space-y-1 text-xs">
                  <div className="flex justify-between text-[11px] text-white/60">
                    <span>오행 밸런스</span>
                    <span>우세: <strong className="text-emerald-300">{saju.elements.dominant.name}</strong> · 용신: <strong className="text-amber-300">{saju.yongsin.name}</strong></span>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden bg-white/5 border border-white/10">
                    {(['목', '화', '토', '금', '수'] as FiveElement[]).map((el) => {
                      const pct = saju.elements.percentages[el] || 0;
                      if (pct <= 0) return null;
                      return (
                        <div
                          key={el}
                          style={{ width: `${pct}%` }}
                          className={`${ELEMENT_COLORS[el].bg.replace('/20', '/80')} border-r border-black/30`}
                          title={`${el}: ${pct}%`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 2. 서양 점성술 천문 3대 축 (Sun / Moon / Rising Big 3) */}
            {astro && (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-3 bg-purple-400 rounded-full" />
                    <span>서양 점성술 천문 3대 축 (Big 3 Placements)</span>
                  </span>
                  <span className="text-[11px] text-white/60 font-normal">우세 원소: {astro.elements.dominant}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30">
                    <span className="text-[10px] text-purple-300/70 block">☀️ 태양궁 (Sun)</span>
                    <span className="text-sm font-bold text-white block mt-0.5">{astro.sun.sign.name}</span>
                    <span className="text-[10px] text-white/50">{astro.sun.degree}° ({astro.sun.sign.element})</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30">
                    <span className="text-[10px] text-purple-300/70 block">🌙 달궁 (Moon)</span>
                    <span className="text-sm font-bold text-white block mt-0.5">{astro.moon.sign.name}</span>
                    <span className="text-[10px] text-white/50">{astro.moon.degree}° ({astro.moon.sign.element})</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30">
                    <span className="text-[10px] text-purple-300/70 block">🌅 상승궁 (Rising)</span>
                    <span className="text-sm font-bold text-white block mt-0.5">{astro.ascendant?.sign?.name || '생시 미지정'}</span>
                    <span className="text-[10px] text-white/50">{astro.ascendant ? `${astro.ascendant.degree}°` : '시간 확인 필요'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. 자미두수 명반 핵심 (선택적) */}
            {ziweiData && (
              <div className="pt-2 border-t border-white/10 text-xs flex items-center justify-between text-white/70">
                <span className="text-emerald-300 font-medium flex items-center gap-1">
                  <Star size={12} />
                  <span>자미두수 명궁/신궁:</span>
                </span>
                <span>명궁(命宮) {ziweiData.soulPalace}궁 · 신궁(身宮) {ziweiData.bodyPalace}궁 ({ziweiData.fiveElementsClass})</span>
              </div>
            )}

            {/* 4. 오감 감성 케어 & 오행 개운 처방 (Sensory Care & Key Ritual) */}
            {saju && (
              <div className="pt-2.5 border-t border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                  <span className="flex items-center gap-1">
                    <Music size={13} className="text-amber-400" />
                    <span>오감 에너지 파동 & 개운 처방 (Sensory Wellness)</span>
                  </span>
                  <span className="text-[11px] text-emerald-400">보약 오행: {saju.yongsin.name}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                  <div className="space-y-0.5">
                    <p className="text-[11px] text-white/90 font-medium">
                      {saju.yongsin.name.includes('목') && '🌿 숲의 피톤치드와 생명력을 깨우는 432Hz 녹색 파동'}
                      {saju.yongsin.name.includes('화') && '🔥 가슴속 열정과 추진력을 지피는 528Hz 솔페지오 사랑 파동'}
                      {saju.yongsin.name.includes('토') && '⛰️ 잡념을 가라앉히고 터를 잡는 136.1Hz 옴(Om) 그라운딩 파동'}
                      {saju.yongsin.name.includes('금') && '⚔️ 번뇌와 스트레스를 맑게 비워내는 587Hz 티베탄 정화 싱잉볼'}
                      {saju.yongsin.name.includes('수') && '🌊 깊은 내면의 직관과 평화를 회복하는 밤의 힐링 심포니'}
                      {!['목', '화', '토', '금', '수'].some(el => saju.yongsin.name.includes(el)) && '✨ 부족한 기운을 조화롭게 채우는 528Hz 평온의 솔페지오 파동'}
                    </p>
                    <p className="text-[10px] text-white/50">
                      추천 개운 행동: <strong className="text-amber-200/90">{saju.yongsin.actionTip || '가벼운 스트레칭과 심호흡'}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                    <button
                      onClick={handlePlayBowl}
                      disabled={isRinging}
                      className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                        isRinging
                          ? 'bg-amber-400/20 border-amber-400/60 text-amber-200'
                          : 'bg-white/5 hover:bg-white/10 border-white/15 text-white/80 hover:text-white'
                      }`}
                      title="528Hz 정화 싱잉볼 사운드를 울려 기운을 정화합니다."
                    >
                      {isRinging ? <Check size={12} className="text-emerald-400 animate-bounce" /> : <Bell size={12} className="text-amber-400" />}
                      <span>{isRinging ? '정화 완료 🔔' : '싱잉볼 정화 울림'}</span>
                    </button>

                    <button
                      onClick={() => navigate('/key')}
                      className="px-2.5 py-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-200 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-all"
                      title="40가지 개운 성전 리추얼로 이동합니다."
                    >
                      <Key size={12} className="text-sky-300" />
                      <span>개운 리추얼</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Watermark for Exported Cards */}
            <div className="pt-1 flex items-center justify-between text-[9px] text-white/30 uppercase tracking-widest font-mono">
              <span>LUCKEY ARCHIVE · DETERMINISTIC FORTUNE TECH</span>
              <span>CONFIDENTIAL PERSONAL BLUEPRINT</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

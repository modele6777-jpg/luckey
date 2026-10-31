import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, ChevronUp, Compass, Flame, Shield, Star, Activity, Eye, Music, Bell, Key, Check, Download, Camera, Heart, Users } from 'lucide-react';
import { calculateDetailedSaju, type SajuAnalysisResult, type FiveElement } from '@/lib/sajuAnalysis';
import { calculateNatalChart, type NatalChartResult } from '@/lib/astrologyAnalysis';
import { calculateZiwei } from '@/lib/divination/birthCharts';
import { calculateDeterministicCompatibility, type CompatibilityAnalysisResult } from '@/lib/divination/deterministicCompatibility';
import { playAudioHaptic } from '@/lib/audioHaptics';
import { useLocation } from 'wouter';
import { toPng } from 'html-to-image';
import type { UserProfile } from '@/lib/sharedState';

interface VisualFortuneChartWidgetProps {
  profile?: UserProfile | null;
  secondaryProfile?: UserProfile | null;
  usedTools?: string[];
  isLight?: boolean;
  className?: string;
}

export function VisualFortuneChartWidget({
  profile,
  secondaryProfile = null,
  usedTools = [],
  isLight = false,
  className = '',
}: VisualFortuneChartWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'my' | 'compat'>('my');
  const [isRinging, setIsRinging] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  const compatData: CompatibilityAnalysisResult | null = useMemo(() => {
    if (!profile || !secondaryProfile) return null;
    try {
      return calculateDeterministicCompatibility(profile, secondaryProfile);
    } catch (_) {
      return null;
    }
  }, [profile, secondaryProfile]);

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
      {/* 🔮 인터랙티브 토글 버튼: 초슬림 미니멀 캡슐 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer border ${
          isOpen
            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-xs'
            : isLight
            ? 'bg-amber-50/80 border-amber-300/60 text-amber-900 hover:bg-amber-100/70'
            : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-emerald-500/30'
        }`}
        title="AI 답변의 기반이 된 실제 수리·천문 계산 차트를 열어봅니다."
      >
        <Sparkles size={11} className="text-emerald-400" />
        <span>
          실측 차트 ({saju?.dayMaster?.hanja || '사주'} · {astro?.sun?.sign?.name || '별자리'}
          {compatData ? ` · 궁합 ${compatData.score}점` : ''})
        </span>
        {isOpen ? <ChevronUp size={11} className="opacity-60" /> : <ChevronDown size={11} className="opacity-60" />}
      </button>

      {/* 📊 펼쳐지는 미니멀 비주얼 차트 패널 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chartRef}
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`mt-2 p-3.5 sm:p-4 rounded-xl border text-left space-y-3.5 shadow-lg backdrop-blur-md overflow-hidden ${
              isLight
                ? 'bg-amber-50/95 border-amber-300/50 text-slate-900'
                : 'bg-[#090d13]/90 border-white/10 text-slate-100 shadow-emerald-950/20'
            }`}
          >
            {/* Header: 계산 정보 & 이미지 저장 */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-white/10 pb-2 text-[11px] text-white/45">
              <span className="font-medium text-emerald-400/90 flex items-center gap-1">
                <Compass size={12} />
                <span>결정론적 자체 계산 실측 데이터</span>
              </span>
              <div className="flex items-center gap-2">
                <span>{profile.basic.birthdate} {profile.basic.birthtime || ''}</span>
                <button
                  onClick={handleExportImage}
                  disabled={isExporting}
                  className="px-1.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[10px] font-medium flex items-center gap-1 cursor-pointer transition-all"
                  title="이 실측 계산 차트를 고화질 이미지(PNG)로 저장합니다."
                >
                  {isExporting ? <Check size={10} className="text-emerald-400 animate-spin" /> : <Camera size={10} />}
                  <span>{isExporting ? '저장 중...' : '카드 저장'}</span>
                </button>
              </div>
            </div>

            {/* 탭 전환 (다자간 프로필 연동 시 내 원국표 vs 듀얼 궁합 매트릭스) */}
            {compatData && (
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 w-fit text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('my')}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'my'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Compass size={12} />
                  <span>내 원국표</span>
                </button>
                <button
                  onClick={() => setActiveTab('compat')}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'compat'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-xs'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Heart size={12} className="text-rose-400 fill-rose-400" />
                  <span>듀얼 궁합 매트릭스 ({compatData.score}점 · {compatData.grade})</span>
                </button>
              </div>
            )}

            {/* 👥 듀얼 궁합 매트릭스 탭 내용 */}
            {activeTab === 'compat' && compatData ? (
              <div className="space-y-3.5">
                {/* 1. 종합 시너지 스코어 & 인연 등급 헤더 */}
                <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-rose-950/40 via-amber-950/30 to-emerald-950/40 border border-rose-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-amber-200 to-emerald-300">
                        {compatData.score}점
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        {compatData.grade}
                      </span>
                    </div>
                    <span className="text-xs text-white/60 font-medium">
                      {compatData.saju.personA.name} ✕ {compatData.saju.personB.name}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-amber-200">{compatData.title}</p>
                  <p className="text-[11px] text-white/80 leading-relaxed">{compatData.summary}</p>
                </div>

                {/* 2. 사주 천간합 & 지지 결합 대조 */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-3 bg-amber-400 rounded-full" />
                      <span>사주 천간·지지 결합 분석</span>
                    </span>
                    <span className="text-[11px] text-white/50">일간(日干) & 일지(日支)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-[10px] text-white/40 mb-0.5">{compatData.saju.personA.name}</div>
                      <div className="font-bold text-emerald-300">{compatData.saju.personA.dayMaster} 일간</div>
                      <div className="text-[11px] text-white/60">일지: {compatData.saju.personA.dayBranch}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-[10px] text-white/40 mb-0.5">{compatData.saju.personB.name}</div>
                      <div className="font-bold text-sky-300">{compatData.saju.personB.dayMaster} 일간</div>
                      <div className="text-[11px] text-white/60">일지: {compatData.saju.personB.dayBranch}</div>
                    </div>
                  </div>

                  {/* 천간/지지 관계 설명 */}
                  <div className="space-y-1.5 text-[11px]">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-200">
                      <strong>천간 관계:</strong> {compatData.saju.stemRelation.name} — {compatData.saju.stemRelation.desc}
                    </div>
                    <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-200">
                      <strong>일지 관계:</strong> {compatData.saju.branchRelation.name} — {compatData.saju.branchRelation.desc}
                    </div>
                  </div>
                </div>

                {/* 3. 숙요 27숙 인연 역학 (6대 관계) */}
                <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                    <span className="flex items-center gap-1">
                      <Sparkles size={13} className="text-purple-400" />
                      <span>숙요 27숙 인연 역학 (密敎 宿曜經)</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-200 border border-purple-500/30">
                      {compatData.sukuyo.relationName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-white/70 px-1">
                    <span>{compatData.saju.personA.name}: <strong className="text-purple-200">{compatData.sukuyo.mansionA}</strong></span>
                    <span className="text-purple-400 font-bold">↔</span>
                    <span>{compatData.saju.personB.name}: <strong className="text-purple-200">{compatData.sukuyo.mansionB}</strong></span>
                  </div>
                  <p className="text-[11px] text-white/80 leading-relaxed bg-black/20 p-2 rounded-lg">
                    {compatData.sukuyo.meaning}
                  </p>
                </div>

                {/* 4. 점성술 원소 시나스트리 */}
                <div className="p-3 rounded-xl bg-sky-500/5 border border-sky-500/20 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-xs font-bold text-sky-300">
                    <span className="flex items-center gap-1">
                      <Star size={13} className="text-sky-400" />
                      <span>서양 점성술 시나스트리 (Sun Signs & Elements)</span>
                    </span>
                    <span className="text-[11px] text-white/60">{compatData.astrology.aspect}</span>
                  </div>
                  <p className="text-[11px] text-white/80">
                    {compatData.saju.personA.name}({compatData.astrology.sunA} · {compatData.astrology.elementA}) ✕ {compatData.saju.personB.name}({compatData.astrology.sunB} · {compatData.astrology.elementB})
                  </p>
                  <p className="text-[11px] text-white/70 bg-black/20 p-2 rounded-lg leading-relaxed">
                    {compatData.astrology.harmonyDesc}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* 1인 단일 원국표 렌더링 시작 */}

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

            {/* 3. 오행 맞춤 케어 (슬림 원라인) */}
            {saju && (
              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 text-[11px] flex-wrap">
                <span className="text-white/60 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>보약 오행: <strong className="text-emerald-300 font-semibold">{saju.yongsin.name}</strong></span>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePlayBowl}
                    disabled={isRinging}
                    className={`px-2 py-0.5 rounded border text-[10px] font-medium flex items-center gap-1 cursor-pointer transition-all ${
                      isRinging
                        ? 'bg-amber-400/20 border-amber-400/50 text-amber-200'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/70 hover:text-white'
                    }`}
                    title="528Hz 정화 싱잉볼을 가볍게 울립니다."
                  >
                    {isRinging ? <Check size={10} className="text-emerald-400" /> : <Bell size={10} className="text-amber-400" />}
                    <span>{isRinging ? '정화 🔔' : '싱잉볼'}</span>
                  </button>

                  <button
                    onClick={() => navigate('/key')}
                    className="px-2 py-0.5 rounded border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-200 text-[10px] font-medium flex items-center gap-1 cursor-pointer transition-all"
                    title="40가지 개운 성전 리추얼로 이동합니다."
                  >
                    <Key size={10} className="text-sky-300" />
                    <span>개운법</span>
                  </button>
                </div>
              </div>
            )}
              </>
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

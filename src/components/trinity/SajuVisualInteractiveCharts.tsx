import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Sparkles,
  Compass,
  Thermometer,
  Activity,
  Flame,
  Droplets,
  TreePine,
  Mountain,
  Shield,
  Clock,
  Heart,
  Zap,
  Info,
  ChevronRight,
  Sun,
} from 'lucide-react';
import type { UserProfile } from '@/lib/sharedState';
import {
  type SajuAnalysisResult,
  type FiveElement,
  ELEMENT_DETAILS,
} from '@/lib/sajuAnalysis';
import {
  runSajuClassicYongshinEngine,
  type SajuClassicYongshinReport,
} from '@/lib/divination/sajuClassicYongshinPrescriptionEngine';
import {
  runTaoistNeidanMeridianEngine,
  type TaoistNeidanMeridianReport,
} from '@/lib/divination/taoistNeidanMeridianEngine';
import { playAudioHaptic } from '@/lib/audioHaptics';
import { rechartsAnimationActive, rechartsAnimationDuration } from '@/lib/chartPerf';

export interface SajuVisualInteractiveChartsProps {
  profile?: UserProfile | null;
  saju: SajuAnalysisResult;
  className?: string;
}

const ELEMENT_COLORS: Record<FiveElement, { name: string; hex: string; bg: string; text: string; icon: any }> = {
  목: { name: '목(木)', hex: '#10b981', bg: 'bg-emerald-500/15', text: 'text-emerald-400', icon: TreePine },
  화: { name: '화(火)', hex: '#f43f5e', bg: 'bg-rose-500/15', text: 'text-rose-400', icon: Flame },
  토: { name: '토(土)', hex: '#f59e0b', bg: 'bg-amber-500/15', text: 'text-amber-300', icon: Mountain },
  금: { name: '금(金)', hex: '#cbd5e1', bg: 'bg-slate-400/15', text: 'text-slate-200', icon: Shield },
  수: { name: '수(水)', hex: '#38bdf8', bg: 'bg-sky-500/15', text: 'text-sky-400', icon: Droplets },
};

export function SajuVisualInteractiveCharts({
  profile,
  saju,
  className = '',
}: SajuVisualInteractiveChartsProps) {
  const [activeTab, setActiveTab] = useState<'radar' | 'climate' | 'biorhythm'>('radar');
  const [selectedElement, setSelectedElement] = useState<FiveElement>(saju.elements.dominant?.element || '목');
  const [currentHour, setCurrentHour] = useState<number>(() => new Date().getHours());

  // 정통 고전 엔진 연동 (궁통보감 조후 & 도교 내단 경락)
  const classicReport: SajuClassicYongshinReport = useMemo(() => {
    try {
      return runSajuClassicYongshinEngine(profile || undefined);
    } catch (_) {
      return runSajuClassicYongshinEngine(undefined);
    }
  }, [profile]);

  const meridianReport: TaoistNeidanMeridianReport = useMemo(() => {
    try {
      return runTaoistNeidanMeridianEngine(profile || undefined);
    } catch (_) {
      return runTaoistNeidanMeridianEngine(undefined);
    }
  }, [profile]);

  // 주기적 시각 갱신
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleTabChange = (tab: 'radar' | 'climate' | 'biorhythm') => {
    setActiveTab(tab);
    playAudioHaptic('save_auto');
  };

  // 1. 오행 레이더 데이터 구성
  const radarData = useMemo(() => {
    const order: FiveElement[] = ['목', '화', '토', '금', '수'];
    return order.map((el) => ({
      subject: `${ELEMENT_DETAILS[el].hanja} (${el})`,
      elementKey: el,
      score: saju.elements.percentages[el] || 0,
      count: saju.elements.counts[el] || 0,
      fullMark: 50,
    }));
  }, [saju.elements]);

  // 2. 12시진 생체 바이오리듬 24시간 곡선 데이터 구성
  const biorhythmData = useMemo(() => {
    const slotNames = [
      { branch: '자(子)', hourStr: '23:00~01:00', meridian: '담경', base: 85 },
      { branch: '축(丑)', hourStr: '01:00~03:00', meridian: '간경', base: 95 },
      { branch: '인(寅)', hourStr: '03:00~05:00', meridian: '폐경', base: 70 },
      { branch: '묘(卯)', hourStr: '05:00~07:00', meridian: '대장경', base: 60 },
      { branch: '진(辰)', hourStr: '07:00~09:00', meridian: '위경', base: 75 },
      { branch: '사(巳)', hourStr: '09:00~11:00', meridian: '비경', base: 80 },
      { branch: '오(午)', hourStr: '11:00~13:00', meridian: '심경', base: 90 },
      { branch: '미(未)', hourStr: '13:00~15:00', meridian: '소장경', base: 65 },
      { branch: '신(申)', hourStr: '15:00~17:00', meridian: '방광경', base: 72 },
      { branch: '유(酉)', hourStr: '17:00~19:00', meridian: '신경', base: 88 },
      { branch: '술(戌)', hourStr: '19:00~21:00', meridian: '심포경', base: 68 },
      { branch: '해(亥)', hourStr: '21:00~23:00', meridian: '삼초경', base: 74 },
    ];

    // 일간 오행과 장부 친화도 가중치 부여
    const dayEl = saju.dayMaster?.element || '목';
    return slotNames.map((slot, idx) => {
      let vitality = slot.base;
      if (dayEl === '화' && (idx === 6 || idx === 10)) vitality += 10;
      if (dayEl === '수' && (idx === 0 || idx === 9)) vitality += 10;
      if (dayEl === '목' && (idx === 1 || idx === 2)) vitality += 10;
      if (dayEl === '금' && (idx === 3 || idx === 8)) vitality += 10;
      if (dayEl === '토' && (idx === 4 || idx === 5)) vitality += 10;

      // 현재 시각 매칭 (23~01시는 idx 0, 01~03시는 idx 1...)
      const activeIdx = Math.floor(((currentHour + 1) % 24) / 2);
      const isCurrent = idx === activeIdx;

      return {
        name: slot.branch,
        time: slot.hourStr,
        meridian: slot.meridian,
        vitality: Math.min(100, vitality),
        isCurrent,
      };
    });
  }, [saju.dayMaster?.element, currentHour]);

  // 3. 기후 온도계 지수 (궁통보감)
  const climateInfo = useMemo(() => {
    const monthZhi = saju.pillars.month?.zhi || '인';
    // 춘: 인묘진, 하: 사오미, 추: 신유술, 동: 해자축
    let tempScore = 10; // -100(한) ~ +100(열)
    let humScore = 0;   // -100(조) ~ +100(습)

    if (['사', '오', '미'].includes(monthZhi)) {
      tempScore = 75;
      humScore = -20;
    } else if (['해', '자', '축'].includes(monthZhi)) {
      tempScore = -75;
      humScore = 40;
    } else if (['신', '유', '술'].includes(monthZhi)) {
      tempScore = -20;
      humScore = -60;
    } else {
      tempScore = 30;
      humScore = 30;
    }

    // 사주 원국 전체의 수/화 비율 보정
    const fireCount = saju.elements.counts.화 || 0;
    const waterCount = saju.elements.counts.수 || 0;
    tempScore += (fireCount - waterCount) * 12;
    tempScore = Math.max(-100, Math.min(100, tempScore));

    const earthDry = (saju.elements.counts.토 || 0) + (saju.elements.counts.금 || 0);
    const waterWood = (saju.elements.counts.수 || 0) + (saju.elements.counts.목 || 0);
    humScore += (waterWood - earthDry) * 10;
    humScore = Math.max(-100, Math.min(100, humScore));

    return {
      tempScore,
      humScore,
      johuElement: classicReport.johuClimate.johuYongshinElement,
      climateTitle: classicReport.johuClimate.birthSeasonClimate,
      balanceText: classicReport.johuClimate.temperatureHumidityBalance,
      vitalityScore: classicReport.johuClimate.vitalityClimateScore,
    };
  }, [saju.pillars.month?.zhi, saju.elements.counts, classicReport]);

  const selectedMeta = ELEMENT_COLORS[selectedElement] || ELEMENT_COLORS.목;

  return (
    <div className={`rounded-3xl p-5 sm:p-7 bg-gradient-to-br from-[#181a24] via-[#13141a] to-[#0e0f14] border border-amber-500/35 shadow-2xl space-y-6 ${className}`}>
      {/* 헤더 & 3대 인터랙티브 탭 스위처 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <Activity size={17} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-white flex items-center gap-2">
              <span>사주 인터랙티브 비주얼 차트</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                DYNAMIC
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400">
              오행 펜타곤 · 궁통보감 기후 온도계 · 자오유주 24h 생체 바이오리듬
            </p>
          </div>
        </div>

        {/* 탭 버튼 그룹 */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => handleTabChange('radar')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'radar'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Compass size={13} />
            <span>오행 레이더</span>
          </button>

          <button
            onClick={() => handleTabChange('climate')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'climate'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Thermometer size={13} />
            <span>기후 온도계</span>
          </button>

          <button
            onClick={() => handleTabChange('biorhythm')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'biorhythm'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Clock size={13} />
            <span>생체 바이오리듬</span>
          </button>
        </div>
      </div>

      {/* 탭 콘텐츠 본체 */}
      <AnimatePresence mode="wait">
        {/* ==================== 1. 오행 펜타곤 레이더 탭 ==================== */}
        {activeTab === 'radar' && (
          <motion.div
            key="radar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* 좌측: Recharts Radar Chart */}
              <div className="md:col-span-7 h-64 sm:h-72 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="rgba(255, 255, 255, 0.12)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: '#fbbf24', fontSize: 12, fontWeight: 'bold' }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 45]}
                      tick={false}
                      axisLine={false}
                    />
                    <Radar
                      name="오행 비율(%)"
                      dataKey="score"
                      stroke="#f59e0b"
                      strokeWidth={2.5}
                      fill="#f59e0b"
                      fillOpacity={0.35}
                      isAnimationActive={rechartsAnimationActive()}
                      animationDuration={rechartsAnimationDuration()}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* 우측: 오행 선택 버튼 & 상세 인터랙션 카드 */}
              <div className="md:col-span-5 space-y-3">
                <div className="text-xs text-zinc-400 flex items-center justify-between">
                  <span>오행을 터치하여 맞춤 해설 보기</span>
                  <span className="text-amber-400 font-mono font-bold">5-ELEMENTS</span>
                </div>

                {/* 5개 오행 원클릭 터치 버튼 바 */}
                <div className="grid grid-cols-5 gap-1.5">
                  {(['목', '화', '토', '금', '수'] as const).map((el) => {
                    const isSelected = selectedElement === el;
                    const meta = ELEMENT_COLORS[el];
                    const Icon = meta.icon;
                    return (
                      <button
                        key={el}
                        onClick={() => {
                          setSelectedElement(el);
                          playAudioHaptic('save_auto');
                        }}
                        className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                          isSelected
                            ? `${meta.bg} border-amber-400 ring-2 ring-amber-400/30 text-white shadow-lg`
                            : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-zinc-400'
                        }`}
                      >
                        <Icon size={14} className={meta.text} />
                        <span className="text-xs font-bold font-serif">{el}</span>
                        <span className="text-[10px] font-mono opacity-80">{saju.elements.percentages[el]}%</span>
                      </button>
                    );
                  })}
                </div>

                {/* 선택된 오행 심층 인터랙티브 카드 */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold font-serif ${ELEMENT_COLORS[selectedElement].text} flex items-center gap-1.5`}>
                      <Sparkles size={13} />
                      <span>{ELEMENT_DETAILS[selectedElement].hanja} ({selectedElement}) 기운 상세</span>
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">
                      원국 내 {saju.elements.counts[selectedElement]}글자 보유 ({saju.elements.percentages[selectedElement]}%)
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {ELEMENT_DETAILS[selectedElement].name}의 핵심 에너지: <strong>{ELEMENT_DETAILS[selectedElement].emotionPositive}</strong>. (주의점: {ELEMENT_DETAILS[selectedElement].emotionNegative})
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/5 text-[11px]">
                    <div>
                      <span className="text-zinc-500 block">개운 색상</span>
                      <strong className="text-zinc-200">{ELEMENT_DETAILS[selectedElement].colorName}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">보양 식단</span>
                      <strong className="text-zinc-200">{ELEMENT_DETAILS[selectedElement].remedyFood}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">길방위</span>
                      <strong className="text-zinc-200">{ELEMENT_DETAILS[selectedElement].direction}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================== 2. 궁통보감 기후 온도계 탭 ==================== */}
        {activeTab === 'climate' && (
          <motion.div
            key="climate"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-300 font-serif">
                  🌡️ 궁통보감(窮通寶鑑) 한난조습(寒暖燥濕) 온도계
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  기후 생명력 {climateInfo.vitalityScore}점
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {climateInfo.climateTitle} — {climateInfo.balanceText}
              </p>
            </div>

            {/* 온도 & 습도 2대 게이지 바 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 게이지 1: 한열(寒熱) 체감 온도계 */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-300 flex items-center gap-1">
                    <Sun size={13} className="text-amber-400" />
                    <span>한열(寒熱) 체감 온도</span>
                  </span>
                  <span className="font-mono text-amber-300 font-bold">
                    {climateInfo.tempScore > 20 ? '온열(暖/熱)' : climateInfo.tempScore < -20 ? '한랭(寒)' : '온화(溫)'}
                  </span>
                </div>

                {/* 그라디언트 온도 트랙 */}
                <div className="relative w-full h-3 rounded-full bg-gradient-to-r from-sky-500 via-emerald-400 via-amber-400 to-rose-500 overflow-hidden shadow-inner" />

                {/* 눈금 표시 라벨 */}
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>혹한(-100)</span>
                  <span>온화(0)</span>
                  <span>혹서(+100)</span>
                </div>
              </div>

              {/* 게이지 2: 건습(燥濕) 습도계 */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-300 flex items-center gap-1">
                    <Droplets size={13} className="text-sky-400" />
                    <span>조습(燥濕) 건습도</span>
                  </span>
                  <span className="font-mono text-sky-300 font-bold">
                    {climateInfo.humScore > 20 ? '다습(濕)' : climateInfo.humScore < -20 ? '건조(燥)' : '적정'}
                  </span>
                </div>

                {/* 그라디언트 습도 트랙 */}
                <div className="relative w-full h-3 rounded-full bg-gradient-to-r from-amber-600 via-yellow-400 to-sky-400 overflow-hidden shadow-inner" />

                {/* 눈금 표시 라벨 */}
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>극건조(-100)</span>
                  <span>적정(0)</span>
                  <span>다습(+100)</span>
                </div>
              </div>
            </div>

            {/* 조후용신 솔루션 & 구응신 */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/25 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-400" />
                  <span>궁통보감 조후용신: [{climateInfo.johuElement}] 기운 처방</span>
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {classicReport.geokguk.formationStatus}
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                💡 <strong>운명 돌파 1순위 행동:</strong> {classicReport.prescription.breakthroughAction}
              </p>
            </div>
          </motion.div>
        )}

        {/* ==================== 3. 12시진 생체 바이오리듬 탭 ==================== */}
        {activeTab === 'biorhythm' && (
          <motion.div
            key="biorhythm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-sky-300 font-serif flex items-center gap-1.5">
                  <Clock size={14} />
                  <span>자오유주(子午流注) 12시진 기혈 순환 생체 시계</span>
                </span>
                <p className="text-[11px] text-zinc-400">
                  하루 24시간 동안 12경락의 기혈이 피크를 치는 생체 바이오리듬 곡선
                </p>
              </div>

              {/* 현재 활성 경락 뱃지 */}
              <div className="px-3 py-1.5 rounded-xl bg-sky-500/15 border border-sky-400/40 text-xs font-mono text-sky-200 flex items-center gap-2 self-start sm:self-auto">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                <span>지금 활성: <strong>{meridianReport.meridianCirculation.activeMeridianName}</strong></span>
              </div>
            </div>

            {/* Recharts AreaChart 24h 곡선 */}
            <div className="h-60 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={biorhythmData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="vitalityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    interval={0}
                  />
                  <YAxis
                    domain={[40, 100]}
                    tick={{ fill: '#64748b', fontSize: 10 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded-xl bg-[#1a1c24] border border-sky-400/40 shadow-xl text-xs space-y-1">
                          <p className="font-bold text-sky-300 font-serif">{data.name}시 ({data.time})</p>
                          <p className="text-white">주관 경락: <strong className="text-amber-300">{data.meridian}</strong></p>
                          <p className="text-zinc-400 font-mono">기혈 순환 활성도: {data.vitality}점</p>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="vitality"
                    stroke="#38bdf8"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#vitalityGrad)"
                    isAnimationActive={rechartsAnimationActive()}
                    animationDuration={rechartsAnimationDuration()}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* 삼보(정·기·신) 3대 단전 충전 게이지 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 1. 정(精) 하단전 */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-serif">하단전 • 정(精)</span>
                  <span className="font-bold text-emerald-400 font-mono">{meridianReport.threeTreasures.jingLevelScore}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${meridianReport.threeTreasures.jingLevelScore}%` }} />
                </div>
                <span className="text-[10px] text-zinc-500 block">신장 수기 & 육체 활력</span>
              </div>

              {/* 2. 기(氣) 중단전 */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-serif">중단전 • 기(氣)</span>
                  <span className="font-bold text-amber-400 font-mono">{meridianReport.threeTreasures.qiLevelScore}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${meridianReport.threeTreasures.qiLevelScore}%` }} />
                </div>
                <span className="text-[10px] text-zinc-500 block">비위 소화 & 호흡 순환</span>
              </div>

              {/* 3. 신(神) 상단전 */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-serif">상단전 • 신(神)</span>
                  <span className="font-bold text-purple-400 font-mono">{meridianReport.threeTreasures.shenLevelScore}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-purple-400 rounded-full" style={{ width: `${meridianReport.threeTreasures.shenLevelScore}%` }} />
                </div>
                <span className="text-[10px] text-zinc-500 block">심장 화기 & 영적 직관</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

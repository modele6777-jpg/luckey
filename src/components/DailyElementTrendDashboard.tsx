import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts';
import {
  Activity,
  TrendingUp,
  Compass,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ELEMENT_DETAILS, type FiveElement } from '@/lib/sajuAnalysis';
import {
  getDailyElementTrend,
  type DailyElementSnapshot,
  type ElementTrendAnalysis,
} from '@/lib/dailyElementTracker';
import type { UserProfile } from '@/lib/sharedState';
import { getPersistentUserProfile } from '@/contexts/AppContext';
import { rechartsAnimationActive, rechartsAnimationDuration } from '@/lib/chartPerf';

export interface DailyElementTrendDashboardProps {
  currentElements?: {
    목: number;
    화: number;
    토: number;
    금: number;
    수: number;
  } | null;
  userProfile?: UserProfile | null;
  cardName?: string;
  theme?: 'emerald' | 'amber' | 'blue' | 'purple';
  compact?: boolean;
  className?: string;
}

const ELEMENT_KEYS: FiveElement[] = ['목', '화', '토', '금', '수'];

export function DailyElementTrendDashboard({
  currentElements,
  userProfile,
  cardName,
  theme = 'emerald',
  compact = false,
  className = '',
}: DailyElementTrendDashboardProps) {
  const [selectedElement, setSelectedElement] = useState<FiveElement | 'all'>('all');
  const [chartMode, setChartMode] = useState<'line' | 'radar'>('line');

  // Compute 7-day trend analysis
  const activeProfile = useMemo(() => {
    return userProfile ?? (typeof window !== 'undefined' ? getPersistentUserProfile() : null);
  }, [userProfile]);

  const trendAnalysis: ElementTrendAnalysis = useMemo(() => {
    return getDailyElementTrend(7, currentElements, activeProfile, cardName);
  }, [currentElements, activeProfile, cardName]);

  // Transform data for Recharts LineChart
  const lineChartData = useMemo(() => {
    return trendAnalysis.history.map((item) => ({
      name: item.isToday ? '오늘' : item.shortDate,
      fullDate: item.fullDateStr,
      stemBranch: item.stemBranch,
      isToday: item.isToday,
      목: item.elements.목,
      화: item.elements.화,
      토: item.elements.토,
      금: item.elements.금,
      수: item.elements.수,
    }));
  }, [trendAnalysis.history]);

  // Radar chart data for today
  const radarData = useMemo(() => {
    const today = trendAnalysis.todaySnapshot.elements;
    return [
      { subject: '木 (목·성장)', value: today.목, fullMark: 100 },
      { subject: '火 (화·열정)', value: today.화, fullMark: 100 },
      { subject: '土 (토·안정)', value: today.토, fullMark: 100 },
      { subject: '金 (금·결단)', value: today.금, fullMark: 100 },
      { subject: '水 (수·지혜)', value: today.수, fullMark: 100 },
    ];
  }, [trendAnalysis.todaySnapshot]);

  // Theme styling configurations
  const themeStyles = useMemo(() => {
    switch (theme) {
      case 'amber':
        return {
          accent: 'text-amber-400',
          accentBg: 'bg-amber-500/10',
          border: 'border-amber-500/25',
          radarStroke: '#f59e0b',
          radarFill: '#f59e0b',
          glow: 'from-amber-500/15 via-zinc-950 to-amber-500/5',
        };
      case 'blue':
        return {
          accent: 'text-sky-400',
          accentBg: 'bg-sky-500/10',
          border: 'border-sky-500/25',
          radarStroke: '#0284c7',
          radarFill: '#0284c7',
          glow: 'from-sky-500/15 via-zinc-950 to-sky-500/5',
        };
      case 'purple':
        return {
          accent: 'text-purple-400',
          accentBg: 'bg-purple-500/10',
          border: 'border-purple-500/25',
          radarStroke: '#a855f7',
          radarFill: '#a855f7',
          glow: 'from-purple-500/15 via-zinc-950 to-purple-500/5',
        };
      case 'emerald':
      default:
        return {
          accent: 'text-emerald-400',
          accentBg: 'bg-emerald-500/10',
          border: 'border-emerald-500/25',
          radarStroke: '#10b981',
          radarFill: '#10b981',
          glow: 'from-emerald-500/15 via-zinc-950 to-emerald-500/5',
        };
    }
  }, [theme]);

  // Custom Recharts LineChart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const dataPoint = payload[0]?.payload;

    return (
      <div className="bg-zinc-950/95 border border-white/15 p-3 rounded-2xl shadow-2xl backdrop-blur-xl text-xs space-y-2 min-w-[180px] z-50">
        <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-white/60">
          <span className="font-bold text-white flex items-center gap-1.5">
            {dataPoint?.fullDate || label}
            {dataPoint?.isToday && (
              <span className={`text-[10px] font-bold ${themeStyles.accent}`}>
                [오늘의 운기]
              </span>
            )}
          </span>
          {dataPoint?.stemBranch && (
            <span className="font-mono text-[10px] text-white/40">
              일진: {dataPoint.stemBranch}
            </span>
          )}
        </div>

        <div className="space-y-1">
          {ELEMENT_KEYS.map((key) => {
            const info = ELEMENT_DETAILS[key];
            const val = dataPoint?.[key] ?? 0;
            const isFoc = selectedElement === 'all' || selectedElement === key;
            return (
              <div
                key={key}
                className={`flex items-center justify-between text-[11px] transition-opacity ${
                  isFoc ? 'opacity-100 font-semibold' : 'opacity-40'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: info.colorHex }}
                  />
                  <span className="text-white/80">
                    {info.hanja} {key}
                  </span>
                </div>
                <span className="font-mono font-bold text-white">{val}%</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`rounded-[32px] bg-gradient-to-br ${themeStyles.glow} border ${themeStyles.border} p-5 sm:p-6 backdrop-blur-md shadow-2xl space-y-6 ${className}`}
    >
      {/* 1. Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-xl ${themeStyles.accentBg}`}>
              <TrendingUp size={16} className={themeStyles.accent} />
            </div>
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-white/50">
              COSMIC ELEMENT FLOW
            </span>
            {cardName && (
              <span className="text-white/30 text-xs">· {cardName} 공명</span>
            )}
          </div>
          <h4 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            오행별 에너지 변화 추이
            <span className="text-xs font-normal text-white/40 hidden sm:inline">
              (7일간의 운기 흐름 곡선)
            </span>
          </h4>
        </div>

        {/* View Mode Toggle: Line Trend vs Radar Balance */}
        <div className="flex items-center gap-1.5 p-1 bg-black/40 border border-white/10 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setChartMode('line')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              chartMode === 'line'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-white/40 hover:text-white/80'
            }`}
          >
            <Activity size={13} />
            <span>꺾은선 추이</span>
          </button>
          <button
            type="button"
            onClick={() => setChartMode('radar')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              chartMode === 'radar'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-white/40 hover:text-white/80'
            }`}
          >
            <Compass size={13} />
            <span>오각형 밸런스</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Element Filter Segmented Buttons */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-white/40 font-mono mr-1">분석 필터:</span>
        <button
          type="button"
          onClick={() => setSelectedElement('all')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            selectedElement === 'all'
              ? 'bg-white text-zinc-950 border-white shadow-md'
              : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          전체 5행
        </button>

        {ELEMENT_KEYS.map((key) => {
          const info = ELEMENT_DETAILS[key];
          const isSelected = selectedElement === key;
          const todayVal = trendAnalysis.todaySnapshot.elements[key];
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedElement(key)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                isSelected
                  ? 'border-transparent text-white shadow-lg scale-105'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              style={{
                backgroundColor: isSelected ? info.colorHex : undefined,
              }}
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: isSelected ? '#ffffff' : info.colorHex }}
              />
              <span>
                {info.hanja} {key}
              </span>
              <span className="font-mono text-[10px] opacity-80">{todayVal}%</span>
            </button>
          );
        })}
      </div>

      {/* 3. Main Chart Display */}
      {chartMode === 'line' ? (
        <div className="space-y-2">
          <div className="w-full h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineChartData}
                margin={{ top: 12, right: 12, left: -16, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                />
                <YAxis
                  domain={[0, 60]}
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<CustomTooltip />} />

                {ELEMENT_KEYS.map((key) => {
                  const info = ELEMENT_DETAILS[key];
                  const isFoc = selectedElement === 'all' || selectedElement === key;
                  const isSingle = selectedElement === key;

                  return (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      name={`${info.hanja} ${key}`}
                      stroke={info.colorHex}
                      strokeWidth={isSingle ? 3.5 : isFoc ? 2.5 : 1}
                      strokeOpacity={isFoc ? 1 : 0.15}
                      dot={{
                        r: isSingle ? 5 : isFoc ? 3.5 : 0,
                        fill: info.colorHex,
                        stroke: '#09090b',
                        strokeWidth: 2,
                      }}
                      activeDot={{
                        r: 6,
                        fill: '#ffffff',
                        stroke: info.colorHex,
                        strokeWidth: 3,
                      }}
                      isAnimationActive={rechartsAnimationActive()}
                      animationDuration={rechartsAnimationDuration()}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[10px] text-white/40 pt-1 font-mono">
            <span>← 과거 6일 전 (기류 추이)</span>
            <span className={themeStyles.accent}>오늘 (오라클 공명 최고점) →</span>
          </div>
        </div>
      ) : (
        /* Radar Pentagon Chart Mode */
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-2">
          <div className="w-full md:w-1/2 h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{
                    fill: 'rgba(255,255,255,0.7)',
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                />
                <Radar
                  name="오늘의 오행"
                  dataKey="value"
                  stroke={themeStyles.radarStroke}
                  fill={themeStyles.radarFill}
                  fillOpacity={0.3}
                  isAnimationActive={rechartsAnimationActive()}
                  animationDuration={rechartsAnimationDuration()}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick breakdown list */}
          <div className="w-full md:w-1/2 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
              오늘의 5대 기맥 함유율
            </span>
            <div className="space-y-1.5">
              {ELEMENT_KEYS.map((key) => {
                const info = ELEMENT_DETAILS[key];
                const val = trendAnalysis.todaySnapshot.elements[key];
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/80 font-bold flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: info.colorHex }}
                        />
                        {info.hanja} {info.name}
                      </span>
                      <span className="font-mono font-bold text-white">{val}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${val}%`,
                          backgroundColor: info.colorHex,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. Actionable Energy Shift Analysis & Prescription Box */}
      <div className="pt-2 border-t border-white/10 space-y-4">
        {/* 3 Metric Cards with Clean Typography (Anti-Slop Discipline) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Dominant Element */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider block">
              오늘 가장 우세한 기운
            </span>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: trendAnalysis.dominantElement.info.colorHex }}
              />
              <span className="text-sm font-bold text-white break-keep break-words">
                {trendAnalysis.dominantElement.info.hanja} {trendAnalysis.dominantElement.element} (
                {trendAnalysis.dominantElement.value}%)
              </span>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed font-sans break-keep break-words">
              {trendAnalysis.dominantElement.info.emotionPositive}
            </p>
          </div>

          {/* Rising Element */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider block">
              전일 대비 급상승 기운
            </span>
            <div className="flex items-center gap-1.5">
              <ArrowUpRight size={15} className="text-emerald-400 shrink-0" />
              <span className="text-sm font-bold text-white break-keep break-words">
                {trendAnalysis.risingElement.info.hanja} {trendAnalysis.risingElement.element}{' '}
                <span className="text-emerald-400 text-xs">
                  {trendAnalysis.risingElement.delta >= 0 ? `+${trendAnalysis.risingElement.delta}%` : `${trendAnalysis.risingElement.delta}%`}
                </span>
              </span>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed font-sans break-keep break-words">
              생체 활력 및 추진 파동 상승
            </p>
          </div>

          {/* Declining / Remedy Needed Element */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider block">
              보강 권장(결핍) 기운
            </span>
            <div className="flex items-center gap-1.5">
              <ArrowDownRight size={15} className="text-amber-400 shrink-0" />
              <span className="text-sm font-bold text-white break-keep break-words">
                {trendAnalysis.decliningElement.info.hanja} {trendAnalysis.decliningElement.element} (
                {trendAnalysis.decliningElement.value}%)
              </span>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed font-sans break-keep break-words">
              {trendAnalysis.decliningElement.info.remedyFood.split(',')[0]} 등 보충
            </p>
          </div>
        </div>

        {/* Narrative Insight & Prescription */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs leading-relaxed font-sans">
          <div className="flex items-center gap-1.5 text-white/90">
            <Sparkles size={14} className={themeStyles.accent} />
            <strong className="text-white font-medium">운기 변화 총평:</strong>
            <span className="text-white/80">{trendAnalysis.balanceVerdict}</span>
          </div>

          <div className="flex items-start gap-1.5 text-white/70 pt-1 border-t border-white/5">
            <ShieldCheck size={14} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-300 font-medium mr-1.5">
                오늘의 오행 개운 솔루션:
              </strong>
              <span>{trendAnalysis.remedyAction}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DailyElementTrendDashboard;

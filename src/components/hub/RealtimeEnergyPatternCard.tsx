import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Activity, Bird, Brain, ChevronRight, Music, Sparkles, TreeDeciduous, Zap } from 'lucide-react';
import { useApp, getPersistentUserProfile } from '@/contexts/AppContext';
import { computeRealtimeBiometrics, getKstHour } from '@/lib/biometrics';
import { getHubMetricsIntervalMs } from '@/lib/perfMode';
import { HUB_TIME_PRESETS } from '@/lib/copyTone';
import { calculateDetailedSaju } from '@/lib/sajuAnalysis';

const ENERGY_APPS = [
  { id: 'trinity', icon: Sparkles, color: 'oklch(0.85 0.15 90)', path: '/trinity' },
  { id: 'muse', icon: Music, color: 'oklch(0.50 0.15 260)', path: '/muse' },
  { id: 'orange', icon: TreeDeciduous, color: 'oklch(0.72 0.18 55)', path: '/orange' },
  { id: 'bluebird', icon: Bird, color: 'oklch(0.65 0.18 240)', path: '/bluebird' },
  { id: 'heal', icon: Activity, color: 'oklch(0.70 0.15 150)', path: '/heal' },
];

type TimeEnergySlot = 'morning' | 'afternoon' | 'evening' | 'night';

const TIME_ENERGY_PRESETS = {
  morning: { slotLabel: '아침', ...HUB_TIME_PRESETS.morning, energyAppId: 'trinity', energyAppName: 'TRINITY', matchPercentage: 92 },
  afternoon: { slotLabel: '오후', ...HUB_TIME_PRESETS.afternoon, energyAppId: 'muse', energyAppName: 'MUSE', matchPercentage: 90 },
  evening: { slotLabel: '저녁', ...HUB_TIME_PRESETS.evening, energyAppId: 'orange', energyAppName: 'ORANGE', matchPercentage: 88 },
  night: { slotLabel: '밤', ...HUB_TIME_PRESETS.night, energyAppId: 'bluebird', energyAppName: 'BLUEBIRD', matchPercentage: 94 },
} as const;

function getTimeEnergySlot(hour: number): TimeEnergySlot {
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
}

export function RealtimeEnergyPatternCard() {
  const [, navigate] = useLocation();
  const { sharedState } = useApp();
  const [metricsTick, setMetricsTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setMetricsTick((tick) => tick + 1), getHubMetricsIntervalMs());
    return () => window.clearInterval(id);
  }, []);

  const biometrics = useMemo(
    () => computeRealtimeBiometrics(sharedState),
    [sharedState, metricsTick],
  );
  const { fatigue, stress, focus, sleepScore: sleep } = biometrics;
  const saju = useMemo(
    () => calculateDetailedSaju(sharedState?.userProfile || getPersistentUserProfile()),
    [sharedState?.userProfile],
  );

  const timeAdvice = TIME_ENERGY_PRESETS[getTimeEnergySlot(getKstHour())];
  let energyPatternName: string = timeAdvice.energyPatternName;
  let energyPatternDesc: string = timeAdvice.energyPatternDesc;
  let energyAppName: string = timeAdvice.energyAppName;
  let energyAppId: string = timeAdvice.energyAppId;
  let matchReason = `${timeAdvice.slotLabel} 리듬 · ${timeAdvice.matchReason}`;
  let matchPercentage: number = timeAdvice.matchPercentage;

  if (fatigue > 65 || sleep < 50) {
    energyPatternName = '회복이 필요한 시간';
    energyPatternDesc = '피곤할 땐 무리하지 말고 몸을 먼저 쉬게 해 보세요.';
    energyAppName = 'AURA';
    energyAppId = 'heal';
    matchReason = '피로 회복·가벼운 스트레칭에 좋아요';
    matchPercentage = Math.min(99, Math.round(75 + fatigue * 0.25));
  } else if (stress > 60) {
    energyPatternName = '마음 쉬어가기';
    energyPatternDesc = '스트레스가 높을 땐 잠깐 멈추고 호흡을 고르는 게 좋아요.';
    energyAppName = 'BLUEBIRD';
    energyAppId = 'bluebird';
    matchReason = '마음 안정·휴식에 좋은 시간';
    matchPercentage = Math.min(99, Math.round(70 + stress * 0.3));
  }

  const recommended = ENERGY_APPS.find((app) => app.id === energyAppId);
  const EnergyAppIcon = recommended?.icon || Sparkles;
  const energyAppColor = recommended?.color || 'oklch(0.85 0.15 90)';

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col">
      <div className="glass prism-xs-hub-card p-5 sm:p-6 md:p-7 rounded-[28px] border border-white/15 shadow-2xl relative overflow-hidden group flex flex-col justify-between">
        <div
          className="hidden md:block absolute -top-12 -right-12 w-72 h-72 rounded-full blur-[90px] opacity-15 pointer-events-none transition-transform duration-1000 group-hover:scale-110"
          style={{ background: energyAppColor }}
        />
        <div className="relative z-10 flex flex-col lg:flex-row items-stretch gap-5 lg:gap-8">
          <div className="flex flex-col justify-between lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-white/10 pb-5 lg:pb-0 lg:pr-7 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold text-white/55 uppercase tracking-[0.22em] font-mono">REAL-TIME BIOMETRICS</span>
              </div>
              <h3 className="text-base sm:text-lg font-display font-bold text-white tracking-tight">현재 실시간 에너지 패턴</h3>
              {saju && (
                <p className="text-[11px] text-indigo-300/95 font-sans font-semibold mt-1 flex items-center gap-1.5">
                  <Sparkles size={11} className="text-amber-400 shrink-0" />
                  <span>{saju.dayMaster.hanja}({saju.dayMaster.korean}) 본원 체질 · {saju.elements.strengthLabel || `${saju.elements.dominant.element}기운 우세`}</span>
                </p>
              )}
            </div>
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-2.5 lg:gap-3">
              <div className="p-2.5 lg:p-0 rounded-xl bg-white/[0.03] lg:bg-transparent border border-white/5 lg:border-0 space-y-1.5">
                <div className="flex justify-between items-center text-[11px] font-sans">
                  <span className="text-white/65 flex items-center gap-1 font-medium"><Activity size={11} className="text-emerald-400 shrink-0" /> 피로도</span>
                  <span className="text-emerald-400 font-bold font-mono">{Math.round(fatigue)}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(5, fatigue))}%` }} />
                </div>
              </div>
              <div className="p-2.5 lg:p-0 rounded-xl bg-white/[0.03] lg:bg-transparent border border-white/5 lg:border-0 space-y-1.5">
                <div className="flex justify-between items-center text-[11px] font-sans">
                  <span className="text-white/65 flex items-center gap-1 font-medium"><Brain size={11} className="text-rose-400 shrink-0" /> 스트레스</span>
                  <span className="text-rose-400 font-bold font-mono">{Math.round(stress)}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(5, stress))}%` }} />
                </div>
              </div>
              <div className="p-2.5 lg:p-0 rounded-xl bg-white/[0.03] lg:bg-transparent border border-white/5 lg:border-0 space-y-1.5">
                <div className="flex justify-between items-center text-[11px] font-sans">
                  <span className="text-white/65 flex items-center gap-1 font-medium"><Zap size={11} className="text-amber-400 shrink-0" /> 몰입도</span>
                  <span className="text-amber-400 font-bold font-mono">{Math.round(focus)}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(5, focus))}%` }} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <div
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border uppercase tracking-wider"
                  style={{ color: energyAppColor, borderColor: `${energyAppColor}55`, background: `${energyAppColor}18` }}
                >
                  SYNC RATE {matchPercentage}%
                </div>
                <span className="text-[10px] text-white/55 font-bold uppercase tracking-widest font-mono">
                  ENERGY SYNC · {timeAdvice.slotLabel} 리듬
                </span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-white tracking-tight break-keep">{energyPatternName}</h4>
              <p className="text-xs sm:text-[13px] text-white/75 leading-relaxed break-keep font-medium">{energyPatternDesc}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 pt-3 border-t border-white/10">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center relative overflow-hidden shrink-0 border border-white/15 shadow-inner"
                  style={{ background: `${energyAppColor}18` }}
                >
                  <EnergyAppIcon size={20} style={{ color: energyAppColor, filter: `drop-shadow(0 0 8px ${energyAppColor})` }} />
                </div>
                <div className="text-left min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-white uppercase tracking-wider">{energyAppName}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 text-white/80 font-semibold">추천 채널</span>
                  </div>
                  <div className="text-[11px] text-white/60 font-sans leading-snug mt-0.5 truncate">{matchReason}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate(recommended?.path || '/')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 text-white transition-all active:scale-95 cursor-pointer shrink-0 border border-white/20 hover:border-white/40 bg-white/10 hover:bg-white/15 shadow-lg font-sans"
              >
                <span>추천 채널 바로가기</span>
                <ChevronRight size={14} className="opacity-80" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

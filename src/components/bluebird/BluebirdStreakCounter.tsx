import React from 'react';
import { motion } from 'motion/react';
import { Flame, Sparkles, Trophy, ChevronRight, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { BluebirdStreakData, JOURNEY_MILESTONES, JourneyMilestone } from '@/lib/bluebirdStreak';

interface BluebirdStreakCounterProps {
  streakData: BluebirdStreakData;
  completedTodayCount: number;
  totalTodayCount: number;
  isTodayAllCompleted: boolean;
  onOpenMissionSection?: () => void;
  variant?: 'banner' | 'card' | 'compact';
}

export function BluebirdStreakCounter({
  streakData,
  completedTodayCount,
  totalTodayCount,
  isTodayAllCompleted,
  onOpenMissionSection,
  variant = 'banner',
}: BluebirdStreakCounterProps) {
  const currentStreak = streakData.currentStreak || 0;
  const journeyDay = streakData.journeyDay || 1;
  const progressPercent = Math.min(100, Math.round(((journeyDay - (isTodayAllCompleted ? 0 : 1)) / 40) * 100));

  // Find next milestone
  const nextMilestone: JourneyMilestone =
    JOURNEY_MILESTONES.find(m => m.day >= journeyDay) || JOURNEY_MILESTONES[JOURNEY_MILESTONES.length - 1];
  const daysToNextMilestone = Math.max(0, nextMilestone.day - journeyDay);

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={onOpenMissionSection}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-mono transition-all cursor-pointer shadow-sm active:scale-95"
        title="40일 치유 여정 스트릭 카운터"
      >
        <span className="flex items-center gap-1 font-bold text-amber-400">
          <Flame size={14} className={currentStreak > 0 ? "text-amber-400 animate-pulse fill-amber-400" : "text-zinc-500"} />
          <span>{currentStreak}일</span>
        </span>
        <span className="w-px h-3 bg-white/20" />
        <span className="text-[11px] text-sky-200">
          Day {journeyDay}/40
        </span>
      </button>
    );
  }

  if (variant === 'banner') {
    return (
      <div className="w-full p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#071926]/90 via-[#0a2335]/80 to-[#0c1a24]/90 border border-sky-500/30 shadow-[0_0_25px_rgba(14,165,233,0.12)] backdrop-blur-xl relative overflow-hidden text-left font-sans">
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none translate-y-1/3 -translate-x-1/4" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Streak Flame Badge & Day Title */}
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 via-sky-500/20 to-sky-950/40 border border-amber-400/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              <Flame
                size={26}
                className={`${
                  currentStreak > 0
                    ? 'text-amber-400 fill-amber-400/80 animate-pulse drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                    : 'text-zinc-400'
                }`}
              />
              {currentStreak > 0 && (
                <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-black font-mono shadow-sm">
                  {currentStreak}D
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-widest text-sky-400 flex items-center gap-1">
                  <ShieldCheck size={13} />
                  40일 잠재의식 치유 여정
                </span>
                {isTodayAllCompleted ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 size={11} /> 오늘 미션 완료!
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 text-[10px] font-bold">
                    오늘 미션 {completedTodayCount}/{totalTodayCount}
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2 mt-0.5">
                <h4 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                  <span className="text-amber-300 font-mono font-black">{currentStreak}일</span> 연속 치유 스트릭
                </h4>
                <span className="text-xs text-sky-200/60 font-medium">
                  · 40일 여정의 <strong className="text-white font-mono">{journeyDay}일차</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Center-Right: Progress bar and action button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-5 flex-1 max-w-md">
            {/* Progress Gauge */}
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-sky-300/80">
                  다음 마일스톤: <strong className="text-amber-200 font-bold">{nextMilestone.title}</strong>
                  {daysToNextMilestone > 0 && <span className="text-white/50 ml-1">(D-{daysToNextMilestone})</span>}
                </span>
                <span className="text-amber-300 font-black">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 sm:h-2.5 rounded-full bg-black/60 border border-white/10 p-0.5 overflow-hidden relative shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 via-teal-300 to-amber-300 shadow-[0_0_14px_rgba(56,189,248,0.7),0_0_24px_rgba(251,191,36,0.35)] relative overflow-hidden"
                >
                  <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none"
                  />
                  {progressPercent > 0 && progressPercent < 100 && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff,0_0_10px_rgba(56,189,248,0.9)]" />
                  )}
                </motion.div>
              </div>
            </div>

            {/* Open 40-Day Mission Button */}
            {onOpenMissionSection && (
              <button
                type="button"
                onClick={onOpenMissionSection}
                className="px-4 py-2.5 rounded-2xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0 shadow-md group"
              >
                <span>40일 미션 보기</span>
                <ChevronRight size={14} className="text-sky-300 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Full Card Variant
  return (
    <div className="w-full p-6 sm:p-8 rounded-[36px] bg-gradient-to-b from-[#081a29]/95 via-[#07131e]/90 to-[#040b12]/95 border border-sky-500/30 shadow-[0_0_35px_rgba(14,165,233,0.18)] relative overflow-hidden text-left font-sans">
      <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-[70px] pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles size={13} className="text-sky-300 animate-pulse" />
              <span>40-DAY HEALING JOURNEY · STREAK COUNTER</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              40일 무의식 치유의 여정
            </h3>
            <p className="text-xs text-sky-200/60 leading-relaxed max-w-lg">
              매일 데일리 미션을 완수하여 40일간 빠짐없이 잠재의식을 정화하고, 온전한 평화와 자유를 성취하세요.
            </p>
          </div>

          {/* Big Streak Badge */}
          <div className="flex items-center gap-3 self-start sm:self-center px-5 py-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 shadow-inner">
            <Flame
              size={32}
              className={`${
                currentStreak > 0
                  ? 'text-amber-400 fill-amber-400 animate-bounce drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]'
                  : 'text-zinc-500'
              }`}
            />
            <div>
              <span className="text-[10px] text-amber-200/70 uppercase tracking-widest font-mono font-bold block">
                CURRENT STREAK
              </span>
              <span className="text-3xl font-black text-amber-300 font-mono tracking-tight">
                {currentStreak} <span className="text-sm font-sans font-bold text-white/80">일 연속</span>
              </span>
            </div>
          </div>
        </div>

        {/* 4 Stat Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider font-bold">현재 연속 스트릭</span>
            <div className="text-2xl font-black text-amber-300 font-mono">{currentStreak}일</div>
            <p className="text-[10px] text-white/50">매일 미션 완수 유지</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider font-bold">40일 여정 진행도</span>
            <div className="text-2xl font-black text-sky-300 font-mono">Day {journeyDay} <span className="text-xs text-white/40 font-sans">/ 40</span></div>
            <p className="text-[10px] text-white/50">목표 달성률 {progressPercent}%</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider font-bold">역대 최장 스트릭</span>
            <div className="text-2xl font-black text-emerald-300 font-mono">{streakData.longestStreak || currentStreak}일</div>
            <p className="text-[10px] text-white/50">최고의 지속력 기록</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider font-bold">40일 완주 회차</span>
            <div className="text-2xl font-black text-purple-300 font-mono">{streakData.completedCycles || 0}회</div>
            <p className="text-[10px] text-white/50">누적 {streakData.totalCompletedDays || 0}일 실천</p>
          </div>
        </div>

        {/* 40-Day Progress Bar */}
        <div className="p-5 rounded-2xl bg-black/40 border border-sky-500/20 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <Trophy size={14} className="text-amber-400" />
              <span className="text-white font-bold">
                다음 성소 마일스톤: <span className="text-amber-300">{nextMilestone.title} ({nextMilestone.badgeEmoji})</span>
              </span>
            </div>
            <span className="text-sky-300 font-bold">{progressPercent}% 완료</span>
          </div>

          <div className="w-full h-3 rounded-full bg-zinc-950 border border-white/10 p-0.5 overflow-hidden relative shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-sky-500 via-teal-400 to-amber-400 shadow-[0_0_16px_rgba(56,189,248,0.75),0_0_26px_rgba(251,191,36,0.35)] relative overflow-hidden"
            >
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none"
              />
              {progressPercent > 0 && progressPercent < 100 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff,0_0_12px_rgba(56,189,248,0.9)]" />
              )}
            </motion.div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-white/50">
            <span>Day 1 (출발)</span>
            <span>Day 14 (고요)</span>
            <span>Day 21 (전환)</span>
            <span>Day 30 (합일)</span>
            <span className="text-amber-300 font-bold">Day 40 (완주)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

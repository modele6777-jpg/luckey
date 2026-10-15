import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame, Sparkles, Check, CheckCircle2, Circle, Trophy, ArrowRight,
  ShieldCheck, RefreshCw, Volume2, Share2, Award, Zap, Heart, Compass,
  BookOpen, Star, Info, ChevronRight, X
} from 'lucide-react';
import {
  BluebirdStreakData,
  BluebirdDailyMissionItem,
  JOURNEY_MILESTONES,
  DAILY_40_QUOTES,
  JourneyMilestone,
} from '@/lib/bluebirdStreak';
import { BluebirdStreakCounter } from './BluebirdStreakCounter';
import { TTSButton } from '@/components/TTSButton';

interface BluebirdDailyMissionSectionProps {
  streakData: BluebirdStreakData;
  missions: BluebirdDailyMissionItem[];
  onToggleMission: (missionId: string) => void;
  onCompleteAllMissions: () => void;
  onNavigateToCleanse?: () => void;
  onIncrementChant?: () => void;
  onToggleBinaural?: () => void;
  isBinauralPlaying?: boolean;
}

export function BluebirdDailyMissionSection({
  streakData,
  missions,
  onToggleMission,
  onCompleteAllMissions,
  onNavigateToCleanse,
  onIncrementChant,
  onToggleBinaural,
  isBinauralPlaying,
}: BluebirdDailyMissionSectionProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<JourneyMilestone | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  const completedCount = useMemo(() => missions.filter(m => m.completed).length, [missions]);
  const totalCount = missions.length;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;
  const journeyDay = streakData.journeyDay || 1;
  const currentStreak = streakData.currentStreak || 0;

  // Day quote
  const dayQuote = DAILY_40_QUOTES[journeyDay] || DAILY_40_QUOTES[1];

  // Total points earned today
  const earnedPoints = useMemo(
    () => missions.filter(m => m.completed).reduce((sum, m) => sum + m.points, 0),
    [missions]
  );
  const maxPossiblePoints = useMemo(() => missions.reduce((sum, m) => sum + m.points, 0), [missions]);

  const handleShareAchievement = async () => {
    const text = `🕊️ [LUCKEY • 파랑새 40일 치유 여정]\n🔥 ${currentStreak}일 연속 치유 스트릭 달성 중!\n📅 40일 여정의 ${journeyDay}일차 실천\n✨ 오늘의 미션 완수: ${completedCount}/${totalCount}\n💬 오늘의 치유 한마디: "${dayQuote.quote}"\n\n#LucKey #블루버드 #40일치유여정 #호오포노포노 #마음정화`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: '파랑새 40일 치유 여정 스트릭',
          text,
        });
        return;
      } catch (_) {}
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch (_) {}
  };

  return (
    <div className="space-y-10 text-left font-sans animate-fade-in pb-16">
      {/* 1. Hero Streak Counter Card */}
      <BluebirdStreakCounter
        streakData={streakData}
        completedTodayCount={completedCount}
        totalTodayCount={totalCount}
        isTodayAllCompleted={isAllCompleted}
        variant="card"
      />

      {/* 2. Today's Encouragement & Daily Journey Quote */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Journey Focus & Status Banner */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-gradient-to-br from-[#0c1c28]/90 to-[#07131e]/90 border border-sky-500/20 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-sky-400 uppercase">
                DAY {journeyDay} FOCUS
              </span>
              <span className="px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-[10px] font-mono">
                {dayQuote.focus}
              </span>
            </div>
            <h4 className="text-xl font-bold text-white tracking-tight">
              {isAllCompleted ? '오늘의 성소 미션 완료!' : '오늘의 정화 미션 진행 중'}
            </h4>
            <p className="text-xs text-white/60 leading-relaxed break-keep">
              {isAllCompleted
                ? `축하합니다! 오늘의 모든 미션을 완수하여 ${currentStreak}일 연속 스트릭을 단단히 지켜냈습니다.`
                : `총 ${totalCount}개 중 ${totalCount - completedCount}개의 미션이 남아있습니다. 한 걸음씩 마음을 정화해 보세요.`}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/50">오늘 획득 정류 포인트</span>
              <span className="text-amber-300 font-mono font-black">+{earnedPoints} / {maxPossiblePoints} FPS</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShareAchievement}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <Share2 size={13} className="text-sky-400" />
                <span>{copiedShare ? '클립보드 복사됨!' : '여정 스트릭 공유'}</span>
              </button>
              {!isAllCompleted && (
                <button
                  type="button"
                  onClick={onCompleteAllMissions}
                  className="py-2.5 px-3 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-200 text-xs font-bold transition-all cursor-pointer active:scale-95 shrink-0"
                  title="오늘 미션 모두 완료 처리하기"
                >
                  전체 완료
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Daily Inspiring Quote */}
        <div className="lg:col-span-2 p-7 rounded-3xl bg-[#081521]/80 border border-sky-500/20 relative overflow-hidden flex flex-col justify-between space-y-4">
          <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-300/80 uppercase flex items-center gap-1.5">
                <BookOpen size={12} />
                40일 잠재의식 치유 전언 · DAY {journeyDay}
              </span>
              <TTSButton
                text={`40일 치유 여정 ${journeyDay}일차. ${dayQuote.quote}`}
                voice="Kore"
                className="text-sky-400 border-sky-500/20 text-xs"
              />
            </div>

            <blockquote className="text-base sm:text-lg font-serif text-white/90 italic leading-relaxed pt-1">
              "{dayQuote.quote}"
            </blockquote>
          </div>

          <div className="flex items-center justify-between text-xs text-white/40 pt-3 border-t border-white/5 relative z-10">
            <span className="font-medium">— {dayQuote.author}</span>
            <span className="text-[11px] font-mono text-sky-300/60">
              40-Day Subconscious Sanctuary
            </span>
          </div>
        </div>
      </div>

      {/* 3. Today's Daily Missions Checklist */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                오늘의 데일리 치유 미션
              </h3>
              <p className="text-xs text-white/40">
                각 미션을 실천하고 체크하여 40일 연속 스트릭을 이어가세요.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-bold text-sky-300">
              {completedCount} / {totalCount} 완수
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {missions.map((mission) => {
            const isDone = mission.completed;
            return (
              <motion.div
                key={mission.id}
                whileHover={{ scale: 1.01 }}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-3 text-left relative overflow-hidden group ${
                  isDone
                    ? 'bg-[#091a1e]/90 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                    : 'bg-[#07131e]/70 border-white/10 hover:border-sky-500/30'
                }`}
              >
                {/* Top: Checkbox, Emoji, Title */}
                <div className="flex items-start gap-3.5">
                  <button
                    type="button"
                    onClick={() => onToggleMission(mission.id)}
                    className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-400 text-black shadow-md shadow-emerald-500/30'
                        : 'border-white/30 hover:border-sky-400 bg-white/5'
                    }`}
                  >
                    {isDone && <Check size={15} strokeWidth={3} />}
                  </button>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg">{mission.emoji}</span>
                      <h4
                        className={`text-sm sm:text-base font-bold transition-all ${
                          isDone ? 'text-emerald-200 line-through opacity-80' : 'text-white'
                        }`}
                      >
                        {mission.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                        +{mission.points} FPS
                      </span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed break-keep">
                      {mission.subtitle}
                    </p>
                    <p className="text-[11px] text-sky-300/70 font-sans pt-1">
                      💡 {mission.actionTip}
                    </p>
                  </div>
                </div>

                {/* Bottom Quick Action helper */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                  <span className="text-[10px] text-white/40 font-mono">소요 시간: {mission.duration}</span>

                  {/* Contextual quick button */}
                  {mission.autoDetectType === 'chant' && onIncrementChant && (
                    <button
                      type="button"
                      onClick={() => onIncrementChant()}
                      className="px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 text-[11px] font-bold flex items-center gap-1 transition-all"
                    >
                      <span>암송 카운트 +1</span>
                      <ArrowRight size={11} />
                    </button>
                  )}

                  {mission.autoDetectType === 'cleanse' && onNavigateToCleanse && (
                    <button
                      type="button"
                      onClick={onNavigateToCleanse}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-[11px] font-bold flex items-center gap-1 transition-all"
                    >
                      <span>정화하러 가기</span>
                      <ArrowRight size={11} />
                    </button>
                  )}

                  {mission.autoDetectType === 'binaural' && onToggleBinaural && (
                    <button
                      type="button"
                      onClick={onToggleBinaural}
                      className="px-2.5 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 text-[11px] font-bold flex items-center gap-1 transition-all"
                    >
                      <span>{isBinauralPlaying ? '주파수 끄기' : '주파수 켜기'}</span>
                      <ArrowRight size={11} />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 4. 40-Day Journey Roadmap Visual Grid */}
      <div className="p-6 sm:p-8 rounded-[36px] bg-[#07131e]/90 border border-sky-500/20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass size={18} className="text-sky-400" />
              <h3 className="text-lg font-bold text-white tracking-tight">
                40일 치유 여정 로드맵
              </h3>
            </div>
            <p className="text-xs text-white/50">
              40일간 매일 하나의 원을 채워가며 잠재의식 신경망을 온전한 평화로 채워나갑니다.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-white/60">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> 완수일
            </span>
            <span className="flex items-center gap-1.5 text-white/60">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" /> 오늘(Day {journeyDay})
            </span>
            <span className="flex items-center gap-1.5 text-white/60">
              <span className="w-2.5 h-2.5 rounded-full bg-white/20" /> 예정
            </span>
          </div>
        </div>

        {/* 40-Day Grid: 40 circles with milestones highlighted */}
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-2.5">
          {Array.from({ length: 40 }, (_, idx) => {
            const dayNum = idx + 1;
            const milestone = JOURNEY_MILESTONES.find(m => m.day === dayNum);
            const isCompleted = dayNum < journeyDay || (dayNum === journeyDay && isAllCompleted);
            const isCurrent = dayNum === journeyDay;

            return (
              <motion.div
                key={dayNum}
                whileHover={{ scale: 1.08 }}
                onClick={() => milestone && setSelectedMilestone(milestone)}
                className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center p-1.5 transition-all text-center select-none cursor-pointer ${
                  isCompleted
                    ? 'bg-gradient-to-br from-emerald-600/30 to-teal-800/30 border border-emerald-400/50 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                    : isCurrent
                    ? 'bg-gradient-to-br from-amber-500/20 to-sky-500/20 border-2 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.35)] animate-pulse'
                    : 'bg-white/[0.02] border border-white/5 text-white/30 hover:border-white/20'
                }`}
                title={`Day ${dayNum}${milestone ? ` · ${milestone.title}` : ''}`}
              >
                {milestone ? (
                  <span className="text-xs sm:text-sm">{milestone.badgeEmoji}</span>
                ) : isCompleted ? (
                  <Check size={14} className="text-emerald-400" />
                ) : (
                  <span className="text-[10px] font-mono font-bold">{dayNum}</span>
                )}
                <span className="text-[8px] font-mono opacity-60">D{dayNum}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 5. 40-Day Milestone Badges Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-amber-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              40일 치유 성소 마일스톤
            </h3>
          </div>
          <span className="text-xs text-white/40">클릭하여 세부 정보 확인</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {JOURNEY_MILESTONES.map((milestone) => {
            const isUnlocked = journeyDay >= milestone.day;
            return (
              <motion.button
                key={milestone.day}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedMilestone(milestone)}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-2.5 ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-[#0a2335]/90 to-[#07131e]/90 border-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.15)]'
                    : 'bg-white/[0.02] border-white/5 opacity-50 hover:opacity-80'
                }`}
              >
                <div className="text-3xl sm:text-4xl">{milestone.badgeEmoji}</div>
                <div>
                  <span className="text-[9px] font-mono uppercase font-bold text-amber-300 block">
                    Day {milestone.day}
                  </span>
                  <h5 className="text-xs font-bold text-white mt-0.5 break-keep break-words">
                    {milestone.title}
                  </h5>
                </div>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    isUnlocked
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                      : 'bg-white/5 text-white/40 border border-white/10'
                  }`}
                >
                  {isUnlocked ? '달성 완료' : `D-${Math.max(0, milestone.day - journeyDay)}`}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 6. Milestone Detail Modal */}
      <AnimatePresence>
        {selectedMilestone && (
          <div
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedMilestone(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full p-6 sm:p-8 rounded-[32px] bg-[#0b1722] border border-amber-400/40 shadow-2xl text-center space-y-5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <button
                type="button"
                onClick={() => setSelectedMilestone(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="text-6xl mx-auto w-24 h-24 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center shadow-lg">
                {selectedMilestone.badgeEmoji}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold">
                  DAY {selectedMilestone.day} MILESTONE
                </span>
                <h4 className="text-2xl font-bold text-white">
                  {selectedMilestone.title}
                </h4>
                <p className="text-xs text-sky-300/80 font-mono">
                  {selectedMilestone.subtitle}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-white/70 leading-relaxed break-keep px-2">
                {selectedMilestone.description}
              </p>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-xs text-amber-200 font-mono font-bold flex items-center justify-center gap-2">
                <Trophy size={14} className="text-amber-400" />
                <span>성취 보상: +{selectedMilestone.rewardPoints} FPS 포인트</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMilestone(null)}
                className="w-full py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-white text-xs font-bold transition-all cursor-pointer active:scale-95"
              >
                확인
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

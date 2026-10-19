import React from 'react';
import { motion } from 'motion/react';
import {
  Flame,
  BookOpen,
  Heart,
  Compass,
  Award,
  Sparkles,
  Share2,
  Users,
  ChevronRight,
  ShieldCheck,
  Star
} from 'lucide-react';
import type { EpilogueAchievementStats } from '@/types/epilogueAchievement';

interface Props {
  stats: EpilogueAchievementStats;
  onOpenShareModal: (tab?: 'card' | 'feed') => void;
  compact?: boolean;
}

export function EpilogueAchievementStatsCard({ stats, onOpenShareModal, compact = false }: Props) {
  const universeSyncPercent = Math.round((stats.activeUniversesCount / 5) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-[32px] sm:rounded-[36px] border shadow-2xl backdrop-blur-2xl transition-all ${
        compact
          ? 'p-5 sm:p-6 bg-white/90 dark:bg-zinc-950/75 border-purple-200 dark:border-purple-500/30'
          : 'p-6 sm:p-8 bg-white/95 dark:bg-zinc-950/80 border-purple-300/70 dark:border-purple-500/30'
      }`}
    >
      {/* Decorative Radiant Background Gradients */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-purple-500/15 dark:bg-purple-600/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-pink-500/15 dark:bg-pink-600/15 blur-3xl pointer-events-none" />

      {/* Header Row */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 dark:border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400/20 to-purple-500/20 border border-amber-400/40 dark:border-purple-400/30 flex items-center justify-center text-amber-500 dark:text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Award size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest uppercase font-mono px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                SOUL ACHIEVEMENT DASHBOARD
              </span>
              <span className="text-zinc-300 dark:text-white/20">·</span>
              <span className="text-[11px] font-mono text-zinc-500 dark:text-white/50">
                {stats.todayDateKey}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2 mt-0.5">
              <span>에필로그 성취 통계 카드</span>
              <Sparkles size={16} className="text-amber-500 dark:text-amber-300" />
            </h3>
          </div>
        </div>

        {/* Soul Traveler Name Tag */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-white/5 border border-purple-100 dark:border-white/10 text-xs font-mono text-zinc-700 dark:text-purple-200 flex items-center gap-1.5">
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <span>여행자:</span>
            <strong className="text-zinc-900 dark:text-white">{stats.userName}</strong>
          </div>
        </div>
      </div>

      {/* Soul Evolution Level Hero Banner */}
      <div className="relative z-10 my-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50/50 to-indigo-50 dark:from-purple-950/40 dark:via-pink-950/20 dark:to-indigo-950/40 border border-purple-200 dark:border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
            <ShieldCheck size={13} className="text-amber-500 dark:text-amber-400" />
            <span>오늘의 영혼 진화 등급</span>
          </div>
          <div className="text-base sm:text-lg font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <span className="text-amber-500 dark:text-amber-300 text-lg">✨</span>
            <span>{stats.soulEvolutionLevel}</span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-white/60 font-sans">
            오늘 하루 나를 비추고 기록한 진정성이 쌓여 완성된 성취 등급입니다.
          </p>
        </div>

        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 shrink-0 self-start sm:self-center">
          <span className="text-2xl">{stats.topMoodEmoji}</span>
          <div>
            <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-300 uppercase block">대표 무드</span>
            <span className="text-xs font-bold text-zinc-900 dark:text-white">{stats.topMood}</span>
          </div>
        </div>
      </div>

      {/* 4 Core Metrics Grid */}
      <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 my-4">
        {/* Metric 1: Streak */}
        <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-white/[0.03] border border-purple-100 dark:border-white/10 space-y-1.5 transition-all hover:border-amber-400/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Flame size={14} className="animate-pulse" />
              <span>연속 성찰</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-400 dark:text-white/30">STREAK</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-mono tracking-tight">
            {stats.streakDays}
            <span className="text-xs sm:text-sm font-normal text-zinc-500 dark:text-white/50 ml-1">일 연속</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-white/40 leading-snug">
            멈추지 않고 이어진 내면의 기록
          </p>
        </div>

        {/* Metric 2: Total Diaries */}
        <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-white/[0.03] border border-purple-100 dark:border-white/10 space-y-1.5 transition-all hover:border-purple-400/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
              <BookOpen size={14} />
              <span>누적 성찰</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-400 dark:text-white/30">DIARIES</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-mono tracking-tight">
            {stats.totalDiaries}
            <span className="text-xs sm:text-sm font-normal text-zinc-500 dark:text-white/50 ml-1">편 작성</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-white/40 leading-snug">
            정성껏 축적된 소중한 영혼 아카이브
          </p>
        </div>

        {/* Metric 3: Total Gratitudes */}
        <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-white/[0.03] border border-purple-100 dark:border-white/10 space-y-1.5 transition-all hover:border-pink-400/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1">
              <Heart size={14} />
              <span>발견한 감사</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-400 dark:text-white/30">THANKS</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-mono tracking-tight">
            {stats.totalGratitudes}
            <span className="text-xs sm:text-sm font-normal text-zinc-500 dark:text-white/50 ml-1">가지</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-white/40 leading-snug">
            일상 속에서 밝혀낸 감사의 씨앗
          </p>
        </div>

        {/* Metric 4: Universe Synchronization */}
        <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-white/[0.03] border border-purple-100 dark:border-white/10 space-y-1.5 transition-all hover:border-cyan-400/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
              <Compass size={14} />
              <span>우주 동조율</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-400 dark:text-white/30">COSMIC</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-mono tracking-tight">
            {universeSyncPercent}
            <span className="text-xs sm:text-sm font-normal text-zinc-500 dark:text-white/50 ml-1">% 동기화</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-white/40 leading-snug">
            활성 영역 {stats.activeUniversesCount}/5 채널 연결
          </p>
        </div>
      </div>

      {/* Today's Reflection Snippet */}
      {stats.todayQuote && (
        <div className="relative z-10 my-4 p-3.5 sm:p-4 rounded-2xl bg-purple-100/50 dark:bg-purple-950/30 border-l-4 border-purple-500 text-xs sm:text-sm text-zinc-800 dark:text-purple-100/90 leading-relaxed font-sans flex items-start gap-2.5">
          <Sparkles size={16} className="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="italic break-keep break-words">
            "{stats.todayQuote}"
          </p>
        </div>
      )}

      {/* Main Action Trigger Buttons */}
      <div className="relative z-10 pt-4 border-t border-purple-100 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-zinc-500 dark:text-white/50 flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-500 dark:text-emerald-400" />
          <span>오늘 하루의 성취 증명서와 피드를 우주 광장에 공유할 수 있습니다.</span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Main Hero CTA: Open Report Card Modal */}
          <button
            type="button"
            onClick={() => onOpenShareModal('card')}
            className="flex-1 sm:flex-none px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(168,85,247,0.35)] active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-purple-300/40"
          >
            <Share2 size={15} />
            <span>🏆 성취 리포트 카드 발급 &amp; 공유</span>
          </button>

          {/* Secondary CTA: View Community Feed */}
          <button
            type="button"
            onClick={() => onOpenShareModal('feed')}
            className="px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-zinc-700 dark:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-white/10 dark:hover:bg-white/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 border border-zinc-200 dark:border-white/10"
            title="우주 광장 커뮤니티 피드 열기"
          >
            <Users size={15} className="text-purple-600 dark:text-purple-300" />
            <span className="hidden sm:inline">커뮤니티 광장 피드</span>
            <span className="sm:hidden">광장 피드</span>
            <ChevronRight size={14} className="text-zinc-400 dark:text-white/40" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

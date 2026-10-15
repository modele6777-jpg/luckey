import React from 'react';
import {
  Sparkles,
  Award,
  Calendar,
  Heart,
  BookOpen,
  Flame,
  Compass,
  Star,
  ShieldCheck,
  Moon
} from 'lucide-react';
import type { EpilogueAchievementStats } from '@/types/epilogueAchievement';

interface Props {
  stats: EpilogueAchievementStats;
  innerRef?: React.RefObject<HTMLDivElement | null>;
}

export function EpilogueAchievementReportCard({ stats, innerRef }: Props) {
  return (
    <div
      ref={innerRef}
      id="epilogue-achievement-card-root"
      style={{
        width: '640px',
        minHeight: '820px',
        background: 'linear-gradient(145deg, #090915 0%, #110d24 50%, #080712 100%)',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
      className="p-8 rounded-[36px] border border-purple-500/30 shadow-2xl relative overflow-hidden flex flex-col justify-between select-none"
    >
      {/* Radiant Background Accents */}
      <div 
        style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} 
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '-80px',
          left: '-80px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} 
      />

      {/* Decorative Outer Border Lines */}
      <div 
        style={{
          position: 'absolute',
          inset: '12px',
          borderRadius: '26px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          pointerEvents: 'none',
        }} 
      />

      {/* Card Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div 
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(244, 114, 182, 0.3) 100%)',
                border: '1px solid rgba(192, 132, 252, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)',
              }}
            >
              <Moon size={22} className="text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-[0.25em] font-mono">
                  LUCKEY • EPILOGUE
                </span>
                <span className="text-white/20">|</span>
                <span className="text-[10px] text-amber-300 font-bold font-mono">
                  SOUL CERTIFICATE
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                에필로그 영혼 성취 연대기 리포트
              </h2>
            </div>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-purple-200">
              <Calendar size={12} className="text-purple-400" />
              <span>{stats.todayDateKey}</span>
            </div>
            <p className="text-[10px] text-white/40 font-mono mt-1">
              TRAVELER: <span className="text-white/80 font-bold">{stats.userName}</span>
            </p>
          </div>
        </div>

        {/* Soul Evolution Badge Hero */}
        <div 
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(168, 85, 247, 0.08) 100%)',
            border: '1px solid rgba(192, 132, 252, 0.25)',
          }}
          className="mt-6 p-5 rounded-2xl relative overflow-hidden flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[10px] text-purple-300/80 font-mono tracking-wider uppercase flex items-center gap-1">
              <Award size={13} className="text-amber-400" />
              SOUL EVOLUTION LEVEL
            </span>
            <div className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-amber-300">✨</span>
              <span>{stats.soulEvolutionLevel}</span>
            </div>
            <p className="text-[11px] text-white/60">
              오늘 하루 7대 우주 프리즘을 온전히 관통하며 기록된 신성한 성취 등급
            </p>
          </div>

          <div 
            style={{
              padding: '10px 14px',
              borderRadius: '16px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              textAlign: 'center',
            }}
          >
            <span className="block text-[10px] font-mono text-amber-300 font-bold">ENERGY</span>
            <span className="text-2xl font-bold">{stats.topMoodEmoji}</span>
            <span className="block text-[10px] text-white/80 font-bold mt-0.5">{stats.topMood}</span>
          </div>
        </div>
      </div>

      {/* Center Metrics Grid (4 Hero Cards) */}
      <div className="relative z-10 my-6 grid grid-cols-2 gap-3.5">
        {/* Metric 1: Streak */}
        <div 
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
          className="p-4 rounded-2xl space-y-1"
        >
          <div className="flex items-center justify-between text-white/50 text-xs font-bold font-mono">
            <span className="flex items-center gap-1 text-amber-400">
              <Flame size={14} /> 연속 성찰 일수
            </span>
            <span className="text-[10px] text-white/30">STREAK</span>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tracking-tight pt-1">
            {stats.streakDays}
            <span className="text-sm font-normal text-white/50 ml-1">일 연속</span>
          </div>
          <p className="text-[10px] text-white/40">매일 밤 스스로를 되돌아본 꾸준한 여정</p>
        </div>

        {/* Metric 2: Total Diaries */}
        <div 
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
          className="p-4 rounded-2xl space-y-1"
        >
          <div className="flex items-center justify-between text-white/50 text-xs font-bold font-mono">
            <span className="flex items-center gap-1 text-purple-400">
              <BookOpen size={14} /> 누적 성찰 기록
            </span>
            <span className="text-[10px] text-white/30">DIARIES</span>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tracking-tight pt-1">
            {stats.totalDiaries}
            <span className="text-sm font-normal text-white/50 ml-1">편 완수</span>
          </div>
          <p className="text-[10px] text-white/40">차곡차곡 쌓인 내면의 소중한 아카이브</p>
        </div>

        {/* Metric 3: Total Gratitudes */}
        <div 
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
          className="p-4 rounded-2xl space-y-1"
        >
          <div className="flex items-center justify-between text-white/50 text-xs font-bold font-mono">
            <span className="flex items-center gap-1 text-pink-400">
              <Heart size={14} /> 감사한 일 (Gratitudes)
            </span>
            <span className="text-[10px] text-white/30">THANKS</span>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tracking-tight pt-1">
            {stats.totalGratitudes}
            <span className="text-sm font-normal text-white/50 ml-1">가지 발견</span>
          </div>
          <p className="text-[10px] text-white/40">일상 속에서 밝혀낸 작은 행복의 씨앗들</p>
        </div>

        {/* Metric 4: Universe Synchronization */}
        <div 
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
          className="p-4 rounded-2xl space-y-1"
        >
          <div className="flex items-center justify-between text-white/50 text-xs font-bold font-mono">
            <span className="flex items-center gap-1 text-cyan-400">
              <Compass size={14} /> 7대 우주 동조율
            </span>
            <span className="text-[10px] text-white/30">COSMIC</span>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tracking-tight pt-1">
            {Math.round((stats.activeUniversesCount / 5) * 100)}
            <span className="text-sm font-normal text-white/50 ml-1">% 동기화</span>
          </div>
          <p className="text-[10px] text-white/40">오늘 활성화된 우주 공간 {stats.activeUniversesCount}/5 영역</p>
        </div>
      </div>

      {/* Reflection Quote Snippet */}
      <div 
        style={{
          background: 'rgba(168, 85, 247, 0.05)',
          borderLeft: '3px solid #c084fc',
          padding: '14px 18px',
          borderRadius: '16px',
        }}
        className="relative z-10 my-2"
      >
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-300 uppercase tracking-widest font-mono mb-1">
          <Sparkles size={11} className="text-amber-400" />
          TODAY'S SOUL REFLECTION &amp; WHISPER
        </div>
        <p className="text-xs text-white/90 leading-relaxed font-medium break-keep break-words">
          "{stats.todayQuote}"
        </p>
      </div>

      {/* Card Footer: Seal of Authenticity */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-400" />
          <div>
            <p className="text-[10px] font-mono text-white/70 font-bold leading-none">
              VERIFIED BY PRISM OMNI SANCTUARY
            </p>
            <p className="text-[8px] font-mono text-white/40 mt-0.5">
              HASH: SOUL-{stats.todayDateKey.replace(/-/g, '')}-{stats.streakDays}D-{stats.totalDiaries}Q
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-purple-300">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          <span>LUCKEY UNIVERSE</span>
        </div>
      </div>
    </div>
  );
}

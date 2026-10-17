import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { SpecialChannel } from '@/pages/LucyStandalonePage';

export type LucyChatMode = 'auto' | 'casual' | 'master' | SpecialChannel;

export interface ModeConfig {
  id: LucyChatMode;
  icon: string;
  label: string;
  subLabel: string;
  tagline: string;
  activeColor: string;
  badgeBg: string;
  borderActive: string;
}

export const LUCY_MODE_CONFIGS: ModeConfig[] = [
  {
    id: 'auto',
    icon: '⚡',
    label: 'AI 자동',
    subLabel: '스마트 감지',
    tagline: '질문 내용에 맞춰 최적 모드로 자동 전환',
    activeColor: 'from-violet-600 to-indigo-600 text-white shadow-violet-200/50',
    badgeBg: 'bg-violet-100 text-violet-800 border-violet-200',
    borderActive: 'border-violet-400'
  },
  {
    id: 'casual',
    icon: '💬',
    label: '수다',
    subLabel: '일상 대화',
    tagline: '다정하고 편안한 일상 티키타카 & 친구 같은 공감',
    activeColor: 'from-amber-500 to-orange-500 text-white shadow-amber-200/50',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-200',
    borderActive: 'border-amber-400'
  },
  {
    id: 'trinity',
    icon: '🔮',
    label: '사주·타로',
    subLabel: '운명·운세',
    tagline: '사주명리, 타로, 신년운/월운, 별자리 점성술, 천을귀인',
    activeColor: 'from-purple-600 to-fuchsia-600 text-white shadow-purple-200/50',
    badgeBg: 'bg-purple-100 text-purple-900 border-purple-200',
    borderActive: 'border-purple-400'
  },
  {
    id: 'orange',
    icon: '🍊',
    label: '전략·성찰',
    subLabel: '커리어·선택',
    tagline: '제1원칙 근본 분석, 커리어 이직, 비즈니스 로드맵, 의사결정',
    activeColor: 'from-orange-500 to-amber-600 text-white shadow-orange-200/50',
    badgeBg: 'bg-orange-100 text-orange-950 border-orange-200',
    borderActive: 'border-orange-400'
  },
  {
    id: 'aura',
    icon: '🌿',
    label: '치유·수면',
    subLabel: '웰니스·호흡',
    tagline: '1분 호흡, 수면 케어, 신체 에너지 및 스트레스 조율',
    activeColor: 'from-teal-600 to-emerald-600 text-white shadow-teal-200/50',
    badgeBg: 'bg-teal-100 text-teal-950 border-teal-200',
    borderActive: 'border-teal-400'
  },
  {
    id: 'bluebird',
    icon: '🕊️',
    label: '위로·정화',
    subLabel: '마음·눈물',
    tagline: '감정 정화, 호오포노포노, 따뜻한 위안과 내면아이 돌봄',
    activeColor: 'from-blue-600 to-sky-600 text-white shadow-blue-200/50',
    badgeBg: 'bg-blue-100 text-blue-950 border-blue-200',
    borderActive: 'border-blue-400'
  },
  {
    id: 'muse',
    icon: '🎨',
    label: '영감·창작',
    subLabel: '아이디어·글',
    tagline: '예술적 영감, 카피라이팅, 시와 문장, 창의적 발상',
    activeColor: 'from-rose-500 to-pink-600 text-white shadow-rose-200/50',
    badgeBg: 'bg-rose-100 text-rose-950 border-rose-200',
    borderActive: 'border-rose-400'
  },
  {
    id: 'prologue',
    icon: '🌅',
    label: '시작·비전',
    subLabel: '도전·신년',
    tagline: '새로운 도전, 신년/새출발 비전 수립, 운명의 서막',
    activeColor: 'from-emerald-600 to-teal-700 text-white shadow-emerald-200/50',
    badgeBg: 'bg-emerald-100 text-emerald-950 border-emerald-200',
    borderActive: 'border-emerald-400'
  },
  {
    id: 'epilogue',
    icon: '🌙',
    label: '하루마감',
    subLabel: '회고·일기',
    tagline: '하루 매듭, 밤의 서재 지혜 회고, 감사 저널 및 일기',
    activeColor: 'from-indigo-600 to-slate-800 text-white shadow-indigo-200/50',
    badgeBg: 'bg-indigo-100 text-indigo-950 border-indigo-200',
    borderActive: 'border-indigo-400'
  },
  {
    id: 'master',
    icon: '👑',
    label: '올인원',
    subLabel: '마스터 풀가동',
    tagline: '7대 우주 지능 총망라 통합 진단 및 전방위 통찰',
    activeColor: 'from-amber-600 via-yellow-600 to-orange-600 text-slate-950 font-black shadow-amber-300/50',
    badgeBg: 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 border-amber-500',
    borderActive: 'border-amber-500'
  }
];

interface LucyModeSelectorBarProps {
  selectedMode: LucyChatMode;
  onSelectMode: (mode: LucyChatMode) => void;
  autoDetectedTitle?: string | null;
}

export const LucyModeSelectorBar: React.FC<LucyModeSelectorBarProps> = ({
  selectedMode,
  onSelectMode,
  autoDetectedTitle,
}) => {
  return (
    <div className="w-full bg-slate-50/90 dark:bg-slate-900/60 backdrop-blur-xs border-b border-slate-200/80 dark:border-slate-800/80 py-1.5 px-2 sm:px-4 shrink-0 transition-all">
      <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
        {/* Mode Label Indicator */}
        <div className="flex items-center gap-1 shrink-0 pr-1 text-[11px] font-bold text-slate-400 select-none hidden xs:flex">
          <Sparkles size={12} className="text-amber-500" />
          <span>상담 모드</span>
        </div>

        {/* 10 Mode Pills */}
        {LUCY_MODE_CONFIGS.map((mode) => {
          const isSelected = selectedMode === mode.id;

          return (
            <motion.button
              key={mode.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectMode(mode.id)}
              className={`group shrink-0 relative flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border select-none ${
                isSelected
                  ? `bg-gradient-to-r ${mode.activeColor} ${mode.borderActive} shadow-xs scale-[1.02]`
                  : 'bg-white/90 dark:bg-slate-800/90 hover:bg-slate-100 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 shadow-2xs'
              }`}
              title={`${mode.label} 모드: ${mode.tagline}`}
              aria-label={`${mode.label} 모드 선택`}
            >
              <span className="text-xs sm:text-sm select-none">{mode.icon}</span>
              <span className={`text-[11px] sm:text-xs font-bold tracking-tight whitespace-nowrap ${isSelected ? 'text-inherit' : 'text-slate-700 dark:text-slate-200'}`}>
                {mode.label}
              </span>

              {/* Special live auto badge if auto mode is selected and detected title exists */}
              {mode.id === 'auto' && isSelected && autoDetectedTitle && (
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/25 text-white font-medium border border-white/30 truncate max-w-[90px] sm:max-w-[130px]">
                  {autoDetectedTitle}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

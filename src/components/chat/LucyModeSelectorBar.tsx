import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, X, Check } from 'lucide-react';
import { SpecialChannel } from '@/pages/LucyStandalonePage';

export type LucyChatMode = 'auto' | SpecialChannel | 'casual' | 'master';

export interface Lucy8ModeConfig {
  id: 'auto' | SpecialChannel;
  channelKey?: SpecialChannel;
  icon: string;
  label: string;
  subLabel: string;
  tagline: string;
  activeGradient: string;
  activeBorder: string;
  badgeBg: string;
}

// 🌟 AI 모드 + 7대 채널(제목) 총 8대 모드 구성
export const LUCY_8_MODE_CONFIGS: Lucy8ModeConfig[] = [
  {
    id: 'auto',
    icon: '⚡',
    label: 'AI 모드',
    subLabel: '스마트 감지',
    tagline: '질문 맥락에 맞춰 최적의 전문 지능으로 자동 응답',
    activeGradient: 'from-violet-600 to-indigo-600 text-white shadow-violet-200/50',
    activeBorder: 'border-violet-400',
    badgeBg: 'bg-violet-100 text-violet-800 border-violet-200',
  },
  {
    id: 'prologue',
    channelKey: 'prologue',
    icon: '🌅',
    label: '프롤로그',
    subLabel: '서막·비전',
    tagline: '새로운 서막, 비전 설계 & 운명의 나침반',
    activeGradient: 'from-red-500 to-rose-600 text-white shadow-red-200/50',
    activeBorder: 'border-red-400',
    badgeBg: 'bg-red-100 text-red-950 border-red-200',
  },
  {
    id: 'orange',
    channelKey: 'orange',
    icon: '🍊',
    label: '오렌지',
    subLabel: '전략·성찰',
    tagline: '1원칙 사고 기반 전략적 심층 분석 & 다이어리 통찰',
    activeGradient: 'from-orange-500 to-amber-600 text-white shadow-orange-200/50',
    activeBorder: 'border-orange-400',
    badgeBg: 'bg-orange-100 text-orange-950 border-orange-200',
  },
  {
    id: 'trinity',
    channelKey: 'trinity',
    icon: '🔮',
    label: '트리니티',
    subLabel: '사주·타로',
    tagline: '천문 사주원국 & 타로 주파수 영적 통찰',
    activeGradient: 'from-purple-600 to-fuchsia-600 text-white shadow-purple-200/50',
    activeBorder: 'border-purple-400',
    badgeBg: 'bg-purple-100 text-purple-900 border-purple-200',
  },
  {
    id: 'aura',
    channelKey: 'aura',
    icon: '🌿',
    label: '아우라',
    subLabel: '치유·수면',
    tagline: '1분 호흡, 수면 케어, 신체 에너지 및 스트레스 조율',
    activeGradient: 'from-teal-600 to-emerald-600 text-white shadow-teal-200/50',
    activeBorder: 'border-teal-400',
    badgeBg: 'bg-teal-100 text-teal-950 border-teal-200',
  },
  {
    id: 'bluebird',
    channelKey: 'bluebird',
    icon: '🕊️',
    label: '블루버드',
    subLabel: '위로·정화',
    tagline: '감정 정화, 호오포노포노, 따뜻한 위안과 내면아이 돌봄',
    activeGradient: 'from-blue-600 to-sky-600 text-white shadow-blue-200/50',
    activeBorder: 'border-blue-400',
    badgeBg: 'bg-blue-100 text-blue-950 border-blue-200',
  },
  {
    id: 'muse',
    channelKey: 'muse',
    icon: '🎨',
    label: '뮤즈',
    subLabel: '영감·창작',
    tagline: '예술적 영감, 카피라이팅, 시와 문장, 창의적 발상',
    activeGradient: 'from-pink-500 to-rose-500 text-white shadow-pink-200/50',
    activeBorder: 'border-pink-400',
    badgeBg: 'bg-rose-100 text-rose-950 border-rose-200',
  },
  {
    id: 'epilogue',
    channelKey: 'epilogue',
    icon: '🌙',
    label: '에필로그',
    subLabel: '감사·회고',
    tagline: '하루 매듭, 밤의 서재 지혜 회고, 감사 저널 및 일기',
    activeGradient: 'from-indigo-600 to-slate-800 text-white shadow-indigo-200/50',
    activeBorder: 'border-indigo-400',
    badgeBg: 'bg-indigo-100 text-indigo-950 border-indigo-200',
  },
];

export const LUCY_MODE_CONFIGS = LUCY_8_MODE_CONFIGS;

export interface LucyModeSelectorBarProps {
  isAiMode: boolean;
  activeChannels: SpecialChannel[];
  onSelectAiMode: () => void;
  onToggleChannel: (channelId: SpecialChannel) => void;
  onSelectOnlyChannel?: (channelId: SpecialChannel) => void;
  autoDetectedTitle?: string | null;
}

export const LucyModeSelectorBar: React.FC<LucyModeSelectorBarProps> = ({
  isAiMode,
  activeChannels,
  onSelectAiMode,
  onToggleChannel,
  onSelectOnlyChannel,
  autoDetectedTitle,
}) => {
  const isSynergy = activeChannels.length >= 2;

  return (
    <div className="w-full bg-slate-50/90 dark:bg-slate-900/60 backdrop-blur-xs border-b border-slate-200/80 dark:border-slate-800/80 py-1.5 px-2 sm:px-4 shrink-0 transition-all">
      <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
        {/* Mode Label Indicator */}
        <div className="flex items-center gap-1 shrink-0 pr-1 text-[11px] font-bold text-slate-400 select-none hidden xs:flex">
          <Sparkles size={12} className="text-amber-500" />
          <span>모드</span>
        </div>

        {/* 1. AI 모드 (첫 번째 슬롯) */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={onSelectAiMode}
          className={`group shrink-0 relative flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border select-none ${
            isAiMode
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-violet-400 shadow-xs scale-[1.02]'
              : 'bg-white/90 dark:bg-slate-800/90 hover:bg-slate-100 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 shadow-2xs'
          }`}
          title="AI 모드: 질문 맥락을 스마트하게 감지하여 최적의 지능으로 응답"
          aria-label="AI 스마트 감지 모드 선택"
        >
          <span className="text-xs sm:text-sm select-none">⚡</span>
          <span className={`text-[11px] sm:text-xs font-bold tracking-tight whitespace-nowrap ${isAiMode ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>
            AI 모드
          </span>
          {isAiMode && autoDetectedTitle && (
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/25 text-white font-medium border border-white/30 truncate max-w-[85px] sm:max-w-[120px]">
              {autoDetectedTitle}
            </span>
          )}
        </motion.button>

        {/* 2. 7대 채널 모드 (제목) 버튼들 */}
        {LUCY_8_MODE_CONFIGS.filter((m) => m.id !== 'auto').map((mode) => {
          const chKey = mode.channelKey as SpecialChannel;
          const isSelected = activeChannels.includes(chKey);

          return (
            <motion.button
              key={mode.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => onToggleChannel(chKey)}
              onDoubleClick={() => onSelectOnlyChannel && onSelectOnlyChannel(chKey)}
              className={`group shrink-0 relative flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border select-none ${
                isSelected
                  ? `bg-gradient-to-r ${mode.activeGradient} ${mode.activeBorder} shadow-xs scale-[1.02]`
                  : 'bg-white/90 dark:bg-slate-800/90 hover:bg-slate-100 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 shadow-2xs'
              }`}
              title={`${mode.label} 모드 (클릭: 융합 토글 / 더블클릭: 단독 선택): ${mode.tagline}`}
              aria-label={`${mode.label} 모드 토글`}
            >
              <span className="text-xs sm:text-sm select-none">{mode.icon}</span>
              <span className={`text-[11px] sm:text-xs font-bold tracking-tight whitespace-nowrap ${isSelected ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                {mode.label}
              </span>
              {isSelected && (
                <Check size={11} className="text-white shrink-0 ml-0.5" strokeWidth={3} />
              )}
            </motion.button>
          );
        })}

        {/* 3. 융합 활성화 안내 배지 & 원클릭 리셋 */}
        {isSynergy && (
          <div className="flex items-center gap-1 shrink-0 ml-auto pl-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xs border border-indigo-300 flex items-center gap-1">
              <span>⚡</span>
              <span>{activeChannels.length}중 융합 가동 중</span>
            </span>
            <button
              type="button"
              onClick={onSelectAiMode}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors cursor-pointer"
              title="융합 해제 및 AI 모드로 복귀"
              aria-label="융합 해제"
            >
              <X size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Zap,
  Disc3,
  Layers,
  HelpCircle,
  X,
  Compass,
  AlertCircle
} from 'lucide-react';
import { TarotCard } from '@/data/tarotData';
import { playAudioHaptic } from '@/lib/audioHaptics';

export interface FollowUpTarotInputBarProps {
  remainingCount: number;
  totalCount?: number;
  drawnCount: number;
  initialConcern?: string;
  drawnCards?: TarotCard[];
  isGenerating?: boolean;
  onDirectDraw: (question: string) => void;
  onAutoDraw: (question: string) => void;
  className?: string;
  customChips?: string[];
  placeholder?: string;
  title?: string;
  subtitle?: string;
}

export const FollowUpTarotInputBar: React.FC<FollowUpTarotInputBarProps> = ({
  remainingCount,
  totalCount = 78,
  drawnCount,
  initialConcern = '',
  drawnCards = [],
  isGenerating = false,
  onDirectDraw,
  onAutoDraw,
  className = '',
  customChips,
  placeholder,
  title,
  subtitle,
}) => {
  const [question, setQuestion] = useState('');

  // 💡 Generate context-aware smart recommendation chips
  const recommendedQuestions = useMemo(() => {
    if (customChips && customChips.length > 0) {
      return customChips;
    }
    const concernLower = initialConcern.toLowerCase();
    const isLove = /연애|사랑|남친|여친|이별|재회|썸|마음|그사람|속마음|짝사랑|인연/.test(concernLower);
    const isCareerOrMoney = /이직|취업|사업|금전|돈|시험|합격|승진|직장|투자|계약|회사/.test(concernLower);

    if (isLove) {
      return [
        '상대방의 무의식 속 진짜 속마음과 감정은?',
        '이 관계에서 제가 먼저 취해야 할 현명한 태도는?',
        '앞으로 두 사람 사이에 찾아올 결정적 전환점은?',
        '가장 조심해야 할 오해나 숨겨진 걸림돌은 무엇인가요?',
      ];
    } else if (isCareerOrMoney) {
      return [
        '이 상황에서 가장 주의해야 할 숨겨진 리스크는?',
        '성공 가능성을 극대화하기 위해 지금 실행할 행동은?',
        '주변 인물이나 상사와의 관계에서 핵심 열쇠는?',
        '앞으로 3개월 내 다가올 기회의 형태는 무엇인가요?',
      ];
    } else {
      return [
        '지금 내 무의식이 내게 보내는 가장 시급한 경고는?',
        '이 흐름에서 제가 취해야 할 가장 지혜로운 선택은?',
        '예상치 못한 반전이나 숨겨진 조력자가 있을까요?',
        '에너지의 정체를 뚫고 운을 열어줄 구체적 실천은?',
      ];
    }
  }, [initialConcern, customChips]);

  const handleChipClick = (chipText: string) => {
    playAudioHaptic('tap_light');
    setQuestion(chipText);
  };

  const handleDirectClick = () => {
    const q = question.trim() || '이 흐름에 대한 추가 통찰과 조언';
    playAudioHaptic('tap_light');
    setQuestion('');
    onDirectDraw(q);
  };

  const handleAutoClick = () => {
    const q = question.trim() || '이 흐름에 대한 추가 통찰과 조언';
    playAudioHaptic('card_draw');
    setQuestion('');
    onAutoDraw(q);
  };

  // 🌟 카드가 추가로 뽑혀 잔여 덱 및 카운트가 갱신될 때마다 고민 입력창을 완벽 초기화
  useEffect(() => {
    setQuestion('');
  }, [drawnCount]);

  const isExhausted = remainingCount <= 0;

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-900/95 via-slate-950 to-black border border-amber-500/30 shadow-2xl space-y-4 ${className}`}>
      {/* Header & Remaining Deck Status */}
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <Sparkles size={15} className="animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>{title || '추가 질문 & 연속 리딩'}</span>
              <span className="text-[10px] text-amber-400 font-normal">심층 확장</span>
            </h4>
            <p className="text-[11px] text-white/60 font-sans">
              {subtitle || '원하는 질문을 적고 남은 덱에서 카드를 뽑아 리딩을 이어가세요.'}
            </p>
          </div>
        </div>

        {/* Remaining Deck Badge */}
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 px-3 py-1 rounded-full text-xs font-mono font-bold text-amber-300 shadow-sm">
          <Layers size={13} className="text-amber-400" />
          <span>잔여 덱: {remainingCount}장 / {totalCount}장</span>
          <span className="text-[10px] text-white/40 font-sans font-normal border-l border-amber-500/30 pl-2 hidden sm:inline">
            이미 뽑힌 {drawnCount}장 제외됨
          </span>
        </div>
      </div>

      {/* Intelligent AI Recommendation Question Chips */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1 text-[11px] text-amber-300/80 font-bold font-sans">
          <Compass size={12} className="text-amber-400" />
          <span>추천 심층 질문 칩 (터치하여 자동 입력)</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {recommendedQuestions.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(chip)}
              disabled={isGenerating || isExhausted}
              className={`text-[11px] sm:text-xs px-2.5 py-1 rounded-lg border transition-all text-left cursor-pointer active:scale-95 ${
                question === chip
                  ? 'bg-amber-400/25 text-amber-200 border-amber-400/60 shadow-[0_0_10px_rgba(251,191,36,0.25)] font-medium'
                  : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10 hover:border-amber-400/30'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <span>{chip}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Question Text Input Area */}
      <div className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isGenerating && !isExhausted) {
                e.preventDefault();
                handleAutoClick();
              }
            }}
            disabled={isGenerating || isExhausted}
            placeholder={
              isExhausted
                ? '모든 타로 카드가 소진되었습니다.'
                : (placeholder || '궁금한 점을 직접 질문하세요 (예: 그 선택의 결과는?, 주의할 점은?)')
            }
            className="w-full bg-black/60 border border-white/15 focus:border-amber-400/70 rounded-xl px-3.5 py-2.5 pr-16 text-xs sm:text-sm text-white placeholder-white/35 outline-none transition-all focus:ring-1 focus:ring-amber-400/40 disabled:opacity-40"
          />
          {question && !isGenerating && (
            <button
              type="button"
              onClick={() => setQuestion('')}
              className="absolute right-3 text-white/40 hover:text-white/80 transition-colors p-1 cursor-pointer"
              title="질문 지우기"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex justify-between items-center text-[10px] text-white/40 pt-1 px-1">
          <span>{question.length}/100자</span>
          <span>미입력 시 '이 흐름에 대한 추가 통찰'로 자동 지정됩니다</span>
        </div>
      </div>

      {/* Dual Drawing Action Buttons: Direct Wheel Pick vs One-Touch Auto Draw */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        {/* Direct Wheel Pick Button */}
        <button
          type="button"
          onClick={handleDirectClick}
          disabled={isGenerating || isExhausted}
          className="group relative px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-400/40 hover:border-amber-400 text-amber-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(251,191,36,0.15)] hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          title="남은 카드들로 구성된 360도 원형 휠을 직접 돌려 1장을 선택합니다"
        >
          <Disc3 size={16} className="text-amber-400 group-hover:rotate-180 transition-transform duration-500 shrink-0" />
          <div className="flex flex-col text-left sm:text-center">
            <span>🎡 직접 카드 고르기</span>
            <span className="text-[10px] text-amber-300/70 font-normal">360° 원형 휠 수동 회전</span>
          </div>
        </button>

        {/* One-Touch Auto Draw Button */}
        <button
          type="button"
          onClick={handleAutoClick}
          disabled={isGenerating || isExhausted}
          className="group relative px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          title="남은 덱에서 1장을 즉시 무작위 추첨하여 리딩을 시작합니다"
        >
          <Zap size={16} className="text-black shrink-0 animate-pulse" />
          <div className="flex flex-col text-left sm:text-center">
            <span>⚡ 원터치 자동 뽑기</span>
            <span className="text-[10px] text-black/75 font-semibold">잔여 덱 1장 즉시 추첨</span>
          </div>
        </button>
      </div>

      {isExhausted && (
        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs">
          <AlertCircle size={14} className="shrink-0" />
          <span>78장의 모든 카드가 소진되었습니다. 새로운 리딩을 시작하시려면 상단의 [새로운 리딩]을 눌러주세요.</span>
        </div>
      )}
    </div>
  );
};

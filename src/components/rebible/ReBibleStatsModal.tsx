import React from 'react';
import { 
  X, 
  BarChart3, 
  Sparkles, 
  TrendingUp, 
  Heart, 
  Tag, 
  BookMarked, 
  History, 
  Award,
  Flame
} from 'lucide-react';
import { ReBibleStats, SacredAtmosphere } from '../../types/rebible';

interface ReBibleStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: ReBibleStats;
  atmosphere: SacredAtmosphere;
}

export const ReBibleStatsModal: React.FC<ReBibleStatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  atmosphere
}) => {
  if (!isOpen) return null;

  const isParchment = atmosphere === 'parchment';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className={`w-full max-w-xl flex flex-col rounded-3xl border shadow-2xl overflow-hidden ${
        isParchment 
          ? 'bg-[#FAF6EE] border-amber-900/20 text-stone-900' 
          : 'bg-slate-950 border-amber-500/30 text-slate-100'
      }`}>
        {/* Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${
          isParchment ? 'border-amber-900/10 bg-amber-100/50' : 'border-slate-800 bg-slate-900/70'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <BarChart3 size={16} />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-black tracking-tight">
                서사 진화 지수 (Narrative Evolution)
              </h2>
              <p className={`text-[11px] ${isParchment ? 'text-stone-500' : 'text-slate-400'}`}>
                고통이 지혜로 치환되고 서사가 확장된 나의 영적 연대기
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition ${
              isParchment ? 'hover:bg-amber-200/60 text-stone-600' : 'hover:bg-white/10 text-slate-400'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[80vh]">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className={`p-3.5 rounded-2xl border text-center ${
              isParchment ? 'bg-amber-100/50 border-amber-900/15' : 'bg-slate-900/80 border-slate-800'
            }`}>
              <div className="text-[10px] uppercase font-bold text-stone-500 mb-1">봉헌된 구절</div>
              <div className="text-xl sm:text-2xl font-black font-serif text-amber-500">
                {stats.totalVerses}
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border text-center ${
              isParchment ? 'bg-amber-100/50 border-amber-900/15' : 'bg-slate-900/80 border-slate-800'
            }`}>
              <div className="text-[10px] uppercase font-bold text-stone-500 mb-1">시간의 주석</div>
              <div className="text-xl sm:text-2xl font-black font-serif text-amber-500">
                {stats.totalAnnotations}
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border text-center ${
              isParchment ? 'bg-amber-100/50 border-amber-900/15' : 'bg-slate-900/80 border-slate-800'
            }`}>
              <div className="text-[10px] uppercase font-bold text-stone-500 mb-1">황금 구절</div>
              <div className="text-xl sm:text-2xl font-black font-serif text-amber-500">
                {stats.favoriteCount}
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border text-center ${
              isParchment ? 'bg-amber-100/50 border-amber-900/15' : 'bg-slate-900/80 border-slate-800'
            }`}>
              <div className="text-[10px] uppercase font-bold text-stone-500 mb-1">지혜 승화율</div>
              <div className="text-xl sm:text-2xl font-black font-serif text-amber-500">
                100%
              </div>
            </div>
          </div>

          {/* Core Insights: Emotions Transmutation */}
          <div className={`p-4 rounded-2xl border ${
            isParchment ? 'bg-amber-100/30 border-amber-900/10' : 'bg-slate-900/50 border-slate-800'
          }`}>
            <h3 className="text-xs font-bold mb-2.5 flex items-center gap-1.5 text-amber-500">
              <Heart size={13} />
              <span>가장 많이 마주하고 승화시킨 감정들</span>
            </h3>
            {stats.topEmotions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {stats.topEmotions.map((item, idx) => (
                  <div
                    key={item.emotion}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 ${
                      isParchment
                        ? 'bg-white border-amber-900/20 text-stone-800'
                        : 'bg-slate-950 border-slate-800 text-slate-200'
                    }`}
                  >
                    <span className="font-bold text-amber-500">#{item.emotion}</span>
                    <span className="text-[10px] opacity-70">({item.count}회 승화)</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs opacity-60">감정 기록이 아직 없습니다.</div>
            )}
          </div>

          {/* Core Themes / Tags */}
          <div className={`p-4 rounded-2xl border ${
            isParchment ? 'bg-amber-100/30 border-amber-900/10' : 'bg-slate-900/50 border-slate-800'
          }`}>
            <h3 className="text-xs font-bold mb-2.5 flex items-center gap-1.5 text-amber-500">
              <Tag size={13} />
              <span>나의 지혜가 가장 깊게 깃든 라이프 영역</span>
            </h3>
            {stats.topTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {stats.topTags.map((item) => (
                  <div
                    key={item.tag}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 ${
                      isParchment
                        ? 'bg-white border-amber-900/20 text-stone-800'
                        : 'bg-slate-950 border-slate-800 text-slate-200'
                    }`}
                  >
                    <span className="font-semibold text-amber-500">🏷️ {item.tag}</span>
                    <span className="text-[10px] opacity-70">({item.count}편)</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs opacity-60">테마 태그 기록이 아직 없습니다.</div>
            )}
          </div>

          {/* Philosophy Banner */}
          <div className={`p-4 rounded-2xl border text-xs text-center leading-relaxed ${
            isParchment
              ? 'bg-amber-200/50 border-amber-800/20 text-stone-900'
              : 'bg-slate-900 border-amber-500/20 text-slate-200'
          }`}>
            <p className="font-serif italic text-amber-500 font-bold mb-1">
              "우리는 과거를 바꿀 수 없지만, 과거에 부여하는 의미(Meaning)는 영원히 다시 쓸 수 있습니다."
            </p>
            <p className="opacity-80 text-[11px]">
              오늘도 당신의 하루는 고통의 기억이 아닌 거룩한 지혜의 경전으로 기록되고 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

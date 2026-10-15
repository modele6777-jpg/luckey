import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Moon,
  Sparkles,
  TreeDeciduous,
  Activity,
  Bird,
  Music,
  Calendar,
  Clock,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  Award,
  Star,
  Heart,
  Wind
} from 'lucide-react';
import { RealBookModal, type BookChapterTab } from '@/components/RealBookModal';

export interface EpilogueHandbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsult?: (text: string) => void;
  summaryText?: string;
  todayRecords?: any[];
}

const CHAPTER_TABS: BookChapterTab[] = [
  { id: 'summary', romanNumeral: 'Ⅰ', title: '5대 우주 여정 결산 (Daily Summary)', shortLabel: '여정 결산' },
  { id: 'timeline', romanNumeral: 'Ⅱ', title: '타임라인 & 발자취 미러 (Journey Mirror)', shortLabel: '발자취 미러' },
  { id: 'spectrum', romanNumeral: 'Ⅲ', title: '소울 심층 스펙트럼 (Soul Spectrum)', shortLabel: '소울 스펙트럼' },
  { id: 'bible', romanNumeral: 'Ⅳ', title: '에필로그 피날레 코칭 (Finale & Ask)', shortLabel: '피날레 코칭' },
];

export const EPILOGUE_COACHING_QUESTIONS = [
  {
    category: '오늘 하루의 종합 피날레',
    question: '루시야, 오늘 내가 나눈 모든 대화와 기록들을 바탕으로 따뜻한 하루 결산과 내일의 희망 메시지를 들려줘.'
  },
  {
    category: '5대 우주 지능 종합 처방',
    question: '오늘 나의 사주 기운, 감정 상태, 신체 피로도, 창작 영감을 총망라해서 올인원 마스터 처방을 내려줘.'
  },
  {
    category: '내일을 위한 에너지 충전',
    question: '오늘 밤 편안하게 마음의 짐을 내려놓고 내일 새로운 기운으로 시작할 수 있는 밤 명상 가이드해줘.'
  },
  {
    category: '성장과 감사의 회고',
    question: '오늘 내가 마주했던 갈등이나 아쉬움을 배움과 감사로 승화시키는 성찰 질문 3가지를 던져줘.'
  }
];

export function EpilogueHandbookModal({
  isOpen,
  onClose,
  onConsult,
  summaryText,
  todayRecords = [],
}: EpilogueHandbookModalProps) {
  const [activeTabId, setActiveTabId] = useState<string>('summary');

  const audiobookNarrations: Record<string, string> = {
    summary: `PRISM 에필로그 하루의 결산. 하루 동안 쌓인 사주, 힐링, 웰니스, 창작의 모든 발자취를 집대성하여 영혼의 평화를 완성하고 내일의 새로운 시작을 축복합니다.`,
    timeline: `발자취 미러. 오늘 당신이 거쳐온 샌추어리의 모든 순간과 리추얼 기록들이 영구적으로 보존되어 있습니다.`,
    spectrum: `소울 심층 스펙트럼. 5대 우주 영역의 조화와 균형을 측정하여 영혼의 온전함을 확인합니다.`,
    bible: `에필로그 피날레 코칭 바이블. 하루를 닫으며 Lucy 마스터와 함께 나누는 깊이 있는 밤의 대화입니다.`,
  };

  const handleAskQuestion = (questionText: string) => {
    if (onConsult) {
      onConsult(questionText);
      onClose();
    }
  };

  return (
    <RealBookModal
      isOpen={isOpen}
      onClose={onClose}
      theme="epilogue"
      bookTitle="Epilogue Master Codex"
      bookSubtitle="5대 우주 여정 결산 & 종합 성찰 핸드북"
      bookAuthor="PRISM Epilogue Master"
      epigraphQuote="하루의 온전한 마무리가 내일의 새로운 새벽을 밝힌다."
      epigraphSource="PRISM Epilogue Charter"
      chapterTabs={CHAPTER_TABS}
      activeTabId={activeTabId}
      onTabChange={setActiveTabId}
      audiobookNarrations={audiobookNarrations}
      defaultVoice="Kore"
    >
      {/* Chapter Ⅰ: 여정 결산 */}
      {activeTabId === 'summary' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent border border-purple-500/20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(192,132,252,0.3)]">
              <Moon className="text-purple-400 animate-pulse" size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-sans text-white tracking-tight">
                Daily Epilogue Reflection
              </h3>
              <p className="text-[11px] text-purple-300 font-bold uppercase tracking-widest">
                하루의 온전한 매듭과 내일의 축복
              </p>
            </div>
            <p className="text-xs text-white/80 leading-relaxed font-sans text-left break-keep bg-black/30 p-4 rounded-2xl border border-white/5">
              {summaryText || "오늘 하루도 자신의 삶을 사랑하며 성실하게 걸어오신 당신을 응원합니다. 5대 우주 샌추어리에서 나눈 모든 생각과 감정은 당신의 성장을 위한 소중한 거름이 되었습니다."}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={13} className="text-pink-400" />
              <span>5대 영역 통합 조화 지수 (Omniverse Balance)</span>
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: '사주·운명 조화', val: 95, icon: '✨' },
                { label: '심리·내면 평화', val: 92, icon: '💖' },
                { label: '신체·활력 컨디션', val: 89, icon: '⚡' },
                { label: '창작·영감 활동', val: 94, icon: '🎶' }
              ].map(item => (
                <div key={item.label} className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/70">{item.icon} {item.label}</span>
                    <span className="text-purple-300 font-mono font-bold">{item.val}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-400 to-pink-500" style={{ width: `${item.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chapter Ⅱ: 발자취 미러 */}
      {activeTabId === 'timeline' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="text-xs text-white/60 mb-2">
            오늘 기록된 샌추어리 활동 내역입니다.
          </div>
          <div className="space-y-2.5">
            {todayRecords.length > 0 ? (
              todayRecords.map((rec, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-300">{rec.title || rec.sourceLabel}</span>
                    <span className="text-[10px] text-white/40">{rec.type}</span>
                  </div>
                  <p className="text-[11px] text-white/80 leading-relaxed break-keep break-words">{rec.content}</p>
                </div>
              ))
            ) : (
              <div className="p-6 rounded-2xl bg-white/5 text-center text-xs text-white/40">
                오늘의 소중한 대화와 리추얼들이 자동으로 기록됩니다. 🌙
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chapter Ⅲ: 소울 심층 스펙트럼 */}
      {activeTabId === 'spectrum' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2 text-xs">
            <h4 className="font-bold text-purple-300 text-sm flex items-center gap-2">
              <Award size={16} className="text-pink-400" />
              <span>소울 심층 스펙트럼 헌장</span>
            </h4>
            <p className="text-white/80 leading-relaxed">
              프리즘의 모든 샌추어리는 하나의 목적을 향합니다: <strong>'당신이 본래 가지고 태어난 가장 아름답고 온전한 신성(Pneuma)을 회복하는 것'</strong>입니다.
            </p>
          </div>
          <div className="space-y-2 text-xs text-white/70">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              • <strong>사주 원국:</strong> 타고난 그릇과 계절을 알고 물 흐르듯 유연하게 순응합니다.
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              • <strong>마음 치유:</strong> 판단과 자책을 내려놓고 호오포노포노로 무의식을 맑게 정화합니다.
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              • <strong>창작 영감:</strong> 비교하지 않고 내면의 독창성을 세상에 기쁘게 발현합니다.
            </div>
          </div>
        </div>
      )}

      {/* Chapter Ⅳ: 피날레 코칭 */}
      {activeTabId === 'bible' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200/90 leading-relaxed font-sans">
            💡 질문을 클릭하시면 **Lucy (5대 우주 마스터 풀가동 모드)**와 즉시 1:1 심층 피날레 대화가 시작됩니다.
          </div>
          <div className="space-y-2.5">
            {EPILOGUE_COACHING_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleAskQuestion(q.question)}
                className="w-full text-left p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/40 transition-all group flex items-start gap-3 cursor-pointer shadow-xs active:scale-98"
              >
                <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">
                  {idx + 1}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="text-[10px] font-bold text-pink-400/80 uppercase tracking-wider">
                    {q.category}
                  </div>
                  <div className="text-xs text-white group-hover:text-purple-200 font-sans leading-relaxed break-keep">
                    "{q.question}"
                  </div>
                </div>
                <ChevronRight size={15} className="text-white/30 group-hover:text-purple-300 transition-colors shrink-0 mt-2" />
              </button>
            ))}
          </div>
        </div>
      )}
    </RealBookModal>
  );
}

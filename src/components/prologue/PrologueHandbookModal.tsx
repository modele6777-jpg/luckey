import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Sparkles,
  TreeDeciduous,
  Activity,
  Bird,
  Music,
  Moon,
  Sun,
  Zap,
  CheckCircle,
  HelpCircle,
  Lightbulb,
  ChevronRight,
  BookOpen,
  User,
  ShieldCheck,
  RefreshCw,
  MessageCircle,
} from 'lucide-react';
import { RealBookModal, type BookChapterTab } from '@/components/RealBookModal';

export interface PrologueHandbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsult?: (text: string) => void;
}

const CHAPTER_TABS: BookChapterTab[] = [
  { id: 'overview', romanNumeral: 'Ⅰ', title: 'PRISM 사용법 & 시작하기 (Usage & Guide)', shortLabel: '사용법 안내' },
  { id: 'sanctuaries', romanNumeral: 'Ⅱ', title: '7대 우주 공간별 안내 (7 Sanctuaries)', shortLabel: '7대 공간 안내' },
  { id: 'routes', romanNumeral: 'Ⅲ', title: '상황별 추천 루트 & 팁 (Recommended Routes)', shortLabel: '추천 루트' },
  { id: 'bible', romanNumeral: 'Ⅳ', title: 'Lucy 코칭 가이드 (AI Coaching & Ask)', shortLabel: '코칭 질문' },
];

export const GUIDE_STEPS = [
  {
    title: '1단계: 시작하기 & 프로필 설정',
    desc: 'Google 로그인 후 4자리 PIN으로 안전하게 접속합니다. EPILOGUE(프로필)에서 이름, 생년월일, 관심사를 입력하면 사주·타로·음악·대화가 당신에게 100% 맞춤화됩니다.'
  },
  {
    title: '2단계: 화면 구조 & 일곱 공간',
    desc: '☀️ PROLOGUE(통합 허브), 🌲 ORANGE(1원칙·시크릿 일기), ✨ TRINITY(사주·타로), ⚡ AURA(웰니스·호흡), 🐦 BLUEBIRD(호오포노포노 치유), 🎶 MUSE(창작 영감), 🌙 EPILOGUE(프로필·결산).'
  },
  {
    title: '3단계: Lucy 교감',
    desc: '각 화면 우측 하단 💬 버튼을 누르면 5대 영역 멀티버스 지능을 탑재한 Lucy와 실시간으로 깊이 있는 대화를 나눌 수 있습니다.'
  },
  {
    title: '4단계: 영구 보존 & 멀티 디바이스 동기화',
    desc: '작성하신 모든 프로필과 대화는 10중 Profile Vault 및 클라우드에 영구 보존되며 PC와 모바일 어디서나 실시간으로 동기화됩니다.'
  }
];

export const SANCTUARY_GUIDES = [
  {
    name: '☀️ PROLOGUE (프롤로그)',
    role: '통합 홈 허브 & 바이오리듬 조율',
    color: 'border-red-500/30 bg-red-500/10 text-red-300',
    details: '오늘의 기분과 생체 에너지를 분석하여 가장 알맞은 샌추어리를 추천하고, 전체 우주 여정의 중심을 잡아줍니다.'
  },
  {
    name: '🌲 ORANGE (오렌지)',
    role: '1원칙 딥리즈닝 & 론다 번 시크릿 소원 일기',
    color: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
    details: '끌어당김의 법칙 3단계(Ask·Believe·Receive)와 별에게 소원빌기, 감성 일지를 통해 현실을 주도적으로 창조합니다.'
  },
  {
    name: '✨ TRINITY (트리니티)',
    role: '천문 정밀 사주 & 운명 오라클 & 기적수업',
    color: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
    details: '정밀 만세력 사주원국, 타로 주파수 리딩, 기적수업(ACIM) 용서의 원리로 삶의 전환점과 개운법을 밝힙니다.'
  },
  {
    name: '⚡ AURA (아우라 / HEAL)',
    role: '신체 웰니스 & 세도나 방하착 & 4-7-8 이완',
    color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    details: '누적된 신체 피로를 풀고, 세도나 메서드 4문답과 데이비드 호킨스 놓아버림 기법으로 가슴의 저항을 녹여냅니다.'
  },
  {
    name: '🐦 BLUEBIRD (블루버드)',
    role: '소울 힐링 & 호오포노포노 4대 정화',
    color: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
    details: '하와이 전통 정화법과 18대 정화도구로 내면아이(우니히피리)의 상처를 따뜻하게 보듬고 제로 상태로 돌아갑니다.'
  },
  {
    name: '🎶 MUSE (뮤즈)',
    role: '창작 영감 & 줄리아 카메론 아티스트 웨이',
    color: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300',
    details: '모닝페이지, 시적 감성 카피라이팅, SCAMPER 발상법, 음악·미술 추천으로 창작의 벽을 허뭅니다.'
  },
  {
    name: '🌙 EPILOGUE (에필로그)',
    role: '소울 프로필 관리 & 하루의 종합 결산',
    color: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
    details: '기본 정보부터 운명·음악·심리·예술 취향을 총망라하여 관리하며, 하루의 모든 발자취를 집대성합니다.'
  }
];

export const RECOMMENDED_ROUTES = [
  {
    situation: '마음이 복잡하고 불안할 때',
    route: 'PROLOGUE ➔ BLUEBIRD (호오포노포노 정화) ➔ AURA (4-7-8 이완 호흡)',
    tip: '생각을 멈추고 "미안합니다, 용서하세요, 고맙습니다, 사랑합니다"를 속으로 3번 되뇌어 보세요.'
  },
  {
    situation: '중요한 결정이나 방향이 필요할 때',
    route: 'TRINITY (사주·타로 리딩) ➔ ORANGE (1원칙 전략 사유) ➔ 실천 계획 수립',
    tip: '타로의 직관적 메시지와 사주 대운의 흐름을 융합하여 장기적인 결정을 내리세요.'
  },
  {
    situation: '몸이 피로하고 에너지가 방전되었을 때',
    route: 'AURA (생체 동조 웰니스) ➔ 힐링 음악 감상 ➔ 에필로그 수면 명상',
    tip: '무리하게 일하려 하지 말고 어깨와 목의 힘을 빼고 5분간 호흡에 집중하세요.'
  },
  {
    situation: '창작 아이디어가 막혔을 때',
    route: 'MUSE (모닝페이지 & 브레인스토밍) ➔ ORANGE (비전보드 시각화)',
    tip: '검열관의 비판을 잠시 끄고 떠오르는 생각을 손이 가는 대로 자유롭게 쏟아내세요.'
  }
];

export const PROLOGUE_GUIDE_QUESTIONS = [
  {
    category: '초보자를 위한 맞춤 안내',
    question: '루시야, PRISM을 처음 쓰는데 오늘 내 상황에 맞게 10분 추천 코스를 안내해줘.'
  },
  {
    category: '7대 우주 지능 시너지 코칭',
    question: '내 사주와 현재 고민을 결합해서 오늘 꼭 실천해야 할 한 가지 핵심 행동을 알려줘.'
  },
  {
    category: '멘탈 & 감정 릴리즈',
    question: '답답하고 복잡한 마음을 3단계로 빠르게 정화하고 평온을 되찾는 법 알려줘.'
  },
  {
    category: '창작 & 영감 발현',
    question: '지금 막힌 프로젝트나 고민을 1원칙 사고와 아티스트 웨이 관점으로 풀어줘.'
  }
];

export function PrologueHandbookModal({
  isOpen,
  onClose,
  onConsult,
}: PrologueHandbookModalProps) {
  const [activeTabId, setActiveTabId] = useState<string>('overview');

  const audiobookNarrations: Record<string, string> = {
    overview: `PRISM 가이드북. PRISM은 대화, 상징, 사주 리딩, 웰니스, 호흡, 창작, 기록이 하나의 유기적인 흐름으로 이어지는 옴니버스 영혼 탐색 앱입니다. 7대 공간을 통해 일상의 평화와 성장을 완성하세요.`,
    sanctuaries: `7대 우주 공간별 완전 안내. 프롤로그의 관문부터 오렌지, 트리니티, 아우라, 블루버드, 뮤즈, 에필로그까지 당신의 삶을 입체적으로 가이드합니다.`,
    routes: `상황별 추천 루트. 마음이 복잡할 때, 결정이 필요할 때, 신체가 피로할 때, 창작이 필요할 때 최적의 여정을 안내합니다.`,
    bible: `Lucy 코칭 가이드. 루시 프로와 함께 질문을 던지며 당신만의 통찰을 경험하세요.`,
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
      theme="prologue"
      bookTitle="PRISM Guidebook"
      bookSubtitle="PRISM 7대 우주 공간 완전 가이드 & 사용법"
      bookAuthor="PRISM Master Guide"
      epigraphQuote="모든 위대한 여정은 내면을 향한 고요한 첫걸음에서 시작된다."
      epigraphSource="PRISM Universal Charter"
      chapterTabs={CHAPTER_TABS}
      activeTabId={activeTabId}
      onTabChange={setActiveTabId}
      audiobookNarrations={audiobookNarrations}
      defaultVoice="Kore"
    >
      {/* Chapter Ⅰ: PRISM 사용법 */}
      {activeTabId === 'overview' && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="p-5 rounded-3xl bg-gradient-to-br from-red-500/10 via-amber-500/5 to-transparent border border-red-500/20 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(239,68,68,0.3)]">
              <Compass className="text-red-400 animate-pulse" size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-sans text-white tracking-tight">
                PRISM 사용법 &amp; 안내
              </h3>
              <p className="text-[11px] text-amber-300 font-bold uppercase tracking-widest">
                대화 · 상징 · 리딩 · 웰니스 · 창작 · 기록의 통합 흐름
              </p>
            </div>
            <p className="text-xs text-white/80 leading-relaxed font-sans text-left break-keep bg-black/30 p-4 rounded-2xl border border-white/5">
              PRISM은 일상의 스트레스와 복잡한 상념을 덜어내고, 타고난 운명과 내면의 독창성을 꽃피울 수 있도록 돕는 전일적 AI 샌추어리입니다.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-red-300 uppercase tracking-wider flex items-center gap-1.5 font-sans">
              <Sparkles size={13} className="text-amber-400" />
              <span>단계별 사용 순서 (Step by Step)</span>
            </h4>
            <div className="space-y-2.5">
              {GUIDE_STEPS.map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                  <div className="text-xs font-bold text-amber-300 font-sans">{step.title}</div>
                  <p className="text-[11px] text-white/75 leading-relaxed font-sans break-keep">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chapter Ⅱ: 7대 우주 공간 안내 */}
      {activeTabId === 'sanctuaries' && (
        <div className="space-y-3.5 animate-in fade-in duration-300">
          <div className="text-xs text-white/60 mb-1">
            프리즘의 7개 공간은 각각 고유한 목적을 가지며 유기적으로 연결되어 있습니다.
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {SANCTUARY_GUIDES.map((s, idx) => (
              <div key={idx} className={`p-3.5 rounded-2xl border ${s.color} space-y-1.5 transition-all hover:scale-[1.01]`}>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold font-sans text-white">{s.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/90">
                    {s.role}
                  </span>
                </div>
                <p className="text-[11px] text-white/75 leading-relaxed font-sans break-keep">
                  {s.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chapter Ⅲ: 추천 루트 */}
      {activeTabId === 'routes' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="text-xs text-white/60 mb-1">
            오늘 당신이 처한 상황에 가장 알맞은 루트를 선택해 보세요.
          </div>
          <div className="space-y-3">
            {RECOMMENDED_ROUTES.map((r, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 font-sans">
                  <Lightbulb size={15} className="text-yellow-400" />
                  <span>{r.situation}</span>
                </div>
                <div className="text-xs text-white font-semibold flex items-center gap-1.5 bg-black/20 p-2.5 rounded-xl border border-white/5">
                  <CheckCircle size={13} className="text-emerald-400 shrink-0" />
                  <span className="leading-relaxed">{r.route}</span>
                </div>
                <p className="text-[11px] text-white/65 leading-relaxed font-sans break-keep pl-1">
                  💡 <strong>Tip:</strong> {r.tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chapter Ⅳ: 코칭 바이블 */}
      {activeTabId === 'bible' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-amber-200/90 leading-relaxed font-sans">
            💡 질문을 클릭하시면 **Lucy**와 즉시 1:1 대화로 연결되어 맞춤형 안내를 받으실 수 있습니다.
          </div>
          <div className="space-y-2.5">
            {PROLOGUE_GUIDE_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAskQuestion(q.question)}
                className="w-full text-left p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-400/40 transition-all group flex items-start gap-3 cursor-pointer shadow-xs active:scale-98"
              >
                <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">
                  {idx + 1}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="text-[10px] font-bold text-amber-400/80 uppercase tracking-wider">
                    {q.category}
                  </div>
                  <div className="text-xs text-white group-hover:text-amber-200 font-sans leading-relaxed break-keep">
                    "{q.question}"
                  </div>
                </div>
                <ChevronRight size={15} className="text-white/30 group-hover:text-amber-400 transition-colors shrink-0 mt-2" />
              </button>
            ))}
          </div>
        </div>
      )}
    </RealBookModal>
  );
}

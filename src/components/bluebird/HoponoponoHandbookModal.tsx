import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Heart,
  BookOpen,
  Volume2,
  Check,
  Compass,
  Droplets,
  Sun,
  ShieldCheck,
  Music,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { TTSButton } from '@/components/TTSButton';
import { RealBookModal, type BookChapterTab } from '@/components/RealBookModal';
import {
  HOPONOPONO_TOOL_CATALOG,
  type HoponoponoToolId,
  type HoponoponoToolCatalogItem,
} from '@/lib/hoponoponoTools';

export interface HoponoponoHandbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool?: (toolId: HoponoponoToolId, toolName: string) => void;
  onConsult?: (text: string) => void;
}

const CHAPTER_TABS: BookChapterTab[] = [
  { id: 'prayers', romanNumeral: 'Ⅰ', title: '신성한 3대 기도문 (Sacred Prayers)', shortLabel: '3대 기도문' },
  { id: 'tools', romanNumeral: 'Ⅱ', title: '14가지 정화 도구 사전 (14 Tools)', shortLabel: '정화 도구' },
  { id: 'mantra', romanNumeral: 'Ⅲ', title: '일상 정화 4단계 수련법 (Mantra & Practice)', shortLabel: '정화 수련법' },
  { id: 'bible', romanNumeral: 'Ⅳ', title: 'AI 코칭 바이블 (Bible & Lucy 1:1)', shortLabel: '코칭 바이블' },
];

export const HOPONOPONO_BIBLE_SECTIONS = [
  {
    id: 'four_phrases',
    title: 'Four Phrases · 네 가지 정화 구절',
    iconName: 'Heart',
    principles: [
      "모든 문제는 내 안의 기억(잠재의식)이 재생된 결과입니다.",
      "대상을 향해 말하는 것이 아니라, 내 안의 기억을 향해 고백합니다.",
      "감정을 억지로 싣지 않아도 마음속으로 읊는 것만으로 정화가 일어납니다."
    ],
    steps: [
      "지금 내 안의 불편한 기억을 4가지 구절로 정화하는 구체적인 루틴을 알려줘",
      "이 네 구절을 외울 때 감정을 억지로 실어야 하는지, 아니면 기계적으로 반복해도 되는지 설명해줘",
      "특정 사람(가족, 동료) 때문에 화가 날 때 이 구절을 어떻게 적용해야 하는지 가이드해줘"
    ]
  },
  {
    id: 'unihipili',
    title: 'Unihipili · 내면아이와의 소통',
    iconName: 'Baby',
    principles: [
      "우니히피리(Unihipili)는 감정과 기억을 보관하는 잠재의식입니다.",
      "내면아이가 상처받으면 몸의 통증이나 무기력으로 신호를 보냅니다.",
      "어머니가 아이를 보살피듯 따뜻하게 말을 건네고 사랑을 전하세요."
    ],
    steps: [
      "내 안의 잠재의식(우니히피리)과 신뢰를 쌓는 3단계 정화 대화법을 알려줘",
      "내면아이가 상처받아 삐쳤거나 침묵할 때 달래주는 실천 팁을 줘",
      "우니히피리가 좋아하는 호오포노포노 음식 도구(블루베리, 초콜릿)와 함께 정화하는 법을 설명해줘"
    ]
  },
  {
    id: 'responsibility',
    title: '100% Responsibility · 100% 온전한 책임',
    iconName: 'ShieldCheck',
    principles: [
      "내 삶에 나타나는 모든 사건, 사람, 감정은 나의 100% 책임입니다.",
      "자책(Guilt)이 아니라, 내 안에 정화할 기회가 주어졌음을 인정하는 것입니다.",
      "내가 정화되면 나와 연결된 모든 우주가 함께 정화됩니다."
    ],
    steps: [
      "'외부의 모든 사건은 내 잠재의식 기억의 재생'이라는 100% 책임의 원리를 쉽게 설명해줘",
      "남 탓이나 자책감에 빠지지 않고 온전히 책임지며 정화하는 마음가짐을 알려줘",
      "뉴스를 보거나 타인의 고통을 목격했을 때 호오포노포노로 정화하는 방법은?"
    ]
  },
  {
    id: 'inspiration',
    title: 'Inspiration & Tools · 신성의 영감과 정화 도구',
    iconName: 'Sparkles',
    principles: [
      "기억(Memory)이 지워진 자리에 신성의 영감(Inspiration)이 내려옵니다.",
      "블루 솔라 워터, 씨포트(Ceeport), 지우개 달린 연필은 영감을 돕는 도구입니다.",
      "기대(Expectation)를 내려놓을 때 신성의 완전한 해결책이 나타납니다."
    ],
    steps: [
      "기억(Memory)과 영감(Inspiration)의 차이를 구별하는 기준을 알려줘",
      "제로 상태(Zero State)에 도달했을 때의 마음 상태와 신성의 은혜를 설명해줘",
      "씨포트(Ceeport), 블루 솔라 워터 등 정화 도구를 일상에서 200% 활용하는 법을 알려줘"
    ]
  }
];

export const SACRED_PRAYERS = [
  {
    id: 'morrnah',
    titleKo: '모르나의 기도',
    titleEn: "Morrnah's Prayer",
    author: '모르나 나라마쿠 시메오나 (Morrnah Nalamaku Simeona)',
    desc: '조상과 전 생애에 걸쳐 얽힌 모든 부정적인 기억, 장애물, 파동을 끊어내고 순수한 빛으로 변환하는 하와이안 전통 근원 기도문입니다.',
    koreanText: `신성한 창조주여, 아버지와 어머니, 자녀가 하나로...
만일 저와 저의 가족, 친척, 조상들이 태초의 창조부터 현재에 이르기까지 생각과 말, 행동과 행위로 당신과 당신의 가족, 친척, 조상들에게 상처를 주었다면, 진심으로 용서를 구합니다...

이 기도를 통해 모든 부정적인 기억과 장애물, 어두운 에너지와 파동을 정화하고 깨끗이 씻어내며, 놓아주고 완전히 끊어내어, 이 모든 원치 않는 에너지를 순수한 빛으로 변환하소서...

그렇게 온전히 이루어졌나이다.`,
    englishText: `Divine creator, father, mother, son as one...
If I, my family, relatives and ancestors have offended you, your family, relatives and ancestors in thoughts, words, deeds and actions from the beginning of our creation to the present, we ask your forgiveness...

Let this cleanse, purify, release, cut all the negative memories, blocks, energies and vibrations, and transmute these unwanted energies into pure light....

And it is done.`,
  },
  {
    id: 'i_am_the_i',
    titleKo: '「나」는 「나」이다 (개회 기도문)',
    titleEn: '"I" Am the "I"',
    author: '호오포노포no 공식 개회 기도 (Opening Prayer of "I")',
    desc: '내면의 무한한 공(空)과 생명의 숨결을 자각하며, 모든 의식의 너머에 존재하는 참된 자아를 깨우는 거룩한 개회 기도문입니다.',
    koreanText: `「나」는 공(空)의 심연에서 빛으로 나아오며,
「나」는 생명을 기르고 꽃피우는 숨결입니다.
「나」는 모든 의식의 너머에 존재하는 텅 빔, 그 순수한 공허이자
「나」요, 자아(Id)요, 우주 만물의 전부(All)입니다.

「나」는 물결 위에 무지개의 활을 드리우며,
마음과 물질이 하나로 이어지는 연속성을 엮어냅니다.
「나」는 들이쉬고 내쉬는 들숨과 날숨이자,
보이지 않고 만질 수 없는 산들바람이며,
결코 규정할 수 없는 창조의 가장 순수한 원자입니다.

「나」는 진정한 「나」입니다.`,
    englishText: `"I" come forth from the void into light,
"I" am the breath that nurtures life,
"I" am that emptiness, that hollowness beyond all consciousness,
The "I", the Id, the All.

"I" draw my bow of rainbows across the waters,
the continuum of minds with matters.
"I" am the incoming and outgoing of breath,
the invisible, untouchable breeze,
the undefinable atom of creation.

"I" am the "I”.`,
  },
  {
    id: 'peace_of_i',
    titleKo: '「나」의 평화 (폐회 기도문)',
    titleEn: 'The Peace of "I"',
    author: '호오포노포no 공식 폐회 기도 (Closing Prayer of "I")',
    desc: '세상이 주는 일시적인 평화가 아닌, 신성의 근원에서 솟아나는 영원하고 완전한 평화를 온 우주에 나누는 폐회 축복 기도문입니다.',
    koreanText: `평화가 당신과 함께하기를, 나의 모든 평화,
「나」라는 존재 자체인 평화, 「내가 있음」인 그 평화.
언제나, 지금 이 순간에도, 영원무궁토록 지속될 평화.

나의 평화를 당신에게 건네며, 나의 평화를 당신 곁에 남겨둡니다.
세상이 주는 덧없는 평화가 아닌, 오직 나의 평화,
「나」의 거룩한 평화를 당신에게 전합니다.`,
    englishText: `Peace be with you, All My Peace,
The Peace that is "I", the Peace that is "I am".
The Peace for always, now and forever and ever more.

My Peace "I" give to you, My Peace "I" leave with you,
Not the world's Peace, but, only My Peace,
The Peace of "I".`,
  },
];

const HOPONOPONO_AUDIOBOOK_NARRATIONS: Record<string, string> = {
  prayers: `호오포노포노 지혜의 서, 제1장 신성한 3대 기도문입니다.
첫 번째 기도문, 모나 여사의 개회 기도: 신성한 창조주시여, 아버지와 어머니, 자식이 하나로 존재하는 분이시여. 만일 저와 저의 가족, 피붙이, 조상이 창조된 첫날부터 현재에 이르기까지 생각과 말, 행동으로 당신과 당신의 가족, 피붙이, 조상에게 상처를 주었다면 부디 용서해 주소서. 모든 부정적인 기억과 장애, 에너지를 정화하고 녹여 없애시어 이 순수한 빛으로 변화시키소서.
두 번째 기도문, 나는 나이다: 나는 공의 심연에서 빛으로 나아오며, 생명을 기르는 숨결입니다. 나는 의식 너머의 순수한 공허이자 참된 자아입니다.
세 번째 기도문, 나의 평화: 평화가 당신과 함께하기를, 나의 모든 평화를 그대에게 보냅니다. 영원한 신성의 평화를 드립니다.`,
  tools: `제2장, 14가지 정화 도구 사전입니다.
블루 솔라 워터는 파란 유리병에 물을 담아 태양빛으로 에너지를 충전한 정화수입니다.
지우개 연필은 연필 뒤의 지우개로 문제를 두드리며 잠재의식의 기억을 삭제하는 신성의 도구입니다.
씨포트는 Clean, Erase, Erase, Return to Zero를 상징하는 영적 엠블럼입니다.
블루베리와 딸기는 공포와 슬픔의 기억을 씻어내는 우니히피리의 특효 도구입니다.
아이스블루는 육체적 통증과 분노가 일어났을 때 속으로 외쳐 에너지를 즉각 냉각시키는 치유어입니다.`,
  mantra: `제3장, 일상 정화 4단계 수련법입니다.
1단계, 미안합니다: 내 안의 어떤 기억이 이 고통을 일으켰는지 알아채고 온전한 책임을 인정합니다.
2단계, 용서하세요: 상대를 용서하는 것이 아니라 내 안의 잠재의식에게 참회를 구합니다.
3단계, 감사합니다: 고통스러운 기억을 지우고 정화할 기회를 주신 신성께 깊이 감사드립니다.
4단계, 사랑합니다: 모든 존재와 내면아이를 무조건적인 사랑으로 감싸안아 제로 상태로 돌아갑니다.`,
  bible: `제4장, AI 코칭 바이블과 호오포노포노 핵심 지혜입니다.
모든 문제는 외부 세상에 있는 것이 아니라, 나의 잠재의식에 저장된 기억의 재생입니다. 100% 책임을 질 때 우리는 피해자가 아닌 창조자로서 문제를 즉시 정화할 수 있습니다. 기억이 지워진 텅 빈 자리에 신성의 영감이 내려와 기적을 이룹니다.`
};

export function HoponoponoHandbookModal({
  isOpen,
  onClose,
  onSelectTool,
  onConsult,
}: HoponoponoHandbookModalProps) {
  const [activeTab, setActiveTab] = useState<'prayers' | 'tools' | 'mantra' | 'bible'>('prayers');
  const [selectedPrayerId, setSelectedPrayerId] = useState<string>('morrnah');
  const [showEnglishText, setShowEnglishText] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'food' | 'classic'>('all');
  const [copiedPrayer, setCopiedPrayer] = useState(false);

  if (!isOpen) return null;

  const currentPrayer = SACRED_PRAYERS.find((p) => p.id === selectedPrayerId) || SACRED_PRAYERS[0];

  const filteredTools = HOPONOPONO_TOOL_CATALOG.filter((t) => {
    if (t.id === 'auto') return false;
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  const handleCopyPrayer = () => {
    const textToCopy = `${currentPrayer.titleKo} (${currentPrayer.titleEn})\n\n${currentPrayer.koreanText}\n\n[English]\n${currentPrayer.englishText}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedPrayer(true);
    setTimeout(() => setCopiedPrayer(false), 2000);
  };

  return (
    <RealBookModal
      isOpen={isOpen}
      onClose={onClose}
      theme="bluebird"
      bookTitle="호오포노포노 지혜의 서"
      bookSubtitle="신성의 4가지 정화 구절과 고대 하와이 치유 비전"
      bookAuthor="Dr. Ihaleakala Hew Len & Morrnah Simeona"
      epigraphQuote="평화는 나로부터 시작됩니다. 평화가 항상 당신과 함께하기를..."
      epigraphSource="Morrnah Nalamaku Simeona"
      chapterTabs={CHAPTER_TABS}
      activeTabId={activeTab}
      onTabChange={(id) => setActiveTab(id as any)}
      footerPageNumber={`- Chapter ${activeTab === 'prayers' ? 'Ⅰ' : activeTab === 'tools' ? 'Ⅱ' : activeTab === 'mantra' ? 'Ⅲ' : 'Ⅳ'} -`}
      audiobookNarrations={HOPONOPONO_AUDIOBOOK_NARRATIONS}
      defaultVoice="Kore"
    >
            {/* TAB 1: PRAYERS */}
            {activeTab === 'prayers' && (
              <div className="space-y-6">
                {/* Prayer Selector Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SACRED_PRAYERS.map((p) => {
                    const isSelected = selectedPrayerId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPrayerId(p.id)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-sky-500/15 border-sky-400/50 shadow-[0_0_20px_rgba(56,189,248,0.15)] text-white'
                            : 'bg-white/[0.02] border-white/5 hover:border-sky-500/20 text-white/60 hover:text-white'
                        }`}
                      >
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400 block mb-1">
                          {p.titleEn}
                        </span>
                        <p className="text-sm font-bold text-white font-sans">{p.titleKo}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Active Prayer Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-black/50 border border-sky-500/20 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <span className="text-[10px] text-sky-400 font-mono font-bold uppercase tracking-widest block">
                        {currentPrayer.author}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 font-sans">
                        {currentPrayer.titleKo}
                      </h3>
                      <p className="text-xs text-white/50 mt-1 font-sans">{currentPrayer.desc}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowEnglishText(!showEnglishText)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-sky-300 font-sans cursor-pointer transition-all"
                      >
                        {showEnglishText ? '한글만 보기' : '영문 원문 함께보기'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyPrayer}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 hover:text-white font-sans cursor-pointer transition-all flex items-center gap-1"
                      >
                        {copiedPrayer ? <Check size={14} className="text-emerald-400" /> : null}
                        <span>{copiedPrayer ? '복사 완료' : '기도문 복사'}</span>
                      </button>
                      <TTSButton
                        text={currentPrayer.koreanText}
                        voice="Kore"
                        className="px-3.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 text-xs text-sky-300 font-sans cursor-pointer transition-all"
                      />
                    </div>
                  </div>

                  {/* Prayer Text */}
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-sky-950/20 border border-sky-500/10">
                      <p className="text-sm sm:text-base text-sky-100 font-serif leading-loose whitespace-pre-line tracking-wide">
                        {currentPrayer.koreanText}
                      </p>
                    </div>

                    {showEnglishText && (
                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                        <span className="text-[10px] text-sky-400/80 font-mono font-bold uppercase tracking-widest block mb-2">
                          [ English Original ]
                        </span>
                        <p className="text-xs sm:text-sm text-white/60 font-serif italic leading-relaxed whitespace-pre-line">
                          {currentPrayer.englishText}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Practice Tip */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 text-xs shrink-0 mt-0.5">
                      💡
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed font-sans">
                      <strong>실천 팁:</strong> 아침에 눈을 떴을 때나 중요한 결정을 앞두고, 또는 마음이 크게 소란스러울 때 이 기도문을 천천히 3회 소리 내어 낭독하거나 속삭여 보세요. 무의식에 응어리진 기억들이 정화되어 순수한 빛으로 돌아갑니다.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CLEANING TOOLS */}
            {activeTab === 'tools' && (
              <div className="space-y-6">
                {/* Category Filter */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('all')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                        selectedCategory === 'all'
                          ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300'
                          : 'bg-white/5 border border-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      전체 ({HOPONOPONO_TOOL_CATALOG.length - 1}개)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('food')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                        selectedCategory === 'food'
                          ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300'
                          : 'bg-white/5 border border-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      🍓 13가지 음식 & 사물 정화 도구
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('classic')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                        selectedCategory === 'classic'
                          ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300'
                          : 'bg-white/5 border border-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      💧 클래식 하와이안 도구
                    </button>
                  </div>

                  <span className="text-[11px] text-white/40 font-sans">
                    도구를 클릭하면 바로 데일리 정화 처방에 적용됩니다.
                  </span>
                </div>

                {/* Tool Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTools.map((tool: HoponoponoToolCatalogItem) => (
                    <motion.div
                      key={tool.id}
                      whileHover={{ y: -3 }}
                      className="p-5 rounded-3xl bg-zinc-950/60 border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-950/10 transition-all flex flex-col justify-between gap-4 group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{tool.emoji}</span>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 group-hover:text-emerald-300 group-hover:border-emerald-500/30 transition-colors">
                            {tool.category === 'food' ? 'Food Cleansing' : 'Sacred Tool'}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-white font-sans group-hover:text-emerald-200 transition-colors">
                            {tool.name}
                          </h4>
                          <span className="text-[10px] text-white/40 font-mono block">
                            {tool.nameEn}
                          </span>
                        </div>

                        <p className="text-xs text-white/70 font-sans leading-relaxed break-keep">
                          {tool.summary}
                        </p>

                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                          <span className="text-[9px] font-bold uppercase text-emerald-400 font-mono block">
                            핵심 정화 작용
                          </span>
                          <p className="text-[11px] text-emerald-200/90 font-sans mt-0.5 break-keep">
                            {tool.coreEffect}
                          </p>
                        </div>
                      </div>

                      {onSelectTool && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectTool(tool.id, tool.name);
                            onClose();
                          }}
                          className="w-full py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-sans flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        >
                          <span>이 도구로 정화 처방 받기</span>
                          <ChevronRight size={14} />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: THE MANTRA & ZERO LIMITS */}
            {activeTab === 'mantra' && (
              <div className="space-y-6">
                {/* Four Phrases Showcase */}
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-pink-950/30 via-black/60 to-purple-950/20 border border-pink-500/20 space-y-6">
                  <div className="text-center space-y-2 max-w-xl mx-auto">
                    <span className="text-[10px] text-pink-400 font-mono font-bold uppercase tracking-widest">
                      The Sacred 4 Phrases
                    </span>
                    <h3 className="text-2xl font-bold text-white font-sans">
                      호오포노포노 4가지 신성한 정화의 진언
                    </h3>
                    <p className="text-xs text-white/60 font-sans">
                      남을 향해 하는 말이 아닌, 내 잠재의식(우니히피리) 속 억압된 기억을 씻어내는 영혼의 지우개입니다.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-1.5">
                      <span className="text-[10px] font-mono text-rose-400 font-bold uppercase">1. I'm Sorry</span>
                      <p className="text-lg font-bold text-white font-sans">미안합니다</p>
                      <p className="text-[11px] text-white/50 break-keep">
                        내 안에 쌓여 있던 기억과 고통을 방치했음을 온전히 인정합니다.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1.5">
                      <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">2. Please Forgive Me</span>
                      <p className="text-lg font-bold text-white font-sans">용서해 주세요</p>
                      <p className="text-[11px] text-white/50 break-keep">
                        스스로를 가두었던 비난, 죄책감, 집착의 끈을 놓아달라 청합니다.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-center space-y-1.5">
                      <span className="text-[10px] font-mono text-sky-400 font-bold uppercase">3. Thank You</span>
                      <p className="text-lg font-bold text-white font-sans">감사합니다</p>
                      <p className="text-[11px] text-white/50 break-keep">
                        정화의 기회를 준 기억에게, 그리고 정화해주신 신성에게 감사합니다.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1.5">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">4. I Love You</span>
                      <p className="text-lg font-bold text-white font-sans">사랑합니다</p>
                      <p className="text-[11px] text-white/50 break-keep">
                        모든 존재와 내면 아이를 조건 없는 신성의 사랑으로 감싸 안습니다.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Zero Limits Music & Mathew Dixon Info */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                      <Music size={20} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white font-sans">
                        Zero Limits Music & Healing
                      </h4>
                      <p className="text-xs text-white/40 font-mono">
                        by Mathew Dixon (Zero Limits Music)
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-white/70 font-sans leading-relaxed break-keep">
                    호오포노포노의 정화는 말로만 하는 것이 아니라, 음악과 파동, 그리고 일상에서 마주하는 소박한 음식과 물품들을 통해 언제 어디서나 실천할 수 있습니다. 무의식의 기억을 '공(Zero/Zero Limits)'의 상태로 비워낼 때, 신성한 영감과 무한한 풍요가 우리 삶으로 자연스럽게 흘러듭니다.
                  </p>

                  <div className="pt-2 flex items-center gap-3">
                    <a
                      href="https://www.zerolimitsmusic.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/30 text-purple-300 text-xs font-bold font-sans transition-all cursor-pointer"
                    >
                      <span>Zero Limits Music 공식 사이트</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: BIBLE (AI COACHING QUESTIONS) */}
            {activeTab === 'bible' && (
              <div className="space-y-6">
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-sky-950/40 via-black/70 to-cyan-950/30 border border-sky-500/30 space-y-4 text-left">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-sky-400 font-mono font-bold uppercase tracking-widest">
                      Ho&apos;oponopono AI Coaching &amp; Dialogue Bible
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-sans">
                      호오포노포노 AI 상담 질문 가이드
                    </h3>
                    <p className="text-xs text-white/60 font-sans leading-relaxed">
                      궁금한 정화 질문을 클릭하면 루시(AI)와 1:1 심층 상담이 즉시 시작됩니다.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {HOPONOPONO_BIBLE_SECTIONS.map((section) => (
                    <div
                      key={section.id}
                      className="p-6 rounded-3xl bg-zinc-950/70 border border-sky-500/20 space-y-4 text-left flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300">
                            <Sparkles size={16} />
                          </div>
                          <h4 className="text-sm font-bold text-white font-sans">
                            {section.title}
                          </h4>
                        </div>

                        <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                          <span className="text-[9px] font-mono font-bold uppercase text-sky-400 block">
                            핵심 원리
                          </span>
                          <ul className="space-y-1">
                            {section.principles.map((pr, i) => (
                              <li key={i} className="text-[11px] text-white/70 font-sans leading-relaxed flex items-start gap-1.5">
                                <span className="text-sky-400 font-bold">•</span>
                                <span>{pr}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <span className="text-[9px] font-mono font-bold uppercase text-sky-400 block">
                          추천 코칭 질문 (클릭 시 AI 상담 연결)
                        </span>
                        {section.steps.map((step, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (onConsult) {
                                onConsult(step);
                              }
                              onClose();
                            }}
                            className="w-full p-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-left text-[11px] text-sky-200 hover:text-white font-sans flex items-center justify-between gap-2 transition-all cursor-pointer group"
                          >
                            <span className="leading-snug break-keep">{step}</span>
                            <ChevronRight size={14} className="shrink-0 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
    </RealBookModal>
  );
}

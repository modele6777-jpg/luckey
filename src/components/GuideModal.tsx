import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Bird,
  BookOpen,
  Compass,
  Gem,
  Headphones,
  Home,
  Lightbulb,
  MessageCircle,
  Moon,
  Music,
  RefreshCw,
  Sparkles,
  Star,
  Sun,
  TreeDeciduous,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  getGuideSectionSpeechKey,
  playGuideSection,
  type GuideSpeechSection,
} from "@/lib/guideSpeech";
import { stopTTS, subscribeTTS } from "@/utils/tts";

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type GuideTab =
  | "overview"
  | "prologue"
  | "orange"
  | "trinity"
  | "aura"
  | "bluebird"
  | "muse"
  | "epilogue"
  | "highlights";

interface GuideSection extends GuideSpeechSection {
  id: GuideTab;
  tag: string;
  icon: React.ElementType;
  accent: string;
  gradient: string;
}

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: "overview",
    name: "PRISM 사용법",
    subtitle: "처음부터 끝까지 단계별 안내",
    tag: "사용 안내",
    icon: Compass,
    accent: "#a78bfa",
    gradient: "from-violet-500 via-fuchsia-500 to-cyan-400",
    description:
      "PRISM은 대화·상징·리딩·웰니스·호흡·창작·기록이 하나의 흐름으로 이어지는 마음 탐색 앱입니다. 아래 순서대로 따라 하면 첫 날부터 각 공간을 어떻게 쓰는지, 어디를 눌러야 하는지까지 구체적으로 익힐 수 있습니다. 한 번에 모든 공간을 쓸 필요는 없고, 오늘 필요한 단계만 골라도 됩니다.",
    steps: [
      "Google 로그인 → SECURED PIN 입력(4자리)으로 앱에 진입합니다.",
      "PROLOGUE(홈)에서 오늘의 에너지·추천 공간을 확인하고 마음을 한 문장으로 적어 봅니다.",
      "하단 아이콘으로 ORANGE·TRINITY·AURA·BLUEBIRD·MUSE 중 필요한 공간을 열고 체험 하나를 완료합니다.",
      "우측 하단 PRISM 교감 채팅으로 떠오른 질문을 이어가거나, 가이드북 TTS로 안내를 들습니다.",
      "EPILOGUE에서 오늘의 기록을 돌아보고, 다음에 이어갈 한 문장을 남깁니다.",
    ],
    tip: "처음엔 PROLOGUE → 한 공간 → EPILOGUE만 10분 해도 충분합니다. 익숙해지면 상황별 추천 루트를 참고해 흐름을 넓혀 보세요.",
    blocks: [
      {
        label: "1단계 시작하기",
        items: [
          {
            title: "로그인과 PIN",
            body: "Google 계정으로 로그인한 뒤 SECURED 화면에서 4자리 PIN을 입력합니다. PIN은 같은 세션 동안 유지되며, 앱을 완전히 닫았다가 다시 열면 재입력합니다.",
          },
          {
            title: "프로필 설정",
            body: "우측 상단 사람 아이콘(프로필)에서 이름·생년월일·관심사를 입력하세요. TRINITY 사주·별자리, MUSE 음악 추천, ORANGE·BLUEBIRD 대화 맞춤화에 반영됩니다.",
          },
          {
            title: "첫 방문 안내",
            body: "홈(PROLOGUE)에 처음 들어오면 프로필 설정 안내가 뜰 수 있습니다. 나중에 해도 되지만, 가능하면 첫날에 기본 정보만 입력해 두면 이후 체험이 훨씬 개인화됩니다.",
          },
        ],
      },
      {
        label: "2단계 화면 구조",
        items: [
          {
            title: "일곱 공간",
            body: "PROLOGUE(☀️ 홈)=통합 허브, ORANGE=Daily Secret·몰입, TRINITY=사주·타로·별자리, AURA=몸·에너지 웰니스, BLUEBIRD=호흡·정서 안정, MUSE=창작·영감, EPILOGUE=기록·성찰입니다.",
          },
          {
            title: "하단 네비게이션",
            body: "화면 하단 7개 아이콘으로 공간을 바로 이동합니다. 이미 선택된 아이콘을 다시 누르면 해당 공간 상단으로 스크롤됩니다.",
          },
          {
            title: "홈으로 돌아가기",
            body: "어느 공간에서든 좌측 상단 PRISM 텍스트를 누르면 PROLOGUE(홈)로 돌아갑니다. 좌측 엠블럼(회전하는 ☀️)을 누르면 7개 공간 소개 모달이 열립니다.",
          },
        ],
      },
      {
        label: "3단계 기본 조작",
        items: [
          {
            title: "우측 상단 도구",
            body: "가이드북(?)=이 안내서, 로그아웃, 프로필, 수동 동기화(⟳) 순입니다. PC와 모바일을 함께 쓸 때는 수동 동기화로 최신 버전·기록을 맞출 수 있습니다.",
          },
          {
            title: "PRISM 교감 채팅",
            body: "각 공간 우측 하단 채팅 버튼으로 루시(Lucy) AI와 대화합니다. 공간마다 톤이 다르며, 오늘의 감정·카드·리딩 결과를 이어서 질문할 수 있습니다.",
          },
          {
            title: "가이드북 TTS",
            body: "눈이 피로할 때 가이드북 상단의 「이 섹션 읽기」로 현재 안내를 음성으로 들을 수 있습니다. 이동 중이거나 누워 있을 때 활용해 보세요.",
          },
        ],
      },
      {
        label: "4단계 상황별 추천 루트",
        items: [
          {
            title: "마음이 복잡할 때",
            body: "PROLOGUE에서 감정을 말로 꺼낸 뒤 → BLUEBIRD 호흡·자연 소리 → EPILOGUE에 한 문장 기록.",
          },
          {
            title: "방향·결정이 필요할 때",
            body: "TRINITY에서 사주·타로 리딩 → ORANGE에서 Daily Secret 받기 → 오늘 실천할 작은 행동 하나 정하기.",
          },
          {
            title: "몸이 지치거나 긴장될 때",
            body: "AURA 에너지 점검 → 1분 명상(60초 마이크로 이완·솔페지오 주파수·호흡 리셋) 실천하기.",
          },
          {
            title: "표현·영감이 필요할 때",
            body: "MUSE에서 감정을 색·장면으로 표현 → 창작물에서 마음에 남는 요소 기록 → EPILOGUE에서 패턴 확인.",
          },
        ],
      },
      {
        label: "5단계 기록과 동기화",
        items: [
          {
            title: "자동 저장",
            body: "대화, 확언, 타로, 명상, 창작 결과는 각 공간과 EPILOGUE에 자동으로 쌓입니다. 별도 저장 버튼 없이도 여정이 이어집니다.",
          },
          {
            title: "기기 간 동기화",
            body: "로그인한 계정 기준으로 PC·모바일 데이터가 자동 동기화됩니다. 앱을 다시 열면 최신 버전 확인 후 필요 시 새로고침됩니다.",
          },
          {
            title: "주간 회고 루틴",
            body: "주 1회 EPILOGUE에서 반복되는 감정·색·문장을 찾아 보세요. 다음 주에는 자주 등장한 패턴에 맞는 공간부터 시작하면 효과가 큽니다.",
          },
        ],
      },
    ],
  },
  {
    id: "prologue",
    name: "PROLOGUE",
    subtitle: "마음의 입구",
    tag: "교감 대화",
    icon: Sun,
    accent: "#fb7185",
    gradient: "from-rose-500 to-orange-400",
    description:
      "PRISM과 처음 만나는 대화 공간입니다. 고민이 분명하지 않아도 괜찮습니다. 오늘 있었던 일이나 지금 느끼는 감정부터 편하게 이야기하면 다음 탐색 방향을 함께 정리합니다.",
    steps: [
      "지금 가장 크게 느껴지는 감정을 한 문장으로 적습니다.",
      "추천 질문을 누르거나 자유롭게 대화를 이어갑니다.",
      "대화에서 발견한 키워드를 다음 공간의 주제로 가져갑니다.",
    ],
    tip: "‘왜 이럴까?’보다 ‘지금 내 안에서 무슨 일이 일어나고 있지?’라고 물으면 더 깊이 탐색할 수 있습니다.",
  },
  {
    id: "orange",
    name: "ORANGE",
    subtitle: "상징과 행운의 작업실",
    tag: "Daily Secret",
    icon: TreeDeciduous,
    accent: "#fb923c",
    gradient: "from-orange-500 to-amber-300",
    description:
      "론다 번의 『시크릿』— 끌어당김의 법칙을 바탕으로 ORANGE가 오늘의 시크릿 확언·믿음·실천을 전하는 공간입니다. 하루에 한 번, 마음에 새겨 보세요.",
    steps: [
      "상단 탭에서 ‘Daily Secret’을 선택합니다.",
      "소원을 적고 ‘오늘의 시크릿 키트 받기’를 눌러 맞춤 메시지를 받습니다.",
      "68초 시각화, 감사 자석, 거울 확언, 스크립팅으로 끌어당김을 실천합니다.",
    ],
    tip: "실천 체크리스트를 채우며 Ask-Believe-Receive 흐름을 하루 종일 이어 가 보세요.",
  },
  {
    id: "trinity",
    name: "TRINITY",
    subtitle: "시간과 상징의 리딩룸",
    tag: "리딩",
    icon: Sparkles,
    accent: "#facc15",
    gradient: "from-yellow-400 to-orange-400",
    description:
      "사주, 별자리, 타로의 서로 다른 시선을 한곳에서 만나는 공간입니다. 미래를 단정하기보다 현재의 흐름과 선택지를 비추는 참고 지도처럼 활용하세요.",
    steps: [
      "Tarot Bible에서 타로 원리와 스프레드를 살펴봅니다.",
      "사주와 별자리의 큰 흐름을 확인합니다.",
      "타로 리딩에서 오늘 선택할 수 있는 행동을 찾습니다.",
    ],
    tip: "‘무슨 일이 생길까?’보다 ‘이 상황에서 내가 살펴볼 점은 무엇일까?’라고 질문해 보세요.",
  },
  {
    id: "aura",
    name: "AURA",
    subtitle: "몸과 에너지의 점검실",
    tag: "균형 점검",
    icon: Activity,
    accent: "#34d399",
    gradient: "from-emerald-400 to-cyan-400",
    description:
      "세도나 메서드 방하착과 몸·에너지 점검을 함께 하는 공간입니다. Sedona Method 데일리 세션과 Sedona Bible로 감정을 흘려보내는 연습을 이어갑니다.",
    steps: [
      "Sedona Method 탭에서 오늘의 방하착 세션을 시작합니다.",
      "Sedona Bible에서 세도나 4문답과 호킨스 놓아버림을 함께 살펴봅니다.",
      "AURA 1분 명상(60s Micro Healing)으로 언제 어디서나 뇌파와 신경계를 안정시킵니다.",
    ],
    tip: "불편함이 지속되거나 심하면 앱의 안내보다 의료 전문가의 도움을 우선하세요.",
  },
  {
    id: "bluebird",
    name: "BLUEBIRD",
    subtitle: "호흡과 감정의 안식처",
    tag: "진정과 회복",
    icon: Bird,
    accent: "#22d3ee",
    gradient: "from-cyan-400 to-blue-500",
    description:
      "호오포노포노 정화와 호흡·자연 소리로 마음을 쉬어 가는 공간입니다. Ho'oponopono Bible에서 네 가지 구절과 정화 도구를 배우고 실천합니다.",
    steps: [
      "Ho'oponopono Bible에서 네 가지 정화 구절을 살펴봅니다.",
      "호흡 가이드나 자연의 소리로 긴장을 낮춥니다.",
      "정화 도구(블루솔라워터, 치포트키 등) 중 하나를 오늘 실천합니다.",
    ],
    tip: "억지로 편안해지려 하지 않아도 됩니다. 호흡 한 번을 알아차리는 것부터 충분합니다.",
  },
  {
    id: "muse",
    name: "MUSE",
    subtitle: "감정의 창작실",
    tag: "영감과 표현",
    icon: Music,
    accent: "#60a5fa",
    gradient: "from-blue-500 to-violet-500",
    description:
      "말로 설명하기 어려운 감정을 이미지와 이야기로 표현하는 공간입니다. 떠오르는 장면, 색, 음악, 인물을 단서로 삼아 내 안의 감각을 창작물로 바꿉니다.",
    steps: [
      "오늘의 감정을 색, 날씨, 장면 중 하나로 표현합니다.",
      "추천된 영감과 질문을 따라 이미지를 구체화합니다.",
      "완성된 작품에서 가장 마음에 남는 요소를 기록합니다.",
    ],
    tip: "잘 만드는 것이 목적이 아닙니다. 설명할 수 없던 마음이 어떤 모양인지 발견해 보세요.",
  },
  {
    id: "epilogue",
    name: "EPILOGUE",
    subtitle: "기록이 머무는 곳",
    tag: "통합과 회고",
    icon: Moon,
    accent: "#f472b6",
    gradient: "from-fuchsia-500 to-pink-400",
    description:
      "PRISM에서 만든 기록과 결과물을 한눈에 돌아보는 공간입니다. 흩어진 경험을 연결해 반복되는 감정과 변화의 단서를 발견하고, 다음 여정을 위한 한 문장을 남깁니다.",
    steps: [
      "최근의 대화와 활동 기록을 천천히 훑어봅니다.",
      "반복해서 등장한 감정, 색, 문장을 찾아봅니다.",
      "이번 주의 나에게 건네고 싶은 한 문장을 남깁니다.",
    ],
    tip: "기록의 양보다 다시 읽었을 때 나를 이해하게 해 주는 한 문장이 더 중요합니다.",
  },
  {
    id: "highlights",
    name: "Why PRISM",
    subtitle: "차별점 · 강점 · 특별점",
    tag: "PRISM만의 특별함",
    icon: Gem,
    accent: "#c084fc",
    gradient: "from-violet-500 via-fuchsia-500 to-amber-400",
    description:
      "PRISM은 대화 한 번으로 끝나지 않습니다. 몸의 에너지, 상징, 창작, 기록이 이어지는 통합 여정이며, 다른 마음 돌봄 앱과 겹치지 않도록 설계된 차별점·강점·특별점을 아래에서 확인할 수 있습니다.",
    steps: [
      "차별점: 실시간 에너지 동조, 일곱 공간 연결, 공간별 영혼 가디언",
      "강점: 완결된 여정, PC·모바일 동기화, 감정·키워드 기록 통합",
      "특별점: 솔페지오·바이노럴 명상, 가이드북 TTS, 에필로그 성찰 저장소",
    ],
    tip: "하나만 골라 써도 좋고, 프롤로그에서 에필로그까지 이어가면 PRISM의 강점이 가장 잘 드러납니다.",
  },
];

const PRISM_HIGHLIGHT_GROUPS = [
  {
    label: "차별점",
    accent: "#feca57",
    icon: Zap,
    items: [
      {
        title: "실시간 바이오메트릭 에너지 동조",
        body: "피로, 스트레스, 수면 지표를 바탕으로 지금 가장 필요한 공간을 맞춤 제안합니다. 마음 상태에 맞는 다음 여정을 바로 연결해 줍니다.",
      },
      {
        title: "일곱 공간이 하나의 흐름으로 연결",
        body: "대화, 상징, 리딩, 웰니스, 호흡, 창작, 기록이 각각 독립하면서도 에필로그로 자연스럽게 이어집니다. 흩어진 경험이 하나의 성찰로 모입니다.",
      },
      {
        title: "공간마다 다른 영혼 가디언",
        body: "정형화된 한 가지 톤이 아니라, 오렌지·트리니티·뮤즈·블루버드·아우라 등 각 샌추어리에 맞는 고유의 대화 음성과 시선을 제공합니다.",
      },
    ],
  },
  {
    label: "강점",
    accent: "#1dd1a1",
    icon: Star,
    items: [
      {
        title: "프롤로그부터 에필로그까지 완결된 여정",
        body: "입구에서 마음을 꺼내고, 필요한 공간을 거친 뒤, 기록과 변화를 돌아보는 구조가 처음부터 설계되어 있습니다.",
      },
      {
        title: "PC·모바일 자동 동기화",
        body: "기기를 바꿔도 기록과 설정이 따라옵니다. 앱을 다시 열면 최신 버전과 데이터가 자동으로 맞춰집니다.",
      },
      {
        title: "감정·키워드 기반 기록 통합",
        body: "각 공간에서 남긴 대화, 창작물, 명상, 리딩 결과가 라이브러리와 에필로그에서 연결되어 반복되는 패턴을 찾기 쉽습니다.",
      },
    ],
  },
  {
    label: "특별점",
    accent: "#54a0ff",
    icon: Gem,
    items: [
      {
        title: "AURA 1분 명상(60s Micro Healing)",
        body: "AURA 1분 명상에서 60초 집중 호흡 가이드, 솔페지오 주파수(432Hz/528Hz 등), 맞춤 명상 처방을 통해 빠르게 뇌파를 이완하고 에너지를 회복합니다.",
      },
      {
        title: "가이드북 읽어주기(TTS)",
        body: "눈이 피로할 때는 「이 섹션 읽기」로 현재 섹션 안내를 음성으로 들을 수 있습니다.",
      },
      {
        title: "탈중앙화 성찰 저장소",
        body: "대화가 휘발되지 않고, 확언·타로·그림·명상 기록이 에필로그에 쌓여 나만의 영적 성장 궤적을 남깁니다.",
      },
    ],
  },
] as const;

export function GuideModal({ isOpen, onClose }: GuideModalProps) {
  const [activeTab, setActiveTab] = useState<GuideTab>("overview");
  const [ttsBusy, setTtsBusy] = useState(false);
  const [ttsActiveText, setTtsActiveText] = useState<string | null>(null);

  const activeSection = useMemo(
    () => GUIDE_SECTIONS.find((section) => section.id === activeTab) ?? GUIDE_SECTIONS[0],
    [activeTab],
  );

  const activeIndex = GUIDE_SECTIONS.findIndex((section) => section.id === activeTab);
  const nextSection = GUIDE_SECTIONS[(activeIndex + 1) % GUIDE_SECTIONS.length];
  const isHighlightsSection = activeSection.id === "highlights";
  const isOverviewSection = activeSection.id === "overview";
  const usageBlocks = activeSection.blocks ?? [];
  const ActiveIcon = activeSection.icon;
  const activeSectionSpeechKey = getGuideSectionSpeechKey(activeSection);
  const isReadingSection = ttsBusy && ttsActiveText === activeSectionSpeechKey;

  useEffect(() => {
    return subscribeTTS((state) => {
      setTtsBusy(state.isSpeaking || state.isLoading);
      setTtsActiveText(state.activeText);
    });
  }, []);

  useEffect(() => {
    if (!isOpen && isReadingSection) {
      stopTTS();
    }
  }, [isOpen, isReadingSection]);

  useEffect(() => {
    if (!isOpen) return;
    if (isReadingSection) {
      stopTTS();
    }
  }, [activeTab, isOpen, isReadingSection]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleReadSection = () => {
    if (isReadingSection) {
      stopTTS();
      return;
    }
    void playGuideSection(activeSection);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#05060d]/90 p-3 backdrop-blur-xl md:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="PRISM 가이드북"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 18 }}
            transition={{ duration: 0.22 }}
            className="relative flex h-[90dvh] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0d18] shadow-[0_30px_120px_rgba(0,0,0,0.65)]"
          >
            <div className={`h-1 w-full bg-gradient-to-r ${activeSection.gradient}`} />

            <div
              className="pointer-events-none absolute right-[-8rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full opacity-15 blur-[110px] transition-colors duration-500"
              style={{ backgroundColor: activeSection.accent }}
            />

            <header className="relative z-10 flex shrink-0 items-center justify-between border-b border-white/[0.07] px-5 py-4 md:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white">
                  <BookOpen size={19} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-violet-300">Explore Your Inner Universe</p>
                  <h2 className="text-lg font-black tracking-tight text-white">PRISM 가이드북</h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReadSection}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px] font-bold transition ${
                    isReadingSection
                      ? "border-violet-400/30 bg-violet-500/15 text-violet-200"
                      : "border-white/[0.07] bg-white/[0.04] text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                  title={isReadingSection ? "읽기 중지" : "현재 섹션 읽어주기"}
                >
                  {isReadingSection ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  {isReadingSection ? "중지" : "이 섹션 읽기"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.04] p-2.5 text-white/55 transition hover:bg-white/10 hover:text-white"
                  title="가이드북 닫기"
                  aria-label="가이드북 닫기"
                >
                  <X size={17} />
                </button>
              </div>
            </header>

            <nav
              className="prism-guide-tabs relative z-10 flex shrink-0 gap-2 overflow-x-auto border-b border-white/[0.06] px-4 py-3 md:hidden"
              style={{ scrollbarWidth: "none" }}
            >
              {GUIDE_SECTIONS.map((section) => {
                const Icon = section.icon;
                const selected = section.id === activeTab;
                return (
                  <button
                    type="button"
                    key={section.id}
                    onClick={() => setActiveTab(section.id)}
                    className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold transition ${
                      selected ? "border-white/20 bg-white/10 text-white" : "border-transparent text-white/45"
                    }`}
                  >
                    <Icon size={13} style={{ color: selected ? section.accent : undefined }} />
                    {section.name}
                  </button>
                );
              })}
            </nav>

            <div className="relative z-10 flex min-h-0 flex-1">
              <aside className="hidden w-[255px] shrink-0 flex-col border-r border-white/[0.07] bg-black/10 p-4 md:flex">
                <div className="mb-3 px-3 pt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/25">Seven Perspectives</div>
                <div className="space-y-1 overflow-y-auto">
                  {GUIDE_SECTIONS.map((section, index) => {
                    const Icon = section.icon;
                    const selected = section.id === activeTab;
                    return (
                      <button
                        type="button"
                        key={section.id}
                        onClick={() => setActiveTab(section.id)}
                        className={`group flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                          selected
                            ? "border-white/10 bg-white/[0.08] text-white shadow-lg"
                            : "border-transparent text-white/45 hover:bg-white/[0.04] hover:text-white/80"
                        }`}
                      >
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/[0.05]"
                          style={{ color: selected ? section.accent : undefined }}
                        >
                          <Icon size={15} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-white/20">{String(index).padStart(2, "0")}</span>
                            <span className="text-xs font-black tracking-wide">{section.name}</span>
                          </div>
                          <p className="text-[10px] text-white/40 break-keep break-words">{section.subtitle}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-auto rounded-2xl border border-violet-400/10 bg-violet-400/[0.05] p-3 text-[10px] leading-relaxed text-white/35">
                  <Home size={13} className="mb-2 text-violet-300" />
                  어느 공간에서든 상단의 PRISM 버튼으로 홈에 돌아갈 수 있습니다.
                </div>
              </aside>

              <main className="min-w-0 flex-1 overflow-y-auto p-5 md:p-9 lg:p-11">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="mx-auto max-w-3xl"
                  >
                    <div className="mb-7 flex items-start gap-4 md:mb-9">
                      <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] border border-white/10 bg-white/[0.05] shadow-xl md:h-16 md:w-16"
                        style={{ color: activeSection.accent }}
                      >
                        <ActiveIcon size={27} />
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <span
                          className="mb-2 inline-flex rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em]"
                          style={{ color: activeSection.accent, borderColor: `${activeSection.accent}33`, backgroundColor: `${activeSection.accent}12` }}
                        >
                          {activeSection.tag}
                        </span>
                        <h3 className="text-2xl font-black tracking-tight text-white md:text-3xl">{activeSection.name}</h3>
                        <p className="mt-1 text-sm font-medium text-white/45">{activeSection.subtitle}</p>
                      </div>
                    </div>

                    <p className="mb-8 text-sm leading-7 text-white/68 md:text-[15px]">{activeSection.description}</p>

                    {isOverviewSection ? (
                      <>
                        <div className="space-y-6">
                          {usageBlocks.map((block, blockIndex) => (
                            <div
                              key={block.label}
                              className="rounded-[24px] border border-white/[0.07] bg-white/[0.02] p-5 md:p-6"
                            >
                              <div className="mb-4 flex items-center gap-2.5">
                                <div
                                  className="flex h-8 w-8 items-center justify-center rounded-xl border text-[11px] font-black"
                                  style={{
                                    color: activeSection.accent,
                                    borderColor: `${activeSection.accent}33`,
                                    backgroundColor: `${activeSection.accent}12`,
                                  }}
                                >
                                  {blockIndex + 1}
                                </div>
                                <h4
                                  className="text-xs font-black uppercase tracking-[0.2em]"
                                  style={{ color: activeSection.accent }}
                                >
                                  {block.label}
                                </h4>
                              </div>
                              <div className="space-y-3">
                                {block.items.map((item) => (
                                  <div
                                    key={item.title}
                                    className="rounded-2xl border border-white/[0.05] bg-black/20 p-4"
                                  >
                                    <p className="text-sm font-bold text-white/85">{item.title}</p>
                                    <p className="mt-1.5 text-xs leading-5 text-white/55">{item.body}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        <section className="mt-6 rounded-[24px] border border-white/[0.07] bg-white/[0.025] p-5 md:p-6">
                          <div className="mb-5 flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${activeSection.gradient}`} />
                            <h4 className="text-xs font-black uppercase tracking-[0.18em] text-white/75">빠른 시작 5단계</h4>
                          </div>
                          <div className="space-y-4">
                            {activeSection.steps.map((step, index) => (
                              <div key={step} className="flex items-start gap-3.5">
                                <span
                                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-black"
                                  style={{ color: activeSection.accent, borderColor: `${activeSection.accent}30`, backgroundColor: `${activeSection.accent}0d` }}
                                >
                                  {index + 1}
                                </span>
                                <p className="pt-1 text-xs leading-5 text-white/60 md:text-sm">{step}</p>
                              </div>
                            ))}
                          </div>
                        </section>

                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                          {[
                            { icon: Sun, label: "PROLOGUE", desc: "홈·에너지 허브" },
                            { icon: MessageCircle, label: "교감 채팅", desc: "공간별 AI 대화" },
                            { icon: Moon, label: "EPILOGUE", desc: "기록·회고" },
                          ].map((badge) => {
                            const BadgeIcon = badge.icon;
                            return (
                              <div
                                key={badge.label}
                                className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3"
                              >
                                <BadgeIcon size={16} className="shrink-0 text-violet-300" />
                                <div>
                                  <p className="text-[11px] font-bold text-white/75">{badge.label}</p>
                                  <p className="text-[10px] text-white/35">{badge.desc}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <section
                          className="mt-6 flex items-start gap-3 rounded-[20px] border p-4"
                          style={{ borderColor: `${activeSection.accent}22`, backgroundColor: `${activeSection.accent}09` }}
                        >
                          <Lightbulb size={17} className="mt-0.5 shrink-0" style={{ color: activeSection.accent }} />
                          <div>
                            <h4 className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/45">PRISM 활용 팁</h4>
                            <p className="text-xs leading-5 text-white/60">{activeSection.tip}</p>
                          </div>
                        </section>
                      </>
                    ) : isHighlightsSection ? (
                      <>
                        <div className="space-y-6">
                          {PRISM_HIGHLIGHT_GROUPS.map((group) => {
                            const GroupIcon = group.icon;
                            return (
                              <div
                                key={group.label}
                                className="rounded-[24px] border border-white/[0.07] bg-white/[0.02] p-5 md:p-6"
                              >
                                <div className="mb-4 flex items-center gap-2.5">
                                  <div
                                    className="flex h-8 w-8 items-center justify-center rounded-xl border"
                                    style={{
                                      color: group.accent,
                                      borderColor: `${group.accent}33`,
                                      backgroundColor: `${group.accent}12`,
                                    }}
                                  >
                                    <GroupIcon size={15} />
                                  </div>
                                  <h4
                                    className="text-xs font-black uppercase tracking-[0.2em]"
                                    style={{ color: group.accent }}
                                  >
                                    {group.label}
                                  </h4>
                                </div>
                                <div className="space-y-3">
                                  {group.items.map((item) => (
                                    <div
                                      key={item.title}
                                      className="rounded-2xl border border-white/[0.05] bg-black/20 p-4"
                                    >
                                      <p className="text-sm font-bold text-white/85">{item.title}</p>
                                      <p className="mt-1.5 text-xs leading-5 text-white/55">{item.body}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                          {[
                            { icon: MessageCircle, label: "가디언 대화", desc: "공간별 맞춤 톤" },
                            { icon: RefreshCw, label: "자동 동기화", desc: "PC·모바일 연동" },
                            { icon: Headphones, label: "주파수 명상", desc: "솔페지오·바이노럴" },
                          ].map((badge) => {
                            const BadgeIcon = badge.icon;
                            return (
                              <div
                                key={badge.label}
                                className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3"
                              >
                                <BadgeIcon size={16} className="shrink-0 text-violet-300" />
                                <div>
                                  <p className="text-[11px] font-bold text-white/75">{badge.label}</p>
                                  <p className="text-[10px] text-white/35">{badge.desc}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <section
                          className="mt-6 flex items-start gap-3 rounded-[20px] border p-4"
                          style={{ borderColor: `${activeSection.accent}22`, backgroundColor: `${activeSection.accent}09` }}
                        >
                          <Lightbulb size={17} className="mt-0.5 shrink-0" style={{ color: activeSection.accent }} />
                          <div>
                            <h4 className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/45">PRISM 활용 팁</h4>
                            <p className="text-xs leading-5 text-white/60">{activeSection.tip}</p>
                          </div>
                        </section>
                      </>
                    ) : (
                      <>
                        <section className="mb-5 rounded-[24px] border border-white/[0.07] bg-white/[0.025] p-5 md:p-6">
                          <div className="mb-5 flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${activeSection.gradient}`} />
                            <h4 className="text-xs font-black uppercase tracking-[0.18em] text-white/75">이렇게 시작하세요</h4>
                          </div>
                          <div className="space-y-4">
                            {activeSection.steps.map((step, index) => (
                              <div key={step} className="flex items-start gap-3.5">
                                <span
                                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-black"
                                  style={{ color: activeSection.accent, borderColor: `${activeSection.accent}30`, backgroundColor: `${activeSection.accent}0d` }}
                                >
                                  {index + 1}
                                </span>
                                <p className="pt-1 text-xs leading-5 text-white/60 md:text-sm">{step}</p>
                              </div>
                            ))}
                          </div>
                        </section>

                        <section
                          className="flex items-start gap-3 rounded-[20px] border p-4"
                          style={{ borderColor: `${activeSection.accent}22`, backgroundColor: `${activeSection.accent}09` }}
                        >
                          <Lightbulb size={17} className="mt-0.5 shrink-0" style={{ color: activeSection.accent }} />
                          <div>
                            <h4 className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/45">PRISM 활용 팁</h4>
                            <p className="text-xs leading-5 text-white/60">{activeSection.tip}</p>
                          </div>
                        </section>
                      </>
                    )}

                    <div className="mt-8 flex items-center justify-between border-t border-white/[0.06] pt-5">
                      <span className="text-[10px] font-mono text-white/25">{activeIndex + 1} / {GUIDE_SECTIONS.length}</span>
                      <button
                        type="button"
                        onClick={() => setActiveTab(nextSection.id)}
                        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2.5 text-xs font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
                      >
                        다음: {nextSection.name}
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </main>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

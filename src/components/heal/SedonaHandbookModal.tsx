import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Heart,
  BookOpen,
  Check,
  Compass,
  Sun,
  Eye,
  Feather,
  ChevronRight,
  ShieldCheck,
  Flame,
  Award,
  Radio,
  Smile,
  Zap,
  Wind,
} from 'lucide-react';
import { TTSButton } from '@/components/TTSButton';
import { RealBookModal, type BookChapterTab } from '@/components/RealBookModal';

export interface SedonaHandbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPractice?: (toolId: string, title: string, quote: string) => void;
  onConsult?: (text: string) => void;
}

const CHAPTER_TABS: BookChapterTab[] = [
  { id: 'processes', romanNumeral: 'Ⅰ', title: '5대 해방 실천 공식 (5 Releasing Processes)', shortLabel: '해방 공식' },
  { id: 'tools', romanNumeral: 'Ⅱ', title: '10가지 놓아버림 도구 (Sedona Tools)', shortLabel: '실천 도구' },
  { id: 'map', romanNumeral: 'Ⅲ', title: '데이비드 호킨스 의식 지도 (Consciousness Map)', shortLabel: '의식 지도' },
  { id: 'bible', romanNumeral: 'Ⅳ', title: 'AI 코칭 바이블 (Bible & Lucy 1:1)', shortLabel: '코칭 바이블' },
];

export const SEDONA_BIBLE_SECTIONS = [
  {
    id: 'four_questions',
    title: 'Classic 4 Questions · 세도나 4문답 릴리즈',
    principles: [
      "손에 쥔 펜을 가볍게 툭 떨어뜨리듯, 감정은 붙잡고 있던 손을 펴기만 하면 저절로 흘러갑니다.",
      "4문답: '허용할 수 있는가? 흘려보낼 수 있는가? 흘려보내겠는가? 언제?'",
      "‘아니오’라고 답해도 괜찮습니다. 저항 자체를 솔직히 인정할 때 릴리즈가 시작됩니다."
    ],
    steps: [
      "세도나 4문답(허용-가능-의지-시기)을 지금 내 불안에 적용하는 실전 코칭을 해줘",
      "질문에 '아니오(놓기 싫다)'라는 대답이 나올 때 어떻게 돌파해야 하는지 알려줘",
      "손에 쥔 펜을 떨어뜨리는 앵커링 명상법을 구체적으로 가이드해줘"
    ]
  },
  {
    id: 'hawkins_letting_go',
    title: 'Hawkins Somatic Scan · 호킨스 신체 전압과 항복',
    principles: [
      "감정에 생각의 꼬리표(분노, 억울함)를 떼어내고, 신체적 에너지 전압만을 판단 없이 응시하세요.",
      "감정을 바꾸거나 없애려 하지 않고 그대로 버틸 때 10~20분 내로 에너지가 스스로 방전됩니다.",
      "억압(Suppression), 표출(Expression), 도피(Escape)를 멈추고 온전히 항복(Surrender)하세요."
    ],
    steps: [
      "호킨스 박사의 '감정 라벨 떼기'와 '신체 전압 스캔' 실천법을 알려줘",
      "억압, 표출, 도피를 멈추고 감정 에너지에 온전히 머무는 비결은?",
      "저항(Resistance)의 2차 감정을 먼저 알아차리고 흘려보내는 테크닉을 설명해줘"
    ]
  },
  {
    id: 'three_wants',
    title: '3 Core Wants · 3대 근원적 욕구 해체',
    principles: [
      "모든 번뇌의 뿌리는 통제 욕구(Control), 인정 욕구(Approval), 안전 욕구(Security)입니다.",
      "욕구는 '내가 그것을 가지지 못했다'는 결핍의 착각에서 비롯됩니다.",
      "손을 펴 욕구를 흘려보낼 때 이미 내 안에 본래 충만한 자족과 평화가 드러납니다."
    ],
    steps: [
      "통제 욕구(Wanting Control)를 내려놓고 우주의 흐름에 내맡기는 법 가이드해줘",
      "인정/사랑 욕구(Wanting Approval)에서 벗어나 자족적인 평화를 얻는 법은?",
      "안전/생존 욕구(Wanting Security) 뒤에 숨은 죽음의 공포를 정화하는 비결은?"
    ]
  },
  {
    id: 'consciousness_map',
    title: 'Map of Consciousness · 의식 지도 사다리와 현존',
    principles: [
      "200 용기(Courage)는 파괴적 에너지에서 생산적 생명 에너지로 전환되는 영적 분기점입니다.",
      "350 수용(Acceptance)과 500 사랑(Love)에 머물 때 모든 치유와 기적이 상시화됩니다.",
      "홀리스틱 릴리즈(원함과 원치 않음을 번갈아 느끼기)를 통해 극성을 영구 중화하세요."
    ],
    steps: [
      "두려움(100)·분노(150)에서 용기(200)로 의식 주파수를 도약시키는 비결은?",
      "수용(350)과 사랑(500)의 상태를 일상에서 유지하는 3가지 습관을 알려줘",
      "홀리스틱 릴리즈(원함과 원치 않음을 번갈아 느끼기)를 쉽게 설명해줘"
    ]
  }
];

export const SEDONA_SACRED_PROCESSES = [
  {
    id: 'four_questions',
    stepNumber: 'PROCESS 1',
    titleKo: '세도나 4문답 릴리즈 (The 4 Classic Questions)',
    titleEn: 'Process 1: The Sedona 4 Basic Questions',
    author: 'Lester Levenson & Hale Dwoskin',
    quote: '"손에 쥔 펜을 가볍게 툭 떨어뜨리듯, 감정은 붙잡고 있던 손을 펴기만 하면 저절로 흘러갑니다."',
    quoteEn: '“Could you allow this feeling to be here? Could you let it go? Would you? When? — Right Now.” — Hale Dwoskin',
    desc: '감정은 당신 자신이 아니며, 단지 당신이 쥐고 있는 물건과 같습니다. 4가지 단순한 질문에 머리로 생각하지 않고 마음으로 답하면서 즉시 방하착(放下着)합니다.',
    steps: [
      { q: '1. "지금 이 느낌을 온전히 허용할 수 있나요?"', tip: '맞서 싸우거나 피하지 않고 그저 있는 그대로 마주합니다.' },
      { q: '2. "이 느낌을 흘려보낼 수 있나요?"', tip: '흘려보낼 능력이 내게 있음을 자각합니다. (예/아니오 모두 가능)' },
      { q: '3. "흘려보내시겠습니까?"', tip: '고통을 쥐고 있을지, 자유로워질지 선택합니다.' },
      { q: '4. "언제요? — 바로 지금!"', tip: '미루지 않고 지금 이 순간 손을 펴듯 감정을 놓아줍니다.' },
    ],
    rules: [
      '논리적으로 따지거나 분석하지 마세요. 느낌에 집중하며 즉각적으로 답하세요.',
      '‘아니오’라고 답해도 괜찮습니다. 놓아주기 싫다는 저항 자체를 인정할 때 릴리즈가 일어납니다.',
      '가슴이 가벼워지고 평온이 찾아올 때까지 4문답을 3~5회 반복하세요.',
    ],
    chantKo: `나는 지금 내 안의 억압된 긴장과 감정을 있는 그대로 환영합니다.
이 감정은 내가 아니며, 내가 붙들고 있던 에너지를 가볍게 손을 펴 흘려보냅니다.
지금 바로 이 순간, 모든 집착을 내려놓고 온전한 자유와 평온을 선택합니다.`,
    chantEn: `I allow this feeling to simply be. I choose to let it go right now. As I open my hand, all resistance drops away and peace fills my soul.`,
  },
  {
    id: 'hawkins_letting_go',
    stepNumber: 'PROCESS 2',
    titleKo: '데이비드 호킨스의 놓아버림 (David Hawkins Letting Go)',
    titleEn: 'Process 2: Surrendering the Energy Voltage',
    author: 'David R. Hawkins, M.D., Ph.D.',
    quote: '"감정에 이름을 붙이지 말고, 신체에서 느껴지는 에너지 전압을 판단 없이 그대로 버티며 흘려보내라."',
    quoteEn: '“Letting go involves being aware of a feeling, letting it come up, staying with it, and letting it run its course without wanting to make it different or do anything about it.” — David R. Hawkins',
    desc: '인간은 감정을 억압(Suppression), 표출(Expression), 도피(Escape)하며 에너지를 키웁니다. 호킨스 놓아버림은 감정의 라벨(분노, 슬픔)을 떼어내고 신체 감각을 있는 그대로 느끼며 에너지가 스스로 방전되도록 둡니다.',
    steps: [
      { q: '1단계: 감정의 이름 떼기', tip: '‘분노’, ‘두려움’이라는 생각의 꼬리표를 떼고 순수한 에너지로 바라봅니다.' },
      { q: '2단계: 신체 전압 관찰하기', tip: '가슴의 압박감, 목의 조임, 복부의 긴장감을 판단 없이 바라봅니다.' },
      { q: '3단계: 바꾸려 하지 않고 머물기', tip: '감정을 없애려 하지 않고 에너지가 완전히 소진될 때까지 함께 호흡합니다.' },
    ],
    rules: [
      '감정에 저항하지 않을 때, 아무리 격렬한 감정도 10~20분 내에 자연스럽게 힘을 잃습니다.',
      '부정적 에너지가 빠져나간 자리는 저절로 용기(200), 사랑(500), 평화(600)의 상위 의식으로 승화됩니다.',
      '생각에 휘말리지 말고 오직 ‘몸의 감각과 전압’에만 머무르세요.',
    ],
    chantKo: `나는 이 감정을 바꾸거나 없애려 하지 않고, 있는 그대로 바라보며 머뭅니다.
모든 판단과 저항을 내려놓을 때, 무의식의 묵은 전압이 스스로 빠져나갑니다.
어둠이 걷힌 자리에 본래 나의 신성한 빛과 평화가 찬란하게 차오릅니다.`,
    chantEn: `I surrender all resistance to this energy. I let it run its course without judgment. As the voltage clears, high-frequency peace and love naturally emerge.`,
  },
  {
    id: 'core_wants_release',
    stepNumber: 'PROCESS 3',
    titleKo: '3대 근원적 욕구 방하착 (Releasing the 3 Core Wants)',
    titleEn: 'Process 3: Releasing Control, Approval & Security',
    author: 'Lester Levenson',
    quote: '"우리가 겪는 모든 고통의 뿌리에는 통제 욕구, 인정 욕구, 안전 욕구라는 3가지 집착이 있다."',
    quoteEn: '“Beneath every negative emotion is the desire to control, the desire for approval, or the desire for security. Release the want, and you find the infinite source within.” — Lester Levenson',
    desc: '모든 불안과 분노의 배후에는 ‘통제하려는 욕구(Wanting Control)’, ‘인정받으려는 욕구(Wanting Approval)’, ‘안전해지려는 욕구(Wanting Security)’가 있습니다. 이 욕구를 놓아줄 때 우리는 우주의 무한한 공급과 하나가 됩니다.',
    steps: [
      { q: '통제 욕구 놓기', tip: '상황과 상대를 내 마음대로 조종하려는 긴장을 풀고 신뢰로 내맡깁니다.' },
      { q: '인정 욕구 놓기', tip: '타인의 칭찬과 사랑을 갈구하는 결핍을 내려놓고 이미 내 안에 사랑이 가득함을 자각합니다.' },
      { q: '생존/안전 욕구 놓기', tip: '미래에 대한 생존 공포를 내려놓고 불멸의 순수 의식에 안식합니다.' },
    ],
    rules: [
      '‘~을 원한다(Want)’는 것은 ‘지금 내게 그것이 없다’는 결핍을 우주에 선언하는 것입니다.',
      '원함을 내려놓을 때, 비로소 원하는 것이 자연스럽게 흘러들어옵니다.',
      '나는 이미 모든 것을 갖춘 온전한 존재(I am already whole)임을 기억하세요.',
    ],
    chantKo: `나는 통제하려는 욕심, 인정받으려는 결핍, 불안해하는 집착을 온전히 놓아버립니다.
결핍을 내려놓을 때 우주의 마르지 않는 무한한 사랑과 안전이 나를 감싸 안습니다.
나는 이미 온전하며, 참된 자유와 평온 속에 머뭅니다.`,
    chantEn: `I release the want for control, approval, and security. In surrendering all wants, I realize that I am already completely whole, safe, and eternally loved.`,
  },
];

export interface SedonaToolItem {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  category: 'sedona' | 'hawkins' | 'mindset';
  summary: string;
  howToPractice: string;
  hawkinsLevel: string;
  affirmation: string;
}

export const SEDONA_TOOLS_CATALOG: SedonaToolItem[] = [
  {
    id: 'dropping_the_pen',
    name: '펜 떨어뜨리기 (Dropping the Pen)',
    nameEn: 'The Pen Drop Releasing Metaphor',
    emoji: '🪶',
    category: 'sedona',
    summary: '손에 쥔 펜을 꽉 쥐고 있다가 손가락을 펴 툭 떨어뜨리듯 감정의 집착을 놓는 신체 앵커링',
    howToPractice: '실제 펜이나 주먹을 꽉 쥐어 긴장을 느낀 후, 손가락을 완전히 펴 펜을 바닥에 떨어뜨리며 가슴 속 감정도 함께 툭 놓아줍니다.',
    hawkinsLevel: '의식 도약: 중립 (250) · 놓아줌의 시작',
    affirmation: '나는 쥐고 있던 손을 펴고 모든 긴장과 고통을 가볍게 떨어뜨립니다.',
  },
  {
    id: 'diving_into_center',
    name: '감정의 핵으로 다이빙하기 (Diving In)',
    nameEn: 'Diving into the Center of Emotion',
    emoji: '🤿',
    category: 'sedona',
    summary: '두려운 감정의 외피를 뚫고 중심 핵(Core)으로 깊이 들어가 그것이 텅 빈 공간임을 확인하기',
    howToPractice: '가장 괴로운 감정의 중심부로 호흡과 함께 뛰어듭니다. 그 중심에는 아무런 실체가 없는 텅 빈 고요한 빛만이 있음을 알아차립니다.',
    hawkinsLevel: '의식 도약: 수용 (350) · 실체 없음의 자각',
    affirmation: '두려움의 중심을 들여다볼 때, 그곳에는 오직 맑고 고요한 평화만이 존재합니다.',
  },
  {
    id: 'open_both_doors',
    name: '마음의 양문 활짝 열기 (Opening Both Doors)',
    nameEn: 'Opening Front and Back Doors',
    emoji: '🚪',
    category: 'sedona',
    summary: '마음의 앞문과 뒷문을 열어 감정이 머물다 바람처럼 자연스럽게 통과해 나가도록 허용하기',
    howToPractice: '가슴의 앞문과 등 뒤의 뒷문을 활짝 여는 상상을 합니다. 억눌렸던 감정의 바람이 마음을 훑고 뒤로 빠져나가게 둡니다.',
    hawkinsLevel: '의식 도약: 자발성 (310) · 저항 없는 통과',
    affirmation: '마음의 문을 활짝 열어 모든 감정이 자유롭게 지나가도록 축복하며 보냅니다.',
  },
  {
    id: 'holistic_releasing',
    name: '홀리스틱 양극성 통합 (Holistic Releasing)',
    nameEn: 'Integrating the Opposites',
    emoji: '⚖️',
    category: 'sedona',
    summary: '‘원함(Want)’과 ‘원치 않음(Don’t Want)’의 양극단을 번갈아 느끼며 에고의 긴장을 영구 중화하기',
    howToPractice: '“나는 이것을 원한다”를 느끼고 릴리즈한 후, 곧바로 “나는 이것을 원치 않는다”를 느끼고 릴리즈하며 중립의 평정을 회복합니다.',
    hawkinsLevel: '의식 도약: 이성 & 지혜 (400) · 이원성 초월',
    affirmation: '양극단의 집착과 저항을 모두 놓아버리고 온전한 중용의 평온에 거합니다.',
  },
  {
    id: 'somatic_scan',
    name: '호킨스 신체 전압 스캔 (Somatic Voltage Scan)',
    nameEn: 'Hawkins Somatic Pressure Scan',
    emoji: '🧘',
    category: 'hawkins',
    summary: '생각을 멈추고 목, 가슴, 명치, 복부의 물리적 압력과 열감만을 묵묵히 관찰하기',
    howToPractice: '눈을 감고 머릿속 스토리를 끕니다. 가슴이 뛰거나 목이 조여오는 물리적 감각에만 10분간 호흡을 보내며 머뭅니다.',
    hawkinsLevel: '의식 도약: 용기 (200) · 직면의 힘',
    affirmation: '나는 생각의 소음을 끄고, 몸의 신성한 에너지가 정화되도록 고요히 지켜봅니다.',
  },
  {
    id: 'releasing_resistance',
    name: '저항 놓아주기 (Releasing Resistance)',
    nameEn: 'Surrendering Secondary Resistance',
    emoji: '🛡️',
    category: 'sedona',
    summary: '‘이 감정을 느끼기 싫다’, ‘왜 나한테 이런 일이’라는 2차 저항을 먼저 환영하고 흘려보내기',
    howToPractice: '“지금 느끼는 이 감정에 저항하고 있는 내 마음을 허용할 수 있는가?” 질문하며 저항의 껍질부터 먼저 벗겨냅니다.',
    hawkinsLevel: '의식 도약: 자발성 (310) · 저항의 항복',
    affirmation: '나는 저항하려는 습관을 내려놓고 일어나는 모든 것을 기꺼이 환영합니다.',
  },
  {
    id: 'surrendering_control',
    name: '통제욕 내려놓기 (Surrendering Control)',
    nameEn: 'Letting Go of the Need to Control',
    emoji: '🌊',
    category: 'sedona',
    summary: '결과와 사람을 내 뜻대로 쥐고 흔들려는 손아귀의 힘을 빼고 우주의 거대한 강물에 맡기기',
    howToPractice: '손잡이를 꽉 쥐고 있던 힘을 풀듯 어깨를 내리고 "우주여, 당신의 가장 완전한 흐름에 내맡깁니다"라고 선언합니다.',
    hawkinsLevel: '의식 도약: 평화 (600) · 내맡김의 기적',
    affirmation: '내가 억지로 통제하려 하지 않을 때, 온 우주의 지혜가 완벽하게 일하기 시작합니다.',
  },
  {
    id: 'loving_what_is',
    name: '있는 그대로 사랑하기 (Loving What Is)',
    nameEn: 'Unconditional Self-Acceptance',
    emoji: '💖',
    category: 'hawkins',
    summary: '불안해하거나 화를 내는 못난 나 자신까지도 어머니 같은 자비로운 사랑으로 꼭 안아주기',
    howToPractice: '가슴에 두 손을 얹고 "괴로워하는 너의 마음을 다 알아. 그래도 너는 존귀하고 사랑받아 마땅해"라고 속삭입니다.',
    hawkinsLevel: '의식 도약: 사랑 (500) · 무조건적 포용',
    affirmation: '나는 나의 모든 불완전함을 있는 그대로 깊이 사랑하고 품어 안습니다.',
  },
  {
    id: 'map_of_consciousness',
    name: '의식 지도 사다리 오르기 (Map Shift)',
    nameEn: 'Hawkins Map of Consciousness Shift',
    emoji: '🪜',
    category: 'hawkins',
    summary: '죄책감·수치심(20~30)에서 용기(200)와 사랑(500)으로 주파수를 의도적으로 전환하기',
    howToPractice: '현재 내 감정의 위치를 의식 지도에서 확인하고, 용기(‘내가 이 감정을 책임지겠다’)의 임계점을 넘어 사랑으로 도약합니다.',
    hawkinsLevel: '의식 도약: 200(용기) -> 540(기쁨)',
    affirmation: '나의 의식 주파수는 지금 이 순간 두려움에서 무한한 사랑과 기쁨으로 상승합니다.',
  },
  {
    id: 'abiding_in_the_self',
    name: '참나의 현존에 머물기 (Abiding in Self)',
    nameEn: 'Resting as the Witness Consciousness',
    emoji: '💫',
    category: 'mindset',
    summary: '지나가는 감정 구름에 휘둘리지 않고, 배경에 영원히 존재하는 맑은 하늘(순수 앎)로 머물기',
    howToPractice: '“감정을 지켜보는 나는 누구인가?” 묻고, 일체의 동요 없이 모든 것을 비추고 있는 고요한 참나에 안식합니다.',
    hawkinsLevel: '의식 도약: 깨달음 (700~1000) · 절대적 자유',
    affirmation: '나는 오고 가는 구름이 아니라, 영원히 맑고 고요한 순수한 하늘 그 자체입니다.',
  },
];

export const HAWKINS_CONSCIOUSNESS_LEVELS = [
  {
    level: '600+ 평화 & 깨달음 (Peace & Enlightenment)',
    desc: '모든 분리가 사라지고 주체와 객체가 하나 되는 지복(Bliss)의 상태. 일체의 고통이 사라진 순수 의식.',
    color: 'border-yellow-400/40 bg-yellow-500/10 text-yellow-300',
  },
  {
    level: '500+ 사랑 & 기쁨 (Love & Joy)',
    desc: '조건 없는 자비와 깊은 감사. 타인을 내 몸처럼 아끼며 치유와 기적이 저절로 일어나는 영역.',
    color: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-300',
  },
  {
    level: '350+ 수용 & 자발성 (Acceptance & Willingness)',
    desc: '세상을 탓하지 않고 책임을 온전히 받아들이며 삶에 기꺼이 유연하게 동조하는 조화의 상태.',
    color: 'border-teal-400/40 bg-teal-500/10 text-teal-300',
  },
  {
    level: '200+ 용기 (Courage) — 위대한 영적 분기점',
    desc: '피해자 의식을 벗어나 진정한 자기 주도성을 회복하는 생명 에너지의 전환점.',
    color: 'border-amber-400/40 bg-amber-500/10 text-amber-300',
  },
];

const SEDONA_AUDIOBOOK_NARRATIONS: Record<string, string> = {
  processes: `세도나 및 놓아버림 해방의 서, 제1장 4대 감정 릴리징 기법입니다.
첫째, 5대 흘려보내기 질문: 지금 이 느낌을 있는 그대로 허용할 수 있는가? 놓아줄 수 있는가? 놓아주겠는가? 언제? 바로 지금!
둘째, 감정의 다이빙 기법: 감정에 저항하지 않고 그 중심부로 호흡과 함께 뛰어드십시오. 감정은 그저 지나가는 에너지일 뿐입니다.
셋째, 3대 원초적 욕망 해체: 인정 욕구, 통제 욕구, 생존/안전 욕구를 쥔 손을 펴고 자연스러운 우주의 흐름에 맡기십시오.
넷째, 참나의 현존: 당신은 오고 가는 감정 구름이 아니라, 그것을 바라보는 영원히 맑고 고요한 하늘 그 자체입니다.`,
  tools: `제2장, 10가지 감정 해방 실천 도구입니다.
가슴 열기 호흡은 날숨과 함께 응어리진 가슴의 답답함을 우주로 방출하는 도구입니다.
호킨스 의식 지도는 두려움과 죄책감의 저주파수에서 용기와 사랑의 고주파수로 도약하는 내비게이션입니다.
튜브 방출 명상은 몸 전체를 빈 대나무 관으로 상상하여 감정을 즉시 흘려보내는 기법입니다.`,
  map: `제3장, 데이비드 호킨스 박사의 의식 지도 해설입니다.
200의 용기는 삶을 주도적으로 책임지는 위대한 영적 분기점입니다.
500의 사랑과 540의 무조건적인 기쁨에 도달할 때, 치유와 기적이 저절로 일어납니다.
일체의 저항을 항복하고 내려놓을 때 우리는 600 이상의 순수한 평화와 깨달음으로 들어갑니다.`,
  bible: `제4장, 세도나 릴리징 마스터 바이블입니다.
몸의 통증이나 만성적인 불안이 일어날 때마다 평가하거나 분석하지 말고, 그저 느낌 자체를 허용하고 놓아주세요.
놓아버릴수록 당신의 내면은 무한한 자유와 생명력으로 가득 차오릅니다.`
};

export function SedonaHandbookModal({
  isOpen,
  onClose,
  onSelectPractice,
  onConsult,
}: SedonaHandbookModalProps) {
  const [activeTab, setActiveTab] = useState<'processes' | 'tools' | 'map' | 'bible'>('processes');
  const [selectedProcessId, setSelectedProcessId] = useState<string>('four_questions');
  const [showEnglish, setShowEnglish] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'sedona' | 'hawkins' | 'mindset'>('all');
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const currentProcess = SEDONA_SACRED_PROCESSES.find((s) => s.id === selectedProcessId) || SEDONA_SACRED_PROCESSES[0];

  const filteredTools = SEDONA_TOOLS_CATALOG.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  const handleCopyProcess = () => {
    const textToCopy = `${currentProcess.titleKo} (${currentProcess.author})\n\n${currentProcess.quote}\n\n[실천 원칙]\n${currentProcess.rules.join('\n')}\n\n[선언문]\n${currentProcess.chantKo}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <RealBookModal
      isOpen={isOpen}
      onClose={onClose}
      theme="heal"
      bookTitle="세도나 & 놓아버림 해방의 서"
      bookSubtitle="5가지 해방 질문과 감정 항복의 마스터키"
      bookAuthor="Lester Levenson & David R. Hawkins"
      epigraphQuote="당신이 붙잡고 있는 감정은 진짜 당신이 아닙니다. 손을 펴고 그저 흘려보내세요. 자유가 거기에 있습니다."
      epigraphSource="Letting Go (놓아버림)"
      chapterTabs={CHAPTER_TABS}
      activeTabId={activeTab}
      onTabChange={(id) => setActiveTab(id as any)}
      footerPageNumber={`- Chapter ${activeTab === 'processes' ? 'Ⅰ' : activeTab === 'tools' ? 'Ⅱ' : activeTab === 'map' ? 'Ⅲ' : 'Ⅳ'} -`}
      audiobookNarrations={SEDONA_AUDIOBOOK_NARRATIONS}
      defaultVoice="Kore"
    >
            {/* TAB 1: PROCESSES */}
            {activeTab === 'processes' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SEDONA_SACRED_PROCESSES.map((proc) => {
                    const isSelected = selectedProcessId === proc.id;
                    return (
                      <button
                        key={proc.id}
                        type="button"
                        onClick={() => setSelectedProcessId(proc.id)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] text-white'
                            : 'bg-white/[0.02] border-white/5 hover:border-emerald-500/20 text-white/60 hover:text-white'
                        }`}
                      >
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                          {proc.stepNumber}
                        </span>
                        <p className="text-sm font-bold text-white font-sans">{proc.titleKo}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Active Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-black/50 border border-emerald-500/20 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-widest block">
                        {currentProcess.author} · Releasing Masterclass
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 font-sans">
                        {currentProcess.titleKo}
                      </h3>
                      <p className="text-xs text-white/50 mt-1 font-sans">{currentProcess.desc}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowEnglish(!showEnglish)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-emerald-300 font-sans cursor-pointer transition-all"
                      >
                        {showEnglish ? '한글만 보기' : '영문 원문 함께보기'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyProcess}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 hover:text-white font-sans cursor-pointer transition-all flex items-center gap-1"
                      >
                        {copiedText ? <Check size={14} className="text-emerald-400" /> : null}
                        <span>{copiedText ? '복사 완료' : '내용 복사'}</span>
                      </button>
                      <TTSButton
                        text={currentProcess.chantKo}
                        voice="Kore"
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-xs text-emerald-300 font-sans cursor-pointer transition-all"
                      />
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-sm font-serif italic text-emerald-200 leading-relaxed">
                      {currentProcess.quote}
                    </p>
                    {showEnglish && (
                      <p className="text-xs font-serif italic text-emerald-200/50 mt-1.5">
                        {currentProcess.quoteEn}
                      </p>
                    )}
                  </div>

                  {/* Step-by-Step Questions */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-400 block">
                      실천 진행 단계 (Step-by-Step Release)
                    </span>
                    <div className="grid grid-cols-1 gap-2.5">
                      {currentProcess.steps.map((step, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                          <p className="text-sm font-bold text-emerald-300 font-sans">{step.q}</p>
                          <p className="text-xs text-white/70 font-sans leading-relaxed">{step.tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rules */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-400 block">
                      핵심 주의점 & 팁 (Key Principles)
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {currentProcess.rules.map((rule, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/10 flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-xs text-white/80 font-sans leading-relaxed break-keep">
                            {rule}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chanting & Surrender Script */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-400 block">
                      방하착 및 내맡김 선언문 (Daily Surrender Script)
                    </span>
                    <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20">
                      <p className="text-sm sm:text-base text-emerald-100 font-serif leading-loose whitespace-pre-line tracking-wide">
                        {currentProcess.chantKo}
                      </p>
                      {showEnglish && (
                        <p className="text-xs text-emerald-200/50 font-serif italic leading-relaxed mt-3 pt-3 border-t border-white/5 whitespace-pre-line">
                          {currentProcess.chantEn}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: 10 TOOLS */}
            {activeTab === 'tools' && (
              <div className="space-y-6">
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
                      전체 ({SEDONA_TOOLS_CATALOG.length}개)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('sedona')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                        selectedCategory === 'sedona'
                          ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300'
                          : 'bg-white/5 border border-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      🪶 세도나 메서드 도구
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('hawkins')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                        selectedCategory === 'hawkins'
                          ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300'
                          : 'bg-white/5 border border-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      🧘 호킨스 놓아버림 도구
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('mindset')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                        selectedCategory === 'mindset'
                          ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300'
                          : 'bg-white/5 border border-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      💫 참나 & 현존 도구
                    </button>
                  </div>

                  <span className="text-[11px] text-white/40 font-sans">
                    도구를 누르면 데일리 세도나 방하착 명상으로 즉시 연결됩니다.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTools.map((tool) => (
                    <motion.div
                      key={tool.id}
                      whileHover={{ y: -3 }}
                      className="p-5 rounded-3xl bg-zinc-950/70 border border-emerald-500/20 hover:border-emerald-400/50 hover:bg-emerald-950/15 transition-all flex flex-col justify-between gap-4 group"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{tool.emoji}</span>
                          <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-emerald-300/70 group-hover:border-emerald-400/30 transition-colors">
                            {tool.category === 'sedona' ? 'Sedona Method' : tool.category === 'hawkins' ? 'Letting Go' : 'Presence'}
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

                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold uppercase text-emerald-400 font-mono block">
                              실천 방법
                            </span>
                            <TTSButton
                              text={`${tool.name}. ${tool.summary}. 실천 방법: ${tool.howToPractice}. ${tool.hawkinsLevel}. 실천 확언: ${tool.affirmation}`}
                              voice="Kore"
                              className="p-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs cursor-pointer"
                            />
                          </div>
                          <p className="text-[11px] text-emerald-100/80 font-sans leading-relaxed break-keep">
                            {tool.howToPractice}
                          </p>
                          <p className="text-[10px] text-emerald-300/60 font-mono pt-1 border-t border-white/5">
                            {tool.hawkinsLevel}
                          </p>
                        </div>
                      </div>

                      {onSelectPractice && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectPractice(tool.id, tool.name, tool.affirmation);
                            onClose();
                          }}
                          className="w-full py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-200 text-xs font-bold font-sans flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        >
                          <span>이 도구로 방하착 시작</span>
                          <ChevronRight size={14} />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: HAWKINS MAP & MANTRAS */}
            {activeTab === 'map' && (
              <div className="space-y-6">
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-black/70 to-teal-950/30 border border-emerald-500/30 space-y-6">
                  <div className="text-center space-y-2 max-w-xl mx-auto">
                    <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-widest">
                      David R. Hawkins · Map of Consciousness
                    </span>
                    <h3 className="text-2xl font-bold text-white font-sans">
                      호킨스 의식 지도와 의식장 도약
                    </h3>
                    <p className="text-xs text-white/60 font-sans">
                      감정을 억압하지 않고 흘려보낼 때, 당신의 의식 주파수는 저절로 상위 차원으로 도약합니다.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {HAWKINS_CONSCIOUSNESS_LEVELS.map((lvl, idx) => (
                      <div key={idx} className={`p-5 rounded-2xl border ${lvl.color} space-y-2 text-left`}>
                        <h4 className="text-sm font-bold font-sans">{lvl.level}</h4>
                        <p className="text-xs text-white/70 font-sans leading-relaxed break-keep">
                          {lvl.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5 Core Mantras */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                      <Wind size={20} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white font-sans">
                        세도나 & 호킨스 5대 일일 방하착 만트라
                      </h4>
                      <p className="text-xs text-white/40 font-mono">
                        Sedona Method & Letting Go Affirmations
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    {[
                      '1. "나는 지금 이 느낌을 판단 없이 온전히 허용하고, 가볍게 손을 펴 흘려보냅니다."',
                      '2. "이 감정은 내가 아니며, 지나가는 에너지의 물결일 뿐입니다."',
                      '3. "내가 통제하려는 욕심을 내려놓을 때 온 우주가 가장 완벽하게 돕습니다."',
                      '4. "저항을 멈출 때, 내 안의 무한한 평화와 사랑이 저절로 차오릅니다."',
                      '5. "모든 집착이 스러진 이 고요한 자리가 나의 영원한 본향입니다."',
                    ].map((mantra, i) => (
                      <div key={i} className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/10 text-xs sm:text-sm text-emerald-100 font-sans flex items-center justify-between">
                        <span>{mantra}</span>
                        <TTSButton text={mantra} voice="Kore" className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-300" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: BIBLE (AI COACHING QUESTIONS) */}
            {activeTab === 'bible' && (
              <div className="space-y-6">
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-black/70 to-teal-950/30 border border-emerald-500/30 space-y-4 text-left">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-widest">
                      Sedona &amp; Hawkins Releasing Bible
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-sans">
                      세도나메서드 &amp; 놓아버림 AI 방하착 질문 가이드
                    </h3>
                    <p className="text-xs text-white/60 font-sans leading-relaxed">
                      궁금한 릴리즈 질문을 클릭하면 루시(AI)와 1:1 심층 상담이 즉시 시작됩니다.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SEDONA_BIBLE_SECTIONS.map((section) => (
                    <div
                      key={section.id}
                      className="p-6 rounded-3xl bg-zinc-950/70 border border-emerald-500/20 space-y-4 text-left flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                            <Sparkles size={16} />
                          </div>
                          <h4 className="text-sm font-bold text-white font-sans">
                            {section.title}
                          </h4>
                        </div>

                        <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                          <span className="text-[9px] font-mono font-bold uppercase text-emerald-400 block">
                            핵심 원리
                          </span>
                          <ul className="space-y-1">
                            {section.principles.map((pr, i) => (
                              <li key={i} className="text-[11px] text-white/70 font-sans leading-relaxed flex items-start gap-1.5">
                                <span className="text-emerald-400 font-bold">•</span>
                                <span>{pr}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <span className="text-[9px] font-mono font-bold uppercase text-emerald-400 block">
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
                            className="w-full p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-left text-[11px] text-emerald-200 hover:text-white font-sans flex items-center justify-between gap-2 transition-all cursor-pointer group"
                          >
                            <span className="leading-snug break-keep">{step}</span>
                            <ChevronRight size={14} className="shrink-0 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
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

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
  KeyRound,
  Gift,
  Feather,
  ChevronRight,
  Gem,
  DollarSign,
  PenTool,
  Smile,
  ShieldCheck,
} from 'lucide-react';
import { TTSButton } from '@/components/TTSButton';
import { RealBookModal, type BookChapterTab } from '@/components/RealBookModal';

export interface SecretHandbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool?: (toolId: string, toolName: string, suggestedWish?: string) => void;
  onConsult?: (text: string) => void;
}

const CHAPTER_TABS: BookChapterTab[] = [
  { id: 'creation', romanNumeral: 'Ⅰ', title: '3단계 창조 공식 (Ask · Believe · Receive)', shortLabel: '창조 공식' },
  { id: 'tools', romanNumeral: 'Ⅱ', title: '10가지 시크릿 실천 도구 (Secret Tools)', shortLabel: '실천 도구' },
  { id: 'philosophy', romanNumeral: 'Ⅲ', title: '우주 4대 절대 법칙 (Universal Laws)', shortLabel: '우주 법칙' },
  { id: 'bible', romanNumeral: 'Ⅳ', title: 'AI 코칭 바이블 (Bible & Lucy 1:1)', shortLabel: '코칭 바이블' },
];

export const SECRET_BIBLE_SECTIONS = [
  {
    id: 'ask',
    title: 'Ask · 명확한 요청',
    principles: [
      "우주는 모호한 생각에는 응답하지 않습니다. 원하는 것을 종이에 적고 명확히 선언하세요.",
      "‘원하지 않는 것’이 아닌 ‘오직 원하는 것’에만 주의를 집중하세요.",
      "이미 이루어졌다는 현재완료형으로 감사를 표하세요."
    ],
    steps: [
      "끌어당김을 시작할 때 소원을 어떤 문장과 시제로 작성해야 가장 강력한지 알려줘",
      "소원을 요청하고 나서 자꾸 의심이 생길 때 대처하는 법을 설명해줘",
      "부정적인 생각이나 결핍감이 떠오를 때 주파수를 즉시 전환하는 팁을 줘"
    ]
  },
  {
    id: 'believe',
    title: 'Believe · 흔들림 없는 믿음',
    principles: [
      "물리적 눈앞에 보이기 전에 영적 차원에서 이미 완성되었음을 아는 것입니다.",
      "‘어떻게(How)’ 이루어질지는 우주의 몫이므로 당신이 통제하려 하지 마세요.",
      "의심과 불안이 올라올 때는 즉시 감사의 마음으로 주파수를 전환하세요."
    ],
    steps: [
      "소원이 아직 눈앞에 보이지 않아도 '이미 받았다'고 느끼는 구체적인 방법은?",
      "주변 사람들의 부정적인 말에 흔들리지 않고 믿음을 지키는 법 알려줘",
      "소원의 크기(작은 돈 vs 큰 꿈)에 따라 우주의 응답 시간에 차이가 있는지 설명해줘"
    ]
  },
  {
    id: 'receive',
    title: 'Receive · 감사의 수신',
    principles: [
      "소원이 실제로 이루어졌을 때 느낄 벅찬 감격과 환희를 지금 미리 느끼세요.",
      "감사는 받는 주파수에 접속하는 가장 빠르고 강력한 열쇠입니다.",
      "내면의 영감이 떠오를 때 가벼운 마음으로 기쁘게 즉각 행동하세요."
    ],
    steps: [
      "감사의 돌(Magic Rock)을 침대 머리맡에 두고 매일 밤 실천하는 법 가이드해줘",
      "소원이 이루어졌을 때의 감정을 '지금 미리 느끼는' 심상화 기법을 알려줘",
      "영감에 의한 직관적 행동(Inspired Action)과 억지 노력의 차이는 무엇인가요?"
    ]
  },
  {
    id: 'frequency',
    title: 'Frequency & Shifters · 주파수 조율과 저항 해소',
    principles: [
      "기분이 안 좋을 때는 좋아하는 음악이나 자연을 바라보며 시크릿 시프터를 발동하세요.",
      "부와 성공에 대한 무의식의 죄책감이나 저항을 사랑으로 녹여내세요.",
      "비전보드(Vision Board)를 통해 매일 시각적 자극으로 잠재의식을 프로그래밍하세요."
    ],
    steps: [
      "기분이 안 좋을 때 즉각 주파수를 끌어올리는 1분 시크릿 시프터 기술은?",
      "돈과 풍요에 대한 무의식의 무거운 저항을 푸는 확언 5가지를 추천해줘",
      "비전보드를 가장 효과적으로 배치하고 시각화하는 꿀팁을 줘"
    ]
  }
];

export const CREATIVE_PROCESS_STEPS = [
  {
    id: 'ask',
    stepNumber: 'STEP 1',
    titleKo: 'Ask · 구하라 (명확한 우주적 요청)',
    titleEn: 'Step 1: Ask the Universe',
    quote: '"당신이 진정으로 원하는 것이 무엇인지 명확하게 우주에 선언하라."',
    quoteEn: '“You must become clear about what you want. As you think about what you want, you are asking for it.” — Rhonda Byrne',
    desc: '우주는 모호한 생각에는 응답하지 않습니다. 마치 우주 카탈로그에서 원하는 상품을 고르듯, 원하는 것을 명확하고 구체적으로 종이에 적고 선언하세요.',
    rules: [
      '‘원하지 않는 것(빚, 질병, 외로움)’이 아닌 ‘오직 원하는 것(풍요, 활력, 사랑)’에만 집중하세요.',
      '‘~하고 싶다’는 결핍의 언어 대신 ‘지금 나는 ~해서 너무나 행복하고 감사하다’라는 현재완료형으로 요청하세요.',
      '한 번 명확하게 요청했다면 우주가 접수했음을 신뢰하고 더 이상 조급해하지 마세요.',
    ],
    chantKo: `우주여, 나는 지금 온전한 풍요와 사랑, 그리고 기적 같은 소원 성취 속에 존재합니다.
내가 바라는 모든 이상적인 현실이 가장 완벽하고 조화로운 방식으로 지금 내게 흘러들어오고 있음에 깊이 감사합니다.
나의 생각과 주파수가 우주의 풍요와 하나로 일치되었습니다.`,
    chantEn: `Thank you, Universe, for bringing all the abundance, joy, and manifestation into my life right now. My desire is already accomplished, and I receive it with deep gratitude.`,
  },
  {
    id: 'believe',
    stepNumber: 'STEP 2',
    titleKo: 'Believe · 믿으라 (흔들림 없는 확신)',
    titleEn: 'Step 2: Believe It Is Yours',
    quote: '"그것이 이미 당신의 것이라고 믿어라. 흔들리지 않는 믿음이 보이지 않는 것을 보이게 만든다."',
    quoteEn: '“You must believe that you have received. You must know that what you want is yours the moment you ask it.” — Rhonda Byrne',
    desc: '믿음이란 소원이 물리적 눈앞에 보이기 전에 이미 영적 차원에서 완성되었음을 아는 것입니다. ‘어떻게(How)’ 이루어질지는 우주의 몫이므로 당신이 통제하려 하지 마세요.',
    rules: [
      '결과가 어떻게 나타날지 고민하지 마세요. 방법(How)은 우주가 가장 경이로운 길로 찾아옵니다.',
      '의심이나 불안이 올라올 때는 즉시 감사의 마음으로 주파수를 전환하세요.',
      '이미 소원이 이루어진 사람처럼 안도감과 여유로운 마음으로 일상을 살아가세요.',
    ],
    chantKo: `나는 이미 받았음을 온 마음으로 믿습니다.
눈에 보이지 않더라도 우주의 완벽한 보이지 않는 손이 나를 위해 일하고 있음을 확신합니다.
의심과 조급함을 완전히 내려놓고, 이미 이루어진 평온한 확신 속에 머뭅니다.`,
    chantEn: `I have complete faith and unwavering belief. It is already done in the universe, and I rest peacefully in knowing that it is mine.`,
  },
  {
    id: 'receive',
    stepNumber: 'STEP 3',
    titleKo: 'Receive · 받으라 (감정의 주파수 일치)',
    titleEn: 'Step 3: Receive with Joy',
    quote: '"그것을 받았을 때 느낄 기쁨과 감사를 ‘지금 이 순간’ 미리 느껴라."',
    quoteEn: '“Feel wonderful now. When you feel good, you are on the frequency of receiving.” — Rhonda Byrne',
    desc: '받아들임(Receive)의 핵심은 기분 좋은 감정(Good Feelings)입니다. 소원이 실제로 이루어졌을 때 느낄 벅찬 감격, 환희, 안도감을 지금 느끼면 당신은 받는 주파수에 즉시 맞춰집니다.',
    rules: [
      '기분이 좋아지는 모든 것을 하세요. 좋은 음악, 산책, 따뜻한 차, 사랑하는 사람과의 대화.',
      '감사는 받는 주파수에 접속하는 가장 빠르고 강력한 열쇠입니다.',
      '내면의 영감(Inspiration)이 떠오를 때 가벼운 마음으로 기쁘게 즉각 행동하세요.',
    ],
    chantKo: `나는 지금 우주가 주는 모든 축복과 선물을 기쁘게 받아들입니다.
가슴 가득 차오르는 벅찬 감사와 행복감이 온몸의 세포마다 울려 퍼집니다.
좋은 기분이 더 큰 기적을 부르고, 나는 온 우주의 풍요와 사랑을 누립니다.`,
    chantEn: `I am receiving all the boundless blessings of the universe with an open, joyful heart. I feel amazing now, and more good things flow to me endlessly.`,
  },
];

export interface SecretToolItem {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  category: 'core' | 'daily' | 'mindset';
  summary: string;
  howToPractice: string;
  quote: string;
  suggestedWish: string;
}

export const SECRET_TOOLS_CATALOG: SecretToolItem[] = [
  {
    id: 'magic_rock',
    name: '감사의 돌 (The Magic Rock)',
    nameEn: 'The Magic Rock',
    emoji: '💎',
    category: 'daily',
    summary: '매일 밤 잠들기 전 돌을 쥐고 오늘 일어난 최고의 일에 감사하며 잠드는 마법의 습관',
    howToPractice: '침대 머리맡에 작은 돌을 두고, 잠들기 직전 손에 쥐며 오늘 일어난 가장 감사한 일 1가지를 떠올리고 "감사합니다"를 속삭입니다.',
    quote: '“매일 밤 감사의 돌을 쥐고 잠드는 것은 당신의 잠재의식을 가장 높은 풍요의 주파수로 밤새 채우는 방법이다.” — 『더 매직』',
    suggestedWish: '오늘 하루 나를 스쳐 간 모든 은혜와 내일 찾아올 기적 같은 행운에 감사합니다.',
  },
  {
    id: 'magic_check',
    name: '우주 백지수표 (The Magic Check)',
    nameEn: 'The Universe Magic Check',
    emoji: '💵',
    category: 'core',
    summary: '우주 은행으로부터 내가 원하는 금액을 지급받는 상징적 수표를 발행하고 마음에 각인하기',
    howToPractice: '원하는 금액과 날짜, 이름을 적은 수표를 눈에 잘 띄는 곳에 두고, 그 돈을 받아 감사하게 사용하는 장면을 생생히 상상합니다.',
    quote: '“당신이 원하는 금액을 우주에 요청하고 이미 지급받은 것처럼 느끼세요. 돈은 기쁨을 따릅니다.” — 론다 번',
    suggestedWish: '나에게 필요한 모든 재정적 풍요와 뜻밖의 풍성한 수익이 막힘없이 흘러들어옵니다.',
  },
  {
    id: 'sixty_eight_sec',
    name: '68초 순수 시각화 (68-Sec Visualization)',
    nameEn: '68-Second Pure Focus',
    emoji: '🔮',
    category: 'core',
    summary: '17초의 순수한 집중이 1배의 인력을 만들고, 68초가 지속되면 물리적 창조의 문이 열립니다.',
    howToPractice: '아무런 저항이나 딴생각 없이 오직 소원이 완벽히 이루어진 장면과 벅찬 감정에 68초간 깊이 몰입합니다.',
    quote: '“17초 동안 순수하게 원하는 것에 집중하면 끌어당김이 시작되고, 68초를 유지하면 현실 창조가 폭발합니다.”',
    suggestedWish: '내가 소망하던 꿈이 현실이 되어 온몸에 소름 돋는 전율과 감사가 차오릅니다.',
  },
  {
    id: 'mirror_affirmation',
    name: '거울 확언 & 셀프 러브',
    nameEn: 'Mirror Affirmation & Self-Love',
    emoji: '🪞',
    category: 'mindset',
    summary: '매일 거울을 보며 내 눈을 바라보고 무조건적인 사랑과 소원 성취 자격을 선언하기',
    howToPractice: '거울 속 자신의 눈동자를 따뜻하게 바라보며 "너는 사랑받을 자격이 충분해. 너의 모든 소원은 이미 이루어졌어"라고 미소 짓습니다.',
    quote: '“당신 자신을 먼저 사랑하지 않으면 그 어떤 풍요도 당신 곁에 머물 수 없습니다. 거울 속 자신과 화해하세요.”',
    suggestedWish: '나는 나 자신을 온전히 사랑하며, 온 우주의 무한한 축복을 온몸으로 누릴 자격이 있습니다.',
  },
  {
    id: 'scripting_journal',
    name: '매직 스크립팅 (Scripting Journal)',
    nameEn: 'Scripting Your Dream Reality',
    emoji: '📜',
    category: 'daily',
    summary: '소원이 이미 완벽하게 이루어진 미래의 하루를 마치 오늘 있었던 일처럼 일기로 기록하기',
    howToPractice: '오늘 아침 눈을 떠서 소원 성취 소식을 듣고 사람들과 축하를 나누는 하루의 일과를 생생한 소설처럼 써 내려갑니다.',
    quote: '“글로 쓰인 소원은 우주에 보내는 가장 명확하고 구체적인 설계도입니다.”',
    suggestedWish: '내 인생 최고의 목표가 완벽하게 달성되어 기쁨의 눈물과 감격을 일기장에 기록합니다.',
  },
  {
    id: 'vision_board',
    name: '비전 보드 (Dream Vision Board)',
    nameEn: 'Manifestation Vision Board',
    emoji: '🖼️',
    category: 'core',
    summary: '원하는 꿈과 삶의 모습을 담은 시각적 이미지를 배치하여 뇌의 망상활성계(RAS)를 자극하기',
    howToPractice: '원하는 집, 자동차, 여행지, 건강한 몸매의 사진을 모아두고 매일 아침저녁으로 바라보며 설렘을 느낍니다.',
    quote: '“비전 보드를 보고 느낀 감정은 뇌로 하여금 이미 그것을 경험한 것으로 착각하게 만듭니다.”',
    suggestedWish: '내가 꿈꾸던 모든 라이프스타일과 이상적인 환경이 마법처럼 내 눈앞에 펼쳐집니다.',
  },
  {
    id: 'magic_dust',
    name: '마법의 가루 (The Magic Dust)',
    nameEn: 'Sprinkling Magic Dust',
    emoji: '✨',
    category: 'mindset',
    summary: '마주치는 모든 사람, 상점 직원, 가족에게 마음속으로 감사의 반짝이는 가루를 뿌려 축복하기',
    howToPractice: '나를 도와주는 버스 기사, 카페 직원, 택배 기사님을 볼 때 마음속으로 빛나는 마법 가루를 뿌리며 진심으로 감사를 전합니다.',
    quote: '“타인에게 베푼 감사는 고스란히 100배가 되어 당신의 삶으로 되돌아옵니다.” — 『더 매직』',
    suggestedWish: '오늘 내가 마주치는 모든 인연에게 평화와 행운을 전하며, 내 삶에도 풍요의 복이 넘칩니다.',
  },
  {
    id: 'secret_shifters',
    name: '기분 전환 장치 (Secret Shifters)',
    nameEn: 'Secret Frequency Shifters',
    emoji: '🌈',
    category: 'daily',
    summary: '주파수가 떨어지고 불안할 때 5분 만에 기분을 끌어올리는 나만의 마법 트리거 목록',
    howToPractice: '좋아하는 음악, 귀여운 반려동물 영상, 가장 행복했던 여행 추억 사진을 미리 준비해두고 우울할 때 즉시 꺼내 봅니다.',
    quote: '“부정적인 생각이 떠오를 때 탓하지 마세요. 그저 시크릿 전환 장치를 켜서 주파수 채널을 바꾸면 됩니다.”',
    suggestedWish: '어떤 상황에서도 나는 순식간에 기쁨과 감사의 최고 주파수로 되돌아옵니다.',
  },
  {
    id: 'acting_as_if',
    name: '이미 이루어진 것처럼 살기 (Acting As If)',
    nameEn: 'Live as if Your Wish is Fulfilled',
    emoji: '👑',
    category: 'core',
    summary: '소원이 이미 성취된 미래의 내 모습처럼 당당한 걸음걸이, 여유로운 표정, 기품 있는 말투로 오늘을 살기',
    howToPractice: '원하던 목표를 이미 이룬 성공한 사람이라면 지금 이 순간 어떤 표정을 짓고 어떻게 걸을지 상상하며 그대로 행동합니다.',
    quote: '“당신의 태도와 행동이 이미 이루어진 미래와 일치할 때 현실은 그 속도를 따라잡습니다.”',
    suggestedWish: '나는 이미 모든 것을 갖춘 사람의 여유와 품격으로 당당하고 평온하게 살아갑니다.',
  },
  {
    id: 'universal_abundance',
    name: '우주 무한 풍요 명상 (Abundance Flow)',
    nameEn: 'Universal Infinite Abundance',
    emoji: '💫',
    category: 'mindset',
    summary: '통장 잔고의 두려움을 지우고 우주의 마르지 않는 무한한 공급망에 온전히 연결되는 명상',
    howToPractice: '눈을 감고 우주 전체가 끝없는 빛과 에너지의 바다이며, 나 역시 그 풍요의 바다에 뜬 물방울임을 자각합니다.',
    quote: '“풍요는 우주의 본성입니다. 당신이 부족함을 느끼는 유일한 이유는 스스로 밸브를 잠갔기 때문입니다.”',
    suggestedWish: '우주의 무한한 공급 통로가 활짝 열려 필요한 모든 자원과 도움이 물밀듯이 채워집니다.',
  },
];

export const SECRET_PHILOSOPHY_RULES = [
  {
    title: '1. 생각은 현실이 된다 (Thoughts Become Things)',
    desc: '우리가 가장 많이 품는 지배적인 생각이 곧 자석이 되어 그와 똑같은 현실 사건과 인연을 끌어당깁니다.',
    tag: '기본 법칙',
  },
  {
    title: '2. 좋은 기분이 최고의 자석이다 (Good Feelings First)',
    desc: '원하는 것이 있어서 행복해지는 것이 아니라, 지금 먼저 행복하고 감사할 때 원하는 것이 저절로 끌려옵니다.',
    tag: '주파수의 비밀',
  },
  {
    title: '3. 감사는 기적을 두 배로 만든다 (Gratitude is the Multiplier)',
    desc: '이미 가진 것에 진심으로 감사하는 사람은 더 많은 것을 받게 되고, 불평하는 사람은 가진 것마저 잃게 됩니다.',
    tag: '마법의 공식',
  },
  {
    title: '4. 저항하지 말고 흘려보내라 (Release All Resistance)',
    desc: '‘어떻게 이루어질까? 안 되면 어쩌지?’라는 두려움과 집착을 내려놓고 우주의 완벽한 타이밍을 신뢰하세요.',
    tag: '맡김의 기술',
  },
];

const SECRET_AUDIOBOOK_NARRATIONS: Record<string, string> = {
  creation: `시크릿 황금 필사본, 제1장 우주 3대 창조 공식입니다.
1단계, 구하라 (Ask): 당신이 진정으로 원하는 것이 무엇인지 명확하게 우주에 선언하세요. 이미 이루어진 것처럼 구체적으로 그리십시오.
2단계, 믿으라 (Believe): 의심과 불안은 결핍을 끌어당깁니다. 소망이 이미 이루어졌다는 절대적인 확신을 품으세요. 어떻게 이루어질지는 우주의 몫입니다.
3단계, 받으라 (Receive): 소망이 현실에 나타났을 때 느낄 벅찬 감동과 감사의 주파수에 지금 당장 자신을 일치시키십시오. 기분 좋은 상태를 유지하는 것이 최고의 수신 상태입니다.`,
  tools: `제2장, 10가지 끌어당김 실천 도구입니다.
첫 번째, 감사 바위는 주머니에 작은 돌을 넣고 만질 때마다 감사의 에너지를 발산하는 도구입니다.
두 번째, 68초 순수 시각화는 아무런 저항 없이 68초간 소원의 완벽한 성취에 몰입하여 물리적 창조를 폭발시키는 기법입니다.
세 번째, 비전 보드는 원하는 삶의 이미지를 시각화하여 뇌의 망상활성계를 강력하게 자극합니다.
네 번째, 매직 스크립팅은 소원이 이미 이루어진 미래의 하루를 일기처럼 기록하여 우주에 청사진을 보내는 방법입니다.`,
  philosophy: `제3장, 시크릿 철학과 부의 마인드셋입니다.
우주는 당신의 생각과 감정에 공명하여 정확히 같은 주파수의 현실을 배달합니다.
결핍과 불평에 집중하면 더 많은 결핍이 찾아오고, 풍요와 감사에 집중하면 무한한 번영이 흘러들어옵니다.
당신은 자신의 현실을 창조하는 살아있는 자석입니다.`,
  bible: `제4장, 시크릿 Q&A 및 실천 바이블입니다.
의심이 들 때는 즉시 기분 전환 장치를 활용하여 기분을 바꾸세요.
좋아하는 음악을 듣거나 자연을 바라볼 때 주파수는 즉시 상승합니다.
결과의 방법에 집착하지 말고, 이미 이루어진 기쁨 속에 머무르십시오.`
};

export function SecretHandbookModal({
  isOpen,
  onClose,
  onSelectTool,
  onConsult,
}: SecretHandbookModalProps) {
  const [activeTab, setActiveTab] = useState<'creation' | 'tools' | 'philosophy' | 'bible'>('creation');
  const [selectedStepId, setSelectedStepId] = useState<string>('ask');
  const [showEnglish, setShowEnglish] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'core' | 'daily' | 'mindset'>('all');
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const currentStep = CREATIVE_PROCESS_STEPS.find((s) => s.id === selectedStepId) || CREATIVE_PROCESS_STEPS[0];

  const filteredTools = SECRET_TOOLS_CATALOG.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  const handleCopyProcess = () => {
    const textToCopy = `${currentStep.titleKo}\n\n${currentStep.quote}\n\n[실천 원칙]\n${currentStep.rules.join('\n')}\n\n[확언 선언문]\n${currentStep.chantKo}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <RealBookModal
      isOpen={isOpen}
      onClose={onClose}
      theme="orange"
      bookTitle="시크릿 황금 필사본"
      bookSubtitle="우주 3대 창조 공식과 10가지 끌어당김 비전"
      bookAuthor="Rhonda Byrne (론다 번)"
      epigraphQuote="우주가 당신의 생각에 응답하는 방식은 알라딘의 요술램프 지니와 같습니다. '당신의 소원이 곧 나의 명령입니다.'"
      epigraphSource="The Secret (시크릿)"
      chapterTabs={CHAPTER_TABS}
      activeTabId={activeTab}
      onTabChange={(id) => setActiveTab(id as any)}
      footerPageNumber={`- Chapter ${activeTab === 'creation' ? 'Ⅰ' : activeTab === 'tools' ? 'Ⅱ' : activeTab === 'philosophy' ? 'Ⅲ' : 'Ⅳ'} -`}
      audiobookNarrations={SECRET_AUDIOBOOK_NARRATIONS}
      defaultVoice="Kore"
    >
            {/* TAB 1: CREATION PROCESS */}
            {activeTab === 'creation' && (
              <div className="space-y-6">
                {/* Steps Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {CREATIVE_PROCESS_STEPS.map((step) => {
                    const isSelected = selectedStepId === step.id;
                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => setSelectedStepId(step.id)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.15)] text-white'
                            : 'bg-white/[0.02] border-white/5 hover:border-amber-500/20 text-white/60 hover:text-white'
                        }`}
                      >
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block mb-1">
                          {step.stepNumber}
                        </span>
                        <p className="text-sm font-bold text-white font-sans">{step.titleKo}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Active Step Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-black/50 border border-amber-500/20 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-widest block">
                        Rhonda Byrne · The Creative Process
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 font-sans">
                        {currentStep.titleKo}
                      </h3>
                      <p className="text-xs text-white/50 mt-1 font-sans">{currentStep.desc}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowEnglish(!showEnglish)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-amber-300 font-sans cursor-pointer transition-all"
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
                        text={currentStep.chantKo}
                        voice="Kore"
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 text-xs text-amber-300 font-sans cursor-pointer transition-all"
                      />
                    </div>
                  </div>

                  {/* Quote Banner */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-sm font-serif italic text-amber-200 leading-relaxed">
                      {currentStep.quote}
                    </p>
                    {showEnglish && (
                      <p className="text-xs font-serif italic text-amber-200/50 mt-1.5">
                        {currentStep.quoteEn}
                      </p>
                    )}
                  </div>

                  {/* Practical Rules */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold font-mono uppercase tracking-wider text-amber-400 block">
                      핵심 실천 원칙 (Secret Principles)
                    </span>
                    <div className="grid grid-cols-1 gap-2.5">
                      {currentStep.rules.map((rule, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-xs text-white/80 font-sans leading-relaxed break-keep">
                            {rule}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chanting / Affirmation Script */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold font-mono uppercase tracking-wider text-amber-400 block">
                      우주를 향한 선언문 (Daily Manifestation Script)
                    </span>
                    <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/20">
                      <p className="text-sm sm:text-base text-amber-100 font-serif leading-loose whitespace-pre-line tracking-wide">
                        {currentStep.chantKo}
                      </p>
                      {showEnglish && (
                        <p className="text-xs text-amber-200/50 font-serif italic leading-relaxed mt-3 pt-3 border-t border-white/5 whitespace-pre-line">
                          {currentStep.chantEn}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: 10 SECRET TOOLS */}
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
                          ? 'bg-amber-500/20 border border-amber-400/40 text-amber-300'
                          : 'bg-white/5 border border-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      전체 ({SECRET_TOOLS_CATALOG.length}개)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('core')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                        selectedCategory === 'core'
                          ? 'bg-amber-500/20 border border-amber-400/40 text-amber-300'
                          : 'bg-white/5 border border-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      🔮 핵심 끌어당김 도구
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('daily')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                        selectedCategory === 'daily'
                          ? 'bg-amber-500/20 border border-amber-400/40 text-amber-300'
                          : 'bg-white/5 border border-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      💎 매일의 마법 루틴
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('mindset')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                        selectedCategory === 'mindset'
                          ? 'bg-amber-500/20 border border-amber-400/40 text-amber-300'
                          : 'bg-white/5 border border-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      🌟 마인드셋 & 주파수
                    </button>
                  </div>

                  <span className="text-[11px] text-white/40 font-sans">
                    도구를 누르면 데일리 시크릿 소원 맞춤 키트에 즉시 반영됩니다.
                  </span>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTools.map((tool) => (
                    <motion.div
                      key={tool.id}
                      whileHover={{ y: -3 }}
                      className="p-5 rounded-3xl bg-zinc-950/70 border border-amber-500/20 hover:border-amber-400/50 hover:bg-amber-950/15 transition-all flex flex-col justify-between gap-4 group"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{tool.emoji}</span>
                          <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-amber-300/70 group-hover:border-amber-400/30 transition-colors">
                            {tool.category === 'core' ? 'Core Tool' : tool.category === 'daily' ? 'Daily Magic' : 'Frequency'}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-white font-sans group-hover:text-amber-200 transition-colors">
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
                          <span className="text-[9px] font-bold uppercase text-amber-400 font-mono block">
                            실천 방법
                          </span>
                          <p className="text-[11px] text-amber-100/80 font-sans leading-relaxed break-keep">
                            {tool.howToPractice}
                          </p>
                        </div>
                      </div>

                      {onSelectTool && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectTool(tool.id, tool.name, tool.suggestedWish);
                            onClose();
                          }}
                          className="w-full py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-200 text-xs font-bold font-sans flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        >
                          <span>이 도구로 소원 키트 적용</span>
                          <ChevronRight size={14} />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: PHILOSOPHY & MANTRAS */}
            {activeTab === 'philosophy' && (
              <div className="space-y-6">
                {/* Core Philosophy Showcase */}
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-950/40 via-black/70 to-orange-950/30 border border-amber-500/30 space-y-6">
                  <div className="text-center space-y-2 max-w-xl mx-auto">
                    <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-widest">
                      The Golden Rules of Attraction
                    </span>
                    <h3 className="text-2xl font-bold text-white font-sans">
                      시크릿의 4가지 위대한 끌어당김의 황금률
                    </h3>
                    <p className="text-xs text-white/60 font-sans">
                      당신의 주파수가 곧 당신의 현실입니다. 우주는 언제나 당신의 감정에 실시간으로 응답합니다.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {SECRET_PHILOSOPHY_RULES.map((rule, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2 text-left">
                        <span className="text-[10px] font-mono text-amber-400 font-bold uppercase px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/20 inline-block">
                          {rule.tag}
                        </span>
                        <h4 className="text-base font-bold text-white font-sans">{rule.title}</h4>
                        <p className="text-xs text-white/70 font-sans leading-relaxed break-keep">
                          {rule.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5 Core Mantras */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                      <Sun size={20} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white font-sans">
                        매일 아침 외우는 시크릿 5대 파워 만트라
                      </h4>
                      <p className="text-xs text-white/40 font-mono">
                        by Rhonda Byrne (The Secret Series)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    {[
                      '1. "나는 무한한 풍요와 행운을 끌어당기는 강력한 자석이다."',
                      '2. "내가 원하는 모든 소원은 이미 우주 안에서 온전히 이루어졌다."',
                      '3. "나의 기분 좋은 감정이 지금 이 순간 더 큰 기적을 창조하고 있다."',
                      '4. "나는 나에게 주어지는 모든 우주의 선물을 감사히 누릴 자격이 있다."',
                      '5. "감사합니다, 감사합니다, 진심으로 감사합니다."',
                    ].map((mantra, i) => (
                      <div key={i} className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/10 text-xs sm:text-sm text-amber-100 font-sans flex items-center justify-between">
                        <span>{mantra}</span>
                        <TTSButton text={mantra} voice="Kore" className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: BIBLE (AI COACHING QUESTIONS) */}
            {activeTab === 'bible' && (
              <div className="space-y-6">
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-950/40 via-black/70 to-orange-950/30 border border-amber-500/30 space-y-4 text-left">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-widest">
                      The Secret AI Coaching &amp; Dialogue Bible
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-sans">
                      론다 번의 시크릿 AI 끌어당김 질문 가이드
                    </h3>
                    <p className="text-xs text-white/60 font-sans leading-relaxed">
                      궁금한 끌어당김 질문을 클릭하면 루시(AI)와 1:1 심층 상담이 즉시 시작됩니다.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SECRET_BIBLE_SECTIONS.map((section) => (
                    <div
                      key={section.id}
                      className="p-6 rounded-3xl bg-zinc-950/70 border border-amber-500/20 space-y-4 text-left flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                            <Sparkles size={16} />
                          </div>
                          <h4 className="text-sm font-bold text-white font-sans">
                            {section.title}
                          </h4>
                        </div>

                        <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                          <span className="text-[9px] font-mono font-bold uppercase text-amber-400 block">
                            핵심 원리
                          </span>
                          <ul className="space-y-1">
                            {section.principles.map((pr, i) => (
                              <li key={i} className="text-[11px] text-white/70 font-sans leading-relaxed flex items-start gap-1.5">
                                <span className="text-amber-400 font-bold">•</span>
                                <span>{pr}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <span className="text-[9px] font-mono font-bold uppercase text-amber-400 block">
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
                            className="w-full p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-left text-[11px] text-amber-200 hover:text-white font-sans flex items-center justify-between gap-2 transition-all cursor-pointer group"
                          >
                            <span className="leading-snug break-keep">{step}</span>
                            <ChevronRight size={14} className="shrink-0 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
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

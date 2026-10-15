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
} from 'lucide-react';
import { TTSButton } from '@/components/TTSButton';
import { RealBookModal, type BookChapterTab } from '@/components/RealBookModal';

export interface AcimHandbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrinciple?: (toolId: string, title: string, quote: string) => void;
  onConsult?: (text: string) => void;
}

const CHAPTER_TABS: BookChapterTab[] = [
  { id: 'principles', romanNumeral: 'Ⅰ', title: '기적수업 핵심 4대 원리 (Core Principles)', shortLabel: '핵심 원리' },
  { id: 'tools', romanNumeral: 'Ⅱ', title: '10가지 기적수업 실천 도구 (ACIM Tools)', shortLabel: '실천 도구' },
  { id: 'truth', romanNumeral: 'Ⅲ', title: '진리의 절대 명제 & 확언 (Sacred Truths)', shortLabel: '진리 명제' },
  { id: 'bible', romanNumeral: 'Ⅳ', title: 'AI 코칭 바이블 (Bible & Lucy 1:1)', shortLabel: '코칭 바이블' },
];

export const ACIM_BIBLE_SECTIONS = [
  {
    id: 'fool_journey',
    title: "Fool's Journey · 광대의 여정과 대아르카나",
    principles: [
      "0번 바보(The Fool)에서 21번 세계(The World)까지, 대아르카나는 영혼의 성장 여정입니다.",
      "카드의 상징은 정해진 운명이 아니라, 지금 당신의 무의식이 비추는 거울입니다.",
      "역방향은 결핍이나 경고가 아닌, 내면에서 아직 온전히 통합되지 않은 그림자(Shadow)를 가리킵니다."
    ],
    steps: [
      "광대(0번)부터 세계(21번)까지 대아르카나의 영적 여정 단계를 쉽게 설명해줘",
      "지금 내 고민에 맞는 대아르카나 카드와 그 상징적 의미를 분석해줘",
      "정방향과 역방향을 볼 때 그림자(Shadow) 측면을 치유하는 법을 알려줘"
    ]
  },
  {
    id: 'four_suits',
    title: 'Four Suits & Elements · 4대 수트와 원소 에너지',
    principles: [
      "완드(Wands)는 불과 영감, 열정, 창조적 행동을 상징합니다.",
      "컵(Cups)은 물과 감정, 직관, 사랑, 관계의 흐름을 상징합니다.",
      "소드(Swords)는 공기와 생각, 이성, 진실, 내면의 갈등을 상징합니다.",
      "펜타클(Pentacles)은 흙과 물질, 현실, 결실, 몸의 안정을 상징합니다."
    ],
    steps: [
      "완드(불), 컵(물), 소드(공기), 펜타클(흙) 4대 원소의 균형을 점검하는 법은?",
      "타로 리딩에서 특정 수트가 유독 많이 나올 때의 영적 메시지를 해석해줘",
      "궁정 카드(Page, Knight, Queen, King)가 가리키는 인물과 태도를 읽는 법은?"
    ]
  },
  {
    id: 'acim_forgiveness',
    title: 'True Forgiveness & Shift · 기적수업 참된 용서와 지각 전환',
    principles: [
      "기적은 물리적 마술이 아니라 두려움에서 사랑으로의 지각 전환(Shift in Perception)입니다.",
      "상대를 가해자로 보는 에고의 투사를 거두어들이고, 본래 무죄한 거룩함을 바라보세요.",
      "거룩한 순간(Holy Instant)에 머물 때 모든 죄책감과 두려움은 완전히 사라집니다."
    ],
    steps: [
      "기적수업의 '진정한 용서(True Forgiveness)'와 일반적인 용서의 차이를 설명해줘",
      "상대방의 공격과 비난을 '사랑을 구하는 부르짖음'으로 지각 전환하는 법 가이드해줘",
      "거룩한 순간(Holy Instant)을 일상에서 체험하고 마음의 평화를 얻는 연습법은?"
    ]
  },
  {
    id: 'intuitive_reading',
    title: 'Intuitive Reading & Spread · 직관 리딩과 스프레드',
    principles: [
      "카드 해석의 열쇠는 지식의 암기가 아니라 순간 번뜩이는 순수한 직관입니다.",
      "과거-현재-미래 3카드 스프레드는 원인과 현재 흐름, 최적의 조언을 명쾌하게 조망합니다.",
      "카드가 전하는 가장 따뜻하고 지혜로운 목소리에 가슴을 여세요."
    ],
    steps: [
      "키워드 암기 없이 그림의 상징과 첫인상으로 직관 리딩하는 꿀팁을 줘",
      "3카드 스프레드(과거-현재-미래 / 원인-조언-결과)를 가장 명확히 해석하는 법은?",
      "켈틱 크로스 스프레드로 깊은 심층 무의식을 탐색하는 가이드를 줘"
    ]
  }
];

export const ACIM_SACRED_PRINCIPLES = [
  {
    id: 'true_forgiveness',
    stepNumber: 'PRINCIPLE 1',
    titleKo: '진정한 비이원적 용서 (True Forgiveness)',
    titleEn: 'Principle 1: True Forgiveness & Undoing the Ego',
    quote: '"용서는 아무것도 하지 않고, 그저 가만히 바라보며 판단하지 않는 것이다."',
    quoteEn: '“Forgiveness is still, and quietly does nothing. It merely looks, and waits, and judges not.” — A Course in Miracles (W-pII.1.4:1)',
    desc: '세상적인 용서는 ‘너의 죄를 내가 너그럽게 봐준다’는 우월감이지만, 기적수업의 진정한 용서는 ‘일어난 상처와 죄책감이 실은 에고의 환영(꿈)이었음을 알아차리고, 상대의 순수한 신성을 회복하는 것’입니다.',
    rules: [
      '상대를 가해자로, 나를 피해자로 규정하는 에고의 각본을 멈추세요.',
      '내 안에서 올라오는 분노와 억울함은 상대 때문이 아니라 내 무의식의 두려움이 투사된 것임을 자각하세요.',
      '상대의 겉모습 너머에 영원히 흠 없는 거룩한 하나님의 자녀(그리스도)의 빛을 바라보세요.',
    ],
    chantKo: `나는 내 형제와 세상을 향한 모든 판단과 비난을 기꺼이 거두어들입니다.
나를 아프게 한 것은 바깥세상이 아니라 내 마음속 두려움의 투사였음을 인정합니다.
당신은 죄가 없으며, 나 또한 죄가 없습니다. 우리는 여전히 하나님이 창조하신 순수한 사랑입니다.`,
    chantEn: `Forgiveness recognizes what you thought your brother did to you has not occurred. It merely lets the truth return, where peace and love abide forever.`,
  },
  {
    id: 'holy_spirit_vision',
    stepNumber: 'PRINCIPLE 2',
    titleKo: '성령의 시각 & 지각의 전환 (Shift from Fear to Love)',
    titleEn: 'Principle 2: Holy Spirit’s Vision & Shift to Love',
    quote: '"기적이란 두려움에서 사랑으로 일어나는 마음의 지각 전환(Shift in Perception)이다."',
    quoteEn: '“A miracle is a shift in perception from fear to love. Miracles are natural. When they do not occur something has gone wrong.” — ACIM',
    desc: '기적은 물리적 마술이 아니라 내 마음이 에고의 두려운 시각을 버리고 성령의 자비로운 눈(Love’s Vision)을 선택하는 의식의 도약입니다. 모든 갈등 상황에서 "나는 다르게 볼 수 있다"고 선언하세요.',
    rules: [
      '‘내가 옳다’는 에고의 고집을 내려놓고 "성령님, 당신의 눈으로 이 상황을 보게 하소서"라고 청하세요.',
      '모든 공격과 분노는 실은 ‘사랑을 구하는 간절한 부르짖음(A Call for Love)’임을 꿰뚫어 보세요.',
      '두려움 대신 사랑을 선택하는 순간, 기적의 문이 열리고 마음의 평화가 즉시 찾아옵니다.',
    ],
    chantKo: `나는 내 방식으로 이 상황을 판단하지 않겠습니다.
성령이 보시는 지혜와 사랑의 눈으로 이 사람과 이 순간을 바라보게 하소서.
두려움 대신 사랑을 선택하며, 이 갈등 뒤에 숨겨진 거룩한 축복을 받아들입니다.`,
    chantEn: `I will not judge anything today. I choose to see this with the vision of the Holy Spirit. Miracles replace all grievances with peace.`,
  },
  {
    id: 'atonement_peace',
    stepNumber: 'PRINCIPLE 3',
    titleKo: '속죄와 하나님의 평화 (Atonement & Peace of God)',
    titleEn: 'Principle 3: Acceptance of the Atonement',
    quote: '"실제적인 것은 아무것도 위협받을 수 없다. 실제적이지 않은 것은 아무것도 존재하지 않는다. 여기에 하나님의 평화가 있다."',
    quoteEn: '“Nothing real can be threatened. Nothing unreal exists. Herein lies the peace of God.” — ACIM Introduction',
    desc: '기적수업의 핵심은 ‘속죄(Atonement)’, 즉 분리의 꿈에서 깨어나 우리 영혼이 한 번도 상처받거나 타락한 적 없는 순수무결한 영(Spirit)임을 온전히 받아들이는 것입니다.',
    rules: [
      '당신은 육체나 생각의 한계에 갇힌 존재가 아니라 무한한 빛의 영혼입니다.',
      '과거의 실수나 죄책감은 실재하지 않는 환영이며, 당신은 언제나 온전합니다 (I am as God created me).',
      '하나님의 평화는 외부의 조건에 좌우되지 않는 당신 본연의 내면 상태입니다.',
    ],
    chantKo: `실제적인 것은 아무것도 위협받을 수 없습니다.
실제적이지 않은 것은 아무것도 존재하지 않습니다.
나는 하나님이 창조하신 그대로의 영혼이며, 여기에 하나님의 영원한 평화가 있습니다.`,
    chantEn: `Nothing real can be threatened. Nothing unreal exists. I am as God created me, forever safe and forever peaceful in His love.`,
  },
];

export interface AcimToolItem {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  category: 'core' | 'forgiveness' | 'mindset';
  summary: string;
  howToPractice: string;
  workbookLesson: string;
  affirmation: string;
}

export const ACIM_TOOLS_CATALOG: AcimToolItem[] = [
  {
    id: 'holy_instant',
    name: '거룩한 순간 (The Holy Instant)',
    nameEn: 'The Holy Instant',
    emoji: '🕊️',
    category: 'core',
    summary: '과거의 후회와 미래의 불안을 멈추고 1분간 성령의 고요한 침묵 속으로 들어가는 의식',
    howToPractice: '모든 활동을 1분간 멈추고 깊은 호흡과 함께 "이 거룩한 순간에 나는 모든 짐을 성령께 맡깁니다"라고 선언하며 순수한 현재에 머뭅니다.',
    workbookLesson: '“나는 지금 이 순간 오직 하나님의 평화만을 기억합니다.”',
    affirmation: '과거도 미래도 없는 이 거룩한 순간에 나는 온전히 안전하며 평화롭습니다.',
  },
  {
    id: 'shift_in_perception',
    name: '지각의 전환 (Shift in Perception)',
    nameEn: 'Choosing Love over Fear',
    emoji: '👁️',
    category: 'core',
    summary: '화나거나 섭섭할 때 "나는 평화를 선택할 수 있다"며 두려움에서 사랑으로 시각을 도약하기',
    howToPractice: '마음이 소란스러울 때 눈을 감고 "나는 이것을 다른 방식으로 볼 수 있습니다(I could see peace instead of this)"를 3번 되뇌입니다.',
    workbookLesson: '레슨 34: “나는 이 상황 대신에 평화를 볼 수 있습니다.”',
    affirmation: '나는 두려움의 안경을 벗고 성령의 눈으로 온 세상을 사랑으로 바라봅니다.',
  },
  {
    id: 'atonement_acceptance',
    name: '속죄의 수용 (I am as God created me)',
    nameEn: 'Accepting the Atonement',
    emoji: '🕯️',
    category: 'core',
    summary: '내 안의 모든 죄책감과 자기비하를 지우고 순수무결한 본성을 선언하기',
    howToPractice: '가슴에 손을 얹고 "나는 하나님이 창조하신 그대로이며, 어떤 죄도 나를 물들일 수 없습니다"를 고요히 읊습니다.',
    workbookLesson: '레슨 94: “나는 하나님이 창조하신 그대로이다.”',
    affirmation: '나는 영원히 순수하고 온전한 사랑이며, 신성의 축복을 온전히 누립니다.',
  },
  {
    id: 'holy_relationship',
    name: '거룩한 관계 (Holy Relationship)',
    nameEn: 'Transforming into Holy Relationship',
    emoji: '🤝',
    category: 'forgiveness',
    summary: '특별한 소유욕과 요구의 관계를 서로를 치유하고 자유롭게 하는 거룩한 관계로 승화하기',
    howToPractice: '갈등이 있는 사람을 떠올리며 그에게 바라는 요구를 내려놓고 "당신을 통해 내 안의 그리스도를 봅니다"라고 축복합니다.',
    workbookLesson: '“나의 형제는 나의 구원자이며, 그를 용서할 때 내가 자유로워집니다.”',
    affirmation: '나는 상대를 소유하려 하지 않고, 서로에게 자유와 평화를 전하는 거룩한 통로가 됩니다.',
  },
  {
    id: 'undoing_projection',
    name: '투사 거두어들이기 (Undoing Projection)',
    nameEn: 'Withdrawing All Projections',
    emoji: '🌌',
    category: 'forgiveness',
    summary: '세상을 향한 비난과 불평이 내 무의식의 두려움임을 알아차리고 마음 안에서 치유하기',
    howToPractice: '타인이 밉거나 거슬릴 때 "이것은 내 마음속 분열의 투사입니다. 내 안의 두려움을 치유하소서"라고 기도합니다.',
    workbookLesson: '레슨 5: “내가 화난 이유는 내가 생각하는 그 이유 때문이 아닙니다.”',
    affirmation: '나는 세상에 책임을 전가하지 않고, 내면의 사랑을 회복하여 세상을 치유합니다.',
  },
  {
    id: 'defenselessness',
    name: '무방비의 참된 안전 (Defenselessness)',
    nameEn: 'In My Defenselessness My Safety Lies',
    emoji: '🛡️',
    category: 'mindset',
    summary: '변명, 반박, 공격의 갑옷을 벗고 진정한 무방비함 속에서 완전한 신의 보호를 체험하기',
    howToPractice: '공격받았다고 느낄 때 맞서 싸우지 않고 어깨를 내리며 "나는 방어할 필요가 없습니다. 신의 사랑이 나를 보호합니다"라고 선언합니다.',
    workbookLesson: '레슨 153: “나의 무방비함 속에 나의 안전이 있다.”',
    affirmation: '방어하지 않을 때 어떤 공격도 나를 해칠 수 없으며, 나는 안전한 평화 속에 있습니다.',
  },
  {
    id: 'extending_light',
    name: '빛의 확장 명상 (Extending Light)',
    nameEn: 'Extending Christ’s Light',
    emoji: '☀️',
    category: 'mindset',
    summary: '내 안의 신성한 빛을 용서하고 싶은 상대와 온 세상으로 무제한 방사하는 명상',
    howToPractice: '가슴 중앙에서 타오르는 백색 에메랄드 빛이 온 방안과 지구 전체로 확장되어 모든 영혼을 비추는 모습을 그립니다.',
    workbookLesson: '레슨 87: “세상의 빛인 내가 나의 용서로 세상을 구원합니다.”',
    affirmation: '내 안의 빛은 온 우주로 퍼져나가 어둠과 고통을 순수한 평화로 바꿉니다.',
  },
  {
    id: 'little_willingness',
    name: '작은 기꺼움 (Little Willingness)',
    nameEn: 'The Little Willingness',
    emoji: '⏳',
    category: 'mindset',
    summary: '모든 것을 내가 해결하려 하지 않고 "성령님께 맡기겠습니다"라는 1%의 기꺼움을 바치기',
    howToPractice: '도저히 해결책이 보이지 않을 때 "제가 하려던 것을 멈추고 성령님의 방식으로 기꺼이 맡깁니다"라고 손을 폅니다.',
    workbookLesson: '“당신에게 필요한 것은 단지 작은 기꺼움뿐이며, 나머지는 성령이 다 하십니다.”',
    affirmation: '나의 작은 기꺼움이 성령의 무한한 권능과 만나 완전한 기적을 이룹니다.',
  },
  {
    id: 'daily_workbook_anchor',
    name: '데일리 워크북 확언 (Daily Workbook Anchor)',
    nameEn: '365 Daily Workbook Lessons',
    emoji: '📖',
    category: 'core',
    summary: '기적수업 365일 훈련서의 정수 레슨을 오늘 하루 마음의 중심 닻(Anchor)으로 삼기',
    howToPractice: '아침과 일과 중에 기적수업의 레슨 문장을 마음속에 10초간 떠올리며 호흡합니다.',
    workbookLesson: '레슨 182: “나는 잠시 고요히 머물러 나의 집으로 돌아갑니다.”',
    affirmation: '오늘 하루 모든 순간에 나는 기적수업의 빛을 따라 평화의 길을 걷습니다.',
  },
  {
    id: 'waking_from_dream',
    name: '꿈에서 깨어나기 (Waking from the Dream)',
    nameEn: 'Waking from the Ego’s Dream',
    emoji: '💫',
    category: 'mindset',
    summary: '세상의 모든 고통과 상실감이 실재가 아닌 한 편의 꿈임을 자각하고 참된 영적 자아로 환원',
    howToPractice: '괴로운 감정이 덮칠 때 "이것은 내가 꾼 꿈일 뿐 실재가 아니다. 나는 지금 깨어난다"라고 미소 짓습니다.',
    workbookLesson: '“신은 영원한 사랑이며, 고통은 오직 꿈속에만 존재합니다.”',
    affirmation: '나는 두려움의 꿈에서 깨어나 온전하고 충만한 영원한 생명의 빛으로 존재합니다.',
  },
];

export const ACIM_CORE_STATEMENTS = [
  {
    title: '1. 실제적인 것은 위협받을 수 없다 (Nothing Real Can Be Threatened)',
    desc: '영원한 사랑과 영혼은 세상의 어떤 사건으로도 결코 파괴되거나 다칠 수 없습니다. 오직 환영만이 상처받습니다.',
    tag: '기적수업 1법칙',
  },
  {
    title: '2. 기적은 자연스러운 것이다 (Miracles Are Natural)',
    desc: '기적이 일어나지 않는 것이 부자연스러운 것입니다. 마음이 사랑과 일치될 때 기적은 자연스러운 숨결처럼 흐릅니다.',
    tag: '기적의 본성',
  },
  {
    title: '3. 두려움은 사랑의 부재가 아닌 환영이다 (Fear is an Illusion)',
    desc: '어둠이 빛의 부재이듯, 두려움은 실체가 없습니다. 사랑의 빛을 비추는 순간 두려움은 안개처럼 사라집니다.',
    tag: '빛의 원리',
  },
  {
    title: '4. 나는 하나님이 창조하신 그대로이다 (I Am As God Created Me)',
    desc: '인간의 어떤 죄책감이나 실수도 하나님의 창조를 바꿀 수 없습니다. 당신은 태초부터 영원히 순수합니다.',
    tag: '궁극의 속죄',
  },
];

const ACIM_AUDIOBOOK_NARRATIONS: Record<string, string> = {
  principles: `기적수업 신성한 빛의 서, 제1장 신성한 3대 기적 원리입니다.
첫째, 참된 용서: 상대를 용서하는 것이 아니라, 상대에게 죄가 있다는 나의 환영과 투사를 거두어들이는 거룩한 시각입니다.
둘째, 성령과의 동행: 모든 순간 에고의 두려운 판단을 멈추고 성령의 고요한 안내를 신뢰하십시오.
셋째, 거룩한 순간: 과거의 후회와 미래의 불안을 내려놓고 지금 이 순간 신성의 임재 속에 머무르는 영원한 평화입니다.`,
  tools: `제2장, 10가지 기적수업 실천 도구입니다.
성령께 판단 넘기기는 갈등이 일어날 때마다 성령께 올바른 판단을 요청하는 도구입니다.
속죄의 수용은 내가 하나님이 창조하신 순수무결한 존재임을 확신하는 선언입니다.
무방비의 안전은 방어와 반박을 내려놓을 때 신의 온전한 보호를 체험하는 비결입니다.
작은 기꺼움은 내 방식을 고집하지 않고 1%의 마음을 성령께 열어둘 때 기적이 일어난다는 진리입니다.`,
  truth: `제3장, 기적수업의 핵심 진리입니다.
실재하는 것은 결코 위협받을 수 없으며, 실재하지 않는 것은 존재하지 않습니다. 여기에 하나님의 평화가 있습니다.
오직 사랑만이 영원한 진실이며, 두려움과 결핍은 에고가 만든 환영일 뿐입니다.`,
  bible: `제4장, 365 워크북 및 실천 바이블입니다.
내가 보는 것은 아무것도 진실이 아니다. 나는 내 마음을 하나님의 사랑으로 채운다.
매일의 거룩한 순간마다 참나의 현존을 기억하고 평화를 선택하십시오.`
};

export function AcimHandbookModal({
  isOpen,
  onClose,
  onSelectPrinciple,
  onConsult,
}: AcimHandbookModalProps) {
  const [activeTab, setActiveTab] = useState<'principles' | 'tools' | 'truth' | 'bible'>('principles');
  const [selectedStepId, setSelectedStepId] = useState<string>('true_forgiveness');
  const [showEnglish, setShowEnglish] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'core' | 'forgiveness' | 'mindset'>('all');
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const currentPrinciple = ACIM_SACRED_PRINCIPLES.find((s) => s.id === selectedStepId) || ACIM_SACRED_PRINCIPLES[0];

  const filteredTools = ACIM_TOOLS_CATALOG.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  const handleCopyPrinciple = () => {
    const textToCopy = `${currentPrinciple.titleKo}\n\n${currentPrinciple.quote}\n\n[실천 원칙]\n${currentPrinciple.rules.join('\n')}\n\n[선언문]\n${currentPrinciple.chantKo}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <RealBookModal
      isOpen={isOpen}
      onClose={onClose}
      theme="trinity"
      bookTitle="기적수업 신성한 빛의 서"
      bookSubtitle="참된 용서와 에고의 해체, 무조건적인 평화의 경전"
      bookAuthor="Helen Schucman (헬렌 슈크만)"
      epigraphQuote="실재하는 것은 위협받을 수 없으며, 실재하지 않는 것은 존재하지 않는다. 여기에 하나님의 평화가 있다."
      epigraphSource="A Course in Miracles (기적수업 서문)"
      chapterTabs={CHAPTER_TABS}
      activeTabId={activeTab}
      onTabChange={(id) => setActiveTab(id as any)}
      footerPageNumber={`- Chapter ${activeTab === 'principles' ? 'Ⅰ' : activeTab === 'tools' ? 'Ⅱ' : activeTab === 'truth' ? 'Ⅲ' : 'Ⅳ'} -`}
      audiobookNarrations={ACIM_AUDIOBOOK_NARRATIONS}
      defaultVoice="Kore"
    >
            {/* TAB 1: PRINCIPLES */}
            {activeTab === 'principles' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {ACIM_SACRED_PRINCIPLES.map((step) => {
                    const isSelected = selectedStepId === step.id;
                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => setSelectedStepId(step.id)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-yellow-500/15 border-yellow-400/50 shadow-[0_0_20px_rgba(234,179,8,0.15)] text-white'
                            : 'bg-white/[0.02] border-white/5 hover:border-yellow-500/20 text-white/60 hover:text-white'
                        }`}
                      >
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-yellow-400 block mb-1">
                          {step.stepNumber}
                        </span>
                        <p className="text-sm font-bold text-white font-sans">{step.titleKo}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Active Principle Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-black/50 border border-yellow-500/20 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <span className="text-[10px] text-yellow-400 font-mono font-bold uppercase tracking-widest block">
                        A Course in Miracles · Sacred Principle
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 font-sans">
                        {currentPrinciple.titleKo}
                      </h3>
                      <p className="text-xs text-white/50 mt-1 font-sans">{currentPrinciple.desc}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowEnglish(!showEnglish)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-yellow-300 font-sans cursor-pointer transition-all"
                      >
                        {showEnglish ? '한글만 보기' : '영문 원문 함께보기'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyPrinciple}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 hover:text-white font-sans cursor-pointer transition-all flex items-center gap-1"
                      >
                        {copiedText ? <Check size={14} className="text-emerald-400" /> : null}
                        <span>{copiedText ? '복사 완료' : '내용 복사'}</span>
                      </button>
                      <TTSButton
                        text={currentPrinciple.chantKo}
                        voice="Kore"
                        className="px-3.5 py-1.5 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/30 text-xs text-yellow-300 font-sans cursor-pointer transition-all"
                      />
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                    <p className="text-sm font-serif italic text-yellow-200 leading-relaxed">
                      {currentPrinciple.quote}
                    </p>
                    {showEnglish && (
                      <p className="text-xs font-serif italic text-yellow-200/50 mt-1.5">
                        {currentPrinciple.quoteEn}
                      </p>
                    )}
                  </div>

                  {/* Practice Rules */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold font-mono uppercase tracking-wider text-yellow-400 block">
                      핵심 실천 원칙 (Miracles Principles)
                    </span>
                    <div className="grid grid-cols-1 gap-2.5">
                      {currentPrinciple.rules.map((rule, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-xs text-white/80 font-sans leading-relaxed break-keep">
                            {rule}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chanting & Prayer Script */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold font-mono uppercase tracking-wider text-yellow-400 block">
                      마음의 치유 선언문 (Sacred Healing Prayer)
                    </span>
                    <div className="p-5 rounded-2xl bg-yellow-950/20 border border-yellow-500/20">
                      <p className="text-sm sm:text-base text-yellow-100 font-serif leading-loose whitespace-pre-line tracking-wide">
                        {currentPrinciple.chantKo}
                      </p>
                      {showEnglish && (
                        <p className="text-xs text-yellow-200/50 font-serif italic leading-relaxed mt-3 pt-3 border-t border-white/5 whitespace-pre-line">
                          {currentPrinciple.chantEn}
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
                          ? 'bg-yellow-500/20 border border-yellow-400/40 text-yellow-300'
                          : 'bg-white/5 border border-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      전체 ({ACIM_TOOLS_CATALOG.length}개)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('core')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                        selectedCategory === 'core'
                          ? 'bg-yellow-500/20 border border-yellow-400/40 text-yellow-300'
                          : 'bg-white/5 border border-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      🕊️ 핵심 기적 의식
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('forgiveness')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                        selectedCategory === 'forgiveness'
                          ? 'bg-yellow-500/20 border border-yellow-400/40 text-yellow-300'
                          : 'bg-white/5 border border-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      🤝 관계 & 용서 도구
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('mindset')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                        selectedCategory === 'mindset'
                          ? 'bg-yellow-500/20 border border-yellow-400/40 text-yellow-300'
                          : 'bg-white/5 border border-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      ☀️ 빛과 평화 마인드셋
                    </button>
                  </div>

                  <span className="text-[11px] text-white/40 font-sans">
                    도구를 누르면 데일리 오라클의 오늘의 기적 수행으로 적용됩니다.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTools.map((tool) => (
                    <motion.div
                      key={tool.id}
                      whileHover={{ y: -3 }}
                      className="p-5 rounded-3xl bg-zinc-950/70 border border-yellow-500/20 hover:border-yellow-400/50 hover:bg-yellow-950/15 transition-all flex flex-col justify-between gap-4 group"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{tool.emoji}</span>
                          <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-yellow-300/70 group-hover:border-yellow-400/30 transition-colors">
                            {tool.category === 'core' ? 'Holy Core' : tool.category === 'forgiveness' ? 'Forgiveness' : 'Mindset'}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-white font-sans group-hover:text-yellow-200 transition-colors">
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
                          <span className="text-[9px] font-bold uppercase text-yellow-400 font-mono block">
                            실천 방법 & 워크북
                          </span>
                          <p className="text-[11px] text-yellow-100/80 font-sans leading-relaxed break-keep">
                            {tool.howToPractice}
                          </p>
                          <p className="text-[10px] text-white/40 font-serif italic pt-1 border-t border-white/5">
                            {tool.workbookLesson}
                          </p>
                        </div>
                      </div>

                      {onSelectPrinciple && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectPrinciple(tool.id, tool.name, tool.affirmation);
                            onClose();
                          }}
                          className="w-full py-2.5 rounded-xl bg-yellow-500/15 hover:bg-yellow-500/25 border border-yellow-500/30 text-yellow-200 text-xs font-bold font-sans flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        >
                          <span>이 기적으로 오늘을 시작하기</span>
                          <ChevronRight size={14} />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: TRUTHS & MANTRAS */}
            {activeTab === 'truth' && (
              <div className="space-y-6">
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-yellow-950/40 via-black/70 to-amber-950/30 border border-yellow-500/30 space-y-6">
                  <div className="text-center space-y-2 max-w-xl mx-auto">
                    <span className="text-[10px] text-yellow-400 font-mono font-bold uppercase tracking-widest">
                      Eternal Truths of ACIM
                    </span>
                    <h3 className="text-2xl font-bold text-white font-sans">
                      기적수업의 4가지 위대한 영적 진실
                    </h3>
                    <p className="text-xs text-white/60 font-sans">
                      세상의 환영을 꿰뚫고 오직 하나님의 영원한 평화와 사랑에 머무르는 나침반입니다.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ACIM_CORE_STATEMENTS.map((rule, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 space-y-2 text-left">
                        <span className="text-[10px] font-mono text-yellow-400 font-bold uppercase px-2 py-0.5 rounded-md bg-yellow-400/10 border border-yellow-400/20 inline-block">
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
                    <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 border border-yellow-400/30 flex items-center justify-center text-yellow-300">
                      <Sun size={20} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white font-sans">
                        기적수업 5대 성스러운 일일 확언
                      </h4>
                      <p className="text-xs text-white/40 font-mono">
                        A Course in Miracles Daily Mantras
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    {[
                      '1. "실제적인 것은 아무것도 위협받을 수 없다. 실제적이지 않은 것은 아무것도 존재하지 않는다."',
                      '2. "나는 하나님이 창조하신 그대로의 순수한 영혼입니다."',
                      '3. "나는 두려움 대신 평화와 사랑을 선택합니다."',
                      '4. "나의 무방비함 속에 나의 참된 안전이 있습니다."',
                      '5. "온 우주에 오직 하나님의 완전한 평화만이 실재합니다."',
                    ].map((mantra, i) => (
                      <div key={i} className="p-3 rounded-xl bg-yellow-950/20 border border-yellow-500/10 text-xs sm:text-sm text-yellow-100 font-sans flex items-center justify-between">
                        <span>{mantra}</span>
                        <TTSButton text={mantra} voice="Kore" className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-yellow-300" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: BIBLE (AI COACHING QUESTIONS) */}
            {activeTab === 'bible' && (
              <div className="space-y-6">
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-yellow-950/40 via-black/70 to-amber-950/30 border border-yellow-500/30 space-y-4 text-left">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-yellow-400 font-mono font-bold uppercase tracking-widest">
                      ACIM &amp; Tarot AI Coaching Bible
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-sans">
                      타로 &amp; 기적수업 AI 상담 질문 가이드
                    </h3>
                    <p className="text-xs text-white/60 font-sans leading-relaxed">
                      궁금한 영적 질문을 클릭하면 루시(AI)와 1:1 심층 상담이 즉시 시작됩니다.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ACIM_BIBLE_SECTIONS.map((section) => (
                    <div
                      key={section.id}
                      className="p-6 rounded-3xl bg-zinc-950/70 border border-yellow-500/20 space-y-4 text-left flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-yellow-500/20 border border-yellow-400/30 flex items-center justify-center text-yellow-300">
                            <Sparkles size={16} />
                          </div>
                          <h4 className="text-sm font-bold text-white font-sans">
                            {section.title}
                          </h4>
                        </div>

                        <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                          <span className="text-[9px] font-mono font-bold uppercase text-yellow-400 block">
                            핵심 원리
                          </span>
                          <ul className="space-y-1">
                            {section.principles.map((pr, i) => (
                              <li key={i} className="text-[11px] text-white/70 font-sans leading-relaxed flex items-start gap-1.5">
                                <span className="text-yellow-400 font-bold">•</span>
                                <span>{pr}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <span className="text-[9px] font-mono font-bold uppercase text-yellow-400 block">
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
                            className="w-full p-2.5 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 text-left text-[11px] text-yellow-200 hover:text-white font-sans flex items-center justify-between gap-2 transition-all cursor-pointer group"
                          >
                            <span className="leading-snug break-keep">{step}</span>
                            <ChevronRight size={14} className="shrink-0 text-yellow-400 group-hover:translate-x-0.5 transition-transform" />
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

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

export interface ArtistWayHandbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool?: (toolId: string, title: string, quote: string) => void;
  onConsult?: (text: string) => void;
}

const CHAPTER_TABS: BookChapterTab[] = [
  { id: 'tools', romanNumeral: 'Ⅰ', title: '3대 핵심 도구 (모닝페이지 · 아티스트데이트 · 우물채우기)', shortLabel: '핵심 도구' },
  { id: 'catalog', romanNumeral: 'Ⅱ', title: '10가지 창조성 회복 도구 편람 (Creative Tools)', shortLabel: '회복 도구' },
  { id: 'creed', romanNumeral: 'Ⅲ', title: '창조성 10대 기본 원리와 5대 확언 (Creative Creed)', shortLabel: '창조 신조' },
  { id: 'bible', romanNumeral: 'Ⅳ', title: 'AI 코칭 바이블 (Bible & Lucy 1:1)', shortLabel: '코칭 바이블' },
];

export const ARTIST_WAY_BIBLE_SECTIONS = [
  {
    id: 'morning_pages',
    title: 'Morning Pages & Censor · 모닝 페이지와 검열관 해체',
    principles: [
      "매일 아침 눈뜨자마자 손으로 3쪽의 의식의 흐름을 쏟아내 뇌의 먼지를 털어내세요.",
      "내면의 비판가(Censor)의 목소리를 논쟁하지 말고 종이 위에 그대로 흘려보내세요.",
      "잘 쓰려 하지 마세요. 모닝 페이지는 문학이 아니라 영적 빗자루질입니다."
    ],
    steps: [
      "매일 아침 모닝 페이지 3쪽을 지치지 않고 꾸준히 작성하는 실전 팁을 줘",
      "머릿속에서 '이런 게 무슨 소용이야'라고 비난하는 내면 검열관(Censor)을 잠재우는 법은?",
      "모닝 페이지를 쓰다가 과거의 분노나 슬픔이 터져 나올 때 치유하는 가이드해줘"
    ]
  },
  {
    id: 'artist_date',
    title: 'The Artist Date & Well · 아티스트 데이트와 영감의 우물',
    principles: [
      "주 1회, 1~2시간 동안 오직 내면 아이와 단둘이 순수한 놀이의 모험을 떠나세요.",
      "창조성은 자판기가 아닙니다. 먼저 오감의 이미지와 자극으로 영감의 우물을 채우세요.",
      "생산성이나 유익함을 버리고 어린아이 같은 순수한 호기심에 몸을 맡기세요."
    ],
    steps: [
      "이번 주말 혼자 떠나기 좋은 1만 원 이하의 기발한 아티스트 데이트 아이디어 5가지 추천해줘",
      "내면의 어린 예술가(Inner Artist)와 친해지는 감성 소통법을 알려줘",
      "창조적 번아웃이 왔을 때 영감의 우물(Well)을 빠르게 채우는 감각 자극법은?"
    ]
  },
  {
    id: 'creative_injury',
    title: 'Creative Injury · 창조적 상처 치유와 몬스터 박물관',
    principles: [
      "예술가의 꿈을 가로막는 것은 재능 부족이 아니라 과거에 받은 창조적 상처와 수치심입니다.",
      "당신의 꿈을 짓밟았던 몬스터들을 종이 위에 박제하고 그들의 독설에서 벗어나세요.",
      "질투는 두려움이 아니라 '내가 진정으로 열망하는 것'을 알려주는 나침반입니다."
    ],
    steps: [
      "과거 부모, 교사, 친구에게 들었던 '너는 재능 없어'라는 창조적 상처를 치유하는 3단계 과정은?",
      "내 창조성을 억압했던 인물들을 박제하는 '몬스터 박물관' 작업 가이드해줘",
      "비교와 질투의 독소를 나의 잠재력을 깨우는 창조적 신호로 전환하는 법은?"
    ]
  },
  {
    id: 'synchronicity',
    title: 'Synchronicity & Play · 동시성의 마법과 성스러운 놀이',
    principles: [
      "우리가 진정으로 한 걸음을 내딛는 순간, 온 우주가 동시성(Synchronicity)으로 응답합니다.",
      "완벽주의는 에고의 두려움입니다. 성스러운 낙서와 엉망진창 놀이로 시작하세요.",
      "당신의 창조성을 따뜻하게 믿어주는 지지자(Believing Mirror)와 함께하세요."
    ],
    steps: [
      "줄리아 카메론이 말하는 '동시성(Synchronicity)'과 우주의 숨은 조력자를 부르는 법은?",
      "완벽주의와 미루기 습관을 깨부수는 '가벼운 낙서와 엉망진창 놀이' 실천법 알려줘",
      "나를 응원하고 자극하는 창조적 연대(Creative Believing Mirror)를 형성하는 비결은?"
    ]
  }
];

export const ARTIST_WAY_SACRED_TOOLS = [
  {
    id: 'morning_pages',
    stepNumber: 'TOOL 1',
    titleKo: '모닝 페이지 (Morning Pages)',
    titleEn: 'Tool 1: Morning Pages (3 Stream-of-Consciousness Pages)',
    author: 'Julia Cameron · The Artist\'s Way',
    quote: '"모닝 페이지는 뇌의 먼지를 털어내는 영적 빗자루이자, 내면의 지혜로 들어가는 비밀 통로다."',
    quoteEn: '“Morning Pages are three pages of longhand, stream of consciousness writing, done first thing in the morning. There is no wrong way to do Morning Pages.” — Julia Cameron',
    desc: '매일 아침 눈뜨자마자 아무런 검열 없이 손으로 공책 3쪽을 가득 채우는 의식의 흐름 글쓰기입니다. 예술적인 글을 쓰려 하지 말고 사소한 불평, 잡념, 꿈, 두려움을 그대로 쏟아내세요.',
    rules: [
      '아침에 눈을 뜨자마자 침대 머리맡이나 책상에서 바로 작성하세요.',
      '다른 사람에게 절대 보여주지 마세요. 자신도 처음 8주 동안은 다시 읽지 마세요.',
      '철자, 문법, 논리에 신경 쓰지 마세요. 그저 펜이 멈추지 않고 흘러가게 두세요.',
    ],
    chantKo: `나는 내 안의 모든 잡념과 두려움, 검열관의 소음을 종이 위에 털어냅니다.
잘 쓰려 하지 않고, 있는 그대로의 내 마음을 솔직하게 쏟아냅니다.
의식의 먼지가 걷힌 맑은 자리에 우주의 찬란한 창조적 영감이 샘솟습니다.`,
    chantEn: `I clear away the mental dust through my morning pages. I silence the inner critic and open the door to boundless divine creativity.`,
  },
  {
    id: 'artist_date',
    stepNumber: 'TOOL 2',
    titleKo: '아티스트 데이트 (The Artist Date)',
    titleEn: 'Tool 2: The Artist Date (Weekly Solo Excursion)',
    author: 'Julia Cameron · The Artist\'s Way',
    quote: '"아티스트 데이트는 내 안의 어린 예술가(Inner Artist)와 단둘이 떠나는 주 1회의 신나는 놀이다."',
    quoteEn: '“The Artist Date is a once-weekly, festive, solo expedition to explore something that interests you. It is assigned play.” — Julia Cameron',
    desc: '일주일에 한 번, 1~2시간 동안 오직 나 자신(내면 아이)과 단둘이 떠나는 자발적 모험입니다. 일이나 의무가 아닌 순수한 호기심과 놀이를 위해 문구점, 갤러리, 헌책방, 숲길을 거닐어 보세요.',
    rules: [
      '친구, 가족, 연인과 함께 가지 마세요. 반드시 혼자여야 내면 아이와 대화할 수 있습니다.',
      '거창하거나 비쌀 필요가 없습니다. 5천 원짜리 크레파스 사기, 분식점 가기, 악기점 구경도 훌륭합니다.',
      '생산성이나 배움에 집착하지 말고 어린아이처럼 순수하게 즐기세요.',
    ],
    chantKo: `나는 내 안의 소중한 어린 아티스트와 함께 즐거운 영감의 모험을 떠납니다.
남들의 시선과 의무를 벗어던지고, 순수한 기쁨과 설렘으로 가슴을 채웁니다.
내가 나를 사랑으로 대할 때, 내 안의 예술적 불꽃이 활활 타오릅니다.`,
    chantEn: `I play joyfully with my inner artist. As I explore the world with childlike wonder, the well of creative inspiration is completely filled.`,
  },
  {
    id: 'filling_the_well',
    stepNumber: 'TOOL 3',
    titleKo: '영감의 우물 채우기 (Filling the Well)',
    titleEn: 'Tool 3: Filling the Creative Reservoir',
    author: 'Julia Cameron · The Artist\'s Way',
    quote: '"창조성은 소모되는 것이 아니라 채워지는 것이다. 물을 긷기 전에 먼저 우물을 채워라."',
    quoteEn: '“Art is an image-using system. In order to create, we draw from our inner well. We must become alert to replenishment.” — Julia Cameron',
    desc: '창작을 강요당해 바닥난 마음의 저수지에 오감(시각, 청각, 후각, 촉각, 미각)의 신선한 자극을 채워 넣는 작업입니다. 좋은 명화 감상, 아름다운 음악, 따뜻한 목욕, 자연과의 교감으로 영혼을 적셔주세요.',
    rules: [
      '작업과 무관한 순수한 감각적 몰입을 즐기세요.',
      '고전 명화의 색채와 질감을 깊이 응시하며 눈을 호사롭게 해주세요.',
      '새로운 리듬의 음악을 듣고 마음의 상상력을 자극하세요.',
    ],
    chantKo: `나의 영혼과 감각을 아름다운 명화와 선율, 향기로 풍요롭게 적십니다.
고갈된 마음의 우물에 신성한 영감과 생명수가 가득 차오릅니다.
나는 마르지 않는 풍요로운 영감의 바다에서 자유롭게 헤엄칩니다.`,
    chantEn: `I replenish my inner well with sensory delights, timeless art, and beautiful sounds. My reservoir of imagination is perpetually overflowing.`,
  },
];

export interface ArtistToolItem {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  category: 'core' | 'healing' | 'play';
  summary: string;
  howToPractice: string;
  quote: string;
  affirmation: string;
}

export const ARTIST_TOOLS_CATALOG: ArtistToolItem[] = [
  {
    id: 'morning_pages',
    name: '모닝 페이지 (Morning Pages)',
    nameEn: '3 Stream-of-Consciousness Pages',
    emoji: '✍️',
    category: 'core',
    summary: '매일 아침 눈뜨자마자 공책 3쪽을 가득 채우며 뇌의 먼지와 검열관의 소음을 털어내기',
    howToPractice: '아침 기상 직후 15분간 머릿속에 떠오르는 모든 생각(불평, 할 일, 꿈)을 여과 없이 손글씨로 씁니다.',
    quote: '“모닝 페이지를 쓰면 우리는 스스로에게 솔직해지고, 우리의 참된 목소리를 발견한다.”',
    affirmation: '나는 내면의 소음을 털어내고 순수한 창조적 본성과 연결됩니다.',
  },
  {
    id: 'artist_date',
    name: '아티스트 데이트 (Artist Date)',
    nameEn: 'Weekly Solo Inspiration Play',
    emoji: '🎈',
    category: 'play',
    summary: '주 1회 내 안의 어린 예술가와 단둘이 떠나는 1시간의 신나는 혼자만의 놀이와 탐험',
    howToPractice: '문구점, 수목원, 갤러리, 앤틱 벼룩시장을 혼자 거닐며 오직 흥미를 끄는 것들을 자유롭게 구경합니다.',
    quote: '“내면의 아티스트는 어린아이와 같아서, 보살핌과 놀이를 필요로 한다.”',
    affirmation: '나는 내 안의 어린아이를 기쁘게 하며 무한한 영감을 선물합니다.',
  },
  {
    id: 'taming_censor',
    name: '내면 검열관 길들이기 (Taming the Censor)',
    nameEn: 'Silencing the Inner Critic',
    emoji: '🛡️',
    category: 'healing',
    summary: '“넌 재능 없어”, “그게 되겠어?”라고 속삭이는 내면 검열관을 객관화하고 웃어넘기기',
    howToPractice: '검열관에게 ‘잔소리 괴물’, ‘드라큘라’ 같은 우스꽝스러운 이름을 붙이고, 비난이 들릴 때 "알려줘서 고맙지만 난 계속할 거야"라고 응답합니다.',
    quote: '“검열관의 목소리는 진실이 아니라, 단지 두려움이 만들어낸 허상일 뿐이다.”',
    affirmation: '나는 비평가의 목소리에 휘둘리지 않고 나만의 빛나는 창작을 이어갑니다.',
  },
  {
    id: 'healing_injuries',
    name: '창조적 상처 치유 (Healing Injuries)',
    nameEn: 'Healing from Past Creative Criticism',
    emoji: '🩹',
    category: 'healing',
    summary: '과거 선생님, 부모, 친구에게 받았던 예술적 비난과 조롱의 고통스러운 기억을 치유하기',
    howToPractice: '어릴 적 내 그림이나 꿈을 비웃었던 사람의 이름을 적고, 그 비난이 그들의 무지 때문이었음을 깨달으며 따뜻하게 용서합니다.',
    quote: '“상처 입은 어린 아티스트를 위로할 때, 굳어있던 창의적 심장이 다시 뛰기 시작한다.”',
    affirmation: '과거의 상처는 모두 치유되었으며, 나는 당당하고 자유로운 창작자입니다.',
  },
  {
    id: 'creative_affirmations',
    name: '창조성 긍정 확언 (Creative Affirmations)',
    nameEn: 'Manifesting Artistic Confidence',
    emoji: '💖',
    category: 'core',
    summary: '“나는 풍요로운 우주의 창조적 통로다”라는 확언으로 자기 불신과 무기력을 날려버리기',
    howToPractice: '거울을 보거나 모닝 페이지 말미에 "나의 창작은 신성한 선물이며, 세상은 나의 표현을 기다린다"를 소리 내어 말합니다.',
    quote: '“긍정 확언은 굳어있던 잠재의식의 토양에 생명의 씨앗을 뿌리는 일이다.”',
    affirmation: '나는 신성한 창조적 에너지의 통로이며, 나의 표현은 온 세상을 밝힙니다.',
  },
  {
    id: 'monster_hall_of_fame',
    name: '창조적 몬스터 박물관 (Monster Hall of Fame)',
    nameEn: 'Conquering the Creative Monsters',
    emoji: '🏛️',
    category: 'healing',
    summary: '나의 예술적 꿈을 짓밟았던 몬스터들의 권력을 회수하고 내면의 주도권 되찾기',
    howToPractice: '나를 좌절시켰던 인물들의 말을 우스꽝스러운 만화 캐릭터처럼 그리고, "너는 더 이상 내 꿈을 막을 수 없다"고 선언합니다.',
    quote: '“괴물을 빛 속으로 끌어내면, 그것은 더 이상 괴물이 아닌 작은 먼지에 불과하다.”',
    affirmation: '나는 과거의 모든 권위와 비난으로부터 완전히 해방되어 자유롭습니다.',
  },
  {
    id: 'clearing_time_bandits',
    name: '시간 도둑 쳐내기 (Time Bandits)',
    nameEn: 'Protecting Your Creative Space',
    emoji: '⏳',
    category: 'core',
    summary: '내 창작 에너지를 갉아먹는 유독한 인간관계와 불필요한 의무에 단호하게 거절하기',
    howToPractice: '내 시간과 기운을 빼앗는 일들의 목록을 작성하고, "내 예술을 위해 정중히 거절합니다"라고 경계선을 긋습니다.',
    quote: '“창의적인 삶을 살기 위해서는 거절하는 용기가 반드시 필요하다.”',
    affirmation: '나는 나의 신성한 창작 시간과 공간을 소중히 지키고 존중합니다.',
  },
  {
    id: 'synchronicity_magic',
    name: '동시성의 마법 (Synchronicity)',
    nameEn: 'Leap, and the Net Will Appear',
    emoji: '🧲',
    category: 'core',
    summary: '용기 내어 첫 발을 내딛을 때 온 우주가 문을 열어주고 귀인을 보내주는 신비한 동시성 체험',
    howToPractice: '“도약하라, 그러면 그물이 나타날 것이다.” 두려워하던 작업을 오늘 10분만 시작해 봅니다.',
    quote: '“인간이 진정으로 결단하는 순간, 우주 전체가 그를 돕기 위해 움직이기 시작한다.”',
    affirmation: '내가 움직일 때 온 우주가 길을 열어주며 모든 인연이 나를 돕습니다.',
  },
  {
    id: 'sacred_play',
    name: '성스러운 낭비와 낙서 (Sacred Play)',
    nameEn: 'Permission to Make Bad Art',
    emoji: '🎨',
    category: 'play',
    summary: '걸작을 만들려는 완벽주의를 내려놓고, 어린아이처럼 엉터리 낙서와 서툰 표현을 즐기기',
    howToPractice: '못 그려도 좋은 5분 스케치, 엉터리 콧노래, 손가락 물감 칠하기 등 결과에 상관없이 순수하게 놉니다.',
    quote: '“위대한 예술을 만들기 위해서는 먼저 기꺼이 서툰 졸작을 만들 수 있어야 한다.”',
    affirmation: '나는 완벽함을 버리고 순수한 놀이와 창조의 희열을 만끽합니다.',
  },
  {
    id: 'creative_cluster',
    name: '창조적 연대와 메이트 (Creative Cluster)',
    nameEn: 'Finding Believing Mirrors',
    emoji: '🌟',
    category: 'play',
    summary: '서로를 비난하지 않고 믿어주는 ‘믿음의 거울(Believing Mirror)’이 되어줄 동료들과 영감 나누기',
    howToPractice: '내 꿈을 응원해 주는 따뜻한 친구나 아티스트 메이트와 차 한 잔을 나누며 아이디어를 주고받습니다.',
    quote: '“우리를 진심으로 믿어주는 단 한 사람의 거울만 있어도 아티스트는 날아오를 수 있다.”',
    affirmation: '나는 나를 믿어주는 따뜻한 동료들과 함께 찬란하게 성장합니다.',
  },
];

export const ARTIST_BASIC_PRINCIPLES = [
  {
    number: '01',
    title: '1. 창조성은 신의 섭리이다 (Creativity is Divine Flow)',
    desc: '창조성은 억지로 쥐어짜는 기술이 아니라, 온 우주의 생명 에너지에 내 마음의 통로를 활짝 여는 것입니다.',
    tag: '우주의 법칙',
  },
  {
    number: '02',
    title: '2. 우리는 모두 타고난 창조적 통로이다 (We Are Living Channels)',
    desc: '특별한 소수만 예술가인 것이 아닙니다. 살아 숨 쉬는 모든 인간은 본래 순수한 창조적 에너지를 품고 있습니다.',
    tag: '인간의 본성',
  },
  {
    number: '03',
    title: '3. 창조성을 여는 것은 신성과의 교신이다 (Spiritual Path)',
    desc: '우리가 자신의 창조성을 발휘할 때, 그것은 신이 우리에게 준 선물에 가장 거룩하게 화답하는 행위입니다.',
    tag: '영적 연대',
  },
  {
    number: '04',
    title: '4. 우리는 창조할 때 가장 진실해진다 (Authentic Expression)',
    desc: '두려움 없이 자신을 표현하는 행위 그 자체가 억압된 내면아이를 해방하고 영혼을 치유하는 힘입니다.',
    tag: '내면 치유',
  },
  {
    number: '05',
    title: '5. 창조성을 거부하는 것은 생명을 거부하는 것이다 (Self-Betrayal)',
    desc: '내면의 창작 충동을 억누를 때 우울과 무기력이 생겨납니다. 영혼의 부름에 기꺼이 응답하십시오.',
    tag: '자기 사랑',
  },
  {
    number: '06',
    title: '6. 창조적 탐험에는 두려움이 따르는 것이 당연하다 (Fear is Normal)',
    desc: '두려움이 완전히 사라지기를 기다리지 마세요. 떨리는 손으로 펜을 들고 첫 발을 내딛는 것이 용기입니다.',
    tag: '용기의 미덕',
  },
  {
    number: '07',
    title: '7. 완벽주의는 창조성의 가장 큰 독이다 (Perfectionism Trap)',
    desc: '완벽하게 하려는 집착이 첫 붓질을 망설이게 합니다. 기꺼이 서툰 졸작을 허용할 때 위대한 걸작의 문이 열립니다.',
    tag: '자유의 비결',
  },
  {
    number: '08',
    title: '8. 도약하라, 그러면 보이지 않는 그물이 나타날 것이다 (Leap & Net Appears)',
    desc: '결과가 어떻게 될지 미리 알 수 없어도 신뢰하며 도약하세요. 우주는 언제나 당신의 담대한 도약에 화답합니다.',
    tag: '동시성의 기적',
  },
  {
    number: '09',
    title: '9. 창조적 영감의 우물은 결코 마르지 않는다 (Infinite Inspiration)',
    desc: '영감은 쓰면 쓸수록 더 맑고 풍요롭게 솟아납니다. 아티스트 데이트를 통해 매주 우물을 채워주세요.',
    tag: '무한한 자원',
  },
  {
    number: '10',
    title: '10. 창조성은 투쟁이 아니라 순수한 유희이다 (Creativity is Play)',
    desc: '심각함과 고통스러운 투쟁을 내려놓으세요. 어린아이처럼 즐겁게 놀며 낙서하듯 창작할 때 최고의 영감이 번뜩입니다.',
    tag: '순수한 유희',
  },
];

const ARTIST_WAY_AUDIOBOOK_NARRATIONS: Record<string, string> = {
  tools: `아티스트 웨이 창조성의 서, 제1장 3대 핵심 도구입니다.
첫째, 모닝 페이지: 매일 아침 눈뜨자마자 아무 생각 없이 손이 가는 대로 의식의 흐름을 3페이지 써내려가세요. 내면의 비판관을 잠재우고 순수한 창조적 통로를 여는 아침 정화 의식입니다.
둘째, 아티스트 데이트: 일주일에 한 번, 1~2시간 동안 오직 내 안의 창조적 내면아이와 단둘이 떠나는 모험입니다. 미술관, 문구점, 숲길 등 아이가 좋아하는 곳으로 가서 창조적 영감의 우물을 채우세요.
셋째, 창조적 걷기: 스마트폰을 내려놓고 20분간 자연과 도시를 홀로 걸으며 우주와의 교신을 회복하는 도구입니다.`,
  catalog: `제2장, 10가지 창조성 회복 도구 사전입니다.
창조적 몬스터 지우기는 나를 비난했던 사람들의 부정적 평가를 해체하는 도구입니다.
내면 아이 소통 놀이는 흙장난, 낙서, 크레파스 등 순수한 유희를 통해 예술적 생명력을 되살리는 방법입니다.
동시성 일기는 우주가 내 창조적 용기에 보내는 신비로운 기적과 인연의 신호를 기록하는 도구입니다.`,
  creed: `제3장, 창조성 10대 기본 원리와 5대 확언입니다.
1. 창조성은 신의 섭리입니다.
2. 우리는 모두 타고난 창조적 통로입니다.
3. 창조성을 발휘하는 것은 신의 선물에 화답하는 길입니다.
4. 우리는 창조하는 순간 가장 진실해집니다.
5. 창조성을 거부하는 것은 생명을 거부하는 것입니다.
6. 창조적 탐험에는 두려움이 따르는 것이 당연합니다.
7. 완벽주의는 창조성의 가장 큰 적이며, 서툰 시작을 허용해야 합니다.
8. 도약하라, 그러면 우주의 보이지 않는 그물이 나타날 것입니다.
9. 영감의 우물은 결코 마르지 않습니다.
10. 창조성은 고통스러운 투쟁이 아니라 어린아이 같은 순수한 유희입니다.
매일 아침 '나는 위대하고 풍요로운 우주의 거룩한 창조적 통로이다'를 소리 내어 선언하십시오.`,
  bible: `제4장, 줄리아 카메론의 창조성 회복 바이블입니다.
두려워하지 말고 붓을 들고 노트를 펼치세요. 도약하라, 그러면 우주가 보이지 않는 그물을 펼쳐줄 것입니다.`
};

export function ArtistWayHandbookModal({
  isOpen,
  onClose,
  onSelectTool,
  onConsult,
}: ArtistWayHandbookModalProps) {
  const [activeTab, setActiveTab] = useState<'tools' | 'catalog' | 'creed' | 'bible'>('tools');
  const [selectedToolId, setSelectedToolId] = useState<string>('morning_pages');
  const [showEnglish, setShowEnglish] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'core' | 'healing' | 'play'>('all');
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const currentTool = ARTIST_WAY_SACRED_TOOLS.find((t) => t.id === selectedToolId) || ARTIST_WAY_SACRED_TOOLS[0];

  const filteredCatalog = ARTIST_TOOLS_CATALOG.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  const handleCopyTool = () => {
    const textToCopy = `${currentTool.titleKo}\n\n${currentTool.quote}\n\n[실천 원칙]\n${currentTool.rules.join('\n')}\n\n[확언 선언문]\n${currentTool.chantKo}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <RealBookModal
      isOpen={isOpen}
      onClose={onClose}
      theme="muse"
      bookTitle="아티스트 웨이 창조성의 서"
      bookSubtitle="내면의 예술가 아이를 깨우는 신성한 창조성 회복"
      bookAuthor="Julia Cameron (줄리아 카메론)"
      epigraphQuote="창조성은 신이 우리에게 준 선물이며, 우리의 창조성을 발휘하는 것은 우리가 신에게 드리는 답례입니다."
      epigraphSource="The Artist's Way (아티스트 웨이)"
      chapterTabs={CHAPTER_TABS}
      activeTabId={activeTab}
      onTabChange={(id) => setActiveTab(id as any)}
      footerPageNumber={`- Chapter ${activeTab === 'tools' ? 'Ⅰ' : activeTab === 'catalog' ? 'Ⅱ' : activeTab === 'creed' ? 'Ⅲ' : 'Ⅳ'} -`}
      audiobookNarrations={ARTIST_WAY_AUDIOBOOK_NARRATIONS}
      defaultVoice="Kore"
    >
            {/* TAB 1: 3 SACRED TOOLS */}
            {activeTab === 'tools' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {ARTIST_WAY_SACRED_TOOLS.map((tool) => {
                    const isSelected = selectedToolId === tool.id;
                    return (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => setSelectedToolId(tool.id)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-500/15 border-indigo-400/50 shadow-[0_0_20px_rgba(99,102,241,0.15)] text-white'
                            : 'bg-white/[0.02] border-white/5 hover:border-indigo-500/20 text-white/60 hover:text-white'
                        }`}
                      >
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                          {tool.stepNumber}
                        </span>
                        <p className="text-sm font-bold text-white font-sans">{tool.titleKo}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Active Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-black/50 border border-indigo-500/20 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-widest block">
                        Julia Cameron · The Artist&apos;s Way
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 font-sans">
                        {currentTool.titleKo}
                      </h3>
                      <p className="text-xs text-white/50 mt-1 font-sans">{currentTool.desc}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowEnglish(!showEnglish)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-indigo-300 font-sans cursor-pointer transition-all"
                      >
                        {showEnglish ? '한글만 보기' : '영문 원문 함께보기'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyTool}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 hover:text-white font-sans cursor-pointer transition-all flex items-center gap-1"
                      >
                        {copiedText ? <Check size={14} className="text-emerald-400" /> : null}
                        <span>{copiedText ? '복사 완료' : '내용 복사'}</span>
                      </button>
                      <TTSButton
                        text={currentTool.chantKo}
                        voice="Kore"
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-xs text-indigo-300 font-sans cursor-pointer transition-all"
                      />
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                    <p className="text-sm font-serif italic text-indigo-200 leading-relaxed">
                      {currentTool.quote}
                    </p>
                    {showEnglish && (
                      <p className="text-xs font-serif italic text-indigo-200/50 mt-1.5">
                        {currentTool.quoteEn}
                      </p>
                    )}
                  </div>

                  {/* Rules */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold font-mono uppercase tracking-wider text-indigo-400 block">
                      핵심 실천 원칙 (Core Rules)
                    </span>
                    <div className="grid grid-cols-1 gap-2.5">
                      {currentTool.rules.map((rule, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-xs text-white/80 font-sans leading-relaxed break-keep">
                            {rule}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chanting & Affirmation Script */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold font-mono uppercase tracking-wider text-indigo-400 block">
                      아티스트 긍정 선언문 (Creative Affirmation)
                    </span>
                    <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20">
                      <p className="text-sm sm:text-base text-indigo-100 font-serif leading-loose whitespace-pre-line tracking-wide">
                        {currentTool.chantKo}
                      </p>
                      {showEnglish && (
                        <p className="text-xs text-indigo-200/50 font-serif italic leading-relaxed mt-3 pt-3 border-t border-white/5 whitespace-pre-line">
                          {currentTool.chantEn}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: 10 TOOLS */}
            {activeTab === 'catalog' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('all')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                        selectedCategory === 'all'
                          ? 'bg-indigo-500/20 border border-indigo-400/40 text-indigo-300'
                          : 'bg-white/5 border border-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      전체 ({ARTIST_TOOLS_CATALOG.length}개)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('core')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                        selectedCategory === 'core'
                          ? 'bg-indigo-500/20 border border-indigo-400/40 text-indigo-300'
                          : 'bg-white/5 border border-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      ✍️ 핵심 창조성 도구
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('healing')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                        selectedCategory === 'healing'
                          ? 'bg-indigo-500/20 border border-indigo-400/40 text-indigo-300'
                          : 'bg-white/5 border border-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      🩹 내면 아이 & 상처 치유
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('play')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                        selectedCategory === 'play'
                          ? 'bg-indigo-500/20 border border-indigo-400/40 text-indigo-300'
                          : 'bg-white/5 border border-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      🎈 영감 놀이 & 동료
                    </button>
                  </div>

                  <span className="text-[11px] text-white/40 font-sans">
                    도구를 누르면 오늘의 예술 추천 감상 및 창작 저널로 연동됩니다.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCatalog.map((tool) => (
                    <motion.div
                      key={tool.id}
                      whileHover={{ y: -3 }}
                      className="p-5 rounded-3xl bg-zinc-950/70 border border-indigo-500/20 hover:border-indigo-400/50 hover:bg-indigo-950/15 transition-all flex flex-col justify-between gap-4 group"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{tool.emoji}</span>
                          <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-indigo-300/70 group-hover:border-indigo-400/30 transition-colors">
                            {tool.category === 'core' ? 'Core Habit' : tool.category === 'healing' ? 'Inner Child' : 'Play & Inspiration'}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-white font-sans group-hover:text-indigo-200 transition-colors">
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
                          <span className="text-[9px] font-bold uppercase text-indigo-400 font-mono block">
                            실천 방법
                          </span>
                          <p className="text-[11px] text-indigo-100/80 font-sans leading-relaxed break-keep">
                            {tool.howToPractice}
                          </p>
                        </div>
                      </div>

                      {onSelectTool && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectTool(tool.id, tool.name, tool.affirmation);
                            onClose();
                          }}
                          className="w-full py-2.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-200 text-xs font-bold font-sans flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        >
                          <span>이 도구로 영감 깨우기</span>
                          <ChevronRight size={14} />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: BASIC PRINCIPLES (10 PRINCIPLES & 5 AFFIRMATIONS) */}
            {activeTab === 'creed' && (
              <div className="space-y-6">
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-black/70 to-purple-950/30 border border-indigo-500/30 space-y-6">
                  <div className="text-center space-y-2 max-w-xl mx-auto">
                    <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-widest">
                      The Basic Principles of Creativity
                    </span>
                    <h3 className="text-2xl font-bold text-white font-sans">
                      줄리아 카메론의 10대 창조성 기본 원리
                    </h3>
                    <p className="text-xs text-white/60 font-sans">
                      창조성은 당신이 세상에 줄 수 있는 가장 순수하고 거룩한 사랑의 표현입니다.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ARTIST_BASIC_PRINCIPLES.map((rule, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2 text-left">
                        <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase px-2 py-0.5 rounded-md bg-indigo-400/10 border border-indigo-400/20 inline-block">
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
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                      <Sun size={20} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white font-sans">
                        매일 아침 외우는 아티스트 5대 파워 선언
                      </h4>
                      <p className="text-xs text-white/40 font-mono">
                        by Julia Cameron (The Artist&apos;s Way)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    {[
                      '1. "나는 위대하고 풍요로운 우주의 거룩한 창조적 통로이다."',
                      '2. "나의 창작은 신성한 선물이며, 세상은 나의 고유한 목소리를 기다린다."',
                      '3. "나는 완벽주의를 버리고, 어린아이처럼 즐겁게 놀며 표현한다."',
                      '4. "도약하라, 그러면 우주의 그물이 나타날 것이다."',
                      '5. "나의 영감의 우물은 매일 새롭고 풍요롭게 채워진다."',
                    ].map((mantra, i) => (
                      <div key={i} className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/10 text-xs sm:text-sm text-indigo-100 font-sans flex items-center justify-between">
                        <span>{mantra}</span>
                        <TTSButton text={mantra} voice="Kore" className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-indigo-300" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: BIBLE (AI COACHING QUESTIONS) */}
            {activeTab === 'bible' && (
              <div className="space-y-6">
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-black/70 to-blue-950/30 border border-indigo-500/30 space-y-4 text-left">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-widest">
                      The Artist&apos;s Way AI Coaching Bible
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-sans">
                      아티스트 웨이 AI 창조성 코칭 질문 가이드
                    </h3>
                    <p className="text-xs text-white/60 font-sans leading-relaxed">
                      궁금한 창조성 질문을 클릭하면 루시(AI)와 1:1 심층 상담이 즉시 시작됩니다.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ARTIST_WAY_BIBLE_SECTIONS.map((section) => (
                    <div
                      key={section.id}
                      className="p-6 rounded-3xl bg-zinc-950/70 border border-indigo-500/20 space-y-4 text-left flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                            <Sparkles size={16} />
                          </div>
                          <h4 className="text-sm font-bold text-white font-sans">
                            {section.title}
                          </h4>
                        </div>

                        <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                          <span className="text-[9px] font-mono font-bold uppercase text-indigo-400 block">
                            핵심 원리
                          </span>
                          <ul className="space-y-1">
                            {section.principles.map((pr, i) => (
                              <li key={i} className="text-[11px] text-white/70 font-sans leading-relaxed flex items-start gap-1.5">
                                <span className="text-indigo-400 font-bold">•</span>
                                <span>{pr}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <span className="text-[9px] font-mono font-bold uppercase text-indigo-400 block">
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
                            className="w-full p-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-left text-[11px] text-indigo-200 hover:text-white font-sans flex items-center justify-between gap-2 transition-all cursor-pointer group"
                          >
                            <span className="leading-snug break-keep">{step}</span>
                            <ChevronRight size={14} className="shrink-0 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
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

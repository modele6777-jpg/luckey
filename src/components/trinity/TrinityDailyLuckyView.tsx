import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Zap,
  Check,
  Copy,
  Compass,
  Clock,
  Palette,
  Hash,
  ChevronRight,
  RefreshCw,
  SunMedium,
  Droplets,
  HeartHandshake,
  Flame,
  Wand2,
  Quote,
  BookOpen,
  ScrollText,
  Shuffle,
} from 'lucide-react';
import { z } from 'zod';
import { useApp, getPersistentUserProfile } from '@/contexts/AppContext';
import { db, doc, getDoc, setDoc, onSnapshot, serverTimestamp } from '@/lib/firebase';
import { calculateDetailedSaju, type SajuAnalysisResult } from '@/lib/sajuAnalysis';
import { invokeLLMStructured } from '@/lib/ai';
import { recordPrismFeature } from '@/lib/prismOmniSync';
import { TTSButton } from '@/components/TTSButton';
import { getTodayDateKey } from '@/lib/dailyCache';
import { sendDailyLuckyToLucy } from '@/lib/oracleDeepInsight';
import { CelestialTalismanCard } from './CelestialTalismanCard';

// 🌟 Zod Schema for AI-Generated Lucky Attunement Report with Spells, Quotes, and Stories
const TrinityDailyLuckySchema = z.object({
  luckScore: z.number().min(50).max(100).describe('오늘의 행운 공명 지수 (50~100점)'),
  luckLevelTitle: z.string().describe('오늘의 운세 레벨 칭호 (예: LV.4 황금빛 비상 대길)'),
  cosmicTide: z.string().describe('오늘 질문자를 감싸는 천상의 거대한 운명적 조류와 긍정적 기운 해설 (2~3문장)'),
  goldenKey: z.string().optional().describe('오늘의 결정적 개운 비법 (1~2문장)'),
  miracleCloverMessage: z.string().describe('네잎클로버가 개화했을 때 주어지는 기적과 뜻밖의 행운에 관한 축복 한 문장'),
  luckyColor: z.string().describe('오늘의 개운 색상 이름 (예: 엠버 골드)'),
  luckyColorHex: z.string().describe('개운 색상 HEX 코드 (예: #F59E0B)'),
  luckyColorReason: z.string().describe('이 색상이 오늘의 부족한 기운을 채워주는 이유 (1문장)'),
  luckyNumbers: z.array(z.number()).describe('오늘의 행운의 숫자 3개'),
  luckyDirection: z.string().describe('오늘의 길한 방위 (예: 남동쪽 - 재물과 귀인 방위)'),
  goldenHour: z.string().describe('오늘 가장 운이 따르는 황금 시간대 (예: 오후 2시 ~ 4시)'),
  dailyAmuletBlessing: z.string().describe('황금 부적에 새겨진 천상의 한 줄 수호 축복문'),

  // 🔮 1. 행운의 주문 (Lucky Incantation & Chant)
  luckySpell: z.object({
    mantra: z.string().describe('소리 내어 3번 외우는 신비로운 행운의 주문 원문'),
    origin: z.string().describe('주문의 기원 또는 영적 속성 (예: 천상 광명진언 / 고대 라틴 풍요의 주송 / 오행 개운 진언)'),
    meaning: z.string().describe('이 주문이 부르는 행운의 기운과 뜻 해설 (1~2문장)'),
    howToChant: z.string().describe('주문을 낭독하는 마음가짐 가이드'),
  }).describe('오늘의 기운을 밝히는 행운의 주문'),

  // ✨ 2. 행운의 글귀 (Celestial Lucky Quote & Wisdom)
  luckyQuote: z.object({
    quote: z.string().describe('마음의 주파수를 높이고 행운을 끌어당기는 깊이 있는 명언이나 글귀 한 줄'),
    author: z.string().describe('글귀의 출처나 지혜의 현자'),
    wisdomLesson: z.string().describe('이 글귀가 오늘 나에게 건네는 통찰과 실천 조언 (1~2문장)'),
  }).describe('영혼의 진동수를 높이는 행운의 글귀'),

  // 📖 3. 운이 올라가는 이야기 (Fortune-Boosting Story & Parable)
  fortuneStory: z.object({
    title: z.string().describe('운이 올라가는 이야기 제목'),
    story: z.string().describe('작은 행동, 마음가짐, 베풂, 감사로 대운을 바꾸거나 뜻밖의 행운을 만난 지혜로운 3~4문단의 짧고 감동적인 일화/우화'),
    moral: z.string().describe('이 이야기에서 얻는 오늘의 핵심 개운 법칙 한 줄'),
  }).describe('운을 여는 지혜로운 이야기'),

  quests: z.array(
    z.object({
      id: z.string(),
      leafName: z.string().describe('클로버 잎사귀 이름 (예: 1st Leaf: 정화의 잎)'),
      title: z.string().describe('실천 과제 제목'),
      element: z.string().describe('관련 오행 (목/화/토/금/수)'),
      duration: z.string().describe('소요 시간 (예: 1분)'),
      concreteAction: z.string().describe('지금 당장 따라할 수 있는 1~3분 초구체적 행동 지침'),
      benefit: z.string().describe('이 행동이 가져다주는 현실적 개운 효과'),
    })
  ).describe('세잎클로버를 완성하는 3가지 구체적 실천 과제'),
});

type TrinityDailyLuckyData = z.infer<typeof TrinityDailyLuckySchema>;

// Rich Diverse Lucky Quotes Pool (30+ Inspiring Multi-Tradition Wisdom Quotes)
export const DIVERSE_LUCKY_QUOTES = [
  {
    quote: '“운(運)은 준비된 마음이 우연한 기회를 만났을 때 피어나는 기적의 꽃이다.”',
    author: '고대 로마의 철학자 세네카',
    wisdomLesson: '오늘 당신에게 다가오는 크고 작은 우연들을 흘려보내지 마세요. 맑은 직관으로 맞이할 때 그것이 거대한 대운의 시작이 됩니다.',
  },
  {
    quote: '“행운은 긍정의 파동을 품고 스스로 빛나는 사람에게 자석처럼 끌려온다.”',
    author: '우주 끌어당김의 법칙',
    wisdomLesson: '불평과 조급함을 내려놓고 오늘 내게 주어진 작은 것에 미소 지으세요. 높은 진동수의 마음이 가장 큰 행운을 끌어당깁니다.',
  },
  {
    quote: '“작은 친절과 정성을 매일 쌓아가는 자에게 우주는 결코 문을 닫지 않는다.”',
    author: '동양의 지혜 명심보감',
    wisdomLesson: '오늘 만나는 인연에게 건네는 따뜻한 말 한마디가 보이지 않는 귀인의 문을 활짝 열어줍니다.',
  },
  {
    quote: '“우리의 삶은 우리 생각이 만들어가는 가장 거룩하고 눈부신 예술이다.”',
    author: '명상록의 저자 마르쿠스 아우렐리우스',
    wisdomLesson: '외부 상황을 바꿀 수 없을 때도 마음의 해석은 내가 선택할 수 있습니다. 품위 있는 생각이 품위 있는 운명을 짓습니다.',
  },
  {
    quote: '“당신이 통제할 수 있는 내면의 태도에 집중하라. 나머지는 우주의 신비에 맡길 때 깊은 평온이 찾아온다.”',
    author: '스토아 철학자 에픽테토스',
    wisdomLesson: '통제할 수 없는 일로 불안해하지 마세요. 오늘 내가 할 수 있는 정갈한 한 걸음에만 온 정성을 쏟으세요.',
  },
  {
    quote: '“가장 훌륭한 덕은 물과 같다. 물은 만물을 이롭게 하면서도 다투지 않고 낮은 곳으로 흐른다.”',
    author: '노자 도덕경 (상선약수)',
    wisdomLesson: '고집과 에고를 내려놓고 물처럼 유연하게 흐를 때, 세상 모든 장애물이 길을 비켜줍니다.',
  },
  {
    quote: '“마음의 거울을 맑게 닦고 비우면, 온 우주의 찬란한 지혜와 결실이 그 안에 비친다.”',
    author: '장자의 제물론',
    wisdomLesson: '불필요한 비교와 과욕을 비워내세요. 텅 빈 마음에만 새로운 대운과 영감이 가득 찰 수 있습니다.',
  },
  {
    quote: '“바람이 지나간 대숲은 소리를 남기지 않고, 기러기 지나간 연못은 그림자를 남기지 않는다.”',
    author: '선(禪)의 지혜 채근담',
    wisdomLesson: '지나간 일에 마음을 빼앗기지 마세요. 담담하게 현재에 머무는 자에게 흔들리지 않는 대운이 깃듭니다.',
  },
  {
    quote: '“소망이 이미 이루어진 감정 속에 머물러라. 세상은 당신의 의식을 거울처럼 비출 뿐이다.”',
    author: '의식의 창조자 네빌 고다드',
    wisdomLesson: '‘원한다’는 결핍 대신 ‘이미 감사하다’는 충만함을 품으세요. 상상 속 확신이 물리적 현실을 재배열합니다.',
  },
  {
    quote: '“잠재의식의 풍요를 온전히 신뢰하는 자는 인생에서 결코 메마름을 경험하지 않는다.”',
    author: '잠재의식의 대가 조셉 머피',
    wisdomLesson: '오늘 아침과 밤, 내면 깊은 곳에 ‘부, 성공, 평온’이라는 씨앗을 속삭이세요. 무의식이 기적을 꽃피웁니다.',
  },
  {
    quote: '“내 삶의 모든 닫힌 문 뒤에는 상상보다 훨씬 눈부신 신성한 가능성의 문이 열려 있다.”',
    author: '영적 성공 철학자 플로렌스 스코벨 쉰',
    wisdomLesson: '뜻대로 풀리지 않는 순간도 더 큰 축복을 위한 우주의 재배치임을 기억하고 미소 지으세요.',
  },
  {
    quote: '“감사는 우주의 풍요와 당신의 주파수를 단 1초 만에 정렬시키는 가장 강력한 황금 열쇠다.”',
    author: '시크릿의 론다 번',
    wisdomLesson: '오늘 하루 감사할 일 세 가지만 찾아보세요. 감사의 감정이 솟구치는 순간 부족함의 파동은 소멸합니다.',
  },
  {
    quote: '“생각이 머무는 자리에 에너지가 흐르고, 에너지가 흐르는 곳에 현실의 결실이 창조된다.”',
    author: '마인드셋 멘토 밥 프록터',
    wisdomLesson: '두려움 대신 당신이 진정으로 사랑하고 바라는 비전에 시선을 고정하세요.',
  },
  {
    quote: '“마음이 품고 온전히 믿는 것은 무엇이든 인간이 성취할 수 있는 현실이 된다.”',
    author: '성공학의 아버지 나폴레온 힐',
    wisdomLesson: '의심의 안개를 걷어내고 명확한 목표를 마음에 품으세요. 신념은 보이지 않는 길을 만들어냅니다.',
  },
  {
    quote: '“자신의 무의식을 빛으로 밝혀 의식화할 때, 우리는 비로소 운명을 지배하는 주인이 된다.”',
    author: '심층심리학자 칼 융',
    wisdomLesson: '내 안의 그림자와 감정을 억누르지 말고 다정하게 알아차려 주세요. 알아차림이 곧 치유와 개운의 시작입니다.',
  },
  {
    quote: '“자극과 반응 사이에는 선택의 공간이 있고, 그 선택 속에 인간의 존엄과 자유가 숨 쉬고 있다.”',
    author: '로고테라피 창시자 빅터 프랭클',
    wisdomLesson: '외부 사건에 즉각 반응하지 말고 3초간 숨을 고르세요. 현명한 반응이 오늘의 결과를 바꿉니다.',
  },
  {
    quote: '“당신이 애타게 찾고 있는 빛 또한, 지금 이 순간 당신을 간절히 찾고 있다.”',
    author: '페르시아 신비주의 시인 루미',
    wisdomLesson: '당신은 이미 온전하며, 당신이 원하는 행복과 풍요는 이미 당신을 향해 걸어오고 있습니다.',
  },
  {
    quote: '“새는 알을 깨고 나온다. 알은 세계다. 태어나려는 자는 하나의 세계를 파괴해야 한다.”',
    author: '데미안의 저자 헤르만 헤세',
    wisdomLesson: '익숙함이라는 껍질을 깨는 작은 도전을 오늘 감행하세요. 경계 너머에 새로운 비상이 기다립니다.',
  },
  {
    quote: '“행복은 완성된 완제품으로 주어지는 것이 아니라, 오늘 당신이 베푸는 작은 배려와 미소에서 피어난다.”',
    author: '달라이 라마',
    wisdomLesson: '행복을 조건으로 미루지 말고, 지금 만나는 이에게 따뜻한 온기를 선물하며 스스로 행복해지세요.',
  },
  {
    quote: '“극에 달하면 변화하고, 변화하면 통하며, 통하면 영원히 번영한다.”',
    author: '주역(周易) 계사전',
    wisdomLesson: '막다른 골목처럼 느껴질 때가 바로 새로운 돌파구가 열리는 지점입니다. 유연하게 궤도를 수정하세요.',
  },
  {
    quote: '“숨을 들이쉬며 내 몸을 평온하게 하고, 숨을 내쉬며 미소를 짓는다. 지금 이 순간이 가장 경이로운 순간이다.”',
    author: '평화의 스승 틱낫한',
    wisdomLesson: '과거의 후회와 미래의 걱정을 내려놓고, 오직 지금 이 숨 한 모금의 생명력에 감사하세요.',
  },
  {
    quote: '“무소유란 아무것도 갖지 않는 것이 아니라, 불필요한 집착을 털어내어 맑아지는 영혼의 자유다.”',
    author: '맑고 향기로운 법정 스님',
    wisdomLesson: '마음을 무겁게 짓누르는 사소한 욕심과 시기를 털어내면, 놀랍도록 가볍고 눈부신 운이 들어옵니다.',
  },
  {
    quote: '“덕(德)이 있는 사람은 결코 외롭지 않으니, 반드시 뜻을 함께하는 귀인이 곁을 지킨다.”',
    author: '공자 논어 (이인편)',
    wisdomLesson: '진실한 마음으로 사람을 대하세요. 오늘 베푼 은덕은 결코 사라지지 않고 가장 큰 수호로 돌아옵니다.',
  },
  {
    quote: '“마음이 일어나면 온갖 법(法)이 일어나고, 마음이 쉬면 해골물도 달콤한 감로수가 된다.”',
    author: '원효 대사의 일체유심조',
    wisdomLesson: '모든 것은 마음먹기에 달렸습니다. 오늘 세상의 모든 상황을 나를 돕는 은총으로 바라보세요.',
  },
  {
    quote: '“당신이 무언가를 온 마음으로 갈망할 때, 온 우주는 당신의 소망이 실현되도록 은밀히 음모를 꾸민다.”',
    author: '연금술사의 파울로 코엘료',
    wisdomLesson: '포기하지 않고 발걸음을 옮길 때, 보이지 않던 귀인과 기회의 실마리가 퍼즐처럼 맞춰집니다.',
  },
  {
    quote: '“할 수 있다고 믿든 할 수 없다고 믿든, 당신이 믿는 그대로 당신의 세상이 된다.”',
    author: '헨리 포드',
    wisdomLesson: '스스로의 한계를 규정짓지 마세요. 내면의 무한한 가능성을 선언할 때 잠재력이 폭발합니다.',
  },
  {
    quote: '“자신을 온전히 신뢰하라. 우주는 스스로를 믿고 당당하게 나아가는 영혼에게 기꺼이 길을 비켜준다.”',
    author: '초월주의 철학자 랄프 왈도 에머슨',
    wisdomLesson: '타인의 시선에 휘둘리지 말고 내 안의 고요한 나침반을 따르세요. 당신의 직관이 정답입니다.',
  },
  {
    quote: '“인생에는 두 가지 삶이 있다. 하나는 기적이란 없다고 믿는 삶이고, 다른 하나는 모든 순간이 기적이라고 믿는 삶이다.”',
    author: '알버트 아인슈타인',
    wisdomLesson: '오늘 당신이 걷고 숨 쉬고 생각하는 모든 평범한 순간들이 우주가 선사한 눈부신 기적입니다.',
  },
];

// Helper to generate deterministic day-seeded base luck data
function generateDailyLuckyFallback(
  dateKey: string,
  saju: SajuAnalysisResult | null,
  userName = '질문자'
): TrinityDailyLuckyData {
  let hash = 0;
  const seed = `${dateKey}_${userName}_${saju?.dayMaster?.korean || 'trinity'}`;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);
  const baseScore = 78 + (absHash % 18); // 78 ~ 95

  const colors = [
    { name: '로열 엠버 골드', hex: '#F59E0B', reason: '태양의 충만한 화기운으로 정체된 에너지를 녹이고 재물운을 활성화합니다.' },
    { name: '에메랄드 포레스트', hex: '#10B981', reason: '새싹의 목기운으로 활력과 새로운 기회의 싹을 틔웁니다.' },
    { name: '사파이어 딥 블루', hex: '#3B82F6', reason: '지혜로운 수기운으로 감정의 파도를 평온하게 다스리고 직관을 밝힙니다.' },
    { name: '루비 크림슨 레드', hex: '#EF4444', reason: '열정적인 화기운으로 용기 있는 결단과 당당한 추진력을 돕습니다.' },
    { name: '플래티넘 펄 화이트', hex: '#F8FAFC', reason: '정화의 금기운으로 불필요한 잡념과 군더더기 카르마를 털어냅니다.' },
  ];
  const chosenColor = colors[absHash % colors.length];

  const directions = ['동남쪽 (귀인과 재물운)', '동쪽 (새로운 활력과 성장)', '남쪽 (명예와 인기운)', '서남쪽 (안정과 결실)'];
  const chosenDir = directions[absHash % directions.length];

  const hours = ['오전 9시 ~ 11시 (사시 - 번영의 시간)', '오후 2시 ~ 4시 (미시 - 결실의 시간)', '오후 7시 ~ 9시 (술시 - 지혜의 시간)'];
  const chosenHour = hours[absHash % hours.length];

  const num1 = (absHash % 9) + 1;
  const num2 = ((absHash * 3) % 9) + 1;
  const num3 = ((absHash * 7) % 9) + 1;

  const dayMasterSymbol = saju?.dayMaster?.symbolName || '빛나는 본원';

  // Spells Pool
  const spells = [
    {
      mantra: '수리수리 마하수리 수수리 사바하 (修利修利 摩訶修利 修修利 娑婆訶)',
      origin: '정구업진언(淨口業眞言) · 액운 정화와 길운 초대주',
      meaning: '입과 마음으로 지은 탁한 업을 깨끗이 비워내고, 맑고 신성한 대길의 서광을 가득 채우는 정화 주문입니다.',
      howToChant: '양손을 가슴에 모으고 편안한 호흡과 함께 소리 내어 3번 외우세요.',
    },
    {
      mantra: '포르투나 아우레아 아페리 투르 (Fortuna Aurea Aperitur)',
      origin: '고대 로마 황금 풍요의 주송 (Golden Portal Mantra)',
      meaning: '“우주의 황금빛 행운의 문이 내 앞에 활짝 열린다”라는 뜻으로, 닫혀 있던 기회의 길을 단숨에 열어젖히는 주문입니다.',
      howToChant: '어깨를 펴고 당당한 목소리로 눈앞에 황금빛 문이 열리는 장면을 상상하며 3번 외우세요.',
    },
    {
      mantra: '옴 아모가 바이로차나 마하무드라 마니 파드마 즈바라 프라바르타야 훔',
      origin: '천상 광명진언(光明眞言) · 대길 만복 개운주',
      meaning: '천상의 영원한 지혜와 광명이 내면의 모든 어둠과 두려움을 녹이고, 최고의 행운과 안정을 피워내는 주문입니다.',
      howToChant: '눈을 지그시 감고 온몸에 따뜻한 빛이 감도는 것을 느끼며 3번 읊조리세요.',
    },
  ];
  const chosenSpell = spells[absHash % spells.length];

  // Quotes Pool from rich 30+ diverse wisdom pool
  const chosenQuote = DIVERSE_LUCKY_QUOTES[absHash % DIVERSE_LUCKY_QUOTES.length];

  // Stories Pool
  const stories = [
    {
      title: '물 한 잔의 버들잎이 부른 거대한 대운',
      story: `옛날 한 나그네가 뙤약볕 속에서 지쳐 쓰러질 뻔했을 때, 길가의 작은 오두막에 살던 노인이 정성껏 우린 맑은 냉수 한 잔을 건넸습니다.\n\n노인은 물 위에 버들잎 서너 장을 띄워 주며 말했습니다. "갈증이 심할 때 급히 마시면 체하니, 잎을 후후 불어가며 천천히 드시게." 나그네는 그 섬세한 배려에 깊이 감동하며 물을 마셨습니다.\n\n세월이 흘러 그 나그네는 나라의 큰 재상이 되었고, 그 은혜를 잊지 않고 노인의 마을에 큰 저수지와 다리를 놓아 온 마을 사람들을 가뭄에서 구했습니다. 노인의 작은 버들잎 배려 하나가 마을 전체의 운명을 바꾼 기적의 씨앗이 된 것입니다.`,
      moral: '작은 배려와 정성으로 건넨 온기는 우주를 돌아 가장 큰 대운의 파도로 나에게 돌아옵니다.',
    },
    {
      title: '돌멩이를 황금으로 바꾼 목수의 감사',
      story: `어느 가난한 목수가 길을 걷다 발에 채인 거친 돌멩이를 보았습니다. 대부분의 사람들은 짜증을 내며 걷어찼지만, 목수는 돌을 주워 들고 말했습니다. "오늘 나를 넘어뜨리지 않고 발밑을 조심하게 일깨워주어 고맙구나."\n\n목수는 그 돌을 집으로 가져와 정성스럽게 깎고 다듬었습니다. 그러자 거친 겉면 속에 숨겨져 있던 영롱한 옥(玉)의 빛깔이 드러났습니다. 지나가던 대상인이 그 옥을 보고 거금을 주고 사들였고, 목수는 큰 공방을 열어 수많은 사람을 돕는 거상이 되었습니다.\n\n장애물처럼 보이는 상황 속에서도 감사를 발견하는 사람에게는 모든 걸림돌이 가장 빛나는 황금의 디딤돌로 변합니다.`,
      moral: '걸림돌 앞에서 불평 대신 감사를 선택할 때, 숨겨져 있던 기적의 옥(玉)이 모습을 드러냅니다.',
    },
  ];
  const chosenStory = stories[absHash % stories.length];

  return {
    luckScore: baseScore,
    luckLevelTitle: baseScore >= 90 ? 'LV.5 천우신조 (기적의 대길운)' : 'LV.4 황금빛 도약 (상승 대길)',
    cosmicTide: `오늘은 당신의 사주 본원(${dayMasterSymbol})에 천상의 맑고 따스한 서광이 드리우는 날입니다. 마음속에 품어온 긍정적인 확신이 현실의 우호적인 기회와 동조하여 뜻밖의 순풍을 일으킵니다.`,
    goldenKey: `오늘 가장 중요한 결단이나 대화는 ${chosenHour}에 시도하세요. 망설이지 않고 직관을 믿고 내딛는 한 걸음이 큰 행운의 문을 엽니다.`,
    miracleCloverMessage: `“세잎클로버의 '일상의 행복'이 모여, 기적을 부르는 '네잎클로버의 대길 행운'으로 온전히 피어났습니다.”`,
    luckyColor: chosenColor.name,
    luckyColorHex: chosenColor.hex,
    luckyColorReason: chosenColor.reason,
    luckyNumbers: [num1, num2, num3],
    luckyDirection: chosenDir,
    goldenHour: chosenHour,
    dailyAmuletBlessing: `“당신이 내딛는 모든 발걸음마다 우주의 황금빛 은총과 행운이 동행합니다.”`,
    luckySpell: chosenSpell,
    luckyQuote: chosenQuote,
    fortuneStory: chosenStory,
    quests: [
      {
        id: 'water_cleanse',
        leafName: '1st Leaf : 정화의 잎',
        title: '미온수 한 잔 & 마음 비움 호흡',
        element: '수(水)',
        duration: '1분',
        concreteAction: '미온수 1컵을 30초간 천천히 음미하며 마시고, "오늘 하루도 내게 순조롭게 흐른다"라고 속으로 1번 확언하세요.',
        benefit: '체내 노폐물 배출 및 묵은 탁기 정화',
      },
      {
        id: 'sun_breathe',
        leafName: '2nd Leaf : 활력의 잎',
        title: '창가 햇살 3분 쬐기 & 가슴 펴기',
        element: '화(火)',
        duration: '2분',
        concreteAction: '창가나 야외에서 자연광을 쬐며 양팔을 벌려 가슴을 펴고 심호흡 3회를 하세요 (또는 책상 주변 3곳 정돈).',
        benefit: '정체된 에너지 순환 및 추진력 충전',
      },
      {
        id: 'kindness_act',
        leafName: '3rd Leaf : 인연의 잎',
        title: '1줄 응원 톡 또는 거울 속 나에게 미소',
        element: '목(木)',
        duration: '30초',
        concreteAction: '소중한 지인에게 따뜻한 안부 1줄을 보내거나, 거울 속 내 눈을 바라보며 "오늘도 참 잘하고 있어"라고 미소 지으세요.',
        benefit: '귀인운 활성화 및 관계의 막힘 해소',
      },
    ],
  };
}

interface TrinityDailyLuckyViewProps {
  onConsult?: (message: string) => void;
}

export function TrinityDailyLuckyView({ onConsult }: TrinityDailyLuckyViewProps) {
  const { sharedState, updateSharedState, firebaseUser, openLucyChat, sendUnifiedMessage } = useApp();
  const todayKey = getTodayDateKey();
  const effectiveUid = firebaseUser?.uid || 'guest';
  const storageKey = `trinity_daily_lucky_data_v4_${effectiveUid}_${todayKey}`;
  const questStorageKey = `trinity_daily_lucky_quests_v4_${effectiveUid}_${todayKey}`;
  const boostStorageKey = `trinity_daily_lucky_boost_v4_${effectiveUid}_${todayKey}`;

  const profile = sharedState?.userProfile || getPersistentUserProfile();
  const saju = useMemo(() => (profile ? calculateDetailedSaju(profile) : null), [profile]);
  const rawUserName = profile?.basic?.nickname?.trim() || profile?.basic?.name?.trim();
  const userName = (rawUserName && rawUserName !== '여행자') ? rawUserName : '제제';

  // State initialization with SharedState -> LocalStorage -> Fallback priority
  const [luckyData, setLuckyData] = useState<TrinityDailyLuckyData>(() => {
    try {
      const sharedLucky = sharedState?.trinityDailyLucky?.[todayKey]?.luckyData;
      if (sharedLucky && typeof sharedLucky === 'object' && sharedLucky.luckScore) {
        return sharedLucky as TrinityDailyLuckyData;
      }
      const cached = localStorage.getItem(storageKey) ||
        localStorage.getItem(`trinity_daily_lucky_data_v4_guest_${todayKey}`) ||
        localStorage.getItem(`trinity_daily_lucky_data_v4_${todayKey}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.luckScore) return parsed;
      }
    } catch (_) {}
    return generateDailyLuckyFallback(todayKey, saju, userName);
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeWisdomTab, setActiveWisdomTab] = useState<'spell' | 'quote' | 'story'>('spell');
  const [chantCount, setChantCount] = useState<number>(0);

  const [completedQuests, setCompletedQuests] = useState<Record<string, boolean>>(() => {
    try {
      const sharedQuests = sharedState?.trinityDailyLucky?.[todayKey]?.completedQuests;
      if (sharedQuests && typeof sharedQuests === 'object') {
        return sharedQuests;
      }
      const cached = localStorage.getItem(questStorageKey) ||
        localStorage.getItem(`trinity_daily_lucky_quests_v4_guest_${todayKey}`) ||
        localStorage.getItem(`trinity_daily_lucky_quests_v4_${todayKey}`);
      if (cached) return JSON.parse(cached);
    } catch (_) {}
    return {};
  });

  const [isBoosted, setIsBoosted] = useState<boolean>(() => {
    const sharedBoost = sharedState?.trinityDailyLucky?.[todayKey]?.isBoosted;
    if (typeof sharedBoost === 'boolean') return sharedBoost;
    return (
      localStorage.getItem(boostStorageKey) === 'true' ||
      localStorage.getItem(`trinity_daily_lucky_boost_v4_guest_${todayKey}`) === 'true' ||
      localStorage.getItem(`trinity_daily_lucky_boost_v4_${todayKey}`) === 'true'
    );
  });

  const [showBoostCelebration, setShowBoostCelebration] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 🔄 1. Reactive Sync from AppContext / SharedState across tabs and devices
  useEffect(() => {
    const todayItem = sharedState?.trinityDailyLucky?.[todayKey];
    if (todayItem) {
      if (todayItem.luckyData && typeof todayItem.luckyData === 'object') {
        setLuckyData(todayItem.luckyData as TrinityDailyLuckyData);
        try {
          localStorage.setItem(storageKey, JSON.stringify(todayItem.luckyData));
        } catch (_) {}
      }
      if (todayItem.completedQuests && typeof todayItem.completedQuests === 'object') {
        setCompletedQuests((prev) => ({ ...prev, ...todayItem.completedQuests }));
        try {
          localStorage.setItem(questStorageKey, JSON.stringify(todayItem.completedQuests));
        } catch (_) {}
      }
      if (typeof todayItem.isBoosted === 'boolean') {
        setIsBoosted((prev) => prev || todayItem.isBoosted);
        try {
          localStorage.setItem(boostStorageKey, String(todayItem.isBoosted));
        } catch (_) {}
      }
    }
  }, [sharedState?.trinityDailyLucky, todayKey, storageKey, questStorageKey, boostStorageKey]);

  // 🔄 2. Custom Event Listener for instant intra-window and service worker sync
  useEffect(() => {
    const handleLuckySynced = (e: Event) => {
      const customEvent = e as CustomEvent;
      const detail = customEvent.detail;
      const dataToApply = detail?.[todayKey] || detail;
      if (dataToApply?.luckyData) {
        setLuckyData(dataToApply.luckyData as TrinityDailyLuckyData);
      }
      if (dataToApply?.completedQuests) {
        setCompletedQuests(dataToApply.completedQuests);
      }
      if (typeof dataToApply?.isBoosted === 'boolean') {
        setIsBoosted(dataToApply.isBoosted);
      }
    };

    window.addEventListener('prism:trinity_lucky_updated', handleLuckySynced);
    window.addEventListener('trinity:daily_lucky_synced', handleLuckySynced);
    return () => {
      window.removeEventListener('prism:trinity_lucky_updated', handleLuckySynced);
      window.removeEventListener('trinity:daily_lucky_synced', handleLuckySynced);
    };
  }, [todayKey]);

  // 🔄 3. Real-time Cross-Device Firestore Sync Listener (PC <-> Mobile)
  useEffect(() => {
    if (!firebaseUser?.uid) return;

    const docRef = doc(db, 'trinity_daily_lucky', firebaseUser.uid, 'days', todayKey);
    const unsub = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const remote = snap.data();
          if (remote?.luckyData && typeof remote.luckyData === 'object') {
            setLuckyData(remote.luckyData as TrinityDailyLuckyData);
            try {
              localStorage.setItem(storageKey, JSON.stringify(remote.luckyData));
            } catch (_) {}
          }
          if (remote?.completedQuests && typeof remote.completedQuests === 'object') {
            setCompletedQuests(remote.completedQuests);
            try {
              localStorage.setItem(questStorageKey, JSON.stringify(remote.completedQuests));
            } catch (_) {}
          }
          if (typeof remote?.isBoosted === 'boolean') {
            setIsBoosted(remote.isBoosted);
            try {
              localStorage.setItem(boostStorageKey, String(remote.isBoosted));
            } catch (_) {}
          }
        }
      },
      (err) => {
        console.warn('[Trinity Daily Lucky] Firestore onSnapshot notice:', err?.message || err);
      }
    );

    return () => unsub();
  }, [firebaseUser?.uid, todayKey, storageKey, questStorageKey, boostStorageKey]);

  // Dynamic Luck & Clover Calculation
  const totalQuestCount = luckyData.quests.length || 3;
  const completedQuestCount = Object.values(completedQuests).filter(Boolean).length;
  const questBonus = completedQuestCount * 3; // +3 per quest
  const boostBonus = isBoosted ? 8 : 0;
  const dynamicLuckScore = Math.min(100, luckyData.luckScore + questBonus + boostBonus);

  // Clover Status
  const isLeaf1Active = !!completedQuests[luckyData.quests[0]?.id || 'water_cleanse'];
  const isLeaf2Active = !!completedQuests[luckyData.quests[1]?.id || 'sun_breathe'];
  const isLeaf3Active = !!completedQuests[luckyData.quests[2]?.id || 'kindness_act'];
  const isThreeLeafComplete = isLeaf1Active && isLeaf2Active && isLeaf3Active;
  const isFourLeafActive = isThreeLeafComplete || isBoosted;

  // Fetch or Generate tailored AI Lucky Report
  const fetchTailoredLuckyReport = useCallback(
    async (force = false) => {
      // 1. Check sharedState first (cross-device source of truth)
      if (!force && sharedState?.trinityDailyLucky?.[todayKey]?.luckyData) {
        const sharedItem = sharedState.trinityDailyLucky[todayKey];
        setLuckyData(sharedItem.luckyData as TrinityDailyLuckyData);
        if (sharedItem.completedQuests) setCompletedQuests(sharedItem.completedQuests);
        if (typeof sharedItem.isBoosted === 'boolean') setIsBoosted(sharedItem.isBoosted);
        return;
      }

      // 2. Check remote Firestore document if user is logged in
      if (!force && firebaseUser?.uid) {
        try {
          const docRef = doc(db, 'trinity_daily_lucky', firebaseUser.uid, 'days', todayKey);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const remote = snap.data();
            if (remote?.luckyData && remote.luckyData.luckScore) {
              setLuckyData(remote.luckyData as TrinityDailyLuckyData);
              try {
                localStorage.setItem(storageKey, JSON.stringify(remote.luckyData));
              } catch (_) {}
              if (remote?.completedQuests) {
                setCompletedQuests(remote.completedQuests);
                try {
                  localStorage.setItem(questStorageKey, JSON.stringify(remote.completedQuests));
                } catch (_) {}
              }
              if (typeof remote?.isBoosted === 'boolean') {
                setIsBoosted(remote.isBoosted);
                try {
                  localStorage.setItem(boostStorageKey, String(remote.isBoosted));
                } catch (_) {}
              }

              // Update shared state to keep all tabs and components in sync
              try {
                updateSharedState({
                  trinityDailyLucky: {
                    ...(sharedState?.trinityDailyLucky || {}),
                    [todayKey]: {
                      luckyData: remote.luckyData,
                      completedQuests: remote.completedQuests || {},
                      isBoosted: !!remote.isBoosted,
                      timestamp: Date.now(),
                    },
                  },
                }, 'TRINITY');
              } catch (_) {}
              return;
            }
          }
        } catch (err) {
          console.warn('[Trinity Daily Lucky] Firestore getDoc notice:', err);
        }
      }

      // 3. Check local cache ONLY if not forced
      if (!force) {
        try {
          const cached =
            localStorage.getItem(storageKey) ||
            localStorage.getItem(`trinity_daily_lucky_data_v4_guest_${todayKey}`) ||
            localStorage.getItem(`trinity_daily_lucky_data_v4_${todayKey}`);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed && parsed.luckScore && parsed.luckySpell) {
              setLuckyData(parsed);
              return;
            }
          }
        } catch (_) {}
      }

      setIsLoading(true);
      try {
        const sajuDigest = saju
          ? `사주 일간: ${saju.dayMaster.symbolName}, 최강 오행: ${saju.elements.dominant.name}, 결핍 및 용신: ${saju.elements.lacking.name}, 2026 병오년 세운: ${saju.annual2026.theme}`
          : '기본 프로필';

        const prompt = `당신은 천상의 우주적 행운과 사주 오행의 기운을 개운(開運)시키는 최고의 행운 마스터 '트리니티'입니다.
오늘 날짜: ${todayKey}
질문자: ${userName} (성별: ${profile?.basic?.gender || '미입력'}, 생년월일: ${profile?.basic?.birthdate || '미입력'})
사주 정보: ${sajuDigest}
최근 고민: ${profile?.fate?.currentWorry || '없음'}
인생 목표: ${profile?.fate?.lifeGoal || '없음'}

다음 3가지 특별 콘텐츠를 반드시 포함하여, 질문자의 마음과 운을 밝혀줄 풍성한 데일리 럭키 리포트를 생성해 주세요:
1. 🔮 **행운의 주문(luckySpell)**: 소리 내어 3번 외쳤을 때 탁한 기운을 날리고 행운을 부르는 신비로운 주문 원문과 기원, 의미, 낭독법
2. ✨ **행운의 글귀(luckyQuote)**: 진부하거나 뻔한 표현을 철저히 배제하고, 스토아 철학, 도가·선(禪) 사상, 동서고금의 고전, 부와 풍요의 법칙, 심리학적 통찰에서 길어 올린 품격 있고 가슴을 울리는 독창적인 명언, 명확한 출처, 오늘의 실천 지혜
3. 📖 **운이 올라가는 이야기(fortuneStory)**: 작은 선행, 감사, 지혜로운 태도로 대운을 바꾸거나 뜻밖의 행운을 만난 3~4문단의 감동적인 일화/우화와 핵심 교훈(moral)
4. 세잎클로버(행복)와 네잎클로버(기적)를 모티브로 한 1~3분 초구체적 3대 실천 미션`;

        const res = await invokeLLMStructured({
          schema: TrinityDailyLuckySchema,
          messages: [{ role: 'user', content: prompt }],
        });

        if (res && res.luckScore) {
          setLuckyData(res);
          try {
            localStorage.setItem(storageKey, JSON.stringify(res));
          } catch (_) {}

          if (firebaseUser?.uid) {
            void setDoc(
              doc(db, 'trinity_daily_lucky', firebaseUser.uid, 'days', todayKey),
              {
                luckyData: res,
                completedQuests,
                isBoosted,
                updatedAt: serverTimestamp(),
                userId: firebaseUser.uid,
                dateKey: todayKey,
              },
              { merge: true }
            ).catch((e) => console.warn('[Trinity Daily Lucky] Sync setDoc error:', e));
          }

          try {
            updateSharedState({
              trinityDailyLucky: {
                ...(sharedState?.trinityDailyLucky || {}),
                [todayKey]: {
                  luckyData: res,
                  completedQuests,
                  isBoosted,
                  timestamp: Date.now(),
                },
              },
            }, 'TRINITY');
          } catch (_) {}

          recordPrismFeature({
            app: 'trinity',
            featureName: '데일리 럭키 시스템 (주문·글귀·이야기)',
            summary: `오늘의 행운 지수: ${res.luckScore}점 (${res.luckLevelTitle}), 주문: ${res.luckySpell?.mantra?.slice(0, 20)}...`,
            details: {
              dateKey: todayKey,
              luckScore: res.luckScore,
              luckyColor: res.luckyColor,
              goldenHour: res.goldenHour,
              spellMantra: res.luckySpell?.mantra,
              storyTitle: res.fortuneStory?.title,
            },
          });
        }
      } catch (err) {
        console.warn('[Trinity Daily Lucky] LLM generation failed, using rich deterministic fallback:', err);
        const fallback = generateDailyLuckyFallback(todayKey, saju, userName);
        setLuckyData(fallback);
        try {
          localStorage.setItem(storageKey, JSON.stringify(fallback));
        } catch (_) {}

        if (firebaseUser?.uid) {
          void setDoc(
            doc(db, 'trinity_daily_lucky', firebaseUser.uid, 'days', todayKey),
            {
              luckyData: fallback,
              completedQuests,
              isBoosted,
              updatedAt: serverTimestamp(),
              userId: firebaseUser.uid,
              dateKey: todayKey,
            },
            { merge: true }
          ).catch(() => {});
        }
      } finally {
        setIsLoading(false);
      }
    },
    [
      firebaseUser?.uid,
      sharedState,
      updateSharedState,
      profile,
      saju,
      storageKey,
      todayKey,
      userName,
      questStorageKey,
      boostStorageKey,
      completedQuests,
      isBoosted,
    ]
  );

  useEffect(() => {
    fetchTailoredLuckyReport(false);
  }, [fetchTailoredLuckyReport]);

  // Handle Quest Toggle with Firestore & SharedState Sync
  const toggleQuest = (id: string) => {
    setCompletedQuests((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(questStorageKey, JSON.stringify(updated));
      } catch (_) {}

      if (firebaseUser?.uid) {
        void setDoc(
          doc(db, 'trinity_daily_lucky', firebaseUser.uid, 'days', todayKey),
          {
            completedQuests: updated,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        ).catch((e) => console.warn('[Trinity Daily Lucky] Quest sync error:', e));
      }

      try {
        updateSharedState({
          trinityDailyLucky: {
            ...(sharedState?.trinityDailyLucky || {}),
            [todayKey]: {
              ...(sharedState?.trinityDailyLucky?.[todayKey] || {}),
              luckyData,
              completedQuests: updated,
              isBoosted,
              timestamp: Date.now(),
            },
          },
        }, 'TRINITY');
      } catch (_) {}

      return updated;
    });
  };

  // Handle Luck Boost Action with Firestore & SharedState Sync
  const handleBoostLuck = () => {
    if (isBoosted) return;
    setIsBoosted(true);
    setShowBoostCelebration(true);
    try {
      localStorage.setItem(boostStorageKey, 'true');
    } catch (_) {}

    if (firebaseUser?.uid) {
      void setDoc(
        doc(db, 'trinity_daily_lucky', firebaseUser.uid, 'days', todayKey),
        {
          isBoosted: true,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      ).catch((e) => console.warn('[Trinity Daily Lucky] Boost sync error:', e));
    }

    try {
      updateSharedState({
        trinityDailyLucky: {
          ...(sharedState?.trinityDailyLucky || {}),
          [todayKey]: {
            ...(sharedState?.trinityDailyLucky?.[todayKey] || {}),
            luckyData,
            completedQuests,
            isBoosted: true,
            timestamp: Date.now(),
          },
        },
      }, 'TRINITY');
    } catch (_) {}

    setTimeout(() => setShowBoostCelebration(false), 4500);
  };

  // Handle Copy
  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Handle Spell Chant Counter
  const handleChantSpell = () => {
    setChantCount((prev) => (prev >= 3 ? 1 : prev + 1));
  };

  // Handle Shuffling / Exploring another high-vibration quote from diverse library
  const handleNextRandomQuote = () => {
    const currentQuoteText = luckyData.luckyQuote?.quote;
    const available = DIVERSE_LUCKY_QUOTES.filter((q) => q.quote !== currentQuoteText);
    const randomChoice = available[Math.floor(Math.random() * available.length)] || DIVERSE_LUCKY_QUOTES[0];
    setLuckyData((prev) => ({
      ...prev,
      luckyQuote: randomChoice,
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12 animate-fade-in relative font-sans text-white">
      {/* Background Ambience Glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl h-96 bg-gradient-to-b from-yellow-500/20 via-emerald-500/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* Header Banner */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/20 text-yellow-300 text-[11px] font-bold tracking-wider uppercase backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_20px_rgba(0,0,0,0.3)]">
          <Sparkles size={14} className="animate-spin text-yellow-400" style={{ animationDuration: '8s' }} />
          <span>CELESTIAL LUCKY ENGINE • CLOVER ATTUNEMENT</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          오늘의 데일리 럭키 개운 시스템
        </h2>
        <p className="text-xs sm:text-sm text-white/65 font-sans max-w-lg mx-auto leading-relaxed">
          세잎클로버의 <span className="text-emerald-300 font-bold">'일상의 행복'</span>을 모아, 네잎클로버의 <span className="text-yellow-300 font-bold">'기적 같은 대길 행운'</span>을 활짝 피워냅니다.
        </p>
      </div>

      {/* 🌟 1. TODAY'S FORTUNE RESONANCE (Crystal Glass Theme) */}
      <div className="relative overflow-hidden rounded-[36px] sm:rounded-[44px] p-6 sm:p-10 md:p-12 bg-gradient-to-br from-white/[0.10] via-white/[0.04] to-white/[0.015] border border-white/25 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.45),inset_0_-1px_2px_rgba(0,0,0,0.6),0_25px_60px_rgba(0,0,0,0.55)] backdrop-blur-3xl transition-all">
        {/* Specular Light Refractions */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-yellow-400/15 blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-emerald-400/15 blur-[90px] pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-40 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-10">
          {/* Glass Gauge & Clover Attunement Disc */}
          <div className="flex flex-col items-center text-center space-y-4 shrink-0">
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center">
              {/* Outer Frosted Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-dashed border-yellow-400/40 shadow-[0_0_30px_rgba(250,204,21,0.25)]"
              />

              {/* Crystal Glass Lens Core */}
              <div className="absolute inset-2.5 rounded-full border border-white/30 bg-gradient-to-br from-white/15 via-black/50 to-black/80 flex flex-col items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.35),0_15px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                {/* Clover Icon Emblem */}
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-lg drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]">
                    {isFourLeafActive ? '🍀' : '☘️'}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-yellow-300 uppercase tracking-widest">
                    {isFourLeafActive ? 'MIRACLE 4-LEAF' : 'SERENITY 3-LEAF'}
                  </span>
                </div>

                {/* Score Number */}
                <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tighter drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]">
                  {dynamicLuckScore}
                  <span className="text-xl sm:text-2xl text-yellow-400 ml-0.5">%</span>
                </span>

                {/* Level Title Badge */}
                <span className="text-[10px] font-bold text-yellow-200 px-3 py-0.5 mt-1 rounded-full bg-white/10 border border-white/20 shadow-sm backdrop-blur-md">
                  {luckyData.luckLevelTitle}
                </span>
              </div>
            </div>

            {/* Score Breakdown Glass Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-[11px] text-white/60 font-mono backdrop-blur-md">
              <span>기본 {luckyData.luckScore}%</span>
              {questBonus > 0 && <span className="text-emerald-400 font-bold">+ 퀘스트 {questBonus}%</span>}
              {boostBonus > 0 && <span className="text-yellow-400 font-bold">+ 부스트 {boostBonus}%</span>}
            </div>
          </div>

          {/* Right Side: Glass Info & Boost Control */}
          <div className="flex-1 space-y-5 text-center md:text-left">
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                <span className="text-xs font-bold font-mono text-yellow-300 uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-yellow-500/20 border border-yellow-400/30">
                  TODAY'S FORTUNE RESONANCE
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/15 text-white/80 font-mono">
                  {todayKey}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {isFourLeafActive
                  ? '🍀 기적의 네잎클로버 대길(大吉) 파동이 감응 중입니다!'
                  : '☘️ 세잎클로버의 행복 기운이 차오르고 있습니다.'}
              </h3>
              <p className="text-xs sm:text-sm text-white/75 mt-2 leading-relaxed font-sans">
                {luckyData.cosmicTide}
              </p>
            </div>

            {/* Lucky Boost & Refresh Actions */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <button
                onClick={handleBoostLuck}
                disabled={isBoosted}
                className={`relative group px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all shadow-xl overflow-hidden ${
                  isBoosted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 cursor-default shadow-[0_0_25px_rgba(16,185,129,0.25)]'
                    : 'bg-gradient-to-r from-yellow-400 via-amber-400 to-emerald-400 hover:brightness-110 text-black border border-white/40 shadow-[0_0_30px_rgba(234,179,8,0.45)] active:scale-95'
                }`}
              >
                <Zap size={18} className={isBoosted ? 'text-emerald-400' : 'text-black fill-current animate-bounce'} />
                <span>{isBoosted ? '🍀 네잎클로버 기적 부스트 활성화 완료 (+8%)' : '⚡ 네잎클로버 기적 즉시 개화 (+8%)'}</span>
                {!isBoosted && (
                  <span className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                )}
              </button>

              <button
                onClick={() => fetchTailoredLuckyReport(true)}
                disabled={isLoading}
                title="오늘의 행운 기운 다시 조율하기"
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold shadow-md backdrop-blur-md"
              >
                <RefreshCw size={15} className={isLoading ? 'animate-spin text-yellow-400' : ''} />
                <span className="hidden sm:inline">조율 새로고침</span>
              </button>
            </div>

            {/* Boost Celebration Toast Effect */}
            <AnimatePresence>
              {showBoostCelebration && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3.5 rounded-2xl bg-emerald-500/25 border border-emerald-400/50 text-emerald-200 text-xs font-bold flex items-center justify-center md:justify-start gap-2 shadow-2xl backdrop-blur-2xl"
                >
                  <Sparkles size={16} className="text-yellow-300 animate-pulse" />
                  <span>🍀 4번째 기적의 잎이 개화하여 888Hz 황금빛 행운 주파수가 온전히 동기화되었습니다!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 🍀 2. Clover Garden & 3-Step Practical Quests (클로버 가든 & 3대 구체적 개운 미션) */}
      <div className="glass rounded-[36px] p-6 sm:p-8 md:p-10 bg-white/[0.03] border border-white/15 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{isFourLeafActive ? '🍀' : '☘️'}</span>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>3대 일일 개운 미션 · 클로버 가든 (Clover Garden)</span>
                </h4>
                <p className="text-xs text-white/60 mt-0.5 font-sans">
                  세 잎사귀를 하나씩 채우면 <strong className="text-emerald-300">세잎클로버(행복)</strong>가 완성되고, 3개 완료 시 <strong className="text-yellow-300">네잎클로버(기적의 행운)</strong>가 개화합니다.
                </p>
              </div>
            </div>
          </div>

          {/* Clover Leaf Collection Visual Indicator */}
          <div className="flex items-center gap-3 self-start sm:self-auto bg-black/40 px-4 py-2.5 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-1.5">
              {/* Leaf 1 */}
              <div
                className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all ${
                  isLeaf1Active
                    ? 'bg-emerald-500 border-emerald-300 text-black shadow-[0_0_10px_rgba(16,185,129,0.6)]'
                    : 'bg-white/5 border-white/20 text-white/40'
                }`}
                title="1st Leaf: 정화의 잎"
              >
                1
              </div>
              {/* Leaf 2 */}
              <div
                className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all ${
                  isLeaf2Active
                    ? 'bg-emerald-500 border-emerald-300 text-black shadow-[0_0_10px_rgba(16,185,129,0.6)]'
                    : 'bg-white/5 border-white/20 text-white/40'
                }`}
                title="2nd Leaf: 활력의 잎"
              >
                2
              </div>
              {/* Leaf 3 */}
              <div
                className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all ${
                  isLeaf3Active
                    ? 'bg-emerald-500 border-emerald-300 text-black shadow-[0_0_10px_rgba(16,185,129,0.6)]'
                    : 'bg-white/5 border-white/20 text-white/40'
                }`}
                title="3rd Leaf: 인연의 잎"
              >
                3
              </div>
              {/* Miracle 4th Leaf */}
              <div
                className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all ${
                  isFourLeafActive
                    ? 'bg-gradient-to-br from-yellow-400 to-amber-500 border-yellow-200 text-black shadow-[0_0_15px_rgba(250,204,21,0.8)] animate-pulse'
                    : 'bg-white/5 border-dashed border-white/20 text-white/30'
                }`}
                title="4th Leaf: 기적의 잎 (네잎클로버)"
              >
                ★
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-yellow-300">
              {completedQuestCount}/3 잎 수집
            </span>
          </div>
        </div>

        {/* 3 Concrete Action Quests List */}
        <div className="space-y-3.5">
          {luckyData.quests.map((quest, idx) => {
            const isDone = !!completedQuests[quest.id];
            const elementIcon =
              quest.element.includes('수')
                ? Droplets
                : quest.element.includes('화')
                ? Flame
                : quest.element.includes('목')
                ? SunMedium
                : HeartHandshake;

            return (
              <div
                key={quest.id || idx}
                onClick={() => toggleQuest(quest.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                    : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/25'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                      isDone
                        ? 'bg-emerald-400 text-black shadow-[0_0_15px_rgba(52,211,153,0.6)]'
                        : 'bg-white/10 text-white/60 group-hover:text-white group-hover:bg-white/15'
                    }`}
                  >
                    {isDone ? <Check size={20} strokeWidth={3} /> : React.createElement(elementIcon, { size: 20 })}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-white/10 text-emerald-300">
                        {quest.leafName || `${idx + 1}st Leaf`}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-white group-hover:text-yellow-300 transition-colors">
                        {quest.title}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                        {quest.element} · 소요: {quest.duration || '1분'}
                      </span>
                    </div>

                    <p className="text-xs text-white/80 font-sans leading-relaxed">
                      👉 <strong className="text-yellow-200/90 font-medium">구체적 행동:</strong> {quest.concreteAction}
                    </p>
                    <p className="text-[11px] text-emerald-400/80 font-sans">
                      ✨ 개운 효과: {quest.benefit || '탁기 정화 및 행운 주파수 상승'}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center justify-end gap-2">
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-xl border ${
                    isDone ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300' : 'bg-white/5 border-white/10 text-white/40'
                  }`}>
                    {isDone ? '완료됨 (+3%)' : '미완료 (+3%)'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 🍀 Four-Leaf Miracle Bloom Banner */}
        <AnimatePresence>
          {isFourLeafActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-yellow-950/40 to-emerald-950/40 border border-yellow-400/40 shadow-2xl text-center space-y-2 relative overflow-hidden backdrop-blur-2xl"
            >
              <div className="flex items-center justify-center gap-2 text-yellow-300 font-bold text-sm sm:text-base">
                <span className="text-xl animate-bounce">🍀</span>
                <span>축하합니다! 기적의 네잎클로버(대길 행운)가 온전히 피어났습니다!</span>
              </div>
              <p className="text-xs sm:text-sm text-yellow-100/90 font-serif italic max-w-xl mx-auto leading-relaxed">
                {luckyData.miracleCloverMessage || '“세잎클로버의 일상의 행복이 모여, 기적을 부르는 네잎클로버의 대길 행운으로 온전히 피어났습니다.”'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🧭 3. Four Lucky Attunements (4대 개운 인자) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Compass size={18} className="text-yellow-400" />
            <span>오늘의 4대 개운 인자 (Lucky Attunements)</span>
          </h4>
          <span className="text-[11px] font-mono text-white/50">오행 상생 조율</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Lucky Color */}
          <div className="glass p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/[0.03] border border-white/10 hover:border-yellow-400/30 transition-all flex flex-col justify-between space-y-3 group shadow-md backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-white/60 flex items-center gap-1.5">
                <Palette size={14} className="text-yellow-400" />
                <span>개운 컬러</span>
              </span>
              <div
                className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                style={{ backgroundColor: luckyData.luckyColorHex }}
              />
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold text-white group-hover:text-yellow-300 transition-colors">
                {luckyData.luckyColor}
              </p>
              <p className="text-[10px] text-white/50 mt-1 line-clamp-2 leading-relaxed">
                {luckyData.luckyColorReason}
              </p>
            </div>
          </div>

          {/* Lucky Number */}
          <div className="glass p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/[0.03] border border-white/10 hover:border-yellow-400/30 transition-all flex flex-col justify-between space-y-3 group shadow-md backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-white/60 flex items-center gap-1.5">
                <Hash size={14} className="text-amber-400" />
                <span>행운의 숫자</span>
              </span>
            </div>
            <div>
              <p className="text-base sm:text-lg font-mono font-extrabold text-yellow-400 tracking-wider">
                {luckyData.luckyNumbers.join(' · ')}
              </p>
              <p className="text-[10px] text-white/50 mt-1">
                기회와 결실을 맺는 상생의 정렬 수
              </p>
            </div>
          </div>

          {/* Lucky Direction */}
          <div className="glass p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/[0.03] border border-white/10 hover:border-yellow-400/30 transition-all flex flex-col justify-between space-y-3 group shadow-md backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-white/60 flex items-center gap-1.5">
                <Compass size={14} className="text-yellow-400" />
                <span>행운의 방위</span>
              </span>
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold text-white group-hover:text-yellow-300 transition-colors">
                {luckyData.luckyDirection}
              </p>
              <p className="text-[10px] text-white/50 mt-1">
                자리 배치 및 이동 시 행운을 부르는 방향
              </p>
            </div>
          </div>

          {/* Golden Hour */}
          <div className="glass p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/[0.03] border border-white/10 hover:border-yellow-400/30 transition-all flex flex-col justify-between space-y-3 group shadow-md backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-white/60 flex items-center gap-1.5">
                <Clock size={14} className="text-amber-400" />
                <span>골든 아워</span>
              </span>
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold text-white group-hover:text-yellow-300 transition-colors">
                {luckyData.goldenHour}
              </p>
              <p className="text-[10px] text-white/50 mt-1">
                중요 결단과 미팅의 최적 시간대
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔮 4. Fortune Wisdom Sanctuary (행운의 주문 · 영혼의 글귀 · 운을 여는 이야기) */}
      <div className="glass rounded-[36px] p-6 sm:p-8 md:p-10 bg-white/[0.03] border border-yellow-400/25 shadow-2xl space-y-6 backdrop-blur-2xl">
        {/* Header with 3 Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/15 border border-yellow-400/30 text-[10px] font-mono text-yellow-300 uppercase tracking-widest font-bold mb-1.5">
              <Sparkles size={12} className="text-yellow-400" />
              <span>FORTUNE WISDOM SANCTUARY</span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              행운의 주문 · 영혼의 글귀 · 운이 올라가는 이야기
            </h4>
            <p className="text-xs text-white/60 font-sans mt-0.5">
              마음을 정화하는 주문을 읊고, 지혜로운 글귀와 감동적인 일화로 운의 그릇을 넓힙니다.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-white/10 self-start md:self-auto backdrop-blur-md">
            {[
              { id: 'spell' as const, label: '행운의 주문', icon: Wand2 },
              { id: 'quote' as const, label: '행운의 글귀', icon: Quote },
              { id: 'story' as const, label: '운을 여는 이야기', icon: BookOpen },
            ].map((tab) => {
              const isActive = activeWisdomTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveWisdomTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Display */}
        <AnimatePresence mode="wait">
          {activeWisdomTab === 'spell' && (
            <motion.div
              key="spell"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              {/* Spell Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-yellow-950/30 via-zinc-950 to-amber-950/30 border border-yellow-500/30 text-center space-y-4 relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-yellow-400 uppercase tracking-widest px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                    {luckyData.luckySpell?.origin || '천상 개운 진언'}
                  </span>
                  <div className="flex items-center gap-2">
                    <TTSButton text={luckyData.luckySpell?.mantra || ''} voice="Kore" className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-yellow-300 text-xs" />
                    <button
                      onClick={() => handleCopyText(luckyData.luckySpell?.mantra || '', 'spell')}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all text-xs font-bold flex items-center gap-1"
                      title="주문 복사"
                    >
                      {copiedKey === 'spell' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      <span className="hidden sm:inline">{copiedKey === 'spell' ? '복사됨' : '복사'}</span>
                    </button>
                  </div>
                </div>

                {/* Mantra Text */}
                <div className="py-3">
                  <p className="text-lg sm:text-2xl font-serif font-bold text-yellow-200 tracking-wide leading-relaxed drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]">
                    “{luckyData.luckySpell?.mantra}”
                  </p>
                </div>

                {/* Meaning & How to chant */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-left space-y-2">
                  <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-sans">
                    ✨ <strong className="text-yellow-300 font-medium">주문의 영적 의미:</strong> {luckyData.luckySpell?.meaning}
                  </p>
                  <p className="text-[11px] text-white/60 font-sans">
                    🧘 <strong className="text-white/80 font-medium">낭독 가이드:</strong> {luckyData.luckySpell?.howToChant}
                  </p>
                </div>

                {/* Interactive 3-Times Chant Counter Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleChantSpell}
                    className={`px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
                      chantCount >= 3
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                        : 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black border border-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.4)]'
                    }`}
                  >
                    <Wand2 size={16} className={chantCount >= 3 ? 'text-emerald-400' : 'text-black fill-current'} />
                    <span>
                      {chantCount === 0
                        ? '소리 내어 주문 외우기 (0/3회)'
                        : chantCount === 1
                        ? '1회 완료! 한 번 더 (1/3회)'
                        : chantCount === 2
                        ? '2회 완료! 마지막 한 번 (2/3회)'
                        : '🎉 3회 낭독 완성! 행운 파동 활성화됨'}
                    </span>
                  </button>
                  {chantCount >= 3 && (
                    <span className="text-xs font-mono font-bold text-emerald-400 animate-pulse">
                      ✨ 오늘의 주문 공명이 완성되었습니다!
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeWisdomTab === 'quote' && (
            <motion.div
              key="quote"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Quote Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-white/[0.01] border border-white/20 space-y-5 shadow-xl relative overflow-hidden backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Quote size={20} className="text-yellow-400" />
                    <span className="text-xs font-bold font-mono text-yellow-300 uppercase tracking-wider">
                      CELESTIAL WISDOM QUOTE
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleNextRandomQuote}
                      className="p-2 px-2.5 rounded-xl bg-yellow-500/15 hover:bg-yellow-500/25 border border-yellow-400/30 text-yellow-300 transition-all text-xs font-bold flex items-center gap-1.5"
                      title="다른 행운 글귀 추천받기"
                    >
                      <Shuffle size={14} className="text-yellow-400" />
                      <span className="text-[11px]">다른 글귀</span>
                    </button>
                    <TTSButton text={`${luckyData.luckyQuote?.quote} - ${luckyData.luckyQuote?.author}. ${luckyData.luckyQuote?.wisdomLesson}`} voice="Kore" className="p-2 rounded-xl bg-white/10 text-yellow-300 text-xs" />
                    <button
                      onClick={() => handleCopyText(`${luckyData.luckyQuote?.quote} - ${luckyData.luckyQuote?.author}`, 'quote')}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all text-xs font-bold flex items-center gap-1"
                      title="글귀 복사"
                    >
                      {copiedKey === 'quote' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      <span className="hidden sm:inline">{copiedKey === 'quote' ? '복사됨' : '복사'}</span>
                    </button>
                  </div>
                </div>

                {/* Quote Body */}
                <div className="p-5 sm:p-6 rounded-2xl bg-black/40 border border-white/10 text-center space-y-2">
                  <p className="text-base sm:text-xl font-serif italic text-yellow-200/95 leading-relaxed">
                    {luckyData.luckyQuote?.quote}
                  </p>
                  <p className="text-xs text-yellow-400/80 font-mono font-bold">
                    — {luckyData.luckyQuote?.author}
                  </p>
                </div>

                {/* Wisdom Insight Lesson */}
                <div className="p-4 rounded-2xl bg-yellow-950/20 border border-yellow-500/25 space-y-1 text-left">
                  <span className="text-xs font-bold text-yellow-300 block flex items-center gap-1.5">
                    <ScrollText size={15} /> 오늘의 마음에 새길 통찰
                  </span>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                    {luckyData.luckyQuote?.wisdomLesson}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeWisdomTab === 'story' && (
            <motion.div
              key="story"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Story Reader Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-amber-950/20 border border-yellow-400/30 space-y-5 shadow-xl relative overflow-hidden backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen size={18} className="text-yellow-400" />
                    <span className="text-xs font-bold font-mono text-yellow-300 uppercase tracking-wider">
                      FORTUNE-BOOSTING STORY
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TTSButton text={`${luckyData.fortuneStory?.title}. ${luckyData.fortuneStory?.story}. 오늘의 교훈: ${luckyData.fortuneStory?.moral}`} voice="Kore" className="p-2 rounded-xl bg-white/10 text-yellow-300 text-xs" />
                    <button
                      onClick={() => handleCopyText(`[${luckyData.fortuneStory?.title}]\n\n${luckyData.fortuneStory?.story}\n\n💡 교훈: ${luckyData.fortuneStory?.moral}`, 'story')}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all text-xs font-bold flex items-center gap-1"
                      title="이야기 복사"
                    >
                      {copiedKey === 'story' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      <span className="hidden sm:inline">{copiedKey === 'story' ? '복사됨' : '복사'}</span>
                    </button>
                  </div>
                </div>

                {/* Story Title */}
                <div>
                  <h5 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {luckyData.fortuneStory?.title}
                  </h5>
                </div>

                {/* Story Paragraphs */}
                <div className="p-5 sm:p-6 rounded-2xl bg-black/40 border border-white/10 text-left text-xs sm:text-sm text-white/85 font-sans leading-relaxed space-y-3 whitespace-pre-line">
                  {luckyData.fortuneStory?.story}
                </div>

                {/* Moral Badge */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-yellow-500/20 border border-yellow-400/40 text-left space-y-1">
                  <span className="text-[11px] font-bold font-mono text-yellow-300 uppercase tracking-wider block">
                    🌟 THE GOLDEN MORAL • 오늘의 개운 법칙
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                    “{luckyData.fortuneStory?.moral}”
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🎴 5. Daily Celestial Guardian Talisman (오늘 당신을 지켜주는 천상의 실물 수호 부적) */}
      <div className="glass rounded-[36px] p-6 sm:p-10 bg-gradient-to-r from-yellow-950/40 via-zinc-950 to-amber-950/40 border border-yellow-400/40 shadow-2xl text-center space-y-6 relative overflow-hidden backdrop-blur-3xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(250,204,21,0.12)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/15 border border-yellow-400/30 text-[10px] font-mono text-yellow-400 uppercase tracking-[0.3em] font-bold">
            <Sparkles size={12} className="text-yellow-400" />
            <span>SACRED CELESTIAL TALISMAN</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            오늘 당신을 지켜주는 천상의 수호 부적
          </h4>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
            {userName}님의 사주와 오늘({todayKey})의 천상 기운으로 주조된 실물 경면주사 수호 신패입니다. 부적을 탭하여 기운을 충전하거나 스마트폰에 소장해 보세요.
          </p>
        </div>

        {/* Real Talisman Canvas & 3D Flip Card */}
        <div className="relative z-10 py-2">
          <CelestialTalismanCard
            userName={userName}
            todayKey={todayKey}
            saju={saju}
            luckyData={luckyData}
          />
        </div>

        {/* Lucy Chat Button */}
        <div className="pt-2 relative z-10">
          <button
            onClick={() => {
              if (onConsult) {
                const deepContext = `[✨ 트리니티 데일리 럭키 & 수호 부적 심층 연계]\n- 대상: ${userName}\n- 행운 공명 점수: ${luckyData.luckScore || 85}점 (${luckyData.luckLevelTitle || '황금빛 대길'})\n- 천상의 조류: "${luckyData.cosmicTide || ''}"\n- 개운 비법(Golden Key): "${luckyData.goldenKey || ''}"\n- 개운 색상/숫자/방위/시간: ${luckyData.luckyColor} / ${(luckyData.luckyNumbers || []).join(', ')} / ${luckyData.luckyDirection} / ${luckyData.goldenHour}\n- 수호 부적 축원: "${luckyData.dailyAmuletBlessing || ''}"\n- 행운의 주문: "${luckyData.luckySpell?.mantra || ''}" (${luckyData.luckySpell?.meaning || ''})\n- 개운 우화 교훈: "${luckyData.fortuneStory?.moral || ''}"`;
                onConsult(
                  `오늘 데일리 럭키로 받은 행운 지수(${luckyData.luckScore}점)와 천상 수호 부적("${luckyData.dailyAmuletBlessing}"), 행운의 주문("${luckyData.luckySpell?.mantra || ''}")에 대해 루시와 심층 상담을 나누고 싶어.\n\n오늘의 흐름을 최대한 살려 운을 폭발시킬 수 있는 구체적인 행동 가이드를 들려줘!`
                );
              } else {
                void sendDailyLuckyToLucy(luckyData, userName, openLucyChat, sendUnifiedMessage);
              }
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-yellow-500/20 hover:from-yellow-500/30 hover:to-amber-500/30 border border-yellow-400/50 text-yellow-100 text-xs sm:text-sm font-bold transition-all shadow-lg active:scale-95 group backdrop-blur-md cursor-pointer"
          >
            <Sparkles size={16} className="text-yellow-400 group-hover:rotate-12 transition-transform" />
            <span>오늘 부적 & 행운 기운 극대화 비법 루시에게 묻기 (Deep Insight)</span>
            <ChevronRight size={16} className="text-yellow-300/60 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

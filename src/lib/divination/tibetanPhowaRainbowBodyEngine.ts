/**
 * 티베트 밀교 족첸(Dzogchen) 릭파(Rigpa) 본각 & 포와(Phowa) 의식 전이 & 5대 지혜 무지개체(Jalü) 정렬 엔진 (tibetanPhowaRainbowBodyEngine.ts)
 *
 * 닝마파(Nyingma) 대해탈 족첸 원전 및 바르도 토돌(티베트 사자의 서) 전승 기반:
 * 태초의 순수 의식인 '릭파(Rigpa, 本覺)'를 자각하고, 임종과 전환기의 혼돈을 돌파하는 '포와(Phowa, 意識轉移)',
 * 그리고 육신의 거친 원소를 빛의 5색 광선으로 승화시키는 '무지개체(Jalü, 虹身)' 5대 지혜 정렬.
 *
 * 5대 지혜(Pancha-Jnana)와 5대 붓다 원형:
 * 1. 법계체성지 (비로자나 / 백색 백광 / 허공 원소 / 무명을 근원적 공간으로 전환)
 * 2. 대원경지 (아촉불 / 청색 청광 / 수 원소 / 성냄을 맑은 거울의 지혜로 전환)
 * 3. 평등성지 (보생불 / 황색 황광 / 지 원소 / 교만을 만물 포용의 풍요로 전환)
 * 4. 묘관찰지 (아미타불 / 적색 적광 / 화 원소 / 집착을 자비로운 통찰로 전환)
 * 5. 성소작지 (불공성취불 / 녹색 녹광 / 풍 원소 / 질투를 막힘없는 성취로 전환)
 */

import type { UserProfile } from '../sharedState';

export const TIBETAN_PHOWA_RAINBOW_BODY_ENGINE_VERSION = '2.1.0';

function formatPhowaKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

export interface FiveBuddhaWisdom {
  id: string;
  nameKo: string;
  tibetanName: string;
  wisdomType: string;
  colorRay: string;
  element: string;
  transmutation: string;
  resonanceScore: number; // 0 ~ 100
  meditationAdvice: string;
}

export interface TibetanPhowaRainbowBodyReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  rigpaClarityScore: number; // 0 ~ 100 릭파(본각) 각성도
  phowaReadinessIndex: number; // 0 ~ 100 전환 돌파/의식 전이력
  rainbowBodyAlignmentScore: number; // 0 ~ 100 무지개체 정렬도
  primaryWisdom: FiveBuddhaWisdom;
  secondaryWisdom: FiveBuddhaWisdom;
  transmutationPath: string; // 번뇌→지혜 승화 경로
  dzogchenDirectPointers: string; // 족첸 본각 직관 요결
  dailyPhowaRitual: string; // 일상 의식 집중 및 정화 처방
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  phowaSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

const FIVE_BUDDHA_WISDOMS: Omit<FiveBuddhaWisdom, 'resonanceScore'>[] = [
  {
    id: 'dharmadhatu',
    nameKo: '비로자나불 (법계체성지)',
    tibetanName: 'Nampar Nangdze',
    wisdomType: '법계체성지(法界體性智) - 우주 법계의 근원적 텅 빔과 순수성',
    colorRay: '순백의 투명한 백광(White Light)',
    element: '허공(Space)',
    transmutation: '막막한 무명(無明)과 몽롱함을 맑고 광활한 열린 가능성으로 전환',
    meditationAdvice: '모든 집착과 경계를 내려놓고, 텅 빈 하늘처럼 광활한 본래의 침묵에 머무르십시오.',
  },
  {
    id: 'mirror',
    nameKo: '아촉불 (대원경지)',
    tibetanName: 'Mikyo Dorje',
    wisdomType: '대원경지(大圓鏡智) - 분별 없이 만상을 비추는 맑은 거울',
    colorRay: '깊고 청명한 청광(Blue Light)',
    element: '물(Water)',
    transmutation: '격렬한 분노와 저항감을 흔들림 없이 수용하는 투명한 관찰로 전환',
    meditationAdvice: '감정이 일어날 때 맞서 싸우지 말고, 호수의 수면처럼 고요히 비추며 스스로 가라앉게 하십시오.',
  },
  {
    id: 'equalizing',
    nameKo: '보생불 (평등성지)',
    tibetanName: 'Rinchen Jungne',
    wisdomType: '평등성지(平等性智) - 너와 나의 분리를 넘어선 만물 동등의 풍요',
    colorRay: '황금빛 자비의 황광(Golden-Yellow Light)',
    element: '땅(Earth)',
    transmutation: '교만과 결핍의 불안을 모든 존재를 평등하게 살리는 든든한 대지의 덕으로 전환',
    meditationAdvice: '자신과 타인을 비교하는 시선을 멈추고, 이미 갖추어진 내면의 풍요와 대지의 관대함을 자각하십시오.',
  },
  {
    id: 'discriminating',
    nameKo: '아미타불 (묘관찰지)',
    tibetanName: 'Nangwa Thaye',
    wisdomType: '묘관찰지(妙觀察智) - 개별 사물의 미세한 인연을 꿰뚫는 자비로운 통찰',
    colorRay: '따뜻하고 찬란한 적광(Ruby Red Light)',
    element: '불(Fire)',
    transmutation: '갈증 어린 애착과 집착을 온 생명을 따스하게 품는 무조건적 자비로 전환',
    meditationAdvice: '원하는 대상을 거머쥐려 애태우지 말고, 열린 가슴으로 현재 마주한 인연의 가치를 온전히 음미하십시오.',
  },
  {
    id: 'all_accomplishing',
    nameKo: '불공성취불 (성소작지)',
    tibetanName: 'Donyo Drupa',
    wisdomType: '성소작지(成所作智) - 걸림 없이 온갖 선한 과업을 성취하는 자재력',
    colorRay: '생동감 넘치는 취록의 녹광(Emerald Green Light)',
    element: '바람(Wind/Air)',
    transmutation: '조급한 질투와 불안을 군더더기 없이 실행하는 민첩한 행동력으로 전환',
    meditationAdvice: '결과에 대한 과도한 근심을 떨쳐버리고, 부드러운 바람처럼 유연하고 거침없이 행동에 옮기십시오.',
  },
];

export function calculateTibetanPhowaRainbowBody(options?: {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
}): TibetanPhowaRainbowBodyReport {
  const profile = options?.profile;
  const question = (options?.question || '').trim();
  const now = options?.now || new Date();

  let seed = 418291;
  const bdate = profile?.basic?.birthdate || '1990-01-01';
  const btime = profile?.basic?.birthtime || '12:00';
  for (let i = 0; i < bdate.length; i++) seed = (seed * 31 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 19 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 17 + question.charCodeAt(i)) % 1000003;
  seed = (seed + now.getUTCHours() * 13) % 1000003;

  const wisdomsWithScores = FIVE_BUDDHA_WISDOMS.map((item, idx) => {
    const score = 50 + ((seed * (idx + 5) + idx * 17) % 48);
    return { ...item, resonanceScore: score };
  });

  wisdomsWithScores.sort((a, b) => b.resonanceScore - a.resonanceScore);
  const primaryWisdom = wisdomsWithScores[0];
  const secondaryWisdom = wisdomsWithScores[1];

  const rigpaClarityScore = Math.min(100, Math.max(40, Math.floor((primaryWisdom.resonanceScore + secondaryWisdom.resonanceScore) / 2)));
  const phowaReadinessIndex = Math.min(100, Math.max(35, 52 + ((seed * 23) % 45)));
  const rainbowBodyAlignmentScore = Math.min(100, Math.max(45, Math.floor((rigpaClarityScore * 0.6 + phowaReadinessIndex * 0.4))));

  const transmutationPath = `${primaryWisdom.transmutation} (${primaryWisdom.colorRay} 조율)`;
  const dzogchenDirectPointers = `생각을 쫓지도 막지도 말며, 일어나는 모든 번뇌의 바탕인 본래 맑은 본각(Rigpa)을 직시하십시오. ${primaryWisdom.nameKo}의 빛이 혼탁한 시야를 걷어냅니다.`;
  const dailyPhowaRitual = `정수리 백회(Brahmarandhra)에 ${primaryWisdom.colorRay}을 시각화하고, 숨을 들이쉴 때 청정한 본각을 채우고 내쉴 때 잡념을 허공으로 전이(Phowa)하십시오. (${primaryWisdom.meditationAdvice})`;

  const calculatedAtKst = formatPhowaKstTimestamp(now);
  const reflectiveQuestion = question
    ? `"${question}"의 번뇌를 ${primaryWisdom.nameKo}의 지혜로 비추고 보조 ${secondaryWisdom.nameKo}의 균형을 더할 때, 지금 가장 고요히 놓아보낼 집착은 무엇입니까?`
    : `${primaryWisdom.colorRay}의 자각으로 호흡을 가다듬을 때, 오늘 마음속에서 가장 먼저 맑히고 싶은 감정의 흔들림은 무엇입니까?`;
  const interpretiveBoundary =
    '티베트 족첸(Dzogchen) 릭파와 포와·5대 붓다 지혜 상징은 내면의 명징함과 감정 승화를 돕기 위한 관조적 은유이며, 단정적 미래 예측이나 의학적 처방을 대체하지 않습니다.';
  const phowaSynthesisMatrix = {
    dominantTension: `${primaryWisdom.nameKo} ↔ ${secondaryWisdom.nameKo}`,
    alignmentState: `${primaryWisdom.colorRay} · 원소(${primaryWisdom.element})`,
    integratedAction: `${dailyPhowaRitual}${question ? ` [질문 맥락: ${question}]` : ''}`,
  };

  return {
    engineVersion: TIBETAN_PHOWA_RAINBOW_BODY_ENGINE_VERSION,
    timestamp: now.toISOString(),
    calculatedAtKst,
    rigpaClarityScore,
    phowaReadinessIndex,
    rainbowBodyAlignmentScore,
    primaryWisdom,
    secondaryWisdom,
    transmutationPath,
    dzogchenDirectPointers,
    dailyPhowaRitual,
    reflectiveQuestion,
    interpretiveBoundary,
    phowaSynthesisMatrix,
  };
}

export function formatTibetanPhowaRainbowBodyPrompt(rep: TibetanPhowaRainbowBodyReport): string {
  const matrixLine = rep.phowaSynthesisMatrix
    ? `\n· 포와·무지개체 교차 매트릭스: 핵심 긴장(${rep.phowaSynthesisMatrix.dominantTension}) · 조율 상태(${rep.phowaSynthesisMatrix.alignmentState}) · 통합 실천(${rep.phowaSynthesisMatrix.integratedAction})`
    : '';
  return `[티베트 족첸(Dzogchen) 릭파 본각 & 무지개체(Jalü) 5대 지혜 실측 데이터]
· 엔진 버전: v${rep.engineVersion} | ${rep.calculatedAtKst}
· 주재 지혜 광선: ${rep.primaryWisdom.nameKo}
  - 지혜 유형: ${rep.primaryWisdom.wisdomType} [빛: ${rep.primaryWisdom.colorRay} / 원소: ${rep.primaryWisdom.element}]
  - 번뇌 승화: ${rep.primaryWisdom.transmutation}
· 보조 지혜 광선: ${rep.secondaryWisdom.nameKo} (${rep.secondaryWisdom.colorRay})
· 족첸 본각 직관 요결: ${rep.dzogchenDirectPointers}
· 일상 포와 정화 리추얼: ${rep.dailyPhowaRitual}${matrixLine}
· 성찰 질문: ${rep.reflectiveQuestion}
· 해석 경계: ${rep.interpretiveBoundary}`;
}

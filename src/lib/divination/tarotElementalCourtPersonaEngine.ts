/**
 * =========================================================================
 * 🎴 LUCKEY 타로 4대 원소 역동성 & 16대 궁정 카드(Court Cards) 페르소나 엔진
 * (Tarot Elemental Dynamics & 16 Court Cards Persona Master Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 타로 78장 중 가장 복잡하고 인간적인 16대 궁정 카드(King, Queen, Knight, Page ✕ 4대 원소)를 통해,
 * 내담자가 현재 상황에서 착용하고 있는 '외적 페르소나(Social Mask)'와
 * 무의식 중에 발현되는 '내면의 미성숙한 그림자(Court Shadow)'를 심층 해독합니다.
 * 아울러 불(Wands)·물(Cups)·공기(Swords)·흙(Pentacles) 4대 원소의 과잉과 결핍을 진단하여
 * 현실에서 즉시 균형을 회복할 수 있는 원소 연금술적 페르소나 행동 처방을 도출합니다.
 */

import type { UserProfile } from '../sharedState';
import { calculateDetailedSaju } from '../sajuAnalysis';

export const TAROT_ELEMENTAL_COURT_VERSION = 'LUCKEY-TAROT-ELEMENTAL-COURT-v2.2.0';

function formatCourtKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

export type TarotElement = 'Fire (열정과 추진력)' | 'Water (감성과 영적 공감)' | 'Air (이성과 전략적 명료함)' | 'Earth (물질과 현실적 실행)';
export type CourtRank = 'King (군주 / 통제와 결실)' | 'Queen (여왕 / 수용과 숙성)' | 'Knight (기사 / 저돌적 정복)' | 'Page (시종 / 순수한 배움과 전조)';

export interface CourtCardProfile {
  nameEn: string;
  nameKo: string;
  rank: CourtRank;
  element: TarotElement;
  primaryArchetype: string;     // 예: "비전을 현실로 벼려내는 화염의 군주"
  executiveSuperpower: string;  // 현실에서 발휘되는 탁월한 능력
  shadowBlindSpot: string;      // 경계해야 할 미성숙한 그림자
  actionMantra: string;         // 페르소나 정렬 주문
}

export interface TarotElementalBalance {
  firePercentage: number;   // 완즈 기운 (열정)
  waterPercentage: number;  // 컵 기운 (감정/영성)
  airPercentage: number;    // 소드 기운 (이성/결단)
  earthPercentage: number;  // 펜타클 기운 (실행/자산)
  dominantElement: TarotElement;
  deficientElement: TarotElement;
  elementalHarmonizerAdvice: string;
}

export interface TarotElementalCourtReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  activePersonaCourt: CourtCardProfile;
  subconsciousShadowCourt: CourtCardProfile;
  elementalBalance: TarotElementalBalance;
  oneHundredEightySecondRitual: string;
  synthesisPromptGuidance: string;
  reflectiveQuestion: string;
  ritualAction: string;
  reflectionFocus: string;
  interpretiveBoundary: string;
  courtSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

// 16대 궁정 카드 아키타입 정의
const COURT_CARDS_CATALOG: Record<string, CourtCardProfile> = {
  KingOfWands: {
    nameEn: 'King of Wands',
    nameKo: '완즈의 킹 (불의 불)',
    rank: 'King (군주 / 통제와 결실)',
    element: 'Fire (열정과 추진력)',
    primaryArchetype: '담대한 비전과 카리스마로 무리를 이끄는 영적 개척자',
    executiveSuperpower: '불가능해 보이는 목표를 직관적으로 꿰뚫고 빠르게 팀을 드라이브하는 리더십',
    shadowBlindSpot: '자신의 기준을 타인에게 강요하거나, 세부적인 디테일을 소홀히 하여 팀원을 지치게 할 위험',
    actionMantra: '큰 그림을 제시하되, 작은 걸음을 걷는 이들에게 숨 쉴 틈을 내어주라.',
  },
  QueenOfWands: {
    nameEn: 'Queen of Wands',
    nameKo: '완즈의 퀸 (물의 불)',
    rank: 'Queen (여왕 / 수용과 숙성)',
    element: 'Fire (열정과 추진력)',
    primaryArchetype: '자신감과 따뜻한 활력으로 주변을 물들이는 태양의 여제',
    executiveSuperpower: '주눅 들지 않는 솔직한 당당함, 사람을 단번에 매료시키는 긍정의 아우라',
    shadowBlindSpot: '주변의 인정을 지나치게 의식하거나, 감정의 기복으로 충동적인 결정을 내릴 수 있음',
    actionMantra: '나의 가치는 외부의 박수가 아닌, 내 안의 흔들리지 않는 빛에서 온다.',
  },
  KnightOfWands: {
    nameEn: 'Knight of Wands',
    nameKo: '완즈의 나이트 (공기의 불)',
    rank: 'Knight (기사 / 저돌적 정복)',
    element: 'Fire (열정과 추진력)',
    primaryArchetype: '주저 없이 앞만 보고 질주하는 모험과 돌격의 전사',
    executiveSuperpower: '두려움 없는 시작, 망설임을 깨부수는 폭발적인 초반 가속력',
    shadowBlindSpot: '성급한 시작 뒤에 찾아오는 뒷심 부족, 과정의 지루함을 견디지 못하는 조급함',
    actionMantra: '불꽃을 일으키는 것만큼, 그 온기를 끝까지 지켜내는 인내가 위대함을 만든다.',
  },
  PageOfWands: {
    nameEn: 'Page of Wands',
    nameKo: '완즈의 페이지 (흙의 불)',
    rank: 'Page (시종 / 순수한 배움과 전조)',
    element: 'Fire (열정과 추진력)',
    primaryArchetype: '세상 모든 새로운 기회에 눈을 반짝이는 영감의 메신저',
    executiveSuperpower: '순수한 호기심, 틀에 갇히지 않은 창의적인 아이디어와 발상의 전환',
    shadowBlindSpot: '생각만 많고 실질적인 실행 단계로 연결하지 못하는 공상과 산만함',
    actionMantra: '번뜩이는 영감 하나를 골라, 오늘 당장 종이 위에 첫 글자를 적어라.',
  },
  KingOfSwords: {
    nameEn: 'King of Swords',
    nameKo: '소드의 킹 (불의 공기)',
    rank: 'King (군주 / 통제와 결실)',
    element: 'Air (이성과 전략적 명료함)',
    primaryArchetype: '감정을 배제하고 진실만을 벼려내는 냉철한 지혜의 심판관',
    executiveSuperpower: '복잡하게 얽힌 이해관계를 단칼에 정리하는 전략적 분석력과 원칙',
    shadowBlindSpot: '지나치게 차갑고 냉소적인 어조로 상대의 마음에 씻기 어려운 상처를 줄 위험',
    actionMantra: '칼날은 날카로워야 하나, 칼자루를 쥔 손에는 인간적인 온기가 머물러야 한다.',
  },
  QueenOfSwords: {
    nameEn: 'Queen of Swords',
    nameKo: '소드의 퀸 (물의 공기)',
    rank: 'Queen (여왕 / 수용과 숙성)',
    element: 'Air (이성과 전략적 명료함)',
    primaryArchetype: '수많은 시련을 거쳐 거짓과 환상을 꿰뚫어 보는 혜안의 여왕',
    executiveSuperpower: '불필요한 관계의 군더더기를 쳐내는 명확한 경계선(Boundary) 설정 능력',
    shadowBlindSpot: '과거의 상처로 인해 마음의 문을 닫아걸고 타인을 방어적으로 밀어내는 고립감',
    actionMantra: '지혜로운 방패는 나를 지키는 도구일 뿐, 사랑을 차단하는 벽이 되어서는 안 된다.',
  },
  KnightOfSwords: {
    nameEn: 'Knight of Swords',
    nameKo: '소드의 나이트 (공기의 공기)',
    rank: 'Knight (기사 / 저돌적 정복)',
    element: 'Air (이성과 전략적 명료함)',
    primaryArchetype: '폭풍처럼 목표를 향해 직진하는 지적 결단의 돌파자',
    executiveSuperpower: '타의 추종을 불허하는 신속한 판단력, 토론과 협상에서 압도적인 논리력',
    shadowBlindSpot: '성급한 단정, 상대를 코너로 몰아붙여 파국을 자초하는 독선',
    actionMantra: '속도보다 중요한 것은 방향이며, 이기는 것보다 중요한 것은 상생이다.',
  },
  PageOfSwords: {
    nameEn: 'Page of Swords',
    nameKo: '소드의 페이지 (흙의 공기)',
    rank: 'Page (시종 / 순수한 배움과 전조)',
    element: 'Air (이성과 전략적 명료함)',
    primaryArchetype: '경계심을 늦추지 않고 기민하게 주변을 관찰하는 지적 정찰병',
    executiveSuperpower: '숨겨진 진실을 감지하는 예민한 관찰력, 정보 수집과 시장 조사 감각',
    shadowBlindSpot: '피해망상이나 과도한 의심, 사소한 말에 흔들려 에너지를 소모하는 예민함',
    actionMantra: '외부의 잡음에 신경을 곤두세우기보다, 내면의 고요한 진실에 귀를 기울이라.',
  },
  KingOfCups: {
    nameEn: 'King of Cups',
    nameKo: '컵의 킹 (불의 물)',
    rank: 'King (군주 / 통제와 결실)',
    element: 'Water (감성과 영적 공감)',
    primaryArchetype: '거친 감정의 파도를 다스리고 평온을 전하는 영혼의 치유자',
    executiveSuperpower: '극심한 혼란 속에서도 평정을 잃지 않고 타인의 아픔을 포용하는 정서적 안정감',
    shadowBlindSpot: '자신의 깊은 감정을 숨긴 채 속으로 삭이다가 한순간에 냉담해지는 수동 공격성',
    actionMantra: '바다의 고요함은 감정을 억누름이 아니라, 온전히 통과시킬 때 비로소 깃든다.',
  },
  QueenOfCups: {
    nameEn: 'Queen of Cups',
    nameKo: '컵의 퀸 (물의 물)',
    rank: 'Queen (여왕 / 수용과 숙성)',
    element: 'Water (감성과 영적 공감)',
    primaryArchetype: '신비로운 직관과 무조건적 사랑으로 영혼을 비추는 예언가',
    executiveSuperpower: '말하지 않아도 상대의 상태를 꿰뚫어 보는 텔레파시적 영적 공감 능력',
    shadowBlindSpot: '타인의 감정 쓰레기통이 되어 스스로 탈진하거나, 현실감각을 잃고 꿈속에 머묾',
    actionMantra: '나의 잔이 먼저 차올라 넘칠 때, 비로소 세상에 맑은 감로수를 건넬 수 있다.',
  },
  KingOfPentacles: {
    nameEn: 'King of Pentacles',
    nameKo: '펜타클의 킹 (불의 흙)',
    rank: 'King (군주 / 통제와 결실)',
    element: 'Earth (물질과 현실적 실행)',
    primaryArchetype: '물질적 풍요와 견고한 제국을 일구어낸 자수성가의 거장',
    executiveSuperpower: '자본과 자원을 다루는 탁월한 실물 감각, 흔들림 없는 사업적 지속 가능성',
    shadowBlindSpot: '모든 것을 물질적 손익과 효율로만 환산하려 드는 인색함과 통제욕',
    actionMantra: '진정한 부(Wealth)는 금고의 잔고가 아닌, 나누어도 줄지 않는 마음의 여유에 있다.',
  },
  QueenOfPentacles: {
    nameEn: 'Queen of Pentacles',
    nameKo: '펜타클의 퀸 (물의 흙)',
    rank: 'Queen (여왕 / 수용과 숙성)',
    element: 'Earth (물질과 현실적 실행)',
    primaryArchetype: '풍요로운 대지처럼 주변을 든든하게 보살피는 현실적 자애의 수호자',
    executiveSuperpower: '일상의 살림과 자산을 꼼꼼히 불려 나가는 내실, 실질적인 도움을 주는 따뜻함',
    shadowBlindSpot: '안정에 대한 지나친 집착으로 변화를 두려워하거나, 사소한 흠집에 전전긍긍함',
    actionMantra: '뿌리가 깊은 나무는 바람을 두려워하지 않으니, 변화의 계절을 흔쾌히 맞이하라.',
  },
};

export function calculateTarotElementalCourt(
  profile?: UserProfile,
  inputTopic: string = '오늘의 결단과 나아갈 방향'
): TarotElementalCourtReport {
  const sajuRes = calculateDetailedSaju(profile || null);
  const dayMaster = sajuRes?.dayMaster;
  const dayGan = dayMaster?.gan || '경';
  const element = dayMaster?.element || '금';

  // 사주 오행과 질문 무드에 따른 주도 궁정 페르소나 매핑
  let activeKey = 'KingOfWands';
  let shadowKey = 'QueenOfSwords';

  if (element === '화') {
    activeKey = 'KingOfWands';
    shadowKey = 'PageOfSwords';
  } else if (element === '수') {
    activeKey = 'KingOfCups';
    shadowKey = 'KnightOfWands';
  } else if (element === '목') {
    activeKey = 'QueenOfWands';
    shadowKey = 'QueenOfCups';
  } else if (element === '금') {
    activeKey = 'KingOfSwords';
    shadowKey = 'KnightOfSwords';
  } else { // 토
    activeKey = 'KingOfPentacles';
    shadowKey = 'QueenOfPentacles';
  }

  // 질문 주제에 따른 미세 튜닝
  if (/(?:마음|감정|사랑|연애|외로움|상처)/.test(inputTopic)) {
    activeKey = 'QueenOfCups';
    shadowKey = 'KnightOfWands';
  } else if (/(?:이직|결단|퇴사|계약|선택|승부)/.test(inputTopic)) {
    activeKey = 'KingOfSwords';
    shadowKey = 'PageOfSwords';
  } else if (/(?:돈|재물|투자|사업|매출|집)/.test(inputTopic)) {
    activeKey = 'KingOfPentacles';
    shadowKey = 'QueenOfPentacles';
  }

  const activePersonaCourt = COURT_CARDS_CATALOG[activeKey] || COURT_CARDS_CATALOG.KingOfWands;
  const subconsciousShadowCourt = COURT_CARDS_CATALOG[shadowKey] || COURT_CARDS_CATALOG.QueenOfSwords;

  // 4대 원소 밸런스 산출
  const firePct = element === '화' ? 45 : 25;
  const waterPct = element === '수' ? 45 : 25;
  const airPct = element === '금' ? 45 : 20;
  const earthPct = element === '토' ? 45 : 30;

  const elementalBalance: TarotElementalBalance = {
    firePercentage: firePct,
    waterPercentage: waterPct,
    airPercentage: airPct,
    earthPercentage: earthPct,
    dominantElement: element === '화' ? 'Fire (열정과 추진력)' : element === '금' ? 'Air (이성과 전략적 명료함)' : element === '수' ? 'Water (감성과 영적 공감)' : 'Earth (물질과 현실적 실행)',
    deficientElement: element === '수' ? 'Fire (열정과 추진력)' : 'Water (감성과 영적 공감)',
    elementalHarmonizerAdvice: `현재 상황에서는 [${activePersonaCourt.nameKo}]의 명확한 ${activePersonaCourt.rank.split('(')[0]} 기운을 착용하고 흔들림 없이 나아가되, [${subconsciousShadowCourt.nameKo}]의 그림자인 "${subconsciousShadowCourt.shadowBlindSpot}"에 빠지지 않도록 유의하세요.`,
  };

  const oneHundredEightySecondRitual = `[180초 궁정 카드 페르소나 연금술]:
1. 어깨를 펴고 ${activePersonaCourt.rank.split('(')[0]}처럼 당당하게 앉아 3번 깊이 심호흡합니다.
2. 마음속으로 페르소나 주문을 되뇝니다: "${activePersonaCourt.actionMantra}"
3. 두려움과 조급함을 내려놓고, 지금 즉시 할 수 있는 가장 명확한 단 하나의 행동을 결정합니다.`;

  const now = new Date();
  const calculatedAtKst = formatCourtKstTimestamp(now);
  const q = inputTopic.trim();
  const reflectiveQuestion = q
    ? `"${q}" 앞에서 [${activePersonaCourt.nameKo}]의 강점을 쓰면서도 [${subconsciousShadowCourt.nameKo}]의 맹점에 휩쓸리지 않으려면, 오늘 어떤 한 걸음을 의식적으로 늦추거나 분명히 하겠습니까?`
    : `[${activePersonaCourt.nameKo}]의 태도로 하루를 열 때, 지금 내 안에서 가장 먼저 다독여야 할 [${subconsciousShadowCourt.nameKo}]의 그림자는 무엇입니까?`;
  const interpretiveBoundary =
    '타로 16대 궁정 카드와 4대 원소 상징은 현재의 대인 태도와 내면의 맹점을 비추는 심리·원형적 관점이며, 단정적 미래 예측이나 의학·법률·재무 판단을 대체하지 않습니다.';
  const courtSynthesisMatrix = {
    dominantTension: `${activePersonaCourt.nameKo} ↔ ${subconsciousShadowCourt.nameKo}`,
    alignmentState: `우세 원소(${elementalBalance.dominantElement}) · 보완 원소(${elementalBalance.deficientElement})`,
    integratedAction: `${activePersonaCourt.actionMantra}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  const ritualAction = `${activePersonaCourt.actionMantra} — [${activePersonaCourt.nameKo}]의 시선으로 오늘 1건의 핵심 행동을 바로 매듭짓기`;
  const reflectionFocus = `우세 원소 ${elementalBalance.dominantElement}의 강점을 살리되 [${subconsciousShadowCourt.nameKo}]의 그림자(${subconsciousShadowCourt.shadowBlindSpot})로 기울어지는 순간 알아차리기`;

  const synthesisPromptGuidance = `
[타로 4대 원소 & 16대 궁정 카드(Court Cards) 마스터 지능 ${TAROT_ELEMENTAL_COURT_VERSION} | ${calculatedAtKst}]:
- 주도 착용 페르소나: "${activePersonaCourt.nameKo}" (${activePersonaCourt.primaryArchetype})
- 현실 슈퍼파워: "${activePersonaCourt.executiveSuperpower}"
- 무의식 그림자 맹점 직면: "${activePersonaCourt.shadowBlindSpot}" (그림자 카드: ${subconsciousShadowCourt.nameKo})
- 원소 연금술 행동 조언: "${elementalBalance.elementalHarmonizerAdvice}"
- 페르소나 실천 만트라: "${activePersonaCourt.actionMantra}"
- 궁정 페르소나 교차 매트릭스: 핵심 긴장(${courtSynthesisMatrix.dominantTension}) · 원소 조율(${courtSynthesisMatrix.alignmentState}) · 통합 실천(${courtSynthesisMatrix.integratedAction})
- 실천 의례: ${ritualAction}
- 성찰 초점: ${reflectionFocus}
- 성찰 질문: ${reflectiveQuestion}
- 해석 경계: ${interpretiveBoundary}
내담자에게 "카드를 뽑아보니~"라는 설명조 없이, 상대의 현재 페르소나 성향과 주의해야 할 그림자 맹점을 사람을 꿰뚫어 보듯 단호하고 따뜻하게 짚어줄 것.
`.trim();

  return {
    engineVersion: TAROT_ELEMENTAL_COURT_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    activePersonaCourt,
    subconsciousShadowCourt,
    elementalBalance,
    oneHundredEightySecondRitual,
    synthesisPromptGuidance,
    reflectiveQuestion,
    ritualAction,
    reflectionFocus,
    interpretiveBoundary,
    courtSynthesisMatrix,
  };
}

export function formatTarotElementalCourtPrompt(report: TarotElementalCourtReport): string {
  return report.synthesisPromptGuidance;
}

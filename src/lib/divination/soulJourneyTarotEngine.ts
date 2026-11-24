/**
 * =========================================================================
 * LUCKEY 영혼의 타로 여정 & 4원소 연금술 엔진 (Soul Journey Tarot Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 카를 융의 분석심리학적 원형(Archetype)과 고대 타로 22대 메이저 아르카나의
 * '영혼의 연금술 3단계 여정'(자아 확립 -> 시련과 그림자 대면 -> 우주적 통합)을
 * 사용자의 생년월일 수비학 및 사주 명식과 결정론적으로 결합합니다.
 * 또한 마이너 아르카나 4원소(완드·컵·소드·펜타클)의 일일 수리 균형을 연산하여
 * 오늘 돌파해야 할 영혼의 통과 의례(Rite of Passage)와 활성 원소를 도출합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const SOUL_JOURNEY_TAROT_VERSION = 'LUCKEY-JOURNEY-v2.3.0';

function classifySoulJourneyTopic(q: string): '정체성·방향' | '관계·선택' | '시련·전환' | '현실·결실' | '영혼 전반' {
  if (/관계|사랑|연애|인연|사람/.test(q)) return '관계·선택';
  if (/시련|힘들|변화|전환|고민/.test(q)) return '시련·전환';
  if (/일|돈|현실|실행|결실/.test(q)) return '현실·결실';
  if (/여정|방향|나|영혼|정체/.test(q)) return '정체성·방향';
  return '영혼 전반';
}

function formatSoulJourneyKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

export type JourneyStage = '제1막: 자아 확립과 지상 탐험 (1~7)' | '제2막: 그림자 대면과 내적 연금술 (8~14)' | '제3막: 영적 각성과 우주적 통합 (15~21)' | '프롤로그/에필로그: 순수한 잠재력 (0)';

export interface MajorArchetypeDetail {
  number: number;
  nameEn: string;
  nameKo: string;
  stage: JourneyStage;
  coreLesson: string;
  shadowTrap: string;
  transcendenceKey: string;
  resonancePower: number; // 영혼 공명도 (0~100)
}

export interface ElementalSuitBalance {
  wands: { element: '불'; attribute: '창조적 열정·추진력'; score: number };
  cups: { element: '물'; attribute: '정서적 공감·직관력'; score: number };
  swords: { element: '바람'; attribute: '지적 명료함·결단력'; score: number };
  pentacles: { element: '흙'; attribute: '물질적 현실화·안정성'; score: number };
  dominantSuit: 'Wands (완드)' | 'Cups (컵)' | 'Swords (소드)' | 'Pentacles (펜타클)';
  lackingSuit: 'Wands (완드)' | 'Cups (컵)' | 'Swords (소드)' | 'Pentacles (펜타클)';
}

export interface SoulJourneyTarotReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  questionTopic: '정체성·방향' | '관계·선택' | '시련·전환' | '현실·결실' | '영혼 전반';
  currentArchetype: MajorArchetypeDetail;
  elementalBalance: ElementalSuitBalance;
  alchemyAxis: string;
  riteOfPassage: {
    title: string;
    currentTrial: string;
    breakthroughRitual: string;
    alchemyScore: number; // 0~100
  };
  synthesisPromptGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  shadowWarning: string;
  reflectiveQuestion?: string;
  soulJourneySynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  interpretiveBoundary: string;
}

const MAJOR_ARCANA_LIST: Array<Omit<MajorArchetypeDetail, 'resonancePower'>> = [
  {
    number: 0,
    nameEn: 'The Fool',
    nameKo: '바보 (광대)',
    stage: '프롤로그/에필로그: 순수한 잠재력 (0)',
    coreLesson: '과거의 규범과 두려움을 던져버리고 미지의 가능성으로 가볍게 도약하는 용기',
    shadowTrap: '충동적 무모함과 현실 회피',
    transcendenceKey: '결과에 집착하지 않고 과정을 완전한 순수성으로 신뢰하기'
  },
  {
    number: 1,
    nameEn: 'The Magician',
    nameKo: '마법사',
    stage: '제1막: 자아 확립과 지상 탐험 (1~7)',
    coreLesson: '4원소의 도구를 내면화하여 무형의 아이디어를 현실의 물질로 벼려내는 집중력',
    shadowTrap: '오만과 타인 조종, 말만 앞서는 허상',
    transcendenceKey: '명확한 의도를 세우고 즉시 첫 번째 프로토타입 실행하기'
  },
  {
    number: 2,
    nameEn: 'The High Priestess',
    nameKo: '고위 여사제',
    stage: '제1막: 자아 확립과 지상 탐험 (1~7)',
    coreLesson: '겉으로 드러나지 않는 심연의 무의식과 침묵 속에서 답을 읽어내는 신성한 직관',
    shadowTrap: '수동적 고립과 오만한 침묵',
    transcendenceKey: '논리적 설득을 넘어 첫 번째 직관적 영감을 온전히 따르기'
  },
  {
    number: 3,
    nameEn: 'The Empress',
    nameKo: '여황제',
    stage: '제1막: 자아 확립과 지상 탐험 (1~7)',
    coreLesson: '풍요로운 감각적 창조성과 결실을 맺는 대지의 모성적 수용력',
    shadowTrap: '나태와 과도한 물질적 집착',
    transcendenceKey: '창작물과 주변 인연을 따뜻하게 양육하며 결실을 자연스럽게 기다리기'
  },
  {
    number: 4,
    nameEn: 'The Emperor',
    nameKo: '황제',
    stage: '제1막: 자아 확립과 지상 탐험 (1~7)',
    coreLesson: '명확한 경계선 설정과 구조화, 흔들리지 않는 규율로 영토를 수호하는 리더십',
    shadowTrap: '경직된 독재와 통제 강박',
    transcendenceKey: '단호한 우선순위 기준을 세우고 시스템화된 실행 틀 마련하기'
  },
  {
    number: 5,
    nameEn: 'The Hierophant',
    nameKo: '교황',
    stage: '제1막: 자아 확립과 지상 탐험 (1~7)',
    coreLesson: '영원불멸의 지혜와 고전적 철학을 현대의 실전 가치로 전수하는 스승의 품격',
    shadowTrap: '도그마에 갇힌 교조주의와 형식주의',
    transcendenceKey: '근본 원리를 재확인하고 신뢰할 수 있는 멘토십과 정통성을 흡수하기'
  },
  {
    number: 6,
    nameEn: 'The Lovers',
    nameKo: '연인',
    stage: '제1막: 자아 확립과 지상 탐험 (1~7)',
    coreLesson: '타협할 수 없는 가치관의 선택과 대립되는 양극성의 신성한 합일',
    shadowTrap: '결정 장애와 인정 욕구에 휘둘리는 의존성',
    transcendenceKey: '진정으로 사랑하는 일과 사람에 전 존재를 걸고 흔들림 없이 선택하기'
  },
  {
    number: 7,
    nameEn: 'The Chariot',
    nameKo: '전차',
    stage: '제1막: 자아 확립과 지상 탐험 (1~7)',
    coreLesson: '흑백의 스핑크스(상반된 욕망)를 확고한 의지력의 고삐로 통제하여 승리를 쟁취함',
    shadowTrap: '폭주하는 공격성과 자기 통제 상실',
    transcendenceKey: '내면의 갈등을 강력한 한 점의 목표로 집중시켜 폭발적 돌파구 열기'
  },
  {
    number: 8,
    nameEn: 'Strength',
    nameKo: '힘',
    stage: '제2막: 그림자 대면과 내적 연금술 (8~14)',
    coreLesson: '원초적 야성과 맹수를 물리적 폭력이 아닌 부드러운 사랑과 인내로 길들이는 진정한 용기',
    shadowTrap: '분노 폭발 혹은 비겁한 굴복',
    transcendenceKey: '자기 내면의 맹수(충동)를 인정하고 따뜻한 위로와 수용으로 어루만지기'
  },
  {
    number: 9,
    nameEn: 'The Hermit',
    nameKo: '은둔자',
    stage: '제2막: 그림자 대면과 내적 연금술 (8~14)',
    coreLesson: '세상의 소음을 차단하고 오직 내면의 등불(진리)을 향해 묵묵히 걸어가는 고독의 지혜',
    shadowTrap: '염세적 고립과 소통 단절',
    transcendenceKey: '혼자만의 고요한 시공간에서 본질을 성찰하고 흔들리지 않는 중심 잡기'
  },
  {
    number: 10,
    nameEn: 'Wheel of Fortune',
    nameKo: '운명의 수레바퀴',
    stage: '제2막: 그림자 대면과 내적 연금술 (8~14)',
    coreLesson: '상승과 하강의 불가피한 우주적 사이클을 수용하고 중심축(Center)에서 평정을 유지함',
    shadowTrap: '숙명론적 체념과 기회 상실',
    transcendenceKey: '변화의 파도에 저항하지 않고 흐름을 타며 다음 상승 타이밍 포착하기'
  },
  {
    number: 11,
    nameEn: 'Justice',
    nameKo: '정의',
    stage: '제2막: 그림자 대면과 내적 연금술 (8~14)',
    coreLesson: '냉철한 진실의 양날검과 균형의 저울로 편견 없는 공정성을 확립함',
    shadowTrap: '가혹한 자기 비판과 완벽주의 강박',
    transcendenceKey: '감정을 배제하고 명확한 팩트와 인과율에 기반해 객관적 결단 내리기'
  },
  {
    number: 12,
    nameEn: 'The Hanged Man',
    nameKo: '매달린 사람',
    stage: '제2막: 그림자 대면과 내적 연금술 (8~14)',
    coreLesson: '세상을 거꾸로 바라보는 발상의 전환과, 더 높은 차원을 위한 자발적 정지와 헌신',
    shadowTrap: '무기력한 희생자 코스프레와 순교자 콤플렉스',
    transcendenceKey: '당장의 조급함을 내려놓고 관점을 180도 뒤집어 새로운 통찰 얻기'
  },
  {
    number: 13,
    nameEn: 'Death',
    nameKo: '죽음 (재탄생)',
    stage: '제2막: 그림자 대면과 내적 연금술 (8~14)',
    coreLesson: '생명을 다한 낡은 자아와 패턴을 깨끗이 탈각하고 새로운 시대의 여명을 여는 절대적 변용',
    shadowTrap: '과거에 대한 미련과 변화에 대한 극도의 공포',
    transcendenceKey: '끝난 것에 작별을 고하고 비워진 자리에 완전히 새로운 숨결 받아들이기'
  },
  {
    number: 14,
    nameEn: 'Temperance',
    nameKo: '절제',
    stage: '제2막: 그림자 대면과 내적 연금술 (8~14)',
    coreLesson: '두 개의 성배 사이로 생명수를 흘려보내며 상극의 에너지를 황금비율로 조화시키는 연금술',
    shadowTrap: '타협과 미적지근한 어정쩡함',
    transcendenceKey: '극단을 피하고 서로 다른 재능과 관점을 부드럽게 융합해 시너지 내기'
  },
  {
    number: 15,
    nameEn: 'The Devil',
    nameKo: '악마',
    stage: '제3막: 영적 각성과 우주적 통합 (15~21)',
    coreLesson: '물질적 속박과 무의식적 중독, 섀도우를 정면으로 인식하여 사슬을 스스로 풀고 해방됨',
    shadowTrap: '쾌락·두려움에 굴복하는 무력감',
    transcendenceKey: '목에 걸린 사슬이 느슨함을 자각하고 스스로 자유를 선택해 선언하기'
  },
  {
    number: 16,
    nameEn: 'The Tower',
    nameKo: '탑',
    stage: '제3막: 영적 각성과 우주적 통합 (15~21)',
    coreLesson: '거짓된 신념과 왜곡된 에고의 바벨탑을 벼락으로 무너뜨려 진실의 대지를 드러냄',
    shadowTrap: '파괴에 대한 분노와 피해의식',
    transcendenceKey: '갑작스러운 충격을 본질로 돌아가기 위한 우주의 축복으로 받아들이기'
  },
  {
    number: 17,
    nameEn: 'The Star',
    nameKo: '별',
    stage: '제3막: 영적 각성과 우주적 통합 (15~21)',
    coreLesson: '폐허의 밤하늘을 비추는 영원한 희망의 빛과 생명수를 대지에 되돌리는 순수한 영감',
    shadowTrap: '비현실적 공상과 실행력 부재',
    transcendenceKey: '맑은 믿음으로 자신의 본질적 비전을 확신하고 사람들에게 희망 나누기'
  },
  {
    number: 18,
    nameEn: 'The Moon',
    nameKo: '달',
    stage: '제3막: 영적 각성과 우주적 통합 (15~21)',
    coreLesson: '환상과 두려움의 안개 속을 통과하며 심층 무의식의 원초적 직관을 깨우는 야간 항해',
    shadowTrap: '망상과 불안, 의심의 늪',
    transcendenceKey: '두려움은 상상력이 만든 허상임을 꿰뚫어보고 내면의 진실한 나침반 따르기'
  },
  {
    number: 19,
    nameEn: 'The Sun',
    nameKo: '태양',
    stage: '제3막: 영적 각성과 우주적 통합 (15~21)',
    coreLesson: '순수한 아이의 기쁨과 생명력, 투명한 진실로 온 세상을 밝히는 찬란한 성취와 활력',
    shadowTrap: '자기과시와 단순화의 오류',
    transcendenceKey: '밝고 긍정적인 에너지를 당당히 발산하며 존재 자체의 기쁨 만끽하기'
  },
  {
    number: 20,
    nameEn: 'Judgement',
    nameKo: '심판',
    stage: '제3막: 영적 각성과 우주적 통합 (15~21)',
    coreLesson: '대천사의 나팔소리를 듣고 과거의 무덤에서 깨어나 진정한 천명을 완수하는 위대한 각성',
    shadowTrap: '자책감과 과거의 후회에 얽매임',
    transcendenceKey: '삶의 소명을 명확히 인식하고 완전히 새로운 차원의 삶으로 부활하기'
  },
  {
    number: 21,
    nameEn: 'The World',
    nameKo: '세계',
    stage: '제3막: 영적 각성과 우주적 통합 (15~21)',
    coreLesson: '4원소의 완전한 조화와 영혼의 나선형 완성, 한 사이클의 장엄한 마침과 새로운 시작',
    shadowTrap: '완성에 대한 두려움으로 인한 지연',
    transcendenceKey: '지금까지의 여정을 온전히 인정하고 기쁘게 매듭지어 다음 차원으로 진입하기'
  }
];

export function runSoulJourneyTarotEngine(
  profile?: UserProfile,
  targetDate: Date = new Date(),
  question?: string
): SoulJourneyTarotReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  let birthSum = 0;
  if (profile?.basic?.birthdate) {
    const digits = profile.basic.birthdate.replace(/\D/g, '');
    for (const ch of digits) {
      birthSum += parseInt(ch, 10) || 0;
    }
  } else {
    birthSum = 24; // 기본 시드
  }

  // 타로 메이저 수비학 (0~21 환산)
  let soulNum = birthSum % 22;
  const dayFactor = (targetDate.getFullYear() + (targetDate.getMonth() + 1) * 3 + targetDate.getDate() * 7) % 22;
  const currentCardIndex = (soulNum + dayFactor) % 22;

  const baseCard = MAJOR_ARCANA_LIST[currentCardIndex];
  const resonancePower = 70 + ((birthSum * 7 + targetDate.getDate() * 11) % 28); // 70~97

  const currentArchetype: MajorArchetypeDetail = {
    ...baseCard,
    resonancePower
  };

  // 4원소 마이너 균형 연산
  const elementCounts = sajuRes?.elements?.counts || { '목': 1, '화': 1, '토': 2, '금': 2, '수': 2 };
  
  // Wands(불-화/목), Cups(물-수), Swords(바람-금), Pentacles(흙-토)
  const wandsRaw = ((elementCounts['화'] || 0) * 35 + (elementCounts['목'] || 0) * 15 + targetDate.getDate() * 2) % 100;
  const cupsRaw = ((elementCounts['수'] || 0) * 45 + targetDate.getMonth() * 5 + 20) % 100;
  const swordsRaw = ((elementCounts['금'] || 0) * 40 + targetDate.getDay() * 8 + 15) % 100;
  const pentaclesRaw = ((elementCounts['토'] || 0) * 35 + (elementCounts['금'] || 0) * 10 + 25) % 100;

  const wandsScore = Math.max(15, Math.min(98, wandsRaw));
  const cupsScore = Math.max(15, Math.min(98, cupsRaw));
  const swordsScore = Math.max(15, Math.min(98, swordsRaw));
  const pentaclesScore = Math.max(15, Math.min(98, pentaclesRaw));

  const suitsArr: Array<{ name: 'Wands (완드)' | 'Cups (컵)' | 'Swords (소드)' | 'Pentacles (펜타클)'; score: number }> = [
    { name: 'Wands (완드)', score: wandsScore },
    { name: 'Cups (컵)', score: cupsScore },
    { name: 'Swords (소드)', score: swordsScore },
    { name: 'Pentacles (펜타클)', score: pentaclesScore }
  ];

  suitsArr.sort((a, b) => b.score - a.score);
  const dominantSuit = suitsArr[0].name;
  const lackingSuit = suitsArr[3].name;

  const elementalBalance: ElementalSuitBalance = {
    wands: { element: '불', attribute: '창조적 열정·추진력', score: wandsScore },
    cups: { element: '물', attribute: '정서적 공감·직관력', score: cupsScore },
    swords: { element: '바람', attribute: '지적 명료함·결단력', score: swordsScore },
    pentacles: { element: '흙', attribute: '물질적 현실화·안정성', score: pentaclesScore },
    dominantSuit,
    lackingSuit
  };

  const riteOfPassage = {
    title: `${currentArchetype.nameKo}의 통과 의례`,
    currentTrial: currentArchetype.shadowTrap,
    breakthroughRitual: currentArchetype.transcendenceKey,
    alchemyScore: Math.round((resonancePower + wandsScore + pentaclesScore) / 3)
  };

  const calculatedAtKst = formatSoulJourneyKstTimestamp(targetDate);
  const q = (question || '').trim();
  const questionTopic = classifySoulJourneyTopic(q);
  const alchemyAxis = `${currentArchetype.nameKo}의 핵심 레슨을 중심으로 우세 원소(${dominantSuit})를 절제하고 보완 원소(${lackingSuit})를 채우는 연금술 균형 축`;
  const shadowWarning = `${currentArchetype.shadowTrap}에 빠지지 않도록 주의하고, 우세한 ${dominantSuit} 에너지만 과하게 쓰다 ${lackingSuit} 영역을 비워 두지 마세요.`;
  const soulJourneySynthesisMatrix = {
    dominantTension: `${currentArchetype.nameKo} ↔ ${currentArchetype.shadowTrap}`,
    alignmentState: `우세 원소: ${dominantSuit} · 보완 원소: ${lackingSuit}`,
    integratedAction: `${currentArchetype.transcendenceKey}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  const interpretiveBoundary = '본 영혼의 타로 여정 & 4원소 연금술 리포트는 타로 메이저 아르카나 원형과 생년월일 수비학에 기반한 정성적 성찰 안내이며, 확정적 미래 예언이 아닙니다.';
  const ritualAction = `[${currentArchetype.nameKo}] ${currentArchetype.transcendenceKey}`;
  const reflectionFocus = `영혼의 타로(${currentArchetype.nameKo}) — 보완 원소 ${lackingSuit}`;
  const reflectiveQuestion = q
    ? `"${q}"의 자리에서 ${currentArchetype.nameKo}의 그림자 함정(${currentArchetype.shadowTrap})을 넘어 보완 원소(${lackingSuit})를 한 스푼 더한다면 어떤 선택이 열릴까요?`
    : `오늘 ${currentArchetype.nameKo} 원형과 부족한 ${lackingSuit} 원소의 균형을 맞추기 위해 삶에 초대해 보고 싶은 태도는 무엇인가요?`;

  const synthesisPromptGuidance = `[LUCKEY 영혼 타로 여정 지능 ${SOUL_JOURNEY_TAROT_VERSION} | ${calculatedAtKst} | 질문 맥락: ${questionTopic}]
- 현재 활성 메이저 아키타입: ${currentArchetype.number}번 ${currentArchetype.nameKo} (${currentArchetype.nameEn})
- 영혼의 여정 단계: ${currentArchetype.stage}
- 연금술 균형 축: ${alchemyAxis}
- 핵심 레슨 & 통과 의례: ${currentArchetype.coreLesson} (주의 함정: ${currentArchetype.shadowTrap})
- 초월 열쇠 리추얼: ${currentArchetype.transcendenceKey}
- 4원소 마이너 슈트 균형: 우세=${dominantSuit} / 보완필요=${lackingSuit}
- 실천 의례: ${ritualAction}
- 성찰 초점: ${reflectionFocus}
- 과잉 경계: ${shadowWarning}
- 교차 매트릭스: [핵심 긴장: ${soulJourneySynthesisMatrix.dominantTension} | 조율 상태: ${soulJourneySynthesisMatrix.alignmentState}]
  * 통합 실천: ${soulJourneySynthesisMatrix.integratedAction}
- 성찰 질문: ${reflectiveQuestion}
- 해석 경계: ${interpretiveBoundary}`;

  return {
    engineVersion: SOUL_JOURNEY_TAROT_VERSION,
    calculatedAt: targetDate.toISOString(),
    calculatedAtKst,
    questionTopic,
    currentArchetype,
    elementalBalance,
    alchemyAxis,
    riteOfPassage,
    synthesisPromptGuidance,
    ritualAction,
    reflectionFocus,
    shadowWarning,
    reflectiveQuestion,
    soulJourneySynthesisMatrix,
    interpretiveBoundary,
  };
}

export type SoulJourneyTarotResult = SoulJourneyTarotReport;

export function calculateSoulJourneyTarot(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
  question?: string;
}): SoulJourneyTarotResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  return runSoulJourneyTarotEngine(profile, targetDate, params?.question);
}

export function formatSoulJourneyTarotPrompt(res: SoulJourneyTarotResult): string {
  return res.synthesisPromptGuidance;
}


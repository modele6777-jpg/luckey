/**
 * =========================================================================
 * LUCKEY 샤머니즘 파워 애니멀 & 12지지 스피릿 토템 가이드 엔진 (Shamanic Animal Totem Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 고대 샤머니즘의 '파워 애니멀(Power Animal · Spirit Guide)' 체계와 동양 12지지(자축인묘진사오미신유술해)의
 * 원초적 동물 영성 및 5행 원소를 융합한 엔진입니다.
 * 
 * 1. 주 수호 토템(Primary Spirit Totem): 일지(Day Branch)와 일간 오행이 결합된 평생의 영적 동반자
 * 2. 그림자 동물(Shadow Animal): 내면 깊은 곳에서 억압되어 잠자고 있는 야생의 생명력과 본능적 파워
 * 3. 메신저 가이드(Messenger Guide): 현재 시점 영혼의 나침반이 되어주는 조언자
 * 4. 야생의 부름 소환 리추얼(Call of the Wild Ritual): 위기나 무기력 시 동물의 본능적 힘을 깨우는 연결법
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const SHAMANIC_ANIMAL_TOTEM_VERSION = 'LUCKEY-TOTEM-v2.2.0';

function formatShamanicTotemKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

export interface TotemAnimalInfo {
  animalName: string;
  elementModifier: string;        // 예: 황금(금), 화염(화), 청록(목), 흑암(수), 대지(토)
  symbolicTitle: string;
  corePower: string;
  spiritMessage: string;
}

export interface ShamanicAnimalTotemReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  primaryTotem: TotemAnimalInfo;  // 주 수호 토템
  shadowAnimal: TotemAnimalInfo;  // 그림자 동물
  messengerGuide: TotemAnimalInfo;// 일일/시즌 메신저 가이드
  totemicResonanceScore: number;  // 야생의 영적 공명 지수 (0 ~ 100)
  callOfTheWildRitual: string;    // 파워 애니멀 소환 및 접속 리추얼
  tabooWarning: string;           // 토템의 힘을 약화시키는 금기 사항
  synthesisPromptGuidance: string;
  totemSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

export function runShamanicAnimalTotemEngine(
  profile?: UserProfile,
  targetDate: Date = new Date(),
  question?: string
): ShamanicAnimalTotemReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  const dayBranch = sajuRes?.pillars?.day?.zhi || '술';
  const element = sajuRes?.dayMaster?.element || '금';

  // 12지지 동물 및 오행 결합 주 수호 토템
  const animalMap: Record<string, { baseAnimal: string; corePower: string }> = {
    '자': { baseAnimal: '영민한 흑설치류 / 부엉이 (Owl/Rat)', corePower: '어둠 속을 꿰뚫어보는 야간 투시력과 비상한 지략' },
    '축': { baseAnimal: '황소 / 거대한 들소 (Bison/Ox)', corePower: '어떠한 비바람에도 뒤로 물러서지 않는 우직한 뚝심과 인내' },
    '인': { baseAnimal: '호랑이 / 벵갈 타이거 (Tiger)', corePower: '단숨에 공간을 압도하는 제왕의 포효와 단호한 도약' },
    '묘': { baseAnimal: '달빛 토끼 / 숲속의 사슴 (Rabbit/Deer)', corePower: '미세한 위험을 즉각 감지하고 경쾌하게 빠져나가는 기민한 직관' },
    '진': { baseAnimal: '청룡 / 뇌전의 독수리 (Dragon/Eagle)', corePower: '하늘과 바다를 굽어보며 판도를 뒤흔드는 거시적 비전' },
    '사': { baseAnimal: '지혜의 뱀 / 코브라 (Serpent/Cobra)', corePower: '허물을 벗어던지는 영적 재생력과 은밀하고 치명적인 통찰' },
    '오': { baseAnimal: '야생마 / 페가수스 (Wild Stallion)', corePower: '지평선을 향해 거침없이 질주하는 야생의 순수 열정과 자유' },
    '미': { baseAnimal: '산양 / 알프스 아이벡스 (Ibex/Ram)', corePower: '가파른 절벽에서도 평온하게 균형을 잡는 유연함과 평화' },
    '신': { baseAnimal: '영물 원숭이 / 침팬지 (Monkey/Chimp)', corePower: '모든 난관을 유쾌한 트릭과 지혜로 돌파하는 천재적 적응력' },
    '유': { baseAnimal: '새벽을 깨우는 봉황 / 백매 (Phoenix/Hawk)', corePower: '어둠의 장막을 가르고 여명을 선포하는 높은 고결함과 혜안' },
    '술': { baseAnimal: '충직한 늑대 / 신의의 맹견 (Wolf/Hound)', corePower: '무리와 영토를 목숨 걸고 수호하는 절대적 신의와 야생의 감각' },
    '해': { baseAnimal: '검은 멧돼지 / 고래 (Boar/Whale)', corePower: '생명의 심연을 유영하며 풍요를 끌어안는 거대한 포용력' }
  };

  const currentBranchData = animalMap[dayBranch] || animalMap['술'];

  let elementPrefix = '황금빛 (Golden)';
  if (element === '목') elementPrefix = '청록빛 생명 (Verdant)';
  else if (element === '화') elementPrefix = '화염빛 태양 (Solar Flame)';
  else if (element === '토') elementPrefix = '태고의 대지 (Primordial Earth)';
  else if (element === '금') elementPrefix = '서리 내린 강철 (Frost Iron)';
  else if (element === '수') elementPrefix = '심연의 심해 (Abyssal Ocean)';

  const primaryTotem: TotemAnimalInfo = {
    animalName: `${elementPrefix} ${currentBranchData.baseAnimal}`,
    elementModifier: element,
    symbolicTitle: '내면의 주권적 수호 영물 (Sovereign Protector)',
    corePower: currentBranchData.corePower,
    spiritMessage: '너의 야생성을 두려워하지 마라. 문명의 가면 뒤에 숨겨진 너의 발톱과 날개는 세상의 벽을 깨부수기 위해 존재한다.'
  };

  // 그림자 동물 (억압된 본능)
  const shadowAnimal: TotemAnimalInfo = {
    animalName: element === '금' || element === '토' ? '심야의 흑표범 (Black Panther)' : '대지의 붉은 곰 (Grizzly Bear)',
    elementModifier: '그림자 본능',
    symbolicTitle: '억압된 잠재력의 그림자 가이드',
    corePower: '남들의 눈치를 보지 않고 당당하게 공간을 차지하는 원초적 자존감',
    spiritMessage: '착한 아이의 굴레를 벗어던져라. 때로는 당당하게 이빨을 드러낼 줄 알아야 진짜 너의 영역을 지킬 수 있다.'
  };

  // 메신저 가이드 (일진 수리에 따른 가이드)
  const messengerGuide: TotemAnimalInfo = {
    animalName: '눈보라를 뚫는 북극 여우 (Arctic Fox)',
    elementModifier: '기민한 둔갑과 적응',
    symbolicTitle: '현재의 관문을 여는 메신저',
    corePower: '복잡한 상황에서도 본질만 낚아채는 영민한 상황 판단력',
    spiritMessage: '정면 돌파만이 능사가 아니다. 유연하게 몸을 숨기고 바람의 방향이 바뀔 때 날렵하게 낚아채라.'
  };

  const seed = (dayBranch.charCodeAt(0) + element.charCodeAt(0) + targetDate.getDate() * 7) % 100;
  const totemicResonanceScore = 80 + (seed % 19);

  const callOfTheWildRitual = `조용한 곳에서 척추를 곧게 펴고 앉아 [${primaryTotem.animalName}]의 묵직한 호흡과 시선을 내 몸에 빙의하듯 일치시킵니다. "내 안의 야생 영혼이여, 깨어나 나를 인도하라"고 낮게 읊조릴 때 온몸에 전율과 함께 원초적 용기가 차오릅니다.`;

  const tabooWarning = '타인의 비위를 맞추기 위해 스스로의 맹수다운 결기를 죽이고 비굴하게 굴복하는 태도를 경계하세요. 토템의 기운이 급격히 소진됩니다.';

  const calculatedAtKst = formatShamanicTotemKstTimestamp(targetDate);
  const q = (question || '').trim();
  const totemSynthesisMatrix = {
    dominantTension: `${primaryTotem.animalName} ↔ ${shadowAnimal.animalName}`,
    alignmentState: `메신저: ${messengerGuide.animalName} · 원소: ${element}`,
    integratedAction: `${callOfTheWildRitual}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  const interpretiveBoundary = '본 샤머니즘 파워 애니멀 & 12지지 토템 리포트는 전통 동물 영성과 오행 상징에 기반한 정성적 성찰 안내이며, 확정적 미래 예언이 아닙니다.';
  const reflectiveQuestion = q
    ? `'${q}' 상황에서 눈치 보며 억누르고 있던 ${shadowAnimal.animalName}의 본능을 ${primaryTotem.animalName}의 당당한 힘으로 어떻게 세울 수 있을까요?`
    : `지금 내 안에서 착한 가면 뒤에 숨어 있던 야생의 생명력과 직관을 깨워 한 걸음 내디뎌야 할 자리는 어디인가요?`;

  const synthesisPromptGuidance = `[LUCKEY 샤머니즘 파워 애니멀 & 12지지 스피릿 토템 ${SHAMANIC_ANIMAL_TOTEM_VERSION} | ${calculatedAtKst}]
- 주 수호 토템: [${primaryTotem.animalName}]
  * 핵심 능력: ${primaryTotem.corePower}
  * 영적 전언: "${primaryTotem.spiritMessage}"
- 그림자 동물(Shadow Guide): [${shadowAnimal.animalName}] (${shadowAnimal.corePower})
- 시의적 메신저: [${messengerGuide.animalName}] ("${messengerGuide.spiritMessage}")
- 야생의 부름 소환법: ${callOfTheWildRitual}
- 절대적 금기: ${tabooWarning}
- 교차 매트릭스: [핵심 긴장: ${totemSynthesisMatrix.dominantTension} | 조율 상태: ${totemSynthesisMatrix.alignmentState}]
  * 통합 실천: ${totemSynthesisMatrix.integratedAction}
- 질문 맞춤 성찰 질문: ${reflectiveQuestion}
- 해석 경계: ${interpretiveBoundary}`;

  return {
    engineVersion: SHAMANIC_ANIMAL_TOTEM_VERSION,
    calculatedAt: targetDate.toISOString(),
    calculatedAtKst,
    primaryTotem,
    shadowAnimal,
    messengerGuide,
    totemicResonanceScore,
    callOfTheWildRitual,
    tabooWarning,
    synthesisPromptGuidance,
    totemSynthesisMatrix,
    reflectiveQuestion,
    interpretiveBoundary,
  };
}

export type ShamanicAnimalTotemResult = ShamanicAnimalTotemReport;

export function calculateShamanicAnimalTotem(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
  question?: string;
}): ShamanicAnimalTotemResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  return runShamanicAnimalTotemEngine(profile, targetDate, params?.question);
}

export function formatShamanicAnimalTotemPrompt(res: ShamanicAnimalTotemResult): string {
  return res.synthesisPromptGuidance;
}

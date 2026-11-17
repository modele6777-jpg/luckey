/**
 * =========================================================================
 * LUCKEY 인도 정통 아유르베다 3대 도샤(트리도샤) 체질 & 프라나 생명력 엔진 (v2.0.0)
 * (Ayurvedic Tridosha & Prana Subtle Energy Engine)
 * =========================================================================
 *
 * [학술적 배경]
 * 《차라카 삼히타(Charaka Samhita)》 및 《아슈탕가 흐리다야(Ashtanga Hridaya)》 원전을 기반으로
 * 프라크리티(선천 체질), 비크리티(현재 편차), 질문 맥락의 3대 구나(Sattva·Rajas·Tamas),
 * KST 24시간 아유르베다 도샤 생체시계(Dinacharya)를 정성적·시공간적으로 교차 감사하여
 * 프롬프트에 백분율/점수 수치를 노출하지 않는 순수 치유 지침을 제공합니다.
 */

import type { UserProfile } from '../sharedState';

export const AYURVEDIC_TRIDOSHA_VERSION = 'LUCKEY-AYURVEDIC-TRIDOSHA-v2.4.0';

export type AyurvedicQuestionFocus = 'stress' | 'relationship' | 'career' | 'health' | 'spiritual';

export interface DoshaBreakdown {
  vata: number;
  pitta: number;
  kapha: number;
  dominantDosha:
    | '바타 (Vata)'
    | '피타 (Pitta)'
    | '카파 (Kapha)'
    | '바타-피타 (Vata-Pitta)'
    | '피타-카파 (Pitta-Kapha)'
    | '바타-카파 (Vata-Kapha)'
    | '트리도샤 삼도 조화 (Tridoshic)';
  constitutionType: string;
  characteristicQualities: string[];
}

export interface SubtleEnergies {
  pranaScore: number;
  tejasScore: number;
  ojasScore: number;
  overallVitalityScore: number;
}

export interface DinacharyaPrescription {
  morningPurification: string;
  dietaryGuidance: string;
  pranayamaBreathing: string;
  eveningRestoration: string;
}

export interface SituationalAyurvedaAudit {
  focus: AyurvedicQuestionFocus;
  charakaSutra: string;
  gunaMentalState: string;
  doshaImbalanceRisk: string;
  sattvicAction: string;
}

export interface TemporalDinacharyaRhythm {
  kstHour: number;
  doshaClockWindow: string;
  ritucharyaSeason: string;
  agniDigestiveState: string;
  clockAlignedAdvice: string;
}

export interface TridoshaSynthesisMatrix {
  prakritiVikritiGap: string;
  subtleEnergyBalance: string;
  ojasImmunityState: string;
  synthesizedVerdict: string;
}

export interface AyurvedicTridoshaReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  questionFocus: AyurvedicQuestionFocus;
  prakritiConstitution: DoshaBreakdown;
  vikritiCurrentState: DoshaBreakdown;
  subtleEnergies: SubtleEnergies;
  dinacharya: DinacharyaPrescription;
  situationalAyurvedaAudit: SituationalAyurvedaAudit;
  temporalDinacharyaRhythm: TemporalDinacharyaRhythm;
  tridoshaSynthesisMatrix: TridoshaSynthesisMatrix;
  tridoshaHarmonizationGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

function detectAyurvedicFocus(question: string): AyurvedicQuestionFocus {
  const q = question.toLowerCase();
  if (/불안|스트레스|초조|지침|잠|수면|피로|소화|몸|건강/.test(q)) return 'health';
  if (/화|짜증|억울|걱정|우울|힘들|압박/.test(q)) return 'stress';
  if (/사람|관계|연애|가족|친구|갈등|상처/.test(q)) return 'relationship';
  if (/일|직장|사업|돈|시험|성과|목표|결정/.test(q)) return 'career';
  return 'spiritual';
}

function buildSituationalAyurvedaAudit(
  focus: AyurvedicQuestionFocus,
  dominantDosha: DoshaBreakdown['dominantDosha']
): SituationalAyurvedaAudit {
  switch (focus) {
    case 'health':
      return {
        focus,
        charakaSutra: '《차라카 삼히타》 수트라스하나 — "아그니(소화 불꽃)가 고르면 장수하고, 어지러우면 생기가 흩어진다."',
        gunaMentalState: '타마스(무거움·정체)와 바타(건조·불안정)가 번갈아 나타나기 쉬운 회복기입니다.',
        doshaImbalanceRisk: `${dominantDosha} 체질 특유의 피로 신호를 무시하고 찬 음식이나 불규칙한 수면을 이어가면 오자스(Ojas)가 빠르게 마릅니다.`,
        sattvicAction: '오늘 식사는 따뜻하고 소화가 잘되는 조리 음식으로 가볍게 드시고, 취침 전 스마트폰 빛을 끄고 10분 일찍 눕세요.',
      };
    case 'stress':
      return {
        focus,
        charakaSutra: '《차라카 삼히타》 — "마음의 두 가지 병인은 라자스(과도한 격정)와 타마스(어두운 집착)이며, 이를 다스리는 약은 사트바(맑은 지혜)이다."',
        gunaMentalState: '라자스(과열과 조급함)가 올라와 피타·바타의 균형을 흔들고 있습니다.',
        doshaImbalanceRisk: '감정의 열기를 억누르거나 즉흥적으로 쏟아내면 신경계 프라나(Prana)가 흩어집니다.',
        sattvicAction: '날숨을 들숨보다 2배 길게 내쉬는 이완 호흡을 5회 반복해 과열된 라자스 열기를 부드럽게 식히세요.',
      };
    case 'relationship':
      return {
        focus,
        charakaSutra: '《아슈탕가 흐리다야》 — "부드러운 말과 자애로운 시선은 오자스(생명 정수)를 기르는 최고의 보약이다."',
        gunaMentalState: '상대의 기질 차이를 불균형으로 오해하기 쉬운 예민한 공명 상태입니다.',
        doshaImbalanceRisk: `${dominantDosha}의 속도가 상대의 호흡과 어긋날 때 서운함이나 조급함이 커질 수 있습니다.`,
        sattvicAction: '상대를 내 속도로 재촉하기 전에 따뜻한 차 한 잔을 마시며 마음의 여백(Akasha)을 먼저 확보하세요.',
      };
    case 'career':
      return {
        focus,
        charakaSutra: '《차라카 삼히타》 — "적절한 때(Kala)와 알맞은 분량(Matra)을 지키는 행위가 모든 성취의 근본이다."',
        gunaMentalState: '테자스(지적 불꽃)가 활발하나 과열될 경우 소진으로 이어질 수 있는 추진 국면입니다.',
        doshaImbalanceRisk: '완벽주의로 휴식을 생략하면 피타의 불꽃이 스스로의 집중력을 태워버립니다.',
        sattvicAction: '핵심 과업을 90분 단위로 끊어 진행하고, 중간 5분은 창밖을 보며 눈과 신경계의 열기를 내려놓으세요.',
      };
    case 'spiritual':
    default:
      return {
        focus: 'spiritual',
        charakaSutra: '《차라카 삼히타》 샤리라스하나 — "감각과 마음이 평온한 자리에 머물 때 프라나는 저절로 온몸을 밝힌다."',
        gunaMentalState: '사트바(Sattva, 맑고 조화로운 알아차림)로 나아가는 내면 정렬의 시간입니다.',
        doshaImbalanceRisk: '생각이 지나치게 많아지면 바타(공기)가 떠올라 현실 감각에서 멀어질 수 있습니다.',
        sattvicAction: '맨발이나 두 발바닥이 바닥에 닿는 감각을 느끼며 3분간 조용히 호흡을 관찰하세요.',
      };
  }
}

function buildTemporalDinacharyaRhythm(now: Date): TemporalDinacharyaRhythm {
  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstHour = kstDate.getUTCHours();
  const kstMonth = kstDate.getUTCMonth() + 1;

  let doshaClockWindow = '피타(Pitta) 심야 정화 시간 (22:00~01:59)';
  let agniDigestiveState = '대사 재정비 국면 — 음식 소화 대신 세포 회복과 기억 정리가 일어나는 시간';
  let clockAlignedAdvice = '늦은 야식과 강한 화면 빛을 피하고 깊은 수면으로 오자스(면역 정수)를 채우세요.';

  if (kstHour >= 2 && kstHour < 6) {
    doshaClockWindow = '브라흐마 무후르타 · 바타(Vata) 여명 시간 (02:00~05:59)';
    agniDigestiveState = '가벼운 신경 각성 국면 — 프라나가 가장 맑고 직관이 예민한 새벽';
    clockAlignedAdvice = '일찍 깨어났다면 억지 생각 대신 고요한 호흡과 따뜻한 온수로 하루를 여세요.';
  } else if (kstHour >= 6 && kstHour < 10) {
    doshaClockWindow = '카파(Kapha) 오전 안정 시간 (06:00~09:59)';
    agniDigestiveState = '부드러운 시동 국면 — 무겁고 차가운 음식을 피하고 가볍게 몸을 깨울 시간';
    clockAlignedAdvice = '미온수와 가벼운 스트레칭으로 밤사이 묵은 둔중함을 부드럽게 풀어내세요.';
  } else if (kstHour >= 10 && kstHour < 14) {
    doshaClockWindow = '피타(Pitta) 정오 대사 정점 시간 (10:00~13:59)';
    agniDigestiveState = '아그니(소화 불꽃) 최고조 — 하루 중 영양 흡수와 지적 결단이 가장 힘찬 시간';
    clockAlignedAdvice = '가장 든든하고 균형 잡힌 식사를 이 시간대에 맞추고 핵심 업무를 처리하세요.';
  } else if (kstHour >= 14 && kstHour < 18) {
    doshaClockWindow = '바타(Vata) 오후 창의 시간 (14:00~17:59)';
    agniDigestiveState = '신경 순환 활발 국면 — 아이디어와 소통이 빠르지만 산만해지기 쉬운 시간';
    clockAlignedAdvice = '따뜻한 허브차로 수분을 보충하고 작은 실행들을 차분히 매듭지으세요.';
  } else if (kstHour >= 18 && kstHour < 22) {
    doshaClockWindow = '카파(Kapha) 저녁 이완 시간 (18:00~21:59)';
    agniDigestiveState = '하강 및 안식 국면 — 소화력이 서서히 가라앉아 가벼운 저녁이 필요한 시간';
    clockAlignedAdvice = '저녁 식사는 가볍게 마치고 하루의 긴장을 씻어내는 이완 루틴으로 들어가세요.';
  }

  let ritucharyaSeason = '헤만타·시시라(겨울) — 바타(건조·냉기)가 늘기 쉬워 온기와 윤기를 보충하는 계절';
  if (kstMonth >= 3 && kstMonth <= 5) {
    ritucharyaSeason = '바산타(봄) — 카파(습윤·무거움)가 녹아 나오므로 가볍고 따뜻한 순환이 필요한 계절';
  } else if (kstMonth >= 6 && kstMonth <= 8) {
    ritucharyaSeason = '그리슈마·바르샤(여름) — 피타(열기)가 높아지므로 과열을 식히고 진액을 지키는 계절';
  } else if (kstMonth >= 9 && kstMonth <= 11) {
    ritucharyaSeason = '샤라드(가을) — 피타의 잔열과 바타의 건조함이 교차해 보습과 평온이 필요한 계절';
  }

  return {
    kstHour,
    doshaClockWindow,
    ritucharyaSeason,
    agniDigestiveState,
    clockAlignedAdvice,
  };
}

export function calculateAyurvedicTridoshaPrana(params: {
  profile?: UserProfile | null;
  targetDate?: Date;
  question?: string;
}): AyurvedicTridoshaReport {
  const now = params.targetDate || new Date();
  const question = params.question || '';

  let birthMonth = 3;
  let birthDay = 21;
  let birthYear = 1990;

  if (params.profile?.basic?.birthdate) {
    const parts = params.profile.basic.birthdate.split('-');
    if (parts.length >= 3) {
      birthYear = parseInt(parts[0], 10) || 1990;
      birthMonth = parseInt(parts[1], 10) || 3;
      birthDay = parseInt(parts[2], 10) || 21;
    }
  }

  const rawVata = 30 + ((birthYear * 3 + birthDay * 7) % 35);
  const rawPitta = 30 + ((birthMonth * 11 + birthDay * 5) % 35);
  const rawKapha = 30 + ((birthYear + birthMonth * 7 + birthDay * 3) % 35);

  const totalRaw = rawVata + rawPitta + rawKapha;
  const vataPct = Math.round((rawVata / totalRaw) * 100);
  const pittaPct = Math.round((rawPitta / totalRaw) * 100);
  const kaphaPct = 100 - (vataPct + pittaPct);

  let dominantDosha: DoshaBreakdown['dominantDosha'] = '바타-피타 (Vata-Pitta)';
  let constitutionType = '창의적 지성과 민첩한 결단 체질';
  let characteristicQualities = ['민첩함', '통찰력', '예술적 감수성'];

  if (vataPct >= 45) {
    dominantDosha = '바타 (Vata)';
    constitutionType = '바람과 허공의 자유로운 영혼 체질';
    characteristicQualities = ['창의성', '유연한 직관', '풍부한 상상력', '민첩성'];
  } else if (pittaPct >= 45) {
    dominantDosha = '피타 (Pitta)';
    constitutionType = '타오르는 불꽃의 지성과 추진력 체질';
    characteristicQualities = ['날카로운 통찰', '명료한 결단', '리더십', '높은 집중력'];
  } else if (kaphaPct >= 45) {
    dominantDosha = '카파 (Kapha)';
    constitutionType = '대지와 생명수의 흔들리지 않는 안식 체질';
    characteristicQualities = ['깊은 인내심', '강한 체력', '안정감', '자애로운 포용'];
  } else if (vataPct >= 35 && pittaPct >= 35) {
    dominantDosha = '바타-피타 (Vata-Pitta)';
    constitutionType = '바람과 불의 결합: 혁신적 아이디어와 빠른 실행력';
    characteristicQualities = ['역동성', '아이디어 뱅크', '승부욕', '열정'];
  } else if (pittaPct >= 35 && kaphaPct >= 35) {
    dominantDosha = '피타-카파 (Pitta-Kapha)';
    constitutionType = '불과 대지의 결합: 강력한 카리스마와 체계적 경영력';
    characteristicQualities = ['조직력', '실행력', '성실함', '영향력'];
  } else if (vataPct >= 35 && kaphaPct >= 35) {
    dominantDosha = '바타-카파 (Vata-Kapha)';
    constitutionType = '바람과 대지의 결합: 몽환적 감수성과 온화한 적응력';
    characteristicQualities = ['예술성', '공감력', '차분한 관찰력', '유연성'];
  } else {
    dominantDosha = '트리도샤 삼도 조화 (Tridoshic)';
    constitutionType = '삼대 도샤의 완벽한 황금 균형 체질';
    characteristicQualities = ['다재다능', '신체 균형', '정서적 안정', '복원력'];
  }

  const prakritiConstitution: DoshaBreakdown = {
    vata: vataPct,
    pitta: pittaPct,
    kapha: kaphaPct,
    dominantDosha,
    constitutionType,
    characteristicQualities,
  };

  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const nowMonth = kstDate.getUTCMonth() + 1;
  const nowHour = kstDate.getUTCHours();

  let transitVataMod = 0;
  let transitPittaMod = 0;
  let transitKaphaMod = 0;

  if (nowMonth >= 11 || nowMonth <= 2) transitVataMod += 8;
  else if (nowMonth >= 6 && nowMonth <= 8) transitPittaMod += 8;
  else transitKaphaMod += 8;

  const vikritiVata = Math.min(80, Math.max(10, vataPct + transitVataMod));
  const vikritiPitta = Math.min(80, Math.max(10, pittaPct + transitPittaMod));
  const vikritiKapha = Math.min(80, Math.max(10, kaphaPct + transitKaphaMod));
  const vikritiTotal = vikritiVata + vikritiPitta + vikritiKapha;

  const vikritiConstitution: DoshaBreakdown = {
    vata: Math.round((vikritiVata / vikritiTotal) * 100),
    pitta: Math.round((vikritiPitta / vikritiTotal) * 100),
    kapha: 100 - (Math.round((vikritiVata / vikritiTotal) * 100) + Math.round((vikritiPitta / vikritiTotal) * 100)),
    dominantDosha,
    constitutionType: `현재 시공간 리듬 반영: ${dominantDosha} 균형 조율 중`,
    characteristicQualities: ['에너지 순환', '자연 리듬 조응'],
  };

  const pranaScore = Math.min(98, Math.max(60, 85 + (vataPct > 35 ? 7 : -3) + (nowHour % 5)));
  const tejasScore = Math.min(98, Math.max(60, 82 + (pittaPct > 35 ? 8 : -2) + (birthDay % 7)));
  const ojasScore = Math.min(98, Math.max(60, 80 + (kaphaPct > 35 ? 9 : -1) + (birthMonth % 6)));
  const overallVitalityScore = Math.round(pranaScore * 0.35 + tejasScore * 0.35 + ojasScore * 0.3);

  let morningPurification = '기상 직후 따뜻한 레몬 온수 음용 및 참기름 또는 코코넛 오일풀링(10분)으로 밤사이 축적된 아마(Ama, 독소) 배출';
  let dietaryGuidance = '단맛·신맛·짠맛의 따뜻하고 촉촉한 음식을 섭취하여 가벼운 건조함을 완화하고 튀긴 자극적 음식 절제';
  let pranayamaBreathing = '나디 쇼다나(Nadi Shodhana, 좌우 교대 콧구멍 정화 호흡 10분)로 교감·부교감 신경계의 완벽한 안정 도모';
  let eveningRestoration = '취침 전 따뜻한 골든 밀크(강황, 육두구, 꿀) 한 잔과 발바닥 마사지로 깊은 오자스(면역 활력) 재충전';

  if (pittaPct > vataPct && pittaPct > kaphaPct) {
    morningPurification = '미온수로 가볍게 입안을 헹구고 눈을 찬물로 세안하여 상체의 과도한 열기(Pitta) 냉각';
    dietaryGuidance = '단맛·쓴맛·떫은맛의 시원하고 신선한 채소와 녹두죽 섭취, 과도한 매운맛과 알코올 절제';
    pranayamaBreathing = '시탈리(Sheetali, 혀를 둥글게 말아 마시는 쿨링 호흡 10회)로 내면의 과열된 불꽃 조절';
    eveningRestoration = '은은한 샌달우드 향기를 맡으며 스마트폰을 끄고 달빛을 받으며 명상';
  } else if (kaphaPct > vataPct && kaphaPct > pittaPct) {
    morningPurification = '따뜻한 생강차 음용 및 건식 바디 브러싱(Garshana)으로 림프 순환 촉진과 둔중함 해소';
    dietaryGuidance = '매운맛·쓴맛·떫은맛의 가볍고 따뜻한 음식 섭취, 단맛·유제품·차가운 음식의 과다 섭취 제한';
    pranayamaBreathing = '카팔라바티(Kapalbhati, 복부 반동 호흡 3세트)와 바스트리카로 전신의 대사 활력 극대화';
    eveningRestoration = '저녁 식사를 가볍게 마치고 취침 3시간 전 금식하여 무거운 정체감 예방';
  }

  const dinacharya: DinacharyaPrescription = {
    morningPurification,
    dietaryGuidance,
    pranayamaBreathing,
    eveningRestoration,
  };

  const questionFocus = detectAyurvedicFocus(question);
  const situationalAyurvedaAudit = buildSituationalAyurvedaAudit(questionFocus, dominantDosha);
  const temporalDinacharyaRhythm = buildTemporalDinacharyaRhythm(now);

  const subtleEnergyBalance =
    pranaScore >= tejasScore && pranaScore >= ojasScore
      ? '프라나(생명 숨결)의 감수성이 가장 앞서며, 테자스(지성)와 오자스(면역)를 부드럽게 이끄는 흐름'
      : tejasScore >= ojasScore
        ? '테자스(지적 광채)가 뚜렷하게 살아 있어 결단과 집중력이 돋보이는 흐름'
        : '오자스(면역 저장고)가 든든하게 받쳐 주어 회복과 지구력이 안정적인 흐름';

  const tridoshaSynthesisMatrix: TridoshaSynthesisMatrix = {
    prakritiVikritiGap: `선천 체질 [${dominantDosha}]에 현재 계절 기운(${temporalDinacharyaRhythm.ritucharyaSeason})이 더해져 균형 조율이 진행 중입니다.`,
    subtleEnergyBalance,
    ojasImmunityState: overallVitalityScore >= 82 ? '오자스(면역·회복 정수)가 충만하여 무리 없는 조율 가능' : '과로를 줄이고 따뜻한 수면과 섭생으로 오자스 보충 필요',
    synthesizedVerdict: `${temporalDinacharyaRhythm.doshaClockWindow}에 맞춰 [${dinacharya.pranayamaBreathing}]을 실천할 때 심신의 리듬이 가장 맑아집니다.`,
  };

  const tridoshaHarmonizationGuidance = `당신의 선천 체질은 [${prakritiConstitution.dominantDosha}] (${prakritiConstitution.constitutionType})이며, 현재 ${subtleEnergyBalance}을 보이고 있습니다. ${dinacharya.pranayamaBreathing}을 통해 몸과 마음의 조화를 지키십시오.`;
  const interpretiveBoundary = '본 리포트는 아유르베다 《차라카 삼히타》 체질·생체시계 상징에 기반한 정성적 양생 안내이며, 의학적 진단이나 처방이 아닙니다.';

  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const calculatedAtKst = `${kst.toISOString().slice(0, 19)}+09:00`;

  const reflectionFocus = `${situationalAyurvedaAudit.gunaMentalState} 지금 내 몸의 도샤 균형을 위해 가장 먼저 덜어낼 자극은 무엇인가요?`;
  const reflectiveQuestion = question.trim()
    ? `"${question.trim()}"에 마음이 흔들릴 때, 지금 내 몸과 호흡의 균형(${prakritiConstitution.dominantDosha})을 회복하기 위해 가장 먼저 덜어낼 자극은 무엇인가요?`
    : reflectionFocus;

  return {
    engineVersion: AYURVEDIC_TRIDOSHA_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    questionFocus,
    prakritiConstitution,
    vikritiCurrentState: vikritiConstitution,
    subtleEnergies: {
      pranaScore,
      tejasScore,
      ojasScore,
      overallVitalityScore,
    },
    dinacharya,
    situationalAyurvedaAudit,
    temporalDinacharyaRhythm,
    tridoshaSynthesisMatrix,
    tridoshaHarmonizationGuidance,
    ritualAction: `${dinacharya.pranayamaBreathing} (${situationalAyurvedaAudit.sattvicAction})`,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary,
  };
}

export function formatAyurvedicTridoshaPranaPrompt(report: AyurvedicTridoshaReport): string {
  return `### 🌿 인도 정통 아유르베다 3대 도샤(Tridosha) & 프라나 생명력 엔진 (${AYURVEDIC_TRIDOSHA_VERSION})
- **연산 시각**: ${report.calculatedAtKst}
- **선천 본질 체질(Prakriti)**: ${report.prakritiConstitution.dominantDosha} [${report.prakritiConstitution.constitutionType}]
  - 대표 특성: ${report.prakritiConstitution.characteristicQualities.join(', ')}
- **3대 미세 생체 에너지 (Prana · Tejas · Ojas)**: ${report.tridoshaSynthesisMatrix.subtleEnergyBalance} (${report.tridoshaSynthesisMatrix.ojasImmunityState})
- **질문 맥락 아유르베다 감사 (${report.situationalAyurvedaAudit.focus})**:
  - 원전 수트라: ${report.situationalAyurvedaAudit.charakaSutra}
  - 마음 구나 상태: ${report.situationalAyurvedaAudit.gunaMentalState}
  - 불균형 주의: ${report.situationalAyurvedaAudit.doshaImbalanceRisk}
  - 사트바 실천: ${report.situationalAyurvedaAudit.sattvicAction}
- **KST 도샤 생체시계 리듬 (${report.temporalDinacharyaRhythm.doshaClockWindow})**:
  - 아그니 상태: ${report.temporalDinacharyaRhythm.agniDigestiveState}
  - 계절 리투차리아: ${report.temporalDinacharyaRhythm.ritucharyaSeason}
  - 시의성 지침: ${report.temporalDinacharyaRhythm.clockAlignedAdvice}
- **아유르베다 맞춤 딘차리아(Dinacharya) 처방**:
  - 모닝 정화: ${report.dinacharya.morningPurification}
  - 섭생 지침: ${report.dinacharya.dietaryGuidance}
  - 프라나야마 호흡: ${report.dinacharya.pranayamaBreathing}
  - 저녁 이완: ${report.dinacharya.eveningRestoration}
- **교차 매트릭스 종합**: ${report.tridoshaSynthesisMatrix.synthesizedVerdict}
- **심신 조화 지침**: ${report.tridoshaHarmonizationGuidance}
- **성찰 질문**: ${report.reflectiveQuestion}
- **해석 경계**: ${report.interpretiveBoundary}`;
}

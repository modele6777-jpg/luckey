/**
 * 고대 이집트 《암두아트의 서(Book of Amduat)》 12시간 태양신 라의 밤의 저승 항해 & 케프리 새벽 부활 엔진
 *
 * LUCKEY-EGYPTIAN-AMDUAT-RA-v1.0.0
 *
 * 고대 이집트 신왕국 왕가의 계곡 파라오 무덤에 벽화로 새겨진 최고(最古)의 저승 안내서
 * 《암두아트의 서(Book of the Amduat, 저승에 있는 것들의 책)》에 기반한 밤의 심연 통과,
 * 혼돈의 뱀 아포피스(Apophis) 분쇄, 오시리스 신성 합일 및 케프리(Khepri) 새벽 부활 결정론 엔진.
 *
 * [핵심 신화 및 우주 주기 모델]
 * 1. 암두아트 12시간의 저승 항해 (Twelve Hours of the Duat):
 *    - 태양신 라(Ra)가 야간의 태양선 메섹테트(Mesektet)를 타고 저승의 강을 항해함.
 *    - 제1~3시간: 황혼의 문 통과, 우르네스 대양과 풍요의 수로, 영혼들의 갈증 해소.
 *    - 제4~5시간: 소카르의 모래 사막과 어두운 동굴(로세타우) 돌파, 영적 시험.
 *    - 제6시간: 한밤중 자정, 라와 오시리스의 신성 합일(Ra-Osiris Union)로 우주의 생명력 재충전.
 *    - 제7시간: 혼돈과 공포의 거대한 뱀 아포피스(Apophis)와의 결전 및 지혜의 여신 이시스의 마법으로 제압.
 *    - 제8~11시간: 태양의 부활 준비, 별들의 호위, 새벽의 빛 수혈.
 *    - 제12시간: 거대한 뱀의 몸(1300보)을 통과하여 늙은 태양이 벗겨지고, 새로운 태양 쇠똥구리신 케프리(Khepri)로 탄생하여 지평선 위로 비상!
 * 2. 아포피스 방어력:
 *    - 의지를 마비시키는 회의감, 두려움, 나태함을 파괴하는 불멸의 태양 마법.
 * 3. 케프리(Khepri) 재생력:
 *    - 가장 깊은 어둠의 바닥에서 다시 솟아오르는 불사조와 같은 자기 갱신 에너지.
 */

import type { UserProfile } from '../sharedState';

export const EGYPTIAN_AMDUAT_VERSION = '2.4.0';

export interface AmduatSituationalAudit {
  duatGateFocus: string;
  apophisResistance: string;
  barqueAction: string;
  abyssCaution: string;
}

export interface AmduatTemporalRhythm {
  kstHour: number;
  solarBarqueWatch: string;
  nileSeasonPhase: string;
  voyageGuidance: string;
  solarTempo: '항해' | '결전' | '새벽부활';
}

export interface AmduatSynthesisMatrix {
  rebirthState: '케프리비상' | '라오시리스합일' | '심연돌파';
  hourGuardianLink: string;
  nextBarqueStep: string;
}

export interface EgyptianAmduatReport {
  engineVersion: string;
  calculatedAt: string;
  // 암두아트 5대 태양 지표 (0~100)
  khepriRebirthLuminosityScore: number; // 케프리 새벽 부활 태양 광채도
  apophisChaosDispellingForce: number; // 아포피스 어둠·혼돈 분쇄 내구력
  midnightRaOsirisUnionPower: number; // 심야 라-오시리스 신성 합일 생명력
  twelveUnderworldGatesMastery: number; // 지하 12관문 돌파 통찰력
  mesektetSolarBarqueSteadiness: number; // 메섹테트 태양의 배 항해 안정도
  // 현재 통과 중인 암두아트 시간대
  currentAmduatHour: {
    hourNumber: number;
    hourNameAncient: string;
    hourTheme: string;
    cosmicTrial: string;
    victoryBlessing: string;
  };
  solarDeityGuardian: {
    nameAncient: string;
    role: string;
    solarGift: string;
  };
  situationalAmduatAudit: AmduatSituationalAudit;
  temporalAmduatRhythm: AmduatTemporalRhythm;
  amduatSynthesisMatrix: AmduatSynthesisMatrix;
  amduatHieroglyphicWisdom: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  calculatedAtKst: string;
}

function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const AMDUAT_HOURS = [
  {
    hourNumber: 1,
    hourNameAncient: '웨테스-네페루-라 (Wetes-neferu-Ra)',
    hourTheme: '황혼의 문 개막과 메섹테트 출항',
    cosmicTrial: '낮의 영광을 내려놓고 미지의 어둠 속으로 진입하는 용기',
    victoryBlessing: '새로운 차원으로 진입할 수 있는 신성한 출입 통과권'
  },
  {
    hourNumber: 3,
    hourNameAncient: '네베트-세셈 (Nebet-seshem)',
    hourTheme: '오시리스의 성역과 생명의 수로',
    cosmicTrial: '메마른 갈증 속에서 영혼의 참된 영양분을 식별하는 시험',
    victoryBlessing: '영혼의 깊은 상처를 치유하는 천상의 성수와 자양'
  },
  {
    hourNumber: 5,
    hourNameAncient: '세셰메트-카우에스 (Seshemet-kaues)',
    hourTheme: '소카르의 모래 동굴과 깊은 심연',
    cosmicTrial: '빛 하나 들지 않는 험난한 고립 상태를 견뎌내는 인내',
    victoryBlessing: '내면의 가장 깊은 곳에 숨겨진 보물을 발굴하는 혜안'
  },
  {
    hourNumber: 6,
    hourNameAncient: '메세크텟-메스트 (Mesektet-mest)',
    hourTheme: '라-오시리스의 자정 신성 합일',
    cosmicTrial: '죽음과 삶의 경계선에서 자신의 모든 정체성을 온전히 맡김',
    victoryBlessing: '소멸할 수 없는 절대적 우주 생명력의 완벽한 재충전'
  },
  {
    hourNumber: 7,
    hourNameAncient: '헤프투-셰셰무 (Kheftu-sheshemu)',
    hourTheme: '혼돈의 뱀 아포피스 격파와 마아트의 승리',
    cosmicTrial: '의지를 집어삼키려는 유혹, 나태, 거대한 공포와의 결전',
    victoryBlessing: '어떤 마성과 방해도 단칼에 베어내는 라의 태양 불꽃'
  },
  {
    hourNumber: 12,
    hourNameAncient: '헤페르-엔-케프리 (Kheper-en-Khepri)',
    hourTheme: '케프리의 새벽 탄생과 지평선 비상',
    cosmicTrial: '1300보의 신비한 뱀을 거꾸로 통과하는 영적 탈피',
    victoryBlessing: '황금빛 태양으로 완전히 새롭게 거듭나는 궁극의 부활'
  }
];

const SOLAR_GUARDIANS = [
  {
    nameAncient: '케프리 (Khepri)',
    role: '아침의 태양신이자 자생(自生)의 쇠똥구리',
    solarGift: '스스로의 힘으로 절망을 굴려 새로운 태양을 빚어내는 무한한 자기 갱신력'
  },
  {
    nameAncient: '호루스-헤케누 (Horus-Hekenu)',
    role: '태양의 배를 이끄는 찬란한 매의 수호신',
    solarGift: '어둠 속에서도 목적지를 잃지 않는 매의 예리한 시선과 왕권의 권능'
  },
  {
    nameAncient: '이시스 (Isis)',
    role: '위대한 마법과 재생의 어머니 여신',
    solarGift: '아포피스의 마성을 결박하고 상처 입은 생명을 온전히 치유하는 신성 마법'
  },
  {
    nameAncient: '토트 (Thoth)',
    role: '지혜와 마아트(진리)의 기록관',
    solarGift: '어둠의 지하에서도 정확한 우주 법칙을 기록하고 지름길을 안내하는 지성'
  }
];

function getKstAmduatParts(now: Date): { hour: number; month: number } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    hour: 'numeric',
    month: 'numeric',
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  return {
    hour: Number(parts.find((p) => p.type === 'hour')?.value || '12') % 24,
    month: Number(parts.find((p) => p.type === 'month')?.value || '1'),
  };
}

function buildAmduatSituationalAudit(
  question: string,
  hourInfo: (typeof AMDUAT_HOURS)[number],
  guardian: (typeof SOLAR_GUARDIANS)[number]
): AmduatSituationalAudit {
  const q = question.toLowerCase();
  if (/위기|힘들|어렵|불안|실패|고민|막히/.test(q)) {
    return {
      duatGateFocus: `제${hourInfo.hourNumber}시간(${hourInfo.hourTheme}) — 심연 통과와 빛의 보존`,
      apophisResistance: `${guardian.nameAncient}의 가호로 두려움·회의감의 뱀 아포피스 제압`,
      barqueAction: '어둠 전체를 한 번에 걷어내려 하기보다 오늘 건너갈 수 있는 한 관문만 차분히 통과하십시오.',
      abyssCaution: '캄캄한 구간에서 노를 놓아버리고 자책감에 잠기지 마십시오.',
    };
  }
  if (/일|선택|이직|사업|도전|새로|시작/.test(q)) {
    return {
      duatGateFocus: '케프리(Khepri) 새벽 탄생 및 새 주기 출항',
      apophisResistance: '망설임과 완벽주의의 그림자 돌파',
      barqueAction: '낡은 방식의 허물을 벗고 오늘 당장 실행 가능한 작은 첫 항해를 시작하십시오.',
      abyssCaution: '준비만 하다가 지평선 너머로 떠오를 타이밍을 놓치지 마십시오.',
    };
  }
  return {
    duatGateFocus: `${hourInfo.hourTheme} — 라-오시리스 합일 조율`,
    apophisResistance: guardian.solarGift,
    barqueAction: '태양선 메섹테트의 항로처럼 조급함 없이 하루의 순환 리듬을 신뢰하십시오.',
    abyssCaution: '밤의 시간이 길어 보인다고 해가 뜨지 않는 것은 아닙니다.',
  };
}

function buildAmduatTemporalRhythm(now: Date): AmduatTemporalRhythm {
  const { hour, month } = getKstAmduatParts(now);

  let solarBarqueWatch = '새벽 케프리(Khepri) 지평선 비상 창';
  let solarTempo: AmduatTemporalRhythm['solarTempo'] = '새벽부활';
  let voyageGuidance = '새로운 태양처럼 맑은 의도로 오늘의 첫 걸음을 내딛기 좋습니다.';

  if (hour >= 5 && hour < 10) {
    solarBarqueWatch = '여명 케프리(Khepri) 지평선 비상 창 (05~10시)';
    solarTempo = '새벽부활';
    voyageGuidance = '어제의 무거운 기억을 털어내고 새로운 시작에 에너지를 집중하십시오.';
  } else if (hour >= 10 && hour < 17) {
    solarBarqueWatch = '주간 마네제트(Mandjet) 주간 태양선 항해 창 (10~17시)';
    solarTempo = '항해';
    voyageGuidance = '밝은 시야로 핵심 과업과 대외 소통을 힘차게 추진할 시간입니다.';
  } else if (hour >= 17 && hour < 21) {
    solarBarqueWatch = '황혼 메섹테트(Mesektet) 야간선 출항 창 (17~21시)';
    solarTempo = '결전';
    voyageGuidance = '외부 소음을 줄이고 오늘의 성취와 미완료 과제를 차분히 갈무리하십시오.';
  } else {
    solarBarqueWatch = '심야 라-오시리스(Ra-Osiris) 재충전 창 (21~05시)';
    solarTempo = '결전';
    voyageGuidance = '깊은 휴식으로 영혼의 생명력을 재충전하며 새벽 부활을 준비할 시간입니다.';
  }

  let nileSeasonPhase = '아케트(Akhet · 범람과 비옥의 계절)';
  if (month >= 3 && month <= 6) nileSeasonPhase = '페레트(Peret · 발아와 성장의 계절)';
  else if (month >= 7 && month <= 10) nileSeasonPhase = '셰무(Shemu · 수확과 결실의 계절)';
  else nileSeasonPhase = '아케트(Akhet · 정화와 재충전의 계절)';

  return {
    kstHour: hour,
    solarBarqueWatch,
    nileSeasonPhase,
    voyageGuidance,
    solarTempo,
  };
}

export function calculateEgyptianAmduat(
  profile: UserProfile | null | undefined,
  now: Date = new Date(),
  question: string = ''
): EgyptianAmduatReport {
  const birthStr = profile?.basic?.birthdate || '1995-01-01';
  const nameStr = profile?.basic?.name || '내담자';
  const timeStr = profile?.basic?.birthtime || '12:00';

  const seed = djb2Hash(`${birthStr}_${nameStr}_${timeStr}_egyptian_amduat`);

  const khepriRebirthLuminosityScore = 66 + (seed % 33);
  const apophisChaosDispellingForce = 63 + ((seed >> 2) % 36);
  const midnightRaOsirisUnionPower = 65 + ((seed >> 4) % 34);
  const twelveUnderworldGatesMastery = 60 + ((seed >> 6) % 39);
  const mesektetSolarBarqueSteadiness = 62 + ((seed >> 8) % 37);

  const currentAmduatHour = AMDUAT_HOURS[seed % AMDUAT_HOURS.length];
  const solarDeityGuardian = SOLAR_GUARDIANS[(seed >> 3) % SOLAR_GUARDIANS.length];

  let amduatHieroglyphicWisdom = '';
  if (khepriRebirthLuminosityScore >= 85) {
    amduatHieroglyphicWisdom = '케프리(Khepri)의 새벽 날갯짓이 지평선 너머로 찬란한 태양을 밀어 올리고 있습니다. 어두웠던 모든 밤의 시련은 당신의 새로운 탄생을 위한 성스러운 요람이었으니, 이제 황금빛으로 눈부시게 비상하십시오.';
  } else if (apophisChaosDispellingForce >= 80) {
    amduatHieroglyphicWisdom = '혼돈의 뱀 아포피스가 당신의 영혼 앞에서 완전히 힘을 잃고 굴복했습니다. 삶의 공포나 외부의 흔들림에 결코 굴하지 않는 라의 태양 불꽃이 당신의 중심에 견고히 자리 잡았습니다.';
  } else {
    amduatHieroglyphicWisdom = '심야의 라-오시리스 신성 합일을 기억하십시오. 가장 어둡고 고요한 순간에 우주의 생명 에너지가 당신의 깊은 내면에 충전되고 있습니다. 서두르지 말고 태양의 배(Mesektet)의 리듬에 몸을 맡기십시오.';
  }

  const situationalAmduatAudit = buildAmduatSituationalAudit(question, currentAmduatHour, solarDeityGuardian);
  const temporalAmduatRhythm = buildAmduatTemporalRhythm(now);
  const rebirthState: AmduatSynthesisMatrix['rebirthState'] =
    khepriRebirthLuminosityScore >= 85
      ? '케프리비상'
      : midnightRaOsirisUnionPower >= 80
        ? '라오시리스합일'
        : '심연돌파';
  const amduatSynthesisMatrix: AmduatSynthesisMatrix = {
    rebirthState,
    hourGuardianLink: `제${currentAmduatHour.hourNumber}시간 [${currentAmduatHour.hourNameAncient}]과 수호신 ${solarDeityGuardian.nameAncient}이 ${temporalAmduatRhythm.solarBarqueWatch}에서 만납니다.`,
    nextBarqueStep: situationalAmduatAudit.barqueAction,
  };

  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const calculatedAtKst = kst.toISOString().replace('T', ' ').substring(0, 19) + ' +09:00 KST';
  const ritualAction = `${situationalAmduatAudit.barqueAction} · ${temporalAmduatRhythm.voyageGuidance}`;
  const reflectionFocus = question.trim()
    ? `‘${question.trim()}’ 어둠의 관문을 건널 때 [${currentAmduatHour.hourNameAncient}]과 수호신 ${solarDeityGuardian.nameAncient}이 비추는 새벽의 빛은 무엇입니까?`
    : `오늘 밤의 심연 속에서 아포피스의 불안을 잠재우고 케프리처럼 다시 밀어 올릴 나의 한 걸음은 무엇입니까?`;

  return {
    engineVersion: EGYPTIAN_AMDUAT_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    khepriRebirthLuminosityScore,
    apophisChaosDispellingForce,
    midnightRaOsirisUnionPower,
    twelveUnderworldGatesMastery,
    mesektetSolarBarqueSteadiness,
    currentAmduatHour,
    solarDeityGuardian,
    situationalAmduatAudit,
    temporalAmduatRhythm,
    amduatSynthesisMatrix,
    amduatHieroglyphicWisdom,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion: reflectionFocus,
    interpretiveBoundary: '암두아트의 서 밤의 항해와 케프리 부활 상징을 빌린 정성적 순환 성찰 관점이며, 수치 등급이나 미래 단정이 아닙니다.',
  };
}

export function formatEgyptianAmduatPrompt(report: EgyptianAmduatReport): string {
  const khepriGrade = report.khepriRebirthLuminosityScore >= 85 ? '찬란함' : report.khepriRebirthLuminosityScore >= 72 ? '안정' : '응축중';
  const apophisGrade = report.apophisChaosDispellingForce >= 82 ? '강건함' : '수호중';
  return `### 고대 이집트 《암두아트의 서》 12시간 태양신 라의 밤의 저승 항해 & 케프리 부활 엔진 (v${report.engineVersion})
- **기준 시각**: ${report.calculatedAtKst}
- **현재 통과 시간대**: 제${report.currentAmduatHour.hourNumber}시간 [${report.currentAmduatHour.hourNameAncient}] - ${report.currentAmduatHour.hourTheme}
  - *영적 시험*: ${report.currentAmduatHour.cosmicTrial}
  - *승리의 축복*: ${report.currentAmduatHour.victoryBlessing}
- **태양 수호신**: ${report.solarDeityGuardian.nameAncient} (${report.solarDeityGuardian.role})
  - *신성 선물*: ${report.solarDeityGuardian.solarGift}
- **암두아트 정성 위상**: 부활 국면(${report.amduatSynthesisMatrix.rebirthState}) · 케프리 광채(${khepriGrade}) · 아포피스 방어(${apophisGrade})
- **질문 맥락 감사**: ${report.situationalAmduatAudit.duatGateFocus} · 방어(${report.situationalAmduatAudit.apophisResistance})
  - *항해 처방*: ${report.situationalAmduatAudit.barqueAction}
  - *심연 경계*: ${report.situationalAmduatAudit.abyssCaution}
- **KST 시공간 리듬 (${report.temporalAmduatRhythm.kstHour}시)**: ${report.temporalAmduatRhythm.solarBarqueWatch} · ${report.temporalAmduatRhythm.nileSeasonPhase} (${report.temporalAmduatRhythm.solarTempo})
  - *시간대 지침*: ${report.temporalAmduatRhythm.voyageGuidance}
- **교차 매트릭스**: ${report.amduatSynthesisMatrix.hourGuardianLink}
- **암두아트 상형문자 지혜 잠언**:
  - "${report.amduatHieroglyphicWisdom}"
- **질문 맞춤 성찰 질문**: ${report.reflectiveQuestion}
- **해석 경계**: 암두아트의 서 밤의 항해와 케프리 부활 상징을 빌린 정성적 순환 성찰 관점이며, 수치 등급이나 미래 단정이 아닙니다.`;
}

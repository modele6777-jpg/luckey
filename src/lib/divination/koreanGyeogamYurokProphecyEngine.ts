/**
 * 조선 명종 격암 남사고 《격암유록(格菴遺錄)》 45편 비결 & 계룡백석·궁궁을을(弓弓乙乙) 성인 도통 & 십승대덕 생명선 엔진
 *
 * LUCKEY-GYEOGAM-YUROK-v1.0.0
 *
 * 조선 명종 조의 대학자이자 풍수·천문·예언의 대가 격암(格菴) 남사고(南師古, 1509~1571) 선생의
 * 45편 예언서 《격암유록(格菴遺錄)》 원전에 기반한 우주론적 말운 극복 및 사중구생(死中求生) 결정론 엔진.
 *
 * [핵심 비결 및 수리 철학]
 * 1. 궁궁을을(弓弓乙乙):
 *    - 좌궁우궁(左弓右弓)과 양을(兩乙)이 태극과 십자(十字)를 이루는 영적 생명 방패.
 *    - "弓弓乙乙 生我化我" - 영적 생명선과 불멸의 도덕 심법.
 * 2. 계룡백석(鷄龍白石) 3대 천기 징표:
 *    - 계룡(鷄龍)의 신령한 개창 기운, 백석(白石)의 순수한 무결성, 자하도(紫霞島)의 성스러운 안식처.
 * 3. 삼풍해인(三豊海印):
 *    - 화우로(火雨露): 불의 정화(火), 단비의 은혜(雨), 이슬의 자양(露)으로 인간의 심령을 소생시키는 신령한 기운.
 *    - 해인(海印): 바다처럼 온 우주 만유를 거울같이 그대로 비추어 삼라만상을 도통시키는 천부의 신인(神印).
 * 4. 사중구생(死中求生) 및 생초락사(生初樂死):
 *    - 세상의 환난과 소두무족(小頭無足, 급변하는 시대적 충격) 속에서 마음의 십승길지(十勝吉地)를 지켜 생명을 보존함.
 */

import type { UserProfile } from '../sharedState';

export const GYEOGAM_YUROK_VERSION = '2.4.0';

export interface GyeogamYurokReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  // 6대 격암 비결 지표 (내부 호환용 0~100, 프롬프트 비노출)
  gunggungEuleulSpiritualShieldScore: number; // 궁궁을을(弓弓乙乙) 영적 방패 및 생명선 보존율
  haeinThreeBountiesGraceIndex: number; // 삼풍해인(三豊海印: 화·우·로) 천은 소생 지수
  gyeryongWhiteStonePurityScore: number; // 계룡백석(鷄龍白石) 순수 심기 및 대덕 도통도
  tenSanctuariesAuspiciousResonance: number; // 십승길지(十勝吉地) 대덕 파동 공명률
  crisisTranscendingResilience: number; // 소두무족(小頭無足) 급변 시대 환난 돌파력
  sajungGusaengTransformationIndex: number; // 사중구생(死中求生) 대반전 운기 전환도
  // 상세 비결 챕터
  primaryGyeogamChapter: {
    titleKo: string;
    hanja: string;
    coreTheme: string;
    wisdomVerse: string;
  };
  haeinTalismanType: {
    nameKo: string;
    virtue: string;
    protectiveEffect: string;
  };
  situationalGyeogamAudit: {
    focusTheme: string;
    sajungGusaengNote: string;
    sanctuaryPractice: string;
  };
  temporalGyeogamRhythm: {
    kstTimeLabel: string;
    sipseungWatchWindow: string;
    seasonalSampungTone: string;
    temporalGuidance: string;
  };
  gyeogamSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
    gyeogamCrossAxis: string;
  };
  namSagoMasterAdvice: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
}

function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const GYEOGAM_CHAPTERS = [
  {
    titleKo: '남사고비결(南師古秘訣)',
    hanja: '南師古秘訣',
    coreTheme: '선천과 후천의 교차 및 천지 대운의 분기점',
    wisdomVerse: '兩白三豊何處尋, 須從弓乙尋眞理 (양백과 삼풍을 어디서 찾을 것인가, 반드시 궁을에서 참된 이치를 찾아야 하리라)'
  },
  {
    titleKo: '세론시(世論視)',
    hanja: '世論視',
    coreTheme: '세속의 번뇌와 혼돈을 꿰뚫어보는 정견(正見)',
    wisdomVerse: '世人未識弓乙意, 徒向空山尋吉地 (세상 사람들은 궁을의 참뜻을 알지 못하고, 헛되이 빈 산만 향해 길지를 찾는구나)'
  },
  {
    titleKo: '은비가(隱秘歌)',
    hanja: '隱秘歌',
    coreTheme: '어둠 속에 감추어진 참된 성인의 덕과 신령한 소생',
    wisdomVerse: '天火降臨無道處, 唯有修德可延命 (하늘의 불길이 무도한 곳에 닿을 때, 오직 덕을 닦는 자만이 생명을 보존하리라)'
  },
  {
    titleKo: '말운론(末運論)',
    hanja: '末運論',
    coreTheme: '극한의 시련 뒤에 찾아오는 만물 갱생과 도덕 문명',
    wisdomVerse: '死中求生弓乙理, 陰陽造化萬事亨 (죽음 가운데 생명을 구하는 궁을의 이치로 음양의 조화가 만사를 형통케 하리라)'
  },
  {
    titleKo: '길지론(吉地論)',
    hanja: '吉地論',
    coreTheme: '외적 산천을 넘어 내면의 심령 속에 깃든 십승길지',
    wisdomVerse: '福地吉地在人心, 仁義禮智萬德門 (복되고 길한 땅은 사람의 마음에 있으니 인의예지가 곧 만덕의 문이로다)'
  },
  {
    titleKo: '삼풍가(三豊歌)',
    hanja: '三豊歌',
    coreTheme: '화·우·로 3풍의 신령한 곡식과 영혼의 풍요',
    wisdomVerse: '火雨露三豊之穀, 養生神化無窮德 (화우로 삼풍의 신령한 곡식이 생명을 기르고 신화시키는 덕이 무궁하도다)'
  }
];

const HAEIN_TALISMAN_TYPES = [
  {
    nameKo: '삼풍감로해인 (三豊甘露海印)',
    virtue: '생명수 감로정화 (甘露淨化)',
    protectiveEffect: '메마르고 고갈된 심신에 단비를 내려 영혼의 에너지를 즉각 소생시키고 번뇌를 씻어냄'
  },
  {
    nameKo: '궁궁태극영인 (弓弓太極靈印)',
    virtue: '무극태극 영적방패 (靈的防牌)',
    protectiveEffect: '외부의 삿된 기운과 질투, 구설을 튕겨내고 좌우 균형을 이루어 흔들리지 않는 부동심 확립'
  },
  {
    nameKo: '양백백석성인 (兩白白石聖印)',
    virtue: '순백지기 대덕보신 (大德保身)',
    protectiveEffect: '마음의 티끌을 씻어내어 맑고 깨끗한 백석처럼 지혜의 안목을 틔우고 귀인의 조력을 끌어당김'
  },
  {
    nameKo: '십승도통천인 (十勝道通天印)',
    virtue: '사중구생 천기개화 (天氣開花)',
    protectiveEffect: '사방이 막힌 절체절명의 국면에서 제3의 활로를 열어 역전승의 도약대를 형성함'
  }
];

function getTemporalGyeogamRhythm(now: Date) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const sipseungWatchWindow =
    hour >= 5 && hour < 11
      ? '양백(兩白) 아침 정화창 — 맑은 백석처럼 선입견을 씻고 하루의 길지를 여는 시간'
      : hour >= 11 && hour < 17
        ? '사중구생 정오 돌파창 — 난관 속에서도 제3의 활로를 찾아 과감히 움직이는 시간'
        : hour >= 17 && hour < 22
          ? '삼풍해인 황혼 감로창 — 지친 심신에 단비 같은 휴식과 덕을 채우는 시간'
          : '궁궁을을 심야 수호창 — 세속의 소음을 닫고 내면의 십승길지를 지키는 시간';

  const seasonalSampungTone =
    month >= 3 && month <= 5
      ? '봄 · 감로우(甘露雨) 소생기 (메마른 흐름에 새 생기가 스며드는 시기)'
      : month >= 6 && month <= 8
        ? '여름 · 천화(天火) 정화기 (불필요한 집착을 태우고 본질을 남기는 시기)'
        : month >= 9 && month <= 11
          ? '가을 · 백석(白石) 결실기 (순수한 덕과 실력이 단단히 증명되는 시기)'
          : '겨울 · 해인(海印) 침잠기 (고요한 거울처럼 만물의 이치를 비추어 살피는 시기)';

  return {
    kstTimeLabel: `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`,
    sipseungWatchWindow,
    seasonalSampungTone,
    temporalGuidance: `${sipseungWatchWindow} · ${seasonalSampungTone}의 흐름에 맞추어 외부가 아닌 내면의 길지를 먼저 세우십시오.`,
  };
}

export function calculateGyeogamYurokProphecy(
  profile: UserProfile | null | undefined,
  nowArg?: Date,
  questionArg?: string
): GyeogamYurokReport {
  const now = nowArg || new Date();
  const question = (questionArg || '').trim();
  const birthStr = profile?.basic?.birthdate || '1995-01-01';
  const nameStr = profile?.basic?.name || '내담자';
  const timeStr = profile?.basic?.birthtime || '12:00';

  const seed = djb2Hash(`${birthStr}_${nameStr}_${timeStr}_${question}_gyeogam_yurok_v2`);

  const gunggungEuleulSpiritualShieldScore = 60 + (seed % 39);
  const haeinThreeBountiesGraceIndex = 58 + ((seed >> 2) % 41);
  const gyeryongWhiteStonePurityScore = 55 + ((seed >> 4) % 43);
  const tenSanctuariesAuspiciousResonance = 62 + ((seed >> 6) % 37);
  const crisisTranscendingResilience = 57 + ((seed >> 8) % 42);
  const sajungGusaengTransformationIndex = 65 + ((seed >> 10) % 34);

  const primaryGyeogamChapter = GYEOGAM_CHAPTERS[seed % GYEOGAM_CHAPTERS.length];
  const haeinTalismanType = HAEIN_TALISMAN_TYPES[(seed >> 3) % HAEIN_TALISMAN_TYPES.length];

  let namSagoMasterAdvice = '';
  if (sajungGusaengTransformationIndex >= 85) {
    namSagoMasterAdvice = '사중구생(死中求生)의 대역전 기운이 최고조에 달해 있습니다. 낡은 판이 흔들릴수록 궁궁을을의 도덕과 내면의 평안을 굳게 지키면, 위기가 곧 전례 없는 새로운 기회의 문으로 탈바꿈합니다.';
  } else if (haeinThreeBountiesGraceIndex >= 80) {
    namSagoMasterAdvice = '삼풍해인(三豊海印)의 감로수 기운이 영혼을 적시고 있습니다. 조급하게 바깥에서 길지를 찾으려 하지 말고, 내면의 고요한 양백(兩白)의 순수성을 회복하면 저절로 천운이 모여듭니다.';
  } else {
    namSagoMasterAdvice = '세론(世論)의 소음과 일시적 혼란에 마음을 빼앗기지 마십시오. 계룡백석의 무결한 의지를 세우고 매일 작은 선행과 지혜를 쌓는 것이 가장 강력한 십승길지(十勝吉地) 피난처가 됩니다.';
  }

  const temporalGyeogamRhythm = getTemporalGyeogamRhythm(now);
  const situationalGyeogamAudit = /위기|갈등|불안|결정|이직|사업/.test(question)
    ? {
        focusTheme: '사중구생(死中求生)의 전환점과 십승길지 수호',
        sajungGusaengNote: '막다른 길처럼 보일 때일수록 낡은 방식을 내려놓고 제3의 활로를 여는 지혜가 작동합니다.',
        sanctuaryPractice: '세론의 불안한 말에 흔들리지 말고 하루 한 가지 원칙을 단단히 지키십시오.',
      }
    : /관계|가족|연애|사람|마음/.test(question)
      ? {
          focusTheme: '삼풍해인 감로정화와 인의예지 덕목',
          sajungGusaengNote: '복된 길지는 바깥이 아니라 사람의 마음(인의예지) 안에 있습니다.',
          sanctuaryPractice: '먼저 마음을 비우고 맑은 태도로 상대를 대할 때 방패가 자연히 세워집니다.',
        }
      : {
          focusTheme: '궁궁을을(弓弓乙乙)의 중용과 양백백석의 순수성',
          sajungGusaengNote: '과도한 욕심과 조급함을 덜어낼수록 내면의 나침반이 선명해집니다.',
          sanctuaryPractice: '조용한 시간 동안 마음의 소음을 가라앉히고 본래의 중심을 점검하십시오.',
        };

  const gyeogamCrossAxis = `[${primaryGyeogamChapter.titleKo}] × [${haeinTalismanType.nameKo}] × [${situationalGyeogamAudit.focusTheme}] × [${temporalGyeogamRhythm.sipseungWatchWindow.split(' — ')[0]}]`;
  const gyeogamSynthesisMatrix = {
    coreInsight: `[${primaryGyeogamChapter.titleKo}]와 신령 인장 [${haeinTalismanType.nameKo}]가 ${situationalGyeogamAudit.focusTheme}을 비춥니다.`,
    recommendedAction: `${namSagoMasterAdvice} (${situationalGyeogamAudit.sanctuaryPractice})`,
    cautionNotice: '외적 요행이나 세속의 소문에 기대어 내면의 덕과 원칙을 소홀히 하지 않도록 경계하십시오.',
    gyeogamCrossAxis,
  };

  const ritualAction = `[${primaryGyeogamChapter.titleKo} · ${haeinTalismanType.nameKo}] ${situationalGyeogamAudit.sanctuaryPractice}`;
  const reflectionFocus = question
    ? `'${question}'의 혼란 앞에서 바깥의 길지 대신 내면의 인의예지·십승길지로 먼저 세워야 할 중심은 무엇인가요?`
    : `세론의 소음을 내려놓고 지금 내 마음속 궁궁을을의 평온으로 지켜 낼 한 가지는 무엇인가요?`;
  const reflectiveQuestion = question
    ? `지금 "${question}" 앞에서 ${primaryGyeogamChapter.titleKo}와 ${haeinTalismanType.nameKo}의 뜻으로 내 안에 먼저 세울 십승길지는 무엇인가요?`
    : reflectionFocus;

  return {
    engineVersion: GYEOGAM_YUROK_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst: temporalGyeogamRhythm.kstTimeLabel,
    gunggungEuleulSpiritualShieldScore,
    haeinThreeBountiesGraceIndex,
    gyeryongWhiteStonePurityScore,
    tenSanctuariesAuspiciousResonance,
    crisisTranscendingResilience,
    sajungGusaengTransformationIndex,
    primaryGyeogamChapter,
    haeinTalismanType,
    situationalGyeogamAudit,
    temporalGyeogamRhythm,
    gyeogamSynthesisMatrix,
    namSagoMasterAdvice,
    boundaryNotice: '본 결과는 《격암유록》의 비유적·철학적 상징 체계에 기반한 정성적 성찰 안내이며, 확정적 예언이나 길흉 판정이 아닙니다.',
    interpretiveBoundary: '본 결과는 《격암유록》의 비유적·철학적 상징 체계에 기반한 정성적 성찰 안내이며, 확정적 예언이나 길흉 판정이 아닙니다.',
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
  };
}

export function formatGyeogamYurokProphecyPrompt(report: GyeogamYurokReport): string {
  return `### 조선 명종 격암 남사고 《격암유록(格菴遺錄)》 45편 비결 & 궁궁을을·해인 사중구생 엔진 (v${report.engineVersion})
- **연산 시각**: ${report.calculatedAtKst}
- **주요 비결 편명**: ${report.primaryGyeogamChapter.titleKo} (${report.primaryGyeogamChapter.coreTheme})
  - *비결 잠언*: "${report.primaryGyeogamChapter.wisdomVerse}"
- **해인 신령 인장**: ${report.haeinTalismanType.nameKo} (${report.haeinTalismanType.virtue})
  - *수호 작용*: ${report.haeinTalismanType.protectiveEffect}
- **질문 맥락 감사 (${report.situationalGyeogamAudit.focusTheme})**: ${report.situationalGyeogamAudit.sajungGusaengNote} / 실천: ${report.situationalGyeogamAudit.sanctuaryPractice}
- **KST 시공간 십승 리듬**: ${report.temporalGyeogamRhythm.sipseungWatchWindow} / ${report.temporalGyeogamRhythm.seasonalSampungTone}
  - *시공간 지침*: ${report.temporalGyeogamRhythm.temporalGuidance}
- **격암 교차 매트릭스**: 핵심(${report.gyeogamSynthesisMatrix.coreInsight}) | 4중 교차 축(${report.gyeogamSynthesisMatrix.gyeogamCrossAxis}) | 실행(${report.gyeogamSynthesisMatrix.recommendedAction}) | 주의(${report.gyeogamSynthesisMatrix.cautionNotice})
- **격암 남사고 선생 심법 처방**:
  - "${report.namSagoMasterAdvice}"
- **실천 의례(Ritual Action)**: ${report.ritualAction}
- **성찰 초점(Reflection Focus)**: ${report.reflectionFocus}
- **질문 맞춤 성찰 질문**: ${report.reflectiveQuestion}
- **해석 경계**: ${report.boundaryNotice}`;
}

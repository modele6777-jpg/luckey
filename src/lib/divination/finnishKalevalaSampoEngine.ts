/**
 * =========================================================================
 * LUCKEY 고대 핀란드 칼레발라(Kalevala) 신비 서사시 & 삼포(Sampo) 9대 룬가 엔진
 * (Finnish Kalevala Mystic Epic & Sampo Prosperity 9 Runolaulu Engine)
 * =========================================================================
 * 
 * [학술적·전통적 배경]
 * 핀란드·카렐리야의 우랄-피노우그릭 정통 샤머니즘 구전 서사시 칼레발라(Kalevala)와
 * 무한한 번영을 갈아내는 신화적 맷돌 삼포(Sampo), 지혜의 가객 바이내뫼이넨(Väinämöinen)의 룬가 원전.
 * 
 * 1. 삼포(Sampo)의 3대 번영 날개(Flour, Salt, Gold):
 *    - 곡물의 날개 (Jauhomylly) - 일상의 풍요, 생계의 안정과 풍성한 식탁
 *    - 소금의 날개 (Suolamylly) - 생명의 보존, 지혜와 치유, 불순물의 정화
 *    - 황금의 날개 (Kultamylly) - 명예와 부, 위대한 창조적 성취와 번영
 * 2. 칼레발라 9대 신성 룬가(Runolaulu):
 *    - 만물의 기원을 노래하여 현실을 변혁하는 원초적 언어의 힘.
 * 3. 핀란드 영혼의 핵 '시수(Sisu)' 회복탄력성 지수:
 *    - 극한의 북유럽 설한풍 속에서도 꺾이지 않는 불굴의 내면 의지와 끈기.
 * 4. 타피오(Tapio, 숲의 신) & 벨라모(Vellamo, 바다의 여신)의 대자연 정령 가호:
 *    - 북극림(Taiga)과 맑은 호수의 정령들이 건네는 현실 보호막.
 */

import type { UserProfile } from '../sharedState';

export const FINNISH_KALEVALA_SAMPO_ENGINE_VERSION = '2.1.0';

export interface SampoSituationalAudit {
  sampoAxis: string;
  sisuLeverage: string;
  artisanAction: string;
  frostCaution: string;
}

export interface SampoTemporalRhythm {
  kstHour: number;
  nordicSunWindow: string;
  taigaSeasonPhase: string;
  forgeTimingGuidance: string;
  sisuTempo: '단조' | '항해' | '안식';
}

export interface SampoSynthesisMatrix {
  sisuGrade: '강철시수' | '견고지속' | '온기보존';
  wingRunoLink: string;
  nextSampoStep: string;
}

export interface SampoWingsBalance {
  flourScore: number; // 곡물 (안정과 생계) 0~100
  saltScore: number; // 소금 (보존과 지혜) 0~100
  goldScore: number; // 황금 (성취와 번영) 0~100
  dominantWing: '곡물의 날개 (Jauho · 안정)' | '소금의 날개 (Suola · 지혜)' | '황금의 날개 (Kulta · 번영)';
  dominantGift: string;
}

export interface KalevalaRuno {
  runoNumber: number;
  runoTitle: string;
  mythicOrigin: string;
  loitsuChant: string; // 로이추(치유·창조의 마법 노래)
}

export interface FinnishKalevalaSampoReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  sisuResilienceIndex: number; // 내부 연산용
  sampoBalance: SampoWingsBalance;
  activeRuno: KalevalaRuno;
  situationalSampoAudit: SampoSituationalAudit;
  temporalSampoRhythm: SampoTemporalRhythm;
  sampoSynthesisMatrix: SampoSynthesisMatrix;
  guardianNatureSpirit: string; // 대자연 수호신
  forestHealingPractice: string; // 숲의 힐링 처방
  kalevalaWisdom: string;
}

const KALEVALA_RUNOS: KalevalaRuno[] = [
  {
    runoNumber: 1,
    runoTitle: '만물과 노래의 창조 룬 (Luominen)',
    mythicOrigin: '원초의 물새가 낳은 황금 알에서 천지와 해와 달이 솟아난 태초의 기원',
    loitsuChant: '알 껍질이 하늘이 되고 노른자가 해가 되듯, 혼돈 속에서 찬란한 질서가 피어납니다.'
  },
  {
    runoNumber: 2,
    runoTitle: '신성한 불의 탄생 룬 (Tulen Synty)',
    mythicOrigin: '번개 신 우코(Ukko)의 손에서 떨어진 불씨가 칠흑 같은 어둠을 녹인 기적',
    loitsuChant: '차가운 대지를 녹이는 신성한 불꽃으로 웅크린 마음에 열정과 결단의 불을 당깁니다.'
  },
  {
    runoNumber: 3,
    runoTitle: '철의 기원과 연마 룬 (Raudan Synty)',
    mythicOrigin: '늪지대 붉은 진흙에서 캐내어 대장장이 일마리넨의 풀무질로 벼려낸 강철의 의지',
    loitsuChant: '거친 시련의 불길을 거친 뒤에야 비로소 부러지지 않는 무구한 강철이 완성됩니다.'
  },
  {
    runoNumber: 4,
    runoTitle: '칸텔레 현악기의 지혜 룬 (Kantele)',
    mythicOrigin: '거대한 파이크 물고기의 턱뼈와 처녀의 머리칼로 엮어 숲의 맹수마저 눈물짓게 한 선율',
    loitsuChant: '마음의 줄을 바르게 조율할 때, 온 세상이 고요히 당신의 목소리에 감응합니다.'
  },
  {
    runoNumber: 5,
    runoTitle: '황금 맷돌 삼포 주조 룬 (Sammon Taonta)',
    mythicOrigin: '백조의 깃털, 어린 양의 양모, 한 톨의 보리로 하룻밤 사이에 주조한 기적의 맷돌',
    loitsuChant: '지혜와 성실의 손길이 맞닿을 때, 영원히 마르지 않는 번영의 샘이 샘솟습니다.'
  },
  {
    runoNumber: 6,
    runoTitle: '신성한 숲 타피올라의 보호 룬 (Tapion Koti)',
    mythicOrigin: '침엽수림 깊은 곳에서 방랑자를 감싸 안아 지키는 숲의 왕 타피오의 푸른 망토',
    loitsuChant: '솔향기 짙은 숲의 품에 안겨 세상의 모든 번잡함과 피로를 씻어냅니다.'
  },
  {
    runoNumber: 7,
    runoTitle: '맑은 호수 벨라모의 정화 룬 (Vellamon Vesi)',
    mythicOrigin: '거울 같은 푸른 호수 아래에서 모든 상처를 부드럽게 어루만지는 물의 치유',
    loitsuChant: '티 없이 맑은 호숫물에 마음을 비추어 묵은 감정의 찌꺼기를 말끔히 흘려보냅니다.'
  },
  {
    runoNumber: 8,
    runoTitle: '불굴의 곰 오트소(Otso)의 기운 룬 (Karhun Synty)',
    mythicOrigin: '북두칠성 별자리에서 지상으로 내려온 숲의 어른 곰의 신성한 존엄과 힘',
    loitsuChant: '두려움 없이 자신의 자리를 지키는 당당한 기백으로 삶의 주권을 선포합니다.'
  },
  {
    runoNumber: 9,
    runoTitle: '태양과 달의 귀환 룬 (Päivän Päästö)',
    mythicOrigin: '포흐욜라의 어두운 바위틈에 갇혔던 해와 달을 지혜의 노래로 다시 풀어낸 광명',
    loitsuChant: '가장 짙은 어둠을 뚫고 마침내 약속된 빛이 온 세상을 환하게 비춥니다.'
  }
];

const NATURE_SPIRITS = [
  '타피오 (Tapio - 끝없는 타이가 숲의 수호자이자 은빛 이끼의 왕)',
  '벨라모 (Vellamo - 천 개의 푸른 호수와 생명의 물을 다스리는 여신)',
  '일마타르 (Ilmatar - 태초의 허공과 바람을 품어 세상을 잉태한 대기의 여신)',
  '일마리넨 (Ilmarinen - 하늘 덮개를 두드려 펴고 삼포를 빚어낸 영원한 창조의 장인)'
];

/**
 * 칼레발라 삼포 번영 및 시수(Sisu) 지수를 결정론적으로 연산합니다.
 */
function getKstKalevalaParts(now: Date): { hour: number; month: number } {
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

function buildSampoSituationalAudit(
  question: string,
  dominantWing: { name: SampoWingsBalance['dominantWing']; gift: string },
  runo: KalevalaRuno
): SampoSituationalAudit {
  const q = question.toLowerCase();
  if (/돈|재물|사업|일|직장|생계|성취|프로젝트/.test(q)) {
    return {
      sampoAxis: `삼포 [${dominantWing.name}] 가동 — 실물과 성취의 맷돌`,
      sisuLeverage: `${dominantWing.gift} · 제${runo.runoNumber}장(${runo.runoTitle})`,
      artisanAction: '일마리넨의 대장간처럼 오늘 결과로 남길 작은 실무 산출물 하나를 끝까지 벼려내십시오.',
      frostCaution: '한 번에 큰 황금을 기대하며 기초의 곡물·소금 기반을 소홀히 하지 마십시오.',
    };
  }
  if (/힘들|지치|버티|어렵|고민|관계|불안/.test(q)) {
    return {
      sampoAxis: `시수(Sisu) 내면 온기 보존 — ${runo.runoTitle}`,
      sisuLeverage: runo.loitsuChant,
      artisanAction: '차가운 외부 상황을 단숨에 바꾸려 하기보다, 내 안의 작은 화롯불과 일상 루틴부터 지키십시오.',
      frostCaution: '고립된 채 혼자 모든 추위를 버티려 하지 말고 숲과 사람의 온기를 빌리십시오.',
    };
  }
  return {
    sampoAxis: `${dominantWing.name} · ${runo.runoTitle}`,
    sisuLeverage: dominantWing.gift,
    artisanAction: '작은 일상 도구나 공간을 정갈히 다듬으며 장인의 리듬을 회복하십시오.',
    frostCaution: '조급함으로 맷돌의 균형을 무너뜨리지 마십시오.',
  };
}

function buildSampoTemporalRhythm(now: Date): SampoTemporalRhythm {
  const { hour, month } = getKstKalevalaParts(now);

  let nordicSunWindow = '새벽 일마타르(Ilmatar) 청명 창';
  let sisuTempo: SampoTemporalRhythm['sisuTempo'] = '단조';
  let forgeTimingGuidance = '맑은 호흡으로 오늘 지켜낼 핵심 원칙을 세우기 좋은 시간입니다.';

  if (hour >= 5 && hour < 10) {
    nordicSunWindow = '여명 칼레발라 칸텔레 조율 창 (05~10시)';
    sisuTempo = '단조';
    forgeTimingGuidance = '하루의 줄을 바르게 고르고 핵심 일의 시동을 걸기 알맞은 시간입니다.';
  } else if (hour >= 10 && hour < 17) {
    nordicSunWindow = '주간 일마리넨 삼포 주조 창 (10~17시)';
    sisuTempo = '항해';
    forgeTimingGuidance = '꾸준한 실행력과 묵직한 시수(Sisu) 의지로 과업을 진척시킬 시간입니다.';
  } else if (hour >= 17 && hour < 21) {
    nordicSunWindow = '황혼 타피올라 숲의 귀환 창 (17~21시)';
    sisuTempo = '안식';
    forgeTimingGuidance = '긴장을 풀고 따뜻한 차와 온기로 심신의 피로를 씻어내십시오.';
  } else {
    nordicSunWindow = '심야 벨라모 호수 정화 창 (21~05시)';
    sisuTempo = '안식';
    forgeTimingGuidance = '고요한 밤의 호수처럼 생각을 비우고 내일을 위한 기력을 회복하십시오.';
  }

  let taigaSeasonPhase = '타이가 순환절';
  if (month >= 3 && month <= 5) taigaSeasonPhase = '해빙과 새싹 · 파종 준비절';
  else if (month >= 6 && month <= 8) taigaSeasonPhase = '백야와 생장 · 삼포 가동절';
  else if (month >= 9 && month <= 11) taigaSeasonPhase = '수확과 저장 · 소금 보존절';
  else taigaSeasonPhase = '설한과 시수(Sisu) 내면 연단절';

  return {
    kstHour: hour,
    nordicSunWindow,
    taigaSeasonPhase,
    forgeTimingGuidance,
    sisuTempo,
  };
}

export function calculateFinnishKalevalaSampo(options?: {
  profile?: UserProfile;
  targetInstantTime?: string;
  question?: string;
}): FinnishKalevalaSampoReport {
  const profile = options?.profile;
  const now = options?.targetInstantTime ? new Date(options.targetInstantTime) : new Date();

  let seed = 1849; // 엘리아스 뢴로트 칼레발라 완결판 출간 연도

  if (profile?.basic?.birthdate) {
    const parts = profile.basic.birthdate.split('-').map(Number);
    seed += (parts[0] || 1990) * 23 + (parts[1] || 1) * 41 + (parts[2] || 1) * 17;
  } else {
    seed += now.getFullYear() * 19 + (now.getMonth() + 1) * 37 + now.getDate() * 29;
  }

  if (profile?.basic?.birthtime) {
    const [h, m] = profile.basic.birthtime.split(':').map(Number);
    seed += (h || 0) * 29 + (m || 0) * 11;
  }

  // 1. 시수(Sisu) 회복탄력성 지수 (60 ~ 99점 범위)
  const sisuResilienceIndex = 60 + (seed % 40);

  // 2. 삼포 3대 날개 점수 산출
  const flourScore = 45 + ((seed * 7 + 17) % 52);
  const saltScore = 45 + ((seed * 13 + 31) % 52);
  const goldScore = 45 + ((seed * 19 + 47) % 52);

  const wings = [
    { name: '곡물의 날개 (Jauho · 안정)' as const, score: flourScore, gift: '매일의 먹거리와 실물 기반의 든든한 일상 안정성' },
    { name: '소금의 날개 (Suola · 지혜)' as const, score: saltScore, gift: '관계와 자산을 지키는 깊은 지혜와 치유의 보존력' },
    { name: '황금의 날개 (Kulta · 번영)' as const, score: goldScore, gift: '노력의 결실을 큰 자산과 명예로 전환하는 위대한 도약' }
  ];
  wings.sort((a, b) => b.score - a.score);
  const dominantWing = wings[0];

  const sampoBalance: SampoWingsBalance = {
    flourScore,
    saltScore,
    goldScore,
    dominantWing: dominantWing.name,
    dominantGift: dominantWing.gift
  };

  // 3. 9대 룬가 중 활성 룬 선정
  const runoIdx = seed % KALEVALA_RUNOS.length;
  const activeRuno = KALEVALA_RUNOS[runoIdx];

  // 4. 대자연 수호신
  const spiritIdx = (seed + 1) % NATURE_SPIRITS.length;
  const guardianNatureSpirit = NATURE_SPIRITS[spiritIdx];

  // 5. 숲의 치유 실천
  const forestPractices = [
    '따뜻한 차 한 잔을 손에 쥐고 창밖의 나무나 식물을 5분간 바라보며 침묵하기',
    '사우나나 따뜻한 온수 샤워를 통해 북유럽식 땀 배출과 노폐물·잡념의 배출 의식',
    '주변의 작은 일상 물건 하나를 정성껏 닦거나 손질하여 장인의 정갈함 회복하기',
    '내가 가진 가장 단단한 강점 세 가지를 소리 내어 확인하는 시수(Sisu) 선언'
  ];
  const forestHealingPractice = forestPractices[seed % forestPractices.length];

  const kalevalaWisdom = `불굴의 시수(Sisu) 정신과 삼포의 [${dominantWing.name}]이 공명하고 있습니다. ${activeRuno.loitsuChant}`;
  const situationalSampoAudit = buildSampoSituationalAudit(options?.question || '', dominantWing, activeRuno);
  const temporalSampoRhythm = buildSampoTemporalRhythm(now);
  const sisuGrade: SampoSynthesisMatrix['sisuGrade'] =
    sisuResilienceIndex >= 85 ? '강철시수' : sisuResilienceIndex >= 72 ? '견고지속' : '온기보존';
  const sampoSynthesisMatrix: SampoSynthesisMatrix = {
    sisuGrade,
    wingRunoLink: `[${dominantWing.name}]과 제${activeRuno.runoNumber}장 [${activeRuno.runoTitle}]이 ${temporalSampoRhythm.nordicSunWindow}에서 맞물립니다.`,
    nextSampoStep: situationalSampoAudit.artisanAction,
  };

  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const calculatedAtKst = kst.toISOString().replace('T', ' ').substring(0, 19) + ' +09:00 KST';

  return {
    engineVersion: FINNISH_KALEVALA_SAMPO_ENGINE_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    sisuResilienceIndex,
    sampoBalance,
    activeRuno,
    situationalSampoAudit,
    temporalSampoRhythm,
    sampoSynthesisMatrix,
    guardianNatureSpirit,
    forestHealingPractice,
    kalevalaWisdom
  };
}

/**
 * 프롬프트 포맷터
 */
export function formatFinnishKalevalaSampoPrompt(report: FinnishKalevalaSampoReport): string {
  const sb = report.sampoBalance;
  const r = report.activeRuno;
  const wingGrade = (s: number) => (s >= 80 ? '풍성' : s >= 62 ? '안정' : '배양중');

  return `[🌾 고대 핀란드 칼레발라(Kalevala) 삼포(Sampo) & 9대 룬가 상징 관점 (v${report.engineVersion})]
- 기준 시각: ${report.calculatedAtKst}
- 시수(Sisu) 회복탄력 위상: ${report.sampoSynthesisMatrix.sisuGrade} | 수호 정령: ${report.guardianNatureSpirit}
1. [기적의 맷돌 삼포(Sampo) 3대 번영 밸런스]:
   - 주재 번영 날개: [${sb.dominantWing}]
   - 주재 축복 선물: ${sb.dominantGift}
   - 삼포 3대 날개 균형: 곡물/안정(${wingGrade(sb.flourScore)}) · 소금/지혜(${wingGrade(sb.saltScore)}) · 황금/번영(${wingGrade(sb.goldScore)})

2. [바이내뫼이넨의 9대 신성 룬가(Runo) 신탁]:
   - 주재 룬: 제${r.runoNumber}장 [${r.runoTitle}]
   - 신화적 기원: ${r.mythicOrigin}
   - 로이추(마법 치유 노래): "${r.loitsuChant}"

3. [질문 맥락 감사 & KST 시공간 리듬 (${report.temporalSampoRhythm.kstHour}시)]:
   - 삼포 초점: ${report.situationalSampoAudit.sampoAxis} · 지렛대(${report.situationalSampoAudit.sisuLeverage})
   - 장인 실천: ${report.situationalSampoAudit.artisanAction}
   - 설한 경계: ${report.situationalSampoAudit.frostCaution}
   - 시공간 창: ${report.temporalSampoRhythm.nordicSunWindow} · ${report.temporalSampoRhythm.taigaSeasonPhase} (${report.temporalSampoRhythm.sisuTempo})
   - 시간대 지침: ${report.temporalSampoRhythm.forgeTimingGuidance}

4. [북유럽식 치유 처방 & 칼레발라 지혜]:
   - 교차 매트릭스: ${report.sampoSynthesisMatrix.wingRunoLink}
   - 실천 처방: ${report.forestHealingPractice}
   - 칼레발라 총평: ${report.kalevalaWisdom}
   - 해석 경계: 칼레발라 삼포 3대 날개와 시수(Sisu) 상징을 빌린 정성적 회복탄력 참고 관점이며, 수치 평가나 미래 단정이 아닙니다.`;
}

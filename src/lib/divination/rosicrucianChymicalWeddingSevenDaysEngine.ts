/**
 * 로젠크로이츠 화학적 결혼 7일 연금술 영혼 승화 엔진 (rosicrucianChymicalWeddingSevenDaysEngine.ts)
 *
 * 1616년 요한 발렌틴 안드레에의 원전 《크리스티안 로젠크로이츠의 화학적 결혼(Chymische Hochzeit Christiani Rosencreutz)》 기반:
 * 내면의 신성한 변성(Transmutatio)을 향해 나아가는 7일간의 연금술적 성스러운 순례.
 * 아니마(달/여왕)와 아니무스(태양/왕)의 신성한 결합(Mysterium Coniunctionis)을 통해
 * 에고의 불순물을 정화하고 영적 불사조(Phoenix)이자 현자의 돌(Lapis Philosophorum)로 거듭나는 비전 체계.
 *
 * 7일간의 연금술적 성스러운 여정(Seven Alchemical Days):
 * 1. Day 1: 소명과 초대 (Vocation & Invitation) - 순결한 백색 리본과 영적 부르심에 응답함
 * 2. Day 2: 세 갈래 길의 선택 (Triad Paths Decision) - 지혜로운 분별력으로 험로를 넘어 왕궁에 도달함
 * 3. Day 3: 영혼의 저울 시험 (Balance of Virtues) - 7대 추의 무게 시험을 통과하여 황금 양털을 수여받음
 * 4. Day 4: 신성한 연극과 결합 (Mysterium Coniunctionis) - 왕과 여왕의 결합, 내적 대극의 완벽한 화해
 * 5. Day 5: 비너스의 비밀 묘소 (Underground Vault of Venus) - 무의식 속 잠든 자연의 신비를 경건히 목도함
 * 6. Day 6: 올림푸스 탑의 증류 (Phoenix Distillation) - 연금술적 가열과 정제를 통해 알에서 깨어난 불사조의 부활
 * 7. Day 7: 황금석 기사 서임 (Knighthood of the Golden Stone) - 영적 자유를 얻고 세상을 섬기는 참된 현자로 완성됨
 */

import type { UserProfile } from '../sharedState';

export const ROSICRUCIAN_CHYMICAL_WEDDING_ENGINE_VERSION = '2.1.0';

export interface RosicrucianAlchemicalStage {
  dayNumber: number;
  dayName: string;
  latinStage: string;
  alchemicalPhase: 'Nigredo (흑화)' | 'Albedo (백화)' | 'Citrinitas (황화)' | 'Rubedo (적화)';
  symbolicMeaning: string;
  spiritualTransmutation: string;
  resonanceScore: number; // 0 ~ 100
}

export interface RosicrucianChymicalWeddingReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  chymicalUnionScore: number; // 0 ~ 100 아니마-아니무스 신성 결합도
  philosophersStoneIndex: number; // 0 ~ 100 현자의 돌 완성 지수
  sevenDaysTransmutationRate: number; // 0 ~ 100 7일간의 연금술 변성 성취율
  phoenixRebirthVibration: number; // 0 ~ 100 불사조 부활 영적 진동
  dominantStage: RosicrucianAlchemicalStage; // 현재 주재하는 7일 순례 단계
  activeAlchemicalPhase: string; // 현재 주재하는 4원 연금술 국면
  rosicrucianGuidance: string; // 장미십자회 지혜 지침
  alchemicalTransmutationRitual: string; // 연금술 영혼 정화 리추얼
  rosicrucianSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  interpretiveBoundary: string;
}

function formatRosicrucianKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

function describeRosicrucianStage(score: number, phase: string): string {
  if (score >= 84) return `현자의 돌 완성기(${phase}) — 대극의 갈등이 황금빛 통합으로 무르익어 영혼의 빛이 맑게 드러나는 시기`;
  if (score >= 70) return `연금술 증류기(${phase}) — 불필요한 아집과 불순물을 걸러내고 본질적 통합을 향해 정제되는 시기`;
  return `내면 도가니 점화기(${phase}) — 낡은 습관과 미련을 내려놓고 새로운 변성을 준비하는 시기`;
}

const SEVEN_DAYS_BASE: Omit<RosicrucianAlchemicalStage, 'resonanceScore'>[] = [
  {
    dayNumber: 1,
    dayName: '제1일: 소명과 초대의 바람',
    latinStage: 'Vocatio & Epistola',
    alchemicalPhase: 'Nigredo (흑화)',
    symbolicMeaning: '폭풍 속에서 전해진 번개와 트럼펫의 초대장, 어깨에 매인 순백의 리본과 네 개의 장미',
    spiritualTransmutation: '일상의 안락함을 뒤로하고 영혼의 본질적 부르심에 기꺼이 응답하는 용기 있는 결단',
  },
  {
    dayNumber: 2,
    dayName: '제2일: 세 갈래 길과 왕궁의 성문',
    latinStage: 'Trivium & Porta Castelli',
    alchemicalPhase: 'Nigredo (흑화)',
    symbolicMeaning: '쉬운 길의 유혹을 뿌리치고 도비새의 안내를 받아 세 갈래 길 중 가파른 진리의 길을 선택함',
    spiritualTransmutation: '타협하지 않는 내적 도덕성과 영적 분별력을 통해 마침내 높은 성문으로 들어섬',
  },
  {
    dayNumber: 3,
    dayName: '제3일: 미덕의 저울과 황금 양털',
    latinStage: 'Ponderatio Animae & Vellus Aureum',
    alchemicalPhase: 'Albedo (백화)',
    symbolicMeaning: '허영과 오만의 거짓 추를 내려놓고, 순수한 영혼의 무게를 증명하여 수치심 없는 영광을 입음',
    spiritualTransmutation: '자아의 거짓된 과시를 모두 떨쳐내고 내면의 진실한 순수성(Albedo)으로 인정받음',
  },
  {
    dayNumber: 4,
    dayName: '제4일: 왕과 여왕의 결합의 연극',
    latinStage: 'Mysterium Coniunctionis & Corona Regia',
    alchemicalPhase: 'Albedo (백화)',
    symbolicMeaning: '신성한 궁정 연극 속에서 대극의 긴장이 풀리고, 태양의 왕과 달의 여왕이 하나로 포옹함',
    spiritualTransmutation: '내면의 이성과 감성, 의지와 수용성이 적대감을 끝내고 완벽한 조화로 통합됨',
  },
  {
    dayNumber: 5,
    dayName: '제5일: 지하 비너스의 방과 자연의 비전',
    latinStage: 'Sepulchrum Veneris & Ignis Naturae',
    alchemicalPhase: 'Citrinitas (황화)',
    symbolicMeaning: '지하 깊은 곳에 잠든 영원한 미와 생명의 원천을 꺼지지 않는 횃불로 조심스럽게 마주함',
    spiritualTransmutation: '무의식 깊숙이 묻어두었던 원초적 생명력과 영적 직관의 불꽃을 다시 일깨움',
  },
  {
    dayNumber: 6,
    dayName: '제6일: 올림푸스 탑의 증류와 불사조의 부활',
    latinStage: 'Distillatio Turris & Resurrectio Phoenicis',
    alchemicalPhase: 'Citrinitas (황화)',
    symbolicMeaning: '7층 탑의 정밀한 증류기를 통과하여 황금 알이 깨어나고, 잿더미 속에서 불사조가 날아오름',
    spiritualTransmutation: '고통과 정제의 불길을 통해 낡은 자아가 소멸하고 완전히 새로운 영적 자아로 재탄생함',
  },
  {
    dayNumber: 7,
    dayName: '제7일: 황금석 기사 서임과 영적 봉사',
    latinStage: 'Equites Lapidis Aurei & Servitium',
    alchemicalPhase: 'Rubedo (적화)',
    symbolicMeaning: '황금석(현자의 돌) 기사단의 칭호를 받고, 깨달은 지혜를 인류를 위한 자비로운 봉사로 승화함',
    spiritualTransmutation: '완성된 내면의 영적 황금(Rubedo)을 세상의 어둠을 밝히는 실천적 빛으로 확장함',
  },
];

export interface RosicrucianChymicalWeddingOptions {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
  currentTime?: string;
}

export function calculateRosicrucianChymicalWedding(
  optionsOrProfile?: RosicrucianChymicalWeddingOptions | UserProfile | null,
  legacyContext?: { question?: string; currentTime?: string }
): RosicrucianChymicalWeddingReport {
  let profile: UserProfile | null | undefined;
  let question = '';
  let now = new Date();

  if (optionsOrProfile && ('profile' in optionsOrProfile || 'question' in optionsOrProfile || 'now' in optionsOrProfile)) {
    const opts = optionsOrProfile as RosicrucianChymicalWeddingOptions;
    profile = opts.profile;
    question = opts.question || '';
    now = opts.now || (opts.currentTime ? new Date(opts.currentTime) : new Date());
  } else {
    profile = optionsOrProfile as UserProfile | null | undefined;
    question = legacyContext?.question || '';
    now = legacyContext?.currentTime ? new Date(legacyContext.currentTime) : new Date();
  }

  const bdate = profile?.basic?.birthdate || (profile as unknown as { birthDate?: string })?.birthDate || '1994-01-24';
  const btime = profile?.basic?.birthtime || (profile as unknown as { birthTime?: string })?.birthTime || '12:00';

  let seed = 161677;
  for (let i = 0; i < bdate.length; i++) seed = (seed * 31 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 19 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 17 + question.charCodeAt(i)) % 1000003;
  seed = (seed + now.getUTCHours() * 37) % 1000003;

  const stages: RosicrucianAlchemicalStage[] = SEVEN_DAYS_BASE.map((stg, idx) => {
    const score = 50 + ((seed * (idx + 3) + idx * 29) % 49);
    return { ...stg, resonanceScore: Math.min(99, Math.max(42, score)) };
  });

  stages.sort((a, b) => b.resonanceScore - a.resonanceScore);
  const dominantStage = stages[0];

  const chymicalUnionScore = Math.min(100, Math.max(45, 55 + ((seed * 23) % 43)));
  const philosophersStoneIndex = Math.min(100, Math.max(42, 53 + ((seed * 19) % 45)));
  const sevenDaysTransmutationRate = Math.min(100, Math.max(46, 52 + ((seed * 29) % 46)));
  const phoenixRebirthVibration = Math.min(100, Math.max(44, Math.floor((chymicalUnionScore * 0.5 + philosophersStoneIndex * 0.5))));

  const activeAlchemicalPhase = dominantStage.alchemicalPhase;

  const rosicrucianGuidance = `장미십자회의 연금술 비전 《화학적 결혼》은 선언합니다: "너 자신 안에서 죽고, 너 자신 안에서 거룩한 태양으로 다시 태어나라." 현재 당신의 영혼이 통과 중인 성스러운 단계는 [${dominantStage.dayName}]이며, 연금술적 국면은 [${activeAlchemicalPhase}]입니다. ${dominantStage.spiritualTransmutation}. 대극의 갈등은 분열이 아니라 황금빛 통합을 위해 마련된 거룩한 도가니입니다.`;
  const alchemicalTransmutationRitual = `가슴 중심에 십자가와 붉은 장미, 그리고 날아오르는 불사조의 빛을 시각화하십시오: "나의 낡은 번뇌는 순수한 불꽃 속에 용해되고, 신성한 지혜의 황금석이 내 안에서 온전히 빛난다."`;

  const calculatedAtKst = formatRosicrucianKstTimestamp(now);
  const composite = Math.round(
    (chymicalUnionScore + philosophersStoneIndex + sevenDaysTransmutationRate + phoenixRebirthVibration) / 4
  );
  const rosicrucianSynthesisMatrix = {
    dominantTension: `${dominantStage.dayName} ↔ ${activeAlchemicalPhase}`,
    alignmentState: describeRosicrucianStage(composite, activeAlchemicalPhase),
    integratedAction: `${dominantStage.spiritualTransmutation}${question.trim() ? ` [질문 맥락: ${question.trim()}]` : ''}`,
  };

  return {
    engineVersion: ROSICRUCIAN_CHYMICAL_WEDDING_ENGINE_VERSION,
    timestamp: now.toISOString(),
    calculatedAtKst,
    chymicalUnionScore,
    philosophersStoneIndex,
    sevenDaysTransmutationRate,
    phoenixRebirthVibration,
    dominantStage,
    activeAlchemicalPhase,
    rosicrucianGuidance,
    alchemicalTransmutationRitual,
    rosicrucianSynthesisMatrix,
    interpretiveBoundary: '본 장미십자회 화학적 결혼 리포트는 17세기 연금술 상징 체계에 기반한 정성적 내면 성찰 안내이며, 의학·심리 치료를 대신하지 않습니다.',
  };
}

export function formatRosicrucianChymicalWeddingPrompt(report: RosicrucianChymicalWeddingReport): string {
  const composite = Math.round(
    (report.chymicalUnionScore + report.philosophersStoneIndex + report.sevenDaysTransmutationRate + report.phoenixRebirthVibration) / 4
  );
  const lines = [
    `### 🌹 장미십자회 《화학적 결혼》 7일 연금술 영혼 승화 실측 데이터 (v${report.engineVersion})`,
    `- **연산 시각**: ${report.calculatedAtKst}`,
    `- **주재 연금술 단계**: ${report.dominantStage.dayName} (${report.dominantStage.latinStage})`,
    `- **활성 연금술 국면**: ${report.activeAlchemicalPhase}`,
    `- **영혼 변성 상태**: ${describeRosicrucianStage(composite, report.activeAlchemicalPhase)}`,
    `- **단계적 상징 의미**: ${report.dominantStage.symbolicMeaning}`,
    `- **영적 변성 핵심**: ${report.dominantStage.spiritualTransmutation}`,
    `- **장미십자회 지혜 지침**: ${report.rosicrucianGuidance}`,
    `- **연금술 정화 리추얼**: ${report.alchemicalTransmutationRitual}`,
  ];
  if (report.rosicrucianSynthesisMatrix) {
    lines.push(
      `- **교차 매트릭스**: [핵심 긴장: ${report.rosicrucianSynthesisMatrix.dominantTension} | 조율 상태: ${report.rosicrucianSynthesisMatrix.alignmentState}]`,
      `- **통합 실천**: ${report.rosicrucianSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(`- **해석 경계**: ${report.interpretiveBoundary}`);
  return lines.join('\n');
}

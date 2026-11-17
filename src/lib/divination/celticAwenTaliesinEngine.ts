/**
 * =========================================================================
 * LUCKEY 고대 켈트 바드 탈리에신(Taliesin) 가마솥 & 아웬(Awen) 영감 엔진
 * (Celtic Welsh Bard Taliesin & Cauldron of Awen Inspiration Engine)
 * =========================================================================
 * 
 * [학술적·전통적 배경]
 * 고대 켈트 웨일스의 전설적 대음유시인이자 예언자 탈리에신(Taliesin)의 서사시집
 * 《탈리에신의 책(Llyfr Taliesin)》 및 여신 케리드웬(Cerridwen)의 가마솥 신화 원전.
 * 
 * 1. 신성한 영감 아웬(Awen /|\)의 3대 광선(Three Rays of Divine Light):
 *    - 좌측 광선: 대자연과 대지, 여성적 직관과 감수성의 빛 (Nature & Intuition)
 *    - 중앙 광선: 인간과 사회, 현실의 진실과 정의의 균형 빛 (Truth & Balance)
 *    - 우측 광선: 천상과 태양, 창조적 비전과 불굴의 열정 빛 (Solar Vision & Passion)
 * 2. 탈리에신 4단계 영혼 변용(Fourfold Metamorphosis of Gwion Bach):
 *    - 산토끼 (Hare) - 기민한 위기 감지와 민첩한 방향 전환
 *    - 연어 (Salmon) - 지혜의 깊은 소(Pool)로 파고드는 심층적 통찰
 *    - 굴뚝새 (Wren) - 높은 상공에서 전체 판세를 읽는 거시적 조망
 *    - 곡식 이삭 (Grain) - 대지에 겸허히 뿌리내려 위대한 창조자로 거듭남
 * 3. 아웬(Awen) 창조적 몰입 및 혁신 지수 (0~100).
 * 4. 케리드웬의 가마솥(Cauldron of Cerridwen) 변용 처방 및 바드 신탁.
 */

import type { UserProfile } from '../sharedState';

export const CELTIC_AWEN_TALIESIN_ENGINE_VERSION = '2.3.0';

export interface AwenSituationalAudit {
  cauldronFocus: string;
  rayAlignment: string;
  bardicAction: string;
  illusionCaution: string;
}

export interface AwenTemporalRhythm {
  kstHour: number;
  awenBardicWindow: string;
  celticQuarterPhase: string;
  inspirationGuidance: string;
  awenTempo: '발현' | '침잠' | '연단';
}

export interface AwenSynthesisMatrix {
  inspirationState: '아웬만개' | '내면숙성' | '변용도약';
  rayTotemLink: string;
  nextCauldronStep: string;
}

export interface AwenRaysBalance {
  natureRayScore: number; // 자연/직관의 빛 0~100
  truthRayScore: number; // 진실/균형의 빛 0~100
  solarRayScore: number; // 태양/창조의 빛 0~100
  dominantRay: '자연과 직관의 빛 (Nature & Intuition)' | '진실과 균형의 빛 (Truth & Balance)' | '태양과 창조의 빛 (Solar Vision & Passion)';
  dominantRayRole: string;
}

export interface MetamorphosisPhase {
  animalTotem: string;
  phaseTitle: string;
  strategicGift: string;
  bardicProclamation: string;
}

export interface CelticAwenTaliesinReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  awenFlowIndex: number; // 내부 연산용
  awenRays: AwenRaysBalance;
  activeMetamorphosis: MetamorphosisPhase;
  situationalAwenAudit: AwenSituationalAudit;
  temporalAwenRhythm: AwenTemporalRhythm;
  awenSynthesisMatrix: AwenSynthesisMatrix;
  cauldronPractice: string; // 가마솥 연단 실천
  taliesinProphecy: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const METAMORPHOSIS_PHASES: MetamorphosisPhase[] = [
  {
    animalTotem: '산토끼 (The Swift Hare)',
    phaseTitle: '민첩한 감지와 전광석화의 전환',
    strategicGift: '위험이나 정체의 조짐을 본능적으로 감지하고 망설임 없이 기민하게 방향을 트는 민첩성',
    bardicProclamation: '나는 들판을 달리는 산토끼였으니, 과거의 덫에 머물지 않고 번개처럼 새 길을 찾으리라.'
  },
  {
    animalTotem: '신성한 연어 (The Salmon of Wisdom)',
    phaseTitle: '심연의 잠수와 지혜의 원천 탐색',
    strategicGift: '소용돌이치는 표면의 혼란을 벗어나 가장 깊고 맑은 지혜의 바닥으로 침잠하는 통찰력',
    bardicProclamation: '나는 지혜의 헤이즐넛이 떨어진 깊은 강의 연어였으니, 침묵 속에서 만물의 비의를 삼켰노라.'
  },
  {
    animalTotem: '작은 굴뚝새 (The Sky-High Wren)',
    phaseTitle: '독수리의 날개에 올라탄 거시적 비상',
    strategicGift: '낮은 지상에 얽매이지 않고 높은 하늘로 솟구쳐 전체 판세와 맥락을 단숨에 조망하는 지략',
    bardicProclamation: '나는 하늘 가장 높은 곳을 비행하는 작은 새였으니, 가장 거대한 풍경을 한눈에 담았노라.'
  },
  {
    animalTotem: '황금 곡식 낟알 (The Golden Grain)',
    phaseTitle: '완전한 숙성과 부활의 재탄생',
    strategicGift: '일시적인 해체와 성장의 고통을 겸허히 수용하여 불멸의 빛을 발하는 위대한 창조자로의 도약',
    bardicProclamation: '나는 케리드웬의 가마솥을 거쳐 붉은 이삭이 되었으니, 다시 태어나 영원한 노래를 부르리라.'
  }
];

/**
 * 사용자 프로필 및 타임스탬프를 기반으로
 * 켈트 아웬(Awen) 3대 광선과 탈리에신 변용 국면을 결정론적으로 연산합니다.
 */
function getKstAwenParts(now: Date): { hour: number; month: number } {
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

function buildAwenSituationalAudit(
  question: string,
  dominantRay: { name: AwenRaysBalance['dominantRay']; role: string },
  phase: MetamorphosisPhase
): AwenSituationalAudit {
  const q = question.toLowerCase();
  if (/창작|아이디어|글|기획|일|사업|프로젝트|새로/.test(q)) {
    return {
      cauldronFocus: `케리드웬의 가마솥 창조 발효 — ${dominantRay.name}`,
      rayAlignment: dominantRay.role,
      bardicAction: `탈리에신의 [${phase.animalTotem}]처럼 낡은 형식을 벗고 오늘 떠오른 핵심 아이디어 한 줄을 바로 형태화하십시오.`,
      illusionCaution: '완벽한 문장이나 거창한 설계를 기다리다 영감의 불씨가 식지 않게 하십시오.',
    };
  }
  if (/변화|선택|이직|갈림길|고민|방향/.test(q)) {
    return {
      cauldronFocus: `[${phase.phaseTitle}] — 유연한 변용과 탈피`,
      rayAlignment: phase.strategicGift,
      bardicAction: '산토끼처럼 민첩하게 상황을 살피되, 연어처럼 깊은 본질 하나를 붙들고 결정하십시오.',
      illusionCaution: '남의 박수나 체면 때문에 내면의 아웬(Awen) 직관을 외면하지 마십시오.',
    };
  }
  return {
    cauldronFocus: `${dominantRay.name} · ${phase.phaseTitle}`,
    rayAlignment: dominantRay.role,
    bardicAction: '10분간 검열 없는 자유 기록으로 머릿속 안개를 걷어내십시오.',
    illusionCaution: '생각만 거듭하며 실제 표현을 미루지 마십시오.',
  };
}

function buildAwenTemporalRhythm(now: Date): AwenTemporalRhythm {
  const { hour, month } = getKstAwenParts(now);

  let awenBardicWindow = '여명 아웬(Awen) 첫 광선 창';
  let awenTempo: AwenTemporalRhythm['awenTempo'] = '발현';
  let inspirationGuidance = '고요한 새벽 공기와 함께 직관의 첫 영감을 포착하기 좋은 시간입니다.';

  if (hour >= 5 && hour < 10) {
    awenBardicWindow = '여명 아웬(Awen) 첫 광선 창 (05~10시)';
    awenTempo = '발현';
    inspirationGuidance = '검열 없이 떠오르는 생각과 오늘의 핵심 의도를 적기 좋습니다.';
  } else if (hour >= 10 && hour < 17) {
    awenBardicWindow = '주간 바드(Bard) 선언 및 실행 창 (10~17시)';
    awenTempo = '발현';
    inspirationGuidance = '구상한 영감을 실제 말과 글, 실무 결과물로 옮기기 알맞은 시간입니다.';
  } else if (hour >= 17 && hour < 21) {
    awenBardicWindow = '황혼 케리드웬 가마솥 숙성 창 (17~21시)';
    awenTempo = '연단';
    inspirationGuidance = '오늘 얻은 경험을 천천히 곱씹으며 내면의 지혜로 뭉근히 달이십시오.';
  } else {
    awenBardicWindow = '심야 지혜의 연어 침잠 창 (21~05시)';
    awenTempo = '침잠';
    inspirationGuidance = '외부 자극을 끄고 깊은 휴식 속에서 무의식의 샘을 채울 시간입니다.';
  }

  let celticQuarterPhase = '임볼크(Imbolc · 새싹과 정화절)';
  if (month >= 2 && month <= 4) celticQuarterPhase = '임볼크~벨테인 · 영감 발아절';
  else if (month >= 5 && month <= 7) celticQuarterPhase = '벨테인~루그나사드 · 태양 창조절';
  else if (month >= 8 && month <= 10) celticQuarterPhase = '루그나사드~삼하인 · 수확 숙성절';
  else celticQuarterPhase = '삼하인~임볼크 · 가마솥 침잠절';

  return {
    kstHour: hour,
    awenBardicWindow,
    celticQuarterPhase,
    inspirationGuidance,
    awenTempo,
  };
}

export function calculateCelticAwenTaliesin(options?: {
  profile?: UserProfile;
  targetInstantTime?: string;
  question?: string;
}): CelticAwenTaliesinReport {
  const profile = options?.profile;
  const now = options?.targetInstantTime ? new Date(options.targetInstantTime) : new Date();

  let seed = 570; // 6세기 역사적 탈리에신 활동 연대 상징수

  if (profile?.basic?.birthdate) {
    const parts = profile.basic.birthdate.split('-').map(Number);
    seed += (parts[0] || 1990) * 23 + (parts[1] || 1) * 37 + (parts[2] || 1) * 19;
  } else {
    seed += now.getFullYear() * 17 + (now.getMonth() + 1) * 29 + now.getDate() * 19;
  }

  if (profile?.basic?.birthtime) {
    const [h, m] = profile.basic.birthtime.split(':').map(Number);
    seed += (h || 0) * 31 + (m || 0) * 7;
  }

  // 1. 아웬(Awen) 창조적 몰입 지수 (58 ~ 99점 범위)
  const awenFlowIndex = 58 + (seed % 42);

  // 2. 아웬 3대 광선 수치 산출
  const natureRayScore = 45 + ((seed * 7 + 19) % 53);
  const truthRayScore = 45 + ((seed * 11 + 31) % 53);
  const solarRayScore = 45 + ((seed * 13 + 47) % 53);

  const rays = [
    { name: '자연과 직관의 빛 (Nature & Intuition)' as const, score: natureRayScore, role: '외부의 소음 없이 내면의 직관과 자연의 리듬을 예민하게 포착하는 힘' },
    { name: '진실과 균형의 빛 (Truth & Balance)' as const, score: truthRayScore, role: '현실적인 조건과 인간관계의 균형을 공정하고 단단하게 조율하는 힘' },
    { name: '태양과 창조의 빛 (Solar Vision & Passion)' as const, score: solarRayScore, role: '새로운 프로젝트와 미래 비전을 과감하게 세상에 펼쳐내는 영감' }
  ];
  rays.sort((a, b) => b.score - a.score);
  const dominantRay = rays[0];

  const awenRays: AwenRaysBalance = {
    natureRayScore,
    truthRayScore,
    solarRayScore,
    dominantRay: dominantRay.name,
    dominantRayRole: dominantRay.role
  };

  // 3. 변용 국면 선정
  const phaseIdx = seed % METAMORPHOSIS_PHASES.length;
  const activeMetamorphosis = METAMORPHOSIS_PHASES[phaseIdx];

  // 4. 가마솥 연단 실천
  const cauldronPractices = [
    '아침 시간 10분간 어떤 검열이나 퇴고도 없이 머릿속 생각을 자유롭게 적어 내려가는 아웬(Awen) 모닝 프리라이팅',
    '좋아하는 서정시나 영감을 주는 문장을 소리 내어 읊으며 언어의 음악적 울림을 가슴에 채우기',
    '따뜻한 물에 몸을 담그거나 손을 씻으며 케리드웬의 가마솥처럼 내면의 지혜를 뭉근히 달이는 시간 갖기',
    '현재 고민하는 문제를 낯선 은유나 비유로 바꾸어 생각해보며 고정된 관점을 허무는 바드적 상상력 훈련'
  ];
  const cauldronPractice = cauldronPractices[seed % cauldronPractices.length];

  const taliesinProphecy = `아웬의 세 광선 중 [${dominantRay.name}]이 찬란히 비추고 있습니다. 탈리에신의 변용 [${activeMetamorphosis.animalTotem}]의 기운으로: "${activeMetamorphosis.bardicProclamation}"`;

  const situationalAwenAudit = buildAwenSituationalAudit(options?.question || '', dominantRay, activeMetamorphosis);
  const temporalAwenRhythm = buildAwenTemporalRhythm(now);
  const inspirationState: AwenSynthesisMatrix['inspirationState'] =
    awenFlowIndex >= 85 ? '아웬만개' : awenFlowIndex >= 72 ? '변용도약' : '내면숙성';
  const awenSynthesisMatrix: AwenSynthesisMatrix = {
    inspirationState,
    rayTotemLink: `[${dominantRay.name}]의 빛과 [${activeMetamorphosis.animalTotem}]의 변용이 ${temporalAwenRhythm.awenBardicWindow}에서 만납니다.`,
    nextCauldronStep: situationalAwenAudit.bardicAction,
  };

  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const calculatedAtKst = `${kst.toISOString().slice(0, 19)}+09:00 (KST)`;
  const interpretiveBoundary = '본 켈트 아웬 탈리에신 리포트는 웨일스 바드 전통의 상징과 변용을 비추는 정성적 영감 안내이며, 확정적 예언이 아닙니다.';
  const trimmedQuestion = options?.question?.trim();
  const reflectionFocus = `[${activeMetamorphosis.animalTotem}] 변용의 시선으로 볼 때, 지금 내가 낡은 껍질을 벗고 새롭게 부를 노래는 무엇인가요?`;
  const reflectiveQuestion = trimmedQuestion
    ? `"${trimmedQuestion}"이라는 물음 앞에서 [${dominantRay.name}]과 [${activeMetamorphosis.animalTotem}]의 기운으로 본다면, 지금 내가 망설임을 벗고 표현할 첫 번째 진실은 무엇인가요?`
    : reflectionFocus;

  return {
    engineVersion: CELTIC_AWEN_TALIESIN_ENGINE_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    awenFlowIndex,
    awenRays,
    activeMetamorphosis,
    situationalAwenAudit,
    temporalAwenRhythm,
    awenSynthesisMatrix,
    cauldronPractice,
    taliesinProphecy,
    ritualAction: cauldronPractice,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary
  };
}

/**
 * 프롬프트 포맷터
 */
export function formatCelticAwenTaliesinPrompt(report: CelticAwenTaliesinReport): string {
  const r = report.awenRays;
  const m = report.activeMetamorphosis;
  const rayStrength = (s: number) => (s >= 80 ? '충만' : s >= 62 ? '조화' : '잠재');

  return `[🔮 고대 켈트 바드 탈리에신(Taliesin) 가마솥 & 아웬(Awen) 영감 실측 데이터 (v${report.engineVersion})]
- 기준 시각(KST): ${report.calculatedAtKst} | 아웬(Awen) 영감 위상: ${report.awenSynthesisMatrix.inspirationState}
1. [신성한 영감 아웬(Awen /|\\) 3대 광선]:
   - 주재 영감 광선: [${r.dominantRay}]
   - 주재 광선 역량: ${r.dominantRayRole}
   - 3대 광선 균형: 자연/직관(${rayStrength(r.natureRayScore)}) · 진실/균형(${rayStrength(r.truthRayScore)}) · 태양/창조(${rayStrength(r.solarRayScore)})

2. [탈리에신 4단계 영혼 변용(Metamorphosis)]:
   - 현재 변용 국면: [${m.animalTotem}] - ${m.phaseTitle}
   - 전략적 선물: ${m.strategicGift}
   - 바드적 선언: "${m.bardicProclamation}"

3. [질문 맥락 감사 & KST 시공간 리듬 (${report.temporalAwenRhythm.kstHour}시)]:
   - 가마솥 초점: ${report.situationalAwenAudit.cauldronFocus}
   - 바드 실천: ${report.situationalAwenAudit.bardicAction}
   - 환상 경계: ${report.situationalAwenAudit.illusionCaution}
   - 시공간 창: ${report.temporalAwenRhythm.awenBardicWindow} · ${report.temporalAwenRhythm.celticQuarterPhase} (${report.temporalAwenRhythm.awenTempo})
   - 시간대 지침: ${report.temporalAwenRhythm.inspirationGuidance}

4. [케리드웬 가마솥 처방 & 탈리에신 신탁]:
   - 교차 매트릭스: ${report.awenSynthesisMatrix.rayTotemLink}
   - 가마솥 연단 실천: ${report.cauldronPractice}
   - 질문 맞춤 성찰 질문: ${report.reflectiveQuestion}
   - 종합 영감 예언: ${report.taliesinProphecy}
   - 해석 경계: ${report.interpretiveBoundary}`;
}

/**
 * 고대 수메르 이난나(Inanna) 명계 하강 7대 관문 & 영혼 부활 엔진 (sumerianInannaUnderworldDescentEngine.ts)
 *
 * 기원전 2000년 메소포타미아 수메르 점토판 원전 《이난나의 명계 하강(Inanna's Descent to the Netherworld)》 기반:
 * 천상과 지상의 여왕 이난나가 심연의 여왕이자 그림자 자매인 에레슈키갈(Ereshkigal)의 영역 쿠르(Kur)로 내려가며,
 * 7대 관문에서 7대 메(Me)와 왕관·목걸이·가슴판 등 외적 에고의 페르소나를 전면 탈각(Sacred Stripping)하고,
 * 완전한 상징적 죽음의 영점(Zero Point)을 거쳐 엔키 신의 생명의 풀과 생명의 물(Food & Water of Life)로 부활하는
 * 영혼의 연금술적 재생 및 그림자 통합 엔진.
 *
 * 7대 명계 관문(Seven Underworld Gates):
 * 1. 간지르(Ganzir) 관문 - 사막의 슈구라(Shugurra) 왕관 탈각 (세속적 권력과 명예의 무력화)
 * 2. 제2관문 - 청옥(라피스 라줄리) 구슬 목걸이 탈각 (지적 오만과 언어적 방어기제 해체)
 * 3. 제3관문 - 쌍둥이 달걀형 가슴판 탈각 (두려움에 닫힌 가슴과 감정적 갑옷 해체)
 * 4. 제4관문 - 황금 가슴받이 탈각 (생명에 대한 통제욕과 집착 소멸)
 * 5. 제5관문 - 청동 팔찌 탈각 (조작과 행위 중심주의의 정지)
 * 6. 제6관문 - 청옥 척도와 끈 탈각 (시비분별과 비교 판단의 잣대 포기)
 * 7. 제7관문 - 팔라(Pala) 여왕의 예복 탈각 (외적 자아상과 페르소나의 완전한 알몸화)
 */

import type { UserProfile } from '../sharedState';

export const SUMERIAN_INANNA_UNDERWORLD_DESCENT_ENGINE_VERSION = '1.0.0';

export interface UnderworldGate {
  gateNumber: number;
  gateName: string;
  relicStripped: string;
  shadowPersona: string;
  purificationTheme: string;
  passageScore: number; // 0 ~ 100 통과 및 탈각도
}

export interface SumerianInannaUnderworldDescentReport {
  engineVersion: string;
  timestamp: string;
  underworldSevenGatesPassRate: number; // 0 ~ 100 7대 관문 통과 및 에고 탈각도
  spiritualResurrectionVitality: number; // 0 ~ 100 영혼 부활 활력 지수
  ereshkigalShadowReconciliation: number; // 0 ~ 100 에레슈키갈 그림자 화해율
  foodOfLifeWaterOfLifeResonance: number; // 0 ~ 100 생명의 풀·생명의 물 영적 공명도
  gates: UnderworldGate[];
  currentCrucialGate: UnderworldGate; // 현재 당면한 가장 절실한 탈각 관문
  inannaResurrectionGuidance: string; // 이난나 부활 지침
  enkiLifeRestorationRitual: string; // 엔키의 생명의 물 재생 리추얼
}

const UNDERWORLD_GATES_BASE: Omit<UnderworldGate, 'passageScore'>[] = [
  {
    gateNumber: 1,
    gateName: '간지르 관문',
    relicStripped: '사막의 슈구라 왕관',
    shadowPersona: '세속적 타이틀과 사회적 인정에 기댄 자부심',
    purificationTheme: '직함이나 지위 없이도 빛나는 순수 영혼의 고유성 회복',
  },
  {
    gateNumber: 2,
    gateName: '라피스 관문',
    relicStripped: '청옥 구슬 목걸이',
    shadowPersona: '지적 우월감, 논리적 합리화와 언어적 통제',
    purificationTheme: '머리로만 이해하려던 태도를 내려놓고 침묵의 진실 마주하기',
  },
  {
    gateNumber: 3,
    gateName: '가슴판 관문',
    relicStripped: '쌍둥이 달걀형 가슴판',
    shadowPersona: '상처받지 않으려 가슴 주변에 쌓아 올린 방어벽',
    purificationTheme: '취약함을 온전히 인정할 때 열리는 절대 안전의 가슴',
  },
  {
    gateNumber: 4,
    gateName: '황금 관문',
    relicStripped: '황금 가슴받이',
    shadowPersona: '결과를 내 손으로 쥐고 흔들어야 한다는 결핍적 통제욕',
    purificationTheme: '삶의 흐름에 의식을 온전히 맡기는 궁극의 순복(Surrender)',
  },
  {
    gateNumber: 5,
    gateName: '청동 팔찌 관문',
    relicStripped: '청동 팔찌와 가락지',
    shadowPersona: '끊임없이 뭔가를 조작하고 채워 넣으려는 분주한 손',
    purificationTheme: '행위(Doing)를 멈추고 존재(Being) 자체로 온전해지기',
  },
  {
    gateNumber: 6,
    gateName: '척도 관문',
    relicStripped: '청옥 척도와 측량 끈',
    shadowPersona: '타인과 나를 잴 때 쓰는 비교와 채점의 자',
    purificationTheme: '모든 평가를 거두고 있는 그대로의 우주적 완전성 긍정',
  },
  {
    gateNumber: 7,
    gateName: '팔라 예복 관문',
    relicStripped: '여왕의 성스러운 팔라 예복',
    shadowPersona: '마지막 남은 자아 방어선과 외적 이미지',
    purificationTheme: '모든 가면을 벗어던진 영점(Zero)에서 맞이하는 신성한 재탄생',
  },
];

export interface SumerianInannaUnderworldDescentOptions {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
  currentTime?: string;
}

export function calculateSumerianInannaUnderworldDescent(
  optionsOrProfile?: SumerianInannaUnderworldDescentOptions | UserProfile | null,
  legacyContext?: { question?: string; currentTime?: string }
): SumerianInannaUnderworldDescentReport {
  let profile: UserProfile | null | undefined;
  let question = '';
  let now = new Date();

  if (optionsOrProfile && ('profile' in optionsOrProfile || 'question' in optionsOrProfile || 'now' in optionsOrProfile)) {
    const opts = optionsOrProfile as SumerianInannaUnderworldDescentOptions;
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

  let seed = 37199;
  for (let i = 0; i < bdate.length; i++) seed = (seed * 31 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 19 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 17 + question.charCodeAt(i)) % 1000003;
  seed = (seed + now.getUTCHours() * 29) % 1000003;

  const gates: UnderworldGate[] = UNDERWORLD_GATES_BASE.map((gate, idx) => {
    const score = 38 + ((seed * (idx + 5) + idx * 23) % 60);
    return { ...gate, passageScore: Math.min(99, Math.max(30, score)) };
  });

  // 점수가 가장 낮은 관문이 현재 영혼이 가장 집착하여 벗지 못하고 있는 핵심 관문
  const sortedGates = [...gates].sort((a, b) => a.passageScore - b.passageScore);
  const currentCrucialGate = sortedGates[0];

  const totalPass = gates.reduce((acc, g) => acc + g.passageScore, 0);
  const underworldSevenGatesPassRate = Math.min(100, Math.max(35, Math.floor(totalPass / gates.length)));

  const spiritualResurrectionVitality = Math.min(100, Math.max(42, 54 + ((seed * 19) % 44)));
  const ereshkigalShadowReconciliation = Math.min(100, Math.max(40, 50 + ((seed * 31) % 48)));
  const foodOfLifeWaterOfLifeResonance = Math.min(100, Math.max(45, Math.floor((spiritualResurrectionVitality * 0.5 + ereshkigalShadowReconciliation * 0.5))));

  const inannaResurrectionGuidance = `명계의 7개 관문 중 지금 당신이 통과해야 할 가장 깊은 지점은 제${currentCrucialGate.gateNumber}관문 [${currentCrucialGate.gateName}]입니다. [${currentCrucialGate.relicStripped}]을 벗어던지듯, ${currentCrucialGate.shadowPersona}를 내려놓을 때 에레슈키갈과의 어둠이 화해되고 부활의 생명수가 주입됩니다.`;
  const enkiLifeRestorationRitual = `조용히 양손을 펴고 깊은 호흡을 내쉬며 읊조리십시오: "나는 나의 지위도, 가면도, 통제욕도 아니다. 가장 깊은 어둠 속에서도 엔키의 생명의 물(A-nam-ti-la)이 나를 다시 일으켜 세운다."`;

  return {
    engineVersion: SUMERIAN_INANNA_UNDERWORLD_DESCENT_ENGINE_VERSION,
    timestamp: now.toISOString(),
    underworldSevenGatesPassRate,
    spiritualResurrectionVitality,
    ereshkigalShadowReconciliation,
    foodOfLifeWaterOfLifeResonance,
    gates,
    currentCrucialGate,
    inannaResurrectionGuidance,
    enkiLifeRestorationRitual,
  };
}

export function formatSumerianInannaUnderworldDescentPrompt(rep: SumerianInannaUnderworldDescentReport): string {
  return `[고대 수메르 이난나 명계 하강 7대 관문 & 부활 실측 데이터]
· 엔진 버전: v${rep.engineVersion}
· 7대 관문 에고 탈각도: ${rep.underworldSevenGatesPassRate}/100 | 영혼 부활 활력도: ${rep.spiritualResurrectionVitality}/100
· 에레슈키갈 그림자 화해율: ${rep.ereshkigalShadowReconciliation}/100 | 생명의 풀·물 공명도: ${rep.foodOfLifeWaterOfLifeResonance}/100
· 현재 직면한 핵심 탈각 관문: 제${rep.currentCrucialGate.gateNumber}관문 [${rep.currentCrucialGate.gateName}] — 통과도 ${rep.currentCrucialGate.passageScore}%
  - 탈각 성물: ${rep.currentCrucialGate.relicStripped}
  - 직면 그림자: ${rep.currentCrucialGate.shadowPersona}
  - 정화 과제: ${rep.currentCrucialGate.purificationTheme}
· 7대 관문 현황:
${rep.gates.map((g) => `  - 제${g.gateNumber}관문(${g.gateName}): ${g.passageScore}/100 [${g.relicStripped}]`).join('\n')}
· 이난나 부활 조언: ${rep.inannaResurrectionGuidance}
· 엔키 생명의 물 재생 리추얼: ${rep.enkiLifeRestorationRitual}`;
}

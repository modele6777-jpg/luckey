import type { UserProfile } from '../sharedState';

export interface PalmyreneOasisResult {
  engineVersion: string;
  calculatedAtKst: string;
  oasisPillar: string;
  palmyreneInsight: string;
  syrianDesertTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PILLARS = [
  { pillar: '대열주랑(Great Colonnade · 사막 한복판에 뻗은 정갈한 기둥들의 질서)', insight: '주변이 황량하고 불확실해 보여도 내 안의 원칙과 질서가 서 있으면 길은 선명해짐', tone: '시리아 사막의 황금빛 노을을 받아 따뜻하게 빛나는 고대 팔미라 석회암 열주' },
  { pillar: '에프카 샘(Efqa Spring · 모래 아래서 솟아 오아시스를 키우는 힘)', insight: '마르지 않는 힘은 거창한 겉모습이 아니라 조용히 솟아나는 내면의 작은 호기심과 돌봄임', tone: '대추야자 숲 사이로 맑은 물안개를 피워 올리는 사막의 온천 샘' },
  { pillar: '사막의 교차로(Caravan Crossroads · 동과 서의 지혜가 만나는 자리)', insight: '내가 이미 아는 방식만 고집하지 않고 낯선 관점을 하나 받아들이면 시야가 두 배로 트임', tone: '별빛 아래 낙타 대상들이 모여 서로의 소식을 나누던 고대 오아시스 광장' },
  { pillar: '제노비아의 담대함(Zenobia · 변방에서도 스스로의 중심을 세우는 기개)', insight: '남들이 정해 준 한계에 나를 가두지 않고 오늘 내가 할 수 있는 몫을 당당히 펼침', tone: '넓은 사막 지평선을 바라보며 서 있는 고대 성채의 맑고 단단한 실루엣' },
  { pillar: '코린트 주두의 잎새(Acanthus Capital · 단단한 돌 위에 피운 섬세한 숨결)', insight: '단호하고 바쁜 일상을 살아갈수록 작은 아름다움과 다정함을 잃지 않는 여백이 귀함', tone: '사암 기둥 꼭대기에 정교하게 새겨진 부드러운 잎사귀 조각' },
];

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('Z', '+09:00 (KST)');
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculatePalmyreneOasisColonnade(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): PalmyreneOasisResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PILLARS.length;
  const picked = PILLARS[idx];

  return {
    engineVersion: 'LUCKEY-PALMYRENE-OASIS-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    oasisPillar: picked.pillar,
    palmyreneInsight: picked.insight,
    syrianDesertTone: picked.tone,
    reflectionFocus: `고대 팔미라 오아시스 지혜의 '${picked.pillar}'처럼, 불확실한 사막 한가운데서도 나만의 단정한 질서와 낯선 시선을 함께 품어 보세요.`,
    ritualAction: '오늘 내가 익숙하게 고집하던 방식 하나를 잠시 내려놓고, 전혀 다른 각도의 아이디어 하나를 가볍게 시험해 보세요.',
    reflectiveQuestion: '지금 내 주변이 막막한 사막처럼 보일 때, 내 마음속에서 에프카 샘처럼 조용히 솟아올라 나를 지탱해 주는 힘은 무엇인가요?',
    interpretiveBoundary: '고대 팔미라(Palmyra) 오아시스의 대열주랑 질서·교차로 개방성 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatPalmyreneOasisPrompt(res: PalmyreneOasisResult): string {
  return [
    `[팔미라 오아시스·대열주랑 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 오아시스 기둥: ${res.oasisPillar} (${res.syrianDesertTone})`,
    `- 중심 통찰: ${res.palmyreneInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

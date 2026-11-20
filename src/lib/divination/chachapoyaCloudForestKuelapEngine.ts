import type { UserProfile } from '../sharedState';

export interface ChachapoyaKuelapResult {
  engineVersion: string;
  calculatedAtKst: string;
  cloudCitadel: string;
  kuelapInsight: string;
  andesCloudTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const CITADELS = [
  { citadel: '쿠엘랍의 둥근 돌집(Kuelap · 모서리 없이 바람을 감싸 돌리는 원형 집)', insight: '날카롭게 각을 세워 부딪치기보다 둥글게 감싸 안는 태도가 거센 바람을 훨씬 잘 견딤', tone: '안데스 구름숲 능선 위 이끼 낀 석회암 성벽을 감싸 흐르는 하얀 운해' },
  { citadel: '구름의 전사(Cloud Warriors · 안개 너머를 먼저 내다보는 높은 시선)', insight: '당장 발밑의 안개에 시야가 가려도 한 걸음 높은 곳에서 전체 지형을 떠올리면 길이 보임', tone: '해발 삼천 미터 산마루 위로 서서히 걷히는 푸른 아침 안개' },
  { citadel: '고크타 폭포(Gocta · 두 단으로 떨어지며 숲 전체에 물안개를 채우는 흐름)', insight: '쉬지 않고 쏟아붓기보다 중간에 한 번 꺾여 숨을 고르는 마디가 있어야 멀리까지 적심', tone: '울창한 난초 숲 절벽을 타고 시원하게 떨어지는 하얀 물줄기' },
  { citadel: '다이아몬드 프리즈(Diamond Frieze · 돌담에 새긴 눈과 파도의 기하학)', insight: '반복되는 일상 속에서도 나만의 질서와 리듬을 새겨 두면 마음이 쉽게 흐트러지지 않음', tone: '고대 석벽 둘레를 따라 정갈하게 이어진 지그재그 돌 문양' },
  { citadel: '운무림의 난초(Cloud Orchid · 척박한 바위 위에서도 안개를 머금고 피는 꽃)', insight: '완벽한 토양이 주어지지 않아도 지금 내 주위의 작은 온기와 수분만으로 충분히 자람', tone: '안개 머금은 고목 가지 위에서 조용히 피어난 연보라빛 야생 난초' },
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

export function calculateChachapoyaCloudForestKuelap(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ChachapoyaKuelapResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % CITADELS.length;
  const picked = CITADELS[idx];

  return {
    engineVersion: 'LUCKEY-CHACHAPOYA-KUELAP-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    cloudCitadel: picked.citadel,
    kuelapInsight: picked.insight,
    andesCloudTone: picked.tone,
    reflectionFocus: `차차포야스 구름숲 지혜의 '${picked.citadel}'처럼, 날카롭게 각을 세우기보다 둥근 돌집처럼 바람을 흘려보내며 높은 시야를 되찾아 보세요.`,
    ritualAction: '오늘 부딪치는 의견이나 까다로운 상황 앞에서, 모서리를 세우기 전에 한 발 물러서서 전체 그림을 먼저 바라보세요.',
    reflectiveQuestion: '지금 발밑의 안개 때문에 답답해 보일 뿐, 구름숲 위에서 내려다본다면 전혀 다른 길로 보일 선택은 무엇인가요?',
    interpretiveBoundary: '안데스 북부 차차포야스(Chachapoyas) 쿠엘랍 원형 성채와 구름숲 생태 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatChachapoyaKuelapPrompt(res: ChachapoyaKuelapResult): string {
  return [
    `[차차포야스 구름숲·쿠엘랍 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 구름숲 상징: ${res.cloudCitadel} (${res.andesCloudTone})`,
    `- 중심 통찰: ${res.kuelapInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

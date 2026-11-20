import type { UserProfile } from '../sharedState';

export interface OccitanParatgeResult {
  engineVersion: string;
  calculatedAtKst: string;
  paratgeVirtue: string;
  troubadourInsight: string;
  languedocTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const VIRTUES = [
  { virtue: '파라트제(Paratge · 지위와 상관없는 대등한 존엄)', insight: '상대를 이기려 누르기보다 서로의 품위와 동등한 자리를 지켜 줄 때 비로소 깊어지는 관계', tone: '랑그독 언덕 위 하얀 석회암 성벽을 비추는 따뜻한 오후 햇살' },
  { virtue: '콘비벤시아(Convivència · 다름이 함께 숨 쉬는 공존)', insight: '나와 다른 생각이나 성향을 적으로 돌리지 않고 한 테이블 위에서 조화롭게 다루는 여유', tone: '툴루즈 안뜰 장미 덩굴 아래 나란히 놓인 두 개의 찻잔' },
  { virtue: '메주라(Mesura · 넘치지 않는 균형과 절제)', insight: '감정이 뜨거울수록 한 박자 늦춰 적절한 선을 지킬 때 내 말에 힘이 실리는 지혜', tone: '올리브 밭 사이로 잔잔히 부는 남프랑스 미스트랄의 끝자락' },
  { virtue: '조이(Joi · 삶을 긍정하는 맑은 기쁨)', insight: '무거운 책임감 속에서도 작은 아름다움과 유머를 잃지 않을 때 되살아나는 창의력', tone: '라벤더 들판 너머로 울려 퍼지는 트루바두르의 류트 선율' },
  { virtue: '프레츠(Pretz · 진정성에서 우러나는 참된 가치)', insight: '남에게 보이기 위한 과장이 아니라 보이지 않는 자리에서도 정성을 다하는 태도', tone: '오래된 양피지 노래책에 정성스레 그려진 금빛 첫 글자' },
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

export function calculateOccitanTroubadourParatge(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): OccitanParatgeResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % VIRTUES.length;
  const picked = VIRTUES[idx];

  return {
    engineVersion: 'LUCKEY-OCCITAN-PARATGE-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    paratgeVirtue: picked.virtue,
    troubadourInsight: picked.insight,
    languedocTone: picked.tone,
    reflectionFocus: `남프랑스 옥시타니아의 '${picked.virtue}'처럼, 나와 상대방 모두의 품위를 지키는 균형(Mesura)과 다정한 공존의 선을 찾아보세요.`,
    ritualAction: '오늘 대화에서 내 주장을 조금만 부드럽게 다듬어, 상대의 이야기가 들어올 빈자리 하나를 열어 두세요.',
    reflectiveQuestion: '지금 내가 지키고 있는 선 가운데 조금 더 유연하고 품위 있게(Paratge) 열 수 있는 부분은 어디인가요?',
    interpretiveBoundary: '남프랑스 옥시타니아 트루바두르의 파라트제(Paratge)·공존(Convivència) 문화를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatOccitanParatgePrompt(res: OccitanParatgeResult): string {
  return [
    `[옥시타니아 트루바두르 파라트제 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 핵심 미덕: ${res.paratgeVirtue} (${res.languedocTone})`,
    `- 중심 통찰: ${res.troubadourInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

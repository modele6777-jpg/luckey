import type { UserProfile } from '../sharedState';

export interface PortugueseSagresResult {
  engineVersion: string;
  calculatedAtKst: string;
  atlanticCompass: string;
  sagresInsight: string;
  atlanticTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const COMPASSES = [
  { compass: '사그레스 곶(Sagres · 미지의 대양 앞에서 지도를 그려 나가는 용기)', insight: '모든 답이 미리 정해져 있지 않아도 지금 가진 나침반과 기록을 믿고 한 마디씩 나아감', tone: '대서양의 거친 파도가 부딪치는 사그레스 절벽 위에서 바라보는 맑은 수평선' },
  { compass: '사우다데(Saudade · 지나간 시간에 대한 애틋함과 그리움의 온기)', insight: '과거를 후회로만 가두지 않고 소중했던 기억을 오늘의 다정함으로 데워 쓰는 마음', tone: '리스본 알파마 골목 돌바닥 위로 낮게 울려 퍼지는 열두 줄 포르투갈 기타 선율' },
  { compass: '아줄레주(Azulejo · 작은 타일 조각들이 모여 빚어내는 큰 그림)', insight: '하루하루의 사소한 조각들이 엉뚱해 보여도 차곡차곡 맞추다 보면 나만의 무늬가 완성됨', tone: '코발트빛 푸른 타일 벽면 위로 부드럽게 부서지는 오후의 햇빛' },
  { compass: '카라벨(Caravel · 역풍을 거슬러 지그재그로 나아가는 삼각돛)', insight: '바람이 정면으로 불어온다고 멈추기보다 각도를 틀어 한 걸음씩 전진하는 유연함', tone: '타구스 강 하구를 지나 푸른 대서양으로 미끄러져 나가는 하얀 삼각돛' },
  { compass: '데스코베르타(Descoberta · 익숙한 항구를 떠나 만나는 새로운 시선)', insight: '오래 머문 자리가 안전해 보여도 때로는 시야를 넓혀 다른 가능성을 시험해 보는 설렘', tone: '안개 걷힌 포르투의 다리 위로 불어오는 상쾌한 바닷바람' },
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

export function calculatePortugueseSaudadeSagresCompass(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): PortugueseSagresResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % COMPASSES.length;
  const picked = COMPASSES[idx];

  return {
    engineVersion: 'LUCKEY-PORTUGUESE-SAGRES-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    atlanticCompass: picked.compass,
    sagresInsight: picked.insight,
    atlanticTone: picked.tone,
    reflectionFocus: `포르투갈 대서양 지혜의 '${picked.compass}'처럼, 완벽한 지도가 없더라도 지금 내 손에 있는 작은 단서를 믿고 유연하게 각도를 틀어 보세요.`,
    ritualAction: '오늘 막혀 있던 문제 앞에서 정면으로만 밀어붙이지 말고, 카라벨의 삼각돛처럼 다른 각도의 우회로를 하나 떠올려 보세요.',
    reflectiveQuestion: '지금 내 앞의 역풍 앞에서 멈춰 서 있기보다, 각도를 조금 틀어 나아갈 수 있는 새로운 방향은 어디일까요?',
    interpretiveBoundary: '포르투갈 사그레스 항해 지혜·아줄레주·사우다데 정서를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatPortugueseSagresPrompt(res: PortugueseSagresResult): string {
  return [
    `[포르투갈 사우다데·사그레스 나침반 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 대서양 상징: ${res.atlanticCompass} (${res.atlanticTone})`,
    `- 중심 통찰: ${res.sagresInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

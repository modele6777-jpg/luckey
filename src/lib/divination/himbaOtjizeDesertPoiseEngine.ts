import type { UserProfile } from '../sharedState';

export interface HimbaOtjizeResult {
  engineVersion: string;
  calculatedAtKst: string;
  himbaMotif: string;
  himbaInsight: string;
  desertTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '붉은 오트지제의 보호막(Otjize Ochre · 적토와 향유를 발라 뜨거운 사막의 햇빛과 건조함을 견딤)', insight: '거친 환경에 맞서 자신을 지키기 위해서는 날마다 나를 돌보고 보호하는 나만의 의식이 필요함', tone: '나미비아 카오코랜드의 붉은 대지 위로 이른 아침 햇살이 따뜻하게 번지는 들판' },
  { motif: '오쿠루오의 꺼지지 않는 불(Okuruwo Hearth · 가족과 조상의 기억이 이어지는 중앙의 묵묵한 불씨)', insight: '삶이 분주해질수록 나를 지탱해 온 뿌리와 소중한 사람들과의 연결을 잊지 말아야 함', tone: '마른 아카시아 나무 장작이 재 속에서 은은한 온기를 오래 간직하고 있는 저녁' },
  { motif: '모래 강바닥의 숨은 물줄기(Ephemeral Riverbed · 겉은 마른 모래지만 조금만 파면 맑은 물이 흐름)', insight: '겉보기에 성과나 진전이 없는 시기에도 땅속에서는 조용히 다음 계절을 위한 물줄기가 흐르고 있음', tone: '하얀 모래 강바닥을 따라 초록빛 모파네 나무들이 줄지어 서 있는 고요한 오후' },
  { motif: '소 떼를 부르는 고유의 가락(Cattle Song · 각자의 이름과 걸음걸이를 기억해 부르는 다정한 노래)', insight: '해야 할 일들을 한꺼번에 몰아치기보다 하나하나 이름을 불러 주듯 차분히 대할 때 덜 지침', tone: '해 질 녘 붉은 먼지 사이로 차분하고 낮은 노랫소리가 바람을 타고 퍼지는 마을' },
  { motif: '에렘베 왕관의 위엄(Erembe Crest · 묵묵한 인내와 성숙이 쌓여 자연스럽게 갖추어지는 품위)', insight: '조급하게 자신을 증명하려 애쓰지 않아도, 하루하루를 성실히 건너면 그 품위가 저절로 드러남', tone: '넓은 사바나 지평선 너머로 황금빛 구름이 천천히 물러가는 고요한 황혼' },
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

export function calculateHimbaOtjizeDesertPoise(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): HimbaOtjizeResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-HIMBA-OTJIZE-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    himbaMotif: picked.motif,
    himbaInsight: picked.insight,
    desertTone: picked.tone,
    reflectionFocus: `힘바 오트지제의 '${picked.motif}'처럼, 겉으로 성과가 드러나지 않는 날에도 나를 지키는 돌봄의 의식과 숨은 물줄기를 믿어 보세요.`,
    ritualAction: '오늘 스스로를 지키는 작은 돌봄(물 한 잔, 보습, 짧은 스트레칭)을 의식적으로 챙겨 보세요.',
    reflectiveQuestion: '지금 겉으로는 마른 모래처럼 보이지만, 내 안에서 조용히 흐르고 있는 숨은 물줄기는 무엇인가요?',
    interpretiveBoundary: '나미비아 힘바족의 오트지제 돌봄·오쿠루오 기억 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatHimbaOtjizePrompt(res: HimbaOtjizeResult): string {
  return [
    `[나미비아 힘바·오트지제 적토 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 힘바 모티프: ${res.himbaMotif} (${res.desertTone})`,
    `- 중심 통찰: ${res.himbaInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

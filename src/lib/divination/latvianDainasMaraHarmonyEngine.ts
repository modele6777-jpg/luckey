import type { UserProfile } from '../sharedState';

export interface LatvianDainasResult {
  engineVersion: string;
  calculatedAtKst: string;
  dainasMotif: string;
  maraInsight: string;
  balticTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '라이마(Laima · 삶의 실을 잣는 차분한 리듬)', insight: '서두르지 않고 하루의 마디마디를 정성껏 이어 갈 때 내 몫의 길이 자연스럽게 엮임', tone: '다우가바 강물 위로 잔잔히 퍼지는 라트비아 여름 아침의 안개' },
  { motif: '마라(Māra · 대지의 품과 몸의 돌봄)', insight: '거창한 성취보다 오늘 내 몸과 일상을 따뜻하게 먹이고 쉬게 하는 기본이 모든 힘의 뿌리임', tone: '자작나무 숲길에서 불어오는 맑고 서늘한 발트 해안의 숨결' },
  { motif: '사울레(Saule · 사계절을 돌며 비추는 햇빛)', insight: '어두운 겨울밤에도 빛이 다시 돌아오는 순환을 믿으며 내면의 온기를 잃지 않음', tone: '호박(Amber) 보석처럼 따뜻하게 빛나는 저녁 노을빛' },
  { motif: '다이나스 4행시(Dainas · 짧은 노래에 담긴 생활의 지혜)', insight: '긴 설교보다 일상의 작은 장면을 담은 짧은 한 마디가 마음을 오래 붙들어 줌', tone: '리예(Līgo) 하지 축제 밤, 모닥불 주위에서 나지막이 이어지는 합창' },
  { motif: '오졸스(Ozols · 뿌리 깊은 참나무의 고요)', insight: '주변 바람이 거셀수록 가지를 흔들기보다 땅속 깊은 뿌리에 조용히 힘을 모으는 지혜', tone: '오랜 세월 마을 언덕을 지켜온 묵직한 참나무 그늘' },
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

export function calculateLatvianDainasMaraHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): LatvianDainasResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-LATVIAN-DAINAS-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    dainasMotif: picked.motif,
    maraInsight: picked.insight,
    balticTone: picked.tone,
    reflectionFocus: `라트비아 다이나스 전통의 '${picked.motif}'처럼, 거창한 해답보다 오늘 내 일상의 작은 리듬과 몸의 감각을 정성껏 돌보아 보세요.`,
    ritualAction: '오늘 하루를 마감하기 전, 내 마음을 가장 편안하게 해 준 작은 순간 하나를 한 줄로 적어 보세요.',
    reflectiveQuestion: '지금 내가 너무 멀리만 내다보느라 놓치고 있는, 오늘 일상의 소박한 리듬과 돌봄은 무엇인가요?',
    interpretiveBoundary: '발트 라트비아의 전통 구전 시가 다이나스(Dainas)와 자연 순환 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatLatvianDainasPrompt(res: LatvianDainasResult): string {
  return [
    `[라트비아 다이나스·마라 조화 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 다이나스 상징: ${res.dainasMotif} (${res.balticTone})`,
    `- 중심 통찰: ${res.maraInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

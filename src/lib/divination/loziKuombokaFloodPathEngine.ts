import type { UserProfile } from '../sharedState';

export interface LoziKuombokaResult {
  engineVersion: string;
  calculatedAtKst: string;
  loziMotif: string;
  loziInsight: string;
  zambeziTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '물길에 맞춘 고지대 이동(Kuomboka · 강물이 차오르면 싸우지 않고 배를 띄워 높은 터로 옮김)', insight: '환경의 수위가 바뀔 때 옛 자리를 억지로 지키려 하기보다 물길을 타고 더 안전하고 높은 곳으로 옮겨야 함', tone: '잠비아 바로체 범람원 위로 아침 햇살이 퍼지며 하얀 바지선 나리콰니가 물길을 여는 풍경' },
  { motif: '마옴바 북소리의 신호(Maoma Drum · 이동할 때가 되었음을 알리는 낮고 웅장한 북소리)', insight: '전환이 필요한 시점에는 혼자 머뭇거리지 말고 내 안에서 울리는 신호를 인정하고 출발해야 함', tone: '드넓은 강물 위로 일정하고 묵직한 북소리가 물결을 타고 멀리까지 퍼져 나가는 오전' },
  { motif: '범람이 남긴 기름진 흙(Floodplain Silt · 물이 빠진 자리마다 새 씨앗이 자랄 비옥한 땅이 남음)', insight: '지나간 위기나 큰 변화가 휩쓸고 간 자리에도, 잘 살펴보면 다음 계절을 키울 기름진 양분이 남아 있음', tone: '물이 천천히 물러간 초원 위로 푸른 새싹이 돋아나기 시작하는 따스한 낮' },
  { motif: '함께 젓는 노의 박자(Paddlers in Unison · 수십 명의 노 젓는 이들이 한 호흡으로 배를 움직임)', insight: '큰 전환기를 건널 때는 혼자 힘으로 버티기보다 곁에 있는 이들과 박자를 맞추는 편이 훨씬 수월함', tone: '검은 줄무늬와 흰 줄무늬가 새겨진 긴 배 위로 노들이 물보라를 일으키며 나아가는 오후' },
  { motif: '고지대 리물룽가의 휴식(Limulunga Rest · 새 터에 닿은 뒤 짐을 풀고 감사하며 숨을 고름)', insight: '어려운 이동을 무사히 마쳤다면 곧바로 다음 짐을 꾸리기 전에 도착한 자리에서 충분히 숨을 돌려야 함', tone: '높은 언덕 위 마을에 저녁 불빛이 켜지고 잔잔한 노래가 흐르는 평온한 황혼' },
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

export function calculateLoziKuombokaFloodPath(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): LoziKuombokaResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-LOZI-KUOMBOKA-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    loziMotif: picked.motif,
    loziInsight: picked.insight,
    zambeziTone: picked.tone,
    reflectionFocus: `로지족 쿠옴보카의 '${picked.motif}'처럼, 계절과 수위가 바뀔 때 옛 자리를 억지로 붙들기보다 물길을 타고 새 터로 옮겨 보세요.`,
    ritualAction: '이미 상황이 달라졌는데도 관성으로 붙들고 있던 방식 하나를 오늘 과감히 더 높은 자리로 옮겨 보세요.',
    reflectiveQuestion: '수위가 이미 차올랐는데도 내가 여전히 물과 싸우며 버티고 있는 낡은 터는 어디인가요?',
    interpretiveBoundary: '잠비아 바로체 범람원 로지족의 쿠옴보카 물길 이동 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatLoziKuombokaPrompt(res: LoziKuombokaResult): string {
  return [
    `[로지·쿠옴보카 물길 이동 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 쿠옴보카 모티프: ${res.loziMotif} (${res.zambeziTone})`,
    `- 중심 통찰: ${res.loziInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

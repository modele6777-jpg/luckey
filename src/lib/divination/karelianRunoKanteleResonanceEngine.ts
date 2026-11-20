import type { UserProfile } from '../sharedState';

export interface KarelianRunoResult {
  engineVersion: string;
  calculatedAtKst: string;
  runoMotif: string;
  kanteleInsight: string;
  forestLakeTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '칸텔레 다섯 현(Kantele · 소박한 다섯 줄이 만드는 맑은 울림)', insight: '수많은 도구를 갖추지 않아도 내 손에 있는 몇 가지 진실한 요소만으로 충분한 울림을 냄', tone: '카렐리야 자작나무 호숫가에 잔잔히 번지는 맑은 현악기 여운' },
  { motif: '루노 두 손 맞잡기(Runolaulu · 주거니 받거니 이어지는 호흡)', insight: '혼자 독백하듯 몰아붙이기보다 상대의 말을 받아 한 박자 쉬어 갈 때 노래가 완성됨', tone: '긴 겨울밤 난로가에서 마주 앉아 손을 맞잡고 나지막이 읊조리는 시가' },
  { motif: '라우루마아(Laulumaa · 말과 노래로 다독이는 마음의 땅)', insight: '거친 감정을 억누르기보다 솔직한 말로 꺼내어 다독일 때 마음의 엉킴이 풀림', tone: '고운 모래사장과 맑은 소나무 숲이 이어진 라도가 호수 북안의 정적' },
  { motif: '이키푸(Ikipuu · 세월을 견딘 오래된 소나무의 결)', insight: '빠르게 뻗어 나간 가지보다 느리더라도 치밀하게 나이테를 쌓은 마음이 오래 감', tone: '북방의 추위를 이기고 곧게 자란 붉은 소나무의 단단한 결' },
  { motif: '아아무카스테(Aamukaste · 새벽 이슬에 씻긴 맑은 시선)', insight: '어제의 묵은 피로를 오늘까지 끌고 오지 않고 새벽 공기처럼 산뜻하게 다시 시작함', tone: '동틀 무렵 호수 위 물안개가 걷히며 드러나는 투명한 하늘빛' },
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

export function calculateKarelianRunoKanteleResonance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): KarelianRunoResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-KARELIAN-KANTELE-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    runoMotif: picked.motif,
    kanteleInsight: picked.insight,
    forestLakeTone: picked.tone,
    reflectionFocus: `카렐리야 루노·칸텔레 전통의 '${picked.motif}'처럼, 복잡한 꾸밈을 덜어내고 내 마음에 남은 진실한 다섯 줄의 울림에 귀를 기울여 보세요.`,
    ritualAction: '오늘 5분만 소음을 끄고, 지금 내 마음이 실제로 바라는 가장 소박한 소리 하나를 들어 보세요.',
    reflectiveQuestion: '지금 내가 수많은 조건을 더 채우려 애쓰기보다, 이미 내 손에 있는 소박한 요소로 맑은 울림을 낸다면 무엇일까요?',
    interpretiveBoundary: '카렐리야(Karelia)의 루노(Runo) 구전 시가·칸텔레(Kantele) 공명 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatKarelianRunoPrompt(res: KarelianRunoResult): string {
  return [
    `[카렐리야 루노·칸텔레 공명 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 루노 상징: ${res.runoMotif} (${res.forestLakeTone})`,
    `- 중심 통찰: ${res.kanteleInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

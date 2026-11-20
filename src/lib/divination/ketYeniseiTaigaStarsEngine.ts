import type { UserProfile } from '../sharedState';

export interface KetYeniseiResult {
  engineVersion: string;
  calculatedAtKst: string;
  riverStarSign: string;
  yeniseiInsight: string;
  taigaTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SIGNS = [
  { sign: '예니세이의 긴 물길(Yenisei · 서두르지 않고 대륙을 가로질러 북극으로 가는 강)', insight: '오늘 당장 결판이 나지 않아도 큰 방향만 맞다면 시간은 내 편에서 묵묵히 흘러감', tone: '시베리아 타이가 침엽수림 사이로 넓고 깊게 흐르는 은빛 대하' },
  { sign: '일라임(Ilim · 별빛 아래 썰매와 길의 흔적을 읽는 맑은 시선)', insight: '어두워 보일수록 시야를 넓히기보다 지금 내 발앞의 선명한 흔적 하나에 집중하는 편이 정확함', tone: '눈 덮인 자작나무 숲 위로 차갑고 투명하게 빛나는 북방의 별자리' },
  { sign: '일룸(Ilum · 사계절의 순환을 거스르지 않는 숲의 호흡)', insight: '움츠려야 할 겨울과 뻗어 나가야 할 여름이 다르듯 지금 내 계절에 맞는 일만 해도 충분함', tone: '이른 봄 얼음이 풀리며 물소리가 되살아나는 고요한 숲속 지류' },
  { sign: '카스(Kas · 작지만 마르지 않는 맑은 곁가지 물줄기)', insight: '거대한 무대의 중심이 아니더라도 내 자리의 맑은 역할을 지키면 전체 흐름에 기여함', tone: '이끼 낀 바위 사이를 돌아 본류로 합류하는 투명한 산간 개울' },
  { sign: '샤먼의 자작나무 북(Birch Drum · 흩어진 마음을 한 박자로 모으는 울림)', insight: '잡념이 많을 때는 머리로 따지기보다 일정한 호흡과 박자로 마음을 먼저 가라앉혀야 함', tone: '모닥불 온기가 감도는 밤, 나지막하고 규칙적으로 울리는 나무 소리' },
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

export function calculateKetYeniseiTaigaStars(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): KetYeniseiResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % SIGNS.length;
  const picked = SIGNS[idx];

  return {
    engineVersion: 'LUCKEY-KET-YENISEI-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    riverStarSign: picked.sign,
    yeniseiInsight: picked.insight,
    taigaTone: picked.tone,
    reflectionFocus: `예니세이·케트 타이가 지혜의 '${picked.sign}'처럼, 오늘 당장 모든 답을 재촉하기보다 큰 물길의 방향과 지금 내 계절을 차분히 살피세요.`,
    ritualAction: '오늘 잡념이 길어질 때, 3분만 눈을 감고 일정한 숨 박자에 귀를 기울이며 마음을 가라앉혀 보세요.',
    reflectiveQuestion: '지금 내가 조급히 결판을 내려고 애쓰고 있지만, 예니세이 강처럼 시간을 두면 자연히 제 길을 찾아갈 일은 무엇인가요?',
    interpretiveBoundary: '시베리아 예니세이 유역 케트(Ket) 전통의 타이가 별빛·강물 순환 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatKetYeniseiPrompt(res: KetYeniseiResult): string {
  return [
    `[예니세이 케트·타이가 별하늘 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 북방 징표: ${res.riverStarSign} (${res.taigaTone})`,
    `- 중심 통찰: ${res.yeniseiInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

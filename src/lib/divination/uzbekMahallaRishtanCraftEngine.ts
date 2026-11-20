import type { UserProfile } from '../sharedState';

export interface UzbekMahallaResult {
  engineVersion: string;
  calculatedAtKst: string;
  mahallaVirtue: string;
  rishtanInsight: string;
  ferganaTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const VIRTUES = [
  { virtue: '마할라의 이웃 온기(Mahalla · 담장을 낮추고 안부를 묻는 연대)', insight: '큰 해결책보다 곁의 사람과 주고받는 소박한 안부 한 마디가 마음을 든든하게 지탱함', tone: '플라타너스(Chinar) 나무 그늘 아래 차이하나(Choyxona)에서 피어오르는 녹차 향' },
  { virtue: '리시탄 청자(Rishtan · 불을 견디며 깊어지는 코발트빛 유약)', insight: '까다로운 시간과 기다림을 통과할수록 내면의 빛깔이 더 맑고 단단해짐', tone: '페르가나 분지의 맑은 석영 유약이 가마 속에서 빚어낸 깊은 청록빛' },
  { virtue: '메흐몬도스트릭(Mehmondoʻstlik · 기꺼이 자리를 내어주는 환대)', insight: '내 마음의 공간에 여유가 있을 때 낯선 기회와 좋은 인연도 편하게 머무를 수 있음', tone: '따뜻하게 구워 낸 논(Non) 빵을 여럿이 나누어 떼어 먹는 소박한 식탁' },
  { virtue: '우스타즈·쇼기르드(Ustoz-Shogird · 손끝으로 이어지는 정성)', insight: '서두름 없이 한 단계씩 배움과 정성을 쌓아 올릴 때 실력이 몸에 배어듦', tone: '물레 위에서 천천히 형태를 잡는 도공의 고요하고 일정한 손놀림' },
  { virtue: '하샤르(Hashar · 여럿이 힘을 모아 한 번에 빚는 기쁨)', insight: '혼자 끌고가려 하면 막막하던 일도 마음을 맞추면 가볍고 즐겁게 풀림', tone: '오후 햇살 아래 마당을 함께 정리하며 나누는 담백한 웃음소리' },
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

export function calculateUzbekMahallaRishtanCraft(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): UzbekMahallaResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % VIRTUES.length;
  const picked = VIRTUES[idx];

  return {
    engineVersion: 'LUCKEY-UZBEK-MAHALLA-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    mahallaVirtue: picked.virtue,
    rishtanInsight: picked.insight,
    ferganaTone: picked.tone,
    reflectionFocus: `우즈베크 마할라·리시탄 전통의 '${picked.virtue}'처럼, 서두르지 않고 정성을 들이는 손길과 곁의 온기 속에서 마음의 넉넉함을 회복해 보세요.`,
    ritualAction: '오늘 가까운 사람에게 가벼운 안부 한 마디를 건네거나, 지금 손에 쥔 일을 한 호흡 천천히 정성껏 마무리해 보세요.',
    reflectiveQuestion: '지금 내가 조급하게 결과를 재촉하느라 놓치고 있는, 과정 속의 정성과 곁의 온기는 무엇인가요?',
    interpretiveBoundary: '우즈베키스탄의 마할라(Mahalla) 공동체 윤리와 리시탄(Rishtan) 도예 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatUzbekMahallaPrompt(res: UzbekMahallaResult): string {
  return [
    `[우즈베크 마할라·리시탄 도기 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 생활 지혜: ${res.mahallaVirtue} (${res.ferganaTone})`,
    `- 중심 통찰: ${res.rishtanInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

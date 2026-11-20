import type { UserProfile } from '../sharedState';

export interface LydianSardisResult {
  engineVersion: string;
  calculatedAtKst: string;
  electrumSign: string;
  lydianInsight: string;
  sardisTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SIGNS = [
  { sign: '호박금의 배합(Electrum · 금의 강직함과 은의 유연함이 섞여 제 값을 냄)', insight: '한 가지 성질만 고집하기보다 단단함과 부드러움이 적절한 비율로 만날 때 오래 쓰임', tone: '사르디스 주화소 모루 위에서 은은한 옅은 금빛을 내며 둥글게 찍혀 나온 일렉트럼 주화' },
  { sign: '팍톨로스 강의 모래(Pactolus River · 씻겨 내려간 뒤에야 드러나는 진짜 가치)', insight: '급히 흙을 파헤치지 않아도 맑은 물이 지나가고 나면 남는 것이 결국 본래의 알갱이임', tone: '트몰로스 산기슭에서 사르디스 평원으로 흐르며 모래 사이에 반짝임을 남기는 강물' },
  { sign: '크로이소스의 저울(Touchstone · 크기가 아니라 순도와 결로 무게를 달아 봄)', insight: '외부의 큰 숫자나 과장된 소문보다 내 마음이 실제로 편안하고 떳떳한지가 진짜 기준임', tone: '검은 시금석 위에 조심스레 그어 보는 가느다랗고 선명한 금빛 선' },
  { sign: '아크로폴리스의 바위(Sardis Citadel · 높은 곳에서도 물길을 먼저 살피는 경계심)', insight: '잘 풀리고 높게 올라섰다고 방심하기보다 보이지 않는 틈새와 기본기를 먼저 돌아봐야 함', tone: '헤르모스 계곡을 내려다보는 사르디스의 가파르고 붉은 역암 절벽' },
  { sign: '아고라의 첫 거래(Fair Exchange · 서로의 몫이 분명할 때 신뢰가 오래감)', insight: '좋은 마음으로 시작한 일이라도 내가 감당할 선과 상대의 몫을 먼저 분명히 해야 탈이 없음', tone: '기둥 회랑 아래서 상인들이 공정한 추를 올려놓고 고개를 끄덕이는 활기찬 시장' },
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

export function calculateLydianSardisElectrumBalance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): LydianSardisResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % SIGNS.length;
  const picked = SIGNS[idx];

  return {
    engineVersion: 'LUCKEY-LYDIAN-SARDIS-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    electrumSign: picked.sign,
    lydianInsight: picked.insight,
    sardisTone: picked.tone,
    reflectionFocus: `고대 리디아·사르디스 지혜의 '${picked.sign}'처럼, 한쪽 성질에 치우치지 않고 강함과 부드러움의 균형과 나만의 시금석을 점검해 보세요.`,
    ritualAction: '오늘 내 시간이나 에너지를 쓸 일 하나를 골라, "내가 기꺼이 감당할 수 있는 공정한 몫"이 어디까지인지 선을 그어 보세요.',
    reflectiveQuestion: '지금 내가 겉의 크기나 속도에 눈이 가려 놓치고 있는, 시금석처럼 진짜 가치를 가려내는 기준은 무엇인가요?',
    interpretiveBoundary: '고대 아나톨리아 리디아(Lydia) 사르디스의 호박금 균형·팍톨로스 강 비유를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatLydianSardisPrompt(res: LydianSardisResult): string {
  return [
    `[리디아 사르디스·호박금 균형 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 사르디스 징표: ${res.electrumSign} (${res.sardisTone})`,
    `- 중심 통찰: ${res.lydianInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

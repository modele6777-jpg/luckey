import type { UserProfile } from '../sharedState';

export interface SanKalahariResult {
  engineVersion: string;
  calculatedAtKst: string;
  desertSign: string;
  sanInsight: string;
  kalahariTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SIGNS = [
  { sign: '모래 위의 발자국(Spoor Reading · 작고 흐릿한 흔적에서 전체 흐름을 읽음)', insight: '커다란 사건이 터진 뒤에 움직이기보다, 일상 속 작고 조용한 징후를 먼저 알아채는 눈이 중요함', tone: '칼라하리 모래 언덕 위로 아침 햇살이 비스듬히 내리며 선명해지는 작은 발자국들' },
  { sign: '땅속의 멜론 뿌리(Tsamma · 마른 땅 아래서 수분을 품고 버티는 지혜)', insight: '겉으로 아무것도 보이지 않는 시기에도 내면에서는 다음 걸음을 위한 수분이 조용히 고여 감', tone: '붉은 모래 아래서 맑은 물기를 머금고 자라는 사막 덩굴의 단단한 뿌리' },
  { sign: '트랜스 춤의 불씨(Healing Dance · 혼자의 짐을 공동체의 리듬으로 녹여 냄)', insight: '마음이 무거울수록 혼자 방 안에 가두지 말고 믿을 수 있는 온기와 리듬 곁으로 나와야 함', tone: '밤하늘 은하수 아래 모닥불을 둘러싸고 울려 퍼지는 경쾌한 손뼉과 노래' },
  { sign: '기다림의 화살(Quiet Stalk · 성급히 시위를 당기지 않고 숨을 고르는 순간)', insight: '지금 당장 결론을 내지 못한다고 해서 멈춘 것이 아니라, 가장 정확한 타이밍을 재고 있는 것임', tone: '아카시아 풀숲 뒤에서 바람 방향과 그림자를 가만히 살피는 차분한 시선' },
  { sign: '은하수의 뼈대(Backbone of the Night · 어두울수록 더 또렷이 보이는 길잡이)', insight: '주변이 어둡고 막막할수록 오히려 무엇이 내 진짜 북극성인지 선명하게 드러남', tone: '불빛 없는 칼라하리의 밤하늘을 가로지르는 하얗고 촘촘한 별빛의 강' },
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

export function calculateSanKalahariTrackingStars(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SanKalahariResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % SIGNS.length;
  const picked = SIGNS[idx];

  return {
    engineVersion: 'LUCKEY-SAN-KALAHARI-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    desertSign: picked.sign,
    sanInsight: picked.insight,
    kalahariTone: picked.tone,
    reflectionFocus: `칼라하리 산(San) 지혜의 '${picked.sign}'처럼, 큰 소음이 아니라 모래 위의 작은 발자국과 내면의 조용한 신호를 먼저 읽어 보세요.`,
    ritualAction: '오늘 내 기분이나 몸이 보내는 아주 작은 피곤함·설렘의 신호 하나를 놓치지 말고 그대로 인정해 주세요.',
    reflectiveQuestion: '지금 내 일상에서 큰 사건은 아니지만, 모래 위의 발자국처럼 분명히 방향을 가리키고 있는 작은 징후는 무엇인가요?',
    interpretiveBoundary: '남아프리카 칼라하리 산(San) 전통의 발자국 추적 직관·은하수 길잡이 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatSanKalahariPrompt(res: SanKalahariResult): string {
  return [
    `[칼라하리 산·별과 추적 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 사막의 징후: ${res.desertSign} (${res.kalahariTone})`,
    `- 중심 통찰: ${res.sanInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

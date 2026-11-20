import type { UserProfile } from '../sharedState';

export interface PhrygianGordianResult {
  engineVersion: string;
  calculatedAtKst: string;
  anatolianSymbol: string;
  phrygianInsight: string;
  gordianTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SYMBOLS = [
  { symbol: '고르디온의 매듭(Gordian Knot · 꼬인 실타래를 힘으로 당기기보다 결을 끊어 맑게 함)', insight: '더 복잡하게 분석할수록 엉키는 문제는 오히려 기준을 하나 내려놓는 결단으로 풀림', tone: '아나톨리아 고원 바람 속에서 수레 멍에를 단단히 묶고 있던 굵은 밧줄' },
  { symbol: '산가리우스 강물(Sangarius · 황금의 집착을 씻어 내고 본래의 물길로 돌아감)', insight: '손에 쥔 것이 무거워서 지칠 때는 더 많이 쥐려 하기보다 강물에 씻어 내려놓는 편이 자유로움', tone: '고대 프리지아 평원을 굽이쳐 흐르며 햇빛을 반사하는 맑고 시원한 강물' },
  { symbol: '미다스의 갈대숲(Whispering Reeds · 억지로 감춘 진실보다 바람에 실어 보내는 가벼움)', insight: '혼자 속으로만 꾹꾹 눌러 담은 말은 언젠가 무게가 되니, 안전한 자리에 가볍게 털어놓아야 함', tone: '강가 바람이 불 때마다 서걱이며 서로의 소식을 나누는 푸른 갈대밭' },
  { symbol: '키벨레의 돌기둥(Cybele · 대지 위에 흔들림 없이 세워진 묵직한 중심)', insight: '바깥의 평가가 시끄러울수록 내가 발을 딛고 선 대지의 감각으로 돌아오면 흔들리지 않음', tone: '붉은 바위 언덕 위에서 오랜 세월 비바람을 견딘 단단한 석조 제단' },
  { symbol: '프리지아의 모자이크(Pebble Mosaic · 크고 작은 조약돌을 맞춰 하나의 무늬를 이룸)', insight: '완벽한 대리석 한 장을 기다리기보다 지금 손에 있는 작은 조각들로도 충분히 아름다운 그림이 됨', tone: '강가에서 모은 흰 돌과 검은 돌이 정갈하게 맞춰진 고대 바닥 무늬' },
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

export function calculatePhrygianGordianKnotClarity(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): PhrygianGordianResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % SYMBOLS.length;
  const picked = SYMBOLS[idx];

  return {
    engineVersion: 'LUCKEY-PHRYGIAN-GORDIAN-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    anatolianSymbol: picked.symbol,
    phrygianInsight: picked.insight,
    gordianTone: picked.tone,
    reflectionFocus: `고대 프리지아·고르디온 지혜의 '${picked.symbol}'처럼, 자꾸만 꼬이는 매듭을 억지로 당기지 말고 문제를 단순하게 만드는 한 번의 결단을 내려 보세요.`,
    ritualAction: '오늘 나를 가장 얽매이게 하는 고민 하나를 골라, "지금 당장 안 해도 되는 조건" 하나를 과감히 지워 보세요.',
    reflectiveQuestion: '지금 내가 끝을 찾아 풀려다가 더 꽉 조이고 있는 매듭 중에서, 아예 판을 새로 고르듯 단순화할 수 있는 것은 무엇인가요?',
    interpretiveBoundary: '고대 아나톨리아 프리지아(Phrygia)의 고르디온 매듭·산가리우스 강 비움 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatPhrygianGordianPrompt(res: PhrygianGordianResult): string {
  return [
    `[프리지아 고르디온·명쾌한 결단 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 아나톨리아 상징: ${res.anatolianSymbol} (${res.gordianTone})`,
    `- 중심 통찰: ${res.phrygianInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

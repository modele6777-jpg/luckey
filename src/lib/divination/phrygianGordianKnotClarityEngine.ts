import type { UserProfile } from '../sharedState';

export interface PhrygianGordianResult {
  engineVersion: string;
  calculatedAtKst: string;
  anatolianSymbol: string;
  companionSymbol: string;
  phrygianInsight: string;
  gordianTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SYMBOLS = [
  {
    symbol: '고르디온의 매듭(Gordian Knot · 꼬인 실타래를 힘으로 당기기보다 결을 끊어 맑게 함)',
    insight: '더 복잡하게 분석할수록 엉키는 문제는 오히려 기준을 하나 내려놓는 결단으로 풀림',
    tone: '아나톨리아 고원 바람 속에서 수레 멍에를 단단히 묶고 있던 굵은 밧줄',
    action: '오늘 나를 가장 얽매이게 하는 고민 하나를 골라, "지금 당장 안 해도 되는 조건" 하나를 과감히 지워 보세요.',
    question: '지금 내가 끝을 찾아 풀려다가 더 꽉 조이고 있는 매듭 중에서, 아예 판을 새로 고르듯 단순화할 수 있는 것은 무엇인가요?',
  },
  {
    symbol: '산가리우스 강물(Sangarius · 황금의 집착을 씻어 내고 본래의 물길로 돌아감)',
    insight: '손에 쥔 것이 무거워서 지칠 때는 더 많이 쥐려 하기보다 강물에 씻어 내려놓는 편이 자유로움',
    tone: '고대 프리지아 평원을 굽이쳐 흐르며 햇빛을 반사하는 맑고 시원한 강물',
    action: '오늘 이미 지나간 일에 대한 미련이나 과한 욕심 하나를 종이에 적고, 마음의 강물에 흘려보내듯 접어 두세요.',
    question: '손에 더 쥐려 할수록 나를 무겁게 만들 뿐, 강물에 씻어 내려놓으면 오히려 자유로워질 집착은 무엇인가요?',
  },
  {
    symbol: '미다스의 갈대숲(Whispering Reeds · 억지로 감춘 진실보다 바람에 실어 보내는 가벼움)',
    insight: '혼자 속으로만 꾹꾹 눌러 담은 말은 언젠가 무게가 되니, 안전한 자리에 가볍게 털어놓아야 함',
    tone: '강가 바람이 불 때마다 서걱이며 서로의 소식을 나누는 푸른 갈대밭',
    action: '혼자만 꾹 누르고 있던 생각 한 줄을 믿을 수 있는 대화 상대나 개인 노트에 솔직히 풀어내 보세요.',
    question: '속으로만 삼키느라 무거워졌지만, 안전한 자리에 가볍게 꺼내어 놓으면 한결 숨통이 트일 진심은 무엇인가요?',
  },
  {
    symbol: '키벨레의 돌기둥(Cybele · 대지 위에 흔들림 없이 세워진 묵직한 중심)',
    insight: '바깥의 평가가 시끄러울수록 내가 발을 딛고 선 대지의 감각으로 돌아오면 흔들리지 않음',
    tone: '붉은 바위 언덕 위에서 오랜 세월 비바람을 견딘 단단한 석조 제단',
    action: '타인의 반응에 마음이 흔들릴 때 두 발을 바닥에 단단히 딛고 1분간 깊은 호흡으로 내 중심으로 돌아오세요.',
    question: '바깥의 소리가 시끄러울 때도 내가 발을 딛고 선 자리로 돌아오면 결코 흔들리지 않을 중심 기둥은 무엇인가요?',
  },
  {
    symbol: '프리지아의 모자이크(Pebble Mosaic · 크고 작은 조약돌을 맞춰 하나의 무늬를 이룸)',
    insight: '완벽한 대리석 한 장을 기다리기보다 지금 손에 있는 작은 조각들로도 충분히 아름다운 그림이 됨',
    tone: '강가에서 모은 흰 돌과 검은 돌이 정갈하게 맞춰진 고대 바닥 무늬',
    action: '완벽한 조건을 기다리며 미뤄 둔 일 하나를 지금 손에 있는 재료만으로 작은 첫 조각부터 맞춰 보세요.',
    question: '완벽한 대리석 한 장을 기다리느라 멈춰 있기보다, 지금 가진 조약돌들로 먼저 무늬를 놓아 볼 일은 무엇인가요?',
  },
];

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 16).replace('T', ' ')} +09:00 (KST)`;
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
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (SYMBOLS.length - 1));
  const companion = SYMBOLS[(idx + companionOffset) % SYMBOLS.length];

  return {
    engineVersion: 'LUCKEY-PHRYGIAN-GORDIAN-v2.2.0',
    calculatedAtKst: formatKstIso(now),
    anatolianSymbol: picked.symbol,
    companionSymbol: companion.symbol,
    phrygianInsight: picked.insight,
    gordianTone: picked.tone,
    reflectionFocus: `고대 프리지아·고르디온 지혜의 '${picked.symbol}'을 중심에 두고 '${companion.symbol}'의 결을 곁들여, 자꾸만 꼬이는 매듭을 억지로 당기지 말고 문제를 단순하게 만드는 한 번의 결단을 내려 보세요.`,
    ritualAction: picked.action,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '고대 아나톨리아 프리지아(Phrygia)의 고르디온 매듭·산가리우스 강 비움 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatPhrygianGordianPrompt(res: PhrygianGordianResult): string {
  return [
    `[프리지아 고르디온·명쾌한 결단 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 아나톨리아 상징: ${res.anatolianSymbol} (${res.gordianTone})`,
    `- 동반 상징: ${res.companionSymbol}`,
    `- 중심 통찰: ${res.phrygianInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

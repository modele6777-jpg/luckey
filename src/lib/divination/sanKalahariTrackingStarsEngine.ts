import type { UserProfile } from '../sharedState';

export interface SanKalahariResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '징후·발자국' | '내면·뿌리' | '연대·불씨' | '기다림·타이밍' | '기준·은하수' | '칼라하리 전반';
  desertSign: string;
  companionSign: string;
  kalahariTrackAxis: string;
  sanInsight: string;
  kalahariTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SIGNS = [
  {
    sign: '모래 위의 발자국(Spoor Reading · 작고 흐릿한 흔적에서 전체 흐름을 읽음)',
    insight: '커다란 사건이 터진 뒤에 움직이기보다, 일상 속 작고 조용한 징후를 먼저 알아채는 눈이 중요함',
    tone: '칼라하리 모래 언덕 위로 아침 햇살이 비스듬히 내리며 선명해지는 작은 발자국들',
    action: '오늘 내 기분이나 몸이 보내는 아주 작은 피곤함·설렘의 신호 하나를 놓치지 말고 그대로 인정해 주세요.',
    question: '지금 내 일상에서 큰 사건은 아니지만, 모래 위의 발자국처럼 분명히 방향을 가리키고 있는 작은 징후는 무엇인가요?',
  },
  {
    sign: '땅속의 멜론 뿌리(Tsamma · 마른 땅 아래서 수분을 품고 버티는 지혜)',
    insight: '겉으로 아무것도 보이지 않는 시기에도 내면에서는 다음 걸음을 위한 수분이 조용히 고여 감',
    tone: '붉은 모래 아래서 맑은 물기를 머금고 자라는 사막 덩굴의 단단한 뿌리',
    action: '겉으로 성과가 안 보이는 일에서도 오늘 내가 묵묵히 쌓고 있는 기초 체력이나 자료 한 가지를 적어 보세요.',
    question: '겉으로 드러나지 않는 시기에도 내면의 뿌리에서 조용히 고여 가고 있는 힘은 무엇인가요?',
  },
  {
    sign: '트랜스 춤의 불씨(Healing Dance · 혼자의 짐을 공동체의 리듬으로 녹여 냄)',
    insight: '마음이 무거울수록 혼자 방 안에 가두지 말고 믿을 수 있는 온기와 리듬 곁으로 나와야 함',
    tone: '밤하늘 은하수 아래 모닥불을 둘러싸고 울려 퍼지는 경쾌한 손뼉과 노래',
    action: '마음이 무거울 때 혼자 끌어안기보다 믿을 수 있는 사람에게 짧은 안부나 가벼운 대화 한 마디를 건네 보세요.',
    question: '혼자 방 안에 가두어 두기보다 따뜻한 리듬과 대화 곁으로 꺼내 놓으면 가벼워질 짐은 무엇인가요?',
  },
  {
    sign: '기다림의 화살(Quiet Stalk · 성급히 시위를 당기지 않고 숨을 고르는 순간)',
    insight: '지금 당장 결론을 내지 못한다고 해서 멈춘 것이 아니라, 가장 정확한 타이밍을 재고 있는 것임',
    tone: '아카시아 풀숲 뒤에서 바람 방향과 그림자를 가만히 살피는 차분한 시선',
    action: '조급히 결론 내리고 싶던 결정 한 가지를 오늘 딱 반나절만 보류하고 바람의 방향을 살피며 숨을 고르세요.',
    question: '지금 멈춰 있는 듯 보이지만 사실은 가장 정확한 때를 기다리며 숨을 고르고 있는 일은 무엇인가요?',
  },
  {
    sign: '은하수의 뼈대(Backbone of the Night · 어두울수록 더 또렷이 보이는 길잡이)',
    insight: '주변이 어둡고 막막할수록 오히려 무엇이 내 진짜 북극성인지 선명하게 드러남',
    tone: '불빛 없는 칼라하리의 밤하늘을 가로지르는 하얗고 촘촘한 별빛의 강',
    action: '주변이 어수선할수록 오늘 내가 절대 놓치지 않을 핵심 기준 1가지만 밤하늘 별처럼 맨 위에 적어 두세요.',
    question: '주변이 막막하고 어두울수록 오히려 더 선명하게 드러나는 내 안의 북극성은 무엇인가요?',
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

const SAN_SHADOWS = [
  '모래 위의 작은 발자국을 읽어 내는 민감함이 사소한 변화에도 과도하게 의미를 부여하며 불안해하는 과잉 해석이 되지 않게 하세요.',
  '땅속 멜론 뿌리처럼 묵묵히 내면을 채우는 인내가 필요한 대화나 바깥의 실질적인 시도까지 미루는 고립이 되어서는 안 됩니다.',
  '함께 리듬을 나누며 짐을 녹이는 연대가 내 문제의 핵심 정리까지 타인에게 넘기고 기대는 의존으로 흐르지 않게 중심을 잡으세요.',
  '가장 정확한 때를 기다리며 시위를 당기지 않는 신중함이 이미 뻔히 보이는 결정마저 끝없이 유보하는 망설임이 되지 않도록 기한을 두세요.',
  '어두운 밤하늘에 띄운 나만의 북극성 기준이 상황 변화에 맞춰 조정해야 할 유연한 선택지까지 가리는 독단이 되지 않게 살피세요.',
];

function classifySanTopic(q: string): SanKalahariResult['questionTopic'] {
  if (/징후|발자국|신호|방향/.test(q)) return '징후·발자국';
  if (/뿌리|기초|체력|수분/.test(q)) return '내면·뿌리';
  if (/사람|대화|함께|불씨/.test(q)) return '연대·불씨';
  if (/기다|때|타이밍|보류/.test(q)) return '기다림·타이밍';
  if (/기준|별|은하수|어두/.test(q)) return '기준·은하수';
  return '칼라하리 전반';
}

export function calculateSanKalahariTrackingStars(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SanKalahariResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifySanTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % SIGNS.length;
  const picked = SIGNS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (SIGNS.length - 1));
  const companion = SIGNS[(idx + companionOffset) % SIGNS.length];
  const kalahariTrackAxis = `${picked.sign.split('(')[0].trim()} ↔ ${companion.sign.split('(')[0].trim()} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-SAN-KALAHARI-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    desertSign: picked.sign,
    companionSign: companion.sign,
    kalahariTrackAxis,
    sanInsight: picked.insight,
    kalahariTone: picked.tone,
    reflectionFocus: `칼라하리 산(San) 지혜의 '${picked.sign}'을 중심에 두고 '${companion.sign}'의 결을 곁들여, 큰 소음이 아니라 모래 위의 작은 발자국과 내면의 조용한 신호를 먼저 읽어 보세요.`,
    ritualAction: picked.action,
    shadowWarning: SAN_SHADOWS[idx],
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '남아프리카 칼라하리 산(San) 전통의 발자국 추적 직관·은하수 길잡이 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatSanKalahariPrompt(res: SanKalahariResult): string {
  return [
    `[칼라하리 산·별과 추적 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 추적·별빛 축: ${res.kalahariTrackAxis}`,
    `- 사막의 징후: ${res.desertSign} (${res.kalahariTone})`,
    `- 동반 징후: ${res.companionSign}`,
    `- 중심 통찰: ${res.sanInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

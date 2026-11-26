import type { UserProfile } from '../sharedState';

export interface TekoPoraPrinciple {
  name: string;
  koreanLabel: string;
  forestWisdom: string;
  coreInsight: string;
  practicalStep: string;
  reflectiveQuestion: string;
}

export interface GuaraniTekoPoraResult {
  engineVersion: 'LUCKEY-GUARANI-TEKOPORA-v2.4.0';
  calculatedAtKst: string;
  questionTopic: '관계·나눔' | '속도·일' | '마음·그늘' | '공존 전반';
  questionFocus: string;
  primaryPrinciple: TekoPoraPrinciple;
  supportingPrinciple: TekoPoraPrinciple;
  tekoPoraCycleAxis: string;
  topicBalanceHint: string;
  goodLivingPath: string;
  ritualAction: string;
  shadowWarning: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const TEKO_PORA_PRINCIPLES: TekoPoraPrinciple[] = [
  {
    name: 'Teko Porã (온전하고 아름다운 삶)',
    koreanLabel: '억지 속도 내려놓기',
    forestWisdom: '숲의 나무가 옆 나무의 빛을 가리지 않고 자기 계절에 자라는 원리',
    coreInsight: '남의 속도표에 내 하루를 맞추면 마음의 토양이 먼저 메마릅니다.',
    practicalStep: '오늘 비교를 부르는 화면이나 소식을 잠시 덮고 내 페이스에 맞는 일 하나만 정하세요.',
    reflectiveQuestion: '남들의 속도표가 아니라 나만의 숲의 계절로 걸어간다면 오늘 가장 먼저 덜어 내고 싶은 비교는 무엇인가요?',
  },
  {
    name: 'Jopói (열린 손과 상호 나눔)',
    koreanLabel: '주고받음의 따뜻한 순환',
    forestWisdom: '혼자 쌓아 두기보다 나눌 때 숲 전체가 풍요로워지는 원리',
    coreInsight: '작은 도움이나 솔직한 안부 한 마디가 막혀 있던 마음의 물길을 틉니다.',
    practicalStep: '고마웠던 사람이나 가까운 지인에게 부담 없는 짧은 안부를 먼저 건네 보세요.',
    reflectiveQuestion: '혼자 움켜쥐기보다 열린 손(Jopói)으로 작은 안부나 도움을 먼저 건네면 트일 물길은 어디인가요?',
  },
  {
    name: 'Ka’aguy (숨 쉬는 숲의 그늘)',
    koreanLabel: '과열된 생각 식히기',
    forestWisdom: '짙은 나무 그늘 아래에서 모든 생명이 숨을 고르는 원리',
    coreInsight: '해결되지 않는 문제를 머릿속에서 계속 돌릴수록 판단이 흐려집니다.',
    practicalStep: '잠시 자리에서 일어나 창밖이나 먼 곳을 1분간 바라보며 시야의 열기를 식히세요.',
    reflectiveQuestion: '머릿속에서 계속 맴돌며 과열된 생각 하나를 숲의 그늘(Ka’aguy) 아래 잠시 내려놓는다면 무엇일까요?',
  },
  {
    name: 'Ñe’ẽ (마음이 담긴 진실한 말)',
    koreanLabel: '내 마음을 속이지 않는 언어',
    forestWisdom: '겉치레가 아니라 진심이 담긴 말이 공동체의 신뢰를 세우는 원리',
    coreInsight: '모두에게 좋은 사람으로 보이려 애쓰다 정작 내가 원하는 것을 놓치지 마세요.',
    practicalStep: '오늘 내 기분과 필요를 꾸밈없이 한 문장으로 스스로에게 먼저 솔직히 적어 보세요.',
    reflectiveQuestion: '겉치레를 내려놓고 내 마음을 속이지 않는 진실한 말(Ñe’ẽ) 한 문장을 나에게 건넨다면 무엇인가요?',
  },
];

function formatKstTimestamp(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function classifyGuaraniTopic(q: string): GuaraniTekoPoraResult['questionTopic'] {
  if (/관계|나눔|공존|사람|사랑|가족/.test(q)) return '관계·나눔';
  if (/속도|일|직장|진로|비교|성과/.test(q)) return '속도·일';
  if (/마음|그늘|휴식|소진|과열|감정/.test(q)) return '마음·그늘';
  return '공존 전반';
}

const GUARANI_TOPIC_HINTS: Record<GuaraniTekoPoraResult['questionTopic'], string> = {
  '관계·나눔': '혼자 해결하려 움켜쥐기보다 열린 손으로 작은 안부를 건넬 때 관계의 물길이 트입니다.',
  '속도·일': '남의 속도표에 맞추느라 내 토양이 메마르지 않도록 오늘의 보폭을 한 박자 늦춰 보세요.',
  '마음·그늘': '과열된 생각을 억지로 굴리지 말고 숲의 그늘 아래에서 시야를 식히는 시간이 먼저입니다.',
  '공존 전반': '나다움과 공존은 대립하지 않으며, 진실한 말 한마디가 두 흐름을 하나로 잇습니다.',
};

const TEKO_PORA_SHADOWS: Record<string, string> = {
  'Teko Porã (온전하고 아름다운 삶)': '내 속도를 지키려다 꼭 맞춰야 할 약속과 흐름까지 놓치지 않도록 경계하세요.',
  'Jopói (열린 손과 상호 나눔)': '나눔과 배려에 마음을 쓰다 정작 내 그릇이 비는 신호를 지나치지 마세요.',
  'Ka’aguy (숨 쉬는 숲의 그늘)': '그늘에서 쉬는 시간이 길어져 문제의 실마리를 붙잡는 타이밍을 넘기지 않도록 살피세요.',
  'Ñe’ẽ (마음이 담긴 진실한 말)': '솔직함이 날 선 단정으로 흐르지 않도록 상대의 온도를 함께 살피세요.',
};

export function calculateGuaraniTekoPoraForestHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): GuaraniTekoPoraResult {
  const now = params.now ?? new Date();
  const questionFocus = (params.question ?? '').trim() || '나다움과 공존의 좋은 삶';
  const questionTopic = classifyGuaraniTopic(questionFocus);
  const seedBase = `${JSON.stringify(params.profile.fate ?? {})}|${now.toISOString().slice(0, 13)}|${questionFocus}|guarani-tekopora`;
  const seed = stableHash(seedBase);
  const supportSeed = stableHash(`${seedBase}|support`);

  const primaryIdx = seed % TEKO_PORA_PRINCIPLES.length;
  const supportOffset = 1 + (supportSeed % (TEKO_PORA_PRINCIPLES.length - 1));
  const supportIdx = (primaryIdx + supportOffset) % TEKO_PORA_PRINCIPLES.length;
  const primaryPrinciple = TEKO_PORA_PRINCIPLES[primaryIdx];
  const supportingPrinciple = TEKO_PORA_PRINCIPLES[supportIdx];
  const tekoPoraCycleAxis = `${primaryPrinciple.koreanLabel} ↔ ${supportingPrinciple.koreanLabel} (${questionTopic})`;
  const topicBalanceHint = GUARANI_TOPIC_HINTS[questionTopic];
  const shadowWarning = TEKO_PORA_SHADOWS[primaryPrinciple.name] ?? '조화와 속도의 균형을 과도하게 밀어붙이지 않도록 살피세요.';

  return {
    engineVersion: 'LUCKEY-GUARANI-TEKOPORA-v2.4.0',
    calculatedAtKst: formatKstTimestamp(now),
    questionTopic,
    questionFocus,
    primaryPrinciple,
    supportingPrinciple,
    tekoPoraCycleAxis,
    topicBalanceHint,
    goodLivingPath: `${primaryPrinciple.koreanLabel}를 바탕으로 ${supportingPrinciple.koreanLabel}을 함께 가꾸는 테코 포랑(Teko Porã) 흐름`,
    ritualAction: primaryPrinciple.practicalStep,
    shadowWarning,
    reflectionFocus: `${primaryPrinciple.name}(${primaryPrinciple.forestWisdom})과 ${supportingPrinciple.koreanLabel}을 기준으로 오늘의 소진과 공존을 살핍니다.`,
    reflectiveQuestion: primaryPrinciple.reflectiveQuestion,
    interpretiveBoundary:
      '구아라니 테코 포랑 관점은 공존과 내면의 균형을 비유적으로 성찰하는 상징 도구이며, 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatGuaraniTekoPoraPrompt(result: GuaraniTekoPoraResult): string {
  return [
    `[구아라니 테코 포랑 숲과 공동체 조화 엔진 ${result.engineVersion}]`,
    `- 연산 시각: ${result.calculatedAtKst}`,
    `- 질문 맥락: ${result.questionTopic} | 공존 축: ${result.tekoPoraCycleAxis}`,
    `- 맥락 균형 조언: ${result.topicBalanceHint}`,
    `- 질문 초점: ${result.questionFocus}`,
    `- 중심 원리: ${result.primaryPrinciple.name} (${result.primaryPrinciple.koreanLabel}) — ${result.primaryPrinciple.coreInsight}`,
    `- 받침 원리: ${result.supportingPrinciple.name} (${result.supportingPrinciple.koreanLabel})`,
    `- 좋은 삶의 길: ${result.goodLivingPath}`,
    `- 실천 제안: ${result.ritualAction}`,
    `- 과잉 경계: ${result.shadowWarning}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 되묻는 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ].join('\n');
}

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
  engineVersion: 'LUCKEY-GUARANI-TEKOPORA-v2.2.0';
  calculatedAtKst: string;
  questionFocus: string;
  primaryPrinciple: TekoPoraPrinciple;
  supportingPrinciple: TekoPoraPrinciple;
  goodLivingPath: string;
  ritualAction: string;
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

export function calculateGuaraniTekoPoraForestHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): GuaraniTekoPoraResult {
  const now = params.now ?? new Date();
  const questionFocus = (params.question ?? '').trim() || '나다움과 공존의 좋은 삶';
  const seedBase = `${JSON.stringify(params.profile.fate ?? {})}|${now.toISOString().slice(0, 13)}|${questionFocus}|guarani-tekopora`;
  const seed = stableHash(seedBase);
  const supportSeed = stableHash(`${seedBase}|support`);

  const primaryIdx = seed % TEKO_PORA_PRINCIPLES.length;
  const supportOffset = 1 + (supportSeed % (TEKO_PORA_PRINCIPLES.length - 1));
  const supportIdx = (primaryIdx + supportOffset) % TEKO_PORA_PRINCIPLES.length;
  const primaryPrinciple = TEKO_PORA_PRINCIPLES[primaryIdx];
  const supportingPrinciple = TEKO_PORA_PRINCIPLES[supportIdx];

  return {
    engineVersion: 'LUCKEY-GUARANI-TEKOPORA-v2.2.0',
    calculatedAtKst: formatKstTimestamp(now),
    questionFocus,
    primaryPrinciple,
    supportingPrinciple,
    goodLivingPath: `${primaryPrinciple.koreanLabel}를 바탕으로 ${supportingPrinciple.koreanLabel}을 함께 가꾸는 테코 포랑(Teko Porã) 흐름`,
    ritualAction: primaryPrinciple.practicalStep,
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
    `- 질문 초점: ${result.questionFocus}`,
    `- 중심 원리: ${result.primaryPrinciple.name} (${result.primaryPrinciple.koreanLabel}) — ${result.primaryPrinciple.coreInsight}`,
    `- 받침 원리: ${result.supportingPrinciple.name} (${result.supportingPrinciple.koreanLabel})`,
    `- 좋은 삶의 길: ${result.goodLivingPath}`,
    `- 실천 제안: ${result.ritualAction}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 되묻는 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ].join('\n');
}

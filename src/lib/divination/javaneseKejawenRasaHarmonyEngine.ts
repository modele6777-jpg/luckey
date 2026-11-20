import type { UserProfile } from '../sharedState';

export type KejawenRasaPrincipleId =
  | 'eling_lan_waspada'
  | 'sabar_lan_narima'
  | 'tepa_slira'
  | 'memayu_hayuning_bawana';

export interface KejawenRasaPrinciple {
  id: KejawenRasaPrincipleId;
  javanesePhrase: string;
  koreanTitle: string;
  coreMeaning: string;
  dailyPractice: string;
}

export interface JavaneseKejawenResult {
  engineName: string;
  engineVersion: string;
  calculatedAtKst: string;
  activePrinciple: KejawenRasaPrinciple;
  supportingPrinciple: KejawenRasaPrinciple;
  rasaTone: string;
  qualitativeSynthesis: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  isSymbolicFramework: true;
}

const KEJAWEN_PRINCIPLES: readonly KejawenRasaPrinciple[] = [
  {
    id: 'eling_lan_waspada',
    javanesePhrase: 'Eling lan Waspada (깨어 있음과 분별)',
    koreanTitle: '흔들리지 않는 알아차림',
    coreInsight: '상황이 급변하거나 들뜰 때에도 자기 본심을 잊지 않고 차분히 살피는 내면의 평정심입니다.',
    dailyPractice: '성급히 답장하거나 결정하기 전에 세 번 숨을 고르고 의도를 한 번 더 확인하세요.',
  },
  {
    id: 'sabar_lan_narima',
    javanesePhrase: 'Sabar lan Narima (인내와 수용)',
    koreanTitle: '흐름을 거스르지 않는 여유',
    coreInsight: '포기가 아니라 지금 내 손이 닿는 것과 닿지 않는 것을 구분해 에너지를 아끼는 지혜입니다.',
    dailyPractice: '내가 통제할 수 없는 결과에 쓰던 걱정을 내려놓고 오늘 할 수 있는 한 걸음에만 집중하세요.',
  },
  {
    id: 'tepa_slira',
    javanesePhrase: 'Tepa Slira (역지사지와 온기)',
    koreanTitle: '타인의 마음을 헤아리는 품격',
    coreInsight: '내가 듣기 싫은 말과 태도를 상대에게도 건네지 않으며 관계의 결을 부드럽게 지키는 마음입니다.',
    dailyPractice: '오늘 대화에서 상대의 입장을 한 문장 먼저 공감한 뒤 내 의견을 전해 보세요.',
  },
  {
    id: 'memayu_hayuning_bawana',
    javanesePhrase: 'Memayu Hayuning Bawana (세상의 조화 가꾸기)',
    koreanTitle: '주변을 맑게 가꾸는 조화',
    coreInsight: '거창한 구호보다 내가 서 있는 자리와 주변 공간을 평화롭고 정갈하게 정돈할 때 마음도 함께 맑아집니다.',
    dailyPractice: '책상 위나 자주 보는 공간 한 곳을 깔끔하게 비워 새로운 호흡을 들여오세요.',
  },
] as const;

const RASA_TONES: readonly string[] = [
  '고요한 호수처럼 잔물결이 가라앉는 라사(Rasa) — 감정의 소음을 잦아들게 하기',
  '새벽 안개처럼 부드럽게 스미는 라사 — 날 선 판단 대신 유연함 품기',
  '대나무처럼 휘어지되 부러지지 않는 라사 — 중심을 지키며 적응하기',
];

function formatJavaneseKstTimestamp(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 19)}+09:00 (KST)`;
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function calculateJavaneseKejawenRasaHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): JavaneseKejawenResult {
  const now = params.now ?? new Date();
  const query = (params.question ?? '').trim();

  const seed = stableHash(
    [
      params.profile.basic?.name ?? '',
      JSON.stringify(params.profile.fate ?? {}),
      query,
    ].join('|')
  );

  const activeIdx = seed % KEJAWEN_PRINCIPLES.length;
  const supportingIdx = (activeIdx + 1) % KEJAWEN_PRINCIPLES.length;
  const rasaTone = RASA_TONES[(seed >> 3) % RASA_TONES.length];

  const activePrinciple = KEJAWEN_PRINCIPLES[activeIdx];
  const supportingPrinciple = KEJAWEN_PRINCIPLES[supportingIdx];

  const qualitativeSynthesis =
    `인도네시아 자바 케자웬(Kejawen) 철학의 내면 감각 ‘라사(Rasa)’로 비추어 보면, 지금 흐름에는 ` +
    `‘${activePrinciple.javanesePhrase} — ${activePrinciple.koreanTitle}’의 기운이 어울립니다. ` +
    `${activePrinciple.coreInsight} 여기에 ‘${supportingPrinciple.koreanTitle}’이 곁들여져, ` +
    `‘${rasaTone}’의 태도로 일상의 균형을 되찾기 좋은 때입니다.`;

  const reflectionFocus =
    `${activePrinciple.koreanTitle}을 바탕으로 감정의 파도를 가라앉히고 ${supportingPrinciple.koreanTitle}으로 조화를 세우는 시점`;

  const ritualAction = activePrinciple.dailyPractice;

  const reflectiveQuestion = query
    ? `‘${query.slice(0, 36)}’을(를) 대하는 지금, 내 마음의 평정(Rasa)을 가장 흐리게 만드는 조급함은 어디에서 오고 있나요?`
    : `오늘 하루 내 주변과 관계를 조금 더 평온하게 가꾸기 위해 부드럽게 바꿀 수 있는 태도는 무엇인가요?`;

  return {
    engineName: '자바 케자웬(Kejawen) 라사·내면 평정 (Javanese Kejawen Rasa)',
    engineVersion: 'LUCKEY-JAVANESE-KEJAWEN-v2.1.0',
    calculatedAtKst: formatJavaneseKstTimestamp(now),
    activePrinciple,
    supportingPrinciple,
    rasaTone,
    qualitativeSynthesis,
    reflectionFocus,
    ritualAction,
    reflectiveQuestion,
    interpretiveBoundary:
      '본 결과는 인도네시아 자바 전통 케자웬(Kejawen)의 내면 평정 철학을 활용한 자기 성찰 프레임워크이며, 의학적 진단·미래 예측이나 수치적 운세 점수가 아닙니다.',
    isSymbolicFramework: true,
  };
}

export function formatJavaneseKejawenPrompt(res: JavaneseKejawenResult): string {
  return [
    `[보조 상징 관점 — ${res.engineName}]`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 중심 덕목: ${res.activePrinciple.javanesePhrase} · ${res.activePrinciple.koreanTitle}`,
    `- 보조 덕목: ${res.supportingPrinciple.javanesePhrase} · ${res.supportingPrinciple.koreanTitle}`,
    `- 라사(Rasa) 결: ${res.rasaTone}`,
    `- 성찰 해석: ${res.qualitativeSynthesis}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

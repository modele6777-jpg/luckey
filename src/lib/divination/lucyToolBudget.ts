/**
 * 🔮 점술모드 자동 선택의 절제 예산.
 * 루시는 매 턴 15대 도구와 500개 심층 관점을 전부 동원하지 않는다.
 * 질문·고민에 진짜 필요한 소수의 기초 도구와 심층 관점만 골라 쓰고, 나머지는 실행·주입하지 않는다.
 */
export type LucyToolBudgetTier = 'light' | 'standard' | 'deep';

export interface LucyToolBudget {
  tier: LucyToolBudgetTier;
  /** 기초 도구 총 개수 상한 (사주·타로 포함) */
  maxBasic: number;
  /** 심층 관점 총 개수 상한 */
  maxDeep: number;
  reason: string;
}

export const LUCY_TOOL_BUDGETS: Record<LucyToolBudgetTier, { maxBasic: number; maxDeep: number; reason: string }> = {
  // 가벼운 인사·감정 공감만 필요한 턴: 사주 중심 한두 개로 충분하다.
  light: { maxBasic: 2, maxDeep: 1, reason: '가벼운 질문이라 핵심 도구만 짧게 본다' },
  // 보통 고민: 사주 + 고민에 맞는 도구 두 개, 심층 관점 두 개까지.
  standard: { maxBasic: 3, maxDeep: 2, reason: '고민에 맞는 핵심 도구와 관점만 고른다' },
  // "더 깊게"를 말한 턴: 절제 상한 안에서 가장 넓게 본다.
  deep: { maxBasic: 3, maxDeep: 3, reason: '더 깊게 보자는 요청이라 상한 안에서 넓게 본다' },
};

const GREETING_OR_EMPATHY = /^(?:안녕|하이|헬로|반가|고마|고맙|땡큐|ㅋㅋ|ㅎㅎ|응|어|그래|맞아|좋아|오케이|굿|잘\s*자|굿모닝|수고|힘들|지쳐|우울|슬퍼|외로|불안|무서|짜증|화나|속상)/;

const ASKING_SOMETHING = /[?？]|궁금|어떻게|어떤|왜|언제|봐줘|알려줘|할까|될까|할지|볼까|좋을까/;

const DOMAIN_KEYWORD = /사주|팔자|운세|이직|직장|커리어|진로|취업|사업|돈|재물|투자|연애|궁합|인연|결혼|재회|건강|몸|수면|시험|합격|창작|예술|가족|친구|관계|대운|세운|타로|점성|주역|자미|기문|육임|숙요|베딕|구성|토정|태을|마하보테|카발라/;

/** 인사·감정 공감만 필요한 가벼운 턴인지 (도구를 최소한만 쓴다). */
export function isLightConcern(question: string): boolean {
  const text = (question || '').trim();
  if (!text) return true;
  if (GREETING_OR_EMPATHY.test(text) && !DOMAIN_KEYWORD.test(text)) return true;
  return text.length <= 10 && !ASKING_SOMETHING.test(text) && !DOMAIN_KEYWORD.test(text);
}

/** 이번 턴에 쓸 기초 도구·심층 관점 개수 상한을 정한다. */
export function resolveLucyToolBudget(params: { question?: string; deepRequested?: boolean } = {}): LucyToolBudget {
  const tier: LucyToolBudgetTier = params.deepRequested
    ? 'deep'
    : isLightConcern(params.question ?? '')
      ? 'light'
      : 'standard';
  return { tier, ...LUCY_TOOL_BUDGETS[tier] };
}

/**
 * 🧮 계산 엔진 결과를 AI 프롬프트에 넣기 전에 줄인다.
 *
 * - 엔진이 만든 "앱 해석 문장"(조율 매트릭스·의례·성찰 질문·해석 경계·점수·지수 등)은 계산값이 아니므로 뺀다.
 *   루시가 이런 문장을 계산 결과처럼 말하지 않게 하고, 프롬프트를 크게 줄인다.
 * - 생년월일로 정해지는 타로 '과거·현재·미래 3카드'는 실제 추첨이 아니므로 뺀다 (손님이 고른 카드만 쓴다).
 * - 긴 배열·긴 문장은 잘라 도구당 크기를 제한한다. 화면(도구 보드)은 원본 데이터를 그대로 쓴다.
 */

/** 계산값이 아닌, 엔진이 덧붙인 해석·연출 항목. */
const INTERPRETIVE_KEYS = new Set([
  'ritualAction', 'reflectionFocus', 'reflectiveQuestion', 'interpretiveBoundary', 'boundaryNotice',
  'masterAffirmation', 'method', 'status', 'calculatedAtKst', 'calculatedAtUtc', 'timestamp', 'calculatedAt',
  'actionProtocols', 'remedies', 'practice', 'spiritualPractice',
  // 생일 기반 타로 3카드와 그 해석 (실제 추첨 아님)
  'timelineCards', 'cardPolarities', 'suitManifestation', 'sephiraMapping', 'elementalBalance',
  // 앱이 만든 점수·비율·전략 문장
  'domainAffinities', 'planetaryAffinity', 'purusharthaAlignment', 'seasonalThaatTactics', 'tacticalSeasonWindows',
  'macroStrategicMatrix', 'macroActionStrategy', 'usageScenarios', 'directionalScores', 'honmyoseiSynergy',
  'planetaryFriendEnemyDynamic', 'dashaPlanetarySynergy', 'kendraTrikonaProsperity', 'secondaryAxis', 'selfDynamics',
  'fourWorldsSpectrum', 'pillarBalance', 'tipherethAlignment', 'lightningFlash', 'transitInteraction',
  'hexagramDynamics', 'interpersonalDynamic', 'transmissionDynamics', 'heavenEarthResonance', 'threeWondersAlliance',
  'quarterlyPacing', 'yearlyStrategy', 'secondaryMutagenAxis', 'luJiConflictDynamics', 'situationalAudit',
  'guidance', 'lifeGuide', 'actionStrategy', 'actionAdvice', 'actionCompass', 'yearlyAdvice', 'strategicVerdict',
]);
/** 이름 끝이 이런 항목도 해석·점수다. */
const INTERPRETIVE_SUFFIX = /(SynthesisMatrix|Audit|Rhythm|Score|Index|Weight|Advice|Guidance|Strategy|Protocol)$/;

export interface SlimOptions {
  maxString?: number;
  maxArray?: number;
  maxDepth?: number;
}

function isInterpretiveKey(key: string): boolean {
  return INTERPRETIVE_KEYS.has(key) || INTERPRETIVE_SUFFIX.test(key);
}

export function slimToolData(value: unknown, options: SlimOptions = {}, depth = 0): unknown {
  const maxString = options.maxString ?? 140;
  const maxArray = options.maxArray ?? 12;
  const maxDepth = options.maxDepth ?? 5;
  if (value == null) return value;
  if (typeof value === 'string') {
    const clean = value.replace(/\s+/g, ' ').trim();
    return clean.length > maxString ? `${clean.slice(0, maxString)}…` : clean;
  }
  if (typeof value === 'number') return Number.isInteger(value) ? value : Math.round(value * 100) / 100;
  if (typeof value !== 'object') return value;
  if (depth >= maxDepth) {
    // 너무 깊은 곳은 구조를 버리고, 숫자·짧은 글만 한 줄로 남긴다 (예: 대운 이름·기간).
    if (Array.isArray(value)) return value.length ? `${value.length}개 항목` : undefined;
    const flat = Object.entries(value as Record<string, unknown>)
      .filter(([key, child]) => !isInterpretiveKey(key) && (typeof child === 'number' || (typeof child === 'string' && child.length <= 40)))
      .slice(0, 6)
      .map(([key, child]) => `${key}=${typeof child === 'number' && !Number.isInteger(child) ? Math.round(child * 100) / 100 : child}`);
    return flat.length ? flat.join(', ') : undefined;
  }
  if (Array.isArray(value)) {
    const items = value.slice(0, maxArray).map(item => slimToolData(item, options, depth + 1)).filter(item => item !== undefined);
    if (value.length > maxArray) items.push(`…외 ${value.length - maxArray}개`);
    return items;
  }
  const out: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    if (isInterpretiveKey(key)) continue;
    const slim = slimToolData(child, options, depth + 1);
    if (slim === undefined || slim === '' || (Array.isArray(slim) && slim.length === 0)) continue;
    if (typeof slim === 'object' && slim && !Array.isArray(slim) && Object.keys(slim).length === 0) continue;
    out[key] = slim;
  }
  return out;
}

/** 도구 하나의 데이터를 크기 예산 안으로 줄인다 (점점 더 짧게). */
export function slimToolDataToBudget(value: unknown, budget = 3200): unknown {
  const steps: SlimOptions[] = [
    // 12궁·12달이 잘리지 않게 배열은 12개까지 먼저 시도한다.
    { maxString: 140, maxArray: 12, maxDepth: 5 },
    { maxString: 90, maxArray: 12, maxDepth: 4 },
    { maxString: 60, maxArray: 8, maxDepth: 4 },
    { maxString: 50, maxArray: 4, maxDepth: 3 },
  ];
  let slim: unknown = value;
  for (const step of steps) {
    slim = slimToolData(value, step);
    if (JSON.stringify(slim ?? null).length <= budget) return slim;
  }
  return slim;
}

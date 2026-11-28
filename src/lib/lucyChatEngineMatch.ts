/**
 * 루시채팅 전용: 엔진함(deep_master) 관점을 질문 문장에 맞춰 2~3개 고른다.
 * 점술 계산용 선호 목록을 무조건 앞에 두지 않는다.
 */

export interface ChatEngineBrief {
  key: string;
  nameKo: string;
  summary?: string;
  meaning?: string;
}

const STOP_WORDS = new Set([
  '이번', '내', '나의', '어떻게', '무엇', '어떤', '해줘', '봐줘', '알려줘', '좀', '관련',
  '질문', '분석', '상담', '운세', '그리고', '그래서', '그런데', '때문', '수', '것',
  '요즘', '너무', '정말', '진짜', '그냥', '있어', '없어', '같아', '거야', '이게', '그게',
]);

export function chatQuestionTokens(text: string): string[] {
  const words = (text || '').toLowerCase().normalize('NFKC').match(/[a-z0-9]+|[가-힣]{2,}/g) ?? [];
  return [...new Set(words
    .map(word => word.replace(/(에서|으로|에게|부터|까지|은|는|이|가|을|를|와|과|도|로|만|의|에)$/u, ''))
    .filter(word => word.length >= 2 && !STOP_WORDS.has(word)))];
}

export function selectChatDeepPerspectiveKeys(input: {
  question: string;
  /** 질문 의도가 잡힌 경우의 힌트 단어. 일반 폴백이면 빈 배열. */
  intentTerms?: readonly string[];
  /** 의도 카테고리에 미리 묶인 엔진함 키. 일반 폴백이면 빈 배열. */
  preferredKeys?: readonly string[];
  engines: readonly ChatEngineBrief[];
  limit: number;
}): string[] {
  const limit = Math.max(2, Math.min(3, input.limit || 2));
  const engines = input.engines.filter(engine => engine.key && engine.nameKo);
  const byKey = new Map(engines.map(engine => [engine.key, engine] as const));
  const preferred = [...new Set(input.preferredKeys ?? [])].filter(key => byKey.has(key));
  const tokens = chatQuestionTokens(input.question);
  const intentTerms = input.intentTerms ?? [];
  const ranked = engines.map((engine, index) => {
    const searchable = `${engine.nameKo} ${engine.summary ?? ''} ${engine.meaning ?? ''}`
      .toLowerCase()
      .normalize('NFKC');
    const queryMatches = tokens.filter(token => searchable.includes(token)).length;
    const intentMatches = intentTerms.filter(term => searchable.includes(term.toLowerCase())).length;
    const preferredIndex = preferred.indexOf(engine.key);
    const preferredBoost = preferredIndex >= 0 ? Math.max(1, 8 - preferredIndex) : 0;
    return {
      key: engine.key,
      index,
      score: queryMatches * 5 + intentMatches * 2 + preferredBoost,
    };
  }).filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const selected: string[] = [];
  for (const item of ranked) {
    if (selected.length >= limit) break;
    selected.push(item.key);
  }
  if (selected.length < 2) {
    for (const key of preferred) {
      if (selected.length >= 2) break;
      if (!selected.includes(key)) selected.push(key);
    }
  }
  if (selected.length < 2) {
    let hash = 0;
    for (const ch of input.question || 'lucy') hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
    const pool = engines.filter(engine => !selected.includes(engine.key));
    while (selected.length < 2 && pool.length > 0) {
      const index = hash % pool.length;
      selected.push(pool.splice(index, 1)[0].key);
      hash = (hash * 17 + 1) >>> 0;
    }
  }
  return selected.slice(0, limit);
}

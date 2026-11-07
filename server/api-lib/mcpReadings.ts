import { GoogleGenAI } from '@google/genai';
import { TAROT_DECK, type TarotCard } from '../../src/data/tarotData.ts';
import { buildSpecificTarotDailyOracle } from '../../src/lib/dailyTarotOracle.ts';
import { resolveEffectiveSolarDate } from '../../src/lib/lunarCalendar.ts';
import { calculateDetailedSaju } from '../../src/lib/sajuAnalysis.ts';
import {
  analyzeTarotConcern,
  buildLocalTarotReading,
  buildSpreadForTheme,
  ensureCompleteTarotReading,
  getAllTarotSpreads,
  getTarotRecommendationReason,
  getTarotThemeMeta,
  type TarotConcernAnalysis,
  type TarotConcernKind,
  type TarotConcernTheme,
} from '../../src/lib/trinity/utils.ts';
import { getGeminiApiKey } from '../geminiKey.ts';

export const TAROT_THEME_IDS = [
  'binary_choice',
  'yes_no',
  'daily',
  'super_money',
  'lucky',
  'angel',
  'healing',
  'fortune_boost',
  'new_year',
  'saju',
  'love',
  'career',
  'money',
  'timing',
  'obstacle',
  'celtic_cross',
  'general',
] as const satisfies readonly TarotConcernTheme[];

export type NarrativeMode = 'local' | 'model';

export interface TarotCardRef {
  id: string;
  reversed?: boolean;
}

export interface TarotReadingInput {
  question?: string;
  theme?: TarotConcernTheme;
  cards?: TarotCardRef[];
  narrative?: NarrativeMode;
}

export interface NarrativeRequest {
  question: string;
  spreadName: string;
  cardsSummary: string;
  localReading: string;
}

export type NarrativeGenerator = (input: NarrativeRequest) => Promise<string>;

export class McpModelError extends Error {
  constructor(readonly reason: 'not_configured' | 'failed') {
    super(reason);
    this.name = 'McpModelError';
  }
}

export interface ReadingFailure {
  ok: false;
  message: string;
}

export interface TarotReadingSuccess {
  ok: true;
  narrative: NarrativeMode;
  model: { used: boolean; fallback?: 'not_configured' | 'failed' };
  payload: Record<string, unknown>;
}

export interface SajuReadingSuccess {
  ok: true;
  payload: Record<string, unknown>;
}

let narrativeOverride: NarrativeGenerator | null = null;

export function setMcpNarrativeGeneratorForTests(generator: NarrativeGenerator | null): void {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('MCP test hook is disabled');
  }
  narrativeOverride = generator;
}

export function listTarotSpreads() {
  return getAllTarotSpreads().map((spread) => ({
    id: spread.id,
    name: spread.name,
    theme: spread.theme,
    cardCount: spread.cardCount,
    positions: spread.positions,
    reason: spread.reason,
  }));
}

function cryptoRandomInt(limit: number): number {
  const values = new Uint32Array(1);
  const upper = Math.floor(0x100000000 / limit) * limit;
  do {
    globalThis.crypto.getRandomValues(values);
  } while (values[0] >= upper);
  return values[0] % limit;
}

function drawCards(count: number): TarotCard[] {
  const deck = [...TAROT_DECK];
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swap = cryptoRandomInt(index + 1);
    [deck[index], deck[swap]] = [deck[swap], deck[index]];
  }
  return deck.slice(0, count).map((card) => {
    const reversed = cryptoRandomInt(10) >= 6;
    return { ...card, reversed };
  });
}

function resolveSuppliedCards(refs: TarotCardRef[]): TarotCard[] | ReadingFailure {
  const seen = new Set<string>();
  const cards: TarotCard[] = [];
  for (const ref of refs) {
    if (seen.has(ref.id)) return { ok: false, message: '같은 카드를 한 배열에 두 번 넣을 수 없습니다.' };
    seen.add(ref.id);
    const card = TAROT_DECK.find((item) => item.id === ref.id);
    if (!card) return { ok: false, message: '덱에 없는 카드 id입니다.' };
    cards.push({ ...card, reversed: Boolean(ref.reversed) });
  }
  return cards;
}

function analysisFor(question: string, theme?: TarotConcernTheme): TarotConcernAnalysis {
  const detected = analyzeTarotConcern(question);
  if (!theme) return detected;
  const kind: TarotConcernKind = theme === 'binary_choice' ? 'binary_choice' : theme === 'yes_no' ? 'yes_no' : 'open';
  const spread = buildSpreadForTheme(theme, {
    kind,
    optionA: detected.optionA,
    optionB: detected.optionB,
  });
  const meta = getTarotThemeMeta(theme);
  return {
    ...detected,
    kind,
    theme,
    themeLabel: meta.label,
    themeEmoji: meta.emoji,
    recommendationReason: getTarotRecommendationReason(theme, spread.name, spread.cardCount, detected),
    spread,
    optionA: detected.optionA,
    optionB: detected.optionB,
  };
}

function cardSummary(cards: TarotCard[], positions: string[]): string {
  return cards.map((card, index) => {
    const position = positions[index] || `${index + 1}`;
    return `${position}: ${card.id} ${card.nameKo} (${card.name}) ${card.reversed ? '역방향' : '정방향'}`;
  }).join('\n');
}

export async function defaultGenerateNarrative(input: NarrativeRequest): Promise<string> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) throw new McpModelError('not_configured');
  const model = (process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite').trim() || 'gemini-3.1-flash-lite';
  const ai = new GoogleGenAI({ apiKey });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{
        role: 'user',
        parts: [{
          text: `질문: ${input.question}\n배열: ${input.spreadName}\n카드:\n${input.cardsSummary}\n기준 리딩:\n${input.localReading}`,
        }],
      }],
      config: {
        abortSignal: controller.signal,
        maxOutputTokens: 4096,
        systemInstruction: [
          '당신은 LUCKEY 앱의 트리니티 타로 리딩을 카드 근거 안에서 다듬는다.',
          '주어진 카드 id, 한글명, 정역방향, 배열 위치, 로컬 리딩의 YES/NO 또는 양자택일 승자를 바꾸지 않는다.',
          '새 카드를 만들지 않고, 생년월일·계정·비밀 값을 요구하거나 반복하지 않는다.',
          '한국어로 완결된 리딩만 쓴다.',
        ].join('\n'),
      },
    });
    const text = response.text?.trim() || '';
    if (!text) throw new McpModelError('failed');
    return text;
  } catch (error) {
    if (error instanceof McpModelError) throw error;
    throw new McpModelError('failed');
  } finally {
    clearTimeout(timer);
  }
}

export async function createTarotReading(
  input: TarotReadingInput,
  generateNarrative: NarrativeGenerator = narrativeOverride ?? defaultGenerateNarrative,
): Promise<TarotReadingSuccess | ReadingFailure> {
  const question = input.question?.trim() || '오늘의 타로';
  const analysis = analysisFor(question, input.theme);
  const expected = analysis.spread.cardCount;
  let cards: TarotCard[];
  if (input.cards?.length) {
    const resolved = resolveSuppliedCards(input.cards);
    if (!Array.isArray(resolved)) return resolved;
    if (resolved.length !== expected) {
      return { ok: false, message: `이 배열은 카드 ${expected}장이 필요합니다.` };
    }
    cards = resolved;
  } else {
    cards = drawCards(expected);
  }

  const localReading = buildLocalTarotReading(question, cards, false, analysis);
  const daily = analysis.spread.theme === 'daily' && cards.length === 1
    ? buildSpecificTarotDailyOracle(cards[0], 'oracle')
    : null;
  let reading = daily?.diagnosis || localReading;
  const narrative = input.narrative === 'model' ? 'model' : 'local';
  let model: TarotReadingSuccess['model'] = { used: false };

  if (narrative === 'model') {
    try {
      const generated = await generateNarrative({
        question,
        spreadName: analysis.spread.name,
        cardsSummary: cardSummary(cards, analysis.spread.positions),
        localReading,
      });
      reading = ensureCompleteTarotReading(generated, question, cards);
      model = { used: true };
    } catch (error) {
      const reason = error instanceof McpModelError ? error.reason : 'failed';
      reading = localReading;
      model = { used: false, fallback: reason };
    }
  }

  return {
    ok: true,
    narrative,
    model,
    payload: {
      question,
      theme: analysis.theme,
      themeLabel: analysis.themeLabel,
      spread: {
        id: analysis.spread.id,
        name: analysis.spread.name,
        theme: analysis.spread.theme,
        cardCount: analysis.spread.cardCount,
        positions: analysis.spread.positions,
      },
      cards: cards.map((card, index) => ({
        id: card.id,
        name: card.name,
        nameKo: card.nameKo,
        type: card.type,
        reversed: Boolean(card.reversed),
        position: analysis.spread.positions[index] || `${index + 1}`,
        keywords: card.keywords,
      })),
      reading,
      ...(daily ? {
        dailyOracle: {
          luckyNumber: daily.luckyNumber,
          luckyColor: daily.luckyColor,
          remedy: daily.remedy,
          symbol: daily.symbol,
          frequency: daily.frequency,
          blessingMessage: daily.blessingMessage,
        },
      } : {}),
      narrative,
      model,
      source: narrative === 'model' && model.used ? 'luckey-app-model' : 'luckey-app-local',
      note: '앱의 78장 덱, 배열법, 로컬 리딩 엔진 결과입니다. 상징 해석이며 사건이나 수익을 확정하지 않습니다.',
    },
  };
}

export interface SajuReadingInput {
  year: number;
  month: number;
  day: number;
  birthtime?: string;
  isLunar?: boolean;
  isLeapMonth?: boolean;
  gender?: 'male' | 'female' | 'other';
}

export function createSajuReading(input: SajuReadingInput): SajuReadingSuccess | ReadingFailure {
  if (input.isLeapMonth && !input.isLunar) {
    return { ok: false, message: '윤달은 음력 날짜에서만 지정할 수 있습니다.' };
  }
  const birthdate = `${input.year}-${String(input.month).padStart(2, '0')}-${String(input.day).padStart(2, '0')}`;
  try {
    resolveEffectiveSolarDate(birthdate, input.isLunar ? 'lunar' : 'solar', Boolean(input.isLeapMonth));
  } catch {
    return { ok: false, message: '올바른 생년월일을 입력해 주세요.' };
  }

  const analysis = calculateDetailedSaju({
    basic: {
      birthdate,
      birthtime: input.birthtime,
      lunarSolar: input.isLunar ? 'lunar' : 'solar',
      isLeapMonth: Boolean(input.isLeapMonth),
      gender: input.gender,
    },
  });
  if (!analysis) return { ok: false, message: '사주 계산에 실패했습니다. 생년월일을 확인해 주세요.' };

  return {
    ok: true,
    payload: {
      solarEquivalentDate: analysis.solarEquivalentDate,
      isLunar: analysis.isLunar,
      birthtimeProvided: Boolean(input.birthtime),
      genderProvided: input.gender === 'male' || input.gender === 'female',
      pillars: {
        year: analysis.pillars.year.full,
        month: analysis.pillars.month.full,
        day: analysis.pillars.day.full,
        hour: analysis.pillars.hour?.full ?? null,
      },
      dayMaster: {
        hanja: analysis.dayMaster.hanja,
        korean: analysis.dayMaster.korean,
        element: analysis.dayMaster.element,
        symbolName: analysis.dayMaster.symbolName,
      },
      elements: {
        counts: analysis.elements.counts,
        summary: analysis.elements.summary,
        dominant: analysis.elements.dominant.name,
        lacking: analysis.elements.lacking.name,
      },
      geokguk: { name: analysis.geokguk.name, description: analysis.geokguk.description },
      bodyStrength: { level: analysis.bodyStrength.level, summary: analysis.bodyStrength.summary },
      yongsin: { name: analysis.yongsin.name, meaning: analysis.yongsin.meaning },
      annual: {
        yearName: analysis.annual2026.yearName,
        theme: analysis.annual2026.theme,
        keyOpportunity: analysis.annual2026.keyOpportunity,
        caution: analysis.annual2026.caution,
      },
      daeun: analysis.daeun,
      shortDigest: analysis.shortDigest,
      note: '앱의 calculateDetailedSaju 결과입니다. 한국 표준시 벽시계와 23:30 일주 경계를 따르며 진태양시는 보정하지 않습니다. 성별이 없으면 대운 방향은 확정하지 않습니다. 상징 해석이며 사건·건강·합격을 단정하지 않습니다.',
    },
  };
}

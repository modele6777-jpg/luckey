import { TAROT_DECK, type TarotCard } from '../../src/data/tarotData.ts';
import { postReadingApi, ReadingApiError, upstreamErrorMessage } from './readingApiClient.ts';

export const TAROT_SPREAD_GAP = '앱에는 여러 장 타로 배열 전용 HTTP API가 없습니다. 화면은 브라우저에서 프롬프트를 만든 뒤 범용 /api/openai/v1/chat/completions를 호출하고, 그 경로는 사용자 인증이 없습니다. MCP는 그 범용 모델 프록시를 호출하지 않습니다.';
export const ORACLE_GAP = '사주와 타로를 합친 consult_oracle용 HTTP API는 없습니다. 카드 이름만 넣은 고정 문장으로 대체하지 않습니다.';

export function readTarotUsesDailyApi(args: { theme?: unknown; cards?: unknown } | undefined): boolean {
  if (args?.theme && args.theme !== 'daily') return false;
  if (Array.isArray(args?.cards) && args.cards.length > 1) return false;
  return true;
}

function deckCard(id: string): TarotCard | null {
  return TAROT_DECK.find((card) => card.id === id) ?? null;
}

export function selectTarotCard(input: { cardId?: unknown; reversed?: unknown } = {}): TarotCard | { error: string } {
  if (input.cardId !== undefined) {
    if (typeof input.cardId !== 'string' || !input.cardId.trim()) return { error: '카드 id가 필요합니다.' };
    const card = deckCard(input.cardId.trim());
    if (!card) return { error: '덱에 없는 카드 id입니다.' };
    return { ...card, reversed: Boolean(input.reversed) };
  }
  const raw = TAROT_DECK[Math.floor(Math.random() * TAROT_DECK.length)];
  return { ...raw, reversed: Math.random() < 0.25 };
}

export function dailyTarotPayload(card: TarotCard, options: { name?: unknown; concern?: unknown } = {}) {
  const name = typeof options.name === 'string' ? options.name.trim() : '';
  const concern = typeof options.concern === 'string' ? options.concern.trim() : '';
  return {
    card: {
      id: card.id,
      name: card.name,
      nameKo: card.nameKo,
      type: card.type,
      keywords: card.keywords,
      reversed: Boolean(card.reversed),
    },
    mode: 'oracle',
    comfortLevel: 3,
    ...(name || concern ? {
      profile: {
        ...(name ? { basic: { nickname: name } } : {}),
        ...(concern ? { fate: { currentWorry: concern } } : {}),
      },
    } : {}),
  };
}

export async function fetchDailyTarot(card: TarotCard, options: { name?: unknown; concern?: unknown } = {}) {
  const payload = dailyTarotPayload(card, options);
  try {
    const upstream = await postReadingApi('/api/ai/daily-tarot', payload);
    if (upstream.status < 200 || upstream.status >= 300) {
      return { ok: false as const, status: upstream.status, message: upstreamErrorMessage(upstream.status, upstream.body) };
    }
    return { ok: true as const, payload, api: upstream.body };
  } catch (error) {
    const status = error instanceof ReadingApiError ? error.status : 502;
    const message = error instanceof Error ? error.message : '리딩 API에 연결하지 못했습니다.';
    return { ok: false as const, status, message };
  }
}

export async function fetchSajuChart(args: Record<string, unknown>) {
  const payload = {
    year: args.year,
    month: args.month,
    day: args.day,
    ...(args.birthtime !== undefined ? { birthtime: args.birthtime } : {}),
    ...(args.isLunar !== undefined ? { isLunar: args.isLunar } : {}),
    ...(args.isLeapMonth !== undefined ? { isLeapMonth: args.isLeapMonth } : {}),
    ...(args.gender !== undefined ? { gender: args.gender } : {}),
  };
  try {
    const upstream = await postReadingApi('/api/saju/chart', payload);
    if (upstream.status < 200 || upstream.status >= 300) {
      return { ok: false as const, status: upstream.status, message: upstreamErrorMessage(upstream.status, upstream.body) };
    }
    return { ok: true as const, api: upstream.body };
  } catch (error) {
    const status = error instanceof ReadingApiError ? error.status : 502;
    const message = error instanceof Error ? error.message : '리딩 API에 연결하지 못했습니다.';
    return { ok: false as const, status, message };
  }
}

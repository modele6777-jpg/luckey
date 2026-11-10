import { describeGeminiError } from '../geminiKey.ts';

export interface DiaryAnalysis {
  keywords: string[];
  emotions: string[];
  source: 'model' | 'engine';
}

export function parseAnalysisJson(raw: string | undefined | null): { keywords: string[]; emotions: string[] } | null {
  const text = (raw || '').trim();
  if (!text) return null;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1]?.trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  const candidates = [fenced, start >= 0 && end > start ? text.slice(start, end + 1) : '', text].filter((value): value is string => Boolean(value));
  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as { keywords?: unknown; emotions?: unknown };
      if (Array.isArray(parsed.keywords) && Array.isArray(parsed.emotions)) {
        return {
          keywords: parsed.keywords.filter((item): item is string => typeof item === 'string').slice(0, 5),
          emotions: parsed.emotions.filter((item): item is string => typeof item === 'string').slice(0, 3),
        };
      }
    } catch { /* next candidate */ }
  }
  return null;
}

export function heuristicDiaryAnalysis(content: string): DiaryAnalysis {
  const emotions: string[] = [];
  const lower = content.toLowerCase();
  const dictionary = [
    { keys: ['기쁨', '행복', '감사', '사랑', '설렘', '즐거', 'happy', 'love', 'joy'], tag: '평온/기쁨' },
    { keys: ['슬픔', '우울', '눈물', '외롭', '쓸쓸', 'sad', 'blue', 'lonely'], tag: '내면의 슬픔' },
    { keys: ['불안', '걱정', '두려', '초조', '긴장', 'scared', 'anxious', 'worry'], tag: '정서적 초조' },
    { keys: ['분노', '화가', '짜증', '억울', '미움', 'angry', 'irritated'], tag: '의식의 마찰' },
    { keys: ['지침', '피곤', '소진', '번아웃', '무기력', 'tired', 'exhausted'], tag: '에너지 소진' },
  ];
  for (const entry of dictionary) {
    if (entry.keys.some((key) => lower.includes(key))) emotions.push(entry.tag);
  }
  if (!emotions.length) emotions.push('미묘한 중립');
  const words = content.split(/\s+/).filter((word) => word.length > 1 && !word.startsWith('#'));
  const keywords = [...new Set(words)].slice(0, 4);
  if (!keywords.length) keywords.push('내면 기록', '일상');
  return { keywords, emotions, source: 'engine' };
}

export async function requestDiaryAnalysis(
  generate: (plain: boolean) => Promise<{ text?: string }>,
): Promise<DiaryAnalysis> {
  let last = 'empty';
  try {
    const structured = parseAnalysisJson((await generate(false)).text);
    if (structured?.keywords.length && structured.emotions.length) return { ...structured, source: 'model' };
    last = 'structured response had no keywords';
  } catch (error) {
    last = describeGeminiError(error);
  }
  console.warn('[analyze-entry] structured Gemini call was not usable:', last);
  try {
    const plain = parseAnalysisJson((await generate(true)).text);
    if (plain?.keywords.length && plain.emotions.length) return { ...plain, source: 'model' };
    last = 'plain response had no keywords';
  } catch (error) {
    last = describeGeminiError(error);
  }
  console.warn('[analyze-entry] plain Gemini call was not usable:', last);
  throw new Error(last);
}

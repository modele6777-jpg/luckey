import { TAROT_READING_VOICE } from '../../src/lib/tarotReadingVoice.ts';
import type { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { buildSpecificTarotDailyOracle } from '../../src/lib/dailyTarotOracle.ts';
import { repairDirectionSummaryLine } from '../../src/lib/tarotSummaryUtils.ts';
import { describeGeminiError, getGeminiApiKey } from '../geminiKey.ts';

export interface DailyTarotModelResponse {
  text?: string;
}

export interface DailyTarotRouteOptions {
  /** Explicit key. An empty string skips the model and uses the local card engine. */
  apiKey?: string;
  callModel?: (
    apiKey: string,
    contents: unknown,
    config: Record<string, unknown>,
  ) => Promise<DailyTarotModelResponse>;
}

function cleanDailyTarotDiagnosis(rawText: string): string {
  if (!rawText) return '';
  let text = rawText.trim();

  const section1Matches = [...text.matchAll(/(?:\r?\n|^)\s*###\s*(?:[✨👑💎🌟⚡🏆💰🌅💌☯️🛤️🕯️☀️🧭]\s*)?1[\.\s][^\r\n]*/gi)];
  if (section1Matches.length > 1) {
    const secondIndex = section1Matches[1].index;
    if (secondIndex && secondIndex > 100) {
      const firstPart = text.slice(0, secondIndex).trim();
      const secondPart = text.slice(secondIndex).trim();
      if (firstPart.includes('5.') || firstPart.includes('축복') || firstPart.includes('영혼의 한마디')) {
        text = firstPart;
      } else if (secondPart.includes('5.') || secondPart.includes('축복') || secondPart.includes('영혼의 한마디')) {
        text = secondPart;
      } else {
        text = firstPart;
      }
    }
  }

  const halfLen = Math.floor(text.length / 2);
  if (halfLen > 120) {
    const firstHalf = text.slice(0, halfLen).trim();
    const secondHalf = text.slice(halfLen).trim();
    if (firstHalf === secondHalf || secondHalf.startsWith(firstHalf.slice(0, 100))) {
      text = firstHalf;
    }
  }

  const firstSectionIdx = text.search(/(?:\r?\n|^)\s*###\s*(?:[✨👑💎🌟⚡🏆💰🌅💌☯️🛤️🕯️☀️🧭]\s*)?1[\.\s]/);
  if (firstSectionIdx !== -1) {
    const bodyPart = text.slice(firstSectionIdx);
    const trailingSummaryIdx = bodyPart.search(/(?:\r?\n|^)\s*(?:[-*•·\d.]+\s*)?(?:#{1,6}\s*)?(?:\*{1,2}|_{1,2})?\s*(?:[✨🌟🔮📌💡📋💎⚡🌿🎯■]\s*)*\s*(?:[\[【(])?\s*(?:[✨🌟🔮📌💡📋💎⚡🌿🎯■]\s*)*\s*(?:핵심\s*(?:3줄|세줄|3대)?\s*요약|3줄\s*요약|세줄\s*요약|핵심\s*요약|오늘의\s*요약|Quick\s*Summary)[^\]】)\r\n]*(?:[\]】)])?\s*(?:\*{1,2}|_{1,2})?\s*(?:[:—\-–~]|—[^\r\n]*)?(?:\r?\n|$)/i);
    if (trailingSummaryIdx !== -1) {
      text = text.slice(0, firstSectionIdx + trailingSummaryIdx).trim();
    }
  }

  const step5Pattern = /(?:###\s*(?:[✨👑💎🌟⚡🏆💰🌅💌☯️🛤️🕯️☀️🧭]\s*)?5[\.\s]|5단계|영혼의\s*한마디|당신의\s*길을\s*축복하는)/i;
  const step5Match = text.match(step5Pattern);
  if (step5Match && step5Match.index !== undefined) {
    const afterStep5 = text.slice(step5Match.index);
    const quoteEndMatch = afterStep5.match(/(?:["”'_]\s*(?:\r?\n|$)|[.!?]\s*(?:\r?\n|$))/);
    if (quoteEndMatch && quoteEndMatch.index !== undefined) {
      const quoteEndPos = step5Match.index + quoteEndMatch.index + quoteEndMatch[0].length;
      const remainder = text.slice(quoteEndPos).trim();
      if (/(?:핵심|요약|\[현재\s*에너지\]|\[방향과\s*결단\]|\[실천\s*처방\]|[-*•]\s*\[|[-*•]\s*현재|[-*•]\s*방향|[-*•]\s*실천)/i.test(remainder)) {
        text = text.slice(0, quoteEndPos).trim();
      }
    }
  }

  return text;
}

const ORACLE_MODEL = 'gemini-flash-lite-latest';
const ORACLE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    diagnosis: { type: 'STRING' },
    luckyNumber: { type: 'STRING' },
    luckyColor: { type: 'STRING' },
    remedy: { type: 'STRING' },
    symbol: { type: 'STRING' },
    spiritualEnergy: { type: 'STRING' },
    blessingMessage: { type: 'STRING' },
    focusPlaylist: { type: 'STRING' },
  },
  required: ['diagnosis', 'luckyNumber', 'luckyColor', 'remedy', 'symbol'],
};

export interface TarotGenerateRequest {
  model: string;
  contents: unknown;
  config?: Record<string, unknown>;
}

/** One JSON object with a diagnosis string, including fenced or embedded JSON. */
export function parseOracleJson(raw: string | undefined | null): Record<string, unknown> | null {
  const text = (raw || '').trim();
  if (!text) return null;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1]?.trim();
  const candidates = [fenced, text].filter((value): value is string => Boolean(value));
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start >= 0 && end > start) candidates.push(text.slice(start, end + 1));
  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as unknown;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && typeof (parsed as { diagnosis?: unknown }).diagnosis === 'string' && (parsed as { diagnosis: string }).diagnosis.trim()) {
        const supportedFields = { ...(parsed as Record<string, unknown>) };
        delete supportedFields.frequency;
        return supportedFields;
      }
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * The structured schema call is what production was sending. A plain
 * generateContent to the same model succeeds, so a schema/timeout failure
 * retries once in that shape.
 */
export async function requestTarotModelText(
  generate: (request: TarotGenerateRequest) => Promise<{ text?: string }>,
  systemInstruction: string,
  userText: string,
): Promise<string> {
  const failures: string[] = [];
  try {
    const structured = await generate({
      model: ORACLE_MODEL,
      contents: [{ role: 'user', parts: [{ text: userText }] }],
      config: {
        systemInstruction,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
        responseSchema: ORACLE_SCHEMA,
        abortSignal: AbortSignal.timeout(8000),
      },
    });
    const parsed = parseOracleJson(structured.text);
    if (parsed) return JSON.stringify(parsed);
    failures.push('structured response had no diagnosis');
  } catch (error) {
    failures.push(describeGeminiError(error));
  }
  console.warn('[daily-tarot] structured Gemini call was not usable:', failures[failures.length - 1]);
  try {
    const plain = await generate({
      model: ORACLE_MODEL,
      contents: `${systemInstruction}\n\n${userText}\n\nJSON 객체 하나만 반환하세요. 키는 diagnosis, luckyNumber, luckyColor, remedy, symbol, spiritualEnergy, blessingMessage, focusPlaylist 입니다.`,
      config: { maxOutputTokens: 8192, abortSignal: AbortSignal.timeout(25000) },
    });
    const parsed = parseOracleJson(plain.text);
    if (parsed) return JSON.stringify(parsed);
    failures.push('plain response had no diagnosis');
  } catch (error) {
    failures.push(describeGeminiError(error));
  }
  throw new Error(failures.join(' | '));
}

async function defaultCallModel(apiKey: string, _contents: unknown, config: Record<string, unknown>): Promise<DailyTarotModelResponse> {
  const ai = new GoogleGenAI({ apiKey });
  const systemInstruction = typeof config.systemInstruction === 'string' ? config.systemInstruction : '';
  const userText = '오늘 뽑은 카드의 오라클 비전을 JSON으로 리포트해 줘.';
  const contents = _contents as { parts?: { text?: string }[] }[] | undefined;
  const fromContents = contents?.[0]?.parts?.[0]?.text || userText;
  const text = await requestTarotModelText(
    async (request) => {
      const response = await ai.models.generateContent({
        model: request.model,
        contents: request.contents as never,
        config: request.config,
      });
      return { text: response.text };
    },
    systemInstruction,
    fromContents,
  );
  return { text };
}

/** Shared by the long-running server and the Vercel catch-all. No live model call when the key is absent. */
export async function handleDailyTarotPost(req: Request, res: Response, options: DailyTarotRouteOptions = {}) {
  const { card, mode = 'oracle', profile } = req.body || {};
  if (!card) {
    return res.status(400).json({ error: '카드 정보가 필요합니다.' });
  }

  const cardNameKo = card.nameKo || card.name || '운명의 카드';
  const cardNameEn = card.name || '';
  const cardType = card.type === 'major' ? '메이저 아르카나' : `${String(card.type || 'minor').toUpperCase()} 수트 (마이너 아르카나)`;
  const cardKeywords = (card.keywords || []).join(', ') || '직관, 통찰, 조화';
  const isReversed = !!card.reversed;
  const orientation = isReversed ? '역방향 (Reversed)' : '정방향 (Upright)';

  let userContextBlock = '';
  if (profile?.basic) {
    const b = profile.basic;
    userContextBlock = `\n\n[질문자 프로필 & 사주 배경지식]:\n- 닉네임/호칭: ${b.nickname || b.name || '질문자'} (※ 실명보다 친근한 닉네임을 최우선으로 다정하게 불러주세요)\n- 생년월일: ${b.birthdate || '미입력'} (${b.lunarSolar || '양력'})\n- 생시: ${b.birthtime || '미입력'}\n- 성별: ${b.gender || '미입력'}${profile.fate?.currentWorry ? `\n- 최근 주요 고민: ${profile.fate.currentWorry}` : ''}${profile.fate?.lifeGoal ? `\n- 인생 핵심 목표: ${profile.fate.lifeGoal}` : ''}\n[배경지식 반영 필수 원칙]: 위 질문자의 기본 프로필(닉네임 호칭 우선)과 운명적 배경을 카드의 ${orientation} 상징 및 일일 비전과 깊이 있게 연계하여 서술하세요.`;
  }

  const apiKey = options.apiKey !== undefined ? options.apiKey : getGeminiApiKey();
  if (apiKey) {
    try {
      const systemInstruction = `당신은 편안한 해요체로 하루의 카드를 풀어주는 타로 상담가 트리니티예요.
오늘 뽑힌 카드: ${cardNameKo} (${cardNameEn}), ${cardType}, ${orientation}, 키워드: ${cardKeywords}
${userContextBlock}
카드 한 장으로 하루의 모든 영역을 점치지 말고 오늘 살펴볼 하나의 주제에 집중하세요. 정역방향을 지키고, 카드 뜻의 근거와 현실에서 확인할 조건을 연결하세요.
낭독 화면의 구획을 위해 diagnosis 본문에는 다음 다섯 제목을 유지하세요. 분량을 맞추기 위해 내용을 늘리지 마세요.
### 1. 오늘 먼저 눈에 들어오는 것 — 질문에 대한 첫 인상, 1~2문장.
### 2. 이 카드가 들려주는 이야기 — 상징 하나와 오늘의 맥락을 연결한 2개 짧은 단락. 해석의 중심은 이 부분이에요.
### 3. 놓치지 말아야 할 점 — 앞서 말하지 않은 조건이나 주의점, 1~2문장. 최종 판정이나 예언은 하지 마세요.
### 4. 오늘 해볼 한 가지 — 앞의 해석에 맞는 구체적 행동 하나만 제안하세요.
### 5. 여기서 잠깐 생각해 볼 것 — 질문자가 스스로 점검할 짧은 질문 하나로 끝내세요. 앞의 조언을 다시 설명하거나 확언을 붙이지 마세요.
${TAROT_READING_VOICE}
JSON 객체 하나만 반환하세요. 키는 diagnosis, luckyNumber, luckyColor, remedy, symbol, spiritualEnergy, blessingMessage, focusPlaylist 입니다. diagnosis는 위 본문이고, 부가 필드의 장식 문구를 본문에 복제하지 마세요.`;


      const config = { systemInstruction };
      const contents = [{ role: 'user', parts: [{ text: `오늘 뽑은 [${cardNameKo}] 카드의 오라클 비전을 리포트해 줘.` }] }];
      const callModel = options.callModel ?? defaultCallModel;
      const response = await callModel(apiKey, contents, config);
      const parsed = parseOracleJson(response.text);
      if (parsed?.diagnosis) {
        parsed.diagnosis = repairDirectionSummaryLine(cleanDailyTarotDiagnosis(String(parsed.diagnosis)), [card]);
        parsed.source = 'model';
        res.setHeader?.('x-luckey-oracle-source', 'model');
        return res.status(200).json(parsed);
      }
      console.warn('[daily-tarot] model response had no diagnosis, using local engine');
    } catch (err) {
      console.warn('[daily-tarot] model failed, using local engine:', describeGeminiError(err));
    }
  } else {
    console.warn('[daily-tarot] GEMINI_API_KEY is unset, using local engine');
  }

  res.setHeader?.('x-luckey-oracle-source', 'engine');
  const local = buildSpecificTarotDailyOracle(card, mode);
  return res.status(200).json({ ...local, diagnosis: repairDirectionSummaryLine(local.diagnosis, [card]), source: 'engine' });
}

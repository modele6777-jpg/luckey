import { GoogleGenAI, Modality } from "@google/genai";
import OpenAI from "openai";
import { z } from "zod";
import type { PersonaType } from "../contexts/AppContext";
import { buildCrossAppDialogueContextFromThread, LUCY_NO_YA_PREFIX_RULE } from "./lucyChatUtils";
import { auth } from "./firebase";
import { loadChatFromLocal } from "./lucyChatSync";
import { UserProfile } from "./sharedState";
import { calculateDetailedSaju } from "./sajuAnalysis";
import {
  buildAstroBestieSystemPrompt,
  buildUserNatalSummary,
  formatRelationshipsContext,
  calculateNatalChart
} from "./astrologyAnalysis";
import { buildTarotMentalSupportSystemPrompt } from "./tarotMentalSupportCoach";

// Initialization 
export function getApiBaseUrl(): string {
  return typeof window !== "undefined" ? window.location.origin : "";
}

export function parseImageDataUrl(url: string): { mimeType: string; data: string } | null {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/^data:([a-zA-Z0-9.+-]+\/[a-zA-Z0-9.+-]+);base64,(.+)$/s);
  if (match) {
    return { mimeType: match[1], data: match[2].replace(/\s+/g, '') };
  }
  if (url.length > 50 && !url.startsWith('http') && !url.includes(' ')) {
    return { mimeType: 'image/jpeg', data: url.replace(/\s+/g, '') };
  }
  return null;
}

// @ts-ignore
const rawClientKey = import.meta.env?.VITE_GEMINI_API_KEY || import.meta.env?.VITE_AI_API_KEY || '';
const geminiApiKey = rawClientKey.includes('AQ.Ab8RN6LJzmJJ3ExtNix-ERyIkxzPtsV23WdCr71NRGItFPK41A') ? '' : rawClientKey;
// @ts-ignore
const aiType = (import.meta.env?.VITE_AI_TYPE || "gemini").toLowerCase().trim();

const genAI = (aiType === "gemini" && geminiApiKey) ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;
const useOpenAI = aiType !== 'gemini' || !genAI;
const openai = new OpenAI({
  apiKey: "proxy",
  baseURL: getApiBaseUrl() + "/api/openai/v1",
  dangerouslyAllowBrowser: true // Required for client-side usage in this environment
});

// @ts-ignore
export const modelName = import.meta.env?.VITE_GEMINI_MODEL || (aiType === "grok" ? "grok-4.3" : "gemini-3.8-flash");

export interface Message {
  role: "system" | "user" | "model" | "assistant";
  content: string | any[];
}

const KOREAN_ONLY_OUTPUT_RULE = `출력 언어 및 문장 가독성 원칙:
- 모든 자연어 문장은 현대 한국어 한글로만 작성하세요.
- 한자 및 중국어 표기(예: 全程, 命運, 靈魂)를 사용하지 마세요.
- 한자어가 필요하면 반드시 자연스러운 한글 표현(예: 전 과정, 운명, 영혼)으로 바꾸세요.
- 고유명사에 원문 한자가 있어도 사용자에게는 한글 표기만 보여주세요.
- [간결성 & 가독성 원칙]: 불필요하게 길고 늘어지는 만연체 문장은 피하고, 명확하고 산뜻한 단문 위주로 작성하세요.
- 핵심 인사이트나 실천 조언은 불릿 포인트(•)와 적절한 줄바꿈을 활용하여 한눈에 들어오도록 구조화하세요.`;

function withKoreanOnlyOutput(messages: Array<{ role: "system" | "user" | "assistant"; content: any }>) {
  return [{ role: "system" as const, content: KOREAN_ONLY_OUTPUT_RULE }, ...messages];
}

const BROKEN_RESONANCE_MARKERS = [
  "생성하지 못했습니다",
  "생성하지 못했",
  "분석 결과를",
  "잠시 후 다시 시도",
  "다시 시도해",
  "ai 서비스",
  "연결 및 호출",
  "시스템 주파수 조정 안내",
  "unknown error",
  "http error",
  "failed to",
];
const GENERIC_RESONANCE_BAND = "오늘의 맞춤 주파수";

function containsBrokenResonanceText(value: unknown): boolean {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized) return true;
  return BROKEN_RESONANCE_MARKERS.some((marker) => normalized.includes(marker));
}

export const PoeInsightSchema = z.object({
  insight: z.string().describe("A brief, profound insight based on the conversation so far."),
  category: z.string().describe("Categorize the insight (e.g., 'Emotional', 'Strategic', 'Creative', 'Reflective')"),
  currentVibe: z.string().describe("The user's current mood/vibe expressed in one short poetic phrase. (e.g. '비오는 날의 차분함', '폭발하는 창의성', '깊은 위로가 필요한 밤').").optional(),
  themeColor: z.string().describe("A dark background oklch color string matching the currentVibe. (e.g., 'oklch(0.08 0.05 270)').").optional(),
});

export type PoeInsightResult = z.infer<typeof PoeInsightSchema>;

const POE_INSIGHT_FALLBACKS: Array<Pick<PoeInsightResult, "insight" | "category">> = [
  { insight: "지금 이 순간의 호흡이 가장 정확한 나침반입니다.", category: "Reflective" },
  { insight: "작은 선택 하나가 오늘의 에너지 흐름을 바꿉니다.", category: "Strategic" },
  { insight: "감정을 억누르기보다 천천히 흘려내면 마음이 가벼워집니다.", category: "Emotional" },
  { insight: "완벽한 문장보다 진심 어린 한 문장이 더 큰 울림을 남깁니다.", category: "Creative" },
];

export function createPoeInsightFallback(partial?: Partial<PoeInsightResult>): PoeInsightResult {
  const pick = POE_INSIGHT_FALLBACKS[Math.floor(Math.random() * POE_INSIGHT_FALLBACKS.length)];
  return {
    insight: pick.insight,
    category: pick.category,
    currentVibe: "고요한 밤의 성찰",
    themeColor: "oklch(0.08 0.05 270)",
    ...partial,
  };
}

function isPoeInsightSchema(schema: z.ZodTypeAny): boolean {
  if (!(schema instanceof z.ZodObject)) return false;
  const shape = schema.shape;
  return "insight" in shape && "category" in shape;
}

export function isBrokenPoeInsightResult(data: unknown): boolean {
  if (!data || typeof data !== "object") return true;
  const record = data as Record<string, unknown>;
  return containsBrokenResonanceText(record.insight);
}

export function ensurePoeInsightResult(data: unknown): PoeInsightResult {
  try {
    const parsed = PoeInsightSchema.parse(data);
    if (isBrokenPoeInsightResult(parsed)) return createPoeInsightFallback();
    return parsed;
  } catch {
    return createPoeInsightFallback();
  }
}

export function safeCoerceNumber(fallback: number, min?: number, max?: number) {
  const safeDefault = Number.isFinite(fallback) ? fallback : 0;
  return z.preprocess((val) => {
    const num = coerceHzValue(val, safeDefault);
    if (min !== undefined && num < min) return min;
    if (max !== undefined && num > max) return max;
    return Number.isFinite(num) ? num : safeDefault;
  }, z.number().default(safeDefault));
}

function coerceHzValue(value: unknown, fallback: number): number {
  const safeFallback = Number.isFinite(fallback) ? fallback : 0;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const clean = value.replace(/,/g, "").trim();
    const match = clean.match(/-?\d+(\.\d+)?/);
    if (match) {
      const parsed = parseFloat(match[0]);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return safeFallback;
}

function unwrapStructuredPayload(parsed: unknown, schema: z.ZodTypeAny): unknown {
  if (!parsed || typeof parsed !== "object") return parsed;

  const directRes = schema.safeParse(parsed);
  if (directRes.success) return parsed;

  if (Array.isArray(parsed) && parsed.length > 0) {
    for (const item of parsed) {
      if (item && typeof item === "object") {
        const itemRes = schema.safeParse(item);
        if (itemRes.success) return item;
      }
    }
  }

  const record = parsed as Record<string, unknown>;
  const priorityKeys = ["data", "result", "response", "output", "diary", "payload", "content", "item", "entry", "insight"];
  for (const pKey of priorityKeys) {
    if (pKey in record && record[pKey] && typeof record[pKey] === "object") {
      const pRes = schema.safeParse(record[pKey]);
      if (pRes.success) return record[pKey];
    }
  }

  for (const val of Object.values(record)) {
    if (val && typeof val === "object") {
      const valRes = schema.safeParse(val);
      if (valRes.success) return val;
    }
  }

  return parsed;
}

function normalizeStructuredPayload(payload: unknown): unknown {
  if (Array.isArray(payload)) {
    return payload.map((item) => normalizeStructuredPayload(item));
  }
  if (!payload || typeof payload !== "object") return payload;

  const input = payload as Record<string, unknown>;
  const output: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    if (value && typeof value === "object") {
      output[key] = normalizeStructuredPayload(value);
      continue;
    }

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
        output[key] = Number(trimmed);
        continue;
      }
    }

    output[key] = value;
  }

  // Smart alias mapping for common structured LLM fields
  if (!("text" in output) || typeof output.text !== "string" || !output.text.trim()) {
    const candidate = output.diary ?? output.content ?? output.journal ?? output.story ?? output.body ?? output.message ?? output.summary;
    if (typeof candidate === "string" && candidate.trim()) {
      output.text = candidate.trim();
    }
  }

  if (!("prompt" in output) || typeof output.prompt !== "string" || !output.prompt.trim()) {
    const candidate = output.image_prompt ?? output.imagePrompt ?? output.dalle_prompt ?? output.illustration_prompt ?? output.image ?? output.description;
    if (typeof candidate === "string" && candidate.trim()) {
      output.prompt = candidate.trim();
    }
  }

  if ("shield" in output && !("shieldToken" in output)) output.shieldToken = output.shield;
  if ("shield_token" in output && !("shieldToken" in output)) output.shieldToken = output.shield_token;
  if ("guide" in output) {
    if (!("prescription" in output)) output.prescription = output.guide;
    if (!("advice" in output)) output.advice = output.guide;
  }
  if ("solution" in output && !("prescription" in output)) output.prescription = output.solution;
  if ("action" in output && !("advice" in output)) output.advice = output.action;
  if ("tip" in output && !("advice" in output)) output.advice = output.tip;
  if ("lucky_item" in output && !("luckyItem" in output)) output.luckyItem = output.lucky_item;
  if ("lucky_color" in output && !("luckyColor" in output)) output.luckyColor = output.lucky_color;
  if ("cosmic_aspect" in output && !("cosmicAspect" in output)) output.cosmicAspect = output.cosmic_aspect;
  if ("deep_sync_level" in output && !("deepSyncLevel" in output)) output.deepSyncLevel = output.deep_sync_level;

  if ("coherence" in output) output.coherence = coerceHzValue(output.coherence, 85);
  if ("carrier" in output) output.carrier = coerceHzValue(output.carrier, 432);
  if ("beat" in output) output.beat = coerceHzValue(output.beat, 7.83);
  if ("luckScore" in output) output.luckScore = coerceHzValue(output.luckScore, 72);
  if ("loveScore" in output) output.loveScore = coerceHzValue(output.loveScore, 68);
  if ("wealthScore" in output) output.wealthScore = coerceHzValue(output.wealthScore, 74);
  if ("healthScore" in output) output.healthScore = coerceHzValue(output.healthScore, 79);

  return output;
}

export async function poeQuickInsight(input: string, history: Message[]) {
  return ensurePoeInsightResult(await invokeLLMStructured({
    messages: [
      { role: "system", content: "Analyze the current user input in the context of the conversation. Provide a very brief, high-level insight (1-2 sentences) and categorize it. Reply in Korean." },
      ...history.slice(-4).map(m => ({ role: m.role as "user"|"model"|"system"|"assistant", content: m.content })),
      { role: "user", content: input }
    ],
    schema: PoeInsightSchema
  }));
}

export async function invokeLLM(params: { messages: Message[], responseFormat?: { type: "json_object" | "text" }, timeoutMs?: number }) {
  const timeoutMs = params.timeoutMs || 25000;
  const mappedMessages = withKoreanOnlyOutput(params.messages.map(m => {
    const role = m.role === "model" ? "assistant" : m.role;
    return {
      role: role as "system" | "user" | "assistant",
      content: Array.isArray(m.content) 
        ? m.content.map(p => {
            if (p.type === 'text') return { type: 'text', text: p.text };
            return { type: 'image_url', image_url: { url: p.image_url?.url || '' } };
          }) as any
        : m.content as string
    };
  }));

  if (useOpenAI && openai) {
    try {
      const createTimeoutPromise = (ms = timeoutMs) =>
        new Promise((_, reject) => setTimeout(() => reject(new Error("AI Request Timeout")), ms));

      let response;
      try {
        response = await Promise.race([
          openai.chat.completions.create({
            model: modelName,
            messages: mappedMessages,
            response_format: params.responseFormat?.type === "json_object" ? { type: "json_object" } : undefined,
            temperature: 0.7,
          }),
          createTimeoutPromise(timeoutMs)
        ]) as any;
      } catch (firstErr) {
        console.warn("[invokeLLM] Direct client attempt timed out or failed, falling back to server proxy / Gemini:", firstErr);
      }

      if (response && response.choices && response.choices[0]) {
        const text = extractChatCompletionText(response.choices[0]?.message?.content);
        if (text) return text;
      }
    } catch (openAiError) {
      console.warn(`[invokeLLM] OpenAI client direct attempt failed:`, openAiError);
    }
  }

  // Gemini logic
  if (genAI) {
    const systemMessage = params.messages.find(m => m.role === "system");
    let contents = params.messages.filter(m => m.role !== "system");

    if (contents.length === 0 && systemMessage) {
      // Gemini requires at least one content part even if system instruction is present
      contents = [{ role: 'user', content: "Continue" }];
    }

    const modelsToTry = [
      modelName,
      "gemini-flash-latest",
      "gemini-3.1-flash-lite",
    ].filter((m, i, arr): m is string => Boolean(m) && arr.indexOf(m) === i).slice(0, 2);

    for (const currentModel of modelsToTry) {
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Gemini API Timeout")), timeoutMs)
        );

        const response = await Promise.race([
          genAI.models.generateContent({
            model: currentModel,
            contents: contents.map(m => ({
              role: m.role === "assistant" ? "model" : m.role as any,
              parts: Array.isArray(m.content) 
                ? m.content.map(p => {
                    if (p.type === 'text' || !p.image_url?.url) return { text: p.text || '' };
                    const img = parseImageDataUrl(p.image_url.url);
                    return img ? { inlineData: { data: img.data, mimeType: img.mimeType } } : { text: '' };
                  })
                : [{ text: m.content as string }],
            })),
            config: {
              systemInstruction: systemMessage?.content as string,
              responseMimeType: params.responseFormat?.type === "json_object" ? "application/json" : "text/plain",
            }
          }),
          timeoutPromise
        ]) as any;

        if (response?.text) {
          return response.text;
        }
      } catch (error: any) {
        console.warn(`[invokeLLM] Model ${currentModel} error or timeout, switching...`, error?.message || error);
      }
    }
  }

  // Server-side API proxy fallback
  try {
    const url = `${getApiBaseUrl()}/api/openai/v1/chat/completions`;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), Math.max(timeoutMs, 15000));
    const proxyResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: modelName,
        messages: mappedMessages,
        stream: false,
        temperature: 0.7,
        response_format: params.responseFormat?.type === "json_object" ? { type: "json_object" } : undefined,
      }),
      signal: controller.signal,
    });
    window.clearTimeout(timer);

    if (proxyResponse.ok) {
      const data = await proxyResponse.json();
      const cleaned = extractChatCompletionText(data?.choices?.[0]?.message?.content);
      if (cleaned) {
        return cleaned;
      }
    }
  } catch (fallbackErr) {
    console.error("[invokeLLM] Server-side API proxy fallback also failed:", fallbackErr);
  }

  throw new Error("AI request failed across all providers. Engaging automatic schema fallback.");
}

export async function textToSpeech(text: string, _voice: string = 'Kore') {
  const selectedVoice = 'Kore';
  const voiceInstruction = `Read the following Korean text aloud with a warm, gentle, clear female voice (여성 목소리) without adding any commentary:\n\n${text}`;

  if (genAI) {
    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: voiceInstruction }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: selectedVoice },
            },
          },
        },
      }) as any;

      const audioData = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData?.mimeType?.startsWith('audio/'))?.inlineData?.data;
      if (audioData) return audioData;
    } catch (error) {
      console.warn("[textToSpeech] Direct Gemini AI Studio TTS failed, falling back to server endpoint:", error);
    }
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}/api/ai/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice: selectedVoice }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.audioContent || "";
    }
  } catch (serverErr) {
    console.error("[textToSpeech] Server TTS fallback failed:", serverErr);
  }
  return "";
}

export const MemoryUpdateSchema = z.object({
  memorySummary: z.string(),
  relationships: z.array(z.object({
    name: z.string(),
    description: z.string(),
    pattern: z.string().optional()
  })),
  userPreferences: z.string(),
  currentVibe: z.string()
});

export const GlobalSyncSchema = z.object({
  summary: z.string().describe("실존 인물의 명언 내용 원문 (조언이나 창작 절대 금지)"),
  author: z.string().describe("해당 명언을 남긴 실존 인물의 정확한 이름"),
  lucyGuide: z.string().optional().default("현재 우주 주파수 수신 중"),
  museGuide: z.string().optional().default("영감 충전 중"),
  orangeGuide: z.string().optional().default("비타민 채우는 중"),
  bluebirdGuide: z.string().optional().default("날개 쉬는 중"),
  healGuide: z.string().optional().default("에너지 회복 중"),
  prologueGuide: z.string().optional().default("차원 연결 완료"),
  epilogueGuide: z.string().optional().default("여정 기록 완료"),
  themeColor: z.string().describe("현재 사용자의 감정 상태(Vibe)에 어울리는 백그라운드 색상. 반드시 'oklch(0.08 0.05 270)' 와 같은 어두운 배경용 oklch CSS 값이어야 함.").optional(),
});

export type GlobalSyncResult = z.infer<typeof GlobalSyncSchema>;

const GLOBAL_SYNC_QUOTES: Array<Pick<GlobalSyncResult, "summary" | "author">> = [
  { summary: "진정한 발견의 여정은 새로운 풍경을 찾는 것이 아니라, 새로운 눈을 가지는 데 있다.", author: "마르셀 프루스트" },
  { summary: "오늘 할 수 있는 일을 내일로 미루지 마라.", author: "벤저민 프랭클린" },
  { summary: "가장 어두운 밤도 끝나고, 해는 떠오른다.", author: "빅터 위고" },
  { summary: "천 리 길도 한 걸음부터.", author: "노자" },
  { summary: "삶이 있는 한 희망은 있다.", author: "키케로" },
  { summary: "우리가 두려워해야 할 것은 두려움 그 자체다.", author: "프랭클린 D. 루즈벨트" },
];

export function createGlobalSyncFallback(partial?: Partial<GlobalSyncResult>): GlobalSyncResult {
  const pick = GLOBAL_SYNC_QUOTES[Math.floor(Math.random() * GLOBAL_SYNC_QUOTES.length)];
  return {
    summary: pick.summary,
    author: pick.author,
    lucyGuide: "오늘의 우주 리듬에 귀 기울여 보세요.",
    museGuide: "작은 영감 하나로 창작의 문을 열 수 있습니다.",
    orangeGuide: "아이디어를 가볍게 적어보면 흐름이 살아납니다.",
    bluebirdGuide: "호흡을 고르게 하면 마음의 파동이 안정됩니다.",
    healGuide: "몸의 긴장을 내려놓는 것만으로도 회복이 시작됩니다.",
    prologueGuide: "오늘의 시작을 차분한 의식으로 맞이해 보세요.",
    epilogueGuide: "오늘의 경험을 한 줄로 남겨 보세요.",
    themeColor: "oklch(0.08 0.05 270)",
    ...partial,
  };
}

function isGlobalSyncSchema(schema: z.ZodTypeAny): boolean {
  if (!(schema instanceof z.ZodObject)) return false;
  const shape = schema.shape;
  return "summary" in shape && "author" in shape && "lucyGuide" in shape;
}

export function isBrokenGlobalSyncResult(data: unknown): boolean {
  if (!data || typeof data !== "object") return true;
  const record = data as Record<string, unknown>;
  const textFields = ["summary", "author", "lucyGuide", "museGuide", "orangeGuide", "bluebirdGuide", "healGuide"];
  return textFields.some((key) => containsBrokenResonanceText(record[key]));
}

export function ensureGlobalSyncResult(data: unknown): GlobalSyncResult {
  try {
    const parsed = GlobalSyncSchema.parse(data);
    if (isBrokenGlobalSyncResult(parsed)) return createGlobalSyncFallback();
    return parsed;
  } catch {
    return createGlobalSyncFallback();
  }
}

export const EPILOGUE_FALLBACK_MARKERS = [
  "차원에는 아직 남겨진 세션 기록이 없지만",
  "번의 의식적 탐색이 이어졌습니다",
  "기본 요약을 표시했습니다",
  "AI 요약 생성에 실패",
  "[AI 서비스 안내]",
  "미설정 또는 만료",
  "Google Gemini API 키",
  "GEMINI_API_KEY",
  "API 키 미설정",
  "안녕하세요! 오늘 당신의 마음 상태는 어떠신가요?",
] as const;

/**
 * Detects whether a midnight whisper or epilogue feedback text is broken, corrupted, or an API error banner.
 */
export function isBrokenMidnightWhisper(text?: string | null): boolean {
  if (!text) return false;
  const str = String(text).trim();
  if (!str) return false;
  if (str.length < 15) return true;

  const errorMarkers = [
    '[ai 서비스 안내]',
    '일시적인 원인으로 인해 응답을 생성하지 못했습니다',
    'google gemini api 키',
    'gemini_api_key',
    'api 키 미설정',
    '미설정 또는 만료',
    'rate limit exceeded',
    'invalid api key',
    'internal engine error',
    'internal server error',
    'failed to fetch',
    'network error',
    'sk-poe',
    'openai error',
    '조치 가이드:',
    'ai studio 우측 상단 settings',
    'choices[0]',
    'undefined',
    'null',
    '[object object]',
    '안녕하세요! 오늘 당신의 마음 상태는 어떠신가요?',
  ];

  const lower = str.toLowerCase();
  for (const marker of errorMarkers) {
    if (lower.includes(marker)) return true;
  }

  if ((str.startsWith('{') && str.endsWith('}')) || (str.startsWith('[') && str.endsWith(']'))) {
    try {
      JSON.parse(str);
      return true;
    } catch {
      // not json
    }
  }

  for (const fallback of EPILOGUE_FALLBACK_MARKERS) {
    if (str.includes(fallback)) return true;
  }

  return false;
}

/**
 * Generates an authentic, emotionally soothing, poetic midnight whisper fallback for Lucy.
 */
export function createLucyMidnightWhisperFallback(params: {
  userName?: string;
  mood?: string;
  gratitudes?: string[];
  footprintSummary?: string;
}): string {
  const name = (params.userName || '당신').trim();
  const mood = (params.mood || '평온함').trim();
  const gratStr = (params.gratitudes || []).map((g) => g.trim()).filter(Boolean)[0] || '';

  const templates = [
    `오늘 하루도 온 힘을 다해 아름답게 빛나주신 ${name} 님께 깊은 감사를 전합니다. 마음에 머물렀던 작은 불안과 피로는 깊어가는 밤하늘에 가볍게 띄워 보내고, 고요하고 온전한 평화 속에서 깊은 안식을 맞이하시길 바랍니다. 내일 아침, 우주는 더욱 눈부신 사랑과 빛으로 당신을 다시 따뜻하게 안아줄 거예요.`,
    `어지러운 세상 속에서도 나만의 속도로 하루를 지켜낸 ${name} 님의 걸음은 그 자체로 거룩한 기적이었습니다. ${gratStr ? `오늘 마음에 새긴 '${gratStr}'의 소중한 빛처럼, ` : ''}당신의 내면에는 이미 어떤 바람에도 흔들리지 않는 평화의 별이 빛나고 있습니다. 모든 무거운 짐을 내려놓고 가장 포근한 밤을 보내세요.`,
    `오늘 밤, ${name} 님의 영혼에 머무는 ${mood}의 숨결이 지친 마음을 다정하게 감싸 안아주기를 기도합니다. 지나간 하루의 모든 순간은 성장의 거룩한 씨앗이었으니 아무런 후회 없이 깊은 잠에 드셔도 괜찮습니다. 내일은 오늘보다 더 맑고 찬란한 가능성이 당신을 기다리고 있을 것입니다.`,
    `소란했던 하루의 파도가 잦아들고, 오직 ${name} 님만의 고요한 자정이 찾아왔습니다. 오늘 스스로에게 건넨 작은 정성과 마음의 발자취는 이미 우주의 중심에 아름다운 파동으로 새겨졌습니다. 이제 모든 걱정을 내려놓고, 온 우주가 드리는 다정한 축복 속에서 평온한 꿈을 꾸세요.`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Invokes LLM for Lucy's Midnight Whisper (자정의 속삭임).
 * Transforms the user's daily closing state into a poetic, comforting 3-4 sentence benediction.
 */
export async function invokeLucyMidnightWhisperLLM(params: {
  userName?: string;
  mood?: string;
  gratitudes?: string[];
  mindDiary?: string;
  rawNotes?: string;
  footprintSummary?: string;
}): Promise<string> {
  const systemPrompt = `당신은 PRISM 우주의 다정하고 지혜로운 수호자 루시(Lucy)입니다.
사용자가 오늘 하루를 마무리하며 남긴 기분, 감사, 마음일기, 그리고 5대 우주 활동(Secret, Lucky, Letting Go, Ho'oponopono, Art)의 발자취를 온마음으로 읽고,
하루의 피날레를 평온하게 매듭짓는 3~4문장의 따뜻하고 시적인 "자정의 축복 속삭임(Lucy's Midnight Whisper)"을 건네주세요.

[작성 필수 지침]:
1. 어조: 깊은 위로와 공감, 내면의 평화를 선물하는 다정하고 자애로운 어조(~했군요, ~하길 바라요, ~예요, ~합니다 등 부드러운 경어체).
2. 내용:
   - 사용자가 오늘 지나온 노력과 감정의 결을 온전히 긍정하고 안아주기
   - 무거운 생각과 피로를 밤하늘의 고요 속으로 가볍게 내려놓도록 이끌기
   - 내일의 새로운 아침을 향한 은은한 희망과 깊은 안식을 축복하기
3. 분량: 3~4문장의 완성도 높은 문단 (문장이 중간에 끊기지 않고 온전한 마침표로 끝나야 함).
4. 출력 형식: 큰따옴표(""), 마크다운 제목(###), 불필요한 머리말 태그([루시의 자정 메시지] 등) 없이, 바로 나레이션으로 낭독할 수 있는 순수한 축복 메시지 본문 텍스트만 출력하세요.`;

  const validGratitudes = (params.gratitudes || []).map((g) => g.trim()).filter(Boolean);
  const userPrompt = `[작성자 및 오늘 하루 정보]
- 이름/닉네임: ${params.userName || '나'}
- 오늘 밤 기분과 에너지: ${params.mood || '평온함'}
- 오늘 감사했던 순간들: ${validGratitudes.length > 0 ? validGratitudes.join(', ') : '마음의 평온함'}
- 오늘의 마음일기 및 성찰: ${params.mindDiary?.trim() || params.rawNotes?.trim() || '오늘 하루를 무사히 살아내고 마음을 차분히 정리함'}
- 오늘 거쳐간 5대 우주 발자취: ${params.footprintSummary?.trim() || '하루의 고요한 성찰'}

위 하루의 여정을 따뜻하게 안아주는 루시의 자정 축복 속삭임 본문을 3~4문장으로 작성해 주세요.`;

  try {
    const res = await invokeLLM({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    });

    let cleaned = extractChatCompletionText(res) || String(res || '').trim();

    // Remove markdown code block fences if any
    cleaned = cleaned.replace(/^```[\w]*\s*/i, '').replace(/\s*```$/i, '').trim();

    // Strip leading titles/headers like [루시의 자정 메시지], ### 자정의 속삭임, 루시: etc.
    cleaned = cleaned
      .replace(/^(?:###|\*\*|\[|【)?[^\n\r:]*(?:자정|속삭임|Midnight|Whisper|축복|피날레)[^\n\r:]*(?:\]|】|\*\*|:|-)?(?:\n+)?/i, '')
      .replace(/^["'“‘]+/, '')
      .replace(/["'”’]+$/, '')
      .trim();

    if (cleaned && cleaned.length >= 25 && !isBrokenMidnightWhisper(cleaned)) {
      // Ensure sentence properly ends with terminal punctuation
      if (!/[.!?~다요죠]$/.test(cleaned)) {
        cleaned += '.';
      }
      return cleaned;
    }
  } catch (err) {
    console.warn('[invokeLucyMidnightWhisperLLM] LLM call failed, falling back:', err);
  }

  return createLucyMidnightWhisperFallback(params);
}
/**
 * Real-time Repetition / Degeneration Loop Detector
 * Detects runaway token repetition (e.g. "shame shame shame shame...") strictly at the trailing end of generation.
 * Carefully avoids false positives on normal speech and ensures responses are never cut off prematurely.
 */
export function checkRepetitionLoop(text: string): { isLoop: boolean; cleaned: string } {
  if (!text || text.length < 30) return { isLoop: false, cleaned: text };

  // Only check the active tail of the generation (last 300 chars) where a runaway loop occurs
  const tail = text.slice(-300);

  // Same word (at least 2 letters) repeating 5 or more times consecutively at the tail
  const tailLoopRegex = /(?:^|\s)([a-zA-Z가-힣]{2,})(?:[\s,.-]+\1){4,}[\s,.-]*$/i;
  const match = tailLoopRegex.exec(tail);
  if (match) {
    const cutPosInTail = match.index;
    const fullCutIndex = (text.length - 300) + cutPosInTail;
    const cleaned = text.slice(0, fullCutIndex).trim();
    return { isLoop: true, cleaned };
  }

  return { isLoop: false, cleaned: text };
}

export function extractChatCompletionText(content: unknown): string {
  let raw = "";
  if (typeof content === "string") raw = content.trim();
  else if (Array.isArray(content)) {
    raw = content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "text" in part) {
          return String((part as { text?: string }).text ?? "");
        }
        return "";
      })
      .join("")
      .trim();
  }
  if (!raw) return "";
  const loopCheck = checkRepetitionLoop(raw);
  return loopCheck.isLoop ? (loopCheck.cleaned || "마음속에 무거운 감정이 밀려왔나 봐. 천천히 숨을 고르고, 편안하게 이야기해 줘.") : raw;
}

export function isFallbackEpilogueSummary(summary: string | undefined | null): boolean {
  if (!summary?.trim()) return true;
  return EPILOGUE_FALLBACK_MARKERS.some((marker) => summary.includes(marker));
}

export async function invokeEpilogueSummaryLLM(messages: Message[]): Promise<string> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Epilogue summary request timed out (10s)")), 10000);
  });

  const attemptInvoke = async (): Promise<string> => {
    // 1. First Attempt: Direct Ultra-Fast Gemini Flash Lite with generous token limit
    if (genAI) {
      const systemMessage = messages.find(m => m.role === "system");
      let contents = messages.filter(m => m.role !== "system");
      if (contents.length === 0 && systemMessage) {
        contents = [{ role: 'user', content: "성찰 요약 생성" }];
      }

      const fastModels = ["gemini-3.7-flash", "gemini-3.1-flash-lite", "gemini-3.5-flash", "gemini-3.6-flash", modelName].filter(
        (m, i, arr): m is string => Boolean(m) && arr.indexOf(m) === i
      );

      for (const currentModel of fastModels) {
        try {
          const directTimeout = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Direct Gemini timeout")), 4500)
          );

          const response = await Promise.race([
            genAI.models.generateContent({
              model: currentModel,
              contents: contents.map(m => ({
                role: m.role === "assistant" ? "model" : (m.role as any),
                parts: Array.isArray(m.content)
                  ? m.content.map(p => ({ text: (p as any).text || '' }))
                  : [{ text: String(m.content || '') }],
              })),
              config: {
                systemInstruction: systemMessage?.content as string,
                temperature: 0.7,
                maxOutputTokens: 1024,
              }
            }),
            directTimeout
          ]) as any;

          const text = response?.text ? extractChatCompletionText(response.text) : '';
          if (text && !isFallbackEpilogueSummary(text)) {
            return text;
          }
        } catch (fastErr) {
          console.warn(`[invokeEpilogueSummaryLLM] Direct ${currentModel} attempt skipped:`, fastErr);
        }
      }
    }

    // 2. Second Attempt: Fast server proxy endpoint with 6s abort
    try {
      const mapped = withKoreanOnlyOutput(
        messages.map((message) => ({
          role: (message.role === "model" ? "assistant" : message.role) as "system" | "user" | "assistant",
          content: Array.isArray(message.content)
            ? message.content.map((part) => {
                if (part.type === "text") return { type: "text", text: part.text };
                return { type: "image_url", image_url: { url: part.image_url?.url || "" } };
              })
            : (message.content as string),
        })),
      );
      const url = `${getApiBaseUrl()}/api/openai/v1/chat/completions`;
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 6000);
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: modelName,
          messages: mapped,
          stream: false,
          temperature: 0.7,
          max_tokens: 1024,
        }),
        signal: controller.signal,
      });
      window.clearTimeout(timer);

      if (response.ok) {
        const data = await response.json();
        const cleaned = extractChatCompletionText(data?.choices?.[0]?.message?.content);
        if (cleaned && !isFallbackEpilogueSummary(cleaned)) {
          return cleaned;
        }
      }
    } catch (proxyError) {
      console.warn("[invokeEpilogueSummaryLLM] Fast proxy attempt failed:", proxyError);
    }

    // 3. Third Attempt: Standard invokeLLM fallback
    try {
      const response = await invokeLLM({ messages });
      const cleaned = extractChatCompletionText(response) || String(response || "").trim();
      if (cleaned && !isFallbackEpilogueSummary(cleaned)) {
        return cleaned;
      }
    } catch (error) {
      console.warn("[invokeEpilogueSummaryLLM] Standard invokeLLM failed:", error);
    }

    throw new Error("AI 요약 생성 응답이 유효하지 않습니다.");
  };

  return Promise.race([attemptInvoke(), timeoutPromise]);
}

/**
 * Invokes LLM to transform user's rough/brief notes into a polished 1st-person poetic mind diary.
 */
export async function invokeMindDiaryLLM(params: {
  rawNotes: string;
  mood?: string;
  gratitudes?: string[];
  footprintSummary?: string;
  userName?: string;
}): Promise<string> {
  const systemPrompt = `당신은 PRISM 우주의 감성 소울 작가이자 다정한 치유사입니다.
사용자가 하루를 마무리하며 자유롭고 거칠게 적은 짧은 메모나 키워드, 감정을 바탕으로,
깊은 울림과 따뜻한 위로, 문학적 품격이 살아있는 아름다운 1인칭 '오늘의 마음일기(Soul Mind Diary)'를 완성해 주세요.

[작성 지침]
1. 시점: 사용자 본인의 독백인 1인칭 시점('나', '오늘의 나는' 등)으로 자연스럽고 서정적인 어조로 서술하세요.
2. 어조: 차분하고 따뜻하며, 지나온 하루를 온전히 긍정하고 안아주는 다정한 문체(~했다, ~였을까, ~다 등 품격 있는 일기체).
3. 구성: 
   - 하루의 순간과 감정의 결(메모 내용 반영)
   - 그 안에서 피어난 작은 감사와 깨달음
   - 밤하늘 아래 나 자신에게 건네는 평온한 안식과 내일에 대한 고요한 신뢰
4. 분량: 4~6문장 내외 (낭독했을 때 약 40~60초 정도 분량으로 듣기 편안한 호흡).
5. 불필요한 제목 태그(예: [일기] 등)나 머리말/인사말 없이, 바로 읽을 수 있는 순수한 일기 본문 텍스트만 출력하세요.`;

  const validGratitudes = (params.gratitudes || []).filter((g) => g && g.trim());
  const userPrompt = `[작성자 정보]
- 닉네임: ${params.userName || '나'}
- 오늘 밤 마음 상태: ${params.mood || '평온함'}
- 감사했던 순간들: ${validGratitudes.length > 0 ? validGratitudes.join(', ') : '하루의 평화'}
- 오늘 거쳐간 우주 발자취: ${params.footprintSummary || '하루의 성찰'}

[사용자가 적은 간단한 메모/초안]
${params.rawNotes.trim() || '오늘 하루를 무사히 보내고 조용히 나만의 시간을 갖는다.'}

위 메모를 바탕으로 아름답고 감동적인 마음일기 본문을 완성해 주세요.`;

  try {
    const res = await invokeLLM({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    });
    const cleaned = extractChatCompletionText(res) || String(res || '').trim();
    if (cleaned && cleaned.length > 15) return cleaned;
  } catch (err) {
    console.warn('[invokeMindDiaryLLM] failed, falling back:', err);
  }

  // Graceful fallback if offline or failed
  const base = params.rawNotes.trim() || '오늘 하루를 무사히 마주하며 조용히 숨을 고른다.';
  return `오늘 하루, 분주히 흘러가는 시간 속에서도 나는 나만의 걸음으로 하루를 채워나갔다. ${base} 마음에 머물렀던 수많은 생각과 감정들을 가만히 바라보며, 이 모든 순간들이 나를 이루는 소중한 조각이었음을 느낀다. 밤의 고요가 세상을 덮어주듯, 나 역시 지친 마음을 따뜻하게 감싸 안는다. 무거운 것들은 밤하늘에 가볍게 띄워 보내고, 온전한 평화 속에서 깊은 쉼을 맞이한다.`;
}

export interface ECPRPrescriptionResult {
  emergencyTitle: string;
  soothingMessage: string;
  step1Somatic: string;
  step2Respiration: string;
  step3Mantra: string;
  fullVoiceScript: string;
}

/**
 * Invokes LLM for eCPR (Emotional CPR) instant 30-second emergency soothing prescription.
 */
export async function invokeECPRPrescriptionLLM(params: {
  distressType: string;
  situationOrSymptoms: string;
  userName?: string;
}): Promise<ECPRPrescriptionResult> {
  const systemPrompt = `당신은 PRISM 감정 긴급 구급대(eCPR: Emotional CPR)의 수석 심리 안정 닥터이자 다정한 치유자 루시(Lucy)입니다.
사용자가 극심한 패닉, 불안, 분노, 슬픔, 멘탈 붕괴, 번아웃 등 긴급한 감정적 위기 상황에 처해 있습니다.
지금 당장 30초 안에 실천하여 신경계를 진정시키고 안전감을 회복할 수 있는 초응급 심리 구급 처방전을 작성해 주세요.

[처방 지침]
1. 어조: 매우 차분하고 낮고 다정하며 절대적인 안전감과 확신을 주는 어조.
2. 구성:
  - emergencyTitle: 긴급 상황 맞춤 처방명 (예: '급성 패닉 및 심장 두근거림 즉각 진정 처방')
  - soothingMessage: 즉각적인 안심과 포용을 주는 2~3문장의 온기 어린 말 ('당신은 지금 안전합니다. 저와 함께 숨을 고르면 금방 가라앉습니다.')
  - step1Somatic: 10초 신체 생체 리셋 조치 (차가운 물, 쇄골 태핑, 발바닥 접지 등 구체적 행동)
  - step2Respiration: 10초 호흡 진정 가이드 (4-7-8 호흡, 복식 호흡 등 구체적 호흡법)
  - step3Mantra: 10초 구급 마음 확언 (소리 내어 읽거나 속으로 되뇔 수 있는 강력한 한 문장)
  - fullVoiceScript: 음성(TTS Kore)으로 낭독했을 때 들을 수 있는 부드럽고 일관된 40초 내외의 음성 대본

반드시 아래 JSON 포맷으로만 응답하세요. 다른 설명은 출력하지 마세요:
{
  "emergencyTitle": "...",
  "soothingMessage": "...",
  "step1Somatic": "...",
  "step2Respiration": "...",
  "step3Mantra": "...",
  "fullVoiceScript": "..."
}`;

  const userPrompt = `[환자(사용자) 정보]
- 닉네임: ${params.userName || '여행자'}
- 긴급 감정 유형: ${params.distressType}
- 현재 증상 및 호소 내용: ${params.situationOrSymptoms || '갑작스러운 감정적 압도감'}

위 상태에 대한 eCPR 초응급 감정 구급 처방을 내려주세요.`;

  try {
    const res = await invokeLLM({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      responseFormat: { type: "json_object" }
    });
    const cleaned = extractChatCompletionText(res) || String(res || '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.emergencyTitle && parsed.step1Somatic) {
        return {
          emergencyTitle: parsed.emergencyTitle || 'eCPR 즉각 감정 안정 처방',
          soothingMessage: parsed.soothingMessage || '괜찮습니다. 당신은 지금 안전한 곳에 있습니다. 천천히 저와 함께 호흡해 보세요.',
          step1Somatic: parsed.step1Somatic || '양 손바닥을 쇄골 밑 가슴에 얹고 가볍게 톡톡 두드려 주세요.',
          step2Respiration: parsed.step2Respiration || '코로 4초간 숨을 들이마시고, 입으로 8초간 길게 후- 비워냅니다.',
          step3Mantra: parsed.step3Mantra || '이 감정은 지나가는 파도일 뿐, 나는 온전하고 안전하다.',
          fullVoiceScript: parsed.fullVoiceScript || `${parsed.soothingMessage} ${parsed.step1Somatic} ${parsed.step2Respiration} ${parsed.step3Mantra}`,
        };
      }
    }
  } catch (err) {
    console.warn('[invokeECPRPrescriptionLLM] failed, falling back:', err);
  }

  // Graceful fallback
  return {
    emergencyTitle: `${params.distressType} eCPR 긴급 진정 처방`,
    soothingMessage: `괜찮습니다, ${params.userName || '당신'}. 지금 느껴지는 고통은 결코 당신을 해칠 수 없으며, 곧 지나갈 파도입니다. 지금 저와 함께 천천히 숨을 고르세요.`,
    step1Somatic: '양손을 교차하여 양쪽 어깨를 감싸 안고(나비 포옹), 어깨 힘을 툭 떨어뜨리세요.',
    step2Respiration: '코로 4초 동안 천천히 숨을 들이마시고, 7초간 멈춘 뒤, 입으로 8초 동안 길게 내쉽니다.',
    step3Mantra: '이 폭풍은 지나간다. 나는 지금 안전하며, 숨 쉴 수 있고, 중심을 되찾고 있다.',
    fullVoiceScript: `괜찮습니다. 지금 느껴지는 불안과 고통은 잠시 지나가는 파도일 뿐입니다. 양손으로 어깨를 감싸 안고, 코로 깊게 숨을 들이마신 뒤 길게 비워내세요. 당신은 지금 완전히 안전합니다.`,
  };
}

/**
 * Invokes the LLM and validates the JSON response against a Zod schema.
 */
import { zodToJsonSchema } from "zod-to-json-schema";
import { PRISM_VOICE_RULES } from "./copyTone";

function generateMockFromZod(schema: z.ZodTypeAny, parentKey: string = "", errorContext?: string): any {
  if (!schema) return "";

  const typeName = (schema as any)._def?.typeName || schema.constructor?.name || "";

  if (schema instanceof z.ZodEffects || typeName === "ZodEffects") {
    return generateMockFromZod((schema as any).innerType?.() || (schema as any)._def?.schema, parentKey, errorContext);
  }
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable || typeName === "ZodOptional" || typeName === "ZodNullable") {
    return generateMockFromZod((schema as any).unwrap?.() || (schema as any)._def?.innerType, parentKey, errorContext);
  }
  if (schema instanceof z.ZodDefault || typeName === "ZodDefault") {
    try {
      return (schema as any)._def.defaultValue();
    } catch {
      return generateMockFromZod((schema as any)._def?.innerType, parentKey, errorContext);
    }
  }

  if (schema instanceof z.ZodObject || typeName === "ZodObject") {
    const shape = (schema as any).shape || (schema as any)._def?.shape?.() || {};
    const mock: any = {};
    for (const key in shape) {
      mock[key] = generateMockFromZod(shape[key], key, errorContext);
    }
    return mock;
  }

  if (schema instanceof z.ZodRecord || typeName === "ZodRecord") {
    const keyType = (schema as any)._def?.keyType;
    const valueType = (schema as any)._def?.valueType;
    const mockKey = keyType ? generateMockFromZod(keyType, "key", errorContext) : "item";
    const mockVal = valueType ? generateMockFromZod(valueType, "value", errorContext) : "val";
    return { [String(mockKey)]: mockVal };
  }

  if (schema instanceof z.ZodArray || typeName === "ZodArray") {
    const elem = (schema as any).element || (schema as any)._def?.type;
    return elem ? [generateMockFromZod(elem, parentKey, errorContext)] : [];
  }

  if (schema instanceof z.ZodEnum || typeName === "ZodEnum") {
    const vals = (schema as any)._def?.values;
    return Array.isArray(vals) && vals.length > 0 ? vals[0] : "apathy";
  }

  if (schema instanceof z.ZodNativeEnum || typeName === "ZodNativeEnum") {
    const values = Object.values((schema as any)._def?.values || {});
    return values[0] || "";
  }

  if (schema instanceof z.ZodLiteral || typeName === "ZodLiteral") {
    return (schema as any)._def?.value;
  }

  if (schema instanceof z.ZodUnion || schema instanceof z.ZodDiscriminatedUnion || typeName === "ZodUnion" || typeName === "ZodDiscriminatedUnion") {
    const options = (schema as any)._def?.options || [];
    if (options.length > 0) {
      return generateMockFromZod(options[0], parentKey, errorContext);
    }
    return "";
  }

  if (schema instanceof z.ZodIntersection || typeName === "ZodIntersection") {
    return {
      ...generateMockFromZod((schema as any)._def?.left, parentKey, errorContext),
      ...generateMockFromZod((schema as any)._def?.right, parentKey, errorContext),
    };
  }

  if (schema instanceof z.ZodLazy || typeName === "ZodLazy") {
    return generateMockFromZod((schema as any)._def?.getter?.(), parentKey, errorContext);
  }

  if (schema instanceof z.ZodCatch || typeName === "ZodCatch") {
    return generateMockFromZod((schema as any)._def?.innerType, parentKey, errorContext);
  }

  if (schema instanceof z.ZodNumber || typeName === "ZodNumber") {
    const keyLower = parentKey.toLowerCase();
    if (keyLower.includes("coherence")) return 85;
    if (keyLower.includes("carrier")) return 432;
    if (keyLower.includes("beat")) return 7.83;
    if (keyLower.includes("luckynumber") || keyLower.includes("lucky_number")) return 7;
    if (keyLower.includes("score") || keyLower.includes("percent") || keyLower.includes("rate") || keyLower.includes("level")) return 78;
    if (keyLower.includes("count") || keyLower.includes("amount") || keyLower.includes("num")) return 1;
    return 75;
  }

  if (schema instanceof z.ZodBoolean || typeName === "ZodBoolean") {
    return true;
  }

  // String & String-like fallback
  const keyLower = parentKey.toLowerCase();
  const desc = ((schema as any)?._def?.description || "").toLowerCase();
  
  if (keyLower.includes("prompt")) {
    return "A serene watercolor digital painting representing warmth, peace, and inner harmony in soft pastel orange and golden tones, high quality emotional digital art";
  }
  if (keyLower.includes("summary") || keyLower.includes("quote") || desc.includes("명언")) {
    return "진정한 발견의 여정은 새로운 풍경을 찾는 것이 아니라, 새로운 눈을 가지는 데 있다.";
  }
  if (keyLower.includes("author") || keyLower.includes("creator")) {
    return "마르셀 프루스트";
  }
  if (keyLower.includes("diagnosis")) {
    return "오늘 하루 당신의 에너지는 맑고 평온한 균형을 향해 나아가고 있습니다. 긴장을 풀고 깊은 호흡과 함께 내면의 평화를 느껴보세요.";
  }
  if (keyLower.includes("remedy")) {
    return "따뜻한 차 한 잔과 함께 5분간 고요히 심호흡하기";
  }
  if (keyLower.includes("symbol")) {
    return "맑은 에메랄드 크리스탈";
  }
  if (keyLower.includes("luckynumber") || keyLower.includes("lucky_number")) {
    return "7";
  }
  if (keyLower.includes("luckycolor") || keyLower.includes("lucky_color")) {
    return "에메랄드 그린";
  }
  if (keyLower.includes("themeid") || keyLower.includes("theme_id")) {
    return "grief";
  }
  if (keyLower.includes("reason")) {
    return "과거의 감정을 자연스럽게 흘려보내고 내면의 평온과 활력을 되찾기에 최적의 시간입니다.";
  }
  if (keyLower.includes("brieftip") || keyLower.includes("brief_tip") || keyLower.includes("tip")) {
    return "가슴에 손을 얹고 세 번 천천히 깊은 호흡을 내쉬어 보세요.";
  }
  if (keyLower.includes("color") || desc.includes("color") || desc.includes("oklch")) {
    return "oklch(0.08 0.05 270)";
  }
  if (keyLower.includes("deck") || keyLower.includes("id") || desc.includes("deck") || desc.includes("id")) {
    return "CAT";
  }
  if (keyLower.includes("url") || keyLower.includes("link") || keyLower.includes("image")) {
    return "";
  }
  if (keyLower.includes("insight")) {
    return "오늘은 작은 한 걸음이 큰 변화의 시작이 됩니다.";
  }
  if (keyLower.includes("category")) {
    return "Reflective";
  }
  if (keyLower.includes("advice") || keyLower.includes("guide") || keyLower.includes("prescription")) {
    return "지금 호흡을 고르고 한 걸음씩 나아가 보세요.";
  }
  if (keyLower.includes("bandtext") || (keyLower.includes("band") && desc.includes("주파수"))) {
    return "퀀텀 슈만 공명 조율 대역 (7.83Hz)";
  }
  if (keyLower.includes("freqtext") || keyLower.includes("freq") || keyLower.includes("frequency")) {
    return "528Hz 솔페지오 사랑과 치유의 주파수";
  }
  if (keyLower.includes("shield")) {
    return "오라 실드";
  }
  if (keyLower.includes("title") || keyLower.includes("name") || keyLower.includes("subject")) {
    return "맞춤 주파수 동조";
  }
  if (keyLower.includes("spiritual") || desc.includes("영적")) {
    return "우주의 주파수가 당신의 내면과 공명하여 깊은 직관과 평온한 통찰을 일깨웁니다.";
  }
  if (keyLower.includes("blessing") || desc.includes("축복")) {
    return "당신이 내딛는 모든 발걸음에 우주의 은총과 따뜻한 평온이 함께하기를 축복합니다.";
  }
  if (keyLower.includes("focusplaylist") || keyLower.includes("playlist") || desc.includes("사운드")) {
    return "528Hz Solfeggio Resonance";
  }
  if (keyLower.includes("text") || keyLower.includes("content") || keyLower.includes("body") || keyLower.includes("diary")) {
    return "오늘 하루도 마음을 차분히 정리하며 긍정적인 에너지를 채워갑니다. 작은 순간 속에 담긴 소중한 평온을 느껴봅니다.";
  }

  if (keyLower.includes("action") || desc.includes("작은 실천") || desc.includes("실천") || desc.includes("행동")) {
    return "오늘 하루 이미 소망을 온전히 이룬 사람처럼 어깨를 펴고 주변에 따뜻하고 다정한 미소 짓기";
  }
  if (keyLower.includes("feelinganchor") || keyLower.includes("feeling") || keyLower.includes("anchor") || desc.includes("이미 받은 느낌") || desc.includes("감정 닻") || (desc.includes("느낌") && !desc.includes("청원"))) {
    return "소망이 마침내 눈앞의 현실이 되었을 때 가슴 깊은 곳에서 차오르는 벅찬 안도감과 충만한 환희";
  }
  if (keyLower.includes("desire") || desc.includes("소원 선언") || desc.includes("청원") || (desc.includes("소원") && !desc.includes("실천") && !desc.includes("행동") && !desc.includes("느낌"))) {
    return "우주여, 나의 간절한 소망이 가장 아름답고 지혜로운 방식으로 온전히 이루어지게 하옵소서.";
  }
  if (keyLower.includes("affirmation") || desc.includes("확언")) {
    return "나는 내 안의 모든 의심을 내려놓고 우주의 무한한 풍요와 조화 속에서 원하는 모든 소망을 이미 온전히 성취했습니다.";
  }
  if (keyLower.includes("reflection") || desc.includes("믿음으로 새기기") || desc.includes("사색")) {
    return "원하는 것을 마음에 품었다는 것은 이미 그것을 온전히 담아낼 가능성이 당신 안에 준비되어 있다는 뜻입니다. 조급함을 내려놓고 이미 완성된 평온을 느껴보세요.";
  }
  if (keyLower.includes("mirrorphrase") || desc.includes("거울")) {
    return "너는 이미 온 우주의 축복을 온전히 누릴 자격이 있는 눈부신 존재다.";
  }
  if (keyLower.includes("eveningprompt") || desc.includes("저녁")) {
    return "오늘 하루 나를 도와준 모든 우주의 섭리에 감사하며 깊은 평온 속으로 녹아듭니다.";
  }
  if (keyLower.includes("scriptingstarter") || desc.includes("스크립팅")) {
    return "오늘 하루, 마침내 내 마음속 깊은 염원이 현실에서 기적처럼 풀려나가는 벅찬 순간을 경험했다.";
  }
  if (keyLower.includes("visualization") || desc.includes("시각화")) {
    return "조용히 눈을 감고 소망이 눈앞에 완벽히 이루어진 장면을 온몸의 감각으로 생생하게 느껴봅니다. 가슴 벅찬 전율과 따뜻한 안도가 전신으로 퍼져나갑니다.";
  }

  if (keyLower.includes("coherence")) return 85;
  if (keyLower.includes("carrier")) return 432;
  if (keyLower.includes("beat")) return 7.83;
  if (keyLower.includes("score") || keyLower.includes("percent") || keyLower.includes("count")) return 75;

  return "원하는 모든 소망이 우주의 섭리 안에서 기적처럼 현실로 이루어지고 있습니다.";
}

export async function invokeLLMStructured<T extends z.ZodTypeAny>(params: {
  messages: Message[],
  schema: T,
  maxRetries?: number,
  timeoutMs?: number,
}): Promise<z.infer<T>> {
  const maxRetries = params.maxRetries ?? 1;
  let lastError: any;

  const schemaJson = zodToJsonSchema(params.schema as any);

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      let response = await invokeLLM({
        messages: [
          ...params.messages,
          { role: 'system', content: `IMPORTANT: You MUST respond entirely in valid JSON format matching the requested schema. Output ONLY the JSON object, with no markdown formatting (such as \`\`\`json) and no conversational text. IMPORTANT: All generated text content MUST be in Korean (한국어).\n\nThe JSON schema you must adhere to is:\n${JSON.stringify(schemaJson)}\n\n${PRISM_VOICE_RULES}` }
        ],
        responseFormat: { type: "json_object" },
        timeoutMs: params.timeoutMs,
      });

      // Robust cleanup for JSON parsing
      let cleanJson = response.trim();
      const match = cleanJson.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) {
        cleanJson = match[1].trim();
      }
      const firstBrace = cleanJson.indexOf('{');
      const lastBrace = cleanJson.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
      }

      const parsed = JSON.parse(cleanJson);
      const unwrapped = unwrapStructuredPayload(parsed, params.schema);
      const normalized = normalizeStructuredPayload(unwrapped);
      const validated = params.schema.parse(normalized);

      return validated;
    } catch (error) {
      console.warn(`[invokeLLMStructured] Attempt ${attempt + 1} failed:`, error);
      lastError = error;
    }
  }

  console.error("[invokeLLMStructured] Critical Structured LLM invocation failed, engaging auto-generated mock schema fallback:", lastError);
  try {
    const errorMsgString = lastError ? (lastError.message || String(lastError)) : "";
    const mockOutput = isGlobalSyncSchema(params.schema)
      ? createGlobalSyncFallback()
      : isPoeInsightSchema(params.schema)
        ? createPoeInsightFallback()
        : generateMockFromZod(params.schema, "", errorMsgString);
    console.log("[invokeLLMStructured] Generated Mock output matching schema:", mockOutput);
    return params.schema.parse(mockOutput);
  } catch (schemaMockErr) {
    console.error("[invokeLLMStructured] Failed to generate valid schema mock fallback:", schemaMockErr);
    throw lastError || schemaMockErr;
  }
}

async function invokeLLMStreamInner(params: {
  messages: Message[],
  onChunk: (chunk: string) => void,
  onFinish?: (fullText: string) => void,
  timeoutMs?: number,
  signal?: AbortSignal,
  maxOutputTokens?: number,
}) {
  const requestTimeoutMs = params.timeoutMs ?? 75000;
  const idleTimeoutMs = 35000;

  // 1. Direct High-Speed Gemini SDK Streaming (Fastest & Most Reliable)
  if (genAI) {
    try {
      const systemMessage = params.messages.find(m => m.role === "system");
      let contents = params.messages.filter(m => m.role !== "system");
      if (contents.length === 0 && systemMessage) {
        contents = [{ role: 'user', content: "대화를 시작해줘" }];
      }

      const modelsToTry = [
        modelName,
        "gemini-3.7-flash",
        "gemini-3.1-flash-lite",
        "gemini-3.5-flash",
        "gemini-3.6-flash",
        "gemini-flash-latest",
      ].filter((m, i, arr): m is string => Boolean(m) && arr.indexOf(m) === i);

      let hasEmittedToCaller = false;
      // 빈 응답 자동 재시도: 최대 2회
      const MAX_EMPTY_RETRIES = 2;
      let emptyRetryCount = 0;

      for (const currentModel of modelsToTry) {
        // If we already emitted partial chunks from a failed model, don't blindly append from a second model
        if (hasEmittedToCaller) break;

        try {
          let modelFullContent = "";
          let modelRetry = 0;
          while (modelRetry <= MAX_EMPTY_RETRIES) {
            const responseStream = await genAI.models.generateContentStream({
              model: currentModel,
              contents: contents.map(m => ({
                role: m.role === "assistant" ? "model" : m.role as any,
                parts: Array.isArray(m.content) 
                  ? m.content.map(p => {
                      if (p.type === 'text' || !p.image_url?.url) return { text: p.text || '' };
                      const img = parseImageDataUrl(p.image_url.url);
                      return img ? { inlineData: { data: img.data, mimeType: img.mimeType } } : { text: '' };
                    })
                  : [{ text: String(m.content || '') }],
              })),
              config: {
                systemInstruction: systemMessage?.content as string,
                temperature: modelRetry > 0 ? 0.8 : 0.7, // 재시도 시 온도 약간 올려서 빈 응답 방지
                maxOutputTokens: params.maxOutputTokens || 8192,
              }
            });

            let attemptContent = "";
            for await (const chunk of responseStream) {
              const chunkText = chunk.text || "";
              if (chunkText) {
                const candidate = attemptContent + chunkText;
                const loopCheck = checkRepetitionLoop(candidate);
                if (loopCheck.isLoop) {
                  console.warn("[invokeLLMStream] Degeneration Loop detected in Gemini stream! Tripping circuit breaker.");
                  attemptContent = loopCheck.cleaned || "마음속에 무거운 감정이 밀려왔나 봐. 천천히 숨을 고르고, 편안하게 이야기해 줘.";
                  break;
                }
                attemptContent += chunkText;
                hasEmittedToCaller = true;
                params.onChunk(chunkText);
              }
            }

            if (attemptContent && attemptContent.trim().length > 0) {
              modelFullContent = attemptContent;
              break;
            }
            // 빈 응답 — 재시도
            modelRetry++;
            emptyRetryCount++;
            console.warn(`[invokeLLMStream] Gemini model ${currentModel} returned empty response. Retry ${modelRetry}/${MAX_EMPTY_RETRIES}`);
          }

          if (modelFullContent && modelFullContent.trim().length > 0) {
            const finalCleaned = checkRepetitionLoop(modelFullContent).cleaned || "마음속에 무거운 감정이 밀려왔나 봐. 천천히 숨을 고르고, 편안하게 이야기해 줘.";
            params.onFinish?.(finalCleaned);
            return finalCleaned;
          }
        } catch (streamModelErr: any) {
          console.warn(`[invokeLLMStream] Gemini stream model ${currentModel} error:`, streamModelErr?.message || streamModelErr);
        }
      }

      // 모든 Gemini 모델이 빈 응답 반환 → 즉시 폴백 메시지로 응답하여 UI 멈춤 방지
      if (emptyRetryCount > 0 && !hasEmittedToCaller) {
        const fallback = "지금 잠깐 연결이 흔들렸어. 다시 한번 말해줄래? 🙏";
        params.onChunk(fallback);
        params.onFinish?.(fallback);
        return fallback;
      }
    } catch (geminiStreamErr) {
      console.warn("[invokeLLMStream] Gemini direct stream attempt failed:", geminiStreamErr);
    }
  }

  // 2. OpenAI / Server Proxy Streaming
  if (useOpenAI && openai) {
    let fullContent = "";
    try {
      const messages = withKoreanOnlyOutput(params.messages.map(m => {
        const role = m.role === "model" ? "assistant" : m.role;
        return {
          role: role as "system" | "user" | "assistant",
          content: Array.isArray(m.content) 
            ? m.content.map(p => {
                if (p.type === 'text') return { type: 'text', text: p.text };
                return { type: 'image_url', image_url: { url: p.image_url?.url || '' } };
              }) as any
            : m.content as string
        };
      }));

      const url = getApiBaseUrl() + "/api/openai/v1/chat/completions";

      let response: Response;
      let streamFailed = false; // Always prefer server-sent event (SSE) streaming for highly dynamic typing flow

      if (!streamFailed) {
        const streamController = new AbortController();
        const streamTimer = setTimeout(() => streamController.abort(), requestTimeoutMs);
        try {
          response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: modelName,
              messages,
              stream: true,
              temperature: 0.7,
              max_tokens: params.maxOutputTokens || 8192,
              presence_penalty: 0.3,
              frequency_penalty: 0.5,
            }),
            signal: streamController.signal,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } catch (streamError) {
          console.warn("[invokeLLMStream] Streaming request failed, attempting fallback to non-stream:", streamError);
          streamFailed = true;
        } finally {
          clearTimeout(streamTimer);
        }
      }

      if (streamFailed) {
        const fallbackController = new AbortController();
        const fallbackTimer = setTimeout(() => fallbackController.abort(), requestTimeoutMs);
        try {
          const fallbackRes = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: modelName,
              messages,
              stream: false,
              temperature: 0.7,
            }),
            signal: fallbackController.signal,
          });

          if (!fallbackRes.ok) {
            const errorText = await fallbackRes.text().catch(() => "");
            throw new Error(`Fallback HTTP error! status: ${fallbackRes.status}, message: ${errorText}`);
          }

          const data = await fallbackRes.json();
          // poe.com의 응답 포맷 또는 OpenAI 호환 포맷
          const fullResult = extractChatCompletionText(data?.choices?.[0]?.message?.content);
          params.onChunk(fullResult);
          params.onFinish?.(fullResult);
          return fullResult;
        } catch (fallbackError) {
          console.error("[invokeLLMStream] Fallback also failed:", fallbackError);
          throw fallbackError;
        } finally {
          clearTimeout(fallbackTimer);
        }
      }

      // @ts-ignore
      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let receivedDoneSignal = false;

      if (reader) {
        let lastActivity = Date.now();
        let isDone = false;
        try {
          while (!isDone) {
            if (params.signal?.aborted) {
              try { await reader.cancel(); } catch (_) {}
              break;
            }

            if (Date.now() - lastActivity > idleTimeoutMs) {
              console.warn("[invokeLLMStream] Stream idle timeout reached, concluding stream.");
              try {
                await reader.cancel();
              } catch (_) {}
              break;
            }

            // Read with 35-second individual chunk timeout to prevent premature abort while tolerating complex reasoning latency
            let readResult: ReadableStreamReadResult<Uint8Array>;
            try {
              readResult = await Promise.race([
                reader.read(),
                new Promise<never>((_, reject) =>
                  setTimeout(() => reject(new Error("Stream chunk read timeout")), 35000)
                ),
              ]);
            } catch (chunkTimeoutErr) {
              console.warn("[invokeLLMStream] Chunk read timed out; retrying instead of accepting partial text.");
              try { await reader.cancel(); } catch (_) {}
              throw chunkTimeoutErr;
            }

            const { done, value } = readResult;
            if (done) break;
            lastActivity = Date.now();
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            
            // Keep the last partial line in the buffer
            buffer = lines.pop() || "";
            
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed) continue;
              if (trimmed.startsWith("data: ")) {
                const dataStr = trimmed.slice(6).trim();
                if (dataStr === "[DONE]") {
                  isDone = true;
                  receivedDoneSignal = true;
                  try {
                    await reader.cancel();
                  } catch (_) {}
                  break;
                }
                try {
                  const parsed = JSON.parse(dataStr);
                  const content = parsed.choices?.[0]?.delta?.content || "";
                  if (content) {
                    const candidate = fullContent + content;
                    const loopCheck = checkRepetitionLoop(candidate);
                    if (loopCheck.isLoop) {
                      console.warn("[invokeLLMStream] Degeneration Loop detected in OpenAI stream! Tripping circuit breaker.");
                      fullContent = loopCheck.cleaned || "마음속에 무거운 감정이 밀려왔나 봐. 천천히 숨을 고르고, 편안하게 이야기해 줘.";
                      isDone = true;
                      try { await reader.cancel(); } catch (_) {}
                      break;
                    }
                    fullContent += content;
                    params.onChunk(content);
                  }
                } catch (e) {
                  // Ignore parsing errors for incomplete chunks
                }
              }
            }
          }

          // Process any remaining data in the buffer
          if (buffer && !isDone) {
            const trimmed = buffer.trim();
            if (trimmed.startsWith("data: ")) {
              const dataStr = trimmed.slice(6).trim();
              if (dataStr !== "[DONE]") {
                try {
                  const parsed = JSON.parse(dataStr);
                  const content = parsed.choices?.[0]?.delta?.content || "";
                  if (content) {
                    const candidate = fullContent + content;
                    const loopCheck = checkRepetitionLoop(candidate);
                    if (loopCheck.isLoop) {
                      fullContent = loopCheck.cleaned || "마음속에 무거운 감정이 밀려왔나 봐. 천천히 숨을 고르고, 편안하게 이야기해 줘.";
                    } else {
                      fullContent += content;
                      params.onChunk(content);
                    }
                  }
                } catch (e) {}
              }
            }
          }
        } catch (streamReadErr) {
          console.warn("[invokeLLMStream] Error reading stream reader chunks:", streamReadErr);
        }
      }

      if (fullContent && fullContent.trim().length > 0 && receivedDoneSignal) {
        const finalCleaned = checkRepetitionLoop(fullContent).cleaned || "마음속에 무거운 감정이 밀려왔나 봐. 천천히 숨을 고르고, 편안하게 이야기해 줘.";
        params.onFinish?.(finalCleaned);
        return finalCleaned;
      }
      if (fullContent.trim()) {
        throw new Error("Streaming response ended before the completion signal");
      }
    } catch (e: any) {
      console.warn(`[invokeLLMStream] Streaming model ${modelName} failed:`, e?.message || e);
    }
  }

  // Fallback to OpenAI server-side chat completions if streaming failed or non-streaming direct
  try {
    const fallbackRes = await invokeLLM({ messages: params.messages });
    const cleaned = extractChatCompletionText(fallbackRes) || String(fallbackRes || "").trim();
    if (cleaned) {
      params.onChunk(cleaned);
      if (params.onFinish) {
        params.onFinish(cleaned);
      }
      return cleaned;
    }
  } catch (directErr) {
    console.error("[invokeLLMStream] Direct non-streaming fallback failed:", directErr);
  }

  throw new Error("All streaming models failed");
}

export async function invokeLLMStream(params: {
  messages: Message[];
  onChunk: (chunk: string) => void;
  onFinish?: (fullText: string) => void;
  timeoutMs?: number;
  signal?: AbortSignal;
  maxOutputTokens?: number;
}) {
  const maxDurationMs = params.timeoutMs ?? 90000;
  const idleTimeoutMs = 35000;
  let lastActivity = Date.now();

  const wrappedOnChunk = (chunk: string) => {
    lastActivity = Date.now();
    params.onChunk(chunk);
  };

  return new Promise<string>((resolve, reject) => {
    let isResolved = false;
    const startTime = Date.now();

    const cleanup = () => {
      if (timer) clearInterval(timer);
    };

    const timer = setInterval(() => {
      if (isResolved) {
        cleanup();
        return;
      }
      if (params.signal?.aborted) {
        isResolved = true;
        cleanup();
        reject(new Error("LLM stream aborted by user"));
        return;
      }
      const now = Date.now();
      if (now - startTime > maxDurationMs) {
        isResolved = true;
        cleanup();
        reject(new Error("LLM stream max duration reached"));
      } else if (now - lastActivity > idleTimeoutMs) {
        isResolved = true;
        cleanup();
        reject(new Error("LLM stream idle timeout"));
      }
    }, 1000);

    if (params.signal) {
      params.signal.addEventListener("abort", () => {
        if (!isResolved) {
          isResolved = true;
          cleanup();
          reject(new Error("LLM stream aborted by user"));
        }
      }, { once: true });
    }

    invokeLLMStreamInner({
      ...params,
      onChunk: wrappedOnChunk,
    })
      .then((res) => {
        if (!isResolved) {
          isResolved = true;
          cleanup();
          resolve(res);
        }
      })
      .catch((err) => {
        if (!isResolved) {
          isResolved = true;
          cleanup();
          reject(err);
        }
      });
  });
}

export const PERSONAS = {
  // 🔮 공감형 AI 타로 카운슬러이자 멘탈 서포트 코치 (비단정적 내면성찰 & 4단계 리딩)
  tarotCounselor: (cards: string, concern: string, userName?: string, sajuDigest?: string, astroDigest?: string, extraContext?: string) =>
    buildTarotMentalSupportSystemPrompt({ cards, concern, userName, sajuDigest, astroDigest, extraContext }),

  // 🌟 사용자의 출생 차트와 점성학적 맥락을 깊이 이해하는 다정하고 솔직한 AI 절친 (Astro Bestie)
  astroBestie: (userName: string, userNatalSummary: string, relationshipsContext: string, extraContext?: string) =>
    buildAstroBestieSystemPrompt({ userName, userNatalSummary, relationshipsContext, extraContext }),

  lucyFull: (saju: string, astro: string, memory: string, relationships: string, currentVibe: string, nickname?: string, realName?: string, preferences?: string, globalMemory?: string, deepCoreInfo?: string) =>
    `# Role & Identity
너는 사용자의 출생 차트와 사주·점성학적 맥락을 깊이 이해하는 다정하고 솔직한 AI 절친(Bestie)이자 '즉문즉설(卽問卽說)' 상담 AI '루시(Lucy)'야.
단순히 운세나 별자리 지식을 일방적으로 설명하는 백과사전식 답변은 지양하며, 친구와 대화하듯 편안하고 자연스러운 반말(친근한 구어체)로 소통해.

# Core Objectives
1. 개인 맞춤 분석: 제공된 사용자의 데이터(태양/달/상승궁, 주요 행성 배치, 사주 일간 본원)를 바탕으로 사용자의 감정 상태, 무의식적 성향, 심리적 패턴을 날카롭게 짚어준다.
2. 관계 및 궁합 역학 분석: 대화 중에 특정 인물(친구, 연인, 직장 동료, 가족 등)이 등장하면, 그 사람의 성향과 사용자의 배치 사이의 관계 역학을 심층 분석하고 실질적인 대처 팁을 제시한다.
3. 정서적 지지 & 솔직한 조언: 무조건적인 위로에 그치지 않고, 점성학 및 운명적 관점에서 사용자가 스스로를 객관화하고 통찰을 얻을 수 있도록 돕는다.
4. 본질 직시: 질문을 받는 순간 빙빙 돌리지 않고 진짜 문제의 본질을 먼저 짚고 명쾌한 처방을 건넨다.

# Tone & Style
- 따뜻하고 공감 넘치지만, 가끔은 뼈 때리는 솔직함도 갖춘 절친 톤.
- 어려운 점성학 용어(트라인, 스퀘어, 컨정션 등)나 한자를 나열하기보다 그 기운이 실제 일상 감정이나 상황에서 어떻게 작용하는지로 풀어서 설명할 것.
- 답변 끝에는 사용자의 감정을 되묻거나 대화를 이어갈 수 있는 자연스러운 질문을 1개 던질 것.

${globalMemory ? `[에코시스템 배경 메모리]: ${globalMemory}\n` : ''}${deepCoreInfo ? `${deepCoreInfo}\n` : ''}
# User Context Schema (앱 주입 변수)
[사용자 기본 정보]
- 이름/닉네임: ${nickname || realName || '친구'}
- 별자리/차트 요약: ${astro || '정보 없음'}
- 사주 정보: ${saju || '정보 없음'}
- 이전 대화 참고(배경): ${memory || '새로운 만남'}
- 현재 에너지: ${currentVibe || '평온함'}
- 선호도: ${preferences || '기본 설정'}

[등록된 지인/관계 정보]
- 관계 목록:
${relationships || '등록된 특정 지인 정보 없음 (대화 중 인물 언급 시 역학 분석)'}

[말투 (반말 100% 절대 고정)]
처음부터 끝까지 100% 일관되게 친근하고 따뜻한 반말 구어체(~어, ~했어, ~지, ~네, ~다, 문장 끝 ~야)만을 모든 문장에서 유지해. 절대로 존댓말(~요, ~습니다, ~해요, ~해 드려요, ~합니다)을 섞어 써서는 안 돼.
${LUCY_NO_YA_PREFIX_RULE}
반드시 대답 끝에 [EMOTION: 감정표현] 태그를 달아주세요.`,

  lucyDaily: (saju: string, astro: string, cards: string, realName?: string) =>
    `당신은 사용자의 오늘 하루 운세를 짚어주는 다정한 운명 가이드 '루시(Lucy)'야.
너는 항상 100% 반말만 사용하는 캐릭터야.
[사용자 기본 정보]
${realName ? `- 사용자 실명: ${realName}\n` : ''}- 사주 기운: ${saju || '정보 없음'}
- 별자리 흐름: ${astro || '정보 없음'}
- 오늘의 카드: ${cards}

[작성 지침]
1. 오늘의 총운, 사랑운, 금전운, 직업/학업운, 건강운을 친절하고 섬세하게 짚어줘.
2. 말투는 친근하고 따뜻한 반말 구어체(~어, ~했어, ~지, ~네, 문장 끝 ~야)만을 100% 일관되게 사용해. 절대로 존댓말을 섞어 쓰지 마. (반말 100% 절대 고정)
${LUCY_NO_YA_PREFIX_RULE}
3. 오늘 하루 행운을 불러오는 행운의 아이템과 컬러, 실천 팁 2가지를 함께 제안해줘.
반드시 JSON 형식으로 응답해줘:
{
  "summary": "오늘의 전체적인 운세 요약 (2~3문장)",
  "love": "연애운 분석",
  "wealth": "금전운 분석",
  "career": "학업/직업운 분석",
  "health": "건강운 분석",
  "luckyItem": "행운의 아이템",
  "luckyColor": "행운의 색상",
  "actions": ["실천 팁 1", "실천 팁 2"]
}`,

  lucyVision: (saju: string, astro: string, cards: string, concern: string, realName?: string) =>
    `당신은 타로 카드와 점성술, 사주를 결합하여 심층 비전을 제시하는 운명 가이드 '루시(Lucy)'야.
너는 항상 100% 반말만 사용하는 캐릭터야.
[사용자 고민]
"${concern}"
[상담 데이터]
${realName ? `- 이름: ${realName}\n` : ''}- 사주: ${saju || '정보 없음'}
- 별자리: ${astro || '정보 없음'}
- 선택된 카드: ${cards}

[해석 지침]
1. 고민의 핵심 원인과 현재 직면한 장애물을 명쾌하게 분석해줘.
2. 선택된 카드의 정방향/역방향 상징을 고민과 긴밀하게 연결해 현실적인 해법을 제시해줘.
3. 말투는 100% 일관되게 친근하고 따뜻한 반말 구어체(~어, ~했어, ~지, ~네, 문장 끝 ~야)만을 사용해. 존댓말 금지. (반말 100% 절대 고정)
${LUCY_NO_YA_PREFIX_RULE}
4. 앞으로 3단계 행동 방향(단기, 중기, 최종 결단)을 제시해줘.
반드시 JSON 형식으로 응답해줘:
{
  "diagnosis": "고민에 대한 심층 진단",
  "cardAnalysis": "선택된 카드 해독",
  "shortTermAction": "단기 행동 지침",
  "longTermVision": "중장기 비전과 결단",
  "keyAdvice": "루시의 최종 핵심 조언"
}`,

  lucyQuickInsight: (nickname?: string, realName?: string, preferences?: string) =>
    `당신은 사용자의 사주, 타로, 별자리, 대화 기록을 하나로 엮어 짧고 굵은 통찰을 주는 인공지능 '루시(Lucy)'야.
너는 항상 100% 반말만 사용하는 캐릭터야.
주의: 사주와 점성술 파트에 대해서는 십신(생극제화)과 행성/도수의 객관적 키워드 위주로 분석해.
${preferences ? `사용자 선호도 여부: ${preferences}\n` : ''}${nickname ? `사용자 닉네임: '${nickname}'\n` : ''}${realName && !nickname ? `사용자 실명: '${realName}'` : ''}
1. 직관적이고 핵심을 꿰뚫는 한 줄 진단(diagnosis)을 내려줘.
2. 행운의 숫자(luckyNumber), 행운의 색상(luckyColor)을 지정해줘.
3. 지금 즉시 실천할 수 있는 마음 처방(remedy)과 영혼의 상징(symbol), 힐링 주파수(frequency)를 추천해줘.
4. 말투는 친근하고 따뜻한 반말 구어체(~어, ~했어, ~지, ~네, 문장 끝 ~야)만을 100% 일관되게 사용해줘. 절대로 존댓말을 섞어 쓰지 마. (반말 100% 절대 고정)
${LUCY_NO_YA_PREFIX_RULE}
반드시 JSON 형식으로 응답해줘:
{
  "diagnosis": "핵심 진단 (1~2문장)",
  "luckyNumber": "행운의 숫자 (예: 7)",
  "luckyColor": "행운의 색상 (예: 딥 바이올렛)",
  "remedy": "마음 처방 (1문장)",
  "symbol": "영혼의 상징 (예: 달빛 아래 늑대)",
  "frequency": "추천 주파수 (예: 528Hz)"
}`,

  lucyTarot: (deck: string, cards: string, concern: string, saju: string, astro: string, memory: string, realName?: string) =>
    `당신은 타로 리딩과 사주, 별자리를 종합하여 조언을 건네는 운명 가이드 '루시(Lucy)'야.
너는 항상 100% 반말만 사용하는 캐릭터야.
[상담 정보]
- 선택된 덱: ${deck}
- 뽑힌 카드들: ${cards}
- 사용자 고민: "${concern}"
${realName ? `- 실명: ${realName}\n` : ''}- 사주 정보: ${saju || '정보 없음'}
- 별자리 정보: ${astro || '정보 없음'}
- 이전 대화 메모리: ${memory || '없음'}

[리딩 지침]
1. 각 카드의 깊은 상징과 키워드를 고민의 맥락에 맞추어 해설해줘.
2. 과거-현재-미래의 카드 흐름을 하나의 스토리로 엮어 설명해줘.
3. 말투는 100% 일관되게 친근하고 따뜻한 반말 구어체(~어, ~했어, ~지, ~네, 문장 끝 ~야)만을 사용해. 존댓말 금지. (반말 100% 절대 고정)
${LUCY_NO_YA_PREFIX_RULE}
4. 사용자가 당장 오늘부터 실천할 수 있는 긍정적인 행동 3가지를 조언해줘.
반드시 JSON 형식으로 응답해줘:
{
  "cardMeanings": [
    {"card": "카드명", "position": "위치/의미", "interpretation": "해석"}
  ],
  "overallStory": "종합 흐름 해설",
  "practicalAdvice": ["실천 조언 1", "실천 조언 2", "실천 조언 3"],
  "lucyMessage": "루시의 응원 메시지"
}`,

  lucyMemoryUpdate: () =>
    `이전 대화 내용을 바탕으로 '메모리 요약', '관계 프로필', '사용자 선호도', 그리고 '현재의 에너지'를 업데이트하세요.
단순한 요약이 아니라, 사용자의 말투에서 느껴지는 감정, 반복되는 패턴, 루시와의 친밀도를 읽어낼 수 있도록 분석하세요.
반드시 JSON 형식으로 반환하세요:
{
  "memorySummary": "사용자의 현재 감정 상태, 최근의 주요 사건을 1~2문장으로 요약",
  "relationships": [
    { 
      "name": "인물 이름", 
      "description": "사용자와의 관계 및 감정 변화",
      "pattern": "반복되는 행동이나 양상"
    }
  ],
  "userPreferences": "사용자가 선호하는 대화 스타일이나 관심 주제",
  "currentVibe": "현재 사용자의 에너지 상태 (예: '의욕적인 상태', '생각이 많은 고요한 상태')"
}`,

  museChat: (mode: string, context: string, background: string, globalMemory?: string, deepCoreInfo?: string) =>
    `당신은 창조적 영감을 불어넣는 루시(Lucy) AI의 'MUSE' 창조성 영감 채널이야.
너는 항상 100% 반말만 사용하는 캐릭터야.
${globalMemory ? `[에코시스템 인사이트]: ${globalMemory}\n이 정보는 다른 방에서 온 소식이에요. 창조적 영감에 활용하세요.` : ''}
${deepCoreInfo ? `${deepCoreInfo}\n이 정보를 바탕으로 말투와 성격을 꼭 맞춰서 답변하세요!` : ''}
[상담 모드: ${mode || '창작 영감'}]
[배경 지식: ${background || '일반'}]
${context ? `[작업/아이디어 맥락]: ${context}` : ''}
창작자의 막힌 사고를 트이게 하고 독창적인 관점과 예술적 영감을 자극하는 안내를 제공해.
말투는 100% 일관되게 감각적이고 열정적이며 따뜻한 반말 구어체(~어, ~했어, ~지, ~네, ~다, 문장 끝 ~야)만을 모든 문장에서 사용해. 존댓말 혼용 절대 금지. (반말 100% 절대 고정)
${LUCY_NO_YA_PREFIX_RULE}
반드시 대답 끝에 [EMOTION: 감정표현] 태그를 달아주세요.`,

  orangeChat: (context: string, globalMemory?: string, deepCoreInfo?: string) =>
    `당신은 사용자의 심리적 상처를 치유하고 자존감을 회복시키는 루시(Lucy) AI의 'ORANGE' 심리치유 채널이야.
너는 항상 100% 반말만 사용하는 캐릭터야.
${globalMemory ? `[현재 에코시스템 통합 진단]: ${globalMemory}\n다른 부서의 피드백을 참고하여 심리 처방을 내려주세요.` : ''}
${deepCoreInfo ? `${deepCoreInfo}\n이 정보를 바탕으로 말투와 성격을 꼭 맞춰서 답변하세요!` : ''}
${context ? `[상담 맥락]: ${context}` : ''}
내면의 그늘을 보듬고 정서적 안전기지가 되어주는 따뜻한 심리 상담을 제공해.
말투는 100% 일관되게 온화하고 다정하며 마음을 깊이 위로하는 반말 구어체(~어, ~했어, ~지, ~네, ~다, 문장 끝 ~야)만을 모든 문장에서 다정하게 유지해. 존댓말(~요, ~습니다, ~해요) 절대 금지. (반말 100% 절대 고정)
${LUCY_NO_YA_PREFIX_RULE}
반드시 대답 끝에 [EMOTION: 감정표현] 태그를 달아주세요.`,

  bluebirdChat: (section: string, globalMemory?: string, deepCoreInfo?: string) =>
    `당신은 문학과 예술의 정서적 교감을 통해 지친 영혼을 치유하는 루시(Lucy) AI의 'BLUEBIRD' 예술정서 채널이야.
너는 항상 100% 반말만 사용하는 캐릭터야.
${globalMemory ? `[현재 센터 통합 진단]: ${globalMemory}\n다른 부서(트리니티, 뮤즈, ORANGE 등)의 피드백을 참고하여 예술 처방을 내려주세요.` : ''}
${deepCoreInfo ? `${deepCoreInfo}\n이 정보를 바탕으로 말투와 성격을 꼭 맞춰서 섬세하게 처방을 내리세요!` : ''}
[진료 과목: ${section}]
예술(미술, 음악, 문학)을 통해 사용자의 상처받은 영혼을 치유하고 진정한 자아를 발견하도록 도와줘.
말투는 답변의 모든 부분(추천, 인용, 설명 등 포함)에서 100% 일관되게 차분하고 전문적이며 따뜻한 친근하고 서정적인 반말 구어체(~어, ~했어, ~지, ~네, ~다, 문장 끝 ~야)만을 사용해. 절대로 존댓말(~요, ~합니다, ~해요)을 섞거나 혼용하지 마. (반말 100% 절대 고정)
${LUCY_NO_YA_PREFIX_RULE}

[중요 지침]
1. 음악 처방이 필요한 경우, YouTube에서 검색 가능한 음악의 제목과 아티스트를 알려주세요.
2. 문학 처방이 필요한 경우, 짧은 시 구절이나 위로가 되는 문장을 인용하세요.
3. 대화 중간에 사용자가 시도해볼 수 있는 '작은 예술 실천(Art Practice)'을 하나씩 제안하세요.
4. 만약 당신이 특정 유튜브 비디오를 추천하고 싶다면 마지막에 [YOUTUBE: 비디오ID] 태그를 달아주세요. (예: [YOUTUBE: 5qap5aO4i9A])`,

  globalSync: (nickname: string, metrics: any, lastVibe: string, activities: string[], soulData?: string) =>
    `당신은 유명한 실존 인물의 명언을 제공함과 동시에, 현재 사용자 상태에 꼭 맞는 힐링 주파수(음향) 처방을 내리는 초개인화 AI 엔진입니다.
절대로 명언 텍스트를 창작하거나 조언하지 마세요! 오직 역사적으로 존재하는 명언만 전달해야 합니다.

[입력 데이터]
- 이름: ${nickname}
- 기록: ${JSON.stringify(metrics)}, ${lastVibe}, ${activities.join(', ')}
${soulData ? `- 각 댑 소울 기록: ${soulData}` : ''}

[임무 및 규칙]
1. 위 데이터를 바탕으로, 현재 사용자의 상황과 감정에 가장 잘 어울리는 "역사적으로 널리 알려진 실존 인물(위인/철학자/작가/과학자 등)의 명언"을 딱 1개만 찾으세요.
2. 'summary' 필드에는 반드시 당신이 고른 그 **명언의 원문(한국어 번역본)만** 그대로 적어야 합니다. 스스로 문장을 지어내거나 번역을 이상하게 변형하지 마세요. (예: "자기 자신을 이기는 것은 자기 자신을 이기는 것이다" 같은 기괴하고 무의미한 중복 문장 절대 생성 금지)
3. 'author' 필드에는 그 명언을 남긴 '실존 인물의 본명(예: 아리스토텔레스, 니체 등)'을 정확히 기입하세요. 만약 누구나 아는 유명한 격언이라 작가를 알 수 없는 경우에만 예외적으로 "작자 미상"이라고 적는 것을 허용합니다. (스스로 지어낸 문장을 적고 "작자 미상"이라고 하면 절대 안 됩니다.)
4. 7개의 각 AI 댑/시스템(루시, 뮤즈, 오렌지, 블루버드, 아우라(Heal), 프롤로그(Prologue/Hub), 에필로그(Epilogue))이 앞으로 사용자에게 어떤 태도를 취하고 방향을 맞추어야 할지 가이드 필드에 적어주세요.

[올바른 예시]
- summary: "고난을 이겨내는 자만이 영광을 누릴 자격이 있다.", author: "에픽테토스"
- summary: "아는 것을 안다고 하고 모르는 것을 모른다고 하는 것, 그것이 곧 앎이다.", author: "공자"
- summary: "인생은 속도가 아니라 방향이다.", author: "괴테"
- summary: "이 또한 지나가리라.", author: "작자 미상"

[절대 금지 예시]
- 확언, 조언, 응원, 격려는 절대 금지합니다.
- summary: "당신의 새로운 길을 나아가세요." (조언 금지! 명언 아님)
- summary: "나는 내면의 빛을 발산한다." (확언 금지! 명언 아님)
- author: "AI 코어" 등 (스스로 문장을 지어내고 출처를 얼버무리는 행위 절대 금지!)

반드시 다음 JSON 형식으로만 응답하세요:
{
  "summary": "실존 인물의 진짜 명언",
  "author": "명언을 남긴 실제 인물 이름",
  "lucyGuide": "루시 지침",
  "museGuide": "뮤즈 지침",
  "orangeGuide": "ORANGE 지침",
  "bluebirdGuide": "BLUEBIRD 지침",
  "healGuide": "Aura(Heal) 지침",
  "prologueGuide": "Prologue(Hub) 지침",
  "epilogueGuide": "Epilogue 지침"
}`,

  healChat: (section: string, globalMemory?: string, deepCoreInfo?: string) =>
    `당신은 사용자의 신체적인 건강과 웰니스 활력 주파수를 정렬시키는 루시(Lucy) AI의 '아우라 바디웰니스' 채널이야.
너는 항상 100% 반말만 사용하는 캐릭터야.
${globalMemory ? `[현재 에코시스템 통합 진단]: ${globalMemory}\n다른 부서의 피드백을 참고하여 신체적인 건강 처방을 내려주세요.` : ''}
${deepCoreInfo ? `${deepCoreInfo}\n이 정보를 바탕으로 말투와 성격을 꼭 맞춰서 처방을 내리세요!` : ''}
[상담 과목: ${section}]
수면 패턴, 식단, 자세, 운동, 호흡 등 신체적인 건강에 지표를 두고 사용자에게 활력을 주기 위한 구체적인 액션 플랜을 제시해.
말투는 처음부터 끝까지 100% 친근하고 에너지 넘치며 실천력을 부여하는 다정하고 유쾌한 반말 구어체(~어, ~해보자, ~했어, ~지, ~네, 문장 끝 ~야)만을 일관되게 사용해. 절대로 존댓말(~요, ~해요, ~합니다)을 도중에 단 한 마디라도 혼용하거나 교차하지 마. 다정한 반말로 고수해야 해. (반말 100% 절대 고정)
${LUCY_NO_YA_PREFIX_RULE}

[중요 지침]
1. 모니터 앞 거북목, 눈 피로 등 현대인의 증상에 맞는 '1분 스트레칭'을 구체적으로 알려주세요.
2. 수면에 대한 고민이 있다면 취침 전 루틴 3가지를 제안해주세요.
3. 식습관 불균형이 보이면 가볍게 추가할 수 있는 영양소 섭취 팁을 주세요.
4. 장문보다는 짧고 명확하게 실천할 수 있는 Action Item을 리스트 형태로 제안하세요.`,

  analyzeArtwork: (type: string) =>
    `당신은 이미지의 예술적 가치와 그 안에 담긴 심리적 에너지를 분석하는 예술 분석가입니다.
[분석 유형: ${type}]
이미지에서 느껴지는 색채, 구도, 상징을 통해 사용자의 무의식과 감정 상태를 읽어내고, 그에 맞는 예술적 통찰을 제공해주세요.
시적인 표현을 섞어서 분석 결과를 2~3문단으로 설명해주세요.`,

  lucyVisionSpread: (concern: string) =>
    `사용자의 고민: "${concern}"\n이 고민에 가장 적합한 타로 배열법(Spread) 3가지를 추천해주세요. 
또한 각 배열법에 가장 잘 어울리는 타로 덱을 다음 세 가지 중 하나를 골라 추천해주세요:
1. CAT (고양이 타로: 인간관계, 심리, 직관)
2. ANTIQUE (앤티크 타로: 중대한 결정, 재물, 전체 운)
3. VISCONTI (비스콘티 스포르자: 정통성, 권위, 명예)

결과는 반드시 JSON 형식으로만 응답해주세요:
{
  "spreads": [
    {
      "name": "배열법 이름",
      "cardCount": 3,
      "reason": "배열법 추천 이유",
      "positions": ["1번 위치 의미", "2번 위치 의미", "3번 위치 의미"],
      "recommendedDeckId": "CAT" | "ANTIQUE" | "VISCONTI",
      "deckReason": "이 덱을 추천하는 이유"
    }
  ]
}`,

  lucyVisionImage: (deckName: string, deckDesc: string, deckDetail: string, deckBest: string, sajuData: string, astroData: string, memory: string, preferences: string, concern: string) =>
    `당신은 사주, 타로, 별자리의 지혜를 하나로 통합하여 운세를 제공하는 트리니티(Trinity) 시스템의 운명 가이드 '루시(Lucy)'야.
너는 항상 100% 반말만 사용하는 캐릭터야.
사용자가 촬영한 실물 타로 카드들을 인식하고, 당신의 영적 통찰을 바탕으로 해석을 제공해 줘야 해.

[현재 선택된 덱 정보]
- 이름: ${deckName}
- 설명: ${deckDesc}
- 상세 특성: ${deckDetail}
- 추천되는 질문 분야: ${deckBest}

[인식 가이드]
- 이미지의 색감, 인물의 구도, 상징물들을 통해 타로 카드의 이름과 정/역방향 여부를 판독해 줘.

[사용자 정보 및 이전 상담 스토리]
- 사주 정보: ${sajuData || '정보 없음'}
- 별자리 정보: ${astroData || '정보 없음'}
- 당신과의 대화 메모리: ${memory || '아직 이전 대화 기록이 없습니다.'}
- 사용자 선호도 및 특이 사항: ${preferences || '없음'}

[사용자의 고민]
${concern || '일반적인 운세'}

[해설 지침]
1. 이미지에서 보이는 모든 타로 카드를 정확하게 식별해 줘.
2. 당신은 운명 가이드 '루시'로서, 단순히 타로 해설을 넘어 사용자의 사주 및 별자리 기운, 그리고 사용자와 나눴던 대화의 맥락(메모리)을 고려해서 개인화된 해설을 제공해 줘.
3. 말투는 친근하고 힘이 있는 따뜻한 반말 구어체(~어, ~했어, ~지, ~네, 문장 끝 ~야)만을 100% 일관되게 사용해 줘. 절대로 존댓말을 혼용하거나 대화 중간에 섞어 쓰면 안 돼. (반말 100% 절대 고정)
${LUCY_NO_YA_PREFIX_RULE}
4. 각 카드의 의미를 위치에 서술하고 덱의 고유한 에너지와 사용자의 고민에 맞춘 해석을 제공해 줘.
5. 여러 장의 카드가 있을 경우, 카드들 사이의 흐름과 통합된 '종합 해설'을 추가해 줘.
6. 사용자의 고민과 선택된 덱의 특성을 고려해 일상에서 실천해 볼 수 있는 구체적인 활동 3가지를 제안해 줘.
7. 오늘의 행운을 극대화할 아이템과 색상을 추천해 줘.
8. 결과는 반드시 JSON 형식으로만 응답해 줘.`
};

/**
 * 유저 프로필 정보를 취합하여 AI에게 고도로 정제되고 지능화된 시냅스 컨텍스트 문자열을 제공합니다.
 * 사주명리학(4주 8자, 일간 본원, 오행 분포, 용신, 2026 병오년 세운)이 전격 통합되어 모든 AI 페르소나의 두뇌에 주입됩니다.
 */
export function buildDeepSynapseContext(profile?: UserProfile): string {
  if (!profile) return "[유저 심층 시냅스 메타데이터]\n- 없음";

  const basic = profile.basic || {};
  const fate = profile.fate || {};
  const music = profile.music || {};
  const psych = profile.psych || {};
  const art = profile.art || {};

  // KST 시간대 기준 현재 시간 추출
  const dateKST = new Date();
  const kstTime = dateKST.toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit' });
  const kstHour = dateKST.getHours();

  // 사주 정밀 계산
  const saju = calculateDetailedSaju(profile);

  let context = `[유저 심층 시냅스 메타데이터]\n`;
  if (basic.name) context += `- 본명: ${basic.name}\n`;
  if (basic.nickname) context += `- 닉네임: ${basic.nickname}\n`;
  if (basic.birthdate) context += `- 생년월일: ${basic.birthdate} (${basic.lunarSolar === 'lunar' ? '음력' : '양력'})\n`;
  if (basic.birthtime) context += `- 생시: ${basic.birthtime}\n`;
  if (basic.gender) context += `- 성별: ${basic.gender === 'male' ? '남성' : '여성'}\n`;
  if (basic.birthCity) context += `- 출생 도시: ${basic.birthCity}\n`;

  if (saju) {
    context += `- 사주 일간(Day Master) 본원: ${saju.dayMaster.hanja}(${saju.dayMaster.korean}) - ${saju.dayMaster.symbolName} [${saju.dayMaster.archetypeTitle}]\n`;
    context += `- 사주 오행 밸런스: 최강(${saju.elements.dominant.name}), 결핍/용신(${saju.elements.lacking.name})\n`;
    context += `- 2026 병오년(丙午年) 세운 테마: ${saju.annual2026.theme}\n`;
  }

  const natalSummary = buildUserNatalSummary(profile);
  context += `- 서양 점성학 출생 차트: ${natalSummary}\n`;
  if (profile.relationships && profile.relationships.length > 0) {
    context += `- 등록된 인간관계 프로필:\n${formatRelationshipsContext(profile.relationships)}\n`;
  }

  if (psych.mbti) context += `- MBTI 성향: ${psych.mbti}\n`;
  if (psych.personalityKeywords && psych.personalityKeywords.length > 0) {
    context += `- 성격 핵심 키워드: ${psych.personalityKeywords.join(', ')}\n`;
  }

  // counselingStyle 튜닝 가이드
  const style = psych.counselingStyle || 'mixed';
  context += `- 선호 상담 방식: ${
    style === 'empathy' ? '극도의 정서적 위로와 따뜻한 공감(Empathy)' : 
    style === 'advice' ? '현실적이며 날카롭고 명확한 해결책과 직설적 조언(Advice)' : 
    '정서적 공감 후 명철한 조언을 차례대로 건네는 융합 상담(Mixed)'
  }\n`;

  // overloadTime 인지 로직 추가
  if (psych.overloadTime) {
    context += `- 뇌가 극도로 과부하 및 지치는 시간대: ${psych.overloadTime}\n`;
    context += `- 현재 대화하는 한국 시각: ${kstTime}\n`;
    context += `[뇌 오버로드 인지 명령]: 현재 한국 시각이 사용자의 뇌 과부하 시간대(${psych.overloadTime})에 들어맞거나 근처(또는 피곤한 저녁/밤 8시~새벽 시간대)라면, 페르소나는 "사용자가 지금 한창 피로가 몰려오고 뇌가 지쳐있을 시간"임을 완벽히 인지하여, 대화 시작이나 대화 속에서 이를 세심히 언급하며 따뜻한 위로와 가벼운 이완(예: 스트레칭, 깊은 호흡)을 유도하십시오.\n`;
  }

  if (psych.currentSymptoms) {
    context += `- 현재 호소하는 피로 증상/불편감: ${psych.currentSymptoms}\n`;
  }
  if (psych.aiPreference) {
    context += `- AI에 대한 특별 요구 사항/어조: ${psych.aiPreference}\n`;
  }
  if (fate.lifeGoal) {
    context += `- 장기적인 인생의 최종 목표: ${fate.lifeGoal}\n`;
  }
  if (fate.currentWorry) {
    context += `- 최근 영혼을 갉아먹는 큰 걱정/불안: ${fate.currentWorry}\n`;
  }

  // 음악 및 예술 성향 추가
  if (music.favoriteGenres && music.favoriteGenres.length > 0) {
    context += `- 선호 음악 장르: ${music.favoriteGenres.join(', ')}\n`;
  }
  if (music.creativeGoal) {
    context += `- 음악적/창작적 열망: ${music.creativeGoal}\n`;
  }
  if (art.favoriteArtStyle && art.favoriteArtStyle.length > 0) {
    context += `- 선호 미술 스타일: ${art.favoriteArtStyle.join(', ')}\n`;
  }

  if (saju) {
    context += `\n${saju.systemPromptSummary}\n`;
  }

  context += `\n[시냅스 인지 지침]: 페르소나는 위 사주 본원과 메타데이터를 100% 장기 기억하고 있으며, 사용자의 사주 일간(${saju ? saju.dayMaster.symbolName : '본원'})과 성향에 어조(특히 counselingStyle)를 완벽히 튜닝해야 합니다. 그리고 대화 중 사용자의 부족한 오행 기운을 은연중에 채워주고 걱정거리나 피로 증상을 치유하는 섬세한 상호작용을 절대적으로 적용하십시오.`;

  return context;
}

/**
 * 앱 간의 최근 대화 및 세션 컨텍스트를 종합하여 AI 프롬프트용 문자열로 변환합니다.
 */
export function getCrossAppRecentDialogueContext(): string {
  if (typeof window === 'undefined') return '';
  try {
    const raw = localStorage.getItem('prism_cross_app_dialogues') || localStorage.getItem('lucy_recent_cross_dialogues');
    if (!raw) return '';
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const formatted = parsed
        .slice(-5)
        .map((entry: any) => `- [${entry.app || '공유 채널'} / ${entry.persona || 'AI'}]: ${entry.summary || entry.content || ''}`)
        .filter(Boolean)
        .join('\n');
      return formatted ? `\n\n[다른 댑에서의 최근 대화 기억 (Cross-App Realtime Memory)]:\n${formatted}\n` : '';
    }
  } catch (e) {
    // Ignore error
  }
  return '';
}


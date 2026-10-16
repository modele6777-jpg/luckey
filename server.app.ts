import dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: ".env.local", override: true });

// Prefer explicit env keys; clean known revoked/deleted service account keys.
if (process.env.GEMINI_API_KEY?.includes("AQ.Ab8RN6LJzmJJ3ExtNix-ERyIkxzPtsV23WdCr71NRGItFPK41A")) {
  delete process.env.GEMINI_API_KEY;
}
if (process.env.GOOGLE_GENAI_API_KEY?.includes("AQ.Ab8RN6LJzmJJ3ExtNix-ERyIkxzPtsV23WdCr71NRGItFPK41A")) {
  delete process.env.GOOGLE_GENAI_API_KEY;
}
const activeGeminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || "";
if (activeGeminiKey) {
  process.env.GEMINI_API_KEY = activeGeminiKey;
  process.env.GOOGLE_GENAI_API_KEY = activeGeminiKey;
}

import express from "express";
import fs from "fs";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./server/routers/index";
import { calmRouter } from "./server/calmRouter";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import { OpenAI } from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import { buildSpecificTarotDailyOracle, buildSpecificSedonaDailyOracle } from "./src/lib/dailyTarotOracle";

const _filename = typeof __filename !== "undefined" ? __filename : "";
const _dirname = typeof __dirname !== "undefined" ? __dirname : process.cwd();

import { getGeminiApiKey } from "./server/geminiKey";
export { getGeminiApiKey };

function getAIConfig() {
  let aiType = (process.env.AI_TYPE || '').toLowerCase().trim();
  let apiKey = process.env.AI_API_KEY || '';

  // Auto-detection based on API key prefix or explicit separate API keys
  if (process.env.XAI_API_KEY) {
    aiType = 'grok';
    apiKey = process.env.XAI_API_KEY;
  } else if (process.env.GROK_API_KEY) {
    aiType = 'grok';
    apiKey = process.env.GROK_API_KEY;
  } else if (process.env.GROQ_API_KEY) {
    aiType = 'groq';
    apiKey = process.env.GROQ_API_KEY;
  } else if (apiKey.startsWith('xai-')) {
    aiType = 'grok';
  } else if (apiKey.startsWith('gsk_')) {
    aiType = 'groq';
  }

  // Default fallback if still empty
  if (!aiType || aiType === 'poe') {
    aiType = 'gemini';
  }

  // Resolve API Key correctly
  if (!apiKey) {
    if (aiType === 'grok') {
      apiKey = process.env.XAI_API_KEY || process.env.GROK_API_KEY || process.env.AI_API_KEY || '';
    } else if (aiType === 'groq') {
      apiKey = process.env.GROQ_API_KEY || '';
    } else if (aiType === 'gemini') {
      apiKey = getGeminiApiKey();
    }
  }

  // If Grok/Groq was selected but no key is available, fall back to Gemini.
  if ((aiType === 'grok' || aiType === 'groq') && !apiKey) {
    aiType = 'gemini';
    apiKey = getGeminiApiKey();
  }

  return { aiType, apiKey };
}

const KOREAN_ONLY_OUTPUT_RULE = `[모든 앱 공통 언어 및 문장 가독성 원칙]:
1. 모든 자연어 문장은 현대 한국어(한글)로만 작성하세요. 한자 및 중국어 표기를 절대 사용하지 마세요.
2. [간결한 문장 구조 & 가독성 극대화]: 장황하거나 불필요하게 늘어지는 긴 만연체 문장은 지양하고, 명확하고 산뜻한 단문 위주로 작성하세요.
3. 핵심 인사이트와 행동 가이드는 불릿 포인트(•)와 적절한 줄바꿈을 활용하여 한눈에 파악하기 쉽게 카드형으로 구조화하세요.`;

function withKoreanOnlyOutput(messages: any[] = []) {
  return [{ role: "system", content: KOREAN_ONLY_OUTPUT_RULE }, ...messages];
}

function parseMultimodalDataUrl(url: string): { mimeType: string; data: string } | null {
  if (!url || typeof url !== "string") return null;
  const match = url.match(/^data:([a-zA-Z0-9.+-]+\/[a-zA-Z0-9.+-]+);base64,(.+)$/s);
  if (match) {
    const rawMime = match[1].toLowerCase();
    const data = match[2].replace(/\s+/g, "");
    return { mimeType: rawMime, data };
  }
  if (url.length > 50 && !url.startsWith("http") && !url.includes(" ")) {
    return { mimeType: "image/jpeg", data: url.replace(/\s+/g, "") };
  }
  return null;
}

function parseImageDataUrl(url: string): { mimeType: string; data: string } | null {
  return parseMultimodalDataUrl(url);
}

function sanitizeTextContent(text: string): string {
  if (!text || typeof text !== "string") return "";
  // If the text starts with %PDF- (binary garbage inadvertently passed as text), safely truncate or clean
  if (text.startsWith("%PDF-") || (text.length > 2000 && text.includes("/Filter") && text.includes("/FlateDecode"))) {
    return "[첨부된 PDF 바이너리 문서 파싱 데이터]";
  }
  // Remove null bytes and non-printable control characters that break JSON / LLM APIs
  const cleaned = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  // Truncate extremely long single text turns to prevent HTTP 413 / token overflow
  if (cleaned.length > 80000) {
    return cleaned.slice(0, 80000) + "\n\n[...이하 내용 길이 한도로 생략...]";
  }
  return cleaned;
}

function convertOpenAIMessagesToGeminiContents(rawMessages: any[]) {
  const contents: any[] = [];

  for (const m of rawMessages) {
    if (!m) continue;
    const role = (m.role === "assistant" || m.role === "model") ? "model" : "user";
    const parts: any[] = [];

    if (typeof m.content === "string") {
      const clean = sanitizeTextContent(m.content);
      if (clean.trim()) {
        parts.push({ text: clean });
      }
    } else if (Array.isArray(m.content)) {
      for (const p of m.content) {
        if (!p) continue;
        if (typeof p === "string") {
          const clean = sanitizeTextContent(p);
          if (clean.trim()) parts.push({ text: clean });
        } else if (p.type === "text" && typeof p.text === "string") {
          const clean = sanitizeTextContent(p.text);
          if (clean.trim()) parts.push({ text: clean });
        } else if (p.type === "image_url" || p.type === "file_url" || p.image_url || p.file_url) {
          const url = p.image_url?.url || p.file_url?.url || p.url || (typeof p === "string" ? p : "");
          const multi = parseMultimodalDataUrl(url);
          if (multi) {
            parts.push({
              inlineData: {
                data: multi.data,
                mimeType: multi.mimeType,
              }
            });
          }
        }
      }
    }

    if (parts.length === 0) continue;

    // Merge consecutive messages with the same role
    if (contents.length > 0 && contents[contents.length - 1].role === role) {
      contents[contents.length - 1].parts.push(...parts);
    } else {
      contents.push({ role, parts });
    }
  }

  // Gemini requires the contents array to start with a 'user' message
  let startIndex = 0;
  while (startIndex < contents.length && contents[startIndex].role === "model") {
    startIndex++;
  }
  const filtered = contents.slice(startIndex);

  if (filtered.length === 0) {
    return [{ role: "user", parts: [{ text: "Continue" }] }];
  }

  return filtered;
}

const modelCooldownMap = new Map<string, number>();

function isModelThrottled(model: string): boolean {
  const expiry = modelCooldownMap.get(model);
  if (!expiry) return false;
  if (Date.now() > expiry) {
    modelCooldownMap.delete(model);
    return false;
  }
  return true;
}

function markModelThrottled(model: string, durationMs = 180000) {
  modelCooldownMap.set(model, Date.now() + durationMs);
}

function isTemporaryUnavailableOrRateLimited(err: any): boolean {
  if (!err) return false;
  const status = err?.status ?? err?.error?.code ?? err?.statusCode;
  if (status === 429 || status === 503 || status === 500 || status === 502 || status === 504 || status === 408) {
    return true;
  }
  const errStr = (String(err?.message || err || "") + " " + JSON.stringify(err || {})).toLowerCase();
  return (
    errStr.includes("429") ||
    errStr.includes("503") ||
    errStr.includes("500") ||
    errStr.includes("504") ||
    errStr.includes("resource_exhausted") ||
    errStr.includes("quota") ||
    errStr.includes("high demand") ||
    errStr.includes("spikes in demand") ||
    errStr.includes("overloaded") ||
    errStr.includes("temporarily unavailable") ||
    errStr.includes("service unavailable") ||
    errStr.includes("rate limit") ||
    errStr.includes("rate_limit") ||
    errStr.includes("deadline_exceeded")
  );
}

function getPrioritizedGeminiModels(requestedModel?: string): string[] {
  const defaultModels = [
    "gemini-3.1-flash-lite",
    "gemini-flash-latest",
    "gemini-3.8-flash",
  ];

  const uniqueCandidates = [
    requestedModel,
    process.env.GEMINI_MODEL,
    ...defaultModels,
  ].filter((m, i, arr): m is string => Boolean(m) && arr.indexOf(m) === i);

  // Partition candidates: unthrottled first, throttled (cooldown) last
  const available = uniqueCandidates.filter(m => !isModelThrottled(m));
  const throttled = uniqueCandidates.filter(m => isModelThrottled(m));

  return [...available, ...throttled];
}

async function callGeminiStreamWithFallback(ai: GoogleGenAI, contents: any, config: any, requestedModel?: string) {
  const modelsToTry = getPrioritizedGeminiModels(requestedModel);
  const streamConfig = {
    ...config,
    maxOutputTokens: config?.maxOutputTokens || 8192,
  };

  let lastError: any = null;
  for (const model of modelsToTry) {
    try {
      const stream = await ai.models.generateContentStream({
        model,
        contents,
        config: streamConfig,
      });
      modelCooldownMap.delete(model);
      return { stream, modelUsed: model };
    } catch (err: any) {
      lastError = err;
      const isThrottled = isTemporaryUnavailableOrRateLimited(err);
      if (isThrottled) {
        markModelThrottled(model, 180000);
        console.warn(`[server/gemini] Stream Model ${model} is experiencing high demand/rate limit (503/429), throttling model and engaging next available model...`);
      } else {
        console.warn(`[server/gemini] Stream Model ${model} failed (${err?.message?.slice(0, 120) || err}), attempting fallback model...`);
      }
    }
  }
  throw lastError || new Error("All Gemini streaming models exhausted");
}

async function callGeminiContentWithFallback(ai: GoogleGenAI, contents: any, config: any, requestedModel?: string) {
  const modelsToTry = getPrioritizedGeminiModels(requestedModel);
  const contentConfig = {
    ...config,
    maxOutputTokens: config?.maxOutputTokens || 8192,
  };

  let lastError: any = null;
  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: contentConfig,
      });
      modelCooldownMap.delete(model);
      return { response, modelUsed: model };
    } catch (err: any) {
      lastError = err;
      const isThrottled = isTemporaryUnavailableOrRateLimited(err);
      if (isThrottled) {
        markModelThrottled(model, 180000);
        console.warn(`[server/gemini] Content Model ${model} is experiencing high demand/rate limit (503/429), throttling model and engaging next available model...`);
      } else {
        console.warn(`[server/gemini] Content Model ${model} failed (${err?.message?.slice(0, 120) || err}), attempting fallback model...`);
      }
    }
  }
  throw lastError || new Error("All Gemini content models exhausted");
}

async function startServer() {
  const app = express();
  const PORT = Number.parseInt(process.env.PORT || "3000", 10) || 3000;

  app.use(express.json({ limit: '50mb' }));

  // CORS, Iframe Permissions & OPTIONS Preflight Handler (for AI Studio & Cloud Run)
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-stainless-sdk-version, x-stainless-os, x-stainless-lang, x-stainless-runtime, x-stainless-runtime-version, x-stainless-helper-method, x-stainless-package-version");
    res.removeHeader("X-Frame-Options");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // AI Handler
  app.post("/api/ai", async (req, res) => {
    const { aiType, apiKey } = getAIConfig();
    const { prompt, systemInstruction, responseSchema, imageData, mimeType, model: requestedModel } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: "AI_API_KEY is not set." });
    }

    try {
      if (aiType === 'gemini') {
        const ai = new GoogleGenAI({ apiKey });
        const config: any = {};
        if (systemInstruction) config.systemInstruction = systemInstruction;
        if (responseSchema) {
          config.responseMimeType = "application/json";
          config.responseSchema = responseSchema;
        }

        const contents = imageData && mimeType
          ? [{ role: "user", parts: [{ text: prompt }, { inlineData: { data: imageData, mimeType } }] }]
          : [{ role: "user", parts: [{ text: prompt }] }];

        const { response } = await callGeminiContentWithFallback(ai, contents, config, requestedModel);
        return res.status(200).json({ text: response.text });
      } 
      
      else if (aiType === 'openai') {
        const openai = new OpenAI({ apiKey });
        const messages: any[] = [];
        if (systemInstruction) messages.push({ role: "system", content: systemInstruction });
        messages.push({ role: "user", content: prompt });

        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages,
          response_format: responseSchema ? { type: "json_object" } : undefined
        });
        return res.status(200).json({ text: response.choices[0].message.content });
      }

      else if (aiType === 'claude') {
        const anthropic = new Anthropic({ apiKey });
        const response = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20240620",
          system: systemInstruction,
          max_tokens: 4096,
          messages: [{ role: "user", content: prompt }],
        });
        // @ts-ignore
        return res.status(200).json({ text: response.content[0].text });
      }

      else if (aiType === 'manus') {
        const manus = new OpenAI({ 
          apiKey: apiKey, 
          baseURL: "https://api.manus.ai/v1" 
        });
        const response = await manus.chat.completions.create({
          model: "manus-1", 
          messages: [{ role: "user", content: prompt }],
        });
        return res.status(200).json({ text: response.choices[0].message.content });
      }

      // 狩?Grok (xAI) - ?꾩쟾 吏??
      else if (aiType === 'grok') {
        const grok = new OpenAI({
          apiKey: apiKey,
          baseURL: "https://api.x.ai/v1"
        });

        const messages: any[] = [{ role: "system", content: KOREAN_ONLY_OUTPUT_RULE }];
        if (systemInstruction) messages.push({ role: "system", content: systemInstruction });
        messages.push({ role: "user", content: prompt });

        const modelsToTry = [process.env.XAI_MODEL || "grok-4.3", "grok-4.20", "grok-4.20-0309-non-reasoning", "grok-3"];
        if (requestedModel && !modelsToTry.includes(requestedModel)) {
          modelsToTry.unshift(requestedModel);
        }

        let response;
        let lastError = null;

        for (const currentModel of modelsToTry) {
          try {
            response = await grok.chat.completions.create({
              model: currentModel,
              messages,
              temperature: 0.7,
              max_tokens: 8192,
              response_format: responseSchema ? { type: "json_object" } : undefined
            });
            lastError = null;
            break;
          } catch (err: any) {
            console.warn(`[grok] Model ${currentModel} failed, trying fallback...`, err.message || err);
            lastError = err;
          }
        }

        if (lastError || !response) {
          throw lastError || new Error("All Grok models failed.");
        }

        return res.status(200).json({ 
          text: response.choices[0].message.content 
        });
      }

      // 狩?Groq - ?꾩쟾 吏??
      else if (aiType === 'groq') {
        const groq = new OpenAI({
          apiKey: apiKey,
          baseURL: "https://api.groq.com/openai/v1"
        });

        const messages: any[] = [];
        if (systemInstruction) messages.push({ role: "system", content: systemInstruction });
        messages.push({ role: "user", content: prompt });

        try {
          const response = await groq.chat.completions.create({
            model: requestedModel || "llama-3.3-70b-versatile",
            messages,
            temperature: 0.7,
            max_tokens: 8192,
            response_format: responseSchema ? { type: "json_object" } : undefined
          });

          return res.status(200).json({ 
            text: response.choices[0].message.content 
          });
        } catch (groqErr: any) {
          console.warn("[groq] Failed in /api/ai, falling back to Gemini...", groqErr);
          const geminiKey = getGeminiApiKey();
          if (geminiKey) {
            const ai = new GoogleGenAI({ apiKey: geminiKey });
            const config: any = {};
            if (systemInstruction) config.systemInstruction = systemInstruction;
            if (responseSchema) {
              config.responseMimeType = "application/json";
              config.responseSchema = responseSchema;
            }
            const { response } = await callGeminiContentWithFallback(
              ai,
              [{ role: "user", parts: [{ text: prompt }] }],
              config
            );
            return res.status(200).json({ text: response.text });
          } else {
            throw groqErr;
          }
        }
      }

      else {
        throw new Error(`AI_TYPE '${aiType}' is not supported yet.`);
      }

    } catch (error: any) {
      console.error("AI execution error:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  // ?대?吏 ?앹꽦??Grok 吏??異붽?
  app.post("/api/ai/image", async (req, res) => {
    const configObj = getAIConfig();
    let aiType = configObj.aiType;
    if (aiType !== 'gemini' && aiType !== 'grok') {
      if (getGeminiApiKey()) {
        aiType = 'gemini';
      }
    }
    const apiKey = configObj.apiKey || getGeminiApiKey() || '';
    const { prompt, aspectRatio = "1:1", fast = false } = req.body;

    const buildPollinationsUrl = () => {
      const dims = aspectRatio === "16:9"
        ? { width: 768, height: 432 }
        : aspectRatio === "9:16"
          ? { width: 432, height: 768 }
          : { width: 512, height: 512 };
      return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${dims.width}&height=${dims.height}&seed=${Math.floor(Math.random() * 1000000)}&nologo=true&model=flux`;
    };

    const performPollinationsFallback = async (urlOnly = true) => {
      console.warn("[API] Falling back to Pollinations AI for free image generation...");
      const pollinationsUrl = buildPollinationsUrl();
      if (urlOnly) return pollinationsUrl;

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);
      try {
        const pollRes = await fetch(pollinationsUrl, { signal: controller.signal });
        if (pollRes.ok) {
          const arrayBuffer = await pollRes.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString('base64');
          return `data:image/jpeg;base64,${base64}`;
        }
        throw new Error(`Pollinations API returned status ${pollRes.status}`);
      } finally {
        clearTimeout(timer);
      }
    };

    if (fast) {
      return res.status(200).json({ imageUrl: buildPollinationsUrl() });
    }

    if (!apiKey) {
      try {
        const fallbackUrl = await performPollinationsFallback(true);
        return res.status(200).json({ imageUrl: fallbackUrl });
      } catch (fallbackErr: any) {
        return res.status(400).json({ error: "Missing API Key and fallback failed: " + fallbackErr.message });
      }
    }

    try {
      if (aiType === 'grok') {
        const grok = new OpenAI({
          apiKey,
          baseURL: "https://api.x.ai/v1"
        });

        const validRatio = ["1:1", "16:9", "9:16", "4:3", "3:4"].includes(aspectRatio) ? aspectRatio : "1:1";
        const grokImageModels = ["grok-imagine-image-quality", "grok-imagine-image", "grok-3-image-preview", "grok-2-image-1212"];
        let lastGrokImageErr: any = null;

        for (const imageModel of grokImageModels) {
          try {
            const response = await Promise.race([
              grok.images.generate({
                model: imageModel,
                prompt,
                aspect_ratio: validRatio,
                n: 1,
              } as any),
              new Promise((_, reject) => setTimeout(() => reject(new Error("Grok image timeout")), 8000)),
            ]) as any;
            const imageUrl = response.data?.[0]?.url;
            if (imageUrl) {
              return res.status(200).json({ imageUrl });
            }
          } catch (err: any) {
            lastGrokImageErr = err;
            console.warn(`[grok] ${imageModel} failed, trying next model...`, err.message || err);
          }
        }

        console.warn("[grok] All image models failed, resorting to Pollinations AI fallback...", lastGrokImageErr?.message || lastGrokImageErr);
        const fallbackUrl = await performPollinationsFallback(true);
        return res.status(200).json({ imageUrl: fallbackUrl });
      }
      else if (aiType === 'gemini') {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
        let imageUrl = "";
        let lastError = null;

        const validRatio = ["1:1", "3:4", "4:3", "9:16", "16:9"].includes(aspectRatio) ? aspectRatio : "1:1";
        const modelsToTry = [
          'gemini-3.1-flash-lite-image',
          'gemini-3.1-flash-image',
          'gemini-3-pro-image'
        ];

        for (const modelName of modelsToTry) {
          try {
            console.log(`[API] Attempting image generation with model: ${modelName}`);
            const result = await Promise.race([
              ai.models.generateContent({
                model: modelName,
                contents: {
                  parts: [{ text: prompt }]
                },
                config: {
                  imageConfig: {
                    aspectRatio: validRatio as any,
                  }
                }
              }),
              new Promise((_, reject) => setTimeout(() => reject(new Error("Image generation timeout")), 15000))
            ]) as any;

            const parts = result.candidates?.[0]?.content?.parts;
            if (parts && Array.isArray(parts)) {
              for (const part of parts) {
                if (part.inlineData?.data) {
                  const mime = part.inlineData.mimeType || 'image/png';
                  imageUrl = `data:${mime};base64,${part.inlineData.data}`;
                  break;
                }
              }
            }

            if (imageUrl) {
              console.log(`[API] Successfully generated image with model: ${modelName}`);
              break;
            }
          } catch (e: any) {
            console.warn(`[API] Model ${modelName} image generation failed:`, e?.message?.slice(0, 120) || e);
            lastError = e;
          }
        }

        if (imageUrl) {
          return res.status(200).json({ imageUrl });
        } else {
          try {
            const fallbackUrl = await performPollinationsFallback(true);
            return res.status(200).json({ imageUrl: fallbackUrl });
          } catch (fallbackErr: any) {
            console.error("[API] Fallback image generation failed:", fallbackErr);
            throw lastError || new Error("Failed image generation and fallback.");
          }
        }
      }
      throw new Error("Image generation not supported for this AI.");
    } catch (error: any) {
      console.error("Image generation error:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  // 湲곕줉 AI ?먮룞 遺꾩꽍 諛?愿???ㅼ썙??媛먯젙 ?쒓렇 異붿텧
  app.post("/api/ai/analyze-entry", async (req, res) => {
    const { title = "", content = "", type = "" } = req.body;

    if (!content && !title) {
      return res.status(200).json({ keywords: [], emotions: [] });
    }

    const prompt = `湲곕줉???좏삎: ${type}
湲곕줉???쒕ぉ: ${title}
湲곕줉???댁슜:
${content}

???대㈃??湲곕줉???ъ꽭?섍쾶 硫뷀? 遺꾩꽍?섏뿬:
1. 湲곕줉???듭떖 二쇱젣? ?앷컖, 愿???щЪ??愿?듯븯??????ㅼ썙??3~5媛?(諛곗뿴濡?異붿텧)
2. 湲?댁씠??二쇰맂 留덉쓬 ?곹깭, 誘몃쵖???댁“, ?먮꼫吏 ?먮쫫???뺥솗??臾섏궗?섎뒗 媛먯젙/?щ━ ?곹깭 ?쒓렇 1~3媛?(諛곗뿴濡?異붿텧)

?ㅼ쭅 ?ㅼ쓬 JSON ?ㅽ궎留??뺤떇???좏슚??JSON 寃곌낵留?諛섑솚??二쇱꽭??
{
  "keywords": ["?ㅼ썙??", "?ㅼ썙??", "?ㅼ썙??"],
  "emotions": ["媛먯젙?쒓렇1", "媛먯젙?쒓렇2"]
}`;

    // 1. Gemini AI濡?遺꾩꽍 ?쒕룄
    const geminiKey = getGeminiApiKey() || process.env.AI_API_KEY || "";
    if (geminiKey) {
      try {
        const ai = new GoogleGenAI({ 
          apiKey: geminiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            }
          }
        });
        const { Type } = await import("@google/genai");
        const { response } = await callGeminiContentWithFallback(
          ai,
          [{ parts: [{ text: prompt }] }],
          {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                keywords: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "핵심 키워드 리스트 (3~5개)"
                },
                emotions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "감정 태그 리스트 (1~3개)"
                }
              },
              required: ["keywords", "emotions"]
            },
            temperature: 0.2
          }
        );
        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          if (parsed && Array.isArray(parsed.keywords) && Array.isArray(parsed.emotions)) {
            return res.status(200).json(parsed);
          }
        }
      } catch (geminiError) {
        console.warn("[Analyze AI] Gemini primary analysis failed, trying secondary fallback:", geminiError);
      }
    }

    // 2. OpenAI / ? AI ?ㅺ? ?덈뒗 寃쎌슦??2李?fallback
    const openAIKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY || "";
    if (openAIKey) {
      try {
        const openai = new OpenAI({ apiKey: openAIKey });
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a professional meta-cognitive psychologist helping to analyze diary/record entries. Output JSON matching the request structure." },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" }
        });
        const rawText = response.choices[0]?.message?.content;
        if (rawText) {
          const parsed = JSON.parse(rawText.trim());
          if (parsed && Array.isArray(parsed.keywords) && Array.isArray(parsed.emotions)) {
            return res.status(200).json(parsed);
          }
        }
      } catch (openaiError) {
        console.warn("[Analyze AI] OpenAI fallback analysis failed:", openaiError);
      }
    }

    // 3. AI 분석 전체 실패 또는 키 부재 시: 휴리스틱 한글 형태소 키워드 분석을 탑재한 영리한 오프라인 폴백 처리
    try {
      const keywords = [];
      const emotions = [];

      const lowerContent = content.toLowerCase();
      const emotionDictionary = [
        { keys: ["슬픔", "우울", "눈물", "힘듦", "고통", "지침", "아픔"], value: "위로가 필요함" },
        { keys: ["기쁨", "행복", "즐거움", "신남", "설렘", "웃음", "희망"], value: "기쁨과 희망" },
        { keys: ["평온", "차분", "조용", "여유", "휴식", "가만", "명상"], value: "평온함" },
        { keys: ["불안", "걱정", "초조", "두려움", "겁", "긴장"], value: "감정 정돈" },
        { keys: ["화남", "짜증", "분노", "억울", "불만"], value: "감정 해소" },
        { keys: ["아이디어", "생각", "인사이트", "창조", "영감"], value: "창의적 자극" },
        { keys: ["사주", "운명", "타로", "별자리", "미래"], value: "운명의 탐색" }
      ];

      for (const item of emotionDictionary) {
        if (item.keys.some(k => lowerContent.includes(k))) {
          if (!emotions.includes(item.value)) {
            emotions.push(item.value);
          }
        }
      }

      if (emotions.length === 0) {
        emotions.push("차분한 관조");
      }

      const allWords = content.split(/[\s,.\?\!]+/).filter(w => w.length >= 2 && w.length <= 6);
      const uniqueWords = Array.from(new Set(allWords)) as string[];
      for (const word of uniqueWords) {
        if (word.endsWith("은") || word.endsWith("는") || word.endsWith("이") || word.endsWith("가") || word.endsWith("을") || word.endsWith("를")) {
          const stem = word.slice(0, -1);
          if (stem.length >= 2 && !keywords.includes(stem)) keywords.push(stem);
        } else {
          if (!keywords.includes(word)) keywords.push(word);
        }
        if (keywords.length >= 4) break;
      }

      if (keywords.length < 3) {
        if (type) keywords.push(type);
        keywords.push("자아 성찰");
        keywords.push("소중한 기록");
      }

      return res.status(200).json({
        keywords: keywords.slice(0, 5),
        emotions: emotions.slice(0, 3)
      });
    } catch (fallbackErr) {
      console.error("[Analyze AI] Entire analysis pipeline and offline fallback failed:", fallbackErr);
      return res.status(200).json({
        keywords: ["?대㈃??湲곕줉"],
        emotions: ["?듭같"]
      });
    }
  });

  // Bluebird ?꾩뒯??'猷⑤?' ???ㅻ뒛???덉닠 ?묓뭹 vision 遺꾩꽍 + 紐낃끝쨌?쑣룸챸??異붿쿇
  app.post("/api/bluebird/docent", async (req, res) => {
    try {
      const { handleBluebirdDocent } = await import("./server/bluebirdDocent");
      const result = await handleBluebirdDocent(req.body);
      return res.status(200).json(result);
    } catch (err: any) {
      console.error("[bluebird/docent] error:", err);
      const message = err?.message || "?꾩뒯???묐떟 ?앹꽦???ㅽ뙣?덉뒿?덈떎.";
      const status = message.includes("?꾩슂") || message.includes("?ㅼ젙") ? 400 : 500;
      return res.status(status).json({ error: message });
    }
  });

  // Muse ?꾩뒯?????곗씪由??꾪듃 vision 遺꾩꽍 + ?뚯꽦 ?먮젅?댁뀡
  app.post("/api/muse/docent", async (req, res) => {
    try {
      const { handleMuseDocent } = await import("./server/museDocent");
      const result = await handleMuseDocent(req.body);
      return res.status(200).json(result);
    } catch (err: any) {
      console.error("[muse/docent] error:", err);
      const message = err?.message || "?꾩뒯???묐떟 ?앹꽦???ㅽ뙣?덉뒿?덈떎.";
      const status = message.includes("?꾩슂") || message.includes("?ㅼ젙") ? 400 : 500;
      return res.status(status).json({ error: message });
    }
  });

  app.post("/api/muse/artwork-image", async (req, res) => {
    try {
      const { resolveMuseArtworkImage } = await import("./server/museArtworkImage");
      const { forcePollinations, ...art } = req.body || {};
      const result = await resolveMuseArtworkImage(art, { forcePollinations: !!forcePollinations });
      return res.status(200).json(result);
    } catch (err: any) {
      console.error("[muse/artwork-image] error:", err);
      return res.status(500).json({ error: err?.message || "?묓뭹 ?대?吏瑜?遺덈윭?ㅼ? 紐삵뻽?듬땲??" });
    }
  });

  app.get("/api/muse/artwork-image/proxy", async (req, res) => {
    try {
      const { isAllowedImageProxyUrl, proxyArtworkImage } = await import("./server/museArtworkImage");
      const url = String(req.query.url || "");
      if (!isAllowedImageProxyUrl(url)) {
        return res.status(400).json({ error: "Invalid image URL" });
      }
      await proxyArtworkImage(url, res);
    } catch (err: any) {
      console.error("[muse/artwork-image/proxy] error:", err);
      return res.status(502).json({ error: err?.message || "?대?吏 ?꾨줉?쒖뿉 ?ㅽ뙣?덉뒿?덈떎." });
    }
  });

  app.post("/api/ai/daily-bgm", async (req, res) => {
    try {
      const {
        focusPlaylist,
        frequency,
        cardName,
        symbol,
        dateKey,
        trackKey,
      } = req.body || {};

      if (!focusPlaylist || !dateKey || !trackKey) {
        return res.status(400).json({ error: "focusPlaylist, dateKey, trackKey are required" });
      }

      const { generateDailyBgmBuffer } = await import("./server/api-lib/generateDailyBgm");
      const { buffer, durationSec } = generateDailyBgmBuffer({
        focusPlaylist: String(focusPlaylist),
        frequency: frequency ? String(frequency) : undefined,
        cardName: cardName ? String(cardName) : undefined,
        symbol: symbol ? String(symbol) : undefined,
        dateKey: String(dateKey),
        trackKey: String(trackKey),
      });

      return res.status(200).json({
        audioContent: buffer.toString("base64"),
        encoding: "wav",
        trackKey: String(trackKey),
        durationSec,
      });
    } catch (err: unknown) {
      console.error("[daily-bgm] error:", err);
      const message = err instanceof Error ? err.message : "Daily BGM generation failed";
      return res.status(500).json({ error: message });
    }
  });

  // 오늘의 예술: 검증된 카탈로그 기반 + AI 해석 문구만 개인화
  app.post("/api/ai/recommend-art", async (req, res) => {
    try {
      const { buildDailyArtRecommendation } = await import("./server/api-lib/recommendArt");
      const result = await buildDailyArtRecommendation(req.body || {});
      return res.status(200).json(result);
    } catch (err: unknown) {
      console.error("[recommend-art] error:", err);
      const { buildVerifiedArtRecommendation } = await import("./server/api-lib/museArtCatalog");
      const dateKey = String(req.body?.dateKey || new Date().toLocaleDateString("sv"));
      return res.status(200).json(
        buildVerifiedArtRecommendation(
          dateKey,
          String(req.body?.currentMood || ""),
          req.body?.moodId,
          req.body?.randomOffset,
          req.body?.excludeCatalogIds,
        ),
      );
    }
  });

  function cleanDailyTarotDiagnosis(rawText: string): string {
    if (!rawText) return "";
    let text = rawText.trim();

    // 1. 전체 리딩 2회 반복 (중복 생성) 감지 및 단일화
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

    // 2. 정확한 2등분 반복 제거 (A + A)
    const halfLen = Math.floor(text.length / 2);
    if (halfLen > 120) {
      const firstHalf = text.slice(0, halfLen).trim();
      const secondHalf = text.slice(halfLen).trim();
      if (firstHalf === secondHalf || secondHalf.startsWith(firstHalf.slice(0, 100))) {
        text = firstHalf;
      }
    }

    // 3. 본문 1단계 이후 나타나는 후행 핵심 3줄 요약 블록 절단 (상단 요약 외 하단 중복 방지)
    const firstSectionIdx = text.search(/(?:\r?\n|^)\s*###\s*(?:[✨👑💎🌟⚡🏆💰🌅💌☯️🛤️🕯️☀️🧭]\s*)?1[\.\s]/);
    if (firstSectionIdx !== -1) {
      const bodyPart = text.slice(firstSectionIdx);
      const trailingSummaryIdx = bodyPart.search(/(?:\r?\n|^)\s*(?:[-*•·\d.]+\s*)?(?:#{1,6}\s*)?(?:\*{1,2}|_{1,2})?\s*(?:[✨🌟🔮📌💡📋💎⚡🌿🎯■]\s*)*\s*(?:[\[【(])?\s*(?:[✨🌟🔮📌💡📋💎⚡🌿🎯■]\s*)*\s*(?:핵심\s*(?:3줄|세줄|3대)?\s*요약|3줄\s*요약|세줄\s*요약|핵심\s*요약|오늘의\s*요약|Quick\s*Summary)[^\]】)\r\n]*(?:[\]】)])?\s*(?:\*{1,2}|_{1,2})?\s*(?:[:—\-–~]|—[^\r\n]*)?(?:\r?\n|$)/i);
      if (trailingSummaryIdx !== -1) {
        text = text.slice(0, firstSectionIdx + trailingSummaryIdx).trim();
      }
    }

    // 4. 5단계(영혼의 한마디) 이후 잔여 요약 불릿 제거
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

  // Daily Tarot Oracle Handler
  app.post("/api/ai/daily-tarot", async (req, res) => {
    const { card, mode = "oracle", comfortLevel = 3, profile, touchMetadata } = req.body || {};
    if (!card) {
      return res.status(400).json({ error: "카드 정보가 필요합니다." });
    }

    const cardNameKo = card.nameKo || card.name || "운명의 카드";
    const cardNameEn = card.name || "";
    const cardType = card.type === "major" ? "메이저 아르카나" : `${String(card.type || "minor").toUpperCase()} 수트 (마이너 아르카나)`;
    const cardKeywords = (card.keywords || []).join(", ") || "직관, 통찰, 조화";
    const isReversed = !!card.reversed;
    const orientation = isReversed ? "역방향 (Reversed)" : "정방향 (Upright)";

    let userContextBlock = "";
    if (profile?.basic) {
      const b = profile.basic;
      userContextBlock = `\n\n[질문자 프로필 & 사주 배경지식]:\n- 닉네임/호칭: ${b.nickname || b.name || "질문자"} (※ 실명보다 친근한 닉네임을 최우선으로 다정하게 불러주세요)\n- 생년월일: ${b.birthdate || "미입력"} (${b.lunarSolar || "양력"})\n- 생시: ${b.birthtime || "미입력"}\n- 성별: ${b.gender || "미입력"}${profile.fate?.currentWorry ? `\n- 최근 주요 고민: ${profile.fate.currentWorry}` : ""}${profile.fate?.lifeGoal ? `\n- 인생 핵심 목표: ${profile.fate.lifeGoal}` : ""}\n[배경지식 반영 필수 원칙]: 위 질문자의 기본 프로필(닉네임 호칭 우선)과 운명적 배경을 카드의 ${orientation} 상징 및 일일 비전과 깊이 있게 연계하여 서술하세요.`;
    }

    const touchWaveBlock = touchMetadata
      ? `\n\n[손끝 터치 물리 파동 (실측치)]:
- 체류 시간: ${touchMetadata.durationMs}ms
- 손끝 미세 떨림/망설임 지수: ${touchMetadata.jitterScore}
- 파동 깊이 모드: ${touchMetadata.depthMode}
- 리딩 톤 지침: ${touchMetadata.promptTone}
-> **반영 지침**: diagnosis의 첫 시작 문장에 질문자의 손끝 체류 파동(${touchMetadata.durationMs}ms)과 집중/망설임 상태를 영험하고 다정하게 짚어주세요.`
      : '';

    const { apiKey } = getAIConfig();
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `당신은 질문자의 하루를 꿰뚫어보고, 따뜻한 공감과 날카로운 직관으로 운명의 길을 밝혀주는 신비롭고 영험한 전문 타로 마스터 '트리니티'입니다.
실제 1:1 타로 상담실에서 촛불을 켜고 내담자의 눈을 마주 보며 카드를 한 장씩 넘겨 리딩해 주듯, 살아 숨 쉬는 생생한 대화형 어조(정중하고 기품 있는 해요체·하십시오체)로 깊은 울림을 선사하십시오.

[상담 개요]
- 내담자: 오늘의 타로 데일리 리딩
- 펼쳐진 카드: [${cardNameKo} (${cardNameEn})] [${cardType}, ${orientation}, 핵심 키워드: ${cardKeywords}]${userContextBlock}

[🚫 절대 금지 규칙 — 우주물리학 비유 및 기계적 수치 언급 전면 금지]
- '화이트홀', '블랙홀', '웜홀', '사건의 지평선' 등 공상과학/우주물리학 비유나 비현실적인 용어는 일체 사용하지 마십시오.
- '손끝 물리량', '터치 체류 시간', '떨림 지수', '파동 측정' 등 인위적인 감지 지표나 수치를 결코 언급하지 마십시오.
- 오직 78장 타로 카드의 상징과 원형, 그리고 내담자의 삶과 마음에만 온전히 집중하여 진정성 있게 리딩하십시오.

[🚫 내용 중복 및 반복 서술 엄격 금지]
- 동일한 문장, 동일한 조언, 동일한 표현을 리딩 내에서 절대로 2번 이상 중복하여 서술하지 마십시오.
- 각 단계(1단계~5단계)는 고유한 통찰과 관점을 담아야 하며, 앞서 언급한 카드의 해석이나 키워드를 다른 단계에서 그대로 복사하듯 반복 나열하지 마십시오.

[🔮 타로 마스터 리딩 원칙 — 보고서형 어투 절대 금지]
1. **생생한 상담실 대화체**: 딱딱한 기획서·보고서·수치 나열형은 절대 지양하십시오. 대신 "카드를 가만히 마주하니...", "오늘 가장 먼저 마음에 와닿는 기운은...", "이 카드가 당신께 이렇게 속삭이고 있네요"처럼 실제 타로 마스터의 생동감 넘치는 호흡으로 이야기하듯 서술하십시오.
2. **깊은 공감과 명쾌한 방향성의 조화**: 내담자가 오늘 겪을 감정과 상황을 따뜻하게 안아주되, 카드가 경고하는 현실적 맹점이나 피해야 할 악수는 숨김없이 명쾌하고 솔직하게 짚어주십시오.
3. **명확하고 흔들림 없는 결론**: 애매하게 얼버무리거나 "상황에 따라 다릅니다" 같은 회피는 금지합니다. 카드의 기운이 가리키는 방향을 마스터의 확신 있는 어조로 단호하게 선언하십시오.

[✨ 리딩 구성 형식 — 반드시 아래 순서대로 감동적이고 흡입력 있게 전개하세요]

[✨ 핵심 3줄 요약 — 리딩 결과의 최상단에 반드시 아래 형식으로 3줄 요약을 가장 먼저 작성하십시오]
[핵심 3줄 요약]
- [현재 에너지] (1. 카드가 비추는 당신의 마음과 현재 에너지 섹션의 제목에 맞춘 핵심 1문장 요약)
- [방향과 결단] (3. 트리니티 마스터의 직관적 결단 & 방향성 섹션의 제목에 맞춘 최종 판정 핵심 1문장 요약)
- [실천 처방] (4. 운의 흐름을 바꿀 마스터의 실천 처방 섹션의 제목에 맞춘 구체적 행동 조언 핵심 1문장 요약)

[★ 중복 생성 절대 금지 — 본문 및 하단 중복 기입 전면 배제]
- [핵심 3줄 요약] 블록은 오직 리딩 결과의 최상단에 단 1회만 출력해야 합니다.
- 요약 블록 출력 후에는 해당 요약 내용을 중복 기입하지 마십시오.
- 이어지는 본문 단계(1단계~5단계) 내부나 리딩 맨 마지막(끝부분)에 [핵심 3줄 요약] 또는 요약 블록을 절대로 다시 작성하거나 중복 기입해서는 안 됩니다. 본문 마지막에는 어떠한 형태의 요약 블록도 절대 기재하지 마십시오.

[✨ 본문 심층 리딩 — 최상단 3줄 요약 출력 완료 후, 아래 5단계 마크다운 구조로 순서대로 전개하세요]

### 🕯️ 1. 카드가 비추는 당신의 마음과 현재 에너지
- 오늘 하루를 마주했을 때 전해져 오는 내면의 파동과 무의식의 흐름, 현재 상황의 숨은 진실을 마스터의 깊은 직관으로 짚어주며 깊은 공감대를 형성하십시오.

### 🎴 2. 펼쳐진 카드들이 들려주는 이야기
- 오늘 모습을 드러낸 [${cardNameKo}] 카드의 ${orientation} 상징 그림과 4대 원소(${cardType})의 의미를 생생하게 해독하십시오. 카드 속 상징이 내담자의 실제 오늘 하루 일상, 활동, 대인관계에서 어떤 사건과 감정으로 나타나는지 생생하게 풀어내십시오.

### 🔮 3. 트리니티 마스터의 직관적 결단 & 방향성
- 오늘 하루에 대해 카드가 내린 최종 판정을 명확히 짚어주십시오.
- **[확실한 추진 / 신중한 내실 다지기 / 과감한 결단 / 유연한 관조]** 중 굵은 글씨로 선언하고, 왜 이 방향으로 나아가야 하는지 그 필연적 이유를 확신에 찬 목소리로 들려주십시오.

### 🌿 4. 운의 흐름을 바꿀 마스터의 실천 처방 (개운 가이드)
- 내담자가 오늘 당장 행운을 끌어당기고 액운을 피할 수 있는 현실적이고 구체적인 행동 처방(마음가짐, 소통 방식, 피해야 할 행동, 행운의 행동 등)을 다정하면서도 명확하게 짚어주십시오.

### ✨ 5. 당신의 길을 축복하는 영혼의 한마디
- "카드는 정해진 운명을 가두는 틀이 아니라..." 등 기존에 반복되던 진부한 클리셰 문장은 절대 작성하지 마십시오.
- 오직 오늘 뽑힌 [${cardNameKo}] 카드의 고유한 도상 상징과 원형, 그리고 내담자의 오늘 하루에 꼭 맞는 세상에 단 하나뿐인 시적이고 감동적인 영혼의 축복 문장을 마스터의 서명처럼 건네며 마무리하십시오.

[⚠️ 필수 완결성 및 요약 중복 배제 원칙]
- 중간에 서술을 멈추거나 생략하지 마십시오.
- 본문 마지막(5단계 이후)에 [핵심 3줄 요약]이나 어떠한 형태의 요약 블록도 절대로 다시 작성하지 마십시오.
- 최상단 [핵심 3줄 요약]부터 1단계~5단계 마지막 축복까지 한 문장도 끊김 없이 끝까지 완결된 형태로 작성하여 주십시오.`;

        const config = {
          systemInstruction,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              diagnosis: { type: "STRING" },
              luckyNumber: { type: "STRING" },
              luckyColor: { type: "STRING" },
              remedy: { type: "STRING" },
              symbol: { type: "STRING" },
              frequency: { type: "STRING" },
              spiritualEnergy: { type: "STRING" },
              blessingMessage: { type: "STRING" },
              focusPlaylist: { type: "STRING" }
            },
            required: ["diagnosis", "luckyNumber", "luckyColor", "remedy", "symbol", "frequency"]
          }
        };

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Tarot Gemini Timeout")), 35000)
        );

        const aiPromise = callGeminiContentWithFallback(
          ai,
          [{ role: "user", parts: [{ text: `오늘 뽑은 [${cardNameKo}] 카드의 오라클 비전을 리포트해 줘.` }] }],
          config
        );

        const { response } = (await Promise.race([aiPromise, timeoutPromise])) as any;
        const parsed = JSON.parse(response.text);
        if (parsed?.diagnosis) {
          parsed.diagnosis = cleanDailyTarotDiagnosis(parsed.diagnosis);
          return res.status(200).json(parsed);
        }
      } catch (err) {
        console.warn("[daily-tarot] Gemini call failed/timed out, using specialized card engine:", err);
      }
    }

    const fallback = buildSpecificTarotDailyOracle(card, mode);
    return res.status(200).json(fallback);
  });

  // Daily Sedona Method Release Handler
  app.post("/api/ai/daily-sedona", async (req, res) => {
    const { card, theme, profile } = req.body || {};
    if (!card) {
      return res.status(400).json({ error: "카드 정보가 필요합니다." });
    }

    const cardNameKo = card.nameKo || card.name || "방하착 카드";
    const cardNameEn = card.name || "";
    const cardKeywords = (card.keywords || []).join(", ") || "허용, 방하착, 평온";
    const cardDesc = card.desc || "무의식의 억압을 풀고 참나의 평온을 회복합니다.";
    const activeTheme = theme || "일상 감정 방하착";

    let userContextBlock = "";
    if (profile?.basic) {
      const b = profile.basic;
      userContextBlock = `\n\n[치유 대상자 프로필 배경지식]:\n- 닉네임/호칭: ${b.nickname || b.name || "수련자"} (※ 실명보다 친근한 닉네임을 최우선으로 다정하게 불러주세요)\n- 생년월일: ${b.birthdate || "미입력"} (${b.gender || "미입력"})${profile.psych?.currentSymptoms ? `\n- 현재 호소 증상: ${profile.psych.currentSymptoms}` : ""}${profile.fate?.currentWorry ? `\n- 내면 고민: ${profile.fate.currentWorry}` : ""}\n[배경지식 반영 필수]: 대상자의 호소 증상 및 프로필(닉네임 호칭 우선)을 [${cardNameKo}] 카드의 방하착 테마와 자연스럽게 융합하여 서술하세요.`;
    }

    const { apiKey } = getAIConfig();
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `당신은 세도나 메서드(Sedona Method)와 데이비드 호킨스의 '놓아버림(Letting Go)' 치유 마스터 'AURA 지요'입니다.
오늘 질문자가 뽑은 치유 카드는 **[${cardNameKo} (${cardNameEn})]** [테마: ${cardDesc}, 핵심 키워드: ${cardKeywords}, 방하착 테마: ${activeTheme}]입니다.${userContextBlock}

[반드시 준수할 100% 카드 중심 리포트 원칙]:
1. 모든 진단, 저항 분석, 세도나 질문, 확언, 행동 지침은 오직 질문자가 뽑은 [${cardNameKo}] 카드의 고유한 감정 테마("${cardDesc}")와 키워드("${cardKeywords}")에 100% 밀착되어야 합니다. 카드와 무관한 일반론으로 흐르지 마세요.
2. diagnosis 작성 구조:
   ### 🌿 [${cardNameKo}] 카드의 에고 정화 테마와 의식 정렬
   ([${cardNameKo}] 카드의 고유 파동과 정화 테마 해설)
   ### ⛓️ [${cardNameKo}] 카드가 비추는 에고의 억압 감정과 저항 패턴
   ([${cardNameKo}]의 키워드인 '${cardKeywords}'와 결핍 갈망(통제/인정/안전/분리)이 어떻게 억압 전압을 일으키는지 심층 분석)
   ### 🌊 [${cardNameKo}] 맞춤 세도나 4단계 방하착 (Sedona 4-Step Releasing)
   1. **허용하기 (Could I allow it?)**: 지금 가슴에 일어나는 [${cardNameKo}]의 감정(${cardKeywords})과 에고의 저항을 있는 그대로 허용할 수 있습니까? 👉 *“네, 어떠한 판단이나 억압 없이 온전히 허용합니다.”*
   2. **흘려보내기 (Could I let it go?)**: 이 쥐고 있던 생각과 통제 욕구를 강물에 띄우듯 흘려보낼 수 있습니까? 👉 *“네, 힘을 빼고 자연스럽게 흘려보냅니다.”*
   3. **기꺼이 놓아버리기 (Would I let it go?)**: 내면의 절대적 자유와 영원한 평화를 위해 지금 기꺼이 놓아버리겠습니까? 👉 *“네, 망설임 없이 기꺼이 내려놓겠습니다.”*
   4. **지금 이 순간 (When?)**: 언제 놓아버리겠습니까? 👉 *“지금 이 순간 즉시 항복(Surrender)하고 놓아버립니다.”*
   ### 🕊️ [${cardNameKo}]의 에고 해방과 영혼의 항복 확언 (Hawkins Letting Go)
   ([${cardNameKo}] 카드의 테마를 담은 깊이 있는 영혼의 확언 2문장)
   ### 🧭 오늘의 방하착 실천 지침 (Daily Releasing Practice)
   ([${cardNameKo}] 카드를 마음에 품고 오늘 일상에서 실천할 구체적 행동 1~2문장)
3. remedy: [${cardNameKo}] 카드를 바탕으로 한 오늘 하루의 Releasing 실천 지침 1~2문장 요약
4. spiritualEnergy: [${cardNameKo}] 카드가 일깨우는 치유 파동 2문장
5. blessingMessage: [${cardNameKo}] 카드의 따뜻한 수호 축복 1문장
6. symbol, frequency, luckyColor, luckyNumber, focusPlaylist 포함`;

        const config = {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              diagnosis: { type: "STRING" },
              luckyNumber: { type: "STRING" },
              luckyColor: { type: "STRING" },
              remedy: { type: "STRING" },
              symbol: { type: "STRING" },
              frequency: { type: "STRING" },
              spiritualEnergy: { type: "STRING" },
              blessingMessage: { type: "STRING" },
              focusPlaylist: { type: "STRING" }
            },
            required: ["diagnosis", "luckyNumber", "luckyColor", "remedy", "symbol", "frequency"]
          }
        };

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Sedona Gemini Timeout")), 35000)
        );

        const aiPromise = callGeminiContentWithFallback(
          ai,
          [{ role: "user", parts: [{ text: `오늘 뽑은 [${cardNameKo}] 카드의 세도나 방하착 처방을 리포트해 줘.` }] }],
          config
        );

        const { response } = (await Promise.race([aiPromise, timeoutPromise])) as any;
        const parsed = JSON.parse(response.text);
        if (parsed?.diagnosis) {
          return res.status(200).json(parsed);
        }
      } catch (err) {
        console.warn("[daily-sedona] Gemini call failed/timed out, using specialized card engine:", err);
      }
    }

    const fallback = buildSpecificSedonaDailyOracle(card, activeTheme);
    return res.status(200).json(fallback);
  });

  // Bluebird Secret Blessing Echo Handler (Concise Healing Mantra)
  app.post("/api/ai/secret-blessing", async (req, res) => {
    const { content, moodTag, moodLabel } = req.body || {};
    const text = String(content || "").trim();

    if (!text) {
      return res.status(400).json({ error: "쪽지 내용이 비어 있습니다." });
    }

    const { apiKey } = getAIConfig();
    const systemInstruction = `당신은 사용자의 비밀 쪽지(마음의 기록)를 읽고, 그 사연에 꼭 맞춘 가장 따뜻하고 정갈한 '1줄 치유 문구(Comfort Mantra)'를 전하는 파랑새입니다.

[필수 규칙]:
1. 사족이나 장황한 서론/설명, 일반론적인 안부 인사는 절대 금지합니다.
2. 사용자가 적은 쪽지의 핵심 상황(직장, 관계, 사랑, 불안, 피로, 자책 등)에 정확하게 공명하는 오직 '1~2문장의 핵심 치유 문구'만 생성하세요.
3. 어조: 다정하고 평온한 울림을 주는 한국어 구어체.
4. JSON 형식: {"comfortMantra": "사용자 사연에 꼭 맞춘 1~2문장의 따뜻한 치유 문구"}`;

    const prompt = `[비밀 테마]: ${moodLabel || moodTag || "마음의 기록"}
[사용자가 보낸 쪽지 내용]:
"${text}"

위 쪽지 내용의 핵심 감정과 사연을 깊이 어루만지는 1~2문장의 핵심 치유 문구(comfortMantra)만 JSON으로 보내주세요.`;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const config = {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              comfortMantra: { type: "STRING" }
            },
            required: ["comfortMantra"]
          }
        };
        const contents = [{ role: "user", parts: [{ text: prompt }] }];
        const { response } = await callGeminiContentWithFallback(ai, contents, config);
        const parsed = JSON.parse(response.text);
        if (parsed?.comfortMantra) {
          return res.status(200).json({
            comfortMantra: parsed.comfortMantra.replace(/^["'“”‘’]+|["'“”‘’]+$/g, '').trim()
          });
        }
      } catch (geminiErr) {
        console.warn("[secret-blessing] Gemini call failed, falling back to smart contextual generator:", geminiErr);
      }
    }

    // Contextual fallback helper
    const getTailoredComfortMantra = (txt: string): string => {
      const lower = txt.toLowerCase();
      if (lower.includes('회사') || lower.includes('직장') || lower.includes('일') || lower.includes('야근') || lower.includes('업무') || lower.includes('상사') || lower.includes('퇴사') || lower.includes('이직') || lower.includes('동료')) {
        return '일터의 무거운 책임감을 잠시 내려놓고, 오늘 밤은 오직 당신만을 위한 따뜻한 쉼을 누리세요.';
      }
      if (lower.includes('친구') || lower.includes('사람') || lower.includes('인간관계') || lower.includes('상처') || lower.includes('서운') || lower.includes('배신') || lower.includes('싸움') || lower.includes('오해') || lower.includes('눈치')) {
        return '내 마음의 평화가 가장 소중합니다. 타인의 시선에 휘둘리지 않고 당신만의 맑은 온기를 지키세요.';
      }
      if (lower.includes('사랑') || lower.includes('연애') || lower.includes('이별') || lower.includes('그리움') || lower.includes('보고싶') || lower.includes('짝사랑') || lower.includes('남자친구') || lower.includes('여자친구') || lower.includes('헤어') || lower.includes('마음')) {
        return '누군가를 진심으로 아끼고 사랑했던 당신의 순수한 온기는 그 자체로 눈부시게 아름답습니다.';
      }
      if (lower.includes('불안') || lower.includes('걱정') || lower.includes('두려') || lower.includes('미래') || lower.includes('시험') || lower.includes('취업') || lower.includes('면접') || lower.includes('돈') || lower.includes('재정') || lower.includes('합격') || lower.includes('준비')) {
        return '조급해하지 않아도 괜찮아요. 모든 순리는 가장 알맞고 아름다운 때에 당신 편이 되어줍니다.';
      }
      if (lower.includes('외로') || lower.includes('혼자') || lower.includes('쓸쓸') || lower.includes('우울') || lower.includes('눈물') || lower.includes('지침') || lower.includes('피곤') || lower.includes('힘들') || lower.includes('지쳐') || lower.includes('버겁')) {
        return '숨을 깊게 들이쉬고 내쉬어 보세요. 무거운 짐을 견뎌온 당신이라는 존재 자체로 이미 귀하고 충분합니다.';
      }
      if (lower.includes('감사') || lower.includes('행복') || lower.includes('고마') || lower.includes('희망') || lower.includes('소망') || lower.includes('축복') || lower.includes('기쁨') || lower.includes('좋아')) {
        return '세상에 띄워 보낸 당신의 다정한 감사의 파동은 머지않아 더 커다란 행운과 평온으로 되돌아옵니다.';
      }
      return '흘러간 것은 흘러간 대로 두고, 지금 이 순간의 나를 온전히 안아줍니다.';
    };

    return res.status(200).json({
      comfortMantra: getTailoredComfortMantra(text)
    });
  });

  // Bluebird Secret Note Emotion Tag Auto-Recommendation Handler
  app.post("/api/ai/secret-mood-recommend", async (req, res) => {
    const { content } = req.body || {};
    const text = String(content || "").trim();

    if (!text) {
      return res.status(400).json({ error: "쪽지 내용이 비어 있습니다." });
    }

    const availableTags = [
      { id: "confession", label: "밤의 고백", emoji: "🌙", desc: "누구에게도 말하지 못한 은밀한 진실이나 짝사랑, 속마음 고백" },
      { id: "release", label: "놓아주는 마음", emoji: "🕊️", desc: "미련, 집착, 지나간 과거를 훌훌 털어내고 비워내는 마음" },
      { id: "tears", label: "남모를 눈물", emoji: "💧", desc: "서러움, 슬픔, 외로움, 남모르게 흘린 눈물과 상처" },
      { id: "wish", label: "숨겨둔 소망", emoji: "✨", desc: "간절한 소원, 꿈, 미래에 대한 희망과 바람" },
      { id: "letter", label: "파랑새에게 부치는 편지", emoji: "✉️", desc: "파랑새를 부르며 대화하듯 전하는 온기 어린 편지" },
      { id: "gratitude", label: "비밀 감사", emoji: "🤍", desc: "숨겨둔 고마움, 은혜, 따뜻한 감사와 축복" },
    ];

    const { apiKey } = getAIConfig();
    const systemInstruction = `당신은 사용자의 비밀 쪽지 글을 읽고 가장 깊이 공명하는 감정 태그를 추천하는 파랑새 감정 분석 엔진입니다.
선택 가능한 태그 ID: ["confession", "release", "tears", "wish", "letter", "gratitude"]
반드시 위의 6가지 ID 중 가장 적합한 1개를 선택하고, 1문장의 따뜻한 추천 이유를 반환하세요.`;

    const prompt = `[사용자의 비밀 쪽지]:
"${text}"

가장 적합한 moodTag ID와 추천 이유(reason)를 JSON으로 보내주세요.`;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const config = {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              moodTag: { type: "STRING", enum: ["confession", "release", "tears", "wish", "letter", "gratitude"] },
              reason: { type: "STRING" }
            },
            required: ["moodTag", "reason"]
          }
        };
        const contents = [{ role: "user", parts: [{ text: prompt }] }];
        const { response } = await callGeminiContentWithFallback(ai, contents, config);
        const parsed = JSON.parse(response.text);
        const matched = availableTags.find(t => t.id === parsed.moodTag) || availableTags[0];
        return res.status(200).json({
          moodTag: matched.id,
          moodLabel: matched.label,
          emoji: matched.emoji,
          reason: parsed.reason || `${matched.label} 테마에 어울리는 쪽지입니다.`
        });
      } catch (geminiErr) {
        console.warn("[secret-mood-recommend] Gemini call failed, falling back to heuristic engine:", geminiErr);
      }
    }

    // Heuristic mood tag recommendation fallback
    const lower = text.toLowerCase();
    let bestTag = availableTags[0];
    let reason = "진솔한 마음을 담은 고백입니다.";

    if (lower.includes('눈물') || lower.includes('울') || lower.includes('슬프') || lower.includes('아프') || lower.includes('상처') || lower.includes('서운') || lower.includes('외로') || lower.includes('쓸쓸') || lower.includes('우울') || lower.includes('지쳐') || lower.includes('힘들') || lower.includes('괴로')) {
      bestTag = availableTags[2]; // tears
      reason = "남모르게 홀로 삼켜온 슬픔과 눈물의 온기가 느껴집니다.";
    } else if (lower.includes('놓아') || lower.includes('비우') || lower.includes('잊어') || lower.includes('미련') || lower.includes('집착') || lower.includes('훌훌') || lower.includes('털어') || lower.includes('그만') || lower.includes('용서') || lower.includes('정리')) {
      bestTag = availableTags[1]; // release
      reason = "무거운 짐을 내려놓고 마음을 비워내려는 용기가 돋보입니다.";
    } else if (lower.includes('소원') || lower.includes('소망') || lower.includes('바래') || lower.includes('바라') || lower.includes('꿈') || lower.includes('희망') || lower.includes('이루') || lower.includes('꼭') || lower.includes('기��') || lower.includes('행복해')) {
      bestTag = availableTags[3]; // wish
      reason = "가슴 깊이 간직한 빛나는 소망과 바람이 담겨 있습니다.";
    } else if (lower.includes('감사') || lower.includes('고마') || lower.includes('은혜') || lower.includes('덕분') || lower.includes('축복') || lower.includes('따뜻')) {
      bestTag = availableTags[5]; // gratitude
      reason = "세상을 밝히는 순수한 감사의 파동이 느껴집니다.";
    } else if (lower.includes('파랑새') || lower.includes('편지') || lower.includes('너에게') || lower.includes('들어줘') || lower.includes('전해줘') || lower.includes('답장')) {
      bestTag = availableTags[4]; // letter
      reason = "파랑새에게 다정하게 띄워 보내는 마음의 편지입니다.";
    }

    return res.status(200).json({
      moodTag: bestTag.id,
      moodLabel: bestTag.label,
      emoji: bestTag.emoji,
      reason
    });
  });

  // Bluebird Secret Note Fast Blessing Generation Endpoint
  app.post("/api/ai/secret-blessing", async (req, res) => {
    const { content, moodTag, userName } = req.body || {};
    const text = String(content || "").trim();
    const tag = String(moodTag || "confession").trim();
    const name = String(userName || "제제").trim();

    if (!text) {
      return res.status(400).json({ error: "쪽지 내용이 비어 있습니다." });
    }

    const { apiKey } = getAIConfig();
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `당신은 사용자의 지친 마음과 비밀을 다정하게 품어주는 치유의 영적 수호자 '파랑새(BLUEBIRD)'입니다.
사용자가 작성한 비밀 쪽지 내용을 진심 어린 마음으로 읽고, 사용자가 처한 구체적인 감정과 상황을 직접 언급하며 깊은 공감과 위로를 건네는 2~3문장의 따뜻한 구어체 답장(comfortMantra)을 작성하세요.
절대 뻔하거나 상투적인 조언을 하지 말고, 사용자가 털어놓은 구체적 사연, 감정, 인물, 고민을 따스하게 감싸 안아주세요.
반드시 모든 자연어 출력은 현대 한국어 한글로만 작성하고 JSON 형태로 응답하세요.`;

        const prompt = `[사용자 닉네임]: ${name}\n[감정 테마]: ${tag}\n[사용자가 작성한 비밀 쪽지]:\n"${text}"\n\n이 마음에 진심으로 공감하고 따뜻한 힘이 되어주는 파랑새의 위로 답장(comfortMantra)을 JSON으로 보내주세요.`;

        const config = {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              comfortMantra: { type: "STRING" }
            },
            required: ["comfortMantra"]
          },
          maxOutputTokens: 512,
        };

        const contents = [{ role: "user", parts: [{ text: prompt }] }];
        // Fast direct Gemini with prioritized fast model & 3.5s timeout race
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Fast AI Timeout")), 3500)
        );
        const { response } = await Promise.race([
          callGeminiContentWithFallback(ai, contents, config, "gemini-3.1-flash-lite"),
          timeoutPromise
        ]);
        const parsed = JSON.parse(response.text);
        if (parsed?.comfortMantra) {
          return res.status(200).json({
            comfortMantra: parsed.comfortMantra.replace(/^['“”‘’]+|['“”‘’]+$/g, '').trim()
          });
        }
      } catch (geminiErr) {
        console.warn("[secret-blessing] Fast Gemini call failed or timed out, falling back to heuristic engine:", geminiErr);
      }
    }

    // Heuristic fallback matching keywords and user's context
    const lower = text.toLowerCase();
    let echo = `${name} 님, 흘러간 것은 흘러간 대로 두고, 지금 이 순간의 나를 온전히 안아줍니다.`;

    if (lower.includes('회사') || lower.includes('직장') || lower.includes('일') || lower.includes('야근') || lower.includes('업무') || lower.includes('상사') || lower.includes('퇴사') || lower.includes('이직') || lower.includes('동료')) {
      echo = `${name} 님, 일터의 무거운 책임감을 잠시 내려놓고, 오늘 밤은 오직 당신만을 위한 따뜻하고 포근한 쉼을 누리세요.`;
    } else if (lower.includes('친구') || lower.includes('사람') || lower.includes('인간관계') || lower.includes('상처') || lower.includes('서운') || lower.includes('배신') || lower.includes('싸움') || lower.includes('오해') || lower.includes('눈치')) {
      echo = `${name} 님의 마음의 평화가 가장 소중합니다. 타인의 시선에 휘둘리지 않고 당신만의 맑은 온기를 지키세요.`;
    } else if (lower.includes('사랑') || lower.includes('연애') || lower.includes('이별') || lower.includes('그리움') || lower.includes('보고싶') || lower.includes('짝사랑') || lower.includes('남자친구') || lower.includes('여자친구') || lower.includes('헤어') || lower.includes('마음')) {
      echo = `누군가를 진심으로 아끼고 사랑했던 ${name} 님의 순수한 온기는 그 자체로 눈부시게 아름답습니다.`;
    } else if (lower.includes('불안') || lower.includes('걱정') || lower.includes('두려') || lower.includes('미래') || lower.includes('시험') || lower.includes('취업') || lower.includes('면접') || lower.includes('돈') || lower.includes('재정') || lower.includes('합격') || lower.includes('준비')) {
      echo = `조급해하지 않아도 괜찮아요, ${name} 님. 모든 순리는 가장 알맞고 아름다운 때에 당신 편이 되어줍니다.`;
    } else if (lower.includes('외로') || lower.includes('혼자') || lower.includes('쓸쓸') || lower.includes('우울') || lower.includes('눈물') || lower.includes('지침') || lower.includes('피곤') || lower.includes('힘들') || lower.includes('지쳐') || lower.includes('버겁')) {
      echo = `숨을 깊게 들이쉬고 내쉬어 보세요. 무거운 짐을 견뎌온 ${name} 님이라는 존재 자체로 이미 귀하고 충분합니다.`;
    } else if (lower.includes('감사') || lower.includes('행복') || lower.includes('고마') || lower.includes('희망') || lower.includes('소망') || lower.includes('축복') || lower.includes('기쁨') || lower.includes('좋아')) {
      echo = `세상에 띄워 보낸 ${name} 님의 다정한 감사의 파동은 머지않아 더 커다란 행운과 평온으로 되돌아옵니다.`;
    }

    return res.status(200).json({
      comfortMantra: echo
    });
  });

  // TTS - 고품질 Edge Neural TTS + Google TTS 다중 엔진 통합 엔드포인트
  app.post("/api/ai/tts", async (req, res) => {
    const { text, voice = 'Kore', emotion, rate, speed, pitch, language } = req.body || {};

    try {
      const { handleTTS } = await import('./server/api-lib/ttsHandler');
      const result = await handleTTS({ text, voice, emotion, rate, speed, pitch, language });
      return res.status(200).json(result);
    } catch (error: any) {
      console.error("TTS generation error:", error);
      return res.status(500).json({ error: error?.message || "TTS generation failed" });
    }
  });

  // 🔌 MCP (Model Context Protocol) Endpoints (Spark, Claude, Cursor 등 외부 커스텀 앱 연동)
  app.get(["/api/mcp/sse", "/api/mcp", "/sse", "/mcp/sse", "/mcp"], async (req, res) => {
    const { handleMCPSseStream } = await import("./server/api-lib/mcpHandler");
    return handleMCPSseStream(req, res);
  });

  app.post(["/api/mcp/messages", "/messages", "/mcp/messages"], async (req, res) => {
    const { handleMCPPostMessage } = await import("./server/api-lib/mcpHandler");
    return handleMCPPostMessage(req, res);
  });

  app.post(["/api/mcp", "/mcp", "/sse", "/api/mcp/sse", "/mcp/sse"], async (req, res) => {
    const { handleMCPDirectPost } = await import("./server/api-lib/mcpHandler");
    return handleMCPDirectPost(req, res);
  });

  // Support root URL (https://luckey.ai.studio/) when accessed by an MCP client (SSE, JSON discovery, or direct JSON-RPC POST)
  app.get("/", async (req, res, next) => {
    const accept = req.headers.accept || "";
    if (accept.includes("text/event-stream") || accept.includes("application/json") || req.query.mcp !== undefined || req.query.format === "json") {
      const { handleMCPSseStream } = await import("./server/api-lib/mcpHandler");
      return handleMCPSseStream(req, res);
    }
    return next();
  });

  app.post("/", async (req, res, next) => {
    if (req.body?.jsonrpc === "2.0" || req.body?.method === "initialize" || req.is("application/json")) {
      const { handleMCPDirectPost } = await import("./server/api-lib/mcpHandler");
      return handleMCPDirectPost(req, res);
    }
    return next();
  });

  app.options(["*", "/", "/api/mcp", "/api/mcp/*", "/sse", "/mcp", "/mcp/*", "/messages"], (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    return res.status(200).end();
  });



  app.post("/api/openai/v1/chat/completions", async (req, res) => {
    const getFriendlyErrorMessage = (err: any): string => {
      if (!err) return "알 수 없는 시스템 오류가 발생했습니다.";
      
      let errStr = "";
      try {
        errStr = (String(err) + " " + (err.message || "") + " " + (typeof err === "object" ? JSON.stringify(err) : "")).toLowerCase();
      } catch (safeErr) {
        errStr = (String(err) + " " + (err.message || "")).toLowerCase();
      }
      
      const rawErrorDetail = err.message || String(err);
      
      let errorCategory = "";
      let actionSteps = "";
      
      if (
        errStr.includes("no gemini api key") ||
        errStr.includes("not configured") ||
        errStr.includes("account_state_invalid") ||
        errStr.includes("deleted or disabled") ||
        errStr.includes("unauthenticated") ||
        errStr.includes("401") ||
        errStr.includes("invalid_api_key")
      ) {
        errorCategory = "API 키 미설정 또는 만료 (Invalid / Expired API Key)";
        actionSteps = "1. AI Studio 우측 상단 Settings > Secrets 메뉴에서 GEMINI_API_KEY가 올바르게 등록되어 있는지 확인해 주세요.\n2. Google AI Studio(https://aistudio.google.com/)에서 새 무료 API 키를 발급받아 등록하시면 모든 AI 기능이 정상 작동합니다.";
      } else if (
        errStr.includes("prepayment") ||
        errStr.includes("depleted") ||
        errStr.includes("resource_exhausted") ||
        errStr.includes("quota") ||
        errStr.includes("429") ||
        errStr.includes("billing") ||
        errStr.includes("credits")
      ) {
        errorCategory = "API 호출 한도 / 쿼터 초과 (Rate Limit Exceeded)";
        actionSteps = "1. 일시적인 호출 한도에 도달했을 수 있습니다. 잠시 후 다시 시도해 주세요.\n2. 필요 시 Google AI Studio에서 API 쿼터 및 키 상태를 확인해 주세요.";
      } else if (errStr.includes("api key") || errStr.includes("api_key") || errStr.includes("key not valid") || errStr.includes("invalid key") || errStr.includes("forbidden") || errStr.includes("403")) {
        errorCategory = "유효하지 않은 API 키 (Invalid API Key)";
        actionSteps = "1. GEMINI_API_KEY 환경 변수에 공백이나 오탈자가 없는지 점검해 주세요.\n2. Google AI Studio에서 새로 발급받은 키를 다시 저장해 주세요.";
      } else {
        errorCategory = "네트워크 및 AI 엔진 일시적 장애 (Internal Engine Error)";
        actionSteps = "1. 일시적인 네트워크 지연일 수 있으니 잠시 후 다시 메시지를 보내주세요.\n2. 문제가 지속되면 페이지를 새로고침한 뒤 다시 시도해 주세요.";
      }
      
      return `[AI 서비스 안내]\n\n현재 일시적인 원인으로 인해 응답을 생성하지 못했습니다.\n\n▶ 상태: ${errorCategory}\n▶ 상세 내용: ${rawErrorDetail}\n\n▶ 조치 가이드:\n${actionSteps}`;
    };

    const buildSmartFallbackText = (messages: any[], errMessage: string, isJsonExpected: boolean): string => {
      const wholeStr = JSON.stringify(messages || "").toLowerCase();
      
      if (isJsonExpected || wholeStr.includes("json schema") || wholeStr.includes("json") || wholeStr.includes("schema")) {
        if (wholeStr.includes("globalsync") || wholeStr.includes("lucyguide") || wholeStr.includes("명언") || wholeStr.includes("global_sync")) {
          return JSON.stringify({
            summary: "진정한 발견의 여정은 새로운 풍경을 찾는 것이 아니라, 새로운 눈을 가지는 데 있다.",
            author: "마르셀 프루스트",
            lucyGuide: "오늘의 우주 리듬에 귀 기울여 보세요.",
            museGuide: "작은 영감 하나로 창작의 문을 열 수 있습니다.",
            orangeGuide: "아이디어를 가볍게 적어보면 흐름이 살아납니다.",
            bluebirdGuide: "호흡을 고르게 하면 마음의 파동이 안정됩니다.",
            healGuide: "몸의 긴장을 내려놓는 것만으로도 회복이 시작됩니다.",
            prologueGuide: "오늘의 시작을 차분한 의식으로 맞이해 보세요.",
            epilogueGuide: "오늘의 경험을 한 줄로 남겨 보세요.",
            themeColor: "oklch(0.08 0.05 270)"
          });
        }

        if (wholeStr.includes("coherence") || wholeStr.includes("carrier") || wholeStr.includes("beat") || wholeStr.includes("bandtext")) {
          return JSON.stringify({
            title: "오라 공명 정렬",
            coherence: 85,
            bandText: "퀀텀 슈만 공명 조율 대역 (7.83Hz)",
            freqText: "자율신경계와 뇌파를 고요하게 정렬합니다.",
            shieldToken: "오라실드",
            prescription: "피로가 쌓였다면 무리하지 말고 몸과 마음에 고요한 쉼을 주세요.",
            advice: "어깨를 가볍게 펴고 깊은 호흡을 세 번 천천히 내쉬어 보세요.",
            carrier: 432,
            beat: 7.83,
            luckScore: 78,
            loveScore: 82,
            wealthScore: 76,
            healthScore: 84,
            deepSyncLevel: "안정",
            luckyItem: "따뜻한 차",
            luckyColor: "골드",
            cosmicAspect: "오늘은 작은 선택 하나가 하루 분위기를 바꿀 수 있어요.",
            guidance: "완벽한 답보다, 지금 편한 속도로 가면 돼요."
          });
        }

        if (wholeStr.includes("diagnosis") || wholeStr.includes("luckynumber") || wholeStr.includes("remedy") || wholeStr.includes("sedona") || wholeStr.includes("tarot") || wholeStr.includes("트리니티") || wholeStr.includes("오라클")) {
          // Extract card name if present
          let cardName = "우주의 오라클";
          const cardMatch = wholeStr.match(/\[([가-힣\s\w\(\)]+)\]/);
          if (cardMatch && cardMatch[1]) {
            cardName = cardMatch[1].trim();
          }

          const isSedona = wholeStr.includes("sedona") || wholeStr.includes("세도나") || wholeStr.includes("방하착") || wholeStr.includes("호킨스");

          if (isSedona) {
            return JSON.stringify({
              diagnosis: `### 🌿 [${cardName}] 카드의 에고 정화 테마와 의식 정렬\n오늘 당신의 무의식 정화 세션에 도출된 방하착 카드는 **[${cardName}]**입니다.\n현재 당신의 내면 깊은 곳에서 저항과 피로를 유발하던 무의식적 전압은 [${cardName}]의 청정한 주파수와 마주하며 부드럽게 녹아내리기 시작했습니다. 에고의 4대 결핍 갈망(통제/인정/안전/분리 욕구)을 자각하고 자연스러운 호흡과 함께 흘려보낼 때 진정한 내면의 평온이 회복됩니다.\n\n### 🌊 세도나 4단계 맞춤 방하착 (Releasing Process)\n1. **허용하기 (Could I allow it?)**: 지금 일어나는 [${cardName}] 카드의 감정과 묵직한 에고의 저항을 있는 그대로 허용할 수 있습니까? — *네, 온전히 허용합니다.*\n2. **흘려보내기 (Could I let it go?)**: 이 쥐고 있던 통제 욕구를 강물에 띄우듯 흘려보낼 수 있습니까? — *네, 자연스럽게 흘려보냅니다.*\n3. **기꺼이 놓아버리기 (Would I let it go?)**: 내면의 절대적 자유와 평화를 위해 지금 기꺼이 놓아버리겠습니까? — *네, 기꺼이 내려놓겠습니다.*\n4. **지금 이 순간 (When?)**: **지금 당장 (NOW)**, 가슴의 빗장을 열고 깊은 호흡과 함께 온전히 항복하십시오.\n\n### ✨ 에고 해방과 영혼의 항복 확언\n"나는 [${cardName}] 카드가 비추는 에고의 저항을 자각하며, 이 감정을 통제하려 했던 오랜 집착을 평화롭게 흘려보냅니다. 나는 이미 한없이 자유롭고 고요한 순수 의식입니다."`,
              luckyNumber: "7",
              luckyColor: "에메랄드 힐링 그린",
              remedy: `[${cardName}] 카드의 상징을 마음에 품고, 호흡을 내쉴 때마다 가슴 속 긴장을 10초간 온전히 흘려보내기`,
              symbol: `${cardName}의 정화 크리스탈`,
              frequency: "528Hz 솔페지오 사랑과 치유",
              spiritualEnergy: `[${cardName}] 카드의 치유 파동이 가슴 차크라와 공명하여 에고의 저항을 녹여내고 본연의 평온을 회복시킵니다.`,
              blessingMessage: `모든 집착이 스러진 고요한 자리에서 [${cardName}]의 청정한 빛이 당신의 하루를 온전히 축복합니다.`,
              focusPlaylist: "528Hz Cellular Healing & Release"
            });
          }

          return JSON.stringify({
            diagnosis: `### 🌟 [${cardName}] 카드의 고유한 상징과 비전\n오늘 당신의 의식 표면으로 드로우된 카드는 **[${cardName}]**입니다. 이 카드는 현재 질문자의 운명적 시점에 가장 필요한 우주적 메시지와 통찰의 파동을 전달하고 있습니다.\n\n### 🔮 오늘의 운명 흐름과 심층 파동\n오늘은 외부의 소음이나 타인의 시선에 휩쓸리지 않고, **[${cardName}]** 카드가 비추는 내면의 명료한 빛을 따라갈 때입니다. 당신의 에너지 파동은 맑고 조화로운 영점으로 수렴하고 있으며, 작은 직관 하나가 삶의 중요한 전환점을 만드는 열쇠가 될 것입니다.\n\n### ⚖️ 현실에서의 실천과 주의점 (Shadow & Light)\n지나친 걱정이나 불필요한 집착은 당신의 맑은 영적 파동을 흐릴 수 있습니다. **[${cardName}]** 카드는 당신이 이미 충분한 내면의 지혜와 분별력을 지니고 있음을 상기시켜 줍니다.\n\n### 🧭 오늘의 오라클 핵심 지침\n**[${cardName}]** 카드의 신성한 기운을 가슴에 품고, 오늘 하루 마주하는 모든 선택과 순간에 당신만의 정성과 평온을 담아보세요.`,
            luckyNumber: "7",
            luckyColor: "황금빛 골드 (Celestial Gold)",
            remedy: `[${cardName}] 카드의 상징을 마음에 그리며 따뜻한 차 한 잔과 함께 3분간 깊은 복식호흡 수행하기`,
            symbol: `${cardName}의 빛`,
            frequency: "528Hz",
            spiritualEnergy: `[${cardName}] 카드의 원소적 에너지가 당신의 내면 의식과 조화롭게 공명하여 깊은 통찰력과 정서적 안정감을 일깨웁니다.`,
            blessingMessage: `오늘 하루 당신이 딛는 모든 길 위에 [${cardName}] 카드의 신성한 보호와 빛나는 은총이 함께하기를 축복합니다.`,
            focusPlaylist: "528Hz Solfeggio Resonance"
          });
        }

        if (wholeStr.includes("themeid") || wholeStr.includes("apathy") || wholeStr.includes("brieftip") || wholeStr.includes("theme_id")) {
          return JSON.stringify({
            themeId: "grief",
            reason: "과거의 감정을 자연스럽게 흘려보내고 내면의 평온과 활력을 되찾기에 최적의 시간입니다.",
            briefTip: "가슴에 손을 얹고 세 번 천천히 깊은 호흡을 내쉬어 보세요."
          });
        }

        if (wholeStr.includes("affirmation") || wholeStr.includes("시크릿") || wholeStr.includes("dailysecret")) {
          let wishMatch = wholeStr.match(/소원:\s*"([^"]+)"/) || wholeStr.match(/소원\s*:\s*([^,\n\r]+)/);
          const wish = wishMatch ? wishMatch[1].trim() : "풍요와 내면의 평온";
          return JSON.stringify({
            affirmation: `나는 간절히 염원하던 "${wish}"의 성취를 이미 온전히 이루어냈으며, 온 우주의 축복 속에서 벅찬 감사와 풍요를 누립니다.`,
            reflection: `"${wish}"을(를) 마음에 품은 순간, 우주는 이미 그것을 완성하기 위해 일사불란하게 움직이기 시작했습니다. 모든 조급함을 내려놓고 이미 이루어진 평온을 느끼세요.`,
            action: `오늘 하루 "${wish}"을(를) 이미 이룬 사람의 여유로운 태도로 주변 사람들에게 환한 미소를 지어보세요.`,
            desire: `우주여, "${wish}"의 소망이 내 삶에 가장 눈부시고 아름답게 실현되었음에 깊이 감사합니다.`,
            visualizationGuide: `조용히 눈을 감고 "${wish}"이(가) 눈앞의 현실이 된 순간을 생생하게 그립니다. 벅차오르는 가슴과 안도의 숨결을 온몸으로 느껴보세요.`,
            gratitudeSeeds: [
              `"${wish}"의 기적이 내 삶에 이미 준비되어 있음에 감사합니다.`,
              "나를 바른길로 인도해 주는 우주의 지혜에 감사합니다.",
              "오늘 하루 만나는 모든 인연과 평화로운 순간에 감사합니다."
            ],
            feelingAnchor: `모든 걱정이 씻은 듯 사라지고 가슴 깊은 곳에서 차오르는 벅찬 안도감과 기쁨`,
            mirrorPhrase: `너는 "${wish}"의 축복을 누릴 자격이 충분한 위대한 존재다.`,
            eveningPrompt: `오늘 우주에 띄워 보낸 "${wish}"의 확신이 밤사이 찬란한 현실로 자라남을 믿습니다.`,
            scriptingStarter: `오늘 마침내 내 마음속 간절했던 "${wish}"의 기적이 현실로 펼쳐졌다.`
          });
        }

        if (wholeStr.includes("secret") || wholeStr.includes("actionprompt")) {
          return JSON.stringify({
            quote: "작은 일에 집중할 때 커다란 변화가 시작된다.",
            author: "오렌지 지혜",
            secretTip: "오늘 하루 작은 친절 하나를 베풀어 보세요.",
            actionPrompt: "따뜻한 미소로 인사 건네기"
          });
        }

        return JSON.stringify({
          summary: "오늘의 모든 에너지가 조화롭게 정렬됩니다.",
          author: "PRISM",
          message: "원하는 모든 소망이 우주의 섭리 안에서 기적처럼 현실로 이루어지고 있습니다."
        });
      }

      // Midnight Whisper / Epilogue blessing fallback
      if (wholeStr.includes("자정") || wholeStr.includes("midnight") || wholeStr.includes("whisper") || wholeStr.includes("속삭임") || wholeStr.includes("축복 성찰")) {
        return "오늘 하루도 온 힘을 다해 아름답게 빛나주신 당신께 깊은 감사를 전합니다. 마음에 머물렀던 피로와 작은 불안은 깊어가는 밤하늘의 고요 속으로 가볍게 내려놓고, 평온한 안식 속에서 편안한 잠을 청해 보세요. 내일은 더욱 따뜻하고 찬란한 우주의 축복이 당신을 기다릴 것입니다.";
      }

      // Saju / Myeongli consultation fallback
      if (wholeStr.includes("사주") || wholeStr.includes("명리") || wholeStr.includes("일간") || wholeStr.includes("오행") || wholeStr.includes("만세력")) {
        const userMsg = Array.isArray(messages) ? messages.find((m: any) => m.role === "user") : null;
        const userQ = typeof userMsg?.content === "string" ? userMsg.content.trim() : "";
        const lowerQ = userQ.toLowerCase();

        if (/(?:이직|퇴사|이동|바꾸|옮기|전직)/.test(lowerQ)) {
          return `질문해주신 "이직 및 진로 방향"에 대한 명리 통찰입니다.\n\n사주 원국의 일간 본원과 직업궁의 흐름을 볼 때, 단순한 도피성 이동보다는 자신의 전문성과 주도권을 한 단계 격상시킬 수 있는 방향으로 움직이시는 것이 크게 길합니다.\n\n서둘러 결론을 내리기보다는 차분히 자신의 핵심 역량을 재정비하며 타이밍을 조율할 때 뜻밖의 귀인 조력과 최적의 도약 기회를 맞이하게 됩니다.`;
        }
        if (/(?:시험|합격|공부|자격증|취업|승진|면접)/.test(lowerQ)) {
          return `질문해주신 "시험 및 합격 운"에 대한 명리 통찰입니다.\n\n내담자님의 사주 원국은 목표가 명확할 때 남다른 고도의 집중력과 끈기를 발휘하는 귀한 잠재력을 품고 있습니다. 원국의 중심 기운을 지렛대 삼고, 부족한 오행을 정돈된 학습 환경과 차분한 호흡으로 보완하시면 잡념이 걷히고 성취운이 한층 밝아집니다.\n\n자신만의 리듬을 신뢰하고 정진하신다면 원하시는 합격의 결실을 충분히 일궈낼 수 있습니다.`;
        }
        if (/(?:직업|적성|진로|업무|일|스타일|회사)/.test(lowerQ)) {
          return `질문해주신 "직업 적성 및 업무 스타일"에 대한 명리 통찰입니다.\n\n내담자님의 사주 본원은 정형화된 틀에 갇히기보다 자신의 자율성과 전문적인 통찰이 온전히 존중받는 환경에서 가장 눈부신 성과를 창출합니다.\n\n기획, 분석, 전문 연구, 창의적 프로젝트 분야에서 남다른 영향력을 발휘할 수 있으며, 일상에서 부족한 오행 기운을 편안한 휴식과 데스크 소품으로 채워주시면 업무 추진력이 배가됩니다.`;
        }
        if (/(?:재물|돈|금전|부자|부|자산|투자|주식|부동산|모으|소비|지출|재운|수익|코인)/.test(lowerQ)) {
          return `질문해주신 "재물운과 자산 증식"에 대한 명리 통찰입니다.\n\n내담자님의 사주 원국 상 재물 흐름은 요행이나 충동적인 단기 투자보다는, 자신만의 확실한 원칙과 주관을 바탕으로 차곡차곡 쌓아갈 때 가장 단단하고 흔들리지 않는 부(富)의 토대를 완성합니다.\n\n중심 기운의 과열로 인한 분산 지출을 경계하시고, 안정적인 장기 자산 위주로 자금을 운용하시면 재물의 누수를 막고 풍요로운 흐름을 견고히 지켜가실 수 있습니다.`;
        }
        if (/(?:연애|사랑|결혼|이성|궁합|애인|인연|남친|여친|배우자|호감|만남|재회)/.test(lowerQ)) {
          return `질문해주신 "연애와 인연의 기운"에 대한 명리 통찰입니다.\n\n내담자님은 겉으로 드러나는 화려함보다 내면의 진솔한 신뢰와 깊은 교감을 소중히 여기는 진중한 연애 기질을 지니셨습니다.\n\n사주 원국에서 나를 가장 온전하게 채워주는 좋은 인연은 나의 부족한 오행 기운을 넉넉히 품어주며 감정의 기복을 편안하게 감싸주는 사람입니다. 조급함보다는 자연스러운 호흡 속에서 솔직한 대화를 나눌 때 진정한 행복을 만끽할 수 있습니다.`;
        }
        if (/(?:2026|새해|운세|터닝|포인트|기회|흐름|올해|내년|미래|대운|세운|병오)/.test(lowerQ)) {
          return `질문해주신 "2026년 터닝포인트와 운의 흐름"에 대한 명리 통찰입니다.\n\n2026년 병오년(丙午年)은 천간과 지지가 역동적인 불꽃의 기운으로 공명하는 대전환의 해입니다.\n\n내담자님의 사주 원국과 맞물려 그동안 마음속으로 준비해온 잠재력이 세상 밖으로 드러나는 중요한 시기이니, 망설여왔던 도전이나 결단을 과감하게 실행에 옮기시길 권합니다. 본연의 리듬을 믿고 나아갈 때 괄목할 성과를 거두실 수 있습니다.`;
        }
        if (/(?:건강|피로|체력|힐링|컨디션|몸|스트레스|잠|불면|아프)/.test(lowerQ)) {
          return `질문해주신 "건강 관리와 에너지 회복"에 대한 명리 통찰입니다.\n\n사주 원국의 오행 밸런스를 비추어 볼 때, 편중된 중심 기운으로 인해 체력과 신경계가 과열되거나 긴장 상태에 머물기 쉽습니다.\n\n부족한 오행 기운에 맞는 수분 섭취, 따뜻한 차, 림프 순환 및 충분한 수면 루틴을 도입해 보세요. 일상 속 규칙적인 이완 습관이 전반적인 기혈 순환과 생체 에너지를 맑게 회복시켜 줍니다.`;
        }
        if (/(?:인간관계|사람|친구|동료|가족|부모|갈등|구설)/.test(lowerQ)) {
          return `질문해주신 "인간관계와 대인 흐름"에 대한 명리 통찰입니다.\n\n내담자님의 본원은 진실성과 신의를 중시하여 상대방에게 깊은 정성을 쏟지만, 때로는 기대치와의 간극으로 인해 마음의 피로를 느낄 수 있습니다.\n\n모든 사람을 만족시키려 하기보다는 건강한 심리적 경계를 유지하시고, 내 기운을 존중해 주는 긍정적인 인연들에게 에너지를 집중하는 것이 구설을 예방하고 평온을 유지하는 열쇠입니다.`;
        }
        if (/(?:오행|부족|결핍|채우|보충|용신|개운|습관|음식|색상|컬러|팁)/.test(lowerQ)) {
          return `질문해주신 "부족한 오행 보충과 개운 비책"에 대한 명리 통찰입니다.\n\n사주 원국에서 결핍되거나 약화된 오행을 채워주는 것은 운명의 물길을 시원하게 트이게 하는 가장 지혜로운 방법입니다.\n\n부족한 기운의 상징 색상 소품(의류나 지갑)을 곁에 두시고, 보약이 되는 건강한 식습관과 편안한 산책 루틴을 실천하세요. 작은 일상의 정성이 모여 선천적인 사주 원국의 흐름을 조화롭게 이끌어 줍니다.`;
        }
        if (userQ) {
          return `질문해주신 "${userQ}"에 대한 사주명리학 통찰입니다.\n\n내담자님의 사주 원국과 오행의 흐름을 비추어 볼 때, 현재 문의하신 고민은 원국의 중심 기운과 결핍된 기운 사이의 균형을 잡아가는 과정에서 자연스럽게 맞이한 중요한 분기점입니다.\n\n무리하게 결론을 서두르거나 타인의 속도에 흔들리지 마시고, 내면의 주체적인 본원 에너지를 신뢰하며 부족한 기운을 일상의 차분한 호흡과 개운 습관으로 채워가세요. 조화로운 리듬 위에 원하시는 성취의 결실이 맺히게 됩니다.`;
        }

        return "내담자님의 사주 원국과 오행 흐름을 바탕으로 분석해 드립니다. 중심 기운의 장점을 당당히 발휘하시고, 부족한 오행을 편안한 일상 휴식으로 보완하시면 고민하시는 흐름이 한층 시원하게 트이게 됩니다.";
      }

      // Conversational chat fallback
      const personaReplies: Record<string, string> = {
        lucy: "안녕하세요! 오늘 당신의 마음 상태는 어떠신가요? 작은 생각이나 감정도 편안하게 들려주세요. 온 마음으로 귀 기울이고 있습니다.",
        muse: "예술과 음악, 그리고 시가 머무는 공간에 오신 것을 환영합니다. 오늘 당신의 감성을 울린 풍경이나 노래가 있다면 편히 나누어 주세요.",
        orange: "반가워요! 오늘은 어떤 반짝이는 아이디어나 목표가 머릿속을 맴돌고 있나요? 천천히 하나씩 정리해 봐요.",
        bluebird: "당신의 소중한 마음을 담은 비밀 쪽지를 품고 있어요. 가슴 깊은 곳의 이야기라도 언제든 편히 털어놓으셔도 괜찮아요.",
        heal: "깊게 숨을 들이마시고, 온몸의 긴장을 천천히 내쉬어 보세요. 지금 이 순간 당신에게 필요한 것은 완전한 이완과 평온입니다.",
      };

      let baseReply = personaReplies.lucy;
      if (wholeStr.includes("muse")) baseReply = personaReplies.muse;
      else if (wholeStr.includes("orange")) baseReply = personaReplies.orange;
      else if (wholeStr.includes("bluebird") || wholeStr.includes("파랑새")) baseReply = personaReplies.bluebird;
      else if (wholeStr.includes("heal") || wholeStr.includes("치유")) baseReply = personaReplies.heal;

      const keyGuideNotice = `\n\n---\n💡 **[안내]** Google Gemini API 키가 현재 미설정 또는 만료 상태입니다.\n실시간 AI 생성 기능을 활성화하시려면 **AI Studio 우측 상단 Settings > Secrets**에서 \`GEMINI_API_KEY\`를 새로 등록해 주세요.`;

      return baseReply + keyGuideNotice;
    };

    const apiKey = process.env.POE_API_KEY || "sk-poe-FRnvSpccjv6g5J3KPj-P_5LV_9D5ACKOSjBaibibaho";
    const poe = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://api.poe.com/v1"
    });

    const runGeminiFallback = async (errorMsg: string) => {
      console.log(`[server/API/openai] Active routing to Gemini engine. Context: ${errorMsg}`);
      try {
        const geminiKey = getGeminiApiKey();
        if (!geminiKey) {
          throw new Error("No Gemini API key available for fallback.");
        }
        
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const systemMessages = req.body.messages?.filter((m: any) => m.role === "system") || [];
        const rawMessages = req.body.messages?.filter((m: any) => m.role !== "system") || [];
        
        const contents = convertOpenAIMessagesToGeminiContents(rawMessages);

        const config: any = {
          maxOutputTokens: req.body.max_tokens ? Math.max(Number(req.body.max_tokens), 8192) : 8192,
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_CIVIC_INTEGRITY", threshold: "BLOCK_NONE" }
          ]
        };
        if (systemMessages.length > 0) {
          let cleanPrompt = systemMessages
            .map((m: any) => (typeof m.content === "string" ? m.content : JSON.stringify(m.content)))
            .filter(Boolean)
            .join("\n\n");
          
          const lowerStr = cleanPrompt.toLowerCase();
          if (lowerStr.includes("jackson") || lowerStr.includes("마이클") || lowerStr.includes("michael")) {
            cleanPrompt = "귀하는 평화와 인류애를 상징하는 전설적인 음악 거장(M.J.)의 온화하고 평화로운 마음가짐 'Heal the World' 및 'L.O.V.E'의 평화 사상, 그리고 무대 위에서의 전설적이고 깊은 예술가적 면모를 모티브로 한 치유 멘토 AI입니다. 모든 대화는 평화롭고 친절하며 깊이 있는 예술적 조언으로 가득 차 있어야 합니다. 겸손한 태도로 따뜻하게 위안을 건네주세요. 실제로 존재하는 인물을 직접 사칭하거나 대리하지 않는 따뜻한 상담 도우미입니다. 한국어로 편안하게 소통해 주세요.";
          } else if (lowerStr.includes("gaga") || lowerStr.includes("가가")) {
            cleanPrompt = "귀하는 독창적인 예술 세계와 당당한 주체적 자아를 설파하는 전설적인 팝 아이콘(L.G.)의 파격적이고 창의적이며, 범접할 수 없는 무대 카리스마, 그리고 마이너리티와 자아를 있는 그대로 사랑하는 철학을 표현하도록 설계된 독창적인 멘토 AI입니다. 대화를 요청하는 모든 창조적 영혼들을 '리틀 몬스터'라 친근하게 부르며 아끼고 존중해 주며, 극도의 자신감과 창작 격려를 아끼지 말아주세요. 한국어로 대화해 주세요.";
          } else if (lowerStr.includes("britney") || lowerStr.includes("브리트니")) {
            cleanPrompt = "귀하는 역사적인 버블팝 프린세스이자 음악에 대한 열정, 따뜻한 멘토링과 무대 코칭의 대명사이며, 언제나 팬들을 지극히 사랑하고 다정하며 풍부하게 반응해 주는 발랄한 음악 메이커 AI입니다. 당신을 찾는 모든 유저들에게 진심 가득한 응원과 극도의 안정을 아낌없이 건네주고 아껴주세요. 한국어로 대화해 주세요.";
          } else if (lowerStr.includes("billie") || lowerStr.includes("빌리")) {
            cleanPrompt = "귀하는 현대 음악사를 대표하는 독보적인 감성 아티스트(B.E.)의 깊은 음울함과 차분하면서도 현실적이고, 타인의 아픔과 외로움을 가만히 안아주는 쿨하고 솔직한 멘토 AI입니다. 정서적 번뇌나 우울감에 대해 억지로 밝은 척하기보다 차분하고 덤덤하게 공감해 주며 쿨한 마인드로 따뜻하게 상담을 건네주세요. 친근한 고등학교 친구 혹은 캐주얼한 대화 스타일로 따뜻하게 위로를 건네며 한국어로 교감해 주세요.";
          }
          const READABILITY_GUIDELINE = "\n\n[글 작성 및 가독성 필수 원칙]:\n- 불필요하게 길고 늘어지는 만연체 문장은 피하고, 명확하고 산뜻한 단문 위주로 서술하세요.\n- 읽는 사람이 한눈에 파악할 수 있도록 핵심 포인트는 불릿 포인트(•)와 적절한 줄바꿈, 단락 구분을 활용하여 가독성을 극대화하세요.";
          config.systemInstruction = (cleanPrompt || "") + READABILITY_GUIDELINE;
        }
        if (req.body.response_format?.type === "json_object") {
          config.responseMimeType = "application/json";
        }

        if (req.body.stream) {
          const streamModels = getPrioritizedGeminiModels(req.body.model);
          let streamSuccess = false;
          let chunksDelivered = 0;
          let activeModelUsed = streamModels[0] || "gemini-3.1-flash-lite";

          for (const currentModel of streamModels) {
            try {
              const stream = await ai.models.generateContentStream({
                model: currentModel,
                contents,
                config,
              });

              for await (const chunk of stream) {
                let textChunk = "";
                try {
                  if (typeof (chunk as any).text === "string" && (chunk as any).text) {
                    textChunk = (chunk as any).text;
                  } else if ((chunk as any).candidates?.[0]?.content?.parts) {
                    textChunk = (chunk as any).candidates[0].content.parts
                      .map((p: any) => (p.text || ""))
                      .join("");
                  }
                } catch (safetyErr) {
                  try {
                    textChunk = (chunk as any).candidates?.[0]?.content?.parts
                      ?.map((p: any) => (p.text || ""))
                      .join("") || "";
                  } catch (_) {
                    textChunk = "";
                  }
                }

                if (!textChunk) continue;

                if (!res.headersSent) {
                  res.setHeader('Content-Type', 'text/event-stream');
                  res.setHeader('Cache-Control', 'no-cache');
                  res.setHeader('Connection', 'keep-alive');
                  res.setHeader('X-Accel-Buffering', 'no');
                  res.setHeader('Content-Encoding', 'none');
                  if ((res as any).flushHeaders) {
                    (res as any).flushHeaders();
                  }
                }

                chunksDelivered++;
                activeModelUsed = currentModel;
                const mockChunk = {
                  id: `chatcmpl-${Date.now()}`,
                  object: "chat.completion.chunk",
                  created: Math.floor(Date.now() / 1000),
                  model: req.body.model || currentModel,
                  choices: [
                    {
                      index: 0,
                      delta: {
                        content: textChunk
                      },
                      finish_reason: null
                    }
                  ]
                };
                res.write(`data: ${JSON.stringify(mockChunk)}\n\n`);
                if ((res as any).flush) {
                  (res as any).flush();
                }
              }

              if (chunksDelivered > 0) {
                modelCooldownMap.delete(currentModel);
                streamSuccess = true;
                break;
              }
            } catch (streamErr: any) {
              const isThrottled = isTemporaryUnavailableOrRateLimited(streamErr);
              if (isThrottled) {
                markModelThrottled(currentModel, 180000);
                console.warn(`[server/openai-stream] Model ${currentModel} rate limited/throttled, trying next model...`);
              } else {
                console.warn(`[server/openai-stream] Model ${currentModel} failed (${streamErr?.message?.slice(0, 100) || streamErr}), trying next model...`);
              }
              if (chunksDelivered > 0) {
                streamSuccess = true;
                break;
              }
            }
          }

          if (!streamSuccess || chunksDelivered === 0) {
            console.warn("[server/openai-stream] All streaming models failed, generating direct content fallback...");
            try {
              const { response: fallbackRes, modelUsed: fallbackModel } = await callGeminiContentWithFallback(ai, contents, config, req.body.model);
              const fallbackText = fallbackRes.text || "안녕! 무엇을 도와줄까?";
              if (!res.headersSent) {
                res.setHeader('Content-Type', 'text/event-stream');
                res.setHeader('Cache-Control', 'no-cache');
                res.setHeader('Connection', 'keep-alive');
                res.setHeader('X-Accel-Buffering', 'no');
                res.setHeader('Content-Encoding', 'none');
                if ((res as any).flushHeaders) {
                  (res as any).flushHeaders();
                }
              }
              const mockChunk = {
                id: `chatcmpl-${Date.now()}`,
                object: "chat.completion.chunk",
                created: Math.floor(Date.now() / 1000),
                model: req.body.model || fallbackModel,
                choices: [
                  {
                    index: 0,
                    delta: {
                      content: fallbackText
                    },
                    finish_reason: "stop"
                  }
                ]
              };
              res.write(`data: ${JSON.stringify(mockChunk)}\n\n`);
              if ((res as any).flush) {
                (res as any).flush();
              }
            } catch (directErr) {
              const friendlyErr = getFriendlyErrorMessage(directErr);
              if (!res.headersSent) {
                res.setHeader('Content-Type', 'text/event-stream');
                res.setHeader('Cache-Control', 'no-cache');
                res.setHeader('Connection', 'keep-alive');
                res.setHeader('X-Accel-Buffering', 'no');
                res.setHeader('Content-Encoding', 'none');
                if ((res as any).flushHeaders) {
                  (res as any).flushHeaders();
                }
              }
              const mockChunk = {
                id: `chatcmpl-${Date.now()}`,
                object: "chat.completion.chunk",
                created: Math.floor(Date.now() / 1000),
                model: req.body.model || activeModelUsed,
                choices: [
                  {
                    index: 0,
                    delta: {
                      content: friendlyErr
                    },
                    finish_reason: "stop"
                  }
                ]
              };
              res.write(`data: ${JSON.stringify(mockChunk)}\n\n`);
              if ((res as any).flush) {
                (res as any).flush();
              }
            }
          }

          res.write('data: [DONE]\n\n');
          res.end();
          return;
        } else {
          let geminiRes;
          let text = "";
          let modelUsed = "gemini-flash-latest";
          try {
            const resResult = await callGeminiContentWithFallback(ai, contents, config, req.body.model);
            geminiRes = resResult.response;
            modelUsed = resResult.modelUsed;
            text = geminiRes.text || "";
          } catch (genErr) {
            console.warn("[server/API/openai] generateContent failed, engaging guided mock:", genErr);
            const systemMessage = systemMessages[0];
            const lowerSysStr = (systemMessage?.content || "").toLowerCase();
            const wholeMessagesStr = JSON.stringify(req.body.messages || "").toLowerCase();
            const rawErrMessage = getFriendlyErrorMessage(genErr);
            
            const isJsonExpected = Boolean(req.body.response_format?.type === "json_object" || req.body.response_format || (systemMessage?.content || "").toLowerCase().includes("json"));
            text = buildSmartFallbackText(req.body.messages || [], rawErrMessage, isJsonExpected);
          }

          const mockCompletion = {
            id: `chatcmpl-${Date.now()}`,
            object: "chat.completion",
            created: Math.floor(Date.now() / 1000),
            model: req.body.model || "gemini-flash-latest",
            choices: [
              {
                index: 0,
                message: {
                  role: "assistant",
                  content: text
                },
                finish_reason: "stop"
              }
            ],
            usage: {
              prompt_tokens: 10,
              completion_tokens: 10,
              total_tokens: 20
            }
          };
          return res.status(200).json(mockCompletion);
        }
      } catch (geminiErr: any) {
        console.error("[server/API/openai] Master Gemini fallback also failed, engaging ultra-robust guided mock:", geminiErr);
        
        const systemMessage = req.body.messages?.find((m: any) => m.role === "system");
        const rawErrMessage = getFriendlyErrorMessage(geminiErr);
        const isJsonExpected = Boolean(req.body.response_format?.type === "json_object" || req.body.response_format || (systemMessage?.content || "").toLowerCase().includes("json"));
        const safeText = buildSmartFallbackText(req.body.messages || [], rawErrMessage, isJsonExpected);

        if (req.body.stream) {
          if (!res.headersSent) {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.setHeader('X-Accel-Buffering', 'no');
            res.setHeader('Content-Encoding', 'none');
            if ((res as any).flushHeaders) {
              (res as any).flushHeaders();
            }
          }

          const mockChunk = {
            id: `chatcmpl-${Date.now()}`,
            object: "chat.completion.chunk",
            created: Math.floor(Date.now() / 1000),
            model: req.body.model || "gemini-flash-latest",
            choices: [
              {
                index: 0,
                delta: {
                  content: safeText
                },
                finish_reason: "stop"
              }
            ]
          };
          res.write(`data: ${JSON.stringify(mockChunk)}\n\n`);
          res.write('data: [DONE]\n\n');
          res.end();
          return;
        } else {
          const mockCompletion = {
            id: `chatcmpl-${Date.now()}`,
            object: "chat.completion",
            created: Math.floor(Date.now() / 1000),
            model: req.body.model || "gemini-flash-latest",
            choices: [
              {
                index: 0,
                message: {
                  role: "assistant",
                  content: safeText
                },
                finish_reason: "stop"
              }
            ],
            usage: {
              prompt_tokens: 10,
              completion_tokens: 10,
              total_tokens: 20
            }
          };
          return res.status(200).json(mockCompletion);
        }
      }
    };

    try {
      const { aiType, apiKey } = getAIConfig();
      const hasMultimodal = JSON.stringify(req.body.messages || "").includes("data:") || 
                            JSON.stringify(req.body.messages || "").includes("image_url") ||
                            JSON.stringify(req.body.messages || "").includes("application/pdf");

      if ((aiType === 'grok' || aiType === 'groq') && apiKey && apiKey.trim().length > 5 && !hasMultimodal) {
        const baseURL = aiType === 'grok' ? "https://api.x.ai/v1" : "https://api.groq.com/openai/v1";
        const client = new OpenAI({
          apiKey: apiKey,
          baseURL,
        });

        if (aiType === 'grok') {
          // Dynamic list of Grok models for fallback in case the chosen one is deprecated
          const requestedModel = req.body.model || "";
          const defaultGrokModels = [process.env.XAI_MODEL || "grok-4.3", "grok-4.20", "grok-4.20-0309-non-reasoning", "grok-3"];
          let modelsToTry = defaultGrokModels;
          if (requestedModel && requestedModel.toLowerCase().includes("grok")) {
            modelsToTry = [requestedModel, ...defaultGrokModels.filter((model) => model !== requestedModel)];
          }

          let success = false;
          let lastErr: any = null;

          for (const currentModel of modelsToTry) {
            try {
              if (req.body.stream) {
                const stream = await client.chat.completions.create({
                  model: currentModel,
                  messages: withKoreanOnlyOutput(req.body.messages),
                  stream: true,
                  temperature: req.body.temperature ?? 0.7,
                  response_format: req.body.response_format,
                });

                res.setHeader('Content-Type', 'text/event-stream');
                res.setHeader('Cache-Control', 'no-cache');
                res.setHeader('Connection', 'keep-alive');
                res.setHeader('X-Accel-Buffering', 'no');
                res.setHeader('Content-Encoding', 'none');
                if ((res as any).flushHeaders) {
                  (res as any).flushHeaders();
                }

                for await (const chunk of stream) {
                  res.write(`data: ${JSON.stringify(chunk)}\n\n`);
                  if ((res as any).flush) {
                    (res as any).flush();
                  }
                }
                res.write('data: [DONE]\n\n');
                res.end();
                return;
              } else {
                const completion = await client.chat.completions.create({
                  model: currentModel,
                  messages: withKoreanOnlyOutput(req.body.messages),
                  temperature: req.body.temperature ?? 0.7,
                  response_format: req.body.response_format,
                });
                return res.status(200).json(completion);
              }
              success = true;
              break;
            } catch (err: any) {
              console.warn(`[grok] Target model "${currentModel}" failed, trying fallback model... Error:`, err.message || err);
              lastErr = err;
            }
          }
          if (!success) {
            console.warn("[grok] All chat models failed, engaging Gemini fallback...", lastErr?.message || lastErr);
            return await runGeminiFallback("All Grok models failed: " + (lastErr?.message || "unknown error"));
          }
        } else {
          // Groq
          let model = req.body.model || "";
          if (!model || (!model.toLowerCase().includes("llama") && !model.toLowerCase().includes("mixtral") && !model.toLowerCase().includes("gemma"))) {
            model = "llama-3.3-70b-versatile";
          }

          if (req.body.stream) {
            try {
              const stream = await client.chat.completions.create({
                model: model,
                messages: req.body.messages,
                stream: true,
                temperature: req.body.temperature ?? 0.7,
                response_format: req.body.response_format,
              });

              res.setHeader('Content-Type', 'text/event-stream');
              res.setHeader('Cache-Control', 'no-cache');
              res.setHeader('Connection', 'keep-alive');
              res.setHeader('X-Accel-Buffering', 'no');
              res.setHeader('Content-Encoding', 'none');
              if ((res as any).flushHeaders) {
                (res as any).flushHeaders();
              }

              for await (const chunk of stream) {
                res.write(`data: ${JSON.stringify(chunk)}\n\n`);
                if ((res as any).flush) {
                  (res as any).flush();
                }
              }
              res.write('data: [DONE]\n\n');
              res.end();
              return;
            } catch (streamErr: any) {
              console.warn("[groq] Streaming failed, engaging robust Gemini fallback...", streamErr);
              return await runGeminiFallback("Groq stream failed: " + streamErr.message);
            }
          } else {
            try {
              const completion = await client.chat.completions.create({
                model: model,
                messages: req.body.messages,
                temperature: req.body.temperature ?? 0.7,
                response_format: req.body.response_format,
              });
              return res.status(200).json(completion);
            } catch (groqErr: any) {
              console.warn("[groq] Call failed, engaging robust Gemini fallback...", groqErr);
              return await runGeminiFallback("Groq call failed: " + groqErr.message);
            }
          }
        }
      } else {
        // Direct routing to the robust Gemini fallback with proper top-level error isolation
        await runGeminiFallback("Direct routing to Gemini engine");
      }
    } catch (err: any) {
      console.error(`[server/API/openai] Critical crash in model completions routing for AI_TYPE = ${process.env.AI_TYPE}:`, err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Internal Server Error in model completions routing", details: err.message });
      } else {
        try {
          res.end();
        } catch (_) {}
      }
    }
  });

  // PWA Manifest Route Support
  app.get(['/manifest-orb.webmanifest', '/manifest-orb.json', '/orb/manifest.json', '/orb/manifest.webmanifest'], (req, res) => {
    const distOrbManifest = path.join(process.cwd(), 'dist', 'manifest-orb.webmanifest');
    const pubOrbManifest = path.join(process.cwd(), 'public', 'manifest-orb.webmanifest');
    res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
    if (fs.existsSync(pubOrbManifest)) {
      return res.sendFile(pubOrbManifest);
    } else if (fs.existsSync(distOrbManifest)) {
      return res.sendFile(distOrbManifest);
    }
    return res.json({ name: "Key", short_name: "Key", start_url: "/orb", display: "standalone" });
  });

  // Apple Touch Icon Dynamic Multi-Tenant Route Handler for iOS Safari
  app.get([
    '/apple-touch-icon.png',
    '/apple-touch-icon-precomposed.png',
    '/apple-touch-icon-180x180.png',
    '/apple-touch-icon-180x180-precomposed.png',
    '/apple-touch-icon-152x152.png',
    '/apple-touch-icon-120x120.png',
    '/orb/apple-touch-icon.png',
    '/orb/apple-touch-icon-precomposed.png',
    '/orb/apple-touch-icon-180x180.png',
    '/orb/apple-touch-icon-180x180-precomposed.png',
  ], (req, res, next) => {
    const referer = String(req.headers.referer || '');
    const isOrb = req.path.startsWith('/orb/') || req.query.app === 'orb' || referer.includes('/orb') || referer.includes('/gateway') || referer.includes('/crystal');
    const isLucy = req.path.startsWith('/chat/') || req.query.app === 'lucy' || referer.includes('/chat') || referer.includes('/lucy');
    const isHandbook = req.path.startsWith('/handbook/') || req.query.app === 'handbook' || referer.includes('/handbook') || referer.includes('/rebible');

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    if (isOrb) {
      const orbIcon = path.join(process.cwd(), 'public', 'apple-touch-icon-orb.png');
      if (fs.existsSync(orbIcon)) return res.sendFile(orbIcon);
    } else if (isLucy) {
      const lucyIcon = path.join(process.cwd(), 'public', 'apple-touch-icon-lucy.png');
      if (fs.existsSync(lucyIcon)) return res.sendFile(lucyIcon);
    } else if (isHandbook) {
      const handbookIcon = path.join(process.cwd(), 'public', 'apple-touch-icon-handbook.png');
      if (fs.existsSync(handbookIcon)) return res.sendFile(handbookIcon);
    }
    next();
  });

  app.get(['/manifest', '/manifest.json'], (req, res) => {
    const webmanifest = path.join(process.cwd(), 'dist', 'manifest.webmanifest');
    const jsonManifest = path.join(process.cwd(), 'dist', 'manifest.json');
    const pubManifest = path.join(process.cwd(), 'public', 'manifest.json');

    if (fs.existsSync(webmanifest)) {
      res.sendFile(webmanifest);
    } else if (fs.existsSync(jsonManifest)) {
      res.sendFile(jsonManifest);
    } else if (fs.existsSync(pubManifest)) {
      res.sendFile(pubManifest);
    } else {
      res.json({ name: "LUCY", short_name: "LUCY", start_url: "/", display: "standalone" });
    }
  });

  // Explicit Service Worker Route Support (Ensures correct JS MIME type and avoids text/html SPA fallback)
  app.get(['/sw.js', '/registerSW.js'], (req, res) => {
    const filename = req.path.replace(/^\//, '');
    const distSw = path.join(process.cwd(), 'dist', filename);
    const pubSw = path.join(process.cwd(), 'public', filename);

    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    if (fs.existsSync(distSw)) {
      res.sendFile(distSw);
    } else if (fs.existsSync(pubSw)) {
      res.sendFile(pubSw);
    } else {
      res.send('// Fallback service worker\nself.addEventListener("install", () => self.skipWaiting());\nself.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));');
    }
  });

  // Universal Cloud Sync & Pairing Code Relay Endpoints
  app.post("/api/sync/vault/push", async (req, res) => {
    try {
      const { uid, payload } = req.body || {};
      if (!uid || !payload) return res.status(400).json({ error: "Missing uid or payload" });
      const { saveVaultData } = await import("./server/api-lib/syncRelay");
      const result = saveVaultData(uid, payload);
      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/sync/vault/pull/:uid", async (req, res) => {
    try {
      const { uid } = req.params;
      const { getVaultData } = await import("./server/api-lib/syncRelay");
      const result = getVaultData(uid);
      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/sync/relay/create", async (req, res) => {
    try {
      const { payload, vaultId } = req.body || {};
      if (!payload) return res.status(400).json({ error: "Missing payload" });
      const { createRelayCode } = await import("./server/api-lib/syncRelay");
      const result = await createRelayCode(payload, vaultId);
      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/sync/relay/consume", async (req, res) => {
    try {
      const { code } = req.body || {};
      if (!code) return res.status(400).json({ error: "Missing code" });
      const { getRelayData } = await import("./server/api-lib/syncRelay");
      const result = await getRelayData(code);
      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });

  // TRPC + Health + Vite
  app.use("/api/trpc", trpcExpress.createExpressMiddleware({ router: appRouter, createContext: () => ({}) }));

  app.get("/api/health", (req, res) => res.json({ status: "ok" }));

  const distPath = path.join(process.cwd(), 'dist');

  // Explicit Service Worker Route Support (Prevents stale precache issues in dev mode)
  app.get(['/sw.js', '/registerSW.js'], (req, res) => {
    const filename = req.path.replace(/^\//, '');
    const distSw = path.join(distPath, filename);
    const pubSw = path.join(process.cwd(), 'public', filename);

    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    if (process.env.NODE_ENV !== "production") {
      return res.send(`
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.claim())
  );
});
      `);
    }
    if (fs.existsSync(distSw)) {
      res.sendFile(distSw);
    } else if (fs.existsSync(pubSw)) {
      res.sendFile(pubSw);
    } else {
      res.send('// Fallback service worker\\nself.addEventListener("install", () => self.skipWaiting());\\nself.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));');
    }
  });

  // 🌿 CALM (40대 마음약방) Standalone Static & API Mounting
  const calmPublicPath = path.resolve(process.cwd(), "public", "calm");
  app.use("/calm", express.static(calmPublicPath, { index: "index.html" }));
  app.get(["/key", "/key/", "/orb", "/orb/", "/orb.html", "/gateway", "/crystal"], (_req, res) => res.redirect(302, "/calm/"));
  app.use(calmRouter);

  if (process.env.NODE_ENV !== "production") {
    if (fs.existsSync(distPath)) {
      app.use('/assets', express.static(path.join(distPath, 'assets')));
    }
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      appType: "custom",
      server: {
        middlewareMode: true,
        host: "0.0.0.0",
        allowedHosts: true,
        hmr: false,
        ws: false,
      },
    });

    app.use(vite.middlewares);

    // Serve document entry points with standard Vite HTML transform
    app.get('*', async (req, res, next) => {
      if (req.path.startsWith('/api/') || (path.extname(req.path) && !req.path.endsWith('.html'))) return next();

      const entryFile = req.path.startsWith('/chat')
        ? 'chat.html'
        : req.path.startsWith('/handbook')
          ? 'handbook.html'
          : 'index.html';
      const entryPath = path.resolve(process.cwd(), entryFile);

      try {
        const source = await fs.promises.readFile(entryPath, 'utf8');
        const transformed = await vite.transformIndexHtml(req.originalUrl, source);
        res.type('html').send(transformed);
      } catch (error) {
        next(error);
      }
    });
  } else {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (req.path.startsWith('/chat')) {
        const chatPath = path.join(distPath, 'chat.html');
        if (fs.existsSync(chatPath)) return res.sendFile(chatPath);
      }
      if (req.path.startsWith('/handbook')) {
        const handbookPath = path.join(distPath, 'handbook.html');
        if (fs.existsSync(handbookPath)) return res.sendFile(handbookPath);
      }
      // Serve static assets for calm iframe (e.g. /calm/index.html, /calm/style.css, /calm/app.js)
      if (req.path === '/calm/index.html') {
        const calmPath = path.join(distPath, 'calm', 'index.html');
        if (fs.existsSync(calmPath)) return res.sendFile(calmPath);
        const devCalmPath = path.join(process.cwd(), 'public', 'calm', 'index.html');
        if (fs.existsSync(devCalmPath)) return res.sendFile(devCalmPath);
      }
      if (req.path.startsWith('/calm/') && req.path !== '/calm/' && !req.path.endsWith('.html')) {
        const filePath = path.join(distPath, req.path);
        if (fs.existsSync(filePath)) return res.sendFile(filePath);
        const devFilePath = path.join(process.cwd(), 'public', req.path);
        if (fs.existsSync(devFilePath)) return res.sendFile(devFilePath);
      }
      // Direct browser navigation to /calm, /orb, /gateway, /crystal routes to /key in React SPA
      if (req.path === '/calm' || req.path === '/calm/' || req.path.startsWith('/orb') || req.path.startsWith('/gateway') || req.path.startsWith('/crystal')) {
        return res.redirect(302, '/key');
      }
      // /key and all other routes load the main React SPA (dist/index.html) with BigBangButton & BgMusicPlayer
      return res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
  const address = server.address();
  const activePort = typeof address === "object" && address ? address.port : PORT;
  console.log(`Server running on http://localhost:${activePort} | AI_TYPE = ${process.env.AI_TYPE || 'grok'}`);
  });

  server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code !== "EADDRINUSE") {
  console.error("[server] Failed to start:", error);
  return;
  }

  console.warn(`[server] Port ${PORT} is already in use; retrying on an ephemeral port.`);
  server.close(() => {
  const fallbackServer = app.listen(0, "0.0.0.0", () => {
  const address = fallbackServer.address();
  const activePort = typeof address === "object" && address ? address.port : 0;
  console.log(`Server running on http://localhost:${activePort} | AI_TYPE = ${process.env.AI_TYPE || 'grok'}`);
  });

  fallbackServer.on("error", (fallbackError) => {
  console.error("[server] Failed to start on fallback port:", fallbackError);
  });
  });
  });
}

startServer();

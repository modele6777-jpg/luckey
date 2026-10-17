import "dotenv/config";
import express from "express";

const app = express();

app.use(express.json({ limit: "50mb" }));

// CORS & OPTIONS Preflight Handler
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-stainless-sdk-version, x-stainless-os, x-stainless-lang, x-stainless-runtime, x-stainless-runtime-version, x-stainless-helper-method, x-stainless-package-version");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Vercel catch-all functions may deliver paths without the /api prefix.
app.use((req, _res, next) => {
  const [pathname, ...queryParts] = (req.url || "/").split("?");
  const query = queryParts.length ? `?${queryParts.join("?")}` : "";
  if (pathname && !pathname.startsWith("/api") && pathname !== "/health") {
    req.url = `/api${pathname.startsWith("/") ? pathname : `/${pathname}`}${query}`;
  }
  next();
});

// Chat completions proxy using Gemini API
import { GoogleGenAI } from "@google/genai";

app.post([/.*\/chat\/completions$/, "/api/openai/v1/chat/completions", "/openai/v1/chat/completions"], async (req, res) => {
  const rawKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY || "";
  const geminiApiKey = rawKey.includes("AQ.Ab8RN6LJzmJJ3ExtNix-ERyIkxzPtsV23WdCr71NRGItFPK41A") ? "" : rawKey;
  if (!geminiApiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY not configured or invalid" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    const model = req.body.model || "gemini-3.7-flash";
    const messages = req.body.messages || [];
    const lastUserMessage = messages.filter((m: any) => m.role === "user").pop()?.content || "";
    const systemPrompt = messages.filter((m: any) => m.role === "system").map((m: any) => m.content).join("\n");

    const response = await ai.models.generateContent({
      model: model,
      contents: lastUserMessage,
      config: systemPrompt ? { systemInstruction: systemPrompt } : undefined
    });

    const replyText = response.text || "";

    if (req.body.stream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const chunk = {
        id: "chatcmpl-" + Date.now(),
        object: "chat.completion.chunk",
        created: Math.floor(Date.now() / 1000),
        model,
        choices: [{ index: 0, delta: { content: replyText }, finish_reason: null }]
      };
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      res.write(`data: [DONE]\n\n`);
      res.end();
      return;
    } else {
      return res.status(200).json({
        id: "chatcmpl-" + Date.now(),
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model,
        choices: [{ index: 0, message: { role: "assistant", content: replyText }, finish_reason: "stop" }]
      });
    }
  } catch (err: any) {
    console.error("Gemini completion proxy error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// TTS generation endpoint with resilient fallbacks (EdgeTTS -> Google TTS -> OpenAI TTS)
import { handleTTS } from "../server/api-lib/ttsHandler";

app.post("/api/ai/tts", async (req, res) => {
  const { text, voice = "Kore", emotion, rate, speed, pitch } = req.body || {};
  if (!text) {
    return res.status(400).json({ error: "Empty speech text" });
  }

  try {
    const result = await handleTTS({ text, voice, emotion, rate, speed, pitch });
    return res.status(200).json(result);
  } catch (err: any) {
    console.error("Vercel TTS generation error:", err);
    return res.status(500).json({ error: err.message || "Failed to generate TTS" });
  }
});

// Image generation endpoint using free Pollinations AI on Vercel
app.post("/api/ai/image", async (req, res) => {
  const { prompt, aspectRatio = "1:1" } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Empty prompt" });
  }

  const dims = aspectRatio === "16:9"
    ? { width: 768, height: 432 }
    : aspectRatio === "9:16"
      ? { width: 432, height: 768 }
      : { width: 512, height: 512 };

  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${dims.width}&height=${dims.height}&seed=${Math.floor(Math.random() * 1000000)}&nologo=true&model=flux`;
  return res.status(200).json({ imageUrl: pollinationsUrl });
});

// Diary analysis endpoint on Vercel
app.post("/api/ai/analyze-entry", async (req, res) => {
  const { title = "", content = "", type = "" } = req.body;
  if (!content && !title) {
    return res.status(200).json({ keywords: [], emotions: [] });
  }

  const prompt = `기록의 유형: ${type}
기록의 제목: ${title}
기록의 내용:
${content}

위 내면의 기록을 섬세하게 메타 분석하여:
1. 기록의 핵심 주제와 생각, 관련 사물을 관통하는 대표 키워드 3~5개 (배열로 추출)
2. 글쓴이의 주된 마음 상태, 미묘한 어조, 에너지 흐름을 정확히 묘사하는 감정/심리 상태 태그 1~3개 (배열로 추출)

오직 다음 JSON 스키마 형식의 유효한 JSON 결과만 반환해 주세요:
{
  "keywords": ["키워드1", "키워드2", "키워드3"],
  "emotions": ["감정태그1", "감정태그2"]
}`;

  const rawKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY || "";
  const geminiApiKey = rawKey.includes("AQ.Ab8RN6LJzmJJ3ExtNix-ERyIkxzPtsV23WdCr71NRGItFPK41A") ? "" : rawKey;

  if (geminiApiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });
      const geminiRes = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const rawText = geminiRes.text;
      if (rawText) {
        const parsed = JSON.parse(rawText.trim());
        if (parsed && Array.isArray(parsed.keywords) && Array.isArray(parsed.emotions)) {
          return res.status(200).json(parsed);
        }
      }
    } catch (err) {
      console.warn("Gemini analysis failed on Vercel, falling back to heuristic offline analysis:", err);
    }
  }

  // Heuristic Offline Fallback
  const keywords: string[] = [];
  const emotions: string[] = [];
  const lowerContent = content.toLowerCase();

  const emotionDictionary = [
    { keys: ["기쁨", "행복", "감사", "사랑", "설렘", "즐거", "happy", "love", "joy"], tag: "평온/기쁨" },
    { keys: ["슬픔", "우울", "눈물", "외롭", "쓸쓸", "sad", "blue", "lonely"], tag: "내면의 슬픔" },
    { keys: ["불안", "걱정", "두려", "초조", "긴장", "scared", "anxious", "worry"], tag: "정서적 초조" },
    { keys: ["분노", "화가", "짜증", "억울", "미움", "angry", "irritated"], tag: "의식의 마찰" },
    { keys: ["지침", "피곤", "소진", "번아웃", "무기력", "tired", "exhausted"], tag: "에너지 소진" },
  ];

  for (const dict of emotionDictionary) {
    if (dict.keys.some(k => lowerContent.includes(k))) {
      emotions.push(dict.tag);
    }
  }
  if (emotions.length === 0) {
    emotions.push("미묘한 중립");
  }

  const words = (content as string).split(/\s+/).filter(w => w.length > 1 && !w.startsWith("#"));
  const uniqueWords = Array.from(new Set(words)) as string[];
  keywords.push(...uniqueWords.slice(0, 4));
  if (keywords.length === 0) {
    keywords.push("내면 기록", "일상");
  }

  return res.status(200).json({ keywords, emotions });
});

// 데일리 카드 전용 BGM 생성 (시드 기반 고유 WAV)
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

    const { generateDailyBgmBuffer } = await import("../server/api-lib/generateDailyBgm");
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

// 오늘의 예술: 검증된 카탈로그 기반 + AI는 해석 문구만 개인화
app.post("/api/ai/recommend-art", async (req, res) => {
  try {
    const { buildDailyArtRecommendation } = await import("../server/api-lib/recommendArt");
    const result = await buildDailyArtRecommendation(req.body || {});
    return res.status(200).json(result);
  } catch (err: unknown) {
    console.error("[recommend-art] error:", err);
    const { buildVerifiedArtRecommendation } = await import("../server/api-lib/museArtCatalog");
    const dateKey = String(req.body?.dateKey || new Date().toLocaleDateString("sv"));
    return res.status(200).json(
      buildVerifiedArtRecommendation(dateKey, String(req.body?.currentMood || ""), req.body?.moodId),
    );
  }
});

// Universal Cloud Sync & Pairing Code Relay Endpoints
app.post("/api/sync/vault/push", async (req, res) => {
  try {
    const { uid, payload } = req.body || {};
    if (!uid || !payload) return res.status(400).json({ error: "Missing uid or payload" });
    const { saveVaultData } = await import("../server/api-lib/syncRelay");
    const result = saveVaultData(uid, payload);
    return res.status(200).json(result);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

app.get("/api/sync/vault/pull/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const { getVaultData } = await import("../server/api-lib/syncRelay");
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
    const { createRelayCode } = await import("../server/api-lib/syncRelay");
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
    const { getRelayData } = await import("../server/api-lib/syncRelay");
    const result = await getRelayData(code);
    return res.status(200).json(result);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

app.get(["/api/health", "/health"], (_req, res) => res.json({ status: "ok" }));

export default app;

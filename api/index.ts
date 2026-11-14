// v1.7.409: Avoid retransmitting unchanged server vaults and back off fallback polling
import { getLucyRequestFallbacks, requestWithModelFallback } from '../src/lib/lucyModelPolicy.ts';
import "dotenv/config";
import express from "express";
import { readFileSync } from "node:fs";
import { describeGeminiError, getGeminiApiKey } from "../server/geminiKey.ts";
import { installAsyncRouteGuard } from "../server/api-lib/routeGuard.ts";
import { handleDailyTarotPost } from "../server/api-lib/dailyTarotRoute.ts";
import {
  handleMCPDirectPost,
  handleMCPPostMessage,
  handleMCPSseStream,
  handleStreamableMethodNotAllowed,
} from "../server/api-lib/mcpHandler.ts";
import { handleSajuChartPost } from "../server/api-lib/sajuChartRoute.ts";
import { handleSecretBlessingPost, handleSecretMoodPost } from "../server/api-lib/secretNoteRoute.ts";
import { heuristicDiaryAnalysis, requestDiaryAnalysis } from "../server/api-lib/analyzeEntry.ts";
import { applyRestrictedCors, guardRestrictedRoute, isRestrictedAppRoute, rateLimit, requestPath } from "../server/api-lib/publicAccess.ts";

const app = express();
installAsyncRouteGuard(app);

app.use((req, res, next) => {
  if (!isRestrictedAppRoute(requestPath(req))) return next();
  const declared = Number(req.headers["content-length"] || 0);
  if (Number.isFinite(declared) && declared > 48_000) {
    applyRestrictedCors(req, res);
    return res.status(413).json({ error: "요청이 너무 큽니다.", code: "BODY_TOO_LARGE" });
  }
  return next();
});

app.use(express.json({ limit: "50mb" }));

app.use(guardRestrictedRoute(48_000));

// CORS & OPTIONS Preflight Handler. Restricted app routes set their own origin.
app.use((req, res, next) => {
  const path = (req.originalUrl || req.url || '/').split('?')[0];
  const restricted = path === '/api/ai/tts' || path === '/api/ai/recommend-art' || path === '/api/ai/daily-tarot' || path === '/api/muse/docent' || path.endsWith('/chat/completions');
  if (!restricted) {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-stainless-sdk-version, x-stainless-os, x-stainless-lang, x-stainless-runtime, x-stainless-runtime-version, x-stainless-helper-method, x-stainless-package-version");
  if (req.method === "OPTIONS") {
    if (restricted) return next();
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

// MCP routes are also needed in the Vercel entrypoint (not only server.app.ts).
app.get(["/api/mcp", "/api/mcp/sse"], async (req, res) => {
  return handleMCPSseStream(req, res);
});

app.post(["/api/mcp", "/api/mcp/sse"], async (req, res) => {
  return handleMCPDirectPost(req, res);
});

app.post("/api/mcp/messages", async (req, res) => {
  return handleMCPPostMessage(req, res);
});

app.delete("/api/mcp", async (req, res) => {
  return handleStreamableMethodNotAllowed(req, res);
});

// Chat completions proxy using Gemini API
import { GoogleGenAI } from "@google/genai";

app.post([/.*\/chat\/completions$/, "/api/openai/v1/chat/completions", "/openai/v1/chat/completions"], async (req, res) => {
  if (rateLimit(req, res, 20)) return;
  if (Number.isInteger(req.body?.max_tokens)) req.body.max_tokens = Math.min(2048, Math.max(1, req.body.max_tokens));
  const messagesForCap = Array.isArray(req.body?.messages) ? req.body.messages : [];
  if (messagesForCap.length > 20 || messagesForCap.some((message: { content?: unknown }) => JSON.stringify(message?.content ?? '').length > 8000)) {
    return res.status(413).json({ error: '메시지가 너무 깁니다.', code: 'BODY_TOO_LARGE' });
  }
  const geminiApiKey = getGeminiApiKey();
  if (!geminiApiKey) {
    return res.status(503).json({ error: "GEMINI_API_KEY가 설정되지 않았습니다.", code: "GEMINI_API_KEY_MISSING" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    const rawRequestedModel = req.body.model || "gemini-flash-lite-latest";
    const model = (rawRequestedModel === "gemini-4-argon" || rawRequestedModel.includes("argon") || rawRequestedModel.includes("2.5") || rawRequestedModel.includes("2.0"))
      ? "gemini-flash-lite-latest"
      : rawRequestedModel;
    const messages = req.body.messages || [];
    // Preserve the full conversational context instead of forwarding only the last user turn.
    // The Gemini API uses "model" where OpenAI-compatible callers use "assistant".
    const extractText = (c: any) => {
      if (typeof c === "string") return c;
      if (Array.isArray(c)) {
        return c.map((p: any) => (typeof p === "string" ? p : p?.text || "")).join(" ");
      }
      return "";
    };

    const systemPrompt = messages
      .filter((m: any) => m.role === "system")
      .map((m: any) => extractText(m.content))
      .filter(Boolean)
      .join("\n");
    const contents = messages
      .filter((m: any) => (m.role === "user" || m.role === "assistant" || m.role === "model"))
      .map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: extractText(m.content) }]
      }))
      .filter((m: any) => m.parts[0].text.trim().length > 0);
    if (!contents.length || contents[contents.length - 1].role !== "user") {
      return res.status(400).json({ error: "A final user message is required" });
    }

    const generationConfig = { ...(systemPrompt ? { systemInstruction: systemPrompt } : {}), ...(Number.isInteger(req.body.max_tokens) ? { maxOutputTokens: Math.min(2048, Math.max(1, req.body.max_tokens)) } : { maxOutputTokens: 1024 }) };
    const { response, modelUsed } = await requestWithModelFallback(
      model,
      getLucyRequestFallbacks(model, req.body.review_mode),
      (candidate, signal) => ai.models.generateContent({ model: candidate, contents, config: { ...generationConfig, ...(signal ? { abortSignal: signal } : {}) } }),
      { attemptTimeoutMs: req.body.review_mode === 'general' ? 25000 : 15000 },
    );

    const replyText = response.text || "";

    if (req.body.stream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const chunk = {
        id: "chatcmpl-" + Date.now(),
        object: "chat.completion.chunk",
        created: Math.floor(Date.now() / 1000),
        model: modelUsed,
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
        model: modelUsed,
        choices: [{ index: 0, message: { role: "assistant", content: replyText }, finish_reason: "stop" }]
      });
    }
  } catch (err: any) {
    console.error("Gemini completion proxy error:", describeGeminiError(err));
    const status = Number(err?.status);
    if (status === 429) return res.status(429).json({ error: 'AI 제공자의 사용 한도에 도달했습니다. 잠시 후 다시 시도하거나 연결된 Gemini 프로젝트의 할당량을 확인해 주세요.', code: 'AI_QUOTA_EXCEEDED' });
    return res.status(status === 503 ? 503 : 500).json({ error: 'AI 응답을 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.', code: 'AI_PROVIDER_UNAVAILABLE' });
  }
});

// TTS generation endpoint backed by server-only Edge Neural TTS.
// Load TTS dependencies only when the TTS route is invoked.

app.post("/api/ai/tts", async (req, res) => {
  const { text, voice = "Aoede", emotion, rate, speed, pitch } = req.body || {};
  if (!text) {
    return res.status(400).json({ error: "Empty speech text" });
  }

  try {
    const { handleTTS } = await import("../server/api-lib/ttsHandler.ts");
    const result = await handleTTS({ text, voice, emotion, rate, speed, pitch, requestId: req.get("x-vercel-id") || undefined });
    return res.status(200).json(result);
  } catch (err: any) {
    const retryAfter = Number(err?.retryAfterSeconds);
    const hasRetry = Number.isFinite(retryAfter) && retryAfter > 0;
    if (hasRetry) res.setHeader("Retry-After", String(Math.ceil(retryAfter)));
    if (err?.diagnosticId) res.setHeader("X-TTS-Diagnostic-ID", err.diagnosticId);
    return res.status(err?.status || 500).json({ error: err.message || "Failed to generate TTS", ...(err?.code ? { code: err.code } : {}), ...(hasRetry ? { retryAfterSeconds: Math.ceil(retryAfter) } : {}), ...(err?.diagnosticId ? { diagnosticId: err.diagnosticId } : {}) });
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

  const geminiApiKey = getGeminiApiKey();
  if (geminiApiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });
      const analyzed = await requestDiaryAnalysis(async (plain) => {
        const response = await ai.models.generateContent({
          model: 'gemini-flash-lite-latest',
          contents: plain ? `${prompt}\n\nJSON 객체만 반환하세요. 키는 keywords와 emotions 입니다.` : prompt,
          config: {
            maxOutputTokens: 512,
            abortSignal: AbortSignal.timeout(8000),
            ...(plain ? {} : { responseMimeType: 'application/json' }),
          },
        });
        return { text: response.text };
      });
      return res.status(200).json(analyzed);
    } catch (err) {
      console.warn('[analyze-entry] Gemini failed, using heuristic:', describeGeminiError(err));
      return res.status(200).json(heuristicDiaryAnalysis(String(content || title || '')));
    }
  }
  console.warn('[analyze-entry] GEMINI_API_KEY is unset');
  return res.status(503).json({ error: 'GEMINI_API_KEY가 설정되지 않았습니다.', code: 'GEMINI_API_KEY_MISSING' });
});

// 데일리 카드 전용 BGM 생성 (시드 기반 고유 WAV)
app.post("/api/ai/daily-bgm", async (req, res) => {
  try {
    const {
      focusPlaylist,
      cardName,
      symbol,
      dateKey,
      trackKey,
    } = req.body || {};

    if (!focusPlaylist || !dateKey || !trackKey) {
      return res.status(400).json({ error: "focusPlaylist, dateKey, trackKey are required" });
    }

    const { generateDailyBgmBuffer } = await import("../server/api-lib/generateDailyBgm.ts");
    const { buffer, durationSec } = generateDailyBgmBuffer({
      focusPlaylist: String(focusPlaylist),
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
    const { buildDailyArtRecommendation } = await import("../server/api-lib/recommendArt.ts");
    const result = await buildDailyArtRecommendation(req.body || {});
    return res.status(200).json(result);
  } catch (err: unknown) {
    console.error("[recommend-art] error:", err);
    const { buildVerifiedArtRecommendation } = await import("../server/api-lib/museArtCatalog.ts");
    const dateKey = String(req.body?.dateKey || new Date().toLocaleDateString("sv"));
    return res.status(200).json(
      buildVerifiedArtRecommendation(dateKey, String(req.body?.currentMood || ""), req.body?.moodId),
    );
  }
});

async function canAccessServerVault(authorization: string | undefined, uid: string): Promise<boolean> {
  const token = authorization?.match(/^Bearer (\S+)$/i)?.[1];
  if (!token) return false;
  const firebaseConfig = JSON.parse(readFileSync(new URL("../firebase-applet-config.json", import.meta.url), "utf8"));
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: token }),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) return false;
  const { users } = await response.json();
  const user = users?.[0];
  if (!user?.localId || user.disabled) return false;
  return user.localId === uid || (
    uid === "master_modele6777" && user.emailVerified === true && user.email?.toLowerCase() === "modele6777@gmail.com"
  );
}

// Universal Cloud Sync & Pairing Code Relay Endpoints
app.post("/api/sync/vault/push", async (req, res) => {
  res.set("Cache-Control", "private, no-store");
  try {
    const { uid, payload } = req.body || {};
    if (typeof uid !== "string" || !uid || !payload) return res.status(400).json({ error: "Missing uid or payload" });
    if (!(await canAccessServerVault(req.get("Authorization"), uid))) {
      return res.status(401).json({ error: "Vault authentication required" });
    }
    const { saveVaultData } = await import("../server/api-lib/syncRelay.ts");
    const result = saveVaultData(uid, payload);
    return res.status(200).json({ success: result.success, updatedAt: result.updatedAt, etag: result.etag });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

app.get("/api/sync/vault/pull/:uid", async (req, res) => {
  res.set("Cache-Control", "private, no-store");
  res.vary("Authorization");
  res.vary("If-None-Match");
  try {
    const { uid } = req.params;
    const { getVaultData, ifNoneMatchMatches } = await import("../server/api-lib/syncRelay.ts");
    if (!(await canAccessServerVault(req.get("Authorization"), uid))) {
      return res.status(401).json({ error: "Vault authentication required" });
    }
    const result = getVaultData(uid);
    const body = JSON.stringify({ success: result.success, data: result.data, updatedAt: result.updatedAt });
    const representationBytes = Buffer.byteLength(body, "utf8");
    const vaultDataBytes = result.success ? result.payloadBytes || 0 : 0;
    const recordTransfer = (status: number, responseBodyBytes: number) => {
      res.once("finish", () => {
        console.info("[sync-vault-pull]", JSON.stringify({ status, responseBodyBytes, representationBytes, vaultDataBytes }));
      });
    };

    if (result.success && result.etag) {
      res.set("ETag", result.etag);
      if (ifNoneMatchMatches(req.get("If-None-Match"), result.etag)) {
        recordTransfer(304, 0);
        return res.status(304).end();
      }
    }

    recordTransfer(200, representationBytes);
    return res
      .status(200)
      .type("application/json")
      .set("Content-Length", String(representationBytes))
      .send(body);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

app.post("/api/sync/relay/create", async (req, res) => {
  try {
    const { payload, vaultId } = req.body || {};
    if (!payload) return res.status(400).json({ error: "Missing payload" });
    const { createRelayCode } = await import("../server/api-lib/syncRelay.ts");
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
    const { getRelayData } = await import("../server/api-lib/syncRelay.ts");
    const result = await getRelayData(code);
    return res.status(200).json(result);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

app.post("/api/saju/chart", async (req, res) => {
  return handleSajuChartPost(req, res);
});

app.post("/api/ai/daily-tarot", async (req, res) => {
  return handleDailyTarotPost(req, res);
});

app.post("/api/ai/secret-blessing", async (req, res) => handleSecretBlessingPost(req, res));
app.post("/api/ai/secret-mood-recommend", async (req, res) => handleSecretMoodPost(req, res));

app.get(["/api/health", "/health"], (_req, res) => res.json({ status: "ok" }));

export default app;

import type { Response } from "express";

export default async function handler(req: { method?: string; body?: unknown; query?: Record<string, unknown> }, res: Response) {
  try {
    // 정적 import 대신 지연 import를 쓰면, 의존 모듈 초기화 실패가 함수 전체의
    // FUNCTION_INVOCATION_FAILED(빈 500)로 변하지 않고 JSON 오류로 잡힙니다.
    const { applyCors } = await import("../../server/api-lib/cors.ts");
    applyCors(res);
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    // 🔧 임시 진단 프로브 (배포 확인 후 제거 예정): GET ?probe=juhyeong-tts-probe
    if (req.method === "GET" && req.query?.probe === "juhyeong-tts-probe") {
      const probeText = String(req.query.text || "안녕하세요, 신경망 음성 진단 프로브입니다.");
      const probeTimeout = Math.max(3000, Math.min(20000, Number(req.query.timeout) || 6000));
      try {
        const { probeEdgeNeuralVariants } = await import("../../server/api-lib/edgeTts.ts");
        const variants = await probeEdgeNeuralVariants(probeText, probeTimeout);
        return res.status(200).json({ probe: "done", variants });
      } catch (probeErr: unknown) {
        return res.status(200).json({
          probe: "failed",
          error: probeErr instanceof Error ? probeErr.message : String(probeErr),
          stack: String((probeErr as Error)?.stack || "").slice(0, 800),
        });
      }
    }
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    let body = req.body as any;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (_) {}
    } else if (Buffer.isBuffer(body)) {
      try {
        body = JSON.parse(body.toString("utf-8"));
      } catch (_) {}
    }
    body = body || {};

    const text = String(body.text || "");
    const voice = body.voice ? String(body.voice) : undefined;
    const emotion = body.emotion ? String(body.emotion) : undefined;
    const rate = body.rate ? String(body.rate) : undefined;
    const pitch = body.pitch ? String(body.pitch) : undefined;
    const speed = typeof body.speed === "number" ? body.speed : undefined;
    const language = body.language ? String(body.language) : undefined;

    if (!text.trim()) {
      return res.status(400).json({ error: "Empty speech text" });
    }

    const { handleTTS } = await import("../../server/api-lib/ttsHandler.ts");
    const result = await handleTTS({ text, voice, emotion, rate, pitch, speed, language });
    return res.status(200).json(result);
  } catch (err: unknown) {
    console.error("[ai/tts] Vercel error:", err);
    const message = err instanceof Error ? err.message : "TTS generation failed";
    const failure = err as { status?: number; code?: string; retryAfterSeconds?: number };
    const retryAfter = Number(failure?.retryAfterSeconds);
    const hasRetry = Number.isFinite(retryAfter) && retryAfter > 0;
    if (hasRetry) res.setHeader("Retry-After", String(Math.ceil(retryAfter)));
    return res.status(failure?.status || 500).json({
      error: message,
      // 모듈 초기화·번들 오류를 원격에서도 추적할 수 있도록 요약 스택을 함께 반환합니다.
      detail: message || String(err),
      stack: String((err as Error)?.stack || "").slice(0, 600),
      ...(failure?.code ? { code: failure.code } : {}),
      ...(hasRetry ? { retryAfterSeconds: Math.ceil(retryAfter) } : {}),
    });
  }
}

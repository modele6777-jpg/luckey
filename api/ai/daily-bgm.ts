import type { Response } from "express";
import {
  dailyBgmFormat,
  isDailyBgmParamError,
  readDailyBgmParams,
  replyDailyBgm,
} from "../../server/api-lib/dailyBgmRoute.ts";

type DailyBgmRequest = {
  method?: string;
  body?: unknown;
  query?: Record<string, unknown>;
};

export default async function handler(req: DailyBgmRequest, res: Response) {
  // ACAO는 상수값(*)이라 `Vary: Origin` 없이도 캐시 키가 오염되지 않습니다.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Expose-Headers", "X-BGM-Encoding, X-BGM-Duration-Sec");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const method = (req.method || "GET").toUpperCase();

  try {
    // GET/HEAD: 쿼리 파라미터만으로 결정되는 바이너리 WAV → Edge CDN 캐시 대상.
    if (method === "GET" || method === "HEAD") {
      const params = readDailyBgmParams(req.query);
      if (isDailyBgmParamError(params)) {
        res.setHeader("Cache-Control", "no-store");
        return res.status(400).json(params);
      }
      return await replyDailyBgm(res, params, dailyBgmFormat(req.query, method));
    }

    if (method !== "POST") {
      res.setHeader("Allow", "GET, HEAD, POST, OPTIONS");
      return res.status(405).json({ error: "Method not allowed" });
    }

    // POST: 기존 base64 JSON 응답을 그대로 유지(하위 호환). 요청 시 바이너리도 가능.
    const body = (req.body || {}) as Record<string, unknown>;
    const params = readDailyBgmParams({ ...body, ...(req.query || {}) });
    if (isDailyBgmParamError(params)) {
      return res.status(400).json(params);
    }
    return await replyDailyBgm(res, params, dailyBgmFormat(req.query, method));
  } catch (err: unknown) {
    console.error("[ai/daily-bgm] error:", err);
    const message = err instanceof Error ? err.message : "Daily BGM generation failed";
    res.setHeader("Cache-Control", "no-store");
    return res.status(500).json({ error: message });
  }
}

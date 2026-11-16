import type { Response } from "express";

/**
 * 📉 데일리 BGM 전송량 절감용 공용 라우트 (v1.7.622)
 *
 * 기존 `POST /api/ai/daily-bgm`은 48초 스테레오 WAV(약 8.1MB)를 base64 JSON으로
 * 감싸 돌려주어 호출마다 +33% 오버헤드가 붙었고, POST라서 Vercel Edge CDN 캐시를
 * 전혀 타지 못해 매 호출이 Fast Origin Transfer로 집계됐습니다.
 *
 * 이제 `GET /api/ai/daily-bgm?...&format=wav`가 결정론적 트랙(트랙키+날짜+무드가
 * 같으면 항상 같은 바이트)을 **바이너리 audio/wav**로 돌려주고
 * `Cache-Control: public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400`
 * 를 실어 보내 Edge CDN이 원본 소스 대신 캐시 사본을 제공합니다.
 *
 * 응답 조건(Vercel CDN 캐시 가능 조건)을 깨지 않도록 주의:
 * - GET/HEAD, 200, Set-Cookie 없음, `Vary: *`/`Vary: Cookie` 없음
 * - 본문 10MB 미만 (48초 44.1kHz 스테레오 16bit = 약 8.1MB)
 */

export const DAILY_BGM_CACHE_CONTROL =
  "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";
export const DAILY_BGM_JSON_CACHE_CONTROL = "public, max-age=3600, s-maxage=86400";

export type DailyBgmParams = {
  focusPlaylist: string;
  dateKey: string;
  trackKey: string;
  cardName?: string;
  symbol?: string;
};

export type DailyBgmParamSource = Record<string, unknown> | undefined | null;

const LIMITS = {
  focusPlaylist: 200,
  dateKey: 40,
  trackKey: 300,
  cardName: 120,
  symbol: 120,
} as const;

function text(value: unknown, max: number): string {
  if (typeof value !== "string" && typeof value !== "number") return "";
  // 헤더·캐시 키를 오염시킬 수 있는 제어문자는 걸러냅니다.
  return String(value).replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, max);
}

/** 쿼리스트링과 JSON 본문 어느 쪽에서 와도 같은 규칙으로 입력을 검증합니다. */
export function readDailyBgmParams(source: DailyBgmParamSource): DailyBgmParams | { error: string } {
  const raw = source && typeof source === "object" ? source : {};
  const focusPlaylist = text(raw.focusPlaylist, LIMITS.focusPlaylist);
  const dateKey = text(raw.dateKey, LIMITS.dateKey);
  const trackKey = text(raw.trackKey, LIMITS.trackKey);
  if (!focusPlaylist || !dateKey || !trackKey) {
    return { error: "focusPlaylist, dateKey, trackKey are required" };
  }
  return {
    focusPlaylist,
    dateKey,
    trackKey,
    cardName: text(raw.cardName, LIMITS.cardName) || undefined,
    symbol: text(raw.symbol, LIMITS.symbol) || undefined,
  };
}

export function isDailyBgmParamError(value: DailyBgmParams | { error: string }): value is { error: string } {
  return typeof (value as { error?: unknown }).error === "string";
}

/** `format=json|wav|binary|audio` — GET은 기본이 바이너리 WAV입니다. */
export function dailyBgmFormat(query: Record<string, unknown> | undefined, method: string | undefined): "json" | "binary" {
  const requested = text(query?.format, 16).toLowerCase();
  if (requested === "json") return "json";
  if (requested) return "binary";
  return method === "POST" ? "json" : "binary";
}

export function sendDailyBgmJson(
  res: Response,
  params: DailyBgmParams,
  audio: { buffer: Buffer; durationSec: number },
): void {
  res.setHeader("Cache-Control", DAILY_BGM_JSON_CACHE_CONTROL);
  res.status(200).json({
    audioContent: audio.buffer.toString("base64"),
    encoding: "wav",
    sampleRate: 44100,
    trackKey: params.trackKey,
    durationSec: audio.durationSec,
  });
}

export function sendDailyBgmBinary(
  res: Response,
  audio: { buffer: Buffer; durationSec: number },
): void {
  const bytes = audio.buffer;
  res.setHeader("Content-Type", "audio/wav");
  res.setHeader("Content-Length", String(bytes.length));
  res.setHeader("Cache-Control", DAILY_BGM_CACHE_CONTROL);
  res.setHeader("X-BGM-Encoding", "wav");
  res.setHeader("X-BGM-Duration-Sec", String(audio.durationSec));
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.status(200).end(bytes);
}

/** 검증된 파라미터로 WAV를 만들고 요청한 형식으로 돌려줍니다. */
export async function replyDailyBgm(
  res: Response,
  params: DailyBgmParams,
  mode: "json" | "binary",
): Promise<void> {
  const { generateDailyBgmBuffer } = await import("./generateDailyBgm.ts");
  const audio = generateDailyBgmBuffer(params);
  if (mode === "binary") sendDailyBgmBinary(res, audio);
  else sendDailyBgmJson(res, params, audio);
}

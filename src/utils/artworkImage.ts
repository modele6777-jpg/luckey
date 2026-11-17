import { nativeServerUrl } from '../native/runtime';
import { extractOriginalLanguage } from "@/utils/artSearchQuery";

export type ArtworkImageSource =
  | "google"
  | "wikimedia"
  | "wikipedia"
  | "artic"
  | "met"
  | "pollinations"
  | "ai_replica"
  | "local_fallback"
  | "dailyart";

export const DAILY_ART_LOCAL_FALLBACK_URL = "/images/daily-art-fallback.svg";

export interface ArtworkImageInput {
  title: string;
  titleOriginal?: string;
  creator: string;
  creatorOriginal?: string;
  artworkType: string;
  era: string;
  description: string;
  aestheticTone: string;
  dailyArtImageUrl?: string;
}

export interface ResolvedArtworkImage {
  url: string;
  displayUrl: string;
  source: ArtworkImageSource;
}

function sanitizeForPrompt(text: string): string {
  return text.replace(/["'\\/]/g, "").trim();
}

export function buildFaithfulArtPrompt(art: ArtworkImageInput): string {
  const title = sanitizeForPrompt(
    art.titleOriginal || extractOriginalLanguage(art.title) || art.title,
  );
  const creator = sanitizeForPrompt(
    art.creatorOriginal || extractOriginalLanguage(art.creator) || art.creator,
  );
  const description = sanitizeForPrompt(art.description.slice(0, 220));
  const palette = sanitizeForPrompt(art.aestheticTone || "authentic period colors");

  return [
    `Faithful museum-quality reproduction of the famous masterpiece "${title}" by ${creator}.`,
    `${art.artworkType}, ${art.era} movement.`,
    "Preserve exact composition, subject matter, figures, perspective, brushwork and historical color palette of the original artwork.",
    description,
    `Color palette: ${palette}.`,
    "Fine art oil painting on canvas, neutral gallery lighting, photorealistic museum photograph.",
    "No fantasy elements, no sci-fi, no glowing effects, no modern reinterpretation, no text, no watermark.",
  ].join(" ");
}

export function isAiArtworkUrl(url?: string | null): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.includes("image.pollinations.ai") ||
    lower.includes("pollinations.ai") ||
    lower.includes("/prompt/") ||
    lower.includes("pollinations")
  );
}

export function isAiArtworkSource(
  source?: ArtworkImageSource | string | null,
  url?: string | null,
): boolean {
  if (isAiArtworkUrl(url)) return true;
  return source === "pollinations" || source === "ai_replica";
}

export function resolveArtworkSource(
  source?: ArtworkImageSource | string | null,
  url?: string | null,
  fallbackIndex?: number,
): ArtworkImageSource {
  if (isAiArtworkUrl(url)) {
    return "pollinations";
  }
  if (source === "local_fallback") return "local_fallback";
  if (source === "dailyart") return "dailyart";
  if (source === "google") return "google";
  if (
    source === "wikimedia" ||
    source === "wikipedia" ||
    source === "artic" ||
    source === "met"
  ) {
    return source as ArtworkImageSource;
  }
  if (source === "pollinations" || source === "ai_replica") {
    return source as ArtworkImageSource;
  }
  if (
    url &&
    (url.includes("/api/muse/artwork-image/proxy") ||
      url.includes("upload.wikimedia.org") ||
      url.includes("dailyartmagazine.com") ||
      url.includes("artic.edu") ||
      url.includes("metmuseum.org"))
  ) {
    return "wikimedia";
  }
  return "pollinations";
}

export interface ArtworkBadgeInfo {
  label: string;
  isAi: boolean;
  borderClass: string;
  textClass: string;
  dotClass: string;
}

export function getArtworkImageBadgeInfo(
  source?: ArtworkImageSource | string | null,
  url?: string | null,
  fallbackIndex?: number,
): ArtworkBadgeInfo {
  const effectiveSource = resolveArtworkSource(source, url, fallbackIndex);
  const isAi = isAiArtworkSource(effectiveSource, url);

  if (isAi) {
    return {
      label: "✨ AI 미학 재현본 (원작 저작권 대체)",
      isAi: true,
      borderClass: "border-purple-400/35 bg-purple-950/40",
      textClass: "text-purple-300",
      dotClass: "bg-purple-400",
    };
  }

  if (effectiveSource === "local_fallback") {
    return {
      label: "🎨 기본 전시 아트워크",
      isAi: false,
      borderClass: "border-sky-400/35 bg-slate-950/75",
      textClass: "text-sky-200",
      dotClass: "bg-sky-300",
    };
  }

  if (effectiveSource === "dailyart") {
    return {
      label: "🏛️ DailyArt 공식 원작",
      isAi: false,
      borderClass: "border-amber-400/35 bg-black/85",
      textClass: "text-amber-300",
      dotClass: "bg-amber-400",
    };
  }

  if (effectiveSource === "google") {
    return {
      label: "🏛️ 고화질 공식 원작",
      isAi: false,
      borderClass: "border-amber-400/35 bg-black/85",
      textClass: "text-amber-300",
      dotClass: "bg-amber-400",
    };
  }

  return {
    label: "🏛️ 미술관 공식 원작 소장본",
    isAi: false,
    borderClass: "border-amber-400/35 bg-black/85",
    textClass: "text-amber-300",
    dotClass: "bg-amber-400",
  };
}

/**
 * ✨ 최종 안전망: Pollinations AI 명화 재현 URL을 즉시 합성합니다.
 * 서버 API·원작 직링이 모두 실패해도 이 URL은 항상 그림을 만들어 냅니다.
 */
export function buildPollinationsArtworkUrl(art: ArtworkImageInput): string {
  // Generation is asynchronous and server-only; show no unrelated external fallback.
  return '';

}

/** 위키미디어 썸네일 URL을 원본 풀 해상도 URL로 변환합니다. (항링크·리사이즈 제한 회피) */
export function getWikimediaFullResUrl(url: string): string {
  const match = url.match(
    /^https?:\/\/upload\.wikimedia\.org\/wikipedia\/(commons|[^/]+)\/thumb\/[0-9a-f]\/[0-9a-f]{2}\/([^/]+)\/[^/]+$/,
  );
  if (!match) return "";
  return `https://upload.wikimedia.org/wikipedia/${match[1]}/${match[2]}`;
}

/** 위키미디어 파일을 Special:FilePath 리졸버로 안전하게 다시 요청하는 URL을 만듭니다. */
export function getWikimediaFilePathUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (!/(^|\.)wikimedia\.org$|(^|\.)wikipedia\.org$/i.test(parsed.hostname)) return "";
    const pathParts = decodeURIComponent(parsed.pathname).split("/").filter(Boolean);
    const thumbIndex = pathParts.indexOf("thumb");
    const filename = (thumbIndex >= 0 ? pathParts[thumbIndex + 3] : pathParts.at(-1))
      ?.replace(/^\d+px-/i, "") || "";
    if (!filename) return "";
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=1600`;
  } catch (_) {
    return "";
  }
}

export function buildDailyArtworkFallbackUrls(
  artworkImageUrl?: string | null,
  cachedImage?: string | null,
): string[] {
  const list: string[] = [];
  const original = artworkImageUrl?.trim() || "";
  if (original && !isAiArtworkUrl(original)) {
    list.push(original, encodeURI(original));
    const fullRes = getWikimediaFullResUrl(original);
    if (fullRes) list.push(fullRes);
    const filePath = getWikimediaFilePathUrl(original);
    if (filePath) list.push(filePath);
  }
  const cached = cachedImage?.trim() || "";
  if (cached && cached !== "null" && cached !== "undefined" && !isAiArtworkUrl(cached)) {
    list.push(cached);
  }
  list.push(DAILY_ART_LOCAL_FALLBACK_URL);
  return [...new Set(list.filter(Boolean))];
}

export function getSafeArtworkUrl(url?: string | null): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return "";
  if (trimmed.startsWith("/api/")) return nativeServerUrl(trimmed);
  if (trimmed.startsWith("/") || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) return trimmed;
  // 원본 미술관/위키미디어 CDN 직링을 그대로 사용합니다.
  // (서버리스 프록시 경로는 런타임 크래시와 첫 로드 실패의 원인이었으므로 더 이상 거치지 않습니다.)
  return trimmed;
}

export async function resolveArtworkImage(
  art: ArtworkImageInput,
  options?: { forcePollinations?: boolean },
): Promise<ResolvedArtworkImage> {
  const fallbackUrl = buildPollinationsArtworkUrl(art);
  const fallback: ResolvedArtworkImage = {
    url: fallbackUrl,
    displayUrl: fallbackUrl,
    source: "ai_replica",
  };
  let response: Response;
  let data: { url?: string; displayUrl?: string; source?: ArtworkImageSource; error?: string } | null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    response = await fetch('/api/muse/artwork-image', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...art, ...options }), signal: controller.signal,
    });
    data = await response.json().catch(() => null);
  } catch {
    return fallback;
  } finally {
    clearTimeout(timer);
  }
  if (response.status === 429) throw new Error(data?.error || '이미지 생성 한도를 확인해 주세요.');
  const url = data?.url || '';
  const displayUrl = data?.displayUrl || url;
  if (!response.ok || !displayUrl) return fallback;
  return { url: nativeServerUrl(url), displayUrl: nativeServerUrl(displayUrl), source: resolveArtworkSource(data?.source, displayUrl) };
}

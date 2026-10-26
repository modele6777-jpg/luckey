import { extractOriginalLanguage } from "@/utils/artSearchQuery";

export type ArtworkImageSource =
  | "google"
  | "wikimedia"
  | "wikipedia"
  | "artic"
  | "met"
  | "pollinations"
  | "ai_replica"
  | "dailyart";

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

export function getSafeArtworkUrl(url?: string | null): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return "";
  if (trimmed.startsWith("/") || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) return trimmed;
  if (isAiArtworkUrl(trimmed)) return trimmed;
  // Proxy external museum / CDN archives (DailyArt, Wikimedia, Met, ArtIC) to bypass anti-hotlinking and CORS blocks
  return `/api/muse/artwork-image/proxy?url=${encodeURIComponent(trimmed)}`;
}

export async function resolveArtworkImage(
  art: ArtworkImageInput,
  options?: { forcePollinations?: boolean },
): Promise<ResolvedArtworkImage> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 65000);
  let received = false;
  try {
    const response = await fetch('/api/muse/artwork-image', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...art, ...options }), signal: controller.signal,
    });
    received = true;
    let data: { url?: string; displayUrl?: string; source?: ArtworkImageSource; error?: string };
    try { data = await response.json(); }
    catch { throw new Error('작품 이미지 응답을 읽지 못했습니다. 다시 시도해 주세요.'); }
    if (!response.ok || (!data.url && !data.displayUrl)) throw new Error(data.error || '작품 이미지를 불러오지 못했습니다. 다시 시도해 주세요.');
    const url = data.url || '';
    const displayUrl = data.displayUrl || url;
    return { url, displayUrl, source: resolveArtworkSource(data.source, displayUrl || url) };
  } catch (error) {
    if (controller.signal.aborted) throw new Error('이미지 요청 시간이 초과되었습니다. 다시 시도해 주세요.');
    if (!received) throw new Error('이미지 서버에 연결하지 못했습니다. 연결을 확인해 주세요.');
    throw error;
  } finally { clearTimeout(timer); }
}

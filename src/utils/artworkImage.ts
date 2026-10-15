import { getDateSeed } from "@/lib/dailyCache";
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
  if (isAiArtworkUrl(url) || (typeof fallbackIndex === "number" && fallbackIndex >= 2)) {
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
  const isAi = isAiArtworkSource(effectiveSource, url) || (typeof fallbackIndex === "number" && fallbackIndex >= 2);

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

export function buildPollinationsArtUrl(
  art: ArtworkImageInput,
  width = 1024, height = 768,
): string {
  const prompt = buildFaithfulArtPrompt(art);
  const seed = getDateSeed(`muse_art_${art.title}_${art.creator}`);
  const trimmed = prompt.slice(0, 1400);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(trimmed)}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=turbo`;
}

export async function resolveArtworkImage(
  art: ArtworkImageInput,
  options?: { forcePollinations?: boolean },
): Promise<ResolvedArtworkImage> {
  try {
    const response = await fetch("/api/muse/artwork-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...art, ...options }),
    });

    const raw = await response.text();
    let data: { url?: string; displayUrl?: string; source?: ArtworkImageSource; error?: string } = {};
    try {
      data = JSON.parse(raw);
    } catch {
      const fallbackUrl = buildPollinationsArtUrl(art, 1024, 768);
      return { url: fallbackUrl, displayUrl: fallbackUrl, source: "pollinations" };
    }

    if (!response.ok || (!data.url && !data.displayUrl)) {
      const fallbackUrl = buildPollinationsArtUrl(art, 1024, 768);
      return { url: fallbackUrl, displayUrl: fallbackUrl, source: "pollinations" };
    }

    const resolvedUrl = data.url || "";
    const resolvedDisplayUrl = data.displayUrl || data.url || "";
    const resolvedSource = resolveArtworkSource(data.source, resolvedDisplayUrl || resolvedUrl);

    return {
      url: resolvedUrl,
      displayUrl: resolvedDisplayUrl,
      source: resolvedSource,
    };
  } catch {
    const fallbackUrl = buildPollinationsArtUrl(art, 1024, 768);
    return {
      url: fallbackUrl,
      displayUrl: fallbackUrl,
      source: "pollinations",
    };
  }
}
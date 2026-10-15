import type { Response } from "express";
import { getXaiApiKey } from "./xaiKey";
import { buildOriginalSearchQuery, extractOriginalLanguage } from "../_shared/artSearchQuery";
import { getDateSeed } from "../_shared/dailyCache";

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

const ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const GROK_VISION_MODELS = [
  process.env.XAI_VISION_MODEL || "grok-2-vision-1212",
  process.env.XAI_MODEL || "grok-4.3",
  "grok-4.20",
  "grok-3",
];

const BLOCKED_TITLE_PATTERNS = [
  "logo",
  "icon",
  "seal",
  "emblem",
  "signature",
  "stamp",
  "banner",
  "map",
  "diagram",
  "chart",
  "coat of arms",
  "detail of",
  "list of",
  "museum logo",
  "gallery logo",
  "photograph of",
  "photo of",
  ".svg",
  ".tif",
  ".tiff",
  ".pdf",
  ".djvu",
];

interface ImageCandidate {
  score: number;
  url: string;
  width?: number;
  height?: number;
  origin: "google" | "wikimedia" | "wikipedia";
}

function getGoogleCseConfig(): { apiKey: string; cx: string } {
  return {
    apiKey: (
      process.env.GOOGLE_CSE_API_KEY
      || process.env.GOOGLE_API_KEY
      || process.env.GEMINI_API_KEY
      || process.env.GOOGLE_GENAI_API_KEY
      || ""
    ).trim(),
    cx: (process.env.GOOGLE_CSE_ID || process.env.GOOGLE_CSE_CX || "").trim(),
  };
}

function isPrivateOrLocalHost(host: string): boolean {
  const lower = host.toLowerCase();
  if (lower === "localhost" || lower === "127.0.0.1" || lower === "::1") return true;
  if (lower.endsWith(".local")) return true;
  if (/^10\.\d+\.\d+\.\d+$/.test(lower)) return true;
  if (/^192\.168\.\d+\.\d+$/.test(lower)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(lower)) return true;
  return false;
}

function sanitizeForPrompt(text: string): string {
  return text.replace(/["'\\/]/g, "").trim();
}

function buildArtSearchQuery(art: ArtworkImageInput): string {
  return buildOriginalSearchQuery(
    art.title,
    art.creator,
    art.titleOriginal,
    art.creatorOriginal,
  );
}

function buildSearchQueries(art: ArtworkImageInput): string[] {
  const primary = buildArtSearchQuery(art);
  const title = art.titleOriginal || extractOriginalLanguage(art.title) || art.title;
  const creator = art.creatorOriginal || extractOriginalLanguage(art.creator) || art.creator;

  return [...new Set([
    primary,
    `${title} ${creator}`,
    `${title} by ${creator}`,
    `${title} ${creator} painting`,
    art.title,
  ].map((q) => q.replace(/\s+/g, " ").trim()).filter(Boolean))];
}

function normalizeArtworkText(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\u3131-\uD79D\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleKeywords(art: ArtworkImageInput): string[] {
  const raw = art.titleOriginal || extractOriginalLanguage(art.title) || art.title;
  return normalizeArtworkText(raw)
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function creatorKeywords(art: ArtworkImageInput): string[] {
  const raw = art.creatorOriginal || extractOriginalLanguage(art.creator) || art.creator;
  return normalizeArtworkText(raw)
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function isBlockedTitle(title: string, art: ArtworkImageInput): boolean {
  const lower = title.toLowerCase();
  if (BLOCKED_TITLE_PATTERNS.some((pattern) => lower.includes(pattern))) {
    return true;
  }
  if (
    lower.includes("portrait")
    && !art.title.toLowerCase().includes("portrait")
    && (lower.includes("artist") || lower.includes("photograph") || lower.includes("photo of"))
  ) {
    return true;
  }
  return false;
}

function scoreResultTitle(title: string, art: ArtworkImageInput): number {
  const normalizedTitle = normalizeArtworkText(title);
  const targetTitle = normalizeArtworkText(
    art.titleOriginal || extractOriginalLanguage(art.title) || art.title,
  );
  const targetCreator = normalizeArtworkText(
    art.creatorOriginal || extractOriginalLanguage(art.creator) || art.creator,
  );
  const lower = normalizedTitle;
  const titleWords = titleKeywords(art);
  const creatorWords = creatorKeywords(art);
  let score = 0;

  if (isBlockedTitle(title, art)) score -= 100;

  // Prefer the exact work and artist pair over loose keyword matches.
  if (targetTitle.length >= 4 && lower.includes(targetTitle)) score += 24;
  if (targetCreator.length >= 4 && lower.includes(targetCreator)) score += 16;

  const titleMatches = titleWords.filter((word) => lower.includes(word)).length;
  const creatorMatches = creatorWords.filter((word) => lower.includes(word)).length;
  score += titleMatches * 5;
  score += creatorMatches * 3;

  if (titleWords.length > 1 && titleMatches === titleWords.length) score += 10;
  if (creatorWords.length > 1 && creatorMatches === creatorWords.length) score += 8;
  if (lower.includes("painting") || lower.includes("oil on canvas")) score += 3;
  if (lower.includes("file:")) score += 1;

  return score;
}

function isDisplayableDimensions(width?: number, height?: number): boolean {
  if (!width || !height) return true;
  return width >= 320 && height >= 240;
}

function pickBestCandidate(candidates: ImageCandidate[]): ImageCandidate | null {
  const sorted = [...candidates]
    .filter((c) => c.score >= 4 && isDisplayableDimensions(c.width, c.height))
    .sort((a, b) => b.score - a.score);

  if (sorted.length > 0) return sorted[0];

  const fallback = [...candidates]
    .filter((c) => isDisplayableDimensions(c.width, c.height))
    .sort((a, b) => b.score - a.score);

  return fallback[0] || null;
}

export function buildFaithfulArtPrompt(art: ArtworkImageInput): string {
  const title = sanitizeForPrompt(
    art.titleOriginal || extractOriginalLanguage(art.title) || art.title,
  );
  const creator = sanitizeForPrompt(
    art.creatorOriginal || extractOriginalLanguage(art.creator) || art.creator,
  );
  const description = sanitizeForPrompt(art.description.slice(0, 260));
  const palette = sanitizeForPrompt(art.aestheticTone || "authentic historical museum colors");

  return [
    `Museum masterpiece photograph of "${title}" by ${creator}.`,
    `${art.artworkType}, ${art.era} movement.`,
    "Exact historical composition, master oil on canvas texture, authentic craquelure and brushstrokes.",
    description,
    `Color harmony: ${palette}.`,
    "High-resolution museum gallery display, neutral soft lighting, fine art archive quality.",
    "No modern reinterpretation, no CGI, no text, no watermark, pristine masterwork.",
  ].join(" ");
}

export function buildPollinationsArtUrl(
  art: ArtworkImageInput,
  width = 800,
  height = 600,
): string {
  return buildPollinationsUrlFromPrompt(buildFaithfulArtPrompt(art), art, width, height);
}

export function buildPollinationsUrlFromPrompt(
  prompt: string,
  art: ArtworkImageInput,
  width = 800,
  height = 600,
): string {
  const seed = getDateSeed(`muse_art_${art.title}_${art.creator}`);
  const trimmed = prompt.slice(0, 1400);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(trimmed)}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=turbo`;
}

export function isAllowedImageProxyUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;

    const host = parsed.hostname.toLowerCase();
    if (isPrivateOrLocalHost(host)) return false;

    if (
      host.endsWith(".wikimedia.org")
      || host === "upload.wikimedia.org"
      || host.endsWith(".wikipedia.org")
      || host === "image.pollinations.ai"
      || host.endsWith(".gstatic.com")
      || host.endsWith(".googleusercontent.com")
      || host === "www.dailyartmagazine.com"
      || host.endsWith(".dailyartmagazine.com")
      || host === "www.artic.edu"
      || host.endsWith(".artic.edu")
      || host === "images.metmuseum.org"
      || host.endsWith(".metmuseum.org")
    ) {
      return true;
    }

    return true;
  } catch {
    return false;
  }
}

const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const WIKIMEDIA_USER_AGENT =
  "PrismUniverse/1.0 (https://github.com/modele6777-jpg/prism; support@prism.app)";

export function normalizeWikimediaUrl(url: string): string {
  if (!url || !url.includes("upload.wikimedia.org")) return url;
  return url.replace(/\/thumb\/([^/]+)\/([^/]+)\/([^/]+)\/\d+px-/i, "/thumb/$1/$2/$3/960px-");
}

export function buildArtworkDisplayUrl(url: string, source: ArtworkImageSource): string {
  if (source === "pollinations" || source === "ai_replica") return url;
  const normalized = normalizeWikimediaUrl(url);
  return `/api/muse/artwork-image/proxy?url=${encodeURIComponent(normalized)}`;
}

async function validateImageUrl(url: string): Promise<boolean> {
  const targetUrl = normalizeWikimediaUrl(encodeURI(url));
  const isWikimedia = targetUrl.includes("wikimedia.org") || targetUrl.includes("wikipedia.org");
  const isDailyArt = targetUrl.includes("dailyartmagazine.com");
  const userAgent = isWikimedia ? WIKIMEDIA_USER_AGENT : BROWSER_USER_AGENT;
  try {
    let response = await fetch(targetUrl, {
      method: "HEAD",
      headers: {
        "User-Agent": userAgent,
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        ...(isDailyArt ? { "Referer": "https://www.dailyartmagazine.com/" } : isWikimedia ? { "Referer": "https://commons.wikimedia.org/" } : {}),
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!response.ok && response.status !== 429) {
      response = await fetch(targetUrl, {
        method: "GET",
        headers: {
          "User-Agent": userAgent,
          "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
          ...(isDailyArt ? { "Referer": "https://www.dailyartmagazine.com/" } : isWikimedia ? { "Referer": "https://commons.wikimedia.org/" } : {}),
        },
        signal: AbortSignal.timeout(8000),
      });
    }

    if (response.status === 429) {
      // Wikimedia/DailyArt rate limited HEAD/GET: URL exists and is valid
      return true;
    }

    if (!response.ok) return false;

    const rawType = response.headers.get("content-type") || "";
    const contentType = rawType.split(";")[0].trim().toLowerCase();
    if (ALLOWED_MIMES.has(contentType) || contentType.startsWith("image/")) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

async function pickValidatedCandidate(candidates: ImageCandidate[]): Promise<ImageCandidate | null> {
  const sorted = [...candidates].sort((a, b) => b.score - a.score);

  for (const candidate of sorted) {
    if (candidate.score < 4) continue;
    if (!isDisplayableDimensions(candidate.width, candidate.height)) continue;
    if (await validateImageUrl(candidate.url)) {
      return candidate;
    }
  }

  for (const candidate of sorted) {
    if (!isDisplayableDimensions(candidate.width, candidate.height)) continue;
    if (await validateImageUrl(candidate.url)) {
      return candidate;
    }
  }

  return null;
}

async function collectGoogleImageCandidates(
  searchQuery: string,
  art: ArtworkImageInput,
): Promise<ImageCandidate[]> {
  const { apiKey, cx } = getGoogleCseConfig();
  if (!apiKey || !cx) {
    console.warn("[muse/artwork-image] Google Image Search skipped: set GOOGLE_CSE_API_KEY and GOOGLE_CSE_ID");
    return [];
  }

  try {
    const q = `${searchQuery} painting masterpiece`;
    const apiUrl =
      "https://www.googleapis.com/customsearch/v1"
      + `?key=${encodeURIComponent(apiKey)}`
      + `&cx=${encodeURIComponent(cx)}`
      + "&searchType=image"
      + "&num=10"
      + "&imgSize=large"
      + "&safe=active"
      + `&q=${encodeURIComponent(q)}`;

    const res = await fetch(apiUrl, {
      headers: { "User-Agent": "PRISM-ArtworkBot/1.0" },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) {
      console.warn(`[muse/artwork-image] Google Image Search HTTP ${res.status}`);
      return [];
    }

    const data = await res.json() as {
      items?: Array<{
        title?: string;
        link?: string;
        snippet?: string;
        image?: { width?: number; height?: number; thumbnailLink?: string };
      }>;
    };

    const candidates: ImageCandidate[] = [];

    for (const item of data.items || []) {
      const imageUrl = item.link?.trim();
      if (!imageUrl || !imageUrl.startsWith("https://")) continue;

      const label = `${item.title || ""} ${item.snippet || ""}`.trim();
      if (isBlockedTitle(label, art)) continue;

      candidates.push({
        score: scoreResultTitle(label, art) + 3,
        url: imageUrl,
        width: item.image?.width,
        height: item.image?.height,
        origin: "google",
      });
    }

    return candidates;
  } catch (err) {
    console.warn("[muse/artwork-image] Google Image Search failed:", err instanceof Error ? err.message : err);
    return [];
  }
}

async function collectArticCandidates(
  searchQuery: string,
  art: ArtworkImageInput,
): Promise<ImageCandidate[]> {
  try {
    const apiUrl = `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(searchQuery)}&fields=id,title,artist_display,image_id&limit=6`;
    const res = await fetch(apiUrl, {
      headers: { "User-Agent": "PRISM-ArtworkBot/1.0" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];

    const data = await res.json();
    const items = data?.data as Array<{ id?: number; title?: string; artist_display?: string; image_id?: string }> || [];
    const candidates: ImageCandidate[] = [];

    for (const item of items) {
      if (!item.image_id) continue;
      const title = item.title || "";
      if (isBlockedTitle(title, art)) continue;

      const imageUrl = `https://www.artic.edu/iiif/2/${item.image_id}/full/1400,/0/default.jpg`;
      candidates.push({
        score: scoreResultTitle(title, art) + 4,
        url: imageUrl,
        width: 1400,
        height: 1050,
        origin: "wikimedia" as any,
      });
    }

    return candidates;
  } catch {
    return [];
  }
}

async function collectMetMuseumCandidates(
  searchQuery: string,
  art: ArtworkImageInput,
): Promise<ImageCandidate[]> {
  try {
    const searchUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${encodeURIComponent(searchQuery)}`;
    const searchRes = await fetch(searchUrl, {
      headers: { "User-Agent": "PRISM-ArtworkBot/1.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (!searchRes.ok) return [];

    const searchData = await searchRes.json();
    const ids = (searchData?.objectIDs as number[] || []).slice(0, 3);
    const candidates: ImageCandidate[] = [];

    for (const id of ids) {
      const objRes = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`, {
        headers: { "User-Agent": "PRISM-ArtworkBot/1.0" },
        signal: AbortSignal.timeout(8000),
      });
      if (!objRes.ok) continue;

      const objData = await objRes.json();
      const imageUrl = objData?.primaryImage || objData?.primaryImageSmall;
      if (!imageUrl) continue;

      const title = objData?.title || "";
      if (isBlockedTitle(title, art)) continue;

      candidates.push({
        score: scoreResultTitle(title, art) + 3,
        url: imageUrl,
        width: 1400,
        height: 1050,
        origin: "wikimedia" as any,
      });
    }

    return candidates;
  } catch {
    return [];
  }
}

async function collectCommonsCandidates(
  searchQuery: string,
  art: ArtworkImageInput,
): Promise<ImageCandidate[]> {
  try {
    const q = `${searchQuery} painting`;
    const apiUrl =
      `https://commons.wikimedia.org/w/api.php?action=query&generator=search` +
      `&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=16` +
      `&prop=imageinfo&iiprop=url|mime|thumburl&iiurlwidth=960&format=json`;

    const res = await fetch(apiUrl, {
      headers: {
        "User-Agent": BROWSER_USER_AGENT,
        "Accept": "application/json",
      },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return [];

    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return [];

    const candidates: ImageCandidate[] = [];

    for (const page of Object.values(pages) as Array<{
      title?: string;
      imageinfo?: Array<{
        mime?: string;
        thumburl?: string;
        url?: string;
        thumbwidth?: number;
        thumbheight?: number;
      }>;
    }>) {
      const info = page.imageinfo?.[0];
      if (!info) continue;

      const mime = (info.mime || "").toLowerCase();
      if (!ALLOWED_MIMES.has(mime)) continue;

      const imageUrl = info.thumburl || info.url;
      if (!imageUrl || isBlockedTitle(page.title || "", art)) continue;

      candidates.push({
        score: scoreResultTitle(page.title || "", art),
        url: imageUrl,
        width: info.thumbwidth,
        height: info.thumbheight,
        origin: "wikimedia",
      });
    }

    return candidates;
  } catch {
    return [];
  }
}

async function collectWikipediaCandidates(
  wikiHost: "en.wikipedia.org" | "ko.wikipedia.org",
  searchQuery: string,
  art: ArtworkImageInput,
): Promise<ImageCandidate[]> {
  try {
    const q = `${searchQuery} painting artwork`;
    const apiUrl =
      `https://${wikiHost}/w/api.php?action=query&generator=search` +
      `&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=0&gsrlimit=12` +
      `&prop=pageimages&piprop=thumbnail&pithumbsize=1600&format=json`;

    const res = await fetch(apiUrl, {
      headers: { "User-Agent": "PRISM-ArtworkBot/1.0" },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return [];

    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return [];

    const candidates: ImageCandidate[] = [];

    for (const page of Object.values(pages) as Array<{
      title?: string;
      thumbnail?: { source?: string; width?: number; height?: number };
    }>) {
      const imageUrl = page.thumbnail?.source;
      if (!imageUrl || isBlockedTitle(page.title || "", art)) continue;

      candidates.push({
        score: scoreResultTitle(page.title || "", art),
        url: imageUrl,
        width: page.thumbnail?.width,
        height: page.thumbnail?.height,
        origin: "wikipedia",
      });
    }

    return candidates;
  } catch {
    return [];
  }
}

async function findReferenceImage(art: ArtworkImageInput): Promise<ImageCandidate | null> {
  const queries = buildSearchQueries(art);
  const candidates: ImageCandidate[] = [];
  const topQueries = queries.slice(0, 2);

  const searchPromises = topQueries.flatMap((searchQuery) => [
    collectCommonsCandidates(searchQuery, art),
    collectWikipediaCandidates("en.wikipedia.org", searchQuery, art),
    collectWikipediaCandidates("ko.wikipedia.org", searchQuery, art),
    collectArticCandidates(searchQuery, art),
    collectMetMuseumCandidates(searchQuery, art),
    collectGoogleImageCandidates(searchQuery, art),
  ]);

  const results = await Promise.allSettled(searchPromises);
  for (const res of results) {
    if (res.status === "fulfilled" && Array.isArray(res.value)) {
      candidates.push(...res.value);
    }
  }

  return pickBestCandidate(candidates);
}

async function buildVisionReplicaPrompt(
  art: ArtworkImageInput,
  referenceUrl: string,
): Promise<string | null> {
  const apiKey = getXaiApiKey();
  if (!apiKey) return null;

  const title = sanitizeForPrompt(
    art.titleOriginal || extractOriginalLanguage(art.title) || art.title,
  );
  const creator = sanitizeForPrompt(
    art.creatorOriginal || extractOriginalLanguage(art.creator) || art.creator,
  );
  const palette = sanitizeForPrompt(art.aestheticTone || "authentic period colors");

  let lastError: unknown = null;

  for (const model of GROK_VISION_MODELS) {
    try {
      const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: { url: referenceUrl, detail: "high" },
                },
                {
                  type: "text",
                  text: [
                    `You are analyzing the famous artwork "${title}" by ${creator} to guide a faithful AI reproduction.`,
                    "Describe objectively in English within 220 words:",
                    "1) Exact composition and spatial layout",
                    "2) Every major subject, figure, object and background element",
                    "3) Precise color palette with specific hues",
                    "4) Brushwork, texture, lighting and mood",
                    "5) Camera angle and perspective",
                    "No markdown, no bullet symbols, plain descriptive prose only.",
                  ].join(" "),
                },
              ],
            },
          ],
          temperature: 0.25,
          max_tokens: 700,
        }),
        signal: AbortSignal.timeout(25000),
      });

      if (!response.ok) {
        throw new Error(`Grok vision HTTP ${response.status}`);
      }

      const payload = await response.json() as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const visualAnalysis = payload.choices?.[0]?.message?.content?.trim();
      if (!visualAnalysis) {
        throw new Error("Vision model returned empty analysis");
      }

      return [
        `Museum-quality faithful reproduction of "${title}" by ${creator}.`,
        `${art.artworkType}, ${art.era} period.`,
        "Match the original masterpiece as closely as possible in composition, subjects, proportions, colors and brushwork.",
        visualAnalysis.slice(0, 900),
        `Additional palette notes: ${palette}.`,
        sanitizeForPrompt(art.description.slice(0, 160)),
        "Fine art oil painting on canvas, neutral gallery lighting, photorealistic museum photograph.",
        "No text, no watermark, no fantasy, no modern reinterpretation, no glowing effects.",
      ].join(" ");
    } catch (err) {
      lastError = err;
      console.warn(
        `[muse/artwork-image] Vision model ${model} failed:`,
        err instanceof Error ? err.message : err,
      );
    }
  }

  console.warn("[muse/artwork-image] Vision replica prompt failed:", lastError);
  return null;
}

async function tryDirectOriginalDisplay(
  candidate: ImageCandidate,
): Promise<ResolvedArtworkImage | null> {
  const validated = await pickValidatedCandidate([candidate]);
  if (!validated) return null;

  return {
    url: validated.url,
    displayUrl: buildArtworkDisplayUrl(validated.url, validated.origin),
    source: validated.origin,
  };
}

async function tryDailyArtImage(
  dailyArtImageUrl: string,
): Promise<ResolvedArtworkImage | null> {
  const trimmed = dailyArtImageUrl.trim();
  if (!trimmed || !isAllowedImageProxyUrl(trimmed)) return null;
  if (!(await validateImageUrl(trimmed))) return null;

  return {
    url: trimmed,
    displayUrl: buildArtworkDisplayUrl(trimmed, "dailyart"),
    source: "dailyart",
  };
}

export async function resolveMuseArtworkImage(
  art: ArtworkImageInput,
  options?: { forcePollinations?: boolean },
): Promise<ResolvedArtworkImage> {
  if (!options?.forcePollinations && art.dailyArtImageUrl?.trim()) {
    const dailyArt = await tryDailyArtImage(art.dailyArtImageUrl);
    if (dailyArt) return dailyArt;
  }

  if (!options?.forcePollinations) {
    const reference = await findReferenceImage(art);

    if (reference) {
      // 🏛️ Primary Priority: Directly serve genuine high-resolution museum original painting
      const direct = await tryDirectOriginalDisplay(reference);
      if (direct) return direct;
    }
  }

  // 🎨 Fallback synthesis with ultra-high quality prompt & resolution
  const pollinationsUrl = buildPollinationsArtUrl(art, 1024, 768);
  return {
    url: pollinationsUrl,
    displayUrl: pollinationsUrl,
    source: "pollinations",
  };
}

interface CachedImage {
  contentType: string;
  buffer: Buffer;
  timestamp: number;
}
const imageMemoryCache = new Map<string, CachedImage>();
const MAX_IMAGE_CACHE_ITEMS = 300;
const IMAGE_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export async function proxyArtworkImage(rawUrl: string, res: Response): Promise<void> {
  let url = normalizeWikimediaUrl(encodeURI(rawUrl));

  const cached = imageMemoryCache.get(url);
  if (cached && Date.now() - cached.timestamp < IMAGE_CACHE_TTL_MS) {
    res.setHeader("Content-Type", cached.contentType);
    res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
    res.send(cached.buffer);
    return;
  }

  const tryFetch = async (targetUrl: string) => {
    const isWikimedia = targetUrl.includes("wikimedia.org") || targetUrl.includes("wikipedia.org");
    const isDailyArt = targetUrl.includes("dailyartmagazine.com");
    return await fetch(targetUrl, {
      headers: {
        "User-Agent": isWikimedia ? WIKIMEDIA_USER_AGENT : BROWSER_USER_AGENT,
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        ...(isDailyArt ? { "Referer": "https://www.dailyartmagazine.com/" } : isWikimedia ? { "Referer": "https://commons.wikimedia.org/" } : {}),
      },
      signal: AbortSignal.timeout(12000),
    });
  };

  try {
    let upstream = await tryFetch(url);

    // If 400, 404, or 429 and it's a thumbnail on Wikimedia, try full original file
    if (!upstream.ok && url.includes("upload.wikimedia.org") && url.includes("/thumb/")) {
      const match = url.match(/\/wikipedia\/commons\/thumb\/([^/]+)\/([^/]+)\/([^/]+)\//);
      if (match) {
        const fullOriginalUrl = `https://upload.wikimedia.org/wikipedia/commons/${match[1]}/${match[2]}/${match[3]}`;
        const fallbackUpstream = await tryFetch(fullOriginalUrl);
        if (fallbackUpstream.ok) {
          upstream = fallbackUpstream;
          url = fullOriginalUrl;
        }
      }
    }

    // If still not ok and it's Wikimedia, try Wikimedia Commons Special:FilePath resolver
    if (!upstream.ok && (url.includes("wikimedia.org") || url.includes("wikipedia.org"))) {
      const rawFile = url.split("/").pop() || "";
      const cleanFile = decodeURIComponent(rawFile.replace(/^\d+px-/, ""));
      if (cleanFile) {
        const specialUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(cleanFile)}?width=1024`;
        const specialUpstream = await tryFetch(specialUrl);
        if (specialUpstream.ok) {
          upstream = specialUpstream;
          url = specialUrl;
        }
      }
    }

    if (!upstream.ok) {
      console.warn(`[proxyArtworkImage] Upstream returned status ${upstream.status} for ${url}`);
      res.status(upstream.status >= 400 && upstream.status < 600 ? upstream.status : 502).json({
        error: "Upstream original museum image unavailable",
        status: upstream.status,
      });
      return;
    }

    const contentType = (upstream.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
    const finalContentType = ALLOWED_MIMES.has(contentType) ? contentType : "image/jpeg";

    const buffer = Buffer.from(await upstream.arrayBuffer());

    if (imageMemoryCache.size >= MAX_IMAGE_CACHE_ITEMS) {
      const oldestKey = imageMemoryCache.keys().next().value;
      if (oldestKey) imageMemoryCache.delete(oldestKey);
    }
    imageMemoryCache.set(url, { contentType: finalContentType, buffer, timestamp: Date.now() });

    res.setHeader("Content-Type", finalContentType);
    res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
    res.send(buffer);
  } catch (err) {
    console.warn("[proxyArtworkImage] fetch failed:", err);
    res.status(502).json({
      error: "Failed to proxy original museum image",
      message: err instanceof Error ? err.message : String(err),
    });
  }
}

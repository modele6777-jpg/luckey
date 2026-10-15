const COUNTRY_SUFFIX =
  /,\s*(?:네덜란드|한국|대한민국|프랑스|미국|독일|이탈리아|영국|일본|중국|Russia|France|USA|Germany|Italy|UK|Japan|China|Korea|Netherlands).*$/i;

function hasLatin(text: string): boolean {
  return /[A-Za-zÀ-ÿ]/.test(text);
}

function hasHangul(text: string): boolean {
  return /[\u3131-\uD79D]/.test(text);
}

function cleanOriginalSegment(text: string): string {
  return text
    .replace(/,\s*\d{4}(?:\s*[-–]\s*\d{4})?.*$/, "")
    .replace(COUNTRY_SUFFIX, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** 작품/시/곡 검색용 원어 문자열만 추출 (한글 표기 제거) */
export function extractOriginalLanguage(text: string): string {
  if (!text?.trim()) return "";

  const trimmed = text.trim();
  const parenMatch = trimmed.match(/\(([^)]+)\)/);

  if (parenMatch) {
    const inner = parenMatch[1].trim();
    if (hasLatin(inner)) {
      return cleanOriginalSegment(inner);
    }
    const prefix = trimmed.replace(/\s*\([^)]+\)\s*/g, " ").trim();
    if (prefix) return cleanOriginalSegment(prefix);
  }

  if (hasLatin(trimmed) && !hasHangul(trimmed)) {
    return cleanOriginalSegment(trimmed);
  }

  if (hasHangul(trimmed) && !hasLatin(trimmed)) {
    return cleanOriginalSegment(trimmed);
  }

  if (hasLatin(trimmed) && hasHangul(trimmed)) {
    const latinParts = trimmed.match(/[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9\s.,''°-]*/g);
    if (latinParts?.length) {
      return cleanOriginalSegment(latinParts.join(" "));
    }
  }

  return cleanOriginalSegment(trimmed.split("(")[0]);
}

export function buildOriginalSearchQuery(
  primary: string,
  secondary: string,
  primaryOriginal?: string,
  secondaryOriginal?: string,
): string {
  const a = (primaryOriginal?.trim() || extractOriginalLanguage(primary)).trim();
  const b = (secondaryOriginal?.trim() || extractOriginalLanguage(secondary)).trim();
  return [a, b].filter(Boolean).join(" ");
}

export function buildGoogleSearchUrl(query: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

const DAILY_ART_MAGAZINE_HOME = "https://www.dailyartmagazine.com/";
const SIYOIL_LIB_HOME = "https://www.siyoillib.com/";
const APPLE_MUSIC_CLASSICAL_HOME = "https://classical.music.apple.com/kr/";
/** DailyArt Magazine 기사 URL (없으면 홈으로) */
export function buildDailyArtMagazineArtUrl(dailyArtUrl?: string): string {
  const trimmed = dailyArtUrl?.trim();
  if (!trimmed) return DAILY_ART_MAGAZINE_HOME;
  try {
    const parsed = new URL(trimmed);
    if (
      parsed.hostname === "www.dailyartmagazine.com"
      || parsed.hostname === "dailyartmagazine.com"
    ) {
      return parsed.toString();
    }
  } catch {
    // fall through
  }
  return DAILY_ART_MAGAZINE_HOME;
}

/** Apple Music Classical 곡/앨범 URL (없으면 홈으로) */
export function buildAppleMusicClassicalUrl(appleMusicClassicalUrl?: string): string {
  const trimmed = appleMusicClassicalUrl?.trim();
  if (!trimmed) return APPLE_MUSIC_CLASSICAL_HOME;
  try {
    const parsed = new URL(trimmed);
    if (
      parsed.hostname === "classical.music.apple.com"
      || parsed.hostname === "music.apple.com"
    ) {
      return parsed.toString();
    }
  } catch {
    // fall through
  }
  return APPLE_MUSIC_CLASSICAL_HOME;
}

/** Google AI 검색(AI Mode) URL */
export function buildGoogleAiSearchUrl(query: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}&udm=50`;
}

/** YouTube URL 또는 ID에서 video ID 추출 */
export function extractYouTubeVideoId(urlOrId?: string): string {
  const trimmed = urlOrId?.trim();
  if (!trimmed) return "";
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.replace(/^\//, "").split("/")[0] || "";
    }
    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v") || "";
    }
  } catch {
    // fall through
  }
  return "";
}

/** YouTube 재생 URL (autoplay=true면 앱/브라우저에서 바로 재생 시도) */
export function buildYouTubeWatchUrl(videoId?: string, autoplay = false): string {
  const id = extractYouTubeVideoId(videoId);
  if (!id) return "https://www.youtube.com/";
  const url = `https://www.youtube.com/watch?v=${id}`;
  return autoplay ? `${url}&autoplay=1` : url;
}

/** 명곡 YouTube 검색 쿼리 */
export function buildSongYouTubeSearchQuery(
  title: string,
  artist: string,
  titleOriginal?: string,
  artistOriginal?: string,
): string {
  return buildOriginalSearchQuery(title, artist, titleOriginal, artistOriginal).trim();
}

/** 시요일 라이브러리 시 전문 URL (없으면 홈으로) */
export function buildSiyoilLibPoemUrl(siyoilUrl?: string): string {
  const trimmed = siyoilUrl?.trim();
  if (!trimmed) return SIYOIL_LIB_HOME;
  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname === "www.siyoillib.com" || parsed.hostname === "siyoillib.com") {
      return parsed.toString();
    }
  } catch {
    // fall through
  }
  return SIYOIL_LIB_HOME;
}

const GROK_AI_HOME = "https://grok.com/";

/** Grok AI 검색 URL */
export function buildGrokAiSearchUrl(query: string): string {
  const trimmed = query.trim();
  if (!trimmed) return GROK_AI_HOME;
  return `${GROK_AI_HOME}?q=${encodeURIComponent(trimmed)}`;
}

/** 시 전문 Grok AI 검색 URL */
export function buildPoemGrokAiSearchUrl(
  title: string,
  poet: string,
  titleOriginal?: string,
  poetOriginal?: string,
): string {
  return buildGrokAiSearchUrl(
    buildPoemFullTextSearchQuery(title, poet, titleOriginal, poetOriginal),
  );
}

/** 시 전문 Google AI 검색 URL */
export function buildPoemGoogleAiSearchUrl(
  title: string,
  poet: string,
  titleOriginal?: string,
  poetOriginal?: string,
): string {
  return buildGoogleAiSearchUrl(
    buildPoemFullTextSearchQuery(title, poet, titleOriginal, poetOriginal),
  );
}

/** 시 전문 Google 일반 검색 URL (클릭 시 시 전문이 검색 결과에 바로 노출) */
export function buildPoemGoogleSearchUrl(
  title: string,
  poet: string,
  titleOriginal?: string,
  poetOriginal?: string,
): string {
  const query = buildPoemFullTextSearchQuery(title, poet, titleOriginal, poetOriginal);
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

const GEMINI_HOME = "https://gemini.google.com/app";

/** Gemini AI 검색 URL */
export function buildGeminiSearchUrl(query: string): string {
  const trimmed = query.trim();
  if (!trimmed) return GEMINI_HOME;
  return `${GEMINI_HOME}?q=${encodeURIComponent(trimmed)}`;
}

/** 시 전문 Gemini AI 검색 URL */
export function buildPoemGeminiSearchUrl(
  title: string,
  poet: string,
  titleOriginal?: string,
  poetOriginal?: string,
): string {
  return buildGeminiSearchUrl(
    buildPoemFullTextSearchQuery(title, poet, titleOriginal, poetOriginal),
  );
}

/** 시 전문 Google Arts & Culture 검색 URL */
export function buildPoemGoogleArtsAndCultureSearchUrl(
  title: string,
  poet: string,
  titleOriginal?: string,
  poetOriginal?: string,
): string {
  const query = buildOriginalSearchQuery(title, poet, titleOriginal, poetOriginal);
  return `https://artsandculture.google.com/search?q=${encodeURIComponent(query)}`;
}

/** 명화 Google Arts & Culture 검색 URL */
export function buildArtworkGoogleArtsAndCultureSearchUrl(
  title: string,
  creator: string,
  titleOriginal?: string,
  creatorOriginal?: string,
): string {
  const query = buildOriginalSearchQuery(title, creator, titleOriginal, creatorOriginal);
  return `https://artsandculture.google.com/search?q=${encodeURIComponent(query)}`;
}

/** 시 전문 검색용 쿼리 — 검색어 끝에 '전문'을 붙임 */
export function buildPoemFullTextSearchQuery(
  title: string,
  poet: string,
  titleOriginal?: string,
  poetOriginal?: string,
): string {
  const parts = [poet?.trim(), title?.trim()].filter(Boolean);
  const base = parts.join(" ");
  if (!base) return "시 전문";
  if (base.endsWith("전문")) return base;
  return `${base} 전문`;
}

export function buildYouTubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}
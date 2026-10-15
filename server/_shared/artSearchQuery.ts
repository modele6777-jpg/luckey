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
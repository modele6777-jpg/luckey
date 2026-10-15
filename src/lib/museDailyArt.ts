import { MUSE_ART_CATALOG } from "../../server/api-lib/museArtCatalog";
import { buildDailyArtMagazineArtUrl } from "@/utils/artSearchQuery";

export { MUSE_ART_CATALOG };

function normalizeArtworkKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export function lookupCatalogDailyArtUrl(
  catalogId?: string,
  title?: string,
  titleOriginal?: string,
): string | undefined {
  if (catalogId) {
    const byId = MUSE_ART_CATALOG.find((entry) => entry.id === catalogId);
    if (byId?.dailyArtUrl) return byId.dailyArtUrl;
  }

  const needles = [titleOriginal, title]
    .map((value) => normalizeArtworkKey(value || ""))
    .filter(Boolean);

  if (needles.length === 0) return undefined;

  for (const entry of MUSE_ART_CATALOG) {
    const haystack = [entry.titleOriginal, entry.title].map(normalizeArtworkKey);
    const matched = needles.some((needle) =>
      haystack.some((hay) => hay.includes(needle) || needle.includes(hay)),
    );
    if (matched) return entry.dailyArtUrl;
  }

  return undefined;
}

/** 오늘의 명화 DailyArt 기사 URL — 카탈로그 작품 페이지로 연결 */
export function resolveArtworkDailyArtUrl(
  dailyArtUrl?: string,
  catalogId?: string,
  title?: string,
  titleOriginal?: string,
): string {
  const trimmed = dailyArtUrl?.trim();
  if (trimmed) return buildDailyArtMagazineArtUrl(trimmed);

  const fromCatalog = lookupCatalogDailyArtUrl(catalogId, title, titleOriginal);
  return buildDailyArtMagazineArtUrl(fromCatalog);
}
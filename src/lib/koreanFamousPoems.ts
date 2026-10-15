import {
  KOREAN_FAMOUS_POEMS,
  KOREAN_POEM_THEMES,
  KOREAN_POEM_ORIGINS,
  type KoreanPoemItem,
  type KoreanPoemTheme,
  type KoreanPoemOrigin,
} from "../../server/api-lib/koreanFamousPoems";

export {
  KOREAN_FAMOUS_POEMS,
  KOREAN_POEM_THEMES,
  KOREAN_POEM_ORIGINS,
  type KoreanPoemItem,
  type KoreanPoemTheme,
  type KoreanPoemOrigin,
};

/** Get a poem by its ID */
export function getKoreanPoemById(id: string): KoreanPoemItem | undefined {
  return KOREAN_FAMOUS_POEMS.find((p) => p.id === id);
}

/** Get random poem with deterministic date or numeric seed */
export function getRandomKoreanPoem(seedOffset = 0): KoreanPoemItem {
  const index = Math.abs(seedOffset) % KOREAN_FAMOUS_POEMS.length;
  return KOREAN_FAMOUS_POEMS[index];
}

/** Filter poems by theme and origin */
export function getKoreanPoemsByTheme(
  theme?: KoreanPoemTheme | "all",
  origin?: KoreanPoemOrigin
): KoreanPoemItem[] {
  return KOREAN_FAMOUS_POEMS.filter((p) => {
    const matchTheme = !theme || theme === "all" || p.theme === theme;
    const poemOrigin = p.origin || (p.poet.includes("대한민국") || p.poet.includes("조선") ? "korean" : "world");
    const matchOrigin = !origin || origin === "all" || poemOrigin === origin;
    return matchTheme && matchOrigin;
  });
}

/** Search poems by poet or title or excerpt keyword with optional origin filtering */
export function searchKoreanPoems(
  query: string,
  theme?: KoreanPoemTheme | "all",
  origin?: KoreanPoemOrigin
): KoreanPoemItem[] {
  const base = getKoreanPoemsByTheme(theme, origin);
  const q = query.trim().toLowerCase();
  if (!q) return base;

  return base.filter((p) => {
    return (
      p.title.toLowerCase().includes(q) ||
      (p.titleOriginal && p.titleOriginal.toLowerCase().includes(q)) ||
      p.poet.toLowerCase().includes(q) ||
      (p.poetOriginal && p.poetOriginal.toLowerCase().includes(q)) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.whyRecommended.toLowerCase().includes(q) ||
      p.themeLabel.toLowerCase().includes(q) ||
      (p.country && p.country.toLowerCase().includes(q))
    );
  });
}


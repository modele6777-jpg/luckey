import { SEPTAGRAM_RAINBOW_PALETTE } from '../lucyAutoModeDetector';
import type { SevenThemeChannel } from '../fifteenDivinationTools';
import { getEngineCatalogTheme, LUCY_PRO_CATALOG_ENGINES, LUCY_PRO_CHANNEL_THEMES } from './engineCatalog';

export interface EngineBadgeTheme {
  theme: SevenThemeChannel;
  backgroundColor: string;
  color: string;
  borderColor: string;
}

const visibleCatalogEngineByKey = new Map(
  LUCY_PRO_CATALOG_ENGINES.map(engine => [engine.key, engine] as const),
);

/** Resolve a used engine ID to its catalog theme and the app's existing badge palette. */
export function getEngineBadgeTheme(engineKey: string): EngineBadgeTheme | null {
  const engine = visibleCatalogEngineByKey.get(engineKey);
  if (!engine) return null;

  const theme = getEngineCatalogTheme(engine);
  const palette = SEPTAGRAM_RAINBOW_PALETTE[theme];
  return {
    theme,
    backgroundColor: palette.background,
    color: palette.foreground,
    borderColor: palette.border,
  };
}

export interface EngineThemeBadge extends EngineBadgeTheme {
  label: string;
  emoji: string;
}

/** Resolve unique theme badges from engines that were actually used; unknown IDs stay unthemed. */
export function getUsedEngineThemeBadges(engineKeys: readonly string[]): EngineThemeBadge[] {
  const usedThemes = new Set<SevenThemeChannel>();
  for (const engineKey of engineKeys) {
    const engine = visibleCatalogEngineByKey.get(engineKey);
    if (engine) usedThemes.add(getEngineCatalogTheme(engine));
  }

  return LUCY_PRO_CHANNEL_THEMES.flatMap(({ id, label, emoji }) => {
    if (!usedThemes.has(id)) return [];
    const palette = SEPTAGRAM_RAINBOW_PALETTE[id];
    return [{
      theme: id,
      label,
      emoji,
      backgroundColor: palette.background,
      color: palette.foreground,
      borderColor: palette.border,
    }];
  });
}

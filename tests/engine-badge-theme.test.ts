import assert from 'node:assert/strict';
import test from 'node:test';
import { getEngineCatalogTheme, LUCY_PRO_CATALOG_ENGINES, LUCY_PRO_CHANNEL_THEMES } from '../src/lib/divination/engineCatalog';
import { getUsedEngineThemeBadges } from '../src/lib/divination/engineBadgeTheme';

test('actual engine themes expose one emoji badge per used theme in app order', () => {
  const engineKeysByTheme = new Map<string, string>();
  for (const engine of LUCY_PRO_CATALOG_ENGINES) {
    const theme = getEngineCatalogTheme(engine);
    if (!engineKeysByTheme.has(theme)) engineKeysByTheme.set(theme, engine.key);
  }

  const engineKeys = LUCY_PRO_CHANNEL_THEMES.map(theme => engineKeysByTheme.get(theme.id));
  assert.ok(engineKeys.every((key): key is string => Boolean(key)), 'every channel theme has a catalog engine');

  const keys = engineKeys as string[];
  const badges = getUsedEngineThemeBadges([...keys, keys[0], 'unknown-engine-id']);
  assert.deepEqual(
    badges.map(({ theme, label, emoji }) => ({ theme, label, emoji })),
    LUCY_PRO_CHANNEL_THEMES.map(({ id, label, emoji }) => ({ theme: id, label, emoji })),
  );
});

test('assistant mode badges deduplicate multiple engines from the same theme', () => {
  const firstEngine = LUCY_PRO_CATALOG_ENGINES[0];
  const theme = getEngineCatalogTheme(firstEngine);
  const sameThemeKeys = LUCY_PRO_CATALOG_ENGINES
    .filter(engine => getEngineCatalogTheme(engine) === theme)
    .slice(0, 3)
    .map(engine => engine.key);

  const badges = getUsedEngineThemeBadges(sameThemeKeys);
  assert.equal(badges.length, 1);
  assert.equal(badges[0].theme, theme);
  assert.ok(badges[0].emoji);
});

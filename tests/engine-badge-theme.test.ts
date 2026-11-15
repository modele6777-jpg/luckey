import assert from 'node:assert/strict';
import test from 'node:test';
import { getEngineCatalogTheme, LUCY_PRO_CATALOG_ENGINES, LUCY_PRO_CHANNEL_THEMES } from '../src/lib/divination/engineCatalog';
import { getUsedEngineThemeBadges, groupEnginesByTheme } from '../src/lib/divination/engineBadgeTheme';

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

test('interleaved used engines group by catalog theme, retaining names and unknown references', () => {
  const firstTheme = LUCY_PRO_CHANNEL_THEMES[0].id;
  const same = LUCY_PRO_CATALOG_ENGINES.filter(engine => getEngineCatalogTheme(engine) === firstTheme).slice(0,2);
  const other = LUCY_PRO_CATALOG_ENGINES.find(engine => getEngineCatalogTheme(engine) !== firstTheme)!;
  const input = [same[0],other,same[1]].map(engine => ({toolId:engine.key,name:engine.key}));
  input.push({toolId:'unknown-reference',name:'기타 참고'});
  const groups = groupEnginesByTheme(input);
  assert.deepEqual(groups.find(group => group.key === firstTheme)?.engines, [input[0],input[2]]);
  assert.equal(groups.at(-1)?.key,'other');
  assert.equal(groups.flatMap(group => group.engines).length,input.length);
  assert.deepEqual(input.map(engine => engine.toolId),[same[0].key,other.key,same[1].key,'unknown-reference']);
});

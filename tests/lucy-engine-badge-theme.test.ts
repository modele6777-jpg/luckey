import assert from 'node:assert/strict';
import test from 'node:test';
import { SEPTAGRAM_RAINBOW_PALETTE } from '../src/lib/lucyAutoModeDetector';
import { ENGINE_CATALOG_COUNTS, getEngineCatalogTheme, LUCY_PRO_CATALOG_ENGINES } from '../src/lib/divination/engineCatalog';
import { getEngineBadgeTheme } from '../src/lib/divination/engineBadgeTheme';

function luminance(hexColor: string): number {
  const channels = hexColor.slice(1).match(/.{2}/g)?.map(channel => parseInt(channel, 16) / 255) ?? [];
  const linear = channels.map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(foreground: string, background: string): number {
  const light = Math.max(luminance(foreground), luminance(background));
  const dark = Math.min(luminance(foreground), luminance(background));
  return (light + 0.05) / (dark + 0.05);
}

test('every visible catalog engine maps to its existing channel badge palette', () => {
  assert.equal(ENGINE_CATALOG_COUNTS.foundational, 15);
  assert.equal(ENGINE_CATALOG_COUNTS.deep_master, 316);
  assert.equal(LUCY_PRO_CATALOG_ENGINES.length, 331);

  for (const engine of LUCY_PRO_CATALOG_ENGINES) {
    const theme = getEngineCatalogTheme(engine);
    const palette = SEPTAGRAM_RAINBOW_PALETTE[theme];
    assert.deepEqual(getEngineBadgeTheme(engine.key), {
      theme,
      backgroundColor: palette.background,
      color: palette.foreground,
      borderColor: palette.border,
    }, engine.key);
  }
});

test('unknown or non-catalog engine IDs do not receive a falsely attributed theme', () => {
  assert.equal(getEngineBadgeTheme('not-a-catalog-engine'), null);
});

test('existing theme badge foregrounds remain readable on their pastel backgrounds', () => {
  for (const [theme, palette] of Object.entries(SEPTAGRAM_RAINBOW_PALETTE)) {
    assert.ok(contrastRatio(palette.foreground, palette.background) >= 4.5, `${theme} badge contrast is below 4.5:1`);
  }
});

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';

const bundle = await build({
  entryPoints: ['src/lib/visualViewportBox.ts'],
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
});
const { resolveViewportBox } = await import(
  'data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64')
);

function box(innerWidth, innerHeight, visual) {
  return resolveViewportBox({
    innerWidth,
    innerHeight,
    visual,
  });
}

const tabletLandscapeToolbar = box(1180, 820, { width: 1180, height: 768, offsetTop: 0, offsetLeft: 0 });
assert.deepEqual(tabletLandscapeToolbar, { width: 1180, height: 768, offsetTop: 0, offsetLeft: 0, bottomGap: 52 });

const tabletLandscapeOffset = box(1180, 820, { width: 1180, height: 740, offsetTop: 32, offsetLeft: 0 });
assert.deepEqual(tabletLandscapeOffset, { width: 1180, height: 740, offsetTop: 32, offsetLeft: 0, bottomGap: 48 });

const stalePortraitDuringLandscape = box(820, 1180, { width: 1180, height: 820, offsetTop: 0, offsetLeft: 0 });
assert.deepEqual(stalePortraitDuringLandscape, { width: 1180, height: 820, offsetTop: 0, offsetLeft: 0, bottomGap: 360 });

const ipadPortraitToolbar = box(820, 1180, { width: 820, height: 1110, offsetTop: 0, offsetLeft: 0 });
assert.deepEqual(ipadPortraitToolbar, { width: 820, height: 1110, offsetTop: 0, offsetLeft: 0, bottomGap: 70 });

const phonePortrait = box(390, 844, { width: 390, height: 844, offsetTop: 0, offsetLeft: 0 });
assert.deepEqual(phonePortrait, { width: 390, height: 844, offsetTop: 0, offsetLeft: 0, bottomGap: 0 });

const phonePortraitToolbar = box(390, 844, { width: 390, height: 760, offsetTop: 0, offsetLeft: 0 });
assert.deepEqual(phonePortraitToolbar, { width: 390, height: 760, offsetTop: 0, offsetLeft: 0, bottomGap: 84 });

const phonePortraitKeyboard = box(390, 844, { width: 390, height: 430, offsetTop: 0, offsetLeft: 0 });
assert.deepEqual(phonePortraitKeyboard, { width: 390, height: 844, offsetTop: 0, offsetLeft: 0, bottomGap: 0 });

const phoneLandscapeToolbar = box(844, 390, { width: 844, height: 340, offsetTop: 0, offsetLeft: 0 });
assert.deepEqual(phoneLandscapeToolbar, { width: 844, height: 340, offsetTop: 0, offsetLeft: 0, bottomGap: 50 });

const phoneLandscapeKeyboard = box(844, 390, { width: 844, height: 180, offsetTop: 12, offsetLeft: 0 });
assert.deepEqual(phoneLandscapeKeyboard, { width: 844, height: 390, offsetTop: 0, offsetLeft: 0, bottomGap: 0 });

const missingVisual = box(1024, 768, null);
assert.deepEqual(missingVisual, { width: 1024, height: 768, offsetTop: 0, offsetLeft: 0, bottomGap: 0 });

const invalidVisual = box(1024, 768, { width: Number.NaN, height: -1, offsetTop: 10, offsetLeft: 4 });
assert.deepEqual(invalidVisual, { width: 1024, height: 768, offsetTop: 0, offsetLeft: 0, bottomGap: 0 });

assert.equal(box(0, 0, null), null);

const css = readFileSync('src/index.css', 'utf8');
assert.equal(css.includes('-webkit-fill-available'), false);
assert.match(css, /--vvh:\s*100dvh/);
assert.match(css, /\.tarot-virtual-stage[\s\S]*min-height:\s*720px/);
assert.match(css, /orientation:\s*portrait\)[\s\S]*min-height:\s*800px/);
assert.match(css, /orientation:\s*landscape\)[\s\S]*\.tarot-virtual-stage[\s\S]*min-height:\s*0/);
assert.match(css, /\.tarot-spread-stage-root/);
assert.equal(css.includes('min-h-[720px] sm:min-h-[800px]'), false);

const trinity = readFileSync('src/pages/TrinityApp.tsx', 'utf8');
assert.match(trinity, /tarot-virtual-stage/);
assert.equal(trinity.includes('sm:min-h-[800px]'), false);

console.log('visual viewport box tests passed');

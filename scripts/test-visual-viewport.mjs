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
const { resolveViewportBox, viewportNeedsResumeFill } = await import(
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

const ipadResumeSnapshot = {
  innerWidth: 1180,
  innerHeight: 820,
  visual: { width: 1180, height: 740, offsetTop: 0, offsetLeft: 0 },
};
assert.equal(viewportNeedsResumeFill(ipadResumeSnapshot, true, null), true);
assert.deepEqual(resolveViewportBox(ipadResumeSnapshot, { fillLayoutGap: true }), {
  width: 1180,
  height: 820,
  offsetTop: 0,
  offsetLeft: 0,
  bottomGap: 0,
});
assert.equal(viewportNeedsResumeFill(ipadResumeSnapshot, false, null), false);

const stalePixels = {
  innerWidth: 1180,
  innerHeight: 820,
  visual: { width: 1180, height: 820, offsetTop: 0, offsetLeft: 0 },
};
assert.equal(viewportNeedsResumeFill(stalePixels, false, { width: 1180, height: 700 }), true);

const phoneResume = {
  innerWidth: 390,
  innerHeight: 844,
  visual: { width: 390, height: 760, offsetTop: 0, offsetLeft: 0 },
};
assert.equal(viewportNeedsResumeFill(phoneResume, true, null), false);
assert.equal(resolveViewportBox(phoneResume, { fillLayoutGap: true }).height, 760);

const ipadKeyboardResume = {
  innerWidth: 1180,
  innerHeight: 820,
  visual: { width: 1180, height: 400, offsetTop: 0, offsetLeft: 0 },
};
assert.equal(viewportNeedsResumeFill(ipadKeyboardResume, true, null), false);

const rotatedResume = {
  innerWidth: 820,
  innerHeight: 1180,
  visual: { width: 1180, height: 820, offsetTop: 0, offsetLeft: 0 },
};
assert.equal(viewportNeedsResumeFill(rotatedResume, true, null), false);

const standaloneShrink = {
  innerWidth: 1180,
  innerHeight: 740,
  iosStandalone: true,
  screenWidth: 1180,
  screenHeight: 820,
  visual: { width: 1180, height: 740, offsetTop: 24, offsetLeft: 0 },
};
assert.deepEqual(resolveViewportBox(standaloneShrink), {
  width: 1180,
  height: 820,
  offsetTop: 0,
  offsetLeft: 0,
  bottomGap: 0,
});
assert.equal(viewportNeedsResumeFill(standaloneShrink, true, null), true);

const standalonePortraitScreen = {
  innerWidth: 1180,
  innerHeight: 740,
  iosStandalone: true,
  screenWidth: 820,
  screenHeight: 1180,
  visual: { width: 1180, height: 740, offsetTop: 0, offsetLeft: 0 },
};
assert.equal(resolveViewportBox(standalonePortraitScreen).height, 820);

const safariTab = { ...standaloneShrink, iosStandalone: false };
assert.equal(resolveViewportBox(safariTab).height, 740);
assert.equal(resolveViewportBox(safariTab).offsetTop, 24);

const phoneStandalone = {
  innerWidth: 390,
  innerHeight: 800,
  iosStandalone: true,
  screenWidth: 390,
  screenHeight: 844,
  visual: { width: 390, height: 800, offsetTop: 0, offsetLeft: 0 },
};
assert.equal(resolveViewportBox(phoneStandalone).height, 800);

const standaloneKeyboardSized = {
  innerWidth: 1180,
  innerHeight: 400,
  iosStandalone: true,
  screenWidth: 1180,
  screenHeight: 820,
  visual: { width: 1180, height: 400, offsetTop: 0, offsetLeft: 0 },
};
assert.equal(resolveViewportBox(standaloneKeyboardSized).height, 400);

const lifecycle = readFileSync('src/lib/visualViewportBox.ts', 'utf8');
assert.match(lifecycle, /visibilitychange/);
assert.match(lifecycle, /pageshow/);
assert.match(lifecycle, /addEventListener\('focus'/);
assert.match(lifecycle, /addEventListener\('resume'/);
assert.match(lifecycle, /visibilityState === 'hidden'/);
assert.match(lifecycle, /scrollTo\(0, 0\)/);
assert.match(lifecycle, /iosStandalone/);

const html = readFileSync('index.html', 'utf8');
assert.match(html, /viewport-fit=cover/);
assert.match(html, /name="mobile-web-app-capable" content="yes"/);
assert.match(html, /name="apple-mobile-web-app-status-bar-style" content="black-translucent"/);
const manifest = readFileSync('public/manifest.json', 'utf8');
assert.match(manifest, /"display": "standalone"/);

const css = readFileSync('src/index.css', 'utf8');
assert.equal(css.includes('-webkit-fill-available'), false);
assert.match(css, /--vvh:\s*100dvh/);
assert.match(css, /display-mode:\s*standalone/);
assert.match(css, /--vvh:\s*100lvh/);
assert.match(css, /\.tarot-virtual-stage[\s\S]*min-height:\s*720px/);
assert.match(css, /orientation:\s*portrait\)[\s\S]*min-height:\s*800px/);
assert.match(css, /orientation:\s*landscape\)[\s\S]*\.tarot-virtual-stage[\s\S]*min-height:\s*0/);
assert.match(css, /\.tarot-spread-stage-root/);
assert.equal(css.includes('min-h-[720px] sm:min-h-[800px]'), false);

const trinity = readFileSync('src/pages/TrinityApp.tsx', 'utf8');
assert.match(trinity, /tarot-virtual-stage/);
assert.equal(trinity.includes('sm:min-h-[800px]'), false);

console.log('visual viewport box tests passed');

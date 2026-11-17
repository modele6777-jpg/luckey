import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { webkit } from '@playwright/test';

const source = await readFile('src/index.css', 'utf8');
const marker = '/* Foldable canvas geometry: reserve the center fold';
const start = source.indexOf(marker);
assert.notEqual(start, -1, 'foldable geometry rules exist in the app stylesheet');
const responsiveCss = source.slice(start);
assert.match(responsiveCss, /horizontal-viewport-segments:\s*2/);
assert.match(responsiveCss, /vertical-viewport-segments:\s*2/);
assert.match(responsiveCss, /env\(safe-area-inset-right/);

const browser = await webkit.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 1, isMobile: true });
  await page.setContent(`<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>
    * { box-sizing: border-box; }
    html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; }
    .sites-pinned-main { position: fixed; inset: 0 80px 0 0; width: calc(100vw - 80px); max-width: calc(100vw - 80px); height: 100vh; display: flex; min-width: 0; min-height: 0; overflow: hidden; }
    .sites-pinned-sidebar { position: fixed; top: 0; right: 0; bottom: 0; width: var(--sites-sidebar-width, 80px); height: 100vh; }
    .pane-wrap { position: relative; display: flex; flex-direction: row; width: 100%; height: 100%; min-width: 0; min-height: 0; overflow: hidden; }
    #duo-content-viewport, #duo-lucy-viewport { display: flex; flex: 0 0 50vw; width: 50vw; min-width: 0; height: 100%; min-height: 0; overflow: hidden; transform: translateZ(0); }
    #duo-lucy-viewport { flex: 1 1 0; width: calc(50vw - 80px); }
    body.duo-unfolded-landscape.duo-panels-swapped .pane-wrap { flex-direction: row-reverse; }
    body.duo-unfolded-portrait .sites-pinned-main { inset: 0 0 var(--duo-portrait-bottom-nav-height) 0; width: 100vw; max-width: 100vw; height: calc(100vh - var(--duo-portrait-bottom-nav-height)); }
    body.duo-unfolded-portrait .pane-wrap { flex-direction: column; }
    body.duo-unfolded-portrait .sites-pinned-sidebar { top: auto; bottom: 0; left: 0; width: 100vw; height: var(--duo-portrait-bottom-nav-height); }
    #folded-toolbar { position: fixed; top: 8px; left: 50%; transform: translateX(-50%); width: 90vw; height: 36px; }
    body.duo-unfolded-mode #folded-toolbar { display: none; }
    #tarot-stage-container { position: fixed; inset: 0; pointer-events: none; }
    .screen-portal { position: fixed; inset: 0; }
  </style></head><body>
    <main class="sites-pinned-main"><div class="pane-wrap">
      <section id="duo-content-viewport"><div id="content-page">Content canvas</div><div class="screen-portal" id="content-popup" data-responsive-canvas="true"></div></section>
      <section id="duo-lucy-viewport"><div id="lucy-page">Lucy canvas</div><div class="screen-portal" id="lucy-popup" data-responsive-canvas="true"></div></section>
      <button id="folded-toolbar" class="prism-xs-subnav">Folded controls</button>
    </div></main><nav class="sites-pinned-sidebar" id="navigation"></nav>
    <div id="tarot-stage-container"></div>
  </body></html>`);
  await page.addStyleTag({ content: responsiveCss });

  const assertNear = (actual, expected, label, tolerance = 1) => assert(Math.abs(actual - expected) <= tolerance, `${label}: expected ${expected}, got ${actual}`);
  const setLayout = async (width, height, classes = '') => {
    await page.setViewportSize({ width, height });
    await page.evaluate((next) => {
      document.documentElement.className = next;
      document.body.className = next;
      document.querySelector('.sites-pinned-main').style.setProperty('--sal', '18px');
    }, classes);
  };
  const metrics = () => page.evaluate(() => {
    const rect = (selector) => {
      const { x, y, width, height, right, bottom } = document.querySelector(selector).getBoundingClientRect();
      return { x, y, width, height, right, bottom };
    };
    return {
      content: rect('#duo-content-viewport'), lucy: rect('#duo-lucy-viewport'),
      nav: rect('#navigation'), popup: rect('#tarot-stage-container'),
      main: rect('.sites-pinned-main'), toolbar: rect('#folded-toolbar'),
      gap: parseFloat(getComputedStyle(document.querySelector('.pane-wrap')).columnGap),
      portraitGap: parseFloat(getComputedStyle(document.querySelector('.pane-wrap')).rowGap),
      portraitContent: rect('#duo-content-viewport').height,
      popupContainer: getComputedStyle(document.querySelector('#content-popup')).containerType,
    };
  });

  // Narrow folded cover: toolbar remains centered in the usable width beside the rail and safe inset.
  await setLayout(393, 852);
  let layout = await metrics();
  assertNear(layout.main.right, layout.nav.x, 'folded main stops at navigation');
  assert(layout.toolbar.x >= 18, `folded control clears the left safe inset: ${layout.toolbar.x}`);
  assert(layout.toolbar.right <= layout.main.right - 8, `folded control stays clear of navigation: ${layout.toolbar.right}`);

  // Wide landscape: an explicit fallback gutter separates equal physical screen halves; the popup follows the content pane.
  await setLayout(1200, 800, 'duo-unfolded-mode duo-unfolded-landscape');
  layout = await metrics();
  assert(layout.gap >= 16, `landscape hinge clearance exists: ${layout.gap}`);
  assertNear(layout.content.x, 0, 'landscape content begins at the safe canvas origin');
  assertNear(layout.lucy.x - layout.content.right, layout.gap, 'landscape panels leave the fold clear');
  assertNear(layout.lucy.right, layout.nav.x, 'Lucy stops before the navigation rail');
  assertNear(layout.popup.width, layout.content.width, 'landscape popup follows content-pane width');
  assert.equal(layout.popupContainer, 'inline-size', 'popup responsive breakpoints use its own canvas');

  // Swapping keeps content on the opposite physical segment without moving the reserved fold or rail.
  await setLayout(1200, 800, 'duo-unfolded-mode duo-unfolded-landscape duo-panels-swapped');
  layout = await metrics();
  assertNear(layout.content.x - layout.lucy.right, layout.gap, 'swapped panes leave the fold clear');
  assertNear(layout.content.right, layout.nav.x, 'swapped content stops before navigation');
  assertNear(layout.popup.x, layout.content.x, 'swapped content popup starts with its pane');
  assertNear(layout.popup.right, layout.content.right, 'swapped content popup ends with its pane');

  // Portrait: both canvases share the area above the bottom menu, with the hinge gap between them.
  await setLayout(800, 1200, 'duo-unfolded-mode duo-unfolded-portrait');
  layout = await metrics();
  assert(layout.portraitGap >= 16, `portrait hinge clearance exists: ${layout.portraitGap}`);
  assertNear(layout.content.y, 0, 'portrait content starts at top');
  assertNear(layout.lucy.y - layout.content.bottom, layout.portraitGap, 'portrait panes leave the fold clear');
  assertNear(layout.lucy.bottom, layout.nav.y, 'portrait Lucy pane stops before bottom navigation');
  assertNear(layout.popup.height, layout.portraitContent, 'portrait popup follows content-pane height');

  // A shorter inner viewport must shrink both canvases instead of covering the menu.
  await setLayout(640, 900, 'duo-unfolded-mode duo-unfolded-portrait');
  layout = await metrics();
  assert(layout.content.height < 500, `short portrait pane adapts to available height: ${layout.content.height}`);
  assertNear(layout.lucy.bottom, layout.nav.y, 'short portrait Lucy pane remains above navigation');

  console.log('PASS: narrow folded safe margins, landscape/portrait hinge clearance, swapped pane bounds, navigation exclusion, and popup canvas sizing');
} finally {
  await browser.close();
}

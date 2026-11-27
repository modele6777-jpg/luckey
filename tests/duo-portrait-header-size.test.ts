import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8');

test('expanded portrait uses a compact safe-area-aware Lucy and Cosmic Pro header', () => {
  assert.match(
    css,
    /html\.duo-unfolded-portrait\s*\{\s*--duo-portrait-pane-header-height:\s*max\(var\(--orb-header-min-height\),\s*calc\(env\(safe-area-inset-top,\s*0px\)\s*\+\s*40px\)\);\s*\}/,
  );
  assert.match(
    css,
    /html\.duo-unfolded-portrait \.duo-dual-view\.flex-col #duo-lucy-viewport \.lucy-chat-header,\s*html\.duo-unfolded-portrait \.cosmic-room-header\s*\{\s*height:\s*var\(--duo-portrait-pane-header-height\) !important;\s*min-height:\s*var\(--duo-portrait-pane-header-height\) !important;\s*max-height:\s*var\(--duo-portrait-pane-header-height\) !important;\s*padding-top:\s*env\(safe-area-inset-top,\s*0px\) !important;\s*\}/,
  );
  assert.doesNotMatch(css, /html\.duo-unfolded-portrait\s*\{\s*--duo-pane-header-height:/);
});

test('the portrait override leaves the default and landscape header sizing unchanged', () => {
  assert.match(
    css,
    /:root\s*\{[^}]*--duo-pane-header-height:\s*max\(var\(--orb-header-min-height\),\s*calc\(var\(--orb-header-pad-top\) \+ var\(--orb-header-pad-bottom\) \+ 32px\)\)/s,
  );
  assert.doesNotMatch(css, /html\.duo-unfolded-landscape\s*\{[^}]*--duo-pane-header-height:/s);
  assert.doesNotMatch(css, /html\.duo-unfolded-landscape\s*\{[^}]*--duo-portrait-pane-header-height:/s);
});

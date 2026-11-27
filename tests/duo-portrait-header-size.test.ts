import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8');

function portraitHeaderHeight(name: string, safeAreaInsetTop: number, swapped: boolean): number {
  const selector = swapped
    ? /html\.duo-unfolded-portrait\.duo-panels-swapped\s*\{([^}]*)\}/
    : /html\.duo-unfolded-portrait:not\(\.duo-panels-swapped\)\s*\{([^}]*)\}/;
  const rule = css.match(selector);
  assert.ok(rule, `portrait sizing rule exists for swapped=${swapped}`);
  const declarations = rule[1];
  const direct = declarations.match(new RegExp(`${name}:\\s*(\\d+(?:\\.\\d+)?)px;`));
  if (direct) return Number(direct[1]);
  const safeArea = declarations.match(
    new RegExp(`${name}:\\s*calc\\(env\\(safe-area-inset-top,\\s*0px\\)\\s*\\+\\s*(\\d+(?:\\.\\d+)?)px\\);`),
  );
  assert.ok(safeArea, `${name} is the 40px content bar plus a top-pane-only safe-area inset`);
  return safeAreaInsetTop + Number(safeArea[1]);
}

function defaultHeaderHeight(safeAreaInsetTop: number): number {
  const rootRule = css.match(/:root\s*\{([^}]*--orb-header-min-height:[^}]*)\}/s);
  assert.ok(rootRule, 'shared default header sizing variables exist');
  const minHeight = rootRule[1].match(/--orb-header-min-height:\s*(\d+(?:\.\d+)?)px;/);
  const topInset = rootRule[1].match(
    /--orb-header-pad-top:\s*max\(14px,\s*calc\(env\(safe-area-inset-top,\s*0px\)\s*\+\s*10px\)\);/,
  );
  const bottomPadding = rootRule[1].match(/--orb-header-pad-bottom:\s*(\d+(?:\.\d+)?)px;/);
  const contentHeight = rootRule[1].match(
    /--duo-pane-header-height:\s*max\(var\(--orb-header-min-height\),\s*calc\(var\(--orb-header-pad-top\)\s*\+\s*var\(--orb-header-pad-bottom\)\s*\+\s*(\d+(?:\.\d+)?)px\)\);/,
  );
  assert.ok(minHeight && topInset && bottomPadding && contentHeight, 'default header height formula is understood');
  const top = Math.max(14, safeAreaInsetTop + 10);
  return Math.max(Number(minHeight[1]), top + Number(bottomPadding[1]) + Number(contentHeight[1]));
}

function specificity(selector: string): [number, number, number] {
  const ids = (selector.match(/#[\w-]+/g) ?? []).length;
  const classes = (selector.match(/\.[\w-]+/g) ?? []).length;
  const elements = (selector.match(/(^|[\s>+~])([a-z][\w-]*)/gi) ?? []).length;
  return [ids, classes, elements];
}

function compareSpecificity(a: [number, number, number], b: [number, number, number]): number {
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
  }
  return 0;
}

test('expanded portrait visibly reduces both actual headers and keeps safe area on the physical top pane', () => {
  const lucySelector = 'html.duo-unfolded-portrait .duo-dual-view.flex-col #duo-lucy-viewport .lucy-chat-header';
  const lucyRule = css.match(
    /html\.duo-unfolded-portrait \.duo-dual-view\.flex-col #duo-lucy-viewport \.lucy-chat-header\s*\{([^}]*)\}/,
  );
  const cosmicRule = css.match(
    /html\.duo-unfolded-portrait #duo-content-viewport \.cosmic-room-header\s*\{([^}]*)\}/,
  );
  assert.ok(lucyRule, 'targets the actual Lucy header in its Duo pane');
  assert.ok(cosmicRule, 'targets the actual Cosmic Pro header in its content pane');
  assert.equal(
    compareSpecificity(specificity(lucySelector), specificity('.duo-dual-view.flex-col #duo-lucy-viewport .lucy-chat-header')),
    1,
    'portrait Lucy sizing must outrank the shared Duo header height rule',
  );

  for (const [name, rule, variable] of [
    ['Lucy', lucyRule[1], '--duo-portrait-lucy-header-height'],
    ['Cosmic Pro', cosmicRule[1], '--duo-portrait-content-header-height'],
  ] as const) {
    assert.match(rule, /box-sizing:\s*border-box\s*!important/, `${name} uses border-box sizing`);
    for (const property of ['height', 'min-height', 'max-height']) {
      assert.match(rule, new RegExp(`${property}:\\s*var\\(${variable}\\)\\s*!important`), `${name} ${property} is constrained`);
    }
  }

  // Old max(56px, env(...) + 40px) yielded 56px vs the 58px default at env=0 — only 2px.
  // The new 40px lower-pane bar gives an 18px reduction, so the regression cannot pass on that old rule.
  assert.equal(defaultHeaderHeight(0), 58);
  for (const swapped of [false, true]) {
    assert.equal(portraitHeaderHeight('--duo-portrait-lucy-header-height', 0, swapped), 40);
    assert.equal(portraitHeaderHeight('--duo-portrait-content-header-height', 0, swapped), 40);
  }
  assert.equal(defaultHeaderHeight(0) - portraitHeaderHeight('--duo-portrait-lucy-header-height', 0, false), 18);

  // With a 59px device inset, only the physical top pane gets it (99px total); the bottom pane remains 40px.
  assert.equal(defaultHeaderHeight(59), 113);
  for (const swapped of [false, true]) {
    const lucy = portraitHeaderHeight('--duo-portrait-lucy-header-height', 59, swapped);
    const cosmic = portraitHeaderHeight('--duo-portrait-content-header-height', 59, swapped);
    const upper = swapped ? lucy : cosmic;
    const lower = swapped ? cosmic : lucy;
    assert.equal(upper, 99);
    assert.equal(lower, 40);
    assert.equal(defaultHeaderHeight(59) - upper, 14);
  }

  const topInsetRule = css.match(
    /html\.duo-unfolded-portrait:not\(\.duo-panels-swapped\) #duo-content-viewport \.cosmic-room-header,\s*html\.duo-unfolded-portrait\.duo-panels-swapped #duo-lucy-viewport \.lucy-chat-header\s*\{([^}]*)\}/,
  );
  const lowerPaneRule = css.match(
    /html\.duo-unfolded-portrait:not\(\.duo-panels-swapped\) #duo-lucy-viewport \.lucy-chat-header,\s*html\.duo-unfolded-portrait\.duo-panels-swapped #duo-content-viewport \.cosmic-room-header\s*\{([^}]*)\}/,
  );
  assert.ok(topInsetRule);
  assert.match(topInsetRule[1], /padding-top:\s*env\(safe-area-inset-top,\s*0px\) !important/);
  assert.ok(lowerPaneRule);
  assert.match(lowerPaneRule[1], /padding-top:\s*0 !important/);
});

test('the portrait-only height change leaves default, folded and landscape sizing unchanged', () => {
  assert.match(
    css,
    /:root\s*\{[^}]*--duo-pane-header-height:\s*max\(var\(--orb-header-min-height\),\s*calc\(var\(--orb-header-pad-top\) \+ var\(--orb-header-pad-bottom\) \+ 32px\)\)/s,
  );
  assert.doesNotMatch(css, /html\.duo-unfolded-landscape\s*\{[^}]*--duo-portrait-(?:content|lucy)-header-height:/s);
  assert.doesNotMatch(css, /html\.duo-unfolded-portrait\s*\{[^}]*--duo-pane-header-height:/s);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import {
  chooseStableViewportBox,
  planViewportRecovery,
  resolveAppLayoutHeight,
  resolveViewportBox,
  viewportNeedsResumeFill,
  applyVisualViewportBox,
  applyAppLayoutViewport,
  applyKeyboardLayoutViewport,
  isKeyboardViewportOpen,
} from '../src/lib/visualViewportBox';
import {
  consumeAppUpdateReload,
  createSingleFlight,
  installSingleAppReload,
  isAppUpdateReloadMarked,
} from '../src/lib/appUpdateReload';

test('portrait uses the newer visible height once the viewport widths agree', () => {
  const layout = { innerWidth: 390, innerHeight: 760 };
  assert.equal(resolveAppLayoutHeight({
    ...layout, visual: { width: 844, height: 390, offsetTop: 0, offsetLeft: 0 },
  }), 'max(100dvh, 760px)');
  assert.equal(resolveAppLayoutHeight({
    ...layout, visual: { width: 390, height: 844, offsetTop: 0, offsetLeft: 0 },
  }), 'max(100dvh, 844px)');
});

test('only an installed iOS tablet fills a corroborated shortfall to the screen edge', () => {
  const layout = { innerWidth: 768, innerHeight: 945, screenWidth: 768, screenHeight: 1024 };
  assert.equal(resolveAppLayoutHeight(layout), 'max(100dvh, 945px)');
  assert.equal(resolveAppLayoutHeight({ ...layout, iosStandalone: true }), 'max(100dvh, 1024px)');
});

test('a shorter visual viewport cannot shrink the app below the layout bottom', () => {
  assert.equal(resolveAppLayoutHeight({
    innerWidth: 1280, innerHeight: 900,
    visual: { width: 1280, height: 790, offsetTop: 0, offsetLeft: 0 },
  }), 'max(100dvh, 900px)');
});

test('a landscape tablet still fills the screen when its shortened web view falls below 600px', () => {
  const snapshot = {
    iosStandalone: true,
    innerWidth: 960, innerHeight: 592.5,
    screenWidth: 960, screenHeight: 675,
    visual: { width: 960, height: 592.5, offsetTop: 0, offsetLeft: 0 },
  };
  assert.equal(resolveAppLayoutHeight(snapshot), 'max(100dvh, 675px)');
  assert.equal(resolveAppLayoutHeight({ ...snapshot, iosStandalone: false }), 'max(100dvh, 592.5px)');
});

test('phone and keyboard-sized shrinkage do not expand to the screen', () => {
  assert.equal(resolveAppLayoutHeight({
    iosStandalone: true, innerWidth: 390, innerHeight: 760,
    screenWidth: 390, screenHeight: 844,
  }), 'max(100dvh, 760px)');
  assert.equal(resolveAppLayoutHeight({
    iosStandalone: true, innerWidth: 960, innerHeight: 350,
    screenWidth: 960, screenHeight: 675,
    visual: { width: 960, height: 350, offsetTop: 0, offsetLeft: 0 },
  }), 'max(100dvh, 350px)');
});

test('keyboard dismissal restores a small stale gap even while the textarea stays focused', () => {
  const snapshot = {
    iosStandalone: true, innerWidth: 1280, innerHeight: 790,
    screenWidth: 1280, screenHeight: 900,
    visual: { width: 1280, height: 790, offsetTop: 0, offsetLeft: 0 },
  };
  assert.equal(isKeyboardViewportOpen(snapshot, true), false);
  assert.equal(resolveAppLayoutHeight(snapshot), 'max(100dvh, 900px)');
  const open = { ...snapshot, visual: { ...snapshot.visual, height: 450 } };
  assert.equal(isKeyboardViewportOpen(open, true), true);
  assert.equal(isKeyboardViewportOpen(open, false), false);
  assert.equal(isKeyboardViewportOpen({ ...open, innerHeight: 450 }, true), true);
});

test('browser toolbars and rotated viewport widths do not masquerade as keyboards', () => {
  assert.equal(isKeyboardViewportOpen({
    innerWidth: 390, innerHeight: 760, screenWidth: 390, screenHeight: 844,
    visual: { width: 390, height: 650, offsetTop: 0, offsetLeft: 0 },
  }, true), false);
  assert.equal(isKeyboardViewportOpen({
    innerWidth: 390, innerHeight: 844,
    visual: { width: 844, height: 390, offsetTop: 0, offsetLeft: 0 },
  }, true), false);
});

test('restoring the same viewport repairs height variables overwritten by the keyboard hook', () => {
  const values = new Map<string, string>();
  const root = {
    style: {
      setProperty: (key: string, value: string) => { values.set(key, value); },
      getPropertyValue: (key: string) => values.get(key) ?? '',
    },
    toggleAttribute: () => {},
  } as unknown as HTMLElement;
  const full = { width: 1280, height: 900, offsetTop: 0, offsetLeft: 0, bottomGap: 0 };
  applyVisualViewportBox(full, root);
  values.set('--vvh', '450px');
  values.set('--visual-vh', '450px');
  values.set('--vv-top', '100px');
  applyVisualViewportBox(full, root);
  assert.equal(values.get('--vvh'), '900px');
  assert.equal(values.get('--visual-vh'), '900px');
  assert.equal(values.get('--vv-top'), '0px');
});

test('an open-app update fills a tablet letterbox when the reported heights disagree', () => {
  const stale = {
    iosStandalone: true,
    innerWidth: 960,
    innerHeight: 592.5,
    screenWidth: 960,
    screenHeight: 675,
    visual: { width: 960, height: 520, offsetTop: 0, offsetLeft: 0 },
  };
  assert.equal(resolveAppLayoutHeight(stale), 'max(100dvh, 675px)');
  const filled = resolveViewportBox(stale, { fillLayoutGap: true });
  assert.equal(filled?.height, 675);
  assert.equal(filled?.width, 960);
  assert.equal(viewportNeedsResumeFill(stale, false, null), true);

  const settled = {
    ...stale,
    innerHeight: 675,
    visual: { ...stale.visual, height: 675 },
  };
  assert.equal(resolveAppLayoutHeight(settled), 'max(100dvh, 675px)');
  assert.equal(resolveViewportBox(settled, { fillLayoutGap: true })?.width, 960);
});

test('a later short reading cannot undo the filled height, and width stays put', () => {
  const filled = { width: 960, height: 675, offsetTop: 0, offsetLeft: 0, bottomGap: 0 };
  const shrunk = { ...filled, height: 520 };
  assert.equal(chooseStableViewportBox(filled, shrunk, true).height, 675);
  assert.equal(chooseStableViewportBox(filled, shrunk, true).width, 960);
  assert.equal(chooseStableViewportBox(shrunk, filled, true).height, 675);
  assert.equal(chooseStableViewportBox(filled, { ...shrunk, width: 700 }, true).width, 700);
  assert.equal(chooseStableViewportBox(filled, shrunk, false).height, 520);
});

test('browser, phone, keyboard, and split widths do not grow', () => {
  const stale = {
    innerWidth: 960, innerHeight: 592.5, screenWidth: 960, screenHeight: 675,
    visual: { width: 960, height: 520, offsetTop: 0, offsetLeft: 0 },
  };
  assert.equal(resolveAppLayoutHeight({ ...stale, iosStandalone: false }), 'max(100dvh, 592.5px)');
  assert.equal(resolveAppLayoutHeight({
    iosStandalone: true, innerWidth: 390, innerHeight: 760,
    screenWidth: 390, screenHeight: 844,
    visual: { width: 390, height: 700, offsetTop: 0, offsetLeft: 0 },
  }), 'max(100dvh, 760px)');
  assert.equal(resolveAppLayoutHeight({
    iosStandalone: true, innerWidth: 960, innerHeight: 350,
    screenWidth: 960, screenHeight: 675,
    visual: { width: 960, height: 350, offsetTop: 0, offsetLeft: 0 },
  }), 'max(100dvh, 350px)');
  const split = resolveViewportBox({
    iosStandalone: true, innerWidth: 512, innerHeight: 700,
    screenWidth: 1024, screenHeight: 768,
    visual: { width: 512, height: 640, offsetTop: 0, offsetLeft: 0 },
  }, { fillLayoutGap: true });
  assert.equal(split?.width, 512);
  assert.equal(split?.height, 700);
});

test('an in-app update reloads once and the page that stays open plans a resume', () => {
  const store = new Map<string, string>();
  const storage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => { store.set(key, value); },
    removeItem: (key: string) => { store.delete(key); },
  };
  let calls = 0;
  const win = {
    sessionStorage: storage,
    location: { reload() { calls += 1; } },
  };
  installSingleAppReload(win as unknown as Window);
  win.location.reload();
  win.location.reload();
  assert.equal(calls, 1);
  assert.equal(isAppUpdateReloadMarked(storage), true);
  assert.equal(consumeAppUpdateReload(storage), true);
  assert.equal(consumeAppUpdateReload(storage), false);

  const update = planViewportRecovery({ updateReload: true, navigationType: 'navigate', iosStandalone: true });
  assert.equal(update.recover, true);
  assert.equal(update.resetScroll, true);
  assert.equal(update.extendRetries, true);
  const cold = planViewportRecovery({ navigationType: 'navigate', persisted: false, iosStandalone: true });
  assert.equal(cold.recover, false);
  assert.equal(planViewportRecovery({ navigationType: 'reload', iosStandalone: false }).resetScroll, false);
  assert.equal(planViewportRecovery({ persisted: true, iosStandalone: true }).recover, true);

  let flights = 0;
  const once = createSingleFlight(() => { flights += 1; });
  once();
  once();
  assert.equal(flights, 1);
});

test('the update path does not schedule a second navigation after reload starts', () => {
  const sync = readFileSync(new URL('../src/lib/prismSync.ts', import.meta.url), 'utf8');
  const marker = "if (swState === 'reloading')";
  const at = sync.indexOf(marker);
  assert.ok(at > 0);
  const block = sync.slice(at, at + 180);
  assert.match(block, /clearTimeout\(fallbackId\)/);
  const main = readFileSync(new URL('../src/main.tsx', import.meta.url), 'utf8');
  assert.ok(main.indexOf('installSingleAppReload(window)') < main.indexOf('registerSW('));

});

test('late update recovery restores app height and clears stale keyboard constraints together', () => {
  const makeElement = () => {
    const values = new Map<string, string>([['height', '450px'], ['max-height', '450px'], ['top', '100px']]);
    const classes = new Set(['keyboard-open']);
    return {
      values, classes,
      style: {
        setProperty: (key: string, value: string) => { values.set(key, value); },
        removeProperty: (key: string) => { values.delete(key); return ''; },
      },
      classList: { remove: (key: string) => { classes.delete(key); } },
    };
  };
  const html = makeElement(), body = makeElement(), root = makeElement(), shell = makeElement();
  const doc = {
    documentElement: html, body,
    getElementById: () => ({ ...root, querySelector: () => shell }),
  } as unknown as Document;
  const full = { width: 960, height: 675, offsetTop: 0, offsetLeft: 0, bottomGap: 0 };
  applyAppLayoutViewport(full, doc);
  assert.equal(html.values.get('--app-height'), 'max(100dvh, 675px)');
  assert.equal(root.values.has('max-height'), false);
  assert.equal(root.values.has('top'), false);
  assert.equal(shell.values.has('height'), false);
  assert.equal(html.classes.has('keyboard-open'), false);
  assert.equal(body.classes.has('keyboard-open'), false);
  html.values.set('--app-height', '520px');
  applyAppLayoutViewport(full, doc);
  assert.equal(html.values.get('--app-height'), 'max(100dvh, 675px)');
});


test('unfolded portrait cold launch fills the newer visible height without a reload', () => {
  const starting = {
    innerWidth: 900, innerHeight: 1170,
    screenWidth: 900, screenHeight: 1280,
    visual: { width: 900, height: 1280, offsetTop: 110, offsetLeft: 0 },
  };
  const box = resolveViewportBox(starting)!;
  assert.equal(box.width, 900);
  assert.equal(box.height, 1280);
  assert.equal(box.offsetTop, 0);
  assert.equal(resolveAppLayoutHeight(starting), 'max(100dvh, 1280px)');
  assert.equal(resolveViewportBox({ ...starting, innerHeight: 1280 })?.height, box.height);
  // Neither a cover-screen measurement nor a shorter keyboard may size the shell.
  assert.equal(resolveViewportBox({ ...starting, visual: { ...starting.visual, width: 400 } })?.height, 1170);
  assert.equal(resolveViewportBox({ ...starting, visual: { ...starting.visual, height: 600 } })?.height, 1170);
});


test('installed iPhone Duo uses CSS viewport even when both JS readings remain short', () => {
  const snapshot = {
    iosStandalone: true, innerWidth: 450, innerHeight: 562.5,
    screenWidth: 450, screenHeight: 640, cssViewportHeight: 640,
    visual: { width: 450, height: 562.5, offsetTop: 50, offsetLeft: 0 },
  };
  assert.equal(resolveViewportBox(snapshot)?.height, 640);
  assert.equal(resolveAppLayoutHeight(snapshot), 'max(100dvh, 640px)');
  assert.equal(resolveViewportBox({ ...snapshot, iosStandalone: false })?.height, 562.5);
  assert.equal(isKeyboardViewportOpen(snapshot, true), false);
  assert.equal(isKeyboardViewportOpen({ ...snapshot, innerHeight: 300, visual: { ...snapshot.visual, height: 300 } }, true), true);
});

test('one geometry owner restores root, sidebar variables and shell after keyboard dismissal', () => {
  const makeElement = () => {
    const values = new Map<string, string>();
    const classes = new Set<string>();
    return {
      values, classes,
      style: {
        setProperty: (k: string, v: string) => { values.set(k, v); },
        getPropertyValue: (k: string) => values.get(k) ?? '',
        removeProperty: (k: string) => { values.delete(k); return ''; },
      },
      classList: { add: (k: string) => { classes.add(k); }, remove: (k: string) => { classes.delete(k); } },
      toggleAttribute: () => {},
    };
  };
  const html = makeElement(), body = makeElement(), root = makeElement(), shell = makeElement();
  const doc = { documentElement: html, body, getElementById: () => ({ ...root, querySelector: () => shell }) } as unknown as Document;
  const full = { width: 450, height: 640, offsetTop: 0, offsetLeft: 0, bottomGap: 0 };
  applyVisualViewportBox(full, html as unknown as HTMLElement);
  applyKeyboardLayoutViewport({ ...full, height: 300, offsetTop: 50 }, doc);
  assert.equal(root.values.get('height'), '300px');
  assert.equal(html.values.get('--app-height'), '300px');
  assert.equal(html.values.get('--vv-top'), '50px');
  applyVisualViewportBox(full, html as unknown as HTMLElement);
  applyAppLayoutViewport(full, doc);
  assert.equal(html.values.get('--app-height'), 'max(100dvh, 640px)');
  assert.equal(html.values.get('--vv-top'), '0px');
  assert.equal(root.values.has('max-height'), false);
  assert.equal(shell.values.has('height'), false);
  assert.equal(html.classes.has('keyboard-open'), false);
});

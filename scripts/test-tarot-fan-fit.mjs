import { build } from 'esbuild';
import { webkit } from '@playwright/test';
import { readFile, readdir, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

const fixture = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import { TarotSpread } from './src/components/trinity/TarotSpread';
import { OverlayPaneContext } from './src/components/layout/OverlayPaneContext';
import { isDuoUnfoldedState } from './src/lib/perfMode';
window.applyDuo = () => {
  const state = isDuoUnfoldedState();
  const root = document.documentElement;
  root.classList.toggle('duo-unfolded-mode', state.unfolded);
  root.classList.toggle('duo-unfolded-portrait', state.unfolded && state.orientation === 'portrait');
  root.classList.toggle('duo-unfolded-landscape', state.unfolded && state.orientation === 'landscape');
  document.body.classList.toggle('duo-unfolded-mode', state.unfolded);
  document.body.classList.toggle('duo-unfolded-portrait', state.unfolded && state.orientation === 'portrait');
  document.body.classList.toggle('duo-unfolded-landscape', state.unfolded && state.orientation === 'landscape');
  const content = document.getElementById('duo-content-viewport');
  const lucy = document.getElementById('duo-lucy-viewport');
  if (!state.unfolded) {
    content.style.cssText = 'display:flex;width:100%;height:100%;flex:1 1 0%;min-height:0';
    lucy.style.cssText = 'display:none';
  } else if (state.orientation === 'portrait') {
    content.style.cssText = 'display:flex;height:50%;min-height:50%;max-height:50%;width:100%;flex:0 0 50%';
    lucy.style.cssText = 'display:flex;height:50%;min-height:50%;max-height:50%;width:100%;flex:0 0 50%';
  } else {
    content.style.cssText = 'display:flex;width:50vw;min-width:50vw;max-width:50vw;height:100%;flex:0 0 50vw';
    lucy.style.cssText = 'display:flex;flex:1 1 0px;width:calc(50vw - var(--sites-sidebar-width, 80px));height:100%';
  }
  window.dispatchEvent(new Event('resize'));
  return state;
};
function App(){
  return (
    <OverlayPaneContext.Provider value="content">
      <TarotSpread onComplete={()=>{}} onCancel={()=>{}} maxCards={4} spreadName="기적수업 지각전환 스프레드" positions={['현재 재정 상태','돈이 막히는 지점','들어올 기회','실천 조언']} />
    </OverlayPaneContext.Provider>
  );
}
createRoot(document.getElementById('mount')).render(<App/>);
`;

const bundle = await build({
  stdin: { contents: fixture, resolveDir: process.cwd(), loader: 'tsx' },
  bundle: true, write: false, format: 'iife', loader: { '.css': 'empty' },
  alias: { '@': `${process.cwd()}/src` },
});
const css = (await readdir('dist/assets')).find(file => /^main-.*\.css$/.test(file));
const artifactDir = process.env.LUCKEY_ARTIFACT_DIR || '/tmp/luckey-ui-artifacts';
await mkdir(artifactDir, { recursive: true });
const browser = await webkit.launch({ headless: true, ...(process.env.LUCKEY_WEBKIT_EXECUTABLE ? {executablePath:process.env.LUCKEY_WEBKIT_EXECUTABLE} : {}) });


try {
  const page = await browser.newPage({
    viewport: { width: 690, height: 1024 },
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 1,
  });
  await page.setContent(`<!doctype html><html class="dark"><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>
<div id="root"><div class="prism-app-shell">
<main class="sites-pinned-main flex-1 min-h-0 overflow-x-hidden relative w-full flex flex-col">
  <div class="w-full h-full min-h-0 overflow-hidden flex relative flex-col">
    <div id="duo-content-viewport" data-workspace-pane="content" class="duo-folded-view shrink-0 flex flex-col overflow-hidden relative" style="display:flex;width:100%;height:100%;flex:1 1 0%;min-height:0">
      <div id="mount"></div>
    </div>
    <div id="duo-lucy-viewport" data-workspace-pane="lucy" style="display:none"></div>
  </div>
</main>
</div></div>
<aside class="sites-pinned-sidebar" id="main-sidebar-navigation"></aside>
</body></html>`);
  await page.addStyleTag({ content: await readFile(`dist/assets/${css}`, 'utf8') });
  await page.addStyleTag({ content: `
    html.tarot-gutter .sites-pinned-main {
      width: calc(100% - var(--sites-sidebar-width) - 80px) !important;
      max-width: calc(100% - var(--sites-sidebar-width) - 80px) !important;
    }
  ` });
  await page.addScriptTag({ content: bundle.outputFiles[0].text });
  await page.locator('#tarot-stage-container').waitFor({ state: 'visible' });

  const check = async (label, { duo = false, rail = 120, gutter = false, sideRail = true } = {}) => {
    await page.evaluate(({ duo, rail, gutter }) => {
      document.documentElement.style.setProperty('--sites-sidebar-width', `${rail}px`);
      document.documentElement.classList.toggle('tarot-gutter', gutter);
      if (duo) window.applyDuo();
      else {
        for (const node of [document.documentElement, document.body]) {
          node.classList.remove('duo-unfolded-mode', 'duo-unfolded-portrait', 'duo-unfolded-landscape');
        }
        document.getElementById('duo-content-viewport').style.cssText = 'display:flex;width:100%;height:100%;flex:1 1 0%;min-height:0';
        document.getElementById('duo-lucy-viewport').style.cssText = 'display:none';
        window.dispatchEvent(new Event('resize'));
      }
    }, { duo, rail, gutter });
    await page.evaluate(() => new Promise(resolve => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    }));
    const box = await page.evaluate(() => {
      const rect = (element) => {
        if (!element) return null;
        const bounds = element.getBoundingClientRect();
        return { left: bounds.left, right: bounds.right, top: bounds.top, bottom: bounds.bottom, width: bounds.width, height: bounds.height };
      };
      const stage = document.getElementById('tarot-stage-container');
      const railEl = document.querySelector('.sites-pinned-sidebar');
      const controls = stage.querySelector('[data-tarot-controls]');
      const wheel = stage.querySelector('[data-fan-radius]');
      const wheelBox = stage.querySelector('.cursor-grab') || wheel?.parentElement;
      const buttons = [...controls.querySelectorAll('button')].map(button => ({ text: button.textContent.replace(/\s+/g, ''), ...rect(button) }));
      const stageBox = rect(stage);
      const stageCenter = stageBox.left + stageBox.width / 2;
      const cards = [...stage.querySelectorAll('[data-card-id]')].map(rect);
      const centerCard = cards.slice().sort((a, b) => Math.abs((a.left + a.right) / 2 - stageCenter) - Math.abs((b.left + b.right) / 2 - stageCenter))[0];
      const fanRight = cards.reduce((max, card) => Math.max(max, card.right), 0);
      return {
        stage: stageBox,
        rail: rect(railEl),
        wheel: rect(wheelBox),
        buttons,
        radius: Number(wheel?.dataset.fanRadius || 0),
        yOffset: Number(wheel?.dataset.fanYOffset || 0),
        center: centerCard ? (centerCard.left + centerCard.right) / 2 : null,
        fanRight,
      };
    });
    assert(box.stage.width > 120 && box.stage.height > 120, `${label} stage has a canvas`);
    const coversRail = box.stage.left < box.rail.right - 1 && box.stage.right > box.rail.left + 1
      && box.stage.top < box.rail.bottom - 1 && box.stage.bottom > box.rail.top + 1;
    assert(!coversRail, `${label} stage stays out of the rail ${JSON.stringify(box.stage)} rail ${JSON.stringify(box.rail)}`);
    if (sideRail) {
      assert(Math.abs(box.stage.right - box.rail.left) <= 2, `${label} stage meets the rail, stage ${box.stage.right} rail ${box.rail.left}`);
      assert(box.stage.left <= 2, `${label} stage starts at the content edge`);
    }
    assert(box.radius > 0 && box.radius <= box.wheel.width * 0.54 + 1, `${label} arc fits its local width`);
    assert(box.wheel.height / 2 + box.yOffset >= box.wheel.height, `${label} hub stays below the visible stage`);
    assert(box.buttons.length === 4, `${label} has four controls`);
    for (const button of box.buttons) {
      assert(button.left >= box.stage.left - 1 && button.right <= box.stage.right + 1, `${label} ${button.text} is inside the content width`);
      assert(button.width > 24, `${label} ${button.text} is visible`);
    }
    assert(box.center != null && Math.abs(box.center - (box.stage.left + box.stage.width / 2)) < 24, `${label} front card is centered`);
    if (sideRail && box.radius > box.stage.width / 2) {
      assert(box.fanRight >= box.stage.right - 2, `${label} fan reaches the rail edge, fan ${box.fanRight} stage ${box.stage.right}`);
    }
    return box;
  };

  const fitted = await check('690x1024 side rail', { rail: 120 });
  assert(fitted.stage.width >= 540 && fitted.stage.width <= 590, `column beside the 120px rail, got ${fitted.stage.width}`);
  assert(fitted.wheel.height / 2 + fitted.yOffset >= fitted.wheel.height, 'portrait fan cannot become a full ring');
  assert(fitted.yOffset >= fitted.wheel.height / 2, 'portrait hub remains below the viewport');
  await page.screenshot({ path: `${artifactDir}/tarot-fan-690.png` });

  const gutter = await check('690x1024 gutter before rail', { rail: 120, gutter: true });
  assert(Math.abs(gutter.stage.right - gutter.rail.left) <= 2, 'gutter is closed up to the rail');
  assert(gutter.stage.width > 540, `gutter fix uses the full column, got ${gutter.stage.width}`);
  await page.screenshot({ path: `${artifactDir}/tarot-fan-690-gutter.png` });

  await page.setViewportSize({ width: 393, height: 852 });
  await check('393x852 folded rail', { rail: 80 });
  await page.screenshot({ path: `${artifactDir}/tarot-fan-393.png` });

  await page.setViewportSize({ width: 900, height: 640 });
  const landscape = await check('900x640 unfolded landscape', { duo: true, rail: 80, sideRail: false });
  assert(landscape.stage.right <= landscape.rail.left - 40, 'landscape fan stays in the content pane');
  assert(landscape.radius !== 460 || landscape.wheel.width >= 540, 'landscape uses the landscape arc');
  await page.screenshot({ path: `${artifactDir}/tarot-fan-900.png` });

  await page.setViewportSize({ width: 700, height: 980 });
  await check('700x980 portrait', { duo: true, rail: 80, sideRail: false });
  await page.screenshot({ path: `${artifactDir}/tarot-fan-700.png` });

  console.log('PASS: original tarot fan fills the width up to the rail');
} finally {
  await browser.close();
}

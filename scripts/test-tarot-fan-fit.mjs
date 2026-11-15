import { build } from 'esbuild';
import { webkit } from '@playwright/test';
import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

const fixture = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import { TarotSpread } from './src/components/trinity/TarotSpread';
import { isDuoUnfoldedState } from './src/lib/perfMode';
import { fanCardWidth, maxFanRadius } from './src/components/trinity/tarotRingLayout';
window.fanCardWidth = fanCardWidth;
window.maxFanRadius = maxFanRadius;
window.applyDuo = () => {
  const state = isDuoUnfoldedState();
  const root = document.documentElement;
  root.classList.toggle('duo-unfolded-mode', state.unfolded);
  root.classList.toggle('duo-unfolded-portrait', state.unfolded && state.orientation === 'portrait');
  root.classList.toggle('duo-unfolded-landscape', state.unfolded && state.orientation === 'landscape');
  document.body.classList.toggle('duo-unfolded-mode', state.unfolded);
  document.body.classList.toggle('duo-unfolded-portrait', state.unfolded && state.orientation === 'portrait');
  document.body.classList.toggle('duo-unfolded-landscape', state.unfolded && state.orientation === 'landscape');
  window.dispatchEvent(new Event('resize'));
  return state;
};
function App(){
  return <TarotSpread onComplete={()=>{}} onCancel={()=>{}} maxCards={3} spreadName="기적수업 지각전환 스프레드" positions={['에고의 환영과 두려움','거룩한 순간과 지각의 전환','참된 용서와 평화의 기적']} />;
}
createRoot(document.getElementById('root')).render(<App/>);
`;
const bundle = await build({
  stdin: { contents: fixture, resolveDir: process.cwd(), loader: 'tsx' },
  bundle: true, write: false, format: 'iife', loader: { '.css': 'empty' },
  alias: { '@': `${process.cwd()}/src` },
});
const css = (await readdir('dist/assets')).find(file => /^main-.*\.css$/.test(file));
const browser = await webkit.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 690, height: 1024 },
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 1,
  });
  await page.setContent(`<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>
<main class="sites-pinned-main"><div id="root"></div></main>
<aside class="sites-pinned-sidebar"></aside>
</body></html>`);
  await page.addStyleTag({ content: await readFile(`dist/assets/${css}`, 'utf8') });
  await page.addStyleTag({ content: `
    html, body { margin: 0; height: 100%; background: #05070d; }
    .sites-pinned-main { position: fixed; top: 0; left: 0; bottom: 0; right: var(--rail, 120px); }
    .sites-pinned-sidebar {
      position: fixed !important; top: 0 !important; right: 0 !important; bottom: 0 !important; left: auto !important;
      width: var(--rail, 120px) !important; height: 100% !important; max-width: none !important; background: #151d29;
    }
  ` });
  await page.addScriptTag({ content: bundle.outputFiles[0].text });
  await page.locator('#tarot-stage-container').waitFor({ state: 'visible' });

  const check = async (label, { duo = false, rail = 120 } = {}) => {
    await page.evaluate(({ duo, rail }) => {
      document.documentElement.style.setProperty('--rail', `${rail}px`);
      document.documentElement.style.setProperty('--sites-sidebar-width', `${rail}px`);
      if (duo) window.applyDuo();
      else {
        for (const node of [document.documentElement, document.body]) {
          node.classList.remove('duo-unfolded-mode', 'duo-unfolded-portrait', 'duo-unfolded-landscape');
        }
        window.dispatchEvent(new Event('resize'));
      }
    }, { duo, rail });
    await page.evaluate(() => new Promise(resolve => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    }));
    const box = await page.evaluate(() => {
      const rect = (element) => {
        const bounds = element.getBoundingClientRect();
        return { left: bounds.left, right: bounds.right, top: bounds.top, bottom: bounds.bottom, width: bounds.width, height: bounds.height };
      };
      const stage = document.getElementById('tarot-stage-container');
      const rail = document.querySelector('.sites-pinned-sidebar');
      const controls = stage.querySelector('[data-tarot-controls]');
      const wheel = stage.querySelector('[data-fan-radius]');
      const buttons = [...controls.querySelectorAll('button')].map(button => ({ text: button.textContent.replace(/\s+/g, ''), ...rect(button) }));
      const stageBox = rect(stage);
      const stageCenter = stageBox.left + stageBox.width / 2;
      const centerCard = [...stage.querySelectorAll('[data-card-id]')].map(rect).sort((a, b) => Math.abs((a.left + a.right) / 2 - stageCenter) - Math.abs((b.left + b.right) / 2 - stageCenter))[0];
      return {
        stage: stageBox,
        rail: rect(rail),
        controls: rect(controls),
        buttons,
        radius: Number(wheel?.dataset.fanRadius || 0),
        cardWidth: window.fanCardWidth(stage.clientWidth),
        limit: window.maxFanRadius(stage.clientWidth),
        center: centerCard ? (centerCard.left + centerCard.right) / 2 : null,
      };
    });
    assert(box.stage.width > 120 && box.stage.height > 120, `${label} stage has a canvas`);
    const coversRail = box.stage.left < box.rail.right - 1 && box.stage.right > box.rail.left + 1 && box.stage.top < box.rail.bottom - 1 && box.stage.bottom > box.rail.top + 1;
    assert(!coversRail, `${label} stage stays out of the rail ${JSON.stringify(box.stage)} rail ${JSON.stringify(box.rail)}`);
    assert(box.controls.left >= box.stage.left - 1 && box.controls.right <= box.stage.right + 1, `${label} control row stays in the stage`);
    for (const button of box.buttons) {
      assert(button.left >= box.stage.left - 1 && button.right <= box.stage.right + 1, `${label} ${button.text} is inside the content width`);
      assert(button.text.length > 0, `${label} control label is present`);
    }
    assert(box.radius <= box.limit + 1, `${label} fan radius ${box.radius} fits column limit ${box.limit}`);
    assert(box.center != null && Math.abs(box.center - (box.stage.left + box.stage.width / 2)) < 16, `${label} front card is centered in the content column`);
    return box;
  };

  const screenshot = await check('690x1024 side rail', { rail: 120 });
  assert(screenshot.stage.width >= 540 && screenshot.stage.width <= 590, `screenshot column uses the width beside the 120px rail, got ${screenshot.stage.width}`);
  await page.screenshot({ path: '/opt/cursor/artifacts/tarot-fan-690.png' });

  await page.setViewportSize({ width: 393, height: 852 });
  await check('393x852 folded rail', { rail: 80 });

  await page.setViewportSize({ width: 900, height: 640 });
  await check('900x640 unfolded landscape rail', { duo: true, rail: 80 });

  await page.setViewportSize({ width: 700, height: 980 });
  await check('700x980 portrait rail', { duo: true, rail: 80 });

  console.log('PASS: tarot fan and controls stay centered inside the content column beside the rail');
} finally {
  await browser.close();
}

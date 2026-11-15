import { build } from 'esbuild';
import { webkit, devices } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const iphone = devices['iPhone 16 Pro'];
const fixture = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import { DialogTriggerButton } from './src/components/layout/DialogTriggerButton';
import { OverlayPaneContext } from './src/components/layout/OverlayPaneContext';
import { LucyEngineCatalogDialog } from './src/components/chat/LucyEngineCatalogDialog';
import { PromptLibraryModal } from './src/components/chat/PromptLibraryModal';
import { UpdateNoticeModal } from './src/components/UpdateNoticeModal';
import { visualViewportMatchesLayout } from './src/lib/mainOverlayViewport';
window.visualMatches = visualViewportMatchesLayout;
window.activations = 0;
function Libraries() {
  const [open, setOpen] = React.useState(null);
  const openLibrary = (name) => { window.activations += 1; setOpen(name); };
  return <OverlayPaneContext.Provider value="lucy">
    <header className="lucy-chat-header backdrop-blur-xl">
      <DialogTriggerButton id="engine" aria-label="Lucy 엔진과 관점 목록 보기" onClick={() => openLibrary('engine')}>엔진·관점</DialogTriggerButton>
    </header>
    <div className="lucy-chat-main" id="chat"><div className="thread">older messages should stay above the latest line</div></div>
    <footer className="lucy-chat-footer backdrop-blur-xl">
      <div className="lucy-suggestion-toolbar">
        <DialogTriggerButton id="prompt" aria-label="추천질문 라이브러리 열기" onClick={() => openLibrary('prompt')}>질문</DialogTriggerButton>
      </div>
    </footer>
    <LucyEngineCatalogDialog isOpen={open === 'engine'} isLight={false} onClose={() => setOpen(null)} />
    <PromptLibraryModal isOpen={open === 'prompt'} onClose={() => setOpen(null)} onSelectPrompt={() => {}} />
  </OverlayPaneContext.Provider>;
}
function Notice() {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const show = () => setOpen(true);
    const hide = () => setOpen(false);
    window.addEventListener('show-notice', show);
    window.addEventListener('hide-notice', hide);
    return () => { window.removeEventListener('show-notice', show); window.removeEventListener('hide-notice', hide); };
  }, []);
  return <OverlayPaneContext.Provider value="main">
    <UpdateNoticeModal isOpen={open} entries={[{ version: '1.7.498', summary: '펼친 화면 업데이트 내역', items: ['듀얼 화면에서도 보입니다'], builtAt: '2026-11-15T03:00:00.000Z' }]} onClose={() => {}} />
  </OverlayPaneContext.Provider>;
}
createRoot(document.getElementById('lucy-root')).render(<Libraries />);
createRoot(document.getElementById('notice-root')).render(<Notice />);
`;

const bundle = await build({
  stdin: { contents: fixture, resolveDir: process.cwd(), loader: 'tsx' },
  bundle: true,
  write: false,
  format: 'iife',
  loader: { '.css': 'empty' },
  alias: { '@': `${process.cwd()}/src` },
});

const browser = await webkit.launch({ headless: true });
try {
  const page = await browser.newPage({
    userAgent: iphone.userAgent,
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 1,
    hasTouch: true,
    isMobile: true,
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setContent(`<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"></head><body><style>
    * { box-sizing: border-box; }
    html, body { margin: 0; height: 100%; overflow: hidden; }
    .sites-pinned-main { position: fixed; inset: 0 80px 0 0; display: flex; min-height: 0; overflow: hidden; }
    .sites-pinned-sidebar { position: fixed; top: 0; right: 0; width: 80px; height: 100%; }
    #duo-content-viewport, #duo-lucy-viewport { min-width: 0; min-height: 0; }
    .folded [data-workspace-pane="content"] { display: none; }
    .folded [data-workspace-pane="lucy"] { display: flex; flex: 1 1 0; flex-direction: column; width: 100%; height: 100%; max-height: 100%; min-height: 0; overflow: hidden; }
    .unfolded.landscape .sites-pinned-main { flex-direction: row; }
    .unfolded.landscape [data-workspace-pane] { display: flex; width: 50%; height: 100%; flex-direction: column; }
    .unfolded.portrait .sites-pinned-main { inset: 0 0 60px 0; flex-direction: column; }
    .unfolded.portrait .sites-pinned-sidebar { top: auto; bottom: 0; left: 0; width: 100%; height: 60px; }
    .unfolded.portrait [data-workspace-pane] { display: flex; width: 100%; height: 50%; flex-direction: column; }
    .backdrop-blur-xl { backdrop-filter: blur(12px) !important; -webkit-backdrop-filter: blur(12px) !important; }
    #lucy-root { display: flex; flex-direction: column; height: 100%; max-height: 100%; min-height: 0; overflow: hidden; }
    .lucy-chat-header, .lucy-chat-footer { position: relative; z-index: 2; overflow-x: hidden; min-height: 44px; flex: none; display: flex; align-items: center; padding: 8px; background: rgba(16,23,34,.72); }
    .lucy-suggestion-toolbar { display: flex; height: 24px; overflow: hidden; }
    #engine, #prompt { min-width: 44px; min-height: 32px; position: relative; z-index: 1; }
    .lucy-chat-main { flex: 1 1 0; min-height: 0; overflow-y: auto; }
    .thread { height: 2400px; }
    .fixed { position: fixed; } .inset-0 { inset: 0; }
  </style>
  <main class="sites-pinned-main folded" id="workspace">
    <div id="duo-content-slot" data-workspace-pane="content"></div>
    <div id="duo-lucy-slot" data-workspace-pane="lucy"><div id="lucy-root"></div></div>
  </main>
  <nav class="sites-pinned-sidebar"></nav>
  <div id="notice-root"></div></body></html>`);
  const duoCss = await readFile('src/styles/duo-workspace.css', 'utf8');
  const starlight = await readFile('src/styles/lucy-starlight.css', 'utf8');
  await page.addStyleTag({ content: duoCss });
  await page.addStyleTag({ content: starlight });
  await page.addStyleTag({ content: `
    .lucy-chat-shell, .lucy-chat-header, .lucy-chat-main, .lucy-chat-footer { max-width: 100% !important; overflow-x: clip !important; }
    .lucy-chat-main { overflow-anchor: none; touch-action: pan-y; }
  ` });
  await page.evaluate(() => {
    const real = window.visualViewport;
    const cover = () => ({
      width: 390,
      height: Math.min(700, window.innerHeight || 700),
      offsetLeft: 0,
      offsetTop: 0,
      scale: 1,
      addEventListener() {},
      removeEventListener() {},
    });
    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      get() { return window.__staleCoverViewport ? cover() : real; },
    });
    window.__vvStub = true;
  });
  await page.evaluate(() => {
    document.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest('#engine, #prompt')) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
  });
  await page.addScriptTag({ content: bundle.outputFiles[0].text });
  assert.equal(await page.evaluate(() => window.__vvStub), true, 'WebKit allowed a stale visualViewport stand-in');
  assert.equal(await page.evaluate(() => window.visualMatches(900, 640, { width: 390, height: 640, offsetLeft: 0, offsetTop: 0 })), false);
  assert.equal(await page.evaluate(() => window.visualMatches(393, 852, { width: 390, height: 420, offsetLeft: 0, offsetTop: 0 })), true, 'Keyboard-height visual viewport still applies');
  assert.equal(await page.evaluate(() => window.visualMatches(900, 640, { width: 900, height: 640, offsetLeft: 640, offsetTop: 0 })), false);

  const hit = await page.evaluate(() => {
    const button = document.querySelector('#engine');
    const rect = button.getBoundingClientRect();
    const top = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    return { tag: top?.id || top?.tagName, backdrop: getComputedStyle(button.closest('.lucy-chat-header')).backdropFilter };
  });
  assert.equal(hit.tag, 'engine', 'Engine button is the hit target inside the blurred header');
  assert.equal(hit.backdrop, 'none', 'Blur must not live on the button container');

  const layout = await page.evaluate(() => {
    const chat = document.querySelector('.lucy-chat-main');
    chat.scrollTop = chat.scrollHeight;
    const button = document.querySelector('#engine');
    const rect = button.getBoundingClientRect();
    const top = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    const chatRect = chat.getBoundingClientRect();
    return {
      button: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
      chat: { y: chatRect.y, h: chatRect.height, scroll: chat.scrollTop, client: chat.clientHeight, scrollHeight: chat.scrollHeight },
      hit: top?.id || top?.className || top?.tagName,
      root: document.getElementById('lucy-root').getBoundingClientRect().height,
    };
  });
  assert.equal(layout.hit, 'engine', JSON.stringify(layout));
  assert(layout.chat.client < layout.chat.scrollHeight, JSON.stringify(layout));
  await page.locator('#engine').tap();
  await page.locator('#lucy-engine-catalog-dialog').waitFor({ state: 'visible' });
  await page.screenshot({ path: '/opt/cursor/artifacts/iphone-engine-open.png' });
  assert.equal(await page.evaluate(() => window.activations), 1, 'One tap opens the engine list without the swallowed click');

  const overlap = async () => page.evaluate(() => {
    const dialog = document.querySelector('#lucy-engine-catalog-dialog')?.getBoundingClientRect();
    const pane = document.querySelector('[data-workspace-pane="lucy"]')?.getBoundingClientRect();
    if (!dialog || !pane || dialog.width < 48 || dialog.height < 48) return 0;
    const width = Math.min(dialog.right, pane.right) - Math.max(dialog.left, pane.left);
    const height = Math.min(dialog.bottom, pane.bottom) - Math.max(dialog.top, pane.top);
    return Math.max(0, width) * Math.max(0, height);
  });

  const unfold = async (size, mode) => {
    await page.setViewportSize(size);
    await page.evaluate((next) => {
      const workspace = document.getElementById('workspace');
      workspace.className = `sites-pinned-main unfolded ${next}`;
      document.querySelector('[data-workspace-pane="content"]').id = 'duo-content-viewport';
      document.querySelector('[data-workspace-pane="lucy"]').id = 'duo-lucy-viewport';
      window.__staleCoverViewport = true;
      window.dispatchEvent(new Event('resize'));
    }, mode);
    await page.waitForFunction(() => {
      const dialog = document.querySelector('#lucy-engine-catalog-dialog')?.getBoundingClientRect();
      const pane = document.querySelector('#duo-lucy-viewport')?.getBoundingClientRect();
      if (!dialog || !pane || dialog.width < 48 || dialog.height < 48) return false;
      const width = Math.min(dialog.right, pane.right) - Math.max(dialog.left, pane.left);
      const height = Math.min(dialog.bottom, pane.bottom) - Math.max(dialog.top, pane.top);
      return width > 80 && height > 80;
    });
    assert(await overlap() > 80 * 80, `Engine dialog stays on the Lucy pane at ${size.width}x${size.height}`);
  };
  await unfold({ width: 900, height: 640 }, 'landscape');
  await page.screenshot({ path: '/opt/cursor/artifacts/iphone-unfolded-dialog.png' });
  await unfold({ width: 700, height: 980 }, 'portrait');

  await page.evaluate(() => window.dispatchEvent(new Event('show-notice')));
  await page.locator('.update-notice-modal').waitFor({ state: 'visible' });
  const notice = await page.locator('.update-notice-modal').boundingBox();
  assert(notice && notice.width > 120 && notice.height > 80, 'Update notice is visible on the unfolded screen');
  const noticeInside = await page.evaluate(() => {
    const box = document.querySelector('.update-notice-modal').getBoundingClientRect();
    const main = document.querySelector('.sites-pinned-main').getBoundingClientRect();
    return box.left >= main.left - 1 && box.right <= main.right + 1 && box.top >= main.top - 1 && box.bottom <= window.innerHeight;
  });
  assert.equal(noticeInside, true, 'Update notice stays inside the unfolded main canvas');
  await page.screenshot({ path: '/opt/cursor/artifacts/iphone-update-notice.png' });
  await page.evaluate(() => window.dispatchEvent(new Event('hide-notice')));
  await page.locator('.update-notice-modal').waitFor({ state: 'detached' });

  await page.evaluate(() => { document.querySelector('.lucy-chat-main').scrollTop = 0; });
  await page.getByRole('button', { name: '엔진 목록 닫기', exact: true }).tap();
  await page.locator('#lucy-engine-catalog-dialog').waitFor({ state: 'detached' });
  await page.waitForFunction(() => {
    const chat = document.querySelector('.lucy-chat-main');
    return chat.scrollHeight - chat.scrollTop - chat.clientHeight < 4;
  });
  await page.screenshot({ path: '/opt/cursor/artifacts/iphone-chat-bottom.png' });

  await page.locator('#prompt').tap();
  await page.locator('#hori-prompt-library-dialog').waitFor({ state: 'visible' });
  assert.equal(await page.evaluate(() => window.activations), 2);
  const promptPane = await page.evaluate(() => {
    const dialog = document.querySelector('#hori-prompt-library-dialog').getBoundingClientRect();
    const pane = document.querySelector('#duo-lucy-viewport').getBoundingClientRect();
    const width = Math.min(dialog.right, pane.right) - Math.max(dialog.left, pane.left);
    return dialog.width > 48 && width > 80;
  });
  assert.equal(promptPane, true, 'Question library stays on the unfolded Lucy pane');

  await page.evaluate(() => {
    window.__staleCoverViewport = false;
    const button = document.querySelector('#engine');
    const rect = button.getBoundingClientRect();
    const x = rect.left + 8;
    const y = rect.top + 8;
    button.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 9, pointerType: 'touch', isPrimary: true, button: 0, clientX: x, clientY: y }));
    button.dispatchEvent(new PointerEvent('pointercancel', { bubbles: true, pointerId: 9, pointerType: 'touch', clientX: x, clientY: y }));
    button.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 9, pointerType: 'touch', clientX: x, clientY: y }));
  });
  assert.equal(await page.locator('#lucy-engine-catalog-dialog').count(), 0, 'A cancelled pointerup still does not open a dialog');
  assert.deepEqual(errors.filter(message => !message.includes('Invalid URI scheme')), []);
  console.log('PASS: WebKit iPhone taps open both libraries, unfold keeps the dialog, chat stays at the bottom, update notice shows with a stale cover visualViewport');
} finally {
  await browser.close();
}

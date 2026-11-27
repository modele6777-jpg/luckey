import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import React, { act } from 'react';
import { Window } from 'happy-dom';
import { ALL_DCE_ENGINES } from '../src/lib/divination/deterministicEngine.ts';
import {
  resolveMessagePerspectives,
  shouldRestoreCatalogScroll,
  shouldShowAnswerEngines,
} from '../src/lib/lucyAnswerPerspectives.ts';
import {
  clearDivinationToolRequest,
  clearEngineFocus,
  getLastDivinationToolRequest,
  getLastEngineFocus,
  LUCY_DIVINATION_TOOL_EVENT,
  LUCY_ENGINE_BOX_OPEN_EVENT,
  LUCY_ENGINE_FOCUS_EVENT,
  openDivinationToolTab,
  openEngineAtPerspective,
} from '../src/lib/lucyTableBus.ts';
import {
  CLOSED_LUCY_SHEET,
  pickActiveDivinationTab,
  reduceLucySheet,
} from '../src/lib/lucyToolSheetRouting.ts';
import { LucyAnswerEngineBar } from '../src/components/chat/LucyAnswerPerspectiveBar.tsx';

const DEEP = ALL_DCE_ENGINES.filter(engine => engine.category === 'deep_master');
const DEEP_KEY = DEEP[0].key;
const DEEP_KEY_2 = DEEP[1].key;

test('an answer keeps its used tools and deep perspectives apart', () => {
  const engines = resolveMessagePerspectives({
    deepPerspectiveKeys: [DEEP_KEY, 'engine-that-does-not-exist'],
    calculationAudit: [
      { toolId: 'saju', name: '사주명리', status: 'calculated', sentToModel: true },
      { toolId: 'ziwei', name: '자미두수', status: 'skipped', sentToModel: false },
      { toolId: DEEP_KEY_2, name: '심층', status: 'symbolic', sentToModel: true },
    ],
  });

  assert.deepEqual(engines.tools.map(tool => tool.key), ['saju']);
  assert.equal(engines.tools[0].toolId, 'saju', 'foundational tools open the divination tool sheet');
  assert.deepEqual(engines.perspectives.map(item => item.key), [DEEP_KEY_2, DEEP_KEY]);
  assert.ok(engines.perspectives.every(item => item.toolId === undefined), 'perspectives are not tool tabs');
  assert.equal(engines.all.length, 3, 'unknown keys and unused calculations are dropped');
});

test('a key in both the audit and the chosen perspectives appears once with the audit status', () => {
  const engines = resolveMessagePerspectives({
    deepPerspectiveKeys: [DEEP_KEY],
    calculationAudit: [{ toolId: DEEP_KEY, name: '심층', status: 'calculated', sentToModel: true }],
  });

  assert.equal(engines.perspectives.length, 1);
  assert.equal(engines.perspectives[0].status, 'calculated');
});

test('a drawn tarot answer marks tarot as a used tool', () => {
  const engines = resolveMessagePerspectives({
    tarotDraw: { markers: '[TAROT:0:정방향]', revealedCardIds: [] },
  });

  assert.deepEqual(engines.tools.map(tool => tool.key), ['tarot']);
  assert.equal(engines.tools[0].toolId, 'tarot');
  assert.equal(engines.tools[0].status, 'calculated');
});

test('every foundational tool from the audit can open its own divination tab', () => {
  const engines = resolveMessagePerspectives({
    calculationAudit: [
      { toolId: 'astrology', name: '서양 점성술', status: 'partial', sentToModel: true },
      { toolId: 'kyusei', name: '구성학', status: 'calculated', sentToModel: true },
    ],
  });

  assert.deepEqual(engines.tools.map(tool => tool.toolId), ['astrology', 'kyusei']);
});

test('the badges stay hidden for user messages, greetings and answers with no tools or perspectives', () => {
  const engines = resolveMessagePerspectives({ deepPerspectiveKeys: [DEEP_KEY] });
  assert.equal(shouldShowAnswerEngines({ role: 'model', engines }), true);
  assert.equal(shouldShowAnswerEngines({ role: 'user', engines }), false);
  assert.equal(shouldShowAnswerEngines({ role: 'system', engines }), false);
  assert.equal(shouldShowAnswerEngines({ role: 'model', isGreeting: true, engines }), false);
  assert.equal(shouldShowAnswerEngines({ role: 'model', engines: resolveMessagePerspectives({}) }), false);
});

test('an answer that already carries its tools and perspectives shows the badges from its first moment', () => {
  const engines = resolveMessagePerspectives({
    deepPerspectiveKeys: [DEEP_KEY],
    calculationAudit: [{ toolId: 'saju', name: '사주명리', status: 'calculated', sentToModel: true }],
  });

  // 답변 메시지는 관점·도구 메타데이터를 들고 시작하므로 생성 중에도 맨 처음에 배지가 먼저 뜬다.
  assert.equal(shouldShowAnswerEngines({ role: 'model', isGenerating: true, engines }), true);
});

test('the badges sit above Lucy\'s first bubble, not after the last one', () => {
  const page = readFileSync(new URL('../src/pages/LucyStandalonePage.tsx', import.meta.url), 'utf8');
  const barIndex = page.indexOf('<LucyAnswerEngineBar');
  const bubbleIndex = page.indexOf('<LucyKakaoBubbleGroup');

  assert.ok(barIndex > 0, 'the standalone chat renders the answer badges');
  assert.ok(bubbleIndex > barIndex, 'the badges come before the bubble group they belong to');
  assert.equal(page.indexOf('<LucyAnswerEngineBar', barIndex + 1), -1, 'the badges are drawn once per answer');
});

test('an engine box opened from an answer does not restore an old scroll position over the perspective', () => {
  assert.equal(shouldRestoreCatalogScroll(true, ''), true, 'a plain open restores the last position');
  assert.equal(shouldRestoreCatalogScroll(true, DEEP_KEY), false, 'the perspective jump must not be reset to the stored position');
  assert.equal(shouldRestoreCatalogScroll(false, ''), false);
});

test('the perspective button asks for the engine box and remembers the perspective to focus', () => {
  clearEngineFocus();
  openEngineAtPerspective(DEEP_KEY);

  assert.equal(getLastEngineFocus()?.engineKey, DEEP_KEY);
  assert.ok((getLastEngineFocus()?.requestId ?? 0) > 0);
  clearEngineFocus();
  assert.equal(getLastEngineFocus(), null);
});

test('the tool button asks for the divination tool sheet with that tool', () => {
  clearDivinationToolRequest();
  openDivinationToolTab('ziwei');

  assert.equal(getLastDivinationToolRequest()?.toolId, 'ziwei');
  clearDivinationToolRequest();
  assert.equal(getLastDivinationToolRequest(), null);
});

test('the header sheet opens the box each button belongs to', () => {
  let sheet = reduceLucySheet(CLOSED_LUCY_SHEET, { type: 'button', isMasterMode: true });
  assert.deepEqual(sheet, { open: true, variant: 'divination' });

  sheet = reduceLucySheet(sheet, { type: 'close' });
  assert.equal(sheet.open, false);

  sheet = reduceLucySheet(sheet, { type: 'button', isMasterMode: false });
  assert.deepEqual(sheet, { open: true, variant: 'chat' });

  sheet = reduceLucySheet(sheet, { type: 'engine-box' });
  assert.deepEqual(sheet, { open: true, variant: 'chat' });
  assert.equal(reduceLucySheet(sheet, { type: 'close' }).variant, 'chat', 'closing keeps the last kind');

  sheet = reduceLucySheet(sheet, { type: 'divination-tool' });
  assert.deepEqual(sheet, { open: true, variant: 'divination' });
});

test('a requested tool tab wins even while it is locked for this turn', () => {
  const views = [
    { id: 'saju' as const, locked: false },
    { id: 'ziwei' as const, locked: true },
  ];

  assert.equal(pickActiveDivinationTab(views, 'saju', 'ziwei'), 'ziwei');
  assert.equal(pickActiveDivinationTab(views, 'ziwei', null), 'saju', 'locked tab falls back to an open one');
  assert.equal(pickActiveDivinationTab(views, 'saju', null), 'saju');
});

test('the answer bar renders tools and perspectives separately and reports each click', async () => {
  const win = new Window({ url: 'https://answer-bar.invalid' });
  const names = ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle', 'IS_REACT_ACT_ENVIRONMENT', 'CustomEvent', 'Event'];
  const saved = new Map(names.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const key of names) {
    const value = key === 'window' ? win : key === 'document' ? win.document : key === 'getComputedStyle' ? win.getComputedStyle.bind(win) : key === 'IS_REACT_ACT_ENVIRONMENT' ? true : key === 'CustomEvent' ? win.CustomEvent : key === 'Event' ? win.Event : (win as any)[key];
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  }
  let root: any;
  try {
    const host = win.document.createElement('div'); win.document.body.appendChild(host);
    const { createRoot } = await import('react-dom/client'); root = createRoot(host as any);
    const engines = resolveMessagePerspectives({
      deepPerspectiveKeys: [DEEP_KEY],
      calculationAudit: [{ toolId: 'saju', name: '사주명리', status: 'calculated', sentToModel: true }],
    });
    const opened: string[] = [];
    const perspective = (key: string) => opened.push(`perspective:${key}`);
    const tool = (id: string) => opened.push(`tool:${id}`);

    await act(async () => root.render(
      <LucyAnswerEngineBar engines={engines} isLight={false} isMasterMode show onOpenPerspective={perspective} onOpenTool={tool} />,
    ));
    assert.ok(host.querySelector('[data-lucy-answer-tools]'), 'divination mode shows the used tools');
    assert.ok(host.querySelector('[data-lucy-answer-perspectives]'), 'perspectives are shown too');
    assert.match(
      (host.querySelector('[data-lucy-answer-engines]') as any).className,
      /mb-1\.5/,
      'the badge row keeps a small gap above the bubble it sits on',
    );
    assert.match(
      (host.querySelector('[data-lucy-answer-tool="saju"]') as any).className,
      /rounded-full/,
      'each used tool is a small pill badge',
    );
    assert.match(
      (host.querySelector(`[data-lucy-answer-perspective="${DEEP_KEY}"]`) as any).className,
      /rounded-full/,
      'each perspective is a small pill badge',
    );
    await act(async () => {
      (host.querySelector('[data-lucy-answer-tool="saju"]') as any).dispatchEvent(new win.MouseEvent('click', { bubbles: true, detail: 1 }));
      (host.querySelector(`[data-lucy-answer-perspective="${DEEP_KEY}"]`) as any).dispatchEvent(new win.MouseEvent('click', { bubbles: true, detail: 1 }));
    });
    assert.deepEqual(opened, ['tool:saju', `perspective:${DEEP_KEY}`]);

    await act(async () => root.render(
      <LucyAnswerEngineBar engines={engines} isLight isMasterMode={false} show onOpenPerspective={perspective} onOpenTool={tool} />,
    ));
    assert.equal(host.querySelector('[data-lucy-answer-tools]'), null, 'ordinary chat shows perspectives only');
    assert.ok(host.querySelector('[data-lucy-answer-perspectives]'));

    await act(async () => root.render(
      <LucyAnswerEngineBar engines={engines} isLight isMasterMode show={false} onOpenPerspective={perspective} onOpenTool={tool} />,
    ));
    assert.equal(host.querySelector('[data-lucy-answer-engines]'), null, 'greetings and streaming answers carry no buttons');
  } finally {
    if (root) await act(async () => root.unmount());
    for (const [key, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete (globalThis as any)[key];
    }
    await win.happyDOM.close();
  }
});

test('the perspective button scrolls the engine box to that perspective and highlights it', async () => {
  const win = new Window({ url: 'https://engine-box.invalid' });
  const names = ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle', 'IS_REACT_ACT_ENVIRONMENT', 'requestAnimationFrame', 'cancelAnimationFrame', 'CustomEvent', 'Event'];
  const saved = new Map(names.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const key of names) {
    const value = key === 'window' ? win : key === 'document' ? win.document : key === 'getComputedStyle' ? win.getComputedStyle.bind(win) : key === 'IS_REACT_ACT_ENVIRONMENT' ? true : key === 'CustomEvent' ? win.CustomEvent : key === 'Event' ? win.Event : key === 'requestAnimationFrame' ? win.requestAnimationFrame.bind(win) : key === 'cancelAnimationFrame' ? win.cancelAnimationFrame.bind(win) : (win as any)[key];
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  }
  let root: any;
  try {
    const { LucyDeepPerspectivePanel } = await import('../src/components/chat/LucyEngineCatalogDialog.tsx');
    const host = win.document.createElement('div'); win.document.body.appendChild(host);
    const { createRoot } = await import('react-dom/client'); root = createRoot(host as any);

    let boxOpened = 0;
    win.addEventListener(LUCY_ENGINE_BOX_OPEN_EVENT, () => { boxOpened += 1; });
    const target = (ALL_DCE_ENGINES.filter(engine => engine.category === 'deep_master')[60] || DEEP[0]).key;
    openEngineAtPerspective(target);
    assert.equal(boxOpened, 1, 'the perspective button asks for the engine box');

    await act(async () => root.render(<LucyDeepPerspectivePanel />));
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 120)); });

    const entry = host.querySelector(`[data-engine-key="${target}"]`);
    assert.ok(entry, 'the focused perspective is rendered without waiting for the whole catalogue');
    assert.equal(entry!.getAttribute('data-engine-focus'), 'true');
    assert.match(entry!.className, /ring-2 ring-amber-400/);
    assert.ok(entry!.querySelector('[data-engine-focus-badge]'), 'the focused card says it came from this answer');
  } finally {
    if (root) await act(async () => root.unmount());
    for (const [key, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete (globalThis as any)[key];
    }
    await win.happyDOM.close();
    clearEngineFocus();
  }
});

test('the tool button opens the divination sheet body on that tool tab', async () => {
  const win = new Window({ url: 'https://tool-sheet.invalid' });
  const names = ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle', 'IS_REACT_ACT_ENVIRONMENT', 'requestAnimationFrame', 'cancelAnimationFrame', 'CustomEvent', 'Event'];
  const saved = new Map(names.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const key of names) {
    const value = key === 'window' ? win : key === 'document' ? win.document : key === 'getComputedStyle' ? win.getComputedStyle.bind(win) : key === 'IS_REACT_ACT_ENVIRONMENT' ? true : key === 'CustomEvent' ? win.CustomEvent : key === 'Event' ? win.Event : key === 'requestAnimationFrame' ? win.requestAnimationFrame.bind(win) : key === 'cancelAnimationFrame' ? win.cancelAnimationFrame.bind(win) : (win as any)[key];
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  }
  let root: any;
  try {
    const { DivinationTableBody } = await import('../src/components/duo/MasterTableSheet.tsx');
    const { getLucyTableState } = await import('../src/lib/lucyTableBus.ts');
    const host = win.document.createElement('div'); win.document.body.appendChild(host);
    const { createRoot } = await import('react-dom/client'); root = createRoot(host as any);

    openDivinationToolTab('ziwei');
    await act(async () => root.render(<DivinationTableBody table={getLucyTableState()} />));
    assert.ok(host.querySelector('[data-tool-tab-panel="ziwei"]'), 'the requested tool result is shown at once');
    const selected = host.querySelector('[role="tab"][aria-selected="true"]');
    assert.equal(selected?.getAttribute('data-table-face'), 'ziwei');

    await act(async () => { await new Promise(resolve => setTimeout(resolve, 20)); });
    await act(async () => {
      openDivinationToolTab('iching');
      await new Promise(resolve => setTimeout(resolve, 20));
    });
    assert.ok(host.querySelector('[data-tool-tab-panel="iching"]'), 'a later request switches the open sheet');
  } finally {
    if (root) await act(async () => root.unmount());
    for (const [key, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete (globalThis as any)[key];
    }
    await win.happyDOM.close();
    clearDivinationToolRequest();
  }
});

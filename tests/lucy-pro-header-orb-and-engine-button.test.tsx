/**
 * 루시프로(점술모드) 헤더 버튼 회귀 검사.
 * 사용자 지시 (2026-11-27):
 *  - "루시점술 모드에 해당 도구 버튼을 상단 헤더에 오브모양으로 만들어줘"
 *  - "루시점술모드에도 상단에 연필버튼 만들어서 엔진함을 만들어줘"
 * 기대:
 *  - 점술모드 헤더: 오브(구슬) 버튼 = 점술 도구 창(15개 도구 탭), 연필 버튼 = 엔진함(전체 카탈로그).
 *  - 일반 루시 채팅 헤더: 연필 버튼 하나 = 엔진함(심층 관점 설명). 오브 버튼은 없음.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import React, { act } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Window } from 'happy-dom';
import { readFileSync } from 'node:fs';
import { LucyToolSheetHost, MasterTableSheetButton } from '../src/components/duo/MasterTableSheet';
import { MasterEngineCatalogButton } from '../src/components/duo/MasterEngineCatalogButton';
import { LucyOrbToolIcon } from '../src/components/icons/LucyOrbToolIcon';
import { getPageGuide } from '../src/lib/pageGuides';
import { CLOSED_LUCY_SHEET, isLucySheetButtonExpanded, reduceLucySheet, shouldShowLucyToolsCabinet } from '../src/lib/lucyToolSheetRouting';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const SHEET = read('src/components/duo/MasterTableSheet.tsx');
const ORB_ICON = read('src/components/icons/LucyOrbToolIcon.tsx');
const ENGINE_BUTTON = read('src/components/duo/MasterEngineCatalogButton.tsx');
const PAGE = read('src/pages/LucyStandalonePage.tsx');
const SHEET_BUTTON = SHEET.slice(SHEET.indexOf('export function MasterTableSheetButton'));
const SHEET_HOST = SHEET.slice(SHEET.indexOf('export function LucyToolSheetHost'), SHEET.indexOf('export function MasterTableSheetButton'));

const masterButtonMarkup = renderToStaticMarkup(<MasterTableSheetButton tone="dark" isMasterMode />);
const chatButtonMarkup = renderToStaticMarkup(<MasterTableSheetButton tone="dark" />);
const engineButtonMarkup = renderToStaticMarkup(<MasterEngineCatalogButton tone="dark" />);

test('the pro-mode header tool button is an orb, not a pencil', () => {
  assert.match(masterButtonMarkup, /data-master-table-sheet-button/);
  assert.match(masterButtonMarkup, /data-tool-button-icon="orb"/);
  assert.match(masterButtonMarkup, /data-tool-sheet-variant="divination"/);
  assert.match(masterButtonMarkup, /data-lucy-orb-tool-icon="true"/);
  // 오브 버튼에는 연필 아이콘이 남지 않는다.
  assert.doesNotMatch(masterButtonMarkup, /class="lucide lucide-pencil/);
  // 크기·접근성·동작은 그대로: 32px 원형, '점술 도구 보기' → 점술 도구 창
  assert.match(masterButtonMarkup, /aria-label="점술 도구 보기"/);
  assert.match(masterButtonMarkup, /title="점술 도구"/);
  assert.match(masterButtonMarkup, /h-8 w-8 shrink-0 items-center justify-center rounded-full/);
  assert.match(SHEET, /variant=\{isMasterMode \? 'divination' : 'chat'\}/);
});

test('the general Lucy chat header tool button stays a pencil for the engine box', () => {
  assert.match(chatButtonMarkup, /data-master-table-sheet-button/);
  assert.match(chatButtonMarkup, /data-tool-button-icon="pencil"/);
  assert.match(chatButtonMarkup, /aria-label="엔진함 보기"/);
  assert.match(chatButtonMarkup, /class="lucide lucide-pencil/);
  assert.doesNotMatch(chatButtonMarkup, /data-lucy-orb-tool-icon/);
  assert.match(SHEET, /\{isMasterMode \? <LucyOrbToolIcon size=\{16\} \/> : <Pencil size=\{15\} aria-hidden="true" \/>\}/);
});

test('the orb icon is the side-menu orb (OrbShapeIcon) with its pedestal removed', () => {
  const markup = renderToStaticMarkup(<LucyOrbToolIcon size={16} />);
  assert.match(markup, /data-lucy-orb-tool-icon="true"/);
  // 사이드 메뉴 오브(OrbShapeIcon)와 같은 Lucide 선 문법을 쓴다.
  assert.match(ORB_ICON, /viewBox="0 0 24 24"/);
  assert.match(ORB_ICON, /strokeLinecap="round"/);
  assert.match(ORB_ICON, /strokeLinejoin="round"/);
  assert.match(ORB_ICON, /strokeWidth = 2/);
  assert.match(markup, /fill="none"/);
  // 헤더 글자색(라이트=슬레이트, 다크=앰버)을 그대로 따라간다.
  assert.match(ORB_ICON, /color = 'currentColor'/);
  assert.match(markup, /stroke="currentColor"/);
  // 구성: 중앙 구체 + 상단 하이라이트 아크 + 내부 코어 점.
  assert.match(markup, /<circle cx="12" cy="12" r="8"><\/circle>/);
  assert.match(markup, /<path d="M8\.7 9\.3a4\.4 4\.4 0 0 1 6\.6 0"/);
  assert.match(markup, /<circle cx="12" cy="12\.2" r="1\.2" fill="currentColor" stroke="none"><\/circle>/);
  // 받침대 2줄은 빠진다 — 구체만 남는다.
  assert.doesNotMatch(ORB_ICON, /M8\.7 16\.1/);
  assert.doesNotMatch(ORB_ICON, /M7\.8 18\.8/);
  assert.doesNotMatch(markup, /M8\.7 16\.1|M7\.8 18\.8/);
  // 3D 그라디언트·useId는 더 이상 쓰지 않는다.
  assert.doesNotMatch(ORB_ICON, /radialGradient/);
  assert.doesNotMatch(ORB_ICON, /useId/);
  assert.doesNotMatch(markup, /lucy-orb-body-/);
  // 받침대가 없으니 viewBox 정중앙에 놓여 위아래로 치우치지 않는다.
  assert.match(ORB_ICON, /<circle cx="12" cy="12" r="8" \/>/);
});

test('the pro-mode pencil button opens the engine box', () => {
  assert.match(engineButtonMarkup, /data-master-engine-catalog-button/);
  assert.match(engineButtonMarkup, /data-tool-button-icon="pencil"/);
  assert.match(engineButtonMarkup, /aria-label="엔진함 보기"/);
  assert.match(engineButtonMarkup, /aria-expanded="false"/);
  assert.match(engineButtonMarkup, /class="lucide lucide-pencil/);
  assert.match(engineButtonMarkup, /h-8 w-8 shrink-0 items-center justify-center rounded-full/);
  // 엔진함은 #1414가 만든 공용 창을 그대로 쓴다 (답변 끝 관점 버튼과 같은 창·같은 이동).
  assert.match(ENGINE_BUTTON, /LUCY_ENGINE_BOX_CLOSE_EVENT, LUCY_ENGINE_BOX_OPEN_EVENT, openLucyEngineBox/);
  assert.match(ENGINE_BUTTON, /addEventListener\(LUCY_ENGINE_BOX_OPEN_EVENT, onOpen\)/);
  assert.match(ENGINE_BUTTON, /addEventListener\(LUCY_ENGINE_BOX_CLOSE_EVENT, onClose\)/);
  assert.match(ENGINE_BUTTON, /openLucyEngineBox\(\)/);
  assert.doesNotMatch(ENGINE_BUTTON, /from '@\/components\/duo\/MasterTableSheet'/, 'engine box is not a second sheet');
  // 점술 도구함(오브 버튼)을 열지 않는다.
  assert.doesNotMatch(ENGINE_BUTTON, /openDivinationToolTab/);
});

test('Lucy Pro Engine Cabinet and Tools Cabinet active states remain independent', () => {
  const engineSheet = reduceLucySheet(CLOSED_LUCY_SHEET, { type: 'engine-box' });
  assert.equal(isLucySheetButtonExpanded(engineSheet, true), false, 'opening the Engine Cabinet does not activate the Pro Tools button');
  assert.equal(isLucySheetButtonExpanded(engineSheet, false), true, 'the shared Lucy Chat engine button still reflects its own sheet');

  const toolsSheet = reduceLucySheet(CLOSED_LUCY_SHEET, { type: 'divination-tool' });
  assert.equal(isLucySheetButtonExpanded(toolsSheet, true), true, 'opening the Pro Tools Cabinet activates its orb button');
  assert.equal(isLucySheetButtonExpanded(toolsSheet, false), false, 'the Tools Cabinet does not activate the Lucy Chat engine button');
  assert.match(ENGINE_BUTTON, /addEventListener\(LUCY_DIVINATION_TOOL_EVENT, onToolsOpen\)/, 'opening Tools clears the Engine button active state');
  assert.match(SHEET_BUTTON, /window\.dispatchEvent\(new CustomEvent\(LUCY_ENGINE_BOX_CLOSE_EVENT\)\)/, 'opening a header cabinet clears stale Engine state');
});

test('only expanded Lucy Pro hides the Tools Cabinet button', () => {
  assert.equal(shouldShowLucyToolsCabinet(true, true), false, 'expanded Lucy Pro hides the Tools Cabinet');
  assert.equal(shouldShowLucyToolsCabinet(true, false), true, 'collapsed Lucy Pro keeps the Tools Cabinet');
  assert.equal(shouldShowLucyToolsCabinet(false, true), true, 'expanded Lucy Chat keeps its Tools Cabinet');
  assert.match(PAGE, /shouldShowLucyToolsCabinet\(isMasterMode, isActuallyUnfoldedDual\)/);
  assert.match(PAGE, /\{isMasterMode && <MasterEngineCatalogButton/, 'the Engine Cabinet remains visible in Lucy Pro');
});

test('the sheet host stays mounted in the header even when the Tools Cabinet button is hidden', () => {
  // 사용자 제보(2026-11-28): 펼친 화면 루시프로에서 도구함(오브) 버튼이 숨겨지면
  // 그 버튼이 들고 있던 창 호스트까지 사라져 엔진함이 열리지 않았다.
  const guardStart = PAGE.indexOf('{shouldShowLucyToolsCabinet(isMasterMode, isActuallyUnfoldedDual) && (');
  assert.ok(guardStart >= 0, 'the Tools Cabinet button keeps its own visibility rule');
  const guardEnd = PAGE.indexOf(')}', guardStart);
  const guarded = PAGE.slice(guardStart, guardEnd);
  assert.match(guarded, /<MasterTableSheetButton/, 'only the orb/pencil tool button sits inside the guard');
  assert.doesNotMatch(guarded, /LucyToolSheetHost/, 'the sheet host is not hidden together with the tool button');
  assert.match(PAGE.slice(guardEnd), /^\)\}[\s\S]{0,400}?<LucyToolSheetHost \/>/, 'the host is mounted right outside the guard, in the same header');
});

test('the engine box request opens the shared sheet and drops any stale perspective jump', async () => {
  const { Window } = await import('happy-dom');
  const win = new Window({ url: 'https://engine-box.invalid' });
  const saved = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const savedEvent = Object.getOwnPropertyDescriptor(globalThis, 'CustomEvent');
  Object.defineProperty(globalThis, 'window', { value: win, configurable: true, writable: true });
  Object.defineProperty(globalThis, 'CustomEvent', { value: win.CustomEvent, configurable: true, writable: true });
  try {
    const bus = await import('../src/lib/lucyTableBus');
    bus.openEngineAtPerspective('carl-jung');
    assert.equal(bus.getLastEngineFocus()?.engineKey, 'carl-jung');
    const opened: unknown[] = [];
    win.addEventListener(bus.LUCY_ENGINE_BOX_OPEN_EVENT, (event: any) => opened.push(event.detail));
    bus.openLucyEngineBox();
    assert.equal(opened.length, 1, 'header pencil asks for the engine box');
    assert.equal(bus.getLastEngineFocus(), null, 'no stale perspective is scrolled into view');
  } finally {
    if (saved) Object.defineProperty(globalThis, 'window', saved);
    else delete (globalThis as any).window;
    if (savedEvent) Object.defineProperty(globalThis, 'CustomEvent', savedEvent);
    else delete (globalThis as any).CustomEvent;
  }
});

test('the answer perspective and tool buttons still open the shared sheet', () => {
  // #1414(v1.8.579)가 넣은 답변 끝 버튼 → 함 열기 배선은 그대로 살아 있어야 한다.
  assert.match(SHEET_HOST, /LUCY_ENGINE_BOX_OPEN_EVENT/);
  assert.match(SHEET_HOST, /LUCY_DIVINATION_TOOL_EVENT/);
  assert.match(SHEET_HOST, /dispatchLucySheet\(\{ type: 'engine-box' \}\)/);
  assert.match(SHEET_HOST, /dispatchLucySheet\(\{ type: 'divination-tool' \}\)/);
  assert.match(SHEET_HOST, /<MasterTableSheet onClose=\{closeSheet\} variant=\{sheet.variant\} \/>/);
  // 헤더 도구함 버튼은 같은 창을 저장소로 열고, 자기 aria-expanded만 본다.
  assert.match(SHEET_BUTTON, /dispatchLucySheet\(\{ type: 'button', isMasterMode \}\)/);
  assert.match(SHEET_BUTTON, /aria-expanded=\{isLucySheetButtonExpanded\(sheet, isMasterMode\)\}/);
});

test('expanded Lucy Pro opens the engine box from the header pencil', async () => {
  // 펼친 화면 루시프로(isMasterMode=true, isActuallyUnfoldedDual=true)는 도구함 버튼이 없으므로
  // 헤더에는 연필(MasterEngineCatalogButton)과 창 호스트(LucyToolSheetHost)만 있다.
  // 연필을 누르면 data-master-table-sheet-variant="chat" 창이 실제로 DOM에 떠야 한다.
  const win = new Window({ url: 'https://pro-engine-box.invalid' });
  const names = ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle', 'IS_REACT_ACT_ENVIRONMENT', 'requestAnimationFrame', 'cancelAnimationFrame', 'CustomEvent', 'Event'];
  const saved = new Map(names.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const key of names) {
    const value = key === 'window' ? win : key === 'document' ? win.document : key === 'getComputedStyle' ? win.getComputedStyle.bind(win) : key === 'IS_REACT_ACT_ENVIRONMENT' ? true : key === 'CustomEvent' ? win.CustomEvent : key === 'Event' ? win.Event : key === 'requestAnimationFrame' ? win.requestAnimationFrame.bind(win) : key === 'cancelAnimationFrame' ? win.cancelAnimationFrame.bind(win) : (win as any)[key];
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  }
  // happy-dom's observers keep firing on a zero-size layout and loop the overlay listeners.
  class NoopObserver { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }
  for (const name of ['ResizeObserver', 'IntersectionObserver']) {
    saved.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { value: NoopObserver, configurable: true, writable: true });
  }
  let root: any;
  try {
    const host = win.document.createElement('div'); win.document.body.appendChild(host);
    const { createRoot } = await import('react-dom/client'); root = createRoot(host as any);
    await act(async () => root.render(<><LucyToolSheetHost /><MasterEngineCatalogButton tone="dark" /></>));
    assert.equal(win.document.querySelector('[data-master-table-sheet-variant]'), null, 'the box starts closed');
    const pencil = host.querySelector('[data-master-engine-catalog-button]') as any;
    assert.ok(pencil, 'the expanded pro header keeps the engine pencil');
    assert.equal(pencil.getAttribute('aria-expanded'), 'false');

    await act(async () => {
      pencil.dispatchEvent(new win.MouseEvent('click', { bubbles: true, detail: 1 }));
      await new Promise(resolve => setTimeout(resolve, 20));
    });

    const sheet = win.document.querySelector('[data-master-table-sheet-variant="chat"]');
    assert.ok(sheet, 'the engine box really opens in the expanded pro header');
    assert.ok(win.document.querySelector('[data-master-table-sheet-variant="chat"] [data-lucy-engine-panel]'), 'the opened box is the deep-perspective engine cabinet');
    assert.equal((host.querySelector('[data-master-engine-catalog-button]') as any).getAttribute('aria-expanded'), 'true');

    // 창의 닫기 버튼으로 닫히고 버튼 상태도 돌아온다.
    const closeButton = win.document.querySelector('[data-master-table-sheet-variant="chat"] [aria-label="도구 창 닫기"]') as any;
    assert.ok(closeButton, 'the engine box has its close button');
    await act(async () => {
      closeButton.dispatchEvent(new win.MouseEvent('click', { bubbles: true, detail: 1 }));
      await new Promise(resolve => setTimeout(resolve, 20));
    });
    assert.equal(win.document.querySelector('[data-master-table-sheet-variant="chat"]'), null, 'the close button closes the engine box');
    assert.equal((host.querySelector('[data-master-engine-catalog-button]') as any).getAttribute('aria-expanded'), 'false');
  } finally {
    if (root) await act(async () => root.unmount());
    for (const [key, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete (globalThis as any)[key];
    }
    await win.happyDOM.close();
  }
});

test('the collapsed Lucy Pro still opens its tools cabinet from the orb button', async () => {
  const win = new Window({ url: 'https://pro-tools-cabinet.invalid' });
  const names = ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle', 'IS_REACT_ACT_ENVIRONMENT', 'requestAnimationFrame', 'cancelAnimationFrame', 'CustomEvent', 'Event'];
  const saved = new Map(names.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const key of names) {
    const value = key === 'window' ? win : key === 'document' ? win.document : key === 'getComputedStyle' ? win.getComputedStyle.bind(win) : key === 'IS_REACT_ACT_ENVIRONMENT' ? true : key === 'CustomEvent' ? win.CustomEvent : key === 'Event' ? win.Event : key === 'requestAnimationFrame' ? win.requestAnimationFrame.bind(win) : key === 'cancelAnimationFrame' ? win.cancelAnimationFrame.bind(win) : (win as any)[key];
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  }
  // happy-dom's observers keep firing on a zero-size layout and loop the overlay listeners.
  class NoopObserver { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }
  for (const name of ['ResizeObserver', 'IntersectionObserver']) {
    saved.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { value: NoopObserver, configurable: true, writable: true });
  }
  let root: any;
  try {
    const host = win.document.createElement('div'); win.document.body.appendChild(host);
    const { createRoot } = await import('react-dom/client'); root = createRoot(host as any);
    await act(async () => root.render(<><LucyToolSheetHost /><MasterTableSheetButton tone="dark" isMasterMode /></>));

    const orb = host.querySelector('[data-master-table-sheet-button]') as any;
    await act(async () => {
      orb.dispatchEvent(new win.MouseEvent('click', { bubbles: true, detail: 1 }));
      await new Promise(resolve => setTimeout(resolve, 20));
    });
    assert.ok(win.document.querySelector('[data-master-table-sheet-variant="divination"]'), 'the orb still opens the divination tools cabinet');
    assert.equal(orb.getAttribute('aria-expanded'), 'true');
  } finally {
    if (root) await act(async () => root.unmount());
    for (const [key, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete (globalThis as any)[key];
    }
    await win.happyDOM.close();
  }
});

test('the header shows the orb plus the engine pencil only in the pro mode', () => {
  assert.match(PAGE, /<MasterTableSheetButton tone=\{isLight \? 'light' : 'dark'\} isMasterMode=\{isMasterMode\} \/>/);
  assert.match(PAGE, /\{isMasterMode && <MasterEngineCatalogButton tone=\{isLight \? 'light' : 'dark'\} \/>\}/);
  // 일반 채팅에서 오브·점술모드 전용 엔진함 버튼이 나오지 않는다.
  assert.match(PAGE, /\{isMasterMode && <MasterEngineCatalogButton/);
});

test('the pro guide explains both the orb tool window and the pencil engine box', () => {
  const master = getPageGuide('master');
  const tips = master.tips;
  const orb = tips.find(tip => tip.text.includes('오브(구슬)'));
  const pencil = tips.find(tip => tip.text.includes('연필 버튼') && tip.text.includes('엔진함'));
  assert.ok(orb, 'pro guide explains the orb tool window');
  assert.match(orb!.text, /점술 도구 창/);
  assert.ok(pencil, 'pro guide explains the pencil engine box');
  assert.match(pencil!.text, /심층 관점/);
  // 예전 '위쪽 연필 버튼으로 점술 도구 창' 안내는 남지 않는다.
  assert.ok(!tips.some(tip => tip.text.includes('연필 버튼으로 사주 원국')));
  assert.doesNotMatch(read('src/lib/pageGuides.ts'), /일반 루시 채팅의 연필 버튼을 누르면 엔진함에서 심층 관점들의 설명을 언제든 읽을 수 있어요/);
});

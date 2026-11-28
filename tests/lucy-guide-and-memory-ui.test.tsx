import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import React, { act } from 'react';
import { Window } from 'happy-dom';
import { PageGuideButton } from '../src/components/guide/PageGuide.tsx';
import { getPageGuide } from '../src/lib/pageGuides.ts';

const pageSource = readFileSync(new URL('../src/pages/LucyStandalonePage.tsx', import.meta.url), 'utf8');
const orbSource = readFileSync(new URL('../src/components/lucy/LucyOrbCounsel.tsx', import.meta.url), 'utf8');
const orbCssSource = readFileSync(new URL('../src/components/lucy/lucy-orb-counsel.css', import.meta.url), 'utf8');
const calmSource = readFileSync(new URL('../src/pages/CalmApp.tsx', import.meta.url), 'utf8');
const keySearchSource = readFileSync(new URL('../public/calm/key-search.js', import.meta.url), 'utf8');
const keyStyleSource = readFileSync(new URL('../public/calm/style.css', import.meta.url), 'utf8');

test('the chat header no longer carries a 루시상담기억 button', () => {
  const headerActions = pageSource.slice(
    pageSource.indexOf('lucy-header-actions'),
    pageSource.indexOf('lucy-header-actions') + 4000,
  );
  assert.ok(!pageSource.includes('LucyConsultMemorySettings'), '상담 기억 설정은 채팅방 상단에서 빠진다');
  assert.doesNotMatch(headerActions, /상담 기억/, '헤더 액션 영역에 상담 기억 버튼이 남지 않는다');
  assert.match(headerActions, /PageGuideButton/, '가이드 버튼은 그대로 있다');
});

test('the orb header no longer carries a 상담 기억 button while memory saving stays on', () => {
  const headerActions = orbSource.slice(
    orbSource.indexOf('lucy-orb-header-actions'),
    orbSource.indexOf('</header>', orbSource.indexOf('lucy-orb-header-actions')),
  );
  assert.ok(!orbSource.includes('LucyConsultMemorySettings'), '오브 상단 상담 기억 설정 버튼이 빠진다');
  assert.doesNotMatch(headerActions, /상담 기억/, '오브 헤더 액션 영역에 상담 기억 버튼이 남지 않는다');
  assert.match(headerActions, /PageGuideButton/, '오브 가이드 버튼은 그대로 있다');
  assert.match(headerActions, /lucy-orb-bed/, '배경음 버튼은 그대로 있다');
  // 저장·공유 로직은 버튼과 무관하게 계속 돈다.
  assert.match(orbSource, /saveOrbMemory\(account,/, '상담이 끝나면 오브 기억을 계속 저장한다');
  assert.match(orbSource, /buildLucyConsultMemoryBrief\(account, 'voice'/, '음성모드 상담 기억을 계속 참고한다');
});

test('the orb header puts the guide first and renders the bed toggle as a speaker icon button', () => {
  const headerStart = orbSource.indexOf('lucy-orb-header-actions');
  const headerBlock = orbSource.slice(headerStart, orbSource.indexOf('</header>', headerStart));

  // 가이드 버튼이 먼저(왼쪽) 오고 배경음 토글이 그 오른쪽에 온다.
  const guideAt = headerBlock.indexOf('<PageGuideButton');
  const bedAt = headerBlock.indexOf('lucy-orb-bed');
  assert.ok(guideAt > 0, '오브 헤더에 가이드 버튼이 있다');
  assert.ok(bedAt > guideAt, '가이드 버튼이 배경음 버튼보다 앞에 온다');

  const button = headerBlock.slice(headerBlock.lastIndexOf('<button', bedAt), headerBlock.indexOf('</button>', bedAt));
  assert.doesNotMatch(button, /배경음\s*(켜짐|꺼짐)/, '배경음 토글에 상태 글자가 남지 않는다');
  assert.doesNotMatch(button, />\s*[가-힣]/, '버튼 안에는 글자 대신 아이콘만 그린다');
  assert.ok(button.includes('<Volume2 size={GUIDE_BUTTON_ICON_SIZE}'), '켜짐 상태는 Volume2 스피커 아이콘이다');
  assert.ok(button.includes('<VolumeX size={GUIDE_BUTTON_ICON_SIZE}'), '꺼짐 상태는 VolumeX 스피커 아이콘이다');
  assert.match(button, /bedOn \? <Volume2[^>]*\/> : <VolumeX[^>]*\/>/, 'bedOn에 따라 두 아이콘을 바꿔 그린다');
  assert.ok(button.includes('aria-pressed={bedOn}'), '켜짐/꺼짐 상태는 aria-pressed로도 남는다');
  assert.ok(button.includes("aria-label={bedOn ? '배경음 끄기' : '배경음 켜기'}"), '접근성 이름은 동작을 말한다');
  assert.ok(button.includes("title={bedOn ? '배경음 끄기' : '배경음 켜기'}"), '툴팁도 같은 안내를 준다');
  assert.ok(button.includes('data-orb-bed-button'), '테스트·확인용 표식이 남는다');
  assert.ok(button.includes("sessionStorage.setItem('lucy_orb_bed'"), '토글 상태 저장 동작은 그대로다');
  assert.match(
    orbSource,
    /import \{[^}]*Volume2[^}]*VolumeX[^}]*\} from 'lucide-react'/,
    '스피커 아이콘은 lucide-react에서 가져온다',
  );

  // 옆의 가이드 버튼(32px 원형)과 같은 크기·모양으로 그린다. // 📐 가이드 아이콘 17px과 같은 크기를 쓴다.
  assert.match(orbSource, /import \{ GUIDE_BUTTON_ICON_SIZE \} from '@\/components\/guide\/guideButtonLayout'/, '오브 배경음 아이콘도 가이드 아이콘 크기 상수를 쓴다');
  const ruleStart = orbCssSource.indexOf('.lucy-orb-header .lucy-orb-bed {');
  assert.ok(ruleStart > 0, '오브 헤더 배경음 버튼 규칙이 있다');
  const rule = orbCssSource.slice(ruleStart, orbCssSource.indexOf('}', ruleStart));
  assert.match(rule, /display: inline-flex;/, '아이콘을 가운데 두는 버튼이다');
  assert.match(rule, /width: 32px;/, '가이드 버튼과 같은 32px 폭이다');
  assert.match(rule, /height: 32px;/, '가이드 버튼과 같은 32px 높이다');
  assert.match(rule, /padding: 0;/, '글자용 여백은 두지 않는다');
  assert.match(rule, /border-radius: 999px;/, '원형 버튼이다');
});

test('the key channel guide button is icon-only and pairs with the search button', () => {
  const start = calmSource.indexOf('data-key-guide-parent');
  assert.ok(start > 0, '부모 화면 가이드 버튼이 있다');
  const block = calmSource.slice(calmSource.lastIndexOf('<button', start), calmSource.indexOf('</button>', start));
  const visibleText = block.replace(/aria-label="[^"]*"/, '').replace(/\{[^}]*\}/g, '');
  assert.ok(!visibleText.includes('가이드'), '가이드 글자가 버튼 안에 남지 않는다');
  assert.match(block, /size=\{GUIDE_BUTTON_ICON_SIZE\}/, '가이드 아이콘은 앱 공통 17px 크기 상수만 쓴다');
  assert.match(block, /aria-label="Key 가이드 열기"/, '접근성 이름은 유지한다');
  assert.match(block, /\$\{GUIDE_BUTTON_SIZE_CLASS\} items-center justify-center rounded-full/, '검색 버튼과 같은 원형 32px 버튼이다');
  assert.match(block, /text-\[#c9805c\]/, '아이콘 색은 검색 버튼과 같은 구리색이다');
  // Key 안쪽(아이프레임)에서 그리는 같은 버튼도 글자 없이 아이콘만 쓴다.
  const innerStart = keySearchSource.indexOf("guide.id = 'key-guide-btn'");
  const innerBlock = keySearchSource.slice(innerStart, keySearchSource.indexOf('actions.appendChild(guide)', innerStart));
  assert.ok(!innerBlock.includes('<span>가이드</span>'), '아이프레임 가이드 버튼에 글자가 남지 않는다');
  assert.match(innerBlock, /svg width="17" height="17"/, '아이프레임 가이드 아이콘도 앱과 같은 17px이다');
  assert.match(keyStyleSource, /\.key-guide-btn \{[^}]*width: 32px;/, '가이드 버튼은 검색 버튼과 같은 32px 원형이다');
  assert.ok(!keyStyleSource.includes('.key-guide-btn span'), '글자를 숨기던 규칙은 더 필요 없다');
});

test('the guide header button is an icon-only round button that still opens its guide', async () => {
  const win = new Window({ url: 'https://luckey-guide.invalid' });
  const names = ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle', 'IS_REACT_ACT_ENVIRONMENT', 'requestAnimationFrame', 'cancelAnimationFrame', 'matchMedia', 'ResizeObserver'];
  const saved = new Map(names.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const key of names) {
    const value = key === 'window' ? win
      : key === 'document' ? win.document
        : key === 'getComputedStyle' ? win.getComputedStyle.bind(win)
          : key === 'requestAnimationFrame' ? win.requestAnimationFrame.bind(win)
            : key === 'cancelAnimationFrame' ? win.cancelAnimationFrame.bind(win)
              : key === 'matchMedia' ? win.matchMedia?.bind(win)
                : key === 'ResizeObserver' ? ((win as any).ResizeObserver || class { observe() {} unobserve() {} disconnect() {} })
                  : key === 'IS_REACT_ACT_ENVIRONMENT' ? true
                    : (win as any)[key];
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  }
  try {
    const host = win.document.createElement('div');
    win.document.body.appendChild(host);
    const { createRoot } = await import('react-dom/client');
    const root = createRoot(host as any);
    await act(async () => root.render(
      <>
        <PageGuideButton guide={getPageGuide('lucy')} tone="light" />
        <PageGuideButton guide={getPageGuide('lucy')} tone="light" unboxed />
      </>
    ));

    const buttons = Array.from(host.querySelectorAll('[data-page-guide-button]')) as any[];
    assert.equal(buttons.length, 2, '기본형과 무박스형 가이드 버튼이 모두 렌더링된다');
    const button = buttons[0]!;
    const unboxedButton = buttons[1]!;
    assert.ok(button, 'the header guide button renders');
    assert.equal(button.textContent?.trim(), '', 'no Korean label is rendered inside the button');
    assert.equal(button.querySelectorAll('svg').length, 1, 'the book icon is the only content');
    // 📐 가이드 아이콘은 루시 채팅 헤더와 같은 17px이다.
    const icon = button.querySelector('svg')!;
    assert.equal(icon.getAttribute('width'), '17', 'the book icon is 17px wide');
    assert.equal(icon.getAttribute('height'), '17', 'the book icon is 17px tall');
    const defaultClass = button.getAttribute('class') || '';
    const unboxedClass = unboxedButton.getAttribute('class') || '';
    assert.match(defaultClass, /h-8 w-8 shrink-0 items-center justify-center rounded-full/);
    assert.match(defaultClass, /border backdrop-blur-md/);
    assert.match(defaultClass, /border-slate-300\/80 bg-white\/80 text-slate-700/);
    assert.match(unboxedClass, /h-8 w-8 shrink-0 items-center justify-center rounded-full/);
    assert.match(unboxedClass, /border-0 bg-transparent/);
    assert.match(unboxedClass, /text-slate-700/);
    assert.doesNotMatch(unboxedClass, /border-slate-300\/80|bg-white\/80|backdrop-blur-md/);
    assert.ok(button.getAttribute('aria-label')?.includes('가이드'), 'the accessible name keeps 가이드');
    assert.equal(button.getAttribute('title'), '가이드');

    await act(async () => { button.dispatchEvent(new win.MouseEvent('click', { bubbles: true })); });
    assert.equal(button.getAttribute('aria-expanded'), 'true', 'the Guide button exposes its open state');
    const dialog = win.document.querySelector('[data-page-guide]');
    assert.ok(dialog, 'pressing the icon still opens the guide dialog');

    const closeButton = win.document.querySelector('[data-page-guide] [aria-label="가이드 닫기"]');
    assert.ok(closeButton, 'the guide dialog can still be closed accessibly');
    await act(async () => { closeButton.dispatchEvent(new win.MouseEvent('click', { bubbles: true })); });
    assert.equal(button.getAttribute('aria-expanded'), 'false', 'closing the Guide clears its expanded state');
    assert.equal(win.document.querySelector('[data-page-guide]'), null, 'closing the default guide removes its dialog');

    await act(async () => { unboxedButton.dispatchEvent(new win.MouseEvent('click', { bubbles: true })); });
    assert.ok(win.document.querySelector('[data-page-guide]'), 'the unboxed guide button still opens its guide');

    await act(async () => root.unmount());
  } finally {
    for (const [key, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete (globalThis as any)[key];
    }
  }
});

test('Lucy Chat and Pro use active-only borders across their shared header controls', () => {
  const headerStart = pageSource.indexOf('lucy-header-actions');
  const headerEnd = pageSource.indexOf('{/*  Export Chat */', headerStart);
  const header = pageSource.slice(headerStart, headerEnd);
  assert.ok(headerStart >= 0 && headerEnd > headerStart, 'Lucy chat and divination share the expected header actions block');

  const guideStart = header.indexOf('<PageGuideButton');
  const guideEnd = header.indexOf('/>', guideStart) + 2;
  const guideCall = header.slice(guideStart, guideEnd);
  assert.match(guideCall, /unboxed/, 'the existing book Guide stays unboxed');
  assert.match(guideCall, /isMasterMode \? 'master' : 'lucy'/, 'the same Guide button serves Lucy chat and divination mode');

  const smartGuideStart = header.indexOf('<SmartGuideSettingsButton');
  const smartGuideEnd = header.indexOf('/>', smartGuideStart) + 2;
  const smartGuideCall = header.slice(smartGuideStart, smartGuideEnd);
  assert.ok(smartGuideStart > 0 && smartGuideEnd > smartGuideStart, 'the shared question-mark Smart Guide button is present');
  assert.match(smartGuideCall, /unboxed/, 'only the Lucy header opts into the Smart Guide unboxed treatment');

  const speakerStart = header.indexOf('data-auto-tts-toggle="true"');
  const speakerEnd = header.indexOf('</button>', speakerStart) + '</button>'.length;
  const speaker = header.slice(speakerStart, speakerEnd);
  const speakerClass = speaker.match(/className=\{`([\s\S]*?)`\}/)?.[1] || '';
  assert.ok(speakerStart >= 0 && speakerEnd > speakerStart, 'the Lucy header auto-read speaker toggle is present');
  assert.match(speakerClass, /rounded-xl/, 'the speaker keeps its touch target shape');
  assert.match(speakerClass, /border-0 bg-transparent shadow-none hover:bg-transparent/, 'the speaker has explicit transparent, borderless styling');
  assert.doesNotMatch(speakerClass, /\bbg-(?!transparent\b)|\bborder-(?!0\b)|\bshadow-(?!none\b)/, 'the speaker has no visual fill, nonzero border, or shadow');
  assert.match(speaker, /aria-pressed=\{isAutoTts\}/, 'speaker state remains accessible');
  assert.match(speaker, /aria-label=\{isAutoTts \?/, 'speaker action remains accessible');
  assert.match(speaker, /<Volume2/);
  assert.match(speaker, /<VolumeX/);

  const searchMarker = 'title="대화 내역 검색"';
  const searchIndex = header.indexOf(searchMarker);
  const searchStart = header.lastIndexOf('<button', searchIndex);
  const searchEnd = header.indexOf('</button>', searchIndex) + '</button>'.length;
  const search = header.slice(searchStart, searchEnd);
  assert.ok(searchStart > 0 && searchEnd > searchStart, 'the separate search control stays in the header');
  assert.match(search, /aria-expanded=\{isSearchOpen\}/, 'search exposes whether its panel is open');
  assert.match(search, /aria-controls="lucy-search-overlay"/, 'search is linked to its disclosure panel');

  const chromeStyleStart = readFileSync(new URL('../src/styles/lucy-starlight.css', import.meta.url), 'utf8');
  assert.match(chromeStyleStart, /\.lucy-chat-shell \.lucy-header-actions > button \{ border: 0 !important; background: transparent !important; box-shadow: none !important;/, 'inactive Lucy header controls have no box');
  assert.match(chromeStyleStart, /\.lucy-chat-shell \.lucy-header-actions > button:is\(\[aria-pressed='true'\], \[aria-expanded='true'\]\) \{ border: 1px solid rgba\(120, 159, 139, \.78\) !important;/, 'only pressed or expanded controls receive an active border');
  assert.match(chromeStyleStart, /:focus-visible \{ outline: 2px solid currentColor !important;/, 'keyboard focus remains visible');
});

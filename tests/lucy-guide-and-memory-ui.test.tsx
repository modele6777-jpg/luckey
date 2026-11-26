import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import React, { act } from 'react';
import { Window } from 'happy-dom';
import { PageGuideButton } from '../src/components/guide/PageGuide.tsx';
import { getPageGuide } from '../src/lib/pageGuides.ts';

const pageSource = readFileSync(new URL('../src/pages/LucyStandalonePage.tsx', import.meta.url), 'utf8');
const orbSource = readFileSync(new URL('../src/components/lucy/LucyOrbCounsel.tsx', import.meta.url), 'utf8');
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

test('the key channel guide button is icon-only and pairs with the search button', () => {
  const start = calmSource.indexOf('data-key-guide-parent');
  assert.ok(start > 0, '부모 화면 가이드 버튼이 있다');
  const block = calmSource.slice(calmSource.lastIndexOf('<button', start), calmSource.indexOf('</button>', start));
  const visibleText = block.replace(/aria-label="[^"]*"/, '').replace(/\{[^}]*\}/g, '');
  assert.ok(!visibleText.includes('가이드'), '가이드 글자가 버튼 안에 남지 않는다');
  assert.match(block, /<BookOpen size=\{18\}/, '18px 책 아이콘만 남는다');
  assert.match(block, /aria-label="Key 가이드 열기"/, '접근성 이름은 유지한다');
  assert.match(block, /h-10 w-10 items-center justify-center rounded-full/, '검색 버튼과 같은 원형 40px 버튼이다');
  assert.match(block, /text-\[#c9805c\]/, '아이콘 색은 검색 버튼과 같은 구리색이다');
  // Key 안쪽(아이프레임)에서 그리는 같은 버튼도 글자 없이 아이콘만 쓴다.
  const innerStart = keySearchSource.indexOf("guide.id = 'key-guide-btn'");
  const innerBlock = keySearchSource.slice(innerStart, keySearchSource.indexOf('actions.appendChild(guide)', innerStart));
  assert.ok(!innerBlock.includes('<span>가이드</span>'), '아이프레임 가이드 버튼에 글자가 남지 않는다');
  assert.match(innerBlock, /svg width="18" height="18"/, '아이프레임 가이드 아이콘은 18px이다');
  assert.match(keyStyleSource, /\.key-guide-btn \{[^}]*width: 40px;/, '가이드 버튼은 검색 버튼과 같은 40px 원형이다');
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
    await act(async () => root.render(<PageGuideButton guide={getPageGuide('lucy')} tone="light" />));

    const button = host.querySelector('[data-page-guide-button]')!;
    assert.ok(button, 'the header guide button renders');
    assert.equal(button.textContent?.trim(), '', 'no Korean label is rendered inside the button');
    assert.equal(button.querySelectorAll('svg').length, 1, 'the book icon is the only content');
    assert.match(button.getAttribute('class') || '', /h-8 w-8 shrink-0 items-center justify-center rounded-full/);
    assert.ok(button.getAttribute('aria-label')?.includes('가이드'), 'the accessible name keeps 가이드');
    assert.equal(button.getAttribute('title'), '가이드');

    await act(async () => { button.dispatchEvent(new win.MouseEvent('click', { bubbles: true })); });
    const dialog = win.document.querySelector('[data-page-guide]');
    assert.ok(dialog, 'pressing the icon still opens the guide dialog');

    await act(async () => root.unmount());
  } finally {
    for (const [key, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete (globalThis as any)[key];
    }
  }
});

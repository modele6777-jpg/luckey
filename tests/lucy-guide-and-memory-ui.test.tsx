import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import React, { act } from 'react';
import { Window } from 'happy-dom';
import { PageGuideButton } from '../src/components/guide/PageGuide.tsx';
import { getPageGuide } from '../src/lib/pageGuides.ts';

const pageSource = readFileSync(new URL('../src/pages/LucyStandalonePage.tsx', import.meta.url), 'utf8');

test('the chat header no longer carries a 루시상담기억 button', () => {
  const headerActions = pageSource.slice(
    pageSource.indexOf('lucy-header-actions'),
    pageSource.indexOf('lucy-header-actions') + 4000,
  );
  assert.ok(!pageSource.includes('LucyConsultMemorySettings'), '상담 기억 설정은 채팅방 상단에서 빠진다');
  assert.doesNotMatch(headerActions, /상담 기억/, '헤더 액션 영역에 상담 기억 버튼이 남지 않는다');
  assert.match(headerActions, /PageGuideButton/, '가이드 버튼은 그대로 있다');
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

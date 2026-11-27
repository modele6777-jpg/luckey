/**
 * 엔진함 '해석 사전' UI 제거 회귀 검사.
 * 사용자 지시(2026-11-26): "엔진함에 해석사전124 없애줘"
 * - 엔진함(LucyEngineCatalogDialog)에는 '📖 해석 사전' 토글·사전 목록이 남아 있지 않다.
 * - 검색창은 '이름이나 주제 검색' / '엔진과 관점 검색' 한 가지 형태만 쓴다.
 * - 페이지 가이드의 해석 사전 안내 문구도 사라진다.
 * - 단, 루시가 계산값에 맞는 해석 카드를 프롬프트에 붙이는 내부 로직은 그대로 둔다.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { KNOWLEDGE_DICTIONARY_COUNT } from '../src/lib/divination/knowledge/catalog';
import { allPageGuides } from '../src/lib/pageGuides';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const DIALOG = read('src/components/chat/LucyEngineCatalogDialog.tsx');
const GUIDE = read('src/lib/pageGuides.ts');
const ENGINE = read('src/lib/divination/deterministicEngine.ts');

test('the engine box no longer shows the 해석 사전 toggle or card list', () => {
  assert.equal(DIALOG.includes('knowledge-dictionary-toggle'), false, 'dictionary toggle testid remains');
  assert.equal(DIALOG.includes('showDictionary'), false, 'dictionary state remains');
  assert.equal(DIALOG.includes('KnowledgeDictionaryView'), false, 'dictionary view import/render remains');
  assert.equal(DIALOG.includes('KNOWLEDGE_DICTIONARY_COUNT'), false, 'dictionary count import remains');
  assert.equal(DIALOG.includes('해석 사전'), false, 'dictionary label remains');
  assert.equal(DIALOG.includes('knowledge-dictionary'), false, 'dictionary testid remains');
  assert.equal(existsSync(new URL('../src/components/chat/KnowledgeDictionaryView.tsx', import.meta.url)), false,
    'the unused dictionary view component should be gone');
});

test('the engine box search uses one plain label and placeholder', () => {
  assert.ok(DIALOG.includes('placeholder="이름이나 주제 검색"'));
  assert.ok(DIALOG.includes('aria-label="엔진과 관점 검색"'));
  assert.equal(DIALOG.includes('괘·별·문 이름이나 뜻으로 검색'), false, 'dictionary placeholder remains');
  assert.equal(DIALOG.includes('해석 사전 검색'), false, 'dictionary aria-label remains');
});

test('the engine box still lists engines, filters and themes', () => {
  for (const marker of [
    'data-testid="lucy-engine-catalog-list"',
    'data-testid="lucy-engine-catalog-entry"',
    'aria-label="엔진 목록 분류"',
    'aria-label="Lucy 7개 채널 테마"',
    '{!deepOnly && FILTERS.map(item => {',
  ]) {
    assert.ok(DIALOG.includes(marker), `missing engine box element: ${marker}`);
  }
  assert.equal(DIALOG.includes('{!showDictionary &&'), false);
});

test('page guides drop the 해석 사전 tip and keep the engine box tip', () => {
  const all = allPageGuides()
    .map(guide => [guide.intro, ...guide.steps, ...guide.tips.map(tip => tip.text)].join('\n'))
    .join('\n');
  assert.equal(all.includes('해석 사전'), false, 'page guide still explains the dictionary');
  assert.ok(all.includes('엔진함'), 'the engine box tip itself should stay');
  assert.equal(GUIDE.includes('"📖 해석 사전"'), false);
});

test('the prompt-side knowledge cards stay in place', () => {
  assert.ok(KNOWLEDGE_DICTIONARY_COUNT > 0, 'card catalog data is still available');
  assert.ok(ENGINE.includes('[해석 카드'), 'prompt still labels the attached knowledge cards');
  assert.ok(existsSync(new URL('../src/lib/divination/knowledge/index.ts', import.meta.url)));
});

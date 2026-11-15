import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { captureLucySearchAnchor, resolveLucySearchRestoreTop } from '../src/lib/lucySearchScroll';

const page = readFileSync(new URL('../src/pages/LucyStandalonePage.tsx', import.meta.url), 'utf8');
const searchPanel = page.slice(page.indexOf('{/*  Search Input Dropdown */}'), page.indexOf('</header>'));

test('a reader at the latest message is captured as pinned to the bottom', () => {
  const anchor = captureLucySearchAnchor(900, 1000, 100);
  assert.equal(anchor.distanceFromBottom, 0);
  assert.equal(anchor.pinnedToBottom, true);
});

test('a reader inside the older history keeps the distance they were reading at', () => {
  const anchor = captureLucySearchAnchor(300, 1000, 100);
  assert.equal(anchor.distanceFromBottom, 600);
  assert.equal(anchor.pinnedToBottom, false);
});

test('a stale scrollTop from before a layout change is clamped, not trusted', () => {
  const anchor = captureLucySearchAnchor(5000, 1000, 100);
  assert.equal(anchor.distanceFromBottom, 0);
  assert.equal(anchor.pinnedToBottom, true);
  const shortContent = captureLucySearchAnchor(40, 50, 100);
  assert.equal(shortContent.distanceFromBottom, 0);
  assert.equal(shortContent.pinnedToBottom, true);
  assert.equal(captureLucySearchAnchor(Number.NaN, 1000, 100).pinnedToBottom, true);
});

test('closing a search returns a bottom reader to the latest message', () => {
  const anchor = captureLucySearchAnchor(900, 1000, 100);
  assert.equal(resolveLucySearchRestoreTop(anchor, 2000, 600), 1400);
});

test('closing a search returns a history reader to their own line, not the top', () => {
  const anchor = captureLucySearchAnchor(300, 1000, 100);
  // 필터링으로 목록이 줄어 scrollTop이 0으로 클램프된 뒤에도, 검색을 닫으면 읽던 줄로 돌아온다.
  assert.equal(resolveLucySearchRestoreTop(anchor, 2000, 600), 800);
  assert.notEqual(resolveLucySearchRestoreTop(anchor, 2000, 600), 0);
});

test('restore never leaves the viewport outside the content', () => {
  const anchor = captureLucySearchAnchor(300, 1000, 100);
  assert.equal(resolveLucySearchRestoreTop(anchor, 400, 600), 0);
  assert.equal(resolveLucySearchRestoreTop(null, 400, 600), 0);
  assert.equal(resolveLucySearchRestoreTop(null, 2000, 600), 1400);
});

test('the search input is focused without letting iOS drag the conversation to the top', () => {
  assert.match(page, /searchInputRef\.current\?\.focus\(\{ preventScroll: true \}\)/);
  assert.doesNotMatch(page, /^\s+autoFocus$/m);
});

test('the search dropdown lives inside the header without inheriting its scroll-to-top tap', () => {
  assert.match(searchPanel, /data-no-scroll-top="true"/);
  assert.match(searchPanel, /ref=\{searchInputRef\}/);
  assert.doesNotMatch(searchPanel, /autoFocus/);
});

test('opening a search remembers the reading position and closing it restores that position', () => {
  assert.match(page, /searchScrollAnchorRef\.current = captureLucySearchAnchor\(container\.scrollTop, container\.scrollHeight, container\.clientHeight\)/);
  assert.match(page, /top: resolveLucySearchRestoreTop\(anchor, container\.scrollHeight, container\.clientHeight\)/);
  assert.match(page, /const closeSearch = useCallback\(\(\) => \{\n\s+setSearchQuery\(''\);\n\s+setIsSearchOpen\(false\);/);
});

test('the search toggle closes with a cleared query and follows the latest match while typing', () => {
  assert.match(page, /onClick=\{toggleSearch\}/);
  assert.match(page, /onClick=\{closeSearch\}/);
  assert.match(page, /if \(!isSearchOpen \|\| !searchQuery\.trim\(\)\) return;[\s\S]{0,220}noteLucyScrollPin\(true\);[\s\S]{0,60}scrollToBottom\(true, false\);/);
});

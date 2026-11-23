import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { captureLucySearchAnchor, resolveLucySearchOpenGuardedTop } from '../src/lib/lucySearchScroll';
import { planTtsScroll, ttsScrollDeadZone } from '../src/lib/ttsScrollFollow';

const page = readFileSync(new URL('../src/pages/LucyStandalonePage.tsx', import.meta.url), 'utf8');
const trinityPage = readFileSync(new URL('../src/pages/TrinityApp.tsx', import.meta.url), 'utf8');
const smartScroll = readFileSync(new URL('../src/hooks/useSmartScroll.ts', import.meta.url), 'utf8');
const searchPanel = page.slice(page.indexOf('className="lucy-search-overlay"'), page.indexOf('className="lucy-search-results"'));

// ── 검색 버튼: 누르는 순간 대화가 최상단으로 튀지 않아야 한다 ──────────────────────────

test('the search input is 16px on mobile so iOS does not zoom and pan the conversation', () => {
  // 검색창은 대화 위에 뜨는 창(lucy-search-overlay)이고, 입력 글자 크기는 CSS에서 16px로 고정한다.
  const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8');
  const rule = css.slice(css.indexOf('.lucy-search-bar input {'), css.indexOf('}', css.indexOf('.lucy-search-bar input {')));
  assert.match(rule, /font-size:\s*16px/);
  assert.match(searchPanel, /ref=\{searchInputRef\}/);
});

test('opening the search panel renders its final height immediately, never from height 0', () => {
  assert.doesNotMatch(searchPanel, /initial=\{\{ height: 0/);
  assert.doesNotMatch(searchPanel, /animate=\{\{ height: 'auto'/);
  // 검색 창은 높이 애니메이션 없이 바로 그려진다.
  assert.match(page, /\{isSearchOpen && \(\s*<div className="lucy-search-overlay"/);
});

test('the search and close buttons are explicit buttons, not form submitters', () => {
  const toggle = page.slice(page.indexOf('onClick={toggleSearch}') - 220, page.indexOf('onClick={toggleSearch}') + 40);
  assert.match(toggle, /type="button"/);
  assert.match(searchPanel, /<button type="button" className="lucy-search-close" onClick=\{closeSearch\}>/);
});

test('the search input is focused after the panel is laid out, not inside a collapsed box', () => {
  assert.match(page, /searchInputRef\.current\??\.focus\(\{ preventScroll: true \}\)/);
  assert.match(page, /secondFrame = requestAnimationFrame\(focusSearch\)/);
  assert.doesNotMatch(page, /^\s+autoFocus$/m);
});

test('opening the search keeps the reading position when iOS moves the conversation', () => {
  assert.match(page, /resolveLucySearchOpenGuardedTop\(\{/);
  assert.match(page, /visualViewport/);
  assert.match(page, /container\?\.addEventListener\('touchstart', markTouched, \{ passive: true \}\)/);
  // 검색어를 입력해 목록이 걸러지기 시작하면 최신 일치 메시지를 따라가야 하므로 자리 지킴을 멈춘다.
  assert.match(page, /if \(!isSearchOpen \|\| searchQuery\.trim\(\)\) \{\s+stopGuard\(\);/);
});

test('a guarded reading position is only restored when the scroll actually drifted, and never after a touch', () => {
  const base = { expectedTop: 640, currentTop: 640, scrollHeight: 2000, clientHeight: 600, userTouched: false };
  assert.equal(resolveLucySearchOpenGuardedTop(base), null);
  assert.equal(resolveLucySearchOpenGuardedTop({ ...base, currentTop: 641 }), null);
  // 포커스가 대화를 최상단으로 끌어올린 경우에는 읽던 자리로 되돌린다.
  assert.equal(resolveLucySearchOpenGuardedTop({ ...base, currentTop: 0 }), 640);
  // 사용자가 직접 스크롤했다면 절대 되돌리지 않는다.
  assert.equal(resolveLucySearchOpenGuardedTop({ ...base, currentTop: 0, userTouched: true }), null);
  // 레이아웃이 줄어 되돌릴 수 없으면 남은 범위 안으로 클램프한다.
  assert.equal(resolveLucySearchOpenGuardedTop({ ...base, currentTop: 0, scrollHeight: 900, clientHeight: 600 }), 300);
});

test('an unreadable scrollTop is treated as the latest messages, not as the top', () => {
  const anchor = captureLucySearchAnchor(Number.NaN, 1000, 100);
  assert.equal(anchor.pinnedToBottom, true);
  assert.equal(anchor.distanceFromBottom, 0);
});

// ── TTS 낭독 중 스크롤이 위아래로 출렁이지 않아야 한다 ─────────────────────────────────

test('a sentence already sitting around the middle is left alone', () => {
  const plan = planTtsScroll({
    currentTop: 500,
    maxTop: 4000,
    targetCenterOffset: 30,
    targetRelativeTop: 280,
    targetRelativeBottom: 320,
    containerHeight: 600,
    lastTargetTop: null,
  });
  assert.equal(plan.scroll, false);
});

test('a sentence far below the middle is brought to the middle once', () => {
  const plan = planTtsScroll({
    currentTop: 500,
    maxTop: 4000,
    targetCenterOffset: 320,
    targetRelativeTop: 570,
    targetRelativeBottom: 610,
    containerHeight: 600,
    lastTargetTop: null,
  });
  assert.equal(plan.scroll, true);
  assert.equal(plan.top, 820);
  assert.ok(plan.duration >= 180 && plan.duration <= 460);
});

test('the same target is not re-animated on every sentence tick', () => {
  const base = {
    currentTop: 500,
    maxTop: 4000,
    targetCenterOffset: 320,
    targetRelativeTop: 570,
    targetRelativeBottom: 610,
    containerHeight: 600,
  };
  const first = planTtsScroll({ ...base, lastTargetTop: null });
  assert.equal(first.scroll, true);
  const again = planTtsScroll({ ...base, lastTargetTop: first.top });
  assert.equal(again.scroll, false);
});

test('a small upward correction is skipped while the sentence is still comfortably visible', () => {
  const plan = planTtsScroll({
    currentTop: 900,
    maxTop: 4000,
    targetCenterOffset: -120,
    targetRelativeTop: 120,
    targetRelativeBottom: 170,
    containerHeight: 600,
    lastTargetTop: null,
  });
  assert.equal(plan.scroll, false);
});

test('the target never leaves the scrollable range', () => {
  const plan = planTtsScroll({
    currentTop: 3800,
    maxTop: 4000,
    targetCenterOffset: 900,
    targetRelativeTop: 500,
    targetRelativeBottom: 560,
    containerHeight: 600,
    lastTargetTop: null,
    force: true,
  });
  assert.equal(plan.top, 4000);
  assert.equal(plan.scroll, true);
});

test('a forced recenter ignores the dead zone but not an identical position', () => {
  const centered = planTtsScroll({
    currentTop: 700,
    maxTop: 4000,
    targetCenterOffset: 0,
    targetRelativeTop: 300,
    targetRelativeBottom: 340,
    containerHeight: 600,
    lastTargetTop: null,
    force: true,
  });
  assert.equal(centered.scroll, false);
  const forced = planTtsScroll({
    currentTop: 700,
    maxTop: 4000,
    targetCenterOffset: 40,
    targetRelativeTop: 340,
    targetRelativeBottom: 380,
    containerHeight: 600,
    lastTargetTop: null,
    force: true,
  });
  assert.equal(forced.scroll, true);
});

test('the dead zone scales with the viewport but keeps a readable minimum', () => {
  assert.equal(ttsScrollDeadZone(0), 56);
  assert.equal(ttsScrollDeadZone(400), 88);
  assert.ok(ttsScrollDeadZone(1200) > ttsScrollDeadZone(600));
});

test('the highlight being read is taken from the message currently playing', () => {
  assert.match(smartScroll, /\[data-tts-playing-message="true"\]/);
  assert.match(page, /data-tts-playing-message=\{playingMsgId === msgId \? 'true' : undefined\}/);
});

test('the reading-position buttons smoothly return to the active sentence on Lucy and Trinity', () => {
  assert.match(smartScroll, /type SmartScrollBehavior = 'auto' \| 'smooth'/);
  assert.match(smartScroll, /resumeAutoScroll = useCallback\(\(behavior: SmartScrollBehavior = 'auto'\)/);
  assert.match(smartScroll, /scrollToActiveSentence\(true, behavior\)/);
  assert.match(smartScroll, /container\.scrollTo\(\{ top: finalTop, behavior \}\)/);
  assert.match(page, /onResume=\{\(\) => resumeLucyAutoScroll\('smooth'\)\}/);
  assert.match(trinityPage, /onResume=\{\(\) => resumeMainAutoScroll\('smooth'\)\}/);
});

test('automatic sentence tracking keeps its immediate behavior', () => {
  assert.match(smartScroll, /if \(!isUserOverridingRef\.current\) scrollToActiveSentence\(false\)/);
  assert.match(smartScroll, /resumeAutoScroll\(\);\s+\}, resumeDelayMs\)/);
});

test('the conversation is not dragged to the bottom in the gaps between TTS chunks', () => {
  assert.match(page, /const ttsHoldsScrollRef = useRef\(false\);/);
  assert.match(page, /ttsBlocksAutoScrollRef\.current = ttsInfo\.isSpeaking \|\| ttsInfo\.isLoading \|\| ttsHoldsScrollRef\.current;/);
  assert.match(page, /if \(ttsHoldsScrollRef\.current\) return;/);
  // 낭독 중에는 레이아웃 변화가 하단 자동 이동을 다시 부르지 않는다.
  const resizeObserverBlock = page.slice(page.indexOf('resizeObserver.observe(messagesWrapperRef.current)'), page.indexOf('lucy-chat-content-resized'));
  assert.doesNotMatch(resizeObserverBlock, /ttsInfo\.isSpeaking/);
});

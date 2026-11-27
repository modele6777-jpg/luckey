import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync(new URL('../src/pages/LucyStandalonePage.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../src/styles/lucy-starlight.css', import.meta.url), 'utf8');

const containerRule = styles.match(/\.lucy-prompts-marquee-container\s*\{([^}]*)\}/)?.[1] ?? '';
const trackRule = styles.match(/\.lucy-prompts-marquee-track\s*\{([^}]*)\}/)?.[1] ?? '';

test('추천 질문 마키는 가로 스크롤 컨테이너로 동작하고 스크롤바는 숨긴다', () => {
  assert.match(containerRule, /overflow-x:\s*auto/);
  assert.match(containerRule, /overflow-y:\s*hidden/);
  assert.match(containerRule, /scrollbar-width:\s*none/);
  assert.match(containerRule, /-ms-overflow-style:\s*none/);
  assert.match(containerRule, /touch-action:\s*pan-x/);
  assert.match(containerRule, /-webkit-overflow-scrolling:\s*touch/);
  assert.match(containerRule, /mask-image:/);
  assert.match(styles, /\.lucy-prompts-marquee-container::-webkit-scrollbar\s*\{[^}]*display:\s*none/);
});

test('CSS 애니메이션 흐름은 제거되고 JS 루프가 자동 흐름을 맡는다', () => {
  assert.doesNotMatch(styles, /@keyframes lucy-prompts-flow/);
  assert.doesNotMatch(trackRule, /animation:/);
  assert.match(page, /const PROMPTS_MARQUEE_FLOW_DURATION_MS/);
  assert.match(page, /window\.requestAnimationFrame\(advance\)/);
  assert.match(page, /if \(reduceMotionQuery\?\.matches\) return;/);
});

test('스크롤 위치는 루프 폭으로 감아 양방향 무한 순환한다', () => {
  assert.match(page, /const halfWidth = track\.scrollWidth \/ 2;/);
  assert.match(page, /const next = \(\(base % loop\) \+ loop\) % loop;/);
  assert.match(page, /if \(container\.scrollLeft <= 0\) container\.scrollLeft = 1;/);
});

test('터치·포인터 드래그·휠이 모두 가로 이동에 반영되고 조작 중에는 자동 흐름이 멈춘다', () => {
  assert.match(page, /onTouchStart=\{handlePromptsMarqueeTouchStart\}/);
  assert.match(page, /onTouchEnd=\{handlePromptsMarqueeTouchEnd\}/);
  assert.match(page, /onPointerDown=\{handlePromptsMarqueePointerDown\}/);
  assert.match(page, /onPointerMove=\{handlePromptsMarqueePointerMove\}/);
  assert.match(page, /const handleNativeWheel = \(event: WheelEvent\) => \{/);
  assert.match(page, /container\.addEventListener\('wheel', handleNativeWheel, \{ passive: false \}\)/);
  assert.match(page, /const delta = Math\.abs\(event\.deltaY\) > Math\.abs\(event\.deltaX\) \? event\.deltaY : event\.deltaX;/);
  assert.match(page, /if \(hold\.hover \|\| hold\.dragging \|\| hold\.touched\) return;/);
  assert.match(page, /PROMPTS_MARQUEE_RESUME_DELAY_MS = 1200/);
});

test('드래그 직후의 칩 클릭은 막고, 칩 클릭으로 질문을 고르는 동작은 그대로 남긴다', () => {
  assert.match(page, /onClickCapture=\{handlePromptsMarqueeClickCapture\}/);
  assert.match(page, /onClick=\{\(\) => handleSelectRecommendationChip\(promptText\)\}/);
  assert.match(page, /if \(!drag\.moved && Math\.abs\(dx\) > 4\) \{/);
  // 단순 클릭에서 포인터를 잡으면 click이 컨테이너로 가서 질문 선택이 막히므로,
  // 포인터 캡처는 실제 끌기가 시작된 뒤에만 건다.
  assert.match(page, /if \(!drag\.moved\) return;/);
  assert.match(page, /tabIndex=\{promptIdx >= currentPrompts\.length \? -1 : undefined\}/);
});


test('로더가 사라진 뒤 마키가 실제로 마운트되면 자동 흐름 효과를 다시 시작한다', () => {
  assert.match(page, /if \(!isLucyReady \|\| !showSuggestedQuestions\) return;\s*const container = promptsMarqueeRef\.current/);
  assert.match(page, /\}, \[isLucyReady, showSuggestedQuestions, currentPrompts\.length, measurePromptsMarqueeLoop, wrapPromptsMarquee\]\)/);
  assert.match(page, /PROMPTS_MARQUEE_MAX_PX_PER_SECOND = 22/);
  assert.match(containerRule, /scroll-behavior:\s*auto/);
  assert.match(trackRule, /flex:\s*0 0 auto/);
});

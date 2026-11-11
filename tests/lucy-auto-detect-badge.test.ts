import test from 'node:test';
import assert from 'node:assert/strict';
import {
  detectLucyChannelsFromText,
  getSeptagramBadgeStyle,
  SEPTAGRAM_RAINBOW_ORDER,
  SEPTAGRAM_RAINBOW_PALETTE,
  shouldShowAutoDetectionBadge,
} from '../src/lib/lucyAutoModeDetector.ts';

const stages = ['prologue', 'orange', 'trinity', 'aura', 'bluebird', 'muse', 'epilogue'] as const;

test('casual conversation is detected as casual and never shows the AI badge', () => {
  const casual = detectLucyChannelsFromText('안녕! 사소한 일상 이야기를 편하게 나누고 싶어.');
  assert.equal(casual.isCasual, true);
  assert.deepEqual(casual.channels, []);
  assert.equal(shouldShowAutoDetectionBadge(true, true, '오늘 어땠어?', casual), false);
  assert.equal(shouldShowAutoDetectionBadge(false, true, '홍국기문 분석해줘', { isCasual: false }), false);
  assert.equal(shouldShowAutoDetectionBadge(true, true, '테마 질문', null), false);
});

test('a detected theme displays its AI badge while focused', () => {
  const themed = detectLucyChannelsFromText('홍국기문(기문둔갑)으로 지금 막힌 상황을 분석해줘.');
  assert.equal(themed.isCasual, false);
  assert.ok(themed.channels.includes('orange'));
  assert.equal(shouldShowAutoDetectionBadge(true, true, '홍국기문 분석해줘', themed), true);
  assert.equal(shouldShowAutoDetectionBadge(true, false, '홍국기문 분석해줘', themed), false);
});

test('seven stages follow the red-to-violet rainbow from Prologue through Epilogue', () => {
  assert.deepEqual([...SEPTAGRAM_RAINBOW_ORDER], [...stages]);
  assert.deepEqual(stages.map((stage) => SEPTAGRAM_RAINBOW_PALETTE[stage].background), [
    '#fee2e2', '#ffedd5', '#fef9c3', '#dcfce7', '#dbeafe', '#e0e7ff', '#f3e8ff',
  ]);
});

test('multi-theme badges retain rainbow stage order even if detections arrive unordered', () => {
  const style = getSeptagramBadgeStyle(['epilogue', 'aura', 'prologue', 'trinity']);
  assert.equal(style.color, '#312e81');
  assert.ok(style.backgroundImage);
  let previous = -1;
  for (const stage of ['prologue', 'trinity', 'aura', 'epilogue'] as const) {
    const position = style.backgroundImage!.indexOf(SEPTAGRAM_RAINBOW_PALETTE[stage].background);
    assert.ok(position > previous);
    previous = position;
  }
});

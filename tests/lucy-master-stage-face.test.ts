import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getLucyMasterDefaultTableFace, reduceLucyMasterTableFace } from '../src/lib/lucyMasterTableFace';

test('unified Lucy Pro opens on the saju board and has no stage-specific default', () => {
  assert.equal(getLucyMasterDefaultTableFace(1), 'saju');
  assert.equal(getLucyMasterDefaultTableFace(2), 'saju');
  assert.equal(getLucyMasterDefaultTableFace(3), 'saju');
  assert.equal(getLucyMasterDefaultTableFace(), 'saju');
});

test('answers and taps keep the chosen tab, a mode reset returns to the saju board', () => {
  let face = reduceLucyMasterTableFace(getLucyMasterDefaultTableFace(), { type: 'tab-selected', face: 'scrolls' });
  assert.equal(face, 'scrolls');
  face = reduceLucyMasterTableFace(face, { type: 'answer-updated' });
  assert.equal(face, 'scrolls');
  // 단계 변경은 더 이상 일어나지 않지만, 들어와도 사용자가 고른 탭을 빼앗지 않는다.
  face = reduceLucyMasterTableFace(face, { type: 'stage-changed', depth: 1, changed: false });
  assert.equal(face, 'scrolls');
  assert.equal(reduceLucyMasterTableFace('recommended', { type: 'mode-reset' }), 'saju');
});

test('a tarot request brings the tarot table forward', () => {
  assert.equal(reduceLucyMasterTableFace('saju', { type: 'tarot-requested' }), 'tarot');
});

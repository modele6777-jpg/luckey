import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getLucyMasterDefaultTableFace, reduceLucyMasterTableFace } from '../src/lib/lucyMasterTableFace';

test('Lucy Pro defaults to saju, tarot, then recommended tools by stage', () => {
  assert.equal(getLucyMasterDefaultTableFace(1), 'saju');
  assert.equal(getLucyMasterDefaultTableFace(2), 'tarot');
  assert.equal(getLucyMasterDefaultTableFace(3), 'recommended');
});

test('a stage change selects its default, while answers preserve a manually selected tab', () => {
  let face = getLucyMasterDefaultTableFace(1);
  face = reduceLucyMasterTableFace(face, { type: 'stage-changed', depth: 2, changed: true });
  assert.equal(face, 'tarot');

  face = reduceLucyMasterTableFace(face, { type: 'tab-selected', face: 'saju' });
  face = reduceLucyMasterTableFace(face, { type: 'answer-updated' });
  assert.equal(face, 'saju');

  face = reduceLucyMasterTableFace(face, { type: 'stage-changed', depth: 3, changed: true });
  assert.equal(face, 'recommended');
  face = reduceLucyMasterTableFace(face, { type: 'tab-selected', face: 'scrolls' });
  face = reduceLucyMasterTableFace(face, { type: 'answer-updated' });
  assert.equal(face, 'scrolls');
  face = reduceLucyMasterTableFace(face, { type: 'stage-changed', depth: 3, changed: false });
  assert.equal(face, 'scrolls');
});

test('mode reset returns the left side to the first-stage saju view', () => {
  assert.equal(reduceLucyMasterTableFace('recommended', { type: 'mode-reset' }), 'saju');
});

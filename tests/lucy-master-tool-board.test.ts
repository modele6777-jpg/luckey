import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildToolBoard, findToolSignal } from '../src/lib/lucyMasterToolBoard';
import { LUCY_MASTER_DEPTH3_TOOLS } from '../src/lib/divination/smartAgentRouter';

const audit = (overrides: Record<string, { status: any; sentToModel: boolean; note?: string }> = {}) =>
  LUCY_MASTER_DEPTH3_TOOLS.map(id => ({ toolId: id, name: id, status: 'calculated', sentToModel: true, ...overrides[id] })) as any[];

test('empty audit shows the waiting board', () => {
  assert.equal(buildToolBoard({ audit: [], concern: '', answer: '' }).hasResults, false);
});

test('recommendation follows the concern and is stable for the same input', () => {
  const career = buildToolBoard({ audit: audit(), concern: '이직 고민이 많아', answer: '' });
  assert.equal(career.recommended.id, 'qimen');
  assert.deepEqual(buildToolBoard({ audit: audit(), concern: '이직 고민이 많아', answer: '' }).others.map(i => i.id), career.others.map(i => i.id));
  assert.equal(buildToolBoard({ audit: audit(), concern: '그 사람 마음이 궁금해', answer: '' }).recommended.id, 'ziwei');
  assert.equal(career.others.length, 12);
});

test('tools Lucy mentioned float up, tools missing birth data sink and are never recommended', () => {
  const answer = '주역의 괘는 지금 멈추라고 해. 토정비결도 이달은 조심하라고 하고.';
  const board = buildToolBoard({
    audit: audit({ qimen: { status: 'skipped', sentToModel: false, note: '출생시간(생시)이 필요합니다' } }),
    concern: '이직 고민', answer,
  });
  assert.notEqual(board.recommended.id, 'qimen');
  assert.equal(board.others.at(-1)!.id, 'qimen');
  assert.equal(board.others.at(-1)!.status, 'needs_info');
  const commons = board.others.filter(i => i.common).map(i => i.id);
  assert.deepEqual(board.others.slice(0, commons.length).map(i => i.id), commons);
  assert.ok(commons.includes('iching') && commons.includes('tojeong'));
});

test('qualified astrology names do not count as Western astrology', () => {
  assert.equal(findToolSignal('astrology', '베딕 점성술로 보면 카르마가 보여.'), '');
  assert.notEqual(findToolSignal('vedic', '베딕 점성술로 보면 카르마가 보여.'), '');
});

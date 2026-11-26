import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildToolBoard, findToolSignal } from '../src/lib/lucyMasterToolBoard';
import { LUCY_PRO_TOOLS } from '../src/lib/divination/smartAgentRouter';

const audit = (overrides: Record<string, { status: any; sentToModel: boolean; note?: string }> = {}) =>
  LUCY_PRO_TOOLS.map(id => ({ toolId: id, name: id, status: 'calculated', sentToModel: true, ...overrides[id] })) as any[];

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

test('parchment facts come only from calculated tool data', async () => {
  const { extractToolFacts, extractAllToolFacts } = await import('../src/lib/lucyMasterToolFacts');
  const iching = extractToolFacts('iching', { primary: { number: 43, name: '택천쾌' }, movingLines: [5], changed: { number: 34, name: '뇌천대장' } });
  assert.deepEqual(iching.map(f => f.label), ['본괘', '변하는 효', '지괘']);
  assert.deepEqual(extractToolFacts('kabbalah', { anything: 1 }), []);
  assert.deepEqual(extractToolFacts('qimen', null), []);
  const all = extractAllToolFacts(['iching', 'qimen'], { iching: { status: 'symbolic', data: {} }, qimen: { status: 'skipped' } });
  assert.deepEqual(all, {});
  const board = buildToolBoard({ audit: audit({ kabbalah: { status: 'symbolic', sentToModel: false } }), concern: '이직', answer: '', facts: { kabbalah: [{ label: 'x', value: 'y' }], iching: iching } });
  assert.deepEqual(board.others.find(i => i.id === 'kabbalah')!.facts, []);
  assert.equal(board.others.find(i => i.id === 'iching')!.facts.length, 3);
});

test('liuren master reads the library lessons and transmissions instead of fixed defaults', async () => {
  const { calculateLiurenMaster, normalizeRawLessons, normalizeRawTransmissions, toKoreanGeneral } = await import('../src/lib/divination/liurenMasterEngine');
  assert.deepEqual(normalizeRawLessons({ ke1: ['子己', '勾陈'], ke2: ['巳子', '玄武'], ke3: ['辰亥', '太常'], ke4: ['酉辰', '腾蛇'] }).map(l => `${l.upper}${l.lower}`), ['子己', '巳子', '辰亥', '酉辰']);
  assert.deepEqual(normalizeRawTransmissions({ chuChuan: ['巳', '玄武'], zhongChuan: ['戌', '朱雀'], moChuan: ['卯', '白虎'] }).map(t => t.branch), ['巳', '戌', '卯']);
  assert.equal(toKoreanGeneral('青龙'), '청룡');
  const seen = new Set<string>();
  for (const iso of ['2026-11-21T12:50:00Z', '2026-11-22T03:10:00Z', '2026-12-05T08:00:00Z']) {
    const r = calculateLiurenMaster(new Date(iso));
    seen.add(r.fourLessons.map(l => l.upper + l.lower).join() + r.threeTransmissions.map(t => t.branch + t.general).join());
  }
  assert.ok(seen.size > 1, 'different instants give different boards');
});

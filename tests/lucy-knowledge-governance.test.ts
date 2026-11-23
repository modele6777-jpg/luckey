import assert from 'node:assert/strict';
import test from 'node:test';
import { buildKnowledgeCards } from '../src/lib/divination/knowledge/index.ts';
import { clearApprovedKnowledgeSnapshot, setApprovedKnowledgeSnapshot } from '../src/lib/divination/knowledge/approvedCardsStore.ts';
import {
  hasVerifiedFullTextSource,
  isConsultationEligibleCard,
  selectApprovedCardsForEngine,
  type GovernedKnowledgeCard,
  type KnowledgeSource,
} from '../src/lib/divination/knowledge/governance.ts';

const verifiedSource: KnowledgeSource = {
  title: '전통 해석 원문',
  authors: ['연구자'],
  publication: '전통 문헌',
  year: '2020',
  doi: '10.0000/test',
  url: 'https://example.org/source',
  sourceKind: 'primary_text',
  verification: 'original_text_checked',
  access: 'full_text',
};
function card(overrides: Partial<GovernedKnowledgeCard> = {}): GovernedKnowledgeCard {
  return {
    id: 'approved-iching',
    engineId: 'iching',
    theme: 'knowledge-growth',
    title: '원문에 근거한 주역 카드',
    core: '원문에서 확인한 핵심 해석입니다.',
    use: '계산된 괘의 상징을 설명할 때만 참고합니다.',
    caution: '과학적 예측으로 단정하지 않습니다.',
    sourceIds: [verifiedSource.doi!],
    sources: [verifiedSource],
    status: 'approved',
    active: true,
    version: 1,
    ...overrides,
  };
}

test('only approved, active, full-text-verified cards are consultation eligible', () => {
  assert.equal(isConsultationEligibleCard(card()), true);
  assert.equal(isConsultationEligibleCard(card({ status: 'pending_review' })), false);
  assert.equal(isConsultationEligibleCard(card({ active: false })), false);
  assert.equal(isConsultationEligibleCard(card({ sources: [{ ...verifiedSource, access: 'abstract_only' }] })), false);
  assert.equal(hasVerifiedFullTextSource([{ ...verifiedSource, verification: 'metadata_checked' }]), false);
});

test('approved cards are limited to the calculated engine and a maximum of two', () => {
  const eligible = [card(), card({ id: 'second' }), card({ id: 'third' })];
  const otherEngine = card({ id: 'other-engine', engineId: 'saju' });
  const pending = card({ id: 'pending', status: 'pending_review' });
  const selected = selectApprovedCardsForEngine('iching', [...eligible, otherEngine, pending], 9);
  assert.deepEqual(selected.map((item) => item.id), ['approved-iching', 'second', 'third'].slice(0, 4));
  assert.equal(selectApprovedCardsForEngine('iching', eligible, 2).length, 2);
  assert.equal(selectApprovedCardsForEngine('saju', eligible, 2).length, 0);
});

test('dynamic cards attach only to a non-empty calculated result from the same engine', () => {
  const sourceCard = card();
  setApprovedKnowledgeSnapshot([sourceCard, card({ id: 'unverified', sources: [{ ...verifiedSource, access: 'metadata_only' }] })]);
  const calculated = buildKnowledgeCards([{ toolId: 'iching', status: 'calculated', data: { hexagramNumber: 1 } }]);
  assert.equal(calculated.length, 1);
  assert.match(calculated[0], /원문에 근거한 주역 카드/);
  assert.equal(buildKnowledgeCards([{ toolId: 'saju', status: 'calculated', data: { pillars: ['甲子'] } }]).length, 0);
  assert.deepEqual(buildKnowledgeCards([{ toolId: 'iching', status: 'calculated', data: {} }]), []);
  assert.deepEqual(buildKnowledgeCards([{ toolId: 'iching', status: 'skipped', data: { hexagramNumber: 1 } }]), []);
  clearApprovedKnowledgeSnapshot();
});

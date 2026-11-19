import { test } from 'node:test';
import assert from 'node:assert/strict';
import { routeAndExecute } from '../src/lib/divination/smartAgentRouter';
import {
  parseAnswerChoices,
  isAcceptingTarotDrawOffer,
  isAskingForDeepEngines,
  buildTarotHouseGuide,
  findConcernAnchor,
  createTarotHouseGreeting,
  createTarotHouseConcernQuestion,
} from '../src/lib/lucyMasterMode';

const profile = {
  basic: { name: '검사용', birthdate: '1990-05-17', birthtime: '14:30', gender: 'female' as const, birthCity: '서울', lunarSolar: 'solar' as const },
} as any;

test('divination mode keeps saju as the main base without full mobilization', () => {
  const r = routeAndExecute({ text: '요즘 이직 고민이 많아', profile, requireBasicAndDeep: true, divinationMode: { base: 'saju' } });
  assert.equal(r.routePlan.isMasterMobilization, false);
  assert.deepEqual(r.routePlan.targetTools, ['saju']);
  assert.ok((r.routePlan.deepEngineKeys ?? []).length <= 1);
});

test('unfolded tarot draw adds tarot to the saju base', () => {
  const r = routeAndExecute({ text: '카드 뽑아줘', profile, requireBasicAndDeep: true, divinationMode: { base: 'tarot_saju' } });
  assert.deepEqual(r.routePlan.targetTools.slice(0, 2), ['saju', 'tarot']);
});

test('deep request adds concern-related engines', () => {
  const light = routeAndExecute({ text: '이직 고민', profile, requireBasicAndDeep: true, divinationMode: { base: 'saju' } });
  const deep = routeAndExecute({ text: '이직 고민', profile, requireBasicAndDeep: true, divinationMode: { base: 'saju', deep: true } });
  assert.ok(deep.routePlan.targetTools.length > light.routePlan.targetTools.length);
  assert.ok((deep.routePlan.deepEngineKeys ?? []).length > (light.routePlan.deepEngineKeys ?? []).length);
  assert.equal(deep.routePlan.isMasterMobilization, false);
});

test('answer choices are parsed from the last line', () => {
  const r = parseAnswerChoices('요즘 많이 지쳤어?\n[답변선택: 응, 좀 지쳤어 | 아니 괜찮아 | 잘 모르겠어]');
  assert.equal(r.text, '요즘 많이 지쳤어?');
  assert.deepEqual(r.choices, ['응, 좀 지쳤어', '아니 괜찮아', '잘 모르겠어']);
  assert.deepEqual(parseAnswerChoices('그냥 말').choices, []);
});

test('accepting a tarot offer and asking for deeper engines are detected', () => {
  const offer = '카드 한 장 뽑아볼까?\n[답변선택: 응, 뽑아볼래 | 조금 더 얘기할래]';
  assert.equal(isAcceptingTarotDrawOffer('응, 뽑아볼래', offer), true);
  assert.equal(isAcceptingTarotDrawOffer('아니 조금 더 얘기할래', offer), false);
  assert.equal(isAcceptingTarotDrawOffer('응', '오늘 어땠어?'), false);
  assert.equal(isAskingForDeepEngines('응, 더 깊게 볼래', '관련된 다른 관점들도 더 볼래?'), true);
  assert.equal(isAskingForDeepEngines('지금은 괜찮아', '관련된 다른 관점들도 더 볼래?'), false);
});

test('house guide asks one question at a time with choices', () => {
  const g = buildTarotHouseGuide('unfolded', false);
  assert.match(g, /\[답변선택:/);
  assert.match(g, /메인은 사주/);
});

test('concern anchor skips choice taps and keeps the first real worry', () => {
  const anchor = findConcernAnchor([
    { role: 'model', content: '어서 와' },
    { role: 'user', content: '새로 시작할래' },
    { role: 'user', content: '일·진로' },
    { role: 'user', content: '회사를 옮길지 계속 고민 중이야' },
    { role: 'user', content: '근데 오늘 점심 뭐 먹지' },
  ] as any);
  assert.equal(anchor, '회사를 옮길지 계속 고민 중이야');
  assert.match(buildTarotHouseGuide('folded', false, false, anchor), /중심 고민/);
});

test('greeting and post-link message both end by asking for a concern with choices', () => {
  for (const msg of [createTarotHouseGreeting('쭈', 'folded'), createTarotHouseGreeting('쭈', 'unfolded'), createTarotHouseConcernQuestion(true), createTarotHouseConcernQuestion(false)]) {
    const parsed = parseAnswerChoices(String(msg.content));
    assert.match(parsed.text, /고민이나 궁금한 게 있어\?/);
    assert.deepEqual(parsed.choices, ['연애·관계', '일·진로', '돈·재물', '마음이 복잡해']);
  }
  const linkAsk = parseAnswerChoices(String(createTarotHouseGreeting('쭈', 'folded', true).content));
  assert.deepEqual(linkAsk.choices, ['루시랑 하던 얘기 이어서', '새로 시작할래']);
});

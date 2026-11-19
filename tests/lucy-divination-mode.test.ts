import { test } from 'node:test';
import assert from 'node:assert/strict';
import { routeAndExecute } from '../src/lib/divination/smartAgentRouter';
import {
  parseAnswerChoices,
  isAcceptingTarotDrawOffer,
  isAskingForDeepEngines,
  buildTarotHouseGuide,
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

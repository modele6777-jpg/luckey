import { test } from 'node:test';
import assert from 'node:assert/strict';
import { routeAndExecute, LUCY_PRO_TOOLS } from '../src/lib/divination/smartAgentRouter';
import {
  parseAnswerChoices,
  getPendingAnswerChoices,
  isAcceptingTarotDrawOffer,
  isAskingForDeepEngines,
  buildTarotHouseGuide,
  findConcernAnchor,
  createTarotHouseGreeting,
  createTarotHouseConcernQuestion,
  createDepthTwoTarotOffer,
} from '../src/lib/lucyMasterMode';

const profile = {
  basic: { name: '검사용', birthdate: '1990-05-17', birthtime: '14:30', gender: 'female' as const, birthCity: '서울', lunarSolar: 'solar' as const },
} as any;

test('divination mode keeps saju at the center and adds only the tools this concern needs', () => {
  const r = routeAndExecute({ text: '요즘 이직 고민이 많아', profile, requireBasicAndDeep: true, divinationMode: { base: 'saju' } });
  assert.equal(r.routePlan.isMasterMobilization, false);
  // 통합 상담: 사주가 중심이고, 질문에 맞는 소수 도구만 함께 계산한다(15대 전수 동원 아님).
  assert.equal(r.routePlan.targetTools[0], 'saju');
  assert.ok(r.routePlan.targetTools.length >= 1 && r.routePlan.targetTools.length <= 3, `basic tools stayed within the cap: ${r.routePlan.targetTools.length}`);
  assert.ok(r.routePlan.targetTools.length < 14);
  assert.ok((r.routePlan.deepEngineKeys ?? []).length >= 1);
  assert.ok((r.routePlan.deepEngineKeys ?? []).length <= 2);
});

test('unfolded tarot draw adds tarot to the saju base', () => {
  const r = routeAndExecute({ text: '카드 뽑아줘', profile, requireBasicAndDeep: true, divinationMode: { base: 'tarot_saju' } });
  assert.deepEqual(r.routePlan.targetTools.slice(0, 2), ['saju', 'tarot']);
});

test('a deep request widens the symbolic perspectives, not the tool set', () => {
  const light = routeAndExecute({ text: '이직 고민', profile, requireBasicAndDeep: true, divinationMode: { base: 'saju' } });
  const deep = routeAndExecute({ text: '이직 고민', profile, requireBasicAndDeep: true, divinationMode: { base: 'saju', deep: true } });
  assert.deepEqual(deep.routePlan.targetTools, light.routePlan.targetTools);
  assert.ok((deep.routePlan.deepEngineKeys ?? []).length > (light.routePlan.deepEngineKeys ?? []).length);
  assert.equal(deep.routePlan.isMasterMobilization, false);
});

test('the unified pro mode carries saju and only the handful of tools the concern needs', () => {
  const run = (base: 'saju' | 'tarot_saju' = 'saju') => routeAndExecute({ text: '이직 고민', profile, requireBasicAndDeep: true, divinationMode: { base } }).routePlan.targetTools;
  const plain = run();
  const withTarot = run('tarot_saju');
  assert.deepEqual(plain.slice(0, 1), ['saju']);
  assert.ok(plain.length >= 1 && plain.length <= 3, `plain: ${plain.join(',')}`);
  // 13대 도구를 매 턴 전부 돌리지 않는다 — 질문에 맞는 소수만 고른다.
  assert.ok(LUCY_PRO_TOOLS.filter(id => plain.includes(id)).length <= 2, plain.join(','));
  assert.deepEqual(withTarot.slice(0, 2), ['saju', 'tarot']);
  assert.ok(withTarot.length <= 3, `withTarot: ${withTarot.join(',')}`);
  // 타로는 손님이 직접 고른 카드가 있을 때만 붙는다.
  assert.ok(!plain.includes('tarot'));
  assert.ok(plain.includes('saju'));
});

test('answer choices are parsed from the last line', () => {
  const r = parseAnswerChoices('요즘 많이 지쳤어?\n[답변선택: 응, 좀 지쳤어 | 아니 괜찮아 | 잘 모르겠어]');
  assert.equal(r.text, '요즘 많이 지쳤어?');
  assert.deepEqual(r.choices, ['응, 좀 지쳤어', '아니 괜찮아', '잘 모르겠어']);
  assert.deepEqual(parseAnswerChoices('그냥 말').choices, []);
});

test('Lucy keeps an explicit question pending until the user answers with text or a choice', () => {
  const choices = ['응, 한 장 뽑아볼래', '세 장 뽑아줘', '사주로만 계속할래'];
  const offer = { role: 'model' as const, content: '카드로 마음을 볼까?\n[답변선택: 응, 한 장 뽑아볼래 | 세 장 뽑아줘 | 사주로만 계속할래]' };
  assert.deepEqual(getPendingAnswerChoices([offer]), choices);
  assert.deepEqual(getPendingAnswerChoices([offer, { role: 'model', content: '' }]), choices);
  assert.deepEqual(getPendingAnswerChoices([offer, { role: 'user', content: '한 장으로 부탁해' }]), []);
  assert.deepEqual(getPendingAnswerChoices([offer, { role: 'user', content: choices[1] }, { role: 'model', content: '좋아, 카드를 준비할게.' }]), []);
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

test('engine presets only reference registered catalog engines', async () => {
  const { LUCY_ENGINE_PRESETS, splitSelectedEngines } = await import('../src/lib/lucyEngineSelection');
  const { LUCY_PRO_CATALOG_ENGINES } = await import('../src/lib/divination/engineCatalog');
  const keys = new Set(LUCY_PRO_CATALOG_ENGINES.map(e => e.key));
  for (const preset of LUCY_ENGINE_PRESETS) {
    for (const key of preset.keys) assert.ok(keys.has(key), `${preset.id}: ${key}`);
  }
  const split = splitSelectedEngines(['saju', 'tarot', 'shadowArchetype', 'unknownKey']);
  assert.deepEqual(split, { pinnedTools: ['saju', 'tarot'], pinnedDeepKeys: ['shadowArchetype'] });
});

test('engines picked in the engine box are always used', () => {
  const r = routeAndExecute({
    text: '요즘 기분이 어때', profile, requireBasicAndDeep: true,
    pinnedTools: ['iching', 'ziwei'], pinnedDeepKeys: ['shadowArchetype', 'mentalResilience'],
  });
  assert.ok(r.routePlan.targetTools.includes('iching'));
  assert.ok(r.routePlan.targetTools.includes('ziwei'));
  assert.deepEqual((r.routePlan.deepEngineKeys ?? []).slice(0, 2), ['shadowArchetype', 'mentalResilience']);
  const m = routeAndExecute({ text: '이직 고민', profile, requireBasicAndDeep: true, divinationMode: { base: 'saju' }, pinnedDeepKeys: ['shadowArchetype', 'mentalResilience'] });
  assert.ok((m.routePlan.deepEngineKeys ?? []).includes('mentalResilience'));
});

test('prompt library and engine box recommend each other', async () => {
  const { recommendPresetForPrompt, recommendedEnginesForPrompt, recommendPromptsForEngines, LUCY_ENGINE_PRESETS } = await import('../src/lib/lucyEngineSelection');
  const { HORI_PROMPT_LIBRARY } = await import('../src/data/horiPromptLibrary');
  const reunion = HORI_PROMPT_LIBRARY.find(p => p.id === 'hori-5c-030')!;
  assert.equal(recommendPresetForPrompt(reunion).id, 'love');
  const engines = recommendedEnginesForPrompt(reunion);
  assert.ok(engines.includes('tarot') && engines.includes('astrology'));
  for (const preset of LUCY_ENGINE_PRESETS) {
    const picks = recommendPromptsForEngines(HORI_PROMPT_LIBRARY, preset.keys, 3);
    assert.equal(picks.length, 3, preset.id);
    assert.ok(picks.every(p => recommendPresetForPrompt(p).id === preset.id), preset.id);
  }
  assert.deepEqual(recommendPromptsForEngines(HORI_PROMPT_LIBRARY, [], 3), []);
});

test('depth two offer asks the user to pick cards and can be accepted or declined', () => {
  const offer = String(createDepthTwoTarotOffer('unfolded').content);
  assert.match(offer, /\[답변선택:/);
  assert.equal(isAcceptingTarotDrawOffer('응, 한 장 뽑아볼래', offer), true);
  assert.equal(isAcceptingTarotDrawOffer('세 장 뽑아줘', offer), true);
  assert.equal(isAcceptingTarotDrawOffer('사주로만 계속할래', offer), false);
});

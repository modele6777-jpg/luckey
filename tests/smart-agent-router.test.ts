import { test } from 'node:test';
import assert from 'node:assert/strict';
import { routeAndExecute, analyzeQuestionIntent } from '../src/lib/divination/smartAgentRouter';
import { extractEpisodicLedgerFromMemoryEntries, formatEpisodicSoulMemory } from '../src/lib/lucyEpisodicMemoryEngine';

const profile = {
  basic: {
    name: '검사용',
    birthdate: '1990-05-17',
    birthtime: '14:30',
    gender: 'female' as const,
    birthCity: '서울',
    lunarSolar: 'solar' as const,
  },
};

test('smart agent router routes career strategy to Machiavelli, Ryu Seong-ryong, Jung, and Dasan', () => {
  const plan = analyzeQuestionIntent('이번에 이직을 준비 중인데 커리어 방향을 어떻게 잡을까?');
  assert.equal(plan.intent, 'career_strategy');
  assert.ok(plan.deepEngineKeys?.includes('italianMachiavelliVirtuFortuna'));
  assert.ok(plan.deepEngineKeys?.includes('koreanRyuSeongryongJingbirok'));
  assert.ok(plan.deepEngineKeys?.includes('swissJungIndividuationArchetype'));
  assert.ok(plan.deepEngineKeys?.includes('koreanDasanJeongYagyongMokminSimseo'));
  assert.ok(plan.deepEnginesKo?.some(name => name.includes('마키아벨리')));

  const routed = routeAndExecute({ text: '이직 면접과 커리어 전략을 알려줘', profile });
  assert.match(routed.promptInjection, /질문에 맞춰 선택한 심층 참고 관점/);
  assert.match(routed.promptInjection, /마키아벨리/);
  assert.match(routed.promptInjection, /심층 관점 융합 가이드/);
});

test('smart agent router routes love relationship to Jung archetype, Sehando, Pascal, and Rumi', () => {
  const plan = analyzeQuestionIntent('그 사람 속마음과 우리 궁합이 궁금해');
  assert.equal(plan.intent, 'relationship_love');
  assert.ok(plan.deepEngineKeys?.includes('swissJungIndividuationArchetype'));
  assert.ok(plan.deepEngineKeys?.includes('koreanChusaKimJeonghuiSehando'));
  assert.ok(plan.deepEngineKeys?.includes('frenchPascalPenseesHeartReason'));
  assert.ok(plan.deepEngineKeys?.includes('islamicSufiRumiMasnaviDivineLove'));

  const routed = routeAndExecute({ text: '남친과의 연애 궁합을 봐줘', profile });
  assert.match(routed.promptInjection, /추사 김정희 세한도/);
  assert.match(routed.promptInjection, /파스칼 팡세/);
});

test('smart agent router routes immediate decision to Kierkegaard, Descartes, and Sun Tzu', () => {
  const plan = analyzeQuestionIntent('지금 이 결정을 바로 내려야 할까 말아야 할까?');
  assert.equal(plan.intent, 'immediate_decision');
  assert.ok(plan.deepEngineKeys?.includes('instantDecision'));
  assert.ok(plan.deepEngineKeys?.includes('danishKierkegaardStagesOfLife'));
  assert.ok(plan.deepEngineKeys?.includes('frenchDescartesCogitoClaraDistincta'));
  assert.ok(plan.deepEngineKeys?.includes('ancientChineseSunTzuArtOfWarStrategy'));
});

test('ordinary words containing 점 do not request an immediate divination', () => {
  for (const question of [
    '점심 추천해줘',
    '내 장점과 단점을 알려줘',
    '생각의 맹점을 점검해줘',
    '다른 관점에서 설명해줘',
    '점수가 무슨 뜻이야?',
    '점성술을 설명해줘',
  ]) {
    assert.notEqual(analyzeQuestionIntent(question).intent, 'immediate_decision', question);
  }
  assert.equal(analyzeQuestionIntent('오늘 점성술 흐름을 알려줘').intent, 'daily_timing_transit');
  assert.equal(analyzeQuestionIntent('그림의 장점을 설명해줘').intent, 'creative_mind');
});

test('explicit divination and decision requests retain immediate routing', () => {
  for (const question of [
    '점', '점!', '점 봐줘', '점좀봐줘', '점을 좀 봐줘', '점을 쳐줘',
    '점을 보고 싶어', '점을 볼까?', '오늘 점 봐줘', '내 점괘 알려줘',
    '기문둔갑으로 봐줘', '매화역수로 봐줘', '지금 갈까 말까?',
  ]) {
    assert.equal(analyzeQuestionIntent(question).intent, 'immediate_decision', question);
  }
});

test('episodic soul memory ledger extracts active threads, key people, and follow-ups', () => {
  const now = Date.now();
  const memoryEntries = [
    { timestamp: now - 86400000, role: 'user', text: '팀장님이랑 프로젝트 방향 때문에 갈등이 있어서 고민 중이야.' },
    { timestamp: now - 3600000, role: 'user', text: '다음 주에 새 앱 배포 준비 중인데 긴장된다.' },
  ];

  const ledger = extractEpisodicLedgerFromMemoryEntries(memoryEntries);
  assert.ok(ledger.activeThreads.some(t => t.category === 'career_project'));
  assert.ok(ledger.keyPeople.some(p => p.nameOrRole.includes('팀장')));
  assert.ok(ledger.openFollowUps.length > 0);

  const soulNote = formatEpisodicSoulMemory(ledger);
  assert.match(soulNote, /루시의 영혼 기억 노트/);
  assert.match(soulNote, /진행 중인 삶의 스레드/);
  assert.match(soulNote, /팀장/);
  assert.match(soulNote, /영혼 기억 연동 가이드/);
});

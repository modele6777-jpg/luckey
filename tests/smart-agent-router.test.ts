import { test } from 'node:test';
import assert from 'node:assert/strict';
import { routeAndExecute, analyzeQuestionIntent } from '../src/lib/divination/smartAgentRouter';
import { ALL_DCE_ENGINES, getCalculationAudit } from '../src/lib/divination/deterministicEngine';
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

  const routed = routeAndExecute({ text: '이직 면접과 커리어 전략을 알려줘', profile, isMasterRequested: true });
  assert.match(routed.promptInjection, /Lucy 심층 선택 관점/);
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

  const routed = routeAndExecute({ text: '남친과의 연애 궁합을 봐줘', profile, isMasterRequested: true });
  assert.match(routed.promptInjection, /추사 김정희 세한도/);
  assert.match(routed.promptInjection, /파스칼 팡세/);
});

test('ordinary mode enforces basic engine >= 1 (excluding casual) and excludes deep engines', () => {
  // 1. 수다모드(casual): 기본 도구 제외
  const casual = routeAndExecute({ text: '안녕', profile, isMasterRequested: false });
  assert.equal(casual.routePlan.isCasual, true);
  assert.equal(casual.routePlan.targetTools.length, 0);
  assert.equal(casual.promptInjection, '');

  // 2. 일반 상담: 기본 도구 1개 이상 필수 & 심층 도구 배제 (기본 15대만 고정)
  const query = routeAndExecute({ text: '오늘 시험 결과가 어떻게 될까?', profile, isMasterRequested: false });
  assert.equal(query.routePlan.isCasual, false);
  assert.ok(query.routePlan.targetTools.length >= 1);
  assert.equal(query.routePlan.deepEngineKeys?.length, 0);
  assert.doesNotMatch(query.promptInjection, /심층 참고 관점/);
});

test('master requests disable casual mode completely and enforce basic >= 1 and deep >= 1', () => {
  // 1. 인사말이어도 수다모드로 빠지지 않고 기본 >= 1, 심층 >= 1 발동
  const greeting = routeAndExecute({ text: '안녕', profile, isMasterRequested: true });
  assert.equal(greeting.routePlan.isCasual, false);
  assert.ok(greeting.routePlan.targetTools.length >= 1);
  assert.ok((greeting.routePlan.deepEngineKeys?.length ?? 0) >= 1);

  // 2. 일반 질문에서도 기본 >= 1, 심층 >= 1 발동
  const query = routeAndExecute({ text: '사업 투자 타이밍 좀 봐줘', profile, isMasterRequested: true });
  assert.equal(query.routePlan.isCasual, false);
  assert.ok(query.routePlan.targetTools.length >= 1);
  assert.ok((query.routePlan.deepEngineKeys?.length ?? 0) >= 1);
  assert.match(query.promptInjection, /Lucy 심층 선택 관점/);
});

test('deep perspectives are labelled as symbolic references, not extra calculations', () => {
  const routed = routeAndExecute({ text: '이번 이직에서 커리어 방향을 어떻게 잡을까?', profile, isMasterRequested: true });
  assert.equal(routed.routePlan.isMasterMobilization, false);
  assert.equal(routed.engineReport?.masterReview, false);
  assert.ok(routed.routePlan.deepEngineKeys?.length);
  assert.ok(routed.routePlan.deepEngineKeys?.every(key => ALL_DCE_ENGINES.some(engine => engine.key === key && engine.category === 'deep_master')));
  assert.ok(routed.toolsForBadge.some(badge => badge.startsWith('상징 참고 · ')));
  assert.match(routed.promptInjection, /상징 참고 · 별도 결정론적 계산 아님/);
  assert.match(routed.promptInjection, /별도 개인별 계산 결과가 아니며/);
  const audit = getCalculationAudit(routed.engineReport!, {
    focusTools: routed.routePlan.targetTools,
    intent: routed.routePlan.intent,
    isMasterMobilization: false,
  });
  assert.ok(audit.length > 0);
  assert.ok(audit.every(item => !routed.routePlan.deepEngineKeys?.includes(item.toolId)));
});

test('Lucy and Lucy+ require a basic tool and one symbolic deep perspective, even for greetings', () => {
  for (const text of ['안녕', '이번 이직에서 커리어 방향을 어떻게 잡을까?']) {
    const routed = routeAndExecute({ text, profile, requireBasicAndDeep: true, allowMaster: false });
    assert.equal(routed.routePlan.isCasual, false, text);
    assert.ok(routed.routePlan.targetTools.length >= 1, text);
    assert.ok((routed.routePlan.deepEngineKeys?.length ?? 0) >= 1, text);
    assert.equal(routed.routePlan.isMasterMobilization, false, text);
    assert.equal(routed.engineReport?.masterReview, false, text);
    assert.ok(routed.toolsForBadge.some(badge => badge.startsWith('상징 참고 · ')), text);
    assert.match(routed.promptInjection, /Lucy 심층 선택 관점/, text);
  }
});

test('Lucy selects a broad, relevant deep set per question while master retains all 473 catalog perspectives', () => {
  const text = '이번 이직 면접과 커리어 전략, 다음 진로 방향을 어떻게 잡을까?';
  const preferred = analyzeQuestionIntent(text).deepEngineKeys ?? [];
  const routed = routeAndExecute({ text, profile, requireBasicAndDeep: true, allowMaster: false });
  const selected = routed.routePlan.deepEngineKeys ?? [];
  const availablePreferred = preferred.filter(key => ALL_DCE_ENGINES.some(engine => engine.key === key && engine.category === 'deep_master'));

  assert.ok(selected.length >= availablePreferred.length);
  assert.ok(selected.length <= 12);
  assert.equal(new Set(selected).size, selected.length);
  assert.ok(selected.every(key => ALL_DCE_ENGINES.some(engine => engine.key === key && engine.category === 'deep_master')));
  assert.equal(routed.routePlan.deepEnginesKo?.length, selected.length);

  const master = routeAndExecute({ text: '올인원 종합 인생 분석', profile, isMasterRequested: true });
  assert.equal(master.routePlan.deepEngineKeys?.length, 473);
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

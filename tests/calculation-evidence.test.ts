import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ALL_DCE_ENGINES, runDeterministicEngine, getFiredEngineBadges, getCalculationAudit, formatDeterministicEnginePrompt } from '../src/lib/divination/deterministicEngine';
import { selectOptimalDivinationTools } from '../src/lib/fifteenDivinationTools';
import { getActuallyUsedCalculationAudit } from '../src/lib/divination/calculationAudit';

const profile = { basic: { name: '검사용', birthdate: '1990-05-17', birthtime: '14:30', gender: 'female' as const, birthCity: '서울', lunarSolar: 'solar' as const } };

test('selected chat calculators run without unsupported supplemental scores', () => {
  const report = runDeterministicEngine({ profile, question: '직업운을 알려줘', focusTools: ['saju'], forceAllTools: true, coreOnly: true });
  assert.equal(report.tools.saju.status, 'calculated');
  assert.equal(report.tools.astrology.status, 'skipped');
  assert.equal(report.gyeogamYurokResult, null);
  assert.equal(report.wonhyoHwajaengResult, null);
  assert.deepEqual(getFiredEngineBadges(report), ['계산 근거 · 사주명리']);
  const prompt = formatDeterministicEnginePrompt(report);
  assert.doesNotMatch(prompt, /gunggungEuleulSpiritualShieldScore|100% 확정 수치/);
});

test('missing profile never crashes the chat calculation path or fabricates birth charts', () => {
  const report = runDeterministicEngine({ question: '직업운', focusTools: ['saju', 'astrology'], coreOnly: true });
  assert.deepEqual(getFiredEngineBadges(report), []);
  const audit = getCalculationAudit(report, { isMasterMobilization: false, focusTools: ['saju', 'astrology'] });
  assert.equal(audit.length, 2);
  assert.ok(audit.every(item => item.status === 'skipped' && !item.sentToModel));
  assert.match(formatDeterministicEnginePrompt(report), /생년월일.*미입력/);
});

test('per-answer usage keeps only unique results and symbolic perspectives actually sent to the model', () => {
  const used = getActuallyUsedCalculationAudit([
    { toolId: 'calc', name: '계산 도구', status: 'calculated', sentToModel: true },
    { toolId: 'partial', name: '부분 도구', status: 'partial', sentToModel: true },
    { toolId: 'symbolic', name: '상징 관점', status: 'symbolic', sentToModel: true },
    { toolId: 'skipped', name: '미실행 도구', status: 'skipped', sentToModel: false },
    { toolId: 'error', name: '오류 도구', status: 'error', sentToModel: false },
    { toolId: 'unimplemented', name: '미구현 도구', status: 'not_implemented', sentToModel: true },
    { toolId: 'calc', name: '중복 기록', status: 'calculated', sentToModel: true },
  ]);
  assert.deepEqual(used.map(item => item.toolId), ['calc', 'partial', 'symbolic']);

  const selected = selectOptimalDivinationTools(
    '이번 이직 면접과 커리어 방향을 알려줘', [], profile, false,
    { allowMaster: false, requireBasicAndDeep: true },
  );
  const actualSelection = getActuallyUsedCalculationAudit(selected.calculationAudit);
  const symbolic = actualSelection.filter(item => item.status === 'symbolic');
  assert.ok(symbolic.length > 0 && symbolic.length <= 12);
  assert.ok(symbolic.every(item => selected.promptInjection.includes(item.name)));
});

test('failure, empty result and symbolic data cannot acquire success badges', () => {
  const report = runDeterministicEngine({ profile, focusTools: ['saju'], coreOnly: true });
  for (const status of ['error', 'symbolic', 'partial', 'skipped'] as const) {
    report.tools.saju.status = status;
    assert.deepEqual(getFiredEngineBadges(report, { isMasterMobilization: true }), []);
    assert.equal(getCalculationAudit(report)[0].sentToModel, false);
  }
  report.tools.saju.status = 'calculated'; report.tools.saju.data = undefined;
  assert.deepEqual(getFiredEngineBadges(report), []);
});

test('ordinary greetings skip calculation', () => {
  const selected = selectOptimalDivinationTools('안녕', [], undefined, false, { allowMaster: false });
  assert.equal(selected.isCasualMessage, true);
  assert.equal(selected.promptInjection, '');
});

test('master prompt and displayed evidence originate from the same successful tool results', () => {
  const selected = selectOptimalDivinationTools('내 직업운을 종합 분석해줘', [], profile, true, { allowMaster: true });
  assert.ok(selected.calculationAudit?.length);
  const successes = selected.calculationAudit!.filter(item => item.sentToModel);
  assert.deepEqual(selected.firedEngineBadges, successes.map(item => `${item.status === 'symbolic' ? '상징 참고' : '계산 근거'} · ${item.name}`));
  assert.equal(selected.calculationAudit!.length, ALL_DCE_ENGINES.length);
  assert.doesNotMatch(selected.promptInjection, /100% 확정 수치|영적 방패율:|전원 총동원/);
});

test('master audit separates calculated results, symbolic references and skipped entries', () => {
  const report = runDeterministicEngine({ profile, question: '직업운 종합 분석', forceAllTools: true, reviewAll: true });
  const audit = getCalculationAudit(report);
  const deep = audit.filter(item => ALL_DCE_ENGINES.find(engine => engine.key === item.toolId)?.category === 'deep_master');

  assert.equal(audit.length, 338);
  assert.equal(deep.length, 323);
  assert.ok(audit.some(item => item.status === 'calculated' && item.sentToModel));
  assert.ok(audit.some(item => item.status === 'symbolic' && item.sentToModel));
  assert.ok(audit.some(item => item.status === 'skipped' && !item.sentToModel));
  assert.ok(deep.every(item => ['symbolic', 'skipped', 'error'].includes(item.status)));
  assert.ok(deep.every(item => item.sentToModel === (item.status === 'symbolic')));
  assert.ok(audit.some(item => item.status !== 'symbolic'), 'the full catalogue is not counted as symbolic use');
});

test('calculators with unresolved reference fixtures stay symbolic and out of numeric evidence', () => {
  const report = runDeterministicEngine({ profile, question: '종합 분석', forceAllTools: true, coreOnly: true });
  for (const id of ['sukuyo', 'mahabote', 'kabbalah']) {
    assert.equal(report.tools[id].status, 'symbolic');
    assert.equal(report.tools[id].data, undefined);
    assert.ok(!getFiredEngineBadges(report).some(name => name.includes(report.tools[id].toolKoName)));
  }
  assert.ok(!(report.tools.qimen.data as any)?.honggukQimen);
});

test('missing birthdate cannot silently use the tarot calculator default birthday', () => {
  const report = runDeterministicEngine({ coreOnly: true, focusTools: ['tarot'] });
  assert.equal(report.tools.tarot.status, 'skipped');
  assert.equal(report.tools.tarot.data, undefined);
  assert.deepEqual(getFiredEngineBadges(report), []);
});

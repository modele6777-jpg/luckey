import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runDeterministicEngine, getFiredEngineBadges, getCalculationAudit, formatDeterministicEnginePrompt } from '../src/lib/divination/deterministicEngine';
import { selectOptimalDivinationTools } from '../src/lib/fifteenDivinationTools';

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
  assert.equal(selected.calculationAudit!.length, 207);
  assert.doesNotMatch(selected.promptInjection, /100% 확정 수치|영적 방패율:|전원 총동원/);
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

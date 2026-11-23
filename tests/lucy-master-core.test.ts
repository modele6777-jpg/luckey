import assert from 'node:assert/strict';
import test from 'node:test';
import { LUCY_TOOL_REGISTRY, getLucyToolScope } from '../src/lib/lucyToolRegistry.ts';
import { LUCY_COUNSEL_GROUNDING, runLucyCoreCalculation } from '../src/lib/lucyMasterCore.ts';
import { runDeterministicEngine } from '../src/lib/divination/deterministicEngine.ts';
import { selectOptimalDivinationTools, FIFTEEN_DIVINATION_TOOLS } from '../src/lib/fifteenDivinationTools.ts';
import { createOrbToolExecutor } from '../src/lib/orb/orbToolExecutor.ts';
import { ORB_CALC_TOOL_IDS, ORB_FN_RUN_TOOL, buildOrbMasterRules } from '../src/lib/orb/orbTools.ts';
import { buildLucyLiveInstruction } from '../src/lib/lucyLiveBrief.ts';

test('every tool is registered once and Orb keeps tarot on the guest-pick path', () => {
  const ids = LUCY_TOOL_REGISTRY.map(tool => tool.id);
  assert.equal(new Set(ids).size, 15);
  assert.deepEqual(ids.sort(), Object.keys(FIFTEEN_DIVINATION_TOOLS).sort());
  assert.deepEqual([...ORB_CALC_TOOL_IDS].sort(), ids.filter(id => id !== 'tarot'));
  assert.throws(() => runLucyCoreCalculation(runDeterministicEngine, { focusTools: ['unknown'] }));
});

test('chat, master divination and Orb use the common facts policy and calculation scopes', async () => {
  const profile = { basic: { birthdate: '1990-05-15', birthtime: '14:30', birthCity: '서울' } };
  const question = '사주로 이직 고민을 살펴봐 주세요.';
  const chat = selectOptimalDivinationTools(question, [], profile);
  const pro = selectOptimalDivinationTools(question, [], profile, false, { divinationMode: { base: 'saju', deep: false, depth: 1 } });
  for (const mode of [chat, pro]) {
    assert.equal(mode.engineTools?.saju?.status, 'calculated');
    assert.ok(mode.promptInjection.includes(LUCY_COUNSEL_GROUNDING));
  }
  const orb = createOrbToolExecutor({ profile });
  const result = await orb.execute({ name: ORB_FN_RUN_TOOL, args: { tool: 'iching' } });
  assert.equal(result.scope, getLucyToolScope('iching'));
  assert.ok(buildOrbMasterRules({ birthdate: true, birthtime: true }).includes(LUCY_COUNSEL_GROUNDING));
  assert.ok(buildLucyLiveInstruction('').includes(LUCY_COUNSEL_GROUNDING));
});

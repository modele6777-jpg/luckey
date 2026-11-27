import assert from 'node:assert/strict';
import test from 'node:test';
import { LUCY_TOOL_REGISTRY } from '../src/lib/lucyToolRegistry.ts';
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
  // 마스터 루시는 사주만 계산하고, 타로는 손님이 직접 뽑는다.
  assert.deepEqual([...ORB_CALC_TOOL_IDS], ['saju']);
  assert.ok(ids.includes('tarot'), '타로는 공통 도구 목록에 남아 있다');
  assert.throws(() => runLucyCoreCalculation(runDeterministicEngine, { focusTools: ['unknown'] }));
});

test('chat, master divination and Orb use the common facts policy and calculation scopes', async () => {
  const profile = { basic: { birthdate: '1990-05-15', birthtime: '14:30', birthCity: '서울' } };
  const question = '사주로 이직 고민을 살펴봐 주세요.';
  const chat = selectOptimalDivinationTools(question, [], profile);
  const pro = selectOptimalDivinationTools(question, [], profile, false, { divinationMode: { base: 'saju', deep: false } });
  for (const mode of [chat, pro]) {
    assert.equal(mode.engineTools?.saju?.status, 'calculated');
    assert.ok(mode.promptInjection.includes(LUCY_COUNSEL_GROUNDING));
  }
  const orb = createOrbToolExecutor({ profile });
  const result = await orb.execute({ name: ORB_FN_RUN_TOOL, args: { tool: 'saju' } });
  assert.equal(result.status, 'calculated');
  const outside = await orb.execute({ name: ORB_FN_RUN_TOOL, args: { tool: 'iching' } });
  assert.equal(outside.error, 'unknown_tool', '오브는 사주 밖의 도구를 부르지 않는다');
  assert.ok(buildOrbMasterRules({ birthdate: true, birthtime: true }).includes(LUCY_COUNSEL_GROUNDING));
  assert.ok(buildLucyLiveInstruction('').includes(LUCY_COUNSEL_GROUNDING));
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { LUCY_CONSULTATION_FIXTURES } from './fixtures/lucy-consultations.ts';
import { createOrbToolExecutor, type OrbToolLoader } from '../src/lib/orb/orbToolExecutor.ts';
import { buildOrbMasterRules, ORB_FN_RUN_TOOL, ORB_FN_TAROT } from '../src/lib/orb/orbTools.ts';
import * as engine from '../src/lib/divination/deterministicEngine.ts';
import * as slim from '../src/lib/divination/promptSlim.ts';
import * as cards from '../src/lib/divination/knowledge/index.ts';

const call = (tool: string, reason = '') => ({ name: ORB_FN_RUN_TOOL, args: { tool, reason } });

test('warmup shares the same pending modules and repeated calls perform one calculation', async () => {
  let loads = 0;
  let calculations = 0;
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  const loader: OrbToolLoader = {
    load: async () => {
      loads += 1;
      await gate;
      return { engine: { runDeterministicEngine: (...args) => {
        calculations += 1;
        return engine.runDeterministicEngine(...args);
      } }, slim, cards };
    },
  };
  const executor = createOrbToolExecutor({ loader });
  const warmup = executor.prewarm();
  const first = executor.execute(call('iching'));
  const repeated = executor.execute(call('iching'));
  assert.equal(loads, 1);
  release();
  await warmup;
  assert.equal((await first).status, 'calculated');
  assert.equal((await repeated).cached, true);
  assert.equal(calculations, 1);
});

test('a failed warmup does not poison later counseling', async () => {
  let tries = 0;
  const executor = createOrbToolExecutor({ loader: { load: async () => {
    if (++tries === 1) throw new Error('offline');
    return { engine, slim, cards };
  } } });
  await executor.prewarm();
  assert.equal((await executor.execute(call('iching'))).ok, true);
  assert.equal(tries, 2);
});

test('voice fixtures get grounded facts or a clear missing-data result', async () => {
  for (const id of ['01', '06', '09', '11', '13', '14']) {
    const fixture = LUCY_CONSULTATION_FIXTURES.find(item => item.id === id)!;
    const executor = createOrbToolExecutor({ profile: fixture.profile });
    const result = await executor.execute(call('saju', fixture.question));
    if (!fixture.profile?.basic?.birthdate) {
      assert.equal(result.error, 'needs_birthdate');
      assert.equal(result.data, undefined);
      continue;
    }
    const direct = engine.runDeterministicEngine({ profile: fixture.profile, question: fixture.question, forceAllTools: true, focusTools: ['saju'], coreOnly: true });
    assert.equal(result.status, direct.tools.saju.status);
    assert.deepEqual(result.data, slim.slimToolDataToBudget(direct.tools.saju.data, 2400));
  }
  const noCards = createOrbToolExecutor({ events: { openTarot: () => ({ opened: true }) } });
  const tarot = await noCards.execute({ name: ORB_FN_TAROT });
  assert.equal(tarot.cards, undefined);
  assert.match(String(tarot.message), /카드 이름을 말하지/);
  const rules = buildOrbMasterRules({ birthdate: true, birthtime: false });
  assert.match(rules, /건강 진단·법적 판단·투자 결정을 대신하지/);
  assert.match(rules, /결과를 보장하지/);
  assert.match(rules, /결과에 없는 별, 괘, 카드, 숫자를 지어내지/);
  assert.match(rules, /해볼 수 있는 행동 하나/);
});

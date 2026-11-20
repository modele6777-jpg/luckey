import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ALL_DCE_ENGINES, runDeterministicEngine, getCalculationAudit, getMasterSymbolicReview, formatDeterministicEnginePrompt } from '../src/lib/divination/deterministicEngine';
import { MASTER_REVIEW_BINDINGS } from '../src/lib/divination/masterReviewBindings';
import { getSymbolicPerspective } from '../src/lib/divination/symbolicPerspective';
import { routeAndExecute } from '../src/lib/divination/smartAgentRouter';

const profile = { basic: { name:'검사용', birthdate:'1990-05-17', birthtime:'14:30', gender:'female' as const, birthCity:'서울' } };

test('master reviews every registered tool and only exposes qualitative supplemental perspectives', () => {
  const routed = routeAndExecute({ text:'마스터 모드로 전체 운명학 도구를 종합 분석해줘', profile, isMasterRequested:true });
  const report = routed.engineReport!;
  const audit = getCalculationAudit(report);
  assert.equal(audit.length, ALL_DCE_ENGINES.length);
  assert.equal(new Set(audit.map(item => item.toolId)).size, ALL_DCE_ENGINES.length);
  for (const engine of ALL_DCE_ENGINES.filter(item => item.category === 'deep_master')) assert.ok(MASTER_REVIEW_BINDINGS[engine.key]);
  const symbolic = getMasterSymbolicReview(report);
  assert.equal(symbolic.length, ALL_DCE_ENGINES.filter(item => item.category === 'deep_master').length);
  assert.ok(symbolic.some(item => item.sentToModel));
  assert.ok(symbolic.every(item => !item.sentToModel || item.status === 'symbolic'));
  for (const item of symbolic) for (const view of item.perspectives) assert.doesNotMatch(view, /[0-9%％]/);
  const saimdang = symbolic.find(item => item.toolId === 'koreanShinSaimdangChochungdoArtVirtue')!;
  assert.doesNotMatch(saimdang.perspectives.join('\n'), /불후의 잠언|回首北村時一望|白雲飛下暮山靑/);
  assert.doesNotMatch(routed.promptInjection, /고개 돌려 북촌을 바라보니/);
  assert.ok(report.gyeogamYurokResult, 'the supplemental calculator actually ran');
  assert.doesNotMatch(routed.promptInjection, /gunggungEuleulSpiritualShieldScore|oneMindTwoGatesBalance/);
  assert.match(routed.promptInjection, /공통점·차이·충돌/);
  assert.match(routed.promptInjection, /동의·안전·법적 경계/);
});

test('missing input is not replaced with a default birthday during master review', () => {
  const report = runDeterministicEngine({ coreOnly:true, reviewAll:true, forceAllTools:true });
  const review = getMasterSymbolicReview(report);
  assert.equal(review.length, 416);
  assert.ok(review.every(item => !item.sentToModel));
  assert.equal(report.gyeogamYurokResult, null);
  assert.equal(getCalculationAudit(report).length, 431);
});

test('failed supplementary results are excluded instead of counted from the catalogue', () => {
  const report = runDeterministicEngine({ profile, coreOnly:true, reviewAll:true, forceAllTools:true });
  report.gyeogamYurokResult=null;
  report.supplementExecutions!.gyeogamYurokResult='error';
  const entry=getCalculationAudit(report).find(item=>item.toolId==='gyeogamYurok')!;
  assert.equal(entry.status,'error');assert.equal(entry.sentToModel,false);
  const before=getMasterSymbolicReview(report).find(item=>item.toolId==='gyeogamYurok')!;
  assert.deepEqual(before.perspectives,[]);
});

test('symbolic projection never includes numeric scores or score-bearing prose', () => {
  assert.deepEqual(getSymbolicPerspective({score:99,advice:'작은 계획부터 실천해 보세요.',wisdom:'성공 확률 99%',summary:'저자의 말 “믿을 수 없는 인용”을 직접 반복한다.',aphorismKo:'원전의 문장',sourceContext:'확인되지 않은 출처',nested:{recommendations:['천천히 호흡하며 돌아보세요.','방패율: 90점']}}),['작은 계획부터 실천해 보세요.','천천히 호흡하며 돌아보세요.']);
});

test('ordinary mode stays selective while explicit master greetings review the catalogue', () => {
  const ordinary=routeAndExecute({text:'직업운을 알려줘',profile,isMasterRequested:false});
  assert.equal(ordinary.engineReport!.masterReview,false);
  assert.equal(ordinary.engineReport!.gyeogamYurokResult,null);
  const master=routeAndExecute({text:'안녕',profile,isMasterRequested:true});
  assert.equal(getCalculationAudit(master.engineReport!).length, ALL_DCE_ENGINES.length);
  assert.ok(formatDeterministicEnginePrompt(master.engineReport!).includes('마스터 전체 검토'));
});

test('invalid birth input cannot seed the symbolic catalogue with invented defaults', () => {
  const report = runDeterministicEngine({ profile:{basic:{birthdate:'생일 모름'}}, coreOnly:true, reviewAll:true, forceAllTools:true });
  assert.ok(getMasterSymbolicReview(report).every(item => !item.sentToModel));
});

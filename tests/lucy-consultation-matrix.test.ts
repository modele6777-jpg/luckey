import test from 'node:test';
import assert from 'node:assert/strict';
import { LUCY_CONSULTATION_FIXTURES } from './fixtures/lucy-consultations';
import { selectOptimalDivinationTools } from '../src/lib/fifteenDivinationTools';
import { calculateDetailedSaju } from '../src/lib/sajuAnalysis';
import { buildLucyCriticalFacts, findCriticalFactConflicts } from '../src/lib/lucyCriticalFacts';
import { findUnsupportedClaims, reviewLucyReply } from '../src/lib/lucyReplyReview';
import { drawLucyTarotCards, formatTarotMarker } from '../src/utils/tarotDetector';
import { ALL_DCE_ENGINES } from '../src/lib/divination/deterministicEngine';

// Real calculators + injected review responses. This is not a live-model accuracy test.
for (const fixture of LUCY_CONSULTATION_FIXTURES) {
  const draw=fixture.drawCount?{source:'app-random' as const,id:'matrix-'+fixture.id,drawnAt:1,markers:drawLucyTarotCards(fixture.drawCount).map(formatTarotMarker).join('\n')}:undefined;
  for (const master of [false,true]) for (const repeat of [1,2]) {
    test(`${fixture.id} ${fixture.category}: ${master?'master':'normal'} repeat ${repeat}`,async()=>{
      const selection=selectOptimalDivinationTools(fixture.question,[],fixture.profile,master,{allowMaster:master});
      const audit=selection.calculationAudit || [];
      if(master) assert.equal(audit.length,ALL_DCE_ENGINES.length);
      if(!master&&fixture.id==='20') assert.equal(selection.selectedTools.length,0);
      const saju=audit.some(item=>item.toolId==='saju'&&item.status==='calculated'&&item.sentToModel)?calculateDetailedSaju(fixture.profile):null;
      const facts=buildLucyCriticalFacts(saju,draw);
      if(['11','12'].includes(fixture.id)) assert.equal(facts.saju,undefined,'missing or invalid input must not make a chart');
      const draft=facts.saju?`네 일간은 ${facts.saju.dayMaster==='壬'?'갑목':'임수'}이야.`:'999개 도구 정밀 계산 완료. 무조건 성공해.';
      const conflicts=[...findUnsupportedClaims(draft,audit),...findCriticalFactConflicts(draft,facts,fixture.question)];
      assert.ok(conflicts.length);
      const corrected=facts.saju?`${facts.saju.dayMasterKo} 일간이며 결과는 참고용이야. 선택지를 비교하고 결정하자.`:'확정할 근거가 부족해. 필요한 정보를 확인하고 선택지를 비교해 보자.';
      let requests=0;
      const answer=await reviewLucyReply(draft,{question:fixture.question,evidence:selection.promptInjection,audit,facts,request:async messages=>{
        requests++;
        const supplied=JSON.parse(messages[1].content);
        assert.ok(supplied.detectedIssues.length);
        assert.deepEqual(supplied.execution,audit);
        return JSON.stringify({valid:false,issues:conflicts,revisedReply:corrected});
      }});
      assert.equal(requests,1);
      assert.equal(answer,corrected);
      assert.deepEqual(findCriticalFactConflicts(answer,facts,fixture.question),[]);
      assert.deepEqual(findUnsupportedClaims(answer,audit),[]);
    });
  }
}

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {reviewLucyReply,findUnsupportedClaims} from '../src/lib/lucyReplyReview';
import {LUCY_MASTER_MODEL,LUCY_MASTER_FALLBACK_MODELS,modelCandidates,isMasterTierModel} from '../src/lib/lucyModelPolicy';
const audit=[{toolId:'saju',name:'사주명리',status:'calculated' as const,sentToModel:true},{toolId:'myth',name:'신화',status:'symbolic' as const,sentToModel:true}];
const base={question:'직업운',evidence:'사주 계산 결과와 상징 관점',audit};
test('master candidates never silently include Flash Lite',()=>{
 const models=modelCandidates(LUCY_MASTER_MODEL,LUCY_MASTER_FALLBACK_MODELS);
 assert.equal(models[0],LUCY_MASTER_MODEL);assert.ok(models.includes('gemini-3.6-flash'));
 assert.ok(models.every(model=>!model.includes('lite')&&isMasterTierModel(model)));
});
test('approves unchanged grounded reply after receiving evidence',async()=>{
 const draft='사주 계산을 참고하되 결과를 확정할 수는 없어. 작은 계획부터 세워보자.';
 const result=await reviewLucyReply(draft,{...base,request:async messages=>{assert.ok(messages[1].content.includes('사주 계산 결과'));assert.match(messages[0].content,/동의·안전·법적 경계/);return JSON.stringify({valid:true,issues:[],revisedReply:''});}});
 assert.equal(result,draft);
});
test('replaces unsupported draft with the reviewed correction',async()=>{
 const result=await reviewLucyReply('186개 도구 정밀 계산 완료',{...base,request:async()=>JSON.stringify({valid:false,issues:['개수 과장'],revisedReply:'계산 근거는 사주이고 신화는 상징적인 참고야.'})});
 assert.equal(result,'계산 근거는 사주이고 신화는 상징적인 참고야.');
});
test('reviewer cannot approve overclaimed counts or guaranteed success',async()=>{
 assert.ok(findUnsupportedClaims('186개 정밀 계산 완료',audit).length);
 await assert.rejects(reviewLucyReply('100% 성공을 보장해',{...base,request:async()=>JSON.stringify({valid:true,issues:[],revisedReply:''})}));
 await assert.rejects(reviewLucyReply('초안',{...base,request:async()=>JSON.stringify({valid:false,issues:['보장'],revisedReply:'무조건 성공'})}));
});
test('malformed review and cancellation never publish the draft',async()=>{
 await assert.rejects(reviewLucyReply('초안',{...base,request:async()=>'검사 완료'}));
 await assert.rejects(reviewLucyReply('초안',{...base,request:async()=>{throw new Error('review service unavailable');}}));
 const control=new AbortController();control.abort();let calls=0;
 await assert.rejects(reviewLucyReply('초안',{...base,signal:control.signal,request:async()=>{calls++;return '{}';}}));assert.equal(calls,0);
});
test('cancellation while waiting discards a late approval',async()=>{
 const control=new AbortController();
 await assert.rejects(reviewLucyReply('초안',{...base,signal:control.signal,request:async()=>{control.abort();return JSON.stringify({valid:true,issues:[],revisedReply:''});}}));
});

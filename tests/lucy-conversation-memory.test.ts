import test from 'node:test';
import assert from 'node:assert/strict';
import { selectLucyConversationMemory, formatLucyConversationMemory } from '../src/lib/lucyConversationMemory';
import { buildLucyLongTermPrompt, type LucyMemoryEntry } from '../src/lib/lucyLongTermMemory';
import { resetLucyContextOnTaskSwitch } from '../src/lib/lucyChatUtils';
import { reviewLucyReply } from '../src/lib/lucyReplyReview';
const now=Date.now();
const entry=(id:string,text:string,offset=0,role:LucyMemoryEntry['role']='user',account='a'):LucyMemoryEntry=>({id,account,scope:'lucy',role,timestamp:now+offset,text});

test('an interview update retrieves the earlier career goal and company without literal word equality',()=>{
 const rows=[entry('goal','가온회사로 이직하려고 준비 중이야.'),entry('other','우리 고양이는 달콩이야.',1)];
 const recall=selectLucyConversationMemory('a',rows,'그 회사 면접 봤어',now+100);
 assert.ok(recall.followUp);
 assert.ok(recall.entries.some(e=>e.id==='goal'));
 assert.ok(!recall.entries.some(e=>e.id==='other'));
 assert.match(formatLucyConversationMemory(recall),/이미 알려준.*다시 묻지/);
});
test('later cancellation and outcome remain present ahead of an old plan',()=>{
 const rows=[entry('goal','가온회사로 이직하려고 준비 중이야.'),entry('cancel','그거 안 하기로 결정했어.',10),entry('update','그건 취소한 상태야.',20)];
 const prompt=buildLucyLongTermPrompt('a',rows,'그 회사 이야기를 이어서 하자');
 assert.match(prompt,/안 하기로 결정/);assert.match(prompt,/취소한 상태/);
 assert.match(prompt,/오래된 준비.*되돌리지 마/);
});
test('distinct named companies stay ambiguous until the user names one',()=>{
 const rows=[entry('a','가온회사 면접 준비 중이야.'),entry('b','누리회사 면접도 볼 예정이야.',10)];
 assert.equal(selectLucyConversationMemory('a',rows,'그 회사 면접 결과가 나왔어',now+20).ambiguous,true);
 const clear=selectLucyConversationMemory('a',rows,'가온회사 면접은 어때?',now+20);
 assert.equal(clear.ambiguous,false);
 assert.ok(!clear.entries.some(e=>e.id==='b'),'another named company must not enter the selected thread');
});
test('a new topic and greeting do not bring up old worries',()=>{
 const rows=[entry('a','가온회사로 이직하려고 준비 중이야.')];
 assert.equal(buildLucyLongTermPrompt('a',rows,'안녕'),'');
 assert.equal(buildLucyLongTermPrompt('a',rows,'오늘 날씨가 어때?'),'');
 assert.equal(buildLucyLongTermPrompt('a',rows,'다른 주제로 요리 이야기를 하자'),'');
 const history=[{role:'user',content:'면접 준비 중이야'},{role:'assistant',content:'어떤 회사야?'},{role:'user',content:'다른 질문인데 저녁 메뉴를 추천해줘'}];
 assert.deepEqual(resetLucyContextOnTaskSwitch(history,history[2].content),{messages:[history[2]],didReset:true});
});
test('assistant guesses and another account never become user memories',()=>{
 const rows=[entry('user','가온회사로 이직 준비 중이야.'),entry('guess','가온회사 면접에 이미 합격했구나.',1,'assistant'),entry('foreign','가온회사 대표와 결혼했어.',2,'user','b')];
 const prompt=buildLucyLongTermPrompt('a',rows,'그 회사 면접 봤어');
 assert.match(prompt,/이직 준비/);assert.doesNotMatch(prompt,/이미 합격|대표와 결혼/);
});
test('uncertain pronouns and old memories require clarification instead of invented context',()=>{
 assert.match(buildLucyLongTermPrompt('a',[],'그건 어떻게 됐을까?'),/한 번만 짧게 확인/);
 const recall=selectLucyConversationMemory('a',[entry('old','가온회사 이직 준비 중이야.',-60*86400000)],'그건 어떻게 할까?',now);
 assert.equal(recall.entries.length,0);
});
test('current-user exclusion and budgets preserve stored data',()=>{
 const rows=Array.from({length:150},(_,i)=>entry('u'+i,'가온회사 면접 준비와 이직 목표야. '.repeat(30),i));
 const before=JSON.stringify(rows);const prompt=buildLucyLongTermPrompt('a',rows,'면접 준비',rows.map(e=>e.id));
 assert.equal(prompt,'');assert.equal(JSON.stringify(rows),before);
 const selected=selectLucyConversationMemory('a',rows,'그 회사 면접 봤어',now+200);
 assert.ok(selected.entries.length<=12);assert.ok(formatLucyConversationMemory(selected).length<10000);
});
test('review receives conversation and the same remembered decision as generation',async()=>{
 const evidence=buildLucyLongTermPrompt('a',[entry('goal','가온회사 이직은 안 하기로 결정했어.')],'그 회사 이야기를 이어서 하자');
 const answer=await reviewLucyReply('이직 준비부터 다시 시작하자.',{question:'그 회사 이야기를 이어서 하자',evidence,audit:[],conversation:[{role:'user',content:'가온회사 이직은 안 하기로 결정했어.'}],request:async messages=>{
  const payload=JSON.parse(messages[1].content);
  assert.match(payload.evidence,/안 하기로 결정/);
  assert.equal(payload.conversation[0].role,'user');
  assert.match(messages[0].content,/최신 정정·취소·결과를 우선/);
  return JSON.stringify({valid:false,issues:['취소한 결정을 준비 중으로 되돌림'],revisedReply:'그 회사 이직은 안 하기로 했다고 알려줬지. 지금은 어떤 점을 정리하고 싶어?'});
 }});
 assert.match(answer,/안 하기로/);
});

test('a short acknowledgement does not erase the followup anchor, but a topic switch does',()=>{
 const rows=[entry('goal','가온회사로 이직 준비 중이야.'),entry('ack','응 고마워',10)];
 assert.ok(selectLucyConversationMemory('a',rows,'그건 어떻게 할까?',now+100).entries.some(e=>e.id==='goal'));
 assert.ok(selectLucyConversationMemory('a',rows,'내 목표가 뭐였지?',now+100).entries.some(e=>e.id==='goal'));
 const switched=[...rows,entry('switch','다른 이야기를 하자. 요리 얘기야.',20)];
 assert.equal(selectLucyConversationMemory('a',switched,'그건 어떻게 할까?',now+100).entries.length,0);
});

test('an interview outcome without a pronoun is still treated as a possible followup',()=>{
 const rows=[entry('goal','가온회사 면접 준비 중이야.')];
 const recall=selectLucyConversationMemory('a',rows,'면접 봤어',now+100);
 assert.equal(recall.followUp,true);assert.ok(recall.entries.some(e=>e.id==='goal'));
});
test('legacy episodic entry point cannot inject the global archive or invent personality traits',async()=>{
 const {buildLucyEpisodicMemoryPrompt,extractEpisodicMemoryLedger}=await import('../src/lib/lucyEpisodicMemoryEngine');
 assert.equal(buildLucyEpisodicMemoryPrompt(), '');
 assert.equal(buildLucyEpisodicMemoryPrompt('a'), '');
 const ledger=extractEpisodicMemoryLedger([{date:'2026-11-06',timestamp:now,dialogueCount:1,summary:'면접 준비',userTopics:['회사 면접 준비 중이야.']}]);
 assert.deepEqual(ledger.coreValues,[]);
});

test('an unseen company is not silently replaced by the remembered company',()=>{
 const rows=[entry('old','가온회사 면접 준비 중이야.')];
 assert.ok(!selectLucyConversationMemory('a',rows,'새봄회사 면접을 볼 거야',now+100).entries.some(e=>e.id==='old'));
});
test('a bare cancellation is retained as the latest update to the remembered plan',()=>{
 const rows=[entry('goal','가온회사 면접 준비 중이야.'),entry('cancel','취소했어.',10)];
 assert.ok(selectLucyConversationMemory('a',rows,'그 회사 이야기를 이어서 하자',now+100).entries.some(e=>e.id==='cancel'));
});
test('a demonstrative word prefix does not turn a new noun into an old followup',()=>{
 const rows=[entry('goal','가온회사 면접 준비 중이야.')];
 assert.equal(selectLucyConversationMemory('a',rows,'그 거북이는 뭘 먹어?',now+100).entries.length,0);
 assert.equal(selectLucyConversationMemory('a',rows,'그 건물 높이는 얼마야?',now+100).entries.length,0);
});
test('a temporal thank-you does not ask the user which old event they mean',()=>{
 assert.equal(buildLucyLongTermPrompt('a',[],'아까는 고마웠어.'),'');
});

test('a new unnamed company can legitimately require a new identity question',()=>{
 const recall=selectLucyConversationMemory('a',[entry('old','가온회사 면접 준비 중이야.')],'다른 회사 면접을 볼 거야',now+100);
 assert.ok(!recall.entries.some(e=>e.id==='old'));
});
test('explicitly named friends are not merged when a new person is introduced',()=>{
 const rows=[entry('friend','지민이라는 친구와 관계가 고민이야.')];
 assert.ok(!selectLucyConversationMemory('a',rows,'수연이라는 친구 이야기를 할게',now+100).entries.some(e=>e.id==='friend'));
 assert.ok(selectLucyConversationMemory('a',rows,'지민과 관계는 어때?',now+100).entries.some(e=>e.id==='friend'));
});

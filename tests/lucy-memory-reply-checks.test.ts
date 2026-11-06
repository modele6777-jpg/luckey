import test from 'node:test';
import assert from 'node:assert/strict';
import { selectLucyConversationMemory } from '../src/lib/lucyConversationMemory';
import { findLucyMemoryReplyIssues } from '../src/lib/lucyMemoryReplyChecks';
import { reviewLucyReply } from '../src/lib/lucyReplyReview';
import type { LucyMemoryEntry } from '../src/lib/lucyLongTermMemory';
const now=Date.now();
const entry=(id:string,text:string,offset=0):LucyMemoryEntry=>({id,account:'a',scope:'lucy',role:'user',timestamp:now+offset,text});
const question='그 회사 면접 봤어';
const recall=selectLucyConversationMemory('a',[entry('goal','가온회사 면접 준비 중이야.')],question,now+100);

test('known company identity questions are detected without banning other followup questions',()=>{
 assert.ok(findLucyMemoryReplyIssues('어느 회사 면접이야?',recall,question).length);
 assert.ok(findLucyMemoryReplyIssues('회사 이름이 뭐였지?',recall,question).length);
 assert.deepEqual(findLucyMemoryReplyIssues('가온회사 면접을 봤구나. 어떤 질문이 어려웠어?',recall,question),[]);
});
test('a necessary identity question remains allowed for ambiguous or genuinely new companies',()=>{
 const ambiguous=selectLucyConversationMemory('a',[entry('a','가온회사 면접 준비 중이야.'),entry('b','누리회사 면접 준비 중이야.',10)],question,now+100);
 assert.deepEqual(findLucyMemoryReplyIssues('어느 회사 면접이야?',ambiguous,question),[]);
 const newQuestion='다른 회사 면접을 볼 거야';
 const newTarget=selectLucyConversationMemory('a',[entry('a','가온회사 면접 준비 중이야.')],newQuestion,now+100);
 assert.deepEqual(findLucyMemoryReplyIssues('어느 회사 면접이야?',newTarget,newQuestion),[]);
});
test('an interview does not become a remembered job offer; a real user outcome does',()=>{
 assert.ok(findLucyMemoryReplyIssues('합격했잖아. 이제 출근 준비하자.',recall,question).length);
 assert.deepEqual(findLucyMemoryReplyIssues('합격한 상태는 아직 아니야.',recall,question),[]);
 assert.deepEqual(findLucyMemoryReplyIssues('합격했구나. 축하해.',recall,'그 회사 합격했어!'),[]);
 assert.ok(findLucyMemoryReplyIssues('합격했구나.',recall,'불합격했어.').length);
});
test('a canceled plan is not revived unless the user reconsiders or reopens it',()=>{
 const closed=selectLucyConversationMemory('a',[entry('plan','가온회사 면접 준비 중이야.'),entry('close','취소했어.',10)],question,now+100);
 assert.ok(findLucyMemoryReplyIssues('아직 면접 준비 중이구나.',closed,question).length);
 assert.ok(findLucyMemoryReplyIssues('다시 면접 준비부터 하자.',closed,question).length);
 assert.deepEqual(findLucyMemoryReplyIssues('취소했다고 알려줬지. 지금 고민은 뭐야?',closed,question),[]);
 assert.deepEqual(findLucyMemoryReplyIssues('다시 면접 준비부터 하자.',closed,'그 회사에 다시 지원해볼까?'),[]);
 const reopened=selectLucyConversationMemory('a',[entry('plan','가온회사 면접 준비 중이야.'),entry('close','취소했어.',10),entry('reopen','그 회사에 다시 지원하기로 했어.',20)],question,now+100);
 assert.deepEqual(findLucyMemoryReplyIssues('계속 면접 준비 중이구나.',reopened,question),[]);
});
test('an erroneous approval or replacement cannot publish a known memory conflict',async()=>{
 const options={question,evidence:'가온회사 면접 준비 중이라는 사용자 발언',audit:[],memoryRecall:recall};
 await assert.rejects(reviewLucyReply('어느 회사 면접이야?',{...options,request:async()=>JSON.stringify({valid:true,issues:[],revisedReply:''})}));
 await assert.rejects(reviewLucyReply('어느 회사 면접이야?',{...options,request:async()=>JSON.stringify({valid:false,issues:['반복 질문'],revisedReply:'이미 합격했잖아.'})}));
 const result=await reviewLucyReply('어느 회사 면접이야?',{...options,request:async messages=>{
  assert.match(messages[1].content,/이미 제공된 회사 이름을 다시 질문/);
  return JSON.stringify({valid:false,issues:['반복 질문'],revisedReply:'가온회사 면접을 봤구나. 어떤 느낌이었어?'});
 }});
 assert.match(result,/가온회사/);
});

test('hypothetical examples are not treated as recalled outcomes',()=>{
 assert.deepEqual(findLucyMemoryReplyIssues('예를 들어 합격했구나, 축하해라고 말할 수 있어.',recall,'대화 예시를 보여줘'),[]);
 assert.deepEqual(findLucyMemoryReplyIssues('만약 합격했다면 다음 일정을 확인하자.',recall,question),[]);
});

test('asking about cancellation does not establish that the user canceled the plan',()=>{
 const rows=[entry('goal','가온회사 면접 준비 중이야.'),entry('question','그 회사 면접 취소했어?',10)];
 const uncertain=selectLucyConversationMemory('a',rows,question,now+100);
 assert.deepEqual(findLucyMemoryReplyIssues('아직 면접 준비 중이구나.',uncertain,question),[]);
});

test('questions about company culture and preferences are not identity repetitions',()=>{
 assert.deepEqual(findLucyMemoryReplyIssues('어떤 회사 문화가 마음에 들었어?',recall,question),[]);
 assert.deepEqual(findLucyMemoryReplyIssues('가온회사에서 어떤 점이 좋았어?',recall,question),[]);
});

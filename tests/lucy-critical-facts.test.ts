import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDetailedSaju } from '../src/lib/sajuAnalysis';
import { buildLucyCriticalFacts, findCriticalFactConflicts, formatLucyCriticalFacts } from '../src/lib/lucyCriticalFacts';
import { reviewLucyReply } from '../src/lib/lucyReplyReview';
const profile={basic:{birthdate:'1990-05-17',birthtime:'14:30',gender:'female' as const,birthCity:'서울',lunarSolar:'solar' as const}};
const saju=calculateDetailedSaju(profile)!;
const facts=buildLucyCriticalFacts(saju);
const audit=[{toolId:'saju',name:'사주명리',status:'calculated' as const,sentToModel:true}];

test('ledger comes from current app calculations and distinguishes wealth from authority',()=>{
  assert.equal(facts.saju?.dayMaster,'壬');
  assert.equal(facts.saju?.tenGodByElement['화'],'재성');
  assert.equal(facts.saju?.tenGodByElement['토'],'관성');
  assert.match(formatLucyCriticalFacts(facts),/간이 산출값/);
});
for(const [name,text] of [
  ['day master','네 일간은 갑목이야.'],
  ['Hanja day master','甲木 일간이야.'],
  ['element ratio','화(불) 기운이 80%야.'],
  ['body strength','극신약(점수 99점)이야.'],
  ['structure','격국은 정관격이야.'],
  ['mixed ten gods','4개의 화(재성·관성) 기운이 중심이야.'],
] as const) test(`rejects contradictory ${name}`,()=>assert.ok(findCriticalFactConflicts(text,facts).length));

test('correct claims and ordinary advice pass without requiring every fact to be mentioned',()=>{
  assert.deepEqual(findCriticalFactConflicts('임수(壬水) 일간이며 화(불) 기운이 50%, 극신약 17점이야. 격국은 편인격이야. 화는 재성이고 토는 관성이야.',facts),[]);
  assert.deepEqual(findCriticalFactConflicts('선택지를 적고 장단점을 비교해 보자.',facts),[]);
  assert.deepEqual(findCriticalFactConflicts('갑목 일간은 아니야. 임수 일간이야.',facts),[]);
});
test('missing birth input creates no substitute chart',()=>{
  assert.equal(buildLucyCriticalFacts(calculateDetailedSaju()).saju,undefined);
});
test('tarot card and orientation are checked against the immutable draw',()=>{
  const tarot=buildLucyCriticalFacts(null,{source:'app-random',id:'fixture',drawnAt:1,markers:'[TAROT:swords_1:reversed]'});
  assert.deepEqual(findCriticalFactConflicts('검 에이스 역방향은 판단을 다시 점검하라는 상징이야.',tarot),[]);
  assert.ok(findCriticalFactConflicts('검 에이스 정방향이야.',tarot).length);
  assert.ok(findCriticalFactConflicts('태양 카드를 뽑았어.',tarot).length);
});
test('a reviewer cannot approve a known contradiction or replace it with another wrong value',async()=>{
  const options={question:'내 사주',evidence:'앱 계산값',facts,audit};
  await assert.rejects(reviewLucyReply('화는 관성이야.',{...options,request:async()=>JSON.stringify({valid:true,issues:[],revisedReply:''})}));
  await assert.rejects(reviewLucyReply('화는 관성이야.',{...options,request:async()=>JSON.stringify({valid:false,issues:['십신 오류'],revisedReply:'화 기운이 80%야.'})}));
  const answer=await reviewLucyReply('화는 관성이야.',{...options,request:async messages=>{
    assert.match(messages[1].content,/십신 관계 불일치/);
    return JSON.stringify({valid:false,issues:['십신 오류'],revisedReply:'임수 기준 화는 재성이고 토는 관성이야.'});
  }});
  assert.match(answer,/화는 재성/);
});

test('three-card readings retain their individual orientations',()=>{
  const tarot=buildLucyCriticalFacts(null,{source:'app-random',id:'three',drawnAt:1,markers:'[TAROT:major_19:upright] [TAROT:major_18:reversed] [TAROT:swords_1:upright]'});
  assert.deepEqual(findCriticalFactConflicts('태양 정방향, 달 역방향, 검 에이스 정방향',tarot),[]);
  assert.ok(findCriticalFactConflicts('태양 정방향, 달 정방향, 검 에이스 정방향',tarot).length);
});

test('missing chart cannot acquire a personal day master while general definitions remain possible',()=>{
  const missing=buildLucyCriticalFacts(null);
  assert.ok(findCriticalFactConflicts('네 일간은 갑목이야.',missing,'내 사주를 봐줘').length);
  assert.deepEqual(findCriticalFactConflicts('갑목 일간은 큰 나무에 빗대는 전통적 상징이야.',missing,'갑목 일간의 뜻을 설명해줘'),[]);
});

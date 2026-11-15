import test from 'node:test';
import assert from 'node:assert/strict';
import { retainRecentConversation, restoreLatestConversation, loadSavedUnifiedMessages, saveUnifiedMessagesSafely } from '../src/lib/chatHistorySync';
import { processDailyChatArchival, loadAllPermanentMemories, buildPermanentMemoryPromptContext } from '../src/lib/chatMemoryArchive';
import { rememberChatDays } from '../src/lib/dailyChatMemoryStore';
import { getLucyChatDay, millisecondsUntilLucyMidnight, subscribeLucyMidnight } from '../src/lib/lucyChatDay';
import { mergeUnifiedMessages, type UnifiedMessage } from '../src/lib/chatHistorySync';
import { safeLocalStorage } from '../src/utils/safeStorage';
const now = Date.parse('2026-11-15T15:00:01Z'); // Nov 16 00:00:01 KST, independently of device timezone
const message = (id:string, ageMs:number, role:UnifiedMessage['role']='user'):UnifiedMessage => ({id,role,content:id,timestamp:now-ageMs});

test('KST midnight is exact even when the device is in another timezone', () => {
  assert.equal(getLucyChatDay(now-2000),'2026-11-15');
  assert.equal(getLucyChatDay(now),'2026-11-16');
  assert.equal(millisecondsUntilLucyMidnight(now-2000),1000);
  assert.equal(millisecondsUntilLucyMidnight(now),86399000);
});
test('rollover archives yesterday before opening a fresh greeting, while retaining today', t => {
  t.mock.method(Date,'now',()=>now);
  safeLocalStorage.clear();
  const yesterday = message('yesterday-question',2000);
  const reply = message('yesterday-advice',1500,'model');
  const result = processDailyChatArchival([yesterday,reply],'제제');
  assert.equal(result.wasArchived,true);
  assert.equal(result.messages.some(m=>m.role==='user'),false);
  const memory = loadAllPermanentMemories().find(entry=>entry.date==='2026-11-15');
  assert.ok(memory?.userTopics.includes('yesterday-question'));
  assert.ok(memory?.assistantExcerpts?.includes('yesterday-advice'));
  const current = processDailyChatArchival([yesterday,reply,message('today-question',500)],'제제');
  assert.deepEqual(current.messages.filter(m=>m.role==='user').map(m=>m.id),['today-question']);
  assert.match(buildPermanentMemoryPromptContext(),/yesterday-question/);
});
test('reload and delayed cloud merges cannot resurrect yesterday in the visible thread', t => {
  t.mock.method(Date,'now',()=>now);
  safeLocalStorage.clear();
  saveUnifiedMessagesSafely([message('old-question',2000),message('old-answer',1500,'model')]);
  assert.equal(loadSavedUnifiedMessages().some(m=>m.id==='old-question'),false);
  assert.ok(loadAllPermanentMemories().some(entry=>entry.userTopics.includes('old-question')));
  const merged=mergeUnifiedMessages([message('today',100)],[message('old-question',2000)]);
  assert.deepEqual(merged.filter(m=>m.role==='user').map(m=>m.id),['today']);
});
test('daily memories merge without duplicate entries and stay within their account', t => {
  t.mock.method(Date,'now',()=>now);
  safeLocalStorage.clear();
  const messages=[message('private-question',2000),message('private-advice',1500,'model')];
  rememberChatDays(messages,'alice');
  rememberChatDays(messages,'alice');
  assert.equal(loadAllPermanentMemories('alice').length,1);
  assert.equal(loadAllPermanentMemories('alice')[0].userTopics.length,1);
  assert.equal(loadAllPermanentMemories('bob').length,0);
});
test('only the latest 80 messages of today remain visible',t=>{
  t.mock.method(Date,'now',()=>now);
  const many=Array.from({length:100},(_,i)=>message(`m-${i}`,(100-i)*5));
  const kept=retainRecentConversation(many,now);
  assert.equal(kept.length,80);
  assert.equal(kept[0].id,'m-20');
});
test('entry restoration keeps today’s latest exchange and active streamed text',t=>{
  t.mock.method(Date,'now',()=>now);
  const user=message('today-user',500);
  const current=[user,{...message('today-answer',400,'model'),content:'현재 이어지는 더 긴 답변'}];
  const saved=[user,{...message('today-answer',400,'model'),content:'현재'}];
  assert.equal(restoreLatestConversation(current,saved),current);
  const newer=restoreLatestConversation(current,[message('new-question',100),message('new-answer',50,'model')]);
  assert.equal(newer.at(-1)?.id,'new-answer');
});
test('midnight scheduler runs at KST rollover and reconciles after suspension',t=>{
  t.mock.timers.enable({apis:['setTimeout','Date'],now:Date.parse('2026-11-15T14:59:59Z')});
  const oldWindow=Object.getOwnPropertyDescriptor(globalThis,'window');
  const oldDocument=Object.getOwnPropertyDescriptor(globalThis,'document');
  const events=new EventTarget();
  const visibility=new EventTarget();
  Object.defineProperty(globalThis,'window',{configurable:true,value:events});
  Object.defineProperty(globalThis,'document',{configurable:true,value:visibility});
  let count=0;
  const stop=subscribeLucyMidnight(()=>count++);
  try {
    assert.equal(count,1);
    t.mock.timers.tick(1010);
    assert.equal(count,2);
    t.mock.timers.setTime(Date.parse('2026-11-17T01:00:00Z'));
    events.dispatchEvent(new Event('pageshow'));
    assert.equal(count,3);
    stop();
    events.dispatchEvent(new Event('focus'));
    t.mock.timers.tick(86400000);
    assert.equal(count,3);
  } finally {
    stop();
    if(oldWindow)Object.defineProperty(globalThis,'window',oldWindow);else Reflect.deleteProperty(globalThis,'window');
    if(oldDocument)Object.defineProperty(globalThis,'document',oldDocument);else Reflect.deleteProperty(globalThis,'document');
  }
});

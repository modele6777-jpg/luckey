import test from 'node:test';
import assert from 'node:assert/strict';
import {memoryFromMessages,mergeLucyMemory,readLucyMemory,writeLucyMemory,buildLucyLongTermPrompt,lucyMemorySignature,MAX_LUCY_MEMORY_BYTES,lucyMemoryKey} from '../src/lib/lucyLongTermMemory';
import {normalizeProHistory} from '../src/lib/lucyProHistory';
import {safeLocalStorage} from '../src/utils/safeStorage';
const yesterday=new Date(2026,9,27,23,58).getTime();
const messages=[{id:'u',role:'user' as const,timestamp:yesterday,content:'내 고양이 이름은 달콩이야'},{id:'a',role:'model' as const,timestamp:yesterday+1000,content:'달콩이와 함께하는 시간이 소중하겠네'}];
test('daily visible-history reset does not erase either source of long-term memory',()=>{
 const entries=mergeLucyMemory(memoryFromMessages('a','lucy',messages),memoryFromMessages('a','lucy-pro',[{...messages[0],id:'p',content:'다음 달에 피아노 공연이 있어'}]));
 writeLucyMemory('a',entries);
 const reset=normalizeProHistory({day:'2026-10-27',messages},'2026-10-28',yesterday+120000);
 assert(!JSON.stringify(reset).includes('달콩'));assert(readLucyMemory('a').some(e=>e.text.includes('달콩')));
 const prompt=buildLucyLongTermPrompt('a',readLucyMemory('a'),'달콩 피아노');assert.match(prompt,/달콩/);assert.match(prompt,/피아노/);assert.match(prompt,/lucy-pro/);
 assert(safeLocalStorage.getItem(lucyMemoryKey('a')));
});
test('account isolation, roles and attachment filtering are preserved',()=>{
 assert.deepEqual(readLucyMemory('b'),[]);
 const mine=memoryFromMessages('a','lucy',messages);
 const foreign=Array.from({length:900},(_,i)=>({...mine[0],account:'b',id:'foreign'+i,timestamp:Date.now()+i,text:'다른 계정 '.repeat(200)}));
 writeLucyMemory('a',[...mine,...foreign]);assert.equal(readLucyMemory('a').length,2);
 assert.match(buildLucyLongTermPrompt('a',[...mine,...foreign],'달콩'),/달콩/);
 assert.equal(buildLucyLongTermPrompt('b',readLucyMemory('a'),'달콩'),'');
 const notes=memoryFromMessages('a','lucy',[{id:'greet-test',role:'model',timestamp:yesterday,content:'안녕'},{id:'sys',role:'system',timestamp:yesterday,content:'규칙'},{id:'raw',role:'user',timestamp:yesterday,content:[{type:'image_url',image_url:'SECRET'},{type:'text',text:'순수한 문장'}]},{id:'err',role:'model',timestamp:yesterday,content:'⚠️ 오류'}]);
 assert.equal(notes.length,1);assert.equal(notes[0].text,'순수한 문장');assert.equal(notes[0].role,'user');
});
test('memory replicas merge deterministically and preserve different-device turns',()=>{
 const a=memoryFromMessages('a','lucy',messages);const b=memoryFromMessages('a','lucy-pro',[{...messages[0],id:'pc',content:'pc에서 남긴 고민'}]);
 assert.deepEqual(mergeLucyMemory(a,b),mergeLucyMemory(b,a));assert.equal(mergeLucyMemory(a,b,a).length,3);
 const changed=[{...a[0],text:'정정된 내용으로 더 길어진 대화'}];assert.deepEqual(mergeLucyMemory(changed,a),mergeLucyMemory(a,changed));
 assert.notEqual(lucyMemorySignature(a),lucyMemorySignature(b));
});
test('storage and retrieval have bounded budgets without erasing stored entries on query',()=>{
 const many=Array.from({length:900},(_,i)=>({...memoryFromMessages('a','lucy',messages)[0],id:`lucy:${i}`,timestamp:yesterday+i,text:'긴 기억 '.repeat(100)}));
 const merged=mergeLucyMemory(many);assert(new TextEncoder().encode(JSON.stringify(merged)).byteLength<=MAX_LUCY_MEMORY_BYTES);assert(merged.length<900);
 const before=JSON.stringify(merged);const prompt=buildLucyLongTermPrompt('a',merged,'기억');assert(prompt.length<14000);assert.equal(JSON.stringify(merged),before);
});
test('user statements and old assistant speculation stay distinguishable, with newest profile precedence',()=>{
 const prompt=buildLucyLongTermPrompt('a',memoryFromMessages('a','lucy',messages),'달콩');assert.match(prompt,/사용자/);assert.match(prompt,/AI가 했던 추측/);assert.match(prompt,/현재 프로필을 우선/);
});
test('shared-state merging and signatures include persistent memory',async()=>{
 const {mergeSharedState,getSharedStateSignature}=await import('../src/lib/sharedStateSync');
 const a=memoryFromMessages('a','lucy',messages);const b=memoryFromMessages('a','lucy-pro',[{...messages[0],id:'cloud'}]);
 const result=mergeSharedState({lucyLongTermMemory:a},{lucyLongTermMemory:b},1,2);
 assert.equal(result.lucyLongTermMemory?.length,3);
 assert.notEqual(getSharedStateSignature({lucyLongTermMemory:a}),getSharedStateSignature({lucyLongTermMemory:b}));
});

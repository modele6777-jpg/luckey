import test from 'node:test';
import assert from 'node:assert/strict';
import { createContinuousDataSync, syncDataSignature, localSyncChangeToken, localActivityPatch } from '../src/lib/continuousDataSync';
import { recoveringSubscription } from '../src/lib/recoveringSubscription';
import { mergeSharedState } from '../src/lib/sharedStateSync';
const wait=(ms:number)=>new Promise(resolve=>setTimeout(resolve,ms));

test('local-only edits upload automatically, including edits with unchanged collection lengths',async()=>{
 let state={userGoals:[{id:'g',title:'old',status:'pending'}]};const pushed:typeof state[]=[];
 const sync=createContinuousDataSync<typeof state>({read:()=>structuredClone(state),signature:syncDataSignature,push:async value=>{pushed.push(value);}});
 await sync.scan();state.userGoals[0].title='edited on phone';await sync.scan(true);
 assert.equal(pushed.length,2);assert.equal(pushed[1].userGoals[0].title,'edited on phone');sync.dispose();
});
test('server clock echoes and synthetic collector timestamps cannot start a write loop',async()=>{
 let at=1,writes=0;
 const sync=createContinuousDataSync({read:()=>({clientUpdatedAt:at++,updatedAt:at++,dailyArts:{today:{timestamp:at++,title:'same'}}}),signature:syncDataSignature,push:async()=>{writes++;}});
 for(let i=0;i<10;i++)await sync.scan(true);
 assert.equal(writes,1);sync.dispose();
});
test('an edit made while uploading is not dropped, and failures remain retryable',async()=>{
 let state={title:'first'},token='1';let release:()=>void=()=>{};const values:string[]=[];
 const sync=createContinuousDataSync<typeof state>({read:()=>({...state}),changeToken:()=>token,signature:syncDataSignature,push:async value=>{values.push(value.title);if(values.length===1)await new Promise<void>(resolve=>{release=resolve;});},retryMs:1});
 const first=sync.scan();state={title:'second'};token='2';await sync.scan();release();await first;await sync.scan();
 assert.deepEqual(values,['first','second']);sync.dispose();
 let attempts=0;
 const retry=createContinuousDataSync({read:()=>state,signature:syncDataSignature,push:async()=>{if(++attempts===1)throw Error('offline');},retryMs:1});
 await retry.scan();await wait(3);await retry.scan();assert.equal(attempts,2);retry.dispose();
});
test('two devices converge on profile, goals and chats without a manual sync action',async()=>{
 let server:any={};let pc:any={userProfile:{basic:{nickname:'PC'}}};let phone:any={chatHistory:[{id:'u',role:'user',content:'phone question',timestamp:Date.now()}]};let writes=0;
 const publish=(value:any)=>{server=mergeSharedState(server,value);pc=mergeSharedState(pc,server);phone=mergeSharedState(phone,server);writes++;};
 const a=createContinuousDataSync({read:()=>pc,signature:syncDataSignature,push:async value=>publish(value)});
 const b=createContinuousDataSync({read:()=>phone,signature:syncDataSignature,push:async value=>publish(value)});
 await a.scan();await b.scan();
 phone={...phone,userGoals:[{id:'g',title:'phone goal'}]};await b.scan(true);await a.scan(true);
 assert.equal(pc.userGoals[0].title,'phone goal');assert.equal(phone.userProfile.basic.nickname,'PC');assert.ok(pc.chatHistory.some((message:any)=>message.id==='u')); 
 const settled=writes;for(let i=0;i<5;i++){await a.scan(true);await b.scan(true);}assert.equal(writes,settled);a.dispose();b.dispose();
});
test('visibility wake uploads queued work without an idle or media-playback gate',async()=>{
 let visible=false,writes=0;
 const sync=createContinuousDataSync({read:()=>({title:'pending'}),signature:syncDataSignature,visible:()=>visible,push:async()=>{writes++;}});
 await sync.scan();await sync.wake();assert.equal(writes,0);visible=true;await sync.wake();assert.equal(writes,1);sync.dispose();
});
test('reconnect events reattach and read immediately; cleanup rejects late results',async()=>{
 const events=new EventTarget() as Window;let attach=0,loads=0,deliveries=0;let failed:((error:unknown)=>void)|undefined;
 let resolveLoad:((value:number)=>void)|undefined;
 const stop=recoveringSubscription({watch:(_next,error)=>{attach++;failed=error;return()=>{};},load:async()=>{loads++;return loads;},receive:()=>{deliveries++;},events,retryMs:1,intervalMs:10000});
 await wait(1);events.dispatchEvent(new Event('online'));await wait(1);assert.equal(attach,2);assert.equal(loads,2);
 failed?.(Error('listener terminated'));await wait(5);assert.ok(attach>=3);stop();const before=deliveries;events.dispatchEvent(new Event('focus'));await wait(2);assert.equal(deliveries,before);
 const late=recoveringSubscription({watch:()=>()=>{},load:()=>new Promise<number>(resolve=>{resolveLoad=resolve;}),receive:()=>{deliveries++;},intervalMs:10000});
 late();resolveLoad?.(99);await wait(1);assert.equal(deliveries,before);
});

test('actual local edits get conflict clocks while unchanged collector reads do not',()=>{
 const current={dailyArts:{today:{title:'old',timestamp:10}},userGoals:[{id:'g',title:'old'}],userGoalsUpdatedAt:10};
 assert.deepEqual(localActivityPatch(current,{dailyArts:{today:{title:'old',timestamp:999}}},100),{});
 const patch=localActivityPatch(current,{dailyArts:{today:{title:'new',timestamp:999}},userGoals:[{id:'g',title:'new'}]},100);
 assert.equal(patch.dailyArts?.today.timestamp,100);assert.equal(patch.userGoalsUpdatedAt,100);
});
test('editing an existing diary or oracle reaches another device, not only new list items',()=>{
 const old={clientUpdatedAt:10,epilogueHistory:[{id:'d',dateKey:'2026-11-06',content:'old'}],todayOracles:{today:{trinity:{title:'old',timestamp:10}}},userGoals:[{id:'g',title:'old'}],userGoalsUpdatedAt:10};
 const change=localActivityPatch(old,{epilogueHistory:[{id:'d',dateKey:'2026-11-06',content:'new'}],todayOracles:{today:{trinity:{title:'new',timestamp:10}}},userGoals:[{id:'g',title:'new'}]},100);
 const next=mergeSharedState(old,{...change,clientUpdatedAt:100});
 const phone=mergeSharedState(old,next);
 assert.equal(phone.epilogueHistory?.[0].content,'new');assert.equal(phone.todayOracles?.today.trinity.title,'new');assert.equal(phone.userGoals?.[0].title,'new');
 const stable=mergeSharedState(phone,next);assert.equal(stable.userGoalsUpdatedAt,100);
});
test('storage monitoring ignores authentication, playback and another account while observing local data',()=>{
 const map=new Map([['firebase:auth','secret'],['prism_bgm_volume','1'],['lucy_state_other','foreign'],['epilogue_diary_history','old']]);
 const storage={get length(){return map.size;},key:(index:number)=>[...map.keys()][index]||null,getItem:(key:string)=>map.get(key)||null} as Storage;
 const before=localSyncChangeToken(storage,'mine');map.set('prism_bgm_volume','2');map.set('lucy_state_other','changed');assert.equal(localSyncChangeToken(storage,'mine'),before);
 map.set('epilogue_diary_history','new');assert.notEqual(localSyncChangeToken(storage,'mine'),before);
});
test('local read errors recover without marking data delivered or leaving an unhandled rejection',async()=>{
 let reads=0,writes=0;
 const sync=createContinuousDataSync({read:()=>{if(++reads===1)throw Error('temporary read failure');return {title:'saved'};},signature:syncDataSignature,push:async()=>{writes++;},retryMs:1});
 await sync.scan();await wait(3);await sync.scan();assert.equal(writes,1);sync.dispose();
});

test('Firestore field order changes do not produce repeated Pro chat writes',()=>{
 const local=[{id:'m',role:'model',content:'reviewed answer',timestamp:1,mode:'master'}];
 const server=[{timestamp:1,mode:'master',content:'reviewed answer',role:'model',id:'m'}];
 assert.equal(syncDataSignature(local),syncDataSignature(server));
});

test('goal order follows the newer edit and equal-clock conflicts converge across device order',()=>{
 const a={userGoals:[{id:'a',title:'A'},{id:'b',title:'B'}],userGoalsUpdatedAt:10};
 const b={userGoals:[{id:'b',title:'B'},{id:'a',title:'A'}],userGoalsUpdatedAt:20};
 assert.deepEqual(mergeSharedState(a,b).userGoals?.map(goal=>goal.id),['b','a']);
 const tied={...a,userGoalsUpdatedAt:20};
 assert.deepEqual(mergeSharedState(tied,b).userGoals,mergeSharedState(b,tied).userGoals);
});

test('an offline Pro reset is persisted across reload and filters older messages',async()=>{
 const {saveProHistory,loadProHistory,normalizeProHistory}=await import('../src/lib/lucyProHistory');
 const {getTodayDateKey}=await import('../src/lib/dailyCache');
 const now=Date.now();
 saveProHistory('offline-reset',[{id:'old',role:'user',content:'before reset',timestamp:now-1000}]);
 saveProHistory('offline-reset',[],now);
 const reloaded=loadProHistory('offline-reset');assert.equal(reloaded.resetAt,now);assert.ok(!reloaded.messages.some(message=>message.id==='old'));
 const restored=normalizeProHistory({day:getTodayDateKey(),resetAt:now,messages:[{id:'old',role:'user',content:'before reset',timestamp:now-1000}]});
 assert.ok(!restored.messages.some(message=>message.id==='old'));
});

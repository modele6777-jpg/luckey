import test from 'node:test';
import assert from 'node:assert/strict';
import {buildChatDivinationContext as build} from '../src/lib/divination/chatContext';
import {selectOptimalDivinationTools} from '../src/lib/fifteenDivinationTools';
const now=new Date('2024-01-15T02:00:00Z');
test('Lucy and Pro selections both feed actual event engines',()=>{
 for(const pro of [false,true]) {
  for(const [text,id] of [['주역으로 이직운 봐줘','iching'],['육임으로 계약 전망 봐줘','liuren'],['일반 기문으로 이직 전망 봐줘','qimen']] as const){
   const selection=selectOptimalDivinationTools(text,[],undefined,pro,{allowMaster:pro});
   const r=build({text,selected:selection.selectedTools.map(t=>t.id),now});
   assert(r.results.some(r=>r.tool===id));assert.match(r.prompt,/실제 점술 계산 결과/);
  }
 }
});
test('greetings, casual mode, and definitions never cast',()=>{
 for(const text of ['안녕','주역이 뭐야?','육임 원리 설명해줘','기문 계산법 알려줘'])assert.equal(build({text,selected:['iching','liuren','qimen'],now}).results.length,0);
 assert.equal(build({text:'주역으로 봐줘',selected:['iching'],casual:true}).prompt,'');
});
test('actual manual six lines are honored and malformed input never triggers random fallback',()=>{
 const r=build({text:'주역 풀이해줘 6효: 6 6 6 9 9 9',selected:['iching'],now});
 assert.match(r.prompt,/천지비/);assert.match(r.prompt,/지천태/);
 const invalid=build({text:'주역 6효: 6 6 6 9 9 10 풀이해줘',selected:['iching'],now});assert.equal(invalid.results.length,0);assert.match(invalid.prompt,/계산 보류/);
});
test('copied calculation results are interpreted without recasting',()=>{
 const r=build({text:'[주역 실제 계산 결과] {"primary":{"number":1}} 해석해줘',selected:['iching'],now});assert.equal(r.results.length,0);assert.match(r.prompt,/새 작괘·포국을 하지 않았어/);
});
test('followups reuse the previous computed hexagram; new draw request generates a fresh calculation',()=>{
 const a=build({text:'주역으로 이직운 봐줘',selected:['iching'],now});
 const b=build({text:'그 괘 변효 좀 더 해석해줘',selected:['iching'],previous:a.prompt,now});
 assert.equal(b.results.length,0);assert(b.prompt.startsWith(a.prompt));assert.match(b.prompt,/후속 해석/);
 assert.equal(build({text:'방금 밥 먹었어',selected:['iching'],previous:a.prompt,now}).prompt,'');
 const c=build({text:'주역 새로 뽑아줘',selected:['iching'],previous:a.prompt,now});assert.equal(c.results.length,1);
});
test('KST timestamps are explicit; invalid or ambiguous requested times are never replaced with now',()=>{
 const a=build({text:'육임 2024-01-15 11:00 포국해줘',selected:['liuren'],now});assert.match(a.prompt,/2024-01-15T02:00:00/);assert.equal(a.results.length,1);
 for(const text of ['육임 2024-02-30 11:00 포국해줘','육임 점시 내일 오후 3시로 봐줘','육임 2024-01-15 11:00 뉴욕 포국해줘']){
  const r=build({text,selected:['liuren'],now});assert.equal(r.results.length,0);assert.match(r.prompt,/계산 보류/);
 }
});
test('Hongguk-specific requests retain the unsupported-school boundary',()=>{
 const r=build({text:'홍국기문 포국해줘',selected:['qimen'],now});assert.equal(r.results.length,0);assert.match(r.prompt,/홍국기문 별도 수리는 미지원/);
});

test('chat storage merging retains computed results when a partial copy arrives',async()=>{
 const {mergeUnifiedMessages}=await import('../src/lib/chatHistorySync');
 const timestamp=Date.now();
 const merged=mergeUnifiedMessages([{id:'a',role:'model',content:'풀이',timestamp,divinationContext:'[채팅 실제 점술 계산 결과] 값'}],[{id:'a',role:'model',content:'풀이',timestamp,divinationContext:undefined}]);
 assert.match(merged[0].divinationContext!,/실제 점술/);
});
test('shared chat send computes once and retains context for compact retry',async()=>{
 const {readFile}=await import('node:fs/promises');
 const source=await readFile(new URL('../src/contexts/AppContext.tsx',import.meta.url),'utf8');
 assert.equal((source.match(/buildChatDivinationContext\(\{/g)||[]).length,1);
 assert.match(source,/compactSystemPrompt.*chatDivinationContext/);
});

test('stored lab results are profile-aware and available to either chat without re-casting',async()=>{
 const {makeSavedCalculation,getSavedCalculations,buildSavedDivinationPrompt}=await import('../src/lib/divination/savedResults');
 const profile={basic:{birthdate:'2000-08-16',birthtime:'04:00'}};
 const a=makeSavedCalculation('iching',{primary:{number:1},lines:[7,7,7,7,7,7]},'이직할까?',profile);
 const b=makeSavedCalculation('ziwei',{palaces:[]},'',profile);
 for(const scope of ['lucy','lucy-pro']) {
  const stored=buildSavedDivinationPrompt([a,b],profile,['iching','ziwei'],'저장한 괘 해석해줘');
  assert.equal(stored.reuse,true,scope);assert.match(stored.prompt,/이직할까/);assert.match(stored.prompt,/새로 뽑거나 포국하지 마/);
 }
 assert.equal(getSavedCalculations([a]).length,1);
 const changed=buildSavedDivinationPrompt([b],{basic:{birthdate:'1990-01-01'}},['ziwei'],'내 명반 풀이해줘');assert.equal(changed.prompt,'');
 const missing=buildSavedDivinationPrompt([],profile,['iching'],'저장한 괘 해석해줘');assert.equal(missing.reuse,true);assert.match(missing.prompt,/저장 자료 없음/);
 const fresh=buildSavedDivinationPrompt([a],profile,['iching'],'주역 새로 뽑아줘');assert.equal(fresh.reuse,false);assert.equal(fresh.prompt,'');
});
test('stored-calculation requests route regular Lucy into a specialist instead of casual mode',async()=>{
 const {detectLucyChannelsFromText}=await import('../src/lib/lucyAutoModeDetector');
 assert.equal(detectLucyChannelsFromText('프로필에 저장한 괘 해석해줘',{allowMaster:false}).isCasual,false);
});

test('fate preview chat context uses the same result values as the profile card',async()=>{
 const {buildFatePreviewPrompt}=await import('../src/lib/divination/fatePreview');
 const {calculateDetailedSaju}=await import('../src/lib/sajuAnalysis');
 const p={basic:{birthdate:'1990-05-17',birthtime:'12:00',gender:'male' as const}};
 const saju=calculateDetailedSaju(p)!;
 const prompt=buildFatePreviewPrompt(saju);
 assert(prompt.includes(JSON.stringify(saju.pillars)));assert(prompt.includes(JSON.stringify(saju.elements)));
 assert(prompt.includes(JSON.stringify(saju.annual2026)));assert.match(prompt,/상징 지표/);
 assert.match(buildFatePreviewPrompt(null),/미산출/);
 const {detectLucyChannelsFromText}=await import('../src/lib/lucyAutoModeDetector');
 assert.equal(detectLucyChannelsFromText('프로필 운명 프리뷰 풀이해줘',{allowMaster:false}).isCasual,false);
});

test('both chats receive every semantic profile section without photo blobs',async()=>{
 const {buildFullProfilePrompt}=await import('../src/lib/divination/profileContext');
 const prompt=buildFullProfilePrompt({basic:{nickname:'별님',avatarUrl:'data:image/jpeg;base64,SECRET_PHOTO'},fate:{lifeGoal:'독립 작가',currentWorry:'새 직장'},music:{favoriteArtists:'좋아하는 가수',instruments:['피아노']},psych:{mbti:'INFJ',aiPreference:'차분한 조언'},art:{favoritePoets:'좋아하는 시인'},relationships:[{id:'1',name:'친구이름',relation:'친구',traits:'다정함'}]});
 for(const value of ['별님','독립 작가','새 직장','좋아하는 가수','피아노','INFJ','차분한 조언','좋아하는 시인','친구이름','다정함'])assert(prompt.includes(value));
 assert(!prompt.includes('SECRET_PHOTO'));assert.match(prompt,/수다에서는/);assert.match(buildFullProfilePrompt(),/프로필이 없어/);
});

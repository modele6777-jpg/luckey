import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateIching, castIching, hexagram } from '../src/lib/divination/iching';
import { calculateZiwei, calculateSukuyo, calculateVedic, sukuyoFromLunar, sukuyoRelationship } from '../src/lib/divination/birthCharts';
import { calculateLiuren, calculateQimen, eventInstant } from '../src/lib/divination/eventCharts';
import { getLiuRenByYueJiang } from 'liuren-ts-lib';
import { SearchSunLongitude } from 'astronomy-engine';
import { buildUserFifteenToolsDigest } from '../src/lib/fifteenDivinationTools';
import { calculateTojeong, formatTojeongPrompt } from '../src/lib/divination/tojeongEngine';
import { calculateKyusei, formatKyuseiPrompt, KYUSEI_ENGINE_VERSION } from '../src/lib/divination/kyuseiEngine';
const profile={basic:{birthdate:'2000-08-16',birthtime:'04:00',gender:'female' as const,birthCity:'서울'}};
test('King Wen enumeration covers each of 64 hexagrams exactly once',()=>{
  const numbers=Array.from({length:64},(_,n)=>hexagram(Array.from({length:6},(_,i)=>(n>>i)&1)).number);
  assert.equal(new Set(numbers).size,64);assert.equal(Math.min(...numbers),1);assert.equal(Math.max(...numbers),64);
  assert.equal(hexagram([1,1,1,1,1,1]).name,'건위천');assert.equal(hexagram([0,0,0,0,0,0]).name,'곤위지');
  assert.equal(hexagram([1,0,1,0,1,0]).number,63);assert.equal(hexagram([0,1,0,1,0,1]).number,64);
});
test('moving yin/yang produce the opposite changed lines; order is bottom to top',()=>{
  const a=calculateIching([6,6,6,9,9,9]);assert.equal(a.primary.number,12);assert.equal(a.changed.number,11);assert.deepEqual(a.movingLines,[1,2,3,4,5,6]);
  const staticLines=calculateIching([7,8,7,8,7,8]);assert.deepEqual(staticLines.movingLines,[]);assert.equal(staticLines.primary.number,staticLines.changed.number);
  for (const a of [[7],[7,7,7,7,7,10],[7,7,7,7,7,NaN]]) assert.throws(()=>calculateIching(a),RangeError);
});
test('three coin enumeration has 1:3:3:1 line probabilities, without biased modulo sampling',()=>{
  const counts=[0,0,0,0];
  for(let n=0;n<8;n++){const r=castIching(b=>{for(let i=0;i<18;i++)b[i]=(n>>(i%3))&1;return b;});counts[r.lines[0]-6]++;}
  assert.deepEqual(counts,[1,3,3,1]);
  const r=castIching();assert.equal(r.lines.length,6);assert(r.lines.every(n=>[6,7,8,9].includes(n)));
});
test('Ziwei documented 2000-8-16 female 寅-hour example has 午 soul / 戌 body and 14 major stars',()=>{
  const r=calculateZiwei(profile);assert.equal(r.soulPalace,'오');assert.equal(r.bodyPalace,'술');assert.equal(r.palaces.length,12);
  assert.equal(r.palaces.flatMap(p=>p.major).length,14);
  assert.equal(r.palaces.flatMap(p=>[...p.major,...p.minor]).filter(s=>s.mutagen).length,4);
  assert.deepEqual(r.palaces.find(p=>p.name==='재백')!.major.map(s=>s.name),['무곡','천상']);
  const lunar={basic:{...profile.basic,birthdate:'2000-07-17',lunarSolar:'lunar' as const}};
  assert.deepEqual(calculateZiwei(lunar).palaces,r.palaces);
});
test('Ziwei never supplies a made-up birth time or binary gender',()=>{
  assert.throws(()=>calculateZiwei({basic:{...profile.basic,birthtime:''}}),/출생시간/);
  assert.throws(()=>calculateZiwei({basic:{...profile.basic,gender:'other'}}),/성별/);
  assert.throws(()=>calculateZiwei({basic:{...profile.basic,birthdate:'2024-02-30'}}));
  assert.throws(()=>calculateZiwei({basic:{...profile.basic,birthdate:'1800-01-01'}}),/지원/);
});
test('Sukuyo month anchors, daily progression, and directed reciprocal relationships',()=>{
  const anchors=['室','奎','胃','畢','參','鬼','張','角','氐','心','斗','虚'];
  anchors.forEach((s,i)=>assert.equal(sukuyoFromLunar(i+1,1).mansion,s+'宿'));
  assert.equal(sukuyoFromLunar(1,28).mansion,sukuyoFromLunar(1,1).mansion);
  assert.throws(()=>sukuyoFromLunar(2,1,true),/윤달/);assert.throws(()=>sukuyoFromLunar(13,1));
  assert.equal(calculateSukuyo(profile).mansion,'奎宿');
  assert.equal(sukuyoRelationship(0,9).fromA,'업');assert.equal(sukuyoRelationship(0,9).fromB,'태');
  for(let i=0;i<27;i++)assert.equal(sukuyoRelationship(0,i).fromA,sukuyoRelationship(i,0).fromB);
});
test('Vedic reference values stay bounded and dasha periods are contiguous; limitations remain visible',()=>{
  const r=calculateVedic(profile);assert.match(r.method,/근사/);assert(r.ayanamsa>23&&r.ayanamsa<25);
  for(const x of Object.values(r.planets))assert(x>=0&&x<360);
  assert(r.nakshatra.index>=1&&r.nakshatra.index<=27);assert(r.nakshatra.pada>=1&&r.nakshatra.pada<=4);
  assert.equal(r.vimshottari.periods[0].endYearsAfterBirth,r.vimshottari.birthBalanceYears);
  for(let i=1;i<9;i++)assert.equal(r.vimshottari.periods[i].startYearsAfterBirth,r.vimshottari.periods[i-1].endYearsAfterBirth);
  assert.throws(()=>calculateVedic({basic:{...profile.basic,birthtime:''}}),/출생시간/);
});
test('event times convert supported zones and reject DST ambiguity/nonexistent times',()=>{
  assert.equal(eventInstant('2024-01-15','11:00','Asia/Seoul').toISOString(),'2024-01-15T02:00:00.000Z');
  assert.throws(()=>eventInstant('2024-03-10','02:30','America/New_York'));
  assert.throws(()=>eventInstant('2024-11-03','01:30','America/New_York'));
  assert.throws(()=>eventInstant('2024-01-15','24:00','Asia/Seoul'));
});
test('Liuren upstream ancient-case fixture uses the declared month general on the hour branch',()=>{
  const r=getLiuRenByYueJiang('亥','未','丁巳');assert.equal(r.tianDiPan.tianPan.wei,'亥');assert.equal(r.dateInfo.bazi,'-- -- 丁巳 丁未');
  const a=calculateLiuren(eventInstant('2024-01-15','11:00','Asia/Seoul'));assert.equal(a.monthGeneral,'丑');assert.equal(a.day,'戊寅');assert.equal(a.hour,'丁巳');
  assert.equal(Object.keys(a.board.tianPan).length,12);assert.equal(Object.keys(a.lessons).length,4);
  assert.equal(a.transmissions.chuChuan.length,4);
});
test('Liuren month general changes at the astronomical middle term, not at civil midnight',()=>{
  const t=SearchSunLongitude(330,new Date('2026-02-15T00:00:00Z'),10)!.date.getTime();
  assert.equal(calculateLiuren(new Date(t-120000)).monthGeneral,'子');
  assert.equal(calculateLiuren(new Date(t+120000)).monthGeneral,'亥');
});
test('Qimen upstream winter/summer/hour fixtures retain their school and timezone metadata',()=>{
  const a=calculateQimen(eventInstant('2024-01-15','11:00','Asia/Seoul'));
  assert.equal(a.chart['節氣'],'小寒');assert.equal(a.chart['三元'],'中元');assert.equal(a.chart['局數'],8);assert.equal(a.chart['陰陽'],'陽');
  assert.equal(a.calculatedUTC8Hour,'2024-01-15T10:00');assert.match(a.method,/홍국기문 수리 아님/);
  const b=calculateQimen(eventInstant('2024-07-08','15:00','Asia/Seoul'));assert.equal(b.chart['陰陽'],'陰');
  assert.equal((a.chart['天盤'] as string[]).length,9);
});
test('event board results are independent of host timezone',()=>{
  const old=process.env.TZ;
  try {
    const date=new Date('2024-01-15T02:00:00Z');process.env.TZ='UTC';const a=calculateLiuren(date);const q=calculateQimen(date);
    process.env.TZ='America/New_York';assert.deepEqual(calculateLiuren(date),a);assert.deepEqual(calculateQimen(date),q);
  } finally {if(old===undefined)delete process.env.TZ;else process.env.TZ=old;}
});
test('chat receives actual birth outputs and no fake event casting',()=>{
  const digest=buildUserFifteenToolsDigest(profile);
  assert.match(digest,/자미두수 실제 산출/);assert.match(digest,/숙요 실제 산출/);assert.match(digest,/베딕 참고 계산 실제 산출/);assert.match(digest,/임의 포국·작괘 금지/);
});

test('Qimen refuses minute-level results after a solar-term transition within the hour',()=>{
  const t=SearchSunLongitude(315,new Date('2026-02-01T00:00:00Z'),10)!.date;
  assert.throws(()=>calculateQimen(new Date(t.getTime()+120000)),/분 단위/);
});

test('Tojeong reference example: lunar 1990-05-20 birth viewed in 丙午 2026 casts 551 with taese 16, wolgeon 18, iljin 17',()=>{
  const r=calculateTojeong({profile:{basic:{birthdate:'1990-05-20',lunarSolar:'lunar' as const}},targetYear:2026});
  assert.equal(r.status,'calculated');
  assert.equal(r.targetYearGanZhi,'병오');assert.equal(r.taeseCount,16);
  assert.equal(r.birthMonthGanZhi,'갑오');assert.equal(r.wolgeonCount,18);assert.equal(r.birthMonthLength,29);
  assert.equal(r.birthdayGanZhi,'기묘');assert.equal(r.iljinCount,17);
  assert.equal(r.ageKorean,37);
  assert.equal(r.upperGua,5);assert.equal(r.middleGua,5);assert.equal(r.lowerGua,1);
  assert.equal(r.hexagramCode,'551');assert.equal(r.hexagramName,'손위풍');
  assert.equal(r.monthlyFortunes.length,12);
  assert(r.monthlyFortunes.every(m=>m.fortune.length>10&&m.tip.length>5));
  assert(formatTojeongPrompt(r).includes('551괘'));
  const again=calculateTojeong({profile:{basic:{birthdate:'1990-05-20',lunarSolar:'lunar' as const}},targetYear:2026});
  assert.equal(again.hexagramCode,r.hexagramCode);assert.equal(again.annualSummary,r.annualSummary);
});

test('Tojeong converts solar births to lunar, clamps a 30th-day birthday missing in the target year, and skips without birthdate',()=>{
  // 양력 2000-01-01 = 음력 1999-11-25, 2023 계묘년 → 세는나이 25·태세수 15·월건수 18(갑자월·작은달)·일진수 16(기사일)
  const r=calculateTojeong({profile:{basic:{birthdate:'2000-01-01',lunarSolar:'solar' as const}},targetYear:2023});
  assert.deepEqual(r.lunarBirth,{year:1999,month:11,day:25,isLeapMonth:false});
  assert.equal(r.ageKorean,25);assert.equal(r.taeseCount,15);
  assert.equal(r.birthMonthGanZhi,'갑자');assert.equal(r.wolgeonCount,18);assert.equal(r.birthMonthLength,29);
  assert.equal(r.upperGua,8);assert.equal(r.middleGua,5);assert.equal(r.lowerGua,2);
  assert.equal(r.hexagramCode,'852');assert.equal(r.hexagramName,'지풍승');
  const skipped=calculateTojeong({profile:null,targetYear:2026});
  assert.equal(skipped.status,'skipped');assert.match(skipped.note||'',/생년월일/);
});

test('Kyusei reference example: 1990-05-17 solar birth is 一白水星 with 五黄 巳-month moon star in 丙午 2026',()=>{
  const r=calculateKyusei({profile:{basic:{birthdate:'1990-05-17',gender:'female' as const,birthCity:'서울'}},targetDate:new Date('2026-11-02T00:00:00Z')});
  assert.equal(r.status,'calculated');assert.equal(r.engineVersion,KYUSEI_ENGINE_VERSION);
  assert.equal(r.honmyosei.star,1);assert.equal(r.honmyosei.name,'일백수성(一白水星)');
  assert.equal(r.getmyosei.star,5);assert.equal(r.getmyosei.monthBranch,'사');
  assert.equal(r.targetYearGanZhi,'병오');
  // 연반 2026: 일백 입중궁 순행 비성 (오황=남, 암검·세파=북)
  assert.deepEqual(Object.fromEntries(r.annualChart.palaces.map(p=>[p.direction,p.star])),{북:6,북동:4,동:8,남동:9,남:5,남서:7,서:3,북서:2});
  // 월반 2026-11 (술월): 구자 입중궁
  assert.equal(r.monthlyChart.centerStar,9);
  assert.deepEqual(Object.fromEntries(r.monthlyChart.palaces.map(p=>[p.direction,p.star])),{북:5,북동:3,동:7,남동:8,남:4,남서:6,서:2,북서:1});
  const hz=Object.fromEntries(r.hazards.map(h=>[h.name,h.direction]));
  assert.equal(hz['오황살(五黃煞)'],'남');assert.equal(hz['암검살(暗劍煞)'],'북');
  assert.equal(hz['세파살(歲破煞)'],'북');assert.equal(hz['월파살(月破煞)'],'남동');
  // 본명성 일백은 연반 중궁이라 본명살 방위가 없다
  assert.ok(!('본명살(本命煞)' in hz));
  // 상생입(금생수) 방위 중 흉살 없는 남서가 최길
  assert.equal(r.topFortuneDirection!.direction,'남서');
  assert.ok(r.fortuneDirections.find(f=>f.direction==='북')!.clean===false);
  assert.equal(r.usageScenarios.length,3);
  const again=calculateKyusei({profile:{basic:{birthdate:'1990-05-17',gender:'female' as const}},targetDate:new Date('2026-11-02T00:00:00Z')});
  assert.equal(JSON.stringify(again.annualChart),JSON.stringify(r.annualChart));
  const prompt=formatKyuseiPrompt(r);
  assert(prompt.includes('LUCKEY-KS-v1.0.0')&&prompt.includes('오황살')&&prompt.includes('일백수성'));
  assert.equal(formatKyuseiPrompt(calculateKyusei({profile:null})),'');
});

test('Kyusei year stars descend through the published table (2024 三碧 → 2026 一白) and 월반 재현',()=>{
  const starOf=(d:string)=>calculateKyusei({profile:{basic:{birthdate:d,gender:'female' as const}},targetDate:new Date('2026-11-02T00:00:00Z')}).honmyosei.star;
  assert.equal(starOf('2024-06-01'),3);assert.equal(starOf('2025-06-01'),2);assert.equal(starOf('2026-06-01'),1);
  assert.equal(starOf('2000-06-01'),9);assert.equal(starOf('1995-06-01'),5);
  // 삼벽(목) 사람: 상생입 별(일백)은 중궁 → 비화 사록 북동이 최길
  const sam=calculateKyusei({profile:{basic:{birthdate:'2024-06-01',gender:'female' as const}},targetDate:new Date('2026-11-02T00:00:00Z')});
  assert.equal(sam.topFortuneDirection!.direction,'북동');
});

test('Kyusei day star matches published 九星暦 tables including the leap-period (九星置閭) switch days',()=>{
  const dayStar=(date:string)=>calculateKyusei({profile:{basic:{birthdate:'1990-05-17',gender:'female' as const}},targetDate:new Date(date+'T00:00:00Z')}).ilmyosei;
  // 2014-12 kyusei.co3 실측표: 陰遁 끝에서 갑자일에 一白 이연 후 陽遁
  assert.equal(dayStar('2014-12-16').star,3);assert.equal(dayStar('2014-12-17').star,2);
  assert.equal(dayStar('2014-12-18').star,1);assert.equal(dayStar('2014-12-19').star,1);assert.equal(dayStar('2014-12-20').star,2);
  // 2015-06 하지 직전 구자 이연 후 음遁
  assert.equal(dayStar('2015-06-16').star,9);assert.equal(dayStar('2015-06-17').star,9);assert.equal(dayStar('2015-06-18').star,8);
  // 2008-12-31: 윤달 갑오일(12-20) 七赤 陽遁 시작 → 12-31 九紫
  assert.equal(dayStar('2008-12-31').star,9);
  // 2019-11-23 갑자 一白 陽遁 시작(윤달 보정), 2020-06-20 갑오 三碧 陰遁, 2031-12-20 갑오 七赤 陽遁
  assert.equal(dayStar('2019-11-23').star,1);assert.equal(dayStar('2020-06-20').star,3);assert.equal(dayStar('2031-12-20').star,7);
  // 일진: 2000-01-01 = 무오일, 2014-12-19 = 갑자일
  assert.equal(dayStar('2000-01-01').dayGanZhi,'무오');assert.equal(dayStar('2014-12-19').dayGanZhi,'갑자');
});

test('Kyusei keeps the Ipchun-day boundary honest and skips without birthdate',()=>{
  const skippedDay=calculateKyusei({profile:{basic:{birthdate:'2026-02-04',gender:'female' as const}},targetDate:new Date('2026-11-02T00:00:00Z')});
  assert.equal(skippedDay.status,'skipped');assert.match(skippedDay.note||'',/입춘 당일 생시 미입력/);
  const before=calculateKyusei({profile:{basic:{birthdate:'2026-02-04',birthtime:'00:30',gender:'female' as const}},targetDate:new Date('2026-11-02T00:00:00Z')});
  const after=calculateKyusei({profile:{basic:{birthdate:'2026-02-04',birthtime:'23:30',gender:'female' as const}},targetDate:new Date('2026-11-02T00:00:00Z')});
  assert.equal(before.status,'calculated');assert.equal(after.status,'calculated');
  assert.notEqual(before.honmyosei.star,after.honmyosei.star);
  const skipped=calculateKyusei({profile:null});
  assert.equal(skipped.status,'skipped');assert.match(skipped.note||'',/생년월일/);
});

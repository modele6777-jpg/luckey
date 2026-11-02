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
import { calculateSamjaeGyoUn, formatSamjaeGyoUnPrompt, SAMJAE_GYOUN_ENGINE_VERSION } from '../src/lib/divination/samjaeGyoUnEngine';
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

const sgProfile={basic:{birthdate:'2000-08-16',birthtime:'04:00',gender:'female' as const,birthCity:'서울'}};

test('Samjae phases follow the published triple-harmony table (들·눌·날 per anchor group)',()=>{
  const sg=(d:string,y:number)=>calculateSamjaeGyoUn({profile:{basic:{birthdate:d,gender:'female' as const}},targetYear:y}).samjae;
  // 신자진군: 쥐(1996 병자)·원숭이(1992 임신)·용(1988 무진)띠 — 2022 임인년 들삼재, 2024 갑진년 날삼재
  assert.equal(sg('1996-05-01',2022).phase,'들삼재(入三災)');
  assert.equal(sg('1992-05-01',2022).phase,'들삼재(入三災)');
  assert.equal(sg('1988-05-01',2024).phase,'날삼재(出三災)');
  assert.equal(sg('1996-05-01',2023).phase,'눌삼재(臥三災)');
  assert.equal(sg('1996-05-01',2026).isSamjaeYear,false);
  // 인오술군: 말(1990 경오)띠 — 2028 무신년 들삼재
  assert.equal(sg('1990-05-01',2028).phase,'들삼재(入三災)');
  // 해묘미군: 돼지(1995 을해)띠 — 2025 을사년 들삼재, 2027 정미년 날삼재
  assert.equal(sg('1995-05-01',2025).phase,'들삼재(入三災)');
  assert.equal(sg('1995-05-01',2027).phase,'날삼재(出三災)');
  // 사유축군: 닭(1993 계유)띠 — 2021 신축년 날삼재
  assert.equal(sg('1993-05-01',2021).phase,'날삼재(出三災)');
  // 3개년 궤적은 들→눌→날 순서로 고정되고 당해년도에 표식이 찍힌다
  const arc=sg('1996-05-01',2022).threeYearArc;
  assert.deepEqual(arc.map(a=>a.year),[2022,2023,2024]);
  assert.deepEqual(arc.map(a=>a.phase),['들삼재(入三災)','눌삼재(臥三災)','날삼재(出三災)']);
  assert.equal(arc[0].year===2022,arc[0].phase==='들삼재(入三災)');
});

test('Samjae grading is deterministic, bounded, and carries 원국 interaction details',()=>{
  const a=calculateSamjaeGyoUn({profile:sgProfile,targetYear:2022});
  const b=calculateSamjaeGyoUn({profile:sgProfile,targetYear:2022});
  assert.equal(JSON.stringify(a.samjae),JSON.stringify(b.samjae));
  assert(a.samjae.isSamjaeYear); // 2000 경진 용띠 → 2022 임인년 들삼재
  assert(['복삼재(福三災)','평삼재(平三災)','악삼재(惡三災)'].includes(a.samjae.grade!));
  assert(a.samjae.gradeReason.length>5);
  assert(a.samjae.interactions.every(i=>i.detail.length>5));
  assert(a.samjae.wellnessPrescription!.foods.length>=3);
  // 삼재가 아닌 해는 처방이 비고 등급이 null
  const off=calculateSamjaeGyoUn({profile:sgProfile,targetYear:2026}).samjae;
  assert.equal(off.isSamjaeYear,false);assert.equal(off.grade,null);assert.equal(off.wellnessPrescription,null);
});

test('GyoUn detection brackets the daewoon switch within 2 years and reports remaining months to Ipchun',()=>{
  const at=(y:number)=>calculateSamjaeGyoUn({profile:sgProfile,targetYear:y}).gyoUn;
  const cur=at(2026);
  assert(cur.currentDaewoon&&cur.nextDaewoon);
  assert.equal(cur.isGyoUnPeriod,false);
  const switchYear=cur.nextDaewoon!.startYear;
  const d2=at(switchYear-2);
  assert.equal(d2.isGyoUnPeriod,true);assert.equal(d2.windowType,'교체 전 조정기 (D-2)');
  assert.equal(d2.yearsUntilSwitch,2);
  assert(d2.monthsUntilSwitch!==null&&d2.monthsUntilSwitch>24&&d2.monthsUntilSwitch<26.5);
  const peak=at(switchYear);
  assert.equal(peak.isGyoUnPeriod,true);assert.equal(peak.windowType,'교체 당해년도 (대환절기·판도 대전환)');
  assert(peak.monthsUntilSwitch!==null&&peak.monthsUntilSwitch>0&&peak.monthsUntilSwitch<2);
  const after=at(switchYear+1);
  assert.equal(after.isGyoUnPeriod,true);assert.equal(after.windowType,'교체 직후 안착기 (+1)');
  assert.equal(after.monthsUntilSwitch,0);
  assert(d2.tenGodShift!.cushionGuide.length>10);
  assert(d2.seasonShift!==null);
  assert(d2.riskBufferAdvice.length>10&&d2.opportunityTiming.length>10);
});

test('Samjae/GyoUn skips without birthdate, degrades without gender, and renders the full prompt',()=>{
  const skipped=calculateSamjaeGyoUn({profile:null,targetYear:2026});
  assert.equal(skipped.status,'skipped');assert.match(skipped.note||'',/생년월일/);
  const r=calculateSamjaeGyoUn({profile:sgProfile,targetYear:2026});
  assert.equal(r.status,'calculated');assert.equal(r.engineVersion,SAMJAE_GYOUN_ENGINE_VERSION);
  const prompt=formatSamjaeGyoUnPrompt(r);
  assert(prompt.includes('LUCKEY-SG-v1.0.0')&&prompt.includes('삼재')&&prompt.includes('교운기')&&prompt.includes('바이오웰니스'));
  assert.equal(formatSamjaeGyoUnPrompt(skipped),'');
  const noGender=calculateSamjaeGyoUn({profile:{basic:{birthdate:'2000-08-16'}},targetYear:2026});
  assert.equal(noGender.status,'calculated');
  assert(noGender.samjae.isSamjaeYear===false||noGender.samjae.isSamjaeYear===true);
  assert.equal(noGender.gyoUn.isGyoUnPeriod,false);assert.match(noGender.gyoUn.note||'',/성별/);
});

import { calculateAuspiciousStars, formatAuspiciousStarsPrompt, AUSPICIOUS_STARS_ENGINE_VERSION } from '../src/lib/divination/auspiciousStarsEngine';
const asProfile={basic:{birthdate:'2000-01-01',birthtime:'12:00',gender:'female' as const,birthCity:'서울'}}; // 戊午日 丙子月 己卯年 戊午時 (입춘 전)
test('Auspicious stars: 천을귀인 via year stem, kongwang/chung/hyeong interference, noble timing',()=>{
  const r=calculateAuspiciousStars({profile:asProfile,targetYear:2026});
  assert.equal(r.status,'calculated');assert.equal(r.engineVersion,AUSPICIOUS_STARS_ENGINE_VERSION);
  const eul=r.nobleMatrix.cheonEul!;
  assert.equal(eul.foundChar,'子');assert.equal(eul.foundPillars[0].pillar,'월주');
  const types=eul.interference.map(i=>i.type);
  assert(types.some(t=>t.includes('공망'))&&types.some(t=>t.includes('충'))&&types.some(t=>t.includes('형')));
  assert(eul.strengthLevel>=1&&eul.strengthLevel<5);
  assert.equal(r.nobleMatrix.munChang,null);assert.equal(r.nobleMatrix.hakDang,null);
  assert.equal(r.nobleMatrix.munGok,null);assert.equal(r.nobleMatrix.cheonDeok,null);assert.equal(r.nobleMatrix.wolDeok,null);
  assert.equal(r.totalNoblesFound,1);
  const t=r.timing!;
  assert.equal(t.targetYearGanZhi,'丙午');assert.deepEqual(t.thisYearNobles,[]);
  assert.equal(t.upcomingYears[0].year,2027);assert.equal(t.upcomingYears[0].ganZhi,'丁未');
  assert(t.upcomingYears[0].arrivedNobles.includes('천을귀인'));
  const prompt=formatAuspiciousStarsPrompt(r);
  assert(prompt.includes('LUCKEY-AS-v1.0.0')&&prompt.includes('천을귀인')&&prompt.includes('공망'));
});
test('Auspicious stars: resonance detects when the partner holds my noble branch; skips without profile',()=>{
  const r=calculateAuspiciousStars({profile:asProfile,targetYear:2026,partnerProfile:asProfile});
  assert(r.resonance&&r.resonance.partnerHoldsMyNoble&&!r.resonance.mutual);
  assert.equal(r.resonance.resonanceScore,70);assert(r.resonance.foundDetails.length>0);
  const skipped=calculateAuspiciousStars({profile:null,targetYear:2026});
  assert.equal(skipped.status,'skipped');assert.match(skipped.note||'',/생년월일/);
  const a=calculateAuspiciousStars({profile:asProfile,targetYear:2030});
  const b=calculateAuspiciousStars({profile:asProfile,targetYear:2030});
  assert.deepEqual(a.nobleMatrix,b.nobleMatrix);assert.deepEqual(a.timing&&a.timing.upcomingYears,b.timing&&b.timing.upcomingYears);
});

import { calculateTaiyi, formatTaiyiPrompt, TAIYI_ENGINE_VERSION } from '../src/lib/divination/taiyiEngine';
import { runDeterministicEngine } from '../src/lib/divination/deterministicEngine';

test('Taiyi Shenshu: 16-palace calculation, 72 Ju, Jusan/Gaeksan and prompt formatting', () => {
  const profile = { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } };
  const r1 = calculateTaiyi({ profile, targetYear: 2026 });
  assert.equal(r1.status, 'calculated');
  assert.equal(r1.engineVersion, TAIYI_ENGINE_VERSION);
  assert.equal(r1.targetYear, 2026);
  assert.equal(r1.targetYearGanZhi, '병오');
  assert(r1.calculation !== null);
  assert(r1.calculation.juNumber >= 1 && r1.calculation.juNumber <= 72);
  assert(r1.calculation.taiyiPalace >= 1 && r1.calculation.taiyiPalace <= 16);
  assert(r1.calculation.wenChangPalace >= 1 && r1.calculation.wenChangPalace <= 16);
  assert(r1.calculation.shiJiPalace >= 1 && r1.calculation.shiJiPalace <= 16);
  assert(r1.calculation.juSan > 0);
  assert(r1.calculation.gaekSan > 0);
  assert(r1.palaces.length === 16);
  assert(r1.threeGi !== null);
  assert(r1.fiveBlessings !== null);

  // Determinism check
  const r2 = calculateTaiyi({ profile, targetYear: 2026 });
  assert.deepEqual(r1, r2);

  // Prompt formatting
  const prompt = formatTaiyiPrompt(r1);
  assert(prompt.includes('LUCKEY-TY-v1.0.0'));
  assert(prompt.includes('태을신수'));
  assert(prompt.includes('주산'));
  assert(prompt.includes('객산'));

  // Skipped without birthdate
  const skipped = calculateTaiyi({ profile: null, targetYear: 2026 });
  assert.equal(skipped.status, 'skipped');
  assert.equal(formatTaiyiPrompt(skipped), '[태을신수: 사용자 생년월일이 입력되지 않아 태을신수 개인화 감응 계산을 건너뜁니다.]');

  // Integration in runDeterministicEngine: all 15 tools implemented (0 not_implemented)
  const report = runDeterministicEngine({ profile, question: '올해 사업 운세와 거시 흐름' });
  assert.equal(report.tools.taiyi.status, 'calculated');
  assert.equal(Object.values(report.tools).filter((t) => t.status === 'not_implemented').length, 0);
  assert(report.taiyiResult !== null && report.taiyiResult !== undefined);
});

import { calculateGeokguk, formatGeokgukPrompt, GEOKGUK_ENGINE_VERSION, decideGeokgukFromPillars } from '../src/lib/divination/geokgukEngine';

test('Geokguk engine: Zipyeong Jinjeon 10-geok judgment, seong/pa/gueung, determinism and prompt formatting', () => {
  const profile = { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } };
  const r1 = calculateGeokguk({ profile });
  assert.equal(r1.status, 'calculated');
  assert.equal(r1.engineVersion, GEOKGUK_ENGINE_VERSION);
  assert(r1.monthCommand !== null);
  assert.match(r1.monthCommand.branch, /[子丑寅卯辰巳午未申酉戌亥]/);
  assert(r1.monthCommand.stem.length >= 1);
  assert.match(r1.geokgukType, /格\)$/);
  assert(['성격(成格)', '구응(救應) 성공 · 성격(成格) 회복', '파격(破格)', '원격(原格) 성립'].includes(r1.verdict));
  assert(r1.yongMethod.length > 0);

  // 성격/파격/구응 판정 일관성
  if (r1.paGyeok.length > 0 && r1.guEung.length > 0) {
    assert.equal(r1.verdict, '구응(救應) 성공 · 성격(成格) 회복');
  } else if (r1.paGyeok.length > 0) {
    assert.equal(r1.verdict, '파격(破格)');
    assert.equal(r1.sangSin, null);
  } else if (r1.seongGyeok?.achieved) {
    assert.equal(r1.verdict, '성격(成格)');
    assert(r1.sangSin !== null);
  } else {
    assert.equal(r1.verdict, '원격(原格) 성립');
  }
  assert(r1.careerReport !== null && r1.careerReport.archetype.length > 0);
  assert(r1.careerReport.careers.length >= 3);

  // 대표 명식 수리: 성격(成格) — 정관격 재생관
  const seong = decideGeokgukFromPillars({ dayStem: '辛', monthBranch: '巳', stems: ['甲', '丙', '乙'], bodyLevel: '중화' });
  assert.equal(seong.geokgukName, '정관격');
  assert.equal(seong.verdict, '성격(成格)');
  assert.equal(seong.shinsalClass, '길신(善神) · 순용(順용)');
  assert(seong.seongGyeok !== null && seong.seongGyeok.title.includes('재생관'));

  // 대표 명식 수리: 파격(破格) + 구응(救應) — 상관견관을 인성제상으로 회복
  const gueung = decideGeokgukFromPillars({ dayStem: '辛', monthBranch: '巳', stems: ['壬', '丙', '戊'], bodyLevel: '중화' });
  assert.equal(gueung.geokgukName, '정관격');
  assert.equal(gueung.verdict, '구응(救應) 성공 · 성격(成格) 회복');
  assert(gueung.paGyeok.some((p) => p.type.includes('상관견관')));
  assert(gueung.guEung.some((g) => g.title.includes('인성제상')));

  // 대표 명식 수리: 파격(破格) — 상관견관 무구응
  const pa = decideGeokgukFromPillars({ dayStem: '辛', monthBranch: '巳', stems: ['壬', '丙', '丁'], bodyLevel: '중화' });
  assert.equal(pa.verdict, '파격(破格)');
  assert.equal(pa.guEung.length, 0);

  // 대표 명식 수리: 군겁쟁재 + 식상통관 구응
  const gun = decideGeokgukFromPillars({ dayStem: '甲', monthBranch: '丑', stems: ['乙', '乙', '丙'], bodyLevel: '중화' });
  assert.equal(gun.geokgukName, '정재격');
  assert.equal(gun.verdict, '구응(救應) 성공 · 성격(成格) 회복');

  // 대표 명식 수리: 도식(梟神奪食) + 재성제인 구응
  const tosik = decideGeokgukFromPillars({ dayStem: '甲', monthBranch: '巳', stems: ['壬', '丙', '戊'], bodyLevel: '중화' });
  assert.equal(tosik.geokgukName, '식신격');
  assert.equal(tosik.verdict, '구응(救應) 성공 · 성격(成格) 회복');

  // 대표 명식 수리: 신약살왕 무구응 파격 vs 살인상생 구원
  const sinYak = decideGeokgukFromPillars({ dayStem: '甲', monthBranch: '申', stems: ['庚', '庚', '辛'], bodyLevel: '극신약' });
  assert.equal(sinYak.geokgukName, '칠살격');
  assert.equal(sinYak.verdict, '파격(破格)');
  const salIn = decideGeokgukFromPillars({ dayStem: '甲', monthBranch: '申', stems: ['庚', '庚', '壬'], bodyLevel: '신약' });
  assert.equal(salIn.verdict, '성격(成格)');
  assert(salIn.seongGyeok !== null && salIn.seongGyeok.title.includes('살인상생'));

  // 월령 성립 원천: 건록/양인 직취
  const geonrok = decideGeokgukFromPillars({ dayStem: '甲', monthBranch: '寅', stems: ['癸', '丙', '癸'], bodyLevel: '신강' });
  assert.equal(geonrok.geokgukName, '건록격');
  const yangIn = decideGeokgukFromPillars({ dayStem: '甲', monthBranch: '卯', stems: ['辛', '癸', '辛'], bodyLevel: '신강' });
  assert.equal(yangIn.geokgukName, '양인격');
  assert.equal(yangIn.shinsalClass, '흉신(惡神) · 역용(逆用)');

  // 관살혼잡 구응: 합살류관(정관격)·재화상(상관격) 및 파격 시 상신 부재
  const ryuGwan = decideGeokgukFromPillars({ dayStem: '辛', monthBranch: '巳', stems: ['丙', '丁', '庚'], bodyLevel: '중화' });
  assert.equal(ryuGwan.verdict, '구응(救應) 성공 · 성격(成格) 회복');
  assert(ryuGwan.guEung.some((g) => g.title.includes('합살류관')));
  const jaeHwa = decideGeokgukFromPillars({ dayStem: '甲', monthBranch: '午', stems: ['己', '丁', '辛'], bodyLevel: '중화' });
  assert.equal(jaeHwa.verdict, '구응(救應) 성공 · 성격(成格) 회복');
  assert(jaeHwa.guEung.some((g) => g.title.includes('재화상')));
  const holJap = decideGeokgukFromPillars({ dayStem: '甲', monthBranch: '申', stems: ['辛', '庚', '壬'], bodyLevel: '신약' });
  assert.equal(holJap.verdict, '파격(破格)');
  assert.equal(holJap.sangSin, null);

  // 결정론성(동일 입력 동일 출력)
  const r2 = calculateGeokguk({ profile });
  assert.deepEqual(r1, r2);

  // 프롬프트 포맷터에 엔진 버전 포함
  const prompt = formatGeokgukPrompt(r1);
  assert(prompt.includes('LUCKEY-GG-v1.0.0'));
  assert(prompt.includes('격국'));
  assert(prompt.includes('상신(相神)') || r1.sangSin === null);

  // 프로필 누락 시 skipped 처리
  const skipped = calculateGeokguk({ profile: null });
  assert.equal(skipped.status, 'skipped');
  assert.match(skipped.note || '', /생년월일/);

  // 결정론 엔진 통합 바인딩
  const report = runDeterministicEngine({ profile, question: '내 격국과 적성 알려줘' });
  assert(report.geokgukResult !== null && report.geokgukResult !== undefined);
  assert.equal(report.geokgukResult?.status, 'calculated');
  assert(report.geokgukResult?.monthCommand !== null && report.geokgukResult?.monthCommand !== undefined);
});

import { calculateTwentyEightMansions, formatTwentyEightMansionsPrompt, TWENTY_EIGHT_MANSIONS_ENGINE_VERSION } from '../src/lib/divination/twentyEightMansionsEngine';

test('28 Mansions: deterministic day-star with weekday-luminary 7-cycle alignment and reference fixtures', () => {
  const at = (iso: string) => calculateTwentyEightMansions({ targetDate: new Date(iso) });

  // 정통 실측표 픽스처: 2026-11-01(일) 묘수·흉, 2026-11-02(월) 필수·길, 기원점 1685-02-04(일) 성수
  const r1102 = at('2026-11-02T00:00:00+09:00');
  assert.equal(r1102.mansion.name, '필');
  assert.equal(r1102.mansion.hanja, '畢');
  assert.equal(r1102.mansion.group, '서방백호(西方白虎)');
  assert.equal(r1102.mansion.luminary, '월(月)');
  assert.equal(r1102.mansion.element, '수(水)'); // 월요 수는 태음진수
  assert.equal(r1102.weekday, '월요일');
  assert.equal(r1102.weekdayLuminary, '월(月)');
  assert.equal(r1102.luminaryWeekdayAligned, true); // 7원 4주기: 직성 칠요 = 요일 칠요
  assert.equal(r1102.dayGanZhi, '경진');
  const r1101 = at('2026-11-01T00:00:00+09:00');
  assert.equal(r1101.mansion.name, '묘');
  assert.equal(r1101.mansion.grade, '흉(凶)');
  assert.equal(r1101.mansion.luminary, '일(日)');
  const anchor = at('1685-02-04T00:00:00+09:00');
  assert.equal(anchor.mansion.name, '성');
  assert.equal(anchor.mansion.hanja, '星');
  assert.equal(anchor.julianDayNumber, 2336529);

  // 결정론: 동일 날짜 → 동일 직성·점수
  assert.deepEqual(r1102, at('2026-11-02T00:00:00+09:00'));
  // UTC 입력도 KST 일자로 정규화 (UTC 00:00 = KST 09:00 → 같은 날)
  assert.equal(at('2026-11-01T00:00:00Z').mansion.name, '묘');
  assert.equal(at('2026-11-01T15:00:00Z').mansion.name, '필'); // KST로 이미 다음 날

  // 28일 주기 순환: 28일 후 같은 직성이며 요일·칠요 일치는 84일(7원) 연속 성립
  for (const iso of ['2026-01-15', '2026-06-20', '2027-02-28']) {
    const t = at(iso + 'T00:00:00+09:00');
    const t28 = at(new Date(new Date(iso + 'T00:00:00+09:00').getTime() + 28 * 86400000).toISOString());
    assert.equal(t28.mansion.name, t.mansion.name);
    assert.equal(t28.mansion.index, t.mansion.index);
  }
  let base = new Date('2026-01-01T00:00:00+09:00').getTime();
  for (let k = 0; k < 84; k++) {
    const r = calculateTwentyEightMansions({ targetDate: new Date(base + k * 86400000) });
    assert.equal(r.luminaryWeekdayAligned, true, `day ${k}`);
    assert.equal(r.mansion.index, (r.julianDayNumber + 11) % 28);
  }
});

test('28 Mansions six-domain scoring: bounds, consistency, 28-day date selection, prompt and engine binding', () => {
  const r = calculateTwentyEightMansions({ targetDate: new Date('2026-11-02T00:00:00+09:00') });
  assert.equal(r.status, 'calculated');
  assert.equal(r.engineVersion, TWENTY_EIGHT_MANSIONS_ENGINE_VERSION);

  // 6대 영역 스코어링 정합성
  assert.equal(r.domainScores.length, 6);
  assert.deepEqual(r.domainScores.map((s) => s.domain), ['contract', 'businessLaunch', 'travel', 'finance', 'relationship', 'healing']);
  for (const s of r.domainScores) {
    assert(s.score >= 5 && s.score <= 98, `${s.domain} score ${s.score}`);
    assert(['대길', '길', '평', '흉', '대흉'].includes(s.grade));
    assert.equal(s.grade, s.score >= 85 ? '대길' : s.score >= 70 ? '길' : s.score >= 55 ? '평' : s.score >= 40 ? '흉' : '대흉');
    assert(s.reason.includes('결정론 수리'));
    assert(s.actionGuide.length > 30);
    assert(s.bestDates.length === 3);
    for (const b of s.bestDates) {
      assert(/^\d{4}-\d{2}-\d{2}$/.test(b.date));
      assert(b.score >= 5 && b.score <= 98);
      assert(/.+\(.\)$/.test(b.mansionName));
    }
    // 최적 후보일은 점수 내림차순
    assert(s.bestDates[0].score >= s.bestDates[1].score && s.bestDates[1].score >= s.bestDates[2].score);
  }
  assert(r.overallVerdict.includes('직성') && r.overallVerdict.includes('7원 4주기'));
  assert(r.overallGuide.length > 30);

  // 프롬프트 포맷터에 엔진 버전·핵심 수어 포함
  const prompt = formatTwentyEightMansionsPrompt(r);
  assert(prompt.includes('LUCKEY-TM-v1.0.0'));
  assert(prompt.includes('천상열차분야지도') && prompt.includes('28수 직성'));
  assert(prompt.includes('필월오(畢月烏)') && prompt.includes('계약·협상') && prompt.includes('휴식·치유·내실'));

  // 결정론 엔진 통합 바인딩 (생년월일 무관 당일 일진 기준 산출)
  const report = runDeterministicEngine({ profile: { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } }, question: '이사 날짜 알려줘' });
  assert(report.twentyEightMansionsResult !== null && report.twentyEightMansionsResult !== undefined);
  assert.equal(report.twentyEightMansionsResult?.status, 'calculated');
  assert(report.twentyEightMansionsResult?.luminaryWeekdayAligned === true);
  const noProfileReport = runDeterministicEngine({ profile: null });
  assert(noProfileReport.twentyEightMansionsResult?.status === 'calculated'); // 프로필 없이도 일진 산출
});


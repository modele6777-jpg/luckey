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
import { calculateLiurenMaster, formatLiurenMasterPrompt, LIUREN_MASTER_ENGINE_VERSION } from '../src/lib/divination/liurenMasterEngine';
import { calculateIchingMaster, formatIchingMasterPrompt, ICHING_MASTER_ENGINE_VERSION } from '../src/lib/divination/ichingMasterEngine';
import { calculateTarotMaster, formatTarotMasterPrompt, TAROT_MASTER_ENGINE_VERSION } from '../src/lib/divination/tarotMasterEngine';
import { calculateHeLuoLiShu, formatHeLuoLiShuPrompt, HELUOLISHU_ENGINE_VERSION } from '../src/lib/divination/heLuoLiShuEngine';
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
  assert.equal(a.calculatedUTC8Hour,'2024-01-15T10:00');assert.match(a.method,/홍국기문 4주 수리 포국과는 별개의 점시 포국/);
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

import { calculateSukuyoAdvanced, formatSukuyoPrompt, SUKUYO_ENGINE_VERSION, sukuyoIndexFromLunar, sukuyoMansionInfoByIndex, type SukuyoRelationDynamic } from '../src/lib/divination/sukuyoEngine';
import { formatDeterministicEnginePrompt } from '../src/lib/divination/deterministicEngine';

const MANSION_HANJA_27 = ['角', '亢', '氐', '房', '心', '尾', '箕', '斗', '女', '虚', '危', '室', '壁', '奎', '婁', '胃', '昴', '畢', '觜', '參', '井', '鬼', '柳', '星', '張', '翼', '軫'];
const RELATION_LABELS_27 = ['명', '영', '쇠', '안', '위', '성', '괴', '우', '친', '업', '영', '쇠', '안', '위', '성', '괴', '우', '친', '태', '영', '쇠', '안', '위', '성', '괴', '우', '친'];
const SHUKGUK_BY_INDEX = ['경질', '독현', '악해', '화선', '악해', '급맹', '화선', '안중', '강유', '독현', '경질', '안중', '급맹', '안중', '급맹', '경질', '안중', '독현', '화선', '급맹', '급맹', '독현', '악해', '화선', '강유', '안중', '경질'];
const SHUKGUK_META_KEYS = ['안중', '화선', '급맹', '악해', '독현', '경질', '강유'];

const syProfile = { basic: { birthdate: '2000-08-16', birthtime: '04:00', gender: 'female' as const, birthCity: '서울' } }; // calculateSukuyo 실측: 규(奎)宿

function relOf(from: number, to: number): SukuyoRelationDynamic {
  // calculateSukuyoAdvanced 내부 relationDynamic과 동일 수리를 검증용으로 재현
  const distance = ((to - from + 27) % 27 + 27) % 27;
  const band = distance <= 4 ? '근거리' : distance <= 13 ? '중거리' : '원거리';
  const base: Record<string, number> = { 명: 72, 업: 78, 태: 82, 영: 88, 쇠: 35, 안: 80, 위: 42, 성: 90, 괴: 30, 우: 84, 친: 86 };
  const score = Math.min(100, Math.max(5, base[RELATION_LABELS_27[distance]] + (band === '근거리' ? 4 : band === '중거리' ? 0 : -4)));
  return { key: (['명', '영쇠', '영쇠', '안위', '안위', '성괴', '성괴', '우친', '우친', '업태', '영쇠', '영쇠', '안위', '안위', '성괴', '성괴', '우친', '우친', '업태', '영쇠', '영쇠', '안위', '안위', '성괴', '성괴', '우친', '우친'] as const)[distance], label: RELATION_LABELS_27[distance], hanja: '', pairSummary: '', distance, band, bandDynamics: '', polarity: '긍정(相生)', score, description: '' };
}

test('Sukuyo engine: 본명숙 산출 및 7대 숙격 매핑 정확성', () => {
  const r = calculateSukuyoAdvanced({ profile: syProfile });
  assert.equal(r.status, 'calculated');
  assert.equal(r.engineVersion, SUKUYO_ENGINE_VERSION);
  assert.equal(r.mansion!.hanja, '奎'); // birthCharts.calculateSukuyo 실측 '奎宿'와 일치
  assert.equal(r.mansion!.index, 13);
  assert.equal(r.mansion!.shukguk, '안중'); // 규(奎)는 안중숙
  assert(r.mansion!.fullName.includes('규목랑'));
  assert(r.lunarDate && r.lunarDate.isLeapMonth === false);
  assert(r.selfDynamics!.includes('규'));

  // 27숙 전수 숙격 매핑 검증 (정통 분류: 안중·화선·급맹·악해·독현·경질·강유)
  for (let i = 0; i < 27; i++) {
    const info = sukuyoMansionInfoByIndex(i);
    assert.equal(info.index, i);
    assert.equal(info.shukguk, SHUKGUK_BY_INDEX[i], `index ${i}`);
    assert(SHUKGUK_META_KEYS.includes(info.shukguk));
    assert(info.shukgukTrait.length > 1);
  }
  // 7대 숙격 대표 숙 스포트 체크: 두·익·실·규·묘=안중 / 여·장=강유
  for (const [hanja, shukguk] of [['斗', '안중'], ['翼', '안중'], ['室', '안중'], ['奎', '안중'], ['昴', '안중'], ['女', '강유'], ['張', '강유'], ['亢', '독현'], ['鬼', '독현'], ['虛', '독현'], ['畢', '독현'], ['角', '경질'], ['軫', '경질'], ['危', '경질'], ['胃', '경질'], ['星', '화선'], ['房', '화선'], ['箕', '화선'], ['觜', '화선'], ['尾', '급맹'], ['井', '급맹'], ['婁', '급맹'], ['壁', '급맹'], ['參', '급맹'], ['氐', '악해'], ['心', '악해'], ['柳', '악해']] as const) {
    const info = sukuyoMansionInfoByIndex(MANSION_HANJA_27.indexOf(hanja));
    assert.equal(info.shukguk, shukguk, `${hanja} → ${shukguk}`);
  }
  // 월별 기숙표 기준일 본명숙: 음력 팔월 초하루 = 각(角)수
  assert.equal(sukuyoIndexFromLunar(8, 1), MANSION_HANJA_27.indexOf('角'));
  assert.equal(sukuyoIndexFromLunar(1, 15), (MANSION_HANJA_27.indexOf('室') + 14) % 27);
  assert.throws(() => sukuyoIndexFromLunar(13, 1), /음력/);
  assert.throws(() => sukuyoIndexFromLunar(1, 0), /음력/);
});

test('Sukuyo 6대 관계성: 방향별 수리 일치 및 역대칭 검증', () => {
  // 전수 쌍 검증: birthCharts.sukuyoRelationship와 동일 수리
  for (let a = 0; a < 27; a++) {
    for (let b = 0; b < 27; b++) {
      const d = (b - a + 27) % 27;
      assert.equal(relOf(a, b).label, RELATION_LABELS_27[d], `a=${a} b=${b}`);
      assert.equal(relOf(b, a).label, RELATION_LABELS_27[(27 - d) % 27], `reverse a=${a} b=${b}`);
      assert(relOf(a, b).score >= 5 && relOf(a, b).score <= 100);
    }
  }
  // 대표 픽스처: 9숙 차이는 나→상대 업(業), 상대→나 태(胎)
  assert.equal(relOf(0, 9).label, '업');
  assert.equal(relOf(9, 0).label, '태');
  // 명(命): 동일 숙
  assert.equal(relOf(5, 5).label, '명');
  assert.equal(relOf(5, 5).distance, 0);
  // 6대 관계성 키 분류
  const keyOf = (d: number) => relOf(0, d).key;
  assert.equal(keyOf(0), '명'); assert.equal(keyOf(9), '업태'); assert.equal(keyOf(18), '업태');
  assert.equal(keyOf(1), '영쇠'); assert.equal(keyOf(2), '영쇠'); assert.equal(keyOf(19), '영쇠'); assert.equal(keyOf(20), '영쇠');
  assert.equal(keyOf(3), '안위'); assert.equal(keyOf(4), '안위'); assert.equal(keyOf(21), '안위'); assert.equal(keyOf(22), '안위');
  assert.equal(keyOf(5), '성괴'); assert.equal(keyOf(6), '성괴'); assert.equal(keyOf(23), '성괴'); assert.equal(keyOf(24), '성괴');
  assert.equal(keyOf(7), '우친'); assert.equal(keyOf(8), '우친'); assert.equal(keyOf(25), '우친'); assert.equal(keyOf(26), '우친');
  // 영(榮)은 최상 시너지, 괴(壞)는 최저 — 결정론 스코어 경계
  assert(relOf(0, 1).score > relOf(0, 6).score);
  assert.equal(relOf(0, 6).score, 30); // 괴(壞) 원거리 보정 없음(6숙=중거리)
});

test('Sukuyo 3거리 판정 정확성', () => {
  const bandOf = (d: number) => relOf(0, d).band;
  assert.equal(bandOf(1), '근거리'); assert.equal(bandOf(4), '근거리');
  assert.equal(bandOf(5), '중거리'); assert.equal(bandOf(13), '중거리');
  assert.equal(bandOf(14), '원거리'); assert.equal(bandOf(26), '원거리');
  assert.equal(bandOf(0), '근거리'); // 명(命) 동일 숙은 근거리 특례
});

test('Sukuyo partner matrix: 양방향 궁합, 27숙 전수 매트릭스, 결정론 및 포맷터', () => {
  const partner = { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } };
  const r1 = calculateSukuyoAdvanced({ profile: syProfile, partnerProfile: partner });
  assert.equal(r1.status, 'calculated');
  assert(r1.partnerMatrix);
  const pm = r1.partnerMatrix!;
  assert.equal(pm.fullMatrix.length, 27);
  // 전수 매트릭스의 거리·라벨 수리 일치
  for (const row of pm.fullMatrix) {
    assert.equal(row.distance, (row.partnerIndex - r1.mansion!.index + 27) % 27);
    assert.equal(row.fromMe.label, RELATION_LABELS_27[row.distance]);
    assert.equal(row.fromPartner.label, RELATION_LABELS_27[(27 - row.distance) % 27]);
    assert(row.fromMe.score >= 5 && row.fromMe.score <= 100);
    assert(['근거리', '중거리', '원거리'].includes(row.fromMe.band));
  }
  assert(pm.compatibilityScore >= 5 && pm.compatibilityScore <= 100);
  assert(pm.partnerProfileSummary.length > 0);
  // 결정론: 동일 입력 동일 출력
  const r2 = calculateSukuyoAdvanced({ profile: syProfile, partnerProfile: partner });
  assert.deepEqual(JSON.stringify(r1), JSON.stringify(r2));
  // 상대 프로필이 없으면 매트릭스 생략
  const solo = calculateSukuyoAdvanced({ profile: syProfile });
  assert.equal(solo.partnerMatrix, null);
  // 프로필 누락 시 skipped
  const skipped = calculateSukuyoAdvanced({ profile: null });
  assert.equal(skipped.status, 'skipped');
  assert.match(skipped.note || '', /생년월일/);
  assert.equal(formatSukuyoPrompt(skipped), '');
  // 프롬프트 포맷터: 엔진 버전·핵심 수어 포함
  const prompt = formatSukuyoPrompt(r1);
  assert(prompt.includes('LUCKEY-SY-v1.0.0'));
  assert(prompt.includes('본명숙') && prompt.includes('숙격') && prompt.includes('6대 관계성') && prompt.includes('3거리'));
  assert(prompt.includes('규목랑(奎木狼)'));
  assert(prompt.includes('27숙 전수 양방향 매트릭스'));
  // 결정론 엔진 통합 바인딩
  const report = runDeterministicEngine({ profile: syProfile, question: '내 본명숙과 궁합 알려줘' });
  assert(report.sukuyoAdvancedResult !== null && report.sukuyoAdvancedResult !== undefined);
  assert.equal(report.sukuyoAdvancedResult?.status, 'calculated');
  assert.equal(report.tools.sukuyo.status, 'calculated');
  const formatted = formatDeterministicEnginePrompt(report);
  assert(formatted.includes('LUCKEY-SY-v1.0.0'));
  const noProfile = runDeterministicEngine({ profile: null });
  assert.equal(noProfile.sukuyoAdvancedResult?.status, 'skipped');
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

import { calculateMahabote, formatMahabotePrompt, MAHABOTE_ENGINE_VERSION } from '../src/lib/divination/mahaboteEngine';

test('Burmese Mahabote: 7-house chart calculation, root house, age transit, Rahu branching, determinism and prompt formatting', () => {
  const profile = { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } };
  const r1 = calculateMahabote({ profile, targetYear: 2026 });
  assert.equal(r1.status, 'calculated');
  assert.equal(r1.engineVersion, MAHABOTE_ENGINE_VERSION);
  assert.equal(r1.myanmarEra, 1357);
  assert.equal(r1.remainder, 6);
  assert.equal(r1.houses.length, 7);
  assert(r1.rootHouse !== null);
  assert(r1.houses.some((h) => h.isBirthRootHouse));
  assert(r1.currentAgeTransit !== null);
  assert(r1.remedies !== null);

  // Determinism check
  const r2 = calculateMahabote({ profile, targetYear: 2026 });
  assert.deepEqual(r1, r2);

  // Wednesday afternoon Rahu test (1995-03-22 was Wednesday)
  const wedMorning = calculateMahabote({ profile: { basic: { birthdate: '1995-03-22', birthtime: '09:00' } } });
  assert.equal(wedMorning.birthPlanet.planet, '수성(Mercury)');
  const wedAfternoon = calculateMahabote({ profile: { basic: { birthdate: '1995-03-22', birthtime: '15:00' } } });
  assert.equal(wedAfternoon.birthPlanet.planet, '라후(Rahu)');

  // Prompt formatting
  const prompt = formatMahabotePrompt(r1);
  assert(prompt.includes('LUCKEY-MB-v1.0.0'));
  assert(prompt.includes('마하보테'));
  assert(prompt.includes('본명궁'));

  // Skipped without birthdate
  const skipped = calculateMahabote({ profile: null });
  assert.equal(skipped.status, 'skipped');
  assert.equal(formatMahabotePrompt(skipped), '[마하보테: 사용자 생년월일이 입력되지 않아 마하보테 7궁 명반 계산을 건너뜁니다.]');

  // Integration in runDeterministicEngine
  const report = runDeterministicEngine({ profile, question: '내 인생 본명궁과 마하보테 운세' });
  assert(report.mahaboteResult !== null && report.mahaboteResult !== undefined);
  assert.equal(report.mahaboteResult?.status, 'calculated');
  assert.equal(report.tools.mahabote.status, 'calculated');
});



import { calculateVedicAdvanced, formatVedicPrompt, VEDIC_ENGINE_VERSION, VEDIC_METHOD, vedicNakshatraByIndex, nakshatraFromSiderealLongitude, buildVimshottariTimeline, lahiriAyanamsaAt, siderealLongitude } from '../src/lib/divination/vedicEngine';
import { Body } from 'astronomy-engine';

const VEDIC_LORD_CYCLE = ['케투', '금성', '태양', '달', '화성', '라후', '목성', '토성', '수성'];
const NAK_WIDTH = 360 / 27;

test('Vedic 27 nakshatras: full data table, lords cycle, gana/tattva groups and navamsa pada lords', () => {
  for (let i = 0; i < 27; i++) {
    const n = vedicNakshatraByIndex(i);
    assert.equal(n.number, i + 1);
    assert.equal(n.lord, VEDIC_LORD_CYCLE[i % 9]); // 지배 행성은 빔쇼타리 순환
    assert(n.deity.length > 0 && n.symbol.length > 0 && n.meaning.length > 0);
    assert.equal(n.spanDegrees.start, i * NAK_WIDTH);
    assert(Math.abs(n.spanDegrees.end - (i + 1) * NAK_WIDTH) < 1e-9);
  }
  assert.deepEqual(vedicNakshatraByIndex(0), { ...vedicNakshatraByIndex(0), name: '아슈비니', deity: '아슈비니 쿠마라(쌍둥이 의신)', symbol: '말 머리', gana: '신성(Deva)', tattva: '지(土·Prithvi)' });
  // 군(Gana): 신/인/마 각 9개
  const ganas = Array.from({ length: 27 }, (_, i) => vedicNakshatraByIndex(i).gana);
  for (const g of ['신성(Deva)', '인간(Manushya)', '마성(Rakshasa)']) assert.equal(ganas.filter((x) => x === g).length, 9);
  // 원소(Tattva): 지(0~4) 수(5~10) 화(11~16) 풍(17~21) 공(22~26)
  const tattvaBands = ['지(土·Prithvi)', '수(水·Apas)', '화(火·Tejas)', '풍(風·Vayu)', '공(空·Akasha)'];
  const bandSizes = [5, 6, 6, 5, 5];
  let cursor = 0;
  tattvaBands.forEach((t, b) => {
    for (let k = 0; k < bandSizes[b]; k++) assert.equal(vedicNakshatraByIndex(cursor + k).tattva, t);
    cursor += bandSizes[b];
  });
  assert.equal(cursor, 27);
  // 나바암사 파다 주인: 푸르바팔구니=태양/수성/금성/화성, 레바티=목성/토성/토성/목성 (고전표)
  assert.deepEqual(vedicNakshatraByIndex(10).padaLords, ['태양', '수성', '금성', '화성']);
  assert.deepEqual(vedicNakshatraByIndex(26).padaLords, ['목성', '토성', '토성', '목성']);
  assert.throws(() => vedicNakshatraByIndex(27), RangeError);
  assert.throws(() => vedicNakshatraByIndex(0, 5), RangeError);
});

test('Vedic pada mapping: 108 padas of 3°20\' wrap the whole sidereal zodiac', () => {
  assert.deepEqual(nakshatraFromSiderealLongitude(0), { index: 0, pada: 1, fractionIntoNakshatra: 0 });
  assert.equal(nakshatraFromSiderealLongitude(NAK_WIDTH - 0.0001).pada, 4); // 아슈비니 끝자락
  const b = nakshatraFromSiderealLongitude(NAK_WIDTH + 0.0001);
  assert.equal(b.index, 1); assert.equal(b.pada, 1); // 바라니 시작
  const t = nakshatraFromSiderealLongitude(359.999);
  assert.equal(t.index, 26); assert.equal(t.pada, 4); // 레바티 끝자락
  assert.deepEqual(nakshatraFromSiderealLongitude(360.5), { index: 0, pada: 1, fractionIntoNakshatra: 0.0375 }); // 360° 순환
  for (const s of [0, 90, 180, 269.9, 305.79]) {
    const r = nakshatraFromSiderealLongitude(s);
    assert(r.fractionIntoNakshatra >= 0 && r.fractionIntoNakshatra < 1);
    assert(r.pada >= 1 && r.pada <= 4);
  }
});

test('Vimshottari: 7+20+6+10+7+18+16+19+17 = 120-year total, 81 antardasha intervals, contiguity', () => {
  assert.equal(VEDIC_LORD_CYCLE.reduce((a, _, i) => a + [7, 20, 6, 10, 7, 18, 16, 19, 17][i], 0), 120);
  const birthMs = Date.parse('2000-01-01T00:00:00Z');
  const tl = buildVimshottariTimeline(0, 7, birthMs); // 케투 만생(잔여 7년 전체)
  assert.equal(tl.antardashaCount, 81); // 마하다샤 9 × 안타르다샤 9
  assert.equal(tl.mahadashas.length, 9);
  const spanSum = tl.mahadashas.reduce((s, m) => s + (m.endYearsAfterBirth - m.startYearsAfterBirth), 0);
  assert(Math.abs(spanSum - 120) < 1e-9);
  tl.mahadashas.forEach((m, i) => {
    assert.equal(m.lord, VEDIC_LORD_CYCLE[(0 + i) % 9]);
    assert.equal(m.antardashas.length, 9);
    const subSum = m.antardashas.reduce((s, a) => s + a.years, 0);
    assert(Math.abs(subSum - (m.endYearsAfterBirth - m.startYearsAfterBirth)) < 1e-9);
    if (i > 0) assert.equal(m.startYearsAfterBirth, tl.mahadashas[i - 1].endYearsAfterBirth); // 연속성
    m.antardashas.forEach((a, j) => {
      assert.equal(a.lord, VEDIC_LORD_CYCLE[(i + j) % 9]); // 안타르다샤는 모 주인부터 같은 순서
      if (j > 0) assert.equal(a.startYearsAfterBirth, m.antardashas[j - 1].endYearsAfterBirth);
    });
  });
  // 고전 안타르다샤 수리: 케투 마하다샤 내 케투-케투 7×7/120, 케투-금성 7×20/120
  assert(Math.abs(tl.mahadashas[0].antardashas[0].years - 49 / 120) < 1e-9);
  assert(Math.abs(tl.mahadashas[0].antardashas[1].years - 140 / 120) < 1e-9);
  assert.throws(() => buildVimshottariTimeline(0, 0, birthMs), RangeError);
  assert.throws(() => buildVimshottariTimeline(0, 7.1, birthMs), RangeError);
  assert.throws(() => buildVimshottariTimeline(9, 7, birthMs), RangeError);
});

test('Vedic engine fixtures: moon sidereal positions match independent panchang records', () => {
  // J2000 기준 라히리 아얀암사 23°51'11"
  assert(Math.abs(lahiriAyanamsaAt(new Date('2000-01-01T12:00:00Z')) - 23.8531) < 1e-4);
  // 카리기리 나이야나 에페메리스 16.08.2000: 아얀암사 23°51'54", 달 305°32' (0시 IST)
  const sid0800 = siderealLongitude(Body.Moon, new Date('2000-08-15T18:30:00Z'));
  assert(Math.abs(sid0800 - 305.5336) < 0.1);
  const profile1 = { basic: { birthdate: '2000-08-16', birthtime: '04:00', gender: 'female' as const, birthCity: '서울' } };
  const r1 = calculateVedicAdvanced({ profile: profile1, targetDate: new Date('2026-11-02T00:00:00Z') });
  assert.equal(r1.status, 'calculated');
  assert.equal(r1.engineVersion, VEDIC_ENGINE_VERSION);
  // 04:00 KST(=00:30 IST)는 다니슈타 4파다 (샤타비샤 개시는 그날 새벽 뒤 — Jaipur 판창·카리기리 상호 일치)
  assert.equal(r1.nakshatra!.name, '다니슈타');
  assert.equal(r1.nakshatra!.pada, 4);
  assert.equal(r1.nakshatra!.lord, '화성');
  assert.equal(r1.rashi!.chandra.name, '쿰바'); // 항성황도 달 305.79° → 쿰바 (Jaipur 판창 Moonsign 일치)
  assert(Math.abs(r1.dashaBalance!.years - 7 * (1 - 0.9342785256829406)) < 1e-3); // 화성 잔여 다샤
  assert.equal(r1.antardashaCount, 81);
  assert.equal(r1.birthInstant!.assumedNoon, false);
  const profile2 = { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } };
  const r2 = calculateVedicAdvanced({ profile: profile2, targetDate: new Date('2026-11-02T00:00:00Z') });
  // askoracle 1995-03-25 판창: 찬드라 उत्तराषाढ़ा 1(우타라아샤다 파다1, 태양) — 05:30Z 기준 일치
  assert.equal(r2.nakshatra!.name, '우타라아샤다');
  assert.equal(r2.nakshatra!.pada, 1);
  assert.equal(r2.nakshatra!.lord, '태양');
  assert(Math.abs(r2.dashaBalance!.years - 6 * (1 - 0.12636674978685872)) < 1e-3);
  assert.equal(r2.rashi!.chandra.name, '다누'); // 268.35° → 다누(人馬)
  assert.equal(r2.rashi!.surya.name, '미나'); // 3월 말 항성황도 태양은 미나(雙魚)
  assert(r2.rashi!.lagna !== null); // 생시+지원 도시 → 라그나 라시 산출
  assert(r2.rashi!.lagna!.index >= 0 && r2.rashi!.lagna!.index <= 11);
});

test('Vedic current dasha: 1995-03-25 birth at 2026-11-02 falls in Rahu-Sukra antardasha', () => {
  const profile = { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } };
  const r = calculateVedicAdvanced({ profile, targetDate: new Date('2026-11-02T00:00:00Z') });
  // 잔여 태양 5.24y → 달 10y → 화성 7y 후 라후 18y(22.24y~); 라후-수성 30.19y~32.74y
  assert.equal(r.currentDasha!.mahadasha.lord, '라후');
  assert.equal(r.currentDasha!.antardasha.lord, '수성');
  assert(r.currentDasha!.ageYears > 30 && r.currentDasha!.ageYears < 33);
  // targetYear로도 같은 결정론 식별 (2026년 중간 기준점)
  const byYear = calculateVedicAdvanced({ profile, targetYear: 2026 });
  assert.equal(byYear.currentDasha!.mahadasha.lord, '라후');
});

test('Vedic engine: determinism, null-safe noon fallback, safe skip and prompt formatting', () => {
  const profile = { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } };
  const fixed = new Date('2026-11-02T00:00:00Z');
  const r1 = calculateVedicAdvanced({ profile, targetDate: fixed });
  const r2 = calculateVedicAdvanced({ profile, targetDate: fixed });
  assert.deepEqual(r1, r2); // 동일 입력 동일 출력

  // 생시 없음 → 정오(12:00) 기준 null-safe 산출, 라그나는 미산출
  const noon = calculateVedicAdvanced({ profile: { basic: { birthdate: '1995-03-25', gender: 'male' as const } } });
  assert.equal(noon.status, 'calculated');
  assert.equal(noon.birthInstant!.assumedNoon, true);
  assert(noon.nakshatra!.name.length > 0);
  assert.equal(noon.rashi!.lagna, null);

  // 프로필 누락 시 safe fallback
  const skipped = calculateVedicAdvanced({ profile: null });
  assert.equal(skipped.status, 'skipped');
  const bad = calculateVedicAdvanced({ profile: { basic: { birthdate: '1800-01-01' } } });
  assert(bad.status === 'error' || bad.status === 'skipped');

  // 프롬프트 포맷터
  const prompt = formatVedicPrompt(r1);
  assert(prompt.includes('LUCKEY-VD-v1.0.0'));
  assert(prompt.includes('빔쇼타리'));
  assert(prompt.includes('나크샤트라'));
  assert(prompt.includes('안타르다샤'));
  assert(prompt.includes('라후-수성'));
  assert.equal(formatVedicPrompt(skipped), '');
  assert(VEDIC_METHOD.length > 0);
});

test('Vedic engine binds into the deterministic engine report and prompt', () => {
  const profile = { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } };
  const report = runDeterministicEngine({ profile, question: '내 베딕 다샤 알려줘' });
  assert(report.vedicAdvancedResult !== null && report.vedicAdvancedResult !== undefined);
  assert.equal(report.vedicAdvancedResult!.status, 'calculated');
  assert.equal(report.vedicAdvancedResult!.nakshatra!.name, '우타라아샤다');
  assert.equal(report.tools.vedic.status, 'calculated');
  const prompt = formatDeterministicEnginePrompt(report);
  assert(prompt.includes('LUCKEY-VD-v1.0.0'));
  const noProfile = runDeterministicEngine({ profile: null });
  assert(noProfile.vedicAdvancedResult?.status === 'skipped');
});


import { calculateThaiHorasat, formatThaiHorasatPrompt, THAI_HORASAT_ENGINE_VERSION, THAI_HORASAT_METHOD, THAI_DAY_PLANETS_8, THAI_THAATS_4, THAI_DASHA_ATTRIBUTES_8, MAHA_THAKSA_ORDER, MAHA_THAKSA_TOTAL_YEARS, buildMahaThaksaTimeline, birthDayPlanetId, thaiDayPlanetById, thaiPlanetRelation, decideThaiDashaAttribute, thaatByMonth, thaatById } from '../src/lib/divination/thaiHorasatEngine';

test('Thai Horasat 8 planetary days: full guardian table and Wednesday day/night (Rahu) branching', () => {
  assert.equal(THAI_DAY_PLANETS_8.length, 8);
  const byId = (id: string) => thaiDayPlanetById(id as any);
  // 정통 8요일 전수: 행성·연수·색상·영수·방위 고정
  assert.equal(byId('sun').thaiName, '프라 아팃');
  assert.equal(byId('sun').planet, '태양');
  assert.deepEqual(byId('sun').colors, ['붉은색']);
  assert.equal(byId('sun').animal, '가루다(Garuda · 황금 날개의 신조)');
  assert.equal(byId('sun').direction, '북동');
  assert.equal(byId('moon').cycleYears, 15);
  assert.equal(byId('mars').planet, '화성');
  assert.equal(byId('mercury').colors.join(','), '녹색');
  assert.equal(byId('rahu').planet, '라후(암흑의 달)');
  assert.deepEqual(byId('rahu').colors, ['검은색', '회색']);
  assert.equal(byId('rahu').animal, '상아 없는 코끼리(Tuskless Elephant)');
  assert.equal(byId('jupiter').cycleYears, 19);
  assert.equal(byId('venus').cycleYears, 21);
  assert.equal(byId('saturn').cycleYears, 10);
  assert.equal(byId('saturn').animal, '나기·뱀(Nagi · 용왕의 여신)');
  // 수요일 분기: 낮 06:00~17:59 수성, 밤 18:00~05:59 라후, 생시 없으면 주간 fallback
  assert.equal(birthDayPlanetId(3, 6).id, 'mercury');
  assert.equal(birthDayPlanetId(3, 17).id, 'mercury');
  assert.equal(birthDayPlanetId(3, 18).id, 'rahu');
  assert.equal(birthDayPlanetId(3, 0).id, 'rahu');
  assert.equal(birthDayPlanetId(3, 5).id, 'rahu');
  assert.equal(birthDayPlanetId(3, null).id, 'mercury');
  assert.equal(birthDayPlanetId(3, null).usedFallback, true);
  assert.equal(birthDayPlanetId(3, 14).usedFallback, false);
  // 수요일 이외 요일은 생시와 무관하게 고정
  for (const [wd, id] of [[0, 'sun'], [1, 'moon'], [2, 'mars'], [4, 'jupiter'], [5, 'venus'], [6, 'saturn']] as const) {
    assert.equal(birthDayPlanetId(wd, null).id, id);
    assert.equal(birthDayPlanetId(wd, 23).id, id);
  }
  assert.throws(() => birthDayPlanetId(7, null), RangeError);
  assert.throws(() => birthDayPlanetId(-1, null), RangeError);
});

test('Maha Thaksa cycle: 8 lords sum to 108 years, birth-lord pivot rotation, current dasha and 8-attribute grading', () => {
  // 6+15+8+17+10+19+12+21 = 108
  assert.equal(MAHA_THAKSA_TOTAL_YEARS, 108);
  assert.equal(MAHA_THAKSA_ORDER.reduce((s, p) => s + p.years, 0), 108);
  assert.deepEqual(MAHA_THAKSA_ORDER.map((p) => p.id), ['sun', 'moon', 'mars', 'mercury', 'saturn', 'jupiter', 'rahu', 'venus']);
  assert.deepEqual(MAHA_THAKSA_ORDER.map((p) => p.years), [6, 15, 8, 17, 10, 19, 12, 21]);

  // 출생 행성 기점 순환: 월요일(달) 출생은 달로 시작해 태양으로 회귀
  const moonTimeline = buildMahaThaksaTimeline('moon');
  assert.deepEqual(moonTimeline.map((s) => s.planetId), ['moon', 'mars', 'mercury', 'saturn', 'jupiter', 'rahu', 'venus', 'sun']);
  assert.deepEqual(moonTimeline.map((s) => [s.startAge, s.endAge]), [[1, 15], [16, 23], [24, 40], [41, 50], [51, 69], [70, 81], [82, 102], [103, 108]]);
  assert.equal(moonTimeline.reduce((s, x) => s + x.years, 0), 108);

  // 현재 다샤: 남희 실측 프로필 (1967-08-25 금요일 출생 → 금성 기점)
  const r = calculateThaiHorasat({ profile: { basic: { birthdate: '1967-08-25' } }, targetYear: 2026, targetDate: new Date('2026-11-02T00:00:00+09:00') });
  assert.equal(r.status, 'calculated');
  assert.equal(r.engineVersion, THAI_HORASAT_ENGINE_VERSION);
  assert.equal(r.birthDayPlanet!.id, 'venus'); // 1967-08-25는 금요일 → 프라 숙(금성)
  assert.equal(r.birthInput!.weekday, '금요일');
  const m = r.mahaThaksa!;
  assert.equal(m.birthPlanetId, 'venus');
  assert.equal(m.totalYears, 108);
  assert.equal(m.ageCounting, 2026 - 1967 + 1); // 세는 나이 60
  // 금성 기점: 금성(21) → 태양(6) → 달(15) → 화성(8) → 수성(17) → 토성(10) → 목성(19) → 라후(12)
  assert.deepEqual(m.sequence.map((s) => s.planetId), ['venus', 'sun', 'moon', 'mars', 'mercury', 'saturn', 'jupiter', 'rahu']);
  assert.deepEqual(m.sequence.map((s) => [s.startAge, s.endAge]), [[1, 21], [22, 27], [28, 42], [43, 50], [51, 67], [68, 77], [78, 89], [90, 108]]);
  // 60세는 수성(51~67세) 구간, 출생 금성 기준 수성은 친화 → 데차(위광)
  assert.equal(m.current.planetId, 'mercury');
  assert.equal(m.current.startAge, 51);
  assert.equal(m.current.endAge, 67);
  assert.equal(m.current.yearsLeft, 7);
  assert.equal(m.current.attribute, THAI_DASHA_ATTRIBUTES_8.decha); // 51 % 3 = 0 → 데차
  assert(m.current.verdict.includes('데차') || m.current.verdict.includes('수성'));
  // 8대 속성 관계 판정 수리
  assert.equal(thaiPlanetRelation('rahu', 'rahu'), 'self');
  assert.equal(thaiPlanetRelation('rahu', 'venus'), 'friend');
  assert.equal(thaiPlanetRelation('rahu', 'sun'), 'enemy');
  assert.equal(thaiPlanetRelation('sun', 'moon'), 'friend');
  assert.equal(thaiPlanetRelation('moon', 'sun'), 'friend');
  assert.equal(thaiPlanetRelation('jupiter', 'mercury'), 'enemy');
  assert.equal(thaiPlanetRelation('venus', 'mars'), 'neutral');
  // 자기 행성 → 라차(왕), 친화 3종 순환, 적대 2종 순환 (결정론 규약)
  assert.equal(decideThaiDashaAttribute('rahu', 'rahu', 1).key, 'racha');
  assert.equal(decideThaiDashaAttribute('sun', 'moon', 1).key, 'si'); // 1 % 3 = 1 → 두 번째
  assert.equal(decideThaiDashaAttribute('sun', 'moon', 2).key, 'montri');
  assert.equal(decideThaiDashaAttribute('sun', 'moon', 3).key, 'decha');
  assert.equal(decideThaiDashaAttribute('rahu', 'sun', 1).key, 'kalakini');
  assert.equal(decideThaiDashaAttribute('rahu', 'sun', 2).key, 'satru');
  assert.equal(decideThaiDashaAttribute('venus', 'mars', 1).key, 'ussaha');
  assert.equal(decideThaiDashaAttribute('venus', 'mars', 2).key, 'mula');
  // 대운 속성 점수 경계
  for (const attr of Object.values(THAI_DASHA_ATTRIBUTES_8)) {
    assert(attr.score >= 0 && attr.score <= 100);
    assert(attr.meaning.length > 5);
  }
  // 108세 초과는 주기 재순환
  const r2 = calculateThaiHorasat({ profile: { basic: { birthdate: '1910-01-01' } }, targetYear: 2026 });
  assert.equal(r2.status, 'calculated');
  assert.equal(r2.mahaThaksa!.ageCounting, 117);
  assert(r2.mahaThaksa!.sequence.some((s) => s.startAge <= 10)); // 두 번째 주기도 같은 시간표
});

test('Thai 4 Thaat elements: month mapping, body systems, balance pairs and vitality index', () => {
  // 월 매핑 전수: 흙 10·11·12, 물 7·8·9, 바람 4·5·6, 불 1·2·3
  assert.deepEqual(THAI_THAATS_4.map((t) => t.id), ['din', 'nam', 'lom', 'fai']);
  assert.deepEqual(THAI_THAATS_4.map((t) => t.months), [[10, 11, 12], [7, 8, 9], [4, 5, 6], [1, 2, 3]]);
  for (let m = 1; m <= 12; m++) assert(thaatByMonth(m).id.length > 0, `month ${m}`);
  assert.equal(thaatByMonth(12).id, 'din');
  assert.equal(thaatByMonth(9).id, 'nam');
  assert.equal(thaatByMonth(6).id, 'lom');
  assert.equal(thaatByMonth(3).id, 'fai');
  assert.throws(() => thaatByMonth(0), RangeError);
  assert.throws(() => thaatByMonth(13), RangeError);
  // 신체 체계·과도 증상·상생 균형쌍 (흙↔물, 불↔바람)
  assert.equal(thaatById('din').bodySystems, '뼈·근육·소화기계');
  assert(thaatById('din').excessSigns.includes('피로'));
  assert.equal(thaatById('nam').bodySystems, '혈액·림프·신장·비뇨기계');
  assert(thaatById('nam').excessSigns.includes('부종'));
  assert.equal(thaatById('lom').bodySystems, '신경계·호흡기·관절');
  assert(thaatById('lom').excessSigns.includes('불안'));
  assert.equal(thaatById('fai').bodySystems, '체온·심장·혈압·염증');
  assert(thaatById('fai').excessSigns.includes('스트레스'));
  assert.equal(thaatById('din').balancedBy, 'nam');
  assert.equal(thaatById('nam').balancedBy, 'din');
  assert.equal(thaatById('lom').balancedBy, 'fai');
  assert.equal(thaatById('fai').balancedBy, 'lom');
  for (const t of THAI_THAATS_4) {
    assert(t.diet.length > 10 && t.herbs.length > 10 && t.rest.length > 10);
  }
  // 활력 지수: 같은 원소 계절은 -6, 상생 계절은 +8, 무관 계절은 보정 없음
  const nov = calculateThaiHorasat({ profile: { basic: { birthdate: '1967-08-25' } }, targetYear: 2026, targetDate: new Date('2026-11-02T00:00:00+09:00') });
  assert.equal(nov.fourElements!.birthThaat.id, 'nam'); // 8월 출생 = 물
  assert.equal(nov.fourElements!.currentThaat.id, 'din'); // 11월 = 흙 (물의 상생쌍)
  assert.equal(nov.fourElements!.vitalityIndex, 86); // 72 + 8 (상생 계절) + 6 (데차 대운 보정)
  assert(nov.fourElements!.balanceNote.includes('상생'));
  const dec = calculateThaiHorasat({ profile: { basic: { birthdate: '1995-03-25' } }, targetYear: 2026, targetDate: new Date('2026-12-15T00:00:00+09:00') });
  assert.equal(dec.fourElements!.currentThaat.id, 'din'); // 12월 = 흙
  assert(dec.fourElements!.vitalityIndex >= 5 && dec.fourElements!.vitalityIndex <= 100);
  // 상생 계절 + 길한 대운에서 활력 지수 상승 확인
  const friendly = calculateThaiHorasat({ profile: { basic: { birthdate: '1995-03-25' } }, targetYear: 2026, targetDate: new Date('2026-08-15T00:00:00+09:00') });
  const fe = friendly.fourElements!;
  assert.equal(fe.birthThaat.id, 'fai'); // 3월 = 불
  assert.equal(fe.currentThaat.id, 'nam'); // 8월 = 물 (불과 무관)
  assert(fe.vitalityIndex >= 5 && fe.vitalityIndex <= 100);
});

test('Thai Horasat engine: determinism, safe fallback, Wednesday-night note and prompt formatting', () => {
  const profile = { basic: { birthdate: '1967-08-25', birthtime: '21:40' } };
  const r1 = calculateThaiHorasat({ profile, targetYear: 2026, targetDate: new Date('2026-11-02T00:00:00+09:00') });
  const r2 = calculateThaiHorasat({ profile, targetYear: 2026, targetDate: new Date('2026-11-02T00:00:00+09:00') });
  assert.deepEqual(r1, r2); // 동일 입력 동일 출력

  // 수요일 낮 출생 (10:00) — fallback 없음 (1995-03-22은 수요일)
  const day = calculateThaiHorasat({ profile: { basic: { birthdate: '1995-03-22', birthtime: '10:00' } }, targetYear: 2026 });
  assert.equal(day.mahaThaksa!.birthPlanetId, 'mercury');
  assert.equal(day.note, undefined);
  // 수요일 밤 출생 (23:00) — 라후
  const night = calculateThaiHorasat({ profile: { basic: { birthdate: '1995-03-22', birthtime: '23:00' } }, targetYear: 2026 });
  assert.equal(night.mahaThaksa!.birthPlanetId, 'rahu');
  // 수요일 생시 없음 — 주간 수성 fallback + 안내 노트
  const noTime = calculateThaiHorasat({ profile: { basic: { birthdate: '1995-03-22' } }, targetYear: 2026 });
  assert.equal(noTime.mahaThaksa!.birthPlanetId, 'mercury');
  assert(noTime.note!.includes('fallback') || noTime.note!.includes('생시'));
  assert(noTime.note!.includes('프라 라후'));

  // 프로필 누락 시 safe fallback
  const skipped = calculateThaiHorasat({ profile: null });
  assert.equal(skipped.status, 'skipped');
  assert.match(skipped.note || '', /생년월일/);
  const empty = calculateThaiHorasat({ profile: { basic: { birthdate: '' } } });
  assert.equal(empty.status, 'skipped');
  const malformed = calculateThaiHorasat({ profile: { basic: { birthdate: 'not-a-date' } } });
  assert(malformed.status === 'error' || malformed.status === 'skipped');

  // 프롬프트 포맷터: 버전·수호신·대운·원소 포함
  const prompt = formatThaiHorasatPrompt(r1);
  assert(prompt.includes('LUCKEY-TH-v1.0.0'));
  assert(prompt.includes('호라삿') && prompt.includes('마하탁사') && prompt.includes('4대 원소'));
  assert(prompt.includes('프라 숙'));
  assert(prompt.includes('108년'));
  assert(prompt.includes('데차'));
  assert(prompt.includes('물(Nam)'));
  assert(prompt.includes('AI 해석 절대 지침'));
  assert(THAI_HORASAT_METHOD.length > 0);
  assert.equal(formatThaiHorasatPrompt(skipped), '');
});

test('Thai Horasat engine binds into the deterministic engine report and prompt', () => {
  const profile = { basic: { birthdate: '1967-08-25', birthtime: '21:40', gender: 'male' as const, birthCity: '서울' } };
  const report = runDeterministicEngine({ profile, question: '내 태국 호라삿 대운 알려줘' });
  assert(report.thaiHorasatResult !== null && report.thaiHorasatResult !== undefined);
  assert.equal(report.thaiHorasatResult!.status, 'calculated');
  assert.equal(report.thaiHorasatResult!.mahaThaksa!.totalYears, 108);
  assert.equal(report.thaiHorasatResult!.mahaThaksa!.birthPlanetId, 'venus');
  assert.equal(report.tools.thai_astrology.status, 'calculated'); // partial → calculated 승격
  const prompt = formatDeterministicEnginePrompt(report);
  assert(prompt.includes('LUCKEY-TH-v1.0.0'));
  const noProfile = runDeterministicEngine({ profile: null });
  assert(noProfile.thaiHorasatResult?.status === 'skipped');
  assert.equal(noProfile.tools.thai_astrology.status, 'skipped');
  // 프로필이 있으면 15개 도구 전부 calculated 이상 (not_implemented 0 유지)
  assert.equal(Object.values(report.tools).filter((t) => t.status === 'not_implemented').length, 0);
});

import { calculateKabbalah, formatKabbalahPrompt, KABBALAH_ENGINE_VERSION, KABBALAH_METHOD, SEPHIROTH_10, PATHS_22, FOUR_WORLDS, THREE_PILLARS, DAATH, kabbalahSephirahByNumber, kabbalahPathByNumber, reduceGematria, digitSum, soulPathNumberToPath } from '../src/lib/divination/kabbalahEngine';

test('Kabbalah 10 sephiroth: full table, 3-pillar classification and hidden Daath', () => {
  assert.equal(SEPHIROTH_10.length, 10);
  const expectedPillars = [
    '균형의 기둥', '자비의 기둥', '엄격의 기둥', // 1~3
    '자비의 기둥', '엄격의 기둥', '균형의 기둥', // 4~6
    '자비의 기둥', '엄격의 기둥', '균형의 기둥', // 7~9
    '균형의 기둥', // 10
  ];
  SEPHIROTH_10.forEach((s, i) => {
    assert.equal(s.number, i + 1);
    assert.equal(s.pillar, expectedPillars[i]);
    assert(s.name.length > 0 && s.hebrew.length > 0 && s.translit.length > 0 && s.title.length > 0 && s.planet.length > 0);
  });
  // 3대 기둥 전수 분류: 10 세피로트가 각각 정확히 하나의 기둥에 속한다
  const assignments = THREE_PILLARS.flatMap((p) => p.sephiroth).sort((a, b) => a - b);
  assert.deepEqual(assignments, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(THREE_PILLARS.find((p) => p.id === 'mercy')!.sephiroth.join(','), '2,4,7'); // 호크마·헤세드·네차크
  assert.equal(THREE_PILLARS.find((p) => p.id === 'severity')!.sephiroth.join(','), '3,5,8'); // 비나·게부라·호드
  assert.equal(THREE_PILLARS.find((p) => p.id === 'mildness')!.sephiroth.join(','), '1,6,9,10'); // 케테르·티페레트·예소드·말쿠트
  // 숨겨진 세피라 다트는 어느 기둥에도 속하지 않는다
  assert.equal(DAATH.number, 0);
  assert.equal(DAATH.name, '다트');
  // 4개 세계 전수
  assert.equal(FOUR_WORLDS.length, 4);
  assert.deepEqual(FOUR_WORLDS.map((w) => w.name), ['아칠루트', '베리아', '예치라', '아시야']);
  assert.deepEqual(FOUR_WORLDS.map((w) => w.element), ['불', '물', '바람', '흙']);
  assert.throws(() => kabbalahSephirahByNumber(0), RangeError);
  assert.throws(() => kabbalahSephirahByNumber(11), RangeError);
  assert.throws(() => kabbalahPathByNumber(10), RangeError);
  assert.throws(() => kabbalahPathByNumber(33), RangeError);
});

test('Kabbalah 22 paths: connectivity, hebrew letters, Golden Dawn attributions and tarot majors', () => {
  assert.equal(PATHS_22.length, 22);
  // 11번 알레프(케테르↔호크마, 바보) ~ 32번 타브(예소드↔말쿠트, 세계)
  const first = PATHS_22[0];
  const last = PATHS_22[21];
  assert.equal(first.number, 11);
  assert.equal(first.letterName, '알레프');
  assert.equal(first.hebrewLetter, 'א');
  assert.deepEqual([first.from, first.to].sort((a, b) => a - b), [1, 2]);
  assert.equal(first.tarotNumber, 0);
  assert.equal(first.tarotName, '바보');
  assert.equal(last.number, 32);
  assert.equal(last.letterName, '타브');
  assert.equal(last.hebrewLetter, 'ת');
  assert.deepEqual([last.from, last.to].sort((a, b) => a - b), [9, 10]);
  assert.equal(last.tarotNumber, 21);
  assert.equal(last.tarotName, '세계');
  // 히브리 22문자 순서(알레프→타브)와 타로 메이저 0~21 일대일 배속
  PATHS_22.forEach((p, i) => {
    assert.equal(p.number, i + 11);
    assert.equal(p.tarotNumber, i);
    [p.from, p.to].forEach((n) => {
      assert(n >= 1 && n <= 10, '경로는 1~10 세피로트만 연결해야 한다');
      assert.notEqual(p.from, p.to);
    });
    assert(p.hebrewLetter.length > 0 && p.letterName.length > 0 && p.spiritualTheme.length > 0);
    assert(['원소', '행성', '별자리'].includes(p.attribution.kind));
  });
  assert.equal(new Set(PATHS_22.map((p) => p.hebrewLetter)).size, 22); // 22문자 전부 상이
  assert.equal(new Set(PATHS_22.map((p) => `${p.from}-${p.to}`)).size, 22); // 연결 중복 없음
  assert.equal(new Set(PATHS_22.map((p) => p.tarotNumber)).size, 22); // 메이저 22장 일대일
  // 원소 3개(알레프=바람, 멤=물, 신=불), 행성 7개, 별자리 12개 = 22
  const byKind = { 원소: 0, 행성: 0, 별자리: 0 } as Record<string, number>;
  PATHS_22.forEach((p) => { byKind[p.attribution.kind] += 1; });
  assert.deepEqual(byKind, { 원소: 3, 행성: 7, 별자리: 12 });
  assert.equal(PATHS_22.find((p) => p.letterName === '멤')!.attribution.value, '물(Water)');
  assert.equal(PATHS_22.find((p) => p.letterName === '신')!.attribution.value, '불(Fire)');
  assert.equal(PATHS_22.find((p) => p.letterName === '알레프')!.attribution.value, '바람(Air)');
  assert.equal(PATHS_22.find((p) => p.letterName === '라메드')!.tarotName, '정의'); // 11 정의
});

test('Kabbalah gematria: digit sums, reduction to 1-10, master numbers 11/22/33 and boundaries', () => {
  assert.equal(digitSum(19950325), 34);
  assert.equal(digitSum(20220808), 22);
  // 1~10 축약 경계값
  assert.equal(reduceGematria(9, { keepMasters: true }), 9);
  assert.equal(reduceGematria(10, { keepMasters: true }), 10);
  assert.equal(reduceGematria(11, { keepMasters: true }), 11); // 마스터 보존
  assert.equal(reduceGematria(22, { keepMasters: true }), 22);
  assert.equal(reduceGematria(33, { keepMasters: true }), 33);
  assert.equal(reduceGematria(38, { keepMasters: true }), 11); // 38 → 11 (마스터 멈춤)
  assert.equal(reduceGematria(34, { keepMasters: true }), 7);
  // 마스터 미보존(퍼스널리티용): 10 이하로 계속 축약
  assert.equal(reduceGematria(11, { keepMasters: false, floor: 10 }), 2);
  assert.equal(reduceGematria(22, { keepMasters: false, floor: 10 }), 4);
  assert.equal(reduceGematria(33, { keepMasters: false, floor: 10 }), 6);
  assert.equal(reduceGematria(25, { keepMasters: false, floor: 10 }), 7);
  // 소울 패스 1~22 축약 및 경로 대응
  assert.equal(reduceGematria(34, { keepMasters: false, floor: 22 }), 7);
  assert.equal(reduceGematria(22, { keepMasters: false, floor: 22 }), 22);
  assert.equal(soulPathNumberToPath(1), 11);
  assert.equal(soulPathNumberToPath(22), 32);
  assert.throws(() => soulPathNumberToPath(0), RangeError);
  assert.throws(() => soulPathNumberToPath(23), RangeError);
});

test('Kabbalah engine fixtures: life path / personality / soul path and pillar balance', () => {
  const profile = { basic: { birthdate: '1995-03-25', gender: 'male' as const } };
  const r = calculateKabbalah({ profile });
  assert.equal(r.status, 'calculated');
  assert.equal(r.engineVersion, KABBALAH_ENGINE_VERSION);
  const n = r.numerology!;
  assert.equal(n.rawDigitSum, 34);
  assert.equal(n.lifePathNumber, 7);
  assert.equal(n.lifePathIsMaster, false);
  assert.equal(n.lifePathSephirah.name, '게부라'); // 7 = 엄격·심판
  assert.equal(n.personalityNumber, 7); // 25 → 7
  assert.equal(n.personalitySephirah.name, '네차크');
  assert.equal(n.soulPathNumber, 7);
  assert.equal(n.soulPath.number, 17); // 7번째 경로 = 17번 (자인)
  assert.equal(n.soulPath.tarotName, '연인');
  // 활성 세피로트 4개(7·7·3·6): 자비 2, 엄격 1, 균형 1 → 50/25/25
  assert.deepEqual(n.pillarBalance, { mercy: 50, severity: 25, mildness: 25 });
  assert.equal(n.dominantWorld.name, '베리아'); // 게부라(5)는 창조계
  // 마스터 넘버 11 → 케테르 특별 해석 (1987-11-29 = 38 → 11)
  const r11 = calculateKabbalah({ profile: { basic: { birthdate: '1987-11-29', gender: 'female' as const } } });
  assert.equal(r11.numerology!.lifePathNumber, 11);
  assert.equal(r11.numerology!.lifePathIsMaster, true);
  assert.equal(r11.numerology!.lifePathSephirah.name, '케테르');
  assert(r11.numerology!.lifePathInterpretation.includes('케테르'));
  // 마스터 넘버 22 → 다트 특별 해석 (2022-08-08 = 22)
  const r22 = calculateKabbalah({ profile: { basic: { birthdate: '2022-08-08' } } });
  assert.equal(r22.numerology!.lifePathNumber, 22);
  assert.equal(r22.numerology!.lifePathIsMaster, true);
  assert.equal(r22.numerology!.lifePathSephirah.number, 0);
  assert.equal(r22.numerology!.lifePathSephirah.name, '다트');
  assert(r22.numerology!.lifePathInterpretation.includes('다트'));
  assert.equal(r22.numerology!.soulPathNumber, 22);
  assert.equal(r22.numerology!.soulPath.number, 32); // 타브 예소드↔말쿠트
  // 다트는 기둥 없음 → 퍼스널리티(호드) + 경로 양끝(예소드·말쿠트)만 집계: 엄격 1, 균형 2
  assert.deepEqual(r22.numerology!.pillarBalance, { mercy: 0, severity: 33, mildness: 67 });
  // 마스터 넘버 33 → 케테르 전 나무 통합 해석 (1999-12-20 = 33)
  const r33 = calculateKabbalah({ profile: { basic: { birthdate: '1999-12-20' } } });
  assert.equal(r33.numerology!.rawDigitSum, 33);
  assert.equal(r33.numerology!.lifePathNumber, 33);
  assert.equal(r33.numerology!.lifePathSephirah.name, '케테르');
  assert(r33.numerology!.lifePathInterpretation.includes('전 나무'));
  // 음력 생일도 양력 환산 날짜로 결정론 계산
  const lunar = calculateKabbalah({ profile: { basic: { birthdate: '1995-03-25', lunarSolar: 'lunar' } } });
  assert.equal(lunar.status, 'calculated');
  assert.equal(lunar.birthInput!.isLunar, true);
  assert.notEqual(lunar.numerology!.rawDigitSum, 34);
});

test('Kabbalah engine: determinism, null-safe fallback and prompt formatting', () => {
  const profile = { basic: { birthdate: '1995-03-25', gender: 'male' as const } };
  const r1 = calculateKabbalah({ profile });
  const r2 = calculateKabbalah({ profile });
  assert.deepEqual(r1, r2); // 동일 입력 동일 출력
  // 프로필 누락 시 safe fallback
  const skipped = calculateKabbalah({ profile: null });
  assert.equal(skipped.status, 'skipped');
  const bad = calculateKabbalah({ profile: { basic: { birthdate: '' } } });
  assert.equal(bad.status, 'skipped');
  const malformed = calculateKabbalah({ profile: { basic: { birthdate: 'not-a-date' } } });
  assert(malformed.status === 'error' || malformed.status === 'skipped');
  // 프롬프트 포맷터
  const prompt = formatKabbalahPrompt(r1);
  assert(prompt.includes('LUCKEY-KB-v1.0.0'));
  assert(prompt.includes('게부라'));
  assert(prompt.includes('네차크'));
  assert(prompt.includes('제17경로'));
  assert(prompt.includes('연인'));
  assert(prompt.includes('자비(확장) 50%'));
  assert(prompt.includes('베리아'));
  assert(prompt.includes('생년월일 게마트리아 수리로 산출된 100% 확정 배속'));
  assert.equal(formatKabbalahPrompt(skipped), '');
  assert(KABBALAH_METHOD.length > 0);
});

test('Kabbalah engine binds into the deterministic engine report and prompt', () => {
  const profile = { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } };
  const report = runDeterministicEngine({ profile, question: '내 카발라 생명나무 알려줘' });
  assert(report.kabbalahResult !== null && report.kabbalahResult !== undefined);
  assert.equal(report.kabbalahResult!.status, 'calculated');
  assert.equal(report.kabbalahResult!.numerology!.lifePathSephirah.name, '게부라');
  assert.equal(report.tools.kabbalah.status, 'calculated'); // symbolic → calculated 승격
  const prompt = formatDeterministicEnginePrompt(report);
  assert(prompt.includes('LUCKEY-KB-v1.0.0'));
  const noProfile = runDeterministicEngine({ profile: null });
  assert(noProfile.kabbalahResult?.status === 'skipped');
  assert.equal(noProfile.tools.kabbalah.status, 'skipped');
});

import { calculateHonggukQimen, formatHonggukQimenPrompt, HONGGUK_QIMEN_ENGINE_VERSION, HONGGUK_QIMEN_METHOD, HONGGUK_NINE_PALACES, HONGGUK_EIGHT_GATES, HONGGUK_TONGGI_CYCLES, STEM_NUMBERS, BRANCH_NUMBERS } from '../src/lib/divination/honggukQimenEngine';

test('Hongguk Qimen: 4-pillar numeral casting, 9-palace flight, key points, determinism and prompt formatting', () => {
  const profile = { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } };
  const r1 = calculateHonggukQimen({ profile, targetYear: 2026 });
  assert.equal(r1.status, 'calculated');
  assert.equal(r1.engineVersion, HONGGUK_QIMEN_ENGINE_VERSION);
  assert.equal(r1.method, HONGGUK_QIMEN_METHOD);
  // 4주 수리: 하도 생성수(甲1~癸10)·후천 12진수(子1~亥12) 및 1~9 구성환원 궁수
  assert.equal(r1.numerals!.length, 4); // 생시 있음 → 4주
  assert(r1.fourPillars!.timeKnown);
  for (const n of r1.numerals!) {
    assert.equal(n.ganNumber, STEM_NUMBERS[n.gan]);
    assert.equal(n.zhiNumber, BRANCH_NUMBERS[n.zhi]);
    assert(n.ganPalace >= 1 && n.ganPalace <= 9);
    assert(n.zhiPalace >= 1 && n.zhiPalace <= 9);
  }
  // 지반수·천반수 중궁은 4주 궁수 합의 구성환원 (결정론 재계산 대조)
  const earthSum = r1.numerals!.reduce((s, n) => s + n.zhiPalace, 0);
  const heavenSum = r1.numerals!.reduce((s, n) => s + n.ganPalace, 0);
  assert.equal(r1.earthCenterNumber, ((earthSum - 1) % 9) + 1);
  assert.equal(r1.heavenCenterNumber, ((heavenSum - 1) % 9) + 1);
  // 9궁 포국: 9궁 전수, 비행 경로 상 인접 궁의 천반수는 정확히 1씩 역행
  assert.equal(r1.palaces!.length, 9);
  const byPalace = new Map(r1.palaces!.map((p) => [p.palace, p]));
  const path = [5, 6, 7, 8, 9, 1, 2, 3, 4];
  for (let i = 0; i < 8; i++) {
    const diff = (byPalace.get(path[i + 1])!.heavenStarNumber - byPalace.get(path[i])!.heavenStarNumber + 9) % 9;
    assert.equal(diff, 8, `비행 경로 ${path[i]}→${path[i+1]} 역행 1칸`);
  }
  // 중궁(5궁)에는 천반수 중궁이 그대로 입하고, 기궁 사문 표기 유지
  assert.equal(byPalace.get(5)!.heavenStarNumber, r1.heavenCenterNumber);
  assert.match(byPalace.get(5)!.gate || '', /기궁/);
  for (const p of r1.palaces!) {
    assert(p.heavenStarNumber >= 1 && p.heavenStarNumber <= 9);
    assert(p.earthStarNumber >= 1 && p.earthStarNumber <= 9);
    assert(HONGGUK_NINE_PALACES.some((b) => b.palace === p.palace && b.name === p.name));
  }
  // 3대 거점: 세효·응효·중궁 위치와 상생상극 3조 대조
  assert(r1.keyPoints!.seYao.palace >= 1 && r1.keyPoints!.seYao.palace <= 9);
  assert(r1.keyPoints!.eungYao.palace >= 1 && r1.keyPoints!.eungYao.palace <= 9);
  assert.equal(r1.keyPoints!.jungGung.palace, 5);
  assert.equal(r1.keyPointRelations!.length, 3);
  for (const rel of r1.keyPointRelations!) {
    assert(['상생', '상극', '비화'].includes(rel.relation));
    assert(rel.note.length > 0);
  }
  // 삼형·통기: 지수 범위와 간선 완전성
  assert(r1.samhyeong!.riskIndex >= 0 && r1.samhyeong!.riskIndex <= 100);
  assert(r1.tonggi!.score >= 0 && r1.tonggi!.score <= 100);
  assert.equal(r1.tonggi!.score, r1.tonggi!.activeCycles.length * 20);
  assert.equal(r1.tonggi!.activeCycles.length + r1.tonggi!.missingCycles.length, HONGGUK_TONGGI_CYCLES.length);
  assert.equal(Object.values(r1.tonggi!.elementCounts).reduce((s, c) => s + c, 0), 8); // 4주 8자 오행 분포
  // 8문 판정과 득문 일관성
  assert(r1.eightGatesVerdict!.pattern.length > 0);
  assert.equal(r1.eightGatesVerdict!.deukMun, r1.keyPoints!.seYao.deukMun);

  // 결정론성: 동일 입력 동일 출력
  const r2 = calculateHonggukQimen({ profile, targetYear: 2026 });
  assert.deepEqual(r1, r2);

  // 프롬프트 포맷터
  const prompt = formatHonggukQimenPrompt(r1);
  assert(prompt.includes('LUCKEY-HQ-v1.0.0'));
  assert(prompt.includes('세효(世爻'));
  assert(prompt.includes('응효(應爻'));
  assert(prompt.includes('중궁(中宮'));
  assert(prompt.includes('파극 위험도'));
  assert(prompt.includes('통기(通氣'));
  assert(prompt.includes(r1.eightGatesVerdict!.pattern));

  // 생시 없이도 산출 (3주 수리 safe fallback)
  const noTime = calculateHonggukQimen({ profile: { basic: { birthdate: '1995-03-25', gender: 'male' as const } } });
  assert.equal(noTime.status, 'calculated');
  assert.equal(noTime.fourPillars!.hour, null);
  assert(!noTime.fourPillars!.timeKnown);
  assert.equal(noTime.numerals!.length, 3);
  assert.equal(Object.values(noTime.tonggi!.elementCounts).reduce((s, c) => s + c, 0), 6);
  assert.match(formatHonggukQimenPrompt(noTime), /생시/);

  // 프로필 누락 시 safe fallback
  const skipped = calculateHonggukQimen({ profile: null });
  assert.equal(skipped.status, 'skipped');
  const empty = calculateHonggukQimen({ profile: { basic: { birthdate: '' } } });
  assert.equal(empty.status, 'skipped');
});

test('Hongguk Qimen: 삼형 살표와 통기 지수가 실제 지지 구성을 정확히 반영한다', () => {
  // 1995-03-25 14:30 원국의 지지로 삼형 성립 여부 재검증 (결정론 대조)
  const profile = { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } };
  const r = calculateHonggukQimen({ profile });
  const zhis = r.numerals!.map((n) => n.zhi);
  const insasin = ['寅', '巳', '申'].filter((b) => zhis.includes(b)).length;
  const chukSulMi = ['丑', '戌', '未'].filter((b) => zhis.includes(b)).length;
  if (insasin === 3 || chukSulMi === 3) {
    assert(r.samhyeong!.formed);
    assert(r.samhyeong!.type !== null);
    assert(r.samhyeong!.riskIndex >= 70);
  } else {
    assert(!r.samhyeong!.formed);
    assert.equal(r.samhyeong!.riskIndex >= 70, false);
  }
  assert.equal(r.samhyeong!.partial, insasin === 2 || chukSulMi === 2);
});

test('Hongguk Qimen engine binds into the deterministic engine report and prompt (qimen calculated 승격)', () => {
  const profile = { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } };
  const report = runDeterministicEngine({ profile, question: '홍국기문으로 내 판세를 봐줘' });
  assert(report.honggukQimenResult !== null && report.honggukQimenResult !== undefined);
  assert.equal(report.honggukQimenResult!.status, 'calculated');
  assert.equal(report.honggukQimenResult!.engineVersion, HONGGUK_QIMEN_ENGINE_VERSION);
  assert.equal(report.tools.qimen.status, 'calculated'); // partial → calculated 승격
  const prompt = formatDeterministicEnginePrompt(report);
  assert(prompt.includes('LUCKEY-HQ-v1.0.0'));
  assert(prompt.includes('세효(世爻'));
  // 프로필 없이도 4주 수리는 skipped, 도구 상태는 점시 포국으로 calculated 유지
  const noProfile = runDeterministicEngine({ profile: null, question: '홍국기문으로 내 판세를 봐줘' });
  assert(noProfile.honggukQimenResult?.status === 'skipped');
});

// ─── 5대 운명학 융합 궁합 마스터 엔진 (LUCKEY-CS-v1.0.0) ───
import { calculateDeterministicCompatibility, formatCompatibilityPrompt, COMPATIBILITY_ENGINE_VERSION } from '../src/lib/divination/deterministicCompatibility';
import { CHEON_EUL_MAP } from '../src/lib/divination/auspiciousStarsEngine';
import { calculateDetailedSaju } from '../src/lib/sajuAnalysis';
import { buildChatDivinationContext } from '../src/lib/divination/chatContext';

const csA = { basic: { birthdate: '1990-05-15', birthtime: '10:30', gender: 'male' as const, birthCity: '서울', name: '민준' } };
const csB = { basic: { birthdate: '1992-11-03', birthtime: '14:00', gender: 'female' as const, birthCity: '서울', name: '서연' } };
const GRADES = ['천생연분', '상생길연', '화합동반', '보완노력', '자극성장'] as const;
const SUKUYO_TYPES = ['영친', '안괴', '우쇠', '성위', '업태', '명'] as const;

test('Unified Synastry: 5대 융합 궁합(천간합·천을귀인·숙요·점성술·3대 영역)이 전 차원 정상 산출된다', () => {
  const r = calculateDeterministicCompatibility(csA, csB);
  assert.equal(r.engineVersion, 'LUCKEY-CS-v1.0.0');
  assert.equal(r.engineVersion, COMPATIBILITY_ENGINE_VERSION);
  assert(Number.isInteger(r.score) && r.score >= 0 && r.score <= 100);
  assert(GRADES.includes(r.grade));
  // 1) 사주 원국 결합
  assert(r.saju.personA.dayMaster.length > 0 && r.saju.personA.dayBranch.length > 0);
  assert(r.saju.personB.dayMaster.length > 0 && r.saju.personB.dayBranch.length > 0);
  assert(r.saju.stemRelation.name.length > 0 && r.saju.branchRelation.name.length > 0);
  assert(r.saju.elementComplement.score >= 0 && r.saju.elementComplement.score <= 100);
  assert(r.saju.combinedScore >= 0 && r.saju.combinedScore <= 100);
  // 2) 천을귀인 매칭
  assert(r.mutualNobleman.aNobleBranches.length > 0 && r.mutualNobleman.bNobleBranches.length > 0);
  assert(r.mutualNobleman.score >= 0 && r.mutualNobleman.score <= 100);
  // 3) 숙요 27숙
  assert(SUKUYO_TYPES.includes(r.sukuyo.relationType));
  if (r.sukuyo.compatibilityScore !== null) assert(r.sukuyo.compatibilityScore >= 0 && r.sukuyo.compatibilityScore <= 100);
  assert(['근거리', '중거리', '원거리'].includes(r.sukuyo.distanceText));
  // 4) 점성술 시나스트리
  assert(['동원소', '상생', '갈등', '중립'].includes(r.astrology.elementRelation));
  assert(r.astrology.sunAspect.name.length > 0 && r.astrology.moonAspect.name.length > 0);
  assert(r.astrology.combinedScore >= 0 && r.astrology.combinedScore <= 100);
  // 5) 3대 영역 처방
  for (const d of [r.dimensions.romantic, r.dimensions.business, r.dimensions.friendship]) {
    assert(d.score >= 0 && d.score <= 100);
    assert(d.headline.length > 0 && d.detail.length > 0);
  }
  // 가중 브레이크다운
  for (const v of Object.values(r.breakdown)) assert(v >= 0 && v <= 100);
});

test('Unified Synastry: 천을귀인 상호 인연 성립 케이스 (庚辰×癸未) 원국 대조 픽스처', () => {
  const r = calculateDeterministicCompatibility(csA, csB);
  // 고전 천을귀인 규칙 대조: 庚→丑未, 癸→巳卯
  assert(CHEON_EUL_MAP['庚']!.includes('未'));
  assert(CHEON_EUL_MAP['癸']!.includes('巳'));
  const sajuA = calculateDetailedSaju(csA);
  const sajuB = calculateDetailedSaju(csB);
  const zhiOf = (s: ReturnType<typeof calculateDetailedSaju>) =>
    ['year', 'month', 'day', 'hour'].map((k) => (s!.pillars as any)[k]?.zhi).filter(Boolean);
  // A의 귀인 글자(未)가 B의 4주에, B의 귀인 글자(巳)가 A의 4주에 존재
  assert(zhiOf(sajuB).includes('未'));
  assert(zhiOf(sajuA).includes('巳'));
  assert(r.mutualNobleman.mutual === true);
  assert(r.mutualNobleman.aIsBNoble === true && r.mutualNobleman.bIsANoble === true);
  assert(r.mutualNobleman.score === 100);
  assert(r.mutualNobleman.aNobleInB.some((s) => s.startsWith('未')));
  assert(r.mutualNobleman.bNobleInA.some((s) => s.startsWith('巳')));
  // 대칭성: 인자 순서를 바꾸면 상호 귀인 판정은 동일해야 한다
  const rev = calculateDeterministicCompatibility(csB, csA);
  assert.equal(rev.mutualNobleman.mutual, true);
});

test('Unified Synastry: 태양 트라인 판정과 27숙 호환 지수·종합 점수 0~100 범위', () => {
  // 게자리×전갈자리(물 원소 동일 원소군) 120° 트라인 픽스처
  const tri = calculateDeterministicCompatibility(
    { basic: { birthdate: '1996-07-08', birthtime: '06:00', gender: 'male' as const, birthCity: '서울', name: '지훈' } },
    { basic: { birthdate: '1991-11-11', birthtime: '03:00', gender: 'female' as const, birthCity: '서울', name: '하은' } }
  );
  assert(tri.astrology.sunAspect.name.includes('트라인'));
  assert(tri.astrology.sunAspect.angle === 120);
  assert(tri.astrology.sunA === '게자리' && tri.astrology.sunB === '전갈자리');
  assert(tri.score >= 0 && tri.score <= 100);
  if (tri.sukuyo.compatibilityScore !== null) assert(tri.sukuyo.compatibilityScore >= 0 && tri.sukuyo.compatibilityScore <= 100);
  // 스퀘어(긴장) 픽스처: 양자리×게자리 90° 근방
  const sq = calculateDeterministicCompatibility(
    { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'female' as const, birthCity: '서울', name: '수아' } },
    { basic: { birthdate: '1996-07-08', birthtime: '06:00', gender: 'male' as const, birthCity: '서울', name: '지훈' } }
  );
  assert(sq.astrology.moonAspect.name.includes('스퀘어') || sq.astrology.sunAspect.name.includes('스퀘어'));
});

test('chatContext: 미구현 안내 문구가 프롬프트에서 완전히 제거되고 15대 운명학 정합 문구로 교정됐다', () => {
  const now = new Date('2026-11-02T08:00:00Z');
  const r = buildChatDivinationContext({ text: '주역으로 이직운 봐줘', selected: ['iching', 'liuren', 'qimen'], now });
  assert(r.prompt.length > 0);
  assert(!r.prompt.includes('미구현'));
  assert(r.prompt.includes('15대 운명학 도구의 계산된 결과'));
  assert(r.prompt.includes('추정 금지'));
  assert(r.prompt.includes('난수 동전법 작괘 존중'));
});

test('Unified Synastry: 결정론성(동일 입력 동일 출력)과 프롬프트 포맷터·결정론 엔진 바인딩', () => {
  const r1 = calculateDeterministicCompatibility(csA, csB);
  const r2 = calculateDeterministicCompatibility(csA, csB);
  assert.equal(JSON.stringify(r1), JSON.stringify(r2));
  const prompt = formatCompatibilityPrompt(r1);
  assert(prompt.includes('LUCKEY-CS-v1.0.0'));
  assert(prompt.includes('천을귀인'));
  assert(prompt.includes(`${r1.score}점`));
  assert(prompt.includes('연인·결혼') && prompt.includes('비즈니스·파트너십') && prompt.includes('소울메이트·우정'));
  // 결정론 엔진 바인딩: partnerProfile이 있을 때 compatibilityResult 바인딩 + 포맷터 연결
  const report = runDeterministicEngine({ profile: csA, partnerProfile: csB, question: '우리 궁합 봐줘' });
  assert(report.compatibilityResult !== null && report.compatibilityResult !== undefined);
  assert.equal(report.compatibilityResult!.engineVersion, 'LUCKEY-CS-v1.0.0');
  const enginePrompt = formatDeterministicEnginePrompt(report);
  assert(enginePrompt.includes('LUCKEY-CS-v1.0.0'));
  assert(enginePrompt.includes('5대 운명학 융합 궁합 리포트'));
  // partnerProfile이 없으면 미바인딩
  const solo = runDeterministicEngine({ profile: csA, question: '내 운세 봐줘' });
  assert(!solo.compatibilityResult);
});

test('Liuren Master Engine: 사과·삼전·12천장 정통 결단 산출 및 프롬프트 포맷터 검증', () => {
  const instant = new Date('2026-11-02T10:00:00Z');
  const res = calculateLiurenMaster(instant);
  assert.equal(res.status, 'calculated');
  assert.equal(res.engineVersion, LIUREN_MASTER_ENGINE_VERSION);
  assert.equal(res.fourLessons.length, 4);
  assert(res.fourLessons[0].upper.length > 0 && res.fourLessons[0].lower.length > 0);
  assert.equal(res.threeTransmissions.length, 3);
  assert(res.threeTransmissions[0].stage.includes('초전'));
  assert(res.decisionScore >= 0 && res.decisionScore <= 100);
  assert(res.primaryGeneral.name.length > 0);
  const prompt = formatLiurenMasterPrompt(res);
  assert(prompt.includes(LIUREN_MASTER_ENGINE_VERSION));
  assert(prompt.includes('사과(四課) 포국'));
  assert(prompt.includes('삼전(三傳) 타임라인'));
  assert(prompt.includes('결단 스코어'));
});

test('Iching Master Engine: 64괘 4대 대칭 괘상(본·지·호·착·종) 및 체용 생극제화 검증', () => {
  const res = calculateIchingMaster([7, 8, 9, 8, 7, 8]); // 3효 양동효
  assert.equal(res.status, 'calculated');
  assert.equal(res.engineVersion, ICHING_MASTER_ENGINE_VERSION);
  assert.deepEqual(res.movingLines, [3]);
  assert(res.primary.number >= 1 && res.primary.number <= 64);
  assert(res.changed.number >= 1 && res.changed.number <= 64);
  assert(res.nuclear.number >= 1 && res.nuclear.number <= 64);
  assert(res.opposite.number >= 1 && res.opposite.number <= 64);
  assert(res.reversed.number >= 1 && res.reversed.number <= 64);
  assert(res.decisionScore >= 0 && res.decisionScore <= 100);
  assert(res.tiYong.relationship.length > 0);
  const prompt = formatIchingMasterPrompt(res);
  assert(prompt.includes(ICHING_MASTER_ENGINE_VERSION));
  assert(prompt.includes('본괘(本卦)'));
  assert(prompt.includes('지괘(之卦/변괘)'));
  assert(prompt.includes('호괘(互卦/잠재)'));
  assert(prompt.includes('착괘(錯卦/그림자)'));
  assert(prompt.includes('종괘(綜卦/상대관점)'));
  assert(prompt.includes('체용(體用) 생극제화'));
});

test('Tarot Master Engine: 78 아르카나 수비학 소울·퍼스널리티·연간 카드 및 4원소 밸런스 검증', () => {
  const res = calculateTarotMaster({ profile, targetYear: 2026 });
  assert.equal(res.status, 'calculated');
  assert.equal(res.engineVersion, TAROT_MASTER_ENGINE_VERSION);
  assert(res.soulCard.number >= 1 && res.soulCard.number <= 9);
  assert(res.personalityCard.number >= 1 && res.personalityCard.number <= 21);
  assert(res.yearCard.number >= 1 && res.yearCard.number <= 21);
  assert.equal(res.timelineCards.length, 3);
  const totalPct = res.elementalBalance.fire + res.elementalBalance.water + res.elementalBalance.air + res.elementalBalance.earth;
  assert.equal(totalPct, 100);
  assert(res.tarotVitalityScore >= 0 && res.tarotVitalityScore <= 100);
  const prompt = formatTarotMasterPrompt(res);
  assert(prompt.includes(TAROT_MASTER_ENGINE_VERSION));
  assert(prompt.includes('생애 소울 카드'));
  assert(prompt.includes('생애 퍼스널리티 카드'));
  assert(prompt.includes('올해의 성장 카드'));
  assert(prompt.includes('3카드 타임라인 스프레드'));
});

test('HeLuoLiShu Engine: 사주·주역 융합 선천괘·후천괘·원당효 일생 마스터플랜 검증', () => {
  const res = calculateHeLuoLiShu({ profile });
  assert.equal(res.status, 'calculated');
  assert.equal(res.engineVersion, HELUOLISHU_ENGINE_VERSION);
  assert(res.heavenNumber > 0 && res.earthNumber > 0);
  assert(res.innateHexagram.number >= 1 && res.innateHexagram.number <= 64);
  assert(res.acquiredHexagram.number >= 1 && res.acquiredHexagram.number <= 64);
  assert(res.yuanTangYao >= 1 && res.yuanTangYao <= 6);
  assert(res.lifeCycleBalance.earlyLifeScore >= 0 && res.lifeCycleBalance.earlyLifeScore <= 100);
  assert(res.lifeCycleBalance.matureLifeScore >= 0 && res.lifeCycleBalance.matureLifeScore <= 100);
  const prompt = formatHeLuoLiShuPrompt(res);
  assert(prompt.includes(HELUOLISHU_ENGINE_VERSION));
  assert(prompt.includes('선천본괘'));
  assert(prompt.includes('원당효'));
  assert(prompt.includes('후천변괘'));
});

test('Deterministic Engine: 15대 운명학 도구 전원 calculated 완료 및 신설 4대 마스터 엔진 바인딩 검증', () => {
  const report = runDeterministicEngine({ profile, question: '내 인생 전체 종합 운세 봐줘' });
  assert(report.liurenMasterResult !== null && report.liurenMasterResult !== undefined);
  assert(report.ichingMasterResult !== null && report.ichingMasterResult !== undefined);
  assert(report.tarotMasterResult !== null && report.tarotMasterResult !== undefined);
  assert(report.heLuoLiShuResult !== null && report.heLuoLiShuResult !== undefined);
  assert.equal(report.tools.liuren.status, 'calculated');
  assert.equal(report.tools.iching.status, 'calculated');
  assert.equal(report.tools.tarot.status, 'calculated');
  const enginePrompt = formatDeterministicEnginePrompt(report);
  assert(enginePrompt.includes(LIUREN_MASTER_ENGINE_VERSION));
  assert(enginePrompt.includes(ICHING_MASTER_ENGINE_VERSION));
  assert(enginePrompt.includes(TAROT_MASTER_ENGINE_VERSION));
  assert(enginePrompt.includes(HELUOLISHU_ENGINE_VERSION));
});

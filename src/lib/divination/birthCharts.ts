import { lahiriAyanamsaFromUtcMs } from './vedicEngine';
import { Body, GeoVector, Ecliptic } from 'astronomy-engine';
import { astro } from 'iztro';
import type { UserProfile } from '../sharedState';
import { resolveEffectiveSolarDate, convertSolarToLunar } from '../lunarCalendar';
import { parseBirthTime } from '../birthDateTime';
import { calculateNatalChart, ZODIAC_SIGNS } from '../astrologyAnalysis';

function birth(profile?: UserProfile) {
  if (!profile?.basic?.birthdate) throw new RangeError('프로필에 생년월일을 입력하세요.');
  const basic = profile.basic;
  const resolved = resolveEffectiveSolarDate(basic.birthdate!, basic.lunarSolar, basic.isLeapMonth ?? false);
  if (resolved.solarDate.year < 1900 || resolved.solarDate.year > 2100) throw new RangeError('현재 지원 출생연도는 1900~2100년입니다.');
  return { ...resolved, basic, time: parseBirthTime(basic.birthtime) };
}
export function calculateZiwei(profile?: UserProfile) {
  const {basic,solarDateString,time} = birth(profile);
  if (!time) throw new RangeError('자미두수는 출생시간이 필요합니다.');
  if (basic.gender !== 'male' && basic.gender !== 'female') throw new RangeError('자미두수 대운 방향에 사용할 전통 성별 기준이 필요합니다.');
  // Deliberately use the library's Chinese lunisolar calendar, not Korean lunar fields.
  const chart = astro.withOptions({type:'solar', dateStr:solarDateString, timeIndex: time.hour === 23 ? 12 : Math.floor((time.hour+1)/2), gender:basic.gender, language:'ko-KR',fixLeap:true,config:{algorithm:'default',yearDivide:'normal',dayDivide:'forward',horoscopeDivide:'normal',ageDivide:'birthday'}});
  return { method:'iztro 2.6.3 통행식 · 중국 음력 · 정월 연경계 · 23시 익일 · 윤달 15일 이후 익월 · 진태양시 미보정', input:solarDateString+' '+basic.birthtime, lunarDate:chart.lunarDate, soulPalace:chart.earthlyBranchOfSoulPalace, bodyPalace:chart.earthlyBranchOfBodyPalace, fiveElementsClass:chart.fiveElementsClass, palaces:chart.palaces.map(p => ({name:p.name,branch:p.earthlyBranch,stem:p.heavenlyStem,body:p.isBodyPalace,major:p.majorStars.map(s=>({name:s.name,brightness:s.brightness,mutagen:s.mutagen||''})),minor:p.minorStars.map(s=>({name:s.name,mutagen:s.mutagen||''})),decadal:p.decadal.range})), limitations:['출생지 시간대 자동 환산 없이 입력한 현지 시각을 사용합니다.','한국 음력과 중국 음력의 월 경계가 다른 날에는 결과가 달라질 수 있습니다.','유년·유월·유일 운한은 이번 화면에서 산출하지 않습니다.'] };
}
// Japanese 27-mansion lunar-month starting table; 牛 is omitted.
export const SUKUYO_MANSIONS = ['角','亢','氐','房','心','尾','箕','斗','女','虚','危','室','壁','奎','婁','胃','昴','畢','觜','參','井','鬼','柳','星','張','翼','軫'];
const MONTH_START = ['室','奎','胃','畢','參','鬼','張','角','氐','心','斗','虚'];
export function sukuyoFromLunar(month: number, day: number, leap = false) {
  if (!Number.isInteger(month)||month<1||month>12||!Number.isInteger(day)||day<1||day>30) throw new RangeError('유효한 음력 월일이 필요합니다.');
  if (leap) throw new RangeError('숙요 윤달 배정은 유파 확인이 필요하여 현재 계산을 보류합니다.');
  const index = (SUKUYO_MANSIONS.indexOf(MONTH_START[month-1])+day-1)%27;
  return {index, mansion:SUKUYO_MANSIONS[index]+'宿',lunarMonth:month,lunarDay:day,method:'27숙 월별 기숙표 · 한국 음력 환산 · 윤달 미지원 (일본 구력과 경계일 차이 가능)'};
}
export function calculateSukuyo(profile?: UserProfile) {
  const {solarDate} = birth(profile);
  const lunar = convertSolarToLunar(solarDate.year,solarDate.month,solarDate.day);
  return sukuyoFromLunar(lunar.month,lunar.day,!!lunar.isLeapMonth);
}
export function sukuyoRelationship(a: number,b: number) {
  if (![a,b].every(n=>Number.isInteger(n)&&n>=0&&n<27)) throw new RangeError('0~26 숙 인덱스가 필요합니다.');
  const distance=(b-a+27)%27;
  const names=['명','영','쇠','안','위','성','괴','우','친','업','영','쇠','안','위','성','괴','우','친','태','영','쇠','안','위','성','괴','우','친'];
  return {distance,fromA:names[distance],fromB:names[(27-distance)%27],method:'27숙 순환 거리의 방향별 관계 (상대 출생정보가 있을 때만 궁합)'};
}
const NAKSHATRAS=['아슈비니','바라니','크리티카','로히니','므리가시라','아르드라','푸나르바수','푸샤','아슐레샤','마가','푸르바팔구니','우타라팔구니','하스타','치트라','스와티','비샤카','아누라다','제슈타','물라','푸르바아샤다','우타라아샤다','슈라바나','다니슈타','샤타비샤','푸르바바드라파다','우타라바드라파다','레바티'];
const LORDS=['케투','금성','태양','달','화성','라후','목성','토성','수성'];
const YEARS=[7,20,6,10,7,18,16,19,17];
export function calculateVedic(profile?: UserProfile) {
  birth(profile);
  const natal=calculateNatalChart(profile);
  if (!natal || !natal.timeKnown || !natal.locationKnown) throw new RangeError('베딕 참고 차트는 유효한 출생시간과 지원 도시가 필요합니다.');
  const ayanamsa=lahiriAyanamsaFromUtcMs(Date.parse(natal.utcInstant));
  const normalize=(n:number)=>(n%360+360)%360;
  const sidereal=(p:typeof natal.sun)=>normalize(ZODIAC_SIGNS.indexOf(p.sign)*30+p.degree-ayanamsa);
  const moon=normalize(Ecliptic(GeoVector(Body.Moon,new Date(natal.utcInstant),true)).elon-ayanamsa),width=360/27,index=Math.floor(moon/width),lord=index%9;
  const balance=YEARS[lord]*(1-(moon%width)/width);
  let elapsed=balance;
  const dashas=Array.from({length:9},(_,i)=>{const at=(lord+i)%9;const startYears=i===0?0:elapsed;const duration=i===0?balance:YEARS[at];if(i>0)elapsed+=duration;return {lord:LORDS[at],startYearsAfterBirth:startYears,endYearsAfterBirth:i===0?balance:elapsed};});
  return {method:'베딕 참고 계산 · J2000 Lahiri 기준값 + IAU 2006 세차 다항식 (정밀 Lahiri 천문력 아님)',ayanamsa,utcInstant:natal.utcInstant,planets:Object.fromEntries((['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn'] as const).map(k=>[k.toLowerCase(),normalize(Ecliptic(GeoVector(Body[k],new Date(natal.utcInstant),true)).elon-ayanamsa)])),ascendant:natal.ascendant?sidereal(natal.ascendant):null,nakshatra:{index:index+1,name:NAKSHATRAS[index],pada:Math.floor((moon%width)/(width/4))+1,lord:LORDS[lord]},vimshottari:{yearDays:365.25,birthBalanceYears:balance,periods:dashas},limitations:['세차 다항식 계산이라 정밀 천문력과 미세한 차이가 있으니 경계 부근의 라시·나크샤트라·파다·다샤 날짜는 확정하지 마세요.','라후·케투·분할도·안타르다샤·정밀 하우스는 미산출입니다.']};
}

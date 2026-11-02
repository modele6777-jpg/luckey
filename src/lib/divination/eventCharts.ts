import { getLiuRenByDate, getLiuRenByYueJiang } from 'liuren-ts-lib';
import { generateChartByDatetime, chartToObject } from 'qimen-dunjia';
import { Body, GeoVector, Ecliptic } from 'astronomy-engine';
import { birthTimeToUtc } from '../birthDateTime';
import { resolveEffectiveSolarDate } from '../lunarCalendar';

const BRANCHES='子丑寅卯辰巳午未申酉戌亥';
export function eventInstant(date: string, time: string, timeZone: string) {
  const {solarDate}=resolveEffectiveSolarDate(date);
  if (solarDate.year<1900 || solarDate.year>2100) throw new RangeError('점시 지원 범위는 1900~2100년입니다.');
  if (!/^\d{2}:\d{2}$/.test(time)) throw new RangeError('점시를 시:분으로 입력하세요.');
  return birthTimeToUtc(solarDate,Number(time.slice(0,2)),Number(time.slice(3)),timeZone);
}
function utc8Clock(instant: Date) {
  if (!Number.isFinite(instant.getTime())) throw new RangeError('유효한 점시가 필요합니다.');
  const shifted=new Date(instant.getTime()+8*3600000);
  if (shifted.getUTCFullYear()<1900||shifted.getUTCFullYear()>2100) throw new RangeError('지원 점시는 1900~2100년입니다.');
  // Library reads civil getters; override rather than relying on host timezone/DST.
  return Object.assign(shifted,{getFullYear:()=>shifted.getUTCFullYear(),getMonth:()=>shifted.getUTCMonth(),getDate:()=>shifted.getUTCDate(),getHours:()=>shifted.getUTCHours(),getMinutes:()=>shifted.getUTCMinutes(),getSeconds:()=>shifted.getUTCSeconds()});
}
export function calculateLiuren(instant: Date) {
  const clock=utc8Clock(instant);
  const raw=getLiuRenByDate(clock);
  const longitude=((Ecliptic(GeoVector(Body.Sun,instant,true)).elon%360)+360)%360;
  // 中氣換將: Sun 0° -> 戌; 330° (雨水) -> 亥. Use the actual instant.
  const yuejiang=BRANCHES[(10-Math.floor(longitude/30)+12)%12];
  const monthBranch=BRANCHES[(Math.floor(((longitude+45)%360)/30)+2)%12];
  const bazi=raw.dateInfo.bazi.split(' ');
  const result=getLiuRenByYueJiang(yuejiang,bazi[3].slice(-1),bazi[2],monthBranch);
  return {method:'liuren-ts-lib 3.1.0 · UTC+8 표준시 · 천문 태양황경 중기 환장 · 진태양시 미보정',utcInstant:instant.toISOString(),clockUTC8:clock.toISOString().slice(0,16),monthGeneral:yuejiang,day:bazi[2],hour:bazi[3],lessons:result.siKe,transmissions:result.sanChuan,board:result.tianDiPan,limitations:['귀인 주야 기준과 삼전 취법은 라이브러리의 통행 규칙입니다. 다른 유파와 다를 수 있습니다.','추가 신살은 화면에서 해석하지 않습니다.']};
}
export function calculateQimen(instant: Date) {
  const clock=utc8Clock(instant);
  // Public API accepts hour precision only. Make this explicit, never label it exact-minute.
  const hour=clock.toISOString().slice(0,13).replace(/[-T]/g,'');
  const exactHour=new Date(instant);
  exactHour.setUTCMinutes(0,0,0);
  const sector=(d:Date)=>Math.floor(((Ecliptic(GeoVector(Body.Sun,d,true)).elon%360+360)%360)/15);
  if (sector(exactHour)!==sector(instant)) throw new RangeError('절기가 교체된 시간의 분 단위 포국은 현재 지원하지 않습니다. 정밀 엔진이 필요합니다.');
  const chart=chartToObject(generateChartByDatetime(hour,{'定局法':'拆補','夜子時':'次日'}));
  return {method:'일반 기문둔갑 · 차보법(拆補) · UTC+8 정시 기준 · 23시 익일 · 홍국기문 4주 수리 포국과는 별개의 점시 포국',utcInstant:instant.toISOString(),calculatedUTC8Hour:clock.toISOString().slice(0,13)+':00',chart,limitations:['엔진 입력이 1시간 단위이므로 절기 교체가 포함된 시간의 분 단위 결과는 지원하지 않습니다.','이 차보법 포국은 점시 기반이며 홍국기문 4주 수리 포국(세효·응효·중궁)이 아니다. 생년월일시 기반 홍국기문은 결정론 엔진(honggukQimenResult)에서 별도 산출된다.','진태양시·출생지별 경도 보정을 적용하지 않습니다.']};
}

// ==========================================================
// TRINITY Utility Functions - Tarot, Saju, Astro calculations
// Ported directly from TRINITY repo
// ==========================================================

import { calculateDetailedSaju } from '@/lib/sajuAnalysis';
import type { UserProfile } from '@/lib/sharedState';
import { extractConciseSummary, groundTarotSummaryParts, stripSummaryFromTarotText } from '@/lib/tarotSummaryUtils';
import { getTarotCardDetails } from '@/lib/dailyTarotOracle';
import { getCardSoulBlessing } from '@/lib/tarotBlessings';
import { getEffectiveTarotKeywords, getTarotReversedData, getTarotCardCaution } from '@/data/tarotData';

// ✨ Constants
export const HS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
export const EB = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
export const DM: Record<string, string> = {
  '甲':'갑목(甲木) – 큰 나무, 강인한 리더십',
  '乙':'을목(乙木) – 덩굴, 유연한 생명력',
  '丙':'병화(丙火) – 태양, 밝고 열정적인 에너지',
  '丁':'정화(丁火) – 촛불, 집중력과 예술적 감각',
  '戊':'무토(戊土) – 큰 산, 믿음직한 포용력',
  '己':'기토(己土) – 정원의 흙, 성실함과 배려력',
  '庚':'경금(庚金) – 강인한 쇠, 결단력과 원칙주의',
  '辛':'신금(辛金) – 보석, 예민하고 섬세한 완벽주의',
  '壬':'임수(壬水) – 큰 강, 지혜와 자유로운 흐름',
  '癸':'계수(癸水) – 빗물, 직관력과 깊은 감수성',
};
export const EL: Record<string, string> = {
  '甲':'목','乙':'목','丙':'화','丁':'화','戊':'토','己':'토','庚':'금','辛':'금','壬':'수','癸':'수',
  '子':'수','丑':'토','寅':'목','卯':'목','辰':'토','巳':'화','午':'화','未':'토','申':'금','酉':'금','戌':'토','亥':'수'
};
export const SIGNS = ['양자리', '황소자리', '쌍둥이자리', '게자리', '사자자리', '처녀자리', '천칭자리', '전갈자리', '사수자리', '염소자리', '물병자리', '물고기자리'];
export const SEMOJI: Record<string, string> = {'양자리':'♈','황소자리':'♉','쌍둥이자리':'♊','게자리':'♋','사자자리':'♌','처녀자리':'♍','천칭자리':'♎','전갈자리':'♏','사수자리':'♐','염소자리':'♑','물병자리':'♒','물고기자리':'♓'};
export const CITIES: Record<string, [number, number, number]> = {
  '서울':[37.57,126.98,9],'부산':[35.18,129.08,9],'도쿄':[35.68,139.65,9],
  '뉴욕':[40.71,-74.01,-5],'런던':[51.51,-0.13,0],'파리':[48.86,2.35,1]
};
export const TKRMAP: Record<string, string> = {
  "The Fool":"바보","The Magician":"마법사","The High Priestess":"여사제","The Empress":"여황제",
  "The Emperor":"황제","The Hierophant":"교황","The Lovers":"연인","The Chariot":"전차",
  "Strength":"힘","The Hermit":"은둔자","Wheel of Fortune":"운명의 수레바퀴","Justice":"정의",
  "The Hanged Man":"매달린 남자","Death":"죽음","Temperance":"절제","The Devil":"악마",
  "The Tower":"탑","The Star":"별","The Moon":"달","The Sun":"태양","Judgement":"심판","The World":"세계"
};
export const T78: string[] = [
  "The Fool","The Magician","The High Priestess","The Empress","The Emperor","The Hierophant",
  "The Lovers","The Chariot","Strength","The Hermit","Wheel of Fortune","Justice",
  "The Hanged Man","Death","Temperance","The Devil","The Tower","The Star","The Moon",
  "The Sun","Judgement","The World",
  ...["Wands","Cups","Swords","Pentacles"].flatMap(s =>
    ["Ace","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Page","Knight","Queen","King"]
      .map(n => `${n} of ${s}`)
  )
];

export const VISION_DECKS = [
  { id:'CAT', name:'고양이 타로', emoji:'🐱', desc:'고양이의 직관으로 읽는 심리와 관계', detail:'고양이의 영험한 감각으로 인간관계의 미묘한 심리를 읽어냅니다.', best:'인간관계, 심리, 직관', examples:['지금 내 마음 상태는?','그 사람은 나를 어떻게 생각할까?','오늘 나에게 필요한 것'] },
  { id:'ANTIQUE', name:'앤티크 타로', emoji:'🏺', desc:'고전의 지혜로 중대한 결정을 돕는 덱', detail:'수백 년의 지혜가 담긴 고전 상징으로 삶의 중요한 갈림길을 안내합니다.', best:'중대한 결정, 장기적 전망', examples:['이직을 해야 할까요?','지금 이 관계를 유지해야 할까요?','올해 나의 핵심 과제는?'] },
  { id:'VISCONTI', name:'비스콘티 타로', emoji:'👑', desc:'황금빛 성공과 풍요를 위한 프리미엄 덱', detail:'르네상스의 귀족적 황금빛 에너지로 성공, 부, 명예의 길을 찾아냅니다.', best:'성공, 금전, 명예', examples:['투자 운은 어떨까?','금전운이 들어오는 시기','커리어의 다음 단계는?'] },
];

export const LUCKY_EXAMPLES = [
  "오늘 면접 잘 볼 수 있을까?", "인간관계 스트레스 해결책", "지금 이 투자해도 될까?", "시부야의 평화로운 오후", "단식의 시작에서 자유로워지기"
];
export const VISION_EXAMPLES = [
  "오늘 면접 결과는?", "우리의 만남은 우연일까?", "이직하는 게 좋을까?", "금전운이 들어오는 시기", "지금 나에게 필요한 조언"
];

// ✨ Tarot
export function tkr(n: string): string {
  return TKRMAP[n] || n.replace("Ace", "에이스").replace(" of Wands", "(지팡이)").replace(" of Cups", "(컵)").replace(" of Swords", "(소드)").replace(" of Pentacles", "(펜타클)");
}
export function drawCards(n: number = 3, exclude: string[] = []) {
  return [...T78].filter(c => !exclude.includes(c)).sort(() => Math.random() - .5).slice(0, n).map(name => ({ name, kr: tkr(name), rev: Math.random() > .6 }));
}

// ✨ Saju
export function calcSaju(y: number, m: number, d: number, h: number, gender: string): string {
  const yi = (y - 4) % 60;
  const yp = { gan: HS[yi % 10], zhi: EB[yi % 12] };
  const mgi = ([2,4,6,8,0][Math.floor(((y-4)%60)%10/2)] * 2 + (m-1)) % 10;
  const mp = { gan: HS[mgi], zhi: EB[(m+1)%12] };
  const a = Math.floor((14-m)/12), yr = y-a, mo = m+12*a-2;
  const jd = d + Math.floor((153*mo+2)/5) + 365*yr + Math.floor(yr/4) - Math.floor(yr/100) + Math.floor(yr/400) - 32045;
  const di = (jd+49) % 60;
  const dp = { gan: HS[di%10], zhi: EB[di%12] };
  const hp = h >= 0 ? { gan: HS[(HS.indexOf(dp.gan)*2 + Math.floor((h+1)/2))%12%10], zhi: EB[Math.floor((h+1)/2)%12] } : null;
  const ec: Record<string, number> = { 木:0, 火:0, 土:0, 金:0, 水:0 };
  [yp, mp, dp, hp].forEach(p => {
    if (p) {
      if (EL[p.gan]) {
        const el = EL[p.gan];
        if (el === '목') ec['木']++;
        else if (el === '화') ec['火']++;
        else if (el === '토') ec['土']++;
        else if (el === '금') ec['金']++;
        else if (el === '수') ec['水']++;
      }
      if (EL[p.zhi]) {
         const el = EL[p.zhi];
         if (el === '목') ec['木']++;
         else if (el === '화') ec['火']++;
         else if (el === '토') ec['土']++;
         else if (el === '금') ec['金']++;
         else if (el === '수') ec['水']++;
      }
    }
  });
  const sorted = Object.entries(ec).sort((a, b) => b[1] - a[1]);
  const isYang = HS.indexOf(yp.gan) % 2 === 0;
  const isFwd = (isYang && gender === '남성') || (!isYang && gender === '여성');
  const mgi2 = HS.indexOf(mp.gan), mzi = EB.indexOf(mp.zhi);
  const now = new Date().getFullYear();
  const daeuns = Array.from({length:8}, (_,i) => i+1).map(i => ({
    ganZhi: HS[((mgi2+(isFwd?i:-i))%10+10)%10] + EB[((mzi+(isFwd?i:-i))%12+12)%12],
    startAge: i*10-9, startYear: y+i*10-9,
  }));
  const curD = daeuns.find(d => d.startYear <= now && d.startYear+10 > now);
  const nextD = daeuns.find(d => d.startYear > now);
  const elNames: Record<string, string> = { '木':'목(나무)', '火':'화(불)', '土':'토(땅)', '金':'금(쇠)', '水':'수(물)' };
  const koreanAge = now - y + 1;
  return `[사주] 년:${yp.gan+yp.zhi} 월:${mp.gan+mp.zhi} 일:${dp.gan+dp.zhi}${hp?' 시:'+hp.gan+hp.zhi:''}
[일간] ${DM[dp.gan]||dp.gan} (현재 ${koreanAge}세)
[오행] 강함:${elNames[sorted[0][0]]}(${sorted[0][1]}개) 부족:${elNames[sorted[sorted.length-1][0]]}(${sorted[sorted.length-1][1]}개)
[대운] 현재:${curD?curD.ganZhi+'운 ('+curD.startAge+'세~'+(curD.startAge+9)+'세)':''} ${nextD?' → 다음:'+nextD.ganZhi+'운 ('+nextD.startAge+'세~)':''}`;
}

// ✨ Astro
function toSign(d: number): string { const n = ((d%360)+360)%360; return SIGNS[Math.floor(n/30)]; }
function toJD(y: number, m: number, d: number, h: number): number {
  const a = Math.floor((14-m)/12), yr = y+4800-a, mo = m+12*a-3;
  return d + Math.floor((153*mo+2)/5) + 365*yr + Math.floor(yr/4) - Math.floor(yr/100) + Math.floor(yr/400) - 32045 - 0.5 + h/24;
}
function sunL(jd: number): number {
  const T = (jd-2451545)/36525, L0 = 280.46646+36000.76983*T, M = (357.52911+35999.05029*T)*Math.PI/180;
  const C = (1.914602-0.004817*T)*Math.sin(M)+(0.019993-0.000101*T)*Math.sin(2*M);
  return ((L0+C)%360+360)%360;
}
function planL(jd: number, p: string): number {
  const T = (jd-2451545)/36525;
  const ps: Record<string,[number,number]> = { moon:[218.3165,481267.88], mercury:[252.25,149472.67], venus:[181.98,58517.82], mars:[355.43,19140.30], jupiter:[34.35,3034.91], saturn:[50.08,1222.11] };
  if (!ps[p]) return 0;
  return ((ps[p][0]+ps[p][1]*T)%360+360)%360;
}
export function calcAstro(y: number, m: number, d: number, h: number, city: string = '서울'): string {
  const [, lon, tz] = Object.entries(CITIES).find(([k]) => (city||'서울').includes(k))?.[1] || CITIES['서울'];
  const jd = toJD(y, m, d, Math.max(0, h >= 0 ? h-tz : 1));
  const fmt = (s: string) => `${SEMOJI[s]||''}${s}`;
  const now = new Date(); const jdN = toJD(now.getFullYear(), now.getMonth()+1, now.getDate(), 12);
  return `☀️태양:${fmt(toSign(sunL(jd)))} 🌙달:${fmt(toSign(planL(jd,'moon')))} ↗️상승:${h>=0?fmt(toSign(((280.46+360.985*(jd-2451545))%360+lon)%360)):'(시각필요)'}
♂️화성:${fmt(toSign(planL(jd,'mars')))} ♀️금성:${fmt(toSign(planL(jd,'venus')))} ♃목성:${fmt(toSign(planL(jd,'jupiter')))} ♄토성:${fmt(toSign(planL(jd,'saturn')))}
[트랜짓] 목성:${fmt(toSign(planL(jdN,'jupiter')))} 토성:${fmt(toSign(planL(jdN,'saturn')))}`;
}
export function parseAstro(astro: string) {
  const get = (re: RegExp) => astro.match(re)?.[1] || '';
  return {
    sun: get(/☀️태양:([\S]+)/), moon: get(/🌙달:([\S]+)/),
    asc: astro.includes('시각필요') ? '(시각 미입력)' : get(/↗️상승:([\S]+)/),
    mars: get(/♂️화성:([\S]+)/), venus: get(/♀️금성:([\S]+)/),
    jupiter: get(/♃목성:([\S]+)/), saturn: get(/♄토성:([\S]+)/),
    raw: astro
  };
}

export type TarotConcernKind = 'binary_choice' | 'yes_no' | 'open';

export type TarotConcernTheme =
  | 'binary_choice'
  | 'yes_no'
  | 'daily'
  | 'super_money'
  | 'lucky'
  | 'angel'
  | 'healing'
  | 'fortune_boost'
  | 'new_year'
  | 'saju'
  | 'love'
  | 'career'
  | 'money'
  | 'timing'
  | 'obstacle'
  | 'celtic_cross'
  | 'general';

export type TarotSpreadRecommendation = {
  id: string;
  name: string;
  cardCount: number;
  reason: string;
  positions: string[];
  theme: TarotConcernTheme;
};

export type TarotConcernAnalysis = {
  kind: TarotConcernKind;
  theme: TarotConcernTheme;
  themeLabel: string;
  themeEmoji: string;
  recommendationReason: string;
  optionA?: string;
  optionB?: string;
  spread: TarotSpreadRecommendation;
  confidenceScore?: number;
  detectedKeywords?: string[];
  alternativeSpreads?: TarotSpreadRecommendation[];
};

/** 각 타로 주제별 사용자 친화적 라벨, 이모지, 요약 설명 반환 */
export function getTarotThemeMeta(theme: TarotConcernTheme): {
  label: string;
  emoji: string;
  shortDesc: string;
} {
  switch (theme) {
    case 'love':
      return { label: '연애·관계', emoji: '💖', shortDesc: '상대방의 속마음과 관계의 현실 및 미래 조언' };
    case 'career':
      return { label: '진로·취업·시험', emoji: '💼', shortDesc: '목표 달성을 위한 단계별 성장과 조력' };
    case 'money':
      return { label: '재물·투자·금전', emoji: '💰', shortDesc: '재정 흐름과 막힘 해소 및 유입 기회' };
    case 'binary_choice':
      return { label: '양자택일 비교', emoji: '⚖️', shortDesc: '두 가지 선택지의 실질적 결과 비교 판별' };
    case 'yes_no':
      return { label: '예/아니오 결단', emoji: '🎯', shortDesc: '명쾌한 YES/NO 판정과 핵심 변수 진단' };
    case 'timing':
      return { label: '시기·타이밍', emoji: '⏳', shortDesc: '움직여야 할 최적의 시점과 과거·현재 흐름' };
    case 'obstacle':
      return { label: '장애물 돌파·해결', emoji: '🧱', shortDesc: '막힌 원인과 돌파구를 여는 명쾌한 해법' };
    case 'celtic_cross':
      return { label: '셀틱 크로스 (10장)', emoji: '✨', shortDesc: '무의식과 외부 환경까지 10장 심층 입체 분석' };
    case 'super_money':
      return { label: '슈퍼타로 재물자석', emoji: '💎', shortDesc: '황금빛 부의 주파수와 자석 같은 현금 흐름' };
    case 'lucky':
    case 'fortune_boost':
      return { label: '럭키 대길 개운', emoji: '🍀', shortDesc: '탁기 정화 및 기하급수적 행운 증폭' };
    case 'angel':
      return { label: '수호천사 영적 성장', emoji: '👼', shortDesc: '천사의 빛과 에고 정화 및 영혼의 인도' };
    case 'healing':
      return { label: '마음 & 영혼 치유', emoji: '🌿', shortDesc: '지친 마음과 내면 아이 치유 및 평화 회복' };
    case 'saju':
      return { label: '사주 4주 융합', emoji: '🔮', shortDesc: '명리 4기둥(년·월·일·시)과 타로 상징 융합' };
    case 'new_year':
      return { label: '신년 4계절 대운', emoji: '🌸', shortDesc: '신년 사계절 분기별 흐름과 대운 나침반' };
    case 'daily':
      return { label: '오늘의 타로 (원카드)', emoji: '☀️', shortDesc: '오늘 하루의 우주적 기운과 일일 계시' };
    case 'general':
    default:
      return { label: '3카드 시간 배열', emoji: '🌌', shortDesc: '과거 원인·현재 상황·미래 결과의 명확한 흐름' };
  }
}

/** 고민 주제 및 배열법에 따른 맞춤 추천 이유 생성 */
export function getTarotRecommendationReason(
  theme: TarotConcernTheme,
  spreadName: string,
  cardCount: number,
  analysis?: { optionA?: string; optionB?: string }
): string {
  switch (theme) {
    case 'love':
      return `상대방의 속마음, 관계의 현실과 장애물, 미래 조언을 입체적으로 투영하는 [${spreadName} (${cardCount}장)]이 맞춤 추천되었습니다.`;
    case 'career':
      return `목표 달성을 위한 현 위치, 단계별 과정, 조력자와 최종 성취를 짚어주는 [${spreadName} (${cardCount}장)]이 맞춤 추천되었습니다.`;
    case 'money':
      return `자금 흐름의 정체 원인과 유입 기회, 구체적 실천 조언을 밝히는 [${spreadName} (${cardCount}장)]이 맞춤 추천되었습니다.`;
    case 'binary_choice':
      return `${analysis?.optionA && analysis?.optionB ? `선택지 [${analysis.optionA}] vs [${analysis.optionB}]의` : '두 선택지의'} 결과와 장단점을 비교 판별하는 [${spreadName} (${cardCount}장)]이 맞춤 추천되었습니다.`;
    case 'yes_no':
      return `명확한 YES/NO 결단과 숨겨진 변수, 최종 판정을 신속히 확인하는 [${spreadName} (${cardCount}장)]이 맞춤 추천되었습니다.`;
    case 'timing':
      return `움직여야 할 최적의 시점과 과거의 영향, 결과 타이밍을 점검하는 [${spreadName} (${cardCount}장)]이 맞춤 추천되었습니다.`;
    case 'obstacle':
      return `현재 막힌 상황의 근본 원인과 돌파구를 명쾌하게 제시하는 [${spreadName} (${cardCount}장)]이 맞춤 추천되었습니다.`;
    case 'celtic_cross':
      return `복합적이고 심층적인 고민의 무의식과 외부 환경, 최종 결과까지 10장으로 정밀 분석하는 정통 [${spreadName} (${cardCount}장)]이 맞춤 추천되었습니다.`;
    case 'super_money':
      return `결핍의 무의식을 지우고 황금빛 부의 주파수를 당기는 [${spreadName} (${cardCount}장)]이 맞춤 추천되었습니다.`;
    case 'lucky':
    case 'fortune_boost':
      return `탁기를 정화하고 대길 행운의 문을 활짝 여는 [${spreadName} (${cardCount}장)]이 맞춤 추천되었습니다.`;
    case 'angel':
      return `수호천사의 고차원적 빛과 영혼의 성장을 이끄는 [${spreadName} (${cardCount}장)]이 맞춤 추천되었습니다.`;
    case 'healing':
      return `지친 내면의 상처를 보듬고 온전한 평화를 되찾는 [${spreadName} (${cardCount}장)]이 맞춤 추천되었습니다.`;
    case 'saju':
      return `사주 4기둥(년·월·일·시)과 타로 상징을 융합 해독하는 [${spreadName} (${cardCount}장)]이 맞춤 추천되었습니다.`;
    case 'new_year':
      return `신년 4계절(분기별) 흐름과 1년 전체를 관통하는 [${spreadName} (${cardCount}장)]이 맞춤 추천되었습니다.`;
    case 'daily':
      return `오늘 하루 당신을 감싸는 우주적 파동과 일일 계시를 밝히는 [${spreadName} (${cardCount}장)]이 맞춤 추천되었습니다.`;
    case 'general':
    default:
      return `고민의 과거 원인, 현재 상황, 미래의 흐름을 균형 있게 파악하는 [${spreadName} (${cardCount}장)]이 맞춤 추천되었습니다.`;
  }
}

export function isDailyTarotConcern(text: string): boolean {
  const t = text.trim().replace(/\s+/g, ' ');
  return /(?:오늘의?\s*타로|오늘의?\s*운세|오늘의?\s*카드|오늘\s*타로|오늘\s*운세|데일리\s*타로|데일리\s*오라클|일일\s*타로|daily\s*tarot|daily\s*oracle|^오늘$|^daily$)/i.test(t);
}

function cleanTarotOption(raw: string): string {
  return raw
    .replace(/^[「『"'\s]+/, '')
    .replace(/[」』"'\s]+$/, '')
    .replace(/[?？!！.。,，:：]+$/g, '')
    .replace(/^(?:지금|올해|이번에|과연|내가|제가|우리|혹시)\s+/, '')
    .replace(/\s*(?:할까요?|갈까요?|될까요?|일까요?|나을까요?|좋을까요?|맞을까요?|할지|갈지|될지|일지)$/, '')
    .trim();
}

function hasMeaningfulOptions(a: string, b: string): boolean {
  if (!a || !b || a === b) return false;
  if (a.length < 1 || b.length < 1) return false;
  if (/^[ABab12]$/.test(a.trim()) && /^[ABab12]$/.test(b.trim())) return false;
  if (a.length > 48 || b.length > 48) return false;
  return true;
}

/**
 * 질문 텍스트에서 양자택일의 두 가지 실제 고민 선택지를 자연스러운 한국어 구절로 추출합니다.
 * 기계적인 'A안', 'B안', 'A', 'B' 대신 사용자의 실제 고민(예: '새로운 곳으로 이직하기' vs '현재 직장에 남기')을 반환합니다.
 */
export function extractBinaryOptionsFromConcern(concern: string): { optionA: string; optionB: string } {
  const text = (concern || '').trim().replace(/\s+/g, ' ');
  if (!text) {
    return { optionA: '적극적인 변화와 새로운 도전', optionB: '현재 위치 유지와 안정적 내실 다지기' };
  }

  // 1. "X vs Y" / "X 대 Y" (단, "A를 선택할까 vs B를 선택할까" 같은 기본 플레이스홀더 제외)
  const vsMatch = text.match(/^(.{1,48}?)\s+(?:vs\.?|VS|대)\s+(.{1,48}?)$/i);
  if (vsMatch) {
    const rawA = vsMatch[1].replace(/를?\s*선택할까(?:요)?$/, '').trim();
    const rawB = vsMatch[2].replace(/를?\s*선택할까(?:요)?[?？]*$/, '').trim();
    const a = cleanTarotOption(rawA);
    const b = cleanTarotOption(rawB);
    if (hasMeaningfulOptions(a, b) && !/^[ABab](?:안|선택지)?$/.test(a) && !/^[ABab](?:안|선택지)?$/.test(b)) {
      return { optionA: a, optionB: b };
    }
  }

  // 2. "~할까 말까" / "~해야 할까 말까" / "~할지 말지" 딜레마 패턴 정밀 해독
  const dilemmaMatch = text.match(
    /(.+?)(?:해야\s*할까\s*말까|할까\s*말까|갈까\s*말까|살까\s*말까|만날까\s*말까|연락할까\s*말까|고백할까\s*말까|이직할까\s*말까|퇴사할까\s*말까|투자할까\s*말까|시작할까\s*말까|도전할까\s*말까|사귈까\s*말까|헤어질까\s*말까|이사할까\s*말까|할지\s*말지)/i
  );
  if (dilemmaMatch) {
    const fullBefore = text.replace(/[?？!！.]+$/, '').trim();
    if (/이직/.test(fullBefore)) {
      return { optionA: '과감하게 이직 추진하기', optionB: '현재 직장에 남아 내실 다지기' };
    }
    if (/퇴사|그만둘/.test(fullBefore)) {
      return { optionA: '퇴사 결단 및 새로운 길 모색', optionB: '현재 직장을 유지하며 준비하기' };
    }
    if (/연락/.test(fullBefore)) {
      return { optionA: '먼저 용기 내어 연락하기', optionB: '연락하지 않고 상대의 흐름 지켜보기' };
    }
    if (/고백/.test(fullBefore)) {
      return { optionA: '진심을 담아 마음 고백하기', optionB: '고백을 미루고 관계 분위기 살피기' };
    }
    if (/만날|만나/.test(fullBefore)) {
      return { optionA: '직접 만나서 대화 나누기', optionB: '만남을 보류하고 거리 두기' };
    }
    if (/헤어질|이별/.test(fullBefore)) {
      return { optionA: '관계를 정리하고 홀로서기', optionB: '관계를 이어가며 회복 노력하기' };
    }
    if (/재회/.test(fullBefore)) {
      return { optionA: '다시 손을 잡고 재회 선택하기', optionB: '과거를 보내주고 새로운 인연 열기' };
    }
    if (/투자|매수|주식|코인|부동산/.test(fullBefore)) {
      return { optionA: '적극적으로 투자 실행하기', optionB: '투자를 보류하고 현금·관망 유지하기' };
    }
    if (/창업|사업|개업/.test(fullBefore)) {
      return { optionA: '새로운 사업·창업 도전하기', optionB: '무리한 확장을 멈추고 안정 유지하기' };
    }
    if (/이사/.test(fullBefore)) {
      return { optionA: '새로운 곳으로 이사 추진하기', optionB: '현재 거주지에 머무르며 안정 찾기' };
    }
    if (/살까\s*말까|구매|구입/.test(fullBefore)) {
      const itemPrefix = cleanTarotOption(dilemmaMatch[1]);
      return {
        optionA: itemPrefix ? `${itemPrefix} 구매 결단하기` : '원하는 것 구매 실행하기',
        optionB: itemPrefix ? `${itemPrefix} 구매 보류하고 아끼기` : '구매를 미루고 지출 아끼기',
      };
    }
    if (/갈까\s*말까/.test(fullBefore)) {
      const placePrefix = cleanTarotOption(dilemmaMatch[1]);
      return {
        optionA: placePrefix ? `${placePrefix} 직접 가기` : '적극적으로 이동·참석하기',
        optionB: placePrefix ? `${placePrefix} 가지 않고 머무르기` : '가지 않고 현재 자리 지키기',
      };
    }
    const stem = cleanTarotOption(dilemmaMatch[1]);
    if (stem && stem.length >= 2) {
      return {
        optionA: `${stem} 적극적으로 실행하기`,
        optionB: `${stem} 보류하고 신중히 관망하기`,
      };
    }
  }

  // 3. "X와/과/랑/하고 Y 중/사이/둘 중"
  const betweenMatch = text.match(/(.{1,30}?)\s*(?:와|과|랑|하고)\s*(.{1,30}?)\s*(?:중(?:에서)?|사이(?:에서)?|둘\s*중|어느\s*쪽)/);
  if (betweenMatch) {
    const a = cleanTarotOption(betweenMatch[1]);
    const b = cleanTarotOption(betweenMatch[2]);
    if (hasMeaningfulOptions(a, b)) {
      return { optionA: a, optionB: b };
    }
  }

  // 4. "X할까 Y할까" / "X할지 Y할지" / "X갈까 Y갈까" / "X가 나을까 Y가 나을까"
  const doubleKkaMatch = text.match(
    /(.{1,30}?(?:할까(?:요)?|갈까(?:요)?|될까(?:요)?|일까(?:요)?|할지|갈지|나을까(?:요)?|좋을까(?:요)?))\s*(?:,|아니면|혹은|또는|vs|\/|\s+)\s*(.{1,30}?(?:할까(?:요)?|갈까(?:요)?|될까(?:요)?|일까(?:요)?|할지|갈지|나을까(?:요)?|좋을까(?:요)?))/
  );
  if (doubleKkaMatch) {
    const a = cleanTarotOption(doubleKkaMatch[1]);
    const b = cleanTarotOption(doubleKkaMatch[2]);
    if (hasMeaningfulOptions(a, b)) {
      return { optionA: a, optionB: b };
    }
  }

  // 5. "X 아니면 Y" / "X 또는 Y" / "X 혹은 Y"
  const orMatch = text.match(/(.{2,30}?)\s+(?:아니면|또는|혹은)\s+(.{2,30}?)(?:[?？!！.]|$)/);
  if (orMatch) {
    const a = cleanTarotOption(orMatch[1]);
    const b = cleanTarotOption(orMatch[2]);
    if (hasMeaningfulOptions(a, b)) {
      return { optionA: a, optionB: b };
    }
  }

  // 6. 일반 고민 문장에서 주제 기반 양자택일 갈림길 자동 도출 (기계적인 A/B 절대 사용 금지)
  const cleanTopic = text
    .replace(/(?:양자택일\s*비교\s*배열|양자택일\s*배열|양자택일|둘\s*중\s*어느\s*쪽|어느\s*선택|비교해\s*줘|봐줘|알려줘)/g, '')
    .replace(/^[?？!！.,\s]+|[?？!！.,\s]+$/g, '')
    .trim();

  if (/이직|퇴사|직장|회사|취업|진로|커리어/.test(text)) {
    return { optionA: '새로운 환경으로 이직·도약하기', optionB: '현재 자리에서 안정과 내실 다지기' };
  }
  if (/연애|사랑|고백|연락|재회|이별|만남|그\s*사람|상대/.test(text)) {
    return { optionA: '마음을 표현하며 적극적으로 다가가기', optionB: '거리를 두며 차분히 흐름 지켜보기' };
  }
  if (/투자|주식|코인|부동산|매매|계약|사업|창업|돈|재물/.test(text)) {
    return { optionA: '과감하게 투자·계약 추진하기', optionB: '신중하게 리스크를 방어하며 관망하기' };
  }
  if (cleanTopic && cleanTopic.length >= 2 && cleanTopic.length <= 28 && !/A.*B/i.test(cleanTopic)) {
    return {
      optionA: `${cleanTopic} — 적극 추진 및 변화 선택`,
      optionB: `${cleanTopic} — 신중한 보류 및 현재 유지`,
    };
  }

  return { optionA: '적극적인 변화와 새로운 도전', optionB: '현재 흐름 유지와 안정적 준비' };
}

type ThemeScoreEntry = {
  theme: Exclude<TarotConcernTheme, 'binary_choice' | 'yes_no'>;
  score: number;
  keywords: string[];
};

/**
 * 다차원 한국어 어휘·구문·질문의도 가중치 채점 엔진
 * 단순 첫 매칭(first-match)으로 인해 '올해 이직운'이 신년운세로 빠지거나
 * '연애 스트레스'가 힐링으로 빠지는 오작동을 원천 차단합니다.
 */
function scoreTarotThemes(text: string): ThemeScoreEntry[] {
  const normalized = text.trim().replace(/\s+/g, ' ');
  const scores: Record<Exclude<TarotConcernTheme, 'binary_choice' | 'yes_no'>, { score: number; keywords: Set<string> }> = {
    daily: { score: 0, keywords: new Set() },
    super_money: { score: 0, keywords: new Set() },
    lucky: { score: 0, keywords: new Set() },
    fortune_boost: { score: 0, keywords: new Set() },
    angel: { score: 0, keywords: new Set() },
    healing: { score: 0, keywords: new Set() },
    new_year: { score: 0, keywords: new Set() },
    saju: { score: 0, keywords: new Set() },
    celtic_cross: { score: 0, keywords: new Set() },
    love: { score: 0, keywords: new Set() },
    career: { score: 0, keywords: new Set() },
    money: { score: 0, keywords: new Set() },
    timing: { score: 0, keywords: new Set() },
    obstacle: { score: 0, keywords: new Set() },
    general: { score: 1, keywords: new Set() },
  };

  const addMatches = (
    theme: Exclude<TarotConcernTheme, 'binary_choice' | 'yes_no'>,
    regex: RegExp,
    weight: number
  ) => {
    const flags = regex.flags.includes('g') ? regex.flags : `${regex.flags}g`;
    const globalRe = new RegExp(regex.source, flags);
    let m: RegExpExecArray | null;
    while ((m = globalRe.exec(normalized)) !== null) {
      scores[theme].score += weight;
      if (m[0]) scores[theme].keywords.add(m[0].trim());
    }
  };

  if (isDailyTarotConcern(normalized)) {
    scores.daily.score += 100;
    scores.daily.keywords.add('오늘의 타로');
  }

  // 1. 특수 테마 (명시적 시그니처 키워드 높은 가중치, 일반 어휘는 보조 가중치)
  addMatches(
    'super_money',
    /(?:슈퍼\s*타로|슈퍼타로|돈\s*끌어당|돈을\s*끌어당|재물\s*자석|머니\s*마그넷|부의\s*주파수|돈맥|경제적\s*자유|돈복\s*터지|금전\s*폭발|슈퍼\s*리치|황금\s*창고|부의\s*법칙|돈이\s*붙는|재물\s*폭발|황금빛\s*부|떼돈|벼락부자)/i,
    18
  );
  addMatches(
    'lucky',
    /(?:럭키\s*타로|볼수록\s*운|운이?\s*좋아지|운을?\s*올리|개운\s*타로|행운\s*증폭|행운\s*부르는|행운\s*끌어당|대길|대박\s*운|대박\s*행운|행운\s*배가|행운\s*폭발|럭키\s*에너지|복\s*부르는|기운\s*바꾸|운이?\s*트이|운의\s*흐름\s*바꾸|행운\s*타로|운세\s*상승|행운\s*극대화|기적\s*끌어당|행운\s*부스터|대박\s*기운)/i,
    18
  );
  addMatches('lucky', /(?:개운법|개운|행운|복운|재수|길운)/i, 5);

  addMatches(
    'angel',
    /(?:수호\s*천사|천사\s*타로|엔젤\s*타로|대천사|영적\s*성장|영혼의\s*성장|영적\s*진화|차원\s*상승|빛의\s*인도|영적\s*메시지|수호령|고차원|빛의\s*존재|영적\s*깨달음|천상의\s*계시)/i,
    18
  );
  addMatches('angel', /(?:천사|엔젤|영성|영혼\s*주파수)/i, 6);

  addMatches(
    'healing',
    /(?:힐링\s*타로|내면\s*아이|마음\s*치유|영혼\s*치유|트라우마|자기\s*자비|마음의\s*평화|불안\s*해소|마음\s*돌봄|멘탈\s*케어|영혼\s*정화|마음의\s*안식|감정\s*치유|자존감\s*회복|번아웃)/i,
    16
  );
  addMatches('healing', /(?:힐링|치유|상처|위로|위안|우울|무기력|지친\s*마음|마음이\s*힘|마음이\s*아파)/i, 5);

  addMatches(
    'new_year',
    /(?:신년\s*운세|새해\s*운세|연간\s*운세|4계절|사계절|분기별|올해\s*한\s*해|한\s*해\s*운세|1년\s*흐름|신년\s*대운|신년\s*타로|새해\s*타로|1년\s*운세|한해\s*운세|올해\s*전체\s*운|올해\s*총운)/i,
    18
  );
  addMatches('new_year', /(?:신년|새해|올해\s*운세|올해의?\s*흐름|상반기|하반기|202[5-9]년)/i, 6);

  addMatches(
    'saju',
    /(?:사주\s*4주|사주\s*타로|사주팔자|사주\s*기운|4기둥|사주\s*4기둥|년주|월주|일주|시주|선천\s*운명|타고난\s*사주)/i,
    18
  );
  addMatches('saju', /(?:사주|명리|오행|팔자|대운|세운|용신|타고난\s*운)/i, 7);

  addMatches(
    'celtic_cross',
    /(?:셀틱\s*크로스|셀틱|10장|열\s*장|열장|십카드|ten\s*cards?|celtic\s*cross|인생\s*전체|종합\s*심층)/i,
    22
  );

  // 2. 핵심 도메인 테마 (연애·진로·재물·타이밍·장애물) 정밀 채점
  // 💖 Love & Relationship
  addMatches(
    'love',
    /(?:속마음|진심|재회|짝사랑|전남친|전여친|전애인|남친|여친|남자친구|여자친구|연애운|결혼운|이성운|썸남|썸녀|짝남|짝녀|고백|권태기|양다리|바람|외도|이혼|파혼|재결합|소개팅|미팅|궁합|호감도|나를\s*어떻게\s*생각|우리\s*사이|관계\s*흐름|사귈\s*수|솔로\s*탈출|연락이?\s*올까|연락운)/i,
    12
  );
  addMatches(
    'love',
    /(?:사랑|연애|썸|헤어|이별|결혼|인연|상대방|그\s*사람|그사람|애인|배우자|호감|좋아하|연인|남편|아내|데이트|설렘|만남|화해|연락)/i,
    6
  );

  // 💼 Career, Exam & Business
  addMatches(
    'career',
    /(?:이직운|취업운|승진운|면접운|합격운|사업운|직장운|시험\s*합격|최종\s*합격|서류\s*합격|실기|면접|공채|이직|퇴사|취업|취직|승진|창업|개업|폐업|자격증|고시|공시|임용|공무원|수능|입시|부서\s*이동|발령|스카우트|연봉\s*협상|프로젝트|동업|거래처|커리어|진로)/i,
    12
  );
  addMatches(
    'career',
    /(?:사업|직장|회사|합격|불합격|시험|직업|일자리|업무|전직|계약|공부|성적|대학|학업|가게|매장|상사|팀장|부장|동료|적성|일복)/i,
    6
  );

  // 💰 Money, Investment & Assets
  addMatches(
    'money',
    /(?:금전운|재물운|투자운|주식운|코인운|부동산운|청약|매매|매수|매도|수익률|손절|원금\s*회복|목돈|대출|빚\s*청산|채무|보증금|전세|월세|사업\s*자금|로또|복권|연봉|성과급|보너스|배당|현금\s*흐름|자금\s*흐름|적금|펀드|자산\s*증식)/i,
    12
  );
  addMatches(
    'money',
    /(?:돈|재물|금전|투자|수입|빚|재정|월급|적자|흑자|부동산|주식|코인|비트코인|수익|매출|통장|자산|자금|환율|상속|증여|부자)/i,
    6
  );

  // ⏳ Timing & When
  addMatches(
    'timing',
    /(?:언제쯤|언제가\s*좋을까|언제\s*연락|언제\s*이직|언제\s*퇴사|언제\s*결혼|언제\s*만날|언제\s*들어올|언제\s*매도|언제\s*매수|언제\s*움직|시기가\s*언제|타이밍이\s*언제|얼마나\s*걸릴|몇\s*월쯤|몇\s*달\s*안에|최적의\s*시기|움직여야\s*할\s*때)/i,
    15
  );
  addMatches(
    'timing',
    /(?:언제|시기|타이밍|때가|며칠|몇\s*월|몇월|몇\s*주|기간|시점|기다려야|조만간|이번\s*달\s*안에|올해\s*안에)/i,
    7
  );

  // 🧱 Obstacle & Breakthrough
  addMatches(
    'obstacle',
    /(?:장애물|돌파구|왜\s*안\s*풀릴|막힌\s*원인|해결책|극복\s*방법|탈출구|벽에\s*부딪|정체기\s*탈출|위기\s*극복|갈등\s*해결|꼬인\s*문제|방해\s*요소)/i,
    13
  );
  addMatches(
    'obstacle',
    /(?:막힌|막혀|장애|해결|돌파|극복|정체|꼬여|안\s*풀리|문제|답답|위기|갈등|어떻게\s*해야|어떡하지|원인|왜\s*이럴까|막막|난관|딜레마)/i,
    6
  );

  // 복합 심층 질문 보너스 (셀틱 크로스)
  if (normalized.length >= 48 && /(?:종합|심층|전체|깊이|상세|자세히|복합|다각도|포괄|전반적)/.test(normalized)) {
    scores.celtic_cross.score += 16;
    scores.celtic_cross.keywords.add('심층 종합 분석');
  }

  // 도메인(연애/진로/재물)이 명확할 때 일반 시간어('올해', '이번 달')나 일반 감정어('스트레스', '마음')가 신년/힐링/럭키로 오인되는 현상 보정
  const maxDomainScore = Math.max(scores.love.score, scores.career.score, scores.money.score);
  if (maxDomainScore >= 12) {
    if (scores.new_year.score < 18) scores.new_year.score = Math.max(0, scores.new_year.score - 5);
    if (scores.healing.score < 16) scores.healing.score = Math.max(0, scores.healing.score - 4);
    if (scores.lucky.score < 18) scores.lucky.score = Math.max(0, scores.lucky.score - 4);
  }

  // 질문의 핵심 의문사가 '언제/시기/타이밍'에 집중되어 있고 문장이 비교적 간결할 때 타이밍 배열 가중
  if (scores.timing.score >= 14 && /(?:언제|몇\s*월|얼마나\s*걸릴|시기가|타이밍이)/.test(normalized)) {
    scores.timing.score += 8;
  }

  return (Object.keys(scores) as Array<Exclude<TarotConcernTheme, 'binary_choice' | 'yes_no'>>)
    .map((theme) => ({
      theme,
      score: scores[theme].score,
      keywords: Array.from(scores[theme].keywords),
    }))
    .sort((a, b) => b.score - a.score);
}

function detectTarotTheme(
  text: string,
  kind: TarotConcernKind,
): Exclude<TarotConcernTheme, 'binary_choice' | 'yes_no'> {
  const ranked = scoreTarotThemes(text);
  const top = ranked[0];
  if (top && top.score >= 6) {
    return top.theme;
  }
  if (kind === 'yes_no') return 'obstacle';
  return 'general';
}

export function buildSpreadForTheme(
  theme: TarotConcernTheme,
  analysis: Pick<TarotConcernAnalysis, 'kind' | 'optionA' | 'optionB'> = { kind: 'open' },
): TarotSpreadRecommendation {
  const optionA =
    analysis.optionA && !/^[ABab](?:안|선택지)?$/.test(analysis.optionA.trim())
      ? analysis.optionA.trim()
      : '첫 번째 길(적극 변화·추진)';
  const optionB =
    analysis.optionB && !/^[ABab](?:안|선택지)?$/.test(analysis.optionB.trim())
      ? analysis.optionB.trim()
      : '두 번째 길(신중 유지·관망)';

  const spreads: Record<TarotConcernTheme, TarotSpreadRecommendation> = {
    daily: {
      id: 'daily_oracle_single',
      name: '오늘의 타로 (원카드 오라클)',
      cardCount: 1,
      reason: '78장의 천상 타로 휠에서 오늘 당신의 하루와 우주적 파동을 대변하는 단 1장의 카드를 뽑습니다.',
      positions: ['오늘의 우주 기운과 계시'],
      theme: 'daily',
    },
    super_money: {
      id: 'super_money_magnet',
      name: '💎 볼수록 돈을 끌어당기는 4대 슈퍼타로 재물자석 배열',
      cardCount: 4,
      reason: '카드를 펼칠 때마다 결핍의 무의식을 소멸시키고, 황금빛 부의 주파수와 자석 같은 현금 흐름을 강력하게 끌어당기는 슈퍼타로 특화 4단 배열입니다.',
      positions: [
        '1. 결핍을 지우는 황금빛 부의 무의식 (머니 마인드셋)',
        '2. 나를 향해 쏟아져 들어오는 거대한 재물 흐름 (머니 스트림)',
        '3. 오늘 즉시 실행할 슈퍼 부자 액션 & 돈맥 스위치 (머니 트리거)',
        '4. 평생 누릴 압도적인 경제적 자유와 황금 창고 (슈퍼 번영 결실)',
      ],
      theme: 'super_money',
    },
    lucky: {
      id: 'lucky_multiplier',
      name: '🍀 볼수록 운이 좋아지는 4대 럭키 개운 배열',
      cardCount: 4,
      reason: '침체된 탁기를 맑게 정화하고 카드를 펼칠 때마다 긍정적인 행운의 주파수가 눈덩이처럼 불어나, 볼수록 대길(大吉)과 대박 기적이 쏟아지는 럭키 개운 특화 4단 배열입니다.',
      positions: [
        '1. 지금 내 안에서 깨어나는 행운의 씨앗 & 탁기 정화 (잠재 럭키 & 정화)',
        '2. 운을 기하급수적으로 불려줄 대길 행운의 문 (럭키 증폭 & 기회의 문)',
        '3. 행운을 즉시 끌어당길 1일 1실천 럭키 개운 행동 (개운 스위치 & 비법)',
        '4. 쏟아져 들어올 황금빛 결실과 기적의 선물 (대길 대박 결실)',
      ],
      theme: 'lucky',
    },
    fortune_boost: {
      id: 'fortune_awakening',
      name: '🍀 볼수록 운이 좋아지는 4대 럭키 개운 배열',
      cardCount: 4,
      reason: '침체된 탁기를 맑게 정화하고 카드를 펼칠 때마다 긍정적인 행운의 주파수가 눈덩이처럼 불어나, 볼수록 대길(大吉)과 대박 기적이 쏟아지는 럭키 개운 특화 4단 배열입니다.',
      positions: [
        '1. 지금 내 안에서 깨어나는 행운의 씨앗 & 탁기 정화 (잠재 럭키 & 정화)',
        '2. 운을 기하급수적으로 불려줄 대길 행운의 문 (럭키 증폭 & 기회의 문)',
        '3. 행운을 즉시 끌어당길 1일 1실천 럭키 개운 행동 (개운 스위치 & 비법)',
        '4. 쏟아져 들어올 황금빛 결실과 기적의 선물 (대길 대박 결실)',
      ],
      theme: 'lucky',
    },

    angel: {
      id: 'angel_wings_guidance',
      name: '👼 천사의 날개 4대 영적 성장 배열',
      cardCount: 4,
      reason: '수호천사의 고차원적 빛의 주파수를 수신하여, 에고의 두려움을 정화하고 영혼의 본질적 성장과 승화를 이끄는 천사 특화 배열입니다.',
      positions: [
        '1. 현재 영혼의 주파수 & 천사의 첫 계시 (영혼의 현주소)',
        '2. 정화해야 할 에고의 두려움 & 무의식 장벽 (에고 정화)',
        '3. 수호천사가 건네는 고차원 지혜 & 빛의 인도 (빛의 나침반)',
        '4. 영혼이 도달할 궁극의 평화와 영적 승화 (천상의 축복)',
      ],
      theme: 'angel',
    },
    healing: {
      id: 'inner_child_soul_healing',
      name: '🌿 내면 아이 & 영혼 치유 4대 힐링 배열',
      cardCount: 4,
      reason: '지친 마음과 깊은 내면의 상처를 따뜻하게 어루만지고, 내면 아이와의 화해를 통해 온전한 자기 자비와 영혼의 평화를 되찾는 심층 치유 배열입니다.',
      positions: [
        '1. 지친 마음과 깊은 상처의 근원 (상처의 자각)',
        '2. 내면 아이가 진정으로 바라는 갈망 (내면 아이의 목소리)',
        '3. 마음을 어루만지는 자기 자비와 치유의 온기 (셀프 힐링 처방)',
        '4. 회복된 평온과 온전한 자아의 안식 (치유의 열매)',
      ],
      theme: 'healing',
    },
    new_year: {
      id: 'new_year_wheel',
      name: '🌸 신년 4계절 대운 배열',
      cardCount: 5,
      reason: '신년 한 해의 4계절(분기별) 흐름과 주요 기회, 그리고 1년 전체를 관통하는 대운의 핵심 조언을 읽는 신년 특화 5단 배열입니다.',
      positions: [
        '1. 1분기(봄 / 새로운 시작과 도약의 기회)',
        '2. 2분기(여름 / 열정적 성장과 확장)',
        '3. 3분기(가을 / 풍요로운 결실과 수확)',
        '4. 4분기(겨울 / 정리 정돈과 내면의 안정)',
        '5. 올 한 해를 관통하는 핵심 대운 조언 & 나침반',
      ],
      theme: 'new_year',
    },
    saju: {
      id: 'saju_four_pillars',
      name: '🔮 사주 4주 융합 배열',
      cardCount: 4,
      reason: '사주명리의 4기둥(년·월·일·시) 구조에 타로 상징을 투영하여, 선천적 기운과 사회적 성취, 본질적 정체성, 미래 결실을 종합 해독하는 명리 융합 배열입니다.',
      positions: [
        '1. 년주(근본 뿌리와 타고난 조상 기운)',
        '2. 월주(사회적 환경과 직업 성취)',
        '3. 일주(본인 정체성과 내면 본질)',
        '4. 시주(미래 흐름과 최종 결실)',
      ],
      theme: 'saju',
    },
    binary_choice: {
      id: 'binary_fork',
      name: '양자택일 배열',
      cardCount: 4,
      reason: '두 선택지의 결과를 나란히 비교해 한쪽을 명확히 가리키기 위한 배열입니다.',
      positions: ['현재 상황', `${optionA} 선택 시`, `${optionB} 선택 시`, '최종 조언'],
      theme: 'binary_choice',
    },
    yes_no: {
      id: 'yes_no_gate',
      name: '예·아니오 결정 배열',
      cardCount: 3,
      reason: '지금 실행해도 되는지, 무엇이 변수인지, 최종 판정을 빠르게 확인하는 배열입니다.',
      positions: ['현재 에너지', '숨은 변수', '최종 판정'],
      theme: 'yes_no',
    },
    love: {
      id: 'love_mirror',
      name: '관계 거울 배열',
      cardCount: 5,
      reason: '두 사람의 마음과 관계의 현실, 장애물을 입체적으로 읽는 배열입니다.',
      positions: ['나의 마음', '상대의 마음', '관계 현실', '장애물', '관계 조언'],
      theme: 'love',
    },
    career: {
      id: 'career_ladder',
      name: '성공의 계단 배열',
      cardCount: 5,
      reason: '목표 달성을 위한 현재 위치, 단계, 장애물, 조력을 단계별로 보는 배열입니다.',
      positions: ['현재 위치', '첫 번째 단계', '장애물', '조력자/자원', '최종 성취'],
      theme: 'career',
    },
    money: {
      id: 'wealth_flow',
      name: '재물 흐름 배열',
      cardCount: 4,
      reason: '돈의 흐름, 막힘, 기회, 실천 조언을 재정 고민에 맞춰 읽는 배열입니다.',
      positions: ['현재 재정 상태', '돈이 막히는 지점', '들어올 기회', '실천 조언'],
      theme: 'money',
    },
    timing: {
      id: 'time_gate',
      name: '시기 점검 배열',
      cardCount: 3,
      reason: '과거 영향, 현재 타이밍, 예상 시기를 짚어 언제 움직일지 보는 배열입니다.',
      positions: ['과거 영향', '현재 타이밍', '예상 시기/결과'],
      theme: 'timing',
    },
    obstacle: {
      id: 'block_breaker',
      name: '장애물 돌파 배열',
      cardCount: 3,
      reason: '상황, 핵심 장애물, 돌파 방법을 집중적으로 보는 배열입니다.',
      positions: ['현재 상황', '핵심 장애물', '돌파 조언'],
      theme: 'obstacle',
    },
    celtic_cross: CELTIC_CROSS_SPREAD,
    general: {
      id: 'past_present_future',
      name: '3카드 시간 배열',
      cardCount: 3,
      reason: '고민의 원인, 현재, 앞으로의 흐름을 가장 명확하게 보여주는 기본 배열입니다.',
      positions: ['과거/원인', '현재/상황', '미래/결과'],
      theme: 'general',
    },
  };

  return spreads[theme];
}

/** 퀵 프리셋용 인기 타로 배열법 목록 */
export const POPULAR_TAROT_SPREAD_PRESETS = [
  {
    theme: 'super_money' as const,
    name: '💎 슈퍼 타로 (머니 마그넷)',
    cardCount: 4,
    desc: '볼수록 돈을 끌어당기는 황금빛 부의 주파수 & 재물자석 결실',
    defaultPrompt: '볼수록 내게 거대한 돈과 재물을 강력하게 끌어당기는 슈퍼타로를 봐줘',
  },
  {
    theme: 'lucky' as const,
    name: '🍀 럭키 개운 타로 (볼수록 운 상승)',
    cardCount: 4,
    desc: '탁기 정화 & 볼수록 럭키 주파수 100배 증폭 대길 개운 배열',
    defaultPrompt: '오늘 내 운을 최고조로 끌어올리고 볼수록 대박 행운을 부르는 럭키 개운 타로를 봐줘',
  },
  {
    theme: 'angel' as const,
    name: '👼 천사 타로 (영적 성장)',
    cardCount: 4,
    desc: '수호천사의 고차원 계시 & 에고 정화와 영적 승화',
    defaultPrompt: '나의 수호천사가 지금 내 영적 성장을 위해 전하는 천상의 계시를 들려줘',
  },
  {
    theme: 'healing' as const,
    name: '🌿 힐링 타로 (내면 아이)',
    cardCount: 4,
    desc: '지친 마음 어루만짐 & 내면 아이와의 화해와 영혼 치유',
    defaultPrompt: '내 지친 마음과 내면 아이의 상처를 치유하고 평온을 되찾는 길을 알려줘',
  },
  {
    theme: 'daily' as const,
    name: '🌟 오늘의 타로 (원카드)',
    cardCount: 1,
    desc: '오늘 하루의 우주적 기운과 일일 오라클 계시',
    defaultPrompt: '오늘의 타로',
  },
  {
    theme: 'saju' as const,
    name: '🔮 사주 4주 융합 배열',
    cardCount: 4,
    desc: '사주 4기둥(년·월·일·시)에 타로를 투영한 종합 운명 해독',
    defaultPrompt: '나의 사주 4기둥(년월일시)과 타고난 선천 운명의 흐름을 타로로 해독해줘',
  },
  {
    theme: 'new_year' as const,
    name: '🌸 신년 4계절 대운 배열',
    cardCount: 5,
    desc: '신년 새해 4계절 분기별 흐름과 한 해 대운의 핵심 조언',
    defaultPrompt: '신년 새해 4계절 분기별 운의 흐름과 올해 대운의 조언을 알려줘',
  },
  {
    theme: 'binary_choice' as const,
    name: '⚖️ 양자택일 비교 배열',
    cardCount: 4,
    desc: '두 갈래 고민의 결과를 나란히 비교해 어느 쪽이 유리한지 명확히 판정',
    defaultPrompt: '새로운 곳으로 이직할까 vs 현재 직장에 남을까?',
  },
  {
    theme: 'yes_no' as const,
    name: '🎯 예/아니오 (YES or NO)',
    cardCount: 3,
    desc: '지금 실행해도 될까? 카드의 상징으로 밝히는 명쾌한 YES/NO 결단',
    defaultPrompt: '지금 이 결정을 실행해도 될까요? 확실한 YES인지 NO인지 알려줘',
  },
];

export const CELTIC_CROSS_SPREAD: TarotSpreadRecommendation = {
  id: 'celtic_cross',
  name: '셀틱 크로스 (심층 10장 배열)',
  cardCount: 10,
  reason: '복합적·심층 고민의 전체 맥락과 무의식, 외부 요인을 10장으로 입체 분석하는 정통 고급 배열입니다.',
  positions: [
    '현재 상황', '도전/장애', '무의식 기반', '과거 영향', '최근 영향',
    '가까운 미래', '본인 태도', '외부 영향', '희망/두려움', '최종 결과',
  ],
  theme: 'celtic_cross',
};

/** 전체 타로 배열법 목록 반환 */
export function getAllTarotSpreads(optionA = 'A', optionB = 'B'): TarotSpreadRecommendation[] {
  const allThemes: TarotConcernTheme[] = [
    'super_money',
    'lucky',
    'angel',
    'healing',
    'daily',
    'saju',
    'new_year',
    'binary_choice',
    'love',
    'career',
    'money',
    'timing',
    'obstacle',
    'yes_no',
    'celtic_cross',
    'general',
  ];

  return allThemes.map((theme) => buildSpreadForTheme(theme, { kind: 'open', optionA, optionB }));
}

function shouldUseCelticCross(
  text: string,
  theme: TarotConcernTheme,
  kind: TarotConcernKind,
): boolean {
  if (/(?:셀틱\s*크로스|셀틱|10장|열\s*장|열장|십카드|ten\s*cards?|celtic\s*cross|종합\s*타로|인생\s*전체|전체적인\s*운명)/i.test(text)) {
    return true;
  }
  if (kind !== 'open') return false;
  return (
    text.length >= 45 &&
    /(?:종합|심층|전체|깊이|상세|자세히|복합|다각도|포괄)/.test(text)
  );
}

/** 고민 문장을 분석해 주제·배열법을 함께 반환 */
export function recommendTarotSpread(concern: string): TarotSpreadRecommendation {
  return analyzeTarotConcern(concern).spread;
}

/** 타로 고민 자동 분석 (주제 + 배열법 + 키워드 + 대안 스프레드 포함) */
export function analyzeTarotConcern(concern: string): TarotConcernAnalysis {
  const text = concern.trim().replace(/\s+/g, ' ');
  if (!text) {
    const spread = buildSpreadForTheme('general', { kind: 'open' });
    const meta = getTarotThemeMeta('general');
    return {
      kind: 'open',
      theme: 'general',
      themeLabel: meta.label,
      themeEmoji: meta.emoji,
      recommendationReason: getTarotRecommendationReason('general', spread.name, spread.cardCount),
      spread,
      confidenceScore: 70,
      detectedKeywords: [],
      alternativeSpreads: [
        buildSpreadForTheme('love', { kind: 'open' }),
        buildSpreadForTheme('career', { kind: 'open' }),
        buildSpreadForTheme('money', { kind: 'open' }),
      ],
    };
  }

  if (isDailyTarotConcern(text)) {
    const spread = buildSpreadForTheme('daily', { kind: 'open' });
    const meta = getTarotThemeMeta('daily');
    return {
      kind: 'open',
      theme: 'daily',
      themeLabel: meta.label,
      themeEmoji: meta.emoji,
      recommendationReason: getTarotRecommendationReason('daily', spread.name, spread.cardCount),
      spread,
      confidenceScore: 99,
      detectedKeywords: ['오늘의 타로', '일일 운세'],
      alternativeSpreads: [
        buildSpreadForTheme('general', { kind: 'open' }),
        buildSpreadForTheme('lucky', { kind: 'open' }),
      ],
    };
  }

  const scored = scoreTarotThemes(text);
  const topScored = scored[0];
  const secondScored = scored[1];

  let kind: TarotConcernKind = 'open';
  let optionA: string | undefined;
  let optionB: string | undefined;

  // 1. Explicit Binary Choice (vs / 대 - must have whitespace to avoid matching Korean words like 거대한, 대박, 대운)
  const vsMatch = text.match(/^(.{2,48}?)\s+(?:vs\.?|VS|대)\s+(.{2,48}?)$/i);
  if (vsMatch) {
    const a = cleanTarotOption(vsMatch[1]);
    const b = cleanTarotOption(vsMatch[2]);
    if (hasMeaningfulOptions(a, b)) {
      kind = 'binary_choice';
      optionA = a;
      optionB = b;
    }
  }

  // 2. A와 B 중 / 둘 중 / 사이에서
  if (kind === 'open') {
    const betweenMatch = text.match(/(.{2,30}?)\s*(?:와|과|랑|하고)\s*(.{2,30}?)\s*(?:중(?:에서)?|사이(?:에서)?|둘\s*중|어느\s*쪽)/);
    if (betweenMatch) {
      const a = cleanTarotOption(betweenMatch[1]);
      const b = cleanTarotOption(betweenMatch[2]);
      if (hasMeaningfulOptions(a, b)) {
        kind = 'binary_choice';
        optionA = a;
        optionB = b;
      }
    }
  }

  // 3. A할까 B할까 / A일까 B일까
  if (kind === 'open') {
    const doubleKkaMatch = text.match(/(.{2,30}?할까(?:요)?|.{2,30}?갈까(?:요)?|.{2,30}?될까(?:요)?|.{2,30}?일까(?:요)?)\s*(?:,|아니면|vs|또는|\/|\s+)\s*(.{2,30}?할까(?:요)?|.{2,30}?갈까(?:요)?|.{2,30}?될까(?:요)?|.{2,30}?일까(?:요)?)/);
    if (doubleKkaMatch) {
      const a = cleanTarotOption(doubleKkaMatch[1]);
      const b = cleanTarotOption(doubleKkaMatch[2]);
      if (hasMeaningfulOptions(a, b)) {
        kind = 'binary_choice';
        optionA = a;
        optionB = b;
      }
    }
  }

  // 4. A가 나을까 B가 나을까
  if (kind === 'open') {
    const naulMatch = text.match(/(.+?나을까요?)\s*(?:아니면|vs|또는|\/)\s*(.+?나을까요?)/);
    if (naulMatch) {
      const a = cleanTarotOption(naulMatch[1]);
      const b = cleanTarotOption(naulMatch[2]);
      if (hasMeaningfulOptions(a, b)) {
        kind = 'binary_choice';
        optionA = a;
        optionB = b;
      }
    }
  }

  // 5. Action vs Inaction Dilemma (~할까 말까, ~갈까 말까, ~할지 말지) -> 양자택일 4장 배열로 두 길의 에너지를 대조!
  const isActionDilemma =
    /(?:이직할까\s*말까|퇴사할까\s*말까|연락할까\s*말까|고백할까\s*말까|만날까\s*말까|헤어질까\s*말까|이별할까\s*말까|투자할까\s*말까|매수할까\s*말까|매도할까\s*말까|창업할까\s*말까|이사할까\s*말까|갈까\s*말까|살까\s*말까|보낼까\s*말까|말할까\s*말까|시작할까\s*말까|도전할까\s*말까|할까\s*말까|해야\s*할까\s*말까|할지\s*말지|갈지\s*말지|만날지\s*말지|연락할지\s*말지|고백할지\s*말지|이직할지\s*말지|퇴사할지\s*말지|헤어질지\s*말지)/i.test(text);

  // 6. Explicit choice keywords
  if (
    kind === 'open' &&
    (isActionDilemma || /(?:둘\s*중\s*어느|양자택일|어느\s*쪽이\s*더|어느\s*선택|두\s*가지\s*중|두\s*길\s*중|선택의\s*기로)/.test(text))
  ) {
    kind = 'binary_choice';
  }

  // 양자택일일 때 질문에서 실제 두 가지 고민 선택지를 반드시 파악하여 채움 ('A', 'B' 사용 금지)
  if (kind === 'binary_choice' && (!optionA || !optionB || /^[ABab](?:안|선택지)?$/.test(optionA) || /^[ABab](?:안|선택지)?$/.test(optionB))) {
    const extracted = extractBinaryOptionsFromConcern(text);
    optionA = extracted.optionA;
    optionB = extracted.optionB;
  }

  // 7. Yes/No questions vs Rich Domain questions 정밀 구분
  if (kind === 'open') {
    const isExplicitYesNo =
      /(?:예\s*(?:\/|또는|혹은|아니면|,)?\s*아니[오요]|yes\s*(?:\/|or|,)?\s*no|yesno|예아니[오요]|예아니오\s*타로|yes\s*또는\s*no)/i.test(text);

    // 결과 판정형 딜레마 (성공할까 실패할까, 합격할까 불합격할까, 붙을까 떨어질까, 될까 안 될까)
    const isOutcomeVerdictDilemma =
      /(?:될까\s*안\s*될까|될지\s*안\s*될지|성공할까\s*실패할까|합격할까\s*불합격할까|붙을까\s*떨어질까|이뤄질까\s*안\s*이뤄질까)/i.test(text);

    const isSingleActionYesNo =
      /(?:해도\s*될까|해도\s*될까요|사도\s*될까|사도\s*될까요|가도\s*될까|가도\s*될까요|만나도\s*될까|만나도\s*될까요|연락해도\s*될까|연락해도\s*될까요|투자해도\s*될까|투자해도\s*될까요|이직해도\s*될까|이직해도\s*될까요|퇴사해도\s*될까|퇴사해도\s*될까요|시작해도\s*될까|시작해도\s*될까요|고백해도\s*될까|고백해도\s*될까요|말해도\s*될까|말해도\s*될까요|도전해도\s*될까|도전해도\s*될까요|할\s*수\s*있을까|할\s*수\s*있을까요|가능할까|가능할까요|맞을까|맞을까요|옳을까|옳을까요|성공할까|성공할까요|합격할까|합격할까요|붙을까|붙을까요|이뤄질까|이뤄질까요|연락\s*올까|연락\s*올까요|재회할\s*수\s*있을까|재회\s*가능할까|하는\s*게\s*맞을까|하는\s*게\s*좋을까|하는게\s*맞을까|하는게\s*좋을까)/i.test(text);

    // 다면적/복합적 질문 지시어 (속마음, 흐름, 어떻게, 언제, 조언, 이유, 원인, 전략, 전망 등)
    const hasMultiAspectIntent =
      /(?:속마음|진심|어떻게|어떡해|방법|전략|조언|앞으로|흐름|전망|이유|원인|언제|시기|타이밍|대처|방향|운세|걸림돌|장애물|비결|열쇠)/.test(text);

    if (isExplicitYesNo || isOutcomeVerdictDilemma) {
      kind = 'yes_no';
    } else if (isSingleActionYesNo) {
      // 도메인 점수(연애/커리어/재물/시기/장애물 등)가 높고 다면적 의도가 함께 있으면 도메인 전용 심층 스프레드를 우선 추천!
      const hasStrongDomainTheme =
        topScored &&
        topScored.theme !== 'general' &&
        topScored.score >= 5 &&
        (hasMultiAspectIntent || topScored.score >= 8);

      if (!hasStrongDomainTheme) {
        kind = 'yes_no';
      }
    }
  }

  // Safety guard: if the text strongly indicates a specific themed reading (e.g. 슈퍼타로/럭키/천사/힐링 등)
  // strictly prioritize the theme-based spread over binary_choice unless the user explicitly requested 양자택일 or ~할까 말까.
  const detectedThemeCandidate: TarotConcernTheme = detectTarotTheme(text, kind);
  const isExplicitBinaryChoice =
    isActionDilemma || /(?:양자택일|둘\s*중\s*어느|어느\s*쪽을\s*선택|두\s*가지\s*중|\bvs\.?\b)/i.test(text);

  if (
    kind === 'binary_choice' &&
    !isExplicitBinaryChoice &&
    (detectedThemeCandidate === 'super_money' ||
      detectedThemeCandidate === 'lucky' ||
      detectedThemeCandidate === 'fortune_boost' ||
      detectedThemeCandidate === 'angel' ||
      detectedThemeCandidate === 'healing' ||
      detectedThemeCandidate === 'new_year' ||
      detectedThemeCandidate === 'saju' ||
      detectedThemeCandidate === 'celtic_cross' ||
      detectedThemeCandidate === 'daily')
  ) {
    kind = 'open';
    optionA = undefined;
    optionB = undefined;
  }

  let theme: TarotConcernTheme =
    kind === 'binary_choice' ? 'binary_choice' : kind === 'yes_no' ? 'yes_no' : detectedThemeCandidate;
  let spread = buildSpreadForTheme(theme, { kind, optionA, optionB });

  if (theme !== 'daily' && shouldUseCelticCross(text, theme, kind)) {
    theme = 'celtic_cross';
    spread = CELTIC_CROSS_SPREAD;
  }

  const meta = getTarotThemeMeta(theme);
  const recommendationReason = getTarotRecommendationReason(
    theme,
    spread.name,
    spread.cardCount,
    { optionA, optionB }
  );

  // 감지된 핵심 키워드 추출 (최대 4개)
  const keywordSet = new Set<string>();
  if (kind === 'binary_choice' && optionA && optionB) {
    keywordSet.add(`${optionA} vs ${optionB}`);
  }
  for (const item of scored) {
    if (item.theme === theme || item.score >= 3) {
      for (const kw of item.keywords) {
        if (kw && kw.length >= 2) keywordSet.add(kw);
        if (keywordSet.size >= 4) break;
      }
    }
    if (keywordSet.size >= 4) break;
  }
  const detectedKeywords = Array.from(keywordSet).slice(0, 4);

  // 신뢰도 점수 계산 (78 ~ 99)
  const rawScore = topScored ? topScored.score : 0;
  const confidenceScore = Math.min(
    99,
    Math.max(78, Math.round(78 + Math.min(21, rawScore * 2.2 + (kind !== 'open' ? 6 : 0))))
  );

  // 대안 스프레드 추천 (사용자가 원터치로 전환할 수 있는 2~3개 연관 배열법)
  const altThemes: TarotConcernTheme[] = [];
  if (theme === 'binary_choice') {
    if (detectedThemeCandidate !== 'general') {
      altThemes.push(detectedThemeCandidate);
    }
    altThemes.push('yes_no');
    if (!altThemes.includes('general')) altThemes.push('general');
  } else if (theme === 'yes_no') {
    if (detectedThemeCandidate !== 'general') {
      altThemes.push(detectedThemeCandidate);
    }
    const extracted = extractBinaryOptionsFromConcern(text);
    optionA = optionA || extracted.optionA;
    optionB = optionB || extracted.optionB;
    altThemes.push('binary_choice');
    if (!altThemes.includes('general')) altThemes.push('general');
  } else {
    if (secondScored && secondScored.theme !== theme && secondScored.score >= 2.5) {
      altThemes.push(secondScored.theme);
    }
    if (/(?:할까|될까|맞을까|올까|있을까)/.test(text) && !altThemes.includes('yes_no')) {
      altThemes.push('yes_no');
    }
    if (/(?:고민|선택|결정|기회)/.test(text) && !altThemes.includes('binary_choice')) {
      altThemes.push('binary_choice');
    }
    if (!altThemes.includes('celtic_cross') && theme !== 'celtic_cross') {
      altThemes.push('celtic_cross');
    }
    if (!altThemes.includes('general') && theme !== 'general') {
      altThemes.push('general');
    }
  }

  const alternativeSpreads: TarotSpreadRecommendation[] = altThemes
    .filter((t, idx) => t !== theme && altThemes.indexOf(t) === idx)
    .slice(0, 3)
    .map((altTheme) => {
      if (altTheme === 'binary_choice') {
        const extracted = extractBinaryOptionsFromConcern(text);
        return buildSpreadForTheme('binary_choice', {
          kind: 'binary_choice',
          optionA: optionA || extracted.optionA,
          optionB: optionB || extracted.optionB,
        });
      }
      if (altTheme === 'yes_no') {
        return buildSpreadForTheme('yes_no', { kind: 'yes_no' });
      }
      return buildSpreadForTheme(altTheme, { kind: 'open' });
    });

  return {
    kind,
    theme,
    themeLabel: meta.label,
    themeEmoji: meta.emoji,
    recommendationReason,
    optionA,
    optionB,
    spread,
    confidenceScore,
    detectedKeywords,
    alternativeSpreads,
  };
}

type TarotCardContext = {
  nameKo?: string;
  name?: string;
  keywords?: string[];
  reversed?: boolean;
};

/** 사주·천문·프로필·오늘의 지배 카드·뽑힌 카드 키워드를 리딩 프롬프트에 주입 */
export function buildTarotContextPromptAddon(opts: {
  profile?: UserProfile | null;
  sajuData?: string;
  astroData?: string;
  cards?: TarotCardContext[];
  dailyCard?: (TarotCardContext & { diagnosis?: string; summary?: string }) | null;
}): string {
  const blocks: string[] = [];

  // 1. 프로필 & 사주명리 정밀 배경지식 주입
  const profile = opts.profile;
  const basic = profile?.basic;
  const saju = profile ? calculateDetailedSaju(profile) : null;

  if (basic?.name || basic?.birthdate || saju || opts.sajuData?.trim()) {
    const profileLines: string[] = [];
    if (basic?.name || basic?.nickname) {
      const preferredName = basic.nickname?.trim() || basic.name?.trim() || '질문자';
      profileLines.push(`· 질문자 호칭 (반드시 부를 이름): ${preferredName}`);
      if (basic.nickname?.trim() && basic.name?.trim() && basic.nickname.trim() !== basic.name.trim()) {
        profileLines.push(`· 호칭 절대 주의: 본명(${basic.name.trim()}) 대신 사용자가 설정한 닉네임 '${basic.nickname.trim()}'(으)로만 다정하고 정중하게 부를 것.`);
      }
    }
    if (basic?.birthdate) {
      profileLines.push(`· 생년월일: ${basic.birthdate} (${basic.lunarSolar === 'lunar' ? '음력' : '양력'})${basic.birthtime ? ` ${basic.birthtime}` : ''}${basic.birthCity ? ` / 출생지: ${basic.birthCity}` : ''}`);
    }
    if (basic?.gender) {
      profileLines.push(`· 성별: ${basic.gender === 'male' ? '남성' : (basic.gender === 'female' ? '여성' : '기타')}`);
    }
    if (profile?.psych?.mbti) {
      profileLines.push(`· MBTI/기질: ${profile.psych.mbti}`);
    }
    if (profile?.fate?.lifeGoal) {
      profileLines.push(`· 인생 핵심 목표: ${profile.fate.lifeGoal}`);
    }
    if (profile?.fate?.currentWorry) {
      profileLines.push(`· 최근 주요 고민: ${profile.fate.currentWorry}`);
    }

    if (saju) {
      profileLines.push(`· 사주 일간(Day Master) 본원: ${saju.dayMaster.hanja}(${saju.dayMaster.korean}) — ${saju.dayMaster.symbolName} [${saju.dayMaster.archetypeTitle}]`);
      profileLines.push(`· 사주 4기둥: 년주(${saju.pillars.year.full}) · 월주(${saju.pillars.month.full}) · 일주(${saju.pillars.day.full})${saju.pillars.hour ? ` · 시주(${saju.pillars.hour.full})` : ''}`);
      profileLines.push(`· 오행 에너지 밸런스: 최강 오행(${saju.elements.dominant.name} - ${saju.elements.percentages[saju.elements.dominant.element]}%) / 결핍 및 용신 오행(${saju.elements.lacking.name} - ${saju.elements.percentages[saju.elements.lacking.element]}%)`);
      profileLines.push(`· 2026 병오년(丙午年) 세운 테마: ${saju.annual2026.theme}`);
    } else if (opts.sajuData?.trim()) {
      profileLines.push(`· 사주 요약: ${opts.sajuData.trim()}`);
    }

    blocks.push(
      `[👤 질문자 프로필 & 사주 명리학 배경지식 (Personal Identity & Saju Context)]\n` +
      profileLines.join('\n') +
      `\n[프로필 & 사주 배경지식 융합 필수 지침]\n` +
      `1. 질문자의 이름/호칭과 생년월일, 성향, 그리고 타고난 사주 본원(${saju ? saju.dayMaster.symbolName : '기운'})과 오행 균형을 타로 리딩의 깊은 내면 배경지식(Context)으로 삼으십시오.\n` +
      `2. 단순히 프로필을 읊는 데 그치지 않고, 뽑힌 카드가 질문자의 타고난 기운(${saju ? `${saju.dayMaster.symbolName}, ${saju.elements.lacking.name} 보완` : '기질'})과 어떻게 공명하고 상호작용하는지 1단계(상황 진단)부터 5단계(행동 계획), 6단계(결단)까지 질문자 한 사람만을 위한 맞춤형 조언으로 자연스럽게 녹여내십시오.`
    );
  }

  if (opts.astroData?.trim()) {
    blocks.push(`[천문 컨텍스트]\n${opts.astroData.trim()}`);
  }
  if (opts.dailyCard) {
    const dCard = opts.dailyCard;
    const dLabel = dCard.nameKo || dCard.name || '오늘의 카드';
    const dOrient = dCard.reversed ? '역방향' : '정방향';
    const dEffKw = getEffectiveTarotKeywords(dCard);
    const dKw = dEffKw.length ? dEffKw.join(', ') : '';
    const dCaution = dCard.reversed ? getTarotCardCaution(dCard) : '';
    const dDiag = dCard.diagnosis || dCard.summary || '';
    blocks.push(
      `[🌟 오늘의 지배 오라클 카드 (Daily Cosmic Anchor)]\n` +
      `· 카드: ${dLabel} (${dOrient})${dKw ? ` — 핵심 키워드: ${dKw}` : ''}${dCaution ? ` | 역방향 주의점 1가지: ${dCaution}` : ''}\n` +
      `${dDiag ? `· 오늘 하루의 운명적 기조: ${dDiag.slice(0, 140)}...\n` : ''}` +
      `[오늘의 지배 카드 연계 필수 지침]\n` +
      `질문자의 이번 고민은 오늘 하루를 관통하는 [${dLabel}]의 에너지 장(Field) 안에서 전개되고 있습니다. 1단계(상황 진단), 4단계(카드 해독), 5단계(행동 계획), 6단계(결단)에서 오늘의 지배 카드의 기운이 이번 고민에 미치는 영향과 인과적 연결고리를 자연스럽고 깊이 있게 융합하여 서술하십시오.`
    );
  }
  if (opts.cards?.length) {
    const lines = opts.cards
      .map((card, i) => {
        const label = card.nameKo || card.name || `카드 ${i + 1}`;
        const orient = card.reversed ? '역방향' : '정방향';
        const d = getTarotCardDetails(card);
        const effKws = getEffectiveTarotKeywords(card);
        const revData = card.reversed ? getTarotReversedData(card) : null;
        const caution = card.reversed ? getTarotCardCaution(card) : '';
        const detailStr = d
          ? ` — 키워드: ${effKws.join(', ')} | 원형: ${d.archetype} | 상징: ${d.symbolWord} | ${card.reversed ? `역방향 고유 뜻(정방향 뜻 적용 금지): ${revData?.meaning || d.reversedCore} | ⚠️ 이 카드의 주의점 1가지: ${caution}` : `정방향 본래 뜻: ${d.uprightCore}`}`
          : (effKws.length ? ` — 키워드: ${effKws.join(', ')}${caution ? ` | ⚠️ 주의점 1가지: ${caution}` : ''}` : '');
        return `· ${label} (${orient})${detailStr}`;
      })
      .join('\n');
    blocks.push(
      `[★ 뽑힌 카드의 고유한 상징과 정/역방향 본래 뜻 해독 가이드]\n${lines}\n- [필수 규칙 1 - 역방향 카드 정방향 오해석 절대 금지]: 역방향(Reversed)으로 뽑힌 카드는 절대로 정방향의 긍정적 뜻이나 정방향 키워드로 풀이하지 마십시오. 반드시 위에 제시된 '역방향 고유 뜻'과 역방향 키워드로만 명확하게 해석하십시오.\n- [필수 규칙 2 - 역방향 카드별 주의점 1가지 필수 안내]: 역방향 카드가 나왔을 때는 해당 카드 풀이 시 본문 속에 그 카드와 관련된 **주의점 1가지**를 자연스럽게 녹여 설명하고, 동시에 **⚠️ [카드명 역방향 주의점 1가지]: (핵심 주의점 문장)** 형태로 한 줄 강조하여 명확히 알려주십시오. (정방향 카드에는 주의점 강조 줄을 붙이지 마십시오.)`,
    );
  }
  if (!blocks.length) return '';
  return `

${blocks.join('\n\n')}

[개인화 규칙]
질문자의 프로필, 사주명리 본원, 오늘의 지배 카드, 뽑힌 카드의 키워드를 질문 맥락에 맞게 유기적으로 융합하여 서술하십시오.`;
}

export function formatVisionTarotResult(
  result: { cards?: Array<{ name: string; position?: string }>; guidance?: string; vibe?: string },
  concern: string,
  deckName?: string,
): string {
  const cardLines =
    result.cards?.map((c) => `· **${c.name}** (${c.position || '정방향'})`).join('\n') ||
    '· (카드 인식 정보 없음)';
  return `### 🔮 비전 포털 리딩${deckName ? ` · ${deckName}` : ''}
**고민:** "${concern}"

**인식된 카드:**
${cardLines}

**해석:**
${result.guidance || '가이던스를 수신하지 못했습니다. 잠시 후 다시 시도해 주세요.'}

${result.vibe ? `**에너지 분위기:** ${result.vibe}` : ''}`;
}

/** 리딩 프롬프트에 붙이는 배열법 지침 */
export function buildTarotSpreadPromptAddon(
  spread: TarotSpreadRecommendation,
  cards?: TarotCardContext[],
): string {
  const cardLines = cards?.length
    ? cards
        .map(
          (card, i) => {
            const orient = card.reversed ? ' [역방향]' : ' [정방향]';
            const d = getTarotCardDetails(card);
            const effKws = getEffectiveTarotKeywords(card);
            const revData = card.reversed ? getTarotReversedData(card) : null;
            const caution = card.reversed ? getTarotCardCaution(card) : '';
            const detailStr = d
              ? ` (키워드: ${effKws.slice(0, 3).join(', ')}, 상징: ${d.symbolWord}, ${card.reversed ? `역방향 고유 뜻: ${revData?.meaning || d.reversedCore}, ⚠️ 주의점 1가지: ${caution}` : `정방향 본래 뜻: ${d.uprightCore}`})`
              : (effKws.length ? ` (${effKws.slice(0, 3).join(', ')})` : '');
            return `· ${spread.positions[i] || `${i + 1}번`}: **${card.nameKo || card.name || `카드 ${i + 1}`}**${orient}${detailStr}`;
          },
        )
        .join('\n')
    : spread.positions.map((pos, i) => `· ${i + 1}번(${pos})`).join('\n');

  let themeSpecificDirective = '';
  if (spread.id === 'super_money_magnet' || spread.theme === 'super_money') {
    themeSpecificDirective = `\n\n[💎 '볼수록 돈을 끌어당기는 슈퍼타로' 특별 재물자석 지침]\n1. 이 리딩은 질문자의 뇌와 무의식에 '나는 돈과 부를 강력하게 끌어당기는 황금빛 자석이다'라는 부의 신경망을 각인시키는 '슈퍼 머니 마그넷 선언문'입니다.\n2. 1번(머니 마인드셋)에서는 돈에 대한 가난의 불안과 결핍의 두려움을 부의 확신과 풍요의 주파수로 단호하게 전환하십시오.\n3. 2번(머니 스트림)에서는 질문자를 향해 어떤 강력한 통로로 거대한 현금과 수입의 기회가 쏟아져 들어올지 가슴 뛰게 짚어주십시오.\n4. 3번(머니 트리거)에서는 오늘 당장 실행할 수 있는 현실적이고 강력한 1가지 부자 행동(지갑 정돈, 돈맥을 뚫는 소비 교정, 부의 감사 확언 등)을 처방하십시오.\n5. 4번(슈퍼 번영 결실)에서는 마침내 손에 쥐게 될 압도적인 경제적 자유와 황금 창고의 완성을 마스터의 위엄과 확신으로 선포하십시오.`;
  } else if (spread.id === 'lucky_multiplier' || spread.id === 'fortune_awakening' || spread.theme === 'lucky' || spread.theme === 'fortune_boost') {
    themeSpecificDirective = `\n\n[🍀 '볼수록 운이 좋아지는 럭키 개운 타로' 특별 대길(大吉) 증폭 지침]\n1. 이 리딩은 읽는 것만으로도 탁기가 씻겨나가고 온몸의 기운이 환해지며 행운 주파수가 100배로 솟구치는 '우주 최강의 럭키 개운 축복문'입니다.\n2. 1번(잠재 럭키 & 정화)에서는 내담자의 마음과 일상에서 당장 비워낼 무거운 에너지를 다정하게 짚고, 본래 품고 있는 반짝이는 복의 씨앗을 일깨워 주십시오.\n3. 2번(럭키 증폭 & 기회의 문)에서는 오늘부터 활짝 열릴 뜻밖의 횡재와 대길 행운의 기회를 환한 빛의 언어로 가슴 뛰게 예고하십시오.\n4. 3번(개운 스위치 & 비법)에서는 오늘 당장 실행할 수 있는 1~3분 초구체적 1일 1실천 개운 행동(미소, 럭키 컬러, 공간 정돈, 감사 확언 등) 1가지를 유쾌하고 명확하게 처방하십시오.\n5. 4번(대길 대박 결실)에서는 이 리딩과 실천을 통해 내담자에게 쏟아져 들어올 기적 같은 대박 행운과 번영을 확신에 찬 목소리로 축복하십시오.`;
  } else if (spread.id === 'angel_wings_guidance' || spread.theme === 'angel') {
    themeSpecificDirective = `\n\n[👼 '천사 타로 (영적 성장)' 수호천사 빛의 계시 지침]\n1. 수호천사의 거룩한 날개 아래에서 내담자의 영혼 주파수를 감싸 안듯, 맑고 고결하며 따스한 영적 어조로 리딩하십시오.\n2. 1번(영혼의 현주소)에서는 질문자가 지금 어떤 영적 배움과 진화의 단계에 와 있는지 비추어 주십시오.\n3. 2번(에고 정화)에서는 영혼의 빛을 가리는 두려움, 죄책감, 불필요한 집착을 자비롭게 내려놓도록 이끌어 주십시오.\n4. 3번(빛의 나침반)에서는 천사가 건네는 고차원적 지혜와 직관의 사인을 명확히 전해 주십시오.\n5. 4번(천상의 축복)에서는 영혼이 마주할 온전한 평화와 승화의 은총을 축복하십시오.`;
  } else if (spread.id === 'inner_child_soul_healing' || spread.theme === 'healing') {
    themeSpecificDirective = `\n\n[🌿 '힐링 타로 (내면 아이)' 심층 치유 & 자기 자비 지침]\n1. 어떤 비판이나 판단도 없이, 내담자의 지친 마음과 숨어 우는 내면 아이를 안아주는 극진한 자기 자비(Self-Compassion)의 어조로 말씀하십시오.\n2. 1번(상처의 자각)에서는 억눌러왔던 아픔과 피로를 다정하게 인정하고 알아차려 주십시오.\n3. 2번(내면 아이의 목소리)에서는 오랜 시간 외면당했던 내면 아이의 진정한 갈망과 눈물을 대변해 주십시오.\n4. 3번(셀프 힐링 처방)에서는 오늘 스스로에게 건넬 수 있는 가장 따뜻한 위로와 호흡, 셀프 허그, 휴식의 행동을 처방하십시오.\n5. 4번(치유의 열매)에서는 상처를 지나 회복될 깊은 내면의 평온과 온전한 자아의 안식을 선물하십시오.`;
  } else if (spread.id === 'new_year_wheel' || spread.theme === 'new_year') {
    themeSpecificDirective = `\n\n[🌸 '신년 4계절 대운 배열' 특별 신년 운세 지침]\n1. 신년 한 해를 관통하는 사계절(1~4분기)의 리듬과 기운의 전환점을 한 편의 대하드라마처럼 입체적으로 해독하십시오.\n2. 1분기(봄)에서는 시작과 기회, 2분기(여름)에서는 확장과 성장, 3분기(가을)에서는 결실과 수확, 4분기(겨울)에서는 안정과 도약을 명확히 짚어주십시오.\n3. 5번(올 한 해의 핵심 대운 조언)에서는 내담자가 올해를 최고의 한 해로 만들기 위해 가슴에 품어야 할 '운명의 열쇠'를 마스터의 깊은 혜안으로 선사하십시오.`;
  } else if (spread.id === 'saju_four_pillars' || spread.theme === 'saju') {
    themeSpecificDirective = `\n\n[🔮 '사주 4주 융합 배열' 명리 & 타로 종합 해독 지침]\n1. 사주의 4기둥(년주-근본, 월주-사회/직업, 일주-본인내면, 시주-미래결실)에 투영된 타로 카드의 상징을 명리의 깊이와 함께 융합 해석하십시오.\n2. 선천적으로 타고난 기운과 후천적 환경의 조화를 짚어주고, 내담자가 본래 지닌 잠재력을 극대화할 수 있는 방향을 명쾌하게 밝혀주십시오.`;
  } else if (spread.id === 'celtic_cross' || spread.theme === 'celtic_cross') {
    themeSpecificDirective = `\n\n[✨ '셀틱 크로스 (심층 10장 배열)' 정통 심층 해독 지침]\n1. 총 10장의 카드가 유기적으로 연결된 정통 셀틱 크로스의 상징성을 극대화하여, 내담자의 표면적 현실뿐만 아니라 무의식의 심연과 외부 환경적 변수, 최종 귀결까지 한 편의 웅장한 운명 교향곡처럼 심층 해독하십시오.\n2. 1번(현재 상황)과 2번(도전/장애)의 교차 에너지를 집중 분석하여 문제의 핵심 긴장을 밝히십시오.\n3. 3번(무의식)과 4번(과거), 5번(최근), 6번(가까운 미래)의 시간축을 따라 의식하지 못했던 심리적 원인을 통찰하십시오.\n4. 7번(내담자 태도), 8번(외부 영향), 9번(희망과 두려움)을 입체적으로 엮어 최종 10번(결과 및 조언)으로 명쾌하게 수렴되도록 마스터의 통찰을 선사하십시오.`;
  }

  return `

[🎴 적용 배열법: ${spread.name}]
- 배열의 영적 목적: ${spread.reason}
- 카드 수: ${spread.cardCount}장
- 위치별 상징 의미:
${cardLines}

[마스터 리딩 필수 규칙]
1. [★ 최우선 필수: 카드의 상징과 정/역방향 본래 뜻 중심 해독] 카드 이름만 언급하고 지나가는 단순한 수박 겉핥기식 해석을 엄격히 금지합니다. 해당 위치(${spread.positions.join(' → ')})에 놓인 각 카드의 도상학적 상징(그림 속 인물, 도구, 배경 색채, 원소)과 정방향/역방향의 깊은 뜻을 중심 근거로 삼아, 질문자의 고민과 밀접하게 결합하여 해독하십시오.
2. [★ 역방향 카드 해독 및 주의점 1가지 필수 제시] 역방향([역방향])으로 뽑힌 카드는 정방향 뜻으로 풀이하지 말고 반드시 **역방향 고유의 뜻(에너지의 과잉·결핍·지연·내면의 그림자)**으로 풀이하십시오. 또한 해당 역방향 카드를 풀이할 때 반드시 그 카드와 관련된 **주의점 1가지**를 본문 속에 자연스럽게 녹여 설명하고, 동시에 **⚠️ [카드명 역방향 주의점 1가지]: (핵심 주의점 한 줄)** 형태로 별도 강조하여 알려주십시오. (정방향 카드에는 주의점 줄을 추가하지 마십시오.)
3. 각 카드는 실제 타로 상담실에서 1:1로 카드를 짚어가며 들려주듯 생생한 대화체로 풀이하십시오.
4. 딱딱한 나열식이 아니라, 카드들의 상징과 위치가 서로 말을 건네며 엮이는 하나의 생생한 운명 스토리로 해독하십시오.
5. 타로의 점괘는 고정된 숙명이 아니라 현재의 흐름을 비추는 나침반임을 자연스럽게 일깨우며, 내담자 본인의 의지와 주체적 실천이 미래를 바꾼다는 긍정적 자율성과 용기를 북돋워 주십시오.${themeSpecificDirective}`;
}

/** 양자택일/결정형 질문일 때 타로 시스템 프롬프트에 붙이는 추가 지침 */
export function buildTarotBinaryChoicePromptAddon(analysis: TarotConcernAnalysis): string {
  if (analysis.kind === 'open') return '';

  if (analysis.kind === 'binary_choice') {
    const optA =
      analysis.optionA && !/^[ABab](?:안|선택지)?$/.test(analysis.optionA.trim())
        ? analysis.optionA.trim()
        : '첫 번째 선택지';
    const optB =
      analysis.optionB && !/^[ABab](?:안|선택지)?$/.test(analysis.optionB.trim())
        ? analysis.optionB.trim()
        : '두 번째 선택지';

    return `

[⚖️ 양자택일 질문 상담 지침 — 기계적 'A안/B안' 표기 절대 금지 & 오직 단 하나의 승자만 명확히 결정!]
내담자는 현재 두 가지 구체적인 길 사이에서 인생의 중대한 갈림길에 서 있습니다:
- 첫 번째 고민 선택지: **[${optA}]**
- 두 번째 고민 선택지: **[${optB}]**

[★ 양자택일 마스터 결단 절대 규칙 — 중립/양다리/절충안 100% 엄격 금지!]
1. [기계적 기호 사용 금지]: 리딩 본문과 요약 어디에서도 절대로 'A안', 'B안', '선택지 A', '선택지 B', 'A를 선택', 'B를 선택' 같은 무미건조한 기호를 쓰지 마십시오! 반드시 내담자의 실제 선택지 이름인 **[${optA}]**와 **[${optB}]**를 직접 명시하십시오.
2. [단 하나의 명확한 승자(Winner) 판정 필수 — 둘 다 좋다는 식의 회피 전면 금지]:
   - "둘 다 일장일단이 있습니다", "어느 쪽이든 배움과 성장의 기회입니다", "마음의 소리에 맡기십시오" 같은 식의 비겁한 양다리나 회피성 조언은 100% 절대 금지합니다!
   - 2번 카드([${optA}] 선택 시)와 3번 카드([${optB}] 선택 시)의 도상과 정/역방향 기운, 그리고 4번 최종 조언 카드를 면밀히 비교하여, **오직 한쪽 길만을 승자(Winner)로 확실하게 못 박아 선언**하십시오.
3. [최상단 3줄 요약 단일 승자 선언]:
   - 최상단의 [핵심 3줄 요약] 중 [최종 선택 판정] 항목에서 반드시 **"최종 결단은 [${optA}] (적합도 OO%)이며..."** 또는 **"최종 결단은 [${optB}] (적합도 OO%)이며..."**와 같이 승자 선택지 명칭을 가장 먼저 대괄호 안에 단독 선언하십시오.
4. [본문 4단계 결단 섹션 단독 선언]:
   - '4. 트리니티 마스터의 결정적 최종 결단' 섹션의 첫 문장에서 반드시 **🎯 마스터의 최종 결단: [${optA}] 승자 판정 (추천도 OO%)** 또는 **🎯 마스터의 최종 결단: [${optB}] 승자 판정 (추천도 OO%)**를 굵은 단독 제목으로 크고 명확하게 선언하십시오.
5. [손익 비교 & 탈락한 쪽의 리스크 직언]:
   - 선택된 길([승자])이 왜 압도적으로 유리한지 현실적 손익(수익, 커리어 안정성, 관계의 진전 등 구체적 팩트)을 설명하십시오.
   - 반대로 탈락한 다른 쪽 길은 왜 지금 선택하면 안 되는지(감수해야 할 손실, 뒤따를 후회, 에너지의 정체 등 구체적 위험)를 가차없이 냉철하게 경고하여 질문자가 미련 없이 버릴 수 있도록 결단을 내려주십시오.
6. [추상적 수사 금지 & 극사실주의 서술]:
   - "내면의 빛", "영혼의 파동" 등 모호한 철학적 비유를 배제하고, 실제 현실(직장 상사/연봉, 연애 상대방의 반응, 돈의 손실/이득, 계약 조건)에서 펼쳐질 실제 사건으로 서술하십시오.`;
  }

  if (analysis.kind === 'yes_no') {
    return `

[🎯 예/아니오 (YES / NO) 결정 질문 특별 지침]
내담자는 지금 실행 여부나 결과에 대해 확실한 '예(YES)' 또는 '아니오(NO)'의 명쾌한 결단을 절실히 원하고 있습니다.

[예/아니오 판정 마스터 절대 규칙]
1. '3. 트리니티 마스터의 직관적 결단 & 방향성' 섹션 첫 줄에 반드시 **최종 판정: [YES]** 또는 **최종 판정: [NO]** (상황에 따라 신중한 보완이 필요할 시 **최종 판정: [조건부 YES]**)를 크고 명확하게 선언하십시오.
   - 절대로 'YES'나 'NO' 단어를 생략하거나 애매한 말로 얼버무리지 마십시오.
   - 반드시 **최종 판정: [YES]** 또는 **최종 판정: [NO]**라고 명확한 영문 단어를 대괄호 안에 포함하여 선언해야 합니다.
2. 선언 직후, 뽑힌 카드의 상징과 정방향/역방향의 깊은 뜻(특히 3번째 최종 판정 카드의 기운)을 근거로 삼아 왜 [YES] 또는 [NO]인지 그 필연적 이유를 설득력 있고 확신에 찬 목소리로 풀어내십시오.
3. 최상단의 [핵심 3줄 요약] 중 [방향과 결단] 항목에서도 "최종 판정은 [YES]이며..." 혹은 "최종 판정은 [NO]이며..."와 같이 판정 결과(YES 또는 NO)를 빠짐없이 명시하십시오.`;
  }

  return `

[✅ 실행/방향 결정 질문 상담 지침]
내담자는 실행 여부 및 구체적인 행동 방향에 대해 명쾌한 결단을 원하고 있습니다.

[결정 마스터 규칙]
1. '3. 트리니티 마스터의 직관적 결단 & 방향성' 섹션 첫 줄에 카드의 상징과 본질에 근거한 명확하고 구체적인 실행 방향(예: **[적극적인 실행과 도약 권장]**, **[신중한 검토와 호흡 조율 필요]**, **[새로운 대안 모색 권고]**, **[내실 다지기 우선]**) 형태로 품격 있게 선언하십시오.
2. 막연히 '때를 기다리라'는 식의 무책임한 회피를 금하며, 질문에 대한 카드의 목소리를 명확하게 들려주십시오.`;
}

export interface ThemeTailoredStructure {
  themeTitle: string;
  themeBadge: string;
  themeEmoji: string;
  themeGradient: string;
  stepTitles: [string, string, string, string, string];
  stepDescriptions: [string, string, string, string, string];
  summaryLabels: [string, string, string];
}

/** 배열법 및 테마별 1:1 맞춤 리딩 구성 설계자 */
export function getThemeTailoredReadingStructure(
  spread: TarotSpreadRecommendation,
  analysis?: TarotConcernAnalysis,
  tarotConcern = '',
): ThemeTailoredStructure {
  const isDaily = spread.cardCount === 1 || tarotConcern.includes('오늘의 타로') || tarotConcern.includes('데일리 타로');
  const theme = spread.theme || analysis?.theme || 'general';

  if (isDaily) {
    return {
      themeTitle: '오늘의 데일리 타로',
      themeBadge: '1-CARD DAILY ORACLE',
      themeEmoji: '🕯️',
      themeGradient: 'from-yellow-500/20 via-amber-500/10 to-transparent',
      stepTitles: [
        '### 🕯️ 1. 오늘의 지배 에너지와 카드의 원형적 본질',
        '### 🎴 2. 카드가 비추는 하루의 현실적 사건과 인과관계',
        '### 🔮 3. 트리니티 마스터의 오늘 하루 나침반 & 주의할 그림자',
        '### 🌿 4. 오늘 바로 운을 바꾸는 1일 1실천 처방 (개운 가이드)',
        '### ✨ 5. 당신의 발걸음을 지켜주는 오늘의 수호 축복',
      ],
      stepDescriptions: [
        '오늘 뽑힌 카드의 도상학적 상징과 원형적 본질을 해독하며 하루의 기저 에너지를 진단하세요.',
        '오늘 마주할 일상과 관계, 일 속에서 카드의 기운이 어떻게 실체화될지 짚어주세요.',
        '오늘 가장 경계해야 할 마음의 함정과 나아가야 할 올바른 방향을 명확히 선언하세요.',
        '오늘 당장 실행할 수 있는 현실적이고 구체적인 1일 1개운 행동을 처방하세요.',
        '내담자의 발걸음마다 빛이 깃들도록 따뜻한 수호 축복의 한마디를 건네세요.',
      ],
      summaryLabels: ['오늘의 지배 에너지', '오늘 하루 나침반', '1일 1실천 처방'],
    };
  }

  if (theme === 'love') {
    return {
      themeTitle: '관계 거울 타로 (연애 & 인연)',
      themeBadge: 'LOVE & RELATIONSHIP MIRROR',
      themeEmoji: '💖',
      themeGradient: 'from-pink-500/20 via-rose-500/10 to-transparent',
      stepTitles: [
        '### 💖 1. 두 사람의 인연의 파동과 현재 심리 (나와 상대의 내면 에너지)',
        '### 🪞 2. 상대방의 숨겨진 속마음 & 관계의 현실적 장벽 (카드별 상징 심층 해독)',
        '### 🔮 3. 마스터의 관계 결단 & 인연의 나침반 (만남·재회·거리두기 최종 방향)',
        '### 🌿 4. 사랑의 주파수를 높이는 소통 처방 & 관계 개운 가이드',
        '### ✨ 5. 두 영혼의 안녕과 성숙을 축복하는 사랑의 한마디',
      ],
      stepDescriptions: [
        '질문자님의 마음 상태와 상대방과의 에너지 교류 국면을 짚어 공감대를 형성하세요.',
        '상대의 무의식적 속마음, 말 못 할 갈등, 관계를 가로막는 실질적 장애물을 카드의 도상으로 해독하세요.',
        '관계의 진전, 화해, 잠시의 거리두기 등 카드가 가리키는 최종 결단을 확신에 찬 어조로 선언하세요.',
        '오해를 풀고 사랑의 파동을 회복하는 구체적인 대화법과 소통 행동을 처방하세요.',
        '서로의 성숙과 행복을 빌어주는 깊은 사랑의 축복을 전하세요.',
      ],
      summaryLabels: ['현재 인연 파동', '마스터 관계 결단', '사랑의 소통 처방'],
    };
  }

  if (theme === 'super_money' || theme === 'money') {
    return {
      themeTitle: theme === 'super_money' ? '슈퍼 머니 마그넷 타로' : '재물 흐름 타로',
      themeBadge: 'WEALTH & MONEY MAGNET',
      themeEmoji: '💎',
      themeGradient: 'from-amber-500/25 via-yellow-500/15 to-transparent',
      stepTitles: [
        '### 💰 1. 현재 머니 마인드셋과 부의 주파수 (돈의 흐름 에너지 진단)',
        '### 💎 2. 돈맥이 막힌 지점 & 황금빛 기회의 통로 (카드별 재물 상징 해독)',
        '### 🔮 3. 트리니티 마스터의 재물 결단 & 경제적 도약 나침반 (투자·확장·절제 방향)',
        '### ⚡ 4. 오늘 즉시 실행하는 1일 1실천 부자 행동 & 머니 트리거 (재정 개운법)',
        '### 👑 5. 압도적 풍요와 경제적 자유를 향한 황금빛 축복 선언',
      ],
      stepDescriptions: [
        '돈에 대한 결핍감이나 불안을 점검하고 현재 재정 에너지 흐름을 정밀 진단하세요.',
        '지출 누수나 정체 원인을 짚고, 돈이 쏟아져 들어올 기회의 통로를 카드의 상징으로 밝히세요.',
        '투자, 이직, 사업 확장, 리스크 관리 등 명확한 부의 방향성을 마스터의 위엄으로 결단하세요.',
        '지갑 정돈, 돈맥을 뚫는 소비 교정, 부의 확언 등 오늘 당장 실행할 부자 행동을 처방하세요.',
        '풍요의 신념을 각인시키는 확신에 찬 황금빛 축복을 선언하세요.',
      ],
      summaryLabels: ['부의 주파수 진단', '재물 결단과 나침반', '즉시 실행 머니 트리거'],
    };
  }

  if (theme === 'career') {
    return {
      themeTitle: '성공의 계단 타로 (커리어 & 성취)',
      themeBadge: 'CAREER & SUCCESS LADDER',
      themeEmoji: '💼',
      themeGradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
      stepTitles: [
        '### 🧭 1. 커리어 현주소와 숨은 잠재 역량 (현장 에너지 진단)',
        '### 🪜 2. 성공을 가로막는 장애물 & 단계별 돌파 전략 (카드별 커리어 상징 해독)',
        '### 🎯 3. 합격·이직·승진 마스터 결단 & 프로페셔널 나침반',
        '### 🛠️ 4. 업무 현장 현실 실행 툴킷 & 실전 처방 (커리어 개운 행동)',
        '### 🏆 5. 위대한 성취와 도약을 응원하는 승리의 축복',
      ],
      stepDescriptions: [
        '현재 직무와 프로젝트에서 발휘되고 있는 내면의 역량과 현장 에너지를 진단하세요.',
        '목표 달성을 지체시키는 장애물과 이를 넘어서기 위한 구체적 단계 전략을 해독하세요.',
        '이직, 잔류, 시험 합격, 승진 등에 대한 명쾌한 마스터의 최종 판정을 선언하세요.',
        '우선순위 재정렬, 동료와의 관계 조율, 실무 집중 전략 등 현장 실행 툴킷을 처방하세요.',
        '커리어의 위대한 전성기를 열어젖힐 승리와 확신의 축복을 전하세요.',
      ],
      summaryLabels: ['커리어 역량 진단', '마스터 커리어 결단', '실무 현장 돌파 처방'],
    };
  }

  if (theme === 'yes_no') {
    return {
      themeTitle: '예·아니오 결정 타로 (YES / NO GATE)',
      themeBadge: 'DEFINITIVE VERDICT',
      themeEmoji: '🎯',
      themeGradient: 'from-violet-500/20 via-indigo-500/10 to-transparent',
      stepTitles: [
        '### ⚖️ 1. 현재 상황의 기저 에너지와 질문의 본질',
        '### 🔍 2. 카드가 비추는 숨은 변수와 현실적 인과관계 (카드별 상징 해독)',
        '### 🎯 3. 마스터의 최종 판정: [YES / NO / 조건부 YES] 및 필연적 이유',
        '### 🛡️ 4. 성공 확률을 100%로 끌어올릴 핵심 대비책 & 행동 지침',
        '### ✨ 5. 결단을 든든하게 지지하는 마스터의 수호 축복',
      ],
      stepDescriptions: [
        '내담자가 갈등하는 문제의 핵심 본질과 상황의 기저 에너지를 꿰뚫어보세요.',
        '결과를 좌우할 숨은 변수와 예상치 못한 기회의 요인을 카드로 해독하세요.',
        '반드시 첫 줄에 최종 판정 [YES] 또는 [NO]를 굵게 선언하고 근거를 설명하세요.',
        '선택의 결과를 극대화하거나 위험을 방어할 핵심 실천 지침을 처방하세요.',
        '스스로 내린 결단에 후회가 없도록 단단한 용기를 불어넣는 축복을 건네세요.',
      ],
      summaryLabels: ['현재 에너지 진단', '최종 판정 [YES/NO]', '핵심 대비 행동 처방'],
    };
  }

  if (theme === 'binary_choice') {
    const extracted = extractBinaryOptionsFromConcern(tarotConcern);
    const optA =
      analysis?.optionA && !/^[ABab](?:안|선택지)?$/.test(analysis.optionA.trim())
        ? analysis.optionA.trim()
        : extracted.optionA;
    const optB =
      analysis?.optionB && !/^[ABab](?:안|선택지)?$/.test(analysis.optionB.trim())
        ? analysis.optionB.trim()
        : extracted.optionB;

    return {
      themeTitle: `양자택일 갈림길 타로 (${optA} vs ${optB})`,
      themeBadge: 'BINARY FORK DECISION',
      themeEmoji: '⚖️',
      themeGradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      stepTitles: [
        `### ⚖️ 1. [${optA}]와 [${optB}] 기로에 선 내담자의 심리와 갈등의 본질`,
        `### 🔀 2. [${optA}] 선택 시 vs [${optB}] 선택 시의 운명적 결과 심층 대비`,
        `### 🎯 3. 마스터의 단호한 최종 선택: [${optA} / ${optB} 중 택 1] 및 필연적 이유`,
        '### 🌿 4. 선택 후 흔들림 없이 나아가기 위한 마스터의 실천 가이드',
        '### ✨ 5. 선택한 길을 환하게 밝히는 운명의 축복',
      ],
      stepDescriptions: [
        `내담자가 '${optA}'와 '${optB}' 사이에서 흔들리는 심리적 이유와 내면의 진짜 갈망을 짚어내세요. ('A안', 'B안' 같은 기호 대신 실제 고민 명칭을 직접 부르세요.)`,
        `'${optA}'의 길을 택했을 때의 흐름과 '${optB}'의 길을 택했을 때의 결과를 카드의 도상으로 입체 대비하세요.`,
        `반드시 첫 줄에 **최종 선택: [${optA}]** 또는 **최종 선택: [${optB}]**로 실제 고민 명칭을 선언하고 이유를 제시하세요.`,
        '선택한 길에서 겪을 수 있는 초기 혼란을 막고 탄탄하게 밀고 나갈 실천법을 처방하세요.',
        '새로운 여정을 향해 나아가는 발걸음에 힘찬 축복을 선사하세요.',
      ],
      summaryLabels: ['갈등의 본질', '마스터 최종 선택', '실천 추진 처방'],
    };
  }

  if (theme === 'lucky' || theme === 'fortune_boost') {
    return {
      themeTitle: '럭키 개운 타로 (볼수록 운 상승)',
      themeBadge: 'FORTUNE MULTIPLIER',
      themeEmoji: '🍀',
      themeGradient: 'from-emerald-500/20 via-green-500/10 to-transparent',
      stepTitles: [
        '### 🍀 1. 내면의 탁기 정화와 본래 타고난 복(福)의 씨앗',
        '### 🚪 2. 오늘부터 활짝 열릴 뜻밖의 횡재와 대길(大吉) 기회의 문',
        '### 🔮 3. 행운 주파수를 100배로 솟구치게 할 마스터의 럭키 스위치 & 개운 비법',
        '### 🌟 4. 오늘 즉시 실행하는 3분 초구체적 1일 1실천 개운 행동',
        '### 🌈 5. 온 우주가 당신을 돕는 기적 같은 대박 행운의 축복 선언',
      ],
      stepDescriptions: [
        '내담자의 일상에서 비워낼 묵은 피로를 다정하게 털어내고 본래의 복덕을 일깨우세요.',
        '오늘부터 열릴 뜻밖의 귀인, 횡재, 대길의 문을 환한 빛의 언어로 예고하세요.',
        '행운의 물꼬를 터줄 마스터의 개운 스위치를 확신에 찬 목소리로 선언하세요.',
        '3분 내외로 즉시 실행할 수 있는 공간 정돈, 미소, 럭키 컬러 등 실천을 처방하세요.',
        '내담자에게 쏟아져 들어올 기적 같은 대박 행운을 축복하세요.',
      ],
      summaryLabels: ['복의 씨앗 진단', '대길 럭키 스위치', '1일 1실천 개운법'],
    };
  }

  if (theme === 'healing') {
    return {
      themeTitle: '힐링 타로 (내면 아이 & 심층 치유)',
      themeBadge: 'SOUL HEALING & INNER CHILD',
      themeEmoji: '🌿',
      themeGradient: 'from-teal-500/20 via-cyan-500/10 to-transparent',
      stepTitles: [
        '### 🌿 1. 지친 영혼과 억눌린 상처의 다정한 인정 (알아차림의 순간)',
        '### 🧸 2. 숨어 울던 내면 아이의 진정한 갈망과 눈물의 목소리',
        '### 🕊️ 3. 마스터의 치유 결단 & 자기 자비(Self-Compassion)의 방향',
        '### 💧 4. 오늘 나 자신을 안아줄 셀프 힐링 행동 & 숨결 처방',
        '### 🌸 5. 온전한 평온과 자아 회복의 안식 축복',
      ],
      stepDescriptions: [
        '억눌러왔던 아픔과 피로를 따스하게 감싸 안고 있는 그대로 인정해 주세요.',
        '외면당했던 내면 아이의 목소리와 진짜 바라는 회복을 카드의 상징으로 대변하세요.',
        '비판을 멈추고 자신을 온전히 용서하며 회복으로 나아갈 마스터의 방향을 제시하세요.',
        '따뜻한 차 한 잔, 깊은 호흡, 셀프 허그 등 오늘 스스로에게 선물할 쉼을 처방하세요.',
        '깊은 내면의 평온과 완전한 치유의 안식을 축복하세요.',
      ],
      summaryLabels: ['내면 상처 알아차림', '자기 자비의 방향', '오늘의 셀프 힐링 처방'],
    };
  }

  if (theme === 'angel') {
    return {
      themeTitle: '천사 타로 (수호천사 빛의 계시)',
      themeBadge: 'ANGELIC GUIDANCE',
      themeEmoji: '👼',
      themeGradient: 'from-sky-500/20 via-indigo-500/10 to-transparent',
      stepTitles: [
        '### 👼 1. 수호천사가 비추는 영혼의 현주소와 진화의 단계',
        '### 🪽 2. 두려움과 에고를 내려놓는 천상의 빛의 정화',
        '### 🧭 3. 천사가 건네는 고차원적 지혜와 빛의 나침반',
        '### 🕊️ 4. 일상에서 천사의 사인을 감응하는 영적 실천 처방',
        '### 🌟 5. 천사의 성스러운 날개가 감싸 안는 은총과 가호의 축복',
      ],
      stepDescriptions: [
        '현재 내담자의 영혼이 배우고 있는 성숙과 진화의 배움을 천사의 시선으로 비추세요.',
        '마음을 짓누르는 두려움과 에고의 집착을 자비롭게 정화하도록 이끄세요.',
        '수호천사가 전하는 고차원적 직관의 나침반을 명쾌하게 전달하세요.',
        '일상에서 마주할 천사의 동시성과 기적을 알아차릴 영적 실천을 처방하세요.',
        '온 생애를 보살피는 거룩한 천사의 은총과 가호를 선사하세요.',
      ],
      summaryLabels: ['영혼의 현주소', '천사의 빛의 나침반', '일상 영적 실천 처방'],
    };
  }

  if (theme === 'new_year') {
    return {
      themeTitle: '신년 4계절 대운 타로 (사계절 대운)',
      themeBadge: 'NEW YEAR SEASONS WHEEL',
      themeEmoji: '🌸',
      themeGradient: 'from-amber-500/20 via-rose-500/10 to-transparent',
      stepTitles: [
        '### 🌅 1. 신년 한 해를 여는 영적 대운의 기저 에너지',
        '### 🌸 2. 사계절(봄·여름·가을·겨울) 운의 흐름과 사분기별 전환점 심층 해독',
        '### 🧭 3. 올 한 해를 관통하는 마스터의 핵심 대운 결단 & 인생 나침반',
        '### 📅 4. 올해 최고의 전성기를 만들기 위한 분기별 실천 개운 처방',
        '### 🌟 5. 365일 찬란한 결실을 기원하는 신년 대길 축복',
      ],
      stepDescriptions: [
        '새해를 관통하는 총체적 기운과 운명적 배경 에너지를 진단하세요.',
        '봄(시작)·여름(확장)·가을(결실)·겨울(안정) 4계절의 운의 맥락을 입체적으로 풀어내세요.',
        '올해 반드시 쥐어야 할 운명의 황금 열쇠를 마스터의 결단으로 선포하세요.',
        '계절마다 운을 극대화할 시의적절한 실천 지침을 처방하세요.',
        '365일 내내 행운과 번영이 가득할 신년 대길의 축복을 건네세요.',
      ],
      summaryLabels: ['신년 대운 기저 에너지', '핵심 대운 나침반', '분기별 실천 개운법'],
    };
  }

  if (theme === 'saju') {
    return {
      themeTitle: '사주 4주 융합 타로 (명리 ✕ 타로)',
      themeBadge: 'SAJU FOUR PILLARS FUSION',
      themeEmoji: '🔮',
      themeGradient: 'from-purple-500/20 via-indigo-500/10 to-transparent',
      stepTitles: [
        '### 🔮 1. 사주 년주·월주·일주·시주 4기둥과 타로 카드의 본원적 공명',
        '### 📜 2. 선천적 오행 기질과 사회적 성취, 내면의 역학 심층 해독',
        '### 🧭 3. 마스터의 운명적 통합 결단 & 용신(用神) 극대화 방향',
        '### ☯️ 4. 오행의 균형을 맞추는 일상 개운 처방 (색상, 방위, 행동)',
        '### ✨ 5. 천지자연과 하나 되는 운명의 완성 축복',
      ],
      stepDescriptions: [
        '사주의 4개 기둥에 투영된 타로 카드의 본질적 공명을 심층 진단하세요.',
        '선천적 사주 원국과 후천적 타로 상징의 상호작용을 명리의 지혜로 풀어내세요.',
        '부족한 오행을 보강하고 용신을 살리는 운명적 통합 결단을 내리세요.',
        '일상에서 오행의 기운을 다스릴 색상, 음식, 방위, 생활 습관을 처방하세요.',
        '천지자연의 순리와 하나 되어 대도약을 이룰 운명의 완성을 축복하세요.',
      ],
      summaryLabels: ['사주 원국 공명 진단', '운명 통합 결단', '오행 균형 개운 처방'],
    };
  }

  if (theme === 'celtic_cross') {
    return {
      themeTitle: '정통 셀틱 크로스 (심층 10카드 대배열)',
      themeBadge: 'CELTIC CROSS 10-CARD MASTERY',
      themeEmoji: '✝️',
      themeGradient: 'from-indigo-500/20 via-purple-500/10 to-transparent',
      stepTitles: [
        '### ✝️ 1. 현재의 핵심 긴장 (현재 상황 ✕ 도전/장애의 교차 에너지)',
        '### ⏳ 2. 무의식의 심연과 시간의 궤적 (무의식, 과거, 최근, 가까운 미래)',
        '### 👁️ 3. 내면의 태도와 외부 세계의 상호작용 (나의 태도 ✕ 외부 환경 ✕ 희망과 두려움)',
        '### 🔮 4. 마스터의 최종 귀결 및 운명 나침반 (최종 결과의 통합 결단)',
        '### 🌟 5. 거대한 흐름을 전환할 결정적 실천 처방 & 영혼의 축복',
      ],
      stepDescriptions: [
        '중심에 교차된 1번과 2번 카드의 팽팽한 긴장과 핵심 갈등을 정밀 분석하세요.',
        '무의식의 뿌리와 과거에서 미래로 이어지는 시간축의 인과관계를 입체적으로 조망하세요.',
        '내담자의 심리적 태도, 주변 환경의 압력, 마음속 두려움의 상호작용을 해독하세요.',
        '10장의 모든 상징이 가리키는 궁극적인 최종 귀결과 나침반을 명쾌하게 결단하세요.',
        '운명의 거대한 물줄기를 내 편으로 돌릴 결정적인 실천 처방과 축복을 전하세요.',
      ],
      summaryLabels: ['현재 핵심 긴장', '최종 귀결 나침반', '결정적 실천 처방'],
    };
  }

  if (theme === 'timing') {
    return {
      themeTitle: '시기 점검 타로 (타이밍 분석)',
      themeBadge: 'TIMING & MOMENTUM',
      themeEmoji: '⏳',
      themeGradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
      stepTitles: [
        '### ⏳ 1. 과거의 누적된 흐름과 질문의 배경 에너지',
        '### ⏱️ 2. 현재 타이밍의 기운 (지금 움직여야 하는가, 기다려야 하는가)',
        '### 🧭 3. 마스터의 최종 시기 결단 & 예상 최적 타이밍 선언',
        '### 🌿 4. 타이밍을 내 편으로 만들기 위한 골든타임 행동 처방',
        '### ✨ 5. 때를 기다리고 맞이하는 지혜의 축복',
      ],
      stepDescriptions: [
        '지금의 질문에 이르게 된 과거의 원인과 배경을 진단하세요.',
        '지금 당장 움직일 때인지, 잠시 내실을 다질 때인지 현재의 기운을 밝히세요.',
        '최적의 결실을 맺을 골든타임의 시기와 마스터의 결단을 명확히 선언하세요.',
        '때를 놓치지 않고 기회를 잡기 위한 준비와 실행 처방을 제시하세요.',
        '하늘의 때와 나의 노력이 만나 결실을 맺도록 축복하세요.',
      ],
      summaryLabels: ['배경 에너지', '최적 타이밍 결단', '골든타임 행동 처방'],
    };
  }

  if (theme === 'obstacle') {
    return {
      themeTitle: '장애물 돌파 타로 (문제 해결)',
      themeBadge: 'OBSTACLE BREAKER',
      themeEmoji: '🧗',
      themeGradient: 'from-rose-500/20 via-orange-500/10 to-transparent',
      stepTitles: [
        '### 🧗 1. 현재 마주한 상황의 실체와 내면의 저항',
        '### 🧱 2. 앞을 가로막는 핵심 장애물의 정체 (카드별 심층 분석)',
        '### 🔨 3. 마스터의 돌파 결단 & 단호한 해결 나침반',
        '### 🛡️ 4. 벽을 무너뜨릴 현실적 돌파 전략 & 1일 1실행 처방',
        '### ⚡ 5. 한계를 뛰어넘어 승리할 용기의 축복',
      ],
      stepDescriptions: [
        '벽에 부딪힌 현실의 실체와 내담자의 두려움을 직시하세요.',
        '진짜 장애물이 외부에 있는지 내면의 편견에 있는지 카드로 명확히 밝히세요.',
        '장애물을 정면 돌파할 마스터의 흔들림 없는 해결 나침반을 선포하세요.',
        '오늘 즉시 실행하여 벽에 균열을 낼 구체적인 행동 1가지를 처방하세요.',
        '어떤 시련도 딛고 일어설 불굴의 용기와 승리를 축복하세요.',
      ],
      summaryLabels: ['상황 실체와 저항', '돌파 해결 나침반', '현실적 돌파 처방'],
    };
  }

  // Default / 3-Card Time General Spread
  return {
    themeTitle: spread.name || '3카드 시간 배열 타로',
    themeBadge: 'PAST PRESENT FUTURE VOYAGE',
    themeEmoji: '🕯️',
    themeGradient: 'from-yellow-500/20 via-amber-500/10 to-transparent',
    stepTitles: [
      '### 🕯️ 1. 과거의 뿌리와 현재 상황의 내면 에너지',
      '### 🎴 2. 펼쳐진 카드들이 들려주는 이야기 (카드별 상징과 본래 뜻 심층 해독)',
      '### 🔮 3. 트리니티 마스터의 직관적 결단 & 방향성',
      '### 🌿 4. 운의 흐름을 바꿀 마스터의 실천 처방 (개운 가이드)',
      '### ✨ 5. 당신의 길을 축복하는 영혼의 한마디',
    ],
    stepDescriptions: [
      '고민의 뿌리와 현재 내담자의 마음속 파동을 카드의 기운에 비추어 진단하세요.',
      '각 위치의 카드들이 품은 도상과 깊은 뜻을 하나의 유기적 드라마로 해독하세요.',
      '고민에 대한 명확하고 단호한 마스터의 최종 결단과 방향성을 내리세요.',
      '오늘 당장 실행할 수 있는 현실적이고 구체적인 개운 행동을 처방하세요.',
      '운명을 주도할 용기와 빛의 지혜를 축복으로 선물하세요.',
    ],
    summaryLabels: ['현재 에너지 진단', '방향과 결단', '실천 개운 처방'],
  };
}

export function isTarotStreamFailure(response: string | null | undefined): boolean {
  if (!response) return true;
  const lower = response.toLowerCase();
  return (
    lower.includes("error") ||
    lower.includes("failed") ||
    lower.includes("connection and call error") ||
    lower.includes("invalid api key") ||
    lower.trim().length < 10
  );
}

function pickBinaryChoiceSide(
  analysis: TarotConcernAnalysis,
  concern: string,
  cards: Array<{ id?: string; nameKo?: string; name?: string; reversed?: boolean; type?: string }>,
): { chosen: string; rejected: string; chosenRate: number; reason: string } | null {
  if (analysis.kind !== 'binary_choice' || !analysis.optionA || !analysis.optionB) {
    return null;
  }

  const optA = analysis.optionA;
  const optB = analysis.optionB;

  // 카드 1(optA)과 카드 2(optB)의 도상 기운 비교
  const cardA = cards[1];
  const cardB = cards[2];

  let scoreA = 50;
  let scoreB = 50;

  if (cardA) {
    scoreA += cardA.reversed ? -20 : 25;
    if (cardA.type === 'major') scoreA += 10;
  }
  if (cardB) {
    scoreB += cardB.reversed ? -20 : 25;
    if (cardB.type === 'major') scoreB += 10;
  }

  if (scoreA === scoreB) {
    const seed = `${concern}:${cards.map((c) => c.id || c.nameKo || c.name).join('|')}`;
    const hash = seed.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    if (hash % 2 === 0) scoreA += 15;
    else scoreB += 15;
  }

  const pickA = scoreA >= scoreB;
  const diff = Math.abs(scoreA - scoreB);
  const chosenRate = Math.min(94, Math.max(76, Math.round(65 + diff * 0.6)));

  return pickA
    ? {
        chosen: optA,
        rejected: optB,
        chosenRate,
        reason: `2번 카드([${cardA?.nameKo || optA}])의 기운이 3번 카드([${cardB?.nameKo || optB}])보다 현실적 번영과 안전성 면에서 압도적으로 우세합니다.`,
      }
    : {
        chosen: optB,
        rejected: optA,
        chosenRate,
        reason: `3번 카드([${cardB?.nameKo || optB}])의 기운이 2번 카드([${cardA?.nameKo || optA}])보다 현실적 번영과 리스크 통제 면에서 압도적으로 우세합니다.`,
      };
}

function localKeywordHint(card: TarotCardContext): string {
  const kws = getEffectiveTarotKeywords(card);
  if (!kws.length) return '';
  if (card.reversed) {
    return `역방향 — ${kws.slice(0, 3).join(', ')}`;
  }
  return `정방향 — ${kws.slice(0, 3).join(', ')}`;
}

export function buildLocalTarotReading(concern: string, cards: any[], photoMode?: boolean): string {
  if (!Array.isArray(cards) || cards.length === 0) {
    return "펼쳐진 카드가 없어 리딩을 시작할 수 없습니다. 마음을 가다듬고 다시 한 번 카드를 뽑아주세요.";
  }

  const analysis = analyzeTarotConcern(concern);
  const { spread } = analysis;
  const leadCard = cards[0];
  const leadName = leadCard?.nameKo || leadCard?.kr || '첫 번째 카드';
  const binaryPick = pickBinaryChoiceSide(analysis, concern, cards);

  const cardStories = cards
    .map((c, i) => {
      const pos = spread.positions[i] || `${i + 1}번 자리`;
      const name = c?.nameKo || c?.kr || `카드 ${i + 1}`;
      const isRev = !!c?.reversed;
      const orient = isRev ? ' (역방향)' : ' (정방향)';
      const d = getTarotCardDetails(c);
      const revData = isRev ? getTarotReversedData(c) : null;
      const caution = isRev ? getTarotCardCaution(c) : '';
      const meaningCore = isRev ? (revData?.meaning || d.reversedCore) : d.uprightCore;
      const effKws = getEffectiveTarotKeywords(c);

      let storyBody = '';
      if (i === 0 || pos.includes('현재') || pos.includes('마음') || pos.includes('상태') || pos.includes('원인')) {
        storyBody = isRev
          ? `현재 당신의 내면에서는 정방향과는 다른 역방향의 기운인 **${meaningCore}**의 흐름이 작용하고 있습니다. 도상 속 [${d.symbolWord}]이 말하듯 조급해하기보다 깊은 호흡으로 내면을 먼저 정돈해야 할 때입니다. 특히 이 카드에서 꼭 기억해야 할 주의점 한 가지는 **"${caution}"**입니다.`
          : `지금 당신의 현실은 **${meaningCore}**의 맑고 역동적인 파동 위에 놓여 있습니다. [${d.symbolWord}]의 상징처럼 직관이 가리키는 방향을 신뢰하고 차분하게 흐름을 타세요.`;
      } else if (i === 1 || pos.includes('장애') || pos.includes('과정') || pos.includes('상황') || pos.includes('도전')) {
        storyBody = isRev
          ? `상황 속에서 역방향의 의미인 **${meaningCore}**와 관련된 불안이나 과열된 집착을 내려놓을 필요가 있습니다. [${d.archetype}]의 지혜처럼 시야를 넓게 열어두면 막혔던 해답이 자연스럽게 모습을 드러냅니다. 특히 이 카드와 관련된 핵심 주의점 한 가지는 **"${caution}"**입니다.`
          : `당신을 둘러싼 환경은 **${meaningCore}**의 깊은 통찰을 통해 새로운 돌파구를 제시하고 있습니다. [${d.symbolWord}]이 주는 유연한 태도가 상황을 당신의 편으로 이끕니다.`;
      } else if (i === 2 || pos.includes('미래') || pos.includes('결과') || pos.includes('조언') || pos.includes('결실')) {
        storyBody = isRev
          ? `앞으로 다가올 전개는 역방향이 가리키는 **${meaningCore}**의 성찰과 균형을 요구합니다. [${d.archetype}]의 가르침처럼 겉으로 드러나는 결과보다 내면의 진실을 충실히 채우면 더 큰 운이 열리게 됩니다. 무엇보다 이 카드가 전하는 주의점 한 가지는 **"${caution}"**입니다.`
          : `운명의 나침반은 마침내 **${meaningCore}**의 눈부신 성취와 보상을 가리키고 있습니다. [${d.symbolWord}]의 축복을 믿고 확신을 갖고 한 걸음 더 전진하십시오.`;
      } else {
        storyBody = isRev
          ? `이 자리는 [${d.archetype}]의 역방향 상징인 **${meaningCore}**를 통해, 성급함을 멈추고 내실을 먼저 다질 것을 권고합니다. 특히 이 카드의 주의점 한 가지는 **"${caution}"**입니다.`
          : `이 자리는 [${d.archetype}]의 원형과 **${meaningCore}**의 상징을 통해, 삶의 중심을 지키며 지혜롭게 적응하는 것이 당신의 길을 비추는 나침반이 됨을 암시합니다.`;
      }

      const cautionLine = isRev ? `\n  ⚠️ **[${name} 역방향 주의점 1가지]**: ${caution}` : '';
      return `· **${pos} — [${name}${orient}]**\n  _키워드: ${effKws.join(', ')} | 원형: ${d.archetype} | 상징: ${d.symbolWord}_\n  _${isRev ? '역방향 고유 뜻' : '정방향 본래 뜻'}: ${meaningCore}_\n  ${storyBody}${cautionLine}`;
    })
    .join('\n\n');

  let decisionText = '';
  if (analysis.kind === 'binary_choice' && binaryPick) {
    decisionText = `### 🎯 4. 트리니티 마스터의 결정적 최종 결단: [${binaryPick.chosen}] vs [${binaryPick.rejected}] 단일 판정
**🎯 최종 결단: [${binaryPick.chosen}] (적합도 ${binaryPick.chosenRate}% 확정 판정)**

카드의 현실적 손익과 운명의 파동은 한 치의 흔들림도 없이 오직 **[${binaryPick.chosen}]** 쪽만을 단독 승자로 가리키고 있습니다.

- **승자 선택지 [${binaryPick.chosen}] 추진 근거**: ${binaryPick.reason} 지금 이 길을 결단하면 장애물을 돌파하고 가시적인 성과(수익 증대, 입지 확보, 관계 안정)를 단기간 내에 손에 쥘 수 있습니다.
- **탈락 선택지 [${binaryPick.rejected}] 기각 이유**: 반면 [${binaryPick.rejected}] 쪽은 겉보기에 무난해 보일지라도 잠재적 변수와 에너지 정체, 뒤따를 후회와 기회비용 손실이 매우 큽니다. 지금은 미련 없이 내려놓아야 할 길입니다.`;
  } else if (analysis.kind === 'yes_no') {
    const finalCard = cards[cards.length - 1] || leadCard;
    const finalCardName = finalCard?.nameKo || finalCard?.kr || '최종 판정 카드';
    const isReversed = Boolean(finalCard?.reversed);
    const yesOrNo = isReversed ? 'NO' : 'YES';
    const verdictDetail = isReversed
      ? `3번째 최종 판정 자리에 놓인 [${finalCardName} (역방향)] 카드의 상징을 비추어볼 때, 카드는 지금 무리하게 밀어붙이기보다 잠시 멈추어야 함을 가리키며 **[NO]**를 선언합니다. 숨어 있는 변수와 리스크를 면밀히 점검하고 내실을 먼저 다지는 것이 안전합니다.`
      : `3번째 최종 판정 자리에 놓인 [${finalCardName} (정방향)] 카드의 맑고 역동적인 상징을 비추어볼 때, 운명의 문은 활짝 열려 있으며 카드는 확신에 찬 **[YES]**를 선언합니다. 주저하거나 스스로를 의심하지 마시고, 준비해 온 마음과 직관을 믿고 당당하게 전진하십시오.`;
    decisionText = `### 🔮 3. 트리니티 마스터의 직관적 결단 & 방향성\n**최종 판정: [${yesOrNo}]**\n\n${verdictDetail}`;
  } else {
    decisionText = `### 🔮 3. 트리니티 마스터의 직관적 결단 & 방향성\n**마스터의 핵심 선언: [도약과 확신의 타이밍]**\n\n지금 당신을 둘러싼 흐름은 정체를 지나 변화의 물꼬를 트고 있습니다. 두려움에 머무르지 말고 직관을 믿고 나아가세요.`;
  }

  const groundedSummary = groundTarotSummaryParts(cards, concern);
  const decisionSummary = binaryPick
    ? `최종 결단은 [${binaryPick.chosen}] (적합도 ${binaryPick.chosenRate}%)입니다. ${binaryPick.reason}`
    : analysis.kind === 'yes_no'
      ? `최종 판정은 [${cards[cards.length - 1]?.reversed ? 'NO' : 'YES'}]이며, ${cards[cards.length - 1]?.reversed ? '지금은 숨은 변수를 점검하고 내실을 다진 뒤에 다시 판단하세요.' : '확인된 준비를 바탕으로 오늘 한 걸음 실행하세요.'}`
      : groundedSummary.decision;

  return `[핵심 3줄 요약]
- [현재 에너지] ${groundedSummary.energy}
- [방향과 결단] ${decisionSummary}
- [실천 행동] ${groundedSummary.action}

### 🕯️ 1. 카드가 비추는 당신의 마음과 현재 에너지
어서 오세요. 카드를 조용히 마주하니, 당신께서 가슴속에 품고 계신 **"${concern}"**에 대한 깊은 고민과 복잡한 마음결이 그대로 느껴집니다.

현재 당신의 에너지는 중요한 갈림길 위에 서 있으며, 가장 먼저 모습을 드러낸 **[${leadName}]** 카드는 당신이 더 이상 혼자서 불안해하지 않아도 된다는 다정한 위로와 함께 변화의 신호를 건네고 있습니다.

### 🎴 2. 펼쳐진 카드들이 들려주는 이야기
_${spread.name} (${spread.cardCount}장 배열)_

${cardStories}

${decisionText}

### 🌿 4. 운의 흐름을 바꿀 마스터의 실천 처방
- **마음의 정돈**: 오늘 하루만큼은 타인의 시선이나 과거의 후회에 얽매이지 말고, 당신 자신의 직관에 집중해 보세요.
- **실천 한 걸음**: 가슴속으로만 맴돌던 생각을 밖으로 꺼내어 작은 실천(메모, 가벼운 대화, 정리 정돈)으로 연결해 보세요. 작은 파동이 큰 대운을 불러옵니다.

### ✨ 5. 당신의 길을 축복하는 영혼의 한마디
> _"${getCardSoulBlessing(cards[cards.length - 1] || leadCard, concern)}"_${photoMode ? '\n\n*(비전 포털 — 인식된 카드의 신비로운 에너지가 함께 투영되었습니다)*' : ''}`;
}

/**
 * 타로 결과가 중간에 끊기거나 미완성으로 남지 않도록 5단계 완결성을 보장하는 함수
 */
export function ensureCompleteTarotReading(
  text: string,
  concern: string,
  cards?: any[],
): string {
  if (!text || isTarotStreamFailure(text) || text.trim().length < 80) {
    return buildLocalTarotReading(concern, cards || []);
  }

  let cleaned = text.trim();
  const leadCard = cards && cards.length > 0 ? (cards[cards.length - 1] || cards[0]) : null;

  // 1. 4단계 및 5단계 완결성 엄밀 판정 (모든 스프레드 테마별 헤더 포용)
  const step4Pattern = /(?:###\s*(?:[🌿👑💎🌟⚡🏆💰🌅💌☯️🛤️🕯️☀️🧭]\s*)?4[\.\s]|4단계|운의\s*흐름을\s*바꿀|개운\s*가이드|실천\s*처방|1일\s*1실천|실천\s*행동)/;
  const step5Pattern = /(?:###\s*(?:[✨👑💎🌟⚡🏆💰🌅💌☯️🛤️🕯️☀️🧭]\s*)?5[\.\s]|5단계|영혼의\s*한마디|당신의\s*길을\s*축복하는|황금빛\s*축복|축복과\s*확언|희망의\s*축복|마스터플랜|최종\s*결실)/;

  const hasStep4 = step4Pattern.test(cleaned);
  const hasStep5 = step5Pattern.test(cleaned);

  let step5IsIncomplete = false;
  if (hasStep5) {
    const step5Idx = cleaned.search(step5Pattern);
    const step5Content = cleaned.slice(step5Idx);
    // 5단계 헤더 이후 본문 길이가 40자 미만이거나 마침표/인용부호 없이 중단된 경우
    if (step5Content.length < 45 || /[,;:—\-\s]$/.test(cleaned)) {
      step5IsIncomplete = true;
    }
  }

  // 2. 누락되거나 잘린 섹션을 카드 맞춤형으로 온전히 보완
  if (!hasStep4) {
    cleaned += `\n\n### 🌿 4. 운의 흐름을 바꿀 마스터의 실천 처방 (개운 가이드)\n- **마음의 정돈**: 타인의 시선이나 조급함에 휘둘리지 말고 내면의 고요한 직관을 신뢰하세요.\n- **오늘의 핵심 실천**: 가벼운 심호흡과 함께 맑은 물 한 잔을 마시며 마음의 중심을 단단히 잡으세요.`;
  }

  if (!hasStep5 || step5IsIncomplete) {
    if (step5IsIncomplete) {
      const step5Idx = cleaned.search(step5Pattern);
      cleaned = cleaned.slice(0, step5Idx).trim();
    }
    const dynamicBlessing = getCardSoulBlessing(leadCard, concern);
    const isDaily = isDailyTarotConcern(concern) || (concern && /오늘|하루|데일리|daily/i.test(concern));
    const step5Header = isDaily
      ? '### ✨ 5. 오늘 하루를 지켜줄 황금빛 축복과 확언'
      : '### ✨ 5. 당신의 길을 축복하는 영혼의 한마디';
    const affirmationText = isDaily
      ? `\n- **오늘의 황금빛 확언**: "나는 오늘 어떤 상황 속에서도 평온한 내면의 중심을 지키며, 나에게 찾아오는 모든 밝은 기회와 은총을 기쁘게 누립니다."`
      : '';
    cleaned += `\n\n${step5Header}\n> _"${dynamicBlessing}"_${affirmationText}`;
  }

  // 3. 미완성 마크다운 서식 닫기
  const quoteCount = (cleaned.match(/"/g) || []).length;
  if (quoteCount % 2 !== 0) cleaned += '"';
  const italicCount = (cleaned.match(/_/g) || []).length;
  if (italicCount % 2 !== 0) cleaned += '_';
  const boldCount = (cleaned.match(/\*\*/g) || []).length;
  if (boldCount % 2 !== 0) cleaned += '**';

  // 4. 종결 부호 보완
  if (!/[.!?…"'\*_]$/.test(cleaned)) {
    cleaned += '.';
  }

  // 5. 본문 하단에 남아 있는 어떠한 형태의 후행 요약 블록도 영구 삭제
  cleaned = stripSummaryFromTarotText(cleaned);

  return cleaned;
}




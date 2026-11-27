/**
 * 🔮 마스터 루시의 사주 정밀 자료.
 *
 * 오브 상담의 기준 대상(본인 또는 궁합 상대) 한 사람의 사주를 상담 지시문에 넣을 만큼 정밀하게 편다.
 * - 원국 8자 · 일간 · 십신 · 12운성 · 지장간
 * - 오행 분포와 강약 · 격국 · 용신/희신/기신
 * - 대운(현재·다음·타임라인) · 세운 · 월운 · 일진
 * - 신살(특수 구조) · 공망 · 원국 안의 합충형파해와 세운·일진과의 관계
 *
 * 계산은 모두 결정론이다(같은 날짜·같은 사주면 같은 값). 엔진이 값을 내지 못하면 지어내지 않고
 * '계산되지 않음'이라고 적는다 — 마스터는 그 문장을 근거로 사주를 만들지 않는다.
 */
import {
  BRANCH_ELEMENT, BRANCH_KOREAN, EARTHLY_BRANCHES, HEAVENLY_STEMS, STEM_ELEMENT, STEM_KOREAN,
  calculateDetailedSaju, calculateTenGod, type FiveElement, type SajuAnalysisResult,
} from '../sajuAnalysis';
import { getAstronomicalMonthBranch, getAstronomicalSajuYear } from '../astronomicalSolarTerms';
import type { UserProfile } from '../sharedState';

export interface OrbGanZhi { gan: string; zhi: string; ganKr: string; zhiKr: string; label: string }

/** 브라우저 시각 → 한국 표준시 벽시계 필드(UTC 필드에 KST 값을 담은 Date). */
function kstWallClock(now: Date): Date {
  const kst = new Date(now.getTime() + 9 * 3600 * 1000);
  return new Date(Date.UTC(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate(), kst.getUTCHours(), kst.getUTCMinutes()));
}

function ganZhi(gan: string, zhi: string): OrbGanZhi {
  return { gan, zhi, ganKr: STEM_KOREAN[gan] || gan, zhiKr: BRANCH_KOREAN[zhi] || zhi, label: `${gan}${zhi}(${STEM_KOREAN[gan] || gan}${BRANCH_KOREAN[zhi] || zhi})` };
}

/** 율리우스 적일 기반 오늘 일진(日辰). 앱의 다른 만세력 계산과 같은 식을 쓴다. */
export function orbDayPillar(now: Date = new Date()): OrbGanZhi {
  const wall = kstWallClock(now);
  const year = wall.getUTCFullYear();
  const month = wall.getUTCMonth() + 1;
  let day = wall.getUTCDate();
  // 23:30 이후는 다음 날 일주로 넘긴다 (앱의 사주 시각 정책과 같다).
  if (wall.getUTCHours() === 23 && wall.getUTCMinutes() >= 30) day += 1;
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  const index = ((jdn + 49) % 60 + 60) % 60;
  return ganZhi(HEAVENLY_STEMS[index % 10], EARTHLY_BRANCHES[index % 12]);
}

/** 입춘 기준 올해 세운(年運) 간지. */
export function orbYearPillar(now: Date = new Date()): OrbGanZhi {
  const { sajuYear } = getAstronomicalSajuYear(kstWallClock(now));
  const index = ((sajuYear - 4) % 60 + 60) % 60;
  return ganZhi(HEAVENLY_STEMS[index % 10], EARTHLY_BRANCHES[index % 12]);
}

/** 12절 절입 시각 기준 이번 달 월운(月運) 간지. */
export function orbMonthPillar(now: Date = new Date()): OrbGanZhi & { term: string; nextTerm: string } {
  const wall = kstWallClock(now);
  const { sajuYear } = getAstronomicalSajuYear(wall);
  const yIndex = ((sajuYear - 4) % 60 + 60) % 60;
  const yearGan = HEAVENLY_STEMS[yIndex % 10];
  const { monthBranchIndex, currentTerm, nextTerm } = getAstronomicalMonthBranch(wall);
  // 五虎遁: 인월(寅月)의 천간은 해의 천간에서 정해진다.
  const tigerStem = ((HEAVENLY_STEMS.indexOf(yearGan) % 5) * 2 + 2) % 10;
  const monthGan = HEAVENLY_STEMS[(tigerStem + monthBranchIndex) % 10];
  const monthZhi = EARTHLY_BRANCHES[(monthBranchIndex + 2) % 12];
  return { ...ganZhi(monthGan, monthZhi), term: currentTerm?.name || '', nextTerm: nextTerm?.name || '' };
}

// ---------------------------------------------------------------- 지지 관계

const STEM_HAP: Array<[string, string, FiveElement]> = [
  ['甲', '己', '토'], ['乙', '庚', '금'], ['丙', '辛', '수'], ['丁', '壬', '목'], ['戊', '癸', '화'],
];
const BRANCH_YUKHAP: Array<[string, string]> = [
  ['子', '丑'], ['寅', '亥'], ['卯', '戌'], ['辰', '酉'], ['巳', '申'], ['午', '未'],
];
const BRANCH_PA: Array<[string, string]> = [
  ['子', '酉'], ['卯', '午'], ['辰', '丑'], ['未', '戌'], ['寅', '亥'], ['巳', '申'],
];
const BRANCH_HAE: Array<[string, string]> = [
  ['子', '未'], ['丑', '午'], ['寅', '巳'], ['卯', '辰'], ['申', '亥'], ['酉', '戌'],
];
const BRANCH_WONJIN: Array<[string, string]> = [
  ['子', '未'], ['丑', '午'], ['寅', '酉'], ['卯', '申'], ['辰', '亥'], ['巳', '戌'],
];
const SAMHAP: Array<{ members: string[]; element: FiveElement }> = [
  { members: ['申', '子', '辰'], element: '수' },
  { members: ['亥', '卯', '未'], element: '목' },
  { members: ['寅', '午', '戌'], element: '화' },
  { members: ['巳', '酉', '丑'], element: '금' },
];
const BANGHAP: Array<{ members: string[]; element: FiveElement }> = [
  { members: ['寅', '卯', '辰'], element: '목' },
  { members: ['巳', '午', '未'], element: '화' },
  { members: ['申', '酉', '戌'], element: '금' },
  { members: ['亥', '子', '丑'], element: '수' },
];
const HYEONG: string[][] = [['寅', '巳', '申'], ['丑', '戌', '未'], ['子', '卯']];
const SELF_HYEONG = new Set(['辰', '午', '酉', '亥']);

const pairKey = (a: string, b: string) => [a, b].sort().join('');
const PAIRS = (rows: Array<[string, string]>) => new Set(rows.map(([a, b]) => pairKey(a, b)));
const YUKHAP_SET = PAIRS(BRANCH_YUKHAP);
const PA_SET = PAIRS(BRANCH_PA);
const HAE_SET = PAIRS(BRANCH_HAE);
const WONJIN_SET = PAIRS(BRANCH_WONJIN);

/** 두 지지 사이의 관계 이름들 (합·충·형·파·해·원진). */
export function orbBranchRelations(a: string, b: string): string[] {
  if (!a || !b) return [];
  const names: string[] = [];
  const ia = EARTHLY_BRANCHES.indexOf(a as (typeof EARTHLY_BRANCHES)[number]);
  const ib = EARTHLY_BRANCHES.indexOf(b as (typeof EARTHLY_BRANCHES)[number]);
  if (ia < 0 || ib < 0) return [];
  if (a === b && SELF_HYEONG.has(a)) names.push('자형(自刑)');
  if (Math.abs(ia - ib) === 6) names.push('충(沖)');
  if (YUKHAP_SET.has(pairKey(a, b))) names.push('육합(六合)');
  if (PA_SET.has(pairKey(a, b))) names.push('파(破)');
  if (HAE_SET.has(pairKey(a, b))) names.push('해(害)');
  if (WONJIN_SET.has(pairKey(a, b))) names.push('원진(怨嗔)');
  for (const group of HYEONG) {
    if (group.includes(a) && group.includes(b) && a !== b) names.push('형(刑)');
  }
  return names;
}

/** 여러 지지(보통 원국 4지)에서 찾은 삼합·방합. */
function orbGroupRelations(branches: string[]): string[] {
  const present = new Set(branches);
  const found: string[] = [];
  for (const group of SAMHAP) {
    if (group.members.every(member => present.has(member))) found.push(`삼합 ${group.members.join('')}(${group.element})`);
  }
  for (const group of BANGHAP) {
    if (group.members.every(member => present.has(member))) found.push(`방합 ${group.members.join('')}(${group.element})`);
  }
  return found;
}

/** 일주가 속한 순(旬)의 공망 두 지지. */
export function orbGongmang(dayGan: string, dayZhi: string): string[] {
  const gi = HEAVENLY_STEMS.indexOf(dayGan as (typeof HEAVENLY_STEMS)[number]);
  const zi = EARTHLY_BRANCHES.indexOf(dayZhi as (typeof EARTHLY_BRANCHES)[number]);
  if (gi < 0 || zi < 0) return [];
  const xunStartBranch = ((zi - gi) % 12 + 12) % 12;
  return [EARTHLY_BRANCHES[(xunStartBranch + 10) % 12], EARTHLY_BRANCHES[(xunStartBranch + 11) % 12]];
}

/** 천간 두 글자의 합. */
export function orbStemHap(a: string, b: string): string | null {
  const hit = STEM_HAP.find(([x, y]) => (x === a && y === b) || (x === b && y === a));
  return hit ? `천간합(${hit[2]})` : null;
}

/** 지지 목록에서 두 개씩 짝지어 찾은 관계 문장. */
export function orbBranchReport(entries: Array<{ label: string; zhi: string }>): string[] {
  const out: string[] = [];
  for (let i = 0; i < entries.length; i += 1) {
    for (let j = i + 1; j < entries.length; j += 1) {
      const names = orbBranchRelations(entries[i].zhi, entries[j].zhi);
      if (names.length) out.push(`${entries[i].label} ${entries[i].zhi} ↔ ${entries[j].label} ${entries[j].zhi}: ${names.join('·')}`);
    }
  }
  for (const group of orbGroupRelations(entries.map(entry => entry.zhi))) out.push(`원국 ${group}`);
  return out;
}

// ---------------------------------------------------------------- 십신 분포

function tenGodShort(dayGan: string, target: string, isBranch: boolean): string {
  return calculateTenGod(dayGan, target, isBranch).name.split('(')[0];
}

function tenGodCounts(saju: SajuAnalysisResult): string {
  const dayGan = saju.pillars.day.gan;
  const counts: Record<string, number> = { 비겁: 0, 식상: 0, 재성: 0, 관성: 0, 인성: 0 };
  const stems = [saju.pillars.year.gan, saju.pillars.month.gan, saju.pillars.day.gan, saju.pillars.hour?.gan].filter(Boolean) as string[];
  const branches = [saju.pillars.year.zhi, saju.pillars.month.zhi, saju.pillars.day.zhi, saju.pillars.hour?.zhi].filter(Boolean) as string[];
  stems.forEach(gan => { counts[calculateTenGod(dayGan, gan, false).category] += 1; });
  branches.forEach(zhi => { counts[calculateTenGod(dayGan, zhi, true).category] += 1; });
  return Object.entries(counts).map(([name, value]) => `${name} ${value}`).join(' · ');
}

function pillarLine(label: string, pillar: SajuAnalysisResult['pillars']['year'] | null | undefined): string {
  if (!pillar) return `${label} (생시 미입력)`;
  const hidden = pillar.hiddenStems
    ? [pillar.hiddenStems.early, pillar.hiddenStems.middle, pillar.hiddenStems.main].filter(Boolean).map(stem => stem!.stemKr).join('·')
    : '';
  return `${label} ${pillar.full} — ${pillar.tenGodGan.name.split('(')[0]}/${pillar.tenGodZhi.name.split('(')[0]} · ${pillar.twelveStage}${hidden ? ` · 지장간 ${hidden}` : ''}`;
}

function short(value: string | undefined, max: number): string {
  const clean = String(value || '').replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max)}…` : clean;
}

/** 한 사람의 사주 정밀 블록. 사주를 계산할 수 없으면 그 사실만 적는다. */
export function formatOrbSajuPrecise(
  profile: UserProfile | null | undefined,
  roleLabel: string,
  now: Date = new Date(),
): string {
  let saju: SajuAnalysisResult | null = null;
  try { saju = calculateDetailedSaju(profile); } catch { saju = null; }
  if (!saju || !saju.hasBirthInfo) {
    return `[${roleLabel} 사주] 생년월일이 없어 계산하지 못했습니다. 사주 원국·대운·세운을 지어내지 말고, 생년월일을 넣으면 더 깊이 볼 수 있다고 부드럽게 안내하세요.`;
  }

  const dayGan = saju.pillars.day.gan;
  const dayEl = saju.dayMaster.element;
  const birth = `${saju.birthdate}${saju.birthtime ? ` ${saju.birthtime}` : ' (생시 미입력)'} ${saju.gender || ''} ${saju.isLunar ? '음력' : '양력'}${saju.solarEquivalentDate && saju.isLunar ? ` → 양력 ${saju.solarEquivalentDate}` : ''}`.replace(/\s+/g, ' ');

  // 오행 분포
  const elements = (['목', '화', '토', '금', '수'] as FiveElement[])
    .map(el => `${el}${saju!.elements.counts[el] || 0}(${Math.round(saju!.elements.percentages[el] || 0)}%)`)
    .join(' ');

  // 대운: 지금 대운과 다음 대운, 그리고 가까운 세 단계
  const age = saju.koreanAge;
  const timeline = saju.daewunDetail?.timeline || [];
  const current = timeline.find(step => age >= step.startAge && age <= step.endAge);
  const upcoming = timeline.filter(step => step.startAge > age).slice(0, 2);
  const daewunLine = [
    current ? `지금 ${current.ganZhi}대운(${current.startAge}~${current.endAge}세, ${current.tenGodGan}/${current.tenGodZhi})` : saju.daeun.current,
    upcoming.length ? `다음 ${upcoming.map(step => `${step.ganZhi}(${step.startAge}세~, ${step.tenGodGan}/${step.tenGodZhi})`).join(' → ')}` : '',
    saju.daewunDetail?.directionText ? `방향 ${short(saju.daewunDetail.directionText, 40)}` : '',
  ].filter(Boolean).join(' · ');

  // 세운·월운·일진
  let yearPillar = '', monthPillar = '', dayPillar = '';
  try {
    const y = orbYearPillar(now);
    yearPillar = `${y.label} 세운 — ${tenGodShort(dayGan, y.gan, false)}/${tenGodShort(dayGan, y.zhi, true)}`;
    const m = orbMonthPillar(now);
    monthPillar = `${m.label} 월운(${m.term}${m.nextTerm ? `~${m.nextTerm}` : ''}) — ${tenGodShort(dayGan, m.gan, false)}/${tenGodShort(dayGan, m.zhi, true)}`;
    const d = orbDayPillar(now);
    dayPillar = `${d.label} 일진 — ${tenGodShort(dayGan, d.gan, false)}/${tenGodShort(dayGan, d.zhi, true)}`;
  } catch {
    yearPillar = '세운·월운·일진 계산에 실패했습니다. 시기 간지를 지어내지 마세요.';
  }

  // 원국 안의 합충형파해와 세운·일진과의 관계
  const natal = [
    { label: '년지', zhi: saju.pillars.year.zhi },
    { label: '월지', zhi: saju.pillars.month.zhi },
    { label: '일지', zhi: saju.pillars.day.zhi },
    ...(saju.pillars.hour ? [{ label: '시지', zhi: saju.pillars.hour.zhi }] : []),
  ];
  const natalReport = orbBranchReport(natal);
  const timing: string[] = [];
  try {
    const y = orbYearPillar(now);
    const m = orbMonthPillar(now);
    const d = orbDayPillar(now);
    for (const entry of natal) {
      const yearRel = orbBranchRelations(entry.zhi, y.zhi);
      if (yearRel.length) timing.push(`세운 ${y.zhi} ↔ ${entry.label} ${entry.zhi}: ${yearRel.join('·')}`);
      const monthRel = orbBranchRelations(entry.zhi, m.zhi);
      if (monthRel.length) timing.push(`월운 ${m.zhi} ↔ ${entry.label} ${entry.zhi}: ${monthRel.join('·')}`);
      const dayRel = orbBranchRelations(entry.zhi, d.zhi);
      if (dayRel.length) timing.push(`일진 ${d.zhi} ↔ ${entry.label} ${entry.zhi}: ${dayRel.join('·')}`);
    }
    const yearStem = orbStemHap(dayGan, y.gan);
    if (yearStem) timing.push(`세운 ${y.gan} ↔ 일간 ${dayGan}: ${yearStem}`);
    const monthStem = orbStemHap(dayGan, m.gan);
    if (monthStem) timing.push(`월운 ${m.gan} ↔ 일간 ${dayGan}: ${monthStem}`);
  } catch { /* above already noted */ }

  // 공망
  const gongmang = orbGongmang(saju.pillars.day.gan, saju.pillars.day.zhi);
  const gongmangLine = gongmang.length
    ? `${gongmang.map(zhi => `${zhi}(${BRANCH_KOREAN[zhi]})`).join('·')}${natal.some(entry => gongmang.includes(entry.zhi)) ? ' — 원국 지지에 공망이 걸려 있음' : ''}`
    : '계산되지 않음';

  const sinsal = (saju.specialStructures || []).slice(0, 6)
    .map(item => `${item.name}(${short(item.description, 34)})`).join(' · ') || '특수 구조 없음(안정적인 오행 순환)';

  const yongsin = saju.yongsin?.name || `${saju.yongsinDetails?.eokbuYongsin || ''} 기운`;
  const heeshin = saju.yongsinDetails?.heeshin || '';
  const gisin = saju.yongsinDetails?.gisin || '';

  return [
    `[${roleLabel} 사주 정밀 자료 — ${saju.name || roleLabel}]`,
    `- 생년월일: ${birth}`,
    `- 원국:`,
    `  · ${pillarLine('년주', saju.pillars.year)}`,
    `  · ${pillarLine('월주', saju.pillars.month)}`,
    `  · ${pillarLine('일주', saju.pillars.day)}`,
    `  · ${pillarLine('시주', saju.pillars.hour)}`,
    `- 일간: ${saju.dayMaster.korean}(${dayEl}) · ${saju.dayMaster.symbolName} · ${short(saju.dayMaster.archetypeTitle, 30)}`,
    `- 오행 분포: ${elements} · ${short(saju.elements.strengthLabel || saju.elements.summary, 60)}`,
    `- 십신 분포: ${tenGodCounts(saju)}`,
    `- 격국: ${short(saju.geokguk?.name, 40)} · 신강약: ${saju.bodyStrength?.level}(${saju.bodyStrength?.score}점)`,
    `- 용신: ${short(yongsin, 40)}${heeshin ? ` · 희신 ${heeshin}` : ''}${gisin ? ` · 기신 ${gisin}` : ''}`,
    `- 대운: ${daewunLine || '성별 미입력으로 대운 미확정'}`,
    `- ${yearPillar}`,
    `- ${monthPillar}`,
    `- ${dayPillar}`,
    `- 신살: ${sinsal}`,
    `- 공망(일주 기준): ${gongmangLine}`,
    `- 원국 합충형파해: ${natalReport.length ? natalReport.join(' / ') : '두드러진 합충형파해 없음'}`,
    `- 시기와의 관계: ${timing.length ? timing.slice(0, 6).join(' / ') : '세운·일진이 원국과 크게 부딪히지 않음'}`,
    `- 시각 기준: 한국 표준시(Asia/Seoul) 벽시계 · 시주만 30분 보정 · 23:30 이후 다음 날 일주${saju.timePolicy?.hourKnown === false ? ' · 생시 미입력' : ''}`,
  ].join('\n');
}

/** 궁합 상대가 있을 때 두 사람의 원국을 나란히 비교하는 블록. */
export function formatOrbSajuCompatibility(
  primary: UserProfile | null | undefined,
  partner: UserProfile | null | undefined,
  primaryLabel: string,
  partnerLabel: string,
): string {
  let a: SajuAnalysisResult | null = null;
  let b: SajuAnalysisResult | null = null;
  try { a = calculateDetailedSaju(primary); } catch { a = null; }
  try { b = calculateDetailedSaju(partner); } catch { b = null; }
  if (!a?.hasBirthInfo || !b?.hasBirthInfo) {
    return '[궁합] 두 사람의 생년월일이 모두 있어야 원국을 비교할 수 있습니다. 없는 쪽의 사주를 지어내지 마세요.';
  }
  const lines: string[] = [];
  const dayStemHap = orbStemHap(a.pillars.day.gan, b.pillars.day.gan);
  lines.push(`- 일간: ${primaryLabel} ${a.pillars.day.gan}(${a.dayMaster.element}) ↔ ${partnerLabel} ${b.pillars.day.gan}(${b.dayMaster.element})${dayStemHap ? ` · ${dayStemHap}` : ''}`);
  const dayRel = orbBranchRelations(a.pillars.day.zhi, b.pillars.day.zhi);
  lines.push(`- 일지: ${a.pillars.day.zhi} ↔ ${b.pillars.day.zhi}${dayRel.length ? ` · ${dayRel.join('·')}` : ' · 직접 관계 없음'}`);
  const crossA = [a.pillars.year.zhi, a.pillars.month.zhi, a.pillars.day.zhi];
  const crossB = [b.pillars.year.zhi, b.pillars.month.zhi, b.pillars.day.zhi];
  const cross: string[] = [];
  for (const x of crossA) {
    for (const y of crossB) {
      const names = orbBranchRelations(x, y);
      if (names.length) cross.push(`${x}↔${y} ${names.join('·')}`);
    }
  }
  lines.push(`- 두 원국 지지 관계: ${cross.length ? [...new Set(cross)].slice(0, 6).join(', ') : '두드러진 충·합 없음'}`);
  const elA = (a.elements?.dominant?.element || a.dayMaster.element) as FiveElement;
  const elB = (b.elements?.dominant?.element || b.dayMaster.element) as FiveElement;
  const GENERATES: Record<FiveElement, FiveElement> = { 목: '화', 화: '토', 토: '금', 금: '수', 수: '목' };
  const CONTROLS: Record<FiveElement, FiveElement> = { 목: '토', 토: '수', 수: '화', 화: '금', 금: '목' };
  const balance = elA === elB
    ? `${elA}끼리 같은 기운 — 닮아서 편하지만 한쪽으로 치우칠 수 있음`
    : GENERATES[elA] === elB ? `${elA}→${elB} 상생 — ${primaryLabel}의 기운이 ${partnerLabel}를 북돋음`
      : GENERATES[elB] === elA ? `${elB}→${elA} 상생 — ${partnerLabel}의 기운이 ${primaryLabel}를 북돋음`
        : CONTROLS[elA] === elB ? `${elA}→${elB} 상극 — ${primaryLabel}의 기운이 ${partnerLabel}를 누름`
          : `${elB}→${elA} 상극 — ${partnerLabel}의 기운이 ${primaryLabel}를 누름`;
  lines.push(`- 오행 우세: ${primaryLabel} ${elA} · ${partnerLabel} ${elB} · ${balance}`);
  lines.push(`- 대운: ${primaryLabel} ${a.daeun?.current || '미확정'} / ${partnerLabel} ${b.daeun?.current || '미확정'}`);
  return ['[궁합 — 두 사람 원국 비교]', ...lines].join('\n');
}

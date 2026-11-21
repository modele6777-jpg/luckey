import type { DivinationToolId } from '@/lib/fifteenDivinationTools';

/**
 * 점술모드 3단계 양피지 두루마리에 적을 "핵심 결과 3~4줄".
 * 엔진이 실제로 계산한 값만 옮기고, 값이 없으면 줄을 만들지 않는다 (지어내지 않음).
 */
export interface ToolFact {
  label: string;
  value: string;
}

type Data = Record<string, any>;
const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : typeof v === 'number' && Number.isFinite(v) ? String(v) : '');
const clip = (v: string, max = 46): string => (v.length > max ? `${v.slice(0, max - 1)}…` : v);
const fact = (label: string, value: unknown, max?: number): ToolFact | null => {
  const text = str(value);
  return text ? { label, value: clip(text, max) } : null;
};
const sign = (body: Data | undefined) => body?.sign ? `${str(body.sign.symbol)} ${str(body.sign.name)}`.trim() : '';
const year = (v: unknown) => str(v).slice(0, 4);

const EXTRACTORS: Partial<Record<DivinationToolId, (d: Data) => Array<ToolFact | null>>> = {
  astrology: d => [
    fact('태양', sign(d.sun)),
    fact('달', sign(d.moon)),
    d.timeKnown ? fact('상승궁', sign(d.ascendant)) : null,
    fact('태양의 결', d.sun?.sign?.coreTrait),
  ],
  ziwei: d => {
    const life = Array.isArray(d.palaces) ? d.palaces.find((p: Data) => p?.name === '명궁') : null;
    const stars = Array.isArray(life?.major) ? life.major.map((s: Data) => str(s?.name)).filter(Boolean).join('·') : '';
    return [
      fact('명궁 주성', stars ? `${stars} (${str(life?.branch)}궁)` : ''),
      fact('신궁', d.bodyPalace ? `${str(d.bodyPalace)}궁` : ''),
      fact('오행국', d.fiveElementsClass),
      fact('음력', d.lunarDate),
    ];
  },
  vedic: d => {
    const a: Data = d.advanced || {};
    const maha = a.currentDasha?.mahadasha;
    const antar = a.currentDasha?.antardasha;
    return [
      fact('지금의 대주기', maha ? `${str(maha.lord)} 마하다샤 (~${year(maha.endDate)})` : ''),
      fact('세부 주기', antar ? `${str(antar.lord)} 안타르다샤 (~${year(antar.endDate)})` : ''),
      fact('나크샤트라', d.nakshatra ? `${str(d.nakshatra.name)} ${str(d.nakshatra.pada)}파다` : ''),
      fact('달 라시', a.rashi?.chandra ? `${str(a.rashi.chandra.name)}(${str(a.rashi.chandra.hanja)})` : ''),
    ];
  },
  liuren: d => [
    fact('과식', d.patternName),
    fact('판단', d.decisionGrade),
    fact('삼전', Array.isArray(d.threeTransmissions) ? d.threeTransmissions.map((t: Data) => `${str(t?.branch)}${str(t?.general)}`).join(' → ') : ''),
    fact('풀이', d.patternGuidance, 60),
  ],
  qimen: d => {
    const c: Data = d.chabopPointChart?.chart || {};
    return [
      fact('국', c['局數'] ? `${str(c['陰陽'])}둔 ${str(c['局數'])}국` : ''),
      fact('직부', c['值符'] ? `${str(c['值符'])} (${str(c['值符落宮'])}궁)` : ''),
      fact('직사', c['值使'] ? `${str(c['值使'])} (${str(c['值使落宮'])}궁)` : ''),
      fact('시주', c['時柱']),
    ];
  },
  iching: d => [
    fact('본괘', d.primary ? `${str(d.primary.number)}. ${str(d.primary.name)}` : ''),
    fact('변하는 효', Array.isArray(d.movingLines) && d.movingLines.length ? `${d.movingLines.join('·')}효` : ''),
    fact('지괘', d.changed ? `${str(d.changed.number)}. ${str(d.changed.name)}` : ''),
    fact('행동', d.judgment?.actionProtocol, 60),
  ],
  thai_astrology: d => [
    fact('태어난 요일', d.birthDayPlanet ? `${str(d.birthDayPlanet.weekday)} · ${str(d.birthDayPlanet.planet)}` : ''),
    fact('수호신', d.birthDayPlanet?.thaiName),
    fact('행운 색', Array.isArray(d.birthDayPlanet?.colors) ? d.birthDayPlanet.colors.join('·') : ''),
    fact('길한 방향', d.birthDayPlanet?.direction),
  ],
  tojeong: d => [
    fact('올해 괘', d.hexagramName ? `${str(d.targetYear)}년 ${str(d.hexagramName)} (${str(d.hexagramCode)})` : ''),
    fact('길흉', d.luckGrade),
    fact('움직이는 효', d.movingLineLabel),
    fact('올해 간지', d.targetYearGanZhi),
  ],
  kyusei: d => [
    fact('본명성', d.honmyosei?.name),
    fact('월명성', d.getmyosei?.name),
    fact('오늘의 일성', d.ilmyosei?.name),
    fact('연반 중궁', d.annualChart?.centerStarName),
  ],
  taiyi: d => {
    const c: Data = d.calculation || {};
    return [
      fact('대주기', c.cycleName),
      fact('국', c.juNumber ? `${str(c.juNumber)}국 ${str(c.juType)}` : ''),
      fact('주객 판정', c.outcome, 60),
      fact('태을 자리', c.taiyiPalaceName ? `${str(c.taiyiPalaceName)}궁` : ''),
    ];
  },
};

/** 도구별 핵심 결과 (최대 4줄). 계산되지 않았거나 값이 없으면 빈 배열. */
export function extractToolFacts(id: DivinationToolId, data: unknown): ToolFact[] {
  if (!data || typeof data !== 'object') return [];
  const extractor = EXTRACTORS[id];
  if (!extractor) return [];
  try {
    return extractor(data as Data).filter((item): item is ToolFact => Boolean(item)).slice(0, 4);
  } catch {
    return [];
  }
}

export function extractAllToolFacts(
  ids: readonly DivinationToolId[],
  engineTools: Record<string, { status: string; data?: unknown }> | undefined,
): Partial<Record<DivinationToolId, ToolFact[]>> {
  const out: Partial<Record<DivinationToolId, ToolFact[]>> = {};
  for (const id of ids) {
    const entry = engineTools?.[id];
    if (!entry || (entry.status !== 'calculated' && entry.status !== 'partial')) continue;
    const facts = extractToolFacts(id, entry.data);
    if (facts.length) out[id] = facts;
  }
  return out;
}

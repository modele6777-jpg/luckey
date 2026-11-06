import { calculateTenGod, type SajuAnalysisResult } from './sajuAnalysis';
import { verifyLucyTarotReply, UNVERIFIED_TAROT_REPLY, type LucyTarotDraw } from './lucyTarotIntegrity';
import { detectTarotCardsFromText } from '../utils/tarotDetector';

export interface LucyCriticalFacts {
  saju?: {
    dayMaster: string;
    dayMasterKo: string;
    elementPercentages: Record<string, number>;
    bodyStrengthScore: number;
    geokguk: string;
    tenGodByElement: Record<string, string>;
  };
  tarotDraw?: LucyTarotDraw;
}

/** Build only from app calculations and the immutable draw, never model prose. */
export function buildLucyCriticalFacts(saju?: SajuAnalysisResult | null, tarotDraw?: LucyTarotDraw): LucyCriticalFacts {
  return {
    ...(saju ? { saju: {
      dayMaster: saju.dayMaster.gan,
      dayMasterKo: saju.dayMaster.korean,
      elementPercentages: { ...saju.elements.percentages },
      bodyStrengthScore: saju.bodyStrength.score,
      geokguk: saju.geokguk.name.split('(')[0],
      tenGodByElement: Object.fromEntries(Object.entries({ 목:'甲', 화:'丙', 토:'戊', 금:'庚', 수:'壬' })
        .map(([element, stem]) => [element, calculateTenGod(saju.dayMaster.gan, stem).category])),
    } } : {}),
    ...(tarotDraw ? { tarotDraw } : {}),
  };
}

export function formatLucyCriticalFacts(facts: LucyCriticalFacts): string {
  const cards = facts.tarotDraw ? detectTarotCardsFromText(facts.tarotDraw.markers, 78)
    .map(card => ({ id:card.id, name:card.nameKo, orientation:card.orientationKo })) : [];
  return `[앱 핵심값 대조표]\n${JSON.stringify({ saju:facts.saju ?? null, drawnCards:cards })}\n이 표는 이미 제공된 계산을 대조하는 기준이며 새 추첨이나 별도 계산이 아니다. 일간·오행 비율·점수·격국·십신 관계·카드 이름과 정역방향을 바꾸지 마. 다른 사람의 사례나 설명용 예시는 현재 사용자의 결과와 명확히 구분해. 신강약 점수와 격국은 전통 규칙의 간이 산출값이며 의학적 진단이나 예측 확률이 아니다.`;
}

/** Narrow assertion patterns supplement the semantic reviewer; not a full Korean parser. */
export function findCriticalFactConflicts(text: string, facts: LucyCriticalFacts, question = ''): string[] {
  const issues: string[] = [];
  if (verifyLucyTarotReply(text, facts.tarotDraw, question) === UNVERIFIED_TAROT_REPLY) issues.push('카드 이름·정역방향 또는 실제 추첨 기록 불일치');
  const saju = facts.saju;
  if (!saju) {
    const personalClaim = /(?:네|너의|당신의|본인의)\s*일간(?:은|이|:|：)?\s*(?:[갑을병정무기경신임계][목화토금수]|[甲乙丙丁戊己庚辛壬癸])|(?:[갑을병정무기경신임계][목화토금수]|[甲乙丙丁戊己庚辛壬癸][木火土金水]?)\s*(?:\([^)]*\))?\s*일간(?:이야|입니다|이네)/.test(text);
    const asksMeaning = /뜻|의미|설명|뭐야/.test(question) && /[갑을병정무기경신임계][목화토금수]|[甲乙丙丁戊己庚辛壬癸]/.test(question);
    if (personalClaim && !asksMeaning) issues.push('제공된 개인 일간 계산 없이 원국을 단정');
    return issues;
  }
  const plain = text.replace(/[*_`#]/g, '');
  const stems: Record<string,string> = { 갑목:'甲', 을목:'乙', 병화:'丙', 정화:'丁', 무토:'戊', 기토:'己', 경금:'庚', 신금:'辛', 임수:'壬', 계수:'癸' };
  for (const match of plain.matchAll(/([甲乙丙丁戊己庚辛壬癸])(?:[木火土金水])?\s*일간|([갑을병정무기경신임계][목화토금수])\s*(?:\([^)]*\))?\s*일간|일간(?:은|이|:|：)?\s*([갑을병정무기경신임계][목화토금수]|[甲乙丙丁戊己庚辛壬癸])/g)) {
    if (/^\s*(?:이|은|가)?\s*아니/.test(plain.slice(match.index! + match[0].length, match.index! + match[0].length + 10))) continue;
    const value = match[1] || stems[match[2] || match[3]] || match[3];
    if (value !== saju.dayMaster) issues.push(`일간 불일치: 실제 ${saju.dayMasterKo}`);
  }
  for (const match of plain.matchAll(/([목화토금수])(?:\s*\([^)]*\))?(?:\s*기운)?(?:이|은|는|의|가|:|：)?\s*(\d+(?:\.\d+)?)\s*%/g)) {
    if (Math.abs(Number(match[2]) - saju.elementPercentages[match[1]]) > 0.51) issues.push(`오행 비율 불일치: ${match[1]} ${saju.elementPercentages[match[1]]}%`);
  }
  for (const match of plain.matchAll(/(?:신강약|극신약|극신강|신약|신강)[^.!?\n\d]{0,15}(\d+(?:\.\d+)?)\s*점/g)) {
    if (Number(match[1]) !== saju.bodyStrengthScore) issues.push(`신강약 점수 불일치: 실제 ${saju.bodyStrengthScore}점`);
  }
  for (const match of plain.matchAll(/격국(?:은|이|:|：)?\s*([가-힣]+격)|([가-힣]+격)(?:이야|입니다|으로|이라|에\s*해당)/g)) {
    if ((match[1] || match[2]) !== saju.geokguk) issues.push(`격국 불일치: 실제 ${saju.geokguk}`);
  }
  const elemental = plain.replace(/\((?:木|火|土|金|水|나무|불|흙|쇠|물)\)/g, '');
  for (const match of elemental.matchAll(/([목화토금수])(?:\s*기운)?(?:은|는|이|가|:|：)?\s*[(（]?\s*((?:(?:비겁|식상|재성|관성|인성)[·/,\s]*)+)/g)) {
    for (const category of match[2].match(/비겁|식상|재성|관성|인성/g) || []) {
      if (category !== saju.tenGodByElement[match[1]]) issues.push(`십신 관계 불일치: ${saju.dayMasterKo} 기준 ${match[1]}=${saju.tenGodByElement[match[1]]}`);
    }
  }
  return [...new Set(issues)];
}

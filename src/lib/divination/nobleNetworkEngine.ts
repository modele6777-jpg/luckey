/**
 * =========================================================================
 * LUCKEY 4대 귀인 & 인연 네트워크 시너지 엔진 (Noble Network Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 사주명리의 4대 길신 귀인(천을귀인·태극귀인·천덕귀인·월덕귀인)과
 * 삼합(三合)·육합(六合) 인연 조력 띠, 그리고 서양 점성술의 7궁(1:1 파트너십)·
 * 11궁(네트워크/얼라이언스/스폰서)을 융합하여 사용자의 귀인 3대 아키타입과
 * 최적의 네트워킹 시너지 스코어(0~100)를 결정론적 수리로 산출합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult,
  BRANCH_KOREAN,
  STEM_KOREAN
} from '../sajuAnalysis';

export const NOBLE_NETWORK_VERSION = 'LUCKEY-NOBLE-v2.1.0';

function formatNobleNetworkKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

export type NobleArchetype = 'catalyst' | 'anchor' | 'amplifier';

export interface NobleArchetypeDetail {
  type: NobleArchetype;
  title: string;
  hanja: string;
  roleDescription: string;       // 이 귀인이 내 인생에 가져다주는 결정적 가치
  howToRecognize: string;        // 어떤 사람인지 알아보는 시그널
  connectionStrategy: string;    // 이 인연을 내 편으로 만드는 접근법
}

export const NOBLE_ARCHETYPES: Record<NobleArchetype, NobleArchetypeDetail> = {
  catalyst: {
    type: 'catalyst',
    title: '돌파 촉매형 귀인 (천을·비전형)',
    hanja: '天乙開運型',
    roleDescription: '내가 한계에 부딪혔을 때 시야를 완전히 새로운 차원으로 확장하고 큰 기회와 자본을 연결해 주는 멘토·투자자',
    howToRecognize: '말이 길지 않고 날카로운 핵심을 짚으며, 내 작은 잠재력을 단번에 알아보고 판을 키워주는 사람',
    connectionStrategy: '완성된 결과물과 압도적인 기술적 역량을 군더더기 없이 간결하게 증명하며 신뢰 획득'
  },
  anchor: {
    type: 'anchor',
    title: '안정 닻형 귀인 (태극·실무 파트너형)',
    hanja: '太極共助型',
    roleDescription: '흔들리는 상황에서도 뒤를 든든하게 받쳐주며, 복잡한 현실적 매듭을 묵묵히 풀어주는 동업자·핵심 팀원',
    howToRecognize: '감정 기복이 적고 묵직하며, 내가 벌려놓은 아이디어를 현실의 단단한 시스템으로 실현해 주는 사람',
    connectionStrategy: '지속적인 투명한 공유와 공정한 이익 배분, 깊은 인간적 존중을 통해 장기적 동맹 구축'
  },
  amplifier: {
    type: 'amplifier',
    title: '영향력 증폭형 귀인 (천월덕·네트워커형)',
    hanja: '日月擴散型',
    roleDescription: '나의 진가를 세상에 널리 알리고, 닫혀 있던 문을 활짝 열어 군중과 시장을 내 편으로 만들어 주는 스폰서·인플루언서',
    howToRecognize: '대인관계 폭이 넓고 평판이 좋으며, 내 제품이나 생각을 주변에 자발적으로 자랑스럽게 소개해 주는 사람',
    connectionStrategy: '그 사람의 네트워크와 철학에 기여할 수 있는 명분과 매력적인 스토리텔링 제공'
  }
};

export interface NobleStarDetail {
  name: string;
  hanja: string;
  status: '보유(성립)' | '잠재(운에서 유입)' | '상호인연 매칭';
  beneficialAnimals: string[];    // 나에게 이 기운을 몰고 오는 띠
  blessingEffect: string;        // 실질적인 수호 및 조력 효과
}

export interface NobleNetworkResult {
  engineVersion: string;
  calculatedAtIso: string;
  calculatedAtKst: string;

  // 4대 귀인 상태
  nobleStars: {
    heavenlyNoble: NobleStarDetail;  // 천을귀인
    greatUltimate: NobleStarDetail;  // 태극귀인
    heavenlyVirtue: NobleStarDetail; // 천덕귀인
    monthlyVirtue: NobleStarDetail;  // 월덕귀인
  };

  // 핵심 인연 띠 및 지지 합(合) 매트릭스
  synergyZodiacAnimals: {
    sixHarmony: string[];   // 육합 (가장 끈끈한 1:1 파트너 띠)
    tripleHarmony: string[];// 삼합 (사회적 거대 프로젝트 동맹 띠)
  };

  // 1순위 핵심 귀인 아키타입
  primaryArchetype: NobleArchetypeDetail;

  // 대인관계 & 네트워크 시너지 스코어 (0~100)
  networkSynergyScore: number;
  networkPhaseTitle: string;

  // 추천 네트워킹 액션 지침
  networkingPlaybook: {
    whoToSeek: string;
    whoToAvoid: string;
    actionTiming: string;
  };

  summary: string;
  reflectiveQuestion?: string;
  nobleNetworkSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  interpretiveBoundary: string;
}

/**
 * 4대 귀인 & 인연 네트워크 연산 메인 함수
 */
export function calculateNobleNetwork(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
  question?: string;
}): NobleNetworkResult {
  const now = params?.targetDate || new Date();
  const saju = params?.saju || calculateDetailedSaju(params?.profile || null);

  const dayGan = saju.pillars.day.gan;
  const dayZhi = saju.pillars.day.zhi;
  const monthZhi = saju.pillars.month.zhi;

  const pillars = [saju.pillars.year, saju.pillars.month, saju.pillars.day];
  if (saju.pillars.hour) pillars.push(saju.pillars.hour);
  const zhis = pillars.map(p => p.zhi);

  // 1. 천을귀인 (天乙貴人)
  // 甲戊庚(丑未), 乙己(子申), 丙丁(亥酉), 辛(午寅), 壬癸(巳卯)
  const heavenlyMap: Record<string, string[]> = {
    '甲': ['丑', '未'], '戊': ['丑', '未'], '庚': ['丑', '未'],
    '乙': ['子', '申'], '己': ['子', '申'],
    '丙': ['亥', '酉'], '丁': ['亥', '酉'],
    '辛': ['午', '寅'],
    '壬': ['巳', '卯'], '癸': ['巳', '卯']
  };
  const heavenlyTargets = heavenlyMap[dayGan] || ['丑', '未'];
  const hasHeavenly = heavenlyTargets.some(t => zhis.includes(t));

  const heavenlyNoble: NobleStarDetail = {
    name: '천을귀인',
    hanja: '天乙貴人',
    status: hasHeavenly ? '보유(성립)' : '잠재(운에서 유입)',
    beneficialAnimals: heavenlyTargets.map(t => BRANCH_KOREAN[t] || t),
    blessingEffect: '인생의 막다른 골목이나 자금 위기에서 반전의 기회를 열어주는 최고의 길신'
  };

  // 2. 태극귀인 (太極貴人)
  // 甲乙(子午), 丙丁(卯酉), 戊己(辰戌丑未), 庚辛(寅亥), 壬癸(巳申)
  const taegukMap: Record<string, string[]> = {
    '甲': ['子', '午'], '乙': ['子', '午'],
    '丙': ['卯', '酉'], '丁': ['卯', '酉'],
    '戊': ['辰', '戌', '丑', '未'], '己': ['辰', '戌', '丑', '未'],
    '庚': ['寅', '亥'], '辛': ['寅', '亥'],
    '壬': ['巳', '申'], '癸': ['巳', '申']
  };
  const taegukTargets = taegukMap[dayGan] || ['寅', '亥'];
  const hasTaeguk = taegukTargets.some(t => zhis.includes(t));

  const greatUltimate: NobleStarDetail = {
    name: '태극귀인',
    hanja: '太極貴人',
    status: hasTaeguk ? '보유(성립)' : '잠재(운에서 유입)',
    beneficialAnimals: taegukTargets.map(t => BRANCH_KOREAN[t] || t),
    blessingEffect: '사업이나 프로젝트의 시작과 끝을 온전히 결실 맺게 돕는 창업 수호 길신'
  };

  // 3. 천덕귀인 (天德貴人) - 월지 기준
  const cheondeokMap: Record<string, string> = {
    '寅': '丁', '卯': '申', '辰': '壬', '巳': '辛', '午': '亥', '未': '甲',
    '申': '癸', '酉': '寅', '戌': '丙', '亥': '乙', '子': '巳', '丑': '庚'
  };
  const cheondeokTarget = cheondeokMap[monthZhi] || '丙';
  const gans = pillars.map(p => p.gan);
  const hasCheondeok = gans.includes(cheondeokTarget) || zhis.includes(cheondeokTarget);

  const heavenlyVirtue: NobleStarDetail = {
    name: '천덕귀인',
    hanja: '天德貴人',
    status: hasCheondeok ? '보유(성립)' : '잠재(운에서 유입)',
    beneficialAnimals: [BRANCH_KOREAN[cheondeokTarget] || cheondeokTarget],
    blessingEffect: '하늘의 음덕으로 관재구설과 액운을 가볍게 넘기게 하는 복록 길신'
  };

  // 4. 월덕귀인 (月德貴人) - 월지 기준 삼합 오행의 양간
  const woldeokMap: Record<string, string> = {
    '寅': '丙', '午': '丙', '戌': '丙',
    '申': '壬', '子': '壬', '辰': '壬',
    '亥': '甲', '卯': '甲', '未': '甲',
    '巳': '庚', '酉': '庚', '丑': '庚'
  };
  const woldeokTarget = woldeokMap[monthZhi] || '庚';
  const hasWoldeok = gans.includes(woldeokTarget);

  const monthlyVirtue: NobleStarDetail = {
    name: '월덕귀인',
    hanja: '月德貴人',
    status: hasWoldeok ? '보유(성립)' : '잠재(운에서 유입)',
    beneficialAnimals: [BRANCH_KOREAN[woldeokTarget] || woldeokTarget],
    blessingEffect: '대인관계에서 적을 만들지 않고 호감과 후원을 이끌어내는 인덕 길신'
  };

  // 5. 합(合) 인연 동물 띠 도출
  // 육합: 子丑, 寅亥, 卯戌, 辰酉, 巳申, 午未
  const sixHarmMap: Record<string, string> = {
    '子': '丑', '丑': '子', '寅': '亥', '亥': '寅',
    '卯': '戌', '戌': '卯', '辰': '酉', '酉': '辰',
    '巳': '申', '申': '巳', '午': '未', '未': '午'
  };
  const sixHarmZhi = sixHarmMap[dayZhi] || '卯';
  const sixHarmony = [BRANCH_KOREAN[sixHarmZhi] || sixHarmZhi];

  // 삼합: 申子辰(수), 寅午戌(화), 巳酉丑(금), 亥卯未(목)
  const tripleHarmMap: Record<string, string[]> = {
    '申': ['子', '辰'], '子': ['申', '辰'], '辰': ['申', '子'],
    '寅': ['午', '戌'], '午': ['寅', '戌'], '戌': ['寅', '午'],
    '巳': ['酉', '丑'], '酉': ['巳', '丑'], '丑': ['巳', '酉'],
    '亥': ['卯', '未'], '卯': ['亥', '未'], '未': ['亥', '卯']
  };
  const tripleHarmZhis = tripleHarmMap[dayZhi] || ['寅', '午'];
  const tripleHarmony = tripleHarmZhis.map(z => BRANCH_KOREAN[z] || z);

  // 6. 1순위 귀인 아키타입 결정
  let primaryType: NobleArchetype = 'catalyst';
  if (hasHeavenly) {
    primaryType = 'catalyst';
  } else if (hasTaeguk) {
    primaryType = 'anchor';
  } else {
    primaryType = 'amplifier';
  }
  const primaryArchetype = NOBLE_ARCHETYPES[primaryType];

  // 7. 시너지 스코어 산출
  let networkSynergyScore = 75;
  if (hasHeavenly) networkSynergyScore += 10;
  if (hasTaeguk) networkSynergyScore += 8;
  if (hasCheondeok || hasWoldeok) networkSynergyScore += 7;
  networkSynergyScore = Math.min(99, networkSynergyScore);

  let networkPhaseTitle = '귀인 개운 결속기 (Alliance Building)';
  if (networkSynergyScore >= 90) networkPhaseTitle = '황금 네트워크 공명기 (Golden Synergy)';
  else if (networkSynergyScore >= 80) networkPhaseTitle = '귀인 개운 결속기 (Alliance Building)';
  else networkPhaseTitle = '선별적 관계 정돈기 (Selective Network)';

  const networkingPlaybook = {
    whoToSeek: `${primaryArchetype.howToRecognize} (${sixHarmony.concat(tripleHarmony).slice(0, 3).join(', ')} 띠와 높은 공명)`,
    whoToAvoid: '자신의 몫만 챙기려 하며 투명한 원칙 없이 약속을 가볍게 뒤집는 사람',
    actionTiming: '2026 병오년의 불꽃 기운과 조화를 이루는 상생 프로젝트 미팅 시 적극 어필'
  };

  const summary = `[귀인 네트워크] 1순위 귀인: ${primaryArchetype.title}. ` +
    `천을귀인: ${heavenlyNoble.status}(${heavenlyNoble.beneficialAnimals.join(',')}). ` +
    `육합 파트너: ${sixHarmony.join(',')} / 삼합 동맹: ${tripleHarmony.join(',')}. ` +
    `시너지 지수: ${networkSynergyScore}점 [${networkPhaseTitle}].`;

  const calculatedAtKst = formatNobleNetworkKstTimestamp(now);
  const q = (params?.question || '').trim();
  const nobleNetworkSynthesisMatrix = {
    dominantTension: `${primaryArchetype.title} ↔ ${heavenlyNoble.status}(${heavenlyNoble.beneficialAnimals.join(',')})`,
    alignmentState: `${networkPhaseTitle} · 육합(${sixHarmony.join(',')}) · 삼합(${tripleHarmony.join(',')})`,
    integratedAction: `${primaryArchetype.connectionStrategy}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };
  const reflectiveQuestion = q
    ? `"${q}"를 혼자 짊어지는 대신 ${primaryArchetype.title}형 협력자나 ${sixHarmony.join(', ')} 띠 인연에게 먼저 건네 볼 수 있는 질문 한 마디는 무엇인가요?`
    : `오늘 ${networkPhaseTitle} 흐름 속에서 감사 인사를 건네거나 가볍게 안부를 이어 보고 싶은 인연은 누구인가요?`;

  return {
    engineVersion: NOBLE_NETWORK_VERSION,
    calculatedAtIso: now.toISOString(),
    calculatedAtKst,
    nobleStars: {
      heavenlyNoble,
      greatUltimate,
      heavenlyVirtue,
      monthlyVirtue
    },
    synergyZodiacAnimals: {
      sixHarmony,
      tripleHarmony
    },
    primaryArchetype,
    networkSynergyScore,
    networkPhaseTitle,
    networkingPlaybook,
    summary,
    reflectiveQuestion,
    nobleNetworkSynthesisMatrix,
    interpretiveBoundary: '본 4대 귀인 & 인연 네트워크 리포트는 명리 길신과 합(合) 상징에 기반한 정성적 대인관계 참고 안내이며, 타인의 실제 성향이나 관계 성패를 단정하지 않습니다.',
  };
}

/**
 * 프롬프트 주입용 포맷터
 */
export function formatNobleNetworkPrompt(res: NobleNetworkResult): string {
  const lines = [
    `[4대 귀인 & 인연 네트워크 시너지 리포트 (엔진: ${res.engineVersion} | ${res.calculatedAtKst})]`,
    `- 1순위 귀인 아키타입: **${res.primaryArchetype.title}** [${res.primaryArchetype.hanja}]`,
    `  • 역할: ${res.primaryArchetype.roleDescription}`,
    `  • 판별법: ${res.primaryArchetype.howToRecognize}`,
    `  • 결속 전략: ${res.primaryArchetype.connectionStrategy}`,
    `- 4대 귀인 상태:`,
    `  • 천을귀인(天乙): [${res.nobleStars.heavenlyNoble.status}] - 조력 띠: ${res.nobleStars.heavenlyNoble.beneficialAnimals.join(', ')}`,
    `  • 태극귀인(太極): [${res.nobleStars.greatUltimate.status}] - 조력 띠: ${res.nobleStars.greatUltimate.beneficialAnimals.join(', ')}`,
    `  • 천월덕귀인(日月): [${res.nobleStars.heavenlyVirtue.status} / ${res.nobleStars.monthlyVirtue.status}]`,
    `- 핵심 인연 합(合) 매트릭스:`,
    `  • 1:1 영혼의 파트너(육합): **${res.synergyZodiacAnimals.sixHarmony.join(', ')}**`,
    `  • 거대 프로젝트 동맹(삼합): **${res.synergyZodiacAnimals.tripleHarmony.join(', ')}**`,
    `- 네트워크 공명 단계: **${res.networkPhaseTitle}**`,
    `- 네트워킹 가이드:`,
    `  • 찾아야 할 인연: ${res.networkingPlaybook.whoToSeek}`,
    `  • 경계할 인연: ${res.networkingPlaybook.whoToAvoid}`,
  ];
  if (res.nobleNetworkSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스: [핵심 긴장: ${res.nobleNetworkSynthesisMatrix.dominantTension} | 조율 상태: ${res.nobleNetworkSynthesisMatrix.alignmentState}]`,
      `  • 통합 실천: ${res.nobleNetworkSynthesisMatrix.integratedAction}`,
    );
  }
  if (res.reflectiveQuestion) {
    lines.push(`- 성찰 질문: ${res.reflectiveQuestion}`);
  }
  lines.push(`- 해석 경계: ${res.interpretiveBoundary}`);
  lines.push(`※ 루시 지침: 혼자서 모든 짐을 짊어질 필요가 없습니다. 사주 4대 귀인과 합(合)의 인연 에너지는 사용자의 비범한 재능을 세상과 연결해 줄 가장 강력한 레버리지입니다. 사용자가 좋은 협력자와 멘토를 발견하고 당당히 손을 잡을 수 있도록 귀인의 특징과 시너지 비책을 지혜롭게 조언해 주세요.`);
  return lines.join('\n');
}

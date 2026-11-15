/**
 * =========================================================================
 * LUCKEY 카르믹 노드 & 영혼 진화 궤적 엔진 (Karmic Nodes & Soul Evolution)
 * =========================================================================
 * 
 * [엔진 개요]
 * 서양 점성술의 북쪽 노드(North Node / Rahu: 이번 생의 영혼 진화 과제)와
 * 남쪽 노드(South Node / Ketu: 과거 생의 컴포트 존과 카르마 잔재),
 * 블랙문 릴리스(Lilith: 사회적 검열을 뚫고 나오는 원초적 잠재력),
 * 키론(Chiron: 영혼의 상처가 타인을 구원하는 독점적 무기로 승화되는 지점)을
 * 융합하여 이번 생의 영혼 진화 궤적과 핵심 브레이크스루를 결정론적 수리로 산출합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';
import {
  calculateNatalChart,
  type NatalChartResult
} from '../astrologyAnalysis';

export const KARMIC_NODES_ENGINE_VERSION = 'LUCKEY-NODE-v2.0.0';

export interface NodeAxisDetail {
  northSign: string;
  southSign: string;
  axisName: string;
  soulQuest: string;             // 이번 생에서 반드시 개척해야 할 영혼의 과제
  comfortZoneTrap: string;       // 안주하면 정체되는 익숙한 과거의 함정
  evolutionStrategy: string;      // 진화적 돌파 액션 가이드
}

export interface ChironInsight {
  sign: string;
  primalWound: string;           // 영혼의 근원적 결핍과 상처
  healerGift: string;            // 상처를 극복하며 피어나는 천재적 치유 능력
}

export interface LilithInsight {
  sign: string;
  rawPower: string;              // 타인의 눈치를 보지 않을 때 폭발하는 순수 에너지
  shadowToMaster: string;        // 억압하지 않고 건강하게 발현시키는 법
}

export interface KarmicNodesResult {
  engineVersion: string;
  calculatedAtIso: string;
  calculatedAtKst: string;

  // 카르믹 노드 축 (북쪽 노드 & 남쪽 노드)
  nodeAxis: NodeAxisDetail;

  // 키론의 상처와 치유자 무기
  chiron: ChironInsight;

  // 블랙문 릴리스의 야성적 잠재력
  lilith: LilithInsight;

  // 영혼 진화 지수 (0~100)
  evolutionReadinessScore: number;
  soulPhase: 'awakening' | 'breakthrough_quest' | 'karmic_mastery' | 'legacy_building';
  soulPhaseTitle: string;

  summary: string;
  karmicNodesSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatKarmicNodesKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

// 12대 노드 축 정통 점성술 매핑
const NODE_AXES: Record<number, NodeAxisDetail> = {
  0: {
    northSign: '양자리 (Aries)',
    southSign: '천칭자리 (Libra)',
    axisName: '자기 주도와 독립의 축 (Independence)',
    soulQuest: '타인의 승인과 평판에 연연하지 않고, 내면의 직관과 주체적 야성으로 세상에 첫발을 내딛는 것',
    comfortZoneTrap: '과도한 타협, 눈치 보기, 관계에 대한 과잉 의존으로 자신의 진짜 목소리를 삼키는 정체',
    evolutionStrategy: '갈등을 두려워하지 말고, 내 프로젝트와 삶의 주도권을 직접 쥐고 당당하게 전진하기'
  },
  1: {
    northSign: '황소자리 (Taurus)',
    southSign: '전갈자리 (Scorpio)',
    axisName: '물질적 토대와 내면 평온의 축 (Self-Worth & Peace)',
    soulQuest: '극적인 위기나 심리적 드라마 없이도, 자신만의 확고한 가치와 단순하고 풍요로운 토대를 구축하는 것',
    comfortZoneTrap: '타인의 자원이나 통제 욕구에 집착하며, 끝없는 심리적 긴장과 위기 상황을 스스로 조장함',
    evolutionStrategy: '오감의 평온을 누리며, 작지만 단단한 나만의 실질적 자산과 시스템을 묵묵히 쌓아가기'
  },
  2: {
    northSign: '쌍둥이자리 (Gemini)',
    southSign: '사수자리 (Sagittarius)',
    axisName: '유연한 소통과 일상 관찰의 축 (Curiosity & Connection)',
    soulQuest: '거대하고 추상적인 이론에 매몰되지 않고, 눈앞의 디테일과 사람들의 실제 목소리를 기민하게 수용하는 것',
    comfortZoneTrap: '모든 것을 다 안다는 오만함, 섣부른 도덕적 훈계, 현실과 동떨어진 관념적 독선',
    evolutionStrategy: '어린아이 같은 호기심으로 질문을 던지고, 가벼운 대화 속에서 새로운 해답을 연결하기'
  },
  3: {
    northSign: '게자리 (Cancer)',
    southSign: '염소자리 (Capricorn)',
    axisName: '정서적 교감과 따뜻한 둥지의 축 (Emotional Roots)',
    soulQuest: '사회적 직함이나 성과라는 차가운 갑옷을 벗고, 내면의 감정을 솔직히 느끼며 따뜻한 유대를 형성하는 것',
    comfortZoneTrap: '지나친 의무감, 일 중독, 감정을 억누르고 오직 외적 통제와 성취에만 매달리는 고립감',
    evolutionStrategy: '자신의 취약함을 인정하고, 나 자신과 소중한 사람들에게 따뜻한 쉼터를 선물하기'
  },
  4: {
    northSign: '사자자리 (Leo)',
    southSign: '물병자리 (Aquarius)',
    axisName: '개인적 창조성과 찬란한 자기표현의 축 (Creative Radiance)',
    soulQuest: '익명의 군중 뒤에 숨지 않고, 내 심장이 뛰는 창작과 열정을 무대 위에서 당당히 펼쳐 보이는 것',
    comfortZoneTrap: '지나치게 객관적인 관찰자로만 머물며 차갑게 냉소하거나, 집단적 이상 뒤로 자아를 숨김',
    evolutionStrategy: '틀에 얽매이지 않고 내가 가장 사랑하는 일에 순수한 아이처럼 몰입하여 빛을 발하기'
  },
  5: {
    northSign: '처녀자리 (Virgo)',
    southSign: '물고기자리 (Pisces)',
    axisName: '정밀한 시스템과 실용적 헌신의 축 (Pragmatic Mastery)',
    soulQuest: '막연한 환상과 무력한 도피에서 벗어나, 현실적인 루틴과 정교한 솔루션으로 구체적 가치를 창출하는 것',
    comfortZoneTrap: '피해자 의식, 모호한 감상주의, 경계 없는 감정 소모와 현실 도피적 게으름',
    evolutionStrategy: '정돈된 일상 습관, 군더더기 없는 장인 정신, 실용적인 문제 해결에 집중하기'
  }
};

/**
 * 카르믹 노드 연산 메인 함수
 */
export function calculateKarmicNodes(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  natalChart?: NatalChartResult | null;
  targetDate?: Date;
}): KarmicNodesResult {
  const now = params?.targetDate || new Date();
  const saju = params?.saju || calculateDetailedSaju(params?.profile || null);
  const astro = params?.natalChart || calculateNatalChart(params?.profile);

  // 1. 생년월일 수리 기반 노드 축 결정 (18.6년 주기 시뮬레이션)
  const bdate = params?.profile?.basic?.birthdate || '1994-01-24';
  const parts = bdate.split('-').map(Number);
  const birthYear = parts[0] || 1994;
  const birthMonth = parts[1] || 1;
  const birthDay = parts[2] || 24;

  const nodeSeed = Math.abs((birthYear * 12 + birthMonth * 31 + birthDay) % 6);
  const nodeAxis = NODE_AXES[nodeSeed] || NODE_AXES[0];

  // 2. 키론(Chiron) 영혼의 상처 & 치유자 선물 도출
  const chironIndex = (birthYear + birthMonth) % 4;
  const chironList: ChironInsight[] = [
    {
      sign: '불의 궁 (양/사자/사수)',
      primalWound: '자신의 존재 가치와 추진력이 거부당했을 때의 깊은 좌절감',
      healerGift: '남들이 포기한 절망 속에서도 다시 일어설 수 있도록 용기를 불어넣는 불꽃의 리더십'
    },
    {
      sign: '흙의 궁 (황소/처녀/염소)',
      primalWound: '물질적 결핍에 대한 공포나 완벽하지 못하다는 자책감',
      healerGift: '혼돈 속에서도 가장 현실적이고 무너지지 않는 시스템과 풍요의 토대를 직조해 내는 능력'
    },
    {
      sign: '공기의 궁 (쌍둥이/천칭/물병)',
      primalWound: '자신의 생각이나 목소리가 타인에게 온전히 이해받지 못했다는 소외감',
      healerGift: '복잡하게 꼬인 갈등과 정보를 명쾌한 언어와 논리로 풀어내어 사람들을 잇는 소통력'
    },
    {
      sign: '물의 궁 (게/전갈/물고기)',
      primalWound: '정서적 배신이나 상실, 깊은 외로움에서 오는 영혼의 아픔',
      healerGift: '말하지 않아도 타인의 아픔을 감지하고, 깊은 공감과 예술적 치유를 선사하는 영성'
    }
  ];
  const chiron = chironList[chironIndex];

  // 3. 블랙문 릴리스(Lilith) 야성적 잠재력 도출
  const lilithIndex = (birthDay + (saju.elements.counts['목'] || 0) * 3) % 3;
  const lilithList: LilithInsight[] = [
    {
      sign: '자율적 반역자 (Sovereign Rebel)',
      rawPower: '세상의 규칙이나 권위적 압박에 굴복하지 않고, 독자적인 패러다임을 직접 창조하는 급진적 파괴력',
      shadowToMaster: '맹목적인 반항심으로 에너지를 소모하지 말고, 세상을 한 단계 도약시키는 시스템 혁신에 쏟기'
    },
    {
      sign: '원초적 직관자 (Primal Intuitive)',
      rawPower: '논리를 초월해 사람과 시장의 본질, 가려진 진실을 0.1초 만에 꿰뚫어 보는 본능적 레이더',
      shadowToMaster: '너무 많은 것을 꿰뚫어 보아 생기는 인간 혐오를 내려놓고, 온화한 지혜로 승화시키기'
    },
    {
      sign: '자유로운 창조가 (Untamed Creator)',
      rawPower: '타인의 시선이나 검열을 완전히 벗어던질 때 뿜어져 나오는 압도적인 예술적·독창적 아우라',
      shadowToMaster: '자기표현에 대한 두려움을 버리고, 가장 나다운 솔직한 결과물을 세상에 과감히 공개하기'
    }
  ];
  const lilith = lilithList[lilithIndex];

  // 4. 영혼 진화 지수 산출
  let evolutionReadinessScore = 80;
  if (saju.specialStructures.some(s => s.name.includes('괴강') || s.name.includes('백호'))) {
    evolutionReadinessScore += 10; // 강한 영혼의 추진력
  }
  if (saju.elements.counts['화'] >= 1 && saju.elements.counts['금'] >= 1) {
    evolutionReadinessScore += 5; // 결단력과 열정의 조화
  }
  evolutionReadinessScore = Math.min(98, evolutionReadinessScore);

  let soulPhase: KarmicNodesResult['soulPhase'] = 'breakthrough_quest';
  let soulPhaseTitle = '영혼의 도약 퀘스트기 (Breakthrough Quest)';

  if (evolutionReadinessScore >= 90) {
    soulPhase = 'karmic_mastery';
    soulPhaseTitle = '카르마 마스터리 완성기 (Karmic Mastery)';
  } else if (evolutionReadinessScore >= 80) {
    soulPhase = 'breakthrough_quest';
    soulPhaseTitle = '영혼의 과감한 돌파기 (Breakthrough Quest)';
  } else {
    soulPhase = 'awakening';
    soulPhaseTitle = '본질 자각 및 정렬기 (Soul Awakening)';
  }

  const calculatedAtKst = formatKarmicNodesKstTimestamp(now);
  const karmicNodesSynthesisMatrix = {
    dominantTension: `${nodeAxis.northSign} (진화 과제) ↔ ${nodeAxis.southSign} (컴포트 존)`,
    alignmentState: `${soulPhaseTitle} — 키론의 치유 역량과 릴리스의 주체성이 북쪽 노드로 수렴하는 국면`,
    integratedAction: `${nodeAxis.evolutionStrategy} | ${lilith.shadowToMaster}`,
  };

  const summary = `[카르믹 노드] 축: ${nodeAxis.axisName} (${nodeAxis.northSign} ➔ ${nodeAxis.southSign}). ` +
    `영혼의 과제: ${nodeAxis.soulQuest}. 컴포트 존 탈출: ${nodeAxis.comfortZoneTrap}. ` +
    `키론 치유자 무기: ${chiron.sign} [${chiron.healerGift}]. 릴리스 야성: ${lilith.sign}. 영혼 진화 흐름: ${soulPhaseTitle}.`;

  return {
    engineVersion: KARMIC_NODES_ENGINE_VERSION,
    calculatedAtIso: now.toISOString(),
    calculatedAtKst,
    nodeAxis,
    chiron,
    lilith,
    evolutionReadinessScore,
    soulPhase,
    soulPhaseTitle,
    summary,
    karmicNodesSynthesisMatrix,
  };
}

/**
 * 프롬프트 주입용 포맷터
 */
export function formatKarmicNodesPrompt(res: KarmicNodesResult): string {
  const lines = [
    `[카르믹 노드 & 영혼 진화 궤적 리포트 (엔진: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst})]`,
    `- 카르믹 노드 축: **${res.nodeAxis.axisName}**`,
    `  • 북쪽 노드(진화 과제): **${res.nodeAxis.northSign}** ➔ ${res.nodeAxis.soulQuest}`,
    `  • 남쪽 노드(함정 컴포트 존): **${res.nodeAxis.southSign}** ➔ ${res.nodeAxis.comfortZoneTrap}`,
    `  • 진화 돌파 전략: ${res.nodeAxis.evolutionStrategy}`,
    `- 키론(Chiron - 영혼의 상처와 치유 무기): [${res.chiron.sign}]`,
    `  • 근원 상처: ${res.chiron.primalWound}`,
    `  • 치유자 무기: ${res.chiron.healerGift}`,
    `- 블랙문 릴리스(Lilith - 무검열 야성적 잠재력): [${res.lilith.sign}]`,
    `  • 원초적 에너지: ${res.lilith.rawPower}`,
    `  • 그림자 마스터리: ${res.lilith.shadowToMaster}`,
    `- 영혼 진화 단계: **${res.soulPhaseTitle}**`,
    `※ 루시 지침: 카르마는 과거의 죄가 아니라 '이번 생에서 활짝 꽃피워야 할 영혼의 진화 테마'입니다. 사용자가 익숙한 컴포트 존(남쪽 노드)에 머무르며 스스로를 제한하지 않도록, 북쪽 노드가 가리키는 담대한 도전과 키론이 선사한 독보적인 무기를 따뜻하고 강렬하게 일깨워 주세요.`,
  ];
  if (res.karmicNodesSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.karmicNodesSynthesisMatrix.dominantTension} | 조율 상태: ${res.karmicNodesSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.karmicNodesSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}

/**
 * =========================================================================
 * LUCKEY 고대 수메르 에리두 창세력 & 50대 메(Me) 신성 문명 규범 엔진
 * (Sumerian Eridu Genesis & Fifty Sacred Mes Civilization Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 인류 최고(最古)의 메소포타미아 수메르 에리두 창세 신화와
 * 지혜의 신 엔키(Enki), 이난나(Inanna)의 우주 신성 규범인 《메(Me / Sacred Decrees)》 원전.
 * 
 * 1. 50대 메(Me):
 *    - 우주의 운행, 문명의 유지, 지혜, 정의, 기술, 사랑, 통치, 예술, 사제권 등을 관장하는
 *      수메르 신성 문명의 불변 규범이자 형이상학적 프로그램.
 * 2. 수메르 6대 핵심 문명 메 클러스터:
 *    - 남룬갈 (Nam-lugal): 고결한 리더십과 공정한 주권
 *    - 남에메 (Nam-eme): 지혜로운 언어와 설득력, 계약의 힘
 *    - 남타르 (Nam-tar): 운명을 개척하고 결단하는 권능
 *    - 남티라 (Nam-ti-la): 충만한 생명력과 치유의 회복
 *    - 남자그 (Nam-zag): 경계를 정돈하고 정의를 세우는 공의
 *    - 남쿠 (Nam-ku): 신비로운 직관과 예술적 영감
 * 3. 수메르 문명 창조력 지수 (Sumerian Civilization Creation Index - 0 ~ 100)
 */

import type { UserProfile } from '../sharedState';

export const SUMERIAN_FIFTY_MES_VERSION = 'LUCKEY-SUMERIAN-FIFTY-MES-v2.0.0';

export interface SumerianMeArchetype {
  cuneiformCode: string;
  koreanName: string;
  civilizationDomain: string;      // 문명 관할 영역
  sacredVirtue: string;            // 신성한 미덕
  eriduOracleDecree: string;       // 에리두 신탁 규범
}

export interface SumerianMeReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  primaryMe: SumerianMeArchetype;
  creationIndex: number;           // 0 ~ 100 문명 창조력 지수
  civilizationResonance: string;   // 사회 및 환경과의 공명도
  sumerianWisdomOmen: string;
  synthesisMessage: string;
  fiftyMesSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatFiftyMesKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

const SUMERIAN_MES: SumerianMeArchetype[] = [
  {
    cuneiformCode: '남룬갈 (Nam-lugal)',
    koreanName: '고결한 주권과 통치의 메',
    civilizationDomain: '리더십, 결단, 공정한 통솔과 사회적 영향력',
    sacredVirtue: '흔들리는 무리를 바른 길로 이끌고 책임을 온전히 감당하는 당당한 권능',
    eriduOracleDecree: '네 뜻을 당당히 세우고 공의로운 마음으로 네 영역의 주권자가 되어라.',
  },
  {
    cuneiformCode: '남에메 (Nam-eme)',
    koreanName: '지혜로운 언어와 소통의 메',
    civilizationDomain: '대화, 저작, 지식 전수와 상호 합의',
    sacredVirtue: '사람의 마음을 녹이고 복잡한 오해를 명쾌하게 풀어내는 진실된 언변',
    eriduOracleDecree: '말 한마디에 신성한 지혜를 담아라. 네 언어가 새로운 관계를 창조하리라.',
  },
  {
    cuneiformCode: '남타르 (Nam-tar)',
    koreanName: '운명 개척과 결단의 메',
    civilizationDomain: '기회 포착, 진로 전환, 정체 상태 타개',
    sacredVirtue: '주어진 환경에 갇히지 않고 스스로 새로운 운명의 길을 설계하는 개척자적 용기',
    eriduOracleDecree: '과거의 낡은 서판을 깨뜨리고, 오늘 네 손으로 새로운 운명을 새겨라.',
  },
  {
    cuneiformCode: '남티라 (Nam-ti-la)',
    koreanName: '충만한 생명과 치유의 메',
    civilizationDomain: '활력 회복, 심신 안정, 환경과의 생체 리듬 조화',
    sacredVirtue: '피폐해진 영혼과 육신을 본원적인 샘물(아프수)로 적셔 소생시키는 회복력',
    eriduOracleDecree: '서두르는 걸음을 멈추고 생명의 원천을 돌아보라. 내면의 물길이 평온을 되찾으리라.',
  },
  {
    cuneiformCode: '남자그 (Nam-zag)',
    koreanName: '정의와 경계 확립의 메',
    civilizationDomain: '원칙 수호, 계약 성실성, 불의와 혼란 분별',
    sacredVirtue: '침범해서는 안 될 선을 명확히 긋고 정직함으로 주변을 밝히는 도덕적 척도',
    eriduOracleDecree: '불의와 타협하지 않는 올곧은 기준이 결국 가장 견고한 방패가 되리라.',
  },
  {
    cuneiformCode: '남쿠 (Nam-ku)',
    koreanName: '신성한 직관과 예술의 메',
    civilizationDomain: '창의성, 미적 감각, 통찰력과 영적 각성',
    sacredVirtue: '보이지 않는 세계의 아름다움과 우주적 영감을 현실의 형태로 빚어내는 재능',
    eriduOracleDecree: '네 영혼의 직관을 신뢰하라. 깊은 곳에서 울리는 창조의 불꽃이 세상을 밝히리라.',
  },
];

export function calculateSumerianFiftyMes(
  profile?: UserProfile,
  question?: string,
  now: Date = new Date(),
): SumerianMeReport {
  const birthStr = profile?.basic?.birthdate || '1990-01-01';
  const nameStr = profile?.basic?.name || 'Eridu';
  const q = (question || '').trim();

  let seed = 0;
  for (let i = 0; i < birthStr.length; i++) seed = (seed * 31 + birthStr.charCodeAt(i)) & 0x7fffffff;
  for (let i = 0; i < nameStr.length; i++) seed = (seed * 29 + nameStr.charCodeAt(i)) & 0x7fffffff;
  for (let i = 0; i < q.length; i++) seed = (seed * 17 + q.charCodeAt(i)) & 0x7fffffff;

  const meIdx = (seed + now.getUTCMonth() + now.getUTCDate()) % SUMERIAN_MES.length;
  const primaryMe = SUMERIAN_MES[meIdx];
  const secondaryMe = SUMERIAN_MES[(meIdx + 1) % SUMERIAN_MES.length];

  const creationIndex = 75 + ((seed * 7 + now.getUTCHours() * 11) % 24);

  let civilizationResonance = '에리두의 지혜의 샘물이 당신의 일상과 조화롭게 공명하고 있습니다.';
  if (creationIndex > 88) {
    civilizationResonance = '문명 창조의 신성 규범이 최고조로 발현되어 어떤 환경에서도 확고한 리더십과 영향력을 발휘합니다.';
  }

  const sumerianWisdomOmen = `수메르 에리두 신전의 서판에 따르면, 오늘 당신의 영혼에 부여된 신성 규범은 [${primaryMe.koreanName}]입니다. "${primaryMe.eriduOracleDecree}"`;

  const synthesisMessage = `수메르 50대 메 원전에 따라, 당신의 현실 구축 힘은 [${primaryMe.cuneiformCode}]와 연결되어 있습니다.`;

  const calculatedAtKst = formatFiftyMesKstTimestamp(now);
  const fiftyMesSynthesisMatrix = {
    dominantTension: `${primaryMe.cuneiformCode} ↔ ${secondaryMe.cuneiformCode}`,
    alignmentState: `${primaryMe.koreanName} · ${primaryMe.civilizationDomain}`,
    integratedAction: `${primaryMe.eriduOracleDecree}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  return {
    engineVersion: SUMERIAN_FIFTY_MES_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    primaryMe,
    creationIndex,
    civilizationResonance,
    sumerianWisdomOmen,
    synthesisMessage,
    fiftyMesSynthesisMatrix,
  };
}

export function formatSumerianFiftyMesPrompt(report: SumerianMeReport): string {
  const lines = [
    `### 🏺 고대 수메르 에리두 50대 메(Me) 신성 문명 규범 엔진 (${SUMERIAN_FIFTY_MES_VERSION})`,
    `- **연산 시각**: ${report.calculatedAtKst}`,
    `- **오늘의 수메르 수호 메(Me)**: **${report.primaryMe.koreanName}** (${report.primaryMe.cuneiformCode})`,
    `  - 문명 관할: ${report.primaryMe.civilizationDomain}`,
    `  - 신성한 미덕: ${report.primaryMe.sacredVirtue}`,
    `  - 에리두 신탁 규범: "${report.primaryMe.eriduOracleDecree}"`,
    `- **수메르 문명 창조력 공명 상태**: ${report.civilizationResonance}`,
    `- **에리두 일일 나침반**: ${report.sumerianWisdomOmen}`,
    `- **수메르 신성 규범 통합 결론**: ${report.synthesisMessage}`,
  ];
  if (report.fiftyMesSynthesisMatrix) {
    lines.push(
      `- **교차 매트릭스**: [핵심 긴장: ${report.fiftyMesSynthesisMatrix.dominantTension} | 조율 상태: ${report.fiftyMesSynthesisMatrix.alignmentState}]`,
      `  - 통합 실천: ${report.fiftyMesSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}

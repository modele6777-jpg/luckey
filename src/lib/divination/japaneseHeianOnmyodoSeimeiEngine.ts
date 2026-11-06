/**
 * 일본 헤이안 시대 아베노 세이메이(安倍晴明) 《점사략(占事略)》 12천장 수호령 & 식신(式神) 사역 & 태산부군제 수명 연장 엔진
 *
 * LUCKEY-HEIAN-ONMYODO-SEIMEI-v1.0.0
 *
 * 10세기 일본 헤이안(平安) 시대 전설적 대음양사 아베노 세이메이(安倍晴明, 921~1005)의
 * 친필 비전서 《점사략(占事略, 센지랴쿠)》 및 천문밀교·육임신과에 기반한 12천장 수호령 및 식신 사역 결정론 엔진.
 *
 * [핵심 비전 체계]
 * 1. 12천장(十二天將):
 *    - 귀인(貴人·토): 최고의 길신, 존귀와 복록, 귀인의 후원
 *    - 등사(螣蛇·화): 화의 뱀, 허망한 놀람 방어, 영적 직관 환각 차단
 *    - 주작(朱雀·화): 문필과 관록, 명예, 활발한 소통과 정보
 *    - 육합(六合·목): 결연과 화합, 혼인, 신뢰 깊은 파트너십
 *    - 구진(勾陳·토): 쟁투와 소송 방어, 정체된 장벽 돌파
 *    - 청룡(青龍·목): 재물과 번영, 승진, 봄의 팽창 에너지
 *    - 천후(天后·수): 온화함과 음덕, 치유, 내면의 자애
 *    - 태음(太陰·금): 지혜와 기획, 비밀의 보존, 심층 통찰
 *    - 현무(玄武·수): 도난과 수난 차단, 지략, 밤의 수호
 *    - 태상(太常·토): 경사와 연회, 의복과 음식의 풍요, 정당한 보상
 *    - 백호(白虎·금): 용맹과 결단, 급작스런 액운 파쇄, 불굴의 기개
 *    - 천공(天空·토): 공(空)의 허탈 방지, 영적 초연함, 거짓 간파
 * 2. 식신(式神, Shikigami) 사역 영력장:
 *    - 음양사의 잠재의식과 의지를 대행하여 액운을 물리치고 기운을 정화하는 영적 사역체.
 * 3. 세이메이 도망(桔梗紋, 오망성 펜타그램):
 *    - 목·화·토·금·수 5행의 상생과 상극을 완벽히 조화시키는 철통 결계.
 * 4. 태산부군제(泰山府君祭):
 *    - 명부의 주재자 태산부군에게 주청하여 쇠약해진 명운을 되살리고 수명과 기운을 대역전시키는 비법.
 */

import type { UserProfile } from '../sharedState';

export const HEIAN_ONMYODO_SEIMEI_VERSION = '1.0.0';

export interface HeianOnmyodoSeimeiReport {
  engineVersion: string;
  calculatedAt: string;
  // 음양도 5대 수리 지표 (0~100)
  shikigamiCommandResonance: number; // 식신 사역 영력장 및 잠재의식 동조율
  seimeiFivePointedStarWardStrength: number; // 세이메이 오망성(桔梗紋) 5행 결계 방어력
  taishanGodDestinyReversalPower: number; // 태산부군제(泰山府君祭) 명운 역전 및 생명 활력도
  yinYangPolarityBalanceScore: number; // 음양 극성 균형 점수
  sixCoursesDivinationAccuracy: number; // 육임신과 천지반(天地盤) 직관 통찰력
  // 12천장 수호령
  primaryGuardianGeneral: {
    nameKo: string;
    kanji: string;
    element: string;
    quality: string;
    blessing: string;
  };
  secondaryGuardianGeneral: {
    nameKo: string;
    kanji: string;
    blessing: string;
  };
  onmyoPurificationGuidance: string;
}

function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const TWELVE_HEAVENLY_GENERALS = [
  {
    nameKo: '귀인 (貴人)',
    kanji: '貴人',
    element: '토(土)',
    quality: '대길(大吉) 지존',
    blessing: '세상에서 가장 존귀한 인연과 후원자를 끌어당기며 모든 흉살을 무력화함'
  },
  {
    nameKo: '청룡 (青龍)',
    kanji: '青龍',
    element: '목(木)',
    quality: '상길(上吉) 번영',
    blessing: '새로운 기획과 사업, 재물운의 비약적 성장과 입신양명의 활로를 개척함'
  },
  {
    nameKo: '육합 (六合)',
    kanji: '六合',
    element: '목(木)',
    quality: '길(吉) 화합',
    blessing: '인간관계의 오해를 풀고 신의 깊은 협력자 및 평생의 도반을 결속시킴'
  },
  {
    nameKo: '주작 (朱雀)',
    kanji: '朱雀',
    element: '화(火)',
    quality: '문채(文彩) 명예',
    blessing: '문서, 시험, 학술, 미디어 발표에서 세간의 이목을 끌고 명성을 떨치게 함'
  },
  {
    nameKo: '등사 (螣蛇)',
    kanji: '螣蛇',
    element: '화(火)',
    quality: '경각(警覺) 직관',
    blessing: '도사린 음모와 환각을 간파하고 위기 상황에서 동물적인 생존 직관을 발동함'
  },
  {
    nameKo: '구진 (勾陳)',
    kanji: '勾陳',
    element: '토(土)',
    quality: '견고(堅固) 쟁파',
    blessing: '지루하게 끌던 소송, 분쟁, 관재구설을 정면 돌파하여 영토와 권리를 사수함'
  },
  {
    nameKo: '태상 (太常)',
    kanji: '太常',
    element: '토(土)',
    quality: '경사(慶事) 풍요',
    blessing: '노력한 대가를 온전히 보상받으며 승진, 포상, 풍요로운 의식주 축복을 안김'
  },
  {
    nameKo: '천후 (天后)',
    kanji: '天后',
    element: '수(水)',
    quality: '자애(慈愛) 치유',
    blessing: '지친 심신을 부드럽게 감싸안아 치유하며 보이지 않는 곳에서 음덕을 쌓음'
  },
  {
    nameKo: '태음 (太陰)',
    kanji: '太陰',
    element: '금(金)',
    quality: '심지(深智) 은밀',
    blessing: '깊은 지혜와 치밀한 전략으로 적을 제압하며 소중한 비밀과 자산을 수호함'
  },
  {
    nameKo: '현무 (玄武)',
    kanji: '玄武',
    element: '수(水)',
    quality: '방비(防備) 지략',
    blessing: '도난, 분실, 재물 유출을 원천 차단하고 어두운 밤길에서도 바른 방향을 찾음'
  },
  {
    nameKo: '백호 (白虎)',
    kanji: '白虎',
    element: '금(金)',
    quality: '용맹(勇猛) 결단',
    blessing: '어설픈 망설임을 단칼에 베어내고 닥쳐온 흉액을 정면으로 분쇄하는 패기'
  },
  {
    nameKo: '천공 (天空)',
    kanji: '天空',
    element: '토(土)',
    quality: '초연(超然) 혜안',
    blessing: '세속의 헛된 집착과 기만을 털어내고 높은 차원에서 판을 조망하는 대자유'
  }
];

export function calculateHeianOnmyodoSeimei(profile: UserProfile | null | undefined): HeianOnmyodoSeimeiReport {
  const birthStr = profile?.basic?.birthdate || '1995-01-01';
  const nameStr = profile?.basic?.name || '내담자';
  const timeStr = profile?.basic?.birthtime || '12:00';

  const seed = djb2Hash(`${birthStr}_${nameStr}_${timeStr}_onmyodo_seimei`);

  const shikigamiCommandResonance = 60 + (seed % 39);
  const seimeiFivePointedStarWardStrength = 63 + ((seed >> 2) % 36);
  const taishanGodDestinyReversalPower = 58 + ((seed >> 4) % 41);
  const yinYangPolarityBalanceScore = 55 + ((seed >> 6) % 43);
  const sixCoursesDivinationAccuracy = 62 + ((seed >> 8) % 37);

  const primaryIdx = seed % TWELVE_HEAVENLY_GENERALS.length;
  let secondaryIdx = (seed >> 3) % TWELVE_HEAVENLY_GENERALS.length;
  if (secondaryIdx === primaryIdx) {
    secondaryIdx = (primaryIdx + 1) % TWELVE_HEAVENLY_GENERALS.length;
  }

  const primaryGuardianGeneral = TWELVE_HEAVENLY_GENERALS[primaryIdx];
  const secondaryGuardianGeneral = {
    nameKo: TWELVE_HEAVENLY_GENERALS[secondaryIdx].nameKo,
    kanji: TWELVE_HEAVENLY_GENERALS[secondaryIdx].kanji,
    blessing: TWELVE_HEAVENLY_GENERALS[secondaryIdx].blessing
  };

  let onmyoPurificationGuidance = '';
  if (seimeiFivePointedStarWardStrength >= 85) {
    onmyoPurificationGuidance = '세이메이 오망성(桔梗紋) 결계가 당신의 기운을 완벽하게 보호하고 있습니다. 외부의 부정적인 질투나 소음이 전혀 침범하지 못하니, 대담하게 당신의 뜻을 펼치십시오.';
  } else if (taishanGodDestinyReversalPower >= 82) {
    onmyoPurificationGuidance = '태산부군제의 강력한 회생 에너지가 작동하고 있습니다. 과거의 실패나 침체된 운명을 일거에 뒤집는 반전의 타이밍이므로, 주저하지 말고 새로운 도전을 시작하십시오.';
  } else {
    onmyoPurificationGuidance = '소금과 맑은 물로 주변 공간을 정화하고, 매일 아침 동쪽을 향해 심호흡하며 12천장의 수호령을 상기하십시오. 흩어진 잡념이 정돈되며 올바른 판단력이 살아납니다.';
  }

  return {
    engineVersion: HEIAN_ONMYODO_SEIMEI_VERSION,
    calculatedAt: new Date().toISOString(),
    shikigamiCommandResonance,
    seimeiFivePointedStarWardStrength,
    taishanGodDestinyReversalPower,
    yinYangPolarityBalanceScore,
    sixCoursesDivinationAccuracy,
    primaryGuardianGeneral,
    secondaryGuardianGeneral,
    onmyoPurificationGuidance
  };
}

export function formatHeianOnmyodoSeimeiPrompt(report: HeianOnmyodoSeimeiReport): string {
  return `### 일본 헤이안 음양도 아베노 세이메이 《점사략》 12천장 & 식신 사역 엔진 (v${report.engineVersion})
- **주 수호 신장 (十二天將)**: ${report.primaryGuardianGeneral.nameKo} [${report.primaryGuardianGeneral.element} / ${report.primaryGuardianGeneral.quality}]
  - *신장 축복*: ${report.primaryGuardianGeneral.blessing}
- **보조 수호 신장**: ${report.secondaryGuardianGeneral.nameKo} (${report.secondaryGuardianGeneral.blessing})
- **음양도 5대 수리 지표**:
  - 식신(式神) 사역 영력 동조율: ${report.shikigamiCommandResonance}점 / 100
  - 세이메이 오망성(桔梗紋) 5행 결계 방어력: ${report.seimeiFivePointedStarWardStrength}점 / 100
  - 태산부군제(泰山府君祭) 명운 역전 생명력: ${report.taishanGodDestinyReversalPower}점 / 100
  - 음양 극성 균형도: ${report.yinYangPolarityBalanceScore}점 / 100
  - 육임신과 천지반 직관 통찰력: ${report.sixCoursesDivinationAccuracy}점 / 100
- **아베노 세이메이 액막이 비방**:
  - "${report.onmyoPurificationGuidance}"`;
}

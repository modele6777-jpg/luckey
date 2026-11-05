/**
 * 고대 노르딕 세계수 위그드라실 9대 영역 엔진 (Nordic Yggdrasil Nine Realms Engine)
 *
 * 고대 북유럽 노르웨이-아이슬란드 신화의 세계수 위그드라실(Yggdrasil) 9대 영역(Nine Realms)과
 * 비프로스트(Bifrost) 의식의 다리를 현대인의 라이프스타일 에너지 축 및 결단 체계에 연동합니다.
 */

export const NORDIC_YGGDRASIL_NINE_REALMS_ENGINE_VERSION = 'LUCKEY-YGGDRASIL-NINE-REALMS-v1.0.0';

export interface NordicRealm {
  realmId: number;
  nameEn: string;
  nameKo: string;
  planeLevel: '상층 천상계' | '중층 현실계' | '하층 근원계';
  coreEssence: string;
  archetypalGift: string;
  shadowChallenge: string;
  realmActionRule: string;
  rulingRune: string;
}

export interface YggdrasilRealmsReport {
  engineVersion: string;
  calculatedAt: string;
  dominantRealm: NordicRealm;
  shadowTensionRealm: NordicRealm;
  yggdrasilAxisAlignmentScore: number; // 0 ~ 100 (세계수 중심축 정렬도)
  bifrostBridgeClearance: number; // 0 ~ 100 (의식과 무의식을 잇는 무지개 다리 통과력)
  runeAttunementKey: string;
  masterCosmicPrescription: string;
}

const NINE_REALMS: NordicRealm[] = [
  {
    realmId: 1,
    nameEn: 'Asgard',
    nameKo: '아스가르드 (신성한 의지와 영적 사명)',
    planeLevel: '상층 천상계',
    coreEssence: '높은 이상, 영웅적 의지, 타협 없는 주권 수호',
    archetypalGift: '명확한 비전 수립과 전략적 리더십',
    shadowChallenge: '독선과 권위주의, 타인의 현실적 고통에 대한 둔감함',
    realmActionRule: '나의 목표가 단순한 야망을 넘어 공동체 전체를 수호하는 대의명분인지 점검하세요.',
    rulingRune: 'Ansuz (ᚨ - 신성한 지혜와 전령)',
  },
  {
    realmId: 2,
    nameEn: 'Vanaheim',
    nameKo: '바나헤임 (자연의 풍요와 감성적 조화)',
    planeLevel: '상층 천상계',
    coreEssence: '대자연의 순환, 풍요, 치유, 직관적 예지력',
    archetypalGift: '부드러운 타협과 환경에 대한 뛰어난 적응력',
    shadowChallenge: '경계선의 붕괴, 과도한 감정 몰입으로 인한 결단 유예',
    realmActionRule: '자연의 섭리를 믿고 억지 조작을 멈추며 흐름에 몸을 맡기세요.',
    rulingRune: 'Ingwaz (ᛝ - 내적 결실과 새로운 잉태)',
  },
  {
    realmId: 3,
    nameEn: 'Alfheim',
    nameKo: '알프헤임 (빛의 엘프와 예술적 영감)',
    planeLevel: '상층 천상계',
    coreEssence: '순수한 미적 감각, 번뜩이는 아이디어, 영혼의 고양',
    archetypalGift: '창의적 콘텐츠 창작과 고차원적 영감 포착',
    shadowChallenge: '비현실적 공상, 현실의 궂은일에 대한 혐오감',
    realmActionRule: '머릿속 아름다운 아이디어를 스케치나 글로 즉시 구체화하세요.',
    rulingRune: 'Sowilo (ᛋ - 태양의 승리와 찬란한 빛)',
  },
  {
    realmId: 4,
    nameEn: 'Midgard',
    nameKo: '미드가르드 (현실 물리계와 인간적 유대)',
    planeLevel: '중층 현실계',
    coreEssence: '현재 이 순간의 구체적 현실, 인간적 신의와 협력',
    archetypalGift: '실질적인 실행력과 현장 중심의 문제 해결',
    shadowChallenge: '세속적 근시안, 영적 비전을 잃어버린 채 현실에 매몰됨',
    realmActionRule: '오늘 만나는 사람들에게 진솔한 신의를 다하고 현장의 실무를 끝마치세요.',
    rulingRune: 'Mannaz (ᛗ - 인간적 연대와 상호 존중)',
  },
  {
    realmId: 5,
    nameEn: 'Jotunheim',
    nameKo: '요툰헤임 (거인의 원초적 힘과 거대한 시련)',
    planeLevel: '중층 현실계',
    coreEssence: '가공되지 않은 거친 자연력, 불가항력적 외적 도전',
    archetypalGift: '거대한 장벽을 정면으로 돌파하는 원초적 뚝심과 인내',
    shadowChallenge: '맹목적인 완력 사용, 분노와 피해의식에 사로잡힘',
    realmActionRule: '상대의 거센 저항에 맞서 감정으로 맞서지 말고 지혜로운 레버리지를 활용하세요.',
    rulingRune: 'Thurisaz (ᚦ - 거인의 가시와 원초적 방어)',
  },
  {
    realmId: 6,
    nameEn: 'Nidavellir',
    nameKo: '니다벨리르 (드워프의 장인정신과 물질적 부)',
    planeLevel: '중층 현실계',
    coreEssence: '정밀한 기술, 금속 가공, 디테일에 대한 집념, 경제적 성과',
    archetypalGift: '빈틈없는 시스템 설계와 탁월한 수익 모델 구축',
    shadowChallenge: '물질에 대한 탐욕과 과도한 계산주의, 완벽주의적 피로',
    realmActionRule: '기술적 완성도를 끝까지 벼리되, 적절한 시점에 제품을 시장에 내놓으세요.',
    rulingRune: 'Fehu (ᚠ - 물질적 번영과 가축의 풍요)',
  },
  {
    realmId: 7,
    nameEn: 'Muspelheim',
    nameKo: '무스펠헤임 (원초적 불꽃과 급진적 변혁)',
    planeLevel: '하층 근원계',
    coreEssence: '폭발적인 열정, 낡은 체제를 불태우는 급진적 혁신',
    archetypalGift: '파괴적 혁신을 통한 기존 관습의 과감한 타파',
    shadowChallenge: '충동적 파괴, 분노와 번아웃으로 인한 자기소모',
    realmActionRule: '가슴속 열정의 불꽃을 통제된 가마솥 안에서 제련하여 생산적 추진력으로 쓰세요.',
    rulingRune: 'Kenaz (ᚲ - 횃불의 불꽃과 기술적 연마)',
  },
  {
    realmId: 8,
    nameEn: 'Niflheim',
    nameKo: '니플헤임 (원초적 안개와 얼음의 침묵)',
    planeLevel: '하층 근원계',
    coreEssence: '절대적 침묵, 냉철한 객관성, 얼어붙은 잠재적 씨앗',
    archetypalGift: '어떤 혼란 속에서도 평정을 잃지 않는 냉철한 분석력',
    shadowChallenge: '감정의 냉각과 냉소주의, 타인과의 관계 단절',
    realmActionRule: '서두르지 말고 모든 데이터가 명확해질 때까지 차분히 관망하며 때를 기다리세요.',
    rulingRune: 'Isa (ᛁ - 얼음의 정지와 고요한 집중)',
  },
  {
    realmId: 9,
    nameEn: 'Helheim',
    nameKo: '헬헤임 (무의식의 안식처와 부활의 변환)',
    planeLevel: '하층 근원계',
    coreEssence: '수명이 다한 것들의 평화로운 수용, 환생적 해탈',
    archetypalGift: '과거에 대한 집착 없는 완전한 매듭과 새로운 시작',
    shadowChallenge: '무기력증과 허무주의, 우울감에 사로잡힌 방치',
    realmActionRule: '이미 끝난 지난 실패나 관계를 미련 없이 떠나보내고 백지에서 다시 시작하세요.',
    rulingRune: 'Hagalaz (ᚺ - 우박의 정화와 급격한 재편)',
  },
];

export function calculateNordicYggdrasilRealms(params: {
  profile?: any;
  question?: string;
  now?: Date;
}): YggdrasilRealmsReport {
  const now = params.now || new Date();
  const basic = params.profile?.basic;
  const birthdateStr = basic?.birthdate?.trim() || '1994-01-24';
  const question = params.question || '';

  let seed = 0;
  for (let i = 0; i < birthdateStr.length; i++) {
    seed += birthdateStr.charCodeAt(i) * (i + 19);
  }
  for (let i = 0; i < question.length; i++) {
    seed += question.charCodeAt(i) * 31;
  }
  seed += now.getDate() * 23 + now.getMonth() * 67;

  const dominantIndex = Math.abs(seed) % NINE_REALMS.length;
  const shadowIndex = (dominantIndex + 4 + (Math.abs(seed >> 3) % 2)) % NINE_REALMS.length;

  const dominantRealm = NINE_REALMS[dominantIndex];
  const shadowTensionRealm = NINE_REALMS[shadowIndex];

  const yggdrasilAxisAlignmentScore = 60 + (Math.abs(seed * 5) % 39);
  const bifrostBridgeClearance = 55 + (Math.abs(seed * 11) % 43);

  const runeAttunementKey = `${dominantRealm.rulingRune} ⇄ ${shadowTensionRealm.rulingRune}`;
  const masterCosmicPrescription = `현재 당신의 에너지는 [${dominantRealm.nameKo}]에 강하게 닻을 내리고 있습니다. '${dominantRealm.archetypalGift}'의 재능을 마음껏 발휘하되, 대척점 영역인 [${shadowTensionRealm.nameKo}]의 '${shadowTensionRealm.shadowChallenge}'을 경계하고 비프로스트 다리를 열어 균형을 회복하세요.`;

  return {
    engineVersion: NORDIC_YGGDRASIL_NINE_REALMS_ENGINE_VERSION,
    calculatedAt: now.toISOString(),
    dominantRealm,
    shadowTensionRealm,
    yggdrasilAxisAlignmentScore,
    bifrostBridgeClearance,
    runeAttunementKey,
    masterCosmicPrescription,
  };
}

export function formatNordicYggdrasilRealmsPrompt(report: YggdrasilRealmsReport): string {
  const d = report.dominantRealm;
  const s = report.shadowTensionRealm;
  return `### 🌳 고대 북유럽 세계수 위그드라실(Yggdrasil) 9대 영역 실측 데이터 (${report.engineVersion})
- **주도 영역 (Dominant Realm)**: ${d.nameKo} (${d.nameEn}, ${d.planeLevel})
  * 핵심 본질: ${d.coreEssence}
  * 원형적 축복: ${d.archetypalGift}
  * 행동 지침: ${d.realmActionRule}
  * 주관 룬: ${d.rulingRune}
- **그림자 긴장 영역 (Shadow Realm)**: ${s.nameKo} (${s.nameEn})
  * 주의할 그림자 도전: ${s.shadowChallenge}
- **세계수 중심축 정렬도**: ${report.yggdrasilAxisAlignmentScore}점 / 100점
- **비프로스트(Bifrost) 의식 다리 통과력**: ${report.bifrostBridgeClearance}점 / 100점
- **주요 룬 공명 조율 키**: ${report.runeAttunementKey}
- **마스터 세계수 지침**: ${report.masterCosmicPrescription}`;
}

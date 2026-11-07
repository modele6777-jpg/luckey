/**
 * 조선 다산 정약용(茶山 丁若鏞) 《목민심서》 여유당(與猶堂) 율기(律己)·애민(愛民) 실사구시 실학 지혜 엔진
 *
 * 18~19세기 조선 후기 실학(實學)의 집대성자 다산 정약용(1762~1836) 선생의 명저 《목민심서(牧民心書)》,
 * 《흠흠신서(欽欽新書)》, 《경세유표(經世遺表)》 및 당호 <여유당기(與猶堂記)> 원전 기반:
 * 1. 여유당(與猶堂) 신독(愼獨)의 미학: "겨울철에 살얼음 낀 내를 건너듯 조심하고(與兮若冬涉川), 사방의 이웃을 두려워하듯 삼간다(猶兮若畏四隣)."
 *    남이 보지 않는 곳에서도 양심을 속이지 않는 엄정한 자기 절제와 신중한 처신.
 * 2. 율기(律己)의 기본 덕목: 칙궁(飭躬: 몸가짐을 단정히 함), 청렴(淸廉: 사욕을 물리치고 결백을 지킴), 절용(節用: 재물을 아끼고 분수를 지킴).
 *    사욕에 흔들리지 않는 공명정대함이 지혜와 위엄의 원천임을 밝힘.
 * 3. 애민(愛民)과 공공선: 양로(養老), 자유(慈幼), 진휼(賑恤). 약자와 이웃을 향한 측은지심을 공허한 말에 그치지 않고 구체적 행동으로 구현하는 살아있는 자비.
 * 4. 실사구시(實事求是)와 이용후생: 공리공론과 헛된 명분을 배격하고, 오직 현장과 사실에서 진리를 구하여 인간의 실질적 삶을 윤택하게 하는 과학적 실용주의.
 * 5. 흠흠(欽欽) 생명 존중과 정밀한 검증: 한 사람의 억울함도 없도록 사실을 철저히 확인하고, 사람의 생명과 진실 앞에서 삼가고 또 삼가는 지극한 정성.
 *
 * @version LUCKEY-KOREAN-DASAN-MOKMIN-SIMSEO-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_DASAN_MOKMIN_SIMSEO_VERSION = 'LUCKEY-KOREAN-DASAN-MOKMIN-SIMSEO-v1.0.0';

export interface DasanTheme {
  themeKey: string;
  themeTitleHanja: string;
  themeTitleKo: string;
  silhakInsight: string;
  mokminCounsel: string;
}

export interface DasanAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismHanja: string;
  silhakDimension: string;
  practicalAction: string;
}

export interface DasanMokminSimseoResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 실학 지표 (0~100)
  yeoyudangPrudentDiscretionScore: number;    // 여유당(與猶堂) 살얼음 건너듯 삼가는 신중도(愼獨)
  yulgiIntegrousSelfDisciplineScore: number;  // 율기(律己: 칙궁·청렴·절용) 사욕 절제 및 공명정대성
  aeminCompassionatePublicGoodScore: number;  // 애민(愛民: 양로·자유·진휼) 따뜻한 공공선 실천도
  silsagusiPragmaticWisdomScore: number;      // 실사구시(實事求是) 허식 탈피 현실 문제해결력
  heumheumMeticulousTruthseekingScore: number;// 흠흠(欽欽) 생명 존중 및 철저한 사실 검증도
  // 세부 체계
  activeDasanTheme: DasanTheme;
  focalDasanAphorism: DasanAphorism;
  dasanPersonalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
}

export type DasanMokminSimseoReport = DasanMokminSimseoResult;

const DASAN_THEMES: DasanTheme[] = [
  {
    themeKey: 'YeoyudangSindok',
    themeTitleHanja: '與猶堂 愼獨敬愼',
    themeTitleKo: '여유당의 신독과 살얼음 건너는 신중함',
    silhakInsight: '남이 보지 않는 곳에서도 스스로를 삼가며, 겨울 강을 건너듯 조심할 때 어떤 화난도 침범하지 못한다.',
    mokminCounsel: '경거망동을 경계하고 매사를 신중하게 살피며, 홀로 있을 때의 마음가짐을 더욱 단정하고 결백하게 유지하십시오.',
  },
  {
    themeKey: 'YulgiCheongnyeom',
    themeTitleHanja: '律己 淸廉節用',
    themeTitleKo: '율기와 청렴의 큰 지혜',
    silhakInsight: '청렴은 선비의 본령이요 모든 덕의 근본이다. 사사로운 욕심을 비운 사람만이 참으로 굳세고 지혜롭다.',
    mokminCounsel: '작은 이익에 흔들려 신의를 저버리지 말고, 공명정대하고 투명한 원칙을 지켜 흔들리지 않는 신뢰를 얻으십시오.',
  },
  {
    themeKey: 'SilsagusiPracticality',
    themeTitleHanja: '實事求是 利用厚生',
    themeTitleKo: '실사구시와 현실을 살리는 실용의 지혜',
    silhakInsight: '실제에 바탕을 두지 않은 헛된 명분은 모래성에 불과하다. 현장을 살피고 쓸모를 따지는 것이 참된 앎이다.',
    mokminCounsel: '체면과 형식에 매달리지 말고, 현실에서 실제로 문제를 해결하고 사람을 이롭게 하는 구체적 방안을 추진하십시오.',
  },
  {
    themeKey: 'AeminJinhyul',
    themeTitleHanja: '愛民 慈幼賑恤',
    themeTitleKo: '애민의 온기와 따뜻한 측은지심',
    silhakInsight: '동료와 약자를 보살피는 따뜻한 정성이야말로 사람들의 마음을 모으고 화평을 이루는 근본 주춧돌이다.',
    mokminCounsel: '주변의 고단함을 먼저 살피고, 진심 어린 배려와 나눔을 베풀어 함께 상생하는 든든한 유대를 맺으십시오.',
  },
  {
    themeKey: 'HeumheumSincerity',
    themeTitleHanja: '欽欽 敬重事實',
    themeTitleKo: '흠흠의 정성과 철저한 사실 검증',
    silhakInsight: '한 사람의 억울함도 남기지 않도록 면밀히 살피며, 생명과 진실을 대할 때 삼가고 두려워하는 마음을 잃지 않는다.',
    mokminCounsel: '선입견이나 소문에 휘둘려 상대를 섣불리 단정하지 말고, 사실 관계를 끝까지 확인하여 공정하게 판단하십시오.',
  },
];

const DASAN_APHORISMS: DasanAphorism[] = [
  {
    aphorismKey: 'IntegrityGreatMerchant',
    aphorismKo: '청렴이란 천하의 가장 큰 장사이니, 크게 탐하는 자는 반드시 청렴해야 한다',
    aphorismHanja: '廉者 天下之大賈也 故大貪 必廉',
    silhakDimension: '청렴과 궁극적 명예',
    practicalAction: '눈앞의 푼돈이나 편법에 눈멀지 말고, 결백하고 정직하게 행동하여 평생의 명예와 신뢰를 지키십시오.',
  },
  {
    aphorismKey: 'WinterRiverCaution',
    aphorismKo: '겨울철에 내를 건너듯 조심하고, 사방의 이웃을 두려워하듯 삼가라',
    aphorismHanja: '與兮若冬涉川 猶兮若畏四隣',
    silhakDimension: '신독(愼獨)과 처신의 신중함',
    practicalAction: '말과 행동을 아끼며 경솔한 태도를 버리고, 위험 요소를 미리 살펴 지혜롭게 대비하십시오.',
  },
  {
    aphorismKey: 'GyeongseChiyong',
    aphorismKo: '학문이란 사람을 실제로 구제하고 삶을 이롭게 하는 데 쓰이지 않으면 헛된 것이다',
    aphorismHanja: '經世致用 實事求是',
    silhakDimension: '실용주의와 문제 해결',
    practicalAction: '탁상공론을 멈추고 현장의 목소리를 들어, 실질적으로 도움이 되는 실천적 성과를 만들어내십시오.',
  },
  {
    aphorismKey: 'NoOneAggrieved',
    aphorismKo: '한 사람의 억울한 눈물도 없게 하는 것이 인간의 지극한 도리다',
    aphorismHanja: '一人幽憤 夭閼天和',
    silhakDimension: '공정과 생명 존중',
    practicalAction: '약자의 입장을 헤아려 사소한 불공정도 바로잡고, 원한과 오해가 남지 않도록 명확하게 소통하십시오.',
  },
  {
    aphorismKey: 'DiligenceFrugalityAmulet',
    aphorismKo: '근면과 검소, 이 두 글자는 집안을 다스리고 몸을 보존하는 평생의 부적이다',
    aphorismHanja: '勤儉二字 居家守身之靈符',
    silhakDimension: '근면성실과 절용',
    practicalAction: '시간을 헛되이 보내지 말고 성실히 소임을 다하며, 불필요한 낭비를 줄여 삶의 든든한 기초를 다지십시오.',
  },
];

export function calculateDasanMokminSimseo(profile: UserProfile): DasanMokminSimseoResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    'KoreanDasanJeongYagyongMokminSimseo';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const yeoyudangPrudentDiscretionScore = 71 + (absHash % 28);
  const yulgiIntegrousSelfDisciplineScore = 69 + ((absHash >> 3) % 30);
  const aeminCompassionatePublicGoodScore = 68 + ((absHash >> 6) % 31);
  const silsagusiPragmaticWisdomScore = 70 + ((absHash >> 9) % 29);
  const heumheumMeticulousTruthseekingScore = 67 + ((absHash >> 12) % 32);

  const themeIndex = (absHash >> 4) % DASAN_THEMES.length;
  const aphorismIndex = (absHash >> 7) % DASAN_APHORISMS.length;

  const activeDasanTheme = DASAN_THEMES[themeIndex];
  const focalDasanAphorism = DASAN_APHORISMS[aphorismIndex];

  const counselTitle = `다산 정약용 목민 실학 철학: ${activeDasanTheme.themeTitleKo}`;
  const philosophicalGuidance = `다산 정약용 선생의 실학 정신은 여유당의 신독(愼獨)과 율기청렴의 자세로 사욕을 이기고 실사구시의 지혜를 펼치도록 이끕니다. ` +
    `현재 당신에게 필요한 실학적 덕목은 '${activeDasanTheme.themeTitleKo}'에 맞닿아 있습니다. ` +
    `${activeDasanTheme.mokminCounsel} 아울러 다산의 경구인 '${focalDasanAphorism.aphorismKo}'(${focalDasanAphorism.aphorismHanja})을 명심하여, ` +
    `${focalDasanAphorism.practicalAction}`;

  return {
    engineVersion: KOREAN_DASAN_MOKMIN_SIMSEO_VERSION,
    calculatedAtKst: new Date().toISOString(),
    yeoyudangPrudentDiscretionScore,
    yulgiIntegrousSelfDisciplineScore,
    aeminCompassionatePublicGoodScore,
    silsagusiPragmaticWisdomScore,
    heumheumMeticulousTruthseekingScore,
    activeDasanTheme,
    focalDasanAphorism,
    dasanPersonalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
  };
}

export function formatDasanMokminSimseoPrompt(res: DasanMokminSimseoResult): string {
  return [
    `【다산 정약용 목민심서(牧民心書) & 실사구시 실학 지표】`,
    `- 여유당 신독 신중도(愼獨): ${res.yeoyudangPrudentDiscretionScore}/100`,
    `- 율기 청렴도(律己 淸廉): ${res.yulgiIntegrousSelfDisciplineScore}/100`,
    `- 애민 공공선 실천도(愛民): ${res.aeminCompassionatePublicGoodScore}/100`,
    `- 실사구시 현실해결력(實事求是): ${res.silsagusiPragmaticWisdomScore}/100`,
    `- 흠흠 정밀 사실검증도(欽欽): ${res.heumheumMeticulousTruthseekingScore}/100`,
    `- 핵심 실학 테마: ${res.activeDasanTheme.themeTitleKo} [${res.activeDasanTheme.themeTitleHanja}]`,
    `- 실학적 통찰: ${res.activeDasanTheme.silhakInsight}`,
    `- 목민 처세 조언: ${res.activeDasanTheme.mokminCounsel}`,
    `- 핵심 아포리즘: "${res.focalDasanAphorism.aphorismKo}"`,
    `- 한자 원문: "${res.focalDasanAphorism.aphorismHanja}" [${res.focalDasanAphorism.silhakDimension}]`,
    `- 실천적 행동 지침: ${res.focalDasanAphorism.practicalAction}`,
    `- 통합 실학 처방: ${res.dasanPersonalCounsel.philosophicalGuidance}`,
  ].join('\n');
}

/**
 * 고대 그리스 알렉산드리아 헤르메스주의 36대 데칸(Decan) 천상 성령 & 시간의 지배자 엔진 (alexandrianDecanThirtySixGodsEngine.ts)
 *
 * 기원전 헬레니즘 알렉산드리아 점성술 및 《헤르메티카(Hermetica)》 제8권 원전 기반:
 * 360도 천상 황도대를 10도씩 분할하여 우주의 시간과 지상의 운명을 주재하는
 * 36대 데칸 성령(Decanoi / 36 Sacred Celestial Rulers of Time) 체계.
 *
 * 6대 핵심 신성 데칸 성령 원형:
 * 1. 소티스 (Sothis / 시리우스의 빛) - 나일강의 신성한 범람을 부르고 생명의 새해를 여는 여명의 주재자
 * 2. 크눔 (Khnum / 신성한 도예공) - 인간의 형상과 운명의 그릇을 정교하게 빚어내는 실질적 조형과 장인성
 * 3. 세크메트 (Sekhmet / 태양의 불꽃) - 모든 불의와 어둠의 에너지를 태워버리는 정화와 단호한 벽사의 권능
 * 4. 토트 (Thoth / 진리의 기록자) - 지혜의 서판을 쥐고 만물의 원리를 밝혀내는 통찰과 지적 분석력
 * 5. 아누비스 (Anubis / 경계의 인도자) - 갈림길과 전환점에서 두려움을 없애고 올바른 길로 이끄는 수호자
 * 6. 오시리스 (Osiris / 부활의 영원성) - 시련과 해체를 딛고 영원히 빛나는 영적 완성으로 이끄는 재생력
 */

import type { UserProfile } from '../sharedState';

export const ALEXANDRIAN_DECAN_ENGINE_VERSION = '1.0.0';

export interface DecanCelestialGod {
  id: string;
  nameGreek: string;
  nameKo: string;
  decanDegreeDomain: string; // 관할 황도대 도수 및 영역
  temporalRulership: string; // 시간의 지배 양상 (크로노스 vs 카이로스)
  celestialProtectionPower: string;
  soulVirtue: string;
  resonanceScore: number; // 0 ~ 100
}

export interface AlexandrianDecanThirtySixGodsReport {
  engineVersion: string;
  timestamp: string;
  kairosTimeMasteryScore: number; // 0 ~ 100 카이로스적 결정적 타이밍 지배도
  tenDaySoulTuningIndex: number; // 0 ~ 100 10일 주기 영혼 조율도
  astralShieldingRate: number; // 0 ~ 100 천체 흉살 및 외부 혼란 차폐율
  zodiacalEquilibriumScore: number; // 0 ~ 100 황도대 360도 균형도
  dominantDecan: DecanCelestialGod;
  secondaryDecan: DecanCelestialGod;
  alexandrianHermeticDecree: string; // 헤르메스주의 데칸 지혜 선언
  celestialDecanSealGuidance: string; // 데칸 신성 인장 수호 지침
}

const ALEXANDRIAN_DECANS_BASE: Omit<DecanCelestialGod, 'resonanceScore'>[] = [
  {
    id: 'sothis',
    nameGreek: 'Sothis (소티스)',
    nameKo: '여명과 생명의 시작 성령',
    decanDegreeDomain: '양자리/게자리 초입 (새로운 순환의 발원)',
    temporalRulership: '정체된 국면을 일순간에 깨뜨리고 비약적인 도약을 이끄는 카이로스의 순간',
    celestialProtectionPower: '어둠의 장막을 걷어내고 밝은 희망과 기회의 서광을 비춤',
    soulVirtue: '과거의 실패를 뒤로하고 새로운 시작을 두려움 없이 선언하십시오.',
  },
  {
    id: 'khnum',
    nameGreek: 'Khnum (크눔)',
    nameKo: '정교한 창조와 조형 성령',
    decanDegreeDomain: '황소자리/처녀자리 중심 (물질적 결실과 형태화)',
    temporalRulership: '모호한 아이디어를 현실 속의 구체적이고 단단한 결과물로 완성하는 시간',
    celestialProtectionPower: '흩어지는 에너지를 모아 낭비 없는 효율과 정밀한 성과를 보장함',
    soulVirtue: '요행을 바라지 말고 한 땀 한 땀 정성을 다해 결과물을 빚어내십시오.',
  },
  {
    id: 'sekhmet',
    nameGreek: 'Sekhmet (세크메트)',
    nameKo: '태양의 화염과 정의 성령',
    decanDegreeDomain: '사자자리/전갈자리 정점 (타협 없는 정화와 용기)',
    temporalRulership: '우유부단함을 끝내고 불필요한 인연과 미련을 단호히 잘라내는 결단의 시간',
    celestialProtectionPower: '모든 악의와 유혹을 불태워 소멸시키는 무적의 오라 형성',
    soulVirtue: '불의와 비겁함에 타협하지 말고 당당한 용기로 자신의 자리를 지키십시오.',
  },
  {
    id: 'thoth',
    nameGreek: 'Thoth (토트)',
    nameKo: '진리의 기록과 분석 지혜 성령',
    decanDegreeDomain: '쌍둥이자리/물병자리 영역 (지적 통찰과 전략적 소통)',
    temporalRulership: '복잡한 정보 속에서 핵심 진실을 꿰뚫고 올바른 판별을 내리는 시간',
    celestialProtectionPower: '오해와 왜곡을 걷어내고 진실된 소통과 계약의 승리를 수호함',
    soulVirtue: '직관과 데이터를 조화시켜 명확하고 논리적인 해법을 제시하십시오.',
  },
  {
    id: 'anubis',
    nameGreek: 'Anubis (아누비스)',
    nameKo: '경계의 문과 진실 인도 성령',
    decanDegreeDomain: '천칭자리/염소자리 전환점 (과도기의 안전과 공정한 칭량)',
    temporalRulership: '한 시대가 끝나고 다음 시대로 건너가는 관문에서 중심을 잃지 않는 지혜',
    celestialProtectionPower: '영혼의 무게를 저울질하여 결백한 자에게 안전한 통로를 열어줌',
    soulVirtue: '환경의 급변에 당황하지 말고 내면의 양심과 중심을 굳게 지키십시오.',
  },
  {
    id: 'osiris',
    nameGreek: 'Osiris (오시리스)',
    nameKo: '부활과 영원한 완성 성령',
    decanDegreeDomain: '물고기자리/전갈자리 심연 (해체 속의 영적 승화)',
    temporalRulership: '고난의 겨울을 지나 영원한 봄의 생명으로 다시 피어나는 불멸의 주기',
    celestialProtectionPower: '어떤 절망 속에서도 영혼의 존엄성을 보존하고 부활의 힘을 부여함',
    soulVirtue: '지금 겪는 고난을 더 높은 지혜를 얻기 위한 통과의례로 긍정하십시오.',
  },
];

export interface AlexandrianDecanThirtySixGodsOptions {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
  currentTime?: string;
}

export function calculateAlexandrianDecanThirtySixGods(
  optionsOrProfile?: AlexandrianDecanThirtySixGodsOptions | UserProfile | null,
  legacyContext?: { question?: string; currentTime?: string }
): AlexandrianDecanThirtySixGodsReport {
  let profile: UserProfile | null | undefined;
  let question = '';
  let now = new Date();

  if (optionsOrProfile && ('profile' in optionsOrProfile || 'question' in optionsOrProfile || 'now' in optionsOrProfile)) {
    const opts = optionsOrProfile as AlexandrianDecanThirtySixGodsOptions;
    profile = opts.profile;
    question = opts.question || '';
    now = opts.now || (opts.currentTime ? new Date(opts.currentTime) : new Date());
  } else {
    profile = optionsOrProfile as UserProfile | null | undefined;
    question = legacyContext?.question || '';
    now = legacyContext?.currentTime ? new Date(legacyContext.currentTime) : new Date();
  }

  const bdate = profile?.basic?.birthdate || (profile as unknown as { birthdate?: string; birthDate?: string })?.birthdate || (profile as unknown as { birthDate?: string })?.birthDate || '1994-01-24';
  const btime = profile?.basic?.birthtime || (profile as unknown as { birthtime?: string; birthTime?: string })?.birthtime || (profile as unknown as { birthTime?: string })?.birthTime || '12:00';

  let seed = 87121;
  for (let i = 0; i < bdate.length; i++) seed = (seed * 31 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 19 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 17 + question.charCodeAt(i)) % 1000003;
  seed = (seed + now.getUTCHours() * 39) % 1000003;

  const decans: DecanCelestialGod[] = ALEXANDRIAN_DECANS_BASE.map((dec, idx) => {
    const score = 48 + ((seed * (idx + 4) + idx * 31) % 51);
    return { ...dec, resonanceScore: Math.min(99, Math.max(40, score)) };
  });

  decans.sort((a, b) => b.resonanceScore - a.resonanceScore);
  const dominantDecan = decans[0];
  const secondaryDecan = decans[1];

  const kairosTimeMasteryScore = Math.min(100, Math.max(45, 54 + ((seed * 29) % 44)));
  const tenDaySoulTuningIndex = Math.min(100, Math.max(42, 53 + ((seed * 23) % 46)));
  const astralShieldingRate = Math.min(100, Math.max(46, 55 + ((seed * 17) % 43)));
  const zodiacalEquilibriumScore = Math.min(100, Math.max(44, Math.floor((kairosTimeMasteryScore * 0.5 + astralShieldingRate * 0.5))));

  const alexandrianHermeticDecree = `헤르메스주의 알렉산드리아 점성술은 전합니다: "36대 데칸 성령은 하늘의 시간을 지배하며 지상의 운명을 수호한다." 지금 당신의 시간대를 관장하는 주 수호 성령은 [${dominantDecan.nameGreek} - ${dominantDecan.nameKo}]입니다. ${dominantDecan.soulVirtue}`;
  const celestialDecanSealGuidance = `시간의 지배자 데칸의 신성 인장: ${dominantDecan.temporalRulership}. 외부의 잡음에 휘둘리지 마십시오. ${dominantDecan.celestialProtectionPower}의 오라가 당신을 감싸고 있습니다.`;

  return {
    engineVersion: ALEXANDRIAN_DECAN_ENGINE_VERSION,
    timestamp: now.toISOString(),
    kairosTimeMasteryScore,
    tenDaySoulTuningIndex,
    astralShieldingRate,
    zodiacalEquilibriumScore,
    dominantDecan,
    secondaryDecan,
    alexandrianHermeticDecree,
    celestialDecanSealGuidance,
  };
}

export function formatAlexandrianDecanThirtySixGodsPrompt(rep: AlexandrianDecanThirtySixGodsReport): string {
  return `[알렉산드리아 헤르메스주의 36대 데칸 천상 성령 & 시간의 지배자 실측 데이터]
· 엔진 버전: v${rep.engineVersion}
· 카이로스적 시간 지배도: ${rep.kairosTimeMasteryScore}/100 | 10일 주기 영혼 조율도: ${rep.tenDaySoulTuningIndex}/100
· 아스트랄 차폐율: ${rep.astralShieldingRate}/100 | 황도대 360도 균형도: ${rep.zodiacalEquilibriumScore}/100
· 주재 데칸 성령: [${rep.dominantDecan.nameGreek} (${rep.dominantDecan.nameKo})] — 공명도 ${rep.dominantDecan.resonanceScore}%
  - 관할 도수: ${rep.dominantDecan.decanDegreeDomain}
  - 시간 지배 양상: ${rep.dominantDecan.temporalRulership}
  - 천상 보호력: ${rep.dominantDecan.celestialProtectionPower}
  - 영혼 덕목: ${rep.dominantDecan.soulVirtue}
· 보조 데칸 성령: [${rep.secondaryDecan.nameGreek} (${rep.secondaryDecan.nameKo})] — 공명도 ${rep.secondaryDecan.resonanceScore}%
· 알렉산드리아 헤르메스주의 선언: ${rep.alexandrianHermeticDecree}
· 데칸 신성 인장 수호 지침: ${rep.celestialDecanSealGuidance}`;
}

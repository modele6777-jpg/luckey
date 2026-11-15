/**
 * 고대 일본 슈겐도(修驗道) 야마부시 10계수행 & 6근청정 산악영력 엔진 (shugendoYamabushiTenRealmsEngine.ts)
 *
 * 신불습합(神佛習合) 밀교 산악 수행 슈겐도(修驗道) 및 엔노 교자(役小角) 원전 전승 기반:
 * 산악 입봉(入峰) 수행을 통한 '의사재생(擬死再生 - 상징적 죽음과 영적 재탄생)',
 * 안·이·비·설·신·의를 씻어내는 '6근청정(六根淸淨)',
 * 그리고 지옥계에서 불계에 이르는 '10계(十界) 참회'를 통해 번뇌의 몸 그대로 즉신성불(卽身成佛)을 증득하는 산악 비전.
 *
 * 10계(十界):
 * 1. 지옥계(地獄界) - 업화의 고통 직시 및 인내
 * 2. 아귀계(餓鬼界) - 결핍과 탐욕의 갈증 소멸
 * 3. 축생계(畜生界) - 무지와 본능의 지혜 전환
 * 4. 아수라계(修羅界) - 분노와 투쟁심의 의협심 승화
 * 5. 인간계(人間界) - 오계 실천과 일상성 자각
 * 6. 천상계(天上界) - 도취와 자만의 경계
 * 7. 성문계(聲聞界) - 스승의 가르침 경청과 사제 탐구
 * 8. 연각계(緣覺界) - 12인연 독각과 자연 조화
 * 9. 보살계(菩薩界) - 자비행과 이타적 서원
 * 10. 불계(佛界) - 진여 본성 각성과 대자유
 */

import type { UserProfile } from '../sharedState';

export const SHUGENDO_YAMABUSHI_TEN_REALMS_ENGINE_VERSION = '2.0.0';

export interface TenRealmStage {
  id: string;
  nameKo: string;
  kanji: string;
  spiritualDomain: string;
  transmutationTask: string;
  purificationScore: number; // 0 ~ 100 정화 및 통과도
}

export interface ShugendoYamabushiTenRealmsReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  symbolicRebirthScore: number; // 0 ~ 100 의사재생(擬死再生) 통과도
  sixRootsPurificationScore: number; // 0 ~ 100 6근청정(六根淸淨) 정화도
  kujiKiriWardDefenseScore: number; // 0 ~ 100 구지신인(九字神印: 臨兵鬪者皆陣烈在前) 결계력
  currentInitiationRealm: TenRealmStage; // 현재 영혼이 통과 중인 주재 계위
  highestAwakenedRealm: TenRealmStage; // 가장 높이 개화된 영적 계위
  yamabushiAsceticPointers: string; // 야마부시 산악 지혜 요결
  waterfallTakiGyoRitual: string; // 타키교(폭포 수마) 심신 정화 처방
  shugendoSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatShugendoKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

const TEN_REALMS_BASE: Omit<TenRealmStage, 'purificationScore'>[] = [
  {
    id: 'hell',
    nameKo: '지옥계',
    kanji: '地獄界',
    spiritualDomain: '가장 깊은 두려움과 원초적 카르마의 정화',
    transmutationTask: '과거의 후회와 죄책감을 불꽃 속에서 태워내기',
  },
  {
    id: 'hungry_ghost',
    nameKo: '아귀계',
    kanji: '餓鬼界',
    spiritualDomain: '만성적 결핍감과 채워지지 않는 탐욕의 종식',
    transmutationTask: '외적 대상에 의존하던 갈망을 자족의 풍요로 전환',
  },
  {
    id: 'animal',
    nameKo: '축생계',
    kanji: '畜生界',
    spiritualDomain: '맹목적 본능과 무의식적 타성의 극복',
    transmutationTask: '즉각적 쾌락에 끌려가던 반응을 의식적 선택으로 승화',
  },
  {
    id: 'asura',
    nameKo: '아수라계',
    kanji: '修羅界',
    spiritualDomain: '경쟁심, 질투, 분노의 에너지를 정의로운 용기로 전환',
    transmutationTask: '타인과의 비교를 멈추고 내면의 악습과 싸우는 투사되기',
  },
  {
    id: 'human',
    nameKo: '인간계',
    kanji: '人間界',
    spiritualDomain: '일상의 책무 완수와 도덕적 중심 잡기',
    transmutationTask: '생활 속에서 중도를 지키며 평정심 유지하기',
  },
  {
    id: 'heaven',
    nameKo: '천상계',
    kanji: '天上界',
    spiritualDomain: '일시적 성공과 환희에 취하는 자만의 경계',
    transmutationTask: '기쁨을 누리되 집착하지 않고 겸손을 새기기',
  },
  {
    id: 'sravaka',
    nameKo: '성문계',
    kanji: '聲聞界',
    spiritualDomain: '지혜로운 자의 언어 경청과 학습을 통한 개안',
    transmutationTask: '스스로의 오만을 내려놓고 진리의 소리를 받아들이기',
  },
  {
    id: 'pratyeka',
    nameKo: '연각계',
    kanji: '緣覺界',
    spiritualDomain: '자연의 변화와 계절의 생멸에서 인연법 자각',
    transmutationTask: '홀로 고요히 침묵 속에서 사물의 본질을 꿰뚫기',
  },
  {
    id: 'bodhisattva',
    nameKo: '보살계',
    kanji: '菩薩界',
    spiritualDomain: '뭇 생명을 향한 차별 없는 자비와 이타행',
    transmutationTask: '타인의 고통을 나의 아픔으로 느끼며 기꺼이 돕기',
  },
  {
    id: 'buddha',
    nameKo: '불계',
    kanji: '佛界',
    spiritualDomain: '본래 청정한 불성의 증득과 무애자재',
    transmutationTask: '번뇌 즉 보리(煩惱卽菩提), 삶 자체를 성스러운 도량으로 삼기',
  },
];

export interface ShugendoYamabushiTenRealmsOptions {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
  currentTime?: string;
}

export function calculateShugendoYamabushiTenRealms(
  optionsOrProfile?: ShugendoYamabushiTenRealmsOptions | UserProfile | null,
  legacyContext?: { question?: string; currentTime?: string }
): ShugendoYamabushiTenRealmsReport {
  let profile: UserProfile | null | undefined;
  let question = '';
  let now = new Date();

  if (optionsOrProfile && ('profile' in optionsOrProfile || 'question' in optionsOrProfile || 'now' in optionsOrProfile)) {
    const opts = optionsOrProfile as ShugendoYamabushiTenRealmsOptions;
    profile = opts.profile;
    question = opts.question || '';
    now = opts.now || (opts.currentTime ? new Date(opts.currentTime) : new Date());
  } else {
    profile = optionsOrProfile as UserProfile | null | undefined;
    question = legacyContext?.question || '';
    now = legacyContext?.currentTime ? new Date(legacyContext.currentTime) : new Date();
  }

  const bdate = profile?.basic?.birthdate || (profile as unknown as { birthDate?: string })?.birthDate || '1994-01-24';
  const btime = profile?.basic?.birthtime || (profile as unknown as { birthTime?: string })?.birthTime || '12:00';

  let seed = 78941;
  for (let i = 0; i < bdate.length; i++) seed = (seed * 31 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 19 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 17 + question.charCodeAt(i)) % 1000003;
  seed = (seed + now.getUTCHours() * 29) % 1000003;

  const realms: TenRealmStage[] = TEN_REALMS_BASE.map((realm, idx) => {
    const score = 40 + ((seed * (idx + 7) + idx * 23) % 58);
    return { ...realm, purificationScore: Math.min(99, Math.max(30, score)) };
  });

  // 점수가 가장 낮은 계위가 현재 영혼이 정면 돌파해야 할 관문(Initiation)
  const sortedByPurification = [...realms].sort((a, b) => a.purificationScore - b.purificationScore);
  const currentInitiationRealm = sortedByPurification[0];

  // 점수가 가장 높은 계위가 현재 영적 버팀목이 되는 개화된 영역
  const highestAwakenedRealm = sortedByPurification[sortedByPurification.length - 1];

  const symbolicRebirthScore = Math.min(100, Math.max(40, 52 + ((seed * 13) % 46)));
  const sixRootsPurificationScore = Math.min(100, Math.max(38, 48 + ((seed * 37) % 50)));
  const kujiKiriWardDefenseScore = Math.min(100, Math.max(45, 55 + ((seed * 41) % 43)));

  const yamabushiAsceticPointers = `오미네산의 험준한 절벽을 오르듯, 현재 당신의 영혼은 [${currentInitiationRealm.nameKo}(${currentInitiationRealm.kanji})]의 시련을 통과하고 있습니다. ${currentInitiationRealm.transmutationTask}에 집중할 때 비로소 [${highestAwakenedRealm.nameKo}]의 본래 힘이 발현됩니다.`;
  const waterfallTakiGyoRitual = `찬 물로 세수를 하거나 샤워 시 30초간 냉수를 쐬며 "육근청정(六根淸淨), 구지신인 임·병·투·자·개·진·열·재·전(臨兵鬪者皆陣烈在前)"을 마음속으로 외쳐 사기(邪氣)를 물리치고 중심을 세우십시오.`;

  const calculatedAtKst = formatShugendoKstTimestamp(now);
  const shugendoSynthesisMatrix = {
    dominantTension: `${currentInitiationRealm.nameKo}(${currentInitiationRealm.kanji}) ↔ ${highestAwakenedRealm.nameKo}(${highestAwakenedRealm.kanji})`,
    alignmentState: `${currentInitiationRealm.spiritualDomain}`,
    integratedAction: `${currentInitiationRealm.transmutationTask} · ${waterfallTakiGyoRitual}`,
  };

  return {
    engineVersion: SHUGENDO_YAMABUSHI_TEN_REALMS_ENGINE_VERSION,
    timestamp: now.toISOString(),
    calculatedAtKst,
    symbolicRebirthScore,
    sixRootsPurificationScore,
    kujiKiriWardDefenseScore,
    currentInitiationRealm,
    highestAwakenedRealm,
    yamabushiAsceticPointers,
    waterfallTakiGyoRitual,
    shugendoSynthesisMatrix,
  };
}

export function formatShugendoYamabushiTenRealmsPrompt(rep: ShugendoYamabushiTenRealmsReport): string {
  const lines = [
    `[고대 일본 슈겐도(修驗道) 야마부시 10계수행 & 6근청정 실측 데이터]`,
    `· 연산 시각: ${rep.calculatedAtKst} | 엔진 버전: v${rep.engineVersion}`,
    `· 현재 당면 통과의례 계위: [${rep.currentInitiationRealm.nameKo} (${rep.currentInitiationRealm.kanji})]`,
    `  - 영적 영역: ${rep.currentInitiationRealm.spiritualDomain}`,
    `  - 전환 과제: ${rep.currentInitiationRealm.transmutationTask}`,
    `· 최고 개화 영적 계위: [${rep.highestAwakenedRealm.nameKo} (${rep.highestAwakenedRealm.kanji})]`,
    `· 야마부시 산악 지혜 요결: ${rep.yamabushiAsceticPointers}`,
    `· 폭포 수마(타키교) 심신 정화 리추얼: ${rep.waterfallTakiGyoRitual}`,
  ];
  if (rep.shugendoSynthesisMatrix) {
    lines.push(
      `· 교차 매트릭스 [핵심 긴장: ${rep.shugendoSynthesisMatrix.dominantTension} | 조율 상태: ${rep.shugendoSynthesisMatrix.alignmentState}]`,
      `· 통합 실천: ${rep.shugendoSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}

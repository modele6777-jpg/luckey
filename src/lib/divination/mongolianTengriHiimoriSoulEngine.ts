/**
 * 몽골 텡그리즘 99 텡그리 & 히모리 풍마 영혼 공명 엔진 (mongolianTengriHiimoriSoulEngine.ts)
 *
 * 고대 유라시아 대초원과 몽골 전통 텡그리즘(Tengrism) 원전 기반:
 * 영원한 푸른 하늘 텡그리(Köke Möngke Tengri)와 대지모신 에투겐(Etügen Eke)의 거룩한 조화 아래,
 * 인간의 내면에 깃든 3대 영혼(쉴드·아미·쉰스)과 바람의 말 히모리(Hiimori / 风马)의 영적 기운을 진단하는 대초원 신성 엔진.
 *
 * 3대 영혼(Threefold Soul - Süld, Ami, Süns):
 * 1. 쉴드 (Süld): 뼈와 혈통에 머무는 불멸의 영성, 전사의 기개와 가문의 영원한 수호령 (Immortal Spirit & Lineage Power)
 * 2. 아미 (Ami): 호흡과 심장박동으로 신체를 움직이는 생명력의 숨결 (Breath of Vital Life)
 * 3. 쉰스 (Süns): 사후 천상으로 비상하거나 대지로 순환하는 의식의 영혼 (Reincarnating Consciousness Soul)
 *
 * 히모리 (Hiimori / Wind Horse):
 * 바람을 타고 펄럭이는 오색 깃발처럼 천상과 소통하는 내면의 영적 운세와 기백.
 * 히모리가 높을수록 장애물이 바람 앞의 티끌처럼 사라지고 천상의 가호가 쏟아짐.
 *
 * 99 텡그리 (Ninety-Nine Tngri):
 * - 서방 55 선신 텡그리 (자애·평화·치유·가족 수호)
 * - 동방 44 용맹 텡그리 (정의·천둥·용기·삿된 기운 격퇴)
 */

import type { UserProfile } from '../sharedState';

export const MONGOLIAN_TENGRI_HIIMORI_ENGINE_VERSION = '2.3.0';

export interface TengriSpiritualAspect {
  id: string;
  nameKo: string;
  mongolianTerm: string;
  tengriDomain: string;
  heavenlyPower: string;
  spiritualBlessing: string;
  resonanceScore: number; // 0 ~ 100
}

export interface MongolianTengriHiimoriReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  hiimoriWindHorseVitalityScore: number; // 0 ~ 100 히모리 풍마 영적 기운과 운세 지수
  tengriBlueSkyResonanceIndex: number; // 0 ~ 100 영원한 푸른 하늘 텡그리 가호 공명도
  suldImmortalSpiritPower: number; // 0 ~ 100 쉴드 불멸의 기개와 중심력
  etugenMotherEarthRooting: number; // 0 ~ 100 에투겐 대지모신 그라운딩 안정도
  dominantAspect: TengriSpiritualAspect; // 주재하는 텡그리즘 영적 양상
  secondaryAspect: TengriSpiritualAspect; // 보조 교차 텡그리즘 영적 양상
  guardianTngriDomain: string; // 99 텡그리 수호 진영
  tengriGuidance: string; // 텡그리즘 지혜 지침
  hiimoriFlagRaisingRitual: string; // 히모리 풍마 깃발 게양 리추얼
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  tengriSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatTengriKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function describeTengriStage(score: number): string {
  if (score >= 84) return '히모리 비상(Hiimori Soar) — 푸른 하늘 텡그리의 바람과 쉴드의 기개가 한 줄기로 뻗어 오르는 상승기';
  if (score >= 70) return '에투겐 정착(Etügen Grounding) — 대지의 중심에 발을 딛고 기운을 고르게 다지는 안정기';
  return '갈 골롬트 온기(Gal Golomt Tend) — 화로의 불씨를 지키며 내면의 숨을 고르는 회복기';
}

const TENGRI_ASPECTS_BASE: Omit<TengriSpiritualAspect, 'resonanceScore'>[] = [
  {
    id: 'koke_mongke_tengri',
    nameKo: '쾨케 믕케 텡그리 (영원한 푸른 하늘의 가호)',
    mongolianTerm: 'Köke Möngke Tengri (Хөх Мөнх Тэнгэр)',
    tengriDomain: '천상의 최고 주권과 우주적 정의',
    heavenlyPower: '탁 트인 끝없는 하늘처럼 모든 제약을 뛰어넘어 영혼을 넓히는 무한한 포용력',
    spiritualBlessing: '외적 시련에 위축되지 않고 대초원의 지평선처럼 원대한 비전을 품고 도약함',
  },
  {
    id: 'etugen_eke',
    nameKo: '에투겐 에케 (자비로운 대지모신의 품)',
    mongolianTerm: 'Etügen Eke (Этүгэн Эх)',
    tengriDomain: '비옥한 대지의 양육과 현실적 번영',
    heavenlyPower: '흔들리지 않는 대지처럼 현실의 기반을 단단히 다지고 풍요로운 결실을 맺음',
    spiritualBlessing: '육체적 건강과 경제적 안정, 그리고 마음의 평온을 든든하게 받쳐주는 그라운딩',
  },
  {
    id: 'hiimori_choyjin',
    nameKo: '차강 히모리 (비상하는 백마의 풍마 기운)',
    mongolianTerm: 'Chagaan Hiimori (Цагаан Хийморь)',
    tengriDomain: '영적 활력과 운세의 최상승',
    heavenlyPower: '바람을 가르는 천마처럼 모든 막힘과 삿된 장애를 일순간에 돌파하는 승리의 기백',
    spiritualBlessing: '하는 일마다 귀인을 만나고 불운이 행운으로 반전되는 강력한 영적 운세 견인',
  },
  {
    id: 'suld_tenger',
    nameKo: '쉴드 텡게르 (불멸의 전사혼과 기개)',
    mongolianTerm: 'Süld Tenger (Сүлд Тэнгэр)',
    tengriDomain: '불굴의 의지와 내면의 당당한 존엄',
    heavenlyPower: '어떤 불의나 위협 앞에서도 고개를 숙이지 않는 당당한 내적 주권과 정직함',
    spiritualBlessing: '자신의 본질적 가치와 신념을 굳건히 지키며 존경과 신뢰를 이끌어냄',
  },
  {
    id: 'gal_golomt',
    nameKo: '갈 골롬트 (신성한 화로의 영원한 불꽃)',
    mongolianTerm: 'Gal Golomt (Гал Голомт)',
    tengriDomain: '가문의 화합과 정화의 성스러운 불길',
    heavenlyPower: '가슴속 순수한 열정을 유지하고 주변 사람들에게 따스한 온기와 영감을 불어넣음',
    spiritualBlessing: '차갑게 식어버린 관계와 의욕을 다시 타오르게 하는 활기찬 회복과 온정',
  },
];

export interface MongolianTengriHiimoriOptions {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
  currentTime?: string;
}

export function calculateMongolianTengriHiimori(
  optionsOrProfile?: MongolianTengriHiimoriOptions | UserProfile | null,
  legacyContext?: { question?: string; currentTime?: string }
): MongolianTengriHiimoriReport {
  let profile: UserProfile | null | undefined;
  let question = '';
  let now = new Date();

  if (optionsOrProfile && ('profile' in optionsOrProfile || 'question' in optionsOrProfile || 'now' in optionsOrProfile)) {
    const opts = optionsOrProfile as MongolianTengriHiimoriOptions;
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

  let seed = 995544;
  for (let i = 0; i < bdate.length; i++) seed = (seed * 31 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 19 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 17 + question.charCodeAt(i)) % 1000003;
  seed = (seed + now.getUTCHours() * 31) % 1000003;

  const aspects: TengriSpiritualAspect[] = TENGRI_ASPECTS_BASE.map((asp, idx) => {
    const score = 49 + ((seed * (idx + 5) + idx * 33) % 50);
    return { ...asp, resonanceScore: Math.min(99, Math.max(41, score)) };
  });

  aspects.sort((a, b) => b.resonanceScore - a.resonanceScore);
  const dominantAspect = aspects[0];
  const secondaryAspect = aspects[1];

  const hiimoriWindHorseVitalityScore = Math.min(100, Math.max(45, 55 + ((seed * 27) % 43)));
  const tengriBlueSkyResonanceIndex = Math.min(100, Math.max(42, 53 + ((seed * 21) % 45)));
  const suldImmortalSpiritPower = Math.min(100, Math.max(44, 52 + ((seed * 19) % 46)));
  const etugenMotherEarthRooting = Math.min(100, Math.max(46, Math.floor((hiimoriWindHorseVitalityScore * 0.5 + tengriBlueSkyResonanceIndex * 0.5))));

  const guardianTngriDomain = (seed % 2 === 0)
    ? '서방 55 선신 텡그리 (자애·평화·생명 치유의 천상 가호)'
    : '동방 44 용맹 텡그리 (정의·천둥·삿된 액운 격퇴의 전사 가호)';

  const tengriGuidance = `대초원의 텡그리즘은 선언합니다: "푸른 하늘(Tengri) 아래 두려워할 것은 아무것도 없다. 너의 바람의 말(Hiimori)이 높이 날아오를 때, 온 우주가 너의 길을 연다." 현재 당신을 이끄는 천상의 양상은 [${dominantAspect.nameKo}]입니다. ${dominantAspect.spiritualBlessing}. 쉴드(Süld)의 기개를 바로 세우고 가슴을 활짝 펴십시오.`;
  const hiimoriFlagRaisingRitual = `높은 언덕이나 창밖 푸른 하늘을 우러르며 양팔을 가볍게 들고 호흡하십시오: "믕케 텡그리인 후츤 도르(Möngke Tengri-yin Küchün-dür - 영원한 하늘의 힘 아래)! 내 안의 풍마 히모리가 세찬 바람을 타고 승리의 깃발을 휘날린다."`;
  const ritualAction = hiimoriFlagRaisingRitual;
  const reflectionFocus = `몽골 텡그리즘(${dominantAspect.nameKo}) · ${guardianTngriDomain} — 쉴드(Süld)의 기개와 히모리 풍마 상승`;

  const calculatedAtKst = formatTengriKstTimestamp(now);
  const trimmedQuery = question?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `푸른 하늘 텡그리의 '${dominantAspect.nameKo}'와 보조 흐름 '${secondaryAspect.nameKo}'를 비추어 볼 때, "${trimmedQuery}"에서 히모리(바람의 말)를 다시 일으키기 위해 놓아야 할 두려움은 무엇인가요?`
    : `지금 '${dominantAspect.nameKo}'의 기백과 '${secondaryAspect.nameKo}'의 온기를 함께 살려 쉴드(Süld)의 중심을 세우려면 무엇을 먼저 선택해야 할까요?`;
  const interpretiveBoundary = '이 지표는 몽골 텡그리즘(Tengrism)의 영원한 푸른 하늘·에투겐 대지모신·3대 영혼(쉴드·아미·쉰스)·히모리 풍마 사상을 기백과 내면 중심 성찰의 거울로 해석한 것이며, 구체적 사건의 성패를 단정하는 예언이 아닙니다.';
  const composite = Math.round(
    (hiimoriWindHorseVitalityScore + tengriBlueSkyResonanceIndex + suldImmortalSpiritPower + etugenMotherEarthRooting) / 4
  );
  const tengriSynthesisMatrix = {
    dominantTension: `${dominantAspect.nameKo} ↔ ${guardianTngriDomain}`,
    alignmentState: describeTengriStage(composite),
    integratedAction: `${dominantAspect.spiritualBlessing}${question ? ` [질문 맥락: ${question}]` : ''}`,
  };

  return {
    engineVersion: MONGOLIAN_TENGRI_HIIMORI_ENGINE_VERSION,
    timestamp: now.toISOString(),
    calculatedAtKst,
    hiimoriWindHorseVitalityScore,
    tengriBlueSkyResonanceIndex,
    suldImmortalSpiritPower,
    etugenMotherEarthRooting,
    dominantAspect,
    secondaryAspect,
    guardianTngriDomain,
    tengriGuidance,
    hiimoriFlagRaisingRitual,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary,
    tengriSynthesisMatrix,
  };
}

export function formatMongolianTengriHiimoriPrompt(report: MongolianTengriHiimoriReport): string {
  const composite = Math.round(
    (report.hiimoriWindHorseVitalityScore + report.tengriBlueSkyResonanceIndex + report.suldImmortalSpiritPower + report.etugenMotherEarthRooting) / 4
  );
  const lines = [
    `### 🐎 몽골 텡그리즘 99 텡그리 & 히모리 풍마 영혼 공명 실측 데이터 (v${report.engineVersion})`,
    `- **연산 시각**: ${report.calculatedAtKst} | **풍마 공명 국면**: ${describeTengriStage(composite)}`,
    `- **주재 천상 영적 양상**: ${report.dominantAspect.nameKo} (${report.dominantAspect.mongolianTerm})`,
    `- **보조 교차 영적 양상**: ${report.secondaryAspect.nameKo} (${report.secondaryAspect.mongolianTerm})`,
    `- **텡그리즘 관할 영역**: ${report.dominantAspect.tengriDomain}`,
    `- **천상적 권능**: ${report.dominantAspect.heavenlyPower}`,
    `- **영적 축복과 가호**: ${report.dominantAspect.spiritualBlessing}`,
    `- **99 텡그리 수호 진영**: ${report.guardianTngriDomain}`,
    `- **텡그리즘 지혜 지침**: ${report.tengriGuidance}`,
    `- **히모리 풍마 게양 리추얼**: ${report.hiimoriFlagRaisingRitual}`,
    `- **실천 의례**: ${report.ritualAction}`,
    `- **성찰 초점**: ${report.reflectionFocus}`,
    `- **성찰 질문**: ${report.reflectiveQuestion}`,
    `- **해석 경계**: ${report.interpretiveBoundary}`,
  ];
  if (report.tengriSynthesisMatrix) {
    lines.push(
      `- **교차 매트릭스**: [핵심 긴장: ${report.tengriSynthesisMatrix.dominantTension} | 조율 상태: ${report.tengriSynthesisMatrix.alignmentState}]`,
      `- **통합 실천**: ${report.tengriSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}

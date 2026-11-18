/**
 * 고대 북유럽 볼바(Völva) 세이드(Seiðr) 직관 & 위그드라실 9대 세계 예언 엔진 (norseVolvaSeidrNineRealmsEngine.ts)
 *
 * 고대 노르드 원전 《고 에다(Poetic Edda)》의 《볼루스파(Völuspá - 무녀의 예언)》 전승 기반:
 * 지혜로운 여성 예언자 볼바(Völva)가 물레와 지팡이를 돌려 시간과 공간의 운명실(Wyrd)을 읽어내는 세이드(Seiðr) 비전.
 * 세계수 위그드라실(Yggdrasil)에 얽힌 9대 영역의 원초적 에너지를 관조하고,
 * 오딘의 두 까마귀 후긴(Huginn - 직관적 사고)과 무닌(Muninn - 영혼의 기억)의 균형을 복원하여
 * 라그나로크(혼돈과 위기) 속에서도 새로운 황금의 시대 김레(Gimlé)를 여는 북유럽 예언 엔진.
 *
 * 위그드라실 9대 영역(Nine Realms of Yggdrasil):
 * 1. 아스가르드 (Asgard) - 신성한 이상과 거룩한 목적의식
 * 2. 바나하임 (Vanaheim) - 대지 마법과 풍요로운 자연 생명력
 * 3. 알프하임 (Alfheim) - 순수한 빛, 예술적 영감과 밝은 지성
 * 4. 미드가르드 (Midgard) - 현실적 인간계와 구체적 행동의 무대
 * 5. 요툰하임 (Jotunheim) - 거친 원초적 무의식과 거인들의 카오스
 * 6. 스바르트알프하임 (Svartalfheim) - 연금술적 기술과 정교한 장인정신
 * 7. 니플하임 (Niflheim) - 원초적 서리와 침묵, 정지의 정화력
 * 8. 무스펠하임 (Muspelheim) - 타오르는 원초적 열정과 돌파의 불꽃
 * 9. 헬헤임 (Helheim) - 과거의 완전한 종결과 그림자의 고요한 수용
 */

import type { UserProfile } from '../sharedState';

export const NORSE_VOLVA_SEIDR_NINE_REALMS_ENGINE_VERSION = '2.3.0';

export interface YggdrasilRealm {
  id: string;
  nameKo: string;
  norseName: string;
  domain: string;
  propheticGift: string;
  resonanceScore: number; // 0 ~ 100 공명도
}

export interface NorseVolvaSeidrNineRealmsReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  seidrIntuitionClarity: number; // 0 ~ 100 세이드 직관 명료도
  huginnThoughtScore: number; // 0 ~ 100 후긴(사고/미래 예측) 지수
  muninMemoryScore: number; // 0 ~ 100 무닌(기억/과거 성찰) 지수
  yggdrasilSapShieldPower: number; // 0 ~ 100 위그드라실 수액 결계 방어력
  wyrdFateWeavingResonance: number; // 0 ~ 100 운명의 거미줄(Wyrd) 조율도
  dominantRealm: YggdrasilRealm; // 가장 강력히 공명하는 주재 영역
  secondaryRealm: YggdrasilRealm; // 보조 가이드 영역
  volvaPropheticVision: string; // 볼바의 예언적 통찰
  seidrSpindleGroundingRitual: string; // 세이드 물레 접지 리추얼
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  volvaSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  interpretiveBoundary: string;
}

function formatVolvaKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function describeVolvaStage(score: number): string {
  if (score >= 84) return '김레 여명(Gimlé Dawn) — 후긴의 직관과 무닌의 성찰이 위그드라실 수액 위에서 맑게 통합되는 명징기';
  if (score >= 70) return '세이드 물레 조율(Seiðr Weave) — 운명의 실타래를 차분히 펴며 주재 영역의 힘을 다지는 안정기';
  return '니플헤임 관조(Niflheim Stillness) — 바깥 소음을 끄고 물레의 중심을 다시 잡는 회복기';
}

const YGGDRASIL_REALMS_BASE: Omit<YggdrasilRealm, 'resonanceScore'>[] = [
  {
    id: 'asgard',
    nameKo: '아스가르드',
    norseName: 'Ásgarðr',
    domain: '신성한 이상과 거룩한 소명',
    propheticGift: '눈앞의 이익을 넘어 영혼의 숭고한 사명을 뚜렷이 세우는 안목',
  },
  {
    id: 'vanaheim',
    nameKo: '바나하임',
    norseName: 'Vanaheimr',
    domain: '대지 마법과 풍요로운 자연 생명력',
    propheticGift: '순환의 법칙을 믿고 결핍의 불안 없이 때를 기다려 결실을 맺는 힘',
  },
  {
    id: 'alfheim',
    nameKo: '알프하임',
    norseName: 'Álfheimr',
    domain: '순수한 빛과 예술적 영감',
    propheticGift: '어둠의 잡념을 정화하고 우아하고 지혜로운 영감을 길어 올리는 직관',
  },
  {
    id: 'midgard',
    nameKo: '미드가르드',
    norseName: 'Miðgarðr',
    domain: '물질계의 현실적 행동과 균형',
    propheticGift: '추상적 생각을 땅에 단단히 발붙인 실천과 결과물로 구현하는 현실 감각',
  },
  {
    id: 'jotunheim',
    nameKo: '요툰하임',
    norseName: 'Jötunheimr',
    domain: '원초적 거친 본능과 무의식의 에너지',
    propheticGift: '억압된 분노와 두려움을 거대한 돌파의 추진력으로 역이용하는 야성',
  },
  {
    id: 'svartalfheim',
    nameKo: '스바르트알프하임',
    norseName: 'Svartálfaheimr',
    domain: '정교한 기술과 연금술적 장인정신',
    propheticGift: '복잡하고 뒤엉킨 문제를 한 땀 한 땀 정밀하게 풀어나가는 장인의 끈기',
  },
  {
    id: 'niflheim',
    nameKo: '니플하임',
    norseName: 'Niflheimr',
    domain: '원초적 얼음, 침묵과 정지의 쉼터',
    propheticGift: '소란스러운 외부 자극을 모두 끄고 영혼의 에너지를 비축하는 냉철함',
  },
  {
    id: 'muspelheim',
    nameKo: '무스펠하임',
    norseName: 'Múspellsheimr',
    domain: '타오르는 불꽃과 원초적 창조열',
    propheticGift: '낡은 틀과 타성을 한순간에 전소시키고 새길을 개척하는 혁신성',
  },
  {
    id: 'helheim',
    nameKo: '헬헤임',
    norseName: 'Helheimr',
    domain: '과거의 완전한 종결과 그림자 수용',
    propheticGift: '더 이상 작동하지 않는 집착을 미련 없이 묻어주고 평화를 찾는 수용력',
  },
];

export interface NorseVolvaSeidrNineRealmsOptions {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
  currentTime?: string;
}

export function calculateNorseVolvaSeidrNineRealms(
  optionsOrProfile?: NorseVolvaSeidrNineRealmsOptions | UserProfile | null,
  legacyContext?: { question?: string; currentTime?: string }
): NorseVolvaSeidrNineRealmsReport {
  let profile: UserProfile | null | undefined;
  let question = '';
  let now = new Date();

  if (optionsOrProfile && ('profile' in optionsOrProfile || 'question' in optionsOrProfile || 'now' in optionsOrProfile)) {
    const opts = optionsOrProfile as NorseVolvaSeidrNineRealmsOptions;
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

  let seed = 61927;
  for (let i = 0; i < bdate.length; i++) seed = (seed * 31 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 19 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 17 + question.charCodeAt(i)) % 1000003;
  seed = (seed + now.getUTCHours() * 37) % 1000003;

  const realmsWithScore: YggdrasilRealm[] = YGGDRASIL_REALMS_BASE.map((realm, idx) => {
    const score = 42 + ((seed * (idx + 4) + idx * 29) % 56);
    return { ...realm, resonanceScore: Math.min(99, Math.max(35, score)) };
  });

  realmsWithScore.sort((a, b) => b.resonanceScore - a.resonanceScore);
  const dominantRealm = realmsWithScore[0];
  const secondaryRealm = realmsWithScore[1];

  const seidrIntuitionClarity = Math.min(100, Math.max(45, 52 + ((seed * 13) % 46)));
  const huginnThoughtScore = Math.min(100, Math.max(40, 50 + ((seed * 23) % 48)));
  const muninMemoryScore = Math.min(100, Math.max(38, 48 + ((seed * 29) % 50)));
  const yggdrasilSapShieldPower = Math.min(100, Math.max(48, Math.floor((dominantRealm.resonanceScore * 0.5 + seidrIntuitionClarity * 0.5))));
  const wyrdFateWeavingResonance = Math.min(100, Math.max(42, 54 + ((seed * 41) % 44)));

  const volvaPropheticVision = `볼바의 지팡이가 가리키는 곳은 위그드라실의 [${dominantRealm.nameKo}(${dominantRealm.norseName})]입니다. ${dominantRealm.propheticGift}이 당신의 운명실(Wyrd)을 바르게 펴고 있으며, 보조 영역 [${secondaryRealm.nameKo}]의 지원으로 거센 폭풍 속에서도 흔들리지 않는 뿌리를 내리게 됩니다.`;
  const seidrSpindleGroundingRitual = `바닥에 두 발을 굳건히 딛고 세계수 위그드라실의 수액이 척추를 타고 흐르는 것을 심상화하며 읊조리십시오: "나는 후긴의 날카로운 지혜와 무닌의 깊은 성찰을 통합한다. 어떤 시련도 내 본래의 운명을 꺾을 수 없다."`;

  const calculatedAtKst = formatVolvaKstTimestamp(now);
  const composite = Math.round(
    (seidrIntuitionClarity + huginnThoughtScore + muninMemoryScore + yggdrasilSapShieldPower + wyrdFateWeavingResonance) / 5
  );
  const volvaSynthesisMatrix = {
    dominantTension: `${dominantRealm.nameKo} (${dominantRealm.domain}) ↔ ${secondaryRealm.nameKo}`,
    alignmentState: describeVolvaStage(composite),
    integratedAction: `${dominantRealm.propheticGift}${question.trim() ? ` [질문 맥락: ${question.trim()}]` : ''}`,
  };

  const ritualAction = `${seidrSpindleGroundingRitual} 이어 '${dominantRealm.nameKo}(${dominantRealm.norseName})'의 은사(${dominantRealm.propheticGift})를 오늘 한 가지 구체적인 선택에 적용하세요.`;
  const reflectionFocus = `볼바 세이드(${dominantRealm.nameKo} ↔ ${secondaryRealm.nameKo}) — ${dominantRealm.domain}과 위르드 직조`;

  const trimmedQ = question.trim();
  const reflectiveQuestion = trimmedQ
    ? `지금 "${trimmedQ}" 앞에서 위그드라실 ${dominantRealm.nameKo}(${dominantRealm.norseName})의 ${dominantRealm.propheticGift}을 살려 내가 먼저 엮어 갈 한 수는 무엇인가요?`
    : `오늘 ${dominantRealm.nameKo}과 ${secondaryRealm.nameKo}의 기운 속에서 내 운명실(Wyrd)을 가장 맑게 펴기 위해 정리할 생각은 무엇인가요?`;

  return {
    engineVersion: NORSE_VOLVA_SEIDR_NINE_REALMS_ENGINE_VERSION,
    timestamp: now.toISOString(),
    calculatedAtKst,
    seidrIntuitionClarity,
    huginnThoughtScore,
    muninMemoryScore,
    yggdrasilSapShieldPower,
    wyrdFateWeavingResonance,
    dominantRealm,
    secondaryRealm,
    volvaPropheticVision,
    seidrSpindleGroundingRitual,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    volvaSynthesisMatrix,
    interpretiveBoundary: '본 북유럽 볼바 세이드 & 위그드라실 9대 세계 리포트는 에다 신화 상징에 기반한 정성적 직관 성찰 안내이며, 확정적 미래 예언이 아닙니다.',
  };
}

export function formatNorseVolvaSeidrNineRealmsPrompt(rep: NorseVolvaSeidrNineRealmsReport): string {
  const composite = Math.round(
    (rep.seidrIntuitionClarity + rep.huginnThoughtScore + rep.muninMemoryScore + rep.yggdrasilSapShieldPower + rep.wyrdFateWeavingResonance) / 5
  );
  const lines = [
    `[고대 북유럽 볼바 세이드 직관 & 위그드라실 9대 세계 실측 데이터]`,
    `· 연산 시각: ${rep.calculatedAtKst} | 엔진 버전: v${rep.engineVersion}`,
    `· 세이드 직관 국면: ${describeVolvaStage(composite)}`,
    `· 주재 공명 영역: [${rep.dominantRealm.nameKo} (${rep.dominantRealm.norseName})]`,
    `  - 신성한 영토: ${rep.dominantRealm.domain}`,
    `  - 예언적 은사: ${rep.dominantRealm.propheticGift}`,
    `· 보조 영역: [${rep.secondaryRealm.nameKo} (${rep.secondaryRealm.norseName})] — ${rep.secondaryRealm.domain}`,
    `· 볼바의 예언적 통찰: ${rep.volvaPropheticVision}`,
    `· 세이드 물레 접지 리추얼: ${rep.seidrSpindleGroundingRitual}`,
    `· 실천 의례: ${rep.ritualAction}`,
    `· 성찰 초점: ${rep.reflectionFocus}`,
    `· 질문 맞춤 성찰 질문: ${rep.reflectiveQuestion}`,
  ];
  if (rep.volvaSynthesisMatrix) {
    lines.push(
      `· 교차 매트릭스: [핵심 긴장: ${rep.volvaSynthesisMatrix.dominantTension} | 조율 상태: ${rep.volvaSynthesisMatrix.alignmentState}]`,
      `· 통합 실천: ${rep.volvaSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(`· 해석 경계: ${rep.interpretiveBoundary}`);
  return lines.join('\n');
}

/**
 * 고대 중국 도가 열자(列子) 어풍동행(御風同行) & 무하유지향(無何有之鄕) 진인 유유자적 엔진 (taoistLieziWindRidingEngine.ts)
 *
 * 《열자(列子)》 황제편(黃帝篇) 및 천서편(天瑞篇) 원전 기반:
 * 열자 열어구(列禦寇)가 노자(老子)의 도를 닦아 바람을 타고 허공을 날아오르는 어풍(御風)의 경지와,
 * 인위적 조작을 벗어나 자연의 순리에 온전히 몸을 맡기는 무하유지향(無何有之鄕) 진인(眞人) 체계.
 *
 * 열자 어풍 5대 심법 단계:
 * 1. 망시비 (忘是非) - 옳고 그름에 대한 분별과 집착을 내려놓아 마음에 한 조각 티끌도 남기지 않음
 * 2. 망이해 (忘利害) - 눈앞의 이익과 손해에 일희일비하지 않고 큰 흐름에 몸을 맡김
 * 3. 망아집 (忘我執) - '나'라는 굳은 틀과 에고의 경계를 허물어 만물과 소통함
 * 4. 어풍비상 (御風飛翔) - 마음과 기운이 하나가 되어 바람이 나인지 내가 바람인지 알 수 없는 무심(無心)의 비행
 * 5. 무하유지향 (無何有之鄕) - 그 어떤 작위도 없는 절대적 평화와 안식의 근원적 고향
 */

import type { UserProfile } from '../sharedState';

export const TAOIST_LIEZI_ENGINE_VERSION = '2.1.0';

function formatLieziKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

export interface LieziWindStage {
  id: string;
  nameHanja: string;
  nameKo: string;
  mindCultivationDomain: string;
  windRidingPower: string;
  transcendenceGuidance: string;
  resonanceScore: number; // 0 ~ 100
}

export interface TaoistLieziWindRidingReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  windRidingUnityScore: number; // 0 ~ 100 바람과의 합일도 (심기상응 지수)
  muhayuRestIndex: number; // 0 ~ 100 무하유지향 안식도
  tranquilEmptinessScore: number; // 0 ~ 100 허정염담(虛靜恬淡) 평온 지수
  nonAttachmentFluidityRate: number; // 0 ~ 100 집착 없는 유연성
  dominantStage: LieziWindStage;
  secondaryStage: LieziWindStage;
  lieziWindDecree: string; // 열자 어풍 지혜 선언
  wuweiActionMeditation: string; // 무위자연 행동 명상
  reflectiveQuestion: string; // 내담자 성찰 질문
  interpretiveBoundary: string; // 상징 해석 경계 고지
  lieziSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

const LIEZI_WIND_STAGES_BASE: Omit<LieziWindStage, 'resonanceScore'>[] = [
  {
    id: 'wangshifei',
    nameHanja: '忘是非 (망시비)',
    nameKo: '시비분별의 초월',
    mindCultivationDomain: '타인의 평가나 옳고 그름의 논쟁에서 한 걸음 물러나 마음의 평정을 회복함',
    windRidingPower: '감정 소모를 멈추고 맑고 투명한 본래의 통찰력을 되찾음',
    transcendenceGuidance: '누가 옳고 그른지 따지는 논쟁에 휘말리지 마십시오. 침묵 속에서 진실이 드러납니다.',
  },
  {
    id: 'wanglihai',
    nameHanja: '忘利害 (망이해)',
    nameKo: '이해득실의 해탈',
    mindCultivationDomain: '단기적 손익 계산의 불안에서 벗어나 인생 전체의 유유한 순리를 신뢰함',
    windRidingPower: '초조함 없이 차분하게 때를 기다리며 가장 순조로운 길을 선택함',
    transcendenceGuidance: '손해 볼까 두려워 전전긍긍하지 마십시오. 비워낸 자리에는 더 좋은 기운이 찹니다.',
  },
  {
    id: 'wangazhip',
    nameHanja: '忘我執 (망아집)',
    nameKo: '에고와 집착의 탈각',
    mindCultivationDomain: '자신의 고집과 편견을 녹여 주변 상황 및 인연과 부드럽게 융화됨',
    windRidingPower: '어떤 난관을 만나도 부딪히지 않고 물처럼 흐르며 장애물을 우회함',
    transcendenceGuidance: '내 방식만을 고집하지 말고, 상황의 흐름에 유연하게 자신을 맞추어 가십시오.',
  },
  {
    id: 'yufengfeixiang',
    nameHanja: '御風飛翔 (어풍비상)',
    nameKo: '바람을 타는 무심의 비상',
    mindCultivationDomain: '내면의 힘을 빼고 시대와 자연의 큰 흐름을 순풍 삼아 단숨에 도약함',
    windRidingPower: '적은 힘으로도 만 리를 날아가는 기적 같은 타이밍과 추진력 발휘',
    transcendenceGuidance: '억지로 저항하려 하지 말고 자연스러운 바람의 방향을 타고 가볍게 도약하십시오.',
  },
  {
    id: 'muhayuzhixiang',
    nameHanja: '無何有之鄕 (무하유지향)',
    nameKo: '절대 자유와 평화의 안식',
    mindCultivationDomain: '모든 번뇌가 멈추고 온 우주가 내 집처럼 편안해지는 절대적 안식처 도달',
    windRidingPower: '세상의 혼란 속에서도 언제나 깊은 평온과 만족감을 누리는 진인의 풍모',
    transcendenceGuidance: '마음의 짐을 모두 내려놓으십시오. 당신은 이미 가장 안전하고 평화로운 곳에 있습니다.',
  },
];

export interface TaoistLieziWindRidingOptions {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
  currentTime?: string;
}

export function calculateTaoistLieziWindRiding(
  optionsOrProfile?: TaoistLieziWindRidingOptions | UserProfile | null,
  legacyContext?: { question?: string; currentTime?: string }
): TaoistLieziWindRidingReport {
  let profile: UserProfile | null | undefined;
  let question = '';
  let now = new Date();

  if (optionsOrProfile && ('profile' in optionsOrProfile || 'question' in optionsOrProfile || 'now' in optionsOrProfile)) {
    const opts = optionsOrProfile as TaoistLieziWindRidingOptions;
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

  let seed = 91873;
  for (let i = 0; i < bdate.length; i++) seed = (seed * 31 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 19 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 17 + question.charCodeAt(i)) % 1000003;
  seed = (seed + now.getUTCHours() * 43) % 1000003;

  const stages: LieziWindStage[] = LIEZI_WIND_STAGES_BASE.map((stg, idx) => {
    const score = 48 + ((seed * (idx + 4) + idx * 29) % 51);
    return { ...stg, resonanceScore: Math.min(99, Math.max(40, score)) };
  });

  stages.sort((a, b) => b.resonanceScore - a.resonanceScore);
  const dominantStage = stages[0];
  const secondaryStage = stages[1];

  const windRidingUnityScore = Math.min(100, Math.max(45, 54 + ((seed * 27) % 44)));
  const muhayuRestIndex = Math.min(100, Math.max(42, 53 + ((seed * 21) % 46)));
  const tranquilEmptinessScore = Math.min(100, Math.max(44, 55 + ((seed * 19) % 43)));
  const nonAttachmentFluidityRate = Math.min(100, Math.max(46, Math.floor((windRidingUnityScore * 0.5 + tranquilEmptinessScore * 0.5))));

  const lieziWindDecree = `《열자》 황제편은 노래합니다: "바람을 타는 자는 바람과 맞서지 않고, 내 몸을 한 줌의 겨처럼 가볍게 여겨 허공에 맡긴다." 지금 당신에게 흐르는 심법은 [${dominantStage.nameHanja} - ${dominantStage.nameKo}]입니다. ${dominantStage.transcendenceGuidance}`;
  const wuweiActionMeditation = `억지로 쥐고 있던 힘을 풀고 깊게 숨을 내쉬십시오: "어디에도 걸림이 없는 무하유지향의 바람이 분다. 나는 순풍을 타고 가볍게 유영한다."`;

  const calculatedAtKst = formatLieziKstTimestamp(now);
  const q = question.trim();
  const reflectiveQuestion = q
    ? `"${q}" 앞에서 [${dominantStage.nameHanja}]의 바람을 타기 위해, 보조 심법 [${secondaryStage.nameHanja}]에서 오늘 먼저 내려놓을 집착은 무엇입니까?`
    : `${dominantStage.nameKo}의 흐름 속에서 힘을 빼고 순풍에 몸을 맡길 때, 지금 가장 먼저 멈출 수 있는 쓸데없는 애씀은 무엇입니까?`;
  const interpretiveBoundary =
    '도가 열자 어풍동행·무하유지향 상징은 마음의 집착을 덜고 순리에 맞추는 태도를 돌아보기 위한 은유적 관점이며, 단정적 미래 예측이나 의학·법률·재무 판단을 대체하지 않습니다.';
  const lieziSynthesisMatrix = {
    dominantTension: `${dominantStage.nameHanja} ↔ ${secondaryStage.nameHanja}`,
    alignmentState: `심신 영역: ${dominantStage.mindCultivationDomain}`,
    integratedAction: `${dominantStage.transcendenceGuidance}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  return {
    engineVersion: TAOIST_LIEZI_ENGINE_VERSION,
    timestamp: now.toISOString(),
    calculatedAtKst,
    windRidingUnityScore,
    muhayuRestIndex,
    tranquilEmptinessScore,
    nonAttachmentFluidityRate,
    dominantStage,
    secondaryStage,
    lieziWindDecree,
    wuweiActionMeditation,
    reflectiveQuestion,
    interpretiveBoundary,
    lieziSynthesisMatrix,
  };
}

export function formatTaoistLieziWindRidingPrompt(rep: TaoistLieziWindRidingReport): string {
  const matrixLine = rep.lieziSynthesisMatrix
    ? `\n· 열자 교차 매트릭스: 핵심 긴장(${rep.lieziSynthesisMatrix.dominantTension}) · 조율 상태(${rep.lieziSynthesisMatrix.alignmentState}) · 통합 실천(${rep.lieziSynthesisMatrix.integratedAction})`
    : '';
  return `[도가 열자 어풍동행 & 무하유지향 진인 유유자적 실측 데이터]
· 엔진 버전: v${rep.engineVersion} | 기준 시각: ${rep.calculatedAtKst}
· 주재 어풍 심법: [${rep.dominantStage.nameHanja} (${rep.dominantStage.nameKo})]
  - 심신 영역: ${rep.dominantStage.mindCultivationDomain}
  - 어풍 권능: ${rep.dominantStage.windRidingPower}
  - 초월 지침: ${rep.dominantStage.transcendenceGuidance}
· 보조 교차 심법: [${rep.secondaryStage.nameHanja} (${rep.secondaryStage.nameKo})]
· 열자 어풍 지혜 선언: ${rep.lieziWindDecree}
· 무위자연 행동 명상: ${rep.wuweiActionMeditation}${matrixLine}
· 성찰 질문: ${rep.reflectiveQuestion}
· 해석 경계: ${rep.interpretiveBoundary}`;
}

/**
 * 고대 멕시코 톨텍 나구알리즘 4대 약속 & 꿈의 제2주의 엔진 (toltecNagualDreamingEngine.ts)
 *
 * 톨텍 샤머니즘(Toltec Nagualism) 및 돈 미겔 루이스 4대 약속(The Four Agreements) 원전 전승 기반:
 * 사회적 길들이기(Domestication)와 마음의 소음인 미토테(Mitote/기생충)를 해체하고,
 * 낮의 물질적 세계인 '토날(Tonal)'과 밤의 영적 의식이자 지각의 원천인 '나구알(Nagual)'을 통합하며,
 * 꿈의 제2주의(Second Attention)를 깨워 현실을 의식적으로 재창조하는 톨텍 영사(Toltec Artist)의 지혜.
 *
 * 4대 약속(Four Sacred Agreements):
 * 1. 말에 흠결이 없게 하라 (Be Impeccable With Your Word) - 창조의 힘으로서의 언어 순도
 * 2. 어떤 것도 자신과 연관짓지 마라 (Don't Take Anything Personally) - 타인의 투사에 대한 완전 면역
 * 3. 지레짐작하지 마라 (Don't Make Assumptions) - 명료한 질문과 오해 드라마 종식
 * 4. 항상 최선을 다하라 (Always Do Your Best) - 자책과 후회의 영구적 소멸
 */

import type { UserProfile } from '../sharedState';

export const TOLTEC_NAGUAL_DREAMING_ENGINE_VERSION = '2.4.0';

function formatToltecKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

export interface ToltecAgreement {
  id: string;
  nameKo: string;
  originalName: string;
  essence: string;
  masteryScore: number; // 0 ~ 100 숙달도
  shadowTrap: string; // 위반 시 발생하는 그림자 덫
  impeccableAction: string; // 오늘 실천할 무결한 행동
}

export interface ToltecNagualDreamingReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  nagualRatio: number; // 나구알(영적/지각자) 비율 (30 ~ 70%)
  tonalRatio: number; // 토날(물질/사회적 에고) 비율 (30 ~ 70%)
  secondAttentionIndex: number; // 0 ~ 100 제2주의(자각몽/현실 재창조) 지수
  mitoteClarityScore: number; // 0 ~ 100 미토테(마음의 소음/기생충) 정화도
  stalkingMasteryScore: number; // 0 ~ 100 자기 기만 포착(Stalking) 숙달도
  agreements: ToltecAgreement[];
  primaryAgreement: ToltecAgreement; // 가장 강화가 시급한 핵심 약속
  secondaryAgreement: ToltecAgreement; // 보조 교차 약속
  dreamerGuidance: string; // 꿈꾸는 자의 현실 조율 지침
  warriorStalkingRitual: string; // 톨텍 전사의 자기 정화 리추얼
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  ritualAction: string;
  reflectionFocus: string;
  toltecSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
    toltecCrossAxis: string;
  };
}

const TOLTEC_AGREEMENTS_BASE: Omit<ToltecAgreement, 'masteryScore'>[] = [
  {
    id: 'impeccable_word',
    nameKo: '말에 흠결이 없게 하라',
    originalName: 'Be Impeccable With Your Word',
    essence: '언어는 마법이자 현실을 빚는 순수한 창조력입니다. 험담과 자기 비하에 말을 쓰지 마십시오.',
    shadowTrap: '비난, 뒷담화, 자기 연민, 무의식적 저주성 언어 습관',
    impeccableAction: '오늘 단 하나의 부정적 혼잣말도 입 밖으로 내지 않고 진실만을 선포하십시오.',
  },
  {
    id: 'nothing_personal',
    nameKo: '어떤 것도 자신과 연관짓지 마라',
    originalName: "Don't Take Anything Personally",
    essence: '타인이 말하고 행동하는 것은 오직 그들 자신의 꿈과 환영의 투사일 뿐, 당신과 무관합니다.',
    shadowTrap: '타인의 비판에 상처받음, 인정 욕구, 방어적 반발',
    impeccableAction: '타인의 공격이나 칭찬 모두에 마음의 중심을 맡기지 말고 투명한 거울이 되십시오.',
  },
  {
    id: 'no_assumptions',
    nameKo: '지레짐작하지 마라',
    originalName: "Don't Make Assumptions",
    essence: '모르는 것을 혼자 추측하여 고통스러운 드라마를 쓰지 말고, 용기를 내어 질문하십시오.',
    shadowTrap: '속단, 상대방 속마음 넘겨짚기, 혼자 삭히다 폭발하는 오해',
    impeccableAction: '모호한 점이 있다면 넘겨짚지 말고 직접 다정하고 담백하게 확인하십시오.',
  },
  {
    id: 'always_best',
    nameKo: '항상 최선을 다하라',
    originalName: 'Always Do Your Best',
    essence: '당신의 최선은 몸 상태와 기분에 따라 날마다 변합니다. 더도 덜도 말고 현재의 최선을 다하십시오.',
    shadowTrap: '과도한 완벽주의로 인한 번아웃, 혹은 나태함 뒤에 따르는 자책',
    impeccableAction: '지금 이 순간 당신이 지닌 에너지 수준에서 할 수 있는 한 걸음만 온전히 내딛으십시오.',
  },
];

export interface ToltecNagualDreamingOptions {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
  currentTime?: string;
}

export function calculateToltecNagualDreaming(
  optionsOrProfile?: ToltecNagualDreamingOptions | UserProfile | null,
  legacyContext?: { question?: string; currentTime?: string }
): ToltecNagualDreamingReport {
  let profile: UserProfile | null | undefined;
  let question = '';
  let now = new Date();

  if (optionsOrProfile && ('profile' in optionsOrProfile || 'question' in optionsOrProfile || 'now' in optionsOrProfile)) {
    const opts = optionsOrProfile as ToltecNagualDreamingOptions;
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

  let seed = 43301;
  for (let i = 0; i < bdate.length; i++) seed = (seed * 31 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 19 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 17 + question.charCodeAt(i)) % 1000003;
  seed = (seed + now.getUTCHours() * 23) % 1000003;

  const agreements: ToltecAgreement[] = TOLTEC_AGREEMENTS_BASE.map((ag, idx) => {
    const score = 42 + ((seed * (idx + 3) + idx * 29) % 55);
    return { ...ag, masteryScore: Math.min(98, Math.max(35, score)) };
  });

  // 점수가 가장 낮은 약속이 지금 당장 의식적으로 챙겨야 할 핵심 약속
  const sortedByUrgency = [...agreements].sort((a, b) => a.masteryScore - b.masteryScore);
  const primaryAgreement = sortedByUrgency[0];
  const secondaryAgreement = sortedByUrgency[1];

  const nagualRaw = 35 + ((seed * 13) % 31);
  const nagualRatio = Math.min(65, Math.max(35, nagualRaw));
  const tonalRatio = 100 - nagualRatio;

  const secondAttentionIndex = Math.min(100, Math.max(40, 50 + ((seed * 17) % 48)));
  const mitoteClarityScore = Math.min(100, Math.max(35, 48 + ((seed * 11) % 49)));
  const stalkingMasteryScore = Math.min(100, Math.max(42, Math.floor((primaryAgreement.masteryScore * 0.4 + mitoteClarityScore * 0.6))));

  const dreamerGuidance = `현재 토날(물질·에고)과 나구알(영적·지각자)의 흐름 속에서, 기생충의 소음(미토테)을 잠재우기 위해 가장 시급한 열쇠는 '${primaryAgreement.nameKo}'입니다. 타인의 투사와 내면의 지레짐작을 분리할 때 제2주의가 깨어납니다.`;
  const warriorStalkingRitual = `호흡을 가다듬고 가슴에 손을 얹은 뒤 선언하십시오: "나는 타인의 환영에 반응하지 않으며, 오직 나의 무결한 진실 속에서 깨어 꿈꾼다." (${primaryAgreement.impeccableAction})`;
  const calculatedAtKst = formatToltecKstTimestamp(now);
  const q = question.trim();
  const reflectiveQuestion = q
    ? `"${q}"의 자리에서 [${primaryAgreement.nameKo}]을 세우고 보조 [${secondaryAgreement.nameKo}]의 균형을 함께 지키기 위해, 지금 가장 먼저 내려놓아야 할 지레짐작은 무엇입니까?`
    : `[${primaryAgreement.nameKo}]의 약속을 오늘 하루 실천할 때, 내 안의 미토테(소음)가 가장 쉽게 파고드는 순간은 언제입니까?`;
  const interpretiveBoundary =
    '톨텍 나구알리즘 4대 약속과 토날·나구알 상징은 언어 습관과 내면의 자각을 점검하기 위한 철학적 관조 은유이며, 단정적 미래 예측이나 의학적·심리적 진단을 대체하지 않습니다.';
  const ritualAction = `${primaryAgreement.impeccableAction} 잠들기 전 오늘의 말과 반응을 2분간 조용히 돌아보십시오.`;
  const reflectionFocus = `[${primaryAgreement.nameKo}] 실천과 [${secondaryAgreement.nameKo}]의 조화를 가로막는 미토테(마음의 소음)`;
  const toltecCrossAxis = `[${primaryAgreement.nameKo}] × [${secondaryAgreement.nameKo}] × [${nagualRatio >= tonalRatio ? '나구알 우위' : '토날 우위'}] × [${q || '현실 자각'}]`;
  const toltecSynthesisMatrix = {
    dominantTension: `${primaryAgreement.nameKo} ↔ ${primaryAgreement.shadowTrap}`,
    alignmentState: `${nagualRatio >= tonalRatio ? '나구알(지각자) 우위' : '토날(현실) 우위'} · 보조 교차(${secondaryAgreement.nameKo})`,
    integratedAction: `${primaryAgreement.impeccableAction}${q ? ` [질문 맥락: ${q}]` : ''}`,
    toltecCrossAxis,
  };

  return {
    engineVersion: TOLTEC_NAGUAL_DREAMING_ENGINE_VERSION,
    timestamp: now.toISOString(),
    calculatedAtKst,
    nagualRatio,
    tonalRatio,
    secondAttentionIndex,
    mitoteClarityScore,
    stalkingMasteryScore,
    agreements,
    primaryAgreement,
    secondaryAgreement,
    dreamerGuidance,
    warriorStalkingRitual,
    reflectiveQuestion,
    interpretiveBoundary,
    ritualAction,
    reflectionFocus,
    toltecSynthesisMatrix,
  };
}

export function formatToltecNagualDreamingPrompt(rep: ToltecNagualDreamingReport): string {
  const matrixLine = rep.toltecSynthesisMatrix
    ? `\n· 톨텍 나구알 교차 매트릭스: 핵심 긴장(${rep.toltecSynthesisMatrix.dominantTension}) · 조율 상태(${rep.toltecSynthesisMatrix.alignmentState}) · 4중 교차 축(${rep.toltecSynthesisMatrix.toltecCrossAxis}) · 통합 실천(${rep.toltecSynthesisMatrix.integratedAction})`
    : '';
  return `[고대 톨텍 나구알리즘 4대 약속 & 꿈의 제2주의 실측 데이터]
· 엔진 버전: v${rep.engineVersion} | ${rep.calculatedAtKst}
· 토날 vs 나구알 균형: ${rep.nagualRatio >= rep.tonalRatio ? '나구알(영적·지각자) 우위' : '토날(물질·에고) 우위'}
· 4대 약속 핵심 덫:
${rep.agreements.map((a) => `  - ${a.nameKo}: [위반 덫: ${a.shadowTrap}]`).join('\n')}
· 최우선 의식 수복 약속: [${rep.primaryAgreement.nameKo}]
  - 실천 행동: ${rep.primaryAgreement.impeccableAction}
· 보조 교차 약속: [${rep.secondaryAgreement.nameKo}] (${rep.secondaryAgreement.impeccableAction})
· 꿈꾸는 자의 현실 조율 지침: ${rep.dreamerGuidance}
· 톨텍 전사 스토킹 리추얼: ${rep.warriorStalkingRitual}${matrixLine}
· 성찰 질문: ${rep.reflectiveQuestion}
· 실천 의례: ${rep.ritualAction}
· 성찰 초점: ${rep.reflectionFocus}
· 해석 경계: ${rep.interpretiveBoundary}`;
}

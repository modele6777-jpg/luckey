/**
 * 고대 그리스 알렉산드리아 헤르메스주의 36대 데칸(Decan) 천상 성령 & 시간의 지배자 엔진 (alexandrianDecanThirtySixGodsEngine.ts)
 *
 * 기원전 헬레니즘 알렉산드리아 점성술 및 《헤르메티카(Hermetica)》 제8권 원전 기반:
 * 360도 천상 황도대를 10도씩 분할하여 우주의 시간과 지상의 운명을 주재하는
 * 36대 데칸 성령(Decanoi / 36 Sacred Celestial Rulers of Time)의 상징·성찰 체계.
 *
 * @version 1.1.0
 */

import type { UserProfile } from '../sharedState';

export const ALEXANDRIAN_DECAN_ENGINE_VERSION = '2.2.0';

export type DecanQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface DecanCelestialGod {
  id: string;
  nameGreek: string;
  nameKo: string;
  decanDegreeDomain: string; // 관할 황도대 도수 및 영역
  temporalRulership: string; // 시간의 지배 양상 (크로노스 vs 카이로스)
  celestialProtectionPower: string;
  soulVirtue: string;
  resonanceScore: number; // 내부 정렬용 (프롬프트 비노출)
}

export interface AlexandrianDecanThirtySixGodsReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  questionTopic: DecanQuestionTopic;
  kairosPosture: string;
  kairosTimeMasteryScore: number; // 내부 호환용 (프롬프트 비노출)
  tenDaySoulTuningIndex: number; // 내부 호환용 (프롬프트 비노출)
  astralShieldingRate: number; // 내부 호환용 (프롬프트 비노출)
  zodiacalEquilibriumScore: number; // 내부 호환용 (프롬프트 비노출)
  dominantDecan: DecanCelestialGod;
  secondaryDecan: DecanCelestialGod;
  temporalDecanRhythm: {
    kstTimeLabel: string;
    hermeticWatchWindow: string;
    tenDaySolarCycle: string;
    temporalGuidance: string;
  };
  decanSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  counselNote: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
  alexandrianHermeticDecree: string;
  celestialDecanSealGuidance: string;
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

function classifyDecanTopic(question: string): DecanQuestionTopic {
  const q = question.toLowerCase();
  if (/연애|사랑|관계|이별|재회|결혼|사람|배우자|친구|가족|갈등/.test(q)) return 'relationship';
  if (/선택|결정|이직|창업|진로|계약|시험|투자|사업|옮길|할까|말까/.test(q)) return 'decision';
  if (/마음|우울|불안|치유|회복|건강|지침|슬픔|휴식|외로|힘들/.test(q)) return 'healing';
  return 'reflection';
}

function getKstDateKey(now: Date): string {
  const kstMs = now.getTime() + 9 * 60 * 60 * 1000;
  return new Date(kstMs).toISOString().slice(0, 10);
}

function getTemporalDecanRhythm(now: Date) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const hour = kst.getUTCHours();
  const dayOfMonth = kst.getUTCDate();

  const hermeticWatchWindow =
    hour >= 5 && hour < 11
      ? '소티스 여명·아침 파수창 — 새로운 결심과 맑은 의도를 세우기 좋은 카이로스의 시분'
      : hour >= 11 && hour < 17
        ? '크눔 정오·조형창 — 구상을 현실의 구체적 결과물로 빚어내는 실행의 시분'
        : hour >= 17 && hour < 22
          ? '아누비스 황혼·칭량창 — 하루의 선택과 감정을 공정히 정돈하고 불필요한 긴장을 비우는 시분'
          : '오시리스 심야·재생창 — 표면의 소음을 잠재우고 내면의 깊은 지혜를 회복하는 시분';

  const tenDaySolarCycle =
    dayOfMonth <= 10
      ? '제1 데칸(초순 · 발아의 10일) — 새로운 흐름의 씨앗을 심고 방향을 가다듬는 주기'
      : dayOfMonth <= 20
        ? '제2 데칸(중순 · 확장의 10일) — 세운 계획을 밀도 있게 다듬어 형태를 굳히는 주기'
        : '제3 데칸(하순 · 수렴의 10일) — 마무리를 짓고 다음 주기를 위해 여백을 비우는 주기';

  return {
    kstTimeLabel: `${y}-${m}-${d} ${hh}:${mm} KST`,
    hermeticWatchWindow,
    tenDaySolarCycle,
    temporalGuidance: `${hermeticWatchWindow} · ${tenDaySolarCycle}의 흐름에 맞추어 오늘의 속도보다 리듬의 정확도를 살피십시오.`,
  };
}

const DECAN_TOPIC_GUIDANCE: Record<
  DecanQuestionTopic,
  { practice: string; ritual: string; reflection: string; counsel: string }
> = {
  relationship: {
    practice: '관계의 타이밍을 조급하게 재촉하지 말고, 상대와 나 사이의 경계와 진심을 차분히 살피십시오.',
    ritual: '오늘 대화를 시작하기 전 세 번 숨을 고르고, 판단 대신 상대의 말을 끝까지 듣는 시간을 가지십시오.',
    reflection: '지금 이 관계에서 내가 지키고 싶은 진실한 태도와 내려놓아야 할 조바심은 무엇인가요?',
    counsel: '알렉산드리아 데칸의 시간은 억지로 관계를 끌어당기기보다, 서로의 리듬이 맞물리는 순간을 기다릴 때 비로소 열립니다.',
  },
  decision: {
    practice: '크로노스(기계적 시계 시간)의 조급함을 내려놓고, 지금이 행동할 카이로스인지 준비할 시기인지 분별하십시오.',
    ritual: '결정해야 할 선택지 두 가지를 적고, 각각의 최선과 최악이 아닌 "내가 감당할 수 있는 리듬"을 표시해 보십시오.',
    reflection: '지금 내 선택을 흔드는 것은 현실의 근거인가요, 아니면 늦어질까 봐 두려운 마음인가요?',
    counsel: '10도씩 나뉘는 데칸의 흐름처럼, 큰 결단도 지금 눈앞의 한 구간을 정확히 밟는 데서 완성됩니다.',
  },
  healing: {
    practice: '지금의 정체나 피로를 실패로 여기지 말고, 다음 주기를 준비하는 고요한 10일 주기의 쉼으로 받아들이십시오.',
    ritual: '해 질 녘 불필요한 화면을 잠시 끄고, 따뜻한 물 한 잔과 함께 오늘 버텨낸 자신에게 짧은 휴식을 허락하십시오.',
    reflection: '지금 내 마음의 에너지를 가장 크게 소모시키고 있는 외부의 소음은 무엇인가요?',
    counsel: '데칸 성령의 수호는 거창한 변화보다 지친 일상 속에 작은 질서와 온기를 되찾는 순간에 작용합니다.',
  },
  reflection: {
    practice: '반복되는 일상의 흐름 속에서 오늘 유독 눈에 띄는 징후와 내면의 감각을 조용히 기록해 두십시오.',
    ritual: '잠들기 전 오늘 하루 중 가장 선명했던 순간 하나와 그 순간의 감정을 한 줄로 적어 보십시오.',
    reflection: '요즘 내 삶의 시간은 어떤 계절을 지나고 있으며, 무엇을 새롭게 빚어내고 있나요?',
    counsel: '하늘의 데칸이 시간을 나누듯, 스스로 하루의 의미를 분절해 바라보면 막연했던 흐름이 선명해집니다.',
  },
};

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
  const kstDate = getKstDateKey(now);
  const questionTopic = classifyDecanTopic(question);

  let seed = 87121;
  const seedStr = `${bdate}|${btime}|${kstDate}|${questionTopic}|${question}`;
  for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) % 1000003;

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

  const topicGuide = DECAN_TOPIC_GUIDANCE[questionTopic];
  const temporalDecanRhythm = getTemporalDecanRhythm(now);
  const kairosPosture = `${dominantDecan.nameGreek}의 카이로스 국면 — ${dominantDecan.temporalRulership}`;
  const practiceGuidance = `${dominantDecan.soulVirtue} ${topicGuide.practice}`;
  const ritualAction = topicGuide.ritual;
  const reflectionFocus = topicGuide.reflection;
  const trimmedQ = question.trim();
  const reflectiveQuestion = trimmedQ
    ? `‘${trimmedQ}’라는 물음을 안고 있는 지금, ${dominantDecan.nameGreek}의 카이로스 앞에서 내가 조급히 당기려던 속도를 멈추고 기다려야 할 리듬은 무엇인가요?`
    : reflectionFocus;
  const counselNote = topicGuide.counsel;
  const boundaryNotice = '알렉산드리아 36대 데칸 관점은 천상 시간의 상징을 빌려 삶의 리듬과 태도를 성찰하는 참고 도구이며, 미래 사건이나 길흉을 단정하지 않습니다.';

  const decanSynthesisMatrix = {
    coreInsight: `[${dominantDecan.nameGreek} (${dominantDecan.nameKo})]와 보조 성령 [${secondaryDecan.nameGreek}]이 ${questionTopic} 맥락에서 카이로스의 문을 비춥니다.`,
    recommendedAction: `${practiceGuidance} (${ritualAction})`,
    cautionNotice: '기계적 조급함(크로노스)에 쫓겨 리듬을 놓치면 작은 마찰이 커집니다. 한 호흡 고르고 본질을 확인하십시오.',
  };

  const alexandrianHermeticDecree = `헤르메스주의 알렉산드리아 상징 체계에서 지금의 흐름을 비추는 주 수호 성령은 [${dominantDecan.nameGreek} - ${dominantDecan.nameKo}]이며, 보조로 [${secondaryDecan.nameGreek}]의 기운이 함께 작용합니다. ${dominantDecan.soulVirtue}`;
  const celestialDecanSealGuidance = `${dominantDecan.temporalRulership}. ${topicGuide.practice}`;

  return {
    engineVersion: ALEXANDRIAN_DECAN_ENGINE_VERSION,
    timestamp: now.toISOString(),
    calculatedAtKst: temporalDecanRhythm.kstTimeLabel,
    questionTopic,
    kairosPosture,
    kairosTimeMasteryScore,
    tenDaySoulTuningIndex,
    astralShieldingRate,
    zodiacalEquilibriumScore,
    dominantDecan,
    secondaryDecan,
    temporalDecanRhythm,
    decanSynthesisMatrix,
    practiceGuidance,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    counselNote,
    boundaryNotice,
    interpretiveBoundary: boundaryNotice,
    alexandrianHermeticDecree,
    celestialDecanSealGuidance,
  };
}

export function formatAlexandrianDecanThirtySixGodsPrompt(rep: AlexandrianDecanThirtySixGodsReport): string {
  return `[알렉산드리아 헤르메스주의 36대 데칸 천상 성령 & 시간의 지배자 실측 데이터]
· 엔진 버전: v${rep.engineVersion} | 연산 시각: ${rep.calculatedAtKst} | 질문 맥락: ${rep.questionTopic}
· 카이로스 국면: ${rep.kairosPosture}
· 주재 데칸 성령: [${rep.dominantDecan.nameGreek} (${rep.dominantDecan.nameKo})]
  - 관할 도수: ${rep.dominantDecan.decanDegreeDomain}
  - 시간 지배 양상: ${rep.dominantDecan.temporalRulership}
  - 천상 보호 상징: ${rep.dominantDecan.celestialProtectionPower}
  - 영혼 덕목: ${rep.dominantDecan.soulVirtue}
· 보조 데칸 성령: [${rep.secondaryDecan.nameGreek} (${rep.secondaryDecan.nameKo})] — ${rep.secondaryDecan.temporalRulership}
· KST 시공간 데칸 리듬: ${rep.temporalDecanRhythm.hermeticWatchWindow} / ${rep.temporalDecanRhythm.tenDaySolarCycle}
  - 시공간 지침: ${rep.temporalDecanRhythm.temporalGuidance}
· 데칸 교차 매트릭스:
  - 핵심 통찰: ${rep.decanSynthesisMatrix.coreInsight}
  - 권고 실행: ${rep.decanSynthesisMatrix.recommendedAction}
  - 주의 경계: ${rep.decanSynthesisMatrix.cautionNotice}
· 실천 조언: ${rep.practiceGuidance}
· 일상 의례: ${rep.ritualAction}
· 성찰 질문: ${rep.reflectiveQuestion}
· 조언 요약: ${rep.counselNote}
· 해석 경계: ${rep.boundaryNotice}`;
}

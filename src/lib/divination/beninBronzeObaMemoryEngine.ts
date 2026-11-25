import type { UserProfile } from '../sharedState';

export type BeninObaTopic = 'career' | 'relationship' | 'wealth' | 'health' | 'general';

export interface BeninBronzeObaResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: BeninObaTopic;
  edoMotif: string;
  companionMotif: string;
  castingPhase: string;
  obaCrossAxis: string;
  beninInsight: string;
  guildTone: string;
  shadowWarning: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const CASTING_PHASES = [
  '밀랍 성형(서두르지 않고 손끝의 선을 또렷이 세우는 준비기)',
  '쇳물 주입(충분히 익은 결심을 흔들림 없이 한 번에 붓는 결단기)',
  '부조 연마(굳은 결과의 거친 모서리를 다듬어 기억으로 남기는 정리기)',
] as const;

const SHADOW_WARNINGS = [
  '완벽한 거푸집만 다듬다가 정작 쇳물을 부어야 할 때를 계속 미루는 지연을 경계하세요.',
  '지난 공적과 형식의 무게에 눌려 지금 새롭게 빚어야 할 유연한 시도를 스스로 막지 않도록 살피세요.',
  '안팎의 경계를 세우려다 필요한 소통과 온기까지 차단할 만큼 벽을 두껍게 쌓지 않도록 점검하세요.',
] as const;

const MOTIFS = [
  {
    motif: '이군 에론몬 청동 주조(Igun Eronmwon · 밀랍을 녹이고 쇳물을 부어 한 번에 형태를 굳히는 장인의 몰입)',
    insight: '오랜 준비가 쌓인 순간에는 망설임을 덜고 온전한 집중으로 형태를 드러내는 용기가 필요함',
    tone: '베냉 성벽 안 장인 거리의 화덕에서 붉은 쇳물이 흙 거푸집 속으로 고요히 흘러드는 밤',
    ritual: '오늘 오래 벼르고 있던 일 한 가지를 정해 20분간 다른 방해 없이 단번에 초안을 완성해 보세요.',
    question: '이미 충분한 준비가 쌓였는데도 망설이느라 쇳물을 붓지 못하고 있는 일은 무엇인가요?',
  },
  {
    motif: '청동 부조판의 기억(Bronze Plaque · 지나온 발자취와 계보를 선명한 부조로 새겨 잊지 않음)',
    insight: '오늘의 선택은 공중에서 생겨난 것이 아니라, 그동안 내가 지켜 온 성실한 기록 위에 놓여 있음',
    tone: '회랑 기둥을 따라 줄지어 걸린 청동판들이 햇빛을 받아 묵직하게 빛나는 궁정 뜰',
    ritual: '오늘 내가 이미 잘 해내 온 일 한 가지를 노트에 한 줄로 적어 두며 스스로의 기억을 선명히 남겨 보세요.',
    question: '앞으로의 불확실함에만 시선을 두느라, 이미 내 손끝에 배어 있는 숙련과 경험을 과소평가하고 있지는 않나요?',
  },
  {
    motif: '오바의 산호 목걸이(Coral Regalia · 바다 건너온 산호처럼 귀한 인연과 책임을 조심스레 두름)',
    insight: '맡은 역할의 무게가 느껴질수록 거칠게 다루지 말고, 소중한 것을 다루듯 정갈하게 돌보아야 함',
    tone: '붉은 산호알이 고른 매듭으로 이어져 단정한 품격을 드러내는 예복의 결',
    ritual: '오늘 내가 맡은 책임이나 소중한 관계 하나를 급하게 처리하지 말고 한 단계 더 정성껏 다듬어 보세요.',
    question: '무게감 때문에 부담으로만 여겼던 역할 가운데 사실은 산호 목걸이처럼 정갈하게 돌볼 가치가 있는 것은 무엇인가요?',
  },
  {
    motif: '이요 성벽의 이중 해자(Benin Earthworks · 안의 질서를 지키기 위해 넉넉한 완충 공간을 두름)',
    insight: '마음을 지키는 경계는 남을 밀어내는 벽이 아니라, 소중한 일상을 보호하는 넉넉한 여백임',
    tone: '울창한 열대 숲의 그늘을 따라 길고 완만하게 이어진 흙 성벽과 잔잔한 물길',
    ritual: '오늘 일정과 일정 사이에 15분 이상의 완충 여백을 의도적으로 비워 두어 내 리듬을 보호해 보세요.',
    question: '지금 내 일상에서 남을 밀어내기 위해서가 아니라 나를 보호하기 위해 세워야 할 넉넉한 여백은 어디인가요?',
  },
  {
    motif: '진흙과 놋쇠의 호흡(Clay & Brass · 겉의 거푸집이 부서져야 안의 온전한 형상이 모습을 드러냄)',
    insight: '익숙한 방식이 깨지는 듯한 불편함은 본래의 단단한 모습이 드러나기 직전의 자연스러운 과정임',
    tone: '식은 거푸집을 조심스레 두드려 떼어내자 매끈한 청동 조각이 햇살을 받는 아침',
    ritual: '예전 방식이 더 이상 맞지 않는다고 느껴지는 일 하나를 찾아 오늘 새로운 순서로 시도해 보세요.',
    question: '불편하게만 느껴졌던 최근의 변화가 사실은 내 안의 단단한 형상을 드러내기 위해 겉 거푸집을 깨는 과정이라면 무엇일까요?',
  },
];

const TOPIC_AXES: Record<BeninObaTopic, string> = {
  career: '일·커리어에서는 오래 벼려 온 숙련을 믿고 20분간 흔들림 없이 초안을 붓는 장인의 몰입이 필요합니다.',
  relationship: '관계에서는 맡은 역할이나 소중한 인연을 급히 다루지 말고 산호 목걸이처럼 정갈하게 돌보세요.',
  wealth: '재정·계약에서는 그동안 지켜 온 성실한 기록을 바탕으로 서두르지 않고 분명한 매듭을 지으세요.',
  health: '건강·회복에서는 일정 사이에 15분 이상의 이중 해자 완충 여백을 비워 내 리듬을 보호하세요.',
  general: '오늘의 흐름에서는 에도 모티프와 동반 결을 함께 살피며 차분한 장인의 손길로 매듭을 다듬으세요.',
};

function classifyBeninTopic(question: string): BeninObaTopic {
  if (/일|직장|사업|커리어|프로젝트|성과|경험|매듭/.test(question)) return 'career';
  if (/사랑|연애|관계|가족|친구|갈등|인연/.test(question)) return 'relationship';
  if (/돈|재물|재정|투자|소비|계약/.test(question)) return 'wealth';
  if (/건강|몸|피로|휴식|수면|회복/.test(question)) return 'health';
  return 'general';
}

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculateBeninBronzeObaMemory(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): BeninBronzeObaResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const castingPhase = CASTING_PHASES[stableHash(`${seed}|phase`) % CASTING_PHASES.length];
  const shadowWarning = SHADOW_WARNINGS[stableHash(`${seed}|shadow`) % SHADOW_WARNINGS.length];
  const questionTopic = classifyBeninTopic(params.question ?? '');
  const shortPhase = castingPhase.split('(')[0].trim();
  const shortCompanion = companion.motif.split('(')[0].trim();
  const obaCrossAxis = `${shortPhase} × ${shortCompanion} — ${TOPIC_AXES[questionTopic]}`;

  return {
    engineVersion: 'LUCKEY-BENIN-OBA-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    edoMotif: picked.motif,
    companionMotif: companion.motif,
    castingPhase,
    obaCrossAxis,
    beninInsight: `${picked.insight} (동반 결: ${companion.motif})`,
    guildTone: picked.tone,
    shadowWarning,
    reflectionFocus: `베냉 브론즈·오바 궁정 기억의 '${castingPhase}' 국면에서 '${picked.motif}'와 동반 결 '${companion.motif}'을 함께 겹쳐, 그동안 쌓아 온 경험의 부조를 믿고 차분한 장인의 손길로 오늘의 한 매듭을 지어 보세요.`,
    ritualAction: `${picked.ritual} (동반 결: ${companion.motif})`,
    reflectiveQuestion: `${picked.question} '${castingPhase}' 흐름에서 지금 가장 정성껏 다듬을 매듭은 무엇인가요?`,
    interpretiveBoundary: '서아프리카 에도(베냉) 청동 주조 장인 길드·기억의 부조 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatBeninBronzeObaPrompt(res: BeninBronzeObaResult): string {
  return [
    `[베냉 브론즈·오바 궁정 기억 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 에도 모티프: ${res.edoMotif} (${res.guildTone})`,
    `- 동반 결: ${res.companionMotif}`,
    `- 주조 국면: ${res.castingPhase}`,
    `- 질문 맥락(${res.questionTopic}) 교차 축: ${res.obaCrossAxis}`,
    `- 중심 통찰: ${res.beninInsight}`,
    `- 과잉·경계 점검: ${res.shadowWarning}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

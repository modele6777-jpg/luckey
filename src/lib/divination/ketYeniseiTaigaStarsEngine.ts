import type { UserProfile } from '../sharedState';

export interface KetYeniseiResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: string;
  riverStarSign: string;
  companionSign: string;
  taigaCycleAxis: string;
  yeniseiInsight: string;
  taigaTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  shadowWarning: string;
  interpretiveBoundary: string;
}

const TAIGA_CYCLE_AXES = [
  '예니세이 대하 흐름 · 큰 방향 믿고 조급함 내려놓기',
  '일라임 별빛 흔적 · 발앞의 확실한 한 걸음 짚기',
  '일룸 계절 호흡 · 지금 내 체력과 계절 맞추기',
  '자작나무 북 박자 · 흩어진 생각 일정하게 가라앉히기',
] as const;

const SIGNS = [
  {
    sign: '예니세이의 긴 물길(Yenisei · 서두르지 않고 대륙을 가로질러 북극으로 가는 강)',
    insight: '오늘 당장 결판이 나지 않아도 큰 방향만 맞다면 시간은 내 편에서 묵묵히 흘러감',
    tone: '시베리아 타이가 침엽수림 사이로 넓고 깊게 흐르는 은빛 대하',
    ritual: '오늘 당장 결론이 나지 않은 일 하나는 큰 방향만 메모해 두고, 조급한 재촉을 하루만 내려놓아 보세요.',
    question: '지금 내가 조급히 결판을 내려고 애쓰고 있지만, 예니세이 강처럼 시간을 두면 자연히 제 길을 찾아갈 일은 무엇인가요?',
  },
  {
    sign: '일라임(Ilim · 별빛 아래 썰매와 길의 흔적을 읽는 맑은 시선)',
    insight: '어두워 보일수록 시야를 넓히기보다 지금 내 발앞의 선명한 흔적 하나에 집중하는 편이 정확함',
    tone: '눈 덮인 자작나무 숲 위로 차갑고 투명하게 빛나는 북방의 별자리',
    ritual: '막연한 불안이 커질수록 지금 내 발앞에 이미 찍혀 있는 확실한 사실 한 가지를 짚어 보세요.',
    question: '멀리 안개 낀 지평선 대신, 일라임의 별빛 아래 내 발앞에 가장 선명하게 드러나 있는 다음 한 걸음은 무엇인가요?',
  },
  {
    sign: '일룸(Ilum · 사계절의 순환을 거스르지 않는 숲의 호흡)',
    insight: '움츠려야 할 겨울과 뻗어 나가야 할 여름이 다르듯 지금 내 계절에 맞는 일만 해도 충분함',
    tone: '이른 봄 얼음이 풀리며 물소리가 되살아나는 고요한 숲속 지류',
    ritual: '지금 내 에너지 상태가 봄의 확장인지 겨울의 비축인지 먼저 살핀 뒤 오늘 일정의 강도를 조절해 보세요.',
    question: '남들의 계절과 비교하느라 무리하기보다, 지금 내 몸과 마음이 실제로 지나고 있는 계절에 맞는 일은 무엇인가요?',
  },
  {
    sign: '카스(Kas · 작지만 마르지 않는 맑은 곁가지 물줄기)',
    insight: '거대한 무대의 중심이 아니더라도 내 자리의 맑은 역할을 지키면 전체 흐름에 기여함',
    tone: '이끼 낀 바위 사이를 돌아 본류로 합류하는 투명한 산간 개울',
    ritual: '크게 드러나지 않더라도 오늘 내 자리에서 마르지 않고 이어지는 작고 맑은 기여 한 가지를 정성껏 해내 보세요.',
    question: '거대한 중심이 아니라는 이유로 작게 여겼지만, 사실은 전체 흐름을 맑게 지탱하고 있는 나만의 역할은 무엇인가요?',
  },
  {
    sign: '샤먼의 자작나무 북(Birch Drum · 흩어진 마음을 한 박자로 모으는 울림)',
    insight: '잡념이 많을 때는 머리로 따지기보다 일정한 호흡과 박자로 마음을 먼저 가라앉혀야 함',
    tone: '모닥불 온기가 감도는 밤, 나지막하고 규칙적으로 울리는 나무 소리',
    ritual: '오늘 잡념이 길어질 때, 3분만 눈을 감고 일정한 숨 박자에 귀를 기울이며 마음을 가라앉혀 보세요.',
    question: '머릿속의 복잡한 생각들을 잠시 멈추고 일정한 호흡의 북소리로 마음을 모았을 때 가장 먼저 고요해지는 고민은 무엇인가요?',
  },
];

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

export function calculateKetYeniseiTaigaStars(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): KetYeniseiResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % SIGNS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (SIGNS.length - 1));
  const picked = SIGNS[idx];
  const companion = SIGNS[(idx + companionOffset) % SIGNS.length];
  const taigaCycleAxis = TAIGA_CYCLE_AXES[stableHash(`${seed}|axis`) % TAIGA_CYCLE_AXES.length];
  const trimmedQ = (params.question ?? '').trim();
  const questionTopic = trimmedQ
    ? trimmedQ.slice(0, 36)
    : '큰 물길의 방향과 지금 내 계절 살피기';

  return {
    engineVersion: 'LUCKEY-KET-YENISEI-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    riverStarSign: picked.sign,
    companionSign: companion.sign,
    taigaCycleAxis,
    yeniseiInsight: `${picked.insight} (동반 징표: ${companion.sign})`,
    taigaTone: picked.tone,
    reflectionFocus: `질문 맥락('${questionTopic}')에서 예니세이·케트 타이가 지혜의 '${picked.sign}'와 타이가 순환 축('${taigaCycleAxis}')을 함께 살피며, 오늘 당장 모든 답을 재촉하기보다 큰 물길의 방향과 지금 내 계절을 차분히 살피세요.`,
    ritualAction: picked.ritual,
    reflectiveQuestion: picked.question,
    shadowWarning: '긴 물길과 계절의 순환을 기다린다는 이유로 오늘 내 발앞에서 당장 치워야 할 작은 걸림돌까지 방치하지 않도록 살피세요.',
    interpretiveBoundary: '시베리아 예니세이 유역 케트(Ket) 전통의 타이가 별빛·강물 순환 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatKetYeniseiPrompt(res: KetYeniseiResult): string {
  return [
    `[예니세이 케트·타이가 별하늘 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic}`,
    `- 북방 징표: ${res.riverStarSign} (${res.taigaTone})`,
    `- 동반 징표: ${res.companionSign}`,
    `- 타이가 순환 축: ${res.taigaCycleAxis}`,
    `- 중심 통찰: ${res.yeniseiInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

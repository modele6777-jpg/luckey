import type { UserProfile } from '../sharedState';

export interface LoziKuombokaResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '이동·전환' | '신호·협력' | '회복·휴식' | '쿠옴보카 전반';
  loziMotif: string;
  companionMotif: string;
  zambeziPathAxis: string;
  loziInsight: string;
  zambeziTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '물길에 맞춘 고지대 이동(Kuomboka · 강물이 차오르면 싸우지 않고 배를 띄워 높은 터로 옮김)',
    insight: '환경의 수위가 바뀔 때 옛 자리를 억지로 지키려 하기보다 물길을 타고 더 안전하고 높은 곳으로 옮겨야 함',
    tone: '잠비아 바로체 범람원 위로 아침 햇살이 퍼지며 하얀 바지선 나리콰니가 물길을 여는 풍경',
    action: '이미 상황이 달라졌는데도 관성으로 붙들고 있던 방식 하나를 오늘 과감히 더 높은 자리로 옮겨 보세요.',
    question: '수위가 이미 차올랐는데도 내가 여전히 물과 싸우며 버티고 있는 낡은 터는 어디인가요?',
  },
  {
    motif: '마옴바 북소리의 신호(Maoma Drum · 이동할 때가 되었음을 알리는 낮고 웅장한 북소리)',
    insight: '전환이 필요한 시점에는 혼자 머뭇거리지 말고 내 안에서 울리는 신호를 인정하고 출발해야 함',
    tone: '드넓은 강물 위로 일정하고 묵직한 북소리가 물결을 타고 멀리까지 퍼져 나가는 오전',
    action: '계속 미루고 있던 결정 하나에 오늘 분명한 출발 시각과 첫 행동을 정해 적어 보세요.',
    question: '이미 내 안에서 울리고 있는데도 내가 애써 못 들은 척 미루어 둔 변화의 신호는 무엇인가요?',
  },
  {
    motif: '범람이 남긴 기름진 흙(Floodplain Silt · 물이 빠진 자리마다 새 씨앗이 자랄 비옥한 땅이 남음)',
    insight: '지나간 위기나 큰 변화가 휩쓸고 간 자리에도, 잘 살펴보면 다음 계절을 키울 기름진 양분이 남아 있음',
    tone: '물이 천천히 물러간 초원 위로 푸른 새싹이 돋아나기 시작하는 따스한 낮',
    action: '최근의 번거로운 일이나 변화 속에서 내가 새롭게 얻은 경험·단서 한 가지를 오늘 메모로 건져 보세요.',
    question: '지나간 흔들림이 남긴 자리에서 다음 계절을 키울 기름진 흙처럼 다시 쓸 수 있는 배움은 무엇인가요?',
  },
  {
    motif: '함께 젓는 노의 박자(Paddlers in Unison · 수십 명의 노 젓는 이들이 한 호흡으로 배를 움직임)',
    insight: '큰 전환기를 건널 때는 혼자 힘으로 버티기보다 곁에 있는 이들과 박자를 맞추는 편이 훨씬 수월함',
    tone: '검은 줄무늬와 흰 줄무늬가 새겨진 긴 배 위로 노들이 물보라를 일으키며 나아가는 오후',
    action: '지금 진행 중인 일에서 곁의 사람과 일정이나 역할을 맞추는 짧은 확인 한 마디를 오늘 먼저 건네 보세요.',
    question: '혼자 속도를 내느라 숨이 찬 일 가운데 곁의 사람과 노 젓는 박자를 맞추면 훨씬 수월해질 일은 무엇인가요?',
  },
  {
    motif: '고지대 리물룽가의 휴식(Limulunga Rest · 새 터에 닿은 뒤 짐을 풀고 감사하며 숨을 고름)',
    insight: '어려운 이동을 무사히 마쳤다면 곧바로 다음 짐을 꾸리기 전에 도착한 자리에서 충분히 숨을 돌려야 함',
    tone: '높은 언덕 위 마을에 저녁 불빛이 켜지고 잔잔한 노래가 흐르는 평온한 황혼',
    action: '최근에 건너온 고비 하나를 떠올리며 오늘 저녁엔 다음 계획을 잠시 접고 15분만 온전히 숨을 고르세요.',
    question: '무사히 새 터에 닿았는데도 쉬지 못하고 다음 짐부터 꾸리느라 놓치고 있는 오늘의 안도는 무엇인가요?',
  },
];

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 16).replace('T', ' ')} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const LOZI_SHADOWS = [
  '물길을 타고 더 높은 터로 옮겨 가는 유연함 속에서도, 지금 당장 정리하고 인계해야 할 기존 책임까지 방치하지 마세요.',
  '변화의 북소리를 듣고 출발하는 결단은 좋으나, 주변의 준비 상태와 속도를 살피지 않고 혼자만 앞서가지 않도록 하세요.',
  '지나간 범람이 남긴 배움을 건지는 과정에서 이미 지난 물난리의 피로와 아쉬움까지 다시 끌어안지는 마세요.',
  '곁의 사람과 노 젓는 박자를 맞추려다 정작 내가 방향키를 잡아야 할 순간에 결정을 남에게 미루지 않도록 하세요.',
  '고지대 리물룽가에서 숨을 고르는 휴식이 길어져 다음 계절에 밭을 갈아야 할 출발 시점까지 놓치지는 마세요.',
];

function classifyLoziTopic(q: string): LoziKuombokaResult['questionTopic'] {
  if (/물길|이동|새 터|옮기|전환/.test(q)) return '이동·전환';
  if (/신호|북소리|박자|함께|협력/.test(q)) return '신호·협력';
  if (/휴식|숨|회복|배움|고비/.test(q)) return '회복·휴식';
  return '쿠옴보카 전반';
}

export function calculateLoziKuombokaFloodPath(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): LoziKuombokaResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyLoziTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const zambeziPathAxis = `${picked.motif.split('(')[0].trim()} ↔ ${companion.motif.split('(')[0].trim()} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-LOZI-KUOMBOKA-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    loziMotif: picked.motif,
    companionMotif: companion.motif,
    zambeziPathAxis,
    loziInsight: picked.insight,
    zambeziTone: picked.tone,
    reflectionFocus: `로지족 쿠옴보카의 '${picked.motif}'을 중심에 두고 '${companion.motif}'의 흐름을 함께 엮어, 계절과 수위가 바뀔 때 옛 자리를 억지로 붙들기보다 물길을 타고 새 터로 옮겨 보세요.`,
    ritualAction: picked.action,
    shadowWarning: LOZI_SHADOWS[idx],
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '잠비아 바로체 범람원 로지족의 쿠옴보카 물길 이동 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatLoziKuombokaPrompt(res: LoziKuombokaResult): string {
  return [
    `[로지·쿠옴보카 물길 이동 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 잠베지 이동 축: ${res.zambeziPathAxis}`,
    `- 쿠옴보카 모티프: ${res.loziMotif} (${res.zambeziTone})`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 중심 통찰: ${res.loziInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

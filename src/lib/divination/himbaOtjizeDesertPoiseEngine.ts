import type { UserProfile } from '../sharedState';

export interface HimbaOtjizeResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '보호·돌봄' | '기억·물줄기' | '가락·품위' | '사막 전반';
  himbaMotif: string;
  companionMotif: string;
  ochreHearthAxis: string;
  himbaInsight: string;
  desertTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '붉은 오트지제의 보호막(Otjize Ochre · 적토와 향유를 발라 뜨거운 사막의 햇빛과 건조함을 견딤)',
    insight: '거친 환경에 맞서 자신을 지키기 위해서는 날마다 나를 돌보고 보호하는 나만의 의식이 필요함',
    tone: '나미비아 카오코랜드의 붉은 대지 위로 이른 아침 햇살이 따뜻하게 번지는 들판',
    action: '오늘 스스로를 지키는 작은 돌봄(물 한 잔, 보습, 짧은 스트레칭)을 의식적으로 챙겨 보세요.',
    question: '거친 일정과 바깥 열기 속에서 오늘 내 마음을 보호해 줄 나만의 오트지제는 무엇인가요?',
  },
  {
    motif: '오쿠루오의 꺼지지 않는 불(Okuruwo Hearth · 가족과 조상의 기억이 이어지는 중앙의 묵묵한 불씨)',
    insight: '삶이 분주해질수록 나를 지탱해 온 뿌리와 소중한 사람들과의 연결을 잊지 말아야 함',
    tone: '마른 아카시아 나무 장작이 재 속에서 은은한 온기를 오래 간직하고 있는 저녁',
    action: '바쁜 하루 가운데서도 나를 지탱해 주는 소중한 사람 한 명에게 짧은 안부나 감사를 전해 보세요.',
    question: '분주함 속에서도 꺼뜨리지 않고 오래 지켜 가야 할 내 삶의 중심 불씨는 무엇인가요?',
  },
  {
    motif: '모래 강바닥의 숨은 물줄기(Ephemeral Riverbed · 겉은 마른 모래지만 조금만 파면 맑은 물이 흐름)',
    insight: '겉보기에 성과나 진전이 없는 시기에도 땅속에서는 조용히 다음 계절을 위한 물줄기가 흐르고 있음',
    tone: '하얀 모래 강바닥을 따라 초록빛 모파네 나무들이 줄지어 서 있는 고요한 오후',
    action: '성과가 바로 보이지 않는다고 조급해하지 말고 오늘 조용히 쌓아 둔 작은 노력 한 가지를 기록해 보세요.',
    question: '지금 겉으로는 마른 모래처럼 보이지만, 내 안에서 조용히 흐르고 있는 숨은 물줄기는 무엇인가요?',
  },
  {
    motif: '소 떼를 부르는 고유의 가락(Cattle Song · 각자의 이름과 걸음걸이를 기억해 부르는 다정한 노래)',
    insight: '해야 할 일들을 한꺼번에 몰아치기보다 하나하나 이름을 불러 주듯 차분히 대할 때 덜 지침',
    tone: '해 질 녘 붉은 먼지 사이로 차분하고 낮은 노랫소리가 바람을 타고 퍼지는 마을',
    action: '할 일 목록을 한꺼번에 밀어붙이기보다 지금 손에 쥔 일 하나의 이름과 리듬만 차분히 불러 주세요.',
    question: '한꺼번에 몰아치느라 제 이름과 걸음걸이를 잃어버리고 있던 오늘의 일은 무엇인가요?',
  },
  {
    motif: '에렘베 왕관의 위엄(Erembe Crest · 묵묵한 인내와 성숙이 쌓여 자연스럽게 갖추어지는 품위)',
    insight: '조급하게 자신을 증명하려 애쓰지 않아도, 하루하루를 성실히 건너면 그 품위가 저절로 드러남',
    tone: '넓은 사바나 지평선 너머로 황금빛 구름이 천천히 물러가는 고요한 황혼',
    action: '누군가에게 인정받으려 서두르기보다 오늘 하루 내 자리에서 묵묵히 지킨 태도 하나를 스스로 칭찬해 주세요.',
    question: '조급한 증명 대신 묵묵한 성실함이 쌓여 자연스럽게 드러나길 기다리는 내 안의 품위는 무엇인가요?',
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

const HIMBA_SHADOWS = [
  '나를 지키는 보호막을 두텁게 세우다 정작 따뜻한 바람과 새로운 인연이 드나들 창까지 닫지 마세요.',
  '중심의 불씨를 지키는 일에 마음을 쓰되 이미 식은 원망의 재까지 계속 끌어안고 있지는 마세요.',
  '땅속 숨은 물줄기를 믿고 기다리되, 지금 당장 메마른 겉흙에 물 한 바가지를 부어야 할 타이밍도 놓치지 마세요.',
  '각자의 이름을 다정히 부르는 사이에도 오늘 꼭 끝내야 할 전체 일정의 마감선과 우선순위는 분명히 세워 두세요.',
  '묵묵한 품위가 쌓이길 기다리는 동안에도 정당하게 말하고 요구해야 할 내 몫까지 삼키지는 마세요.',
];

function classifyHimbaTopic(q: string): HimbaOtjizeResult['questionTopic'] {
  if (/돌봄|보호|지키|건강|휴식/.test(q)) return '보호·돌봄';
  if (/기억|뿌리|불씨|물줄기|성과/.test(q)) return '기억·물줄기';
  if (/가락|품위|성실|리듬|인정/.test(q)) return '가락·품위';
  return '사막 전반';
}

export function calculateHimbaOtjizeDesertPoise(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): HimbaOtjizeResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyHimbaTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const ochreHearthAxis = `${picked.motif.split('(')[0].trim()} ↔ ${companion.motif.split('(')[0].trim()} (${questionTopic})`;
  const shadowWarning = HIMBA_SHADOWS[idx];

  return {
    engineVersion: 'LUCKEY-HIMBA-OTJIZE-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    himbaMotif: picked.motif,
    companionMotif: companion.motif,
    ochreHearthAxis,
    himbaInsight: picked.insight,
    desertTone: picked.tone,
    reflectionFocus: `힘바 오트지제의 '${picked.motif}'처럼, 겉으로 성과가 드러나지 않는 날에도 나를 지키는 돌봄의 의식과 숨은 물줄기를 믿어 보세요. (동반 결: ${companion.motif.split('(')[0].trim()})`,
    ritualAction: picked.action,
    shadowWarning,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '나미비아 힘바족의 오트지제 돌봄·오쿠루오 기억 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatHimbaOtjizePrompt(res: HimbaOtjizeResult): string {
  return [
    `[나미비아 힘바·오트지제 적토 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 적토·화덕 축: ${res.ochreHearthAxis}`,
    `- 힘바 모티프: ${res.himbaMotif} (${res.desertTone})`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 중심 통찰: ${res.himbaInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

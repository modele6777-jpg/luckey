import type { UserProfile } from '../sharedState';

export interface ZimbabweStoneResult {
  engineVersion: string;
  calculatedAtKst: string;
  zimbabweMotif: string;
  companionMotif: string;
  zimbabweInsight: string;
  graniteTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '모르타르 없는 화강암 돌담(Dry-Stone Wall · 시멘트 없이 돌의 모양과 무게만으로 천 년을 버팀)',
    insight: '억지 접착제나 과도한 통제 없이도 각자의 모서리와 무게가 알맞은 자리를 찾으면 가장 튼튼함',
    tone: '아프리카 고원 아침 햇살 아래, 회색 화강암 블록이 빈틈없이 맞물려 우뚝 선 그레이트 엔클로저',
    action: '관계나 일정에 억지 접착제를 바르기보다 각자 제 무게로 놓일 알맞은 자리부터 한 칸씩 맞춰 보세요.',
    question: '억지 시멘트로 굳혀 놓으려 해서 오히려 금이 가고 있는 관계나 계획은 무엇인가요?',
  },
  {
    motif: '원뿔형 석탑의 고요(Conical Tower · 지붕도 문도 없이 하늘을 향해 묵묵히 솟은 곡선)',
    insight: '모든 일에 당장 쓰임새나 설명을 달지 않아도, 묵묵히 쌓아 올린 존재감 자체가 방향이 됨',
    tone: '푸른 하늘과 초록 숲을 배경으로 둥근 돌탑이 묵직한 그림자를 드리운 낮',
    action: '당장 효용을 증명하려 애쓰기보다 오늘 묵묵히 쌓아 둔 한 단의 노력을 그대로 인정해 주세요.',
    question: '굳이 문이나 지붕을 달아 설명하지 않아도 이미 제 자리를 지키고 있는 내 안의 탑은 무엇인가요?',
  },
  {
    motif: '동석 새 조각의 시선(Soapstone Bird · 땅과 하늘 사이를 잇는 고요한 파수꾼)',
    insight: '당장 발밑의 돌멩이만 보지 말고 고개를 들어 전체 지형과 하늘의 기류를 함께 살펴야 함',
    tone: '부드러운 비누돌에 새겨진 새가 서늘한 바람을 맞으며 먼 지평선을 바라보는 오후',
    action: '눈앞의 자잘한 돌부리에 시선이 갇힐 때마다 고개를 들어 전체 지평선과 하늘의 흐름을 한 번 바라보세요.',
    question: '발밑의 돌멩이에 매달리느라 정작 놓치고 있던 먼 지평선의 기류는 무엇인가요?',
  },
  {
    motif: '갈매기 무늬의 테두리(Chevron Pattern · 성벽 위를 따라 흐르는 물결 모양의 장식)',
    insight: '단조롭고 무거운 일상 위에도 작은 리듬과 아름다움을 얹어야 숨통이 트임',
    tone: '성벽 꼭대기의 지그재그 돌무늬 위로 황금빛 석양이 천천히 걸리는 저녁',
    action: '무거운 의무만 쌓인 하루 끝에 작은 리듬과 아름다움을 얹어 줄 짧은 휴식 하나를 올려 두세요.',
    question: '단단하기만 한 내 성벽 위에 숨통을 틔워 줄 작은 갈매기 무늬는 무엇일까요?',
  },
  {
    motif: '좁은 평행 통로(Parallel Passage · 한 사람씩만 지날 수 있는 높고 서늘한 돌길)',
    insight: '여러 일을 한꺼번에 밀어붙이기보다 한 번에 한 걸음씩 조용히 통과하는 편이 안전함',
    tone: '양옆으로 높은 돌벽이 솟은 서늘한 통로 끝에 밝은 빛이 보이는 황혼',
    action: '오늘 한꺼번에 처리하려던 일 중 하나만 골라 좁은 통로를 지나듯 차분히 끝내 보세요.',
    question: '여러 일을 동시에 밀어넣다 막혀 있던 통로에서 지금 가장 먼저 비켜 주어야 할 일은 무엇인가요?',
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

export function calculateZimbabweGreatStoneWall(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ZimbabweStoneResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];

  return {
    engineVersion: 'LUCKEY-ZIMBABWE-STONE-v2.2.0',
    calculatedAtKst: formatKstIso(now),
    zimbabweMotif: picked.motif,
    companionMotif: companion.motif,
    zimbabweInsight: picked.insight,
    graniteTone: picked.tone,
    reflectionFocus: `그레이트 짐바브웨 돌담의 '${picked.motif}'처럼, 억지로 묶으려 하기보다 제 무게로 알맞게 맞물리는 자리를 찾아보세요. (동반 결: ${companion.motif.split('(')[0].trim()})`,
    ritualAction: picked.action,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '남부 아프리카 그레이트 짐바브웨의 무모르타르 화강암 건축 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatZimbabweStonePrompt(res: ZimbabweStoneResult): string {
  return [
    `[그레이트 짐바브웨·돌담 지혜 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 짐바브웨 모티프: ${res.zimbabweMotif} (${res.graniteTone})`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 중심 통찰: ${res.zimbabweInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

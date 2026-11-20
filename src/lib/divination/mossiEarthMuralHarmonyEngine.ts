import type { UserProfile } from '../sharedState';

export interface MossiMuralResult {
  engineVersion: string;
  calculatedAtKst: string;
  mossiMotif: string;
  mossiInsight: string;
  earthTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '티에벨레 흙벽의 기하학 무늬(Tiebele Geometry · 붉은 황토와 검은 숯, 흰 고령토로 벽에 질서를 그림)', insight: '소박한 재료라도 리듬과 규칙을 담아 반복해 칠하면 평범한 벽이 예술과 보호막이 됨', tone: '부르키나파소 사바나의 따스한 햇살 아래, 붉고 검은 선이 단정히 그려진 흙집 앞마당의 아침' },
  { motif: '손바닥으로 다진 외벽(Hand-Troweled Clay · 기계가 아니라 여러 사람의 손길이 겹쳐 벽을 매끈히 다짐)', insight: '혼자 완벽하게 해내려는 조급함 대신 함께 어우러져 다듬는 손길이 훨씬 오래가는 단단함을 만듦', tone: '이웃들이 나란히 앉아 흙벽을 매만지며 조용한 웃음소리를 나누는 오전' },
  { motif: '낮은 출입구와 둥근 처마(Low Threshold · 고개를 숙여야 들어갈 수 있는 작은 문으로 집 안을 지킴)', insight: '잠시 몸을 낮추고 겸손해질 줄 아는 태도가 오히려 내 안의 소중한 공간을 안전하게 지켜 줌', tone: '햇빛이 뜨거운 한낮, 낮은 흙문 너머로 서늘하고 아늑한 그늘이 드리운 낮' },
  { motif: '거북이 등껍질 상징(Tortoise Shell Pattern · 조급하지 않고 묵묵히 제 속도로 걸어가는 지혜)', insight: '남들보다 조금 늦어 보여도 내 등 위의 껍질과 속도를 믿고 한 걸음씩 가는 편이 결국 먼저 도착함', tone: '노을빛이 흙벽의 흰 선을 따라 따뜻하게 번지는 늦은 오후' },
  { motif: '비 오기 전 천연 수지 코팅(Nere Coating · 우기가 오기 전에 나무 열매 즙을 발라 벽화를 지킴)', insight: '큰 변화나 바쁜 계절이 닥치기 전에 미리 한 겹 보호막을 입혀 두면 마음이 흔들리지 않음', tone: '먼 지평선에서 비 구름이 몰려오기 전, 정갈히 마른 흙벽이 고요히 빛나는 저녁' },
];

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('Z', '+09:00 (KST)');
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculateMossiEarthMuralHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): MossiMuralResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-MOSSI-MURAL-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    mossiMotif: picked.motif,
    mossiInsight: picked.insight,
    earthTone: picked.tone,
    reflectionFocus: `티에벨레 모시 벽화의 '${picked.motif}'처럼, 소박한 일상에 반복되는 리듬과 미리 챙기는 보호막을 더해 보세요.`,
    ritualAction: '다가올 바쁜 일정 전에 나만의 작은 정리 루틴 하나를 미리 손질해 두세요.',
    reflectiveQuestion: '지금 내가 거창한 변화만 기다리느라 놓치고 있는, 매일 손으로 다질 수 있는 소박한 질서는 무엇인가요?',
    interpretiveBoundary: '서아프리카 부르키나파소 티에벨레 모시족의 황토 벽화·공동체 수공예 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatMossiMuralPrompt(res: MossiMuralResult): string {
  return [
    `[모시·황토 벽화 질서 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 모시 모티프: ${res.mossiMotif} (${res.earthTone})`,
    `- 중심 통찰: ${res.mossiInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

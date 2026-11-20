import type { UserProfile } from '../sharedState';

export interface ElamiteSusaResult {
  engineVersion: string;
  calculatedAtKst: string;
  susaMotif: string;
  elamiteInsight: string;
  chogaTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '초가 잔빌의 겹층 흙벽돌(Chogha Zanbil · 겉을 감싼 구운 벽돌이 속의 흙을 비바람에서 지킴)', insight: '유연하고 부드러운 속마음을 지키기 위해서는 바깥에 단단한 일상 루틴이라는 외벽이 필요함', tone: '황토빛 평원 위에 계단식 흙벽돌 층이 오후의 긴 그림자를 드리우며 묵묵히 서 있는 모습' },
  { motif: '카룬 강의 관개 수로(Karun Canal · 메마른 들판으로 물을 나누어 보내며 숲을 이룸)', insight: '한곳에 고여 있으면 썩거나 넘치기 쉽지만, 필요한 곳으로 조금씩 나누어 보내면 모두가 살아남', tone: '갈대밭 사이로 맑은 물길이 잔잔하게 갈라지며 흙내음을 깨우는 아침' },
  { motif: '수사의 원통 인장(Cylinder Seal · 젖은 점토 위로 한 바퀴 굴리면 온전한 이야기가 새겨짐)', insight: '단 한 번의 큰 결심보다 매일 같은 결로 한 바퀴씩 굴리는 꾸준한 태도가 선명한 흔적을 남김', tone: '부드러운 점토판 위로 돌 인장이 지나가며 정교한 숲과 사슴 무늬를 남기는 작업대' },
  { motif: '엘람의 아치형 통로(Vaulted Passage · 무거운 지붕의 무게를 곡선으로 흘려보냄)', insight: '어깨에 얹힌 부담을 정면으로만 버티지 말고, 곡선처럼 분산해 흘려보내는 지혜가 필요함', tone: '두꺼운 벽돌 아치 아래 서늘한 그늘과 햇살이 교차하는 고요한 회랑' },
  { motif: '자그로스 산기슭의 샘(Zagros Spring · 바위 틈에서 솟아올라 평원의 더위를 식힘)', insight: '바깥의 열기가 거칠수록 내 안의 작은 샘물 하나를 마르지 않게 돌보는 일이 가장 중요함', tone: '붉은 바위 언덕 아래 맑은 샘물이 돌확에 고여 하늘을 비추는 정오' },
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

export function calculateElamiteSusaWaterChoga(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ElamiteSusaResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-ELAMITE-SUSA-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    susaMotif: picked.motif,
    elamiteInsight: picked.insight,
    chogaTone: picked.tone,
    reflectionFocus: `엘람 수사·초가 잔빌의 '${picked.motif}'처럼, 부드러운 속마음을 지켜 주는 단단한 일상 루틴을 차분히 다져 보세요.`,
    ritualAction: '오늘 나를 지치게 하는 일의 무게를 혼자 다 받지 말고, 순서를 나누거나 아치처럼 부담을 분산해 보세요.',
    reflectiveQuestion: '지금 내 마음의 점토판에 매일 한 바퀴씩 조용히 새기고 싶은 나만의 결은 무엇인가요?',
    interpretiveBoundary: '고대 엘람·수사의 초가 잔빌 지구라트와 수로 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatElamiteSusaPrompt(res: ElamiteSusaResult): string {
  return [
    `[엘람 수사·수로 정원 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 수사 모티프: ${res.susaMotif} (${res.chogaTone})`,
    `- 중심 통찰: ${res.elamiteInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

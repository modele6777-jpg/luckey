import type { UserProfile } from '../sharedState';

export interface HungarianTaltosResult {
  engineVersion: string;
  calculatedAtKst: string;
  treeRealm: string;
  companionRealm: string;
  leapInsight: string;
  steppeTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const REALMS = [
  {
    realm: '하늘 닿는 세계수(Égig érő fa) 등반',
    insight: '익숙한 지면의 걱정에서 한 층 위로 올라가 전체 풍경을 조망하는 용기',
    tone: '푸스타 초원 위 맑은 하늘',
    action: '잠시 창밖이나 먼 하늘을 30초간 바라보며, 지금 고민이 1년 뒤에도 클지 가만히 가늠해 보세요.',
    question: '지금 내가 놓지 못하고 붙잡고 있는 작은 걱정 너머로, 정말 오르고 싶은 다음 계단은 무엇인가요?',
  },
  {
    realm: '황금 사슴(Csodaszarvas)의 안내',
    insight: '억지로 길을 뚫기보다 내 눈앞에 반짝이는 호기심의 흔적을 따라가 보기',
    tone: '새벽 숲을 가로지르는 빛줄기',
    action: '억지로 밀어붙이던 계획 옆에, 오늘 내 눈을 반짝이게 만든 작은 호기심 한 줄을 따로 적어 두세요.',
    question: '힘으로만 뚫으려 애쓰느라 정작 내 앞에서 반짝이고 있던 호기심의 발자국은 무엇이었나요?',
  },
  {
    realm: '탈토시(Táltos)의 맑은 깨달음',
    insight: '남들의 시끄러운 기준이 아니라 내 안의 직관이 가리키는 진실한 신호 알아차리기',
    tone: '카르파티아 산맥의 청명한 공기',
    action: '주변의 의견을 더 모으기 전에 3분만 침묵하며, 내 속마음이 이미 알고 있는 답 한 가지를 적어 보세요.',
    question: '시끄러운 바깥 기준을 끄고 나면 내 안의 직관이 가장 먼저 가리키는 진실은 무엇인가요?',
  },
  {
    realm: '투룰(Turul) 매의 넓은 시야',
    insight: '사소한 흠집에 매몰되지 않고 내가 날아가려는 먼 목적지를 다시 확인하기',
    tone: '높은 구름 위의 고요한 활공',
    action: '오늘 거슬렸던 사소한 흠집 하나를 확대하지 말고, 내가 가려는 큰 방향 한 문장만 다시 확인해 보세요.',
    question: '발밑의 작은 돌부리에 시선을 뺏기느라 정작 놓치고 있던 나의 먼 목적지는 어디인가요?',
  },
  {
    realm: '세 계단의 지혜 열매',
    insight: '크게 한 번에 바꾸려 하지 않고 눈앞의 한 계단씩 오르는 단단한 성실함',
    tone: '황금빛 나뭇잎의 속삭임',
    action: '전체를 한꺼번에 끝내려는 부담을 내려놓고, 오늘 밟을 수 있는 첫 번째 계단 한 칸만 완료해 보세요.',
    question: '한 번에 정상에 오르려는 조급함을 내려놓는다면, 오늘 바로 딛고 올라설 첫 계단은 무엇인가요?',
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

export function calculateHungarianTaltosTreeOfLife(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): HungarianTaltosResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % REALMS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (REALMS.length - 1));
  const picked = REALMS[idx];
  const companion = REALMS[(idx + companionOffset) % REALMS.length];

  return {
    engineVersion: 'LUCKEY-HUNGARIAN-TALTOS-v2.2.0',
    calculatedAtKst: formatKstIso(now),
    treeRealm: picked.realm,
    companionRealm: companion.realm,
    leapInsight: picked.insight,
    steppeTone: picked.tone,
    reflectionFocus: `'${picked.realm}'의 시선처럼, 지금 갇혀 있던 작은 틀에서 한 뼘만 위로 시선을 올려 보세요. (동반 결: ${companion.realm.split('(')[0].trim()})`,
    ritualAction: picked.action,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '헝가리 탈토시(Táltos)와 하늘 닿는 세계수 설화를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatHungarianTaltosPrompt(res: HungarianTaltosResult): string {
  return [
    `[헝가리 탈토시 세계수 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 세계수 층위: ${res.treeRealm} (${res.steppeTone})`,
    `- 동반 층위: ${res.companionRealm}`,
    `- 중심 통찰: ${res.leapInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

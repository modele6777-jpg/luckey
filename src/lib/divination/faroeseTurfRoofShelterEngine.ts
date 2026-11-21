import type { UserProfile } from '../sharedState';

export interface FaroeseTurfResult {
  engineVersion: string;
  calculatedAtKst: string;
  faroeseMotif: string;
  companionMotif: string;
  faroeseInsight: string;
  atlanticTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '잔디 지붕의 포용(Turf Roof · 비바람을 밀어내지 않고 지붕 위 잔디로 껴안아 초록을 틔움)',
    insight: '거친 날씨와 감정을 억지로 튕겨내려 하기보다 내 지붕 위 흙으로 받아들이면 오히려 단열이 됨',
    tone: '북대서양 페로 제도 바가르 섬, 검은 나무 오두막 지붕 위의 이슬 젖은 초록 풀밭',
    ritual: '오늘 거친 감정이나 변수를 억지로 밀어내지 말고, 내 일상을 감싸는 완충지대로 받아들여 보세요.',
    question: '지금 나에게 필요한 것은 맑은 날씨가 아니라, 흐린 날에도 따뜻함을 지키는 나만의 풀지붕은 아닐까요?',
  },
  {
    motif: '안개 속 돌무더기 이정표(Vardi Cairns · 안개가 짙은 고원 길에서 다음 돌탑이 보일 만큼만 안내함)',
    insight: '목적지 전체가 한눈에 보이지 않아도 지금 내 앞에 선 돌무더기 하나만 보고 걸으면 길을 잃지 않음',
    tone: '구름이 낮게 내려앉은 이끼 언덕 능선을 따라 일정한 간격으로 서 있는 회색 돌탑들',
    ritual: '오늘 1년 뒤까지 전부 내다보려 애쓰기보다, 바로 다음 돌무더기까지 갈 수 있는 한 가지 선택만 정해 보세요.',
    question: '먼 목적지 전체가 보이지 않을 때, 오늘 내 눈앞에 선 첫 번째 돌무더기 이정표는 무엇인가요?',
  },
  {
    motif: '양털 스웨터의 기름기(Lanolin Wool · 씻어내지 않은 천연 기름기가 바닷물과 습기를 막아 줌)',
    insight: '남들처럼 매끈해 보이려고 내 본래의 거친 성정을 다 씻어 내면 정작 추운 날 나를 지킬 힘이 사라짐',
    tone: '차가운 바닷바람이 부는 절벽 아래, 포근한 무채색 양털 목도리가 목을 감싸는 정오',
    ritual: '남에게 매끈해 보이려 내 고유의 성정이나 속도를 다듬어 없애기보다, 나를 지키는 본래 결을 남겨 두세요.',
    question: '남들 기준에 맞추려고 지워 버릴 뻔했지만, 사실은 찬 바람을 막아 주던 나만의 천연 성정은 무엇인가요?',
  },
  {
    motif: '회색 바다의 절벽 폭포(Múlafossur · 바다가 아무리 높게 부딪쳐도 절벽의 물줄기는 제 갈 길을 감)',
    insight: '주변의 파도가 시끄럽게 흔들려도 내가 위에서 아래로 흘려보내야 할 고유한 물줄기는 끊기지 않음',
    tone: '초록 절벽 끝에서 짙푸른 대서양 바다로 하얀 물보라가 곧장 떨어지는 오후',
    ritual: '주변의 시끄러운 반응과 상관없이 오늘 내가 묵묵히 흘려보내야 할 내 일의 물줄기를 한 줄 지켜 보세요.',
    question: '바깥의 파도가 아무리 높아도 내가 위에서 아래로 꾸준히 흘려보내고 싶은 내 안의 물줄기는 무엇인가요?',
  },
  {
    motif: '아궁이의 둥근 빵과 차(Kaffi & Rúgbrauð · 밖이 흐릴수록 집 안의 따뜻한 김이 더 선명해짐)',
    insight: '바깥 세상의 날씨가 흐리다는 사실이 내 마음의 부엌까지 어두워져야 할 이유는 되지 않음',
    tone: '창밖으로 빗방울이 맺히는 저녁, 나무 식탁 위에 김이 모락모락 오르는 따뜻한 찻잔',
    ritual: '바깥 상황이 흐릴수록 오늘 저녁엔 따뜻한 차 한 잔과 소박한 온기로 내 마음의 부엌을 먼저 데워 주세요.',
    question: '바깥 날씨가 흐리다는 이유로 덩달아 식혀 두고 있던 내 마음의 따뜻한 부엌은 어디인가요?',
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

export function calculateFaroeseTurfRoofShelter(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): FaroeseTurfResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];

  return {
    engineVersion: 'LUCKEY-FAROESE-TURF-v2.2.0',
    calculatedAtKst: formatKstIso(now),
    faroeseMotif: picked.motif,
    companionMotif: companion.motif,
    faroeseInsight: picked.insight,
    atlanticTone: picked.tone,
    reflectionFocus: `페로 제도 풀지붕의 '${picked.motif}'과 동반 결 '${companion.motif}'을 함께 헤아리며, 짙은 안개 속에서도 당장 눈앞에 보이는 돌무더기 하나만큼의 걸음만 믿어 보세요.`,
    ritualAction: picked.ritual,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '북대서양 페로 제도의 잔디 지붕 건축과 바르디 돌무더기 길잡이 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatFaroeseTurfPrompt(res: FaroeseTurfResult): string {
  return [
    `[페로·풀지붕 안식 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 페로 모티프: ${res.faroeseMotif} (${res.atlanticTone})`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 중심 통찰: ${res.faroeseInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

import type { UserProfile } from '../sharedState';

export type SakhaQuestionTopic = 'career' | 'relationship' | 'wealth' | 'health' | 'decision' | 'general';

export interface SakhaOlonkhoResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: SakhaQuestionTopic;
  worldPillar: string;
  companionPillar: string;
  olonkhoInsight: string;
  lenaTone: string;
  worldAxisBreath: string;
  sakhaCrossAxis: string;
  shadowWarning: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PILLARS = [
  {
    pillar: '아알 루욱 마스(Aal Luuk Mas · 세 세계를 잇는 거대한 자작나무)',
    insight: '과거의 뿌리와 현재의 줄기, 내일의 가지가 한 몸처럼 이어져 있음을 신뢰하는 안정감',
    tone: '레나 강변 설원 위에 뿌리를 내린 은빛 자작나무',
    ritual: '오늘 내 몸과 마음의 뿌리를 지탱해 줄 작은 돌봄(따뜻한 물, 짧은 스트레칭, 정돈) 한 가지를 먼저 해 주세요.',
    question: '지금 내가 미래의 가지에만 매달리느라 소홀히 하고 있는 오늘의 단단한 뿌리는 무엇인가요?',
  },
  {
    pillar: '오르토 도이두(Orto Doidu · 지금 발 딛고 선 중간 세계)',
    insight: '먼 이상이나 두려움에 마음을 빼앗기지 않고 오늘 내 눈앞의 현실을 성실히 돌보는 감각',
    tone: '짧지만 찬란한 시베리아 여름 초원의 야생화 물결',
    ritual: '오늘 내 눈앞에 놓인 가장 현실적인 할 일 하나를 15분만 성실히 손봐서 매듭지어 보세요.',
    question: '먼 이상이나 두려움에 마음을 빼앗기기보다, 지금 발 딛고 선 오르토 도이두의 오늘에서 돌봐야 할 일은 무엇인가요?',
  },
  {
    pillar: '위뢰윙 아이으 토욘(Ürüng Aiyy Toyon · 맑은 빛과 질서의 원리)',
    insight: '어지러운 생각들을 억지로 싸워 이기기보다 밝고 정갈한 질서 하나로 정리하는 지혜',
    tone: '혹한을 뚫고 떠오르는 북극권 정오의 투명한 태양',
    ritual: '책상이나 메모장 한 구역을 3분만 정갈하게 정리하며 어지러운 생각을 가라앉혀 보세요.',
    question: '억지로 싸워 이기려 하기보다 밝고 정갈한 질서 하나만 세우면 저절로 가라앉을 고민은 무엇인가요?',
  },
  {
    pillar: '호무스(Khomus · 마음을 여는 구금의 울림)',
    insight: '굳어 있던 감정의 매듭이 작은 휴식과 음악 한 소절로 부드럽게 풀리는 전환점',
    tone: '겨울 밤 따뜻한 통나무 집 안에서 울리는 호무스의 공명',
    ritual: '잠시 화면에서 눈을 떼고 좋아하는 음악 한 곡이나 조용한 호흡으로 굳은 어깨를 풀어 보세요.',
    question: '굳어 있던 감정의 매듭을 억지로 풀기보다, 작은 휴식과 호흡으로 부드럽게 녹여 주고 싶은 부분은 어디인가요?',
  },
  {
    pillar: '이흐야흐(Yhyakh · 새해를 여는 둥근 원무)',
    insight: '지난 시간의 고단함을 털어내고 오늘부터 다시 시작할 수 있는 환대와 재생의 힘',
    tone: '백야의 밝은 하늘 아래 손을 맞잡고 도는 사람들의 원',
    ritual: '지나간 아쉬움은 오늘 자정에 내려놓고, 나 자신이나 가까운 사람에게 따뜻한 한마디를 건네 보세요.',
    question: '지난 시간의 고단함을 털어내고 이흐야흐의 원무처럼 새롭게 다시 시작할 수 있는 마음의 다짐은 무엇인가요?',
  },
];

function classifySakhaTopic(question?: string): SakhaQuestionTopic {
  const q = (question ?? '').trim();
  if (/이직|직장|사업|승진|일|커리어|프로젝트|업무/.test(q)) return 'career';
  if (/연애|결혼|사람|관계|가족|갈등|친구|이별|소통/.test(q)) return 'relationship';
  if (/돈|재물|투자|재정|수입|지출|계약|매매/.test(q)) return 'wealth';
  if (/건강|몸|마음|휴식|수면|피로|회복|뿌리/.test(q)) return 'health';
  if (/결정|선택|고민|방향|시작/.test(q)) return 'decision';
  return 'general';
}

const SAKHA_TOPIC_WARNINGS: Record<SakhaQuestionTopic, string> = {
  career: '일과 성취의 윗가지(확장)에만 힘을 쏟느라 오늘 몸과 루틴의 뿌리(안정)가 마르지 않도록 살피십시오.',
  relationship: '상대와 원무를 맞추려다 나 자신의 중심 줄기까지 흔들리지 않도록 고요한 내면의 틈을 남겨 두십시오.',
  wealth: '먼 결실의 계산에만 매달리지 말고 지금 발 딛고 선 중간 세계(오르토 도이두)의 현실 자원을 먼저 정돈하십시오.',
  health: '회복과 휴식에 머물면서도 오늘 나를 깨어 있게 하는 작은 리듬 1가지는 손에서 놓지 마십시오.',
  decision: '완벽한 빛의 질서를 기다리다 정작 지금 옮겨야 할 작은 한 걸음까지 미루지 마십시오.',
  general: '한 세계의 기준에만 치우쳐 뿌리(안정)와 가지(확장)의 균형을 잃지 않도록 살피십시오.',
};

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

export function calculateSakhaOlonkhoThreeWorlds(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SakhaOlonkhoResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PILLARS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (PILLARS.length - 1));
  const picked = PILLARS[idx];
  const companion = PILLARS[(idx + companionOffset) % PILLARS.length];
  const questionTopic = classifySakhaTopic(params.question);
  const worldAxisBreath = `${picked.pillar.split('(')[0].trim()} ↔ ${companion.pillar.split('(')[0].trim()} 세 세계 공명`;
  const sakhaCrossAxis = `${questionTopic} · ${picked.pillar.split('(')[0].trim()} × ${companion.pillar.split('(')[0].trim()}`;
  const shadowWarning = `[${picked.pillar.split('(')[0].trim()} 과잉 경계] ${SAKHA_TOPIC_WARNINGS[questionTopic]}`;

  return {
    engineVersion: 'LUCKEY-SAKHA-OLONKHO-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    worldPillar: picked.pillar,
    companionPillar: companion.pillar,
    olonkhoInsight: `${picked.insight} (동반 기둥: ${companion.pillar})`,
    lenaTone: picked.tone,
    worldAxisBreath,
    sakhaCrossAxis,
    shadowWarning,
    reflectionFocus: `시베리아 사하 올론호의 '${picked.pillar}'와 동반 기둥 '${companion.pillar}'처럼, 뿌리(기반)와 가지(목표) 사이의 중심을 지금 내가 서 있는 오늘에 두어 보세요.`,
    ritualAction: picked.ritual,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '시베리아 사하(야쿠트) 전통의 올론호(Olonkho) 세계수와 세 세계 균형 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatSakhaOlonkhoPrompt(res: SakhaOlonkhoResult): string {
  return [
    `[사하 올론호 세 세계 균형 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst} | 질문 맥락: ${res.questionTopic}`,
    `- 세계수 기둥: ${res.worldPillar} (${res.lenaTone})`,
    `- 동반 기둥: ${res.companionPillar}`,
    `- 세 세계 공명 축: ${res.worldAxisBreath}`,
    `- 맥락 교차 축: ${res.sakhaCrossAxis}`,
    `- 중심 통찰: ${res.olonkhoInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

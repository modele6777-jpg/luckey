import type { UserProfile } from '../sharedState';

export interface GoryeoCeladonResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '여백·절제' | '기다림·인내' | '유연·호흡' | '비색 전반';
  celadonCraft: string;
  companionCraft: string;
  celadonKilnAxis: string;
  goryeoCrossAxis: string;
  topicBalanceHint: string;
  goryeoInsight: string;
  jadeTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const CRAFTS = [
  {
    craft: '상감 기법(Inlay · 먼저 나를 비워 홈을 파야 비로소 다른 빛이 스며듦)',
    insight: '새 것을 덧칠하기만 하면 들뜨고 마니, 내 안에 작은 여백을 먼저 파내는 절제가 아름다움을 만듦',
    tone: '맑은 비색 바탕 위로 백토와 흑토의 학이 고요히 날아오르는 고려 청자 매병',
    action: '오늘 꽉 차 있는 일정이나 생각 중에서 딱 한 칸만 비워 두고, 아무것도 채우지 않는 여백의 시간을 허락해 주세요.',
    question: '지금 내 삶에 새로운 것을 덧칠하려 들기 전에, 상감 기법처럼 먼저 비워 내야 더 빛이 날 자리는 어디인가요?',
  },
  {
    craft: '비색 유약(Jade Glaze · 억지 화려함 대신 맑은 물빛의 깊이를 빚음)',
    insight: '남의 시선을 단번에 끌려는 과장보다 오래 볼수록 마음이 편안해지는 진정성이 오래감',
    tone: '비 갠 뒤 가을 하늘을 그대로 담아낸 듯 은은하고 투명한 청자의 푸른빛',
    action: '겉으로 눈에 띄는 장식을 줄이고, 오늘 건네는 말이나 작업에서 가장 담백하고 맑은 결만 남겨 보세요.',
    question: '남의 시선을 단번에 끌려 애쓰기보다, 오래 볼수록 편안한 비색처럼 지켜 가고 싶은 내 태도는 무엇인가요?',
  },
  {
    craft: '강진 가마의 기다림(Kiln Patience · 불을 끈 뒤 식어 내리는 밤을 견딤)',
    insight: '일을 마쳤다고 바로 열어 보며 조바심내기보다 열기가 자연스레 식어 굳기를 기다려야 함',
    tone: '남해 바닷바람이 스치는 강진 도요지 가마 밖의 고요한 새벽 공기',
    action: '답이나 결과를 당장 확인하려 들지 말고, 하루쯤 열기가 식어 자리 잡기를 기다리는 여유를 두세요.',
    question: '지금 내가 가마가 식기도 전에 서둘러 문을 열려 해서 오히려 금이 가게 만들고 있는 일은 무엇인가요?',
  },
  {
    craft: '표주박의 곡선(Gourd Curve · 모나지 않고 둥글게 품어 안는 선)',
    insight: '원칙을 지키되 타인과 나를 대하는 태도에는 둥근 여백을 남겨야 부딪힘이 줄어듦',
    tone: '어깨에서 허리까지 물 흐르듯 부드럽게 이어지는 청자 주전자의 유려한 선',
    action: '나 자신이나 타인을 날카롭게 몰아세우는 문장을 하나 골라, 둥글고 부드러운 표현으로 바꿔 말해 보세요.',
    question: '원칙을 지킨다는 이유로 지나치게 모를 세워서 부딪힘을 키우고 있던 관계나 일은 어디인가요?',
  },
  {
    craft: '투각의 바람구멍(Openwork · 뚫어 놓은 빈틈 사이로 향기와 빛이 통함)',
    insight: '빈틈없이 꽉 채운 계획보다 숨이 드나들 수 있는 구멍 하나가 전체를 살려 냄',
    tone: '연꽃 잎 사이사이 섬세하게 뚫린 틈새로 은은한 향이 피어오르는 향로 뚜껑',
    action: '오늘 계획표에 숨이 드나들 수 있는 15분의 완충 시간을 한 군데 미리 뚫어 두세요.',
    question: '빈틈없이 채우려다 오히려 답답해진 내 하루에서 바람구멍을 내어 주어야 할 곳은 어디인가요?',
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

const GORYEO_SHADOWS = [
  '여백을 파내는 절제에 집중하다 지금 꼭 채워야 할 핵심 약속과 일상의 기둥까지 비워 두지 마세요.',
  '담백한 맑음을 지키려다 꼭 드러내야 할 나만의 선명한 의사와 기준까지 흐릿하게 남기지 않도록 살피세요.',
  '가마가 식기를 기다리는 여유 속에서도 이미 식어 굳은 뒤 바로 꺼내 다듬어야 할 타이밍은 놓치지 마세요.',
  '둥글고 부드러운 여백을 남기려다 꼭 바로잡아야 할 원칙적 선까지 무르게 넘기지 않도록 주의하세요.',
  '숨구멍과 완충 시간을 내는 데만 신경 쓰다 전체 그릇을 지탱하는 단단한 뼈대와 마감까지 느슨하게 두지 마세요.',
];

const GORYEO_TOPIC_HINTS: Record<GoryeoCeladonResult['questionTopic'], string> = {
  '여백·절제': '비워 낸 여백이 허전함이 되지 않도록 꼭 지켜야 할 핵심 약속 하나만 또렷이 남겨 두세요.',
  '기다림·인내': '가마가 식기를 기다리는 여유 속에서도 꺼내 다듬어야 할 타이밍을 놓치지 않는 균형이 필요합니다.',
  '유연·호흡': '부드러운 곡선으로 부딪힘을 줄이되 내 마음의 중심 선까지 흐려지지 않도록 살피세요.',
  '비색 전반': '비우는 절제와 채우는 정성이 어우러질 때 비색의 깊이가 자연스레 살아납니다.',
};

function classifyGoryeoTopic(q: string): GoryeoCeladonResult['questionTopic'] {
  if (/여백|절제|비움|숨구멍|덧칠/.test(q)) return '여백·절제';
  if (/기다림|조바심|식힘|가마|결과/.test(q)) return '기다림·인내';
  if (/유연|호흡|관계|표현|곡선/.test(q)) return '유연·호흡';
  return '비색 전반';
}

export function calculateGoryeoCeladonInlayClarity(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): GoryeoCeladonResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyGoryeoTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % CRAFTS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (CRAFTS.length - 1));
  const picked = CRAFTS[idx];
  const companion = CRAFTS[(idx + companionOffset) % CRAFTS.length];
  const celadonKilnAxis = `${picked.craft.split('(')[0].trim()} ↔ ${companion.craft.split('(')[0].trim()} (${questionTopic})`;
  const topicBalanceHint = GORYEO_TOPIC_HINTS[questionTopic];
  const shadowWarning = GORYEO_SHADOWS[idx];

  const calculatedAtKst = formatKstIso(now);
  const goryeoCrossAxis = `[${picked.craft.split('(')[0].trim()}] × [${companion.craft.split('(')[0].trim()}] × [${questionTopic}] × [${calculatedAtKst.slice(11, 16)}]`;

  return {
    engineVersion: 'LUCKEY-GORYEO-CELADON-v2.5.0',
    calculatedAtKst,
    questionTopic,
    celadonCraft: picked.craft,
    companionCraft: companion.craft,
    celadonKilnAxis,
    goryeoCrossAxis,
    topicBalanceHint,
    goryeoInsight: picked.insight,
    jadeTone: picked.tone,
    reflectionFocus: `고려 청자 비색·상감 지혜의 '${picked.craft}'처럼, 억지로 더 채우기보다 마음의 홈을 비워 여백과 숨구멍을 먼저 마련해 보세요. (동반 결: ${companion.craft.split('(')[0].trim()})`,
    ritualAction: picked.action,
    shadowWarning,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '한국 고려 청자의 비색·상감 여백 미학과 도공의 기다림을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatGoryeoCeladonPrompt(res: GoryeoCeladonResult): string {
  return [
    `[고려 청자·비색 상감 여백 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 비색·가마 축: ${res.celadonKilnAxis}`,
    `- 4중 교차 축: ${res.goryeoCrossAxis}`,
    `- 맥락 균형 조언: ${res.topicBalanceHint}`,
    `- 청자 기법: ${res.celadonCraft} (${res.jadeTone})`,
    `- 동반 기법: ${res.companionCraft}`,
    `- 중심 통찰: ${res.goryeoInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

import { getTodayDateKey } from '@/lib/dailyCache';
import { safeLocalStorage } from '@/utils/safeStorage';
import { invokeLLMStructured } from '@/lib/ai';
import { z } from 'zod';

export interface TodayLucyPersonaData {
  id: string;
  dateKey: string;
  headline: string;
  message: string;
  actionTip: string;
  tagline: string;
  vibe: string;
  source: 'ai_generated' | 'cached' | 'curated';
  updatedAt: number;
}

const STORAGE_PREFIX = 'prism_lucy_today_persona_';

export const LUCY_PERSONA_DAILY_PRESETS: Array<{
  headline: string;
  message: string;
  actionTip: string;
  vibe: string;
}> = [
  {
    headline: "진짜 중요한 건 마음의 중심이야",
    message: "주변의 시선이나 조급함에 흔들리지 마. 네가 지금 서 있는 이곳이 우주의 정중앙이고, 네 호흡이 가장 확실한 나침반이야. 오늘 일어나는 모든 일은 널 단련시키는 다정한 파도일 뿐이야.",
    actionTip: "바깥 소음이 커질 땐 1분간 눈을 감고 심장박동 소리에 집중해 봐.",
    vibe: "평온과 중심",
  },
  {
    headline: "완벽하지 않아도 이미 충분해",
    message: "모든 걸 오늘 다 끝내려 애쓰지 않아도 돼. 달도 차오르는 시간이 필요하듯이, 네가 기울인 작은 정성들은 보이지 않는 곳에서 뿌리를 내리고 있어. 너 자신에게 조금 더 너그러워지자.",
    actionTip: "스스로에게 '오늘도 참 애썼다'고 다정하게 한마디 건네줘.",
    vibe: "자기자비와 위로",
  },
  {
    headline: "마음속 의심을 확신으로 바꿔봐",
    message: "망설여지던 일이 있다면 오늘 작게 첫 발을 떼어봐. 길은 걷기 시작할 때 비로소 발밑에 생겨나는 법이야. 네 안에는 네가 상상하는 것보다 훨씬 단단한 지혜가 숨어 있어.",
    actionTip: "미뤄뒀던 일 중 가장 가벼운 1가지를 지금 3분 안에 해치우기.",
    vibe: "용기와 결단",
  },
  {
    headline: "가슴에 차오르는 영감을 믿어",
    message: "머리로 계산하지 말고 네 직관이 가리키는 방향을 따라가 봐. 우연처럼 스쳐 지나간 생각 하나가 네 삶의 물꼬를 완전히 바꿀 수 있어. 루시가 네 영감의 불씨를 지켜줄게.",
    actionTip: "떠오르는 기분 좋은 영감이나 단어를 메모장에 한 줄 적어두기.",
    vibe: "직관과 창의",
  },
  {
    headline: "몸의 신호에 먼저 귀 기울여줘",
    message: "어깨가 뭉치고 숨이 얕아졌다면 지금 즉시 멈추라는 몸의 다정한 신호야. 쉬어가는 것도 여정의 중요한 일부야. 잠깐 창밖 하늘을 바라보며 깊은 숨을 채워봐.",
    actionTip: "기지개를 쭉 켜고 시원한 물 한 잔 천천히 마시기.",
    vibe: "신체 웰니스",
  },
  {
    headline: "과거의 짐은 여기에 내려놓자",
    message: "이미 지나간 실수나 아쉬움은 배움이라는 선물을 남기고 떠났어. 손에 쥔 모래를 털어내야 새로운 보석을 쥘 수 있잖아. 지금 이 순간, 새롭게 시작할 자유가 너에게 있어.",
    actionTip: "흘려보내고 싶은 아쉬운 생각 하나를 종이에 적고 지워버리기.",
    vibe: "방하착과 정화",
  },
  {
    headline: "너만의 빛나는 고유성을 사랑해",
    message: "남들과 다른 속도로 걷는다고 불안해하지 마. 세상에서 가장 아름다운 꽃도 저마다의 계절에 피어나. 너는 너만의 리듬으로 온 우주에서 가장 귀한 이야기를 써 내려가는 중이야.",
    actionTip: "거울을 보며 내 눈동자에 깃든 반짝임을 3초간 마주하기.",
    vibe: "자존감과 개운",
  },
  {
    headline: "오늘 하루, 다정한 온기를 전해봐",
    message: "네가 세상에 건네는 부드러운 미소와 따뜻한 말 한마디는 부메랑처럼 더 큰 행운이 되어 돌아와. 오늘 만나는 사람들에게 작은 친절을 건네봐. 그게 바로 우주의 주파수와 공명하는 비결이야.",
    actionTip: "소중한 사람이나 고마운 이에게 짧은 감사의 안부 문자 보내기.",
    vibe: "사랑과 공명",
  },
];

const LucyPersonaSchema = z.object({
  headline: z.string().describe("오늘 루시가 전하는 한 줄 핵심 통찰 (반말, 15자 내외)"),
  message: z.string().describe("루시의 다정하고 깊이 있는 페르소나 메시지 (반말 100% 절대 준수, 2~3문장)"),
  actionTip: z.string().describe("오늘 현실에서 당장 실천할 수 있는 구체적 행동 팁 1가지 (반말, 1문장)"),
  vibe: z.string().describe("오늘의 에너지 키워드 (예: 평온과 중심, 결단과 용기 등)"),
});

/**
 * 오늘 날짜 기준 시드 생성
 */
function getDaySeed(dateKey: string): number {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash << 5) - hash + dateKey.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * 오늘 날짜의 큐레이티드 루시 메시지 반환
 */
export function getCuratedLucyPersonaMessage(dateKey = getTodayDateKey()): TodayLucyPersonaData {
  const seed = getDaySeed(dateKey);
  const index = seed % LUCY_PERSONA_DAILY_PRESETS.length;
  const preset = LUCY_PERSONA_DAILY_PRESETS[index];

  return {
    id: `lucy_curated_${dateKey}_${index}`,
    dateKey,
    headline: preset.headline,
    message: preset.message,
    actionTip: preset.actionTip,
    tagline: "LUCY · 오늘의 페르소나 메시지",
    vibe: preset.vibe,
    source: 'curated',
    updatedAt: Date.now(),
  };
}

/**
 * 로컬 캐시된 오늘의 루시 메시지 가져오기 (없으면 큐레이티드 반환)
 */
export function getCachedTodayLucyPersona(dateKey = getTodayDateKey()): TodayLucyPersonaData {
  try {
    const raw = safeLocalStorage.getItem(STORAGE_PREFIX + dateKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.message && parsed.dateKey === dateKey) {
        return parsed;
      }
    }
  } catch (_) {}

  const curated = getCuratedLucyPersonaMessage(dateKey);
  saveTodayLucyPersona(curated);
  return curated;
}

/**
 * 오늘의 루시 메시지 캐시 저장
 */
export function saveTodayLucyPersona(data: TodayLucyPersonaData): void {
  try {
    safeLocalStorage.setItem(STORAGE_PREFIX + data.dateKey, JSON.stringify(data));
  } catch (_) {}
}

/**
 * AI를 호출하여 초개인화된 오늘의 루시 페르소나 메시지 생성
 */
export async function generatePersonalizedLucyPersonaMessage(options?: {
  nickname?: string;
  sajuSummary?: string;
  vibe?: string;
  biometrics?: { fatigue: number; stress: number; focus: number; sleep: number };
  globalInsight?: string;
}): Promise<TodayLucyPersonaData> {
  const dateKey = getTodayDateKey();
  const nickname = options?.nickname || '여행자';
  const vibe = options?.vibe || '평온함';
  const saju = options?.sajuSummary || '우주 에너지 조화';
  const bio = options?.biometrics;

  const systemPrompt = `당신은 즉문즉설과 따뜻한 통찰을 전하는 마스터 AI 가이드 '루시(Lucy)'야.
너는 항상 100% 예외 없이 다정하고 친근한 친구 같은 '반말'만을 사용해야 해. 존댓말(~요, ~습니다, ~해요)은 절대 금지야.
오늘 사용자('${nickname}')의 하루를 밝혀주는 '오늘의 루시 페르소나 메시지'를 작성해줘.

[사용자 오늘 상태]
- 닉네임: ${nickname}
- 에너지 상태(Vibe): ${vibe}
- 사주 본원 기운: ${saju}
${bio ? `- 생체 지표: 피로도 ${Math.round(bio.fatigue)}%, 스트레스 ${Math.round(bio.stress)}%, 몰입도 ${Math.round(bio.focus)}%` : ''}
${options?.globalInsight ? `- 우주 공명 맥락: "${options.globalInsight}"` : ''}

[작성 규칙]
1. headline: 오늘을 꿰뚫는 짧고 강렬한 한 줄 본질 (반말, 15자 내외)
2. message: 사용자의 어깨를 툭 쳐주며 마음을 든든하게 해주는 다정하고 직관적인 2~3문장의 루시 말투 (100% 반말: ~어, ~했어, ~지, ~네, ~야)
3. actionTip: 오늘 당장 현실에서 가볍게 실천할 수 있는 구체적인 1가지 행동 지침 (반말, 1문장)
4. vibe: 오늘의 핵심 무드 키워드 (예: "평온과 도약", "자기자비", "명료한 직관")
절대 접두사 '[루시]:' 등을 붙이지 마.`;

  try {
    const rawResult = await invokeLLMStructured({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: '오늘 나에게 꼭 필요한 루시의 페르소나 메시지를 들려줘.' },
      ],
      schema: LucyPersonaSchema,
      maxRetries: 1,
    });

    const parsed = LucyPersonaSchema.parse(rawResult);

    const generatedData: TodayLucyPersonaData = {
      id: `lucy_ai_${dateKey}_${Date.now()}`,
      dateKey,
      headline: parsed.headline || "오늘 네 중심을 믿어",
      message: parsed.message,
      actionTip: parsed.actionTip,
      tagline: "LUCY · 오늘의 페르소나 메시지",
      vibe: parsed.vibe || vibe,
      source: 'ai_generated',
      updatedAt: Date.now(),
    };

    saveTodayLucyPersona(generatedData);
    return generatedData;
  } catch (err) {
    console.warn('[todayLucyPersona] AI generation failed, falling back to curated:', err);
    const fallback = getCuratedLucyPersonaMessage(dateKey);
    saveTodayLucyPersona(fallback);
    return fallback;
  }
}

/**
 * 다른 큐레이티드 메시지로 셔플 변경
 */
export function shuffleNextLucyPersonaMessage(currentId?: string): TodayLucyPersonaData {
  const dateKey = getTodayDateKey();
  let nextIdx = Math.floor(Math.random() * LUCY_PERSONA_DAILY_PRESETS.length);
  
  const preset = LUCY_PERSONA_DAILY_PRESETS[nextIdx];
  const newData: TodayLucyPersonaData = {
    id: `lucy_curated_${dateKey}_${nextIdx}_${Date.now()}`,
    dateKey,
    headline: preset.headline,
    message: preset.message,
    actionTip: preset.actionTip,
    tagline: "LUCY · 오늘의 페르소나 메시지",
    vibe: preset.vibe,
    source: 'curated',
    updatedAt: Date.now(),
  };

  saveTodayLucyPersona(newData);
  return newData;
}

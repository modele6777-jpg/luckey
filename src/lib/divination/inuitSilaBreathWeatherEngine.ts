/**
 * =========================================================================
 * LUCKEY 이누이트 시라(Sila) 숨·날씨·빛의 리듬 지혜 엔진
 * (Inuit Sila Breath & Weather Rhythm Engine)
 * =========================================================================
 *
 * [전통적 배경]
 * 북극 이누이트(Inuit) 전통에서 '시라(Sila)'는 숨, 바람, 날씨, 바깥 세계의 질서와
 * 의식의 맑음을 한데 묶는 포괄적 개념으로 전해진다. 사냥과 항해가 날씨의 선물에
 * 의해 좌우되던 삶의 토대 위에서, 시라는 격렬한 통제가 아니라 관찰·인내·숨 고르기의
 * 태도로 대접받았다. 극야(폴라 나이트)와 백야(미드나잇 선)의 극단적 빛의 주기도
 * 일과 쉼의 리듬을 정돈하는 계절 판독의 척도로 읽혔다.
 *
 * 본 엔진은 시라의 상징 체계를 사주 오행 질감, 질문 주제, KST 시간대·계절 리듬에
 * 매핑해 정성적 성찰 관점을 구성한다.
 *
 * 원칙:
 * 1. 개인 점수·심리 진단·미래 예측이 아닙니다. 모든 산출은 상징 성찰 문장입니다.
 * 2. 이누이트 전통은 살아 있는 구전 전통이므로 특정 어르신·판본의 발언을 직접 인용하며
 *    귀속하지 않고, 주제만 요약해 상징으로 씁니다.
 * 3. 실제 기상 예보나 의학적 호흡 처방을 대신하지 않습니다.
 *
 * @version LUCKEY-INUIT-SILA-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const INUIT_SILA_BREATH_WEATHER_VERSION = 'LUCKEY-INUIT-SILA-v2.1.0';

export type SilaQuestionTopic = 'decision' | 'relationship' | 'healing' | 'reflection';

export interface SilaBreathPulse {
  kstHourWindow: string;        // 현재 KST 시간대의 빛·숨 창
  seasonLightTone: string;      // 계절 빛의 결 (극야·백야 메타포)
  breathPace: string;           // 오늘 권하는 숨의 결
  weatherPatienceGuidance: string; // 날씨를 기다리듯 일을 다루는 지침
}

export interface SituationalSilaAudit {
  questionTopic: SilaQuestionTopic;
  weatherMirror: string;        // 질문을 날씨에 비춘 거울 문장
  stillnessAdvice: string;      // 참을 만큼 가라앉기 조언
  movementAdvice: string;       // 바람 타듯 움직이기 조언
  breathPractice: string;       // 오늘의 호흡 리추얼
}

export interface SilaSynthesisMatrix {
  dominantWeather: string;      // 지금의 지배적 날씨 상징
  breathAlignment: string;      // 숨과 계절의 정렬 상태
  integratedAction: string;     // 통합 실천 문장
}

export interface InuitSilaBreathWeatherResult {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  questionTopic: SilaQuestionTopic;
  elementWeatherKey: string;    // 사주 오행 질감에 맞춘 날씨 키
  situationalSilaAudit: SituationalSilaAudit;
  temporalBreathPulse: SilaBreathPulse;
  silaSynthesisMatrix: SilaSynthesisMatrix;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

function classifySilaQuestionTopic(query?: string): SilaQuestionTopic {
  const q = (query ?? '').toLowerCase();
  if (/결정|선택|이직|창업|시작|지원|계약|돈|재물|일|커리어|진로|승진/.test(q)) return 'decision';
  if (/관계|사람|연인|연애|가족|친구|동료|갈등|다툼|화해|서운|이별|사랑/.test(q)) return 'relationship';
  if (/불안|지침|우울|회복|휴식|건강|수면|힘들|번아웃|슬픔/.test(q)) return 'healing';
  return 'reflection';
}

function getSilaKstParts(now: Date): { hour: number; month: number } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    hour: 'numeric',
    month: 'numeric',
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  return {
    hour: Number(parts.find((p) => p.type === 'hour')?.value || '12') % 24,
    month: Number(parts.find((p) => p.type === 'month')?.value || '1'),
  };
}

function buildTemporalBreathPulse(now: Date): SilaBreathPulse {
  const { hour, month } = getSilaKstParts(now);

  let kstHourWindow = '새벽 — 눈보라가 잦아드는 조용한 창';
  let breathPace = '길게 내쉬며 잠든 마을처럼 고요한 들숨';
  let weatherPatienceGuidance = '답이 필요한 일도 새벽 바깥처럼 잠시 조용히 두면 아침에 윤곽이 드러납니다.';

  if (hour >= 5 && hour < 11) {
    kstHourWindow = '아침 — 해가 낮게 길게 걷는 창';
    breathPace = '차고 맑은 공기를 천천히 여는 아침 들숨';
    weatherPatienceGuidance = '하루의 방향은 낮은 태양처럼 길게 잡으세요. 서두르기보다 첫 한 걸음의 온도를 지키는 편이 낫습니다.';
  } else if (hour >= 11 && hour < 17) {
    kstHourWindow = '낮 — 움직이고 살펴야 할 밝은 창';
    breathPace = '움직임에 맞춘 규칙적인 낮 들숨';
    weatherPatienceGuidance = '사냥꾼이 낮이 빛을 주는 동안 움직였듯, 결정해야 할 일은 빛이 남아 있을 때 확인하고 옮기세요.';
  } else if (hour >= 17 && hour < 22) {
    kstHourWindow = '저녁 — 불을 지피고 돌아앉는 창';
    breathPace = '모닥불 주위에서 가라앉는 저녁 들숨';
    weatherPatienceGuidance = '하루의 성과를 돌아보는 시간입니다. 얻은 것과 미룬 것을 구분해 두면 밤이 가벼워집니다.';
  } else {
    kstHourWindow = '밤 — 극야의 별빛 아래 기다리는 창';
    breathPace = '어둠 속에서 더 깊어지는 밤 들숨';
    weatherPatienceGuidance = '긴 겨울밤이 억지로 다가오는 아침을 만들지 않듯, 아직 답이 서툰 일을 밤새 다그치지 마세요.';
  }

  let seasonLightTone = '겨울 · 극야 — 별빛과 눈빛으로 견디는 계절';
  if (month >= 3 && month <= 5) seasonLightTone = '봄 · 해동 — 얼음이 풀며 길이 드러나는 계절';
  else if (month >= 6 && month <= 8) seasonLightTone = '여름 · 백야 — 해가 지지 않아 일이 무르익는 계절';
  else if (month >= 9 && month <= 11) seasonLightTone = '가을 · 첫눈 — 거두고 소풍(小風)을 듣는 계절';

  return {
    kstHourWindow,
    seasonLightTone,
    breathPace,
    weatherPatienceGuidance,
  };
}

function buildSilaSynthesisAudit(
  query: string,
  topic: SilaQuestionTopic,
  elementWeatherKey: string
): SituationalSilaAudit {
  const q = query.trim();
  if (topic === 'decision') {
    return {
      questionTopic: topic,
      weatherMirror: `${elementWeatherKey} 날씨 아래 길을 고르는 결 — 서두름보다 관찰이 먼저인 풍경`,
      stillnessAdvice: '선택지를 떠나기 전에, 바람의 방향이 바뀌는 지점(조건이 바뀌는 순간)을 먼저 적어 보세요.',
      movementAdvice: '되돌릴 수 있는 가장 작은 시험을 오늘 안에 실행해 실제 바람의 세기를 확인하세요.',
      breathPractice: '들숨과 날숨의 길이를 같게 맞추고, 네 번의 숨마다 판단을 한 번씩 미루어 보기.',
    };
  }
  if (topic === 'relationship') {
    return {
      questionTopic: topic,
      weatherMirror: `${elementWeatherKey} 날씨 속 두 사람의 보행 — 눈보라는 탓할 대상이 아니라 함께 통과하는 풍경`,
      stillnessAdvice: '상대의 말을 바로 날씨 판정으로 바꾸지 말고, 그 말이 불러온 내 마음의 결을 먼저 살피세요.',
      movementAdvice: '오해를 하나 골라 짧고 담백한 문장으로 풀어 말해 보세요. 눈은 말보다 먼저 녹습니다.',
      breathPractice: '대화 전에 세 번 깊게 들숨을 마시고, 목소리가 낮아지는 지점에서 첫마디를 시작하기.',
    };
  }
  if (topic === 'healing') {
    return {
      questionTopic: topic,
      weatherMirror: `${elementWeatherKey} 날씨에 지친 몸 — 겨울밤을 견디던 사람의 쉼처 이야기`,
      stillnessAdvice: '아직 회복되지 않은 부분을 문제로 세지 말고, 오늘 밤 눈 덮인 지붕처럼 조용히 덮어 두세요.',
      movementAdvice: '화면을 내려놓고 몸을 가볍게 움직이는 짧은 산책으로 숨의 결을 바꾸어 보세요.',
      breathPractice: '잠들기 전 따뜻한 물 한 잔과 함께 길게 내쉬는 숨 여덟 번으로 하루를 닫기.',
    };
  }
  return {
    questionTopic: topic,
    weatherMirror: `${elementWeatherKey} 날씨를 바라보는 사람 — 바깥의 결을 관찰하며 안의 결을 정돈하는 풍경`,
    stillnessAdvice: '지금 내 마음의 날씨를 맑음·흐림·눈보라 중 무엇으로 부를지 조용히 골라 보세요.',
    movementAdvice: '관찰한 결 하나를 오늘의 작은 행동 한 가지로 옮겨 보세요. 날씨 지식은 행동에서 익혀집니다.',
    breathPractice: '바깥 소리를 세 가지 세어 들은 뒤, 호흡 하나에 온전히 집중해 보기.',
  };
}

export function calculateInuitSilaBreathWeather(
  profile?: UserProfile,
  question?: string,
  now: Date = new Date(),
): InuitSilaBreathWeatherResult {
  const name = profile?.basic?.name ?? '방문자';
  const birthdate = profile?.basic?.birthdate ?? '';
  const birthtime = profile?.basic?.birthtime ?? '';
  const topic = classifySilaQuestionTopic(question);

  // 이름·생년월일·시 텍스트 해시로 결정론적 날씨 키를 고른다(점수가 아닌 상징 선택).
  const seedString = `INUIT-SILA:${name}:${birthdate}:${birthtime}:${topic}:${(question ?? '').trim()}`;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const weatherKeys = [
    '맑은 한파 — 대기가 정화되어 멀리 보이는 결',
    '눈보라 — 시야가 좁아지니 걸음을 줄여야 하는 결',
    '해동 — 굳어 있던 것이 풀리며 길이 드러나는 결',
    '연무(煙霧) — 윤곽이 흐려 판단을 미루게 만드는 결',
    '북풍 — 방향을 단호히 밀어 주는 결',
  ];
  const elementWeatherKey = weatherKeys[absHash % weatherKeys.length];

  const situationalSilaAudit = buildSilaSynthesisAudit(question ?? '', topic, elementWeatherKey);
  const temporalBreathPulse = buildTemporalBreathPulse(now);

  const interpretiveBoundary =
    '본 리포트는 이누이트 시라(Sila) 상징을 빌려 지금의 숨과 계절 리듬을 성찰하도록 돕는 정성적 안내이며, 개인 점수·심리 진단·미래 예측이 아닙니다. 실제 기상 상황은 기상 예보를, 몸의 이상은 의료 전문가를 확인하십시오.';

  const trimmedQ = (question ?? '').trim();
  const ritualAction = `${situationalSilaAudit.breathPractice} 이어서 ${situationalSilaAudit.movementAdvice}`;
  const reflectionFocus = `${elementWeatherKey} 아래의 ${temporalBreathPulse.kstHourWindow} — 지금 내 숨과 계절 리듬이 맞는지 점검하기`;
  const reflectiveQuestion = trimmedQ
    ? `'${trimmedQ}'라는 질문 앞에서, 오늘의 날씨를 기다리듯 참아야 할 것과 바람을 타고 곧 옮겨야 할 것은 각각 무엇인가요?`
    : `지금 내 마음의 날씨는 무엇이고, 그 날씨가 오늘의 숨과 걸음에 무엇을 권하고 있나요?`;

  const silaSynthesisMatrix: SilaSynthesisMatrix = {
    dominantWeather: elementWeatherKey,
    breathAlignment: `${temporalBreathPulse.breathPace} · ${temporalBreathPulse.seasonLightTone}`,
    integratedAction: `${situationalSilaAudit.movementAdvice}${trimmedQ ? ` [질문 맥락: ${trimmedQ}]` : ''}`,
  };

  const kst = new Date(now.getTime() + 9 * 3600 * 1000);
  const calculatedAtKst = `${kst.toISOString().slice(0, 19)}+09:00 (KST)`;

  return {
    engineVersion: INUIT_SILA_BREATH_WEATHER_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    questionTopic: topic,
    elementWeatherKey,
    situationalSilaAudit,
    temporalBreathPulse,
    silaSynthesisMatrix,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary,
  };
}

export function formatInuitSilaBreathWeatherPrompt(res: InuitSilaBreathWeatherResult): string {
  return [
    `【이누이트 시라(Sila) 숨·날씨·빛의 리듬 지혜 (${res.engineVersion} | ${res.calculatedAtKst})】`,
    `- 질문 주제 분류: ${res.questionTopic}`,
    `- 지금의 날씨 상징: ${res.elementWeatherKey}`,
    `- 질문 비춤(날씨 거울): ${res.situationalSilaAudit.weatherMirror}`,
    `- 가라앉기 조언: ${res.situationalSilaAudit.stillnessAdvice}`,
    `- 움직이기 조언: ${res.situationalSilaAudit.movementAdvice}`,
    `- KST 빛·숨 창: ${res.temporalBreathPulse.kstHourWindow} (${res.temporalBreathPulse.seasonLightTone})`,
    `- 숨의 결: ${res.temporalBreathPulse.breathPace}`,
    `- 날씨 인내 지침: ${res.temporalBreathPulse.weatherPatienceGuidance}`,
    `- 시라 교차 매트릭스: 지배 날씨(${res.silaSynthesisMatrix.dominantWeather}) · 숨 정렬(${res.silaSynthesisMatrix.breathAlignment}) · 통합 실천(${res.silaSynthesisMatrix.integratedAction})`,
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

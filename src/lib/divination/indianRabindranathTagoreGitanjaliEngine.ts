/**
 * 인도/벵골 라빈드라나트 타고르(Rabindranath Tagore) 《기탄잘리(Gitanjali)》 & 《동방의 등불》 우주적 영혼합일 지혜 엔진
 *
 * 아시아 최초의 노벨문학상 수상자이자 벵골의 위대한 영혼 라빈드라나트 타고르(Rabindranath Tagore, 1861~1941)의 불멸의 명저
 * 《기탄잘리(Gitanjali - Song Offerings)》, 《동방의 등불(The Lamp of the East)》, 《길 잃은 새들(Stray Birds)》 원전 기반:
 * 1. 우주적 영혼 교감도(Cosmic Soul Communion Score): 만물 속에 살아 숨 쉬는 우주적 신성과 생명력에 깊이 감응하고 화답하는 영적 교감도.
 * 2. 순수한 영혼 헌신도(Pure Devotional Bhakti Index): 사사로운 보상이나 집착 없이 존재 자체의 은총에 감사하며 삶을 노래로 바치는 헌신도.
 * 3. 두려움 없는 열린 영혼의 자유도(Fearless Freedom of Mind Score): "마음에 두려움이 없고 머리는 높이 들린 곳으로" 편협한 장벽을 부수고 나아가는 영적 자주성.
 * 4. 자연과의 서정적 합일 조화도(Lyric Nature Harmonization Index): 비바람, 대지, 꽃잎, 강물의 흐름 속에서 신성한 질서와 아름다움을 발견하는 서정적 평정심.
 * 5. 동방의 등불 희망 회복탄력성(Lamp of the East Resilience Score): 짙은 어둠과 시련의 밤 속에서도 내면의 꺼지지 않는 등불을 밝혀 밝은 새벽을 여는 숭고한 회복력.
 *
 * @version LUCKEY-TAGORE-GITANJALI-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const INDIAN_TAGORE_GITANJALI_VERSION = 'LUCKEY-TAGORE-GITANJALI-v2.3.0';

export interface TagoreTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface TagoreAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismBengali: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface IndianRabindranathTagoreGitanjaliResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 타고르 기탄잘리 영성 지표 (0~100)
  cosmicSoulCommunionScore: number;     // 우주적 영혼 교감도 (Cosmic Soul Communion)
  pureDevotionalBhaktiIndex: number;    // 순수한 영혼 헌신도 (Pure Devotional Bhakti)
  fearlessFreedomMindScore: number;     // 두려움 없는 열린 영혼의 자유도 (Fearless Freedom of Mind)
  lyricNatureHarmonizationIndex: number;// 자연과의 서정적 합일 조화도 (Lyric Nature Harmonization)
  lampOfTheEastResilienceScore: number; // 동방의 등불 희망 회복탄력성 (Lamp of the East Resilience)
  // 세부 분석
  activeTagoreTheme: TagoreTheme;
  focalTagoreAphorism: TagoreAphorism;
  secondaryTagoreAphorism: TagoreAphorism;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  ritualAction: string;
  reflectionFocus: string;
  tagoreComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  tagoreSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

export const TAGORE_THEMES: TagoreTheme[] = [
  {
    themeKey: 'where_mind_is_without_fear',
    themeTitleEn: 'Where the Mind is Without Fear (마음에 두려움이 없는 곳으로)',
    themeTitleKo: '편협한 담벼락을 허물고 두려움 없이 높이 들린 머리로 무한한 자유의 바다로 나아감',
    existentialInsight: '인간의 영혼을 옭아매는 가장 큰 사슬은 거짓된 관습과 사소한 두려움입니다. 지식이 자유롭고 편협한 편견으로 조각나지 않은 진리의 세계를 향해 영혼은 쉼 없이 솟아올라야 합니다.',
    practicalCounsel: '과거의 관습이나 남들의 시선에 갇히지 마십시오. 당신의 이상을 가로막는 내면의 두려움을 털어내고, 진실을 향해 당당하게 고개를 드십시오.',
  },
  {
    themeKey: 'endless_song_offering',
    themeTitleEn: 'Endless Song Offering of the Soul (끝없는 노래로 바치는 영혼의 잔)',
    themeTitleKo: '연약한 질그릇 같은 자신을 비워내고 우주의 신선한 생명과 은총으로 넘치게 채움',
    existentialInsight: '자신을 대단한 존재로 채우려 할 때 영혼은 무겁고 탁해집니다. 마음의 잔을 완전히 비울 때, 비로소 온 우주의 신성한 노래와 생명력이 당신을 통해 막힘없이 흘러나옵니다.',
    practicalCounsel: '지나친 고집과 에고의 집착을 내려놓으십시오. 삶이 주는 시련과 기쁨 모두를 감사히 받아들이며 당신의 하루를 아름다운 헌신의 노래로 빚어가십시오.',
  },
  {
    themeKey: 'communion_with_the_infinite',
    themeTitleEn: 'Communion with the Infinite in Nature (자연 속 무한자와의 거룩한 교감)',
    themeTitleKo: '한 포기 풀잎과 강물의 속삭임 속에서 영원한 신성의 숨결을 느끼며 하나 됨',
    existentialInsight: '우리는 거대한 대우주의 외딴 이방인이 아니라 대자연의 거룩한 호흡을 함께 나누는 한 줄기 빛입니다. 꽃잎 하나, 빗방울 하나에도 무한자의 깊은 사랑과 지혜가 깃들어 있습니다.',
    practicalCounsel: '도심의 번잡한 일정 속에서도 계절의 변화와 바람의 결을 느껴보십시오. 자연의 너른 품 속에서 조급한 마음을 가라앉히고 근원적인 생명력을 회복하십시오.',
  },
  {
    themeKey: 'joy_in_unseen_service',
    themeTitleEn: 'Joy in Unseen Service and Grace (보이지 않는 곳에서의 헌신과 찬미)',
    themeTitleKo: '화려한 갈채를 탐하지 않고 가장 낮은 곳에서 만물을 섬기며 누리는 지극한 평화',
    existentialInsight: '참된 신성은 먼 하늘의 옥좌에 있는 것이 아니라, 흙먼지 묻은 손으로 땀 흘려 일하는 이들의 곁에 있습니다. 남모르는 작은 배려와 겸손한 봉사 속에 진정한 기쁨이 있습니다.',
    practicalCounsel: '남들이 알아주기를 바라는 인정 욕구를 내려놓으십시오. 묵묵히 자신의 자리를 지키며 주변에 말 없는 온기와 위로를 전하는 소금 같은 존재가 되십시오.',
  },
  {
    themeKey: 'lamp_of_the_east_dawn',
    themeTitleEn: 'Dawn of the Lamp of the East (어둠을 뚫고 타오르는 동방의 등불)',
    themeTitleKo: '깊은 절망과 고난의 밤을 지나 인류를 다시 비추는 찬란한 영적 각성의 빛',
    existentialInsight: '밤이 가장 깊을 때 새벽은 가장 가까이 다가옵니다. 어둠을 탓하기보다 작은 등불을 켜는 자가 역사를 밝히듯, 내면의 영적 빛을 지키는 이는 어떤 시련도 뚫고 승리합니다.',
    practicalCounsel: '눈앞의 난관에 좌절하지 마십시오. 당신의 마음속에 이미 어둠을 물리칠 수 있는 불멸의 등불이 켜져 있음을 기억하고 희망찬 발걸음을 내딛으십시오.',
  },
];

export const TAGORE_APHORISMS: TagoreAphorism[] = [
  {
    aphorismKey: 'mind_without_fear',
    aphorismKo: '마음에 두려움이 없고 머리는 높이 들린 곳, 지식이 자유롭고 편협한 담벼락으로 세상이 조각나지 않은 곳, 그 자유의 천국으로 나의 영혼을 깨어나게 하소서.',
    aphorismBengali: 'চিত্ত যেথা ভয়শূন্য, উচ্চ যেথা শির, জ্ঞান যেথা মুক্ত, যেথা গৃহের প্রাচীর',
    sourceContext: '《기탄잘리(Gitanjali)》 제35편',
    actionGuidance: '편견과 두려움의 좁은 울타리를 깨뜨리고, 더 넓고 진실한 세계를 향해 당당히 나아가십시오.',
  },
  {
    aphorismKey: 'fragile_vessel_emptied',
    aphorismKo: '당신은 연약한 질그릇 같은 나를 비우시고 또 비우시어, 언제나 신선한 생명으로 가득 채우시나이다.',
    aphorismBengali: 'আমারে তুমি অশেষ করেছ, এমনি তোমার লীলা। ফুরায়ে ফেলে আবার ভরেছ জীবন নবীন করি।',
    sourceContext: '《기탄잘리》 제1편',
    actionGuidance: '마음의 욕망과 고집을 맑게 비워냄으로써 삶이 주는 새로운 영감과 활력을 온전히 받아들이십시오.',
  },
  {
    aphorismKey: 'lamp_of_the_east',
    aphorismKo: '일찍이 아시아의 황금시기에 빛나던 동방의 밝은 등불, 그 등불 다시 한번 켜지는 날에 너는 동방의 밝은 빛이 되리라.',
    aphorismBengali: 'পূর্বের প্রদীপ আবার জ্বলিয়া উঠিবে',
    sourceContext: '〈동방의 등불(The Lamp of the East)〉 1929년 한국 헌정시',
    actionGuidance: '고난 속에서도 결코 꺾이지 않는 내면의 자긍심을 품고, 스스로 어둠을 밝히는 빛이 되십시오.',
  },
  {
    aphorismKey: 'touch_of_the_divine',
    aphorismKo: '내가 문을 닫아걸고 슬픔 속에 울고 있을 때, 당신은 부드러운 바람과 꽃향기로 내 가슴의 문을 두드리셨나이다.',
    aphorismBengali: 'তুমি যখন এলে তখন আমার দুয়ার ছিল বন্ধ',
    sourceContext: '《기탄잘리》 제67편',
    actionGuidance: '마음의 빗장을 열고 세상의 따스한 손길과 자연의 위로를 겸허히 받아들이십시오.',
  },
];

function formatTagoreKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function describeTagoreStage(score: number): string {
  if (score >= 90) return '동방의 등불 개명기 (어둠과 두려움을 넘어 영혼의 자유와 우주적 공명이 충만한 흐름)';
  if (score >= 82) return '서정적 바크티(Bhakti) 합일기 (일상과 자연 속에서 고요한 감사와 헌신이 깊어지는 국면)';
  return '질그릇 비움 성찰기 (에고의 집착을 덜어내며 새로운 생명의 노래를 맞이하는 흐름)';
}

export function calculateIndianRabindranathTagoreGitanjali(
  profile: UserProfile,
  query?: string,
  now: Date = new Date(),
): IndianRabindranathTagoreGitanjaliResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `TAGORE-GITANJALI-SONG:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const cosmicSoulCommunionScore = 77 + (absHash % 22);
  const pureDevotionalBhaktiIndex = 76 + ((absHash >> 3) % 23);
  const fearlessFreedomMindScore = 78 + ((absHash >> 6) % 21);
  const lyricNatureHarmonizationIndex = 75 + ((absHash >> 9) % 24);
  const lampOfTheEastResilienceScore = 79 + ((absHash >> 12) % 20);

  const themeIndex = (absHash >> 4) % TAGORE_THEMES.length;
  const aphorismIndex = (absHash >> 7) % TAGORE_APHORISMS.length;
  const secondaryAphorismIndex = (aphorismIndex + 1 + ((absHash >> 10) % (TAGORE_APHORISMS.length - 1))) % TAGORE_APHORISMS.length;

  const activeTagoreTheme = TAGORE_THEMES[themeIndex];
  const focalTagoreAphorism = TAGORE_APHORISMS[aphorismIndex];
  const secondaryTagoreAphorism = TAGORE_APHORISMS[secondaryAphorismIndex];
  const trimmedQuery = query?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `'${trimmedQuery}' 앞에서 마음의 두려움을 내려놓고 '${activeTagoreTheme.themeTitleKo}'의 노래를 따른다면 오늘 가장 먼저 열고 싶은 창은 무엇인가요?`
    : `지금 내 안에서 '${activeTagoreTheme.themeTitleKo}'의 빛이 들어오지 못하도록 닫아걸고 있는 작은 두려움은 무엇인가요?`;
  const interpretiveBoundary = '타고르 기탄잘리·동방의 등불 관점은 미래의 길흉 예언이 아니라, 두려움을 넘어선 내면의 자유와 서정적 감응을 비추는 문학·영성 성찰 렌즈입니다.';

  const guidanceTitle = `타고르 기탄잘리 우주적 영혼합일 지혜: ${activeTagoreTheme.themeTitleKo}`;
  const philosophicalCounsel = `아시아의 성자 라빈드라나트 타고르의 《기탄잘리》와 《동방의 등불》은 두려움을 넘어선 영혼의 무한한 자유, 자연과 우주의 신성한 생명력과의 합일, 그리고 어둠을 밝히는 불멸의 희망을 노래합니다. ` +
    `현재 당신의 삶에 깃든 중심 영성 원리는 '${activeTagoreTheme.themeTitleKo}'입니다. ` +
    `${activeTagoreTheme.practicalCounsel} 아울러 타고르의 명구 "${focalTagoreAphorism.aphorismKo}"(${focalTagoreAphorism.aphorismBengali})를 깊이 묵상하고, ` +
    `${focalTagoreAphorism.actionGuidance}`;

  const tagoreSynthesisMatrix = {
    dominantTension: `${activeTagoreTheme.themeTitleKo} ↔ ${focalTagoreAphorism.sourceContext}`,
    alignmentState:
      cosmicSoulCommunionScore >= 85 && fearlessFreedomMindScore >= 85
        ? '두려움 없는 영혼의 자유와 우주적 서정 합일'
        : '질그릇을 비워 새 생명의 노래를 받아들이는 정화 국면',
    integratedAction: `${activeTagoreTheme.practicalCounsel} (${focalTagoreAphorism.actionGuidance})`,
  };

  const ritualAction = `[${activeTagoreTheme.themeTitleKo}] ${focalTagoreAphorism.actionGuidance}`;
  const reflectionFocus = reflectiveQuestion;

  return {
    engineVersion: INDIAN_TAGORE_GITANJALI_VERSION,
    calculatedAtKst: formatTagoreKstTimestamp(now),
    cosmicSoulCommunionScore,
    pureDevotionalBhaktiIndex,
    fearlessFreedomMindScore,
    lyricNatureHarmonizationIndex,
    lampOfTheEastResilienceScore,
    activeTagoreTheme,
    focalTagoreAphorism,
    secondaryTagoreAphorism,
    reflectiveQuestion,
    interpretiveBoundary,
    ritualAction,
    reflectionFocus,
    tagoreComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    tagoreSynthesisMatrix,
  };
}

export function formatIndianRabindranathTagoreGitanjaliPrompt(res: IndianRabindranathTagoreGitanjaliResult): string {
  const lines = [
    `【타고르 《기탄잘리·동방의 등불》 우주적 영혼합일 & 두려움 없는 자유 지표】`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 우주적 영혼 교감도(Cosmic Soul Communion): ${describeTagoreStage(res.cosmicSoulCommunionScore)}`,
    `- 순수한 영혼 헌신도(Pure Devotional Bhakti): ${describeTagoreStage(res.pureDevotionalBhaktiIndex)}`,
    `- 두려움 없는 열린 자유도(Fearless Freedom of Mind): ${describeTagoreStage(res.fearlessFreedomMindScore)}`,
    `- 자연 서정 합일 조화도(Lyric Nature Harmony): ${describeTagoreStage(res.lyricNatureHarmonizationIndex)}`,
    `- 동방의 등불 희망 회복탄력성(Lamp of the East): ${describeTagoreStage(res.lampOfTheEastResilienceScore)}`,
    `- 핵심 영적 테마: ${res.activeTagoreTheme.themeTitleKo} [${res.activeTagoreTheme.themeTitleEn}]`,
    `- 실존적 통찰: ${res.activeTagoreTheme.existentialInsight}`,
    `- 실천적 조언: ${res.activeTagoreTheme.practicalCounsel}`,
    `- 타고르 원전 명구: "${res.focalTagoreAphorism.aphorismKo}" [${res.focalTagoreAphorism.aphorismBengali}]`,
    `- 보조 교차 명구: "${res.secondaryTagoreAphorism.aphorismKo}" [${res.secondaryTagoreAphorism.sourceContext}]`,
    `- 원전 출처: [${res.focalTagoreAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalTagoreAphorism.actionGuidance}`,
    `- 종합 타고르 영성 권면: ${res.tagoreComprehensiveGuidance.philosophicalCounsel}`,
    `- 실천 의례(Ritual Action): ${res.ritualAction}`,
    `- 성찰 초점(Reflection Focus): ${res.reflectionFocus}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ];
  if (res.tagoreSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.tagoreSynthesisMatrix.dominantTension} | 조율 상태: ${res.tagoreSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.tagoreSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}

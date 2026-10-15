import { getTodayDateKey } from '@/lib/dailyCache';
import { getTarotCardImageUrl, TAROT_DECK, type TarotCard } from '@/data/tarotData';
import { prepareNaturalSpeechText } from '@/utils/speechText';
import { extractConciseSummary, stripSummaryFromTarotText, deduplicateReadingText } from '@/lib/tarotSummaryUtils';
import { ensureCompleteTarotReading } from '@/lib/trinity/utils';

export interface TarotNarrationChapter {
  id: 'card_anchor' | 'summary' | 'master_diagnosis' | 'action_remedy' | 'blessing_frequency';
  title: string;
  badge: string;
  iconType: 'sparkles' | 'eye' | 'compass' | 'sun';
  speechText: string;
  displayText: string;
}

export interface TarotNarrationData {
  hasResult: boolean;
  dateKey: string;
  card: {
    id?: string;
    nameKo: string;
    name: string;
    reversed: boolean;
    keywords: string[];
    imageUrl?: string;
  } | null;
  chapters: TarotNarrationChapter[];
  fullSpeech: string;
  rawDiagnosis: string;
  cleanDiagnosis: string;
  conciseSummaryBullets: string[];
  summarySpeechText: string;
  rawRemedy: string;
  rawBlessing: string;
  frequency: string;
  luckyNumber: string;
  luckyColor: string;
}

/**
 * 🚫 타로 텍스트에서 불필요한 후행 요약 블록을 말끔하게 정돈
 */
export function cleanDiagnosisText(raw: string): string {
  return stripSummaryFromTarotText(raw);
}

/**
 * 오늘 저장된 데일리 타로 결과 조회
 */
export function getTodayTrinityDailyResult(uid?: string): any | null {
  if (typeof window === 'undefined') return null;
  const today = getTodayDateKey();
  const candidateKeys = [
    `trinity_daily_result_${uid || 'guest'}_${today}`,
    `trinity_daily_result_guest_${today}`,
    `prism_daily_oracle_trinity_${today}`,
  ];

  for (const key of candidateKeys) {
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.diagnosis || parsed?.summary || parsed?.prescription || parsed?.drawnCard) {
          if (parsed.dateKey && parsed.dateKey !== today) continue;
          return parsed;
        }
      }
    } catch (_) {}
  }
  return null;
}

/**
 * 🌟 오늘 전체 운기를 관통하는 데일리 지배 타로 카드 조회
 * 저장된 데일리 카드가 있으면 우선 반환하고, 미선택 시 오늘 날짜 기반의 결정론적 앵커 카드를 반환
 */
export function getTodayAnchorTarotCard(uid?: string): TarotCard {
  const daily = getTodayTrinityDailyResult(uid);
  if (daily?.drawnCard) {
    return daily.drawnCard;
  }
  const todayKey = getTodayDateKey();
  let hash = 0;
  for (let i = 0; i < todayKey.length; i++) {
    hash = (hash << 5) - hash + todayKey.charCodeAt(i);
    hash |= 0;
  }
  const majorDeck = TAROT_DECK.filter((c) => c.type === 'major');
  const index = Math.abs(hash) % majorDeck.length;
  return majorDeck[index];
}

/**
 * 데일리 타로 결과를 바탕으로 낭독 버전 챕터와 음성 텍스트를 구조화
 */
export function buildTarotNarrationContent(dailyResult: any): TarotNarrationData {
  const today = getTodayDateKey();
  if (!dailyResult) {
    return {
      hasResult: false,
      dateKey: today,
      card: null,
      chapters: [],
      fullSpeech: '',
      rawDiagnosis: '',
      cleanDiagnosis: '',
      conciseSummaryBullets: [],
      summarySpeechText: '',
      rawRemedy: '',
      rawBlessing: '',
      frequency: '528Hz',
      luckyNumber: '7',
      luckyColor: '골드',
    };
  }

  const drawnCard: TarotCard | null = dailyResult.drawnCard || null;
  const nameKo = drawnCard?.nameKo || drawnCard?.name || '운명의 카드';
  const nameEn = drawnCard?.name || '';
  const isReversed = !!drawnCard?.reversed;
  const orientationStr = isReversed ? '역방향 (Reversed)' : '정방향 (Upright)';
  const orientationSpeech = isReversed ? '역방향' : '정방향';
  const keywords = drawnCard?.keywords && drawnCard.keywords.length > 0
    ? drawnCard.keywords
    : ['변화', '직관', '도약', '조율'];
  const imageUrl = getTarotCardImageUrl(drawnCard);

  const rawSourceText = String(
    dailyResult.diagnosis ||
    dailyResult.summary ||
    dailyResult.prescription ||
    dailyResult.reading ||
    '오늘 하루는 내면의 직관과 차분한 호흡에 집중할 때 가장 맑고 조화로운 길이 열립니다.'
  ).trim();

  const dedupedSourceText = deduplicateReadingText(rawSourceText);

  const fullSourceText = deduplicateReadingText(
    ensureCompleteTarotReading(
      dedupedSourceText,
      "오늘의 데일리 타로 리딩",
      drawnCard ? [drawnCard] : []
    )
  );

  const conciseSummaryBullets = extractConciseSummary(fullSourceText, drawnCard || dailyResult);
  const cleanDiag = cleanDiagnosisText(fullSourceText);

  const summarySpeechText = prepareNaturalSpeechText(
    conciseSummaryBullets.length > 0
      ? conciseSummaryBullets.map((b) => b.replace(/^\[[^\]]+\]\s*/, '')).join('. ')
      : `${nameKo} 카드가 오늘 하루 당신에게 전하는 명쾌한 방향과 실천 처방입니다.`
  );

  const rawRemedy = String(
    dailyResult.remedy ||
    '사소한 불안이나 타인의 시선에 휘둘리지 말고, 지금 마주한 일에 고요히 몰입하며 마음의 중심을 지키세요.'
  ).trim();

  const frequency = String(dailyResult.frequency || '528Hz 솔페지오 사랑과 치유의 주파수').trim();
  const luckyNumber = String(dailyResult.luckyNumber || '7').trim();
  const luckyColor = String(dailyResult.luckyColor || '황금빛 골드').trim();
  const rawBlessing = String(
    dailyResult.blessingMessage ||
    dailyResult.spiritualEnergy ||
    '오늘 하루 당신이 내딛는 모든 발걸음 위에 우주의 깊은 평온과 명쾌한 통찰이 함께하길 축복합니다.'
  ).trim();

  // Chapter 1: 카드 선언과 상징 파동
  const ch1Speech = prepareNaturalSpeechText(
    `오늘 당신의 우주적 나침반이 비춘 타로 카드는 ${nameKo}, ${orientationSpeech}입니다. 이 카드는 ${keywords.slice(0, 3).join(', ')}의 상징 파동을 품고 있습니다.`
  );
  const ch1Display = `✨ 오늘의 지배 카드: [${nameKo}${nameEn ? ` (${nameEn})` : ''}] · ${orientationStr}\n` +
    `카드의 핵심 에너지 키워드는 ${keywords.join(', ')}입니다. 오늘 하루 내면의 나침반을 이 카드의 상징에 조율하세요.`;

  // Chapter 2: 핵심 3줄 요약
  const chSummarySpeech = summarySpeechText;
  const chSummaryDisplay = conciseSummaryBullets.join('\n');

  // Chapter 3: 마스터 심층 비전 해독 (5단계 마크다운 전체)
  const ch3Speech = prepareNaturalSpeechText(cleanDiag);
  const ch3Display = cleanDiag;

  // Chapter 4: 행운의 주파수와 축복 확언
  const ch4Speech = prepareNaturalSpeechText(
    `오늘의 우주적 조화 주파수는 ${frequency}이며, 행운의 숫자는 ${luckyNumber}, 행운의 색은 ${luckyColor}입니다. ${rawBlessing}`
  );
  const ch4Display = `• 조화 주파수: ${frequency}\n• 행운의 숫자: ${luckyNumber}\n• 행운의 색상: ${luckyColor}\n• 오늘의 축복 확언: ${rawBlessing}`;

  const chapters: TarotNarrationChapter[] = [
    {
      id: 'card_anchor',
      title: '오늘의 카드 선언과 상징',
      badge: 'Chapter 1 · 상징 파동',
      iconType: 'sparkles',
      speechText: ch1Speech,
      displayText: ch1Display,
    },
    ...(conciseSummaryBullets.length > 0
      ? [
          {
            id: 'summary' as const,
            title: '핵심 3줄 요약',
            badge: 'Quick Summary · 핵심 요약',
            iconType: 'sparkles' as const,
            speechText: chSummarySpeech,
            displayText: chSummaryDisplay,
          },
        ]
      : []),
    {
      id: 'master_diagnosis',
      title: '마스터 심층 비전 리딩',
      badge: 'Chapter 2 · 심층 리딩',
      iconType: 'eye',
      speechText: ch3Speech,
      displayText: ch3Display,
    },
    {
      id: 'blessing_frequency',
      title: '행운의 주파수와 축복 확언',
      badge: 'Chapter 3 · 에너지 축복',
      iconType: 'sun',
      speechText: ch4Speech,
      displayText: ch4Display,
    },
  ];

  const cautionSpeech = "주의사항을 전해드립니다. 타로는 정해진 미래를 맹목적으로 따르기 위한 것이 아니며, 현재의 마음을 비추고 현명한 선택을 돕는 내면의 성찰 도구입니다. 맹목적인 믿음을 지양하고, 모든 운명의 결정권과 최종 열쇠는 언제나 당신 자신의 주체적인 지혜와 용기에 있음을 기억하세요.";

  // Full unified narration flow
  const fullSpeech = prepareNaturalSpeechText(
    `${ch1Speech} ${chSummarySpeech ? `핵심 요약입니다. ${chSummarySpeech}. ` : ''}전체 심층 리딩입니다. ${ch3Speech} ${ch4Speech} ${cautionSpeech}`
  );

  return {
    hasResult: true,
    dateKey: today,
    card: drawnCard
      ? {
          id: drawnCard.id,
          nameKo,
          name: nameEn,
          reversed: isReversed,
          keywords,
          imageUrl,
        }
      : null,
    chapters,
    fullSpeech,
    rawDiagnosis: fullSourceText,
    cleanDiagnosis: cleanDiag,
    conciseSummaryBullets,
    summarySpeechText,
    rawRemedy,
    rawBlessing,
    frequency,
    luckyNumber,
    luckyColor,
  };
}

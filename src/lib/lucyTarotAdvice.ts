import { getEffectiveTarotKeywords, getTarotReversedData } from '@/data/tarotData';
import { invokeLLMStructured } from '@/lib/ai';
import { z } from 'zod';
import { getTarotCardDetails } from '@/lib/dailyTarotOracle';
import { hasKoreanJongseong } from '@/lib/tarotSummaryUtils';

export interface LucyTarotAdvice {
  headline: string;
  advice: string;
  actionTip: string;
  speechText: string;
  keyword: string;
}

export interface LucyTarotAdviceParams {
  cards?: any[] | null;
  tarotConcern?: string;
  readingText?: string;
  nickname?: string;
  mode?: 'standard' | 'daily' | 'oracle';
  oracleMode?: 'healing' | 'growth' | 'miracle';
  saju?: any;
}

const LucyTarotAdviceSchema = z.object({
  headline: z.string().max(24).describe("루시의 짧은 핵심 제목 (24자 이내, 존댓말 어조)"),
  advice: z.string().max(140).describe("따뜻하고 명쾌한 조언 (해요체 존댓말, 1~2문장, 140자 이내)"),
  actionTip: z.string().max(80).describe("구체적인 실천 팁 1가지 (해요체 존댓말, 1문장, 80자 이내)"),
  keyword: z.string().describe("에너지 키워드 태그 (예: #직관과확신 #마음의평온)"),
});

// Cache for quick recall without redundant generation
const adviceCache = new Map<string, LucyTarotAdvice>();

function buildCacheKey(params: LucyTarotAdviceParams): string {
  const cardIds = (params.cards || []).map((c) => `${c.id || c.nameKo}_${c.reversed ? 'rev' : 'up'}`).join('-');
  const concern = (params.tarotConcern || 'daily').trim().slice(0, 30);
  const modeKey = `${params.mode || 'std'}_${params.oracleMode || 'none'}`;
  return `${cardIds}::${concern}::${modeKey}::${params.nickname || 'guest'}`;
}

/**
 * Creates clean spoken text for TTS without markdown, symbols, or emojis.
 */
export function buildLucyAdviceSpeechText(headline: string, advice: string, actionTip: string): string {
  const cleanHead = headline.replace(/[#*`_~[\](){}<>💡✨🌿🔮🕯️🎴]/g, '').trim();
  const cleanAdv = advice.replace(/[#*`_~[\](){}<>💡✨🌿🔮🕯️🎴]/g, '').trim();
  const cleanTip = actionTip.replace(/[#*`_~[\](){}<>💡✨🌿🔮🕯️🎴]/g, '').trim();
  return `${cleanHead}. ${cleanAdv} 오늘의 실천: ${cleanTip}`;
}

function isConcisePoliteKorean(text: string, maxChars: number, maxSentences: number): boolean {
  const value = text.trim();
  if (!value || value.length > maxChars) return false;
  const sentences = value.split(/(?<=[.!?。！？])\s+/).filter(Boolean);
  if (sentences.length === 0 || sentences.length > maxSentences) return false;
  return sentences.every((sentence) => /(?:요|습니다|세요|십시오|죠|예요|이에요|랍니다|게요)[.!?。！？…]*["'”’)]*$/u.test(sentence.trim()));
}

/**
 * Generates an instantaneous, rich, deterministic advice from Lucy based on the drawn cards and concern.
 * 100% reliable offline, sub-millisecond latency.
 */
export function buildDeterministicLucyAdvice(params: LucyTarotAdviceParams): LucyTarotAdvice {
  const concern = (params.tarotConcern || '').trim();
  const primaryCard = params.cards && params.cards.length > 0
    ? params.cards[params.cards.length - 1] // Last card in spread or single drawn card
    : null;
  const isReversed = !!primaryCard?.reversed;
  const cardName = primaryCard?.nameKo || primaryCard?.name || '운명의 인도자';
  const details = primaryCard ? getTarotCardDetails(primaryCard) : null;
  const revData = isReversed && primaryCard ? getTarotReversedData(primaryCard) : null;
  const meaning = (isReversed ? revData?.meaning : details?.uprightCore) || '현재의 선택을 돌아보는 관점';
  const meaningObject = `${meaning}${hasKoreanJongseong(meaning) ? '을' : '를'}`;
  const suit = primaryCard?.id?.startsWith('wands_') ? 'wands'
    : primaryCard?.id?.startsWith('cups_') ? 'cups'
    : primaryCard?.id?.startsWith('swords_') ? 'swords'
    : primaryCard?.id?.startsWith('pent_') ? 'pentacles'
    : primaryCard?.type === 'major' ? 'major' : 'general';
  const mode = params.mode === 'oracle' ? params.oracleMode : params.mode;

  let headline = `${cardName}${isReversed ? ' 역방향' : ''}의 핵심`;
  let advice = `${cardName}${isReversed ? ' 역방향' : ''}은 ${meaningObject} 살펴보라는 뜻이에요. 지금은 중요한 결정을 서두르기보다 확인할 조건을 먼저 점검해요.`;
  let actionTip = '확인할 조건 한 가지를 메모하고, 사실과 추측을 나누어 살펴보세요.';
  let keyword = '#차분한점검 #현실적인선택';

  if (mode === 'healing') {
    headline = '마음에 필요한 쉼';
    advice = isReversed
      ? `${cardName} 역방향은 ${meaningObject} 돌아보고 속도를 늦추라는 신호예요. 오늘은 필요한 휴식을 먼저 챙겨요.`
      : `${cardName} 카드가 마음의 회복을 비춰요. 오늘은 무리한 일정 하나를 덜어내고 여유를 챙겨요.`;
    actionTip = '오늘 일정에서 15분을 비워 조용히 쉬어 보세요.';
    keyword = '#마음의안식 #회복';
  } else if (mode === 'miracle') {
    headline = '평화를 선택하는 관점';
    advice = isReversed
      ? `${cardName} 역방향은 ${meaningObject} 살펴보라는 뜻이에요. 불안할 때는 판단을 잠시 미루고 확인된 사실부터 봐요.`
      : `${cardName} 카드는 상황을 다른 관점에서 바라보라고 해요. 두려움에 휩쓸리기보다 평화를 주는 선택을 살펴봐요.`;
    actionTip = '불안한 생각과 확인된 사실을 한 줄씩 적어 보세요.';
    keyword = '#지각의전환 #평화';
  } else if (mode === 'growth') {
    headline = '작은 실행부터';
    advice = isReversed
      ? `${cardName} 역방향은 ${meaningObject} 점검하고 내실을 다지라는 신호예요. 목표를 작게 나누어 하나씩 진행해요.`
      : `${cardName} 카드는 잠재력을 현실의 행동으로 옮길 때예요. 오늘 할 수 있는 가장 작은 단계부터 시작해요.`;
    actionTip = '목표의 첫 단계를 정하고 10분 동안 실행해 보세요.';
    keyword = '#성장과실행 #작은시작';
  } else if (isReversed) {
    const revKws = primaryCard ? getEffectiveTarotKeywords(primaryCard) : [];
    headline = `${cardName} 역방향의 핵심`;
    advice = `${cardName} 역방향은 ${meaningObject} 살펴보라는 뜻이에요. 결정을 서두르지 말고 현실 조건을 확인해요.`;
    actionTip = '결정 전에 확인할 조건 한 가지를 메모해 보세요.';
    keyword = revKws.slice(0, 2).map((k) => `#${k.replace(/\s+/g, '')}`).join(' ') || keyword;
  } else if (suit === 'wands') {
    headline = '실행할 첫걸음';
    advice = `${cardName} 카드는 창의적인 시도를 비춰요. 아이디어를 현실에 옮길 가장 작은 단계를 정해요.`;
    actionTip = '미뤄 둔 일의 첫 단계를 10분만 시작해 보세요.';
    keyword = '#용기와실행 #새로운시도';
  } else if (suit === 'cups') {
    headline = '마음을 나누는 대화';
    advice = `${cardName} 카드는 감정과 관계를 돌아보게 해요. 상대의 마음을 추측하기보다 편안한 대화를 시도해요.`;
    actionTip = '전하고 싶은 말을 한 문장으로 적어 보세요.';
    keyword = '#공감과소통 #관계';
  } else if (suit === 'swords') {
    headline = '사실부터 차분히';
    advice = `${cardName} 카드는 명확한 판단을 돕는 상징이에요. 확인된 사실과 추측을 나누어 살펴봐요.`;
    actionTip = '고민의 핵심과 확인할 사실을 각각 한 줄로 적어 보세요.';
    keyword = '#명확한판단 #균형';
  } else if (suit === 'pentacles') {
    headline = '현실 조건 점검';
    advice = `${cardName} 카드는 시간과 자원을 현실적으로 살펴보라고 해요. 비용과 조건을 확인한 뒤 한 걸음씩 진행해요.`;
    actionTip = '예산이나 일정에서 확인할 항목 하나를 점검해 보세요.';
    keyword = '#현실감각 #차근차근';
  } else if (suit === 'major') {
    headline = '중요한 선택의 기준';
    advice = `${cardName} 카드는 중요한 전환점을 돌아보게 해요. 내가 지키고 싶은 가치와 현실 조건을 함께 살펴봐요.`;
    actionTip = '선택에서 가장 중요한 기준 한 가지를 적어 보세요.';
    keyword = '#전환과선택 #자기이해';
  }

  if (concern && (concern.includes('연애') || concern.includes('사랑') || concern.includes('재회'))) keyword += ' #마음의나침반';
  else if (concern && (concern.includes('취업') || concern.includes('이직') || concern.includes('사업') || concern.includes('돈'))) keyword += ' #풍요의기운';

  return { headline, advice, actionTip, speechText: buildLucyAdviceSpeechText(headline, advice, actionTip), keyword };
}

/**
 * Returns instant advice and launches non-blocking background enhancement if LLM is accessible.
 */
export async function getEnhancedLucyTarotAdvice(
  params: LucyTarotAdviceParams,
  onEnhanced?: (advice: LucyTarotAdvice) => void
): Promise<LucyTarotAdvice> {
  const cacheKey = buildCacheKey(params);
  if (adviceCache.has(cacheKey)) {
    return adviceCache.get(cacheKey)!;
  }

  const baseAdvice = buildDeterministicLucyAdvice(params);
  adviceCache.set(cacheKey, baseAdvice);

  // Background enhancement via LLM
  if (typeof window !== 'undefined') {
    setTimeout(async () => {
      try {
        const cardsSummary = (params.cards || [])
          .map((c) => {
            const d = getTarotCardDetails(c);
            const orient = c.reversed ? '역방향' : '정방향';
            const effKws = getEffectiveTarotKeywords(c);
            const revData = c.reversed ? getTarotReversedData(c) : null;
            const detailStr = d
              ? ` (원형: ${d.archetype}, 상징: ${d.symbolWord}, 본래 뜻: ${c.reversed ? (revData?.meaning || d.reversedCore) : d.uprightCore})`
              : '';
            return `${c.nameKo} (${orient}${effKws.length > 0 ? ` - ${effKws.slice(0, 3).join(', ')}` : ''})${detailStr}`;
          })
          .join(', ');

        const isHealingOracle = params.mode === 'oracle' && params.oracleMode === 'healing';
        const isGrowthOracle = params.mode === 'oracle' && params.oracleMode === 'growth';
        const isMiracleOracle = params.mode === 'oracle' && params.oracleMode === 'miracle';

        const cleanConcern = (params.tarotConcern || '')
          .replace(/^(?:제제의\s*치유\s*오라클|루시의\s*성장\s*오라클|기적수업\s*지각전환\s*오라클)$/, isHealingOracle ? '지친 마음의 온전한 쉼과 내면아이 치유' : isMiracleOracle ? '기적수업 지각의 전환과 참된 용서' : '현실적인 성장과 목표 실행')
          || (isHealingOracle ? '지친 마음의 온전한 쉼과 내면아이 치유' : isMiracleOracle ? '기적수업 지각의 전환과 참된 용서' : '오늘의 타로 운세');

        const systemPrompt = `당신은 따뜻하고 명쾌한 타로 안내자 루시입니다. 카드와 질문에 근거한 짧은 조언만 작성하세요.
${isMiracleOracle ? `\n기적수업 모드에서는 두려움보다 평화와 용서의 관점을 간결하게 안내하세요.\n` : ''}
[필수 원칙]
1. 문장 전체를 일관된 해요체 존댓말로 쓰세요. 반말을 섞지 마세요.
2. 닉네임은 '${params.nickname || '여행자'}'입니다. 부를 때만 '${params.nickname || '여행자'}님'으로 정확히 쓰고, 닉네임을 줄이거나 쪼개지 마세요.
3. 기능 이름이나 시스템 설명은 쓰지 마세요. 카드가 역방향이면 역방향 고유 의미만 간결히 설명하고 정방향 의미는 섞지 마세요. 화면에 주의 안내가 따로 있으므로 조언에서 주의 문구를 반복하지 마세요.
4. headline은 24자 이내, advice는 1~2문장·140자 이내, actionTip은 1문장·80자 이내로 쓰세요. 핵심을 반복하지 말고 구체적인 실천은 하나만 제안하세요.`;

        const userMsg = `질문자: ${params.nickname || '여행자'}
고민/질문: "${cleanConcern}"
타로 카드: [${cardsSummary || '주요 카드'}]
리딩 요약: ${params.readingText ? params.readingText.slice(0, 300) : '완전한 에너지 조율'}`;

        const aiResult = await invokeLLMStructured({
          schema: LucyTarotAdviceSchema,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMsg },
          ],
        });

        if (
          aiResult?.headline &&
          isConcisePoliteKorean(aiResult.advice, 140, 2) &&
          isConcisePoliteKorean(aiResult.actionTip || '', 80, 1)
        ) {
          const enhanced: LucyTarotAdvice = {
            headline: aiResult.headline,
            advice: aiResult.advice,
            actionTip: aiResult.actionTip || baseAdvice.actionTip,
            keyword: aiResult.keyword || baseAdvice.keyword,
            speechText: buildLucyAdviceSpeechText(aiResult.headline, aiResult.advice, aiResult.actionTip || baseAdvice.actionTip),
          };
          adviceCache.set(cacheKey, enhanced);
          onEnhanced?.(enhanced);
        }
      } catch (_) {
        // Fallback remains baseAdvice
      }
    }, 100);
  }

  return baseAdvice;
}

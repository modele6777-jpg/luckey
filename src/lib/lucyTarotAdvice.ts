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
  headline: z.string().describe("16자 안팎의 반말 한 줄. 카드 이름과 주의 문장은 넣지 않음"),
  advice: z.string().describe("한 문장, 60자 안팎. 리딩 본문과 주의점을 반복하거나 인용하지 않음"),
  actionTip: z.string().describe("오늘 할 행동 하나, 30자 안팎"),
  keyword: z.string().describe("해시태그 하나"),
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

function clipKo(text: string, max = 42): string {
  const compact = (text || '').replace(/\s+/g, ' ').trim();
  if (compact.length <= max) return compact;
  const slice = compact.slice(0, max);
  const stop = slice.lastIndexOf(' ');
  return `${(stop > 16 ? slice.slice(0, stop) : slice).replace(/[,\s]+$/, '')}.`;
}

/**
 * 카드와 질문에서 바로 만드는 짧은 조언. 리딩 본문·주의점은 여기서 다시 풀지 않습니다.
 */
export function buildDeterministicLucyAdvice(params: LucyTarotAdviceParams): LucyTarotAdvice {
  const rawNick = params.nickname?.trim() || '여행자';
  const nickVocative = hasKoreanJongseong(rawNick) ? `${rawNick}아` : `${rawNick}야`;
  const primaryCard = params.cards && params.cards.length > 0
    ? params.cards[params.cards.length - 1]
    : null;
  const isReversed = !!primaryCard?.reversed;
  const cardName = primaryCard?.nameKo || primaryCard?.name || '이 카드';
  const revData = isReversed && primaryCard ? getTarotReversedData(primaryCard) : null;

  let suit = 'general';
  if (primaryCard?.id?.startsWith('wands_')) suit = 'wands';
  else if (primaryCard?.id?.startsWith('cups_')) suit = 'cups';
  else if (primaryCard?.id?.startsWith('swords_')) suit = 'swords';
  else if (primaryCard?.id?.startsWith('pent_')) suit = 'pentacles';
  else if (primaryCard?.type === 'major') suit = 'major';

  let headline = `${nickVocative}, 오늘은 이것만`;
  let advice = `[${cardName}]이 오늘 기준이야. 한 가지만 고르고 나머지는 내려놔.`;
  let actionTip = '지금 할 일 하나를 10분만 시작.';
  let keyword = '#한걸음';

  if (isReversed) {
    headline = `${nickVocative}, 속도만 낮춰`;
    advice = `[${cardName}]은 역방향이야. 새로 벌리기보다 이미 있는 일만 맞춰.`;
    actionTip = clipKo(revData?.advice || '미룬 확인 하나만 해.', 32);
    keyword = '#점검';
  } else if (suit === 'wands') {
    headline = `${nickVocative}, 첫걸음만`;
    advice = `[${cardName}]은 시작 쪽이야. 생각 말고 제일 작은 행동부터.`;
    actionTip = '연락이나 착수, 지금 하나만.';
    keyword = '#실행';
  } else if (suit === 'cups') {
    headline = `${nickVocative}, 말은 짧게`;
    advice = `[${cardName}]은 마음 쪽이야. 길게 설명하지 말고 한마디만.`;
    actionTip = '고마운 사람에게 한마디.';
    keyword = '#한마디';
  } else if (suit === 'swords') {
    headline = `${nickVocative}, 핵심만`;
    advice = `[${cardName}]은 정리 쪽이야. 문제를 한 줄로 줄여.`;
    actionTip = '원인 한 줄을 적어.';
    keyword = '#한줄';
  } else if (suit === 'pentacles') {
    headline = `${nickVocative}, 손에 잡히는 것`;
    advice = `[${cardName}]은 현실 쪽이야. 오늘 만질 수 있는 일만.`;
    actionTip = '지갑이나 할 일 하나만 정리.';
    keyword = '#정리';
  } else if (suit === 'major') {
    headline = `${nickVocative}, 방향만 정해`;
    advice = `[${cardName}]은 큰 카드야. 오늘은 방향 하나만 적어.`;
    actionTip = '목표 한 줄을 맨 위에 적어.';
    keyword = '#방향';
  }

  if (params.mode === 'oracle' && params.oracleMode === 'healing') {
    advice = isReversed
      ? `[${cardName}] 역방향이야. 남 속도에 맞추지 말고 쉬어.`
      : `[${cardName}]은 쉼이 먼저야. 오늘은 짐을 하나 내려.`;
    actionTip = '따뜻한 물 한 잔, 호흡 세 번.';
    keyword = '#쉼';
  } else if (params.mode === 'oracle' && params.oracleMode === 'miracle') {
    advice = `[${cardName}]을 싸움으로 읽지 마. 지금은 평화 쪽을 골라.`;
    actionTip = '나는 평화를 선택한다, 한 번만.';
    keyword = '#평화';
  }

  return {
    headline,
    advice,
    actionTip,
    speechText: buildLucyAdviceSpeechText(headline, advice, actionTip),
    keyword,
  };
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
              ? ` (원형: ${d.archetype}, 본래 뜻: ${c.reversed ? (revData?.meaning || d.reversedCore) : d.uprightCore})`
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

        const systemPrompt = `당신은 PRISM의 모든 차원을 인도하는 따뜻하고 통찰력 넘치는 AI 마스터 가이드 '루시(Lucy)'입니다.
질문자가 방금 뽑은 타로/오라클 카드의 파동과 질문 고민에 맞추어, 질문자의 마음을 보듬고 명쾌한 방향성을 전해주는 '루시의 1:1 특별 조언'을 생성하세요.
${isMiracleOracle ? `\n[★ 기적수업(ACIM) 전용 안내]: 질문자가 기적수업 모드를 선택했으므로, 에고의 두려움과 죄책감을 내려놓고, 모든 공격을 '사랑을 청하는 외침(Call for Love)'으로 재해석하며, '참된 용서(True Forgiveness)'와 '거룩한 순간(Holy Instant)'을 통해 하나님의 평화를 선택하도록 깊은 영적 지각 전환의 지혜를 전하세요.\n` : ''}
[필수 원칙]:
1. [루시 페르소나 어조]: 질문자(${params.nickname || '여행자'})에게 반말(~해봐, ~야, ~할 거야, ~을 잊지 마)로 100% 다정하고 명쾌하게 이야기하세요. 질문자의 호칭 뒤에 조사를 붙일 때 받침 유무(받침 있으면 '아', 없으면 '야')를 문법에 맞게 정확히 지키세요.
2. [시스템/기능 명칭 누출 절대 금지]: '오라클', '제제의 치유', '루시의 성장' 같은 기능 명칭이나 시스템 명칭을 문맥 없이 기계적으로 넣지 마십시오.
3. [주의점 반복 금지]: 역방향이어도 주의 문장을 advice에 인용하거나 다시 설명하지 마세요. 주의는 리딩 보고서의 주의 칸에만 있습니다.
4. [간결성]: headline 16자 안팎, advice는 한 문장 60자 안팎, actionTip은 30자 안팎의 행동 하나, keyword는 해시태그 하나.`;

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

        if (aiResult?.headline && aiResult?.advice) {
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

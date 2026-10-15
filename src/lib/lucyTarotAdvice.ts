import { TarotCard } from '@/data/tarotData';
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
  headline: z.string().describe("루시의 한 줄 핵심 통찰 (반말 친근한 톤, 15자 내외)"),
  advice: z.string().describe("루시가 질문자에게 건네는 따뜻하고 명쾌한 1:1 맞춤 조언 (반말 친근한 톤, 2~3문장)"),
  actionTip: z.string().describe("오늘 즉시 실천할 수 있는 구체적인 행동 팁 1가지 (반말, 1문장)"),
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

/**
 * Generates an instantaneous, rich, deterministic advice from Lucy based on the drawn cards and concern.
 * 100% reliable offline, sub-millisecond latency.
 */
export function buildDeterministicLucyAdvice(params: LucyTarotAdviceParams): LucyTarotAdvice {
  const rawNick = params.nickname?.trim() || '여행자';
  const nickVocative = hasKoreanJongseong(rawNick) ? `${rawNick}아` : `${rawNick}야`;
  const concern = (params.tarotConcern || '').trim();
  const primaryCard = params.cards && params.cards.length > 0
    ? params.cards[params.cards.length - 1] // Last card in spread or single drawn card
    : null;
  const isReversed = !!primaryCard?.reversed;
  const cardName = primaryCard?.nameKo || primaryCard?.name || '운명의 인도자';
  const cardParticle = hasKoreanJongseong(cardName) ? '이' : '가';
  const details = primaryCard ? getTarotCardDetails(primaryCard) : null;
  const cardMeaning = details ? (isReversed ? details.reversedCore : details.uprightCore) : '';

  // 1. Oracle Tarot Mode
  if (params.mode === 'oracle') {
    if (params.oracleMode === 'healing') {
      const headline = isReversed
        ? `${nickVocative}, 지금은 조급해 말고 잠시 쉬어가도 돼`
        : `${nickVocative}, [${cardName}] 카드가 따스한 온기를 건네고 있어`;
      const advice = `오늘 모습을 드러낸 [${cardName}] 카드${cardParticle} 지친 마음에 깊은 쉼과 위로가 필요함을 다정하게 일깨워주고 있어. 남들의 기대나 세상의 속도에 쫓기듯 맞추려 애쓰지 마. 잠시 모든 짐을 내려놓고 편안히 숨을 고르는 것만으로도, 너는 이미 충분히 온전하고 소중해.`;
      const actionTip = `따뜻한 차 한 잔을 천천히 마시며, 가슴에 손을 얹고 깊은 심호흡 3번 하기.`;
      return {
        headline,
        advice,
        actionTip,
        speechText: buildLucyAdviceSpeechText(headline, advice, actionTip),
        keyword: `#마음의안식 #온전한치유`,
      };
    } else if (params.oracleMode === 'miracle') {
      const headline = isReversed
        ? `${nickVocative}, [${cardName}]의 두려움을 내려놓고 참된 평화를 선택해`
        : `${nickVocative}, [${cardName}]의 상징처럼 시선을 바꾸면 기적이 일어나`;
      const advice = `기적수업의 가르침처럼, 실재하는 너의 참된 평화는 세상 그 어떤 일로도 결코 위협받을 수 없어. 일어난 상황을 에고의 두려움 대신 사랑을 청하는 외침으로 바라볼 때, 너의 마음에 기적 같은 고요와 자유가 깃들 거야.`;
      const actionTip = `마음이 요동칠 때 "나는 이것 대신 평화를 보기를 선택한다"고 가만히 선언하기.`;
      return {
        headline,
        advice,
        actionTip,
        speechText: buildLucyAdviceSpeechText(headline, advice, actionTip),
        keyword: `#지각의전환 #참된용서`,
      };
    } else {
      // Growth Mode
      const headline = isReversed
        ? `${nickVocative}, [${cardName}]의 교훈처럼 내실을 먼저 단단히 다져봐`
        : `${nickVocative}, [${cardName}]의 뜻처럼 네 직관이 가리키는 곳으로 나아가`;
      const advice = `오늘 모습을 드러낸 [${cardName}] 카드${cardParticle} 네 안의 소중한 잠재력이 꽃피울 준비를 마쳤음을 선명하게 비춰주고 있어. 두려움에 머뭇거리기보다, 오늘 네 손으로 이룰 수 있는 작은 실행 하나에 집중해 봐. 넌 이미 해낼 충분한 힘을 품고 있어.`;
      const actionTip = `오늘 할 일 중 가장 중요한 1가지를 정하고 망설임 없이 15분간 몰입해 보기.`;
      return {
        headline,
        advice,
        actionTip,
        speechText: buildLucyAdviceSpeechText(headline, advice, actionTip),
        keyword: `#도약과실행 #성장모멘텀`,
      };
    }
  }

  // 2. Standard / Daily Tarot Mode with Card-Specific Resonance
  let suit = 'general';
  if (primaryCard?.id?.startsWith('wands_')) suit = 'wands';
  else if (primaryCard?.id?.startsWith('cups_')) suit = 'cups';
  else if (primaryCard?.id?.startsWith('swords_')) suit = 'swords';
  else if (primaryCard?.id?.startsWith('pent_')) suit = 'pentacles';
  else if (primaryCard?.type === 'major') suit = 'major';

  let headline = `${nickVocative}, [${cardName}]의 파동이 오늘 네 길을 밝히고 있어`;
  let advice = `오늘 카드가 비추는 핵심은 내면의 신뢰야. 외부의 소음에 흔들리지 말고 네 마음의 중심을 굳건히 세워봐.`;
  let actionTip = `창밖 하늘을 바라보며 깊은 심호흡 3번으로 머릿속을 맑게 비우기.`;
  let keyword = `#직관과확신 #운명의빛`;

  if (suit === 'wands') {
    if (isReversed) {
      headline = `${nickVocative}, 서두르지 말고 에너지를 한곳에 모아봐`;
      advice = `[${cardName}] 카드는 열정이 분산되어 번아웃이 오지 않도록 주의하라는 신호야. 오늘은 여러 일을 벌이기보다 가장 중요한 한 가지에 집중해 봐.`;
      actionTip = `오늘 꼭 끝내야 할 우선순위 1가지만 수첩에 적고 나머지는 잠시 내려놓기.`;
      keyword = `#선택과집중 #호흡조절`;
    } else {
      headline = `${nickVocative}, 네 가슴속 불꽃을 믿고 당당히 행동해 봐`;
      advice = `[${cardName}] 카드가 역동적인 창조의 힘을 건네고 있어. 생각만 하던 계획을 망설이지 말고 행동으로 옮기면 놀라운 결과가 열릴 거야.`;
      actionTip = `망설였던 연락이나 실행을 지금 즉시 첫걸음 떼어보기.`;
      keyword = `#용기와실행 #뜨거운열정`;
    }
  } else if (suit === 'cups') {
    if (isReversed) {
      headline = `${nickVocative}, 감정의 소용돌이에서 한 발짝 물러서 봐`;
      advice = `[${cardName}] 카드는 타인의 감정이나 기대에 휘둘리지 말고 스스로의 감정을 먼저 안아주라고 말해. 네 평온이 세상에서 가장 소중해.`;
      actionTip = `미온수 한 잔을 천천히 마시며 '나는 지금 평온하다' 속으로 말해보기.`;
      keyword = `#감정의이완 #마음의중심`;
    } else {
      headline = `${nickVocative}, 너 자신과 주변을 향해 사랑의 마음을 열어봐`;
      advice = `[${cardName}] 카드는 따스한 교감과 공감의 기운을 전하고 있어. 진심 어린 미소와 다정한 한마디가 막혔던 관계의 문을 부드럽게 열어줄 거야.`;
      actionTip = `고마운 사람이나 스스로에게 '고마워, 수고했어'라는 다정한 한마디 건네기.`;
      keyword = `#사랑과조화 #다정한연결`;
    }
  } else if (suit === 'swords') {
    if (isReversed) {
      headline = `${nickVocative}, 머릿속 걱정의 고리를 끊고 단순해져 봐`;
      advice = `[${cardName}] 카드는 지나친 생각과 불안이 현실을 가리고 있음을 짚어주고 있어. 머리로 모든 것을 계산하려 하지 말고 몸을 움직여 봐.`;
      actionTip = `가벼운 스트레칭이나 산책으로 머릿속 복잡한 생각을 비워내기.`;
      keyword = `#생각비우기 #명쾌한휴식`;
    } else {
      headline = `${nickVocative}, 명쾌한 통찰과 결단으로 길을 뚫어봐`;
      advice = `[${cardName}] 카드가 지혜의 칼날처럼 명확한 판단력을 선물하고 있어. 모호한 상황을 두려워하지 말고, 네 원칙에 따라 솔직하게 소통해 봐.`;
      actionTip = `문제가 되는 상황의 핵심 원인을 종이에 단 1줄로 요약해 보기.`;
      keyword = `#지혜와결단 #명확한시선`;
    }
  } else if (suit === 'pentacles') {
    if (isReversed) {
      headline = `${nickVocative}, 조급한 결실보다 눈앞의 현실적 기반을 점검해 봐`;
      advice = `[${cardName}] 카드는 기초가 탄탄해야 큰 열매를 맺을 수 있음을 일깨워주고 있어. 단기적인 이익이나 결과에 집착하지 말고, 작은 루틴과 건강부터 차근차근 챙겨봐.`;
      actionTip = `지출 내역을 점검하거나 오늘 먹은 음식을 건강하게 되돌아보기.`;
      keyword = `#현실점검 #기반다지기`;
    } else {
      headline = `${nickVocative}, 네가 흘린 땀과 노력은 결코 배신하지 않아`;
      advice = `[${cardName}] 카드의 풍요로운 대지가 네 곁에 있어. 매일 꾸준히 쌓아온 너만의 정성이 이제 든든한 결실로 나타나기 시작할 거야. 스스로의 가치를 굳게 믿어.`;
      actionTip = `오늘 나를 위해 작지만 확실한 보상(맛있는 간식이나 편안한 휴식) 선물하기.`;
      keyword = `#풍요와안정 #성실의결실`;
    }
  } else if (suit === 'major') {
    if (isReversed) {
      headline = `${nickVocative}, 거대한 전환점 앞에서는 내면의 중심이 제일 중요해`;
      advice = `[${cardName}] 메이저 카드의 역방향 파동은 무리하게 상황을 통제하려 하지 말고 흐름을 유연하게 수용하라는 우주의 신호야. 때로는 힘을 뺄 때 가장 큰 지혜가 생겨나.`;
      actionTip = `눈을 감고 1분간 어깨와 턱의 힘을 툭 빼며 호흡에 머물기.`;
      keyword = `#수용과이완 #내면의지혜`;
    } else {
      headline = `${nickVocative}, 우주가 네 삶에 거대한 축복의 문을 열어주고 있어`;
      advice = `[${cardName}] 메이저 카드가 전하는 영혼의 메시지는 명확해. 지금 네가 겪는 모든 순간이 더 큰 너로 나아가기 위한 소중한 여정이야. 가슴 뛰는 방향을 향해 당당히 걸어가.`;
      actionTip = `오늘 가장 설레는 목표를 다이어리 맨 윗줄에 굵게 적어두기.`;
      keyword = `#운명의축복 #새로운도약`;
    }
  }

  // Concern context tuning
  if (concern && concern.includes('연애') || concern.includes('사랑') || concern.includes('재회')) {
    keyword += ' #마음의나침반';
  } else if (concern && concern.includes('취업') || concern.includes('이직') || concern.includes('사업') || concern.includes('돈')) {
    keyword += ' #풍요의기운';
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
            const detailStr = d
              ? ` (원형: ${d.archetype}, 상징: ${d.symbolWord}, 본래 뜻: ${c.reversed ? d.reversedCore : d.uprightCore})`
              : '';
            return `${c.nameKo} (${orient}${c.keywords ? ` - ${c.keywords.slice(0, 3).join(', ')}` : ''})${detailStr}`;
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
3. [★ 카드 상징과 본래 뜻 중심 리딩]: 질문자가 뽑은 카드([${cardsSummary || '타로 카드'}])의 고유한 도상 상징과 본질적인 의미(정/역방향의 깊은 뜻)를 조언의 가장 중요한 근거로 삼아, 카드의 본래 뜻을 중심으로 질문 고민("${cleanConcern}")을 따뜻하고 유려한 한국어로 풀어내세요.
4. [간결성]: 길게 늘어놓지 말고 headline(15자 내외 - 카드의 뜻 반영), advice(2~3문장 - 카드의 상징과 본래 의미를 자연스럽게 담을 것), actionTip(1문장 실천), keyword(#키워드 2개)로 산뜻하게 정돈하세요.`;

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

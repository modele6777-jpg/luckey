/**
 * 타로 리딩 핵심 3줄 요약 추출 및 하단 중복 요약 블록 분리 유틸리티
 */
import { getEffectiveTarotKeywords, getTarotCardCaution, getTarotReversedData } from '../data/tarotData';

type SummaryRole = 'insight' | 'direction' | 'action';

function splitSummarySentences(text: string): string[] {
  return text
    .replace(/\s*\n+\s*/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length >= 4);
}

function isIconographyCaption(line: string): boolean {
  const visual = /카드\s*속|그림\s*속|도상|모습은|성배를\s*마주|완벽한\s*대칭|인물이|건네는\s*모습/.test(line);
  if (!visual) return false;
  return !/하세요|해\s*보세요|해야|마십시오|마세요|주의하|오해|상대|연락|직장|이직|투자|시험|대화|확인하|관계|재회|님/.test(line);
}

function isHollowCautionTeaser(line: string): boolean {
  const teaser = /주의할\s*점(?:은|이)?(?:\s*[가-힣]{0,8})?\s*있(?:습니다|어요)|주의(?:가\s*필요|해야\s*할\s*부분)(?:합니다|해요)|조심해야\s*할\s*(?:점|부분)(?:이|은)?\s*있/.test(line);
  if (!teaser) return false;
  return !/않도록|하지\s*마|마세요|마십시오|말고/.test(line);
}

function isDanglingAction(line: string): boolean {
  if (!/이\s*작은\s*행동|이러한\s*행동|이\s*실천|그\s*작은\s*행동|첫\s*단추|이\s*한\s*걸음/.test(line)) return false;
  return !/(?:하세요|해\s*보세요|보십시오|적어|보내|확인하|정리하|비교하|점검하|말해|물어|나눠)/.test(line);
}

function isCautionOnlySentence(line: string): boolean {
  return /않도록\s*주의|주의하세요|주의하십시오|주의할\s*점/.test(line)
    && !/메시지|적어|보내|전화|정리|비교|점검|확인하|물어|말해/.test(line);
}

const SUMMARY_TEMPLATE_FILLER = /직관의\s*나침반|고유한\s*직관|기운을\s*순환|물\s*한\s*잔|맑고\s*역동적인|내면의\s*빛|운을\s*활짝|도약과\s*확신의\s*타이밍|미뤄둔\s*핵심\s*과제|긍정적인\s*파동이\s*충만|적극적인\s*행동을\s*취할\s*때/;

function isHollowSummaryLine(line: string, role: SummaryRole): boolean {
  const s = line.replace(/\s+/g, ' ').trim();
  if (s.length < 8) return true;
  if (SUMMARY_TEMPLATE_FILLER.test(s)) return true;
  if (isIconographyCaption(s) && role !== 'direction') return true;
  if (isHollowCautionTeaser(s)) return true;
  if (role !== 'direction' && isCautionOnlySentence(s)) return true;
  if (role === 'action' && isDanglingAction(s)) return true;
  if (role === 'action' && !/(?:하세요|해\s*보세요|보십시오|적어|보내|확인|정리|비교|점검|말해|물어|나눠|실천|보완|준비)/.test(s)) return true;
  return false;
}

function summarySpecificity(line: string, role: SummaryRole): number {
  let score = 0;
  if (/않도록|하지\s*말|마세요|마십시오/.test(line)) score += role === 'direction' ? 4 : 1;
  if (/\[YES\]|\[NO\]|최종\s*(?:판정|결단)/.test(line)) score += 5;
  if (role === 'action' && /(?:하세요|해\s*보세요|보십시오)/.test(line)) score += 3;
  if (role === 'insight' && /불균형|오해|부담|부족|역방향|뜻|흐름|상태입니다/.test(line)) score += 4;
  return score;
}

function readingCards(cardContext: any): any[] {
  if (!cardContext) return [];
  if (Array.isArray(cardContext)) return cardContext.filter(Boolean);
  if (Array.isArray(cardContext.cards) && cardContext.cards.length) return cardContext.cards.filter(Boolean);
  if (cardContext.card) return [cardContext.card];
  if (cardContext.drawnCard) return [cardContext.drawnCard];
  if (cardContext.nameKo || cardContext.id || cardContext.name) return [cardContext];
  return [];
}

function keywordLabel(card: any): string {
  return getEffectiveTarotKeywords(card).slice(0, 2).filter(Boolean).join('·');
}

function suitOf(card: any): string {
  return String(card?.type || String(card?.id || '').split('_')[0] || '');
}

function groundedSummaryLine(card: any, role: SummaryRole): string {
  if (!card) return '';
  const name = card.nameKo || card.name || '이 카드';
  const particle = hasKoreanJongseong(name) ? '은' : '는';
  const rev = getTarotReversedData(card);
  const kw = keywordLabel(card);
  const suit = suitOf(card);

  if (role === 'insight') {
    if (card.reversed && rev.meaning) {
      const meaning = rev.meaning.replace(/^\[[^\]]+\]\s*/, '').trim();
      return `${name} 역방향은 ${meaning}`;
    }
    return kw
      ? `${name}${particle} ${kw}의 흐름입니다. 지금은 이 의미가 질문한 일에 어떻게 드러나는지가 핵심입니다.`
      : `${name}${particle} 지금 질문의 핵심 흐름을 가리키고 있습니다.`;
  }

  if (role === 'direction') {
    if (card.reversed && rev.caution) return rev.caution;
    if (suit === 'cups') return `${name} 쪽으로 마음을 맞추되, 상대가 알아주길 바라며 입을 닫거나 서운함을 혼자 키우지 않도록 주의하세요.`;
    if (suit === 'wands') return `${name}의 추진력을 쓰되, 준비와 순서를 건너뛴 채 의욕만으로 밀어붙이지 않도록 주의하세요.`;
    if (suit === 'swords') return `${name}의 판단을 따르되, 확인되지 않은 걱정을 사실로 단정하거나 말부터 날 세우지 않도록 주의하세요.`;
    if (suit === 'pentacles' || suit === 'pent') return `${name}의 현실 감각을 따르되, 비용과 조건을 확인하지 않은 채 손익만 보고 결정하지 않도록 주의하세요.`;
    return kw
      ? `${name}${particle} ${kw} 방향을 가리키지만, 아직 확인하지 않은 조건을 사실로 단정하지 않도록 주의하세요.`
      : `${name}의 흐름을 따르되, 아직 확인하지 않은 조건을 넘기지 않도록 주의하세요.`;
  }

  if (card.reversed && rev.advice && !SUMMARY_TEMPLATE_FILLER.test(rev.advice)) return rev.advice;
  if (suit === 'cups') return `오늘 상대에게 확인하고 싶은 점 한 가지를 추측 대신 짧은 말로 전해 보세요.`;
  if (suit === 'wands') return `오늘 미룬 일 가운데 첫 단계 하나만 정해 10분 안에 시작해 보세요.`;
  if (suit === 'swords') return `오늘 결정에 필요한 사실 한 가지를 적고, 확인된 것만 남겨 보세요.`;
  if (suit === 'pentacles' || suit === 'pent') return `오늘 비용·조건·기한 가운데 비어 있는 항목 하나를 적고 채워 보세요.`;
  return kw
    ? `오늘 ${name}의 ${kw.split('·')[0]}에 맞게, 확인할 사실 한 가지를 적고 그 일부터 처리해 보세요.`
    : `오늘 확인할 사실 한 가지를 적고, 그 항목부터 직접 처리해 보세요.`;
}

function groundedSummary(cardContext: any): Record<SummaryRole, string> {
  const cards = readingCards(cardContext);
  const lead = cards[0];
  const cautionCard = cards.find((card) => card?.reversed) || lead;
  const actionCard = cards.find((card) => card?.reversed && getTarotReversedData(card).advice) || lead;
  return {
    insight: groundedSummaryLine(lead, 'insight'),
    direction: groundedSummaryLine(cautionCard, 'direction') || (lead ? getTarotCardCaution(lead) : ''),
    action: groundedSummaryLine(actionCard, 'action'),
  };
}

function keepSubstantiveSentences(text: string, role: SummaryRole): string {
  const parts = splitSummarySentences(text);
  if (parts.length <= 1) return text.trim();
  const kept = parts.filter((part) => !isHollowSummaryLine(part, role));
  const pool = kept.length ? kept : parts;
  let acc = '';
  for (const part of pool) {
    const sentence = /[.!?]$/.test(part) ? part : `${part}.`;
    const next = acc ? `${acc} ${sentence}` : sentence;
    if (acc && next.length > 150) break;
    acc = next;
  }
  return (acc || text).trim();
}

/**
 * 🔮 트리니티 마스터 직관적 결단 섹션 및 리딩에서 YES / NO 보존 (예·아니오 타로의 핵심 지표)
 */
export function sanitizeTarotDecisionYesNo(text: string): string {
  if (!text) return "";
  // 예·아니오 타로 및 직관적 결단 리딩 시 YES / NO 판정을 있는 그대로 명확하게 보존합니다.
  return text;
}

/**
 * 🧹 타로 리딩 본문 중복 서술 및 2회 반복 생성 전면 방지 & 제거
 */
export function deduplicateReadingText(text: string): string {
  if (!text) return text;
  let resultText = text.trim();

  // 1. [핵심 3줄 요약] 블록이 2번 이상 출현하여 전체 리딩이 2회 반복된 경우
  const summaryBlockRegex = /(?:\r?\n|^)\s*(?:[-*•·\d.]+\s*)?(?:#{1,6}\s*)?(?:\[\s*)?핵심\s*(?:3줄|세줄)?\s*요약/gi;
  const summaryMatches = [...resultText.matchAll(summaryBlockRegex)];
  if (summaryMatches.length > 1) {
    const secondSumIdx = summaryMatches[1].index;
    if (secondSumIdx && secondSumIdx > 80) {
      const firstPart = resultText.slice(0, secondSumIdx).trim();
      // 첫 번째 파트에 본문 단계(1. 및 4. 또는 5. 축복)가 온전히 존재하면 두 번째 반복 덩어리 전면 절단
      if (firstPart.includes('1.') && (firstPart.includes('4.') || firstPart.includes('5.') || firstPart.includes('축복'))) {
        resultText = firstPart;
      }
    }
  }

  // 2. 전체 리딩 본문(1단계 헤더)이 2회 이상 출현하여 반복 생성된 경우 (모든 유니코드 이모지 및 마크다운 헤더 대응)
  const section1Regex = /(?:\r?\n|^)\s*#{2,4}\s*[^#\r\n\d]*1[\.\s][^\r\n]*/gui;
  const section1Matches = [...resultText.matchAll(section1Regex)];
  if (section1Matches.length > 1) {
    const secondIndex = section1Matches[1].index;
    if (secondIndex && secondIndex > 100) {
      // 1단계 바로 앞의 요약 헤더가 있다면 요약 헤더 위치부터 자름
      const preSlice = resultText.slice(0, secondIndex);
      const preSummary = preSlice.search(/(?:\r?\n)\s*(?:[-*•·\d.]+\s*)?(?:#{1,6}\s*)?(?:\[\s*)?핵심\s*(?:3줄|세줄)?\s*요약[^\r\n]*$/i);
      const cutPoint = preSummary !== -1 && preSummary > 80 ? preSummary : secondIndex;
      const firstPart = resultText.slice(0, cutPoint).trim();
      const secondPart = resultText.slice(secondIndex).trim();

      // 5단계 축복이 포함된 완전한 파트를 우선 선택
      if (firstPart.includes('5.') || firstPart.includes('축복') || firstPart.includes('영혼의 한마디') || firstPart.length >= secondPart.length) {
        resultText = firstPart;
      } else {
        resultText = secondPart;
      }
    }
  }

  // 3. 텍스트가 정확히 또는 거의 2등분으로 동일하게 반복된 경우 (A + A)
  const trimmed = resultText.trim();
  const halfLen = Math.floor(trimmed.length / 2);
  if (halfLen > 100) {
    const firstHalf = trimmed.slice(0, halfLen).trim();
    const secondHalf = trimmed.slice(halfLen).trim();
    if (firstHalf === secondHalf || secondHalf.startsWith(firstHalf.slice(0, 80))) {
      resultText = firstHalf;
    }
  }

  // 4. 연속된 중복 라인 또는 헤더 제거
  const lines = resultText.split('\n');
  const deduplicatedLines: string[] = [];
  let lastNonEmpty = '';

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      deduplicatedLines.push(line);
      continue;
    }
    if (trimmedLine === lastNonEmpty && trimmedLine.length > 5) {
      continue;
    }
    deduplicatedLines.push(line);
    lastNonEmpty = trimmedLine;
  }

  return deduplicatedLines.join('\n');
}

export function stripSummaryFromTarotText(text: string): string {
  if (!text) return "";
  let cleaned = deduplicateReadingText(sanitizeTarotDecisionYesNo(text)).trim();

  // 1. 선행 핵심 3줄 요약 블록 안전하게 제거 (상단에 그래픽 카드가 별도 렌더링되므로 본문 첫머리 중복 방지)
  // 본문 1단계 헤더(### ... 1. ...) 이전의 모든 선행 요약 블록을 깔끔히 도려냄
  const section1Match = cleaned.match(/(?:\r?\n|^)\s*#{2,4}\s*[^#\r\n\d]*1[\.\s][^\r\n]*/u);
  if (section1Match && section1Match.index !== undefined && section1Match.index > 0) {
    const preText = cleaned.slice(0, section1Match.index);
    if (/(?:핵심\s*(?:3줄|세줄|3대)?\s*요약|3줄\s*(?:핵심\s*)?요약|세줄\s*(?:핵심\s*)?요약|핵심\s*요약|Quick\s*Summary|Executive\s*Summary|3-Line\s*Summary|\[현재\s*에너지\]|\[오늘의\s*에너지\])/i.test(preText)) {
      cleaned = cleaned.slice(section1Match.index).trim();
    }
  } else {
    // 1단계 번호가 명시되지 않은 경우, 첫 번째 마크다운 본문 섹션(###) 이전의 요약 블록 제거
    const firstHeaderMatch = cleaned.match(/(?:\r?\n)\s*#{2,4}\s+[^\r\n]+/);
    if (firstHeaderMatch && firstHeaderMatch.index !== undefined && firstHeaderMatch.index > 0) {
      const preText = cleaned.slice(0, firstHeaderMatch.index);
      if (/(?:핵심\s*(?:3줄|세줄|3대)?\s*요약|3줄\s*(?:핵심\s*)?요약|세줄\s*(?:핵심\s*)?요약|핵심\s*요약|Quick\s*Summary|Executive\s*Summary|3-Line\s*Summary)/i.test(preText)) {
        cleaned = cleaned.slice(firstHeaderMatch.index).trim();
      }
    }
  }

  // 2. 후행 핵심 3줄 요약 블록 완전 분리 및 영구 제거
  // 본문에서 1단계 헤더 이후 출현하는 어떠한 형태의 요약 헤더도 즉시 하단 절단
  const trailingSummaryHeaderRegex = /(?:\r?\n|^)\s*(?:[-*•·\d.]+\s*)?(?:#{1,6}\s*)?(?:\*{1,2}|_{1,2})?\s*(?:[✨🌟🔮📌💡📋💎⚡🌿🎯■]\s*)*\s*(?:[\[【(])?\s*(?:[✨🌟🔮📌💡📋💎⚡🌿🎯■]\s*)*\s*(?:핵심\s*(?:3줄|세줄|3대)?\s*요약|3줄\s*(?:핵심\s*)?요약|세줄\s*(?:핵심\s*)?요약|핵심\s*요약|오늘의\s*(?:3줄|세줄)?\s*요약|Quick\s*Summary|Executive\s*Summary|3-Line\s*Summary)[^\]】)\r\n]*(?:[\]】)])?\s*(?:\*{1,2}|_{1,2})?\s*(?:[:—\-–~]|—[^\r\n]*)?(?:\r?\n|$)/i;

  const headerIdx = cleaned.search(trailingSummaryHeaderRegex);
  if (headerIdx !== -1) {
    // 1단계 시작 이후 발견된 요약 헤더는 100% 후행/중복 요약이므로 즉시 자름
    cleaned = cleaned.slice(0, headerIdx).trim();
  }

  // 3. 5단계(영혼의 한마디) 이후 남아 있는 명시적 요약 태그 라인만 안전하게 제거 (5단계 본문 문장 절단 절대 금지)
  const step5Pattern = /(?:###\s*(?:[^\r\n\d]*?)?5[\.\s]|5단계|영혼의\s*한마디|당신의\s*길을\s*축복하는|황금빛\s*축복)/i;
  const step5Match = cleaned.match(step5Pattern);
  if (step5Match && step5Match.index !== undefined) {
    const afterStep5 = cleaned.slice(step5Match.index);
    const trailingExplicitSummaryIdx = afterStep5.search(
      /(?:\r?\n)\s*(?:[-*•·\d.]+\s*)?(?:\*{1,2})?\s*\[(?:현재\s*에너지|오늘의\s*에너지|방향과\s*결단|실천\s*처방|상황\s*나침반|개운\s*액션|핵심\s*(?:3줄|세줄)?\s*요약)\]/i
    );
    if (trailingExplicitSummaryIdx !== -1) {
      cleaned = cleaned.slice(0, step5Match.index + trailingExplicitSummaryIdx).trim();
    }
  }

  // 4. 본문 끝에 불릿 형태로만 남겨진 잔여 요약 라인들을 모두 제거 (반복 제거)
  while (true) {
    const prevLen = cleaned.length;
    cleaned = cleaned.replace(/(?:\r?\n)\s*[-*•·\d.]+\s*(?:\*{1,2})?\s*(?:\[[^\]]+\]|현재\s*에너지|오늘의\s*에너지|방향과\s*결단|실천\s*처방|상황\s*나침반|개운\s*액션|머니\s*마인드셋|현금\s*흐름|부자\s*액션|영혼\s*주파수|빛의\s*나침반|과거\s*원인|현재\s*상황|미래\s*결실)[^\r\n]*$/i, '').trim();
    cleaned = cleaned.replace(/(?:\r?\n)\s*(?:#{1,6}\s*)?(?:[✨🌟🔮📌💡📋💎⚡🌿🎯■]\s*)*\s*(?:\[\s*)?(?:핵심\s*(?:3줄\s*|세줄\s*)?요약|3줄\s*요약|오늘의\s*요약|Quick\s*Summary)[^\r\n]*$/i, '').trim();
    if (cleaned.length === prevLen) break;
  }

  return deduplicateReadingText(cleaned);
}

export interface TarotSummaryContext {
  cards?: any[];
  card?: any;
  saju?: any;
  concern?: string;
  theme?: string;
  kind?: string;
  remedy?: string;
  nameKo?: string;
}

export function extractConciseSummary(text: string, cardContext?: any): string[] {
  if (!text || text.trim().length < 40) return [];

  const cleanSentence = (s: string) => {
    return s
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/_{1,2}/g, '')
      .replace(/^[-*•·\d.]+\s*/, '')
      .trim();
  };

  // 인사말, 호칭, 상담실 메타 서두 제거 헬퍼
  const stripGreetingFromText = (s: string): string => {
    let str = s.trim();
    str = str.replace(/^(?:(?:친애하는\s*)?(?:질문자|내담자)님[,\s~!]*)?(?:(?:어서\s*오세요|안녕하세요|반갑습니다|안녕하십니까)[,\s~!]*)+/i, '');
    str = str.replace(/^(?:(?:어서\s*오세요|안녕하세요|반갑습니다|안녕하십니까)[,\s~!]*)?(?:(?:친애하는\s*)?(?:질문자|내담자)님[,\s~!]*)*/i, '');
    str = str.replace(/^(?:카드를\s*(?:가만히|조용히|한\s*장씩)?\s*마주하니|촛불을\s*켜고|타로\s*상담실에\s*오신\s*것을\s*환영합니다)[,\s~!.]*/i, '');
    str = str.replace(/^(?:다음은|오늘의|타로\s*리딩의)?\s*(?:핵심\s*3줄\s*요약|3줄\s*요약|핵심\s*요약)(?:입니다|을\s*전해드립니다|:|\.)\s*/i, '');
    return str.trim();
  };

  const isGreetingOrMeta = (s: string) => {
    const trimmed = s.trim();
    if (!trimmed || trimmed.length < 5) return true;
    return (
      /(?:어서\s*오세요|안녕하세요|반갑습니다|안녕하십니까|환영합니다)/.test(trimmed) ||
      /(?:카드를\s*(?:가만히|조용히|한\s*장씩)?\s*마주하니|촛불|대화형\s*어조|적용\s*배열법|펼쳐진\s*카드|상담\s*개요|내담자\s*고민|상담실)/.test(trimmed)
    );
  };

  // 명사형/미완결형 어미를 자연스러운 완결형 한국어 문장으로 다듬는 헬퍼
  const ensureNaturalKoreanSentence = (str: string, rowIdx: number): string => {
    let s = str.trim().replace(/[\s.…·,-]+$/, '');
    if (!s) return s;

    // 앞문장이 그림 설명·주의 예고·행동 미지정인 경우 그 문장을 버리고, 내용이 있는 문장을 남긴다.
    // 125자에서 첫 마침표로 자르면 "주의할 점은 있습니다"만 남고 실제 주의·행동이 사라진다.
    const summaryRole: SummaryRole = rowIdx === 2 ? 'action' : rowIdx === 1 ? 'direction' : 'insight';
    s = keepSubstantiveSentences(s, summaryRole);
    if (s.length > 180) {
      const comma = s.lastIndexOf(',', 150);
      if (comma > 50) s = s.slice(0, comma).trim();
    }

    // 2. 어색한 명사형 종결(~하기, ~시키기, ~열기, ~다지기, ~갖기, ~세우기, ~만들기, ~전환하기 등)을 자연스러운 서술형 문장으로 변환
    s = s
      .replace(/순환시키고\s*긍정\s*운을\s*활짝\s*열기$/, '순환시키고 긍정적인 운의 흐름을 활짝 열어 보세요')
      .replace(/파동을\s*일으키기$/, '파동을 힘차게 일으켜 보세요')
      .replace(/기운을\s*순환시키기$/, '기운을 맑게 순환시켜 보세요')
      .replace(/충전하기$/, '충전해 보세요')
      .replace(/안아주기$/, '안아 주세요')
      .replace(/회복하기$/, '회복해 보세요')
      .replace(/전환하기$/, '전환해 보세요')
      .replace(/실천하기$/, '실천해 보세요')
      .replace(/완수하기$/, '완수해 보세요')
      .replace(/집중하기$/, '집중해 보세요')
      .replace(/점검하기$/, '점검해 보세요')
      .replace(/유지하기$/, '유지해 보세요')
      .replace(/기록하기$/, '기록해 보세요')
      .replace(/정돈하기$/, '정돈해 보세요')
      .replace(/비워내기$/, '비워내 보세요')
      .replace(/나아가기$/, '나아가 보세요')
      .replace(/시작하기$/, '시작해 보세요')
      .replace(/([가-힣]+)시키기$/, '$1시켜 보세요')
      .replace(/([가-힣]+)하기$/, '$1해 보세요')
      .replace(/([가-힣]+)열기$/, '$1열어 보세요')
      .replace(/([가-힣]+)다지기$/, '$1다져 보세요')
      .replace(/([가-힣]+)세우기$/, '$1세워 보세요')
      .replace(/([가-힣]+)만들기$/, '$1만들어 보세요')
      .replace(/([가-힣]+)찾기$/, '$1찾아 보세요')
      .replace(/([가-힣]+)갖기$/, '$1가져 보세요');

    // 3. 조사나 연결어미(~하고, ~하며, ~해서, ~인데, ~지만, ~으로, ~에서, ~의, ~을, ~를, ~이, ~가, ~은, ~는)로 중간에 끊긴 경우 자연스럽게 완결
    if (/(?:하고|하며|하면서|해서|하여)$/.test(s)) {
      s = s.replace(/(?:하고|하며|하면서|해서|하여)$/, rowIdx === 2 ? '해 보세요' : '하는 흐름입니다');
    } else if (/(?:이고|이며)$/.test(s)) {
      s = s.replace(/(?:이고|이며)$/, '입니다');
    } else if (/(?:인데|지만|으나|는데)$/.test(s)) {
      s = s.replace(/(?:인데|지만|으나|는데)$/, '는 흐름이니 마음의 중심을 단단히 잡으세요');
    } else if (/(?:으로|로)\s*$/.test(s) && !/(?:스스로|새로|바로)$/.test(s)) {
      s = `${s} 나아갈 때입니다`;
    }

    if (!/[.!?]$/.test(s)) {
      s += '.';
    }
    return s;
  };

  const formatSummaryLine = (tag: string, content: string, rowIdx: number): string => {
    let cleaned = stripGreetingFromText(content);
    cleaned = cleaned.replace(/^\[(?!YES\b|NO\b|조건부\s*YES)[^\]]+\]\s*(:|-|—)?\s*/i, '');
    cleaned = cleaned.replace(/^(?:현재\s*에너지|방향과\s*결단|실천\s*처방|개운\s*처방|행동\s*처방|실천\s*가이드|개운\s*가이드|상황\s*진단)\s*[:—\-]\s*/, '');
    cleaned = cleanSentence(cleaned);

    // A short, specific answer is better than unrelated spiritual padding.
    cleaned = ensureNaturalKoreanSentence(cleaned, rowIdx);
    return `[${tag}] ${cleaned}`;
  };

  let p1Current = '';
  let p1Decision = '';
  let p1Action = '';
  let tag1 = '';
  let tag2 = '';
  let tag3 = '';

  // Priority 1: Explicit [핵심 3줄 요약] block
  const summaryBlockMatch = text.match(
    /(?:\[핵심\s*(?:3줄\s*|세줄\s*)?요약\]|###\s*.*핵심\s*(?:3줄\s*|세줄\s*)?요약|###\s*.*핵심\s*요약|\[핵심\s*요약\]|Quick\s*Summary)([\s\S]*?)(?:$|###)/i
  );

  if (summaryBlockMatch) {
    const rawLines = summaryBlockMatch[1]
      .split('\n')
      .map((l) => cleanSentence(l))
      .filter((l) => l.length > 5 && !l.startsWith('http') && !isGreetingOrMeta(l));

    for (const line of rawLines) {
      const bracketMatch = line.match(/^\[([^\]]+)\]/);
      const rowTag = bracketMatch ? bracketMatch[1].trim() : '';
      const cleaned = stripGreetingFromText(line.replace(/^\[[^\]]+\]\s*/, ''));
      if (!cleaned || isGreetingOrMeta(cleaned)) continue;

      if (
        /\[(?:현재\s*에너지|현재\s*상황|내면\s*에너지|상황\s*진단|현재|에너지|상황)\]/i.test(line) ||
        (!p1Current && /^(?:현재\s*에너지|현재\s*상황|내면|에너지|상황\s*진단)/i.test(line))
      ) {
        if (!p1Current) { p1Current = cleaned; tag1 = rowTag; continue; }
      }
      if (
        /\[(?:방향과\s*결단|결단\s*(?:및|&)?\s*방향(?:성)?|방향성|결단|선택|판정|미래\s*흐름|전환점)\]/i.test(line) ||
        (!p1Decision && /^(?:방향과\s*결단|결단|방향|선택|판정|전환점)/i.test(line))
      ) {
        if (!p1Decision) { p1Decision = cleaned; tag2 = rowTag; continue; }
      }
      if (
        /\[(?:실천\s*처방|개운\s*처방|행동\s*처방|실천\s*가이드|개운\s*가이드|행동\s*가이드|실천\s*조언|행동\s*조언|실천|처방|조언|행동|가이드)\]/i.test(line) ||
        (!p1Action && /^(?:실천\s*처방|개운\s*처방|실천|처방|행동|조언)/i.test(line))
      ) {
        if (!p1Action) { p1Action = cleaned; tag3 = rowTag; continue; }
      }

      if (!p1Current) {
        p1Current = cleaned;
        tag1 = rowTag;
      } else if (!p1Decision) {
        p1Decision = cleaned;
        tag2 = rowTag;
      } else if (!p1Action) {
        p1Action = cleaned;
        tag3 = rowTag;
      }
    }

    // Fallback if tags weren't used in summary block: assign in order
    const remaining = rawLines
      .map(stripGreetingFromText)
      .filter((l) => l.length >= 8 && !isGreetingOrMeta(l) && l !== p1Current && l !== p1Decision && l !== p1Action);

    if (!p1Current && remaining.length > 0) p1Current = remaining.shift() || '';
    if (!p1Decision && remaining.length > 0) p1Decision = remaining.shift() || '';
    if (!p1Action && remaining.length > 0) p1Action = remaining.shift() || '';
  }

  // Priority 2: Structured section parsing (Section 1: 현재 에너지 / Section 3: 결단 및 방향성 / Section 4: 실천 처방)
  const sections = text.split(/(?=^###\s+)/m);
  let secCurrent = '';
  let secDecision = '';
  let secAction = '';

  for (const sec of sections) {
    const headerLine = (sec.match(/^###\s+(.+)$/m) || [])[1] || '';
    const body = sec.replace(/^###\s+.*$/m, '').trim();

    // Section 1 / 2: 마음과 현재 에너지, 카드 상징
    if (
      !secCurrent &&
      (headerLine.includes('1.') ||
        headerLine.includes('마음') ||
        headerLine.includes('현재') ||
        headerLine.includes('에너지') ||
        headerLine.includes('상황'))
    ) {
      const sentences = body
        .split(/(?:[\n\r]+|(?<=[.!?])\s+)/)
        .map(cleanSentence)
        .map(stripGreetingFromText)
        .filter((s) => s.length >= 15 && !isGreetingOrMeta(s) && !isHollowSummaryLine(s, 'insight'));

      const scored = sentences.find((s) =>
        /현재|에너지|상황|마음|갈림길|파동|상징|지금|내면|뜻|의미|불균형|오해/.test(s)
      );
      secCurrent = scored || sentences[0] || '';
    }

    // Section 3: 트리니티 마스터의 직관적 결단 & 방향성
    if (
      !secDecision &&
      (headerLine.includes('3.') ||
        headerLine.includes('결단') ||
        headerLine.includes('방향') ||
        headerLine.includes('판정') ||
        headerLine.includes('선택'))
    ) {
      const rawLines = body
        .split(/(?:[\n\r]+|(?<=[.!?])\s+)/)
        .map(cleanSentence)
        .map(stripGreetingFromText)
        .filter((s) => s.length >= 6 && !isGreetingOrMeta(s) && !isHollowSummaryLine(s, 'direction'));

      const verdictLine = rawLines.find((s) =>
        /최종\s*(판정|선택)|(?:확실한\s*|조건부\s*)?YES|(?:단호한\s*)?NO|마스터의\s*핵심\s*선언|결단이\s*필요한|신중한\s*전환|확실한\s*추진|신중한\s*내실/i.test(
          s
        )
      );
      const expLine = rawLines.find(
        (s) =>
          s !== verdictLine &&
          s.length >= 15 &&
          /긍정|결단|방향|흐름|추진|타이밍|선택|나아가|기회|결실|성취|신뢰|열어/.test(
            s
          )
      );

      if (verdictLine && expLine) {
        secDecision = `${verdictLine} — ${expLine}`;
      } else {
        secDecision = verdictLine || expLine || rawLines[0] || '';
      }
    }

    // Section 4: 실천 처방 (개운 가이드)
    if (
      !secAction &&
      (headerLine.includes('4.') ||
        headerLine.includes('처방') ||
        headerLine.includes('실천') ||
        headerLine.includes('개운') ||
        headerLine.includes('가이드') ||
        headerLine.includes('조언'))
    ) {
      const rawLines = body
        .split(/(?:[\n\r]+|(?<=[.!?])\s+)/)
        .map(cleanSentence)
        .map((s) => s.replace(/^[가-힣\s]{2,10}:\s*/, ''))
        .map(stripGreetingFromText)
        .filter((s) => s.length >= 8 && !isGreetingOrMeta(s) && !isHollowSummaryLine(s, 'action'));

      const prescription = rawLines.find((s) =>
        /실천|처방|행동|조언|추천|해결|매일|기억|호흡|명상|정돈|물|집중/.test(s)
      );
      secAction = prescription || rawLines[0] || '';
    }
  }

  // Priority 3: Fallback semantic search across entire text
  const cleanFull = cleanSentence(text.replace(/^#+\s.*$/gm, ''));
  const allSentences = cleanFull
    .split(/(?:[\n\r]+|(?<=[.!?])\s+)/)
    .map(cleanSentence)
    .map(stripGreetingFromText)
    .filter((s) => s.length >= 12 && !isGreetingOrMeta(s));

  const concern = String(cardContext?.concern || '').trim();
  const theme = String(cardContext?.theme || '');
  const domains = [
    { themes: ['love'], words: /연애|관계|상대|연락|재회|이별|마음|고백|결혼/, terms: ['연애', '관계', '상대', '연락', '재회', '이별', '고백', '결혼', '대화', '만남'], action: '상대와의 최근 연락·대화에서 확인된 사실과 추측을 구분하고, 확인할 질문 하나를 정해 보세요.' },
    { themes: ['career'], words: /직장|이직|취업|진로|시험|면접|승진|학업/, terms: ['직장', '이직', '취업', '진로', '시험', '면접', '승진', '학업', '지원', '연봉', '조건', '업무', '경력'], action: '지원·이직·시험 등 질문한 목표의 조건과 준비 상황을 비교하고, 부족한 항목 하나부터 보완해 보세요.' },
    { themes: ['money', 'super_money'], words: /금전|투자|재물|돈|수익|매출|사업|계약|대출/, terms: ['금전', '투자', '재물', '수익', '매출', '사업', '계약', '대출', '지출', '손실', '자금', '비용', '예산'], action: '예상 수익뿐 아니라 비용·손실 가능성과 계약 조건을 확인하고, 감당할 수 있는 범위를 먼저 정하세요.' },
    { themes: ['timing'], words: /언제|시기|타이밍/, terms: ['시기', '타이밍', '준비', '조건', '기한', '일정', '시점'], action: '질문한 일을 시작할 준비 조건과 기한을 정하고, 조건이 충족되는지 확인한 뒤 움직여 보세요.' },
  ];
  const domain = domains.find(item => item.themes.includes(theme)) || domains.find(item => item.words.test(concern));
  const concernTerms = (concern.match(/[가-힣a-zA-Z0-9]{2,}/g) || [])
    .map(word => word.replace(/(?:에서는|에서|으로|하고|할까요|인가요|일까요|은|는|을|를|이|가|과|와|의)$/, ''))
    .filter(word => word.length >= 2 && !/^(오늘|타로|운세|어떻게|궁금|알려|좋을|지금|이번)/.test(word));
  const terms = [...new Set([...(domain?.terms || []), ...concernTerms])];
  const relevance = (line: string) => terms.reduce((score, term) => score + (line.includes(term) ? 1 : 0), 0);
  const generic = SUMMARY_TEMPLATE_FILLER;
  const normalizeCandidate = (line: string) => line.replace(/^\[(?!YES\b|NO\b|조건부\s*YES)[^\]]+\]\s*/i, '').trim();
  const pool = allSentences.map(normalizeCandidate).filter(line => line.length >= 8 && !/^\[.*요약\]$/.test(line));
  const used = new Set<string>();
  const grounded = groundedSummary(cardContext);
  const pick = (preferredLines: string[], roleName: SummaryRole, role: RegExp) => {
    const acceptable = (line: string) => Boolean(line) && !used.has(line) && !generic.test(line) && !isHollowSummaryLine(line, roleName);
    const preferred = preferredLines.map(normalizeCandidate).find(line => acceptable(line)
      && (!terms.length || relevance(line) > 0 || summarySpecificity(line, roleName) >= 4 || /\b(?:YES|NO)\b/i.test(line))) || '';
    if (preferred) { used.add(preferred); return preferred; }
    const candidates = [...new Set([...preferredLines.map(normalizeCandidate), ...pool].filter(Boolean))]
      .filter(line => acceptable(line))
      .map((line, index) => ({
        line,
        index,
        relevant: relevance(line),
        score: relevance(line) * 5 + (role.test(line) ? 3 : 0) + summarySpecificity(line, roleName),
      }))
      .filter(item => !terms.length || item.relevant > 0 || summarySpecificity(item.line, roleName) >= 4)
      .sort((a, b) => b.score - a.score || a.index - b.index);
    const chosen = candidates[0]?.line || '';
    if (chosen) used.add(chosen);
    return chosen;
  };
  const subject = concern ? `「${concern.length > 80 ? concern.slice(0, 80) + '…' : concern}」` : '질문한 주제';
  // 행동·주의 문장을 먼저 확보한다. 통찰 칸이 관련도만 보고 주의 문장까지 가져가면 02가 다시 빈 문장이 된다.
  const action = pick([p1Action, secAction], 'action', /하세요|보세요|확인|점검|비교|준비|보완|정하|실천|적어|보내/)
    || grounded.action
    || domain?.action
    || `${subject}에서 확인된 사실과 아직 모르는 조건을 나누고, 결정 전에 확인할 항목 하나를 정해 보세요.`;
  const decision = pick([p1Decision, secDecision], 'direction', /최종|판정|YES|NO|선택|결단|방향|가능|주의|위험|비교|않도록/i)
    || grounded.direction
    || `${subject}의 결론을 확정할 근거가 부족하므로, 카드만으로 결과를 단정하지 마세요.`;
  const current = pick([p1Current, secCurrent], 'insight', /현재|상황|지금|상태|원인|카드|역방향|뜻|의미|불균형|오해/)
    || grounded.insight
    || `${subject}에 관한 구체적인 상황 진단이 리딩에 충분히 제시되지 않았습니다.`;

  return [
    formatSummaryLine(tag1 || '현재 상황', current, 0),
    formatSummaryLine(tag2 || '방향과 결단', decision, 1),
    formatSummaryLine(tag3 || '실천 행동', action, 2),
  ];
}

export interface OracleConciseSummaryParams {
  message?: string;
  oracleMode: 'healing' | 'growth' | 'miracle';
  cards?: any[];
  saju?: any;
  todayCard?: any;
  microAction?: any;
  macroFocus?: string;
  microMission?: any;
}

/**
 * 🔮 78장 오라클 전용 핵심 3줄 요약 추출기 (사주 원국 ✕ 타로 도상 상징 융합 정밀 분석)
 * 일반 타로보다 훨씬 더 디테일하고 명확하게 카드의 뜻과 사주상 오늘의 기운을 결합하여 도출
 * 표준 태그: [현재 에너지] · [방향과 결단] · [실천 처방]
 */
export function extractOracleConciseSummary(params: OracleConciseSummaryParams): string[] {
  const { message = '', oracleMode, cards = [], saju, todayCard, microAction, macroFocus, microMission } = params;
  const isHealing = oracleMode === 'healing';
  const isMiracle = oracleMode === 'miracle';

  const clean = (s: string) => {
    return s
      .replace(/[\*\_]/g, '')
      .replace(/^\[[^\]]+\]\s*/, '')
      .replace(/^[-*•·\d.]+\s*/, '')
      .trim();
  };

  const fmt = (tag: string, content: string) => {
    let t = clean(content);
    t = t.replace(/^(?:친애하는|안녕하세요|반갑습니다|안녕|어서\s*오세요)[^,.]*[,.]\s*/i, '');
    // 기존 말줄임표 및 불필요한 기호 제거
    t = t.replace(/[\s.…·,-]+$/, '');
    // 문장이 지나치게 장문(120자 이상)인 경우에만 온전한 마침표 단위로만 정돈 (절대 쉼표 중간 절단이나 '상태입니다' 왜곡 금지)
    if (t.length > 125) {
      const dotIdx = t.lastIndexOf('.', 115);
      if (dotIdx > 45) {
        t = t.slice(0, dotIdx + 1);
      }
    }
    t = t.replace(/[\s.…·,-]+$/, '');
    if (!/[.!?]$/.test(t)) t += '.';
    return `[${tag}] ${t}`;
  };

  // 1. Check if the message contains an explicit [핵심 3줄 요약] block
  const summaryBlockMatch = message.match(
    /(?:\[핵심\s*(?:3줄\s*|세줄\s*)?요약\]|###\s*.*핵심\s*(?:3줄\s*|세줄\s*)?요약|###\s*.*핵심\s*요약|\[핵심\s*요약\]|Quick\s*Summary)([\s\S]*?)(?:$|###)/i
  );
  if (summaryBlockMatch) {
    const rawLines = summaryBlockMatch[1]
      .split('\n')
      .map(clean)
      .filter((l) => l.length > 5 && !l.startsWith('http'));
    if (rawLines.length >= 3) {
      return [
        fmt('현재 에너지', rawLines[0]),
        fmt('방향과 결단', rawLines[1]),
        fmt('실천 처방', rawLines[2]),
      ];
    }
  }

  // 2. Extract Card details and Saju elements for high-detail, rich fusion synthesis
  const c1 = cards[0];
  const c2 = cards[1];
  const c3 = cards[2];

  const dayMaster = saju?.dayMaster?.symbolName || saju?.dayMaster?.name || '본원 기질';
  const dominantEl = saju?.elements?.dominant?.name || '우세 오행';
  const lackingEl = saju?.elements?.lacking?.name || '결핍 오행';
  const yongsin = saju?.yongsin?.name || '용신 기운';

  const c1Name = c1 ? `${c1.nameKo || c1.name}${c1.reversed ? '(역)' : ''}` : '1번 카드';
  const c2Name = c2 ? `${c2.nameKo || c2.name}${c2.reversed ? '(역)' : ''}` : '2번 카드';
  const c3Name = c3 ? `${c3.nameKo || c3.name}${c3.reversed ? '(역)' : ''}` : '3번 카드';

  // 1. [현재 에너지] (자기계발/기적수업 오라클과 동등한 깊이와 분량의 60~85자 심층 진단)
  let line1 = '';
  if (isHealing) {
    line1 = `사주 본원 [${dayMaster}]과 [${c1Name}], [${c2Name}] 카드가 만나 지나온 시간의 무게와 내면의 깊은 피로가 공명하며 전환기를 맞이했습니다.`;
  } else if (isMiracle) {
    line1 = `사주 본원 [${dayMaster}]과 [${c1Name}] 카드가 만나 에고의 무의식적 두려움과 오해된 시선이 마음에 드리워졌음을 알아차립니다.`;
  } else {
    line1 = `사주 [${dayMaster}]의 추진력이 [${c1Name}] 카드와 만나 일시적인 실행 정체에 머물러 있으나 돌파의 잠재력은 충분합니다.`;
  }

  // 2. [방향과 결단] (사주 용신과 타로의 전환점 지혜 60~85자)
  let line2 = '';
  if (isHealing) {
    line2 = `용신 [${yongsin}]과 [${c3Name}] 카드의 조화로운 안내를 따라 불필요한 집착과 부담을 비워내고 온전한 마음의 회복을 선택할 때입니다.`;
  } else if (isMiracle) {
    line2 = `용신 [${yongsin}]과 [${c3Name}] 카드를 통해 판단과 원한을 내려놓고 참된 용서와 하나님의 완전한 평화를 선택할 때입니다.`;
  } else {
    line2 = `용신 [${yongsin}]과 [${c3Name}] 카드를 따라 잔가지를 쳐내고 우선순위 1번에 집중하여 당당하게 실행을 완수하세요.`;
  }

  // 3. [실천 처방] (구체적 행동 지침 55~80자)
  let line3 = '';
  const actionText = typeof microAction === 'string' && microAction.length > 5
    ? clean(microAction)
    : (microAction?.description || microMission?.title || '');

  if (actionText && actionText.length >= 6 && actionText.length <= 55) {
    line3 = `오늘 일상에서 '${actionText}' 실천을 정성껏 실행하며 내면의 에너지를 맑게 순환시키고 활력을 충전해 보세요.`;
  } else if (isHealing) {
    line3 = `따뜻한 차 한 잔과 세 번의 깊은 복식호흡으로 마음의 긴장을 부드럽게 내려놓고 스스로를 다정하게 안아 주세요.`;
  } else if (isMiracle) {
    line3 = `기적수업의 가르침처럼 "나는 이것 대신 평화를 보기를 선택한다"고 선언하며 마음의 거룩한 평화를 회복해 보세요.`;
  } else {
    line3 = `오늘 10분 안에 끝낼 수 있는 가장 작은 핵심 과제 한 가지를 정해 미루지 말고 지금 바로 행동으로 옮겨 보세요.`;
  }

  return [
    fmt('현재 에너지', line1),
    fmt('방향과 결단', line2),
    fmt('실천 처방', line3),
  ];
}

/**
 * 한글 음절의 종성(받침) 유무 확인
 */
export function hasKoreanJongseong(word: string): boolean {
  if (!word) return false;
  const lastChar = word.trim().slice(-1);
  const code = lastChar.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
}

/**
 * 한국어 성명에서 성(姓)을 제외하고 다정한 이름(Given Name)만 추출
 * 예: "박주형" -> "주형", "남궁선우" -> "선우", "김철" -> "철", "주형" -> "주형", "여행자" -> "여행자"
 */
export function extractGivenName(fullName: string): string {
  if (!fullName) return '';
  const trimmed = fullName.trim();
  if (trimmed === '제제') return '제제';
  if (trimmed.length <= 1 || trimmed === '여행자') return trimmed;

  // 공백으로 성과 이름이 구분된 경우 (예: "박 주형" -> "주형")
  if (trimmed.includes(' ')) {
    const parts = trimmed.split(/\s+/);
    return parts[parts.length - 1];
  }

  // 한글 2글자 복합성 (남궁, 황보, 제갈, 사공, 선우, 서문, 독고, 동방 등)
  const compoundSurnames = ['남궁', '황보', '제갈', '사공', '선우', '서문', '독고', '동방'];
  for (const compound of compoundSurnames) {
    if (trimmed.startsWith(compound) && trimmed.length > 2) {
      return trimmed.slice(2);
    }
  }

  // 한글 3글자 성명 (가장 일반적인 경우: 성 1자 + 이름 2자, 예: 박주형 -> 주형)
  if (trimmed.length === 3 && /^[가-힣]{3}$/.test(trimmed)) {
    return trimmed.slice(1);
  }

  // 한글 4글자 성명 (외자 성 + 이름 3자, 예: 김하늘별 -> 하늘별)
  if (trimmed.length === 4 && /^[가-힣]{4}$/.test(trimmed)) {
    return trimmed.slice(1);
  }

  // 한글 2글자 성명 (단성 + 외자 이름, 예: 김철 -> 철, 이진 -> 진)
  if (trimmed.length === 2 && /^[가-힣]{2}$/.test(trimmed)) {
    if (trimmed === '제제') return '제제';
    const commonSurnames = /^[김이박최정강조윤장임한오서신권황안송류홍전고문손양배백허유남심노하곽성차주우구라민진지엄채원천방공현함변염여추도소석선설마길연위표명기반왕금옥육인맹제모탁국어은편]/;
    if (commonSurnames.test(trimmed)) {
      return trimmed.slice(1);
    }
  }

  return trimmed;
}

/**
 * 이름 뒤에 다정한 호격 조사(아/야) 붙이기
 * 예: "주형" -> "주형아", "민수" -> "민수야", "철" -> "철아"
 */
export function formatKoreanVocative(name: string): string {
  if (!name) return '';
  return hasKoreanJongseong(name) ? `${name}아` : `${name}야`;
}

/**
 * 이름 뒤에 다정한 대상 조사(이에게/에게) 붙이기
 * 예: "주형" -> "주형이에게", "민수" -> "민수에게"
 */
export function formatKoreanToTarget(name: string): string {
  if (!name) return '';
  return hasKoreanJongseong(name) ? `${name}이에게` : `${name}에게`;
}


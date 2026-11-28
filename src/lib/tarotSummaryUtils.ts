/**
 * 타로 리딩 핵심 3줄 요약 추출 및 하단 중복 요약 블록 분리 유틸리티
 */
import { getTarotCardDetails, getTarotLuckyAction } from './dailyTarotOracle.ts';
import { getEffectiveTarotKeywords, getTarotCardCaution, getTarotReversedData } from '../data/tarotData.ts';

/**
 * 🔮 트리니티 마스터 직관적 결단 섹션 및 리딩에서 YES / NO 보존 (예·아니오 타로의 핵심 지표)
 */
export function sanitizeTarotDecisionYesNo(text: string): string {
  if (!text) return "";
  // 예·아니오 타로 및 직관적 결단 리딩 시 YES / NO 판정을 있는 그대로 명확하게 보존합니다.
  return text;
}

/**
 * 🚫 예·아니오 전용 배열이 아닌 리딩에서 새어 나온 YES/NO 판정 표기를 지운다.
 * 판정만 있는 단독 줄은 통째로 빼고, 문장 안에 섞인 표기는 문구만 지운다.
 */
export function stripSymbolicYesNoVerdict(text: string): string {
  if (!text) return '';
  const kept: string[] = [];
  for (const line of String(text).split('\n')) {
    if (/^\s*(?:[-*•·]\s*)?(?:\*\*)?\s*(?:최종\s*판정|상징적\s*기울기)\s*[:：]/.test(line)) continue;
    kept.push(
      line
        .replace(/(?:상징적\s*기울기|최종\s*판정)\s*[:：]?\s*\[?\s*(?:조건부\s*|확실한\s*|단호한\s*|단독\s*)?(?:YES|NO)\s*\]?/gi, '')
        .replace(/\[\s*(?:조건부\s*|확실한\s*|단호한\s*|단독\s*)?(?:YES|NO)\s*\]/gi, '')
        .replace(/[ \t]{2,}/g, ' ')
        .trimEnd(),
    );
  }
  return kept.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * 같은 역방향 주의 문장이 본문·배너·강조 줄에 연속으로 반복되면 첫 한 줄만 남깁니다.
 */
export function collapseRepeatedCautions(text: string): string {
  if (!text) return text;
  const seen = new Set<string>();
  const normalize = (value: string) =>
    value
      .replace(/[*_`~#>[\]()"'“”‘’⚠️·:：]/g, '')
      .replace(/역방향/g, '')
      .replace(/주의점(?:\s*\d+\s*가지)?/g, '')
      .replace(/\s+/g, '')
      .trim();

  const kept: string[] = [];
  for (const line of text.split('\n')) {
    if (!/주의/.test(line)) {
      kept.push(line);
      continue;
    }
    const quoted = line.match(/[「"“]([^"”」]{6,})[」"”]/);
    const afterLabel = line.split(/주의[^\n]{0,16}[:：\]]/).pop() || line;
    const body = normalize(quoted?.[1] || afterLabel);
    if (body.length >= 8 && seen.has(body)) continue;
    if (body.length >= 8) seen.add(body);
    kept.push(line);
  }

  return kept
    .join('\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
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

  return collapseRepeatedCautions(deduplicatedLines.join('\n'));
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
  // 본문에서 독립된 마크다운 헤더 형태로 출현하는 후행 요약 블록만 정밀 절단 (본문 일반 문장에 포함된 '핵심 요약' 단어 절단 절대 금지)
  const trailingSummaryHeaderRegex = /(?:\r?\n)\s*(?:#{1,6}\s*|\*{2}\s*)(?:[✨🌟🔮📌💡📋💎⚡🌿🎯■]\s*)*(?:\[\s*)?(?:핵심\s*(?:3줄|세줄|3대)?\s*요약|3줄\s*(?:핵심\s*)?요약|세줄\s*(?:핵심\s*)?요약|오늘의\s*(?:3줄|세줄)?\s*요약|Quick\s*Summary|Executive\s*Summary|3-Line\s*Summary)(?:\])?(?:\s*\*{2})?\s*[:：]?(?:\r?\n)/i;

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

type SummaryRole = 'energy' | 'decision' | 'action';

/** 본문과 무관한 상투 문구. 더 구체적인 문장이 있으면 요약에서 빼 둔다. */
const GENERIC_SUMMARY = /직관의\s*나침반|고유한\s*직관|기운을\s*순환|맑고\s*역동적인.*파동|마음의\s*중심|내면의\s*빛|운을\s*활짝|활기찬\s*생명력과\s*긍정/;

function splitSummarySentences(text: string): string[] {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?。])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 8);
}

/** 문장이 질문자의 심리·상황을 직접 말하는지. 카드 그림 묘사와 구분하는 기준이다. */
function hasQuerentStateSignal(sentence: string): boolean {
  return /당신|질문자|[가-힣]{2,5}님|마음|심리|기분|감정|의지|상태|관계|상황|고민|부담|불안|피로|기대|결정|선택/.test(sentence);
}

/** "배경에는", "그림 속 인물이"처럼 카드 그림의 틀을 여는 말. */
const CARD_SCENE_LEAD = /^(?:그\s*(?:뒤|너머|위|아래|옆|앞)|배경|전경|풍경|화면\s*(?:속|안|위|한가운데)|(?:카드|그림|도상|일러스트)\s*(?:속|안|위|아래|배경|한가운데|에는|엔|에서는))/;

/** 그림 속 대상이 서 있다·놓여 있다·흐르고 있다처럼 도상을 서술하는 서술어. */
const CARD_SCENE_VERB = /(?:흐르고\s*있|흐릅니다|그려져\s*있|그려진|새겨져|묘사되어|묘사된|보이고\s*있|보입니다|보이지요|서\s*있|놓여\s*있|들고\s*있|쥐고\s*있|잡고\s*있|비추고\s*있|펼쳐져\s*있|감싸고\s*있|솟아\s*있|매달려\s*있|누워\s*있|깔려\s*있|떠\s*있|머물고\s*있|피어\s*있|열려\s*있|바라보고\s*있|향하고\s*있|붓고\s*있|쏟고\s*있|던지고\s*있)/;

/** 그림에만 나오는 대상(배경·소품·등장인물). */
const CARD_SCENE_SUBJECT = /(?:강물|물결|시냇물|바다|호수|연못|구름|들판|숲|촛불|등불|왕관|성배|지팡이|펜타클|동전|두루마리|사자|뱀|천사|여인|기사|여왕|대천사|인물|나무|언덕|다리|항아리|탑|성\s*문)/;

/**
 * 카드 도상·배경 묘사만 하는 문장인지 판별한다.
 * "배경에는 잔잔한 강물이 흐르고 있지요." 같은 문장이 현재 에너지 요약으로 채택되던 결함의 방어선이다.
 */
export function isCardSceneOnly(sentence: string): boolean {
  const s = String(sentence || '').replace(/\*+/g, '').trim();
  if (!s) return false;
  if (hasQuerentStateSignal(s)) return false;
  if (/그려져|그려진|새겨져|묘사되어|묘사된/.test(s)) return true;
  if (CARD_SCENE_LEAD.test(s) && CARD_SCENE_VERB.test(s)) return true;
  if (CARD_SCENE_SUBJECT.test(s) && CARD_SCENE_VERB.test(s)) return true;
  return false;
}

/** 현재 에너지 요약으로 쓰기에는 의미가 모자란 짧은 조각인지 판별한다. */
const ENERGY_MIN_LENGTH = 25;

function isThinEnergyFragment(sentence: string): boolean {
  const core = String(sentence || '').replace(/\s+/g, ' ').replace(/[.!?。…\s]+$/g, '').trim();
  if (core.length >= ENERGY_MIN_LENGTH) return false;
  // 짧아도 질문자의 심리·상황을 직접 말하는 문장은 남긴다.
  return !/당신|질문자|[가-힣]{2,5}님|마음|심리|기분|감정|지금|현재|오늘|에너지|상태|관계|상황|고민|상대|연락|투자|자금|생활비|직장|업무|이직|계약|비용|수입|지출/.test(core);
}

function isPictureOnly(sentence: string): boolean {
  const s = sentence.trim();
  const aboutQuerent = /당신|질문자|[가-힣]{2,5}님|마음|지금|현재|오늘|에너지|상태|부담|준비|관계|상황/.test(s);
  const definesPicture = /(?:의미합니다|상징합니다|뜻합니다)\s*\.?$/.test(s)
    && /카드|도상|인물|성배|지팡이|검|펜타클|그림|대칭|모습/.test(s);
  if (definesPicture && !aboutQuerent) return true;
  if (/^(?:카드\s*속|그림\s*속|도상\s*속)/.test(s) && /(?:의미합니다|상징합니다|뜻합니다)\s*\.?$/.test(s)) return true;
  if (isCardSceneOnly(s)) return true;
  return false;
}

function hasNamedCaution(sentence: string): boolean {
  return /(?:하지\s*마|마세요|마십시오|삼가|피하|오해|자존심|입을\s*닫|단정\s*짓|짐작|서두르지|미루지|말실수|과소비|집착|억누르|상처|불균형|거리를\s*벌|휘둘|경계를\s*지키|주의하세요|유의하세요)/.test(sentence);
}

/** "주의할 점은 있습니다"처럼 주의의 내용을 말하지 않는 예고문. */
function isCautionTeaser(sentence: string): boolean {
  const s = sentence.trim();
  if (hasNamedCaution(s) && !/주의할\s*점(?:이|은)?\s*있습니다\s*\.?$/.test(s)) return false;
  return /(?:주의|조심|유의)(?:할|해야\s*할|해야\s*하는)\s*(?:점|것|부분)(?:이|은)?\s*(?:분명히\s*|아직\s*|하나\s*|꼭\s*)?(?:기억해야\s*할\s*)?있(?:습니다|어요|네요|다)\s*\.?$/.test(s);
}

function hasConcreteAction(sentence: string): boolean {
  // "질문자"는 "문자"를 품고 있어, 호칭만으로 행동 문장으로 오인되던 것을 막는다.
  return /(?:보내|적어|적고|전하|전해|말해|말하|물어|문의|확인|점검|비교|정리|정돈|마시|음미|걸어|연락|작성|내려놓|나눠|기록|인사|골라|멈춰|멈추|씻|환기|선언|매듭|메시지|(?<!질)문자|전화|메모|심호흡|스트레칭|공고|지원서|우선순위|조건을\s*확인|한\s*줄로)/.test(sentence);
}

/** "이 작은 행동", "첫 단추"처럼 행동을 가리키기만 하고 무엇을 할지는 없는 문장. */
function isDanglingAction(sentence: string): boolean {
  const pointsElsewhere = /이\s*작은\s*행동|이러한\s*(?:작은\s*)?(?:행동|실천)|이런\s*(?:작은\s*)?행동|그\s*(?:작은\s*)?(?:행동|실천)|위의\s*(?:행동|실천)|앞서\s*(?:말한|적은|의)?\s*(?:작은\s*)?(?:행동|실천)|첫\s*단추|이\s*실천|이러한\s*실천|이\s*한\s*걸음이/;
  if (!pointsElsewhere.test(sentence)) return false;
  return !hasConcreteAction(sentence);
}

/** Section-3 headings the daily prompt asks the model to declare. They are not a decision sentence. */
export const DIRECTION_TITLE_STUBS = ['확실한 추진', '신중한 내실 다지기', '과감한 결단', '유연한 관조'] as const;

export function splitDirectionStub(body: string): { stub: string; rest: string } | null {
  const text = body.replace(/\*\*/g, '').replace(/^\[|\]$/g, '').trim();
  for (const label of DIRECTION_TITLE_STUBS) {
    const bare = text.replace(/[.!?…\s]+$/g, '');
    if (bare === label) return { stub: label, rest: '' };
    const matched = text.match(new RegExp(`^${label}\\s*[:：]\\s*([\\s\\S]*)$`));
    if (matched) return { stub: label, rest: matched[1].trim() };
  }
  return null;
}

export function isDirectionTitleStub(body: string): boolean {
  const split = splitDirectionStub(body);
  if (!split) return false;
  return split.rest.replace(/[.!?…\s]/g, '').length < 12;
}

function finishSummarySentence(text: string): string {
  const trimmed = text.replace(/[\s.…·,]+$/g, '').trim();
  if (!trimmed) return trimmed;
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

/** Keep a real decision sentence. A bare direction title becomes this card's sentence. */
export function repairDirectionSummaryLine(diagnosis: string, cards?: any[]): string {
  if (!diagnosis || !/\[방향과\s*결단\]/.test(diagnosis)) return diagnosis;
  return diagnosis.replace(/^(\s*[-*•]?\s*\[방향과\s*결단\]\s*)(.+)$/m, (_full, prefix: string, body: string) => {
    const split = splitDirectionStub(String(body).trim());
    if (!split) return `${prefix}${String(body).trim()}`;
    const name = String(cards?.[0]?.nameKo || cards?.[0]?.name || '');
    const rest = split.rest.trim();
    const restIsSentence = rest.length >= 24 && (!name || rest.includes(name));
    const sentence = restIsSentence ? finishSummarySentence(rest) : finishSummarySentence(groundTarotSummaryParts(cards).decision);
    return `${prefix}${sentence}`;
  });
}

function classifySummarySentence(sentence: string, role: SummaryRole): 'good' | 'skip' {
  const s = sentence.trim();
  if (s.length < 8) return 'skip';
  if (role === 'decision' && isDirectionTitleStub(s)) return 'skip';
  if (GENERIC_SUMMARY.test(s) || isPictureOnly(s)) return 'skip';
  if (isCautionTeaser(s) || isDanglingAction(s)) return 'skip';
  if (role === 'energy' && isThinEnergyFragment(s)) return 'skip';
  if (role === 'energy' && /(?:하세요|보세요|십시오|마세요|해야\s*합니다|할\s*때입니다|될\s*것입니다|할\s*것입니다|전환점에\s*서\s*있습니다)\s*[.!?]?$/u.test(s)) return 'skip';
  if (role === 'action' && !hasConcreteAction(s)) return 'skip';
  return 'good';
}

function finishKoreanSentence(text: string): string {
  let s = text.replace(/[\s.…·,]+$/g, '').trim();
  if (!s) return s;
  if (!/[.!?]$/.test(s)) s += '.';
  return s;
}

function keywordPhrase(card: any): string {
  const kws = getEffectiveTarotKeywords(card).slice(0, 2).filter(Boolean);
  if (kws.length === 0) return '본래 뜻';
  if (kws.length === 1) return kws[0];
  const glue = hasKoreanJongseong(kws[0]) ? '과' : '와';
  return `${kws[0]}${glue} ${kws[1]}`;
}

function concreteCardAction(card: any): string {
  if (!card) return '';
  const details = getTarotCardDetails(card);
  const stripped = (details.actionGuidance || '')
    .replace(/^키워드\s*['"][^'"]+['"]\s*(?:를|을)?\s*되새기며,?\s*/u, '')
    .trim();
  if (stripped && hasConcreteAction(stripped) && !GENERIC_SUMMARY.test(stripped) && !isDanglingAction(stripped)) {
    return finishKoreanSentence(stripped);
  }
  try {
    const lucky = getTarotLuckyAction(card, !!card.reversed);
    if (lucky && hasConcreteAction(lucky) && !GENERIC_SUMMARY.test(lucky) && !isDanglingAction(lucky)) {
      return finishKoreanSentence(lucky);
    }
  } catch {
    /* 카드 정보가 부족하면 아래 조언으로 넘어간다 */
  }
  const advice = getTarotReversedData(card).advice || '';
  if (advice && hasConcreteAction(advice) && !isDanglingAction(advice)) return finishKoreanSentence(advice);
  return '';
}

export function groundTarotSummaryParts(
  cards: any[] | undefined,
  concern?: string,
): { energy: string; decision: string; action: string } {
  const list = Array.isArray(cards) ? cards.filter(Boolean) : [];
  const seen = new Set<string>();
  const unique = list.filter((card) => {
    const key = `${card?.id || card?.nameKo || card?.name || ''}:${card?.reversed ? 'r' : 'u'}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const lead = unique[0];
  const adviceCard = unique[unique.length - 1] || lead;
  if (!lead) {
    return {
      energy: '지금 마음의 상태를 카드 뜻과 연결해 짚을 만큼 리딩이 구체적이지 않습니다.',
      decision: '방향은 카드만으로 단정하지 말고, 아직 확인하지 않은 조건을 먼저 점검하세요.',
      action: '오늘 확인할 사실 한 가지를 메모하고, 그 항목을 직접 확인한 뒤에 결정하세요.',
    };
  }

  const name = lead.nameKo || lead.name || '뽑힌 카드';
  const reversed = !!lead.reversed;
  const details = getTarotCardDetails(lead);
  const kws = keywordPhrase(lead);
  const particle = hasKoreanJongseong(name) ? '은' : '는';
  // 본문에 쓸 문장이 없을 때 쓰는 대체 요약에도 질문 맥락을 붙여, 카드 설명만 남지 않게 한다.
  const concernText = String(concern || '').replace(/\s+/g, ' ').trim();
  const concernLead = concernText
    ? `「${concernText.length > 40 ? `${concernText.slice(0, 40)}…` : concernText}」를 두고 `
    : '';
  const energy = reversed
    ? finishKoreanSentence(`${concernLead}${getTarotReversedData(lead).meaning || `지금 당신의 상태는 ${name} 역방향의 ${kws}처럼 흐름이 어긋나 있습니다`}`)
    : finishKoreanSentence(`${concernLead}지금 당신의 에너지는 ${name}의 ${kws} 흐름 위에 있습니다`);

  const cautionRaw = (reversed ? getTarotCardCaution(lead) : details.shadowWarning || '').replace(/[.!?]\s*$/g, '').trim();
  const direction = reversed
    ? `${name}${particle} 서두르기보다 어긋난 부분을 먼저 맞출 방향을 가리킵니다`
    : `${name}${particle} ${kws} 쪽으로 한 걸음 나아갈 방향을 가리킵니다`;
  let decision = cautionRaw
    ? finishKoreanSentence(`${direction}. 다만 ${cautionRaw}`)
    : finishKoreanSentence(direction);
  if (decision.length > 170 && cautionRaw) decision = finishKoreanSentence(cautionRaw);

  const action = concreteCardAction(adviceCard) || concreteCardAction(lead)
    || '오늘 바로 할 수 있는 일 하나를 정해 10분 안에 손을 대고, 끝낸 뒤 결과를 한 줄로 적으세요.';

  return { energy, decision, action };
}

function salvageRoleText(raw: string, role: SummaryRole): string {
  const good = splitSummarySentences(raw).filter((s) => classifySummarySentence(s, role) === 'good');
  if (!good.length) return '';
  if (role !== 'decision') return good[0];
  const withCaution = good.find((s) => hasNamedCaution(s));
  const direction = good.find((s) => !isCautionTeaser(s)) || good[0];
  if (withCaution && direction && withCaution !== direction) {
    const joined = `${direction.replace(/[.!?]\s*$/g, '')}. ${withCaution}`;
    if (joined.length <= 170) return joined;
    return withCaution;
  }
  return withCaution || direction;
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
    str = str.replace(/^(?:(?:친애하는\s*)?(?:질문자|내담자)님(?=[,\s~!]|$)[,\s~!]*)?(?:(?:어서\s*오세요|안녕하세요|반갑습니다|안녕하십니까)[,\s~!]*)+/i, '');
    str = str.replace(/^(?:(?:어서\s*오세요|안녕하세요|반갑습니다|안녕하십니까)[,\s~!]*)?(?:(?:친애하는\s*)?(?:질문자|내담자)님(?=[,\s~!]|$)[,\s~!]*)*/i, '');
    str = str.replace(/^(?:카드를\s*(?:가만히|조용히|한\s*장씩)?\s*마주하니|촛불을\s*켜고|타로\s*상담실에\s*오신\s*것을\s*환영합니다)[,\s~!.]*/i, '');
    str = str.replace(/^(?:다음은|오늘의|타로\s*리딩의)?\s*(?:핵심\s*3줄\s*요약|3줄\s*요약|핵심\s*요약)(?:입니다|을\s*전해드립니다|:|\.)\s*/i, '');
    // 호칭만 떼어 내고 조사가 남은 문장("의 마음은 …")을 정리한다.
    str = str.replace(/^(?:의|은|는|을|를|과|와|께서)\s+/, '');
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

  // 명사형/미완결형 어미를 자연스러운 완결형 한국어 문장으로 다듬는 헬퍼.
  // 125자에서 첫 문장만 남기면 "주의할 점은 있습니다", "이 작은 행동" 같은 예고문만 남고
  // 바로 뒤의 주의점·행동이 잘리므로, 문장 절단은 하지 않는다.
  const ensureNaturalKoreanSentence = (str: string, rowIdx: number): string => {
    let s = str.trim().replace(/[\s.…·,-]+$/, '');
    if (!s) return s;

    // 어색한 명사형 종결(~하기, ~시키기, ~열기, ~다지기, ~갖기, ~세우기, ~만들기, ~전환하기 등)을 자연스러운 서술형 문장으로 변환
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
    cleaned = cleaned.replace(/^[:：—\-–~·•*]+\s*/, '');
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

    // 요약 블록에 카드 그림 묘사·버롬 문장이 있어도 그대로 채택하지 않고 본문에서 다시 고른다.
    const rejectedBlockLines = new Set<string>();
    const acceptEnergyLine = (cleaned: string): boolean => classifySummarySentence(cleaned, 'energy') === 'good';

    for (const line of rawLines) {
      const bracketMatch = line.match(/^\[([^\]]+)\]/);
      const rowTag = bracketMatch ? bracketMatch[1].trim() : '';
      const cleaned = stripGreetingFromText(line.replace(/^\[[^\]]+\]\s*/, ''));
      if (!cleaned || isGreetingOrMeta(cleaned)) continue;

      if (
        /\[(?:현재\s*에너지|현재\s*상황|내면\s*에너지|상황\s*진단|현재|에너지|상황)\]/i.test(line) ||
        (!p1Current && /^(?:현재\s*에너지|현재\s*상황|내면|에너지|상황\s*진단)/i.test(line))
      ) {
        if (!p1Current) {
          if (acceptEnergyLine(cleaned)) { p1Current = cleaned; tag1 = rowTag; }
          else rejectedBlockLines.add(cleaned);
          continue;
        }
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
        if (acceptEnergyLine(cleaned)) { p1Current = cleaned; tag1 = rowTag; }
        else rejectedBlockLines.add(cleaned);
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
      .filter((l) => l.length >= 8 && !isGreetingOrMeta(l) && !rejectedBlockLines.has(l) && !isCardSceneOnly(l)
        && l !== p1Current && l !== p1Decision && l !== p1Action);

    while (!p1Current && remaining.length > 0) {
      const candidate = remaining.shift() || '';
      if (acceptEnergyLine(candidate)) { p1Current = candidate; }
      else rejectedBlockLines.add(candidate);
    }
    if (!p1Decision && remaining.length > 0) p1Decision = remaining.shift() || '';
    if (!p1Action && remaining.length > 0) p1Action = remaining.shift() || '';
  }

  // Priority 2: Structured section parsing (Section 1: 현재 에너지 / Section 3: 결단 및 방향성 / Section 4: 실천 처방)
  const sections = text.split(/(?=^###\s+)/m);
  let secCurrent: string[] = [];
  let secDecision = '';
  let secAction = '';

  for (const sec of sections) {
    const headerLine = (sec.match(/^###\s+(.+)$/m) || [])[1] || '';
    const body = sec.replace(/^###\s+.*$/m, '').trim();

    // Section 1 / 2: 마음과 현재 에너지, 카드 상징
    if (
      !secCurrent.length &&
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
        .filter((s) => s.length >= 15 && !isGreetingOrMeta(s));

      secCurrent = sentences;
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
        .filter((s) => s.length >= 6 && !isGreetingOrMeta(s));

      const verdictLine = rawLines.find((s) =>
        /최종\s*(판정|선택)|(?:확실한\s*|조건부\s*)?YES|(?:단호한\s*)?NO|마스터의\s*핵심\s*선언|결단이\s*필요한|신중한\s*전환|확실한\s*추진|신중한\s*내실/i.test(
          s
        )
      );
      const expLine = rawLines.find(
        (s) =>
          s !== verdictLine &&
          s.length >= 15 &&
          /긍정|결단|방향|흐름|추진|타이밍|선택|나아가|기회|결실|성취|신뢰|열어|주의|위험|멈춤|보완|변수|리스크|정체|내실/.test(
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
        .filter((s) => s.length >= 8 && !isGreetingOrMeta(s));

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
  const normalizeCandidate = (line: string) => line.replace(/^\[(?!YES\b|NO\b|조건부\s*YES)[^\]]+\]\s*/i, '').trim();
  const pool = allSentences.map(normalizeCandidate).filter(line => line.length >= 8 && !/^\[.*요약\]$/.test(line));
  const cardList = [
    ...(Array.isArray(cardContext?.cards) ? cardContext.cards : []),
    ...(cardContext?.card ? [cardContext.card] : []),
  ];
  const grounded = groundTarotSummaryParts(cardList, concern);
  const used = new Set<string>();
  const pick = (summaryLines: string[], sectionLines: string[], role: SummaryRole, roleRe: RegExp) => {
    const expand = (line: string) => splitSummarySentences(normalizeCandidate(line))
      .filter((s) => classifySummarySentence(s, role) === 'good' && !used.has(s));
    const fromSummary = [...new Set(summaryLines.flatMap(expand))];
    const fromSection = [...new Set(sectionLines.flatMap(expand))].filter((s) => !fromSummary.includes(s));
    const fromPool = pool.filter((line) => classifySummarySentence(line, role) === 'good' && !used.has(line) && !fromSummary.includes(line) && !fromSection.includes(line));
    const isRelevant = (line: string) => !terms.length || relevance(line) > 0 || /\b(?:YES|NO)\b/i.test(line);
    // 현재 에너지는 짧은 조각보다 마음·상황을 담은 문장을 우선한다.
    const energySubstance = (line: string) => {
      const len = line.replace(/\s+/g, ' ').trim().length;
      if (len >= 40 && len <= 150) return 3;
      if (len >= ENERGY_MIN_LENGTH) return 1;
      return -3;
    };
    const score = (line: string) =>
      relevance(line) * 5
      + (roleRe.test(line) ? 3 : 0)
      + (role === 'decision' && hasNamedCaution(line) ? 4 : 0)
      + (role === 'action' && hasConcreteAction(line) ? 2 : 0)
      + (role === 'energy' ? energySubstance(line) : 0);
    const best = (lines: string[]) => [...lines].sort((a, b) => score(b) - score(a) || a.length - b.length)[0] || '';
    const tier = (lines: string[]) => {
      const relevant = lines.filter(isRelevant);
      return relevant.length ? relevant : [];
    };
    // 비어 있지 않은 요약 문장을 본문보다 먼저 쓴다. 요약이 그림 설명·예고문이라면 본문에서 다시 고른다.
    let chosen = best(tier(fromSummary)) || best(tier(fromSection)) || best(tier(fromPool))
      || best(fromSummary) || best(fromSection) || best(fromPool);
    if (role === 'decision' && chosen && !hasNamedCaution(chosen)) {
      const extra = [...fromSummary, ...fromSection, ...fromPool].find((s) => s !== chosen && hasNamedCaution(s) && !isCautionTeaser(s) && !used.has(s));
      if (extra) {
        const joined = `${chosen.replace(/[.!?]\s*$/g, '')}. ${extra}`;
        if (joined.length <= 170) chosen = joined;
      }
    }
    if (chosen) {
      splitSummarySentences(chosen).forEach((s) => used.add(s));
      used.add(chosen);
    }
    return chosen;
  };
  const subject = concern ? `「${concern.length > 80 ? concern.slice(0, 80) + '…' : concern}」` : '질문한 주제';
  const current = pick([p1Current], secCurrent, 'energy', /현재|상황|지금|상태|원인|마음|에너지|부담|준비/)
    || salvageRoleText(grounded.energy, 'energy')
    || grounded.energy
    || `${subject}에 관한 구체적인 상황 진단이 리딩에 충분히 제시되지 않았습니다.`;
  const decision = pick([p1Decision], [secDecision], 'decision', /최종|판정|YES|NO|선택|결단|방향|가능|주의|위험|비교|확인|나아가|한\s*걸음/i)
    || salvageRoleText(grounded.decision, 'decision')
    || `${subject}의 결론을 확정할 근거가 부족하므로, 카드만으로 결과를 단정하지 마세요.`;
  const action = pick([p1Action], [secAction], 'action', /하세요|보십시오|보세요|확인|점검|비교|준비|보완|정하|실천|보내|전하|적어/)
    || (domain?.action && !GENERIC_SUMMARY.test(domain.action) ? domain.action : '')
    || salvageRoleText(grounded.action, 'action')
    || `${subject}에서 확인된 사실과 아직 모르는 조건을 나누고, 결정 전에 확인할 항목 하나를 정해 보세요.`;

  return [
    formatSummaryLine(tag1 || '현재 에너지', current, 0),
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
    // "- [방향과 결단] …"처럼 목록 기호 뒤에 태그가 오는 경우까지 태그를 떼어 낸다.
    return s
      .replace(/[\*\_]/g, '')
      .replace(/^[-*•·\d.]+\s*/, '')
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

  // 1. [핵심 3줄 요약] 블록이 있으면 그 문장을 먼저 쓰되, 카드 그림 묘사·짧은 조각이면 카드·사주 기반 문장으로 대신한다.
  const summaryBlockMatch = message.match(
    /(?:\[핵심\s*(?:3줄\s*|세줄\s*)?요약\]|###\s*.*핵심\s*(?:3줄\s*|세줄\s*)?요약|###\s*.*핵심\s*요약|\[핵심\s*요약\]|Quick\s*Summary)([\s\S]*?)(?:$|###)/i
  );
  if (summaryBlockMatch) {
    const rawLines = summaryBlockMatch[1]
      .split('\n')
      .map(clean)
      .filter((l) => l.length > 5 && !l.startsWith('http'));
    if (rawLines.length >= 3) {
      const blockEnergy = rawLines[0];
      const energyUsable = !!blockEnergy && classifySummarySentence(blockEnergy, 'energy') === 'good';
      // "과감한 결단"처럼 제목만 있는 문장은 결단 요약으로 쓰지 않고 카드가 가리키는 방향으로 대신한다.
      const blockDecision = rawLines[1];
      const decisionUsable = !!blockDecision
        && !isDirectionTitleStub(blockDecision)
        && !isCardSceneOnly(blockDecision);
      const groundedDecision = decisionUsable ? '' : groundTarotSummaryParts(cards).decision;
      return [
        fmt('현재 에너지', energyUsable ? blockEnergy : line1),
        fmt('방향과 결단', decisionUsable ? blockDecision : (groundedDecision || line2)),
        fmt('실천 처방', rawLines[2]),
      ];
    }
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

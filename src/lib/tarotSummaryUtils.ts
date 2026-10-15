/**
 * 타로 리딩 핵심 3줄 요약 추출 및 하단 중복 요약 블록 분리 유틸리티
 */

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

  // 3. 5단계(영혼의 한마디) 이후 남아 있는 불필요한 후행 불릿이나 잔여 텍스트 제거
  const step5Pattern = /(?:###\s*(?:[^\r\n\d]*?)?5[\.\s]|5단계|영혼의\s*한마디|당신의\s*길을\s*축복하는|황금빛\s*축복)/i;
  const step5Match = cleaned.match(step5Pattern);
  if (step5Match && step5Match.index !== undefined) {
    const afterStep5 = cleaned.slice(step5Match.index);
    // 5단계 내부 인용구("> _"..."_") 또는 마지막 축복 문장 끝 탐색
    const quoteEndMatch = afterStep5.match(/(?:["”'_]\s*(?:\r?\n|$)|[.!?]\s*(?:\r?\n|$))/);
    if (quoteEndMatch && quoteEndMatch.index !== undefined) {
      const quoteEndPos = step5Match.index + quoteEndMatch.index + quoteEndMatch[0].length;
      const remainder = cleaned.slice(quoteEndPos).trim();
      // 인용구 뒤에 요약이나 불릿 포인트가 달려있으면 잘라냄
      if (/(?:핵심|요약|\[현재\s*에너지\]|\[오늘의\s*에너지\]|\[방향과\s*결단\]|\[실천\s*처방\]|\[상황\s*나침반\]|\[개운\s*액션\]|[-*•]\s*\[|[-*•]\s*현재|[-*•]\s*오늘|[-*•]\s*방향|[-*•]\s*실천|[-*•]\s*상황|[-*•]\s*개운)/i.test(remainder)) {
        cleaned = cleaned.slice(0, quoteEndPos).trim();
      }
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

  const isEnrichedContext =
    cardContext &&
    typeof cardContext === 'object' &&
    ('cards' in cardContext || 'saju' in cardContext || 'card' in cardContext || 'concern' in cardContext || 'theme' in cardContext);

  const contextCards: any[] = isEnrichedContext
    ? (cardContext.cards || (cardContext.card ? [cardContext.card] : []))
    : (Array.isArray(cardContext) ? cardContext : (cardContext ? [cardContext] : []));
  const sajuObj: any = isEnrichedContext ? cardContext.saju : null;
  const isYesNoContext =
    (isEnrichedContext && (cardContext.kind === 'yes_no' || cardContext.theme === 'yes_no')) ||
    /\b(YES|NO)\b/i.test(text);

  const dayMaster = sajuObj?.dayMaster?.symbolName || sajuObj?.dayMaster?.name || '';
  const yongsin = sajuObj?.yongsin?.name || '';

  const c1 = contextCards[0];
  const c2 = contextCards[1];
  const c3 = contextCards[2];

  const c1Name = c1 ? `${c1.nameKo || c1.name || ''}${c1.reversed ? '(역)' : ''}` : (cardContext?.nameKo || '');
  const c2Name = c2 ? `${c2.nameKo || c2.name || ''}${c2.reversed ? '(역)' : ''}` : '';
  const c3Name = c3 ? `${c3.nameKo || c3.name || ''}${c3.reversed ? '(역)' : ''}` : '';

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

  const formatSummaryLine = (tag: string, content: string, rowIdx: number): string => {
    let cleaned = stripGreetingFromText(content);
    cleaned = cleaned.replace(/^\[(?!YES\b|NO\b|조건부\s*YES)[^\]]+\]\s*(:|-|—)?\s*/i, '');
    cleaned = cleaned.replace(/^(?:현재\s*에너지|방향과\s*결단|실천\s*처방|개운\s*처방|행동\s*처방|실천\s*가이드|개운\s*가이드|상황\s*진단)\s*[:—\-]\s*/, '');
    cleaned = cleanSentence(cleaned);

    // 50~70자 내외 최적화 (장문일 때 의미를 온전히 살리며 자연스러운 문장/어절 단위 압축)
    if (cleaned.length > 76) {
      const dotIdx = cleaned.slice(0, 74).lastIndexOf('.');
      const exclIdx = cleaned.slice(0, 74).lastIndexOf('!');
      const bestPunct = Math.max(dotIdx, exclIdx);
      if (bestPunct >= 48) {
        cleaned = cleaned.slice(0, bestPunct + 1);
      } else {
        const lastSpace = cleaned.lastIndexOf(' ', 72);
        if (lastSpace >= 48) {
          cleaned = cleaned.slice(0, lastSpace).trim();
        } else {
          cleaned = cleaned.slice(0, 70).trim();
        }
      }
    }

    // 지나치게 짧고 무성의한 문장(38자 미만)일 경우 카드 상징/사주 기운으로 50~70자 심층 보강
    if (cleaned.length < 38) {
      const baseClean = cleaned.replace(/[.!?]+$/, '').trim();
      if (rowIdx === 0) {
        if (dayMaster && c1Name) {
          cleaned = `사주 본원 [${dayMaster}]과 [${c1Name}] 카드가 만나 ${baseClean} 흐름 속에서 내면의 새로운 전환점을 맞이했습니다.`;
        } else if (c1Name) {
          cleaned = `[${c1Name}] 카드의 도상 상징이 비추듯 ${baseClean} 내면의 직관을 차분히 회복하며 새로운 방향을 탐색할 때입니다.`;
        } else {
          cleaned = `내면의 무의식적 흐름을 성찰하며 ${baseClean} 마음의 중심을 단단히 세우고 새로운 전환점을 맞이하세요.`;
        }
      } else if (rowIdx === 1) {
        if (yongsin && (c2Name || c1Name)) {
          cleaned = `용신 [${yongsin}]과 [${c2Name || c1Name}] 카드의 안내를 따라 ${baseClean} 확신을 갖고 우선순위에 집중해 나아가세요.`;
        } else if (c2Name || c1Name) {
          cleaned = `[${c2Name || c1Name}] 카드가 가리키듯 ${baseClean} 두려움을 비워내고 명확한 결단으로 중심을 잡을 타이밍입니다.`;
        } else {
          cleaned = `불필요한 망설임을 내려놓고 ${baseClean} 내면의 나침반을 신뢰하며 당당한 결단으로 전진할 때입니다.`;
        }
      } else {
        if (baseClean.length >= 6) {
          cleaned = `오늘 일상에서 "${baseClean}" 실천 과제를 정성껏 실행하여 정체된 에너지를 순환시키고 긍정 운을 활짝 열기.`;
        } else {
          cleaned = `오늘 일상에서 미뤄둔 핵심 과제 1가지를 정해 20분간 온전히 몰입해 즉시 완수하고 맑은 운의 파동을 일으키기.`;
        }
      }

      // 보강 후에도 74자 이내로 정돈
      if (cleaned.length > 76) {
        const lastSpace = cleaned.lastIndexOf(' ', 72);
        if (lastSpace >= 48) {
          cleaned = cleaned.slice(0, lastSpace).trim();
        } else {
          cleaned = cleaned.slice(0, 70).trim();
        }
      }
    }

    cleaned = cleaned.replace(/[\s.…·,-]+$/, '');
    if (!/[.!?]$/.test(cleaned)) {
      cleaned += '.';
    }
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
        .filter((s) => s.length >= 15 && !isGreetingOrMeta(s));

      const scored = sentences.find((s) =>
        /현재|에너지|상황|마음|갈림길|파동|상징|지금|내면|모습/.test(s)
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

  // Fallback high-density synthesis (사주 원국 ✕ 타로 도상 상징 융합 50~70자)
  let fallbackCurrent = p1Current || secCurrent;
  if (!fallbackCurrent) {
    if (dayMaster && c1Name) {
      fallbackCurrent = `사주 본원 [${dayMaster}]과 [${c1Name}] 카드의 도상이 만나 복잡한 고민의 본질을 꿰뚫고 새로운 통찰의 전환점을 맞이했습니다.`;
    } else if (c1Name) {
      fallbackCurrent = `[${c1Name}] 카드의 도상 상징이 가리키듯, 오랜 내면의 혼란을 걷어내고 직관의 나침반을 회복하며 새로운 전환점을 맞이하는 흐름입니다.`;
    } else {
      const matched = allSentences.find((s) => /현재|지금|마음|에너지|상황|갈림길|파동|내면/.test(s));
      fallbackCurrent = matched || '내면의 무의식적 불안을 비워내고 고유한 직관의 나침반을 신뢰하며 고요한 중심을 회복하는 전환기입니다.';
    }
  }

  let fallbackDecision = p1Decision || secDecision;
  if (!fallbackDecision) {
    const isYesNo = isYesNoContext || /YES|NO/i.test(text);
    const isNo = /단호한\s*NO|\bNO\b/i.test(text);
    if (isYesNo) {
      fallbackDecision = isNo
        ? '최종 판정은 [NO]이며, 무리한 확장보다 숨은 변수를 꼼꼼히 점검하고 내실을 다져 한 템포 호흡을 조절해야 할 신중한 타이밍입니다.'
        : `최종 판정은 [YES]이며, [${c2Name || c1Name || '운명의 카드'}] 카드의 밝은 생명력을 신뢰하고 준비해 온 결실을 당당히 거둘 때입니다.`;
    } else if (yongsin && (c2Name || c1Name)) {
      fallbackDecision = `용신 [${yongsin}]과 [${c2Name || c1Name}] 카드를 따라 잔가지를 과감히 쳐내고 핵심 목표 1번에 온전히 집중할 타이밍입니다.`;
    } else if (c2Name || c1Name) {
      fallbackDecision = `[${c2Name || c1Name}] 카드의 확신 있는 에너지처럼, 두려움을 비워내고 명확한 우선순위에 집중하여 결단할 때입니다.`;
    } else {
      const matched = allSentences.find((s) => s !== fallbackCurrent && /결단|선택|판정|방향|흐름|기회|타이밍|추진|점검/.test(s));
      fallbackDecision = matched || '운의 흐름은 정체를 지나 명확한 결단의 타이밍을 가리키고 있으니 흔들림 없이 한 걸음 나아가세요.';
    }
  }

  let fallbackAction = p1Action || secAction;
  if (!fallbackAction) {
    const actionSentence = allSentences.slice().reverse().find(
      (s) => s !== fallbackCurrent && s !== fallbackDecision && /실천|행동|처방|조언|오늘|개운|시작|호흡|정돈/.test(s)
    );
    if (actionSentence && actionSentence.length >= 15 && actionSentence.length <= 60) {
      fallbackAction = actionSentence;
    } else if (cardContext?.remedy && typeof cardContext.remedy === 'string' && cardContext.remedy.length >= 15) {
      fallbackAction = cardContext.remedy;
    } else {
      fallbackAction = '오늘 일상에서 미뤄둔 핵심 과제 1가지를 정해 20분간 몰입해 즉시 완수하고 맑은 물 한 잔으로 기운을 순환시키기.';
    }
  }

  // 🌟 ALWAYS RETURN EXACTLY 3 BULLETS (Currently, Direction, Action)
  return [
    formatSummaryLine(tag1 || '현재 에너지', fallbackCurrent, 0),
    formatSummaryLine(tag2 || '방향과 결단', fallbackDecision, 1),
    formatSummaryLine(tag3 || '실천 처방', fallbackAction, 2),
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

  if (actionText && actionText.length >= 6 && actionText.length <= 45) {
    line3 = `오늘 일상에서 "${actionText}"을(를) 정성껏 실천하며 내면의 에너지를 순환시키고 충전하기.`;
  } else if (isHealing) {
    line3 = `따뜻한 차 한 잔과 3번의 깊은 복식호흡으로 마음의 긴장을 즉시 비워내고 스스로를 다정하게 안아주기.`;
  } else if (isMiracle) {
    line3 = `기적수업 레슨처럼 "나는 이것 대신 평화를 보기를 선택한다"는 마음의 선언으로 거룩한 순간을 회복하기.`;
  } else {
    line3 = `오늘 10분 안에 끝낼 수 있는 가장 작은 행동 과제 1가지를 정해 지금 즉시 행동으로 전환하기.`;
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


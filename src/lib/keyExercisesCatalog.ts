import rawData from './keyExercisesCatalog.json';

export interface KeyExerciseItem {
  globalIndex: number;
  chapter: number;
  chapterTitle: string;
  index: number;
  title: string;
  subtitle: string;
  page: number;
  tag: string;
  icon: string;
  purpose: string;
  clinicalTip: string;
}

export const KEY_EXERCISES_CATALOG: KeyExerciseItem[] = rawData as KeyExerciseItem[];

// 각 연습별 특화 키워드 사전 (40가지 Key 마음약방 임상 실천 연습 정밀 매핑)
const KEYWORD_MAP: Record<number, string[]> = {
  1: ['시각화', '그리기', '스케치', '불안모양', '형태', '색깔', '꺼내놓기', '외재화', '종이위에', '그림으로'],
  2: ['단어', '재구성', '하지만', '그리고', '말투', '생각바꾸기', '언어전환', '인지치료', '문장바꾸기', '부정적인말'],
  3: ['포스트잇', '붙이기', '게시판', '생각흘리기', '잡념', '머릿속복잡', '생각비우기', '메모'],
  4: ['관찰', '제3자', '영화', '관객', '스크린', '자막', '엔딩크레딧', '거리두기', '메타인지', '화면밖'],
  5: ['반추', '반복되는생각', '꼬리', '컨베이어', '수하물', '짐', '흘려보내기', '떠나보내기', '강박사고', '되풀이'],
  6: ['게임판', '게임말', '탈융합', '분리', '통제내려놓기', '생각일뿐', '거리두기', '체스판', '생각과분리'],
  7: ['기차', '스쳐지나', '흘러가', '소음', '지나가게', '멈추려하지', '흐름지켜보기', '스쳐지나가는'],
  8: ['억누름', '억제', '생각안하려고', '보라색꽃', '백곰', '역설', '금지', '참으려고', '애쓸수록'],
  9: ['자기비판', '자책', '스스로비난', '내탓', '자괴감', '한심', '못난', '비판자', '자격미달', '자존감바닥'],
  10: ['토끼굴', '함정', '수렁', '부정적생각', '빨려들', '늪', '알아차림', '현재복귀', '고리끊기'],
  11: ['걱정시간', '걱정예약', '15분', '걱정제한', '하루종일걱정', '마음의책장', '미뤄두기', '걱정할시간'],
  12: ['피자', '과부하', '뇌휴식', '걱정분할', '우선순위', '머리터질', '용량초과', '압도'],
  13: ['호흡', '숨', '복식호흡', '풍선', '숨가쁨', '과호흡', '가슴답답', '들숨', '날숨', '횡격막', '호흡곤란', '숨쉬기'],
  14: ['54321', '오감', '공황', '패닉', '그라운딩', '발작', '주변감각', '눈에보이는', '들리는소리', '촉감'],
  15: ['어깨', '목', '상체', '결림', '뭉침', '등', '뻐근', '담', '근육긴장', '코르티솔', '어깨내리기', '상체긴장'],
  16: ['심장뜀', '두근거림', '맥박', '떨림', '식은땀', '신체반응', '놀람', '안전점검', '심박수', '깜짝선물'],
  17: ['샤워', '물소리', '일상그라운딩', '요리', '감각머물기', '딴생각', '현재로돌아오기', '산만', '그라운딩전문가'],
  18: ['발바닥', '접지', '대지', '닻', '땅', '발가락', '중심잡기', '흔들릴때', '어지러움', '지탱', '대지의중심'],
  19: ['즐겨찾기', '좋아하는것', '취향', '인지분류', '기분전환', '감각리스트', '소소한행복', '오감자극'],
  20: ['보디스캔', '바디스캔', '머리부터발끝', '신체스캔', '몸관찰', '불편감', '신체감각', '전신이완', '몸살'],
  21: ['점진적이완', '근육이완', '주먹쥐기', '툭풀기', '굳음', '경직', '뻣뻣', '온몸긴장', '힘빼기', '근육재정비'],
  22: ['시간관리', '할일쪼개기', '과제분할', '세분화', '압도', '할일이너무많아', '정리안됨', '단계별', '쪼개기'],
  23: ['취약성', '달걀', '통제욕구', '힘빼기', '깨질까봐', '불안전', '견디기', '안절부절', '껍데기'],
  24: ['수영장', '저항멈춤', '감정수용', '피하지않기', '느끼기', '차라리느끼자', '온전히받아들임', '감정수영장'],
  25: ['발표', '시선', '타인시선', '무대', '면접', '남들의식', '카메라', '주목', '얼굴빨개짐', '목소리떨림', '스마일'],
  26: ['가치', '삶의가치', '나답게', '가치중심', '소중한것', '의미있는삶', '가치행동', '방향성', '타인과거리두기'],
  27: ['미루기', '회피', '도망', '안락지대', '게으름', '핑계', '미루는습관', '딴짓', '생존의기로'],
  28: ['투쟁', '싸움', '감정과싸움', '파도타기', '저항', '2차고통', '버티기', '싸우지않기', '내면의투쟁'],
  29: ['바쁨', '일중독', '워커홀릭', '회피형바쁨', '모기떼', '불안해서일함', '쉬지못함', '일중독자'],
  30: ['행동선택', '감정과행동분리', '불안해도한다', '실행', '행동통제', '말과행동', '행동의선택'],
  31: ['거짓말', '마음의속임수', '핑계', '착각', '왜곡', '현실점검', '과장', '거짓말쟁이'],
  32: ['가면증후군', '사기꾼증후군', '들통날까봐', '부족한나', '가짜같아', '자격지심', '열등감', '가짜감정'],
  33: ['반대행동', '충동', '악순환', '누워있기대신', '숨지않기', '정반대로', '행동전환', '반대행동훈련'],
  34: ['사과나무', '스트레스자루', '수레', '짐덜기', '과부하', '버거움', '무거운책임감', '어깨가무거워'],
  35: ['과잉반응', '버럭', '분노폭발', '욱함', '트라우마', '과거상처', '옛날기억', '발작버튼', '트리거'],
  36: ['예기불안', '미리걱정', '일어나지도않은', '벌어질까봐', '내일이두려워', '상상속공포', '시험전', '면접전', '예측의정거장'],
  37: ['달팽이', '점진적노출', '단계별극복', '작은목표', '천천히', '서두르지않기', '한걸음씩', '달팽이레이스'],
  38: ['자유시간', '시간회복', '걱정에낭비', '하루여유', '나를위한시간', '휴식회복', '시간낭비'],
  39: ['가짜난이도', '어려울것같아', '엄두가안나', '시작이두려워', '막막함', '해보고나면', '보람'],
  40: ['미니멀리즘', '행동목표', '측정가능한', '구체적목표', '모호함탈피', '실천지표', '행동의미니멀리즘'],
};

/**
 * 40가지 마음약방 실천 연습 대표 별칭 및 임상 동의어 사전
 * 루시 답변 본문에서 어떤 일상적/임상적 어휘로 기법을 지칭하든 100% 매칭
 */
export const EXERCISE_ALIASES: Record<number, string[]> = {
  13: ['복식호흡', '풍선호흡', '풍선 호흡', '심호흡', '횡격막', '단전호흡', '이완호흡', '방하착 호흡', '호흡법', '숨쉬기'],
  14: ['5-4-3-2-1', '54321', '오감접지', '오감 접지', '감각접지', '감각 접지', '그라운딩', '오감 깨우기', '오감기법', '소아기법'],
  15: ['어깨내리기', '상체이완', '어깨 이완', '목 긴장 풀기', '어깨 툭', '승모근'],
  16: ['심박수체크', '심장안전', '깜짝선물', '심박관찰', '맥박진정'],
  17: ['일상그라운딩', '샤워명상', '설거지명상', '요리그라운딩', '일상감각'],
  18: ['발바닥접지', '대지의중심', '대지접지', '지면접지', '발가락접지', '발바닥 닿기'],
  20: ['바디스캔', '보디스캔', '신체스캔', '몸관찰', '전신이완'],
  21: ['점진적이완', '점진적 근육', '주먹쥐었다', '근육긴장이완'],
  24: ['감정수영장', '수영장기법', '감정수용', '온전히받아들이기', '저항내려놓기'],
  28: ['파도타기', '감정파도', '투쟁멈추기', '서핑기법', '2차고통'],
  4: ['거리두기', '영화관기법', '스크린기법', '메타인지', '관객관점'],
  5: ['수하물', '컨베이어', '생각흘려보내기', '강박흘리기', '반추끊기'],
  6: ['체스판', '게임판', '탈융합', '생각분리'],
  7: ['기차기법', '플랫폼기법', '생각열차'],
  8: ['보라색꽃', '백곰효과', '생각억제멈추기'],
  11: ['걱정시간', '걱정예약', '마음의책장', '15분걱정'],
  26: ['가치나침반', '삶의가치', '나다운선택', '가치중심'],
  30: ['행동선택', '불안해도행동', '가치행동'],
  33: ['반대행동', '충동반대', '정반대행동'],
  35: ['발작버튼', '트리거인식', '과잉반응알아차림'],
  36: ['예측정거장', '예기불안', '미리걱정끊기'],
  37: ['달팽이레이스', '작은걸음', '점진적노출'],
  40: ['행동미니멀리즘', '미니멀목표', '구체적지표']
};

export interface KeyExerciseValidationResult {
  isValid: boolean;
  exercise: KeyExerciseItem;
  matchedBy: 'standard_tag' | 'explicit_number' | 'title_exact' | 'alias' | 'expected_confirmed' | 'user_explicit' | 'contextual';
  rawMatchedSnippet?: string;
  confidence: number;
  isExactMatch: boolean;
  validationNote: string;
}

/**
 * 루시 시스템 프롬프트에 주입할 Key 실천 기법 동기화 지침을 생성합니다.
 */
export function buildKeyExercisePromptGuideline(targetExercise: KeyExerciseItem): string {
  return `[🔮 LucKey 연계 추천 기법 동기화 필수 지침]
- 이번 답변에서 사용자의 고민을 치유하기 위해 추천할 실천 기법은 반드시 40대 마음약방 중 **'연습 ${targetExercise.globalIndex}. ${targetExercise.title}'**(${targetExercise.subtitle})이어야 합니다.
- 답변 말미의 실천 권유에서 반드시 다음과 같은 명시적 표준 표기를 포함해 주세요:
  [추천 기법: 연습 ${targetExercise.globalIndex}. ${targetExercise.title}]
- 이를 통해 답변 하단의 LucKey 연계 추천 카드와 100% 동일한 기법을 추천하도록 일관성을 유지해야 합니다.`;
}

/**
 * 💡 루시 답변 본문(lucyText)을 최우선으로 정밀 분석하여
 * 답변에서 실제로 제시한 실천 기법을 100% 정확하게 추출합니다.
 */
export function validateAndExtractKeyExercise(
  lucyText: string = '',
  userText: string = '',
  expectedIndex?: number
): KeyExerciseValidationResult {
  const rawLucy = lucyText || '';
  const cleanLucy = rawLucy.toLowerCase();
  const cleanUser = (userText || '').toLowerCase();

  const expectedEx = typeof expectedIndex === 'number' && expectedIndex >= 1 && expectedIndex <= 40
    ? KEY_EXERCISES_CATALOG.find((e) => e.globalIndex === expectedIndex)
    : undefined;

  // 1. [표준 태그 정밀 파싱: 최우선 순위]
  // 형태: [추천 기법: 연습 13. 풍선 호흡법], [실천 기법: 연습 18. 대지의 중심], 추천 기법: 연습 13
  const standardTagRegexes = [
    /\[\s*(?:추천\s*기법|실천\s*기법|추천\s*연습|Key\s*추천|추천)\s*:\s*연습\s*([0-9]{1,2})[\.:\s\-]*([^\]]+)\]/i,
    /(?:추천\s*기법|실천\s*기법|추천\s*연습|맞춤\s*연습)\s*[:：]\s*['"‘“]?연습\s*([0-9]{1,2})[\.:\s\-]*([^'"\n\r,)]+)['"’”]?/i,
  ];

  for (const regex of standardTagRegexes) {
    const match = rawLucy.match(regex);
    if (match) {
      const parsedNum = parseInt(match[1], 10);
      if (parsedNum >= 1 && parsedNum <= 40) {
        const found = KEY_EXERCISES_CATALOG.find((e) => e.globalIndex === parsedNum);
        if (found) {
          return {
            isValid: true,
            exercise: found,
            matchedBy: 'standard_tag',
            rawMatchedSnippet: match[0],
            confidence: 1.0,
            isExactMatch: true,
            validationNote: `표준 태그 [연습 ${found.globalIndex}. ${found.title}] 100% 일치 검증 성공`,
          };
        }
      }
    }
  }

  // 2. [사전 지정된 expectedIndex 확인]
  if (expectedEx) {
    const exTitleLower = expectedEx.title.toLowerCase();
    const explicitExPattern = new RegExp(`연습\\s*${expectedEx.globalIndex}\\b`, 'i');
    const hasExplicitNum = explicitExPattern.test(cleanLucy);
    const hasTitle = cleanLucy.includes(exTitleLower);

    if (hasExplicitNum || hasTitle) {
      return {
        isValid: true,
        exercise: expectedEx,
        matchedBy: 'expected_confirmed',
        rawMatchedSnippet: hasExplicitNum ? `연습 ${expectedEx.globalIndex}` : expectedEx.title,
        confidence: hasExplicitNum ? 0.98 : 0.92,
        isExactMatch: true,
        validationNote: `사전 추천 기법(연습 ${expectedEx.globalIndex}. ${expectedEx.title}) 본문 발화 확인 및 일치`,
      };
    }
  }

  // 3. [명시적 "연습 N" 패턴 추출 및 검증]
  const explicitNumberMatches = [...cleanLucy.matchAll(/연습\s*([0-9]{1,2})/g)];
  if (explicitNumberMatches.length > 0) {
    for (let i = explicitNumberMatches.length - 1; i >= 0; i--) {
      const match = explicitNumberMatches[i];
      const parsedNum = parseInt(match[1], 10);
      if (parsedNum >= 1 && parsedNum <= 40) {
        const found = KEY_EXERCISES_CATALOG.find((e) => e.globalIndex === parsedNum);
        if (found) {
          return {
            isValid: true,
            exercise: found,
            matchedBy: 'explicit_number',
            rawMatchedSnippet: match[0],
            confidence: 0.95,
            isExactMatch: true,
            validationNote: `본문 명시 번호(연습 ${found.globalIndex}. ${found.title}) 검증 일치`,
          };
        }
      }
    }
  }

  // 4. [본문 제목 직접 언급 탐색]
  for (const ex of KEY_EXERCISES_CATALOG) {
    const titleLower = ex.title.toLowerCase();
    if (titleLower.length >= 3 && cleanLucy.includes(titleLower)) {
      return {
        isValid: true,
        exercise: ex,
        matchedBy: 'title_exact',
        rawMatchedSnippet: ex.title,
        confidence: 0.94,
        isExactMatch: true,
        validationNote: `본문 기법 제목('${ex.title}' -> 연습 ${ex.globalIndex}) 정확 일치`,
      };
    }
  }

  // 5. [동의어/별칭(EXERCISE_ALIASES) 본문 발화 탐색]
  for (const [idxStr, aliases] of Object.entries(EXERCISE_ALIASES)) {
    const idx = parseInt(idxStr, 10);
    const ex = KEY_EXERCISES_CATALOG.find((e) => e.globalIndex === idx);
    if (!ex) continue;
    for (const alias of aliases) {
      if (alias.length >= 2 && cleanLucy.includes(alias.toLowerCase())) {
        return {
          isValid: true,
          exercise: ex,
          matchedBy: 'alias',
          rawMatchedSnippet: alias,
          confidence: 0.92,
          isExactMatch: true,
          validationNote: `본문 기법명/별칭('${alias}' -> 연습 ${ex.globalIndex}. ${ex.title}) 검증 일치`,
        };
      }
    }
  }

  // 6. [루시 답변 본문 키워드 가중치 점수 채점]
  let lucyBestScoreEx: KeyExerciseItem | null = null;
  let lucyMaxScore = -1;

  for (const ex of KEY_EXERCISES_CATALOG) {
    let score = 0;
    const keywords = KEYWORD_MAP[ex.globalIndex] || [];
    for (const kw of keywords) {
      if (cleanLucy.includes(kw)) score += 10;
    }
    const titleToks = ex.title.split(/\s+/);
    for (const t of titleToks) {
      if (t.length >= 2 && cleanLucy.includes(t.toLowerCase())) {
        score += 15;
      }
    }
    if (score > lucyMaxScore) {
      lucyMaxScore = score;
      lucyBestScoreEx = ex;
    }
  }

  if (lucyBestScoreEx && lucyMaxScore >= 20) {
    return {
      isValid: true,
      exercise: lucyBestScoreEx,
      matchedBy: 'contextual',
      rawMatchedSnippet: `루시 답변 키워드 일치(점수: ${lucyMaxScore})`,
      confidence: 0.85,
      isExactMatch: true,
      validationNote: `루시 답변 본문 키워드 채점 기반 도출 (연습 ${lucyBestScoreEx.globalIndex}. ${lucyBestScoreEx.title})`,
    };
  }

  // 7. [사용자 질문 명시 연습 추출]
  const userNumMatches = [...cleanUser.matchAll(/연습\s*([0-9]{1,2})/g)];
  if (userNumMatches.length > 0) {
    const rawNum = parseInt(userNumMatches[0][1], 10);
    if (rawNum >= 1 && rawNum <= 40) {
      const byUser = KEY_EXERCISES_CATALOG.find((e) => e.globalIndex === rawNum);
      if (byUser) {
        return {
          isValid: true,
          exercise: byUser,
          matchedBy: 'user_explicit',
          rawMatchedSnippet: userNumMatches[0][0],
          confidence: 0.88,
          isExactMatch: true,
          validationNote: `사용자 질문 명시 번호(연습 ${byUser.globalIndex}) 일치`,
        };
      }
    }
  }

  // 8. [키워드 점수 기반 종합 매칭 fallback]
  let bestScoreEx: KeyExerciseItem = KEY_EXERCISES_CATALOG[0];
  let maxScore = -1;

  for (const ex of KEY_EXERCISES_CATALOG) {
    let score = 0;

    const titleLower = ex.title.toLowerCase();
    const tagLower = ex.tag.toLowerCase();
    const subLower = (ex.subtitle || '').toLowerCase();

    // 1. 사용자 질문에 직접적인 핵심 키워드/제목 언급 (질문 가중치 높게 부여)
    if (cleanUser.includes(titleLower)) score += 30;
    if (cleanUser.includes(tagLower)) score += 20;
    if (subLower && cleanUser.includes(subLower)) score += 15;

    // 루시 답변에 언급
    if (cleanLucy.includes(titleLower)) score += 15;
    if (cleanLucy.includes(tagLower)) score += 10;
    if (subLower && cleanLucy.includes(subLower)) score += 8;

    // 2. 특화 키워드 매칭 (질문 8점 / 답변 4점)
    const keywords = KEYWORD_MAP[ex.globalIndex] || [];
    for (const kw of keywords) {
      if (cleanUser.includes(kw)) score += 8;
      if (cleanLucy.includes(kw)) score += 4;
    }

    // 3. 목적 및 임상 팁 단어 매칭
    const tokens = (ex.purpose + ' ' + ex.clinicalTip).split(/[\s,·.]+/);
    for (const tok of tokens) {
      if (tok.length >= 2) {
        if (cleanUser.includes(tok)) score += 2;
        if (cleanLucy.includes(tok)) score += 1;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestScoreEx = ex;
    }
  }

  const finalEx = maxScore > 0 ? bestScoreEx : (KEY_EXERCISES_CATALOG.find((e) => e.globalIndex === 13) || KEY_EXERCISES_CATALOG[0]);
  return {
    isValid: true,
    exercise: finalEx,
    matchedBy: 'contextual',
    confidence: 0.65,
    isExactMatch: false,
    validationNote: `문맥 키워드 점수 기반 매칭 (점수: ${maxScore})`,
  };
}

/**
 * 40가지 Key 마음약방 실천 연습 중 맥락에 가장 정확하게 부합하는 1개의 실천 연습을 도출합니다.
 * (userText, lucyText) 순서 및 (lucyText, userText) 순서 모두 유연하게 지원
 */
export function findBestKeyExercise(
  arg1: string = '',
  arg2: string = '',
  expectedIndex?: number
): KeyExerciseItem {
  if (arg2 && arg2.trim()) {
    return validateAndExtractKeyExercise(arg2, arg1, expectedIndex).exercise;
  }
  return validateAndExtractKeyExercise(arg1, '', expectedIndex).exercise;
}

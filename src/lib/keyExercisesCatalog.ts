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

// 각 연습별 특화 키워드 사전 (50가지 Key 마음약방 HSP 민감성 실천 연습 정밀 매핑)
const KEYWORD_MAP: Record<number, string[]> = {
  1: ['시각화', '그리기', '스케치', '불안모양', '형태', '색깔', '꺼내놓기', '외재화', '종이위에', '그림으로'],
  2: ['단어', '재구성', '하지만', '그리고', '말투', '생각바꾸기', '언어전환', '인지치료', '문장바꾸기', '부정적인말'],
  3: ['포스트잇', '붙이기', '게시판', '생각흘리기', '잡념', '머릿속복잡', '생각비우기', '메모'],
  4: ['거리두기', '영화관기법', '스크린기법', '메타인지', '관객관점'],
  5: ['수하물', '컨베이어', '생각흘려보내기', '강박흘리기', '반추끊기'],
  6: ['체스판', '게임판', '탈융합', '생각분리'],
  7: ['기차기법', '플랫폼기법', '생각열차'],
  8: ['보라색꽃', '백곰효과', '생각억제멈추기'],
  9: ['자기비판', '자책', '스스로비난', '내탓', '자괴감', '한심', '못난', '비판자', '자격미달', '자존감바닥'],
  10: ['토끼굴', '함정', '수렁', '부정적생각', '빨려들', '늪', '알아차림', '현재복귀', '고리끊기'],
  11: ['걱정시간', '걱정예약', '마음의책장', '15분걱정'],
  12: ['피자', '과부하', '뇌휴식', '걱정분할', '우선순위', '머리터질', '용량초과', '압도'],
  13: ['복식호흡', '풍선호흡', '풍선 호흡', '심호흡', '횡격막', '단전호흡', '이완호흡', '방하착 호흡', '호흡법', '숨쉬기'],
  14: ['5-4-3-2-1', '54321', '오감접지', '오감 접지', '감각접지', '감각 접지', '그라운딩', '오감 깨우기', '오감기법', '소아기법'],
  15: ['어깨내리기', '상체이완', '어깨 이완', '목 긴장 풀기', '어깨 툭', '승모근'],
  16: ['심박수체크', '심장안전', '깜짝선물', '심박관찰', '맥박진정'],
  17: ['일상그라운딩', '샤워명상', '설거지명상', '요리그라운딩', '일상감각'],
  18: ['발바닥접지', '대지의중심', '대지접지', '지면접지', '발가락접지', '발바닥 닿기'],
  19: ['즐겨찾기', '좋아하는것', '취향', '인지분류', '기분전환', '감각리스트', '소소한행복', '오감자극'],
  20: ['바디스캔', '보디스캔', '신체스캔', '몸관찰', '전신이완'],
  21: ['점진적이완', '점진적 근육', '주먹쥐었다', '근육긴장이완'],
  22: ['시간관리', '할일쪼개기', '과제분할', '세분화', '압도', '할일이너무많아', '정리안됨', '단계별', '쪼개기'],
  23: ['취약성', '달걀', '통제욕구', '힘빼기', '깨질까봐', '불안전', '견디기', '안절부절', '껍데기'],
  24: ['감정수영장', '수영장기법', '감정수용', '온전히받아들이기', '저항내려놓기'],
  25: ['발표', '시선', '타인시선', '무대', '면접', '남들의식', '카메라', '주목', '얼굴빨개짐', '목소리떨림', '스마일'],
  26: ['가치나침반', '삶의가치', '나다운선택', '가치중심'],
  27: ['미루기', '회피', '도망', '안락지대', '게으름', '핑계', '미루는습관', '딴짓', '생존의기로'],
  28: ['파도타기', '감정파도', '투쟁멈추기', '서핑기법', '2차고통'],
  29: ['바쁨', '일중독', '워커홀릭', '회피형바쁨', '모기떼', '불안해서일함', '쉬지못함', '일중독자'],
  30: ['행동선택', '불안해도행동', '가치행동'],
  31: ['거짓말', '마음의속임수', '핑계', '착각', '왜곡', '현실점검', '과장', '거짓말쟁이'],
  32: ['가면증후군', '사기꾼증후군', '들통날까봐', '부족한나', '가짜같아', '자격지심', '열등감', '가짜감정'],
  33: ['반대행동', '충동반대', '정반대행동'],
  34: ['사과나무', '스트레스자루', '수레', '짐덜기', '과부하', '버거움', '무거운책임감', '어깨가무거워'],
  35: ['발작버튼', '트리거인식', '과잉반응알아차림'],
  36: ['예측정거장', '예기불안', '미리걱정끊기'],
  37: ['달팽이레이스', '작은걸음', '점진적노출'],
  38: ['자유시간', '시간회복', '걱정에낭비', '하루여유', '나를위한시간', '휴식회복', '시간낭비'],
  39: ['가짜난이도', '어려울것같아', '엄두가안나', '시작이두려워', '막막함', '해보고나면', '보람'],
  40: ['행동미니멀리즘', '미니멀목표', '구체적지표'],
  41: ['매일휴식', '에너지재충전', '무목적쉼', '비생산적휴식'],
  42: ['일기장돌아보기', '하루돌아보기', '감정일기장', '오감일기'],
  43: ['스트레스해소도구상자', '도구상자', '오감도구함', '진정키트'],
  44: ['예민함오해바로잡기', '오해바로잡기', '기질바로알기'],
  45: ['격한감정조절', '감정수용하기', '감정서핑', '파도머무르기'],
  46: ['내면의비판가길들이기', '내면비판가', '자기자비대화'],
  47: ['불안과우울잠재우기', '신체그라운딩', '대지접지', '닻내리기'],
  48: ['나만의속도로살아가기', '나만의속도', '템포조절', '속도여유'],
  49: ['편안하게의사결정하기', '편안한의사결정', '선택가이드'],
  50: ['과도한생각가라앉히기', '생각비우기', '마인드덤프', '잠들기전생각정리'],
  51: ['꾸준한루틴만들기', '꾸준한루틴', '생활리듬설계'],
  52: ['반복되는스트레스파악하기', '스트레스파악', '트리거매핑'],
  53: ['잠시쉬어가기', '고요의공간', '미니휴식', '통찰의틈'],
  54: ['마음이편안해지는집만들기', '편안한집만들기', '안식처조성', '코지코너'],
  55: ['편안한수면공간만들기', '수면공간만들기', '센서리슬립케어'],
  56: ['아침의두려움누그러뜨리기', '아침두려움', '부드러운기상'],
  57: ['설탕카페인알코올줄이기', '자극물질줄이기', '신경계디톡스'],
  58: ['진정한자기돌봄실천하기', '진정한자기돌봄', '실질적자기돌봄'],
  59: ['덜일하는즐거움누리기', '덜일하기', '조모누리기', 'JOMO'],
  60: ['마음챙김미디어소비하기', '미디어소비', '디지털디톡스'],
  61: ['공감능력조절하기', '공감조절', '에너지쉴드', '감정보호막'],
  62: ['나의민감함에대해털어놓기', '민감함털어놓기', '기질나누기'],
  63: ['나와닮은민감한친구사귀기', '민감한친구사귀기', '소울메이트'],
  64: ['돌려말하지않고바로말하기', '바로말하기', '명확한소통'],
  65: ['연인과좋은관계만들기', '연인관계', '파트너십균형'],
  66: ['현명하게약속취소하기', '약속취소하기', '죄책감없는거절'],
  67: ['인간관계과부하이해하기', '인간관계과부하', '사회적배터리방전'],
  68: ['사회적생존전략세우기', '사회적생존전략', '모임완충전략'],
  69: ['약속이끝난후재충전하기', '약속후재충전', '사교후디브리핑'],
  70: ['비판에능숙하게대처하기', '비판대처하기', '피드백분리'],
  71: ['나에게맞는직업선택하기', '직업선택하기', '적합한커리어'],
  72: ['과도한자극줄이기', '업무자극줄이기', '소음차단'],
  73: ['사람들시선줄이기', '시선줄이기', '관찰긴장완화'],
  74: ['외향인세상에서살아남기', '외향인세상살아남기', '내향적리더십'],
  75: ['직장에서경계세우기', '직장경계세우기', '업무거절선'],
  76: ['일과삶의균형찾기', '일과삶균형', '워라밸확립'],
  77: ['성과압박감줄이기', '성과압박줄이기', '완벽주의탈피'],
  78: ['나에게필요한것요청하기', '필요한것요청하기', '환경조율요청'],
  79: ['자기돌봄으로하루시작하고마무리하기', '출퇴근완충리추얼', '하루시작과마무리'],
  80: ['월요일극복하기', '월요병극복', '일요일공포극복'],
  81: ['마침내진짜나를발견하기', '진짜나발견', '민감한정체성자각'],
  82: ['민감함속나다움찾기', '나다움찾기', '고유한개성'],
  83: ['과거의이야기다시쓰기', '과거이야기다시쓰기', '유년기상처재해석'],
  84: ['자기의심극복하기', '자기의심극복', '내면확신'],
  85: ['슬픔과수치심치유하기', '슬픔수치심치유', '자기용서'],
  86: ['매우민감한사람의시선으로세상바라보기', '민감한시선으로세상보기', '인생2막'],
  87: ['자신의직감신뢰하기', '직감신뢰하기', '육감연결'],
  88: ['꿈을통해마음들여다보기', '꿈을통해마음보기', '꿈저널'],
  89: ['풍부한영감으로마음충전하기', '영감으로마음충전', '심미안충전'],
  90: ['민감함이라는나만의강점발견하기', '민감함강점발견', '나만의무기선언']
};


/**
 * 50가지 마음약방 실천 연습 대표 별칭 및 임상 동의어 사전
 */
const KEY_SYNONYM_MAP: Record<number, string[]> = {
  "1": [
    "매일휴식",
    "에너지재충전",
    "무목적쉼",
    "비생산적휴식"
  ],
  "2": [
    "일기장돌아보기",
    "하루돌아보기",
    "감정일기장",
    "오감일기"
  ],
  "3": [
    "스트레스해소도구상자",
    "도구상자",
    "오감도구함",
    "진정키트"
  ],
  "4": [
    "예민함오해바로잡기",
    "오해바로잡기",
    "기질바로알기"
  ],
  "5": [
    "격한감정조절",
    "감정수용하기",
    "감정서핑",
    "파도머무르기"
  ],
  "6": [
    "내면의비판가길들이기",
    "내면비판가",
    "자기자비대화"
  ],
  "7": [
    "불안과우울잠재우기",
    "신체그라운딩",
    "대지접지",
    "닻내리기"
  ],
  "8": [
    "나만의속도로살아가기",
    "나만의속도",
    "템포조절",
    "속도여유"
  ],
  "9": [
    "편안하게의사결정하기",
    "편안한의사결정",
    "선택가이드"
  ],
  "10": [
    "과도한생각가라앉히기",
    "생각비우기",
    "마인드덤프",
    "잠들기전생각정리"
  ],
  "11": [
    "꾸준한루틴만들기",
    "꾸준한루틴",
    "생활리듬설계"
  ],
  "12": [
    "반복되는스트레스파악하기",
    "스트레스파악",
    "트리거매핑"
  ],
  "13": [
    "잠시쉬어가기",
    "고요의공간",
    "미니휴식",
    "통찰의틈"
  ],
  "14": [
    "마음이편안해지는집만들기",
    "편안한집만들기",
    "안식처조성",
    "코지코너"
  ],
  "15": [
    "편안한수면공간만들기",
    "수면공간만들기",
    "센서리슬립케어"
  ],
  "16": [
    "아침의두려움누그러뜨리기",
    "아침두려움",
    "부드러운기상"
  ],
  "17": [
    "설탕카페인알코올줄이기",
    "자극물질줄이기",
    "신경계디톡스"
  ],
  "18": [
    "진정한자기돌봄실천하기",
    "진정한자기돌봄",
    "실질적자기돌봄"
  ],
  "19": [
    "덜일하는즐거움누리기",
    "덜일하기",
    "조모누리기",
    "JOMO"
  ],
  "20": [
    "마음챙김미디어소비하기",
    "미디어소비",
    "디지털디톡스"
  ],
  "21": [
    "공감능력조절하기",
    "공감조절",
    "에너지쉴드",
    "감정보호막"
  ],
  "22": [
    "나의민감함에대해털어놓기",
    "민감함털어놓기",
    "기질나누기"
  ],
  "23": [
    "나와닮은민감한친구사귀기",
    "민감한친구사귀기",
    "소울메이트"
  ],
  "24": [
    "돌려말하지않고바로말하기",
    "바로말하기",
    "명확한소통"
  ],
  "25": [
    "연인과좋은관계만들기",
    "연인관계",
    "파트너십균형"
  ],
  "26": [
    "현명하게약속취소하기",
    "약속취소하기",
    "죄책감없는거절"
  ],
  "27": [
    "인간관계과부하이해하기",
    "인간관계과부하",
    "사회적배터리방전"
  ],
  "28": [
    "사회적생존전략세우기",
    "사회적생존전략",
    "모임완충전략"
  ],
  "29": [
    "약속이끝난후재충전하기",
    "약속후재충전",
    "사교후디브리핑"
  ],
  "30": [
    "비판에능숙하게대처하기",
    "비판대처하기",
    "피드백분리"
  ],
  "31": [
    "나에게맞는직업선택하기",
    "직업선택하기",
    "적합한커리어"
  ],
  "32": [
    "과도한자극줄이기",
    "업무자극줄이기",
    "소음차단"
  ],
  "33": [
    "사람들시선줄이기",
    "시선줄이기",
    "관찰긴장완화"
  ],
  "34": [
    "외향인세상에서살아남기",
    "외향인세상살아남기",
    "내향적리더십"
  ],
  "35": [
    "직장에서경계세우기",
    "직장경계세우기",
    "업무거절선"
  ],
  "36": [
    "일과삶의균형찾기",
    "일과삶균형",
    "워라밸확립"
  ],
  "37": [
    "성과압박감줄이기",
    "성과압박줄이기",
    "완벽주의탈피"
  ],
  "38": [
    "나에게필요한것요청하기",
    "필요한것요청하기",
    "환경조율요청"
  ],
  "39": [
    "자기돌봄으로하루시작하고마무리하기",
    "출퇴근완충리추얼",
    "하루시작과마무리"
  ],
  "40": [
    "월요일극복하기",
    "월요병극복",
    "일요일공포극복"
  ],
  "41": [
    "마침내진짜나를발견하기",
    "진짜나발견",
    "민감한정체성자각"
  ],
  "42": [
    "민감함속나다움찾기",
    "나다움찾기",
    "고유한개성"
  ],
  "43": [
    "과거의이야기다시쓰기",
    "과거이야기다시쓰기",
    "유년기상처재해석"
  ],
  "44": [
    "자기의심극복하기",
    "자기의심극복",
    "내면확신"
  ],
  "45": [
    "슬픔과수치심치유하기",
    "슬픔수치심치유",
    "자기용서"
  ],
  "46": [
    "매우민감한사람의시선으로세상바라보기",
    "민감한시선으로세상보기",
    "인생2막"
  ],
  "47": [
    "자신의직감신뢰하기",
    "직감신뢰하기",
    "육감연결"
  ],
  "48": [
    "꿈을통해마음들여다보기",
    "꿈을통해마음보기",
    "꿈저널"
  ],
  "49": [
    "풍부한영감으로마음충전하기",
    "영감으로마음충전",
    "심미안충전"
  ],
  "50": [
    "민감함이라는나만의강점발견하기",
    "민감함강점발견",
    "나만의무기선언"
  ]
};

export interface KeyExerciseValidationResult {
  isValid: boolean;
  exercise: KeyExerciseItem;
  matchedBy:
    | 'standard_tag'
    | 'expected_confirmed'
    | 'explicit_number'
    | 'title_direct'
    | 'synonym'
    | 'tag'
    | 'user_explicit'
    | 'contextual';
  rawMatchedSnippet?: string;
  confidence: number;
  isExactMatch: boolean;
  validationNote: string;
}

/**
 * 루시 시스템 프롬프트용 50대 실천 연습 강제 추천 지시문 생성기
 */
export function generateKeyExerciseInjectionRule(targetExercise: KeyExerciseItem): string {
  return `
[🔑 Key 50대 민감성 실천 연습 강제 추천 지침 — 최우선 준수]
- 이번 답변에서 사용자의 막힌 운기를 틔우고 마음을 정화하기 위해 추천할 개운법은 반드시 Key 개운 성전 50대 리추얼 중 **'연습 ${targetExercise.globalIndex}. ${targetExercise.title}'**(${targetExercise.subtitle})이어야 합니다.
- 답변 말미(또는 실천 조언 단락)에 아래 표준 추천 태그 형식을 정확히 포함하세요:
  ▶ [추천 기법: 연습 ${targetExercise.globalIndex}. ${targetExercise.title}]
- 엉뚱한 번호나 다른 기법 이름을 지어내지 마시고, 반드시 위 연습 ${targetExercise.globalIndex}번의 실천 원리와 임상 팁("${targetExercise.clinicalTip}")을 녹여 따뜻하게 권유하세요.
`;
}

/**
 * 루시의 발화문과 사용자 질의문을 엄밀하게 대조 검증하여 단 1개의 KeyExerciseItem을 확정합니다.
 */
export function validateAndExtractKeyExercise(
  lucyText: string = '',
  userText: string = '',
  expectedIndex?: number
): KeyExerciseValidationResult {
  const rawLucy = lucyText || '';
  const cleanLucy = rawLucy.toLowerCase();
  const cleanUser = (userText || '').toLowerCase();

  const expectedEx = typeof expectedIndex === 'number' && expectedIndex >= 1 && expectedIndex <= 50
    ? KEY_EXERCISES_CATALOG.find((e) => e.globalIndex === expectedIndex)
    : undefined;

  // 1. [표준 태그 정밀 파싱: 최우선 순위]
  // 형태: [추천 기법: 연습 1. 매일 휴식하며 에너지 재충전하기], [실천 기법: 연습 3. 스트레스 해소 도구 상자]
  const standardTagRegexes = [
    /\[\s*(?:추천\s*기법|실천\s*기법|추천\s*연습|Key\s*추천|추천)\s*:\s*연습\s*([0-9]{1,2})[\.:\s\-]*([^\]]+)\]/i,
    /(?:추천\s*기법|실천\s*기법|추천\s*연습|맞춤\s*연습)\s*[:：]\s*['"‘“]?연습\s*([0-9]{1,2})[\.:\s\-]*([^'"\n\r,)]+)['"’”]?/i,
  ];

  for (const regex of standardTagRegexes) {
    const match = rawLucy.match(regex);
    if (match) {
      const parsedNum = parseInt(match[1], 10);
      if (parsedNum >= 1 && parsedNum <= 50) {
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
      if (parsedNum >= 1 && parsedNum <= 50) {
        const found = KEY_EXERCISES_CATALOG.find((e) => e.globalIndex === parsedNum);
        if (found) {
          return {
            isValid: true,
            exercise: found,
            matchedBy: 'explicit_number',
            rawMatchedSnippet: match[0],
            confidence: 0.95,
            isExactMatch: true,
            validationNote: `명시적 연습 번호 [연습 ${found.globalIndex}] 본문 발견`,
          };
        }
      }
    }
  }

  // 4. [50대 실천 연습 제목 완전 일치 검증]
  for (const ex of KEY_EXERCISES_CATALOG) {
    const exTitleLower = ex.title.toLowerCase();
    if (cleanLucy.includes(exTitleLower)) {
      return {
        isValid: true,
        exercise: ex,
        matchedBy: 'title_direct',
        rawMatchedSnippet: ex.title,
        confidence: 0.90,
        isExactMatch: true,
        validationNote: `연습 제목 [${ex.title}] 직접 발화 일치`,
      };
    }
  }

  // 5. [동의어/별칭 사전 매칭]
  for (const [idxStr, synonyms] of Object.entries(KEY_SYNONYM_MAP)) {
    const idx = parseInt(idxStr, 10);
    for (const syn of synonyms) {
      if (cleanLucy.includes(syn.toLowerCase())) {
        const found = KEY_EXERCISES_CATALOG.find((e) => e.globalIndex === idx);
        if (found) {
          return {
            isValid: true,
            exercise: found,
            matchedBy: 'synonym',
            rawMatchedSnippet: syn,
            confidence: 0.85,
            isExactMatch: false,
            validationNote: `임상 별칭/동의어 [${syn}] -> 연습 ${found.globalIndex} 매핑`,
          };
        }
      }
    }
  }

  // 6. [카테고리 태그 일치 검증]
  for (const ex of KEY_EXERCISES_CATALOG) {
    const tagLower = ex.tag.toLowerCase();
    if (cleanLucy.includes(tagLower)) {
      return {
        isValid: true,
        exercise: ex,
        matchedBy: 'tag',
        rawMatchedSnippet: ex.tag,
        confidence: 0.78,
        isExactMatch: false,
        validationNote: `대표 태그 [${ex.tag}] 매칭`,
      };
    }
  }

  // 7. [사용자 질문에서 명시적 연습 번호 요청 확인]
  const userNumMatches = [...cleanUser.matchAll(/(?:연습|기법|치유|개운법)\s*([0-9]{1,2})/g)];
  if (userNumMatches.length > 0) {
    const uNum = parseInt(userNumMatches[0][1], 10);
    if (uNum >= 1 && uNum <= 50) {
      const byUser = KEY_EXERCISES_CATALOG.find((e) => e.globalIndex === uNum);
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

  const finalEx = maxScore > 0 ? bestScoreEx : (KEY_EXERCISES_CATALOG.find((e) => e.globalIndex === 1) || KEY_EXERCISES_CATALOG[0]);
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
 * 50가지 Key 마음약방 실천 연습 중 맥락에 가장 정확하게 부합하는 1개의 실천 연습을 도출합니다.
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

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
  "1": [
    "휴식",
    "에너지",
    "재충전",
    "쉼",
    "비생산적",
    "멍때리기",
    "충전",
    "방전",
    "피로",
    "지침",
    "무목적",
    "쉬어가기",
    "쉬기"
  ],
  "2": [
    "일기",
    "일기장",
    "기록",
    "돌아보기",
    "감정일기",
    "저널",
    "글쓰기",
    "내면화",
    "오감기록",
    "성찰",
    "하루정리"
  ],
  "3": [
    "도구상자",
    "스트레스",
    "오감",
    "키트",
    "비상",
    "진정",
    "도구함",
    "오감도구",
    "긴급안정",
    "힐링소품",
    "압도"
  ],
  "4": [
    "오해",
    "예민함",
    "기질",
    "인식",
    "약점",
    "결함",
    "HSP",
    "민감함",
    "차이",
    "낙인",
    "비정상",
    "인지전환"
  ],
  "5": [
    "감정",
    "격한감정",
    "조절",
    "수용",
    "파도",
    "머무르기",
    "감정기복",
    "감정조절",
    "분노",
    "슬픔",
    "울컥",
    "서핑"
  ],
  "6": [
    "비판가",
    "내면비판",
    "자책",
    "자기비판",
    "자비",
    "스스로비난",
    "질책",
    "너그러움",
    "자기사랑",
    "자괴감",
    "내면대화"
  ],
  "7": [
    "불안",
    "우울",
    "그라운딩",
    "안정",
    "접지",
    "발바닥",
    "닻",
    "잠재우기",
    "진정",
    "호흡",
    "공황",
    "초조"
  ],
  "8": [
    "속도",
    "나만의속도",
    "조급함",
    "페이스",
    "천천히",
    "느긋",
    "압박",
    "보폭",
    "속도조절",
    "여유",
    "쫓김"
  ],
  "9": [
    "결정",
    "의사결정",
    "선택",
    "우선순위",
    "결정장애",
    "우유부단",
    "선택장애",
    "결정마비",
    "가치관",
    "명쾌함"
  ],
  "10": [
    "생각",
    "과도한생각",
    "잠들기전",
    "마인드덤프",
    "잡념",
    "불면",
    "생각정리",
    "꼬리무는생각",
    "뇌과부하",
    "가라앉히기"
  ],
  "11": [
    "루틴",
    "꾸준한루틴",
    "생활리듬",
    "일상",
    "규칙적",
    "스케줄",
    "예측가능",
    "리듬",
    "아침루틴",
    "저녁루틴"
  ],
  "12": [
    "트리거",
    "스트레스요인",
    "반복되는스트레스",
    "에너지도둑",
    "패턴",
    "소진",
    "과부하지점",
    "선제예방",
    "원인분석"
  ],
  "13": [
    "쉼",
    "잠시쉬어가기",
    "공백",
    "고요",
    "여백",
    "멍하니",
    "창밖",
    "산책",
    "아이디어",
    "통찰",
    "미니휴식"
  ],
  "14": [
    "집",
    "안식처",
    "공간",
    "방정리",
    "인테리어",
    "코지",
    "아늑함",
    "소음차단",
    "조명",
    "정리정돈",
    "성역"
  ],
  "15": [
    "수면",
    "잠",
    "수면공간",
    "불면증",
    "숙면",
    "암막",
    "침실",
    "베개",
    "슬립케어",
    "침구",
    "수면위생"
  ],
  "16": [
    "아침",
    "기상",
    "모닝",
    "두려움",
    "알람",
    "눈뜨기",
    "아침불안",
    "코르티솔",
    "모닝케어",
    "온화한아침",
    "출근전"
  ],
  "17": [
    "설탕",
    "카페인",
    "알코올",
    "커피",
    "술",
    "디톡스",
    "식습관",
    "두근거림",
    "자극물질",
    "클린",
    "허브티"
  ],
  "18": [
    "자기돌봄",
    "진정한돌봄",
    "셀프케어",
    "나를위한",
    "돌봄",
    "웰니스",
    "영양",
    "휴식권리",
    "죄책감없는",
    "충전"
  ],
  "19": [
    "덜일하기",
    "조모",
    "JOMO",
    "FOMO",
    "단순함",
    "미니멀",
    "놓치는기쁨",
    "비우기",
    "과잉노동",
    "여백의미"
  ],
  "20": [
    "미디어",
    "디지털디톡스",
    "뉴스",
    "스마트폰",
    "소셜미디어",
    "알고리즘",
    "정보과부하",
    "스크린타임",
    "미디어소비"
  ],
  "21": [
    "공감",
    "공감능력",
    "에너지쉴드",
    "차폐막",
    "보호막",
    "감정흡수",
    "스펀지",
    "남의감정",
    "경계선",
    "차단"
  ],
  "22": [
    "털어놓기",
    "기질고백",
    "자기표현",
    "소통",
    "민감함설명",
    "이해구하기",
    "대화법",
    "솔직함",
    "커밍아웃"
  ],
  "23": [
    "친구",
    "민감한친구",
    "소울메이트",
    "인연",
    "깊은대화",
    "이해받음",
    "우정",
    "마음통하는",
    "소속감"
  ],
  "24": [
    "직설",
    "바로말하기",
    "돌려말하지않기",
    "명확한소통",
    "단호함",
    "비폭력대화",
    "요청",
    "솔직한표현",
    "의사표현"
  ],
  "25": [
    "연인",
    "연애",
    "부부",
    "파트너",
    "사랑",
    "개인공간",
    "친밀함",
    "거리두기",
    "이해",
    "서로다름"
  ],
  "26": [
    "약속취소",
    "거절",
    "약속",
    "취소",
    "모임거절",
    "양해",
    "죄책감없는거절",
    "체력방전",
    "쉬고싶을때",
    "정중한거절"
  ],
  "27": [
    "과부하",
    "인간관계과부하",
    "사회적배터리",
    "모임피로",
    "스몰토크",
    "기빨림",
    "사람피로",
    "지침",
    "대인기피"
  ],
  "28": [
    "생존전략",
    "사회적생존",
    "모임대처",
    "파티",
    "행사",
    "비상탈출",
    "완충시간",
    "모임전략",
    "퇴장시간"
  ],
  "29": [
    "약속후",
    "사후재충전",
    "모임끝나고",
    "귀가후",
    "정화",
    "혼자만의시간",
    "긴장풀기",
    "샤워",
    "에너지회수"
  ],
  "30": [
    "비판",
    "피드백",
    "비난",
    "상처",
    "평가",
    "지적",
    "자존감",
    "비판대처",
    "쿠쿠다스",
    "유리멘탈"
  ],
  "31": [
    "직업",
    "커리어",
    "적성",
    "직무",
    "진로",
    "이직",
    "가치관",
    "적합한직업",
    "직업선택",
    "일"
  ],
  "32": [
    "자극줄이기",
    "소음",
    "형광등",
    "사무실",
    "노이즈캔슬링",
    "집중력",
    "데스크",
    "자극최소화",
    "환경조율"
  ],
  "33": [
    "시선",
    "사람들시선",
    "관찰",
    "등뒤",
    "모니터",
    "지켜봄",
    "긴장",
    "프라이버시",
    "시선분리",
    "작업몰입"
  ],
  "34": [
    "외향인",
    "외향성",
    "내향성",
    "회의",
    "말빠른사람",
    "조용한힘",
    "서면보고",
    "내향적리더십",
    "침묵의힘"
  ],
  "35": [
    "직장경계",
    "업무경계",
    "거절",
    "업무과다",
    "초과근무",
    "야근",
    "부탁거절",
    "업무조율",
    "호구탈출"
  ],
  "36": [
    "워라밸",
    "일과삶",
    "퇴근",
    "퇴근후",
    "오프라인",
    "업무분리",
    "스위치오프",
    "칼퇴",
    "균형",
    "개인생활"
  ],
  "37": [
    "성과압박",
    "완벽주의",
    "80퍼센트",
    "굿이너프",
    "성과",
    "압박감",
    "탈진",
    "완벽",
    "충분함"
  ],
  "38": [
    "요청하기",
    "필요요청",
    "지원요청",
    "조정",
    "상사면담",
    "업무환경개선",
    "당당한요청",
    "배려요청",
    "협의"
  ],
  "39": [
    "출퇴근",
    "출근",
    "퇴근",
    "완충리추얼",
    "하루시작",
    "하루마무리",
    "지하철",
    "걷기",
    "전환의식"
  ],
  "40": [
    "월요일",
    "월요병",
    "일요일밤",
    "일요일우울",
    "주말끝",
    "새로운한주",
    "월요일극복",
    "한주시작",
    "공포"
  ],
  "41": [
    "진짜나",
    "발견",
    "정체성",
    "깨달음",
    "안도감",
    "자각",
    "화해",
    "본모습",
    "자아발견",
    "수용"
  ],
  "42": [
    "나다움",
    "고유함",
    "개성",
    "틀",
    "라벨탈피",
    "자기다움",
    "취향",
    "독창성",
    "나만의색깔",
    "특별함"
  ],
  "43": [
    "과거",
    "유년기",
    "어린시절",
    "상처",
    "다시쓰기",
    "기억재해석",
    "내면아이",
    "치유",
    "오해풀기",
    "트라우마"
  ],
  "44": [
    "자기의심",
    "의심극복",
    "직관신뢰",
    "확신",
    "내면감각",
    "흔들림없는",
    "자기믿음",
    "판단력",
    "지각"
  ],
  "45": [
    "슬픔",
    "수치심",
    "눈물",
    "치유",
    "애도",
    "자책벗어나기",
    "용서",
    "자기용서",
    "해방",
    "정화"
  ],
  "46": [
    "새로운시선",
    "인생2막",
    "관점전환",
    "새로운눈",
    "전환점",
    "삶의의미",
    "재해석",
    "세계관",
    "자부심"
  ],
  "47": [
    "직감",
    "육감",
    "직관",
    "장감각",
    "느낌",
    "예감",
    "본능",
    "신뢰",
    "내면의목소리",
    "통찰"
  ],
  "48": [
    "꿈",
    "꿈일기",
    "무의식",
    "상징",
    "꿈해석",
    "수면중",
    "마음들여다보기",
    "꿈기록",
    "내면욕구"
  ],
  "49": [
    "영감",
    "예술",
    "자연",
    "황홀경",
    "심미안",
    "감동",
    "에너지충전",
    "아름다움",
    "미술",
    "음악"
  ],
  "50": [
    "강점",
    "슈퍼파워",
    "선물",
    "나만의무기",
    "자부심",
    "최종선언",
    "민감함의힘",
    "강점발견",
    "위대한힘",
    "축복"
  ]
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

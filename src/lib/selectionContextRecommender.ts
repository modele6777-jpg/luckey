/**
 * selectionContextRecommender.ts
 * 선택된 텍스트의 맥락(감정·키워드·의도)을 실시간 감지하여
 * 프리즘 20가지 정규 메뉴 중 가장 적합한 추천 경로를 동적으로 산출하는 추천 엔진
 * "상시 다른 추천경로": 맥락 가중치 + 동적 회전 해시를 통해 매번 신선하고 다채로운 경로를 제안
 */

import { savePendingSelection } from './selectionBridge';
import { sendPrismToss } from './prismToss';

export interface PrismMenuDestination {
  id: string;
  name: string;
  subName: string;
  path: string;
  basePath: string;
  emoji: string;
  badge: string;
  themeColor: string;
  buttonClass: string;
  textClass: string;
  borderClass: string;
  keywords: string[];
  intentRegex: RegExp;
  contextReason: string;
  tossTargetId: string;
}

/**
 * 프리즘 전체 앱 기능 및 세부 메뉴 통합 경로 정의 (39대 핵심 기능)
 */
export const PRISM_ALL_APP_DESTINATIONS: PrismMenuDestination[] = [
  // 1. 트리니티 오라클 타로
  {
    id: 'trinity_oracle',
    name: '트리니티 오라클',
    subName: '3장 타로 & 무의식 신탁',
    path: '/trinity?tab=oracle',
    basePath: '/trinity',
    emoji: '🔮',
    badge: '운명 나침반',
    themeColor: '#c084fc',
    buttonClass: 'bg-purple-500/20 hover:bg-purple-500/35 text-purple-200 hover:text-purple-100',
    textClass: 'text-purple-300',
    borderClass: 'border-purple-400/40',
    keywords: ['타로', '오라클', '카드', '상징', '무의식', '운명', '미래', '예언', '점성', '비의', '나침반', '결정', '기로', '선택', '앞날'],
    intentRegex: /타로|오라클|카드|상징|운명|미래|예언|점성|나침반|기로|앞날|선택의 기로|결정/i,
    contextReason: '운명과 무의식 상징을 읽어내는 오라클 타로 추천',
    tossTargetId: 'trinity',
  },
  // 2. 사주 만세력 리포트
  {
    id: 'trinity_saju',
    name: 'SAJU',
    subName: '음양오행 운명 리포트',
    path: '/trinity?tab=destiny',
    basePath: '/trinity',
    emoji: '📜',
    badge: '명리 만세력',
    themeColor: '#f59e0b',
    buttonClass: 'bg-amber-500/20 hover:bg-amber-500/35 text-amber-200 hover:text-amber-100',
    textClass: 'text-amber-300',
    borderClass: 'border-amber-400/40',
    keywords: ['사주', '만세력', '팔자', '오행', '목화토금수', '십신', '대운', '세운', '일간', '천간', '지지', '용신', '기운', '타고난', '명식'],
    intentRegex: /사주|만세력|팔자|오행|목화토금수|십신|대운|세운|일간|천간|지지|용신|명식/i,
    contextReason: '타고난 기운과 오행 대운을 짚어보는 사주 만세력 추천',
    tossTargetId: 'trinity',
  },
  // 3. 데일리 타로 스프레드
  {
    id: 'trinity_daily',
    name: '데일리 타로 덱',
    subName: '오늘의 78장 타로 휠',
    path: '/trinity?tab=tarot',
    basePath: '/trinity',
    emoji: '🃏',
    badge: '오늘의 덱',
    themeColor: '#eab308',
    buttonClass: 'bg-yellow-500/20 hover:bg-yellow-500/35 text-yellow-200 hover:text-yellow-100',
    textClass: 'text-yellow-300',
    borderClass: 'border-yellow-400/40',
    keywords: ['오늘', '하루', '데일리', '오늘의 운세', '일일', '카드 뽑기', '셔플', '행운', '럭키', '스프레드', '하루 기운'],
    intentRegex: /오늘|데일리|하루 운세|카드 뽑기|럭키|행운|스프레드|오늘 하루/i,
    contextReason: '오늘 하루의 행운과 에너지를 점치는 데일리 타로 추천',
    tossTargetId: 'trinity',
  },
  // 4. 사주·타로 융합 신탁
  {
    id: 'trinity_fusion',
    name: '사주·타로 융합 신탁',
    subName: '명리와 심상의 입체적 공명',
    path: '/trinity?tab=fusion',
    basePath: '/trinity',
    emoji: '🌟',
    badge: '융합 리포트',
    themeColor: '#d946ef',
    buttonClass: 'bg-fuchsia-500/20 hover:bg-fuchsia-500/35 text-fuchsia-200 hover:text-fuchsia-100',
    textClass: 'text-fuchsia-300',
    borderClass: 'border-fuchsia-400/40',
    keywords: ['융합', '입체', '사주타로', '통찰', '심층 분석', '교차', '운명분석', '동양서양', '다면적'],
    intentRegex: /융합|사주타로|입체적|다면적|동서양|교차 분석/i,
    contextReason: '사주의 명리와 타로의 심상을 하나로 융합한 입체 신탁 추천',
    tossTargetId: 'trinity',
  },
  // 5. 재물·사업·커리어 운명
  {
    id: 'trinity_wealth',
    name: '재물 & 커리어 운명',
    subName: '금전운·성공·사업의 길',
    path: '/trinity?tab=wealth',
    basePath: '/trinity',
    emoji: '🪙',
    badge: '재물 & 커리어',
    themeColor: '#eab308',
    buttonClass: 'bg-amber-600/20 hover:bg-amber-600/35 text-amber-200 hover:text-amber-100',
    textClass: 'text-amber-300',
    borderClass: 'border-amber-400/40',
    keywords: ['돈', '재물', '금전', '사업', '커리어', '취업', '승진', '투자', '부자', '재테크', '직장', '성공', '소득', '일', '계약'],
    intentRegex: /돈|재물|금전|사업|커리어|취업|승진|투자|부자|재테크|직장|소득|일자리|계약/i,
    contextReason: '재물운의 흐름과 성공적인 커리어 행로를 짚어보는 리포트 추천',
    tossTargetId: 'trinity',
  },
  // 6. 연애·궁합·인연 리포트
  {
    id: 'trinity_relationship',
    name: '연애 & 궁합 신탁',
    subName: '마음의 끌림과 인연의 결',
    path: '/trinity?tab=relationship',
    basePath: '/trinity',
    emoji: '💖',
    badge: '연애 & 궁합',
    themeColor: '#ec4899',
    buttonClass: 'bg-pink-500/20 hover:bg-pink-500/35 text-pink-200 hover:text-pink-100',
    textClass: 'text-pink-300',
    borderClass: 'border-pink-400/40',
    keywords: ['사랑', '연애', '궁합', '이성', '인연', '마음', '남친', '여친', '결혼', '호감', '썸', '짝사랑', '헤어짐', '재회', '연인'],
    intentRegex: /사랑|연애|궁합|이성|인연|남친|여친|결혼|호감|썸|짝사랑|헤어졌|재회|연인/i,
    contextReason: '마음의 이끌림과 두 영혼의 궁합 및 인연의 결을 살펴보는 연애 신탁 추천',
    tossTargetId: 'trinity',
  },
  // 7. 뮤즈 예술처방
  {
    id: 'muse_art',
    name: '뮤즈 예술처방',
    subName: '명화·명시·명곡 삼위일체',
    path: '/muse',
    basePath: '/muse',
    emoji: '🎨',
    badge: '명작 처방',
    themeColor: '#a855f7',
    buttonClass: 'bg-indigo-500/20 hover:bg-indigo-500/35 text-indigo-200 hover:text-indigo-100',
    textClass: 'text-indigo-300',
    borderClass: 'border-indigo-400/40',
    keywords: ['예술', '명화', '그림', '화가', '명시', '시', '명곡', '음악', '선율', '아름다움', '심미', '감수성', '영감', '낭만', '작품', '색채'],
    intentRegex: /예술|명화|그림|화가|명시|명곡|음악|선율|아름다움|심미|감수성|영감|낭만|작품|미술/i,
    contextReason: '마음의 감성에 깊이 공명하는 명화·명시·명곡 예술처방 추천',
    tossTargetId: 'muse',
  },
  // 8. 거장 명작 오디오 도슨트
  {
    id: 'muse_docent',
    name: '뮤즈 도슨트',
    subName: '명작 심층 오디오 해설',
    path: '/muse?mode=docent',
    basePath: '/muse',
    emoji: '🎧',
    badge: '음성 도슨트',
    themeColor: '#818cf8',
    buttonClass: 'bg-violet-500/20 hover:bg-violet-500/35 text-violet-200 hover:text-violet-100',
    textClass: 'text-violet-300',
    borderClass: 'border-violet-400/40',
    keywords: ['도슨트', '해설', '오디오', '귀로 듣는', '갤러리', '미술관', '배경 이야기', '비하인드', '음성', '전시'],
    intentRegex: /도슨트|해설|오디오|귀로|갤러리|미술관|배경 이야기|음성 해설|전시회/i,
    contextReason: '거장의 화폭 뒤편 숨겨진 이야기를 듣는 오디오 도슨트 추천',
    tossTargetId: 'muse',
  },
  // 9. 오늘의 명작 큐레이션
  {
    id: 'muse_daily',
    name: '데일리 뮤즈 아트',
    subName: '오늘의 영감 명작 큐레이션',
    path: '/muse?mode=daily',
    basePath: '/muse',
    emoji: '🖼️',
    badge: '오늘의 명작',
    themeColor: '#6366f1',
    buttonClass: 'bg-indigo-600/20 hover:bg-indigo-600/35 text-indigo-200 hover:text-indigo-100',
    textClass: 'text-indigo-300',
    borderClass: 'border-indigo-400/40',
    keywords: ['전시', '오늘의 명작', '갤러리', '화폭', '예술가', '컬렉션', '큐레이션', '오늘의 그림'],
    intentRegex: /오늘의 명작|오늘의 그림|데일리 아트|갤러리 탐색/i,
    contextReason: '오늘 하루 지친 마음에 불을 밝혀줄 세계적 명작 큐레이션 추천',
    tossTargetId: 'muse',
  },
  // 10. 마음 치유 명시 처방
  {
    id: 'muse_poem',
    name: '뮤즈 명시 처방',
    subName: '영혼을 적시는 한 줄의 시',
    path: '/muse?tab=artRecommendation',
    basePath: '/muse',
    emoji: '📜',
    badge: '명시 처방',
    themeColor: '#8b5cf6',
    buttonClass: 'bg-purple-600/20 hover:bg-purple-600/35 text-purple-200 hover:text-purple-100',
    textClass: 'text-purple-300',
    borderClass: 'border-purple-400/40',
    keywords: ['시', '명시', '시인', '시집', '문학', '시구', '구절', '운율', '읊조림', '문장'],
    intentRegex: /명시|시인|시집|시구|시 구절|문학 처방/i,
    contextReason: '메마른 마음에 촉촉한 단비가 되어주는 세계 명시 처방 추천',
    tossTargetId: 'muse',
  },
  // 11. 영혼의 명곡 음악처방
  {
    id: 'muse_music',
    name: '뮤즈 음악 선율',
    subName: '마음을 울리는 영혼의 선율',
    path: '/muse?tab=music',
    basePath: '/muse',
    emoji: '🎵',
    badge: '명곡 처방',
    themeColor: '#a855f7',
    buttonClass: 'bg-fuchsia-600/20 hover:bg-fuchsia-600/35 text-fuchsia-200 hover:text-fuchsia-100',
    textClass: 'text-fuchsia-300',
    borderClass: 'border-fuchsia-400/40',
    keywords: ['음악', '명곡', '클래식', '선율', '피아노', '현악', '노래', '악기', '멜로디', '연주', '음향'],
    intentRegex: /음악|명곡|클래식|선율|피아노|현악|멜로디|연주곡/i,
    contextReason: '깊은 내면의 파동을 조화롭게 이끄는 클래식 명곡 음악처방 추천',
    tossTargetId: 'muse',
  },
  // 12. 영감의 아틀리에 창작
  {
    id: 'muse_atelier',
    name: '영감의 아틀리에',
    subName: '예술적 상상력과 창작',
    path: '/muse?tab=atelier',
    basePath: '/muse',
    emoji: '🏛️',
    badge: '창작 아틀리에',
    themeColor: '#c084fc',
    buttonClass: 'bg-violet-600/20 hover:bg-violet-600/35 text-violet-200 hover:text-violet-100',
    textClass: 'text-violet-300',
    borderClass: 'border-violet-500/40',
    keywords: ['아틀리에', '창작', '영감', '상상력', '아이디어', '작업실', '표현', '창의성'],
    intentRegex: /아틀리에|창작|영감|상상력|창의적|작업실/i,
    contextReason: '내면의 잠든 예술가적 창의성과 영감을 일깨우는 아틀리에 추천',
    tossTargetId: 'muse',
  },
  // 13. 오렌지 감정 성찰 & 연금술
  {
    id: 'orange_mind',
    name: '오렌지 마음 성찰',
    subName: '내면 아이 & 감정 연금술',
    path: '/orange',
    basePath: '/orange',
    emoji: '🍊',
    badge: '감정 성찰',
    themeColor: '#fb923c',
    buttonClass: 'bg-orange-500/20 hover:bg-orange-500/35 text-orange-200 hover:text-orange-100',
    textClass: 'text-orange-300',
    borderClass: 'border-orange-400/40',
    keywords: ['마음', '감정', '내면', '아이', '불안', '분노', '화', '질투', '두려움', '성찰', '연금술', '심리', '자존감', '멘탈', '외로움'],
    intentRegex: /마음|감정|내면|불안|분노|질투|두려움|성찰|연금술|심리|자존감|자책|속상/i,
    contextReason: '복잡한 감정을 마주하고 내면 아이를 보듬는 마음 성찰 추천',
    tossTargetId: 'orange',
  },
  // 14. 별에게 소원빌기 & 확언
  {
    id: 'orange_well',
    name: '별에게 소원빌기',
    subName: '시크릿 확언 & 별빛 소원',
    path: '/orange?tab=wishingWell',
    basePath: '/orange',
    emoji: '⭐',
    badge: '별빛 소원',
    themeColor: '#f97316',
    buttonClass: 'bg-amber-600/20 hover:bg-amber-600/35 text-amber-200 hover:text-amber-100',
    textClass: 'text-amber-300',
    borderClass: 'border-amber-500/40',
    keywords: ['소원', '별', '우물', '바람', '소망', '확언', '시크릿', '끌어당김', '기원', '기도', '이루어', '기적', '희망', '목표', '꿈'],
    intentRegex: /소원|별|우물|바람|소망|확언|시크릿|끌어당김|기원|기도|이루어|기적|희망|꼭 되게/i,
    contextReason: '간절한 소망을 밤하늘 별에 띄우고 실시간 확언을 받는 별에게 소원빌기 추천',
    tossTargetId: 'orange',
  },
  // 15. 감정 일기 & 무드 로그
  {
    id: 'orange_diary',
    name: '오렌지 무드 다이어리',
    subName: '오늘의 감정 온도 기록',
    path: '/orange?tab=diary',
    basePath: '/orange',
    emoji: '📔',
    badge: '감정 다이어리',
    themeColor: '#ea580c',
    buttonClass: 'bg-orange-600/20 hover:bg-orange-600/35 text-orange-200 hover:text-orange-100',
    textClass: 'text-orange-300',
    borderClass: 'border-orange-500/40',
    keywords: ['무드', '다이어리', '감정일기', '기분', '감정온도', '감정상태', '오늘 기분', '체크인'],
    intentRegex: /무드|감정일기|기분|감정 온도|오늘 기분|체크인/i,
    contextReason: '시시각각 변하는 감정의 온도를 차분히 기록하는 무드 다이어리 추천',
    tossTargetId: 'orange',
  },
  // 16. 감정 방생 & 흘려보내기
  {
    id: 'orange_release',
    name: '감정 방생의 방',
    subName: '마음의 짐을 우주로 방생',
    path: '/orange?tab=release',
    basePath: '/orange',
    emoji: '🕊️',
    badge: '감정 방생',
    themeColor: '#f97316',
    buttonClass: 'bg-amber-500/20 hover:bg-amber-500/35 text-amber-200 hover:text-amber-100',
    textClass: 'text-amber-300',
    borderClass: 'border-amber-400/40',
    keywords: ['방생', '떠나보내기', '훌훌', '털어버리기', '해방', '우주로', '자유로움'],
    intentRegex: /방생|떠나보내|털어버|훌훌/i,
    contextReason: '응어리진 감정을 태우고 우주로 홀가분하게 날려보내는 방생 의식 추천',
    tossTargetId: 'orange',
  },
  // 17. 매일의 시크릿 확언장
  {
    id: 'orange_affirmation',
    name: '시크릿 확언장',
    subName: '풍요와 자존감의 긍정 선언',
    path: '/orange?tab=affirmation',
    basePath: '/orange',
    emoji: '✨',
    badge: '긍정 확언',
    themeColor: '#f59e0b',
    buttonClass: 'bg-yellow-600/20 hover:bg-yellow-600/35 text-yellow-200 hover:text-yellow-100',
    textClass: 'text-yellow-300',
    borderClass: 'border-yellow-500/40',
    keywords: ['확언', '긍정', '선언', '나는할수있다', '자존감', '풍요', '감사선언', '끌어당김의법칙'],
    intentRegex: /확언|긍정|선언|풍요|자존감 높이기/i,
    contextReason: '풍요와 빛나는 자존감을 끌어당기는 일일 긍정 확언장 추천',
    tossTargetId: 'orange',
  },
  // 18. 파랑새의 성소
  {
    id: 'bluebird_sanctuary',
    name: '파랑새의 성소',
    subName: '영혼의 상처 치유 & 위로',
    path: '/bluebird',
    basePath: '/bluebird',
    emoji: '🐦',
    badge: '영혼 안식',
    themeColor: '#0ea5e9',
    buttonClass: 'bg-cyan-500/20 hover:bg-cyan-500/35 text-cyan-200 hover:text-cyan-100',
    textClass: 'text-cyan-300',
    borderClass: 'border-cyan-400/40',
    keywords: ['상처', '아픔', '치유', '위로', '눈물', '토닥토닥', '파랑새', '안식', '쉼', '외로움', '품', '온기', '슬픔'],
    intentRegex: /상처|아픔|치유|위로|눈물|토닥|파랑새|안식|외로|슬프|가슴 아파/i,
    contextReason: '지친 마음에 따스한 온기와 무조건적 위로를 건네는 파랑새의 성소 추천',
    tossTargetId: 'bluebird',
  },
  // 19. 일상 감사 일기
  {
    id: 'bluebird_gratitude',
    name: '일상 감사 일기',
    subName: '소소한 행복 & 감사의 온기',
    path: '/bluebird?tab=gratitude',
    basePath: '/bluebird',
    emoji: '🌻',
    badge: '감사와 온기',
    themeColor: '#facc15',
    buttonClass: 'bg-yellow-500/20 hover:bg-yellow-500/35 text-yellow-200 hover:text-yellow-100',
    textClass: 'text-yellow-300',
    borderClass: 'border-yellow-400/40',
    keywords: ['감사', '고마움', '행복', '일상', '소소한', '다행', '축복', '햇살', '미소', '따뜻한', '기쁨', '고마워'],
    intentRegex: /감사|고마|행복|일상|소소|다행|축복|햇살|미소|기쁨|고마워/i,
    contextReason: '일상의 소박한 축복과 감사를 마음 깊이 새기는 감사 일기 추천',
    tossTargetId: 'bluebird',
  },
  // 20. 희망의 편지 우체통
  {
    id: 'bluebird_letter',
    name: '희망의 편지 우체통',
    subName: '마음을 전하는 사랑과 위로의 서신',
    path: '/bluebird?tab=letter',
    basePath: '/bluebird',
    emoji: '💌',
    badge: '희망의 서신',
    themeColor: '#38bdf8',
    buttonClass: 'bg-sky-500/20 hover:bg-sky-500/35 text-sky-200 hover:text-sky-100',
    textClass: 'text-sky-300',
    borderClass: 'border-sky-400/40',
    keywords: ['편지', '우체통', '답장', '메시지', '누군가에게', '전하는', '전하고 싶은 말', '서신', '마음 전하기'],
    intentRegex: /편지|우체통|서신|답장|전하고 싶은 말|전하는 마음/i,
    contextReason: '말 못 한 진심과 따스한 사랑을 전하는 희망의 편지 추천',
    tossTargetId: 'bluebird',
  },
  // 21. 고요한 위로의 숲 쉼터
  {
    id: 'bluebird_forest',
    name: '위로의 숲 쉼터',
    subName: '피톤치드와 새소리 힐링 명상',
    path: '/bluebird?tab=forest',
    basePath: '/bluebird',
    emoji: '🌲',
    badge: '위로의 숲',
    themeColor: '#10b981',
    buttonClass: 'bg-emerald-600/20 hover:bg-emerald-600/35 text-emerald-200 hover:text-emerald-100',
    textClass: 'text-emerald-300',
    borderClass: 'border-emerald-500/40',
    keywords: ['숲', '피톤치드', '새소리', '나무', '자연', '쉼터', '바람소리', '휴식처', '산책'],
    intentRegex: /숲|피톤치드|새소리|자연 소리|산책길|쉼터/i,
    contextReason: '새소리와 푸른 나무 사이에서 깊은 안식을 얻는 위로의 숲 추천',
    tossTargetId: 'bluebird',
  },
  // 22. 아우라 신체 웰니스
  {
    id: 'heal_wellness',
    name: '아우라 신체 웰니스',
    subName: '1분 호흡 & 생체 에너지',
    path: '/heal?tab=oneMinute',
    basePath: '/heal',
    emoji: '🌿',
    badge: '호흡 & 이완',
    themeColor: '#10b981',
    buttonClass: 'bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-200 hover:text-emerald-100',
    textClass: 'text-emerald-300',
    borderClass: 'border-emerald-400/40',
    keywords: ['신체', '몸', '호흡', '숨', '피로', '스트레스', '긴장', '근육', '이완', '웰니스', '바디스캔', '휴식', '어깨', '목', '지침'],
    intentRegex: /신체|몸|호흡|숨쉬|피로|스트레스|긴장|근육|이완|바디스캔|휴식|지쳤|뻐근/i,
    contextReason: '몸의 긴장을 풀고 깊은 숨으로 생체 리듬을 회복하는 웰니스 추천',
    tossTargetId: 'heal',
  },
  // 23. 호오포노포노 정화
  {
    id: 'heal_hoponopono',
    name: '호오포노포노 정화',
    subName: '4마디 카르마 정화',
    path: '/heal?tab=hoponopono',
    basePath: '/heal',
    emoji: '🌊',
    badge: '에너지 정화',
    themeColor: '#06b6d4',
    buttonClass: 'bg-teal-500/20 hover:bg-teal-500/35 text-teal-200 hover:text-teal-100',
    textClass: 'text-teal-300',
    borderClass: 'border-teal-400/40',
    keywords: ['호오포노포노', '미안합니다', '용서하세요', '감사합니다', '사랑합니다', '정화', '카르마', '기억', '클리어링', '지우기', '무의식 청소', '원망'],
    intentRegex: /호오포노포노|미안|용서|정화|카르마|클리어링|원망|죄책감|기억 소거/i,
    contextReason: '잠재의식의 묵은 상처와 기억을 맑게 소거하는 호오포노포노 추천',
    tossTargetId: 'heal',
  },
  // 24. 세도나 릴리즈
  {
    id: 'heal_sedona',
    name: '세도나 릴리즈',
    subName: '감정 5단계 흘려보내기',
    path: '/heal?tab=sedona',
    basePath: '/heal',
    emoji: '🕊️',
    badge: '놓아보내기',
    themeColor: '#38bdf8',
    buttonClass: 'bg-sky-500/20 hover:bg-sky-500/35 text-sky-200 hover:text-sky-100',
    textClass: 'text-sky-300',
    borderClass: 'border-sky-400/40',
    keywords: ['흘려보내기', '놓아주기', '세도나', '집착', '내려놓음', '릴리즈', '자유', '비우기', '무거움', '해방', '미련'],
    intentRegex: /흘려보내|놓아주|세도나|집착|내려놓|릴리즈|비우기|무거워|털어내|미련/i,
    contextReason: '마음을 무겁게 짓누르는 집착을 홀가분하게 놓아주는 세도나 릴리즈 추천',
    tossTargetId: 'heal',
  },
  // 25. 마인드풀 프라나야마 호흡
  {
    id: 'heal_breathing',
    name: '프라나야마 호흡',
    subName: '생명 에너지를 깨우는 리드미컬 호흡',
    path: '/heal?tab=breathing',
    basePath: '/heal',
    emoji: '🫁',
    badge: '심호흡 명상',
    themeColor: '#059669',
    buttonClass: 'bg-emerald-700/20 hover:bg-emerald-700/35 text-emerald-200 hover:text-emerald-100',
    textClass: 'text-emerald-300',
    borderClass: 'border-emerald-600/40',
    keywords: ['호흡법', '단전호흡', '심호흡', '프라나야마', '숨고르기', '호흡 트레이닝', '가슴답답', '과호흡', '안정'],
    intentRegex: /호흡법|단전호흡|심호흡|프라나야마|숨고르기|가슴답답/i,
    contextReason: '생명 에너지를 고르게 순환시키고 자율신경을 안정시키는 프라나야마 추천',
    tossTargetId: 'heal',
  },
  // 26. 7대 차크라 에너지 정렬
  {
    id: 'heal_chakra',
    name: '7대 차크라 정렬',
    subName: '생체 전자기장 & 아우라 에너지 조율',
    path: '/heal?tab=chakra',
    basePath: '/heal',
    emoji: '🧘',
    badge: '차크라 정렬',
    themeColor: '#8b5cf6',
    buttonClass: 'bg-purple-600/20 hover:bg-purple-600/35 text-purple-200 hover:text-purple-100',
    textClass: 'text-purple-300',
    borderClass: 'border-purple-500/40',
    keywords: ['차크라', '에너지 센터', '아우라', '기', '전자기장', '쿤달리니', '에너지 정렬', '빛의 센터'],
    intentRegex: /차크라|에너지 센터|아우라|쿤달리니|에너지 정렬/i,
    contextReason: '미세 에너지 바디의 7대 차크라를 조화롭게 일치시키는 정렬 명상 추천',
    tossTargetId: 'heal',
  },
  // 27. 바이노럴 비트 & 힐링 주파수
  {
    id: 'heal_frequency',
    name: '바이노럴 힐링 주파수',
    subName: '뇌파 동조 432Hz & 528Hz 사운드',
    path: '/heal?tab=frequency',
    basePath: '/heal',
    emoji: '🔔',
    badge: '힐링 주파수',
    themeColor: '#06b6d4',
    buttonClass: 'bg-cyan-600/20 hover:bg-cyan-600/35 text-cyan-200 hover:text-cyan-100',
    textClass: 'text-cyan-300',
    borderClass: 'border-cyan-500/40',
    keywords: ['주파수', '432hz', '528hz', '바이노럴', '싱잉볼', '음향치유', '사운드배스', '뇌파동조', '소리치유'],
    intentRegex: /주파수|432hz|528hz|바이노럴|싱잉볼|음향치유|사운드배스/i,
    contextReason: '치유의 진동 주파수로 뇌파를 알파·세타파로 유도하는 사운드 힐링 추천',
    tossTargetId: 'heal',
  },
  // 28. 에필로그 밤 서재
  {
    id: 'epilogue_journal',
    name: '에필로그 밤 서재',
    subName: '영감의 밤 서재 일기',
    path: '/epilogue',
    basePath: '/epilogue',
    emoji: '📖',
    badge: '서재 일기',
    themeColor: '#34d399',
    buttonClass: 'bg-emerald-600/20 hover:bg-emerald-600/35 text-emerald-200 hover:text-emerald-100',
    textClass: 'text-emerald-300',
    borderClass: 'border-emerald-500/40',
    keywords: ['서재', '일기', '밤', '저녁', '기록', '글쓰기', '사유', '문장', '생각 정리', '에필로그', '수필', '노트'],
    intentRegex: /서재|일기|밤|저녁|기록|글쓰기|사유|문장|생각 정리|에필로그|수필|메모/i,
    contextReason: '하루의 생각과 영감을 한 편의 수필처럼 고요히 담는 밤 서재 추천',
    tossTargetId: 'epilogue',
  },
  // 29. 영혼 결산 회고
  {
    id: 'epilogue_retrospect',
    name: '영혼 결산 회고',
    subName: '하루 여정 종합 결산',
    path: '/epilogue?tab=retrospect',
    basePath: '/epilogue',
    emoji: '🌌',
    badge: '하루 결산',
    themeColor: '#14b8a6',
    buttonClass: 'bg-teal-600/20 hover:bg-teal-600/35 text-teal-200 hover:text-teal-100',
    textClass: 'text-teal-300',
    borderClass: 'border-teal-500/40',
    keywords: ['회고', '결산', '마무리', '발자취', '여정', '매듭', '정리', '하루 끝', '반성', '성취', '매듭짓기'],
    intentRegex: /회고|결산|마무리|발자취|여정|매듭|정리|하루 끝|반성|성취|하루를 마치며/i,
    contextReason: '오늘의 발자취를 온전히 매듭짓고 결산하는 종합 에필로그 추천',
    tossTargetId: 'epilogue',
  },
  // 30. 밤하늘 별빛 기억 보관소
  {
    id: 'epilogue_stars',
    name: '별빛 기억 보관소',
    subName: '밤하늘에 수놓은 영혼의 기억',
    path: '/epilogue?tab=stars',
    basePath: '/epilogue',
    emoji: '🌠',
    badge: '기억 보관소',
    themeColor: '#818cf8',
    buttonClass: 'bg-indigo-500/20 hover:bg-indigo-500/35 text-indigo-200 hover:text-indigo-100',
    textClass: 'text-indigo-300',
    borderClass: 'border-indigo-400/40',
    keywords: ['별빛', '기억', '추억', '보관', '아카이브', '잊지못할', '별자리', '새겨진'],
    intentRegex: /별빛|기억 보관|추억|잊지 못할|영혼의 기억/i,
    contextReason: '소중한 기억과 깨달음을 영원의 별빛으로 보관하는 기억 보관소 추천',
    tossTargetId: 'epilogue',
  },
  // 31. 미래 영혼의 타임캡슐
  {
    id: 'epilogue_capsule',
    name: '영혼의 타임캡슐',
    subName: '미래의 나에게 띄우는 편지',
    path: '/epilogue?tab=capsule',
    basePath: '/epilogue',
    emoji: '⏳',
    badge: '타임캡슐',
    themeColor: '#a78bfa',
    buttonClass: 'bg-violet-600/20 hover:bg-violet-600/35 text-violet-200 hover:text-violet-100',
    textClass: 'text-violet-300',
    borderClass: 'border-violet-500/40',
    keywords: ['타임캡슐', '미래의나', '1년뒤', '후에', '약속', '봉인', '시간여행'],
    intentRegex: /타임캡슐|미래의 나|1년 뒤|시간을 넘어/i,
    contextReason: '시공간을 넘어 미래의 나에게 전하는 약속과 응원의 타임캡슐 추천',
    tossTargetId: 'epilogue',
  },
  // 32. 지혜의 리바이블
  {
    id: 'handbook_bible',
    name: '지혜의 리바이블',
    subName: '영혼의 안내서 & 바이블',
    path: '/handbook',
    basePath: '/handbook',
    emoji: '🧭',
    badge: '지혜 바이블',
    themeColor: '#d97706',
    buttonClass: 'bg-amber-600/20 hover:bg-amber-600/35 text-amber-200 hover:text-amber-100',
    textClass: 'text-amber-300',
    borderClass: 'border-amber-500/40',
    keywords: ['성경', '말씀', '지혜', '바이블', '리바이블', '경전', '진리', '길', '철학', '성서', '구도', '가르침'],
    intentRegex: /성경|말씀|지혜|바이블|리바이블|경전|진리|구도|성서|교훈|가르침/i,
    contextReason: '삶의 혼란을 가라앉히고 바른 방향을 비추는 지혜의 바이블 추천',
    tossTargetId: 'handbook',
  },
  // 33. 오늘의 만나 잠언
  {
    id: 'handbook_manna',
    name: '오늘의 만나 잠언',
    subName: '생명의 지혜 한 구절',
    path: '/handbook?tab=manna',
    basePath: '/handbook',
    emoji: '🍞',
    badge: '오늘의 잠언',
    themeColor: '#b45309',
    buttonClass: 'bg-amber-700/20 hover:bg-amber-700/35 text-amber-200 hover:text-amber-100',
    textClass: 'text-amber-300',
    borderClass: 'border-amber-600/40',
    keywords: ['만나', '잠언', '격언', '명언', '아침', '교훈', '생명', '양식', '한 구절', '영적 양식'],
    intentRegex: /만나|잠언|격언|명언|교훈|한 구절|양식|마음의 양식/i,
    contextReason: '하루를 지탱하는 생명의 지혜 한 구절 오늘의 만나 추천',
    tossTargetId: 'handbook',
  },
  // 34. 음성 오디오 낭독 바이블
  {
    id: 'handbook_audio',
    name: '오디오 바이블 낭독',
    subName: '귀로 듣는 거룩한 음성',
    path: '/handbook?tab=audio',
    basePath: '/handbook',
    emoji: '🎙️',
    badge: '오디오 낭독',
    themeColor: '#c2410c',
    buttonClass: 'bg-orange-700/20 hover:bg-orange-700/35 text-orange-200 hover:text-orange-100',
    textClass: 'text-orange-300',
    borderClass: 'border-orange-600/40',
    keywords: ['낭독', '오디오북', '음성말씀', '귀로듣는', '성우', '소리성서'],
    intentRegex: /낭독|오디오 바이블|음성 말씀|귀로 듣는 말씀/i,
    contextReason: '마음을 편안하게 채워주는 따뜻한 오디오 지혜 낭독 추천',
    tossTargetId: 'handbook',
  },
  // 35. 생애 고민 지혜 검색
  {
    id: 'handbook_search',
    name: '지혜의 문답 검색',
    subName: '상황별 즉문즉답 영적 처방',
    path: '/handbook?tab=search',
    basePath: '/handbook',
    emoji: '🔍',
    badge: '지혜 검색',
    themeColor: '#d97706',
    buttonClass: 'bg-amber-600/20 hover:bg-amber-600/35 text-amber-200 hover:text-amber-100',
    textClass: 'text-amber-300',
    borderClass: 'border-amber-500/40',
    keywords: ['질문', '문답', '처방', '경전검색', '인생질문', '해답찾기', '지혜사전'],
    intentRegex: /문답|인생 질문|해답 찾기|지혜 사전|처방 검색/i,
    contextReason: '현재 처한 삶의 딜레마에 명쾌한 빛을 던져주는 지혜 검색 추천',
    tossTargetId: 'handbook',
  },
  // 36. 영혼 프로필
  {
    id: 'soul_profile',
    name: '영혼 프로필 & 명식',
    subName: '내면 성향 & 성장 아카이브',
    path: '/profile',
    basePath: '/profile',
    emoji: '👤',
    badge: '성향 아카이브',
    themeColor: '#a78bfa',
    buttonClass: 'bg-indigo-600/20 hover:bg-indigo-600/35 text-indigo-200 hover:text-indigo-100',
    textClass: 'text-indigo-300',
    borderClass: 'border-indigo-500/40',
    keywords: ['프로필', '나', '자아', '성향', '정체성', '성장', '발자국', '기록', '아카이브', '히스토리', '내면 성향'],
    intentRegex: /프로필|자아|성향|정체성|나라는 사람|성장 기록|아카이브|내 모습/i,
    contextReason: '나만의 본질적 기질과 영혼의 성장 발자취를 비추는 프로필 추천',
    tossTargetId: 'profile',
  },
  // 37. 옴니워프 시공간 도약
  {
    id: 'omniwarp_portal',
    name: '옴니워프 유니버스',
    subName: '시공간 빅뱅 차원 도약',
    path: '/omniwarp',
    basePath: '/omniwarp',
    emoji: '🌀',
    badge: '빅뱅 차원도약',
    themeColor: '#00f0ff',
    buttonClass: 'bg-cyan-600/20 hover:bg-cyan-600/35 text-cyan-200 hover:text-cyan-100',
    textClass: 'text-cyan-300',
    borderClass: 'border-cyan-400/40',
    keywords: ['우주', '차원', '빅뱅', '웜홀', '도약', '화이트홀', '블랙홀', '시공간', '워프', '초월', '포털', '특이점'],
    intentRegex: /우주|차원|빅뱅|웜홀|도약|화이트홀|블랙홀|시공간|워프|초월|포털|특이점/i,
    contextReason: '시공간의 제약을 뛰어넘어 전 차원으로 도약하는 옴니워프 추천',
    tossTargetId: 'omniwarp',
  },
  // 38. 우주 시너지 허브
  {
    id: 'hub_synergy',
    name: '우주 시너지 허브',
    subName: '6채널 융합 & 공명',
    path: '/synergy',
    basePath: '/synergy',
    emoji: '🪐',
    badge: '6채널 시너지',
    themeColor: '#06b6d4',
    buttonClass: 'bg-sky-600/20 hover:bg-sky-600/35 text-sky-200 hover:text-sky-100',
    textClass: 'text-sky-300',
    borderClass: 'border-sky-500/40',
    keywords: ['시너지', '우주', '조화', '융합', '공명', '다채널', '허브', '프롤로그', '연결', '종합', '생태계'],
    intentRegex: /시너지|조화|융합|공명|다채널|허브|프롤로그|연결|전체/i,
    contextReason: '6대 프리즘 채널의 융합과 상호 공명을 조망하는 시너지 추천',
    tossTargetId: 'hub',
  },
  // 39. eCPR 생체 리듬
  {
    id: 'hub_ecpr',
    name: 'eCPR 생체 리듬',
    subName: '실시간 에너지 밸런스',
    path: '/ecpr',
    basePath: '/ecpr',
    emoji: '⚡',
    badge: '생체 밸런스',
    themeColor: '#38bdf8',
    buttonClass: 'bg-blue-600/20 hover:bg-blue-600/35 text-blue-200 hover:text-blue-100',
    textClass: 'text-blue-300',
    borderClass: 'border-blue-500/40',
    keywords: ['바이오', '리듬', '에너지', 'ecpr', '활력', '충전', '밸런스', '맥박', '파동', '컨디션', '생체', '생체신호'],
    intentRegex: /바이오|리듬|에너지|ecpr|활력|충전|밸런스|맥박|파동|컨디션|생체신호/i,
    contextReason: '현재 나의 실시간 생체 리듬과 에너지 파동을 조율하는 eCPR 추천',
    tossTargetId: 'hub',
  },
];

// 하위 호환성을 위한 20대 메뉴 별칭 연동 (전체 기능으로 완전 확장)
export const PRISM_20_MENU_DESTINATIONS = PRISM_ALL_APP_DESTINATIONS;

export interface TopRankedMenu {
  rank: 1 | 2 | 3;
  menu: PrismMenuDestination;
  contextReason: string;
  matchScore: number;
}

export interface RecommendedMenuResult {
  menu: PrismMenuDestination;
  contextReason: string;
  matchScore: number;
  allRankedMenus: Array<{ menu: PrismMenuDestination; score: number; reason: string }>;
  currentIndex: number;
  totalCandidates: number;
  top3: TopRankedMenu[];
}

/**
 * 텍스트 단순 해시 생성기
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * 🛡️ 주어진 목적지 경로가 현재 사용자가 머무르는 페이지와 실질적으로 동일한 페이지(앱/채널)인지 정밀 판별
 */
export function isSameAppOrPage(destPath: string, currentPath: string = ''): boolean {
  if (!destPath) return false;

  const getCleanPath = (p: string) => {
    let clean = (p || '').toLowerCase().trim();
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
      try {
        clean = new URL(clean).pathname;
      } catch (_) {}
    }
    return clean.split('?')[0].replace(/\/$/, '') || '/';
  };

  const currClean = getCleanPath(currentPath);
  const destClean = getCleanPath(destPath);
  const winClean = typeof window !== 'undefined' ? getCleanPath(window.location.pathname) : currClean;

  // 1. 둘 중 하나가 메인 허브('/')일 때
  if (currClean === '/' || winClean === '/') {
    return destClean === '/';
  }

  // 2. 기본 경로가 일치할 때 (예: /trinity, /orange, /heal, /muse, /bluebird, /epilogue)
  if (destClean === currClean || destClean === winClean) {
    return true;
  }

  // 3. 서브 경로 일치 (예: /trinity/... vs /trinity)
  if (currClean !== '/' && (destClean.startsWith(currClean + '/') || currClean.startsWith(destClean + '/'))) {
    return true;
  }
  if (winClean !== '/' && (destClean.startsWith(winClean + '/') || winClean.startsWith(destClean + '/'))) {
    return true;
  }

  // 4. 별칭 호환 검사
  if ((currClean === '/handbook' || winClean === '/handbook') && (destClean === '/rebible' || destClean === '/handbook')) return true;
  if ((currClean === '/rebible' || winClean === '/rebible') && (destClean === '/handbook' || destClean === '/rebible')) return true;
  if ((currClean === '/omniwarp' || winClean === '/omniwarp') && (destClean === '/bigbang' || destClean === '/omniwarp')) return true;

  return false;
}

/**
 * 텍스트 맥락 감지 및 프리즘 전체 앱 기능 중 최적의 동적 추천 경로 도출
 * - 현재 위치한 페이지는 추천 대상에서 자동 배제 (현재 동일한 페이지 100% 원천 배제)
 * - 텍스트의 키워드, 감정, 의도를 감지하여 가중치 채점
 * - "상시 다른 추천경로": 동일하거나 유사한 텍스트라도 매 세션/시간대/사이클에 따라
 *   상위 적합 후보군 중 다양한 경로를 동적으로 순환 제안
 */
export function getRecommendedMenu(
  text: string,
  currentPath: string = '',
  cycleOffset: number = 0
): RecommendedMenuResult {
  const trimmed = (text || '').trim().toLowerCase();

  // 1. 현재 머무르고 있는 페이지/모듈 완전 제외 (동일 페이지/앱으로의 무의미한 토스 원천 방지)
  const availableMenus = PRISM_ALL_APP_DESTINATIONS.filter((menu) => {
    if (isSameAppOrPage(menu.path, currentPath) || isSameAppOrPage(menu.basePath, currentPath)) {
      return false;
    }
    return true;
  });

  const candidatesToScore = availableMenus.length > 0
    ? availableMenus
    : PRISM_ALL_APP_DESTINATIONS.filter((m) => !isSameAppOrPage(m.path, currentPath) && !isSameAppOrPage(m.basePath, currentPath));

  // 2. 맥락 채점 (Keyword + Regex Intent + Sentiment Boosters)
  const scored = candidatesToScore.map((menu) => {
    let score = 1; // 기본 점수

    // (1) 키워드 매칭 (키워드 길이에 따른 가중치)
    for (const kw of menu.keywords) {
      if (trimmed.includes(kw.toLowerCase())) {
        score += Math.max(kw.length * 4, 8);
      }
    }

    // (2) 정규식 의도 매칭 (+25점)
    if (menu.intentRegex.test(trimmed)) {
      score += 25;
    }

    // (3) 감정 및 상황별 시너지 보정
    // 슬픔/상처/외로움 감정 맥락
    if (/슬프|눈물|괴로|힘들|외로|아파|상처|울적/.test(trimmed)) {
      if (menu.id === 'bluebird_sanctuary' || menu.id === 'heal_hoponopono') score += 20;
      if (menu.id === 'orange_mind' || menu.id === 'muse_art' || menu.id === 'bluebird_forest') score += 15;
    }
    // 소망/바람/미래 계획 맥락
    if (/바라|소원|성공|이루|하고 싶|꿈|목표|소망/.test(trimmed)) {
      if (menu.id === 'orange_well' || menu.id === 'trinity_oracle') score += 22;
      if (menu.id === 'trinity_saju' || menu.id === 'orange_affirmation' || menu.id === 'epilogue_capsule') score += 18;
    }
    // 돈/재물/사업/투자 맥락
    if (/돈|재물|금전|사업|투자|부자|직장|취업|월급|계약/.test(trimmed)) {
      if (menu.id === 'trinity_wealth' || menu.id === 'trinity_saju') score += 28;
    }
    // 사랑/연애/궁합/인연 맥락
    if (/사랑|연애|궁합|이성|남친|여친|인연|결혼|썸|헤어짐/.test(trimmed)) {
      if (menu.id === 'trinity_relationship' || menu.id === 'trinity_oracle') score += 28;
    }
    // 피로/신체 스트레스/호흡 맥락
    if (/피곤|지쳤|숨|뻐근|목|어깨|스트레스|휴식|졸려|답답/.test(trimmed)) {
      if (menu.id === 'heal_wellness' || menu.id === 'heal_breathing' || menu.id === 'hub_ecpr') score += 22;
      if (menu.id === 'heal_sedona' || menu.id === 'bluebird_sanctuary' || menu.id === 'heal_frequency') score += 16;
    }
    // 차크라/영적 에너지 맥락
    if (/차크라|에너지|오라|기운|명상|수련/.test(trimmed)) {
      if (menu.id === 'heal_chakra' || menu.id === 'heal_frequency') score += 25;
    }
    // 기록/생각 정리/저녁/기억 맥락
    if (/생각|정리|오늘|하루|마무리|기억|적어|일기|추억/.test(trimmed)) {
      if (menu.id === 'epilogue_journal' || menu.id === 'epilogue_retrospect' || menu.id === 'epilogue_stars') score += 22;
      if (menu.id === 'trinity_daily' || menu.id === 'handbook_bible') score += 14;
    }
    // 예술/음악/감수성 맥락
    if (/노래|그림|시|글귀|예술|선율|아름다|감상|도슨트/.test(trimmed)) {
      if (menu.id === 'muse_art' || menu.id === 'muse_docent' || menu.id === 'muse_poem' || menu.id === 'muse_music') score += 26;
    }
    // 편지/위로/메시지 맥락
    if (/편지|전하고|메시지|우체통|글을 띄우/.test(trimmed)) {
      if (menu.id === 'bluebird_letter' || menu.id === 'epilogue_capsule') score += 25;
    }

    return {
      menu,
      score,
      reason: menu.contextReason,
    };
  });

  // 점수 내림차순 정렬
  scored.sort((a, b) => b.score - a.score);

  const maxScore = scored[0]?.score || 1;
  const hasStrongMatch = maxScore >= 12;

  // 상위 적합 후보군 추출
  // 강한 매칭이 있는 경우: 최고 점수의 60% 이상인 후보군(또는 상위 8개)
  // 중립 텍스트인 경우: 가용한 전체 후보군 순환
  const topTier = hasStrongMatch
    ? scored.filter((item) => item.score >= Math.max(maxScore * 0.6, 8)).slice(0, 8)
    : scored;

  // "상시 다른 추천경로" 동적 회전 계산:
  // 텍스트 해시 + 분 단위 슬롯 + cycleOffset 조합으로 매 선택마다 고유하면서도 신선한 추천 산출
  const textHash = simpleHash(trimmed);
  const timeSlot = Math.floor(Date.now() / (1000 * 20)); // 20초마다 주기적 회전 슬라이스
  const candidateIndex = Math.abs(textHash + timeSlot + cycleOffset) % topTier.length;

  // 🌟 상위 1순위, 2순위, 3순위 고유 추천 경로 산출 (중복 원천 방지)
  const usedIds = new Set<string>();
  const pickCandidate = (offset: number) => {
    for (let i = 0; i < topTier.length; i++) {
      const idx = (candidateIndex + offset + i) % topTier.length;
      const candidate = topTier[idx];
      if (candidate && !usedIds.has(candidate.menu.id)) {
        usedIds.add(candidate.menu.id);
        return candidate;
      }
    }
    for (const item of scored) {
      if (!usedIds.has(item.menu.id)) {
        usedIds.add(item.menu.id);
        return item;
      }
    }
    return scored[0];
  };

  const firstCandidate = pickCandidate(0);
  const secondCandidate = pickCandidate(1);
  const thirdCandidate = pickCandidate(2);

  const rawTop3: TopRankedMenu[] = [
    { rank: 1, menu: firstCandidate.menu, contextReason: firstCandidate.reason, matchScore: firstCandidate.score },
    { rank: 2, menu: secondCandidate.menu, contextReason: secondCandidate.reason, matchScore: secondCandidate.score },
    { rank: 3, menu: thirdCandidate.menu, contextReason: thirdCandidate.reason, matchScore: thirdCandidate.score },
  ];

  // 🎲 추천 후보 3가지를 무작위로 섞어 배치 (각 순위 노출 없이 동등한 무작위 선택지로 제시)
  const shuffledTop3 = [...rawTop3];
  for (let i = shuffledTop3.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledTop3[i], shuffledTop3[j]] = [shuffledTop3[j], shuffledTop3[i]];
  }

  const chosen = firstCandidate;

  return {
    menu: chosen.menu,
    contextReason: chosen.reason,
    matchScore: chosen.score,
    allRankedMenus: scored,
    currentIndex: candidateIndex,
    totalCandidates: topTier.length,
    top3: shuffledTop3,
  };
}

/**
/**
 * 선택된 텍스트를 추천된 메뉴로 즉각 토스(Toss) & 해당 기능 바로 실행
 */
export function tossSelectionToMenu(
  text: string,
  menu: PrismMenuDestination,
  currentPath: string,
  navigate: (path: string) => void
): void {
  if (!text || text.trim().length < 2) return;
  const trimmed = text.trim();

  try {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(45);
    }
  } catch (_) {}

  // 1. 쿼리 파라미터에서 탭 및 모드 파싱
  let targetTab: string | null = null;
  let targetMode: string | null = null;
  if (menu.path.includes('?')) {
    try {
      const url = new URL(menu.path, 'http://localhost');
      targetTab = url.searchParams.get('tab');
      targetMode = url.searchParams.get('mode');
    } catch (_) {}
  }
  const effectiveTab = targetTab || targetMode || (menu.path.includes('/chat') ? 'chat' : null);

  // 2. 세션 스토리지에 상세 토스 및 즉시 실행 플래그 보존
  if (typeof window !== 'undefined') {
    try {
      if (effectiveTab) {
        sessionStorage.setItem('prism_target_tab', effectiveTab);
      }
      sessionStorage.setItem('prism_auto_execute_text', trimmed);
      sessionStorage.setItem('prism_auto_execute_target', menu.id);
      sessionStorage.setItem('prism_auto_execute_path', menu.path);
      sessionStorage.setItem('prism_auto_execute_timestamp', String(Date.now()));
    } catch (_) {}
  }

  // 3. 세션 스토리지에 드래그 선택 컨텍스트 저장
  savePendingSelection(trimmed, menu.id, currentPath, {
    targetMenuId: menu.id,
    targetPath: menu.path,
    contextReason: menu.contextReason,
  });

  // 4. 통합 프리즘 토스 파이프라인 전송 (타깃 앱 수신 및 autoTrigger 즉시 실행)
  sendPrismToss({
    sourceApp: currentPath || 'selection_bridge',
    targetApp: menu.tossTargetId,
    actionType: 'smart_toss',
    contextMessage: trimmed,
    autoPrompt: trimmed,
    autoTrigger: true,
    tossedAt: Date.now(),
  });

  // 5. 브라우저 커스텀 이벤트 발행 (즉시 실행 및 탭 전환)
  if (typeof window !== 'undefined') {
    // 탭 변경 이벤트 먼저 발행
    if (effectiveTab) {
      window.dispatchEvent(new CustomEvent('prism-tab-change', { detail: { tab: effectiveTab } }));
    }

    // 토스 이벤트 발행
    window.dispatchEvent(
      new CustomEvent('prism:selection_tossed', {
        detail: {
          text: trimmed,
          targetMenu: menu,
          sourcePath: currentPath,
          tab: effectiveTab,
          autoTrigger: true,
        },
      })
    );

    // 즉각 기능 실행 전용 이벤트 발행
    window.dispatchEvent(
      new CustomEvent('prism:selection_execute', {
        detail: {
          text: trimmed,
          targetMenu: menu,
          targetMenuId: menu.id,
          targetPath: menu.path,
          sourcePath: currentPath,
          tab: effectiveTab,
          autoTrigger: true,
        },
      })
    );

    window.dispatchEvent(new CustomEvent('nav-click-active', { detail: { path: menu.path, tab: effectiveTab } }));
    window.dispatchEvent(new CustomEvent('prism-navigate', { detail: { path: menu.path, tab: effectiveTab } }));
  }

  // 6. 목적지 경로로 즉각 이동 실행
  navigate(menu.path);
}


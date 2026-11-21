/**
 * 📘 페이지 가이드: 화면마다 우측 상단 가이드 버튼으로 여는 짧은 활용 팁.
 * 심플하게 3~5개, 초보자도 바로 따라 할 수 있는 말투로.
 */
export interface PageGuideTip {
  icon: string;
  text: string;
}

export interface PageGuide {
  id: string;
  title: string;
  intro: string;
  tips: PageGuideTip[];
}

const GUIDES: Record<string, PageGuide> = {
  lucy: {
    id: 'lucy',
    title: '루시 사용법',
    intro: '루시는 고민도, 일상 이야기도 편하게 나누는 대화 친구예요.',
    tips: [
      { icon: '💬', text: '아래 입력창에 편하게 말을 걸어요. 마이크를 누르면 말로도 할 수 있어요.' },
      { icon: '✨', text: '입력창 위에 흐르는 추천 질문을 누르면 바로 물어볼 수 있어요.' },
      { icon: '🔊', text: '루시 답 아래 스피커를 누르면 소리 내어 읽어 줘요.' },
      { icon: '🌀', text: '빅뱅 버튼: 한 번 탭은 루시, 두 번 탭은 Key, 꾹 누르면 점술모드, 끌었다 놓으면 추천 채널로 가요.' },
      { icon: '🔮', text: '깊은 고민이 보이면 루시가 점술모드로 갈지 물어봐요. 원할 때만 들어가면 돼요.' },
    ],
  },
  master: {
    id: 'master',
    title: '점술모드 사용법',
    intro: '사주를 바탕으로 타로집에 온 것처럼 천천히 상담해요.',
    tips: [
      { icon: '🌀', text: '빅뱅 버튼을 꾹 누를 때마다 상담이 깊어져요. 1 기본 → 2 심화 → 3 심층.' },
      { icon: '👆', text: '빅뱅 버튼을 한 번 탭하면 일반 루시로 돌아가요.' },
      { icon: '🃏', text: '타로는 직접 섞고 마음 가는 카드를 골라요. 폰을 펼치면 왼쪽이 타로 테이블이 돼요.' },
      { icon: '📚', text: '엔진함에서 도구 뜻을, 추천질문 라이브러리에서 질문 예시를 볼 수 있어요.' },
      { icon: '📜', text: '상담을 마치고 나오면 핵심 3줄과 루시의 한마디를 카드로 남길 수 있어요.' },
    ],
  },
  key: {
    id: 'key',
    title: 'Key 사용법',
    intro: '불안과 예민함을 다스리는 90가지 실천 도구가 모인 곳이에요.',
    tips: [
      { icon: '🎲', text: '"오늘의 추천 실천 도구"를 누르면 지금 해 볼 연습 하나를 골라 줘요.' },
      { icon: '🎯', text: '90가지 마음 연습에서 장별로 골라 "실천하기"를 눌러요.' },
      { icon: '🚨', text: '마음이 급할 땐 오감 도구함의 "1분 SOS 즉시 진정"을 눌러요.' },
      { icon: '🎈', text: '풍선호흡으로 천천히 숨을 고르고, 실천 노트에 기록을 남겨요.' },
      { icon: '🔍', text: '오른쪽 위 돋보기로 불안·잠·관계처럼 찾고 싶은 연습을 검색해요.' },
    ],
  },
  prologue: {
    id: 'prologue',
    title: 'PROLOGUE 사용법',
    intro: '오늘의 흐름을 보고 하루를 시작하는 첫 화면이에요.',
    tips: [
      { icon: '🌌', text: 'UNIVERSE에서 오늘 나의 흐름과 운의 지도를 한눈에 봐요.' },
      { icon: '💗', text: '하트 탭에서는 마음이 힘들 때 바로 쓰는 마음 응급처치를 해요.' },
      { icon: '📝', text: '목록 탭에서 오늘 할 일과 미션을 정리해요.' },
      { icon: '🍀', text: '왼쪽 메뉴의 클로버를 누르면 7개 럭키 채널로 옮겨 다닐 수 있어요.' },
    ],
  },
  orange: {
    id: 'orange',
    title: 'ORANGE 사용법',
    intro: '마음을 돌보고 소원을 담는 마음챙김 채널이에요.',
    tips: [
      { icon: '🔑', text: 'SECRET에서 오늘의 마음챙김 비밀과 소원부적을 만나요.' },
      { icon: '⭐', text: '별 탭에서 마음에 든 내용을 다시 볼 수 있어요.' },
      { icon: '✨', text: '반짝이 탭은 다른 채널과 연결된 오늘의 종합 메시지예요.' },
      { icon: '💬', text: '궁금한 점은 "루시에게 질문"으로 이어서 물어봐요.' },
    ],
  },
  trinity: {
    id: 'trinity',
    title: 'TRINITY 사용법',
    intro: '사주와 타로로 오늘과 고민을 비춰 보는 오라클 채널이에요.',
    tips: [
      { icon: '☯', text: 'SAJU에서 내 사주와 오늘의 흐름을 봐요. 프로필에 생년월일을 넣어 두면 정확해져요.' },
      { icon: '🃏', text: '카드 탭에서 오늘의 타로를 하루 한 번 뽑아요.' },
      { icon: '✨', text: '반짝이 탭은 사주와 타로를 함께 엮은 종합 해석이에요.' },
      { icon: '📤', text: '결과는 이미지로 저장하거나 공유할 수 있어요.' },
    ],
  },
  heal: {
    id: 'heal',
    title: 'AURA 사용법',
    intro: '몸과 마음의 긴장을 내려놓는 치유·명상 채널이에요.',
    tips: [
      { icon: '🍃', text: 'LETTING GO METHOD에서 붙잡고 있던 감정을 천천히 내려놓아요.' },
      { icon: '⏱️', text: '1-MIN은 1분 만에 하는 짧은 회복 연습이에요.' },
      { icon: '✨', text: 'SANCTUARY에서 오늘의 치유 처방을 받아요.' },
      { icon: '🎧', text: '이어폰을 끼고 조용한 곳에서 하면 더 편안해요.' },
    ],
  },
  bluebird: {
    id: 'bluebird',
    title: 'BLUEBIRD 사용법',
    intro: '호오포노포노로 마음을 정화하는 파랑새 채널이에요.',
    tips: [
      { icon: '🕊️', text: "HO'OPONOPONO에서 고민을 적고 \"미안해요, 용서해 주세요, 고마워요, 사랑해요\"로 정화해요." },
      { icon: '✉️', text: '편지 탭에서 나에게, 누군가에게 마음의 편지를 써요.' },
      { icon: '✨', text: '반짝이 탭에서 정화 결과와 치유 처방을 봐요.' },
    ],
  },
  muse: {
    id: 'muse',
    title: 'MUSE 사용법',
    intro: '예술과 영감으로 마음을 채우는 창작 채널이에요.',
    tips: [
      { icon: '🎨', text: 'DAILY ART에서 오늘의 작품과 짧은 해설을 감상해요.' },
      { icon: '🧑‍🎨', text: '사람 탭에서 나와 결이 맞는 예술가 메이트를 만나요.' },
      { icon: '✨', text: '반짝이 탭에서 영감을 창작으로 이어 가는 클래스를 봐요.' },
      { icon: '🔊', text: '도슨트 듣기 버튼으로 작품 설명을 들을 수 있어요.' },
    ],
  },
  epilogue: {
    id: 'epilogue',
    title: 'EPILOGUE 사용법',
    intro: '하루를 기록하고 나를 정리하는 마무리 채널이에요.',
    tips: [
      { icon: '📔', text: 'Diary에 오늘 하루와 마음을 짧게 적어요.' },
      { icon: '✨', text: 'CHRONICLE에서 그동안 쌓인 기록과 성장 흐름을 봐요.' },
      { icon: '👤', text: 'Profile에 생년월일과 취향을 넣으면 루시와 사주 풀이가 더 정확해져요.' },
    ],
  },
  library: {
    id: 'library',
    title: '도서관 사용법',
    intro: '앱의 글과 지혜를 모아 둔 서재예요.',
    tips: [
      { icon: '📚', text: '읽고 싶은 책이나 주제를 골라 천천히 읽어요.' },
      { icon: '⬅️', text: '왼쪽 위 "BACK TO UNIVERSE"로 첫 화면에 돌아가요.' },
    ],
  },
  default: {
    id: 'default',
    title: '사용 팁',
    intro: '어디서든 루시와 빅뱅 버튼으로 쉽게 이동할 수 있어요.',
    tips: [
      { icon: '💬', text: '왼쪽 메뉴 말풍선은 루시, 열쇠는 Key, 클로버는 럭키 채널이에요.' },
      { icon: '🌀', text: '빅뱅 버튼을 한 번 탭하면 루시, 두 번 탭하면 Key로 가요.' },
      { icon: '❓', text: '궁금한 건 언제든 루시에게 물어보세요.' },
    ],
  },
};


const g = (id: string, title: string, intro: string, tips: [string, string][]): PageGuide =>
  ({ id, title, intro, tips: tips.map(([icon, text]) => ({ icon, text })) });

/** 📘 dApp(채널 안 화면)별 가이드. 키는 원스톱 페이지 키(normalizeOneStopPage 결과). */
const DAPP_GUIDES: Record<string, PageGuide> = {
  '/prologue': g('prologue-universe', '유니버스 허브', '오늘의 흐름을 한눈에 보고 하루를 시작하는 곳이에요.', [
    ['🌌', '오늘 나의 운의 흐름과 추천 채널을 먼저 확인해요.'],
    ['🍀', '마음에 드는 카드를 누르면 그 채널로 바로 가요.'],
    ['👉', '빅뱅 버튼을 옆으로 밀면 마음처방·투두로 넘어가요.'],
  ]),
  '/ecpr': g('prologue-ecpr', 'ECPR 마음처방', '마음이 힘들 때 바로 쓰는 마음 응급처치예요.', [
    ['💗', '지금 마음 상태를 고르면 맞는 처방을 알려 줘요.'],
    ['🫁', '안내에 따라 천천히 숨 쉬고, 몸의 긴장을 먼저 풀어요.'],
    ['💬', '더 이야기하고 싶으면 루시에게 이어서 털어놔요.'],
  ]),
  '/todo': g('prologue-todo', '투두 & 데일리 미션', '오늘 할 일과 작은 미션을 정리하는 곳이에요.', [
    ['📝', '할 일을 적고, 끝내면 체크해요.'],
    ['🎯', '오늘의 데일리 미션을 하나씩 해 보세요.'],
    ['🌙', '못 끝낸 일은 내일로 넘겨도 괜찮아요.'],
  ]),
  '/orange': g('orange-secret', '비밀성찰 & 시크릿 바이블', '오늘 나에게 필요한 마음의 비밀을 만나는 곳이에요.', [
    ['🔑', '오늘의 시크릿 메시지를 천천히 읽어요.'],
    ['✍️', '떠오르는 생각을 짧게 적어 성찰해요.'],
    ['🔊', '듣기 버튼이 있으면 소리로도 들을 수 있어요.'],
  ]),
  '/orange?tab=wishingWell': g('orange-wishingWell', '소원우물 & 확언 스크립팅', '소원을 담고, 이루어진 것처럼 확언을 써 보는 곳이에요.', [
    ['🪙', '소원을 한 문장으로 적어 우물에 담아요.'],
    ['✍️', '"이미 이루어졌다"는 말투로 확언을 써 봐요.'],
    ['🔁', '매일 같은 확언을 소리 내어 읽으면 더 좋아요.'],
  ]),
  '/orange?tab=synergy': g('orange-synergy', '마음치유 시너지', '오렌지 기록을 모아 오늘의 마음 치유 메시지를 주는 곳이에요.', [
    ['✨', '오늘의 종합 메시지를 확인해요.'],
    ['🧭', '추천해 주는 작은 실천 하나를 해 봐요.'],
    ['💬', '궁금한 점은 루시에게 질문으로 이어가요.'],
  ]),
  '/trinity': g('trinity-destiny', '사주 운명 리포트', '내 사주로 타고난 성향과 지금의 흐름을 보는 곳이에요.', [
    ['🎂', '프로필에 생년월일과 태어난 시간을 넣으면 더 정확해요.'],
    ['☯', '오행 균형과 올해·오늘의 흐름을 차례로 봐요.'],
    ['💬', '궁금한 부분은 루시에게 질문해서 더 깊게 물어봐요.'],
  ]),
  '/trinity?tab=tarot': g('trinity-tarot', '오라클 타로 스프레드', '고민을 적고 타로 카드로 비춰 보는 곳이에요.', [
    ['✍️', '고민이나 질문을 먼저 짧게 적어요.'],
    ['🃏', '카드를 섞고 마음 가는 카드를 골라요.'],
    ['📤', '결과는 이미지로 저장하거나 공유할 수 있어요.'],
  ]),
  '/trinity?tab=oracle': g('trinity-oracle', '오라클 나침반 & 시너지', '사주와 타로를 함께 엮어 방향을 알려 주는 곳이에요.', [
    ['🧭', '오늘의 오라클 나침반으로 방향을 확인해요.'],
    ['🃏', '힐링 카드를 먼저 뽑으면 비전이 열려요.'],
    ['✨', '사주·타로를 합친 종합 해석을 읽어 봐요.'],
  ]),
  '/heal': g('heal-meditation', '세도나 힐링 명상', '붙잡고 있던 감정을 내려놓는 명상이에요.', [
    ['🍃', '안내 질문에 따라 감정을 느끼고, 놓아줄 수 있는지 스스로 물어요.'],
    ['🎧', '조용한 곳에서 이어폰을 끼면 더 편안해요.'],
    ['🔁', '마음이 가벼워질 때까지 몇 번 반복해도 좋아요.'],
  ]),
  '/heal?tab=oneMinute': g('heal-oneMinute', '1분 감정해방 호흡', '딱 1분, 숨으로 감정을 풀어 주는 곳이에요.', [
    ['⏱️', '시작을 누르고 안내에 맞춰 1분만 숨을 쉬어요.'],
    ['🫁', '들숨보다 날숨을 길게 하면 긴장이 빨리 풀려요.'],
    ['🎯', '끝나면 오늘의 작은 미션도 확인해 봐요.'],
  ]),
  '/heal?tab=synergy': g('heal-synergy', '생체리듬 시너지', '몸의 리듬에 맞춘 오늘의 웰니스 처방이에요.', [
    ['📈', '오늘의 몸과 마음 리듬을 확인해요.'],
    ['🌿', '추천해 주는 휴식·움직임을 하나 골라 해 봐요.'],
    ['💬', '컨디션이 안 좋으면 루시에게 이야기해요.'],
  ]),
  '/bluebird': g('bluebird-daily', '데일리 호오포노포노', '네 마디 말로 마음을 정화하는 곳이에요.', [
    ['✍️', '마음에 걸리는 일을 짧게 적어요.'],
    ['🕊️', '"미안해요, 용서해 주세요, 고마워요, 사랑해요"를 천천히 말해요.'],
    ['✨', '정화 결과와 치유 처방을 확인해요.'],
  ]),
  '/bluebird?tab=secretMessage': g('bluebird-secretMessage', '파랑새 비밀 메시지', '파랑새가 전해 주는 오늘의 비밀 메시지예요.', [
    ['✉️', '오늘 도착한 메시지를 열어 읽어요.'],
    ['💌', '마음이 닿은 문장은 간직하거나 공유해요.'],
    ['🌙', '하루에 한 번, 같은 시간에 열어 보면 좋아요.'],
  ]),
  '/bluebird?tab=synergy': g('bluebird-synergy', '예술정서 시너지', '정화한 마음을 예술 감성으로 이어 주는 곳이에요.', [
    ['🎨', '오늘의 마음에 맞는 예술 처방을 봐요.'],
    ['🎵', '추천 음악이나 그림으로 마음을 쉬게 해요.'],
    ['💬', '느낀 점을 루시에게 이야기해도 좋아요.'],
  ]),
  '/muse': g('muse-art', '예술처방 (명화·명시·명곡)', '오늘의 마음에 맞는 그림·시·음악을 처방해 줘요.', [
    ['🖼️', '오늘의 작품을 감상하고 짧은 해설을 읽어요.'],
    ['🔊', '도슨트 듣기로 작품 설명을 들을 수 있어요.'],
    ['💾', '마음에 든 작품은 저장해 두고 다시 봐요.'],
  ]),
  '/muse?tab=roleModel': g('muse-roleModel', '시대의 롤모델', '나와 결이 맞는 인물을 만나 영감을 얻는 곳이에요.', [
    ['🧑‍🎨', '나에게 맞는 롤모델과 그 이야기를 봐요.'],
    ['💡', '그 사람이라면 지금 어떻게 할지 떠올려 봐요.'],
    ['💬', '롤모델에 대해 루시에게 더 물어볼 수 있어요.'],
  ]),
  '/muse?tab=synergy': g('muse-synergy', '영감창조 시너지', '받은 영감을 나만의 창작으로 이어 가는 곳이에요.', [
    ['✨', '오늘의 영감 키워드를 확인해요.'],
    ['✍️', '짧은 글·그림·메모로 바로 남겨 봐요.'],
    ['🔁', '작게라도 매일 이어 가는 게 중요해요.'],
  ]),
  '/epilogue': g('epilogue-diary', '밤 서재 하루 회고', '하루를 짧게 돌아보며 마무리하는 곳이에요.', [
    ['📔', '오늘 있었던 일과 마음을 세 줄로 적어요.'],
    ['🙏', '고마웠던 일 하나를 꼭 적어 봐요.'],
    ['🌙', '자기 전에 쓰면 마음이 정리돼요.'],
  ]),
  '/chronicle': g('epilogue-chronicle', '소울 크로니클 연대기', '그동안 쌓인 기록으로 나의 흐름을 보는 곳이에요.', [
    ['📜', '날짜별로 쌓인 기록과 변화를 훑어봐요.'],
    ['📈', '자주 나온 감정과 고민의 흐름을 확인해요.'],
    ['💬', '돌아보다 떠오른 건 루시와 이야기해요.'],
  ]),
  '/profile': g('epilogue-profile', '영혼 프로필 & 여정', '나의 정보와 취향을 정리하는 곳이에요.', [
    ['🎂', '생년월일과 태어난 시간을 넣으면 사주 풀이가 정확해져요.'],
    ['🎵', '관심사·음악·예술 취향을 고르면 추천이 나에게 맞춰져요.'],
    ['🔒', '정보는 내 상담에만 쓰여요. 언제든 고칠 수 있어요.'],
  ]),
};

/** Key 안의 탭별 가이드. */
const KEY_TAB_GUIDES: Record<string, PageGuide> = {
  'tab-exercises': g('key-exercises', '90가지 마음 연습', '불안과 예민함을 다루는 90가지 실천 도구예요.', [
    ['📖', '위쪽 장(章) 버튼으로 주제를 골라요.'],
    ['🎯', '카드의 "실천하기"를 누르면 단계별로 따라 할 수 있어요.'],
    ['💬', '"루시에게 질문"으로 연습 방법을 더 물어봐요.'],
  ]),
  'tab-toolbox': g('key-toolbox', 'SOS 오감 진정 도구함', '마음이 급할 때 오감으로 1분 만에 진정하는 곳이에요.', [
    ['🚨', '"1분 SOS 즉시 진정"을 누르고 안내를 따라가요.'],
    ['👀', '보기·듣기·만지기 등 감각 하나에 집중해요.'],
    ['🧰', '나에게 맞는 진정 도구를 골라 두면 다음에 빨라요.'],
  ]),
  'tab-energy-rest': g('key-energy-rest', '에너지 무목적 쉼 라운지', '목적 없이 쉬며 에너지를 채우는 곳이에요.', [
    ['🔋', '지금 에너지 상태를 확인해요.'],
    ['☕', '추천하는 짧은 쉼을 하나 골라 그냥 쉬어요.'],
    ['🙆', '잘 쉬는 것도 실천이에요. 죄책감은 내려놔요.'],
  ]),
  'tab-breathing': g('key-breathing', '신경계 진정 풍선호흡', '풍선처럼 부풀었다 줄어드는 숨으로 진정하는 곳이에요.', [
    ['🎯', '목표 횟수를 고르고 시작을 눌러요.'],
    ['🎈', '풍선이 커질 때 들이쉬고, 작아질 때 내쉬어요.'],
    ['🔔', '싱잉볼 소리가 바뀌는 순간을 알려 줘요.'],
  ]),
  'tab-workbook': g('key-workbook', '나만의 실천 & 성찰 노트', '실천한 연습과 성찰을 모아 보는 곳이에요.', [
    ['📓', '연습을 마치면 "운기 노트 저장"으로 기록해요.'],
    ['🔍', '검색창으로 지난 기록과 확언을 찾아요.'],
    ['🔁', '도움이 된 연습은 다시 열어 반복해요.'],
  ]),
  'tab-teachings': g('key-teachings', '개운 & 치유 비결', '마음을 여는 3단계 가르침이에요.', [
    ['✨', '오늘의 가르침을 읽고 1단계 몸 접지부터 해 봐요.'],
    ['🔊', '"연속 듣기"로 3단계를 소리로 들을 수 있어요.'],
    ['🔄', '다른 가르침을 보고 싶으면 새로 뽑아요.'],
  ]),
};

/** dApp(채널 안 화면) 가이드. 없으면 채널 가이드. */
export function resolveDappGuide(pageKey: string): PageGuide {
  const clean = (pageKey || '/').toLowerCase().startsWith('/') ? pageKey : `/${pageKey}`;
  return DAPP_GUIDES[clean] ?? resolvePageGuide(clean.split('?')[0]);
}

/** Key 안의 현재 탭 가이드. 없으면 Key 전체 가이드. */
export function resolveKeyTabGuide(tab?: string | null): PageGuide {
  return (tab && KEY_TAB_GUIDES[tab]) || GUIDES.key;
}

const PROLOGUE_ALIASES = ['/prologue', '/universe', '/ecpr', '/todo', '/mission', '/synergy', '/aegis'];

export function resolvePageGuide(path: string, options: { master?: boolean } = {}): PageGuide {
  const clean = (path.split(/[?#]/)[0] || '/').toLowerCase();
  if (['/', '/chat', '/lucy', '/chat/pro'].includes(clean)) return options.master ? GUIDES.master : GUIDES.lucy;
  if (['/key', '/calm', '/orb', '/gateway', '/crystal', '/pharmacy'].some(p => clean === p || clean.startsWith(`${p}/`))) return GUIDES.key;
  if (PROLOGUE_ALIASES.some(p => clean === p || clean.startsWith(`${p}/`))) return GUIDES.prologue;
  for (const id of ['orange', 'trinity', 'heal', 'bluebird', 'muse', 'library'] as const) {
    if (clean === `/${id}` || clean.startsWith(`/${id}/`)) return GUIDES[id];
  }
  if (['/epilogue', '/profile', '/chronicle'].includes(clean)) return GUIDES.epilogue;
  return GUIDES.default;
}

export function getPageGuide(id: string): PageGuide {
  return GUIDES[id] ?? GUIDES.default;
}

/** Text read aloud by the guide's listen button. */
export function pageGuideSpeech(guide: PageGuide): string {
  return [guide.title, guide.intro, ...guide.tips.map((tip, index) => `${index + 1}. ${tip.text}`)].join('\n');
}

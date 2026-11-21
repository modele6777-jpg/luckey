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

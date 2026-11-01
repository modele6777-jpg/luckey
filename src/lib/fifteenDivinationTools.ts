import { buildAdditionalBirthDigest } from './divination/birthDigest';
import { buildDivinationCapabilityPrompt } from './divinationCapabilities';
import { resolveEffectiveSolarDate } from './lunarCalendar';
import { parseBirthTime } from './birthDateTime';
import { getAstronomicalSajuYear, getYearSolarTerms } from './astronomicalSolarTerms';
import { UserProfile } from './sharedState';
import { calculateDetailedSaju } from './sajuAnalysis';
import { buildUserNatalSummary } from './astrologyAnalysis';
import { runDeterministicEngine, formatDeterministicEnginePrompt } from './divination/deterministicEngine';
import { routeAndExecute } from './divination/smartAgentRouter';

export type DivinationToolId =
  | 'saju'           // 1. 사주 (四柱命理)
  | 'astrology'      // 2. 점성술 (Western Astrology)
  | 'ziwei'          // 3. 자미두수 (紫微斗數)
  | 'tarot'          // 4. 타로 (Tarot)
  | 'sukuyo'         // 5. 숙요 (宿曜經 / 27숙)
  | 'mahabote'       // 6. 마하보테 (Mahabote 미얀마 8요일 점성술)
  | 'vedic'          // 7. 베딕 (Vedic Jyotish 인도점성술)
  | 'liuren'         // 8. 육임 (大六壬)
  | 'qimen'          // 9. 홍국기문 (洪局奇門 / 기문둔갑)
  | 'kabbalah'       // 10. 카발라 (Kabbalah 세피로트 생명나무)
  | 'iching'         // 11. 주역 (周易 64괘)
  | 'thai_astrology' // 12. 태국점성술 (Thai Horasat)
  | 'tojeong'        // 13. 토정비결 (土亭秘訣)
  | 'kyusei'         // 14. 구성학 (九星氣學)
  | 'taiyi';         // 15. 태을신수 (太乙神數)

export type SevenThemeChannel =
  | 'prologue'
  | 'orange'
  | 'trinity'
  | 'aura'
  | 'bluebird'
  | 'muse'
  | 'epilogue';

export interface DivinationToolSpec {
  id: DivinationToolId;
  koName: string;
  hanjaOrEng: string;
  primaryTheme: SevenThemeChannel;
  secondaryThemes: SevenThemeChannel[];
  coreEssence: string;
  bestFor: string;
  easyLanguageGuide: string;
  explicitRegex: RegExp;
  intentKeywords: RegExp[];
}

/**
 * 동서양 15대 운명학·신비학 도구 마스터 사전
 * 7대 테마(프롤로그·오렌지·트리니티·아우라·블루버드·뮤즈·에필로그)에 각각 2~3개씩 주력 배정 및 교차 융합 지원
 */
export const FIFTEEN_DIVINATION_TOOLS: Record<DivinationToolId, DivinationToolSpec> = {
  // 1. 사주 (트리니티 주력)
  saju: {
    id: 'saju',
    koName: '사주명리',
    hanjaOrEng: '四柱命理',
    primaryTheme: 'trinity',
    secondaryThemes: ['prologue', 'orange', 'aura'],
    coreEssence: '연·월·일·시 사주팔자(천간·지지)와 음양오행(목·화·토·금·수), 십신(비겁·식상·재성·관성·인성), 용신·대운·세운의 생극제화로 타고난 기질과 시기별 성패를 읽는 정통 명학',
    bestFor: '타고난 성향·재능, 대운과 연운의 흐름, 직업·재물·연애의 근본 그릇, 부족한 오행 개운법',
    easyLanguageGuide: '한자 용어를 그대로 나열하지 말고 "네가 타고난 일간의 기질이 ~해서", "지금 들어온 불/물 기운이 ~를 도와주고 있어서"처럼 계절과 자연의 비유로 친근하게 풀어줘.',
    explicitRegex: /사주|팔자|명리|만세력|일주|일간|용신|대운|세운|십신|오행|천을귀인|도화살|역마살/,
    intentKeywords: [/타고난|성격|적성|재물운|직업운|결혼운|올해\s*운|운세|사주/]
  },

  // 2. 점성술 (트리니티 주력)
  astrology: {
    id: 'astrology',
    koName: '서양 점성술',
    hanjaOrEng: 'Western Astrology',
    primaryTheme: 'trinity',
    secondaryThemes: ['bluebird', 'muse'],
    coreEssence: '태양(자아)·달(내면 감정)·상승궁(페르소나)과 10행성, 12하우스, 행성 간 각도(Aspect) 및 트랜짓을 통해 무의식적 욕망과 관계의 심리 역학을 해독하는 별의 지도',
    bestFor: '내면 심리와 감정 패턴, 자존감, 연인·지인과의 시나스트리(궁합), 현재 행성 트랜짓에 따른 심리적 변화',
    easyLanguageGuide: '트라인·스퀘어 같은 각도 용어 대신 "태양과 달의 기운이 서로 밀어주면서 ~한 매력이 나타나", "금성의 에너지가 감수성을 자극해서"처럼 감정과 심리 중심으로 쉽게 설명해줘.',
    explicitRegex: /점성술|점성학|별자리|네이탈|출생\s*차트|태양궁|달\s*별자리|상승궁|어센던트|트랜짓|하우스|금성|화성|수성\s*역행/,
    intentKeywords: [/별자리|매력|자아|심리\s*패턴|연애\s*스타일|궁합|감정\s*기복/]
  },

  // 3. 자미두수 (트리니티 주력)
  ziwei: {
    id: 'ziwei',
    koName: '자미두수',
    hanjaOrEng: '紫微斗數',
    primaryTheme: 'trinity',
    secondaryThemes: ['orange', 'prologue'],
    coreEssence: '자미성·천기성·태양성·무곡성 등 14주성과 보성, 사화(화록·화권·화과·화기)를 명궁·부처궁·재백궁·관록궁·천이궁 등 12궁 명반에 배치해 인생의 구체적 사건과 환경을 정밀하게 비추는 황실 별자리 명학',
    bestFor: '배우자·연인의 구체적 성향(부처궁), 재물 축적 방식(재백궁), 직장·사회적 명예(관록궁), 인간관계·외부 환경(천이궁/노복궁), 세밀한 사건 흐름',
    easyLanguageGuide: '12궁과 주성의 상징을 "자미두수 명반의 부처궁(연애·배우자 방) 흐름을 보면~", "재백궁에 실속을 챙기는 별이 빛나고 있어서~"처럼 인생의 12개 방 이야기로 생생하게 들려줘.',
    explicitRegex: /자미두수|자미성|명궁|부처궁|재백궁|관록궁|천이궁|복덕궁|명반|사화|화록|화권|화기|14주성/,
    intentKeywords: [/배우자|결혼\s*상대|직장\s*생활|사회적\s*성공|부모|형제|집안|구체적\s*사건/]
  },

  // 4. 타로 (트리니티 & 뮤즈 주력)
  tarot: {
    id: 'tarot',
    koName: '타로',
    hanjaOrEng: 'Tarot Archetypes',
    primaryTheme: 'trinity',
    secondaryThemes: ['muse', 'bluebird'],
    coreEssence: '메이저 아르카나 22장의 영혼 성장 여정과 마이너 아르카나 56장(완드·컵·소드·펜타클)의 원형 상징을 통해 현재 순간의 무의식, 상대의 속마음, 단기적 흐름을 직관적으로 비추는 거울',
    bestFor: '상대방의 현재 속마음, 썸·재회·갈등의 단기 흐름, 무의식이 보내는 시그널, 당장 필요한 태도',
    easyLanguageGuide: '카드 이미지가 품은 이야기와 상징을 들어 "지금 네 마음은 마치 타로의 [별/은둔자/완드 에이스] 카드처럼 ~한 상태야"라고 직관적이고 공감 가게 비유해줘.',
    explicitRegex: /타로|아르카나|스프레드|타로\s*카드|메이저\s*카드|완드|펜타클|소드|속마음/,
    intentKeywords: [/속마음|연락|재회|썸|그\s*사람|직관|지금\s*당장|오늘의\s*운세/]
  },

  // 5. 숙요 (블루버드 주력)
  sukuyo: {
    id: 'sukuyo',
    koName: '숙요점성술',
    hanjaOrEng: '宿曜經 (27숙)',
    primaryTheme: 'bluebird',
    secondaryThemes: ['trinity', 'orange'],
    coreEssence: '달이 지나는 황도 27숙(각숙·항숙·저숙·방숙·심숙·미숙·기숙 등)을 기반으로 사람의 내면 정서와 두 사람 사이의 인연 역학(안괴·영친·우태·성유·업태·명 등 6대 관계)을 꿰뚫어 보는 밀교 달의 지혜',
    bestFor: '두 사람의 숙명적 인연과 궁합(왜 끌리는지, 왜 부딪히는지), 감정적 파동, 관계에서의 거리 조절과 치유',
    easyLanguageGuide: '"숙요(달의 27숙)로 두 사람의 인연 결을 살펴보면 서로 성장시키는 영친(榮親)/강렬하게 끌리는 안괴(安壞) 흐름이 있어서~"처럼 관계의 심리와 감정 파동을 다정하게 풀어줘.',
    explicitRegex: /숙요|27숙|28숙|숙요경|안괴|영친|우태|성유|업태|본명숙/,
    intentKeywords: [/인연|궁합|관계|갈등|친해지|왜\s*힘들까|감정\s*소모|거리두기|동료|친구\s*사이/]
  },

  // 6. 마하보테 (아우라 주력)
  mahabote: {
    id: 'mahabote',
    koName: '마하보테',
    hanjaOrEng: 'Mahabote (미얀마 8요일 점성술)',
    primaryTheme: 'aura',
    secondaryThemes: ['prologue', 'trinity'],
    coreEssence: '미얀마 전통의 출생 요일(일~토 및 수요일 오후 라후 포함 8방위 동물 상징)과 7궁(Binga·Atun·Yaza·Adipati·Marana·Thike·Puti) 배치를 통해 생체 에너지 균형과 행운의 방향·생활 리듬을 조율하는 실천 비법',
    bestFor: '타고난 출생 요일별 생명력, 신체·정신적 에너지 밸런스, 일상의 활력을 깨우는 개운 루틴',
    easyLanguageGuide: '"마하보테에서 네가 태어난 요일의 수호 기운을 보면 ~한 생명력을 가지고 있어서, 몸이 지칠 땐 ~처럼 에너지를 순환시키는 게 딱 맞아"라고 실생활 웰니스 팁으로 연결해줘.',
    explicitRegex: /마하보테|mahabote|8요일|요일\s*점성술|미얀마\s*점성술|빙가|야자|아디파티/i,
    intentKeywords: [/활력|에너지|체력|리듬|요일|컨디션|지칠\s*때|생기/]
  },

  // 7. 베딕 (블루버드 & 에필로그 주력)
  vedic: {
    id: 'vedic',
    koName: '베딕 점성술',
    hanjaOrEng: 'Vedic Jyotish (인도 점성술)',
    primaryTheme: 'bluebird',
    secondaryThemes: ['epilogue', 'trinity'],
    coreEssence: '실제 항성 황도대(Sidereal) 기준의 달 궁(Rashi)과 27 나크샤트라(Nakshatra), 빔쇼타리 다샤(Dasha 행성 대운 주기), 카르마(Karma)와 다르마(Dharma)를 통해 영혼의 숙제와 내면의 평화를 밝히는 빛의 학문(Jyotish)',
    bestFor: '반복되는 삶의 패턴(카르마) 이해와 치유, 영혼의 사명(다르마), 인생 주기(다샤)의 깊은 의미, 마음의 안식',
    easyLanguageGuide: '"베딕 점성술(조티쉬)의 관점에서 보면 지금 겪는 시련은 네 영혼이 더 단단해지려는 다샤(성장 주기)의 과정이야"처럼 깊은 위로와 영적 통찰로 마음을 보듬어줘.',
    explicitRegex: /베딕|인도\s*점성술|조티쉬|jyotish|나크샤트라|다샤|라후|케투|카르마|다르마|아트마카라카/i,
    intentKeywords: [/반복되는|아픔|상처|업보|이유가\s*뭘까|영혼|사명|내면의\s*평화|위로/]
  },

  // 8. 육임 (오렌지 주력)
  liuren: {
    id: 'liuren',
    koName: '육임',
    hanjaOrEng: '大六壬',
    primaryTheme: 'orange',
    secondaryThemes: ['trinity'],
    coreEssence: '동양 삼식(태을·기문·육임) 중 인사(人事) 예측의 정점으로, 천지반과 사과(四課)·삼전(三傳: 초전·중전·말전) 및 12천장을 통해 사건의 발단(초전)-전개(중전)-결말(말전)과 숨겨진 변수를 예리하게 꿰뚫는 예측학',
    bestFor: '현재 진행 중인 일·계약·협상·관계의 구체적 진행 과정(초전→중전→말전)과 성패, 숨은 의도나 리스크 파악',
    easyLanguageGuide: '"육임의 삼전(시작-중간-결과) 흐름으로 이 일을 짚어보면, 초반(초전)에는 ~한 변수가 있지만 중반(중전)에 ~하게 대응하면 끝(말전)에는 좋은 결실을 맺을 수 있어"처럼 단계별 전략으로 명쾌하게 설명해줘.',
    explicitRegex: /육임|대육임|사과삼전|삼전|초전|중전|말전|천장|귀인\s*포국/,
    intentKeywords: [/결과가\s*어떨까|성공할까|합격|계약|협상|변수|리스크|어떻게\s*흘러갈까|전망/]
  },

  // 9. 홍국기문 (오렌지 주력)
  qimen: {
    id: 'qimen',
    koName: '홍국기문',
    hanjaOrEng: '洪局奇門 (기문둔갑)',
    primaryTheme: 'orange',
    secondaryThemes: ['prologue', 'trinity'],
    coreEssence: '시공간의 구궁(九宮) 팔문(휴·생·상·두·경·사·경·개문)·구성·팔신과 홍국 수리(1~10 생성수)를 배합해 막힌 상황을 뚫는 최적의 타이밍, 유리한 방위, 승부수 전략을 설계하는 제왕의 병법 방위학',
    bestFor: '이직·창업·사업 확장·투자·면접 등 중대한 결단의 최적 타이밍, 돌파구(생문/개문) 전략, 유리한 방향 선택',
    easyLanguageGuide: '"홍국기문(기문둔갑)으로 지금 판세를 읽어보면, 정면 돌파보다는 생문(生門·살아나는 문)이 열리는 ~한 방식과 타이밍을 택하는 게 최고의 한 수야"처럼 전략적 돌파구를 제시해줘.',
    explicitRegex: /홍국기문|기문둔갑|기문|팔문|생문|개문|휴문|경문|삼기|육의|포국/,
    intentKeywords: [/돌파구|전략|이직|창업|사업|승부|면접|타이밍|언제\s*움직|방향성|결정/]
  },

  // 10. 카발라 (뮤즈 주력)
  kabbalah: {
    id: 'kabbalah',
    koName: '카발라',
    hanjaOrEng: 'Kabbalah (세피로트 생명나무)',
    primaryTheme: 'muse',
    secondaryThemes: ['prologue', 'epilogue'],
    coreEssence: '케테르(왕관)에서 말쿠트(왕국)로 이어지는 10개의 세피로트(Sephiroth)와 22개의 오솔길(Path)을 통해 무형의 영감과 창조적 아이디어가 현실 세계의 작품과 성취로 구현되는 원리를 밝히는 서양 신비주의 지혜',
    bestFor: '창작 영감 발현, 추상적 아이디어를 현실 결과물로 구체화하는 과정, 내면의 창조성 및 영적 균형 회복',
    easyLanguageGuide: '"카발라 생명나무에서 머리 위의 반짝이는 영감(케테르/호크마)을 현실의 열매(말쿠트)로 내려오게 하려면 ~한 감각과 구조를 연결해보는 게 좋아"처럼 창작과 영감의 통로로 풀어줘.',
    explicitRegex: /카발라|kabbalah|생명나무|세피로트|세피라|케테르|티파레트|말쿠트|호크마|비나/i,
    intentKeywords: [/영감|창작|아이디어|예술|작품|구체화|창의성|뮤즈|슬럼프|글쓰기/]
  },

  // 11. 주역 (에필로그 주력)
  iching: {
    id: 'iching',
    koName: '주역',
    hanjaOrEng: '周易 (64괘)',
    primaryTheme: 'epilogue',
    secondaryThemes: ['orange', 'prologue'],
    coreEssence: '태극과 음양, 팔괘(건·태·리·진·손·감·간·곤)가 중첩된 64괘와 384효의 변화 원리(궁즉변 변즉통 통즉구)를 통해 현재 처한 때(時)와 위치(位)를 성찰하고 나아갈 때와 물러설 때의 도리를 일깨우는 제왕의 철학',
    bestFor: '하루의 사건이 주는 깊은 의미 회고, 인생의 진퇴(나아감과 멈춤) 결단, 위기를 기회로 바꾸는 처세의 지혜',
    easyLanguageGuide: '"주역의 괘상으로 지금 상황을 비춰보면 [물속에 잠긴 용이 때를 기다리는 잠룡 / 거친 물을 건너는 이섭대천]처럼 ~한 시기야. 지금은 ~하는 마음가짐이 큰 복을 불러와"라고 따뜻하고 품격 있게 일러줘.',
    explicitRegex: /주역|역경|64괘|팔괘|괘상|효사|건위천|곤위지|수화기제|화수미제|음양의\s*변화/,
    intentKeywords: [/깨달음|교훈|회고|성찰|기다려야|나아가야|이치|순리|마무리|의미/]
  },

  // 12. 태국점성술 (아우라 주력)
  thai_astrology: {
    id: 'thai_astrology',
    koName: '태국점성술',
    hanjaOrEng: 'Thai Horasat (태국 호라삿)',
    primaryTheme: 'aura',
    secondaryThemes: ['bluebird', 'trinity'],
    coreEssence: '태국 전통 호라삿(Horasat)의 요일별 수호 행성·행운 컬러·신체 부위 에너지와 생활 밀착형 개운 리추얼(탄·메타·음식·방향·색상 조율)을 통해 일상의 생기와 행운 주파수를 즉시 높이는 동남아 황실 점성술',
    bestFor: '오늘의 행운 컬러·아이템·음식, 신체 부위별 컨디션 케어, 액운을 부드럽게 흘려보내는 일상 개운 리추얼',
    easyLanguageGuide: '"태국점성술(호라삿)에서 오늘 네 바이오리듬과 기운을 북돋워 줄 컬러와 작은 습관은 ~야"처럼 당장 오늘 실천할 수 있는 기분 좋은 웰니스·개운 처방으로 알려줘.',
    explicitRegex: /태국\s*점성술|타이\s*점성술|호라삿|horasat|태국\s*운세/i,
    intentKeywords: [/행운의\s*색|컬러|음식|컨디션\s*회복|개운법|기분\s*전환|일상\s*루틴|몸\s*관리/]
  },

  // 13. 토정비결 (프롤로그 주력)
  tojeong: {
    id: 'tojeong',
    koName: '토정비결',
    hanjaOrEng: '土亭秘訣',
    primaryTheme: 'prologue',
    secondaryThemes: ['trinity', 'epilogue'],
    coreEssence: '토정 이지함 선생의 상·중·하 3수(태세수·월건수·일진수) 작괘법과 144괘의 시적 비유를 통해 한 해와 매달의 생활 길흉화복, 귀인, 재물, 마음가짐을 친근한 자연의 비유로 미리 알려주는 한국 전통 생활 예언서',
    bestFor: '올해와 이달의 전반적인 생활 운세, 달별 주의할 점과 반가운 소식, 새로운 계획을 시작할 때의 생활 지침',
    easyLanguageGuide: '"토정비결의 시구처럼 지금은 \'봄바람에 꽃이 피어나는 격\' / \'가뭄 끝에 단비를 만나는 격\'이라서, 이달에는 ~를 챙기면 뜻밖의 기쁨이 찾아와"처럼 정겹고 희망찬 비유로 들려줘.',
    explicitRegex: /토정비결|이지함|신년\s*운세|이달의\s*운세|월별\s*운세|144괘/,
    intentKeywords: [/새해|신년|이번\s*달|이달|가정운|생활운|길흉|좋은\s*일|계획/]
  },

  // 14. 구성학 (오렌지 & 아우라 주력)
  kyusei: {
    id: 'kyusei',
    koName: '구성학',
    hanjaOrEng: '九星氣學',
    primaryTheme: 'orange',
    secondaryThemes: ['aura', 'prologue'],
    coreEssence: '낙서 구궁과 구자성(일백수성~구자화성)의 본명성·월명성·일명성 순환 및 길방위(생기·퇴기)·흉방위(오황살·암검살·본명살)를 통해 시간과 공간의 에너지를 내 편으로 만드는 동양 기학(氣學)이자 방위 전략학',
    bestFor: '이사·여행·이동·출장·자리 배치의 길방위, 구궁 주기별 사업·인간관계 타이밍, 공간을 통한 운기 전환',
    easyLanguageGuide: '"구성학의 구궁 에너지 흐름으로 보면 지금 네 별이 상승하는 궁에 들어와 있어서, ~한 방향이나 환경 변화를 주면 막혔던 운이 시원하게 트여"라고 공간·행동 개운법으로 설명해줘.',
    explicitRegex: /구성학|구성기학|구궁|본명성|월명성|일백수성|이흑토성|삼벽목성|사록목성|오황토성|육백금성|칠적금성|팔백토성|구자화성|길방위|오황살|암검살/,
    intentKeywords: [/이사|방위|방향|여행|출장|이동|자리|공간|풍수|환경\s*변화/]
  },

  // 15. 태을신수 (프롤로그 주력)
  taiyi: {
    id: 'taiyi',
    koName: '태을신수',
    hanjaOrEng: '太乙神數',
    primaryTheme: 'prologue',
    secondaryThemes: ['orange', 'epilogue'],
    coreEssence: '동양 삼식(태을·기문·육임)의 으뜸으로 천운(天運)과 거시적 시대 흐름, 태을16궁과 오복·군기·주객의 산수를 통해 개인의 삶이 시대의 큰 물결 속에서 어디로 향해야 하는지 거대한 비전과 대세를 조망하는 제왕학',
    bestFor: '인생의 큰 서막과 장기 비전(3년~10년 대세), 시대적 흐름과 맞물린 큰 도약의 방향성, 리더십과 결단',
    easyLanguageGuide: '"태을신수로 큰 하늘의 흐름(천시)을 읽어보면, 지금은 자잘한 것에 흔들리기보다 ~라는 큰 판을 그리고 먼저 주도권(주객의 이치)을 잡아야 할 서막의 시기야"처럼 시원하고 웅장한 비전을 제시해줘.',
    explicitRegex: /태을신수|태을수|태을점|삼식|천시|대세|태을\s*16궁/,
    intentKeywords: [/비전|장기\s*목표|시대\s*흐름|트렌드|큰\s*그림|서막|10년|도약|새로운\s*출발/]
  }
};

/**
 * 7대 테마별 주력 운명학 도구 매핑 (각 테마당 2~3개 핵심 도구 배정 + 교차 융합 지원)
 */
export const THEME_PRIMARY_DIVINATION_TOOLS: Record<
  SevenThemeChannel,
  {
    themeKoName: string;
    primaryTools: DivinationToolId[];
    fusionPhilosophy: string;
  }
> = {
  prologue: {
    themeKoName: '프롤로그 (서막·비전)',
    primaryTools: ['taiyi', 'tojeong'],
    fusionPhilosophy: '태을신수로 거시적인 시대의 대세와 큰 비전을 조망하고, 토정비결로 올해와 이달의 실질적인 생활 길흉과 첫걸음 지침을 다정하게 짚어준다.'
  },
  orange: {
    themeKoName: '오렌지 (전략·결단)',
    primaryTools: ['qimen', 'liuren', 'kyusei'],
    fusionPhilosophy: '홍국기문으로 막힌 판세를 뚫는 최적의 타이밍과 승부수를 찾고, 육임으로 일의 시작-과정-결과(삼전)와 변수를 예측하며, 구성학으로 유리한 공간·방향 에너지를 결합해 날카로운 1원칙 전략을 제시한다.'
  },
  trinity: {
    themeKoName: '트리니티 (핵심 운명·즉문즉설)',
    primaryTools: ['saju', 'astrology', 'ziwei', 'tarot'],
    fusionPhilosophy: '사주명리로 타고난 오행과 대운을 읽고, 서양 점성술로 내면의 심리 역학을 비추며, 자미두수로 12궁의 구체적 사건을 짚고, 타로로 지금 이 순간의 무의식과 속마음을 직관적으로 융합한다.'
  },
  aura: {
    themeKoName: '아우라 (신체 웰니스·생체 리듬)',
    primaryTools: ['mahabote', 'thai_astrology'],
    fusionPhilosophy: '마하보테로 출생 요일의 생명력과 에너지 균형을 진단하고, 태국점성술(호라삿)로 신체 부위별 컨디션 케어·행운 컬러·일상 바이오리듬 회복 루틴을 실전 처방한다.'
  },
  bluebird: {
    themeKoName: '블루버드 (마음 치유·인연·정화)',
    primaryTools: ['sukuyo', 'vedic'],
    fusionPhilosophy: '숙요(27숙)로 달의 감정 파동과 사람 사이의 깊은 인연 역학을 어루만지고, 베딕 점성술(조티쉬)로 반복되는 마음의 아픔(카르마)을 영혼의 성장과 평화로 치유한다.'
  },
  muse: {
    themeKoName: '뮤즈 (창작 영감·상징)',
    primaryTools: ['kabbalah', 'tarot'],
    fusionPhilosophy: '카발라 생명나무로 무형의 영감이 현실의 창작물로 구현되는 통로를 열고, 타로의 원형적 상징과 스토리텔링으로 막힌 창의성과 예술적 감각을 깨운다.'
  },
  epilogue: {
    themeKoName: '에필로그 (하루 마감·회고·성찰)',
    primaryTools: ['iching', 'vedic'],
    fusionPhilosophy: '주역 64괘의 음양 변화 이치로 오늘 하루 겪은 사건의 의미를 성찰하고, 베딕의 깊은 내면 지혜로 하루의 무거운 감정을 내려놓으며 내일의 평온한 지혜로 갈무리한다.'
  }
};

const KOR_WEEKDAYS = ['일요일(태양)', '월요일(달)', '화요일(화성)', '수요일(수성)', '목요일(목성)', '금요일(금성)', '토요일(토성)'];
const MAHABOTE_ANIMALS = ['가루다(일요일·명예와 비상)', '호랑이(월요일·섬세한 매력)', '사자(화요일·용기와 추진력)', '엄니 코끼리(수요일·소통과 지혜)', '쥐(목요일·통찰과 성찰)', '기니피그(금요일·예술과 공감)', '나가 용(토요일·인내와 깊은 내공)'];
const KYUSEI_STARS = [
  '일백수성(一白水星·지혜와 유연한 스며듦)',
  '이흑토성(二黑土星·포용과 대지의 성실함)',
  '삼벽목성(三碧木星·약동하는 새싹과 개척)',
  '사록목성(四綠木星·바람 같은 조화와 인연)',
  '오황토성(五黃土星·중심의 제왕적 돌파력)',
  '육백금성(六白金星·하늘의 품격과 결단력)',
  '칠적금성(七赤金星·기쁨과 언변·풍요)',
  '팔백토성(八白土星·산처럼 굳건한 전환과 축적)',
  '구자화성(九紫火星·태양 같은 통찰과 화려한 영감)',
];
/**
 * 사용자의 생년월일시 프로필로부터 15대 운명학 도구가 즉시 활용할 수 있는 핵심 개인화 시드 지표를 계산합니다.
 */
export function buildUserFifteenToolsDigest(profile?: UserProfile): string {
  if (!profile?.basic?.birthdate) return '[개인화 계산 미실시] 생년월일 미입력. 명반·본명성·요일·별자리를 임의 지정하지 말 것.';
  try {
    const { solarDate, solarDateString, isLunar } = resolveEffectiveSolarDate(profile.basic.birthdate.trim(), profile.basic.lunarSolar, profile.basic.isLeapMonth ?? false);
    const { year, month, day } = solarDate;
    const time = parseBirthTime(profile.basic.birthtime);
    const civil = new Date(0);
    civil.setUTCFullYear(year, month - 1, day);
    civil.setUTCHours(time?.hour ?? 12, time?.minute ?? 0, 0, 0);
    const dow = civil.getUTCDay();
    const saju = calculateDetailedSaju(profile);
    const sajuBrief = saju ? `${saju.dayMaster.hanja}(${saju.dayMaster.korean}) 일간, 우세 오행: ${saju.elements.dominant.name}, 간이 용신 추정: ${saju.yongsin.name}` : '입력 확인 필요: 사주 미계산';
    let animal = MAHABOTE_ANIMALS[dow];
    if (dow === 3) animal = !time ? '수요일 오전/오후 구분은 생시 필요' : time.hour < 12 ? '수요일 오전·수성·엄니 코끼리' : '수요일 오후·라후·엄니 없는 코끼리';
    const effectiveYear = getAstronomicalSajuYear(civil).sajuYear;
    let sum = [...String(effectiveYear)].reduce((total, digit) => total + Number(digit), 0);
    while (sum > 9) sum = [...String(sum)].reduce((total, digit) => total + Number(digit), 0);
    const star = ((11 - sum) % 9 + 9) % 9 || 9;
    const ipchun = getYearSolarTerms(year).find(term => term.name === '입춘')!.date;
    const boundaryUnknown = !time && ipchun.getUTCMonth() === month - 1 && ipchun.getUTCDate() === day;
    const colors = ['빨강', '노랑·크림', '분홍', '초록', '주황', '파랑', '보라'];
    return `[개인화 계산 입력] ${solarDateString} 양력${isLunar ? ' (음력·윤달 설정 환산)' : ''}${time ? ` ${profile.basic.birthtime}` : ' · 생시 미입력'}
- 사주명리: ${sajuBrief}. 자미두수·토정비결의 계산을 대신하지 않음.
- 서양 점성술: ${buildUserNatalSummary(profile)}
${buildAdditionalBirthDigest(profile)}
- 마하보테 8요일 부분 계산: ${KOR_WEEKDAYS[dow]} · ${animal}. 7궁 명반 미계산.
- 태국점성술 요일 상징: ${KOR_WEEKDAYS[dow]} · 전통 색상 ${colors[dow]}. 정밀 호라삿 차트 미계산.
- 구성학 본명성 (한국 표준시 절입 기준): ${boundaryUnknown ? '입춘 당일 생시 미입력으로 전년/당년 본명성 미확정' : KYUSEI_STARS[star - 1]}. 방위반·길방위는 미계산.
- 육임·일반 기문·주역: 프로필 계산실 또는 이번 채팅 엔진에서 실제 산출한 결과가 제공된 경우만 해석. 현재 대화에 결과가 없으면 임의 포국·작괘 금지. 토정비결·홍국기문 수리·태을 포국은 미구현.`;
  } catch {
    return '[개인화 계산 중단] 생년월일·생시·양음력·윤달 입력을 확인해야 합니다. 잘못된 날짜를 다른 날짜로 자동 보정하거나 개인 차트를 생성하지 말 것.';
  }
}

export interface SelectedDivinationToolsResult {
  selectedTools: DivinationToolSpec[];
  isCasualMessage: boolean;
  isMasterMobilization?: boolean;
  selectionReason: string;
  promptInjection: string;
}

/**
 * 마스터 모드 전용: 15대 운명학 도구 전원 총동원 & 7대 테마별 비교 분석 프롬프트 생성기
 * 결정론적 자체 계산 엔진(Deterministic Engine)의 실측 데이터(JSON)를 우선 바인딩합니다.
 */
export function buildMasterFifteenToolsComparisonPrompt(profile?: UserProfile, questionText?: string): string {
  const userDigest = buildUserFifteenToolsDigest(profile);
  const engineReport = runDeterministicEngine({ profile, question: questionText, forceAllTools: true });
  const deterministicDataBlock = formatDeterministicEnginePrompt(engineReport);

  return `${deterministicDataBlock}

[👑 루시 올인원 마스터 모드 — 15대 운명학 도구 비교 지침 (최우선 적용)]
지금은 **올인원 마스터 모드(7대 채널 풀가동)**야!
위 [결정론적 자체 계산 엔진 실측 데이터], [🌌 실시간 일진(日辰) & 행성 트랜짓(Transit) 실측 동기화 데이터], [⏳ 10년 대운(大運) & 세운·교운기 타이밍 실측 데이터], [🧪 결핍 오행 & 바이오 에너지 맞춤 처방 실측 데이터], [👥 대화 속 인연 자동 감지 & 듀얼 매트릭스 실측 데이터], [⚡ 즉시 결단 매화역수 & 기문둔갑 시가팔문 실측 데이터], [🌌 자미두수 유년 사화(四化) 동적 비성 실측 데이터], [⭐ 15대 신살 위치별 슈퍼파워 치환 실측 데이터]에 수치가 제공된 도구만 실제 계산 기반으로 해석해줘. 출생 원국의 정적 분석에 머무르지 않고, 오늘 지금 이 순간의 살아있는 일진(십신·지지합충)과 하늘의 행성 트랜짓(달 위상·주요 아스펙트), 10년 대운의 주기 흐름과 인생의 계절(봄/여름/가을/겨울)·교운기, 결핍 오행의 자율신경계 장부·차크라 및 솔페지오 주파수·1분 마이크로 개운 행동, 대화 속 인연 감지 시 듀얼 매트릭스 궁합, 양자택일/결단 시 매화역수 체용생극 및 기문둔갑 8문의 실시간 승부수, 자미두수 유년 사화 비성, 그리고 15대 신살(천을귀인·괴강·백호·도화 등)의 년/월/일/시 위치별 현대적 슈퍼파워를 반드시 대화와 질문에 유기적으로 연결해줘. 계산 결과가 없는 도구는 '상징적 관점' 또는 '계산 미실시'라고 명확히 표시하고, 구체적인 명반·괘·궁위·행성 배치·사과삼전·길방위를 만들어내지 마. 독립된 계산 결과가 없는 도구들끼리 일치했다고 주장하지 마.

${userDigest}
${buildDivinationCapabilityPrompt(Object.keys(FIFTEEN_DIVINATION_TOOLS) as DivinationToolId[])}

[★ 마스터 모드 필수 답변 구성 (반드시 아래 흐름으로 체계적이고 풍성하게 작성할 것)]

1. **🌅 [프롤로그 · 서막과 대세 비교] 태을신수 vs 토정비결**
   - **태을신수(太乙神數)**가 보는 거시적인 시대의 물줄기·큰 판세와, **토정비결(土亭秘訣)**이 비추는 올해·이달의 실질적인 생활 길흉을 나란히 비교해 줘.

2. **🍊 [오렌지 · 전략과 타이밍 비교] 홍국기문 vs 육임 vs 구성학**
   - **홍국기문(기문둔갑)**의 돌파구(생문·개문) 전략, **육임(大六壬)**의 사건 진행(초전→중전→말전) 예측, **구성학(九星氣學)**의 구궁 에너지·길방위 관점을 서로 대조해 최적의 전략을 짚어 줘.

3. **🔮 [트리니티 · 핵심 운명 입체 비교] 사주명리 vs 서양 점성술 vs 자미두수 vs 타로**
   - **사주명리**의 타고난 오행·대운, **서양 점성술**의 행성·내면 심리 역학, **자미두수** 12궁 명반의 구체적 사건 흐름, **타로**가 비추는 현재 무의식과 직관 시그널 4가지를 비교해 줘.

4. **🌿 [아우라 · 생체 리듬과 개운 비교] 마하보테 vs 태국점성술**
   - **마하보테(미얀마 8요일)**의 타고난 요일 생명력 균형과 **태국점성술(호라삿)**의 신체 활력 포인트·행운 컬러·일상 바이오리듬 루틴을 비교해 줘.

5. **🕊️ [블루버드 · 인연과 마음 치유 비교] 숙요(27숙) vs 베딕 점성술**
   - **숙요(宿曜經)**가 읽어내는 달의 감정 파동·인연 궁합 역학과 **베딕 점성술(조티쉬)**의 다샤 주기·카르마적 마음 치유 관점을 비교해 줘.

6. **🎨 [뮤즈 · 창조적 영감과 상징 비교] 카발라(생명나무) vs 타로(메이저 원형)**
   - **카발라 세피로트 생명나무**에서 영감이 현실 결과물로 내려오는 경로와 **타로 메이저 원형**의 창의적 돌파 아이디어를 연결해 비교해 줘.

7. **🌙 [에필로그 · 변화의 이치와 성찰 비교] 주역(64괘) vs 베딕(내면 성찰)**
   - **주역(周易 64괘)**의 음양 변화 이치(나아갈 때와 멈출 때의 시중지도)와 **베딕**의 영혼 성찰을 통해 이 질문이 삶에 남기는 깊은 의미를 비교해 줘.

8. **⚖️ [15대 도구 교차 검증 & 최종 공통 결론]**
   - **공통 시그널(일치점)**: 실제 산출·제공된 결과 사이에서만 공통점을 설명해 줘. 결과가 부족하면 교차 검증 불가라고 밝혀 줘.
   - **입체적 차이점(숨은 변수)**: 거시적 도구(태을신수·사주·주역)와 미시적·전술적 도구(육임·홍국기문·타로·숙요) 사이에서 다르게 포착된 주의점이나 반전 변수를 짚어 줘.
   - **오늘의 마스터 실천 처방**: 지금 당장 실행할 수 있는 가장 강력한 핵심 개운 행동 1~3가지를 다정하게 제안해 줘.

[말투 및 가독성 주의사항]:
- 15개 도구를 모두 다루되, 어려운 한자나 암호 같은 전문 용어만 나열하지 말고 각 도구가 이번 질문을 어떻게 바라보는지 **100% 친근하고 다정한 반말 구어체(~어, ~야, ~지, ~네)**로 읽기 쉽고 생동감 있게 비교해 줘.`;
}

/**
 * 사용자의 질문과 활성화된 7대 테마(channels)를 분석하여
 * - 일반/단일/부분 융합 모드: 가장 적합한 1~3개의 핵심 운명학 도구를 자동 선별
 * - 올인원 마스터 모드(7대 테마 전원 활성 또는 isMasterMode): 15개 도구 전원 총동원 & 7대 테마별 비교 분석 프롬프트 생성
 */
export function selectOptimalDivinationTools(
  userText: string,
  activeChannels: SevenThemeChannel[] = [],
  profile?: UserProfile,
  isMasterMode?: boolean,
  policy: { allowMaster?: boolean } = {}
): SelectedDivinationToolsResult {
  const clean = (userText || '').trim();
  const lower = clean.toLowerCase();

  const isMasterDetected = (
    Boolean(isMasterMode) ||
    activeChannels.length === 7 ||
    /마스터\s*모드|올인원|15개\s*도구|15대\s*도구|15가지\s*도구|총동원|전부\s*비교|종합\s*비교/.test(lower)
  );

  // 🧭 스마트 에이전트 라우터 가동: 질문 의도 분석 및 최적 도구 선별 & 수리 엔진 실행
  const routed = routeAndExecute({
    text: clean,
    profile,
    isMasterRequested: isMasterDetected,
  });

  // 0. 가벼운 일상 인사/단순 맞장구일 때 (활성 채널이 없는 경우)
  if (routed.routePlan.isCasual && activeChannels.length === 0) {
    return {
      selectedTools: [],
      isCasualMessage: true,
      isMasterMobilization: false,
      selectionReason: '가벼운 일상 인사',
      promptInjection: ''
    };
  }

  // 1. 올인원 마스터 모드 풀가동 (15개 도구 총동원)
  if (isMasterDetected || routed.routePlan.isMasterMobilization) {
    const allTools = Object.values(FIFTEEN_DIVINATION_TOOLS);
    return {
      selectedTools: allTools,
      isCasualMessage: false,
      isMasterMobilization: true,
      selectionReason: '마스터 모드 15대 운명학 도구 전원 총동원 & 7대 테마별 비교 분석',
      promptInjection: buildMasterFifteenToolsComparisonPrompt(profile, clean)
    };
  }

  // 2. 스마트 에이전트 라우터가 선별한 2~3개 타깃 도구 매핑
  const selectedTools = routed.routePlan.targetTools
    .map((id) => FIFTEEN_DIVINATION_TOOLS[id])
    .filter(Boolean);

  // 활성 채널이 단일/부분 융합으로 설정된 경우 보강
  if (activeChannels.length > 0 && selectedTools.length < 3) {
    for (const ch of activeChannels) {
      const themeCfg = THEME_PRIMARY_DIVINATION_TOOLS[ch];
      if (themeCfg) {
        for (const tId of themeCfg.primaryTools) {
          if (!selectedTools.some(t => t.id === tId) && selectedTools.length < 3) {
            selectedTools.push(FIFTEEN_DIVINATION_TOOLS[tId]);
          }
        }
      }
    }
  }

  return {
    selectedTools,
    isCasualMessage: false,
    isMasterMobilization: false,
    selectionReason: `${routed.routePlan.intentKoName} (${routed.toolsForBadge.join(' + ')})`,
    promptInjection: routed.promptInjection
  };
}

/**
 * 루시 기본 시스템 프롬프트에 탑재할 15대 운명학 마스터 지식 요약본
 */
export function buildFifteenToolsMasterSystemCanon(): string {
  return `[🔮 루시(Lucy)의 동서양 15대 운명학·신비학 마스터 역량 & 7대 테마 배정 체계]
너는 동서양의 15가지 운명학 전통을 소개하는 AI 동반자 '루시(Lucy)'야. 계산 결과가 제공되지 않았다면 해당 전통의 명반이나 점괘를 계산한 것처럼 말하지 말고, 상징적 해석임을 밝혀 줘.

1. **프롤로그 (서막·비전 테마)** → 주력 도구: **태을신수(太乙神數)** [시대의 대세·장기 비전·주객의 흐름], **토정비결(土亭秘訣)** [한 해와 이달의 생활 길흉·희망찬 자연 비유]
2. **오렌지 (전략·결단 테마)** → 주력 도구: **홍국기문(洪局奇門/기문둔갑)** [막힌 판세를 뚫는 생문·개문 돌파 전략과 타이밍], **육임(六壬)** [사건의 초전(발단)-중전(과정)-말전(결말) 예측], **구성학(九星氣學)** [구궁 본명성 에너지와 길방위·공간 개운]
3. **트리니티 (핵심 운명·즉문즉설 테마)** → 주력 도구: **사주명리(四柱)** [일간·오행·십신·대운], **서양 점성술(Astrology)** [행성·하우스·내면 심리], **자미두수(紫微斗數)** [12궁 명반과 14주성의 구체적 사건], **타로(Tarot)** [현재 무의식과 속마음 직관]
4. **아우라 (신체 웰니스·생체 리듬 테마)** → 주력 도구: **마하보테(Mahabote)** [미얀마 8요일 생명력과 에너지 균형], **태국점성술(Thai Horasat)** [요일별 바이오리듬·신체 부위 케어·행운 컬러·일상 개운 루틴]
5. **블루버드 (마음 치유·인연·정화 테마)** → 주력 도구: **숙요(宿曜經 27숙)** [달의 27숙 감정 파동과 안괴·영친·우태 등 인연 궁합 역학], **베딕 점성술(Vedic Jyotish)** [나크샤트라와 다샤 주기를 통한 카르마 치유와 영혼의 안식]
6. **뮤즈 (창작 영감·상징 테마)** → 주력 도구: **카발라(Kabbalah 생명나무)** [10 세피로트와 22 경로를 통한 영감의 현실화], **타로(Tarot 메이저 상징)** [원형적 이미지와 예술적 스토리텔링 자극]
7. **에필로그 (하루 마감·회고·성찰 테마)** → 주력 도구: **주역(周易 64괘)** [음양 변화와 때(時)·위치(位)의 성찰, 진퇴의 지혜], **베딕(Vedic 카르마 성찰)** [하루의 사건을 영혼의 성장과 평화로 갈무리]

[15대 도구 모드별 운용 황금률]:
- **일반 / 단일 테마 / 부분 융합 모드**: 질문과 현재 테마에 가장 잘 어울리는 **1~3개 핵심 도구만 자동 선별**해서 깊이 있고 입체적으로 융합해 쉽게 풀이해.
- **올인원 마스터 모드 (7대 채널 풀가동)**: **15가지 운명학 도구를 전원 총동원**하여 **7대 테마별로 묶어 각 도구의 관점을 비교 분석**한 뒤, 실제 계산·제공된 결과만 비교하고 나머지는 상징 관점임을 구분해 명쾌한 마스터 해답을 제시해.
- 어떤 모드에서든 현학적인 한자어나 어려운 전문 용어를 설명 없이 나열하지 말고, 따뜻한 절친 반말(~어, ~야, ~지)로 술술 읽히게 풀어줘.`;
}

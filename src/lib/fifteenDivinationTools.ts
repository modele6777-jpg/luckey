import type { CalculationAuditItem } from './divination/calculationAudit';
import { buildAdditionalBirthDigest } from './divination/birthDigest';
import { buildDivinationCapabilityPrompt } from './divinationCapabilities';
import { resolveEffectiveSolarDate } from './lunarCalendar';
import { parseBirthTime } from './birthDateTime';
import { UserProfile } from './sharedState';
import { calculateDetailedSaju } from './sajuAnalysis';
import { buildUserNatalSummary } from './astrologyAnalysis';
import { runDeterministicEngine, formatDeterministicEnginePrompt, getFiredEngineBadges, getCalculationAudit, ALL_DCE_ENGINES } from './divination/deterministicEngine';
import { calculateKyusei } from './divination/kyuseiEngine';
import { calculateMahabote } from './divination/mahaboteEngine';
import { calculateThaiHorasat } from './divination/thaiHorasatEngine';
import { calculateKabbalah } from './divination/kabbalahEngine';
import { calculateTarotMaster } from './divination/tarotMasterEngine';
import { calculateTojeong } from './divination/tojeongEngine';
import { calculateTaiyi } from './divination/taiyiEngine';
import { calculateSukuyoAdvanced } from './divination/sukuyoEngine';
import { calculateVedicAdvanced } from './divination/vedicEngine';
import { calculateHonggukQimen } from './divination/honggukQimenEngine';
import { calculateZiweiFlyingStars } from './divination/ziweiFlyingStarsEngine';
import { calculateLiurenMaster } from './divination/liurenMasterEngine';
import { calculateIchingMaster } from './divination/ichingMasterEngine';
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
    coreEssence: '연·월·일·시 사주팔자(천간·지지)와 음양오행(목·화·토·금·수), 십신(비겁·식상·재성·관성·인성), 12운성·합충형파해·조후(調候) 및 용신·대운·세운의 생극제화로 타고난 기질과 시기별 성패를 읽는 정통 명학',
    bestFor: '타고난 성향·재능, 대운과 연운의 흐름, 직업·재물·연애의 근본 그릇, 결핍·과다 오행의 조후 및 개운법',
    easyLanguageGuide: '한자 용어를 그대로 나열하지 말고 "네가 타고난 일간의 기질이 ~해서", "지금 들어온 불/물 기운이 ~를 도와주고 있어서"처럼 계절·온도·자연의 비유로 친근하게 풀어줘.',
    explicitRegex: /사주|팔자|명리|만세력|일주|일간|용신|대운|세운|십신|오행|천을귀인|도화살|역마살|조후|십이운성/,
    intentKeywords: [/타고난|성격|적성|재물운|직업운|결혼운|올해\s*운|운세|사주/]
  },

  // 2. 점성술 (트리니티 주력)
  astrology: {
    id: 'astrology',
    koName: '서양 점성술',
    hanjaOrEng: 'Western Astrology',
    primaryTheme: 'trinity',
    secondaryThemes: ['bluebird', 'muse'],
    coreEssence: '태양(자아)·달(내면 감정)·상승궁(페르소나)과 10행성, 12하우스, 4원소·3모달리티(활동·고정·변통) 균형 및 행성 간 각도(Aspect)·트랜짓을 통해 무의식적 욕망과 관계의 심리 역학을 해독하는 별의 지도',
    bestFor: '내면 심리와 감정 패턴, 자존감, 원소·모달리티 균형, 연인·지인과의 시나스트리(궁합), 현재 행성 트랜짓에 따른 심리적 변화',
    easyLanguageGuide: '트라인·스퀘어 같은 각도 용어 대신 "태양과 달의 기운이 서로 밀어주면서 ~한 매력이 나타나", "불과 물의 기운이 맞물려 감수성을 자극해서"처럼 감정과 심리 중심으로 쉽게 설명해줘.',
    explicitRegex: /점성술|점성학|별자리|네이탈|출생\s*차트|태양궁|달\s*별자리|상승궁|어센던트|트랜짓|하우스|금성|화성|수성\s*역행|모달리티|어스펙트/,
    intentKeywords: [/별자리|매력|자아|심리\s*패턴|연애\s*스타일|궁합|감정\s*기복/]
  },

  // 3. 자미두수 (트리니티 주력)
  ziwei: {
    id: 'ziwei',
    koName: '자미두수',
    hanjaOrEng: '紫微斗數',
    primaryTheme: 'trinity',
    secondaryThemes: ['orange', 'prologue'],
    coreEssence: '자미성·천기성·태양성·무곡성 등 14주성과 보성, 사화(화록·화권·화과·화기) 및 삼방사정·록기교충을 명궁·부처궁·재백궁·관록궁·천이궁 등 12궁 명반에 배치해 인생의 구체적 사건과 환경을 정밀하게 비추는 황실 별자리 명학',
    bestFor: '배우자·연인의 구체적 성향(부처궁), 재물 축적 방식(재백궁), 직장·사회적 명예(관록궁), 인간관계·외부 환경(천이궁/노복궁), 유년 사화의 공수 전환 타이밍',
    easyLanguageGuide: '12궁과 주성·사화의 상징을 "자미두수 명반의 부처궁(연애·배우자 방) 흐름을 보면~", "올해 화록의 기운이 재백궁을 비추고 있어서~"처럼 인생의 12개 방 이야기로 생생하게 들려줘.',
    explicitRegex: /자미두수|자미성|명궁|부처궁|재백궁|관록궁|천이궁|복덕궁|명반|사화|화록|화권|화과|화기|14주성|삼방사정|록기교충/,
    intentKeywords: [/배우자|결혼\s*상대|직장\s*생활|사회적\s*성공|부모|형제|집안|구체적\s*사건/]
  },

  // 4. 타로 (트리니티 & 뮤즈 주력)
  tarot: {
    id: 'tarot',
    koName: '타로',
    hanjaOrEng: 'Tarot Archetypes',
    primaryTheme: 'trinity',
    secondaryThemes: ['muse', 'bluebird'],
    coreEssence: '메이저 아르카나 22장의 영혼 성장 여정(소울·퍼스널리티·성장 카드 수비학)과 마이너 아르카나 56장(완드·컵·소드·펜타클 4원소 균형)의 원형 상징을 통해 현재 순간의 무의식, 상대의 속마음, 단기적 흐름을 직관적으로 비추는 거울',
    bestFor: '상대방의 현재 속마음, 썸·재회·갈등의 단기 흐름, 소울/올해의 성장 카드 키워드, 무의식이 보내는 시그널과 당장 필요한 태도',
    easyLanguageGuide: '카드 이미지가 품은 이야기와 상징을 들어 "지금 네 마음은 마치 타로의 [별/은둔자/완드 에이스] 카드처럼 ~한 상태야"라고 직관적이고 공감 가게 비유해줘.',
    explicitRegex: /타로|아르카나|스프레드|타로\s*카드|메이저\s*카드|완드|펜타클|소드|속마음|소울\s*카드|올해의\s*카드/,
    intentKeywords: [/속마음|연락|재회|썸|그\s*사람|직관|지금\s*당장|오늘의\s*운세/]
  },

  // 5. 숙요 (블루버드 주력)
  sukuyo: {
    id: 'sukuyo',
    koName: '숙요점성술',
    hanjaOrEng: '宿曜經 (27숙)',
    primaryTheme: 'bluebird',
    secondaryThemes: ['trinity', 'orange'],
    coreEssence: '달이 지나는 황도 27숙(각숙·항숙·저숙·방숙·심숙·미숙·기숙 등)과 7대 숙격(안중숙·화해숙·강유숙·조급숙·맹악숙·경조숙·행요숙)·칠요 오행을 기반으로 내면 정서와 인연 역학(안괴·영친·우태·성유·업태·명)을 꿰뚫어 보는 밀교 달의 지혜',
    bestFor: '두 사람의 숙명적 인연과 궁합(왜 끌리는지, 왜 부딪히는지), 본명숙 기질과 감정적 파동, 관계에서의 거리 조절과 치유',
    easyLanguageGuide: '"숙요(달의 27숙)로 두 사람의 인연 결을 살펴보면 서로 성장시키는 영친(榮親)/강렬하게 끌리는 안괴(安壞) 흐름이 있어서~"처럼 관계의 심리와 감정 파동을 다정하게 풀어줘.',
    explicitRegex: /숙요|27숙|28숙|숙요경|안괴|영친|우태|성유|업태|본명숙|숙격/,
    intentKeywords: [/인연|궁합|관계|갈등|친해지|왜\s*힘들까|감정\s*소모|거리두기|동료|친구\s*사이/]
  },

  // 6. 마하보테 (아우라 주력)
  mahabote: {
    id: 'mahabote',
    koName: '마하보테',
    hanjaOrEng: 'Mahabote (미얀마 8요일 점성술)',
    primaryTheme: 'aura',
    secondaryThemes: ['prologue', 'trinity'],
    coreEssence: '미얀마 전통의 출생 요일(일~토 및 수요일 오후 라후 포함 8방위 동물·행성 상징)과 7궁(Binga·Atun·Yaza·Adipati·Marana·Thike·Puti) 및 나이 다샤 순환을 통해 생체 에너지 균형과 길방위·생활 리듬을 조율하는 실천 비법',
    bestFor: '타고난 출생 요일별 생명력과 수호성, 당해 나이 다샤(길흉 주기), 신체·정신적 에너지 밸런스와 개운 루틴',
    easyLanguageGuide: '"마하보테에서 네가 태어난 요일의 수호 기운을 보면 ~한 생명력을 가지고 있어서, 몸이 지칠 땐 ~처럼 에너지를 순환시키는 게 딱 맞아"라고 실생활 웰니스 팁으로 연결해줘.',
    explicitRegex: /마하보테|mahabote|8요일|요일\s*점성술|미얀마\s*점성술|빙가|야자|아디파티|나이\s*다샤/i,
    intentKeywords: [/활력|에너지|체력|리듬|요일|컨디션|지칠\s*때|생기/]
  },

  // 7. 베딕 (블루버드 & 에필로그 주력)
  vedic: {
    id: 'vedic',
    koName: '베딕 점성술',
    hanjaOrEng: 'Vedic Jyotish (인도 점성술)',
    primaryTheme: 'bluebird',
    secondaryThemes: ['epilogue', 'trinity'],
    coreEssence: '실제 항성 황도대(Sidereal) 기준의 달 궁(Rashi)과 27 나크샤트라(Nakshatra)·파다(Pada), 빔쇼타리 다샤(마하다샤·안타르다샤 행성 대운 주기), 카르마(Karma)와 다르마(Dharma)를 통해 영혼의 숙제와 내면의 평화를 밝히는 빛의 학문(Jyotish)',
    bestFor: '반복되는 삶의 패턴(카르마) 이해와 치유, 영혼의 사명(다르마), 마하다샤·부대운(안타르다샤) 전환기 의미, 마음의 안식',
    easyLanguageGuide: '"베딕 점성술(조티쉬)의 관점에서 보면 지금 겪는 시련은 네 영혼이 더 단단해지려는 다샤(성장 주기)의 과정이야"처럼 깊은 위로와 영적 통찰로 마음을 보듬어줘.',
    explicitRegex: /베딕|인도\s*점성술|조티쉬|jyotish|나크샤트라|파다|다샤|안타르다샤|라후|케투|카르마|다르마|아트마카라카/i,
    intentKeywords: [/반복되는|아픔|상처|업보|이유가\s*뭘까|영혼|사명|내면의\s*평화|위로/]
  },

  // 8. 육임 (오렌지 주력)
  liuren: {
    id: 'liuren',
    koName: '육임',
    hanjaOrEng: '大六壬',
    primaryTheme: 'orange',
    secondaryThemes: ['trinity'],
    coreEssence: '동양 삼식(태을·기문·육임) 중 인사(人事) 예측의 정점으로, 천지반 월장·점시와 사과(四課)·삼전(三傳: 초전·중전·말전)·12천장 및 국면 판정을 통해 사건의 발단-전개-결말과 숨겨진 변수를 예리하게 꿰뚫는 예측학',
    bestFor: '현재 진행 중인 일·계약·협상·관계의 구체적 진행 과정(초전→중전→말전)과 추진/관망 판단, 숨은 의도나 리스크 파악',
    easyLanguageGuide: '"육임의 삼전(시작-중간-결과) 흐름으로 이 일을 짚어보면, 초반(초전)에는 ~한 변수가 있지만 중반(중전)에 ~하게 대응하면 끝(말전)에는 좋은 결실을 맺을 수 있어"처럼 단계별 전략으로 명쾌하게 설명해줘.',
    explicitRegex: /육임|대육임|사과삼전|삼전|초전|중전|말전|천장|월장|귀인\s*포국/,
    intentKeywords: [/결과가\s*어떨까|성공할까|합격|계약|협상|변수|리스크|어떻게\s*흘러갈까|전망/]
  },

  // 9. 홍국기문 (오렌지 주력)
  qimen: {
    id: 'qimen',
    koName: '홍국기문',
    hanjaOrEng: '洪局奇門 (기문둔갑)',
    primaryTheme: 'orange',
    secondaryThemes: ['prologue', 'trinity'],
    coreEssence: '조선 정통 4주 9궁의 세효·응효·중궁·팔문(휴·생·상·두·경·사·경·개문)·삼형살·5행 통기(通氣) 순환을 배합해 막힌 상황을 뚫는 최적의 타이밍, 유리한 방위, 승부수 전략을 설계하는 제왕의 병법 방위학',
    bestFor: '이직·창업·사업 확장·투자·면접 등 중대한 결단의 최적 타이밍, 세효 8문 돌파구(생문/개문) 전략, 5행 통기 보완 방향 선택',
    easyLanguageGuide: '"홍국기문(기문둔갑)으로 지금 판세를 읽어보면, 정면 돌파보다는 생문(生門·살아나는 문)이 열리는 ~한 방식과 타이밍을 택하는 게 최고의 한 수야"처럼 전략적 돌파구를 제시해줘.',
    explicitRegex: /홍국기문|기문둔갑|기문|팔문|생문|개문|휴문|경문|삼기|육의|포국|세효|응효|통기/,
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
    coreEssence: '태국 전통 호라삿(Horasat)의 요일별 수호 행성·행운 컬러·신체 부위 에너지와 생활 밀착형 개운 리추얼(탄·메타·음식·방향·색상 조율)을 통해 일상의 생기와 행운을 북돋는 동남아 황실 점성술',
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
/**
 * 사용자의 생년월일시 프로필로부터 15대 운명학 도구가 즉시 활용할 수 있는 핵심 개인화 시드 지표를 계산합니다.
 * 결과의 연도·시점 의존 항목은 asOfDate를 기준으로 합니다. 반복 가능한 결과가 필요하면 기준일을 전달하세요.
 */
export function buildUserFifteenToolsDigest(profile?: UserProfile, asOfDate: Date = new Date()): string {
  if (!profile?.basic?.birthdate) return '[개인화 계산 미실시] 생년월일 미입력. 명반·본명성·요일·별자리를 임의 지정하지 말 것.';
  const referenceDate = new Date(asOfDate.getTime());
  const kstYear = new Date(referenceDate.getTime() + 9 * 60 * 60 * 1000).getUTCFullYear();
  try {
    const { solarDate, solarDateString, isLunar } = resolveEffectiveSolarDate(profile.basic.birthdate.trim(), profile.basic.lunarSolar, profile.basic.isLeapMonth ?? false);
    const { year, month, day } = solarDate;
    const time = parseBirthTime(profile.basic.birthtime);
    const civil = new Date(0);
    civil.setUTCFullYear(year, month - 1, day);
    civil.setUTCHours(time?.hour ?? 12, time?.minute ?? 0, 0, 0);
    const dow = civil.getUTCDay();
    const saju = calculateDetailedSaju(profile);
    const sajuSpecials = saju?.specialStructures?.length
      ? ` · 특수 신살: ${saju.specialStructures.slice(0, 3).map((st) => `${st.name}(${st.category})`).join('·')}`
      : '';
    const sajuBodyRoot = saju
      ? [saju.bodyStrength.deukRyeong ? '득령' : '', saju.bodyStrength.deukJi ? '득지' : ''].filter(Boolean).join('·') || '평형'
      : '';
    const johuNote = saju?.yongsinDetails?.johuYongsin ? ` · 조후 ${saju.yongsinDetails.johuYongsin}` : '';
    const yongsinAnalysis = saju?.yongsinDetails?.analysisNote ? ` · 근거: ${saju.yongsinDetails.analysisNote}` : '';
    const annualFlow = saju?.annual2026?.yearName && saju?.annual2026?.elementFlow
      ? `${saju.annual2026.yearName}[${saju.annual2026.elementFlow}] `
      : '';
    const dominantLabel = saju?.elements?.strengthLabel ? ` · 판정: ${saju.elements.strengthLabel}` : '';
    const hiddenMainNote = saju?.pillars.month.hiddenStems?.main && saju?.pillars.day.hiddenStems?.main
      ? ` · 지장간 정기: 월(${saju.pillars.month.hiddenStems.main.stem}·${saju.pillars.month.hiddenStems.main.tenGod})/일(${saju.pillars.day.hiddenStems.main.stem}·${saju.pillars.day.hiddenStems.main.tenGod})`
      : '';
    const monthDayStageNote = saju
      ? ` · 월지(${saju.pillars.month.tenGodZhi.name}·${saju.pillars.month.twelveStage})/일지(${saju.pillars.day.tenGodZhi.name}·${saju.pillars.day.twelveStage}) · 년지(${saju.pillars.year.twelveStage})${saju.pillars.hour ? `/시지(${saju.pillars.hour.twelveStage})` : ''}${hiddenMainNote}`
      : '';
    const currentDaeunPillar = saju?.daewunDetail?.timeline?.find((p) => saju.daeun.current.includes(p.ganZhi) || saju.daeun.current.includes(`${p.ganKr}${p.zhiKr}`)) || saju?.daewunDetail?.timeline?.[0];
    const daeunMetaNote = saju
      ? `${saju.daewunDetail.daewunNumber ? `대운수 ${saju.daewunDetail.daewunNumber}세 · ` : ''}${saju.daewunDetail.directionText}${currentDaeunPillar ? ` · ${currentDaeunPillar.tenGodGan}/${currentDaeunPillar.tenGodZhi}·${currentDaeunPillar.twelveStage}` : ''}`
      : '';
    const sajuBrief = saju ? `${saju.dayMaster.hanja}(${saju.dayMaster.korean} · ${saju.dayMaster.symbolName} · ${saju.dayMaster.archetypeTitle}) 일간 · 4주: ${saju.pillars.year.gan}${saju.pillars.year.zhi}년 ${saju.pillars.month.gan}${saju.pillars.month.zhi}월 ${saju.pillars.day.gan}${saju.pillars.day.zhi}일${saju.pillars.hour ? ` ${saju.pillars.hour.gan}${saju.pillars.hour.zhi}시` : ''} · 격국: ${saju.geokguk.name}(${saju.geokguk.category} — ${saju.geokguk.description})${monthDayStageNote} · ${saju.bodyStrength.level}(${sajuBodyRoot}) · 용신: ${saju.yongsin.name}(희신 ${saju.yongsinDetails.heeshin} · 기신 ${saju.yongsinDetails.gisin}${johuNote}${yongsinAnalysis} · 처방: ${saju.yongsin.actionTip}) · 현재 대운: ${saju.daeun.current}(${daeunMetaNote} · 차기 ${saju.daeun.next}) · 세운 기조: ${annualFlow}${saju.annual2026.theme}(기회: ${saju.annual2026.keyOpportunity} · 주의: ${saju.annual2026.caution}) · 우세 오행: ${saju.elements.dominant.name}(${saju.elements.dominant.advice}${dominantLabel}) · 보완 오행: ${saju.elements.lacking.name}(개운 처방: ${saju.elements.lacking.remedy} · 개운 색: ${saju.elements.lacking.luckyColor} · 개운 음식: ${saju.elements.lacking.luckyFood} · 개운 장소: ${saju.elements.lacking.luckyPlace})${sajuSpecials}` : '입력 확인 필요: 사주 미계산';
    let animal = MAHABOTE_ANIMALS[dow];
    if (dow === 3) animal = !time ? '수요일 오전/오후 구분은 생시 필요' : time.hour < 12 ? '수요일 오전·수성·엄니 코끼리' : '수요일 오후·라후·엄니 없는 코끼리';

    // 6. 마하보테 (미얀마 7궁 명반 및 8요일 성좌 결정론 산법)
    let mahaboteLine: string;
    try {
      const mb = calculateMahabote({ profile, targetYear: kstYear });
      if (mb.status === 'calculated' && mb.rootHouse && mb.currentAgeTransit) {
        const affinityNote = mb.planetaryAffinity
          ? ` · 행성 친화(${mb.planetaryAffinity.friendlyPlanets.slice(0, 2).join('·')} 조화 / ${mb.planetaryAffinity.challengingPlanets.slice(0, 2).join('·')} 절제 — ${mb.planetaryAffinity.affinityAdvice})`
          : '';
        const domainPairs: Array<[string, number]> = mb.domainAffinities
          ? [
              ['명예·리더십', mb.domainAffinities.leadershipHonor],
              ['재물·번영', mb.domainAffinities.wealthProsperity],
              ['영적 내실', mb.domainAffinities.wisdomFortitude],
              ['위기 돌파', mb.domainAffinities.innovationBreakthrough],
            ]
          : [];
        const sortedDomains = [...domainPairs].sort((a, b) => b[1] - a[1]);
        const domainNote = mb.domainAffinities?.primaryLifeDomain
          ? ` · 주도 영역 [${mb.domainAffinities.primaryLifeDomain}${sortedDomains.length >= 2 ? ` · 강점 ${sortedDomains.slice(0, 2).map((d) => d[0]).join('·')} · 보완 ${sortedDomains[sortedDomains.length - 1][0]}` : ''}]`
          : '';
        const rootHouseObj = mb.houses?.find((h) => h.isBirthRootHouse);
        const rootHouseMeaning = rootHouseObj?.meaning;
        const rootHouseHanjaNote = rootHouseObj?.hanja ? `[${rootHouseObj.hanja}]` : '';
        const rootMeaningNote = rootHouseMeaning ? ` · 명반 요해(${rootHouseMeaning})` : '';
        const transitHouseObj = mb.houses?.find((h) => h.houseName === mb.currentAgeTransit?.transitHouseName);
        const transitHouseDetail = transitHouseObj
          ? `[${transitHouseObj.hanja} · ${transitHouseObj.category} · 수호성 ${transitHouseObj.planet.planet} · ${transitHouseObj.meaning}]`
          : '';
        const qKey = (['q1', 'q2', 'q3', 'q4'] as const)[Math.floor(new Date(referenceDate.getTime() + 9 * 3600000).getUTCMonth() / 3)];
        const transitDetailNote = mb.transitInteraction
          ? ` · 다샤 흐름(${mb.transitInteraction.phaseMeaning} · 분기 초점: ${mb.transitInteraction.quarterlyFocus[qKey]})`
          : '';
        const practiceNote = mb.remedies?.spiritualPractice
          ? ` · 영적 실천: ${mb.remedies.spiritualPractice}`
          : '';
        const evalNote = mb.rootHouse.evaluation
          ? ` · 본명궁 평가(${mb.rootHouse.evaluation})`
          : '';
        const ritualNote = mb.ritualAction ? ` · 명반 의례: ${mb.ritualAction}` : '';
        const focusNote = mb.reflectionFocus ? ` · 성찰 초점: ${mb.reflectionFocus}` : '';
        const questionNote = mb.reflectiveQuestion ? ` · 성찰 질문: "${mb.reflectiveQuestion}"` : '';
        const boundaryNote = mb.interpretiveBoundary ? ` · 해석 경계: ${mb.interpretiveBoundary}` : '';
        const matrixNote = mb.mahaboteSynthesisMatrix
          ? ` · 명반 조율 [${mb.mahaboteSynthesisMatrix.alignmentState} / ${mb.mahaboteSynthesisMatrix.dominantTension}] → ${mb.mahaboteSynthesisMatrix.integratedAction}`
          : '';
        const planetAnimalNote = mb.birthPlanet?.animal ? ` · 영수 ${mb.birthPlanet.animal}` : '';
        const planetGemNote = mb.birthPlanet?.gemstone ? ` · 본명 보석 ${mb.birthPlanet.gemstone}` : '';
        const planetColorNote = mb.birthPlanet?.color ? ` · 본명 색채 ${mb.birthPlanet.color}` : '';
        mahaboteLine = `- 마하보테 8요일 부분 계산: ${KOR_WEEKDAYS[dow]} · ${animal}(수호성 ${mb.birthPlanet?.planet || '태양(Sun)'}${mb.birthPlanet?.element ? ` · 본원 ${mb.birthPlanet.element}/${mb.birthPlanet.direction}` : ''}${planetAnimalNote}${planetGemNote}${planetColorNote}). [7궁 명반 포국]: 본명궁 ${mb.rootHouse.houseName}${rootHouseHanjaNote}(${mb.rootHouse.category})${evalNote}${rootMeaningNote} · 미얀마 역법 ME ${mb.myanmarEra}년 · 소수력 잉여수 ${mb.remainder} · 당해 ${mb.currentAgeTransit.currentAge}세 나이 다샤(${mb.currentAgeTransit.transitHouseName}${transitHouseDetail}${mb.transitInteraction?.phase ? ` · ${mb.transitInteraction.phase}` : ''} — ${mb.currentAgeTransit.theme})${transitDetailNote}${domainNote}${affinityNote} · 길방위: ${mb.remedies?.luckyDirection || '동쪽'} · 길색: ${mb.remedies?.luckyColors?.join(', ') || '흰색'}${mb.remedies?.luckyGemstone ? ` · 길보석: ${mb.remedies.luckyGemstone}` : ''}${practiceNote} · 실행 조언: ${mb.currentAgeTransit.actionAdvice}${ritualNote}${matrixNote}${focusNote}${questionNote}${boundaryNote}.`;
      } else {
        mahaboteLine = `- 마하보테 8요일 부분 계산: ${KOR_WEEKDAYS[dow]} · ${animal}. 7궁 명반 미계산.`;
      }
    } catch {
      mahaboteLine = `- 마하보테 8요일 부분 계산: ${KOR_WEEKDAYS[dow]} · ${animal}. 7궁 명반 미계산.`;
    }

    // 12. 태국점성술 (호라삿 8요일 행성·마하탁사 108년 대운·4원소 탓 신체 활력 결정론 산법)
    const colors = ['빨강', '노랑·크림', '분홍', '초록', '주황', '파랑', '보라'];
    let thaiLine: string;
    try {
      const th = calculateThaiHorasat({ profile, targetDate: referenceDate });
      if (th.status === 'calculated' && th.birthDayPlanet && th.mahaThaksa && th.fourElements) {
        const dynAdvice = th.planetaryFriendEnemyDynamic?.strategicInteraction ? `(${th.planetaryFriendEnemyDynamic.strategicInteraction})` : '';
        const dyn = th.planetaryFriendEnemyDynamic ? ` · 친우역학: ${th.planetaryFriendEnemyDynamic.relationshipType}${dynAdvice}` : '';
        const antardasha = th.mahaThaksaAntardasha ? ` · 소운 ${th.mahaThaksaAntardasha.subCycleOrder}/8차 ${th.mahaThaksaAntardasha.antardashaPlanetName}[${th.mahaThaksaAntardasha.antardashaAttribute}](${th.mahaThaksaAntardasha.pacingTempo} — ${th.mahaThaksaAntardasha.actionAdvice})` : '';
        const nextDashaSeg = th.mahaThaksa.sequence?.find((s) => s.startAge === th.mahaThaksa!.current.endAge + 1);
        const nextDashaNote = nextDashaSeg ? ` · 차기 대운 ${nextDashaSeg.planet.planet}(${nextDashaSeg.years}년, ${nextDashaSeg.startAge}~${nextDashaSeg.endAge}세)` : '';
        const dashaVerdict = th.mahaThaksa.current.verdict ? ` · 대운 판정: ${th.mahaThaksa.current.verdict}` : '';
        const dashaMeta = ` · 대운 잔여 ${th.mahaThaksa.current.yearsLeft}년(만태나이 ${th.mahaThaksa.ageCounting}세 · ${th.mahaThaksa.current.attribute.meaning})`;
        const planetNatureNote = th.birthDayPlanet.animal && th.birthDayPlanet.direction ? ` · 영수 ${th.birthDayPlanet.animal} · ${th.birthDayPlanet.direction}` : '';
        const vitalityTone = th.fourElements.vitalityIndex >= 80 ? '충만' : th.fourElements.vitalityIndex >= 60 ? '안정' : '조율 필요';
        const thaatCareNote = ` · 본명 탓(${th.fourElements.birthThaat.thai}) 신체(${th.fourElements.birthThaat.bodySystems} · 과잉 징후: ${th.fourElements.birthThaat.excessSigns}) · 탓 처방(식단: ${th.fourElements.birthThaat.diet} / 허브: ${th.fourElements.birthThaat.herbs})`;
        const luckyDir = th.remedies?.luckyDirection ? ` · 길방위 ${th.remedies.luckyDirection}` : '';
        const luckyColors = th.remedies?.luckyColors?.length ? ` · 호라삿 길색 [${th.remedies.luckyColors.join(', ')}]` : '';
        const seasonalTactics = th.seasonalThaatTactics ? ` · 계절 전술 [추진 ${th.seasonalThaatTactics.peakActionSeason} / 수성 ${th.seasonalThaatTactics.defensiveSeason}] · 활력 좌우명: ${th.seasonalThaatTactics.vitalityPreservationMotto}` : '';
        const balanceNote = th.fourElements.balanceNote ? ` · 원소 진단(${th.fourElements.balanceNote})` : '';
        const practiceNote = th.remedies?.practice ? ` · 개운 실천: ${th.remedies.practice}` : '';
        const ritualNote = th.ritualAction ? ` · 일상 의식: ${th.ritualAction}` : '';
        const focusNote = th.reflectionFocus ? ` · 성찰 초점: ${th.reflectionFocus}` : '';
        const questionNote = th.reflectiveQuestion ? ` · 성찰 질문: "${th.reflectiveQuestion}"` : '';
        const boundaryNote = th.interpretiveBoundary ? ` · 해석 경계: ${th.interpretiveBoundary}` : '';
        const matrixNote = th.horasatSynthesisMatrix ? ` · 호라삿 조율 [${th.horasatSynthesisMatrix.alignmentState} / ${th.horasatSynthesisMatrix.dominantTension}] → ${th.horasatSynthesisMatrix.integratedAction}` : '';
        thaiLine = `- 태국점성술 요일 상징: ${KOR_WEEKDAYS[dow]} · 전통 색상 ${colors[dow]}. [호라삿 정밀 차트]: 수호신 ${th.birthDayPlanet.thaiName}(${th.birthDayPlanet.translit} · ${th.birthDayPlanet.cycleYears}년 주기 · ${th.birthDayPlanet.character}${planetNatureNote}) · 마하탁사 108년 대운(${th.mahaThaksa.current.planet.planet} 대운 · 속성: ${th.mahaThaksa.current.attribute.korean}${dashaMeta}${dashaVerdict}${nextDashaNote}${dyn}${antardasha}) · 4대 원소 본명 ${th.fourElements.birthThaat.korean}/계절 ${th.fourElements.currentThaat.korean} 활력 [${vitalityTone}]${balanceNote}${thaatCareNote}${luckyDir}${luckyColors}${seasonalTactics}${practiceNote}${ritualNote}${matrixNote}${focusNote}${questionNote}${boundaryNote}.`;
      } else {
        thaiLine = `- 태국점성술 요일 상징: ${KOR_WEEKDAYS[dow]} · 전통 색상 ${colors[dow]}. 정밀 호라삿 차트 미계산.`;
      }
    } catch {
      thaiLine = `- 태국점성술 요일 상징: ${KOR_WEEKDAYS[dow]} · 전통 색상 ${colors[dow]}. 정밀 호라삿 차트 미계산.`;
    }

    // 14. 구성학 (9궁 명반 · 본명성·월명성·일명성 · 최길방위·주요 흉살방위 결정론 산법)
    let kyuseiLine: string;
    try {
      const ks = calculateKyusei({ profile, targetDate: referenceDate });
      if (ks.status === 'calculated') {
        const topDir = ks.topFortuneDirection
          ? `${ks.topFortuneDirection.direction}(${ks.topFortuneDirection.starName}·${ks.topFortuneDirection.relation})`
          : '동남·서북 균형 탐색';
        const topFortuneDetail = ks.topFortuneDirection
          ? ks.fortuneDirections.find((d) => d.direction === ks.topFortuneDirection?.direction)
          : ks.fortuneDirections[0];
        const topTrigramNote = topFortuneDetail?.trigram ? ` · ${topFortuneDetail.trigram}위` : '';
        const topDirScoreRow = ks.topFortuneDirection
          ? ks.directionalScores?.find((d) => d.direction === ks.topFortuneDirection?.direction)
          : undefined;
        const topDirActivities = topDirScoreRow?.recommendedActivities?.length
          ? ` · 길방 적격(${topDirScoreRow.recommendedActivities.slice(0, 2).join(', ')})`
          : '';
        const topGuidanceNote = topFortuneDetail?.guidance ? ` · 길방 실행(${topFortuneDetail.guidance})` : '';
        const secondFortuneDetail = ks.fortuneDirections.find((d) => d.direction !== ks.topFortuneDirection?.direction);
        const secondDirNote = secondFortuneDetail
          ? ` · 차선 길방 [${secondFortuneDetail.direction}(${secondFortuneDetail.starName}·${secondFortuneDetail.relation})]`
          : '';
        const hazardSummary = ks.hazards && ks.hazards.length > 0
          ? ks.hazards.slice(0, 3).map((h) => `${h.name}(${h.direction})`).join(', ')
          : '특이 흉살 없음';
        const hazardReasonNote = ks.hazards && ks.hazards.length > 0
          ? ` · 흉살 주의(${ks.hazards.slice(0, 2).filter((h) => Boolean(h.reason)).map((h) => `[${h.scope}] ${h.name}: ${h.reason}`).join(' / ')})`
          : '';
        const synergyNote = ks.honmyoseiSynergy
          ? ` · 연성 시너지 [${ks.honmyoseiSynergy.annualStarRelation}](${ks.honmyoseiSynergy.annualThemeGuidance})`
          : '';
        const scenarioNote = ks.usageScenarios && ks.usageScenarios.length > 0
          ? ` · 활용 방위 [${ks.usageScenarios.slice(0, 4).map((u) => `${u.scenario}: ${u.direction}(${u.advice})`).join(' / ')}]`
          : '';
        const matrixAction = ks.kyuseiSynthesisMatrix
          ? ` · 9궁 조율 [${ks.kyuseiSynthesisMatrix.alignmentState} / ${ks.kyuseiSynthesisMatrix.dominantTension}] → ${ks.kyuseiSynthesisMatrix.integratedAction}`
          : '';
        const topDirNote = ks.topFortuneDirection?.summary ? ` · 길방 해설: ${ks.topFortuneDirection.summary}` : '';
        const ritualNote = ks.ritualAction ? ` · 방위 의례: ${ks.ritualAction}` : '';
        const focusNote = ks.reflectionFocus ? ` · 성찰 초점: ${ks.reflectionFocus}` : '';
        const questionNote = ks.reflectiveQuestion ? ` · 성찰 질문: "${ks.reflectiveQuestion}"` : '';
        const boundaryNote = ks.interpretiveBoundary ? ` · 해석 경계: ${ks.interpretiveBoundary}` : '';
        const centerFlow = `년(${ks.annualChart.centerStarName})·월(${ks.monthlyChart.centerStarName})·일(${ks.dailyChart.centerStarName})`;
        kyuseiLine = `- 구성학 9궁 명반: 본명성 ${ks.honmyosei.name}[${ks.honmyosei.element}] · 월명성 ${ks.getmyosei.name}[${ks.getmyosei.element}](${ks.getmyosei.monthBranch}월·${ks.getmyosei.currentTerm}) · 일명성 ${ks.ilmyosei.name}[${ks.ilmyosei.element}](${ks.ilmyosei.dayGanZhi}일) · 중궁 흐름[${centerFlow} · ${ks.targetYearGanZhi}년] · 최길방위 [${topDir}${topTrigramNote}]${topDirActivities}${secondDirNote} · 주의 흉살방위 [${hazardSummary}]${hazardReasonNote}${synergyNote}${scenarioNote}${matrixAction}${topDirNote}${topGuidanceNote}${ritualNote}${focusNote}${questionNote}${boundaryNote}.`;
      } else {
        kyuseiLine = `- 구성학: ${ks.note || '생년월일 미입력으로 미계산'}`;
      }
    } catch {
      kyuseiLine = '- 구성학: 기준일 절기 범위 확인이 필요해 미계산. 임의 본명성·방위반을 지어내지 말 것.';
    }

    // 10. 카발라 (10 세피로트 · 22 경로 · 4개 세계 · 생년월일 게마트리아 결정론 산법)
    let kabbalahLine = '';
    try {
      const kb = calculateKabbalah({ profile });
      if (kb.status === 'calculated' && kb.numerology) {
        const describePillar = (v: number) => (v >= 50 ? '우세' : v >= 25 ? '균형' : '보완 필요');
        const worldNote = `${kb.numerology.dominantWorld.name}(${kb.numerology.dominantWorld.korean}·${kb.numerology.dominantWorld.element})`;
        const heartNote = kb.numerology.tipherethAlignment
          ? ` · 티페레트 [${kb.numerology.tipherethAlignment.balanceStatus}](${kb.numerology.tipherethAlignment.solarHeartGuidance})`
          : '';
        const flashNote = kb.numerology.lightningFlash
          ? ` · 번개 섬광 계위 [${kb.numerology.lightningFlash.stageTitle}](${kb.numerology.lightningFlash.spiritualLesson})`
          : '';
        const worldSpectrumNote = kb.numerology.fourWorldsSpectrum
          ? (() => {
              const sp = kb.numerology.fourWorldsSpectrum;
              const worlds: Array<[string, number]> = [
                ['아칠루트(불)', sp.atziluth],
                ['베리아(물)', sp.beriah],
                ['예치라(바람)', sp.yetzirah],
                ['아시야(흙)', sp.assiah],
              ];
              worlds.sort((a, b) => b[1] - a[1]);
              return ` · 4대 세계 균형(주력 ${worlds[0][0]} · 보완 ${worlds[3][0]})`;
            })()
          : '';
        const worldManifest = kb.numerology.fourWorldsSpectrum?.manifestationAdvice
          ? `${worldSpectrumNote} · 현현 조언: ${kb.numerology.fourWorldsSpectrum.manifestationAdvice}`
          : worldSpectrumNote;
        const seasonTone = kb.temporalKabbalahRhythm?.seasonalWorldTone
          ? ` · 계절 세계 결 [${kb.temporalKabbalahRhythm.treeWatchWindow} · ${kb.temporalKabbalahRhythm.seasonalWorldTone}](${kb.temporalKabbalahRhythm.temporalGuidance})`
          : '';
        const pathPractice = kb.situationalKabbalahAudit?.pathPractice
          ? ` · 경로 실천(${kb.situationalKabbalahAudit.focusTheme}): ${kb.situationalKabbalahAudit.pathPractice}${kb.situationalKabbalahAudit.sephirahNote ? ` (${kb.situationalKabbalahAudit.sephirahNote})` : ''}`
          : '';
        const ritualNote = kb.ritualAction ? ` · 개운 의식: ${kb.ritualAction}` : '';
        const focusNote = kb.reflectionFocus ? ` · 성찰 초점: ${kb.reflectionFocus}` : '';
        const boundaryNote = kb.interpretiveBoundary ? ` · 해석 경계: ${kb.interpretiveBoundary}` : '';
        const matrixNote = kb.kabbalahSynthesisMatrix
          ? ` · 카발라 처신(${kb.kabbalahSynthesisMatrix.coreInsight} → ${kb.kabbalahSynthesisMatrix.recommendedAction} · 유의: ${kb.kabbalahSynthesisMatrix.cautionNotice})`
          : '';
        const lifeNumNote = `수비 ${kb.numerology.lifePathNumber}${kb.numerology.lifePathIsMaster ? '(마스터)' : ''}`;
        const sephirahDetail = `${kb.numerology.lifePathSephirah.meaning}${'pillar' in kb.numerology.lifePathSephirah ? ` · ${kb.numerology.lifePathSephirah.pillar} · ${kb.numerology.lifePathSephirah.planet}` : ''}${kb.numerology.lifePathSephirah.description ? ` — ${kb.numerology.lifePathSephirah.description}` : ''}`;
        const lifeInterpNote = kb.numerology.lifePathInterpretation ? ` · 원전 해석(${kb.numerology.lifePathInterpretation})` : '';
        const personalityDetail = `${kb.numerology.personalitySephirah.name}(${kb.numerology.personalitySephirah.title} · ${kb.numerology.personalitySephirah.meaning})`;
        const sephiraNameOf = (num: number) => kb.tree?.sephiroth.find((s) => s.number === num)?.name || `세피라${num}`;
        const soulPathBridge = `${sephiraNameOf(kb.numerology.soulPath.from)}↔${sephiraNameOf(kb.numerology.soulPath.to)}`;
        const soulPathNote = `제${kb.numerology.soulPath.number}경로(${soulPathBridge} · ${kb.numerology.soulPath.hebrewLetter} ${kb.numerology.soulPath.letterName}[${kb.numerology.soulPath.letterMeaning}] · 타로 ${kb.numerology.soulPath.tarotNumber}번 ${kb.numerology.soulPath.tarotName} · ${kb.numerology.soulPath.attribution.value} — ${kb.numerology.soulPath.spiritualTheme})`;
        const questionNote = kb.reflectiveQuestion ? ` · 성찰 질문: "${kb.reflectiveQuestion}"` : '';
        kabbalahLine = `\n- 카발라 생명나무: 라이프 패스 세피라 ${kb.numerology.lifePathSephirah.name}(${lifeNumNote} · ${kb.numerology.lifePathSephirah.hebrew} · ${kb.numerology.lifePathSephirah.title} · ${sephirahDetail})${lifeInterpNote} · 퍼스널리티 세피라 ${personalityDetail} · 소울 패스 ${soulPathNote} · 지배 세계 ${worldNote} · 3기둥 밸런스(자비 ${describePillar(kb.numerology.pillarBalance.mercy)} / 엄격 ${describePillar(kb.numerology.pillarBalance.severity)} / 균형 ${describePillar(kb.numerology.pillarBalance.mildness)})${heartNote}${flashNote}${worldManifest}${seasonTone}${pathPractice}${ritualNote}${matrixNote}${focusNote}${questionNote}${boundaryNote}.`;
      }
    } catch (_) {}

    // 4. 타로 (78장 아르카나 수비학 소울·퍼스널리티·올해의 성장 카드 결정론 산법)
    let tarotLine = '';
    try {
      const tm = calculateTarotMaster({ profile, targetYear: kstYear, now: referenceDate });
      if (tm.status === 'calculated') {
        const elems = [
          ['불', tm.elementalBalance.fire],
          ['물', tm.elementalBalance.water],
          ['공기', tm.elementalBalance.air],
          ['흙', tm.elementalBalance.earth],
        ] as Array<[string, number]>;
        elems.sort((a, b) => b[1] - a[1]);
        const domElem = elems[0][0];
        const lackElem = elems[elems.length - 1][0];
        const timelineBrief = tm.timelineCards?.length
          ? ` · 3카드 흐름(${tm.timelineCards.map((c) => `${c.timeline.split(' ')[0]}:${c.card.name}`).join('→')})`
          : '';
        const pastCard = tm.timelineCards?.find((c) => c.timeline.startsWith('과거'));
        const presentCard = tm.timelineCards?.find((c) => c.timeline.startsWith('현재'));
        const futureCard = tm.timelineCards?.find((c) => c.timeline.startsWith('미래'));
        const pastInterpNote = pastCard?.interpretation ? ` · 과거 카드 통찰(${pastCard.interpretation})` : '';
        const presentInterpNote = presentCard?.interpretation
          ? ` · 현재 카드 통찰(${presentCard.interpretation})`
          : '';
        const futureInterpNote = futureCard?.interpretation ? ` · 미래 카드 통찰(${futureCard.interpretation})` : '';
        const suitNote = tm.suitManifestation
          ? ` · 실천 수트 [${tm.suitManifestation.suitName} · ${tm.suitManifestation.lifeDomain}](${tm.suitManifestation.actionProtocol} / ${tm.suitManifestation.dailyPractice})`
          : '';
        const sephiraNote = tm.sephiraMapping
          ? ` · 세피라 조응(${tm.sephiraMapping.soulSephira.sephiraName}[${tm.sephiraMapping.soulSephira.sephiraTitle} · ${tm.sephiraMapping.soulSephira.spiritualStage} · ${tm.sephiraMapping.soulSephira.divineAttribute}]↔${tm.sephiraMapping.personalitySephira.sephiraName}[${tm.sephiraMapping.personalitySephira.sephiraTitle} · ${tm.sephiraMapping.personalitySephira.spiritualStage} · ${tm.sephiraMapping.personalitySephira.divineAttribute}]${tm.sephiraMapping.soulSephira.pathworkingGuidance ? ` — 소울: ${tm.sephiraMapping.soulSephira.pathworkingGuidance}` : ''}${tm.sephiraMapping.personalitySephira.pathworkingGuidance ? ` / 페르소나: ${tm.sephiraMapping.personalitySephira.pathworkingGuidance}` : ''})`
          : '';
        const coreMsgNote = tm.soulCard.coreMessage
          ? ` · 핵심 메시지(소울: ${tm.soulCard.coreMessage}${tm.personalityCard.coreMessage ? ` / 페르소나: ${tm.personalityCard.coreMessage}` : ''}${tm.yearCard.coreMessage ? ` / 올해: ${tm.yearCard.coreMessage}` : ''})`
          : '';
        const polaritySummary = tm.cardPolarities?.length > 1
          ? ` · 3대 카드 방향(${tm.cardPolarities.map((p) => `${p.cardName.split(' ')[0]}:${p.isUpright ? '정' : '역'}`).join('·')})`
          : '';
        const polarityNote = tm.cardPolarities?.[0]
          ? ` · 극성 승화 [${tm.cardPolarities[0].cardName} ${tm.cardPolarities[0].isUpright ? '정방향' : '역방향'}]: ${tm.cardPolarities[0].transmutationAdvice} (그림자 경계: ${tm.cardPolarities[0].shadowWarning}${tm.cardPolarities.slice(1).map((p) => ` | ${p.cardName.split(' ')[0]} 경계: ${p.shadowWarning}`).join('')})`
          : '';
        const ritualNote = tm.ritualAction ? ` · 실천 의식: ${tm.ritualAction}` : '';
        const affirmNote = tm.masterAffirmation ? ` · 확언: "${tm.masterAffirmation}"` : '';
        const focusNote = tm.reflectionFocus ? ` · 성찰 초점: ${tm.reflectionFocus}` : '';
        const questionNote = tm.reflectiveQuestion ? ` · 성찰 질문: "${tm.reflectiveQuestion}"` : '';
        const boundaryNote = tm.interpretiveBoundary ? ` · 해석 경계: ${tm.interpretiveBoundary}` : '';
        const matrixNote = tm.tarotSynthesisMatrix
          ? ` · 타로 조율 [${tm.tarotSynthesisMatrix.alignmentState} / ${tm.tarotSynthesisMatrix.dominantTension}] → ${tm.tarotSynthesisMatrix.integratedAction}`
          : '';
        const domElemLabel = tm.elementalBalance.dominantElement ? ` · 지배 원소 기질: ${tm.elementalBalance.dominantElement}` : '';
        tarotLine = `\n- 타로 마스터 수비학: 소울 카드 ${tm.soulCard.name}(${tm.soulCard.keywords.slice(0, 2).join('·')}) · 퍼스널리티 카드 ${tm.personalityCard.name}(${tm.personalityCard.keywords.slice(0, 2).join('·')}) · ${tm.currentYear}년 성장 카드 ${tm.yearCard.name}(${tm.yearCard.keywords.slice(0, 2).join('·')})${timelineBrief}${pastInterpNote}${presentInterpNote}${futureInterpNote} · 4원소 흐름(우세 ${domElem} · 보완 ${lackElem}${domElemLabel})${coreMsgNote}${suitNote}${sephiraNote}${polaritySummary}${polarityNote}${ritualNote}${affirmNote}${matrixNote}${focusNote}${questionNote}${boundaryNote}.`;
      }
    } catch (_) {}

    // 5. 숙요 (27숙 본명숙 · 7대 숙격 · 4방신 · 삼구주기 · 칠요 수호성 결정론 산법)
    let sukuyoLine = '';
    try {
      const sk = calculateSukuyoAdvanced({ profile, now: referenceDate });
      if (sk.status === 'calculated' && sk.mansion) {
        const sanKyuNote = sk.sanKyuCycle
          ? ` · 삼구주기 [${sk.sanKyuCycle.cycleOrder}차 · ${sk.sanKyuCycle.nineMansionPhase} — ${sk.sanKyuCycle.phaseTheme}](${sk.sanKyuCycle.actionCompass})`
          : '';
        const guardNote = sk.planetaryGuard
          ? ` · 칠요 수호성 ${sk.planetaryGuard.dominantLuminary}(${sk.planetaryGuard.elementAffinity} · 길요일 ${sk.planetaryGuard.favorableWeekday} · ${sk.planetaryGuard.yearlyAdvice})`
          : '';
        const quadrantNote = sk.celestialQuadrant
          ? ` · 수호영수 ${sk.celestialQuadrant.guardianSpirit}(${sk.celestialQuadrant.degreesSpan} · ${sk.celestialQuadrant.elementAffinity} · ${sk.celestialQuadrant.seasonalWeight})`
          : '';
        const dynamicsNote = sk.selfDynamics ? ` · 숙격 역학(${sk.selfDynamics})` : '';
        const guideNote = sk.shukguk?.lifeGuide ? ` · 인생 기조: ${sk.shukguk.lifeGuide}` : '';
        const traitNote = sk.shukguk?.trait ? ` · 숙격 성향(${sk.shukguk.ko || sk.mansion.shukgukHanja}): ${sk.shukguk.trait}${sk.shukguk.members ? ` [동료 숙: ${sk.shukguk.members}]` : ''}` : '';
        const lunarNote = sk.lunarDate
          ? ` · 음력 ${sk.lunarDate.month}월 ${sk.lunarDate.day}일${sk.lunarDate.isLeapMonth ? '(윤)' : ''}${sk.solarDateString ? `(양력 ${sk.solarDateString})` : ''}`
          : '';
        const SUKUYO_MANSION_NAMES = ['각', '항', '저', '방', '심', '미', '기', '두', '여', '허', '위(危)', '실', '벽', '규', '루', '위(胃)', '묘', '필', '자', '삼', '정', '귀', '류', '성', '장', '익', '진'] as const;
        const mIdx = sk.mansion.index;
        const nearHarmonyNote = ` · 근거리 길숙(영:${SUKUYO_MANSION_NAMES[(mIdx + 1) % 27]}·안:${SUKUYO_MANSION_NAMES[(mIdx + 3) % 27]}·성:${SUKUYO_MANSION_NAMES[(mIdx + 5) % 27]}·우:${SUKUYO_MANSION_NAMES[(mIdx + 7) % 27]}·친:${SUKUYO_MANSION_NAMES[(mIdx + 8) % 27]})`;
        const ritualNote = sk.ritualAction ? ` · 개운 실천: ${sk.ritualAction}` : '';
        const focusNote = sk.reflectionFocus ? ` · 성찰 초점: ${sk.reflectionFocus}` : '';
        const questionNote = sk.reflectiveQuestion ? ` · 성찰 질문: "${sk.reflectiveQuestion}"` : '';
        const boundaryNote = sk.interpretiveBoundary ? ` · 해석 경계: ${sk.interpretiveBoundary}` : '';
        const matrixNote = sk.sukuyoSynthesisMatrix
          ? ` · 숙요 조율 [${sk.sukuyoSynthesisMatrix.alignmentState} / ${sk.sukuyoSynthesisMatrix.dominantTension}] → ${sk.sukuyoSynthesisMatrix.integratedAction}`
          : '';
        sukuyoLine = `\n- 숙요경(27숙): 본명숙 ${sk.mansion.fullName}[${sk.mansion.hanja} · 제${mIdx + 1}숙/27숙]${lunarNote}(${sk.mansion.animal} · 칠요 ${sk.mansion.luminary} · ${sk.mansion.element}행) · 숙격 ${sk.mansion.shukgukHanja}(${sk.mansion.shukgukTrait}) · 4방신 ${sk.mansion.group}${quadrantNote}${sanKyuNote}${guardNote}${nearHarmonyNote}${dynamicsNote}${traitNote}${guideNote}${ritualNote}${matrixNote}${focusNote}${questionNote}${boundaryNote}.`;
      }
    } catch (_) {}

    // 7. 베딕 점성술 (27 나크샤트라 · 빔쇼타리 다샤 · 켄드라-트리코나 · 푸루샤르타 결정론 산법)
    let vedicLine = '';
    try {
      const vd = calculateVedicAdvanced({ profile, targetDate: referenceDate, targetYear: kstYear });
      if (vd.status === 'calculated' && vd.nakshatra) {
        const lord = vd.currentDasha?.mahadasha.lord || vd.nakshatra.lord;
        const antar = vd.currentDasha?.antardasha?.lord;
        const sign = vd.rashi?.chandra.name || '미상';
        const chandraDetail = vd.rashi?.chandra
          ? `(${vd.rashi.chandra.hanja}·${vd.rashi.chandra.longitude.toFixed(1)}°)`
          : '';
        const sunSign = vd.rashi?.surya.name
          ? ` · 태양 라시 ${vd.rashi.surya.name}(${vd.rashi.surya.hanja}·${vd.rashi.surya.longitude.toFixed(1)}°)`
          : '';
        const lagnaSign = vd.rashi?.lagna?.name
          ? ` · 라그나 ${vd.rashi.lagna.name}(${vd.rashi.lagna.hanja}·${vd.rashi.lagna.longitude.toFixed(1)}°)`
          : '';
        const synergy = vd.dashaPlanetarySynergy ? ` · 행성 시너지 [${vd.dashaPlanetarySynergy.relationship}](${vd.dashaPlanetarySynergy.karmicFocus})` : '';
        const pillar = vd.kendraTrikonaProsperity
          ? ` · 핵심 하우스 축 [${vd.kendraTrikonaProsperity.dominantHousePillar}](${vd.kendraTrikonaProsperity.lifePillarAdvice})`
          : '';
        const puruPairs: Array<[string, number]> = vd.purusharthaAlignment
          ? [
              ['다르마(소명·도리)', vd.purusharthaAlignment.dharmaWeight],
              ['아르타(재물·성취)', vd.purusharthaAlignment.arthaWeight],
              ['카마(열정·관계)', vd.purusharthaAlignment.kamaWeight],
              ['모크샤(해탈·통찰)', vd.purusharthaAlignment.mokshaWeight],
            ]
          : [];
        const sortedPuru = [...puruPairs].sort((a, b) => b[1] - a[1]);
        const aim = vd.purusharthaAlignment?.primarySpiritualAim
          ? ` · 영적 지향: ${vd.purusharthaAlignment.primarySpiritualAim}${sortedPuru.length >= 2 ? ` (우세 ${sortedPuru[0][0]} · 보완 ${sortedPuru[sortedPuru.length - 1][0]})` : ''}`
          : '';
        const secondaryNote = vd.secondaryAxis ? ` · 보조 축: ${vd.secondaryAxis}` : '';
        const ritualNote = vd.ritualAction ? ` · 개운 실천: ${vd.ritualAction}` : '';
        const focusNote = vd.reflectionFocus ? ` · 성찰 초점: ${vd.reflectionFocus}` : '';
        const boundaryNote = vd.interpretiveBoundary ? ` · 해석 경계: ${vd.interpretiveBoundary}` : '';
        const matrixNote = vd.vedicSynthesisMatrix
          ? ` · 베딕 조율 [${vd.vedicSynthesisMatrix.alignmentState} / ${vd.vedicSynthesisMatrix.dominantTension}] → ${vd.vedicSynthesisMatrix.integratedAction}`
          : '';
        const nextMaha = vd.currentDasha && vd.mahadashas
          ? vd.mahadashas.find((m) => m.ordinal === vd.currentDasha!.mahadasha.ordinal + 1)
          : undefined;
        const nextMahaNote = nextMaha ? ` · 차기 대운 ${nextMaha.lord}(${nextMaha.startDate} 개시)` : '';
        const dashaEndNote = vd.currentDasha
          ? ` (만 ${vd.currentDasha.ageYears.toFixed(1)}세 기준 · 마하 ${vd.currentDasha.mahadasha.startDate}~${vd.currentDasha.mahadasha.endDate} · 안타르 ${vd.currentDasha.antardasha.startDate}~${vd.currentDasha.antardasha.endDate}${nextMahaNote})`
          : '';
        const balanceNote = vd.dashaBalance
          ? ` · 출생 잔여 대운 ${vd.dashaBalance.lord} ${vd.dashaBalance.years.toFixed(1)}년`
          : '';
        const padaLord = vd.nakshatra.padaLords?.[vd.nakshatra.pada - 1];
        const nakshatraDeityNote = ` · 주재신 ${vd.nakshatra.deity}(상징: ${vd.nakshatra.symbol} · 카스트: ${vd.nakshatra.caste} · 본질: ${vd.nakshatra.meaning})${padaLord ? ` · 나바암사 파다 주인 ${padaLord}` : ''}`;
        const ayanamsaNote = typeof vd.ayanamsa === 'number'
          ? ` · Lahiri 아야남샤 ${vd.ayanamsa.toFixed(2)}°${vd.birthInstant?.assumedNoon ? '(정오 기준)' : ''}`
          : '';
        const questionNote = vd.reflectiveQuestion ? ` · 성찰 질문: "${vd.reflectiveQuestion}"` : '';
        vedicLine = `\n- 베딕 조티시: 달 나크샤트라 ${vd.nakshatra.name}(${vd.nakshatra.sanskrit}) ${vd.nakshatra.pada}파다(지배성: ${vd.nakshatra.lord} · ${vd.nakshatra.gana} · ${vd.nakshatra.tattva})${nakshatraDeityNote}${ayanamsaNote} · 빔쇼타리 대운 ${lord} 마하다샤${antar ? `·${antar} 부대운` : ''}${dashaEndNote}${balanceNote} · 달 라시 ${sign}${chandraDetail}${sunSign}${lagnaSign}${synergy}${pillar}${aim}${secondaryNote}${ritualNote}${matrixNote}${focusNote}${questionNote}${boundaryNote}.`;
      }
    } catch (_) {}

    // 13. 토정비결 (이지함 상·중·하 3수 작괘 및 144괘문 · KST 당해 월운 수리 산법)
    let tojeongLine = '';
    try {
      const tj = calculateTojeong({ profile, targetYear: kstYear, now: referenceDate });
      if (tj.status === 'calculated') {
        const kstMonth = new Date(referenceDate.getTime() + 9 * 60 * 60 * 1000).getUTCMonth() + 1;
        const nextKstMonth = (kstMonth % 12) + 1;
        const currentMonthFortune = tj.monthlyFortunes?.find((m) => m.month === kstMonth);
        const nextMonthFortune = tj.monthlyFortunes?.find((m) => m.month === nextKstMonth);
        const monthPart = currentMonthFortune
          ? ` · ${kstMonth}월 운세: "${currentMonthFortune.fortune}" (처방: ${currentMonthFortune.tip})${nextMonthFortune ? ` · 다음 달(${nextKstMonth}월) 예고: "${nextMonthFortune.fortune}" (처방: ${nextMonthFortune.tip})` : ''}`
          : '';
        let restSeasonLabel = '';
        if (tj.trigramAnalysis?.seasonalFlow) {
          const sf = tj.trigramAnalysis.seasonalFlow;
          const seasons: Array<[string, number]> = [
            ['봄(1~3월)', sf.springScore],
            ['여름(4~6월)', sf.summerScore],
            ['가을(7~9월)', sf.autumnScore],
            ['겨울(10~12월)', sf.winterScore],
          ];
          seasons.sort((a, b) => a[1] - b[1]);
          restSeasonLabel = ` · 추진 호기 ${seasons[3][0]}·${seasons[2][0]} / 숨 고를 계절 ${seasons[0][0]}`;
        }
        const trigramNote = tj.trigramAnalysis
          ? ` · 상하괘 오행 [${tj.trigramAnalysis.upperElement}/${tj.trigramAnalysis.lowerElement} · ${tj.trigramAnalysis.elementRelation}(${tj.trigramAnalysis.elementRelationDesc}) · 최성 ${tj.trigramAnalysis.seasonalFlow.peakSeason}${restSeasonLabel}](${tj.trigramAnalysis.hexagramEssenceAdvice})`
          : '';
        const ritualNote = tj.ritualAction ? ` · 개운 실천: ${tj.ritualAction}` : '';
        const matrixAction = tj.tojeongSynthesisMatrix
          ? ` · 괘 조율 [${tj.tojeongSynthesisMatrix.alignmentState} / ${tj.tojeongSynthesisMatrix.dominantTension}] → ${tj.tojeongSynthesisMatrix.integratedAction}`
          : '';
        const lunarNote = `음력 ${tj.lunarBirth.year}.${tj.lunarBirth.month}.${tj.lunarBirth.day}${tj.lunarBirth.isLeapMonth ? '(윤)' : ''}(${tj.birthMonthLength}일월) · ${tj.birthMonthGanZhi}월/${tj.birthdayGanZhi}일 · 세수 ${tj.ageKorean}세 · 원수(태세${tj.taeseCount}/월건${tj.wolgeonCount}/일진${tj.iljinCount})`;
        const focusNote = tj.reflectionFocus ? ` · 성찰 초점: ${tj.reflectionFocus}` : '';
        const questionNote = tj.reflectiveQuestion ? ` · 성찰 질문: "${tj.reflectiveQuestion}"` : '';
        const boundaryNote = tj.interpretiveBoundary ? ` · 해석 경계: ${tj.interpretiveBoundary}` : '';
        tojeongLine = `\n- 토정비결: ${tj.targetYear}년(${tj.targetYearGanZhi} · ${lunarNote}) 제${tj.hexagramCode}괘(${tj.hexagramName} · ${tj.upperTrigram}상/${tj.lowerTrigram}하 · ${tj.movingLineLabel} · ${tj.luckGrade}) · 3수(상${tj.upperGua}·중${tj.middleGua}·하${tj.lowerGua}) · 연간 총론: "${tj.annualSummary}"${monthPart}${trigramNote}${ritualNote}${matrixAction}${focusNote}${questionNote}${boundaryNote}.`;
      }
    } catch (_) {}

    // 15. 태을신수 (16궁 연국 적년 · 72국 · 주객 승부 · 오복길성 수리 산법)
    let taiyiLine = '';
    try {
      const ty = calculateTaiyi({ profile, targetYear: kstYear, targetDate: referenceDate });
      if (ty.status === 'calculated' && ty.calculation) {
        const c = ty.calculation;
        const taiyiPalaceDetail = ty.palaces?.find((p) => p.palaceNumber === c.taiyiPalace);
        const taiyiPalaceMeta = taiyiPalaceDetail
          ? `(${taiyiPalaceDetail.direction}·${taiyiPalaceDetail.element}${taiyiPalaceDetail.stars.length > 0 ? `·동좌 ${taiyiPalaceDetail.stars.join('/')}` : ''})`
          : '';
        const wenChangDetailObj = ty.palaces?.find((p) => p.palaceNumber === c.wenChangPalace);
        const shiJiDetailObj = ty.palaces?.find((p) => p.palaceNumber === c.shiJiPalace);
        const wenChangMeta = wenChangDetailObj ? `(${wenChangDetailObj.direction}·${wenChangDetailObj.element})` : '';
        const shiJiMeta = shiJiDetailObj ? `(${shiJiDetailObj.direction}·${shiJiDetailObj.element})` : '';
        const juGenPalace = ty.palaces?.find((p) => p.palaceNumber === c.juGeneralPalace)?.name || `${c.juGeneralPalace}`;
        const gaekGenPalace = ty.palaces?.find((p) => p.palaceNumber === c.gaekGeneralPalace)?.name || `${c.gaekGeneralPalace}`;
        const fiveBless = ty.fiveBlessings ? ` · 오복길성 [${ty.fiveBlessings.palaceName}궁 · ${ty.fiveBlessings.meaning}]` : '';
        const threeGiNote = ty.threeGi
          ? ` · 삼기(군[${ty.threeGi.gunGi.palaceName}·${ty.threeGi.gunGi.rating}]: ${ty.threeGi.gunGi.desc} / 신[${ty.threeGi.sinGi.palaceName}·${ty.threeGi.sinGi.rating}]: ${ty.threeGi.sinGi.desc} / 민[${ty.threeGi.minGi.palaceName}·${ty.threeGi.minGi.rating}]: ${ty.threeGi.minGi.desc})`
          : '';
        const macroNote = ty.macroStrategicMatrix
          ? ` · 대세 국면 [${ty.macroStrategicMatrix.macroPhase}: ${ty.macroStrategicMatrix.phaseDescription}](${ty.macroStrategicMatrix.tacticalWindowAdvice})`
          : '';
        const matrixAction = ty.taiyiSynthesisMatrix
          ? ` · 국 조율 [${ty.taiyiSynthesisMatrix.alignmentState} / ${ty.taiyiSynthesisMatrix.dominantTension}] → ${ty.taiyiSynthesisMatrix.integratedAction}`
          : '';
        const ritualNote = ty.ritualAction ? ` · 연국 의례: ${ty.ritualAction}` : '';
        const focusNote = ty.reflectionFocus ? ` · 성찰 초점: ${ty.reflectionFocus}` : '';
        const questionNote = ty.reflectiveQuestion ? ` · 성찰 질문: "${ty.reflectiveQuestion}"` : '';
        const boundaryNote = ty.interpretiveBoundary ? ` · 해석 경계: ${ty.interpretiveBoundary}` : '';
        const sanTypeNote = ` · 수리 장단(주산 ${c.juSan}[${c.juSanType}] / 객산 ${c.gaekSan}[${c.gaekSanType}] · 주대장 ${juGenPalace}궁/객대장 ${gaekGenPalace}궁)`;
        taiyiLine = `\n- 태을신수: ${ty.targetYear}년(${ty.targetYearGanZhi}) 적년 ${c.accumulatedYears}년(제${c.cycleNumber}원 ${c.cycleName} · ${c.juType} 제${c.juNumber}국) · 16궁 태을 재궁 [${c.taiyiPalaceName}${taiyiPalaceMeta}] · 문창(주) ${c.wenChangPalaceName}궁${wenChangMeta} / 시격(객) ${c.shiJiPalaceName}궁${shiJiMeta} · 주객 판정 [${c.outcome} — ${c.outcomeReason}]${sanTypeNote}${fiveBless}${threeGiNote}${macroNote}${matrixAction}${ritualNote}${focusNote}${questionNote}${boundaryNote} · 시대 대세: "${ty.macroActionStrategy}".`;
      }
    } catch (_) {}

    // 9. 홍국기문 (조선 정통 4주 9궁 세효·응효·중궁·천지반 공명·삼기·삼형·통기·8문 결정론 산법)
    let qimenLine = '';
    try {
      const hq = calculateHonggukQimen({ profile, targetYear: kstYear });
      if (hq.status === 'calculated' && hq.keyPoints && hq.samhyeong && hq.tonggi && hq.eightGatesVerdict) {
        const se = hq.keyPoints.seYao;
        const eung = hq.keyPoints.eungYao;
        const jg = hq.keyPoints.jungGung;
        const gate = se.gate || hq.eightGatesVerdict.seYaoGate || '중궁기궁';
        const riskTone = hq.samhyeong.riskIndex >= 70 ? '고위험 주의' : hq.samhyeong.riskIndex >= 35 ? '중간 유의' : '안정';
        const tonggiTone = hq.tonggi.score >= 80 ? '완숙 유통' : hq.tonggi.score >= 40 ? '부분 유통' : '정체 보완 필요';
        const pillarsNote = hq.fourPillars
          ? ` · 포국 원국 [${hq.fourPillars.year}·${hq.fourPillars.month}·${hq.fourPillars.day}${hq.fourPillars.hour ? `·${hq.fourPillars.hour}` : '(시주 미상)'}]`
          : '';
        const resonance = hq.heavenEarthResonance?.seYaoResonance
          ? ` · 천지반 공명 [${hq.heavenEarthResonance.seYaoResonance.relation}](${hq.heavenEarthResonance.seYaoResonance.interpretation} / ${hq.heavenEarthResonance.overallBalance})`
          : '';
        const wonders = hq.threeWondersAlliance?.wondersDetected?.length
          ? ` · 삼기 회합 [${hq.threeWondersAlliance.wondersDetected.join('·')}](${hq.threeWondersAlliance.nobleSponsorship})`
          : '';
        const seasonWin = hq.tacticalSeasonWindows?.peakActionSeason
          ? ` · 결단/수성 계절 [${hq.tacticalSeasonWindows.peakActionSeason} 추진 / ${hq.tacticalSeasonWindows.defensiveSeason} 수성 — ${hq.tacticalSeasonWindows.strategicPacingAdvice}]`
          : '';
        const sePalaceObj = hq.palaces?.find((p) => p.palace === se.palace);
        const seDirection = sePalaceObj?.direction;
        const seNumNote = sePalaceObj ? `·천${sePalaceObj.heavenStarNumber}/지${sePalaceObj.earthStarNumber}` : '';
        const dirInfo = seDirection ? ` · 방위 ${seDirection}` : '';
        const relSummary = hq.keyPointRelations?.length
          ? ` · 3궁 관계 [${hq.keyPointRelations.map((r) => `${r.from}→${r.to}:${r.relation}`).join(' / ')}]`
          : '';
        const centerNumNote = typeof hq.earthCenterNumber === 'number' && typeof hq.heavenCenterNumber === 'number'
          ? `(지반수 ${hq.earthCenterNumber} · 천반수 ${hq.heavenCenterNumber})`
          : '';
        const missingCyclesNote = hq.tonggi.missingCycles?.length
          ? `(보완 순환: ${hq.tonggi.missingCycles.slice(0, 2).join('·')})`
          : '';
        const keyPointNotes = ` · 거점 요해(세효: ${se.note} / 응효: ${eung.note} / 중궁: ${jg.note})`;
        const samhyeongDetailNote = hq.samhyeong.note ? ` [${hq.samhyeong.note}]` : '';
        const tonggiDetailNote = hq.tonggi.note ? ` [${hq.tonggi.note}]` : '';
        const deukMunLabel = hq.eightGatesVerdict.deukMun ? '득문' : '비득문';
        const gateVerdict = hq.eightGatesVerdict.pattern
          ? ` · 8문 격국 [${hq.eightGatesVerdict.pattern}](${hq.eightGatesVerdict.advice})`
          : '';
        const seasonTone = hq.temporalHonggukRhythm
          ? ` · 궁 순시창 [${hq.temporalHonggukRhythm.palaceWatchWindow} · ${hq.temporalHonggukRhythm.seasonalQimenTone}](${hq.temporalHonggukRhythm.temporalGuidance})`
          : '';
        const tacticalNote = hq.situationalHonggukAudit?.tacticalStep
          ? ` · 전술 스텝(${hq.situationalHonggukAudit.focusTheme}): ${hq.situationalHonggukAudit.tacticalStep}${hq.situationalHonggukAudit.gateNote ? ` (${hq.situationalHonggukAudit.gateNote})` : ''}`
          : '';
        const ritualNote = hq.ritualAction ? ` · 기문 의례: ${hq.ritualAction}` : '';
        const focusNote = hq.reflectionFocus ? ` · 성찰 초점: ${hq.reflectionFocus}` : '';
        const boundaryNote = hq.interpretiveBoundary ? ` · 해석 경계: ${hq.interpretiveBoundary}` : '';
        const matrixNote = hq.honggukSynthesisMatrix
          ? ` · 기문 처신(${hq.honggukSynthesisMatrix.coreInsight}): ${hq.honggukSynthesisMatrix.recommendedAction} (유의: ${hq.honggukSynthesisMatrix.cautionNotice})`
          : '';
        const questionNote = hq.reflectiveQuestion ? ` · 성찰 질문: "${hq.reflectiveQuestion}"` : '';
        qimenLine = `\n- 홍국기문(4주 9궁):${pillarsNote} 세효 [${se.palaceName}](${se.element}·${se.star}${seNumNote}${dirInfo}) · 응효 [${eung.palaceName}](${eung.element}·${eung.star}) · 중궁 [${jg.palaceName}](${jg.element}${centerNumNote}) · 세효 8문 ${gate}(${se.gateCategory}·${deukMunLabel})${gateVerdict}${relSummary}${keyPointNotes}${resonance}${wonders} · 삼형살 ${hq.samhyeong.formed ? `${hq.samhyeong.type || '삼형'} 성립` : hq.samhyeong.partial ? '부분형' : '미성립'}(파극 위험 ${riskTone})${samhyeongDetailNote} · 5행 통기 ${tonggiTone}${missingCyclesNote}${tonggiDetailNote}${seasonWin}${seasonTone}${tacticalNote}${ritualNote}${matrixNote}${focusNote}${questionNote}${boundaryNote}.`;
      }
    } catch (_) {}

    // 3. 자미두수 유년 사화 (12궁 명반 4대 사화 록·권·과·기 · 삼방사정 · 록기교충 결정론 산법)
    let ziweiLine = '';
    try {
      const zw = calculateZiweiFlyingStars({ profile, targetYear: kstYear });
      if (zw && zw.sanFangSiZhengBalance && zw.luJiConflictDynamics) {
        const palBranchNote = zw.natalChartSummary?.soulPalaceBranch && zw.natalChartSummary?.bodyPalaceBranch
          ? ` · 명궁 ${zw.natalChartSummary.soulPalaceBranch}/신궁 ${zw.natalChartSummary.bodyPalaceBranch}`
          : '';
        const dayElNote = zw.natalChartSummary?.myDayMasterElement ? ` · 본명 ${zw.natalChartSummary.myDayMasterElement}` : '';
        const classNote = zw.natalChartSummary?.fiveElementsClass ? ` · ${zw.natalChartSummary.fiveElementsClass}${dayElNote}${palBranchNote}` : `${dayElNote}${palBranchNote}`;
        const yearLabel = zw.yearGanZhiKr ? `${kstYear}년 ${zw.yearGanZhiKr}` : `${kstYear}년`;
        const coreAdvice = zw.sanFangSiZhengBalance.coreDynamicsAdvice ? ` · 삼방 조언: ${zw.sanFangSiZhengBalance.coreDynamicsAdvice}` : '';
        const sanFangMapNote = zw.sanFangSiZhengBalance.sanFangPalaces?.length
          ? ` · 삼방사정[${zw.sanFangSiZhengBalance.sanFangPalaces.join('·')} / 대궁 ${zw.sanFangSiZhengBalance.siZhengOppositePalace}${zw.sanFangSiZhengBalance.mutagensInCorePalaces?.length ? ` · 핵심축 집결: ${zw.sanFangSiZhengBalance.mutagensInCorePalaces.map((m) => m.mutagen.split('(')[0]).join('·')}` : ''}]`
          : '';
        const defenseNote = zw.luJiConflictDynamics.wealthPreservationAdvice
          ? ` · 록기 처신[${zw.luJiConflictDynamics.conflictSeverity}]: ${zw.luJiConflictDynamics.wealthPreservationAdvice}${zw.luJiConflictDynamics.defenseLine ? ` (방어선: ${zw.luJiConflictDynamics.defenseLine})` : ''}`
          : '';
        const mutagenActionNote = zw.mutagens.lu.actionStrategy && zw.mutagens.ji.actionStrategy
          ? ` · 사화 전략(화록: ${zw.mutagens.lu.actionStrategy} / 화권: ${zw.mutagens.quan.actionStrategy} / 화과: ${zw.mutagens.ke.actionStrategy} / 화기: ${zw.mutagens.ji.actionStrategy})`
          : '';
        const oppositeNote = ` · 록기 대궁(화록 대궁 ${zw.mutagens.lu.oppositePalaceName} · 화기 대궁 ${zw.mutagens.ji.oppositePalaceName})`;
        const axesNote = zw.yearlyStrategy?.wealthAndCareerAxis || zw.yearlyStrategy?.relationshipAndHealthAxis
          ? ` · 재물/커리어: ${zw.yearlyStrategy.wealthAndCareerAxis} · 관계/건강: ${zw.yearlyStrategy.relationshipAndHealthAxis}`
          : '';
        const strategyNote = zw.yearlyStrategy ? ` · 유년 기조[${zw.yearlyStrategy.overallTheme} · 기회: ${zw.yearlyStrategy.keyOpportunity} · 주의: ${zw.yearlyStrategy.keyVulnerability}${axesNote}](${zw.yearlyStrategy.strategicVerdict})` : '';
        const matrixAction = zw.ziweiFlyingSynthesisMatrix
          ? ` · 사화 조율 [${zw.ziweiFlyingSynthesisMatrix.alignmentState} / ${zw.ziweiFlyingSynthesisMatrix.dominantTension}] → ${zw.ziweiFlyingSynthesisMatrix.integratedAction}`
          : '';
        const kstQIdx = Math.floor(new Date(referenceDate.getTime() + 9 * 3600000).getUTCMonth() / 3);
        const qPacing = zw.quarterlyPacing?.[kstQIdx];
        const quarterNote = qPacing ? ` · 분기 사화 [${qPacing.quarter} · ${qPacing.activeMutagen} — ${qPacing.pacingTheme}](${qPacing.tacticalFocus})` : '';
        const secAxisNote = zw.secondaryMutagenAxis ? ` · 보조 축: ${zw.secondaryMutagenAxis}` : '';
        const ritualNote = zw.ritualAction ? ` · 유년 의례: ${zw.ritualAction}` : '';
        const focusNote = zw.reflectionFocus ? ` · 성찰 초점: ${zw.reflectionFocus}` : '';
        const questionNote = zw.reflectiveQuestion ? ` · 성찰 질문: "${zw.reflectiveQuestion}"` : '';
        const boundaryNote = zw.interpretiveBoundary ? ` · 해석 경계: ${zw.interpretiveBoundary}` : '';
        ziweiLine = `\n- 자미두수 유년 사화: 명궁 [${zw.sanFangSiZhengBalance.myMingPalaceName}](${yearLabel}${classNote}) · 삼방사정 국면 [${zw.sanFangSiZhengBalance.patternGrade}]${sanFangMapNote} · 록기 역학 [${zw.luJiConflictDynamics.relationType}](화록 ${zw.mutagens.lu.starName}→${zw.luJiConflictDynamics.luPalaceName} · 화권 ${zw.mutagens.quan.starName}→${zw.mutagens.quan.targetPalaceName} · 화과 ${zw.mutagens.ke.starName}→${zw.mutagens.ke.targetPalaceName} · 화기 ${zw.mutagens.ji.starName}→${zw.luJiConflictDynamics.jiPalaceName})${oppositeNote}${coreAdvice}${defenseNote}${mutagenActionNote}${strategyNote}${matrixAction}${quarterNote}${secAxisNote}${ritualNote}${focusNote}${questionNote}${boundaryNote}.`;
      }
    } catch (_) {}

    // 8. 대육임 (천지반 월장·사과 생극·삼전 전개 템포·12천장 결정론 산법)
    let liurenLine = '';
    try {
      const lr = calculateLiurenMaster(referenceDate);
      if (lr.status === 'calculated') {
        const trans = lr.threeTransmissions.map(t => `${t.stage}:${t.branch}(${t.general}·${t.timelineRole})`).join('→');
        const transMeaningNote = lr.threeTransmissions.length >= 3
          ? ` · 삼전 요해(초전: ${lr.threeTransmissions[0].meaning} / 말전: ${lr.threeTransmissions[2].meaning})`
          : '';
        const harmonyTone = lr.interpersonalDynamic.fourLessonsHarmonyScore >= 85
          ? '높은 상생 조화'
          : lr.interpersonalDynamic.fourLessonsHarmonyScore >= 65
            ? '무난한 균형'
            : '조율 필요';
        const lessonDyn = ` · 사과 생극 [${lr.interpersonalDynamic.relationType} · ${lr.interpersonalDynamic.subjectUpper}(${lr.interpersonalDynamic.subjectElement})⇄${lr.interpersonalDynamic.environmentUpper}(${lr.interpersonalDynamic.environmentElement}) · ${harmonyTone} — ${lr.interpersonalDynamic.relationMeaning}]`;
        const tempoInfo = ` · 전개 템포 [${lr.transmissionDynamics.tempo}](${lr.transmissionDynamics.flowMeaning}) · 돌파 전략: ${lr.transmissionDynamics.breakthroughStrategy}`;
        const temporalNote = lr.temporalLiurenRhythm
          ? ` · 시지 순시창 [${lr.temporalLiurenRhythm.hourWatchWindow} · ${lr.temporalLiurenRhythm.seasonalLiurenTone}](${lr.temporalLiurenRhythm.temporalGuidance})`
          : '';
        const nextMoveNote = lr.situationalLiurenAudit?.nextMove
          ? ` · 다음 수(${lr.situationalLiurenAudit.focusTheme}): ${lr.situationalLiurenAudit.nextMove}${lr.situationalLiurenAudit.lessonNote ? ` (${lr.situationalLiurenAudit.lessonNote})` : ''}`
          : '';
        const timingNote = lr.actionProtocols?.timingAdvice
          ? ` · 타이밍 조언: ${lr.actionProtocols.timingAdvice}`
          : '';
        const ritualNote = lr.ritualAction ? ` · 개운 실천: ${lr.ritualAction}` : '';
        const focusNote = lr.reflectionFocus ? ` · 성찰 초점: ${lr.reflectionFocus}` : '';
        const boundaryNote = lr.interpretiveBoundary ? ` · 해석 경계: ${lr.interpretiveBoundary}` : '';
        const matrixNote = lr.liurenSynthesisMatrix
          ? ` · 육임 처신(${lr.liurenSynthesisMatrix.coreInsight}): ${lr.liurenSynthesisMatrix.recommendedAction} (유의: ${lr.liurenSynthesisMatrix.cautionNotice})`
          : '';
        const yangLessons = lr.fourLessons?.[0] && lr.fourLessons?.[2]
          ? ` · 양신 구도(주체 제1과 ${lr.fourLessons[0].upper}/${lr.fourLessons[0].lower}·${lr.fourLessons[0].meaning} / 환경 제3과 ${lr.fourLessons[2].upper}/${lr.fourLessons[2].lower}·${lr.fourLessons[2].meaning})`
          : '';
        const yinLessons = lr.fourLessons?.[1] && lr.fourLessons?.[3]
          ? ` · 음신 흐름(내면 제2과 ${lr.fourLessons[1].upper}/${lr.fourLessons[1].lower} · 상대 의도 제4과 ${lr.fourLessons[3].upper}/${lr.fourLessons[3].lower})`
          : '';
        const protocolNote = lr.actionProtocols?.relationshipAdvice && lr.actionProtocols?.strategicCaution
          ? ` · 관계 전략: ${lr.actionProtocols.relationshipAdvice} · 핵심 주의: ${lr.actionProtocols.strategicCaution}`
          : '';
        const questionNote = lr.reflectiveQuestion ? ` · 성찰 질문: "${lr.reflectiveQuestion}"` : '';
        liurenLine = `\n- 대육임(12천장·삼전): ${lr.dayStemBranch}일 ${lr.hourBranch}시(${lr.monthGeneral} 월장) · 과격 [${lr.patternName}(${lr.patternHanja})](${lr.patternGuidance}) · 국면 [${lr.decisionGrade}] · 삼전(${trans})${transMeaningNote} · 주천장 ${lr.primaryGeneral.name}(${lr.primaryGeneral.nature} · ${lr.primaryGeneral.attribute} — ${lr.primaryGeneral.advice})${lessonDyn}${yangLessons}${yinLessons}${tempoInfo}${temporalNote}${nextMoveNote}${timingNote}${protocolNote}${ritualNote}${matrixNote}${focusNote}${questionNote}${boundaryNote}.`;
      }
    } catch (_) {}

    // 11. 주역 (64괘 본·지·호·착·종 4대 대칭 괘상 · 체용 생극 · 동효 국면 · 경방 8궁 세응 결정론 산법)
    let ichingLine = '';
    try {
      const ic = calculateIchingMaster(referenceDate);
      if (ic.status === 'calculated') {
        const dyn = ic.hexagramDynamics;
        const dynNote = dyn ? ` · 동효 국면 [${dyn.phaseShift} / ${dyn.movingEntropy}] · 전반(${dyn.strategicWindow.firstHalf})→후반(${dyn.strategicWindow.secondHalf})` : '';
        const coopNote = ic.palGongSeYing.cooperationAdvice ? ` · 세응 처신: ${ic.palGongSeYing.cooperationAdvice}` : '';
        const seasonTone = ic.temporalIchingRhythm?.seasonalIchingTone ? ` · 계절 괘조 [${ic.temporalIchingRhythm.divinationWatchWindow} · ${ic.temporalIchingRhythm.seasonalIchingTone}](${ic.temporalIchingRhythm.temporalGuidance})` : '';
        const hiddenNote = ic.guidance?.hiddenDynamic ? ` · 호괘 내면(${ic.guidance.hiddenDynamic})` : '';
        const protocolNote = ic.guidance?.actionProtocol ? ` · 실천 방침(${ic.situationalIchingAudit?.focusTheme || '핵심'}): ${ic.guidance.actionProtocol}` : '';
        const ritualNote = ic.ritualAction ? ` · 개운 의식: ${ic.ritualAction}` : '';
        const focusNote = ic.reflectionFocus ? ` · 성찰 초점: ${ic.reflectionFocus}` : '';
        const boundaryNote = ic.interpretiveBoundary ? ` · 해석 경계: ${ic.interpretiveBoundary}` : '';
        const matrixNote = ic.ichingSynthesisMatrix ? ` · 주역 처신(${ic.ichingSynthesisMatrix.coreInsight} → ${ic.ichingSynthesisMatrix.recommendedAction} · 유의: ${ic.ichingSynthesisMatrix.cautionNotice})` : '';
        const movingNote = ic.movingLines?.length ? ` · 동효 [${ic.movingLines.join('·')}효]` : ' · 무동효(靜卦)';
        const situationNote = ic.guidance?.situationNow ? ` · 본괘 국면(${ic.guidance.situationNow})` : '';
        const hexNote = ic.situationalIchingAudit?.hexagramNote ? ` · 괘상 요해(${ic.situationalIchingAudit.hexagramNote})` : '';
        const actionStepNote = ic.situationalIchingAudit?.actionStep ? ` · 당면 실행 스텝(${ic.situationalIchingAudit.actionStep})` : '';
        const outcomeNote = ic.guidance?.outcomeFuture ? ` · 지괘 귀결(${ic.guidance.outcomeFuture})` : '';
        const counterpartNote = ic.guidance?.counterpartView ? ` · 종괘 시선(${ic.guidance.counterpartView})` : '';
        const questionNote = ic.reflectiveQuestion ? ` · 성찰 질문: "${ic.reflectiveQuestion}"` : '';
        ichingLine = `\n- 주역(64괘): 본괘 [${ic.primary.name}(${ic.primary.upper}/${ic.primary.lower} · ${ic.primary.meaning})] → 지괘 [${ic.changed.name}(${ic.changed.meaning})]${movingNote} · 호괘 [${ic.nuclear.name}] · 착괘 [${ic.opposite.name}] · 종괘 [${ic.reversed.name}] · 체용관계 ${ic.tiYong.relationship}(체 ${ic.tiYong.tiGua}[${ic.tiYong.tiElement}]/용 ${ic.tiYong.yongGua}[${ic.tiYong.yongElement}] — ${ic.tiYong.summary}) · 주효 [${ic.dominantStage.yaoName} · ${ic.dominantStage.lifeStage} · ${ic.dominantStage.archetypeRole} — ${ic.dominantStage.actionGuidance}] · 경방 ${ic.palGongSeYing.palaceName}[${ic.palGongSeYing.palaceElement} · ${ic.palGongSeYing.guaType}](세 ${ic.palGongSeYing.seYao}효⇄응 ${ic.palGongSeYing.yingYao}효 · ${ic.palGongSeYing.seYingHarmony})${dynNote}${coopNote}${seasonTone}${situationNote}${hexNote}${actionStepNote}${hiddenNote}${outcomeNote}${counterpartNote}${protocolNote}${ritualNote}${matrixNote}${focusNote}${questionNote}${boundaryNote} · 결단 기조 [${ic.decisionGrade}].`;
      }
    } catch (_) {}

    return `[개인화 계산 입력] ${solarDateString} 양력${isLunar ? ' (음력·윤달 설정 환산)' : ''}${time ? ` ${profile.basic.birthtime}` : ' · 생시 미입력'}
- 사주명리: ${sajuBrief}. 자미두수·토정비결의 계산을 대신하지 않음.
- 서양 점성술: ${buildUserNatalSummary(profile)}
${buildAdditionalBirthDigest(profile)}
${mahaboteLine}
${thaiLine}
${kyuseiLine}${kabbalahLine}${tarotLine}${sukuyoLine}${vedicLine}${tojeongLine}${taiyiLine}${qimenLine}${ziweiLine}${liurenLine}${ichingLine}
- 일반 기문(차보법): 프로필 계산실 또는 이번 채팅 엔진에서 실제 산출한 결과가 제공된 경우만 해석. 현재 대화에 결과가 없으면 임의 포국·작괘 금지.`;
  } catch {
    return '[개인화 계산 중단] 생년월일·생시·양음력·윤달 입력을 확인해야 합니다. 잘못된 날짜를 다른 날짜로 자동 보정하거나 개인 차트를 생성하지 말 것.';
  }
}

export interface SelectedDivinationToolsResult {
  selectedTools: DivinationToolSpec[];
  firedEngineBadges?: string[];
  calculationAudit?: CalculationAuditItem[];
  /** 도구별 실제 계산 결과 (점술모드 3단계 테이블이 핵심 값만 뽑아 쓴다). */
  engineTools?: Record<string, { status: string; data?: unknown }>;
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
  const report = runDeterministicEngine({ profile, question: questionText, forceAllTools: true, coreOnly: true, reviewAll: true });
  return buildDivinationCapabilityPrompt(Object.keys(FIFTEEN_DIVINATION_TOOLS) as DivinationToolId[]) + '\n독립된 계산 결과가 없는 도구들끼리 일치했다고 주장하지 마.\n' + formatDeterministicEnginePrompt(report, { isMasterMobilization: true });
}

/**
 * 사용자의 질문과 활성화된 7대 테마(channels)를 분석해 질문에 맞는 도구를 선별합니다.
 * 기본+심층 정책은 선택 실행이며, 명시적 올인원/종합 요청에서만 카탈로그 전체를 동원합니다.
 */
export function selectOptimalDivinationTools(
  userText: string,
  activeChannels: SevenThemeChannel[] = [],
  profile?: UserProfile,
  isMasterMode?: boolean,
  policy: { allowMaster?: boolean; requireBasicAndDeep?: boolean; divinationMode?: { base: 'saju' | 'tarot_saju'; deep?: boolean; depth?: 1 | 2 | 3 }; pinnedTools?: DivinationToolId[]; pinnedDeepKeys?: string[] } = {}
): SelectedDivinationToolsResult {
  const clean = (userText || '').trim();
  const lower = clean.toLowerCase();

  const isExplicitMasterRequest = policy.allowMaster !== false && (
    /마스터\s*모드|올인원|15개\s*도구|15대\s*도구|15가지\s*도구|총동원|전부\s*비교|종합\s*비교|전체\s*진단/.test(lower)
  );

  const isMasterDetected = policy.allowMaster !== false && (
    Boolean(isMasterMode) || isExplicitMasterRequest || activeChannels.length === 7
  );
  const requireBasicAndDeep = isMasterDetected || policy.requireBasicAndDeep === true;

  // Honor named traditions before inferring a topic. Qualified astrology names
  // must not accidentally match the generic Western astrology keyword.
  const westernText = lower.replace(/숙요\s*점성술|베딕\s*점성술|인도\s*점성술|태국\s*점성술|타이\s*점성술|미얀마\s*점성술|요일\s*점성술|vedic\s+astrology|thai\s+astrology/gi, '');
  const explicitTools = Object.values(FIFTEEN_DIVINATION_TOOLS)
    .filter(tool => tool.explicitRegex.test(tool.id === 'astrology' ? westernText : lower)
      || (tool.id === 'vedic' && /vedic\s+astrology/i.test(lower))
      || (tool.id === 'thai_astrology' && /thai\s+astrology/i.test(lower)))
    .map(tool => tool.id).slice(0, 3);

  // 🧭 스마트 에이전트 라우터 가동: 질문 의도 분석 및 최적 도구 선별 & 수리 엔진 실행
  const routed = routeAndExecute({
    text: clean,
    profile,
    isMasterRequested: isMasterDetected,
    requireBasicAndDeep: policy.requireBasicAndDeep,
    allowMaster: policy.allowMaster,
    targetTools: explicitTools.length ? explicitTools : undefined,
    divinationMode: policy.divinationMode,
    pinnedTools: policy.pinnedTools,
    pinnedDeepKeys: policy.pinnedDeepKeys,
  });

  // 0. Casual routing is available only when the caller does not require basic + deep coverage.
  if (routed.routePlan.isCasual && !requireBasicAndDeep) {
    return {
      selectedTools: [],
      isCasualMessage: true,
      isMasterMobilization: false,
      selectionReason: '가벼운 일상 인사',
      promptInjection: ''
    };
  }

  // 1. 올인원 종합 마스터 모드 풀가동 (명시적 종합/올인원 요청 시)
  if (isExplicitMasterRequest || routed.routePlan.isMasterMobilization) {
    const allTools = Object.values(FIFTEEN_DIVINATION_TOOLS);
    return {
      selectedTools: allTools,
      firedEngineBadges: getFiredEngineBadges(routed.engineReport, { isMasterMobilization: true }),
      calculationAudit: getCalculationAudit(routed.engineReport, { isMasterMobilization: true }),
      isCasualMessage: false,
      isMasterMobilization: true,
      selectionReason: '질문에 맞춰 계산한 결과만 비교 분석',
      promptInjection: buildDivinationCapabilityPrompt(allTools.map(tool => tool.id)) + '\n독립된 계산 결과가 없는 도구들끼리 일치했다고 주장하지 마.\n' + routed.promptInjection
    };
  }

  // 2. Map the router's selective basic tools; required Lucy policy also includes a symbolic deep perspective.
  const selectedTools = routed.routePlan.targetTools
    .map((id) => FIFTEEN_DIVINATION_TOOLS[id])
    .filter(Boolean);

  // 기본엔진 1개 이상 필수 보장 (수다모드가 아닐 때)
  if (selectedTools.length === 0 && !routed.routePlan.isCasual) {
    selectedTools.push(FIFTEEN_DIVINATION_TOOLS['saju']);
  }

  // 활성 채널이 단일/부분 융합으로 설정된 경우 보강
  if (!explicitTools.length && activeChannels.length > 0 && selectedTools.length < 3) {
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

  const calculationAudit = getCalculationAudit(routed.engineReport, {
    isMasterMobilization: false,
    focusTools: routed.routePlan.targetTools,
  });
  if (requireBasicAndDeep) {
    for (const key of routed.routePlan.deepEngineKeys ?? []) {
      const engine = ALL_DCE_ENGINES.find(item => item.key === key && item.category === 'deep_master');
      if (!engine || calculationAudit.some(item => item.toolId === key)) continue;
      calculationAudit.push({
        toolId: key,
        name: engine.nameKo,
        status: 'symbolic',
        sentToModel: true,
        note: '질문 관련 상징 참고 관점이 답변 프롬프트에 전달됨',
      });
    }
  }

  return {
    selectedTools,
    firedEngineBadges: routed.toolsForBadge,
    calculationAudit,
    engineTools: routed.engineReport?.tools as Record<string, { status: string; data?: unknown }> | undefined,
    isCasualMessage: false,
    isMasterMobilization: false,
    selectionReason: `${routed.routePlan.intentKoName} (${routed.toolsForBadge.slice(0, 3).join(' + ')})`,
    promptInjection: buildDivinationCapabilityPrompt(routed.routePlan.targetTools) + '\n' + routed.promptInjection
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
- **올인원 마스터 모드 (7대 채널 풀가동)**: **이번 질문에서 계산에 성공한 도구만 사용**하여 **7대 테마별로 묶어 각 도구의 관점을 비교 분석**한 뒤, 실제 계산·제공된 결과만 비교하고 나머지는 상징 관점임을 구분해 명쾌한 마스터 해답을 제시해.
- 어떤 모드에서든 현학적인 한자어나 어려운 전문 용어를 설명 없이 나열하지 말고, 따뜻한 절친 반말(~어, ~야, ~지)로 술술 읽히게 풀어줘.`;
}

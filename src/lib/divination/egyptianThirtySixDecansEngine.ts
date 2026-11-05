/**
 * =========================================================================
 * LUCKEY 고대 이집트 36 데칸(Decan) 별자리 수호신 & 누트(Nut) 천구 항해 엔진
 * (Ancient Egyptian 36 Decans & Stellar Navigation Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 기원전 2000년경 고대 이집트 덴데라(Dendera) 신전 천정화 및 알렉산드리아 천문학의 핵심.
 * 황도 12궁의 360도를 10도씩 36개의 데칸(Decan)으로 분할하여,
 * 밤하늘의 36개 항성 수호신(데칸 신격)이 지배하는 시간과 영혼의 항해를 진단합니다.
 * 
 * 1. 36개 데칸 신격: 케누무(Chnoumis), 소티스(Sothis/Sirius), 호루스(Horus), 
 *    아누비스(Anubis), 토트(Thoth), 오시리스(Osiris), 이시스(Isis), 세크메트(Sekhmet) 등
 * 2. 10일 주기 데칸 수호신의 고유한 신성한 은총(Light Gift)과 영적 시험(Shadow Challenge)
 * 3. 생년월일과 현재 시각의 데칸 동기화를 통한 신성한 부적(Amulet) 및 덴데라 항해 지침 도출
 */

import type { UserProfile } from '../sharedState';

export const EGYPTIAN_DECANS_VERSION = 'LUCKEY-EGYPTIAN-DECANS-v1.0.0';

export interface DecanDeityInfo {
  decanNumber: number;          // 1 ~ 36
  zodiacSign: string;           // 황도 12궁 기호 (예: 양자리, 황소자리 등)
  decanDegree: string;          // 0°~10°, 10°~20°, 20°~30°
  guardianDeity: string;        // 이집트 수호신 명칭
  deityTitle: string;           // 신격 칭호
  elementalForce: string;       // 신성한 원소력 (불·흙·공기·물)
  sacredAmulet: string;         // 고대 이집트 수호 부적 (앙크, 우제트, 스카라베 등)
  lightGift: string;            // 빛의 은총 (타고난 재능 및 영적 강점)
  shadowChallenge: string;      // 그림자의 도전 (경계해야 할 함정)
  sacredIncense: string;        // 신전 정화 향 (키피, 유향, 몰약, 시더우드 등)
}

export interface EgyptianThirtySixDecansReport {
  engineVersion: string;
  calculatedAt: string;
  birthDecan: DecanDeityInfo;
  currentTransitDecan: DecanDeityInfo;
  stellarResonanceScore: number;  // 0 ~ 100 천구 공명 지수
  spiritualNavigationGuidance: string; // 누트(Nut) 천구 항해 지침
  decanAltarPrescription: string;      // 데칸 제단 일상 개운 행동
}

const EGYPTIAN_DEITIES_LIST: Array<Omit<DecanDeityInfo, 'decanNumber' | 'zodiacSign' | 'decanDegree'>> = [
  // 양자리 1, 2, 3
  { guardianDeity: '케누무 (Chnoumis)', deityTitle: '생명의 흙을 빚는 원초의 조물주', elementalForce: '원초의 성스러운 불꽃', sacredAmulet: '제드(Djed) 기둥 - 불굴의 안정', lightGift: '무에서 유를 창조하는 폭발적인 결단력', shadowChallenge: '성급한 충동과 파괴적 분노', sacredIncense: '프랑킨센스 (유향)' },
  { guardianDeity: '소티스 (Sothis)', deityTitle: '나일의 범람을 부르는 시리우스 여신', elementalForce: '비옥한 재생의 불꽃', sacredAmulet: '우제트(Wadjet) - 호루스의 눈', lightGift: '새로운 시대와 기회를 포착하는 영적 직관', shadowChallenge: '과도한 자의식과 통제 집착', sacredIncense: '몰약 (Myrrh)' },
  { guardianDeity: '호루스 (Horus)', deityTitle: '지평선의 승리자이자 매의 신', elementalForce: '승리의 태양 불꽃', sacredAmulet: '태양 원반(Ra-Horakhty)', lightGift: '어둠과 혼돈을 꿰뚫는 명징한 비전과 통솔력', shadowChallenge: '오만과 독단적 독주', sacredIncense: '시더우드' },
  // 황소자리 1, 2, 3
  { guardianDeity: '하토르 (Hathor)', deityTitle: '사랑과 음악, 대지의 풍요를 관장하는 여신', elementalForce: '풍요로운 대지', sacredAmulet: '메나트(Menat) 목걸이 - 치유와 기쁨', lightGift: '감각적 아름다움과 흔들리지 않는 물질적 안정', shadowChallenge: '변화에 대한 완고한 거부와 나태', sacredIncense: '로즈 & 블루 로터스' },
  { guardianDeity: '프타 (Ptah)', deityTitle: '말씀으로 세계를 현현시키는 신성한 건축가', elementalForce: '구체화하는 대지', sacredAmulet: '스카라베(Scarab) - 영원한 재생', lightGift: '아이디어를 현실의 물질과 시스템으로 구축하는 힘', shadowChallenge: '형식주의와 지나친 물질 집착', sacredIncense: '벤조인 (안식향)' },
  { guardianDeity: '아누비스 (Anubis)', deityTitle: '진실의 무게를 재는 지하세계의 수호신', elementalForce: '변용의 깊은 대지', sacredAmulet: '마아트(Ma\'at)의 깃털 - 진실과 정의', lightGift: '거짓을 꿰뚫고 본질과 가치를 감정하는 안목', shadowChallenge: '가혹한 자기 검열과 불안', sacredIncense: '갈바넘' },
  // 쌍둥이자리 1, 2, 3
  { guardianDeity: '토트 (Thoth)', deityTitle: '신성한 언어와 기록, 지혜의 신', elementalForce: '명징한 지적 바람', sacredAmulet: '서기(Scribe)의 팔레트 - 통찰의 언어', lightGift: '복잡한 상황을 한 줄로 꿰뚫는 소통과 기획력', shadowChallenge: '산만함과 공허한 말의 과잉', sacredIncense: '샌달우드 (백단)' },
  { guardianDeity: '슈 (Shu)', deityTitle: '하늘과 땅을 가르는 태고의 숨결', elementalForce: '자유로운 천공의 숨결', sacredAmulet: '슈의 깃털 - 가벼운 영혼', lightGift: '무거운 억압을 털어내고 숨통을 틔우는 중재력', shadowChallenge: '책임 회피와 관계의 부유', sacredIncense: '유칼립투스' },
  { guardianDeity: '세샤트 (Seshat)', deityTitle: '별들을 측정하고 운명을 기록하는 여신', elementalForce: '측량하는 지혜의 바람', sacredAmulet: '7각 별관(Seven-pointed Star)', lightGift: '장기적 전략과 시간의 흐름을 읽는 설계력', shadowChallenge: '완벽주의로 인한 실행 지연', sacredIncense: '키피 (Kyphi)' },
  // 게자리 1, 2, 3
  { guardianDeity: '이시스 (Isis)', deityTitle: '흩어진 생명을 다시 꿰매는 위대한 마법의 어머니', elementalForce: '치유하는 생명수', sacredAmulet: '티엣(Tyet) - 이시스의 매듭', lightGift: '상처받은 영혼을 회복시키는 치유와 보호의 마법', shadowChallenge: '감정적 소유욕과 희생자 의식', sacredIncense: '블루 로터스' },
  { guardianDeity: '바스테트 (Bastet)', deityTitle: '가정과 기쁨, 영적 수호의 고양이 여신', elementalForce: '따스한 보호의 샘물', sacredAmulet: '시스트럼(Sistrum) 방울 - 악귀 퇴치', lightGift: '위험을 본능적으로 감지하고 일상의 행복을 지키는 힘', shadowChallenge: '변덕과 기분파적 후퇴', sacredIncense: '재스민' },
  { guardianDeity: '헤켓 (Heket)', deityTitle: '새로운 생명의 탄생을 돕는 개구리 여신', elementalForce: '변태와 도약의 물결', sacredAmulet: '개구리 아뮬렛 - 풍요로운 순산', lightGift: '막힌 단계에서 새로운 국면으로 도약시키는 조력', shadowChallenge: '익숙함에 안주하려는 침잠', sacredIncense: '클로브 & 몰약' },
  // 사자자리 1, 2, 3
  { guardianDeity: '세크메트 (Sekhmet)', deityTitle: '부정을 불사르는 태양의 맹렬한 암사자', elementalForce: '정화하는 신성한 불길', sacredAmulet: '태양의 우라에우스(Uraeus) 코브라', lightGift: '부조리와 타협하지 않는 절대적 용기와 카리스마', shadowChallenge: '분노 폭발과 파괴적 언행', sacredIncense: '용뇌 (Camphor) & 시나몬' },
  { guardianDeity: '오시리스 (Osiris)', deityTitle: '죽음을 넘어 영원한 생명으로 부활하는 왕', elementalForce: '부활의 불꽃', sacredAmulet: '헤카와 네카카(Crook & Flail) - 자애와 권능', lightGift: '고난 속에서 더 깊은 인격과 영향력으로 부활하는 힘', shadowChallenge: '과거의 영광에 집착하는 무기력', sacredIncense: '프랑킨센스' },
  { guardianDeity: '아문-라 (Amun-Ra)', deityTitle: '숨겨진 신이자 모든 태양의 근원', elementalForce: '근원적 우주 광채', sacredAmulet: '아문(Amun)의 두 깃털 관', lightGift: '보이지 않는 곳에서 전체 판을 움직이는 막후의 위엄', shadowChallenge: '폐쇄성과 타인에 대한 불신', sacredIncense: '키피 (Kyphi)' },
  // 처녀자리 1, 2, 3
  { guardianDeity: '마아트 (Ma\'at)', deityTitle: '우주의 균형과 불변의 질서를 수호하는 여신', elementalForce: '질서정연한 대지', sacredAmulet: '타조 깃털 - 절대 공평', lightGift: '복잡한 상황 속에서 정의와 타당성을 정확히 가리는 지혜', shadowChallenge: '융통성 없는 잣대와 냉혹한 비판', sacredIncense: '사이프러스' },
  { guardianDeity: '네프티스 (Nephthys)', deityTitle: '그림자의 신전을 지키는 은밀한 보호자', elementalForce: '신비의 깊은 대지', sacredAmulet: '신전의 상징 관', lightGift: '남들이 보지 못하는 무의식의 영역과 비밀을 다루는 능력', shadowChallenge: '고립감과 우울로의 침잠', sacredIncense: '몰약' },
  { guardianDeity: '게브 (Geb)', deityTitle: '만물을 품고 양육하는 대지의 신', elementalForce: '묵직한 기초 대지', sacredAmulet: '기러기 아뮬렛 - 영토 번영', lightGift: '어떤 풍파에도 흔들리지 않는 뿌리 깊은 실행력', shadowChallenge: '지나친 보수성과 무거운 지체', sacredIncense: '베티버' },
  // 천칭자리 1, 2, 3
  { guardianDeity: '테프누트 (Tefnut)', deityTitle: '이슬과 습기, 우주의 질서를 조율하는 사자 여신', elementalForce: '조화로운 바람', sacredAmulet: '앙크(Ankh) - 생명의 열쇠', lightGift: '극단으로 치닫는 관계를 균형으로 되돌리는 심미안', shadowChallenge: '우유부단함과 결정 장애', sacredIncense: '일랑일랑' },
  { guardianDeity: '케프리 (Khepri)', deityTitle: '어둠의 새벽을 밀어 올리는 풍뎅이 신', elementalForce: '새벽을 여는 바람', sacredAmulet: '태양 풍뎅이(Winged Scarab)', lightGift: '침체된 프로젝트나 관계에 다시 불을 지피는 재생력', shadowChallenge: '지속력 부족과 조급증', sacredIncense: '베르가못' },
  { guardianDeity: '하르포크라테스 (Harpocrates)', deityTitle: '침묵과 비밀의 지혜를 간직한 어린 호루스', elementalForce: '고요한 침묵의 바람', sacredAmulet: '연꽃 위의 아이 - 순수 보호', lightGift: '말하기 전에 먼저 듣고 관찰하는 깊은 영적 지혜', shadowChallenge: '자기표현 억압과 소외감', sacredIncense: '카모마일' },
  // 전갈자리 1, 2, 3
  { guardianDeity: '세르케트 (Serket)', deityTitle: '독을 약으로 바꾸는 전갈 여신', elementalForce: '변용의 심연수', sacredAmulet: '전갈 아뮬렛 - 해독과 정화', lightGift: '치명적인 위기와 배신을 기회로 뒤바꾸는 회복 탄력성', shadowChallenge: '복수심과 집요한 원망', sacredIncense: '패출리' },
  { guardianDeity: '세트 (Set)', deityTitle: '사막의 모래폭풍과 혼돈을 다스리는 힘의 신', elementalForce: '거친 폭풍수', sacredAmulet: '세트의 동물 와스(Was) 지팡이', lightGift: '썩은 판을 뒤엎고 고정관념을 파괴하는 강력한 혁신력', shadowChallenge: '통제 불능의 파괴성과 갈등 유발', sacredIncense: '블랙페퍼 & 몰약' },
  { guardianDeity: '소베크 (Sobek)', deityTitle: '원초의 힘과 나일의 주권을 쥔 악어 신', elementalForce: '생명 원천의 심연', sacredAmulet: '악어 아뮬렛 - 맹렬한 용기', lightGift: '결정적인 순간에 먹잇감을 낚아채는 압도적인 본능적 승부수', shadowChallenge: '원초적 탐욕과 무모한 모험', sacredIncense: '오우드 (침향)' },
  // 사수자리 1, 2, 3
  { guardianDeity: '네이트 (Neith)', deityTitle: '세계의 직물을 짜고 활을 쏘는 전쟁과 지혜의 여신', elementalForce: '과녁을 꿰뚫는 불꽃', sacredAmulet: '교차된 두 개의 활 - 무패의 명중', lightGift: '먼 미래의 목표를 정확히 타격하는 통찰력과 전략적 포용', shadowChallenge: '경솔한 낙관과 현실 경시', sacredIncense: '주니퍼베리' },
  { guardianDeity: '와제트 (Wadjet)', deityTitle: '하이집트의 수호자이자 지혜로운 코브라 여신', elementalForce: '직관의 타오르는 불꽃', sacredAmulet: '코브라 우라에우스 - 절대 통찰', lightGift: '직관적으로 위험을 회피하고 진로를 밝히는 예지력', shadowChallenge: '독설과 타인에 대한 경계심', sacredIncense: '프랑킨센스' },
  { guardianDeity: '네켄의 매 (Horus of Nekhen)', deityTitle: '원초의 고대 왕권을 상징하는 매', elementalForce: '초월적 영적 불꽃', sacredAmulet: '왕실 네카카(Flail) - 고귀한 위엄', lightGift: '높은 이상을 품고 대중을 이끄는 정신적 리더십', shadowChallenge: '현실 감각 결여와 독선', sacredIncense: '시더우드' },
  // 염소자리 1, 2, 3
  { guardianDeity: '타와레트 (Taweret)', deityTitle: '가장 강인하게 약자를 지키는 하마 여신', elementalForce: '단단한 성채 대지', sacredAmulet: '사(Sa) 아뮬렛 - 절대적 수호', lightGift: '어떤 고난과 압박에도 맡은 바를 끝까지 지켜내는 인내심', shadowChallenge: '융통성 없는 방어벽과 고집', sacredIncense: '몰약' },
  { guardianDeity: '크놈 (Khnemu the Architect)', deityTitle: '나일의 수문을 열고 닫는 지혜의 거장', elementalForce: '축적하는 대지', sacredAmulet: '양의 뿔 - 불굴의 권위', lightGift: '자원을 치밀하게 관리하고 조직을 반석 위에 올리는 역량', shadowChallenge: '인색함과 불확실성에 대한 극심한 공포', sacredIncense: '샌달우드' },
  { guardianDeity: '바페 (Bapef)', deityTitle: '고통과 시련을 통과한 자에게 왕관을 주는 신', elementalForce: '완성의 바위 대지', sacredAmulet: '백색 왕관(Hedjet) - 영적 승리', lightGift: '모든 난관을 겪고 정상에 오른 자의 흔들리지 않는 품격', shadowChallenge: '냉소주의와 인간미 상실', sacredIncense: '벤조인' },
  // 물병자리 1, 2, 3
  { guardianDeity: '하피 (Hapi)', deityTitle: '양손의 항아리에서 풍요의 강물을 쏟아붓는 신', elementalForce: '자유로운 나눔의 바람', sacredAmulet: '연꽃과 파피루스 묶음 - 조화와 번영', lightGift: '시대를 앞서가는 혁신적 아이디어와 인류애적 비전', shadowChallenge: '비현실적 이상주의와 감정적 유리', sacredIncense: '네롤리' },
  { guardianDeity: '누트 (Nut)', deityTitle: '별이 빛나는 밤하늘을 온몸으로 품은 천구의 여신', elementalForce: '무한한 우주 공간', sacredAmulet: '천구의 아치 - 무한한 확장', lightGift: '한계에 갇히지 않는 광대한 상상력과 차원 높은 조망', shadowChallenge: '현실 안착 실패와 뿌리 없는 방황', sacredIncense: '라벤더 & 키피' },
  { guardianDeity: '헤카 (Heka)', deityTitle: '우주를 움직이는 원초의 신성한 언령과 마법의 신', elementalForce: '원초적 파동의 바람', sacredAmulet: '얽힌 두 마리 뱀 - 창조의 마법', lightGift: '말과 생각으로 현실을 동기화하고 기적을 창조하는 마법', shadowChallenge: '조작 욕구와 오만', sacredIncense: '코팔' },
  // 물고기자리 1, 2, 3
  { guardianDeity: '누 (Nu)', deityTitle: '천지창조 이전의 원초적 혼돈의 심해', elementalForce: '근원적 우주수', sacredAmulet: '연꽃 봉오리 - 창조의 씨앗', lightGift: '깊은 공감 능력과 예술적·영적 영감의 무한한 샘', shadowChallenge: '경계선 상실과 현실 도피', sacredIncense: '블루 로터스' },
  { guardianDeity: '이시스-펠라기아 (Isis of the Sea)', deityTitle: '폭풍우 치는 바다를 건너는 뱃사람들의 등대', elementalForce: '등대의 자비로운 물결', sacredAmulet: '항해자의 닻 - 불변의 희망', lightGift: '혼란스러운 삶의 항로에서 길을 잃은 이들을 이끄는 온기', shadowChallenge: '감정 과부하와 의존성', sacredIncense: '재스민' },
  { guardianDeity: '메히트-웨레트 (Mehet-Weret)', deityTitle: '매일 아침 태양을 낳아 지평선에 올리는 하늘의 암소', elementalForce: '완성과 재탄생의 바다', sacredAmulet: '태양을 품은 뿔 - 순환의 완성', lightGift: '모든 생애 주기와 과업을 아름답게 마감하고 새 출발을 여는 은총', shadowChallenge: '과거에 대한 미련과 체념', sacredIncense: '프랑킨센스 & 로즈' },
];

const ZODIAC_NAMES = ['양자리', '황소자리', '쌍둥이자리', '게자리', '사자자리', '처녀자리', '천칭자리', '전갈자리', '사수자리', '염소자리', '물병자리', '물고기자리'];
const DECAN_DEGREES = ['0° ~ 10° (제1데칸)', '10° ~ 20° (제2데칸)', '20° ~ 30° (제3데칸)'];

export function calculateEgyptianThirtySixDecans(params: {
  profile?: UserProfile | null;
  targetDate?: Date;
}): EgyptianThirtySixDecansReport {
  const now = params.targetDate || new Date();
  
  // 기준 생년월일 수비학 / 일자 기반 데칸 산출
  let birthDayOfYear = 80; // 기본값: 춘분점 근방
  if (params.profile?.basic?.birthdate) {
    const parts = params.profile.basic.birthdate.split('-');
    if (parts.length >= 3) {
      const m = parseInt(parts[1], 10) || 3;
      const d = parseInt(parts[2], 10) || 21;
      birthDayOfYear = (m - 1) * 30.5 + d;
    }
  }

  // 1년 365.25일을 36개 데칸(약 10.14일)으로 매핑
  const birthDecanIndex = Math.floor(((birthDayOfYear + 285) % 365.25) / (365.25 / 36)) % 36;
  const birthZodiacIndex = Math.floor(birthDecanIndex / 3);
  const birthDegreeIndex = birthDecanIndex % 3;

  const birthMeta = EGYPTIAN_DEITIES_LIST[birthDecanIndex];
  const birthDecan: DecanDeityInfo = {
    decanNumber: birthDecanIndex + 1,
    zodiacSign: ZODIAC_NAMES[birthZodiacIndex],
    decanDegree: DECAN_DEGREES[birthDegreeIndex],
    ...birthMeta,
  };

  // 현재 시점 트랜짓 데칸 산출
  const nowMonth = now.getUTCMonth() + 1;
  const nowDate = now.getUTCDate();
  const nowDayOfYear = (nowMonth - 1) * 30.5 + nowDate;
  const transitDecanIndex = Math.floor(((nowDayOfYear + 285) % 365.25) / (365.25 / 36)) % 36;
  const transitZodiacIndex = Math.floor(transitDecanIndex / 3);
  const transitDegreeIndex = transitDecanIndex % 3;

  const transitMeta = EGYPTIAN_DEITIES_LIST[transitDecanIndex];
  const currentTransitDecan: DecanDeityInfo = {
    decanNumber: transitDecanIndex + 1,
    zodiacSign: ZODIAC_NAMES[transitZodiacIndex],
    decanDegree: DECAN_DEGREES[transitDegreeIndex],
    ...transitMeta,
  };

  // 출생 데칸과 트랜짓 데칸의 공명도 계산
  const decanDistance = Math.abs(birthDecanIndex - transitDecanIndex);
  const circularDistance = Math.min(decanDistance, 36 - decanDistance);
  // 같은 원소이거나 120도(삼합 12데칸), 또는 동일 데칸일 때 높은 공명
  let stellarResonanceScore = 75;
  if (circularDistance === 0) stellarResonanceScore = 98; // 본명 데칸 귀환
  else if (circularDistance === 12 || circularDistance === 24) stellarResonanceScore = 92; // 정삼각 트라인 공명
  else if (circularDistance === 18) stellarResonanceScore = 84; // 180도 대대 공명 (극성과 긴장)
  else stellarResonanceScore = Math.max(62, 90 - circularDistance * 2);

  const spiritualNavigationGuidance = `당신의 영혼 항해를 주재하는 본명 수호신은 [${birthDecan.guardianDeity}]이며, 현재 천구를 운행 중인 시대의 데칸은 [${currentTransitDecan.guardianDeity}]입니다. ${birthDecan.lightGift}의 힘을 바탕으로, 지금 시기에는 ${currentTransitDecan.shadowChallenge}의 함정을 경계하고 ${currentTransitDecan.sacredAmulet}의 중심을 세울 때입니다.`;

  const decanAltarPrescription = `오늘 일상에서 ${currentTransitDecan.sacredIncense} 향기를 호흡하거나, ${currentTransitDecan.sacredAmulet}의 상징을 마음속에 떠올리며 ${currentTransitDecan.elementalForce}의 기운과 조화를 이루십시오.`;

  return {
    engineVersion: EGYPTIAN_DECANS_VERSION,
    calculatedAt: now.toISOString(),
    birthDecan,
    currentTransitDecan,
    stellarResonanceScore,
    spiritualNavigationGuidance,
    decanAltarPrescription,
  };
}

export function formatEgyptianThirtySixDecansPrompt(report: EgyptianThirtySixDecansReport): string {
  return `### 🏛️ 고대 이집트 36 데칸(Decan) 별자리 수호신 & 누트 천구 항해 엔진 (${EGYPTIAN_DECANS_VERSION})
- **본명 주재 데칸**: 제${report.birthDecan.decanNumber}데칸 [${report.birthDecan.zodiacSign} ${report.birthDecan.decanDegree}]
  - 수호신격: ${report.birthDecan.guardianDeity} (${report.birthDecan.deityTitle})
  - 원소력 / 수호 부적: ${report.birthDecan.elementalForce} · ${report.birthDecan.sacredAmulet}
  - 빛의 은총 / 그림자 시험: ${report.birthDecan.lightGift} / ${report.birthDecan.shadowChallenge}
- **현재 천구 트랜짓 데칸**: 제${report.currentTransitDecan.decanNumber}데칸 [${report.currentTransitDecan.zodiacSign} ${report.currentTransitDecan.decanDegree}] (${report.currentTransitDecan.guardianDeity})
- **천구 항성 공명도**: ${report.stellarResonanceScore}점 / 100점
- **누트(Nut) 천구 항해 지침**: ${report.spiritualNavigationGuidance}
- **데칸 제단 일상 개운 행동**: ${report.decanAltarPrescription}`;
}

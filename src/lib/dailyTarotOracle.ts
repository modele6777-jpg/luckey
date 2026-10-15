import type { TarotCard } from '@/data/tarotData';
import type { AuraThemeCard } from '@/lib/auraCards';
import { getCardSoulBlessing } from '@/lib/tarotBlessings';

interface DailyOracleResult {
  diagnosis: string;
  luckyNumber: string;
  luckyColor: string;
  remedy: string;
  symbol: string;
  frequency: string;
  spiritualEnergy?: string;
  blessingMessage?: string;
  focusPlaylist?: string;
}

/**
 * 타로 카드별 세부 해설 데이터베이스
 */
export interface TarotDetailEntry {
  element: string;
  archetype: string;
  uprightCore: string;
  reversedCore: string;
  shadowWarning: string;
  actionGuidance: string;
  luckyColor: string;
  luckyNum: string;
  symbolWord: string;
  frequency: string;
  playlist: string;
}

export const TAROT_DETAILS: Record<string, TarotDetailEntry> = {
  // Major Arcana
  major_0: {
    element: "공기 (Air)",
    archetype: "순수한 방랑자이자 새로운 가능성의 창시자",
    uprightCore: "어떠한 편견이나 두려움도 없이 새로운 여정의 첫 발을 떼는 자유로운 도약의 에너지",
    reversedCore: "계획 없는 무모함이나 현실 회피, 준비되지 않은 충동적 결정에 대한 경고",
    shadowWarning: "자유를 핑계로 마땅히 져야 할 책임을 회피하거나 안전장치 없이 뛰어내리는 것을 경계하십시오.",
    actionGuidance: "마음속에 품어왔던 새로운 시도에 망설임 없이 순수한 첫걸음을 내딛으세요.",
    luckyColor: "순백의 화이트 (Pure White)",
    luckyNum: "0",
    symbolWord: "새로운 시작과 순수한 도약",
    frequency: "963Hz 송과체 정화 주파수",
    playlist: "963Hz Pure Consciousness",
  },
  major_1: {
    element: "공기/에테르 (Ether)",
    archetype: "4대 원소를 다루는 현실 창조자",
    uprightCore: "내면의 아이디어와 영감을 현실의 탁월한 성취로 구체화하는 강력한 집중과 창조력",
    reversedCore: "자신의 재능을 과신하여 타인을 기만하거나 기회를 낭비하는 에너지 정체",
    shadowWarning: "말만 앞세우고 실행하지 않거나 표면적인 술수로 상황을 모면하려는 유혹을 차단하세요.",
    actionGuidance: "당신이 가진 도구와 자원을 총동원하여 오늘 당장 구체적인 결과물을 만드세요.",
    luckyColor: "진홍빛 루비 레드 (Ruby Red)",
    luckyNum: "1",
    symbolWord: "창조의 지팡이와 무한대(∞)",
    frequency: "528Hz 기적과 변형 주파수",
    playlist: "528Hz Transformation & Miracles",
  },
  major_2: {
    element: "물 (Water)",
    archetype: "지혜와 무의식의 신비를 수호하는 여사제",
    uprightCore: "외부의 소음을 끄고 내면의 직관과 침묵 속에서 진실을 꿰뚫어 보는 깊은 통찰력",
    reversedCore: "감정을 지나치게 억누르거나 차가운 비밀주의, 혹은 직관을 무시하는 혼란",
    shadowWarning: "타인과의 소통을 완전히 단절하고 지나친 냉소나 고립에 빠지지 않도록 유의하십시오.",
    actionGuidance: "말하기보다는 경청하고, 직관이 가리키는 고요한 신호에 귀를 기울이십시오.",
    luckyColor: "깊은 인디고 블루 (Midnight Indigo)",
    luckyNum: "2",
    symbolWord: "지혜의 석류와 보아스·야긴 기둥",
    frequency: "852Hz 직관 회복 주파수",
    playlist: "852Hz Intuition & Inner Vision",
  },
  major_3: {
    element: "대지 (Earth)",
    archetype: "만물을 품고 기르는 풍요의 대모신",
    uprightCore: "사랑과 창의성이 만개하며 삶의 모든 결실과 아름다움이 풍요롭게 무르익는 축복",
    reversedCore: "창작의 정체, 과도한 소유욕이나 집착, 감정적 과잉 반응",
    shadowWarning: "나태함에 빠지거나 타인을 지나치게 통제하려는 과잉보호를 경계하세요.",
    actionGuidance: "자연의 아름다움을 만끽하고 자신과 주변 사람들에게 따뜻한 영양을 채워주세요.",
    luckyColor: "에메랄드 그린 & 로즈 핑크",
    luckyNum: "3",
    symbolWord: "풍요의 밀이삭과 비너스의 별",
    frequency: "639Hz 조화와 연결 주파수",
    playlist: "639Hz Heart Harmony",
  },
  major_4: {
    element: "불 (Fire)",
    archetype: "질서와 안정을 확립하는 확고한 통치자",
    uprightCore: "명확한 규율과 리더십, 단단한 기반 위에 구축되는 현실적 성공과 권위",
    reversedCore: "완고한 고집, 융통성 결여, 독선적인 통제욕으로 인한 갈등",
    shadowWarning: "자신의 방식만을 강요하며 타인의 유연한 의견을 묵살하지 않도록 주의하세요.",
    actionGuidance: "원칙과 우선순위를 바로잡고 흔들림 없는 단호한 결단으로 상황을 리드하십시오.",
    luckyColor: "황실의 버건디 레드 (Royal Burgundy)",
    luckyNum: "4",
    symbolWord: "단단한 입방체 옥좌와 권장의 보주",
    frequency: "417Hz 변화 촉진과 질서 정립",
    playlist: "417Hz Grounding & Structure",
  },
  major_5: {
    element: "대지 (Earth)",
    archetype: "영적 지혜와 규범을 전수하는 스승",
    uprightCore: "검증된 전통과 신뢰할 수 있는 멘토링, 공동체 안에서 얻는 지혜로운 해답",
    reversedCore: "시대에 뒤떨어진 교조주의, 맹목적인 복종, 비합리적인 규범에 대한 반발",
    shadowWarning: "형식과 겉치레에 얽매여 내면의 진실된 목소리를 억압하지 마십시오.",
    actionGuidance: "신뢰할 수 있는 선배나 전문가의 조언을 구하고 기본에 충실한 방식을 택하세요.",
    luckyColor: "고결한 사프란 골드 (Saffron Gold)",
    luckyNum: "5",
    symbolWord: "삼중관과 천국의 열쇠",
    frequency: "741Hz 문제 해결과 명료한 표현",
    playlist: "741Hz Wisdom & Clarity",
  },
  major_6: {
    element: "공기 (Air)",
    archetype: "영혼의 결합과 중대한 가치관의 선택",
    uprightCore: "서로 다른 두 에너지가 완전한 조화를 이루며 가슴 뛰는 진정한 선택을 내리는 순간",
    reversedCore: "우유부단함, 관계의 불협화음, 도덕적 갈등이나 가치관의 충돌",
    shadowWarning: "단기적인 쾌락이나 타인의 눈치를 보느라 영혼이 진정 원하는 선택을 회피하지 마세요.",
    actionGuidance: "머리의 계산을 내려놓고 가슴이 진정으로 공명하는 사람과 방향을 선택하세요.",
    luckyColor: "파스텔 코랄 & 피치 핑크",
    luckyNum: "6",
    symbolWord: "대천사 라파엘의 축복과 생명나무",
    frequency: "639Hz 관계 치유와 사랑의 공명",
    playlist: "639Hz Deep Soul Connection",
  },
  major_7: {
    element: "물/불 (Water/Fire)",
    archetype: "흑백 스핑크스를 통어하는 불굴의 승리자",
    uprightCore: "상반된 감정과 상황을 강한 의지로 장악하고 목표를 향해 무섭게 돌진하는 승리의 파동",
    reversedCore: "통제력 상실, 폭주하는 분노나 조급함, 장애물 앞에서의 좌절",
    shadowWarning: "과속이나 감정적 격앙으로 인해 방향 감각을 잃지 않도록 브레이크를 점검하세요.",
    actionGuidance: "목표에 시선을 고정하고 어떤 방해에도 흔들리지 말고 끝까지 밀어붙이십시오.",
    luckyColor: "코발트 블루 & 실버 아머",
    luckyNum: "7",
    symbolWord: "별자리 차양막과 승리의 전차",
    frequency: "528Hz 의지력 극대화 주파수",
    playlist: "528Hz Unstoppable Drive",
  },
  major_8: {
    element: "불 (Fire)",
    archetype: "부드러움으로 맹수를 다스리는 내면의 거인",
    uprightCore: "거친 폭력이 아닌 온유함과 인내, 흔들리지 않는 내면의 자비로 승리하는 참된 힘",
    reversedCore: "자기 의심, 억누��� 수 없는 분노의 폭발, 나약함에 대한 굴복",
    shadowWarning: "상황을 힘으로 억누르려 하거나 조급하게 성과를 재촉하지 마십시오.",
    actionGuidance: "부드러운 미소와 깊은 포용력으로 갈등을 어루만지고 차분히 설득하십시오.",
    luckyColor: "황금빛 엠버 옐로우 (Warm Amber)",
    luckyNum: "8",
    symbolWord: "장미 덩굴과 무한대(∞)의 면류관",
    frequency: "528Hz 마음의 평화와 내면 치유",
    playlist: "528Hz Inner Strength Flow",
  },
  major_9: {
    element: "대지 (Earth)",
    archetype: "육각별 등불을 비추는 침묵의 탐구자",
    uprightCore: "세속의 번잡함을 떠나 오직 영혼의 진실과 본질을 탐구하는 깊은 지혜와 자아 성찰",
    reversedCore: "지나친 고립감, 현실 부적응, 마음을 닫고 외로움에 빠지는 어두운 그림자",
    shadowWarning: "세상과 단절된 채 혼자만의 동굴에 갇혀 타인의 따뜻한 도움을 거부하지 마세요.",
    actionGuidance: "혼자만의 고요한 시간을 확보하여 지난 여정을 차분히 돌아보고 내면을 정리하세요.",
    luckyColor: "안개의 애쉬 그레이 & 등불의 웜골드",
    luckyNum: "9",
    symbolWord: "지혜의 지팡이와 진리의 육각별",
    frequency: "432Hz 우주 자연 동조 주파수",
    playlist: "432Hz Deep Meditation",
  },
  major_10: {
    element: "불/대지 (Fire/Earth)",
    archetype: "끝없이 회전하는 우주 카르마의 축",
    uprightCore: "피할 수 없는 운명의 상승 기류가 찾아오며 거대한 전환점과 행운이 시작되는 순간",
    reversedCore: "일시적인 불운의 주기, 변화에 대한 완강한 저항, 뜻밖의 지연",
    shadowWarning: "운명의 수레바퀴는 영원히 머물지 않으므로 자만하지 말고 기회의 파도를 포착하세요.",
    actionGuidance: "변화를 두려워하지 말고 우주가 마련해 준 새로운 흐름에 온전히 몸을 맡기세요.",
    luckyColor: "광채의 바이올렛 & 일렉트릭 골드",
    luckyNum: "10",
    symbolWord: "스핑크스와 아누비스의 수레바퀴",
    frequency: "528Hz 운명 개척과 파동 정렬",
    playlist: "528Hz Quantum Leap & Luck",
  },
  major_11: {
    element: "공기 (Air)",
    archetype: "천칭과 검을 든 공정한 우주의 재판관",
    uprightCore: "감정에 치우치지 않는 냉철한 객관성, 뿌린 대로 거두는 명확한 인과율과 진실",
    reversedCore: "편파적인 판단, 억울한 오해, 자신의 실수를 인정하지 않는 책임 회피",
    shadowWarning: "타인을 가혹하게 재단하거나 자신의 결점을 합리화하려는 유혹을 경계하십시오.",
    actionGuidance: "사리분별을 명확히 하고 공정하고 정직한 태도로 문제를 직시하십시오.",
    luckyColor: "청명한 로열 스카이 블루 (True Blue)",
    luckyNum: "11",
    symbolWord: "균형의 황금 천칭과 양날의 검",
    frequency: "741Hz 진실과 정의의 주파수",
    playlist: "741Hz Truth & Alignment",
  },
  major_12: {
    element: "물 (Water)",
    archetype: "세상을 거꾸로 보며 깨달음을 얻는 자발적 순교자",
    uprightCore: "집착을 내려놓고 관점을 180도 전환하여 낡은 자아를 희생하고 영적 각성을 얻는 지혜",
    reversedCore: "무의미한 헛수고, 피해의식, 변화 없는 정체 상태에서의 고통",
    shadowWarning: "행동하지 않고 불평만 늘어놓는 수동적인 태도에서 벗어나 발상의 전환을 꾀하세요.",
    actionGuidance: "조급한 행동을 멈추고 상황을 반대 입장에서 바라보며 유연하게 내려놓으세요.",
    luckyColor: "신비로운 아쿠아 마린 & 세룰리안",
    luckyNum: "12",
    symbolWord: "후광이 깃든 거꾸로 선 나무",
    frequency: "396Hz 죄책감과 두려움 해방",
    playlist: "396Hz Letting Go & Renewal",
  },
  major_13: {
    element: "물 (Water)",
    archetype: "낡은 것을 베어내고 새 생명을 여는 수확자",
    uprightCore: "유효기간이 지난 낡은 껍질의 완전한 종결과 함께 찾아오는 눈부신 새 출발과 변형",
    reversedCore: "끝난 인연이나 과거에 대한 미련, 변화에 대한 공포로 인한 불필요한 고통",
    shadowWarning: "죽어버린 것에 인공호흡기를 달지 마십시오. 깔끔하게 보내주어야 새싹이 돋습니다.",
    actionGuidance: "정리해야 할 물건, 관계, 습관을 오늘 단호하게 종결짓고 공간을 비워내세요.",
    luckyColor: "흑요석 블랙 & 새벽의 화이트 골드",
    luckyNum: "13",
    symbolWord: "신비의 백장미 깃발과 떠오르는 태양",
    frequency: "396Hz 정화와 근원적 탈피",
    playlist: "396Hz Liberation & Rebirth",
  },
  major_14: {
    element: "불/물 (Fire/Water)",
    archetype: "두 잔의 물을 황금비율로 섞는 대천사",
    uprightCore: "서로 다른 극단을 조화롭게 융합하여 마음의 평정과 신체적 웰빙을 복구하는 중용의 미학",
    reversedCore: "과음, 과식, 감정적 극단, 불균형으로 인한 에너지 누수",
    shadowWarning: "성급하게 결과를 내려고 무리수를 두거나 극단적인 선택을 하지 마십시오.",
    actionGuidance: "속도를 늦추고 일과 휴식, 이상과 현실의 황금비율을 찾아 부드럽게 조율하세요.",
    luckyColor: "청량한 오팔 민트 & 라벤더",
    luckyNum: "14",
    symbolWord: "두 개의 성배와 무지개 날개",
    frequency: "528Hz 완전한 심신 조화 주파수",
    playlist: "528Hz Harmony & Alchemy",
  },
  major_15: {
    element: "대지 (Earth)",
    archetype: "물질과 쾌락의 사슬을 쥐고 있는 그림자",
    uprightCore: "에고의 집착, 중독, 억압된 욕망의 적나라한 실체를 직시하고 환영의 사슬을 끊는 계기",
    reversedCore: "오랜 악습과 굴레로부터의 통쾌한 해방, 맹목적인 유혹의 타파",
    shadowWarning: "당신을 옭아맨 사슬은 사실 스스로 언제든 벗어던질 수 있는 느슨한 고리임을 기억하세요.",
    actionGuidance: "나를 갉아먹는 유혹이나 부정적 생각 패턴을 똑바로 응시하고 단호히 끊어내세요.",
    luckyColor: "딥 차콜 블랙 & 핏빛 스칼렛",
    luckyNum: "15",
    symbolWord: "뒤집힌 오망성과 느슨한 목사슬",
    frequency: "417Hz 부정적 카르마 정화",
    playlist: "417Hz Shadow Release",
  },
  major_16: {
    element: "불 (Fire)",
    archetype: "거짓된 바벨탑을 부수는 정화의 번개",
    uprightCore: "모래 위에 쌓은 허상의 구조물이 무너지며 찾아오는 충격과 그 뒤에 열리는 진정한 해방",
    reversedCore: "임박한 위기의 극적인 회피, 지연되는 변화로 인한 만성적 불안",
    shadowWarning: "무너지는 낡은 탑을 억지로 붙잡으려 하지 마십시오. 부서져야 진실한 터가 드러납니다.",
    actionGuidance: "예상치 못한 변화나 계획의 수정이 찾아오더라도 담담하게 받아들이고 새 판을 짜세요.",
    luckyColor: "번개의 일렉트릭 옐로우 & 번트 오렌지",
    luckyNum: "16",
    symbolWord: "떨어지는 왕관과 천상의 번개",
    frequency: "417Hz 구속 타파와 의식 각성",
    playlist: "417Hz Breaking Chains",
  },
  major_17: {
    element: "공기/물 (Air/Water)",
    archetype: "어둠 속에서 길을 비추는 영원한 희망의 별",
    uprightCore: "폭풍우가 지나간 뒤 대지에 부어지는 맑은 생명수처럼, 영혼을 어루만지는 치유와 영감",
    reversedCore: "비관주의, 희망의 상실, 현실과 동떨어진 비현실적 망상",
    shadowWarning: "비관적인 생각에 젖어 당신의 미래를 어둡게 점치지 마십시오. 새벽은 이미 밝아오고 있습니다.",
    actionGuidance: "당신의 꿈과 소망을 신뢰하고, 자신을 위한 따뜻한 치유와 휴식을 선물하세요.",
    luckyColor: "청아한 스타라이트 실버 & 시안 블루",
    luckyNum: "17",
    symbolWord: "여덟 갈래 북극성과 생명의 샘물",
    frequency: "528Hz 영혼 치유와 희망의 파동",
    playlist: "528Hz Starlight Healing",
  },
  major_18: {
    element: "물 (Water)",
    archetype: "안개 자욱한 무의식의 심연을 비추는 달",
    uprightCore: "감추어진 불안과 환영 속에서 꿈과 무의식의 기호들을 읽어내는 신비로운 직관의 밤",
    reversedCore: "모호한 안개가 걷히고 진실이 드러남, 오랜 의혹과 불안의 종식",
    shadowWarning: "확인되지 않은 소문이나 스스로 만들어낸 상상의 두려움에 사로잡히지 마십시오.",
    actionGuidance: "불확실한 상황에서 섣부른 판단을 유보하고 내면의 무의식 신호에 집중하세요.",
    luckyColor: "달빛의 펄 실버 & 미드나잇 블루",
    luckyNum: "18",
    symbolWord: "달을 향해 짖는 늑대와 가재",
    frequency: "852Hz 환상 타파와 직관 명료화",
    playlist: "852Hz Dreamscape & Intuition",
  },
  major_19: {
    element: "불 (Fire)",
    archetype: "어둠을 완전히 몰아내는 찬란한 태양",
    uprightCore: "압도적인 긍정 에너지, 건강한 생명력, 모든 일이 명쾌하게 풀려나가는 최고의 성공과 기쁨",
    reversedCore: "일시적인 구름에 가린 해, 과도한 열정으로 인한 탈진, 지나친 낙관주의",
    shadowWarning: "모든 것이 잘 풀릴 때 오만해지지 말고 주변 사람들에게 따뜻한 온기를 나누세요.",
    actionGuidance: "당신의 매력과 자신감을 마음껏 발휘하고 오늘 하루를 활짝 웃으며 즐기세요.",
    luckyColor: "눈부신 썬 플레임 옐로우 & 골드",
    luckyNum: "19",
    symbolWord: "백마를 탄 아이와 활짝 핀 해바라기",
    frequency: "528Hz 활력 충전과 극상의 행운",
    playlist: "528Hz Solar Radiance",
  },
  major_20: {
    element: "불/물 (Fire/Water)",
    archetype: "죽은 자를 깨우는 대천사의 최후 나팔",
    uprightCore: "과거의 모든 업보가 청산되고 영혼의 소명을 향해 다시 태어나는 결정적 각성과 결단의 순간",
    reversedCore: "스스로를 향한 가혹한 자책, 부름에 대한 외면, 결단을 미루는 망설임",
    shadowWarning: "과거의 실수에 발목 잡혀 새로운 부름을 거부하지 마십시오. 판결은 이미 끝났습니다.",
    actionGuidance: "망설여왔던 중대한 결단을 내리고 당신의 본래 소명을 향해 당당히 응답하십시오.",
    luckyColor: "천상의 에테르 화이트 & 골든 브라스",
    luckyNum: "20",
    symbolWord: "대천사 가브리엘의 황금 나팔",
    frequency: "963Hz 영적 부활과 주파수 도약",
    playlist: "963Hz Awakening & Rebirth",
  },
  major_21: {
    element: "대지/에테르 (Earth/Ether)",
    archetype: "우주와 하나 되어 춤추는 완성자",
    uprightCore: "오랜 여정의 완벽한 성취, 통합과 조화, 다음 차원으로 도약하기 전의 완전한 축복",
    reversedCore: "마지막 한 뼘의 미완성, 마무리 부족, 지연되는 마침표",
    shadowWarning: "거의 다 왔을 때 방심하여 마지막 마무리를 소홀히 하지 않도록 꼼꼼히 점검하세요.",
    actionGuidance: "지금까지 걸어온 길을 자축하고, 완성된 결실을 발판 삼아 더 넓은 세계로 나아가세요.",
    luckyColor: "우주의 코스믹 인디고 & 무지개 오팔",
    luckyNum: "21",
    symbolWord: "월계수 화환과 네 수호자의 합일",
    frequency: "528Hz 완전한 성취와 우주 공명",
    playlist: "528Hz Cosmic Wholeness",
  },
};

/**
 * 수트(마이너 아르카나) 기본 템플릿
 */
export function getSuitDetails(card: any): TarotDetailEntry {
  const isRev = !!card?.reversed;
  const name = card?.nameKo || card?.name || "운명의 카드";
  const kws = Array.isArray(card?.keywords) ? card.keywords.join(", ") : "직관과 통찰";

  if (card.type === "wands") {
    return {
      element: "불 (Fire - 열정, 행동, 사업, 영감)",
      archetype: `지팡이의 불꽃을 품은 ${name}`,
      uprightCore: `[${name}] 카드는 불꽃 같은 열정과 도전 정신, 그리고 새로운 기회를 향해 과감하게 뻗어나가는 역동적인 추진력을 상징합니다.`,
      reversedCore: `[${name}] 역방향은 에너지가 과도하게 분산되거나 조급함으로 인해 탈진(Burnout)이 일어날 수 있음을 경고합니다.`,
      shadowWarning: "의욕만 앞서 디테일을 놓치거나 성급하게 결론을 내리지 않도록 호흡을 가다듬으세요.",
      actionGuidance: `키워드 '${kws}'를 가슴에 품고, 오늘 하루 미뤄왔던 행동 과제를 과감하게 실행에 옮기십시오.`,
      luckyColor: "타오르는 스칼렛 오렌지",
      luckyNum: "3",
      symbolWord: "싹이 돋아난 생명의 지팡이",
      frequency: "528Hz 활력과 열정의 파동",
      playlist: "528Hz Passion & Vitality",
    };
  }
  if (card.type === "cups") {
    return {
      element: "물 (Water - 감정, 사랑, 관계, 직관)",
      archetype: `성배의 생명수를 품은 ${name}`,
      uprightCore: `[${name}] 카드는 풍성하게 넘쳐흐르는 감정의 교감, 따뜻한 사랑과 치유, 그리고 영혼을 채우는 직관적 감수성을 상징합니다.`,
      reversedCore: `[${name}] 역방향은 감정의 기복이나 과거의 상처에 집착하여 현실적인 관계의 균형을 잃을 수 있음을 시사합니다.`,
      shadowWarning: "감정에 휘둘려 이성적인 판단을 그르치거나 타인의 감정 쓰레기통이 되지 않도록 경계를 지키세요.",
      actionGuidance: `키워드 '${kws}'를 되새기며, 나 자신과 소중한 사람에게 따뜻한 진심과 위로의 말을 전하세요.`,
      luckyColor: "투명한 아쿠아 마린 블루",
      luckyNum: "2",
      symbolWord: "넘쳐흐르는 황금 성배",
      frequency: "639Hz 사랑과 마음의 치유",
      playlist: "639Hz Heart Resonance",
    };
  }
  if (card.type === "swords") {
    return {
      element: "공기 (Air - 이성, 결단, 진실, 명석함)",
      archetype: `진실의 검을 벼리는 ${name}`,
      uprightCore: `[${name}] 카드는 냉철한 이성과 예리한 통찰력, 복잡한 혼란을 단칼에 베어내는 명쾌한 진실과 결단력을 상징합니다.`,
      reversedCore: `[${name}] 역방향은 지나친 비판의식, 과도한 걱정과 뇌내 망상, 혹은 칼날에 스스로가 다치는 상처를 경고합니다.`,
      shadowWarning: "말과 생각의 칼날로 타인이나 자신에게 상처를 주지 않도록 자비로운 분별력을 유지하세요.",
      actionGuidance: `키워드 '${kws}'를 바탕으로, 불필요한 생각의 군더더기를 쳐내고 핵심 사실에만 집중하십시오.`,
      luckyColor: "차가운 다이아몬드 실버",
      luckyNum: "1",
      symbolWord: "구름을 뚫고 솟은 지혜의 검",
      frequency: "741Hz 직관과 명료한 사고",
      playlist: "741Hz Pure Intellect",
    };
  }
  if (card.type === "pentacles") {
    return {
      element: "대지 (Earth - 물질, 재정, 안정, 실질적 성취)",
      archetype: `황금 펜타클의 결실을 가꾸는 ${name}`,
      uprightCore: `[${name}] 카드는 단단한 현실적 기반, 성실한 노력의 결실, 그리고 손에 잡히는 구체적인 풍요와 안정을 상징합니다.`,
      reversedCore: `[${name}] 역방향은 물질적 불안감, 인색함, 혹은 단기적인 이익에 눈이 멀어 장기적인 신뢰를 잃는 것을 경계합니다.`,
      shadowWarning: "돈이나 소유물에 지나치게 집착하여 삶의 진정한 기쁨과 온기를 잊지 않도록 하세요.",
      actionGuidance: `키워드 '${kws}'를 실천 지표로 삼아, 오늘 하루 현실의 작은 디테일을 정성껏 다듬고 관리하십시오.`,
      luckyColor: "풍요로운 에메랄드 골드",
      luckyNum: "8",
      symbolWord: "대지의 결실을 맺는 황금 코인",
      frequency: "432Hz 현실 접지와 풍요 주파수",
      playlist: "432Hz Earth Abundance",
    };
  }

  return {
    element: "에테르 (Ether)",
    archetype: `신비의 상징 ${name}`,
    uprightCore: `[${name}] 카드는 삶의 균형과 영적 성장을 가리키는 우주의 신비로운 이정표입니다.`,
    reversedCore: `[${name}] 역방향은 내면의 신호를 놓치지 말고 천천히 중심을 되찾을 것을 권고합니다.`,
    shadowWarning: "조급한 마음에 휩쓸리지 않도록 마음의 영점을 지키세요.",
    actionGuidance: `키워드 '${kws}'의 의미를 깊이 음미하며 오늘 하루를 온전히 정렬하세요.`,
    luckyColor: "황금빛 골드",
    luckyNum: "7",
    symbolWord: "우주의 조화",
    frequency: "528Hz",
    playlist: "528Hz Solfeggio Resonance",
  };
}

/**
 * 타로 카드의 상징, 원형, 정방향/역방향 본질 의미 추출 헬퍼
 */
export function getTarotCardDetails(card: any): TarotDetailEntry {
  if (!card) {
    return {
      element: "에테르 (Ether)",
      archetype: "운명의 인도자",
      uprightCore: "균형과 내면의 통찰",
      reversedCore: "내면의 성찰과 호흡 조율",
      shadowWarning: "마음의 중심을 굳건히 지키세요.",
      actionGuidance: "직관에 귀를 기울이세요.",
      luckyColor: "황금빛 골드",
      luckyNum: "7",
      symbolWord: "우주의 조화",
      frequency: "528Hz",
      playlist: "528Hz Solfeggio Resonance",
    };
  }
  const id = card.id || "";
  return TAROT_DETAILS[id] || getSuitDetails(card);
}

/**
 * 카드별 맞춤 초간단 개운 행동(개운 리추얼) 생성기
 */
export function getTarotLuckyAction(card: TarotCard, isReversed: boolean): string {
  const cardId = card.id || "";
  
  // 1. 메이저 아르카나 22종별 정/역방향 맞춤 개운 행동
  const MAJOR_ACTIONS: Record<string, { upright: string; reversed: string }> = {
    major_0: {
      upright: "평소 가보지 않은 길이나 새로운 산책로를 5분간 걸으며, 신선한 아침 공기를 깊게 들이마시고 새로운 기운을 환영해 보세요.",
      reversed: "중요한 결정을 내리기 전 따뜻한 물 한 잔을 천천히 마시며, 서두르지 말고 준비 사항을 차분히 한 번 더 점검해 보세요."
    },
    major_1: {
      upright: "가장 자주 쓰는 필기구나 책상 위를 깨끗이 닦고, 오늘 집중해서 달성할 핵심 목표 1가지를 적어 눈앞에 붙여두세요.",
      reversed: "말을 아끼고 결과로 증명할 수 있도록, 책상 주변을 깔끔히 정돈하고 단 20분만 한 가지 일에 온전히 몰입해 보세요."
    },
    major_2: {
      upright: "조용한 공간에서 따뜻한 차 한 잔을 음미하며, 3분간 스마트폰을 내려놓고 마음속 고요한 직관에 귀 기울여 보세요.",
      reversed: "혼자만의 고민에 갇히지 않도록 창문을 열어 상쾌하게 환기하고, 신뢰하는 지인에게 가볍게 마음을 나눠보세요."
    },
    major_3: {
      upright: "거울을 보며 나 자신에게 다정한 미소를 건네고, 기분 좋은 향기(향수나 핸드크림)와 따뜻한 음식으로 오감을 깨워보세요.",
      reversed: "나 자신만을 위한 편안한 휴식 시간을 10분간 확보하고, 타인의 감정이나 기대에 휘둘리지 않는 단단한 마음을 지키세요."
    },
    major_4: {
      upright: "허리와 어깨를 곧게 펴고 바른 자세를 취한 뒤, 오늘 처리해야 할 일의 우선순위를 1번부터 3번까지 명확히 정리해 보세요.",
      reversed: "목과 어깨를 가볍게 스트레칭하며 긴장을 풀고, 주변 사람들의 조언을 부드럽고 유연한 마음으로 경청해 보세요."
    },
    major_5: {
      upright: "마음에 울림을 주는 명언 한 구절을 메모장에 적어두고, 만나는 사람에게 먼저 정중하고 밝은 인사를 건네보세요.",
      reversed: "틀에 박힌 형식에 얽매이지 말고, 나만의 고유한 방식과 상식적 가치관에 따라 유연하게 한 걸음 내딛어 보세요."
    },
    major_6: {
      upright: "소중한 사람(또는 나 자신)에게 '오늘도 고마워'라는 다정한 메시지 한 줄을 보내며 따뜻한 온기를 나눠보세요.",
      reversed: "선택의 기로에서 타인의 기준 대신, 내 가슴이 진정으로 설레고 편안함을 느끼는 쪽이 어디인지 조용히 짚어보세요."
    },
    major_7: {
      upright: "오늘 가장 중요한 과제를 정하고, 잡념 없이 25분간 집중하여 힘차게 밀어붙이는 집중 타이머를 가동해 보세요.",
      reversed: "조급한 마음의 가속 페달에서 발을 떼고, 깊은 심호흡 3번으로 속도를 늦추며 주변 상황을 차분히 살피세요."
    },
    major_8: {
      upright: "감정이 흔들릴 때 부드러운 미소와 함께 온화한 숨을 내쉬며, 부드러움이 강함을 이긴다는 지혜를 실천해 보세요.",
      reversed: "스스로를 자책하거나 몰아세우지 말고, 따뜻한 음료를 마시며 지금까지 버텨온 나의 작은 수고를 온전히 안아주세요."
    },
    major_9: {
      upright: "하루 일과 중 10분간 조명을 낮추고 혼자만의 시간을 가지며, 내면의 생각과 감정을 메모장에 차분히 관조해 보세요.",
      reversed: "혼자서만 끙끙 앓지 말고, 바깥바람을 쐬며 햇볕을 5분간 쬐거나 편안한 친구에게 가볍게 안부를 물어보세요."
    },
    major_10: {
      upright: "창문을 활짝 열어 실내 공기를 상쾌하게 환기하고, 오늘 찾아오는 뜻밖의 반가운 우연을 열린 마음으로 환영하세요.",
      reversed: "통제할 수 없는 일에 에너지를 낭비하지 말고, 지금 내 손으로 바로 정돈할 수 있는 작은 일 하나부터 시작하세요."
    },
    major_11: {
      upright: "지갑 속 영수증을 깔끔하게 정리하거나 책상 위 물건들의 수평을 맞추며, 단정하고 명확한 마음가짐을 세워보세요.",
      reversed: "나와 타인을 흑백논리로 섣불리 재단하지 말고, 한 발짝 물러서서 양쪽의 상황을 너그럽게 헤아려 보세요."
    },
    major_12: {
      upright: "기존의 고정관념을 잠시 내려놓고 다른 각도에서 문제를 바라보며, 목과 어깨의 힘을 툭 빼고 편안한 휴식을 취하세요.",
      reversed: "무의미한 희생이나 지체에서 벗어나, 이제는 결단을 내리고 내 에너지와 행복을 지키는 한 걸음을 내딛으세요."
    },
    major_13: {
      upright: "스마트폰에서 불필요한 사진이나 앱 3개를 삭제하여 비워내고, 새로운 행운이 들어올 산뜻한 여백을 마련하세요.",
      reversed: "이미 지나간 과거의 후회나 미련을 종이에 적어 구겨 버리고, 오늘 새롭게 선물 받은 하루에만 온전히 집중하세요."
    },
    major_14: {
      upright: "시원한 물과 따뜻한 물을 섞어 천천히 마시며, 일과 쉼의 균형을 맞추는 평화로운 심호흡을 이어가 보세요.",
      reversed: "극단적인 감정이나 과소비·과식을 피하고, 오늘은 담백하고 소박한 식단과 차분한 마음으로 균형을 되찾으세요."
    },
    major_15: {
      upright: "나를 피로하게 만드는 나쁜 습관(숏폼 과시청, 군것질 등) 하나를 오늘 하루 의식적으로 멈추고 주도권을 되찾으세요.",
      reversed: "보이지 않는 죄책감이나 집착의 사슬을 끊고, '나는 자유롭고 온전하다'고 당당하게 세 번 소리 내어 확언해 보세요."
    },
    major_16: {
      upright: "답답했던 마음의 껍질을 깨부수듯 깊은 한숨을 크게 내쉬고, 오래 묵혀둔 서랍이나 가방 속을 시원하게 정리해 보세요.",
      reversed: "예상치 못한 변화가 찾아와도 당황하지 말고, '더 단단하고 튼튼한 새 터전을 짓는 기회'로 담대하게 받아들이세요."
    },
    major_17: {
      upright: "맑은 하늘을 10초간 올려다보며, 마음속 가장 간절한 소망 하나를 별빛에 띄워 보내듯 밝은 미소로 확언해 보세요.",
      reversed: "스스로를 향한 비관적인 생각을 지우고, 오늘 내가 감사할 수 있는 작은 축복 3가지를 손으로 직접 적어보세요."
    },
    major_18: {
      upright: "막연한 불안감이 밀려올 때 발바닥을 바닥에 단단히 붙이고 심호흡하며, 상상 속 걱정 대신 눈앞의 현실에 집중하세요.",
      reversed: "안개가 걷히듯 진실이 선명해질 것이니, 따뜻한 물로 세안이나 손 씻기를 하며 머릿속을 맑고 깨끗하게 씻어내세요."
    },
    major_19: {
      upright: "아침 햇살을 3분간 쬐며 얼굴에 환한 미소를 짓고, '오늘 하루는 찬란한 행운으로 가득하다'고 자신 있게 읊조려 보세요.",
      reversed: "어린아이처럼 순수한 마음으로 좋아하는 간식을 즐기거나 유쾌한 영상을 보며 억눌렸던 웃음을 시원하게 터뜨려 보세요."
    },
    major_20: {
      upright: "마음속에 미뤄두었던 결정을 과감히 매듭짓고, 새로운 도약을 위해 나 자신에게 아낌없는 격려와 박수를 보내세요.",
      reversed: "과거의 실수에 발목 잡히지 마세요. 가슴에 손을 얹고 '나는 지난 경험을 통해 더 지혜로워졌다'고 선언하세요."
    },
    major_21: {
      upright: "오늘 완수한 작은 결실 하나에 진심으로 감사하며, 온 우주가 당신의 성공을 응원하고 있음을 온몸으로 느껴보세요.",
      reversed: "마지막 1%의 마무리를 정성스럽게 매듭지어, 미루지 않고 완결해 내는 뿌듯한 성취감을 스스로에게 선물해 보세요."
    }
  };

  if (MAJOR_ACTIONS[cardId]) {
    return isReversed ? MAJOR_ACTIONS[cardId].reversed : MAJOR_ACTIONS[cardId].upright;
  }

  // 2. 마이너 아르카나 수트별 원소 기반 맞춤 개운 행동
  if (card.type === "wands") {
    return isReversed
      ? "조급하게 서두르지 말고, 천천히 기지개를 켜며 가벼운 스트레칭으로 굳어있던 몸과 마음에 유연한 온기를 불어넣어 보세요."
      : "기지개를 활짝 켜며 활력을 깨우고, 오늘 해야 할 일 중 가장 첫 번째 액션을 3분 안에 바로 시작해 보세요.";
  }
  if (card.type === "cups") {
    return isReversed
      ? "타인의 시선이나 차가운 말에 상처받지 않도록, 따뜻한 차 한 잔을 마시며 '나는 내 감정을 지킬 힘이 있다'고 스스로를 다독여 주세요."
      : "맑은 물 한 잔을 천천히 음미하며 마음을 촉촉하게 적시고, 나 자신에게 '오늘도 참 잘하고 있어'라고 다정하게 속삭여 보세요.";
  }
  if (card.type === "swords") {
    return isReversed
      ? "꼬리를 무는 복잡한 생각의 고리를 끊기 위해 창문을 활짝 열어 환기하고, 깊은 심호흡으로 뇌에 맑은 산소를 공급해 보세요."
      : "창문을 열어 머릿속을 상쾌하게 환기하고, 머릿속 복잡한 생각들을 메모지에 적어본 뒤 핵심 1가지만 남기고 과감히 비워보세요.";
  }
  if (card.type === "pentacles") {
    return isReversed
      ? "물질적 불안감에 사로잡히지 않도록, 지갑이나 계좌를 차분히 확인하고 손에 닿는 일상의 작은 물건들을 정갈하게 정돈해 보세요."
      : "지갑 안 지폐의 방향을 가지런히 정리하고 영수증을 비워내며, 정성껏 차린 따뜻한 식사를 천천히 음미해 보세요.";
  }

  return "물 한 잔을 마시며 깊은 심호흡 세 번으로 머릿속을 맑게 비우고, 가벼운 미소와 함께 오늘 하루를 산뜻하게 시작해 보세요.";
}

/**
 * 타로 카드에 기반한 완전 맞춤형 데일리 오라클 결과 생성 엔진
 */
export function buildSpecificTarotDailyOracle(card: TarotCard, mode: string = "oracle"): DailyOracleResult {
  const cardName = card.nameKo;
  const cardEn = card.name;
  const isReversed = !!card.reversed;
  const orientation = isReversed ? "역방향 (Reversed)" : "정방향 (Upright)";
  const keywords = (card.keywords || []).join(", ");
  const details = TAROT_DETAILS[card.id] || getSuitDetails(card);
  const luckyAction = getTarotLuckyAction(card, isReversed);

  const cardMeaning = isReversed ? details.reversedCore : details.uprightCore;
  const shadowWarn = isReversed
    ? `${details.shadowWarning} 지금은 억지로 결과를 서두르기보다 마음의 중심을 단단히 잡고 내실을 다져야 할 때입니다.`
    : `${details.shadowWarning} 자만하거나 사소한 방심으로 흐름을 깨뜨리지 않도록 유의하세요.`;

  const workGuidance = isReversed
    ? `무리한 확장이나 새로운 시작보다는, 기존에 진행하던 일들의 결함이나 미비점을 차분히 보완하고 점검하는 데 집중하세요.`
    : `아이디어에 머물지 말고 자신감 있게 결단을 내리고 행동으로 옮기세요. 적극적인 소통과 실행이 기대 이상의 결과로 이어집니다.`;

  const relationGuidance = isReversed
    ? `상대방의 사소한 말 한마디에 민감하게 반응하기보다, 한 템포 쉬어가는 여유를 가지세요. 내면의 평온이 대인관계의 마찰을 사전에 예방합니다.`
    : `밝고 진솔한 태도로 주변 사람들에게 온기를 건네보세요. 긍정적인 감정 교류가 당신의 운을 더욱 크고 환하게 열어줍니다.`;

  const actionPrescription = luckyAction && luckyAction.length >= 2
    ? `오늘 일상에서 "${luckyAction}"을(를) 정성껏 실천하여 내면의 에너지를 순환시키고 긍정 운을 활짝 열기.`
    : '오늘 일상에서 미뤄둔 핵심 과제 1가지를 정해 20분간 몰입해 완수하고 맑은 운의 파동을 일으키기.';

  const diagnosis = `[핵심 3줄 요약]
- [현재 에너지] ${isReversed ? `[${cardName}] 카드의 역방향 에너지로 내면의 성찰과 차분한 정돈이 필요한 하루입니다.` : `[${cardName}] 카드의 정방향 에너지로 활기찬 생명력과 긍정적인 파동이 충만한 하루입니다.`}
- [방향과 결단] ${isReversed ? '조급함을 내려놓고 기존의 결함을 점검하며 신중하게 나아가는 것이 최선의 선택입니다.' : '내면의 직관과 잠재력을 믿고 자신감 있게 적극적인 행동을 취할 때입니다.'}
- [실천 처방] ${actionPrescription}

### 🕯️ 1. 카드가 비추는 당신의 마음과 현재 에너지
${cardMeaning}
오늘 하루 당신의 영혼과 일상에는 **${keywords}**의 흐름이 깊숙이 침투해 있으며, 내면의 무의식 속에서는 ${isReversed ? '잠시 숨을 고르며 내면의 저항을 정돈하고 새로운 방향을 모색하는 정화의 에너지' : '오랜 시간 준비해 온 에너지가 밖으로 뻗어나가 결실을 맺고자 하는 역동적인 생명력'}이 꿈틀거리고 있습니다. 외부의 소음이나 타인의 기대에 휘둘리지 않고 당신의 내면 나침반을 신뢰할 때, 오늘 하루의 흐름은 가장 이상적인 조화를 이루게 될 것입니다.

### 🎴 2. 펼쳐진 카드들이 들려주는 이야기 (카드 상징과 본래 뜻 해독)
오늘 당신의 손끝에서 모습을 드러낸 카드는 **[${cardName}${cardEn ? ` (${cardEn})` : ''}] (${orientation})**입니다.
- **카드의 영적 원형과 도상 상징**: 이 카드는 4대 원소 중 **${details.element}**의 파동을 품고 있으며, **"${details.archetype}"**의 영적 원형과 **[${details.symbolWord}]**의 신성한 도상 상징을 담고 있습니다.
- **카드가 품은 본래의 뜻**: ${isReversed ? `역방향으로 발현되어 **${details.reversedCore}**을(를) 나타냅니다. 에너지가 잠시 내면으로 향해 숨을 고르고, 내실을 다지며 재정비해야 할 운명적 신호입니다.` : `정방향으로 발현되어 **${details.uprightCore}**을(를) 선명하게 나타냅니다. 외부를 향한 생명력과 진취적인 창조의 흐름이 활짝 열려 있음을 가리킵니다.`}
- **일과 활동**: ${workGuidance}
- **대인관계 & 소통**: ${relationGuidance}
- **주의할 점**: ${shadowWarn}

### 🔮 3. 트리니티 마스터의 직관적 결단 & 방향성
**[${isReversed ? '신중한 내실 다지기 & 점검 필요' : '자신감 있는 실행 & 적극적인 전진'}]**
${isReversed ? '지금은 억지로 결과를 서두르기보다 마음의 중심을 단단히 잡고 내실을 다져야 할 때입니다. 조급함을 내려놓을 때 보이지 않던 명쾌한 돌파구가 열립니다.' : '아이디어에 머물지 말고 자신감 있게 결단을 내리고 행동으로 옮기세요. 적극적인 소통과 실행이 기대 이상의 결과로 이어집니다.'}

### 🌿 4. 운의 흐름을 바꿀 마스터의 실천 처방 (개운 가이드)
- **오늘의 핵심 실천**: ${luckyAction}
- **추천 사운드 & 공명 주파수**: **${details.frequency}**의 공명 주파수를 의식하며, 가슴 한가운데 손을 얹고 깊은 복식호흡 3회를 진행해 보세요.

### ✨ 5. 당신의 길을 축복하는 영혼의 한마디
> _"${getCardSoulBlessing(card)}"_`;

  return {
    diagnosis,
    luckyNumber: details.luckyNum,
    luckyColor: details.luckyColor,
    remedy: `오늘의 개운 실천: ${luckyAction}. [${cardName}] 카드의 조화로운 기운을 마음에 품고 차분하게 나아가기`,
    symbol: details.symbolWord,
    frequency: details.frequency,
    spiritualEnergy: `[${cardName}] 카드가 오늘 당신의 마음에 든든한 중심과 긍정 기운을 불어넣습니다.`,
    blessingMessage: `오늘 하루 당신의 모든 발걸음 위에 [${cardName}]의 밝은 행운이 함께하길 축복합니다.`,
    focusPlaylist: details.playlist,
  };
}

/**
 * 세도나 방하착 카드 22종별 고유 무의식 저항, 4문답, 확언, 처방 데이터베이스
 */
interface SedonaCardProfile {
  egoResistance: string;
  allowPrompt: string;
  releasePrompt: string;
  surrenderAffirmation: string;
  dailyPractice: string;
  remedyAction: string;
  symbol: string;
  frequency: string;
  playlist: string;
  luckyNum: string;
  luckyColor: string;
}

const SEDONA_CARD_PROFILES: Record<string, SedonaCardProfile> = {
  white_purifier: {
    egoResistance: "티끌 하나도 용납하지 못하는 완벽주의적 결벽과 과거 실수에 대한 자책감, 통제하지 못했을 때의 불안",
    allowPrompt: "완벽해야 한다는 내면의 가혹한 검열관과 자책의 묵직한 감정을 있는 그대로 허용할 수 있습니까?",
    releasePrompt: "흠 없는 완벽함을 쥐어짜려던 오랜 통제욕과 긴장을 맑은 백색 광선 속에 흘려보낼 수 있습니까?",
    surrenderAffirmation: "나는 완벽해야 한다는 에고의 결벽을 내려놓고, 있는 그대로 순수하고 온전한 백색의 평온 속에 머뭅니다.",
    dailyPractice: "오늘 스스로의 작은 실수나 불완전함을 마주할 때마다 '이것 또한 순수한 과정이다'라고 인정하며 부드럽게 넘어가기",
    remedyAction: "자책감이 올라올 때마다 백색 빛으로 가슴을 정화하며 10초간 완벽주의 내려놓기",
    symbol: "정화의 백수정 (White Quartz)",
    frequency: "528Hz 정화와 근원적 순수 주파수",
    playlist: "528Hz Pure White Cleansing",
    luckyNum: "1",
    luckyColor: "순수한 스노우 화이트 & 펄"
  },
  emerald_healer: {
    egoResistance: "만성적인 심신 피로와 번아웃, '내가 모두를 챙겨야 한다'는 구원자 콤플렉스와 조급한 회복 강박",
    allowPrompt: "지친 몸과 마음을 채찍질하며 타인의 기대에 부응하려 했던 피로와 부담감을 허용할 수 있습니까?",
    releasePrompt: "나를 소진시키며 타인을 구원하려 했던 무거운 책임감과 통제욕을 치유의 대지에 흘려보낼 수 있습니까?",
    surrenderAffirmation: "나는 모든 것을 짊어지려던 에고의 갑옷을 벗고, 싱그러운 에메랄드 생명력에 몸과 마음을 온전히 맡깁니다.",
    dailyPractice: "타인의 부탁에 앞서 내 호흡과 신체 긴장을 먼저 살피고, 어깨와 명치의 힘을 툭 빼는 1분 휴식 갖기",
    remedyAction: "무리한 일정 속에서 3번 깊게 심호흡하며 '나는 지금 온전히 쉴 자격이 있다'고 허락하기",
    symbol: "생명의 에메랄드 리프 (Emerald Leaf)",
    frequency: "528Hz 세포 재생과 심신 조화 주파수",
    playlist: "528Hz Forest Deep Healing",
    luckyNum: "4",
    luckyColor: "싱그러운 포레스트 에메랄드 그린"
  },
  indigo_sage: {
    egoResistance: "꼬리를 무는 과도한 생���(오버띵킹), 모든 상황을 머리로 계산하고 통제하려는 지적 에고의 불안",
    allowPrompt: "머릿속에서 끊임없이 미래를 시뮬레이션하며 정답만을 찾으려던 팽팽한 뇌의 과열을 허용할 수 있습니까?",
    releasePrompt: "모든 것을 알아야만 안심하던 지적 통제욕과 복잡한 번뇌의 실타래를 고요한 심연으로 흘려보낼 수 있습니까?",
    surrenderAffirmation: "나는 생각의 소음에서 한 걸음 물러나, 깊고 고요한 남색의 심연 속에서 직관의 침묵을 신뢰합니다.",
    dailyPractice: "복잡한 고민이 시작될 때 '생각은 내가 아니다'를 선언하고, 미간(제3의 눈)에 의식을 두며 머리의 열 식히기",
    remedyAction: "논리적 분석을 멈추고 30초간 눈을 감은 채 심장의 고동 소리에만 집중하기",
    symbol: "직관의 심해 등불 (Indigo Lantern)",
    frequency: "741Hz 직관 개안과 의식 명료화",
    playlist: "741Hz Deep Indigo Insight",
    luckyNum: "7",
    luckyColor: "심해의 미드나잇 인디고 블루"
  },
  golden_sun: {
    egoResistance: "성과와 성공에 집착하며 뒤처질까 두려워하는 결핍 의식, 남들의 인정과 칭찬에 목마른 인정 욕구",
    allowPrompt: "더 증명해야 하고 더 성과를 내야만 한다는 결핍감과 남들의 평가에 대한 초조함을 허용할 수 있습니까?",
    releasePrompt: "나의 가치를 조건부 성공에 묶어두었던 오랜 인정 욕구와 두려움을 찬란한 태양열 아래 녹여낼 수 있습니까?",
    surrenderAffirmation: "나는 성과로 나를 증명하려던 조급함을 내려놓고, 내 안에 이미 가득 찬 황금빛 태양의 풍요를 기쁘게 누립니다.",
    dailyPractice: "남과의 비교가 올라올 때마다 '나는 이미 충분하다'를 가슴에 새기고 지금 손에 쥔 것들에 감사하기",
    remedyAction: "타인의 시선을 의식하지 않고 오늘 내가 해낸 작은 결실 하나를 스스로 온전히 축하해주기",
    symbol: "풍요의 황금 태양관 (Golden Sun Crown)",
    frequency: "528Hz 풍요와 자존감 회복 주파수",
    playlist: "528Hz Golden Solar Abundance",
    luckyNum: "8",
    luckyColor: "찬란한 앰버 골드 & 썬샤인"
  },
  crimson_fire: {
    egoResistance: "뜻대로 되지 않을 때 솟구치는 붉은 분노와 조급함, 상황을 힘으로 억지로 뚫으려는 공격적 충동",
    allowPrompt: "가슴속에서 불타오르는 분노, 억울함, 조급한 폭발 충동을 억누르지 않고 있는 그대로 허용할 수 있습니까?",
    releasePrompt: "상황을 내 뜻대로 굴복시키려던 거친 통제욕과 화의 불씨를 시원한 생명수에 흘려보낼 수 있습니까?",
    surrenderAffirmation: "나는 분노의 거친 불꽃을 온화하게 내려놓고, 흔들리지 않는 내면의 숭고한 용기로 부드럽게 행동합니다.",
    dailyPractice: "울컥하는 화나 조급함이 올라올 때 즉각 말을 멈추고 10초간 찬물을 마시거나 가볍게 손발을 털어내기",
    remedyAction: "분노의 감정을 공격이 아닌 긍정적인 신체 스트레칭 에너지로 전환하여 방출하기",
    symbol: "용기의 루비 불꽃 (Ruby Flame)",
    frequency: "417Hz 부정적 감정 해체와 정화",
    playlist: "417Hz Crimson Fire Transmutation",
    luckyNum: "9",
    luckyColor: "강렬한 루비 크림슨 & 버건디"
  },
  solar_yellow: {
    egoResistance: "언제나 밝고 긍정적이어야 한다는 가면 강박, 지치거나 우울한 모습을 들키기 싫어 숨기는 감정 억압",
    allowPrompt: "지치고 무기력한 나를 감추려 억지 미소를 지었던 피로와 슬픔을 있는 그대로 허용할 수 있습니까?",
    releasePrompt: "타인에게 늘 좋은 모습만 보여주려던 가식과 인정 갈망을 따사로운 햇살 속에 미련 없이 흘려보낼 수 있습니까?",
    surrenderAffirmation: "나는 억지 긍정의 가면을 벗어던지고, 구름 뒤에서도 변함없이 빛나는 태양처럼 내 모든 감정을 다정하게 품습니다.",
    dailyPractice: "기쁜 척 억지로 반응하지 않고, 지금 느껴지는 솔직한 피로감이나 담담함을 나 자신에게 솔직히 인정해주기",
    remedyAction: "가식을 내려놓고 편안한 호흡과 함께 자연스러운 내 표정을 회복하기",
    symbol: "명랑의 황금 프리즘 (Solar Prism)",
    frequency: "528Hz 활력 충전과 감정 자유 주파수",
    playlist: "528Hz Solar Joy & Warmth",
    luckyNum: "3",
    luckyColor: "산뜻한 레몬 옐로우 & 시트린"
  },
  violet_mystic: {
    egoResistance: "현실의 답답함으로부터 도피하려는 무기력, 세상과 어울리지 못한다는 소외감과 높은 이상 사이의 괴리",
    allowPrompt: "거칠고 복잡한 현실로부터 숨어버리고 싶었던 고립감과 공허함을 가만히 안아주고 허용할 수 있습니까?",
    releasePrompt: "현실을 부정하고 나만의 성에 갇히게 만들던 에고의 영적 우월감과 환상을 자줏빛 불꽃에 흘려보낼 수 있습니까?",
    surrenderAffirmation: "나는 현실 도피의 환영을 거두고, 신비로운 자색의 광채 속에서 하늘의 영감과 대지의 일상을 하나로 통합합니다.",
    dailyPractice: "막연한 망상에 빠지기보다 손으로 만질 수 있는 주변의 물건을 정리하거나 현실의 작은 과제 하나를 차분히 매듭짓기",
    remedyAction: "발바닥 감각에 집중하며 영적 이상을 현실의 실천적 행동으로 접지(Grounding)하기",
    symbol: "신비의 아메시스트 (Amethyst Orb)",
    frequency: "963Hz 고차원 영성 통합 주파수",
    playlist: "963Hz Cosmic Violet Awakening",
    luckyNum: "7",
    luckyColor: "고귀한 로열 바이올렛 & 라벤더"
  },
  pink_harmony: {
    egoResistance: "거절당할까 봐 전전긍긍하는 두려움, 남의 기분을 맞추느라 자신을 희생하는 피플 플리징과 애착",
    allowPrompt: "사랑받지 못할까 봐 눈치 보고, 거절하지 못해 억눌러온 서운함과 불안을 있는 그대로 허용할 수 있습니까?",
    releasePrompt: "타인의 호감을 사기 위해 나를 소홀히 대했던 오랜 인정 갈망과 서러움을 부드러운 사랑 속에 흘려보낼 수 있습니까?",
    surrenderAffirmation: "나는 타인의 눈치를 보던 두려움을 내려놓고, 스스로를 향한 무조건적인 연민과 포근한 사랑으로 충만합니다.",
    dailyPractice: "남의 시선보다 내 마음의 편안함을 최우선에 두고, 내키지 않는 요청에는 부드럽고 단호하게 선 긋기",
    remedyAction: "가슴 한가운데 손을 얹고 '나는 나를 있는 그대로 깊이 사랑하고 존중한다'고 속삭여주기",
    symbol: "무조건적 사랑의 로즈쿼츠 (Rose Quartz Heart)",
    frequency: "639Hz 관계 조화와 자비의 주파수",
    playlist: "639Hz Heart Harmony & Compassion",
    luckyNum: "6",
    luckyColor: "포근한 파스텔 로즈 핑크"
  },
  turquoise_flow: {
    egoResistance: "하고 싶은 말을 삼키고 억누른 목의 답답함, 틀에 얽매여 자유롭게 나를 드러내지 못하는 표현의 공포",
    allowPrompt: "비난받을까 두려워 삼켜버렸던 수많은 말들과 목구멍에 맺힌 응어리를 있는 그대로 허용할 수 있습니까?",
    releasePrompt: "나를 검열하고 억압하던 침묵의 족쇄를 시원한 청록빛 바닷물결에 힘차게 흘려보낼 수 있습니까?",
    surrenderAffirmation: "나는 나를 가두던 두려움을 흘려보내고, 막힘없이 굽이치는 청록빛 강물처럼 가장 진실한 나를 세상에 노래합니다.",
    dailyPractice: "목과 턱의 긴장을 풀고 깊은 한숨과 함께 억눌린 음성을 작게 내뱉으며 목 차크라를 활짝 열어주기",
    remedyAction: "솔직한 내 생각이나 감정을 일기장에 여과 없이 단숨에 적어내려가며 표현의 숨통 틔우기",
    symbol: "자유로운 청록의 깃털 (Turquoise Feather)",
    frequency: "741Hz 표현의 해방과 목 차���라 정렬",
    playlist: "741Hz Ocean Flow & Free Expression",
    luckyNum: "5",
    luckyColor: "청량한 오션 터콰이즈 & 민트"
  },
  silver_moon: {
    egoResistance: "지나치게 예민하게 곤두선 신경, 과거의 상처와 기억에 휘둘려 밤마다 찾아오는 센티멘털한 불안",
    allowPrompt: "달의 차오름과 기울어짐처럼 시시각각 요동치는 내면의 감정 파도와 취약함을 판단 없이 허용할 수 있습니까?",
    releasePrompt: "지나간 과거의 후회와 아직 오지 않은 밤의 어둠에 얽매이던 미련을 고요한 은빛 달빛에 흘려보낼 수 있습니까?",
    surrenderAffirmation: "나는 지나간 시간에 대한 집착을 내려놓고, 부드러운 은빛 달의 품 안에서 깊고 아늑한 치유의 평온에 안식합니다.",
    dailyPractice: "감정이 소용돌이칠 때 억지로 멈추려 하지 말고, 밤하늘에 흘러가는 구름을 보듯 한 걸음 물러서서 지켜보기",
    remedyAction: "은빛 달빛을 상상하며 가슴속 차가운 서러움을 따뜻한 온기로 감싸 안아주기",
    symbol: "치유의 은빛 초승달 (Silver Crescent)",
    frequency: "852Hz 영적 직관과 감정 정화 주파수",
    playlist: "852Hz Moonlight Serenade & Peace",
    luckyNum: "2",
    luckyColor: "영롱한 펄 실버 & 문라이트"
  },
  amber_earth: {
    egoResistance: "물질적 결핍에 대한 만성적인 불안, 변화를 거부하고 기존 방식만을 완고하게 고집하는 집착",
    allowPrompt: "기반이 흔들릴까 두려워하며 손에 쥔 것을 꽉 움켜쥐고 있던 긴장과 불신의 떨림을 허용할 수 있습니까?",
    releasePrompt: "모든 것을 내 힘으로만 통제하려 했던 굳은 고집과 미래의 불안을 어머니 대지의 깊은 품으로 흘려보낼 수 있습니까?",
    surrenderAffirmation: "나는 미래에 대한 두려움을 흘려보내고, 흔들리지 않는 대지의 단단한 뿌리 위에서 절대적인 안전과 신뢰를 느낍니다.",
    dailyPractice: "양발을 바닥에 단단히 딛고 선 채 대지로부터 차오르는 든든한 안정감을 온몸으로 느껴보기",
    remedyAction: "돈이나 미래 걱정이 올라올 때마다 '대지가 나를 지탱하고 있다'며 흙의 기운으로 접지하기",
    symbol: "안식의 앰버 스톤 (Amber Grounding Gem)",
    frequency: "396Hz 두려움 해방과 루트 차크라 접지",
    playlist: "396Hz Root Earth Grounding",
    luckyNum: "4",
    luckyColor: "묵직한 웜 앰버 & 어스 브라운"
  },
  coral_passion: {
    egoResistance: "즐거움을 누리는 것에 대한 죄책감, 사람들과의 깊은 유대에서 오는 수치심과 자기 검열",
    allowPrompt: "기쁨을 온전히 누리지 못하고 나를 검열하던 굳은 수치심과 관계의 어색함을 그대로 허용할 수 있습니까?",
    releasePrompt: "스스로를 작고 부족한 존재로 단정 짓던 낡은 죄책감의 껍질을 산호빛 온기 속에 흔쾌히 흘려보낼 수 있습니까?",
    surrenderAffirmation: "나는 나를 옭아매던 수치심의 사슬을 벗어던지고, 따스한 산호빛 온기 속에서 삶의 축제를 온전히 누릴 자격이 있음을 선언합니다.",
    dailyPractice: "사소한 즐거움(맛있는 음식, 음악 감상)을 마주했을 때 어떠한 자책 없이 온전히 음미하기",
    remedyAction: "나 자신에게 '너는 행복을 누릴 자격이 충분하다'고 다정하게 축복 건네기",
    symbol: "축제의 산호 가지 (Coral Branch)",
    frequency: "528Hz 기쁨의 회복과 친밀감 주파수",
    playlist: "528Hz Living Coral Celebration",
    luckyNum: "6",
    luckyColor: "화사한 리빙 코랄 & 살구빛"
  },
  rainbow_light: {
    egoResistance: "흑백논리와 옳고 그름에 대한 집착, 타인과 나를 끊임없이 편 가르고 평가하는 분열적 에고",
    allowPrompt: "세상을 맞다 틀리다로 재단하며 날 선 긴장을 세우던 에고의 편협한 판단을 너그럽게 허용할 수 있습니까?",
    releasePrompt: "나만 옳아야 한다는 아집과 다름을 용납하지 못하던 배타성을 무지개 스펙트럼의 빛으로 흘려보낼 수 있습니까?",
    surrenderAffirmation: "나는 분리와 판단의 칼날을 거두고, 온 우주의 모든 다채로운 빛깔이 하나로 조화되는 거대한 통일장으로 녹아듭니다.",
    dailyPractice: "누군가의 행동이 마음에 들지 않을 때 '이 또한 우주의 한 조각이다'라며 판단의 스위치를 끄기",
    remedyAction: "다양성을 포용하는 무지개 빛을 가슴에 품고 모든 갈등의 대립각을 부드럽게 지우기",
    symbol: "통합의 무지개 스펙트럼 (Rainbow Prism)",
    frequency: "528Hz 전체성 회복과 다차원 통합",
    playlist: "528Hz Rainbow Spectrum Unity",
    luckyNum: "7",
    luckyColor: "신비로운 레인보우 홀로그램"
  },
  obsidian_protection: {
    egoResistance: "주변 사람들이 나를 해치거나 이용할 것이라는 피해의식, 과도하게 세워둔 뾰족한 방어벽과 경계심",
    allowPrompt: "상처받지 않기 위해 온몸에 가시를 세우고 세상을 의심하던 외로운 두려움을 있는 그대로 허용할 수 있습니까?",
    releasePrompt: "불신과 공포로 쌓아 올린 무거운 갑옷과 방어기제를 단단하고 맑은 흑요석의 대지에 흘려보낼 수 있습니까?",
    surrenderAffirmation: "나는 방어의 날 선 긴장을 내려놓으며, 내면의 순수한 참나 자체가 가장 완벽하고 불가침한 수호막임을 압니다.",
    dailyPractice: "타인을 경계하느라 굳어진 턱과 미간의 힘을 풀고, 내면의 고요한 성채 속에서 깊은 안전감을 만끽하기",
    remedyAction: "가상의 방어벽을 걷어내고 내 본연의 맑은 빛으로 공간을 스스로 수호하기",
    symbol: "수호의 흑요석 방패 (Obsidian Shield)",
    frequency: "417Hz 부정적 에너지 반사와 카르마 차단",
    playlist: "417Hz Obsidian Impenetrable Guard",
    luckyNum: "1",
    luckyColor: "단단한 옵시디언 블랙 & 차콜"
  },
  sapphire_peace: {
    egoResistance: "사람이나 약속, 미래를 믿지 못해 안달복달하는 의심, 내면의 잔물결 같은 만성적 조급함",
    allowPrompt: "모든 일이 잘못될까 봐 안절부절못하며 상황을 옥죄던 깊은 불신과 초조함을 가만히 허용할 수 있습니까?",
    releasePrompt: "내 힘으로만 미래를 통제하려던 무모한 불안을 끝없이 넓고 푸른 사파이어 바다에 흘려보낼 수 있습니까?",
    surrenderAffirmation: "나는 삶에 대한 모든 의심과 조급함을 내려놓고, 우주의 지혜로운 순리가 나를 가장 평화로운 길로 인도함을 온전히 신뢰합니다.",
    dailyPractice: "결과를 재촉하고 싶은 충동이 들 때마다 '가장 완벽한 때에 순리대로 풀린다'를 3번 되뇌기",
    remedyAction: "사파이어의 깊은 파란빛을 들이마시며 가슴속 의심의 파도를 잠재우기",
    symbol: "신뢰의 사파이어 젬 (Sapphire Gem)",
    frequency: "741Hz 진실한 평화와 의식의 안정",
    playlist: "741Hz Deep Sapphire Ocean Serenity",
    luckyNum: "8",
    luckyColor: "고결한 로열 사파이어 블루"
  },
  pearl_purity: {
    egoResistance: "남들에게 감추고 싶은 은밀한 결함과 열등감, 과거의 상처로 인해 스스로를 부끄러워하는 수치심",
    allowPrompt: "상처 입은 내 모습을 들킬까 봐 숨어버리던 부끄러움과 열등감의 응어리를 있는 그대로 허용할 수 있습니까?",
    releasePrompt: "나 자신을 미워하고 가혹하게 질책하던 오랜 수치심의 찌꺼기를 영롱한 진주조개 품에 흘려보낼 수 있습니까?",
    surrenderAffirmation: "나는 과거의 상처와 열등감을 평화롭게 내려놓으며, 그 모든 아픔이 나를 눈부신 진주로 빚어낸 거룩한 여정임을 찬미합니다.",
    dailyPractice: "스스로가 작게 느껴질 때마다 상처를 견뎌낸 가슴을 토닥이며 '너는 있는 그대로 참 곱고 귀하다'고 위로해주기",
    remedyAction: "부족한 나를 탓하지 않고 영롱한 진주의 빛으로 내면의 결함을 보석으로 승화하기",
    symbol: "순수의 영롱한 진주 (Lustrous Pearl)",
    frequency: "528Hz 내면의 미와 영혼 치유 주파수",
    playlist: "528Hz Pearl Purity & Rebirth",
    luckyNum: "2",
    luckyColor: "우아한 오팔 펄 화이트 & 크림"
  },
  copper_grounding: {
    egoResistance: "신체 신호를 무시한 채 머리로만 달려가는 과열, 에너지의 상기(上氣) 현상과 현실과의 괴리",
    allowPrompt: "몸의 비명을 무시한 채 목표만을 향해 뇌를 혹사했던 팽팽한 신경 과열을 있는 그대로 허용할 수 있습니까?",
    releasePrompt: "머리에만 가득 차 있던 생각의 열기와 전압을 전도체 같은 구리의 선을 타고 대지로 흘려보낼 수 있습니까?",
    surrenderAffirmation: "나는 머리의 과열된 전압을 대지로 방전하며, 머리끝부터 발끝까지 생명의 에너지가 막힘없이 순환하도록 내맡깁니다.",
    dailyPractice: "따뜻한 물을 천천히 마시며 의식을 머리에서 배꼽(단전)과 발바닥으로 부드럽게 끌어내리기",
    remedyAction: "신발을 벗고 발바닥을 문지르며 과열된 머리의 열기를 대지로 시원하게 방출하기",
    symbol: "연결의 구리 코일 (Copper Conductor)",
    frequency: "432Hz 신체 신경 정렬과 접지 주파수",
    playlist: "432Hz Copper Grounding Flow",
    luckyNum: "3",
    luckyColor: "붉은빛의 샤이니 코퍼 메탈릭"
  },
  platinum_evolution: {
    egoResistance: "익숙하고 편안한 과거의 낡은 패턴에 안주하려는 게으름, 알을 깨고 나오는 진화에 대한 두려움",
    allowPrompt: "변화가 두려워 낡은 껍질 속에 숨어 안락함만을 좇으려던 나태함과 두려움을 있는 그대로 허용할 수 있습니까?",
    releasePrompt: "유효기간이 지난 과거의 정체성과 좁은 한계를 백금의 뜨거운 도가니 속에 깨끗이 흘려보낼 수 있습니까?",
    surrenderAffirmation: "나는 낡은 자아의 껍질을 미련 없이 벗어던지고, 더 높은 차원의 영적 도약과 눈부신 진화로 당당히 비상합니다.",
    dailyPractice: "늘 하던 익숙한 습관이나 생각의 틀을 오늘 의도적으로 한 가지 바꾸어보며 뇌를 깨우기",
    remedyAction: "과거의 나에 대한 미련을 접고 백금의 빛으로 새로운 의식 차원으로 도약하기",
    symbol: "도약의 백금 날개 (Platinum Wings)",
    frequency: "963Hz 차원 상승과 의식 도약 주파수",
    playlist: "963Hz Platinum Quantum Evolution",
    luckyNum: "9",
    luckyColor: "빛나는 플래티넘 실버 & 메탈릭"
  },
  bronze_strength: {
    egoResistance: "약함을 보이면 안 된다는 가혹한 무장, 누구에게도 털어놓지 못하고 홀로 짊어지려는 영웅 콤플렉스",
    allowPrompt: "무너지지 않으려 강철처럼 버티며 홀로 외롭게 신음하던 가슴속 묵직한 부담감을 허용할 수 있습니까?",
    releasePrompt: "나를 짓누르던 무거운 무쇠 갑옷과 '내가 다 해결해야 한다'는 강박을 청동의 품에 털어내 흘려보낼 수 있습니까?",
    surrenderAffirmation: "나는 억지로 강한 척하던 갑옷을 벗어던지고, 진정한 유연함과 부드러움 속에 깃든 본연의 강인함으로 온전히 편안해집니다.",
    dailyPractice: "힘들다는 감정을 솔직히 인정하고, 주변 사람의 작은 배려나 도움을 기꺼이 받아들이기",
    remedyAction: "어깨를 무겁게 짓누르던 갑옷을 내려놓고 청동 방패의 든든한 품에 내 짐을 맡기기",
    symbol: "불굴의 청동 방패 (Bronze Aegis)",
    frequency: "432Hz 내면의 뚝심과 회복탄력성",
    playlist: "432Hz Bronze Pillar of Strength",
    luckyNum: "5",
    luckyColor: "중후한 앤티크 브론즈 & 코퍼"
  },
  jade_balance: {
    egoResistance: "건강이나 미래의 균형이 깨질까 전전긍긍하는 불안, 작은 신체 이상이나 불운의 징조에 과민반응하는 공포",
    allowPrompt: "내 삶의 균형이 무너질까 봐 늘 조마조마해하던 결핍의 공포와 긴장을 있는 그대로 허용할 수 있습니까?",
    releasePrompt: "질병과 불운에 대한 만성적 걱정을 맑고 싱그러운 비취의 생명수에 깨끗이 흘려보낼 수 있습니까?",
    surrenderAffirmation: "나는 무너짐에 대한 모든 공포를 흘려보내고, 옥빛 비취의 자비로운 생명력이 내 몸과 운명의 모든 균형을 완벽히 복구함을 믿습니다.",
    dailyPractice: "몸의 특정 부위에 긴장이 느껴질 때 비취의 시원한 옥빛을 떠올리며 그 부위를 이완하기",
    remedyAction: "온몸의 세포에 옥빛 생명수를 붓듯 따뜻한 감사와 온기를 불어넣기",
    symbol: "조화와 치유의 비취석 (Jade Amulet)",
    frequency: "528Hz 완전한 생명 균형과 건강 주파수",
    playlist: "528Hz Imperial Jade Harmony",
    luckyNum: "8",
    luckyColor: "청아한 임페리얼 제이드 그린"
  },
  crystal_clarity: {
    egoResistance: "머릿속에 안개가 낀 듯한 멍함(브레인 포그), 결정을 내리지 못하고 우유부단하게 에너지를 흘리는 분산",
    allowPrompt: "갈팡질팡하며 갈 길을 찾지 못하고 잡념의 소용돌이에 갇혀 있던 혼란과 답답함을 허용할 수 있습니까?",
    releasePrompt: "결정하지 못하고 미루게 만들던 두려움과 잡념의 먼지들을 수정처럼 맑은 광선 속에 깨끗이 흘려보낼 수 있습니까?",
    surrenderAffirmation: "나는 마음에 낀 모든 뿌연 안개를 흘려보내고, 한 점 흐림 없는 투명한 수정의 눈으로 우주의 진실을 꿰뚫어 봅니다.",
    dailyPractice: "우선순위가 아닌 불필요한 생각들을 종이에 적어 구겨 버리고, 오직 지금 해야 할 딱 한 가지에만 몰입하기",
    remedyAction: "잡념의 안개를 걷어내고 수정 구슬처럼 투명한 명료함으로 오늘의 핵심에 집중하기",
    symbol: "투명한 진리의 수정구 (Crystal Sphere)",
    frequency: "852Hz 뇌파 동조와 직관적 명료성",
    playlist: "852Hz Pure Crystal Clarity",
    luckyNum: "1",
    luckyColor: "투명한 크리스탈 클리어 & 아이스 블루"
  },
  cosmic_nebula: {
    egoResistance: "나를 하찮고 작은 존재로 여기는 무력감, 거대한 우주 속에서 홀로 버려졌다는 우주적 고립감과 공허",
    allowPrompt: "끝없는 막막함 속에서 나를 작고 무력한 티끌로 가두었던 에고의 무력감과 공허를 있는 그대로 허용할 수 있습니까?",
    releasePrompt: "나를 고립된 섬으로 묶어두었던 제한된 에고의 시야를 광활하게 펼쳐진 우주 성운의 품으로 흘려보낼 수 있습니까?",
    surrenderAffirmation: "나는 왜소한 에고의 한계를 벗어던지고, 은하계의 무한한 숨결과 하나로 호흡하는 광대하고 영원한 우주 의식으로 깨어납니다.",
    dailyPractice: "밤하늘이나 먼 지평선을 바라보며 가슴을 활짝 열고 우주의 무한한 품에 나를 내맡기기",
    remedyAction: "왜소한 나를 내려놓고 은하계의 품 안에서 광대무변한 참나의 자유를 호흡하기",
    symbol: "무한의 나선 성운 (Cosmic Nebula Vortex)",
    frequency: "963Hz 우주 의식과의 완전한 합일",
    playlist: "963Hz Cosmic Nebula Infinite Expansion",
    luckyNum: "0",
    luckyColor: "심오한 네뷸라 퍼플 & 코스믹 블랙"
  }
};

/**
 * 세도나 방하착 카드에 기반한 완전 맞춤형 릴리즈 오라클 생성 엔진
 */
export function buildSpecificSedonaDailyOracle(
  card: AuraThemeCard,
  theme?: string,
  mode: string = "sedona"
): DailyOracleResult {
  const cardName = card.nameKo;
  const cardEn = card.name;
  const keywords = (card.keywords || []).join(", ");
  const cardDesc = card.desc;
  const themeName = theme || "일상 정서 방하착";

  const profile = SEDONA_CARD_PROFILES[card.id] || {
    egoResistance: `[${cardName}] 카드가 비추는 무의식의 저항과 결핍 갈망`,
    allowPrompt: `지금 가슴속에 일어나는 [${cardName}] 카드의 감정과 묵직한 에고의 저항을 있는 그대로 허용할 수 있습니까?`,
    releasePrompt: `이 쥐고 있던 생각과 통제 욕구를 강물에 띄우듯 흘려보낼 수 있습니까?`,
    surrenderAffirmation: `나는 [${cardName}] 카드가 비추는 에고의 저항을 자각하며, 오랜 집착을 평화롭게 흘려보냅니다.`,
    dailyPractice: `오늘 하루 [${cardName}]의 빛을 가슴에 품고 호흡과 함께 저항을 10초간 흘려보내기`,
    remedyAction: `[${cardName}] 카드의 테마(${keywords})를 상기하며, 호흡을 내쉴 때마다 가슴속 긴장과 저항을 온전히 흘려보내기`,
    symbol: `${cardName}의 정화 크리스탈`,
    frequency: "528Hz 솔페지오 사랑과 치유의 주파수",
    playlist: "528Hz Cellular Healing & Release",
    luckyNum: "7",
    luckyColor: `${cardName}의 고유 오라 빛깔`
  };

  const diagnosis = `### 🌿 [${cardName} (${cardEn})] 카드의 에고 정화 테마와 의식 정렬
오늘 당신의 무의식 정화 세션에 도출된 방하착 치유 카드는 **[${cardName}]**입니다.
- **카드의 고유 파동**: ${cardDesc}
- **핵심 정화 키워드**: **${keywords}**
- **정렬 테마**: **${themeName}**

### ⛓️ [${cardName}] 카드가 비추는 에고의 억압 감정과 저항 패턴
현재 당신의 무의식 장에서 긴장과 피로를 유발하던 핵심 전압은 **${profile.egoResistance}**입니다. 에고가 무의식적으로 쥐고 있던 통제욕과 불안의 실체를 **[${cardName}]** 카드의 맑은 거울에 비추어 자각하는 순간, 굳게 닫혔던 억압의 매듭이 풀리기 시작합니다.

### 🌊 [${cardName}] 맞춤 세도나 4단계 방하착 (Sedona 4-Step Releasing)
1. **허용하기 (Could I allow it?)**: ${profile.allowPrompt}
   👉 *“네, 어떠한 판단이나 억압 없이 온전히 허용합니다.”*
2. **흘려보내기 (Could I let it go?)**: ${profile.releasePrompt}
   👉 *“네, 힘을 빼고 자연스럽게 흘려보냅니다.”*
3. **기꺼이 놓아버리기 (Would I let it go?)**: 내면의 절대적 자유와 영원한 평화를 위해 지금 기꺼이 놓아버리겠습니까?
   👉 *“네, 망설임 없이 기꺼이 내려놓겠습니다.”*
4. **지금 이 순간 (When?)**: **지금 당장 (NOW)**, 가슴의 빗장을 열고 깊은 날숨과 함께 온전히 항복(Surrender)하십시오.

### 🕊️ [${cardName}]의 에고 해방과 영혼의 항복 확언 (Hawkins Letting Go)
> **“${profile.surrenderAffirmation}”**

### 🧭 오늘의 방하착 실천 지침 (Daily Releasing Practice)
${profile.dailyPractice}
**[${cardName}]** 카드의 신성한 빛이 당신의 가슴 한가운데를 비추고 있음을 기억하며, 저항을 멈춘 자리에 깃드는 무한한 자유와 평온을 누리십시오.`;

  return {
    diagnosis,
    luckyNumber: profile.luckyNum,
    luckyColor: profile.luckyColor,
    remedy: profile.remedyAction,
    symbol: profile.symbol,
    frequency: profile.frequency,
    spiritualEnergy: `[${cardName}] 카드의 치유 파동이 가슴 차크라와 공명하여 에고의 저항(${keywords})을 녹여내고 본연의 평온을 회복시킵니다.`,
    blessingMessage: `모든 집착과 긴장이 스러진 고요한 자리에서 [${cardName}]의 청정한 빛이 당신의 오늘 하루를 온전히 축복합니다.`,
    focusPlaylist: profile.playlist,
  };
}


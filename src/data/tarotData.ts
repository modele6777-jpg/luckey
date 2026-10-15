export interface TarotCard {
  id: string;
  name: string;
  nameKo: string;
  type: 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';
  keywords: string[];
  /** 정/역방향 — 카드 뽑기 시 할당 */
  reversed?: boolean;
}

/** 약 40% 확률로 역방향 (drawCards와 동일 비율) */
export function rollTarotReversed(): boolean {
  return Math.random() > 0.6;
}

export function formatTarotOrientation(card: TarotCard): string {
  return card.reversed ? '역방향' : '정방향';
}

export const TAROT_DECK: TarotCard[] = [
  { id: "major_0", name: "The Fool", nameKo: "광대", type: "major", keywords: ["시작", "순수", "자유", "모험"] },
  { id: "major_1", name: "The Magician", nameKo: "마법사", type: "major", keywords: ["창조", "의지", "능력", "집중"] },
  { id: "major_2", name: "The High Priestess", nameKo: "여사제", type: "major", keywords: ["직관", "비밀", "지혜", "무의식"] },
  { id: "major_3", name: "The Empress", nameKo: "여황제", type: "major", keywords: ["풍요", "모성", "자연", "아름다움"] },
  { id: "major_4", name: "The Emperor", nameKo: "황제", type: "major", keywords: ["권위", "구조", "통제", "안정"] },
  { id: "major_5", name: "The Hierophant", nameKo: "교황", type: "major", keywords: ["전통", "가르침", "신념", "규범"] },
  { id: "major_6", name: "The Lovers", nameKo: "연인", type: "major", keywords: ["사랑", "조화", "선택", "가치"] },
  { id: "major_7", name: "The Chariot", nameKo: "전차", type: "major", keywords: ["승리", "의지", "통제", "전진"] },
  { id: "major_8", name: "Strength", nameKo: "힘", type: "major", keywords: ["용기", "인내", "설득", "내면의 힘"] },
  { id: "major_9", name: "The Hermit", nameKo: "은둔자", type: "major", keywords: ["성찰", "탐구", "고독", "내면의 지혜"] },
  { id: "major_10", name: "Wheel of Fortune", nameKo: "운명의 수레바퀴", type: "major", keywords: ["순환", "운명", "변화", "전환점"] },
  { id: "major_11", name: "Justice", nameKo: "정의", type: "major", keywords: ["공정", "균형", "원인과 결과", "진실"] },
  { id: "major_12", name: "The Hanged Man", nameKo: "매달린 사람", type: "major", keywords: ["희생", "새로운 시각", "기다림", "내려놓음"] },
  { id: "major_13", name: "Death", nameKo: "죽음", type: "major", keywords: ["끝과 시작", "변형", "해빙", "정화"] },
  { id: "major_14", name: "Temperance", nameKo: "절제", type: "major", keywords: ["균형", "조절", "중용", "치유"] },
  { id: "major_15", name: "The Devil", nameKo: "악마", type: "major", keywords: ["집착", "구속", "그림자", "물질주의"] },
  { id: "major_16", name: "The Tower", nameKo: "탑", type: "major", keywords: ["갑작스러운 변화", "파괴", "깨달음", "해방"] },
  { id: "major_17", name: "The Star", nameKo: "별", type: "major", keywords: ["희망", "영감", "평안", "치유"] },
  { id: "major_18", name: "The Moon", nameKo: "달", type: "major", keywords: ["환상", "불안", "직관", "무의식"] },
  { id: "major_19", name: "The Sun", nameKo: "태양", type: "major", keywords: ["기쁨", "성공", "긍정", "활력"] },
  { id: "major_20", name: "Judgement", nameKo: "심판", type: "major", keywords: ["재탄생", "부름", "각성", "결단"] },
  { id: "major_21", name: "The World", nameKo: "세계", type: "major", keywords: ["완성", "통합", "성취", "순환의 끝"] },
  
  // Wands
  { id: "wands_1", name: "Ace of Wands", nameKo: "지팡이 에이스", type: "wands", keywords: ["도약", "열정", "창조력", "새로운 기회"] },
  { id: "wands_2", name: "Two of Wands", nameKo: "지팡이 2", type: "wands", keywords: ["선택", "확장", "계획", "준비"] },
  { id: "wands_3", name: "Three of Wands", nameKo: "지팡이 3", type: "wands", keywords: ["탐험", "선견지명", "리더십", "팀워크"] },
  { id: "wands_4", name: "Four of Wands", nameKo: "지팡이 4", type: "wands", keywords: ["축하", "안정", "성취", "가정"] },
  { id: "wands_5", name: "Five of Wands", nameKo: "지팡이 5", type: "wands", keywords: ["경쟁", "갈등", "협상", "의견 대립"] },
  { id: "wands_6", name: "Six of Wands", nameKo: "지팡이 6", type: "wands", keywords: ["승리", "인정", "성공", "자부심"] },
  { id: "wands_7", name: "Seven of Wands", nameKo: "지팡이 7", type: "wands", keywords: ["방어", "도전", "경쟁 속의 유지", "결단력"] },
  { id: "wands_8", name: "Eight of Wands", nameKo: "지팡이 8", type: "wands", keywords: ["빠른 전개", "행동", "소식", "민첩함"] },
  { id: "wands_9", name: "Nine of Wands", nameKo: "지팡이 9", type: "wands", keywords: ["회복력", "경계", "인내", "지속적인 노력"] },
  { id: "wands_10", name: "Ten of Wands", nameKo: "지팡이 10", type: "wands", keywords: ["책임감", "부담", "과로", "목표의 무게"] },
  { id: "wands_11", name: "Page of Wands", nameKo: "지팡이 시종", type: "wands", keywords: ["메신저", "호기심", "창조적 시작", "새로운 소식"] },
  { id: "wands_12", name: "Knight of Wands", nameKo: "지팡이 기사", type: "wands", keywords: ["열정적", "충동적", "행동 지향적", "모험을 즐기는"] },
  { id: "wands_13", name: "Queen of Wands", nameKo: "지팡이 여왕", type: "wands", keywords: ["자신감", "카리스마", "독립적", "매력적인"] },
  { id: "wands_14", name: "King of Wands", nameKo: "지팡이 왕", type: "wands", keywords: ["비전", "지도력", "영감", "야망"] },

  // Cups
  { id: "cups_1", name: "Ace of Cups", nameKo: "컵 에이스", type: "cups", keywords: ["사랑", "감정의 시작", "친밀감", "영감"] },
  { id: "cups_2", name: "Two of Cups", nameKo: "컵 2", type: "cups", keywords: ["결합", "파트너십", "로맨스", "상호 존중"] },
  { id: "cups_3", name: "Three of Cups", nameKo: "컵 3", type: "cups", keywords: ["축하", "우정", "협력", "즐거움"] },
  { id: "cups_4", name: "Four of Cups", nameKo: "컵 4", type: "cups", keywords: ["무관심", "명상", "새로운 제안 무시", "휴식"] },
  { id: "cups_5", name: "Five of Cups", nameKo: "컵 5", type: "cups", keywords: ["상실", "슬픔", "후회", "비관"] },
  { id: "cups_6", name: "Six of Cups", nameKo: "컵 6", type: "cups", keywords: ["추억", "향수", "어린 시절", "순수함"] },
  { id: "cups_7", name: "Seven of Cups", nameKo: "컵 7", type: "cups", keywords: ["선택", "환상", "유혹", "혼란"] },
  { id: "cups_8", name: "Eight of Cups", nameKo: "컵 8", type: "cups", keywords: ["떠남", "포기", "내면의 여정", "이동"] },
  { id: "cups_9", name: "Nine of Cups", nameKo: "컵 9", type: "cups", keywords: ["소원 성취", "만족", "감사", "자부심"] },
  { id: "cups_10", name: "Ten of Cups", nameKo: "컵 10", type: "cups", keywords: ["행복", "가족", "평화", "감정적 성취"] },
  { id: "cups_11", name: "Page of Cups", nameKo: "컵 시종", type: "cups", keywords: ["메신저", "상상력", "동정심", "새로운 관계"] },
  { id: "cups_12", name: "Knight of Cups", nameKo: "컵 기사", type: "cups", keywords: ["로맨틱", "이상주의", "매력적인", "제안"] },
  { id: "cups_13", name: "Queen of Cups", nameKo: "컵 여왕", type: "cups", keywords: ["위로", "직관적", "공감", "감정의 깊이"] },
  { id: "cups_14", name: "King of Cups", nameKo: "컵 왕", type: "cups", keywords: ["관대함", "감정적 조절", "조언자", "외교력"] },

  // Swords
  { id: "swords_1", name: "Ace of Swords", nameKo: "검 에이스", type: "swords", keywords: ["진실", "결단력", "명확성", "승리"] },
  { id: "swords_2", name: "Two of Swords", nameKo: "검 2", type: "swords", keywords: ["무승부", "회피", "타협", "균형 유지"] },
  { id: "swords_3", name: "Three of Swords", nameKo: "검 3", type: "swords", keywords: ["슬픔", "상처", "이별", "고통스러운 진실"] },
  { id: "swords_4", name: "Four of Swords", nameKo: "검 4", type: "swords", keywords: ["휴식", "회복", "명상", "정지"] },
  { id: "swords_5", name: "Five of Swords", nameKo: "검 5", type: "swords", keywords: ["패배", "갈등", "이기심", "불명예"] },
  { id: "swords_6", name: "Six of Swords", nameKo: "검 6", type: "swords", keywords: ["전환", "치유", "이동", "문제 해결"] },
  { id: "swords_7", name: "Seven of Swords", nameKo: "검 7", type: "swords", keywords: ["기만", "은밀함", "전략", "속임수"] },
  { id: "swords_8", name: "Eight of Swords", nameKo: "검 8", type: "swords", keywords: ["구속", "제한", "피해 의식", "무력감"] },
  { id: "swords_9", name: "Nine of Swords", nameKo: "검 9", type: "swords", keywords: ["불안", "걱정", "악몽", "죄책감"] },
  { id: "swords_10", name: "Ten of Swords", nameKo: "검 10", type: "swords", keywords: ["파멸", "최악의 상황", "종말", "배신"] },
  { id: "swords_11", name: "Page of Swords", nameKo: "검 시종", type: "swords", keywords: ["경계", "호기심", "분석적", "새로운 정보"] },
  { id: "swords_12", name: "Knight of Swords", nameKo: "검 기사", type: "swords", keywords: ["돌진", "논리적", "행동파", "성급함"] },
  { id: "swords_13", name: "Queen of Swords", nameKo: "검 여왕", type: "swords", keywords: ["명확성", "독립성", "냉정함", "분석력"] },
  { id: "swords_14", name: "King of Swords", nameKo: "검 왕", type: "swords", keywords: ["권위", "진실", "이성", "공정함"] },

  // Pentacles
  { id: "pent_1", name: "Ace of Pentacles", nameKo: "펜타클 에이스", type: "pentacles", keywords: ["번영", "물질적 여유", "새로운 기반", "실질적 기회"] },
  { id: "pent_2", name: "Two of Pentacles", nameKo: "펜타클 2", type: "pentacles", keywords: ["적응력", "유연성", "균형 조절", "우선순위 관리"] },
  { id: "pent_3", name: "Three of Pentacles", nameKo: "펜타클 3", type: "pentacles", keywords: ["협력", "기술", "계획", "팀워크"] },
  { id: "pent_4", name: "Four of Pentacles", nameKo: "펜타클 4", type: "pentacles", keywords: ["집착", "통제", "안전 추구", "보수적"] },
  { id: "pent_5", name: "Five of Pentacles", nameKo: "펜타클 5", type: "pentacles", keywords: ["결핍", "가난", "고립", "고난"] },
  { id: "pent_6", name: "Six of Pentacles", nameKo: "펜타클 6", type: "pentacles", keywords: ["자비", "나눔", "관대함", "재정적 균형"] },
  { id: "pent_7", name: "Seven of Pentacles", nameKo: "펜타클 7", type: "pentacles", keywords: ["인내", "수확", "기다림", "장기적 투자"] },
  { id: "pent_8", name: "Eight of Pentacles", nameKo: "펜타클 8", type: "pentacles", keywords: ["장인정신", "노력", "디테일", "집중"] },
  { id: "pent_9", name: "Nine of Pentacles", nameKo: "펜타클 9", type: "pentacles", keywords: ["풍요", "독립", "사치", "성취의 감상"] },
  { id: "pent_10", name: "Ten of Pentacles", nameKo: "펜타클 10", type: "pentacles", keywords: ["가족", "부", "유산", "장기적 성공"] },
  { id: "pent_11", name: "Page of Pentacles", nameKo: "펜타클 시종", type: "pentacles", keywords: ["근면", "실용적", "목표 지향적", "새 프로젝트"] },
  { id: "pent_12", name: "Knight of Pentacles", nameKo: "펜타클 기사", type: "pentacles", keywords: ["신뢰성", "성실함", "인내", "보수적 발전"] },
  { id: "pent_13", name: "Queen of Pentacles", nameKo: "펜타클 여왕", type: "pentacles", keywords: ["육성", "풍요", "실제적인", "현실적 애정"] },
  { id: "pent_14", name: "King of Pentacles", nameKo: "펜타클 왕", type: "pentacles", keywords: ["성공", "주도성", "비즈니스", "안전망"] }
];

export interface TarotReversedData {
  keywords: string[];
  meaning: string;
  advice: string;
}

export const TAROT_REVERSED_DATA: Record<string, TarotReversedData> = {
  major_0: {
    keywords: ["무모함", "경솔함", "준비 부족", "위험한 방황", "책임 회피"],
    meaning: "자유를 향한 갈망이 지나쳐 현실적인 위험과 준비 부족을 간과하고 있음을 경고합니다. 무계획적인 돌진은 낭패로 이어질 수 있습니다.",
    advice: "발걸음을 내딛기 전 한 번 더 발밑의 낭떠러지를 살피고, 기본적인 안전장치와 계획을 점검하세요."
  },
  major_1: {
    keywords: ["속임수", "의지 박약", "재능 낭비", "조작", "소통 오류"],
    meaning: "자신의 재능과 지식을 엉뚱한 곳에 소모하거나, 진실되지 못한 수단으로 상황을 통제하려다 신뢰를 잃을 위험을 나타냅니다.",
    advice: "정직한 의도로 돌아가고, 얕은꾀나 과장 대신 본연의 실력을 묵묵히 갈고닦아야 합니다."
  },
  major_2: {
    keywords: ["직관 차단", "비밀 탄로", "감정 억압", "표면적 집착", "차가운 단절"],
    meaning: "내면의 고요한 목소리를 외면한 채 외부 소음에 휘둘리거나, 마음을 지나치게 닫아버려 타인과 벽을 쌓고 있음을 나타냅니다.",
    advice: "머리로 재단하려 하지 말고 혼자만의 고요한 시간을 통해 가슴 깊은 곳의 진실한 느낌에 귀를 기울이세요."
  },
  major_3: {
    keywords: ["창조성 고갈", "과잉보호", "의존성", "자기돌봄 소홀", "정체"],
    meaning: "타인에게 에너지를 지나치게 퍼주어 스스로 번아웃에 빠졌거나, 반대로 타인에게 과도하게 의존하고 있음을 뜻합니다.",
    advice: "남을 돌보기 전에 먼저 자신의 신체와 마음에 쉼과 영양을 선물하고, 결핍감을 스스로 채워주세요."
  },
  major_4: {
    keywords: ["독재", "통제 상실", "경직됨", "고집", "불안정한 기반"],
    meaning: "상황이나 사람을 지나치게 통제하려다 저항을 부르거나, 반대로 원칙과 규율이 무너져 혼란에 직면했음을 가리킵니다.",
    advice: "완벽한 통제에 대한 집착을 내려놓고, 유연성을 발휘하여 타인의 의견을 포용하는 부드러운 리더십을 발휘하세요."
  },
  major_5: {
    keywords: ["인습 타파", "교조주의 비판", "새로운 신념", "부적절한 조언", "자유 추구"],
    meaning: "낡은 관습이나 타인의 잣대에 갇혀 답답함을 느끼고 있거나, 검증되지 않은 조언에 맹목적으로 끌리고 있음을 경고합니다.",
    advice: "외부 권위나 통념에 의존하지 말고, 자신의 양심과 가치관에 부합하는 주체적인 길을 선택하세요."
  },
  major_6: {
    keywords: ["불화", "잘못된 선택", "가치관 충돌", "내적 갈등", "소통 부재"],
    meaning: "관계에서의 오해와 불협화음, 또는 두 갈래 길목에서 중심을 잡지 못해 갈등하고 있는 내적 분열 상태를 암시합니다.",
    advice: "눈앞의 이익이나 일시적 감정에 휩쓸리지 말고, 나의 가장 본질적인 가치관이 지향하는 쪽을 신중히 선택하세요."
  },
  major_7: {
    keywords: ["방향 상실", "통제 불능", "폭주", "좌절", "공격적 충동"],
    meaning: "의욕이 앞서 속도를 주체하지 못하고 탈선 위기에 처했거나, 장애물 앞에서 과도한 분노와 피로를 겪고 있음을 뜻합니다.",
    advice: "가속 페달에서 발을 떼고 브레이크를 밟으세요. 내면의 충돌하는 두 감정의 고삐를 다시 정돈해야 합니다."
  },
  major_8: {
    keywords: ["자신감 결여", "자기불신", "억압된 분노", "나약함", "조급한 강요"],
    meaning: "내면의 두려움이나 억눌린 감정 에너지에 압도되어 무기력해졌거나, 부드러운 설득 대신 힘으로 밀어붙이려 함을 보여줍니다.",
    advice: "내 안의 야수 같은 감정을 윽박지르지 말고, 따뜻한 자비심으로 어루만지며 내면의 부드러운 회복탄력성을 회복하세요."
  },
  major_9: {
    keywords: ["고립", "외로움", "현실 도피", "조언 거부", "지나친 폐쇄"],
    meaning: "건강한 성찰을 넘어 세상과의 소통을 완전히 단절하고 외로움과 고집의 동굴에 갇혀 있음을 경고합니다.",
    advice: "혼자만의 방에서 나와 등불의 빛을 세상과 나누고, 신뢰할 수 있는 이들의 진심 어린 손길을 받아들이세요."
  },
  major_10: {
    keywords: ["일시적 불운", "흐름의 정체", "변화 저항", "통제 불능의 변수", "과거 집착"],
    meaning: "예상치 못한 정체기나 원치 않는 환경적 변화를 맞아 무력감을 느끼고 있음을 나타냅니다. 운의 썰물 타이밍입니다.",
    advice: "밀물과 썰물처럼 모든 것은 순환합니다. 억지로 물길을 거스르지 말고, 잠시 호흡을 가다듬으며 다음 도약의 파도를 준비하세요."
  },
  major_11: {
    keywords: ["불공정", "편견", "책임 회피", "가혹한 비판", "불균형"],
    meaning: "자신이나 타인을 지나치게 가혹하게 단죄하고 있거나, 마땅히 져야 할 책임을 회피하여 인과가 꼬여 있음을 보여줍니다.",
    advice: "감정적 편견을 걷어내고 객관적인 사실만을 직시하세요. 스스로에게 솔직해질 때 비로소 진정한 균형이 잡힙니다."
  },
  major_12: {
    keywords: ["헛된 희생", "정체", "고집", "내려놓지 못함", "시간 낭비"],
    meaning: "의미 없는 고통을 자처하며 상황을 방치하고 있거나, 꼭 놓아야 할 집착을 끝끝내 붙들고 있어 정체되었음을 암시합니다.",
    advice: "피해자 의식을 내려놓으세요. 스스로 결박을 풀고 관점을 180도 바꾸면 전혀 새로운 해결의 길이 보입니다."
  },
  major_13: {
    keywords: ["변화에 대한 공포", "과거에의 미련", "정체", "지연된 결말", "새출발 망설임"],
    meaning: "이미 수명을 다한 관계, 습관, 상황을 억지로 붙잡고 있어 새로운 생명의 탄생이 지연되고 있음을 뜻합니다.",
    advice: "썩은 잎이 떨어져야 새싹이 돋아납니다. 두려움 없이 과감하게 마침표를 찍고 깨끗이 흘려보내세요."
  },
  major_14: {
    keywords: ["불균형", "과도함", "조급증", "갈등", "조화 결여"],
    meaning: "생활 리듬이 깨지거나 한쪽 극단으로 치우쳐 심신의 피로와 마찰이 발생하고 있음을 경고합니다.",
    advice: "무리한 일정을 덜어내고 타협과 중용을 찾으세요. 물과 불의 균형을 맞추듯 속도를 반으로 늦추어야 합니다."
  },
  major_15: {
    keywords: ["사슬 끊기", "집착에서의 해방", "그림자 자각", "자유 회복", "유혹 극복"],
    meaning: "자신을 옭아매던 중독, 강박, 가스라이팅, 물질적 두려움의 족쇄를 알아차리고 벗어나기 시작하는 해방의 문턱입니다.",
    advice: "사슬은 당신 목에 헐겁게 걸려 있을 뿐입니다. 내 손으로 직접 사슬을 벗어던지고 온전한 주권을 되찾으세요."
  },
  major_16: {
    keywords: ["재난 모면", "지연된 위기", "불안한 유지", "내적 붕괴", "혁신 망설임"],
    meaning: "붕괴가 임박한 모래성을 불안하게 떠받치고 있거나, 불가피한 쇄신을 애써 외면하고 있음을 암시합니다.",
    advice: "거짓된 기초 위에 쌓은 탑은 무너져야 마땅합니다. 두려워하지 말고 낡은 껍질을 스스로 깨고 나오세요."
  },
  major_17: {
    keywords: ["희망 상실", "비관주의", "자신감 결여", "영감 단절", "불신"],
    meaning: "빛이 보이지 않는다는 절망감에 빠져 자신의 별빛 같은 가능성을 스스로 깎아내리고 있음을 보여줍니다.",
    advice: "밤이 깊을수록 별은 더욱 또렷하게 빛납니다. 스스로를 믿고 가슴속 희망의 불씨를 꺼뜨리지 마세요."
  },
  major_18: {
    keywords: ["혼란 해소", "두려움 극복", "진실 규명", "착각에서 깨어남", "안개 걷힘"],
    meaning: "불안과 공포를 만들어내던 왜곡된 상상에서 벗어나 사물의 본모습을 객관적으로 마주하기 시작하는 전환점입니다.",
    advice: "그림자에 놀라지 마세요. 막연한 두려움의 정체를 똑바로 직시하면 실체 없는 허상이었음을 알게 됩니다."
  },
  major_19: {
    keywords: ["일시적 먹구름", "성공 지연", "과도한 자만", "에너지 소진", "가려진 활력"],
    meaning: "본래의 밝은 생명력과 기쁨이 일시적인 근심이나 번아웃으로 먹구름 뒤에 가려져 있음을 가리킵니다.",
    advice: "태양은 사라진 것이 아니라 구름 뒤에 온전히 존재합니다. 무리한 과시를 내려놓고 내면의 온기를 회복하세요."
  },
  major_20: {
    keywords: ["자기비판", "결단 유예", "부름 외면", "후회", "과거 집착"],
    meaning: "과거의 실수에 발목 잡혀 새로운 부름에 응답하지 못하고 주저하고 있음을 나타냅니다.",
    advice: "나팔 소리가 울려 퍼지고 있습니다. 과거의 나를 용서하고 완전히 털어낸 뒤 당당하게 부활하세요."
  },
  major_21: {
    keywords: ["미완성", "지연된 성취", "완벽주의의 함정", "정체", "마지막 한 끗"],
    meaning: "결승선을 눈앞에 두고 지레 지치거나, 사소한 디테일에 집착하여 마침표를 찍지 못하고 있음을 뜻합니다.",
    advice: "완벽함에 얽매이지 말고 일단 완성하세요. 한 챕터를 매듭지어야 다음 위대한 우주가 펼쳐집니다."
  }
};

export function getTarotReversedData(card: { id?: string; nameKo?: string; type?: string; keywords?: string[] } | null | undefined): TarotReversedData {
  if (!card) {
    return {
      keywords: ["내면 성찰", "속도 조절", "흐름의 재정비", "숨은 변수"],
      meaning: "에너지가 겉으로 분출되기보다 내면으로 수렴되어, 잠시 멈추어 점검하고 내실을 다져야 하는 타이밍입니다.",
      advice: "무리한 확장을 멈추고 숨어 있는 변수와 내면의 저항을 먼저 살피세요."
    };
  }

  if (card.id && TAROT_REVERSED_DATA[card.id]) {
    return TAROT_REVERSED_DATA[card.id];
  }

  // Smart Suit-based Generative Synthesis for Minor Arcana
  const suit = card.type || (card.id?.split('_')[0]);
  const baseKws = card.keywords || [];

  if (suit === 'wands') {
    return {
      keywords: ["열정 소진", "추진력 저하", "성급함", "장애물", "의욕 감퇴"],
      meaning: `정방향의 진취적인 불의 에너지가 과열되어 피로가 누적되었거나, 추진 방향에 혼선이 빚어진 상태입니다 (${baseKws.slice(0, 2).join(', ')}의 속도 조절 신호).`,
      advice: "불꽃을 억지로 태우려 하지 말고, 장작과 바람을 점검하듯 기초 체력과 계획을 재정비하세요."
    };
  }

  if (suit === 'cups') {
    return {
      keywords: ["감정 기복", "마음의 상처", "소통 부재", "폐쇄", "과잉 반응"],
      meaning: `정방향의 풍성한 물의 감정선이 넘치거나 고여서 감정적 피로와 오해를 겪고 있음을 암시합니다 (${baseKws.slice(0, 2).join(', ')}의 감정 정화 필요).`,
      advice: "감정의 파도에 휩쓸리지 말고, 마음의 잔을 비워내며 스스로를 온전히 위로해 주세요."
    };
  }

  if (suit === 'swords') {
    return {
      keywords: ["생각 과부하", "판단 착오", "말실수", "불필요한 갈등", "정신적 피로"],
      meaning: `정방향의 명석한 지성과 결단력이 과도한 고민이나 날카로운 방어기제로 변질되어 스스로를 찌르고 있음을 경고합니다 (${baseKws.slice(0, 2).join(', ')}의 재정돈).`,
      advice: "생각의 스위치를 끄고 뇌에 휴식을 주세요. 차가운 이성 대신 부드러운 유연함을 채택하세요."
    };
  }

  if (suit === 'pentacles' || suit === 'pent') {
    return {
      keywords: ["물질적 불안", "투자 지연", "비효율", "낭비", "현실적 변수"],
      meaning: `정방향의 견고한 대지의 풍요가 현실적 계산 착오나 조급함으로 인해 일시적으로 정체된 상태입니다 (${baseKws.slice(0, 2).join(', ')}의 재점검 필요).`,
      advice: "무리한 지출이나 조급한 계약을 피하고, 기본 예산과 자원을 실속 있게 관리하세요."
    };
  }

  return {
    keywords: ["내면 성찰", "에너지 정돈", "지연 극복", "방향 전환"],
    meaning: `카드의 상징 파동이 겉으로 드러나기 전에 내면의 정화와 성찰을 먼저 요구하고 있습니다 (${card.nameKo || '타로 카드'}의 그림자 치유 과정).`,
    advice: "외부 상황을 탓하기보다 내면의 마음가짐과 기초를 단단히 다지는 기회로 삼으세요."
  };
}

export const getTarotCardImageUrl = (card: TarotCard | null | undefined): string => {
  if (!card || !card.id) return "";
  
  let suitLetter = "";
  let numStr = "";
  
  if (card.id.startsWith("major_")) {
    suitLetter = "m";
    numStr = card.id.split("_")[1].padStart(2, '0');
  } else if (card.id.startsWith("wands_")) {
    suitLetter = "w";
    numStr = card.id.split("_")[1].padStart(2, '0');
  } else if (card.id.startsWith("cups_")) {
    suitLetter = "c";
    numStr = card.id.split("_")[1].padStart(2, '0');
  } else if (card.id.startsWith("swords_")) {
    suitLetter = "s";
    numStr = card.id.split("_")[1].padStart(2, '0');
  } else if (card.id.startsWith("pent_")) {
    suitLetter = "p";
    numStr = card.id.split("_")[1].padStart(2, '0');
  } else {
    return "";
  }
  
  return `https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/${suitLetter}${numStr}.jpg`;
};



/**
 * =========================================================================
 * PRISM & Lucy: 기적수업(A Course in Miracles, ACIM) 마스터 지혜 엔진
 * =========================================================================
 * 헬렌 슈크만(Helen Schucman)과 윌리엄 셋포드(William Thetford) 박사를 통해 전해진
 * 기적수업 텍스트, 365일 학생용 워크북, 교사용 매뉴얼을 집대성하여
 * '지각의 전환(Shift in Perception)', '참된 용서(True Forgiveness)',
 * '에고의 환영 해체', '거룩한 순간(Holy Instant)'을 안내하는 영적 지혜 모듈입니다.
 */

export interface AcimCanonItem {
  title: string;
  englishTerm: string;
  summary: string;
  coreTeachings: string[];
  counselingApplication: string;
}

export const ACIM_CORE_CANON: Record<string, AcimCanonItem> = {
  // 1. 기적수업의 근본 원리 (The Fundamental Principle)
  corePrinciple: {
    title: "기적수업의 근본 원리: 실재와 비실재의 명확한 구분",
    englishTerm: "The Fundamental Principle",
    summary: "실재하는 것은 위협받을 수 없으며, 실재하지 않는 것은 존재하지 않는다. 여기에 하나님의 평화가 있다.",
    coreTeachings: [
      "• Nothing real can be threatened. Nothing unreal exists. Herein lies the peace of God.",
      "• 사랑(신성)과 영원한 영(Spirit)만이 유일한 실재이며, 두려움·죄책감·분리의 물질 세상은 에고가 만든 환영(꿈)에 불과하다.",
      "• 참된 실재는 결코 상처받거나 훼손될 수 없으므로, 우리는 본래 완전하게 안전하다."
    ],
    counselingApplication: "세상의 위협, 상실, 실패에 불안해하는 사용자에게 '네 참된 본질은 세상 그 어떤 사건으로도 결코 위협받을 수 없는 영원하고 거룩한 존재'임을 상기시켜 깊은 안도감을 선사합니다."
  },

  // 2. 기적의 본질과 지각의 전환 (The Miracle & Shift in Perception)
  miracle: {
    title: "기적(Miracle)의 본질: 두려움에서 사랑으로의 지각 전환",
    englishTerm: "Shift in Perception",
    summary: "기적이란 외부의 물질적 현상을 조작하는 것이 아니라, 두려움의 시선에서 사랑의 시선으로 내 마음의 지각을 바꾸는 내적 전환이다.",
    coreTeachings: [
      "• 기적은 사랑의 당연한 표현이며, 마음이 에고의 안내 대신 성령의 안내를 따를 때 자연스럽게 일어난다.",
      "• 모든 공격과 분노, 혐오는 본질적으로 '사랑을 청하는 절박한 외침(A call for love)'이다."
    ],
    counselingApplication: "상대방의 분노나 차가운 태도에 상처받은 사용자에게 '그는 너를 공격하는 것이 아니라, 두려움 속에서 사랑을 애타게 구하고 있는 것'임을 보게 하여 지각을 바꿉니다."
  },

  // 3. 참된 용서 (True Forgiveness)
  trueForgiveness: {
    title: "참된 용서(True Forgiveness): 꿈의 허상을 꿰뚫어 보는 지혜",
    englishTerm: "True Forgiveness",
    summary: "세상의 용서('네가 죄를 지었지만 참아준다')와 달리, '상대가 꿈속에서 했다고 착각한 죄는 본래 실재하지 않음'을 꿰뚫어 보는 참된 해방.",
    coreTeachings: [
      "• 용서는 상대방을 위해서가 아니라, 내 마음에 묶여 있는 원한의 사슬을 풀어 나 자신을 해방하기 위해 행하는 것이다.",
      "• 원한(Grievance)을 품고 있는 한 하나님의 평화와 연결될 수 없다. (Lesson 68: 사랑은 원한을 품지 않는다)"
    ],
    counselingApplication: "누군가에 대한 억울함과 원망으로 가슴이 답답한 사용자에게 '원한을 내려놓고 마음의 평화를 선택하는 기적수업식 용서의 단계'를 부드럽게 안내합니다."
  },

  // 4. 에고의 해체와 속죄 (Ego & The Atonement)
  atonement: {
    title: "에고의 사슬 해체와 속죄(Atonement): 영원한 일치",
    englishTerm: "The Atonement",
    summary: "분리(Separation) ➔ 죄책감(Guilt) ➔ 두려움(Fear) ➔ 투사(Projection)로 이어지는 에고의 방어를 무력화하고 영원한 무죄성(Sinlessness)을 수용함.",
    coreTeachings: [
      "• 인간은 하나님(근원)과 단 한 번도 실제로 분리된 적이 없다. 분리는 악몽처럼 꿈꾸었을 뿐이다.",
      "• 속죄(Atonement)는 '우리는 본래 죄가 없으며, 하나님이 창조하신 모습 그대로 여전히 거룩하다'는 진실을 온전히 받아들이는 것이다."
    ],
    counselingApplication: "심한 죄책감, 수치심, '나는 사랑받을 자격이 없다'는 자책에 시달리는 사용자에게 무조건적인 근원의 사랑과 본래의 결백함을 일깨워 줍니다."
  },

  // 5. 거룩한 순간과 성령의 안내 (The Holy Instant & Holy Spirit)
  holyInstant: {
    title: "거룩한 순간(The Holy Instant): 지금-여기 영원의 평화",
    englishTerm: "The Holy Instant",
    summary: "과거의 후회와 미래의 두려움이라는 시간의 착각을 내려놓고, 성령과 함께 머무는 영원한 현재의 고요.",
    coreTeachings: [
      "• 거룩한 순간 안에서는 어떠한 과거의 짐도, 미래의 근심도 침범할 수 없다.",
      "• '나는 이것 대신 평화를 보기를 선택한다 (Lesson 34).'라는 단순한 결단이 거룩한 순간을 연다."
    ],
    counselingApplication: "과거의 트라우마나 미래의 불안으로 패닉에 빠진 사용자에게 '지금 이 순간 멈추어 거룩한 평화를 선택하는 마음의 호흡'을 처방합니다."
  },

  // 6. 특별한 관계에서 거룩한 관계로 (Special to Holy Relationship)
  holyRelationship: {
    title: "거룩한 관계(Holy Relationship): 구원의 동반자",
    englishTerm: "Holy Relationship",
    summary: "자신의 결핍을 상대에게서 뜯어내려는 에고의 특별한 관계(Special Relationship)에서, 서로의 거룩한 빛을 비추는 구원의 파트너로 승화됨.",
    coreTeachings: [
      "• 상대를 내 욕망의 도구로 삼지 않고, 용서와 치유를 함께 배우는 거룩한 거울로 바라본다.",
      "• 관계 안에서 '누가 이기고 지는가'의 전쟁을 끝내고, 둘 모두가 온전해지는 길을 걷는다."
    ],
    counselingApplication: "연인, 가족, 친구 관계에서 겪는 애착과 실망, 지배와 종속의 갈등을 거룩한 치유의 관점으로 재해석하고 안내합니다."
  }
};

/**
 * 기적수업(ACIM) 365일 워크북 핵심 명문장 및 기도문 컬렉션
 */
export const ACIM_SACRED_QUOTES = [
  {
    source: "기적수업 서문 (Introduction)",
    quote: "실재하는 것은 위협받을 수 없으며, 실재하지 않는 것은 존재하지 않는다. 여기에 하나님의 평화가 있다."
  },
  {
    source: "기적수업 워크북 레슨 34",
    quote: "나는 이것 대신 평화를 볼 수 있다. (I could see peace instead of this.)"
  },
  {
    source: "기적수업 워크북 레슨 68",
    quote: "사랑은 원한을 품지 않는다. 내가 원한을 품을 때 나는 내 안의 빛을 가리고 어둠을 선택하는 것이다."
  },
  {
    source: "기적수업 워크북 레슨 185",
    quote: "나는 하나님의 평화 외에는 아무것도 원하지 않는다. (I want the peace of God.)"
  },
  {
    source: "기적수업 워크북 레슨 67",
    quote: "사랑이 나를 창조하셨기에 나는 사랑 그 자체이다. 나는 하나님이 창조하신 그 모습 그대로 머물러 있다."
  },
  {
    source: "기적수업 텍스트 27장",
    quote: "너는 너 자신을 꿈꾸는 자(The dreamer of the dream)이다. 네가 겪는 악몽은 네가 깨어나기를 선택하는 그 순간 힘을 잃으리라."
  }
];

/**
 * Lucy의 시스템 프롬프트에 주입할 기적수업(ACIM) 마스터 인스트럭션 빌더
 */
export function buildAcimSystemPrompt(): string {
  return `
[🕊️ Lucy: 기적수업(A Course in Miracles, ACIM) 마스터 지혜 체계]
당신은 기적수업(ACIM)의 정수와 형이상학을 완벽하게 체득한 지각 전환의 마스터입니다.

1. [두려움에서 사랑으로의 지각 전환 (Shift in Perception)]:
   - 사용자가 불안, 억울함, 타인의 공격에 상처받았을 때, "모든 공격은 본질적으로 사랑을 갈망하는 외침(Call for love)"임을 상기시켜 분노 대신 연민과 평화의 눈으로 상황을 재해석하도록 이끕니다.
   - "나는 이것 대신 평화를 볼 수 있다 (Lesson 34)"는 확신을 심어줍니다.

2. [참된 용서(True Forgiveness)를 통한 자유]:
   - 원한을 붙잡아 스스로를 고문하지 않고, 환영의 꿈을 통찰하여 상대와 자신 안에 깃든 죄 없고 순결한 신성의 빛을 보도록 안내합니다.

3. [거룩한 순간(The Holy Instant)의 현존]:
   - 과거의 후회와 미래의 불안이라는 에고의 시간관을 멈추고, 지금 이 순간 무조건적으로 주어져 있는 평화의 성소로 초대합니다.

4. [초기불교 × 영지주의 × 기적수업의 궁극적 3위1체 융합]:
   - 불교의 '사티(알아차림)와 무아(Anattā)' + 영지주의의 '그노시스(영지)와 신성한 불꽃(Pneuma)' + 기적수업의 '참된 용서(Forgiveness)와 거룩한 평화(Peace of God)'를 완벽하게 조화시켜, 그 어떤 고민도 가장 따뜻하고 명쾌하게 해체하는 최고봉의 영적 통찰을 베풉니다.
`;
}

/**
 * =========================================================================
 * PRISM & Lucy: 영지주의(Gnosticism & Gnosis) 비전(秘傳) 지혜 엔진
 * =========================================================================
 * 1945년 발견된 낙함마디 문서(Nag Hammadi Library), 도마 복음서, 진리의 복음서,
 * 빌립 복음서, 피스티스 소피아 및 칼 융의 심층심리학적 그노시스를 집대성한
 * 영혼의 신성한 불꽃(Divine Spark) 각성 및 본향(Pleroma) 귀환 지혜 모듈입니다.
 */

export interface GnosticCanonItem {
  title: string;
  pali?: string;
  greekTerm: string;
  summary: string;
  coreTeachings: string[];
  counselingApplication: string;
}

export const GNOSTIC_CORE_CANON: Record<string, GnosticCanonItem> = {
  // 1. 그노시스 (Gnosis, Γνῶσις - 직접적인 내적 영지)
  gnosis: {
    title: "그노시스(Gnosis): 내면의 신성에 대한 직접적인 앎",
    pali: "Gnosis (Γνῶσις)",
    greekTerm: "Γνῶσις",
    summary: "외부 권위나 교조적 신념(Pistis)을 넘어, 자기 자신의 본질과 우주적 신성에 대한 직접적이고 직관적인 자각",
    coreTeachings: [
      "• 인간의 고통과 방황은 '죄(Sin)' 때문이 아니라 태초의 참된 본성을 잊어버린 '무지(Agnosia/Ignorance)'와 '망각(Lethe)'에서 기인한다.",
      "• 자기 자신을 참으로 아는 자는 우주 전체의 신성한 근원을 알게 되며, 앎(Gnosis)을 통해 물질의 최면에서 즉시 깨어난다."
    ],
    counselingApplication: "스스로를 부족하거나 결함이 있는 존재로 자책하는 사용자에게, '네 안에는 세상 그 무엇도 더럽히거나 훼손할 수 없는 태초의 영원한 빛이 있다'는 절대적 자존감과 영적 각성을 선사합니다."
  },

  // 2. 플레로마와 모나드 (Pleroma & The Monad)
  pleroma: {
    title: "플레로마(Pleroma)와 모나드(The Monad): 충만한 빛의 세계",
    pali: "Pleroma (Πλήρωμα)",
    greekTerm: "Πλήρωμα & Μονάς",
    summary: "모든 존재의 불가언(말할 수 없는) 근원인 모나드(Bythos)와 에온(Aeon)들이 쌍(Syzygy)으로 조화를 이루는 영적 충만",
    coreTeachings: [
      "• 모나드(Bythos, 심연): 형상과 이름을 초월한 순수한 빛과 생명의 원초적 근원.",
      "• 플레로마(Pleroma, 충만): 지성(Nous), 진리(Aletheia), 생명(Zoe), 말씀(Logos), 지혜(Sophia) 등 신성한 에온들이 대립 없이 완전한 조화와 충만을 이루는 영혼의 본향."
    ],
    counselingApplication: "현실의 결핍과 외로움에 지친 사용자에게 마음의 중심을 플레로마의 완전한 충만함에 연결하여 내면의 결핍감을 근원적으로 치유합니다."
  },

  // 3. 소피아의 여정과 회복 (Sophia & Pistis Sophia)
  sophia: {
    title: "소피아(Sophia)의 여정: 지혜의 하강과 빛의 귀환",
    pali: "Sophia (Σοφία)",
    greekTerm: "Σοφία & Πίστις Σοφία",
    summary: "근원을 알고자 했던 지혜(Sophia)의 열망, 물질 세계로의 방황, 13번의 진실한 참회, 그리고 플레로마로의 거룩한 복귀",
    coreTeachings: [
      "• 소피아는 빛의 가장 바깥쪽 에온으로서 창조적 열망으로 인해 심연으로 내려왔으나, 자신의 방황을 자각하고 참회(Metanoia)함으로써 빛의 구원을 받았다.",
      "• 인간의 영혼의 여정은 소피아의 여정과 정확히 일치한다. 실수를 통해 배우고, 고통 속에서 깨어나 마침내 본래의 자리로 돌아간다."
    ],
    counselingApplication: "인생의 실패나 방황으로 좌절한 사용자에게 '너의 모든 방황과 실수는 소피아의 지혜를 완성하기 위한 거룩한 여정의 일부'임을 일깨워 큰 용기를 줍니다."
  },

  // 4. 데미우르고스와 아르콘 (Demiurge & Archons)
  demiurge: {
    title: "데미우르고스(Demiurge)와 아르콘들: 물질의 환영과 굴레",
    pali: "Demiurge (Δημιουργός)",
    greekTerm: "Δημιουργός & Ἄρχοντες",
    summary: "눈먼 조물주 얄다바오트와 인간을 불안, 결핍, 운명의 굴레(Heimarmene)에 가두려는 세상의 가짜 지배자들",
    coreTeachings: [
      "• 데미우르고스는 스스로가 유일한 신이라고 착각하는 눈먼 존재이며, 물질적이고 한계적인 세상의 틀을 만들었다.",
      "• 아르콘(지배자들)은 인간이 자신의 신성한 불꽃을 깨닫지 못하도록 두려움, 죄책감, 사회적 조건화, 탐욕의 사슬로 조종한다.",
      "• 그노시스를 얻은 영혼은 아르콘들의 관문과 최면을 비웃으며 가볍게 통과하여 자유를 얻는다."
    ],
    counselingApplication: "사회의 기준, 타인의 시선, 죄책감, 세상의 압박(아르콘의 최면)에 짓눌린 사용자에게 '그것은 본래 너를 구속할 힘이 없는 허상'임을 통찰하게 하여 두려움을 해체합니다."
  },

  // 5. 신성한 불꽃과 인간의 3단계 (The Divine Spark & Pneumatic)
  divineSpark: {
    title: "신성한 불꽃(Divine Spark): 영적 인간(Pneumatic)으로의 각성",
    pali: "Pneuma (Πνεῦμα)",
    greekTerm: "Πνεῦμα & Σπινθήρ",
    summary: "육체와 마음에 갇혀 있는 플레로마의 빛의 조각(Pneuma)을 자각하고 영적 자유인으로 거듭남",
    coreTeachings: [
      "• 물질적 인간(Hylic): 감각과 물질적 욕망에 완전히 매몰된 상태.",
      "• 심리적 인간(Psychic): 이성과 도덕, 감정의 율법에 갇혀 끊임없이 흔들리는 상태.",
      "• 영적 인간(Pneumatic): 내면의 신성한 불꽃(Pneuma)을 자각하여 데미우르고스의 세계를 초월한 참된 자유인."
    ],
    counselingApplication: "감정과 육체의 고통을 '진짜 나'와 동일시하지 않고, 그 너머에 있는 영원한 관찰자이자 신성한 불꽃(Pneuma)의 위치로 의식을 상승시키도록 안내합니다."
  },

  // 6. 신방(Bridal Chamber)의 신비 (Gospel of Philip)
  bridalChamber: {
    title: "신방(Bridal Chamber, Nymphon)의 신비: 대립물의 거룩한 합일",
    pali: "Nymphon (Νυμφών)",
    greekTerm: "Νυμφών (Syzygy)",
    summary: "빛과 어둠, 남성과 여성, 의식과 무의식, 신성과 인간성의 분열을 넘어 내적 성소에서 하나로 융합되는 궁극의 평화",
    coreTeachings: [
      "• 세상의 모든 고통은 '분리(Separation)'에서 시작되었다.",
      "• 신방 안에서 대립물들은 더 이상 갈등하지 않고 하나(Monas)로 결합한다. 이것이 영지주의의 궁극적 구원이자 완전한 평정이다."
    ],
    counselingApplication: "내면의 분열(원하는 나와 못난 나의 갈등, 이성과 감정의 충돌)을 겪는 사용자에게 둘을 배척하지 않고 가슴의 신방 안에서 다정하게 끌어안아 통합하는 치유를 전합니다."
  }
};

/**
 * 낙함마디(Nag Hammadi) 문서 및 영지주의 핵심 명문장 컬렉션
 */
export const GNOSTIC_SACRED_QUOTES = [
  {
    source: "도마 복음서(Gospel of Thomas) 70절",
    quote: "너희 안에 있는 것을 꺼내어 낳으면, 그것이 너희를 구원할 것이다. 너희 안에 있는 것을 꺼내지 않고 가두어두면, 그것이 너희를 파멸시킬 것이다."
  },
  {
    source: "도마 복음서(Gospel of Thomas) 3절",
    quote: "하나님의 나라는 너희 안에 있고, 너희 밖에 있다. 너희가 너희 자신을 알 때 비로소 너희는 알려질 것이며, 너희가 살아 계신 궁극적 근원의 자녀임을 깨닫게 될 것이다."
  },
  {
    source: "도마 복음서(Gospel of Thomas) 22절",
    quote: "너희가 둘을 하나로 만들고, 안을 겉처럼 겉을 안처럼, 위를 아래처럼 만들 때, 남성과 여성을 하나로 만들어 남성은 남성이 아니게 여성은 여성이 아니게 할 때, 그때 너희가 영원한 나라에 들어가리라."
  },
  {
    source: "진리의 복음서(Gospel of Truth)",
    quote: "무지(Agnosia)는 망각을 낳고, 망각은 두려움이라는 짙은 안개를 낳았다. 그러나 앎(Gnosis)의 찬란한 빛이 비출 때, 무지는 마치 악몽에서 깨어난 사람의 환영처럼 흔적도 없이 사라진다."
  },
  {
    source: "빌립 복음서(Gospel of Philip)",
    quote: "빛과 어둠, 삶과 죽음, 오른쪽과 왼쪽은 서로 형제들이다. 분리될 수 없다. 신방(Bridal Chamber) 안에서 둘은 비로소 하나가 된다."
  },
  {
    source: "칼 융(C.G. Jung) 《죽은 자들을 위한 7개의 설교》",
    quote: "우리가 살고 있는 이 세계의 너머에 플레로마(Pleroma)가 있다. 그것은 충만이면서 동시에 무(Nothingness)이다. 네 안의 작은 불꽃이 깨어날 때 너는 모든 양극성을 넘어선 살아있는 신성(Abraxas)과 마주하리라."
  }
];

/**
 * Lucy의 시스템 프롬프트에 주입할 영지주의 그노시스 마스터 인스트럭션 빌더
 */
export function buildGnosticSystemPrompt(): string {
  return `
[🌌 Lucy: 영지주의(Gnosticism & Nag Hammadi) 그노시스 마스터 지혜 체계]
당신은 낙함마디 문서(도마 복음서, 진리의 복음서, 빌립 복음서, 피스티스 소피아)와 영지주의 비전(秘傳)의 최고봉을 꿰뚫고 있는 마스터입니다.

1. [신성한 불꽃(Divine Spark / Pneuma)의 자각]:
   - 사용자가 세상의 평가, 죄책감, 무력감에 짓눌려 있을 때, "네 안에는 물질 세상(데미우르고스의 영역)이 결코 훼손할 수 없는 플레로마(Pleroma)의 영원한 빛의 불꽃이 살아 숨쉬고 있다"는 진실을 다정하고 당당하게 일깨워 줍니다.

2. [도마 복음서의 내적 창조력]:
   - "너희 안에 있는 것을 꺼내 놓으면 그것이 너희를 구원한다(Gospel of Thomas 70)"는 지혜를 바탕으로, 억압된 감정과 잠재력을 밖으로 표현하고 실현하도록 격려합니다.

3. [신방(Bridal Chamber)의 대립물 통합]:
   - 빛과 어둠, 긍정과 부정, 이성과 감정의 양극단을 적대시하지 않고, 내면의 신방(Nymphon) 안에서 온전한 하나(Whole Self)로 융합하는 심층적 개성화(Individuation)를 이끕니다.

4. [초기불교와의 궁극적 융합]:
   - 불교의 '무명(Avijjā)'과 영지주의의 '아그노시아(Agnosia/망각)'를 꿰뚫고, 불교의 '사티(알아차림)'와 영지주의의 '그노시스(영지)'를 하나로 녹여내어 가장 맑고 명쾌하며 영혼을 울리는 통찰을 제공합니다.
`;
}

/**
 * =========================================================================
 * PRISM & Lucy: 초기불교(Early Buddhism, 5부 니까야 Nikāya 원음) 지혜 엔진
 * =========================================================================
 * 붓다의 원음 경전(디가·맛지마·상윳따·앙굿따라·쿳다카 니까야)에 담긴
 * 사성제, 팔정도, 삼특상(무상·고·무아), 십이연기, 오온, 사념처, 사무량심,
 * 두 번째 화살의 비유 및 위빳사나·사티(알아차림) 실천 체계를 집대성한 정수 모듈입니다.
 */

export interface EarlyBuddhismCanon {
  title: string;
  pali: string;
  summary: string;
  coreTeachings: string[];
  counselingApplication: string;
}

export const EARLY_BUDDHISM_CORE_CANON: Record<string, EarlyBuddhismCanon> = {
  // 1. 사성제 (四聖諦 - Cattāri Ariyasaccāni)
  fourNobleTruths: {
    title: "사성제(四聖諦): 네 가지 거룩한 진리",
    pali: "Cattāri Ariyasaccāni",
    summary: "고통의 실존적 자각(고제), 고통의 원인인 갈애(집제), 고통의 소멸인 열반(멸제), 고통의 소멸로 이끄는 팔정도(도제)",
    coreTeachings: [
      "1) 고제(Dukkha Sacca): 태어남, 늙음, 병듦, 죽음, 사랑하는 것과의 이별, 싫어하는 것과의 만남, 원하는 것을 얻지 못함, 5온에 대한 집착(5취온)은 모두 고(Dukkha)이다.",
      "2) 집제(Samudaya Sacca): 괴로움의 원인은 끝없는 감각적 쾌락에 대한 갈애(Kāmataṇhā), 존재에 대한 애착(Bhavataṇhā), 존재하지 않으려는 집착(Vibhavataṇhā)이다.",
      "3) 멸제(Nirodha Sacca): 갈애가 남김없이 빛바래고 소멸할 때, 모든 집착을 놓아버림(Cāga, Paṭinissagga)으로써 열반(Nibbāna)의 고요와 자유를 증득한다.",
      "4) 도제(Magga Sacca): 괴로움의 소멸에 이르는 길은 8가지 바른 길(팔정도)이다."
    ],
    counselingApplication: "사용자가 고통과 불안에 직면했을 때, '고통을 억압하거나 피하지 않고 있는 그대로 인지한 뒤(고제), 내가 지금 무엇에 집착하고 갈망하고 있는가(집제)를 통찰하여 집착을 내려놓도록(멸제)' 단계적으로 안내합니다."
  },

  // 2. 팔정도 (八正道 - Ariyo Aṭṭhaṅgiko Maggo)
  eightfoldPath: {
    title: "팔정도(八正道): 지혜와 해탈에 이르는 8가지 바른 길",
    pali: "Ariyo Aṭṭhaṅgiko Maggo",
    summary: "계·정·혜(Śīla·Samādhi·Paññā) 3학으로 구성된 중도(Majjhimā Paṭipadā)의 실천 체계",
    coreTeachings: [
      "1) 정견(Sammā-diṭṭhi, 바른 견해): 사성제, 업과 인과응보, 연기법을 바르게 이해함 (반야/지혜)",
      "2) 정사유(Sammā-saṅkappa, 바른 생각): 탐욕 없음(Nekkamma), 악의 없음(Abyāpāda), 해치지 않음(Avihiṃsā)을 숙고함 (반야/지혜)",
      "3) 정어(Sammā-vācā, 바른 언어): 거짓말, 이간질하는 말, 거친 말, 쓸데없는 잡담을 삼가고 진실하며 유익하고 다정한 말을 함 (계율)",
      "4) 정업(Sammā-kammanta, 바른 행동): 살생, 도둑질, 삿된 음행을 멀리하고 청정하게 행함 (계율)",
      "5) 정명(Sammā-ājīva, 바른 생계): 남을 해치거나 속이지 않는 정당하고 도덕적인 직업과 삶을 영위함 (계율)",
      "6) 정정진(Sammā-vāyāma, 바른 노력): 이미 생긴 불선법을 버리고, 아직 안 생긴 불선법을 막으며, 아직 안 생긴 선법을 일으키고, 이미 생긴 선법을 키움 (삼매)",
      "7) 정념(Sammā-sati, 바른 알아차림): 신수심법 사념처에 마음을 챙겨 탐욕과 슬픔을 여의고 현존을 지각함 (삼매)",
      "8) 정정(Sammā-samādhi, 바른 삼매): 감각적 욕망과 불선법을 떠나 초선·2선·3선·4선의 깊고 고요한 삼매에 머묾 (삼매)"
    ],
    counselingApplication: "사용자의 일상 행동, 직업, 언어 습관, 마음의 태도를 8정도의 균형 잡힌 관점으로 조율하여 현실적 실행력과 영적 청정함을 동시에 높여줍니다."
  },

  // 3. 삼특상 / 삼법인 (Tilakkhaṇa - 무상·고·무아)
  threeMarksOfExistence: {
    title: "삼특상(三特相): 모든 존재의 세 가지 보편적 성질",
    pali: "Tilakkhaṇa (Anicca, Dukkha, Anattā)",
    summary: "Sabbe saṅkhārā aniccā (모든 형성된 것은 변한다), Sabbe saṅkhārā dukkhā (집착하면 괴롭다), Sabbe dhammā anattā (모든 법에는 고정된 자아가 없다)",
    coreTeachings: [
      "1) 제행무상(Anicca): 조건에 의해 생겨난 모든 것은 순간순간 변하며, 영원히 고정된 것은 하나도 없다.",
      "2) 제행개고(Dukkha): 끊임없이 변하는 대상을 영원하고 불변한 만족의 대상으로 쥐고 있으려 하기에 괴로움이 발생한다.",
      "3) 제법무아(Anattā): 몸, 느낌, 생각, 의도, 의식 어디에도 '나'라고 부를 수 있는 독립적이고 영원한 실체(Attā)는 없다. (Anattalakkhaṇa Sutta)"
    ],
    counselingApplication: "'나의 것, 나 자신, 나의 상처'라는 자아의 과도한 집착에서 벗어나 '이 모든 감정과 생각은 인연 조건에 의해 잠시 일어났다가 사라지는 자연스러운 구름'임을 깨닫게 하여 깊은 해방감을 줍니다."
  },

  // 4. 십이연기 (十二緣起 - Paṭiccasamuppāda)
  twelveLinksOfDependentOrigination: {
    title: "십이연기(十二緣起): 조건 지어진 발생과 소멸의 법칙",
    pali: "Paṭiccasamuppāda",
    summary: "'이것이 있으므로 저것이 있고, 이것이 일어나므로 저것이 일어난다. 이것이 없으므로 저것이 없고, 이것이 멸하므로 저것이 멸한다.'",
    coreTeachings: [
      "1) 무명(Avijjā) ➔ 2) 행(Saṅkhāra) ➔ 3) 식(Viññāṇa) ➔ 4) 명색(Nāmarūpa) ➔ 5) 6입(Saḷāyatana) ➔ 6) 촉(Phassa) ➔ 7) 수(Vedanā) ➔ 8) 애(Taṇhā) ➔ 9) 취(Upādāna) ➔ 10) 유(Bhava) ➔ 11) 생(Jāti) ➔ 12) 노사·우비고뇌(Jarāmaraṇa, Soka-parideva-dukkha-domanassupāyāsā)",
      "• 촉(접촉)에서 일어난 수(느낌: 좋음/싫음/덤덤함)에 무의식적으로 낚여 애(갈애)와 취(집착)로 번지는 연결고리를 사티(Sati, 알아차림)로 끊어내는 것이 해탈의 핵심 메커니즘이다."
    ],
    counselingApplication: "감정의 폭풍이 일어날 때, '자극(촉)과 느낌(수) 사이에 멈춤의 공간(사티)을 두어 갈애와 집착으로 번지는 번뇌의 연쇄 반응을 끊는 법'을 안내합니다."
  },

  // 5. 오온 (五蘊 - Pañcakkhandha)
  fiveAggregates: {
    title: "오온(五蘊): 인간 경험의 5가지 구성 요소",
    pali: "Pañcakkhandha",
    summary: "색(Rūpa 물질/몸), 수(Vedanā 느낌), 상(Saññā 지각/표상), 행(Saṅkhāra 형성/의도), 식(Viññāṇa 의식/알음알이)",
    coreTeachings: [
      "오온의 각 요소는 내가 아니며, 나의 자아가 아니며, 나의 소유가 아니다 (N'etaṃ mama, n'eso'ham asmi, na m'eso attā).",
      "5온에 집착할 때 5취온(Pañcupādānakkhandhā)이 되어 괴로움의 덩어리가 된다."
    ],
    counselingApplication: "우울하거나 불안할 때 '내가 우울한 것'이 아니라 '지금 마음에 우울이라는 수(느낌)와 상(생각)의 구름이 지나가고 있음을 3자적 시선으로 고요히 관찰'하도록 돕습니다."
  },

  // 6. 사념처 (四念處 - Cattāro Satipaṭṭhānā)
  fourFoundationsOfMindfulness: {
    title: "사념처(四念處): 유일한 해탈의 길(Ekāyano Maggo)",
    pali: "Cattāro Satipaṭṭhānā (Maha Satipaṭṭhāna Sutta, DN 22)",
    summary: "신·수·심·법 4가지 영역에서 몸과 마음의 현상을 있는 그대로 여실지견(如實知見)하는 위빳사나 실천",
    coreTeachings: [
      "1) 신념처(Kāyānupassanā): 들숨날숨 아나파나사티(Ānāpānasati), 4대 요소(지·수·화·풍), 몸의 자세(행주좌와)를 알아차림",
      "2) 수념처(Vedanānupassanā): 즐거운 느낌, 괴로운 느낌, 즐겁지도 괴롭지도 않은 느낌의 생멸을 즉각 알아차림",
      "3) 심념처(Cittānupassanā): 탐욕 있는 마음, 성냄 있는 마음, 산란한 마음, 집중된 마음 등 마음의 상태를 있는 그대로 직시",
      "4) 법념처(Dhammānupassanā): 5가지 장애(Nīvaraṇa: 욕망, 분노, 나태, 들뜸, 의심), 7각지, 4성제를 꿰뚫어 봄"
    ],
    counselingApplication: "실시간 호흡 명상, 감각 자각 훈련, 감정의 이름표 붙이기(Labeling)를 통해 즉각적인 심신 평온과 명료한 지혜를 이끌어냅니다."
  },

  // 7. 사무량심 (四無量心 - Brahmavihāra)
  fourImmeasurables: {
    title: "사무량심(四無量心): 범천에 머무는 네 가지 거룩한 마음",
    pali: "Brahmavihāra",
    summary: "자(Mettā 자애), 비(Karuṇā 연민), 희(Muditā 함께 기뻐함), 사(Upekkhā 평정)",
    coreTeachings: [
      "1) 자(Mettā): 모든 존재가 안전하고 평화롭고 행복하기를 바라는 무조건적 자애",
      "2) 비(Karuṇā): 고통받는 존재들의 괴로움을 함께 가엾게 여기고 덜어주고자 하는 자비로운 마음",
      "3) 희(Muditā): 남의 성공과 행복을 시기하지 않고 온 마음으로 함께 기뻐하는 순수한 환희",
      "4) 사(Upekkhā): 좋음과 싫음, 칭찬과 비난, 이익과 손실에 흔들리지 않는 맑고 고요한 평정심"
    ],
    counselingApplication: "인간관계의 상처와 갈등을 겪는 사용자에게 자애명상(Mettā Bhāvanā)과 평정(Upekkhā)의 힘으로 증오와 비교의 굴레를 녹여내도록 위로합니다."
  },

  // 8. 두 번째 화살의 비유 (Sallatha Sutta)
  secondArrowParable: {
    title: "두 번째 화살의 비유 (Sallatha Sutta, SN 36.6)",
    pali: "Sallathena Sutta",
    summary: "지혜로운 자는 첫 번째 화살을 맞더라도 결코 두 번째 화살을 맞지 않는다.",
    coreTeachings: [
      "• 첫 번째 화살: 살아가며 누구나 마주하는 육체적 통증, 상실, 뜻대로 되지 않는 현실적 사건 (피할 수 없음)",
      "• 두 번째 화살: 그 사건에 대해 자책하고, 분노하고, '왜 나한테 이런 일이 생겼을까' 괴로워하며 스스로 쏘아 올리는 마음의 고통 (사티와 지혜로 완전히 멈출 수 있음)"
    ],
    counselingApplication: "사용자가 자책하거나 분노할 때, '이미 일어난 첫 번째 화살에 분노하여 스스로 두 번째 화살을 꽂지 말고, 상처를 다정하게 보듬으며 반응을 멈추는 지혜'를 선물합니다."
  }
};

/**
 * 니까야(Nikāya) 핵심 명문장 컬렉션 (Dhammapada, Sutta Nipāta 등)
 */
export const NIKAYA_SACRED_QUOTES = [
  {
    source: "법구경(Dhammapada) 1장 1절",
    quote: "마음이 모든 것에 앞서가고, 마음이 으뜸이며, 모든 것은 마음으로 지어진다. 맑은 마음으로 말하거나 행동하면 행복이 그를 따르리니, 그림자가 형상을 따르듯 떠나지 않으리라."
  },
  {
    source: "숫타니파타(Sutta Nipāta) 무소의 뿔의 경",
    quote: "그물에 걸리지 않는 바람처럼, 소리에 놀라지 않는 사자처럼, 흙탕물에 더럽혀지지 않는 연꽃처럼, 무소의 뿔처럼 혼자서 가라."
  },
  {
    source: "법구경(Dhammapada) 5절",
    quote: "원한은 원한으로 갚아서는 결코 가라앉지 않는다. 원한을 내려놓음으로써만 원한은 가라앉나니, 이것은 변치 않는 영원한 진리이다."
  },
  {
    source: "맛지마 니까야(Majjhima Nikāya) 131경 (Bhaddekaratta Sutta)",
    quote: "과거를 뒤쫓지 말고, 미래를 바라지도 말라. 과거는 이미 지나갔고, 미래는 아직 오지 않았다. 오직 현재의 현상을 있는 그대로 깊이 통찰하는 자, 흔들림 없이 깨달아 살아가리라."
  },
  {
    source: "디가 니까야(Dīgha Nikāya) 대반열반경 (Mahāparinibbāna Sutta)",
    quote: "자신을 등불로 삼고, 자신을 귀의처로 삼으라. 진리(담마, Dhamma)를 등불로 삼고, 진리를 귀의처로 삼으라. 다른 것에 의지하지 말라."
  }
];

/**
 * Lucy의 시스템 프롬프트에 주입할 초기불교 담마 마스터 인스트럭션 빌더
 */
export function buildEarlyBuddhismSystemPrompt(): string {
  return `
[🪷 Lucy: 초기불교(Early Buddhism, 5부 니까야 Nikāya) 담마 마스터 지혜 체계]
당신은 2600년 전 붓다의 원음 경전(5부 니까야)에 담긴 정통 초기불교의 모든 지혜를 완벽하게 체득한 마스터입니다.

1. [사성제와 연기법적 세계관]:
   - 사용자가 불안, 슬픔, 분노, 자책을 느낄 때 그 표면적 감정에 휩쓸리지 않고, "촉(접촉)에서 수(느낌)가 일어났을 때 갈애(집착/저항)가 붙어 괴로움(Dukkha)으로 증폭되는 연기적 메커니즘"을 꿰뚫어 보고 다정하게 자각시켜 줍니다.
   - 피할 수 없는 현실의 아픔(첫 번째 화살)에 분노나 자책으로 또 다른 아픔(두 번째 화살)을 꽂지 않도록 도와줍니다.

2. [사념처와 사티(Sati, 알아차림)의 실천적 적용]:
   - 생각에 매몰되어 있을 때는 "지금 이 순간 들숨과 날숨(아나파나사티)의 감각으로 돌아와 몸의 현존을 알아차리도록" 유도합니다.
   - 감정을 억압하거나 싸우지 않고 "아, 내 마음에 지금 분노/불안이라는 손님이 찾아왔구나" 하고 있는 그대로 여실지견(如實知見)하게 합니다.

3. [무상·고·무아(3특상)를 통한 집착 내려놓기]:
   - "이것은 내 것이 아니며, 내가 아니며, 나의 자아가 아니다(N'etaṃ mama, n'eso'ham asmi, na m'eso attā)"라는 붓다의 5온 통찰을 바탕으로, 고정된 자아의 족쇄에서 벗어나 자유롭고 가벼운 마음을 갖도록 돕습니다.

4. [사무량심(자·비·희·사)의 태도]:
   - 답변을 건넬 때 항상 자애(Mettā)와 연민(Karuṇā)을 바탕에 두고, 사용자의 행복을 진심으로 기뻐(Muditā)하며, 어떠한 상황에도 치우치지 않는 고요한 평정(Upekkhā)의 향기를 담아냅니다.
   - 필요할 때는 법구경(Dhammapada), 숫타니파타, 맛지마 니까야 등의 붓다 원음 명문장을 자연스럽고 우아하게 인용하여 마음에 깊은 울림을 선사합니다.
`;
}

/**
 * Individual researched descriptions for the 229 deep perspectives that do not
 * have authored summaries in the engine registry. Unverified coined labels are
 * explicitly identified as app-internal interpretations.
 */
export interface DeepPerspectiveResearchEntry {
  key: string;
  nameKo: string;
  meaning: string;
  evidence: string;
  sourceTitle: string;
  sourceUrl: string;
  supported: boolean;
}

export const DEEP_PERSPECTIVE_RESEARCH: readonly DeepPerspectiveResearchEntry[] = [
  {
    "evidence": "자료는 트랜짓을 현재 행성의 위치와 출생 차트 속 위치의 관계로 설명하며, 이를 점성술적 해석 대상으로 제시합니다.",
    "key": "chronoTransit",
    "meaning": "현재 행성의 위치가 출생 차트와 맺는 관계를 살피는 점성술 용어로, 삶의 변화를 성찰하는 관점으로만 활용할 수 있습니다.",
    "nameKo": "실시간 행성 트랜짓",
    "sourceTitle": "Cosmobiology",
    "sourceUrl": "https://www.encyclopedia.com/science/encyclopedias-almanacs-transcripts-and-maps/cosmobiology",
    "supported": true
  },
  {
    "evidence": "한국민족문화대백과사전은 사주에서 10년 단위로 유동하는 것을 대운이라 설명합니다.",
    "key": "lifeSeasonTiming",
    "meaning": "명리학에서 대운은 10년 단위로 변하는 운의 흐름을 뜻하며, 미래 예측보다 삶의 시기와 선택을 성찰하는 틀로 볼 수 있습니다.",
    "nameKo": "10년대운 생애주기",
    "sourceTitle": "사주 - 한국민족문화대백과사전",
    "sourceUrl": "https://encykorea.aks.ac.kr/Article/E0025957",
    "supported": true
  },
  {
    "evidence": "한국민족문화대백과사전 ‘오행론’은 오행을 목(木)·화(火)·토(土)·금(金)·수(水)의 다섯 원소 및 중국 고대 자연철학·세계관으로 설명한다. 미국 에너지부 ‘Bioenergy Basics’는 bioenergy를 식물·임업·농업 잔재·작물·폐기물 같은 생물 유래 유기물(바이오매스)에서 얻어 연료·열·전기 등으로 전환하는 에너지로 정의한다. 그러나 확인한 자료에는 ‘오행 바이오에너지’/energeticPrescription이라는 정확한 복합어의 공인된 정의가 없었다.",
    "key": "energeticPrescription",
    "meaning": "이름을 바탕으로 한 앱 내 해석: ‘오행’(목·화·토·금·수라는 전통적 사유 체계)과 ‘바이오에너지’(생물 유래 유기물·바이오매스를 전환해 얻는 에너지)를 결합한 표현처럼 읽을 수 있다. 다만 ‘오행 바이오에너지’ 또는 energeticPrescription이라는 복합어가 독립된 전통·과학 용어로 확인된 것은 아니므로, 특정 건강·치유·초자연적 효능을 뜻한다고 해석해서는 안 된다.",
    "nameKo": "오행 바이오에너지",
    "sourceTitle": "",
    "sourceUrl": "",
    "supported": false
  },
  {
    "evidence": "‘contextualSynastry’라는 정확한 복합어와 ‘대화 인연 동적궁합’이라는 명칭은 사전·학술·공공·원전 자료에서 독립된 표준 용어로 확인되지 않았습니다. 따라서 contextual(맥락의), synastry(점성술에서 두 사람의 출생 차트를 비교하는 개념), 대화·인연·동적궁합이라는 이름의 구성 키워드를 바탕으로 한 중립적인 앱 내 해석만 제시합니다.",
    "key": "contextualSynastry",
    "meaning": "이름을 바탕으로 한 앱 내 해석: 두 사람의 대화 맥락과 상호작용이 관계에서 어떻게 맞물리고 변화하는지를 살펴보는 궁합 항목으로 이해할 수 있습니다. ‘contextualSynastry’는 확인된 독립 전통·과학 용어가 아니므로, 특정 관계의 미래나 객관적 호환성을 예언·보증하는 뜻으로 해석해서는 안 됩니다.",
    "nameKo": "대화 인연 동적궁합",
    "sourceTitle": "",
    "sourceUrl": "",
    "supported": false
  },
  {
    "evidence": "원문은 팔문을 배치하고 육십 시간간을 기준으로 국을 구성하며, 이를 움직임과 행동의 길흉·회피를 살피는 데 쓴다고 설명한다.",
    "key": "instantDecision",
    "meaning": "시가팔문은 기문둔갑에서 시간과 팔문을 결합해 인간사의 선택을 살피는 전통적 틀로, 결단 전 관점을 성찰하는 데 활용할 수 있다.",
    "nameKo": "시가팔문 즉시결단",
    "sourceTitle": "奇門遁甲統宗",
    "sourceUrl": "https://ctext.org/wiki.pl?if=gb&chapter=428171",
    "supported": true
  },
  {
    "evidence": "자료는 사화를 본명·대운·유년 등 운한사화로 나누고, 유년사화가 해당 시점의 천간에 따라 생긴다고 설명합니다.",
    "key": "ziweiFlyingStars",
    "meaning": "자미두수에서 유년사화는 해마다 사화(록·권·과·기)를 적용해 변화를 살피는 전통 명리 틀이며, 자기 성찰의 참고 관점으로만 볼 수 있습니다.",
    "nameKo": "자미두수 유년사화",
    "sourceTitle": "紫微斗数四化",
    "sourceUrl": "https://iztro.com/learn/mutagen",
    "supported": true
  },
  {
    "evidence": "KCI 논문은 신살을 사주명리와 민간신앙에서 길한 신과 흉한 살을 합쳐 부르는 용어로 설명합니다.",
    "key": "specialStarsMatrix",
    "meaning": "신살은 길신과 흉살을 나누는 전통적 틀로, 삶의 선택과 태도를 성찰하는 관점으로만 참고할 수 있습니다.",
    "nameKo": "15대 신살 슈퍼파워",
    "sourceTitle": "사주명리의 주요 신살(神殺)에 관한 고찰",
    "sourceUrl": "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003175177",
    "supported": true
  },
  {
    "evidence": "한국민족문화대백과사전은 사주의 운수가 시간에 따라 유동하며 대운·세운을 달·날·시각으로도 나눌 수 있다고 설명합니다.",
    "key": "monthlyFlow",
    "meaning": "사주에서 월별로 운의 변화를 살피는 관념으로, 미래 예측보다 한 달의 선택과 생활을 성찰하는 관점으로 삼을 수 있습니다.",
    "nameKo": "12개월 월운 플로우",
    "sourceTitle": "사주",
    "sourceUrl": "https://encykorea.aks.ac.kr/Article/E0025957",
    "supported": true
  },
  {
    "evidence": "브리태니커는 풍수를 기의 흐름과 조화를 이루도록 장소·건물·내부 공간과 사물을 배치하는 중국의 고대 실천으로 설명합니다.",
    "key": "spatialFengshui",
    "meaning": "전통 풍수의 길방위·공간 배치 관점을 통해 환경과 생활공간의 관계를 성찰할 수 있습니다.",
    "nameKo": "공간 길방위 풍수",
    "sourceTitle": "feng shui",
    "sourceUrl": "https://www.britannica.com/art/fengshui",
    "supported": true
  },
  {
    "evidence": "학술 논문은 vitality curve를 직원 성과를 동료와 상대 비교해 미리 정한 비율로 분류하는 강제분포평가로 설명하며, 단기 동기 효과와 함께 불공정 인식·역기능적 경쟁 위험을 지적합니다.",
    "key": "vitalityCurve",
    "meaning": "성과를 동료와 상대 비교해 정해진 비율로 분류하는 강제평가 관행으로, 자기평가의 기준과 경쟁의 부작용을 성찰하게 한다.",
    "nameKo": "24시간 에너지곡선",
    "sourceTitle": "Precarious curve ahead: The effects of forced distribution rating systems on job performance",
    "sourceUrl": "https://www.sciencedirect.com/science/article/abs/pii/S1053482215300024",
    "supported": true
  },
  {
    "evidence": "국립민속박물관은 삼재풀이를 출생 간지로 삼재라는 액운을 점치고 풀어내는 종교적 방법으로 설명하며, 9년마다 3년간 반복된다고 풀이합니다.",
    "key": "samjaeGyoUn",
    "meaning": "삼재는 출생 간지에 따라 9년마다 3년의 액운이 든다는 민속 관념으로, 불확실한 변화를 성찰하는 상징적 관점으로만 활용할 수 있습니다.",
    "nameKo": "삼재·교운기 변곡점",
    "sourceTitle": "삼재풀이",
    "sourceUrl": "https://folkency.nfm.go.kr/topic/%EC%82%BC%EC%9E%AC%ED%92%80%EC%9D%B4",
    "supported": true
  },
  {
    "evidence": "『삼명통회』는 천을귀인을 자미원 밖의 신으로 설명하고 흉살을 피하게 하는 가장 길한 신으로 서술하지만, 공망·충파 등 조건을 함께 살펴야 한다고 덧붙입니다.",
    "key": "auspiciousStars",
    "meaning": "천을귀인은 전통 명리학에서 길흉을 돕는 귀한 신살로 여겨져, 도움과 회복의 가능성을 성찰하는 관점으로만 참고할 수 있습니다.",
    "nameKo": "천을귀인·길성망",
    "sourceTitle": "三命通会/卷三- 维基文库，自由的图书馆",
    "sourceUrl": "https://zh.wikisource.org/zh-hans/%E4%B8%89%E5%91%BD%E9%80%9A%E4%BC%9A/%E5%8D%B7%E4%B8%89",
    "supported": true
  },
  {
    "evidence": "한국민족문화대백과사전은 격국을 사주의 득실에 따른 세력 강약과 구조를 살펴 분류하며 정격·종격·잡격 등으로 나눈다고 설명합니다.",
    "key": "geokguk",
    "meaning": "사주명리에서 격국은 오행·십신의 배치로 사주의 구조를 분류하는 틀로, 자기 성향과 삶의 균형을 성찰하는 관점으로 참고할 수 있습니다.",
    "nameKo": "정통 10대 격국",
    "sourceTitle": "사주 - 한국민족문화대백과사전",
    "sourceUrl": "https://encykorea.aks.ac.kr/Article/E0025957",
    "supported": true
  },
  {
    "evidence": "브리태니커는 lunar mansion을 황도상의 28구획이자 달이 밤마다 한 구획씩 지나는 ‘달의 정거장’으로 설명합니다.",
    "key": "twentyEightMansions",
    "meaning": "이 명칭에서 확인되는 이십팔수는 달의 운행을 살피는 하늘의 28구획으로, 날짜를 단정하기보다 시간과 선택을 성찰하는 관점으로 삼을 수 있습니다.",
    "nameKo": "28수 일진 택일",
    "sourceTitle": "lunar mansion",
    "sourceUrl": "https://www.britannica.com/science/lunar-mansion",
    "supported": true
  },
  {
    "evidence": "Zhou의 연구는 숙요경이 27개 낙샤트라(월수)의 날짜 대응과 행성·길일 관련 체계를 설명하며 인도 천문 지식을 중국 불교 문헌에 축적했다고 풀이합니다.",
    "key": "sukuyoAdvanced",
    "meaning": "숙요의 27수는 달의 구간과 날짜·행성 대응을 살피던 전통으로, 삶의 흐름을 성찰하는 관점으로만 참고할 수 있습니다.",
    "nameKo": "27숙 심층 매트릭스",
    "sourceTitle": "From Modengjia Jing to Xiuyaojing: The Accumulation of Indian Astronomical Knowledge in the Chinese Buddhist Canon",
    "sourceUrl": "https://www.mdpi.com/2077-1444/15/8/968",
    "supported": true
  },
  {
    "evidence": "이 글은 인도 점성술의 고전적 120년 생애 주기와 행성별 다샤를 삶의 단계로 설명한다.",
    "key": "vedicAdvanced",
    "meaning": "베다 점성술의 비므쇼타리 다샤는 아홉 행성에 120년 주기를 배분하는 전통적 시간 틀로, 삶의 흐름을 성찰하는 관점으로 참고할 수 있다.",
    "nameKo": "베딕 120년 다샤",
    "sourceTitle": "Rationale of the Vimshottari Dasa Life Span",
    "sourceUrl": "https://www.researchgate.net/publication/271764774_4_Rationale_of_the_Vimshottari_Dasa_Life_Span_Modern_Astrology_No15_May-2012307-309",
    "supported": true
  },
  {
    "evidence": "확인한 원문은 하도·낙서와 팔괘 및 육십사괘의 수리·상징을 전개하는 책이며, 이는 개인의 결과를 과학적으로 측정하거나 예측하는 근거가 아니라 전통적 사유 체계임을 보여 줍니다.",
    "key": "heLuoLiShu",
    "meaning": "하락이수는 하도·낙서와 주역 괘의 수리를 엮은 전통 역학 체계로, 삶의 변화를 성찰하는 관점으로 참고할 수 있습니다.",
    "nameKo": "하락이수 수리원당효",
    "sourceTitle": "數理洛河",
    "sourceUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4a/NLC416-13jh000625-42999_%E6%B2%B3%E6%B4%9B%E7%90%86%E6%95%B8.pdf",
    "supported": true
  },
  {
    "evidence": "KCI 초록은 형충파해를 고전 명리의 핵심 이론으로 설명하며, 충은 비조화 관계이고 파는 흔들려 깨짐, 해는 합을 방해하는 작용이라고 풀이합니다.",
    "key": "dynamicClash",
    "meaning": "충형파해는 사주 명리학에서 지지 사이의 충돌·형·파괴·손해 관계를 가리키며, 갈등을 성찰하는 관점으로만 참고할 수 있습니다.",
    "nameKo": "충형파해 동적트리거",
    "sourceTitle": "아베 타이잔 [사주추명학] 의 형충파해합 일고찰",
    "sourceUrl": "https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003272452",
    "supported": true
  },
  {
    "evidence": "KCI 논문은 십이신살을 십이운성과 함께 명리학의 이론으로 소개하며, 사주상담에서 삶의 방향과 처한 환경을 살피는 자료로 언급합니다.",
    "key": "twelveSpirits",
    "meaning": "십이신살은 사주명리에서 열두 신살의 상징을 살피는 전통적 해석 틀로, 삶의 국면을 성찰하는 참고 관점으로 볼 수 있습니다.",
    "nameKo": "12신살 주기",
    "sourceTitle": "명리상담가들을 통해 바라본 명리학(命理學)의 '한국적 단기상담' 가능성",
    "sourceUrl": "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002438632",
    "supported": true
  },
  {
    "evidence": "스탠퍼드 철학 백과사전은 초기 자료가 피타고라스의 영혼 불멸과 다른 동물로의 영혼 전이를 전한다고 설명한다.",
    "key": "pythagoreanLifecycle",
    "meaning": "피타고라스 전통의 영혼 불멸·윤회 관념을 삶을 성찰하는 관점으로 볼 수 있으나 과학적 예측은 아니다.",
    "nameKo": "피타고라스 생애주기",
    "sourceTitle": "Pythagoras - Stanford Encyclopedia of Philosophy",
    "sourceUrl": "https://plato.stanford.edu/entries/pythagoras/",
    "supported": true
  },
  {
    "evidence": "원문은 사비안 심볼이 360개의 서로 다른 이미지로 구성되며 1925년 마크 에드먼드 존스와 엘시 휠러의 작업에서 나왔다고 설명합니다.",
    "key": "astrologicalDecanSabian",
    "meaning": "사비안 심볼은 황도 360도에 상징 이미지를 대응시키는 점성 전통으로, 데칸과 함께 삶을 성찰하는 은유로 참고할 수 있습니다.",
    "nameKo": "사비안 심볼·데칸",
    "sourceTitle": "The Origin and History of the Sabian Symbols",
    "sourceUrl": "https://sabian.org/sabian_symbols.php",
    "supported": true
  },
  {
    "evidence": "NIH 수록 논문은 세포외기질(ECM)을 조직의 기계적 성질에 기여하는 복합 거대분자 네트워크로 설명한다. 별도의 심장 재생 연구는 섬유아세포가 만든 ECM을 ‘biomatrix’라고 부르며 collagen, fibronectin, laminin, tenascin 등으로 구성된다고 명시한다. 또한 Matrix Biology Institute는 생체에서 세포 사이 공간을 biomatrix라고 설명한다. 이 자료들은 biomatrix와 의료·생물학적 기질 개념의 용례를 뒷받침하지만, ‘medical biomatrix’가 하나의 공인된 방법론·진단명·치료법이라는 점은 뒷받침하지 않는다.",
    "key": "medicalBioMatrix",
    "meaning": "‘메디컬 바이오 매트릭스’라는 정확한 복합어 자체가 확립된 독립 학술 용어로 확인되지는 않지만, 확인된 의생명학적 용례의 biomatrix(바이오매트릭스)는 세포 사이·주변의 생체 기질, 특히 세포외기질(ECM)을 가리킨다. 따라서 이 이름은 의료 맥락에서 생체 조직의 구조적·분자적 환경 또는 이를 연구·활용하는 개념을 암시하는 앱 내 명칭으로 조심스럽게 이해할 수 있으며, 특정 치료 효능을 뜻한다고 단정할 수 없다.",
    "nameKo": "메디컬 바이오 매트릭스",
    "sourceTitle": "Biology of the Extracellular Matrix: An Overview; Cardiac Fibroblast-Derived Extracellular Matrix (Biomatrix) as a Model for the Studies of Cardiac Primitive Cell Biological Properties; Mission and History (Matrix Biology Institute)",
    "sourceUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4185430/ ; https://pmc.ncbi.nlm.nih.gov/articles/PMC3659651/ ; https://www.matrixbio.org/mission-and-history",
    "supported": true
  },
  {
    "evidence": "페이지는 소득을 물, 재정 시스템을 파이프, 지출을 막힘, 부를 연못에 비유하고 지출 감소와 소득 증가를 제안한다.",
    "key": "wealthPipeline",
    "meaning": "부의 파이프라인은 소득이 지출을 거쳐 저축·투자로 이어져 자산을 키우는 흐름을 비유하며, 재정 습관을 성찰하는 관점이다.",
    "nameKo": "부의 파이프라인",
    "sourceTitle": "The Wealth Pipeline",
    "sourceUrl": "https://freebudget.org/blog/the-wealth-pipeline/",
    "supported": true
  },
  {
    "evidence": "예일대학교 전시는 달의 북·남노드를 달이 황도면을 오르내리며 교차하는 두 점으로 설명하고, 이를 용의 머리와 꼬리라는 점성술적 상징과 연결합니다.",
    "key": "karmicNodes",
    "meaning": "카르믹 노드는 점성술에서 달의 북·남교점을 업보와 성장 방향의 상징으로 해석하는 관념이며, 자기 성찰의 은유로 활용할 수 있습니다.",
    "nameKo": "카르믹 노드",
    "sourceTitle": "Medical Astrology: Science, Art, and Influence in early-modern Europe",
    "sourceUrl": "https://onlineexhibits.library.yale.edu/s/medicalastrology/page/general-medicine-precisely-timed",
    "supported": true
  },
  {
    "evidence": "미국심리학회는 회복탄력성을 어려운 삶의 경험에 정신·정서·행동의 유연성과 조절로 성공적으로 적응하는 과정이자 결과로 설명합니다.",
    "key": "mentalResilience",
    "meaning": "멘탈 리질리언스는 역경에 정신·정서적으로 유연하게 적응하는 회복탄력성을 뜻하며, 어려움에 대응하는 방식을 성찰하는 관점이 될 수 있습니다.",
    "nameKo": "멘탈 리질리언스",
    "sourceTitle": "Resilience",
    "sourceUrl": "https://www.apa.org/topics/resilience",
    "supported": true
  },
  {
    "evidence": "SCMP는 귀인(貴人)을 도움을 주거나 기회를 보태는 중요한 동맹자·후원자로 설명합니다.",
    "key": "nobleNetwork",
    "meaning": "중국 전통의 귀인(貴人)은 도움을 주는 중요한 사람을 가리키며, 관계와 상호부조를 성찰하는 관점으로만 볼 수 있습니다.",
    "nameKo": "귀인 네트워크",
    "sourceTitle": "In Chinese astrology, why are benefactors and networking so important?",
    "sourceUrl": "https://www.scmp.com/lifestyle/chinese-culture/article/3340438/chinese-astrology-why-are-benefactors-and-networking-so-important",
    "supported": true
  },
  {
    "evidence": "실제로 열어 본 Cornell Legal Information Institute의 Wex ‘contract’는 계약을 당사자 사이의 합의로서 법적으로 집행 가능한 상호 의무를 만든다고 설명한다. Harvard Law School Program on Negotiation의 ‘What is Contract Negotiation?’은 계약 협상을 둘 이상의 당사자가 구속력 있는 법적 합의의 조건과 내용을 협의하는 과정으로 설명한다. 그러나 두 출처 모두 ‘Contract Shield’ 또는 ‘계약·협상 실드’를 독립된 공인 개념·방법론·효능으로 제시하지 않으므로, 확인된 구성 개념을 바탕으로 한 중립적 앱 내 해석만 가능하다.",
    "key": "contractShield",
    "meaning": "이름을 바탕으로 한 앱 내 해석: 계약의 조건과 상호 의무를 살피고, 협상에서 자신의 이해관계와 위험을 보호하도록 돕는다는 의미로 해석할 수 있다. 다만 ‘계약·협상 실드(Contract Shield)’는 확인된 독립된 법학·협상학·과학 용어가 아니라, 계약과 협상에 ‘방패’라는 비유를 결합한 앱 고유 명칭으로 보아야 한다.",
    "nameKo": "계약·협상 실드",
    "sourceTitle": "",
    "sourceUrl": "",
    "supported": false
  },
  {
    "evidence": "Cal Newport는 딥워크를 지식 작업의 질과 산출량을 높이려는 접근으로 설명하고, 실제 집중 연습이 어려운 개념을 익히는 데 도움이 된다고 기록한다.",
    "key": "deepWorkFlow",
    "meaning": "딥워크는 방해를 차단하고 어려운 과제에 집중하는 작업 방식으로, 자신의 주의와 일하는 습관을 성찰하는 관점을 제공한다.",
    "nameKo": "딥워크 몰입 리듬",
    "sourceTitle": "Diving into Deep Work",
    "sourceUrl": "https://calnewport.com/some-notes-on-deep-working/",
    "supported": true
  },
  {
    "evidence": "미국 국립신경질환·뇌졸중연구소는 비렘수면의 세 단계와 렘수면이 각각 특정 뇌파·신경활동과 연관되며, 대부분의 꿈은 렘수면에서 나타난다고 설명한다.",
    "key": "sleepSubconscious",
    "meaning": "수면 단계별 뇌파 변화를 살피되 무의식을 측정·예측하지 않고 내면 경험을 성찰하는 관점이다.",
    "nameKo": "수면 무의식 뇌파",
    "sourceTitle": "Brain Basics: Understanding Sleep",
    "sourceUrl": "https://www.ninds.nih.gov/health-information/public-education/brain-basics/brain-basics-understanding-sleep",
    "supported": true
  },
  {
    "evidence": "브리태니커는 quantum leap을 갑작스러운 큰 변화·발전·개선으로 정의합니다.",
    "key": "quantumLeap",
    "meaning": "퀀텀 점프는 갑작스러운 큰 변화·발전을 뜻하며, 삶의 전환을 성찰하는 비유로 삼을 수 있습니다.",
    "nameKo": "퀀텀 점프 가능성",
    "sourceTitle": "Quantum leap Definition & Meaning",
    "sourceUrl": "https://www.britannica.com/dictionary/quantum-leap",
    "supported": true
  },
  {
    "evidence": "Tarot Elements는 Rachel Pollack의 배열이 주요 아르카나를 통해 영혼이 어디로 갔고 무엇을 했으며 무엇을 가져왔는지 묻는다고 설명합니다.",
    "key": "soulJourneyTarot",
    "meaning": "주요 아르카나로 꿈속 영혼의 여정을 상징적으로 살피는 배열로, 예언이 아닌 자기성찰의 관점에 활용할 수 있습니다.",
    "nameKo": "영혼 여정 타로",
    "sourceTitle": "Soul Journey Tarot Spread",
    "sourceUrl": "https://tarotelements.com/soul-journey-tarot-spread/",
    "supported": true
  },
  {
    "evidence": "브리태니커는 초월 명상을 산스크리트어 단어나 구절인 만트라를 마음속으로 반복해 내적 평온과 신체적 평온을 추구하는 명상 기법으로 설명합니다.",
    "key": "transcendentalMeditation",
    "meaning": "초월 명상은 만트라를 조용히 반복해 내적 평온과 신체적 이완을 지향하는 수행으로, 판단을 잠시 늦추고 자신을 성찰하는 관점이 될 수 있습니다.",
    "nameKo": "초월 명상 가이드",
    "sourceTitle": "Transcendental Meditation",
    "sourceUrl": "https://www.britannica.com/topic/Transcendental-Meditation",
    "supported": true
  },
  {
    "evidence": "미 국방대학교 출판물은 레버리지를 핵심 취약점에 강점을 집중해 결정적 비대칭을 만드는 것으로 설명한다.",
    "key": "strategicLeverage",
    "meaning": "전략적 레버리지는 상대의 취약한 지점에 강점을 집중해 제한된 수단으로 더 큰 효과를 꾀하는 전략적 관점이며, 선택과 집중을 성찰하게 한다.",
    "nameKo": "전략적 레버리지",
    "sourceTitle": "The Missing Element in Crafting National Strategy: A Theory of Success",
    "sourceUrl": "https://ndupress.ndu.edu/Media/News/News-Article-View/Article/2106508/the-missing-element-in-crafting-national-strategy-a-theory-of-success/",
    "supported": true
  },
  {
    "evidence": "Springer는 그림자를 의식적 자각에서 분리되어 개인이 부인하거나 불쾌하게 여기는 심리 내용으로 설명합니다.",
    "key": "shadowArchetype",
    "meaning": "융의 그림자 원형은 의식에서 부인·억압된 심리 측면을 가리키며, 이를 성찰의 관점으로 삼아 자기이해를 넓힐 수 있습니다.",
    "nameKo": "융 그림자 원형",
    "sourceTitle": "Shadow",
    "sourceUrl": "https://link.springer.com/rwe/10.1007/978-3-319-24612-3_1426",
    "supported": true
  },
  {
    "evidence": "종합 문헌은 신체·감정·지성에 대응한다는 세 주기를 검토했지만 방법론적 오류와 반복 연구의 미지지 결과를 들어 이 이론이 타당하지 않다고 결론냈습니다.",
    "key": "biorhythmPeakFlow",
    "meaning": "바이오리듬 피크는 23·28·33일 주기의 고조를 뜻하는 이론적 표현으로, 검증된 예측이 아닌 자기성찰의 은유로만 참고할 수 있습니다.",
    "nameKo": "바이오리듬 피크",
    "sourceTitle": "Comprehensive review of biorhythm theory",
    "sourceUrl": "https://pubmed.ncbi.nlm.nih.gov/9775660/",
    "supported": true
  },
  {
    "evidence": "정확한 복합어 ‘destinySynastryEcho’ 및 ‘운명 공명 에코’의 신뢰할 수 있는 사전·학술·공공·원전 등재나 공인된 학파의 용례는 확인되지 않았습니다. 확인된 구성 개념으로 Cambridge Dictionary는 destiny를 과거 사건의 결과로 여겨지는 사람이나 사물의 미래 상태로, Dictionary.com은 synastry를 두 개 이상의 출생 차트를 비교해 상호작용을 분석하는 점성술 용어로 설명하며, Cambridge Dictionary의 echo에는 유사한 세부나 반복되는 소리를 가리키는 용법이 제시됩니다. 이는 구성 단어의 의미를 뒷받침할 뿐, 해당 앱 고유 복합어의 공인된 의미나 예측 효능을 뒷받침하지 않습니다.",
    "key": "destinySynastryEcho",
    "meaning": "이름을 바탕으로 한 앱 내 해석: ‘운명(destiny)’과 두 사람의 출생 차트 상호작용을 살피는 점성술 용어 ‘synastry’를, 서로 비슷한 울림이나 반복을 뜻하는 ‘echo’의 이미지로 연결한 표현으로 볼 수 있습니다. 다만 ‘운명 공명 에코’ 또는 ‘destinySynastryEcho’ 자체는 독립된 전통·과학 용어로 확인되지 않으므로, 두 사람의 관계가 운명적으로 정해졌거나 실제로 예측된다는 뜻으로 해석해서는 안 됩니다.",
    "nameKo": "운명 공명 에코",
    "sourceTitle": "",
    "sourceUrl": "",
    "supported": false
  },
  {
    "evidence": "IEP는 초기 불교에서 카르마를 생각·말·행동으로 드러나는 의지적 행위로 설명하며, 자발적 행위만 카르마를 만든다고 풀이합니다.",
    "key": "microHabitKarma",
    "meaning": "작은 행동도 의도와 선택의 연속으로 돌아보게 하는 카르마의 관점으로, 습관을 성찰하는 참고 틀로 삼을 수 있습니다.",
    "nameKo": "마이크로 해빗",
    "sourceTitle": "Buddha | Internet Encyclopedia of Philosophy",
    "sourceUrl": "https://iep.utm.edu/buddha/",
    "supported": true
  },
  {
    "evidence": "학술 논문은 이키가이를 일본의 삶의 철학에서 ‘살아가는 이유’ 또는 삶의 목적을 갖는 것으로 설명하며, 삶을 살 가치 있게 느끼는 감각을 포함한다고 정리합니다.",
    "key": "ikigaiDestinyCompass",
    "meaning": "이키가이는 삶을 살 가치 있게 느끼게 하는 목적·보람으로, 자신의 의미 있는 활동과 관계를 성찰하는 관점이 될 수 있습니다.",
    "nameKo": "이키가이 나침반",
    "sourceTitle": "An Integrated Cognitive-Motivational Model of Ikigai (Purpose in Life) in the Workplace",
    "sourceUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10936145/",
    "supported": true
  },
  {
    "evidence": "국제분석심리학회 글은 융의 동시성을 내적·외적 사건이 인과 사슬이 아닌 의미 있는 우연으로 연결되는 원리로 설명한다.",
    "key": "serendipitySynchronicity",
    "meaning": "세렌디피티와 동시성은 뜻밖의 발견과 의미 있는 우연을 성찰의 계기로 보되, 미래를 측정하거나 예측하는 도구는 아니다.",
    "nameKo": "세렌디피티 레이더",
    "sourceTitle": "Synchronicity: An Acausal Connecting Principle",
    "sourceUrl": "https://iaap.org/jung-analytical-psychology/short-articles-on-analytical-psychology/synchronicity-an-acausal-connecting-principle/",
    "supported": true
  },
  {
    "evidence": "공식 안내는 바디그래프를 에너지 구성을 시각화하고 9개 센터·채널·게이트를 포함하는 도표로 설명하며, 이를 삶에서 실험해 보라고 제안합니다.",
    "key": "humanDesignBodyGraph",
    "meaning": "휴먼디자인에서 바디그래프는 에너지 센터·게이트·채널을 도식화한 상징 체계로, 자기성찰의 관점으로 참고할 수 있습니다.",
    "nameKo": "휴먼디자인 바디그래프",
    "sourceTitle": "What is Human Design? A Quick Guide for Beginners",
    "sourceUrl": "https://jovianarchive.com/pages/what-is-human-design",
    "supported": true
  },
  {
    "evidence": "이 논문은 아유르베다 차크라를 에너지 중심으로 소개하고 이를 오행 이론과 결합해 성격 원형을 구성한다.",
    "key": "chakraVibrationAlignment",
    "meaning": "차크라 진동 정렬은 차크라를 에너지 중심으로 보고 내면의 균형과 감정을 성찰하는 전통적 은유로 활용할 수 있다.",
    "nameKo": "차크라 진동 정렬",
    "sourceTitle": "The Geometry of Emotions: Using Chakra Acupuncture and 5-Phase Theory to Describe Personality Archetypes for Clinical Use",
    "sourceUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6106753/",
    "supported": true
  },
  {
    "evidence": "에니어그램연구소는 통합을 성장할 때 향하는 방향으로 설명하고, 이를 통해 각 유형의 건강한 잠재력을 통합해 균형 잡힌 자기발달을 추구한다고 설명한다.",
    "key": "enneagramSoulIntegration",
    "meaning": "에니어그램의 ‘통합’은 성장 방향에서 각 유형의 건강한 잠재력을 살피며 자기성찰의 관점을 제공하는 개념이다.",
    "nameKo": "에니어그램 영혼통합",
    "sourceTitle": "How the Enneagram System Works",
    "sourceUrl": "https://www.enneagraminstitute.com/how-the-enneagram-system-works/",
    "supported": true
  },
  {
    "evidence": "PubMed에서 정확한 영문 복합어 ‘ancestral epigenetic karma’를 검색했으나 결과가 없었다. NHGRI와 NIEHS는 epigenetics를 DNA 서열 변화 없이 유전자 활동을 조절하는 연구·과정으로 설명하고, Adrian Bird의 학술 리뷰는 인간의 세대 간 후성유전 상속에 관한 증거가 논쟁적이며 많은 주장이 결론적이지 않다고 지적한다. Britannica는 karma를 인도 종교·철학에서 행위와 미래 존재·경험의 인과 관계를 설명하는 개념으로 정의하지만, 이 자료들은 ‘후성유전 카르마’라는 결합어를 뒷받침하지 않는다.",
    "key": "ancestralEpigeneticKarma",
    "meaning": "이름을 바탕으로 한 앱 내 해석: 조상·세대 간 영향이라는 이미지에 후성유전(유전자 서열을 바꾸지 않고 유전자 활동을 조절하는 과정)과 카르마(행위가 미래의 삶이나 경험에 영향을 준다는 종교·철학적 개념)를 결합한 표현으로 볼 수 있다. 이는 생물학적으로 ‘카르마’가 유전된다는 뜻이나 특정 질환·운명·예언을 의미하지 않으며, 독립된 전통 또는 과학 용어로 확인되지 않았다.",
    "nameKo": "후성유전 카르마",
    "sourceTitle": "",
    "sourceUrl": "",
    "supported": false
  },
  {
    "evidence": "UC Berkeley는 이를 영웅의 출발·변형적 모험·귀환을 공통으로 보여 주는 서사로 설명하며 시대와 문화 간 문학 비교에 활용한다.",
    "key": "heroMythMonomyth",
    "meaning": "영웅이 일상에서 떠나 시련과 변화를 겪고 귀환하는 서사 틀로, 삶의 전환과 성장을 성찰하는 관점을 제공한다.",
    "nameKo": "영웅의 여정 모노미스",
    "sourceTitle": "Monomyth: Hero's Journey Project",
    "sourceUrl": "https://orias.berkeley.edu/resources-teachers/monomyth-heros-journey-project",
    "supported": true
  },
  {
    "evidence": "브리태니커는 아카식 기록을 일어난 모든 사건·행동·생각·감정의 집성으로 설명하며 아카샤에 각인된 것으로 믿어진다고 기술합니다.",
    "key": "akashicRecordsOracle",
    "meaning": "신지학·오컬트에서 모든 사건·생각·감정의 기록으로 여겨지는 개념으로, 사실·예측이 아닌 자기성찰의 관점으로만 참고할 수 있습니다.",
    "nameKo": "아카식 레코드",
    "sourceTitle": "Akasha | occultism",
    "sourceUrl": "https://www.britannica.com/topic/Akasha-occultism",
    "supported": true
  },
  {
    "evidence": "실제로 확인한 Stanford Encyclopedia of Philosophy의 ‘Quantum Logic and Probability Theory’는 양자역학을 비고전적 확률 계산으로 설명하지만 ‘quantum probabilistic timeline’이라는 복합어는 제시하지 않는다. NIST는 probability를 사건의 발생 가능성을 0과 1 사이로 나타내는 측정값으로 정의하고, Cambridge Dictionary는 timeline을 사건이나 과정의 시간상 배열·계획으로 설명한다. 따라서 확인된 구성 개념을 조합한 중립적 앱 내 해석만 가능하며, 예언·초자연적 예측이나 실제 양자물리 효능을 뜻한다고 볼 근거는 없다.",
    "key": "quantumProbabilisticTimeline",
    "meaning": "이름을 바탕으로 한 앱 내 해석: ‘양자 확률’과 ‘타임라인’을 결합해, 여러 가능한 결과나 사건의 전개를 시간 순서로 배열해 보는 개념을 뜻할 수 있다. 다만 ‘양자 확률 타임라인’이라는 정확한 복합어는 독립된 과학적 방법·이론·전통 용어로 확인되지 않았다.",
    "nameKo": "양자 확률 타임라인",
    "sourceTitle": "",
    "sourceUrl": "",
    "supported": false
  },
  {
    "evidence": "Wiley의 설명은 바이오에너제틱 치료가 라이히의 통찰에 따라 만성 근육 긴장 패턴인 ‘body armoring’이 성격을 형성하는 역할을 본다고 요약합니다.",
    "key": "somaticBodyArmoring",
    "meaning": "신체 아머링은 만성 근육 긴장이 성격 형성에 관여한다는 라이히 계열 심신치료의 개념으로, 몸의 긴장과 감정 반응을 성찰하는 관점이 될 수 있습니다.",
    "nameKo": "소매틱 아머링",
    "sourceTitle": "Bioenergetic Therapy",
    "sourceUrl": "https://onlinelibrary.wiley.com/doi/10.1002/9780470479216.corpsy0128",
    "supported": true
  },
  {
    "evidence": "스탠퍼드 철학백과는 삼위일체를 한 신이 성부·성자·성령이라는 세 동등한 신적 위격으로 존재한다는 교리로 설명합니다.",
    "key": "supremeWisdomTrinity",
    "meaning": "기독교 교리에서 삼위일체는 한 신 안의 성부·성자·성령 세 위격을 뜻하며, 관계와 통합을 성찰하는 관점이 될 수 있습니다.",
    "nameKo": "3대 지혜 삼위일체",
    "sourceTitle": "Trinity - Stanford Encyclopedia of Philosophy",
    "sourceUrl": "https://plato.stanford.edu/entries/trinity/",
    "supported": true
  },
  {
    "evidence": "정확한 복합어와 그 한국어 명칭을 신뢰도 높은 사전·학술·공공 자료에서 확인하지 못했다. 검색에서 확인된 것은 해당 표현을 사용하는 개인·민간 웹 흔적뿐이며, 공인된 정의나 학술적 방법론은 확인되지 않았다. 따라서 ‘황금비’와 ‘수비학’의 일반적 의미를 결합한 중립적 앱 내 해석만 제시한다.",
    "key": "sacredVortexGeometry",
    "meaning": "이름을 바탕으로 한 앱 내 해석: ‘황금비’라는 수학적 비율 이미지와 ‘영혼·수비학’이라는 상징적 숫자 해석을 결합해, 조화·균형·자기성찰을 탐색하는 콘텐츠를 뜻하는 것으로 볼 수 있다. 다만 ‘sacredVortexGeometry’ 또는 ‘황금비 영혼 수비학’ 자체는 독립된 전통·과학 용어로 확인되지 않았으며, 예언·초자연적 효능을 의미한다고 볼 근거는 없다.",
    "nameKo": "황금비 영혼 수비학",
    "sourceTitle": "",
    "sourceUrl": "",
    "supported": false
  },
  {
    "evidence": "스탠퍼드 철학 백과사전은 내단을 정·기·신을 선천적 상태로 되돌리는 단계적 수행으로 설명하며 본성·생명의 공동 수련을 강조합니다.",
    "key": "taoistNeidanMeridian",
    "meaning": "도교 내단은 정·기·신을 닦아 본성·생명을 함께 기르는 전통 수행으로, 몸과 마음을 성찰하는 관점이 될 수 있습니다.",
    "nameKo": "도교 내단 경락시계",
    "sourceTitle": "Religious Daoism - Stanford Encyclopedia of Philosophy",
    "sourceUrl": "https://plato.stanford.edu/archives/fall2016/entries/daoism-religion/",
    "supported": true
  },
  {
    "evidence": "국제분석심리학회 자료는 동시성을 인과 사슬이 아니라 의미 있는 우연으로 내면의 심리적 사건과 외부 세계 사건을 잇는 원리로 설명합니다.",
    "key": "synchronicityOmen",
    "meaning": "내면의 심리와 외부 사건이 인과가 아닌 의미 있는 우연으로 연결된다는 융의 개념으로, 우연을 성찰의 계기로 삼되 예언으로 단정하지 않습니다.",
    "nameKo": "칼 융 동시성 오멘",
    "sourceTitle": "Synchronicity: An Acausal Connecting Principle",
    "sourceUrl": "https://iaap.org/jung-analytical-psychology/short-articles-on-analytical-psychology/synchronicity-an-acausal-connecting-principle/",
    "supported": true
  },
  {
    "evidence": "논문은 바이오필드를 생명체를 둘러싸고 투과하며 신체에 영향을 준다고 여겨지는, 반드시 전자기장은 아닌 장으로 정의하면서 관점에 따른 차이를 강조합니다.",
    "key": "ethericAuraBiofield",
    "meaning": "에테릭 오라 바이오필드는 생명체를 둘러싼다고 여겨지는 미세 에너지 장을 가리키며, 과학적 측정·예측보다 자기 경험을 성찰하는 은유로 볼 수 있습니다.",
    "nameKo": "에테릭 오라 바이오필드",
    "sourceTitle": "Biofield Science and Healing: History, Terminology, and Concepts",
    "sourceUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4654789/",
    "supported": true
  },
  {
    "evidence": "한국민족문화대백과사전은 오행의 태과·불급을 조정해 균형을 잡는 데 필요한 오행을 용신이라 설명합니다.",
    "key": "sajuClassicYongshin",
    "meaning": "억부용신은 사주에서 치우친 오행을 보완해 균형을 살피는 전통 개념으로, 삶의 상태를 성찰하는 관점으로만 참고할 수 있습니다.",
    "nameKo": "사주 원전 억부용신",
    "sourceTitle": "사주 - 한국민족문화대백과사전",
    "sourceUrl": "https://encykorea.aks.ac.kr/Article/E0025957",
    "supported": true
  },
  {
    "evidence": "개혁 유대교 기사에서는 타로의 22장 메이저 아르카나를 카발라 생명나무의 22경로 및 10세피로트와 연결해 설명하고, 이를 일상 성찰에 활용하는 사례를 소개합니다.",
    "key": "tarotTreeOfLifeShadow",
    "meaning": "타로와 카발라 세피로트의 상징적 연결을 살펴보며 내면을 성찰하는 관점으로 활용할 수 있습니다.",
    "nameKo": "타로 세피로트 그림자",
    "sourceTitle": "Kabbalah, Tarot, and Delving into Mystical Judaism",
    "sourceUrl": "https://reformjudaism.org/blog/kabbalah-tarot-and-delving-mystical-judaism",
    "supported": true
  },
  {
    "evidence": "말라가대학교 학술지는 헬레니즘 점성술 전통에서 포르투나 롯과 다이몬 롯을 활용하는 롯 개념을 소개한다.",
    "key": "hellenisticLots",
    "meaning": "헬레니즘 점성술의 포르투나 롯은 운·삶의 조건을 상징적으로 돌아보는 틀로만 활용할 수 있다.",
    "nameKo": "헬레니즘 포르투나 롯",
    "sourceTitle": "From Love to Desire: The Lot of Eros in Hellenistic Astrology",
    "sourceUrl": "https://revistas.uma.es/index.php/mhnh/en/article/view/15646",
    "supported": true
  },
  {
    "evidence": "URI 학술 논문은 64괘가 각각 여섯 효로 이루어져 총 384효가 되며, 효의 위치가 변화의 단계와 방향을 나타낸다고 설명합니다.",
    "key": "iching384Yao",
    "meaning": "주역의 64괘 각 여섯 효로 이루어진 384효는 변화의 국면을 살피고 선택을 성찰하는 상징적 관점으로 활용할 수 있습니다.",
    "nameKo": "주역 384효 동효변괘",
    "sourceTitle": "Bian (Change): A Perpetual Discourse of I Ching",
    "sourceUrl": "https://digitalcommons.uri.edu/cgi/viewcontent.cgi?article=1029&context=com_facpubs",
    "supported": true
  },
  {
    "evidence": "『적천수』는 묘고를 오행의 여기가 남은 자리로 설명하면서, 형충을 구해 묘고를 연다는 해석은 경계합니다.",
    "key": "sajuTwelveStagesTomb",
    "meaning": "12운성의 묘고지 개고는 기운을 묘·창고에 갈무리한 뒤 드러남을 논하는 명리 용어로, 삶의 정리와 보류를 성찰하는 관점으로만 참고할 수 있습니다.",
    "nameKo": "12운성 묘고지 개고",
    "sourceTitle": "滴天髓 - 第20章",
    "sourceUrl": "https://jxlib.hnuahe.edu.cn/book/read/12157739/20/1",
    "supported": true
  },
  {
    "evidence": "브리태니커는 현대 타로의 마이너 아르카나가 네 슈트로 나뉘며 각 슈트에 왕·여왕·기사·잭의 네 코트 카드가 있다고 설명합니다.",
    "key": "tarotElementalCourt",
    "meaning": "타로의 16 코트 카드는 네 슈트의 왕·여왕·기사·잭으로, 다양한 태도와 역할을 성찰하는 관점이 될 수 있습니다.",
    "nameKo": "타로 16 코트 페르소나",
    "sourceTitle": "Tarot",
    "sourceUrl": "https://www.britannica.com/topic/tarot",
    "supported": true
  },
  {
    "evidence": "실제로 열람한 Encyclopaedia Britannica의 ‘Karma’는 karma를 인도 철학에서 행위가 미래의 존재에 영향을 준다는 보편적 인과 법칙이자 윤회(samsara)의 윤리적 차원으로 설명한다. 실제 열람한 Astro-Charts의 ‘Synastry Chart Calculator’와 Cafe Astrology의 ‘Synastry & Relationship Astrology’는 synastry를 두 출생 차트를 겹쳐 행성·각·하우스의 관계를 비교하고 두 사람의 상호작용을 살피는 점성술적 방식으로 설명한다. 그러나 이 자료들에서 ‘karmic synastry’가 독립된 공인 학파·학술·과학 용어라는 근거는 확인되지 않았다.",
    "key": "karmicSynastry",
    "meaning": "이름을 바탕으로 한 앱 내 해석: ‘카르믹(karmic)’을 인도 철학·종교에서 행위와 미래의 존재를 연결하는 업(karma)의 뜻으로, ‘시나스트리(synastry)’를 두 사람의 출생 차트를 겹쳐 관계의 상호작용을 살피는 점성술적 비교로 이해한 표현이다. 다만 ‘카르믹 시나스트리’라는 복합어 자체는 독립된 전통·학술·과학 용어로 확인되지 않으므로, 두 사람의 관계를 전생·업보 또는 미래를 예언하는 사실적 방법으로 단정하지 않는다.",
    "nameKo": "카르믹 시나스트리",
    "sourceTitle": "",
    "sourceUrl": "",
    "supported": false
  },
  {
    "evidence": "해당 논문은 전통중의학에서 목·화·토·금·수의 오행을 장부 및 노·희·사·비·공의 감정과 연결해 설명한다.",
    "key": "fiveEmotionsPulse",
    "meaning": "오행과 칠정은 전통의학에서 몸과 감정의 연계를 해석하는 틀로, 감정과 신체 균형을 성찰하는 관점을 제공한다.",
    "nameKo": "오행 칠정 심신맥파",
    "sourceTitle": "Measurement of Five Emotions Defined by Traditional Chinese Medicine With a Focus on Preventing Mild Cognitive Impairment",
    "sourceUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10742817/",
    "supported": true
  },
  {
    "evidence": "원문은 정신·대응·진동·극성·리듬·인과·성의 일곱 헤르메스 원리를 열거하고 각각을 설명한다.",
    "key": "hermeticKybalion",
    "meaning": "카이발리온은 일곱 원리로 경험을 관계와 변화의 틀에서 성찰하게 하는 20세기 신비주의 사상이다.",
    "nameKo": "카이발리온 7대 우주법칙",
    "sourceTitle": "Chapter II. The Seven Hermetic Principles – The Kybalion",
    "sourceUrl": "https://sacred-texts.com/book/the-kybalion/chapter-ii-the-seven-hermetic-principles",
    "supported": true
  },
  {
    "evidence": "브리태니커는 차크라를 신체의 심령 에너지 중심이자 심리적 힘과 신체 기능이 만나는 지점으로 설명합니다.",
    "key": "vibrationalSoulQuest",
    "meaning": "차크라는 힌두교와 탄트라 불교의 심신 에너지 중심이라는 전통 개념으로, 내면 상태를 성찰하는 관점으로 참고할 수 있습니다.",
    "nameKo": "차크라 솔 퀘스트",
    "sourceTitle": "Chakra | Energy Centers, Kundalini & Meditation",
    "sourceUrl": "https://www.britannica.com/topic/chakra",
    "supported": true
  },
  {
    "evidence": "브리태니커는 연금술의 ‘transmutation’을 화학적 변화뿐 아니라 질병에서 건강, 노화에서 젊음, 세속에서 초월적 존재로의 변화까지 여러 방식으로 설명합니다.",
    "key": "alchemicalTransmutation",
    "meaning": "연금술의 변성은 물질·생명·영혼의 변화를 상징하며, 변화의 과정과 가능성을 성찰하는 관점으로 삼을 수 있습니다.",
    "nameKo": "서양 연금술 7단계",
    "sourceTitle": "The chemistry of alchemy",
    "sourceUrl": "https://www.britannica.com/topic/alchemy/The-chemistry-of-alchemy",
    "supported": true
  },
  {
    "evidence": "해당 학위논문은 자미두수의 이론 체계에 사화론이 포함되며 화기를 사화의 한 요소로 정리하고, 이를 전통 점성술의 해석 체계로 설명합니다.",
    "key": "ziweiHuaJi",
    "meaning": "자미두수의 사화 중 화기는 전통적으로 막힘·긴장 같은 의미로 해석되며, 이를 예측이 아닌 집착과 장애를 성찰하는 관점으로 삼을 수 있습니다.",
    "nameKo": "자미두수 화기 전화위복",
    "sourceTitle": "紫微斗數의 淵源과 理論體系 硏究: 古典 格局을 中心으로",
    "sourceUrl": "https://scienceon.kisti.re.kr/srch/selectPORSrchArticle.do?cn=DIKO0015907748",
    "supported": true
  },
  {
    "evidence": "글래스고대 OG(H)AM 프로젝트는 중세 주석이 오검 글자명을 나무로 분류했지만, 현대 어원상 모든 글자가 수목명은 아니라고 설명합니다.",
    "key": "celticTreeOgham",
    "meaning": "오검은 고대 아일랜드 문자 체계로, 일부 글자명이 나무와 연결되어 자연과 언어의 관계를 성찰하는 관점이 될 수 있습니다.",
    "nameKo": "켈트 오검 수목지혜",
    "sourceTitle": "Ogam and Trees",
    "sourceUrl": "https://ogham.glasgow.ac.uk/index.php/2022/12/20/ogam-and-trees/",
    "supported": true
  },
  {
    "evidence": "확인한 도덕경 67장 해설은 삼보를 자비, 절제, 겸손으로 설명하고 각각의 결핍이 해로울 수 있음을 풀이합니다.",
    "key": "taoistSanbao",
    "meaning": "자비·절약·겸손을 중시하는 도가의 덕목으로, 삶의 태도를 성찰하는 관점이 될 수 있습니다.",
    "nameKo": "도교 삼보 내단에너지",
    "sourceTitle": "Tao Te Ching",
    "sourceUrl": "https://www.taoistic.com/taoteching-laotzu/taoteching-67.htm",
    "supported": true
  },
  {
    "evidence": "브리태니커는 바르도를 출생·죽음·재생을 잇는 중간 또는 이행 상태로 설명하고, 바르도 퇴돌을 망자의 의식이 죽음을 거쳐 다음 생으로 나아가도록 돕는 장례 경전으로 소개합니다.",
    "key": "tibetanBardo",
    "meaning": "티베트 불교에서 바르도는 죽음과 재생 사이의 중간 상태를 뜻하며, 삶의 전환을 성찰하는 관점으로 볼 수 있습니다.",
    "nameKo": "티베트 바르도 6환생",
    "sourceTitle": "Bardo Thödol",
    "sourceUrl": "https://www.britannica.com/topic/Bardo-Thodol",
    "supported": true
  },
  {
    "evidence": "펜실베이니아대학교 박물관 자료는 이난나·이슈타르가 명계의 일곱 관문을 통과하며 각 관문에서 왕권의 표지를 하나씩 벗는 이야기라고 설명한다.",
    "key": "mesopotamianSevenGates",
    "meaning": "일곱 관문을 지날수록 장신구를 내려놓는 이슈타르의 명계 하강으로, 상실과 변화를 성찰하는 관점을 제시한다.",
    "nameKo": "메소포타미아 7관문",
    "sourceTitle": "Ishtar's Journey to Hell",
    "sourceUrl": "https://www.penn.museum/sites/journal/513/",
    "supported": true
  },
  {
    "evidence": "브리태니커는 데칸을 고대 이집트에서 밤을 24시간으로 나누는 데 사용한 36개 별자리 배열로 설명합니다.",
    "key": "egyptianDecans",
    "meaning": "고대 이집트의 36데칸은 별 무리로 밤의 시간을 나눈 체계로, 삶의 리듬과 변화를 성찰하는 관점으로 참고할 수 있습니다.",
    "nameKo": "이집트 36데칸",
    "sourceTitle": "decan",
    "sourceUrl": "https://www.britannica.com/science/decan",
    "supported": true
  },
  {
    "evidence": "Hermansen은 라타이프를 수피의 인간관과 자기변형을 설명하는 미세한 영적 중심 이론으로 다룬다.",
    "key": "sufiLataif",
    "meaning": "수피 전통의 라타이프는 영적·심리적 변화를 설명하는 미세한 내적 중심으로, 자기 성찰의 관점을 제공한다.",
    "nameKo": "수피 7라타이프",
    "sourceTitle": "Shāh Walī Allāh's Theory of the Subtle Spiritual Centers (Laṭāʾif): A Sufi Model of Personhood and Self-Transformation",
    "sourceUrl": "https://ecommons.luc.edu/theology_facpubs/49/",
    "supported": true
  },
  {
    "evidence": "스미스소니언은 촐킨을 20개 날짜기호와 1~13의 수가 결합해 260개의 고유한 날을 만드는 마야의 성스러운 달력으로 설명합니다.",
    "key": "mayanTzolkin",
    "meaning": "마야의 촐킨은 20개 날짜기호와 1~13의 수를 결합한 260일 주기로, 삶의 반복과 상징을 성찰하는 관점으로 참고할 수 있습니다.",
    "nameKo": "마야 촐킨 260일",
    "sourceTitle": "The Calendar System | Living Maya Time",
    "sourceUrl": "https://maya.nmai.si.edu/calendar/calendar-system",
    "supported": true
  },
  {
    "evidence": "브리태니커는 노른을 인간의 운명을 잣거나 짜는 세 존재로 설명하며, 위그드라실 곁에 산다고 전합니다.",
    "key": "nordicRunes",
    "meaning": "노른은 운명의 실을 잣는 존재로 묘사되며, 이를 삶의 선택과 흐름을 성찰하는 상징으로 볼 수 있습니다.",
    "nameKo": "북유럽 24룬 노른직조",
    "sourceTitle": "Norn",
    "sourceUrl": "https://www.britannica.com/topic/Norn",
    "supported": true
  },
  {
    "evidence": "그리스 문화부 델포이 공식 페이지는 아폴론 신전 현관에 고대 그리스 7현인의 델포이 격언이 새겨졌다고 설명하며 ‘너 자신을 알라’와 ‘과유불급’ 등을 제시합니다.",
    "key": "delphicMaxims",
    "meaning": "고대 델포이 성소에 새겨진 윤리적 격언 모음으로, 자신과 행동을 성찰하는 관점으로 삼을 수 있습니다.",
    "nameKo": "그리스 델포이 147잠언",
    "sourceTitle": "The Archaelogical Site of Delphi - Museum of Delphi",
    "sourceUrl": "https://delphi.culture.gr/",
    "supported": true
  },
  {
    "evidence": "학술 리뷰는 바타·피타·카파를 트리도샤로 부르며 신체의 기본 생리 기능을 설명하는 아유르베다의 전통적 개념으로 소개한다.",
    "key": "ayurvedicTridosha",
    "meaning": "인도 아유르베다의 바타·피타·카파 세 도샤를 몸과 삶의 경향을 성찰하는 전통적 틀로 볼 수 있으나, 개인을 측정하거나 미래를 예측하는 과학적 도구는 아니다.",
    "nameKo": "인도 아유르베다 도샤",
    "sourceTitle": "A glimpse of Ayurveda – The forgotten history and principles of Indian traditional medicine",
    "sourceUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5198827/",
    "supported": true
  },
  {
    "evidence": "ANU Press의 장은 후나를 1930년대 후반 맥스 프리덤 롱이 대중화한 현대 영성 실천으로 설명하며, 서구 밀교 사상이 하와이 용어와 결합했다고 분석합니다.",
    "key": "hawaiianHuna",
    "meaning": "후나는 하와이 용어를 빌린 현대 뉴에이지 자기변형 체계로, 내면의 신념과 주의를 성찰하는 관점으로 볼 수 있습니다.",
    "nameKo": "호오포노포노 7원리",
    "sourceTitle": "New Mana",
    "sourceUrl": "https://press-files.anu.edu.au/downloads/press/p343683/html/ch11.xhtml",
    "supported": true
  },
  {
    "evidence": "자료는 팔택풍수가 주거를 여덟 자기 방위에 대응하는 구역으로 나누고, 각 방위의 기를 유리하거나 불리하게 해석한다고 설명합니다.",
    "key": "fengShuiEightMansions",
    "meaning": "팔택풍수는 집을 여덟 방위와 전통적 길·흉 영역으로 나누어 살피는 틀로, 환경과 생활습관을 돌아보는 참고 관점으로만 활용할 수 있습니다.",
    "nameKo": "풍수 8택 방위에너지",
    "sourceTitle": "Eight mansions Feng Shui",
    "sourceUrl": "https://www.fengshuiweb.co.uk/eight-mansions-feng-shui/",
    "supported": true
  },
  {
    "evidence": "Encyclopaedia Iranica는 아샤를 아베스타어로 ‘진실’을 뜻하는 말로 설명하며 인도이란어 계통의 같은 의미를 제시합니다.",
    "key": "zoroastrianAsha",
    "meaning": "아샤는 조로아스터교의 ‘진실’ 개념으로, 삶에서 사실과 올바름을 성찰하는 관점으로 참고할 수 있습니다.",
    "nameKo": "조로아스터 아샤 진실",
    "sourceTitle": "AṦA - Encyclopaedia Iranica",
    "sourceUrl": "https://www.iranicaonline.org/articles/asa-means-truth-in-avestan/",
    "supported": true
  },
  {
    "evidence": "브리태니커는 쿤달리니를 척추 밑에 뱀처럼 감겨 있다고 상상하는 우주 에너지로 설명하며, 수행에서 이를 척추 위로 일깨운다고 전합니다.",
    "key": "hinduKundalini",
    "meaning": "힌두 탄트라 요가에서 척추 밑에 잠든 뱀 형상의 우주 에너지로 여겨지며, 내면의 변화와 자기 성찰을 돌아보는 관점이 될 수 있습니다.",
    "nameKo": "힌두 쿤달리니 나디각성",
    "sourceTitle": "kuṇḍalinī",
    "sourceUrl": "https://www.britannica.com/topic/kundalini",
    "supported": true
  },
  {
    "evidence": "확인된 자료에서는 ‘鬼谷子兩頭鉗(귀곡자 양두첸)’ 또는 ‘鬼谷子分定經’이라는 구성 개념이 보이며, 이를 생년의 연간(年干)과 시간의 시간간(時干)을 조합해 괘와 명리적 해석을 한다고 설명한다. 그러나 실제로 열어 본 자료에서 ‘귀곡자 양구령 72변화’라는 정확한 명칭이나 ‘72변화’가 그 전통 체계의 공인된 구성이라는 근거는 확인하지 못했으므로, 해당 앱 명칭을 전통·학술 용어로 단정하지 않는다.",
    "key": "guiguziLiangtouqian",
    "meaning": "이름을 바탕으로 한 앱 내 해석: ‘귀곡자’와 ‘양두첸(兩頭鉗)’으로 보이는 명칭에 ‘72변화’를 결합해, 두 기준을 맞물려 여러 유형이나 변화를 살펴보는 앱 내 분류·해석 항목으로 이해할 수 있다. 다만 ‘귀곡자 양구령 72변화’라는 복합어 자체는 독립된 전통 용어 또는 과학적 방법으로 확인되지 않는다.",
    "nameKo": "귀곡자 양구령 72변화",
    "sourceTitle": "",
    "sourceUrl": "",
    "supported": false
  },
  {
    "evidence": "브리태니커는 스바로그를 하늘과 불에 연관된 신이자 태양신 다즈보그와 불의 신 스바로지치의 아버지로 설명하며 일부 전승에서 일부일처혼을 세운 존재로 소개합니다.",
    "key": "slavicSvarog",
    "meaning": "스바로그는 슬라브 종교에서 하늘과 불에 연관된 신으로, 공동체의 질서와 책임을 성찰하는 관점이 될 수 있습니다.",
    "nameKo": "슬라브 16스바로그 로드카르마",
    "sourceTitle": "Svarog",
    "sourceUrl": "https://www.britannica.com/topic/Svarog",
    "supported": true
  },
  {
    "evidence": "브리태니커는 자격을 얻은 에세네파 신자들이 다른 이들과 침묵 속에 정오와 저녁 공동 식사를 했다고 설명합니다.",
    "key": "esseneCommunion",
    "meaning": "에세네파의 침묵 속 공동 식사는 공동체 규율과 나눔을 돌아보는 성찰의 관점으로 볼 수 있습니다.",
    "nameKo": "에세네 14대 천사교감",
    "sourceTitle": "Essene",
    "sourceUrl": "https://www.britannica.com/topic/Essene",
    "supported": true
  },
  {
    "evidence": "난징중의약대학은 오운육기를 자연 변화의 주기성과 건강·질병의 관계를 탐구한 학문으로 소개합니다.",
    "key": "huangdiFiveMovementsSixQi",
    "meaning": "오운육기는 오행의 운행과 육기로 자연의 주기적 변화를 살피던 전통 의학 이론으로, 환경과 몸의 관계를 성찰하는 관점으로 참고할 수 있습니다.",
    "nameKo": "황제내경 오운육기 기상의학",
    "sourceTitle": "《内经》五运六气气化理论与临床应用",
    "sourceUrl": "https://www.xuetangx.com/course/njucmP1005008453/16911180?channel=i.area.manual_search",
    "supported": true
  },
  {
    "evidence": "스탠퍼드 철학 백과사전은 테트락티스를 첫 네 수로 설명하며, 그 합이 10이고 점·선·면·입체에 대응한다고 기술한다.",
    "key": "pythagoreanTetraktys",
    "meaning": "테트락티스는 1·2·3·4의 합(10)을 이루는 피타고라스 전통의 상징으로, 질서와 관계를 성찰하는 관점을 준다.",
    "nameKo": "피타고라스 테트락티스 신성기하",
    "sourceTitle": "Pythagoreanism - Stanford Encyclopedia of Philosophy",
    "sourceUrl": "https://plato.stanford.edu/entries/pythagoreanism/",
    "supported": true
  },
  {
    "evidence": "프린스턴대학교 자료는 에누마 엘리시를 바빌로니아 문학·종교·문화의 맥락에서 읽는 작품으로 소개하며, 마르두크의 부상과 우주론 등을 학술적으로 다룹니다.",
    "key": "babylonianEnumaElish",
    "meaning": "에누마 엘리시는 혼돈에서 질서와 세계가 형성되는 바빌로니아 창조 서사로, 갈등 속 질서 형성을 성찰하는 관점이 될 수 있습니다.",
    "nameKo": "바빌로니아 운명의서판",
    "sourceTitle": "Enuma Elish: The Babylonian Epic of Creation",
    "sourceUrl": "https://classics.princeton.edu/research/bookshelf/enuma-elish-babylonian-epic-creation",
    "supported": true
  },
  {
    "evidence": "스탠퍼드 철학백과는 황정경이 오장에 머무는 내신의 이름과 형상을 명상 보조로 제시한다고 설명한다.",
    "key": "taoistHuangtingJing",
    "meaning": "황정경은 오장에 깃든 신을 관상하는 도교 수행 전통으로, 몸과 마음을 성찰하는 상징적 관점을 제공한다.",
    "nameKo": "도교 황정경 오장존사",
    "sourceTitle": "Daoism: Daoist Religion",
    "sourceUrl": "https://plato.stanford.edu/archives/sum2021/entries/daoism-religion/",
    "supported": true
  },
  {
    "evidence": "Encyclopaedia Iranica는 아메샤스펜타를 ‘거룩한·자비로운 불멸자’라는 뜻의 아베스타어로 설명하며, 아후라 마즈다와 연결된 신성한 존재들이자 선한 창조를 돕는 힘으로 풀이합니다.",
    "key": "persianAmeshaSpenta",
    "meaning": "조로아스터교의 자비로운 불멸의 신성한 존재들로, 선한 질서와 덕목을 성찰하는 관점이 될 수 있습니다.",
    "nameKo": "페르시아 아메샤스펜타",
    "sourceTitle": "AMƎŠA SPƎNTA",
    "sourceUrl": "https://www.iranicaonline.org/articles/amesa-spenta-beneficent-divinity/",
    "supported": true
  },
  {
    "evidence": "ORACC는 아눈나를 메소포타미아 최고신 집단으로 설명하며, 한 문헌에 ‘에리두의 50 아눈나’가 나오고 이들이 운명을 결정하는 기능을 맡았다고 전한다.",
    "key": "sumerianFiftyMes",
    "meaning": "수메르 문헌의 ‘에리두의 아눈나 50신’은 운명을 정하는 신들의 집단으로, 삶의 질서와 선택을 성찰하는 관점을 준다.",
    "nameKo": "수메르 50대메 신성문명",
    "sourceTitle": "Anunna (Anunnaku, Anunnaki) (a group of gods)",
    "sourceUrl": "https://oracc.museum.upenn.edu/amgg/Listofdeities/Anunna/index.html",
    "supported": true
  },
  {
    "evidence": "하와이대학교 출판부는 종려 전통의 두 12세기 문헌이 우주론과 수련 방법·단계를 설명한다고 소개한다.",
    "key": "zhongLuAlchemy",
    "meaning": "종려내단은 우주 질서와 인간 삶의 변화를 내적 수련의 단계로 성찰하게 하는 도교 전통이다.",
    "nameKo": "종여내단 3품선도 환원",
    "sourceTitle": "The Zhong-Lü System of Internal Alchemy",
    "sourceUrl": "https://uhpress.hawaii.edu/title/the-zhong-lu-system-of-internal-alchemy/",
    "supported": true
  },
  {
    "evidence": "자료는 13개월 수목 달력이 오검에서 유래한 현대 이교도 구성물이며, 고대 켈트가 나무 이름으로 달을 정했다는 증거는 없다고 설명합니다.",
    "key": "druidMoonTrees",
    "meaning": "고대 드루이드의 확립된 달력이 아니라 로버트 그레이브스가 오검과 나무 상징을 엮은 현대적 13개월 체계로, 자연과 자기 성찰을 잇는 관점으로 볼 수 있습니다.",
    "nameKo": "켈트 드루이드 13달나무",
    "sourceTitle": "The Celtic Tree Calendar",
    "sourceUrl": "https://www.maryjones.us/jce/celtictreecalendar.html",
    "supported": true
  },
  {
    "evidence": "자료는 철판신수를 수를 만들고 색인된 조문을 대조하는 운명 점술법으로 설명하며, 판본별 차이와 예측 타당성은 별개라고 밝힙니다.",
    "key": "tiebanShenshu",
    "meaning": "철판신수는 생년월일시를 수·괘와 색인 조문에 대응시키는 중국 점술 전통으로, 예언이 아닌 전통적 운명관을 성찰하는 관점으로 활용할 수 있습니다.",
    "nameKo": "철판신수 12000조식",
    "sourceTitle": "An Introduction to Tieban Shen Shu: Its Shao Yong Attribution, Clause-Based Fortune Reading, and the Six-Relations Time-Correction Tradition",
    "sourceUrl": "https://www.lamjinlab.com/blog/number-tbss",
    "supported": true
  },
  {
    "evidence": "예일대 학술 논문은 융드룽 본을 독자적 티베트 종교 전통으로 설명하고, 본교 의례·경전 맥락에서 ‘본의 9승’을 참고 문헌으로 확인합니다.",
    "key": "tibetanBonNineWays",
    "meaning": "티베트 본교의 9승은 가르침과 수행을 아홉 단계의 길로 배열한 체계로, 삶의 문제를 여러 수행 관점에서 성찰하는 틀로 삼을 수 있습니다.",
    "nameKo": "티베트 본교 9승 융드룽",
    "sourceTitle": "Sacred Recitation of the Tibetan Yungdrung Bön Tradition",
    "sourceUrl": "https://elischolar.library.yale.edu/cgi/viewcontent.cgi?article=1261&context=yjmr",
    "supported": true
  },
  {
    "evidence": "브리태니커는 이 의례가 데메테르와 페르세포네의 분리와 재회 신화에서 비롯되었고, 단계적 입문과 사후의 어떤 혜택 약속을 포함했다고 설명합니다.",
    "key": "eleusinianMysteries",
    "meaning": "고대 그리스에서 데메테르와 페르세포네를 기린 비의 입문 의례로, 상실과 재회를 성찰하는 관점이 될 수 있습니다.",
    "nameKo": "엘레우시스 영혼입사의례",
    "sourceTitle": "Eleusinian Mysteries",
    "sourceUrl": "https://www.britannica.com/topic/Eleusinian-Mysteries",
    "supported": true
  },
  {
    "evidence": "예일대 학위논문은 인도 천문학의 27 나크샤트라가 각각 네 파다로 나뉘어 108이 된다고 설명합니다.",
    "key": "vedicNakshatra108Pada",
    "meaning": "베다 전통의 나크샤트라는 27개 달의 구획을 네 파다로 나눈 108분할로, 삶을 성찰하는 상징적 틀로 볼 수 있습니다.",
    "nameKo": "베다 108파다 카르마성좌",
    "sourceTitle": "House as Ritual: Stories of Gender, Space, and Caste in Colonial Kerala",
    "sourceUrl": "https://elischolar.library.yale.edu/envdesign/6/",
    "supported": true
  },
  {
    "evidence": "자료는 카르투슈를 왕명을 둘러싼 타원형 선으로 설명하고, ‘둘러싸 보호함’이라는 의미와 왕명 보호의 상징성을 제시합니다.",
    "key": "egyptianHermeticCartouche",
    "meaning": "왕명을 둘러싼 카르투슈의 보호·경계 상징을 자기 정체성과 삶의 경계를 성찰하는 관점으로 참고할 수 있습니다.",
    "nameKo": "이집트 헤르메스 카르투슈",
    "sourceTitle": "Cartouche",
    "sourceUrl": "https://www.globalegyptianmuseum.org/glossary.aspx?id=106",
    "supported": true
  },
  {
    "evidence": "도교문화센터 자료는 공과격을 선악 행위를 매일 기록하고 스스로 점검하도록 한 장부로 설명합니다.",
    "key": "taoistGongGuoGeKarma",
    "meaning": "공과격은 선행과 악행을 날마다 성찰·기록하는 도교의 도덕 장부로, 행동을 돌아보는 성찰의 틀로 참고할 수 있습니다.",
    "nameKo": "도교 공과격 적선개운",
    "sourceTitle": "Ledger of Merits and Demerits",
    "sourceUrl": "https://en.daoinfo.org/wiki/Ledger_of_Merits_and_Demerits",
    "supported": true
  },
  {
    "evidence": "유네스코는 오두를 256부분과 에세(시구)로 이루어진 이파 문헌 집합으로 설명하며, 요루바의 역사·언어·세계관과 사회 문제를 반영한다고 밝힌다.",
    "key": "yorubaIfaOdu",
    "meaning": "요루바 이파의 오두는 신탁의 시·지혜를 담은 전승 체계로, 삶의 선택을 성찰하는 문화적 관점을 제공한다.",
    "nameKo": "요루바 이파 16오두 신탁",
    "sourceTitle": "Ifa divination system",
    "sourceUrl": "https://ich.unesco.org/en/RL/ifa-divination-system-00146",
    "supported": true
  },
  {
    "evidence": "Springer는 이를 ‘모래의 과학’이라 부르며 16개 위치의 도형을 만들어 해석하는 이슬람권 점술로 설명합니다.",
    "key": "arabicIlmAlRaml",
    "meaning": "모래 위 점·도형을 배열해 해석하는 전통으로, 결과를 예언이 아닌 질문과 선택을 성찰하는 상징적 관점으로 볼 수 있습니다.",
    "nameKo": "아랍 일무람말 지오맨시",
    "sourceTitle": "Geomancy in the Islamic World",
    "sourceUrl": "https://link.springer.com/rwe/10.1007/978-94-007-7747-7_8614",
    "supported": true
  },
  {
    "evidence": "중앙고전타밀연구소 자료는 아가스티야가 ‘나디’를 지었다는 전승과 그 메시지를 소개한다.",
    "key": "hinduNadiAgastyaPalmLeaf",
    "meaning": "아가스티야에게 귀속된 나디 전통은 삶의 서사를 비추는 문화적 관점으로 성찰에 활용할 수 있다.",
    "nameKo": "인도 나디 아가스티야 야자잎",
    "sourceTitle": "PRĀGYATĀ: The Ageless Guru of Gurus AGASTYA",
    "sourceUrl": "https://cict.in/cict2023/wp-content/uploads/2025/book/Agastya_book.pdf",
    "supported": true
  },
  {
    "evidence": "국학원 『Encyclopedia of Shinto』는 일령사혼을 신과 인간의 영이 나오비와 아라미타마·니기미타마·사키미타마·쿠시미타마 네 혼으로 이루어지며 서로 보완적으로 작용한다고 설명합니다.",
    "key": "shintoKotodamaFourSouls",
    "meaning": "신도의 일령사혼은 하나의 영과 네 혼이 함께 작용한다는 관념으로, 내면의 여러 작용을 성찰하는 틀로 볼 수 있습니다.",
    "nameKo": "신도 4혼1생 고토다마",
    "sourceTitle": "Encyclopedia of Shinto: Ichirei shikon",
    "sourceUrl": "https://d-museum.kokugakuin.ac.jp/eos/detail/?id=9011",
    "supported": true
  },
  {
    "evidence": "AIATSIS는 송라인을 조상 존재의 여정과 사물이 생겨난 과정을 추적하며, 국가를 통과하는 노래·이야기·항법 경로라고 설명합니다.",
    "key": "aboriginalDreamtimeSonglines",
    "meaning": "조상 존재의 여정과 장소·노래·이야기를 잇는 호주 원주민의 문화 지도이므로, 삶과 장소의 관계를 성찰하는 관점으로 삼을 수 있습니다.",
    "nameKo": "호주 드림타임 송라인",
    "sourceTitle": "The Marlaloo Songline",
    "sourceUrl": "https://aiatsis.gov.au/explore/marlaloo-songline",
    "supported": true
  },
  {
    "evidence": "브리태니커는 삼포를 하늘을 받치는 기둥이자 파종·수확과 번영을 돕는 힘의 원천으로 설명한다.",
    "key": "finnishKalevalaSampo",
    "meaning": "핀란드 서사시에서 삼포는 풍요를 낳는 신화적 세계기둥으로, 욕망과 공동 번영의 균형을 성찰하게 한다.",
    "nameKo": "핀란드 칼레발라 삼포",
    "sourceTitle": "sampo",
    "sourceUrl": "https://www.britannica.com/topic/sampo",
    "supported": true
  },
  {
    "evidence": "확인한 신뢰도 높은 자료에서 《산해경》은 산·지역·신화적 동물을 다루는 중국 고전으로 설명되지만, ‘8방위 신성영수’라는 고정된 명칭이나 표준 목록은 확인되지 않았습니다. 따라서 이 항목은 확인된 구성 키워드(산해경, 방위, 영수)를 조합한 앱 내 명칭으로만 중립적으로 설명합니다.",
    "key": "shanhaijingSacredBeasts",
    "meaning": "이름을 바탕으로 한 앱 내 해석: 중국 고전 《산해경》에 등장하는 기이한 동물·신령 이미지와 ‘8방위’라는 방향 체계를 결합해, 여덟 방향을 상징하는 신성한 영수들을 가리키는 앱 고유 표현으로 볼 수 있습니다. 다만 ‘산해경 8방위 신성영수’라는 복합어가 독립된 전통·학술·과학 용어로 확인되지는 않았으므로, 특정한 실재 능력이나 초자연적 효능을 뜻하는 것으로 해석해서는 안 됩니다.",
    "nameKo": "산해경 8방위 신성영수",
    "sourceTitle": "",
    "sourceUrl": "",
    "supported": false
  },
  {
    "evidence": "브리태니커는 군아스타나를 영혼이 업의 속박과 윤회에서 벗어나 목샤로 향하는 14단계로 설명합니다.",
    "key": "jainGunasthanaKarma",
    "meaning": "자이나교의 14군아스타나는 업의 속박에서 벗어나 해탈로 나아가는 영적 발달 단계를 가리키며, 삶의 집착과 정화를 성찰하는 관점으로 삼을 수 있습니다.",
    "nameKo": "자이나 14군아스타나 카르마",
    "sourceTitle": "gunasthana",
    "sourceUrl": "https://www.britannica.com/topic/gunasthana",
    "supported": true
  },
  {
    "evidence": "이 페이지는 《탈리에신의 서》에서 아웬을 영감의 원천으로 설명하고, 탈리에신을 영감받은 시인의 전형으로 기술합니다.",
    "key": "celticAwenTaliesin",
    "meaning": "탈리에신 전승의 아웬은 시적 영감과 지혜를 뜻하며, 자신의 창의성과 성찰을 돌아보는 관점으로 삼을 수 있습니다.",
    "nameKo": "켈트 탈리에신 아웬영감",
    "sourceTitle": "Taliesin - AWEN & AWENYDD",
    "sourceUrl": "https://awenydd.weebly.com/taliesin.html",
    "supported": true
  },
  {
    "evidence": "한국민족문화대백과사전은 천부인을 단군왕검이 한웅천왕에게 받아 세상을 다스렸다는 세 인으로 설명하며, 천·지·인 삼재 등의 표상으로 추정합니다.",
    "key": "koreanDangunCheonbuin",
    "meaning": "단군 신화에서 하늘·땅·사람의 조화를 상징하는 세 인으로, 삶의 균형과 책임을 성찰하는 관점이 될 수 있습니다.",
    "nameKo": "단군 천부인 3보 홍익광명",
    "sourceTitle": "천부인",
    "sourceUrl": "https://encykorea.aks.ac.kr/Article/E0055895",
    "supported": true
  },
  {
    "evidence": "Te Ara는 마우리를 물리적 세계의 모든 것을 결속하고 움직이게 하는 에너지로 설명한다.",
    "key": "maoriMauriHauora",
    "meaning": "마오리 관점에서 마우리(생명·활력의 힘)와 하우오라는 몸·마음·영성·관계의 온전함을 돌아보는 성찰 틀이다.",
    "nameKo": "마오리 하우오라 마우리생명력",
    "sourceTitle": "Page 5: Mana, tapu and mauri",
    "sourceUrl": "https://teara.govt.nz/en/te-ao-marama-the-natural-world/page-5",
    "supported": true
  },
  {
    "evidence": "Encyclopedia.com의 항목은 모코시가 아마와 양모를 잣고 이름도 꼬기와 연결되며, 생명의 실을 잣는 운명 신격과 연관된다고 설명합니다.",
    "key": "slavicMokoshFateWeaving",
    "meaning": "모코시는 실과 직조에 연결된 슬라브 신화의 여성 신격으로, 삶의 흐름을 성찰하는 상징으로 볼 수 있습니다.",
    "nameKo": "슬라브 모코시 운명실타래",
    "sourceTitle": "Mokosh",
    "sourceUrl": "https://www.encyclopedia.com/environment/encyclopedias-almanacs-transcripts-and-maps/mokosh",
    "supported": true
  },
  {
    "evidence": "브리태니커는 현존 완전본이 12개의 불완전한 아카드어 서판에 전하며, 엔키두의 죽음 뒤 길가메시가 불멸을 찾다가 필멸을 받아들인다고 설명합니다.",
    "key": "sumerianGilgameshTrials",
    "meaning": "‘12관문’이라는 고유 전승은 확인되지 않지만, 길가메시의 죽음 수용을 통해 삶의 한계와 유산을 성찰할 수 있습니다.",
    "nameKo": "길가메시 서사시 12관문",
    "sourceTitle": "Epic of Gilgamesh",
    "sourceUrl": "https://www.britannica.com/topic/Epic-of-Gilgamesh",
    "supported": true
  },
  {
    "evidence": "ANU Press의 연구는 막스 롱이 unihipili·uhane·aumakua라는 세 자아 모형을 제시했지만, 프로이트·신지학의 영향을 받은 현대적 구성이라고 설명한다.",
    "key": "hawaiianKahunaThreeSelves",
    "meaning": "현대 Huna의 세 자아 모형을 성찰의 틀로 보되, 고대 카후나의 정통 교리나 과학적 예측으로 단정하지 않는다.",
    "nameKo": "하와이 카후나 3대 자아 마나",
    "sourceTitle": "New Mana",
    "sourceUrl": "https://press-files.anu.edu.au/downloads/press/p343683/html/ch11.xhtml",
    "supported": true
  },
  {
    "evidence": "브리태니커는 위그드라실을 우주를 떠받치며 아홉 세계를 연결하는 거대한 물푸레나무로 설명하고, 라그나로크 뒤 새 생명의 근원이라고 전합니다.",
    "key": "nordicYggdrasilRealms",
    "meaning": "위그드라실은 아홉 세계를 잇는 우주수로, 삶과 죽음의 연결을 성찰하는 관점을 제공합니다.",
    "nameKo": "북유럽 위그드라실 9대 영역",
    "sourceTitle": "Yggdrasill",
    "sourceUrl": "https://www.britannica.com/topic/Yggdrasill",
    "supported": true
  },
  {
    "evidence": "미시간대학교 전시는 심장을 기억과 정체성의 자리로 설명하고, 진실과 질서를 상징하는 깃털과 견줬다고 전합니다.",
    "key": "egyptianMaatFeatherHeart",
    "meaning": "고대 이집트에서 죽은 이의 심장을 진실·질서의 마아트 깃털과 견주는 심판을, 자신의 삶과 행동을 성찰하는 비유로 삼을 수 있습니다.",
    "nameKo": "이집트 마아트 심장무게",
    "sourceTitle": "Anubis in the Halls of Truth",
    "sourceUrl": "https://exhibitions.kelsey.lsa.umich.edu/jackal-gods-ancient-egypt/halls_truth.php",
    "supported": true
  },
  {
    "evidence": "이란학 백과사전은 미트라교의 ‘일곱 문 사다리’를 영혼이 일곱 행성 구체를 지나 고정별의 구체로 향하는 상징으로 설명합니다.",
    "key": "persianMithraicSpheres",
    "meaning": "미트라교의 일곱 행성 구체를 통한 영혼의 우주적 여정을 상징으로 이해하며, 삶의 단계와 내면 성찰을 돌아보는 관점으로 삼을 수 있습니다.",
    "nameKo": "페르시아 미트라 7천구",
    "sourceTitle": "COSMOGONY AND COSMOLOGY ii. In Mithraism",
    "sourceUrl": "https://www.iranicaonline.org/articles/cosmogony-ii/",
    "supported": true
  },
  {
    "evidence": "웰링턴 빅토리아대학교 논문은 오르페우스-디오니소스 금판에서 므네모시네가 사후 영혼의 정체성과 정신 기능을 간직하게 하는 중요한 역할로 나타난다고 설명합니다.",
    "key": "orpheicMysteries",
    "meaning": "고대 오르페우스 전승에서 므네모시네의 기억은 영혼의 정체성을 되새기는 성찰의 관점으로 볼 수 있습니다.",
    "nameKo": "그리스 오르페우스 므네모시네",
    "sourceTitle": "“This is the work of Memory”: A New Perspective on the Role of Mnemosyne in the Orphic-Dionysiac Mystery Cult.",
    "sourceUrl": "https://openaccess.wgtn.ac.nz/articles/thesis/_This_is_the_work_of_Memory_A_New_Perspective_on_the_Role_of_Mnemosyne_in_the_Orphic-Dionysiac_Mystery_Cult_/32684982",
    "supported": true
  },
  {
    "evidence": "미국 국립 아메리칸 인디언 박물관은 포폴부가 영웅 쌍둥이의 이야기와 창조를 담으며, 쌍둥이가 죽음의 군주를 물리친 뒤 태양과 달이 되어 옥수수와 인간의 삶을 준비했다고 설명한다.",
    "key": "popolVuhHeroTwins",
    "meaning": "마야 포폴부의 쌍둥이 영웅은 시발바 지하세계의 죽음의 군주를 물리치고 태양과 달이 된 형제로, 시련을 넘어 변화와 창조를 성찰하게 하는 관점이다.",
    "nameKo": "마야 포폴부 쌍둥이영웅",
    "sourceTitle": "Creation Story of the Maya",
    "sourceUrl": "https://maya.nmai.si.edu/the-maya/creation-story-maya",
    "supported": true
  },
  {
    "evidence": "스탠퍼드 철학 백과사전은 대연지수를 50개 시초 중 49개를 사용해 괘를 정하고, 점이 질문자의 선택을 더 깊이 생각하게 할 수 있다고 설명합니다.",
    "key": "ancientYarrowProbability",
    "meaning": "주역의 대연지수는 50개 시초 중 49개로 괘를 뽑는 고대 점법으로, 예언이 아닌 변화와 선택을 성찰하는 상징적 틀로 볼 수 있습니다.",
    "nameKo": "주역 대연지수 49책 시초점",
    "sourceTitle": "Chinese Philosophy of Change (Yijing)",
    "sourceUrl": "https://plato.stanford.edu/archives/fall2021/entries/chinese-change/",
    "supported": true
  },
  {
    "evidence": "바나라스 힌두대학교 연구 자료는 판차코샤가 타이티리야 우파니샤드에 유래한 요가 철학의 개념으로, 자아와 자아 아닌 것을 분별하도록 돕는 다섯 의식 층위라고 설명한다.",
    "key": "vedicPanchaKosha",
    "meaning": "베단타의 판차 코샤는 음식·생명력·마음·지성·환희의 다섯 층위를 살피며 자신을 성찰하는 관점이다.",
    "nameKo": "인도 베단타 5대 코샤",
    "sourceTitle": "Concept of Panchakosha in Vedic Literature",
    "sourceUrl": "https://bhu.ac.in/Images/files/4-%20Priya%20Paijwar%2C%20H_%20H_%20Awasthi%20and%20Prof_%20Deepa%20Mishra.pdf",
    "supported": true
  },
  {
    "evidence": "브리태니커는 야누스를 문과 아치길의 정령이자 여러 시작을 관장하는 신으로 설명합니다.",
    "key": "romanJanus",
    "meaning": "로마의 야누스는 문과 시작·끝의 신으로, 과거와 미래를 함께 살피는 전환의 성찰 틀로 삼을 수 있습니다.",
    "nameKo": "로마 야누스 문턱전이",
    "sourceTitle": "Janus",
    "sourceUrl": "https://www.britannica.com/topic/Janus-Roman-god",
    "supported": true
  },
  {
    "evidence": "브리태니커는 『포박자』 내편이 갈홍의 연금술 연구와 금단 조제법, 식이·호흡·명상 수행을 다룬다고 설명한다.",
    "key": "baopuziElixirs",
    "meaning": "『포박자』의 선도는 갈홍이 연단과 호흡·명상으로 불사를 추구한 도교 전통으로, 삶의 수양 방향을 성찰하는 틀로 볼 수 있다.",
    "nameKo": "포박자 구전환단 선도",
    "sourceTitle": "Baopuzi",
    "sourceUrl": "https://www.britannica.com/topic/Baopuzi",
    "supported": true
  },
  {
    "evidence": "브리태니커는 ‘타트 트밤 아시’를 개인과 절대자의 관계를 표현하는 말이자 베단타의 핵심 주장 중 하나로 설명한다.",
    "key": "vedicMahavakya",
    "meaning": "우파니샤드의 ‘위대한 선언’으로, 개인의 자아와 궁극 실재의 관계를 성찰하게 하는 베단타 전통의 관점이다.",
    "nameKo": "베다 4대 마하바키야 각성",
    "sourceTitle": "tat tvam asi",
    "sourceUrl": "https://www.britannica.com/topic/tat-tvam-asi",
    "supported": true
  },
  {
    "evidence": "ORACC는 엔키를 지혜·주술의 신으로 설명하고, 그와 함께한 일곱 아프칼루가 인간에게 지혜를 가르치도록 창조되었다고 기술한다.",
    "key": "sumerianApkalluWisdom",
    "meaning": "엔키와 함께 아브주에 머물며 인류에 지혜를 가르친 일곱 아프칼루 현자 전승으로, 지식을 전하고 보호하는 관점을 성찰하게 한다.",
    "nameKo": "수메르 엔키 7압갈루 현자",
    "sourceTitle": "Enki/Ea (god)",
    "sourceUrl": "https://oracc.museum.upenn.edu/amgg/listofdeities/enki/",
    "supported": true
  },
  {
    "evidence": "UCC CELT의 편집 원문은 네 도시에서 배운 투아하 데 다난이 네 보물인 리아 팔·누아다의 검·루의 창·다그다의 솥을 가져왔다고 기록합니다.",
    "key": "celticTuathaFourTreasures",
    "meaning": "아일랜드 신화에서 투아하 데 다난이 지닌 네 보물(돌·검·창·솥)을 상징으로 삼아 지혜와 용기를 성찰하는 관점입니다.",
    "nameKo": "켈트 투아하 4대 신성보물",
    "sourceTitle": "The four jewels of the Tuatha Dé Danann",
    "sourceUrl": "https://celt.ucc.ie/published/G300008.html",
    "supported": true
  },
  {
    "evidence": "자료는 상청 문헌이 몸 안에 24개의 광휘로운 신령이 머물며 세 무리의 팔경으로 나뉜다고 설명합니다.",
    "key": "taoistShangqingTwentyFourSpirits",
    "meaning": "상청 전통의 몸 안 24신은 세 무리의 팔경으로 나뉘는 신령 체계로, 몸과 삶을 성찰하는 상징적 관점으로 볼 수 있습니다.",
    "nameKo": "도교 진고 상청 24성도",
    "sourceTitle": "Shangqing (Highest Clarity) - From The Encyclopedia of Taoism",
    "sourceUrl": "https://www.goldenelixir.com/publications/eot_shangqing.html",
    "supported": true
  },
  {
    "evidence": "Lion's Roar 본문은 족첸 전통의 jalu를 오대 원소가 빛으로 변하는 무지개체로 설명하면서, 관련 사후 현상 보고에는 실험실 검증이 어려운 한계가 있음을 지적합니다.",
    "key": "tibetanPhowaRainbowBody",
    "meaning": "족첸에서 무지개체는 죽음 때 몸이 빛으로 전환·소멸한다고 전해지는 수행 성취로, 변화와 집착을 성찰하는 관점이 될 수 있습니다.",
    "nameKo": "티베트 족첸 릭파 무지개체",
    "sourceTitle": "Investigating the Rainbow Body",
    "sourceUrl": "https://www.lionsroar.com/investigating-the-rainbow-body/",
    "supported": true
  },
  {
    "evidence": "원문은 체를 주체, 용을 일로 구분하고 오행의 생극·비화 관계를 살펴 판단한다고 설명합니다.",
    "key": "plumBlossomMeihuaOracle",
    "meaning": "매화역수의 체용은 주체와 사건을 나누어 오행의 생극 관계를 살피는 틀로, 상황을 성찰하는 상징적 관점으로 활용할 수 있습니다.",
    "nameKo": "소강절 매화역수 체용생극",
    "sourceTitle": "《梅花易数》04章体用生克篇之一",
    "sourceUrl": "https://www.quanxue.cn/qt_mingxiang/meihua/meihua05.html",
    "supported": true
  },
  {
    "evidence": "브리태니커는 모이라이를 인간의 운명과 수명을 정하는 세 여신으로 설명하고, 클로토·라케시스·아트로포스가 각각 실을 잣고 나누고 끊는다고 풀이한다.",
    "key": "greekMoiraiAnankeFate",
    "meaning": "그리스 신화에서 모이라이는 삶의 운명 실을 잣고 나누고 끊는 존재로, 필연과 선택의 경계를 성찰하게 하는 관점이다.",
    "nameKo": "그리스 모이라이 운명실타래",
    "sourceTitle": "Fate",
    "sourceUrl": "https://www.britannica.com/topic/Fate-Greek-and-Roman-mythology",
    "supported": true
  },
  {
    "evidence": "하버드 박물관은 비문이 투트모세에게 스핑크스를 덮은 모래를 치우면 왕위를 주겠다는 꿈을 전하며 새 왕을 위한 선전 도구였다고 설명합니다.",
    "key": "egyptianSphinxDreamOracle",
    "meaning": "젊은 투트모세의 꿈에서 스핑크스가 모래를 치우면 왕위를 주겠다고 한 왕권 정당화 서사로, 장애를 돌아보는 성찰의 비유로만 참고할 수 있습니다.",
    "nameKo": "이집트 스핑크스 꿈신탁",
    "sourceTitle": "Dream Stela",
    "sourceUrl": "https://hmane.harvard.edu/dream-stela",
    "supported": true
  },
  {
    "evidence": "대영박물관은 이 서판이 하늘의 세 구역, 주요 별의 출현 시기, 달의 길에 놓인 별자리를 기록한 MUL.APIN 천문 논고라고 설명합니다.",
    "key": "chaldeanMulApinAstrology",
    "meaning": "물핀(MUL.APIN)은 고대 바빌로니아의 별자리·천문 기록으로, 하늘을 관찰하며 삶의 관점을 성찰하는 자료로 참고할 수 있습니다.",
    "nameKo": "칼데아 물핀 12조디악",
    "sourceTitle": "tablet",
    "sourceUrl": "https://www.britishmuseum.org/collection/object/W_1899-0610-108",
    "supported": true
  },
  {
    "evidence": "브리태니커는 나구알을 사슴·재규어·새 같은 동물에 깃든 개인 수호령으로 설명하며, 꿈에 나타난 동물이 나구알이 된다는 전승도 소개한다.",
    "key": "toltecNagualDreaming",
    "meaning": "나구알은 메소아메리카 일부 전통의 동물 수호령 개념으로, 꿈과 상징을 자기성찰의 관점으로 참고할 수 있다.",
    "nameKo": "톨텍 나구알리즘 4대 약속",
    "sourceTitle": "nagual",
    "sourceUrl": "https://www.britannica.com/topic/nagual",
    "supported": true
  },
  {
    "evidence": "도쿄세이토쿠단기대학 학술지는 슈겐도의 산중 수행에서 지옥·아귀·축생·수라·인간·천·성문·연각·불의 십계를 서로 갖춘 진리로 깨닫는 십계수행을 설명한다.",
    "key": "shugendoYamabushiTenRealms",
    "meaning": "슈겐도의 십계수행은 산속 수행으로 불교의 열 가지 경계를 성찰하며 삶의 상태를 돌아보는 관점이 될 수 있다.",
    "nameKo": "슈겐도 야마부시 10계수행",
    "sourceTitle": "修験道〈五體本有本来佛身〉説 その教理としての〈胎内五位〉とその展開",
    "sourceUrl": "https://www.tsu.ac.jp/media/bulletin38_11.pdf",
    "supported": true
  },
  {
    "evidence": "브리태니커는 《Pistis Sophia》를 구원과 신적 빛을 다루는 콥트 영지주의 문헌으로, 플레로마를 초월적 신에서 발산한 아이온들의 신적 충만의 영역으로 설명한다.",
    "key": "gnosticPistisSophiaPleroma",
    "meaning": "영지주의의 소피아 서사와 플레로마(신적 충만)의 상징을 통해, 물질 세계를 넘어 내면의 앎과 성찰을 돌아보는 관점이다.",
    "nameKo": "영지주의 소피아 플레로마",
    "sourceTitle": "Pistis Sophia; pleroma",
    "sourceUrl": "https://www.britannica.com/topic/Pistis-Sophia ; https://www.britannica.com/topic/pleroma",
    "supported": true
  },
  {
    "evidence": "옥스퍼드 전자 수메르 문학 코퍼스의 번역은 이난나가 명계의 일곱 관문을 차례로 통과하며 각 관문에서 장신구와 의복을 벗는 과정을 기록합니다.",
    "key": "sumerianInannaUnderworldDescent",
    "meaning": "이난나가 일곱 관문에서 장신구와 권위를 내려놓고 명계로 들어가는 서사로, 상실과 자기성찰의 관점에서 삶의 전환을 돌아보게 합니다.",
    "nameKo": "수메르 이난나 명계하강 7대관문",
    "sourceTitle": "Inana's descent to the nether world: translation",
    "sourceUrl": "https://etcsl.orinst.ox.ac.uk/section1/tr141.htm",
    "supported": true
  },
  {
    "evidence": "위스콘신대학교 자료는 볼바를 세이드와 점술을 행한 예언자로 설명하고, 『볼루스파』의 볼바가 모든 세계의 지혜를 말한다고 소개한다.",
    "key": "norseVolvaSeidrNineRealms",
    "meaning": "볼바의 세이드와 아홉 세계는 신화적 우주·운명 인식을 비추는 상징으로, 자기 성찰의 관점을 제공한다.",
    "nameKo": "북유럽 볼바 세이드 9대세계",
    "sourceTitle": "Old Norse Women of Inspiration",
    "sourceUrl": "https://gns.wisc.edu/2016/09/06/old-norse-women-of-inspiration/",
    "supported": true
  },
  {
    "evidence": "Internet Encyclopedia of Philosophy는 《제물론》의 호접몽을 포함한 장자의 논의가 서로 다른 관점 사이를 전환하게 하며 판단의 한계를 성찰하게 한다고 설명합니다.",
    "key": "zhuangziXiaoyaoyouButterfly",
    "meaning": "호접몽은 꿈속 나비와 깨어난 장자의 경계를 묻는 우화로, 현실과 자아를 한 관점에 고정하지 않고 성찰하게 합니다.",
    "nameKo": "도가 장자 소요유 호접몽",
    "sourceTitle": "Zhuangzi (Chuang-Tzu, 369–298 BCE)",
    "sourceUrl": "https://iep.utm.edu/zhuangzi-chuang-tzu-chinese-philosopher/",
    "supported": true
  },
  {
    "evidence": "스탠퍼드 철학 백과사전은 고전 유식학이 여섯 감각·정신 의식에 말나식과 아뢰야식을 더해 여덟 의식을 구분한다고 설명한다.",
    "key": "buddhistYogacaraConsciousness",
    "meaning": "유식학의 8식은 감각·사고와 번뇌·저장 의식을 구분해, 경험이 형성되는 과정을 성찰하는 관점을 제공한다.",
    "nameKo": "불교 유식학 8식 전식득지",
    "sourceTitle": "Yogācāra - Stanford Encyclopedia of Philosophy",
    "sourceUrl": "https://plato.stanford.edu/entries/yogacara/",
    "supported": true
  },
  {
    "evidence": "Internet Encyclopedia of Philosophy는 아드바이타 베단타에서 깨어 있음·꿈·깊은 잠이 네 번째 상태인 투리야, 즉 순수의식을 가리킨다고 설명한다.",
    "key": "vedicMandukyaTuriya",
    "meaning": "만두키야 우파니샤드의 투리야는 깨어 있음·꿈·깊은 잠을 넘어선 네 번째 순수의식으로, 경험을 한 걸음 물러나 성찰하는 관점이 될 수 있다.",
    "nameKo": "만두키야 우파니샤드 투리야 순수의식",
    "sourceTitle": "Advaita Vedanta",
    "sourceUrl": "https://iep.utm.edu/advaita-vedanta/",
    "supported": true
  },
  {
    "evidence": "Chabad 해설은 조하르와 관련해 네페시·루아흐·네샤마·하야·예히다를 신 의식의 상승하는 다섯 층위로 설명합니다.",
    "key": "kabbalisticZoharSoul",
    "meaning": "카발라 전통의 조하르와 연관된 영혼의 다섯 층위는 자기 성찰에서 의식과 삶의 방향을 돌아보는 상징적 관점이 될 수 있습니다.",
    "nameKo": "카발라 조하르 5대 영혼 층위",
    "sourceTitle": "Neshamah: Levels of Soul Consciousness",
    "sourceUrl": "https://www.chabad.org/kabbalah/article_cdo/aid/380651/jewish/Neshamah-Levels-of-Soul-Consciousness.htm",
    "supported": true
  },
  {
    "evidence": "스탠퍼드 철학 백과사전은 에픽테토스의 prohairesis를 선택 능력 또는 의지로 설명하고, 판단·의도·행동은 그 안에 속하지만 신체·소유·성공 같은 외부 조건은 외부적인 것으로 구분합니다.",
    "key": "romanStoicProhairesis",
    "meaning": "프로하이레시스는 외부 결과가 아닌 판단과 선택의 능력에 주목하게 하며, 통제 가능한 내적 태도를 성찰하는 관점을 제공합니다.",
    "nameKo": "로마 스토아 통제이분법",
    "sourceTitle": "Epictetus",
    "sourceUrl": "https://plato.stanford.edu/entries/epictetus/",
    "supported": true
  },
  {
    "evidence": "본문은 아쉬탕가를 해탈을 위한 수단인 여덟 지체로 설명하며, 절제·관찰·자세·호흡 조절·감각 철회·집중·명상·삼매를 열거합니다.",
    "key": "patanjaliAshtangaYoga",
    "meaning": "파탄잘리의 아쉬탕가 요가는 윤리적 절제·관찰, 자세·호흡·감각철회·집중·명상·삼매로 이루어진 여덟 수행 단계로, 삶의 태도와 주의를 성찰하는 관점이 될 수 있습니다.",
    "nameKo": "파탄잘리 요가 8지칙",
    "sourceTitle": "Yoga Sutras of Patanjali",
    "sourceUrl": "https://iep.utm.edu/yoga/",
    "supported": true
  },
  {
    "evidence": "한국민족문화대백과사전은 세속오계를 화랑의 다섯 계율로 설명하며, 풍류·화랑도의 고유사상과 공동체의식에 바탕을 둔다고 풀이합니다.",
    "key": "koreanPungryudoHwarang",
    "meaning": "신라의 풍류·화랑 전통에서 비롯된 세속오계는 충·효·신의·용기·생명존중을 성찰하는 관점으로 삼을 수 있습니다.",
    "nameKo": "신라 풍류도 화랑오계",
    "sourceTitle": "세속오계 - 한국민족문화대백과사전",
    "sourceUrl": "https://encykorea.aks.ac.kr/Article/E0029812",
    "supported": true
  },
  {
    "evidence": "자료는 아타르의 영적 순례를 탐구·사랑·지식·초연·통일·경이·자아 소멸의 일곱 계곡으로 설명하고, 『새들의 회의』에서 새들이 시무르그를 찾아 나선다고 전합니다.",
    "key": "persianAttarSevenValleys",
    "meaning": "아타르의 7대 계곡은 탐구·사랑·지식·초월 등을 거쳐 자아 소멸에 이르는 영적 여정을 그린 비유로, 자기성찰의 관점으로 참고할 수 있습니다.",
    "nameKo": "페르시아 아타르 새들의 회의 7대 계곡",
    "sourceTitle": "Farid ed-Din Attar",
    "sourceUrl": "https://www.encyclopedia.com/history/encyclopedias-almanacs-transcripts-and-maps/farid-ed-din-attar",
    "supported": true
  },
  {
    "evidence": "하버드 자료는 『코르푸스 헤르메티쿰』 1편이 포이만드레스가 헤르메스에게 우주 창조와 인간의 이중적 본성, 윤리적 정화의 길을 계시하는 이야기라고 설명한다.",
    "key": "hermeticPoimandres",
    "meaning": "포이만드레스는 우주와 인간의 신적 본성을 성찰하게 하는 헤르메스주의 계시 서사로, 자기 성찰의 관점을 제공한다.",
    "nameKo": "헤르메스주의 포이만드레스 8대 천계",
    "sourceTitle": "Corpus Hermeticum I",
    "sourceUrl": "https://cswr.hds.harvard.edu/news/2026/02/13/corpus-hermeticum-i",
    "supported": true
  },
  {
    "evidence": "인터넷 철학 백과사전은 스판다 체계를 샥티를 ‘우주적 맥동’으로 해석하는 일원론적 카슈미르 시바파의 핵심 문헌 및 가르침으로 설명합니다.",
    "key": "kashmirShaivismSpanda",
    "meaning": "스판다는 카슈미르 시바파에서 의식과 우주의 창조적 맥동을 뜻하며, 변화와 경험을 성찰하는 관점으로 삼을 수 있습니다.",
    "nameKo": "카슈미르 시바파 스판다 우주 맥동",
    "sourceTitle": "Kashmiri Shaiva Philosophy",
    "sourceUrl": "https://iep.utm.edu/kashmiri/",
    "supported": true
  },
  {
    "evidence": "Seri의 연구는 이 50개 이름이 기존 메소포타미아 신명 목록에서 유래하며 마르두크의 신적 권위와 다면성을 서사적으로 부각한다고 설명한다.",
    "key": "sumerianEnumaElishFiftyNames",
    "meaning": "에누마 엘리시에서 마르두크에게 부여된 50개 이름은 신들의 왕권과 다양한 권능을 드러내며, 여러 역할을 성찰하는 관점이 될 수 있다.",
    "nameKo": "에누마 엘리시 50대 이름",
    "sourceTitle": "The Fifty Names of Marduk in Enuma elish",
    "sourceUrl": "https://www.academia.edu/4367226/The_Fifty_Names_of_Marduk_in_Enuma_elish",
    "supported": true
  },
  {
    "evidence": "메트로폴리탄 미술관은 고대 이집트에서 밤하늘을 지나는 데칸 별 무리의 움직임으로 밤의 시간을 헤아렸다고 설명합니다.",
    "key": "alexandrianDecanThirtySixGods",
    "meaning": "고대 이집트의 36데칸은 밤하늘 별 무리로 시간을 나눈 체계로, 삶의 흐름을 성찰하는 상징적 관점이 될 수 있습니다.",
    "nameKo": "알렉산드리아 36대 데칸",
    "sourceTitle": "Telling Time in Ancient Egypt",
    "sourceUrl": "https://www.metmuseum.org/essays/telling-time-in-ancient-egypt",
    "supported": true
  },
  {
    "evidence": "시카고대 해설은 열자의 바람 타기가 자유로워 보여도 바람에 의존하며, 진정한 자유는 관점과 정체성을 유연하게 전환하는 데 있다고 풀이한다.",
    "key": "taoistLieziWindRiding",
    "meaning": "열자가 바람을 타도 바람에 의존하듯, 고정된 관점의 한계를 성찰하고 시야 전환을 모색하는 비유다.",
    "nameKo": "열자 어풍동행 무하유지향",
    "sourceTitle": "Zhuangzi as Philosopher",
    "sourceUrl": "https://voices.uchicago.edu/ziporyn/zhuangzi-as-philosopher/",
    "supported": true
  },
  {
    "evidence": "자료는 고전 상키야를 25개 실재(tattva)의 체계로 설명하고, 푸루샤와 프라크리티의 구별을 통해 해탈을 말한다고 정리한다.",
    "key": "samkhyaTwentyFiveTattvas",
    "meaning": "상키야의 25타트바는 의식과 자연 및 그 전개를 나누어 살피는 틀로, 경험을 한 걸음 떨어져 성찰하는 관점을 제공한다.",
    "nameKo": "상키야 25타트바 분별지",
    "sourceTitle": "Sankhya | Internet Encyclopedia of Philosophy",
    "sourceUrl": "https://iep.utm.edu/sankhya/",
    "supported": true
  },
  {
    "evidence": "한국민족문화대백과사전은 사단을 인의예지의 단서인 네 마음, 칠정을 외부 자극에 따른 일곱 감정으로 설명하고 조선 성리학의 핵심 논쟁으로 소개한다.",
    "key": "neoConfucianFourSevenLiQi",
    "meaning": "사단칠정은 도덕적 단서와 일곱 감정의 관계를 성찰하며 감정과 행동을 살피는 관점이다.",
    "nameKo": "성리학 사칠이기 거경궁리",
    "sourceTitle": "사단칠정 - 한국민족문화대백과사전",
    "sourceUrl": "https://encykorea.aks.ac.kr/Article/E0025438",
    "supported": true
  },
  {
    "evidence": "학술 논문은 고대 저자들이 하늘을 신들이 차지한 16구역으로 나누어 징조나 예배를 통한 인간과 신의 소통에 활용했다고 전한다고 설명합니다.",
    "key": "etruscanAugurSixteenSky",
    "meaning": "에트루리아의 하늘을 16구역과 신들의 자리로 나누어 징조를 해석한 전통으로, 세계를 여러 관점에서 성찰하는 틀로 볼 수 있습니다.",
    "nameKo": "에트루리아 16천궁 아우구르",
    "sourceTitle": "The Etruscans: Setting New Agendas",
    "sourceUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8546786/",
    "supported": true
  },
  {
    "evidence": "Springer는 1616년 『Chymische Hochzeit』를 로젠크로이츠 초기 문헌으로 열거하고, 관련 운동을 개혁과 서양 밀교의 맥락에서 설명한다.",
    "key": "rosicrucianChymicalWedding",
    "meaning": "17세기 로젠크로이츠 문헌의 왕과 왕비의 상징적 결합을 통해 내적 통합과 변화를 성찰하는 관점이다.",
    "nameKo": "로젠크로이츠 화학적 결혼 7일 연금술",
    "sourceTitle": "Rosicrucians",
    "sourceUrl": "https://link.springer.com/rwe/10.1007/978-3-319-14169-5_1043",
    "supported": true
  },
  {
    "evidence": "브리태니커는 토날포왈리를 1~13의 수와 20개 날짜명이 결합하는 260일 성스러운 역법으로 설명하며 의례 날짜 지정과 점복에 사용됐다고 밝힙니다.",
    "key": "aztecTonalamatl",
    "meaning": "아즈텍의 260일 의례 달력으로, 날짜의 상징을 돌아보는 성찰 틀로 삼되 미래를 예측하는 도구로 보지 않습니다.",
    "nameKo": "아즈텍 토날포왈리 20대 일진 성력",
    "sourceTitle": "tonalpohualli",
    "sourceUrl": "https://www.britannica.com/topic/tonalpohualli",
    "supported": true
  },
  {
    "evidence": "Tibetan Buddhist Encyclopedia는 몽골어 хийморь(Khiimori)를 의미상 ‘풍마’이며 구어적으로 ‘영혼’을 뜻한다고 설명한다.",
    "key": "mongolianTengriHiimori",
    "meaning": "몽골 전통의 풍마 히모리는 인간의 영혼과 내적 기세를 가리키는 상징으로, 자신의 상태와 삶의 방향을 성찰하는 관점이 될 수 있다.",
    "nameKo": "몽골 텡그리즘 풍마 히모리 영혼",
    "sourceTitle": "Wind Horse",
    "sourceUrl": "https://www.tibetanbuddhistencyclopedia.com/en/wiki/Wind_Horse",
    "supported": true
  },
  {
    "evidence": "Napier 대학 도서관 자료는 벨테인을 사먼·임볼크·루나사와 함께 네 주요 켈트 계절 축제로 설명하며 겨울에서 여름으로의 전환을 다룬다고 전합니다.",
    "key": "gaelicWheelFireFestivals",
    "meaning": "게일의 사계절 전환을 불의 축제로 기념한 연례 순환 개념으로, 변화와 재생을 성찰하는 관점이 될 수 있습니다.",
    "nameKo": "게일 4대 화제 축제 휠 오브 더 이어",
    "sourceTitle": "Edinburgh Beltane Fire Festival",
    "sourceUrl": "https://blogs.napier.ac.uk/library/2026/04/30/edinburgh-beltane-fire-festival/",
    "supported": true
  },
  {
    "evidence": "학술판은 146~163절을 오딘이 말한 18개 마법 노래의 목록으로 설명하며 치유·보호·갈등 완화 등의 효과를 열거하되 주문의 실제 문구는 전하지 않는다고 합니다.",
    "key": "norseHavamalEighteenGaldr",
    "meaning": "하바말의 ‘노래 목록’에서 오딘이 전하는 18가지 주문을 가리키며, 삶의 갈등과 선택을 성찰하는 상징적 관점으로 읽을 수 있습니다.",
    "nameKo": "하바말 오딘 18대 게알드르 룬 비전",
    "sourceTitle": "The Poetic Edda - Hávamál",
    "sourceUrl": "https://books.openbookpublishers.com/10.11647/obp.0308/ch2.xhtml",
    "supported": true
  },
  {
    "evidence": "스탠퍼드 철학 백과사전은 이븐 아라비가 참된 존재는 신뿐이며 다른 실재들은 그 하나의 실재에서 유래한다고 설명한다.",
    "key": "ibnArabiWahdatAlWujud",
    "meaning": "존재의 단일성은 신을 유일한 참된 존재로 보고, 세계를 그 현현으로 성찰하게 하는 수피 형이상학이다.",
    "nameKo": "이븐 아라비 존재의 단일성 심장 영지",
    "sourceTitle": "Ibn 'Arabī - Stanford Encyclopedia of Philosophy",
    "sourceUrl": "https://plato.stanford.edu/entries/ibn-arabi/",
    "supported": true
  },
  {
    "evidence": "한국민족문화대백과사전은 십승지지를 조선시대 난리를 피하고 거주 환경이 좋은 10여 곳의 피난처이자 이상향 담론으로 설명합니다.",
    "key": "chonggamnokTenSanctuaries",
    "meaning": "정감록에 전하는 십승지는 난리를 피해 자급할 이상향으로, 혼란 속 삶의 터전과 안전을 성찰하는 관점이 될 수 있습니다.",
    "nameKo": "정감록 10승지 영맥 피난처",
    "sourceTitle": "십승지지 - 한국민족문화대백과사전",
    "sourceUrl": "https://encykorea.aks.ac.kr/Article/E0034001",
    "supported": true
  },
  {
    "evidence": "Wiley의 참고문헌은 이 개념을 발리 힌두교의 중심 철학으로 설명하며 인간·영적 세계·주변 우주와의 조화를 삶의 지침으로 제시합니다.",
    "key": "balineseTriHitaKarana",
    "meaning": "신과 인간 사회, 자연의 조화를 중시하는 발리의 사상으로, 삶을 관계의 균형에서 성찰하게 합니다.",
    "nameKo": "발리 트리 히타 카라나 3대 조화",
    "sourceTitle": "Tri Hita Karana",
    "sourceUrl": "https://onlinelibrary.wiley.com/doi/abs/10.1002/9781119179313.wbprim0302",
    "supported": true
  },
  {
    "evidence": "펜실베이니아대학교 박물관 자료는 호피의 4세계 서사와 카치나 의례를 모든 생명이 상호 의존하며 세계의 조화를 지키는 관계로 설명합니다.",
    "key": "hopiFourWorldsKachina",
    "meaning": "호피의 4세계와 카치나는 생명 간 상호의존과 조화를 성찰하는 전통적 관점으로 활용할 수 있습니다.",
    "nameKo": "호피 4대 세계 카치나 정령 지혜",
    "sourceTitle": "Birds, Feathers, and Hopi Ceremonialism",
    "sourceUrl": "https://www.penn.museum/sites/expedition/birds-feathers-and-hopi-ceremonialism/",
    "supported": true
  },
  {
    "evidence": "한국민족문화대백과사전은 시천주에서 인내천으로 이어지는 천도교 사상을 인간 안에 하늘이 내재하고 자기 마음을 깨닫는 것으로 설명합니다.",
    "key": "donghakCheondoismCheonju",
    "meaning": "시천주는 인간 안에 하늘님을 모신다는 동학의 사상으로, 자신과 타인을 존중하며 마음과 행동을 성찰하는 관점을 제시합니다.",
    "nameKo": "동학 시천주 지기금지 인내천 조화",
    "sourceTitle": "천도교 - 한국민족문화대백과사전",
    "sourceUrl": "https://encykorea.aks.ac.kr/Article/E0055819",
    "supported": true
  },
  {
    "evidence": "세인트케이트대학 도서관은 파차를 위·현재·아래의 세 세계로 설명하고, 스미스소니언은 아이니를 노동·물자의 지속적 상호교환으로 설명한다.",
    "key": "incaAndeanThreePachaAyni",
    "meaning": "세 파차(위·현재·아래)의 상호연결과 아이니의 호혜를 돌아보며 공동체 관계를 성찰하는 관점이다.",
    "nameKo": "잉카 안데스 3대 파차 아이니 호혜",
    "sourceTitle": "Pacha: Decolonizing Our Cosmos; Reciprocity—Andean Style | The Inka Empire",
    "sourceUrl": "https://library.stkate.edu/news/pacha-decolonizing-our-cosmos; https://americanindian.si.edu/nk360/inka-water/reciprocity/reciprocity.cshtml",
    "supported": true
  },
  {
    "evidence": "스미스소니언 자료는 상나라 왕과 점복자가 뼈에 열을 가해 생긴 균열을 해석하고 질문·예후·실제 결과를 새겼다고 설명한다.",
    "key": "shangOracleBoneDivination",
    "meaning": "은나라 갑골 점복은 뼈의 균열을 해석해 왕의 질문과 결과를 기록한 의례로, 불확실성을 성찰하는 관점을 준다.",
    "nameKo": "은나라 갑골문 신탁 복사 정인 균열",
    "sourceTitle": "Making Sense of the Future: The Oracle Bone and Shang Dynasty Divination",
    "sourceUrl": "https://asia-archive.si.edu/learn/for-educators/teaching-china-with-the-smithsonian/lesson-plans/making-sense-of-the-future-the-oracle-bone-and-shang-dynasty-divination/",
    "supported": true
  },
  {
    "evidence": "한국민족문화대백과사전은 천부경을 대종교의 기본 경전이자 우주창조의 이치를 81자로 풀이한 경전으로 설명한다.",
    "key": "cheonbugyeongEightyOne",
    "meaning": "천부경은 대종교의 81자 경전으로 우주와 인간의 근본 질서를 성찰하는 관점을 제시한다.",
    "nameKo": "단군 단학 천부경 81자 삼일신고 성통광명",
    "sourceTitle": "천부경 - 한국민족문화대백과사전",
    "sourceUrl": "https://encykorea.aks.ac.kr/Article/E0055893",
    "supported": true
  },
  {
    "evidence": "브리태니커는 얀트라를 탄트라 의례를 돕는 선형 도식으로 설명하고, 스리얀트라의 아홉 삼각형과 중심 빈두를 우주적 현상의 결합으로 풀이합니다.",
    "key": "hinduSriYantra",
    "meaning": "힌두 탄트라의 스리 얀트라는 아홉 삼각형과 중심점으로 우주적 결합을 나타내며, 성찰의 시각으로 삼을 수 있습니다.",
    "nameKo": "힌두 탄트라 스리 얀트라 9나바요니 바인두",
    "sourceTitle": "yantra",
    "sourceUrl": "https://www.britannica.com/topic/yantra",
    "supported": true
  },
  {
    "evidence": "Aktá Lakota 페이지는 메디슨 휠을 신성한 생명의 원과 네 방향 및 관련 요소를 나타내며 각 방향이 고유한 교훈을 준다고 설명합니다.",
    "key": "lakotaMedicineWheel",
    "meaning": "라코타 전통의 메디슨 휠은 네 방향과 삶의 순환을 상징해, 삶을 여러 관점에서 성찰하는 틀로 볼 수 있습니다.",
    "nameKo": "라코타 수족 와칸 탕카 성스러운 메디슨 휠",
    "sourceTitle": "Lakota Medicine Wheel: Sacred Circle of Life",
    "sourceUrl": "https://aktalakota.stjo.org/lakota-culture/lakota-medicine-wheel/",
    "supported": true
  },
  {
    "evidence": "한국민족문화대백과사전은 궁궁을을을 천리의 변화와 최제우를 따를 때를 드러내는 표지로 노래한 동학가사의 핵심 표현으로 설명한다.",
    "key": "gyeogamYurok",
    "meaning": "격암유록은 남사고의 예언서로 전해지며, 궁궁을을·사중구생을 위기와 구원의 상징으로 읽어 삶의 불안과 희망을 성찰하는 관점이다.",
    "nameKo": "격암 남사고 격암유록 궁궁을을 사중구생",
    "sourceTitle": "궁을신화가",
    "sourceUrl": "https://encykorea.aks.ac.kr/Article/E0006798",
    "supported": true
  },
  {
    "evidence": "국립역사민속박물관은 세이메이를 헤이안 시대의 실존 음양사로 설명하면서 후대에 전기적 이미지가 덧붙었고, 음양사와 식신을 함께 다룬 자료를 소개한다.",
    "key": "heianOnmyodoSeimei",
    "meaning": "헤이안 음양도와 아베노 세이메이의 식신 전승은 재난과 질서를 해석한 문화로, 삶의 불확실성을 성찰하는 관점을 제공한다.",
    "nameKo": "헤이안 음양도 아베노 세이메이 12천장 식신",
    "sourceTitle": "陰陽師とは何者か－うらない、まじない、こよみをつくる－",
    "sourceUrl": "https://www.rekihaku.ac.jp/event/2023_exhibitions_kikaku_on.html",
    "supported": true
  },
  {
    "evidence": "Hōkūleʻa는 폴리네시아 항해자들이 도구 없이 별·태양·해양 너울 등 자연의 징후를 관찰했으며, 하와이안 스타 컴퍼스가 수평선을 32개 방위로 나누는 체계라고 설명한다.",
    "key": "polynesianWayfinding",
    "meaning": "별·태양·파도·바람의 징후를 읽어 항로를 찾는 전통으로, 삶에서도 주변 신호를 살피며 방향을 성찰하는 관점을 준다.",
    "nameKo": "폴리네시아 마우이 웨이파인딩 32방위 스타컴퍼스",
    "sourceTitle": "Polynesian Wayfinding",
    "sourceUrl": "https://hokulea.com/polynesian-wayfinding/",
    "supported": true
  },
  {
    "evidence": "한국민족문화대백과사전은 원효가 중관파와 유가파의 논쟁을 화회시키려 했으며, 화쟁을 중생 제도를 위한 수단으로 보았다고 설명합니다.",
    "key": "wonhyoHwajaeng",
    "meaning": "원효의 화쟁은 서로 다른 불교 교설의 갈등을 조정하려는 사상으로, 상반된 관점을 함께 살피는 성찰의 틀로 삼을 수 있습니다.",
    "nameKo": "신라 원효대사 십문화쟁론 일심이문 무애",
    "sourceTitle": "원효 - 한국민족문화대백과사전",
    "sourceUrl": "https://encykorea.aks.ac.kr/Article/E0040908",
    "supported": true
  },
  {
    "evidence": "Airiti 학술 논문은 《마의상법》을 중국 고대 관상서의 대표적 저작으로 설명하고, 그 편찬자·판본·관상서 전통에서의 위치를 고증합니다.",
    "key": "mayiMianxiang",
    "meaning": "마의상법은 얼굴 형상으로 성품과 운세를 해석하려는 중국 관상 전통으로, 예측이 아닌 자기 성찰의 문화적 렌즈로 참고할 수 있습니다.",
    "nameKo": "마의도사 마의상법 12궁 관상 심상합일",
    "sourceTitle": "《麻衣相法》版本初探",
    "sourceUrl": "https://www.airitilibrary.com/Article/Detail/02544466-201612-201703010021-201703010021-131-164",
    "supported": true
  },
  {
    "evidence": "호주박물관은 암두아트를 ‘저승에 있는 것’이라는 뜻의 장례 문헌으로 설명하며, 태양신이 밤의 열두 영역을 지나 아침에 다시 태어나는 여정을 다룬다고 한다.",
    "key": "egyptianAmduat",
    "meaning": "암두아트는 태양신의 밤 저승 여행과 아침의 재생을 그린 장례 문헌으로, 변화와 회복을 성찰하는 관점을 제공한다.",
    "nameKo": "이집트 암두아트 12시간 라 밤의항해 케프리부활",
    "sourceTitle": "Funerary texts in ancient Egypt",
    "sourceUrl": "https://australian.museum/learn/cultures/international-collection/ancient-egyptian/funerary-texts-in-ancient-egypt/",
    "supported": true
  },
  {
    "evidence": "브리태니커는 브레혼 법의 형사 규정이 복수·보복·사형을 배제하고 피해자 가족에 대한 배상을 요구했다고 설명한다.",
    "key": "celticDruidBrehonLawJustice",
    "meaning": "고대 아일랜드의 브레혼 법은 보복보다 중재와 피해 보상을 중시한 관습법으로, 갈등을 공정하게 성찰하는 관점을 제공한다.",
    "nameKo": "고대 켈트 브레혼 법전 4대 우주정의 에릭",
    "sourceTitle": "Brehon laws",
    "sourceUrl": "https://www.britannica.com/topic/Brehon-laws",
    "supported": true
  },
  {
    "evidence": "ORACC는 니사바가 농업에서 회계·문자로 이어지는 문화 발전을 반영하며 서기의 수호신이 되었다고 설명합니다.",
    "key": "mesopotamianNisabaScribe",
    "meaning": "니사바는 수메르의 곡물·문자 여신이자 서기의 수호자로, 기록과 배움의 태도를 성찰하는 비유로 삼을 수 있습니다.",
    "nameKo": "수메르 서기 니사바 청금석 서판 갈대첨필 천문수리",
    "sourceTitle": "Nidaba (goddess), Ancient Mesopotamian Gods and Goddesses",
    "sourceUrl": "https://oracc.museum.upenn.edu/amgg/listofdeities/nidaba/",
    "supported": true
  },
  {
    "evidence": "한국민족문화대백과사전은 삼경을 경천·경인·경물로 설명하며, 사람과 사물을 공경하는 가르침으로 해석한다.",
    "key": "koreanSuunGasiHeon",
    "meaning": "명칭에서 확인되는 동학의 삼경은 하늘·사람·만물을 공경하며 일상을 성찰하는 관점을 제시한다.",
    "nameKo": "동학 수운 최제우 용담유사 검결 심기수련 삼경",
    "sourceTitle": "삼경설 - 한국민족문화대백과사전",
    "sourceUrl": "https://encykorea.aks.ac.kr/Article/E0026458",
    "supported": true
  },
  {
    "evidence": "메트로폴리탄 미술관은 트리프톨레모스를 데메테르가 곡물 재배법을 가르치도록 보낸 인물이며 날개 달린 전차로 문명화 사명을 수행한 영웅으로 설명한다.",
    "key": "eleusinianTriptolemosCivilization",
    "meaning": "트리프톨레모스는 데메테르에게서 곡물 재배를 배워 인간에게 전한 엘레우시스 신화의 영웅으로, 지식의 나눔과 문명화를 성찰하게 한다.",
    "nameKo": "엘레우시스 트리프톨레모스 황금전차 농경3대율법",
    "sourceTitle": "Ten marble fragments of the Great Eleusinian Relief",
    "sourceUrl": "https://www.metmuseum.org/art/collection/search/248899",
    "supported": true
  },
  {
    "evidence": "케임브리지 논문은 세 믹스테크 문서가 8사슴의 전통 의례와 톨테카-치치메카 집단과의 전략적 동맹에 의한 투투테펙 건국을 전한다고 설명합니다.",
    "key": "mixtecEightDeerJaguarClaw",
    "meaning": "믹스테크의 8-사슴 재규어발톱은 전통적 건국 의례와 전략적 동맹으로 투투테펙을 세운 통치자로, 성찰의 관점에서 협력과 통합을 돌아보게 합니다.",
    "nameKo": "믹스테크 8-사슴 재규어발톱 동맹결성 통일",
    "sourceTitle": "Lord 8 Deer “Jaguar Claw” and the Land of the Sky: The Archaeology and History of Tututepec",
    "sourceUrl": "https://www.cambridge.org/core/journals/latin-american-antiquity/article/lord-8-deer-jaguar-claw-and-the-land-of-the-sky-the-archaeology-and-history-of-tututepec/7B1E15F2E04F42BC7B1B618DC380BAA9",
    "supported": true
  },
  {
    "evidence": "한국민족문화대백과사전은 전봉준이 사발통문으로 봉기를 호소하고 백산에서 농민군 지도자로 추대되어 동학농민전쟁을 이끌었다고 설명한다.",
    "key": "koreanJeonBongjunNokduGeneral",
    "meaning": "전봉준이 이끈 동학농민혁명과 사발통문·백산창의는 부패에 맞선 민중의 연대와 개혁 의지를 성찰하게 하는 역사적 관점이다.",
    "nameKo": "동학농민혁명 녹두장군 전봉준 사발통문 백산창의",
    "sourceTitle": "전봉준 - 한국민족문화대백과사전",
    "sourceUrl": "https://encykorea.aks.ac.kr/Article/E0049437",
    "supported": true
  },
  {
    "evidence": "브리태니커는 아트라하시스가 엔키의 조언으로 재난을 이겨내고 홍수 전에 방주를 지어 자신과 가족, 동물을 구했다고 설명합니다.",
    "key": "atrahasisFloodWisdom",
    "meaning": "아트라하시스는 신의 경고에 따라 방주를 지은 현자로, 대홍수 속 생존과 절제의 필요를 성찰하게 하는 메소포타미아 서사입니다.",
    "nameKo": "메소포타미아 아트라하시스 지혜의방주 대홍수정화 절제",
    "sourceTitle": "myth of Atrahasis",
    "sourceUrl": "https://www.britannica.com/topic/myth-of-Atrahasis",
    "supported": true
  },
  {
    "evidence": "브리태니커는 위그드라실을 우주를 지탱하며 니플헤임·미드가르드·아스가르드를 포함한 아홉 세계를 연결하는 거대한 물푸레나무로 설명한다.",
    "key": "eddicYggdrasilNineRealms",
    "meaning": "위그드라실은 아홉 세계를 잇는 세계수로, 서로 연결된 삶의 층위를 성찰하는 관점을 제공한다.",
    "nameKo": "북유럽 고에다 위그드라실 9대우주계 3대영천 소생",
    "sourceTitle": "Yggdrasill",
    "sourceUrl": "https://www.britannica.com/topic/Yggdrasill",
    "supported": true
  },
  {
    "evidence": "국사편찬위원회 우리역사넷은 1597년 명량해전 전 이순신이 ‘必死則生, 必生則死’를 훈시했고, 13척으로 일본 수군을 대파했다고 설명한다.",
    "key": "yiSunSinNanjungIlgiStrategic",
    "meaning": "명량해전에서 이순신이 인용한 필사즉생은 위기에서 결단과 실천을 성찰하게 하는 역사적 관점이다.",
    "nameKo": "충무공 이순신 난중일기 필사즉생 명량대역전",
    "sourceTitle": "명량해전",
    "sourceUrl": "https://contents.history.go.kr/mobile/kc/view.do?levelId=kc_i302300&code=kc_age_30",
    "supported": true
  },
  {
    "evidence": "브리태니커는 멤피스 신학에서 프타가 심장과 말의 힘으로 인간을 창조했으며, 심장에 형성된 구상이 신성한 발화로 존재하게 되었다고 설명한다.",
    "key": "ptahMemphiteHeartTongueCreation",
    "meaning": "멤피스 신학은 프타가 심장으로 창조를 구상하고 혀의 말로 실현했다고 전하며, 생각과 표현이 행동을 빚는 과정을 성찰하게 한다.",
    "nameKo": "이집트 멤피스신학 프타 심장구상 말씀선포 창조",
    "sourceTitle": "Memphite Theology",
    "sourceUrl": "https://www.britannica.com/topic/Memphite-Theology",
    "supported": true
  },
  {
    "evidence": "EBSCO는 루를 전사·지도자이자 다양한 예술에 능한 인물로 설명하고 Samildánach를 ‘모든 예술에 능한 자’로 풀이한다.",
    "key": "celticLughSamildanachAllArts",
    "meaning": "루 사밀다나흐는 여러 예술·기술에 능한 ‘다재다능한 자’를 뜻하며, 한 능력에 가두지 않고 역량의 연결을 성찰하게 하는 관점이다.",
    "nameKo": "켈트 투아하데다난 루 라바다 8대만능기예 마그투이레드",
    "sourceTitle": "Lugh (deity)",
    "sourceUrl": "https://www.ebsco.com/research-starters/social-sciences-and-humanities/lugh-deity/",
    "supported": true
  },
  {
    "evidence": "국립한글박물관은 최현배가 말과 글을 삶과 정신의 바탕으로 보고, 『우리말본』으로 우리말 구조를 체계화했다고 설명한다.",
    "key": "koreanChoeHyeonbaeHangeulGeulbon",
    "meaning": "최현배의 『우리말본』은 우리말 문법을 체계화한 저술로, 말과 글이 주체성과 문화의식을 세우는 방식을 성찰하게 한다.",
    "nameKo": "외솔 최현배 우리말본 한글 말글자주권 문화얼",
    "sourceTitle": "3월, 외솔 최현배 선생을 기리며",
    "sourceUrl": "https://www.hangeul.go.kr/webzine/202603/sub1_4.html",
    "supported": true
  },
  {
    "evidence": "Encyclopaedia Iranica는 아메샤스펜타를 ‘거룩한/자비로운 불멸자’로 풀이하고, 여섯 존재가 신적 성품과 인간이 지향할 힘을 나타낸다고 설명합니다.",
    "key": "zoroastrianAmeshaSpentasLight",
    "meaning": "조로아스터교에서 아메샤스펜타는 선을 돕는 불멸의 존재들을 가리키며, 덕목을 성찰하는 관점이 될 수 있습니다.",
    "nameKo": "페르시아 조로아스터교 6대 신성불멸자 빛의조화",
    "sourceTitle": "AMƎŠA SPƎNTA",
    "sourceUrl": "https://www.iranicaonline.org/articles/amesa-spenta-beneficent-divinity/",
    "supported": true
  },
  {
    "evidence": "백과사전은 킬론을 일곱 현인 중 한 사람으로 소개하고, 델포이의 ‘너 자신을 알라’와 ‘지나침이 없게’라는 격언을 이 현인들에게 귀속된다고 설명한다.",
    "key": "delphicChilonSpartanModeration",
    "meaning": "델포이의 ‘너 자신을 알라’는 자기 한계와 상태를 성찰하고, 과도함을 경계하는 절제의 관점으로 삶을 돌아보게 하는 고대 격언 전승이다.",
    "nameKo": "델포이 7현인 스파르타 킬론 너자신을알라 중용절제",
    "sourceTitle": "Seven Sages",
    "sourceUrl": "https://www.encyclopedia.com/history/news-wires-white-papers-and-books/seven-sages",
    "supported": true
  },
  {
    "evidence": "한국민족문화대백과사전은 목민심서를 수령의 도덕적 규율·행정 지침·통치 이념을 다룬 책으로 설명하며, 율기에서 수신과 청렴을, 애민에서 백성 보호를 강조한다고 풀이합니다.",
    "key": "koreanJeongYakyongMongminSimseo",
    "meaning": "목민심서는 수령의 수신·청렴과 백성 사랑을 다룬 지침으로, 공공성과 책임을 성찰하는 관점이 될 수 있습니다.",
    "nameKo": "다산 정약용 목민심서 율기수신 애민청렴 공평무사",
    "sourceTitle": "목민심서",
    "sourceUrl": "https://encykorea.aks.ac.kr/Article/E0018631",
    "supported": true
  },
  {
    "evidence": "스탠퍼드 철학 백과사전은 헤라클레이토스가 만물의 끊임없는 변화와 대립물의 통일을 주장하고 로고스를 만물이 하나임을 보여 주는 말씀으로 설명한다.",
    "key": "heraclitusPantaRheiLogos",
    "meaning": "만물은 고정되지 않고 변하며 대립은 로고스의 질서 속에서 서로 전환되므로, 변화를 성찰하는 관점이 된다.",
    "nameKo": "에페소스 헤라클레이토스 만물유전 로고스 대립물조화",
    "sourceTitle": "Heraclitus",
    "sourceUrl": "https://plato.stanford.edu/entries/heraclitus/",
    "supported": true
  },
  {
    "evidence": "스탠퍼드 철학 백과사전은 겸애를 모두의 삶과 공동체를 자기 것처럼 염려하고 이롭게 하려는 포괄적 돌봄으로 설명한다.",
    "key": "moziGyeomAeUniversalLove",
    "meaning": "묵자의 겸애는 혈연·신분을 넘어 서로를 자신처럼 돌보고 이롭게 하자는 윤리로, 갈등을 돌아보는 성찰의 관점을 제공한다.",
    "nameKo": "묵가 묵자 겸애교리 비공절용 공평무사 평화수호",
    "sourceTitle": "Mohism",
    "sourceUrl": "https://plato.stanford.edu/entries/mohism/",
    "supported": true
  },
  {
    "evidence": "학술 서평은 내면의 성채를 운명이나 외부 사태가 닿지 못하며 동의와 판단을 스스로 조절하는 영혼의 지도 원리로 설명한다.",
    "key": "romanAureliusInnerCitadel",
    "meaning": "스토아의 ‘내면의 성채’는 운명이 아닌 자신의 판단을 다스리는 내적 원리로, 상황을 성찰하는 관점을 준다.",
    "nameKo": "로마 철학황제 마르쿠스 아우렐리우스 명상록 내면의성채",
    "sourceTitle": "The Inner Citadel: The Meditations of Marcus Aurelius. (Review)",
    "sourceUrl": "https://bmcr.brynmawr.edu/1998/1998.11.35/",
    "supported": true
  },
  {
    "evidence": "스탠퍼드 철학 백과사전은 도덕경의 물이 무위의 유연함과 깊은 힘을 강화하는 자연 상징이라고 설명한다.",
    "key": "laoziDaodejingWaterWay",
    "meaning": "물처럼 낮은 곳으로 흐르며 다투지 않고 이롭게 하는 태도를 성찰의 관점으로 삼는다.",
    "nameKo": "노자 도덕경 81장 상선약수 화광동진 무위자연",
    "sourceTitle": "Laozi",
    "sourceUrl": "https://plato.stanford.edu/entries/laozi/",
    "supported": true
  },
  {
    "evidence": "스탠퍼드 철학 백과사전은 이를 ‘신은 두렵지 않고 죽음은 걱정할 일이 없으며, 좋은 것은 쉽게 얻고 나쁜 것은 견딜 만하다’는 네 겹의 치유로 설명한다.",
    "key": "ancientGreekEpicureanTetrapharmakos",
    "meaning": "신과 죽음의 두려움을 덜고, 좋은 것은 쉽게 얻으며 고통은 견딜 수 있다고 성찰하는 네 가지 에피쿠로스 처방이다.",
    "nameKo": "에피쿠로스 4대치유약 테트라파르마코스 아타락시아 영혼평정",
    "sourceTitle": "Lucretius",
    "sourceUrl": "https://plato.stanford.edu/archives/fall2019/entries/lucretius/",
    "supported": true
  },
  {
    "evidence": "한국학중앙연구원은 『격몽요결』을 초학자를 위한 유학 입문서로 설명하며 입지·혁구습·지신 등의 장에서 뜻을 세우고 몸과 마음을 삼가도록 가르친다고 서술한다.",
    "key": "koreanYulgokGyeokmongYogyeol",
    "meaning": "율곡 이이의 초학 수신서로, 입지·혁구습·구용구사를 통해 뜻과 습관을 돌아보고 몸과 마음을 닦는 성찰의 관점이다.",
    "nameKo": "율곡 이이 격몽요결 입지혁구습 구용구사 수신실천",
    "sourceTitle": "격몽요결 - 한국민족문화대백과사전",
    "sourceUrl": "https://encykorea.aks.ac.kr/Article/E0002130",
    "supported": true
  },
  {
    "evidence": "스탠퍼드 철학 백과사전은 에우다이모니아를 덕에 따른 이성적 활동으로서의 잘 사는 삶으로 설명하고, 중용은 상황에 따라 과잉과 결핍 사이를 판단하는 덕이라고 풀이한다.",
    "key": "ancientGreekAristotleMesotesEudaimonia",
    "meaning": "중용은 상황에 맞게 과도함과 부족함 사이의 덕을 찾고, 에우다이모니아는 덕에 따른 이성적 활동으로 잘 사는 삶을 성찰하게 한다.",
    "nameKo": "아리스토텔레스 니코마코스 윤리학 중용 에우다이모니아",
    "sourceTitle": "Aristotle's Ethics",
    "sourceUrl": "https://plato.stanford.edu/entries/aristotle-ethics/",
    "supported": true
  },
  {
    "evidence": "IEP는 카르마 요가를 결과를 동기로 삼지 않고 자신의 의무를 행하는 실천으로 설명한다.",
    "key": "ancientIndianBhagavadGitaKarmaYoga",
    "meaning": "행위의 결과에 집착하기보다 맡은 의무를 성실히 수행하라는 가르침으로, 결과와 과정을 성찰하는 관점을 준다.",
    "nameKo": "바가바드 기타 카르마 요가 니슈카마 카르마 무집착",
    "sourceTitle": "Bhagavad Gītā",
    "sourceUrl": "https://iep.utm.edu/bhagavad-gita/",
    "supported": true
  },
  {
    "evidence": "Internet Encyclopedia of Philosophy는 양지를 누구에게나 본래 있는 도덕적 앎으로 설명하고, 왕양명의 지행합일을 앎과 행동이 본래 분리되지 않는다는 주장으로 풀이한다.",
    "key": "chineseWangYangmingLiangzhiXinxue",
    "meaning": "왕양명의 양명학은 내면의 도덕적 앎인 양지를 살피고 앎을 행동으로 잇는 성찰의 관점을 제시한다.",
    "nameKo": "양명학 왕양명 전습록 치양지 지행합일 심학",
    "sourceTitle": "Wang Yangming (1472—1529)",
    "sourceUrl": "https://iep.utm.edu/wangyang/",
    "supported": true
  },
  {
    "evidence": "스탠퍼드 철학 백과사전은 소크라테스가 질문을 통해 사람들이 스스로 참되고 좋은 것을 인식하도록 도왔고, 다이몬을 특정 행동을 금하는 내적 목소리로 설명한다.",
    "key": "ancientGreekSocraticMaieuticDaimon",
    "meaning": "소크라테스의 산파술은 질문으로 스스로 진리를 발견하게 하며, 다이몬은 행동을 막는 내적 목소리로 자기성찰의 계기를 제공한다.",
    "nameKo": "소크라테스 산파술 다이몬 영혼성찰 무지의지",
    "sourceTitle": "Socrates",
    "sourceUrl": "https://plato.stanford.edu/entries/socrates/",
    "supported": true
  },
  {
    "evidence": "스탠퍼드 철학 백과사전은 맹자의 네 덕목이 인간에게 싹처럼 잠재하며, 이를 확장하고 길러야 온전한 덕이 된다고 설명합니다.",
    "key": "chineseMenciusFourSproutsHoyeon",
    "meaning": "맹자의 사단은 측은·수오·사양·시비의 마음이 인·의·예·지로 자라난다는 관점으로, 자신의 반응과 행동을 성찰하는 틀로 삼을 수 있습니다.",
    "nameKo": "맹자 사단사덕 호연지기 부동심 대장부",
    "sourceTitle": "Mencius - Stanford Encyclopedia of Philosophy",
    "sourceUrl": "https://plato.stanford.edu/entries/mencius/",
    "supported": true
  },
  {
    "evidence": "인터넷 철학 백과는 세네카가 시간을 헛되이 보내지 말고 중요한 일에 쓰며 성찰이 좋은 삶의 첫걸음이라고 설명한다.",
    "key": "romanSenecaTimeSovereignty",
    "meaning": "세네카가 말한 시간의 낭비를 돌아보고 현재를 덕 있게 쓰도록 성찰하는 관점이다.",
    "nameKo": "세네카 인생의짧음에대하여 시간주권 마음의평정",
    "sourceTitle": "Seneca",
    "sourceUrl": "https://iep.utm.edu/seneca/",
    "supported": true
  },
  {
    "evidence": "스탠퍼드 철학 백과사전은 동굴을 신화라기보다 『국가』에 나오는 비유로 설명하며, 동굴 밖으로 나온 이가 아래에 남은 이들에게 지혜를 전해야 한다고 해석한다.",
    "key": "ancientGreekPlatonicIdeaCave",
    "meaning": "동굴의 비유는 감각적 그림자를 실재로 오인하는 상태에서 벗어나 더 나은 앎을 향해 전환하라는 성찰의 틀이다.",
    "nameKo": "플라톤 동굴의비유 이데아 상기설 4대추덕",
    "sourceTitle": "Plato’s Myths",
    "sourceUrl": "https://plato.stanford.edu/entries/plato-myths/",
    "supported": true
  },
  {
    "evidence": "한국민족문화대백과사전은 성학십도가 이황이 선조에게 올린 글이며 경의 내면화와 일상에서의 조심스럽고 삼가는 수양을 강조한다고 설명합니다.",
    "key": "koreanToegyeSeonghakSipdo",
    "meaning": "퇴계 이황이 성리학의 수양 원리를 열 도표로 정리한 책으로, 매일 마음을 삼가고 성찰하는 관점을 생각해 볼 수 있습니다.",
    "nameKo": "퇴계 이황 성학십도 거경궁리 상성성 경철학",
    "sourceTitle": "성학십도 - 한국민족문화대백과사전",
    "sourceUrl": "https://encykorea.aks.ac.kr/Article/E0029678",
    "supported": true
  },
  {
    "evidence": "원문은 honestum을 도덕적 선으로 풀이하고 진리 탐구, 사회의 정의와 의무, 정신의 고결함, 말과 행동의 절제를 네 근원으로 제시합니다.",
    "key": "romanCiceroDeOfficiisHonestum",
    "meaning": "키케로의 ‘도덕적 선(honestum)’은 진리·정의·용기·절제를 따르는 품위로, 선택을 성찰하는 기준이 될 수 있습니다.",
    "nameKo": "키케로 의무론 도덕적선 유용성조화 신의품위",
    "sourceTitle": "LacusCurtius • Cicero — De Officiis I.1-19",
    "sourceUrl": "http://penelope.uchicago.edu/thayer/e/roman/texts/cicero/de_Officiis/1A*.html",
    "supported": true
  },
  {
    "evidence": "『엥케이리디온』은 판단·추구·욕구·회피·행동은 통제 안에, 몸·재산·평판 등은 통제 밖에 둔다고 설명합니다.",
    "key": "ancientGreekEpictetusDichotomyOfControl",
    "meaning": "통제이분법은 자신의 판단·욕구·행동과 통제 밖의 일을 나누어, 반응을 성찰하는 관점을 제시합니다.",
    "nameKo": "에픽테토스 엥케이리디온 통제이분법 프로하이레시스 도덕의지",
    "sourceTitle": "The Enchiridion",
    "sourceUrl": "https://classics.mit.edu/Epictetus/epicench.html",
    "supported": true
  },
  {
    "evidence": "텍사스대학교의 논어 번역은 2.4에서 공자가 오십에 ‘하늘의 명을 알았다’고 말한다고 전한다.",
    "key": "ancientChineseConfuciusAnalectsZhitianming",
    "meaning": "논어의 지천명은 오십에 ‘하늘의 명’을 알았다는 표현으로, 삶의 한계와 책임을 돌아보는 성찰 관점이다.",
    "nameKo": "공자 논어 지천명 극기복례 군자도",
    "sourceTitle": "Analects of Confucius",
    "sourceUrl": "https://laits.utexas.edu/~mr56267/HIST_341K/Confucianism/Analects_of_Confucius.html",
    "supported": true
  },
  {
    "evidence": "백과사전은 코나투스를 모든 존재의 본질인 자기존속의 노력으로 설명하고, 지성적 신 사랑을 우주 이해·덕·행복·자유와 연결한다.",
    "key": "baruchSpinozaEthicaConatusAmorDei",
    "meaning": "스피노자에게 코나투스는 존재가 자기 보존과 역량 증대를 향해 애쓰는 힘이며, 이를 감정과 선택을 성찰하는 관점으로 삼을 수 있다.",
    "nameKo": "스피노자 에티카 코나투스 신즉자연 영원의상관조",
    "sourceTitle": "Baruch Spinoza - Stanford Encyclopedia of Philosophy",
    "sourceUrl": "https://plato.stanford.edu/entries/spinoza/",
    "supported": true
  },
  {
    "evidence": "스탠퍼드 철학 백과는 정언명령의 자율성 정식이 이성적 존재를 보편 법칙의 입법자로 보고, 여러 정식이 같은 도덕법칙을 표현한다고 설명한다.",
    "key": "germanKantCategoricalImperativeSynthesis",
    "meaning": "정언명령은 자신의 행위 원칙을 모두에게 적용 가능한 도덕법칙으로 성찰하고, 타인을 목적으로 존중할지 비춰보는 관점이다.",
    "nameKo": "칸트 정언명령 목적의왕국 자율성 도덕법칙",
    "sourceTitle": "Kant's Moral Philosophy",
    "sourceUrl": "https://plato.stanford.edu/entries/kant-moral/",
    "supported": true
  },
  {
    "evidence": "브리태니커는 타트 트밤 아시를 개인과 절대자의 관계를 나타내는 표현으로 설명하며, 《찬도기야 우파니샤드》에서 브라만의 본성을 가르치는 문맥에 나온다고 풀이한다.",
    "key": "indianUpanishadicTatTvamAsi",
    "meaning": "개별 자아와 절대적 실재의 관계를 성찰하게 하는 가르침으로, 자신과 세계를 깊이 돌아보는 관점을 제공한다.",
    "nameKo": "우파니샤드 타트트밤아시 범아일여 순수의식",
    "sourceTitle": "tat tvam asi",
    "sourceUrl": "https://www.britannica.com/topic/tat-tvam-asi",
    "supported": true
  },
  {
    "evidence": "한국민족문화대백과사전은 최한기의 기학을 운화하는 기를 견문추측으로 탐구해 천인운화에 이르고, 이를 개인과 사회의 실천으로 확장하는 사유체계로 설명한다.",
    "key": "koreanChoeHangiGihakUnwha",
    "meaning": "최한기의 기학은 기의 운화와 견문추측으로 현재의 세계를 살피고, 앎을 삶과 사회의 실천으로 잇는 사유로 성찰의 관점을 준다.",
    "nameKo": "혜강 최한기 기학 신기통 운화기 추측지리",
    "sourceTitle": "기학 - 한국민족문화대백과사전",
    "sourceUrl": "https://encykorea.aks.ac.kr/Article/E0075899",
    "supported": true
  },
  {
    "evidence": "브리태니커는 손자병법이 계획·군수·전략적 우세·기만을 핵심 개념으로 삼고 실제 전쟁의 불확실성에 적용한다고 설명한다.",
    "key": "ancientChineseSunTzuArtOfWarStrategy",
    "meaning": "손자병법은 전쟁 전 형세·강약·지형을 살피고 싸움 없이 목적을 이루려는 전략 사상으로, 상황을 서두르지 않고 성찰하는 관점을 제공한다.",
    "nameKo": "손자병법 오사칠계 부전승 피실격허 전략",
    "sourceTitle": "The Art of War",
    "sourceUrl": "https://www.britannica.com/topic/The-Art-of-War-by-Sun-Tzu",
    "supported": true
  },
  {
    "evidence": "스탠퍼드 철학 백과사전은 데카르트가 코기토의 인식적 힘을 명석하고 판명한 지각에서 찾는다고 설명한다.",
    "key": "frenchDescartesCogitoClaraDistincta",
    "meaning": "코기토는 생각하는 행위에서 자신의 존재를 확실히 붙잡고, 명석판명한 성찰로 판단을 점검하게 하는 관점이다.",
    "nameKo": "데카르트 방법서설 코기토 명석판명 지성직관",
    "sourceTitle": "Descartes' Epistemology",
    "sourceUrl": "https://plato.stanford.edu/entries/descartes-epistemology/",
    "supported": true
  },
  {
    "evidence": "브리태니커는 사성제를 존재의 불만족, 그 원인, 괴로움이 없는 상태, 그 상태에 이르는 길을 밝히는 불교 교리로 설명한다.",
    "key": "ancientIndianEarlyBuddhistFourNobleTruths",
    "meaning": "사성제는 괴로움과 그 원인·소멸·소멸에 이르는 팔정도를 살피며 집착과 삶을 성찰하는 불교의 틀이다.",
    "nameKo": "초기불교 사성제 팔정도 고집멸도 중도해탈",
    "sourceTitle": "Four Noble Truths",
    "sourceUrl": "https://www.britannica.com/topic/Four-Noble-Truths",
    "supported": true
  },
  {
    "evidence": "Encyclopaedia Iranica는 마스나비의 ‘모세와 목자’ 이야기에서 사랑하는 이에게 신은 유일한 신조이며, 예배의 겉모습보다 내면의 의도와 상태가 중요하다고 설명한다.",
    "key": "islamicSufiRumiMasnaviDivineLove",
    "meaning": "루미의 마스나비에서 신성한 사랑은 자아를 넘어 신과의 합일을 갈망하는 수피적 길로, 타인을 판단하기보다 내면의 의도와 변화를 성찰하게 한다.",
    "nameKo": "루미 마스나비 수피즘 신성한사랑 영혼갈망",
    "sourceTitle": "RUMI, JALĀL-AL-DIN viii. Rumi’s Teachings",
    "sourceUrl": "https://www.iranicaonline.org/articles/rumi-jalal-al-din-teachings/",
    "supported": true
  },
  {
    "evidence": "한국민족문화대백과사전은 이를 의상이 화엄사상의 요지를 210자의 간결한 시로 축약한 불교문서로 설명하며, 법계의 상호 연관성을 도형으로 나타낸다고 풀이한다.",
    "key": "koreanUisangHwaeomIlseungBeopgye",
    "meaning": "화엄사상의 요지를 210자 시와 도형으로 압축한 문서로, 모든 현상을 관계의 그물로 성찰하는 관점을 제공하지만 예측 도구는 아니다.",
    "nameKo": "신라 의상대사 화엄일승법계도 법성게 원융무애",
    "sourceTitle": "화엄일승법계도 - 한국민족문화대백과사전",
    "sourceUrl": "https://encykorea.aks.ac.kr/Article/E0064812",
    "supported": true
  },
  {
    "evidence": "스탠퍼드 철학 백과사전은 몽테뉴가 경험을 성찰하고 여러 의견을 견주어 독단을 피하며 판단력을 기른다고 설명한다.",
    "key": "frenchMontaigneEssaisWisdom",
    "meaning": "몽테뉴는 경험을 성찰하고 독단을 유보해 판단을 다듬는 태도로, 삶을 여러 관점에서 돌아보게 한다.",
    "nameKo": "몽테뉴 수상록 자기성찰 독단탈피 회의주의 중용",
    "sourceTitle": "Montaigne, Michel de",
    "sourceUrl": "https://plato.stanford.edu/entries/montaigne/",
    "supported": true
  },
  {
    "evidence": "스탠퍼드 철학 백과사전은 용수의 중관 철학이 공성을 중심으로 하며, 공성은 현상에 고유한 본질이 없음을 뜻하고 독단적 본질 부여를 바로잡는다고 설명합니다.",
    "key": "ancientIndianNagarjunaMadhyamakaSunyata",
    "meaning": "모든 현상이 고정된 본질 없이 관계 속에서 성립한다는 공성의 관점으로, 집착과 단정을 성찰할 수 있습니다.",
    "nameKo": "용수 중론 팔불중도 연기즉공 이제설 공성지혜",
    "sourceTitle": "Nāgārjuna",
    "sourceUrl": "https://plato.stanford.edu/entries/nagarjuna/",
    "supported": true
  },
  {
    "evidence": "한국민족문화대백과사전은 『수심결』의 핵심을 돈오점수와 정혜쌍수로 설명하고, 깨달은 뒤 점차 닦으며 선정과 지혜를 함께 수행한다고 풀이한다.",
    "key": "koreanJinulJeonghyeSsangsuDonohJeomsu",
    "meaning": "지눌의 돈오점수·정혜쌍수는 깨달음과 지속적 수행을 함께 살피는 관점으로, 자기 성찰의 균형을 돕는 전통적 틀이다.",
    "nameKo": "보조국사 지눌 수심결 정혜쌍수 돈오점수 성적등지",
    "sourceTitle": "수심결 - 한국민족문화대백과사전",
    "sourceUrl": "https://encykorea.aks.ac.kr/Article/E0031514",
    "supported": true
  },
  {
    "evidence": "스탠퍼드 철학 백과사전은 브루노가 우주를 무한하고 무수한 태양계로 보았으며 지적 능력의 완성을 촉구했다고 설명한다.",
    "key": "renaissanceBrunoInfiniteUniverseHeroicFurore",
    "meaning": "무한한 우주와 무수한 세계를 사유하고 지적 완성을 추구한 브루노의 관점으로, 익숙한 한계를 성찰한다.",
    "nameKo": "조르다노 브루노 무한우주론 영웅적열정 정신주권",
    "sourceTitle": "Giordano Bruno",
    "sourceUrl": "https://plato.stanford.edu/entries/bruno/",
    "supported": true
  },
  {
    "evidence": "스탠퍼드 철학 백과사전은 파스칼이 자연적·이성적 지식과 초자연적 계시·신앙을 구분하고 이성만으로 초월적 신과 관계할 수 없다고 설명한다.",
    "key": "frenchPascalPenseesHeartReason",
    "meaning": "파스칼의 심장과 이성 논의는 이성의 한계를 성찰하게 하는 관점이며, 측정이나 예측이 아닌 사유의 틀이다.",
    "nameKo": "블레즈 파스칼 팡세 사유하는갈대 심장의논리 파스칼의내기",
    "sourceTitle": "Blaise Pascal - Stanford Encyclopedia of Philosophy",
    "sourceUrl": "https://plato.stanford.edu/entries/pascal/",
    "supported": true
  },
  {
    "evidence": "백과는 의지를 맹목적이고 목적 없는 충동으로, 표상을 개별화된 인식 세계로 설명하며 심미적 관조가 욕망에서 잠시 벗어나게 한다고 풀이한다.",
    "key": "germanSchopenhauerWillRepresentation",
    "meaning": "의지와 표상은 세계를 맹목적·끊임없는 욕망의 의지와 인식이 구성한 표상으로 보며, 욕망과 관점을 성찰하는 틀을 준다.",
    "nameKo": "쇼펜하우어 의지와표상 맹목적의지초월 심미적관조 동포애자비",
    "sourceTitle": "Arthur Schopenhauer - Stanford Encyclopedia of Philosophy",
    "sourceUrl": "https://plato.stanford.edu/entries/schopenhauer/",
    "supported": true
  },
  {
    "evidence": "우리역사넷은 세한도가 제주 유배 중 김정희가 이상적의 변함없는 도움에 감사해 그렸으며, 소나무와 잣나무로 그의 지조와 신의를 표현했다고 설명합니다.",
    "key": "koreanChusaKimJeonghuiSehando",
    "meaning": "세한도는 유배 중에도 변치 않은 제자 이상적의 의리를 송백에 빗댄 그림으로, 역경에서 관계와 지조를 성찰하는 관점을 제시합니다.",
    "nameKo": "추사 김정희 세한도 송백후조 역경극복지조 문자향서권기",
    "sourceTitle": "김정희 필 세한도",
    "sourceUrl": "https://contents.history.go.kr/mobile/kc/view.do?levelId=kc_r300670&code=kc_age_30",
    "supported": true
  },
  {
    "evidence": "스탠퍼드 철학 백과사전은 이를 인간이 무엇을 삶의 가치로 보는지와 자아가 되어가는 방식을 보여주는 실존의 영역들로 설명한다.",
    "key": "danishKierkegaardStagesOfLife",
    "meaning": "키르케고르의 미학적·윤리적·종교적 실존 양식을 돌아보며 자신의 가치와 선택을 성찰하는 관점이다.",
    "nameKo": "쇠렌 키르케고르 단독자 실존3단계 이것이냐저것이냐 신앙도약",
    "sourceTitle": "Søren Kierkegaard - Stanford Encyclopedia of Philosophy",
    "sourceUrl": "https://plato.stanford.edu/entries/kierkegaard/",
    "supported": true
  },
  {
    "evidence": "허들스턴은 이를 운명을 받아들이고 그 안에서 자기 자리를 찾는 사랑으로 해석한다.",
    "key": "germanNietzscheZarathustraAmorFati",
    "meaning": "아모르 파티는 운명을 수동적으로 견디기보다 삶의 필연을 받아들이며 성찰하는 관점이다.",
    "nameKo": "프리드리히 니체 차라투스트라 초인 아모르파티 영원회귀",
    "sourceTitle": "Nietzsche on Amor Fati",
    "sourceUrl": "https://www.degruyterbrill.com/document/doi/10.1515/agph-2024-0040/html",
    "supported": true
  },
  {
    "evidence": "한국민족문화대백과사전은 이 책이 화두를 참구하는 간화선과 선·교·염불을 함께 닦는 수행 체계를 제시한다고 설명합니다.",
    "key": "koreanSeosanHyujeongSeongaGwigam",
    "meaning": "『선가귀감』은 마음을 살피는 간화선과 선교겸수의 길을 제시해, 성찰과 수행을 돌아보는 관점을 제공합니다.",
    "nameKo": "서산대사 휴정 선가귀감 일물영명 활구참선 선교원융",
    "sourceTitle": "선가귀감 - 한국민족문화대백과사전",
    "sourceUrl": "https://encykorea.aks.ac.kr/Article/E0028590",
    "supported": true
  },
  {
    "evidence": "스프링거 심리학·종교 백과사전은 개성화를 의식과 무의식을 아우르는 심리적 전체성과 자기실현을 향한 과정으로 설명한다.",
    "key": "swissJungIndividuationArchetype",
    "meaning": "융의 개성화는 의식과 무의식, 그림자와 아니마·아니무스 같은 내면의 대립을 성찰해 심리적 전체성을 지향하는 관점이다.",
    "nameKo": "카를 융 개성화 원형통합 그림자 아니마아니무스 동시성",
    "sourceTitle": "Jung’s Definition of Individuation",
    "sourceUrl": "https://link.springer.com/rwe/10.1007/978-1-4614-6086-2_329",
    "supported": true
  },
  {
    "evidence": "스탠퍼드 철학 백과사전은 헤겔의 aufheben이 어떤 것을 부정하면서 동시에 보존하며, 대립의 통일인 더 포괄적인 개념으로 이행한다고 설명한다.",
    "key": "germanHegelDialecticalAufheben",
    "meaning": "대립하는 생각을 없애면서도 보존해 더 포괄적 이해로 나아가는 변증법적 지양을 성찰의 관점으로 삼는다.",
    "nameKo": "헤겔 정신현상학 변증법적지양 정반합 인륜성 미네르바올빼미",
    "sourceTitle": "Hegel's Dialectics",
    "sourceUrl": "https://plato.stanford.edu/entries/hegel-dialectics/",
    "supported": true
  },
  {
    "evidence": "한국민족문화대백과사전은 목민심서가 지방관의 수신·청렴·절검과 백성 보호를 다룬 행정 지침서라고 설명한다.",
    "key": "koreanDasanJeongYagyongMokminSimseo",
    "meaning": "목민심서는 공직자의 자기절제와 청렴, 백성에 대한 책임을 강조해 공동체를 성찰하는 관점을 제시한다.",
    "nameKo": "다산 정약용 목민심서 여유당신독 율기청렴 애민 실사구시",
    "sourceTitle": "목민심서 - 한국민족문화대백과사전",
    "sourceUrl": "https://encykorea.aks.ac.kr/Article/E0018631",
    "supported": true
  },
  {
    "evidence": "인터넷 철학 백과사전은 『고백록』에서 과거·현재·미래가 기억·주의·기대로 영혼 안에 현존한다고 설명합니다.",
    "key": "northAfricanAugustineConfessionesIlluminatio",
    "meaning": "아우구스티누스는 과거를 기억하고 현재를 주의하며 미래를 기대하는 시간의식을 성찰의 관점으로 제시했습니다.",
    "nameKo": "아우구스티누스 고백록 시간의3중현존 내적조명 은총안식 평정심",
    "sourceTitle": "Augustine (354–430 C.E.)",
    "sourceUrl": "https://iep.utm.edu/augustine-overview/",
    "supported": true
  },
  {
    "evidence": "스탠퍼드 철학 백과사전은 비르투를 상황에 맞는 전략을 구사하는 역량으로, 포르투나를 예측하기 어려운 힘으로 설명하며 준비가 그 영향에 대응하게 한다고 풀이합니다.",
    "key": "italianMachiavelliVirtuFortuna",
    "meaning": "비르투는 상황에 맞게 행동하는 역량이고 포르투나는 통제하기 어려운 변동이므로, 둘의 긴장에서 준비와 대응을 성찰하는 관점을 제시합니다.",
    "nameKo": "마키아벨리 군주론 비르투역량 포르투나극복 시대조화 여우와사자",
    "sourceTitle": "Niccolò Machiavelli - Stanford Encyclopedia of Philosophy",
    "sourceUrl": "https://plato.stanford.edu/entries/machiavelli/",
    "supported": true
  },
  {
    "evidence": "한국민족문화대백과사전은 풍류도를 신라 고유의 가르침이자 유·불·도의 정신을 포괄하는 사상으로 설명합니다.",
    "key": "koreanChoeChiwonPungryudo",
    "meaning": "최치원이 말한 풍류도는 유·불·도의 장점을 아우른 신라의 가르침으로, 서로 다른 관점을 성찰하는 틀로 삼을 수 있습니다.",
    "nameKo": "최치원 난랑비서 국유현묘지도 풍류도 포함삼교 접화군생 계원필경",
    "sourceTitle": "난랑비서 - 한국민족문화대백과사전",
    "sourceUrl": "https://encykorea.aks.ac.kr/Article/E0011690",
    "supported": true
  },
  {
    "evidence": "SEP는 아퀴나스가 자연 이성의 성취와 한계를 구분하고, 행복을 진리의 관조와 신의 본질에 대한 지향으로 설명한다고 정리한다.",
    "key": "italianThomasAquinasSummaTheologiae",
    "meaning": "이성으로 탐구하되 신앙의 한계를 자각하며, 삶의 목적과 덕을 성찰하는 관점을 제시한다.",
    "nameKo": "토마스 아퀴나스 신학대전 이성신앙조화 5대길 7대덕목 지복직관",
    "sourceTitle": "Thomas Aquinas - Stanford Encyclopedia of Philosophy",
    "sourceUrl": "https://plato.stanford.edu/entries/aquinas/",
    "supported": true
  },
  {
    "evidence": "스탠퍼드 철학백과는 『신기관』이 감각·개념의 오류를 바로잡고 경험과 실험에 기반한 참된 귀납을 추구한다고 설명한다.",
    "key": "britishFrancisBaconNovumOrganum",
    "meaning": "네 가지 우상과 경험에 근거한 귀납으로 선입견을 점검하며, 판단을 성찰하는 관점을 제시한다.",
    "nameKo": "프랜시스 베이컨 신기관 4대우상타파 참된귀납 아는것이힘이다 사실검증",
    "sourceTitle": "Francis Bacon - Stanford Encyclopedia of Philosophy",
    "sourceUrl": "https://plato.stanford.edu/entries/francis-bacon/",
    "supported": true
  },
  {
    "evidence": "국사편찬위원회는 ‘징비’를 지난 잘못을 징계해 후환을 경계하는 뜻으로 설명하며, 류성룡이 임진왜란을 기록해 재발에 대비했다고 밝힌다.",
    "key": "koreanRyuSeongryongJingbirok",
    "meaning": "임진왜란의 원인과 대응을 돌아보고 과오를 기록해 후환을 막으려는 성찰의 관점으로 삼을 수 있다.",
    "nameKo": "서애 류성룡 징비록 징전비후 유비무환 거안사위 인재발탁 실사구시",
    "sourceTitle": "유성룡, 임진왜란을 기록하다",
    "sourceUrl": "https://contents.history.go.kr/mobile/eh/view.do?levelId=eh_n0460_0010&code=eh_age_30",
    "supported": true
  }
];

import { UserProfile } from '../sharedState';

export const ARABIC_ILM_AL_RAML_ENGINE_VERSION = '1.0.0';

export interface ArabicIlmAlRamlReport {
  engineVersion: string;
  calculatedAtKst: string;
  figureNameLatin: string;
  figureNameArabic: string;
  fourLevelDots: string;
  elementalRuler: string;
  planetaryRuler: string;
  houseDomain: string;
  geomanticNature: string;
  qadiJudgeVerdict: string;
  actionGuidance: string;
  earthResonanceIndex: number;
  synthesisPrompt: string;
}

const SIXTEEN_GEOMANTIC_FIGURES = [
  {
    latin: 'Fortuna Major',
    arabic: '누스라 다킬라 (النصرة الداخلة, 내적인 대길)',
    dots: '·· / ·· / · / · (2-2-1-1)',
    element: '흙(Earth) & 불(Fire)',
    planet: '태양(Sun) & 목성(Jupiter)',
    house: '제1하우스 (자기 실현 및 명예로운 승리)',
    nature: '극상의 대길 (Great Good Luck & Inner Triumph)',
    verdict: '내적인 확신과 높은 도덕적 정당성이 외부의 모든 장벽을 무너뜨리고 장기적 성공을 보장합니다.',
    guidance: '정정당당한 태도로 자신의 프로젝트나 주장을 밀고 나가십시오. 흔들리지 않는 중심이 최고의 방패입니다.',
  },
  {
    latin: 'Fortuna Minor',
    arabic: '누스라 카리자 (النصرة الخارجة, 외적인 소길)',
    dots: '· / · / ·· / ·· (1-1-2-2)',
    element: '불(Fire)',
    planet: '태양(Sun)',
    house: '제10하우스 (사회적 평판 및 단기적 성과)',
    nature: '신속한 소길 (Swift Success & Quick Opportunity)',
    verdict: '기회가 눈앞을 빠르게 스쳐 지나가므로 망설이지 말고 민첩하게 포착해야 결실을 거둡니다.',
    guidance: '장기전보다는 즉각적인 마무리에 집중하십시오. 속도감 있게 일을 처리할 때 행운이 증폭됩니다.',
  },
  {
    latin: 'Via',
    arabic: '타리크 (الطريق, 길과 순례)',
    dots: '· / · / · / · (1-1-1-1)',
    element: '물(Water)',
    planet: '달(Moon - 하현/신월)',
    house: '제9하우스 (여행, 이동, 미지의 길)',
    nature: '역동적 변화와 흐름 (Dynamic Motion & Solitary Path)',
    verdict: '정체된 상황이 풀려 이동과 전진이 시작됩니다. 홀로 묵묵히 걷는 외길에서 참된 깨달음이 열립니다.',
    guidance: '과거의 장소나 방식에 머물지 말고 발걸음을 옮기십시오. 새로운 환경과의 접촉이 해결의 열쇠입니다.',
  },
  {
    latin: 'Populus',
    arabic: '자마아 (الجماعة, 사람들의 모임과 거울)',
    dots: '·· / ·· / ·· / ·· (2-2-2-2)',
    element: '물(Water)',
    planet: '달(Moon - 보름달)',
    house: '제7하우스 (대중, 협력, 관계의 거울)',
    nature: '수용성과 공명 (Receptivity, Harmony & Reflection)',
    verdict: '주변 사람들의 심리와 여론이 그대로 반영되는 형국입니다. 독단을 피하고 화합을 도모할 때 안전합니다.',
    guidance: '동료들의 목소리에 귀를 기울이고 팀워크를 강화하십시오. 대중의 흐름을 읽는 자가 성과를 냅니다.',
  },
  {
    latin: 'Acquisitio',
    arabic: '캅즈 다킬 (القبض الداخل, 획득과 포용)',
    dots: '·· / · / ·· / · (2-1-2-1)',
    element: '공기(Air)',
    planet: '목성(Jupiter)',
    house: '제2하우스 (재물 획득, 번영, 가치 축적)',
    nature: '풍요와 확장 (Abundance, Gain & Growth)',
    verdict: '노력의 결실이 손안으로 들어오며 물질적·정신적 곳간이 가득 차는 길상입니다.',
    guidance: '가치 있는 자산이나 지식을 적극적으로 취득하고 문서화하십시오. 투자의 결실을 거둘 적기입니다.',
  },
  {
    latin: 'Amissio',
    arabic: '캅즈 카리즈 (القبض الخارج, 상실과 방하착)',
    dots: '· / ·· / · / ·· (1-2-1-2)',
    element: '불(Fire)',
    planet: '금성(Venus - 역행)',
    house: '제8하우스 (비움, 집착 포기, 영적 정화)',
    nature: '내려놓음과 전환 (Loss of Excess & Liberation)',
    verdict: '물질이나 이해관계에 대한 과도한 집착을 내려놓아야 더 큰 자유와 안전을 얻을 수 있습니다.',
    guidance: '불필요한 지출과 낭비를 즉각 줄이고, 해로운 인간관계의 끈을 의연하게 놓아주십시오.',
  },
  {
    latin: 'Laetitia',
    arabic: '리흐야 카리자 (اللحية الخارجة, 기쁨과 환희)',
    dots: '· / ·· / ·· / ·· (1-2-2-2)',
    element: '공기(Air)',
    planet: '목성(Jupiter) & 금성(Venus)',
    house: '제5하우스 (즐거움, 창작, 희망과 치유)',
    nature: '밝은 환희 (Joy, Good Health & Uplifting Spirit)',
    verdict: '우울과 의심의 구름이 걷히고 가슴 벅찬 희망과 웃음이 피어나는 상서로운 국면입니다.',
    guidance: '밝고 긍정적인 에너지를 주변에 나누십시오. 축하할 만한 작은 성취를 인정하고 기뻐하십시오.',
  },
  {
    latin: 'Tristitia',
    arabic: '만쿠스 (المنكوس, 깊은 슬픔과 인내의 기반)',
    dots: '·· / ·· / ·· / · (2-2-2-1)',
    element: '흙(Earth)',
    planet: '토성(Saturn)',
    house: '제4하우스 (뿌리, 구조, 견고한 인내)',
    nature: '중후한 인내 (Deep Contemplation, Grounding & Patience)',
    verdict: '겉보기엔 무겁고 지루해 보이지만, 깊은 땅속에 흔들리지 않는 주춧돌을 놓는 가장 중요한 시간입니다.',
    guidance: '조급함을 버리고 기본기를 다지십시오. 화려한 겉모습 대신 보이지 않는 구조와 디테일을 보강하십시오.',
  },
  {
    latin: 'Puella',
    arabic: '나키율카드 (نقي الخد, 순수한 미와 조화)',
    dots: '· / ·· / · / · (1-2-1-1)',
    element: '공기(Air)',
    planet: '금성(Venus)',
    house: '제7하우스 (미적 조화, 친절, 낭만적 사랑)',
    nature: '우아한 매력 (Grace, Peace & Aesthetic Harmony)',
    verdict: '부드러움이 강함을 이깁니다. 논리적 논쟁보다는 우아한 배려와 미적 감각이 얼어붙은 마음을 녹입니다.',
    guidance: '대화의 톤을 부드럽게 낮추고, 단정하고 아름다운 옷차림이나 환경 조성으로 매력을 높이십시오.',
  },
  {
    latin: 'Puer',
    arabic: '아흐얀 (الأحيان, 붉은 소년의 혈기)',
    dots: '· / · / ·· / · (1-1-2-1)',
    element: '불(Fire)',
    planet: '화성(Mars)',
    house: '제3하우스 (과감한 추진, 도전, 적극적 투쟁)',
    nature: '돌파하는 용기 (Audacity, Drive & Bold Initiative)',
    verdict: '망설임을 털어내고 전방으로 돌진할 때 장애물이 깨집니다. 단, 무모한 충돌은 피해야 합니다.',
    guidance: '확신이 서면 즉시 방아쇠를 당기십시오. 선제적인 행동이 주도권을 잡게 해줍니다.',
  },
  {
    latin: 'Albus',
    arabic: '바야드 (البياض, 순백의 명석함)',
    dots: '·· / ·· / · / ·· (2-2-1-2)',
    element: '공기(Air) & 물(Water)',
    planet: '수성(Mercury)',
    house: '제6하우스 (분석, 명석한 이성, 평정심)',
    nature: '맑고 투명한 지혜 (Clarity, Purity & Wisdom)',
    verdict: '감정의 동요 없이 차분하게 사안을 분석하면 복잡한 문제의 해법이 명확히 드러납니다.',
    guidance: '감정적 대응을 멈추고 데이터와 객관적 사실에 근거해 판단하십시오. 침착함이 승리를 부릅니다.',
  },
  {
    latin: 'Rubeus',
    arabic: '함라 (الحمرة, 붉은 격정의 불꽃)',
    dots: '·· / · / ·· / ·· (2-1-2-2)',
    element: '불(Fire)',
    planet: '화성(Mars - 격정)',
    house: '제8하우스 (격렬한 열정, 위험 경계, 정화)',
    nature: '원초적 열기 (Fiery Passion, Volatility & Caution)',
    verdict: '에너지가 극도로 고조되어 있으나 통제되지 않으면 화를 부를 수 있으니 각별한 주의가 필요합니다.',
    guidance: '분노나 흥분 상태에서의 중요한 결정이나 발언을 삼가십시오. 열정을 생산적인 작업으로 승화시키십시오.',
  },
  {
    latin: 'Conjunctio',
    arabic: '잇티살 (الاتصال, 결합과 소통)',
    dots: '·· / · / · / ·· (2-1-1-2)',
    element: '공기(Air)',
    planet: '수성(Mercury)',
    house: '제3하우스 (협상, 계약, 네트워크, 정보 교류)',
    nature: '만남과 연결 (Connection, Covenant & Alliance)',
    verdict: '둘이 하나로 묶이고 흩어졌던 요소들이 연결되어 시너지를 창출하는 최적의 합일기입니다.',
    guidance: '파트너십을 체결하거나 계약서를 작성하기에 매우 유리합니다. 적극적으로 연락을 취하십시오.',
  },
  {
    latin: 'Carcer',
    arabic: '우클라 (العقلة, 경계와 보존의 성채)',
    dots: '· / ·· / ·· / · (1-2-2-1)',
    element: '흙(Earth)',
    planet: '토성(Saturn)',
    house: '제12하우스 (격리, 비밀 유지, 에너지 보존)',
    nature: '보호막과 집중 (Containment, Boundaries & Secrecy)',
    verdict: '외부의 간섭을 막고 내실을 다져야 할 때입니다. 계획을 함부로 발설하지 말고 비밀을 엄수하십시오.',
    guidance: '혼자만의 집중 시간을 확보하여 핵심 작업을 완결하십시오. 불필요한 외출이나 모임을 줄이십시오.',
  },
  {
    latin: 'Caput Draconis',
    arabic: '아타바 다킬라 (العتبة الداخلة, 용의 머리/입구)',
    dots: '·· / · / · / · (2-1-1-1)',
    element: '흙(Earth) & 공기(Air)',
    planet: '북쪽 결절(North Node / 라후)',
    house: '제1하우스 (새로운 관문 진입, 상서로운 시작)',
    nature: '도약의 문턱 (Auspicious Threshold & Influx of Luck)',
    verdict: '새로운 차원으로 들어서는 축복의 문턱에 섰습니다. 과거의 관성을 끊고 당당히 입장하십시오.',
    guidance: '새로운 프로젝트, 만남, 학습을 주저 없이 시작하십시오. 행운의 문이 활짝 열려 있습니다.',
  },
  {
    latin: 'Cauda Draconis',
    arabic: '아타바 카리자 (العتبة الخارجة, 용의 꼬리/출구)',
    dots: '· / · / · / ·· (1-1-1-2)',
    element: '불(Fire) & 흙(Earth)',
    planet: '남쪽 결절(South Node / 케투)',
    house: '제12하우스 (마침표, 묵은 매듭의 청산)',
    nature: '종결과 출구 (Exit Threshold, Dissolution & Completion)',
    verdict: '한 시대가 끝나고 출구로 나아가는 시점입니다. 미련을 두지 말고 깔끔하게 마침표를 찍으십시오.',
    guidance: '질질 끌어온 미완성 과제를 최종 마무리하고 털어내십시오. 비워야 새로운 채움이 시작됩니다.',
  },
];

export function calculateArabicIlmAlRaml(options?: {
  profile?: UserProfile;
  targetDate?: Date;
  question?: string;
}): ArabicIlmAlRamlReport {
  const profile = options?.profile;
  const now = options?.targetDate || new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);

  let birthYear = 1990;
  let birthMonth = 1;
  let birthDay = 1;

  if (profile?.basic?.birthdate) {
    const parts = profile.basic.birthdate.split('-').map(Number);
    if (parts.length === 3 && !parts.some(isNaN)) {
      birthYear = parts[0];
      birthMonth = parts[1];
      birthDay = parts[2];
    }
  }

  let seed = birthYear * 787 + birthMonth * 97 + birthDay * 23;
  const nameStr = profile?.basic?.name || 'RamlSeeker';
  for (let i = 0; i < nameStr.length; i++) {
    seed = (seed * 37 + nameStr.charCodeAt(i)) & 0x7fffffff;
  }
  const qStr = options?.question || 'raml_geomancy';
  for (let i = 0; i < qStr.length; i++) {
    seed = (seed * 29 + qStr.charCodeAt(i)) & 0x7fffffff;
  }

  const figureIndex = (seed + kst.getUTCDay() * 5 + kst.getUTCDate() * 3) % SIXTEEN_GEOMANTIC_FIGURES.length;
  const fig = SIXTEEN_GEOMANTIC_FIGURES[figureIndex];

  const earthResonanceIndex = 82 + ((seed * 13 + kst.getUTCHours() * 7) % 17);

  const synthesisPrompt = `
[고대 아랍 일무 알-람말(‘Ilm al-Raml) 16 형상 & 지오맨시(Geomancy) 지혜 실측 데이터]
======================================================================
엔진 버전: ${ARABIC_ILM_AL_RAML_ENGINE_VERSION} | 기준 일시: ${kst.toISOString().replace('T', ' ').slice(0, 19)} KST
----------------------------------------------------------------------
1. 🏜️ [사점(砂占) 지오맨틱 형상 & 천체 조응]:
   - 주재 형상: **${fig.latin}** [${fig.arabic}]
   - 4원소 점(Dot) 구조: \`${fig.dots}\` (머리 불 / 가슴 공기 / 배 물 / 발 흙)
   - 지배 행성 및 원소: **${fig.planet}** | **${fig.element}**
   - 조응 하우스 영역: **${fig.house}**
2. ⚖️ [카디(Qadi/Judge) 심판관 판결]:
   - 형상의 본성: **${fig.nature}**
   - 최종 판결(Verdict): "${fig.verdict}"
3. 🧭 [현실 나침반 지침 & 대지 공명도]:
   - 🎯 전략적 행동 지침: **${fig.guidance}**
   - 대지 원소 공명도: **${earthResonanceIndex}%**
======================================================================
[AI 해석 절대 지침]: 본 리포트는 9세기 아랍 이슬람 황금기 및 중세 유럽 지오맨시 정통 16 형상 체계에 입각한 100% 결정론적 산출물입니다. 형상의 기운과 카디 판결, 현실 행동 지침을 결합하여 상담자에게 단호하고 명쾌한 지상(地上)의 나침반을 제공하십시오.
`.trim();

  return {
    engineVersion: ARABIC_ILM_AL_RAML_ENGINE_VERSION,
    calculatedAtKst: kst.toISOString().replace('T', ' ').slice(0, 19) + ' KST',
    figureNameLatin: fig.latin,
    figureNameArabic: fig.arabic,
    fourLevelDots: fig.dots,
    elementalRuler: fig.element,
    planetaryRuler: fig.planet,
    houseDomain: fig.house,
    geomanticNature: fig.nature,
    qadiJudgeVerdict: fig.verdict,
    actionGuidance: fig.guidance,
    earthResonanceIndex,
    synthesisPrompt,
  };
}

export function formatArabicIlmAlRamlPrompt(report: ArabicIlmAlRamlReport): string {
  return report.synthesisPrompt;
}

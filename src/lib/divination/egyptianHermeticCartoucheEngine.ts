import { UserProfile } from '../sharedState';

export const EGYPTIAN_HERMETIC_CARTOUCHE_ENGINE_VERSION = '1.0.0';

export interface EgyptianHermeticCartoucheReport {
  engineVersion: string;
  calculatedAtKst: string;
  primaryCartoucheName: string;
  hieroglyphSymbol: string;
  divineArchetype: string;
  sacredDomain: string;
  soulTriad: {
    kaVitalityIndex: number;      // 카(Ka) 육체 활력 및 현실 생명력 지수 (0~100)
    baIndividualityIndex: number; // 바(Ba) 인격 영혼 및 독창적 개성 지수 (0~100)
    akhLuminousPurity: number;    // 아크(Akh) 불멸의 영적 광휘 순도 지수 (0~100)
  };
  hermeticDecree: string;
  resurrectionMatrixScore: number;
  synthesisPrompt: string;
}

const CARTOUCHES = [
  { name: '오시리스 (Osiris)', symbol: '크룩과 플레일 (왕권과 지혜의 홀)', archetype: '영적 부활과 영생의 군주', domain: '죽음과 재생, 역경을 통과한 뒤 맞이하는 완전한 회복', decree: '어둠에 부서진 모든 파편은 더 찬란한 빛으로 다시 맞추어지리라.' },
  { name: '이시스 (Isis)', symbol: '왕좌의 관과 날개', archetype: '위대한 모성과 신성한 마법의 여신', domain: '치유와 회복, 흩어진 힘을 하나로 모으는 영적 지혜', decree: '사랑과 헌신의 주문 앞에서는 그 어떤 절망도 힘을 잃으리라.' },
  { name: '호루스 (Horus)', symbol: '우자트 (호루스의 전지적 신성한 눈)', archetype: '승리와 신성한 복원자', domain: '시련 극복, 전지적 안목으로 진실을 꿰뚫어 보는 승리', decree: '높은 하늘을 나는 매의 눈빛으로 상황의 본질을 직시하라.' },
  { name: '토트 (Thoth)', symbol: '이비스 따오기와 갈대 펜', archetype: '우주 기록자이자 지혜와 역법의 신', domain: '기록과 학문, 정밀한 분석과 헤르메스주의 진리 체계화', decree: '말과 생각에 깃든 신성한 질서가 곧 우주를 창조하는 열쇠이니라.' },
  { name: '아누비스 (Anubis)', symbol: '자칼 머리와 황금 저울', archetype: '심장의 무게를 재는 진실의 인도자', domain: '길잡이, 마트(Maat)의 깃털과 양심의 순도 분별', decree: '너의 심장을 깃털처럼 가볍게 비우라. 순수한 영혼만이 문을 통과하리라.' },
  { name: '바스트 (Bastet)', symbol: '시스트럼 방울과 암고양이', archetype: '기쁨과 수호의 여신', domain: '직관적 유연성, 가정의 평화와 악한 기운을 물리치는 놀이', decree: '유연한 미소와 가벼운 발걸음 속에 가장 무서운 방패가 숨어 있다.' },
  { name: '세크메트 (Sekhmet)', symbol: '태양 원반을 얹은 암사자', archetype: '정화하는 맹렬한 화염과 치유의 전사', domain: '정의로운 분노, 병마와 카르마적 불순물을 불태우는 맹렬한 용기', decree: '두려움 없이 불꽃 속으로 뛰어들 때 비로소 순수한 금이 얻어지리라.' },
  { name: '프타 (Ptah)', symbol: '테제드 기둥과 직인의 지팡이', archetype: '언어로 세상을 빚어내는 건축 창조신', domain: '물질화, 정밀한 장인정신과 생각의 구체적 형상화', decree: '마음에서 설계된 진실된 형상이 단단한 돌처럼 현실에 새겨지리라.' },
  { name: '하토르 (Hathor)', symbol: '소의 뿔과 태양 원반, 거울', archetype: '사랑과 미, 신성한 축제의 여신', domain: '풍요와 매혹, 영혼의 기쁨을 노래하는 우주적 자비', decree: '네 영혼을 황금빛 기쁨으로 가득 채워 타인의 어둠을 밝혀주어라.' },
  { name: '아문-라 (Amun-Ra)', symbol: '태양의 깃털 관', archetype: '보이지 않는 곳에서 만물을 비추는 지고신', domain: '숨겨진 근원적 힘, 만물을 양육하는 절대적 광휘', decree: '보이지 않는 중심에서 타오르는 너 자신의 영원한 불꽃을 신뢰하라.' },
  { name: '마트 (Maat)', symbol: '타조의 깃털', archetype: '우주적 정의와 진실, 조화의 여신', domain: '균형과 공정, 혼돈(이스펫)을 잠재우는 절대적 균형', decree: '한 치의 거짓도 없는 저울 위에서 평온한 질서가 영원히 거하리라.' },
  { name: '소베크 (Sobek)', symbol: '악어 머리와 신성한 왕관', archetype: '나일의 원초적 생명력과 용맹의 수호신', domain: '생존 본능, 깊은 물속에서 솟구치는 거침없는 돌파력', decree: '깊은 물살을 두려워하지 않고 박차고 오르는 자가 대지를 지배하리라.' },
];

export function calculateEgyptianHermeticCartouche(
  profile?: UserProfile | null,
  targetDate: Date = new Date()
): EgyptianHermeticCartoucheReport {
  const kst = new Date(targetDate.getTime() + 9 * 3600000);

  let birthYear = 1990;
  let birthMonth = 1;
  let birthDay = 1;

  const bDate = profile?.basic?.birthdate;
  if (bDate) {
    const parts = bDate.split('-').map(Number);
    if (parts.length >= 3 && !isNaN(parts[0])) {
      birthYear = parts[0];
      birthMonth = parts[1];
      birthDay = parts[2];
    }
  }

  let seed = birthYear * 365 + birthMonth * 31 + birthDay;
  const nameStr = profile?.basic?.name || 'Hermes';
  for (let i = 0; i < nameStr.length; i++) {
    seed = (seed * 37 + nameStr.charCodeAt(i)) & 0x7fffffff;
  }

  const cartoucheIdx = (seed + kst.getUTCMonth() + kst.getUTCDate()) % CARTOUCHES.length;
  const cartouche = CARTOUCHES[cartoucheIdx];

  const kaVitality = 72 + ((seed * 3 + kst.getUTCHours() * 7) % 27);
  const baIndividuality = 70 + ((seed * 5 + kst.getUTCDate() * 9) % 29);
  const akhPurity = 75 + ((seed * 11 + kst.getUTCMonth() * 13) % 24);

  const resurrectionScore = Math.round((kaVitality * 0.3) + (baIndividuality * 0.3) + (akhPurity * 0.4));

  const synthesisPrompt = `
[고대 이집트 헤르메스 카르투슈 & 영혼 3위일체 오라클 실측 데이터]
======================================================================
엔진 버전: ${EGYPTIAN_HERMETIC_CARTOUCHE_ENGINE_VERSION} | 기준 일시: ${kst.toISOString().replace('T', ' ').slice(0, 19)} KST
----------------------------------------------------------------------
1. 𓋹 [주재 신성 카르투슈 심볼]:
   - 신성 원형: **${cartouche.name}**
   - 상형문자 표상: ${cartouche.symbol}
   - 원형 위격: ${cartouche.archetype}
   - 주재 영역: ${cartouche.domain}
2. 𓊹 [영혼 3위일체(Ka·Ba·Akh) 공명 스펙트럼]:
   - 카(Ka · 육체 활력 및 물질력): **${kaVitality}/100점**
   - 바(Ba · 인격 영혼 및 독창성): **${baIndividuality}/100점**
   - 아크(Akh · 불멸의 영적 광휘): **${akhPurity}/100점**
   - 종합 부활 변용 지수: **${resurrectionScore}/100점**
3. 📜 [헤르메스주의 에메랄드 타블렛 칙령]:
   - "${cartouche.decree}"
======================================================================
[AI 해석 절대 지침]: 본 리포트는 고대 이집트 알렉산드리아 헤르메스주의 원전과 신성 상형문자 카르투슈 체계에 입각한 100% 결정론적 산출물입니다. 주재 신성 원형과 Ka/Ba/Akh 영혼 지수를 임의로 변경하지 말고, 상담자의 현실적 돌파구와 깊은 내면 정화 가이드로 적극 활용하십시오.
`.trim();

  return {
    engineVersion: EGYPTIAN_HERMETIC_CARTOUCHE_ENGINE_VERSION,
    calculatedAtKst: kst.toISOString().replace('T', ' ').slice(0, 19) + ' KST',
    primaryCartoucheName: cartouche.name,
    hieroglyphSymbol: cartouche.symbol,
    divineArchetype: cartouche.archetype,
    sacredDomain: cartouche.domain,
    soulTriad: {
      kaVitalityIndex: kaVitality,
      baIndividualityIndex: baIndividuality,
      akhLuminousPurity: akhPurity,
    },
    hermeticDecree: cartouche.decree,
    resurrectionMatrixScore: resurrectionScore,
    synthesisPrompt,
  };
}

export function formatEgyptianHermeticCartouchePrompt(report: EgyptianHermeticCartoucheReport): string {
  return report.synthesisPrompt;
}

import { UserProfile } from '../sharedState';

export const TAOIST_GONG_GUO_GE_KARMA_ENGINE_VERSION = '1.0.0';

export interface TaoistGongGuoGeKarmaReport {
  engineVersion: string;
  calculatedAtKst: string;
  meritDomain: string;
  virtueMantra: string;
  netMeritScore: number;
  auspiciousConstellation: string;
  dailyGoodDeedPrescription: string;
  karmicShieldingIndex: number;
  synthesisPrompt: string;
}

const MERIT_SYSTEMS = [
  {
    domain: '자비구제 (慈悲救濟 · 자애로 생명을 살리고 돕는 덕)',
    mantra: '화복무문 유인자소 선악지보 여영수형 (禍福無門 唯人自召 善惡之報 如影隨形)',
    prescription: '곤경에 처한 사람의 말을 끝까지 경청하고 작은 실질적 도움이나 따뜻한 위로를 아끼지 마십시오.',
    constellation: '북두 제1성 탐랑성(貪狼星) · 생기 생명 복덕',
  },
  {
    domain: '언덕순화 (言德純化 · 구업을 씻고 진실한 말을 베푸는 덕)',
    mantra: '불설인단 불긍기장 인유소실 제이기비 (不說人短 不矜己長 人有所失 濟以己備)',
    prescription: '타인의 허물이나 소문을 전하지 않고, 오직 용기와 자존감을 북돋우는 격려의 언어만 입 밖으로 내십시오.',
    constellation: '북두 제2성 거문성(巨門星) · 천을 신성 진리의 빛',
  },
  {
    domain: '음덕의행 (陰德義行 · 남이 보지 않는 곳에서 의로움을 행하는 덕)',
    mantra: '선인시선 개이불견 기복유장 유후불절 (善人是善 豈以不見 其福悠長 遺後不絶)',
    prescription: '칭찬이나 보상을 바라지 않고 주변의 어지러운 공간을 정리하거나 타인을 위한 작은 배려를 남겨두십시오.',
    constellation: '북두 제3성 녹존성(祿存星) · 화해 정화와 음덕의 곳간',
  },
  {
    domain: '지혜보시 (智慧布施 · 선한 배움과 올바른 길을 나누는 덕)',
    mantra: '견피소득 여기소득 견피소실 여기소실 (見彼所得 如己所得 見彼所失 如己所失)',
    prescription: '자신이 터득한 노하우나 유익한 통찰을 아낌없이 공유하여 타인의 시간을 아껴주고 눈을 밝혀주십시오.',
    constellation: '북두 제4성 문곡성(文曲星) · 문창 지혜와 총명 복덕',
  },
  {
    domain: '인욕화해 (忍辱和解 · 분노를 삭이고 원결을 푸는 덕)',
    mantra: '이덕보원 굴기종인 좌소무량재 화위상서 (以德報怨 屈己從人 坐消無量災 化爲祥瑞)',
    prescription: '화가 치밀어 오르는 순간 호흡을 가다듬고 침묵을 지키며, 억울함을 원망 대신 지혜로운 배움으로 승화하십시오.',
    constellation: '북두 제5성 염정성(廉貞星) · 옥형 오행 통어와 원결 용해',
  },
  {
    domain: '청정절제 (淸淨節制 · 욕망을 절제하고 심신을 맑히는 덕)',
    mantra: '적선이지 성신이통 적덕누공 가이장생 (積善以至 誠信以通 積德累功 可以長生)',
    prescription: '과도한 소비나 자극적인 쾌락을 멈추고 몸과 마음을 정갈하게 비워 맑은 천지 기운을 회복하십시오.',
    constellation: '북두 제6성 무곡성(武曲星) · 개양 단단한 수호 방패',
  },
  {
    domain: '결단구원 (決斷救援 · 용기를 내어 불의를 멈추고 약자를 돕는 덕)',
    mantra: '제위부도 긍과휼과 경노린유 물해충충 (濟危扶傾 矜寡恤孤 敬老憐幼 勿害昆蟲)',
    prescription: '부당한 상황에서 용기 있는 원칙을 견지하고, 소외되거나 상처받은 약자의 편에 서서 우산이 되어주십시오.',
    constellation: '북두 제7성 파군성(破軍星) · 요광 파사현정 결단',
  },
];

export function calculateTaoistGongGuoGeKarma(
  profile?: UserProfile | null,
  targetDate: Date = new Date()
): TaoistGongGuoGeKarmaReport {
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

  let seed = birthYear * 1000 + birthMonth * 50 + birthDay;
  const nameStr = profile?.basic?.name || 'Tao';
  for (let i = 0; i < nameStr.length; i++) {
    seed = (seed * 23 + nameStr.charCodeAt(i)) & 0x7fffffff;
  }

  const meritIdx = (seed + kst.getUTCDay() + kst.getUTCDate()) % MERIT_SYSTEMS.length;
  const merit = MERIT_SYSTEMS[meritIdx];

  const netMeritScore = 85 + ((seed * 7 + kst.getUTCHours() * 3) % 36);
  const karmicShieldingIndex = 75 + ((seed * 13 + kst.getUTCDate() * 5) % 24);

  const synthesisPrompt = `
[도교 태상감응편(太上感應篇) & 공과격(功過格) 선악 카르마 적선개운 실측 데이터]
======================================================================
엔진 버전: ${TAOIST_GONG_GUO_GE_KARMA_ENGINE_VERSION} | 기준 일시: ${kst.toISOString().replace('T', ' ').slice(0, 19)} KST
----------------------------------------------------------------------
1. ☯️ [주재 적선공덕 영역 & 성좌 감응]:
   - 적선 주재덕목: **${merit.domain}**
   - 감응 북두성좌: **${merit.constellation}**
2. 📿 [태상감응편 원전 훈언]:
   - "${merit.mantra}"
3. 📈 [수리 지표 & 일일 개운 처방]:
   - 순 공덕(功德) 축적 지수: **+${netMeritScore}점** (길운 유인장 활성화)
   - 카르마적 방패 차폐율: **${karmicShieldingIndex}%**
   - 🎯 오늘의 실천 처방: **${merit.prescription}**
======================================================================
[AI 해석 절대 지침]: 본 리포트는 도교 정통 선서 태상감응편 및 원료범 공과격 음덕 체계에 입각한 100% 결정론적 산출물입니다. 주재 공덕 영역과 실천 처방을 왜곡하지 말고, 상담자가 오늘 당장 행할 수 있는 실질적인 적선개운(積善開運) 행동으로 친절하게 안내하십시오.
`.trim();

  return {
    engineVersion: TAOIST_GONG_GUO_GE_KARMA_ENGINE_VERSION,
    calculatedAtKst: kst.toISOString().replace('T', ' ').slice(0, 19) + ' KST',
    meritDomain: merit.domain,
    virtueMantra: merit.mantra,
    netMeritScore,
    auspiciousConstellation: merit.constellation,
    dailyGoodDeedPrescription: merit.prescription,
    karmicShieldingIndex,
    synthesisPrompt,
  };
}

export function formatTaoistGongGuoGeKarmaPrompt(report: TaoistGongGuoGeKarmaReport): string {
  return report.synthesisPrompt;
}

/**
 * =========================================================================
 * LUCKEY 타로(Tarot) 78장 아르카나 수비학·원소 시나스트리, 소울·퍼스널리티 및 정·역방향 그림자 마스터 엔진
 * (Tarot 78 Arcana Numerology, 4-Elements, Soul/Personality & Dual Polarity Master Engine)
 * =========================================================================
 *
 * [설계 철학 & 핵심 원칙]
 * 1. 단순 랜덤 뽑기에 머물던 타로를 생년월일 수비학(Numerology)과
 *    점성술 4원소(불·물·공기·흙) 조응 기반 100% 결정론적 계산으로 승격한다.
 *
 * 2. 생애 3대 마스터 카드:
 *    - 소울 카드 (Soul Card): 영혼의 불변 본질과 내면의 깊은 소명 (1~9번)
 *    - 퍼스널리티 카드 (Personality Card): 세상과 상호작용하는 외적 페르소나와 재능 (1~22번)
 *    - 올해의 성장 카드 (Year Card): 당해 연도(세운)에 경험할 영적 성장 테마 (1~9년 주기 타임라인)
 *
 * 3. 질문 시각 기준 3카드(과거·현재·미래) 시공간 스프레드:
 *    타임스탬프 결정론적 해시를 통해 과거의 씨앗, 현재의 당면 과제, 미래의 귀결을 도출.
 *
 * 4. [신규 고도화] 정·역방향(Upright & Reversed) 양극성 그림자 통합 분석:
 *    - 빛의 발현(정방향)과 무의식적 그림자 경고(역방향), 그리고 그림자 승화 프로토콜 산출.
 *
 * 5. [신규 고도화] 카발라 생명나무(Tree of Life) 세피라(Sephiroth) 조응 및 패스워킹:
 *    - 영혼의 진화 단계와 신성한 지혜 속성 매핑.
 *
 * 6. [신규 고도화] 4대 마이너 아르카나 수트(Wands·Cups·Swords·Pentacles) 행동 지침:
 *    - 주도 4원소에 상응하는 실천적 일상 액션 프로토콜 도출.
 */

import type { UserProfile } from '../sharedState';
import { resolveEffectiveSolarDate } from '../lunarCalendar';

export const TAROT_MASTER_ENGINE_VERSION = 'LUCKEY-TAROT-v2.4.0';

function formatTarotMasterKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

export const TAROT_MASTER_METHOD =
  '타로(Tarot) 정통 수비학·점성술 4원소 매트릭스 산법: 생년월일 기반 소울 카드·퍼스널리티 카드·올해의 성장 카드 결정론 산출, 시공간 3카드 정·역방향 그림자 분석, 카발라 생명나무 세피라 조응 및 4대 수트 행동 프로토콜 연산';

export interface MajorArcanaCard {
  number: number;
  name: string;
  enName: string;
  element: '불' | '물' | '공기' | '흙';
  keywords: string[];
  coreMessage: string;
  affirmation: string;
  shadowWarning: string;
}

export const MAJOR_ARCANA: Record<number, MajorArcanaCard> = {
  0: { number: 0, name: '바보 (The Fool)', enName: 'The Fool', element: '공기', keywords: ['새로운 시작', '순수', '모험', '자유'], coreMessage: '두려움 없이 미지의 세계로 첫발을 내딛으세요.', affirmation: '나는 우주의 안내를 신뢰하며 대담하게 새로운 여정을 시작합니다.', shadowWarning: '무모한 경솔함이나 현실 감각 결여를 경계하십시오.' },
  1: { number: 1, name: '마법사 (The Magician)', enName: 'The Magician', element: '공기', keywords: ['창조', '재능', '실행력', '의지'], coreMessage: '당신에게는 현실을 창조할 모든 도구와 지혜가 갖춰져 있습니다.', affirmation: '내 안의 무한한 지혜와 창조력이 원하는 현실을 일구어냅니다.', shadowWarning: '재능의 남용, 속임수, 또는 실행력 없는 공상에 주의하십시오.' },
  2: { number: 2, name: '여사제 (The High Priestess)', enName: 'The High Priestess', element: '물', keywords: ['직관', '통찰', '내면의 지혜', '비밀'], coreMessage: '외부의 소음을 끄고 고요한 내면의 직관에 귀 기울이세요.', affirmation: '내 깊은 내면의 직관은 언제나 가장 정확한 진실을 가리킵니다.', shadowWarning: '지나친 고립, 비밀주의, 또는 감정의 억압을 경계하십시오.' },
  3: { number: 3, name: '여황제 (The Empress)', enName: 'The Empress', element: '흙', keywords: ['풍요', '결실', '창조성', '돌봄'], coreMessage: '노력의 씨앗이 탐스러운 결실과 물질적 풍요로 영글고 있습니다.', affirmation: '나는 우주의 풍요를 온전히 수용하며 삶의 모든 결실을 만끽합니다.', shadowWarning: '과도한 탐닉, 나태함, 또는 타인에 대한 집착적 간섭을 피하십시오.' },
  4: { number: 4, name: '황제 (The Emperor)', enName: 'The Emperor', element: '불', keywords: ['질서', '구조', '리더십', '안정'], coreMessage: '명확한 원칙과 체계적인 구조를 세워 주도권을 장악하세요.', affirmation: '나는 흔들림 없는 원칙과 당당한 리더십으로 내 세상을 다스립니다.', shadowWarning: '권위주의적 독선, 고집, 경직된 통제욕을 경계하십시오.' },
  5: { number: 5, name: '교황 (The Hierophant)', enName: 'The Hierophant', element: '흙', keywords: ['지혜', '멘토십', '가치관', '전통'], coreMessage: '신뢰할 수 있는 멘토를 찾거나, 타인을 이끄는 나침반이 되어주세요.', affirmation: '나는 높은 영적 가치를 실천하며 지혜로운 통찰을 나눕니다.', shadowWarning: '낡은 교조주의, 형식주의에 갇히지 말고 유연성을 발휘하십시오.' },
  6: { number: 6, name: '연인 (The Lovers)', enName: 'The Lovers', element: '공기', keywords: ['선택', '조화', '파트너십', '가치관 일치'], coreMessage: '영혼의 결이 맞는 파트너십을 맺고 진정한 가치에 부합하는 선택을 하세요.', affirmation: '나는 진실된 조화 속에서 명확하고 가치 있는 선택을 내립니다.', shadowWarning: '우유부단함, 유혹에 흔들리는 분열, 피상적 관계를 경계하십시오.' },
  7: { number: 7, name: '전차 (The Chariot)', enName: 'The Chariot', element: '물', keywords: ['돌파', '승리', '집중력', '전진'], coreMessage: '상반된 감정을 통제하고 목표를 향해 거침없이 질주할 시간입니다.', affirmation: '어떤 장애물도 내 단호한 의지와 돌파의 질주를 막을 수 없습니다.', shadowWarning: '통제 불능의 저돌성, 번아웃, 주변을 배려하지 않는 독주를 피하십시오.' },
  8: { number: 8, name: '힘 (Strength)', enName: 'Strength', element: '불', keywords: ['내면의 용기', '인내', '자비', '포용'], coreMessage: '물리적 힘이 아닌 부드러운 인내와 자비심이 야성을 다스립니다.', affirmation: '내면의 진정한 용기와 따뜻한 포용력이 모든 갈등을 부드럽게 녹여냅니다.', shadowWarning: '자신에 대한 회의감, 감정적 폭발, 조급증을 조심하십시오.' },
  9: { number: 9, name: '은둔자 (The Hermit)', enName: 'The Hermit', element: '흙', keywords: ['성찰', '자기탐구', '등불', '지혜'], coreMessage: '혼자만의 고요한 시간 속에서 내면의 진실한 등불을 밝히세요.', affirmation: '나는 깊은 성찰을 통해 삶의 본질을 밝히는 지혜의 등불을 켭니다.', shadowWarning: '세상과의 단절, 비관적 염세주의, 현실 도피를 경계하십시오.' },
  10: { number: 10, name: '운명의 수레바퀴 (Wheel of Fortune)', enName: 'Wheel of Fortune', element: '불', keywords: ['터닝포인트', '상승 기류', '기회', '운명'], coreMessage: '새로운 운명의 순환이 시작되었습니다. 밀려오는 기회의 파도를 타세요.', affirmation: '우주의 순환은 나를 항상 더 높은 도약과 풍요의 흐름으로 이끕니다.', shadowWarning: '수동적 운명론에 기대지 말고 주체적인 준비를 멈추지 마십시오.' },
  11: { number: 11, name: '정의 (Justice)', enName: 'Justice', element: '공기', keywords: ['균형', '진실', '명료함', '인과응보'], coreMessage: '감정을 배제하고 냉철한 객관성과 진실의 저울로 판단하세요.', affirmation: '나는 명료한 진실과 균형 잡힌 시선으로 현명한 결정을 내립니다.', shadowWarning: '지나치게 가혹한 심판, 냉정함, 자기합리화를 경계하십시오.' },
  12: { number: 12, name: '매달린 사람 (The Hanged Man)', enName: 'The Hanged Man', element: '물', keywords: ['관점 전환', '수용', '새로운 지혜', '헌신'], coreMessage: '상황을 억지로 바꾸려 하지 말고 시각을 뒤집어 새로운 통찰을 얻으세요.', affirmation: '집착을 내려놓을 때 전혀 새로운 차원의 지혜와 해답이 열립니다.', shadowWarning: '무기력한 희생자 코스프레나 우유부단한 지연을 멈추십시오.' },
  13: { number: 13, name: '죽음 (Death)', enName: 'Death', element: '물', keywords: ['변혁', '끝과 새로운 시작', '환골탈태', '재생'], coreMessage: '낡은 것은 과감히 매듭짓고 전혀 새로운 생명으로 다시 태어나세요.', affirmation: '나는 낡은 과거를 기꺼이 보내주고 찬란한 새 장을 맞이합니다.', shadowWarning: '변화에 대한 두려움으로 이미 죽은 과거를 붙잡고 있지 마십시오.' },
  14: { number: 14, name: '절제 (Temperance)', enName: 'Temperance', element: '불', keywords: ['조화', '연금술', '치유', '중용'], coreMessage: '서로 다른 이질적인 요소들을 조화롭게 융합하여 기적을 만드세요.', affirmation: '내 삶의 모든 에너지가 완벽한 중용과 평온 속에서 조화를 이룹니다.', shadowWarning: '극단적인 불균형, 무절제, 조급한 결합 시도를 경계하십시오.' },
  15: { number: 15, name: '악마 (The Devil)', enName: 'The Devil', element: '흙', keywords: ['속박 직시', '집착 탈피', '원초적 열망', '그림자'], coreMessage: '스스로를 가두고 있는 허상의 사슬을 자각하고 자유를 되찾으세요.', affirmation: '나는 나를 옭아매는 모든 제한적 신념을 꿰뚫어보고 온전히 해방됩니다.', shadowWarning: '물질이나 특정 대상에 대한 맹목적 중독과 자기기만을 끊어내십시오.' },
  16: { number: 16, name: '탑 (The Tower)', enName: 'The Tower', element: '불', keywords: ['급격한 각성', '허상 붕괴', '돌파구', '재건'], coreMessage: '부실한 기반은 무너져야 합니다. 번개 같은 각성 끝에 진정한 진실이 남습니다.', affirmation: '거짓된 껍질이 깨어지고 반석 위에 진정한 내 삶이 다시 세워집니다.', shadowWarning: '변화를 거부하다가 더 큰 충격을 자초하지 말고 스스로 재정비하십시오.' },
  17: { number: 17, name: '별 (The Star)', enName: 'The Star', element: '공기', keywords: ['희망', '치유', '영감', '우주적 축복'], coreMessage: '오랜 어둠 끝에 가장 밝은 별이 떴습니다. 희망을 품고 나아가세요.', affirmation: '나는 우주의 무한한 영감과 축복에 연결되어 희망차게 빛납니다.', shadowWarning: '비현실적인 낙관이나 환상에 안주하지 말고 실천적 발걸음을 옮기십시오.' },
  18: { number: 18, name: '달 (The Moon)', enName: 'The Moon', element: '물', keywords: ['무의식', '환상', '직관 탐색', '불안 극복'], coreMessage: '안개 속 그림자에 겁먹지 말고 가슴속 직관의 나침반을 믿으세요.', affirmation: '어떤 불확실성 속에서도 내 영혼의 나침반은 명료하게 길을 압니다.', shadowWarning: '실체 없는 공포, 피해망상, 감정적 기복에 휘말리지 마십시오.' },
  19: { number: 19, name: '태양 (The Sun)', enName: 'The Sun', element: '불', keywords: ['생명력', '성공', '기쁨', '명료한 승리'], coreMessage: '찬란한 태양빛 아래 모든 의혹이 사라지고 눈부신 성공이 펼쳐집니다.', affirmation: '나는 순수한 기쁨과 활력으로 가득 차 있으며 당당하게 성공을 누립니다.', shadowWarning: '자만심, 오만, 또는 일시적 승리에 도취된 방심을 경계하십시오.' },
  20: { number: 20, name: '심판 (Judgement)', enName: 'Judgement', element: '불', keywords: ['부활', '소명 자각', '용서', '새로운 차원'], coreMessage: '과거의 모든 시련이 소명으로 승화되는 부활의 나팔소리가 울립니다.', affirmation: '나는 더 높은 영혼의 부름에 응답하며 새로운 차원으로 도약합니다.', shadowWarning: '과거의 후회에 발목 잡혀 새로운 부름을 외면하지 마십시오.' },
  21: { number: 21, name: '세계 (The World)', enName: 'The World', element: '흙', keywords: ['완성', '통합', '성공적 매듭', '새 지평'], coreMessage: '위대한 한 주기가 완벽하게 완성되었습니다. 온 세상을 품으세요.', affirmation: '나는 위대한 여정을 완수했으며 무한히 넓은 새 세상의 주인이 됩니다.', shadowWarning: '완벽주의에 빠져 마지막 매듭짓기를 미루지 말고 당당히 완성하십시오.' },
};

export interface TarotTimelineCard {
  timeline: '과거의 씨앗 (Past)' | '현재의 당면과제 (Present)' | '미래의 귀결 (Future)';
  card: MajorArcanaCard;
  interpretation: string;
}

export interface CardPolarity {
  cardName: string;
  isUpright: boolean;
  orientation: '정방향 (Upright · 빛과 잠재력의 발현)' | '역방향 (Reversed · 내면적 성찰과 그림자 과제)';
  coreLight: string;
  shadowWarning: string;
  transmutationAdvice: string;
}

export interface SephiraMapping {
  sephiraName: string;
  sephiraTitle: string;
  spiritualStage: string;
  divineAttribute: string;
  pathworkingGuidance: string;
}

export interface MinorSuitManifestation {
  suitName: '완즈 (Wands · 불)' | '컵스 (Cups · 물)' | '소드 (Swords · 공기)' | '펜타클 (Pentacles · 흙)';
  lifeDomain: string;
  actionProtocol: string;
  dailyPractice: string;
}

export interface TarotMasterResult {
  engineVersion: string;
  method: string;
  status: 'calculated';
  calculatedAtKst: string;
  soulCard: MajorArcanaCard; // 소울 카드 (1~9)
  personalityCard: MajorArcanaCard; // 퍼스널리티 카드 (1~21)
  yearCard: MajorArcanaCard; // 올해의 성장 카드
  currentYear: number;
  timelineCards: TarotTimelineCard[]; // 3카드 스프레드
  elementalBalance: {
    fire: number; // %
    water: number;
    air: number;
    earth: number;
    dominantElement: '불 (열정·추진)' | '물 (직관·감성)' | '공기 (지성·통찰)' | '흙 (물질·안정)';
  };
  tarotVitalityScore: number; // 0 ~ 100
  masterAffirmation: string;
  cardPolarities: CardPolarity[];
  sephiraMapping: {
    soulSephira: SephiraMapping;
    personalitySephira: SephiraMapping;
  };
  suitManifestation: MinorSuitManifestation;
  reflectiveQuestion: string;
  ritualAction: string;
  reflectionFocus: string;
  tarotSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
    tarotCrossAxis: string;
  };
  interpretiveBoundary: string;
}

/**
 * 수비학 숫자 합산 (digits sum)
 */
function sumDigits(n: number): number {
  return String(Math.abs(n)).split('').reduce((acc, c) => acc + (parseInt(c, 10) || 0), 0);
}

// 카발라 생명나무 세피라 정통 매핑
const SEPHIROTH_CATALOG: Record<number, SephiraMapping> = {
  1: {
    sephiraName: '케테르 (Kether)',
    sephiraTitle: '신성한 왕관 (The Crown)',
    spiritualStage: '순수 의지와 원초적 발원',
    divineAttribute: '우주적 일체감과 근원의 창조력',
    pathworkingGuidance: '내면의 가장 순수한 영적 의지를 회복하고 새로운 패러다임을 당당히 개척하십시오.',
  },
  2: {
    sephiraName: '호크마 (Chokmah)',
    sephiraTitle: '신성한 지혜 (Wisdom)',
    spiritualStage: '원초적 영감과 역동적 창조성',
    divineAttribute: '번뜩이는 통찰과 거침없는 발상',
    pathworkingGuidance: '고정관념을 뛰어넘는 번개 같은 직관을 신뢰하고 미지의 영역에 씨앗을 뿌리십시오.',
  },
  3: {
    sephiraName: '비나 (Binah)',
    sephiraTitle: '신성한 이해 (Understanding)',
    spiritualStage: '형태 부여와 깊은 통찰력',
    divineAttribute: '구조화, 모성적 품음, 질서의 지혜',
    pathworkingGuidance: '모호한 아이디어에 명확한 틀과 체계를 부여하여 지속 가능한 현실로 빚어내십시오.',
  },
  4: {
    sephiraName: '헤세드 (Chesed)',
    sephiraTitle: '신성한 자비 (Mercy)',
    spiritualStage: '무조건적 포용과 풍요로운 번영',
    divineAttribute: '관용, 확장, 삶의 결실 축복',
    pathworkingGuidance: '경직된 잣대를 내려놓고 대자비의 마음으로 타인을 품을 때 더 큰 번영이 유입됩니다.',
  },
  5: {
    sephiraName: '게부라 (Geburah)',
    sephiraTitle: '신성한 힘과 분별 (Strength / Severity)',
    spiritualStage: '엄격한 정의와 군더더기 절제',
    divineAttribute: '불필요한 것의 제거와 단호한 결단',
    pathworkingGuidance: '에너지를 갉아먹는 불필요한 관성을 과감히 베어내고 핵심 본질에만 집중하십시오.',
  },
  6: {
    sephiraName: '티페레트 (Tiphereth)',
    sephiraTitle: '신성한 조화와 미 (Beauty / Harmony)',
    spiritualStage: '태양 중심의 자아 통합과 치유',
    divineAttribute: '자비와 엄격의 중용, 영혼의 중심',
    pathworkingGuidance: '상반된 갈등을 사랑과 중용으로 통합하여 진정한 내면의 평온과 아름다움을 꽃피우십시오.',
  },
  7: {
    sephiraName: '네차흐 (Netzach)',
    sephiraTitle: '신성한 승리 (Victory / Endurance)',
    spiritualStage: '열정적 예술성과 끈질긴 인내',
    divineAttribute: '감정의 고결한 승화와 창조적 활력',
    pathworkingGuidance: '시련 속에서도 심장의 불꽃을 꺼뜨리지 말고 열정적인 인내로 승리를 쟁취하십시오.',
  },
  8: {
    sephiraName: '호드 (Hod)',
    sephiraTitle: '신성한 영광 (Splendor / Intellect)',
    spiritualStage: '명료한 지성과 진실의 소통',
    divineAttribute: '논리적 식별, 분석력, 정직한 표현',
    pathworkingGuidance: '감정에 휩쓸리지 않는 투명한 진실과 체계적인 커뮤니케이션으로 신뢰를 구축하십시오.',
  },
  9: {
    sephiraName: '예소드 (Yesod)',
    sephiraTitle: '신성한 기반 (Foundation)',
    spiritualStage: '무의식의 정제와 상상력의 결실',
    divineAttribute: '영적 에너지를 현실로 잇는 통로',
    pathworkingGuidance: '꿈과 무의식의 징표를 예리하게 관찰하고, 흔들리지 않는 내면의 기반을 다지십시오.',
  },
  10: {
    sephiraName: '말쿠트 (Malkuth)',
    sephiraTitle: '신성한 왕국 (The Kingdom)',
    spiritualStage: '물질적 현실 구현과 완전한 완성',
    divineAttribute: '가시적 성취, 대지의 풍요, 매듭',
    pathworkingGuidance: '이상에 머물지 않고 눈에 보이는 현실의 결실과 확실한 결과물로 삶을 완성하십시오.',
  },
};

function getSephira(cardNum: number): SephiraMapping {
  let n = cardNum % 10;
  if (n === 0) n = 10;
  return SEPHIROTH_CATALOG[n] || SEPHIROTH_CATALOG[10];
}

/**
 * 타로 정통 수비학·아르카나 매트릭스 마스터 엔진 실행
 */
export function calculateTarotMaster(params?: {
  profile?: UserProfile | null;
  targetYear?: number;
  now?: Date;
  question?: string;
}): TarotMasterResult {
  const now = params?.now || new Date();
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const currentYear = params?.targetYear || kstNow.getUTCFullYear();

  let birthY = 1994;
  let birthM = 1;
  let birthD = 24;

  if (params?.profile?.basic?.birthdate) {
    const { solarDate } = resolveEffectiveSolarDate(params.profile.basic.birthdate);
    birthY = solarDate.year;
    birthM = solarDate.month;
    birthD = solarDate.day;
  }

  // 1. 퍼스널리티 카드 (1~22)
  const fullSum = birthY + birthM + birthD;
  let pNum = sumDigits(fullSum);
  if (pNum > 21) pNum = sumDigits(pNum);
  const personalityCard = MAJOR_ARCANA[pNum] || MAJOR_ARCANA[1];

  // 2. 소울 카드 (1~9 단일 숫자 축약)
  let sNum = pNum;
  while (sNum > 9) {
    sNum = sumDigits(sNum);
  }
  const soulCard = MAJOR_ARCANA[sNum] || MAJOR_ARCANA[1];

  // 3. 올해의 성장 카드 (당해연도 + 생월 + 생일)
  const ySum = currentYear + birthM + birthD;
  let yrNum = sumDigits(ySum);
  if (yrNum > 21) yrNum = sumDigits(yrNum);
  const yearCard = MAJOR_ARCANA[yrNum] || MAJOR_ARCANA[10];

  // 4. 시공간 3카드 결정론 스프레드 (+09:00 KST 기준)
  const timeHash = kstNow.getUTCFullYear() * 10000 + (kstNow.getUTCMonth() + 1) * 100 + kstNow.getUTCDate() + kstNow.getUTCHours() + kstNow.getUTCMinutes();
  const pastCardNum = (timeHash + sNum + 3) % 22;
  const presentCardNum = (timeHash + pNum + yrNum + 7) % 22;
  const futureCardNum = (timeHash + yrNum * 2 + 11) % 22;

  const pastCard = MAJOR_ARCANA[pastCardNum] || MAJOR_ARCANA[0];
  const presentCard = MAJOR_ARCANA[presentCardNum] || MAJOR_ARCANA[1];
  const futureCard = MAJOR_ARCANA[futureCardNum] || MAJOR_ARCANA[21];

  const timelineCards: TarotTimelineCard[] = [
    {
      timeline: '과거의 씨앗 (Past)',
      card: pastCard,
      interpretation: `과거에 뿌려진 ${pastCard.name}의 기운(${pastCard.keywords.join(', ')})이 현재의 발판이 되었습니다.`,
    },
    {
      timeline: '현재의 당면과제 (Present)',
      card: presentCard,
      interpretation: `지금 당신의 핵심 과제는 ${presentCard.name}의 지혜를 발휘하여 ${presentCard.coreMessage}`,
    },
    {
      timeline: '미래의 귀결 (Future)',
      card: futureCard,
      interpretation: `당면 과제를 성실히 통과할 때 도달할 열매는 ${futureCard.name}의 성취(${futureCard.keywords.join(', ')})입니다.`,
    },
  ];

  // 5. 정·역방향 양극성 그림자 통합 분석
  const cardPolarities: CardPolarity[] = timelineCards.map((tc, idx) => {
    // 결정론적 극성 산출 (약 2/3 확률로 정방향, 1/3 역방향 성찰)
    const isUpright = (timeHash + tc.card.number + idx * 7) % 3 !== 0;
    const orientation = isUpright
      ? ('정방향 (Upright · 빛과 잠재력의 발현)' as const)
      : ('역방향 (Reversed · 내면적 성찰과 그림자 과제)' as const);
    const coreLight = `${tc.card.name}의 본래 에너지(${tc.card.keywords.join(', ')})가 원활하게 흐르고 있습니다.`;
    const shadowWarning = tc.card.shadowWarning;
    const transmutationAdvice = isUpright
      ? `빛의 기운이 순조로우니, ${tc.card.coreMessage}`
      : `에너지가 일시적으로 정체되거나 역방향으로 치달을 수 있습니다. ${shadowWarning} 내면을 차분히 들여다보고 태도를 재정렬하십시오.`;

    return {
      cardName: tc.card.name,
      isUpright,
      orientation,
      coreLight,
      shadowWarning,
      transmutationAdvice,
    };
  });

  // 6. 4원소 밸런스 연산
  const elementCounts = { 불: 0, 물: 0, 공기: 0, 흙: 0 };
  const evaluatedCards = [soulCard, personalityCard, yearCard, pastCard, presentCard, futureCard];
  evaluatedCards.forEach((c) => {
    elementCounts[c.element]++;
  });

  const totalCards = evaluatedCards.length;
  const firePct = Math.round((elementCounts['불'] / totalCards) * 100);
  const waterPct = Math.round((elementCounts['물'] / totalCards) * 100);
  const airPct = Math.round((elementCounts['공기'] / totalCards) * 100);
  const earthPct = 100 - firePct - waterPct - airPct;

  let dominantElement: TarotMasterResult['elementalBalance']['dominantElement'] = '불 (열정·추진)';
  const maxElem = Object.entries(elementCounts).sort((a, b) => b[1] - a[1])[0][0];
  if (maxElem === '불') dominantElement = '불 (열정·추진)';
  else if (maxElem === '물') dominantElement = '물 (직관·감성)';
  else if (maxElem === '공기') dominantElement = '공기 (지성·통찰)';
  else dominantElement = '흙 (물질·안정)';

  const tarotVitalityScore = Math.min(100, Math.max(50, 70 + (presentCard.number % 10) * 2 + (futureCard.number % 5) * 3));

  // 7. 카발라 생명나무 세피라 조응 매핑
  const soulSephira = getSephira(soulCard.number);
  const personalitySephira = getSephira(personalityCard.number);

  // 8. 마이너 아르카나 4대 수트 행동 지침
  let suitManifestation: MinorSuitManifestation;
  if (dominantElement.startsWith('불')) {
    suitManifestation = {
      suitName: '완즈 (Wands · 불)',
      lifeDomain: '창조적 비전, 과감한 기획, 추진력과 돌파',
      actionProtocol: '생각만 하지 말고 오늘 즉시 작은 실행에 옮기십시오. 당신의 열정이 주변을 감화시킵니다.',
      dailyPractice: '매일 아침 가장 중요한 우선순위 과제를 선제적으로 완수하는 모닝 모멘텀 실천',
    };
  } else if (dominantElement.startsWith('물')) {
    suitManifestation = {
      suitName: '컵스 (Cups · 물)',
      lifeDomain: '마음의 평정, 직관적 영감, 진솔한 유대감과 사랑',
      actionProtocol: '논리와 이성 너머 가슴의 진실한 울림에 귀 기울이고, 소중한 사람들과 따스한 감사를 나누십시오.',
      dailyPractice: '하루 10분 고요한 명상과 감정 일기를 통해 무의식의 상처를 따뜻하게 보듬는 이완 루틴',
    };
  } else if (dominantElement.startsWith('공기')) {
    suitManifestation = {
      suitName: '소드 (Swords · 공기)',
      lifeDomain: '명료한 분별력, 객관적 전략, 정직한 소통과 계약',
      actionProtocol: '모호함을 걷어내고 팩트에 기반하여 냉철하게 판단하십시오. 진실한 말 한마디가 상황을 정리합니다.',
      dailyPractice: '복잡한 생각을 마인드맵과 글쓰기로 시각화하여 불필요한 고민을 명확히 제거하기',
    };
  } else {
    suitManifestation = {
      suitName: '펜타클 (Pentacles · 흙)',
      lifeDomain: '가시적 자산 관리, 건강한 신체 바이오리듬, 현실적 결실',
      actionProtocol: '공허한 장밋빛 환상 대신 발밑의 현실을 단단히 다지고, 꾸준한 성실함으로 자산을 축적하십시오.',
      dailyPractice: '식습관과 수면 시간의 규칙성을 회복하고 수입·지출의 흐름을 꼼꼼히 기록하는 안정화 습관',
    };
  }

  const calculatedAtKst = formatTarotMasterKstTimestamp(now);
  const q = (params?.question || '').trim();
  const reflectiveQuestion = q
    ? `'${q}'라는 질문 앞에서, 내 영혼의 본질(${soulCard.name})과 현재의 과제(${presentCard.name})를 잇기 위해 '${suitManifestation.suitName}'의 힘으로 오늘 당장 실행할 한 가지는 무엇인가요?`
    : `지금 '${presentCard.name}'의 국면에서 내 소울 카드(${soulCard.name})의 진실에 가장 가깝게 응답하기 위해 오늘 선택할 행동은 무엇인가요?`;
  const tarotCrossAxis = `[${soulCard.name}] × [${presentCard.name}] × [${dominantElement}] × [${soulSephira.sephiraName}]`;
  const tarotSynthesisMatrix = {
    dominantTension: `${soulCard.name} ↔ ${presentCard.name}`,
    alignmentState: `주도 원소(${dominantElement}) · 세피라(${soulSephira.sephiraName})`,
    integratedAction: `${suitManifestation.actionProtocol}${q ? ` [질문 맥락: ${q}]` : ''}`,
    tarotCrossAxis,
  };

  const ritualAction = `${suitManifestation.suitName} 실천 의례 — ${suitManifestation.dailyPractice}`;
  const reflectionFocus = `소울(${soulCard.name})·퍼스널리티(${personalityCard.name})·현재(${presentCard.name}) 흐름을 ${soulSephira.sephiraName} 관점에서 통합하며 역방향 그림자 신호 점검`;

  const interpretiveBoundary = '본 타로 78 아르카나 마스터 리포트는 수비학·4원소·생명나무 상징 체계에 기반한 자기 성찰 안내이며, 결정론적 운명 단정이 아닙니다.';

  return {
    engineVersion: TAROT_MASTER_ENGINE_VERSION,
    method: TAROT_MASTER_METHOD,
    status: 'calculated',
    calculatedAtKst,
    soulCard,
    personalityCard,
    yearCard,
    currentYear,
    timelineCards,
    elementalBalance: {
      fire: firePct,
      water: waterPct,
      air: airPct,
      earth: earthPct,
      dominantElement,
    },
    tarotVitalityScore,
    masterAffirmation: `${yearCard.affirmation} (올해의 성장 테마: ${yearCard.name})`,
    cardPolarities,
    sephiraMapping: {
      soulSephira,
      personalitySephira,
    },
    suitManifestation,
    reflectiveQuestion,
    ritualAction,
    reflectionFocus,
    tarotSynthesisMatrix,
    interpretiveBoundary,
  };
}

/**
 * 프롬프트 주입용 마스터 포맷터
 */
export function formatTarotMasterPrompt(res: TarotMasterResult): string {
  const matrixLine = res.tarotSynthesisMatrix
    ? `\n- 타로 교차 매트릭스: 핵심 긴장(${res.tarotSynthesisMatrix.dominantTension}) · 조율 상태(${res.tarotSynthesisMatrix.alignmentState}) · 통합 실천(${res.tarotSynthesisMatrix.integratedAction})\n- 4중 교차 축: ${res.tarotSynthesisMatrix.tarotCrossAxis}`
    : '';
  return `[타로(Tarot) 78 아르카나 수비학·소울/퍼스널리티 & 타임라인 리포트 (엔진: ${res.engineVersion} | ${res.calculatedAtKst})]
- 생애 소울 카드 (영혼의 본질): ${res.soulCard.name} [${res.soulCard.element} 원소] - ${res.soulCard.keywords.join(', ')}
- 생애 퍼스널리티 카드 (외적 재능): ${res.personalityCard.name} [${res.personalityCard.element} 원소] - ${res.personalityCard.coreMessage}
- 카발라 생명나무 세피라 조응:
  • 소울 세피라: ${res.sephiraMapping.soulSephira.sephiraName} (${res.sephiraMapping.soulSephira.sephiraTitle}) - ${res.sephiraMapping.soulSephira.spiritualStage}
  • 영적 통로 안내: ${res.sephiraMapping.soulSephira.pathworkingGuidance}
  • 퍼스널리티 세피라: ${res.sephiraMapping.personalitySephira.sephiraName} - ${res.sephiraMapping.personalitySephira.divineAttribute}
- ${res.currentYear} 올해의 성장 카드: ${res.yearCard.name} -> 올해 당신을 관통하는 가장 거대한 영적 테마
- 3카드 타임라인 스프레드 및 정·역방향 그림자 분석:
  • 과거: ${res.timelineCards[0]?.card.name} [${res.cardPolarities[0]?.orientation}] - ${res.timelineCards[0]?.interpretation}
    * 그림자 조언: ${res.cardPolarities[0]?.transmutationAdvice}
  • 현재: ${res.timelineCards[1]?.card.name} [${res.cardPolarities[1]?.orientation}] - ${res.timelineCards[1]?.interpretation}
    * 그림자 조언: ${res.cardPolarities[1]?.transmutationAdvice}
  • 미래: ${res.timelineCards[2]?.card.name} [${res.cardPolarities[2]?.orientation}] - ${res.timelineCards[2]?.interpretation}
    * 그림자 조언: ${res.cardPolarities[2]?.transmutationAdvice}
- 4원소 주도 기운: ${res.elementalBalance.dominantElement}
- 마이너 아르카나 수트 실천 지침:
  • 상응 수트: ${res.suitManifestation.suitName} [핵심 영역: ${res.suitManifestation.lifeDomain}]
  • 행동 프로토콜: ${res.suitManifestation.actionProtocol}
  • 일상 데일리 루틴: ${res.suitManifestation.dailyPractice}
- 마스터 확언: "${res.masterAffirmation}"${matrixLine}
- 실천 의례: ${res.ritualAction}
- 성찰 초점: ${res.reflectionFocus}
- 질문 맞춤 성찰 질문: ${res.reflectiveQuestion}
- 해석 경계: ${res.interpretiveBoundary}
※ 루시 지침: 타로는 우주적 동시성의 언어입니다. 단순 카드 한 장의 해석을 넘어, 사용자의 영혼 소명(소울 카드), 사회적 무기(퍼스널리티), 세피라 영적 계단, 정·역방향 그림자 극복 방안, 4원소 마이너 수트 실천 가이드를 깊고 신비로우면서도 명료하게 연결해 주세요.`;
}

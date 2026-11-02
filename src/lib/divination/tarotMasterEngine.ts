/**
 * =========================================================================
 * LUCKEY 타로(Tarot) 78장 아르카나 수비학·원소 시나스트리 및 소울·퍼스널리티 카드 엔진
 * (Tarot 78 Arcana Numerology, 4-Elements & Soul/Personality Master Engine)
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
 * 4. 4원소 에너지 밸런스(불: 추진력, 물: 감성·직관, 공기: 지성·논리, 흙: 물질·안정).
 */

import type { UserProfile } from '../sharedState';
import { resolveEffectiveSolarDate } from '../lunarCalendar';

export const TAROT_MASTER_ENGINE_VERSION = 'LUCKEY-TAROT-v1.0.0';

export const TAROT_MASTER_METHOD =
  '타로(Tarot) 정통 수비학·점성술 4원소 매트릭스 산법: 생년월일 기반 소울 카드·퍼스널리티 카드·올해의 성장 카드 결정론 산출, 시공간 3카드(과거·현재·미래) 타임라인 및 0~100점 바이오 스코어 연산';

export interface MajorArcanaCard {
  number: number;
  name: string;
  enName: string;
  element: '불' | '물' | '공기' | '흙';
  keywords: string[];
  coreMessage: string;
  affirmation: string;
}

export const MAJOR_ARCANA: Record<number, MajorArcanaCard> = {
  0: { number: 0, name: '바보 (The Fool)', enName: 'The Fool', element: '공기', keywords: ['새로운 시작', '순수', '모험', '자유'], coreMessage: '두려움 없이 미지의 세계로 첫발을 내딛으세요.', affirmation: '나는 우주의 안내를 신뢰하며 대담하게 새로운 여정을 시작합니다.' },
  1: { number: 1, name: '마법사 (The Magician)', enName: 'The Magician', element: '공기', keywords: ['창조', '재능', '실행력', '의지'], coreMessage: '당신에게는 현실을 창조할 모든 도구와 지혜가 갖춰져 있습니다.', affirmation: '내 안의 무한한 지혜와 창조력이 원하는 현실을 일구어냅니다.' },
  2: { number: 2, name: '여사제 (The High Priestess)', enName: 'The High Priestess', element: '물', keywords: ['직관', '통찰', '내면의 지혜', '비밀'], coreMessage: '외부의 소음을 끄고 고요한 내면의 직관에 귀 기울이세요.', affirmation: '내 깊은 내면의 직관은 언제나 가장 정확한 진실을 가리킵니다.' },
  3: { number: 3, name: '여황제 (The Empress)', enName: 'The Empress', element: '흙', keywords: ['풍요', '결실', '창조성', '돌봄'], coreMessage: '노력의 씨앗이 탐스러운 결실과 물질적 풍요로 영글고 있습니다.', affirmation: '나는 우주의 풍요를 온전히 수용하며 삶의 모든 결실을 만끽합니다.' },
  4: { number: 4, name: '황제 (The Emperor)', enName: 'The Emperor', element: '불', keywords: ['질서', '구조', '리더십', '안정'], coreMessage: '명확한 원칙과 체계적인 구조를 세워 주도권을 장악하세요.', affirmation: '나는 흔들림 없는 원칙과 당당한 리더십으로 내 세상을 다스립니다.' },
  5: { number: 5, name: '교황 (The Hierophant)', enName: 'The Hierophant', element: '흙', keywords: ['지혜', '멘토십', '가치관', '전통'], coreMessage: '신뢰할 수 있는 멘토를 찾거나, 타인을 이끄는 나침반이 되어주세요.', affirmation: '나는 높은 영적 가치를 실천하며 지혜로운 통찰을 나눕니다.' },
  6: { number: 6, name: '연인 (The Lovers)', enName: 'The Lovers', element: '공기', keywords: ['선택', '조화', '파트너십', '가치관 일치'], coreMessage: '영혼의 결이 맞는 파트너십을 맺고 진정한 가치에 부합하는 선택을 하세요.', affirmation: '나는 진실된 조화 속에서 명확하고 가치 있는 선택을 내립니다.' },
  7: { number: 7, name: '전차 (The Chariot)', enName: 'The Chariot', element: '물', keywords: ['돌파', '승리', '집중력', '전진'], coreMessage: '상반된 감정을 통제하고 목표를 향해 거침없이 질주할 시간입니다.', affirmation: '어떤 장애물도 내 단호한 의지와 돌파의 질주를 막을 수 없습니다.' },
  8: { number: 8, name: '힘 (Strength)', enName: 'Strength', element: '불', keywords: ['내면의 용기', '인내', '자비', '포용'], coreMessage: '물리적 힘이 아닌 부드러운 인내와 자비심이 야성을 다스립니다.', affirmation: '내면의 진정한 용기와 따뜻한 포용력이 모든 갈등을 부드럽게 녹여냅니다.' },
  9: { number: 9, name: '은둔자 (The Hermit)', enName: 'The Hermit', element: '흙', keywords: ['성찰', '자기탐구', '등불', '지혜'], coreMessage: '혼자만의 고요한 시간 속에서 내면의 진실한 등불을 밝히세요.', affirmation: '나는 깊은 성찰을 통해 삶의 본질을 밝히는 지혜의 등불을 켭니다.' },
  10: { number: 10, name: '운명의 수레바퀴 (Wheel of Fortune)', enName: 'Wheel of Fortune', element: '불', keywords: ['터닝포인트', '상승 기류', '기회', '운명'], coreMessage: '새로운 운명의 순환이 시작되었습니다. 밀려오는 기회의 파도를 타세요.', affirmation: '우주의 순환은 나를 항상 더 높은 도약과 풍요의 흐름으로 이끕니다.' },
  11: { number: 11, name: '정의 (Justice)', enName: 'Justice', element: '공기', keywords: ['균형', '진실', '명료함', '인과응보'], coreMessage: '감정을 배제하고 냉철한 객관성과 진실의 저울로 판단하세요.', affirmation: '나는 명료한 진실과 균형 잡힌 시선으로 현명한 결정을 내립니다.' },
  12: { number: 12, name: '매달린 사람 (The Hanged Man)', enName: 'The Hanged Man', element: '물', keywords: ['관점 전환', '수용', '새로운 지혜', '헌신'], coreMessage: '상황을 억지로 바꾸려 하지 말고 시각을 뒤집어 새로운 통찰을 얻으세요.', affirmation: '집착을 내려놓을 때 전혀 새로운 차원의 지혜와 해답이 열립니다.' },
  13: { number: 13, name: '죽음 (Death)', enName: 'Death', element: '물', keywords: ['변혁', '끝과 새로운 시작', '환골탈태', '재생'], coreMessage: '낡은 것은 과감히 매듭짓고 전혀 새로운 생명으로 다시 태어나세요.', affirmation: '나는 낡은 과거를 기꺼이 보내주고 찬란한 새 장을 맞이합니다.' },
  14: { number: 14, name: '절제 (Temperance)', enName: 'Temperance', element: '불', keywords: ['조화', '연금술', '치유', '중용'], coreMessage: '서로 다른 이질적인 요소들을 조화롭게 융합하여 기적을 만드세요.', affirmation: '내 삶의 모든 에너지가 완벽한 중용과 평온 속에서 조화를 이룹니다.' },
  15: { number: 15, name: '악마 (The Devil)', enName: 'The Devil', element: '흙', keywords: ['속박 직시', '집착 탈피', '원초적 열망', '그림자'], coreMessage: '스스로를 가두고 있는 허상의 사슬을 자각하고 자유를 되찾으세요.', affirmation: '나는 나를 옭아매는 모든 제한적 신념을 꿰뚫어보고 온전히 해방됩니다.' },
  16: { number: 16, name: '탑 (The Tower)', enName: 'The Tower', element: '불', keywords: ['급격한 각성', '허상 붕괴', '돌파구', '재건'], coreMessage: '부실한 기반은 무너져야 합니다. 번개 같은 각성 끝에 진정한 진실이 남습니다.', affirmation: '거짓된 껍질이 깨어지고 반석 위에 진정한 내 삶이 다시 세워집니다.' },
  17: { number: 17, name: '별 (The Star)', enName: 'The Star', element: '공기', keywords: ['희망', '치유', '영감', '우주적 축복'], coreMessage: '오랜 어둠 끝에 가장 밝은 별이 떴습니다. 희망을 품고 나아가세요.', affirmation: '나는 우주의 무한한 영감과 축복에 연결되어 희망차게 빛납니다.' },
  18: { number: 18, name: '달 (The Moon)', enName: 'The Moon', element: '물', keywords: ['무의식', '환상', '직관 탐색', '불안 극복'], coreMessage: '안개 속 그림자에 겁먹지 말고 가슴속 직관의 나침반을 믿으세요.', affirmation: '어떤 불확실성 속에서도 내 영혼의 나침반은 명료하게 길을 압니다.' },
  19: { number: 19, name: '태양 (The Sun)', enName: 'The Sun', element: '불', keywords: ['생명력', '성공', '기쁨', '명료한 승리'], coreMessage: '찬란한 태양빛 아래 모든 의혹이 사라지고 눈부신 성공이 펼쳐집니다.', affirmation: '나는 순수한 기쁨과 활력으로 가득 차 있으며 당당하게 성공을 누립니다.' },
  20: { number: 20, name: '심판 (Judgement)', enName: 'Judgement', element: '불', keywords: ['부활', '소명 자각', '용서', '새로운 차원'], coreMessage: '과거의 모든 시련이 소명으로 승화되는 부활의 나팔소리가 울립니다.', affirmation: '나는 더 높은 영혼의 부름에 응답하며 새로운 차원으로 도약합니다.' },
  21: { number: 21, name: '세계 (The World)', enName: 'The World', element: '흙', keywords: ['완성', '통합', '성공적 매듭', '새 지평'], coreMessage: '위대한 한 주기가 완벽하게 완성되었습니다. 온 세상을 품으세요.', affirmation: '나는 위대한 여정을 완수했으며 무한히 넓은 새 세상의 주인이 됩니다.' },
};

export interface TarotTimelineCard {
  timeline: '과거의 씨앗 (Past)' | '현재의 당면과제 (Present)' | '미래의 귀결 (Future)';
  card: MajorArcanaCard;
  interpretation: string;
}

export interface TarotMasterResult {
  engineVersion: string;
  method: string;
  status: 'calculated';
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
}

/**
 * 수비학 숫자 합산 (digits sum)
 */
function sumDigits(n: number): number {
  return String(Math.abs(n)).split('').reduce((acc, c) => acc + (parseInt(c, 10) || 0), 0);
}

/**
 * 타로 정통 수비학·아르카나 매트릭스 마스터 엔진 실행
 */
export function calculateTarotMaster(params?: {
  profile?: UserProfile | null;
  targetYear?: number;
  now?: Date;
}): TarotMasterResult {
  const now = params?.now || new Date();
  const currentYear = params?.targetYear || now.getFullYear();

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

  // 4. 시공간 3카드 결정론 스프레드
  const timeHash = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate() + now.getHours() + now.getMinutes();
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

  // 5. 4원소 밸런스 연산
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

  return {
    engineVersion: TAROT_MASTER_ENGINE_VERSION,
    method: TAROT_MASTER_METHOD,
    status: 'calculated',
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
  };
}

/**
 * 프롬프트 주입용 마스터 포맷터
 */
export function formatTarotMasterPrompt(res: TarotMasterResult): string {
  return `[타로(Tarot) 78 아르카나 수비학·소울/퍼스널리티 & 타임라인 리포트 (엔진: ${res.engineVersion})]
- 생애 소울 카드 (영혼의 본질): ${res.soulCard.name} [${res.soulCard.element} 원소] - ${res.soulCard.keywords.join(', ')}
- 생애 퍼스널리티 카드 (외적 재능): ${res.personalityCard.name} [${res.personalityCard.element} 원소] - ${res.personalityCard.coreMessage}
- ${res.currentYear} 올해의 성장 카드: ${res.yearCard.name} -> 올해 당신을 관통하는 가장 거대한 영적 테마
- 3카드 타임라인 스프레드:
  • 과거: ${res.timelineCards[0]?.card.name} - ${res.timelineCards[0]?.interpretation}
  • 현재: ${res.timelineCards[1]?.card.name} - ${res.timelineCards[1]?.interpretation}
  • 미래: ${res.timelineCards[2]?.card.name} - ${res.timelineCards[2]?.interpretation}
- 4원소 밸런스: 불 ${res.elementalBalance.fire}% | 물 ${res.elementalBalance.water}% | 공기 ${res.elementalBalance.air}% | 흙 ${res.elementalBalance.earth}% (주도 기운: ${res.elementalBalance.dominantElement})
- 타로 활력 지수: ${res.tarotVitalityScore}점
- 마스터 확언: "${res.masterAffirmation}"
※ 루시 지침: 타로는 우주적 동시성의 언어입니다. 단순 카드 한 장의 해석을 넘어, 사용자의 영혼 소명(소울 카드), 사회적 무기(퍼스널리티), 올해의 성장 테마, 3카드 흐름을 깊고 신비로우면서도 명료하게 연결해 주세요.`;
}

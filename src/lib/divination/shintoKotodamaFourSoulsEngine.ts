/**
 * =========================================================================
 * LUCKEY 고대 일본 신도(神道) 고토다마(言霊) 50음령 & 4혼1생(四魂一志) 영혼 조화 엔진
 * (Shinto Kotodama 50 Sounds & Four Souls [Ichirei Shikon] Harmony Engine)
 * =========================================================================
 * 
 * [학술적·전통적 배경]
 * 고대 일본 정통 신도 사상과 고신도(古神道)의 영혼론 '일영사혼(一霊四魂, Ichirei Shikon)' 및
 * 말에 깃든 영적 생명력 '고토다마(言霊, Kotodama)' 50음령 체계 원전.
 * 
 * 1. 일영사혼(一霊四魂) 구조:
 *    - 1영: 나오히(直霊, Naohi) - 본래의 정직하고 순수한 영적 핵, 만물의 조화와 바로잡음.
 *    - 4혼(四魂, Shikon):
 *      1) 아라미타마 (荒魂, Aramitama): 용(勇) - 진취성, 돌파력, 불굴의 용기와 투지.
 *      2) 니기미타마 (和魂, Nigimitama): 친(親) - 화합, 평화, 조화로운 소통과 공감.
 *      3) 쿠시미타마 (奇魂, Kushimitama): 지(智) - 지혜, 심오한 통찰, 신비로운 탐구와 영감.
 *      4) 사키미타마 (幸魂, Sakimitama): 애(愛) - 사랑, 풍요와 번영, 나눔과 결실.
 * 2. 고토다마(言霊) 50음령 오행·천지 조화:
 *    - 모음 5원음(아·이·우·에·오)과 자음 열의 진동수 결합을 통해 개인의 본원적 언령 에너지 도출.
 * 3. 미소기(禊) & 하라이(祓) 심신 정화 및 개운 칙령:
 *    - 내면의 혼탁함(케가레, 穢れ)을 씻어내고 4혼의 균형을 복원하는 현실 실천 처방.
 */

import type { UserProfile } from '../sharedState';

export const SHINTO_KOTODAMA_FOUR_SOULS_ENGINE_VERSION = '2.1.0';

export interface FourSoulsBalance {
  aramitamaScore: number; // 荒魂 (용기, 돌파) 0~100
  nigimitamaScore: number; // 和魂 (조화, 평화) 0~100
  kushimitamaScore: number; // 奇魂 (지혜, 통찰) 0~100
  sakimitamaScore: number; // 幸魂 (사랑, 번영) 0~100
  dominantSoul: '아라미타마 (荒魂 · 용기)' | '니기미타마 (和魂 · 친화)' | '쿠시미타마 (奇魂 · 지혜)' | '사키미타마 (幸魂 · 번영)';
  dominantSoulTrait: string;
  secondarySoul: '아라미타마 (荒魂 · 용기)' | '니기미타마 (和魂 · 친화)' | '쿠시미타마 (奇魂 · 지혜)' | '사키미타마 (幸魂 · 번영)';
}

export interface KotodamaVibration {
  coreSound: string;
  soundElement: string;
  vibrationalRole: string;
  kotodamaChant: string;
}

export interface ShintoKotodamaReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  naohiPurityIndex: number; // 나오히(直霊) 본원 청정도 0~100
  fourSouls: FourSoulsBalance;
  kotodama: KotodamaVibration;
  blessingKami: string; // 수호 신격 원형
  misogiAction: string; // 미소기(禊) 정화 실천
  spiritualAdvice: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  shintoSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatShintoKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

const KOTODAMA_SOUNDS: KotodamaVibration[] = [
  {
    coreSound: '아 (ア / A)',
    soundElement: '태초의 열림 · 천공(天) 원소',
    vibrationalRole: '우주 만물이 깨어나는 원초적 생명력과 무한한 가능성의 발현',
    kotodamaChant: '아마테라스 오오미카미의 밝은 빛이 사방을 비추듯 새 길을 엽니다.'
  },
  {
    coreSound: '이 (イ / I)',
    soundElement: '생명의 솟구침 · 풍(風) 원소',
    vibrationalRole: '의지가 굳건히 세워지고 목적을 향해 힘차게 전진하는 기운',
    kotodamaChant: '이부키(숨결)의 바람이 막힌 기운을 흩고 맑은 뜻을 세웁니다.'
  },
  {
    coreSound: '우 (ウ / U)',
    soundElement: '내면의 잉태 · 수(水) 원소',
    vibrationalRole: '지혜와 영감이 고요한 심연에서 무르익는 깊은 수용의 진동',
    kotodamaChant: '해구의 깊은 바다처럼 모든 씨앗을 품어 영근 결실로 키웁니다.'
  },
  {
    coreSound: '에 (エ / E)',
    soundElement: '선택과 분별 · 화(火) 원소',
    vibrationalRole: '옳고 그름을 가르고 최선의 결단을 내리는 날카로운 지성의 힘',
    kotodamaChant: '카구츠치의 신성한 불꽃으로 혼탁함을 태우고 결단의 불을 밝힙니다.'
  },
  {
    coreSound: '오 (オ / O)',
    soundElement: '완성과 조화 · 지(地) 원소',
    vibrationalRole: '모든 요소가 제자리를 찾아 융합되고 평온을 이루는 결실의 진동',
    kotodamaChant: '오오쿠니누시의 풍요로운 대지처럼 사방의 복을 평화로 감쌉니다.'
  }
];

const KAMI_ARCHETYPES = [
  '아마테라스 오오미카미 (天照大御神 - 광명과 만물 주재의 태양신)',
  '츠쿠요미노 미코토 (月読命 - 밤과 심연, 고요한 직관의 달의 신)',
  '스사노오노 미코토 (須佐之男命 - 용맹과 재앙 극복의 바다와 폭풍의 신)',
  '오오쿠니누시노 카미 (大国主神 - 인연 맺음과 대지 번영의 신)',
  '사루타히코노 카미 (猿田彦神 - 앞길을 밝혀 인도하는 결단의 길잡이 신)',
  '아메노우즈메노 미코토 (天宇受賣命 - 기쁨과 예술, 웃음으로 닫힌 문을 여는 신)',
  '코토시로누시노 카미 (事代主神 - 신탁과 지혜, 선견지명의 신)'
];

/**
 * 사용자 프로필 및 타임스탬프를 기반으로
 * 일영사혼(一霊四魂) 균형과 고토다마(言霊) 진동수를 결정론적으로 연산합니다.
 */
export function calculateShintoKotodama(options?: {
  profile?: UserProfile;
  targetInstantTime?: string;
  question?: string;
  now?: Date;
}): ShintoKotodamaReport {
  const profile = options?.profile;
  const now = options?.now ?? (options?.targetInstantTime ? new Date(options.targetInstantTime) : new Date());
  const q = options?.question?.trim() || '';

  let seed = 7331;
  for (let i = 0; i < q.length; i++) {
    seed = (seed * 31 + q.charCodeAt(i)) % 1000003;
  }

  if (profile?.basic?.birthdate) {
    const parts = profile.basic.birthdate.split('-').map(Number);
    seed += (parts[0] || 1990) * 11 + (parts[1] || 1) * 31 + (parts[2] || 1) * 7;
  } else {
    seed += now.getFullYear() * 13 + (now.getMonth() + 1) * 29 + now.getDate() * 17;
  }

  if (profile?.basic?.birthtime) {
    const [h, m] = profile.basic.birthtime.split(':').map(Number);
    seed += (h || 0) * 19 + (m || 0) * 3;
  }

  // 1. 나오히(直霊) 본원 청정도 산출 (50 ~ 98점 범위)
  const naohiPurityIndex = 50 + (seed % 49);

  // 2. 4혼(四魂) 점수 배분
  const s1 = 40 + ((seed * 7 + 13) % 55); // 아라미타마
  const s2 = 40 + ((seed * 11 + 23) % 55); // 니기미타마
  const s3 = 40 + ((seed * 13 + 37) % 55); // 쿠시미타마
  const s4 = 40 + ((seed * 17 + 41) % 55); // 사키미타마

  const scores = [
    { name: '아라미타마 (荒魂 · 용기)' as const, score: s1, trait: '두려움 없이 난관을 뚫고 목표를 향해 치고 나가는 강력한 돌파력' },
    { name: '니기미타마 (和魂 · 친화)' as const, score: s2, trait: '갈등을 녹이고 타인과의 조화로운 공감대를 엮어내는 평화의 친화력' },
    { name: '쿠시미타마 (奇魂 · 지혜)' as const, score: s3, trait: '사물의 본질을 꿰뚫고 직관적인 영감으로 해법을 찾는 심오한 지혜' },
    { name: '사키미타마 (幸魂 · 번영)' as const, score: s4, trait: '주변에 온기를 나누고 풍요로운 결실과 인연의 복을 피워내는 사랑의 힘' }
  ];

  scores.sort((a, b) => b.score - a.score);
  const dominant = scores[0];
  const secondary = scores[1];

  const fourSouls: FourSoulsBalance = {
    aramitamaScore: s1,
    nigimitamaScore: s2,
    kushimitamaScore: s3,
    sakimitamaScore: s4,
    dominantSoul: dominant.name,
    dominantSoulTrait: dominant.trait,
    secondarySoul: secondary.name,
  };

  // 3. 고토다마 5음령 선정
  const soundIdx = seed % KOTODAMA_SOUNDS.length;
  const kotodama = KOTODAMA_SOUNDS[soundIdx];

  // 4. 수호 신격 선정
  const kamiIdx = (seed + 3) % KAMI_ARCHETYPES.length;
  const blessingKami = KAMI_ARCHETYPES[kamiIdx];

  // 5. 미소기(禊) 정화 실천
  const misogiActions = [
    '아침 첫 잔의 맑은 냉수를 천천히 들이켜며 마음속 부정적 생각을 씻어내는 수기(水氣) 정화',
    '책상과 머무는 방의 북동쪽(귀문방)을 빗자루와 마른 수건으로 정갈하게 닦아 기운을 바로잡음',
    '마음에 얹힌 근심을 종이에 적은 뒤 찢거나 태워 미련 없이 허공으로 환원하는 의식',
    '조용한 숲이나 공원에서 큰 나무의 기운을 바라보며 깊은 들숨과 날숨 7회 호흡',
    '하루 동안 타인을 탓하거나 불평하는 말을 삼가고 감사의 언령(고토다마) 3회 발성'
  ];
  const misogiAction = misogiActions[seed % misogiActions.length];

  // 6. 종합 영적 조언
  let advice = '';
  if (dominant.name.includes('아라미타마')) {
    advice = '현재 영혼의 야성적 돌파력이 극대화된 상태입니다. 주저하던 결단을 행동으로 옮길 최적기이나, 과속으로 인한 주변과의 마찰을 니기미타마의 온화함으로 보완하십시오.';
  } else if (dominant.name.includes('니기미타마')) {
    advice = '조화와 상생의 기운이 높아 협력과 관계 개선에 탁월한 시기입니다. 다만 타인의 눈치를 보느라 본인의 본심을 숨기지 않도록 나오히의 올곧음을 유지하십시오.';
  } else if (dominant.name.includes('쿠시미타마')) {
    advice = '심오한 통찰과 창의적 직관이 솟구치는 국면입니다. 일상의 소음을 잠시 끄고 깊은 사색과 연구, 전략적 기획에 집중하면 놀라운 돌파구가 열릴 것입니다.';
  } else {
    advice = '따뜻한 사랑과 물질적·정서적 번영의 에너지가 충만합니다. 베풀고 나누는 행위가 배가 되어 더 큰 결실로 되돌아오는 호순환의 파동 속에 있습니다.';
  }

  const calculatedAtKst = formatShintoKstTimestamp(now);
  const shintoSynthesisMatrix = {
    dominantTension: `${dominant.name} ↔ ${secondary.name} · ${kotodama.coreSound}`,
    alignmentState: `${blessingKami}`,
    integratedAction: `${misogiAction}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };
  const reflectiveQuestion = q
    ? `지금 고민하시는 '${q}' 앞에서, '${dominant.name}'의 기운을 맑은 나오히(直霊)의 중심으로 조율해 내뱉을 첫 번째 언령은 무엇입니까?`
    : `오늘 하루 내 말과 호흡 속에 깃든 고토다마(言霊)가 '${dominant.name}'의 덕목을 어떻게 부드럽게 현실에 빚어낼 수 있겠습니까?`;
  const interpretiveBoundary = '이 리포트는 고대 신도 일영사혼(一霊四魂)과 고토다마 언령 상징을 바탕으로 한 내면 조율 비유이며, 종교적 예언이나 의학적 진단이 아닙니다.';

  return {
    engineVersion: SHINTO_KOTODAMA_FOUR_SOULS_ENGINE_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    naohiPurityIndex,
    fourSouls,
    kotodama,
    blessingKami,
    misogiAction,
    spiritualAdvice: advice,
    reflectiveQuestion,
    interpretiveBoundary,
    shintoSynthesisMatrix,
  };
}

/**
 * 프롬프트 포맷터
 */
export function formatShintoKotodamaPrompt(report: ShintoKotodamaReport): string {
  const fs = report.fourSouls;
  const kd = report.kotodama;

  return `[⛩️ 고대 일본 신도 고토다마(言霊) 50음령 & 4혼1생(四魂一志) 영혼 조화 실측 데이터]
======================================================================
엔진 버전: v${report.engineVersion} | 연산 시각: ${report.calculatedAtKst}
수호 신격: ${report.blessingKami}
======================================================================
1. [일영사혼(一霊四魂) 영혼 균형]:
   - 주재 혼(Dominant Soul): [${fs.dominantSoul}] | 보조 교차 혼: [${fs.secondarySoul}]
   - 주재 영혼 특성: ${fs.dominantSoulTrait}
   - 사혼(四魂) 각 영역 흐름: 아라미타마(용기·돌파) / 니기미타마(화합·평화) / 쿠시미타마(지혜·통찰) / 사키미타마(사랑·번영)

2. [고토다마(言霊) 진동 & 개운 언령]:
   - 주재 음령: [${kd.coreSound}] (${kd.soundElement})
   - 영적 역할: ${kd.vibrationalRole}
   - 개운 고토다마 칙령: "${kd.kotodamaChant}"

3. [미소기(禊) 정화 처방 & 교차 매트릭스]:
   - 추천 정화 실천: ${report.misogiAction}
   - 종합 카르마 조언: ${report.spiritualAdvice}${report.shintoSynthesisMatrix ? `\n   - 교차 매트릭스 [핵심 긴장: ${report.shintoSynthesisMatrix.dominantTension} | 조율 상태: ${report.shintoSynthesisMatrix.alignmentState}]\n   - 통합 실천: ${report.shintoSynthesisMatrix.integratedAction}` : ''}
   - 성찰 질문: ${report.reflectiveQuestion}
   - 해석 경계: ${report.interpretiveBoundary}
======================================================================`;
}

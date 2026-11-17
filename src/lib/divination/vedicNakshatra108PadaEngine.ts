import { UserProfile } from '../sharedState';

export const VEDIC_NAKSHATRA_108_PADA_ENGINE_VERSION = '2.1.0';

function formatNakshatra108KstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

export interface VedicNakshatra108PadaReport {
  engineVersion: string;
  calculatedAtKst: string;
  nakshatraIndex: number;
  nakshatraNameKo: string;
  nakshatraSanskrit: string;
  pada: number;
  totalPadaIndex: number;
  navamshaSignKo: string;
  navamshaLord: string;
  presidingDeity: string;
  tattvaElement: string;
  ganaType: '데바 (Deva - 신성/자비)' | '마누샤 (Manusha - 인간/조화)' | '라크샤사 (Rakshasa - 투쟁/변혁)';
  symbol: string;
  animalYoni: string;
  karmicSoulMission: string;
  dharmaPathScore: number;
  sanskritMantra: string;
  secondaryNakshatra: {
    index: number;
    nameKo: string;
    sanskrit: string;
    deity: string;
    mission: string;
  };
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  synthesisPrompt: string;
  nakshatra108SynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

const NAKSHATRAS = [
  { index: 1, nameKo: '아슈비니', sanskrit: 'Ashwini', deity: '아슈빈 쌍둥이신 (치유의 기사)', symbol: '말의 머리', animal: '수말', tattva: '지(地)', gana: '데바 (Deva - 신성/자비)' as const, mission: '신속한 결단과 영혼 치유, 개척자적 선구자' },
  { index: 2, nameKo: '바라니', sanskrit: 'Bharani', deity: '야마 (심판과 정의의 신)', symbol: '자궁 (Yoni)', animal: '코끼리', tattva: '지(地)', gana: '마누샤 (Manusha - 인간/조화)' as const, mission: '정화와 재탄생, 감정의 억압을 뚫고 피어나는 생명력' },
  { index: 3, nameKo: '크리티카', sanskrit: 'Krittika', deity: '아그니 (정화의 불의 신)', symbol: '면도칼 / 단검', animal: '양', tattva: '화(火)', gana: '라크샤사 (Rakshasa - 투쟁/변혁)' as const, mission: '불필요한 집착의 절단과 진리의 성화로 자아 순화' },
  { index: 4, nameKo: '로히니', sanskrit: 'Rohini', deity: '브라흐마 (우주 창조신)', symbol: '수레 / 황소', animal: '뱀', tattva: '지(地)', gana: '마누샤 (Manusha - 인간/조화)' as const, mission: '풍요로운 미적 창조, 결실과 현실적 물질화의 마스터' },
  { index: 5, nameKo: '므리가시라', sanskrit: 'Mrigashira', deity: '소마 (신성한 영약의 달의 신)', symbol: '사슴 머리', animal: '암사슴', tattva: '지(地)', gana: '데바 (Deva - 신성/자비)' as const, mission: '지혜에 대한 갈망, 영혼의 안식처를 향한 끝없는 탐색' },
  { index: 6, nameKo: '아르드라', sanskrit: 'Ardra', deity: '루드라 (폭풍과 파괴의 신)', symbol: '눈물방울', animal: '암캐', tattva: '수(水)', gana: '마누샤 (Manusha - 인간/조화)' as const, mission: '영혼의 눈물을 통한 깊은 각성과 카르마적 폭풍의 해소' },
  { index: 7, nameKo: '푸나르바수', sanskrit: 'Punarvasu', deity: '아디티 (우주 만물의 어머니 신)', symbol: '화살통', animal: '암고양이', tattva: '수(水)', gana: '데바 (Deva - 신성/자비)' as const, mission: '상실 후의 온전한 회복, 빛의 재림과 영적 풍요의 복원' },
  { index: 8, nameKo: '푸샤', sanskrit: 'Pushya', deity: '브리하스파티 (신들의 스승 / 목성신)', symbol: '소의 젖통 / 연꽃', animal: '수양', tattva: '수(水)', gana: '데바 (Deva - 신성/자비)' as const, mission: '헌신적 양육과 영적 가르침, 가장 상서로운 수호의 빛' },
  { index: 9, nameKo: '아슐레샤', sanskrit: 'Ashlesha', deity: '사르파 (신성한 뱀 / 쿤달리니)', symbol: '똬리를 튼 뱀', animal: '수고양이', tattva: '수(水)', gana: '라크샤사 (Rakshasa - 투쟁/변혁)' as const, mission: '쿤달리니 잠재력 각성, 심리적 통찰과 독을 약으로 바꾸는 연금술' },
  { index: 10, nameKo: '마가', sanskrit: 'Magha', deity: '피트리스 (조상 영혼 / 신성한 선조)', symbol: '왕좌 / 가마', animal: '수사자', tattva: '화(火)', gana: '라크샤사 (Rakshasa - 투쟁/변혁)' as const, mission: '가계의 영예와 권위 계승, 고결한 리더십과 조상의 가호 발현' },
  { index: 11, nameKo: '푸르바 팔구니', sanskrit: 'Purva Phalguni', deity: '바가 (번영과 행운의 신)', symbol: '침대 앞다리 / 해먹', animal: '암쥐', tattva: '화(火)', gana: '마누샤 (Manusha - 인간/조화)' as const, mission: '관계의 기쁨과 창조적 로맨스, 유쾌한 휴식과 예술적 결실' },
  { index: 12, nameKo: '우타라 팔구니', sanskrit: 'Uttara Phalguni', deity: '아리아만 (우정과 계약의 신)', symbol: '침대 뒷다리', animal: '수소', tattva: '화(火)', gana: '마누샤 (Manusha - 인간/조화)' as const, mission: '공동체적 책임과 지속 가능한 계약, 의로운 약속 수호' },
  { index: 13, nameKo: '하스타', sanskrit: 'Hasta', deity: '사비트루 (태양의 신성한 활력신)', symbol: '펼친 손', animal: '암소', tattva: '풍(風)', gana: '데바 (Deva - 신성/자비)' as const, mission: '손끝에서 피어나는 기술과 치유, 정밀한 장인정신과 기회 포착' },
  { index: 14, nameKo: '치트라', sanskrit: 'Chitra', deity: '비슈바카르마 (신성한 건축의 신)', symbol: '빛나는 보석', animal: '암호랑이', tattva: '풍(風)', gana: '라크샤사 (Rakshasa - 투쟁/변혁)' as const, mission: '내면의 보석 연마, 세상을 매혹하는 예술적 건축과 환상 초월' },
  { index: 15, nameKo: '스와티', sanskrit: 'Swati', deity: '바유 (바람의 신)', symbol: '바람에 흔들리는 어린 싹', animal: '수물소', tattva: '풍(風)', gana: '데바 (Deva - 신성/자비)' as const, mission: '자유로운 유연성과 자립, 어떤 역경에도 부러지지 않는 독립심' },
  { index: 16, nameKo: '비샤카', sanskrit: 'Vishakha', deity: '인드라 & 아그니 (승리와 화염의 연합신)', symbol: '개선문 / 저울', animal: '수호랑이', tattva: '화(火)', gana: '라크샤사 (Rakshasa - 투쟁/변혁)' as const, mission: '목표를 향한 불굴의 집념, 승리의 문을 통과하는 인내와 결단' },
  { index: 17, nameKo: '아누라다', sanskrit: 'Anuradha', deity: '미트라 (신성한 우정과 연대의 신)', symbol: '피어난 연꽃', animal: '암사슴', tattva: '수(水)', gana: '데바 (Deva - 신성/자비)' as const, mission: '진정한 우정과 영적 박애, 진흙탕 속에서도 청정하게 피어나는 사랑' },
  { index: 18, nameKo: '제슈타', sanskrit: 'Jyeshtha', deity: '인드라 (신들의 왕)', symbol: '원형 부적 / 우산', animal: '수사슴', tattva: '풍(風)', gana: '라크샤사 (Rakshasa - 투쟁/변혁)' as const, mission: '오래된 영혼의 원숙함, 영적 수호자로서 약자를 보호하는 권위' },
  { index: 19, nameKo: '물라', sanskrit: 'Mula', deity: '니리티 (근원의 여신 / 뿌리의 신)', symbol: '뿌리 묶음', animal: '수사자', tattva: '풍(風)', gana: '라크샤사 (Rakshasa - 투쟁/변혁)' as const, mission: '환상의 뿌리를 뽑아내는 근원적 탐구, 완전한 바닥에서의 대반전' },
  { index: 20, nameKo: '푸르바 아샤다', sanskrit: 'Purva Ashadha', deity: '아파스 (우주의 신성한 물의 여신)', symbol: '키(곡식을 거르는 도구) / 부채', animal: '수원숭이', tattva: '공(空)', gana: '마누샤 (Manusha - 인간/조화)' as const, mission: '불패의 정화력, 실패를 모르는 신념과 영적 불침번' },
  { index: 21, nameKo: '우타라 아샤다', sanskrit: 'Uttara Ashadha', deity: '비슈베데바스 (우주의 보편적 신들)', symbol: '코끼리 상아', animal: '암원숭이', tattva: '공(空)', gana: '마누샤 (Manusha - 인간/조화)' as const, mission: '궁극의 고결한 승리, 만인에게 기여하는 보편적 덕성과 진실' },
  { index: 22, nameKo: '슈라바나', sanskrit: 'Shravana', deity: '비슈누 (우주의 질서 유지신)', symbol: '세 개의 귀 / 발자국', animal: '암원숭이', tattva: '공(空)', gana: '데바 (Deva - 신성/자비)' as const, mission: '우주의 소리를 경청하는 지혜, 구전 지식의 계승과 진리 습득' },
  { index: 23, nameKo: '다니슈타', sanskrit: 'Dhanishta', deity: '8 바수 (자연계의 8대 원소신)', symbol: '북(Dhamaru) / 피리', animal: '암사자', tattva: '공(空)', gana: '라크샤사 (Rakshasa - 투쟁/변혁)' as const, mission: '우주적 리듬과의 동기화, 풍요로운 물질과 영적 조화의 연주' },
  { index: 24, nameKo: '샤타비샤', sanskrit: 'Shatabhisha', deity: '바루나 (우주 천궁과 대양의 심연신)', symbol: '백 개의 치유의 별 / 원', animal: '암말', tattva: '공(空)', gana: '라크샤사 (Rakshasa - 투쟁/변혁)' as const, mission: '백 가지 약초를 품은 신비 치유, 비밀을 탐구하는 고독한 현자' },
  { index: 25, nameKo: '푸르바 바드라파다', sanskrit: 'Purva Bhadrapada', deity: '아자 에카파다 (외발의 우주 번개신)', symbol: '장례용 침대 앞 / 번개', animal: '수사자', tattva: '공(空)', gana: '마누샤 (Manusha - 인간/조화)' as const, mission: '영적 고행과 초월, 세속적 욕망을 불태우는 변혁의 화염' },
  { index: 26, nameKo: '우타라 바드라파다', sanskrit: 'Uttara Bhadrapada', deity: '아히르부드냐 (심연의 쿤달리니 용신)', symbol: '바다 깊은 곳의 닻', animal: '암소', tattva: '공(空)', gana: '마누샤 (Manusha - 인간/조화)' as const, mission: '깊은 내면의 평온과 무조건적 연민, 심연에서 길어 올린 지혜' },
  { index: 27, nameKo: '레바티', sanskrit: 'Revati', deity: '푸샨 (길을 잃은 영혼을 인도하는 목자신)', symbol: '물고기 한 쌍 / 드럼', animal: '암코끼리', tattva: '공(空)', gana: '데바 (Deva - 신성/자비)' as const, mission: '영혼의 최종적 환원과 해탈, 상처 입은 자들을 건너게 하는 자비의 배' },
];

const ZODIAC_SIGNS = [
  { name: '양자리 (Aries)', lord: '화성 (Mars)' },
  { name: '황소자리 (Taurus)', lord: '금성 (Venus)' },
  { name: '쌍둥이자리 (Gemini)', lord: '수성 (Mercury)' },
  { name: '게자리 (Cancer)', lord: '달 (Moon)' },
  { name: '사자자리 (Leo)', lord: '태양 (Sun)' },
  { name: '처녀자리 (Virgo)', lord: '수성 (Mercury)' },
  { name: '천칭자리 (Libra)', lord: '금성 (Venus)' },
  { name: '전갈자리 (Scorpio)', lord: '화성 (Mars)' },
  { name: '사수자리 (Sagittarius)', lord: '목성 (Jupiter)' },
  { name: '염소자리 (Capricorn)', lord: '토성 (Saturn)' },
  { name: '물병자리 (Aquarius)', lord: '토성 (Saturn)' },
  { name: '물고기자리 (Pisces)', lord: '목성 (Jupiter)' },
];

export function calculateVedicNakshatra108Pada(
  profile?: UserProfile | null,
  targetDate: Date = new Date(),
  question?: string
): VedicNakshatra108PadaReport {
  const kst = new Date(targetDate.getTime() + 9 * 3600000);
  const nowUtc = targetDate.getTime();

  let birthYear = 1990;
  let birthMonth = 1;
  let birthDay = 1;
  let birthHour = 12;

  const bDate = profile?.basic?.birthdate;
  const bTime = profile?.basic?.birthtime;

  if (bDate) {
    const parts = bDate.split('-').map(Number);
    if (parts.length >= 3 && !isNaN(parts[0])) {
      birthYear = parts[0];
      birthMonth = parts[1];
      birthDay = parts[2];
    }
  }

  if (bTime) {
    const tParts = bTime.split(':').map(Number);
    if (tParts.length >= 1 && !isNaN(tParts[0])) {
      birthHour = tParts[0];
    }
  }

  // 결정론적 시드 산출
  let seed = birthYear * 10000 + birthMonth * 100 + birthDay + birthHour * 17;
  const nameStr = profile?.basic?.name || 'Soul';
  for (let i = 0; i < nameStr.length; i++) {
    seed = (seed * 31 + nameStr.charCodeAt(i)) & 0x7fffffff;
  }

  // 108 파다 인덱스 (0 ~ 107)
  const totalPadaIndexZero = Math.abs(seed) % 108;
  const totalPadaIndex = totalPadaIndexZero + 1; // 1 ~ 108

  // 나크샤트라 인덱스 (0 ~ 26) 및 파다 (1 ~ 4)
  const nakshatraIndexZero = Math.floor(totalPadaIndexZero / 4);
  const pada = (totalPadaIndexZero % 4) + 1;
  const nakshatra = NAKSHATRAS[nakshatraIndexZero];

  // 나밤샤(D9) 별자리 인덱스 (0 ~ 11)
  const navamshaIndex = totalPadaIndexZero % 12;
  const navamsha = ZODIAC_SIGNS[navamshaIndex];

  // 다르마 경로 조화 점수 (0 ~ 100)
  const dharmaPathScore = 70 + ((seed * 7 + kst.getUTCDate() * 11) % 29);

  const mantras = [
    '옴 샨티 샨티 샨티 (Om Shanti Shanti Shanti)',
    '옴 나마 시바야 (Om Namah Shivaya)',
    '옴 감 가나파타예 나마하 (Om Gam Ganapataye Namaha)',
    '옴 타트 사트 (Om Tat Sat)',
    '옴 나모 바가바테 바수데바야 (Om Namo Bhagavate Vasudevaya)',
  ];
  const sanskritMantra = mantras[(seed + pada) % mantras.length];
  const secondaryNakshatraRaw = NAKSHATRAS[(nakshatraIndexZero + 13) % NAKSHATRAS.length];
  const secondaryNakshatra = {
    index: secondaryNakshatraRaw.index,
    nameKo: secondaryNakshatraRaw.nameKo,
    sanskrit: secondaryNakshatraRaw.sanskrit,
    deity: secondaryNakshatraRaw.deity,
    mission: secondaryNakshatraRaw.mission,
  };
  const calculatedAtKst = formatNakshatra108KstTimestamp(targetDate);
  const q = (question || '').trim();
  const reflectiveQuestion = q
    ? `"${q}"에 대해 ${nakshatra.nameKo} 제${pada}파다의 소명(${nakshatra.mission})과 대칭 성좌 ${secondaryNakshatra.nameKo}의 지혜를 어떻게 현실 행동으로 이어 볼까요?`
    : `오늘 ${nakshatra.nameKo} 제${pada}파다의 힘과 맞은편 ${secondaryNakshatra.nameKo} 성좌의 균형을 맞추기 위해 어떤 작은 선택을 해 볼 수 있을까요?`;
  const interpretiveBoundary =
    '해석 경계: 본 리포트는 베다 27나크샤트라와 108파다 상징 체계를 통해 내면의 소명과 행동 방향을 비추는 철학적·상징적 참고이며, 실제 천문 관측이나 운명의 단정을 대신하지 않습니다.';
  const nakshatra108SynthesisMatrix = {
    dominantTension: `${nakshatra.nameKo} 제${pada}파다 ↔ ${navamsha.name} · 보조 성좌 ${secondaryNakshatra.nameKo}`,
    alignmentState: `${nakshatra.gana} · ${nakshatra.tattva} · ${nakshatra.deity}`,
    integratedAction: `${sanskritMantra} · ${nakshatra.mission}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  const synthesisPrompt = `
[베다 27나크샤트라 & 108파다(Pada) 상징 성찰 자료 · 천문 실측 아님]
======================================================================
엔진 버전: ${VEDIC_NAKSHATRA_108_PADA_ENGINE_VERSION} | 기준 일시: ${calculatedAtKst}
----------------------------------------------------------------------
1. 🕉️ [생년·출생 시각·이름 시드로 만든 상징 나크샤트라·파다 참고]:
   - 상징 나크샤트라: 제${nakshatra.index}/27성좌 **${nakshatra.nameKo} (${nakshatra.sanskrit})**
   - 상징 파다 인덱스: **제${pada}파다 / 4** (전체 108파다 중 제${totalPadaIndex}번째 파다)
   - 나밤샤(D9) 대응 상징: **${navamsha.name}** (지배성: ${navamsha.lord})
   - 대칭 보조 나크샤트라(상징): 제${secondaryNakshatra.index}성좌 **${secondaryNakshatra.nameKo} (${secondaryNakshatra.sanskrit})** · ${secondaryNakshatra.deity} (${secondaryNakshatra.mission})
2. 🏛️ [신성 속성 및 에너지 격자]:
   - 주재신(Deity): ${nakshatra.deity}
   - 군(Gana): ${nakshatra.gana} | 원소(Tattva): ${nakshatra.tattva}
   - 상징(Symbol): ${nakshatra.symbol} | 영적 토템(Yoni): ${nakshatra.animal}
3. 🎯 [전통에서 가져온 성찰 주제와 참고 만트라]:
   - 성찰 주제: ${nakshatra.mission}
   - 참고 만트라: **${sanskritMantra}**
4. 🧭 [108파다 교차 매트릭스]:
   - 핵심 긴장: ${nakshatra108SynthesisMatrix.dominantTension}
   - 조율 상태: ${nakshatra108SynthesisMatrix.alignmentState}
   - 통합 실천: ${nakshatra108SynthesisMatrix.integratedAction}
5. 🪞 [성찰 질문 & 해석 경계]:
   - 성찰 질문: ${reflectiveQuestion}
   - ${interpretiveBoundary}
======================================================================
[AI 해석 지침]: 이 인덱스는 생년월일·출생 시각·이름에서 만든 결정론적 상징값일 뿐, 천문력·항성황도·달의 경도·출생 장소를 계산하지 않습니다. 실제 출생 나크샤트라, 파다, 나밤샤를 나타내거나 검증하지 않으며, 점수도 측정값이 아닙니다. 위 항목을 실제 천문 배치, 객관적 성격 진단, 확정된 카르마 사실처럼 말하지 마십시오. 전통 상징을 활용한 참고용 성찰로만 설명하고, 사용자의 현실 판단을 대신하지 마십시오.
`.trim();

  return {
    engineVersion: VEDIC_NAKSHATRA_108_PADA_ENGINE_VERSION,
    calculatedAtKst,
    nakshatraIndex: nakshatra.index,
    nakshatraNameKo: nakshatra.nameKo,
    nakshatraSanskrit: nakshatra.sanskrit,
    pada,
    totalPadaIndex,
    navamshaSignKo: navamsha.name,
    navamshaLord: navamsha.lord,
    presidingDeity: nakshatra.deity,
    tattvaElement: nakshatra.tattva,
    ganaType: nakshatra.gana,
    symbol: nakshatra.symbol,
    animalYoni: nakshatra.animal,
    karmicSoulMission: nakshatra.mission,
    dharmaPathScore,
    sanskritMantra,
    secondaryNakshatra,
    reflectiveQuestion,
    interpretiveBoundary,
    synthesisPrompt,
    nakshatra108SynthesisMatrix,
  };
}

export function formatVedicNakshatra108PadaPrompt(report: VedicNakshatra108PadaReport): string {
  return report.synthesisPrompt;
}

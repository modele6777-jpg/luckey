/**
 * =========================================================================
 * LUCKEY 고대 마야 촐킨(Tzolk'in) 260일 신성력 20 나왈(Nawal) & 13 은하 톤 엔진
 * (Ancient Mayan Tzolk'in 260-Day Sacred Calendar & Solar Kin Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 메소아메리카 마야 문명의 촐킨(Tzolk'in) 260일 신성력(Sacred Almanac).
 * 20개의 태양 문양(나왈 Nawal / Solar Seals)과 13개의 은하 톤(Galactic Tones)이
 * 톱니바퀴처럼 맞물려 1부터 260까지의 고유한 신성한 킨(Kin) 주기를 형성합니다.
 * 
 * 1. 20개 태양 문양: 이미쉬(용), 이크(바람), 악발(밤), 칸(씨앗), 치크찬(뱀), 
 *    키미(다리/세계의 연결자), 마닉(손/치유), 라마트(별/예술), 물룩(달/정화), 옥(개/충성),
 *    추엔(원숭이/유희), 엡(인간/지혜), 벤(갈대/용기), 익스(마법사/직관), 멘(독수리/통찰),
 *    킵(올빼미/용서), 카반(지구/항해), 에츠납(거울/진실), 카왁(폭풍/변용), 아하우(태양/깨달음)
 * 2. 13개 은하 톤: 1(자기적 - 목적), 2(월극적 - 도전), 3(전기적 - 봉사) ~ 13(우주적 - 초월)
 * 3. 4대 방위와 원소 색상: 동(붉은색 - 탄생), 북(흰색 - 정제), 서(푸른색 - 변용), 남(노란색 - 숙성)
 * 4. 본명 킨(Birth Kin)과 오늘의 킨(Daily Kin)의 파동적 합성 및 은하적 사명 도출
 */

import type { UserProfile } from '../sharedState';

export const MAYAN_TZOLKIN_VERSION = 'LUCKEY-MAYAN-TZOLKIN-v1.0.0';

export interface SolarSealInfo {
  index: number;            // 0 ~ 19
  mayaName: string;         // 마야어 명칭 (예: Imix, Ik', Ak'b'al 등)
  koreanName: string;       // 한국어 상징 명칭 (예: 붉은 용, 흰 바람 등)
  directionColor: '동방 적색 (탄생)' | '북방 백색 (정제)' | '서방 청색 (변용)' | '남방 황색 (숙성)';
  sacredKeywords: string;   // 3대 핵심 키워드
  lightGift: string;        // 태양의 빛나는 잠재력
  shadowChallenge: string;  // 그림자의 함정
}

export interface GalacticToneInfo {
  toneNumber: number;       // 1 ~ 13
  mayaToneName: string;     // 마야 톤 명칭 (Hun, Ka, Ox 등)
  toneNameKo: string;       // 한국어 톤 칭호 (예: 자기적 톤, 공명적 톤 등)
  creativePower: string;    // 창조의 힘과 기능
  actionPrinciple: string;  // 행동 원리
}

export interface MayanKinReport {
  kinNumber: number;        // 1 ~ 260
  seal: SolarSealInfo;
  tone: GalacticToneInfo;
  kinFullName: string;      // 예: "Kin 1: 붉은 자기적 용 (Red Magnetic Dragon)"
  wavespellName: string;    // 속해 있는 13일의 파동 스펠 (예: 붉은 용 파동)
  cosmicDestinyGuidance: string; // 은하적 운명 지침
}

export interface MayanTzolkinReport {
  engineVersion: string;
  calculatedAt: string;
  birthKin: MayanKinReport;
  todayKin: MayanKinReport;
  galacticHarmonicResonanceScore: number; // 0 ~ 100 은하 공명 지수
  dailyTzolkinMission: string;            // 오늘의 촐킨 신성 미션
  sacredAltarAction: string;              // 마야 4방위 정렬 행동
}

const SOLAR_SEALS: SolarSealInfo[] = [
  { index: 0, mayaName: 'Imix', koreanName: '붉은 용 (Red Dragon)', directionColor: '동방 적색 (탄생)', sacredKeywords: '양육 · 존재 · 원초의 신뢰', lightGift: '새로운 생명과 프로젝트를 시작하고 조건 없이 품어주는 힘', shadowChallenge: '결핍에 대한 불안과 과도한 의존' },
  { index: 1, mayaName: 'Ik\'', koreanName: '흰 바람 (White Wind)', directionColor: '북방 백색 (정제)', sacredKeywords: '소통 · 숨결 · 영적 전달', lightGift: '진실한 말을 통해 영혼을 일깨우고 숨통을 틔우는 소통력', shadowChallenge: '우유부단함과 공허한 뜬구름' },
  { index: 2, mayaName: 'Ak\'b\'al', koreanName: '푸른 밤 (Blue Night)', directionColor: '서방 청색 (변용)', sacredKeywords: '꿈 · 풍요 · 내면의 성소', lightGift: '무의식의 꿈을 현실의 풍요로 끌어내리는 직관력', shadowChallenge: '우울감과 자기만의 고립' },
  { index: 3, mayaName: 'K\'an', koreanName: '노란 씨앗 (Yellow Seed)', directionColor: '남방 황색 (숙성)', sacredKeywords: '개화 · 타깃팅 · 잠재력', lightGift: '적절한 때를 기다려 폭발적으로 꽃을 피우는 지혜', shadowChallenge: '안전지대에만 머물려는 나태' },
  { index: 4, mayaName: 'Chikchan', koreanName: '붉은 뱀 (Red Serpent)', directionColor: '동방 적색 (탄생)', sacredKeywords: '생존력 · 본능 · 쿤달리니', lightGift: '위기를 정면 돌파하는 압도적인 신체적 활력과 열정', shadowChallenge: '원초적 분노와 감각적 탐닉' },
  { index: 5, mayaName: 'Kimi', koreanName: '흰 세계의 다리 (White World-Bridger)', directionColor: '북방 백색 (정제)', sacredKeywords: '기회 · 연결 · 내려놓음', lightGift: '낡은 집착을 기꺼이 떠나보내고 새로운 세계를 잇는 통로', shadowChallenge: '과거에 얽매여 놓지 못하는 미련' },
  { index: 6, mayaName: 'Manik\'', koreanName: '푸른 손 (Blue Hand)', directionColor: '서방 청색 (변용)', sacredKeywords: '치유 · 완성 · 앎', lightGift: '직접 손을 움직여 망가진 것을 고치고 완결짓는 실천력', shadowChallenge: '타인의 몫까지 떠안는 과로' },
  { index: 7, mayaName: 'Lamat', koreanName: '노란 별 (Yellow Star)', directionColor: '남방 황색 (숙성)', sacredKeywords: '예술 · 조화 · 명료한 우아함', lightGift: '주변의 혼돈을 우아한 예술과 조화로운 질서로 빚어내는 힘', shadowChallenge: '완벽주의와 자기 비하' },
  { index: 8, mayaName: 'Muluk', koreanName: '붉은 달 (Red Moon)', directionColor: '동방 적색 (탄생)', sacredKeywords: '정화 · 물의 흐름 · 보편적 소통', lightGift: '감정의 탁한 응어리를 맑게 씻어내고 순리로 흐르게 하는 힘', shadowChallenge: '감정의 소용돌이에 휩쓸림' },
  { index: 9, mayaName: 'Ok', koreanName: '흰 개 (White Dog)', directionColor: '북방 백색 (정제)', sacredKeywords: '사랑 · 충성 · 동반자', lightGift: '믿음을 준 사람과 원칙을 끝까지 지키는 순수한 헌신', shadowChallenge: '배신에 대한 두려움과 집착' },
  { index: 10, mayaName: 'Chuwen', koreanName: '푸른 원숭이 (Blue Monkey)', directionColor: '서방 청색 (변용)', sacredKeywords: '마술 · 유희 · 환영 간파', lightGift: '무거운 인생의 심각성을 가볍게 비틀어 웃음으로 바꾸는 유쾌함', shadowChallenge: '현실 회피와 비꼬는 태도' },
  { index: 11, mayaName: 'Eb\'', koreanName: '노란 인간 (Yellow Human)', directionColor: '남방 황색 (숙성)', sacredKeywords: '자유의지 · 지혜 · 수용', lightGift: '타인의 다름을 포용하고 스스로의 길을 주체적으로 선택하는 힘', shadowChallenge: '만성적 회의와 통제 상실' },
  { index: 12, mayaName: 'B\'en', koreanName: '붉은 하늘을 걷는 자 (Red Skywalker)', directionColor: '동방 적색 (탄생)', sacredKeywords: '탐험 · 용기 · 기둥', lightGift: '미지의 영역을 두려움 없이 개척하는 호기심과 담대함', shadowChallenge: '지나친 방랑과 정착 실패' },
  { index: 13, mayaName: 'Ix', koreanName: '흰 마법사 (White Wizard)', directionColor: '북방 백색 (정제)', sacredKeywords: '영원한 지금 · 직관 · 수용성', lightGift: '과거와 미래의 불안을 털고 지금 이 순간의 기적을 창조하는 마법', shadowChallenge: '조작 욕구와 영적 교만' },
  { index: 14, mayaName: 'Men', koreanName: '푸른 독수리 (Blue Eagle)', directionColor: '서방 청색 (변용)', sacredKeywords: '전체 조망 · 비전 · 마음의 힘', lightGift: '높은 창공에서 전체 판을 꿰뚫어 보고 시대를 앞서는 혜안', shadowChallenge: '냉소적 관조와 행동 결여' },
  { index: 15, mayaName: 'K\'ib\'', koreanName: '노란 전사 (Yellow Warrior)', directionColor: '남방 황색 (숙성)', sacredKeywords: '질문 · 두려움 없음 · 지성', lightGift: '어떤 권위 앞에서도 본질적인 의문을 던지고 답을 찾는 용기', shadowChallenge: '끝없는 시비와 말다툼' },
  { index: 16, mayaName: 'Kab\'an', koreanName: '붉은 지구 (Red Earth)', directionColor: '동방 적색 (탄생)', sacredKeywords: '항해 · 동시성 · 진화', lightGift: '삶이 보내는 동시성(우연의 일치) 시그널을 읽고 바른길을 잡는 감각', shadowChallenge: '생각 과잉과 방향 상실' },
  { index: 17, mayaName: 'Etz\'nab\'', koreanName: '흰 거울 (White Mirror)', directionColor: '북방 백색 (정제)', sacredKeywords: '진실 · 질서 · 비추임', lightGift: '거짓과 위선을 단칼에 베어내고 본질의 투명함을 드러내는 명검', shadowChallenge: '가혹한 단죄와 차가움' },
  { index: 18, mayaName: 'Kawak', koreanName: '푸른 폭풍 (Blue Storm)', directionColor: '서방 청색 (변용)', sacredKeywords: '촉매 · 재생 · 자가 발전', lightGift: '정체된 국면을 한순간에 뒤흔들어 비약적인 성장을 이끄는 에너지', shadowChallenge: '극단적 파괴와 번아웃' },
  { index: 19, mayaName: 'Ajaw', koreanName: '노란 태양 (Yellow Sun)', directionColor: '남방 황색 (숙성)', sacredKeywords: '보편적 불꽃 · 생명 · 깨달음', lightGift: '모든 어둠을 비추는 따스한 자비와 무조건적인 생명의 빛', shadowChallenge: '과도한 이상주의와 타인 무시' },
];

const GALACTIC_TONES: GalacticToneInfo[] = [
  { toneNumber: 1, mayaToneName: 'Hun', toneNameKo: '자기적 톤 (Magnetic)', creativePower: '목적 수립 · 끌어당김', actionPrinciple: '하나의 분명한 목표를 세우고 에너지를 집중하십시오.' },
  { toneNumber: 2, mayaToneName: 'Ka', toneNameKo: '월극적 톤 (Lunar)', creativePower: '도전 식별 · 양극성 조율', actionPrinciple: '도전과 장애물을 성장의 연료로 기쁘게 인식하십시오.' },
  { toneNumber: 3, mayaToneName: 'Ox', toneNameKo: '전기적 톤 (Electric)', creativePower: '봉사 활성화 · 결합', actionPrinciple: '내가 가진 자원으로 주변을 돕는 방법을 실행하십시오.' },
  { toneNumber: 4, mayaToneName: 'Kan', toneNameKo: '자기존재적 톤 (Self-Existing)', creativePower: '형태 정의 · 측정', actionPrinciple: '아이디어를 현실적인 구조와 일정표로 설계하십시오.' },
  { toneNumber: 5, mayaToneName: 'Ho', toneNameKo: '배음적 톤 (Overtone)', creativePower: '권능 부여 · 지휘', actionPrinciple: '중심을 굳건히 잡고 내면의 지휘관을 깨우십시오.' },
  { toneNumber: 6, mayaToneName: 'Uak', toneNameKo: '율동적 톤 (Rhythmic)', creativePower: '유기적 균형 · 평등', actionPrinciple: '일상의 일과 쉼, 몸과 마음의 리듬을 조율하십시오.' },
  { toneNumber: 7, mayaToneName: 'Uuk', toneNameKo: '공명적 톤 (Resonant)', creativePower: '채널링 · 조율', actionPrinciple: '명상으로 마음을 가라앉히고 자연의 리듬을 살피십시오.' },
  { toneNumber: 8, mayaToneName: 'Uaxac', toneNameKo: '은하적 톤 (Galactic)', creativePower: '온전성 · 조화', actionPrinciple: '말과 행동이 일치하도록 진실하게 행동하십시오.' },
  { toneNumber: 9, mayaToneName: 'Bolan', toneNameKo: '태양적 톤 (Solar)', creativePower: '의도 맥동 · 실현', actionPrinciple: '가슴 깊은 열정으로 현실의 결과를 창출하십시오.' },
  { toneNumber: 10, mayaToneName: 'Lahun', toneNameKo: '행성적 톤 (Planetary)', creativePower: '현현 완성 · 생산', actionPrinciple: '그동안 다져온 노력을 실질적인 열매로 결실 맺으십시오.' },
  { toneNumber: 11, mayaToneName: 'Buluk', toneNameKo: '스펙트럼적 톤 (Spectral)', creativePower: '해방 · 정화와 방출', actionPrinciple: '더 이상 나를 돕지 않는 낡은 패턴을 시원하게 버리십시오.' },
  { toneNumber: 12, mayaToneName: 'Lahca', toneNameKo: '수정적 톤 (Crystal)', creativePower: '협력 · 원탁의 나눔', actionPrinciple: '뜻을 같이하는 동료들과 지혜를 공유하십시오.' },
  { toneNumber: 13, mayaToneName: 'Oxlahun', toneNameKo: '우주적 톤 (Cosmic)', creativePower: '초월 · 영원한 현존', actionPrinciple: '결과에 집착하지 않고 더 높은 차원으로 도약하십시오.' },
];

/**
 * 기준 앵커일: 2020년 1월 1일은 Kin 161 (붉은 배음의 용)
 * 이 앵커를 기준으로 일자 차이를 계산하여 1~260 킨을 산출합니다.
 */
function calculateKinForDate(d: Date): MayanKinReport {
  const anchorDate = Date.UTC(2020, 0, 1);
  const targetUtc = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const diffDays = Math.round((targetUtc - anchorDate) / 86400000);
  
  let kin = ((161 - 1 + diffDays) % 260);
  if (kin < 0) kin += 260;
  const kinNumber = kin + 1; // 1 ~ 260

  const sealIndex = (kinNumber - 1) % 20;
  const toneIndex = (kinNumber - 1) % 13;

  const seal = SOLAR_SEALS[sealIndex];
  const tone = GALACTIC_TONES[toneIndex];

  // 웨이브스펠 (13일의 주기) 첫 킨 찾기
  const wavespellFirstKin = kinNumber - toneIndex;
  const wavespellSealIndex = (wavespellFirstKin - 1) % 20;
  const wavespellSeal = SOLAR_SEALS[wavespellSealIndex >= 0 ? wavespellSealIndex : wavespellSealIndex + 20];
  const wavespellName = `${wavespellSeal.koreanName}의 13일 파동스펠`;

  const kinFullName = `Kin ${kinNumber}: ${seal.koreanName} · ${tone.toneNameKo}`;
  const cosmicDestinyGuidance = `[${seal.sacredKeywords}]의 본질을 [${tone.creativePower}]의 원리로 풀어내는 은하적 사명입니다. ${seal.lightGift}의 힘을 살려 오늘 ${tone.actionPrinciple}`;

  return {
    kinNumber,
    seal,
    tone,
    kinFullName,
    wavespellName,
    cosmicDestinyGuidance,
  };
}

export function calculateMayanTzolkinSacredCalendar(params: {
  profile?: UserProfile | null;
  targetDate?: Date;
}): MayanTzolkinReport {
  const now = params.targetDate || new Date();

  // 사용자 본명 킨 계산
  let birthDate = new Date(1990, 0, 1);
  if (params.profile?.basic?.birthdate) {
    const parts = params.profile.basic.birthdate.split('-');
    if (parts.length >= 3) {
      birthDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
  }

  const birthKin = calculateKinForDate(birthDate);
  const todayKin = calculateKinForDate(now);

  // 본명 킨과 오늘의 킨 은하 공명도 계산
  const toneDiff = Math.abs(birthKin.tone.toneNumber - todayKin.tone.toneNumber);
  const sealDiff = Math.abs(birthKin.seal.index - todayKin.seal.index);
  
  let resonance = 70;
  if (birthKin.seal.directionColor === todayKin.seal.directionColor) resonance += 15;
  if (toneDiff === 0) resonance += 12;
  if (sealDiff === 0) resonance = 99; // 킨 귀환일 (260일 주기)

  const galacticHarmonicResonanceScore = Math.min(99, Math.max(58, resonance));

  const dailyTzolkinMission = `오늘은 [${todayKin.kinFullName}]의 날입니다. ${todayKin.seal.directionColor}의 기운이 지배하며, [${todayKin.tone.actionPrinciple}]을 마음에 새길 때 우주의 동시성이 당신을 지지합니다.`;

  const sacredAltarAction = `오늘 창가나 책상에서 ${todayKin.seal.directionColor.split(' ')[0]} 방향을 3초간 바라보며, 호흡을 가다듬고 ${todayKin.seal.sacredKeywords}를 조용히 읊조리십시오.`;

  return {
    engineVersion: MAYAN_TZOLKIN_VERSION,
    calculatedAt: now.toISOString(),
    birthKin,
    todayKin,
    galacticHarmonicResonanceScore,
    dailyTzolkinMission,
    sacredAltarAction,
  };
}

export function formatMayanTzolkinSacredCalendarPrompt(report: MayanTzolkinReport): string {
  return `### 🌞 고대 마야 촐킨(Tzolk'in) 260일 신성력 20 나왈 & 13 은하 톤 엔진 (${MAYAN_TZOLKIN_VERSION})
- **내담자 본명 킨 (Birth Kin)**: [${report.birthKin.kinFullName}]
  - 속한 파동스펠: ${report.birthKin.wavespellName}
  - 은하적 사명과 잠재력: ${report.birthKin.cosmicDestinyGuidance}
- **오늘의 은하 킨 (Daily Kin)**: [${report.todayKin.kinFullName}]
  - 방위 및 색상: ${report.todayKin.seal.directionColor}
  - 오늘의 창조 파워: ${report.todayKin.tone.creativePower}
- **은하 공명 지수**: ${report.galacticHarmonicResonanceScore}점 / 100점
- **오늘의 촐킨 신성 미션**: ${report.dailyTzolkinMission}
- **마야 4방위 정렬 행동**: ${report.sacredAltarAction}`;
}

/**
 * =========================================================================
 * LUCKEY 북유럽 노르딕 룬 문자(Elder Futhark Runes) 24 엘더 푸사르크 & 3 애트(Aett) 운명 직조 엔진
 * (Nordic Elder Futhark Runes & Wyrd Weaving Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 기원후 2세기 고대 게르만 및 바이킹 문명의 성스러운 상징 체계인 24 엘더 푸사르크(Elder Futhark).
 * 세계수 위그드라실(Yggdrasil)과 운명의 세 여신 노른(Norns: 우르드·베르단디·스쿨드)의
 * 운명의 직조(Wyrd) 원리를 바탕으로 영혼의 근원, 현재의 시련, 미래의 개운을 통찰합니다.
 * 
 * 1. 24개 엘더 푸사르크 룬 & 3대 애트(Aett):
 *    - 프레이야의 애트 (Freyr's Aett 1~8): 창조, 풍요, 원초적 생명력 (페후, 우루즈, 투리사즈, 안수즈 등)
 *    - 헤임달의 애트 (Heimdall's Aett 9~16): 시련, 변혁, 내적 단련 (하갈라즈, 나우디즈, 이사, 제라 등)
 *    - 티르의 애트 (Tyr's Aett 17~24): 정의, 영적 성취, 완전한 통합 (티와즈, 베르카나, 에와즈, 만나즈 등)
 * 2. 노른 3대 운명 직조 (Urd-과거/원인, Verdandi-현재/작동, Skuld-미래/필연)
 * 3. 생년월일 수리 공명 룬 도출 및 맞춤 바인드룬(Bindrune) 영적 수호 부적 처방
 */

import type { UserProfile } from '../sharedState';

export const NORDIC_RUNES_VERSION = 'LUCKEY-NORDIC-RUNES-v2.0.0';

export interface RuneInfo {
  runeNumber: number;          // 1 ~ 24
  runeSymbol: string;          // 룬 문자 (ᚠ, ᚢ, ᚦ 등)
  runeName: string;            // 룬 명칭 (Fehu, Uruz 등)
  koreanName: string;          // 한글 표기 및 뜻
  aett: '프레이야의 애트 (창조와 풍요)' | '헤임달의 애트 (시련과 변혁)' | '티르의 애트 (정의와 초월)';
  elementalForce: string;      // 원소적 힘
  divineMeaning: string;       // 상징적 의미
  uprightInterpretation: string; // 정방향 은총 (조언)
  reversedWarning: string;     // 역방향 경계 (그림자)
  wyrdWeavingKeyword: string;  // 운명 직조 핵심어
}

export interface BindruneTalisman {
  talismanName: string;
  combinedRunes: string[];
  blessingEffect: string;
  activationMantra: string;
}

export interface NordicElderFutharkRunesReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  birthRune: RuneInfo;
  nornsTrio: {
    urdPast: RuneInfo;         // 과거의 뿌리 (원인)
    verdandiPresent: RuneInfo; // 현재의 파동 (행동)
    skuldFuture: RuneInfo;     // 미래의 결실 (가능성)
  };
  bindruneTalisman: BindruneTalisman;
  cosmicWyrdResonanceScore: number; // 0 ~ 100 위르드 운명 공명도
  yggdrasilNavigationGuidance: string;
  runesSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatRunesKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

function describeRunesStage(score: number): string {
  if (score >= 86) return '위르드 직조 공명(Wyrd Harmony) — 과거의 뿌리와 현재의 결단이 노른의 그물 위에서 자연스럽게 맞물리는 상승기';
  if (score >= 74) return '애트 균형 순환(Aett Circulation) — 바인드룬의 결속이 일상의 리듬을 안정적으로 지탱하는 조율기';
  return '노른 성찰(Norns Reflection) — 서두르지 않고 과거의 원인과 현재의 파동을 차분히 가다듬는 숙고기';
}

const ELDER_FUTHARK_LIST: RuneInfo[] = [
  // 1. 프레이야의 애트 (Freyr's Aett 1~8)
  {
    runeNumber: 1,
    runeSymbol: 'ᚠ',
    runeName: 'Fehu',
    koreanName: '페후 (가축·풍요)',
    aett: '프레이야의 애트 (창조와 풍요)',
    elementalForce: '원초의 대지와 불꽃',
    divineMeaning: '물질적 결실과 유동적 번영, 노력의 대가',
    uprightInterpretation: '성실히 땀 흘려 가꾼 결실이 손에 쥐어지는 시기입니다. 베풀수록 더 큰 부가 순환합니다.',
    reversedWarning: '재물에 대한 과도한 집착, 낭비벽, 손실의 위험을 경계하십시오.',
    wyrdWeavingKeyword: '순환하는 풍요',
  },
  {
    runeNumber: 2,
    runeSymbol: 'ᚢ',
    runeName: 'Uruz',
    koreanName: '우루즈 (야생들소·원초적 힘)',
    aett: '프레이야의 애트 (창조와 풍요)',
    elementalForce: '야생의 순수한 대지력',
    divineMeaning: '불굴의 체력, 생명력, 강인한 인내와 용기',
    uprightInterpretation: '어떤 난관도 돌파할 수 있는 강력한 활력과 회복력이 당신 내면에 차오르고 있습니다.',
    reversedWarning: '맹목적인 무모함, 통제되지 않는 분노, 건강 악화를 경계하십시오.',
    wyrdWeavingKeyword: '원초적 생명력',
  },
  {
    runeNumber: 3,
    runeSymbol: 'ᚦ',
    runeName: 'Thurisaz',
    koreanName: '투리사즈 (거인·가시·망치)',
    aett: '프레이야의 애트 (창조와 풍요)',
    elementalForce: '토르의 천둥과 불꽃',
    divineMeaning: '저항의 분쇄, 보호의 가시, 결단 전의 신중함',
    uprightInterpretation: '방해물을 제거하고 자신을 지키는 강력한 힘이 있습니다. 행동하기 전 반드시 침착하게 관찰하십시오.',
    reversedWarning: '성급한 공격성, 자기 파괴적 충동, 방어기제의 과잉 작동을 경계하십시오.',
    wyrdWeavingKeyword: '보호와 돌파',
  },
  {
    runeNumber: 4,
    runeSymbol: 'ᚨ',
    runeName: 'Ansuz',
    koreanName: '안수즈 (오딘의 신성한 지혜·소통)',
    aett: '프레이야의 애트 (창조와 풍요)',
    elementalForce: '신성한 영적 숨결(바람)',
    divineMeaning: '영감, 진실한 언어, 스승의 조언, 통찰력',
    uprightInterpretation: '명확한 소통과 신뢰할 수 있는 멘토의 조언을 통해 진실을 깨닫고 지혜를 확장할 때입니다.',
    reversedWarning: '거짓 정보, 오해와 왜곡, 말실수로 인한 분란을 경계하십시오.',
    wyrdWeavingKeyword: '신성한 영감과 소통',
  },
  {
    runeNumber: 5,
    runeSymbol: 'ᚱ',
    runeName: 'Raidho',
    koreanName: '라이도 (바퀴·여정·올바른 질서)',
    aett: '프레이야의 애트 (창조와 풍요)',
    elementalForce: '운행하는 천공의 질서',
    divineMeaning: '영적·물리적 여정, 리듬의 회복, 정의로운 규범',
    uprightInterpretation: '인생의 바퀴가 올바른 궤도로 움직입니다. 주저하지 말고 새로운 길로 나아가십시오.',
    reversedWarning: '방향 상실, 이동 중단, 원칙 없는 타협을 경계하십시오.',
    wyrdWeavingKeyword: '바른 길과 여정',
  },
  {
    runeNumber: 6,
    runeSymbol: 'ᚲ',
    runeName: 'Kenaz',
    koreanName: '케나즈 (횃불·창조의 불꽃)',
    aett: '프레이야의 애트 (창조와 풍요)',
    elementalForce: '밝히는 지혜의 불꽃',
    divineMeaning: '어둠을 밝히는 명석함, 예술적 창조성, 열정',
    uprightInterpretation: '어두웠던 문제가 환하게 밝혀지고 탁월한 아이디어가 솟구칩니다. 창작과 탐구에 몰입하십시오.',
    reversedWarning: '열정의 고갈, 오만함으로 인한 실명, 무기력을 경계하십시오.',
    wyrdWeavingKeyword: '깨달음의 횃불',
  },
  {
    runeNumber: 7,
    runeSymbol: 'ᚷ',
    runeName: 'Gebo',
    koreanName: '게보 (선물·동등한 교환·파트너십)',
    aett: '프레이야의 애트 (창조와 풍요)',
    elementalForce: '조화로운 대기와 바람',
    divineMeaning: '은혜의 상호교환, 동등한 동맹, 관대함과 화합',
    uprightInterpretation: '서로의 자유와 존엄을 인정하는 깊은 신뢰와 훌륭한 파트너십이 결실을 맺습니다.',
    reversedWarning: '불공정한 거래, 과도한 희생, 의존적 관계의 덫을 경계하십시오.',
    wyrdWeavingKeyword: '신성한 선물과 교환',
  },
  {
    runeNumber: 8,
    runeSymbol: 'ᚹ',
    runeName: 'Wunjo',
    koreanName: '운조 (기쁨·환희·조화로운 완성)',
    aett: '프레이야의 애트 (창조와 풍요)',
    elementalForce: '빛나는 조화의 온기',
    divineMeaning: '마음의 평화, 소원 성취, 축제와 안식',
    uprightInterpretation: '오랜 갈등이 가라앉고 충만한 기쁨과 화목이 깃듭니다. 현재의 행복을 온전히 누리십시오.',
    reversedWarning: '일시적 쾌락에의 탐닉, 환상에 젖은 방심을 경계하십시오.',
    wyrdWeavingKeyword: '충만한 환희',
  },

  // 2. 헤임달의 애트 (Heimdall's Aett 9~16)
  {
    runeNumber: 9,
    runeSymbol: 'ᚺ',
    runeName: 'Hagalaz',
    koreanName: '하갈라즈 (우박·불가항력적 파괴)',
    aett: '헤임달의 애트 (시련과 변혁)',
    elementalForce: '얼어붙은 물과 폭풍',
    divineMeaning: '낡은 구조의 붕괴, 급작스러운 시련, 근원적 정화',
    uprightInterpretation: '통제할 수 없는 변화가 찾아오지만, 이는 낡고 썩은 판을 부수고 새 터전을 마련하는 필연입니다.',
    reversedWarning: '피할 수 없는 변화에 대한 맹목적 저항과 절망을 경계하십시오.',
    wyrdWeavingKeyword: '해체와 정화',
  },
  {
    runeNumber: 10,
    runeSymbol: 'ᚾ',
    runeName: 'Nauthiz',
    koreanName: '나우디즈 (결핍·필요·내적 저력)',
    aett: '헤임달의 애트 (시련과 변혁)',
    elementalForce: '마찰 속에서 피어나는 불',
    divineMeaning: '제약과 결핍, 인내의 불꽃, 위기를 기회로 바꾸는 힘',
    uprightInterpretation: '제약과 궁핍이 오히려 당신의 가장 단단한 내적 힘을 깨웁니다. 불필요한 군더더기를 깎아내십시오.',
    reversedWarning: '자기 연민, 피해의식, 궁핍에 굴복하는 나약함을 경계하십시오.',
    wyrdWeavingKeyword: '시련 속의 단련',
  },
  {
    runeNumber: 11,
    runeSymbol: 'ᛁ',
    runeName: 'Isa',
    koreanName: '이사 (얼음·정지·깊은 동결)',
    aett: '헤임달의 애트 (시련과 변혁)',
    elementalForce: '절대적 영도의 얼음',
    divineMeaning: '움직임의 멈춤, 침묵과 관조, 내면으로의 집중',
    uprightInterpretation: '지금은 무리하게 전진할 때가 아닙니다. 얼음 밑에서 씨앗이 봄을 기다리듯 고요히 응축하십시오.',
    reversedWarning: '냉담함, 무감각, 고립되어 타인을 밀어내는 태도를 경계하십시오.',
    wyrdWeavingKeyword: '고요한 응축',
  },
  {
    runeNumber: 12,
    runeSymbol: 'ᛃ',
    runeName: 'Jera',
    koreanName: '제라 (수확·한 해의 순환·때의 무르익음)',
    aett: '헤임달의 애트 (시련과 변혁)',
    elementalForce: '순환하는 비옥한 대지',
    divineMeaning: '노력의 보답, 자연스러운 계절의 완성, 성취',
    uprightInterpretation: '서두르지 않아도 뿌린 대로 거두게 됩니다. 시간의 순리를 믿고 마무리에 정성을 다하십시오.',
    reversedWarning: '조급증으로 설익은 열매를 따려는 충동을 경계하십시오.',
    wyrdWeavingKeyword: '자연스러운 수확',
  },
  {
    runeNumber: 13,
    runeSymbol: 'ᛇ',
    runeName: 'Eihwaz',
    koreanName: '에이와즈 (주목나무·위그드라실·불멸)',
    aett: '헤임달의 애트 (시련과 변혁)',
    elementalForce: '깊은 뿌리와 천공의 수액',
    divineMeaning: '인내와 불굴의 척추, 삶과 죽음의 문턱을 넘는 변용',
    uprightInterpretation: '흔들리지 않는 굳건한 중심을 잡으십시오. 오랜 시련을 견뎌낸 자만이 가장 높은 지혜를 얻습니다.',
    reversedWarning: '경직된 완고함, 과거의 트라우마에 얽매이는 태도를 경계하십시오.',
    wyrdWeavingKeyword: '불굴의 인내',
  },
  {
    runeNumber: 14,
    runeSymbol: 'ᛈ',
    runeName: 'Perthro',
    koreanName: '페르트로 (다이스 컵·운명의 주사위·비의)',
    aett: '헤임달의 애트 (시련과 변혁)',
    elementalForce: '비밀스러운 심연의 물',
    divineMeaning: '감추어진 진실의 드러남, 운명의 도약, 직관',
    uprightInterpretation: '베일에 싸여 있던 진실이 드러나고 뜻밖의 기회가 찾아옵니다. 자신의 영적 직관을 신뢰하십시오.',
    reversedWarning: '도박적 과욕, 비밀 누설, 헛된 환상에 휘둘림을 경계하십시오.',
    wyrdWeavingKeyword: '비밀의 개방과 행운',
  },
  {
    runeNumber: 15,
    runeSymbol: 'ᛉ',
    runeName: 'Algiz',
    koreanName: '알기즈 (엘크의 뿔·성스러운 보호·연결)',
    aett: '헤임달의 애트 (시련과 변혁)',
    elementalForce: '수호하는 신성한 영기',
    divineMeaning: '신성한 보호막, 영적 안테나, 위험의 사전 감지',
    uprightInterpretation: '당신은 상위 차원의 신성한 보호를 받고 있습니다. 직관적 경고에 귀 기울이며 높은 이상을 추구하십시오.',
    reversedWarning: '무방비한 순진함, 경계심 해제로 인한 침범 허용을 경계하십시오.',
    wyrdWeavingKeyword: '신성한 수호',
  },
  {
    runeNumber: 16,
    runeSymbol: 'ᛊ',
    runeName: 'Sowilo',
    koreanName: '소윌로 (승리의 태양·눈부신 광채)',
    aett: '헤임달의 애트 (시련과 변혁)',
    elementalForce: '승리의 황금빛 태양',
    divineMeaning: '완전한 성공, 영혼의 에너지, 생명력의 절정',
    uprightInterpretation: '태양이 구름을 뚫고 솟아오릅니다. 승리와 명예가 눈앞에 있으니 주저 없이 전력을 다하십시오.',
    reversedWarning: '에너지 과열로 인한 번아웃, 독선적 자기과시를 경계하십시오.',
    wyrdWeavingKeyword: '승리의 태양',
  },

  // 3. 티르의 애트 (Tyr's Aett 17~24)
  {
    runeNumber: 17,
    runeSymbol: 'ᛏ',
    runeName: 'Tiwaz',
    koreanName: '티와즈 (전신 티르의 검·정의·대의)',
    aett: '티르의 애트 (정의와 초월)',
    elementalForce: '북극성의 부동하는 빛',
    divineMeaning: '흔들리지 않는 정의, 용기 있는 희생, 궁극적 승리',
    uprightInterpretation: '사사로운 이익을 넘어 대의와 원칙을 지킬 때 반드시 승리합니다. 북극성처럼 기준을 세우십시오.',
    reversedWarning: '불필요한 고집, 대의 없는 독단적 투쟁, 기력 소모를 경계하십시오.',
    wyrdWeavingKeyword: '정의로운 승리',
  },
  {
    runeNumber: 18,
    runeSymbol: 'ᛒ',
    runeName: 'Berkana',
    koreanName: '베르카나 (자작나무·어머니 대지·재생)',
    aett: '티르의 애트 (정의와 초월)',
    elementalForce: '생명을 잉태하는 흙',
    divineMeaning: '새로운 탄생, 부드러운 양육, 치유와 번식',
    uprightInterpretation: '새로운 프로젝트나 관계가 싹을 틔웁니다. 서두르지 말고 따뜻한 애정으로 보살펴 키우십시오.',
    reversedWarning: '과도한 간섭, 성장의 지체, 가족 간의 불화를 경계하십시오.',
    wyrdWeavingKeyword: '자애로운 양육과 탄생',
  },
  {
    runeNumber: 19,
    runeSymbol: 'ᛖ',
    runeName: 'Ehwaz',
    koreanName: '에와즈 (성스러운 말·신뢰와 동행)',
    aett: '티르의 애트 (정의와 초월)',
    elementalForce: '달리는 대지와 바람',
    divineMeaning: '신뢰하는 파트너와의 협력, 조화로운 전진, 도약',
    uprightInterpretation: '말과 기수가 하나 되듯 신뢰할 수 있는 동반자와 완벽한 호흡을 맞추며 가파른 도약을 이룹니다.',
    reversedWarning: '파트너 간의 불신, 엇박자 행보, 성급한 질주를 경계하십시오.',
    wyrdWeavingKeyword: '신뢰의 동행과 도약',
  },
  {
    runeNumber: 20,
    runeSymbol: 'ᛗ',
    runeName: 'Mannaz',
    koreanName: '만나즈 (인간·공동체·자의식의 고양)',
    aett: '티르의 애트 (정의와 초월)',
    elementalForce: '지혜로운 영혼의 호흡',
    divineMeaning: '인간 본연의 존엄, 협력과 연대, 자기 성찰',
    uprightInterpretation: '겸손한 자세로 공동체와 연대하고 자기 내면을 성찰하십시오. 사람을 얻는 것이 가장 큰 자산입니다.',
    reversedWarning: '고립, 오만, 타인을 도구로 여기는 비정함을 경계하십시오.',
    wyrdWeavingKeyword: '인간 존엄과 연대',
  },
  {
    runeNumber: 21,
    runeSymbol: 'ᛚ',
    runeName: 'Laguz',
    koreanName: '라구즈 (물·바다·흐름과 직관)',
    aett: '티르의 애트 (정의와 초월)',
    elementalForce: '깊고 유연한 생명수',
    divineMeaning: '무의식의 지혜, 유연한 흐름, 예술적 영감',
    uprightInterpretation: '저항하지 말고 삶의 흐름에 몸을 맡기십시오. 깊은 무의식에서 길어 올린 직관이 답을 줍니다.',
    reversedWarning: '감정적 혼란에 휩쓸림, 무력한 체념, 현실 감각 마비를 경계하십시오.',
    wyrdWeavingKeyword: '유연한 직관의 바다',
  },
  {
    runeNumber: 22,
    runeSymbol: 'ᛜ',
    runeName: 'Ingwaz',
    koreanName: '잉와즈 (대지의 신 잉그·씨앗·완성과 휴식)',
    aett: '티르의 애트 (정의와 초월)',
    elementalForce: '씨앗을 품은 겨울 대지',
    divineMeaning: '한 주기의 완결, 잠재력의 내적 저장, 온전한 해방',
    uprightInterpretation: '하나의 중대한 주기가 성공적으로 마무리되었습니다. 에너지를 온전히 갈무리하고 다음 도약을 준비하십시오.',
    reversedWarning: '미완성 상태에서의 방치, 내적 충전 없는 무리한 재출발을 경계하십시오.',
    wyrdWeavingKeyword: '완결과 씨앗의 응축',
  },
  {
    runeNumber: 23,
    runeSymbol: 'ᛞ',
    runeName: 'Dagaz',
    koreanName: '다가즈 (새벽·대낮의 빛·양자적 도약)',
    aett: '티르의 애트 (정의와 초월)',
    elementalForce: '어둠을 가르는 찬란한 여명',
    divineMeaning: '극적인 패러다임 전환, 어둠에서 빛으로의 도약, 각성',
    uprightInterpretation: '기나긴 밤이 지나고 찬란한 여명이 밝았습니다. 낡은 한계가 한순간에 무너지고 새로운 현실이 열립니다.',
    reversedWarning: '눈부신 변화에 대한 두려움, 과거의 어둠으로 되돌아가려는 미련을 경계하십시오.',
    wyrdWeavingKeyword: '여명의 각성과 대전환',
  },
  {
    runeNumber: 24,
    runeSymbol: 'ᛟ',
    runeName: 'Othala',
    koreanName: '오탈라 (조상의 유산·영토·영적 고향)',
    aett: '티르의 애트 (정의와 초월)',
    elementalForce: '뿌리 깊은 가문의 대지',
    divineMeaning: '조상의 지혜, 진정한 소속감, 물질적·영적 유산',
    uprightInterpretation: '자신의 뿌리와 진정한 소속을 확인하십시오. 조상과 선대의 유산이 당신의 든든한 반석이 되어 줍니다.',
    reversedWarning: '낡은 관습과 가부장적 억압, 과거 유산에 얽매여 현재를 놓침을 경계하십시오.',
    wyrdWeavingKeyword: '뿌리와 신성한 유산',
  },
];

export function calculateNordicElderFutharkRunes(params: {
  profile?: UserProfile | null;
  targetDate?: Date;
  question?: string;
}): NordicElderFutharkRunesReport {
  const now = params.targetDate || new Date();

  // 1. 출생 룬 (Birth Rune) 산출: 생년월일 수비학 해시
  let birthIndex = 0;
  if (params.profile?.basic?.birthdate) {
    const parts = params.profile.basic.birthdate.split('-');
    if (parts.length >= 3) {
      const y = parseInt(parts[0], 10) || 1990;
      const m = parseInt(parts[1], 10) || 1;
      const d = parseInt(parts[2], 10) || 1;
      const dayOfYear = Math.floor((m - 1) * 30.5 + d);
      // 1년 24개 절기/룬 기간 (약 15.2일 단위)
      birthIndex = Math.floor(((dayOfYear + y % 24) % 365.25) / (365.25 / 24)) % 24;
    }
  } else {
    birthIndex = (now.getUTCDate() + now.getUTCMonth() * 2) % 24;
  }
  const birthRune = ELDER_FUTHARK_LIST[birthIndex];

  // 2. 노른(Norns) 3대 운명 직조
  // Verdandi (현재): 오늘 일자와 시간 기반
  const nowDayOfYear = Math.floor((now.getUTCMonth()) * 30.5 + now.getUTCDate());
  const nowHour = now.getUTCHours();
  const verdandiIndex = Math.floor((nowDayOfYear * 24 + nowHour) % 24);
  const verdandiPresent = ELDER_FUTHARK_LIST[verdandiIndex];

  // Urd (과거의 원인/뿌리): 출생 룬과 현재 룬의 결합 역학
  const urdIndex = (birthIndex + 24 - (verdandiIndex % 8)) % 24;
  const urdPast = ELDER_FUTHARK_LIST[urdIndex];

  // Skuld (미래의 결실/필연): 현재와 과거의 조화 벡터
  const skuldIndex = (verdandiIndex + (birthIndex % 7) + 1) % 24;
  const skuldFuture = ELDER_FUTHARK_LIST[skuldIndex];

  // 3. 맞춤 바인드룬(Bindrune) 수호 탈리스만 조합
  // 출생 룬의 힘 + 현재 필요한 돌파 룬(소윌로/알기즈/티와즈 중 하나)
  const complementarySymbol = birthRune.runeSymbol;
  const transitSymbol = verdandiPresent.runeSymbol;
  const talismanName = `위그드라실 신성 결속 룬 [${birthRune.runeName} ᛭ ${verdandiPresent.runeName}]`;
  const combinedRunes = [birthRune.runeSymbol, verdandiPresent.runeSymbol, skuldFuture.runeSymbol];
  const blessingEffect = `${birthRune.divineMeaning}의 선천적 토대 위에 ${verdandiPresent.wyrdWeavingKeyword}의 시의적절한 기운을 결합하여, 궁극적으로 ${skuldFuture.koreanName}의 결실을 이끌어내는 강력한 수호와 도약의 파동입니다.`;
  const activationMantra = `Alu Uthark Wyrd - ${birthRune.runeName} ${verdandiPresent.runeName} ${skuldFuture.runeName}`;

  const bindruneTalisman: BindruneTalisman = {
    talismanName,
    combinedRunes,
    blessingEffect,
    activationMantra,
  };

  // 4. 위르드(Wyrd) 운명 공명도 계산
  const dist1 = Math.min(Math.abs(birthIndex - verdandiIndex), 24 - Math.abs(birthIndex - verdandiIndex));
  const dist2 = Math.min(Math.abs(verdandiIndex - skuldIndex), 24 - Math.abs(verdandiIndex - skuldIndex));
  const cosmicWyrdResonanceScore = Math.max(65, Math.min(99, 96 - (dist1 + dist2) * 2));

  const yggdrasilNavigationGuidance = `운명의 세 여신 노른이 짜놓은 그물(Wyrd)에서 과거의 뿌리는 [${urdPast.koreanName}], 지금 작동하는 파동은 [${verdandiPresent.koreanName}], 향후 열릴 가능성은 [${skuldFuture.koreanName}]입니다. ${verdandiPresent.uprightInterpretation} 다만 ${verdandiPresent.reversedWarning}`;

  const calculatedAtKst = formatRunesKstTimestamp(now);
  const runesSynthesisMatrix = {
    dominantTension: `${birthRune.koreanName} ↔ ${verdandiPresent.koreanName}`,
    alignmentState: describeRunesStage(cosmicWyrdResonanceScore),
    integratedAction: `${verdandiPresent.uprightInterpretation}${params.question?.trim() ? ` [질문 맥락: ${params.question.trim()}]` : ''}`,
  };

  return {
    engineVersion: NORDIC_RUNES_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    birthRune,
    nornsTrio: {
      urdPast,
      verdandiPresent,
      skuldFuture,
    },
    bindruneTalisman,
    cosmicWyrdResonanceScore,
    yggdrasilNavigationGuidance,
    runesSynthesisMatrix,
  };
}

export function formatNordicElderFutharkRunesPrompt(report: NordicElderFutharkRunesReport): string {
  const lines = [
    `### ᚱ 북유럽 24 엘더 푸사르크 룬 & 노른 운명 직조 엔진 (${NORDIC_RUNES_VERSION})`,
    `- **연산 시각**: ${report.calculatedAtKst} | **위르드 공명 국면**: ${describeRunesStage(report.cosmicWyrdResonanceScore)}`,
    `- **선천 본명 룬**: ${report.birthRune.runeSymbol} ${report.birthRune.koreanName} [${report.birthRune.aett}]`,
    `  - 본질 원소 / 상징: ${report.birthRune.elementalForce} · ${report.birthRune.divineMeaning}`,
    `- **노른 3대 운명 직조 (Wyrd Trio)**:`,
    `  - 과거의 뿌리(우르드): ${report.nornsTrio.urdPast.runeSymbol} ${report.nornsTrio.urdPast.koreanName} (${report.nornsTrio.urdPast.wyrdWeavingKeyword})`,
    `  - 현재의 파동(베르단디): ${report.nornsTrio.verdandiPresent.runeSymbol} ${report.nornsTrio.verdandiPresent.koreanName} (${report.nornsTrio.verdandiPresent.wyrdWeavingKeyword})`,
    `  - 미래의 필연(스쿨드): ${report.nornsTrio.skuldFuture.runeSymbol} ${report.nornsTrio.skuldFuture.koreanName} (${report.nornsTrio.skuldFuture.wyrdWeavingKeyword})`,
    `- **위그드라실 맞춤 바인드룬 탈리스만**: ${report.bindruneTalisman.talismanName} (${report.bindruneTalisman.combinedRunes.join(' + ')})`,
    `  - 결속 은총: ${report.bindruneTalisman.blessingEffect}`,
    `- **노른의 영혼 항해 지침**: ${report.yggdrasilNavigationGuidance}`,
  ];
  if (report.runesSynthesisMatrix) {
    lines.push(
      `- **교차 매트릭스**: [핵심 긴장: ${report.runesSynthesisMatrix.dominantTension} | 조율 상태: ${report.runesSynthesisMatrix.alignmentState}]`,
      `- **통합 실천**: ${report.runesSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}

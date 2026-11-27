/**
 * 동양 비전 마의도사 《마의상법(麻衣相法)》 12궁 관상 & 상유심생(相由心生) 심상합일 기색 투시 엔진
 *
 * LUCKEY-MAYI-MIANXIANG-v1.0.0
 *
 * 송대(宋代) 화산(華山)의 신선 마의도사(麻衣道者)가 전수하고 진희이(陳希夷) 선생이 주해한
 * 동양 최고(最古)이자 권위의 관상학 원전 《마의상법(麻衣相法)》에 기반한 12궁 기색 및 심상(心相) 결정론 엔진.
 *
 * [핵심 이론 및 수리 모델]
 * 1. 12궁(十二宮):
 *    - 명궁(命宮, 인당): 운명의 총체적 중심, 소원 성취의 문, 영적 안목
 *    - 재백궁(財帛宮, 준두/비강): 재물과 경제적 결실, 부의 축적력
 *    - 형제궁(兄弟宮, 눈썹): 동료와 협력자 간의 신의, 네트워크
 *    - 전택궁(田宅宮, 상안검 눈꺼풀): 부동산, 거처의 안식, 심신의 여유
 *    - 남녀궁(男女宮, 와잠): 창조적 결실, 생명력, 대인 감수성
 *    - 노복궁(奴僕宮, 하악 지각): 지지 세력, 후배와 팀원의 조력, 기반의 견고함
 *    - 처첩궁(妻妾宮/배우자궁, 어미간문): 애정운과 배우자와의 영혼 결속력
 *    - 질액궁(疾厄宮, 산근): 건강 면역력, 신체 회복 탄력성, 흉살 방어
 *    - 천이궁(遷移宮, 역마 이마 양단): 이동, 이사, 해외 진출, 환경 적응력
 *    - 관록궁(官祿宮, 중정 이마 중심): 직업적 성취, 사회적 명예, 공적 승진
 *    - 복덕궁(福德宮, 천창/눈썹 상단): 조상의 음덕, 내면의 행복, 정신적 풍요
 *    - 부모궁(父母宮, 일각/월각): 윗사람의 후원, 가문의 은혜, 귀인 인연
 * 2. 상유심생(相由心生):
 *    - "有心無相 相逐心生, 有相無心 相隨心滅" (마음이 있고 상이 부족해도 상은 마음을 따라 피어나고, 상이 좋아도 마음에 덕이 없으면 상 또한 마음을 따라 소멸한다).
 * 3. 5관(五官) 및 3대 길조 기색(氣色):
 *    - 자색(紫, 지존의 은혜)·황금색(黃, 재물과 복덕)·홍색(紅, 경사와 성취)의 조화.
 */

import type { UserProfile } from '../sharedState';

export const MAYI_MIANXIANG_VERSION = '2.5.0';

export interface MayiMianxiangReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  // 관상 5대 수리 지표 (내부 호환용 0~100, 프롬프트 비노출)
  innerHeartMorphologyResonance: number; // 상유심생(相由心生) 심상-골격 일치도
  qiAuraLuminosityScore: number; // 자황홍(紫黃紅) 3대 길상 기색 광채
  twelvePalacesEquilibriumIndex: number; // 12궁 기운 균형도
  fiveFeaturesVitalityForce: number; // 5관(귀·눈·입·코·눈썹) 통섭력
  yintangManifestationPower: number; // 명궁 인당(印堂) 소원 실현 투과율
  // 12궁 핵심 진단
  primaryPalace: {
    nameKo: string;
    hanja: string;
    anatomicalLocation: string;
    destinyDomain: string;
    auspiciousQiColor: string;
  };
  secondaryPalace: {
    nameKo: string;
    hanja: string;
    blessingAdvice: string;
  };
  situationalMayiAudit: {
    focusTheme: string;
    heartMindNote: string;
    expressionPractice: string;
  };
  temporalMayiRhythm: {
    kstTimeLabel: string;
    yintangWatchWindow: string;
    seasonalQiColorTone: string;
    temporalGuidance: string;
  };
  mayiSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
    mayiCrossAxis: string;
  };
  mayiDaoistMorphologicalAdvice: string;
  boundaryNotice: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const TWELVE_PALACES = [
  {
    nameKo: '명궁 (命宮)',
    hanja: '命宮',
    anatomicalLocation: '양 눈썹 사이 인당(印堂)',
    destinyDomain: '운명의 총체적 관문 및 소원 성취력',
    auspiciousQiColor: '자황색(紫黃色) - 은은한 자줏빛과 황금빛 서기'
  },
  {
    nameKo: '관록궁 (官祿宮)',
    hanja: '官祿宮',
    anatomicalLocation: '이마 정중앙 중정(中正)',
    destinyDomain: '사회적 직위, 사업적 성공 및 명예운',
    auspiciousQiColor: '홍황색(紅黃色) - 맑고 화사한 붉은빛과 금빛'
  },
  {
    nameKo: '재백궁 (財帛宮)',
    hanja: '財帛宮',
    anatomicalLocation: '코끝 준두 및 콧망울 난대·정위',
    destinyDomain: '정재와 편재, 자산 축적 및 금전 흐름',
    auspiciousQiColor: '진황색(眞黃色) - 기름을 바른 듯 윤택한 황금색'
  },
  {
    nameKo: '전택궁 (田宅宮)',
    hanja: '田宅宮',
    anatomicalLocation: '눈썹과 눈 사이 눈꺼풀 상안검',
    destinyDomain: '부동산 자산, 거처의 안정 및 가족 화목',
    auspiciousQiColor: '청명황색(淸明黃色) - 맑고 티 없는 깨끗한 빛'
  },
  {
    nameKo: '복덕궁 (福德宮)',
    hanja: '福德宮',
    anatomicalLocation: '이마 양옆 천창(天倉)',
    destinyDomain: '조상의 음덕, 정신적 평안 및 여유',
    auspiciousQiColor: '자색(紫色) - 신비롭고 고귀한 자줏빛 기운'
  },
  {
    nameKo: '천이궁 (遷移宮)',
    hanja: '遷移宮',
    anatomicalLocation: '이마 상단 좌우 가장자리 역마(驛馬)',
    destinyDomain: '이사, 여행, 해외 진출 및 신규 영역 확장',
    auspiciousQiColor: '홍색(紅色) - 역동적으로 뻗어나가는 붉은 기운'
  },
  {
    nameKo: '처첩궁 (妻妾宮)',
    hanja: '妻妾宮',
    anatomicalLocation: '눈꼬리 바깥쪽 어미간문(魚尾奸門)',
    destinyDomain: '배우자 및 연인과의 신뢰, 인연의 결속',
    auspiciousQiColor: '도화담홍색(桃花淡紅色) - 부드럽고 따스한 복숭앗빛'
  },
  {
    nameKo: '형제궁 (兄弟宮)',
    hanja: '兄弟宮',
    anatomicalLocation: '좌우 눈썹 전체(保壽官)',
    destinyDomain: '형제, 동료, 파트너 간의 의리와 협력',
    auspiciousQiColor: '취록자색(翠綠紫色) - 대나무 잎처럼 푸르고 싱그러운 빛'
  },
  {
    nameKo: '남녀궁 (男女宮)',
    hanja: '男女宮',
    anatomicalLocation: '눈 아래 살집 와잠(臥蠶)',
    destinyDomain: '창작물, 자녀운, 활발한 생명 에너지',
    auspiciousQiColor: '윤택황색(潤澤黃色) - 누에가 누워 있듯 도톰하고 밝은 금빛'
  },
  {
    nameKo: '노복궁 (奴僕宮)',
    hanja: '奴僕宮',
    anatomicalLocation: '아래턱 지각(地閣) 및 턱선',
    destinyDomain: '후배와 지지자의 조력, 사회적 기반 안정',
    auspiciousQiColor: '백황색(白黃色) - 묵직하고 단단한 은백황금색'
  },
  {
    nameKo: '질액궁 (疾厄宮)',
    hanja: '疾厄宮',
    anatomicalLocation: '콧등 시작점 산근(山根)',
    destinyDomain: '신체 저항력, 질병 면역력 및 난관 돌파력',
    auspiciousQiColor: '홍윤색(紅潤色) - 혈색이 투명하게 비치는 건강한 붉은기'
  },
  {
    nameKo: '부모궁 (父母宮)',
    hanja: '父母宮',
    anatomicalLocation: '이마 좌우 상단 일각(日角)·월각(月角)',
    destinyDomain: '부모의 가호, 상사의 신임 및 귀인 후원',
    auspiciousQiColor: '광휘황색(光輝黃色) - 해와 달처럼 온화하게 빛나는 빛'
  }
];

function getTemporalMayiRhythm(now: Date) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const yintangWatchWindow =
    hour >= 5 && hour < 11
      ? '인당(印堂) 아침 서광창 — 미간을 펴고 맑은 숨으로 하루의 첫 기색을 여는 시간'
      : hour >= 11 && hour < 17
        ? '중정(中正) 정오 소통창 — 온화한 눈빛과 또렷한 언행으로 신뢰를 쌓는 시간'
        : hour >= 17 && hour < 22
          ? '지각(地閣) 황혼 안정창 — 긴장을 풀고 편안한 미소로 대인 조화를 다지는 시간'
          : '심상(心相) 심야 정화창 — 마음의 번뇌를 비워 내일의 맑은 기색을 기르는 시간';

  const seasonalQiColorTone =
    month >= 3 && month <= 5
      ? '봄 · 청명취록(淸明翠綠) 기색 (싱그러운 생기와 새로운 인연이 트이는 시기)'
      : month >= 6 && month <= 8
        ? '여름 · 홍윤화색(紅潤和色) 기색 (활력과 따뜻한 소통이 빛나는 시기)'
        : month >= 9 && month <= 11
          ? '가을 · 진황윤택(眞黃潤澤) 기색 (안정된 결실과 신뢰가 두터워지는 시기)'
          : '겨울 · 자황응축(紫黃凝縮) 기색 (내면의 고요한 품격이 깊어지는 시기)';

  return {
    kstTimeLabel: `${y}-${m}-${d}T${hh}:${mm}:00+09:00 (KST)`,
    yintangWatchWindow,
    seasonalQiColorTone,
    temporalGuidance: `${yintangWatchWindow} · ${seasonalQiColorTone}의 흐름에 맞추어 상유심생(相由心生)의 여유를 지키십시오.`,
  };
}

export function calculateMayiMianxiang(
  profile: UserProfile | null | undefined,
  nowArg?: Date,
  questionArg?: string
): MayiMianxiangReport {
  const now = nowArg || new Date();
  const question = (questionArg || '').trim();
  const birthStr = profile?.basic?.birthdate || '1995-01-01';
  const nameStr = profile?.basic?.name || '내담자';
  const timeStr = profile?.basic?.birthtime || '12:00';

  const seed = djb2Hash(`${birthStr}_${nameStr}_${timeStr}_${question}_mayi_mianxiang_v2`);

  const innerHeartMorphologyResonance = 65 + (seed % 34);
  const qiAuraLuminosityScore = 62 + ((seed >> 2) % 37);
  const twelvePalacesEquilibriumIndex = 60 + ((seed >> 4) % 39);
  const fiveFeaturesVitalityForce = 64 + ((seed >> 6) % 35);
  const yintangManifestationPower = 63 + ((seed >> 8) % 36);

  const primaryIdx = seed % TWELVE_PALACES.length;
  let secondaryIdx = (seed >> 3) % TWELVE_PALACES.length;
  if (secondaryIdx === primaryIdx) {
    secondaryIdx = (primaryIdx + 1) % TWELVE_PALACES.length;
  }

  const primaryPalace = TWELVE_PALACES[primaryIdx];
  const secondaryPalace = {
    nameKo: TWELVE_PALACES[secondaryIdx].nameKo,
    hanja: TWELVE_PALACES[secondaryIdx].hanja,
    blessingAdvice: `${TWELVE_PALACES[secondaryIdx].destinyDomain} 분야에서 숨겨진 귀인의 조력이 발동되어 기반이 더욱 견고해집니다.`
  };

  let mayiDaoistMorphologicalAdvice = '';
  if (innerHeartMorphologyResonance >= 85) {
    mayiDaoistMorphologicalAdvice = '상유심생(相由心生)의 위대한 조화가 당신의 기색에 만개해 있습니다. 마음속에 품은 선한 의지와 확신이 얼굴 전체의 12궁에 황금빛 자색 서기(紫氣)를 피워 올리니, 어떤 난관도 당신의 복덕을 꺾을 수 없습니다.';
  } else if (qiAuraLuminosityScore >= 80) {
    mayiDaoistMorphologicalAdvice = '명궁(인당)과 재백궁에 은은한 길상 기색이 머물고 있습니다. 불필요한 미간 찌푸림이나 불안을 내려놓고 입꼬리를 살짝 올려 미소를 머금으면, 복덕이 두 배로 증폭되어 찾아옵니다.';
  } else {
    mayiDaoistMorphologicalAdvice = '골상(骨相)보다 중요한 것은 심상(心相)입니다. 매일 밤 잠들기 전 감사의 마음을 품고 고요히 호흡을 정돈하십시오. 마음에 덕이 쌓이면 얼굴의 어두운 그늘이 저절로 걷히고 맑은 서광이 비추게 됩니다.';
  }

  const temporalMayiRhythm = getTemporalMayiRhythm(now);
  const situationalMayiAudit = /관계|연애|사람|소통|면접|만남/.test(question)
    ? {
        focusTheme: '상유심생(相由心生)의 대인 공명과 부드러운 기색',
        heartMindNote: '마음의 평온이 눈빛과 표정으로 전해질 때 상대의 경계심이 자연히 풀립니다.',
        expressionPractice: '대화 전 어깨의 힘을 빼고 미간을 3초간 이완한 뒤 온화한 시선을 건네십시오.',
      }
    : /일|사업|직장|재물|돈|결정/.test(question)
      ? {
          focusTheme: '명궁(인당)의 명료한 통찰과 관록·재백의 균형',
          heartMindNote: '조급함이 미간을 좁히면 판단도 흐려집니다. 여유 있는 시야가 실속을 부릅니다.',
          expressionPractice: '중요한 결정 전 물 한 잔을 마시며 호흡을 고른 뒤 차분히 우선순위를 적으십시오.',
        }
      : {
          focusTheme: '12궁 기색의 조화와 심상(心相) 수양',
          heartMindNote: '심상이 맑으면 기색도 맑아진다는 마의상법의 핵심이 오늘의 나침반입니다.',
          expressionPractice: '하루 한 번 거울 앞에서 편안히 웃으며 스스로에게 따뜻한 격려를 건네십시오.',
        };

  const mayiCrossAxis = `[${primaryPalace.hanja}] × [${secondaryPalace.hanja}] × [${situationalMayiAudit.focusTheme.split('(')[0].trim()}] × [${temporalMayiRhythm.yintangWatchWindow.split(' ')[0]}]`;
  const mayiSynthesisMatrix = {
    coreInsight: `주재 [${primaryPalace.nameKo}]와 보조 [${secondaryPalace.nameKo}]가 ${situationalMayiAudit.focusTheme}을 비춥니다.`,
    recommendedAction: `${mayiDaoistMorphologicalAdvice} (${situationalMayiAudit.expressionPractice})`,
    cautionNotice: '외적 조건이나 타인의 시선에 과도하게 긴장해 본래의 편안한 기색을 잃지 않도록 경계하십시오.',
    mayiCrossAxis,
  };

  const reflectiveQuestion = question
    ? `질문 "${question}"을 마주한 지금, 주재 [${primaryPalace.nameKo}]와 심상(心相)의 거울 앞에서 가장 부드럽게 가다듬을 내 태도는 무엇인가요?`
    : `주재 [${primaryPalace.nameKo}]와 심상(心相)의 거울 앞에서, 지금 내 표정과 마음을 가장 부드럽게 가다듬을 한 가지는 무엇인가요?`;

  return {
    engineVersion: MAYI_MIANXIANG_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst: temporalMayiRhythm.kstTimeLabel,
    innerHeartMorphologyResonance,
    qiAuraLuminosityScore,
    twelvePalacesEquilibriumIndex,
    fiveFeaturesVitalityForce,
    yintangManifestationPower,
    primaryPalace,
    secondaryPalace,
    situationalMayiAudit,
    temporalMayiRhythm,
    mayiSynthesisMatrix,
    mayiDaoistMorphologicalAdvice,
    boundaryNotice: '본 결과는 《마의상법》의 심상(心相) 및 12궁 상징 철학에 기반한 정성적 성찰 안내이며, 외모 평가나 확정적 길흉 판정이 아닙니다.',
    ritualAction: situationalMayiAudit.expressionPractice,
    reflectionFocus: reflectiveQuestion,
    reflectiveQuestion,
    interpretiveBoundary: '본 결과는 《마의상법》의 심상(心相) 및 12궁 상징 철학에 기반한 정성적 성찰 안내이며, 외모 평가나 확정적 길흉 판정이 아닙니다.',
  };
}

export function formatMayiMianxiangPrompt(report: MayiMianxiangReport): string {
  return `### 동양 비전 마의도사 《마의상법》 12궁 관상 & 심상합일 기색 엔진 (v${report.engineVersion})
- **연산 시각**: ${report.calculatedAtKst}
- **주요 12궁 진단**: ${report.primaryPalace.nameKo} [부위: ${report.primaryPalace.anatomicalLocation}]
  - *관장 영역*: ${report.primaryPalace.destinyDomain}
  - *길조 기색*: ${report.primaryPalace.auspiciousQiColor}
- **보조 12궁 조력**: ${report.secondaryPalace.nameKo} (${report.secondaryPalace.blessingAdvice})
- **질문 맥락 감사 (${report.situationalMayiAudit.focusTheme})**: ${report.situationalMayiAudit.heartMindNote} / 실천: ${report.situationalMayiAudit.expressionPractice}
- **KST 시공간 기색 리듬**: ${report.temporalMayiRhythm.yintangWatchWindow} / ${report.temporalMayiRhythm.seasonalQiColorTone}
  - *시공간 지침*: ${report.temporalMayiRhythm.temporalGuidance}
- **마의상법 교차 매트릭스**: 핵심(${report.mayiSynthesisMatrix.coreInsight}) | 4중 교차 축(${report.mayiSynthesisMatrix.mayiCrossAxis}) | 실행(${report.mayiSynthesisMatrix.recommendedAction}) | 주의(${report.mayiSynthesisMatrix.cautionNotice})
- **마의도사 심상 처방**:
  - "${report.mayiDaoistMorphologicalAdvice}"
- **성찰 초점**: ${report.reflectionFocus}
- **질문 맞춤 성찰 질문**: ${report.reflectiveQuestion}
- **해석 경계**: ${report.boundaryNotice}`;
}

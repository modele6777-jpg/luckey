/**
 * =========================================================================
 * LUCKEY 고대 그리스 델포이 아폴론 신탁 & 147 델포이 잠언(Delphic Maxims) 신성 지혜 엔진
 * (Ancient Greek Delphic Maxims & Apollonian Clarity Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 기원전 8~4세기 고대 그리스 파르나소스 산비탈의 델포이(Delphi) 아폴론 신전.
 * 대지의 배꼽인 옴팔로스(Omphalos)와 피티아(Pythia) 여사제의 신탁,
 * 그리고 그리스 7현인(탈레스, 솔론, 피타코스, 비아스, 킬론, 클레오불로스, 페리안드로스)이
 * 신전 벽면에 새겨 인류에게 전한 147대 델포이 잠언(Delphic Maxims).
 * 
 * 1. 3대 핵심 기둥 잠언:
 *    - "Γνῶθι σεαυτόν (Gnothi Seauton)" - 너 자신을 알라
 *    - "Μηδὲν ἄγαν (Meden Agan)" - 어떤 것도 지나치지 말라 (중용과 절제)
 *    - "Ἑγγύα πάρα δ' ἄτα (Engua Para D'ate)" - 보증과 섣부른 맹세 곁에 파멸이 있다
 * 2. 7대 인생 영역(영혼·절제·시간·신의·용기·관계·지혜) 체계적 분류
 * 3. 출생 수비학과 현재 절기·시간 위상 동기화를 통한 피티아 신탁 및 아폴론적 명징성 지수 도출
 */

import type { UserProfile } from '../sharedState';

export const DELPHIC_MAXIMS_VERSION = 'LUCKEY-DELPHIC-MAXIMS-v1.0.0';

export interface DelphicMaximInfo {
  maximIndex: number;            // 1 ~ 147
  greekText: string;             // 고대 그리스어 원문
  transliteration: string;       // 로마자 음차
  koreanTranslation: string;     // 한글 번역
  sage: string;                  // 그리스 현인 / 아폴론 신전 기원
  domain: '자아성찰(Gnothi)' | '절제와중용(MedenAgan)' | '시간과기회' | '신의와원칙' | '용기와인내' | '우정과관계' | '지혜와명예';
  philosophicalMeaning: string;  // 철학적 해설
  practicalActionGuidance: string; // 일상 실천 지침
}

export interface DelphicMaximsOracleReport {
  engineVersion: string;
  calculatedAt: string;
  coreSoulMaxim: DelphicMaximInfo;       // 타고난 본명 영혼 잠언
  situationalOracleMaxim: DelphicMaximInfo; // 현재 국면을 관통하는 피티아 신탁 잠언
  apollonianClarityScore: number;        // 0 ~ 100 아폴론적 이성·명징성 지수
  pythianOracleInsight: string;          // 피티아 여사제의 신탁 통찰
  delphicVirtuePrescription: string;     // 덕성(Arete) 함양 실천 처방
}

const MASTER_DELPHIC_MAXIMS: DelphicMaximInfo[] = [
  {
    maximIndex: 1,
    greekText: 'Ἕπου θεῷ',
    transliteration: 'Hepou theoi',
    koreanTranslation: '신을 따르라 (우주의 순리에 순응하라)',
    sage: '아폴론 신전 사제단',
    domain: '지혜와명예',
    philosophicalMeaning: '자연과 우주의 질서를 거스르지 않고 섭리의 큰 흐름과 나란히 걸어가는 겸허한 태도입니다.',
    practicalActionGuidance: '개인의 억지스러운 욕심을 내려놓고 상황의 순리적 흐름에 귀를 기울이십시오.',
  },
  {
    maximIndex: 2,
    greekText: 'Νόμῳ πείθου',
    transliteration: 'Nomoi peithou',
    koreanTranslation: '법과 도덕률에 따르라',
    sage: '솔론 (Solon of Athens)',
    domain: '신의와원칙',
    philosophicalMeaning: '공동체의 정의와 상호 신뢰를 지탱하는 보편적 원칙을 준수하는 것이 곧 나를 보호하는 방패입니다.',
    practicalActionGuidance: '모호하거나 편법적인 방법을 피하고 가장 정직하고 투명한 절차를 선택하십시오.',
  },
  {
    maximIndex: 3,
    greekText: 'Γνῶθι σεαυτόν',
    transliteration: 'Gnothi seauton',
    koreanTranslation: '너 자신을 알라',
    sage: '탈레스 (Thales of Miletus)',
    domain: '자아성찰(Gnothi)',
    philosophicalMeaning: '자신의 능력과 한계, 숨은 동기와 무의식을 냉철하게 인식하는 것이 모든 지혜의 출발점입니다.',
    practicalActionGuidance: '타인의 시선이나 외부 평가에 휘둘리지 말고 오직 내면의 진실한 그릇을 직시하십시오.',
  },
  {
    maximIndex: 4,
    greekText: 'Μηδὲν ἄγαν',
    transliteration: 'Meden agan',
    koreanTranslation: '어떤 것도 지나치지 말라 (과유불급)',
    sage: '솔론 (Solon of Athens)',
    domain: '절제와중용(MedenAgan)',
    philosophicalMeaning: '극단으로 치닫는 감정과 행동은 반드시 반작용을 낳습니다. 황금분할의 조화와 균형이 지속가능성을 만듭니다.',
    practicalActionGuidance: '과도한 열정이나 급격한 추진 대신, 한 템포 호흡을 고르고 균형 잡힌 중용을 유지하십시오.',
  },
  {
    maximIndex: 5,
    greekText: 'Ἑγγύα πάρα δ\' ἄτα',
    transliteration: 'Engua para d\' ate',
    koreanTranslation: '섣부른 보증과 맹세 곁에 파멸이 있다',
    sage: '탈레스 (Thales of Miletus)',
    domain: '신의와원칙',
    philosophicalMeaning: '자신이 책임질 수 없는 과도한 약속이나 섣부른 계약은 결국 돌이킬 수 없는 화근이 됩니다.',
    practicalActionGuidance: '체면 때문에 쉽게 약속하지 말고, 감당할 수 있는 범위 안에서만 명확히 확답하십시오.',
  },
  {
    maximIndex: 6,
    greekText: 'Χρόνου φείδου',
    transliteration: 'Chronou pheidou',
    koreanTranslation: '시간을 아끼라 (때를 분별하라)',
    sage: '피타코스 (Pittacus of Mytilene)',
    domain: '시간과기회',
    philosophicalMeaning: '한번 흘러간 카이로스(결정적 기회의 시간)는 다시 오지 않습니다. 가장 본질적인 일에 몰입하십시오.',
    practicalActionGuidance: '소모적인 잡무와 무의미한 유흥을 걷어내고 가장 중요한 한 가지 과업에 시간을 투자하십시오.',
  },
  {
    maximIndex: 7,
    greekText: 'Φρόνησιν ἄσκει',
    transliteration: 'Phronesin askei',
    koreanTranslation: '실천적 지혜(프로네시스)를 단련하라',
    sage: '킬론 (Chilon of Sparta)',
    domain: '지혜와명예',
    philosophicalMeaning: '탁상공론의 지식이 아닌, 복잡한 현실에서 올바른 행동을 선택하고 구현하는 구체적 지혜입니다.',
    practicalActionGuidance: '책에 머물지 말고 현실의 문제 속에서 직접 부딪히며 해결하는 실천적 감각을 기르십시오.',
  },
  {
    maximIndex: 8,
    greekText: 'Καιρὸν γνῶθι',
    transliteration: 'Kairon gnothi',
    koreanTranslation: '적절한 때(카이로스)를 포착하라',
    sage: '피타코스 (Pittacus of Mytilene)',
    domain: '시간과기회',
    philosophicalMeaning: '모든 일에는 무르익는 고유한 시점이 있습니다. 너무 이르지도 늦지도 않은 결정적 순간을 간파하십시오.',
    practicalActionGuidance: '조급함을 버리고 정세의 흐름을 주시하다가, 문이 열리는 찰나에 과감히 행동하십시오.',
  },
  {
    maximIndex: 9,
    greekText: 'Θυμοῦ κράτει',
    transliteration: 'Thymou kratei',
    koreanTranslation: '격정과 분노를 다스려라',
    sage: '킬론 (Chilon of Sparta)',
    domain: '절제와중용(MedenAgan)',
    philosophicalMeaning: '분노는 이성의 눈을 멀게 하여 쌓아 올린 모든 것을 일순간에 무너뜨립니다. 감정의 주인이 되십시오.',
    practicalActionGuidance: '격한 감정이 치밀 때 즉각 반응하지 말고, 세 번 깊게 호흡하며 이성적 거리를 확보하십시오.',
  },
  {
    maximIndex: 10,
    greekText: 'Φίλοις βοήθει',
    transliteration: 'Philois boethei',
    koreanTranslation: '벗을 도우라',
    sage: '비아스 (Bias of Priene)',
    domain: '우정과관계',
    philosophicalMeaning: '진정한 우정은 번영할 때가 아니라 곤경에 처했을 때 빛을 발하며, 베푼 환대는 영혼의 자산이 됩니다.',
    practicalActionGuidance: '주변의 소중한 동료나 벗이 힘들어할 때 주저 없이 먼저 따뜻한 손을 내미십시오.',
  },
  {
    maximIndex: 11,
    greekText: 'Ἁμαρτάνων μετανόει',
    transliteration: 'Hamartanon metanoei',
    koreanTranslation: '잘못을 범했다면 뉘우치고 돌아서라',
    sage: '솔론 (Solon of Athens)',
    domain: '자아성찰(Gnothi)',
    philosophicalMeaning: '실수는 인간의 조건이지만 그것을 고집하는 것은 파멸입니다. 즉시 인정하고 방향을 수정하는 것이 용기입니다.',
    practicalActionGuidance: '자존심을 세우며 잘못을 덮으려 하지 말고 솔직하게 인정하고 바로잡으십시오.',
  },
  {
    maximIndex: 12,
    greekText: 'Τέλος ὅρα μακροῦ βίου',
    transliteration: 'Telos hora makrou biou',
    koreanTranslation: '긴 인생의 궁극적 끝을 바라보라',
    sage: '솔론 (Solon of Athens)',
    domain: '지혜와명예',
    philosophicalMeaning: '당장의 성패나 눈앞의 작은 이익에 일희일비하지 말고, 생애 전체를 관통하는 명예와 품격을 생각하십시오.',
    practicalActionGuidance: '10년 뒤의 내가 지금의 결정을 돌아보았을 때 부끄럽지 않을 선택을 내리십시오.',
  },
  {
    maximIndex: 13,
    greekText: 'Ἄρχε σεαυτοῦ',
    transliteration: 'Arche seautou',
    koreanTranslation: '너 자신을 통치하라',
    sage: '클레오불로스 (Cleobulus of Lindos)',
    domain: '용기와인내',
    philosophicalMeaning: '남을 다스리기 전에 먼저 자신의 욕망과 게으름, 충동을 엄격하게 규율하는 자만이 세상을 이끕니다.',
    practicalActionGuidance: '스스로 세운 하루의 원칙과 루틴을 빈틈없이 지키며 내면의 주권을 확립하십시오.',
  },
  {
    maximIndex: 14,
    greekText: 'Ἔριν μίσει',
    transliteration: 'Erin misei',
    koreanTranslation: '소모적인 다툼과 불화를 멀리하라',
    sage: '피타코스 (Pittacus of Mytilene)',
    domain: '우정과관계',
    philosophicalMeaning: '승자 없는 무익한 언쟁과 에고의 대립은 생명력을 고갈시킬 뿐입니다. 싸우지 않고 이기는 길을 찾으십시오.',
    practicalActionGuidance: '에너지를 갉아먹는 온라인/오프라인의 무의미한 논쟁에서 미련 없이 발을 빼십시오.',
  },
  {
    maximIndex: 15,
    greekText: 'Δόξαν δίωκε',
    transliteration: 'Doxan dioke',
    koreanTranslation: '고귀한 명예를 추구하라',
    sage: '페리안드로스 (Periander of Corinth)',
    domain: '지혜와명예',
    philosophicalMeaning: '천박한 쾌락이나 부정한 이익 대신, 역사와 공동체에 길이 남을 덕성 높은 명성을 일구십시오.',
    practicalActionGuidance: '나의 전문성과 인격이 타인에게 긍정적인 신뢰의 상징이 되도록 스스로 품위를 높이십시오.',
  },
  {
    maximIndex: 16,
    greekText: 'Κτῶ δὴ δικαίως',
    transliteration: 'Kto de dikaios',
    koreanTranslation: '정당하게 얻으라',
    sage: '비아스 (Bias of Priene)',
    domain: '신의와원칙',
    philosophicalMeaning: '부당한 수단으로 취한 부와 성공은 모래 위의 성입니다. 정당한 대가와 정직한 땀으로 거두십시오.',
    practicalActionGuidance: '아무리 매혹적인 지름길이라도 정직하지 않다면 단호히 거절하고 정도를 걸으십시오.',
  },
];

export function calculateDelphicMaximsOracle(params: {
  profile?: UserProfile | null;
  targetDate?: Date;
}): DelphicMaximsOracleReport {
  const now = params.targetDate || new Date();

  // 1. 선천 본명 영혼 잠언 (Core Soul Maxim)
  let birthSeed = 3; // 기본값: 탈레스의 '너 자신을 알라'
  if (params.profile?.basic?.birthdate) {
    const parts = params.profile.basic.birthdate.split('-');
    if (parts.length >= 3) {
      const y = parseInt(parts[0], 10) || 1990;
      const m = parseInt(parts[1], 10) || 1;
      const d = parseInt(parts[2], 10) || 1;
      birthSeed = Math.abs((y * 7 + m * 31 + d) % MASTER_DELPHIC_MAXIMS.length);
    }
  }
  const coreSoulMaxim = MASTER_DELPHIC_MAXIMS[birthSeed];

  // 2. 현재 시점 피티아 신탁 잠언 (Situational Oracle Maxim)
  const nowDay = Math.floor((now.getUTCMonth() + 1) * 30.5 + now.getUTCDate());
  const nowHour = now.getUTCHours();
  const oracleSeed = Math.abs((nowDay * 17 + nowHour * 13 + birthSeed * 5) % MASTER_DELPHIC_MAXIMS.length);
  const situationalOracleMaxim = MASTER_DELPHIC_MAXIMS[oracleSeed];

  // 3. 아폴론적 명징성 지수 (Apollonian Clarity Score 0 ~ 100)
  // 도메인 일치도 및 태양의 위치(낮/밤)에 따른 이성적 각성도 반영
  const isDaytime = nowHour >= 0 && nowHour <= 12; // UTC 기준 낮 시간대 (KST 기준 정오~밤)
  let apollonianClarityScore = isDaytime ? 88 : 82;
  if (coreSoulMaxim.domain === situationalOracleMaxim.domain) {
    apollonianClarityScore = Math.min(98, apollonianClarityScore + 8);
  } else {
    apollonianClarityScore = Math.max(72, apollonianClarityScore - 4);
  }

  const pythianOracleInsight = `피티아 신전의 황금 삼각대 위에서 아폴론의 빛이 전하는 신탁입니다. 당신 영혼의 나침반은 [${coreSoulMaxim.greekText} - ${coreSoulMaxim.koreanTranslation}]이며, 지금 현실의 문을 여는 열쇠는 [${situationalOracleMaxim.greekText} - ${situationalOracleMaxim.koreanTranslation}]입니다. ${situationalOracleMaxim.philosophicalMeaning}`;

  const delphicVirtuePrescription = `오늘 하루 [${situationalOracleMaxim.koreanTranslation}]의 교훈을 마음의 거울로 삼으십시오. ${situationalOracleMaxim.practicalActionGuidance} 이를 통해 아폴론의 명징한 지혜와 질서가 당신의 일상에 깃들 것입니다.`;

  return {
    engineVersion: DELPHIC_MAXIMS_VERSION,
    calculatedAt: now.toISOString(),
    coreSoulMaxim,
    situationalOracleMaxim,
    apollonianClarityScore,
    pythianOracleInsight,
    delphicVirtuePrescription,
  };
}

export function formatDelphicMaximsOraclePrompt(report: DelphicMaximsOracleReport): string {
  return `### 🏛️ 고대 그리스 델포이 아폴론 신탁 & 147 델포이 잠언 엔진 (${DELPHIC_MAXIMS_VERSION})
- **선천 본명 영혼 잠언**: [제${report.coreSoulMaxim.maximIndex}잠언] ${report.coreSoulMaxim.greekText} (${report.coreSoulMaxim.transliteration})
  - 한글 뜻 / 현인: "${report.coreSoulMaxim.koreanTranslation}" · ${report.coreSoulMaxim.sage}
  - 인생 영역 / 본질: [${report.coreSoulMaxim.domain}] ${report.coreSoulMaxim.philosophicalMeaning}
- **현재 시점 피티아 신탁 잠언**: [제${report.situationalOracleMaxim.maximIndex}잠언] ${report.situationalOracleMaxim.greekText}
  - 신탁 메시지: "${report.situationalOracleMaxim.koreanTranslation}" (${report.situationalOracleMaxim.sage})
- **아폴론적 명징성(Clarity) 지수**: ${report.apollonianClarityScore}점 / 100점
- **피티아 여사제의 신탁 통찰**: ${report.pythianOracleInsight}
- **델포이 덕성(Arete) 실천 처방**: ${report.delphicVirtuePrescription}`;
}

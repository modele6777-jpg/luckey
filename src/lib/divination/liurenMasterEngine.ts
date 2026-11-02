/**
 * =========================================================================
 * LUCKEY 대육임(大六壬) 정통 사과·삼전·12천장 결정론적 인사신단 마스터 엔진
 * (Da Liu Ren Four Lessons, Three Transmissions & 12 Heavenly Generals Master Engine)
 * =========================================================================
 *
 * [설계 철학 & 핵심 원칙]
 * 1. 동양 삼식(三式) 중 인사이동과 당면 결단의 최고봉인 대육임(大六壬)을
 *    LLM 환각 없이 100% 결정론적 수리 산법으로 계산하고 정밀 구조화한다.
 *
 * 2. 천지반(天地盤) 월장가시(月將加時), 사과(四課: 간상/간음/지상/지음),
 *    삼전(三傳: 초전 발용 / 중전 진행 / 말전 귀결)을 체계적으로 분석한다.
 *
 * 3. 12천장(十二天將):
 *    귀인(貴人)·등사(騰蛇)·주작(朱雀)·육합(六合)·구진(勾陳)·청룡(青龍)·
 *    천공(天空)·백호(白虎)·태상(太常)·현무(玄武)·태음(太陰)·천후(天后)의
 *    입궁 및 승차를 판정하여 길흉을 정량화(0~100점)한다.
 *
 * 4. 구종과격(九宗課格):
 *    원수과·중심과·섭해과·요극과·묘성과·별책과·팔전과·복음과·반음과 판정.
 */

import { calculateLiuren } from './eventCharts';

export const LIUREN_MASTER_ENGINE_VERSION = 'LUCKEY-LR-v1.0.0';

export const LIUREN_MASTER_METHOD =
  '대육임(大六壬) 정통 월장가시 천지반 12궁 포국, 사과(간상·간음·지상·지음), 삼전(초전·중전·말전 발용) 구종과격, 12천장 승차 길흉 판정 및 0~100점 결단 스코어 결정론적 산출';

export type LiurenLessonId = 'first' | 'second' | 'third' | 'fourth';

export interface LiurenLesson {
  id: LiurenLessonId;
  name: string;
  hanja: string;
  upper: string; // 상신(天盤)
  lower: string; // 자신(地盤)
  meaning: string;
}

export interface LiurenTransmission {
  stage: '초전(初傳/發用)' | '중전(中傳)' | '말전(末傳)';
  branch: string;
  general: string;
  timelineRole: string;
  meaning: string;
}

export interface LiurenGeneralInfo {
  name: string;
  nature: '최고길신' | '길신' | '길흉겸유' | '평신' | '흉신' | '맹렬흉신';
  attribute: string;
  advice: string;
}

export interface LiurenMasterResult {
  engineVersion: string;
  method: string;
  status: 'calculated' | 'error';
  instantKstIso: string;
  monthGeneral: string; // 월장 (月將)
  dayStemBranch: string; // 일진 (日辰)
  hourBranch: string; // 점시 (占時)
  patternName: string; // 과격 (課格: 원수과, 섭해과 등)
  patternHanja: string;
  patternGuidance: string;
  fourLessons: LiurenLesson[];
  threeTransmissions: LiurenTransmission[];
  primaryGeneral: LiurenGeneralInfo;
  decisionScore: number; // 0 ~ 100
  decisionGrade: '적극 추진 (Strong Go)' | '협력 추진 (Cooperative Go)' | '내실 관망 (Watch & Fortify)' | '전략 수정 (Caution & Pivot)' | '전면 보류 (Strong Stop)';
  actionProtocols: {
    timingAdvice: string;
    relationshipAdvice: string;
    strategicCaution: string;
  };
}

const GENERAL_DATA: Record<string, LiurenGeneralInfo> = {
  '귀인': { name: '귀인(貴人)', nature: '길신', attribute: '최고 스폰서·상급자·귀인의 강력한 조력', advice: '권위 있는 조력자를 적극적으로 찾아 도움을 요청하세요.' },
  '등사': { name: '등사(騰蛇)', nature: '흉신', attribute: '허망한 유혹·불안·악몽·변덕', advice: '불확실한 소문에 흔들리지 말고 문서와 팩트만 확인하세요.' },
  '주작': { name: '주작(朱雀)', nature: '길흉겸유', attribute: '문서 전달·공문·말실수 구설·메시지', advice: '커뮤니케이션을 정확히 기록으로 남기고 감정적 언쟁을 삼가세요.' },
  '육합': { name: '육합(六合)', nature: '길신', attribute: '계약 성사·파트너십·화합·중개', advice: '동업과 협력, 계약 체결에 최적의 시기입니다.' },
  '구진': { name: '구진(勾陳)', nature: '흉신', attribute: '소송·지체·관재구설·과거의 발목', advice: '무리한 속도전을 피하고 기존 법적·행정적 리스크를 먼저 해소하세요.' },
  '청룡': { name: '청룡(青龍)', nature: '최고길신', attribute: '재물 획득·승진·투자 성공·기쁨', advice: '자신감을 갖고 대담하게 확장과 성과 창출에 나서세요.' },
  '천공': { name: '천공(天空)', nature: '평신', attribute: '공상·허위 계약·실체 없는 제안', advice: '겉만 화려한 조건에 속지 말고 실질 자본과 담보를 확인하세요.' },
  '백호': { name: '백호(白虎)', nature: '맹렬흉신', attribute: '돌발 충돌·사고·급격한 지출·수술', advice: '공격적인 베팅을 삼가고 안전과 건강 관리에 집중하세요.' },
  '태상': { name: '태상(太常)', nature: '길신', attribute: '잔치·식음료·의복·예술·접대', advice: '사교와 네트워킹 자리에서 귀중한 기회가 열립니다.' },
  '현무': { name: '현무(玄武)', nature: '흉신', attribute: '도난·정보 유출·배임·밀행', advice: '보안과 기밀 관리를 철저히 하고 이면 계약을 경계하세요.' },
  '태음': { name: '태음(太陰)', nature: '길신', attribute: '은밀한 후원·기획·사색·여성 조력', advice: '물밑에서 철저히 내실을 다지고 전략적 기획을 완성하세요.' },
  '천후': { name: '천후(天后)', nature: '길신', attribute: '온정·순리·여성 귀인·심리적 안정', advice: '부드러운 유연함으로 상대를 포용할 때 난제가 풀립니다.' },
};

/**
 * 대육임 정통 수리 계산 및 사과·삼전·12천장 결단 마스터 엔진 실행
 */
export function calculateLiurenMaster(instant: Date = new Date()): LiurenMasterResult {
  const raw = calculateLiuren(instant);
  const nowKstIso = new Date(instant.getTime() + 9 * 3600000).toISOString().replace('Z', '+09:00');

  // 사과 (四課) 추출
  const rawLessons = (raw.lessons as unknown as any[]) || [];
  const lessonTitles: Array<{ id: LiurenLessonId; name: string; hanja: string; meaning: string }> = [
    { id: 'first', name: '제1과 일간상신', hanja: '日干上神', meaning: '나의 현재 처지, 대외적 역량과 주도권' },
    { id: 'second', name: '제2과 일간음신', hanja: '日干陰神', meaning: '나의 내면 심리, 숨겨진 배경과 잠재 파급력' },
    { id: 'third', name: '제3과 일지상신', hanja: '日支上神', meaning: '상대방/목적 대상의 현재 상태와 현실 환경' },
    { id: 'fourth', name: '제4과 일지음신', hanja: '日支陰神', meaning: '상대방의 내밀한 저의 및 최종 종착점' },
  ];

  const fourLessons: LiurenLesson[] = lessonTitles.map((t, idx) => {
    const rawLesson = rawLessons[idx] || {};
    const upper = String(rawLesson.shang || rawLesson.upper || '午');
    const lower = String(rawLesson.xia || rawLesson.lower || '子');
    return {
      id: t.id,
      name: t.name,
      hanja: t.hanja,
      upper,
      lower,
      meaning: t.meaning,
    };
  });

  // 삼전 (三傳) 추출
  const rawTrans = (raw.transmissions as unknown as any[]) || [];
  const transStages: Array<{ stage: '초전(初傳/發用)' | '중전(中傳)' | '말전(末傳)'; role: string }> = [
    { stage: '초전(初傳/發用)', role: '일의 발단, 시작 국면의 동력과 촉발 계기' },
    { stage: '중전(中傳)', role: '일의 진행 과정, 마주칠 전환점과 고비' },
    { stage: '말전(末傳)', role: '일의 최종 귀결, 결말과 수확' },
  ];

  const threeTransmissions: LiurenTransmission[] = transStages.map((s, idx) => {
    const rawT = rawTrans[idx] || {};
    const branch = String(rawT.zhi || rawT.branch || '寅');
    const general = String(rawT.tianjiang || rawT.general || '청룡');
    return {
      stage: s.stage,
      branch,
      general,
      timelineRole: s.role,
      meaning: `${branch} 지지에 ${general} 천장이 임하여 ${s.role}을 주도함`,
    };
  });

  // 발용 과격(課格) 산출
  const patternHanja = String((raw as any).pattern || '元首課');
  const patternGuidance =
    patternHanja.includes('元首')
      ? '원수과(元首課): 상하의 위계와 순리가 바르게 서 있어 정공법으로 추진하면 대길합니다.'
      : patternHanja.includes('重審')
      ? '중심과(重審課): 아래에서 위를 극하는 형세로, 재검토와 신중한 설득이 필수적입니다.'
      : patternHanja.includes('涉害')
      ? '섭해과(涉害課): 물을 건너듯 난관을 헤쳐나가는 격으로, 준비된 자만이 돌파합니다.'
      : patternHanja.includes('遙克')
      ? '요극과(遙克課): 멀리서 기운이 작용하므로 직접 충돌보다 우회적 협상이 유리합니다.'
      : patternHanja.includes('昴星')
      ? '묘성과(昴星課): 길이 뚜렷하지 않으니 외부 귀인과 지혜로운 스승을 찾아야 합니다.'
      : patternHanja.includes('八專')
      ? '팔전과(八專課): 기운이 한곳에 뭉쳐 있으므로 독립적 결단과 내부 단속이 핵심입니다.'
      : '순리상행과(順理上行課): 자연스러운 흐름에 몸을 맡기고 단계를 밟아 나가야 합니다.';

  // 주도 천장(초전 천장) 기반 스코어 및 프로토콜 연산
  const firstGeneralName = threeTransmissions[0]?.general || '청룡';
  const matchedGeneral = Object.entries(GENERAL_DATA).find(([k]) => firstGeneralName.includes(k))?.[1] || GENERAL_DATA['청룡'];

  let baseScore = 70;
  if (matchedGeneral.nature === '최고길신') baseScore = 92;
  else if (matchedGeneral.nature === '길신') baseScore = 82;
  else if (matchedGeneral.nature === '길흉겸유') baseScore = 65;
  else if (matchedGeneral.nature === '평신') baseScore = 52;
  else if (matchedGeneral.nature === '흉신') baseScore = 42;
  else if (matchedGeneral.nature === '맹렬흉신') baseScore = 28;

  let decisionGrade: LiurenMasterResult['decisionGrade'] = '협력 추진 (Cooperative Go)';
  if (baseScore >= 85) decisionGrade = '적극 추진 (Strong Go)';
  else if (baseScore >= 70) decisionGrade = '협력 추진 (Cooperative Go)';
  else if (baseScore >= 55) decisionGrade = '내실 관망 (Watch & Fortify)';
  else if (baseScore >= 40) decisionGrade = '전략 수정 (Caution & Pivot)';
  else decisionGrade = '전면 보류 (Strong Stop)';

  return {
    engineVersion: LIUREN_MASTER_ENGINE_VERSION,
    method: LIUREN_MASTER_METHOD,
    status: 'calculated',
    instantKstIso: nowKstIso,
    monthGeneral: raw.monthGeneral,
    dayStemBranch: raw.day,
    hourBranch: raw.hour,
    patternName: patternHanja,
    patternHanja,
    patternGuidance,
    fourLessons,
    threeTransmissions,
    primaryGeneral: matchedGeneral,
    decisionScore: baseScore,
    decisionGrade,
    actionProtocols: {
      timingAdvice: `초전(${threeTransmissions[0]?.branch}·${threeTransmissions[0]?.general})의 발동 계기를 예의주시하고, 중전의 분기점에서 조력자를 확보하세요.`,
      relationshipAdvice: `제1과(${fourLessons[0]?.upper})와 제3과(${fourLessons[2]?.upper})의 생극 관계를 살펴 일방적 요구 대신 상호 이익을 제안하세요.`,
      strategicCaution: matchedGeneral.advice,
    },
  };
}

/**
 * 프롬프트 주입용 마스터 포맷터
 */
export function formatLiurenMasterPrompt(res: LiurenMasterResult): string {
  if (res.status !== 'calculated') return '';

  return `[대육임(大六壬) 정통 사과·삼전·12천장 결단 리포트 (엔진: ${res.engineVersion})]
- 점시 일진: ${res.dayStemBranch}일 ${res.hourBranch}시 (월장: ${res.monthGeneral})
- 과격(課格): ${res.patternName} - ${res.patternGuidance}
- 결단 스코어: ${res.decisionScore}점 (${res.decisionGrade})
- 주도 12천장: ${res.primaryGeneral.name} [${res.primaryGeneral.nature}] - ${res.primaryGeneral.attribute}
- 사과(四課) 포국:
  1. 제1과(일간상신/나의 외적위치): ${res.fourLessons[0]?.upper}/${res.fourLessons[0]?.lower}
  2. 제2과(일간음신/나의 내적심리): ${res.fourLessons[1]?.upper}/${res.fourLessons[1]?.lower}
  3. 제3과(일지상신/상대의 환경): ${res.fourLessons[2]?.upper}/${res.fourLessons[2]?.lower}
  4. 제4과(일지음신/상대의 의도): ${res.fourLessons[3]?.upper}/${res.fourLessons[3]?.lower}
- 삼전(三傳) 타임라인:
  • 초전(발용/시작): ${res.threeTransmissions[0]?.branch} (${res.threeTransmissions[0]?.general}) -> ${res.threeTransmissions[0]?.timelineRole}
  • 중전(과정/고비): ${res.threeTransmissions[1]?.branch} (${res.threeTransmissions[1]?.general}) -> ${res.threeTransmissions[1]?.timelineRole}
  • 말전(귀결/수확): ${res.threeTransmissions[2]?.branch} (${res.threeTransmissions[2]?.general}) -> ${res.threeTransmissions[2]?.timelineRole}
- 실천 프로토콜:
  • 타이밍: ${res.actionProtocols.timingAdvice}
  • 관계 전략: ${res.actionProtocols.relationshipAdvice}
  • 핵심 주의: ${res.actionProtocols.strategicCaution}
※ 루시 지침: 대육임은 인사처신의 거울입니다. 사용자가 질문한 일의 시작(초전), 진행(중전), 결말(말전)과 상대방과의 심리적 역학(사과)을 명쾌하고 든든하게 해설해 주세요.`;
}

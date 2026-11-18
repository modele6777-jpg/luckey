/**
 * 고대 은나라 상(商) 갑골문(甲骨文) 신탁 복사(卜辭) & 정인(貞人) 4단계 신의 균열 엔진
 *
 * LUCKEY-SHANG-ORACLE-BONE-DIVINATION-v1.0.0
 *
 * 서기전 14~11세기 은허(殷墟) 원전 기반, 동양 한자 문명과 점복의 시원인
 * 구갑(龜甲, 거북 배딱지)과 우골(牛骨, 소 어깨뼈 견갑골) 소작(燒灼) 균열(兆, Zhao) 음양 판독,
 * 정인(貞人)의 4단계 복사(前辭·命辭·占辭·驗辭) 및 상제(上帝)·조상신 신탁 결정론 엔진.
 *
 * [복사(卜辭) 4대 구조]
 * 1. 전문 (前辭 / 叙辭): 간지(干支) 일진과 신탁을 주재하는 정인(貞人) 기록
 * 2. 정문 (命辭): 상제와 조상신에게 올리는 결단과 운명의 핵심 질문
 * 3. 점문 (占辭): 열화 소작으로 터져 나온 갑골 균열(兆紋)의 길흉 신의 판독 (대길·길·불해·유질 등)
 * 4. 험문 (驗辭): 현실 시공간에서 실제로 발현되어 검증되는 우주적 응험
 *
 * [핵심 지표]
 * - 상제(上帝) 신성 직관 감응도 (Di Celestial Alignment)
 * - 조상신(祖靈) 영맥 가호 지수 (Ancestral Spirit Protection)
 * - 갑골 조문(兆紋) 길조 강도 (Oracle Crack Auspiciousness)
 * - 대국 결단력 및 응험 지수 (Manifestation Efficacy)
 */

import type { UserProfile } from '../sharedState';

export const SHANG_ORACLE_BONE_VERSION = '2.2.0';

export interface ShangOracleBoneReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  // 갑골 점복 4대 복사
  divinationMedium: string; // 구갑(龜甲) 또는 우견갑골(牛肩胛骨)
  divinerName: string; // 정인(貞人) 명호 (예: 쟁(爭), 빈(賓), 내(內), 각(殼) 등)
  secondaryDivinerName: string; // 보조 교차 정인
  qianCiPreface: string; // 전문 (前辭)
  mingCiQuery: string; // 정문 (命辭)
  zhanCiOracleJudgment: string; // 점문 (占辭)
  yanCiManifestationVerification: string; // 험문 (驗辭)
  // 갑골 신탁 지표
  shangdiDivineAlignmentScore: number; // 상제(上帝) 신성 직관 감응도 (0~100)
  ancestralProtectionScore: number; // 조상신(祖靈) 영맥 가호 지수 (0~100)
  crackAuspiciousnessIndex: number; // 조문(兆紋) 길조 강도 (0~100)
  manifestationEfficacyScore: number; // 현실 검증 응험력 지수 (0~100)
  // 정인의 조언
  oracleBonePrescription: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  shangOracleSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatShangKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const DIVINER_NAMES = [
  { name: '각 (殼)', trait: '엄정한 예법과 치밀한 관찰로 천명을 판독하는 대정인' },
  { name: '쟁 (爭)', trait: '군왕의 결단을 보좌하여 국가적 난제를 타개하는 직언의 정인' },
  { name: '빈 (賓)', trait: '천지신명과 조상 영령을 정성껏 예우하는 조화의 정인' },
  { name: '내 (內)', trait: '깊은 내면의 직관과 심연의 징조를 꿰뚫어보는 은둔의 정인' },
  { name: '위 (韋)', trait: '험난한 위기 속에서 상제의 은밀한 복운을 찾아내는 결단의 정인' },
];

const ORACLE_JUDGMENTS = [
  {
    gradeKo: '대길 (大吉 - 크게 길함)',
    omen: '왕점왈: 길, 상제강우, 만사무우 (王占曰: 吉, 上帝降祐, 萬事無憂)',
    detail: '불꽃이 갑골을 가르는 순간 거룩하고 곧은 균열이 상서롭게 뻗었습니다. 상제의 가호가 있으니 주저함 없이 전진하십시오.',
  },
  {
    gradeKo: '홍길 (弘吉 - 넓고 광대하게 길함)',
    omen: '왕점왈: 홍길, 불재우인, 복록구진 (王占曰: 弘吉, 不在憂隣, 福祿俱進)',
    detail: '균열이 부드러운 호를 그리며 사방으로 흩어지지 않고 모였습니다. 주변 사람들과 화합할 때 막대한 복록이 따릅니다.',
  },
  {
    gradeKo: '정길 (貞吉 - 곧고 바르게 행하면 길함)',
    omen: '왕점왈: 정길, 지수정도, 필유경사 (王占曰: 貞吉, 持守正道, 必有慶事)',
    detail: '균열의 각도가 반듯하여 사심 없이 순수한 초심을 지킬 때만 길한 열매가 맺힙니다. 편법을 피하고 바른 길을 고수하십시오.',
  },
  {
    gradeKo: '불해 (不害 - 해가 없음)',
    omen: '왕점왈: 불해, 유소소근, 평정종환 (王占曰: 不害, 有小小艱, 平靜終還)',
    detail: '작은 파동이나 지연이 있을 수 있으나 근본적인 손실이나 해악은 없습니다. 조급해하지 말고 평정심을 유지하십시오.',
  },
];

export function calculateShangOracleBoneDivination(
  profile?: UserProfile | null,
  now: Date = new Date(),
  question?: string,
): ShangOracleBoneReport {
  const bdate = profile?.basic?.birthdate || '1994-01-24';
  const btime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'zeZE';
  const q = question?.trim() || '';
  const seedStr = `${bdate}_${btime}_${name}_${q}_shang_oracle_bone_v1`;
  const seed = djb2Hash(seedStr);

  const divinationMedium = (seed % 2 === 0) ? '신성 구갑 (神聖 龜甲 - 거북 배딱지 귀판)' : '신성 우견갑골 (神聖 牛肩胛骨 - 소 어깨뼈)';
  const divinerIdx = seed % DIVINER_NAMES.length;
  const secondaryDivinerIdx = (divinerIdx + 1 + ((seed >> 4) % (DIVINER_NAMES.length - 1))) % DIVINER_NAMES.length;
  const diviner = DIVINER_NAMES[divinerIdx];
  const secondaryDiviner = DIVINER_NAMES[secondaryDivinerIdx];
  const judgment = ORACLE_JUDGMENTS[(seed >> 2) % ORACLE_JUDGMENTS.length];

  const shangdiDivineAlignmentScore = 63 + (seed % 36);
  const ancestralProtectionScore = 65 + ((seed >> 3) % 34);
  const crackAuspiciousnessIndex = 61 + ((seed >> 5) % 38);
  const manifestationEfficacyScore = Math.round((shangdiDivineAlignmentScore * 0.45) + (crackAuspiciousnessIndex * 0.55));

  const qianCiPreface = `간지 정축일(貞丑日), 대정인 '${diviner.name}'이(가) 상제와 조령께 신탁의 불을 올려 점을 치다.`;
  const mingCiQuery = `정문(命辭): '지금 묻는 이 사안에 신명의 가호가 온전하여 만사가 순조롭겠습니까?'`;
  const zhanCiOracleJudgment = `점문(占辭): [${judgment.gradeKo}] ${judgment.omen} -> ${judgment.detail}`;
  const yanCiManifestationVerification = `험문(驗辭): 머지않아 정해진 시일 내에 우주의 균열이 상응하는 현실적 성취와 평온으로 응험하리라.`;

  let oracleBonePrescription = '';
  if (crackAuspiciousnessIndex >= 80) {
    oracleBonePrescription = '갑골의 균열이 명확하고 강력한 길조를 가리킵니다. 오래 망설였던 과업을 즉시 착수하여 현실화하십시오.';
  } else if (ancestralProtectionScore >= 80) {
    oracleBonePrescription = '보이지 않는 선대와 근원의 뿌리가 그대를 든든히 지키고 있습니다. 감사하는 마음으로 정성을 다하십시오.';
  } else {
    oracleBonePrescription = '정길(貞吉)의 덕목에 따라 바른 도리와 성실함으로 임할 때, 일체의 재액을 물리치고 큰 성취를 이룹니다.';
  }

  const calculatedAtKst = formatShangKstTimestamp(now);
  const shangOracleSynthesisMatrix = {
    dominantTension: `${divinationMedium} · 정인 ${diviner.name} ↔ 보조 ${secondaryDiviner.name} (${judgment.gradeKo})`,
    alignmentState: `${judgment.omen}`,
    integratedAction: `${oracleBonePrescription}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };
  const ritualAction = `[정인 ${diviner.name}] ${oracleBonePrescription}`;
  const reflectionFocus = `은나라 갑골문 신탁(${judgment.gradeKo}) — ${divinationMedium}`;
  const reflectiveQuestion = q
    ? `지금 물으신 '${q}'의 사안 앞에서, 불꽃에 갈라진 조문(兆紋)처럼 숨기지 못할 마음속 진짜 결단은 무엇입니까?`
    : `오늘 마주한 갈림길에서, '${judgment.gradeKo}'의 맑은 기준에 비추어 더 정직하게 바로 세워야 할 초심은 어디에 있습니까?`;
  const interpretiveBoundary = '이 리포트는 고대 은나라 갑골문 점복과 정인 복사 체계를 바탕으로 한 자기 성찰 비유이며, 길흉의 절대적 예언이나 미래 단정이 아닙니다.';

  return {
    engineVersion: SHANG_ORACLE_BONE_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    divinationMedium,
    divinerName: diviner.name,
    secondaryDivinerName: secondaryDiviner.name,
    qianCiPreface,
    mingCiQuery,
    zhanCiOracleJudgment,
    yanCiManifestationVerification,
    shangdiDivineAlignmentScore,
    ancestralProtectionScore,
    crackAuspiciousnessIndex,
    manifestationEfficacyScore,
    oracleBonePrescription,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary,
    shangOracleSynthesisMatrix,
  };
}

export function formatShangOracleBoneDivinationPrompt(report: ShangOracleBoneReport): string {
  const lines = [
    `[고대 은나라 상(商) 갑골문(甲骨文) 신탁 복사(卜辭) & 정인 4단계 신의 균열]`,
    `- 연산 시각: ${report.calculatedAtKst} | 엔진 버전: v${report.engineVersion}`,
    `- 점복 매체: ${report.divinationMedium} / 주재 정인: ${report.divinerName} / 보조 정인: ${report.secondaryDivinerName}`,
    `- 전문(前辭): ${report.qianCiPreface}`,
    `- 정문(命辭): ${report.mingCiQuery}`,
    `- 점문(占辭): ${report.zhanCiOracleJudgment}`,
    `- 험문(驗辭): ${report.yanCiManifestationVerification}`,
    `- 갑골문 처방: ${report.oracleBonePrescription}`,
  ];
  if (report.shangOracleSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${report.shangOracleSynthesisMatrix.dominantTension} | 조율 상태: ${report.shangOracleSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${report.shangOracleSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(
    `- 실천 의례: ${report.ritualAction}`,
    `- 성찰 초점: ${report.reflectionFocus}`,
    `- 성찰 질문: ${report.reflectiveQuestion}`,
    `- 해석 경계: ${report.interpretiveBoundary}`,
  );
  return lines.join('\n');
}

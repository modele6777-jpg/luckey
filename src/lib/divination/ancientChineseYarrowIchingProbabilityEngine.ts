/**
 * 고대 중국 주역 대연지수(大衍之數) 49책 시초점 확률 수리 엔진 (Yarrow Stalk Probability Engine)
 *
 * 계사상전(繫辭上傳)의 '대연지수 50에 그 쓰임은 49라(大衍之數五十 其用四十有九)'에 기반하여
 * 3변(三變)을 거쳐 도출되는 6(노음 1/16), 7(소양 5/16), 8(소음 7/16), 9(노양 3/16)의 엄밀한 비대칭 확률장과
 * 소강절 선천역 수리 체계를 연동하여 행동 타이밍의 성숙도를 산출합니다.
 */

export const ANCIENT_YARROW_PROBABILITY_ENGINE_VERSION = 'LUCKEY-YARROW-PROBABILITY-v1.0.0';

export interface YarrowProbabilityReport {
  engineVersion: string;
  calculatedAt: string;
  dominantYaoValue: 6 | 7 | 8 | 9;
  yaoNameKo: string;
  yaoStateEn: 'Old Yin (Changing to Yang)' | 'Young Yang (Stable)' | 'Young Yin (Stable)' | 'Old Yang (Changing to Yin)';
  theoreticalProbability: string;
  dayanAlignmentScore: number; // 0 ~ 100
  temporalYinYangMomentum: string;
  cosmicTimingActionMandate: string;
}

export function calculateAncientYarrowProbability(params: {
  profile?: any;
  question?: string;
  now?: Date;
}): YarrowProbabilityReport {
  const now = params.now || new Date();
  const basic = params.profile?.basic;
  const birthdateStr = basic?.birthdate?.trim() || '1994-01-24';
  const question = params.question || '';

  let seed = 0;
  for (let i = 0; i < birthdateStr.length; i++) {
    seed += birthdateStr.charCodeAt(i) * (i + 23);
  }
  for (let i = 0; i < question.length; i++) {
    seed += question.charCodeAt(i) * 43;
  }
  seed += now.getDate() * 37 + now.getMonth() * 73;

  // 16분할 대연지수 확률 매핑: 6 (1/16), 7 (5/16), 8 (7/16), 9 (3/16)
  const slot = Math.abs(seed) % 16;
  let dominantYaoValue: 6 | 7 | 8 | 9;
  let yaoNameKo: string;
  let yaoStateEn: 'Old Yin (Changing to Yang)' | 'Young Yang (Stable)' | 'Young Yin (Stable)' | 'Old Yang (Changing to Yin)';
  let theoreticalProbability: string;

  if (slot === 0) {
    dominantYaoValue = 6;
    yaoNameKo = '노음(老陰, 극음변양 - 동효)';
    yaoStateEn = 'Old Yin (Changing to Yang)';
    theoreticalProbability = '1/16 (6.25% - 가장 희귀한 대역전의 변곡점)';
  } else if (slot <= 5) {
    dominantYaoValue = 7;
    yaoNameKo = '소양(少陽, 정양 - 안정적 성장)';
    yaoStateEn = 'Young Yang (Stable)';
    theoreticalProbability = '5/16 (31.25% - 곧고 굳건한 전진)';
  } else if (slot <= 12) {
    dominantYaoValue = 8;
    yaoNameKo = '소음(少陰, 정음 - 수용적 축적)';
    yaoStateEn = 'Young Yin (Stable)';
    theoreticalProbability = '7/16 (43.75% - 유순하게 힘을 비축하는 최빈값)';
  } else {
    dominantYaoValue = 9;
    yaoNameKo = '노양(老陽, 극양변음 - 동효)';
    yaoStateEn = 'Old Yang (Changing to Yin)';
    theoreticalProbability = '3/16 (18.75% - 에너지가 극에 달해 결실로 전환)';
  }

  const dayanAlignmentScore = 70 + (Math.abs(seed * 9) % 29);
  const temporalYinYangMomentum = dominantYaoValue % 2 === 1 ? '양기(陽氣) 주도적 확장 및 돌파 흐름' : '음기(陰氣) 주도적 포용 및 내실 안정 흐름';

  let cosmicTimingActionMandate = '';
  if (dominantYaoValue === 6) {
    cosmicTimingActionMandate = '극도의 어둠이 끝나고 새벽빛이 솟아나는 시점입니다. 과거의 실패나 두려움을 완전히 털어내고 전면적인 새 출발을 선언하세요.';
  } else if (dominantYaoValue === 7) {
    cosmicTimingActionMandate = '뿌린 씨앗이 단단하게 싹을 틔우고 있습니다. 조급해하지 말고 꾸준한 정진으로 세력을 확장하세요.';
  } else if (dominantYaoValue === 8) {
    cosmicTimingActionMandate = '지금은 억지로 결과를 밀어붙이기보다 상대의 제안을 경청하고 실력을 다지는 때입니다. 유연한 수용이 최고의 지혜입니다.';
  } else {
    cosmicTimingActionMandate = '열정이 정점에 달해 자칫 과열될 수 있습니다. 성과를 서둘러 매듭짓고 주변과 나누어 지속가능한 안정을 도모하세요.';
  }

  return {
    engineVersion: ANCIENT_YARROW_PROBABILITY_ENGINE_VERSION,
    calculatedAt: now.toISOString(),
    dominantYaoValue,
    yaoNameKo,
    yaoStateEn,
    theoreticalProbability,
    dayanAlignmentScore,
    temporalYinYangMomentum,
    cosmicTimingActionMandate,
  };
}

export function formatAncientYarrowProbabilityPrompt(report: YarrowProbabilityReport): string {
  return `### 🎋 고대 중국 주역 대연지수 49책 시초점 확률 실측 데이터 (${report.engineVersion})
- **산출 효(爻) 수리값**: ${report.dominantYaoValue} - [${report.yaoNameKo}]
- **시초점 이론적 발생 확률**: ${report.theoreticalProbability}
- **대연지수 천기 동조율**: ${report.dayanAlignmentScore}점 / 100점
- **시공간 음양 모멘텀**: ${report.temporalYinYangMomentum}
- **시중(時中) 행동 결단 지침**: ${report.cosmicTimingActionMandate}`;
}

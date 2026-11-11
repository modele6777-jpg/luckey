/**
 * =========================================================================
 * LUCKEY 헤르메스 카이발리온 7대 우주 불변 법칙 진동 엔진 (Hermetic Kybalion Seven Cosmic Principles Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 고대 에르메스주의(Hermeticism)의 불후의 고전 『The Kybalion (카이발리온)』 7대 대우주 원리를
 * 상담자의 생년월일 수비학적 수치 및 일간 에너지에 매핑하여, 현재 인생 국면에서
 * 내담자가 겪고 있는 사건과 내면 갈등의 우주적 작동 원리를 0ms 순수 수리로 해석합니다.
 * 
 * 1. 정신성의 원리 (The Principle of Mentalism) - 'THE ALL is Mind; The Universe is Mental'
 * 2. 상응의 원리 (The Principle of Correspondence) - 'As above, so below; as below, so above'
 * 3. 진동의 원리 (The Principle of Vibration) - 'Nothing rests; everything moves; everything vibrates'
 * 4. 극성의 원리 (The Principle of Polarity) - 'Everything is Dual; opposites are identical in nature'
 * 5. 리듬의 원리 (The Principle of Rhythm) - 'The pendulum-swing manifests in everything'
 * 6. 원인과 결과의 원리 (The Principle of Cause and Effect) - 'Every Cause has its Effect; Chance is but a name'
 * 7. 성별의 원리 (The Principle of Gender) - 'Gender is in everything; everything has Masculine and Feminine'
 */

import type { UserProfile } from '../sharedState';

export const HERMETIC_KYBALION_VERSION = 'LUCKEY-HERMETIC-KYBALION-v1.0.0';

export interface HermeticPrincipleStatus {
  nameEn: string;
  nameKo: string;
  aphorism: string;
  alignmentScore: number;       // 0 ~ 100 현재 공명 점수
  lifeApplication: string;      // 현실 적용 지침
}

export interface HermeticKybalionReport {
  engineVersion: string;
  calculatedAt: string;
  masterPrinciple: {
    nameKo: string;
    nameEn: string;
    coreInsight: string;
    alchemicalKey: string;      // 정신 연금술적 열쇠
  };
  principleAlignmentScore: number; // 7대 원리의 평균 정렬도 (0~100)
  rhythmPhase: '밀물(진전/확장기)' | '썰물(정리/내면화기)' | '전환점(진자 극점)';
  polarityTranscendence: {
    currentDuality: string;     // 직면한 양극성 (예: 성공 vs 실패, 인정 vs 고립)
    transcendenceShift: string; // 극성 통합 및 의식 상승 해법
  };
  cosmicPrinciples: HermeticPrincipleStatus[];
  hermeticWisdomDirective: string;
}

export function calculateHermeticKybalion(
  profile?: UserProfile | null,
  targetDate: Date = new Date()
): HermeticKybalionReport {
  let birthSum = 7;
  let year = 1995;
  let month = 5;
  let day = 15;

  if (profile?.basic?.birthdate) {
    const parts = profile.basic.birthdate.split(/[-./]/).map(p => parseInt(p, 10)).filter(n => !isNaN(n));
    if (parts.length >= 3) {
      year = parts[0];
      month = parts[1];
      day = parts[2];
      birthSum = (year + month + day) % 9 || 9;
    }
  }

  // 타겟 일자의 카르믹 수비학 계산
  const targetDay = targetDate.getDate();
  const targetMonth = targetDate.getMonth() + 1;
  const targetYear = targetDate.getFullYear();
  const dailyVibration = ((targetYear + targetMonth + targetDay + birthSum) % 7);

  // 7대 법칙 공명 계산
  const principles: HermeticPrincipleStatus[] = [
    {
      nameEn: 'Mentalism',
      nameKo: '정신성의 원리',
      aphorism: '우주는 마음이며, 모든 현상은 생각의 투영이다.',
      alignmentScore: 70 + ((birthSum * 3 + targetDay) % 29),
      lifeApplication: '상황을 바꾸려 애쓰기보다 상황을 해석하는 내면의 신념 체계를 먼저 재설계하십시오.'
    },
    {
      nameEn: 'Correspondence',
      nameKo: '상응의 원리',
      aphorism: '위에서와 같이 아래에서도, 안에서와 같이 밖에서도 그러하다.',
      alignmentScore: 65 + ((birthSum * 5 + targetMonth) % 33),
      lifeApplication: '외부 환경의 혼란은 내면 무질서의 거울입니다. 방을 정리하고 호흡을 정돈하면 일도 풀립니다.'
    },
    {
      nameEn: 'Vibration',
      nameKo: '진동의 원리',
      aphorism: '어떤 것도 멈춰 있지 않으며 모든 것은 진동한다.',
      alignmentScore: 75 + ((birthSum * 7 + targetYear) % 24),
      lifeApplication: '부정적 감정이 들 때는 억누르기보다 신체 활동과 긍정적인 언어로 마음의 방향을 전환하십시오.'
    },
    {
      nameEn: 'Polarity',
      nameKo: '극성의 원리',
      aphorism: '모든 것은 양면성을 가지며, 반대되는 것은 본질상 동일한 것의 양 극단이다.',
      alignmentScore: 68 + ((birthSum * 2 + targetDay * 2) % 31),
      lifeApplication: '두려움과 용기는 같은 감정의 양 극단입니다. 시선을 돌리듯 마음의 방향을 용기로 옮기십시오.'
    },
    {
      nameEn: 'Rhythm',
      nameKo: '리듬의 원리',
      aphorism: '진자의 왕복 운동은 모든 것에 나타나며, 밀물이 오면 썰물이 뒤따른다.',
      alignmentScore: 72 + ((birthSum * 4 + targetDay * 3) % 27),
      lifeApplication: '슬럼프나 침체기가 올 때 불안해하지 마십시오. 파도가 물러서는 것은 더 큰 도약을 준비하는 자연의 호흡입니다.'
    },
    {
      nameEn: 'Cause and Effect',
      nameKo: '원인과 결과의 원리',
      aphorism: '모든 원인에는 결과가 있고, 우연이란 발견되지 않은 법칙의 이름일 뿐이다.',
      alignmentScore: 80 + ((birthSum * 6 + targetMonth * 4) % 19),
      lifeApplication: '타인의 반응과 세상의 사건에 무력하게 끌려가지 말고, 당신 스스로 원인을 만드는 창조자가 되십시오.'
    },
    {
      nameEn: 'Gender',
      nameKo: '성별의 원리',
      aphorism: '모든 것에는 능동적 남성성(창조/행동)과 수용적 여성성(잉태/직관)이 공존한다.',
      alignmentScore: 66 + ((birthSum * 8 + targetDay * 5) % 32),
      lifeApplication: '목표를 향해 밀어붙이는 결단력(양)과 결과를 믿고 기다리는 수용성(음)의 황금 균형을 맞추십시오.'
    }
  ];

  // 주도 원리 선정
  const masterIdx = dailyVibration;
  const master = principles[masterIdx];

  // 리듬 페이즈 판정
  const rhythmScore = principles[4].alignmentScore;
  let rhythmPhase: '밀물(진전/확장기)' | '썰물(정리/내면화기)' | '전환점(진자 극점)';
  if (rhythmScore >= 85) rhythmPhase = '밀물(진전/확장기)';
  else if (rhythmScore <= 72) rhythmPhase = '썰물(정리/내면화기)';
  else rhythmPhase = '전환점(진자 극점)';

  // 7대 원리의 평균 정렬도
  const avgAlignment = Math.round(principles.reduce((a, b) => a + b.alignmentScore, 0) / 7);
  const principleAlignmentScore = avgAlignment;

  // 극성 초월 진단
  const dualities = [
    { pair: '결핍감 vs 풍요의식', shift: '이미 가진 것에 집중하여 감사하는 마음으로 전환하십시오.' },
    { pair: '통제욕 vs 방임의 두려움', shift: '할 수 있는 최선에만 집중하고 결과는 우주의 흐름에 맡기십시오.' },
    { pair: '타인의 평가 vs 진정한 자기다움', shift: '외부의 시선에서 벗어나 내면의 고유한 직관에 귀를 기울이십시오.' },
    { pair: '과거의 후회 vs 미래의 불안', shift: '오직 현존(지금 이 순간)에 닻을 내림으로써 양 극단의 환영을 초월하십시오.' }
  ];
  const chosenDuality = dualities[birthSum % dualities.length];

  return {
    engineVersion: HERMETIC_KYBALION_VERSION,
    calculatedAt: targetDate.toISOString(),
    masterPrinciple: {
      nameKo: master.nameKo,
      nameEn: master.nameEn,
      coreInsight: master.aphorism,
      alchemicalKey: master.lifeApplication
    },
    principleAlignmentScore,
    rhythmPhase,
    polarityTranscendence: {
      currentDuality: chosenDuality.pair,
      transcendenceShift: chosenDuality.shift
    },
    cosmicPrinciples: principles,
    hermeticWisdomDirective: `현재 당신의 에너지는 '${master.nameKo}'의 법칙 아래 움직이고 있습니다. 리듬은 '${rhythmPhase}' 국면이므로, ${rhythmPhase === '밀물(진전/확장기)' ? '주저하지 말고 의도를 우주에 선포하고 적극적으로 실행' : '무리한 확장 대신 내면의 배터리를 충전하고 다음 주기를 준비'}하십시오.`
  };
}

export function formatHermeticKybalionPrompt(rep: HermeticKybalionReport): string {
  const principlesStr = rep.cosmicPrinciples
    .map(p => `• [${p.nameKo} (${p.nameEn})] 공명도 ${p.alignmentScore}% | ${p.aphorism}`)
    .join('\n');

  return `[헤르메스 카이발리온 7대 우주 불변 법칙 진동 리포트 (The Kybalion Principles)]
- 엔진 버전: ${rep.engineVersion}
- 현재 주도 우주 원리: ${rep.masterPrinciple.nameKo} (${rep.masterPrinciple.nameEn})
  • 핵심 통찰: "${rep.masterPrinciple.coreInsight}"
  • 정신 연금술 키: ${rep.masterPrinciple.alchemicalKey}
- 7대 원리 평균 정렬도: ${rep.principleAlignmentScore}%
- 우주적 리듬 국면: ${rep.rhythmPhase}
- 극성 초월 과제: [${rep.polarityTranscendence.currentDuality}] → ${rep.polarityTranscendence.transcendenceShift}
- 7대 법칙 공명 매트릭스:
${principlesStr}
- 카이발리온 행동 지침:
  ${rep.hermeticWisdomDirective}
※ 상담 시 내담자가 겪는 외적 고민을 단순한 운이 아닌, '원인과 결과', '극성', '리듬' 등 우주 법칙의 필연적 상호작용 관점에서 조망해 주어 스스로 삶의 통제권을 회복하도록 이끌어주세요.`;
}

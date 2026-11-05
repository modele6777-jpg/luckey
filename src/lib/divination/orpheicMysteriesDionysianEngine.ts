/**
 * 고대 그리스 오르페우스 신비주의 & 므네모시네 기억의 샘 각성 엔진 (Orpheic Mysteries & Mnemosyne Awakening Engine)
 *
 * 고대 그리스 오르페우스교(Orphism)의 황금판(Gold Tablets)에 새겨진 영혼의 불멸 선언과
 * 망각의 샘(Lethe) 대신 영원한 신성한 지혜인 기억의 샘(Mnemosyne)의 차가운 물을 마시는 통과의례를
 * 현대인의 본질적 자아 각성, 영적 주권 회복, 디오니소스적 생명 환희에 연동합니다.
 */

export const ORPHEIC_MYSTERIES_ENGINE_VERSION = 'LUCKEY-ORPHEIC-MYSTERIES-v1.0.0';

export interface OrphicMysteriesReport {
  engineVersion: string;
  calculatedAt: string;
  divineLineageDeclaration: string; // 영혼의 신성한 근원 선언
  memoryWellAwakeningScore: number; // 0 ~ 100 (므네모시네 기억의 샘 각성도)
  dionysianEcstasyVitality: number; // 0 ~ 100 (디오니소스적 생명 환희 지수)
  goldTabletPassportCode: string; // 황금판 영혼 통행 코드
  soulAwakeningPrescription: string; // 영혼 각성 및 일상 해탈 실천 지침
}

export function calculateOrpheicMysteries(params: {
  profile?: any;
  question?: string;
  now?: Date;
}): OrphicMysteriesReport {
  const now = params.now || new Date();
  const basic = params.profile?.basic;
  const birthdateStr = basic?.birthdate?.trim() || '1994-01-24';
  const question = params.question || '';

  let seed = 0;
  for (let i = 0; i < birthdateStr.length; i++) {
    seed += birthdateStr.charCodeAt(i) * (i + 17);
  }
  for (let i = 0; i < question.length; i++) {
    seed += question.charCodeAt(i) * 37;
  }
  seed += now.getDate() * 29 + now.getMonth() * 67;

  const memoryWellAwakeningScore = 70 + (Math.abs(seed * 7) % 29);
  const dionysianEcstasyVitality = 65 + (Math.abs(seed * 13) % 34);

  const divineLineageDeclaration = '나는 대지(Earth)와 별빛 가득한 밤하늘(Starry Heaven)의 아이이다. 내 참된 영혼의 혈통은 오직 하늘에 속해 있다.';

  const tabletCodes = [
    'MNEMOSYNE-GOLDEN-PASS-VITA-ETERNAL',
    'ORPHIC-CYPRESS-LAKE-IMMORTAL-LIGHT',
    'DIONYSUS-BACCHIC-SPRING-BOUNDLESS-JOY',
    'APOLLO-LYRE-COSMIC-HARMONY-KEY',
  ];
  const goldTabletPassportCode = tabletCodes[Math.abs(seed) % tabletCodes.length];

  const soulAwakeningPrescription = `오늘 세상의 시끄러운 소음과 부정적 최면에 휘말려 망각의 샘(Lethe)에 빠지지 마세요. 당신의 본질은 무한한 우주의 창조주와 직결된 별빛의 자식입니다. 시원한 물 한 잔을 천천히 마시며 당신의 본래 신성함을 회상할 때 고차원적 통찰이 활짝 열립니다.`;

  return {
    engineVersion: ORPHEIC_MYSTERIES_ENGINE_VERSION,
    calculatedAt: now.toISOString(),
    divineLineageDeclaration,
    memoryWellAwakeningScore,
    dionysianEcstasyVitality,
    goldTabletPassportCode,
    soulAwakeningPrescription,
  };
}

export function formatOrpheicMysteriesPrompt(report: OrphicMysteriesReport): string {
  return `### 🏛️ 고대 그리스 오르페우스 신비주의 & 므네모시네 기억의 샘 실측 데이터 (${report.engineVersion})
- **영혼의 신성한 근원 선언**: "${report.divineLineageDeclaration}"
- **므네모시네(Mnemosyne) 기억의 샘 각성도**: ${report.memoryWellAwakeningScore}점 / 100점
- **디오니소스적 생명 환희 지수**: ${report.dionysianEcstasyVitality}점 / 100점
- **오르페우스 황금판 패스포트 코드**: \`${report.goldTabletPassportCode}\`
- **영혼 각성 실천 지침**: ${report.soulAwakeningPrescription}`;
}

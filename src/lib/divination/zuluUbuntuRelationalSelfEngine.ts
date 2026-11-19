/**
 * =========================================================================
 * LUCKEY 줄루 우부투(Ubuntu) 관계적 자아 & 상호존중 엔진
 * (Zulu Ubuntu Relational Self Engine)
 * =========================================================================
 *
 * [전통적 배경]
 * 남아프리카 줄루(Zulu)를 비롯한 남아프리카 봉투(bantu) 문화권의 '우부투(Ubuntu)'는
 * 사람은 다른 사람을 통해서 사람이 된다는 관계적 인간관으로 널리 전해진다. 나의
 * 존엄은 타인의 존엄과 얽혀 있으며, 공동체의 화해·나눔·인정이 곧 나의 성숙이라는
 * 통찰은 현대 남아공의 화해 담론에서도 살아 있다.
 *
 * 본 엔진은 우부투의 세 축(인정·나눔·화해)을 질문 주제와 KST 시간대 리듬에 매핑해
 * 관계 속 나의 자리를 정성적으로 성찰하게 한다.
 *
 * 원칙:
 * 1. 개인 점수·심리 진단·미래 예측이 아닙니다. 모든 산출은 상징 성찰 문장입니다.
 * 2. 우부투는 살아 있는 구전·문화 전통이므로 특정 인물의 발언을 직접 인용하며 귀속하지
 *    않고, 주제만 요약해 상징으로 씁니다.
 * 3. 우부투의 상호성은 자기희생이나 무조건적 순응을 권하지 않습니다. 동의·안전·법적
 *    경계를 존중하는 한에서 관계를 돌아봅니다.
 *
 * @version LUCKEY-ZULU-UBUNTU-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const ZULU_UBUNTU_RELATIONAL_SELF_VERSION = 'LUCKEY-ZULU-UBUNTU-v2.1.0';

export type UbuntuQuestionTopic = 'decision' | 'relationship' | 'healing' | 'reflection';

export interface UbuntuRelationalPillar {
  pillarKey: 'ukwemba' | 'okuhle' | 'ukuthula';
  pillarNameKo: string;
  pillarMeaning: string;
  todayPractice: string;
}

export interface SituationalUbuntuAudit {
  questionTopic: UbuntuQuestionTopic;
  relationalMirror: string;     // 질문을 관계의 거울에 비춘 문장
  acknowledgmentStep: string;   // 인정의 한 걸음
  boundaryNote: string;         // 경계 지키기 노트
}

export interface UbuntuTemporalRhythm {
  kstHourWindow: string;
  seasonGatheringTone: string;
  gatheringAdvice: string;
}

export interface UbuntuSynthesisMatrix {
  dominantPillar: string;
  reciprocityState: string;
  integratedAction: string;
}

export interface ZuluUbuntuRelationalSelfResult {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  questionTopic: UbuntuQuestionTopic;
  activePillar: UbuntuRelationalPillar;
  situationalUbuntuAudit: SituationalUbuntuAudit;
  temporalUbuntuRhythm: UbuntuTemporalRhythm;
  ubuntuSynthesisMatrix: UbuntuSynthesisMatrix;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

export const UBUNTU_RELATIONAL_PILLARS: UbuntuRelationalPillar[] = [
  {
    pillarKey: 'ukwemba',
    pillarNameKo: '인정(Ukwemba) — 서로를 세우는 자리',
    pillarMeaning: '상대의 존재를 먼저 알아보고 이름을 부르는 태도입니다. 공동체에서 사람은 소속의 확인으로 존엄을 세워 왔습니다.',
    todayPractice: '오늘 마주하는 사람 한 명에게 형식을 벗어난 진심 인사 한 줄을 직접 건네기.',
  },
  {
    pillarKey: 'okuhle',
    pillarNameKo: '나눔(Okuhle) — 좋은 것을 함께 가지는 자리',
    pillarMeaning: '가진 것을 나눌 때 관계의 밧줄이 두꺼워진다는 통찰입니다. 물질뿐 아니라 시간·정보·주의의 나눔을 포함합니다.',
    todayPractice: '내가 가진 정보나 시간 가운데 부담 없이 나눌 수 있는 것 하나를 오늘 건네기.',
  },
  {
    pillarKey: 'ukuthula',
    pillarNameKo: '화평(Ukuthula) — 조용히 회복하는 자리',
    pillarMeaning: '다툼이 끊어지지 않을 때, 마을 원로들은 말보다 침묵과 화해의 절차로 숨을 돌리게 했다는 전승의 결입니다.',
    todayPractice: '밀린 사과나 고마움 한 가지를 짧은 문장으로 전하거나, 대화를 잠시 거두어 돌아오기.',
  },
];

function classifyUbuntuQuestionTopic(query?: string): UbuntuQuestionTopic {
  const q = (query ?? '').toLowerCase();
  if (/관계|사람|연인|연애|가족|친구|동료|갈등|다툼|화해|서운|이별|사랑|결혼/.test(q)) return 'relationship';
  if (/결정|선택|이직|창업|시작|계약|돈|재물|커리어|진로|협상|동업/.test(q)) return 'decision';
  if (/불안|지침|우울|회복|휴식|건강|수면|힘들|외로|슬픔/.test(q)) return 'healing';
  return 'reflection';
}

function buildUbuntuTemporalRhythm(now: Date): UbuntuTemporalRhythm {
  const { hour, month } = getSilaLikeKstParts(now);

  let kstHourWindow = '새벽 — 마을이 아직 조용한 시간';
  let gatheringAdvice = '아직 사람들이 깨지 않은 시간입니다. 오늘 건네고 싶은 말을 미리 골라 두세요.';

  if (hour >= 5 && hour < 11) {
    kstHourWindow = '아침 — 마을이 문을 여는 시간';
    gatheringAdvice = '첫 인사가 하루의 관계 톤을 정합니다. 부탁보다 안부로 시작하는 문장을 준비하세요.';
  } else if (hour >= 11 && hour < 17) {
    kstHourWindow = '낮 — 공동체가 움직이는 시간';
    gatheringAdvice = '협업과 조율이 활발한 시간입니다. 밀린 답장이나 확인 약속 하나를 정리해 넘어가세요.';
  } else if (hour >= 17 && hour < 22) {
    kstHourWindow = '저녁 — 모닥불에 돌아앉는 시간';
    gatheringAdvice = '하루의 관계를 돌아보는 시간입니다. 고마움을 전하지 못한 사람이 있는지 떠올려 보세요.';
  } else {
    kstHourWindow = '밤 — 원로의 이야기가 끝난 시간';
    gatheringAdvice = '관계의 답을 밤새 다그치지 마세요. 잠들기 전 감사 한 가지만 마음에 두면 충분합니다.';
  }

  let seasonGatheringTone = '겨울 · 화롯가 계절 — 가까운 이들과 둥글게 모이는 때';
  if (month >= 3 && month <= 5) seasonGatheringTone = '봄 · 파종 계절 — 새 인연에 씨앗을 심는 때';
  else if (month >= 6 && month <= 8) seasonGatheringTone = '여름 · 공동체 농경 계절 — 함께 일하는 손이 많아지는 때';
  else if (month >= 9 && month <= 11) seasonGatheringTone = '가을 · 수확 계절 — 나눈 것의 결실을 확인하는 때';

  return {
    kstHourWindow,
    seasonGatheringTone,
    gatheringAdvice,
  };
}

function getSilaLikeKstParts(now: Date): { hour: number; month: number } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    hour: 'numeric',
    month: 'numeric',
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  return {
    hour: Number(parts.find((p) => p.type === 'hour')?.value || '12') % 24,
    month: Number(parts.find((p) => p.type === 'month')?.value || '1'),
  };
}

function buildSituationalUbuntuAudit(query: string, topic: UbuntuQuestionTopic): SituationalUbuntuAudit {
  if (topic === 'relationship') {
    return {
      questionTopic: topic,
      relationalMirror: '갈등의 두 사람은 서로가 서로의 거울 — 내가 억누른 마음이 상대를 통해 울리는 풍경',
      acknowledgmentStep: '상대의 입장에서 맞는 말 한 가지를 먼저 골라 인정한 뒤, 내 바람을 덧붙여 보세요.',
      boundaryNote: '인정은 순응이 아닙니다. 불편한 조건은 분명한 경계로 지키되, 사람의 존엄을 향한 말은 피하세요.',
    };
  }
  if (topic === 'decision') {
    return {
      questionTopic: topic,
      relationalMirror: '결정의 자리에 앉은 사람은 혼자가 아니라 여러 이야기 속에 앉아 있는 풍경',
      acknowledgmentStep: '이 결정으로 영향을 받을 사람을 떠올리고, 그중 한 사람의 입장을 한 문장으로 적어 보세요.',
      boundaryNote: '공동체의 시선을 지나치게 의존해 나의 판단을 미루지 마세요. 조언은 받되 결정 주체는 유지하세요.',
    };
  }
  if (topic === 'healing') {
    return {
      questionTopic: topic,
      relationalMirror: '지친 사람이 마을 어귀에 앉아 있는 풍경 — 회복도 공동체의 돌봄 속에서 더디고 안전하게',
      acknowledgmentStep: '지금 내게 필요한 도움 한 가지를 구체적인 부탁의 형태로 바꾸어 가까운 이에게 전해 보세요.',
      boundaryNote: '돌봄을 받는 것이 약함이 아닙니다. 다만 부담을 느끼는 관계라면 거리를 두어도 괜찮습니다.',
    };
  }
  return {
    questionTopic: topic,
    relationalMirror: '나를 돌아보는 시선 속에 함께한 사람들의 얼굴이 스쳐 지나가는 풍경',
    acknowledgmentStep: '내가 오늘의 나를 만든 관계 하나를 떠올리고 감사의 문장을 짧게 적어 보세요.',
    boundaryNote: '관계적 자아는 나를 지우는 것이 아니라, 나와 타인이 함께 선 명확한 경계 위에서 세워집니다.',
  };
}

export function calculateZuluUbuntuRelationalSelf(
  profile?: UserProfile,
  question?: string,
  now: Date = new Date(),
): ZuluUbuntuRelationalSelfResult {
  const name = profile?.basic?.name ?? '방문자';
  const birthdate = profile?.basic?.birthdate ?? '';
  const birthtime = profile?.basic?.birthtime ?? '';
  const topic = classifyUbuntuQuestionTopic(question);

  const seedString = `ZULU-UBUNTU:${name}:${birthdate}:${birthtime}:${topic}:${(question ?? '').trim()}`;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const activePillar = UBUNTU_RELATIONAL_PILLARS[absHash % UBUNTU_RELATIONAL_PILLARS.length];
  const situationalUbuntuAudit = buildSituationalUbuntuAudit(question ?? '', topic);
  const temporalUbuntuRhythm = buildUbuntuTemporalRhythm(now);

  const interpretiveBoundary =
    '본 리포트는 남아프리카 우부투(Ubuntu)의 관계적 자아 상징을 빌려 관계와 공동체 속 나의 자리를 성찰하도록 돕는 정성적 안내이며, 개인 점수·심리 진단·미래 예측이 아닙니다. 우부투의 상호성은 자기희생이나 무조건적 순응을 권하지 않으며, 동의·안전·법적 경계가 우선입니다.';

  const trimmedQ = (question ?? '').trim();
  const ritualAction = `${activePillar.todayPractice} 이어서 ${situationalUbuntuAudit.acknowledgmentStep}`;
  const reflectionFocus = `${activePillar.pillarNameKo}의 결과 ${temporalUbuntuRhythm.kstHourWindow} — 오늘 관계에서 내가 먼저 베풀 한 가지`;
  const reflectiveQuestion = trimmedQ
    ? `'${trimmedQ}'라는 질문 앞에서, 이 관계에서 상대를 세우는 일과 나를 지키는 일을 오늘 각각 어떻게 겸해 갈 수 있을까요?`
    : `오늘 나를 세워 준 관계 하나와, 내가 세워 주고 싶어진 관계 하나는 각각 무엇인가요?`;

  const ubuntuSynthesisMatrix: UbuntuSynthesisMatrix = {
    dominantPillar: activePillar.pillarNameKo,
    reciprocityState: `${temporalUbuntuRhythm.kstHourWindow} · ${temporalUbuntuRhythm.seasonGatheringTone}`,
    integratedAction: `${situationalUbuntuAudit.acknowledgmentStep}${trimmedQ ? ` [질문 맥락: ${trimmedQ}]` : ''}`,
  };

  const kst = new Date(now.getTime() + 9 * 3600 * 1000);
  const calculatedAtKst = `${kst.toISOString().slice(0, 19)}+09:00 (KST)`;

  return {
    engineVersion: ZULU_UBUNTU_RELATIONAL_SELF_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    questionTopic: topic,
    activePillar,
    situationalUbuntuAudit,
    temporalUbuntuRhythm,
    ubuntuSynthesisMatrix,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary,
  };
}

export function formatZuluUbuntuRelationalSelfPrompt(res: ZuluUbuntuRelationalSelfResult): string {
  return [
    `【줄루 우부투(Ubuntu) 관계적 자아 & 상호존중 (${res.engineVersion} | ${res.calculatedAtKst})】`,
    `- 질문 주제 분류: ${res.questionTopic}`,
    `- 오늘의 관계 기둥: ${res.activePillar.pillarNameKo}`,
    `- 기둥의 뜻: ${res.activePillar.pillarMeaning}`,
    `- 질문 비춤(관계 거울): ${res.situationalUbuntuAudit.relationalMirror}`,
    `- 인정의 한 걸음: ${res.situationalUbuntuAudit.acknowledgmentStep}`,
    `- 경계 지키기 노트: ${res.situationalUbuntuAudit.boundaryNote}`,
    `- KST 공동체 리듬: ${res.temporalUbuntuRhythm.kstHourWindow} (${res.temporalUbuntuRhythm.seasonGatheringTone})`,
    `- 모임 지침: ${res.temporalUbuntuRhythm.gatheringAdvice}`,
    `- 우부투 교차 매트릭스: 기둥(${res.ubuntuSynthesisMatrix.dominantPillar}) · 주고받음 상태(${res.ubuntuSynthesisMatrix.reciprocityState}) · 통합 실천(${res.ubuntuSynthesisMatrix.integratedAction})`,
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

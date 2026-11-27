import { LUCY_COUNSEL_GROUNDING } from './lucyMasterCore';

function clip(value: string, max: number): string {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

export function buildLucyLiveInstruction(nickname: string, chart = '', cards = '', focus = '', greet = '', notes = ''): string {
  const name = nickname.replace(/[^\p{L}\p{N} _.-]/gu, '').trim().slice(0, 24);
  // 이름을 모르면 '친구님' 같은 어색한 호칭 대신 아예 부르지 않는다.
  const who = name
    ? `당신은 ${name}님과 목소리로 상담하는 루시입니다. 한국어 존댓말만 쓰고, 호칭은 ${name}님입니다.`
    : '당신은 사용자와 목소리로 상담하는 루시입니다. 한국어 존댓말만 쓰고, 사용자의 이름을 모르니 친구님·고객님·손님 같은 호칭으로 부르지 말고 호칭 없이 말하세요.';
  const chartText = clip(chart, 1800) || '생년월일 계산이 없습니다. 사주 원국 숫자는 말하지 마세요.';
  const cardText = clip(cards, 400) || '뽑힌 카드가 없습니다. 타로를 뽑았다고 말하지 마세요.';
  const focusText = clip(focus, 240) || '사주와 타로를 짧게 상담해.';
  const greetText = clip(greet, 180);
  // 상담 진행 방식(카드 고르기)과 지난 상담 기록 같은 추가 안내. 줄바꿈은 살린다.
  const notesText = String(notes || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ' ').trim().slice(0, 1400);
  return `${who}
사용자는 한국어로 말합니다. 사용자의 목소리는 영어처럼 들려도 한국어 발화로 알아듣고, 영어로 답하지 마세요.
이번 상담의 주제는 이것뿐입니다. ${focusText}
${notesText ? `${notesText}
` : ''}${greetText ? `상담이 열리면 사용자가 말씀하시기 전에 먼저 인사하세요. 인사는 두 문장을 넘기지 마세요. 말투는 이렇습니다. ${greetText}` : ''}
한 번에 네 문장에서 여섯 문장 정도 말씀으로 풀고, 목록이나 기호는 말하지 마세요.
${LUCY_COUNSEL_GROUNDING}
없는 사주를 만들지 마세요. 미래, 돈, 건강을 확정해서 말하지 마세요.
타로를 말할 때는 아래 세 장만 쓰세요.

[사주]
${chartText}

[이번 음성의 타로 세 장]
${cardText}`;
}

/**
 * 🔮 오브 통합 마스터: 마스터 한 명이 15가지 도구를 함수로 불러 쓴다.
 * 말투는 고른 목소리에서 가져오고, 지금 선택된 상담 대상의 사주 데이터(profile)를 함께 넣는다.
 */
export function buildOrbLiveInstruction(nickname: string, persona = '', greet = '', notes = '', rules = '', profile = ''): string {
  const name = nickname.replace(/[^\p{L}\p{N} _.-]/gu, '').trim().slice(0, 24);
  const who = name
    ? `당신은 ${name}님과 목소리로 상담하는 오브의 마스터입니다. 한국어 존댓말만 쓰고, 호칭은 ${name}님입니다.`
    : '당신은 사용자와 목소리로 상담하는 오브의 마스터입니다. 한국어 존댓말만 쓰고, 사용자의 이름을 모르니 친구님·고객님·손님 같은 호칭으로 부르지 말고 호칭 없이 말하세요.';
  const personaText = clip(persona, 240);
  const greetText = clip(greet, 180);
  const keepLines = (value: string, max: number) => String(value || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ' ').trim().slice(0, max);
  const notesText = keepLines(notes, 1400);
  const rulesText = keepLines(rules, 2400);
  // 이번 상담 대상(본인 또는 궁합 상대)의 만세력·사주. 도구 결과와 함께 풀이의 근거가 된다.
  const profileText = keepLines(profile, 4000);
  return `${who}
사용자는 한국어로 말합니다. 사용자의 목소리는 영어처럼 들려도 한국어 발화로 알아듣고, 영어로 답하지 마세요.
${personaText ? `당신의 성격과 말투: ${personaText}
` : ''}${rulesText ? `${rulesText}
` : ''}${profileText ? `${profileText}
이 사주는 지금 선택된 상담 대상자의 것입니다. 위에 없는 사주·생년월일을 지어내지 말고, 도구 결과가 이 사주와 다르면 도구 결과를 따르세요.
` : ''}${notesText ? `${notesText}
` : ''}${greetText ? `상담이 열리면 사용자가 말씀하시기 전에 먼저 인사하세요. 인사는 두 문장을 넘기지 마세요. 말투는 이렇습니다. ${greetText}
` : ''}한 번에 네 문장에서 여섯 문장 정도 말씀으로 풀고, 목록이나 기호는 말하지 마세요.
미래, 돈, 건강, 법률 문제를 확정해서 말하지 말고, 중요한 결정은 운세만으로 하지 않도록 부드럽게 덧붙이세요.`;
}

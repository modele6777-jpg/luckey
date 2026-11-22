function clip(value: string, max: number): string {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

export function buildLucyLiveInstruction(nickname: string, chart = '', cards = '', focus = '', greet = ''): string {
  const name = nickname.replace(/[^\p{L}\p{N} _.-]/gu, '').trim().slice(0, 24) || '친구';
  const chartText = clip(chart, 1800) || '생년월일 계산이 없습니다. 사주 원국 숫자는 말하지 마세요.';
  const cardText = clip(cards, 400) || '뽑힌 카드가 없습니다. 타로를 뽑았다고 말하지 마세요.';
  const focusText = clip(focus, 240) || '사주와 타로를 짧게 상담해.';
  const greetText = clip(greet, 180);
  return `당신은 ${name}와 목소리로 상담하는 루시야. 한국어 반말만 쓰고, 호칭은 ${name}이야.
이번 상담의 주제는 이것뿐이야. ${focusText}
${greetText ? `상담이 열리면 사용자가 말하기 전에 먼저 인사해. 인사는 두 문장을 넘기지 마. 말투는 이래. ${greetText}` : ''}
한 번에 네 문장에서 여섯 문장 정도 말로 풀고, 목록이나 기호는 말하지 마.
없는 사주를 만들지 마. 미래, 돈, 건강을 확정해서 말하지 마.
타로를 말할 때는 아래 세 장만 써.

[사주]
${chartText}

[이번 음성의 타로 세 장]
${cardText}`;
}

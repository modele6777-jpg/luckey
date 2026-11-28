import { safeSessionStorage } from '../utils/safeStorage';

/**
 * 루시채팅(일반 대화)은 점을 보지 않는다.
 * 점을 원하면 바로 옮기지 않고 이동 버튼으로 루시프로에 가고, 그 외에는 운명학을 빼며 여러 관점으로만 말한다.
 */

const HANDOFF_KEY = 'lucy_pro_reading_handoff';

/** 점·운세를 거절하는 말. 이 경우는 채팅에 남긴다. */
const DECLINE_READING = /(점|운세|사주|타로|궁합|카드).{0,18}(말고|빼\s*고|하지\s*마|싫어|안\s*(?:해|봐|볼)|필요\s*없|그만|됐)/;

/**
 * 사용자가 점·운세를 직접 원한 경우.
 * "점점", "점수", "오늘 운동" 같은 말은 걸리지 않는다.
 */
const WANTS_READING = /(점을?\s*(?:봐|봐줘|보고\s*싶|볼래|보자|좀|해\s*줘|해줄|쳐\s*줘|보러)|점\s*좀|운세|사주\s*(?:봐|봐줘|풀|해석|좀|알려|해\s*줘|보고|어때)|타로\s*(?:봐|봐줘|뽑|해\s*줘|하자|볼래|리딩|쳐|해석|알려)|카드\s*(?:뽑|봐줘|펼|깔)|궁합\s*(?:봐|봐줘|해|알려|좀|어때)|(?:재물|애정|금전|연애|직업|건강)운|(?:오늘|내일|이번\s*주|이번\s*달|올해)\s*운(?!동)|신점|점괘|사주팔자|명리\s*(?:봐|풀|해석|알려)|점집|운\s*봐)/;

export function wantsLucyProReading(text: string): boolean {
  const clean = (text || '').replace(/\s+/g, ' ').trim();
  if (!clean || DECLINE_READING.test(clean)) return false;
  return WANTS_READING.test(clean);
}

export function queueLucyProReading(text: string): void {
  const clean = (text || '').trim().slice(0, 500);
  if (!clean) return;
  try { safeSessionStorage.setItem(HANDOFF_KEY, clean); } catch { /* storage optional */ }
}

export function consumeLucyProReading(): string | null {
  try {
    const value = safeSessionStorage.getItem(HANDOFF_KEY);
    safeSessionStorage.removeItem(HANDOFF_KEY);
    const clean = (value || '').trim();
    return clean || null;
  } catch {
    return null;
  }
}

export interface LucyChatPerspective {
  id: string;
  name: string;
  hint: string;
  when: RegExp;
}

/** 운명학이 아닌, 같은 이야기를 나눠 보는 관점. */
export const LUCY_CHAT_PERSPECTIVES: readonly LucyChatPerspective[] = [
  { id: 'feeling', name: '감정의 관점', hint: '지금 느끼는 감정의 이름과, 그 감정이 지키려는 것', when: /기분|감정|우울|불안|화나|화가|서운|외로|지치|힘들|무서|슬프|답답|짜증/ },
  { id: 'relation', name: '관계의 관점', hint: '나와 상대가 서로 원하는 것, 그리고 확인하지 않고 단정하면 안 되는 것', when: /그\s*사람|남친|여친|애인|연애|친구|가족|부모|상사|동료|사이|관계|연락|답장|결혼/ },
  { id: 'choice', name: '선택의 관점', hint: '지금 고를 수 있는 것과 고를 수 없는 것', when: /결정|선택|고민|어떡|어떻게|갈림|이직|퇴사|진로|할까|될까|그만둘/ },
  { id: 'body', name: '몸의 관점', hint: '잠, 피로, 긴장처럼 몸이 먼저 말하는 신호', when: /잠|피곤|몸|아프|숨|긴장|두통|식욕|밤샘|무기력/ },
  { id: 'habit', name: '습관의 관점', hint: '반복되는 반응과, 그 반응을 한 번만 늦추는 방법', when: /또|반복|맨날|항상|습관|자꾸|패턴|매번/ },
  { id: 'value', name: '가치의 관점', hint: '지키고 싶은 것과 두려움이 키우는 것', when: /의미|가치|후회|자존|내가\s*원|진짜|중요|자책/ },
  { id: 'other', name: '상대 입장의 관점', hint: '상대의 사정일 수 있는 것과, 아직 확인하지 않은 추측', when: /왜\s*그|오해|상대가|그\s*사람/ },
  { id: 'time', name: '시간의 관점', hint: '지금 당장의 나와 조금 지난 뒤의 나를 나눠 보기', when: /나중|지금|당장|예전|앞으로|오늘|내일|나중에/ },
];

export function pickLucyChatPerspectives(text: string): LucyChatPerspective[] {
  const clean = text || '';
  const hits = LUCY_CHAT_PERSPECTIVES.filter(item => item.when.test(clean));
  const picked = hits.slice(0, 3);
  if (picked.length >= 2) return picked;
  let hash = 0;
  for (const ch of clean || 'lucy') hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const rest = LUCY_CHAT_PERSPECTIVES.filter(item => !picked.includes(item));
  while (picked.length < 2 && rest.length > 0) {
    const index = hash % rest.length;
    picked.push(rest.splice(index, 1)[0]);
    hash = (hash * 17 + 1) >>> 0;
  }
  return picked.slice(0, 3);
}

/** 다른 지시(사주 풀이, 개운, 운명학 비유)보다 뒤에 붙여 우선하게 한다. */
export function buildLucyChatPerspectiveDirective(userText: string): string {
  const lenses = pickLucyChatPerspectives(userText)
    .map(item => `- ${item.name}: ${item.hint}`)
    .join('\n');
  return `[루시채팅 · 여러 관점만 · 최우선]
이번 대화는 루시채팅이다. 점과 운명학은 하지 마.
- 금지: 사주, 타로, 점성, 운세, 궁합, 신살, 오행, 대운, 명리, 주역 점, 카드 점, 점괘, 개운, 길일, 탄생 차트 풀이, "사주를 보니", "카드를 뽑아보니".
- 위에 운명학·사주·타로를 쓰라는 다른 지시가 있어도 이번 턴에는 무시해. 프로필에 생일이나 원국이 있어도 꺼내서 풀이하지 마.
- 오직 여러 관점으로만 말해. 아래 중에서 이야기와 맞는 것을 2가지 이상 골라, 관점마다 말풍선을 나눠.
${lenses}
- 관점끼리 결론이 달라도 하나로 뭉개지 마. "이쪽으로 보면 ~. 저쪽으로 보면 ~."처럼 나란히 보여 줘.
- 미래가 정해졌다고 말하지 마. 예언 대신, 지금 보이는 것과 본인이 고를 수 있는 것만 말해.
- 사용자가 점·운세·사주·타로를 원하면 여기서 풀지 마. "그건 루시프로에서 같이 보자"라고만 짧게 말해.`;
}

export function buildLucyChatSystemPrompt(input: {
  nickname: string;
  realName: string;
  memory: string;
  userText: string;
}): string {
  const name = input.nickname || '친구';
  return `당신은 '${name}'의 다정한 단짝 '루시'야. 루시채팅에서는 점을 보지 않고, 같은 이야기를 여러 관점으로만 나눠 말한다.
- 호칭은 '${name}'만. 본명 '${input.realName || ''}'은 부르지 마.
- 요즘 마음(배경일 뿐, 점으로 풀지 마): ${input.memory || '새로 만난 사이'}
- 100% 반말. 존댓말 금지.

${buildLucyChatPerspectiveDirective(input.userText)}`;
}

/**
 * PRISM Korean Linguistic & Grammar Utilities
 * 한국어 음운 규칙(받침 및 조사 결합) 및 사용자 입력 문맥 정제 헬퍼
 */

/**
 * 한글 음절의 종성(받침) 유무 확인
 */
export function hasKoreanJongseong(word: string): boolean {
  if (!word) return false;
  const trimmed = word.trim().replace(/['"“”‘’()[\]]/g, '');
  if (!trimmed) return false;
  const lastChar = trimmed.slice(-1);
  const code = lastChar.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
}

/**
 * 한글 받침 유무에 따른 올바른 조사 반환
 */
export function getKoreanParticle(
  word: string,
  type: '은/는' | '이/가' | '을/를' | '과/와' | '으로/로' | '아/야'
): string {
  if (!word) return '';
  const trimmed = word.trim().replace(/['"“”‘’()[\]]/g, '');
  if (!trimmed) return '';
  const lastChar = trimmed.slice(-1);
  const code = lastChar.charCodeAt(0);

  if (code < 0xac00 || code > 0xd7a3) {
    const defaultMap = {
      '은/는': '은',
      '이/가': '이',
      '을/를': '을',
      '과/와': '과',
      '으로/로': '으로',
      '아/야': '아',
    };
    return defaultMap[type] || '';
  }

  const jongseong = (code - 0xac00) % 28;
  const hasJong = jongseong !== 0;

  switch (type) {
    case '은/는':
      return hasJong ? '은' : '는';
    case '이/가':
      return hasJong ? '이' : '가';
    case '을/를':
      return hasJong ? '을' : '를';
    case '과/와':
      return hasJong ? '과' : '와';
    case '으로/로':
      // 종성이 'ㄹ'(종성 번호 8)인 경우 '로' 결합 (예: 서울로, 연필로)
      return hasJong && jongseong !== 8 ? '으로' : '로';
    case '아/야':
      return hasJong ? '아' : '야';
    default:
      return '';
  }
}

/**
 * 단어에 올바른 조사를 결합한 문자열 반환
 * 예: attachKoreanParticle('분노', '과/와') -> '분노와'
 * 예: attachKoreanParticle('두려움', '과/와') -> '두려움과'
 * 예: attachKoreanParticle('통제', '을/를') -> '통제를'
 */
export function attachKoreanParticle(
  word: string,
  type: '은/는' | '이/가' | '을/를' | '과/와' | '으로/로' | '아/야'
): string {
  return `${word}${getKoreanParticle(word, type)}`;
}

/**
 * 사용자 입력 문장(구어체, 서술문, 서술어 종결)을 문맥상 매끄러운 고품격 명사구로 정제
 * 예: "앞일에 대한 불안과 결과가 잘못될까 봐 온종일 초조하고 안절부절못해요" -> "앞일에 대한 불안과 초조함"
 */
export function extractCleanConcernNoun(raw: string, fallback: string = '마음의 긴장'): string {
  if (!raw) return fallback;
  const trimmed = raw.trim();

  // 알려진 서술형 프리셋 패턴 매핑
  const KNOWN_PRESET_MAP: Record<string, string> = {
    '앞일에 대한 불안과 결과가 잘못될까 봐 온종일 초조하고 안절부절못해요': '앞일에 대한 불안과 초조함',
    '가까운 사람과의 대화에서 서운함과 답답한 응어리가 마음에 남아있어요': '관계의 서운함과 마음의 응어리',
    '‘그때 더 잘했어야 했는데’ 하는 자책과 후회가 꼬리를 물어요': '과거에 대한 자책과 후회',
    '내 뜻대로 완벽히 풀리지 않으면 견디기 힘든 통제 강박이 있어요': '완벽주의와 통제 강박',
    '마감과 할 일에 쫓겨 숨이 가쁘고 지친 피로감이 커요': '일정 압박과 지친 피로감',
    '이유를 알 수 없는 막연한 두려움과 무기력감에 짓눌려요': '막연한 두려움과 무기력',
    '내가 부족해서 모든 걸 다 망칠 것 같아...': '자신에 대한 불신과 실패 두려움',
    '그 사람이 어떻게 나한테 그럴 수가 있어?': '상대에 대한 서운함과 배신감',
    '왜 항상 나한테만 이런 억울한 일이 생길까?': '억울함과 피해 의식',
    '아무리 노력해도 앞으로 상황이 나아지지 않을 거야...': '미래에 대한 절망감과 무력감',
    '내가 그때 그렇게 바보같이 행동하지 말았어야 했는데...': '과거 행동에 대한 후회와 자책',
  };

  for (const [key, val] of Object.entries(KNOWN_PRESET_MAP)) {
    if (trimmed === key || trimmed.includes(key)) {
      return val;
    }
  }

  // 특수문자 및 따옴표 정돈
  let cleaned = trimmed.replace(/['"“”‘’]/g, '').trim();

  // 서술어 어미(~못해요, ~남아있어요 등)를 명사형으로 자연스럽게 치환
  cleaned = cleaned
    .replace(/(안절부절못해요|안절부절못합니다|초조해요|초조합니다)$/, '초조함과 불안')
    .replace(/(마음에 남아있어요|남아있습니다|응어리가 져요)$/, '마음의 응어리')
    .replace(/(꼬리를 물어요|꼬리를 뭅니다|끝이 없어요)$/, '생각의 굴레')
    .replace(/(통제 강박이 있어요|강박이 있습니다)$/, '통제 강박')
    .replace(/(피로감이 커요|피로감이 큽니다|지쳐요|지칩니다)$/, '깊은 피로감')
    .replace(/(짓눌려요|짓눌립니다|버거워요)$/, '마음의 압박감')
    .replace(/(망칠 것 같아\.\.\.|망칠 것 같아요)$/, '실패에 대한 두려움')
    .replace(/(그럴 수가 있어\?|그럴 수가 있나요\?)$/, '상대에 대한 원망')
    .replace(/(억울한 일이 생길까\?|억울해요|억울합니다)$/, '억울함과 피해 의식')
    .replace(/(나아지지 않을 거야\.\.\.|나아지지 않을 것 같아요)$/, '미래에 대한 절망감')
    .replace(/(말았어야 했는데\.\.\.|말았어야 했어요)$/, '과거에 대한 후회');

  // 일반 서술격 종결어미 제거
  cleaned = cleaned.replace(/(해요|합니다|돼요|됩니다|있어요|있습니다|같아요|같습니다|옵니다|들어요|듭니다)$/, '').trim();
  cleaned = cleaned.replace(/[.,?!~…]+$/g, '').trim();

  return cleaned || fallback;
}

/**
 * 오브 마스터 루시의 타로 배열.
 * 기본은 과거·지금·앞으로 세 장이고, 고민에 따라 다른 배열을 고른다.
 * 화면의 좌표는 보드 가로·세로 0~100 (카드 중심).
 */

export interface OrbSpreadSlot {
  x: number;
  y: number;
  rotate?: number;
}

export interface OrbSpread {
  id: string;
  name: string;
  reason: string;
  positions: string[];
  layout: OrbSpreadSlot[];
}

const at = (x: number, y: number, rotate?: number): OrbSpreadSlot => (rotate ? { x, y, rotate } : { x, y });

function spread(id: string, name: string, reason: string, positions: string[], layout: OrbSpreadSlot[]): OrbSpread {
  return { id, name, reason, positions, layout };
}

export const ORB_DEFAULT_SPREAD_ID = 'time-3';

export const ORB_SPREADS: readonly OrbSpread[] = [
  spread('one', '한 장의 메시지', '지금 가장 필요한 말 하나에 모읍니다', ['지금 필요한 메시지'], [at(50, 46)]),
  spread('time-3', '과거·지금·앞', '지나온 일, 지금, 앞으로를 나란히 봅니다', ['과거', '지금', '앞으로'], [at(18, 50), at(50, 50), at(82, 50)]),
  spread('situation', '상황·장애·조언', '지금 상황, 막힌 곳, 한 가지 조언을 봅니다', ['상황', '장애', '조언'], [at(18, 48), at(50, 48), at(82, 48)]),
  spread('mind', '마음 잇기', '나와 그 사람의 마음, 둘 사이 흐름을 봅니다', ['나의 마음', '그 사람의 마음', '관계의 흐름'], [at(22, 36), at(78, 36), at(50, 72)]),
  spread('yesno', '예 / 아니오', '질문의 핵과 흐름, 기우는 답을 봅니다', ['질문의 핵', '흐름', '기우는 답'], [at(50, 24), at(22, 70), at(78, 70)]),
  spread('money', '재물 흐름', '들어오는 곳, 새는 곳, 열쇠를 봅니다', ['재물의 흐름', '새는 곳', '늘리는 열쇠'], [at(18, 50), at(50, 50), at(82, 50)]),
  spread('daily', '오늘의 기운', '오늘 기운, 조심할 점, 행동을 봅니다', ['오늘의 기운', '조심할 점', '행동 조언'], [at(18, 50), at(50, 50), at(82, 50)]),
  spread('timing', '시기', '언제, 신호, 움직일 때를 봅니다', ['언제', '신호', '움직일 때'], [at(18, 50), at(50, 50), at(82, 50)]),
  spread('career', '진로 나침반', '지금 자리, 강점, 걸림, 방향을 봅니다', ['현재 위치', '강점', '걸림돌', '나아갈 방향'], [at(28, 30), at(72, 30), at(28, 72), at(72, 72)]),
  spread('conflict', '화해의 다리', '양쪽 입장, 뿌리, 화해의 열쇠를 봅니다', ['나의 입장', '상대의 입장', '갈등의 뿌리', '화해의 열쇠'], [at(28, 30), at(72, 30), at(28, 72), at(72, 72)]),
  spread('healing', '마음 돌봄', '아픈 곳, 원인, 돌봄, 회복을 봅니다', ['아픈 곳', '원인', '돌봄', '회복'], [at(28, 30), at(72, 30), at(28, 72), at(72, 72)]),
  spread('saju-4', '사주 네 기둥', '년·월·일·시 기둥에 카드를 얹어 봅니다', ['년주', '월주', '일주', '시주'], [at(14, 50), at(38, 50), at(62, 50), at(86, 50)]),
  spread('cross-5', '십자', '핵심과 위·아래·좌·우를 한 십자로 봅니다', ['핵심', '도움', '걸림', '숨은 마음', '결과'], [at(50, 46), at(50, 16), at(50, 78), at(18, 46), at(82, 46)]),
  spread('two-paths', '두 갈래', '지금과 A·B의 과정, 결과를 비교합니다', ['지금', 'A의 과정', 'A의 결과', 'B의 과정', 'B의 결과'], [at(50, 16), at(24, 48), at(24, 80), at(76, 48), at(76, 80)]),
  spread('mirror', '관계 거울', '나, 상대, 사이, 걸림, 앞으로를 봅니다', ['나', '상대', '사이를 잇는 것', '걸림', '앞으로의 관계'], [at(22, 28), at(78, 28), at(50, 28), at(50, 56), at(50, 84)]),
  spread('seasons', '한 해 사계절', '봄·여름·가을·겨울과 한 해의 조언을 봅니다', ['봄', '여름', '가을', '겨울', '한 해의 조언'], [at(24, 24), at(76, 24), at(24, 52), at(76, 52), at(50, 82)]),
  spread('path-6', '길의 여섯 장', '출발부터 도착까지 길의 결을 봅니다', ['출발', '도움', '걸림', '숨은 영향', '해야 할 일', '도착'], [at(20, 28), at(50, 28), at(80, 28), at(20, 70), at(50, 70), at(80, 70)]),
  spread('horseshoe', '말굽', '지나온 일부터 결과까지 일곱 장으로 펼칩니다', ['지나온 일', '지금', '다가올 일', '나의 태도', '주변의 영향', '걸림돌', '흐름의 결과'], [at(10, 78), at(16, 46), at(32, 20), at(50, 10), at(68, 20), at(84, 46), at(90, 78)]),
  spread(
    'celtic',
    '셀틱 크로스',
    '상황과 도전, 바탕과 결과까지 열 장으로 봅니다',
    ['현재 상황', '가로지르는 도전', '바탕', '지나온 영향', '가능한 것', '가까운 흐름', '나의 태도', '주변의 영향', '바람과 두려움', '결과'],
    [at(32, 46), at(32, 46, 78), at(32, 78), at(12, 46), at(32, 16), at(54, 46), at(84, 84), at(84, 62), at(84, 40), at(84, 16)],
  ),
];

const ORB_SPREAD_RULES: readonly { id: string; pattern: RegExp }[] = [
  { id: 'celtic', pattern: /셀틱|켈틱|celtic|10\s*장|열\s*장|십\s*장|전체적인\s*운명|인생\s*전체/i },
  { id: 'horseshoe', pattern: /말굽|7\s*장|일곱\s*장|전체\s*흐름/ },
  { id: 'path-6', pattern: /6\s*장|여섯\s*장|길의\s*흐름/ },
  { id: 'one', pattern: /한\s*장|원\s*카드|원카드/ },
  { id: 'seasons', pattern: /사계절|신년|올해|한\s*해|연간|한해/ },
  { id: 'saju-4', pattern: /4\s*기둥|네\s*기둥|사주\s*배열|년월일시|년주/ },
  { id: 'two-paths', pattern: /할까\s*말까|될지\s*말지|어느\s*쪽|둘\s*중|두\s*(?:가지|개|갈래)|갈림길|선택지/ },
  { id: 'yesno', pattern: /예\s*\/?\s*아니오|예스|yes\s*or\s*no|해도\s*될|가능할까|될까\s*말까/i },
  { id: 'cross-5', pattern: /십자\s*배열|십자가/ },
  { id: 'conflict', pattern: /갈등|싸웠|다퉜|화해|오해|사과|서운/ },
  { id: 'mirror', pattern: /우리\s*사이|관계\s*거울|서로\s*마음/ },
  { id: 'mind', pattern: /그\s*사람|연애|짝사랑|썸|재회|남친|여친|남자\s*친구|여자\s*친구|애인|궁합|좋아하는\s*사람/ },
  { id: 'career', pattern: /이직|퇴사|취업|취직|직장|회사|진로|커리어|면접|승진|창업|사업/ },
  { id: 'money', pattern: /돈|재물|투자|주식|코인|월급|수입|빚|저축|지출|부동산/ },
  { id: 'healing', pattern: /힐링|치유|지쳤|마음이\s*아프|위로|번아웃|우울/ },
  { id: 'daily', pattern: /오늘(?:의)?\s*(?:운|기운|하루)|하루\s*운세|오늘의/ },
  { id: 'timing', pattern: /언제|시기|타이밍|몇\s*월/ },
  { id: 'situation', pattern: /어떻게\s*해야|막혔|장애|조언\s*해/ },
];

const COUNT_PHRASE = ['', '한 장', '두 장', '세 장', '네 장', '다섯 장', '여섯 장', '일곱 장', '여덟 장', '아홉 장', '열 장'];

export function orbSpreadCountPhrase(count: number): string {
  return COUNT_PHRASE[count] || `${count}장`;
}

export function orbSpreadById(id: string): OrbSpread {
  return ORB_SPREADS.find(item => item.id === id) || ORB_SPREADS.find(item => item.id === ORB_DEFAULT_SPREAD_ID)!;
}

/** 손님 말에서 배열을 고른다. 주제가 없으면 과거·지금·앞으로. */
export function matchOrbSpread(text: string): OrbSpread {
  const source = String(text || '').replace(/\s+/g, ' ').trim();
  if (!source) return orbSpreadById(ORB_DEFAULT_SPREAD_ID);
  for (const rule of ORB_SPREAD_RULES) {
    if (rule.pattern.test(source)) return orbSpreadById(rule.id);
  }
  return orbSpreadById(ORB_DEFAULT_SPREAD_ID);
}

/** Three-coin method: tails=2, heads=3; lines recorded bottom to top. */
export type Yao = 6 | 7 | 8 | 9;
const TRIGRAMS = ['곤 ☷','진 ☳','감 ☵','태 ☱','간 ☶','리 ☲','손 ☴','건 ☰'];
// Rows upper, columns lower; each index uses bottom-to-top binary yang bits.
const KING_WEN = [
  [2,24,7,19,15,36,46,11], [16,51,40,54,62,55,32,34],
  [8,3,29,60,39,63,48,5], [45,17,47,58,31,49,28,43],
  [23,27,4,41,52,22,18,26], [35,21,64,38,56,30,50,14],
  [20,42,59,61,53,37,57,9], [12,25,6,10,33,13,44,1],
];
const NAMES = ['건위천','곤위지','수뢰둔','산수몽','수천수','천수송','지수사','수지비','풍천소축','천택리','지천태','천지비','천화동인','화천대유','지산겸','뇌지예','택뢰수','산풍고','지택림','풍지관','화뢰서합','산화비','산지박','지뢰복','천뢰무망','산천대축','산뢰이','택풍대과','감위수','이위화','택산함','뇌풍항','천산둔','뇌천대장','화지진','지화명이','풍화가인','화택규','수산건','뇌수해','산택손','풍뢰익','택천쾌','천풍구','택지췌','지풍승','택수곤','수풍정','택화혁','화풍정','진위뢰','간위산','풍산점','뇌택귀매','뇌화풍','화산려','손위풍','태위택','풍수환','수택절','풍택중부','뇌산소과','수화기제','화수미제'];
export function hexagram(bits: readonly number[]) {
  if (bits.length !== 6 || bits.some(b => b !== 0 && b !== 1)) throw new RangeError('6개 음양효가 필요합니다.');
  const lower = bits[0] + bits[1]*2 + bits[2]*4;
  const upper = bits[3] + bits[4]*2 + bits[5]*4;
  const number = KING_WEN[upper][lower];
  return { number, name: NAMES[number-1], lower: TRIGRAMS[lower], upper: TRIGRAMS[upper] };
}
export function calculateIching(lines: readonly number[]) {
  if (lines.length !== 6 || lines.some(n => ![6,7,8,9].includes(n))) throw new RangeError('효는 아래에서 위로 6·7·8·9 중 여섯 개를 입력하세요.');
  return { lines: [...lines] as Yao[], primary: hexagram(lines.map(n => n % 2)), changed: hexagram(lines.map(n => n === 6 ? 1 : n === 9 ? 0 : n % 2)), movingLines: lines.flatMap((n,i) => n === 6 || n === 9 ? [i+1] : []), method: '동전 3개 × 6회 · 앞면 3 / 뒷면 2 · 아래→위' };
}
export function castIching(randomBytes: (bytes: Uint8Array) => Uint8Array = b => globalThis.crypto.getRandomValues(b)) {
  const bytes = randomBytes(new Uint8Array(18));
  if (bytes.length !== 18) throw new RangeError('18개 동전 난수가 필요합니다.');
  return calculateIching(Array.from({length:6}, (_,i) => 6 + (bytes[i*3]&1) + (bytes[i*3+1]&1) + (bytes[i*3+2]&1)));
}

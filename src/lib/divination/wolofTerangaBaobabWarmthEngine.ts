import type { UserProfile } from '../sharedState';

export interface WolofTerangaResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '인내·숙성' | '경청·공회' | '여백·환대' | '기억·용기' | '출항·의식' | '월로프 전반';
  terangaMotif: string;
  companionMotif: string;
  wolofInsight: string;
  baobabTone: string;
  baobabShadeAxis: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '아타야 세 잔의 차(Three Rounds of Ataya · 첫 잔은 쓰지만 두 번째는 달고 세 번째는 부드러움)',
    insight: '어떤 일이나 관계든 처음의 낯섦과 씁쓸함을 지나야 비로소 달콤함과 깊은 여운이 찾아옴',
    tone: '세네갈 마당의 그늘 아래에서 작은 찻잔에 거품을 내어 천천히 나누는 여유로운 오후',
    axis: '첫 잔의 씁쓸함을 지나 세 번째 잔의 부드러움으로 익어 가는 숙성 인내의 축',
    shadow: '기다림과 숙성의 미덕을 이유로 분명히 맞지 않는 관계나 조건까지 무조건 참아 넘기지는 마세요.',
    action: '오늘 처음 마주하는 어색하거나 씁쓸한 일 앞에서 바로 접지 말고, 두 번째 잔까지 차분히 기다려 보세요.',
    question: '지금 내가 첫 잔의 씁쓸함만 보고 성급히 자리를 뜨려 하고 있는 일이나 관계는 무엇인가요?',
  },
  {
    motif: '바오밥 나무 아래의 공회(Palaver Tree · 거대한 나무 그늘에 모여 누구나 목소리를 냄)',
    insight: '내가 모든 답을 혼자 쥐고 있으려 하기보다, 그늘 아래에서 타인의 이야기를 먼저 들으면 길이 열림',
    tone: '하늘을 향해 뿌리를 뻗은 듯한 굵은 바오밥 나무 아래 바람이 서늘히 불어오는 정오',
    axis: '나무 그늘에 모여 먼저 귀 기울여 공명의 길을 찾는 경청 공회의 축',
    shadow: '남의 이야기를 다 듣는 과정에서 정작 내가 세워야 할 최종 기준과 책임의 선이 흐려지지 않게 하세요.',
    action: '오늘 회의나 대화에서 내 결론을 말하기 전에 상대방의 이야기를 끊지 않고 끝까지 먼저 들어 보세요.',
    question: '내가 모든 답을 혼자 쥐고 있으려 하기보다, 그늘 아래 모여 남의 이야기를 먼저 들으면 열릴 길은 무엇인가요?',
  },
  {
    motif: '테랑가의 열린 밥상(Teranga Bowl · 찾아온 손님을 위해 늘 한 몫을 넉넉히 남겨 둠)',
    insight: '마음과 일정에 약간의 여백을 남겨 두어야 뜻밖의 좋은 인연과 기회가 찾아왔을 때 반갑게 맞을 수 있음',
    tone: '따뜻한 햇살 아래 둥근 쟁반을 둘러싸고 정다운 인사가 오가는 저녁',
    axis: '일정과 마음에 한 몫을 남겨 낯선 호의를 들이는 테랑가 환대의 축',
    shadow: '타인을 위한 여백을 챙기다 정작 내 자신의 기본 체력과 마감 일정이 침범당하지 않도록 경계를 지키세요.',
    action: '오늘 일정표에 아무것도 채우지 않은 20분짜리 여백 한 칸을 미리 비워 두세요.',
    question: '뜻밖의 좋은 인연이나 반가운 제안이 찾아왔을 때 넉넉히 맞이할 수 있도록 오늘 비워 둘 마음의 여백은 어디인가요?',
  },
  {
    motif: '그리오의 오랜 노래(Griot Storytelling · 지나온 이야기를 노래로 엮어 오늘의 용기를 북돋움)',
    insight: '지금의 어려움만 보지 말고 내가 이미 건너온 숱한 계절들의 이야기를 떠올리면 힘이 다시 샘솟음',
    tone: '코라 현악기의 맑은 선율이 모래 바람을 타고 잔잔히 퍼져 나가는 황혼',
    axis: '지나온 계절의 서사를 되살려 오늘의 용기를 세우는 그리오 전승의 축',
    shadow: '과거의 성취와 이야기에만 기대어 오늘 새로 배워야 할 현실적 기술이나 변화를 외면하지 마세요.',
    action: '내가 과거에 잘 건너왔던 어려운 순간 하나를 떠올리며 오늘의 나에게 짧은 격려 한 줄을 남겨 보세요.',
    question: '내가 이미 건너온 숱한 계절들의 이야기 속에서 오늘의 내게 다시 용기를 불어넣어 주는 장면은 무엇인가요?',
  },
  {
    motif: '바닷가 피로그 배의 채색(Painted Pirogue · 거친 대서양 파도를 헤치기 전 배에 밝은 빛을 칠함)',
    insight: '어려운 도전을 앞두고 있을수록 스스로의 기운을 밝고 단단하게 가꾸는 의식이 중요함',
    tone: '푸른 바다 위로 알록달록한 나무 배들이 아침 햇살을 받아 반짝이는 해변',
    axis: '파도 앞에서도 밝은 빛을 칠해 기운을 다잡는 출항 의식의 축',
    shadow: '겉의 단장과 의식에 집중하느라 배의 바닥이나 실제 항해 준비(체력·자원)를 점검하는 일을 빼먹지 마세요.',
    action: '큰 일이나 도전을 앞두고 있는 오늘, 내 책상이나 옷차림에 기운을 북돋는 밝은 포인트 하나를 더해 보세요.',
    question: '거친 파도를 헤치기 전에 스스로의 기운을 밝고 단단하게 칠해 두고 싶은 오늘의 작은 의식은 무엇인가요?',
  },
];

function classifyWolofTopic(q: string): WolofTerangaResult['questionTopic'] {
  if (/기다|처음|차|인내|시간/.test(q)) return '인내·숙성';
  if (/듣|대화|회의|의견|공회/.test(q)) return '경청·공회';
  if (/여백|인연|환대|손님|여유/.test(q)) return '여백·환대';
  if (/과거|용기|노래|기억|계절/.test(q)) return '기억·용기';
  if (/도전|파도|출발|의식|채색/.test(q)) return '출항·의식';
  return '월로프 전반';
}

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 16).replace('T', ' ')} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculateWolofTerangaBaobabWarmth(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): WolofTerangaResult {
  const now = params.now ?? new Date();
  const questionText = (params.question ?? '').trim();
  const questionTopic = classifyWolofTopic(questionText);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${questionText}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];

  return {
    engineVersion: 'LUCKEY-WOLOF-TERANGA-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    terangaMotif: picked.motif,
    companionMotif: companion.motif,
    wolofInsight: picked.insight,
    baobabTone: picked.tone,
    baobabShadeAxis: picked.axis,
    reflectionFocus: `월로프 테랑가의 '${picked.motif}'을 중심에 두고 '${companion.motif}'의 결을 곁들여, 첫 잔의 씁쓸함을 견디고 마음의 여백을 남겨 타인을 반갑게 맞아 보세요.`,
    ritualAction: picked.action,
    shadowWarning: picked.shadow,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '세네갈 월로프 문화의 테랑가(환대)·바오밥 그늘·아타야 차 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatWolofTerangaPrompt(res: WolofTerangaResult): string {
  return [
    `[월로프·테랑가 환대 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst} | 질문 맥락: ${res.questionTopic}`,
    `- 테랑가 모티프: ${res.terangaMotif} (${res.baobabTone})`,
    `- 바오밥 그늘 축: ${res.baobabShadeAxis}`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 중심 통찰: ${res.wolofInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}

/**
 * 고대 중국 주역 대연지수(大衍之數) 49책 시초점 확률 수리 엔진 (Yarrow Stalk Probability Engine)
 *
 * 계사상전(繫辭上傳)의 대연지수(五十, 기용 사십유구) 원리에 기반하여
 * 삼변(三變) 시초점의 비대칭 16분할 수리 구조(노음 6, 소양 7, 소음 8, 노양 9)와
 * 동효·정효의 시중(時中) 태도를 정성적 행동 성찰에 연결합니다.
 */

export const ANCIENT_YARROW_PROBABILITY_ENGINE_VERSION = 'LUCKEY-YARROW-PROBABILITY-v2.1.0';

export type YarrowQuestionTheme = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface YarrowProbabilityReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  questionTheme: YarrowQuestionTheme;
  dominantYaoValue: 6 | 7 | 8 | 9;
  remainingStalks: 24 | 28 | 32 | 36; // 3변 후 남은 책수 (remainingStalks / 4 = dominantYaoValue)
  yaoNameKo: string;
  yaoStateEn: 'Old Yin (Changing to Yang)' | 'Young Yang (Stable)' | 'Young Yin (Stable)' | 'Old Yang (Changing to Yin)';
  isChangingLine: boolean;
  theoreticalProbability: string;
  dayanAlignmentScore: number; // 하위 호환용 내부 참조치 (0 ~ 100)
  temporalYinYangMomentum: string;
  timelinessPosture: string; // 시중(時中) 처세 태도
  temporalYarrowRhythm: {
    kstTimeLabel: string;
    dayanWatchWindow: string;
    seasonalChangeTone: string;
    temporalGuidance: string;
  };
  yarrowSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  cosmicTimingActionMandate: string; // 하위 호환용 지침
  practiceGuidance: string; // getSymbolicPerspective 호환 정성적 조언
  ritualAction: string;
  reflectionFocus: string;
  counselNote: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
}

function classifyYarrowTheme(question: string): YarrowQuestionTheme {
  if (/연애|사랑|관계|사람|친구|가족|배우자|이별|갈등|연락/.test(question)) return 'relationship';
  if (/선택|결정|이직|직장|일|사업|돈|시험|도전|시작|투자/.test(question)) return 'decision';
  if (/힘들|지치|불안|우울|잠|휴식|치유|피곤|건강/.test(question)) return 'healing';
  return 'reflection';
}

function getTemporalYarrowRhythm(now: Date) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const dayanWatchWindow =
    hour >= 5 && hour < 11
      ? '소양(少陽) 아침 발아창 — 시초를 가다듬듯 맑은 마음으로 오늘의 첫 뜻을 세우는 시간'
      : hour >= 11 && hour < 17
        ? '노양(老陽) 정오 전개창 — 쌓아둔 뜻을 실행으로 펼치되 과열을 경계하는 시간'
        : hour >= 17 && hour < 22
          ? '소음(少陰) 황혼 수렴창 — 바깥의 소음을 거두고 오늘의 흐름을 차분히 갈무리하는 시간'
          : '노음(老陰) 심야 전환창 — 낡은 긴장을 비우고 내일의 새 순환을 준비하는 시간';

  const seasonalChangeTone =
    month >= 3 && month <= 5
      ? '봄 · 둔(屯)·진(震) 발아기 (새 국면이 조심스럽게 싹트는 시기)'
      : month >= 6 && month <= 8
        ? '여름 · 이(離)·풍(豐) 전개기 (기운이 뻗어가되 절도로 균형을 잡는 시기)'
        : month >= 9 && month <= 11
          ? '가을 · 태(兌)·간(艮) 수렴기 (결실을 추리고 불필요한 가지를 정리하는 시기)'
          : '겨울 · 복(復)·곤(坤) 비축기 (조용히 힘을 기르며 시중의 때를 기다리는 시기)';

  return {
    kstTimeLabel: `${y}-${m}-${d} ${hh}:${mm} +09:00 KST`,
    dayanWatchWindow,
    seasonalChangeTone,
    temporalGuidance: `${dayanWatchWindow} · ${seasonalChangeTone}의 결에 맞추어 시중(時中)의 처세 태도를 유지하십시오.`,
  };
}

export function calculateAncientYarrowProbability(params: {
  profile?: { basic?: { birthdate?: string } };
  question?: string;
  now?: Date;
}): YarrowProbabilityReport {
  const now = params.now || new Date();
  const basic = params.profile?.basic;
  const birthdateStr = basic?.birthdate?.trim() || '1994-01-24';
  const question = params.question || '';
  const questionTheme = classifyYarrowTheme(question);

  let seed = 0;
  for (let i = 0; i < birthdateStr.length; i++) {
    seed += birthdateStr.charCodeAt(i) * (i + 23);
  }
  for (let i = 0; i < question.length; i++) {
    seed += question.charCodeAt(i) * 43;
  }
  seed += now.getDate() * 37 + now.getMonth() * 73;

  // 16분할 대연지수 삼변 수리 매핑: 6(24책, 1/16), 7(28책, 5/16), 8(32책, 7/16), 9(36책, 3/16)
  const slot = Math.abs(seed) % 16;
  let dominantYaoValue: 6 | 7 | 8 | 9;
  let remainingStalks: 24 | 28 | 32 | 36;
  let yaoNameKo: string;
  let yaoStateEn: YarrowProbabilityReport['yaoStateEn'];
  let isChangingLine: boolean;
  let theoreticalProbability: string;
  let timelinessPosture: string;

  if (slot === 0) {
    dominantYaoValue = 6;
    remainingStalks = 24;
    yaoNameKo = '노음(老陰, 극음변양 - 동효)';
    yaoStateEn = 'Old Yin (Changing to Yang)';
    isChangingLine = true;
    theoreticalProbability = '1/16 (6.25% - 가장 희귀한 대역전의 변곡점)';
    timelinessPosture = '오래된 정체가 끝나고 새로운 국면으로 전환되는 문턱에서 낡은 습관을 정리하는 자세';
  } else if (slot <= 5) {
    dominantYaoValue = 7;
    remainingStalks = 28;
    yaoNameKo = '소양(少陽, 정양 - 안정적 성장)';
    yaoStateEn = 'Young Yang (Stable)';
    isChangingLine = false;
    theoreticalProbability = '5/16 (31.25% - 곧고 굳건한 전진)';
    timelinessPosture = '급격한 변화보다 뿌리를 내리며 한 걸음씩 정직하게 밀고 나가는 자세';
  } else if (slot <= 12) {
    dominantYaoValue = 8;
    remainingStalks = 32;
    yaoNameKo = '소음(少陰, 정음 - 수용적 축적)';
    yaoStateEn = 'Young Yin (Stable)';
    isChangingLine = false;
    theoreticalProbability = '7/16 (43.75% - 유순하게 힘을 비축하는 최빈값)';
    timelinessPosture = '앞서 나서기보다 경청하고 빈틈을 메우며 다음 시기를 위해 힘을 기르는 자세';
  } else {
    dominantYaoValue = 9;
    remainingStalks = 36;
    yaoNameKo = '노양(老陽, 극양변음 - 동효)';
    yaoStateEn = 'Old Yang (Changing to Yin)';
    isChangingLine = true;
    theoreticalProbability = '3/16 (18.75% - 에너지가 극에 달해 결실로 전환)';
    timelinessPosture = '팽창한 기운이 과열되지 않도록 성과를 매듭짓고 나눔과 절제로 균형을 잡는 자세';
  }

  const dayanAlignmentScore = 70 + (Math.abs(seed * 9) % 29);
  const temporalYinYangMomentum =
    dominantYaoValue % 2 === 1
      ? '양기(陽氣) 주도적 확장 및 돌파 흐름'
      : '음기(陰氣) 주도적 포용 및 내실 안정 흐름';

  const guidanceByYaoAndTheme: Record<6 | 7 | 8 | 9, Record<YarrowQuestionTheme, {
    practiceGuidance: string;
    ritualAction: string;
    reflectionFocus: string;
    counselNote: string;
  }>> = {
    6: {
      relationship: {
        practiceGuidance: '오래 묵은 오해나 어색한 침묵이 풀릴 전환점이 다가오고 있습니다. 과거의 방식에 매이지 말고 먼저 부드러운 안부를 건네 보세요.',
        ritualAction: '미뤄 두었던 대화의 물꼬를 트기 위해 상대를 향한 고정관념 한 가지를 내려놓고 짧은 메시지를 준비해 보세요.',
        reflectionFocus: '이 관계에서 이제는 내려놓고 새로 시작해도 좋은 낡은 패턴은 무엇인가요?',
        counselNote: '가장 어두운 바닥에서 비로소 새벽빛이 싹트듯, 관계의 정체도 진심 어린 작은 변화로 풀리기 시작합니다.',
      },
      decision: {
        practiceGuidance: '기존의 틀이나 관성적인 방식을 유지하기보다 근본적인 방향 전환을 진지하게 검토할 때입니다. 두려움 없이 새 판을 열어 보세요.',
        ritualAction: '지금까지 붙잡고 있던 계획 중 수명이 다한 부분을 과감히 지우고 가장 단순한 새 목표 하나를 적어 보세요.',
        reflectionFocus: '익숙하다는 이유만으로 붙잡고 있는 선택지는 무엇인가요?',
        counselNote: '노음은 변화가 이미 무르익었음을 뜻하므로, 미련을 덜어낼수록 다음 단계로의 이동이 가벼워집니다.',
      },
      healing: {
        practiceGuidance: '긴 피로와 침체의 원인이나 끝나는 시점은 점괘로 알 수 없습니다. 무리하지 말고 휴식과 상태 점검을 고려하세요. 피로가 지속되거나 악화되면 의료 전문가와 상의하세요.',
        ritualAction: '오늘 하루는 새로운 일을 벌이지 말고 따뜻한 물로 샤워한 뒤 일찍 잠자리에 드는 휴식을 선택해 보세요.',
        reflectionFocus: '회복의 문턱에서 내가 가장 먼저 비워 내야 할 불필요한 걱정은 무엇인가요?',
        counselNote: '이 괘상은 회복 시점을 예고하지 않습니다. 몸과 마음의 상태를 살피고 필요한 돌봄을 선택하세요.',
      },
      reflection: {
        practiceGuidance: '변화의 문턱에 서 있습니다. 지나간 일에 대한 아쉬움보다 앞으로 새롭게 열릴 여백에 마음을 두는 것이 좋습니다.',
        ritualAction: '책상이나 방 안의 오래된 물건 한두 개를 정리하며 새로운 흐름을 받아들일 물리적 공간을 만들어 보세요.',
        reflectionFocus: '내 삶의 다음 장을 열기 위해 오늘 기꺼이 끝맺을 수 있는 일은 무엇인가요?',
        counselNote: '비워야 새것이 채워진다는 자연의 순리가 지금 당신의 흐름 속에서 조용히 작동하고 있습니다.',
      },
    },
    7: {
      relationship: {
        practiceGuidance: '화려한 이벤트보다 꾸준하고 한결같은 태도가 신뢰를 쌓는 시기입니다. 진솔하고 담백한 표현으로 관계를 탄탄하게 이어 가세요.',
        ritualAction: '상대방의 작은 장점을 떠올리며 꾸밈없는 감사의 말 한마디를 진심으로 전해 보세요.',
        reflectionFocus: '이 관계에서 내가 꾸준히 지켜 나가고 싶은 진실한 태도는 무엇인가요?',
        counselNote: '소양의 기운은 요란하지 않지만 흔들리지 않는 믿음을 자라게 하는 가장 건강한 성장의 에너지입니다.',
      },
      decision: {
        practiceGuidance: '이 괘상은 현재 방향을 돌아보는 상징으로 참고할 수 있습니다. 지름길보다 현실의 자료와 꾸준히 실행할 수 있는 조건을 함께 점검하세요.',
        ritualAction: '오늘 해야 할 핵심 과업 한 가지를 정해 다른 잡음 없이 차분하게 끝까지 마무리해 보세요.',
        reflectionFocus: '단기적인 성과보다 장기적인 실력을 쌓기 위해 지금 집중할 기본기는 무엇인가요?',
        counselNote: '꾸준한 축적이 어떤 결과를 낳을지는 상황에 따라 다르므로, 부담 가능한 속도로 과정을 점검하세요.',
      },
      healing: {
        practiceGuidance: '서서히 활력이 되살아나는 흐름입니다. 무리한 운동이나 일정보다는 규칙적인 식사와 가벼운 산책으로 리듬을 지켜 주세요.',
        ritualAction: '햇볕이 드는 시간대에 짧게라도 바깥 공기를 마시며 천천히 걷는 시간을 가져 보세요.',
        reflectionFocus: '내 일상의 활력을 조금씩 회복시켜 주는 건강한 습관은 무엇인가요?',
        counselNote: '회복은 한 번에 완성되지 않으며, 매일 조금씩 쌓이는 편안한 루틴이 몸과 마음을 단단히 세워 줍니다.',
      },
      reflection: {
        practiceGuidance: '지금 품고 있는 생각과 계획이 건강한 싹을 틔우고 있습니다. 스스로의 속도를 믿고 차분하게 정진하세요.',
        ritualAction: '진행 중인 일이나 배움에서 최근 작게나마 나아진 점 한 가지를 기록해 보세요.',
        reflectionFocus: '지금 내 안에서 조용히 자라나고 있는 가장 소중한 가능성은 무엇인가요?',
        counselNote: '소양은 조급함을 경계하고 꾸준함을 축복하는 때이니, 오늘의 작은 진전을 충분히 기뻐해도 좋습니다.',
      },
    },
    8: {
      relationship: {
        practiceGuidance: '상대의 입장을 헤아려 듣는 시도를 대화의 출발점으로 삼을 수 있습니다. 갈등이 풀릴지와 관계가 깊어질지는 서로의 대화와 선택에 달려 있습니다.',
        ritualAction: '대화를 나눌 때 상대의 말을 끝까지 끊지 않고 고개를 끄덕이며 경청하는 데 집중해 보세요.',
        reflectionFocus: '상대방이 지금 가장 이해받고 싶어 하는 마음은 무엇일까요?',
        counselNote: '유연한 수용은 약함이 아니라 상대를 안심시키고 진심을 이끌어 내는 가장 성숙한 힘입니다.',
      },
      decision: {
        practiceGuidance: '지금은 성급히 결론을 내리기보다 자료를 더 살피고 주변의 조언을 두루 들으며 내실을 다지는 편이 유리합니다.',
        ritualAction: '결정을 서두르기 전에 믿을 만한 동료나 지인의 의견을 편견 없이 한 번 더 물어보세요.',
        reflectionFocus: '내가 아직 보지 못했거나 확인이 더 필요한 조건은 무엇인가요?',
        counselNote: '소음의 시기는 힘을 비축하는 때이므로, 빈틈을 메우고 준비를 마친 뒤에 움직여도 결코 늦지 않습니다.',
      },
      healing: {
        practiceGuidance: '바깥으로 에너지를 쓰기보다 안으로 거두어들여 마음을 고요히 가라앉히는 시간이 필요합니다. 혼자만의 평온한 휴식을 챙기세요.',
        ritualAction: '불필요한 연락이나 정보 소비를 잠시 줄이고 조용한 공간에서 편안하게 숨을 고르는 시간을 가져 보세요.',
        reflectionFocus: '바깥의 소음을 끄고 내 안의 고요함에 귀 기울일 때 들리는 목소리는 무엇인가요?',
        counselNote: '겨울의 대지가 봄을 위해 씨앗을 품듯, 지금의 고요한 멈춤은 다음 도약을 위한 소중한 충전입니다.',
      },
      reflection: {
        practiceGuidance: '무리하게 앞서 나가려 애쓰기보다 현재 주어진 환경과 자원 속에서 안정을 다지며 때를 기다리는 지혜가 빛나는 날입니다.',
        ritualAction: '오늘 하루는 새로운 목표를 추가하기보다 이미 가진 것들에 감사하며 차분히 정돈해 보세요.',
        reflectionFocus: '지금 내 삶에서 억지로 바꾸지 않고 있는 그대로 받아들일 때 편안해지는 부분은 무엇인가요?',
        counselNote: '유순함과 수용의 태도는 어떤 상황에서도 마음을 다치지 않게 지켜 주는 가장 단단한 방패입니다.',
      },
    },
    9: {
      relationship: {
        practiceGuidance: '감정이나 열정이 상대에게 부담이 되지 않는지 살펴보세요. 한 걸음 물러서 여유와 경계를 확인하는 방식도 고려할 수 있습니다.',
        ritualAction: '하고 싶은 말이 많더라도 핵심만 따뜻하게 전하고 상대가 답할 수 있는 여백을 남겨 두세요.',
        reflectionFocus: '내 선의나 열정이 혹시 상대에게는 서두름으로 느껴지지 않도록 조절할 부분은 무엇인가요?',
        counselNote: '차오른 달이 기울기 전에 그 빛을 나누듯, 열정이 정점에 달할수록 겸손과 배려가 관계를 빛나게 합니다.',
      },
      decision: {
        practiceGuidance: '이 효의 상징을 지금까지의 노력을 점검하는 계기로 삼을 수 있습니다. 성과나 확장 여부는 실제 자료와 감당 가능한 위험을 바탕으로 판단하세요.',
        ritualAction: '진행 중인 일의 성과를 점검하고 함께 수고한 사람들과 공을 나누며 리스크를 한 번 더 확인해 보세요.',
        reflectionFocus: '지금 거둔 성과나 추진력을 지속 가능하게 지키기 위해 챙겨야 할 안전장치는 무엇인가요?',
        counselNote: '노양은 성취와 전환을 상징적으로 돌아보는 계기일 뿐 미래 변화를 예고하지 않습니다. 현재의 결과를 점검하고 다음 선택을 신중히 살피세요.',
      },
      healing: {
        practiceGuidance: '머리나 신경이 과열되어 있을 수 있습니다. 들뜬 기운을 아래로 가라앉히고 차분한 호흡으로 과부하를 식혀 주세요.',
        ritualAction: '잠시 화면에서 눈을 떼고 먼 곳을 바라보며 깊은 복식 호흡을 다섯 차례 천천히 반복해 보세요.',
        reflectionFocus: '지금 나를 과도하게 몰아붙이고 있는 긴장감은 어디서 비롯된 것인가요?',
        counselNote: '넘치는 에너지를 잘 쉬게 해 주는 것도 실력이니, 스스로를 다독이며 속도를 한 단계 낮추어 보세요.',
      },
      reflection: {
        practiceGuidance: '성취의 정점이나 다음 순환이 정해져 있다고 볼 수는 없습니다. 얻은 것을 돌아보고 나눔이 자신의 가치와 관계에 어떤 의미인지 살펴보세요.',
        ritualAction: '최근 얻은 배움이나 작은 여유를 주변 사람에게 가벼운 격려나 나눔으로 건네 보세요.',
        reflectionFocus: '지금 내가 누리고 있는 것들 중 기꺼이 나누고 순환시킬 수 있는 가치는 무엇인가요?',
        counselNote: '나눔과 절제가 특정한 행운을 보장하지는 않습니다. 내가 지키고 싶은 가치와 관계를 확인하는 실천으로 삼아 보세요.',
      },
    },
  };

  const themeContent = guidanceByYaoAndTheme[dominantYaoValue][questionTheme];
  const temporalYarrowRhythm = getTemporalYarrowRhythm(now);
  const yarrowSynthesisMatrix = {
    coreInsight: `[${yaoNameKo}]가 [${questionTheme}] 국면의 시중(時中) 흐름을 비춥니다.`,
    recommendedAction: `${themeContent.practiceGuidance} (${themeContent.ritualAction})`,
    cautionNotice: themeContent.counselNote,
  };
  const boundaryNotice = '대연지수 시초점 관점은 고대 주역의 상징 수리를 빌린 정성적 처세 참고용이며, 개인 점수나 확률 예언이 아닙니다.';

  return {
    engineVersion: ANCIENT_YARROW_PROBABILITY_ENGINE_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst: temporalYarrowRhythm.kstTimeLabel,
    questionTheme,
    dominantYaoValue,
    remainingStalks,
    yaoNameKo,
    yaoStateEn,
    isChangingLine,
    theoreticalProbability,
    dayanAlignmentScore,
    temporalYinYangMomentum,
    timelinessPosture,
    temporalYarrowRhythm,
    yarrowSynthesisMatrix,
    cosmicTimingActionMandate: themeContent.practiceGuidance,
    practiceGuidance: themeContent.practiceGuidance,
    ritualAction: themeContent.ritualAction,
    reflectionFocus: themeContent.reflectionFocus,
    counselNote: themeContent.counselNote,
    boundaryNotice,
    interpretiveBoundary: boundaryNotice,
  };
}

export function formatAncientYarrowProbabilityPrompt(report: YarrowProbabilityReport): string {
  const qualitativeSplit =
    report.dominantYaoValue === 6
      ? '1/16 희귀 분기 (대역전의 변곡점)'
      : report.dominantYaoValue === 7
        ? '5/16 안정 전진 분기 (곧고 굳건한 성장)'
        : report.dominantYaoValue === 8
          ? '7/16 최빈 수용 분기 (유순한 내실 비축)'
          : '3/16 극양 전환 분기 (성취의 결실과 절제)';

  return `### 🎋 고대 중국 주역 대연지수 49책 시초점 상징 수리 관점 (${report.engineVersion})
- **연산 시각**: ${report.calculatedAtKst}
- **산출 효(爻) 수리값**: ${report.dominantYaoValue} (${report.remainingStalks}책 / 4) - [${report.yaoNameKo}]
- **동효 여부**: ${report.isChangingLine ? '동효 (국면 전환기)' : '정효 (안정 유지기)'}
- **시초점 삼변 비대칭 구조**: ${qualitativeSplit}
- **시공간 음양 모멘텀**: ${report.temporalYinYangMomentum}
- **KST 시공간 대연 리듬**: ${report.temporalYarrowRhythm.dayanWatchWindow} / ${report.temporalYarrowRhythm.seasonalChangeTone}
  - *시공간 지침*: ${report.temporalYarrowRhythm.temporalGuidance}
- **시중(時中) 처세 태도**: ${report.timelinessPosture}
- **대연 교차 매트릭스**: 핵심(${report.yarrowSynthesisMatrix.coreInsight}) | 실행(${report.yarrowSynthesisMatrix.recommendedAction}) | 주의(${report.yarrowSynthesisMatrix.cautionNotice})
- **실천 조언**: ${report.practiceGuidance}
- **일상 의례**: ${report.ritualAction}
- **성찰 질문**: ${report.reflectionFocus}
- **해석 경계**: ${report.boundaryNotice}`;
}

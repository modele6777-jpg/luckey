/**
 * 🔮 오브 마스터 도구 목록 (Tool Registry 메타데이터).
 *
 * 하나의 마스터 AI가 대화 중에 필요한 도구만 골라 부른다(Function Calling).
 * 이 파일은 서버(토큰 발급)와 브라우저(도구 실행)가 함께 쓰므로 계산 엔진을 import하지 않는다.
 * 실제 계산은 `orbToolExecutor.ts`가 기존 엔진(runDeterministicEngine)으로 한다.
 */

/** 도구를 계산하려면 무엇이 필요한가. */
export type OrbToolNeed = 'birthdate' | 'none';

export interface OrbToolMeta {
  id: string;
  name: string;
  /** 마스터가 도구를 고를 때 보는 한 줄 설명 (해석 문장 아님). */
  about: string;
  needs: OrbToolNeed;
  /** 생시가 있으면 더 정확해지는 도구. */
  betterWithTime?: boolean;
}

/** 기존 15대 도구 중 계산 엔진으로 실행하는 14개 (타로는 손님이 직접 뽑으므로 따로 둔다). */
export const ORB_CALC_TOOLS: readonly OrbToolMeta[] = [
  { id: 'saju', name: '사주명리', about: '생년월일시의 네 기둥과 오행, 대운으로 타고난 기질과 시기의 흐름', needs: 'birthdate', betterWithTime: true },
  { id: 'astrology', name: '서양 점성술', about: '태어난 때의 행성 위치와 각도로 성향과 관계의 결', needs: 'birthdate', betterWithTime: true },
  { id: 'ziwei', name: '자미두수', about: '명궁의 별과 열두 궁으로 삶의 영역별 그릇 (연애·재물·일)', needs: 'birthdate', betterWithTime: true },
  { id: 'vedic', name: '베딕 점성술', about: '달의 별자리와 다샤(지금 흐르는 행성 시기)로 마음과 시기', needs: 'birthdate', betterWithTime: true },
  { id: 'sukuyo', name: '숙요', about: '태어난 날의 27숙으로 기질과 사람 사이의 인연 관계', needs: 'birthdate' },
  { id: 'kyusei', name: '구성학', about: '본명성(아홉 별)으로 기질과 올해·이달의 방위 흐름', needs: 'birthdate' },
  { id: 'tojeong', name: '토정비결', about: '올해 한 해의 괘와 열두 달 흐름', needs: 'birthdate' },
  { id: 'mahabote', name: '마하보테', about: '미얀마 요일 점성으로 태어난 요일의 별과 집', needs: 'birthdate' },
  { id: 'thai_astrology', name: '태국 점성술', about: '태어난 요일의 수호신과 나이별 시기 흐름', needs: 'birthdate' },
  { id: 'kabbalah', name: '카발라 수비학', about: '생년월일 숫자로 생명나무의 자리 (현대 헤르메스 전통의 상징 대응)', needs: 'birthdate' },
  { id: 'iching', name: '주역', about: '지금 시각으로 세운 괘 하나로 이번 물음의 상(象). 사람마다 같은 시각의 판', needs: 'none' },
  { id: 'liuren', name: '육임', about: '지금 시각의 판으로 이번 일의 진행과 사람 관계의 흐름', needs: 'none' },
  { id: 'qimen', name: '기문둔갑', about: '지금 시각의 판으로 방향과 때, 움직일지 기다릴지', needs: 'none' },
  { id: 'taiyi', name: '태을수', about: '올해의 연국으로 큰 시대 흐름 (개인 운명 아님)', needs: 'none' },
];

export const ORB_CALC_TOOL_IDS: readonly string[] = ORB_CALC_TOOLS.map(tool => tool.id);

export const ORB_TOOL_BY_ID = new Map(ORB_CALC_TOOLS.map(tool => [tool.id, tool]));

/** 한 번의 질문(손님 말 한 차례)에 부를 수 있는 계산 수. */
export const ORB_MAX_CALLS_PER_TURN = 3;
/** 한 상담에서 계산할 수 있는 서로 다른 도구 수 (같은 도구 재호출은 저장된 결과를 쓴다). */
export const ORB_MAX_TOOLS_PER_SESSION = 6;

export const ORB_FN_RUN_TOOL = 'run_divination_tool';
export const ORB_FN_TAROT = 'open_tarot_shuffle';

/** Gemini Live에 넘기는 함수 선언 (설명은 짧게, 도구 이름은 고정 목록). */
export function orbFunctionDeclarations() {
  return [
    {
      name: ORB_FN_RUN_TOOL,
      description: `운세 계산 엔진 하나를 실행해 계산값과 해석 카드를 받는다. 손님 고민에 꼭 필요한 도구만, 한 번에 1~2개 부른다. 도구: ${ORB_CALC_TOOLS.map(tool => `${tool.id}=${tool.name}(${tool.about}${tool.needs === 'birthdate' ? ', 생년월일 필요' : ''})`).join('; ')}`,
      parameters: {
        type: 'OBJECT',
        properties: {
          tool: { type: 'STRING', enum: [...ORB_CALC_TOOL_IDS], description: '실행할 도구 id' },
          ichingMethod: { type: 'STRING', enum: ['time', 'dice'], description: '주역만 사용. 기본 time(매화역수), 손님이 원하면 dice(두 주사위 변형).' },
          reason: { type: 'STRING', description: '이 도구를 고른 이유 한 줄 (손님 고민과의 연결)' },
        },
        required: ['tool'],
      },
    },
    {
      name: ORB_FN_TAROT,
      description: '타로가 어울릴 때(마음, 관계, 선택) 78장 카드 섞기 화면을 연다. 카드는 손님이 "멈춰"라고 말하거나 화면을 눌러 직접 세 장 뽑는다. 주사위로 뽑기도 손님이 선택할 수 있다. 결과는 [카드 선택]으로 온다.',
      parameters: {
        type: 'OBJECT',
        properties: { reason: { type: 'STRING', description: '타로를 고른 이유 한 줄' } },
      },
    },
  ];
}

export interface OrbProfileStatus { birthdate: boolean; birthtime: boolean }

/** 공통 마스터 지시문: 성격·말투는 고른 목소리(페르소나)에서, 도구 규칙은 여기서. */
export function buildOrbMasterRules(profile: OrbProfileStatus): string {
  const birth = profile.birthdate
    ? `손님의 생년월일은 앱에 저장되어 있습니다${profile.birthtime ? ' (태어난 시간 포함)' : ' (태어난 시간은 없음, 시간이 필요한 부분은 확정하지 말 것)'}. 도구가 알아서 읽으니 손님에게 다시 묻지 마세요.`
    : '손님의 생년월일이 앱에 없습니다. 생년월일이 필요한 도구가 꼭 필요할 때만, 마이 페이지에 생년월일을 넣어 주시면 볼 수 있다고 부드럽게 안내하세요. 주역·육임·기문·태을·타로는 생년월일 없이도 됩니다.';
  return [
    '[오브 상담 방식] 당신은 오브 하나에 깃든 상담 마스터 한 명입니다. 15가지 운세 도구를 직접 골라 씁니다.',
    '먼저 손님 고민을 한두 마디 듣고, 고민에 꼭 맞는 도구만 고르세요. 한 번에 한두 개, 한 상담에서 많아야 서너 개입니다. 모든 도구를 다 부르지 마세요.',
    `계산이 필요하면 ${ORB_FN_RUN_TOOL} 함수를 부르세요. 부르기 직전에 "잠시만요, 괘를 세워 볼게요"처럼 한마디만 하세요. 타로가 어울리면 ${ORB_FN_TAROT} 함수를 부르고 섞기 안내를 하세요.`,
    '함수 결과의 계산값과 해석 카드만 근거로 풀이하세요. 결과에 없는 별, 괘, 카드, 숫자를 지어내지 마세요. status가 calculated가 아니면 계산되지 않았다고 솔직히 말하세요.',
    'scope를 확인하세요. 시간식 주역·육임·기문·태을은 공통 판이고, 주사위 주역은 이번 질문의 무작위 괘입니다. 손님의 타고난 운명처럼 말하지 마세요.',
    '여러 도구를 썼다면 공통으로 가리키는 점을 먼저 말하고, 서로 다르면 억지로 맞추지 마세요. 도구 이름과 계산값은 쉬운 말로 한 번만 짚고, 대부분은 손님 고민에 대한 이야기로 하세요.',
    birth,
    '[카드 선택] 메시지는 손님이 직접 뽑은 타로 결과입니다. 그 전에는 카드 이름을 말하지 마세요.',
  ].join('\n');
}

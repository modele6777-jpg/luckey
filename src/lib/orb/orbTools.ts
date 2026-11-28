/**
 * 🔮 마스터 루시의 도구 목록 — **사주와 타로, 둘뿐**.
 *
 * 오브는 사주와 타로만 극한으로 파는 상담이다. 예전처럼 15가지 운세 도구를 고르지 않는다.
 * - 사주: `run_divination_tool`(tool: 'saju')로 원국·대운·세운·월운·일진·신살까지 다시 계산한다.
 * - 타로: `open_tarot_shuffle`로 78장 섞기 화면을 열고, 손님이 배열법대로 카드를 직접 뽑는다.
 *
 * 이 파일은 서버(토큰 발급)와 브라우저(도구 실행)가 함께 쓰므로 계산 엔진을 import하지 않는다.
 * 실제 계산은 `orbToolExecutor.ts`가 기존 엔진으로 한다.
 */
import { LUCY_TOOL_REGISTRY, type LucyToolMeta } from '../lucyToolRegistry';
import { LUCY_COUNSEL_GROUNDING } from '../lucyMasterCore';

export type OrbToolMeta = LucyToolMeta;

/** 오브가 실제로 부르는 계산 도구 — 사주 하나. 타로는 카드 고르기(voicePick)라서 여기 없다. */
export const ORB_CALC_TOOLS: readonly OrbToolMeta[] = LUCY_TOOL_REGISTRY.filter(tool => tool.id === 'saju');

export const ORB_CALC_TOOL_IDS: readonly string[] = ORB_CALC_TOOLS.map(tool => tool.id);

export const ORB_TOOL_BY_ID = new Map<string, OrbToolMeta>(ORB_CALC_TOOLS.map(tool => [tool.id, tool]));

/** 오브가 다루는 두 영역 (안내·검사용). */
export const ORB_FOCUS_AREAS = ['사주', '타로'] as const;

/** 한 번의 질문(손님 말 한 차례)에 부를 수 있는 계산 수. */
export const ORB_MAX_CALLS_PER_TURN = 2;
/** 한 상담에서 계산할 수 있는 서로 다른 도구 수 (같은 도구 재호출은 저장된 결과를 쓴다). */
export const ORB_MAX_TOOLS_PER_SESSION = 2;

export const ORB_FN_RUN_TOOL = 'run_divination_tool';
export const ORB_FN_TAROT = 'open_tarot_shuffle';

/** Gemini Live에 넘기는 함수 선언 (사주 계산 + 타로 카드 섞기 두 개). */
export function orbFunctionDeclarations() {
  return [
    {
      name: ORB_FN_RUN_TOOL,
      description: `사주 계산 엔진을 실행해 원국 8자·십신·오행·용신·대운·세운·월운·일진·신살·공망·합충형파해의 계산값과 해석 카드를 받는다. 상담에는 이 도구 하나만 쓴다. 손님의 고민이 시기·기질·관계·돈·일에 닿을 때 1~2번 부른다. 도구: ${ORB_CALC_TOOLS.map(tool => `${tool.id}=${tool.name}(${tool.about}${tool.needs === 'birthdate' ? ', 생년월일 필요' : ''})`).join('; ')}`,
      parameters: {
        type: 'OBJECT',
        properties: {
          tool: { type: 'STRING', enum: [...ORB_CALC_TOOL_IDS], description: '실행할 도구 id (사주)' },
          reason: { type: 'STRING', description: '이 도구를 고른 이유 한 줄 (손님 고민과의 연결)' },
        },
        required: ['tool'],
      },
    },
    {
      name: ORB_FN_TAROT,
      description: '타로 78장 카드 섞기 화면을 연다. 기본은 손님이 "멈춰"라고 말하거나 화면을 눌러 세 장(과거·지금·앞으로)을 뽑고, 고민에 따라 한 장·진로·말굽·셀틱 크로스 등 다른 배열도 고를 수 있다. 주사위로 뽑기도 손님이 선택할 수 있다. 결과는 [카드 선택]으로 오며, 그 자리 이름대로 읽는다.',
      parameters: {
        type: 'OBJECT',
        properties: { reason: { type: 'STRING', description: '타로를 고른 이유 한 줄' } },
      },
    },
  ];
}

export interface OrbProfileStatus { birthdate: boolean; birthtime: boolean }

/** 마스터 루시의 상담 규칙: 사주와 타로만, 둘을 교차해서. */
export function buildOrbMasterRules(profile: OrbProfileStatus): string {
  const birth = profile.birthdate
    ? `손님의 생년월일은 앱에 저장되어 있습니다${profile.birthtime ? ' (태어난 시간 포함)' : ' (태어난 시간은 없음, 시간이 필요한 부분은 확정하지 말 것)'}. 지시문의 사주 자료와 도구가 알아서 읽으니 손님에게 다시 묻지 마세요.`
    : '손님의 생년월일이 앱에 없습니다. 사주를 볼 때만, 마이 페이지에 생년월일을 넣어 주시면 원국·대운까지 볼 수 있다고 부드럽게 안내하세요. 생년월일 없이도 타로와 대화로 충분히 상담할 수 있습니다.';
  return [
    '[오브 상담 방식] 당신은 오브의 마스터 루시 한 명입니다. 도구는 사주와 타로, 둘뿐입니다.',
    '먼저 손님 고민을 한두 마디 듣고, 사주로 시기를 짚고 타로로 마음과 결정을 교차하세요. 다른 점성술·주역·육임 같은 도구는 쓰지 않습니다.',
    `사주 계산이 필요하면 ${ORB_FN_RUN_TOOL} 함수를 부르세요. 별도 대기 멘트 없이 곧바로 부르고, 결과를 받으면 사주 원국의 어느 글자에서 나온 이야기인지 짚어 주세요. 타로가 어울리면 ${ORB_FN_TAROT} 함수로 카드를 열고 섞기 안내를 하세요.`,
    LUCY_COUNSEL_GROUNDING,
    '함수 결과의 계산값과 해석 카드, 지시문에 있는 원국·대운·세운·일진만 근거로 풀이하세요. 결과에 없는 별, 괘, 카드, 숫자, 신살을 지어내지 마세요. status가 calculated가 아니면 계산되지 않았다고 솔직히 말하세요.',
    '세운·월운·일진은 시기 감각으로만 쓰세요. 손님의 타고난 운명처럼 말하지 말고, "이번 달은 ~한 결이니 ~해 보시면 좋겠다"처럼 오늘의 판으로 다루세요.',
    '카드 세 장은 자리(과거·지금·앞으로)대로 읽고, 같은 카드의 원소·메이저/마이너·수비학과 사주 원국의 오행·용신·대운 흐름을 교차해 해석하세요. 다른 배열로 뽑히면 [카드 선택]에 적힌 배열과 자리 순서대로 읽고, 세 장이 아니면 과거·지금·앞으로로 바꾸지 마세요. 카드와 사주가 서로 다르면 억지로 맞추지 말고 "카드는 ~, 사주는 ~"처럼 나란히 보여 준 뒤 손님이 고를 수 있게 하세요.',
    '결론은 가능성과 선택지로 표현하고 결과를 보장하지 마세요. 건강 진단·법적 판단·투자 결정을 대신하지 마세요. 고민을 한 문장으로 확인하고 바로 해볼 수 있는 행동 하나를 남겨 주세요.',
    '한 번에 한 가지 흐름만 길게 말하고, 손님이 더 묻기를 기다리세요. 도구 이름과 계산값은 쉬운 말로 한 번만 짚고, 대부분은 손님 고민에 대한 이야기로 하세요.',
    birth,
    '[카드 선택] 메시지는 손님이 직접 뽑은 타로 결과입니다. 그 전에는 카드 이름을 말하지 마세요.',
  ].join('\\n');
}

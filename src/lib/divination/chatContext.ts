import type { DivinationToolId } from '../fifteenDivinationTools';
import { calculateIching, castIching } from './iching';
import { calculateLiuren, calculateQimen, eventInstant } from './eventCharts';

export const CHAT_DIVINATION_MARKER = '[채팅 실제 점술 계산 결과]';
export interface ChatCalculation { tool: DivinationToolId; value: unknown }
/** One call per submitted message; retain its prompt for streaming retries. Never call on render. */
export function buildChatDivinationContext(input: {
  text: string;
  selected: readonly DivinationToolId[];
  casual?: boolean;
  now?: Date;
  previous?: string;
}) {
  const {text,selected,casual}=input;
  const results: ChatCalculation[]=[];
  if (casual || !text.trim() || /^(안녕|고마워|응|그래|ㅋㅋ+|ㅎㅎ+)[!~.\s]*$/.test(text.trim())) return {prompt:'',results};
  // Supplied lab results/manual charts are interpreted as-is, never silently recast.
  if (/실제 계산 결과|실제 산출|"(?:primary|transmissions|chart)"\s*:/.test(text)) {
    return {prompt:`${CHAT_DIVINATION_MARKER}\n사용자가 제공한 계산값을 그대로 해석해. 이번 메시지에는 새 작괘·포국을 하지 않았어.`,results};
  }
  if (input.previous?.startsWith(CHAT_DIVINATION_MARKER) && /그\s*괘|그\s*결과|변효|지괘|(?:좀\s*더|이어서|방금).*(?:해석|풀이|괘|포국)/.test(text) && !/새로|다시\s*(?:뽑|작괘|포국)|재추첨/.test(text)) {
    return {prompt:input.previous+'\n[후속 해석] 이전 계산값을 재사용했으며 새 작괘·포국을 하지 않았어.',results};
  }
  const eventIds=selected.filter(id=>id==='iching'||id==='liuren'||id==='qimen');
  if (!eventIds.length) return {prompt:'',results};
  const wantsReading=/봐\s*줘|봐줄|뽑아|뽑아줘|작괘|점쳐|포국|풀이|풀어\s*줘|해석|운세|운을|운이|어떨|어떻게\s*될|될까|할까|궁금|전망|추천|조언|알려\s*줘|알려줘|리딩|상담|6효|육효/.test(text);
  const asksDefinition=/무엇|뭐야|뭔지|뜻|원리|사용법|설명|차이|계산법|구현|정확도|방법/.test(text);
  if (!wantsReading || (asksDefinition&&!/내\s*.*(?:운|상황)|작괘해|포국해|점쳐|뽑아/.test(text))) return {prompt:'',results};
  const now=input.now??new Date();
  const notes:string[]=[];
  const timestamp=text.match(/(\d{4}-\d{2}-\d{2})[T\s]+(\d{2}:\d{2})/);
  let instant=now;
  let timeError='';
  if (timestamp) {
    // Plain timestamps use an explicit, disclosed KST convention. Never infer another zone.
    if (/UTC|GMT|뉴욕|런던|도쿄|상하이|[+-]\d{2}:?\d{2}|\d{2}:\d{2}Z/i.test(text)) timeError='지정 시간대는 채팅 자동 포국에서 지원하지 않아. 계산실에서 시간대를 선택해 줘.';
    else try {instant=eventInstant(timestamp[1],timestamp[2],'Asia/Seoul');} catch(e) {timeError=e instanceof Error?e.message:'지정 점시를 확인해 줘.';}
  } else if (/(점시|기준\s*시각|포국\s*시각).*(내일|어제|오전|오후|\d시)|\d{4}[-./년]\s*\d{1,2}[-./월]/.test(text)) {
    timeError='지정 점시는 YYYY-MM-DD HH:mm 한국시간으로 입력하거나 계산실에서 선택해 줘. 임의 시각으로 대체하지 마.';
  }
  for(const id of eventIds) {
    try {
      if (id==='iching') {
        const manual=text.match(/(?:6효|육효|효\s*입력)\s*[:：]?\s*((?:[6789][\s,]+){5}[6789])(?!\d)/);
        if (/6효|육효|효\s*입력/.test(text)&&!manual) throw new RangeError('6효는 아래→위 순서로 6·7·8·9 중 여섯 개를 입력해 줘. 오류를 새 작괘로 대체하지 마.');
        results.push({tool:id,value:manual?calculateIching(manual[1].split(/[\s,]+/).map(Number)):castIching()});
      } else {
        if (timeError) throw new RangeError(timeError);
        // A request for Hongguk specifically is not fulfilled by a different Qimen school.
        if (id==='qimen'&&/홍국/.test(text)) throw new RangeError('홍국기문 별도 수리는 미지원이야. 일반 기문둔갑 차보법으로 바꿨다고 가장하지 마.');
        results.push({tool:id,value:id==='liuren'?calculateLiuren(instant):calculateQimen(instant)});
      }
    } catch(e) {notes.push(`${id} 계산 보류: ${e instanceof Error?e.message:'계산할 수 없어.'}`);}
  }
  if (!results.length&&!notes.length) return {prompt:'',results};
  return {prompt:`${CHAT_DIVINATION_MARKER}
사용자가 보낸 이번 질문에 대해 앱 계산 엔진을 한 번 실행한 결과야. 아래 결과를 우선하고 계산하지 않았다는 예전 안내는 이 결과가 있는 도구에 한해 갱신해.
포국 기준: ${timestamp?'사용자 지정 시각 (별도 시간대가 없으면 한국시간)':'메시지 전송 시점'} · ${Number.isFinite(instant.getTime())?instant.toISOString():'유효하지 않음'} UTC. 주역은 날짜 기반 포국과 독립적인 동전법이야.
${results.map(r=>`${r.tool}: ${JSON.stringify(r.value)}`).join('\n')}
${notes.join('\n')}
답변에 실제 사용한 괘명·변효 또는 포국 기준 시각과 유파를 간단히 밝혀. 주역의 6효 순서는 아래→위야. 추가 괘·카드·명반을 지어내거나 재추첨하지 마. 새로 뽑으라는 요청이 없으면 후속 해석은 대화에 나온 같은 결과를 사용해. 계산이 보류된 도구는 이유를 안내하고 필요한 입력을 물어봐. 미구현 토정비결·태을신수 및 각 도구의 제한은 유지해.`,results};
}

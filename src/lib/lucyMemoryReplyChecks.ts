import { lucyMemoryCompanyNames, type LucyConversationRecall } from './lucyConversationMemory';

/** Narrow, explicit contradictions only; broader interpretation stays with the reviewer. */
export function findLucyMemoryReplyIssues(text:string,recall:LucyConversationRecall,question:string,userTurns:readonly string[]=[]):string[] {
  const issues:string[]=[];
  const plain=text.replace(/[*_`#]/g,'');
  const currentNames=lucyMemoryCompanyNames(question);
  const names=new Set(currentNames.length?currentNames:recall.entries.flatMap(entry=>lucyMemoryCompanyNames(entry.text)));
  const clauses=plain.match(/[^.!?\n]+[.!?\n]?/g)||[];
  if(!recall.ambiguous&&names.size===1&&clauses.some(clause=>
    /(?:어느|어떤|무슨)\s*회사\s*(?:면접\s*)?(?:이야|야|였|인가|인지)|회사\s*(?:이름|명)(?:은|이|을|를)?/.test(clause)
    && /\?|(?:야|니|알려줘|였지|였어|해줄래)[.!\s]*$/.test(clause)
    && !/묻지\s*않|물어보지\s*않|다시\s*묻지/.test(clause))) {
    issues.push('이미 제공된 회사 이름을 다시 질문');
  }
  const supported=[...recall.entries.map(entry=>entry.text),...userTurns,question];
  const assertsSuccess=(value:string)=>(value.match(/[^.!?\n]+[.!?\n]?/g)||[]).some(clause=>
    !/\?\s*$/.test(clause)&&!/예를\s*들|가령|가정|예시|만약|합격(?:했|됐).{0,5}(?:라면|다면)/.test(clause)&&/(?<!불)합격(?:했|됐|한\s*상태)/.test(clause)&&!/않|아니|없|아직/.test(clause));
  if(assertsSuccess(plain)&&!supported.some(assertsSuccess))issues.push('사용자가 알려주지 않은 합격 결과를 과거 사실로 회상');
  const closed=(value:string)=>(value.match(/[^.!?\n]+[.!?\n]?/g)||[]).some(clause=>!/\?\s*$/.test(clause)&&!/만약|가령|가정|예시|취소(?:했|한).{0,5}(?:다면|라면)/.test(clause)&&/취소했|취소한\s*상태|안\s*하기로|않기로|그만뒀/.test(clause)&&!/취소(?:한\s*(?:게|것))?\s*아니|취소\s*안\s*했/.test(clause));
  const reopened=(value:string)=>/다시.{0,15}(?:지원하기로|준비하기로|해보기로|할\s*거야|시작했)|취소\s*안\s*했/.test(value);
  const lastState=[...recall.entries].reverse().find(entry=>closed(entry.text)||reopened(entry.text));
  const reconsidering=/다시.{0,20}(?:할까|해볼까|지원|준비|시작)|재개|마음이?\s*바뀌/.test(question);
  if(!recall.ambiguous&&names.size===1&&lastState&&closed(lastState.text)&&!reconsidering&&clauses.some(clause=>
    /(?:계속|아직).{0,20}준비(?:\s*중|하고\s*있)|(?:계속|다시).{0,15}준비(?:해|하자|부터)/.test(clause)
    && !/않|아니|없|말자/.test(clause)))issues.push('취소한 계획을 여전히 준비 중이거나 계속할 계획으로 되돌림');
  return issues;
}

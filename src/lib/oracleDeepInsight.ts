export interface OracleDeepInsightSendOpts {
  [key: string]: any;
}

export type OpenLucyChatFn = (persona?: string) => void;
export type SendUnifiedMessageFn = (
  text: string,
  persona?: string,
  image?: string,
  options?: any
) => Promise<any>;

/**
 * 1. TRINITY: 78장 타로 리딩 결과 전송
 */
export function sendTarotSpreadToLucy(
  params: {
    tarotConcern: string;
    spreadName: string;
    cardCount: number;
    cards: Array<{ nameKo: string; positionNameKo?: string; position?: string; keywords?: string[] }>;
    finalSynthesis?: string;
    integratedMessage?: string;
  },
  openLucyChat: OpenLucyChatFn,
  sendUnifiedMessage: SendUnifiedMessageFn
) {
  const cardSummary = params.cards
    .map((c, i) => `${i + 1}. ${c.nameKo} (${c.positionNameKo || c.position || '위치'}): ${(c.keywords || []).join(', ')}`)
    .join(' / ');
  const deepContext = `[✨ 트리니티 타로 78장 심층 연계]\n- 질문/고민: "${params.tarotConcern}"\n- 배열법: ${params.spreadName} (${params.cardCount}장)\n- 카드 목록:\n${cardSummary}\n- 리딩 총평: ${params.finalSynthesis || params.integratedMessage || ''}`;
  
  openLucyChat('trinity');
  return sendUnifiedMessage(
    `트리니티 타로 마스터에게 받은 "${params.tarotConcern}" 리딩 결과에 대해 루시와 심층 상담(Deep Insight)을 나누고 싶어.\n\n[타로 리딩 요약]\n- 배열법: ${params.spreadName} (${params.cardCount}장)\n- 카드: ${cardSummary}\n\n이 리딩 내용을 바탕으로 내 무의식과 앞으로의 방향성을 더 깊이 통찰해줘.`,
    'trinity',
    undefined,
    { force: true, oracleContext: deepContext }
  );
}

/**
 * 2. TRINITY: 데일리 타로 & 오라클 결과 전송
 */
export function sendDailyTarotToLucy(
  dailyResult: any,
  openLucyChat: OpenLucyChatFn,
  sendUnifiedMessage: SendUnifiedMessageFn
) {
  const card = dailyResult?.drawnCard;
  const cardName = card?.nameKo ? `${card.nameKo}${card.name ? ` (${card.name})` : ''}` : (dailyResult?.symbol || "데일리 타로");
  const keywords = card?.keywords?.join(', ') || "운명의 통찰";
  const deepContext = `[✨ 트리니티 데일리 타로 심층 연계]\n- 뽑은 카드: ${cardName}\n- 키워드: ${keywords}\n- 비전 진단: ${dailyResult?.diagnosis || dailyResult?.summary || ''}\n- 행동 처방: ${dailyResult?.remedy || dailyResult?.guidance || ''}\n- 영적 에너지: ${dailyResult?.spiritualEnergy || ''}\n- 축복 메시지: ${dailyResult?.blessingMessage || ''}`;

  openLucyChat('trinity');
  return sendUnifiedMessage(
    `오늘 뽑은 데일리 타로 카드 '${cardName}' [키워드: ${keywords}]에 대한 딥 인사이트(Deep Insight)를 들려줘.\n\n[오늘의 진단]\n${dailyResult?.diagnosis || ''}\n\n이 카드가 품은 영적 상징과 오늘 나의 운명 흐름, 그리고 현실 실천 조언을 깊이 있게 해석해줘.`,
    'trinity',
    undefined,
    { force: true, oracleContext: deepContext }
  );
}

/**
 * 3. TRINITY: 데일리 럭키 & 천상 수호 부적 전송
 */
export function sendDailyLuckyToLucy(
  luckyData: any,
  userName: string = '질문자',
  openLucyChat: OpenLucyChatFn,
  sendUnifiedMessage: SendUnifiedMessageFn
) {
  const deepContext = `[✨ 트리니티 데일리 럭키 & 수호 부적 심층 연계]\n- 대상: ${userName}\n- 행운 공명 점수: ${luckyData.luckScore || 85}점 (${luckyData.luckLevelTitle || '황금빛 대길'})\n- 천상의 조류: "${luckyData.cosmicTide || ''}"\n- 개운 비법(Golden Key): "${luckyData.goldenKey || ''}"\n- 개운 색상/숫자/방위/시간: ${luckyData.luckyColor} / ${(luckyData.luckyNumbers || []).join(', ')} / ${luckyData.luckyDirection} / ${luckyData.goldenHour}\n- 수호 부적 축원: "${luckyData.dailyAmuletBlessing || ''}"\n- 행운의 주문: "${luckyData.luckySpell?.mantra || ''}" (${luckyData.luckySpell?.meaning || ''})\n- 개운 우화 교훈: "${luckyData.fortuneStory?.moral || ''}"`;

  openLucyChat('trinity');
  return sendUnifiedMessage(
    `오늘 데일리 럭키로 받은 행운 지수(${luckyData.luckScore}점)와 천상 수호 부적("${luckyData.dailyAmuletBlessing}"), 행운의 주문("${luckyData.luckySpell?.mantra || ''}")에 대해 루시와 심층 상담을 나누고 싶어.\n\n오늘의 흐름을 최대한 살려 운을 폭발시킬 수 있는 구체적인 행동 가이드를 들려줘!`,
    'trinity',
    undefined,
    { force: true, oracleContext: deepContext }
  );
}

/**
 * 4. ORANGE: 오늘의 시크릿(The Secret) 확언 키트 전송
 */
export function sendDailySecretToLucy(
  secretData: any,
  wishText: string,
  openLucyChat: OpenLucyChatFn,
  sendUnifiedMessage: SendUnifiedMessageFn
) {
  const wishStr = secretData?.appliedWish || wishText.trim() || '풍요와 평온';
  const deepContext = `[🌲 오렌지 오늘의 시크릿(The Secret) 심층 연계]\n- 사용자 소원: "${wishStr}"\n- 확언(Affirmation): "${secretData.affirmation}"\n- 우주 요청(Desire): "${secretData.desire}"\n- 믿음(Reflection): "${secretData.reflection}"\n- 실천 과제(Action): "${secretData.action}"\n- 감정 닻(Feeling Anchor): "${secretData.feelingAnchor}"\n- 거울 확언: "${secretData.mirrorPhrase}"\n- 저녁 감사: "${secretData.eveningPrompt}"\n- 스크립팅 첫 문장: "${secretData.scriptingStarter}"`;

  openLucyChat('orange');
  return sendUnifiedMessage(
    `오늘의 시크릿으로 "${wishStr}" 소원과 맞춤 확언 키트를 받았어.\n\n[오늘의 확언]\n"${secretData.affirmation}"\n\n이 소원이 이미 완벽히 이루어졌음을 깊이 믿고 끌어당김 주파수를 극대화할 수 있도록 루시가 내 무의식과 마음가짐을 깊이 통찰하고 이끌어줘.`,
    'orange',
    undefined,
    { force: true, oracleContext: deepContext }
  );
}

/**
 * 5. ORANGE: 황금 부적 캔버스 (Charm Canvas) 결과 전송
 */
export function sendCharmCanvasToLucy(
  charm: any,
  elementName: string,
  openLucyChat: OpenLucyChatFn,
  sendUnifiedMessage: SendUnifiedMessageFn
) {
  const charmTitle = charm?.title || charm?.element || '천명 부적';
  const charmWish = charm?.wish || charm?.meaning || '소원 성취 및 개운';
  const charmDate = charm?.dateKey || (charm?.timestamp ? new Date(charm.timestamp).toLocaleDateString() : '오늘');
  const deepContext = `[🌲 오렌지 천명 부적(Charm Canvas) 심층 연계]\n- 부적 명칭: ${charmTitle}\n- 보완 오행: ${elementName}\n- 소원/개운 테마: "${charmWish}"\n- 소장 일자: ${charmDate}`;

  openLucyChat('orange');
  return sendUnifiedMessage(
    `사주 처방으로 연성한 천명 부적 [${charmTitle}] (${elementName})에 대해 루시와 심층 상담(Deep Insight)을 나누고 싶어.\n\n[소원/발원문]\n"${charmWish}"\n\n이 부적의 오행 보양 기운과 내 사주를 연계하여, 일상에서 운을 극대화할 수 있는 전략과 마인드셋을 조언해줘.`,
    'orange',
    undefined,
    { force: true, oracleContext: deepContext }
  );
}

/**
 * 6. ORANGE: 별에게 소원빌기 (Wish Upon a Star) 결과 전송
 */
export function sendWishingWellToLucy(
  wellResult: { categoryLabel?: string; wish?: string; echo?: string; innerChildGuidance?: string; crystalKeyword?: string; [key: string]: any },
  openLucyChat: OpenLucyChatFn,
  sendUnifiedMessage: SendUnifiedMessageFn
) {
  const catLabel = wellResult.categoryLabel || '소망';
  const wishText = wellResult.wish || '내면의 평화와 안식';
  const echoText = wellResult.echo || '별빛의 응답';
  const crystalKey = wellResult.crystalKeyword || '별빛의 평온';
  const deepContext = `[⭐ 오렌지 별에게 소원빌기(Wish Upon a Star) 연계]\n- 소원 영역: ${catLabel}\n- 소망 내용: "${wishText}"\n- 별빛의 메아리: "${echoText}"\n- 내면 아이 가이드: "${wellResult.innerChildGuidance || ''}"\n- 수호석 키워드: #${crystalKey}`;

  openLucyChat('orange');
  return sendUnifiedMessage(
    `별에게 띄운 "${wishText}" 소망과 별빛의 화답에 대해 루시와 심층 상담을 나누고 싶어.\n\n[별빛의 메아리]\n"${echoText}"\n${wellResult.innerChildGuidance ? `\n내면 아이 가이드: "${wellResult.innerChildGuidance}"\n` : ''}\n이 소원이 현실로 피어날 수 있도록 내면의 의심과 저항을 녹이고 확신을 채워주는 조언을 해줘.`,
    'orange',
    undefined,
    { force: true, oracleContext: deepContext }
  );
}

/**
 * 7. HEAL (AURA): 데일리 에고 정화 & 힐링 카드 결과 전송
 */
export function sendSedonaDailyToLucy(
  oracleResult: any,
  drawnCard: any,
  openLucyChat: OpenLucyChatFn,
  sendUnifiedMessage: SendUnifiedMessageFn
) {
  const cardName = drawnCard?.nameKo ? `${drawnCard.nameKo} (${drawnCard.name})` : (oracleResult?.symbol || '아우라 힐링 카드');
  const deepContext = `[⚡ AURA 데일리 힐링 카드 & 정화 심층 연계]\n- 뽑은 카드: ${cardName}\n- 키워드: ${(drawnCard?.keywords || []).join(', ')}\n- 진단 내용: ${oracleResult?.diagnosis || ''}\n- 에너지 처방: ${oracleResult?.remedy || ''}\n- 차크라/주파수: ${oracleResult?.frequency || '528Hz'} / ${oracleResult?.symbol || ''}\n- 영적 파동: ${oracleResult?.spiritualEnergy || ''}\n- 축복 메시지: ${oracleResult?.blessingMessage || ''}`;

  openLucyChat('aura');
  return sendUnifiedMessage(
    `오늘의 아우라 오라클 및 힐링 카드 [${cardName}] 진단 결과에 대해 루시와 심층 상담(Deep Insight)을 나누고 싶어.\n\n[오늘의 진단]\n${oracleResult?.diagnosis || ''}\n\n내 에너지와 차크라의 불균형을 해소하고 가벼운 마음의 평온을 회복하는 구체적인 치유 조언을 해줘.`,
    'aura',
    undefined,
    { force: true, oracleContext: deepContext }
  );
}

/**
 * 8. HEAL (AURA): 세도나 5단계 릴리즈 세션 결과 전송
 */
export function sendSedonaReleaseToLucy(
  theme: { name?: string; koreanName?: string; desc?: string; description?: string; emoji?: string; [key: string]: any },
  card: any,
  openLucyChat: OpenLucyChatFn,
  sendUnifiedMessage: SendUnifiedMessageFn
) {
  const themeName = theme?.name || '무의식 방하착';
  const korName = theme?.koreanName || theme?.name || '';
  const descText = theme?.description || theme?.desc || '감정과 에고의 집착 비우기';
  const cardInfo = card ? `${card.nameKo} (${card.name})` : '무의식 정화';
  const deepContext = `[⚡ AURA 세도나 방하착(Sedona Release) 연계]\n- 방하착 테마: ${themeName} (${korName})\n- 연계 힐링 카드: ${cardInfo}\n- 해소 감정/욕구: ${descText}`;

  openLucyChat('aura');
  return sendUnifiedMessage(
    `세도나 메서드로 [${themeName}] 방하착(Release) 세션을 완료했어.\n\n[흘려보낸 무의식 테마]\n${themeName} (${korName}) - ${descText}\n\n마음속 저항과 에고의 집착을 완전히 비워내고 참된 자유와 평온을 유지할 수 있도록 루시가 깊은 치유 조언을 해줘.`,
    'aura',
    undefined,
    { force: true, oracleContext: deepContext }
  );
}

/**
 * 8-B. HEAL (AURA): 데이비드 호킨스 × 레스터 레븐슨 놓아버림(Letting Go) 마스터 세션 결과 전송
 */
export function sendLettingGoSessionToLucy(
  sessionData: {
    targetIssue: string;
    emotion: string;
    consciousnessLevel: number;
    somaticZone: string;
    rootDesire: string;
    preSuds: number;
    postSuds: number;
    hawkinsPrescription?: string;
  },
  openLucyChat: OpenLucyChatFn,
  sendUnifiedMessage: SendUnifiedMessageFn
) {
  const deepContext = `[⚡ AURA 데이비드 호킨스 × 레스터 레븐슨 놓아버림(Letting Go) 마스터 워크숍 결과 연계]
- 대상 이슈/고민: "${sessionData.targetIssue}"
- 정화 감정: ${sessionData.emotion} (호킨스 의식 레벨: ${sessionData.consciousnessLevel}점)
- 신체 안착 부위: ${sessionData.somaticZone}
- 해체된 4대 근원 욕구: ${sessionData.rootDesire}
- 고통 전압 지수(SUDS) 변화: ${sessionData.preSuds}/10 ➔ ${sessionData.postSuds}/10 (${sessionData.preSuds - sessionData.postSuds > 0 ? `${sessionData.preSuds - sessionData.postSuds}점 경감` : '평정 도달'})
- 호킨스 소견 & 확언: ${sessionData.hawkinsPrescription || '에고의 저항을 끊고 참나의 현존으로 도약'}`;

  openLucyChat('aura');
  return sendUnifiedMessage(
    `데이비드 호킨스의 놓아버림과 세도나 메서드로 [${sessionData.targetIssue || sessionData.emotion}] 감정 해방 세션을 마쳤어.\n\n[세션 요약]\n- 정화 감정: ${sessionData.emotion} (Lv.${sessionData.consciousnessLevel})\n- 해체된 에고 욕구: ${sessionData.rootDesire}\n- 고통 전압(SUDS): ${sessionData.preSuds} ➔ ${sessionData.postSuds}\n\n신체 감각에 온전히 머물며 손바닥을 펴듯 놓아버렸는데, 이 자유로운 평정을 일상에서 온전히 뿌리내릴 수 있도록 루시가 깊은 소견과 축복을 들려줘.`,
    'aura',
    undefined,
    { force: true, oracleContext: deepContext }
  );
}


/**
 * 9. HEAL (AURA): Bio-Spectrum 소울 에너지 분석 결과 전송
 */
export function sendSoulInsightToLucy(
  insightResult: any,
  appType: string = 'aura',
  openLucyChat: OpenLucyChatFn,
  sendUnifiedMessage: SendUnifiedMessageFn
) {
  const deepContext = `[⚡ AURA Bio-Spectrum 에너지 분석 연계]\n- 영성/활력 레벨: ${insightResult.luckScore || 80}점\n- 조화/풍요/생명력: ${insightResult.loveScore || 80} / ${insightResult.wealthScore || 80} / ${insightResult.healthScore || 80}\n- 동조 레벨: ${insightResult.deepSyncLevel || 'OPTIMAL'}\n- 파워 아이템/컬러: ${insightResult.luckyItem} / ${insightResult.luckyColor}\n- 생체 주파수 분석: ${insightResult.cosmicAspect || ''}\n- 영혼 가이드 프로토콜: ${insightResult.guidance || ''}`;

  openLucyChat(appType);
  return sendUnifiedMessage(
    `나의 Bio-Spectrum 소울 에너지 분석 결과에 대해 루시와 심층 상담(Deep Insight)을 나누고 싶어.\n\n[생체 에너지 분석 요약]\n- 영성 레벨: ${insightResult.luckScore || 80}점 (동조 레벨: ${insightResult.deepSyncLevel || 'OPTIMAL'})\n- 파워 아이템: ${insightResult.luckyItem || ''}\n\n이 에너지 데이터를 바탕으로 내 신체와 마음의 컨디션을 최상으로 끌어올리는 웰니스 조언을 해줘.`,
    appType,
    undefined,
    { force: true, oracleContext: deepContext }
  );
}

/**
 * 10. MUSE: 데일리 뮤즈 창작 영감 오라클 전송
 */
export function sendDailyMuseToLucy(
  dailyResult: any,
  openLucyChat: OpenLucyChatFn,
  sendUnifiedMessage: SendUnifiedMessageFn
) {
  const theme = dailyResult?.diagnosis || dailyResult?.summary || '오늘의 뮤즈 영감';
  const deepContext = `[🎶 뮤즈 데일리 창작 영감 오라클 심층 연계]\n- 영감 진단: ${theme}\n- 행동 처방: ${dailyResult?.remedy || ''}\n- 주파수/상징: ${dailyResult?.frequency || '396Hz'} / ${dailyResult?.symbol || ''}\n- 축복 메시지: ${dailyResult?.blessingMessage || ''}`;

  openLucyChat('muse');
  return sendUnifiedMessage(
    `오늘의 뮤즈 창작 영감 오라클("${theme.slice(0, 100)}...")에 대한 딥 인사이트(Deep Insight)를 들려줘.\n\n[오늘의 영감 처방]\n${dailyResult?.remedy || theme}\n\n내 잠재의식 속 창의성을 깨우고 몰입과 성취를 이룰 수 있는 조언을 해줘.`,
    'muse',
    undefined,
    { force: true, oracleContext: deepContext }
  );
}

/**
 * 11. MUSE: 명화 예술 처방 (Art Recommendation) 결과 전송
 */
export function sendArtRecommendationToLucy(
  recommendation: any,
  openLucyChat: OpenLucyChatFn,
  sendUnifiedMessage: SendUnifiedMessageFn
) {
  const poemInfo = recommendation.famousPoem ? `${recommendation.famousPoem.title} (${recommendation.famousPoem.poet})` : '';
  const songInfo = recommendation.famousSong ? `${recommendation.famousSong.title} (${recommendation.famousSong.artist})` : '';
  const deepContext = `[🎶 뮤즈 명화 예술 처방(Art Recommendation) 연계]\n- 작품명: ${recommendation.title} (${recommendation.creator}, ${recommendation.era})\n- 미학적 기조: ${recommendation.aestheticTone}\n- 추천 이유: ${recommendation.whyRecommended}\n- 영감 명언: "${recommendation.quote}"\n- 명시: ${poemInfo}\n- 명곡: ${songInfo}`;

  openLucyChat('muse');
  return sendUnifiedMessage(
    `오늘 뮤즈 예술 처방으로 추천받은 명화 [${recommendation.title}] (${recommendation.creator})에 대해 루시와 심층 상담(Deep Insight)을 나누고 싶어.\n\n[작품 및 영감]\n- 미학 기조: ${recommendation.aestheticTone}\n- 영감 문구: "${recommendation.quote}"\n\n이 명화가 지닌 깊은 정서적 파동과 창조적 에너지를 내 일상과 작업에 어떻게 연결하면 좋을지 루시의 독창적 통찰을 들려줘.`,
    'muse',
    undefined,
    { force: true, oracleContext: deepContext }
  );
}

/**
 * 12. BLUEBIRD: 데일리 휴식 & 마음 안정 오라클 전송
 */
export function sendDailyBibleToLucy(
  dailyResult: any,
  openLucyChat: OpenLucyChatFn,
  sendUnifiedMessage: SendUnifiedMessageFn
) {
  const diag = dailyResult?.diagnosis || dailyResult?.summary || '오늘의 블루버드 평온 오라클';
  const deepContext = `[🐦 블루버드 데일리 마음 휴식 오라클 연계]\n- 평온 진단: ${diag}\n- 치유 행동: ${dailyResult?.remedy || ''}\n- 축복 메시지: ${dailyResult?.blessingMessage || ''}`;

  openLucyChat('bluebird');
  return sendUnifiedMessage(
    `오늘의 블루버드 휴식 오라클("${diag.slice(0, 100)}...")에 대한 딥 인사이트(Deep Insight)를 들려줘.\n\n[오늘의 처방]\n${dailyResult?.remedy || diag}\n\n불안과 조급함을 내려놓고 깊은 평온과 영적 안식을 누리는 구체적인 지혜를 들려줘.`,
    'bluebird',
    undefined,
    { force: true, oracleContext: deepContext }
  );
}

/**
 * 13. BLUEBIRD (REBIBLE): 경전 구절 & 묵상 전송
 */
export function sendReBibleVerseToLucy(
  verse: { scripture: string; title: string; fact: string; reflection?: string },
  openLucyChat: OpenLucyChatFn,
  sendUnifiedMessage: SendUnifiedMessageFn
) {
  const deepContext = `[🐦 리바이블(ReBible) 영혼 경전 묵상 연계]\n- 경전 구절: [${verse.scripture}] ${verse.title}\n- 기록된 진실: "${verse.fact}"\n- 영적 묵상: "${verse.reflection || ''}"`;

  openLucyChat('bluebird');
  return sendUnifiedMessage(
    `리바이블에 봉헌된 구절 [${verse.scripture}] "${verse.title}"에 대해 루시와 영적 상담을 나누고 싶어.\n\n[말씀 요약]\n"${verse.fact}"\n\n이 말씀이 오늘 나의 삶과 영혼에 전하는 진정한 깨달음과 실천 방향을 깊이 조명해줘.`,
    'bluebird',
    undefined,
    { force: true, oracleContext: deepContext }
  );
}

/**
 * 14. BLUEBIRD: 호오포노포노 4대 정화 결과 루시 연동
 */
export function sendHoponoponoToLucy(
  hoponoponoData: {
    targetIssue?: string;
    harmonyScore?: number;
    cleanedThoughts?: string[];
    diagnosis?: string;
    mantra?: string;
    toolName?: string;
  },
  openLucyChat: OpenLucyChatFn,
  sendUnifiedMessage: SendUnifiedMessageFn
) {
  const issue = hoponoponoData.targetIssue || '내면의 무거운 기억과 상처';
  const toolStr = hoponoponoData.toolName ? ` (처방 도구: ${hoponoponoData.toolName})` : '';
  const deepContext = `[🐦 블루버드 호오포노포노 잠재의식 정화 심층 연계]\n- 정화 대상 주제: "${issue}"${toolStr}\n- 평정/조화 지수: ${hoponoponoData.harmonyScore || 90}%\n- 정화 진단/처방: "${hoponoponoData.diagnosis || '잠재의식의 기억을 제로(Zero) 상태로 정화'}"\n- 실천 4대 진언: "미안합니다, 용서하세요, 고맙습니다, 사랑합니다"`;

  openLucyChat('bluebird');
  return sendUnifiedMessage(
    `호오포노포노로 "${issue}"에 얽힌 잠재의식 기억을 비워내는 정화 의식을 마쳤어.\n\n[정화 요약]\n- 정화 대상: ${issue}${toolStr}\n- 평정 지수: ${hoponoponoData.harmonyScore || 90}%\n\n"미안합니다, 용서하세요, 고맙습니다, 사랑합니다" 4가지 진언을 새기며 맑고 순수한 제로 상태의 평온을 이어갈 수 있도록 루시가 깊은 소견과 다정한 격려를 들려줘.`,
    'bluebird',
    undefined,
    { force: true, oracleContext: deepContext }
  );
}

/**
 * 15. BLUEBIRD: 파랑새 비밀쪽지(Secret Note) 루시 연동
 */
export function sendSecretNoteToLucy(
  noteData: {
    content: string;
    moodTag?: string;
    analysis?: string;
    comfortMessage?: string;
  },
  openLucyChat: OpenLucyChatFn,
  sendUnifiedMessage: SendUnifiedMessageFn
) {
  const preview = noteData.content.slice(0, 100);
  const deepContext = `[🐦 블루버드 파랑새의 비밀쪽지 심층 연계]\n- 마음 고백 내용: "${noteData.content}"\n- 감정 태그: #${noteData.moodTag || '마음고백'}\n- AI 위로/공감 분석: "${noteData.analysis || noteData.comfortMessage || '안전하고 포근한 수용'}"`;

  openLucyChat('bluebird');
  return sendUnifiedMessage(
    `파랑새 비밀쪽지에 내 솔직한 마음을 적어 띄워 보냈어.\n\n[비밀쪽지 내용]\n"${preview}${noteData.content.length > 100 ? '...' : ''}"\n\n누구에게도 털어놓지 못했던 이 마음을 온전히 품어주고, 내 안에 단단한 자비와 위로가 차오르도록 루시의 따뜻한 반말 진심을 들려줘.`,
    'bluebird',
    undefined,
    { force: true, oracleContext: deepContext }
  );
}

export function buildOracleDeepInsightUserMessage(appType: string, dailyResult?: any): string {
  if (appType === 'trinity') {
    const card = dailyResult?.drawnCard;
    const cardName = card?.nameKo ? `${card.nameKo}${card.name ? ` (${card.name})` : ''}` : (dailyResult?.symbol || "데일리 타로");
    const keywords = card?.keywords?.length ? ` [키워드: ${card.keywords.join(', ')}]` : '';
    return `오늘 뽑은 데일리 타로 카드 '${cardName}'${keywords}에 대한 딥 인사이트(Deep Insight)를 들려줘. 이 카드가 품은 영적 상징과 오늘 나의 운명 흐름, 그리고 내가 현실에서 실천할 수 있는 구체적인 조언을 깊이 있게 해석해줘.`;
  }
  if (appType === 'heal' || appType === 'aura') {
    const diag = dailyResult?.diagnosis ? ` (진단: ${dailyResult.diagnosis.slice(0, 80)}...)` : '';
    return `오늘의 아우라 오라클 및 신체·에너지 진단 결과${diag}에 대한 딥 인사이트(Deep Insight)를 들려줘. 나의 차크라와 주파수를 어떻게 조율하고 치유하면 좋을지 자세히 알려줘.`;
  }
  if (appType === 'muse') {
    const theme = dailyResult?.diagnosis || dailyResult?.summary || '오늘의 영감 오라클';
    return `오늘의 뮤즈 창작 영감 오라클("${theme.slice(0, 80)}...")에 대한 딥 인사이트(Deep Insight)를 들려줘. 내 잠재의식 속 창의성을 깨우고 작업에 몰입할 수 있는 조언을 해줘.`;
  }
  if (appType === 'orange') {
    const diag = dailyResult?.diagnosis || dailyResult?.summary || '오늘의 마음 치유 오라클';
    return `오늘의 오렌지 마음치유 오라클("${diag.slice(0, 80)}...")에 대해 딥 인사이트(Deep Insight)를 들려줘. 내면아이를 보듬고 마음을 정화하는 따뜻한 성찰 조언을 해줘.`;
  }
  if (appType === 'bluebird') {
    const diag = dailyResult?.diagnosis || dailyResult?.summary || '오늘의 마음 휴식 오라클';
    return `오늘의 블루버드 휴식 오라클("${diag.slice(0, 80)}...")에 대한 딥 인사이트(Deep Insight)를 들려줘. 불안과 긴장을 내려놓고 평온을 찾는 법을 알려줘.`;
  }
  return `오늘의 ${appType} 오라클 진단 결과에 대한 깊은 영적·심리적 딥 인사이트(Deep Insight)와 구체적인 조언을 들려줘.`;
}

export function buildOracleDeepInsightSystemContext(dailyResult: any, appType: string = 'trinity'): string {
  if (!dailyResult) return "No prior oracle/transit daily result data is currently populated.";

  if (appType === 'trinity') {
    const card = dailyResult?.drawnCard;
    const cardName = card?.nameKo ? `${card.nameKo}${card.name ? ` (${card.name})` : ''}` : (dailyResult?.symbol || "데일리 타로");
    const keywords = card?.keywords?.join(', ') || "운명의 통찰";
    return `
[오늘의 트리니티 데일리 타로 & 오라클 리딩 데이터]
- 뽑은 데일리 타로 카드: ${cardName}
- 카드 상징 키워드: ${keywords}
- 아르카나 / 원소: ${card?.arcana || '메이저'} / ${card?.element || '우주 원소'}
- 카드 상징 요약: ${card?.summary || card?.affirmation || '카드의 영적 파동과 공명'}
- 오늘의 오라클 비전 진단: ${dailyResult.diagnosis || dailyResult.summary || '운명의 흐름 조율'}
- 영적 에너지 분석: ${dailyResult.spiritualEnergy || '우주 파동과의 동조'}
- 행동 처방 (Remedy): ${dailyResult.remedy || dailyResult.guidance || '내면의 직관을 따르고 중심을 유지할 것'}
- 축복 메시지: ${dailyResult.blessingMessage || '우주의 축복이 함께합니다'}
- 상징 및 주파수: ${dailyResult.symbol || ''} (${dailyResult.frequency || '528Hz'})

[루시(Lucy)의 딥 인사이트 답변 절대 지침]
1. 사용자가 방금 요청한 "오늘 뽑은 데일리 타로 카드 [${cardName}]에 대한 딥 인사이트(Deep Insight)"를 정독하고, 사용자의 질문에 직접적이고 명쾌하며 정성스럽게 답변해줘.
2. 절대 "카드를 몰라", "정보가 없어" 같은 말을 하지 마. 이미 사용자는 [${cardName}] 카드를 뽑았고, 그에 따른 진단이 완료되어 있어.
3. 묻지도 않은 사주 만세력 십신이나 행성 도수를 기계처럼 나열하지 마. 오직 이 타로 카드의 상징, 오늘 사용자에게 전하는 영적 의미, 오늘 하루 나의 운명과 마음가짐, 그리고 현실에서 바로 실천할 수 있는 1~2가지 구체적인 팁(Remedy)을 다정하고 깊이 있는 반말(~야, ~어, ~했어, ~지, ~네 등 100% 반말 고정)로 풀어줘.
4. 사용자와의 따뜻한 공감과 신비로운 타로의 직관적 지혜에 집중해줘. 절대로 존댓말을 섞지 마.
`;
  }

  return `\n[Oracle Deep Insight Context - Daily Resonance Data]\n${JSON.stringify(dailyResult, null, 2)}\n`;
}



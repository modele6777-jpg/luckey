import { SpecialChannel } from '@/pages/LucyStandalonePage';

export interface LucyAutoDetectResult {
  channels: SpecialChannel[];
  isMaster: boolean;
  isCasual: boolean;
  reasons: string[];
  modeTitle: string;
}

export type SeptagramChannel = 'prologue' | 'orange' | 'trinity' | 'aura' | 'bluebird' | 'muse' | 'epilogue';

export const SEPTAGRAM_CHANNEL_NAMES: Record<SeptagramChannel, string> = {
  prologue: '프롤로그',
  orange: '오렌지',
  trinity: '트리니티',
  aura: '아우라',
  bluebird: '블루버드',
  muse: '뮤즈',
  epilogue: '에필로그',
};

export const SEPTAGRAM_SINGLE_TITLES: Record<SeptagramChannel, string> = {
  prologue: '프롤로그 (서막)',
  orange: '오렌지 (성찰)',
  trinity: '트리니티 (운명)',
  aura: '아우라 (치유)',
  bluebird: '블루버드 (정화)',
  muse: '뮤즈 (영감)',
  epilogue: '에필로그 (회고)',
};

/**
 * 채널 목록을 기반으로 7대 채널 명칭에 부합하는 일관된 모드 타이틀을 반환합니다.
 */
export function formatChannelsModeTitle(channels: SpecialChannel[]): string {
  if (!channels || channels.length === 0) {
    return '가벼운 일상 수다';
  }
  if (channels.length === 7) {
    return '7대 채널 올인원 마스터';
  }
  if (channels.length === 1) {
    const ch = channels[0] as SeptagramChannel;
    return SEPTAGRAM_SINGLE_TITLES[ch] || SEPTAGRAM_CHANNEL_NAMES[ch] || ch;
  }
  const channelNames = channels.map((c) => SEPTAGRAM_CHANNEL_NAMES[c as SeptagramChannel] || c);
  return `${channels.length}중 융합 (${channelNames.join(' + ')})`;
}

/**
 * 텍스트의 키워드 및 대화 의도를 분석하여 적절한 루시 상담 모드를 자동 감지합니다.
 * 7대 채널(프롤로그·오렌지·트리니티·아우라·블루버드·뮤즈·에필로그) 지원 및
 * 융합(Fusion) 시에도 7대 채널명으로 구성된 모드 타이틀 반환.
 */
export function detectLucyChannelsFromText(text: string): LucyAutoDetectResult {
  if (!text || !text.trim()) {
    return {
      channels: [],
      isMaster: false,
      isCasual: true,
      reasons: ['기본 대화'],
      modeTitle: '가벼운 일상 수다'
    };
  }

  const clean = text.toLowerCase().trim();
  const matchedChannels = new Set<SpecialChannel>();
  const reasons: string[] = [];

  // 1. 올인원 마스터 모드 패턴 (7대 영역 총망라 / 풀가동)
  const masterPatterns = [
    /마스터/,
    /올인원/,
    /종합\s*진단/,
    /전체\s*진단/,
    /5대\s*(영역|지능)/,
    /7대\s*(차원|영역|지능|행성|채널)/,
    /칠요/,
    /총망라/,
    /홀리스틱/,
    /풀가동/,
    /종합\s*분석/,
    /전체\s*분석/,
    /종합\s*컨설팅/,
    /(모든|전체|전부)\s*(채널|모드)?\s*융합/,
    /7대\s*(채널)?\s*융합/,
    /마스터\s*모드/
  ];

  if (masterPatterns.some((regex) => regex.test(clean))) {
    return {
      channels: ['prologue', 'orange', 'trinity', 'aura', 'bluebird', 'muse', 'epilogue'],
      isMaster: true,
      isCasual: false,
      reasons: ['7대 우주 지능 올인원 통합 진단'],
      modeTitle: '7대 채널 올인원 마스터'
    };
  }

  // 2. 프롤로그 (서막의 서 - 새로운 시작 / 도전 / 서막 / 비전 / 신년)
  const prologuePatterns = [
    /프롤로그|시작|새로운\s*출발|새\s*출발|도전|서막|출발점|첫걸음|새로운\s*시작|새길/,
    /입문|오리엔테이션|탄생|비전|서곡|개척|새해|신년|다짐|목표\s*수립|비전\s*수립|터닝\s*포인트|도약/
  ];
  if (prologuePatterns.some((regex) => regex.test(clean))) {
    matchedChannels.add('prologue');
    reasons.push('운명의 서막');
  }

  // 3. 오렌지 (성찰의 서 - 1원칙 / 전략 / 의사결정 / 분석 / 감정 연금술 / 소원의 우물)
  const orangePatterns = [
    /오렌지|1원칙|제1원칙|first principle/i,
    /전략|로드맵|방향성|커리어|비즈니스|계획|목표|우선순위|실행\s*계획/,
    /이직|퇴사|취업|구직|면접|연봉|직무|승진|진로|커리어\s*전환/,
    /사업|창업|스타트업|수익\s*모델|매출|마케팅|비즈\s*모델/,
    /의사결정|결정|선택|판단|기회비용|리스크|변수|선택지/,
    /분석|mece|5\s*why|원인\s*규명|병목|근본\s*원인|문제\s*해결|생산성/,
    /소원|우물|소망|성찰|감정\s*연금술/
  ];
  if (orangePatterns.some((regex) => regex.test(clean))) {
    matchedChannels.add('orange');
    reasons.push('전략·1원칙 성찰');
  }

  // 4. 트리니티 (운명의 서 - 사주 / 타로 / 운세 / 대운 / 천을귀인 / 타이밍 / 영적 나침반)
  const trinityPatterns = [
    /트리니티|운세|오늘\s*운|내일\s*운|올해\s*운|신년\s*운|금전운|재물운|연애운|직업운|사업운|시험운|합격운|이사운|행운|불운/,
    /사주|원국|대운|세운|신년운|팔자|사주팔자|궁합|점|점괘|만세력|일주|월주|년주|시주/,
    /타로|스프레드|오라클|카드|카르마|메이저|마이너|아르카나/,
    /천을귀인|용신|희신|기신|십신|삼재|개운|액땜|부적|토정비결/,
    /운명|하늘의\s*타이밍|우주의\s*타이밍|동시성|영적\s*나침반/,
    /점성|별자리|점성술|탄생차트|네이탈|자미두수|육효|주역/
  ];
  if (trinityPatterns.some((regex) => regex.test(clean))) {
    matchedChannels.add('trinity');
    reasons.push('사주·타로 운명');
  }

  // 5. 아우라 (치유의 서 - 호흡 / 1분 명상 / 신체 / 수면 / 웰니스 / 방하착 / 생체 조율)
  const auraPatterns = [
    /아우라|호흡|1분\s*호흡|1분\s*명상|숨|이완|심호흡|단전|들숨|날숨/,
    /신체|몸|피로|체력|피곤|탈진|방전|번아웃|지침|기력|체력\s*저하/,
    /수면|잠|숙면|불면|불면증|밤새|나이트\s*케어|악몽|잠이\s*안|잠자리/,
    /바이오리듬|컨디션|스트레칭|그라운딩|혈자리|미주신경|자율신경|웰니스|통증|어깨|목\s*결림|두통|디톡스/,
    /방하착|세도나|내려놓기|조율|긴장\s*완화/
  ];
  if (auraPatterns.some((regex) => regex.test(clean))) {
    matchedChannels.add('aura');
    reasons.push('호흡·신체 치유');
  }

  // 6. 블루버드 (정화의 서 - 위로 / 상처 / 슬픔 / 눈물 / 호오포노포노 / 비밀쪽지 / 내면아이 / 용서)
  const bluebirdPatterns = [
    /블루버드|파랑새|위로|포옹|안아줘|토닥|따뜻하게|곁에|손잡아/,
    /상처|눈물|울고|슬퍼|슬픔|우울|외로|외로움|괴로|괴로움|힘들어|지쳐|지쳤어|버거워|서러워|속상/,
    /불안|불안해|두려워|두려움|공포|초조|공황|가슴이\s*답답|마음이\s*아파|마음\s*고생/,
    /화나|분노|억울|짜증|자책|죄책감|트라우마|상실|이별|차였어|헤어/,
    /호오포노포노|정화|미안합니다|용서|고맙습니다|사랑합니다/,
    /비밀쪽지|쪽지|손편지|내면아이|자기자비|마음\s*치유|마음\s*챙김/
  ];
  if (bluebirdPatterns.some((regex) => regex.test(clean))) {
    matchedChannels.add('bluebird');
    reasons.push('마음·정화 위로');
  }

  // 7. 뮤즈 (영감의 서 - 창작 / 글쓰기 / 시 / 카피라이팅 / 예술 / 그림 / 음악 / 아이디어 / 도슨트)
  const musePatterns = [
    /뮤즈|영감|창작|창의|발상|아이디어|브레인스토밍|착상/,
    /글쓰기|작시|시인|시적|시\s*한\s*편|(?:^|\s)시(?:[를을이가는은와과]|[\s.,!?]|$)|문장|문체|비유|은유|에세이|소설|작문|스토리/,
    /카피|카피라이팅|슬로건|작명|네이밍|제목|타이틀|브랜드\s*네이밍|대본|시나리오/,
    /예술|미술|그림|음악|화가|도슨트|명작|작품|전시|전시회|디자인|감성/
  ];
  if (musePatterns.some((regex) => regex.test(clean))) {
    matchedChannels.add('muse');
    reasons.push('예술·창작 영감');
  }

  // 8. 에필로그 (기록/회고의 서 - 밤의 서재 / 하루 마감 / 회고 / 일기 / 결산 / 감사)
  const epiloguePatterns = [
    /에필로그|밤의\s*서재|하루\s*마감|마무리|회고|결산|일기|저널|기록|감사\s*일기|감사\s*노트/,
    /오늘\s*하루|오늘\s*있었던|수고했어|하루\s*끝|퇴근|취침\s*전|잠들기\s*전|밤하늘|지혜의\s*서|하루를\s*돌아/
  ];
  if (epiloguePatterns.some((regex) => regex.test(clean))) {
    matchedChannels.add('epilogue');
    reasons.push('하루 마감·회고');
  }

  const channels = Array.from(matchedChannels);
  const isCasual = channels.length === 0;

  const modeTitle = formatChannelsModeTitle(channels);

  return {
    channels,
    isMaster: false,
    isCasual,
    reasons,
    modeTitle
  };
}

export interface SeptagramAutoDetectResult {
  channels: SeptagramChannel[];
  isMaster: boolean;
  isCasual: boolean;
  reasons: string[];
  modeTitle: string;
}

/**
 * 텍스트의 키워드 및 대화 의도를 분석하여 크리스탈 오브의 7대 차원(Septagram)을 정밀 자동 감지합니다.
 */
export function detectSeptagramChannelsFromText(text: string): SeptagramAutoDetectResult {
  if (!text || !text.trim()) {
    return {
      channels: [],
      isMaster: false,
      isCasual: true,
      reasons: ['기본 대화'],
      modeTitle: '수다 모드'
    };
  }

  const clean = text.toLowerCase().trim();
  const matchedChannels = new Set<SeptagramChannel>();
  const reasons: string[] = [];

  // 1. 올인원 마스터 모드 패턴 (7대 차원 총망라 / 풀가동)
  const masterPatterns = [
    /마스터/,
    /올인원/,
    /종합\s*진단/,
    /전체\s*진단/,
    /5대\s*(영역|지능)/,
    /7대\s*(차원|영역|지능|행성|채널)/,
    /칠요/,
    /오브\s*마스터/,
    /전체\s*차원/,
    /전\s*차원/,
    /총망라/,
    /홀리스틱/,
    /풀가동/,
    /통합\s*공명/,
    /종합\s*분석/,
    /전체\s*분석/,
    /종합\s*컨설팅/
  ];

  if (masterPatterns.some((regex) => regex.test(clean))) {
    return {
      channels: ['prologue', 'orange', 'trinity', 'aura', 'bluebird', 'muse', 'epilogue'],
      isMaster: true,
      isCasual: false,
      reasons: ['7대 우주 차원 올인원 마스터 통합 공명'],
      modeTitle: '7대 채널 올인원 마스터'
    };
  }

  // 2. 프롤로그 (서막의 서 - 새로운 시작 / 도전 / 서막 / 허브 / 탄생 / 비전)
  const prologuePatterns = [
    /프롤로그|시작|새로운\s*출발|새\s*출발|도전|서막|출발점|첫걸음|새로운\s*시작|새길/,
    /입문|오리엔테이션|탄생|비전|서곡|개척|새해|신년|다짐|목표\s*수립|비전\s*수립|터닝\s*포인트|도약/
  ];
  if (prologuePatterns.some((regex) => regex.test(clean))) {
    matchedChannels.add('prologue');
    reasons.push('운명의 서막');
  }

  // 3. 오렌지 (성찰의 서 - 1원칙 / 전략 / 의사결정 / 분석 / 감정 연금술 / 소원의 우물)
  const orangePatterns = [
    /1원칙|제1원칙|first principle/i,
    /전략|로드맵|방향성|커리어|비즈니스|계획|목표|우선순위|실행\s*계획/,
    /이직|퇴사|취업|구직|면접|연봉|직무|승진|진로|커리어\s*전환/,
    /사업|창업|스타트업|수익\s*모델|매출|마케팅|비즈\s*모델/,
    /의사결정|결정|선택|판단|기회비용|리스크|변수|선택지/,
    /분석|mece|5\s*why|원인\s*규명|병목|근본\s*원인|문제\s*해결|효율|생산성/,
    /소원|우물|소망|성찰|감정\s*연금술|시크릿/
  ];
  if (orangePatterns.some((regex) => regex.test(clean))) {
    matchedChannels.add('orange');
    reasons.push('전략·1원칙 성찰');
  }

  // 4. 트리니티 (운명의 서 - 사주 / 타로 / 운세 / 대운 / 천을귀인 / 타이밍 / 영적 나침반)
  const trinityPatterns = [
    /운세|오늘\s*운|내일\s*운|올해\s*운|신년\s*운|금전운|재물운|연애운|직업운|사업운|시험운|합격운|이사운|행운|불운/,
    /사주|원국|대운|세운|신년운|팔자|사주팔자|궁합|점|점괘|만세력|일주|월주|년주|시주|오행|천간|지지/,
    /타로|스프레드|오라클|카드|카르마|메이저|마이너|아르카나|예견/,
    /천을귀인|용신|희신|기신|십신|삼재|개운|액땜|부적|토정비결|귀인/,
    /운명|하늘의\s*타이밍|우주의\s*타이밍|동시성|영적\s*나침반|무의식/,
    /점성|별자리|점성술|탄생차트|네이탈|자미두수|육효|주역/
  ];
  if (trinityPatterns.some((regex) => regex.test(clean))) {
    matchedChannels.add('trinity');
    reasons.push('사주·타로 운명');
  }

  // 5. 아우라 (치유의 서 - 호흡 / 1분 명상 / 신체 / 수면 / 웰니스 / 방하착 / 생체 조율)
  const auraPatterns = [
    /호흡|1분\s*호흡|1분\s*명상|숨|이완|심호흡|단전|들숨|날숨/,
    /신체|몸|피로|체력|피곤|탈진|방전|번아웃|지침|기력|체력\s*저하|두통|어깨|담/,
    /수면|잠|숙면|불면|불면증|밤새|나이트\s*케어|악몽|잠이\s*안|잠자리/,
    /바이오리듬|컨디션|스트레칭|그라운딩|혈자리|미주신경|자율신경|웰니스|통증|목\s*결림|디톡스/,
    /방하착|세도나|내려놓기|조율|흘려보내기|집착|긴장\s*완화/
  ];
  if (auraPatterns.some((regex) => regex.test(clean))) {
    matchedChannels.add('aura');
    reasons.push('호흡·신체 치유');
  }

  // 6. 블루버드 (정화의 서 - 위로 / 상처 / 슬픔 / 눈물 / 호오포노포노 / 비밀쪽지 / 내면아이 / 용서)
  const bluebirdPatterns = [
    /위로|포옹|안아줘|토닥|따뜻하게|따스하게|곁에|손잡아/,
    /상처|눈물|울고|슬퍼|슬픔|우울|외로|외로움|괴로|괴로움|힘들어|지쳐|지쳤어|버거워|서러워|속상/,
    /불안|불안해|두려워|두려움|공포|초조|공황|가슴이\s*답답|마음이\s*아파|마음\s*고생/,
    /화나|분노|억울|짜증|자책|죄책감|트라우마|상실|이별|차였어|헤어/,
    /호오포노포노|정화|미안합니다|용서|고맙습니다|사랑합니다|참회/,
    /비밀쪽지|쪽지|손편지|내면아이|자책|자기자비|마음\s*치유|화해|마음\s*챙김/
  ];
  if (bluebirdPatterns.some((regex) => regex.test(clean))) {
    matchedChannels.add('bluebird');
    reasons.push('마음·정화 위로');
  }

  // 7. 뮤즈 (영감의 서 - 창작 / 글쓰기 / 시 / 카피라이팅 / 예술 / 그림 / 음악 / 아이디어 / 도슨트)
  const musePatterns = [
    /영감|창작|창의|발상|아이디어|브레인스토밍|착상|번뜩이는/,
    /글쓰기|시|작시|시\s*한\s*편|(?:^|\s)시(?:[를을이가는은와과]|[\s.,!?]|$)|문장|문체|비유|은유|에세이|소설|작문|스토리|이야기/,
    /카피|카피라이팅|슬로건|작명|네이밍|제목|타이틀|브랜드\s*네이밍|대본|시나리오/,
    /예술|미술|그림|음악|화가|도슨트|명작|작품|전시|전시회|디자인|감성|클래식|노래/
  ];
  if (musePatterns.some((regex) => regex.test(clean))) {
    matchedChannels.add('muse');
    reasons.push('예술·창작 영감');
  }

  // 8. 에필로그 (기록의 서 - 밤의 서재 / 하루 마감 / 회고 / 일기 / 결산 / 감사)
  const epiloguePatterns = [
    /에필로그|밤의\s*서재|하루\s*마감|마무리|회고|결산|일기|저널|기록|감사\s*일기|감사\s*노트/,
    /오늘\s*하루|오늘\s*있었던|수고했어|하루\s*끝|퇴근|취침\s*전|잠들기\s*전|밤하늘|지혜의\s*서|하루를\s*돌아/
  ];
  if (epiloguePatterns.some((regex) => regex.test(clean))) {
    matchedChannels.add('epilogue');
    reasons.push('하루 마감·회고');
  }

  const channels = Array.from(matchedChannels);
  const isCasual = channels.length === 0;

  let modeTitle = '수다 모드';
  if (channels.length === 1) {
    modeTitle = SEPTAGRAM_SINGLE_TITLES[channels[0]] || SEPTAGRAM_CHANNEL_NAMES[channels[0]] || channels[0];
  } else if (channels.length >= 2) {
    const channelNames = channels.map((c) => SEPTAGRAM_CHANNEL_NAMES[c] || c);
    modeTitle = `${channels.length}중 융합 (${channelNames.join(' + ')})`;
  }

  return {
    channels,
    isMaster: false,
    isCasual,
    reasons,
    modeTitle
  };
}

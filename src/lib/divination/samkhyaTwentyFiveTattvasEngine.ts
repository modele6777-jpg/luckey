/**
 * 고대 인도 상키야(Samkhya) 철학 25타트바 & 푸루샤-프라크리티 분별지(Viveka) 해탈 엔진
 * (Ancient Indian Samkhya Philosophy Twenty-Five Tattvas & Purusha-Prakriti Viveka Engine)
 *
 * 인도 6대 정통 철학(Shad-Darshana) 중 가장 오래되고 정밀한 형이상학 체계인 상키야 학파,
 * 카필라(Kapila) 성인의 통찰과 이슈바라크리슈나(Ishvarakrishna)의 《상키야 카리카(Samkhya Karika)》 원전 기반:
 *
 * 1. 2원적 우주 본체론:
 *    - 푸루샤(Purusha): 영원히 순수한 불변의 관조적 순수의식 (무인자·무생산자)
 *    - 프라크리티(Prakriti): 우주 만물의 물질적·심리적 원초 자연 (원인자·생산자)
 * 2. 23대 전개물(Evolutes) 및 25타트바(Tattvas):
 *    - 마하트/붓디(Buddhi): 순수 지성, 판별력의 근원
 *    - 아함카라(Ahamkara): 개별화된 자아의식, 주관적 에고
 *    - 마나스(Manas): 지각과 의도를 통합하는 감각심
 *    - 5지각관(Jnanendriyas) & 5행위관(Karmendriyas)
 *    - 5미세원소(Tanmatras) & 5조대원소(Mahabhutas)
 * 3. 3구나(Tri-Guna) 역동 밸런스:
 *    - 사트바(Sattva): 청정, 명료, 조화, 빛
 *    - 라자스(Rajas): 동요, 열정, 투쟁, 추진력
 *    - 타마스(Tamas): 침체, 둔중, 무명, 장애
 * 4. 비베카 키야티(Viveka Khyati) 분별지 & 카이발랴(Kaivalya) 절대 독존 해탈 지수 (0~100)
 */

import type { UserProfile } from '../sharedState';

export const SAMKHYA_TATTVAS_ENGINE_VERSION = 'LUCKEY-SAMKHYA-TATTVAS-v2.0.0';

export interface SamkhyaTattvaInfo {
  index: number;
  nameSanskrit: string;
  nameKo: string;
  category: 'purusha' | 'prakriti' | 'antahkarana' | 'indriya' | 'tanmatra' | 'mahabhuta';
  categoryKo: string;
  cosmicFunction: string;
  spiritualSignificance: string;
}

export interface GunaBalance {
  sattva: number; // % (0~100)
  rajas: number;  // % (0~100)
  tamas: number;  // % (0~100)
  dominantGuna: 'Sattva (청정·조화)' | 'Rajas (역동·추진)' | 'Tamas (안정·침잠)';
}

export interface SamkhyaTwentyFiveTattvasReport {
  engineVersion: string;
  calculatedAtKst: string;
  dominantTattva: SamkhyaTattvaInfo;
  secondaryTattva: SamkhyaTattvaInfo;
  gunaBalance: GunaBalance;
  vivekaDiscernmentScore: number;     // 0 ~ 100 판별지(비베카 키야티) 지수
  kaivalyaLiberationIndex: number;    // 0 ~ 100 카이발랴(독존 해탈) 준비도
  purushaWitnessPower: number;       // 0 ~ 100 순수 관조자(Witness) 힘
  prakritiEntanglementRisk: number;  // 0 ~ 100 물질계 동일시/속박 위험도
  samkhyaPhilosophicalGuidance: string;
  mindPurificationPrescription: string;
  samkhyaSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatSamkhyaKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

function describeSamkhyaStage(score: number, dominantGuna: string): string {
  if (score >= 82) return `카이발랴 명징기(${dominantGuna}) — 푸루샤 순수 관조자의 빛이 프라크리티의 현상을 고요히 비추는 해탈 통찰기`;
  if (score >= 68) return `비베카 분별기(${dominantGuna}) — 붓디의 지성이 감각의 흔들림을 가라앉히고 본질을 가려내는 정화기`;
  return `사트바 조율기(${dominantGuna}) — 거친 라자스와 무거운 타마스를 내려놓고 맑은 중심을 세우는 수련기`;
}

const TWENTY_FIVE_TATTVAS: SamkhyaTattvaInfo[] = [
  {
    index: 1,
    nameSanskrit: 'Purusha',
    nameKo: '푸루샤 (순수의식)',
    category: 'purusha',
    categoryKo: '영원한 관조자',
    cosmicFunction: '모든 물질적 변화를 비추는 영원불변의 순수 영혼이자 증언자',
    spiritualSignificance: '어떤 번뇌나 고통에도 물들지 않는 진정한 참자아의 빛'
  },
  {
    index: 2,
    nameSanskrit: 'Mula-Prakriti',
    nameKo: '물라 프라크리티 (근원 물질자연)',
    category: 'prakriti',
    categoryKo: '우주 만물의 모태',
    cosmicFunction: '3구나의 균형 상태이자 삼라만상 모든 우주 현상의 잠재적 근원',
    spiritualSignificance: '무한한 창조와 변용의 가능성을 품은 우주적 역동력'
  },
  {
    index: 3,
    nameSanskrit: 'Buddhi / Mahat',
    nameKo: '붓디 / 마하트 (대지성)',
    category: 'antahkarana',
    categoryKo: '내적 기관 (안타카라나)',
    cosmicFunction: '우주적 지성이자 개별 영혼의 판별력, 참된 앎과 결단의 원천',
    spiritualSignificance: '푸루샤의 빛을 온전히 반사하여 거짓 동일시를 깨뜨리는 거울'
  },
  {
    index: 4,
    nameSanskrit: 'Ahamkara',
    nameKo: '아함카라 (자의식·에고)',
    category: 'antahkarana',
    categoryKo: '내적 기관 (안타카라나)',
    cosmicFunction: '“내가 행한다”, “이것은 나의 것이다”라고 규정하는 개체화 원리',
    spiritualSignificance: '개성을 빚어내지만 과도할 경우 고립과 에고의 미망에 빠짐'
  },
  {
    index: 5,
    nameSanskrit: 'Manas',
    nameKo: '마나스 (감각심·사유심)',
    category: 'antahkarana',
    categoryKo: '내적 기관 (안타카라나)',
    cosmicFunction: '외부 감각 정보를 종합하고 의심하며 사유와 욕망을 전달하는 매개체',
    spiritualSignificance: '흔들리는 마음의 고요를 찾아 붓디의 지혜에 복종해야 할 도구'
  },
  {
    index: 6,
    nameSanskrit: 'Shrotra',
    nameKo: '슈로트라 (귀·청각)',
    category: 'indriya',
    categoryKo: '5대 지각관 (즈냐넨드리야)',
    cosmicFunction: '허공(아카샤)의 진동과 소리를 포착하여 내면으로 전달하는 감각',
    spiritualSignificance: '우주적 진리의 소리와 내면의 침묵을 경청하는 지각의 통로'
  },
  {
    index: 7,
    nameSanskrit: 'Tvak',
    nameKo: '트바크 (피부·촉각)',
    category: 'indriya',
    categoryKo: '5대 지각관 (즈냐넨드리야)',
    cosmicFunction: '바람(바유)의 움직임과 온기, 접촉을 감지하는 감각 기관',
    spiritualSignificance: '세상과의 경계를 인지하고 유연한 감응력을 발휘하는 통로'
  },
  {
    index: 8,
    nameSanskrit: 'Chakshus',
    nameKo: '착슈스 (눈·시각)',
    category: 'indriya',
    categoryKo: '5대 지각관 (즈냐넨드리야)',
    cosmicFunction: '불(테자스)의 광채와 형태를 판별하고 시각적 인상을 형성하는 기관',
    spiritualSignificance: '외적 현혹을 넘어 사물의 본질을 꿰뚫어 보는 혜안의 바탕'
  },
  {
    index: 9,
    nameSanskrit: 'Rasana',
    nameKo: '라사나 (혀·미각)',
    category: 'indriya',
    categoryKo: '5대 지각관 (즈냐넨드리야)',
    cosmicFunction: '물(아파스)의 유동성과 맛을 분별하고 생명 양분을 수용하는 감각',
    spiritualSignificance: '삶의 정취와 맛을 음미하되 집착에 매이지 않는 절제의 기관'
  },
  {
    index: 10,
    nameSanskrit: 'Ghrana',
    nameKo: '그라나 (코·후각)',
    category: 'indriya',
    categoryKo: '5대 지각관 (즈냐넨드리야)',
    cosmicFunction: '대지(프리티비)의 냄새와 향기를 맡아 생체 리듬을 조율하는 감각',
    spiritualSignificance: '가장 깊은 본능적 위험과 생명의 향기를 감지하는 근원적 감각'
  },
  {
    index: 11,
    nameSanskrit: 'Vak',
    nameKo: '바크 (언어·발성관)',
    category: 'indriya',
    categoryKo: '5대 행위관 (카르멘드리야)',
    cosmicFunction: '내면의 뜻을 언어와 음성으로 표현하고 진리를 선언하는 행위 기관',
    spiritualSignificance: '말 한마디로 카르마를 짓거나 만인을 치유하는 창조적 표현력'
  },
  {
    index: 12,
    nameSanskrit: 'Pani',
    nameKo: '파니 (손·파악관)',
    category: 'indriya',
    categoryKo: '5대 행위관 (카르멘드리야)',
    cosmicFunction: '도구를 쥐고 물질을 변형하며 창조적 작업을 실행하는 행위 기관',
    spiritualSignificance: '손끝으로 빚어내는 장인적 예술성과 집착을 놓는 방하착의 손'
  },
  {
    index: 13,
    nameSanskrit: 'Pada',
    nameKo: '파다 (발·보행관)',
    category: 'indriya',
    categoryKo: '5대 행위관 (카르멘드리야)',
    cosmicFunction: '공간을 이동하고 목적지를 향해 전진하는 동력 행위 기관',
    spiritualSignificance: '진리를 향해 한 걸음씩 성실하게 나아가는 영적 순례의 발걸음'
  },
  {
    index: 14,
    nameSanskrit: 'Payu',
    nameKo: '파유 (배설관)',
    category: 'indriya',
    categoryKo: '5대 행위관 (카르멘드리야)',
    cosmicFunction: '체내의 독소와 불필요한 노폐물을 배출하고 정화하는 행위 기관',
    spiritualSignificance: '낡고 오염된 찌꺼기와 과거의 집착을 미련 없이 버리는 해독력'
  },
  {
    index: 15,
    nameSanskrit: 'Upastha',
    nameKo: '우파스타 (생식관)',
    category: 'indriya',
    categoryKo: '5대 행위관 (카르멘드리야)',
    cosmicFunction: '생명을 잉태하고 환희와 종족 보존 에너지를 발현하는 행위 기관',
    spiritualSignificance: '원초적 생명력 오자스(Ojas)를 영적 지혜로 승화시키는 원동력'
  },
  {
    index: 16,
    nameSanskrit: 'Shabda-Tanmatra',
    nameKo: '샤브다 탄마트라 (소리 미세원소)',
    category: 'tanmatra',
    categoryKo: '5대 미세원소 (탄마트라)',
    cosmicFunction: '원초적 파동과 소리의 순수한 본질이자 아카샤(허공)의 씨앗',
    spiritualSignificance: '우주 창조의 첫 진동 옴(AUM)과 공명하는 순수 음성 원형'
  },
  {
    index: 17,
    nameSanskrit: 'Sparsha-Tanmatra',
    nameKo: '스파르샤 탄마트라 (촉각 미세원소)',
    category: 'tanmatra',
    categoryKo: '5대 미세원소 (탄마트라)',
    cosmicFunction: '움직임과 감응의 순수한 본질이자 바유(바람)의 씨앗',
    spiritualSignificance: '만물과 닿아 교감하고 생명의 숨결을 전달하는 미세 감응력'
  },
  {
    index: 18,
    nameSanskrit: 'Rupa-Tanmatra',
    nameKo: '루파 탄마트라 (형색 미세원소)',
    category: 'tanmatra',
    categoryKo: '5대 미세원소 (탄마트라)',
    cosmicFunction: '빛과 형상의 순수한 본질이자 테자스(불)의 씨앗',
    spiritualSignificance: '어둠 속에서 찬란하게 형태를 드러내는 영적 비전의 원형'
  },
  {
    index: 19,
    nameSanskrit: 'Rasa-Tanmatra',
    nameKo: '라사 탄마트라 (맛 미세원소)',
    category: 'tanmatra',
    categoryKo: '5대 미세원소 (탄마트라)',
    cosmicFunction: '유동성과 맛의 순수한 본질이자 아파스(물)의 씨앗',
    spiritualSignificance: '우주의 신성한 감로수 암리타(Amrita)의 정수가 되는 미세 에너지'
  },
  {
    index: 20,
    nameSanskrit: 'Gandha-Tanmatra',
    nameKo: '간다 탄마트라 (냄새 미세원소)',
    category: 'tanmatra',
    categoryKo: '5대 미세원소 (탄마트라)',
    cosmicFunction: '견고한 물질성과 향기의 순수한 본질이자 프리티비(땅)의 씨앗',
    spiritualSignificance: '대지의 신성한 향취이자 영혼의 뿌리를 든든히 지탱하는 힘'
  },
  {
    index: 21,
    nameSanskrit: 'Akasha',
    nameKo: '아카샤 (허공·공간)',
    category: 'mahabhuta',
    categoryKo: '5대 조대원소 (마하부타)',
    cosmicFunction: '만물이 존재하고 움직일 수 있도록 일체의 장애 없이 비어 있는 허공',
    spiritualSignificance: '일체의 편견과 한계를 포용하는 텅 빈 충만의 우주적 공간'
  },
  {
    index: 22,
    nameSanskrit: 'Vayu',
    nameKo: '바유 (바람·기체)',
    category: 'mahabhuta',
    categoryKo: '5대 조대원소 (마하부타)',
    cosmicFunction: '쉬지 않고 순환하며 생명에 활력과 호흡 프라나를 불어넣는 기운',
    spiritualSignificance: '정체를 타파하고 신속하게 에너지를 회전시키는 영적 추진력'
  },
  {
    index: 23,
    nameSanskrit: 'Tejas / Agni',
    nameKo: '테자스 / 아그니 (불·화염)',
    category: 'mahabhuta',
    categoryKo: '5대 조대원소 (마하부타)',
    cosmicFunction: '물질을 소화·변형하고 빛과 열로 어둠을 몰아내는 화염의 원소',
    spiritualSignificance: '카르마의 찌꺼기를 불태우고 지혜의 명료함을 밝히는 신성한 불'
  },
  {
    index: 24,
    nameSanskrit: 'Apas / Jala',
    nameKo: '아파스 / 잘라 (물·액체)',
    category: 'mahabhuta',
    categoryKo: '5대 조대원소 (마하부타)',
    cosmicFunction: '만물을 적셔 결합시키고 부드럽게 흐르며 갈증을 해소하는 생명수',
    spiritualSignificance: '모든 막힘을 씻어내고 포용과 화합으로 치유하는 자비의 흐름'
  },
  {
    index: 25,
    nameSanskrit: 'Prithvi',
    nameKo: '프리티비 (대지·고체)',
    category: 'mahabhuta',
    categoryKo: '5대 조대원소 (마하부타)',
    cosmicFunction: '가장 견고한 기반이자 생명체가 발을 딛고 결실을 맺는 대지의 원소',
    spiritualSignificance: '흔들리지 않는 굳건한 신념과 풍요로운 현실적 물질화의 토대'
  }
];

export function calculateSamkhyaTwentyFiveTattvas(params: {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
}): SamkhyaTwentyFiveTattvasReport {
  const { profile, question = '', now = new Date() } = params;

  const bdate = profile?.basic?.birthdate || (profile as unknown as { birthdate?: string; birthDate?: string })?.birthdate || (profile as unknown as { birthDate?: string })?.birthDate || '1995-03-21';
  const btime = profile?.basic?.birthtime || (profile as unknown as { birthtime?: string; birthTime?: string })?.birthtime || (profile as unknown as { birthTime?: string })?.birthTime || '12:00';

  const dateParts = bdate.split('-').map(p => parseInt(p, 10) || 0);
  const year = dateParts[0] || 1995;
  const month = dateParts[1] || 3;
  const day = dateParts[2] || 21;

  const timeParts = btime.split(':').map(p => parseInt(p, 10) || 0);
  const hour = timeParts[0] || 12;
  const minute = timeParts[1] || 0;

  let qHash = 0;
  for (let i = 0; i < question.length; i++) {
    qHash = (qHash * 31 + question.charCodeAt(i)) & 0xffffffff;
  }
  const qSeed = Math.abs(qHash);

  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth() + 1;
  const nowDay = now.getDate();
  const nowHour = now.getHours();

  const seed = (year * 365 + month * 31 + day + hour * 17 + minute * 3 + qSeed + nowYear * 12 + nowMonth * 30 + nowDay + nowHour) >>> 0;

  // 1. Dominant & Secondary Tattva Selection
  const domIdx = seed % TWENTY_FIVE_TATTVAS.length;
  let secIdx = (seed * 7 + 13) % TWENTY_FIVE_TATTVAS.length;
  if (secIdx === domIdx) {
    secIdx = (domIdx + 5) % TWENTY_FIVE_TATTVAS.length;
  }

  const dominantTattva = TWENTY_FIVE_TATTVAS[domIdx];
  const secondaryTattva = TWENTY_FIVE_TATTVAS[secIdx];

  // 2. Tri-Guna Balance Calculation (Sum to 100%)
  const rawSattva = 30 + ((seed * 11 + month * 7) % 45); // 30 ~ 74
  const rawRajas = 20 + ((seed * 17 + day * 5) % 40);   // 20 ~ 59
  const rawTamas = 10 + ((seed * 23 + hour * 9) % 35);   // 10 ~ 44
  const totalRaw = rawSattva + rawRajas + rawTamas;

  const sattva = Math.round((rawSattva / totalRaw) * 100);
  const rajas = Math.round((rawRajas / totalRaw) * 100);
  const tamas = 100 - sattva - rajas;

  let dominantGuna: GunaBalance['dominantGuna'] = 'Sattva (청정·조화)';
  if (rajas > sattva && rajas > tamas) {
    dominantGuna = 'Rajas (역동·추진)';
  } else if (tamas > sattva && tamas > rajas) {
    dominantGuna = 'Tamas (안정·침잠)';
  }

  const gunaBalance: GunaBalance = {
    sattva,
    rajas,
    tamas,
    dominantGuna
  };

  // 3. Quantitative Indices
  const vivekaDiscernmentScore = Math.min(100, Math.max(48, Math.round(sattva * 0.8 + (100 - tamas) * 0.2 + ((seed % 17) - 8))));
  const kaivalyaLiberationIndex = Math.min(100, Math.max(45, Math.round(vivekaDiscernmentScore * 0.7 + sattva * 0.3)));
  const purushaWitnessPower = Math.min(100, Math.max(50, Math.round(55 + (sattva * 0.45) + ((qSeed % 11) - 5))));
  const prakritiEntanglementRisk = Math.min(100, Math.max(15, Math.round(tamas * 0.7 + rajas * 0.3)));

  // 4. Guidance Formulation
  const samkhyaPhilosophicalGuidance = `상키야 카리카의 제1원리: "괴로움의 근본 원인은 영원한 관조자 푸루샤(참자아)가 물질 자연 프라크리티의 현상과 자신을 착각하여 동일시하는 데 있다." 현재 당신의 우주적 작용을 이끄는 주재 타트바는 [${dominantTattva.nameKo}]입니다. 감정과 상황의 파도에 휩쓸리지 말고, 그 파도를 온전히 바라보는 내면의 순수 증언자(Purusha)의 자리로 물러서십시오. 3구나 중 [${dominantGuna}]가 주도하고 있으므로, 붓디(지성)의 판별지(Viveka)를 번뜩여 찰나의 현상에 속박되지 않는 내면의 절대 평온(Kaivalya)을 확립하십시오.`;

  const mindPurificationPrescription = `[마음 정화 처방] 보조 타트바 [${secondaryTattva.nameKo}]의 에너지를 도구로 삼아, 감각(마나스)의 분요를 가라앉히고 붓디(대지성)를 맑게 닦아내십시오. 욕망과 번뇌가 일어날 때 "이것은 내가 아니라 자연(Prakriti)의 작용일 뿐이다"라고 관조할 때 비베카 분별지가 당신을 진정한 자유로 이끕니다.`;

  const calculatedAtKst = formatSamkhyaKstTimestamp(now);
  const composite = Math.round(
    (vivekaDiscernmentScore + kaivalyaLiberationIndex + purushaWitnessPower) / 3
  );
  const samkhyaSynthesisMatrix = {
    dominantTension: `${dominantTattva.nameKo} ↔ ${dominantGuna}`,
    alignmentState: describeSamkhyaStage(composite, dominantGuna),
    integratedAction: `${mindPurificationPrescription}${question.trim() ? ` [질문 맥락: ${question.trim()}]` : ''}`,
  };

  return {
    engineVersion: SAMKHYA_TATTVAS_ENGINE_VERSION,
    calculatedAtKst,
    dominantTattva,
    secondaryTattva,
    gunaBalance,
    vivekaDiscernmentScore,
    kaivalyaLiberationIndex,
    purushaWitnessPower,
    prakritiEntanglementRisk,
    samkhyaPhilosophicalGuidance,
    mindPurificationPrescription,
    samkhyaSynthesisMatrix,
  };
}

export function formatSamkhyaTwentyFiveTattvasPrompt(rep: SamkhyaTwentyFiveTattvasReport): string {
  const composite = Math.round(
    (rep.vivekaDiscernmentScore + rep.kaivalyaLiberationIndex + rep.purushaWitnessPower) / 3
  );
  const lines = [
    `[고대 인도 상키야(Samkhya) 25타트바 & 푸루샤-프라크리티 분별지 실측 리포트]`,
    `· 연산 시각: ${rep.calculatedAtKst} | 버전: ${rep.engineVersion}`,
    `· 주재 타트바: [${rep.dominantTattva.nameKo} (${rep.dominantTattva.nameSanskrit})] — 분류: ${rep.dominantTattva.categoryKo}`,
    `  - 우주적 기능: ${rep.dominantTattva.cosmicFunction}`,
    `  - 영적 의미: ${rep.dominantTattva.spiritualSignificance}`,
    `· 보조 타트바: [${rep.secondaryTattva.nameKo} (${rep.secondaryTattva.nameSanskrit})] — 분류: ${rep.secondaryTattva.categoryKo}`,
    `· 주도 구나(Tri-Guna): ${rep.gunaBalance.dominantGuna}`,
    `· 분별지 국면: ${describeSamkhyaStage(composite, rep.gunaBalance.dominantGuna)}`,
    `· 상키야 철학적 통찰 지침: ${rep.samkhyaPhilosophicalGuidance}`,
    `· 심신 정화 및 판별 실천 처방: ${rep.mindPurificationPrescription}`,
  ];
  if (rep.samkhyaSynthesisMatrix) {
    lines.push(
      `· 교차 매트릭스 [핵심 긴장: ${rep.samkhyaSynthesisMatrix.dominantTension} | 조율 상태: ${rep.samkhyaSynthesisMatrix.alignmentState}]`,
      `· 통합 실천: ${rep.samkhyaSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}

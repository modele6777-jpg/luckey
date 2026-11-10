import type { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { buildSpecificTarotDailyOracle } from '../../src/lib/dailyTarotOracle.ts';
import { repairDirectionSummaryLine } from '../../src/lib/tarotSummaryUtils.ts';
import { describeGeminiError, getGeminiApiKey } from '../geminiKey.ts';

export interface DailyTarotModelResponse {
  text?: string;
}

export interface DailyTarotRouteOptions {
  /** Explicit key. An empty string skips the model and uses the local card engine. */
  apiKey?: string;
  callModel?: (
    apiKey: string,
    contents: unknown,
    config: Record<string, unknown>,
  ) => Promise<DailyTarotModelResponse>;
}

function cleanDailyTarotDiagnosis(rawText: string): string {
  if (!rawText) return '';
  let text = rawText.trim();

  const section1Matches = [...text.matchAll(/(?:\r?\n|^)\s*###\s*(?:[✨👑💎🌟⚡🏆💰🌅💌☯️🛤️🕯️☀️🧭]\s*)?1[\.\s][^\r\n]*/gi)];
  if (section1Matches.length > 1) {
    const secondIndex = section1Matches[1].index;
    if (secondIndex && secondIndex > 100) {
      const firstPart = text.slice(0, secondIndex).trim();
      const secondPart = text.slice(secondIndex).trim();
      if (firstPart.includes('5.') || firstPart.includes('축복') || firstPart.includes('영혼의 한마디')) {
        text = firstPart;
      } else if (secondPart.includes('5.') || secondPart.includes('축복') || secondPart.includes('영혼의 한마디')) {
        text = secondPart;
      } else {
        text = firstPart;
      }
    }
  }

  const halfLen = Math.floor(text.length / 2);
  if (halfLen > 120) {
    const firstHalf = text.slice(0, halfLen).trim();
    const secondHalf = text.slice(halfLen).trim();
    if (firstHalf === secondHalf || secondHalf.startsWith(firstHalf.slice(0, 100))) {
      text = firstHalf;
    }
  }

  const firstSectionIdx = text.search(/(?:\r?\n|^)\s*###\s*(?:[✨👑💎🌟⚡🏆💰🌅💌☯️🛤️🕯️☀️🧭]\s*)?1[\.\s]/);
  if (firstSectionIdx !== -1) {
    const bodyPart = text.slice(firstSectionIdx);
    const trailingSummaryIdx = bodyPart.search(/(?:\r?\n|^)\s*(?:[-*•·\d.]+\s*)?(?:#{1,6}\s*)?(?:\*{1,2}|_{1,2})?\s*(?:[✨🌟🔮📌💡📋💎⚡🌿🎯■]\s*)*\s*(?:[\[【(])?\s*(?:[✨🌟🔮📌💡📋💎⚡🌿🎯■]\s*)*\s*(?:핵심\s*(?:3줄|세줄|3대)?\s*요약|3줄\s*요약|세줄\s*요약|핵심\s*요약|오늘의\s*요약|Quick\s*Summary)[^\]】)\r\n]*(?:[\]】)])?\s*(?:\*{1,2}|_{1,2})?\s*(?:[:—\-–~]|—[^\r\n]*)?(?:\r?\n|$)/i);
    if (trailingSummaryIdx !== -1) {
      text = text.slice(0, firstSectionIdx + trailingSummaryIdx).trim();
    }
  }

  const step5Pattern = /(?:###\s*(?:[✨👑💎🌟⚡🏆💰🌅💌☯️🛤️🕯️☀️🧭]\s*)?5[\.\s]|5단계|영혼의\s*한마디|당신의\s*길을\s*축복하는)/i;
  const step5Match = text.match(step5Pattern);
  if (step5Match && step5Match.index !== undefined) {
    const afterStep5 = text.slice(step5Match.index);
    const quoteEndMatch = afterStep5.match(/(?:["”'_]\s*(?:\r?\n|$)|[.!?]\s*(?:\r?\n|$))/);
    if (quoteEndMatch && quoteEndMatch.index !== undefined) {
      const quoteEndPos = step5Match.index + quoteEndMatch.index + quoteEndMatch[0].length;
      const remainder = text.slice(quoteEndPos).trim();
      if (/(?:핵심|요약|\[현재\s*에너지\]|\[방향과\s*결단\]|\[실천\s*처방\]|[-*•]\s*\[|[-*•]\s*현재|[-*•]\s*방향|[-*•]\s*실천)/i.test(remainder)) {
        text = text.slice(0, quoteEndPos).trim();
      }
    }
  }

  return text;
}

const ORACLE_MODEL = 'gemini-flash-lite-latest';
const ORACLE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    diagnosis: { type: 'STRING' },
    luckyNumber: { type: 'STRING' },
    luckyColor: { type: 'STRING' },
    remedy: { type: 'STRING' },
    symbol: { type: 'STRING' },
    frequency: { type: 'STRING' },
    spiritualEnergy: { type: 'STRING' },
    blessingMessage: { type: 'STRING' },
    focusPlaylist: { type: 'STRING' },
  },
  required: ['diagnosis', 'luckyNumber', 'luckyColor', 'remedy', 'symbol', 'frequency'],
};

export interface TarotGenerateRequest {
  model: string;
  contents: unknown;
  config?: Record<string, unknown>;
}

/** One JSON object with a diagnosis string, including fenced or embedded JSON. */
export function parseOracleJson(raw: string | undefined | null): Record<string, unknown> | null {
  const text = (raw || '').trim();
  if (!text) return null;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1]?.trim();
  const candidates = [fenced, text].filter((value): value is string => Boolean(value));
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start >= 0 && end > start) candidates.push(text.slice(start, end + 1));
  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as unknown;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && typeof (parsed as { diagnosis?: unknown }).diagnosis === 'string' && (parsed as { diagnosis: string }).diagnosis.trim()) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * The structured schema call is what production was sending. A plain
 * generateContent to the same model succeeds, so a schema/timeout failure
 * retries once in that shape.
 */
export async function requestTarotModelText(
  generate: (request: TarotGenerateRequest) => Promise<{ text?: string }>,
  systemInstruction: string,
  userText: string,
): Promise<string> {
  const failures: string[] = [];
  try {
    const structured = await generate({
      model: ORACLE_MODEL,
      contents: [{ role: 'user', parts: [{ text: userText }] }],
      config: {
        systemInstruction,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
        responseSchema: ORACLE_SCHEMA,
        abortSignal: AbortSignal.timeout(8000),
      },
    });
    const parsed = parseOracleJson(structured.text);
    if (parsed) return JSON.stringify(parsed);
    failures.push('structured response had no diagnosis');
  } catch (error) {
    failures.push(describeGeminiError(error));
  }
  console.warn('[daily-tarot] structured Gemini call was not usable:', failures[failures.length - 1]);
  try {
    const plain = await generate({
      model: ORACLE_MODEL,
      contents: `${systemInstruction}\n\n${userText}\n\nJSON 객체 하나만 반환하세요. 키는 diagnosis, luckyNumber, luckyColor, remedy, symbol, frequency, spiritualEnergy, blessingMessage, focusPlaylist 입니다.`,
      config: { maxOutputTokens: 8192, abortSignal: AbortSignal.timeout(25000) },
    });
    const parsed = parseOracleJson(plain.text);
    if (parsed) return JSON.stringify(parsed);
    failures.push('plain response had no diagnosis');
  } catch (error) {
    failures.push(describeGeminiError(error));
  }
  throw new Error(failures.join(' | '));
}

async function defaultCallModel(apiKey: string, _contents: unknown, config: Record<string, unknown>): Promise<DailyTarotModelResponse> {
  const ai = new GoogleGenAI({ apiKey });
  const systemInstruction = typeof config.systemInstruction === 'string' ? config.systemInstruction : '';
  const userText = '오늘 뽑은 카드의 오라클 비전을 JSON으로 리포트해 줘.';
  const contents = _contents as { parts?: { text?: string }[] }[] | undefined;
  const fromContents = contents?.[0]?.parts?.[0]?.text || userText;
  const text = await requestTarotModelText(
    async (request) => {
      const response = await ai.models.generateContent({
        model: request.model,
        contents: request.contents as never,
        config: request.config,
      });
      return { text: response.text };
    },
    systemInstruction,
    fromContents,
  );
  return { text };
}

/** Shared by the long-running server and the Vercel catch-all. No live model call when the key is absent. */
export async function handleDailyTarotPost(req: Request, res: Response, options: DailyTarotRouteOptions = {}) {
  const { card, mode = 'oracle', profile } = req.body || {};
  if (!card) {
    return res.status(400).json({ error: '카드 정보가 필요합니다.' });
  }

  const cardNameKo = card.nameKo || card.name || '운명의 카드';
  const cardNameEn = card.name || '';
  const cardType = card.type === 'major' ? '메이저 아르카나' : `${String(card.type || 'minor').toUpperCase()} 수트 (마이너 아르카나)`;
  const cardKeywords = (card.keywords || []).join(', ') || '직관, 통찰, 조화';
  const isReversed = !!card.reversed;
  const orientation = isReversed ? '역방향 (Reversed)' : '정방향 (Upright)';

  let userContextBlock = '';
  if (profile?.basic) {
    const b = profile.basic;
    userContextBlock = `\n\n[질문자 프로필 & 사주 배경지식]:\n- 닉네임/호칭: ${b.nickname || b.name || '질문자'} (※ 실명보다 친근한 닉네임을 최우선으로 다정하게 불러주세요)\n- 생년월일: ${b.birthdate || '미입력'} (${b.lunarSolar || '양력'})\n- 생시: ${b.birthtime || '미입력'}\n- 성별: ${b.gender || '미입력'}${profile.fate?.currentWorry ? `\n- 최근 주요 고민: ${profile.fate.currentWorry}` : ''}${profile.fate?.lifeGoal ? `\n- 인생 핵심 목표: ${profile.fate.lifeGoal}` : ''}\n[배경지식 반영 필수 원칙]: 위 질문자의 기본 프로필(닉네임 호칭 우선)과 운명적 배경을 카드의 ${orientation} 상징 및 일일 비전과 깊이 있게 연계하여 서술하세요.`;
  }

  const apiKey = options.apiKey !== undefined ? options.apiKey : getGeminiApiKey();
  if (apiKey) {
    try {
      const systemInstruction = `당신은 질문자의 하루를 꿰뚫어보고, 따뜻한 공감과 날카로운 직관으로 운명의 길을 밝혀주는 신비롭고 영험한 전문 타로 마스터 '트리니티'입니다.
실제 1:1 타로 상담실에서 촛불을 켜고 내담자의 눈을 마주 보며 카드를 한 장씩 넘겨 리딩해 주듯, 살아 숨 쉬는 생생한 대화형 어조(정중하고 기품 있는 해요체·하십시오체)로 깊은 울림을 선사하십시오.

[상담 개요]
- 내담자: 오늘의 타로 데일리 리딩
- 펼쳐진 카드: [${cardNameKo} (${cardNameEn})] [${cardType}, ${orientation}, 핵심 키워드: ${cardKeywords}]${userContextBlock}

[🚫 절대 금지 규칙 — 우주물리학 비유 및 뜬구름 잡는 추상적 수사 전면 금지]
- '화이트홀', '블랙홀', '웜홀', '사건의 지평선' 등 공상과학/우주물리학 비유나 비현실적인 용어는 일체 사용하지 마십시오.
- '손끝 물리량', '터치 체류 시간', '떨림 지수', '파동 측정' 등 인위적인 감지 지표나 수치를 결코 언급하지 마십시오.
- '내면의 빛', '영혼의 파동', '우주적 인도' 등 뜬구름 잡는 추상적 표현을 배제하고, 오늘 직장/업무, 대인관계, 금전 등 질문자의 실제 하루 일상에서 벌어질 구체적인 상황과 팩트를 생생하게 짚어주십시오.

[🚫 내용 중복 및 반복 서술 엄격 금지]
- 동일한 문장, 동일한 조언, 동일한 표현을 리딩 내에서 절대로 2번 이상 중복하여 서술하지 마십시오.
- 각 단계(1단계~5단계)는 고유한 통찰과 관점을 담아야 하며, 앞서 언급한 카드의 해석이나 키워드를 다른 단계에서 그대로 복사하듯 반복 나열하지 마십시오.

[🔮 타로 마스터 리딩 원칙 — 보고서형 어투 절대 금지]
1. **생생한 상담실 대화체**: 딱딱한 기획서·보고서·수치 나열형은 절대 지양하십시오. 대신 "카드를 가만히 마주하니...", "오늘 가장 먼저 마음에 와닿는 기운은...", "이 카드가 당신께 이렇게 속삭이고 있네요"처럼 실제 타로 마스터의 생동감 넘치는 호흡으로 이야기하듯 서술하십시오.
2. **깊은 공감과 명쾌한 방향성의 조화**: 내담자가 오늘 겪을 감정과 상황을 따뜻하게 안아주되, 카드가 경고하는 현실적 맹점이나 피해야 할 악수는 숨김없이 명쾌하고 솔직하게 짚어주십시오.
3. **명확하고 흔들림 없는 결론**: 애매하게 얼버무리거나 "상황에 따라 다릅니다" 같은 회피는 금지합니다. 카드의 기운이 가리키는 방향을 마스터의 확신 있는 어조로 단호하게 선언하십시오.
4. **구체적 행동 처방**: 오늘 당장 실천할 행동과 골든타임(오전/오후/특정 시점)을 손에 잡히듯 구체적으로 지시하십시오.

[✨ 리딩 구성 형식 — 반드시 아래 순서대로 감동적이고 흡입력 있게 전개하세요]

[✨ 핵심 3줄 요약 — 리딩 결과의 최상단에 반드시 아래 형식으로 3줄 요약을 가장 먼저 작성하십시오]
[핵심 3줄 요약]
- [현재 에너지] (1. 카드가 비추는 당신의 마음과 현재 에너지 섹션의 제목에 맞춘 핵심 1문장 요약)
- [방향과 결단] 이 카드의 이름과, 그 카드가 오늘 가리키는 구체적인 방향을 한 문장으로 적으십시오. "과감한 결단", "확실한 추진", "신중한 내실 다지기", "유연한 관조"처럼 제목만 적고 끝내는 문장은 금지입니다.
- [실천 처방] (4. 운의 흐름을 바꿀 마스터의 실천 처방 섹션의 제목에 맞춘 구체적 행동 조언 핵심 1문장 요약)

[★ 중복 생성 절대 금지 — 본문 및 하단 중복 기입 전면 배제]
- [핵심 3줄 요약] 블록은 오직 리딩 결과의 최상단에 단 1회만 출력해야 합니다.
- 요약 블록 출력 후에는 해당 요약 내용을 중복 기입하지 마십시오.
- 이어지는 본문 단계(1단계~5단계) 내부나 리딩 맨 마지막(끝부분)에 [핵심 3줄 요약] 또는 요약 블록을 절대로 다시 작성하거나 중복 기입해서는 안 됩니다. 본문 마지막에는 어떠한 형태의 요약 블록도 절대 기재하지 마십시오.

[✨ 본문 심층 리딩 — 최상단 3줄 요약 출력 완료 후, 아래 5단계 마크다운 구조로 순서대로 전개하세요]

### 🕯️ 1. 카드가 비추는 당신의 마음과 현재 에너지
- 오늘 하루를 마주했을 때 전해져 오는 내면의 파동과 무의식의 흐름, 현재 상황의 숨은 진실을 마스터의 깊은 직관으로 짚어주며 깊은 공감대를 형성하십시오.

### 🎴 2. 펼쳐진 카드들이 들려주는 이야기
- 오늘 모습을 드러낸 [${cardNameKo}] 카드의 ${orientation} 상징 그림과 4대 원소(${cardType})의 의미를 생생하게 해독하십시오. 카드 속 상징이 내담자의 실제 오늘 하루 일상, 활동, 대인관계에서 어떤 사건과 감정으로 나타나는지 생생하게 풀어내십시오.

### 🔮 3. 트리니티 마스터의 직관적 결단 & 방향성
- 오늘 하루에 대해 카드가 내린 최종 판정을 명확히 짚어주십시오.
- 본문에서는 방향을 한 문장으로 설명하십시오. "확실한 추진", "신중한 내실 다지기", "과감한 결단", "유연한 관조"는 제목으로만 두지 말고, 왜 이 카드가 그 방향인지를 카드 이름과 함께 문장 안에 적으십시오. [방향과 결단] 요약 줄에는 그 제목만 옮겨 적지 마십시오.

### 🌿 4. 운의 흐름을 바꿀 마스터의 실천 처방 (개운 가이드)
- 내담자가 오늘 당장 행운을 끌어당기고 액운을 피할 수 있는 현실적이고 구체적인 행동 처방(마음가짐, 소통 방식, 피해야 할 행동, 행운의 행동 등)을 다정하면서도 명확하게 짚어주십시오.

### ✨ 5. 오늘 하루를 지켜줄 황금빛 축복과 확언
- 오늘 뽑힌 [${cardNameKo}] 카드의 고유한 도상 상징과 원형, 그리고 내담자의 오늘 하루에 꼭 맞는 세상에 단 하나뿐인 시적이고 감동적인 영혼의 축복 문장과 함께, 하루 종일 마음에 품을 수 있는 [오늘의 황금빛 확언] 문장을 반드시 함께 작성하십시오.
- 서식 예시:
> _"축복 문장..."_

- **오늘의 황금빛 확언**: "나는 오늘 어떤 상황 속에서도 평온한 내면의 중심을 지키며, 나에게 찾아오는 모든 밝은 기회와 은총을 기쁘게 누립니다."

[⚠️ 필수 완결성 및 요약 중복 배제 원칙]
- 중간에 서술을 멈추거나 생략하지 마십시오.
- 본문 마지막(5단계 이후)에 [핵심 3줄 요약]이나 어떠한 형태의 요약 블록도 절대로 다시 작성하지 마십시오.
- 최상단 [핵심 3줄 요약]부터 1단계~5단계 마지막 축복까지 한 문장도 끊김 없이 끝까지 완결된 형태로 작성하여 주십시오.`;

      const config = { systemInstruction };
      const contents = [{ role: 'user', parts: [{ text: `오늘 뽑은 [${cardNameKo}] 카드의 오라클 비전을 리포트해 줘.` }] }];
      const callModel = options.callModel ?? defaultCallModel;
      const response = await callModel(apiKey, contents, config);
      const parsed = parseOracleJson(response.text);
      if (parsed?.diagnosis) {
        parsed.diagnosis = repairDirectionSummaryLine(cleanDailyTarotDiagnosis(String(parsed.diagnosis)), [card]);
        parsed.source = 'model';
        res.setHeader?.('x-luckey-oracle-source', 'model');
        return res.status(200).json(parsed);
      }
      console.warn('[daily-tarot] model response had no diagnosis, using local engine');
    } catch (err) {
      console.warn('[daily-tarot] model failed, using local engine:', describeGeminiError(err));
    }
  } else {
    console.warn('[daily-tarot] GEMINI_API_KEY is unset, using local engine');
  }

  res.setHeader?.('x-luckey-oracle-source', 'engine');
  const local = buildSpecificTarotDailyOracle(card, mode);
  return res.status(200).json({ ...local, diagnosis: repairDirectionSummaryLine(local.diagnosis, [card]), source: 'engine' });
}

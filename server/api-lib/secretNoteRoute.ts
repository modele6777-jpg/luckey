import type { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { describeGeminiError, getGeminiApiKey } from '../geminiKey.ts';

const MOODS = [
  { id: 'confession', label: '밤의 고백', emoji: '🌙' },
  { id: 'release', label: '놓아주는 마음', emoji: '🕊️' },
  { id: 'tears', label: '남모를 눈물', emoji: '💧' },
  { id: 'wish', label: '숨겨둔 소망', emoji: '✨' },
  { id: 'letter', label: '파랑새에게 부치는 편지', emoji: '✉️' },
  { id: 'gratitude', label: '비밀 감사', emoji: '🤍' },
] as const;

function parseJson(raw: string | undefined): Record<string, unknown> | null {
  const text = (raw || '').trim();
  if (!text) return null;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1]?.trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  const candidates = [fenced, start >= 0 && end > start ? text.slice(start, end + 1) : '', text].filter((value): value is string => Boolean(value));
  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as unknown;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed as Record<string, unknown>;
    } catch { /* try the next shape */ }
  }
  return null;
}

async function geminiJson(system: string, prompt: string, timeoutMs: number): Promise<Record<string, unknown> | null> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: `${system}\n\n${prompt}\n\nJSON 객체만 반환하세요.`,
      config: { maxOutputTokens: 512, abortSignal: AbortSignal.timeout(timeoutMs) },
    });
    return parseJson(response.text);
  } catch (error) {
    console.warn('[secret-note] gemini failed:', describeGeminiError(error));
    return null;
  }
}

function comfortFor(text: string, name = '당신'): string {
  const lower = text.toLowerCase();
  if (/회사|직장|야근|업무|상사|퇴사|이직|동료/.test(lower)) return `${name} 님, 일터의 무거운 책임감을 잠시 내려놓고, 오늘 밤은 오직 당신만을 위한 따뜻하고 포근한 쉼을 누리세요.`;
  if (/친구|인간관계|상처|서운|배신|오해|눈치/.test(lower)) return `${name} 님의 마음의 평화가 가장 소중합니다. 타인의 시선에 휘둘리지 않고 당신만의 맑은 온기를 지키세요.`;
  if (/사랑|연애|이별|그리움|보고싶|짝사랑/.test(lower)) return `누군가를 진심으로 아끼고 사랑했던 ${name} 님의 순수한 온기는 그 자체로 눈부시게 아름답습니다.`;
  if (/불안|걱정|두려|시험|취업|면접|재정|합격/.test(lower)) return `조급해하지 않아도 괜찮아요, ${name} 님. 모든 순리는 가장 알맞고 아름다운 때에 당신 편이 되어줍니다.`;
  if (/외로|혼자|쓸쓸|우울|눈물|피곤|힘들|지쳐/.test(lower)) return `숨을 깊게 들이쉬고 내쉬어 보세요. 무거운 짐을 견뎌온 ${name} 님이라는 존재 자체로 이미 귀하고 충분합니다.`;
  if (/감사|행복|고마|희망|소망|축복|기쁨/.test(lower)) return `세상에 띄워 보낸 ${name} 님의 다정한 감사의 파동은 머지않아 더 커다란 행운과 평온으로 되돌아옵니다.`;
  return `${name} 님, 흘러간 것은 흘러간 대로 두고, 지금 이 순간의 나를 온전히 안아줍니다.`;
}

export async function handleSecretBlessingPost(req: Request, res: Response) {
  const { content, moodTag, userName } = req.body || {};
  const text = String(content || '').trim();
  const name = String(userName || '당신').trim() || '당신';
  if (!text) return res.status(400).json({ error: '쪽지 내용이 비어 있습니다.' });
  const parsed = await geminiJson(
    '당신은 비밀 쪽지를 읽고 2문장 이내의 한국어 위로(comfortMantra)만 JSON으로 전하는 파랑새입니다.',
    `[닉네임] ${name}\n[테마] ${String(moodTag || 'confession')}\n[쪽지]\n${text.slice(0, 4000)}`,
    8000,
  );
  const mantra = typeof parsed?.comfortMantra === 'string' ? parsed.comfortMantra.trim() : '';
  if (mantra) return res.status(200).json({ comfortMantra: mantra, source: 'model' });
  return res.status(200).json({ comfortMantra: comfortFor(text, name), source: 'engine' });
}

export async function handleSecretMoodPost(req: Request, res: Response) {
  const text = String(req.body?.content || '').trim();
  if (!text) return res.status(400).json({ error: '쪽지 내용이 비어 있습니다.' });
  const parsed = await geminiJson(
    '비밀 쪽지에 가장 맞는 moodTag를 confession, release, tears, wish, letter, gratitude 중 하나와 reason 한 문장으로 JSON에 적으세요.',
    text.slice(0, 4000),
    8000,
  );
  const matched = MOODS.find((mood) => mood.id === parsed?.moodTag);
  if (matched && typeof parsed?.reason === 'string' && parsed.reason.trim()) {
    return res.status(200).json({ moodTag: matched.id, moodLabel: matched.label, emoji: matched.emoji, reason: parsed.reason.trim(), source: 'model' });
  }
  const lower = text.toLowerCase();
  let best: (typeof MOODS)[number] = MOODS[0];
  let reason = '진솔한 마음을 담은 고백입니다.';
  if (/눈물|슬프|상처|외로|우울|힘들/.test(lower)) { best = MOODS[2]; reason = '남모르게 홀로 삼켜온 슬픔과 눈물의 온기가 느껴집니다.'; }
  else if (/놓아|비우|미련|용서|정리/.test(lower)) { best = MOODS[1]; reason = '무거운 짐을 내려놓고 마음을 비워내려는 용기가 돋보입니다.'; }
  else if (/소원|소망|꿈|희망/.test(lower)) { best = MOODS[3]; reason = '가슴 깊이 간직한 빛나는 소망과 바람이 담겨 있습니다.'; }
  else if (/감사|고마|축복/.test(lower)) { best = MOODS[5]; reason = '세상을 밝히는 순수한 감사의 파동이 느껴집니다.'; }
  else if (/파랑새|편지|들어줘/.test(lower)) { best = MOODS[4]; reason = '파랑새에게 다정하게 띄워 보내는 마음의 편지입니다.'; }
  return res.status(200).json({ moodTag: best.id, moodLabel: best.label, emoji: best.emoji, reason, source: 'engine' });
}

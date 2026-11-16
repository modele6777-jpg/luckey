import { generateGeminiImage } from '../api-lib/geminiMedia.ts';
import { getGeminiApiKey } from '../geminiKey.ts';
export async function generateImage({ prompt, aspectRatio }: { prompt: string; aspectRatio?: string }) {
  return { url: await generateGeminiImage(prompt, { ...process.env, GEMINI_API_KEY: getGeminiApiKey() }, aspectRatio) };
}

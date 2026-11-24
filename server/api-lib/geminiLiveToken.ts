import { getGeminiApiKey } from '../geminiKey.ts';
import { issueGeminiLiveToken, type GeminiLiveReading } from './geminiLiveTokenCore.ts';

export { lucyLiveInstruction } from './geminiLiveTokenCore.ts';

export function createGeminiLiveToken(nickname = '', reading?: GeminiLiveReading) {
  return issueGeminiLiveToken(getGeminiApiKey(), nickname, reading, process.env.ORB_LIVE_USAGE_PRICES_USD);
}

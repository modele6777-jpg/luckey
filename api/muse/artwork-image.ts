import type { Response } from 'express';
import { resolveMuseArtworkImage } from '../../server/api-lib/museArtworkImage.ts';
export default async function handler(req: { method?: string; body?: any }, res: Response) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST 요청을 사용해 주세요.' });
  try { return res.json(await resolveMuseArtworkImage(req.body || {})); }
  catch (error: any) { return res.status(error.status || 502).json({ error: 'Gemini 이미지를 생성하지 못했습니다. 다시 시도해 주세요.' }); }
}

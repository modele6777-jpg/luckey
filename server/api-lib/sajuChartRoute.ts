import type { Request, Response } from 'express';
import { SajuInputError, sajuChartFromInput } from './sajuChartApi.ts';

export function handleSajuChartPost(req: Request, res: Response) {
  try {
    return res.status(200).json(sajuChartFromInput(req.body || {}));
  } catch (error) {
    const status = error instanceof SajuInputError ? error.status : 400;
    const message = error instanceof Error ? error.message : '사주 계산에 실패했습니다.';
    const code = error instanceof SajuInputError ? error.code : 'saju_input';
    return res.status(status).json({ error: message, code });
  }
}

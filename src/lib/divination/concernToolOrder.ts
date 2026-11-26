import type { DivinationToolId } from '../lucyToolRegistry';
import type { MasterConcernTopic } from '../lucyMasterPrompts';

/**
 * 고민 주제별로 잘 맞는 기초 도구 (앞일수록 더 잘 맞음).
 * 루시가 이번 고민에 쓸 도구를 고를 때, 그리고 13대 도구 판의 추천 순서를 정할 때 같이 쓴다.
 * (라우터와 도구 판이 서로 임포트하지 않도록 별도 모듈로 둔다.)
 */
export const CONCERN_TOOL_ORDER: Record<MasterConcernTopic, DivinationToolId[]> = {
  love: ['ziwei', 'sukuyo', 'astrology', 'liuren', 'vedic', 'kabbalah'],
  career: ['qimen', 'liuren', 'taiyi', 'iching', 'kyusei', 'ziwei'],
  money: ['qimen', 'ziwei', 'tojeong', 'kyusei', 'liuren', 'taiyi'],
  mind: ['vedic', 'astrology', 'kabbalah', 'iching', 'mahabote', 'sukuyo'],
  general: ['iching', 'tojeong', 'taiyi', 'astrology', 'kyusei', 'ziwei'],
};

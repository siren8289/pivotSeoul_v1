import type { AiResultFields, AiStatus } from '../types';

// API-003 응답 중 AI 관련 snake_case 필드입니다.
export type RawAiResult = { risk_probability?: number; ai_status?: AiStatus; explanation?: string };

export const toAiResult = (raw: RawAiResult): AiResultFields => ({
  riskProbability: raw.risk_probability,
  aiStatus: raw.ai_status,
  explanation: raw.explanation,
});

// AI(위험 확률·LLM 설명)는 Rule 계산(Run)과 상태를 따로 가지며 AI가 늦거나 실패해도 Rule 결과는 표시합니다. (BR-003)
export type AiStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

// API-003 응답 중 AI가 채우는 부분입니다. riskProbability는 0~1 확률로 가정합니다.
export type AiResultFields = {
  riskProbability?: number;
  aiStatus?: AiStatus;
  explanation?: string;
};

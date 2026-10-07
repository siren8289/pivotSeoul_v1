import type { AiResultFields } from '../types';

// AI 결과가 아직 준비 중이면 Rule 결과를 먼저 보여주고 자동 재조회를 이어갑니다.
export const isAiActive = (result: AiResultFields) => result.aiStatus === 'PENDING' || result.aiStatus === 'RUNNING';

import type { RunResult } from '../types/pivot';

// Rule 계산이 아직 진행 중인지 판단합니다.
export const isRunActive = (result: RunResult) => result.status === 'PENDING' || result.status === 'RUNNING';
// AI 결과가 아직 준비 중이면 Rule 결과를 먼저 보여주고 자동 재조회를 이어갑니다.
export const isAiActive = (result: RunResult) => result.aiStatus === 'PENDING' || result.aiStatus === 'RUNNING';

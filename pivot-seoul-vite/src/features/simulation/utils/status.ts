import type { RunResult } from '../types';

// Rule 계산이 아직 진행 중인지 판단합니다.
export const isRunActive = (result: RunResult) => result.status === 'PENDING' || result.status === 'RUNNING';

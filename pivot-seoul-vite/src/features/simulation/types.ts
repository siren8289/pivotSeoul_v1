// Run(Rule 계산) 관련 타입입니다. AI 필드는 ai-result feature가 정의한 타입을 그대로 합성합니다.
import type { AiResultFields } from '../ai-result';

export type RunStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

// RIR이 danger 이상이면 Red Zone입니다. 값은 RIR과 같은 백분율 단위로 가정합니다.
export type Thresholds = { caution?: number; danger: number };

// API-003 응답: rir은 서버가 계산한 백분율입니다.
export type RunResult = AiResultFields & {
  runId: string;
  status: RunStatus;
  rir?: number;
  isRedZone?: boolean;
  thresholds?: Thresholds;
};

// API-004 실행 이력의 한 행입니다.
export type RunSummary = { runId: string; status: RunStatus; createdAt?: string; rir?: number; isRedZone?: boolean };

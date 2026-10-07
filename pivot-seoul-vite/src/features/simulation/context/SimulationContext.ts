// 시뮬레이션 Context 객체입니다. react-refresh 규칙 때문에 Provider 컴포넌트와 파일을 분리했습니다.
import { createContext } from 'react';
import type { PivotError } from '../../../shared/types/error';
import type { RunResult, RunSummary } from '../types';

export type SimulationContextValue = {
  // 현재 Session에서 마지막으로 만든 Run이며 Session이 바뀌면 null입니다. (파생 값)
  runId: string | null;
  // Run 생성 요청이 진행 중인지 여부입니다.
  starting: boolean;
  runError: PivotError | null;
  result: RunResult | null;
  resultError: PivotError | null;
  history: RunSummary[];
  startRun: () => Promise<string | null>;
  loadResult: (runId: string, signal: AbortSignal) => Promise<RunResult | null>;
  loadHistory: (signal: AbortSignal) => Promise<void>;
};

export const SimulationContext = createContext<SimulationContextValue | null>(null);

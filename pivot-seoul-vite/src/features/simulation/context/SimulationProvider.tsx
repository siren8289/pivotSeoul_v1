// Run 생성·결과·실행 이력을 소유합니다. Session(sessionUuid)은 input이 소유하므로 읽기만 합니다.
import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { toPivotError } from '../../../shared/api/http';
import type { PivotError } from '../../../shared/types/error';
import { useInput } from '../../input';
import { createRun, fetchRunResult, fetchRuns } from '../api/run-api';
import type { RunResult, RunSummary } from '../types';
import { SimulationContext } from './SimulationContext';

type RunRequest = { pending: boolean; error: PivotError | null };
type ResultState = { data: RunResult | null; error: PivotError | null };
// runId가 어느 Session에서 만들어졌는지 함께 보관해 Session이 바뀌면 자동으로 무효가 되게 합니다.
type LastRun = { sessionUuid: string; runId: string };

export function SimulationProvider({ children }: { children: ReactNode }) {
  const { sessionUuid } = useInput();
  const [lastRun, setLastRun] = useState<LastRun | null>(null);
  // 온보딩(SCR-003)과 실행(SCR-004)의 오류는 각 feature가 따로 소유해 화면 이동 후 다른 화면에 남지 않게 합니다.
  const [runRequest, setRunRequest] = useState<RunRequest>({ pending: false, error: null });
  const [resultState, setResultState] = useState<ResultState>({ data: null, error: null });
  const [history, setHistory] = useState<RunSummary[]>([]);

  const runId = lastRun && lastRun.sessionUuid === sessionUuid ? lastRun.runId : null;

  // SCR-004 → API-002: Run 생성과 Rule 계산이 끝나면 runId를 반환하고 실패 시 null을 반환합니다.
  const startRun = useCallback(async () => {
    if (runRequest.pending) return null;
    if (!sessionUuid) {
      setRunRequest({ pending: false, error: { kind: 'NOT_FOUND', message: '세션이 없습니다. 조건을 먼저 입력해주세요.' } });
      return null;
    }
    setRunRequest({ pending: true, error: null });
    try {
      const id = await createRun(sessionUuid);
      setLastRun({ sessionUuid, runId: id });
      setRunRequest({ pending: false, error: null });
      return id;
    } catch (cause) {
      setRunRequest({ pending: false, error: toPivotError(cause) });
      return null;
    }
  }, [runRequest.pending, sessionUuid]);

  // SCR-005 → API-003: 취소된 요청의 결과는 상태에 반영하지 않습니다.
  const loadResult = useCallback(async (id: string, signal: AbortSignal) => {
    setResultState(current => current.error ? { ...current, error: null } : current);
    try {
      const data = await fetchRunResult(id, signal);
      if (signal.aborted) return null;
      setResultState({ data, error: null });
      return data;
    } catch (cause) {
      if (!signal.aborted) setResultState(current => ({ ...current, error: toPivotError(cause) }));
      return null;
    }
  }, []);

  // SCR-005 → API-004: 이력은 보조 정보이므로 실패해도 결과 화면을 막지 않고 빈 목록으로 둡니다.
  const loadHistory = useCallback(async (signal: AbortSignal) => {
    if (!sessionUuid) return;
    try {
      const runs = await fetchRuns(sessionUuid, signal);
      if (!signal.aborted) setHistory(runs);
    } catch {
      if (!signal.aborted) setHistory([]);
    }
  }, [sessionUuid]);

  return (
    <SimulationContext.Provider value={{
      runId, starting: runRequest.pending, runError: runRequest.error,
      result: resultState.data, resultError: resultState.error, history,
      startRun, loadResult, loadHistory,
    }}>
      {children}
    </SimulationContext.Provider>
  );
}

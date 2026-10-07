import { useEffect, useState } from 'react';
import { isAiActive } from '../../ai-result';
import { isRunActive } from '../utils/status';
import { useSimulation } from './useSimulation';

const POLL_MS = 3000;

// Rule 또는 AI가 진행 중이면 3초마다 다시 조회하고, 완료·실패·오류 시 멈춥니다. retry는 수동 재조회입니다.
export function useRunResult(runId: string | null) {
  const { result, resultError, loadResult } = useSimulation();
  const [attempt, setAttempt] = useState(0);
  // Context에 남아 있는 이전 실행의 결과가 잠깐 보이지 않도록 runId가 일치할 때만 사용합니다.
  const current = result && result.runId === runId ? result : null;

  useEffect(() => {
    if (!runId) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      const data = await loadResult(runId!, controller.signal);
      if (data && (isRunActive(data) || isAiActive(data))) timer = setTimeout(poll, POLL_MS);
    }
    void poll();
    // 페이지를 떠나거나 재조회할 때 진행 중인 요청과 예약된 조회를 취소합니다.
    return () => { controller.abort(); clearTimeout(timer); };
  }, [runId, attempt, loadResult]);

  return { current, error: resultError, retry: () => setAttempt(value => value + 1) };
}

import { useEffect } from 'react';
import { useSimulation } from './useSimulation';

// 새 Run이 생기면 실행 이력을 다시 가져옵니다.
export function useRunHistory(runId: string | null) {
  const { history, loadHistory } = useSimulation();

  useEffect(() => {
    const controller = new AbortController();
    void loadHistory(controller.signal);
    return () => controller.abort();
  }, [runId, loadHistory]);

  return history;
}

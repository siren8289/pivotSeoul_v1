import { useContext, useEffect, useState } from 'react';
import { ModelContext } from '../context/ModelContext';

// 마운트 시 모델 비교를 조회하고, retry를 호출하면 같은 요청을 다시 보냅니다.
export function useModelCompare() {
  const context = useContext(ModelContext);
  if (!context) throw new Error('useModelCompare는 ModelProvider 안에서만 사용할 수 있습니다.');
  const { models, modelsError, loadModels } = context;
  // 재시도 횟수가 바뀌면 effect가 다시 실행되어 비교 데이터를 새로 조회합니다.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    void loadModels(controller.signal);
    // 페이지를 떠나거나 재시도할 때 진행 중인 요청을 취소합니다.
    return () => controller.abort();
  }, [attempt, loadModels]);

  return { models, error: modelsError, retry: () => setAttempt(value => value + 1) };
}

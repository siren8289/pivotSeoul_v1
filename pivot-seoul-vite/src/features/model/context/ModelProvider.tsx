// 모델 비교 조회 결과를 소유합니다. 화면을 다시 열어도 직전 결과를 먼저 보여주기 위해 Context에 보관합니다.
import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { toPivotError } from '../../../shared/api/http';
import type { PivotError } from '../../../shared/types/error';
import { fetchModelCompare } from '../api/model-api';
import type { ModelEntry } from '../types';
import { ModelContext } from './ModelContext';

type ModelState = { models: ModelEntry[] | null; error: PivotError | null };

export function ModelProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ModelState>({ models: null, error: null });

  // SCR-006 → API-009: ML·DL 모델 비교와 Champion 정보를 조회합니다. 취소된 요청은 상태에 반영하지 않습니다.
  const loadModels = useCallback(async (signal: AbortSignal) => {
    setState(current => current.error ? { ...current, error: null } : current);
    try {
      const models = await fetchModelCompare(signal);
      if (!signal.aborted) setState({ models, error: null });
    } catch (cause) {
      if (!signal.aborted) setState(current => ({ ...current, error: toPivotError(cause) }));
    }
  }, []);

  return (
    <ModelContext.Provider value={{ models: state.models, modelsError: state.error, loadModels }}>
      {children}
    </ModelContext.Provider>
  );
}

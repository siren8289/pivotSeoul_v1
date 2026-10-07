// 모델 비교 Context 객체입니다. react-refresh 규칙 때문에 Provider 컴포넌트와 파일을 분리했습니다.
import { createContext } from 'react';
import type { PivotError } from '../../../shared/types/error';
import type { ModelEntry } from '../types';

export type ModelContextValue = {
  // null은 아직 한 번도 조회하지 않은 상태이며 빈 배열(조회 성공, 모델 없음)과 구분합니다.
  models: ModelEntry[] | null;
  modelsError: PivotError | null;
  loadModels: (signal: AbortSignal) => Promise<void>;
};

export const ModelContext = createContext<ModelContextValue | null>(null);

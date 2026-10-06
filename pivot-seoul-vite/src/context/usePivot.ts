// PivotContext 객체와 훅입니다. react-refresh 규칙 때문에 Provider 컴포넌트와 파일을 분리했습니다.
import { createContext, useContext } from 'react';
import type {
  FieldErrors, FormField, HousingForm, ModelEntry, PivotError, RunResult, RunSummary,
} from '../types/pivot';

export type PivotContextValue = {
  form: HousingForm;
  fieldErrors: FieldErrors;
  sessionUuid: string | null;
  runId: string | null;
  // 요청 종류별 진행 상태이며 null이면 대기 중입니다.
  pending: 'session' | 'run' | null;
  sessionError: PivotError | null;
  runError: PivotError | null;
  result: RunResult | null;
  resultError: PivotError | null;
  history: RunSummary[];
  models: ModelEntry[] | null;
  modelsError: PivotError | null;
  setField: (field: FormField, value: string) => void;
  submitOnboarding: () => Promise<boolean>;
  startRun: () => Promise<string | null>;
  loadResult: (runId: string, signal: AbortSignal) => Promise<RunResult | null>;
  loadHistory: (signal: AbortSignal) => Promise<void>;
  loadModels: (signal: AbortSignal) => Promise<void>;
};

export const PivotContext = createContext<PivotContextValue | null>(null);

export function usePivot() {
  const value = useContext(PivotContext);
  if (!value) throw new Error('usePivot은 PivotProvider 안에서만 사용할 수 있습니다.');
  return value;
}

// Page → Component → Event → PivotContext(State) → mvp-api(API Client) → Backend 흐름의 State 계층입니다.
import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import {
  ApiError, createRun, createSession, fetchModelCompare, fetchRunResult, fetchRuns, toPivotError,
} from '../api/mvp-api';
import type {
  FieldErrors, FormField, HousingForm, ModelEntry, PivotError, RunResult, RunSummary,
} from '../types/pivot';
import { validateHousingForm } from '../utils/validation';
import { PivotContext } from './usePivot';

const SESSION_KEY = 'pivot.sessionUuid';
const EMPTY_FORM: HousingForm = { lifeStage: '', income: '', deposit: '', monthlyRent: '' };

export function PivotProvider({ children }: { children: ReactNode }) {
  const [form, setForm] = useState<HousingForm>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  // 새로고침 후에도 실행 이력(API-004)을 조회할 수 있도록 세션 ID만 sessionStorage에 보관합니다.
  const [sessionUuid, setSessionUuid] = useState<string | null>(() => sessionStorage.getItem(SESSION_KEY));
  const [runId, setRunId] = useState<string | null>(null);
  const [pending, setPending] = useState<'session' | 'run' | null>(null);
  // 온보딩(SCR-003)과 실행(SCR-004)의 오류를 분리해 화면 이동 후 다른 화면에 남지 않게 합니다.
  const [sessionError, setSessionError] = useState<PivotError | null>(null);
  const [runError, setRunError] = useState<PivotError | null>(null);
  const [result, setResult] = useState<RunResult | null>(null);
  const [resultError, setResultError] = useState<PivotError | null>(null);
  const [history, setHistory] = useState<RunSummary[]>([]);
  const [models, setModels] = useState<ModelEntry[] | null>(null);
  const [modelsError, setModelsError] = useState<PivotError | null>(null);

  // 입력이 바뀌면 해당 필드의 오류만 지웁니다.
  const setField = useCallback((field: FormField, value: string) => {
    setForm(current => ({ ...current, [field]: value }));
    setFieldErrors(current => ({ ...current, [field]: undefined }));
  }, []);

  // SCR-003 → API-001: 검증 통과 시 Session을 만들고 이전 Run 정보는 초기화합니다.
  const submitOnboarding = useCallback(async () => {
    if (pending) return false;
    const { errors, input } = validateHousingForm(form);
    setFieldErrors(errors);
    setSessionError(null);
    if (!input) return false;
    setPending('session');
    try {
      const uuid = await createSession(input);
      sessionStorage.setItem(SESSION_KEY, uuid);
      setSessionUuid(uuid);
      setRunId(null);
      return true;
    } catch (cause) {
      // 서버 필드 오류는 해당 입력 아래에 표시합니다.
      if (cause instanceof ApiError) setFieldErrors(cause.fields);
      setSessionError(toPivotError(cause));
      return false;
    } finally {
      setPending(null);
    }
  }, [form, pending]);

  // SCR-004 → API-002: Run 생성과 Rule 계산이 끝나면 runId를 반환하고 실패 시 null을 반환합니다.
  const startRun = useCallback(async () => {
    if (pending) return null;
    if (!sessionUuid) {
      setRunError({ kind: 'NOT_FOUND', message: '세션이 없습니다. 조건을 먼저 입력해주세요.' });
      return null;
    }
    setPending('run');
    setRunError(null);
    try {
      const id = await createRun(sessionUuid);
      setRunId(id);
      return id;
    } catch (cause) {
      setRunError(toPivotError(cause));
      return null;
    } finally {
      setPending(null);
    }
  }, [pending, sessionUuid]);

  // SCR-005 → API-003: 취소된 요청의 결과는 상태에 반영하지 않습니다.
  const loadResult = useCallback(async (id: string, signal: AbortSignal) => {
    setResultError(null);
    try {
      const data = await fetchRunResult(id, signal);
      if (signal.aborted) return null;
      setResult(data);
      return data;
    } catch (cause) {
      if (!signal.aborted) setResultError(toPivotError(cause));
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

  // SCR-006 → API-009: ML·DL 모델 비교와 Champion 정보를 조회합니다.
  const loadModels = useCallback(async (signal: AbortSignal) => {
    setModelsError(null);
    try {
      const data = await fetchModelCompare(signal);
      if (!signal.aborted) setModels(data);
    } catch (cause) {
      if (!signal.aborted) setModelsError(toPivotError(cause));
    }
  }, []);

  return (
    <PivotContext.Provider value={{
      form, fieldErrors, sessionUuid, runId, pending, sessionError, runError, result, resultError,
      history, models, modelsError, setField, submitOnboarding, startRun, loadResult, loadHistory, loadModels,
    }}>
      {children}
    </PivotContext.Provider>
  );
}

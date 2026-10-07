// 입력 폼 값·검증 오류·Session을 소유합니다. 다른 feature는 읽기만 하며 변경은 이 Provider의 함수로만 일어납니다.
import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { ApiError, toPivotError } from '../../../shared/api/http';
import type { PivotError } from '../../../shared/types/error';
import { createSession, toFormFieldErrors } from '../api/session-api';
import type { FieldErrors, FormField, HousingForm } from '../types';
import { validateHousingForm } from '../utils/validation';
import { InputContext } from './InputContext';

const SESSION_KEY = 'pivot.sessionUuid';
const EMPTY_FORM: HousingForm = { lifeStage: '', income: '', deposit: '', monthlyRent: '' };

type SessionRequest = { pending: boolean; error: PivotError | null };

export function InputProvider({ children }: { children: ReactNode }) {
  const [form, setForm] = useState<HousingForm>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  // 새로고침 후에도 실행 이력(API-004)을 조회할 수 있도록 세션 ID만 sessionStorage에 보관합니다.
  const [sessionUuid, setSessionUuid] = useState<string | null>(() => sessionStorage.getItem(SESSION_KEY));
  const [request, setRequest] = useState<SessionRequest>({ pending: false, error: null });

  // 입력이 바뀌면 해당 필드의 오류만 지웁니다.
  const setField = useCallback((field: FormField, value: string) => {
    setForm(current => ({ ...current, [field]: value }));
    setFieldErrors(current => ({ ...current, [field]: undefined }));
  }, []);

  // SCR-003 → API-001: 검증 통과 시 Session을 만듭니다. 이전 Run은 simulation이 sessionUuid 기준으로 무효화합니다.
  const submitOnboarding = useCallback(async () => {
    if (request.pending) return false;
    const { errors, input } = validateHousingForm(form);
    setFieldErrors(errors);
    if (!input) {
      setRequest({ pending: false, error: null });
      return false;
    }
    setRequest({ pending: true, error: null });
    try {
      const uuid = await createSession(input);
      sessionStorage.setItem(SESSION_KEY, uuid);
      setSessionUuid(uuid);
      setRequest({ pending: false, error: null });
      return true;
    } catch (cause) {
      // 서버 필드 오류는 해당 입력 아래에 표시합니다.
      if (cause instanceof ApiError) setFieldErrors(toFormFieldErrors(cause));
      setRequest({ pending: false, error: toPivotError(cause) });
      return false;
    }
  }, [form, request.pending]);

  return (
    <InputContext.Provider value={{
      form, fieldErrors, sessionUuid, submitting: request.pending, sessionError: request.error, setField, submitOnboarding,
    }}>
      {children}
    </InputContext.Provider>
  );
}

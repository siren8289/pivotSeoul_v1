// 입력 feature의 Context 객체입니다. react-refresh 규칙 때문에 Provider 컴포넌트와 파일을 분리했습니다.
import { createContext } from 'react';
import type { FieldErrors, FormField, HousingForm } from '../types';
import type { PivotError } from '../../../shared/types/error';

export type InputContextValue = {
  form: HousingForm;
  fieldErrors: FieldErrors;
  sessionUuid: string | null;
  // Session 생성 요청이 진행 중인지 여부이며 같은 요청의 오류와 함께 한 덩어리로 관리됩니다.
  submitting: boolean;
  sessionError: PivotError | null;
  setField: (field: FormField, value: string) => void;
  submitOnboarding: () => Promise<boolean>;
};

export const InputContext = createContext<InputContextValue | null>(null);

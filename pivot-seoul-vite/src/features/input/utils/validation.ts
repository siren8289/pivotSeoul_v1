// SCR-003 입력 검증입니다. 서버(API-001)도 400으로 같은 필드를 검증하므로 최종 판단은 서버가 합니다.
import type { FieldErrors, HousingForm, HousingInput } from '../types';

const moneyFields = ['income', 'deposit', 'monthlyRent'] as const;

// 오류가 하나라도 있으면 input은 null이며 서버에 요청하지 않습니다.
export function validateHousingForm(form: HousingForm): { errors: FieldErrors; input: HousingInput | null } {
  const errors: FieldErrors = {};
  if (!form.lifeStage) errors.lifeStage = '생애단계를 선택해주세요.';
  for (const key of moneyFields) {
    const text = form[key].trim();
    const value = Number(text);
    if (!text) errors[key] = '필수 입력 항목입니다.';
    else if (!/^\d+$/.test(text) || !Number.isSafeInteger(value)) errors[key] = '원 단위 정수를 입력해주세요.';
    else if (value < (key === 'income' ? 1 : 0)) errors[key] = key === 'income' ? '월소득은 1원 이상이어야 합니다.' : '0원 이상을 입력해주세요.';
  }
  if (Object.keys(errors).length) return { errors, input: null };
  return {
    errors,
    input: { lifeStage: form.lifeStage, income: Number(form.income), deposit: Number(form.deposit), monthlyRent: Number(form.monthlyRent) },
  };
}

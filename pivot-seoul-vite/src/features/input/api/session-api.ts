// API-001 Session 생성 클라이언트입니다. 요청·응답 필드는 명세의 snake_case를 가정합니다.
import { ApiError, post, request } from '../../../shared/api/http';
import type { FieldErrors, FormField, HousingInput } from '../types';

// 서버가 camelCase 또는 snake_case 어느 쪽으로 오류 필드를 보내도 폼 필드로 연결합니다.
const FIELD_MAP: Record<string, FormField> = {
  life_stage: 'lifeStage', lifeStage: 'lifeStage', income: 'income', deposit: 'deposit',
  monthly_rent: 'monthlyRent', monthlyRent: 'monthlyRent',
};

// 서버의 필드 오류 중 폼에 있는 필드만 골라 화면용 구조로 변환합니다.
export function toFormFieldErrors(error: ApiError): FieldErrors {
  const fields: FieldErrors = {};
  for (const [name, message] of Object.entries(error.fields)) {
    const field = FIELD_MAP[name];
    if (field) fields[field] = message;
  }
  return fields;
}

// API-001 POST /api/sessions [확인 필요]: 생애단계·온보딩 입력으로 Session을 생성합니다. (BR-001)
export async function createSession(input: HousingInput): Promise<string> {
  const body = await request<{ session_uuid?: string }>('/api/sessions', post({
    life_stage: input.lifeStage, income: input.income, deposit: input.deposit, monthly_rent: input.monthlyRent,
  }));
  if (!body.session_uuid) throw new ApiError('SERVER', '응답에 세션 ID(session_uuid)가 없습니다.');
  return body.session_uuid;
}

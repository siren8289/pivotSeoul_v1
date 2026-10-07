// Backend(Spring) 공통 HTTP 클라이언트입니다. 엔드포인트별 API는 각 feature의 api 폴더가 담당합니다.
import type { ErrorKind, PivotError } from '../types/error';

// 환경변수가 없으면 현재 출처의 /api를 사용하며 끝의 슬래시는 제거합니다.
const base = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

// 서버가 보낸 필드 오류이며 키는 서버 필드명 그대로입니다. 폼 필드와의 매핑은 input feature가 담당합니다.
export type ServerFieldErrors = Record<string, string>;

// 오류 유형(kind)과 400 필드 오류를 함께 전달해 화면이 유형별로 다르게 안내할 수 있게 합니다.
export class ApiError extends Error {
  kind: ErrorKind;
  status: number;
  fields: ServerFieldErrors;
  constructor(kind: ErrorKind, message: string, status = 0, fields: ServerFieldErrors = {}) {
    super(message);
    this.kind = kind;
    this.status = status;
    this.fields = fields;
  }
}

// ApiError가 아닌 예외도 화면에서 같은 구조로 다루도록 변환합니다.
export function toPivotError(cause: unknown): PivotError {
  if (cause instanceof ApiError) return { kind: cause.kind, message: cause.message };
  return { kind: 'SERVER', message: cause instanceof Error ? cause.message : '알 수 없는 오류가 발생했습니다.' };
}

// 객체형({field: message}) 또는 배열형([{field, message}]) 필드 오류를 공통 구조로 변환합니다.
function parseFieldErrors(raw: unknown): ServerFieldErrors {
  const fields: ServerFieldErrors = {};
  const add = (name: unknown, message: unknown) => {
    if (typeof name === 'string') fields[name] = typeof message === 'string' && message ? message : '입력값을 확인해주세요.';
  };
  if (Array.isArray(raw)) for (const item of raw) add(item?.field, item?.message ?? item?.defaultMessage);
  else if (raw && typeof raw === 'object') for (const [name, message] of Object.entries(raw)) add(name, message);
  return fields;
}

// 400은 필드 오류, 404는 세션·Run 없음, 그 외는 서버 오류로 분류합니다.
function toApiError(status: number, body: Record<string, unknown> | null) {
  const kind: ErrorKind = status === 400 ? 'VALIDATION' : status === 404 ? 'NOT_FOUND' : 'SERVER';
  const fields = status === 400 ? parseFieldErrors(body?.field_errors ?? body?.fieldErrors ?? body?.errors) : {};
  const message = typeof body?.message === 'string' ? body.message : `요청에 실패했습니다. (${status})`;
  return new ApiError(kind, message, status, fields);
}

// 모든 API 요청에 공통으로 적용하는 JSON 응답 및 오류 처리입니다.
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${base}${path}`, init);
  } catch (cause) {
    // 요청 취소는 오류가 아니므로 호출한 쪽에서 signal.aborted로 걸러냅니다.
    if (cause instanceof DOMException && cause.name === 'AbortError') throw cause;
    throw new ApiError('NETWORK', '서버에 연결하지 못했습니다. 잠시 후 다시 시도해주세요.');
  }
  // HTML 오류 페이지나 빈 응답은 JSON 파싱 실패 대신 null로 처리합니다.
  const body = await response.json().catch(() => null);
  if (!response.ok) throw toApiError(response.status, body);
  if (body === null) throw new ApiError('SERVER', '서버 응답을 확인할 수 없습니다.', response.status);
  return body as T;
}

export const post = (payload?: unknown): RequestInit => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: payload === undefined ? undefined : JSON.stringify(payload),
});

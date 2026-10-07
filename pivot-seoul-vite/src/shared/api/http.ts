// Backend(Spring) API 클라이언트입니다. 모든 엔드포인트는 [확인 필요]이며 요청·응답 필드는 명세의 snake_case를 가정합니다.
import type {
  AiStatus, ErrorKind, FieldErrors, FormField, HousingInput, ModelEntry, PivotError,
  RunResult, RunStatus, RunSummary, Thresholds,
} from '../types/pivot';

// 환경변수가 없으면 현재 출처의 /api를 사용하며 끝의 슬래시는 제거합니다.
const base = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

// 서버가 camelCase 또는 snake_case 어느 쪽으로 오류 필드를 보내도 폼 필드로 연결합니다.
const FIELD_MAP: Record<string, FormField> = {
  life_stage: 'lifeStage', lifeStage: 'lifeStage', income: 'income', deposit: 'deposit',
  monthly_rent: 'monthlyRent', monthlyRent: 'monthlyRent',
};

// 오류 유형(kind)과 400 필드 오류를 함께 전달해 화면이 유형별로 다르게 안내할 수 있게 합니다.
export class ApiError extends Error {
  kind: ErrorKind;
  status: number;
  fields: FieldErrors;
  constructor(kind: ErrorKind, message: string, status = 0, fields: FieldErrors = {}) {
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
function parseFieldErrors(raw: unknown): FieldErrors {
  const fields: FieldErrors = {};
  const add = (name: unknown, message: unknown) => {
    const field = typeof name === 'string' ? FIELD_MAP[name] : undefined;
    if (field) fields[field] = typeof message === 'string' && message ? message : '입력값을 확인해주세요.';
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
async function request<T>(path: string, init?: RequestInit): Promise<T> {
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

const post = (payload?: unknown): RequestInit => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: payload === undefined ? undefined : JSON.stringify(payload),
});

// API-001 POST /api/sessions [확인 필요]: 생애단계·온보딩 입력으로 Session을 생성합니다. (BR-001)
export async function createSession(input: HousingInput): Promise<string> {
  const body = await request<{ session_uuid?: string }>('/api/sessions', post({
    life_stage: input.lifeStage, income: input.income, deposit: input.deposit, monthly_rent: input.monthlyRent,
  }));
  if (!body.session_uuid) throw new ApiError('SERVER', '응답에 세션 ID(session_uuid)가 없습니다.');
  return body.session_uuid;
}

// API-002 POST /api/sessions/{sessionUuid}/runs [확인 필요]: Run을 만들고 Rule 계산을 수행합니다. (BR-002, BR-004)
export async function createRun(sessionUuid: string): Promise<string> {
  const body = await request<{ run_id?: string | number }>(`/api/sessions/${encodeURIComponent(sessionUuid)}/runs`, post());
  if (body.run_id === undefined || body.run_id === null || String(body.run_id).length === 0) {
    throw new ApiError('SERVER', '응답에 실행 ID(run_id)가 없습니다.');
  }
  return String(body.run_id);
}

type RawResult = {
  run_id: string | number; status: RunStatus; rir?: number; is_red_zone?: boolean; thresholds?: Thresholds;
  risk_probability?: number; ai_status?: AiStatus; explanation?: string;
};

// API-003 GET /api/runs/{runId}/results [확인 필요]: Rule 결과·임계값·AI 결과를 조회합니다. (BR-003)
export async function fetchRunResult(runId: string, signal?: AbortSignal): Promise<RunResult> {
  const raw = await request<RawResult>(`/api/runs/${encodeURIComponent(runId)}/results`, { signal });
  return {
    runId: String(raw.run_id ?? runId), status: raw.status, rir: raw.rir, isRedZone: raw.is_red_zone,
    thresholds: raw.thresholds, riskProbability: raw.risk_probability, aiStatus: raw.ai_status, explanation: raw.explanation,
  };
}

type RawRun = { run_id: string | number; status: RunStatus; created_at?: string; rir?: number; is_red_zone?: boolean };

// API-004 GET /api/sessions/{sessionUuid}/runs [확인 필요]: 같은 세션의 실행 이력을 조회합니다. 배열 또는 { runs } 형태를 허용합니다.
export async function fetchRuns(sessionUuid: string, signal?: AbortSignal): Promise<RunSummary[]> {
  const body = await request<RawRun[] | { runs: RawRun[] }>(`/api/sessions/${encodeURIComponent(sessionUuid)}/runs`, { signal });
  const runs = Array.isArray(body) ? body : body.runs ?? [];
  return runs.map(run => ({ runId: String(run.run_id), status: run.status, createdAt: run.created_at, rir: run.rir, isRedZone: run.is_red_zone }));
}

type RawModel = { name: string; type?: 'ML' | 'DL'; metrics: Record<string, number>; is_champion?: boolean };

// API-009 GET /api/models/compare [확인 필요, 제안]: ML·DL 모델의 평가지표와 Champion 여부를 조회합니다. (BR-007)
export async function fetchModelCompare(signal?: AbortSignal): Promise<ModelEntry[]> {
  const body = await request<RawModel[] | { models: RawModel[] }>('/api/models/compare', { signal });
  const models = Array.isArray(body) ? body : body.models ?? [];
  return models.map(model => ({ name: model.name, type: model.type, metrics: model.metrics ?? {}, isChampion: model.is_champion === true }));
}

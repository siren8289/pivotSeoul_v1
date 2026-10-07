// Run 생성·결과·이력 API 클라이언트입니다. 요청·응답 필드는 명세의 snake_case를 가정합니다.
import { ApiError, post, request } from '../../../shared/api/http';
import { toAiResult } from '../../ai-result';
import type { RawAiResult } from '../../ai-result';
import type { RunResult, RunStatus, RunSummary, Thresholds } from '../types';

// API-002 POST /api/sessions/{sessionUuid}/runs [확인 필요]: Run을 만들고 Rule 계산을 수행합니다. (BR-002, BR-004)
export async function createRun(sessionUuid: string): Promise<string> {
  const body = await request<{ run_id?: string | number }>(`/api/sessions/${encodeURIComponent(sessionUuid)}/runs`, post());
  if (body.run_id === undefined || body.run_id === null || String(body.run_id).length === 0) {
    throw new ApiError('SERVER', '응답에 실행 ID(run_id)가 없습니다.');
  }
  return String(body.run_id);
}

type RawResult = RawAiResult & {
  run_id: string | number; status: RunStatus; rir?: number; is_red_zone?: boolean; thresholds?: Thresholds;
};

// API-003 GET /api/runs/{runId}/results [확인 필요]: Rule 결과·임계값·AI 결과를 조회합니다. (BR-003)
export async function fetchRunResult(runId: string, signal?: AbortSignal): Promise<RunResult> {
  const raw = await request<RawResult>(`/api/runs/${encodeURIComponent(runId)}/results`, { signal });
  return {
    runId: String(raw.run_id ?? runId), status: raw.status, rir: raw.rir, isRedZone: raw.is_red_zone,
    thresholds: raw.thresholds, ...toAiResult(raw),
  };
}

type RawRun = { run_id: string | number; status: RunStatus; created_at?: string; rir?: number; is_red_zone?: boolean };

// API-004 GET /api/sessions/{sessionUuid}/runs [확인 필요]: 같은 세션의 실행 이력을 조회합니다. 배열 또는 { runs } 형태를 허용합니다.
export async function fetchRuns(sessionUuid: string, signal?: AbortSignal): Promise<RunSummary[]> {
  const body = await request<RawRun[] | { runs: RawRun[] }>(`/api/sessions/${encodeURIComponent(sessionUuid)}/runs`, { signal });
  const runs = Array.isArray(body) ? body : body.runs ?? [];
  return runs.map(run => ({ runId: String(run.run_id), status: run.status, createdAt: run.created_at, rir: run.rir, isRedZone: run.is_red_zone }));
}

import { request } from '../../../shared/api/http';
import type { ModelEntry } from '../types';

type RawModel = { name: string; type?: 'ML' | 'DL'; metrics: Record<string, number>; is_champion?: boolean };

// API-009 GET /api/models/compare [확인 필요, 제안]: ML·DL 모델의 평가지표와 Champion 여부를 조회합니다. (BR-007)
export async function fetchModelCompare(signal?: AbortSignal): Promise<ModelEntry[]> {
  const body = await request<RawModel[] | { models: RawModel[] }>('/api/models/compare', { signal });
  const models = Array.isArray(body) ? body : body.models ?? [];
  return models.map(model => ({ name: model.name, type: model.type, metrics: model.metrics ?? {}, isChampion: model.is_champion === true }));
}

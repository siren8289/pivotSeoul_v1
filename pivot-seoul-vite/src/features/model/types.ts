// API-009: 평가지표는 모델마다 키가 같다고 가정하고 값만 비교합니다. (BR-007)
export type ModelEntry = { name: string; type?: 'ML' | 'DL'; metrics: Record<string, number>; isChampion: boolean };

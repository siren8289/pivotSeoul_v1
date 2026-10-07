// 화면·Context·API 클라이언트가 공유하는 타입입니다. 응답 필드 구조는 API 확정 전이라 [확인 필요]입니다.

// 입력 폼 값: 빈 값과 잘못된 형식을 구분하기 위해 금액도 문자열로 보관합니다.
export type HousingForm = { lifeStage: string; income: string; deposit: string; monthlyRent: string };
export type FormField = keyof HousingForm;
export type FieldErrors = Partial<Record<FormField, string>>;

// 검증을 통과해 API-001로 전송하는 값이며 금액은 모두 원 단위 숫자입니다.
export type HousingInput = { lifeStage: string; income: number; deposit: number; monthlyRent: number };

// Run(Rule 계산)과 AI(위험 확률·설명)는 상태를 따로 가지며 AI가 늦거나 실패해도 Rule 결과는 표시합니다. (BR-003)
export type RunStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
export type AiStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

// RIR이 danger 이상이면 Red Zone입니다. 값은 RIR과 같은 백분율 단위로 가정합니다.
export type Thresholds = { caution?: number; danger: number };

// API-003 응답: rir은 서버가 계산한 백분율, riskProbability는 0~1 확률로 가정합니다.
export type RunResult = {
  runId: string;
  status: RunStatus;
  rir?: number;
  isRedZone?: boolean;
  thresholds?: Thresholds;
  riskProbability?: number;
  aiStatus?: AiStatus;
  explanation?: string;
};

// API-004 실행 이력의 한 행입니다.
export type RunSummary = { runId: string; status: RunStatus; createdAt?: string; rir?: number; isRedZone?: boolean };

// API-009: 평가지표는 모델마다 키가 같다고 가정하고 값만 비교합니다. (BR-007)
export type ModelEntry = { name: string; type?: 'ML' | 'DL'; metrics: Record<string, number>; isChampion: boolean };

// 오류 유형별로 SimulationErrorCard의 안내 문구가 달라집니다. RUN_FAILED는 Run 자체가 실패한 경우입니다.
export type ErrorKind = 'VALIDATION' | 'NETWORK' | 'NOT_FOUND' | 'SERVER' | 'RUN_FAILED';
export type PivotError = { kind: ErrorKind; message: string };

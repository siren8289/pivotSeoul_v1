// 오류 유형별로 SimulationErrorCard의 안내 문구가 달라집니다. RUN_FAILED는 Run 자체가 실패한 경우입니다.
export type ErrorKind = 'VALIDATION' | 'NETWORK' | 'NOT_FOUND' | 'SERVER' | 'RUN_FAILED';
export type PivotError = { kind: ErrorKind; message: string };

// 표시용 포맷 함수입니다. 값이 없거나 유효하지 않으면 '미제공'으로 표시합니다.
const valid = (value?: number): value is number => typeof value === 'number' && Number.isFinite(value);

export const won = (value?: number) => valid(value) ? `${value.toLocaleString('ko-KR')}원` : '미제공';
// RIR은 서버의 백분율 수치(예: 28.5)이므로 곱하지 않고 % 기호만 붙입니다.
export const percent = (value?: number) => valid(value) ? `${value.toFixed(1)}%` : '미제공';
// 위험 확률은 0~1 값이므로 백분율로 환산합니다.
export const probability = (value?: number) => valid(value) ? `${(value * 100).toFixed(1)}%` : '미제공';
export const metric = (value?: number) => valid(value) ? value.toFixed(3) : '-';

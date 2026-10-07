// 입력 feature가 소유하는 타입입니다. 응답 필드 구조는 API 확정 전이라 [확인 필요]입니다.

// 입력 폼 값: 빈 값과 잘못된 형식을 구분하기 위해 금액도 문자열로 보관합니다.
export type HousingForm = { lifeStage: string; income: string; deposit: string; monthlyRent: string };
export type FormField = keyof HousingForm;
export type FieldErrors = Partial<Record<FormField, string>>;

// 검증을 통과해 API-001로 전송하는 값이며 금액은 모두 원 단위 숫자입니다.
export type HousingInput = { lifeStage: string; income: number; deposit: number; monthlyRent: number };

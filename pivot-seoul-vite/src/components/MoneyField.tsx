// 원 단위 금액 입력, 숫자 미리보기, 필드 오류 메시지를 표시합니다.
// 부모 컴포넌트에서 전달받는 값과 이벤트 함수의 타입입니다.
type Props = {
  id: string;
  label: string;
  hint: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

export default function MoneyField({ id, label, hint, placeholder, value, error, onChange }: Props) {
  return (
    <div className="field">
      <label htmlFor={id}>{label} <span className="required">필수</span></label>
      <p className="hint" id={`${id}-hint`}>{hint}</p>
      {/* 입력값은 문자열로 유지하며 검증과 상태 관리는 부모 페이지가 담당합니다. */}
      <div className="money-input">
        <input id={id} type="text" inputMode="numeric" required value={value} placeholder={placeholder}
          onChange={event => onChange(event.target.value)} aria-invalid={!!error}
          aria-describedby={`${id}-hint${error ? ` ${id}-error` : ''}`} />
        <span>원</span>
      </div>
      {/* 유효한 정수일 때만 천 단위 구분을 넣어 금액을 미리 보여줍니다. */}
      {value && /^\d+$/.test(value) && Number.isSafeInteger(Number(value)) && <p className="hint">{Number(value).toLocaleString('ko-KR')}원</p>}
      {/* aria-describedby로 입력 요소와 오류 문구를 연결합니다. */}
      {error && <p className="field-error" id={`${id}-error`}>{error}</p>}
    </div>
  );
}

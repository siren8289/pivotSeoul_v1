// SCR-002 생애단계 선택값과 검증 오류를 표시하는 입력 컴포넌트입니다.
import { lifeStages } from '../data/lifeStages';

// 부모 컴포넌트에서 전달받는 값과 이벤트 함수의 타입입니다.
type Props = { value: string; error?: string; onChange: (value: string) => void };

export default function LifeStageField({ value, error, onChange }: Props) {
  return (
    <>
      <label htmlFor="lifeStage">생애단계 <span className="required">필수</span></label>
      {/* 선택지는 data/lifeStages의 코드·라벨을 사용합니다. */}
      <select id="lifeStage" value={value} onChange={event => onChange(event.target.value)} required
        aria-invalid={!!error} aria-describedby={error ? 'lifeStage-error' : undefined}>
        <option value="">생애단계를 선택하세요</option>
        {lifeStages.map(stage => <option key={stage.value} value={stage.value}>{stage.label}</option>)}
      </select>
      {error && <p className="field-error" id="lifeStage-error">{error}</p>}
    </>
  );
}

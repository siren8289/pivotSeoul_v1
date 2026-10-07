// SCR-003 소득·보증금·월세를 입력받아 검증한 뒤 Session을 생성합니다. (API-001, BR-001)
import { Link, Navigate, useNavigate } from 'react-router-dom';
import type { FormEvent } from 'react';
import PageHeader from '../../../shared/components/PageHeader';
import SimulationErrorCard from '../../../shared/components/SimulationErrorCard';
import MoneyField from '../components/MoneyField';
import { lifeStageLabel } from '../data/lifeStages';
import { useInput } from '../hooks/useInput';

// 반복되는 금액 입력 필드의 라벨과 안내 문구를 정의합니다.
const fields = [{ key: 'income', label: '월소득', hint: '매달 받는 소득을 입력해주세요.', placeholder: '예: 3000000' }, { key: 'deposit', label: '보증금', hint: '계약 시 납부하는 보증금입니다.', placeholder: '예: 10000000' }, { key: 'monthlyRent', label: '월세', hint: '매달 납부하는 월세를 입력해주세요.', placeholder: '예: 700000' }] as const;
export default function OnboardingPage() {
  const navigate = useNavigate();
  // 입력값·필드 오류·요청 상태는 InputContext가 관리하며 화면은 이벤트만 전달합니다.
  const { form, fieldErrors: errors, sessionError, submitting: loading, setField, submitOnboarding } = useInput();
  // 생애단계가 없으면 SCR-002부터 진행하도록 되돌립니다.
  if (!form.lifeStage) return <Navigate to="/stage" replace />;

  // 폼 제출: 검증 → API-001 → 성공 시 Run 실행 화면으로 이동합니다.
  async function submit(event: FormEvent) {
    // 브라우저의 기본 폼 새로고침을 막습니다.
    event.preventDefault();
    if (await submitOnboarding()) navigate('/run');
  }
  return <main className="page narrow">
    <PageHeader backTo="/stage" backLabel="생애단계 변경" eyebrow="STEP 02 · 주거 조건"
      title={<>지금의 주거 조건을<br />알려주세요.</>}
      description="소득과 주거비를 바탕으로 주거 부담 수준을 진단합니다." />
    <form className="panel form" onSubmit={submit} noValidate aria-busy={loading}>
      {/* 요청 중에는 입력을 잠가 전송한 조건이 바뀌는 것을 방지합니다. */}
      <fieldset disabled={loading}>
        {/* 생애단계는 SCR-002에서 선택하며 여기서는 확인만 합니다. */}
        <p>생애단계: <strong>{lifeStageLabel(form.lifeStage)}</strong> <Link className="back" to="/stage">변경</Link></p>
        {fields.map(({ key, ...field }) => (
          <MoneyField key={key} id={key} {...field} value={form[key]} error={errors[key]}
            onChange={value => setField(key, value)} />
        ))}
      </fieldset>
      {/* 서버 오류는 유형별 안내 카드로 표시하며 필드 오류는 각 입력 아래에 표시됩니다. */}
      {sessionError && <SimulationErrorCard kind={sessionError.kind} message={sessionError.message} />}
      <button className="primary full" disabled={loading} type="submit">{loading ? '조건 저장 중…' : '다음 →'}</button><p className="hint center" role="status">{loading ? '저장이 완료되면 분석 실행 화면으로 이동합니다.' : '금액은 모두 원 단위로 입력해주세요.'}</p>
    </form>
  </main>;
}

// SCR-002 생애단계를 선택하고 PivotContext의 life_stage에 저장합니다. 서버 호출은 없습니다.
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import LifeStageField from '../components/LifeStageField';
import { usePivot } from '../context/usePivot';

export default function StageSelectionPage() {
  const navigate = useNavigate();
  const { form, setField } = usePivot();
  const [error, setError] = useState('');

  // 선택하지 않으면 다음 단계(온보딩)로 넘어가지 않습니다.
  function next(event: FormEvent) {
    event.preventDefault();
    if (!form.lifeStage) { setError('생애단계를 선택해주세요.'); return; }
    navigate('/onboarding');
  }

  return (
    <main className="page narrow">
      <PageHeader backTo="/" backLabel="홈으로" eyebrow="STEP 01 · 생애단계"
        title={<>지금 어떤 단계에<br />계신가요?</>}
        description="생애단계에 따라 적용되는 기준과 시나리오가 달라집니다." />
      <form className="panel form" onSubmit={next} noValidate>
        <LifeStageField value={form.lifeStage} error={error}
          onChange={value => { setField('lifeStage', value); setError(''); }} />
        <button className="primary full" type="submit">다음 →</button>
      </form>
    </main>
  );
}

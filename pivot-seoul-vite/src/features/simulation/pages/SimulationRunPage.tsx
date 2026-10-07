// SCR-004 Session으로 Run을 생성하고 Rule 계산이 끝나면 결과 화면으로 이동합니다. (API-002, BR-002, BR-004)
import { Link, Navigate, useNavigate } from 'react-router-dom';
import PageHeader from '../../../shared/components/PageHeader';
import LoadingState from '../../../shared/components/LoadingState';
import SimulationErrorCard from '../../../shared/components/SimulationErrorCard';
import { won } from '../../../shared/utils/format';
import { lifeStageLabel, useInput } from '../../input';
import RunButton from '../components/RunButton';
import { useSimulation } from '../hooks/useSimulation';

export default function SimulationRunPage() {
  const navigate = useNavigate();
  const { form, sessionUuid } = useInput();
  const { starting: running, runError, startRun } = useSimulation();
  // 세션이 없으면 Run을 만들 수 없으므로 입력 흐름의 처음으로 되돌립니다.
  if (!sessionUuid) return <Navigate to="/stage" replace />;

  // 성공 시에만 이동하며 실패하면 이 화면에서 오류 유형별로 안내합니다.
  async function run() {
    const runId = await startRun();
    if (runId) navigate(`/results/${encodeURIComponent(runId)}`);
  }

  return (
    <main className="page narrow">
      <PageHeader backTo="/onboarding" backLabel="조건 수정" eyebrow="STEP 03 · 분석 실행"
        title="분석을 실행할까요?" description="입력한 조건으로 RIR을 계산하고 위험 진단을 생성합니다." />
      <section className="panel">
        <h2>입력한 조건</h2>
        <dl className="summary">
          <dt>생애단계</dt><dd>{lifeStageLabel(form.lifeStage)}</dd>
          <dt>월소득</dt><dd>{won(Number(form.income))}</dd>
          <dt>보증금</dt><dd>{won(Number(form.deposit))}</dd>
          <dt>월세</dt><dd>{won(Number(form.monthlyRent))}</dd>
        </dl>
      </section>
      {running && <LoadingState title="주거 부담을 계산하고 있어요."><p>완료되면 결과 화면으로 이동합니다.</p></LoadingState>}
      {runError && !running && (
        <SimulationErrorCard kind={runError.kind} message={runError.message}
          actions={<Link className="secondary" to="/onboarding">조건 다시 입력</Link>} />
      )}
      <RunButton running={running} retry={!!runError} onClick={run} />
    </main>
  );
}

// SCR-005 Run 결과(API-003)와 실행 이력(API-004)을 보여줍니다. Rule 결과는 먼저, AI 결과는 준비되는 대로 갱신합니다. (BR-003)
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../../shared/components/PageHeader';
import StatusCard from '../../../shared/components/StatusCard';
import LoadingState from '../../../shared/components/LoadingState';
import SimulationErrorCard from '../../../shared/components/SimulationErrorCard';
import { AiProgressCard, RiskProbabilityCard } from '../../ai-result';
import GaugeChart from '../components/GaugeChart';
import RunHistoryList from '../components/RunHistoryList';
import { useRunHistory } from '../hooks/useRunHistory';
import { useRunResult } from '../hooks/useRunResult';
import { useSimulation } from '../hooks/useSimulation';
import { isRunActive } from '../utils/status';

export default function ResultsPage() {
  const params = useParams();
  const { runId: lastRunId } = useSimulation();
  // URL의 runId를 우선하므로 새로고침하거나 이력에서 이동해도 같은 실행을 조회합니다.
  const runId = params.runId ?? lastRunId;
  const { current, error: resultError, retry } = useRunResult(runId);
  const history = useRunHistory(runId);

  return (
    <main className="page">
      <PageHeader backTo="/run" backLabel="다시 실행" eyebrow="STEP 04 · 위험 진단"
        title="나의 주거 부담 분석" description="월소득 대비 임대료 비율과 위험 진단을 확인하세요." />
      {/* 실행 ID 없음 → 조회 오류 → 대기 → Run 실패 → 결과 순으로 분기합니다. */}
      {!runId ? (
        <StatusCard title="먼저 분석을 실행해주세요." actions={<Link className="primary" to="/stage">조건 입력하기</Link>} />
      ) : resultError ? (
        <SimulationErrorCard kind={resultError.kind} message={resultError.message}
          actions={<button onClick={retry}>다시 불러오기</button>} />
      ) : !current || isRunActive(current) ? (
        <LoadingState title="분석 결과를 불러오고 있어요."><p>결과가 준비되면 자동으로 표시됩니다.</p></LoadingState>
      ) : current.status === 'FAILED' ? (
        <SimulationErrorCard kind="RUN_FAILED"
          actions={<><button onClick={retry}>결과 다시 확인</button><Link className="primary" to="/run">새 분석 실행</Link></>} />
      ) : (
        <>
          <div className="result-grid">
            <GaugeChart rir={current.rir} thresholds={current.thresholds} isRedZone={current.isRedZone} />
            <RiskProbabilityCard riskProbability={current.riskProbability} aiStatus={current.aiStatus} />
          </div>
          <AiProgressCard aiStatus={current.aiStatus} explanation={current.explanation} />
          <div className="actions">
            <Link className="primary" to="/models">모델 비교 보기 →</Link>
            <Link className="secondary" to="/onboarding">조건 변경</Link>
          </div>
        </>
      )}
      {history.length > 1 && <RunHistoryList runs={history} currentRunId={runId} />}
    </main>
  );
}

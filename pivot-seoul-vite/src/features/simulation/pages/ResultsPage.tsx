// SCR-005 Run 결과(API-003)와 실행 이력(API-004)을 보여줍니다. Rule 결과는 먼저, AI 결과는 준비되는 대로 갱신합니다. (BR-003)
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import StatusCard from '../components/StatusCard';
import LoadingState from '../components/LoadingState';
import SimulationErrorCard from '../components/SimulationErrorCard';
import GaugeChart from '../components/GaugeChart';
import RiskProbabilityCard from '../components/RiskProbabilityCard';
import AiProgressCard from '../components/AiProgressCard';
import RiskBadge from '../components/RiskBadge';
import { usePivot } from '../context/usePivot';
import { percent } from '../utils/format';
import { isAiActive, isRunActive } from '../utils/status';

const POLL_MS = 3000;

export default function ResultsPage() {
  const params = useParams();
  const { runId: lastRunId, result, resultError, history, loadResult, loadHistory } = usePivot();
  // URL의 runId를 우선하므로 새로고침하거나 이력에서 이동해도 같은 실행을 조회합니다.
  const runId = params.runId ?? lastRunId;
  const [attempt, setAttempt] = useState(0);
  // Context에 남아 있는 이전 실행의 결과가 잠깐 보이지 않도록 runId가 일치할 때만 사용합니다.
  const current = result && result.runId === runId ? result : null;

  // Rule 또는 AI가 진행 중이면 3초마다 다시 조회하고, 완료·실패·오류 시 멈춥니다. attempt는 재시도용입니다.
  useEffect(() => {
    if (!runId) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      const data = await loadResult(runId!, controller.signal);
      if (data && (isRunActive(data) || isAiActive(data))) timer = setTimeout(poll, POLL_MS);
    }
    void poll();
    // 페이지를 떠나거나 재조회할 때 진행 중인 요청과 예약된 조회를 취소합니다.
    return () => { controller.abort(); clearTimeout(timer); };
  }, [runId, attempt, loadResult]);

  // 새 Run이 생기면 이력을 다시 가져옵니다.
  useEffect(() => {
    const controller = new AbortController();
    void loadHistory(controller.signal);
    return () => controller.abort();
  }, [runId, loadHistory]);

  return (
    <main className="page">
      <PageHeader backTo="/run" backLabel="다시 실행" eyebrow="STEP 04 · 위험 진단"
        title="나의 주거 부담 분석" description="월소득 대비 임대료 비율과 위험 진단을 확인하세요." />
      {/* 실행 ID 없음 → 조회 오류 → 대기 → Run 실패 → 결과 순으로 분기합니다. */}
      {!runId ? (
        <StatusCard title="먼저 분석을 실행해주세요." actions={<Link className="primary" to="/stage">조건 입력하기</Link>} />
      ) : resultError ? (
        <SimulationErrorCard kind={resultError.kind} message={resultError.message}
          actions={<button onClick={() => setAttempt(value => value + 1)}>다시 불러오기</button>} />
      ) : !current || isRunActive(current) ? (
        <LoadingState title="분석 결과를 불러오고 있어요."><p>결과가 준비되면 자동으로 표시됩니다.</p></LoadingState>
      ) : current.status === 'FAILED' ? (
        <SimulationErrorCard kind="RUN_FAILED"
          actions={<><button onClick={() => setAttempt(value => value + 1)}>결과 다시 확인</button><Link className="primary" to="/run">새 분석 실행</Link></>} />
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
      {history.length > 1 && (
        <section className="panel">
          <h2>실행 이력</h2>
          <ul className="history">
            {history.map(run => (
              <li key={run.runId}>
                <Link to={`/results/${encodeURIComponent(run.runId)}`} aria-current={run.runId === runId ? 'page' : undefined}>
                  {run.createdAt ? new Date(run.createdAt).toLocaleString('ko-KR') : `Run ${run.runId}`}
                </Link>
                <span>{percent(run.rir)}</span>
                <RiskBadge redZone={run.isRedZone} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

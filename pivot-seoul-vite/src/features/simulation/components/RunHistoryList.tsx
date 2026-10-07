// SCR-005 같은 Session의 실행 이력(API-004)입니다. 항목을 누르면 해당 Run의 결과로 이동합니다.
import { Link } from 'react-router-dom';
import { percent } from '../../../shared/utils/format';
import type { RunSummary } from '../types';
import RiskBadge from './RiskBadge';

type Props = { runs: RunSummary[]; currentRunId: string | null };

export default function RunHistoryList({ runs, currentRunId }: Props) {
  return (
    <section className="panel">
      <h2>실행 이력</h2>
      <ul className="history">
        {runs.map(run => (
          <li key={run.runId}>
            <Link to={`/results/${encodeURIComponent(run.runId)}`} aria-current={run.runId === currentRunId ? 'page' : undefined}>
              {run.createdAt ? new Date(run.createdAt).toLocaleString('ko-KR') : `Run ${run.runId}`}
            </Link>
            <span>{percent(run.rir)}</span>
            <RiskBadge redZone={run.isRedZone} />
          </li>
        ))}
      </ul>
    </section>
  );
}

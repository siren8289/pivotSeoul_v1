// SCR-006 ML·DL 모델 비교와 Champion Model을 보여줍니다. (API-009, BR-007)
import { Link } from 'react-router-dom';
import PageHeader from '../../../shared/components/PageHeader';
import StatusCard from '../../../shared/components/StatusCard';
import LoadingState from '../../../shared/components/LoadingState';
import SimulationErrorCard from '../../../shared/components/SimulationErrorCard';
import ModelCompareTable from '../components/ModelCompareTable';
import { useModelCompare } from '../hooks/useModelCompare';

export default function ModelComparePage() {
  const { models, error, retry } = useModelCompare();

  return (
    <main className="page">
      <PageHeader backTo="/" backLabel="홈으로" eyebrow="MODEL · 성능 비교"
        title="모델 성능 비교" description="ML·DL 모델의 평가지표를 비교하고 Champion Model을 확인하세요." />
      {/* 조회 오류 → 로딩 → 빈 목록 → 테이블 순으로 분기합니다. */}
      {error ? (
        <SimulationErrorCard kind={error.kind} message={error.message}
          actions={<button onClick={retry}>다시 불러오기</button>} />
      ) : !models ? (
        <LoadingState title="모델 비교 정보를 불러오고 있어요." />
      ) : models.length === 0 ? (
        <StatusCard title="비교할 모델이 아직 없습니다." actions={<Link className="secondary" to="/">홈으로</Link>} />
      ) : (
        <ModelCompareTable models={models} />
      )}
    </main>
  );
}

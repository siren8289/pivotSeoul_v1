// SCR-006 ML·DL 모델 비교와 Champion Model을 보여줍니다. (API-009, BR-007)
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import StatusCard from '../components/StatusCard';
import LoadingState from '../components/LoadingState';
import SimulationErrorCard from '../components/SimulationErrorCard';
import ModelCompareTable from '../components/ModelCompareTable';
import { usePivot } from '../context/usePivot';

export default function ModelComparePage() {
  const { models, modelsError, loadModels } = usePivot();
  // 재시도 횟수가 바뀌면 effect가 다시 실행되어 비교 데이터를 새로 조회합니다.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    void loadModels(controller.signal);
    return () => controller.abort();
  }, [attempt, loadModels]);

  return (
    <main className="page">
      <PageHeader backTo="/" backLabel="홈으로" eyebrow="MODEL · 성능 비교"
        title="모델 성능 비교" description="ML·DL 모델의 평가지표를 비교하고 Champion Model을 확인하세요." />
      {/* 조회 오류 → 로딩 → 빈 목록 → 테이블 순으로 분기합니다. */}
      {modelsError ? (
        <SimulationErrorCard kind={modelsError.kind} message={modelsError.message}
          actions={<button onClick={() => setAttempt(value => value + 1)}>다시 불러오기</button>} />
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

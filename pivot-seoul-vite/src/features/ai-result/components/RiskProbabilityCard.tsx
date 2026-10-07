// SCR-005 AI(Champion Model)가 예측한 위험 확률을 ai_status에 맞춰 표시합니다. (AI-002, AI-003)
import type { AiStatus } from '../types';
import { probability } from '../../../shared/utils/format';

type Props = { riskProbability?: number; aiStatus?: AiStatus };

export default function RiskProbabilityCard({ riskProbability, aiStatus }: Props) {
  // 확률이 있어도 완료 상태가 아니면 신뢰할 수 없으므로 상태별 안내를 우선합니다.
  const ready = aiStatus === 'COMPLETED' && typeof riskProbability === 'number';
  return (
    <section className="panel">
      <p className="eyebrow">AI 예측</p>
      <h2>위험 확률</h2>
      {ready ? (
        <div className="big-score">{probability(riskProbability)}</div>
      ) : (
        <p className="hint">
          {aiStatus === 'PENDING' || aiStatus === 'RUNNING' ? '위험 확률을 계산하고 있어요.'
            : aiStatus === 'FAILED' ? '위험 확률을 계산하지 못했습니다. RIR 진단 결과는 정상입니다.'
            : '위험 확률이 제공되지 않았습니다.'}
        </p>
      )}
    </section>
  );
}

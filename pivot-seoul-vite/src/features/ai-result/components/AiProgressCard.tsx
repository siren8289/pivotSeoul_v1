// SCR-005 LLM 설명(AI-001)의 생성 진행 상태와 결과를 보여줍니다. AI가 늦거나 실패해도 Rule 결과 화면은 유지됩니다.
import type { AiStatus } from '../types/pivot';

type Props = { aiStatus?: AiStatus; explanation?: string };

export default function AiProgressCard({ aiStatus, explanation }: Props) {
  const active = aiStatus === 'PENDING' || aiStatus === 'RUNNING';
  return (
    <section className="panel" role="status">
      <h2>AI 판단 설명</h2>
      {/* value 없는 progress는 진행률을 알 수 없는 상태를 나타냅니다. */}
      {active && <><progress aria-label="AI 설명 생성 중" /><p className="hint">설명이 준비되면 자동으로 표시됩니다.</p></>}
      {aiStatus === 'FAILED' && <p className="hint">AI 설명을 생성하지 못했습니다. RIR 진단 결과는 정상입니다.</p>}
      {aiStatus === 'COMPLETED' && (explanation ? <p>{explanation}</p> : <p className="hint">제공된 설명이 없습니다.</p>)}
      {!aiStatus && <p className="hint">AI 설명이 제공되지 않았습니다.</p>}
    </section>
  );
}

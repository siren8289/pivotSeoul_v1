// 서버의 위험 판정 값에 따라 배지의 색상과 문구를 결정합니다.
// 부모 컴포넌트에서 전달받는 값과 이벤트 함수의 타입입니다.
type Props = { redZone?: boolean; unknownLabel?: string; dangerLabel?: string };

export default function RiskBadge({ redZone, unknownLabel = '미제공', dangerLabel = 'Red Zone' }: Props) {
  // undefined는 판정 미제공이므로 안전 상태(false)와 구분합니다.
  const tone = redZone === true ? 'red' : redZone === false ? 'green' : '';
  return <span className={`badge ${tone}`}>{redZone === true ? dangerLabel : redZone === false ? '위험 구간 아님' : unknownLabel}</span>;
}

// SCR-004 Run 실행 버튼입니다. 실행 중에는 비활성화해 같은 세션에서 Run이 중복 생성되는 것을 막습니다.
type Props = { running: boolean; retry?: boolean; onClick: () => void };

export default function RunButton({ running, retry = false, onClick }: Props) {
  return (
    <button className="primary full" type="button" disabled={running} onClick={onClick}>
      {running ? '분석 실행 중…' : retry ? '다시 실행하기' : '분석 실행하기 →'}
    </button>
  );
}

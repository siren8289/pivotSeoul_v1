// SCR-001 서비스 이용 흐름을 안내하고 생애단계 선택 화면으로 연결합니다.
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

// 홈 화면에 표시할 이용 단계입니다. 각 항목은 단계 번호, 제목, 설명입니다.
const steps = [
  ['01', '조건 입력', '생애단계, 소득, 보증금과 월세'],
  ['02', '위험 진단', 'RIR 스코어, Red Zone, AI 위험 확률 확인'],
  ['03', '모델 비교', 'ML·DL 모델 성능과 Champion 확인'],
];

export default function HomePage() {
  return (
    <main className="page home">
      {/* 공통 헤더에 홈 화면 제목과 서비스 설명을 전달합니다. */}
      <PageHeader eyebrow="PIVOT SEOUL · 주거 시뮬레이션"
        title={<>서울에서의 생활,<br />내 조건으로 살펴보세요.</>}
        description={<>주거비 부담을 진단하고 조건별 시나리오를 비교해<br />다음 선택을 준비하세요.</>} />
      {/* Link를 사용하면 페이지 전체를 새로고침하지 않고 생애단계 선택 화면으로 이동합니다. */}
      <Link className="primary" to="/stage">내 주거 조건 입력하기 →</Link>
      {/* 단계 배열을 순회하여 동일한 모양의 안내 카드를 생성합니다. */}
      <div className="home-grid">
        {steps.map(([step, title, description]) => (
          <section className="panel" key={step}>
            <p className="eyebrow">{step}</p>
            <h2>{title}</h2>
            <p>{description}</p>
          </section>
        ))}
      </div>
    </main>
  );
}

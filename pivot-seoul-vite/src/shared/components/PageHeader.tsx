// 각 페이지에서 사용하는 제목, 설명, 뒤로가기 링크를 공통으로 표시합니다.
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

// 부모 컴포넌트에서 전달받는 값과 이벤트 함수의 타입입니다.
type Props = {
  backTo?: string;
  backLabel?: string;
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
};

export default function PageHeader({ backTo, backLabel, eyebrow, title, description }: Props) {
  return (
    <>
      {/* 뒤로가기 경로가 전달된 페이지에서만 링크를 표시합니다. */}
      {backTo && <Link className="back" to={backTo}>← {backLabel}</Link>}
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="intro">{description}</p>
    </>
  );
}

// 로딩, 오류, 빈 결과 등의 안내를 같은 카드 구조로 표시합니다.
import type { ReactNode } from 'react';

// 부모 컴포넌트에서 전달받는 값과 이벤트 함수의 타입입니다.
type Props = {
  title?: string;
  children?: ReactNode;
  actions?: ReactNode;
  status?: string;
  tone?: 'default' | 'danger';
  role?: 'alert' | 'status';
};

export default function StatusCard({ title, children, actions, status, tone = 'default', role }: Props) {
  return (
    <div className={tone === 'danger' ? 'notice danger' : 'panel'} role={role}>
      {/* 상태 코드와 제목은 필요한 경우에만 전달합니다. */}
      {status && <span className="badge">{status}</span>}
      {title && <h2>{title}</h2>}
      {children}
      {/* 재시도 버튼이나 이동 링크는 부모 페이지에서 전달합니다. */}
      {actions && <div className="actions">{actions}</div>}
    </div>
  );
}

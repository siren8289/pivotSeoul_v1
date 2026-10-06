// 요청 대기 중임을 스크린리더에도 알리는 로딩 카드입니다.
import type { ReactNode } from 'react';
import StatusCard from './StatusCard';

export default function LoadingState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <StatusCard role="status" title={title}>
      <div className="spinner" aria-hidden="true" />
      {children}
    </StatusCard>
  );
}

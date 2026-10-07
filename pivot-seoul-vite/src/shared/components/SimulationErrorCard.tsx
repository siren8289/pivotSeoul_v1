// SCR-004 오류 유형(ErrorKind)별 제목과 안내 문구를 보여주는 오류 카드입니다. 재시도·이동 버튼은 부모가 actions로 전달합니다.
import type { ReactNode } from 'react';
import type { ErrorKind } from '../types/error';
import StatusCard from './StatusCard';

const copy: Record<ErrorKind, { title: string; hint: string }> = {
  VALIDATION: { title: '입력값을 확인해주세요.', hint: '서버가 일부 입력을 받아들이지 않았습니다. 조건을 수정한 뒤 다시 시도해주세요.' },
  NETWORK: { title: '서버에 연결하지 못했습니다.', hint: '네트워크 상태를 확인한 뒤 다시 시도해주세요.' },
  NOT_FOUND: { title: '요청한 정보를 찾을 수 없습니다.', hint: '세션이 만료되었을 수 있습니다. 조건을 다시 입력해주세요.' },
  SERVER: { title: '서버에서 오류가 발생했습니다.', hint: '잠시 후 다시 시도해주세요.' },
  RUN_FAILED: { title: '분석을 완료하지 못했습니다.', hint: '분석 엔진의 응답 지연 또는 장애가 발생했습니다. 다시 확인하거나 새 분석을 요청해주세요.' },
};

type Props = { kind: ErrorKind; message?: string; actions?: ReactNode };

export default function SimulationErrorCard({ kind, message, actions }: Props) {
  return (
    <StatusCard tone="danger" role="alert" title={copy[kind].title} actions={actions}>
      {message && <p>{message}</p>}
      <p className="hint">{copy[kind].hint}</p>
    </StatusCard>
  );
}

// SCR-005 RIR을 반원 게이지로 표시합니다. rir·is_red_zone·thresholds는 모두 서버 값이며 Red Zone 판정은 재계산하지 않습니다.
import type { Thresholds } from '../types';
import { percent } from '../../../shared/utils/format';
import RiskBadge from './RiskBadge';

type Props = { rir?: number; thresholds?: Thresholds; isRedZone?: boolean };

// 게이지 눈금은 0~100%이며 반원 호의 좌측이 0%, 우측이 100%입니다.
const SCALE_MAX = 100;
const ARC_PATH = 'M 20 100 A 80 80 0 0 1 180 100';
const clamp = (value: number) => Math.min(Math.max(value / SCALE_MAX, 0), 1);

// 임계값 위치에 호를 가로지르는 눈금선 좌표를 계산합니다.
function tick(value: number) {
  const angle = Math.PI * (1 - clamp(value));
  const point = (radius: number) => ({ x: 100 + radius * Math.cos(angle), y: 100 - radius * Math.sin(angle) });
  return { inner: point(70), outer: point(90) };
}

export default function GaugeChart({ rir, thresholds, isRedZone }: Props) {
  const ratio = typeof rir === 'number' && Number.isFinite(rir) ? clamp(rir) : 0;
  const mark = thresholds ? tick(thresholds.danger) : null;
  return (
    <section className={`panel ${isRedZone === true ? 'risk' : ''}`}>
      <p className="eyebrow">임대료 / 월소득</p>
      <h2>RIR 스코어</h2>
      <svg className="gauge" viewBox="0 0 200 120" role="img" aria-label={`RIR ${percent(rir)}`}>
        <path className="gauge-track" d={ARC_PATH} pathLength={1} />
        {/* pathLength=1로 정규화해 채움 비율을 그대로 dash 길이로 사용합니다. */}
        <path className={`gauge-fill ${isRedZone === true ? 'red' : ''}`} d={ARC_PATH} pathLength={1} strokeDasharray={`${ratio} 1`} />
        {mark && <line className="gauge-tick" x1={mark.inner.x} y1={mark.inner.y} x2={mark.outer.x} y2={mark.outer.y} />}
        <text className="gauge-value" x="100" y="96" textAnchor="middle">{percent(rir)}</text>
      </svg>
      <RiskBadge redZone={isRedZone} dangerLabel="RED ZONE" unknownLabel="판정 대기" />
      <p className="hint">
        {thresholds
          ? `위험 임계값 ${percent(thresholds.danger)}${thresholds.caution !== undefined ? ` · 주의 ${percent(thresholds.caution)}` : ''}`
          : '임계값 정보가 제공되지 않았습니다.'}
      </p>
    </section>
  );
}

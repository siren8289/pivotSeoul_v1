// SCR-006 ML·DL 모델을 평가지표별로 비교하는 테이블입니다. (API-009)
import type { ModelEntry } from '../types/pivot';
import { metric } from '../utils/format';
import ChampionBadge from './ChampionBadge';

export default function ModelCompareTable({ models }: { models: ModelEntry[] }) {
  // 지표 열은 모든 모델의 키를 처음 등장한 순서대로 합쳐 만들며 없는 값은 '-'로 표시합니다.
  const metricKeys = [...new Set(models.flatMap(model => Object.keys(model.metrics)))];
  return (
    <div className="panel table-panel">
      <div className="table-scroll">
        <table>
          <caption>ML·DL 모델 성능 비교</caption>
          <thead><tr>
            <th scope="col">모델</th>
            {metricKeys.map(key => <th scope="col" key={key}>{key}</th>)}
          </tr></thead>
          <tbody>{models.map(model => (
            <tr key={model.name} className={model.isChampion ? 'champion-row' : undefined}>
              <th scope="row">{model.name} {model.type && <span className="hint">{model.type}</span>} {model.isChampion && <ChampionBadge />}</th>
              {metricKeys.map(key => <td className="metric" key={key}>{metric(model.metrics[key])}</td>)}
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

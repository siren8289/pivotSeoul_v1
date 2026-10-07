import { useContext } from 'react';
import { SimulationContext } from '../context/SimulationContext';

export function useSimulation() {
  const value = useContext(SimulationContext);
  if (!value) throw new Error('useSimulation은 SimulationProvider 안에서만 사용할 수 있습니다.');
  return value;
}

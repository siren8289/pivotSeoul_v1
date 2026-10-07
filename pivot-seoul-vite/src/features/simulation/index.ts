// simulation feature의 공개 API입니다. 의존 방향은 simulation → input, ai-result 한쪽뿐입니다.
export { default as SimulationRunPage } from './pages/SimulationRunPage';
export { default as ResultsPage } from './pages/ResultsPage';
export { SimulationProvider } from './context/SimulationProvider';

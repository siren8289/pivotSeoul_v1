// 전역 Provider를 적용하고 routes.tsx의 경로를 렌더링합니다.
import { useRoutes } from 'react-router-dom';
import AppProviders from './providers/AppProviders';
import { routes } from './routes';

function App() {
  const element = useRoutes(routes);
  return <AppProviders>{element}</AppProviders>;
}

export default App;

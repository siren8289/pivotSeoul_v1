// 전역 상태(테마·Pivot)를 제공하고 routes.tsx의 경로를 렌더링합니다.
import { useRoutes } from 'react-router-dom';
import { PivotProvider } from './context/PivotContext';
import { ThemeProvider } from './context/ThemeContext';
import { routes } from './routes';

function App() {
  const element = useRoutes(routes);
  return (
    <ThemeProvider>
      <PivotProvider>{element}</PivotProvider>
    </ThemeProvider>
  );
}

export default App;
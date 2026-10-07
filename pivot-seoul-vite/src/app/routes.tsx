// 페이지 경로 정의입니다. 모든 페이지는 Layout 안에서 렌더링됩니다.
import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import Layout from './Layout';
import HomePage from './pages/HomePage';
import { OnboardingPage, StageSelectionPage } from '../features/input';
import { ResultsPage, SimulationRunPage } from '../features/simulation';
import { ModelComparePage } from '../features/model';

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/stage', element: <StageSelectionPage /> },
      { path: '/onboarding', element: <OnboardingPage /> },
      { path: '/run', element: <SimulationRunPage /> },
      // runId는 선택값이며 없으면 가장 최근 실행을 조회합니다.
      { path: '/results/:runId?', element: <ResultsPage /> },
      { path: '/models', element: <ModelComparePage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
];

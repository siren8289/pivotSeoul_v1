// Provider 중첩 순서가 곧 의존 방향입니다. SimulationProvider는 InputProvider의 Session을 읽으므로 안쪽에 둡니다.
import type { ReactNode } from 'react';
import { InputProvider } from '../../features/input';
import { ModelProvider } from '../../features/model';
import { SimulationProvider } from '../../features/simulation';
import { ThemeProvider } from './ThemeProvider';

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <InputProvider>
        <SimulationProvider>
          <ModelProvider>{children}</ModelProvider>
        </SimulationProvider>
      </InputProvider>
    </ThemeProvider>
  );
}

import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ThemeContext } from './useTheme';
import type { Theme } from './useTheme';

const THEME_KEY = 'pivot.theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light');
  // CSS가 [data-theme] 선택자로 색상을 바꾸므로 html 요소에 반영하고 선택을 저장합니다.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);
  const toggle = useCallback(() => setTheme(current => current === 'dark' ? 'light' : 'dark'), []);
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

import { createContext, useContext } from 'react';

export type Theme = 'light' | 'dark';
export type ThemeContextValue = { theme: Theme; toggle: () => void };

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme은 ThemeProvider 안에서만 사용할 수 있습니다.');
  return value;
}

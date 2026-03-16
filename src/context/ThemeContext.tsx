import { createContext } from 'preact';
import { useCallback, useContext, useEffect, useState } from 'preact/hooks';

const THEME_KEY = 'portfolio-theme';

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme | ((prev: Theme) => Theme)) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({ theme: 'light', setTheme: () => {}, toggleTheme: () => {} });

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

interface ThemeProviderProps {
  children: preact.ComponentChildren;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    return window.localStorage.getItem(THEME_KEY) as Theme || 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((next: Theme | ((prev: Theme) => Theme)) => {
    setThemeState((prev) => (typeof next === 'function' ? next(prev) : next));
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

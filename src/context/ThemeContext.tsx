import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setDefaultTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getSavedTheme = (): Theme | null => {
  try {
    const value = localStorage.getItem('rohanos-theme');
    return value === 'light' || value === 'dark' || value === 'system' ? value : null;
  } catch {
    return null;
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    return getSavedTheme() || 'system';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const savedTheme = getSavedTheme();
    if (savedTheme === 'dark') return true;
    if (savedTheme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    const systemQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const activeIsDark = theme === 'dark' || (theme === 'system' && systemQuery.matches);

      setIsDark(activeIsDark);
      if (activeIsDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setIsDark(e.matches);
        if (e.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    // Modern and legacy event listener support
    if (systemQuery.addEventListener) {
      systemQuery.addEventListener('change', handleSystemChange);
    } else if (systemQuery.addListener) {
      systemQuery.addListener(handleSystemChange);
    }

    return () => {
      if (systemQuery.removeEventListener) {
        systemQuery.removeEventListener('change', handleSystemChange);
      } else if (systemQuery.removeListener) {
        systemQuery.removeListener(handleSystemChange);
      }
    };
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    try { localStorage.setItem('rohanos-theme', newTheme); } catch { /* In-memory preference still works. */ }
    setThemeState(newTheme);
  }, []);
  const setDefaultTheme = useCallback((newTheme: Theme) => {
    if (!getSavedTheme()) setThemeState(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, setDefaultTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

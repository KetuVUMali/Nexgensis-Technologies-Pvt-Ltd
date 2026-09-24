import { createContext, useContext, useEffect, useState } from 'react';

// Light / dark theme. Bootstrap 5.3 has built-in dark mode: when <html> has
// data-bs-theme="dark", all Bootstrap components switch colours by themselves.

const ThemeContext = createContext(null);

function getSavedTheme() {
  try {
    return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'; // default is light
  } catch {
    return 'light';
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getSavedTheme);

  // Whenever the theme changes: update <html> and remember the choice.
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

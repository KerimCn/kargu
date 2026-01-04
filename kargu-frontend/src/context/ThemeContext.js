import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('theme', theme);
    
    // Apply theme to document root
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update CSS variables based on theme
    if (theme === 'light') {
      document.documentElement.style.setProperty('--bg-primary', '#FFFFFF');
      document.documentElement.style.setProperty('--bg-secondary', '#F5F7FA');
      document.documentElement.style.setProperty('--bg-tertiary', '#E8ECF1');
      document.documentElement.style.setProperty('--bg-sidebar', '#F8F9FA');
      document.documentElement.style.setProperty('--bg-header', '#FFFFFF');
      document.documentElement.style.setProperty('--text-primary', '#1A1F2E');
      document.documentElement.style.setProperty('--text-secondary', '#2D3748');
      document.documentElement.style.setProperty('--text-tertiary', '#1A1F2E');
      document.documentElement.style.setProperty('--border-color', '#E2E8F0');
      document.documentElement.style.setProperty('--border-hover', '#CBD5E0');
      document.documentElement.style.setProperty('--shadow', '0 2px 8px rgba(0, 0, 0, 0.08)');
      document.documentElement.style.setProperty('--shadow-lg', '0 8px 24px rgba(0, 0, 0, 0.12)');
    } else {
      document.documentElement.style.setProperty('--bg-primary', '#0F1115');
      document.documentElement.style.setProperty('--bg-secondary', '#1E2229');
      document.documentElement.style.setProperty('--bg-tertiary', '#2A2F38');
      document.documentElement.style.setProperty('--bg-sidebar', '#1E2229');
      document.documentElement.style.setProperty('--bg-header', '#0F1115');
      document.documentElement.style.setProperty('--text-primary', '#E0E6ED');
      document.documentElement.style.setProperty('--text-secondary', '#B8BCC4');
      document.documentElement.style.setProperty('--text-tertiary', '#8B8E94');
      document.documentElement.style.setProperty('--border-color', '#2A2F38');
      document.documentElement.style.setProperty('--border-hover', '#3A3F48');
      document.documentElement.style.setProperty('--shadow', '0 2px 8px rgba(0, 0, 0, 0.3)');
      document.documentElement.style.setProperty('--shadow-lg', '0 8px 24px rgba(0, 0, 0, 0.4)');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};


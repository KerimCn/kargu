import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    // Always set dark theme
    document.documentElement.setAttribute('data-theme', 'dark');
    
    // Set dark mode CSS variables
    document.documentElement.style.setProperty('--bg-primary', '#0F1115');
    document.documentElement.style.setProperty('--bg-secondary', '#1E2229');
    document.documentElement.style.setProperty('--bg-tertiary', '#2A2F38');
    document.documentElement.style.setProperty('--bg-sidebar', '#1E2229');
    document.documentElement.style.setProperty('--bg-header', '#0F1115');
    document.documentElement.style.setProperty('--text-primary', '#E0E6ED');
    document.documentElement.style.setProperty('--text-secondary', '#B8BCC4');
    document.documentElement.style.setProperty('--text-tertiary', '#8B8E94');
    document.documentElement.style.setProperty('--text-muted', '#9CA3AF');
    document.documentElement.style.setProperty('--text-dim', '#6B7280');
    document.documentElement.style.setProperty('--border-color', '#2A2F38');
    document.documentElement.style.setProperty('--border-hover', '#3A3F48');
    document.documentElement.style.setProperty('--border-active', '#4A4F58');
    document.documentElement.style.setProperty('--shadow', '0 2px 8px rgba(0, 0, 0, 0.3)');
    document.documentElement.style.setProperty('--shadow-lg', '0 8px 24px rgba(0, 0, 0, 0.4)');
    document.documentElement.style.setProperty('--shadow-card', '0 2px 8px rgba(0, 0, 0, 0.25)');
    document.documentElement.style.setProperty('--hover-bg', '#2A2F38');
    document.documentElement.style.setProperty('--active-bg', '#3A3F48');
  }, []);

  const value = {
    theme: 'dark',
    isDark: true,
    isLight: false
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};


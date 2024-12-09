import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const getInitialTheme = () => {
  try {
    // Essayer d'abord de récupérer le thème sauvegardé
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }

    // Vérifier la préférence système si disponible
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      return mediaQuery?.matches ?? false;
    }
  } catch (error) {
    console.warn('Error reading theme preference:', error);
  }

  // Valeur par défaut
  return false;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

  useEffect(() => {
    try {
      document.documentElement.setAttribute(
        'data-theme',
        isDarkMode ? 'dark' : 'light'
      );
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    } catch (error) {
      console.warn('Error setting theme:', error);
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

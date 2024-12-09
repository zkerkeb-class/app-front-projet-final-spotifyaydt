import React from 'react';
import './App.css';
import './styles/theme.css';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Home from './pages/Home/Home';

// Composant pour le bouton de changement de thème
const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: 'var(--accent-color)',
        color: 'white',
        zIndex: 1000,
      }}
    >
      {isDarkMode ? '☀️ Mode Clair' : '🌙 Mode Sombre'}
    </button>
  );
};

// Composant principal de l'application
const AppContent = () => {
  return (
    <div className="App">
      <ThemeToggle />
      <Home />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

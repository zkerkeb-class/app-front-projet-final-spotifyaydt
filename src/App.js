import React from 'react';
import './App.css';
import './styles/theme.css';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Home from './pages/Home/Home';

// Composant pour la barre latérale
const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <h1>Spotify AYDT</h1>
      </div>
      <nav>
        <ul>
          <li className="active">
            <span>🏠</span> Accueil
          </li>
          <li>
            <span>🔍</span> Rechercher
          </li>
          <li>
            <span>📚</span> Bibliothèque
          </li>
        </ul>
      </nav>
    </div>
  );
};

// Composant pour la barre supérieure
const Topbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <div className="topbar">
      <div className="navigation-buttons">
        <button className="nav-button">◀</button>
        <button className="nav-button">▶</button>
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Que souhaitez-vous écouter ?" />
      </div>
      <div className="user-controls">
        <button onClick={toggleTheme} className="theme-toggle">
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        <button className="user-button">👤</button>
      </div>
    </div>
  );
};

// Composant principal de l'application
const AppContent = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="content-wrapper">
          <Home />
        </div>
      </div>
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

import React from 'react';
import './App.css';
import './styles/theme.css';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Home from './pages/Home/Home';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/SideBar/SideBar';

// Composant principal de l'application
const AppContent = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <Sidebar />
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

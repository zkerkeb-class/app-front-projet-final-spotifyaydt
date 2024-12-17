import React from 'react';
import './App.css';
import './styles/theme.scss';
import { ThemeProvider } from './contexts/ThemeContext';
import Home from './pages/Home/Home';
import Navbar from './components/Navbar/Navbar';
import SidebarLeft from './components/SideBarLeft/SideBar';
import SideBarRight from './components/SideBarRight/SideBar';

// Composant principal de l'application
const AppContent = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <SidebarLeft />
        <div className="content-wrapper">
          <Home />
        </div>
        <SideBarRight />
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

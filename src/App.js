import React from 'react';
import './App.css';
import './styles/theme.scss';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import Main from './pages/Main/Main';
import Navbar from './components/partials/Navbar/Navbar';
import SidebarLeft from './components/partials/SideBarLeft/SideBar';
import SideBarRight from './components/partials/SideBarRight/SideBar';
import AudioPlayer from './components/partials/AudioPlayer/AudioPlayer';

// Composant principal de l'application
const AppContent = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <SidebarLeft />
        <div className="content-wrapper">
          <Main />
        </div>
        <SideBarRight />
      </div>
      <AudioPlayer />
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

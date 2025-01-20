import React, { lazy, Suspense, memo } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import './styles/theme.scss';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy loaded components
const Main = lazy(() => import('./pages/Main/Main'));
const Navbar = lazy(() => import('./components/partials/Navbar/Navbar'));
const SidebarLeft = lazy(
  () => import('./components/partials/SideBarLeft/SideBar')
);
const SideBarRight = lazy(
  () => import('./components/partials/SideBarRight/SideBar')
);
const AudioPlayer = lazy(
  () => import('./components/partials/AudioPlayer/AudioPlayerF')
);

// Loading fallback component
const LoadingFallback = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
  </div>
);

const AppLayout = memo(({ children }) => (
  <div className="app-container">
    <Suspense fallback={<LoadingFallback />}>
      <Navbar />
      {children}
      <AudioPlayer />
    </Suspense>
  </div>
));

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

AppLayout.displayName = 'AppLayout';

const MainContent = memo(() => (
  <div className="main-content">
    <Suspense fallback={<LoadingFallback />}>
      <SidebarLeft />
      <div className="content-wrapper">
        <Main />
      </div>
      <SideBarRight />
    </Suspense>
  </div>
));

MainContent.displayName = 'MainContent';

const App = () => (
  <ErrorBoundary>
    <ThemeProvider>
      <AppLayout>
        <MainContent />
      </AppLayout>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;

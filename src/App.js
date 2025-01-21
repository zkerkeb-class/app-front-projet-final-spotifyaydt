import React, { lazy, Suspense, memo } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/theme.scss';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy loaded components
const Home = lazy(() => import('./pages/Home/Home'));
const Artist = lazy(() => import('./pages/Artist/Artist'));
const Album = lazy(() => import('./pages/Album/Album'));
const Track = lazy(() => import('./pages/Track/Track'));
const Search = lazy(() => import('./pages/Search/Search'));
const NotFound = lazy(() => import('./pages/404/404'));
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
const Footer = lazy(() => import('./components/partials/Footer/Footer'));
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
      <div className="main-content">
        <Suspense fallback={<LoadingFallback />}>
          <SidebarLeft />
          {children}
          <SideBarRight />
        </Suspense>
      </div>
      <AudioPlayer />
    </Suspense>
  </div>
));

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

AppLayout.displayName = 'AppLayout';

const MainContent = memo(() => (
  <div className="content-wrapper">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/artist/:id" element={<Artist />} />
      <Route path="/album/:id" element={<Album />} />
      <Route path="/track/:id" element={<Track />} />
      <Route path="/search" element={<Search />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </div>
));

MainContent.displayName = 'MainContent';

const Main = ({ children }) => (
  <div className="wrapper">
    <MainContent />
    <Footer />
  </div>
);

const App = () => (
  <ErrorBoundary>
    <ThemeProvider>
      <Router>
        <AppLayout>
          <Main />
        </AppLayout>
      </Router>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;

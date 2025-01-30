import React, { lazy, Suspense, memo } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/theme.scss';
import { ThemeProvider } from './contexts/ThemeContext';
import { AudioPlayerProvider } from './contexts/AudioPlayerContext';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/partials/Footer/Footer';

// Lazy loaded components
const Home = lazy(() => import('./pages/Home/Home'));
const Artist = lazy(() => import('./pages/Artist/Artist'));
const Album = lazy(() => import('./pages/Album/Album'));
const Track = lazy(() => import('./pages/Track/Track'));
const Search = lazy(() => import('./pages/Search/Search'));
const Playlist = lazy(() => import('./pages/Playlist/Playlist'));
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
const ResizableContainer = lazy(
  () => import('./components/UI/ResizableContainer/ResizableContainer')
);

// Loading fallback component
const LoadingFallback = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
  </div>
);

const MainContent = memo(() => (
  <div className="content-wrapper">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/artist/:id" element={<Artist />} />
      <Route path="/album/:id" element={<Album />} />
      <Route path="/track/:id" element={<Track />} />
      <Route path="/search" element={<Search />} />
      <Route path="/playlist/:id" element={<Playlist />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </div>
));

MainContent.displayName = 'MainContent';

const MainContentWrapper = memo(() => (
  <div className="main-content-wrapper">
    <MainContent />
    <Footer />
  </div>
));

const AppLayout = memo(({ children }) => (
  <div className="app-container">
    <Suspense fallback={<LoadingFallback />}>
      <Navbar />
      <div className="main-content">
        <Suspense fallback={<LoadingFallback />}>
          <ResizableContainer
            leftPanel={<SidebarLeft />}
            rightPanel={<SideBarRight />}
            mainContent={<MainContentWrapper />}
            minLeftWidth={260}
            maxLeftWidth={350}
            minRightWidth={200}
            maxRightWidth={300}
            defaultLeftWidth={350}
            defaultRightWidth={300}
          />
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

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AudioPlayerProvider>
          <Router>
            <AppLayout>
              <MainContentWrapper />
            </AppLayout>
          </Router>
        </AudioPlayerProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;

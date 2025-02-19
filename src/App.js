import React, { lazy, Suspense, memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/theme.scss';
import { ThemeProvider } from './contexts/ThemeContext';
import {
  AudioPlayerProvider,
  useAudioPlayer,
} from './contexts/AudioPlayerContext';
import { JamProvider } from './contexts/JamContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/partials/Footer/Footer';

// Lazy loaded components
const Home = lazy(() => import('./pages/Home/Home'));
const Artist = lazy(() => import('./pages/Artist/Artist'));
const Album = lazy(() => import('./pages/Album/Album'));
const Track = lazy(() => import('./pages/Track/Track'));
const Search = lazy(() => import('./pages/Search/Search'));
const Playlist = lazy(() => import('./pages/Playlist/Playlist'));
const More = lazy(() => import('./pages/More/More'));
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
const MobileAudioPlayer = lazy(
  () => import('./components/partials/AudioPlayer/MobileAudioPlayer')
);
const ResizableContainer = lazy(
  () => import('./components/UI/ResizableContainer/ResizableContainer')
);
const MobileNavBar = lazy(
  () => import('./components/partials/MobileNavBar/MobileNavBar')
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
      <Route path="/search/tracks" element={<Search />} />
      <Route path="/search/albums" element={<Search />} />
      <Route path="/search/artists" element={<Search />} />
      <Route path="/search/playlists" element={<Search />} />
      <Route path="/playlist/:id" element={<Playlist />} />
      <Route path="/more/:category" element={<More />} />
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

const AppLayout = memo(({ children }) => {
  const [isLibraryVisible, setIsLibraryVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { audioRef, currentTracks, currentTrackIndex } = useAudioPlayer();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLibraryClick = (value) => {
    setIsLibraryVisible(typeof value === 'boolean' ? value : !isLibraryVisible);
  };

  const getFileType = (url) => {
    if (!url) return null;
    const extension = url.split('.').pop().toLowerCase();
    switch (extension) {
      case 'mp3':
        return 'audio/mpeg';
      case 'wav':
        return 'audio/wav';
      case 'ogg':
        return 'audio/ogg';
      case 'm4a':
        return 'audio/mp4';
      case 'aac':
        return 'audio/aac';
      case 'webm':
        return 'audio/webm';
      default:
        return null;
    }
  };

  return (
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
              maxRightWidth={310}
              defaultLeftWidth={350}
              defaultRightWidth={310}
              isMobileLibraryVisible={isLibraryVisible}
            />
          </Suspense>
        </div>
        {/* Shared audio element */}
        <audio ref={audioRef} preload="metadata" aria-hidden="true">
          {currentTracks?.[currentTrackIndex]?.audioUrl && (
            <source
              src={currentTracks[currentTrackIndex].audioUrl}
              type={
                getFileType(currentTracks[currentTrackIndex].audioUrl) ||
                'audio/mpeg'
              }
            />
          )}
          Your browser does not support the audio element.
        </audio>
        {isMobile ? <MobileAudioPlayer /> : <AudioPlayer />}
        {isMobile && (
          <MobileNavBar
            onLibraryClick={handleLibraryClick}
            isLibraryVisible={isLibraryVisible}
          />
        )}
      </Suspense>
    </div>
  );
});

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

AppLayout.displayName = 'AppLayout';

const App = () => {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Suspense fallback={<LoadingFallback />}>
          <ThemeProvider>
            <AudioPlayerProvider>
              <JamProvider>
                <Router>
                  <AppLayout>
                    <MainContentWrapper />
                  </AppLayout>
                </Router>
              </JamProvider>
            </AudioPlayerProvider>
          </ThemeProvider>
        </Suspense>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;

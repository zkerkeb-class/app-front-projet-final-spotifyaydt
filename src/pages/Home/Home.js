import React, { useState, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './Home.module.scss';
import ErrorBoundary from '../../components/ErrorBoundary';

// Components
import HorizontalScroll from '../../components/UI/HorizontalScroll/HorizontalScroll';
import TrackCard from '../../components/UI/Cards/TrackCard';
import ArtistCard from '../../components/UI/Cards/ArtistCard';
import AlbumCard from '../../components/UI/Cards/AlbumCard';
import RecentSection from '../../components/UI/RecentSection/RecentSection';
import Filter from '../../components/UI/Filter/Filter';

// Mock Data
import {
  mockTracks,
  mockArtists,
  mockAlbums,
  mockRecentlyPlayed,
} from '../../constant/mockData';

const Home = () => {
  const { isDarkMode } = useTheme();
  const [activeFilter, setActiveFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = useCallback((filterName) => {
    setActiveFilter(filterName);
  }, []);

  const handlePlay = useCallback((item) => {
    console.log('Playing:', item);
    // Implement your play logic here
  }, []);

  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <Filter
          filterName="All"
          onFilter={handleFilterChange}
          isActive={activeFilter === 'All'}
        />
        <Filter
          filterName="Tracks"
          onFilter={handleFilterChange}
          isActive={activeFilter === 'Tracks'}
        />
        <Filter
          filterName="Artists"
          onFilter={handleFilterChange}
          isActive={activeFilter === 'Artists'}
        />
        <Filter
          filterName="Albums"
          onFilter={handleFilterChange}
          isActive={activeFilter === 'Albums'}
        />
      </header>

      <ErrorBoundary>
        <RecentSection
          tracks={mockRecentlyPlayed}
          isLoading={isLoading}
          onPlay={handlePlay}
        />

        <main className={styles.mainContent}>
          {(activeFilter === 'All' || activeFilter === 'Tracks') && (
            <HorizontalScroll title="Popular Tracks">
              {mockTracks.map((track) => (
                <TrackCard key={track.id} track={track} onPlay={handlePlay} />
              ))}
            </HorizontalScroll>
          )}

          {(activeFilter === 'All' || activeFilter === 'Artists') && (
            <HorizontalScroll title="Popular Artists">
              {mockArtists.map((artist) => (
                <ArtistCard
                  key={artist.id}
                  artist={artist}
                  onPlay={handlePlay}
                />
              ))}
            </HorizontalScroll>
          )}

          {(activeFilter === 'All' || activeFilter === 'Albums') && (
            <HorizontalScroll title="Featured Albums">
              {mockAlbums.map((album) => (
                <AlbumCard key={album.id} album={album} onPlay={handlePlay} />
              ))}
            </HorizontalScroll>
          )}
        </main>
      </ErrorBoundary>
    </div>
  );
};

export default Home;

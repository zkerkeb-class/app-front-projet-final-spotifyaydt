import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import styles from './Home.module.scss';
import ErrorBoundary from '../../components/ErrorBoundary';

// Components
import HorizontalScroll from '../../components/UI/HorizontalScroll/HorizontalScroll';
import TrackCard from '../../components/UI/Cards/TrackCard';
import ArtistCard from '../../components/UI/Cards/ArtistCard';
import AlbumCard from '../../components/UI/Cards/AlbumCard';
import PlaylistCard from '../../components/UI/Cards/PlaylistCard';
import RecentSection from '../../components/UI/RecentSection/RecentSection';
import Filter from '../../components/UI/Filter/Filter';

// Mock Data
import {
  mockTracks,
  mockArtists,
  mockAlbums,
  mockPlaylists,
} from '../../constant/mockData';

const Home = () => {
  const { handlePlay, lastPlays, mostListenedTo } = useAudioPlayer();
  const [activeFilter, setActiveFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const INITIAL_LIMIT = 20;

  const handleFilterChange = (filterName) => {
    setActiveFilter(filterName);
  };

  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <Filter
          filterName={t('filters.all')}
          onFilter={handleFilterChange}
          isActive={activeFilter === 'All'}
        />
        <Filter
          filterName={t('filters.tracks')}
          onFilter={handleFilterChange}
          isActive={activeFilter === 'Tracks'}
        />
        <Filter
          filterName={t('filters.artists')}
          onFilter={handleFilterChange}
          isActive={activeFilter === 'Artists'}
        />
        <Filter
          filterName={t('filters.albums')}
          onFilter={handleFilterChange}
          isActive={activeFilter === 'Albums'}
        />
        <Filter
          filterName={t('filters.playlists')}
          onFilter={handleFilterChange}
          isActive={activeFilter === 'Playlists'}
        />
      </header>

      <ErrorBoundary>
        <RecentSection
          tracks={lastPlays}
          isLoading={isLoading}
          onPlay={handlePlay}
        />

        <main className={styles.mainContent}>
          {(activeFilter === 'All' || activeFilter === 'Tracks') && (
            <HorizontalScroll
              title="Popular Tracks"
              showShowMore={mockTracks.length > INITIAL_LIMIT}
              moreLink="/more/tracks"
              itemCount={mockTracks.length}
              maxItems={INITIAL_LIMIT}
            >
              {mockTracks.slice(0, INITIAL_LIMIT).map((track) => (
                <TrackCard key={track.id} track={track} onPlay={handlePlay} />
              ))}
            </HorizontalScroll>
          )}

          {(activeFilter === 'All' || activeFilter === 'Last Plays') &&
            lastPlays.length > 0 && (
              <HorizontalScroll
                title="Last Plays"
                showShowMore={lastPlays.length > INITIAL_LIMIT}
                moreLink="/more/history"
                itemCount={lastPlays.length}
                maxItems={INITIAL_LIMIT}
              >
                {lastPlays.slice(0, INITIAL_LIMIT).map((track) => (
                  <TrackCard key={track.id} track={track} onPlay={handlePlay} />
                ))}
              </HorizontalScroll>
            )}

          {(activeFilter === 'All' || activeFilter === 'Most Listened To') &&
            mostListenedTo.length > 0 && (
              <HorizontalScroll
                title="Most Listened To"
                showShowMore={mostListenedTo.length > INITIAL_LIMIT}
                moreLink="/more/most-played"
                itemCount={mostListenedTo.length}
                maxItems={INITIAL_LIMIT}
              >
                {mostListenedTo.slice(0, INITIAL_LIMIT).map((track) => (
                  <TrackCard key={track.id} track={track} onPlay={handlePlay} />
                ))}
              </HorizontalScroll>
            )}

          {(activeFilter === 'All' || activeFilter === 'Artists') && (
            <HorizontalScroll
              title="Popular Artists"
              showShowMore={mockArtists.length > INITIAL_LIMIT}
              moreLink="/more/artists"
              itemCount={mockArtists.length}
              maxItems={INITIAL_LIMIT}
            >
              {mockArtists.slice(0, INITIAL_LIMIT).map((artist) => (
                <ArtistCard
                  key={artist.id}
                  artist={artist}
                  onPlay={handlePlay}
                />
              ))}
            </HorizontalScroll>
          )}

          {(activeFilter === 'All' || activeFilter === 'Albums') && (
            <HorizontalScroll
              title="Featured Albums"
              showShowMore={mockAlbums.length > INITIAL_LIMIT}
              moreLink="/more/albums"
              itemCount={mockAlbums.length}
              maxItems={INITIAL_LIMIT}
            >
              {mockAlbums.slice(0, INITIAL_LIMIT).map((album) => (
                <AlbumCard key={album.id} album={album} onPlay={handlePlay} />
              ))}
            </HorizontalScroll>
          )}

          {(activeFilter === 'All' || activeFilter === 'Playlists') && (
            <HorizontalScroll
              title="Featured Playlists"
              showShowMore={mockPlaylists.length > INITIAL_LIMIT}
              moreLink="/more/playlists"
              itemCount={mockPlaylists.length}
              maxItems={INITIAL_LIMIT}
            >
              {mockPlaylists.slice(0, INITIAL_LIMIT).map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  onPlay={handlePlay}
                />
              ))}
            </HorizontalScroll>
          )}
        </main>
      </ErrorBoundary>
    </div>
  );
};

export default Home;

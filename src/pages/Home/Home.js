import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import { fetchWithCache } from '../../utils/cacheUtils';
import Filter from '../../components/UI/Filter/Filter';
import FilterScroll from '../../components/UI/FilterScroll/FilterScroll';
import style from './Home.module.scss';
import ErrorBoundary from '../../components/ErrorBoundary';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';

// Lazy loaded components
const HorizontalScroll = lazy(
  () => import('../../components/UI/HorizontalScroll/HorizontalScroll')
);
const RecentSection = lazy(
  () => import('../../components/UI/RecentSection/RecentSection')
);
const TrackCard = lazy(() => import('../../components/UI/Cards/TrackCard'));
const ArtistCard = lazy(() => import('../../components/UI/Cards/ArtistCard'));
const AlbumCard = lazy(() => import('../../components/UI/Cards/AlbumCard'));
const PlaylistCard = lazy(
  () => import('../../components/UI/Cards/PlaylistCard')
);

const LoadingFallback = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
  </div>
);

const Home = () => {
  const { handlePlay, lastPlays, mostListenedTo } = useAudioPlayer();
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState(t('filters.all'));

  // Fetch data from API
  const { data: tracks, loading: tracksLoading } = useApi(
    () => api.tracks.getAll(),
    []
  );
  const { data: albums, loading: albumsLoading } = useApi(
    () => api.albums.getAll(),
    []
  );
  const { data: artists, loading: artistsLoading } = useApi(
    () => api.artists.getAll(),
    []
  );
  const { data: playlists, loading: playlistsLoading } = useApi(
    () => api.playlists.getAll(),
    []
  );

  const isLoading =
    tracksLoading || albumsLoading || artistsLoading || playlistsLoading;

  // Sort tracks by play count for popular tracks
  const popularTracks = tracks
    ? [...tracks]
        .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
        .slice(0, 10)
    : [];

  // Sort artists by followers for popular artists
  const popularArtists = artists
    ? [...artists]
        .sort((a, b) => (b.followers || 0) - (a.followers || 0))
        .slice(0, 10)
    : [];

  // Get featured albums (could be based on release date or other criteria)
  const featuredAlbums = albums
    ? [...albums]
        .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
        .slice(0, 10)
    : [];

  // Get featured playlists
  const featuredPlaylists = playlists
    ? [...playlists].sort(() => Math.random() - 0.5).slice(0, 10)
    : [];

  const INITIAL_LIMIT = 15;

  const handleFilterChange = (filterName) => {
    setActiveFilter(filterName);
  };

  return (
    <div className={style.home}>
      <header className={style.header}>
        <FilterScroll>
          <Filter
            filterName={t('filters.all')}
            onFilter={handleFilterChange}
            isActive={activeFilter === t('filters.all')}
          />
          <Filter
            filterName={t('filters.tracks')}
            onFilter={handleFilterChange}
            isActive={activeFilter === t('filters.tracks')}
          />
          <Filter
            filterName={t('filters.artists')}
            onFilter={handleFilterChange}
            isActive={activeFilter === t('filters.artists')}
          />
          <Filter
            filterName={t('filters.albums')}
            onFilter={handleFilterChange}
            isActive={activeFilter === t('filters.albums')}
          />
          <Filter
            filterName={t('filters.playlists')}
            onFilter={handleFilterChange}
            isActive={activeFilter === t('filters.playlists')}
          />
        </FilterScroll>
      </header>

      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          {isLoading ? (
            <LoadingFallback />
          ) : (
            <>
              {activeFilter === t('filters.all') && (
                <RecentSection
                  tracks={lastPlays}
                  isLoading={false}
                  onPlay={handlePlay}
                />
              )}

              {(activeFilter === t('filters.all') ||
                activeFilter === t('filters.tracks')) && (
                <HorizontalScroll
                  title={t('common.popularTracks')}
                  showShowMore={true}
                  moreLink="/more/tracks"
                  itemCount={tracks?.length || 0}
                  maxItems={INITIAL_LIMIT}
                >
                  {popularTracks.map((track) => (
                    <TrackCard key={track.id} track={track} />
                  ))}
                </HorizontalScroll>
              )}

              {(activeFilter === t('filters.all') ||
                activeFilter === t('filters.artists')) && (
                <HorizontalScroll
                  title={t('common.popularArtists')}
                  showShowMore={true}
                  moreLink="/more/artists"
                  itemCount={artists?.length || 0}
                  maxItems={INITIAL_LIMIT}
                >
                  {popularArtists.map((artist) => (
                    <ArtistCard key={artist._id} artist={artist} />
                  ))}
                </HorizontalScroll>
              )}

              {(activeFilter === t('filters.all') ||
                activeFilter === t('filters.albums')) && (
                <HorizontalScroll
                  title={t('common.featuredAlbums')}
                  showShowMore={true}
                  moreLink="/more/albums"
                  itemCount={albums?.length || 0}
                  maxItems={INITIAL_LIMIT}
                >
                  {featuredAlbums.map((album) => (
                    <AlbumCard key={album.id} album={album} />
                  ))}
                </HorizontalScroll>
              )}

              {(activeFilter === t('filters.all') ||
                activeFilter === t('filters.playlists')) && (
                <HorizontalScroll
                  title={t('common.featuredPlaylists')}
                  showShowMore={true}
                  moreLink="/more/playlists"
                  itemCount={playlists?.length || 0}
                  maxItems={INITIAL_LIMIT}
                >
                  {featuredPlaylists.map((playlist) => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                  ))}
                </HorizontalScroll>
              )}
            </>
          )}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default Home;

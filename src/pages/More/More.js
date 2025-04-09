import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import styles from './More.module.scss';
import ErrorBoundary from '../../components/ErrorBoundary';
import TrackCard from '../../components/UI/Cards/TrackCard';
import AlbumCard from '../../components/UI/Cards/AlbumCard';
import ArtistCard from '../../components/UI/Cards/ArtistCard';
import PlaylistCard from '../../components/UI/Cards/PlaylistCard';
import Filter from '../../components/UI/Filter/Filter';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import LoadingSpinner from '../../components/UI/LoadingSpinner/LoadingSpinner';

const More = () => {
  const { category } = useParams();
  const location = useLocation();
  const { handlePlay, lastPlays, mostListenedTo } = useAudioPlayer();
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    setIsLoading(true);
    let data = [];
    switch (category) {
      case 'tracks':
        data = tracks || [];
        setIsLoading(tracksLoading);
        break;
      case 'albums':
        data = albums || [];
        setIsLoading(albumsLoading);
        break;
      case 'artists':
        data = artists || [];
        setIsLoading(artistsLoading);
        break;
      case 'playlists':
        data = playlists || [];
        setIsLoading(playlistsLoading);
        break;
      case 'history':
        data = lastPlays || [];
        setIsLoading(false);
        break;
      case 'most-played':
        data = mostListenedTo || [];
        setIsLoading(false);
        break;
      default:
        data = [];
        setIsLoading(false);
    }
    setItems(data);
  }, [
    category,
    tracks,
    albums,
    artists,
    playlists,
    lastPlays,
    mostListenedTo,
    tracksLoading,
    albumsLoading,
    artistsLoading,
    playlistsLoading,
  ]);

  const renderItems = () => {
    return items.map((item) => {
      switch (category) {
        case 'tracks':
          return <TrackCard key={item._id} track={item} />;
        case 'albums':
          return <AlbumCard key={item._id} album={item} />;
        case 'artists':
          return <ArtistCard key={item._id} artist={item} />;
        case 'playlists':
          return <PlaylistCard key={item._id} playlist={item} />;
        default:
          return null;
      }
    });
  };

  const getCategoryTitle = () => {
    switch (category) {
      case 'tracks':
        return t('common.popularTracks');
      case 'albums':
        return t('common.featuredAlbums');
      case 'artists':
        return t('common.popularArtists');
      case 'playlists':
        return t('common.featuredPlaylists');
      case 'history':
        return t('common.recentlyPlayed');
      case 'most-played':
        return t('common.mostPlayed');
      default:
        return t('common.all');
    }
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
    let sortedItems = [...items];

    switch (sortType) {
      case 'name':
        sortedItems.sort((a, b) => {
          const nameA = a.title || a.name;
          const nameB = b.title || b.name;
          return nameA.localeCompare(nameB);
        });
        break;
      case 'recent':
        // Sort by createdAt or releaseDate if available
        sortedItems.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.releaseDate || 0);
          const dateB = new Date(b.createdAt || b.releaseDate || 0);
          return dateB - dateA;
        });
        break;
      case 'popularity':
        sortedItems.sort((a, b) => {
          const popularityA = a.playCount || a.popularity || a.followers || 0;
          const popularityB = b.playCount || b.popularity || b.followers || 0;
          return popularityB - popularityA;
        });
        break;
      default:
        break;
    }

    setItems(sortedItems);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>{getCategoryTitle()}</h1>
          <div className={styles.filters}>
            <Filter
              filterName={t('filters.alphabetical')}
              onFilter={() => handleSort('name')}
              isActive={sortBy === 'name'}
            />
            <Filter
              filterName={t('filters.recent')}
              onFilter={() => handleSort('recent')}
              isActive={sortBy === 'recent'}
            />
            <Filter
              filterName={t('filters.popular')}
              onFilter={() => handleSort('popularity')}
              isActive={sortBy === 'popularity'}
            />
          </div>
        </header>

        <div className={styles.grid}>
          {items.length > 0 ? (
            renderItems()
          ) : (
            <div className={styles.empty}>
              <h2>{t('errors.notFound')}</h2>
              <p>{t('errors.loadError')}</p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default More;

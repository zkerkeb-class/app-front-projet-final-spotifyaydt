import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import styles from './More.module.scss';
import ErrorBoundary from '../../components/ErrorBoundary';
import TrackCard from '../../components/UI/Cards/TrackCard';
import AlbumCard from '../../components/UI/Cards/AlbumCard';
import ArtistCard from '../../components/UI/Cards/ArtistCard';
import PlaylistCard from '../../components/UI/Cards/PlaylistCard';
import Filter from '../../components/UI/Filter/Filter';
import {
  mockTracks,
  mockAlbums,
  mockArtists,
  mockPlaylists,
} from '../../constant/mockData';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';

const More = () => {
  const { category } = useParams();
  const location = useLocation();
  const { handlePlay } = useAudioPlayer();
  const [items, setItems] = useState([]);
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    let data = [];
    switch (category) {
      case 'tracks':
        data = mockTracks;
        break;
      case 'albums':
        data = mockAlbums;
        break;
      case 'artists':
        data = mockArtists;
        break;
      case 'playlists':
        data = mockPlaylists;
        break;
      case 'history':
        // You would get this from your audio player context
        data = [];
        break;
      case 'most-played':
        // You would get this from your audio player context
        data = [];
        break;
      default:
        data = [];
    }
    setItems(data);
  }, [category]);

  const renderItems = () => {
    return items.map((item) => {
      switch (category) {
        case 'tracks':
          return <TrackCard key={item.id} track={item} onPlay={handlePlay} />;
        case 'albums':
          return <AlbumCard key={item.id} album={item} onPlay={handlePlay} />;
        case 'artists':
          return <ArtistCard key={item.id} artist={item} onPlay={handlePlay} />;
        case 'playlists':
          return (
            <PlaylistCard key={item.id} playlist={item} onPlay={handlePlay} />
          );
        default:
          return null;
      }
    });
  };

  const getCategoryTitle = () => {
    switch (category) {
      case 'tracks':
        return 'All Tracks';
      case 'albums':
        return 'All Albums';
      case 'artists':
        return 'All Artists';
      case 'playlists':
        return 'All Playlists';
      case 'history':
        return 'Recently Played';
      case 'most-played':
        return 'Most Played';
      default:
        return 'All Items';
    }
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
    let sortedItems = [...items];

    switch (sortType) {
      case 'name':
        sortedItems.sort((a, b) =>
          (a.title || a.name).localeCompare(b.title || b.name)
        );
        break;
      case 'recent':
        sortedItems.reverse();
        break;
      case 'popularity':
        sortedItems.sort((a, b) => (b.plays || 0) - (a.plays || 0));
        break;
      default:
        break;
    }

    setItems(sortedItems);
  };

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>{getCategoryTitle()}</h1>
          <div className={styles.filters}>
            <Filter
              filterName="A-Z"
              onFilter={() => handleSort('name')}
              isActive={sortBy === 'name'}
            />
            <Filter
              filterName="Recent"
              onFilter={() => handleSort('recent')}
              isActive={sortBy === 'recent'}
            />
            <Filter
              filterName="Popular"
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
              <h2>No items found</h2>
              <p>There are no items in this category yet.</p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default More;

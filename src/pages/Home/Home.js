import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './Home.module.scss';

// Components
import HorizontalScroll from '../../components/UI/HorizontalScroll/HorizontalScroll';
import TrackCard from '../../components/UI/Cards/TrackCard';
import ArtistCard from '../../components/UI/Cards/ArtistCard';
import AlbumCard from '../../components/UI/Cards/AlbumCard';

// Données temporaires pour la démo
const mockData = {
  tracks: Array(10)
    .fill(null)
    .map((_, i) => ({
      id: i,
      type: 'track',
      title: `Top Track ${i + 1}`,
      artist: `Artist ${i + 1}`,
      coverUrl: `https://picsum.photos/200?random=${i}`,
    })),
  artists: Array(10)
    .fill(null)
    .map((_, i) => ({
      id: i,
      type: 'artist',
      name: `Popular Artist ${i + 1}`,
      followers: Math.floor(Math.random() * 1000000),
      imageUrl: `https://picsum.photos/200?random=${i + 20}`,
    })),
  albums: Array(10)
    .fill(null)
    .map((_, i) => ({
      id: i,
      type: 'Playlist',
      title: `New Album ${i + 1}`,
      artist: `Artist ${i + 1}`,
      year: 2023,
      coverUrl: `https://picsum.photos/200?random=${i + 40}`,
    })),
};

const Home = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <h1>Bienvenue sur Spotify AYDT</h1>
        <p className={styles.subtitle}>
          Découvrez votre nouvelle expérience musicale
        </p>
      </header>

      <main className={styles.mainContent}>
        <HorizontalScroll title="Top 10 des derniers sons">
          {mockData.tracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </HorizontalScroll>

        <HorizontalScroll title="Top 10 des artistes populaires">
          {mockData.artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </HorizontalScroll>

        <HorizontalScroll title="Top 10 des albums récents">
          {mockData.albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </HorizontalScroll>
      </main>
    </div>
  );
};

export default Home;

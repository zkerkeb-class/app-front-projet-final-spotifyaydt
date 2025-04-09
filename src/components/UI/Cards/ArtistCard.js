import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './Cards.module.scss';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import CardFallbackIcon from '../CardFallbackIcon/CardFallbackIcon';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import { api } from '../../../services/api';
import { useApi } from '../../../hooks/useApi';

// Icons
import { FaPlay, FaPause } from 'react-icons/fa';

const ArtistCard = ({ artist, onPlay }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { handlePlay, isPlaying, activeCardId } = useAudioPlayer();

  const { data: tracks } = useApi(() => api.tracks.getAll(), []);

  // Check if this specific artist is the active source of playback
  const isThisPlaying = isPlaying && activeCardId === artist._id;

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      navigate(`/artist/${artist._id}`);
    },
    [navigate, artist._id]
  );

  const handlePlayClick = useCallback(
    (e) => {
      e.stopPropagation();

      const artistTracks =
        tracks
          ?.filter((track) => track.artist._id === artist._id)
          .sort((a, b) => (b.playCount || 0) - (a.playCount || 0)) || [];

      if (artistTracks.length === 0) {
        console.warn(`No tracks found for artist: ${artist.name}`);
        return;
      }

      handlePlay({
        track: artistTracks[0],
        tracks: artistTracks,
        action: isThisPlaying ? 'pause' : 'play',
      });
    },
    [artist, tracks, handlePlay, isThisPlaying]
  );

  const formatFollowers = (count) => {
    if (!count) return t('common.noFollowers');
    if (count >= 1000000) {
      return t('common.millionFollowers', {
        count: (count / 1000000).toFixed(1),
      });
    } else if (count >= 1000) {
      return t('common.thousandFollowers', {
        count: (count / 1000).toFixed(1),
      });
    }
    return t('common.followers', { count });
  };

  if (!artist || !artist.name) {
    return null;
  }

  return (
    <div
      onClick={handleClick}
      className={`${styles.card} ${styles.artistCard}`}
      role="button"
      tabIndex={0}
      aria-label={t('common.artist')}
    >
      <div className={styles.artistImageContainer}>
        {artist.imageUrl ? (
          <OptimizedImage
            src={artist.imageUrl}
            alt={t('common.artistPhoto', { name: artist.name })}
            className={`${styles.image} ${styles.artistImage}`}
            sizes="(max-width: 768px) 150px, 200px"
            loading="lazy"
          />
        ) : (
          <CardFallbackIcon type="artist" />
        )}
        <button
          className={styles.playButton}
          onClick={handlePlayClick}
          aria-label={
            isThisPlaying
              ? t('common.pauseArtist', { name: artist.name })
              : t('common.playArtist', { name: artist.name })
          }
        >
          {isThisPlaying ? <FaPause /> : <FaPlay />}
        </button>
      </div>
      <div className={styles.content}>
        <span className={styles.title}>{artist.name}</span>
        <p className={styles.followers}>{formatFollowers(artist.popularity)}</p>
      </div>
    </div>
  );
};

export default ArtistCard;

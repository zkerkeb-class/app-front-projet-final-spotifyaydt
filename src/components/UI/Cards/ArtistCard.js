import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './Cards.module.scss';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { mockTracks } from '../../../constant/mockData';
import CardFallbackIcon from '../CardFallbackIcon/CardFallbackIcon';

// Icons
import { FaPlay, FaPause } from 'react-icons/fa';

const ArtistCard = ({ artist, onPlay }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { handlePlay, isPlaying, activeCardId } = useAudioPlayer();

  // Check if this specific artist is the active source of playback
  const isThisPlaying = isPlaying && activeCardId === artist.id;

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      navigate(`/artist/${artist.id}`);
    },
    [navigate, artist.id]
  );

  const handlePlayClick = useCallback(
    (e) => {
      e.stopPropagation();

      const artistTracks = mockTracks
        .filter((track) => track.artist === artist.name)
        .sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0));

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
    [artist, handlePlay, isThisPlaying]
  );

  const formatFollowers = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M followers`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K followers`;
    }
    return `${count} followers`;
  };

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
          <img
            src={artist.imageUrl}
            alt={t('common.artistPhoto', { name: artist.name })}
            className={`${styles.image} ${styles.artistImage}`}
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
        <p className={styles.followers}>
          {t('common.followerCount', { count: artist.followers })}
        </p>
      </div>
    </div>
  );
};

export default ArtistCard;

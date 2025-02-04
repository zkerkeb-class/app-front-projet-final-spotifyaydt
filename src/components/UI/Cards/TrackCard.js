import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaPlay, FaPause } from 'react-icons/fa';
import styles from './Cards.module.scss';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import CardFallbackIcon from '../CardFallbackIcon/CardFallbackIcon';

const TrackCard = ({ track }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { handlePlay, isPlaying, activeCardId } = useAudioPlayer();

  // Check if this track is currently playing
  const isThisPlaying = isPlaying && activeCardId === track.id;

  const handleCardClick = useCallback(
    (e) => {
      // Don't navigate if clicking the play button
      if (e.target.closest(`.${styles.playButton}`)) {
        return;
      }
      navigate(`/track/${track.id}`);
    },
    [navigate, track.id]
  );

  const handlePlayClick = useCallback(
    (e) => {
      e.preventDefault(); // Prevent any navigation
      e.stopPropagation(); // Stop event bubbling
      handlePlay({
        track,
        tracks: [track],
        action: isThisPlaying ? 'pause' : 'play',
      });
    },
    [track, handlePlay, isThisPlaying]
  );

  const formatDuration = (duration) => {
    const [minutes, seconds] = duration.split(':');
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  return (
    <div
      className={styles.card}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={t('common.track')}
    >
      <div className={styles.imageContainer}>
        {track.coverUrl ? (
          <img
            src={track.coverUrl}
            alt={t('common.coverArt', { title: track.title })}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <CardFallbackIcon type="track" />
        )}
        <button
          className={`${styles.playButton} ${isThisPlaying ? styles.visible : ''}`}
          onClick={handlePlayClick}
          aria-label={
            isThisPlaying
              ? t('common.pause', { title: track.title })
              : t('common.play', { title: track.title })
          }
        >
          {isThisPlaying ? <FaPause /> : <FaPlay />}
        </button>
      </div>
      <div className={styles.content}>
        <span className={styles.title}>{track.title}</span>
        <p className={styles.artist}>{track.artist}</p>
        <p className={styles.duration}>{formatDuration(track.duration)}</p>
      </div>
    </div>
  );
};

export default TrackCard;

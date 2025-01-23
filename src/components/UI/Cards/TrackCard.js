import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaPause } from 'react-icons/fa';
import styles from './Cards.module.scss';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import CardFallbackIcon from '../CardFallbackIcon/CardFallbackIcon';

const TrackCard = ({ track }) => {
  const navigate = useNavigate();
  const {
    handlePlay,
    currentTracks,
    currentTrackIndex,
    isPlaying,
    activeCardId,
  } = useAudioPlayer();

  // Check if this track is currently playing
  const isThisPlaying = isPlaying && activeCardId === track.id;

  const handleClick = useCallback(() => {
    navigate(`/track/${track.id}`);
  }, [navigate, track.id]);

  const handlePlayClick = useCallback(
    (e) => {
      e.stopPropagation();
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
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.imageContainer}>
        {track.coverUrl ? (
          <img
            src={track.coverUrl}
            alt={track.title}
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
            isThisPlaying ? `Pause ${track.title}` : `Play ${track.title}`
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

TrackCard.propTypes = {
  track: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    coverUrl: PropTypes.string,
    duration: PropTypes.string.isRequired,
  }).isRequired,
};

export default TrackCard;

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaPause } from 'react-icons/fa';
import styles from './Cards.module.scss';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';

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

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.imageContainer}>
        <img
          src={track.coverUrl}
          alt={track.title}
          className={styles.image}
          loading="lazy"
        />
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
      </div>
    </div>
  );
};

TrackCard.propTypes = {
  track: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    coverUrl: PropTypes.string.isRequired,
    audio: PropTypes.string.isRequired,
  }).isRequired,
};

export default TrackCard;

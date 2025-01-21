import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './Cards.module.scss';

// Icons
import { FaPlay, FaPause } from 'react-icons/fa';

const TrackCard = ({ track, onPlay }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/track/${track.id}`);
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    onPlay(track);
  };

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
          className={styles.playButton}
          onClick={handlePlayClick}
          aria-label={`Play ${track.title}`}
        >
          <FaPlay />
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
  }).isRequired,
  onPlay: PropTypes.func.isRequired,
};

export default TrackCard;

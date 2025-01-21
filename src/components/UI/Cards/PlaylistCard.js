import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './Cards.module.scss';

// Icons
import { FaPlay, FaPause } from 'react-icons/fa';

const PlaylistCard = ({ playlist, onPlay }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/playlist/${playlist.id}`);
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    onPlay(playlist);
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.imageContainer}>
        <img
          src={playlist.coverUrl}
          alt={playlist.title}
          className={styles.image}
          loading="lazy"
        />
        <button
          className={styles.playButton}
          onClick={handlePlayClick}
          aria-label={`Play ${playlist.title}`}
        >
          <FaPlay />
        </button>
      </div>
      <div className={styles.content}>
        <span className={styles.title}>{playlist.title}</span>
      </div>
    </div>
  );
};

PlaylistCard.propTypes = {
  playlist: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    coverUrl: PropTypes.string.isRequired,
    followers: PropTypes.number.isRequired,
  }).isRequired,
  onPlay: PropTypes.func.isRequired,
};

export default PlaylistCard;

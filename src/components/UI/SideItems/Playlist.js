import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './SideItem.module.scss';
import { FaPlay } from 'react-icons/fa6';

const Playlist = ({ playlist = {}, onClick }) => {
  const [imageError, setImageError] = useState(false);

  // If playlist is undefined or null, return null or a placeholder
  if (!playlist) {
    return null;
  }

  const handleImageError = () => {
    setImageError(true);
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick(playlist);
    }
  };

  const {
    title = 'Untitled Playlist',
    coverUrl = '/default-playlist.png',
    description = 'Playlist',
  } = playlist;

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.imageContainer}>
        <img
          src={imageError ? '/default-playlist.png' : coverUrl}
          alt={title}
          className={styles.image}
          onError={handleImageError}
          loading="lazy"
        />
        <button
          className={styles.playButton}
          onClick={(e) => {
            e.stopPropagation();
            handleClick(e);
          }}
          aria-label={`Play ${title}`}
        >
          <FaPlay />
        </button>
      </div>
      <div className={styles.content}>
        <span className={styles.title}>{title}</span>
        <p className={styles.artist}>{description}</p>
      </div>
    </div>
  );
};

Playlist.propTypes = {
  playlist: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    coverUrl: PropTypes.string,
    description: PropTypes.string,
  }),
  onClick: PropTypes.func,
};

Playlist.defaultProps = {
  playlist: {
    id: 0,
    title: 'Untitled Playlist',
    coverUrl: '/default-playlist.png',
    description: 'Playlist',
  },
  onClick: () => {},
};

export default Playlist;

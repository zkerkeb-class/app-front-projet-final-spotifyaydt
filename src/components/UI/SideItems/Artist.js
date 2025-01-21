import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './SideItem.module.scss';
import { FaPlay } from 'react-icons/fa6';

const Artist = ({ artist, onClick }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick(artist);
    }
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={`${styles.imageContainer} ${styles.roundImage}`}>
        <img
          src={imageError ? '/default-artist.png' : artist.imageUrl}
          alt={artist.name}
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
          aria-label={`Play ${artist.name}'s top tracks`}
        >
          <FaPlay />
        </button>
      </div>
      <div className={styles.content}>
        <span className={styles.title}>{artist.name}</span>
        <p className={styles.artist}>
          Artist • {artist.followers.toLocaleString()} followers
        </p>
      </div>
    </div>
  );
};

Artist.propTypes = {
  artist: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    followers: PropTypes.number.isRequired,
  }).isRequired,
  onClick: PropTypes.func,
};

export default Artist;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './Cards.module.scss';

// Icons
import { FaPlay, FaPause } from 'react-icons/fa';

const AlbumCard = ({ album, onPlay }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/album/${album.id}`);
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    onPlay(album);
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.imageContainer}>
        <img
          src={album.coverUrl}
          alt={album.title}
          className={styles.image}
          loading="lazy"
        />
        <button
          className={styles.playButton}
          onClick={handlePlayClick}
          aria-label={`Play ${album.title}`}
        >
          <FaPlay />
        </button>
      </div>
      <div className={styles.content}>
        <span className={styles.title}>{album.title}</span>
        <p className={styles.artist}>{album.artist}</p>
        <p className={styles.year}>{album.year}</p>
      </div>
    </div>
  );
};

AlbumCard.propTypes = {
  album: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    coverUrl: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
  }).isRequired,
  onPlay: PropTypes.func.isRequired,
};

export default AlbumCard;

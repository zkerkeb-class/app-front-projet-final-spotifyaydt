import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './Cards.module.scss';

// Icons
import { FaPlay, FaPause } from 'react-icons/fa';

const ArtistCard = ({ artist, onPlay }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/artist/${artist.id}`);
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    onPlay(artist);
  };

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
      className={`${styles.card} ${styles.artistCard}`}
      onClick={handleClick}
    >
      <div className={styles.artistImageContainer}>
        <img
          src={artist.imageUrl}
          alt={artist.name}
          className={`${styles.image} ${styles.artistImage}`}
          loading="lazy"
        />
        <button
          className={styles.playButton}
          onClick={handlePlayClick}
          aria-label={`Play ${artist.name}'s top tracks`}
        >
          <FaPlay />
        </button>
      </div>
      <div className={styles.content}>
        <span className={styles.title}>{artist.name}</span>
        <p className={styles.followers}>
          {new Intl.NumberFormat().format(artist.followers)} followers
        </p>
      </div>
    </div>
  );
};

ArtistCard.propTypes = {
  artist: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    followers: PropTypes.number.isRequired,
  }).isRequired,
  onPlay: PropTypes.func.isRequired,
};

export default ArtistCard;

import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './SideItem.module.scss';
import { FaPlay, FaPause } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { mockTracks } from '../../../constant/mockData';

const Artist = ({ artist, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const { handlePlay, isPlaying, activeCardId } = useAudioPlayer();

  const isThisPlaying = isPlaying && activeCardId === artist.id;

  const handleImageError = () => {
    setImageError(true);
  };

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

  return (
    <Link
      to={`/artist/${artist.id}`}
      className={styles.card}
      onClick={handleClick}
    >
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
          onClick={handlePlayClick}
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
    </Link>
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

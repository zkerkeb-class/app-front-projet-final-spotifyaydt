import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './SideItem.module.scss';
import { FaPlay, FaPause } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { mockTracks } from '../../../constant/mockData';

const Album = ({ album, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const { handlePlay, isPlaying, activeCardId } = useAudioPlayer();

  const isThisPlaying = isPlaying && activeCardId === album.id;

  const handleImageError = () => {
    setImageError(true);
  };

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      navigate(`/album/${album.id}`);
    },
    [navigate, album.id]
  );

  const handlePlayClick = useCallback(
    (e) => {
      e.stopPropagation();

      const albumTracks = mockTracks
        .filter((track) => track.album === album.title)
        .sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0));

      if (albumTracks.length === 0) {
        console.warn(`No tracks found for album: ${album.title}`);
        return;
      }

      handlePlay({
        track: albumTracks[0],
        tracks: albumTracks,
        action: isThisPlaying ? 'pause' : 'play',
      });
    },
    [album, handlePlay, isThisPlaying]
  );

  return (
    <Link
      to={`/album/${album.id}`}
      className={styles.card}
      onClick={handleClick}
    >
      <div className={styles.imageContainer}>
        <img
          src={imageError ? '/default-playlist.png' : album.coverUrl}
          alt={album.title}
          className={styles.image}
          onError={handleImageError}
          loading="lazy"
        />
        <button
          className={styles.playButton}
          onClick={handlePlayClick}
          aria-label={`Play ${album.title}`}
        >
          {isThisPlaying ? <FaPause /> : <FaPlay />}
        </button>
      </div>
      <div className={styles.content}>
        <span className={styles.title}>{album.title}</span>
        <p className={styles.artist}>{album.description}</p>
      </div>
    </Link>
  );
};

Album.propTypes = {
  album: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    coverUrl: PropTypes.string,
    description: PropTypes.string,
  }),
};

Album.defaultProps = {
  album: {
    id: 0,
    title: 'Untitled Album',
    coverUrl: '/default-album.png',
    description: 'Album',
  },
};

export default Album;

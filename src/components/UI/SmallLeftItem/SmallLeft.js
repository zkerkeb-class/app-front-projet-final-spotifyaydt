import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './SmallLeft.module.scss';
import { FaPlay, FaPause } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { mockTracks } from '../../../constant/mockData';

const SmallLeftItem = ({ playlist = {}, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const { handlePlay, isPlaying, activeCardId } = useAudioPlayer();

  const isThisPlaying = isPlaying && activeCardId === playlist.id;

  const handleImageError = () => {
    setImageError(true);
  };

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      navigate(`/playlist/${playlist.id}`);
    },
    [navigate, playlist.id]
  );

  const handlePlayClick = useCallback(
    (e) => {
      e.stopPropagation();

      // Get all tracks from this playlist in the correct order
      const playlistTracks = playlist.tracks
        .map((trackId) => mockTracks.find((track) => track.id === trackId))
        .filter(Boolean);

      if (playlistTracks.length === 0) {
        console.warn(`No tracks found for playlist: ${playlist.title}`);
        return;
      }

      // Play the first track but include all playlist tracks
      handlePlay({
        track: playlistTracks[0],
        tracks: playlistTracks,
        action: isThisPlaying ? 'pause' : 'play',
      });
    },
    [playlist, handlePlay, isThisPlaying]
  );

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.imageContainer}>
        <img
          src={imageError ? '/default-playlist.png' : playlist.coverUrl}
          alt={playlist.title}
          className={styles.image}
          onError={handleImageError}
          loading="lazy"
          title={
            <div className={styles.content}>
              <span className={styles.title}>{playlist.title}</span>
              <p className={styles.artist}>{playlist.description}</p>
            </div>
          }
        />
        <button
          className={styles.playButton}
          onClick={handlePlayClick}
          aria-label={`Play ${playlist.title}`}
        >
          {isThisPlaying ? <FaPause /> : <FaPlay />}
        </button>
      </div>
    </div>
  );
};

SmallLeftItem.propTypes = {
  playlist: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    coverUrl: PropTypes.string,
    description: PropTypes.string,
  }),
  onClick: PropTypes.func,
};

SmallLeftItem.defaultProps = {
  playlist: {
    id: 0,
    title: 'Untitled Playlist',
    coverUrl: '/default-playlist.png',
    description: 'Playlist',
  },
  onClick: () => {},
};

export default SmallLeftItem;

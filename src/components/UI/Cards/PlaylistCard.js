import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './Cards.module.scss';
import { FaPlay, FaPause } from 'react-icons/fa';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { mockTracks } from '../../../constant/mockData';

const PlaylistCard = ({ playlist }) => {
  const navigate = useNavigate();
  const { handlePlay, isPlaying, activeCardId } = useAudioPlayer();

  // Check if this specific playlist is the active source of playback
  const isThisPlaying = isPlaying && activeCardId === playlist.id;

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
          src={playlist.coverUrl}
          alt={playlist.title}
          className={styles.image}
          loading="lazy"
        />
        <button
          className={`${styles.playButton} ${isThisPlaying ? styles.visible : ''}`}
          onClick={handlePlayClick}
          aria-label={
            isThisPlaying
              ? `Pause playlist: ${playlist.title}`
              : `Play playlist: ${playlist.title}`
          }
        >
          {isThisPlaying ? <FaPause /> : <FaPlay />}
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
    tracks: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
};

export default PlaylistCard;

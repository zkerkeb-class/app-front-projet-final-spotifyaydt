import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import styles from './Cards.module.scss';
import { FaPlay, FaPause } from 'react-icons/fa';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import CardFallbackIcon from '../CardFallbackIcon/CardFallbackIcon';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import { api } from '../../../services/api';
import { useApi } from '../../../hooks/useApi';

const PlaylistCard = ({ playlist }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { handlePlay, isPlaying, activeCardId } = useAudioPlayer();

  const { data: tracks } = useApi(() => api.tracks.getAll(), []);

  // Check if this specific playlist is the active source of playback
  const isThisPlaying = isPlaying && activeCardId === playlist._id;

  const handleCardClick = useCallback(
    (e) => {
      // Don't navigate if clicking the play button
      if (e.target.closest(`.${styles.playButton}`)) {
        return;
      }
      navigate(`/playlist/${playlist._id}`);
    },
    [navigate, playlist._id]
  );

  const handlePlayClick = useCallback(
    (e) => {
      e.preventDefault(); // Prevent any navigation
      e.stopPropagation(); // Stop event bubbling

      const playlistTracks =
        tracks?.filter((track) => playlist.tracks.includes(track._id)) || [];

      if (playlistTracks.length === 0) {
        console.warn(`No tracks found for playlist: ${playlist.title}`);
        return;
      }

      handlePlay({
        track: playlistTracks[0],
        tracks: playlistTracks,
        action: isThisPlaying ? 'pause' : 'play',
      });
    },
    [playlist, tracks, handlePlay, isThisPlaying]
  );

  return (
    <div
      className={styles.card}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={t('common.playlist')}
    >
      <div className={styles.imageContainer}>
        {playlist.coverUrl ? (
          <OptimizedImage
            src={playlist.coverUrl}
            alt={t('common.playlistCover', { title: playlist.title })}
            className={styles.image}
            sizes="(max-width: 768px) 150px, 200px"
            loading="lazy"
          />
        ) : (
          <CardFallbackIcon type="playlist" />
        )}
        <button
          className={`${styles.playButton} ${isThisPlaying ? styles.visible : ''}`}
          onClick={handlePlayClick}
          aria-label={
            isThisPlaying
              ? t('common.pausePlaylist', { title: playlist.title })
              : t('common.playPlaylist', { title: playlist.title })
          }
        >
          {isThisPlaying ? <FaPause /> : <FaPlay />}
        </button>
      </div>
      <div className={styles.content}>
        <span className={styles.title}>{playlist.name}</span>
        <p className={styles.owner}>
          {t('common.by')} {playlist.owner}
        </p>
      </div>
    </div>
  );
};

PlaylistCard.propTypes = {
  playlist: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    coverUrl: PropTypes.string,
    owner: PropTypes.string.isRequired,
    tracks: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
};

export default PlaylistCard;

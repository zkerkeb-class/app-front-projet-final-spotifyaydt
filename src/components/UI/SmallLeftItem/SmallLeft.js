import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './SmallLeft.module.scss';
import { FaPlay, FaPause } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { useTranslation } from 'react-i18next';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import CardFallbackIcon from '../CardFallbackIcon/CardFallbackIcon';
import { api } from '../../../services/api';
import { useApi } from '../../../hooks/useApi';

const SmallLeftItem = ({ playlist = {}, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const { handlePlay, isPlaying, activeCardId } = useAudioPlayer();
  const { t } = useTranslation();

  const { data: tracks } = useApi(() => api.tracks.getAll(), []);

  const isThisPlaying = isPlaying && activeCardId === playlist._id;

  const handleImageError = () => {
    setImageError(true);
  };

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      navigate(`/playlist/${playlist._id}`);
    },
    [navigate, playlist._id]
  );

  const handlePlayClick = useCallback(
    (e) => {
      e.stopPropagation();

      const playlistTracks =
        tracks?.filter((track) => playlist.tracks.includes(track._id)) || [];

      if (playlistTracks.length === 0) {
        console.warn(`No tracks found for playlist: ${playlist.name}`);
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
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.imageContainer}>
        {!imageError && playlist.coverUrl ? (
          <OptimizedImage
            src={playlist.coverUrl}
            alt={t('common.playlistCover', { title: playlist.name })}
            className={styles.image}
            sizes="(max-width: 768px) 40px, 50px"
            loading="lazy"
            onError={handleImageError}
          />
        ) : (
          <CardFallbackIcon type="playlist" />
        )}
        <button
          className={styles.playButton}
          onClick={handlePlayClick}
          aria-label={
            isThisPlaying
              ? t('common.pausePlaylist', { title: playlist.name })
              : t('common.playPlaylist', { title: playlist.name })
          }
        >
          {isThisPlaying ? <FaPause /> : <FaPlay />}
        </button>
      </div>
    </div>
  );
};

SmallLeftItem.propTypes = {
  playlist: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    coverUrl: PropTypes.string,
    description: PropTypes.string,
    tracks: PropTypes.arrayOf(PropTypes.string),
  }),
  onClick: PropTypes.func,
};

SmallLeftItem.defaultProps = {
  playlist: {
    _id: '',
    name: 'Untitled Playlist',
    coverUrl: '/default-playlist.png',
    description: 'Playlist',
    tracks: [],
  },
  onClick: () => {},
};

export default SmallLeftItem;

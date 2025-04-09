import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './SideItem.module.scss';
import { FaPlay, FaPause } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { useTranslation } from 'react-i18next';
import OptimizedImage from '../../OptimizedImage/OptimizedImage';
import { api } from '../../../services/api';
import { useApi } from '../../../hooks/useApi';

const Album = ({ album, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const { handlePlay, isPlaying, activeCardId } = useAudioPlayer();
  const { t } = useTranslation();

  const { data: tracks } = useApi(() => api.tracks.getAll(), []);

  const isThisPlaying = isPlaying && activeCardId === album._id;

  const handleImageError = () => {
    setImageError(true);
  };

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      navigate(`/album/${album._id}`);
    },
    [navigate, album._id]
  );

  const handlePlayClick = useCallback(
    (e) => {
      e.stopPropagation();

      const albumTracks =
        tracks
          ?.filter((track) => track.album._id === album._id)
          .sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0)) || [];

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
    [album, tracks, handlePlay, isThisPlaying]
  );

  return (
    <Link
      to={`/album/${album._id}`}
      className={styles.card}
      onClick={handleClick}
    >
      <div className={styles.imageContainer}>
        {!imageError ? (
          <OptimizedImage
            src={album.coverImage}
            alt={t('common.albumCover', { title: album.title })}
            className={styles.image}
            sizes="(max-width: 768px) 50px, 64px"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <img
            src="/default-album.png"
            alt={t('common.albumCover', { title: album.title })}
            className={styles.image}
          />
        )}
        <button
          className={styles.playButton}
          onClick={handlePlayClick}
          aria-label={
            isThisPlaying
              ? t('common.pauseAlbum', { title: album.title })
              : t('common.playAlbum', { title: album.title })
          }
        >
          {isThisPlaying ? <FaPause /> : <FaPlay />}
        </button>
      </div>
      <div className={styles.content}>
        <span className={styles.title}>{album.title}</span>
        <p className={styles.artist}>{album.artist}</p>
      </div>
    </Link>
  );
};

Album.propTypes = {
  album: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    coverImage: PropTypes.string,
    artist: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
      }),
    ]),
  }),
};

Album.defaultProps = {
  album: {
    _id: '',
    title: 'Untitled Album',
    coverImage: '/default-album.png',
    artist: 'Unknown Artist',
  },
};

export default Album;

import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './Cards.module.scss';
import { FaPlay, FaPause } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import CardFallbackIcon from '../CardFallbackIcon/CardFallbackIcon';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import { api } from '../../../services/api';
import { useApi } from '../../../hooks/useApi';

const TrackCard = ({ track = {}, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const { handlePlay, isPlaying, activeCardId } = useAudioPlayer();
  const { t } = useTranslation();

  const { data: tracks } = useApi(() => api.tracks.getAll(), []);

  const isThisPlaying = isPlaying && activeCardId === track._id;

  const handleImageError = () => {
    setImageError(true);
  };

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      navigate(`/track/${track._id}`);
    },
    [navigate, track._id]
  );

  const handlePlayClick = useCallback(
    (e) => {
      e.stopPropagation();
      handlePlay({
        track,
        tracks: tracks || [],
        action: isThisPlaying ? 'pause' : 'play',
      });
    },
    [track, tracks, handlePlay, isThisPlaying]
  );

  const formatDuration = (duration) => {
    if (!duration) return '0:00';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Helper function to safely get artist name
  const getArtistName = () => {
    if (!track.artist) return t('common.unknownArtist');
    if (typeof track.artist === 'string') return track.artist;
    if (track.artist._id) return track.artist.name || t('common.unknownArtist');
    return track.artist.name || t('common.unknownArtist');
  };

  // Helper function to safely get album title
  const getAlbumTitle = () => {
    if (!track.album) return t('common.unknownAlbum');
    if (typeof track.album === 'string') return track.album;
    if (track.album._id) return track.album.title || t('common.unknownAlbum');
    return track.album.title || t('common.unknownAlbum');
  };

  // If track is not provided or missing required data, don't render anything
  if (!track || !track.title) {
    return null;
  }

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.imageContainer}>
        {!imageError ? (
          <OptimizedImage
            src={track.coverImage}
            alt={t('common.trackCover', { title: track.title })}
            className={styles.image}
            sizes="(max-width: 768px) 40px, 50px"
            loading="lazy"
            onError={handleImageError}
          />
        ) : (
          <CardFallbackIcon type="track" />
        )}
        <button
          className={styles.playButton}
          onClick={handlePlayClick}
          aria-label={
            isThisPlaying
              ? t('common.pauseTrack', { title: track.title })
              : t('common.playTrack', { title: track.title })
          }
        >
          {isThisPlaying ? <FaPause /> : <FaPlay />}
        </button>
      </div>
      <div className={styles.content}>
        <span className={styles.title}>
          {track.title || t('common.unknownTitle')}
        </span>
        <p className={styles.artist}>{getArtistName()}</p>
        <p className={styles.duration}>{formatDuration(track.duration)}</p>
      </div>
    </div>
  );
};

TrackCard.propTypes = {
  track: PropTypes.shape({
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
    album: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        _id: PropTypes.string,
        title: PropTypes.string,
      }),
    ]),
    duration: PropTypes.number,
  }),
  onClick: PropTypes.func,
};

TrackCard.defaultProps = {
  track: {
    _id: '',
    title: 'Untitled Track',
    coverImage: '/default-track.png',
    artist: {
      name: 'Unknown Artist',
    },
    album: {
      title: 'Unknown Album',
    },
    duration: 0,
  },
  onClick: () => {},
};

export default TrackCard;

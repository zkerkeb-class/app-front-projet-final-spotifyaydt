import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './SideItem.module.scss';
import { FaPlay, FaPause } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { useTranslation } from 'react-i18next';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import { api } from '../../../services/api';
import { useApi } from '../../../hooks/useApi';

const Artist = ({ artist, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const { handlePlay, isPlaying, activeCardId } = useAudioPlayer();
  const { t } = useTranslation();

  const { data: tracks } = useApi(() => api.tracks.getAll(), []);

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

      const artistTracks =
        tracks
          ?.filter((track) => track.artist.name === artist.name)
          .sort((a, b) => b.playCount - a.playCount) || [];

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
    [artist, tracks, handlePlay, isThisPlaying]
  );

  return (
    <Link
      to={`/artist/${artist.id}`}
      className={styles.card}
      onClick={handleClick}
    >
      <div className={`${styles.imageContainer} ${styles.roundImage}`}>
        {!imageError ? (
          <OptimizedImage
            src={artist.imageUrl}
            alt={t('common.artistPhoto', { name: artist.name })}
            className={styles.image}
            sizes="(max-width: 768px) 50px, 64px"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <img
            src="/default-artist.png"
            alt={t('common.artistPhoto', { name: artist.name })}
            className={styles.image}
          />
        )}
        <button
          className={styles.playButton}
          onClick={handlePlayClick}
          aria-label={
            isThisPlaying
              ? t('common.pauseArtist', { name: artist.name })
              : t('common.playArtist', { name: artist.name })
          }
        >
          {isThisPlaying ? <FaPause /> : <FaPlay />}
        </button>
      </div>
      <div className={styles.content}>
        <span className={styles.title}>{artist.name}</span>
        <p className={styles.artist}>
          {t('common.followerCount', { count: artist.followers })}
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

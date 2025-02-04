import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './Cards.module.scss';
import { FaPlay, FaPause } from 'react-icons/fa';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { mockTracks } from '../../../constant/mockData';
import CardFallbackIcon from '../CardFallbackIcon/CardFallbackIcon';

const AlbumCard = ({ album }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { handlePlay, isPlaying, activeCardId } = useAudioPlayer();

  // Check if this specific album is the active source of playback
  const isThisPlaying = isPlaying && activeCardId === album.id;

  const handleCardClick = useCallback(
    (e) => {
      // Don't navigate if clicking the play button
      if (e.target.closest(`.${styles.playButton}`)) {
        return;
      }
      navigate(`/album/${album.id}`);
    },
    [navigate, album.id]
  );

  const handlePlayClick = useCallback(
    (e) => {
      e.preventDefault(); // Prevent any navigation
      e.stopPropagation(); // Stop event bubbling

      // Get all tracks from this album in order
      const albumTracks = mockTracks
        .filter((track) => track.album === album.title)
        .sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0));

      if (albumTracks.length === 0) {
        console.warn(`No tracks found for album: ${album.title}`);
        return;
      }

      // Play the first track but include all album tracks in the playlist
      handlePlay({
        track: albumTracks[0],
        tracks: albumTracks,
        action: isThisPlaying ? 'pause' : 'play',
      });
    },
    [album, handlePlay, isThisPlaying]
  );

  return (
    <div
      className={styles.card}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={t('common.album')}
    >
      <div className={styles.imageContainer}>
        {album.coverUrl ? (
          <img
            src={album.coverUrl}
            alt={t('common.albumCover', { title: album.title })}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <CardFallbackIcon type="album" />
        )}
        <button
          className={`${styles.playButton} ${isThisPlaying ? styles.visible : ''}`}
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
        <p className={styles.year}>{album.year}</p>
      </div>
    </div>
  );
};

export default AlbumCard;

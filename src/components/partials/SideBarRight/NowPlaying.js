import React, { useState } from 'react';
import styles from './Sidebar.module.scss';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { IoPlayCircleOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import OptimizedImage from '../../UI/OptimizedImage/OptimizedImage';
import CardFallbackIcon from '../../UI/CardFallbackIcon/CardFallbackIcon';

const NowPlaying = () => {
  const { currentTrack } = useAudioPlayer();
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);

  // Helper functions to safely get names
  const getArtistName = () => {
    if (!currentTrack.artist) return t('common.unknownArtist');
    if (typeof currentTrack.artist === 'string') return currentTrack.artist;
    return currentTrack.artist.name || t('common.unknownArtist');
  };

  const getAlbumTitle = () => {
    if (!currentTrack.album) return t('common.unknownAlbum');
    if (typeof currentTrack.album === 'string') return currentTrack.album;
    return currentTrack.album.title || t('common.unknownAlbum');
  };

  if (!currentTrack) {
    return (
      <div className={styles.nowPlaying}>
        <div className={styles.nowPlaying__empty}>
          <span>{t('player.emptyQueue')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.nowPlaying}>
      <div className={styles.nowPlaying__track}>
        {!imageError && currentTrack.coverImage ? (
          <OptimizedImage
            src={currentTrack.coverImage}
            alt={t('common.coverArt', { title: currentTrack.title })}
            className={styles.nowPlaying__track__cover}
            sizes="(max-width: 768px) 64px, 96px"
            loading="eager"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={styles.nowPlaying__track__fallback}>
            <CardFallbackIcon type="track" />
          </div>
        )}
        <div className={styles.nowPlaying__track__info}>
          <h3>{currentTrack.title}</h3>
          <div className={styles.nowPlaying__track__info__title__artist}>
            <p>{getArtistName()}</p>
            <p>{getAlbumTitle()}</p>
          </div>
          <div className={styles.nowPlaying__track__info__buttons}>
            <button>
              <IoPlayCircleOutline />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;

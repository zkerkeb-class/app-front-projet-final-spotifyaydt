import React from 'react';
import styles from './Sidebar.module.scss';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { IoPlayCircleOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

const NowPlaying = () => {
  const { currentTrack } = useAudioPlayer();
  const { t } = useTranslation();

  if (!currentTrack) {
    return (
      <div className={styles.nowPlaying}>
        <div className={styles.nowPlaying__empty}>
          <span>{t('player.emptyPlay')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.nowPlaying}>
      <div className={styles.nowPlaying__track}>
        <img
          src={currentTrack.coverUrl}
          alt={`${currentTrack.title} cover`}
          className={styles.nowPlaying__track__cover}
        />
        <div className={styles.nowPlaying__track__info}>
          <h3>{currentTrack.title}</h3>
          <div className={styles.nowPlaying__track__info__title__artist}>
            <p>{currentTrack.artist}</p>
            <p>{currentTrack.album}</p>
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

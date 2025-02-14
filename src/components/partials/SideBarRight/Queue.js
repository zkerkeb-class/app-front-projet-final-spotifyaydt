import React, { useState } from 'react';
import styles from './Sidebar.module.scss';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { useTranslation } from 'react-i18next';
import OptimizedImage from '../../UI/OptimizedImage/OptimizedImage';
import CardFallbackIcon from '../../UI/CardFallbackIcon/CardFallbackIcon';

const QueueItem = ({ track }) => {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);

  // Helper function to safely get artist name
  const getArtistName = (track) => {
    if (!track.artist) return t('common.unknownArtist');
    if (typeof track.artist === 'string') return track.artist;
    if (track.artist._id) return track.artist.name || t('common.unknownArtist');
    return track.artist.name || t('common.unknownArtist');
  };

  return (
    <div className={styles.queue__item}>
      {!imageError && track.coverImage ? (
        <OptimizedImage
          src={track.coverImage}
          alt={t('common.coverArt', { title: track.title })}
          className={styles.queue__item__cover}
          sizes="(max-width: 768px) 48px, 64px"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={styles.queue__item__fallback}>
          <CardFallbackIcon type="track" />
        </div>
      )}
      <div className={styles.queue__item__info}>
        <span className={styles.queue__item__info__title}>{track.title}</span>
        <span className={styles.queue__item__info__artist}>
          {getArtistName(track)}
        </span>
      </div>
    </div>
  );
};

const Queue = () => {
  const { currentTracks, currentTrackIndex } = useAudioPlayer();
  const { t } = useTranslation();

  const upcomingTracks = currentTracks.slice(currentTrackIndex + 1);

  return (
    <div className={styles.queue}>
      <div className={styles.queue__section}>
        <h3 className={styles.queue__section__title}>
          {t('player.nowPlaying')}
        </h3>
        {currentTracks[currentTrackIndex] && (
          <QueueItem track={currentTracks[currentTrackIndex]} />
        )}
      </div>

      <div className={styles.queue__section}>
        <h3 className={styles.queue__section__title}>{t('player.upNext')}</h3>
        {upcomingTracks.length === 0 ? (
          <p className={styles.queue__empty}>{t('player.emptyQueue')}</p>
        ) : (
          upcomingTracks.map((track) => (
            <QueueItem key={track._id} track={track} />
          ))
        )}
      </div>
    </div>
  );
};

export default Queue;

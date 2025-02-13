import React from 'react';
import styles from './Jam.module.scss';
import { useQueue } from '../../../contexts/QueueContext';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { IoClose } from 'react-icons/io5';
import { MdDragIndicator } from 'react-icons/md';
import { BsPlayFill } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import OptimizedImage from '../../UI/OptimizedImage/OptimizedImage';

const QueueItem = ({ track, index }) => {
  const { removeFromQueue, skipToTrack, isHost } = useQueue();
  const { currentTrack } = useAudioPlayer();
  const { t } = useTranslation();

  // Helper function to safely get artist name
  const getArtistName = (track) => {
    if (!track.artist) return t('common.unknownArtist');
    if (typeof track.artist === 'string') return track.artist;
    if (track.artist._id) return track.artist.name || t('common.unknownArtist');
    return track.artist.name || t('common.unknownArtist');
  };

  const isPlaying = currentTrack?.id === track.id;

  return (
    <div
      className={`${styles.queueItem} ${isPlaying ? styles.queueItem__playing : ''}`}
    >
      <div className={styles.queueItem__drag}>
        <MdDragIndicator />
      </div>

      <div className={styles.queueItem__cover}>
        <OptimizedImage
          src={track.coverImage}
          alt={t('common.coverArt', { title: track.title })}
          className={styles.image}
          sizes="(max-width: 768px) 40px, 48px"
          loading="lazy"
        />
        {isPlaying && (
          <div className={styles.queueItem__cover__playing}>
            <BsPlayFill />
          </div>
        )}
      </div>

      <div className={styles.queueItem__info}>
        <span className={styles.queueItem__info__title}>{track.title}</span>
        <span className={styles.queueItem__info__artist}>
          {getArtistName(track)}
        </span>
      </div>

      <div className={styles.queueItem__actions}>
        <span className={styles.queueItem__actions__time}>
          {new Date(track.addedAt).toLocaleTimeString()}
        </span>
        {isHost && (
          <button
            className={styles.queueItem__actions__remove}
            onClick={() => removeFromQueue(track.id)}
            aria-label={t('common.removeTrack', { title: track.title })}
          >
            <IoClose />
          </button>
        )}
      </div>
    </div>
  );
};

const Queue = () => {
  const { queue, history, clearQueue, isHost } = useQueue();
  const { currentTrack } = useAudioPlayer();
  const { t } = useTranslation();

  return (
    <div className={styles.queue}>
      {currentTrack && (
        <div className={styles.queue__section}>
          <div className={styles.queue__section__header}>
            <h3>{t('player.nowPlaying')}</h3>
          </div>
          <QueueItem track={currentTrack} />
        </div>
      )}

      <div className={styles.queue__section}>
        <div className={styles.queue__section__header}>
          <h3>{t('player.upNext')}</h3>
          <span className={styles.queue__section__count}>
            {t('common.trackCount', { count: queue.length })}
          </span>
          {isHost && queue.length > 0 && (
            <button
              className={styles.queue__section__clear}
              onClick={clearQueue}
              aria-label={t('common.clearQueue')}
            >
              {t('common.clear')}
            </button>
          )}
        </div>
        <div className={styles.queue__section__content}>
          {queue.length === 0 ? (
            <p className={styles.queue__empty}>{t('player.emptyQueue')}</p>
          ) : (
            queue.map((track, index) => (
              <QueueItem key={track.id} track={track} index={index} />
            ))
          )}
        </div>
      </div>

      {history.length > 0 && (
        <div className={styles.queue__section}>
          <div className={styles.queue__section__header}>
            <h3>{t('common.history')}</h3>
            <span className={styles.queue__section__count}>
              {t('common.trackCount', { count: history.length })}
            </span>
          </div>
          <div className={styles.queue__section__content}>
            {history
              .slice()
              .reverse()
              .map((track, index) => (
                <QueueItem
                  key={`${track.id}-${index}`}
                  track={track}
                  index={index}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Queue;

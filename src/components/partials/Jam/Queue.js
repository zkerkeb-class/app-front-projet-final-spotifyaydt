import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Jam.module.scss';
import OptimizedImage from '../../UI/OptimizedImage/OptimizedImage';
import CardFallbackIcon from '../../UI/CardFallbackIcon/CardFallbackIcon';
import { BsMusicNoteBeamed } from 'react-icons/bs';
import { IoPauseCircle, IoPlayCircle } from 'react-icons/io5';

const QueueItem = ({ track, isPlaying, onPlay, onPause, isHost }) => {
  const { t } = useTranslation();

  const getArtistName = (track) => {
    if (!track?.artist) return t('common.unknownArtist');
    if (typeof track.artist === 'string') return track.artist;
    if (track.artist._id) return track.artist.name || t('common.unknownArtist');
    return track.artist.name || t('common.unknownArtist');
  };

  const handlePlayPause = (e) => {
    e.stopPropagation();
    if (isPlaying) {
      onPause();
    } else {
      onPlay(track);
    }
  };

  return (
    <div className={styles.queue__item}>
      <div className={styles.queue__item__artwork}>
        {track.coverUrl ? (
          <OptimizedImage
            src={track.coverUrl}
            alt={t('common.coverArt', { title: track.title })}
            className={styles.coverImage}
            sizes="48px"
            loading="lazy"
          />
        ) : (
          <div className={styles.fallback}>
            <BsMusicNoteBeamed />
          </div>
        )}
      </div>
      <div className={styles.queue__item__info}>
        <span className={`${styles.title} ${isPlaying ? styles.playing : ''}`}>
          {track.title}
        </span>
        <span className={styles.artist}>{getArtistName(track)}</span>
      </div>
      {isHost && (
        <button
          className={styles.playButton}
          onClick={handlePlayPause}
          aria-label={isPlaying ? t('common.pause') : t('common.play')}
        >
          {isPlaying ? <IoPauseCircle /> : <IoPlayCircle />}
        </button>
      )}
    </div>
  );
};

const Queue = ({ queue = [], onAddTrack, onControlTrack, isHost }) => {
  const { t } = useTranslation();

  const handlePlay = (track) => {
    onControlTrack({ type: 'PLAY', track });
  };

  const handlePause = () => {
    onControlTrack({ type: 'PAUSE' });
  };

  if (queue.length === 0) {
    return (
      <div className={styles.queue__empty}>
        <p>{t('player.emptyQueue')}</p>
      </div>
    );
  }

  return (
    <div className={styles.queue}>
      {queue.map((track, index) => (
        <QueueItem
          key={`${track._id}-${index}`}
          track={track}
          isPlaying={track.isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          isHost={isHost}
        />
      ))}
    </div>
  );
};

export default Queue;

import React from 'react';
import styles from './Jam.module.scss';
import { useQueue } from '../../../contexts/QueueContext';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { IoClose } from 'react-icons/io5';
import { MdDragIndicator } from 'react-icons/md';
import { BsPlayFill } from 'react-icons/bs';

const QueueItem = ({ track, index }) => {
  const { removeFromQueue, skipToTrack, isHost } = useQueue();
  const { currentTrack } = useAudioPlayer();

  const isPlaying = currentTrack?.id === track.id;

  return (
    <div
      className={`${styles.queueItem} ${isPlaying ? styles.queueItem__playing : ''}`}
    >
      <div className={styles.queueItem__drag}>
        <MdDragIndicator />
      </div>

      <div className={styles.queueItem__cover}>
        <img src={track.coverUrl} alt={track.title} />
        {isPlaying && (
          <div className={styles.queueItem__cover__playing}>
            <BsPlayFill />
          </div>
        )}
      </div>

      <div className={styles.queueItem__info}>
        <span className={styles.queueItem__info__title}>{track.title}</span>
        <span className={styles.queueItem__info__artist}>{track.artist}</span>
      </div>

      <div className={styles.queueItem__actions}>
        <span className={styles.queueItem__actions__time}>
          {new Date(track.addedAt).toLocaleTimeString()}
        </span>
        {isHost && (
          <button
            className={styles.queueItem__actions__remove}
            onClick={() => removeFromQueue(track.id)}
            aria-label={`Remove ${track.title} from queue`}
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

  return (
    <div className={styles.queue}>
      {currentTrack && (
        <div className={styles.queue__section}>
          <div className={styles.queue__section__header}>
            <h3>Now Playing</h3>
          </div>
          <QueueItem track={currentTrack} />
        </div>
      )}

      <div className={styles.queue__section}>
        <div className={styles.queue__section__header}>
          <h3>Next Up</h3>
          <span className={styles.queue__section__count}>
            {queue.length} tracks
          </span>
          {isHost && queue.length > 0 && (
            <button
              className={styles.queue__section__clear}
              onClick={clearQueue}
            >
              Clear
            </button>
          )}
        </div>
        <div className={styles.queue__section__content}>
          {queue.length === 0 ? (
            <p className={styles.queue__empty}>No tracks in queue</p>
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
            <h3>History</h3>
            <span className={styles.queue__section__count}>
              {history.length} tracks
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

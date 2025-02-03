import React from 'react';
import styles from './Sidebar.module.scss';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';

const Queue = () => {
  const { currentTracks, currentTrackIndex } = useAudioPlayer();

  const upcomingTracks = currentTracks.slice(currentTrackIndex + 1);

  return (
    <div className={styles.queue}>
      <div className={styles.queue__section}>
        <h3 className={styles.queue__section__title}>Now Playing</h3>
        {currentTracks[currentTrackIndex] && (
          <div className={styles.queue__item}>
            <img
              src={currentTracks[currentTrackIndex].coverUrl}
              alt={currentTracks[currentTrackIndex].title}
              className={styles.queue__item__cover}
            />
            <div className={styles.queue__item__info}>
              <span className={styles.queue__item__info__title}>
                {currentTracks[currentTrackIndex].title}
              </span>
              <span className={styles.queue__item__info__artist}>
                {currentTracks[currentTrackIndex].artist}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.queue__section}>
        <h3 className={styles.queue__section__title}>Next Up</h3>
        {upcomingTracks.length === 0 ? (
          <p className={styles.queue__empty}>No upcoming tracks</p>
        ) : (
          upcomingTracks.map((track, index) => (
            <div key={track.id} className={styles.queue__item}>
              <img
                src={track.coverUrl}
                alt={track.title}
                className={styles.queue__item__cover}
              />
              <div className={styles.queue__item__info}>
                <span className={styles.queue__item__info__title}>
                  {track.title}
                </span>
                <span className={styles.queue__item__info__artist}>
                  {track.artist}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Queue;

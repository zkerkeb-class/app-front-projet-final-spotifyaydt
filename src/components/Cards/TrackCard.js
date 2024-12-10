import React from 'react';
import styles from './Cards.module.scss';

const TrackCard = ({ track }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={track.coverUrl} alt={track.title} className={styles.image} />
        <button className={styles.playButton}>▶</button>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{track.title}</h3>
        <p className={styles.artist}>{track.artist}</p>
      </div>
    </div>
  );
};

export default TrackCard;

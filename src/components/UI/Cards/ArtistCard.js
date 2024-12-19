import React from 'react';
import styles from './Cards.module.scss';

const ArtistCard = ({ artist }) => {
  return (
    <div className={`${styles.card} ${styles.artistCard}`}>
      <div className={styles.imageContainer}>
        <img
          src={artist.imageUrl}
          alt={artist.name}
          className={`${styles.image} ${styles.artistImage}`}
        />
        <button className={styles.playButton}>▶</button>
      </div>
      <div className={styles.content}>
        <span className={styles.title}>{artist.name}</span>
        <p className={styles.followers}>{artist.followers} followers</p>
      </div>
    </div>
  );
};

export default ArtistCard;

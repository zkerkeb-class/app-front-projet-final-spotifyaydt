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
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{artist.name}</h3>
        <p className={styles.followers}>{artist.followers} followers</p>
      </div>
    </div>
  );
};

export default ArtistCard;

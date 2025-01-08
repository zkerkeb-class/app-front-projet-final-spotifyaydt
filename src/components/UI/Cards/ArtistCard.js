import React from 'react';
import styles from './Cards.module.scss';

import { FaPlay } from 'react-icons/fa6';

const ArtistCard = ({ artist }) => {
  return (
    <div className={`${styles.card} ${styles.artistCard}`}>
      <div className={styles.artistImageContainer}>
        <img
          src={artist.imageUrl}
          alt={artist.name}
          className={`${styles.image} ${styles.artistImage}`}
        />
        <button className={styles.playButton}>
          <FaPlay />
        </button>
      </div>
      <div className={styles.content}>
        <span className={styles.title}>{artist.name}</span>
        <p className={styles.followers}>{artist.followers} followers</p>
      </div>
    </div>
  );
};

export default ArtistCard;

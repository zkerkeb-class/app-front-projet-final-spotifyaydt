import React from 'react';
import styles from './Cards.module.scss';

const AlbumCard = ({ album }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={album.coverUrl} alt={album.title} className={styles.image} />
        <button className={styles.playButton}>▶</button>
      </div>
      <div className={styles.content}>
        <span className={styles.title}>{album.title}</span>
        <p className={styles.artist}>{album.artist}</p>
        <p className={styles.year}>{album.year}</p>
      </div>
    </div>
  );
};

export default AlbumCard;

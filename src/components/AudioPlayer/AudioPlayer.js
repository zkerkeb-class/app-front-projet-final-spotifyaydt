import React from 'react';
import styles from './AudioPlayer.module.scss';

const AudioPlayer = () => {
  return (
    <div className={styles.player}>
      <button className={styles.player__button}>Play</button>
    </div>
  );
};

export default AudioPlayer;

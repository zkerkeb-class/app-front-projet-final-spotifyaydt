import React from 'react';
import style from './WaveformAnimation.module.scss';

const WaveformAnimation = () => {
  return (
    <div className={style.waveform} aria-label="Now playing">
      <div className={style.waveform__bar} />
      <div className={style.waveform__bar} />
      <div className={style.waveform__bar} />
      <div className={style.waveform__bar} />
    </div>
  );
};

export default WaveformAnimation;

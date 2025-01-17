import React from 'react';
import style from './AudioPlayer.module.scss';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';

// Importing icons
import { PiShuffleBold } from 'react-icons/pi';
import { BiRepeat } from 'react-icons/bi';
import {
  IoPlayCircle,
  IoPauseCircle,
  IoPlaySkipForward,
  IoPlaySkipBack,
} from 'react-icons/io5';

const Controls = () => {
  const {
    isPlaying,
    togglePlayPause,
    currentTime,
    duration,
    handleSeek,
    formatTime,
  } = useAudioPlayer();

  return (
    //Player controls
    <div className={style.player__controls}>
      <div className={style.player__controls__buttons}>
        <div className={style.player__controls__buttons__left}>
          <button className={style.controlsButton}>
            <PiShuffleBold
              className={style.player__controls__buttons__left__shuffle}
            />
          </button>
          <button className={style.controlsButton}>
            <IoPlaySkipBack
              className={style.player__controls__buttons__left__backward}
            />
          </button>
        </div>
        <div className={style.player__controls__buttons__center}>
          <button onClick={togglePlayPause}>
            {isPlaying ? (
              <IoPauseCircle
                className={style.player__controls__buttons__center__play}
              />
            ) : (
              <IoPlayCircle
                className={style.player__controls__buttons__center__play}
              />
            )}
          </button>
        </div>
        <div className={style.player__controls__buttons__right}>
          <button className={style.controlsButton}>
            <IoPlaySkipForward
              className={style.player__controls__buttons__right__forward}
            />
          </button>
          <button className={style.controlsButton}>
            <BiRepeat
              className={style.player__controls__buttons__right__repeat}
            />
          </button>
        </div>
      </div>
      <div className={style.player__controls__progress}>
        <span>{formatTime(currentTime)}</span>
        <div
          className={style.player__controls__progress__bar}
          onClick={handleSeek}
        >
          <div
            className={style.player__controls__progress__bar__progression}
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default Controls;

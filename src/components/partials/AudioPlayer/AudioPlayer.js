import React, { useState, useRef } from 'react';
import style from './AudioPlayer.module.scss';
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';
import { PiShuffleBold } from 'react-icons/pi';
import { BiRepeat } from 'react-icons/bi';
import {
  IoPlayCircle,
  IoPauseCircle,
  IoPlaySkipForward,
  IoPlaySkipBack,
} from 'react-icons/io5';

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <div className={style.player}>
      <div className={style.player__music}>
        <div className={style.player__music__cover}>
          <img src="https://via.placeholder.com/150" alt="Cover" />
        </div>
        <div className={style.player__music__info}>
          <span className={style.player__music__info__title}>Rainbows</span>
          <span className={style.player__music__info__artist}>Artistes</span>
        </div>
      </div>
      <div className={style.player__controls}>
        <div className={style.player__controls__buttons}>
          <div className={style.player__controls__buttons__left}>
            <PiShuffleBold
              className={style.player__controls__buttons__left__shuffle}
            />
            <IoPlaySkipBack
              className={style.player__controls__buttons__left__backward}
            />
          </div>
          <div className={style.player__controls__buttons__center}>
            {isPlaying ? (
              <IoPlayCircle
                className={style.player__controls__buttons__center__play}
                onClick={() => setIsPlaying(false)}
              />
            ) : (
              <IoPauseCircle
                className={style.player__controls__buttons__center__play}
                onClick={() => setIsPlaying(true)}
              />
            )}
          </div>
          <div className={style.player__controls__buttons__right}>
            <IoPlaySkipForward
              className={style.player__controls__buttons__right__forward}
            />
            <BiRepeat
              className={style.player__controls__buttons__right__repeat}
            />
          </div>
        </div>
        <div className={style.player__controls__progress}></div>
      </div>
      <div className={style.player__options}></div>
    </div>
  );
};

export default AudioPlayer;

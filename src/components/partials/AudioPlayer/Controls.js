import React, { useState } from 'react';
import style from './AudioPlayer.module.scss';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';

// Importing icons
import { PiShuffleBold } from 'react-icons/pi';
import {
  IoPlayCircle,
  IoPauseCircle,
  IoPlaySkipForward,
  IoPlaySkipBack,
} from 'react-icons/io5';

import { GoDotFill } from 'react-icons/go';
import { TbRepeat, TbRepeatOnce } from 'react-icons/tb';

const Controls = () => {
  const {
    isPlaying,
    togglePlayPause,
    currentTime,
    duration,
    handleSeek,
    formatTime,
    shuffleOn,
    toggleShuffle,
    repeatTrack,
    repeatPlaylist,
    toggleRepeat,
  } = useAudioPlayer();

  const getShuffleIcon = () => {
    if (shuffleOn)
      return (
        <>
          <PiShuffleBold
            className={style.player__controls__buttons__left__shuffle}
            style={{ color: 'var(--accent-color)' }}
          />
          <GoDotFill className={style.buttonActive} />
        </>
      );
    return (
      <PiShuffleBold
        className={style.player__controls__buttons__left__shuffle}
      />
    );
  };

  const getRepeatIcon = () => {
    if (repeatPlaylist)
      return (
        <>
          <TbRepeat
            className={style.player__controls__buttons__right__repeat}
            style={{ color: 'var(--accent-color)' }}
          />
          <GoDotFill className={style.buttonActive} />
        </>
      );

    if (repeatTrack)
      return (
        <>
          <TbRepeatOnce
            className={style.player__controls__buttons__right__repeat}
            style={{ color: 'var(--accent-color)' }}
          />
          <GoDotFill className={style.buttonActive} />
        </>
      );

    return (
      <TbRepeat className={style.player__controls__buttons__right__repeat} />
    );
  };

  return (
    //Player controls
    <div className={style.player__controls}>
      <div className={style.player__controls__buttons}>
        <div className={style.player__controls__buttons__left}>
          <button className={style.controlsButton} onClick={toggleShuffle}>
            {getShuffleIcon()}
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
          <button className={style.controlsButton} onClick={toggleRepeat}>
            {getRepeatIcon()}
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

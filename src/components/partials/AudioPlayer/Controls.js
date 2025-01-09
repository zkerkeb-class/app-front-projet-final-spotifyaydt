import React, { useState, useRef, useEffect } from 'react';
import style from './AudioPlayer.module.scss';

// Importing icons
import { PiShuffleBold } from 'react-icons/pi';
import { BiRepeat } from 'react-icons/bi';
import {
  IoPlayCircle,
  IoPauseCircle,
  IoPlaySkipForward,
  IoPlaySkipBack,
} from 'react-icons/io5';

import Audio from '../../../assests/audio/lazy-day.mp3';

const Controls = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
    };
  }, []);

  const updateTime = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeDrag = (e) => {
    const progressBar = e.target;
    const newTime =
      (e.nativeEvent.offsetX / progressBar.offsetWidth) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

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
          onClick={handleTimeDrag}
        >
          <div
            className={style.player__controls__progress__bar__progression}
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>
        <span>{formatTime(duration)}</span>
      </div>

      <audio ref={audioRef} src={Audio} onTimeUpdate={updateTime}></audio>
    </div>
  );
};

export default Controls;

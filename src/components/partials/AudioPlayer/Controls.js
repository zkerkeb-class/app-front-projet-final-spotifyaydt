import React, { useCallback, useEffect, useRef } from 'react';
import style from './AudioPlayer.module.scss';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';

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
    previewTime,
    duration,
    handleSeek,
    handleSeekStart,
    handleSeekUpdate,
    handleSeekEnd,
    progressBarRef,
    formatTime,
    shuffleOn,
    toggleShuffle,
    repeatTrack,
    repeatPlaylist,
    toggleRepeat,
    isDragging,
    isBuffering,
    playNextTrack,
    playPreviousTrack,
    audioRef,
  } = useAudioPlayer();

  const lastClickTimeRef = useRef(0);
  const DOUBLE_CLICK_DELAY = 300;

  const handlePreviousClick = useCallback(
    (e) => {
      e.preventDefault();
      const currentTime = Date.now();
      const timeDiff = currentTime - lastClickTimeRef.current;

      if (timeDiff < DOUBLE_CLICK_DELAY) {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
        }
      } else {
        playPreviousTrack();
      }

      lastClickTimeRef.current = currentTime;
    },
    [playPreviousTrack, audioRef]
  );

  const handleNextClick = useCallback(
    (e) => {
      e.preventDefault();
      playNextTrack();
    },
    [playNextTrack]
  );

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')
        return;

      switch (e.key) {
        case 'MediaTrackNext':
        case 'n':
          if (e.ctrlKey) {
            e.preventDefault();
            playNextTrack();
          }
          break;
        case 'MediaTrackPrevious':
        case 'p':
          if (e.ctrlKey) {
            e.preventDefault();
            handlePreviousClick();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playNextTrack, handlePreviousClick]);

  const getShuffleIcon = () => {
    if (shuffleOn)
      return (
        <>
          <PiShuffleBold
            className={style.player__controls__buttons__left__shuffle}
            style={{ color: 'var(--accent-color)' }}
          />
          <GoDotFill className={style.buttonActive} aria-hidden="true" />
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
          <GoDotFill className={style.buttonActive} aria-hidden="true" />
        </>
      );

    if (repeatTrack)
      return (
        <>
          <TbRepeatOnce
            className={style.player__controls__buttons__right__repeat}
            style={{ color: 'var(--accent-color)' }}
          />
          <GoDotFill className={style.buttonActive} aria-hidden="true" />
        </>
      );

    return (
      <TbRepeat className={style.player__controls__buttons__right__repeat} />
    );
  };

  const displayTime = previewTime !== null ? previewTime : currentTime;
  const progressPercentage = duration ? (displayTime / duration) * 100 : 0;

  const handleKeyDown = useCallback(
    (e) => {
      const audio = progressBarRef.current;
      if (!audio) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handleSeek({
            clientX:
              audio.getBoundingClientRect().left +
              (Math.max(0, currentTime - 5) / duration) * audio.offsetWidth,
          });
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleSeek({
            clientX:
              audio.getBoundingClientRect().left +
              (Math.min(duration, currentTime + 5) / duration) *
                audio.offsetWidth,
          });
          break;
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        default:
          break;
      }
    },
    [currentTime, duration, handleSeek, togglePlayPause]
  );

  useEffect(() => {
    const audio = progressBarRef.current;
    if (!audio) return;

    audio.addEventListener('keydown', handleKeyDown);
    return () => audio.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const progressBar = progressBarRef.current;
      if (!progressBar || !duration || !isFinite(duration)) return;

      const rect = progressBar.getBoundingClientRect();
      const x = Math.max(rect.left, Math.min(e.clientX, rect.right));
      const width = rect.width;
      if (width === 0) return;

      const percentage = ((x - rect.left) / width) * 100;
      const newTime = (duration * percentage) / 100;

      if (handleSeek && isFinite(newTime) && newTime >= 0) {
        handleSeek(newTime);
      }
    },
    [isDragging, duration, handleSeek]
  );

  const handleMouseUp = useCallback(
    (e) => {
      e.preventDefault();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (handleSeekEnd) {
        handleSeekEnd();
      }
    },
    [handleSeekEnd, handleMouseMove]
  );

  const initializeSeek = useCallback(
    (e) => {
      e.preventDefault();
      const progressBar = progressBarRef.current;
      if (!progressBar || !duration || !isFinite(duration)) return;

      const rect = progressBar.getBoundingClientRect();
      const x = Math.max(rect.left, Math.min(e.clientX, rect.right));
      const width = rect.width;
      if (width === 0) return;

      const percentage = ((x - rect.left) / width) * 100;
      const newTime = (duration * percentage) / 100;

      if (!isFinite(newTime) || newTime < 0) return;

      if (handleSeekStart) {
        handleSeekStart();
      }
      if (handleSeek) {
        handleSeek(newTime);
      }
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [handleSeekStart, handleSeek, handleMouseMove, handleMouseUp, duration]
  );

  const handleProgressBarClick = useCallback(
    (e) => {
      if (!audioRef.current || !progressBarRef.current) return;

      const progressBar = progressBarRef.current;
      const rect = progressBar.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const progressBarWidth = progressBar.offsetWidth;
      const percentage = (offsetX / progressBarWidth) * 100;
      const newTime = (audioRef.current.duration * percentage) / 100;

      if (audioRef.current.duration) {
        audioRef.current.currentTime = newTime;
        handleSeek(newTime);
      }
    },
    [audioRef, handleSeek]
  );

  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.addEventListener('click', handleProgressBarClick);
    }

    return () => {
      if (progressBarRef.current) {
        progressBarRef.current.removeEventListener(
          'click',
          handleProgressBarClick
        );
      }
    };
  }, [handleProgressBarClick, progressBarRef]);

  return (
    <div
      className={style.player__controls}
      role="group"
      aria-label="Player controls"
    >
      <div className={style.player__controls__buttons}>
        <div className={style.player__controls__buttons__left}>
          <button
            className={style.controlsButton}
            onClick={toggleShuffle}
            aria-label={`Shuffle ${shuffleOn ? 'on' : 'off'}`}
            aria-pressed={shuffleOn}
            title={`Shuffle ${shuffleOn ? 'on' : 'off'}`}
          >
            {getShuffleIcon()}
          </button>
          <button
            className={style.controlsButton}
            onClick={handlePreviousClick}
            aria-label="Previous track (Ctrl+P)"
            title="Previous track (Ctrl+P)"
          >
            <IoPlaySkipBack
              className={style.player__controls__buttons__left__backward}
            />
          </button>
        </div>
        <div className={style.player__controls__buttons__center}>
          <button
            onClick={togglePlayPause}
            className={`${style.player__controls__buttons__center__play} ${
              isBuffering ? style.buffering : ''
            }`}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            title={isPlaying ? 'Pause' : 'Play'}
          >
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
          <button
            className={style.controlsButton}
            onClick={handleNextClick}
            aria-label="Next track (Ctrl+N)"
            title="Next track (Ctrl+N)"
          >
            <IoPlaySkipForward
              className={style.player__controls__buttons__right__forward}
            />
          </button>
          <button
            className={style.controlsButton}
            onClick={toggleRepeat}
            aria-label={`Repeat ${repeatTrack ? 'track' : repeatPlaylist ? 'playlist' : 'off'}`}
            aria-pressed={repeatTrack || repeatPlaylist}
            title={`Repeat ${repeatTrack ? 'track' : repeatPlaylist ? 'playlist' : 'off'}`}
          >
            {getRepeatIcon()}
          </button>
        </div>
      </div>

      <div
        className={style.player__controls__progress}
        role="group"
        aria-label="Playback progress"
      >
        <span aria-label="Current time">
          {formatTime(previewTime !== null ? previewTime : currentTime)}
        </span>
        <div
          ref={progressBarRef}
          className={`${style.player__controls__progress__bar} ${isDragging ? style.dragging : ''}`}
          onClick={handleSeek}
          onMouseDown={initializeSeek}
          onKeyDown={handleKeyDown}
          role="slider"
          aria-label="Seek"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={progressPercentage}
          tabIndex="0"
        >
          <div
            className={style.player__controls__progress__bar__progression}
            style={{ width: `${progressPercentage}%` }}
          >
            <div
              className={`${style.player__controls__progress__bar__progression__handle} ${isDragging ? style.active : ''}`}
              style={{
                transform: `translate(50%, -50%)`,
              }}
            />
          </div>
        </div>
        <span aria-label="Total duration">{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default Controls;

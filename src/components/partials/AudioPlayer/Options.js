import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import style from './AudioPlayer.module.scss';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import FullscreenView from '../FullscreenMode/FullscreenView';

import { BsFilePlay } from 'react-icons/bs';
import { TbMicrophone2 } from 'react-icons/tb';
import { HiOutlineQueueList } from 'react-icons/hi2';
import { PiDevicesBold } from 'react-icons/pi';
import { CgMiniPlayer } from 'react-icons/cg';
import { LuMaximize2 } from 'react-icons/lu';
import { GoDotFill } from 'react-icons/go';

const Options = () => {
  const {
    volume,
    previewVolume,
    volumeBarRef,
    isAdjustingVolume,
    handleVolumeStart,
    handleVolumeUpdate,
    handleVolumeEnd,
    handleVolumeClick,
    handleVolumeKeyDown,
    toggleMute,
    getVolumeIcon,
    displayPlay,
    toggleDisplayPlay,
    displayLyrics,
    toggleLyrics,
    displayQueue,
    toggleQueue,
    displayDevices,
    toggleDevices,
    displayMini,
    toggleMini,
    isFullscreen,
    toggleFullscreen,
  } = useAudioPlayer();

  const handleMouseMove = useCallback(
    (e) => {
      e.preventDefault();
      handleVolumeUpdate(e);
    },
    [handleVolumeUpdate]
  );

  const handleMouseUp = useCallback(
    (e) => {
      e.preventDefault();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      handleVolumeEnd(e);
    },
    [handleVolumeEnd, handleMouseMove]
  );

  const initializeVolumeAdjust = useCallback(
    (e) => {
      e.preventDefault();
      handleVolumeStart(e);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [handleVolumeStart, handleMouseMove, handleMouseUp]
  );

  const displayVolume = previewVolume !== null ? previewVolume : volume;
  const volumePercentage = Math.round(displayVolume * 100);

  const getPlayIcon = () => {
    if (displayPlay)
      return (
        <>
          <BsFilePlay
            className={style.player__options__left__play}
            style={{ color: 'var(--accent-color)' }}
          />
          <GoDotFill className={style.buttonActive} aria-hidden="true" />
        </>
      );
    return <BsFilePlay className={style.player__options__left__play} />;
  };

  const getLyricsIcon = () => {
    if (displayLyrics)
      return (
        <>
          <TbMicrophone2
            className={style.player__options__left__micro}
            style={{ color: 'var(--accent-color)' }}
          />
          <GoDotFill className={style.buttonActive} aria-hidden="true" />
        </>
      );
    return <TbMicrophone2 className={style.player__options__left__micro} />;
  };

  const getQueueIcon = () => {
    if (displayQueue)
      return (
        <>
          <HiOutlineQueueList
            className={style.player__options__left__queue}
            style={{ color: 'var(--accent-color)' }}
          />
          <GoDotFill className={style.buttonActive} aria-hidden="true" />
        </>
      );
    return (
      <HiOutlineQueueList className={style.player__options__left__queue} />
    );
  };

  const getDevicesIcon = () => {
    if (displayDevices)
      return (
        <>
          <PiDevicesBold
            className={style.player__options__center__devices}
            style={{ color: 'var(--accent-color)' }}
          />
          <GoDotFill className={style.buttonActive} aria-hidden="true" />
        </>
      );
    return <PiDevicesBold className={style.player__options__center__devices} />;
  };

  const getMiniIcon = () => {
    if (displayMini)
      return (
        <>
          <CgMiniPlayer
            className={style.player__options__right__mini}
            style={{ color: 'var(--accent-color)' }}
          />
          <GoDotFill className={style.buttonActive} aria-hidden="true" />
        </>
      );
    return <CgMiniPlayer className={style.player__options__right__mini} />;
  };

  return (
    <>
      <div
        className={style.player__options}
        role="group"
        aria-label="Additional playback options"
      >
        <div className={style.player__options__left}>
          <button
            className={style.controlsButton}
            onClick={toggleDisplayPlay}
            aria-label={`Now playing view ${displayPlay ? 'on' : 'off'}`}
            aria-pressed={displayPlay}
            title={`Now playing view ${displayPlay ? 'on' : 'off'}`}
          >
            {getPlayIcon()}
          </button>
          <button
            className={style.controlsButton}
            onClick={toggleLyrics}
            aria-label={`Lyrics ${displayLyrics ? 'on' : 'off'}`}
            aria-pressed={displayLyrics}
            title={`Lyrics ${displayLyrics ? 'on' : 'off'}`}
          >
            {getLyricsIcon()}
          </button>
          <button
            className={style.controlsButton}
            onClick={toggleQueue}
            aria-label={`Queue ${displayQueue ? 'visible' : 'hidden'}`}
            aria-pressed={displayQueue}
            title={`Queue ${displayQueue ? 'visible' : 'hidden'}`}
          >
            {getQueueIcon()}
          </button>
        </div>
        <div className={style.player__options__center}>
          <button
            className={style.controlsButton}
            onClick={toggleDevices}
            aria-label={`Connect to device ${displayDevices ? 'menu open' : 'menu closed'}`}
            aria-pressed={displayDevices}
            title={`Connect to device ${displayDevices ? 'menu open' : 'menu closed'}`}
          >
            {getDevicesIcon()}
          </button>
        </div>
        <div className={style.player__options__right}>
          <div className={style.player__options__right__volume}>
            <button
              className={style.controlsButton}
              onClick={toggleMute}
              aria-label={volume === 0 ? 'Unmute (Ctrl+M)' : 'Mute (Ctrl+M)'}
              title={volume === 0 ? 'Unmute (Ctrl+M)' : 'Mute (Ctrl+M)'}
            >
              {getVolumeIcon()}
            </button>
          </div>
          <div
            ref={volumeBarRef}
            className={`${style.player__options__right__volumeBar} ${isAdjustingVolume ? style.adjusting : ''}`}
            onClick={handleVolumeClick}
            onMouseDown={initializeVolumeAdjust}
            onKeyDown={handleVolumeKeyDown}
            role="slider"
            aria-label="Volume"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={volumePercentage}
            aria-valuetext={`Volume ${volumePercentage}%${volume === 0 ? ' (muted)' : ''}`}
            tabIndex="0"
            title={`Volume ${volumePercentage}%${volume === 0 ? ' (muted)' : ''}`}
          >
            <div
              className={style.player__options__right__volumeBar__progress}
              style={{ width: `${volumePercentage}%` }}
            >
              <div
                className={`${style.player__options__right__volumeBar__progress__handle} ${isAdjustingVolume ? style.active : ''}`}
                style={{
                  transform: `translate(50%, -50%)`,
                }}
              />
            </div>
          </div>
          <button
            className={`${style.controlsButton} ${style.disable}`}
            onClick={toggleMini}
            aria-label={`Mini player ${displayMini ? 'on' : 'off'}`}
            aria-pressed={displayMini}
            title={`Mini player ${displayMini ? 'on' : 'off'}`}
          >
            {getMiniIcon()}
          </button>
          <button
            className={style.controlsButton}
            onClick={toggleFullscreen}
            aria-label="Fullscreen view"
            title="Fullscreen view"
          >
            <LuMaximize2 className={style.player__options__right__max} />
          </button>
        </div>
      </div>
      {isFullscreen && <FullscreenView />}
    </>
  );
};

Options.propTypes = {
  className: PropTypes.string,
};

export default Options;

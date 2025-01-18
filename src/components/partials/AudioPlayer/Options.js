import React, { useState } from 'react';
import style from './AudioPlayer.module.scss';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';

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
    handleVolume,
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
  } = useAudioPlayer();

  const getPlayIcon = () => {
    if (displayPlay)
      return (
        <>
          <BsFilePlay
            className={style.player__options__left__play}
            style={{ color: 'var(--accent-color)' }}
          />
          <GoDotFill className={style.buttonActive} />
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
          <GoDotFill className={style.buttonActive} />
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
          <GoDotFill className={style.buttonActive} />
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
          <GoDotFill className={style.buttonActive} />
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
          <GoDotFill className={style.buttonActive} />
        </>
      );
    return <CgMiniPlayer className={style.player__options__right__mini} />;
  };

  return (
    <div className={style.player__options}>
      <div className={style.player__options__left}>
        <button className={style.controlsButton} onClick={toggleDisplayPlay}>
          {getPlayIcon()}
        </button>
        <button className={style.controlsButton} onClick={toggleLyrics}>
          {getLyricsIcon()}
        </button>
        <button className={style.controlsButton} onClick={toggleQueue}>
          {getQueueIcon()}
        </button>
      </div>
      <div className={style.player__options__center}>
        <button className={style.controlsButton} onClick={toggleDevices}>
          {getDevicesIcon()}
        </button>
      </div>
      <div className={style.player__options__right}>
        <div className={style.player__options__right__volume}>
          <button className={style.controlsButton} onClick={toggleMute}>
            {getVolumeIcon()}
          </button>
        </div>
        <div
          className={style.player__options__right__volumeBar}
          onClick={handleVolume}
        >
          <div
            className={style.player__options__right__volumeBar__progress}
            style={{ width: `${volume * 100}%` }}
          ></div>
        </div>
        <button className={style.controlsButton} onClick={toggleMini}>
          {getMiniIcon()}
        </button>
        <button className={style.controlsButton}>
          <LuMaximize2 className={style.player__options__right__max} />
        </button>
      </div>
    </div>
  );
};

export default Options;

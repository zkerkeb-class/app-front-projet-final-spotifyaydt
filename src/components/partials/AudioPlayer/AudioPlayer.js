import React, { useState, useRef, useEffect } from 'react';
import style from './AudioPlayer.module.scss';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';

import Controls from './Controls';

// Importing icons
import { IoMdAddCircleOutline } from 'react-icons/io';
import { BsFilePlay } from 'react-icons/bs';
import { TbMicrophone2 } from 'react-icons/tb';
import { HiOutlineQueueList } from 'react-icons/hi2';
import { PiDevicesBold } from 'react-icons/pi';
import { CgMiniPlayer } from 'react-icons/cg';
import { LuMaximize2 } from 'react-icons/lu';

import Audio from '../../../assests/audio/lazy-day.mp3';

// Données temporaires pour la démo
const mockData = {
  tracks: Array(1)
    .fill(null)
    .map((_, i) => ({
      id: i,
      title: `Top Track ${i + 1}`,
      artist: `Artist ${i + 1}`,
      coverUrl: `https://picsum.photos/200?random=${i}`,
      audio: Audio,
    })),
};

// to separate the controls from the player component create hook and context for the player so that the audioref can be shared between the two components
const AudioPlayer = ({ track }) => {
  const { volume, handleVolume, toggleMute, getVolumeIcon } = useAudioPlayer();

  return (
    //Artist and track info
    <div className={style.player}>
      {mockData.tracks.map((track) => (
        <div className={style.player__music}>
          <div className={style.player__music__cover}>
            <img src={track.coverUrl} alt={track.title} />
          </div>
          <div className={style.player__music__info}>
            <span className={style.player__music__info__title}>
              {track.title}
            </span>
            <span className={style.player__music__info__artist}>
              {track.artist}
            </span>
          </div>
          <div className={style.player__music__add}>
            <IoMdAddCircleOutline className={style.player__music__add__icon} />
          </div>
        </div>
      ))}

      {/*Player controls*/}
      <div className={style.player__controlsContainer}>
        <Controls />
      </div>

      {/*Other controls*/}
      <div className={style.player__options}>
        <div className={style.player__options__left}>
          <BsFilePlay className={style.player__options__left__play} />
          <TbMicrophone2 className={style.player__options__left__micro} />
          <HiOutlineQueueList className={style.player__options__left__queue} />
        </div>
        <div className={style.player__options__center}>
          <PiDevicesBold className={style.player__options__center__devices} />
        </div>
        <div className={style.player__options__right}>
          <div
            className={style.player__options__right__volume}
            onClick={toggleMute}
          >
            {getVolumeIcon()}
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
          <CgMiniPlayer className={style.player__options__right__mini} />
          <LuMaximize2 className={style.player__options__right__max} />
        </div>
      </div>
      <audio src={Audio} ref={useAudioPlayer().audioRef} preload="metadata" />
    </div>
  );
};

export default AudioPlayer;

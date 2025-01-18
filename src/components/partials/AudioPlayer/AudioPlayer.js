import React from 'react';
import style from './AudioPlayer.module.scss';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';

import Controls from './Controls';
import Options from './Options';

// Importing icons
import { IoMdAddCircleOutline } from 'react-icons/io';

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

const AudioPlayer = ({ track }) => {
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
      <Options />

      <audio src={Audio} ref={useAudioPlayer().audioRef} preload="metadata" />
    </div>
  );
};

export default AudioPlayer;

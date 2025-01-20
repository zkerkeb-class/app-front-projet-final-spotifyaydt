import React from 'react';
import PropTypes from 'prop-types';
import style from './AudioPlayer.module.scss';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';

import Controls from './Controls';
import Options from './Options';

// Importing icons
import { IoMdAddCircleOutline } from 'react-icons/io';

// Move mock data to a separate file
import { mockTracks } from '../../../constant/mockData';

const AudioPlayer = ({ onError }) => {
  const { audioRef } = useAudioPlayer();

  const handleError = (error) => {
    console.error('Audio playback error:', error);
    onError?.(error);
  };

  return (
    <div className={style.player} role="region" aria-label="Audio player">
      {mockTracks.map((track) => (
        <div
          key={track.id}
          className={style.player__music}
          role="group"
          aria-label={`Now playing: ${track.title} by ${track.artist}`}
        >
          <div className={style.player__music__cover}>
            <img src={track.coverUrl} alt={`Album cover for ${track.title}`} />
          </div>
          <div className={style.player__music__info}>
            <span
              className={style.player__music__info__title}
              role="heading"
              aria-level="2"
            >
              {track.title}
            </span>
            <span className={style.player__music__info__artist}>
              {track.artist}
            </span>
          </div>
          <div className={style.player__music__add}>
            <button
              className={style.player__music__add__button}
              aria-label={`Add ${track.title} to your library`}
            >
              <IoMdAddCircleOutline
                className={style.player__music__add__icon}
              />
            </button>
          </div>
        </div>
      ))}

      <div
        className={style.player__controlsContainer}
        role="group"
        aria-label="Playback controls"
      >
        <Controls />
      </div>

      <div
        role="group"
        aria-label="Additional controls"
        className={style.player__optionsContainer}
      >
        <Options />
      </div>

      <audio
        src={mockTracks[0].audio}
        ref={audioRef}
        onError={handleError}
        preload="metadata"
        aria-hidden="true"
      />
    </div>
  );
};

AudioPlayer.propTypes = {
  onError: PropTypes.func,
};

export default AudioPlayer;

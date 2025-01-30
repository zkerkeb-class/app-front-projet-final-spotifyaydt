import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import style from './AudioPlayer.module.scss';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';

import Controls from './Controls';
import Options from './Options';

import { IoMdAddCircleOutline } from 'react-icons/io';

const AudioPlayer = ({ onError }) => {
  const { audioRef, currentTrackIndex, currentTracks } = useAudioPlayer();

  useEffect(() => {
    if (audioRef.current) {
      console.log('Audio element initialized');
    }
  }, [audioRef]);

  const handleError = (error) => {
    console.error('Audio playback error:', error);
    onError?.(error);
  };

  // Get the file extension from the audio URL
  const getFileType = (url) => {
    if (!url) return null;
    const extension = url.split('.').pop().toLowerCase();
    switch (extension) {
      case 'mp3':
        return 'audio/mpeg';
      case 'wav':
        return 'audio/wav';
      case 'ogg':
        return 'audio/ogg';
      case 'm4a':
        return 'audio/mp4';
      case 'aac':
        return 'audio/aac';
      case 'webm':
        return 'audio/webm';
      default:
        return null;
    }
  };

  // Always render the audio element, even when no tracks are loaded
  const renderAudioElement = () => (
    <audio
      ref={audioRef}
      onError={handleError}
      preload="metadata"
      aria-hidden="true"
    >
      {currentTracks?.[currentTrackIndex]?.audio && (
        <source
          src={currentTracks[currentTrackIndex].audio}
          type={
            getFileType(currentTracks[currentTrackIndex].audio) || 'audio/mpeg'
          }
        />
      )}
      Your browser does not support the audio element.
    </audio>
  );

  // Return a disabled player if no tracks are loaded
  if (!currentTracks || currentTracks.length === 0) {
    return (
      <div
        className={`${style.player} ${style.player__disabled}`}
        role="region"
        aria-label="Audio player"
      >
        <div className={style.player__music}>
          <div className={style.player__music__cover}>
            <div className={style.player__music__cover__placeholder} />
          </div>
          <div className={style.player__music__info}>
            <span className={style.player__music__info__title}>
              Select a track to play
            </span>
          </div>
        </div>

        <div className={style.player__controlsContainer}>
          <Controls />
        </div>

        <div className={style.player__optionsContainer}>
          <Options />
        </div>
        {renderAudioElement()}
      </div>
    );
  }

  const currentTrack = currentTracks[currentTrackIndex];
  if (!currentTrack) {
    console.error('Current track not found:', {
      currentTrackIndex,
      currentTracks,
    });
    return null;
  }

  return (
    <div className={style.player} role="region" aria-label="Audio player">
      <div
        className={style.player__music}
        role="group"
        aria-label={`Now playing: ${currentTrack.title} by ${currentTrack.artist}`}
      >
        <div className={style.player__music__cover}>
          <img
            src={currentTrack.coverUrl}
            alt={`Album cover for ${currentTrack.title}`}
          />
        </div>
        <div className={style.player__music__info}>
          <span
            className={style.player__music__info__title}
            role="heading"
            aria-level="2"
          >
            {currentTrack.title}
          </span>
          <span className={style.player__music__info__artist}>
            {currentTrack.artist}
          </span>
        </div>
        <div className={style.player__music__add}>
          <button
            className={style.player__music__add__button}
            aria-label={`Add ${currentTrack.title} to your library`}
          >
            <IoMdAddCircleOutline className={style.player__music__add__icon} />
          </button>
        </div>
      </div>

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

      {renderAudioElement()}
    </div>
  );
};

AudioPlayer.propTypes = {
  onError: PropTypes.func,
};

export default AudioPlayer;

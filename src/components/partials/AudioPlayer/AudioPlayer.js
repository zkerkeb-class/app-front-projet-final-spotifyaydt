import React, { useEffect } from 'react';
import style from './AudioPlayer.module.scss';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { useTranslation } from 'react-i18next';

import Controls from './Controls';
import Options from './Options';
import OptimizedImage from '../../UI/OptimizedImage/OptimizedImage';
import CardFallbackIcon from '../../UI/CardFallbackIcon/CardFallbackIcon';

import { IoMdAddCircleOutline } from 'react-icons/io';

const AudioPlayer = ({ onError }) => {
  const { audioRef, currentTrackIndex, currentTracks } = useAudioPlayer();
  const { t } = useTranslation();

  useEffect(() => {
    if (audioRef.current) {
      console.log('Audio element initialized');
    }
  }, [audioRef]);

  const handleError = (error) => {
    console.error('Audio playback error:', error);
    onError?.(error);
  };

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

  const getArtistName = (track) => {
    if (!track?.artist) return t('common.unknownArtist');
    if (typeof track.artist === 'string') return track.artist;
    if (track.artist._id) return track.artist.name || t('common.unknownArtist');
    return track.artist.name || t('common.unknownArtist');
  };

  const renderAudioElement = () => (
    <audio
      ref={audioRef}
      onError={handleError}
      preload="metadata"
      aria-hidden="true"
    >
      {currentTracks?.[currentTrackIndex]?.audioUrl && (
        <source
          src={currentTracks[currentTrackIndex].audioUrl}
          type={
            getFileType(currentTracks[currentTrackIndex].audioUrl) ||
            'audio/mpeg'
          }
        />
      )}
      Your browser does not support the audio element.
    </audio>
  );

  if (!currentTracks || currentTracks.length === 0) {
    return (
      <div className={style.player} role="region" aria-label="Audio player">
        <div className={`${style.player__music} ${style.player__disabled}`}>
          <div className={style.player__music__cover}>
            <div className={style.player__music__cover__placeholder} />
          </div>
          <div className={style.player__music__info}>
            <span className={style.player__music__info__title}>
              Select a track to play
            </span>
          </div>
        </div>

        <div
          className={`${style.player__controlsContainer} ${style.player__disabled}`}
        >
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
    <div
      className={style.player}
      role="region"
      aria-label={`Now playing: ${currentTrack.title} by ${getArtistName(currentTrack)}`}
    >
      <div
        className={style.player__music}
        role="group"
        aria-label={`Now playing: ${currentTrack.title} by ${getArtistName(currentTrack)}`}
      >
        <div className={style.player__music__cover}>
          {!currentTrack.coverUrl ? (
            <div className={style.player__music__cover__fallback}>
              <CardFallbackIcon />
            </div>
          ) : (
            <OptimizedImage
              src={currentTrack.coverUrl}
              alt={`Album cover for ${currentTrack.title}`}
              className={style.player__music__cover__image}
              sizes="(max-width: 768px) 150px, 200px"
              loading="lazy"
            />
          )}
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
            {getArtistName(currentTrack)}
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

export default AudioPlayer;

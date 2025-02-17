import React, { useEffect, useState } from 'react';
import style from './AudioPlayer.module.scss';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { useTranslation } from 'react-i18next';

import Controls from './Controls';
import Options from './Options';
import OptimizedImage from '../../UI/OptimizedImage/OptimizedImage';
import CardFallbackIcon from '../../UI/CardFallbackIcon/CardFallbackIcon';

import { IoMdAddCircleOutline } from 'react-icons/io';
import { FaBluetoothB } from 'react-icons/fa';
import { IoPlayCircle, IoPauseCircle } from 'react-icons/io5';

const AudioPlayer = ({ onError }) => {
  const {
    audioRef,
    currentTrackIndex,
    currentTracks,
    isPlaying,
    togglePlayPause,
    currentTime,
    duration,
    handleSeek,
  } = useAudioPlayer();
  const { t } = useTranslation();

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

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = x / width;
    const newTime = duration * percentage;
    handleSeek(newTime);
  };

  if (!currentTracks || currentTracks.length === 0) {
    return (
      <div className={style.container}>
        <div className={`${style.player} ${style.player__disabled}`}>
          <div className={style.player__music}>
            <div className={style.player__music__cover}>
              <div className={style.player__music__cover__placeholder} />
            </div>
            <div className={style.player__music__info}>
              <span className={style.player__music__info__title}>
                {t('audioPlayer.noTrack')}
              </span>
            </div>
          </div>
          <div className={style.player__controlsContainer}>
            <Controls />
          </div>
          <div className={style.player__optionsContainer}>
            <Options />
          </div>
        </div>
      </div>
    );
  }

  const currentTrack = currentTracks[currentTrackIndex];

  return (
    <div className={style.container}>
      <div
        className={style.player}
        role="region"
        aria-label={`Now playing: ${currentTrack.title} by ${getArtistName(currentTrack)}`}
      >
        <div className={style.player__music}>
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
            <span className={style.player__music__info__title}>
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
              <IoMdAddCircleOutline
                className={style.player__music__add__icon}
              />
            </button>
          </div>
        </div>

        <div className={style.player__controlsContainer}>
          <Controls />
        </div>

        <div className={style.player__optionsContainer}>
          <Options />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;

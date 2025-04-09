import React, { useCallback } from 'react';
import style from './Album.module.scss';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ErrorBoundary from '../../components/ErrorBoundary';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import WaveformAnimation from '../../components/UI/WaveformAnimation/WaveformAnimation';
import { generateGradient } from '../../utils/colorUtils';
import OptimizedImage from '../../components/UI/OptimizedImage/OptimizedImage';
import LoadingSpinner from '../../components/UI/LoadingSpinner/LoadingSpinner';
import CardFallbackIcon from '../../components/UI/CardFallbackIcon/CardFallbackIcon';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';

import { FaSpotify, FaPlay, FaPause } from 'react-icons/fa';
import { PiShuffleBold } from 'react-icons/pi';
import { LuDot } from 'react-icons/lu';
import { MdAccessTime } from 'react-icons/md';

const Album = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { handlePlay, isPlaying, activeCardId, currentTrack } =
    useAudioPlayer();

  const {
    data: album,
    loading: albumLoading,
    error: albumError,
  } = useApi(() => api.albums.getById(id), [id]);

  const { data: tracks } = useApi(() => api.tracks.getAll(), []);

  const albumTracks =
    tracks
      ?.filter((track) => track.album._id === album?._id)
      .sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0)) || [];

  // Generate unique gradient for this album
  const headerStyle = generateGradient(album?.title || '');

  // Check if this specific album is the active source of playback
  const isThisPlaying =
    isPlaying && currentTrack && albumTracks.includes(currentTrack);

  const handlePlayClick = useCallback(() => {
    if (!album || albumTracks.length === 0) {
      console.warn(`No tracks found for album: ${album?.title}`);
      return;
    }

    handlePlay({
      track: albumTracks[0],
      tracks: albumTracks,
      action: isThisPlaying ? 'pause' : 'play',
    });
  }, [album, albumTracks, handlePlay, isThisPlaying]);

  const handleTrackPlay = useCallback(
    (track) => {
      if (!album) return;
      handlePlay({
        track,
        tracks: albumTracks,
        action: isPlaying && currentTrack?.id === track.id ? 'pause' : 'play',
      });
    },
    [album, albumTracks, handlePlay, isPlaying, currentTrack]
  );

  const handleShuffle = useCallback(() => {
    if (!album || albumTracks.length === 0) return;

    const shuffledTracks = [...albumTracks].sort(() => Math.random() - 0.5);

    handlePlay({
      track: shuffledTracks[0],
      tracks: shuffledTracks,
      action: 'play',
    });
  }, [album, albumTracks, handlePlay]);

  const getArtistName = (track) => {
    if (!track?.artist) return t('common.unknownArtist');
    if (typeof track.artist === 'string') return track.artist;
    if (track.artist._id) return track.artist.name || t('common.unknownArtist');
    return track.artist.name || t('common.unknownArtist');
  };

  if (albumLoading) {
    return <LoadingSpinner aria-label={t('album.loading')} />;
  }

  if (albumError) {
    return (
      <div>
        {t('album.error')}: {albumError}
      </div>
    );
  }

  if (!album) {
    return <div>{t('album.notFound')}</div>;
  }

  const formatDuration = (duration) => {
    if (!duration) return '0:00';
    if (typeof duration === 'string' && duration.includes(':')) {
      const [minutes, seconds] = duration.split(':');
      return `${minutes}:${seconds.padStart(2, '0')}`;
    }
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <ErrorBoundary>
      <div className={style.container}>
        <header className={style.header} style={headerStyle}>
          <div className={style.header__container}>
            {album.coverImage ? (
              <OptimizedImage
                src={album.coverImage}
                alt={t('common.albumCover', { title: album.title })}
                className={style.header__container__image}
                sizes="(max-width: 768px) 200px, 232px"
                loading="eager"
              />
            ) : (
              <CardFallbackIcon type="album" />
            )}
          </div>
          <div className={style.header__info}>
            <span>{t('album.title')}</span>
            <h1 className={style.header__info__title}>{album.title}</h1>
            <span>{getArtistName(album)}</span>
            <div className={style.header__info__more}>
              <FaSpotify className={style.header__info__more__logo} />
              <span>Spotify</span>
              <LuDot className={style.header__info__more__icon} />
              <span>
                {t('album.trackCount', { count: albumTracks.length })} •{' '}
                {album.releaseDate
                  ? new Date(album.releaseDate).getFullYear()
                  : ''}
              </span>
            </div>
          </div>
        </header>

        <main className={style.main}>
          <div className={style.main__header}>
            <div className={style.main__header__container}>
              <button
                className={style.main__header__container__button}
                onClick={handlePlayClick}
                aria-label={
                  isThisPlaying
                    ? t('common.pauseAlbum', { title: album.title })
                    : t('common.playAlbum', { title: album.title })
                }
              >
                {isThisPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button
                className={`${style.main__header__container__button} ${style.shuffle_button}`}
                onClick={handleShuffle}
                aria-label={t('album.shufflePlay')}
              >
                <PiShuffleBold />
              </button>
            </div>
            <div className={style.main__header__table}>
              <div className={style.main__header__table__flex}>
                <span className={style.main__header__table__item}>#</span>
                <span className={style.main__header__table__item}>
                  {t('common.title')}
                </span>
              </div>
              <span className={style.main__header__table__item}>
                {t('common.artist')}
              </span>
              <span
                className={style.main__header__table__item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <MdAccessTime title={t('album.duration')} />
              </span>
            </div>
          </div>

          <div className={style.tracks}>
            {albumTracks.map((track, index) => (
              <div
                key={track.id}
                className={style.track}
                onClick={() => handleTrackPlay(track)}
              >
                <div className={style.track__info}>
                  {isPlaying && currentTrack && currentTrack.id === track.id ? (
                    <button
                      className={`${style.track__play_icon} ${style.visible}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrackPlay(track);
                      }}
                      aria-label={
                        isPlaying && currentTrack.id === track.id
                          ? t('common.pauseTrack', { title: track.title })
                          : t('common.playTrack', { title: track.title })
                      }
                    >
                      <WaveformAnimation className={style.waveform} />
                      <FaPause className={style.pause_icon} />
                    </button>
                  ) : (
                    <>
                      <span className={style.track__number}>{index + 1}</span>
                      <button
                        className={style.track__play_icon}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTrackPlay(track);
                        }}
                        aria-label={t('common.playTrack', {
                          title: track.title,
                        })}
                      >
                        <FaPlay />
                      </button>
                    </>
                  )}
                  <div className={style.track__details}>
                    {isPlaying &&
                    currentTrack &&
                    currentTrack.id === track.id ? (
                      <span className={`${style.track__title} ${style.green}`}>
                        {track.title}
                      </span>
                    ) : (
                      <span className={style.track__title}>{track.title}</span>
                    )}
                    <span className={style.track__artist}>
                      {getArtistName(track)}
                    </span>
                  </div>
                </div>
                <span className={style.track__album}>{album.title}</span>
                <span className={style.track__duration}>
                  {formatDuration(track.duration)}
                </span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Album;

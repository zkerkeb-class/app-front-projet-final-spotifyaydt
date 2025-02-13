import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import style from './Playlist.module.scss';
import ErrorBoundary from '../../components/ErrorBoundary';
import { useTranslation } from 'react-i18next';
import { FaSpotify, FaPlay, FaPause } from 'react-icons/fa';
import { PiShuffleBold } from 'react-icons/pi';
import { LuDot } from 'react-icons/lu';
import { MdAccessTime } from 'react-icons/md';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import WaveformAnimation from '../../components/UI/WaveformAnimation/WaveformAnimation';
import { generateGradient } from '../../utils/colorUtils';
import OptimizedImage from '../../components/UI/OptimizedImage/OptimizedImage';
import LoadingSpinner from '../../components/UI/LoadingSpinner/LoadingSpinner';
import CardFallbackIcon from '../../components/UI/CardFallbackIcon/CardFallbackIcon';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';

const Playlist = () => {
  const { id } = useParams();
  const { handlePlay, isPlaying, activeCardId, currentTrack } =
    useAudioPlayer();
  const { t } = useTranslation();

  const {
    data: playlist,
    loading: playlistLoading,
    error: playlistError,
  } = useApi(() => api.playlists.getById(id), [id]);

  const { data: tracks, loading: tracksLoading } = useApi(
    () => api.tracks.getAll(),
    []
  );

  const playlistTracks =
    playlist && tracks
      ? tracks.filter((track) => playlist.tracks.includes(track._id))
      : [];

  // Generate unique gradient for this playlist
  const headerStyle = generateGradient(playlist?.title);

  // Check if this specific playlist is the active source of playback
  const isThisPlaying =
    isPlaying && currentTrack && playlistTracks.includes(currentTrack);

  const handlePlayClick = useCallback(() => {
    if (!playlist || playlistTracks.length === 0) {
      console.warn(`No tracks found for playlist: ${playlist?.title}`);
      return;
    }

    handlePlay({
      track: playlistTracks[0],
      tracks: playlistTracks,
      action: isThisPlaying ? 'pause' : 'play',
    });
  }, [playlist, playlistTracks, handlePlay, isThisPlaying]);

  const handleTrackPlay = useCallback(
    (track) => {
      if (!playlist) return;
      handlePlay({
        track,
        tracks: playlistTracks,
        action: isPlaying && currentTrack?._id === track._id ? 'pause' : 'play',
      });
    },
    [playlist, playlistTracks, handlePlay, isPlaying, currentTrack]
  );

  const handleShuffle = useCallback(() => {
    if (!playlist || playlistTracks.length === 0) return;

    const shuffledTracks = [...playlistTracks].sort(() => Math.random() - 0.5);

    handlePlay({
      track: shuffledTracks[0],
      tracks: shuffledTracks,
      action: 'play',
    });
  }, [playlist, playlistTracks, handlePlay]);

  const formatDuration = (duration) => {
    const [minutes, seconds] = duration.split(':');
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  const getArtistName = (track) => {
    if (!track?.artist) return t('common.unknownArtist');
    if (typeof track.artist === 'string') return track.artist;
    if (track.artist._id) return track.artist.name || t('common.unknownArtist');
    return track.artist.name || t('common.unknownArtist');
  };

  if (playlistLoading || tracksLoading) {
    return (
      <div className={style.container}>
        <LoadingSpinner />
      </div>
    );
  }

  if (playlistError) {
    return (
      <div className={style.container}>
        <div className={style.error}>
          {t('errors.loadingPlaylist')}: {playlistError}
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className={style.container}>
        <div className={style.error}>{t('errors.playlistNotFound')}</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={style.container}>
        <header className={style.header} style={headerStyle}>
          <div className={style.header__container}>
            {playlist.coverUrl ? (
              <OptimizedImage
                src={playlist.coverUrl}
                alt={t('common.playlistCover', { title: playlist.name })}
                className={style.header__container__image}
                sizes="(max-width: 768px) 200px, 232px"
                loading="eager"
              />
            ) : (
              <div className={style.header__container__fallback}>
                <CardFallbackIcon type="playlist" />
              </div>
            )}
          </div>
          <div className={style.header__info}>
            <span>{t('common.playlist')}</span>
            <h1 className={style.header__info__title}>{playlist.name}</h1>
            <p className={style.header__info__description}>
              {playlist.description}
            </p>
            <div className={style.header__info__more}>
              <FaSpotify className={style.header__info__more__logo} />
              <span>{playlist.owner}</span>
              <LuDot className={style.header__info__more__icon} />
              <span>
                {t('common.trackCount', { count: playlistTracks.length })} •{' '}
                {t('common.likeCount', { count: playlist.followers })}
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
                    ? t('common.pausePlaylist', { title: playlist.title })
                    : t('common.playPlaylist', { title: playlist.title })
                }
              >
                {isThisPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button
                className={`${style.main__header__container__button} ${style.shuffle_button}`}
                onClick={handleShuffle}
                aria-label={t('common.shufflePlaylist')}
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
                {t('common.album')}
              </span>
              <span
                className={style.main__header__table__item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <MdAccessTime />
              </span>
            </div>
          </div>

          <div className={style.tracks}>
            {playlistTracks.length === 0 ? (
              <div className={style.empty}>
                <p>{t('playlist.noTracks')}</p>
              </div>
            ) : (
              playlistTracks.map((track, index) => (
                <div
                  key={track._id}
                  className={style.track}
                  onClick={() => handleTrackPlay(track)}
                >
                  <div className={style.track__info}>
                    {isPlaying &&
                    currentTrack &&
                    currentTrack._id === track._id ? (
                      <button
                        className={`${style.track__play_icon} ${style.visible}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTrackPlay(track);
                        }}
                        aria-label={
                          isPlaying && currentTrack._id === track._id
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
                      currentTrack._id === track._id ? (
                        <span
                          className={`${style.track__title} ${style.green}`}
                        >
                          {track.title}
                        </span>
                      ) : (
                        <span className={style.track__title}>
                          {track.title}
                        </span>
                      )}
                      <span className={style.track__artist}>
                        {getArtistName(track)}
                      </span>
                    </div>
                  </div>
                  <span className={style.track__album}>{track.album}</span>
                  <span className={style.track__duration}>
                    {formatDuration(track.duration)}
                  </span>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Playlist;

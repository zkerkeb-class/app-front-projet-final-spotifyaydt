import React, { useCallback } from 'react';
import style from './Album.module.scss';
import { useParams } from 'react-router-dom';
import ErrorBoundary from '../../components/ErrorBoundary';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import WaveformAnimation from '../../components/UI/WaveformAnimation/WaveformAnimation';
import { generateGradient } from '../../utils/colorUtils';

import { FaSpotify, FaPlay, FaPause } from 'react-icons/fa';
import { PiShuffleBold } from 'react-icons/pi';
import { LuDot } from 'react-icons/lu';
import { MdAccessTime } from 'react-icons/md';

import { mockAlbums, mockTracks } from '../../constant/mockData';

const Album = () => {
  const { id } = useParams();
  const { handlePlay, isPlaying, activeCardId, currentTrack } =
    useAudioPlayer();

  const album = mockAlbums.find((a) => a.id === Number(id));
  const albumTracks = mockTracks
    .filter((track) => track.album === album?.title)
    .sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0));

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

  if (!album) {
    return <div>Album not found</div>;
  }

  const formatDuration = (duration) => {
    const [minutes, seconds] = duration.split(':');
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  return (
    <ErrorBoundary>
      <div className={style.container}>
        <header className={style.header} style={headerStyle}>
          <div className={style.header__container}>
            <img
              className={style.header__container__image}
              src={album.coverUrl}
              alt={`${album.title} Cover`}
              loading="lazy"
            />
          </div>
          <div className={style.header__info}>
            <span>Album</span>
            <h1 className={style.header__info__title}>{album.title}</h1>
            <span>{album.artist}</span>
            <div className={style.header__info__more}>
              <FaSpotify className={style.header__info__more__logo} />
              <span>Spotify</span>
              <LuDot className={style.header__info__more__icon} />
              <span>
                {albumTracks.length} tracks • {album.year}
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
                aria-label={isThisPlaying ? 'Pause album' : 'Play album'}
              >
                {isThisPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button
                className={`${style.main__header__container__button} ${style.shuffle_button}`}
                onClick={handleShuffle}
                aria-label="Shuffle album"
              >
                <PiShuffleBold />
              </button>
            </div>
            <div className={style.main__header__table}>
              <div className={style.main__header__table__flex}>
                <span className={style.main__header__table__item}>#</span>
                <span className={style.main__header__table__item}>Title</span>
              </div>
              <span className={style.main__header__table__item}>Album</span>
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
                          ? 'Pause track'
                          : 'Play track'
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
                        aria-label="Play track"
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
                    <span className={style.track__artist}>{track.artist}</span>
                  </div>
                </div>
                <span className={style.track__album}>{track.album}</span>
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

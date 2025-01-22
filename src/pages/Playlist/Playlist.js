import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import style from './Playlist.module.scss';
import ErrorBoundary from '../../components/ErrorBoundary';

import { FaSpotify, FaPlay, FaPause } from 'react-icons/fa';
import { PiShuffleBold } from 'react-icons/pi';
import { LuDot } from 'react-icons/lu';
import { MdAccessTime } from 'react-icons/md';

import { mockPlaylists, mockTracks } from '../../constant/mockData';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import WaveformAnimation from '../../components/UI/WaveformAnimation/WaveformAnimation';
import { generateGradient } from '../../utils/colorUtils';

const Playlist = () => {
  const { id } = useParams();
  const { handlePlay, isPlaying, activeCardId, currentTrack } =
    useAudioPlayer();

  const playlist = mockPlaylists.find((p) => p.id === Number(id));
  const playlistTracks = playlist
    ? mockTracks.filter((track) => playlist.tracks.includes(track.id))
    : [];

  // Generate unique gradient for this playlist
  const headerStyle = generateGradient(playlist?.title || '');

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
        action: isPlaying && currentTrack?.id === track.id ? 'pause' : 'play',
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

  if (!playlist) {
    return <div>Playlist not found</div>;
  }

  return (
    <ErrorBoundary>
      <div className={style.container}>
        <header className={style.header} style={headerStyle}>
          <div className={style.header__container}>
            <img
              className={style.header__container__image}
              src={playlist.coverUrl}
              alt={`${playlist.title} Cover`}
              loading="lazy"
            />
          </div>
          <div className={style.header__info}>
            <span>Playlist</span>
            <h1 className={style.header__info__title}>{playlist.title}</h1>
            <p className={style.header__info__description}>
              {playlist.description}
            </p>
            <div className={style.header__info__more}>
              <FaSpotify className={style.header__info__more__logo} />
              <span>{playlist.owner}</span>
              <LuDot className={style.header__info__more__icon} />
              <span>
                {playlistTracks.length} tracks •{' '}
                {new Intl.NumberFormat().format(playlist.followers)} likes
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
                aria-label={isThisPlaying ? 'Pause playlist' : 'Play playlist'}
              >
                {isThisPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button
                className={`${style.main__header__container__button} ${style.shuffle_button}`}
                onClick={handleShuffle}
                aria-label="Shuffle playlist"
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
            {playlistTracks.map((track, index) => (
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

export default Playlist;

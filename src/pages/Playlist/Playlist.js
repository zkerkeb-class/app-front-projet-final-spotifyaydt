import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import style from './Playlist.module.scss';
import ErrorBoundary from '../../components/ErrorBoundary';

import { FaSpotify, FaPlay } from 'react-icons/fa';
import { LuDot } from 'react-icons/lu';
import { MdAccessTime } from 'react-icons/md';

import { mockPlaylists, mockTracks } from '../../constant/mockData';

const Playlist = () => {
  const { id } = useParams();
  const playlist = mockPlaylists.find((p) => p.id === Number(id));
  const playlistTracks = playlist
    ? mockTracks.filter((track) => playlist.tracks.includes(track.id))
    : [];

  const handlePlay = useCallback((track) => {
    console.log('Playing track:', track);
    // Implement your play logic here
  }, []);

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
        <header className={style.header}>
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
                onClick={() => handlePlay(playlist)}
                aria-label={`Play ${playlist.title}`}
              >
                <FaPlay />
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
                onClick={() => handlePlay(track)}
              >
                <div className={style.track__info}>
                  <span className={style.track__number}>{index + 1}</span>
                  <span className={style.track__play_icon}>
                    <FaPlay />
                  </span>
                  <div className={style.track__details}>
                    <span className={style.track__title}>{track.title}</span>
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

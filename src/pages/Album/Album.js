import React, { useCallback } from 'react';
import style from './Album.module.scss';
import { useParams } from 'react-router-dom';
import ErrorBoundary from '../../components/ErrorBoundary';

import { FaSpotify, FaPlay, FaPause } from 'react-icons/fa';
import { LuDot } from 'react-icons/lu';
import { MdAccessTime } from 'react-icons/md';

import { mockAlbums, mockTracks } from '../../constant/mockData';

const Album = () => {
  const { id } = useParams();
  const album = mockAlbums.find((a) => a.id === Number(id)) || mockAlbums[0];
  const albumTracks = mockTracks.filter((track) => track.album === album.title);

  const handlePlay = useCallback((track) => {
    console.log('Playing track:', track);
    // Implement your play logic here
  }, []);

  const formatDuration = (duration) => {
    const [minutes, seconds] = duration.split(':');
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  return (
    <ErrorBoundary>
      <div className={style.container}>
        <header className={style.header}>
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
                onClick={() => handlePlay(album)}
                aria-label={`Play ${album.title}`}
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
              <span className={style.main__header__table__item}>Duration</span>
            </div>
          </div>

          <div className={style.tracks}>
            {albumTracks.map((track, index) => (
              <div
                key={track.id}
                className={style.track}
                onClick={() => handlePlay(track)}
              >
                <div className={style.track__info}>
                  <span className={style.track__number}>{index + 1}</span>
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

export default Album;

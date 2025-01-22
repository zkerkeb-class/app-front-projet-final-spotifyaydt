import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import style from './Artist.module.scss';
import ErrorBoundary from '../../components/ErrorBoundary';
import HorizontalScroll from '../../components/UI/HorizontalScroll/HorizontalScroll';
import TrackCard from '../../components/UI/Cards/TrackCard';
import AlbumCard from '../../components/UI/Cards/AlbumCard';

// Icons
import { FaPlay, FaPause } from 'react-icons/fa';

import { mockArtists, mockTracks, mockAlbums } from '../../constant/mockData';

const Artist = () => {
  const { id } = useParams();
  const artist = mockArtists.find((a) => a.id === Number(id)) || mockArtists[0];
  const artistTracks = mockTracks.filter((track) =>
    track.artist.includes(artist.name)
  );
  const artistAlbums = mockAlbums.filter(
    (album) => album.artist === artist.name
  );

  const handlePlay = useCallback((item) => {
    console.log('Playing:', item);
    // Implement your play logic here
  }, []);

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <ErrorBoundary>
      <div className={style.container}>
        <header className={style.header}>
          <div className={style.header__container}>
            <img
              className={style.header__container__image}
              src={artist.imageUrl}
              alt={artist.name}
              loading="lazy"
            />
          </div>
          <div className={style.header__info}>
            <span>Artist</span>
            <h1 className={style.header__info__title}>{artist.name}</h1>
            <div className={style.header__info__more}>
              <span>{formatNumber(artist.followers)} followers</span>
            </div>
          </div>
        </header>

        <main className={style.main}>
          <div className={style.main__header}>
            <div className={style.main__header__container}>
              <button
                className={style.main__header__container__button}
                onClick={() => handlePlay(artist)}
                aria-label={`Play ${artist.name}'s popular tracks`}
              >
                <FaPlay />
              </button>
            </div>
          </div>

          <div className={style.main__content}>
            <section className={style.popular}>
              <h2>Popular Tracks</h2>
              <div className={style.tracks}>
                {artistTracks.slice(0, 5).map((track, index) => (
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
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className={style.track__image}
                      />
                      <span className={style.track__title}>{track.title}</span>
                    </div>
                    <span className={style.track__plays}>
                      {formatNumber(track.plays || 0)} plays
                    </span>
                    <span className={style.track__duration}>
                      {track.duration}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className={style.discography}>
              <HorizontalScroll title="Albums">
                {artistAlbums.map((album) => (
                  <AlbumCard key={album.id} album={album} onPlay={handlePlay} />
                ))}
              </HorizontalScroll>
            </section>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Artist;

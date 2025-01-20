import React from 'react';
import style from './Album.module.scss';

import { FaSpotify, FaPlay } from 'react-icons/fa';
import { LuDot } from 'react-icons/lu';
import { MdAccessTime } from 'react-icons/md';

// Components

const Album = () => {
  return (
    <div className={style.container}>
      <header className={style.header}>
        <div className={style.header__container}>
          <img
            className={style.header__container__image}
            src="https://picsum.photos/200?random=1"
            alt="Album Cover"
          />
        </div>
        <div className={style.header__info}>
          <span>Playlist</span>
          <h1 className={style.header__info__title}>Album Name</h1>
          <span>Artist 1, Artist 2 and more</span>
          <div className={style.header__info__more}>
            <FaSpotify className={style.header__info__more__logo} />
            <span>Spotify</span>
            <LuDot className={style.header__info__more__icon} />
            <span>50 tracks , about 2h30min</span>
          </div>
        </div>
      </header>
      <main className={style.main}>
        <div className={style.main__header}>
          <div className={style.main__header__container}>
            <button className={style.main__header__container__button}>
              <FaPlay />
            </button>
            <span className={style.main__header__container__title}></span>
          </div>
          <div className={style.main__header__table}>
            <div className={style.main__header__table__flex}>
              <span className={style.main__header__table__item}>#</span>
              <span className={style.main__header__table__item}>Title</span>
            </div>
            <span className={style.main__header__table__item}>Album</span>
            <span className={style.main__header__table__item}>
              Released Date
            </span>
            <span className={style.main__header__table__item}>
              <MdAccessTime />
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Album;

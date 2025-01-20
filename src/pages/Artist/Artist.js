import React from 'react';
import style from './Artist.module.scss';
import ResizableLayout from '../../components/UI/ResizableContainer/ResizableContainer';

// Icons
import { FaPlay } from 'react-icons/fa';

// Components

const Artist = () => {
  return (
    <div className={style.container}>
      <header className={style.header}>
        <div className={style.header__container}>
          <img
            className={style.header__container__image}
            src="https://picsum.photos/200?random=1"
            alt="Artist Cover"
          />
        </div>
        <div className={style.header__info}>
          <span>Artist</span>
          <h1 className={style.header__info__title}>Artist Name</h1>
          <div className={style.header__info__more}>
            <span>5352000 Followers</span>
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
        </div>
      </main>
    </div>
  );
};

export default Artist;

import React, { useState } from 'react';
import style from './Sidebar.module.scss';

import Filter from '../Filter/Filter';

//icons
import { FaPlus } from 'react-icons/fa6';
import { FaArrowRight } from 'react-icons/fa6';
import { FiSearch } from 'react-icons/fi';
import { FaListUl } from 'react-icons/fa6';

const SideBar = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  return (
    <div className={style.sidebar}>
      {/* Header de la sidebar */}
      <header className={style.wrapper}>
        <div className={style.header}>
          <div className={style.header_title}>
            <svg
              data-encore-id="icon"
              role="img"
              aria-hidden="true"
              viewBox="0 0 24 24"
              className={style.icon}
              fill="currentColor"
            >
              <path
                d="M14.5 2.134a1 1 0 0 1 1 0l6 3.464a1 1 0 0 1 .5.866V21a1 1 0 0 1-1 1h-6a1 
          1 0 0 1-1-1V3a1 1 0 0 1 .5-.866zM16 4.732V20h4V7.041l-4-2.309zM3 22a1 1 0 0 1-1-1V3a1 
          1 0 0 1 2 0v18a1 1 0 0 1-1 1zm6 0a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1z"
              ></path>
            </svg>
            <span>Bibliotheque</span>
          </div>
          <div className={style.header_button}>
            <span>
              <FaPlus />
            </span>
            <span>
              <FaArrowRight />
            </span>
          </div>
        </div>
        <div className={style.filters}>
          <Filter filterName="Playlist" />
          <Filter filterName="Album" />
          <Filter filterName="Artist" />
        </div>
      </header>

      {/* Liste des playlists, albums or artist */}
      <div className={style.content}>
        <div className={style.topbar}>
          <div className={style.search}>
            <span className={style.icon_search} onClick={toggleSearch}>
              <FiSearch />
            </span>
            <input
              type="text"
              placeholder="Rechercher dans la bibliotheque"
              className={searchVisible ? style.show : ''}
            />
          </div>
          <div className={style.sort}>
            <span>Recent</span>
            <span className={style.icon_sort}>
              <FaListUl />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;

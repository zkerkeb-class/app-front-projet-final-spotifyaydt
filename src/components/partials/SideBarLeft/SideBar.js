import React, { useState } from 'react';
import style from './Sidebar.module.scss';

import Filter from '../../UI/Filter/Filter';
import Playlist from '../../UI/SideItems/Playlist';
import { mockPlaylists } from '../../../constant/mockData';
import SmallLeftItem from '../../UI/SmallLeftItem/SmallLeft';
import EmptyStateMessage from '../../UI/EmptySidebar/EmptyStateMessage';
//icons
import { FaPlus } from 'react-icons/fa6';
import { FiSearch } from 'react-icons/fi';
import { FaListUl } from 'react-icons/fa6';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';

const SideBar = ({ isCollapsed, setIsCollapsed }) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Playlist');

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const handleFilterChange = (filterName) => {
    setActiveFilter(filterName);
  };

  const toggleCollapse = () => {
    if (setIsCollapsed) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const renderPlaylists = () => {
    if (mockPlaylists.length === 0) {
      return !isCollapsed && <EmptyStateMessage />;
    }

    if (isCollapsed) {
      return mockPlaylists.map((playlist) => (
        <SmallLeftItem key={playlist.id} playlist={playlist} />
      ));
    }

    return mockPlaylists.map((playlist) => (
      <Playlist
        key={playlist.id}
        playlist={playlist}
        onClick={() => console.log('Playlist clicked:', playlist.title)}
        isCollapsed={isCollapsed}
      />
    ));
  };

  return (
    <div className={`${style.sidebar} ${isCollapsed ? style.collapsed : ''}`}>
      <header className={style.wrapper}>
        <div className={style.header}>
          <div className={style.header_title}>
            <div className={style.icon} onClick={toggleCollapse}>
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
            </div>
            {!isCollapsed && <span>Bibliotheque</span>}
          </div>
          <div className={style.header_button}>
            <span onClick={toggleCollapse} className={style.collapse_button}>
              {isCollapsed ? <FaArrowRight /> : <FaArrowLeft />}
            </span>
            {!isCollapsed && (
              <span>
                <FaPlus />
              </span>
            )}
          </div>
        </div>

        {!isCollapsed && (
          <div className={style.filters}>
            <Filter
              filterName="Playlist"
              isActive={activeFilter === 'Playlist'}
              onFilter={handleFilterChange}
            />
            <Filter
              filterName="Album"
              isActive={activeFilter === 'Album'}
              onFilter={handleFilterChange}
            />
            <Filter
              filterName="Artist"
              isActive={activeFilter === 'Artist'}
              onFilter={handleFilterChange}
            />
          </div>
        )}
      </header>

      {/* Liste des playlists, albums or artist */}
      <div className={style.content}>
        {!isCollapsed && (
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
        )}

        <div className={style.list}>{renderPlaylists()}</div>
      </div>
    </div>
  );
};

export default SideBar;

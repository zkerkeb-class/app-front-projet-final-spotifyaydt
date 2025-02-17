import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import style from './Sidebar.module.scss';

import Filter from '../../UI/Filter/Filter';
import Playlist from '../../UI/SideItems/Playlist';
import SmallLeftItem from '../../UI/SmallLeftItem/SmallLeft';
import EmptyStateMessage from '../../UI/EmptySidebar/EmptyStateMessage';
import LoadingSpinner from '../../UI/LoadingSpinner/LoadingSpinner';
import { useApi } from '../../../hooks/useApi';
import { api } from '../../../services/api';

//icons
import { FaPlus } from 'react-icons/fa6';
import { FiSearch } from 'react-icons/fi';
import { FaListUl } from 'react-icons/fa6';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';

const SideBar = ({ isCollapsed, setIsCollapsed }) => {
  const { t } = useTranslation();
  const [searchVisible, setSearchVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Playlist');

  const {
    data: playlists,
    loading: playlistsLoading,
    error: playlistsError,
  } = useApi(() => api.playlists.getAll(), []);

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
    if (playlistsLoading) {
      return (
        !isCollapsed && (
          <div className={style.loading}>
            <LoadingSpinner />
          </div>
        )
      );
    }

    if (playlistsError) {
      return (
        !isCollapsed && (
          <div className={style.error}>
            {t('errors.loadingPlaylists')}: {playlistsError}
          </div>
        )
      );
    }

    if (!playlists || playlists.length === 0) {
      return !isCollapsed && <EmptyStateMessage />;
    }

    if (isCollapsed) {
      return playlists.map((playlist) => (
        <SmallLeftItem key={playlist._id} playlist={playlist} />
      ));
    }

    return playlists.map((playlist) => (
      <Playlist
        key={playlist._id}
        playlist={playlist}
        isCollapsed={isCollapsed}
      />
    ));
  };

  return (
    <div className={`${style.sidebar} ${isCollapsed ? style.collapsed : ''}`}>
      <header className={style.wrapper}>
        <div className={style.header}>
          <div className={style.header_title}>
            <div
              className={style.icon}
              onClick={toggleCollapse}
              title={t('common.toggleSidebar')}
            >
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
            {!isCollapsed && <span>{t('common.library')}</span>}
          </div>
          <div className={style.header_button}>
            <span
              onClick={toggleCollapse}
              className={style.collapse_button}
              title={
                isCollapsed
                  ? t('common.expandSidebar')
                  : t('common.collapseSidebar')
              }
            >
              {isCollapsed ? <FaArrowRight /> : <FaArrowLeft />}
            </span>
            {!isCollapsed && (
              <span title={t('common.createNew')}>
                <FaPlus />
              </span>
            )}
          </div>
        </div>

        {!isCollapsed && (
          <div className={style.filters}>
            <Filter
              filterName={t('filters.playlists')}
              isActive={activeFilter === 'Playlist'}
              onFilter={() => handleFilterChange('Playlist')}
            />
            <Filter
              filterName={t('filters.albums')}
              isActive={activeFilter === 'Album'}
              onFilter={() => handleFilterChange('Album')}
            />
            <Filter
              filterName={t('filters.artists')}
              isActive={activeFilter === 'Artist'}
              onFilter={() => handleFilterChange('Artist')}
            />
          </div>
        )}
      </header>

      <div className={style.content}>
        {!isCollapsed && (
          <div className={style.topbar}>
            <div className={style.search}>
              <span
                className={style.icon_search}
                onClick={toggleSearch}
                title={t('common.searchLibrary')}
              >
                <FiSearch />
              </span>
              <input
                type="text"
                placeholder={t('common.searchInLibrary')}
                className={searchVisible ? style.show : ''}
                aria-label={t('common.searchInLibrary')}
              />
            </div>

            <div className={style.sort}>
              <span>{t('common.recent')}</span>
              <span className={style.icon_sort} title={t('common.sortBy')}>
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

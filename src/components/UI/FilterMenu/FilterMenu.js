import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import style from './FilterMenu.module.scss';
import { FaSort, FaFilter } from 'react-icons/fa';

const FilterMenu = ({ onFilterChange, onSortChange }) => {
  const { t } = useTranslation();
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [filters, setFilters] = useState({
    artist: '',
    album: '',
    genre: '',
    year: '',
    duration: '',
    popularity: '',
  });
  const [sortBy, setSortBy] = useState('');

  const handleFilterClick = () => {
    setShowFilterMenu(!showFilterMenu);
    setShowSortMenu(false);
  };

  const handleSortClick = () => {
    setShowSortMenu(!showSortMenu);
    setShowFilterMenu(false);
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
    onSortChange?.(sortType);
    setShowSortMenu(false);
  };

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      const filterMenu = document.querySelector(`.${style.filter_menu}`);
      if (filterMenu && !filterMenu.contains(event.target)) {
        setShowFilterMenu(false);
        setShowSortMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={style.filter_menu}>
      <div className={style.filter_buttons}>
        <button
          className={`${style.filter_button} ${showFilterMenu ? style.active : ''}`}
          onClick={handleFilterClick}
        >
          <FaFilter /> {t('common.filter')}
        </button>
        <button
          className={`${style.filter_button} ${showSortMenu ? style.active : ''}`}
          onClick={handleSortClick}
        >
          <FaSort /> {t('common.sort')}
        </button>
      </div>

      {showFilterMenu && (
        <div className={style.filter_dropdown}>
          <div className={style.filter_group}>
            <label>{t('search.filter.artist')}</label>
            <input
              type="text"
              value={filters.artist}
              onChange={(e) => handleFilterChange('artist', e.target.value)}
              placeholder={t('search.filter.artist')}
            />
          </div>
          <div className={style.filter_group}>
            <label>{t('search.filter.album')}</label>
            <input
              type="text"
              value={filters.album}
              onChange={(e) => handleFilterChange('album', e.target.value)}
              placeholder={t('search.filter.album')}
            />
          </div>
          <div className={style.filter_group}>
            <label>{t('search.filter.genre')}</label>
            <input
              type="text"
              value={filters.genre}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
              placeholder={t('search.filter.genre')}
            />
          </div>
          <div className={style.filter_group}>
            <label>{t('search.filter.year')}</label>
            <input
              type="text"
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              placeholder={t('search.filter.year')}
            />
          </div>
          <div className={style.filter_group}>
            <label>{t('search.filter.duration.title')}</label>
            <select
              value={filters.duration}
              onChange={(e) => handleFilterChange('duration', e.target.value)}
            >
              <option value="">{t('common.all')}</option>
              <option value="short">{t('search.filter.duration.short')}</option>
              <option value="medium">
                {t('search.filter.duration.medium')}
              </option>
              <option value="long">{t('search.filter.duration.long')}</option>
            </select>
          </div>
          <div className={style.filter_group}>
            <label>{t('search.filter.popularity.title')}</label>
            <select
              value={filters.popularity}
              onChange={(e) => handleFilterChange('popularity', e.target.value)}
            >
              <option value="">{t('common.all')}</option>
              <option value="high">{t('search.filter.popularity.high')}</option>
              <option value="medium">
                {t('search.filter.popularity.medium')}
              </option>
              <option value="low">{t('search.filter.popularity.low')}</option>
            </select>
          </div>
        </div>
      )}

      {showSortMenu && (
        <div className={style.sort_dropdown}>
          <button onClick={() => handleSortChange('duration')}>
            {t('search.sort.duration')}
          </button>
          <button onClick={() => handleSortChange('releaseDate')}>
            {t('search.sort.releaseDate')}
          </button>
          <button onClick={() => handleSortChange('alphabetical')}>
            {t('search.sort.alphabetical')}
          </button>
          <button onClick={() => handleSortChange('popularity')}>
            {t('search.sort.popularity')}
          </button>
        </div>
      )}
    </div>
  );
};

FilterMenu.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
};

export default FilterMenu;

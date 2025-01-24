import React, { useState } from 'react';
import PropTypes from 'prop-types';
import style from './FilterMenu.module.scss';
import { FaSort, FaFilter } from 'react-icons/fa';

const FilterMenu = ({ onFilterChange, onSortChange }) => {
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
    setShowSortMenu(false); // Close sort menu when filter menu is toggled
  };

  const handleSortClick = () => {
    setShowSortMenu(!showSortMenu);
    setShowFilterMenu(false); // Close filter menu when sort menu is toggled
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
    onSortChange(sortType);
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
          <FaFilter /> Filter
        </button>
        <button
          className={`${style.filter_button} ${showSortMenu ? style.active : ''}`}
          onClick={handleSortClick}
        >
          <FaSort /> Sort
        </button>
      </div>

      {showFilterMenu && (
        <div className={style.filter_dropdown}>
          <div className={style.filter_group}>
            <label>Artist</label>
            <input
              type="text"
              value={filters.artist}
              onChange={(e) => handleFilterChange('artist', e.target.value)}
              placeholder="Filter by artist"
            />
          </div>
          <div className={style.filter_group}>
            <label>Album</label>
            <input
              type="text"
              value={filters.album}
              onChange={(e) => handleFilterChange('album', e.target.value)}
              placeholder="Filter by album"
            />
          </div>
          <div className={style.filter_group}>
            <label>Genre</label>
            <input
              type="text"
              value={filters.genre}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
              placeholder="Filter by genre"
            />
          </div>
          <div className={style.filter_group}>
            <label>Year</label>
            <input
              type="number"
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              placeholder="Filter by year"
            />
          </div>
          <div className={style.filter_group}>
            <label>Duration</label>
            <select
              value={filters.duration}
              onChange={(e) => handleFilterChange('duration', e.target.value)}
            >
              <option value="">All</option>
              <option value="short">Short (&lt; 3 min)</option>
              <option value="medium">Medium (3-5 min)</option>
              <option value="long">Long (&gt; 5 min)</option>
            </select>
          </div>
          <div className={style.filter_group}>
            <label>Popularity</label>
            <select
              value={filters.popularity}
              onChange={(e) => handleFilterChange('popularity', e.target.value)}
            >
              <option value="">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      )}

      {showSortMenu && (
        <div className={style.sort_dropdown}>
          <button onClick={() => handleSortChange('duration')}>Duration</button>
          <button onClick={() => handleSortChange('releaseDate')}>
            Release Date
          </button>
          <button onClick={() => handleSortChange('alphabetical')}>
            Alphabetical
          </button>
          <button onClick={() => handleSortChange('popularity')}>
            Popularity
          </button>
          <button onClick={() => handleSortChange('plays')}>
            Number of Plays
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

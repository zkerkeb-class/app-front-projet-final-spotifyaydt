import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import style from './Filter.module.scss';

const Filter = ({ filterName, onFilter, isActive }) => {
  const handleFilter = useCallback(() => {
    if (onFilter) onFilter(filterName);
  }, [onFilter, filterName]);

  return (
    <div className={style.container}>
      <button
        className={`${style.filter} ${isActive ? style.active : ''}`}
        onClick={handleFilter}
        aria-pressed={isActive}
      >
        {filterName}
      </button>
    </div>
  );
};

Filter.propTypes = {
  filterName: PropTypes.string.isRequired,
  onFilter: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
};

Filter.defaultProps = {
  isActive: false,
};

export default memo(Filter);

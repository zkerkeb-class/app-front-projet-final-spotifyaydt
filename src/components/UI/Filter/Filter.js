import React, { memo, useCallback } from 'react';
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

Filter.defaultProps = {
  isActive: false,
};

export default memo(Filter);

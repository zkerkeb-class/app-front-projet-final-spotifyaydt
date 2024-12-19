import React from 'react';
import style from './Filter.module.scss';

const Filter = ({ filterName, onFilter }) => {
  return (
    <div className={style.container}>
      <button className={style.filter} onClick={() => onFilter(filterName)}>
        {filterName}
      </button>
    </div>
  );
};

export default Filter;

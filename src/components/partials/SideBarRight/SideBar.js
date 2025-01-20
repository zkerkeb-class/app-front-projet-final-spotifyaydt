import React from 'react';
import style from './Sidebar.module.scss';

const SideBar = () => {
  return (
    <div className={style.sidebar}>
      <header className={style.wrapper}>
        <div className={style.header}>
          <div className={style.header__title}>
            <h1 className={style.header__title__text}>Music Title</h1>
          </div>
        </div>
      </header>
    </div>
  );
};

export default SideBar;

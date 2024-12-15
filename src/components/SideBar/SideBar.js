import React from 'react';
import style from './Sidebar.module.scss';

const SideBar = () => {
  return (
    <div className={style.sidebar}>
      <nav>
        <ul>
          <li className={style.active}>
            <span>🏠</span> Accueil
          </li>
          <li>
            <span>🔍</span> Rechercher
          </li>
          <li>
            <span>📚</span> Bibliothèque
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;

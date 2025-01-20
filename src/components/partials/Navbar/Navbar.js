import React, { useState } from 'react';
import style from './Navbar.module.scss';
import { useTheme } from '../../../contexts/ThemeContext';

//icons
import { FiSearch } from 'react-icons/fi';
import { GrHomeRounded } from 'react-icons/gr';
import { FaSpotify } from 'react-icons/fa';
import { PiSunDimFill } from 'react-icons/pi';
import { PiMoonFill } from 'react-icons/pi';
import { HiMiniUserGroup } from 'react-icons/hi2';
import { FaUserNinja, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { FaGlobe } from 'react-icons/fa';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const avatarUrl = `https://picsum.photos/200?random=1`;

  const [language, setLanguage] = useState('ENG');

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <div className={style.container}>
      <div className={style.navigation_buttons}>
        <div className={style.logo}>
          <div className={style.logo_icon}>
            <FaSpotify />
          </div>
          <span>Spotify AYDT</span>
        </div>
        <div className={style.nav_button}>
          <button className={style.nav_buttons}>
            <FaChevronLeft />
          </button>
          <button className={style.nav_buttons}>
            <FaChevronRight />
          </button>
        </div>
      </div>
      <div className={style.middle_cont}>
        <div className={style.nav_large_button}>
          <GrHomeRounded className={style.middle_cont_icon} />
        </div>
        <div className={style.search_bar}>
          <div className={style.search_wrapper}>
            <span className={style.search_icon}>
              <FiSearch />
            </span>
            <input
              type="text"
              placeholder="Que souhaitez-vous écouter ?"
              className={style.search_input}
            />
          </div>
        </div>
      </div>
      <div className={style.user_controls}>
        <button onClick={toggleTheme} className={style.theme_toggle}>
          {isDarkMode ? (
            <PiSunDimFill className={style.toggle_icon} />
          ) : (
            <PiMoonFill className={style.toggle_icon} />
          )}
        </button>
        <button className={style.user_button}>
          <HiMiniUserGroup className={style.user_icon} />
        </button>
        <div className={style.language_selector}>
          <FaGlobe aria-hidden="true" />
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            <option value="FR">FR</option>
            <option value="EN">EN</option>
            <option value="AR">AR</option>
          </select>
        </div>
        <div className={style.avatar_button}>
          <img src={avatarUrl} alt="avatar" className={style.avatar} />
          <FaUserNinja className={style.avatar} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

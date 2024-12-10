import React, { useState } from 'react';
import style from './Navbar.module.scss';
import { useTheme } from '../../contexts/ThemeContext';

//icons
import { FiSearch } from 'react-icons/fi';
import { GrHomeRounded } from 'react-icons/gr';
import { FaSpotify } from 'react-icons/fa';
import { PiSunDimFill } from 'react-icons/pi';
import { PiMoonFill } from 'react-icons/pi';
import { HiMiniUserGroup } from 'react-icons/hi2';
import { IoMdNotifications } from 'react-icons/io';
import { FaUserNinja } from 'react-icons/fa6';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [hasNotification, setHasNotification] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  const addNotification = () => {
    setHasNotification(true);
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
        <button className={style.user_button} onClick={addNotification}>
          <IoMdNotifications className={style.user_icon} />
          {hasNotification ? (
            <span className={style.notification_dot}></span>
          ) : null}
        </button>
        <button className={style.user_button}>
          <HiMiniUserGroup className={style.user_icon} />
        </button>
        <div className={style.avatar_button}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className={style.avatar} />
          ) : (
            <FaUserNinja className={style.avatar} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

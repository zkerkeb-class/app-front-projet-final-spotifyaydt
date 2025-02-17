import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './MobileNavBar.module.scss';
import { IoHomeOutline, IoHome } from 'react-icons/io5';
import { IoSearchOutline, IoSearch } from 'react-icons/io5';
import { IoLibraryOutline, IoLibrary } from 'react-icons/io5';

const MobileNavBar = ({ onLibraryClick, isLibraryVisible }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path) => {
    if (path === '/library') {
      return isLibraryVisible;
    }
    return location.pathname === path && !isLibraryVisible;
  };

  const handleNavigation = (path) => {
    if (path === '/library') {
      // Toggle library visibility
      onLibraryClick(!isLibraryVisible);
      return;
    }

    // If library is visible, close it
    if (isLibraryVisible) {
      onLibraryClick(false);
    }

    // Navigate to the new path
    navigate(path);
  };

  return (
    <nav className={styles.mobile_nav}>
      <button
        className={`${styles.nav_item} ${isActive('/') ? styles.active : ''}`}
        onClick={() => handleNavigation('/')}
        aria-label={t('common.home')}
      >
        {isActive('/') ? <IoHome /> : <IoHomeOutline />}
        <span>{t('common.home')}</span>
      </button>

      <button
        className={`${styles.nav_item} ${isActive('/search') ? styles.active : ''}`}
        onClick={() => handleNavigation('/search')}
        aria-label={t('common.search')}
      >
        {isActive('/search') ? <IoSearch /> : <IoSearchOutline />}
        <span>{t('common.search')}</span>
      </button>

      <button
        className={`${styles.nav_item} ${isActive('/library') ? styles.active : ''}`}
        onClick={() => handleNavigation('/library')}
        aria-label={t('common.library')}
      >
        {isActive('/library') ? <IoLibrary /> : <IoLibraryOutline />}
        <span>{t('common.library')}</span>
      </button>
    </nav>
  );
};

export default MobileNavBar;

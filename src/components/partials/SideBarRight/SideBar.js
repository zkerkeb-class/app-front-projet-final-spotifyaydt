import React from 'react';
import { useTranslation } from 'react-i18next';
import style from './Sidebar.module.scss';
import { IoClose } from 'react-icons/io5';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';

import NowPlaying from './NowPlaying';
import Queue from './Queue';
import Devices from './Devices';
import Jam from '../Jam/Jam';

const SideBar = () => {
  const { t } = useTranslation();
  const {
    displayPlay,
    displayQueue,
    displayDevices,
    displayJam,
    closeSidebar,
    toggleJam,
  } = useAudioPlayer();

  // Don't render if nothing to display
  if (!displayPlay && !displayQueue && !displayDevices && !displayJam) {
    return null;
  }

  const handleClose = () => {
    closeSidebar();
  };

  const getCurrentTitle = () => {
    if (displayPlay) return t('player.nowPlaying');
    if (displayQueue) return t('player.queue');
    if (displayDevices) return t('player.connectDevice');
    if (displayJam) return t('jamSession.title');
    return '';
  };

  const getCurrentComponent = () => {
    if (displayPlay) return <NowPlaying />;
    if (displayQueue) return <Queue />;
    if (displayDevices) return <Devices />;
    if (displayJam) return <Jam onClose={toggleJam} />;
    return null;
  };

  return (
    <div className={style.sidebar}>
      <header className={style.wrapper}>
        <div className={style.header}>
          <div className={style.header__title}>
            <h1 className={style.header__title__text}>{getCurrentTitle()}</h1>
          </div>
          <button
            className={style.header__button}
            onClick={handleClose}
            aria-label={t('common.closeSidebar')}
          >
            <IoClose />
          </button>
        </div>
      </header>

      <div className={style.content}>{getCurrentComponent()}</div>
    </div>
  );
};

export default SideBar;
